"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X, SlidersHorizontal, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onFilterClick?: () => void
  showFilter?: boolean
  className?: string
  autoFocus?: boolean
  loading?: boolean
}

export function SearchBar({
  placeholder = "Search cars by make, model, or keyword...",
  value: controlledValue,
  onChange,
  onSearch,
  onFilterClick,
  showFilter = true,
  className,
  autoFocus,
  loading,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || "")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(value)
  }

  const handleClear = () => {
    handleChange("")
    onChange?.("")
    onSearch?.("")
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center gap-2",
        className
      )}
    >
      <div
        className={cn(
          "relative flex-1 flex items-center rounded-xl transition-all duration-300",
          "bg-slate-900/80 backdrop-blur-md border",
          isFocused
            ? "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            : "border-slate-700/50 hover:border-slate-600/50"
        )}
      >
        <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 pl-12 pr-12 bg-transparent text-white placeholder:text-slate-500",
            "text-sm font-body focus:outline-none"
          )}
          aria-label="Search cars"
        />
        {loading ? (
          <Loader2 className="absolute right-4 h-5 w-5 text-blue-400 animate-spin" />
        ) : value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 h-5 w-5 text-slate-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      {showFilter && onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className={cn(
            "h-12 px-4 rounded-xl flex items-center gap-2 transition-all duration-200",
            "bg-slate-800 border border-slate-700/50 text-slate-300",
            "hover:bg-slate-700 hover:border-slate-600 hover:text-white",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          )}
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline text-sm font-medium">Filters</span>
        </button>
      )}
    </form>
  )
}
