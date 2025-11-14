import { NextResponse } from "next/server"
// import { setupTwoFactor } from "@/lib/adminAuth"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kentaurch.kcgl@gmail.com"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // TODO: Implement 2FA setup
    // const result = await setupTwoFactor()

    return NextResponse.json({
      success: false,
      message: "2FA setup not implemented yet. Use /api/admin/auth/2fa endpoint instead.",
    }, { status: 501 })
  } catch (error) {
    console.error("2FA setup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
