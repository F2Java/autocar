import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const car = await prisma.car.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        videos: true,
        category: true,
        inquiries: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            name: true,
            message: true,
            preferredContact: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    // Increment view count
    await prisma.car.update({
      where: { id: car.id },
      data: { views: { increment: 1 } },
    })

    // Transform to match frontend expectations
    const transformed = {
      id: car.id,
      slug: car.slug,
      title: car.title,
      description: car.description,
      make: car.make,
      model: car.model,
      year: car.year,
      condition: car.condition,
      status: car.status,
      bodyType: car.bodyType,
      fuelType: car.fuelType,
      transmission: car.transmission,
      engine: car.engine,
      horsepower: car.horsepower,
      torque: car.torque,
      drivetrain: car.drivetrain,
      mileage: car.mileage || 0,
      price: Number(car.price),
      currency: car.currency,
      negotiable: car.negotiable,
      exteriorColor: car.exteriorColor,
      interiorColor: car.interiorColor,
      features: car.features,
      coverImage: car.coverImage,
      videoUrl: car.videoUrl,
      videoThumbnail: car.videoThumbnail,
      images: car.images.map((img) => img.url),
      city: car.city,
      province: car.province,
      dealerName: car.dealerName,
      dealerPhone: car.dealerPhone,
      dealerEmail: car.dealerEmail,
      dealerWhatsapp: car.dealerWhatsapp,
      dealerType: car.sellerType,
      views: car.views + 1,
      favorites: car.favorites,
      isFeatured: car.isFeatured,
      createdAt: car.createdAt.toISOString(),
      specs: {
        engine: car.engine,
        horsepower: car.horsepower,
        torque: car.torque,
        drivetrain: car.drivetrain,
        topSpeed: car.topSpeed,
        acceleration: car.acceleration,
        fuelConsumption: car.fuelConsumption,
        bodyType: car.bodyType,
        numDoors: car.numDoors,
        numSeats: car.numSeats,
      },
      recentInquiries: car.inquiries,
    }

    return NextResponse.json({ data: transformed })
  } catch (error) {
    console.error("Error fetching car:", error)
    return NextResponse.json(
      { error: "Failed to fetch car details" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const body = await request.json()
    const { name, email, phone, message, preferredContact } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    // Find the car
    const car = await prisma.car.findUnique({ where: { slug } })
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    // Create inquiry
    const inquiry = await prisma.carInquiry.create({
      data: {
        carId: car.id,
        name,
        email,
        phone: phone || null,
        message: message || null,
        preferredContact: preferredContact || "email",
        status: "NEW",
      },
    })

    // TODO: Send WhatsApp/SMS notification to seller
    // TODO: Send email notification to seller

    return NextResponse.json(
      { data: inquiry, message: "Inquiry submitted successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating inquiry:", error)
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const body = await request.json()

    const car = await prisma.car.findUnique({ where: { slug } })
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    const updated = await prisma.car.update({
      where: { id: car.id },
      data: {
        title: body.title,
        description: body.description,
        make: body.make,
        model: body.model,
        year: body.year ? parseInt(body.year) : undefined,
        condition: body.condition?.toUpperCase(),
        status: body.status?.toUpperCase(),
        bodyType: body.bodyType?.toUpperCase().replace(/-/g, "_"),
        fuelType: body.fuelType?.toUpperCase(),
        transmission: body.transmission?.toUpperCase(),
        engine: body.engine,
        horsepower: body.horsepower ? parseInt(body.horsepower) : undefined,
        mileage: body.mileage ? parseInt(body.mileage) : undefined,
        price: body.price ? parseFloat(body.price) : undefined,
        negotiable: body.negotiable,
        isFeatured: body.isFeatured,
        exteriorColor: body.exteriorColor,
        interiorColor: body.interiorColor,
        features: body.features,
        coverImage: body.coverImage,
        videoUrl: body.videoUrl,
        city: body.city,
        province: body.province,
        dealerName: body.dealerName,
        dealerPhone: body.dealerPhone,
        dealerEmail: body.dealerEmail,
        dealerWhatsapp: body.dealerWhatsapp,
      },
    })

    return NextResponse.json({ data: updated, message: "Car updated successfully" })
  } catch (error) {
    console.error("Error updating car:", error)
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const car = await prisma.car.findUnique({ where: { slug } })
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    await prisma.car.delete({ where: { id: car.id } })

    return NextResponse.json({ message: "Car deleted successfully" })
  } catch (error) {
    console.error("Error deleting car:", error)
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    )
  }
}
