"use client"

import { useState } from "react"
import {
  Mail,
  Send,
  BarChart3,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Eye,
  MousePointerClick,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Campaign {
  id: string
  name: string
  channel: string
  status: string
  subject?: string
  totalSent: number
  totalOpened: number
  totalClicked: number
  totalFailed: number
  createdAt: string
  sentAt?: string
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "New Year Car Sale",
    channel: "BOTH",
    status: "SENT",
    subject: "New Year, New Car! Special Deals Inside",
    totalSent: 1250,
    totalOpened: 890,
    totalClicked: 234,
    totalFailed: 12,
    createdAt: "2024-01-01T00:00:00Z",
    sentAt: "2024-01-01T01:00:00Z",
  },
  {
    id: "2",
    name: "Electric Vehicle Promotion",
    channel: "EMAIL",
    status: "SENT",
    subject: "Go Electric! Tesla & EV Deals",
    totalSent: 500,
    totalOpened: 320,
    totalClicked: 89,
    totalFailed: 5,
    createdAt: "2024-01-15T00:00:00Z",
    sentAt: "2024-01-15T02:00:00Z",
  },
]

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns)
  const [showCreate, setShowCreate] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    name: "",
    subject: "",
    headline: "",
    body: "",
    channel: "email" as "email" | "whatsapp" | "both",
    recipients: "",
    carTitle: "",
    carPrice: "",
    ctaText: "View Cars",
    ctaUrl: "https://autocar.id/cars",
  })

  const handleSend = async () => {
    setSending(true)
    try {
      const recipientList = form.recipients
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [email, name] = line.split(",").map((s) => s.trim())
          return { email, name: name || email.split("@")[0] }
        })

      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          channel: form.channel,
          subject: form.subject,
          headline: form.headline,
          messageTemplate: form.body,
          recipients: recipientList,
          carTitle: form.carTitle || undefined,
          carPrice: form.carPrice || undefined,
          ctaText: form.ctaText,
          ctaUrl: form.ctaUrl,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        alert(`Campaign sent! ${data.results?.email?.sent || 0} emails sent.`)
        setShowCreate(false)
        setForm({
          name: "", subject: "", headline: "", body: "",
          channel: "email", recipients: "", carTitle: "",
          carPrice: "", ctaText: "View Cars", ctaUrl: "https://autocar.id/cars",
        })
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (err) {
      alert("Failed to send campaign")
    } finally {
      setSending(false)
    }
  }

  const stats = {
    totalSent: campaigns.reduce((s, c) => s + c.totalSent, 0),
    totalOpened: campaigns.reduce((s, c) => s + c.totalOpened, 0),
    totalClicked: campaigns.reduce((s, c) => s + c.totalClicked, 0),
    totalFailed: campaigns.reduce((s, c) => s + c.totalFailed, 0),
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white font-heading tracking-wide">
                EMAIL CAMPAIGNS
              </h1>
              <p className="text-slate-400 mt-1">
                Manage bulk email promotions and track delivery
              </p>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" /> New Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Sent", value: stats.totalSent, icon: Send, color: "text-blue-400" },
            { label: "Opened", value: stats.totalOpened, icon: Eye, color: "text-emerald-400" },
            { label: "Clicked", value: stats.totalClicked, icon: MousePointerClick, color: "text-purple-400" },
            { label: "Failed", value: stats.totalFailed, icon: XCircle, color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center gap-3">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Campaign Form */}
        {showCreate && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8">
            <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-6">
              CREATE CAMPAIGN
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Campaign Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., New Year Car Sale"
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Channel</label>
                  <div className="flex gap-2">
                    {(["email", "whatsapp", "both"] as const).map((ch) => (
                      <button
                        key={ch}
                        onClick={() => setForm({ ...form, channel: ch })}
                        className={cn(
                          "flex-1 h-10 rounded-lg text-sm font-medium capitalize transition-all",
                          form.channel === ch
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        )}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Email Subject *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g., Special Deal: 2024 Toyota Supra"
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Headline</label>
                  <input
                    type="text"
                    value={form.headline}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    placeholder="e.g., Don't Miss Out!"
                    className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Body (HTML supported) *</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    placeholder="Write your promotional message here..."
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none font-mono"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    Recipients (email,name per line) *
                  </label>
                  <textarea
                    value={form.recipients}
                    onChange={(e) => setForm({ ...form, recipients: e.target.value })}
                    placeholder="buyer1@email.com, John Doe&#10;buyer2@email.com, Jane Smith"
                    rows={8}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    One recipient per line: email,name
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">Car Title (optional)</label>
                    <input
                      type="text"
                      value={form.carTitle}
                      onChange={(e) => setForm({ ...form, carTitle: e.target.value })}
                      placeholder="2024 Toyota Supra"
                      className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">Car Price</label>
                    <input
                      type="text"
                      value={form.carPrice}
                      onChange={(e) => setForm({ ...form, carPrice: e.target.value })}
                      placeholder="Rp 1.250.000.000"
                      className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">CTA Text</label>
                    <input
                      type="text"
                      value={form.ctaText}
                      onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">CTA URL</label>
                    <input
                      type="url"
                      value={form.ctaUrl}
                      onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Preview</p>
                  <div className="bg-slate-900 rounded-lg p-4">
                    <p className="text-xs text-blue-400 mb-1">From: AutoCar &lt;noreply@autocar.id&gt;</p>
                    <p className="text-sm text-white font-medium mb-1">{form.subject || "Email Subject"}</p>
                    <p className="text-xs text-slate-400 line-clamp-3">
                      {form.body || "Email body preview..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-800">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-white text-sm hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !form.name || !form.subject || !form.recipients}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? "Sending..." : "Send Campaign"}
              </button>
            </div>
          </div>
        )}

        {/* Campaign List */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white font-heading tracking-wide">
              CAMPAIGN HISTORY
            </h2>
          </div>

          <div className="divide-y divide-slate-800">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{campaign.name}</h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          campaign.status === "SENT"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : campaign.status === "SCHEDULED"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-slate-500/20 text-slate-400"
                        )}
                      >
                        {campaign.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
                        {campaign.channel}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{campaign.subject}</p>
                    <p className="text-xs text-slate-500">
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-white font-bold">{campaign.totalSent.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-emerald-400 font-bold">{campaign.totalOpened.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">Opened</p>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-400 font-bold">{campaign.totalClicked.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">Clicked</p>
                    </div>
                    <div className="text-center">
                      <p className="text-red-400 font-bold">{campaign.totalFailed}</p>
                      <p className="text-xs text-slate-400">Failed</p>
                    </div>
                  </div>
                </div>

                {/* Open Rate Bar */}
                {campaign.totalSent > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Open rate</span>
                      <span>{Math.round((campaign.totalOpened / campaign.totalSent) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${(campaign.totalOpened / campaign.totalSent) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {campaigns.length === 0 && (
              <div className="p-12 text-center">
                <Mail className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No campaigns yet</p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                >
                  Create your first campaign
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
