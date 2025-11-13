import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/saved-jobs - Get user's saved jobs
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            employer: {
              select: {
                name: true,
                companyName: true,
                averageRating: true,
              },
            },
            _count: {
              select: {
                applications: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(savedJobs)
  } catch (error) {
    console.error("Error fetching saved jobs:", error)
    return NextResponse.json({ error: "Failed to fetch saved jobs" }, { status: 500 })
  }
}

// POST /api/saved-jobs - Save a job
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { jobId } = await req.json()

    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 })
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if already saved
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Job already saved" }, { status: 400 })
    }

    // Save job
    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
      },
      include: {
        job: true,
      },
    })

    return NextResponse.json(savedJob, { status: 201 })
  } catch (error) {
    console.error("Error saving job:", error)
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 })
  }
}

// DELETE /api/saved-jobs - Unsave a job
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 })
    }

    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing saved job:", error)
    return NextResponse.json({ error: "Failed to remove saved job" }, { status: 500 })
  }
}
