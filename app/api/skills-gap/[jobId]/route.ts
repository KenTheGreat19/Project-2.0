import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET - Analyze skills gap for a specific job
export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "APPLICANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const jobId = params.jobId

    // Get job details and criteria
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        fitCriteria: true,
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Get applicant profile
    const profile = await prisma.applicantProfile.findUnique({
      where: { userId },
    })

    if (!profile) {
      return NextResponse.json({
        error: "Please complete your profile first",
        hasProfile: false,
      }, { status: 400 })
    }

    // Check if analysis already exists
    let analysis = await prisma.skillsGapAnalysis.findFirst({
      where: {
        userId,
        jobId,
      },
    })

    if (!analysis) {
      // Perform skills gap analysis
      const missingSkills: string[] = []
      const weakSkills: string[] = []
      const matchingSkills: string[] = []

      // Parse job required skills
      let jobEssentialSkills: any[] = []
      let jobTechnicalSkills: any[] = []

      if (job.fitCriteria?.essentialSkills) {
        try {
          jobEssentialSkills = JSON.parse(job.fitCriteria.essentialSkills)
        } catch (e) {}
      }

      if (job.fitCriteria?.technicalSkills) {
        try {
          jobTechnicalSkills = JSON.parse(job.fitCriteria.technicalSkills)
        } catch (e) {}
      }

      // Parse applicant skills
      let applicantSoftSkills: any[] = []
      let applicantHardSkills: any[] = []

      if (profile.softSkills) {
        try {
          applicantSoftSkills = JSON.parse(profile.softSkills)
        } catch (e) {}
      }

      if (profile.hardSkills) {
        try {
          applicantHardSkills = JSON.parse(profile.hardSkills)
        } catch (e) {}
      }

      // Compare essential skills
      jobEssentialSkills.forEach((reqSkill: any) => {
        const skillName = typeof reqSkill === 'string' ? reqSkill : reqSkill.name
        const hasSkill = applicantSoftSkills.find((s: any) => 
          (typeof s === 'string' ? s : s.name).toLowerCase() === skillName.toLowerCase()
        )
        
        if (!hasSkill) {
          missingSkills.push(skillName)
        } else {
          const proficiency = typeof hasSkill === 'object' ? hasSkill.rating || 0 : 3
          if (proficiency < 3) {
            weakSkills.push(skillName)
          } else {
            matchingSkills.push(skillName)
          }
        }
      })

      // Compare technical skills
      jobTechnicalSkills.forEach((reqSkill: any) => {
        const skillName = typeof reqSkill === 'string' ? reqSkill : reqSkill.name
        const hasSkill = applicantHardSkills.find((s: any) => 
          (typeof s === 'string' ? s : s.name).toLowerCase() === skillName.toLowerCase()
        )
        
        if (!hasSkill) {
          missingSkills.push(skillName)
        } else {
          const proficiency = typeof hasSkill === 'object' ? (hasSkill.proficiency === 'expert' || hasSkill.proficiency === 'advanced' ? 4 : 2) : 3
          if (proficiency < 3) {
            weakSkills.push(skillName)
          } else {
            matchingSkills.push(skillName)
          }
        }
      })

      // Generate recommendations
      const coursesRecommended = generateCourseRecommendations(missingSkills.concat(weakSkills))
      const certificationsRecommended = generateCertificationRecommendations(missingSkills.concat(weakSkills))
      const booksRecommended = generateBookRecommendations(job.category || "General")

      // Estimate time to ready (in weeks)
      const estimatedTimeToReady = Math.ceil((missingSkills.length * 2 + weakSkills.length * 1) / 2)

      // Generate improvement plan
      const improvementPlan = generateImprovementPlan(missingSkills, weakSkills, estimatedTimeToReady)

      // Create analysis
      analysis = await prisma.skillsGapAnalysis.create({
        data: {
          userId,
          jobId,
          missingSkills: JSON.stringify(missingSkills),
          weakSkills: JSON.stringify(weakSkills),
          matchingSkills: JSON.stringify(matchingSkills),
          coursesRecommended: JSON.stringify(coursesRecommended),
          certificationsRecommended: JSON.stringify(certificationsRecommended),
          booksRecommended: JSON.stringify(booksRecommended),
          improvementPlan,
          estimatedTimeToReady,
        },
      })
    }

    // Parse JSON fields for response
    const parsedAnalysis = {
      ...analysis,
      missingSkills: JSON.parse(analysis.missingSkills || "[]"),
      weakSkills: JSON.parse(analysis.weakSkills || "[]"),
      matchingSkills: JSON.parse(analysis.matchingSkills || "[]"),
      coursesRecommended: JSON.parse(analysis.coursesRecommended || "[]"),
      certificationsRecommended: JSON.parse(analysis.certificationsRecommended || "[]"),
      booksRecommended: JSON.parse(analysis.booksRecommended || "[]"),
    }

    return NextResponse.json({ analysis: parsedAnalysis, job })
  } catch (error) {
    console.error("Error analyzing skills gap:", error)
    return NextResponse.json({ error: "Failed to analyze skills gap" }, { status: 500 })
  }
}

