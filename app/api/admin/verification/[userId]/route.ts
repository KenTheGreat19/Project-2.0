import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// PATCH /api/admin/verification/:userId - Approve or reject verification
export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { action, reason } = body // action: "APPROVE" or "REJECT"

    if (!action || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: params.userId },
      data: {
        verificationStatus: action === "APPROVE" ? "APPROVED" : "REJECTED",
        isVerified: action === "APPROVE",
      },
    })

    // Notify user
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: "verification_status_changed",
        title: `Verification ${action === "APPROVE" ? "Approved" : "Rejected"}`,
        message:
          action === "APPROVE"
            ? "Your employer account has been verified!"
            : `Your verification was rejected. Reason: ${reason || "Not provided"}`,
        link: "/employer/profile",
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating verification:", error)
    return NextResponse.json({ error: "Failed to update verification" }, { status: 500 })
  }
}
