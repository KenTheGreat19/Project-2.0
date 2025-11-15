import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Calculate fit score for a specific category
function calculateCategoryScore(
  applicantData: any[],
  requiredData: any[],
  _weights?: any
): { score: number; status: string } {
  if (!requiredData || requiredData.length === 0) {
    return { score: 100, status: "passed" }
  }

  if (!applicantData || applicantData.length === 0) {
    return { score: 0, status: "failed" }
  }

  const matches = requiredData.filter((req) =>
    applicantData.some((app) => 
      app.toLowerCase().includes(req.toLowerCase()) || 
      req.toLowerCase().includes(app.toLowerCase())
    )
  ).length

  const score = Math.round((matches / requiredData.length) * 100)

  let status = "failed"
  if (score >= 80) status = "passed"
  else if (score >= 50) status = "partially"

  return { score, status }
}

// Calculate education score
function calculateEducationScore(
  applicantEducation: string,
  applicantCertifications: any[],
  minEducation?: string,
  certificationsRequired?: any[]
): { score: number; status: string } {
  const educationLevels = ["high_school", "associate", "bachelor", "master", "phd"]
  
  let score = 0
  
  // Education level matching (60% weight)
  if (minEducation) {
    const minIndex = educationLevels.indexOf(minEducation)
    const applicantIndex = educationLevels.indexOf(applicantEducation || "high_school")
    
    if (applicantIndex >= minIndex) {
      score += 60
    } else if (applicantIndex === minIndex - 1) {
      score += 40
    } else {
      score += 20
    }
  } else {
    score += 60
  }
  
  // Certifications matching (40% weight)
  if (certificationsRequired && certificationsRequired.length > 0) {
    const certMatch = calculateCategoryScore(
      applicantCertifications || [],
      certificationsRequired
    )
    score += (certMatch.score * 0.4)
  } else {
    score += 40
  }

  let status = "failed"
  if (score >= 80) status = "passed"
  else if (score >= 50) status = "partially"

  return { score: Math.round(score), status }
}