function generateCourseRecommendations(skills: string[]): any[] {
  // Simple recommendation logic - in production, this would use an API or database
  const recommendations: any[] = []
  const uniqueSkills = [...new Set(skills.slice(0, 5))]
  
  uniqueSkills.forEach(skill => {
    recommendations.push({
      title: `Master ${skill} - Complete Course`,
      platform: "Udemy/Coursera",
      duration: "4-8 weeks",
      skill: skill,
    })
  })
  
  return recommendations
}

function generateCertificationRecommendations(skills: string[]): any[] {
  const certifications: any[] = []
  
  // Check for common certification categories
  if (skills.some(s => s.toLowerCase().includes('project management'))) {
    certifications.push({ name: "PMP Certification", provider: "PMI", relevantSkills: ["Project Management"] })
  }
  
  if (skills.some(s => s.toLowerCase().includes('data') || s.toLowerCase().includes('analytics'))) {
    certifications.push({ name: "Google Data Analytics Certificate", provider: "Google", relevantSkills: ["Data Analysis"] })
  }
  
  return certifications
}

function generateBookRecommendations(category: string): any[] {
  const books = [
    { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", category: "Technology" },
    { title: "The Lean Startup", author: "Eric Ries", category: "Business" },
    { title: "Atomic Habits", author: "James Clear", category: "Personal Development" },
  ]
  
  return books.filter(b => b.category === category || b.category === "Personal Development").slice(0, 3)
}

function generateImprovementPlan(missingSkills: string[], weakSkills: string[], weeks: number): string {
  let plan = `## ${weeks}-Week Improvement Plan\n\n`
  
  if (missingSkills.length > 0) {
    plan += `### Priority 1: Learn Missing Skills (Weeks 1-${Math.ceil(weeks * 0.6)})\n`
    missingSkills.slice(0, 3).forEach((skill, i) => {
      plan += `${i + 1}. ${skill}: Start with online courses and practice projects\n`
    })
    plan += `\n`
  }
  
  if (weakSkills.length > 0) {
    plan += `### Priority 2: Strengthen Weak Skills (Weeks ${Math.ceil(weeks * 0.6) + 1}-${weeks})\n`
    weakSkills.slice(0, 3).forEach((skill, i) => {
      plan += `${i + 1}. ${skill}: Practice through real-world projects\n`
    })
    plan += `\n`
  }
  
  plan += `### Weekly Schedule:\n`
  plan += `- Study: 10-15 hours/week\n`
  plan += `- Practice: 5-10 hours/week\n`
  plan += `- Build portfolio projects\n`
  plan += `- Network with professionals in the field\n`
  
  return plan
}
