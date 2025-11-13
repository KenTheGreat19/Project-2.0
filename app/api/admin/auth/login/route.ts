import { NextResponse } from "next/server"
// import { verifyAdminCredentials } from "@/lib/adminAuth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Verify admin credentials
    const admin = await prisma.user.findFirst({
      where: {
        email,
        role: "ADMIN",
      },
    })

    if (!admin || !admin.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, admin.password)
    
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session token
    const sessionData = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      timestamp: Date.now(),
    }

    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString("base64")

    const response = NextResponse.json({ success: true })
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60, // 8 hours
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
