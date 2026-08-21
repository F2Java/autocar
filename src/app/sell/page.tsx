"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Car,
  Camera,
  Video,
  DollarSign,
  User,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  X,
  Plus,
  AlertCircle,
} from "lucide-react"
import { UploadZone } from "@/components/ui/upload-zone"
import { VideoUploader } from "@/components/ui/video-uploader"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, label: "Car Details", icon: Car },
  { id: 2, label: "Media", icon: Camera },
  { id: 3, label: "Pricing", icon: DollarSign },
  { id: 4, label: "Contact", icon: User },
]

const makes = ["Toyota", "Honda", "BMW", "Mercedes-Benz", "Tesla", "Suzuki", "Mitsubishi", "Hyundai", "Kia", "Nissan"]
const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Pickup Truck", "Van", "MPV"]
const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid", "CNG", "LPG"]
const transmissions = ["Automatic", "Manual", "CVT", "DCT"]
const conditions = ["New", "Used", "Certified Pre-Owned"]
const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

export default function SellCarPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState({
    // Step 1: Car Details
    make: "", model: "", year: "", condition: "Used", bodyType: "",
    fuelType: "", transmission: "", engine: "", horsepower: "",
    mileage: "", vin: "", exteriorColor: "", interiorColor: "",
    description: "",
    // Step 2: Media
    coverImage: null as File | null,
    images: [] as File[],
    video: null as File | null,
    videoUrl: "",
    // Step 3: Pricing
    price: "", originalPrice: "", negotiable: true,
    installmentAvail: true, installmentFrom: "",
    // Step 4: Contact
    sellerType: "individual", dealerName: "", phone: "", email: "",
    whatsapp: "", city: "", province: "", address: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    if (step === 1) {
      if (!form.make) newErrors.make = "Make is required"
      if (!form.model) newErrors.model = "Model is required"
      if (!form.year) newErrors.year = "Year is required"
      if (!form.condition) newErrors.condition = "Condition is required"
    }
    if (step === 3) {
      if (!form.price) newErrors.price = "Price is required"
    }
    if (step === 4) {
      if (!form.phone) newErrors.phone = "Phone is required"
      if (!form.email) newErrors.email = "Email is required"
      if (!form.city) newErrors.city = "City is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    if (!validateStep(4)) return
    // Submit logic here
    alert("Car listing submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-bold text-white font-heading tracking-wide mb-6">
            SELL YOUR CAR
          </h1>

          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      currentStep >= step.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-500"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:block",
                      currentStep >= step.id ? "text-white" : "text-slate-500"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 sm:w-20 h-0.5 mx-2 sm:mx-4",
                      currentStep > step.id ? "bg-blue-600" : "bg-slate-800"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8">
          {/* Step 1: Car Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide">
                CAR DETAILS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Make" error={errors.make}>
                  <select
                    value={form.make}
                    onChange={(e) => updateForm("make", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Make</option>
                    {makes.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Model" error={errors.model}>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => updateForm("model", e.target.value)}
                    placeholder="e.g., Camry, Civic, X5"
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </FormField>

                <FormField label="Year" error={errors.year}>
                  <select
                    value={form.year}
                    onChange={(e) => updateForm("year", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Condition" error={errors.condition}>
                  <select
                    value={form.condition}
                    onChange={(e) => updateForm("condition", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    {conditions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Body Type">
                  <select
                    value={form.bodyType}
                    onChange={(e) => updateForm("bodyType", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Body Type</option>
                    {bodyTypes.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Fuel Type">
                  <select
                    value={form.fuelType}
                    onChange={(e) => updateForm("fuelType", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypes.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Transmission">
                  <select
                    value={form.transmission}
                    onChange={(e) => updateForm("transmission", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Transmission</option>
                    {transmissions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Mileage (km)">
                  <input
                    type="number"
                    value={form.mileage}
                    onChange={(e) => updateForm("mileage", e.target.value)}
                    placeholder="e.g., 25000"
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Describe your car's condition, history, and any notable features..."
                  className="w-full h-32 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </FormField>
            </div>
          )}

          {/* Step 2: Media */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide">
                PHOTOS & VIDEO
              </h2>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Cover Photo *
                </label>
                <UploadZone
                  type="image"
                  multiple={false}
                  carId={form.model ? `${form.make}-${form.model}-${form.year}` : undefined}
                  onUploadComplete={(files) => {
                    if (files[0]) updateForm("coverImage", files[0].url)
                  }}
                />
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Additional Photos
                </label>
                <UploadZone
                  type="image"
                  multiple={true}
                  maxFiles={8}
                  carId={form.model ? `${form.make}-${form.model}-${form.year}` : undefined}
                  onUploadComplete={(files) => {
                    const urls = files.map((f) => f.url)
                    updateForm("images", [...(form.images || []), ...urls])
                  }}
                />
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Video Tour
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Upload a video walkthrough of your car. Videos significantly increase buyer interest.
                </p>
                <VideoUploader
                  carId={form.model ? `${form.make}-${form.model}-${form.year}` : undefined}
                  maxVideos={3}
                  onVideosChange={(videos) => {
                    if (videos[0]) updateForm("videoUrl", videos[0].url)
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide">
                PRICING
              </h2>

              <FormField label="Price (IDR) *" error={errors.price}>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => updateForm("price", e.target.value)}
                  placeholder="e.g., 500000000"
                  className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </FormField>

              <FormField label="Original Price (MSRP)">
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) => updateForm("originalPrice", e.target.value)}
                  placeholder="Optional"
                  className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </FormField>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.negotiable}
                    onChange={(e) => updateForm("negotiable", e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Price negotiable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.installmentAvail}
                    onChange={(e) => updateForm("installmentAvail", e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Installment available</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide">
                CONTACT INFORMATION
              </h2>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Seller Type
                </label>
                <div className="flex gap-3">
                  {["individual", "dealer", "showroom"].map((type) => (
                    <button
                      key={type}
                      onClick={() => updateForm("sellerType", type)}
                      className={cn(
                        "flex-1 h-10 rounded-lg text-sm font-medium transition-all capitalize",
                        form.sellerType === type
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {form.sellerType !== "individual" && (
                <FormField label="Dealer/Showroom Name">
                  <input
                    type="text"
                    value={form.dealerName}
                    onChange={(e) => updateForm("dealerName", e.target.value)}
                    placeholder="Business name"
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </FormField>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Phone *" error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </FormField>

                <FormField label="WhatsApp">
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => updateForm("whatsapp", e.target.value)}
                    placeholder="6281234567890"
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </FormField>

                <FormField label="Email *" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </FormField>

                <FormField label="City *" error={errors.city}>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                    placeholder="e.g., Jakarta"
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </FormField>
              </div>

              <FormField label="Address">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                  placeholder="Full address"
                  className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </FormField>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 text-white hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors glow-blue"
              >
                <Check className="h-4 w-4" /> Submit Listing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
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
      <label className="block text-sm font-medium text-white mb-1.5">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  )
}
