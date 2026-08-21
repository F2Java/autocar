"use client"

import {
  BarChart3,
  TrendingUp,
  Eye,
  MessageCircle,
  Car,
  DollarSign,
  Users,
  Calendar,
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
  LineChart,
  Line,
} from "recharts"

const monthlyData = [
  { month: "Jan", views: 4500, inquiries: 180, listings: 25 },
  { month: "Feb", views: 5200, inquiries: 210, listings: 30 },
  { month: "Mar", views: 6800, inquiries: 280, listings: 35 },
  { month: "Apr", views: 7200, inquiries: 310, listings: 28 },
  { month: "May", views: 8500, inquiries: 380, listings: 42 },
  { month: "Jun", views: 9200, inquiries: 420, listings: 38 },
  { month: "Jul", views: 10800, inquiries: 490, listings: 45 },
  { month: "Aug", views: 12400, inquiries: 560, listings: 50 },
]

const topPerformingCars = [
  { name: "Toyota GR Supra", views: 1247, inquiries: 45,转化率: "3.6%" },
  { name: "Tesla Model 3", views: 2341, inquiries: 78,转化率: "3.3%" },
  { name: "Suzuki Jimny", views: 2890, inquiries: 92,转化率: "3.2%" },
  { name: "Hyundai Ioniq 5", views: 3210, inquiries: 89,转化率: "2.8%" },
  { name: "BMW M4", views: 892, inquiries: 34,转化率: "3.8%" },
]

const trafficSources = [
  { source: "Direct", percentage: 35, color: "#3B82F6" },
  { source: "Google Search", percentage: 28, color: "#10B981" },
  { source: "Social Media", percentage: 22, color: "#F59E0B" },
  { source: "WhatsApp", percentage: 10, color: "#22C55E" },
  { source: "Email", percentage: 5, color: "#8B5CF6" },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-heading tracking-wide">
          ANALYTICS
        </h1>
        <p className="text-slate-400 mt-1">Performance insights and trends</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Views", value: "64,600", change: "+18.2%", icon: Eye, color: "text-blue-400" },
          { label: "Total Inquiries", value: "2,830", change: "+22.5%", icon: MessageCircle, color: "text-emerald-400" },
          { label: "Conversion Rate", value: "4.4%", change: "+0.8%", icon: TrendingUp, color: "text-purple-400" },
          { label: "Avg. Response Time", value: "2.3h", change: "-15%", icon: Calendar, color: "text-amber-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-3">
              <stat.icon className={cn("h-5 w-5", stat.color)} />
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            </div>
            <p className={cn("text-sm font-medium mt-2", stat.change.startsWith("+") ? "text-emerald-400" : "text-red-400")}>
              {stat.change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views & Inquiries Trend */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-6">
            VIEWS & INQUIRIES TREND
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="inquiriesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#F1F5F9",
                }}
              />
              <Area type="monotone" dataKey="views" stroke="#3B82F6" fillOpacity={1} fill="url(#viewsGrad)" />
              <Area type="monotone" dataKey="inquiries" stroke="#10B981" fillOpacity={1} fill="url(#inquiriesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Listings Growth */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-6">
            NEW LISTINGS
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#F1F5F9",
                }}
              />
              <Bar dataKey="listings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Cars */}
        <div className="bg-slate-900 rounded-xl border border-slate-800">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white font-heading tracking-wide">
              TOP PERFORMING CARS
            </h2>
          </div>
          <div className="divide-y divide-slate-800">
            {topPerformingCars.map((car, i) => (
              <div key={car.name} className="p-4 flex items-center gap-4">
                <span className="text-lg font-bold text-slate-500 w-8">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{car.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {car.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> {car.inquiries}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-emerald-400 font-medium">{car.转化率}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-6">
            TRAFFIC SOURCES
          </h2>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">{source.source}</span>
                  <span className="text-sm text-white font-medium">{source.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${source.percentage}%`,
                      backgroundColor: source.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
