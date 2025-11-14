import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const organizationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().url("Invalid URL").optional(),
  companyDescription: z.string().optional(),
  companySize: z.string().optional(),
  industry: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
})

// GET organization settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        companyName: true,
        contactWebsite: true,
        bio: true,
        employerType: true,
        email: true,
        phone: true,
        contactEmail: true,
        contactPhone: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      companyName: user.companyName,
      companyWebsite: user.contactWebsite,
      companyDescription: user.bio,
      companySize: user.employerType,
      industry: null, // Field doesn't exist in schema
      contactEmail: user.email,
      contactPhone: user.phone,
    })
  } catch (error) {
    console.error("Error fetching organization:", error)
    return NextResponse.json(
      { error: "Failed to fetch organization" },
      { status: 500 }
    )
  }
}

// PATCH - Update organization settings
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = organizationSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        companyName: validatedData.companyName,
        contactWebsite: validatedData.companyWebsite,
        bio: validatedData.companyDescription,
        employerType: validatedData.companySize,
        phone: validatedData.contactPhone,
      },
      select: {
        companyName: true,
        contactWebsite: true,
        bio: true,
        employerType: true,
      },
    })

    return NextResponse.json({
      companyName: updatedUser.companyName,
      companyWebsite: updatedUser.contactWebsite,
      companyDescription: updatedUser.bio,
      companySize: updatedUser.employerType,
      industry: null,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error updating organization:", error)
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    )
  }
}
