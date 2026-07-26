"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Battery,
  BatteryCharging,
  BatteryLow,
  Wrench,
  Clock,
  Calendar,
  AlertTriangle,
  Activity,
  MapPin,
  Cog,
  Gauge,
  History,
  Zap,
  TrendingDown,
  RefreshCw,
  Settings,
  ZapOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EquipmentStatus = "active" | "maintenance" | "idle" | "charging"

export interface EquipmentDetailRow {
  id?: string | number
  name: string
  warehouse: string
  type: string
  batteryLevel: number
  status: EquipmentStatus
  lastMaintenance: string
  nextMaintenance: string
  hoursUsed: number
  downtime: number
}

interface EquipmentDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: EquipmentDetailRow | null
  onScheduleMaintenance?: (item: EquipmentDetailRow) => void
  onRefresh?: (item: EquipmentDetailRow) => void
}

// ---------------------------------------------------------------------------
// Mock maintenance history — deterministic per equipment ID
// ---------------------------------------------------------------------------

interface MaintenanceEntry {
  date: string
  type: "Scheduled" | "Repair" | "Inspection" | "Battery Service" | "Emergency"
  description: string
  technician: string
  durationHours: number
  cost: number
}

function generateMaintenanceHistory(id: string): MaintenanceEntry[] {
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const types: MaintenanceEntry["type"][] = ["Scheduled", "Repair", "Inspection", "Battery Service", "Emergency"]
  const descriptions: Record<MaintenanceEntry["type"], string[]> = {
    Scheduled: ["250-hour periodic service", "500-hour major service", "Quarterly inspection"],
    Repair: ["Hydraulic leak repair", "Mast chain replacement", "Brake pad replacement"],
    Inspection: ["Safety compliance check", "Pre-monsoon inspection", "Annual DOT inspection"],
    "Battery Service": ["Battery cell replacement", "Charger calibration", "Electrolyte top-up"],
    Emergency: ["Steering failure fix", "Lift chain snap repair", "Motor overheating fix"],
  }
  const technicians = ["Rajesh K.", "Priya S.", "Amit M.", "Sneha R.", "Vikram T."]
  const out: MaintenanceEntry[] = []
  const today = new Date()
  for (let i = 0; i < 6; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - (i + 1) * 28 - ((seed + i) % 12))
    const typeIdx = (seed + i * 5) % 5
    const type = types[typeIdx]
    const isEmergency = type === "Emergency"
    out.push({
      date: d.toISOString().slice(0, 10),
      type,
      description: descriptions[type][(seed + i) % descriptions[type].length],
      technician: technicians[(seed + i) % technicians.length],
      durationHours: isEmergency ? 6 + ((seed + i) % 12) : 1 + ((seed + i) % 4),
      cost: isEmergency ? 15000 + ((seed + i * 7) % 25000) : 2000 + ((seed + i * 11) % 6000),
    })
  }
  return out
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

function getStatusColor(status: EquipmentStatus): string {
  switch (status) {
    case "active": return "text-emerald-600 dark:text-emerald-400"
    case "maintenance": return "text-red-600 dark:text-red-400"
    case "idle": return "text-muted-foreground"
    case "charging": return "text-blue-600 dark:text-blue-400"
  }
}

function getStatusLabel(status: EquipmentStatus): string {
  switch (status) {
    case "active": return "Active"
    case "maintenance": return "In Maintenance"
    case "idle": return "Idle"
    case "charging": return "Charging"
  }
}

function getStatusBg(status: EquipmentStatus): string {
  switch (status) {
    case "active": return "bg-emerald-50 dark:bg-emerald-950/30"
    case "maintenance": return "bg-red-50 dark:bg-red-950/30"
    case "idle": return "bg-muted/50"
    case "charging": return "bg-blue-50 dark:bg-blue-950/30"
  }
}

function getBatteryIcon(level: number, status: EquipmentStatus) {
  if (status === "charging") return <BatteryCharging className="h-5 w-5 text-blue-500" />
  if (level < 20) return <BatteryLow className="h-5 w-5 text-red-500" />
  if (level < 50) return <Battery className="h-5 w-5 text-amber-500" />
  return <Battery className="h-5 w-5 text-emerald-500" />
}

function getBatteryColor(level: number): string {
  if (level > 60) return "bg-emerald-500"
  if (level >= 20) return "bg-amber-500"
  return "bg-red-500"
}

