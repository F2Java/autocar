"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Car, DollarSign, HelpCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface WhatsAppFloatProps {
  phoneNumber: string
  message?: string
  businessName?: string
}

const quickMessages = [
  { icon: Car, label: "Cari Mobil", message: "Halo! Saya ingin mencari mobil. Bisa bantu saya?" },
  { icon: DollarSign, label: "Minta Penawaran", message: "Halo! Saya ingin minta penawaran mobil. Bisa info harga?" },
  { icon: HelpCircle, label: "Bantuan", message: "Halo! Saya butuh bantuan terkait Pasar Mobil Bekas." },
]

export function WhatsAppFloat({
  phoneNumber,
  message = "Halo! Saya tertarik dengan mobil yang dijual. Bisa bantu saya?",
  businessName = "Pasar Mobil Bekas",
}: WhatsAppFloatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState("")
  const [sending, setSending] = useState(false)

  const handleSend = async (msg?: string) => {
    const finalMsg = msg || customMessage || message
    setSending(true)

    try {
      // Try API first
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: phoneNumber,
          message: finalMsg,
          type: "customer_inquiry",
        }),
      })

      const data = await res.json()

      if (data.clickToChatUrl) {
        // Always open click-to-chat as primary method
        window.open(data.clickToChatUrl, "_blank")
      }
    } catch {
      // Fallback to direct click-to-chat
      const phone = phoneNumber.replace(/[^0-9]/g, "")
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(finalMsg)}`, "_blank")
    }

    setSending(false)
    setCustomMessage("")
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[300px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-green-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{businessName}</p>
                  <p className="text-green-100 text-xs">Online biasanya dalam hitungan menit</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#ECE5DD]">
            {/* Welcome message bubble */}
            <div className="bg-white rounded-lg p-3 shadow-sm mb-3 max-w-[85%]">
              <p className="text-gray-800 text-sm">
                Halo! 👋 Selamat datang di <strong>{businessName}</strong>.
              </p>
              <p className="text-gray-800 text-sm mt-1">
                Ada yang bisa kami bantu?
              </p>
              <p className="text-gray-400 text-[10px] mt-1 text-right">
                {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {/* Quick message buttons */}
            <div className="space-y-2 mb-3">
              {quickMessages.map((qm) => (
                <button
                  key={qm.label}
                  onClick={() => handleSend(qm.message)}
                  disabled={sending}
                  className="w-full flex items-center gap-3 p-2.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <qm.icon className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-800 font-medium">{qm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customMessage.trim() && !sending) {
                    handleSend()
                  }
                }}
                disabled={sending}
              />
              <button
                onClick={() => {
                  if (customMessage.trim() && !sending) {
                    handleSend()
                  }
                }}
                disabled={!customMessage.trim() || sending}
                className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center text-white transition-colors disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          isOpen
            ? "bg-gray-600 rotate-90"
            : "bg-green-500 hover:bg-green-600 hover:scale-110 pulse"
        )}
        aria-label={isOpen ? "Close chat" : "Chat via WhatsApp"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-7 w-7 text-white" fill="white" />
        )}
      </button>
    </div>
  )
}
