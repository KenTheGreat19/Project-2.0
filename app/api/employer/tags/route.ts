import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/employer/tags - List all tags for employer
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const tags = await prisma.jobTag.findMany({
      where: {
        createdBy: (session.user as any).id,
        name: {
          contains: search,
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    )
  }
}

// POST /api/employer/tags - Create a new tag
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, color, description } = body

    if (!name) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      )
    }

    // Check if tag already exists
    const existingTag = await prisma.jobTag.findFirst({
      where: {
        createdBy: (session.user as any).id,
        name: {
          equals: name,
        },
      },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag with this name already exists" },
        { status: 400 }
      )
    }

    const tag = await prisma.jobTag.create({
      data: {
        name,
        color: color || "#3b82f6",
        description,
        createdBy: (session.user as any).id,
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    )
  }
}

// DELETE /api/employer/tags?id=xxx - Delete a tag
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tagId = searchParams.get("id")

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      )
    }

    // Check if tag belongs to user
    const tag = await prisma.jobTag.findFirst({
      where: {
        id: tagId,
        createdBy: (session.user as any).id,
      },
    })

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found or unauthorized" },
        { status: 404 }
      )
    }

    await prisma.jobTag.delete({
      where: { id: tagId },
    })

    return NextResponse.json({ message: "Tag deleted successfully" })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    )
  }
}

