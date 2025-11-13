import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { jobId } = await request.json()

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        employer: {
          select: { name: true, email: true, companyName: true }
        }
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@applynhire.com"

    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 })
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "ApplyNHire <noreply@applynhire.com>",
      to: adminEmail,
      subject: `New Job Posted: ${job.title} at ${job.company}`,
      html: `
        <h2>New Job Submission</h2>
        <p>A new job has been posted and needs your approval.</p>
        
        <h3>Job Details:</h3>
        <ul>
          <li><strong>Title:</strong> ${job.title}</li>
          <li><strong>Company:</strong> ${job.company}</li>
          <li><strong>Location:</strong> ${job.location}</li>
          <li><strong>Type:</strong> ${job.type}</li>
          <li><strong>Employer:</strong> ${job.employer.name} (${job.employer.email})</li>
        </ul>
        
        <p><strong>Description:</strong></p>
        <p>${job.description.substring(0, 200)}...</p>
        
        <p><strong>Apply URL:</strong> <a href="${job.applyUrl}">${job.applyUrl}</a></p>
        
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="background-color: #0A66C2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Review in Admin Panel
          </a>
        </p>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
