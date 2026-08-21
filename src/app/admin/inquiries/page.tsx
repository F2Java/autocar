"use client"

import { useState, useEffect } from "react"
import {
  MessageCircle,
  Mail,
  Phone,
  Loader2,
  Search,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  preferredContact: string
  status: string
  createdAt: string
  car: { title: string; slug: string; price: number } | null
}

const STATUS_OPTIONS = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"]

const statusColors: Record<string, string> = {
  NEW: "bg-red-600/20 text-red-400",
  CONTACTED: "bg-yellow-600/20 text-yellow-400",
  CONVERTED: "bg-green-600/20 text-green-400",
  CLOSED: "bg-gray-600/20 text-gray-400",
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchInquiries = async () => {
    setLoading(true)
    try {
      // Fetch cars and get their inquiries
      const res = await fetch("/api/cars?limit=100")
      const data = await res.json()
      // Inquiries are embedded in car detail - for now use a simple approach
      // We'll fetch each car's inquiries
      const allInquiries: Inquiry[] = []

      for (const car of (data.data || []).slice(0, 10)) {
        try {
          const carRes = await fetch(`/api/cars/${car.slug}`)
          const carData = await carRes.json()
          if (carData.data?.recentInquiries) {
            for (const inq of carData.data.recentInquiries) {
              allInquiries.push({
                ...inq,
                car: { title: car.title, slug: car.slug, price: car.price },
              })
            }
          }
        } catch {
          // Skip failed fetches
        }
      }

      setInquiries(allInquiries.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    } catch (error) {
      console.error("Error fetching inquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const filtered = inquiries.filter((inq) => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !inq.name.toLowerCase().includes(q) &&
        !inq.email.toLowerCase().includes(q) &&
        (inq.car?.title && !inq.car.title.toLowerCase().includes(q))
      ) {
        return false
      }
    }
    if (statusFilter !== "all" && inq.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-wide">
            INQUIRIES
          </h1>
          <p className="text-gray-400 mt-1">
            {loading ? "Loading..." : `${filtered.length} inquiries found`}
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="p-2.5 rounded-xl bg-neutral-800 text-gray-400 hover:text-white transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or car..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-gold"
            aria-label="Search inquiries"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-gold animate-spin" />
        </div>
      )}

      {/* Inquiries List */}
      {!loading && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900 rounded-xl border border-neutral-800">
              <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No inquiries found</p>
            </div>
          ) : (
            filtered.map((inq) => (
              <div
                key={inq.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">{inq.name}</p>
                    <p className="text-sm text-gray-400">{inq.email}</p>
                  </div>
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColors[inq.status] || statusColors.NEW)}>
                    {inq.status}
                  </span>
                </div>

                {inq.car && (
                  <p className="text-sm text-gold mb-2">
                    Interested in: {inq.car.title}
                  </p>
                )}

                {inq.message && (
                  <p className="text-sm text-gray-300 bg-neutral-800/50 rounded-lg p-3 mb-3">
                    {inq.message}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {inq.preferredContact}
                    </span>
                    <span>{new Date(inq.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {inq.preferredContact === "whatsapp" && inq.phone && (
                      <a
                        href={`https://wa.me/${inq.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-500 transition-colors"
                      >
                        WhatsApp
                      </a>
                    )}
                    <a
                      href={`mailto:${inq.email}`}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 text-gray-300 text-xs font-medium hover:bg-neutral-700 transition-colors"
                    >
                      <Mail className="h-3 w-3 inline mr-1" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
