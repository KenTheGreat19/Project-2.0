import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { jobId, reason } = await request.json()

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

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "ApplyNHire <noreply@applynhire.com>",
      to: job.employer.email,
      subject: `Your Job Posting Requires Changes`,
      html: `
        <h2>Job Posting Update Required</h2>
        <p>Hi ${job.employer.name},</p>
        
        <p>Thank you for submitting your job posting. Unfortunately, it requires some changes before it can be approved.</p>
        
        <h3>Job Details:</h3>
        <ul>
          <li><strong>Title:</strong> ${job.title}</li>
          <li><strong>Company:</strong> ${job.company}</li>
        </ul>
        
        <h3>Reason for Rejection:</h3>
        <p style="background-color: #fee; border-left: 4px solid #f00; padding: 10px;">${reason || "Please review your job posting and ensure it meets our guidelines."}</p>
        
        <h3>Next Steps:</h3>
        <p>Please make the necessary changes and resubmit your job posting through your employer dashboard.</p>
        
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/employer/dashboard" style="background-color: #0A66C2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </p>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Thank you for using ApplyNHire!</p>
        
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
