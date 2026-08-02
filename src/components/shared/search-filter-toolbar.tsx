"use client"

import { useState } from "react"
import { Search, X, SlidersHorizontal, ArrowUpDown, RotateCw, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FilterGroup } from "@/hooks/use-search-filter"

interface SearchFilterToolbarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  onClearSearch: () => void
  activeFilters: Record<string, string[]>
  filterGroups: FilterGroup[]
  onToggleFilter: (group: string, value: string) => void
  onClearAllFilters: () => void
  totalItems: number
  filteredCount: number
  onRefresh?: () => void
  className?: string
  placeholder?: string
}

export function SearchFilterToolbar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  activeFilters,
  filterGroups,
  onToggleFilter,
  onClearAllFilters,
  totalItems,
  filteredCount,
  onRefresh,
  className,
  placeholder = "Search records...",
}: SearchFilterToolbarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"asc" | "desc">("asc")

  const totalActiveFilters = Object.values(activeFilters).reduce((sum, v) => sum + v.length, 0)

  return (
    <div className={cn("search-toolbar flex flex-col gap-2", className)}>
      {/* Main row: search + actions */}
      <div className="search-toolbar-row flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="search-input-wrapper relative flex-1">
          <Search className="search-input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="search-input pl-9 pr-8"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="search-clear-btn absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          {/* Filter toggle */}
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="search-filter-toggle gap-1.5 text-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {totalActiveFilters > 0 && (
              <span className="filter-count-badge ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {totalActiveFilters}
              </span>
            )}
          </Button>

          {/* Sort toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === "asc" ? "desc" : "asc")}
            className="gap-1.5 text-xs"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortBy === "asc" ? "A→Z" : "Z→A"}
          </Button>

          {/* Refresh */}
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} className="gap-1.5 text-xs">
              <RotateCw className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Item count */}
          <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
            <span className="font-medium text-foreground">{filteredCount}</span>
            <span>/</span>
            <span>{totalItems}</span>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {totalActiveFilters > 0 && (
        <div className="filter-chips-row flex flex-wrap items-center gap-1.5">
          {Object.entries(activeFilters).map(([group, values]) =>
            values.map((value) => (
              <Badge
                key={`${group}-${value}`}
                variant="secondary"
                className="filter-chip-active badge-interactive cursor-pointer gap-1 text-xs"
                onClick={() => onToggleFilter(group, value)}
              >
                {value}
                <X className="h-2.5 w-2.5" />
              </Badge>
            ))
          )}
          <button
            onClick={onClearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter panel (expandable) */}
      {showFilters && filterGroups.length > 0 && (
        <div className="filter-panel border rounded-lg bg-card/50 p-3">
          <div className="filter-groups grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filterGroups.slice(0, 6).map((group) => (
              <div key={group.key} className="filter-group">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{group.label}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="flex max-h-28 flex-wrap gap-1 overflow-y-auto">
                  {group.options.map((opt) => {
                    const isActive = (activeFilters[group.key] || []).includes(opt.value)
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onToggleFilter(group.key, opt.value)}
                        className={cn(
                          "filter-chip rounded-md border px-2 py-0.5 text-[11px] transition-all",
                          isActive
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                        )}
                      >
                        {opt.value}
                        <span className="ml-1 text-[10px] opacity-50">({opt.count})</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default SearchFilterToolbar
