"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  Building2,
  MapPin,
  Package,
  Truck,
  Target,
  ClipboardList,
  Clock,
  Activity,
  Wrench,
  Gauge,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Map as MapIcon,
  Phone,
  Mail,
  CalendarClock,
  Boxes,
  Users,
  CheckCircle2,
  ArrowRightLeft,
  PackageCheck,
  Forklift,
  Warehouse as WarehouseIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import type { Warehouse } from "@/data/mock-data"

// ---------------------------------------------------------------------------
// Props & Types
// ---------------------------------------------------------------------------

export interface WarehouseDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: Warehouse | null
  onRefresh?: (warehouse: Warehouse) => void
  onViewOnMap?: (warehouse: Warehouse) => void
}

interface ThroughputPoint {
  day: string
  inbound: number
  outbound: number
}

interface ShipmentEntry {
  id: string
  type: "Inbound" | "Outbound"
  partner: string
  status: "Delivered" | "In Transit" | "Processing" | "Pending"
  timeAgo: string
  items: number
}

interface ZoneInfo {
  name: string
  used: number
  capacity: number
}

interface ActivityEntry {
  text: string
  timeAgo: string
  dotColor: string
  icon: React.ReactNode
}

// ---------------------------------------------------------------------------
// Deterministic helpers — derive stable mock data from warehouse.id
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function buildThroughput(warehouse: Warehouse): ThroughputPoint[] {
  const seed = hashStr(warehouse.id)
  const baseInbound = Math.round(warehouse.todayOrders * 0.6)
  const baseOutbound = Math.round(warehouse.todayOrders * 0.4)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day, i) => {
    const inbound = Math.max(0, baseInbound + (((seed + i * 7) % 31) - 15))
    const outbound = Math.max(0, baseOutbound + (((seed + i * 13) % 21) - 10))
    return { day, inbound, outbound }
  })
}

function buildRecentShipments(warehouse: Warehouse): ShipmentEntry[] {
  const seed = hashStr(warehouse.id)
  const suppliers = ["Bosch India", "Motherson Sumi", "Bharat Forge", "Uno Minda", "Mando India", "Varroc Polymers"]
  const destinations = ["Mahindra - Chennai", "Tata - Pune", "Maruti - Gurugram", "Hyundai - Chennai", "Kia - Pune", "Bajaj - Aurangabad"]
  const statuses: ShipmentEntry["status"][] = ["Delivered", "In Transit", "Processing", "Pending", "Delivered"]
  const timeOptions = ["12m ago", "34m ago", "1h ago", "2h ago", "3h ago", "5h ago"]

  return Array.from({ length: 5 }, (_, i) => {
    const isInbound = (seed + i) % 2 === 0
    return {
      id: isInbound
        ? `IN-2024-${String(800 + ((seed + i * 17) % 200)).padStart(4, "0")}`
        : `OB-2024-${String(300 + ((seed + i * 11) % 200)).padStart(4, "0")}`,
      type: isInbound ? "Inbound" : "Outbound",
      partner: isInbound
        ? suppliers[(seed + i) % suppliers.length]
        : destinations[(seed + i) % destinations.length],
      status: statuses[(seed + i) % statuses.length],
      timeAgo: timeOptions[(seed + i) % timeOptions.length],
      items: 8 + ((seed + i * 23) % 60),
    }
  })
}

function buildZones(warehouse: Warehouse): ZoneInfo[] {
  const seed = hashStr(warehouse.id)
  const zoneLabels = ["A1", "A2", "B1", "B2", "C1", "C3"]
  const totalCapacity = warehouse.capacity
  const perZone = Math.round(totalCapacity / zoneLabels.length)
  return zoneLabels.map((name, i) => {
    // Vary utilization around the warehouse's overall capacityUsed
    const variance = ((seed + i * 19) % 30) - 15
    const used = Math.max(5, Math.min(100, warehouse.capacityUsed + variance))
    return { name, used, capacity: perZone }
  })
}

