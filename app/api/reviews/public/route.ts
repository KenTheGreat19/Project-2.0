import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/reviews/public?employerId=xxx - Get public reviews for an employer
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const employerId = searchParams.get("employerId")

    if (!employerId) {
      return NextResponse.json({ error: "employerId required" }, { status: 400 })
    }

    const reviews = await prisma.employerReview.findMany({
      where: {
        employerId,
        isVisible: true,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    // Hide names for anonymous reviews
    const reviewsWithAnonymity = reviews.map(review => ({
      ...review,
      showName: !review.isAnonymous,
    }))

    return NextResponse.json({
      reviews: reviewsWithAnonymity,
      averageRating,
      totalReviews: reviews.length,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST /api/reviews/public - Submit a public review for an employer
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id
    
    // Only applicants can post reviews
    if (userRole !== "APPLICANT") {
      return NextResponse.json(
        { error: "Only applicants can review employers" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { employerId, rating, comment, isAnonymous } = body

    if (!employerId || !rating || !comment) {
      return NextResponse.json(
        { error: "employerId, rating, and comment required" },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Verify employer exists
    const employer = await prisma.user.findUnique({
      where: { id: employerId, role: "EMPLOYER" },
    })

    if (!employer) {
      return NextResponse.json({ error: "Employer not found" }, { status: 404 })
    }

    // Check if user already reviewed this employer
    const existingReview = await prisma.employerReview.findFirst({
      where: {
        employerId,
        reviewerId: userId,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this employer" },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.employerReview.create({
      data: {
        employerId,
        reviewerId: userId,
        rating,
        comment,
        isAnonymous: isAnonymous || false,
        isVisible: true,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update employer's average rating
    const allReviews = await prisma.employerReview.findMany({
      where: { employerId, isVisible: true },
      select: { rating: true },
    })

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await prisma.user.update({
      where: { id: employerId },
      data: {
        averageRating,
        totalReviews: allReviews.length,
      },
    })

    const response = {
      ...review,
      showName: !isAnonymous,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
