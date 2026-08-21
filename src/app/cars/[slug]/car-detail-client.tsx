"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Play,
  ExternalLink,
  Car,
  Settings,
  Ruler,
  Award,
  Send,
} from "lucide-react"
import { VideoCard } from "@/components/ui/video-card"
import { cn } from "@/lib/utils"

interface CarData {
  id: string
  slug: string
  title: string
  description: string
  make: string
  model: string
  year: number
  condition: string
  price: number
  originalPrice: number | null
  currency: string
  negotiable: boolean
  installmentAvail: boolean
  installmentFrom: number | null
  downPayment: number | null
  mileage: number
  previousOwners: number
  fuelType: string
  transmission: string
  bodyType: string
  city: string
  province: string
  address: string
  exteriorColor: string
  interiorColor: string
  horsepower: number
  torque: string
  engine: string
  drivetrain: string
  topSpeed: number
  acceleration: string
  features: string[]
  coverImage: string
  videoUrl: string
  videoThumbnail: string | null
  images: string[]
  dealerName: string
  dealerPhone: string
  dealerEmail: string
  dealerWhatsapp: string
  dealerType: string
  dealerAvatar: string | null
  views: number
  favorites: number
  isFeatured: boolean
  createdAt: string
}

interface CarDetailClientProps {
  car: CarData
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function formatMileage(km: number): string {
  return new Intl.NumberFormat("id-ID").format(km) + " km"
}

const conditionColors: Record<string, string> = {
  NEW: "bg-green-600",
  USED: "bg-yellow-600",
  CERTIFIED_PRE_OWNED: "bg-blue-600",
}

const conditionLabels: Record<string, string> = {
  NEW: "New",
  USED: "Used",
  CERTIFIED_PRE_OWNED: "Certified",
}

export function CarDetailClient({ car }: CarDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredContact: "whatsapp",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/cars/${car.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryForm),
      })
      if (res.ok) {
        setSubmitted(true)
        setShowInquiryForm(false)
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const allImages = [car.coverImage, ...car.images].filter(Boolean)

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-red-dark pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/cars" className="hover:text-gold transition-colors">Browse Cars</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gold">{car.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
              {activeImage === 0 && car.videoUrl ? (
                <VideoCard
                  src={car.videoUrl}
                  poster={car.coverImage}
                  alt={car.title}
                  aspectRatio="video"
                />
              ) : (
                <div className="aspect-video">
                  <img
                    src={allImages[activeImage] || car.coverImage}
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {/* Video thumbnail */}
                {car.videoUrl && (
                  <button
                    onClick={() => setActiveImage(0)}
                    className={cn(
                      "flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors relative",
                      activeImage === 0 ? "border-gold" : "border-neutral-700"
                    )}
                  >
                    <img
                      src={car.videoThumbnail || car.coverImage}
                      alt="Video"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="h-4 w-4 text-white" fill="white" />
                    </div>
                  </button>
                )}
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i + (car.videoUrl ? 1 : 0))}
                    className={cn(
                      "flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                      activeImage === i + (car.videoUrl ? 1 : 0)
                        ? "border-gold"
                        : "border-neutral-700"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${car.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium text-white",
                    conditionColors[car.condition] || "bg-gray-600"
                  )}
                >
                  {conditionLabels[car.condition] || car.condition}
                </span>
                {car.isFeatured && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold flex items-center gap-1">
                    <Star className="h-3 w-3" fill="currentColor" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-wide mb-2">
                {car.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {car.city}, {car.province}
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="h-4 w-4" />
                  {formatMileage(car.mileage)}
                </span>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-gold">
                  {formatPrice(car.price)}
                </span>
                {car.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(car.originalPrice)}
                  </span>
                )}
              </div>
              {car.negotiable && (
                <p className="text-sm text-green-400 mb-3">Price negotiable</p>
              )}
              {car.installmentAvail && car.installmentFrom && (
                <p className="text-sm text-gray-400">
                  Installment from {formatPrice(car.installmentFrom)}/month
                </p>
              )}
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: "Year", value: car.year.toString() },
                { icon: Gauge, label: "Mileage", value: car.mileage > 0 ? formatMileage(car.mileage) : "New" },
                { icon: Fuel, label: "Fuel", value: car.fuelType },
                { icon: Settings, label: "Transmission", value: car.transmission },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center"
                >
                  <spec.icon className="h-5 w-5 text-gold mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">{spec.label}</p>
                  <p className="text-sm font-medium text-white">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white font-heading tracking-wide mb-3">
                  DESCRIPTION
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {car.description}
                </p>
              </div>
            )}

            {/* Technical Specs */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white font-heading tracking-wide mb-4">
                TECHNICAL SPECS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Zap, label: "Engine", value: car.engine },
                  { icon: Settings, label: "Horsepower", value: car.horsepower ? `${car.horsepower} HP` : null },
                  { icon: Settings, label: "Torque", value: car.torque },
                  { icon: Ruler, label: "Drivetrain", value: car.drivetrain },
                  { icon: Gauge, label: "Top Speed", value: car.topSpeed ? `${car.topSpeed} km/h` : null },
                  { icon: Gauge, label: "0-100 km/h", value: car.acceleration },
                  { icon: Fuel, label: "Fuel Type", value: car.fuelType },
                  { icon: Settings, label: "Body Type", value: car.bodyType },
                ].filter((s) => s.value).map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <spec.icon className="h-4 w-4 text-gold flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">{spec.label}</p>
                      <p className="text-sm text-white">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {car.features.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white font-heading tracking-wide mb-4">
                  FEATURES & EQUIPMENT
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {car.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg"
                    >
                      <Award className="h-4 w-4 text-gold flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white font-heading tracking-wide mb-4">
                CONTACT SELLER
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{car.dealerName || "Private Seller"}</p>
                  <p className="text-xs text-gray-400 capitalize">{car.dealerType}</p>
                </div>
              </div>

              {/* Quick Contact Buttons */}
              <div className="space-y-3 mb-6">
                {car.dealerWhatsapp && (
                  <a
                    href={`https://wa.me/${car.dealerWhatsapp}?text=${encodeURIComponent(
                      `Hi, I'm interested in ${car.title} listed at ${formatPrice(car.price)}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </a>
                )}
                {car.dealerPhone && (
                  <a
                    href={`tel:${car.dealerPhone}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    Call Now
                  </a>
                )}
                {car.dealerEmail && (
                  <a
                    href={`mailto:${car.dealerEmail}?subject=${encodeURIComponent(
                      `Inquiry: ${car.title}`
                    )}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-neutral-700 hover:border-gold text-white font-medium transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    Email
                  </a>
                )}
              </div>

              {/* Inquiry Form Toggle */}
              {!showInquiryForm && !submitted && (
                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gold/20 hover:bg-gold/30 text-gold font-medium transition-colors"
                >
                  <Send className="h-5 w-5" />
                  Send Inquiry
                </button>
              )}

              {submitted && (
                <div className="p-4 rounded-xl bg-green-600/20 border border-green-600/50">
                  <p className="text-sm text-green-400 text-center">
                    Inquiry sent successfully! The seller will contact you soon.
                  </p>
                </div>
              )}

              {/* Inquiry Form */}
              {showInquiryForm && (
                <form onSubmit={handleInquirySubmit} className="space-y-3 mt-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={inquiryForm.name}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-gold"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={inquiryForm.email}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-gold"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={inquiryForm.phone}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-gold"
                  />
                  <textarea
                    placeholder="Your message..."
                    rows={3}
                    value={inquiryForm.message}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, message: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-gold resize-none"
                  />
                  <div className="flex gap-2">
                    <select
                      value={inquiryForm.preferredContact}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          preferredContact: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-lg bg-gold hover:bg-gold-dark text-black text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Send"}
                    </button>
                  </div>
                </form>
              )}

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Views</span>
                  <span className="text-white">{car.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Favorites</span>
                  <span className="text-white">{car.favorites}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Listed</span>
                  <span className="text-white">
                    {new Date(car.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Share */}
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                  }}
                  className="flex items-center gap-2 flex-1 py-2.5 rounded-lg border border-neutral-700 text-gray-400 hover:text-white hover:border-gold text-sm transition-colors justify-center"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 flex-1 py-2.5 rounded-lg border border-neutral-700 text-gray-400 hover:text-red-500 hover:border-red-500 text-sm transition-colors justify-center">
                  <Heart className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
