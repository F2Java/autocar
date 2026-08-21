"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Car,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Globe,
  ArrowRight,
  Shield,
  CreditCard,
  Headphones,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const footerLinks = {
  browse: [
    { label: "New Cars", href: "/cars?condition=NEW" },
    { label: "Used Cars", href: "/cars?condition=USED" },
    { label: "Certified Pre-Owned", href: "/cars?condition=CERTIFIED_PRE_OWNED" },
    { label: "Electric Vehicles", href: "/cars?fuelType=ELECTRIC" },
    { label: "SUVs", href: "/cars?bodyType=SUV" },
  ],
  sell: [
    { label: "Sell Your Car", href: "/sell" },
    { label: "Car Valuation", href: "/valuation" },
    { label: "Dealer Portal", href: "/dealer" },
    { label: "Promote Listing", href: "/promote" },
  ],
  company: [
    { label: "About AutoCar", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "FAQ", href: "/faq" },
  ],
}

const trustFeatures = [
  { icon: Shield, label: "Verified Listings", desc: "Every car checked" },
  { icon: CreditCard, label: "Secure Payment", desc: "Safe transactions" },
  { icon: Headphones, label: "24/7 Support", desc: "Always here for you" },
  { icon: Truck, label: "Delivery Service", desc: "Door-to-door" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      {/* Trust Features */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature) => (
              <div key={feature.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{feature.label}</p>
                  <p className="text-xs text-slate-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3" aria-label="AutoCar Home">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white font-heading tracking-widest">
                  AUTO
                </span>
                <span className="text-xl font-bold text-blue-400 font-heading tracking-widest">
                  CAR
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Indonesia&apos;s leading automotive marketplace. Buy and sell new &amp; used
              cars with confidence. Video listings, verified sellers, and secure transactions.
            </p>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 font-heading tracking-wide">
                GET THE LATEST DEALS
              </h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                    aria-label="Email for newsletter"
                  />
                </div>
                <button
                  type="submit"
                  className={cn(
                    "h-10 px-4 rounded-xl flex items-center justify-center transition-all duration-200",
                    subscribed
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  )}
                  aria-label="Subscribe to newsletter"
                >
                  {subscribed ? (
                    <span className="text-sm font-medium">Subscribed!</span>
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, href: "#", label: "Instagram" },
                { icon: Globe, href: "#", label: "Facebook" },
                { icon: Globe, href: "#", label: "Twitter" },
                { icon: Globe, href: "#", label: "YouTube" },
                { icon: MessageCircle, href: "https://wa.me/6281234567890", label: "WhatsApp" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-bold text-white mb-4 font-heading tracking-wide">
                BROWSE
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.browse.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4 font-heading tracking-wide">
                SELL
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.sell.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4 font-heading tracking-wide">
                COMPANY
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4 font-heading tracking-wide">
                SUPPORT
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} AutoCar. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
