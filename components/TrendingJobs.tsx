"use client"

import prisma from "@/lib/prisma"
import { JobCard } from "@/components/JobCard"
import { TrendingUp } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export function TrendingJobsClient({ jobs }: { jobs: any[] }) {
  const { t } = useLanguage()

  if (jobs.length === 0) {
    return null
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-8 w-8 text-orange-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("jobs.trending")}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {t("jobs.trendingDescription")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} showTrendingBadge />
        ))}
      </div>
    </div>
  )
}

export async function TrendingJobs() {
  // Fetch trending jobs based on recent engagement and views
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const trendingJobs = await prisma.job.findMany({
    where: {
      status: "approved",
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      employer: {
        select: {
          averageRating: true,
          responseRate: true,
          completedHires: true,
          isVerified: true,
          totalReviews: true,
          hasVerifiedBadge: true,
          employerType: true,
        },
      },
    },
    orderBy: [
      { engagementScore: "desc" },
      { viewsCount: "desc" },
      { likesCount: "desc" },
    ],
    take: 6,
  })

  if (trendingJobs.length === 0) {
    return null
  }

  return <TrendingJobsClient jobs={trendingJobs} />
}
