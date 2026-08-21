"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface CompareCar {
  id: string
  slug: string
  title: string
  make: string
  model: string
  year: number
  condition: string
  price: number
  mileage: number
  fuelType: string
  transmission: string
  bodyType: string
  horsepower: number
  city: string
  coverImage: string
  features: string[]
}

interface CompareContextType {
  compareList: CompareCar[]
  addToCompare: (car: CompareCar) => void
  removeFromCompare: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<CompareCar[]>([])
  const maxCompare = 4

  const addToCompare = useCallback((car: CompareCar) => {
    setCompareList((prev) => {
      if (prev.find((c) => c.id === car.id)) return prev
      if (prev.length >= maxCompare) return prev
      return [...prev, car]
    })
  }, [])

  const removeFromCompare = useCallback((id: string) => {
    setCompareList((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const clearCompare = useCallback(() => {
    setCompareList([])
  }, [])

  const isInCompare = useCallback(
    (id: string) => compareList.some((c) => c.id === id),
    [compareList]
  )

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) throw new Error("useCompare must be used within CompareProvider")
  return context
}