function buildActivityFeed(warehouse: Warehouse): ActivityEntry[] {
  const seed = hashStr(warehouse.id)
  const inv = `INV-${847 + Math.round(warehouse.capacityUsed / 10) + (seed % 30)}`
  const sh = `SH-${912 + Math.round(warehouse.todayOrders / 50) + (seed % 20)}`
  const fl = `FL-00${(seed % 5) + 1}`
  return [
    {
      text: `Inbound shipment ${inv} received at dock D${(seed % 6) + 1}`,
      timeAgo: "12 min ago",
      dotColor: "bg-emerald-500",
      icon: <Package className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      text: `Dock D${(seed % 6) + 1} allocated for unloading`,
      timeAgo: "32 min ago",
      dotColor: "bg-blue-500",
      icon: <Truck className="h-3 w-3 text-blue-600 dark:text-blue-400" />,
    },
    {
      text: `Inventory cycle count completed in zone ${["A1", "B2", "C1"][(seed % 3)]}`,
      timeAgo: "1h ago",
      dotColor: "bg-emerald-400",
      icon: <ClipboardList className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      text: `Equipment ${fl} maintenance scheduled`,
      timeAgo: "2h ago",
      dotColor: "bg-amber-500",
      icon: <Wrench className="h-3 w-3 text-amber-600 dark:text-amber-400" />,
    },
    {
      text: `Outbound shipment ${sh} dispatched`,
      timeAgo: "3h ago",
      dotColor: "bg-emerald-500",
      icon: <PackageCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      text: `Stock transfer order STO-${4400 + (seed % 99)} raised`,
      timeAgo: "5h ago",
      dotColor: "bg-violet-500",
      icon: <ArrowRightLeft className="h-3 w-3 text-violet-600 dark:text-violet-400" />,
    },
    {
      text: `Shift handover completed (Morning → Afternoon)`,
      timeAgo: "6h ago",
      dotColor: "bg-blue-400",
      icon: <Users className="h-3 w-3 text-blue-600 dark:text-blue-400" />,
    },
  ]
}

// ---------------------------------------------------------------------------
// Status & health helpers
// ---------------------------------------------------------------------------

type HealthLabel = "Excellent" | "Good" | "Fair" | "Poor" | "Critical"

function getHealthLabel(score: number): HealthLabel {
  if (score >= 90) return "Excellent"
  if (score >= 75) return "Good"
  if (score >= 60) return "Fair"
  if (score >= 40) return "Poor"
  return "Critical"
}

function getHealthColor(score: number): {
  text: string
  bg: string
  ring: string
  icon: React.ComponentType<{ className?: string }>
} {
  if (score >= 75) {
    return {
      text: "text-emerald-700 dark:text-emerald-300",
      bg: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/60 dark:to-emerald-900/30",
      ring: "ring-emerald-300/60 dark:ring-emerald-700/60",
      icon: ShieldCheck,
    }
  }
  if (score >= 60) {
    return {
      text: "text-amber-700 dark:text-amber-300",
      bg: "from-amber-50 to-amber-100/50 dark:from-amber-950/60 dark:to-amber-900/30",
      ring: "ring-amber-300/60 dark:ring-amber-700/60",
      icon: ShieldAlert,
    }
  }
  return {
    text: "text-red-700 dark:text-red-300",
    bg: "from-red-50 to-red-100/50 dark:from-red-950/60 dark:to-red-900/30",
    ring: "ring-red-300/60 dark:ring-red-700/60",
    icon: ShieldX,
  }
}

