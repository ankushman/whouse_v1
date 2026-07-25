"use client"

import React, { useState, useReducer, useMemo, useCallback, useEffect, useRef } from "react"
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Columns3,
  CheckSquare,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  className?: string
  headerClassName?: string
  render?: (value: any, row: T, index: number) => React.ReactNode
  visible?: boolean
}

export interface BatchAction<T> {
  label: string
  icon?: LucideIcon
  onClick: (selectedRows: T[]) => void
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  emptyMessage?: string
  onRowClick?: (row: T) => void
  className?: string
  stickyHeader?: boolean
  showCount?: boolean
  /** Placeholder text for the search input */
  searchPlaceholder?: string
  /** Column keys to search against. When provided, a search input is shown. */
  searchableColumns?: string[]
  /** Enable row selection with checkboxes */
  selectable?: boolean
  /** Called when selection changes with the full array of selected rows */
  onSelectionChange?: (selectedRows: T[]) => void
  /** Batch actions to show in the toolbar when rows are selected */
  batchActions?: BatchAction<T>[]
  /** Show column visibility toggle dropdown. Defaults to true when >4 columns. */
  showColumnToggle?: boolean
  /** Render expandable content below a row. When provided, a chevron toggle column is added. */
  expandableRowRender?: (row: T) => React.ReactNode
  /** Unique key extractor for expanded rows. Defaults to row.id or index. */
  getRowKey?: (row: T) => string
}

type SortDirection = "asc" | "desc" | null

function compareValues(a: any, b: any, direction: "asc" | "desc"): number {
  const multiplier = direction === "asc" ? 1 : -1

  if (a == null && b == null) return 0
  if (a == null) return 1 * multiplier
  if (b == null) return -1 * multiplier

  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b, undefined, { sensitivity: "base" }) * multiplier
  }

  if (a < b) return -1 * multiplier
  if (a > b) return 1 * multiplier
  return 0
}

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc") return <ArrowUp className="inline-block h-3 w-3" />
  if (direction === "desc") return <ArrowDown className="inline-block h-3 w-3" />
  return <ArrowUpDown className="inline-block h-3 w-3 opacity-40" />
}

/**
 * A stable identity helper – returns the row's `id` if present,
 * otherwise a composite of the first scalar key, falling back to numeric index.
 */
function getRowId<T extends Record<string, any>>(row: T, fallbackIndex: number): string {
  if (row.id != null) return String(row.id)
  const keys = Object.keys(row)
  for (const k of keys) {
    if (typeof row[k] === "string" || typeof row[k] === "number") {
      return `${k}:${row[k]}`
    }
  }
  return `__idx:${fallbackIndex}`
}

