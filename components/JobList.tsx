import prisma from "@/lib/prisma"
import { JobCard } from "@/components/JobCard"
import { AdDisplay } from "@/components/AdDisplay"

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
            averageRating: true,
            responseRate: true,
            completedHires: true,
            isVerified: true,
            totalReviews: true,
            hasVerifiedBadge: true,
          },
        },
        _count: {
          select: {
            likes: true,
            publicComments: true,
          },
        },
      },
      take: 100, // Fetch more for better ranking
      orderBy: [
        { isSponsored: "desc" },
        { createdAt: "desc" },
      ],
    })

    // Separate sponsored and free jobs
    const now = new Date()
    const sponsoredJobs = jobs.filter((job) => 
      job.isSponsored && 
      (!job.sponsoredUntil || new Date(job.sponsoredUntil) > now) &&
      (!job.impressionLimit || job.impressionsUsed < job.impressionLimit)
    )
    
    const freeJobs = jobs.filter((job) => 
      !job.isSponsored || 
      (job.sponsoredUntil && new Date(job.sponsoredUntil) <= now) ||
      (job.impressionLimit && job.impressionsUsed >= job.impressionLimit)
    )

    // Sort free jobs by engagement-based ranking algorithm
    const rankedFreeJobs = freeJobs
      .map((job) => {
        // Engagement Score: (likes × 2) + (comments × 1)
        const likesCount = job._count?.likes || 0
        const commentsCount = job._count?.publicComments || 0
        const engagementScore = (likesCount * 2) + (commentsCount * 1)
        
        // Employer reputation score
        const ratingScore = (job.employer.averageRating || 0) * 20 // 0-100
        const responseScore = job.employer.responseRate || 0 // 0-100
        const hireScore = Math.min(job.employer.completedHires * 5, 100) // Cap at 100
        const verifiedBonus = job.employer.isVerified ? 10 : 0
        
        // Recent post boost (jobs posted in last 7 days get bonus)
        const daysSincePosted = (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        const recencyBonus = daysSincePosted <= 7 ? Math.max(0, (7 - daysSincePosted) * 5) : 0
        
        // Combine: engagement (40%) + employer reputation (40%) + recency (20%)
        const reputationScore = (ratingScore * 0.4) + (responseScore * 0.3) + (hireScore * 0.2) + verifiedBonus
        const totalScore = (engagementScore * 0.4) + (reputationScore * 0.4) + recencyBonus
        
        return { ...job, rankingScore: totalScore }
      })
      .sort((a, b) => b.rankingScore - a.rankingScore)

    // Combine: sponsored first, then ranked free jobs
    const rankedJobs = [
      ...sponsoredJobs.map(job => ({ ...job, rankingScore: 1000 })), // High score for sponsored
      ...rankedFreeJobs,
    ].slice(0, 50) // Take top 50 total

    if (rankedJobs.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-400 mb-4">No jobs found</p>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      )
    }

    const sponsoredCount = sponsoredJobs.length

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {rankedJobs.length} {rankedJobs.length === 1 ? "Job" : "Jobs"} Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {sponsoredCount > 0 && `${sponsoredCount} Sponsored • `}
            Ranked by engagement, employer reputation, and recency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedJobs.map((job, index) => (
            <div key={job.id}>
              <JobCard job={job} />
              {/* Show inline ad every 6 jobs for guests */}
              {(index + 1) % 6 === 0 && index !== rankedJobs.length - 1 && (
                <div className="col-span-full">
                  <AdDisplay position="inline" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
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
