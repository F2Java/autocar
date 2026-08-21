"use client"

import { useState } from "react"
import { MessageCircle, Copy, Check, ExternalLink } from "lucide-react"
import { waTemplates } from "@/lib/wa-templates"

const PHONE = "6281313717101"

const testCases = [
  {
    name: "General Inquiry",
    url: `https://wa.me/${PHONE}?text=${encodeURIComponent(waTemplates.general())}`,
    message: waTemplates.general(),
  },
  {
    name: "Car Inquiry (Toyota Supra)",
    url: `https://wa.me/${PHONE}?text=${encodeURIComponent(waTemplates.carInquiry("2024 Toyota GR Supra 3.0", "Rp 1.250.000.000"))}`,
    message: waTemplates.carInquiry("2024 Toyota GR Supra 3.0", "Rp 1.250.000.000"),
  },
  {
    name: "Sell Car",
    url: `https://wa.me/${PHONE}?text=${encodeURIComponent(waTemplates.sellCar("Toyota Camry 2020, Silver, 30.000 km"))}`,
    message: waTemplates.sellCar("Toyota Camry 2020, Silver, 30.000 km"),
  },
  {
    name: "Dealer Contact",
    url: `https://wa.me/${PHONE}?text=${encodeURIComponent(waTemplates.dealerContact("AutoCar Premium"))}`,
    message: waTemplates.dealerContact("AutoCar Premium"),
  },
  {
    name: "Estimate Request",
    url: `https://wa.me/${PHONE}?text=${encodeURIComponent(waTemplates.estimate("Mobil SUV baru, budget Rp 500 juta"))}`,
    message: waTemplates.estimate("Mobil SUV baru, budget Rp 500 juta"),
  },
  {
    name: "Test Drive",
    url: `https://wa.me/${PHONE}?text=${encodeURIComponent(waTemplates.testDrive("Tesla Model 3", "Sabtu, 25 Agustus 2026"))}`,
    message: waTemplates.testDrive("Tesla Model 3", "Sabtu, 25 Agustus 2026"),
  },
  {
    name: "Financing Inquiry",
    url: `https://wa.me/${PHONE}?text=${encodeURIComponent(waTemplates.financing("Honda Civic RS", "Rp 400 juta"))}`,
    message: waTemplates.financing("Honda Civic RS", "Rp 400 juta"),
  },
]

export default function TestWhatsAppPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-2">WhatsApp Link Test</h1>
        <p className="text-gray-400 mb-8">Test all WhatsApp message templates</p>

        {/* Phone Number */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-400">Target Phone:</p>
          <p className="text-lg font-bold text-gold">+62 813-1371-7101</p>
        </div>

        {/* Test Links */}
        <div className="space-y-4">
          {testCases.map((tc, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white">{tc.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(tc.url, i)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedIndex === i ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <a
                    href={tc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <p className="text-xs text-gray-500 break-all mb-2">{tc.url}</p>
              <pre className="text-xs text-gray-400 bg-neutral-800 p-2 rounded overflow-x-auto">
                {tc.message}
              </pre>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-green-600/10 border border-green-600/30 rounded-xl p-4">
          <h3 className="font-bold text-green-400 mb-2">📱 How to Test on Mobile</h3>
          <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
            <li>Open this page on your phone</li>
            <li>Tap the green button on any test case</li>
            <li>WhatsApp should open with pre-filled message</li>
            <li>Verify the message content is correct</li>
            <li>Send the message to test delivery</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
