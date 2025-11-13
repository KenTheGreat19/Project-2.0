import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const jobSchema = z.object({
  title: z.string().min(3).optional(),
  company: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  type: z.enum(["full_time", "part_time", "contract", "internship"]).optional(),
  description: z.string().min(50).optional(),
  applyUrl: z.string().url().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
})

// GET - Get single job
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        employer: {
          select: { name: true, email: true, companyName: true }
        }
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

// PATCH - Update job
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    // Only employer who owns job or admin can update
    if (userRole !== "ADMIN" && job.employerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const data = jobSchema.parse(body)

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(updatedJob)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

// DELETE - Delete job
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    // Only employer who owns job or admin can delete
    if (userRole !== "ADMIN" && job.employerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.job.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
