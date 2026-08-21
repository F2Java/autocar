"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Car,
  Eye,
  Heart,
  TrendingUp,
  DollarSign,
  MessageCircle,
  Mail,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"

// Mock data for charts
const viewsData = [
  { name: "Mon", views: 1200, inquiries: 45 },
  { name: "Tue", views: 1800, inquiries: 62 },
  { name: "Wed", views: 1500, inquiries: 38 },
  { name: "Thu", views: 2200, inquiries: 78 },
  { name: "Fri", views: 2800, inquiries: 95 },
  { name: "Sat", views: 3200, inquiries: 112 },
  { name: "Sun", views: 2400, inquiries: 82 },
]

const categoryData = [
  { name: "SUV", value: 45, color: "#3B82F6" },
  { name: "Sedan", value: 30, color: "#06B6D4" },
  { name: "Electric", value: 15, color: "#10B981" },
  { name: "MPV", value: 10, color: "#F59E0B" },
]

const recentCars = [
  {
    id: "1",
    title: "2024 Toyota GR Supra 3.0",
    price: 1250000000,
    status: "AVAILABLE",
    views: 1247,
    condition: "NEW",
    coverImage: "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=200",
  },
  {
    id: "2",
    title: "2023 Tesla Model 3 Long Range",
    price: 650000000,
    status: "AVAILABLE",
    views: 2341,
    condition: "USED",
    coverImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200",
  },
  {
    id: "3",
    title: "2024 BMW M4 Competition",
    price: 2100000000,
    status: "SOLD",
    views: 892,
    condition: "NEW",
    coverImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200",
  },
  {
    id: "4",
    title: "2023 Suzuki Jimny Sierra",
    price: 350000000,
    status: "RESERVED",
    views: 2890,
    condition: "USED",
    coverImage: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=200",
  },
  {
    id: "5",
    title: "2024 Hyundai Ioniq 5",
    price: 750000000,
    status: "AVAILABLE",
    views: 3210,
    condition: "NEW",
    coverImage: "https://images.unsplash.com/photo-1619317588810-42e1e1be4f32?w=200",
  },
]

const recentInquiries = [
  {
    id: "1",
    buyerName: "Ahmad Rizky",
    carTitle: "2024 Toyota GR Supra 3.0",
    message: "Is this still available? Can I schedule a test drive?",
    preferredContact: "whatsapp",
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    buyerName: "Sarah Chen",
    carTitle: "2023 Tesla Model 3 Long Range",
    message: "What's the battery health status?",
    preferredContact: "email",
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    buyerName: "Budi Santoso",
    carTitle: "2024 BMW M4 Competition",
    message: "Is the price negotiable?",
    preferredContact: "whatsapp",
    createdAt: "1 day ago",
  },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCars: 19,
    totalViews: 15247,
    totalInquiries: 512,
    totalRevenue: 0,
    viewsChange: 12.5,
    inquiriesChange: 8.3,
    carsChange: 5.2,
  })

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-heading tracking-wide">
          DASHBOARD
        </h1>
        <p className="text-slate-400 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Cars",
            value: stats.totalCars.toString(),
            change: stats.carsChange,
            icon: Car,
            color: "from-blue-600 to-blue-800",
            href: "/admin/cars",
          },
          {
            label: "Total Views",
            value: stats.totalViews.toLocaleString(),
            change: stats.viewsChange,
            icon: Eye,
            color: "from-emerald-600 to-emerald-800",
            href: "/admin/analytics",
          },
          {
            label: "Inquiries",
            value: stats.totalInquiries.toLocaleString(),
            change: stats.inquiriesChange,
            icon: MessageCircle,
            color: "from-purple-600 to-purple-800",
            href: "/admin/inquiries",
          },
          {
            label: "Active Campaigns",
            value: "3",
            change: 15,
            icon: Mail,
            color: "from-amber-600 to-amber-800",
            href: "/admin/campaigns",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-blue-500/30 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div
                className={cn(
                  "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
                  stat.color
                )}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {stat.change > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-400" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  stat.change > 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {Math.abs(stat.change)}%
              </span>
              <span className="text-xs text-slate-500">vs last week</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views Chart */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white font-heading tracking-wide">
                VIEWS & INQUIRIES
              </h2>
              <p className="text-sm text-slate-400">Last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-400">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Inquiries</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsData}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="inquiriesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#F1F5F9",
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#viewsGradient)"
              />
              <Area
                type="monotone"
                dataKey="inquiries"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#inquiriesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-6">
            BY CATEGORY
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#F1F5F9",
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-slate-300">{cat.name}</span>
                </div>
                <span className="text-sm text-white font-medium">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <div className="bg-slate-900 rounded-xl border border-slate-800">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide">
                RECENT LISTINGS
              </h2>
              <Link
                href="/admin/cars"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-800">
            {recentCars.map((car) => (
              <div key={car.id} className="p-4 flex items-center gap-4 hover:bg-slate-800/30 transition-colors">
                <img
                  src={car.coverImage}
                  alt={car.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{car.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-blue-400 font-bold">
                      {formatPrice(car.price)}
                    </span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-xs font-medium",
                        car.status === "AVAILABLE"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : car.status === "SOLD"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                      )}
                    >
                      {car.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {car.views.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-slate-900 rounded-xl border border-slate-800">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide">
                RECENT INQUIRIES
              </h2>
              <Link
                href="/admin/inquiries"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-800">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white font-medium">{inquiry.buyerName}</p>
                    <p className="text-xs text-blue-400 mt-0.5">{inquiry.carTitle}</p>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      inquiry.preferredContact === "whatsapp"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-blue-500/20 text-blue-400"
                    )}
                  >
                    {inquiry.preferredContact}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-2 line-clamp-1">
                  &ldquo;{inquiry.message}&rdquo;
                </p>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {inquiry.createdAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
