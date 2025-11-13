const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kentaurch.kcgl@gmail.com"
const DEFAULT_PASSWORD = "admin123"

async function initializeAdmin() {
  try {
    console.log("🔐 Initializing admin account...")

    // Check if admin exists
    let admin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    })

    if (admin) {
      console.log("✅ Admin account already exists")
      console.log(`📧 Email: ${ADMIN_EMAIL}`)
      console.log(`🔑 Role: ${admin.role}`)
      console.log(`🛡️  2FA Enabled: ${admin.twoFactorEnabled}`)
      return
    }

    // Create admin account
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12)

    admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: "Administrator",
        password: hashedPassword,
        role: "ADMIN",
        twoFactorEnabled: false,
        loginAttempts: 0,
      },
    })

    console.log("✅ Admin account created successfully!")
    console.log(`📧 Email: ${ADMIN_EMAIL}`)
    console.log(`🔑 Default Password: ${DEFAULT_PASSWORD}`)
    console.log("")
    console.log("⚠️  IMPORTANT SECURITY STEPS:")
    console.log("1. Sign in at /admin/signin")
    console.log("2. Setup Two-Factor Authentication")
    console.log("3. Change your default password")
    console.log("")
    console.log("🔒 The admin portal is protected with:")
    console.log("   • Email/password authentication")
    console.log("   • Two-factor authentication (TOTP)")
    console.log("   • Rate limiting (5 attempts, 15-min lockout)")
    console.log("   • Secure session cookies")
    console.log("   • Security headers (CSP, X-Frame-Options, etc.)")
    console.log("   • Middleware route protection")
  } catch (error) {
    console.error("❌ Error initializing admin account:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

initializeAdmin()
