"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Car,
  Search,
  Menu,
  X,
  Phone,
  MessageCircle,
  User,
  Heart,
  PlusCircle,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Browse Cars" },
  { href: "/sell", label: "Sell Car" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="AutoCar Home"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center transition-transform group-hover:scale-105">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-white font-heading tracking-widest">
                AUTO
              </span>
              <span className="text-xl font-bold text-blue-400 font-heading tracking-widest">
                CAR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/search"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              aria-label="Search cars"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/favorites"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
              aria-label="Contact via WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <Link
              href="/sell"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors glow-blue"
            >
              <PlusCircle className="h-4 w-4" />
              Sell Car
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-slate-300 hover:bg-slate-800"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-800 pt-3 mt-3 space-y-2">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
            <Link
              href="/sell"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium"
            >
              <PlusCircle className="h-4 w-4" />
              Sell Your Car
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
