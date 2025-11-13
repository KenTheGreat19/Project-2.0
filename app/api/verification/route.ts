import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/verification/documents - Get all pending verifications (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") || "PENDING"

    const users = await prisma.user.findMany({
      where: {
        role: "EMPLOYER",
        verificationStatus: status,
      },
      include: {
        verificationDocs: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching verification documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

// POST /api/verification/submit - Submit verification documents
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const { documentType, documentUrl } = body

    if (!documentType || !documentUrl) {
      return NextResponse.json(
        { error: "Document type and URL required" },
        { status: 400 }
      )
    }

    // Create verification document
    const doc = await prisma.verificationDocument.create({
      data: {
        userId,
        documentType,
        documentUrl,
      },
    })

    // Update user verification status to PENDING if not already
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: "PENDING",
      },
    })

    // Create admin notification
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
    })

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "verification_pending",
          title: "New verification submission",
          message: `${(await prisma.user.findUnique({ where: { id: userId } }))?.name} submitted verification documents`,
          link: "/admin/verifications",
        },
      })
    }

    return NextResponse.json(doc, { status: 201 })
  } catch (error) {
    console.error("Error submitting verification:", error)
    return NextResponse.json({ error: "Failed to submit verification" }, { status: 500 })
  }
}
