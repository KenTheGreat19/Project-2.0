"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Briefcase, 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  ThumbsUp
} from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalJobs: number
    pendingJobs: number
    totalUsers: number
    totalRevenue: number
    totalViews: number
    totalLikes: number
    jobsChange: number
    usersChange: number
    revenueChange: number
    viewsChange: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs.toLocaleString(),
      change: stats.jobsChange,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950"
    },
    {
      title: "Pending Approval",
      value: stats.pendingJobs.toLocaleString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950"
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: stats.usersChange,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950"
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      change: stats.viewsChange,
      icon: Eye,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950"
    },
    {
      title: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: ThumbsUp,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        const hasChange = card.change !== undefined
        const isPositive = card.change && card.change > 0
        
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {hasChange && (
                <div className="flex items-center text-xs mt-1">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={isPositive ? "text-green-600" : "text-red-600"}>
                    {isPositive ? "+" : ""}{card.change}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
