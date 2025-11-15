import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const applicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
})

// GET - Get all applications for logged-in applicant
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    if (userRole !== "APPLICANT") {
      return NextResponse.json({ error: "Only applicants can access this endpoint" }, { status: 403 })
    }

    const applications = await prisma.application.findMany({
      where: { applicantId: userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            type: true,
            applyUrl: true,
            status: true,
            employerId: true,
            employer: {
              select: {
                name: true,
                companyName: true,
              },
            },
          }
        }
      },
      orderBy: { appliedAt: "desc" },
      take: 100, // Limit results
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json(
      { error: "Failed to fetch applications", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// POST - Create new application
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    if (userRole !== "APPLICANT") {
      return NextResponse.json({ error: "Only applicants can apply to jobs" }, { status: 403 })
    }

    const body = await request.json()
    const { jobId } = applicationSchema.parse(body)

    // Check if job exists and is approved
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        status: true,
        acceptApplicationsHere: true,
        employerId: true,
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (job.status !== "approved") {
      return NextResponse.json({ error: "This job is not available for applications" }, { status: 400 })
    }

    if (!job.acceptApplicationsHere) {
      return NextResponse.json({ error: "This job does not accept applications through the platform" }, { status: 400 })
    }

    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: {
        jobId,
        applicantId: userId,
      },
    })

    if (existing) {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 400 })
    }

    // Create application and increment applicationsCount
    const application = await prisma.application.create({
      data: {
        jobId,
        applicantId: userId,
        status: "pending",
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            type: true,
            employer: {
              select: {
                name: true,
                email: true,
                companyName: true,
              },
            },
          },
        },
        applicant: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Increment applications count
    await prisma.job.update({
      where: { id: jobId },
      data: { applicationsCount: { increment: 1 } },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating application:", error)
    return NextResponse.json(
      { error: "Failed to create application", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
