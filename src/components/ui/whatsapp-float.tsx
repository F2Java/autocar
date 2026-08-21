"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface WhatsAppFloatProps {
  phoneNumber: string
  message?: string
  businessName?: string
}

export function WhatsAppFloat({
  phoneNumber,
  message = "Hi! I'm interested in your cars. Can you help me?",
  businessName = "AutoCar",
}: WhatsAppFloatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState("")

  const handleSend = () => {
    const msg = customMessage || message
    const encodedMsg = encodeURIComponent(msg)
    const phone = phoneNumber.replace(/[^0-9]/g, "")
    window.open(`https://wa.me/${phone}?text=${encodedMsg}`, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-fade-in-up">
          {/* Header */}
          <div className="bg-emerald-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{businessName}</p>
                <p className="text-emerald-100 text-xs">Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Message Bubble */}
          <div className="p-4 bg-gray-50">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-700">
                👋 Hi there! How can we help you find your dream car?
              </p>
              <p className="text-xs text-gray-400 mt-1">Just now</p>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-10 px-3 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend()
                }}
                aria-label="WhatsApp message"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center transition-colors"
                aria-label="Send message"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-lg transition-all duration-300",
          isOpen ? "rotate-0" : "animate-pulse-glow"
        )}
        style={{
          boxShadow: "0 4px 20px rgba(34, 197, 94, 0.4)",
        }}
        aria-label={isOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-xl px-4 py-2 shadow-lg whitespace-nowrap text-sm text-gray-700 font-medium opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us on WhatsApp!
        </div>
      )}
    </div>
  )
}
