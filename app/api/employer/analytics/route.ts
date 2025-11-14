import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/employer/analytics - Get employer analytics overview
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "30" // days

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get employer's jobs
    const employerId = (session.user as any).id
    const jobs = await prisma.job.findMany({
      where: {
        employerId,
      },
      include: {
        applications: true,
        impressions: {
          where: {
            createdAt: {
              gte: startDate,
            },
          },
        },
      },
    })

    // Calculate metrics
    const totalJobs = jobs.length
    const activeJobs = jobs.filter(j => j.status === "approved").length
    
    const totalImpressions = jobs.reduce((sum, job) => sum + job.impressions.length, 0)
    const totalViews = jobs.reduce((sum, job) => sum + job.viewsCount, 0)
    const totalApplications = jobs.reduce((sum, job) => sum + job.applications.length, 0)
    
    const conversionRate = totalViews > 0 
      ? ((totalApplications / totalViews) * 100).toFixed(2)
      : "0.00"

    // Get previous period for trends
    const prevStartDate = new Date()
    prevStartDate.setDate(prevStartDate.getDate() - parseInt(period) * 2)
    prevStartDate.setHours(0, 0, 0, 0)
    const prevEndDate = new Date(startDate)

    const prevImpressions = await prisma.jobImpression.count({
      where: {
        job: {
          employerId,
        },
        createdAt: {
          gte: prevStartDate,
          lt: prevEndDate,
        },
      },
    })

    const impressionsTrend = prevImpressions > 0
      ? (((totalImpressions - prevImpressions) / prevImpressions) * 100).toFixed(1)
      : "0"

    // Top performing jobs
    const topJobs = jobs
      .map(job => ({
        id: job.id,
        title: job.title,
        applications: job.applications.length,
        views: job.viewsCount,
        impressions: job.impressions.length,
        conversionRate: job.viewsCount > 0 
          ? ((job.applications.length / job.viewsCount) * 100).toFixed(1)
          : "0",
      }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 10)

    // Applications over time (daily for last 30 days)
    const applicationsOverTime = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const count = await prisma.application.count({
        where: {
          job: {
            employerId,
          },
          appliedAt: {
            gte: date,
            lt: nextDate,
          },
        },
      })

      applicationsOverTime.push({
        date: date.toISOString().split('T')[0],
        count,
      })
    }

    return NextResponse.json({
      overview: {
        totalJobs,
        activeJobs,
        impressions: totalImpressions,
        views: totalViews,
        applications: totalApplications,
        conversionRate: parseFloat(conversionRate),
        impressionsTrend: parseFloat(impressionsTrend),
      },
      topJobs,
      applicationsOverTime,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
