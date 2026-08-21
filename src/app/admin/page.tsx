"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Car,
  Eye,
  TrendingUp,
  MessageCircle,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star,
  BarChart3,
  Loader2,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"

interface Stats {
  totalCars: number
  activeCars: number
  pendingCars: number
  soldCars: number
  totalInquiries: number
  newInquiries: number
  featuredCars: number
  totalViews: number
}

interface RecentCar {
  id: string
  slug: string
  title: string
  make: string
  model: string
  year: number
  condition: string
  status: string
  price: number
  coverImage: string | null
  views: number
  createdAt: string
}

interface RecentInquiry {
  id: string
  name: string
  email: string
  message: string | null
  preferredContact: string
  status: string
  createdAt: string
  car: { title: string; slug: string } | null
}

interface DashboardData {
  stats: Stats
  distribution: {
    byCondition: Array<{ name: string; count: number }>
    byFuelType: Array<{ name: string; count: number }>
  }
  recentCars: RecentCar[]
  recentInquiries: RecentInquiry[]
}

const CONDITION_COLORS: Record<string, string> = {
  NEW: "#22C55E",
  USED: "#EAB308",
  CERTIFIED_PRE_OWNED: "#3B82F6",
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => setData(json.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-400">
        Failed to load dashboard data
      </div>
    )
  }

  const { stats, distribution, recentCars, recentInquiries } = data

  const statCards = [
    { label: "Total Cars", value: stats.totalCars, icon: Car, color: "text-red-500", change: "+12%", up: true },
    { label: "Active Listings", value: stats.activeCars, icon: Eye, color: "text-green-500", change: "+8%", up: true },
    { label: "Total Views", value: stats.totalViews.toLocaleString(), icon: TrendingUp, color: "text-gold", change: "+23%", up: true },
    { label: "New Inquiries", value: stats.newInquiries, icon: MessageCircle, color: "text-blue-500", change: "+5%", up: true },
    { label: "Featured Cars", value: stats.featuredCars, icon: Star, color: "text-yellow-500", change: "0%", up: false },
    { label: "Pending Review", value: stats.pendingCars, icon: Clock, color: "text-orange-500", change: "-3%", up: false },
  ]

  // Use distribution data for pie chart
  const categoryData = distribution.byCondition.map((c) => ({
    name: c.name,
    value: c.count,
    color: CONDITION_COLORS[c.name] || "#666",
  }))

  // Use distribution data for bar chart
  const fuelData = distribution.byFuelType.map((c) => ({
    name: c.name,
    value: c.count,
  }))

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={cn("h-5 w-5", stat.color)} />
              <span className={cn(
                "flex items-center gap-1 text-xs font-medium",
                stat.up ? "text-green-400" : "text-red-400"
              )}>
                {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Type Distribution */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white font-heading tracking-wide mb-4">
            BY FUEL TYPE
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area type="monotone" dataKey="value" stroke="#DC2626" fill="#DC2626" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Condition Distribution */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white font-heading tracking-wide mb-4">
            BY CONDITION
          </h3>
          <div className="h-64 flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">No data yet</p>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-gray-400">{cat.name}: {cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Listings & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cars */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white font-heading tracking-wide">
              RECENT LISTINGS
            </h3>
            <Link href="/admin/cars" className="text-sm text-gold hover:text-gold-light">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentCars.length === 0 ? (
              <p className="text-gray-400 text-sm">No listings yet</p>
            ) : (
              recentCars.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
                >
                  <img
                    src={car.coverImage || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=100"}
                    alt={car.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{car.title}</p>
                    <p className="text-xs text-gray-400">
                      Rp {(car.price / 1000000).toFixed(0)}M • {car.views} views
                    </p>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs",
                    car.condition === "NEW" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"
                  )}>
                    {car.condition}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white font-heading tracking-wide">
              RECENT INQUIRIES
            </h3>
            <Link href="/admin/inquiries" className="text-sm text-gold hover:text-gold-light">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-gray-400 text-sm">No inquiries yet</p>
            ) : (
              recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="p-3 rounded-lg bg-neutral-800/50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-white font-medium">{inquiry.name}</p>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs",
                      inquiry.status === "NEW"
                        ? "bg-red-600/20 text-red-400"
                        : "bg-green-600/20 text-green-400"
                    )}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {inquiry.car?.title || "General inquiry"}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{inquiry.preferredContact}</span>
                    <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
