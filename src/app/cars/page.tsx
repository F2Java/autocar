"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Grid, List, SlidersHorizontal, X } from "lucide-react"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterPanel } from "@/components/ui/filter-panel"
import { CarCard } from "@/components/ui/car-card"
import { cn } from "@/lib/utils"

// Mock data
const allCars = [
  {
    id: "1", slug: "toyota-supra-2024", title: "2024 Toyota GR Supra 3.0",
    make: "Toyota", model: "GR Supra", year: 2024, condition: "NEW" as const,
    price: 1250000000, fuelType: "Gasoline", transmission: "Automatic",
    city: "Jakarta", province: "DKI Jakarta",
    coverImage: "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    features: ["Turbo", "Leather Seats", "Apple CarPlay"],
    isFeatured: true, dealerName: "AutoCar Premium", dealerWhatsapp: "6281234567890",
    horsepower: 382,
  },
  {
    id: "2", slug: "bmw-m4-2024", title: "2024 BMW M4 Competition",
    make: "BMW", model: "M4 Competition", year: 2024, condition: "NEW" as const,
    price: 2100000000, mileage: 5000, fuelType: "Gasoline", transmission: "Automatic",
    city: "Surabaya", province: "Jawa Timur",
    coverImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    features: ["M Sport", "Carbon Fiber"], dealerName: "BMW AutoCenter",
    dealerWhatsapp: "6281234567891", horsepower: 503,
  },
  {
    id: "3", slug: "tesla-model-3-2023", title: "2023 Tesla Model 3 Long Range",
    make: "Tesla", model: "Model 3", year: 2023, condition: "USED" as const,
    price: 650000000, mileage: 15000, fuelType: "Electric", transmission: "Automatic",
    city: "Bandung", province: "Jawa Barat",
    coverImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    features: ["Autopilot", "Premium Interior"], dealerName: "EV Indonesia",
    dealerWhatsapp: "6281234567892", horsepower: 450,
  },
  {
    id: "4", slug: "honda-civic-2023", title: "2023 Honda Civic RS",
    make: "Honda", model: "Civic RS", year: 2023, condition: "USED" as const,
    price: 380000000, mileage: 25000, fuelType: "Gasoline", transmission: "CVT",
    city: "Yogyakarta", province: "DI Yogyakarta",
    coverImage: "https://images.unsplash.com/photo-1606611013016-969c19ba27c9?w=800",
    features: ["Honda Sensing", "Sunroof"], dealerName: "Honda Istana",
    dealerWhatsapp: "6281234567894", horsepower: 178,
  },
  {
    id: "5", slug: "toyota-innova-2024", title: "2024 Toyota Kijang Innova Zenix",
    make: "Toyota", model: "Innova Zenix", year: 2024, condition: "NEW" as const,
    price: 520000000, fuelType: "Hybrid", transmission: "CVT",
    city: "Semarang", province: "Jawa Tengah",
    coverImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800",
    features: ["Hybrid", "Toyota Safety Sense"], dealerName: "Auto2000",
    dealerWhatsapp: "6281234567895", horsepower: 186,
  },
  {
    id: "6", slug: "mercedes-amg-gt-2024", title: "2024 Mercedes-AMG GT 63",
    make: "Mercedes-Benz", model: "AMG GT 63", year: 2024, condition: "NEW" as const,
    price: 3500000000, fuelType: "Gasoline", transmission: "Automatic",
    city: "Jakarta", province: "DKI Jakarta",
    coverImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    features: ["AMG Performance", "Burmester Sound"], dealerName: "Mercedes-Benz Indonesia",
    dealerWhatsapp: "6281234567893", horsepower: 577,
  },
]

const filterOptions = {
  makes: ["Toyota", "Honda", "BMW", "Mercedes-Benz", "Tesla", "Suzuki", "Mitsubishi"],
  models: {
    Toyota: ["GR Supra", "Innova Zenix", "Camry", "Corolla Cross", "Fortuner"],
    Honda: ["Civic RS", "HR-V", "CR-V", "Brio", "Accord"],
    BMW: ["M4 Competition", "X5", "3 Series", "5 Series"],
    "Mercedes-Benz": ["AMG GT 63", "C-Class", "E-Class", "GLC"],
    Tesla: ["Model 3", "Model Y", "Model S"],
    Suzuki: ["Ertiga", "XL7", "Jimny"],
    Mitsubishi: ["Pajero Sport", "Xpander", "L200"],
  },
  bodyTypes: ["Sedan", "SUV", "Hatchback", "Coupe", "MPV", "Pickup Truck"],
  fuelTypes: ["Gasoline", "Diesel", "Electric", "Hybrid"],
  transmissions: ["Automatic", "Manual", "CVT"],
  conditions: ["NEW", "USED", "CERTIFIED_PRE_OWNED"],
}

function CarsContent() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    make: searchParams.get("make") || "",
    model: "",
    yearMin: "",
    yearMax: "",
    priceMin: "",
    priceMax: "",
    condition: searchParams.get("condition") || "",
    fuelType: searchParams.get("fuelType") || "",
    transmission: "",
    bodyType: searchParams.get("bodyType") || "",
    city: "",
    sortBy: "newest",
  })

  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      if (filters.make && car.make !== filters.make) return false
      if (filters.model && car.model !== filters.model) return false
      if (filters.condition && car.condition !== filters.condition) return false
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false
      if (filters.transmission && car.transmission !== filters.transmission) return false
      if (filters.yearMin && car.year < parseInt(filters.yearMin)) return false
      if (filters.yearMax && car.year > parseInt(filters.yearMax)) return false
      if (filters.priceMin && car.price < parseInt(filters.priceMin)) return false
      if (filters.priceMax && car.price > parseInt(filters.priceMax)) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          car.make.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.title.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [filters, search])

  const handleFilterChange = (partial: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  const handleReset = () => {
    setFilters({
      search: "", make: "", model: "", yearMin: "", yearMax: "",
      priceMin: "", priceMax: "", condition: "", fuelType: "",
      transmission: "", bodyType: "", city: "", sortBy: "newest",
    })
    setSearch("")
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-white font-heading tracking-wide mb-4">
            BROWSE CARS
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search cars..."
                value={search}
                onChange={setSearch}
                onFilterClick={() => setFilterOpen(true)}
                loading={false}
              />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2.5 rounded-lg transition-colors",
                  viewMode === "grid" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                )}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2.5 rounded-lg transition-colors",
                  viewMode === "list" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                )}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Panel */}
          <FilterPanel
            options={filterOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
            resultCount={filteredCars.length}
          />

          {/* Car Grid */}
          <div className="flex-1">
            {filteredCars.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg">No cars found matching your criteria</p>
                <button
                  onClick={handleReset}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1 max-w-3xl"
                )}
              >
                {filteredCars.map((car) => (
                  <CarCard key={car.id} {...car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CarsContent />
    </Suspense>
  )
}
