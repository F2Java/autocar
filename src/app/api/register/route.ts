import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyName, contactPerson, email, phone, password } = body

    if (!companyName || !contactPerson || !email || !password) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 })
    }

    const existing = await prisma.b2BCustomer.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const merchant = await prisma.merchant.findFirst({ orderBy: { createdAt: "asc" } })
    const count = await prisma.b2BCustomer.count()
    const code = `B2B-${String(count + 1).padStart(4, "0")}`

    const customer = await prisma.b2BCustomer.create({
      data: {
        code, companyName, contactPerson, email, phone,
        passwordHash,
        merchantId: merchant?.id,
        status: "PENDING",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil! Silakan tunggu persetujuan admin.",
      data: { id: customer.id, companyName: customer.companyName, email: customer.email },
    })
  } catch (error) {
    return NextResponse.json({ error: "Pendaftaran gagal" }, { status: 500 })
  }
}
