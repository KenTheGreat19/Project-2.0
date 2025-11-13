import { NextResponse } from "next/server"
import { verifyTwoFactorToken } from "@/lib/adminAuth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, token, confirm } = await request.json()

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      )
    }

    const result = await verifyTwoFactorToken(email, token, confirm)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Verification failed" },
        { status: 401 }
      )
    }

    // Set secure admin session cookie
    const cookieStore = await cookies()
    cookieStore.set("admin-authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/admin",
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
