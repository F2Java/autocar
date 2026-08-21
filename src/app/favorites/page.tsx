"use client"

import Link from "next/link"
import { Heart, Trash2, Car, ArrowLeft } from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-red-dark pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-wide">
                MY FAVORITES
              </h1>
              <p className="text-white/60 mt-1">
                {favorites.length} saved car{favorites.length !== 1 ? "s" : ""}
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={clearFavorites}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-700 text-gray-400 hover:text-red-400 hover:border-red-500 text-sm transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="text-center py-20 bg-neutral-900 rounded-xl border border-neutral-800">
            <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Favorites Yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Browse our listings and tap the heart icon to save cars you like
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
            >
              <Car className="h-5 w-5" />
              Browse Cars
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((car) => (
              <div
                key={car.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group hover:border-neutral-700 transition-colors"
              >
                {/* Image */}
                <Link href={`/cars/${car.slug}`} className="block relative">
                  <img
                    src={car.coverImage || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600"}
                    alt={car.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {car.videoUrl && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs">
                      🎬 Video
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link href={`/cars/${car.slug}`}>
                    <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors line-clamp-1">
                      {car.year} {car.make} {car.model}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-400 mt-1">{car.city}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-gold">
                      {formatPrice(car.price)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      car.condition === "NEW" ? "bg-green-600/20 text-green-400" :
                      car.condition === "USED" ? "bg-yellow-600/20 text-yellow-400" :
                      "bg-blue-600/20 text-blue-400"
                    }`}>
                      {car.condition}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      href={`/cars/${car.slug}`}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium text-center transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => removeFavorite(car.id)}
                      className="p-2.5 rounded-xl border border-neutral-700 text-gray-400 hover:text-red-400 hover:border-red-500 transition-colors"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
