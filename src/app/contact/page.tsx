"use client"

import { useState } from "react"
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Headphones,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setForm({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  const contactMethods = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+62 812-3456-7890",
      action: () => window.open("https://wa.me/6281234567890", "_blank"),
      color: "bg-emerald-500",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+62 21-1234-5678",
      action: () => window.open("tel:+622112345678"),
      color: "bg-blue-500",
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@autocar.id",
      action: () => window.open("mailto:hello@autocar.id"),
      color: "bg-purple-500",
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "Mon-Sat: 8AM - 6PM",
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-white font-heading tracking-wide mb-2">
            GET IN TOUCH
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Have questions? We&apos;re here to help. Reach out via WhatsApp for
            instant support or use the form below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-4">
              CONTACT US
            </h2>

            {contactMethods.map((method) => (
              <button
                key={method.label}
                onClick={method.action}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all text-left group"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    method.color
                  )}
                >
                  <method.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{method.label}</p>
                  <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                    {method.value}
                  </p>
                </div>
              </button>
            ))}

            {/* Office Location */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">OFFICE</h3>
              </div>
              <p className="text-sm text-slate-400">
                Jl. Sudirman No. 123<br />
                Jakarta Selatan, DKI Jakarta 12190<br />
                Indonesia
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white font-heading tracking-wide mb-6">
                SEND A MESSAGE
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                        aria-label="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                        aria-label="Your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                        aria-label="Your phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        required
                        className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                        aria-label="Subject"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">
                      Message *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                      aria-label="Your message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="h-4 w-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
