import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const [
      totalCars,
      activeCars,
      pendingCars,
      soldCars,
      totalInquiries,
      newInquiries,
      featuredCars,
      totalViews,
      carsByCondition,
      carsByFuelType,
      recentCars,
      recentInquiries,
    ] = await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { status: "AVAILABLE" } }),
      prisma.car.count({ where: { status: "PENDING" } }),
      prisma.car.count({ where: { status: "SOLD" } }),
      prisma.carInquiry.count(),
      prisma.carInquiry.count({ where: { status: "NEW" } }),
      prisma.car.count({ where: { isFeatured: true } }),
      prisma.car.aggregate({ _sum: { views: true } }),
      prisma.car.groupBy({
        by: ["condition"],
        _count: true,
      }),
      prisma.car.groupBy({
        by: ["fuelType"],
        _count: true,
      }),
      prisma.car.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          slug: true,
          title: true,
          make: true,
          model: true,
          year: true,
          condition: true,
          status: true,
          price: true,
          coverImage: true,
          views: true,
          createdAt: true,
        },
      }),
      prisma.carInquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          car: {
            select: { title: true, slug: true },
          },
        },
      }),
    ])

    return NextResponse.json({
      data: {
        stats: {
          totalCars,
          activeCars,
          pendingCars,
          soldCars,
          totalInquiries,
          newInquiries,
          featuredCars,
          totalViews: Number(totalViews._sum.views || 0),
        },
        distribution: {
          byCondition: carsByCondition.map((c) => ({
            name: c.condition,
            count: c._count,
          })),
          byFuelType: carsByFuelType.map((c) => ({
            name: c.fuelType,
            count: c._count,
          })),
        },
        recentCars: recentCars.map((c) => ({
          ...c,
          price: Number(c.price),
          createdAt: c.createdAt.toISOString(),
        })),
        recentInquiries: recentInquiries.map((i) => ({
          ...i,
          createdAt: i.createdAt.toISOString(),
        })),
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
