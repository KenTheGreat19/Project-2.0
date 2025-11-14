import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/employer/team - List all team members
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        employerId: (session.user as any).id,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    )
  }
}

// POST /api/employer/team - Invite a new team member
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { email, name, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ["admin", "recruiter", "hiring_manager", "viewer"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Check if member already exists
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        employerId: (session.user as any).id,
        email,
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "Team member with this email already exists" },
        { status: 400 }
      )
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        employerId: (session.user as any).id,
        email,
        name,
        role,
      },
    })

    // TODO: Send invitation email

    return NextResponse.json(teamMember, { status: 201 })
  } catch (error) {
    console.error("Error inviting team member:", error)
    return NextResponse.json(
      { error: "Failed to invite team member" },
      { status: 500 }
    )
  }
}

// PATCH /api/employer/team?id=xxx - Update team member
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get("id")
    const body = await req.json()

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      )
    }

    // Check if member belongs to user
    const member = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        employerId: (session.user as any).id,
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: "Team member not found or unauthorized" },
        { status: 404 }
      )
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: memberId },
      data: body,
    })

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    )
  }
}

// DELETE /api/employer/team?id=xxx - Remove team member
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get("id")

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      )
    }

    // Check if member belongs to user
    const member = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        employerId: (session.user as any).id,
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: "Team member not found or unauthorized" },
        { status: 404 }
      )
    }

    await prisma.teamMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ message: "Team member removed successfully" })
  } catch (error) {
    console.error("Error removing team member:", error)
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    )
  }
}

