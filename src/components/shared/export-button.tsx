"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { toast as sonnerToast } from "sonner"
import { cn } from "@/lib/utils"

interface ExportButtonProps {
  /** CSV export callback (callback mode) */
  onExportCSV?: () => void
  /** PDF export callback (callback mode) */
  onExportPDF?: () => void
  /** Optional label shown on the trigger button (default: "Export") */
  label?: string
  /** Optional data array — when provided, CSV export is auto-wired via exportToCSV */
  data?: ReadonlyArray<Record<string, unknown>> | unknown[]
  /** Filename (without extension) used when `data` is provided */
  filename?: string
  className?: string
}

export function ExportButton({
  onExportCSV,
  onExportPDF,
  label = "Export",
  data,
  filename = "export",
  className,
}: ExportButtonProps) {
  const handleCSV = onExportCSV ?? (() => exportToCSV((data as Record<string, unknown>[]) ?? [], filename))
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", className)}>
          <Download className="h-3.5 w-3.5" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(onExportCSV || data) && (
          <DropdownMenuItem className="text-xs gap-2 cursor-pointer" onClick={handleCSV}>
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Export CSV
          </DropdownMenuItem>
        )}
        {onExportPDF && (
          <DropdownMenuItem className="text-xs gap-2 cursor-pointer" onClick={onExportPDF}>
            <FileText className="h-4 w-4 text-red-600" />
            Export PDF
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// CSV export utility function
// Note: This is a module-level helper (not a hook), so we use sonner directly.
// The useToast hook is for components; exportToCSV is called from non-component contexts too.
export function exportToCSV(data: Record<string, any>[], filename: string, columns?: string[]) {
  if (!data.length) return
  const cols = columns || Object.keys(data[0])
  const header = cols.map(c => `"${c.replace(/"/g, '""')}"`).join(",")
  const rows = data.map(row => cols.map(col => {
    const val = row[col]
    if (val == null) return ""
    return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : String(val)
  }).join(","))
  const csv = [header, ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
  sonnerToast.success(`CSV exported`, {
    description: `${filename}.csv (${data.length} rows)`,
    duration: 3000,
  })
}
