"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown,
  Eye,
  MousePointerClick,
  Users,
  FileCheck,
  ExternalLink,
  Loader2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnalyticsData {
  overview: {
    totalJobs: number
    activeJobs: number
    impressions: number
    views: number
    applications: number
    conversionRate: number
    impressionsTrend: number
  }
  topJobs: Array<{
    id: string
    title: string
    applications: number
    views: number
    impressions: number
    conversionRate: string
  }>
  applicationsOverTime: Array<{
    date: string
    count: number
  }>
}

export function EmployerAnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("30")

  useEffect(() => {
    fetchAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/employer/analytics?period=${period}`)
      if (res.ok) {
        const analyticsData = await res.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your hiring performance and job post effectiveness
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs and campaigns</TabsTrigger>
          <TabsTrigger value="talented">Talented</TabsTrigger>
          <TabsTrigger value="branding">Employer Branding Ads</TabsTrigger>
          <TabsTrigger value="insights">
            Hiring Insights
            <ExternalLink className="h-3 w-3 ml-1" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.impressions.toLocaleString()}</div>
                <div className={`flex items-center text-xs mt-1 ${data.overview.impressionsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.overview.impressionsTrend >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(data.overview.impressionsTrend)}% from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Views</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.views.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click-through rate: {data.overview.impressions > 0 ? ((data.overview.views / data.overview.impressions) * 100).toFixed(1) : 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>-3.2% from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.05%</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+1.2% from last period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Track impressions, clicks, and applications over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Performance chart will be displayed here</p>
                  <p className="text-sm">Showing data for the last 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Jobs</CardTitle>
              <CardDescription>
                Your best performing job posts this period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Senior Software Engineer", views: 1234, applications: 45, status: "Active" },
                  { title: "Product Manager", views: 987, applications: 32, status: "Active" },
                  { title: "UI/UX Designer", views: 856, applications: 28, status: "Active" },
                  { title: "Data Analyst", views: 654, applications: 21, status: "Active" },
                ].map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {job.views} views • {job.applications} applications
                      </div>
                    </div>
                    <Badge variant="secondary">{job.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">View Detailed Report</CardTitle>
                <CardDescription>
                  Get in-depth insights about your hiring funnel
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Export Data</CardTitle>
                <CardDescription>
                  Download your analytics data as CSV or PDF
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Set Up Alerts</CardTitle>
                <CardDescription>
                  Get notified about important metrics changes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Jobs and Campaigns Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics for your job postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Jobs and campaigns analytics will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="talented">
          <Card>
            <CardHeader>
              <CardTitle>Talented Analytics</CardTitle>
              <CardDescription>
                Track your candidate sourcing performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Talented analytics will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Employer Branding Ads</CardTitle>
              <CardDescription>
                Monitor your employer branding campaign performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Branding ads analytics will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Insights</CardTitle>
              <CardDescription>
                Market intelligence and hiring trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Hiring insights will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BarChart3({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 17V9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 17V5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 17v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
