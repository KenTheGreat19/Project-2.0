import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const jobFitCriteriaSchema = z.object({
  minEducation: z.string().optional(),
  preferredEducation: z.string().optional(),
  certificationsRequired: z.array(z.string()).optional(),
  minYearsExperience: z.number().min(0).default(0),
  preferredYearsExperience: z.number().optional(),
  relevantIndustry: z.string().optional(),
  essentialSkills: z.array(z.string()).optional(),
  technicalSkills: z.array(z.object({
    name: z.string(),
    proficiency: z.string().optional(),
  })).optional(),
  personalAttributes: z.array(z.string()).optional(),
  culturalValues: z.array(z.string()).optional(),
  workStyle: z.string().optional(),
})

// GET - Fetch job fit criteria
export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobId = params.jobId

    // Verify job ownership if employer
    if ((session.user as any).role === "EMPLOYER") {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { employerId: true },
      })

      if (!job || job.employerId !== (session.user as any).id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const criteria = await prisma.jobFitCriteria.findUnique({
      where: { jobId },
    })

    if (!criteria) {
      return NextResponse.json({ criteria: null })
    }

    // Parse JSON fields
    return NextResponse.json({
      criteria: {
        ...criteria,
        certificationsRequired: criteria.certificationsRequired
          ? JSON.parse(criteria.certificationsRequired)
          : [],
        essentialSkills: criteria.essentialSkills
          ? JSON.parse(criteria.essentialSkills)
          : [],
        technicalSkills: criteria.technicalSkills
          ? JSON.parse(criteria.technicalSkills)
          : [],
        personalAttributes: criteria.personalAttributes
          ? JSON.parse(criteria.personalAttributes)
          : [],
        culturalValues: criteria.culturalValues
          ? JSON.parse(criteria.culturalValues)
          : [],
      },
    })
  } catch (error) {
    console.error("Error fetching job fit criteria:", error)
    return NextResponse.json(
      { error: "Failed to fetch criteria" },
      { status: 500 }
    )
  }
}

// POST/PUT - Create or update job fit criteria
export async function POST(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobId = params.jobId

    // Verify job ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true },
    })

    if (!job || job.employerId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = jobFitCriteriaSchema.parse(body)

    // Upsert criteria
    const criteria = await prisma.jobFitCriteria.upsert({
      where: { jobId },
      create: {
        jobId,
        minEducation: validatedData.minEducation,
        preferredEducation: validatedData.preferredEducation,
        certificationsRequired: validatedData.certificationsRequired
          ? JSON.stringify(validatedData.certificationsRequired)
          : null,
        minYearsExperience: validatedData.minYearsExperience,
        preferredYearsExperience: validatedData.preferredYearsExperience,
        relevantIndustry: validatedData.relevantIndustry,
        essentialSkills: validatedData.essentialSkills
          ? JSON.stringify(validatedData.essentialSkills)
          : null,
        technicalSkills: validatedData.technicalSkills
          ? JSON.stringify(validatedData.technicalSkills)
          : null,
        personalAttributes: validatedData.personalAttributes
          ? JSON.stringify(validatedData.personalAttributes)
          : null,
        culturalValues: validatedData.culturalValues
          ? JSON.stringify(validatedData.culturalValues)
          : null,
        workStyle: validatedData.workStyle,
      },
      update: {
        minEducation: validatedData.minEducation,
        preferredEducation: validatedData.preferredEducation,
        certificationsRequired: validatedData.certificationsRequired
          ? JSON.stringify(validatedData.certificationsRequired)
          : null,
        minYearsExperience: validatedData.minYearsExperience,
        preferredYearsExperience: validatedData.preferredYearsExperience,
        relevantIndustry: validatedData.relevantIndustry,
        essentialSkills: validatedData.essentialSkills
          ? JSON.stringify(validatedData.essentialSkills)
          : null,
        technicalSkills: validatedData.technicalSkills
          ? JSON.stringify(validatedData.technicalSkills)
          : null,
        personalAttributes: validatedData.personalAttributes
          ? JSON.stringify(validatedData.personalAttributes)
          : null,
        culturalValues: validatedData.culturalValues
          ? JSON.stringify(validatedData.culturalValues)
          : null,
        workStyle: validatedData.workStyle,
      },
    })

    return NextResponse.json({ success: true, criteria })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error saving job fit criteria:", error)
    return NextResponse.json(
      { error: "Failed to save criteria" },
      { status: 500 }
    )
  }
}
