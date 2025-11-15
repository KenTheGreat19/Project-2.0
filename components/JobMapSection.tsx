import prisma from "@/lib/prisma"
import { JobMapClient } from "@/components/JobMapClient"

interface JobMapSectionProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function JobMapSection({ searchParams }: JobMapSectionProps) {
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
      { title: { contains: title } },
      { company: { contains: title } },
      { description: { contains: title } },
    ]
  }

  if (location) {
    where.location = { contains: location }
  }

  if (type && type !== "all") {
    where.type = type
  }

  if (minSalary) {
    where.salaryMin = { gte: parseInt(minSalary) }
  }

  // Fetch jobs for the map (limit to 100 to avoid excessive geocoding)
  const jobs = await prisma.job.findMany({
    where,
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      locationLat: true,
      locationLng: true,
      type: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      employer: {
        select: {
          employerType: true,
        },
      },
    },
    take: 100,
    orderBy: {
      createdAt: "desc",
    },
  })

  // Map jobs to include employerType at the top level for easier access
  const mappedJobs = jobs.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location || "",  // Ensure location is never null
    lat: (job as any).locationLat,
    lng: (job as any).locationLng,
    type: job.type,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: (job as any).salaryCurrency,
    employerType: job.employer?.employerType || null,
  }))

  return <JobMapClient jobs={mappedJobs} />
}
