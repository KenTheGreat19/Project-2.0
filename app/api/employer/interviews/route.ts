import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/employer/interviews - List all interviews for employer
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const jobId = searchParams.get("jobId")

    const interviews = await prisma.interview.findMany({
      where: {
        createdBy: (session.user as any).id,
        ...(status && { status }),
        ...(jobId && { jobId }),
      },
      orderBy: {
        scheduledAt: "asc",
      },
    })

    return NextResponse.json(interviews)
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    )
  }
}

// POST /api/employer/interviews - Create a new interview
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      jobId,
      candidateId,
      candidateName,
      candidateEmail,
      scheduledAt,
      duration,
      interviewType,
      notes,
      meetingLink,
      location,
    } = body

    if (!candidateName || !candidateEmail || !scheduledAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const interview = await prisma.interview.create({
      data: {
        jobId: jobId || "",
        candidateId: candidateId || "",
        candidateName,
        candidateEmail,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 60,
        interviewType: interviewType || "phone",
        notes,
        meetingLink,
        location,
        createdBy: (session.user as any).id,
      },
    })

    return NextResponse.json(interview, { status: 201 })
  } catch (error) {
    console.error("Error creating interview:", error)
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    )
  }
}

// PATCH /api/employer/interviews?id=xxx - Update interview status
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const interviewId = searchParams.get("id")
    const body = await req.json()

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      )
    }

    // Check if interview belongs to user
    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        createdBy: (session.user as any).id,
      },
    })

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found or unauthorized" },
        { status: 404 }
      )
    }

    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: body,
    })

    return NextResponse.json(updatedInterview)
  } catch (error) {
    console.error("Error updating interview:", error)
    return NextResponse.json(
      { error: "Failed to update interview" },
      { status: 500 }
    )
  }
}

// DELETE /api/employer/interviews?id=xxx - Delete an interview
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const interviewId = searchParams.get("id")

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      )
    }

    // Check if interview belongs to user
    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        createdBy: (session.user as any).id,
      },
    })

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found or unauthorized" },
        { status: 404 }
      )
    }

    await prisma.interview.delete({
      where: { id: interviewId },
    })

    return NextResponse.json({ message: "Interview deleted successfully" })
  } catch (error) {
    console.error("Error deleting interview:", error)
    return NextResponse.json(
      { error: "Failed to delete interview" },
      { status: 500 }
    )
  }
}

