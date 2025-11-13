import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"

/**
 * Standardized error response handler
 */
export function handleApiError(error: unknown, context?: string) {
  console.error(`API Error${context ? ` in ${context}` : ""}:`, error)

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    // Don't expose internal error details in production
    const isDev = process.env.NODE_ENV === "development"
    return NextResponse.json(
      {
        error: context || "An error occurred",
        details: isDev ? error.message : undefined,
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: context || "An unexpected error occurred" },
    { status: 500 }
  )
}

/**
 * Verify user session and role
 */
export async function verifySession(requiredRole?: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  const userRole = (session.user as any).role
  const userId = (session.user as any).id

  if (requiredRole && userRole !== requiredRole) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: `Access denied. ${requiredRole} role required.` },
        { status: 403 }
      ),
    }
  }

  return {
    authorized: true,
    session,
    userId,
    userRole,
  }
}

/**
 * Create a standardized success response
 */
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return input
  
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove inline event handlers
    .slice(0, 10000) // Limit length
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  page?: string | null,
  limit?: string | null
): { page: number; limit: number } {
  const pageNum = Math.max(1, parseInt(page || "1") || 1)
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || "20") || 20))

  return { page: pageNum, limit: limitNum }
}

/**
 * Calculate offset for database queries
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unexpected error occurred"
}

/**
 * Check if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Rate limiting helper (basic implementation)
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = requestCounts.get(identifier)

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count }
}

/**
 * Clean up old rate limit records periodically
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key)
    }
  }
}, 300000) // Clean up every 5 minutes
