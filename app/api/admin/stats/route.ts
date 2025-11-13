import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET - Get comprehensive admin statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    const adminEmail = process.env.ADMIN_EMAIL
    if (!session?.user || session.user.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current month and previous month dates
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Total jobs with month-over-month change
    const totalJobs = await prisma.job.count()
    const jobsThisMonth = await prisma.job.count({
      where: { createdAt: { gte: currentMonthStart } }
    })
    const jobsLastMonth = await prisma.job.count({
      where: { 
        createdAt: { 
          gte: previousMonthStart,
          lte: previousMonthEnd
        }
      }
    })
    const jobsChange = jobsLastMonth > 0 
      ? ((jobsThisMonth - jobsLastMonth) / jobsLastMonth * 100) 
      : 0

    // Job status counts
    const pendingJobs = await prisma.job.count({ where: { status: "PENDING" } })
    const approvedJobs = await prisma.job.count({ where: { status: "APPROVED" } })
    const rejectedJobs = await prisma.job.count({ where: { status: "REJECTED" } })

    // Total users with month-over-month change
    const totalUsers = await prisma.user.count()
    const totalEmployers = await prisma.user.count({ where: { role: "EMPLOYER" } })
    const totalApplicants = await prisma.user.count({ where: { role: "APPLICANT" } })
    
    const usersThisMonth = await prisma.user.count({
      where: { createdAt: { gte: currentMonthStart } }
    })
    const usersLastMonth = await prisma.user.count({
      where: { 
        createdAt: { 
          gte: previousMonthStart,
          lte: previousMonthEnd
        }
      }
    })
    const usersChange = usersLastMonth > 0 
      ? ((usersThisMonth - usersLastMonth) / usersLastMonth * 100) 
      : 0

    // Total revenue from subscriptions
    const activeSubscriptions = await prisma.subscription.findMany({
      where: { status: "active" }
    })
    const totalRevenue = activeSubscriptions.reduce((sum, sub) => sum + sub.price, 0)
    
    const subscriptionsThisMonth = await prisma.subscription.count({
      where: { 
        status: "active",
        startDate: { gte: currentMonthStart }
      }
    })
    const subscriptionsLastMonth = await prisma.subscription.count({
      where: { 
        status: "active",
        startDate: { 
          gte: previousMonthStart,
          lte: previousMonthEnd
        }
      }
    })
    const revenueChange = subscriptionsLastMonth > 0 
      ? ((subscriptionsThisMonth - subscriptionsLastMonth) / subscriptionsLastMonth * 100) 
      : 0

    // Engagement metrics
    const jobsWithMetrics = await prisma.job.aggregate({
      _sum: {
        viewsCount: true,
        likesCount: true
      }
    })
    const totalViews = jobsWithMetrics._sum.viewsCount || 0
    const totalLikes = jobsWithMetrics._sum.likesCount || 0

    // Monthly data for charts (last 6 months)
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const jobs = await prisma.job.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      const applications = await prisma.application.count({
        where: {
          appliedAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      const monthJobs = await prisma.job.findMany({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        },
        select: {
          viewsCount: true
        }
      })
      const views = monthJobs.reduce((sum, job) => sum + job.viewsCount, 0)

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        jobs,
        applications,
        views
      })
    }

    // Mock visitor data (in production, track with analytics)
    const visitorData = [
      { country: "United States", countryCode: "US", visitors: 1250, percentage: 35.2, color: "#3b82f6" },
      { country: "United Kingdom", countryCode: "UK", visitors: 780, percentage: 22.0, color: "#10b981" },
      { country: "Canada", countryCode: "CA", visitors: 520, percentage: 14.6, color: "#f59e0b" },
      { country: "Australia", countryCode: "AU", visitors: 420, percentage: 11.8, color: "#8b5cf6" },
      { country: "Germany", countryCode: "DE", visitors: 310, percentage: 8.7, color: "#ef4444" },
      { country: "India", countryCode: "IN", visitors: 275, percentage: 7.7, color: "#06b6d4" }
    ]

    return NextResponse.json({
      // Stats for StatsCards component
      stats: {
        totalJobs,
        pendingJobs,
        approvedJobs,
        rejectedJobs,
        totalUsers,
        totalEmployers,
        totalApplicants,
        totalRevenue,
        totalViews,
        totalLikes,
        jobsChange,
        usersChange,
        revenueChange,
        viewsChange: 12.5,  // Placeholder
        likesChange: 8.3    // Placeholder
      },
      // Data for AnalyticsCharts component
      monthlyData,
      // Data for VisitorMap component
      visitorData
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
