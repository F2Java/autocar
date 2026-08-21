import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "autocar-admin-secret-key-change-in-production"
)

// Admin routes that require authentication
const adminRoutes = ["/admin"]
const adminApiRoutes = ["/api/admin"]
// Public admin routes (login page, login API, logout API, session check)
const publicAdminRoutes = [
  "/admin/login",
  "/api/auth/admin/login",
  "/api/auth/admin/logout",
  "/api/auth/admin/me",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is an admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isAdminApi = adminApiRoutes.some((route) => pathname.startsWith(route))
  const isPublicAdmin = publicAdminRoutes.some((route) => pathname.startsWith(route))

  // Skip middleware for public admin routes and non-admin routes
  if (!isAdminRoute && !isAdminApi) {
    return NextResponse.next()
  }

  // Allow public admin routes without auth
  if (isPublicAdmin) {
    return NextResponse.next()
  }

  // Get admin token from cookies
  const token = request.cookies.get("admin_token")?.value

  if (!token) {
    // For API routes, return 401
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }
    // For page routes, redirect to login
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify JWT token
    await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch {
    // Invalid or expired token
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }
    // Redirect to login
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}
