import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { CarDetailClient } from "./car-detail-client"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params

  let car

  try {
    car = await prisma.car.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        videos: true,
        category: true,
      },
    })
  } catch (error) {
    console.error("Error fetching car:", error)
    notFound()
  }

  if (!car) {
    notFound()
  }

  // Increment view count
  try {
    await prisma.car.update({
      where: { id: car.id },
      data: { views: { increment: 1 } },
    })
  } catch {
    // Ignore view count errors
  }

  // Transform to match client component expectations
  const carData = {
    id: car.id,
    slug: car.slug,
    title: car.title,
    description: car.description || "",
    make: car.make,
    model: car.model,
    year: car.year,
    condition: car.condition,
    price: Number(car.price),
    originalPrice: car.originalPrice ? Number(car.originalPrice) : null,
    currency: car.currency,
    negotiable: car.negotiable,
    installmentAvail: car.installmentAvail,
    installmentFrom: car.installmentFrom ? Number(car.installmentFrom) : null,
    downPayment: car.downPayment ? Number(car.downPayment) : null,
    mileage: car.mileage || 0,
    previousOwners: car.previousOwners || 0,
    fuelType: car.fuelType,
    transmission: car.transmission,
    bodyType: car.bodyType,
    city: car.city || "",
    province: car.province || "",
    address: car.address || "",
    exteriorColor: car.exteriorColor || "",
    interiorColor: car.interiorColor || "",
    horsepower: car.horsepower || 0,
    torque: car.torque || "",
    engine: car.engine || "",
    drivetrain: car.drivetrain || "",
    topSpeed: car.topSpeed || 0,
    acceleration: car.acceleration || "",
    features: car.features,
    coverImage: car.coverImage || car.images[0]?.url || "",
    videoUrl: car.videoUrl || car.videos[0]?.url || "",
    videoThumbnail: car.videoThumbnail || null,
    images: car.images.map((img) => img.url),
    dealerName: car.dealerName || "",
    dealerPhone: car.dealerPhone || "",
    dealerEmail: car.dealerEmail || "",
    dealerWhatsapp: car.dealerWhatsapp || "",
    dealerType: car.sellerType,
    dealerAvatar: null,
    views: car.views,
    favorites: car.favorites,
    isFeatured: car.isFeatured,
    createdAt: car.createdAt.toISOString(),
  }

  return <CarDetailClient car={carData} />
}
