import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get("customerId")

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    const orders = await prisma.b2BOrder.findMany({
      where: { customerId },
      include: {
        items: { include: { product: { select: { name: true, sku: true, unit: true } } } },
        invoice: { select: { invoiceNumber: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    const mapped = orders.map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      items: o.items.map((i: any) => ({
        productName: i.product.name,
        sku: i.product.sku,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        totalPrice: Number(i.totalPrice),
      })),
      subtotal: Number(o.subtotal),
      totalAmount: Number(o.totalAmount),
      shippingAddress: o.shippingAddress,
      notes: o.notes,
      invoice: o.invoice,
      createdAt: o.createdAt,
    }))

    return NextResponse.json({ data: mapped })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerId, items, shippingAddress, notes } = body

    if (!customerId || !items || items.length === 0) {
      return NextResponse.json({ error: "Customer ID and items required" }, { status: 400 })
    }

    const customer = await prisma.b2BCustomer.findUnique({ where: { id: customerId } })
    if (!customer || customer.status !== "ACTIVE") {
      return NextResponse.json({ error: "Akun tidak aktif" }, { status: 403 })
    }

    // Calculate totals and validate stock
    let subtotal = 0
    const orderItems = []
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) return NextResponse.json({ error: `Produk ${item.productId} tidak ditemukan` }, { status: 404 })

      const unitPrice = Number(item.unitPrice) || Number(product.sellPerUnit)
      const totalPrice = item.quantity * unitPrice
      subtotal += totalPrice
      orderItems.push({ productId: item.productId, quantity: item.quantity, unitPrice, totalPrice })
    }

    const count = await prisma.b2BOrder.count()
    const orderNumber = `B2B-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`

    const order = await prisma.b2BOrder.create({
      data: {
        orderNumber,
        customerId,
        status: "PENDING",
        shippingAddress: shippingAddress || customer.companyName,
        notes,
        subtotal,
        paymentTerms: customer.paymentTerms || "net30",
        items: { create: orderItems },
      },
      include: {
        customer: { select: { companyName: true, email: true } },
        items: { include: { product: { select: { name: true, sku: true } } } },
      },
    })

    return NextResponse.json({ success: true, data: { ...order, totalAmount: Number(order.subtotal) } })
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat pesanan" }, { status: 500 })
  }
}
