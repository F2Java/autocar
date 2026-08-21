import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const customer = await prisma.b2BCustomer.findUnique({ where: { email } })
    if (!customer) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    if (customer.status !== "ACTIVE") {
      return NextResponse.json({ error: "Akun belum aktif. Silakan tunggu persetujuan admin." }, { status: 403 })
    }

    const isValid = await bcrypt.compare(password, customer.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: customer.id,
        code: customer.code,
        companyName: customer.companyName,
        contactPerson: customer.contactPerson,
        email: customer.email,
        phone: customer.phone,
        paymentTerms: customer.paymentTerms,
        creditLimit: Number(customer.creditLimit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