// Static keyframes string — avoids re-creating template literal on every render
const TABLE_ROW_KEYFRAMES = `@keyframes tableRowIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  emptyMessage = "No data available",
  onRowClick,
  className,
  stickyHeader = true,
  showCount = true,
  searchPlaceholder,
  searchableColumns,
  selectable = false,
  onSelectionChange,
  batchActions,
  showColumnToggle,
  expandableRowRender,
  getRowKey,
}: DataTableProps<T>) {
  // Clamp pageSize to ≥1 to prevent Infinity pages
  const safePageSize = Math.max(1, pageSize)
  // Stabilize onSelectionChange callback to prevent unnecessary effect fires
  const onSelectionChangeRef = useRef(onSelectionChange)
  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange
  })
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<string>>(new Set())
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  // Sort state as a single reducer to avoid nested setState anti-pattern
  const [sortState, sortDispatch] = useReducer(
    (prev: { column: string | null; direction: SortDirection }, action: { key: string }) => {
      if (prev.column !== action.key) return { column: action.key, direction: "asc" }
      if (prev.direction === "asc") return { column: action.key, direction: "desc" }
      if (prev.direction === "desc") return { column: null, direction: null }
      return { column: action.key, direction: "asc" }
    },
    { column: null, direction: null as SortDirection }
  )
  // Derived sort values from reducer for backward compatibility
  sortColumn = sortState.column
  sortDirection = sortState.direction
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set())
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<Set<string>>(new Set())
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map())

  // --- Search filtering ---
  const hasSearch = !!(searchableColumns && searchableColumns.length > 0)

  const filteredData = useMemo(() => {
    if (!hasSearch || !searchQuery.trim()) return data
    const lower = searchQuery.toLowerCase().trim()
    return data.filter((row) =>
      (searchableColumns as string[]).some((key) => {
        const val = row[key]
        if (val == null) return false
        return String(val).toLowerCase().includes(lower)
      })
    )
  }, [data, hasSearch, searchQuery, searchableColumns])

  // --- Sorting (operates on filtered data) ---
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData

    return [...filteredData].sort((a, b) => {
      let aVal: any = a[sortColumn]
      let bVal: any = b[sortColumn]
      return compareValues(aVal, bVal, sortDirection)
    })
  }, [filteredData, sortColumn, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / safePageSize))

  // Clamp current page within valid range (derived state, no setState needed)
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedData = useMemo(
    () =>
      sortedData.slice(
        (safeCurrentPage - 1) * safePageSize,
        safeCurrentPage * safePageSize
      ),
    [sortedData, safeCurrentPage, safePageSize]
  )

  // --- Column visibility (user toggle) ---
  const shouldShowColumnToggle = showColumnToggle ?? columns.length > 4

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible !== false && !hiddenColumnKeys.has(col.key)),
    [columns, hiddenColumnKeys]
  )

  // --- Selection ---
  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row, i) =>
      selectedRowIds.has(getRowId(row, (safeCurrentPage - 1) * safePageSize + i))
    )

  const isSomeSelected =
    !isAllSelected &&
    paginatedData.some((row, i) =>
      selectedRowIds.has(getRowId(row, (safeCurrentPage - 1) * safePageSize + i))
    )

  const selectedRows = useMemo(() => {
    if (selectedRowIds.size === 0) return []
    return sortedData.filter((row, i) => selectedRowIds.has(getRowId(row, i)))
  }, [selectedRowIds, sortedData])

  // Fire onSelectionChange when selection changes (stabilized via ref)
  useEffect(() => {
    onSelectionChangeRef.current?.(selectedRows)
  }, [selectedRows])

  const toggleRow = useCallback((rowId: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev)
      if (isAllSelected) {
        paginatedData.forEach((row, i) => {
          next.delete(getRowId(row, (safeCurrentPage - 1) * safePageSize + i))
        })
      } else {
        paginatedData.forEach((row, i) => {
          next.add(getRowId(row, (safeCurrentPage - 1) * safePageSize + i))
        })
      }
      return next
    })
  }, [isAllSelected, paginatedData, safeCurrentPage, safePageSize])

  const clearSelection = useCallback(() => {
    setSelectedRowIds(new Set())
  }, [])

  // --- Expandable rows ---
  const hasExpandableRows = !!expandableRowRender
  const toggleExpand = useCallback((key: string) => {
    setExpandedRowKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  // --- Row enter animation via IntersectionObserver ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("data-row-enter")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    rowRefs.current.forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [paginatedData])

  const setRowRef = useCallback(
    (id: string) => (el: HTMLTableRowElement | null) => {
      if (el) {
        rowRefs.current.set(id, el)
      } else {
        rowRefs.current.delete(id)
      }
    },
    []
  )

  // --- Sort handler ---
  const handleSort = useCallback((key: string) => {
    setSortColumn((prevCol) => {
      setSortDirection((prevDir) => {
        if (prevCol !== key) return "asc"
        if (prevDir === "asc") return "desc"
        if (prevDir === "desc") return null
        return "asc"
      })
      return key
    })
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page))
  }, [])

  // Reset to page 1 when search query changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  // --- Determine if we need a toolbar row ---
  const hasToolbar = hasSearch || shouldShowColumnToggle || selectable
  const colSpan = visibleColumns.length + (selectable ? 1 : 0) + (hasExpandableRows ? 1 : 0)

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Batch action toolbar – shown when rows are selected */}
      {selectable && selectedRows.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-primary/5 px-4 py-2.5 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckSquare className="h-4 w-4 text-primary" />
          <span className="font-medium text-primary">
            {selectedRows.length} selected
          </span>
          {batchActions && batchActions.length > 0 && (
            <>
              <span className="mx-1 text-muted-foreground/40">|</span>
              <div className="flex items-center gap-1">
                {batchActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={action.label}
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1.5 text-xs"
                      onClick={() => action.onClick(selectedRows)}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 text-xs text-muted-foreground"
            onClick={clearSelection}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Top bar: count, search, column toggle */}
      {(showCount || hasToolbar) && (
        <div className="flex items-center gap-3 flex-wrap">
          {showCount && (
            <div className="text-xs text-muted-foreground">
              {hasSearch && searchQuery.trim()
                ? `${filteredData.length} of ${data.length} ${data.length === 1 ? "result" : "results"}`
                : `${data.length} ${data.length === 1 ? "result" : "results"}`}
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Search input */}
            {hasSearch && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder ?? "Search..."}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-8 w-56 pl-8 text-xs shadow-inner-soft focus-ring-primary"
                />
              </div>
            )}

            {/* Column visibility toggle */}
            {shouldShowColumnToggle && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <Columns3 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Columns</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-xs">Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columns.map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={!hiddenColumnKeys.has(col.key) && col.visible !== false}
                      onCheckedChange={(checked) => {
                        setHiddenColumnKeys((prev) => {
                          const next = new Set(prev)
                          if (checked) {
                            next.delete(col.key)
                          } else {
                            // Prevent hiding the last visible column
                            const visibleCount = columns.filter(
                              (c) => c.visible !== false && !next.has(c.key) && c.key !== col.key
                            ).length
                            if (visibleCount === 0) return prev
                            next.add(col.key)
                          }
                          return next
                        })
                      }}
                      className="text-xs"
                    >
                      {col.header}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border bg-card table-row-hover table-stripe scrollbar-thin card-lift">
        <Table>
          <TableHeader className="table-header-sticky-glass">
            <TableRow
              className={cn(
                "bg-muted/40",
                stickyHeader && "sticky top-0 z-10"
              )}
            >
              {hasExpandableRows && (
                <TableHead className="w-9 p-1">
                  <span className="sr-only">Expand</span>
                </TableHead>
              )}
              {selectable && (
                <TableHead className="w-10 p-2">
                  <Checkbox
                    checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {visibleColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "text-xs font-medium uppercase tracking-wide text-muted-foreground",
                    col.className,
                    col.headerClassName,
                    col.sortable && "cursor-pointer select-none hover:text-foreground"
                  )}
                  onClick={
                    col.sortable ? () => handleSort(col.key) : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <SortIcon
                        direction={
                          sortColumn === col.key ? sortDirection : null
                        }
                      />
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const originalIndex =
                  (safeCurrentPage - 1) * safePageSize + rowIndex
                const rowId = getRowId(row, originalIndex)
                const isSelected = selectedRowIds.has(rowId)

                const expandKey = getRowKey ? getRowKey(row) : rowId
                const isExpanded = hasExpandableRows && expandedRowKeys.has(expandKey)

                return (
                  <React.Fragment key={rowId}>
                  <TableRow
                    ref={setRowRef(rowId)}
                    data-row-id={rowId}
                    className={cn(
                      onRowClick && "cursor-pointer",
                      isExpanded && "bg-muted/20",
                      isSelected && "bg-primary/5"
                    )}
                    style={{
                      animation: "tableRowIn 0.3s ease-out both",
                      animationDelay: `${rowIndex * 30}ms`,
                    }}
                    onClick={
                      hasExpandableRows
                        ? () => toggleExpand(expandKey)
                        : onRowClick
                          ? () => onRowClick(row)
                          : undefined
                    }
                  >
                    {hasExpandableRows && (
                      <TableCell className="w-9 p-1">
                        <button
                          className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted transition-colors"
                          onClick={(e) => { e.stopPropagation(); toggleExpand(expandKey) }}
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          <ChevronRight className={cn(
                            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )} />
                        </button>
                      </TableCell>
                    )}
                    {selectable && (
                      <TableCell className="w-10 p-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRow(rowId)}
                          aria-label={`Select row ${rowIndex + 1}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn("text-sm", col.className)}
                      >
                        {col.render
                          ? col.render(row[col.key], row, originalIndex)
                          : (row[col.key] as React.ReactNode) ?? "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                  {isExpanded && expandableRowRender && (
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableCell colSpan={colSpan} className="p-4">
                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                          {expandableRowRender(row)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  </React.Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Page {safeCurrentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors btn-press"
              disabled={safeCurrentPage <= 1}
              onClick={() => handlePageChange(safeCurrentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors btn-press"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => handlePageChange(safeCurrentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Row enter animation keyframes — static constant */}
      <style dangerouslySetInnerHTML={{
        __html: TABLE_ROW_KEYFRAMES
      }} suppressHydrationWarning />
    </div>
  )
}
