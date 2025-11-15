import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "APPLICANT") {
      return NextResponse.json(
        { error: "Unauthorized - Applicants only" },
        { status: 401 }
      )
    }

    const jobId = params.id
    const applicantId = (session.user as any).id

    // Check if fit score already exists and is recent (< 1 hour old)
    const existingScore = await prisma.jobFitScore.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId,
        },
      },
    })

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    if (existingScore && existingScore.calculatedAt > oneHourAgo) {
      return NextResponse.json(existingScore)
    }

    // Fetch job criteria
    const jobCriteria = await prisma.jobFitCriteria.findUnique({
      where: { jobId },
    })

    if (!jobCriteria) {
      return NextResponse.json(
        { error: "Job fit criteria not set" },
        { status: 404 }
      )
    }

    // Fetch applicant profile
    const applicantProfile = await prisma.applicantProfile.findUnique({
      where: { userId: applicantId },
    })

    if (!applicantProfile) {
      return NextResponse.json(
        { error: "Applicant profile not found" },
        { status: 404 }
      )
    }

    // Calculate scores for each category
    const scores = calculateFitScores(jobCriteria, applicantProfile)

    // Save or update fit score
    const fitScore = await prisma.jobFitScore.upsert({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId,
        },
      },
      create: {
        jobId,
        applicantId,
        ...scores,
        calculatedAt: new Date(),
      },
      update: {
        ...scores,
        calculatedAt: new Date(),
      },
    })

    return NextResponse.json(fitScore)
  } catch (error) {
    console.error("Error calculating fit score:", error)
    return NextResponse.json(
      { error: "Failed to calculate fit score" },
      { status: 500 }
    )
  }
}

function calculateFitScores(criteria: any, profile: any) {
  // Education Score
  const educationScore = calculateEducationScore(
    criteria.requiredEducation,
    criteria.preferredEducation,
    profile.education
  )

  // Experience Score
  const experienceScore = calculateExperienceScore(
    criteria.minYearsExperience,
    criteria.preferredYearsExperience,
    profile.yearsExperience
  )

  // Essential Skills Score
  const essentialSkillsScore = calculateSkillsScore(
    criteria.essentialSkills || [],
    profile.essentialSkills || []
  )

  // Technical Skills Score
  const technicalSkillsScore = calculateSkillsScore(
    criteria.technicalSkills || [],
    profile.technicalSkills || []
  )

  // Personal Attributes Score
  const attributesScore = calculateAttributesScore(
    criteria.personalAttributes || [],
    profile.personalAttributes || []
  )

  // Cultural Fit Score
  const culturalFitScore = calculateCulturalFitScore(
    criteria.culturalValues || [],
    profile.culturalValues || []
  )

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (educationScore * 0.20 +
      experienceScore * 0.20 +
      essentialSkillsScore * 0.15 +
      technicalSkillsScore * 0.20 +
      attributesScore * 0.15 +
      culturalFitScore * 0.10)
  )

  return {
    educationScore,
    experienceScore,
    essentialSkillsScore,
    technicalSkillsScore,
    attributesScore,
    culturalFitScore,
    overallScore,
    educationStatus: getStatus(educationScore),
    experienceStatus: getStatus(experienceScore),
    essentialSkillsStatus: getStatus(essentialSkillsScore),
    technicalSkillsStatus: getStatus(technicalSkillsScore),
    attributesStatus: getStatus(attributesScore),
    culturalFitStatus: getStatus(culturalFitScore),
  }
}

function calculateEducationScore(required: string, preferred: string, actual: string): number {
  const educationLevels = ["high_school", "associate", "bachelor", "master", "phd"]
  
  const requiredIndex = educationLevels.indexOf(required?.toLowerCase() || "high_school")
  const preferredIndex = educationLevels.indexOf(preferred?.toLowerCase() || required?.toLowerCase() || "bachelor")
  const actualIndex = educationLevels.indexOf(actual?.toLowerCase() || "high_school")

  if (actualIndex >= preferredIndex) return 100
  if (actualIndex >= requiredIndex) return 70
  if (actualIndex === requiredIndex - 1) return 40
  return 20
}

function calculateExperienceScore(minYears: number, preferredYears: number, actualYears: number): number {
  if (!actualYears) return 0
  if (actualYears >= (preferredYears || minYears)) return 100
  if (actualYears >= minYears) return 70
  if (actualYears >= minYears * 0.7) return 50
  return 30
}

function calculateSkillsScore(requiredSkills: string[], applicantSkills: string[]): number {
  if (!requiredSkills || requiredSkills.length === 0) return 100
  if (!applicantSkills || applicantSkills.length === 0) return 0

  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase().trim())
  const applicantSkillsLower = applicantSkills.map(s => s.toLowerCase().trim())

  const matchedSkills = requiredSkillsLower.filter(skill =>
    applicantSkillsLower.some(applicantSkill => 
      applicantSkill.includes(skill) || skill.includes(applicantSkill)
    )
  )

  return Math.round((matchedSkills.length / requiredSkills.length) * 100)
}

function calculateAttributesScore(requiredAttributes: string[], applicantAttributes: string[]): number {
  if (!requiredAttributes || requiredAttributes.length === 0) return 100
  if (!applicantAttributes || applicantAttributes.length === 0) return 0

  const requiredAttrsLower = requiredAttributes.map(a => a.toLowerCase().trim())
  const applicantAttrsLower = applicantAttributes.map(a => a.toLowerCase().trim())

  const matchedAttributes = requiredAttrsLower.filter(attr =>
    applicantAttrsLower.includes(attr)
  )

  return Math.round((matchedAttributes.length / requiredAttributes.length) * 100)
}

function calculateCulturalFitScore(requiredValues: string[], applicantValues: string[]): number {
  if (!requiredValues || requiredValues.length === 0) return 100
  if (!applicantValues || applicantValues.length === 0) return 50 // Neutral score if not specified

  const requiredValuesLower = requiredValues.map(v => v.toLowerCase().trim())
  const applicantValuesLower = applicantValues.map(v => v.toLowerCase().trim())

  const matchedValues = requiredValuesLower.filter(value =>
    applicantValuesLower.includes(value)
  )

  return Math.round((matchedValues.length / requiredValues.length) * 100)
}

function getStatus(score: number): "passed" | "partially" | "failed" {
  if (score >= 80) return "passed"
  if (score >= 50) return "partially"
  return "failed"
}
