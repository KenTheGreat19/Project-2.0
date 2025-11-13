import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public admin routes (no auth required)
const PUBLIC_ADMIN_ROUTES = [
  "/admin/signin",
  "/api/admin/auth/signin",
  "/api/admin/auth/signout",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public admin routes
  const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.some((route) => 
    pathname.startsWith(route)
  )

  if (isPublicAdminRoute) {
    return NextResponse.next()
  }

  // Protect all admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    try {
      // Check for admin session cookie
      const adminSession = request.cookies.get("admin_session")
      
      if (!adminSession) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Unauthorized - Admin access only" },
            { status: 401 }
          )
        }
        
        const signInUrl = new URL("/admin/signin", request.url)
        signInUrl.searchParams.set("from", pathname)
        return NextResponse.redirect(signInUrl)
      }

      // Verify session token
      try {
        const sessionData = JSON.parse(
          Buffer.from(adminSession.value, 'base64').toString('utf-8')
        );

        // Check if session is expired (8 hours)
        const sessionAge = Date.now() - sessionData.timestamp;
        if (sessionAge > 8 * 60 * 60 * 1000) {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json(
              { error: "Session expired" },
              { status: 401 }
            )
          }
          
          const signInUrl = new URL("/admin/signin", request.url)
          signInUrl.searchParams.set("from", pathname)
          return NextResponse.redirect(signInUrl)
        }

        // Verify admin role
        if (sessionData.role !== 'ADMIN') {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json(
              { error: "Forbidden - Admin access only" },
              { status: 403 }
            )
          }
          
          return NextResponse.redirect(new URL("/", request.url))
        }
      } catch (error) {
        // Invalid session token
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Invalid session" },
            { status: 401 }
          )
        }
        
        const signInUrl = new URL("/admin/signin", request.url)
        return NextResponse.redirect(signInUrl)
      }

      // Add security headers
      const response = NextResponse.next()
      
      // Prevent caching of admin pages
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
      response.headers.set("Pragma", "no-cache")
      response.headers.set("Expires", "0")
      
      // Additional security headers
      response.headers.set("X-Frame-Options", "DENY")
      response.headers.set("X-Content-Type-Options", "nosniff")
      response.headers.set("Referrer-Policy", "no-referrer")
      response.headers.set(
        "Permissions-Policy",
        "geolocation=(), microphone=(), camera=()"
      )
      
      // CSP to prevent XSS
      response.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
      )

      return response
    } catch (error) {
      console.error("Middleware error:", error)
      
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Authentication error" },
          { status: 500 }
        )
      }
      
      return NextResponse.redirect(new URL("/admin/signin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}
