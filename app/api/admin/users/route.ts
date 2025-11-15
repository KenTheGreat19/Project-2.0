import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET - Get all users for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    const adminEmail = process.env.ADMIN_EMAIL
    if (!session?.user || session.user.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        location: true,
        isVerified: true,
        verificationStatus: true,
        averageRating: true,
        totalReviews: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
          }
        }
      },
      take: 500,
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
