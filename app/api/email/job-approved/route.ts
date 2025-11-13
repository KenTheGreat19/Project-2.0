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
          select: { name: true, email: true }
        }
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 })
    }

    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 })
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "ApplyNHire <noreply@applynhire.com>",
      to: job.employer.email,
      subject: `Great News! Your Job Posting is Now Live`,
      html: `
        <h2>Congratulations! 🎉</h2>
        <p>Hi ${job.employer.name},</p>
        
        <p>Your job posting has been <strong>approved</strong> and is now live on ApplyNHire!</p>
        
        <h3>Job Details:</h3>
        <ul>
          <li><strong>Title:</strong> ${job.title}</li>
          <li><strong>Company:</strong> ${job.company}</li>
          <li><strong>Location:</strong> ${job.location}</li>
          <li><strong>Type:</strong> ${job.type}</li>
        </ul>
        
        <p>Candidates can now view and apply to your job posting.</p>
        
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.id}" style="background-color: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">
            View Job Posting
          </a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/employer/dashboard" style="background-color: #0A66C2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </p>
        
        <p>Thank you for using ApplyNHire - 100% Free Forever!</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          ApplyNHire - Free Job Portal<br>
          © 2025 ApplyNHire. All rights reserved.
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
