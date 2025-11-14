import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH /api/employer/tags/[id] - Update a tag
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tagId = params.id
    const body = await req.json()
    const { name, color, description } = body

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

    const updatedTag = await prisma.jobTag.update({
      where: { id: tagId },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(description !== undefined && { description }),
      },
    })

    return NextResponse.json(updatedTag)
  } catch (error) {
    console.error("Error updating tag:", error)
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    )
  }
}
