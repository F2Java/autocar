import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Mock - in production, query database
  const car = {
    id: "1",
    slug,
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
    coverImage: "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=1200",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    features: ["Turbo", "Leather Seats", "Apple CarPlay", "360 Camera"],
    isFeatured: true,
    dealerName: "AutoCar Premium",
    dealerWhatsapp: "6281234567890",
    dealerPhone: "+62 812-3456-7890",
    dealerEmail: "sales@autocar-premium.com",
    horsepower: 382,
    mileage: 0,
    views: 1247,
    description: "Brand new 2024 Toyota GR Supra with full warranty.",
    specs: {
      engine: "3.0L Turbocharged Inline-6",
      horsepower: 382,
      torque: "500 Nm",
      drivetrain: "RWD",
      topSpeed: 250,
      acceleration: "0-100 km/h in 4.1s",
    },
  }

  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 })
  }

  return NextResponse.json({ data: car })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await request.json()

  const { name, email, phone, message, preferredContact } = body

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    )
  }

  // In production: save inquiry to database and send notification
  const inquiry = {
    id: Date.now().toString(),
    carSlug: slug,
    name,
    email,
    phone,
    message,
    preferredContact,
    status: "new",
    createdAt: new Date().toISOString(),
  }

  // Trigger WhatsApp/email notification to seller
  // await notifySeller(slug, inquiry)

  return NextResponse.json(
    { data: inquiry, message: "Inquiry submitted successfully" },
    { status: 201 }
  )
}
