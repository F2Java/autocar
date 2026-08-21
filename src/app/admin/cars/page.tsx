"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Car,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  ExternalLink,
} from "lucide-react"
import { CarEditModal } from "@/components/ui/car-edit-modal"
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal"
import { cn } from "@/lib/utils"

interface CarListing {
  id: string
  slug: string
  title: string
  make: string
  model: string
  year: number
  condition: string
  price: number
  status: string
  city: string
  views: number
  favorites: number
  isFeatured: boolean
  coverImage: string
  createdAt: string
  bodyType: string
  fuelType: string
  transmission: string
  negotiable: boolean
  features: string[]
}

const mockCars: CarListing[] = [
  {
    id: "1", slug: "2024-toyota-gr-supra-30", title: "2024 Toyota GR Supra 3.0",
    make: "Toyota", model: "GR Supra", year: 2024, condition: "NEW",
    price: 1250000000, status: "AVAILABLE", city: "Jakarta",
    views: 1247, favorites: 89, isFeatured: true,
    coverImage: "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=200",
    createdAt: "2024-01-15", bodyType: "Coupe", fuelType: "Gasoline", transmission: "Automatic", negotiable: true, features: ["Turbo", "Leather"],
  },
  {
    id: "2", slug: "2023-tesla-model-3-long-range", title: "2023 Tesla Model 3 Long Range",
    make: "Tesla", model: "Model 3", year: 2023, condition: "USED",
    price: 650000000, status: "AVAILABLE", city: "Bandung",
    views: 2341, favorites: 156, isFeatured: true,
    coverImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200",
    createdAt: "2024-01-10", bodyType: "Sedan", fuelType: "Electric", transmission: "Automatic", negotiable: true, features: ["Autopilot"],
  },
  {
    id: "3", slug: "2024-bmw-m4-competition", title: "2024 BMW M4 Competition",
    make: "BMW", model: "M4 Competition", year: 2024, condition: "NEW",
    price: 2100000000, status: "SOLD", city: "Surabaya",
    views: 892, favorites: 45, isFeatured: true,
    coverImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200",
    createdAt: "2024-01-08", bodyType: "Coupe", fuelType: "Gasoline", transmission: "Automatic", negotiable: false, features: ["M Sport"],
  },
  {
    id: "4", slug: "2023-suzuki-jimny-sierra", title: "2023 Suzuki Jimny Sierra",
    make: "Suzuki", model: "Jimny Sierra", year: 2023, condition: "USED",
    price: 350000000, status: "RESERVED", city: "Bandung",
    views: 2890, favorites: 210, isFeatured: false,
    coverImage: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=200",
    createdAt: "2024-01-05", bodyType: "SUV", fuelType: "Gasoline", transmission: "Manual", negotiable: false, features: ["4WD"],
  },
  {
    id: "5", slug: "2024-hyundai-ioniq-5", title: "2024 Hyundai Ioniq 5",
    make: "Hyundai", model: "Ioniq 5", year: 2024, condition: "NEW",
    price: 750000000, status: "AVAILABLE", city: "Jakarta",
    views: 3210, favorites: 178, isFeatured: true,
    coverImage: "https://images.unsplash.com/photo-1619317588810-42e1e1be4f32?w=200",
    createdAt: "2024-01-12", bodyType: "SUV", fuelType: "Electric", transmission: "Automatic", negotiable: false, features: ["Fast Charging"],
  },
  {
    id: "6", slug: "2022-toyota-fortuner-vrz", title: "2022 Toyota Fortuner VRZ",
    make: "Toyota", model: "Fortuner VRZ", year: 2022, condition: "USED",
    price: 520000000, status: "AVAILABLE", city: "Jakarta",
    views: 1823, favorites: 92, isFeatured: false,
    coverImage: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200",
    createdAt: "2024-01-03", bodyType: "SUV", fuelType: "Diesel", transmission: "Automatic", negotiable: true, features: ["4WD"],
  },
  {
    id: "7", slug: "2024-mercedes-amg-gt-63", title: "2024 Mercedes-AMG GT 63",
    make: "Mercedes-Benz", model: "AMG GT 63", year: 2024, condition: "NEW",
    price: 3500000000, status: "AVAILABLE", city: "Jakarta",
    views: 2103, favorites: 134, isFeatured: true,
    coverImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200",
    createdAt: "2024-01-14", bodyType: "Coupe", fuelType: "Gasoline", transmission: "Automatic", negotiable: false, features: ["AMG Performance"],
  },
  {
    id: "8", slug: "2024-honda-civic-rs", title: "2024 Honda Civic RS",
    make: "Honda", model: "Civic RS", year: 2024, condition: "NEW",
    price: 580000000, status: "AVAILABLE", city: "Yogyakarta",
    views: 1567, favorites: 78, isFeatured: false,
    coverImage: "https://images.unsplash.com/photo-1606611013016-969c19ba27c9?w=200",
    createdAt: "2024-01-11", bodyType: "Sedan", fuelType: "Gasoline", transmission: "CVT", negotiable: true, features: ["Honda Sensing"],
  },
]

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarListing[]>(mockCars)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")
  const [selectedCars, setSelectedCars] = useState<string[]>([])
  const [editCar, setEditCar] = useState<CarListing | null>(null)
  const [deleteCar, setDeleteCar] = useState<CarListing | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filteredCars = cars.filter((car) => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !car.title.toLowerCase().includes(q) &&
        !car.make.toLowerCase().includes(q) &&
        !car.model.toLowerCase().includes(q)
      ) {
        return false
      }
    }
    if (statusFilter !== "all" && car.status !== statusFilter) return false
    if (conditionFilter !== "all" && car.condition !== conditionFilter) return false
    return true
  })

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)

  const toggleFeatured = (id: string) => {
    setCars((prev) =>
      prev.map((car) =>
        car.id === id ? { ...car, isFeatured: !car.isFeatured } : car
      )
    )
  }

  const toggleStatus = (id: string) => {
    setCars((prev) =>
      prev.map((car) => {
        if (car.id === id) {
          const newStatus =
            car.status === "AVAILABLE"
              ? "SOLD"
              : car.status === "SOLD"
                ? "AVAILABLE"
                : "AVAILABLE"
          return { ...car, status: newStatus }
        }
        return car
      })
    )
  }

  const toggleSelect = (id: string) => {
    setSelectedCars((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedCars.length === filteredCars.length) {
      setSelectedCars([])
    } else {
      setSelectedCars(filteredCars.map((c) => c.id))
    }
  }

  const handleSaveCar = (data: Partial<CarListing>) => {
    if (!editCar) return
    setCars((prev) =>
      prev.map((car) =>
        car.id === editCar.id ? { ...car, ...data } : car
      )
    )
    setEditCar(null)
  }

  const handleDeleteCar = async () => {
    if (!deleteCar) return
    setDeleting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500))
    setCars((prev) => prev.filter((car) => car.id !== deleteCar.id))
    setDeleteCar(null)
    setDeleting(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-wide">
            MANAGE CARS
          </h1>
          <p className="text-slate-400 mt-1">
            {filteredCars.length} listings found
          </p>
        </div>
        <Link
          href="/sell"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Car
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cars..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            aria-label="Search cars"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="SOLD">Sold</option>
          <option value="RESERVED">Reserved</option>
          <option value="PENDING">Pending</option>
        </select>

        <select
          value={conditionFilter}
          onChange={(e) => setConditionFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
          aria-label="Filter by condition"
        >
          <option value="all">All Conditions</option>
          <option value="NEW">New</option>
          <option value="USED">Used</option>
          <option value="CERTIFIED_PRE_OWNED">CPO</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedCars.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-600/10 border border-blue-500/20">
          <span className="text-sm text-blue-400">
            {selectedCars.length} selected
          </span>
          <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium">
            Mark Available
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium">
            Feature
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium">
            Delete
          </button>
        </div>
      )}

      {/* Cars Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 border-b border-slate-800 text-sm text-slate-400 font-medium">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedCars.length === filteredCars.length && filteredCars.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
              aria-label="Select all"
            />
          </div>
          <div className="col-span-5">Car</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Views</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-800">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center transition-colors",
                selectedCars.includes(car.id) && "bg-blue-500/5"
              )}
            >
              {/* Checkbox */}
              <div className="hidden lg:flex col-span-1">
                <input
                  type="checkbox"
                  checked={selectedCars.includes(car.id)}
                  onChange={() => toggleSelect(car.id)}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                  aria-label={`Select ${car.title}`}
                />
              </div>

              {/* Car Info */}
              <div className="lg:col-span-5 flex items-center gap-4">
                <img
                  src={car.coverImage}
                  alt={car.title}
                  className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-medium truncate">
                      {car.title}
                    </p>
                    {car.isFeatured && (
                      <Star className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" fill="currentColor" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800">
                      {car.condition}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {car.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="lg:col-span-2">
                <p className="text-sm text-blue-400 font-bold">
                  {formatPrice(car.price)}
                </p>
              </div>

              {/* Status */}
              <div className="lg:col-span-1">
                <button
                  onClick={() => toggleStatus(car.id)}
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium transition-colors",
                    car.status === "AVAILABLE"
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : car.status === "SOLD"
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                  )}
                >
                  {car.status}
                </button>
              </div>

              {/* Views */}
              <div className="lg:col-span-1">
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {car.views.toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="lg:col-span-2 flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(car.id)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    car.isFeatured
                      ? "text-amber-400 hover:bg-amber-500/10"
                      : "text-slate-500 hover:bg-slate-800 hover:text-white"
                  )}
                  aria-label={car.isFeatured ? "Remove from featured" : "Mark as featured"}
                >
                  <Star
                    className="h-4 w-4"
                    fill={car.isFeatured ? "currentColor" : "none"}
                  />
                </button>
                <Link
                  href={`/cars/${car.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="View listing"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setEditCar(car)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Edit car"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteCar(car)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  aria-label="Delete car"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="p-12 text-center">
            <Car className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No cars found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <CarEditModal
        car={editCar}
        isOpen={!!editCar}
        onClose={() => setEditCar(null)}
        onSave={handleSaveCar}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteCar}
        title="Delete Car Listing"
        message="Are you sure you want to delete this car listing? This will permanently remove it from the marketplace and cannot be undone."
        itemName={deleteCar?.title}
        onConfirm={handleDeleteCar}
        onCancel={() => setDeleteCar(null)}
        loading={deleting}
      />
    </div>
  )
}
