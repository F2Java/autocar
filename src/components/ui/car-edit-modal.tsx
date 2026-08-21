"use client"

import { useState, useEffect } from "react"
import {
  X,
  Save,
  Image,
  Video,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react"
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
}

interface CarEditModalProps {
  car: CarData | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<CarData>) => void
}

const conditions = ["NEW", "USED", "CERTIFIED_PRE_OWNED"]
const statuses = ["AVAILABLE", "SOLD", "RESERVED", "PENDING", "DRAFT"]
const bodyTypes = ["SEDAN", "SUV", "HATCHBACK", "COUPE", "CONVERTIBLE", "WAGON", "PICKUP_TRUCK", "VAN", "MPV"]
const fuelTypes = ["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID", "PLUGIN_HYBRID"]
const transmissions = ["AUTOMATIC", "MANUAL", "CVT", "DCT"]

export function CarEditModal({ car, isOpen, onClose, onSave }: CarEditModalProps) {
  const [form, setForm] = useState<Partial<CarData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  // Additional images (up to 6)
  const [images, setImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")

  useEffect(() => {
    if (car) {
      setForm({ ...car })
      // Extract images from car data
      const allImages = [car.coverImage].filter(Boolean) as string[]
      setImages(allImages.length > 0 ? allImages : [""])
    }
  }, [car])

  const updateField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const addImage = () => {
    if (newImageUrl && images.length < 6) {
      setImages([...images, newImageUrl])
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated.length > 0 ? updated : [""])
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.make) newErrors.make = "Required"
    if (!form.model) newErrors.model = "Required"
    if (!form.year) newErrors.year = "Required"
    if (!form.price) newErrors.price = "Required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)

    // Combine images: first one is coverImage
    const validImages = images.filter(Boolean)
    const coverImage = validImages[0] || form.coverImage

    onSave({
      ...form,
      coverImage,
    })

    setSaving(false)
  }

  if (!isOpen || !car) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white font-heading tracking-wide">EDIT CAR</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Basic Info */}
          <Section title="Basic Information">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Make *" error={errors.make}>
                <input value={form.make || ""} onChange={(e) => updateField("make", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Model *" error={errors.model}>
                <input value={form.model || ""} onChange={(e) => updateField("model", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Year *" error={errors.year}>
                <input type="number" value={form.year || ""} onChange={(e) => updateField("year", parseInt(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Condition">
                <select value={form.condition || ""} onChange={(e) => updateField("condition", e.target.value)} className={inputCls}>
                  {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Description">
              <textarea value={form.description || ""} onChange={(e) => updateField("description", e.target.value)} rows={2} className={cn(inputCls, "resize-none")} />
            </Field>
          </Section>

          {/* Specs */}
          <Section title="Specifications">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Body Type">
                <select value={form.bodyType || ""} onChange={(e) => updateField("bodyType", e.target.value)} className={inputCls}>
                  {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Fuel Type">
                <select value={form.fuelType || ""} onChange={(e) => updateField("fuelType", e.target.value)} className={inputCls}>
                  {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Transmission">
                <select value={form.transmission || ""} onChange={(e) => updateField("transmission", e.target.value)} className={inputCls}>
                  {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Horsepower">
                <input type="number" value={form.horsepower || ""} onChange={(e) => updateField("horsepower", parseInt(e.target.value))} className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* Pricing */}
          <Section title="Pricing & Status">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Price (IDR) *" error={errors.price}>
                <input type="number" value={form.price || ""} onChange={(e) => updateField("price", parseInt(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Status">
                <select value={form.status || ""} onChange={(e) => updateField("status", e.target.value)} className={inputCls}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Exterior Color">
                <input value={form.exteriorColor || ""} onChange={(e) => updateField("exteriorColor", e.target.value)} className={inputCls} />
              </Field>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300 pb-2">
                  <input type="checkbox" checked={form.negotiable ?? true} onChange={(e) => updateField("negotiable", e.target.checked)} className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-gold" />
                  Negotiable
                </label>
              </div>
            </div>
          </Section>

          {/* Images - 6 slots */}
          <Section title="Photos (up to 6)">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  {url ? (
                    <>
                      <img src={url} alt={`Photo ${i + 1}`} className="w-full h-32 object-cover rounded-lg border border-neutral-700" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 px-2 py-0.5 rounded text-xs bg-gold/90 text-black font-medium">
                          Cover
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-32 rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center text-gray-500">
                      <Image className="h-6 w-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Image URL */}
            {images.length < 6 && (
              <div className="flex gap-2 mt-3">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL and press Add"
                  className={cn(inputCls, "flex-1")}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                />
                <button
                  onClick={addImage}
                  disabled={!newImageUrl}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Paste image URLs (Unsplash, Imgur, etc.) — first image is the cover</p>
          </Section>

          {/* Video */}
          <Section title="Video Tour">
            <Field label="Video URL (YouTube, Vimeo, or MP4)">
              <input
                type="url"
                value={form.videoUrl || ""}
                onChange={(e) => updateField("videoUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                className={inputCls}
              />
            </Field>
            {form.videoUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-neutral-700">
                <div className="aspect-video bg-neutral-800 flex items-center justify-center">
                  <Video className="h-8 w-8 text-gray-500" />
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo, or direct MP4 link</p>
          </Section>

          {/* Seller Info */}
          <Section title="Seller Info">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Dealer Name">
                <input value={form.dealerName || ""} onChange={(e) => updateField("dealerName", e.target.value)} className={inputCls} />
              </Field>
              <Field label="WhatsApp">
                <input type="tel" value={form.dealerWhatsapp || ""} onChange={(e) => updateField("dealerWhatsapp", e.target.value)} className={inputCls} placeholder="6281313717101" />
              </Field>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-neutral-800">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

// Reusable components
const inputCls = "w-full h-10 px-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gold font-heading tracking-wide mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
