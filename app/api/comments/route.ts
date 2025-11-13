import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/comments?jobId=xxx - Get public comments for a job
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 })
    }

    const comments = await prisma.publicComment.findMany({
      where: {
        jobId,
        isVisible: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
            averageRating: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Hide names for anonymous comments
    const commentsWithAnonymity = comments.map(comment => ({
      ...comment,
      showName: !comment.isAnonymous,
    }))

    return NextResponse.json(commentsWithAnonymity)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

// POST /api/comments - Submit a public comment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    
    // Only applicants can post comments
    if (userRole !== "APPLICANT") {
      return NextResponse.json(
        { error: "Only applicants can post comments" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { jobId, title, comment, rating, isAnonymous } = body

    if (!jobId || !comment) {
      return NextResponse.json(
        { error: "jobId and comment required" },
        { status: 400 }
      )
    }

    // Verify job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Create comment with anonymous flag
    const publicComment = await prisma.publicComment.create({
      data: {
        jobId,
        authorId: (session.user as any).id,
        title,
        comment,
        rating: rating ? Math.min(5, Math.max(1, rating)) : undefined,
        isVisible: true,
        isAnonymous: isAnonymous || false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
          },
        },
      },
    })

    // If anonymous, hide the name in the response
    const response = {
      ...publicComment,
      showName: !isAnonymous,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
