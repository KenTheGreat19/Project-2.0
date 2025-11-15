import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET - Fetch application analytics for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "APPLICANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id

    // Get or create application stats
    let stats = await prisma.applicationStats.findUnique({
      where: { userId },
    })

    if (!stats) {
      // Calculate initial stats
      const applications = await prisma.application.findMany({
        where: { applicantId: userId },
        include: { job: true },
      })

      const totalApplications = applications.length
      const pendingApplications = applications.filter(a => a.status === "pending").length
      const rejectedApplications = applications.filter(a => a.status === "rejected").length
      const acceptedApplications = applications.filter(a => a.status === "accepted").length

      // Calculate response time (average days between application and status change)
      const respondedApplications = applications.filter(a => a.status !== "pending")
      const averageResponseTime = respondedApplications.length > 0
        ? respondedApplications.reduce((sum, app: any) => {
            const responseTime = (app.updatedAt.getTime() - app.appliedAt.getTime()) / (1000 * 60 * 60 * 24)
            return sum + responseTime
          }, 0) / respondedApplications.length
        : 0

      // Calculate rates
      const interviewRate = totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0
      const offerRate = totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0

      // Get recent activity
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const weeklyApplications = applications.filter(a => a.appliedAt >= oneWeekAgo).length
      const monthlyApplications = applications.filter(a => a.appliedAt >= oneMonthAgo).length

      // Find best performing categories
      const categoryStats: { [key: string]: { applied: number; accepted: number } } = {}
      const typeStats: { [key: string]: { applied: number; accepted: number } } = {}
      const locationStats: { [key: string]: { applied: number; accepted: number } } = {}

      applications.forEach(app => {
        const category = app.job.category || "Uncategorized"
        const type = app.job.type
        const location = app.job.location || "Unknown"

        if (!categoryStats[category]) categoryStats[category] = { applied: 0, accepted: 0 }
        if (!typeStats[type]) typeStats[type] = { applied: 0, accepted: 0 }
        if (!locationStats[location]) locationStats[location] = { applied: 0, accepted: 0 }

        categoryStats[category].applied++
        typeStats[type].applied++
        locationStats[location].applied++

        if (app.status === "accepted") {
          categoryStats[category].accepted++
          typeStats[type].accepted++
          locationStats[location].accepted++
        }
      })

      // Find best performers
      const bestCategory = Object.entries(categoryStats)
        .sort((a, b) => (b[1].accepted / b[1].applied) - (a[1].accepted / a[1].applied))
        [0]?.[0] || null

      const bestJobType = Object.entries(typeStats)
        .sort((a, b) => (b[1].accepted / b[1].applied) - (a[1].accepted / a[1].applied))
        [0]?.[0] || null

      const bestLocation = Object.entries(locationStats)
        .sort((a, b) => (b[1].accepted / b[1].applied) - (a[1].accepted / a[1].applied))
        [0]?.[0] || null

      const lastApplicationDate = applications.length > 0
        ? applications.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime())[0].appliedAt
        : null

      // Create stats record
      stats = await prisma.applicationStats.create({
        data: {
          userId,
          totalApplications,
          pendingApplications,
          rejectedApplications,
          acceptedApplications,
          averageResponseTime,
          interviewRate,
          offerRate,
          weeklyApplications,
          monthlyApplications,
          bestCategory,
          bestJobType,
          bestLocation,
          lastApplicationDate,
        },
      })
    }

    // Get detailed application history for chart
    const applications = await prisma.application.findMany({
      where: { applicantId: userId },
      include: { job: { select: { title: true, company: true, category: true, type: true, location: true } } },
      orderBy: { appliedAt: "desc" },
      take: 50,
    })

    // Group by week for trending chart
    const weeklyData: { [key: string]: number } = {}
    applications.forEach(app => {
      const weekStart = new Date(app.appliedAt)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1
    })

    return NextResponse.json({
      stats,
      recentApplications: applications.slice(0, 10),
      weeklyTrend: Object.entries(weeklyData).map(([date, count]) => ({ date, count })).slice(0, 12),
    })
  } catch (error) {
    console.error("Error fetching application analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
