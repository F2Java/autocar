import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { signAdminToken, adminTokenCookie } from "@/lib/admin-auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is disabled. Contact support." },
        { status: 403 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check role - only ADMIN, SUPER_ADMIN, MANAGER can access admin panel
    const adminRoles = ["ADMIN", "SUPER_ADMIN", "MANAGER"]
    if (!adminRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      )
    }

    // Sign JWT token
    const token = await signAdminToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Set cookie and return response
    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    response.cookies.set(adminTokenCookie(token))

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}
