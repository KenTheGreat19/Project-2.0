import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET - Get all jobs for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    const adminEmail = process.env.ADMIN_EMAIL
    if (!session?.user || session.user.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        employer: {
          select: { name: true, email: true, companyName: true }
        },
        _count: {
          select: { applications: true }
        }
      }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching admin jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}
