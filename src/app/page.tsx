"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Car,
  Fuel,
  Zap,
  Shield,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  Play,
  ChevronRight,
  MapPin,
  MessageCircle,
} from "lucide-react"
import { VideoCard } from "@/components/ui/video-card"
import { CarCard } from "@/components/ui/car-card"
import { SearchBar } from "@/components/ui/search-bar"
import { cn } from "@/lib/utils"

// Mock data for demo
const featuredCars = [
  {
    id: "1",
    slug: "toyota-supra-2024",
    title: "2024 Toyota GR Supra 3.0",
    make: "Toyota",
    model: "GR Supra",
    year: 2024,
    condition: "NEW" as const,
    price: 1250000000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    city: "Jakarta",
    province: "DKI Jakarta",
    coverImage: "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    features: ["Turbo", "Leather Seats", "Apple CarPlay", "360 Camera"],
    isFeatured: true,
    negotiable: true,
    dealerName: "AutoCar Premium",
    dealerWhatsapp: "6281234567890",
    exteriorColor: "#DC2626",
    horsepower: 382,
  },
  {
    id: "2",
    slug: "bmw-m4-2024",
    title: "2024 BMW M4 Competition",
    make: "BMW",
    model: "M4 Competition",
    year: 2024,
    condition: "NEW" as const,
    price: 2100000000,
    mileage: 5000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    city: "Surabaya",
    province: "Jawa Timur",
    coverImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    features: ["M Sport", "Carbon Fiber", "Adaptive Suspension"],
    isFeatured: true,
    negotiable: false,
    dealerName: "BMW AutoCenter",
    dealerWhatsapp: "6281234567891",
    exteriorColor: "#1E293B",
    horsepower: 503,
  },
  {
    id: "3",
    slug: "tesla-model-3-2023",
    title: "2023 Tesla Model 3 Long Range",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    condition: "USED" as const,
    price: 650000000,
    mileage: 15000,
    fuelType: "Electric",
    transmission: "Automatic",
    city: "Bandung",
    province: "Jawa Barat",
    coverImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    features: ["Autopilot", "Full Self-Driving", "Premium Interior"],
    isFeatured: true,
    negotiable: true,
    dealerName: "EV Indonesia",
    dealerWhatsapp: "6281234567892",
    exteriorColor: "#FFFFFF",
    horsepower: 450,
  },
  {
    id: "4",
    slug: "mercedes-amg-gt-2024",
    title: "2024 Mercedes-AMG GT 63",
    make: "Mercedes-Benz",
    model: "AMG GT 63",
    year: 2024,
    condition: "NEW" as const,
    price: 3500000000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    city: "Jakarta",
    province: "DKI Jakarta",
    coverImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    features: ["AMG Performance", "Burmester Sound", "Air Suspension"],
    negotiable: false,
    dealerName: "Mercedes-Benz Indonesia",
    dealerWhatsapp: "6281234567893",
    exteriorColor: "#0F172A",
    horsepower: 577,
  },
  {
    id: "5",
    slug: "honda-civic-2023",
    title: "2023 Honda Civic RS",
    make: "Honda",
    model: "Civic RS",
    year: 2023,
    condition: "USED" as const,
    price: 380000000,
    mileage: 25000,
    fuelType: "Gasoline",
    transmission: "CVT",
    city: "Yogyakarta",
    province: "DI Yogyakarta",
    coverImage: "https://images.unsplash.com/photo-1606611013016-969c19ba27c9?w=800",
    features: ["Honda Sensing", "Sunroof", "Bose Audio"],
    negotiable: true,
    dealerName: "Honda Istana",
    dealerWhatsapp: "6281234567894",
    exteriorColor: "#DC2626",
    horsepower: 178,
  },
  {
    id: "6",
    slug: "toyota-innova-2024",
    title: "2024 Toyota Kijang Innova Zenix",
    make: "Toyota",
    model: "Innova Zenix",
    year: 2024,
    condition: "NEW" as const,
    price: 520000000,
    fuelType: "Hybrid",
    transmission: "CVT",
    city: "Semarang",
    province: "Jawa Tengah",
    coverImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800",
    features: ["Hybrid", "Toyota Safety Sense", "Captain Seat"],
    negotiable: true,
    dealerName: "Auto2000",
    dealerWhatsapp: "6281234567895",
    exteriorColor: "#1E40AF",
    horsepower: 186,
  },
]

const categories = [
  { name: "Sedan", icon: Car, count: 245, color: "from-blue-600 to-blue-800" },
  { name: "SUV", icon: Car, count: 189, color: "from-emerald-600 to-emerald-800" },
  { name: "Electric", icon: Zap, count: 67, color: "from-purple-600 to-purple-800" },
  { name: "Hybrid", icon: Fuel, count: 43, color: "from-amber-600 to-amber-800" },
]

const stats = [
  { label: "Cars Listed", value: "10,000+", icon: Car },
  { label: "Happy Customers", value: "5,000+", icon: Star },
  { label: "Verified Dealers", value: "200+", icon: Shield },
  { label: "Cities Covered", value: "50+", icon: MapPin },
]

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920"
          >
            <source
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Animated Grid Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm text-blue-300 font-medium">
                #1 Automotive Marketplace in Indonesia
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-heading tracking-wider text-white leading-tight">
                FIND YOUR
                <span className="block gradient-text">DREAM CAR</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed">
                Browse thousands of new and used cars with immersive video
                listings. Verified sellers, secure transactions, delivered to
                your doorstep.
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
            <div className="flex flex-wrap gap-8 pt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-400/30 flex justify-center pt-2">
              <div className="w-1 h-3 rounded-full bg-blue-400 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white font-heading tracking-wide">
                BROWSE BY CATEGORY
              </h2>
              <p className="text-slate-400 mt-1">Find the perfect car for your lifestyle</p>
            </div>
            <Link
              href="/cars"
              className="hidden sm:flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/cars?bodyType=${cat.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4", cat.color)}>
                  <cat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-sm text-slate-400">{cat.count} listings</p>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
                <span className="text-sm text-amber-400 font-medium uppercase tracking-wider">
                  Featured
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white font-heading tracking-wide">
                TOP PICKS FOR YOU
              </h2>
              <p className="text-slate-400 mt-1">
                Handpicked cars with video tours from verified sellers
              </p>
            </div>
            <Link
              href="/cars?featured=true"
              className="hidden sm:flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.slice(0, 6).map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              View All Cars <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white font-heading tracking-wide">
              IMMERSIVE VIDEO TOURS
            </h2>
            <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
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
                <div className="space-y-1">
                  <p className="text-white font-bold">2024 Toyota GR Supra</p>
                  <p className="text-blue-300 text-sm">Full Interior & Exterior Tour</p>
                </div>
              }
            />
            <VideoCard
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
              poster="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
              alt="Tesla Model 3 video tour"
              aspectRatio="video"
              overlay={
                <div className="space-y-1">
                  <p className="text-white font-bold">2023 Tesla Model 3</p>
                  <p className="text-blue-300 text-sm">Autopilot Demo & Features</p>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-wide mb-4">
            SELL YOUR CAR<br />
            <span className="gradient-text">IN MINUTES</span>
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            List your car with a video tour, reach thousands of buyers, and
            close the deal fast. Free listing for first 30 days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sell"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all glow-blue"
            >
              <Play className="h-5 w-5" fill="white" />
              Start Selling Now
            </Link>
            <Link
              href="/cars"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-600 text-white hover:bg-slate-800 transition-all"
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
