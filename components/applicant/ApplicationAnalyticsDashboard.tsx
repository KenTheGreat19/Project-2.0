"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp, Briefcase, CheckCircle2,
  XCircle, Clock, Calendar, Target, BarChart3, Loader2
} from "lucide-react"

type ApplicationStats = {
  totalApplications: number
  pendingApplications: number
  rejectedApplications: number
  acceptedApplications: number
  averageResponseTime: number
  interviewRate: number
  offerRate: number
  weeklyApplications: number
  monthlyApplications: number
  bestCategory?: string
  bestJobType?: string
  bestLocation?: string
  lastApplicationDate?: string
}

export function ApplicationAnalyticsDashboard() {
  const [stats, setStats] = useState<ApplicationStats | null>(null)
  const [weeklyTrend, setWeeklyTrend] = useState<{ date: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/applicant/analytics")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setWeeklyTrend(data.weeklyTrend || [])
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Application Data Yet</h3>
          <p className="text-muted-foreground">
            Start applying to jobs to see your analytics
          </p>
        </CardContent>
      </Card>
    )
  }

  const successRate = stats.totalApplications > 0 
    ? ((stats.acceptedApplications / stats.totalApplications) * 100).toFixed(1)
    : "0"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Application Analytics
        </h2>
        <p className="text-muted-foreground">Track your job search performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.weeklyApplications} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <Progress value={parseFloat(successRate)} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageResponseTime.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.interviewRate.toFixed(1)}%</div>
            <Progress value={stats.interviewRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Application Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Current status of all your applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={(stats.pendingApplications / stats.totalApplications) * 100} className="w-32 h-2" />
                <Badge variant="outline">{stats.pendingApplications}</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Accepted</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={(stats.acceptedApplications / stats.totalApplications) * 100} className="w-32 h-2" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {stats.acceptedApplications}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Rejected</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={(stats.rejectedApplications / stats.totalApplications) * 100} className="w-32 h-2" />
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {stats.rejectedApplications}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.bestCategory && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Best Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold">{stats.bestCategory}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Highest success rate in this category
              </p>
            </CardContent>
          </Card>
        )}

        {stats.bestJobType && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Best Job Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold">{stats.bestJobType.replace("_", " ").toUpperCase()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Most successful job type for you
              </p>
            </CardContent>
          </Card>
        )}

        {stats.bestLocation && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Best Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold">{stats.bestLocation}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Best response rate from this location
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Weekly Activity Trend */}
      {weeklyTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Application Activity (Last 12 Weeks)</CardTitle>
            <CardDescription>Track your application volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weeklyTrend.map((week, i) => {
                const maxCount = Math.max(...weeklyTrend.map(w => w.count))
                const percentage = (week.count / maxCount) * 100
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground w-24">
                      {new Date(week.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <Progress value={percentage} className="flex-1 h-3" />
                    <span className="text-sm font-medium w-8">{week.count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {stats.weeklyApplications < 5 && (
            <p>• Try to apply to at least 5-10 jobs per week to increase your chances</p>
          )}
          {stats.interviewRate < 10 && (
            <p>• Your interview rate is low. Consider tailoring your resume and cover letters more carefully</p>
          )}
          {stats.averageResponseTime > 14 && (
            <p>• Follow up on applications after 1-2 weeks if you haven&apos;t heard back</p>
          )}
          {stats.bestCategory && (
            <p>• Focus more on {stats.bestCategory} roles where you&apos;ve had success</p>
          )}
          {parseFloat(successRate) < 5 && (
            <p>• Consider getting your resume reviewed or taking skill-building courses</p>
          )}
          <p>• Keep your profile and resume updated to attract more opportunities</p>
        </CardContent>
      </Card>
    </div>
  )
}
