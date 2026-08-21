"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Car,
  Fuel,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Play,
  ChevronRight,
  MapPin,
} from "lucide-react"
import { VideoCard } from "@/components/ui/video-card"
import { CarCard } from "@/components/ui/car-card"
import { SearchBar } from "@/components/ui/search-bar"

interface FeaturedCar {
  id: string
  slug: string
  title: string
  make: string
  model: string
  year: number
  condition: "NEW" | "USED" | "CERTIFIED_PRE_OWNED"
  price: number
  mileage: number | undefined
  fuelType: string
  transmission: string
  city: string
  province: string
  coverImage: string | undefined
  videoUrl: string | undefined
  features: string[]
  isFeatured: boolean
  negotiable: boolean
  dealerName: string
  dealerWhatsapp: string
  exteriorColor: string
  horsepower: number
  views: number
}

interface HomePageClientProps {
  featuredCars: FeaturedCar[]
}

const categories = [
  { name: "Sedan", icon: Car, count: 245 },
  { name: "SUV", icon: Car, count: 189 },
  { name: "Electric", icon: Zap, count: 67 },
  { name: "Hybrid", icon: Fuel, count: 43 },
]

const stats = [
  { label: "Cars Listed", value: "10,000+", icon: Car },
  { label: "Happy Customers", value: "5,000+", icon: Star },
  { label: "Verified Dealers", value: "200+", icon: Shield },
  { label: "Cities Covered", value: "50+", icon: MapPin },
]

export function HomePageClient({ featuredCars }: HomePageClientProps) {
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - 60% red dominance */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-red-section">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-50"
            poster="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920"
          >
            <source
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 via-red-800/60 to-black/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl space-y-8 text-container">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 border border-gold/50 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-sm text-gold font-medium">
                #1 Automotive Marketplace in Indonesia
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-heading tracking-wider text-white leading-tight">
                FIND YOUR
                <span className="block text-gold">DREAM CAR</span>
              </h1>
              <p className="text-lg sm:text-xl text-white max-w-xl leading-relaxed">
                Browse thousands of new and used cars with immersive video
                listings. Verified sellers, secure transactions.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <SearchBar
                placeholder="Search by make, model, or keyword..."
                value={searchValue}
                onChange={setSearchValue}
                onSearch={(val) => {
                  window.location.href = `/cars?search=${encodeURIComponent(val)}`
                }}
                showFilter={false}
                autoFocus
              />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 pt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/70">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
              <div className="w-1 h-3 rounded-full bg-gold animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Red background section */}
      <section className="py-16 bg-red-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white font-heading tracking-wide">
                BROWSE BY CATEGORY
              </h2>
              <p className="text-white/70 mt-1">Find the perfect car for your lifestyle</p>
            </div>
            <Link
              href="/cars"
              className="hidden sm:flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/cars?bodyType=${cat.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-xl bg-red-600 border border-red-500 p-6 hover:bg-red-500 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center mb-4">
                  <cat.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-sm text-white/80">{cat.count} listings</p>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-hover:text-gold transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars - Black section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-gold" fill="currentColor" />
                <span className="text-sm text-gold font-medium uppercase tracking-wider">
                  Featured
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white font-heading tracking-wide">
                TOP PICKS FOR YOU
              </h2>
              <p className="text-white/60 mt-1">
                Handpicked cars with video tours from verified sellers
              </p>
            </div>
            <Link
              href="/cars?featured=true"
              className="hidden sm:flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-900 rounded-xl border border-neutral-800">
              <Car className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No featured cars yet</h3>
              <p className="text-neutral-400 mb-4">
                Be the first to list a featured car on Pasar Mobil Bekas
              </p>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
              >
                <Play className="h-4 w-4" fill="white" />
                Start Selling
              </Link>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
            >
              View All Cars <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Showcase - Red background */}
      <section className="py-16 bg-red-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white font-heading tracking-wide">
              IMMERSIVE VIDEO TOURS
            </h2>
            <p className="text-white/70 mt-2 max-w-2xl mx-auto">
              Every listing comes with detailed video walkthroughs. See every
              angle before you buy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VideoCard
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              poster="https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=800"
              alt="Toyota Supra video tour"
              aspectRatio="video"
              overlay={
                <div className="space-y-1 bg-black/70 rounded-lg px-3 py-2 inline-block">
                  <p className="text-white font-bold text-sm">2024 Toyota GR Supra</p>
                  <p className="text-gold text-xs">Full Interior & Exterior Tour</p>
                </div>
              }
            />
            <VideoCard
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
              poster="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
              alt="Tesla Model 3 video tour"
              aspectRatio="video"
              overlay={
                <div className="space-y-1 bg-black/70 rounded-lg px-3 py-2 inline-block">
                  <p className="text-white font-bold text-sm">2023 Tesla Model 3</p>
                  <p className="text-gold text-xs">Autopilot Demo & Features</p>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Red background */}
      <section className="py-20 bg-red-600">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-wide mb-4">
            SELL YOUR CAR
          </h2>
          <p className="text-gold text-2xl font-heading mb-6">IN MINUTES</p>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            List your car with a video tour, reach thousands of buyers, and
            close the deal fast. Free listing for first 30 days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sell"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-black hover:bg-neutral-900 text-white font-bold text-lg transition-all"
            >
              <Play className="h-5 w-5" fill="white" />
              Start Selling Now
            </Link>
            <Link
              href="/cars"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-gold text-gold hover:bg-gold hover:text-black font-bold transition-all"
            >
              Browse Cars
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
