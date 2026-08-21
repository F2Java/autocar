"use client"

import { CompareProvider } from "@/lib/compare-context"
import { FavoritesProvider } from "@/lib/favorites-context"
import { CompareBar } from "@/components/ui/compare-bar"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <CompareProvider>
        {children}
        <CompareBar />
      </CompareProvider>
    </FavoritesProvider>
  )
}
