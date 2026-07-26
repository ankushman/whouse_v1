"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Warehouse,
  MapPin,
  Navigation,
  Truck,
  Package,
  Users,
  Wrench,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Download,
  Phone,
  Mail,
  Building,
  Gauge,
  Zap,
  Boxes,
  Route,
  Calendar,
  Thermometer,
  Snowflake,
  Flame,
  Wind,
  ShieldCheck,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ── Types ────────────────────────────────────────────────────────────────────

export interface WarehouseMapDetail {
  id: string
  name: string
  city: string
  state: string
  managerName?: string
  managerAvatar?: string
  capacity: number
  capacityUsed?: number
  inventoryAccuracy?: number
  forkliftCount?: number
  forkliftActive?: number
  todayOrders?: number
  pendingTasks?: number
  healthScore?: number
  status: "green" | "amber" | "red"
  alerts?: number
}

interface WarehouseMapDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: WarehouseMapDetail | null
}

// ── Status theming ───────────────────────────────────────────────────────────

const statusTheme = {
  green: {
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/40",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(16,185,129,0.4)]",
    label: "Healthy",
    pieColor: "#10B981",
  },
  amber: {
    gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    border: "border-amber-500/40",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(245,158,11,0.4)]",
    label: "Warning",
    pieColor: "#F59E0B",
  },
  red: {
    gradient: "from-red-500/15 via-red-500/5 to-transparent",
    border: "border-red-500/40",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(239,68,68,0.4)]",
    label: "Critical",
    pieColor: "#EF4444",
  },
} as const

// ── Deterministic helpers ────────────────────────────────────────────────────

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// ── Geographic info ──────────────────────────────────────────────────────────

interface GeoInfo {
  lat: number
  lng: number
  timezone: string
  elevation: number
  climate: "tropical" | "subtropical" | "arid" | "humid"
  nearestHighway: string
  nearestAirport: string
  nearestPort: string
  catchmentArea: string
}

function getGeoInfo(wh: WarehouseMapDetail): GeoInfo {
  const seed = hashStr(wh.id)
  const cityGeo: Record<string, GeoInfo> = {
    Chennai: { lat: 13.0827, lng: 80.2707, timezone: "IST (UTC+5:30)", elevation: 6, climate: "tropical", nearestHighway: "NH-48 (Chennai-Bangalore)", nearestAirport: "Chennai Intl (MAA) — 18 km", nearestPort: "Chennai Port — 12 km", catchmentArea: "Tamil Nadu, South AP" },
    Pune: { lat: 18.5204, lng: 73.8567, timezone: "IST (UTC+5:30)", elevation: 560, climate: "subtropical", nearestHighway: "NH-48 (Mumbai-Pune)", nearestAirport: "Pune Intl (PNQ) — 12 km", nearestPort: "JNPT Port — 145 km", catchmentArea: "Maharashtra, North Karnataka" },
    Mumbai: { lat: 19.0760, lng: 72.8777, timezone: "IST (UTC+5:30)", elevation: 14, climate: "humid", nearestHighway: "NH-48 (Mumbai-Delhi)", nearestAirport: "Mumbai Intl (BOM) — 8 km", nearestPort: "JNPT Port — 35 km", catchmentArea: "Maharashtra, Gujarat" },
    Gurugram: { lat: 28.4595, lng: 77.0266, timezone: "IST (UTC+5:30)", elevation: 217, climate: "subtropical", nearestHighway: "NH-48 (Delhi-Jaipur)", nearestAirport: "IGI Airport (DEL) — 18 km", nearestPort: "Mundra Port — 1,180 km", catchmentArea: "NCR, Haryana, North RJ" },
    Kolkata: { lat: 22.5726, lng: 88.3639, timezone: "IST (UTC+5:30)", elevation: 9, climate: "humid", nearestHighway: "NH-16 (Kolkata-Chennai)", nearestAirport: "Netaji Subhas Int'l (CCU) — 12 km", nearestPort: "Kolkata Port — 22 km", catchmentArea: "West Bengal, Odisha, NE states" },
    Hosur: { lat: 12.7409, lng: 77.8253, timezone: "IST (UTC+5:30)", elevation: 900, climate: "tropical", nearestHighway: "NH-44 (Hosur-Bangalore)", nearestAirport: "Kempegowda Intl (BLR) — 65 km", nearestPort: "Chennai Port — 280 km", catchmentArea: "Tamil Nadu, South KA" },
    "Sanand": { lat: 22.9987, lng: 72.3855, timezone: "IST (UTC+5:30)", elevation: 39, climate: "arid", nearestHighway: "NH-47 (Ahmedabad-Rajkot)", nearestAirport: "Sardar Vallabhbhai Patel Intl (AMD) — 35 km", nearestPort: "Mundra Port — 285 km", catchmentArea: "Gujarat" },
    Bangalore: { lat: 12.9716, lng: 77.5946, timezone: "IST (UTC+5:30)", elevation: 920, climate: "tropical", nearestHighway: "NH-44 (Bangalore-Hosur)", nearestAirport: "Kempegowda Intl (BLR) — 35 km", nearestPort: "Chennai Port — 350 km", catchmentArea: "Karnataka, South AP" },
  }
  return cityGeo[wh.city] ?? {
    lat: 20.5937 + (seed % 10),
    lng: 78.9629 - (seed % 12),
    timezone: "IST (UTC+5:30)",
    elevation: 200 + (seed % 600),
    climate: "tropical",
    nearestHighway: "NH-44",
    nearestAirport: "Nearest intl airport — 50 km",
    nearestPort: "Nearest port — 200 km",
    catchmentArea: "Regional catchment",
  }
}

