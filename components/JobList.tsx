"use client"

import prisma from "@/lib/prisma"
import { JobCard } from "@/components/JobCard"
import { useLanguage } from "@/contexts/LanguageContext"

function JobListClient({ jobs }: { jobs: any[] }) {
  const { t } = useLanguage()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {jobs.length} {jobs.length === 1 ? t("jobs.noJobsFound").replace("No jobs", "Job") : t("search.searchJobs")} {t("jobs.noJobsFound").includes("found") ? "" : "Found"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ranked by engagement, employer reputation, and recency
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id}>
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  )
}

interface JobListProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function JobList({ searchParams }: JobListProps) {
  try {
    const title = searchParams.title as string | undefined
    const location = searchParams.location as string | undefined
    const type = searchParams.type as string | undefined
    const category = searchParams.category as string | undefined
    const minSalary = searchParams.minSalary as string | undefined

    // Build where clause for filtering
    const where: any = {
      status: "approved", // Only show approved jobs
    }

    if (title) {
      where.OR = [
        { title: { contains: title, mode: "insensitive" } },
        { company: { contains: title, mode: "insensitive" } },
        { description: { contains: title, mode: "insensitive" } },
      ]
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" }
    }

    if (type && type !== "all") {
      where.type = type
    }

    if (category) {
      where.category = category
    }

    if (minSalary && !isNaN(parseInt(minSalary))) {
      where.salaryMin = { gte: parseInt(minSalary) }
    }

    // Fetch jobs with employer data for ranking
    const jobs = await prisma.job.findMany({
      where,
      include: {
        employer: {
          select: {
            employerType: true,
          },
        },
      },
      take: 100,
      orderBy: [
        { createdAt: "desc" },
      ],
    })

    // Sort jobs by recent post date
    const rankedJobs = jobs
      .map((job) => {
        // Recent post boost (jobs posted in last 7 days get bonus)
        const daysSincePosted = (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        const recencyBonus = daysSincePosted <= 7 ? Math.max(0, (7 - daysSincePosted) * 5) : 0
        
        return { ...job, rankingScore: recencyBonus }
      })
      .sort((a, b) => b.rankingScore - a.rankingScore)
      .slice(0, 50) // Take top 50 total

    if (rankedJobs.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-400 mb-4">No jobs found</p>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      )
    }

    return <JobListClient jobs={rankedJobs} />
  } catch (error) {
    console.error("Error loading jobs:", error)
    return (
      <div className="text-center py-16">
        <p className="text-2xl text-red-500 mb-4">Error loading jobs</p>
        <p className="text-gray-500">Please try again later or contact support</p>
      </div>
    )
  }
}
