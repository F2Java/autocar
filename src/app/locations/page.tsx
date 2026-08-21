"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Star,
  Search,
  Navigation,
  ChevronRight,
  Car,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Dealer {
  id: string
  name: string
  address: string
  city: string
  province: string
  phone: string
  whatsapp: string
  hours: string
  rating: number
  reviews: number
  specialties: string[]
  image: string
}

const dealers: Dealer[] = [
  {
    id: "1",
    name: "AutoCar Premium Showroom",
    address: "Jl. Sudirman No. 123",
    city: "Jakarta",
    province: "DKI Jakarta",
    phone: "+62 812-3456-7890",
    whatsapp: "6281234567890",
    hours: "Mon-Sat: 09:00-18:00",
    rating: 4.8,
    reviews: 156,
    specialties: ["Premium", "European", "Japanese"],
    image: "https://images.unsplash.com/photo-1562141961-b5c17a3b9fa0?w=400",
  },
  {
    id: "2",
    name: "BMW AutoCenter Surabaya",
    address: "Jl. Pemuda No. 45",
    city: "Surabaya",
    province: "Jawa Timur",
    phone: "+62 812-3456-7891",
    whatsapp: "6281234567891",
    hours: "Mon-Sat: 09:00-17:00",
    rating: 4.9,
    reviews: 89,
    specialties: ["BMW", "European", "Luxury"],
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
  },
  {
    id: "3",
    name: "EV Indonesia",
    address: "Jl. Gatot Subroto No. 78",
    city: "Bandung",
    province: "Jawa Barat",
    phone: "+62 812-3456-7892",
    whatsapp: "6281234567892",
    hours: "Mon-Sat: 09:00-18:00",
    rating: 4.7,
    reviews: 67,
    specialties: ["Electric", "Tesla", "Hyundai"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400",
  },
  {
    id: "4",
    name: "Honda Istana Yogyakarta",
    address: "Jl. Malioboro No. 12",
    city: "Yogyakarta",
    province: "DI Yogyakarta",
    phone: "+62 812-3456-7894",
    whatsapp: "6281234567894",
    hours: "Mon-Sat: 08:30-17:30",
    rating: 4.6,
    reviews: 124,
    specialties: ["Honda", "Japanese", "Family"],
    image: "https://images.unsplash.com/photo-1606611013016-969c19ba27c9?w=400",
  },
  {
    id: "5",
    name: "Auto2000 Semarang",
    address: "Jl. Pandanaran No. 56",
    city: "Semarang",
    province: "Jawa Tengah",
    phone: "+62 812-3456-7895",
    whatsapp: "6281234567895",
    hours: "Mon-Sat: 09:00-17:00",
    rating: 4.5,
    reviews: 98,
    specialties: ["Toyota", "Hybrid", "MPV"],
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400",
  },
  {
    id: "6",
    name: "Suzuki Dipo Jakarta",
    address: "Jl. Kemang No. 89",
    city: "Jakarta",
    province: "DKI Jakarta",
    phone: "+62 812-3456-7897",
    whatsapp: "6281234567897",
    hours: "Mon-Sat: 09:00-18:00",
    rating: 4.4,
    reviews: 76,
    specialties: ["Suzuki", "SUV", "Offroad"],
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400",
  },
]

export default function LocationsPage() {
  const [search, setSearch] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const cities = [...new Set(dealers.map((d) => d.city))]

  const filteredDealers = dealers.filter((dealer) => {
    const matchesSearch = !search ||
      dealer.name.toLowerCase().includes(search.toLowerCase()) ||
      dealer.address.toLowerCase().includes(search.toLowerCase()) ||
      dealer.city.toLowerCase().includes(search.toLowerCase())
    const matchesCity = !selectedCity || dealer.city === selectedCity
    return matchesSearch && matchesCity
  })

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-red-dark pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-wide">
            FIND A DEALER
          </h1>
          <p className="text-white/60 mt-1">
            Visit our trusted dealers across Indonesia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, address, or city..."
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-12 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-gold"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-400 mb-6">
          {filteredDealers.length} dealer{filteredDealers.length !== 1 ? "s" : ""} found
        </p>

        {/* Dealers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDealers.map((dealer) => (
            <div
              key={dealer.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors"
            >
              {/* Image */}
              <img
                src={dealer.image}
                alt={dealer.name}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{dealer.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-gold" fill="currentColor" />
                    <span className="text-sm text-gold">{dealer.rating}</span>
                    <span className="text-xs text-gray-500">({dealer.reviews})</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold flex-shrink-0" />
                    {dealer.address}, {dealer.city}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold flex-shrink-0" />
                    {dealer.hours}
                  </p>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {dealer.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-xs bg-red-600/20 text-red-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${dealer.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${dealer.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.address + ', ' + dealer.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-gray-400 hover:text-white transition-colors"
                  >
                    <Navigation className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDealers.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No dealers found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