// ── Capacity trend ───────────────────────────────────────────────────────────

interface CapacityPoint {
  day: string
  used: number
  total: number
  threshold: number
}

function getCapacityTrend(wh: WarehouseMapDetail): CapacityPoint[] {
  const seed = hashStr(wh.id)
  const points: CapacityPoint[] = []
  const total = wh.capacity
  const currentUsed = wh.capacityUsed ?? Math.round(wh.capacity * 0.7)
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const label = `${d.getDate()}/${d.getMonth() + 1}`
    const weekend = d.getDay() === 0 || d.getDay() === 6
    const variance = ((seed >> (i % 16)) & 0x7) - 3
    const factor = weekend ? 0.85 : 1.0
    const used = Math.max(40, Math.min(98, Math.round((currentUsed - i * 1.2) * factor + variance)))
    points.push({
      day: label,
      used,
      total,
      threshold: 90,
    })
  }
  return points
}

// ── Zone breakdown ───────────────────────────────────────────────────────────

interface ZoneInfo {
  name: string
  utilization: number
  skus: number
  picker: string
  climate: "ambient" | "cold" | "frozen" | "hazardous"
}

function getZones(wh: WarehouseMapDetail): ZoneInfo[] {
  const seed = hashStr(wh.id)
  const pickers = ["Rajesh K.", "Priya S.", "Amit P.", "Suresh R.", "Deepak N.", "Vikram S."]
  return [
    { name: "Zone A — Fast Movers", utilization: 92 + (seed % 6), skus: 240 + (seed % 50), picker: pickers[seed % pickers.length], climate: "ambient" },
    { name: "Zone B — Medium Velocity", utilization: 68 + (seed % 10), skus: 580 + (seed % 100), picker: pickers[(seed + 1) % pickers.length], climate: "ambient" },
    { name: "Zone C — Slow Movers", utilization: 45 + (seed % 15), skus: 1240 + (seed % 200), picker: pickers[(seed + 2) % pickers.length], climate: "ambient" },
    { name: "Zone D — Cold Storage", utilization: 78 + (seed % 8), skus: 180 + (seed % 40), picker: "Auto-stow", climate: "cold" },
    { name: "Zone E — Frozen", utilization: 65 + (seed % 12), skus: 95 + (seed % 25), picker: "Auto-stow", climate: "frozen" },
    { name: "Zone F — Hazmat", utilization: 32 + (seed % 10), skus: 48 + (seed % 15), picker: pickers[(seed + 3) % pickers.length], climate: "hazardous" },
  ]
}

// ── Inbound/outbound flows ───────────────────────────────────────────────────

