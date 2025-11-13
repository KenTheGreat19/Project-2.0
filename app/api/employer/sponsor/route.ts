import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/employer/sponsor - Sponsor a job post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    if (userRole !== "EMPLOYER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const {
      jobId,
      impressionLimit, // Number of impressions to purchase
      targetLocation,
      targetExperience,
      targetEducation,
    } = await req.json()

    if (!jobId || !impressionLimit || impressionLimit < 1000) {
      return NextResponse.json(
        { error: "jobId and impressionLimit (minimum 1000) required" },
        { status: 400 }
      )
    }

    // Check job ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (job.employerId !== userId) {
      return NextResponse.json({ error: "Not your job" }, { status: 403 })
    }

    if (job.status !== "approved") {
      return NextResponse.json(
        { error: "Job must be approved before sponsoring" },
        { status: 400 }
      )
    }

    // Calculate cost ($1 = 1000 impressions)
    const costPerImpression = 0.001
    const totalCost = impressionLimit * costPerImpression

    // Check employer balance
    const employer = await prisma.user.findUnique({
      where: { id: userId },
      select: { adBalance: true },
    })

    if (!employer || employer.adBalance < totalCost) {
      return NextResponse.json(
        {
          error: "Insufficient balance",
          required: totalCost,
          current: employer?.adBalance || 0,
        },
        { status: 400 }
      )
    }

    const balanceBefore = employer.adBalance
    const balanceAfter = balanceBefore - totalCost

    // Update job to sponsored
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        isSponsored: true,
        sponsoredUntil: null, // No time limit, only impression limit
        impressionLimit,
        impressionsUsed: 0,
        costPerImpression,
        targetLocation: targetLocation || null,
        targetExperience: targetExperience || null,
        targetEducation: targetEducation || null,
      },
    })

    // Deduct balance
    await prisma.user.update({
      where: { id: userId },
      data: { adBalance: balanceAfter },
    })

    // Record transaction
    await prisma.balanceTransaction.create({
      data: {
        userId,
        amount: -totalCost,
        type: "deduction",
        description: `Sponsored job post: ${impressionLimit} impressions`,
        balanceBefore,
        balanceAfter,
        relatedJobId: jobId,
      },
    })

    // Send notification
    await prisma.notification.create({
      data: {
        userId,
        type: "job_sponsored",
        title: "Job Post Sponsored",
        message: `Your job "${job.title}" is now sponsored with ${impressionLimit} impressions.`,
        link: `/employer/dashboard`,
      },
    })

    return NextResponse.json({
      success: true,
      job: updatedJob,
      cost: totalCost,
      remainingBalance: balanceAfter,
    })
  } catch (error) {
    console.error("Error sponsoring job:", error)
    return NextResponse.json({ error: "Failed to sponsor job" }, { status: 500 })
  }
}

// DELETE /api/employer/sponsor - Stop sponsoring a job
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    if (userRole !== "EMPLOYER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 })
    }

    // Check job ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (job.employerId !== userId) {
      return NextResponse.json({ error: "Not your job" }, { status: 403 })
    }

    if (!job.isSponsored) {
      return NextResponse.json({ error: "Job is not sponsored" }, { status: 400 })
    }

    // Calculate refund for unused impressions
    const unusedImpressions = (job.impressionLimit || 0) - job.impressionsUsed
    const refundAmount = unusedImpressions * job.costPerImpression

    if (refundAmount > 0) {
      const employer = await prisma.user.findUnique({
        where: { id: userId },
        select: { adBalance: true },
      })

      const balanceBefore = employer?.adBalance || 0
      const balanceAfter = balanceBefore + refundAmount

      // Refund balance
      await prisma.user.update({
        where: { id: userId },
        data: { adBalance: balanceAfter },
      })

      // Record refund transaction
      await prisma.balanceTransaction.create({
        data: {
          userId,
          amount: refundAmount,
          type: "refund",
          description: `Refund for ${unusedImpressions} unused impressions`,
          balanceBefore,
          balanceAfter,
          relatedJobId: jobId,
        },
      })
    }

    // Stop sponsoring
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        isSponsored: false,
        sponsoredUntil: null,
        impressionLimit: null,
        targetLocation: null,
        targetExperience: null,
        targetEducation: null,
      },
    })

    return NextResponse.json({
      success: true,
      job: updatedJob,
      refundAmount,
    })
  } catch (error) {
    console.error("Error stopping sponsorship:", error)
    return NextResponse.json({ error: "Failed to stop sponsorship" }, { status: 500 })
  }
}
