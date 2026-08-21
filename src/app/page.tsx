import prisma from "@/lib/prisma"
import { HomePageClient } from "./home-client"

export default async function HomePage() {
  // Fetch featured cars from database
  let featuredCars: Array<{
    id: string; slug: string; title: string; make: string; model: string;
    year: number; condition: "NEW" | "USED" | "CERTIFIED_PRE_OWNED"; price: number; mileage: number | undefined;
    fuelType: string; transmission: string; city: string; province: string;
    coverImage: string | undefined; videoUrl: string | undefined; features: string[];
    isFeatured: boolean; negotiable: boolean; dealerName: string;
    dealerWhatsapp: string; exteriorColor: string; horsepower: number;
    views: number;
  }> = []

  try {
    const cars = await prisma.car.findMany({
      where: { isFeatured: true, status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        videos: { take: 1 },
      },
    })

    featuredCars = cars.map((car) => ({
      id: car.id,
      slug: car.slug,
      title: car.title,
      make: car.make,
      model: car.model,
      year: car.year,
      condition: car.condition,
      price: Number(car.price),
      mileage: car.mileage ?? undefined,
      fuelType: car.fuelType,
      transmission: car.transmission,
      city: car.city || "",
      province: car.province || "",
      coverImage: car.coverImage || car.images[0]?.url || undefined,
      videoUrl: car.videoUrl || car.videos[0]?.url || undefined,
      features: car.features,
      isFeatured: car.isFeatured,
      negotiable: car.negotiable,
      dealerName: car.dealerName || "",
      dealerWhatsapp: car.dealerWhatsapp || "",
      exteriorColor: car.exteriorColor || "",
      horsepower: car.horsepower || 0,
      views: car.views,
    }))
  } catch (error) {
    console.error("Error fetching featured cars:", error)
    // Fall back to empty array - client will show placeholder state
  }

  return <HomePageClient featuredCars={featuredCars} />
}
