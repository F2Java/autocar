"use client"

import { useState } from "react"
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Reply,
  Filter,
  Search,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Inquiry {
  id: string
  buyerName: string
  buyerEmail: string
  buyerPhone?: string
  carTitle: string
  carPrice: number
  message: string
  preferredContact: "whatsapp" | "email" | "phone"
  status: "new" | "contacted" | "converted" | "closed"
  createdAt: string
}

const mockInquiries: Inquiry[] = [
  {
    id: "1",
    buyerName: "Ahmad Rizky",
    buyerEmail: "ahmad@email.com",
    buyerPhone: "6281234567890",
    carTitle: "2024 Toyota GR Supra 3.0",
    carPrice: 1250000000,
    message: "Is this still available? Can I schedule a test drive this weekend?",
    preferredContact: "whatsapp",
    status: "new",
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    buyerName: "Sarah Chen",
    buyerEmail: "sarah@email.com",
    carTitle: "2023 Tesla Model 3 Long Range",
    carPrice: 650000000,
    message: "What's the battery health status? Has it been in any accidents?",
    preferredContact: "email",
    status: "new",
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    buyerName: "Budi Santoso",
    buyerEmail: "budi@email.com",
    buyerPhone: "6281234567891",
    carTitle: "2024 BMW M4 Competition",
    carPrice: 2100000000,
    message: "Is the price negotiable? I can pay cash.",
    preferredContact: "whatsapp",
    status: "contacted",
    createdAt: "1 day ago",
  },
  {
    id: "4",
    buyerName: "Dewi Lestari",
    buyerEmail: "dewi@email.com",
    buyerPhone: "6281234567892",
    carTitle: "2023 Suzuki Jimny Sierra",
    carPrice: 350000000,
    message: "I'm interested in this Jimny. Can you send more photos?",
    preferredContact: "phone",
    status: "converted",
    createdAt: "2 days ago",
  },
  {
    id: "5",
    buyerName: "Rudi Hartono",
    buyerEmail: "rudi@email.com",
    carTitle: "2024 Hyundai Ioniq 5",
    carPrice: 750000000,
    message: "Does this come with home charging installation?",
    preferredContact: "email",
    status: "closed",
    createdAt: "3 days ago",
  },
]

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(mockInquiries)
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = inquiries.filter((inq) => {
    if (statusFilter !== "all" && inq.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        inq.buyerName.toLowerCase().includes(q) ||
        inq.carTitle.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q)
      )
    }
    return true
  })

  const updateStatus = (id: string, newStatus: Inquiry["status"]) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    )
  }

  const statusConfig = {
    new: { label: "New", color: "bg-blue-500/20 text-blue-400", icon: AlertCircle },
    contacted: { label: "Contacted", color: "bg-amber-500/20 text-amber-400", icon: Phone },
    converted: { label: "Converted", color: "bg-emerald-500/20 text-emerald-400", icon: CheckCircle },
    closed: { label: "Closed", color: "bg-slate-500/20 text-slate-400", icon: CheckCircle },
  }

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-heading tracking-wide">
          INQUIRIES
        </h1>
        <p className="text-slate-400 mt-1">
          {filtered.length} inquiries found
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(["new", "contacted", "converted", "closed"] as const).map((status) => {
          const config = statusConfig[status]
          const count = inquiries.filter((i) => i.status === status).length
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
              className={cn(
                "p-4 rounded-xl border transition-all text-left",
                statusFilter === status
                  ? "bg-slate-800 border-blue-500/50"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              )}
            >
              <div className="flex items-center gap-2">
                <config.icon className={cn("h-4 w-4", config.color.split(" ")[1])} />
                <span className="text-sm text-slate-400 capitalize">{status}</span>
              </div>
              <p className="text-2xl font-bold text-white mt-2">{count}</p>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search inquiries..."
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          aria-label="Search inquiries"
        />
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {filtered.map((inquiry) => {
          const config = statusConfig[inquiry.status]
          return (
            <div
              key={inquiry.id}
              className="bg-slate-900 rounded-xl border border-slate-800 p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium">{inquiry.buyerName}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", config.color)}>
                      {config.label}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        inquiry.preferredContact === "whatsapp"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : inquiry.preferredContact === "email"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-purple-500/20 text-purple-400"
                      )}
                    >
                      {inquiry.preferredContact}
                    </span>
                  </div>

                  <p className="text-sm text-blue-400">{inquiry.carTitle}</p>
                  <p className="text-sm text-slate-400">{formatPrice(inquiry.carPrice)}</p>

                  <div className="bg-slate-800/50 rounded-lg p-3 max-w-2xl">
                    <p className="text-sm text-slate-300">&ldquo;{inquiry.message}&rdquo;</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {inquiry.createdAt}
                    </span>
                    {inquiry.buyerPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {inquiry.buyerPhone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {inquiry.buyerEmail}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {inquiry.preferredContact === "whatsapp" && inquiry.buyerPhone && (
                    <a
                      href={`https://wa.me/${inquiry.buyerPhone}?text=Hi ${inquiry.buyerName}, thank you for your inquiry about the ${inquiry.carTitle}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      aria-label="Reply via WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  )}
                  <a
                    href={`mailto:${inquiry.buyerEmail}?subject=Re: ${inquiry.carTitle}`}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    aria-label="Reply via email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <select
                    value={inquiry.status}
                    onChange={(e) => updateStatus(inquiry.id, e.target.value as Inquiry["status"])}
                    className="h-9 px-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    aria-label="Update status"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No inquiries found</p>
          </div>
        )}
      </div>
    </div>
  )
}
