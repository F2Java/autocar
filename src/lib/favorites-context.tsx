"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"

interface FavoriteCar {
  id: string
  slug: string
  title: string
  make: string
  model: string
  year: number
  condition: string
  price: number
  city: string
  coverImage: string
  videoUrl?: string
}

interface FavoritesContextType {
  favorites: FavoriteCar[]
  addFavorite: (car: FavoriteCar) => void
  removeFavorite: (id: string) => void
  toggleFavorite: (car: FavoriteCar) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = "pasarmobilbekas_favorites"

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteCar[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch {
      // Ignore parse errors
    }
    setLoaded(true)
  }, [])

  // Save to localStorage when favorites change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }
  }, [favorites, loaded])

  const addFavorite = useCallback((car: FavoriteCar) => {
    setFavorites((prev) => {
      if (prev.find((c) => c.id === car.id)) return prev
      return [...prev, car]
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const toggleFavorite = useCallback((car: FavoriteCar) => {
    setFavorites((prev) => {
      if (prev.find((c) => c.id === car.id)) {
        return prev.filter((c) => c.id !== car.id)
      }
      return [...prev, car]
    })
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.some((c) => c.id === id),
    [favorites]
  )

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider")
  return context
}
