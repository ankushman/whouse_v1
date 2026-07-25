"use client"

import { useState, useMemo, useCallback } from "react"
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table"

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  className?: string
  headerClassName?: string
  render?: (value: any, row: T, index: number) => React.ReactNode
  visible?: boolean
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

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  emptyMessage = "No data available",
  onRowClick,
  className,
  stickyHeader = true,
  showCount = true,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible !== false),
    [columns]
  )

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data

    return [...data].sort((a, b) => {
      const col = columns.find((c) => c.key === sortColumn)
      // Use the raw value from the row for comparison
      let aVal: any = a[sortColumn]
      let bVal: any = b[sortColumn]

      // If there's a custom renderer but no direct numeric/string value, try to compare anyway
      return compareValues(aVal, bVal, sortDirection)
    })
  }, [data, sortColumn, sortDirection, columns])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))

  // Reset page when data length changes
  const safeCurrentPage = Math.min(currentPage, totalPages)
  if (safeCurrentPage !== currentPage) {
    setCurrentPage(safeCurrentPage)
  }

  const paginatedData = useMemo(
    () =>
      sortedData.slice(
        (safeCurrentPage - 1) * pageSize,
        safeCurrentPage * pageSize
      ),
    [sortedData, safeCurrentPage, pageSize]
  )

  const handleSort = useCallback(
    (key: string) => {
      setSortColumn((prev) => {
        if (prev !== key) {
          setSortDirection("asc")
          return key
        }
        setSortDirection((dir) => {
          if (dir === "asc") return "desc"
          if (dir === "desc") return null
          return "asc"
        })
        return key
      })
    },
    []
  )

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page))
  }, [])

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {showCount && (
        <div className="text-xs text-muted-foreground">
          {data.length} {data.length === 1 ? "result" : "results"}
        </div>
      )}

      <div className="rounded-xl border bg-card table-row-hover table-stripe">
        <Table>
          <TableHeader>
            <TableRow
              className={cn(
                "bg-muted/40",
                stickyHeader && "sticky top-0 z-10"
              )}
            >
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
                  colSpan={visibleColumns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => {
                // Use the original index in the sorted array for the render callback
                const originalIndex =
                  (safeCurrentPage - 1) * pageSize + rowIndex
                return (
                  <TableRow
                    key={originalIndex}
                    className={cn(
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
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
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

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
    </div>
  )
}
