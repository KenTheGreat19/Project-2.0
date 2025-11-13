import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/jobs/[id]/impression - Track job impression
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id
    const session = await getServerSession(authOptions)
    const userId = session ? (session.user as any).id : null
    
    // Get IP and user agent for deduplication
    const forwarded = request.headers.get("x-forwarded-for")
    const ipAddress = forwarded ? forwarded.split(",")[0] : 
                      request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: jobId, status: "approved" },
      select: {
        id: true,
        isSponsored: true,
        impressionLimit: true,
        impressionsUsed: true,
        targetLocation: true,
        targetExperience: true,
        targetEducation: true,
        employerId: true,
        costPerImpression: true,
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // If not sponsored, just count the view
    if (!job.isSponsored) {
      return NextResponse.json({ success: true, sponsored: false })
    }

    // Check if impression limit reached
    if (job.impressionLimit && job.impressionsUsed >= job.impressionLimit) {
      // Auto-convert to free listing
      await prisma.job.update({
        where: { id: jobId },
        data: {
          isSponsored: false,
          sponsoredUntil: null,
        },
      })

      // Notify employer
      await prisma.notification.create({
        data: {
          userId: job.employerId,
          type: "sponsorship_ended",
          title: "Sponsored Job Impressions Depleted",
          message: `Your sponsored job post has used all ${job.impressionLimit} impressions and is now a free listing.`,
          link: `/employer/dashboard`,
        },
      })

      return NextResponse.json({ success: true, sponsored: false })
    }

    // Check if this is a duplicate impression (same IP within last hour for guests, or same user)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const existingImpression = await prisma.jobImpression.findFirst({
      where: {
        jobId,
        createdAt: { gte: oneHourAgo },
        ...(userId
          ? { userId }
          : { ipAddress, userAgent }),
      },
    })

    if (existingImpression) {
      return NextResponse.json({ success: true, duplicate: true })
    }

    // Check if user matches targeting criteria
    let isTargeted = false
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          location: true,
          experienceLevel: true,
          education: true,
        },
      })

      if (user) {
        const locationMatch = !job.targetLocation || 
                             user.location?.toLowerCase().includes(job.targetLocation.toLowerCase()) ||
                             job.targetLocation.toLowerCase().includes(user.location?.toLowerCase() || "")
        
        const experienceMatch = !job.targetExperience || 
                               user.experienceLevel === job.targetExperience
        
        const educationMatch = !job.targetEducation || 
                              user.education === job.targetEducation

        isTargeted = locationMatch && experienceMatch && educationMatch
      }
    } else {
      // Guest users - count as targeted if no specific targeting set
      isTargeted = !job.targetLocation && !job.targetExperience && !job.targetEducation
    }

    // Only count impressions that match targeting
    if (isTargeted) {
      // Record impression
      await prisma.jobImpression.create({
        data: {
          jobId,
          userId,
          ipAddress,
          userAgent,
          isTargeted: true,
        },
      })

      // Increment impression count
      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: {
          impressionsUsed: { increment: 1 },
        },
        include: {
          employer: {
            select: {
              id: true,
              adBalance: true,
            },
          },
        },
      })

      // Deduct from employer balance
      const cost = job.costPerImpression
      const newBalance = updatedJob.employer.adBalance - cost

      await prisma.user.update({
        where: { id: job.employerId },
        data: { adBalance: newBalance },
      })

      // Record transaction
      await prisma.balanceTransaction.create({
        data: {
          userId: job.employerId,
          amount: -cost,
          type: "deduction",
          description: `Impression for job: ${jobId}`,
          balanceBefore: updatedJob.employer.adBalance,
          balanceAfter: newBalance,
          relatedJobId: jobId,
        },
      })

      // Check if balance is low (less than $5 or 100 impressions remaining)
      const impressionsRemaining = job.impressionLimit ? job.impressionLimit - (updatedJob.impressionsUsed) : 0
      
      if (impressionsRemaining <= 100 && impressionsRemaining > 0) {
        await prisma.notification.create({
          data: {
            userId: job.employerId,
            type: "low_impressions",
            title: "Low Sponsored Job Impressions",
            message: `Your sponsored job has only ${impressionsRemaining} impressions remaining. Consider topping up your balance.`,
            link: `/employer/dashboard`,
          },
        })
      }

      return NextResponse.json({
        success: true,
        sponsored: true,
        impressionsRemaining,
        isTargeted: true,
      })
    }

    return NextResponse.json({
      success: true,
      sponsored: true,
      isTargeted: false,
    })
  } catch (error) {
    console.error("Error tracking impression:", error)
    return NextResponse.json({ error: "Failed to track impression" }, { status: 500 })
  }
}
