import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: { select: { id: true, name: true } },
        images: { where: { isPrimary: true }, take: 1, select: { url: true, thumbnail: true } },
        warehouseStock: {
          select: { quantity: true, warehouse: { select: { name: true } } },
        },
        uoms: { where: { isBase: true }, take: 1, include: { uom: true } },
      },
      orderBy: { name: "asc" },
    })

    const mapped = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      sku: p.sku,
      price: Number(p.sellPerUnit),
      unit: p.unit,
      image: p.images[0]?.url || null,
      thumbnail: p.images[0]?.thumbnail || null,
      category: p.category?.name || "",
      totalStock: p.warehouseStock?.reduce((sum: number, ws: any) => sum + ws.quantity, 0) || 0,
      warehouseStock: p.warehouseStock?.map((ws: any) => ({ warehouse: ws.warehouse?.name || "", quantity: ws.quantity })) || [],
      uom: p.uoms?.[0]?.uom?.abbreviation || p.unit,
    }))

    return NextResponse.json({ data: mapped })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 })
  }
}
