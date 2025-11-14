import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/employer/candidates/search - Search for candidates
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    // const jobTitle = searchParams.get("jobTitle") || ""
    const location = searchParams.get("location") || ""
    const experienceLevel = searchParams.get("experienceLevel")
    const skills = searchParams.get("skills")

    // Search for applicants based on criteria
    const candidates = await prisma.user.findMany({
      where: {
        role: "APPLICANT",
        ...(location && {
          location: {
            contains: location,
          },
        }),
        ...(experienceLevel && {
          experienceLevel,
        }),
        ...(skills && {
          skills: {
            contains: skills,
          },
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        experienceLevel: true,
        skills: true,
        bio: true,
        averageRating: true,
        totalReviews: true,
        createdAt: true,
      },
      take: 50,
      orderBy: {
        averageRating: "desc",
      },
    })

    return NextResponse.json(candidates)
  } catch (error) {
    console.error("Error searching candidates:", error)
    return NextResponse.json(
      { error: "Failed to search candidates" },
      { status: 500 }
    )
  }
}

// POST /api/employer/candidates/search - Save a search
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { searchName, jobTitle, location, country, experienceLevel, skills } = body

    if (!searchName) {
      return NextResponse.json(
        { error: "Search name is required" },
        { status: 400 }
      )
    }

    const savedSearch = await prisma.candidateSearch.create({
      data: {
        userId: (session.user as any).id,
        searchName,
        jobTitle,
        location,
        country,
        experienceLevel,
        skills: skills ? JSON.stringify(skills) : null,
      },
    })

    return NextResponse.json(savedSearch, { status: 201 })
  } catch (error) {
    console.error("Error saving search:", error)
    return NextResponse.json(
      { error: "Failed to save search" },
      { status: 500 }
    )
  }
}