function getBatteryTextColor(level: number): string {
  if (level > 60) return "text-emerald-600 dark:text-emerald-400"
  if (level >= 20) return "text-amber-600 dark:text-amber-400"
  return "text-red-600 dark:text-red-400"
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EquipmentDetailDrawer({
  open,
  onOpenChange,
  item,
  onScheduleMaintenance,
  onRefresh,
}: EquipmentDetailDrawerProps) {
  // Hook MUST be called before any early return — derive stable input for useMemo
  const idForHistory = item?.id?.toString() ?? ""
  const maintenanceHistory = React.useMemo(
    () => (idForHistory ? generateMaintenanceHistory(idForHistory) : []),
    [idForHistory]
  )

  if (!item) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0" />
      </Sheet>
    )
  }

  // Derived metrics
  const utilization = item.hoursUsed + item.downtime > 0
    ? Math.round((item.hoursUsed / (item.hoursUsed + item.downtime)) * 100)
    : 0
  const uptimePct = 100 - Math.min(100, utilization === 0 ? 0 : (item.downtime / (item.hoursUsed + item.downtime)) * 100)
  const nextMaintDate = new Date(item.nextMaintenance)
  const today = new Date()
  const daysUntilMaintenance = Math.ceil((nextMaintDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const maintenanceDue = daysUntilMaintenance <= 7
  const maintenanceOverdue = daysUntilMaintenance < 0
  const lastMaintDate = new Date(item.lastMaintenance)
  const daysSinceLastMaintenance = Math.floor((today.getTime() - lastMaintDate.getTime()) / (1000 * 60 * 60 * 24))

  // Health score (0-100)
  let healthScore = 100
  if (item.status === "maintenance") healthScore -= 40
  if (item.batteryLevel < 20) healthScore -= 25
  else if (item.batteryLevel < 50) healthScore -= 10
  if (maintenanceOverdue) healthScore -= 30
  else if (maintenanceDue) healthScore -= 15
  if (item.downtime > 20) healthScore -= 15
  else if (item.downtime > 10) healthScore -= 8
  healthScore = Math.max(0, Math.min(100, healthScore))
  const healthLabel = healthScore >= 85 ? "Excellent" : healthScore >= 70 ? "Good" : healthScore >= 50 ? "Fair" : "Poor"
  const healthColor =
    healthScore >= 85 ? "text-emerald-600 dark:text-emerald-400"
    : healthScore >= 70 ? "text-blue-600 dark:text-blue-400"
    : healthScore >= 50 ? "text-amber-600 dark:text-amber-400"
    : "text-red-600 dark:text-red-400"

  // Total maintenance cost
  const totalMaintCost = maintenanceHistory.reduce((s, m) => s + m.cost, 0)
  const totalDowntimeHours = maintenanceHistory.reduce((s, m) => s + m.durationHours, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-lg p-0 flex flex-col overflow-y-auto",
          "drawer-slide-in"
        )}
      >
        {/* Header */}
        <SheetHeader className={cn("px-5 pt-5 pb-4 border-b", getStatusBg(item.status))}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                item.status === "maintenance"
                  ? "bg-red-100 dark:bg-red-950"
                  : item.status === "charging"
                  ? "bg-blue-100 dark:bg-blue-950"
                  : "bg-primary/10"
              )}>
                {item.status === "maintenance" ? (
                  <Wrench className="h-5 w-5 text-red-500" />
                ) : item.status === "charging" ? (
                  <BatteryCharging className="h-5 w-5 text-blue-500" />
                ) : (
                  <Cog className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-base leading-tight truncate">
                  {item.name}
                </SheetTitle>
                <SheetDescription className="text-xs font-mono mt-0.5">
                  {item.id?.toString() ?? "—"} · {item.type}
                </SheetDescription>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="outline" className={cn("text-[10px] font-normal", getStatusColor(item.status))}>
                    {getStatusLabel(item.status)}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-normal gap-1">
                    <MapPin className="h-2.5 w-2.5" />
                    {item.warehouse}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Health Score Banner */}
        <div className={cn(
          "px-5 py-3 flex items-center justify-between gap-3 border-b",
          healthScore < 50 && "bg-red-50 dark:bg-red-950/30",
          healthScore >= 50 && healthScore < 70 && "bg-amber-50 dark:bg-amber-950/30",
          healthScore >= 70 && "bg-emerald-50 dark:bg-emerald-950/30"
        )}>
          <div className="flex items-center gap-2">
            <Activity className={cn("h-4 w-4", healthColor)} />
            <span className="text-xs font-medium">Equipment Health</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-bold", healthColor)}>{healthLabel}</span>
            <span className={cn("text-xs text-number", healthColor)}>{healthScore}/100</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 px-5 py-5 space-y-5">
          {/* Battery / Power Card */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Power Status
            </h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getBatteryIcon(item.batteryLevel, item.status)}
                  <span className="text-sm font-medium">Battery Level</span>
                </div>
                <span className={cn("text-2xl font-bold text-number", getBatteryTextColor(item.batteryLevel))}>
                  {item.batteryLevel}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", getBatteryColor(item.batteryLevel))}
                  style={{ width: `${item.batteryLevel}%` }}
                />
              </div>
              {item.status === "charging" && (
                <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                  <BatteryCharging className="h-3 w-3" />
                  Currently charging — estimated full charge in ~{Math.ceil((100 - item.batteryLevel) / 10) * 15} min
                </p>
              )}
              {item.batteryLevel < 20 && item.status !== "charging" && (
                <div className="mt-2 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-3 py-2 flex items-center gap-2">
                  <ZapOff className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <p className="text-[11px] text-red-700 dark:text-red-300">
                    Critical battery level. Return to charging station immediately.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Gauge className="h-3 w-3" />
                Utilization
              </p>
              <p className={cn(
                "text-sm font-semibold text-number",
                utilization >= 80 ? "text-emerald-600 dark:text-emerald-400"
                : utilization >= 50 ? "text-amber-600 dark:text-amber-400"
                : "text-red-600 dark:text-red-400"
              )}>
                {utilization}%
              </p>
              <p className="text-[10px] text-muted-foreground">
                {utilization >= 80 ? "High usage" : utilization >= 50 ? "Moderate" : "Underutilized"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Uptime
              </p>
              <p className="text-sm font-semibold text-number text-emerald-600 dark:text-emerald-400">
                {uptimePct.toFixed(1)}%
              </p>
              <p className="text-[10px] text-muted-foreground">
                {item.downtime}h downtime
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Hours Used
              </p>
              <p className="text-sm font-semibold text-number">{item.hoursUsed.toLocaleString()}h</p>
              <p className="text-[10px] text-muted-foreground">total runtime</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Downtime
              </p>
              <p className={cn(
                "text-sm font-semibold text-number",
                item.downtime > 20 && "text-red-600 dark:text-red-400",
                item.downtime > 10 && item.downtime <= 20 && "text-amber-600 dark:text-amber-400"
              )}>
                {item.downtime}h
              </p>
              <p className="text-[10px] text-muted-foreground">last 30 days</p>
            </div>
          </div>

          <Separator />

          {/* Maintenance Schedule */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Maintenance Schedule
            </h3>
            <div className={cn(
              "rounded-lg border p-3 space-y-2",
              maintenanceOverdue && "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30",
              maintenanceDue && !maintenanceOverdue && "border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30"
            )}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last Service</span>
                <span className="font-medium text-number">
                  {lastMaintDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Next Service</span>
                <span className={cn(
                  "font-medium text-number",
                  maintenanceOverdue && "text-red-600 dark:text-red-400",
                  maintenanceDue && !maintenanceOverdue && "text-amber-600 dark:text-amber-400"
                )}>
                  {nextMaintDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Days Since</span>
                <span className="font-medium text-number">{daysSinceLastMaintenance}d</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Days Until</span>
                <span className={cn(
                  "font-medium text-number",
                  maintenanceOverdue && "text-red-600 dark:text-red-400",
                  maintenanceDue && !maintenanceOverdue && "text-amber-600 dark:text-amber-400"
                )}>
                  {maintenanceOverdue ? `${Math.abs(daysUntilMaintenance)}d overdue` : `${daysUntilMaintenance}d`}
                </span>
              </div>
            </div>
            {maintenanceOverdue && (
              <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-3 py-2 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <p className="text-[11px] text-red-700 dark:text-red-300">
                  Maintenance overdue by {Math.abs(daysUntilMaintenance)} days. Schedule service immediately.
                </p>
              </div>
            )}
            {maintenanceDue && !maintenanceOverdue && (
              <div className="rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Maintenance due in {daysUntilMaintenance} days. Schedule soon.
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Cost Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total Maint. Cost</p>
              <p className="text-base font-bold text-number mt-1">₹{totalMaintCost.toLocaleString("en-IN")}</p>
              <p className="text-[10px] text-muted-foreground">last 6 services</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Service Downtime</p>
              <p className="text-base font-bold text-number mt-1">{totalDowntimeHours}h</p>
              <p className="text-[10px] text-muted-foreground">last 6 services</p>
            </div>
          </div>

          <Separator />

          {/* Maintenance History */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" />
              Maintenance History
            </h3>
            <div className="rounded-lg border divide-y">
              {maintenanceHistory.map((m, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 hover:bg-accent/40 transition-colors movement-row-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md mt-0.5",
                    m.type === "Emergency" && "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
                    m.type === "Repair" && "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
                    m.type === "Scheduled" && "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
                    m.type === "Inspection" && "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
                    m.type === "Battery Service" && "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
                  )}>
                    <Wrench className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium truncate">{m.description}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0 text-number">{m.date}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[10px] text-muted-foreground">
                        {m.type} · {m.technician} · {m.durationHours}h
                      </p>
                      <span className="text-[10px] font-semibold text-number">₹{m.cost.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onRefresh?.(item)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            className={cn(
              "flex-1 gap-1.5",
              maintenanceOverdue && "bg-red-600 hover:bg-red-700 text-white reorder-urgent",
              maintenanceDue && !maintenanceOverdue && "bg-amber-600 hover:bg-amber-700 text-white"
            )}
            onClick={() => onScheduleMaintenance?.(item)}
          >
            <Settings className="h-3.5 w-3.5" />
            {maintenanceOverdue ? "Schedule Now" : maintenanceDue ? "Schedule Service" : "Schedule Maintenance"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
