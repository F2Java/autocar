"use client"

import { useState } from "react"
import { X, ChevronDown, ChevronUp, RotateCcw } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface FilterOptions {
  makes: string[]
  models: Record<string, string[]>
  bodyTypes: string[]
  fuelTypes: string[]
  transmissions: string[]
  conditions: string[]
}

interface FilterState {
  search: string
  make: string
  model: string
  yearMin: string
  yearMax: string
  priceMin: string
  priceMax: string
  condition: string
  fuelType: string
  transmission: string
  bodyType: string
  city: string
  sortBy: string
}

interface FilterPanelProps {
  options: FilterOptions
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  onReset: () => void
  isOpen: boolean
  onClose: () => void
  resultCount?: number
}

export function FilterPanel({
  options,
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onClose,
  resultCount,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    make: true,
    price: true,
    condition: true,
    specs: false,
    location: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <div
        className={cn(
          "fixed lg:relative inset-y-0 right-0 lg:inset-auto z-50 lg:z-auto",
          "w-full sm:w-80 lg:w-72 bg-slate-900 lg:bg-transparent",
          "border-l border-slate-800 lg:border-0",
          "overflow-y-auto lg:overflow-visible",
          "transition-transform duration-300 lg:transition-none",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          "lg:block",
          !isOpen && "hidden lg:block"
        )}
      >
        <div className="p-4 lg:p-0 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between lg:mb-4">
            <h3 className="text-lg font-bold text-white font-heading tracking-wide">
              Filters
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                aria-label="Reset all filters"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1 text-slate-400 hover:text-white"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Result Count */}
          {resultCount !== undefined && (
            <p className="text-sm text-slate-400">
              <span className="text-white font-medium">{resultCount}</span> cars found
            </p>
          )}

          {/* Condition */}
          <FilterSection
            title="Condition"
            expanded={expandedSections.condition}
            onToggle={() => toggleSection("condition")}
          >
            <div className="flex flex-wrap gap-2">
              {["NEW", "USED", "CERTIFIED_PRE_OWNED"].map((cond) => (
                <button
                  key={cond}
                  onClick={() =>
                    onFilterChange({
                      condition: filters.condition === cond ? "" : cond,
                    })
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    filters.condition === cond
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  )}
                >
                  {cond === "CERTIFIED_PRE_OWNED" ? "CPO" : cond}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Make & Model */}
          <FilterSection
            title="Make & Model"
            expanded={expandedSections.make}
            onToggle={() => toggleSection("make")}
          >
            <div className="space-y-3">
              <SelectFilter
                label="Make"
                value={filters.make}
                options={options.makes}
                onChange={(val) => onFilterChange({ make: val, model: "" })}
                placeholder="All Makes"
              />
              {filters.make && options.models[filters.make] && (
                <SelectFilter
                  label="Model"
                  value={filters.model}
                  options={options.models[filters.make]}
                  onChange={(val) => onFilterChange({ model: val })}
                  placeholder="All Models"
                />
              )}
            </div>
          </FilterSection>

          {/* Year */}
          <FilterSection
            title="Year"
            expanded={expandedSections.specs}
            onToggle={() => toggleSection("specs")}
          >
            <div className="grid grid-cols-2 gap-2">
              <SelectFilter
                label="From"
                value={filters.yearMin}
                options={years.map(String)}
                onChange={(val) => onFilterChange({ yearMin: val })}
                placeholder="Any"
              />
              <SelectFilter
                label="To"
                value={filters.yearMax}
                options={years.map(String)}
                onChange={(val) => onFilterChange({ yearMax: val })}
                placeholder="Any"
              />
            </div>
          </FilterSection>

          {/* Price */}
          <FilterSection
            title="Price"
            expanded={expandedSections.price}
            onToggle={() => toggleSection("price")}
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Min</label>
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => onFilterChange({ priceMin: e.target.value })}
                  placeholder="0"
                  className="w-full h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  aria-label="Minimum price"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Max</label>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => onFilterChange({ priceMax: e.target.value })}
                  placeholder="No limit"
                  className="w-full h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  aria-label="Maximum price"
                />
              </div>
            </div>
            {/* Quick Price Ranges */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { label: "< 200jt", min: "0", max: "200000000" },
                { label: "200-500jt", min: "200000000", max: "500000000" },
                { label: "500jt-1M", min: "500000000", max: "1000000000" },
                { label: "> 1M", min: "1000000000", max: "" },
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() =>
                    onFilterChange({
                      priceMin: range.min,
                      priceMax: range.max,
                    })
                  }
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium transition-colors",
                    filters.priceMin === range.min && filters.priceMax === range.max
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Fuel Type */}
          <FilterSection
            title="Fuel Type"
            expanded={expandedSections.specs}
            onToggle={() => toggleSection("specs")}
          >
            <div className="flex flex-wrap gap-2">
              {options.fuelTypes.map((fuel) => (
                <button
                  key={fuel}
                  onClick={() =>
                    onFilterChange({
                      fuelType: filters.fuelType === fuel ? "" : fuel,
                    })
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all duration-200",
                    filters.fuelType === fuel
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  )}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Transmission */}
          <FilterSection
            title="Transmission"
            expanded={expandedSections.specs}
            onToggle={() => toggleSection("specs")}
          >
            <div className="flex flex-wrap gap-2">
              {options.transmissions.map((trans) => (
                <button
                  key={trans}
                  onClick={() =>
                    onFilterChange({
                      transmission: filters.transmission === trans ? "" : trans,
                    })
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all duration-200",
                    filters.transmission === trans
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  )}
                >
                  {trans}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              aria-label="Sort cars by"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="mileage_asc">Mileage: Low to High</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Apply Button (Mobile) */}
          <Button
            onClick={onClose}
            className="w-full lg:hidden bg-blue-600 hover:bg-blue-500"
          >
            Show {resultCount || 0} Results
          </Button>
        </div>
      </div>
    </>
  )
}

function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-slate-800 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={expanded}
      >
        <span className="text-sm font-medium text-white">{title}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {expanded && <div className="mt-3">{children}</div>}
    </div>
  )
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  options: string[]
  onChange: (val: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
        aria-label={`Filter by ${label}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
