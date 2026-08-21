"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Fuel,
  Gauge,
  Calendar,
  MapPin,
  Heart,
  Share2,
  MessageCircle,
  Zap,
  Car,
  Shield,
  Star,
} from "lucide-react"
import { VideoCard } from "./video-card"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

interface CarCardProps {
  id: string
  slug: string
  title: string
  make: string
  model: string
  year: number
  condition: "NEW" | "USED" | "CERTIFIED_PRE_OWNED"
  price: number
  currency?: string
  mileage?: number
  fuelType: string
  transmission: string
  city?: string
  province?: string
  coverImage?: string
  videoUrl?: string
  videoThumbnail?: string
  features?: string[]
  isFeatured?: boolean
  isPromoted?: boolean
  negotiable?: boolean
  sellerType?: string
  dealerName?: string
  dealerWhatsapp?: string
  exteriorColor?: string
  horsepower?: number
  className?: string
}

export function CarCard({
  id,
  slug,
  title,
  make,
  model,
  year,
  condition,
  price,
  currency = "IDR",
  mileage,
  fuelType,
  transmission,
  city,
  province,
  coverImage,
  videoUrl,
  videoThumbnail,
  features = [],
  isFeatured,
  isPromoted,
  negotiable,
  sellerType,
  dealerName,
  dealerWhatsapp,
  exteriorColor,
  horsepower,
  className,
}: CarCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const formatPrice = (amount: number) => {
    if (currency === "IDR") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const conditionConfig = {
    NEW: { label: "New", variant: "default" as const, color: "bg-emerald-500" },
    USED: { label: "Used", variant: "outline" as const, color: "bg-amber-500" },
    CERTIFIED_PRE_OWNED: { label: "CPO", variant: "default" as const, color: "bg-blue-500" },
  }

  const conditionInfo = conditionConfig[condition]

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const phone = dealerWhatsapp?.replace(/[^0-9]/g, "")
    if (phone) {
      const message = encodeURIComponent(
        `Hi, I'm interested in the ${year} ${make} ${model} listed at ${formatPrice(price)}. Is this still available?`
      )
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: `${year} ${make} ${model}`,
        text: `Check out this ${year} ${make} ${model} for ${formatPrice(price)}`,
        url: `${window.location.origin}/cars/${slug}`,
      })
    }
  }

  return (
    <Link href={`/cars/${slug}`} className={cn("block group", className)}>
      <article
        className={cn(
          "relative bg-slate-900 rounded-2xl overflow-hidden transition-all duration-300",
          "border border-slate-800 hover:border-blue-500/30",
          "hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_30px_rgba(59,130,246,0.1)]",
          "hover:-translate-y-1"
        )}
      >
        {/* Video/Image Section */}
        <div className="relative">
          {videoUrl ? (
            <VideoCard
              src={videoUrl}
              poster={videoThumbnail || coverImage}
              alt={`${year} ${make} ${model}`}
              aspectRatio="video"
              muted
              loop
              showControls
            />
          ) : (
            <div className="aspect-video relative overflow-hidden bg-slate-800">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={`${year} ${make} ${model}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <Car className="h-16 w-16 text-slate-600" />
                </div>
              )}
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider",
                conditionInfo.color
              )}
            >
              {conditionInfo.label}
            </span>
            {isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white flex items-center gap-1">
                <Star className="h-3 w-3" fill="currentColor" /> Featured
              </span>
            )}
            {isPromoted && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                Promoted
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsFavorited(!isFavorited)
              }}
              className={cn(
                "w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200",
                isFavorited
                  ? "bg-red-500/90 text-white"
                  : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
              )}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className="h-4 w-4"
                fill={isFavorited ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-black/60 hover:text-white flex items-center justify-center transition-all duration-200"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Video Play Indicator */}
          {videoUrl && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs">
                <PlayIcon className="h-3 w-3" /> Video
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title & Price */}
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 font-heading tracking-wide">
              {year} {make} {model}
            </h3>
            {dealerName && (
              <p className="text-sm text-slate-400 mt-1">{dealerName}</p>
            )}
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-bold text-blue-400 font-heading">
                {formatPrice(price)}
              </span>
              {negotiable && (
                <span className="text-xs text-emerald-400 font-medium">Negotiable</span>
              )}
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Gauge className="h-4 w-4 text-blue-500" />
              <span>{mileage ? `${mileage.toLocaleString()} km` : "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Fuel className="h-4 w-4 text-emerald-500" />
              <span>{fuelType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>{transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span>{year}</span>
            </div>
          </div>

          {/* Color & HP */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            {exteriorColor && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full border border-slate-600"
                  style={{ backgroundColor: exteriorColor }}
                />
                <span>{exteriorColor}</span>
              </div>
            )}
            {horsepower && (
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                <span>{horsepower} HP</span>
              </div>
            )}
          </div>

          {/* Location */}
          {(city || province) && (
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <MapPin className="h-4 w-4" />
              <span>
                {city}
                {city && province && ", "}
                {province}
              </span>
            </div>
          )}

          {/* Features Preview */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {features.slice(0, 3).map((feature, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700"
                >
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-500">
                  +{features.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-slate-800" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {dealerWhatsapp && (
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
                aria-label={`Contact via WhatsApp for ${year} ${make} ${model}`}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </button>
            )}
            <Link
              href={`/cars/${slug}`}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </Link>
          </div>
        </div>
      </article>
    </Link>
  )
}

// Small play icon for the video badge
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
