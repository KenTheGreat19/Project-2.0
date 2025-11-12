import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/reviews?userId=xxx - Get reviews for a user (employer or applicant)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const applicationId = searchParams.get("applicationId")

    if (applicationId) {
      // Get reviews for a specific application
      const reviews = await prisma.review.findMany({
        where: {
          applicationId,
          isVisible: true,
        },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              role: true,
              companyName: true,
            },
          },
          reviewee: {
            select: {
              id: true,
              name: true,
              role: true,
              companyName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return NextResponse.json(reviews)
    }

    if (userId) {
      // Get all visible reviews for a user (as reviewee)
      const reviews = await prisma.review.findMany({
        where: {
          revieweeId: userId,
          isVisible: true,
        },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              role: true,
              companyName: true,
            },
          },
          application: {
            include: {
              job: {
                select: {
                  title: true,
                  company: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return NextResponse.json(reviews)
    }

    return NextResponse.json({ error: "userId or applicationId required" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST /api/reviews - Submit a review
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      applicationId,
      revieweeId,
      reviewType, // "employer_review" or "applicant_review"
      overallRating,
      communication,
      professionalism,
      punctuality,
      skills,
      fairness,
      workEnvironment,
      paymentTimeliness,
      comment,
    } = body

    // Validate required fields
    if (!applicationId || !revieweeId || !reviewType || !overallRating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            employer: true,
          },
        },
        applicant: true,
      },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Verify user is authorized to review
    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    if (reviewType === "employer_review" && userId !== application.applicantId) {
      return NextResponse.json({ error: "Only the applicant can review the employer" }, { status: 403 })
    }

    if (reviewType === "applicant_review" && userId !== application.job.employerId) {
      return NextResponse.json({ error: "Only the employer can review the applicant" }, { status: 403 })
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        applicationId,
        reviewerId: userId,
        reviewType,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already submitted a review" }, { status: 400 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        applicationId,
        reviewerId: userId,
        revieweeId,
        reviewType,
        overallRating,
        communication,
        professionalism,
        punctuality,
        skills,
        fairness,
        workEnvironment,
        paymentTimeliness,
        comment,
        isVisible: false, // Will be made visible by processReviewVisibility script
      },
    })

    // Update application review status
    if (reviewType === "employer_review") {
      await prisma.application.update({
        where: { id: applicationId },
        data: { applicantReviewed: true },
      })
    } else {
      await prisma.application.update({
        where: { id: applicationId },
        data: { employerReviewed: true },
      })
    }

    // Check if both reviews are now submitted - if so, make both visible
    const updatedApp = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (updatedApp?.employerReviewed && updatedApp?.applicantReviewed) {
      await prisma.review.updateMany({
        where: { applicationId },
        data: { isVisible: true },
      })
    }

    // Update reviewee's average rating
    await updateUserRating(revieweeId)

    // Create notification for reviewee
    await prisma.notification.create({
      data: {
        userId: revieweeId,
        type: "review_received",
        title: "New review received",
        message: `You received a ${overallRating}-star review`,
        link: `/profile/${revieweeId}`,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

// Helper function to update user's average rating
async function updateUserRating(userId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      revieweeId: userId,
      isVisible: true,
    },
  })

  if (reviews.length === 0) return

  const avgRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length

  await prisma.user.update({
    where: { id: userId },
    data: {
      averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
    },
  })
}
