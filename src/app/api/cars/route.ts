import { NextRequest, NextResponse } from "next/server"

// Mock data - in production, this would query the database
const mockCars = [
  {
    id: "1",
    slug: "toyota-supra-2024",
    title: "2024 Toyota GR Supra 3.0",
    make: "Toyota",
    model: "GR Supra",
    year: 2024,
    condition: "NEW",
    price: 1250000000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    city: "Jakarta",
    province: "DKI Jakarta",
    coverImage: "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    features: ["Turbo", "Leather Seats", "Apple CarPlay"],
    isFeatured: true,
    dealerName: "AutoCar Premium",
    dealerWhatsapp: "6281234567890",
    horsepower: 382,
    mileage: 0,
    views: 1247,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "bmw-m4-2024",
    title: "2024 BMW M4 Competition",
    make: "BMW",
    model: "M4 Competition",
    year: 2024,
    condition: "NEW",
    price: 2100000000,
    mileage: 5000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    city: "Surabaya",
    province: "Jawa Timur",
    coverImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    features: ["M Sport", "Carbon Fiber"],
    isFeatured: true,
    dealerName: "BMW AutoCenter",
    dealerWhatsapp: "6281234567891",
    horsepower: 503,
    views: 892,
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const search = searchParams.get("search") || ""
  const make = searchParams.get("make") || ""
  const model = searchParams.get("model") || ""
  const condition = searchParams.get("condition") || ""
  const fuelType = searchParams.get("fuelType") || ""
  const transmission = searchParams.get("transmission") || ""
  const yearMin = searchParams.get("yearMin")
  const yearMax = searchParams.get("yearMax")
  const priceMin = searchParams.get("priceMin")
  const priceMax = searchParams.get("priceMax")
  const sortBy = searchParams.get("sortBy") || "newest"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")

  let filtered = [...mockCars]

  // Apply filters
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (car) =>
        car.make.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        car.title.toLowerCase().includes(q)
    )
  }
  if (make) filtered = filtered.filter((car) => car.make === make)
  if (model) filtered = filtered.filter((car) => car.model === model)
  if (condition) filtered = filtered.filter((car) => car.condition === condition)
  if (fuelType) filtered = filtered.filter((car) => car.fuelType === fuelType)
  if (transmission) filtered = filtered.filter((car) => car.transmission === transmission)
  if (yearMin) filtered = filtered.filter((car) => car.year >= parseInt(yearMin))
  if (yearMax) filtered = filtered.filter((car) => car.year <= parseInt(yearMax))
  if (priceMin) filtered = filtered.filter((car) => car.price >= parseInt(priceMin))
  if (priceMax) filtered = filtered.filter((car) => car.price <= parseInt(priceMax))

  // Sort
  switch (sortBy) {
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price)
      break
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price)
      break
    case "oldest":
      filtered.sort((a, b) => a.year - b.year)
      break
    case "newest":
    default:
      filtered.sort((a, b) => b.year - a.year)
      break
  }

  // Paginate
  const start = (page - 1) * limit
  const end = start + limit
  const paginated = filtered.slice(start, end)

  return NextResponse.json({
    data: paginated,
    pagination: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ["make", "model", "year", "condition", "price", "phone", "email"]
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

    // In production: save to database
    const newCar = {
      id: Date.now().toString(),
      slug,
      ...body,
      status: "PENDING",
      views: 0,
      favorites: 0,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      { data: newCar, message: "Car listing created successfully" },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create car listing" },
      { status: 500 }
    )
  }
}
