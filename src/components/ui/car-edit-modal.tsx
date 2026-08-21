"use client"

import { useState, useEffect, useRef } from "react"
import {
  X,
  Save,
  Car,
  Fuel,
  Gauge,
  MapPin,
  DollarSign,
  Image,
  Video,
  AlertCircle,
} from "lucide-react"
import { UploadZone } from "./upload-zone"
import { VideoUploader } from "./video-uploader"
import { cn } from "@/lib/utils"

interface CarData {
  id: string
  slug: string
  title: string
  description?: string
  make: string
  model: string
  year: number
  condition: string
  status: string
  bodyType: string
  fuelType: string
  transmission: string
  engine?: string
  horsepower?: number
  torque?: string
  drivetrain?: string
  mileage?: number
  price: number
  negotiable: boolean
  exteriorColor?: string
  interiorColor?: string
  features: string[]
  city?: string
  province?: string
  dealerName?: string
  dealerWhatsapp?: string
  dealerPhone?: string
  dealerEmail?: string
  coverImage?: string
  videoUrl?: string
  isFeatured: boolean
}

interface CarEditModalProps {
  car: CarData | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<CarData>) => void
}

const makes = ["Toyota", "Honda", "BMW", "Mercedes-Benz", "Tesla", "Suzuki", "Mitsubishi", "Hyundai", "Kia", "Nissan", "Mazda", "Daihatsu", "Ford"]
const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "MPV", "Pickup Truck"]
const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid"]
const transmissions = ["Automatic", "Manual", "CVT"]
const conditions = ["New", "Used", "Certified Pre-Owned"]
const statuses = ["AVAILABLE", "SOLD", "RESERVED", "PENDING", "DRAFT"]

export function CarEditModal({ car, isOpen, onClose, onSave }: CarEditModalProps) {
  const [form, setForm] = useState<Partial<CarData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (car) {
      setForm({ ...car })
      setErrors({})
    }
  }, [car])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen || !car) return null

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.make) newErrors.make = "Make is required"
    if (!form.model) newErrors.model = "Model is required"
    if (!form.year || form.year < 1900) newErrors.year = "Valid year is required"
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500))
    onSave(form)
    setSaving(false)
    onClose()
  }

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-fade-in-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center">
              <Car className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading tracking-wide">
                EDIT LISTING
              </h2>
              <p className="text-sm text-slate-400">{car.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <SectionTitle title="Basic Info" />

              <FormField label="Make *" error={errors.make}>
                <select
                  value={form.make || ""}
                  onChange={(e) => updateField("make", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">Select Make</option>
                  {makes.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Model *" error={errors.model}>
                <input
                  type="text"
                  value={form.model || ""}
                  onChange={(e) => updateField("model", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Year *" error={errors.year}>
                  <input
                    type="number"
                    value={form.year || ""}
                    onChange={(e) => updateField("year", parseInt(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  />
                </FormField>
                <FormField label="Condition">
                  <select
                    value={form.condition || ""}
                    onChange={(e) => updateField("condition", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  >
                    {conditions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  value={form.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold resize-none"
                />
              </FormField>

              <SectionTitle title="Specifications" />

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Body Type">
                  <select
                    value={form.bodyType || ""}
                    onChange={(e) => updateField("bodyType", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  >
                    {bodyTypes.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Fuel Type">
                  <select
                    value={form.fuelType || ""}
                    onChange={(e) => updateField("fuelType", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  >
                    {fuelTypes.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Transmission">
                  <select
                    value={form.transmission || ""}
                    onChange={(e) => updateField("transmission", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  >
                    {transmissions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Horsepower">
                  <input
                    type="number"
                    value={form.horsepower || ""}
                    onChange={(e) => updateField("horsepower", parseInt(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  />
                </FormField>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <SectionTitle title="Pricing & Status" />

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Price (IDR) *" error={errors.price}>
                  <input
                    type="number"
                    value={form.price || ""}
                    onChange={(e) => updateField("price", parseInt(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  />
                </FormField>
                <FormField label="Status">
                  <select
                    value={form.status || ""}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.negotiable || false}
                    onChange={(e) => updateField("negotiable", e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-gold focus:ring-gold"
                  />
                  <span className="text-sm text-white">Negotiable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured || false}
                    onChange={(e) => updateField("isFeatured", e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-gold focus:ring-gold"
                  />
                  <span className="text-sm text-white">Featured</span>
                </label>
              </div>

              {form.price && form.price > 0 && (
                <div className="p-3 rounded-lg bg-red-600/10 border border-gold/20">
                  <p className="text-sm text-slate-400">Preview</p>
                  <p className="text-xl font-bold text-gold font-heading">
                    {formatPrice(form.price)}
                  </p>
                </div>
              )}

              <SectionTitle title="Location" />

              <div className="grid grid-cols-2 gap-3">
                <FormField label="City">
                  <input
                    type="text"
                    value={form.city || ""}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  />
                </FormField>
                <FormField label="Province">
                  <input
                    type="text"
                    value={form.province || ""}
                    onChange={(e) => updateField("province", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  />
                </FormField>
              </div>

              <SectionTitle title="Seller Info" />

              <FormField label="Dealer Name">
                <input
                  type="text"
                  value={form.dealerName || ""}
                  onChange={(e) => updateField("dealerName", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="WhatsApp">
                  <input
                    type="tel"
                    value={form.dealerWhatsapp || ""}
                    onChange={(e) => updateField("dealerWhatsapp", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  />
                </FormField>
                <FormField label="Phone">
                  <input
                    type="tel"
                    value={form.dealerPhone || ""}
                    onChange={(e) => updateField("dealerPhone", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-gold"
                  />
                </FormField>
              </div>

              <SectionTitle title="Photos & Video" />

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Cover Image</label>
                <UploadZone
                  type="image"
                  multiple={false}
                  carId={form.slug}
                  onUploadComplete={(files) => {
                    if (files[0]) updateField("coverImage", files[0].url)
                  }}
                />
                {form.coverImage && (
                  <div className="mt-2 relative">
                    <img
                      src={form.coverImage}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => updateField("coverImage", null)}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Additional Photos</label>
                <UploadZone
                  type="image"
                  multiple={true}
                  maxFiles={8}
                  carId={form.slug}
                  onUploadComplete={(files) => {
                    // Handle additional images
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Video Tour</label>
                <VideoUploader
                  carId={form.slug}
                  maxVideos={3}
                  onVideosChange={(videos) => {
                    if (videos[0]) updateField("videoUrl", videos[0].url)
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-white text-sm hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-bold text-white font-heading tracking-wider pt-2 border-t border-slate-800 first:border-0 first:pt-0">
      {title}
    </h3>
  )
}

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  )
}
