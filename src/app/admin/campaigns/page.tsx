"use client"

import { useState, useEffect } from "react"
import {
  Mail,
  Send,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Eye,
  MousePointerClick,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Campaign {
  id: string
  name: string
  description: string | null
  channel: string
  status: string
  subject: string | null
  messageTemplate: string | null
  totalSent: number
  totalOpened: number
  totalClicked: number
  totalFailed: number
  createdAt: string
  sentAt: string | null
}

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  DRAFT: { icon: Clock, color: "text-gray-400", label: "Draft" },
  SCHEDULED: { icon: Clock, color: "text-yellow-400", label: "Scheduled" },
  SENDING: { icon: Send, color: "text-blue-400", label: "Sending" },
  SENT: { icon: CheckCircle, color: "text-green-400", label: "Sent" },
  FAILED: { icon: XCircle, color: "text-red-400", label: "Failed" },
  CANCELLED: { icon: XCircle, color: "text-gray-400", label: "Cancelled" },
}

const channelConfig: Record<string, string> = {
  WHATSAPP: "bg-green-600/20 text-green-400",
  EMAIL: "bg-blue-600/20 text-blue-400",
  BOTH: "bg-purple-600/20 text-purple-400",
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: "",
    channel: "BOTH",
    subject: "",
    messageTemplate: "",
  })
  const [creating, setCreating] = useState(false)

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/promotions")
      const data = await res.json()
      setCampaigns(data.data || [])
    } catch (error) {
      console.error("Error fetching campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      })
      if (res.ok) {
        setShowCreate(false)
        setCreateForm({ name: "", channel: "BOTH", subject: "", messageTemplate: "" })
        fetchCampaigns()
      }
    } catch (error) {
      console.error("Error creating campaign:", error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-wide">
            CAMPAIGNS
          </h1>
          <p className="text-gray-400 mt-1">
            {loading ? "Loading..." : `${campaigns.length} campaigns`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCampaigns}
            className="p-2.5 rounded-xl bg-neutral-800 text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" /> New Campaign
          </button>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-bold text-white font-heading mb-4">NEW CAMPAIGN</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Channel</label>
                <select
                  value={createForm.channel}
                  onChange={(e) => setCreateForm({ ...createForm, channel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Email</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>
              {createForm.channel !== "WHATSAPP" && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email Subject</label>
                  <input
                    type="text"
                    value={createForm.subject}
                    onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Message Template</label>
                <textarea
                  rows={4}
                  value={createForm.messageTemplate}
                  onChange={(e) => setCreateForm({ ...createForm, messageTemplate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-gold resize-none"
                  placeholder="Use {{name}}, {{car}}, {{price}} for personalization"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-gold animate-spin" />
        </div>
      )}

      {/* Campaigns List */}
      {!loading && (
        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900 rounded-xl border border-neutral-800">
              <Mail className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">No campaigns yet</p>
              <button
                onClick={() => setShowCreate(true)}
                className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
              >
                Create First Campaign
              </button>
            </div>
          ) : (
            campaigns.map((campaign) => {
              const st = statusConfig[campaign.status] || statusConfig.DRAFT
              const StatusIcon = st.icon

              return (
                <div
                  key={campaign.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{campaign.name}</h3>
                      {campaign.subject && (
                        <p className="text-sm text-gray-400 mt-0.5">{campaign.subject}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", channelConfig[campaign.channel] || "")}>
                        {campaign.channel}
                      </span>
                      <span className={cn("flex items-center gap-1 text-xs", st.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {st.label}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <Send className="h-3 w-3" />
                      </div>
                      <p className="text-lg font-bold text-white">{campaign.totalSent}</p>
                      <p className="text-xs text-gray-500">Sent</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <Eye className="h-3 w-3" />
                      </div>
                      <p className="text-lg font-bold text-white">{campaign.totalOpened}</p>
                      <p className="text-xs text-gray-500">Opened</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <MousePointerClick className="h-3 w-3" />
                      </div>
                      <p className="text-lg font-bold text-white">{campaign.totalClicked}</p>
                      <p className="text-xs text-gray-500">Clicked</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <XCircle className="h-3 w-3" />
                      </div>
                      <p className="text-lg font-bold text-white">{campaign.totalFailed}</p>
                      <p className="text-xs text-gray-500">Failed</p>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Created: {new Date(campaign.createdAt).toLocaleDateString("id-ID")}
                    {campaign.sentAt && ` • Sent: ${new Date(campaign.sentAt).toLocaleDateString("id-ID")}`}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
