import { NextResponse } from "next/server"
// import { verifyTwoFactorToken } from "@/lib/adminAuth"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import speakeasy from "speakeasy"

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      )
    }

    // Get admin user
    const admin = await prisma.user.findFirst({
      where: {
        email,
        role: "ADMIN",
        twoFactorEnabled: true,
      },
    })

    if (!admin || !admin.twoFactorSecret) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify 2FA token
    const isValid = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: "base32",
      token,
      window: 2,
    })

    if (!isValid) {
      return NextResponse.json({ error: "Invalid 2FA token" }, { status: 401 })
    }

    // Set secure admin session cookie
    const cookieStore = await cookies()
    const sessionData = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      timestamp: Date.now(),
    }
    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString("base64")
    
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("2FA verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
