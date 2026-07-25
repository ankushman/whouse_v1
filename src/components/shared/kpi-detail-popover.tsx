"use client"

import { useMemo } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TrendingUp, TrendingDown, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  breakdown?: KPIBreakdown[]
}

interface KPIBreakdown {
  label: string
  value: string
  change: number // e.g. +5 or -3
}

// Generate plausible mock breakdown data based on KPI title
function generateBreakdown(title: string, currentValue: string | number): KPIBreakdown[] {
  const lowerTitle = title.toLowerCase()

  // Extract numeric part if possible
  const numMatch = typeof currentValue === "string" ? currentValue.match(/[\d,.]+/) : null
  const baseValue = numMatch ? parseFloat(numMatch[0].replace(",", "")) : (typeof currentValue === "number" ? currentValue : 100)

  if (lowerTitle.includes("throughput") || lowerTitle.includes("orders") || lowerTitle.includes("shipments")) {
    return [
      { label: "Today", value: String(baseValue), change: 0 },
      { label: "vs Yesterday", value: String(Math.round(baseValue * 0.94)), change: -6 },
      { label: "vs Last Week", value: String(Math.round(baseValue * 1.03)), change: 3 },
      { label: "vs Last Month", value: String(Math.round(baseValue * 1.12)), change: 12 },
    ]
  }

  if (lowerTitle.includes("accuracy") || lowerTitle.includes("sla") || lowerTitle.includes("achievement")) {
    return [
      { label: "Today", value: `${baseValue}%`, change: 0 },
      { label: "vs Yesterday", value: `${(baseValue - 0.3).toFixed(1)}%`, change: -0.3 },
      { label: "vs Last Week", value: `${(baseValue + 0.5).toFixed(1)}%`, change: 0.5 },
      { label: "vs Last Month", value: `${(baseValue + 1.2).toFixed(1)}%`, change: 1.2 },
    ]
  }

  if (lowerTitle.includes("utilization") || lowerTitle.includes("occupancy")) {
    return [
      { label: "Today", value: `${baseValue}%`, change: 0 },
      { label: "vs Yesterday", value: `${baseValue + 2}%`, change: 2 },
      { label: "vs Last Week", value: `${baseValue - 1}%`, change: -1 },
      { label: "vs Last Month", value: `${baseValue + 5}%`, change: 5 },
    ]
  }

  if (lowerTitle.includes("cost") || lowerTitle.includes("expense") || lowerTitle.includes("revenue")) {
    return [
      { label: "Today", value: `₹${Math.round(baseValue).toLocaleString()}`, change: 0 },
      { label: "vs Yesterday", value: `₹${Math.round(baseValue * 1.05).toLocaleString()}`, change: 5 },
      { label: "vs Last Week", value: `₹${Math.round(baseValue * 0.97).toLocaleString()}`, change: -3 },
      { label: "vs Last Month", value: `₹${Math.round(baseValue * 0.92).toLocaleString()}`, change: -8 },
    ]
  }

  if (lowerTitle.includes("time") || lowerTitle.includes("delay")) {
    return [
      { label: "Today", value: `${baseValue} hrs`, change: 0 },
      { label: "vs Yesterday", value: `${baseValue + 0.2} hrs`, change: 10 },
      { label: "vs Last Week", value: `${baseValue - 0.3} hrs`, change: -9 },
      { label: "vs Last Month", value: `${baseValue + 0.5} hrs`, change: 19 },
    ]
  }

  // Default fallback
  return [
    { label: "Today", value: String(currentValue), change: 0 },
    { label: "vs Yesterday", value: String(Math.round(baseValue * 0.98)), change: -2 },
    { label: "vs Last Week", value: String(Math.round(baseValue * 1.04)), change: 4 },
    { label: "vs Last Month", value: String(Math.round(baseValue * 1.08)), change: 8 },
  ]
}

export function KPIDetailPopover({ title, value, breakdown, children }: KPICardProps & { children: React.ReactNode }) {
  const data = useMemo(
    () => breakdown ?? generateBreakdown(title, value),
    [title, value, breakdown]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">{title}</h4>
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Performance breakdown</p>
        </div>
        <div className="divide-y divide-border">
          {data.map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-muted-foreground">{row.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-number">{row.value}</span>
                {row.change !== 0 && (
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-[10px] font-medium",
                      row.change > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {row.change > 0 ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    {row.change > 0 ? "+" : ""}{row.change}%
                  </span>
                )}
                {row.change === 0 && (
                  <span className="text-[10px] font-medium text-muted-foreground">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
