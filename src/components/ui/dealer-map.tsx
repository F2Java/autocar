"use client"

import { useEffect, useState } from "react"

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

interface DealerMapProps {
  dealers: Dealer[]
  selectedDealer?: Dealer | null
  onDealerSelect?: (dealer: Dealer) => void
}

export function DealerMap({ dealers, selectedDealer, onDealerSelect }: DealerMapProps) {
  const [MapClient, setMapClient] = useState<typeof import("./dealer-map-client").DealerMapClient | null>(null)

  useEffect(() => {
    import("./dealer-map-client").then((mod) => {
      setMapClient(() => mod.DealerMapClient)
    })
  }, [])

  if (!MapClient) {
    return (
      <div className="w-full h-[400px] bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading map...</div>
      </div>
    )
  }

  return <MapClient dealers={dealers} selectedDealer={selectedDealer} onDealerSelect={onDealerSelect} />
}
