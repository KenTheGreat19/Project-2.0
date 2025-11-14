import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/employer/interviews/availability - Get availability settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const availability = await prisma.interviewAvailability.findMany({
      where: {
        userId: (session.user as any).id,
        isActive: true,
      },
      orderBy: {
        dayOfWeek: "asc",
      },
    })

    const exceptions = await prisma.interviewException.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json({ availability, exceptions })
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}

// POST /api/employer/interviews/availability - Set availability
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { dayOfWeek, startTime, endTime } = body

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if availability already exists
    const existing = await prisma.interviewAvailability.findFirst({
      where: {
        userId: (session.user as any).id,
        dayOfWeek,
        startTime,
        endTime,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "This availability already exists" },
        { status: 400 }
      )
    }

    const availability = await prisma.interviewAvailability.create({
      data: {
        userId: (session.user as any).id,
        dayOfWeek,
        startTime,
        endTime,
      },
    })

    return NextResponse.json(availability, { status: 201 })
  } catch (error) {
    console.error("Error creating availability:", error)
    return NextResponse.json(
      { error: "Failed to create availability" },
      { status: 500 }
    )
  }
}

// DELETE /api/employer/interviews/availability?id=xxx - Delete availability
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const availabilityId = searchParams.get("id")

    if (!availabilityId) {
      return NextResponse.json(
        { error: "Availability ID is required" },
        { status: 400 }
      )
    }

    // Check if availability belongs to user
    const availability = await prisma.interviewAvailability.findFirst({
      where: {
        id: availabilityId,
        userId: (session.user as any).id,
      },
    })

    if (!availability) {
      return NextResponse.json(
        { error: "Availability not found or unauthorized" },
        { status: 404 }
      )
    }

    await prisma.interviewAvailability.delete({
      where: { id: availabilityId },
    })

    return NextResponse.json({ message: "Availability deleted successfully" })
  } catch (error) {
    console.error("Error deleting availability:", error)
    return NextResponse.json(
      { error: "Failed to delete availability" },
      { status: 500 }
    )
  }
}