// Calculate experience score
function calculateExperienceScore(
  applicantYears: number,
  applicantIndustries: any[],
  minYears: number,
  relevantIndustry?: string
): { score: number; status: string } {
  let score = 0

  // Years of experience (70% weight)
  if (applicantYears >= minYears) {
    score += 70
  } else if (applicantYears >= minYears * 0.75) {
    score += 50
  } else if (applicantYears >= minYears * 0.5) {
    score += 30
  } else {
    score += 10
  }

  // Industry match (30% weight)
  if (relevantIndustry && applicantIndustries) {
    const hasIndustry = applicantIndustries.some((ind) =>
      ind.toLowerCase().includes(relevantIndustry.toLowerCase())
    )
    score += hasIndustry ? 30 : 10
  } else {
    score += 30
  }

  let status = "failed"
  if (score >= 80) status = "passed"
  else if (score >= 50) status = "partially"

  return { score: Math.round(score), status }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "APPLICANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobId = params.jobId
    const userId = (session.user as any).id

    // Check if applicant has a profile
    const applicantProfile = await prisma.applicantProfile.findUnique({
      where: { userId },
    })

    if (!applicantProfile) {
      return NextResponse.json({
        hasProfile: false,
        fitScore: null,
      })
    }

    // Get job fit criteria
    const jobCriteria = await prisma.jobFitCriteria.findUnique({
      where: { jobId },
    })

    // If no criteria set, return default neutral scores
    if (!jobCriteria) {
      return NextResponse.json({
        hasProfile: true,
        fitScore: {
          overallScore: 50,
          categories: {
            education: { score: 50, status: "partially" },
            experience: { score: 50, status: "partially" },
            essentialSkills: { score: 50, status: "partially" },
            technicalSkills: { score: 50, status: "partially" },
            attributes: { score: 50, status: "partially" },
            culturalFit: { score: 50, status: "partially" },
          },
          calculatedAt: new Date().toISOString(),
        },
      })
    }

    // Parse JSON fields
    const applicantCerts = applicantProfile.certifications
      ? JSON.parse(applicantProfile.certifications)
      : []
    const applicantSoftSkills = applicantProfile.softSkills
      ? JSON.parse(applicantProfile.softSkills)
      : []
    const applicantHardSkills = applicantProfile.hardSkills
      ? JSON.parse(applicantProfile.hardSkills)
      : []
    const applicantTraits = applicantProfile.personalTraits
      ? JSON.parse(applicantProfile.personalTraits)
      : []
    const applicantValues = applicantProfile.values
      ? JSON.parse(applicantProfile.values)
      : []
    const applicantIndustries = applicantProfile.industries
      ? JSON.parse(applicantProfile.industries)
      : []

    const requiredCerts = jobCriteria.certificationsRequired
      ? JSON.parse(jobCriteria.certificationsRequired)
      : []
    const requiredSoftSkills = jobCriteria.essentialSkills
      ? JSON.parse(jobCriteria.essentialSkills)
      : []
    const requiredHardSkills = jobCriteria.technicalSkills
      ? JSON.parse(jobCriteria.technicalSkills)
      : []
    const requiredAttributes = jobCriteria.personalAttributes
      ? JSON.parse(jobCriteria.personalAttributes)
      : []
    const requiredValues = jobCriteria.culturalValues
      ? JSON.parse(jobCriteria.culturalValues)
      : []

    // Calculate scores for each category
    const education = calculateEducationScore(
      applicantProfile.educationLevel || "",
      applicantCerts,
      jobCriteria.minEducation || undefined,
      requiredCerts
    )

    const experience = calculateExperienceScore(
      applicantProfile.totalYearsExperience,
      applicantIndustries,
      jobCriteria.minYearsExperience,
      jobCriteria.relevantIndustry || undefined
    )

    const essentialSkills = calculateCategoryScore(
      applicantSoftSkills,
      requiredSoftSkills
    )

    const technicalSkills = calculateCategoryScore(
      applicantHardSkills.map((s: any) => s.name || s),
      requiredHardSkills.map((s: any) => s.name || s)
    )

    const attributes = calculateCategoryScore(
      applicantTraits,
      requiredAttributes
    )

    const culturalFit = calculateCategoryScore(
      applicantValues,
      requiredValues
    )

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      (education.score * 0.20 +
        experience.score * 0.25 +
        essentialSkills.score * 0.20 +
        technicalSkills.score * 0.20 +
        attributes.score * 0.10 +
        culturalFit.score * 0.05)
    )

    // Save or update the fit score
    await prisma.jobFitScore.upsert({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId: userId,
        },
      },
      create: {
        jobId,
        applicantId: userId,
        educationScore: education.score,
        experienceScore: experience.score,
        essentialSkillsScore: essentialSkills.score,
        technicalSkillsScore: technicalSkills.score,
        attributesScore: attributes.score,
        culturalFitScore: culturalFit.score,
        overallScore,
        educationStatus: education.status,
        experienceStatus: experience.status,
        essentialSkillsStatus: essentialSkills.status,
        technicalSkillsStatus: technicalSkills.status,
        attributesStatus: attributes.status,
        culturalFitStatus: culturalFit.status,
      },
      update: {
        educationScore: education.score,
        experienceScore: experience.score,
        essentialSkillsScore: essentialSkills.score,
        technicalSkillsScore: technicalSkills.score,
        attributesScore: attributes.score,
        culturalFitScore: culturalFit.score,
        overallScore,
        educationStatus: education.status,
        experienceStatus: experience.status,
        essentialSkillsStatus: essentialSkills.status,
        technicalSkillsStatus: technicalSkills.status,
        attributesStatus: attributes.status,
        culturalFitStatus: culturalFit.status,
        calculatedAt: new Date(),
      },
    })

    return NextResponse.json({
      hasProfile: true,
      fitScore: {
        overallScore,
        categories: {
          education,
          experience,
          essentialSkills,
          technicalSkills,
          attributes,
          culturalFit,
        },
        calculatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error calculating job fit:", error)
    return NextResponse.json(
      { error: "Failed to calculate job fit" },
      { status: 500 }
    )
  }
}
