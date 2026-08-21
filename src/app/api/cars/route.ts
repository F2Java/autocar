import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const search = searchParams.get("search") || ""
  const make = searchParams.get("make") || ""
  const model = searchParams.get("model") || ""
  const condition = searchParams.get("condition") || ""
  const fuelType = searchParams.get("fuelType") || ""
  const transmission = searchParams.get("transmission") || ""
  const bodyType = searchParams.get("bodyType") || ""
  const yearMin = searchParams.get("yearMin")
  const yearMax = searchParams.get("yearMax")
  const priceMin = searchParams.get("priceMin")
  const priceMax = searchParams.get("priceMax")
  const sortBy = searchParams.get("sortBy") || "newest"
  const featured = searchParams.get("featured") === "true"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "24")

  // Build Prisma where clause
  const where: Record<string, unknown> = {
    status: "AVAILABLE",
  }

  if (search) {
    where.OR = [
      { make: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }
  if (make) where.make = make
  if (model) where.model = model
  if (condition) where.condition = condition.toUpperCase()
  if (fuelType) where.fuelType = fuelType.toUpperCase()
  if (transmission) where.transmission = transmission.toUpperCase()
  if (bodyType) where.bodyType = bodyType.toUpperCase().replace(/-/g, "_")
  if (featured) where.isFeatured = true
  if (yearMin || yearMax) {
    where.year = {}
    if (yearMin) (where.year as Record<string, number>).gte = parseInt(yearMin)
    if (yearMax) (where.year as Record<string, number>).lte = parseInt(yearMax)
  }
  if (priceMin || priceMax) {
    where.price = {}
    if (priceMin) (where.price as Record<string, number>).gte = parseInt(priceMin)
    if (priceMax) (where.price as Record<string, number>).lte = parseInt(priceMax)
  }

  // Build orderBy
  let orderBy: Record<string, string> = {}
  switch (sortBy) {
    case "price_asc":
      orderBy = { price: "asc" }
      break
    case "price_desc":
      orderBy = { price: "desc" }
      break
    case "oldest":
      orderBy = { createdAt: "asc" }
      break
    case "newest":
    default:
      orderBy = { createdAt: "desc" }
      break
  }

  try {
    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          videos: { take: 1 },
          category: true,
        },
      }),
      prisma.car.count({ where }),
    ])

    // Transform to match frontend expectations
    const transformed = cars.map((car) => ({
      id: car.id,
      slug: car.slug,
      title: car.title,
      make: car.make,
      model: car.model,
      year: car.year,
      condition: car.condition,
      price: Number(car.price),
      mileage: car.mileage || 0,
      fuelType: car.fuelType,
      transmission: car.transmission,
      city: car.city || "",
      province: car.province || "",
      coverImage: car.coverImage || car.images[0]?.url || null,
      videoUrl: car.videoUrl || car.videos[0]?.url || null,
      videoThumbnail: car.videoThumbnail || null,
      features: car.features,
      isFeatured: car.isFeatured,
      negotiable: car.negotiable,
      dealerName: car.dealerName || "",
      dealerWhatsapp: car.dealerWhatsapp || "",
      exteriorColor: car.exteriorColor || "",
      horsepower: car.horsepower || 0,
      views: car.views,
      createdAt: car.createdAt.toISOString(),
    }))

    return NextResponse.json({
      data: transformed,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ["make", "model", "year", "condition", "price"]
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Generate slug
    const slug = `${body.make}-${body.model}-${body.year}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    // Check for duplicate slug
    const existing = await prisma.car.findUnique({ where: { slug } })
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const car = await prisma.car.create({
      data: {
        slug: finalSlug,
        title: body.title || `${body.year} ${body.make} ${body.model}`,
        description: body.description || null,
        make: body.make,
        model: body.model,
        year: parseInt(body.year),
        condition: body.condition.toUpperCase(),
        status: "PENDING",
        bodyType: body.bodyType?.toUpperCase().replace(/-/g, "_") || "SEDAN",
        fuelType: body.fuelType?.toUpperCase() || "GASOLINE",
        transmission: body.transmission?.toUpperCase() || "AUTOMATIC",
        engine: body.engine || null,
        horsepower: body.horsepower ? parseInt(body.horsepower) : null,
        torque: body.torque || null,
        drivetrain: body.drivetrain || null,
        mileage: body.mileage ? parseInt(body.mileage) : null,
        price: parseFloat(body.price),
        negotiable: body.negotiable !== false,
        exteriorColor: body.exteriorColor || null,
        interiorColor: body.interiorColor || null,
        features: body.features || [],
        coverImage: body.coverImage || null,
        videoUrl: body.videoUrl || null,
        city: body.city || null,
        province: body.province || null,
        address: body.address || null,
        sellerType: body.sellerType || "individual",
        dealerName: body.dealerName || null,
        dealerPhone: body.dealerPhone || null,
        dealerEmail: body.dealerEmail || null,
        dealerWhatsapp: body.dealerWhatsapp || null,
        sellerId: body.sellerId || null,
      },
    })

    return NextResponse.json(
      { data: car, message: "Car listing created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating car:", error)
    return NextResponse.json(
      { error: "Failed to create car listing" },
      { status: 500 }
    )
  }
}
