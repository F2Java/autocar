"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Car,
  DollarSign,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Loader2,
  Send,
} from "lucide-react"

export default function EstimatePage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    carMake: "",
    carModel: "",
    carYear: "",
    condition: "",
    budget: "",
    message: "",
    preferredContact: "whatsapp",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))

    setLoading(false)
    setSubmitted(true)
  }

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white font-heading mb-4">
            REQUEST SUBMITTED!
          </h1>
          <p className="text-gray-400 mb-8">
            Thank you for your interest. Our team will contact you within 24 hours
            with personalized recommendations and pricing.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/cars"
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
            >
              Browse Cars
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-neutral-700 text-gray-400 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-red-dark pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-wide">
            REQUEST ESTIMATE
          </h1>
          <p className="text-white/60 mt-1">
            Get a free quote for your dream car
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white font-heading mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gold" />
              YOUR INFORMATION
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="6281234567890"
                  className="w-full h-11 px-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Preferred Contact</label>
                <select
                  value={form.preferredContact}
                  onChange={(e) => updateField("preferredContact", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
            </div>
          </div>

          {/* Car Info */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white font-heading mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-gold" />
              CAR PREFERENCES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Make</label>
                <select
                  value={form.carMake}
                  onChange={(e) => updateField("carMake", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">Any Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Model</label>
                <input
                  type="text"
                  value={form.carModel}
                  onChange={(e) => updateField("carModel", e.target.value)}
                  placeholder="e.g. Civic, Corolla, Model 3"
                  className="w-full h-11 px-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Year</label>
                <select
                  value={form.carYear}
                  onChange={(e) => updateField("carYear", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">Any Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="older">2019 or older</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => updateField("condition", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">No Preference</option>
                  <option value="NEW">New</option>
                  <option value="USED">Used</option>
                  <option value="CERTIFIED">Certified Pre-Owned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Budget & Message */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white font-heading mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold" />
              BUDGET & DETAILS
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Budget Range (IDR)</label>
                <select
                  value={form.budget}
                  onChange={(e) => updateField("budget", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">Select Budget</option>
                  <option value="under-200">Under Rp 200 Juta</option>
                  <option value="200-400">Rp 200-400 Juta</option>
                  <option value="400-600">Rp 400-600 Juta</option>
                  <option value="600-1000">Rp 600 Juta - 1 Miliar</option>
                  <option value="over-1000">Over Rp 1 Miliar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Additional Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  rows={4}
                  placeholder="Ceritakan lebih banyak tentang yang kamu cari...'re looking for..."
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Request Free Estimate
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By submitting, you agree to our terms. We&apos;ll contact you within 24 hours.
          </p>
        </form>
      </div>
    </div>
  )
}
