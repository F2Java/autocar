"use client"

import Link from "next/link"
import { X, ArrowRight, GitCompareArrows } from "lucide-react"
import { useCompare } from "@/lib/compare-context"

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4">
          {/* Selected Cars */}
          <div className="flex-1 flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 text-gold flex-shrink-0">
              <GitCompareArrows className="h-5 w-5" />
              <span className="text-sm font-medium">{compareList.length}/4</span>
            </div>

            {compareList.map((car) => (
              <div
                key={car.id}
                className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-2 flex-shrink-0"
              >
                <img
                  src={car.coverImage || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=100"}
                  alt={car.title}
                  className="w-10 h-8 rounded object-cover"
                />
                <div className="min-w-0">
                  <p className="text-xs text-white truncate max-w-[120px]">{car.title}</p>
                  <p className="text-xs text-gold">
                    Rp {(car.price / 1000000).toFixed(0)}M
                  </p>
                </div>
                <button
                  onClick={() => removeFromCompare(car.id)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  aria-label={`Remove ${car.title} from compare`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clearCompare}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
            <Link
              href={`/compare?ids=${compareList.map((c) => c.id).join(",")}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
            >
              Compare
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
