"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Grid, List, SlidersHorizontal, X, Car, Loader2 } from "lucide-react"
import { CarCard } from "@/components/ui/car-card"
import { SearchBar } from "@/components/ui/search-bar"
import { cn } from "@/lib/utils"

interface CarData {
  id: string
  slug: string
  title: string
  make: string
  model: string
  year: number
  condition: "NEW" | "USED" | "CERTIFIED_PRE_OWNED"
  price: number
  mileage: number
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

interface Filters {
  make: string
  model: string
  condition: string
  fuelType: string
  transmission: string
  bodyType: string
  yearMin: string
  yearMax: string
  priceMin: string
  priceMax: string
}

function CarsPageContent() {
  const searchParams = useSearchParams()
  const [cars, setCars] = useState<CarData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")
  const [sortBy, setSortBy] = useState("newest")

  const [filters, setFilters] = useState<Filters>({
    make: searchParams.get("make") || "",
    model: searchParams.get("model") || "",
    condition: searchParams.get("condition") || "",
    fuelType: searchParams.get("fuelType") || "",
    transmission: searchParams.get("transmission") || "",
    bodyType: searchParams.get("bodyType") || "",
    yearMin: searchParams.get("yearMin") || "",
    yearMax: searchParams.get("yearMax") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
  })

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchValue) params.set("search", searchValue)
      if (sortBy) params.set("sortBy", sortBy)
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })

      const res = await fetch(`/api/cars?${params.toString()}`)
      const data = await res.json()
      setCars(data.data || [])
      setTotalResults(data.pagination?.total || 0)
    } catch (error) {
      console.error("Error fetching cars:", error)
      setCars([])
    } finally {
      setLoading(false)
    }
  }, [searchValue, sortBy, filters])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      make: "", model: "", condition: "", fuelType: "",
      transmission: "", bodyType: "", yearMin: "", yearMax: "",
      priceMin: "", priceMax: "",
    })
    setSearchValue("")
  }

  const hasActiveFilters = Object.values(filters).some((v) => v) || searchValue

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-red-dark pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white font-heading tracking-wide mb-2">
            BROWSE CARS
          </h1>
          <p className="text-white/70">
            Find your perfect car from thousands of listings
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by make, model, or keyword..."
              value={searchValue}
              onChange={setSearchValue}
              onSearch={() => fetchCars()}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                showFilters
                  ? "bg-red-600 text-white"
                  : "bg-neutral-800 text-white hover:bg-neutral-700"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-gold" />
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-neutral-800 text-white text-sm border border-neutral-700 focus:outline-none focus:border-gold"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>

            <div className="hidden sm:flex items-center border border-neutral-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2.5 transition-colors",
                  viewMode === "grid" ? "bg-red-600 text-white" : "bg-neutral-800 text-gray-400"
                )}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2.5 transition-colors",
                  viewMode === "list" ? "bg-red-600 text-white" : "bg-neutral-800 text-gray-400"
                )}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Inline Filter Panel */}
        {showFilters && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-heading tracking-wide">FILTERS</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Make</label>
                <select
                  value={filters.make}
                  onChange={(e) => updateFilter("make", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">All Makes</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Daihatsu">Daihatsu</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => updateFilter("condition", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">All</option>
                  <option value="NEW">New</option>
                  <option value="USED">Used</option>
                  <option value="CERTIFIED_PRE_OWNED">Certified</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Fuel Type</label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => updateFilter("fuelType", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">All</option>
                  <option value="GASOLINE">Gasoline</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => updateFilter("priceMin", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => updateFilter("priceMax", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg text-sm text-gold hover:text-gold-light transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 sm:gap-2 mb-4 flex-wrap">
            <span className="text-sm text-gray-400">Active:</span>
            {searchValue && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs">
                Search: {searchValue}
                <button onClick={() => setSearchValue("")} className="hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {Object.entries(filters).map(([key, value]) =>
              value ? (
                <span key={key} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs">
                  {key}: {value}
                  <button onClick={() => updateFilter(key as keyof Filters, "")} className="hover:text-white">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : null
            )}
            <button onClick={clearFilters} className="text-xs text-gold hover:text-gold-light">
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">
            {loading ? "Searching..." : `${totalResults} cars found`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-gold animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && cars.length === 0 && (
          <div className="text-center py-20 bg-neutral-900 rounded-xl border border-neutral-800">
            <Car className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No cars found</h3>
            <p className="text-neutral-400 mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && cars.length > 0 && (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            )}
          >
            {cars.map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    }>
      <CarsPageContent />
    </Suspense>
  )
}