interface FlowData {
  direction: "Inbound" | "Outbound"
  mode: "Road" | "Rail" | "Air" | "Sea"
  count: number
  avgValue: string
  topOrigin: string
}

function getFlows(wh: WarehouseMapDetail): FlowData[] {
  const seed = hashStr(wh.id)
  return [
    { direction: "Inbound", mode: "Road", count: 42 + (seed % 15), avgValue: `₹${(2 + (seed % 4)).toFixed(1)}L`, topOrigin: "Pune Supplier Hub" },
    { direction: "Inbound", mode: "Rail", count: 8 + (seed % 5), avgValue: `₹${(8 + (seed % 6)).toFixed(1)}L`, topOrigin: "Mundra Port" },
    { direction: "Outbound", mode: "Road", count: 58 + (seed % 18), avgValue: `₹${(1.5 + (seed % 3)).toFixed(1)}L`, topOrigin: wh.city },
    { direction: "Outbound", mode: "Air", count: 4 + (seed % 3), avgValue: `₹${(12 + (seed % 8)).toFixed(1)}L`, topOrigin: wh.city },
  ]
}

// ── Live metrics ─────────────────────────────────────────────────────────────

interface LiveMetric {
  label: string
  value: string
  unit: string
  trend: "up" | "down" | "stable"
  delta: string
  icon: typeof Activity
  severity: "good" | "warning" | "critical"
}

function getLiveMetrics(wh: WarehouseMapDetail): LiveMetric[] {
  const seed = hashStr(wh.id)
  const isCritical = wh.status === "red"
  const isWarning = wh.status === "amber"

  return [
    {
      label: "Throughput (last 1h)",
      value: String(120 + (seed % 60)),
      unit: "units",
      trend: "up",
      delta: "+12%",
      icon: Activity,
      severity: "good",
    },
    {
      label: "Pick Rate",
      value: String(45 + (seed % 20)),
      unit: "picks/hr",
      trend: (seed & 0x1) ? "up" : "down",
      delta: (seed & 0x1) ? "+5%" : "-3%",
      icon: Zap,
      severity: isCritical ? "warning" : "good",
    },
    {
      label: "Inventory Accuracy",
      value: `${wh.inventoryAccuracy ?? 96 + (seed % 4)}`,
      unit: "%",
      trend: "stable",
      delta: "+0.2%",
      icon: Package,
      severity: isCritical ? "critical" : "good",
    },
    {
      label: "Open Tasks",
      value: String(wh.pendingTasks ?? 12 + (seed % 8)),
      unit: "tasks",
      trend: "down",
      delta: "-3",
      icon: CheckCircle2,
      severity: isCritical ? "warning" : "good",
    },
    {
      label: "Equipment Online",
      value: `${wh.forkliftActive ?? 6 + (seed % 4)}/${wh.forkliftCount ?? 8 + (seed % 4)}`,
      unit: "units",
      trend: "stable",
      delta: "0",
      icon: Wrench,
      severity: "good",
    },
    {
      label: "Energy Today",
      value: String(420 + (seed % 80)),
      unit: "kWh",
      trend: (seed & 0x1) ? "up" : "down",
      delta: (seed & 0x1) ? "+4%" : "-2%",
      icon: Zap,
      severity: (seed & 0x1) ? "warning" : "good",
    },
  ]
}

// ── Active routes ────────────────────────────────────────────────────────────

interface RouteInfo {
  id: string
  destination: string
  distance: string
  eta: string
  vehicle: string
  status: "in-transit" | "loading" | "delayed"
  progress: number
}

function getActiveRoutes(wh: WarehouseMapDetail): RouteInfo[] {
  const seed = hashStr(wh.id)
  const destinations = ["Bangalore", "Hyderabad", "Coimbatore", "Mumbai", "Delhi", "Kolkata", "Pune"]
  return Array.from({ length: 3 + (seed % 3) }, (_, i) => {
    const isDelayed = i === 0 && wh.status !== "green"
    return {
      id: `RT-${2024}-${String(100 + (seed % 100) + i).padStart(3, "0")}`,
      destination: destinations[(seed + i) % destinations.length],
      distance: `${120 + (seed % 800) + i * 50} km`,
      eta: `${2 + (i * 2)}h ${15 + (seed % 30)}m`,
      vehicle: `TN-09-${["AB", "CD", "XY"][i % 3]}-${1000 + (seed % 9000)}`,
      status: isDelayed ? "delayed" : i % 3 === 0 ? "loading" : "in-transit",
      progress: isDelayed ? 35 : 40 + (i * 18) + (seed % 10),
    }
  })
}

