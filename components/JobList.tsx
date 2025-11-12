import prisma from "@/lib/prisma"
import { JobCard } from "@/components/JobCard"

interface JobListProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function JobList({ searchParams }: JobListProps) {
  const title = searchParams.title as string | undefined
  const location = searchParams.location as string | undefined
  const type = searchParams.type as string | undefined
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

  if (minSalary) {
    where.salaryMin = { gte: parseInt(minSalary) }
  }

  // Fetch jobs with employer data for ranking
  const jobs = await prisma.job.findMany({
    where,
    include: {
      employer: {
        select: {
          averageRating: true,
          responseRate: true,
          completedHires: true,
          isVerified: true,
          totalReviews: true,
        },
      },
    },
    take: 100, // Fetch more for better ranking
  })

  // Sort by ranking algorithm: employer rating, response rate, completed hires
  const rankedJobs = jobs
    .map((job) => {
      const ratingScore = (job.employer.averageRating || 0) * 20 // 0-100
      const responseScore = job.employer.responseRate || 0 // 0-100
      const hireScore = Math.min(job.employer.completedHires * 5, 100) // Cap at 100
      const verifiedBonus = job.employer.isVerified ? 10 : 0
      
      const totalScore = (ratingScore * 0.4) + (responseScore * 0.3) + (hireScore * 0.2) + verifiedBonus
      
      return { ...job, rankingScore: totalScore }
    })
    .sort((a, b) => b.rankingScore - a.rankingScore)
    .slice(0, 50) // Take top 50

  if (rankedJobs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl text-gray-400 mb-4">No jobs found</p>
        <p className="text-gray-500">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {rankedJobs.length} {rankedJobs.length === 1 ? "Job" : "Jobs"} Found
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ranked by employer rating, response rate, and verified status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rankedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}
