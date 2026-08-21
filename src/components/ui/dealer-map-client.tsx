"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Phone, MessageCircle, Star, Navigation, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Dealer {
  id: string
  name: string
  address: string
  city: string
  province: string
  phone: string
  whatsapp: string
  rating: number
  lat: number
  lng: number
}

interface DealerMapClientProps {
  dealers: Dealer[]
  selectedDealer?: Dealer | null
  onDealerSelect?: (dealer: Dealer) => void
}

// Custom red marker icon
const createMarkerIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: ${isSelected ? '40px' : '32px'};
      height: ${isSelected ? '40px' : '32px'};
      background: ${isSelected ? '#D4AF37' : '#DC2626'};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    ">
      <div style="
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>`,
    iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
    iconAnchor: [isSelected ? 20 : 16, isSelected ? 40 : 32],
    popupAnchor: [0, -32],
  })
}

export function DealerMapClient({ dealers, selectedDealer, onDealerSelect }: DealerMapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const [hoveredDealer, setHoveredDealer] = useState<Dealer | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map centered on Indonesia
    const map = L.map(mapRef.current, {
      center: [-7.7956, 110.3695], // Yogyakarta center
      zoom: 5,
      zoomControl: false,
    })

    // Add dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Add zoom control to top-right
    L.control.zoom({ position: "topright" }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Add markers when dealers change
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()

    dealers.forEach((dealer) => {
      const icon = createMarkerIcon(selectedDealer?.id === dealer.id)
      const marker = L.marker([dealer.lat, dealer.lng], { icon })
        .addTo(map)

      // Popup content
      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui;">
          <h3 style="font-weight: 600; font-size: 14px; margin: 0 0 8px 0;">${dealer.name}</h3>
          <p style="color: #666; font-size: 12px; margin: 0 0 4px 0;">${dealer.address}, ${dealer.city}</p>
          <div style="display: flex; align-items: center; gap: 4px; margin: 0 0 8px 0;">
            <span style="color: #D4AF37;">★</span>
            <span style="font-size: 12px; font-weight: 500;">${dealer.rating}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="tel:${dealer.phone}" style="
              display: inline-flex; align-items: center; gap: 4px;
              padding: 6px 12px; background: #DC2626; color: white;
              border-radius: 6px; font-size: 12px; text-decoration: none;
            ">Call</a>
            <a href="https://wa.me/${dealer.whatsapp}" target="_blank" style="
              display: inline-flex; align-items: center; gap: 4px;
              padding: 6px 12px; background: #25D366; color: white;
              border-radius: 6px; font-size: 12px; text-decoration: none;
            ">WhatsApp</a>
          </div>
        </div>
      `

      marker.bindPopup(popupContent)

      marker.on("click", () => {
        onDealerSelect?.(dealer)
      })

      markersRef.current.set(dealer.id, marker)
    })

    // Fit bounds to show all dealers
    if (dealers.length > 0) {
      const bounds = L.latLngBounds(dealers.map((d) => [d.lat, d.lng]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 })
    }
  }, [dealers, selectedDealer, onDealerSelect])

  // Pan to selected dealer
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedDealer) return

    map.flyTo([selectedDealer.lat, selectedDealer.lng], 14, { duration: 1 })

    const marker = markersRef.current.get(selectedDealer.id)
    if (marker) {
      marker.openPopup()
    }
  }, [selectedDealer])

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-neutral-800">
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-neutral-900/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-400 z-[1000]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600" />
          <span>Dealer Location</span>
        </div>
      </div>
    </div>
  )
}