// ── Component ────────────────────────────────────────────────────────────────

const climateIcon = {
  ambient: Building,
  cold: Snowflake,
  frozen: Snowflake,
  hazardous: Flame,
} as const

const climateColor = {
  ambient: "text-slate-600 dark:text-slate-400 bg-slate-500/10",
  cold: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  frozen: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
  hazardous: "text-red-600 dark:text-red-400 bg-red-500/10",
} as const

const flowStatusColor = {
  "in-transit": "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  loading: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  delayed: "text-red-600 dark:text-red-400 bg-red-500/10",
} as const

const severityText = {
  good: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  critical: "text-red-600 dark:text-red-400",
} as const

const chartConfig: ChartConfig = {
  used: { label: "Used", color: "#2563EB" },
  threshold: { label: "Threshold", color: "#EF4444" },
}

export function WarehouseMapDetailDrawer({
  open,
  onOpenChange,
  warehouse,
}: WarehouseMapDetailDrawerProps) {
  const { toast } = useToast()

  const theme = warehouse ? statusTheme[warehouse.status] : statusTheme.green

  const geo = React.useMemo(() => (warehouse ? getGeoInfo(warehouse) : null), [warehouse])
  const capacityTrend = React.useMemo(() => (warehouse ? getCapacityTrend(warehouse) : []), [warehouse])
  const zones = React.useMemo(() => (warehouse ? getZones(warehouse) : []), [warehouse])
  const flows = React.useMemo(() => (warehouse ? getFlows(warehouse) : []), [warehouse])
  const liveMetrics = React.useMemo(() => (warehouse ? getLiveMetrics(warehouse) : []), [warehouse])
  const routes = React.useMemo(() => (warehouse ? getActiveRoutes(warehouse) : []), [warehouse])

  if (!warehouse) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto" />
      </Sheet>
    )
  }

  const occupancyPct = warehouse.capacityUsed
    ? Math.round((warehouse.capacityUsed / warehouse.capacity) * 100)
    : 70

  const handleExport = () => {
    const csv = [
      `Warehouse Network Report - ${warehouse.name}`,
      `City,${warehouse.city}`,
      `State,${warehouse.state}`,
      `Status,${theme.label}`,
      `Capacity,${warehouse.capacity}`,
      `Capacity Used,${warehouse.capacityUsed ?? "—"} (${occupancyPct}%)`,
      `Health Score,${warehouse.healthScore ?? "—"}%`,
      `Inventory Accuracy,${warehouse.inventoryAccuracy ?? "—"}%`,
      `Active Alerts,${warehouse.alerts ?? 0}`,
      `Manager,${warehouse.managerName ?? "—"}`,
      ``,
      `Geographic Info:`,
      `Lat/Lng,${geo?.lat}, ${geo?.lng}`,
      `Timezone,${geo?.timezone}`,
      `Elevation,${geo?.elevation}m`,
      `Climate,${geo?.climate}`,
      `Nearest Highway,${geo?.nearestHighway}`,
      `Nearest Airport,${geo?.nearestAirport}`,
      `Nearest Port,${geo?.nearestPort}`,
      ``,
      `Zone Breakdown:`,
      ...zones.map((z) => `${z.name}: ${z.utilization}% utilized, ${z.skus} SKUs, Climate: ${z.climate}, Picker: ${z.picker}`),
      ``,
      `Active Routes:`,
      ...routes.map((r) => `${r.id} → ${r.destination} (${r.distance}, ETA ${r.eta}, ${r.vehicle}, ${r.status}, ${r.progress}%)`),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `warehouse-${warehouse.id}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Report exported", `warehouse-${warehouse.id}.csv`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header */}
        <div className={cn(
          "whmap-drawer-header relative overflow-hidden bg-gradient-to-br border-b",
          theme.gradient,
          theme.border,
          theme.glow
        )}>
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          </div>
          <SheetHeader className="p-5 pb-4 relative">
            <div className="flex items-start gap-3">
              <div className={cn(
                "whmap-icon-pulse size-11 rounded-xl flex items-center justify-center shrink-0",
                theme.bg,
                theme.text
              )}>
                <Warehouse className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider font-bold", theme.text, theme.border)}>
                    {theme.label}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    <MapPin className="size-2.5 mr-1" />
                    {warehouse.id}
                  </Badge>
                </div>
                <SheetTitle className="text-lg font-bold leading-tight">
                  {warehouse.name}
                </SheetTitle>
                <SheetDescription className="text-xs mt-0.5 flex items-center gap-2">
                  <MapPin className="size-3" />
                  {warehouse.city}, {warehouse.state} · {geo?.lat.toFixed(4)}, {geo?.lng.toFixed(4)}
                </SheetDescription>
              </div>
            </div>

            {/* Hero metrics */}
            <div className="whmap-stat-enter grid grid-cols-4 gap-2 mt-4">
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Capacity</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", occupancyPct > 90 ? "text-red-600 dark:text-red-400" : occupancyPct > 75 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                  {occupancyPct}%
                </p>
                <p className="text-[9px] text-muted-foreground">{warehouse.capacityUsed ?? "—"} / {warehouse.capacity}</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Health</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", (warehouse.healthScore ?? 80) >= 80 ? "text-emerald-600 dark:text-emerald-400" : (warehouse.healthScore ?? 80) >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                  {warehouse.healthScore ?? "—"}%
                </p>
                <p className="text-[9px] text-muted-foreground">score</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Today Orders</p>
                <p className="text-sm font-bold text-number tabular-nums">{warehouse.todayOrders ?? "—"}</p>
                <p className="text-[9px] text-muted-foreground">processed</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Alerts</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", (warehouse.alerts ?? 0) > 5 ? "text-red-600 dark:text-red-400" : (warehouse.alerts ?? 0) > 2 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                  {warehouse.alerts ?? 0}
                </p>
                <p className="text-[9px] text-muted-foreground">active</p>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="whmap-drawer-body-enter p-5 space-y-5">
          {/* Geographic info */}
          {geo && (
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Navigation className="size-3.5 text-muted-foreground" />
                Geographic & Logistics Info
              </h3>
              <Card className="border-border/40">
                <CardContent className="p-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Coordinates</p>
                    <p className="text-xs font-mono font-semibold">{geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Timezone</p>
                    <p className="text-xs font-medium">{geo.timezone}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Elevation</p>
                    <p className="text-xs font-medium">{geo.elevation}m above MSL</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Climate</p>
                    <p className="text-xs font-medium capitalize">{geo.climate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Nearest Highway</p>
                    <p className="text-xs font-medium">{geo.nearestHighway}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Nearest Airport</p>
                    <p className="text-xs font-medium">{geo.nearestAirport}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Nearest Port</p>
                    <p className="text-xs font-medium">{geo.nearestPort}</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-border/30">
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Catchment Area</p>
                    <p className="text-xs font-medium">{geo.catchmentArea}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Live metrics grid */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Activity className="size-3.5 text-muted-foreground" />
              Live Operational Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {liveMetrics.map((m, i) => {
                const MIcon = m.icon
                return (
                  <div
                    key={m.label}
                    className="whmap-card-enter rounded-lg border border-border/40 bg-background/60 p-2.5"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className={cn("size-6 rounded-md flex items-center justify-center shrink-0", m.severity === "good" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : m.severity === "warning" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-red-500/10 text-red-600 dark:text-red-400")}>
                        <MIcon className="size-3" />
                      </div>
                      <span className={cn("text-[10px] font-medium flex items-center gap-0.5", m.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : m.trend === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                        {m.trend === "up" ? <ArrowUpRight className="size-2.5" /> : m.trend === "down" ? <ArrowDownRight className="size-2.5" /> : null}
                        {m.delta}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{m.label}</p>
                    <p className={cn("text-sm font-bold text-number tabular-nums", severityText[m.severity])}>
                      {m.value} <span className="text-[10px] text-muted-foreground font-normal">{m.unit}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 14-day capacity trend */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Gauge className="size-3.5 text-muted-foreground" />
                14-Day Capacity Trend
              </h3>
              <Badge variant="outline" className="text-[9px]">{occupancyPct}% current</Badge>
            </div>
            <Card className="border-border/40">
              <CardContent className="p-3">
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                  <AreaChart data={capacityTrend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="day" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
                    <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ReferenceLine y={90} stroke="#EF4444" strokeDasharray="4 2" strokeWidth={1} />
                    <Area type="monotone" dataKey="used" stroke="#2563EB" strokeWidth={2} fill="url(#capGrad)" />
                  </AreaChart>
                </ChartContainer>
                <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-blue-500" /> Capacity used %</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-red-500" /> 90% threshold</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone breakdown */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Boxes className="size-3.5 text-muted-foreground" />
              Storage Zones
            </h3>
            <div className="space-y-1.5">
              {zones.map((z, i) => {
                const ZIcon = climateIcon[z.climate]
                return (
                  <div
                    key={z.name}
                    className="whmap-card-enter flex items-center gap-3 rounded-lg border border-border/40 bg-background/60 px-3 py-2"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className={cn("size-7 rounded-md flex items-center justify-center shrink-0", climateColor[z.climate])}>
                      <ZIcon className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{z.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {z.skus} SKUs · Picker: {z.picker}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Progress value={z.utilization} className="h-1 w-12" />
                      <span className={cn(
                        "text-xs font-bold text-number tabular-nums w-9 text-right",
                        z.utilization > 90 ? "text-red-600 dark:text-red-400" : z.utilization > 75 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                      )}>
                        {z.utilization}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Inbound/outbound flows */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Route className="size-3.5 text-muted-foreground" />
              Inbound / Outbound Flows (24h)
            </h3>
            <Card className="border-border/40">
              <CardContent className="p-3">
                <ChartContainer config={chartConfig} className="h-[140px] w-full">
                  <BarChart data={flows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="direction" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]} barSize={20}>
                      {flows.map((f, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={f.direction === "Inbound" ? "#3B82F6" : "#10B981"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <div className="space-y-1.5 mt-3">
                  {flows.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1.5">
                        <span className={cn("size-2 rounded-sm", f.direction === "Inbound" ? "bg-blue-500" : "bg-emerald-500")} />
                        <span className="font-medium">{f.direction}</span>
                        <span className="text-muted-foreground">· {f.mode}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{f.count} shipments</span>
                        <span className="font-semibold text-number">{f.avgValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active routes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Truck className="size-3.5 text-muted-foreground" />
                Active Outbound Routes
              </h3>
              <Badge variant="outline" className="text-[9px]">{routes.length} in transit</Badge>
            </div>
            <div className="space-y-1.5">
              {routes.map((r, i) => (
                <div
                  key={r.id}
                  className="whmap-card-enter flex items-center gap-2.5 rounded-lg border border-border/40 bg-background/60 px-3 py-2"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex size-7 rounded-md bg-muted/40 items-center justify-center shrink-0">
                    <Truck className="size-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono font-semibold shrink-0">{r.id}</p>
                      <Badge variant="outline" className={cn("text-[9px] uppercase shrink-0", flowStatusColor[r.status])}>
                        {r.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                      → {r.destination} · {r.distance} · ETA {r.eta} · {r.vehicle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={r.progress} className="h-1 flex-1" />
                      <span className="text-[9px] text-muted-foreground shrink-0 tabular-nums">{r.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="flex items-center gap-2 pb-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={handleExport}>
              <Download className="size-3.5" />
              Export Report
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={() => {
              toast.success("Opened in maps", `${warehouse.name} location opened in Google Maps`)
            }}>
              <Navigation className="size-3.5" />
              View in Maps
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8 ml-auto" onClick={() => {
              toast.info("Calling manager", `Dialing ${warehouse.managerName ?? "warehouse manager"}…`)
            }}>
              <Phone className="size-3.5" />
              Call Manager
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
