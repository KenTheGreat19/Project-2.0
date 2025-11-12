import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/badges - Get all badge types or user badges
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (userId) {
      // Get badges for a specific user
      const userBadges = await prisma.userBadge.findMany({
        where: { userId },
        include: {
          badge: true,
        },
        orderBy: {
          earnedAt: "desc",
        },
      })

      return NextResponse.json(userBadges)
    }

    // Get all badge types
    const badges = await prisma.badge.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(badges)
  } catch (error) {
    console.error("Error fetching badges:", error)
    return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 })
  }
}
