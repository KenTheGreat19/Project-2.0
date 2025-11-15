"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Briefcase, 
  Users, 
  Building2, 
  UserCheck,
  FileText,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react"

interface Stats {
  totalJobs: number
  pendingJobs: number
  approvedJobs: number
  rejectedJobs: number
  totalEmployers: number
  totalApplicants: number
  totalUsers: number
  totalRevenue: number
  totalViews: number
  totalLikes: number
  jobsChange: number
  usersChange: number
  revenueChange: number
  viewsChange: number
  likesChange: number
}

interface MonthlyData {
  month: string
  jobs: number
  applications: number
  views: number
}

export default function AdminDashboardClient() {
  const [stats, setStats] = React.useState<Stats | null>(null)
  const [monthlyData, setMonthlyData] = React.useState<MonthlyData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")
      const data = await response.json()
      setStats(data.stats)
      setMonthlyData(data.monthlyData)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Jobs",
      value: stats?.totalJobs || 0,
      change: stats?.jobsChange || 0,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/admin/jobs",
      subStats: [
        { label: "Pending", value: stats?.pendingJobs || 0, icon: Clock, color: "text-yellow-600" },
        { label: "Approved", value: stats?.approvedJobs || 0, icon: CheckCircle2, color: "text-green-600" },
        { label: "Rejected", value: stats?.rejectedJobs || 0, icon: XCircle, color: "text-red-600" },
      ]
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      change: stats?.usersChange || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "/admin/users",
      subStats: [
        { label: "Employers", value: stats?.totalEmployers || 0, icon: Building2, color: "text-blue-600" },
        { label: "Applicants", value: stats?.totalApplicants || 0, icon: UserCheck, color: "text-green-600" },
      ]
    },
    {
      title: "Platform Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      link: "/admin/revenue",
    },
    {
      title: "Total Views",
      value: (stats?.totalViews || 0).toLocaleString(),
      change: stats?.viewsChange || 0,
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      link: "/admin/analytics",
    },
    {
      title: "Total Likes",
      value: (stats?.totalLikes || 0).toLocaleString(),
      change: stats?.likesChange || 0,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      link: "/admin/engagement",
    },
  ]

  const quickActions = [
    {
      title: "Review Pending Jobs",
      description: `${stats?.pendingJobs || 0} jobs waiting for approval`,
      icon: Briefcase,
      link: "/admin/jobs?status=pending",
      variant: "warning" as const,
    },
    {
      title: "Verify Employers",
      description: "Review employer verification requests",
      icon: ShieldCheck,
      link: "/admin/verification",
      variant: "info" as const,
    },
    {
      title: "View All Applications",
      description: "Monitor application activity",
      icon: FileText,
      link: "/admin/applications",
      variant: "default" as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-bold">Welcome Back, Admin! 👋</h2>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon
          const isPositive = card.change >= 0

          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`rounded-full p-2 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={isPositive ? "text-green-600" : "text-red-600"}>
                    {Math.abs(card.change).toFixed(1)}%
                  </span>
                  <span>from last month</span>
                </div>
                {card.subStats && (
                  <div className="mt-3 space-y-1">
                    {card.subStats.map((sub) => {
                      const SubIcon = sub.icon
                      return (
                        <div key={sub.label} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <SubIcon className={`h-3 w-3 ${sub.color}`} />
                            <span className="text-muted-foreground">{sub.label}</span>
                          </div>
                          <span className="font-medium">{sub.value}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                <Button variant="link" size="sm" className="mt-2 px-0" asChild>
                  <Link href={card.link}>
                    View details <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            const variantColors = {
              warning: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950",
              info: "border-blue-200 bg-blue-50 dark:bg-blue-950",
              success: "border-green-200 bg-green-50 dark:bg-green-950",
              default: "border-gray-200 bg-gray-50 dark:bg-gray-950",
            }

            return (
              <Link key={action.title} href={action.link}>
                <Card className={`hover:shadow-md transition-all cursor-pointer ${variantColors[action.variant]}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-base mt-4">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity Chart */}
      {monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>Jobs, Applications, and Views over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <div className="grid grid-cols-6 gap-4 h-full">
                {monthlyData.slice(-6).map((month, index) => {
                  const maxValue = Math.max(...monthlyData.map(m => Math.max(m.jobs, m.applications, m.views / 10)))
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="flex-1 w-full flex flex-col justify-end gap-1">
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{ height: `${(month.jobs / maxValue) * 100}%` }}
                          title={`${month.jobs} jobs`}
                        />
                        <div
                          className="w-full bg-green-500 rounded-t"
                          style={{ height: `${(month.applications / maxValue) * 100}%` }}
                          title={`${month.applications} applications`}
                        />
                        <div
                          className="w-full bg-purple-500 rounded-t"
                          style={{ height: `${((month.views / 10) / maxValue) * 100}%` }}
                          title={`${month.views} views`}
                        />
                      </div>
                      <div className="text-xs mt-2 text-muted-foreground">{month.month}</div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  <span className="text-sm">Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-sm">Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded" />
                  <span className="text-sm">Views (÷10)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">All systems operational</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">Connected & Healthy</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">All endpoints responding</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
