"use client"

import { useState, useMemo, useCallback } from "react"

export interface FilterGroup {
  key: string
  label: string
  options: { value: string; count: number }[]
}

export interface UseSearchFilterOptions<T> {
  items: T[]
  searchFields: string[]
  filterFields?: string[]
}

export interface UseSearchFilterReturn<T> {
  searchQuery: string
  setSearchQuery: (q: string) => void
  activeFilters: Record<string, string[]>
  setActiveFilters: (f: Record<string, string[]>) => void
  filteredItems: T[]
  filterGroupsWithCounts: FilterGroup[]
  clearAllFilters: () => void
  clearSearch: () => void
  toggleFilter: (group: string, value: string) => void
  totalItems: number
  filteredCount: number
}

export function useSearchFilter<T extends { [key: string]: any }>(
  options: UseSearchFilterOptions<T>
): UseSearchFilterReturn<T> {
  const { items, searchFields, filterFields } = options
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  // Build filter groups with counts from current items
  const filterGroupsWithCounts = useMemo(() => {
    const groups: FilterGroup[] = []
    const fields = filterFields || searchFields.slice(0, 3)
    for (const field of fields) {
      const counts: Record<string, number> = {}
      for (const item of items) {
        const val = String(item[field] ?? "")
        if (val) counts[val] = (counts[val] || 0) + 1
      }
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
      groups.push({
        key: field,
        label: field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
        options: sorted.map(([value, count]) => ({ value, count })),
      })
    }
    return groups
  }, [items, filterFields, searchFields])

  const filteredItems = useMemo(() => {
    let result = items
    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item) =>
        searchFields.some((f) => String(item[f] ?? "").toLowerCase().includes(q))
      )
    }
    // Filter groups
    for (const [key, values] of Object.entries(activeFilters)) {
      if (values.length > 0) {
        result = result.filter((item) => values.includes(String(item[key])))
      }
    }
    return result
  }, [items, searchQuery, searchFields, activeFilters])

  const toggleFilter = useCallback((group: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[group] || []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      if (next.length === 0) {
        const { [group]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [group]: next }
    })
  }, [])

  const clearAllFilters = useCallback(() => setActiveFilters({}), [])
  const clearSearch = useCallback(() => setSearchQuery(""), [])

  return {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    filteredItems,
    filterGroupsWithCounts,
    clearAllFilters,
    clearSearch,
    toggleFilter,
    totalItems: items.length,
    filteredCount: filteredItems.length,
  }
}
