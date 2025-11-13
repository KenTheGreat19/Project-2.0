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
      type: true,
      salaryMin: true,
      salaryMax: true,
    },
    take: 100,
    orderBy: {
      createdAt: "desc",
    },
  })

  return <JobMapClient jobs={jobs} />
}
