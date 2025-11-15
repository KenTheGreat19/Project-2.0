import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const jobFitCriteriaSchema = z.object({
  requiredEducation: z.string().optional(),
  preferredEducation: z.string().optional(),
  minYearsExperience: z.number().min(0).optional(),
  preferredYearsExperience: z.number().min(0).optional(),
  essentialSkills: z.array(z.string()).optional(),
  technicalSkills: z.array(z.string()).optional(),
  personalAttributes: z.array(z.string()).optional(),
  culturalValues: z.array(z.string()).optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobId = params.id

    // Verify the job belongs to the employer
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (job.employerId !== (session.user as any).id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const criteria = await prisma.jobFitCriteria.findUnique({
      where: { jobId },
    })

    if (!criteria) {
      return NextResponse.json({ error: "Criteria not set" }, { status: 404 })
    }

    return NextResponse.json(criteria)
  } catch (error) {
    console.error("Error fetching job fit criteria:", error)
    return NextResponse.json(
      { error: "Failed to fetch criteria" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Unauthorized - Employers only" },
        { status: 401 }
      )
    }

    const jobId = params.id

    // Verify the job belongs to the employer
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (job.employerId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = jobFitCriteriaSchema.parse(body)

    // Transform arrays to JSON for Prisma
    const dataForPrisma = {
      ...validatedData,
      essentialSkills: validatedData.essentialSkills ? JSON.stringify(validatedData.essentialSkills) : undefined,
      technicalSkills: validatedData.technicalSkills ? JSON.stringify(validatedData.technicalSkills) : undefined,
      personalAttributes: validatedData.personalAttributes ? JSON.stringify(validatedData.personalAttributes) : undefined,
      culturalValues: validatedData.culturalValues ? JSON.stringify(validatedData.culturalValues) : undefined,
    }

    const criteria = await prisma.jobFitCriteria.upsert({
      where: { jobId },
      create: {
        jobId,
        ...dataForPrisma,
      },
      update: dataForPrisma,
    })

    return NextResponse.json(criteria)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error setting job fit criteria:", error)
    return NextResponse.json(
      { error: "Failed to set criteria" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return POST(req, { params })
}
