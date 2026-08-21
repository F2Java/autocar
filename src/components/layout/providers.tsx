"use client"

import { CompareProvider } from "@/lib/compare-context"
import { CompareBar } from "@/components/ui/compare-bar"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      {children}
      <CompareBar />
    </CompareProvider>
  )
}
