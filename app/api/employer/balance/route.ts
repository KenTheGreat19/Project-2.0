import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/employer/balance - Get employer balance and transaction history
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    if (userRole !== "EMPLOYER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        adBalance: true,
        balanceTransactions: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}

// POST /api/employer/balance/topup - Add balance to employer account
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    if (userRole !== "EMPLOYER" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { amount, targetUserId } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be positive" },
        { status: 400 }
      )
    }

    // Admin can top up other accounts
    const targetId = userRole === "ADMIN" && targetUserId ? targetUserId : userId

    const user = await prisma.user.findUnique({
      where: { id: targetId },
      select: { adBalance: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const balanceBefore = user.adBalance
    const balanceAfter = balanceBefore + amount

    // Update balance
    await prisma.user.update({
      where: { id: targetId },
      data: { adBalance: balanceAfter },
    })

    // Record transaction
    const transaction = await prisma.balanceTransaction.create({
      data: {
        userId: targetId,
        amount,
        type: "topup",
        description: userRole === "ADMIN" 
          ? `Admin top-up by ${(session.user as any).name}`
          : "Balance top-up",
        balanceBefore,
        balanceAfter,
      },
    })

    // Send notification
    await prisma.notification.create({
      data: {
        userId: targetId,
        type: "balance_topup",
        title: "Balance Added",
        message: `$${amount.toFixed(2)} has been added to your account. New balance: $${balanceAfter.toFixed(2)}`,
        link: "/employer/dashboard",
      },
    })

    return NextResponse.json({
      success: true,
      transaction,
      newBalance: balanceAfter,
    })
  } catch (error) {
    console.error("Error adding balance:", error)
    return NextResponse.json({ error: "Failed to add balance" }, { status: 500 })
  }
}
