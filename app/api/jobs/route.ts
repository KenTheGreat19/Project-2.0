import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  company: z.string().min(2, "Company name required").max(200),
  location: z.string().min(2, "Location required").max(200),
  locationLat: z.number().min(-90).max(90).nullable().optional(),
  locationLng: z.number().min(-180).max(180).nullable().optional(),
  type: z.enum(["full_time", "part_time", "contract", "internship"]),
  category: z.string().max(100).optional(),
  description: z.string().min(50, "Description must be at least 50 characters").max(10000),
  applyUrl: z.string().url().optional().or(z.literal("")),
  acceptApplicationsHere: z.boolean().default(false),
  salaryMin: z.number().int().min(0).nullable().optional(),
  salaryMax: z.number().int().min(0).nullable().optional(),
  salaryCurrency: z.string().length(3).default("USD"),
  careerLink: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(50).optional().or(z.literal("")),
  degreeRequired: z.boolean().optional(),
  degreeType: z.enum(["BACHELORS", "MASTERS", "ASSOCIATES", "HIGH_SCHOOL", "NONE"]).optional(),
  experienceRequired: z.enum(["ENTRY_LEVEL", "MID_LEVEL", "SENIOR", "MANAGER"]).optional(),
  yearsOfExperience: z.number().int().min(0).max(50).nullable().optional(),
}).refine((data) => {
  if (data.acceptApplicationsHere) {
    return true
  }
  return data.applyUrl && data.applyUrl.length > 0
}, {
  message: "Either enable 'Accept Applications Here' or provide an Apply URL",
  path: ["applyUrl"],
}).refine((data) => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMax >= data.salaryMin
  }
  return true
}, {
  message: "Maximum salary must be greater than or equal to minimum salary",
  path: ["salaryMax"],
})

// GET - Get all jobs for logged-in employer
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    if (userRole !== "EMPLOYER") {
      return NextResponse.json({ error: "Only employers can access this endpoint" }, { status: 403 })
    }

    // Get status filter from query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = { employerId: userId }
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      where.status = status
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { 
            applications: true,
            likes: true,
            publicComments: true,
          }
        }
      },
      take: 100, // Limit results
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// POST - Create new job
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    if (userRole !== "EMPLOYER") {
      return NextResponse.json({ error: "Only employers can create jobs" }, { status: 403 })
    }

    const body = await request.json()
    const data = jobSchema.parse(body)

    // Sanitize and prepare data
    const jobData: any = {
      ...data,
      employerId: userId,
      status: "pending",
      // Set currency field for backward compatibility
      currency: data.salaryCurrency,
    }

    // Remove empty strings
    Object.keys(jobData).forEach(key => {
      if (jobData[key] === "") {
        jobData[key] = null
      }
    })

    const job = await prisma.job.create({
      data: jobData,
      include: {
        employer: {
          select: {
            name: true,
            email: true,
            companyName: true,
          },
        },
      },
    })

    // Send email notification to admin (non-blocking)
    if (process.env.NEXT_PUBLIC_APP_URL) {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/job-submitted`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      }).catch(error => {
        console.error("Failed to send email notification:", error)
      })
    }

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating job:", error)
    return NextResponse.json(
      { error: "Failed to create job", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
