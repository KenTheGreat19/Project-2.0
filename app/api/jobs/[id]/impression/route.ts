import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST /api/jobs/[id]/impression - Track job view count
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: jobId, status: "approved" },
      select: {
        id: true,
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Increment views count
    await prisma.job.update({
      where: { id: jobId },
      data: { viewsCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking view:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}
