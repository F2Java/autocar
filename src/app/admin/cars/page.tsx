"use client"

import { useState, useEffect, useCallback } from "react"
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
  Loader2,
  RefreshCw,
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

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarListing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")
  const [selectedCars, setSelectedCars] = useState<string[]>([])
  const [editCar, setEditCar] = useState<CarListing | null>(null)
  const [deleteCar, setDeleteCar] = useState<CarListing | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      // Fetch all (remove limit to get full list for admin)
      params.set("limit", "100")
      params.set("sortBy", "newest")

      const res = await fetch(`/api/cars?${params.toString()}`)
      const data = await res.json()
      setCars(
        (data.data || []).map((car: CarListing) => ({
          ...car,
          status: "AVAILABLE", // API only returns available cars
          favorites: 0,
          bodyType: car.bodyType || "",
          fuelType: car.fuelType || "",
          transmission: car.transmission || "",
          negotiable: car.negotiable ?? true,
          features: car.features || [],
        }))
      )
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  const filteredCars = cars.filter((car) => {
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

  const toggleFeatured = async (id: string) => {
    const car = cars.find((c) => c.id === id)
    if (!car) return

    // Optimistic update
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFeatured: !c.isFeatured } : c))
    )

    try {
      await fetch(`/api/cars/${car.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !car.isFeatured }),
      })
    } catch {
      // Revert on error
      setCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFeatured: car.isFeatured } : c))
      )
    }
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

  const handleSaveCar = async (data: Partial<CarListing>) => {
    if (!editCar) return

    try {
      await fetch(`/api/cars/${editCar.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      // Refresh list
      fetchCars()
    } catch (error) {
      console.error("Error updating car:", error)
    }
    setEditCar(null)
  }

  const handleDeleteCar = async () => {
    if (!deleteCar) return
    setDeleting(true)
    try {
      await fetch(`/api/cars/${deleteCar.slug}`, { method: "DELETE" })
      setCars((prev) => prev.filter((car) => car.id !== deleteCar.id))
    } catch (error) {
      console.error("Error deleting car:", error)
    }
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
          <p className="text-gray-400 mt-1">
            {loading ? "Loading..." : `${filteredCars.length} listings found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCars}
            className="p-2.5 rounded-xl bg-neutral-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <Link
            href="/sell"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Car
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cars..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-gold"
            aria-label="Search cars"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
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
          className="h-10 px-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
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
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-600/10 border border-gold/20">
          <span className="text-sm text-gold">
            {selectedCars.length} selected
          </span>
          <button className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium">
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-gold animate-spin" />
        </div>
      )}

      {/* Cars Table */}
      {!loading && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 border-b border-neutral-800 text-sm text-gray-400 font-medium">
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedCars.length === filteredCars.length && filteredCars.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-gold focus:ring-gold"
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
          <div className="divide-y divide-neutral-800">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center transition-colors",
                  selectedCars.includes(car.id) && "bg-red-500/5"
                )}
              >
                {/* Checkbox */}
                <div className="hidden lg:flex col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedCars.includes(car.id)}
                    onChange={() => toggleSelect(car.id)}
                    className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-gold focus:ring-gold"
                    aria-label={`Select ${car.title}`}
                  />
                </div>

                {/* Car Info */}
                <div className="lg:col-span-5 flex items-center gap-4">
                  <img
                    src={car.coverImage || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200"}
                    alt={car.title}
                    className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-medium truncate">
                        {car.title}
                      </p>
                      {car.isFeatured && (
                        <Star className="h-3.5 w-3.5 text-gold flex-shrink-0" fill="currentColor" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-800">
                        {car.condition}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {car.city || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="lg:col-span-2">
                  <p className="text-sm text-gold font-bold">
                    {formatPrice(car.price)}
                  </p>
                </div>

                {/* Status */}
                <div className="lg:col-span-1">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      car.status === "AVAILABLE"
                        ? "bg-green-600/20 text-green-400"
                        : car.status === "SOLD"
                          ? "bg-red-600/20 text-red-400"
                          : car.status === "PENDING"
                            ? "bg-yellow-600/20 text-yellow-400"
                            : "bg-neutral-600/20 text-gray-400"
                    )}
                  >
                    {car.status}
                  </span>
                </div>

                {/* Views */}
                <div className="lg:col-span-1">
                  <p className="text-sm text-gray-400 flex items-center gap-1">
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
                        ? "text-gold hover:bg-gold/10"
                        : "text-gray-500 hover:bg-neutral-800 hover:text-white"
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
                    className="p-2 rounded-lg text-gray-500 hover:bg-neutral-800 hover:text-white transition-colors"
                    aria-label="View listing"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setEditCar(car)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-neutral-800 hover:text-white transition-colors"
                    aria-label="Edit car"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteCar(car)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    aria-label="Delete car"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCars.length === 0 && !loading && (
            <div className="p-12 text-center">
              <Car className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No cars found</p>
            </div>
          )}
        </div>
      )}

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
