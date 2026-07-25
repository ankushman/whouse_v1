"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import {
  Package,
  Truck,
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle2,
} from "lucide-react"

interface TickerItem {
  id: string
  icon: typeof Package
  label: string
  value: string
  change?: string
  severity: "success" | "warning" | "critical" | "info"
}

const BASE_TICKER_ITEMS: Omit<TickerItem, "id">[] = [
  { icon: Package, label: "Inbound Today", value: "142", change: "+12%", severity: "success" },
  { icon: Truck, label: "Outbound", value: "98", change: "+8%", severity: "success" },
  { icon: Clock, label: "Avg Dock Time", value: "2.4h", change: "-15%", severity: "success" },
  { icon: TrendingUp, label: "Productivity", value: "87%", change: "+3%", severity: "success" },
  { icon: AlertTriangle, label: "SLA At Risk", value: "5", severity: "warning" },
  { icon: CheckCircle2, label: "OTIF Rate", value: "96.2%", change: "+1.2%", severity: "success" },
  { icon: AlertTriangle, label: "Equipment Down", value: "2", severity: "critical" },
  { icon: Package, label: "Pending GRN", value: "24", severity: "info" },
  { icon: Truck, label: "In Transit", value: "34", severity: "info" },
  { icon: Clock, label: "Avg Cycle Time", value: "18min", change: "-8%", severity: "success" },
]

const severityStyles = {
  success: "text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-950/30",
  warning: "text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-950/30",
  critical: "text-red-600 dark:text-red-400 border-red-200/60 dark:border-red-800/40 bg-red-50/60 dark:bg-red-950/30",
  info: "text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40 bg-blue-50/60 dark:bg-blue-950/30",
}

const changeStyles = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-red-600 dark:text-red-400",
}

function parseChange(change?: string): { isPositive: boolean; display: string } | null {
  if (!change) return null
  const isPositive = change.startsWith("+") || change.startsWith("-") && !change.startsWith("--")
  // If starts with - but contains decrease context (like time), it's positive
  const isTimeDecrease = change.startsWith("-") && (change.includes("h") || change.includes("min") || change.includes("s"))
  return {
    isPositive: isPositive || isTimeDecrease,
    display: change,
  }
}

export function MetricsTicker() {
  const [tick, setTick] = useState(0)

  // Slowly cycle to trigger re-renders for "live" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  const items = useMemo((): TickerItem[] => {
    return BASE_TICKER_ITEMS.map((item, i) => ({
      ...item,
      id: `ticker-${i}-${tick}`,
      // Slightly randomize values for live feel
      value: tick > 0 && item.severity !== "critical"
        ? item.value // Keep stable for now
        : item.value,
    }))
  }, [tick])

  return (
    <div className="w-full overflow-hidden">
      <div className="flex animate-scroll-ticker gap-2 py-1" style={{ width: "max-content" }}>
        {/* Duplicate for seamless loop */}
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon
          const change = parseChange(item.change)
          return (
            <div
              key={`${item.id}-${idx}`}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 whitespace-nowrap transition-smooth shrink-0",
                severityStyles[item.severity]
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              <span className="text-[11px] font-medium">{item.label}</span>
              <span className="text-[12px] font-bold tabular-nums">{item.value}</span>
              {change && (
                <span className={cn(
                  "text-[10px] font-medium tabular-nums",
                  change.isPositive ? changeStyles.positive : changeStyles.negative
                )}>
                  {change.display}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
