import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST - Like a job
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      )
    }

    const { jobId } = await request.json()

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, likesCount: true },
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Check if already liked
    const existingLike = await prisma.jobLike.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId: user.id,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json(
        { error: "You already liked this job" },
        { status: 400 }
      )
    }

    // Create like and update counts
    await prisma.$transaction([
      prisma.jobLike.create({
        data: {
          jobId,
          userId: user.id,
        },
      }),
      prisma.job.update({
        where: { id: jobId },
        data: {
          likesCount: { increment: 1 },
          engagementScore: { increment: 2 }, // likes × 2
        },
      }),
    ])

    return NextResponse.json({ message: "Job liked successfully" })
  } catch (error) {
    console.error("Error liking job:", error)
    return NextResponse.json(
      { error: "Failed to like job" },
      { status: 500 }
    )
  }
}

// DELETE - Unlike a job
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if like exists
    const existingLike = await prisma.jobLike.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId: user.id,
        },
      },
    })

    if (!existingLike) {
      return NextResponse.json(
        { error: "You haven't liked this job" },
        { status: 400 }
      )
    }

    // Delete like and update counts
    await prisma.$transaction([
      prisma.jobLike.delete({
        where: {
          jobId_userId: {
            jobId,
            userId: user.id,
          },
        },
      }),
      prisma.job.update({
        where: { id: jobId },
        data: {
          likesCount: { decrement: 1 },
          engagementScore: { decrement: 2 }, // likes × 2
        },
      }),
    ])

    return NextResponse.json({ message: "Job unliked successfully" })
  } catch (error) {
    console.error("Error unliking job:", error)
    return NextResponse.json(
      { error: "Failed to unlike job" },
      { status: 500 }
    )
  }
}

// GET - Check if user liked a job and get like status
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      )
    }

    if (!session?.user?.email) {
      return NextResponse.json({ liked: false })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ liked: false })
    }

    const like = await prisma.jobLike.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId: user.id,
        },
      },
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json({ liked: false })
  }
}
