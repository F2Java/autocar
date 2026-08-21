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

// Mock car data
const car = {
  id: "1",
  slug: "toyota-supra-2024",
  title: "2024 Toyota GR Supra 3.0",
  description:
    "The legendary Toyota GR Supra returns with a stunning design and thrilling performance. This brand-new 2024 model features a BMW-sourced 3.0L turbocharged inline-6 engine producing 382 horsepower, paired with an 8-speed automatic transmission. The car comes fully loaded with premium features including a head-up display, JBL premium audio, and Toyota Safety Sense suite.",
  make: "Toyota",
  model: "GR Supra",
  year: 2024,
  condition: "NEW",
  price: 1250000000,
  originalPrice: 1350000000,
  currency: "IDR",
  negotiable: true,
  installmentAvail: true,
  installmentFrom: 25000000,
  downPayment: 250000000,
  mileage: 0,
  previousOwners: 0,
  vin: "JTEBR3FJ70K000001",
  exteriorColor: "Prominence Red",
  interiorColor: "Black Leather",
  engine: "3.0L Turbocharged Inline-6",
  horsepower: 382,
  torque: "500 Nm",
  drivetrain: "RWD",
  numDoors: 2,
  numSeats: 2,
  transmission: "8-Speed Automatic",
  fuelType: "Gasoline",
  topSpeed: 250,
  acceleration: "0-100 km/h in 4.1s",
  fuelConsumption: "8.4 L/100km",
  bodyType: "Coupe",
  city: "Jakarta",
  province: "DKI Jakarta",
  address: "Jl. Sudirman No. 123, Jakarta Selatan",
  latitude: -6.2088,
  longitude: 106.8456,
  sellerType: "dealer",
  dealerName: "AutoCar Premium Showroom",
  dealerPhone: "+62 812-3456-7890",
  dealerEmail: "sales@autocar-premium.com",
  dealerWhatsapp: "6281234567890",
  dealerWebsite: "https://autocar-premium.com",
  coverImage: "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=1200",
  videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  images: [
    "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=1200",
    "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200",
    "https://images.unsplash.com/photo-1562911791-c7f87f3d4a77?w=1200",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200",
  ],
  videos: [
    { url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", title: "Full Walkaround" },
    { url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", title: "Interior Tour" },
  ],
  features: [
    "Head-Up Display",
    "JBL Premium Audio",
    "Toyota Safety Sense",
    "Adaptive Cruise Control",
    "Blind Spot Monitor",
    "Lane Keep Assist",
    "Apple CarPlay",
    "Android Auto",
    "Wireless Charging",
    "Heated Seats",
    "Adaptive Suspension",
    "Limited Slip Differential",
  ],
  safetyFeatures: [
    "8 Airbags",
    "ABS + EBD",
    "Vehicle Stability Control",
    "Traction Control",
    "Pre-Collision System",
    "Dynamic Radar Cruise Control",
  ],
  views: 1247,
  favorites: 89,
  isFeatured: true,
  publishedAt: "2024-01-15",
}

export default function CarDetailPage() {
  const [activeImage, setActiveImage] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredContact: "whatsapp",
  })

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)

  const handleWhatsApp = () => {
    const phone = car.dealerWhatsapp
    const message = encodeURIComponent(
      `Hi, I'm interested in the ${car.year} ${car.make} ${car.model} listed at ${formatPrice(car.price)}. Is this still available?`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
  }

  const handleEmail = () => {
    const subject = encodeURIComponent(`Inquiry: ${car.year} ${car.make} ${car.model}`)
    const body = encodeURIComponent(
      `Hi,\n\nI'm interested in the ${car.year} ${car.make} ${car.model} listed at ${formatPrice(car.price)}.\n\nPlease provide more details.\n\nThank you.`
    )
    window.open(`mailto:${car.dealerEmail}?subject=${subject}&body=${body}`)
  }

  const specs = [
    { icon: Gauge, label: "Mileage", value: car.mileage ? `${car.mileage.toLocaleString()} km` : "0 km" },
    { icon: Zap, label: "Engine", value: car.engine },
    { icon: Fuel, label: "Fuel", value: car.fuelType },
    { icon: Settings, label: "Transmission", value: car.transmission },
    { icon: Car, label: "Body", value: car.bodyType },
    { icon: Shield, label: "Drivetrain", value: car.drivetrain },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Breadcrumb */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/cars" className="hover:text-white transition-colors">Cars</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{car.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Media */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Video/Image */}
            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              {activeImage === 0 && car.videoUrl ? (
                <VideoCard
                  src={car.videoUrl}
                  poster={car.coverImage}
                  alt={car.title}
                  aspectRatio="video"
                  muted
                />
              ) : (
                <div className="aspect-video">
                  <img
                    src={car.images[activeImage] || car.coverImage}
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-2">
              {car.videos.map((video, i) => (
                <button
                  key={`video-${i}`}
                  onClick={() => setActiveImage(0)}
                  className={cn(
                    "aspect-video rounded-lg overflow-hidden relative border-2 transition-all",
                    activeImage === 0
                      ? "border-blue-500"
                      : "border-transparent hover:border-slate-600"
                  )}
                >
                  <img
                    src={car.coverImage}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="h-6 w-6 text-white" fill="white" />
                  </div>
                </button>
              ))}
              {car.images.slice(1, 4).map((img, i) => (
                <button
                  key={`img-${i}`}
                  onClick={() => setActiveImage(i + 1)}
                  className={cn(
                    "aspect-video rounded-lg overflow-hidden border-2 transition-all",
                    activeImage === i + 1
                      ? "border-blue-500"
                      : "border-transparent hover:border-slate-600"
                  )}
                >
                  <img
                    src={img}
                    alt={`${car.title} image ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-3">
                DESCRIPTION
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {car.description}
              </p>
            </div>

            {/* Key Specs */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-4">
                KEY SPECIFICATIONS
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                    <spec.icon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">{spec.label}</p>
                      <p className="text-sm font-medium text-white">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-4">
                FEATURES & EQUIPMENT
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Safety */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-4">
                SAFETY FEATURES
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {car.safetyFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Price & Contact */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 sticky top-24">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-xs font-bold text-white">
                      {car.condition}
                    </span>
                    {car.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500 text-xs font-bold text-white flex items-center gap-1">
                        <Star className="h-3 w-3" fill="currentColor" /> Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-white font-heading tracking-wide mt-2">
                    {car.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {car.city}, {car.province}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {car.views.toLocaleString()} views
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-blue-400 font-heading">
                      {formatPrice(car.price)}
                    </span>
                    {car.originalPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        {formatPrice(car.originalPrice)}
                      </span>
                    )}
                  </div>
                  {car.negotiable && (
                    <p className="text-xs text-emerald-400 mt-1">Price negotiable</p>
                  )}
                  {car.installmentAvail && car.installmentFrom && (
                    <p className="text-xs text-slate-400 mt-1">
                      From {formatPrice(car.installmentFrom)}/month
                    </p>
                  )}
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat via WhatsApp
                  </button>
                  <button
                    onClick={handleEmail}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    Send Email
                  </button>
                  <a
                    href={`tel:${car.dealerPhone}`}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-700 text-white hover:bg-slate-800 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    Call Dealer
                  </a>
                </div>

                {/* Quick Inquiry Form */}
                <div className="border-t border-slate-800 pt-4">
                  <h3 className="text-sm font-bold text-white mb-3">QUICK INQUIRY</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (inquiryForm.preferredContact === "whatsapp") {
                        handleWhatsApp()
                      } else {
                        handleEmail()
                      }
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      required
                      aria-label="Your name"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      required
                      aria-label="Email address"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      aria-label="Phone number"
                    />
                    <textarea
                      placeholder="Message (optional)"
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="w-full h-20 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                      aria-label="Message"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Send className="h-4 w-4" /> Send
                      </button>
                    </div>
                  </form>
                </div>

                {/* Dealer Info */}
                <div className="border-t border-slate-800 pt-4">
                  <h3 className="text-sm font-bold text-white mb-3">SELLER INFORMATION</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-white font-medium">{car.dealerName}</p>
                    <p className="text-slate-400 flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {car.dealerPhone}
                    </p>
                    <p className="text-slate-400 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {car.dealerEmail}
                    </p>
                    <p className="text-slate-400 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {car.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Eye({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