function getCapacityColor(used: number): { bar: string; text: string } {
  if (used > 90) return { bar: "bg-red-500", text: "text-red-600 dark:text-red-400" }
  if (used > 80) return { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" }
  return { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" }
}

const statusStyles: Record<Warehouse["status"], { bg: string; text: string; label: string; dot: string }> = {
  green: {
    bg: "bg-emerald-100 dark:bg-emerald-950/60",
    text: "text-emerald-700 dark:text-emerald-300",
    label: "Healthy",
    dot: "bg-emerald-500",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-950/60",
    text: "text-amber-700 dark:text-amber-300",
    label: "Warning",
    dot: "bg-amber-500",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-950/60",
    text: "text-red-700 dark:text-red-300",
    label: "Critical",
    dot: "bg-red-500",
  },
}

const shipmentStatusStyles: Record<ShipmentEntry["status"], string> = {
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  "In Transit": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  Processing: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
}

const throughputChartConfig = {
  inbound: { label: "Inbound", color: "#2563EB" },
  outbound: { label: "Outbound", color: "#10B981" },
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function WarehouseDetailDrawer({
  open,
  onOpenChange,
  warehouse,
  onRefresh,
  onViewOnMap,
}: WarehouseDetailDrawerProps) {
  const toast = useToast()

  // Compute mock data — memoized on warehouse.id so it stays stable across re-renders
  const throughput = React.useMemo(
    () => (warehouse ? buildThroughput(warehouse) : []),
    [warehouse]
  )
  const recentShipments = React.useMemo(
    () => (warehouse ? buildRecentShipments(warehouse) : []),
    [warehouse]
  )
  const zones = React.useMemo(
    () => (warehouse ? buildZones(warehouse) : []),
    [warehouse]
  )
  const activity = React.useMemo(
    () => (warehouse ? buildActivityFeed(warehouse) : []),
    [warehouse]
  )

  if (!warehouse) return null

  // ── Derived metrics ──────────────────────────────────────────────────────
  const status = statusStyles[warehouse.status]
  const healthLabel = getHealthLabel(warehouse.healthScore)
  const healthColor = getHealthColor(warehouse.healthScore)
  const HealthIcon = healthColor.icon
  const capColor = getCapacityColor(warehouse.capacityUsed)
  const usedCapacityUnits = Math.round((warehouse.capacity * warehouse.capacityUsed) / 100)
  const freeCapacityUnits = warehouse.capacity - usedCapacityUnits
  const forkliftIdle = warehouse.forkliftCount - warehouse.forkliftActive
  const forkliftUtilizationPct = warehouse.forkliftCount > 0
    ? Math.round((warehouse.forkliftActive / warehouse.forkliftCount) * 100)
    : 0
  const isCritical = warehouse.status === "red"
  const isWarning = warehouse.status === "amber"

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleRefresh = () => {
    toast.info("Refreshing warehouse data", `Latest telemetry for ${warehouse.name} fetched`)
    onRefresh?.(warehouse)
  }

  const handleViewOnMap = () => {
    toast.success("Opening warehouse map", `Centered on ${warehouse.name}, ${warehouse.city}`)
    onViewOnMap?.(warehouse)
  }

  const handleContactManager = () => {
    toast.info("Contacting manager", `${warehouse.managerName} will be notified via secure message`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[640px] overflow-y-auto p-0 gap-0 bg-background"
      >
        {/* ── Header (gradient + status strip) ────────────────────────────── */}
        <SheetHeader className="relative px-6 pt-6 pb-4 space-y-0 drawer-header-shimmer wh-drawer-header-sheen bg-gradient-to-br from-primary/10 via-background to-background border-b">
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1",
              isCritical ? "bg-red-500 critical-wh-strip" : isWarning ? "bg-amber-500" : "bg-emerald-500"
            )}
          />
          <div className="flex items-start gap-4 pr-8">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br",
                isCritical
                  ? "from-red-500 to-red-700 shadow-red-500/30"
                  : isWarning
                    ? "from-amber-500 to-amber-700 shadow-amber-500/30"
                    : "from-blue-600 to-blue-800 shadow-blue-500/30"
              )}
            >
              <Building2 className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-lg font-bold text-foreground leading-tight">
                {warehouse.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <MapPin className="size-3" />
                {warehouse.city}, {warehouse.state}
              </SheetDescription>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn("text-[10px] gap-1 px-2 py-0 border", status.bg, status.text)}
                >
                  <span className={cn("size-1.5 rounded-full", status.dot)} />
                  {status.label}
                </Badge>
                <Badge variant="outline" className="text-[10px] gap-1 px-2 py-0 font-mono">
                  <WarehouseIcon className="size-2.5" />
                  {warehouse.id}
                </Badge>
                {warehouse.alerts > 0 && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] gap-1 px-2 py-0",
                      warehouse.alerts > 3
                        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800"
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                    )}
                  >
                    <AlertTriangle className="size-2.5" />
                    {warehouse.alerts} alert{warehouse.alerts === 1 ? "" : "s"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Manager strip */}
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-2.5 manager-card-hover">
            <Avatar className="size-8 ring-2 ring-background shadow-sm">
              <AvatarFallback className="text-[10px] font-semibold bg-primary/15 text-primary">
                {warehouse.managerAvatar}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground leading-tight">{warehouse.managerName}</p>
              <p className="text-[10px] text-muted-foreground">Warehouse Manager</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-[10px] gap-1"
              onClick={handleContactManager}
            >
              <Phone className="size-3" />
              Contact
            </Button>
          </div>
        </SheetHeader>

        <div className="px-6 py-4 space-y-4 wh-drawer-content-enter">
          {/* ── Health Score Banner ────────────────────────────────────────── */}
          <div
            className={cn(
              "relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 ring-1",
              healthColor.bg,
              healthColor.ring
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <HealthIcon className={cn("size-4", healthColor.text)} />
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Warehouse Health Score
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-3xl font-bold text-number leading-none", healthColor.text)}>
                    {warehouse.healthScore}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">/ 100</span>
                  <span className={cn("text-xs font-semibold ml-1", healthColor.text)}>
                    {healthLabel}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {healthLabel === "Excellent" && "Operating at peak efficiency across all metrics"}
                  {healthLabel === "Good" && "Performing well with minor areas to monitor"}
                  {healthLabel === "Fair" && "Acceptable performance, several metrics need attention"}
                  {healthLabel === "Poor" && "Below targets, immediate intervention recommended"}
                  {healthLabel === "Critical" && "Severe issues detected, escalate to operations lead"}
                </p>
              </div>
              {/* Mini radial indicator */}
              <div className="relative size-16 shrink-0">
                <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className={healthColor.text}
                    strokeDasharray={`${(warehouse.healthScore / 100) * 176} 176`}
                    style={{ transition: "stroke-dasharray 0.8s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn("text-sm font-bold text-number", healthColor.text)}>
                    {warehouse.healthScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Capacity Card ──────────────────────────────────────────────── */}
          <Card className="card-depth rounded-xl border-border/60 shadow-sm overflow-hidden">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("flex size-8 items-center justify-center rounded-lg", isCritical ? "bg-red-50 dark:bg-red-950/60" : isWarning ? "bg-amber-50 dark:bg-amber-950/60" : "bg-emerald-50 dark:bg-emerald-950/60")}>
                    <Boxes className={cn("size-4", capColor.text)} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Storage Capacity</p>
                    <p className="text-[10px] text-muted-foreground">Total {warehouse.capacity.toLocaleString("en-IN")} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-lg font-bold text-number leading-tight", capColor.text)}>
                    {warehouse.capacityUsed}%
                  </p>
                  <p className="text-[10px] text-muted-foreground tabular-nums">
                    {usedCapacityUnits.toLocaleString("en-IN")} used · {freeCapacityUnits.toLocaleString("en-IN")} free
                  </p>
                </div>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted relative">
                <div
                  className={cn("h-full rounded-full transition-all duration-700 stock-fill-grow", capColor.bar)}
                  style={{ width: `${warehouse.capacityUsed}%` }}
                />
                {/* Threshold markers */}
                <div className="absolute top-0 bottom-0 w-px bg-amber-400/60 threshold-marker" style={{ left: "80%" }} title="80% warning" />
                <div className="absolute top-0 bottom-0 w-px bg-red-500/60 threshold-marker" style={{ left: "90%" }} title="90% critical" />
              </div>
              {warehouse.capacityUsed > 90 && (
                <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 flex items-center gap-2 critical-pulse-border">
                  <AlertTriangle className="size-3 text-red-500 shrink-0" />
                  <p className="text-[11px] text-red-700 dark:text-red-300">
                    Near overflow — activate overflow staging area immediately
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Quick Stats Grid (6 cells) ────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              {
                label: "Today's Orders",
                value: warehouse.todayOrders.toLocaleString("en-IN"),
                icon: <Package className="size-3.5" />,
                tint: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
                trend: "up" as const,
                trendVal: "+8.2%",
              },
              {
                label: "Pending Tasks",
                value: warehouse.pendingTasks.toString(),
                icon: <ClipboardList className="size-3.5" />,
                tint: warehouse.pendingTasks > 10
                  ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
                trend: warehouse.pendingTasks > 10 ? "up" as const : "down" as const,
                trendVal: warehouse.pendingTasks > 10 ? "+3" : "-2",
              },
              {
                label: "Inventory Accuracy",
                value: `${warehouse.inventoryAccuracy}%`,
                icon: <Target className="size-3.5" />,
                tint: warehouse.inventoryAccuracy >= 98
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
                trend: warehouse.inventoryAccuracy >= 98 ? "up" as const : "down" as const,
                trendVal: warehouse.inventoryAccuracy >= 98 ? "+0.4%" : "-0.2%",
              },
              {
                label: "Forklift Utilization",
                value: `${forkliftUtilizationPct}%`,
                icon: <Forklift className="size-3.5" />,
                tint: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
                trend: "up" as const,
                trendVal: `+${forkliftUtilizationPct - 65}%`,
              },
              {
                label: "Fleet Status",
                value: `${warehouse.forkliftActive}/${warehouse.forkliftCount}`,
                icon: <Wrench className="size-3.5" />,
                tint: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
                trend: forkliftIdle > 2 ? "down" as const : "up" as const,
                trendVal: `${forkliftIdle} idle`,
              },
              {
                label: "Active Alerts",
                value: warehouse.alerts.toString(),
                icon: <AlertTriangle className="size-3.5" />,
                tint: warehouse.alerts > 3
                  ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                  : warehouse.alerts > 0
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                    : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
                trend: warehouse.alerts > 0 ? "up" as const : "up" as const,
                trendVal: warehouse.alerts > 0 ? "needs attention" : "all clear",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border/40 bg-muted/15 p-2.5 stat-card-hover wh-stat-card-hover"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={cn("flex size-6 items-center justify-center rounded", stat.tint)}>
                    {stat.icon}
                  </div>
                  {stat.trend === "up" ? (
                    <TrendingUp className="size-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="size-3 text-red-500" />
                  )}
                </div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-base font-bold text-number leading-tight text-foreground">{stat.value}</p>
                  <span className={cn(
                    "text-[9px] font-medium",
                    stat.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {stat.trendVal}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── 7-Day Throughput Chart ─────────────────────────────────────── */}
          <Card className="card-depth rounded-xl border-border/60 shadow-sm card-accent-blue">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="size-4 text-blue-500" />
                  7-Day Throughput
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">Daily</Badge>
              </div>
              <CardDescription className="text-xs">Daily inbound vs outbound volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={throughputChartConfig} className="h-[180px] w-full">
                <AreaChart data={throughput}>
                  <defs>
                    <linearGradient id="whDrawerIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="whDrawerOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area type="monotone" dataKey="inbound" stroke="var(--color-inbound)" fill="url(#whDrawerIn)" strokeWidth={2} />
                  <Area type="monotone" dataKey="outbound" stroke="var(--color-outbound)" fill="url(#whDrawerOut)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* ── Zone Utilization ──────────────────────────────────────────── */}
          <Card className="card-depth rounded-xl border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Boxes className="size-4 text-violet-500" />
                  Zone Utilization
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">{zones.length} zones</Badge>
              </div>
              <CardDescription className="text-xs">Capacity utilization by storage zone</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2.5">
              {zones.map((zone, idx) => {
                const zc = getCapacityColor(zone.used)
                return (
                  <div
                    key={zone.name}
                    className="rounded-lg border border-border/40 bg-muted/15 p-2.5 stat-card-hover wh-stat-card-hover zone-card-enter"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-semibold text-foreground">{zone.name}</span>
                      <span className={cn("text-[10px] font-bold tabular-nums", zc.text)}>{zone.used}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", zc.bar)}
                        style={{ width: `${zone.used}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[9px] text-muted-foreground tabular-nums">
                      {Math.round((zone.capacity * zone.used) / 100).toLocaleString("en-IN")} / {zone.capacity.toLocaleString("en-IN")} units
                    </p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* ── Today's Activity Timeline ─────────────────────────────────── */}
          <Card className="card-depth rounded-xl border-border/60 shadow-sm card-accent-green">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="size-4 text-emerald-500" />
                  Today's Activity
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">Live feed</Badge>
              </div>
              <CardDescription className="text-xs">Recent warehouse operations and events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 movement-row-in"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/60">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-tight">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="size-2.5" />
                      {item.timeAgo}
                    </p>
                  </div>
                  <div className={cn("mt-1 size-2 shrink-0 rounded-full status-dot-pulse wh-activity-dot", item.dotColor)} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ── Recent Shipments ──────────────────────────────────────────── */}
          <Card className="card-depth rounded-xl border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Truck className="size-4 text-blue-500" />
                  Recent Shipments
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">Last 5</Badge>
              </div>
              <CardDescription className="text-xs">Latest inbound and outbound movements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentShipments.map((shipment, idx) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between rounded-lg border border-border/40 p-2.5 transition-colors hover:bg-muted/40 shipment-row-hover movement-row-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg",
                      shipment.type === "Inbound"
                        ? "bg-blue-50 dark:bg-blue-950/50"
                        : "bg-emerald-50 dark:bg-emerald-950/50"
                    )}>
                      {shipment.type === "Inbound"
                        ? <Package className="size-3.5 text-blue-600 dark:text-blue-400" />
                        : <Truck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      }
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-mono font-semibold text-foreground">{shipment.id}</p>
                        <span className="text-[9px] text-muted-foreground">·</span>
                        <p className="text-[10px] text-muted-foreground truncate">{shipment.items} items</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {shipment.type === "Inbound" ? "From " : "To "}{shipment.partner}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0", shipmentStatusStyles[shipment.status])}>
                      {shipment.status}
                    </Badge>
                    <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="size-2" />
                      {shipment.timeAgo}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Footer Actions ─────────────────────────────────────────────── */}
        <Separator />
        <div className="sticky bottom-0 z-10 flex items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-6 py-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs flex-1"
            onClick={handleRefresh}
          >
            <RefreshCw className="size-3.5" />
            Refresh Data
          </Button>
          <Button
            size="sm"
            className={cn(
              "h-9 gap-1.5 text-xs flex-1",
              isCritical && "bg-red-600 hover:bg-red-700 reorder-urgent-glow"
            )}
            onClick={handleViewOnMap}
          >
            <MapIcon className="size-3.5" />
            View on Map
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
