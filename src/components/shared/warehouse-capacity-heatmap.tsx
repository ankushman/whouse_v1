"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Warehouse as WarehouseIcon,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { warehouses } from "@/data/mock-data"

// Simulated zone-level capacity data
const ZONE_DATA: Record<string, { zone: string; usage: number; capacity: number }[]> = {
  "WH-CHN-001": [
    { zone: "A1", usage: 92, capacity: 500 },
    { zone: "A2", usage: 78, capacity: 450 },
    { zone: "B1", usage: 45, capacity: 300 },
    { zone: "B2", usage: 88, capacity: 400 },
    { zone: "C1", usage: 65, capacity: 350 },
    { zone: "C2", usage: 34, capacity: 280 },
    { zone: "D1", usage: 71, capacity: 320 },
    { zone: "D2", usage: 55, capacity: 250 },
  ],
  "WH-PUN-002": [
    { zone: "A1", usage: 82, capacity: 600 },
    { zone: "A2", usage: 91, capacity: 550 },
    { zone: "B1", usage: 60, capacity: 400 },
    { zone: "B2", usage: 73, capacity: 450 },
    { zone: "C1", usage: 38, capacity: 350 },
    { zone: "C2", usage: 85, capacity: 380 },
    { zone: "D1", usage: 52, capacity: 300 },
    { zone: "D2", usage: 67, capacity: 280 },
  ],
  "WH-GUR-003": [
    { zone: "A1", usage: 95, capacity: 480 },
    { zone: "A2", usage: 70, capacity: 420 },
    { zone: "B1", usage: 42, capacity: 380 },
    { zone: "B2", usage: 88, capacity: 360 },
    { zone: "C1", usage: 56, capacity: 300 },
    { zone: "C2", usage: 79, capacity: 340 },
  ],
  "WH-KOL-004": [
    { zone: "A1", usage: 33, capacity: 550 },
    { zone: "A2", usage: 48, capacity: 500 },
    { zone: "B1", usage: 62, capacity: 420 },
    { zone: "B2", usage: 77, capacity: 400 },
    { zone: "C1", usage: 85, capacity: 360 },
    { zone: "C2", usage: 41, capacity: 320 },
    { zone: "D1", usage: 55, capacity: 380 },
    { zone: "D2", usage: 29, capacity: 300 },
  ],
  "WH-SAN-005": [
    { zone: "A1", usage: 87, capacity: 520 },
    { zone: "A2", usage: 94, capacity: 480 },
    { zone: "B1", usage: 51, capacity: 400 },
    { zone: "B2", usage: 68, capacity: 380 },
    { zone: "C1", usage: 76, capacity: 350 },
    { zone: "C2", usage: 43, capacity: 300 },
  ],
  "WH-HOS-006": [
    { zone: "A1", usage: 59, capacity: 450 },
    { zone: "A2", usage: 72, capacity: 420 },
    { zone: "B1", usage: 83, capacity: 380 },
    { zone: "B2", usage: 46, capacity: 360 },
    { zone: "C1", usage: 91, capacity: 340 },
    { zone: "C2", usage: 37, capacity: 300 },
    { zone: "D1", usage: 64, capacity: 320 },
    { zone: "D2", usage: 78, capacity: 280 },
  ],
}

function getHeatColor(usage: number): { bg: string; border: string; text: string } {
  if (usage >= 90) return { bg: "bg-red-500/90 dark:bg-red-600/80", border: "border-red-600/50", text: "text-red-100" }
  if (usage >= 75) return { bg: "bg-amber-500/85 dark:bg-amber-600/75", border: "border-amber-600/40", text: "text-amber-100" }
  if (usage >= 50) return { bg: "bg-emerald-500/70 dark:bg-emerald-600/60", border: "border-emerald-600/30", text: "text-emerald-100" }
  return { bg: "bg-blue-500/50 dark:bg-blue-600/40", border: "border-blue-600/20", text: "text-blue-100" }
}

function getCapacityLabel(usage: number): string {
  if (usage >= 90) return "Critical"
  if (usage >= 75) return "High"
  if (usage >= 50) return "Moderate"
  return "Low"
}

export function WarehouseCapacityHeatmap() {
  const warehouseData = useMemo(() => {
    return warehouses.slice(0, 6).map((wh) => ({
      ...wh,
      zones: ZONE_DATA[wh.id] || [],
      avgUsage: ZONE_DATA[wh.id]
        ? Math.round(ZONE_DATA[wh.id].reduce((s, z) => s + z.usage, 0) / ZONE_DATA[wh.id].length)
        : 0,
    }))
  }, [])

  const criticalZones = useMemo(() => {
    return warehouseData.reduce((count, wh) => {
      return count + wh.zones.filter((z) => z.usage >= 90).length
    }, 0)
  }, [warehouseData])

  return (
    <Card className="rounded-xl border-border/60 shadow-sm card-depth chart-card card-accent-purple">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <WarehouseIcon className="size-4 text-purple-500" />
              Zone Capacity Heatmap
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Storage zone utilization across all warehouses
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {criticalZones > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-red-600 dark:text-red-400 badge-status-dot critical">
                <AlertTriangle className="size-3" />
                {criticalZones} critical zones
              </div>
            )}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <TrendingUp className="size-3" />
              Live
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-sm bg-blue-500/50 dark:bg-blue-600/40" />
            &lt;50%
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-sm bg-emerald-500/70 dark:bg-emerald-600/60" />
            50-74%
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-sm bg-amber-500/85 dark:bg-amber-600/75" />
            75-89%
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-sm bg-red-500/90 dark:bg-red-600/80" />
            90%+
          </div>
        </div>

        <TooltipProvider delayDuration={200}>
          <div className="space-y-3 stagger-children">
            {warehouseData.map((wh) => (
              <div key={wh.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground truncate">{wh.name}</span>
                  <span className={cn(
                    "text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full",
                    wh.avgUsage >= 85
                      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      : wh.avgUsage >= 70
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  )}>
                    {wh.avgUsage}% avg
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                  {wh.zones.map((zone) => {
                    const colors = getHeatColor(zone.usage)
                    return (
                      <Tooltip key={zone.zone}>
                        <TooltipTrigger asChild>
                          <div className={cn(
                            "relative flex flex-col items-center justify-center rounded-md border p-1.5 transition-all duration-200 hover:scale-105 hover:z-10 cursor-default",
                            colors.bg,
                            colors.border
                          )}>
                            <span className={cn("text-[10px] font-semibold leading-tight", colors.text)}>
                              {zone.zone}
                            </span>
                            <span className={cn("text-[9px] tabular-nums opacity-80", colors.text)}>
                              {zone.usage}%
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <div className="space-y-0.5">
                            <p className="font-medium">{wh.name} — Zone {zone.zone}</p>
                            <p className="text-muted-foreground">
                              {zone.usage} / {zone.capacity} units ({getCapacityLabel(zone.usage)})
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
