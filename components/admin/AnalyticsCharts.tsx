"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface AnalyticsChartsProps {
  monthlyData: Array<{
    month: string
    jobs: number
    applications: number
    views: number
  }>
}

export function AnalyticsCharts({ monthlyData }: AnalyticsChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Monthly Stats Line Chart */}
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Monthly Statistics</CardTitle>
          <CardDescription>Job posts and applications over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="jobs" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Jobs Posted"
                dot={{ fill: "#3b82f6", r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Applications"
                dot={{ fill: "#10b981", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Job Views Area Chart */}
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Job Views Trend</CardTitle>
          <CardDescription>Monthly page views and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorViews)"
                name="Total Views"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Job Status Bar Chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Job Distribution</CardTitle>
          <CardDescription>Current job status breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Bar dataKey="jobs" fill="#3b82f6" name="Jobs Posted" radius={[8, 8, 0, 0]} />
              <Bar dataKey="applications" fill="#10b981" name="Applications" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
