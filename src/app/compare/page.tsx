"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Gauge,
  Fuel,
  Calendar,
  Settings,
  MapPin,
  Car,
  Zap,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CompareCar {
  id: string
  slug: string
  title: string
  make: string
  model: string
  year: number
  condition: string
  price: number
  mileage: number
  fuelType: string
  transmission: string
  bodyType: string
  horsepower: number
  city: string
  coverImage: string
  features: string[]
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const specs = [
  { key: "year", label: "Year", icon: Calendar },
  { key: "condition", label: "Condition", icon: Car },
  { key: "price", label: "Price", icon: null },
  { key: "mileage", label: "Mileage", icon: Gauge },
  { key: "fuelType", label: "Fuel Type", icon: Fuel },
  { key: "transmission", label: "Transmission", icon: Settings },
  { key: "bodyType", label: "Body Type", icon: Car },
  { key: "horsepower", label: "Horsepower", icon: Zap },
  { key: "city", label: "Location", icon: MapPin },
]

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center pt-20"><Loader2 className="h-8 w-8 text-gold animate-spin" /></div>}>
      <CompareContent />
    </Suspense>
  )
}

function CompareContent() {
  const searchParams = useSearchParams()
  const ids = searchParams.get("ids")?.split(",") || []

  const [cars, setCars] = useState<CompareCar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false)
      return
    }

    const fetchCars = async () => {
      const results: CompareCar[] = []
      for (const id of ids) {
        try {
          // Find car by searching
          const res = await fetch(`/api/cars?search=${id}&limit=1`)
          const data = await res.json()
          if (data.data?.[0]) {
            results.push(data.data[0])
          }
        } catch {
          // Skip failed fetches
        }
      }
      setCars(results)
      setLoading(false)
    }

    fetchCars()
  }, [ids.join(",")])

  const getSpecValue = (car: CompareCar, key: string): string => {
    switch (key) {
      case "price": return formatPrice(car.price)
      case "mileage": return car.mileage ? `${car.mileage.toLocaleString()} km` : "New"
      case "horsepower": return car.horsepower ? `${car.horsepower} HP` : "N/A"
      case "condition": return car.condition.replace("_", " ")
      default: return String(car[key as keyof CompareCar] || "N/A")
    }
  }

  // Find best values for highlighting
  const getBestPrice = () => Math.min(...cars.map((c) => c.price))
  const getBestMileage = () => {
    const withMileage = cars.filter((c) => c.mileage > 0)
    return withMileage.length > 0 ? Math.min(...withMileage.map((c) => c.mileage)) : null
  }
  const getBestHorsepower = () => {
    const withHP = cars.filter((c) => c.horsepower > 0)
    return withHP.length > 0 ? Math.max(...withHP.map((c) => c.horsepower)) : null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    )
  }

  if (ids.length === 0 || cars.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white font-heading mb-2">No Cars to Compare</h1>
            <p className="text-gray-400 mb-6">Select cars from the listing to compare them side by side</p>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse Cars
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-red-dark pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-wide">
            COMPARE CARS
          </h1>
          <p className="text-white/60 mt-1">Comparing {cars.length} vehicles side by side</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Car Headers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cars.map((car) => (
            <div key={car.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <img
                src={car.coverImage || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"}
                alt={car.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-sm font-bold text-white line-clamp-2">{car.title}</h3>
                <p className="text-lg font-bold text-gold mt-1">{formatPrice(car.price)}</p>
                <Link
                  href={`/cars/${car.slug}`}
                  className="inline-block mt-2 text-xs text-gold hover:text-gold-light"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left p-4 text-sm font-bold text-gold font-heading tracking-wide min-w-[150px]">
                    SPECIFICATION
                  </th>
                  {cars.map((car) => (
                    <th key={car.id} className="text-left p-4 text-sm font-bold text-white min-w-[200px]">
                      {car.year} {car.make}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map((spec, i) => (
                  <tr key={spec.key} className={cn("border-b border-neutral-800", i % 2 === 0 && "bg-neutral-800/30")}>
                    <td className="p-4 text-sm text-gray-400 font-medium">{spec.label}</td>
                    {cars.map((car) => {
                      const value = getSpecValue(car, spec.key)
                      const isBest =
                        (spec.key === "price" && car.price === getBestPrice()) ||
                        (spec.key === "mileage" && car.mileage === getBestMileage()) ||
                        (spec.key === "horsepower" && car.horsepower === getBestHorsepower())

                      return (
                        <td key={car.id} className={cn("p-4 text-sm", isBest ? "text-gold font-bold" : "text-white")}>
                          {value}
                          {isBest && <span className="ml-1 text-xs">★</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white font-heading tracking-wide mb-4">FEATURES</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <div key={car.id}>
                <h4 className="text-sm font-bold text-gold mb-2">{car.title}</h4>
                <ul className="space-y-1">
                  {car.features.length > 0 ? (
                    car.features.map((f) => (
                      <li key={f} className="text-xs text-gray-300 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gold" />
                        {f}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-500">No features listed</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
