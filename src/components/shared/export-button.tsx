"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ExportButtonProps {
  onExportCSV?: () => void
  onExportPDF?: () => void
  className?: string
}

export function ExportButton({ onExportCSV, onExportPDF, className }: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", className)}>
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onExportCSV && (
          <DropdownMenuItem className="text-xs gap-2 cursor-pointer" onClick={onExportCSV}>
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
export function exportToCSV(data: Record<string, any>[], filename: string, columns?: string[]) {
  if (!data.length) return
  const cols = columns || Object.keys(data[0])
  const header = cols.join(",")
  const rows = data.map(row => cols.map(col => {
    const val = row[col]
    const str = typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : String(val)
    return str
  }).join(","))
  const csv = [header, ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
  toast.success(`CSV exported`, {
    description: `${filename}.csv (${data.length} rows)`,
    duration: 3000,
  })
}
