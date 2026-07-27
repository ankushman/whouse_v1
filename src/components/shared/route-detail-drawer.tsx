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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"
import {
  MapPin,
  Clock,
  Route,
  Truck,
  Fuel,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Navigation,
  Gauge,
  Thermometer,
  Wrench,
  User,
  Phone,
  Calendar,
  Package,
  AlertTriangle,
  Info,
  Boxes,
  Eye,
  Download,
  Share2,
  ChevronRight,
  Star,
  Weight,
  Map as MapIcon,
  RefreshCw,
  Play,
  Settings,
  Flame,
  Snowflake,
  Shield,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RouteStatus = "optimized" | "in-transit" | "delayed" | "completed"

export interface RouteDetail {
  id: string
  origin: string
  destination: string
  stops: number
  estTime: string
  distance: string
  status: RouteStatus
  progress: number
  vehicle: string
}

export interface RouteDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  route: RouteDetail | null
  onOptimize?: (route: RouteDetail) => void
  onShare?: (route: RouteDetail) => void
}

// ---------------------------------------------------------------------------
// Status configs
// ---------------------------------------------------------------------------

const statusConfig: Record<
  RouteStatus,
  {
    gradient: string
    border: string
    iconBg: string
    iconColor: string
    label: string
    accent: string
    barColor: string
    pulse?: boolean
  }
> = {
  optimized: {
    gradient: "from-emerald-500 via-emerald-600 to-teal-700",
    border: "border-emerald-500/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/70",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "Optimized",
    accent: "emerald",
    barColor: "#10b981",
  },
  "in-transit": {
    gradient: "from-blue-500 via-blue-600 to-indigo-700",
    border: "border-blue-500/40",
    iconBg: "bg-blue-100 dark:bg-blue-950/70",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "In Transit",
    accent: "blue",
    barColor: "#3b82f6",
    pulse: true,
  },
  delayed: {
    gradient: "from-red-500 via-red-600 to-rose-700",
    border: "border-red-500/40",
    iconBg: "bg-red-100 dark:bg-red-950/70",
    iconColor: "text-red-600 dark:text-red-400",
    label: "Delayed",
    accent: "red",
    barColor: "#ef4444",
  },
  completed: {
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    border: "border-slate-500/40",
    iconBg: "bg-slate-100 dark:bg-slate-900/70",
    iconColor: "text-slate-600 dark:text-slate-400",
    label: "Completed",
    accent: "slate",
    barColor: "#64748b",
  },
}

// ---------------------------------------------------------------------------
// Deterministic mock data generators
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function pick<T>(arr: T[], seed: number, offset: number): T {
  return arr[(seed + offset) % arr.length]
}

interface RouteStop {
  id: string
  name: string
  type: "pickup" | "hub" | "delivery" | "warehouse" | "checkpoint"
  sequence: number
  status: "completed" | "current" | "pending" | "delayed"
  arrivalTime: string
  departureTime: string
  distanceFromPrev: string
  durationAtStop: string
  contact?: string
}

interface TelemetryMetric {
  label: string
  value: string
  unit: string
  target: string
  pct: number
  trend: "up" | "down" | "flat"
  delta: string
  severity: "good" | "warning" | "critical"
}

interface DriverInfo {
  name: string
  license: string
  rating: number
  experience: string
  todayHours: number
  weekHours: number
  phone: string
  avatarColor: string
}

interface TripEvent {
  id: string
  timestamp: string
  type: "departure" | "arrival" | "checkpoint" | "incident" | "rest" | "fuel"
  detail: string
  location?: string
}

interface CargoItem {
  id: string
  sku: string
  description: string
  quantity: number
  weight: string
  type: "standard" | "fragile" | "hazardous" | "cold-chain"
  destination: string
}

interface HourlyMetric {
  hour: string
  speed: number
  fuel: number
  distance: number
}

function generateRouteStops(route: RouteDetail): RouteStop[] {
  const seed = hashStr(route.id)
  const stopNames = [
    route.origin,
    `${route.origin.split(" ")[0]} Hub`,
    "Highway Checkpoint",
    "Regional Distribution Center",
    route.destination,
  ]
  // Pad with extra stops if route.stops > 5
  const extraStops = ["Transit Hub", "Cross-Dock Facility", "Fuel Station", "Toll Plaza"]
  while (stopNames.length < Math.max(5, route.stops + 2)) {
    stopNames.splice(stopNames.length - 1, 0, pick(extraStops, seed, stopNames.length))
  }

  const stops: RouteStop[] = []
  const now = Date.now()
  const totalProgress = route.progress / 100

  for (let i = 0; i < stopNames.length; i++) {
    const stopProgress = (i + 1) / stopNames.length
    let status: RouteStop["status"]
    if (route.status === "completed") {
      status = "completed"
    } else if (route.status === "optimized") {
      status = "pending"
    } else if (stopProgress <= totalProgress - 0.1) {
      status = "completed"
    } else if (stopProgress <= totalProgress + 0.1) {
      status = "current"
    } else if (route.status === "delayed" && stopProgress <= totalProgress + 0.2) {
      status = "delayed"
    } else {
      status = "pending"
    }

    const arrivalTime = new Date(now - (4 - i) * 60 * 60 * 1000 + i * 30 * 60000)
    const distanceKm = 30 + ((seed >> i) & 0x3F)
    const drivers = ["Anil Kumar", "Rajesh Singh", "Vikram Reddy", "Suresh Patil"]
    stops.push({
      id: `stop-${i}`,
      name: stopNames[i],
      type: i === 0 ? "pickup" : i === stopNames.length - 1 ? "delivery" : i % 2 === 0 ? "warehouse" : "hub",
      sequence: i + 1,
      status,
      arrivalTime: arrivalTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
      departureTime: new Date(arrivalTime.getTime() + 20 * 60000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
      distanceFromPrev: i === 0 ? "0 km" : `${distanceKm} km`,
      durationAtStop: i === 0 || i === stopNames.length - 1 ? "30 min" : `${10 + ((seed >> i) & 7)} min`,
      contact: pick(drivers, seed, i),
    })
  }
  return stops
}

function generateTelemetry(route: RouteDetail): TelemetryMetric[] {
  const seed = hashStr(route.id)
  const isActive = route.status === "in-transit" || route.status === "delayed"
  return [
    {
      label: "Avg Speed",
      value: `${isActive ? 48 + (seed % 22) : 0}`,
      unit: "km/h",
      target: "55 km/h",
      pct: isActive ? Math.round(((48 + (seed % 22)) / 55) * 100) : 0,
      trend: route.status === "delayed" ? "down" : "up",
      delta: route.status === "delayed" ? "-8" : "+3",
      severity: route.status === "delayed" ? "warning" : "good",
    },
    {
      label: "Fuel Efficiency",
      value: `${isActive ? 7.2 + (seed % 3) : 0}`,
      unit: "km/L",
      target: "8.5 km/L",
      pct: isActive ? Math.round(((7.2 + (seed % 3)) / 8.5) * 100) : 0,
      trend: "down",
      delta: "-0.4",
      severity: "warning",
    },
    {
      label: "Engine Temp",
      value: `${isActive ? 88 + (seed % 12) : 0}`,
      unit: "°C",
      target: "< 95°C",
      pct: isActive ? Math.round(((88 + (seed % 12)) / 110) * 100) : 0,
      trend: "up",
      delta: "+2",
      severity: isActive && (88 + (seed % 12)) > 95 ? "critical" : "good",
    },
    {
      label: "Tire Pressure",
      value: `${108 + (seed % 8)}`,
      unit: "PSI",
      target: "110 PSI",
      pct: Math.round(((108 + (seed % 8)) / 120) * 100),
      trend: "flat",
      delta: "0",
      severity: "good",
    },
  ]
}

function generateDriverInfo(route: RouteDetail): DriverInfo {
  const seed = hashStr(route.id)
  const names = [
    "Ramesh Kumar", "Suresh Patil", "Arun Murugan", "Venkat Rao",
    "Rajesh Patel", "Karthik Devan", "Vikram Singh", "Harpreet Kaur",
  ]
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ]
  return {
    name: pick(names, seed, 0),
    license: `DL-${String(100000 + (seed % 900000)).slice(0, 6)}`,
    rating: 4.2 + (seed % 8) / 10,
    experience: `${3 + (seed % 12)} years`,
    todayHours: 6 + (seed % 5),
    weekHours: 38 + (seed % 20),
    phone: `+91 ${98000 + (seed % 19999)} ${String(10000 + (seed % 89999)).slice(0, 5)}`,
    avatarColor: pick(colors, seed, 1),
  }
}

function generateTripEvents(route: RouteDetail): TripEvent[] {
  const seed = hashStr(route.id)
  const events: TripEvent[] = []
  const now = Date.now()

  if (route.status === "completed") {
    // Show full timeline
    const types: TripEvent["type"][] = ["departure", "checkpoint", "rest", "fuel", "checkpoint", "arrival"]
    for (let i = 0; i < 6; i++) {
      const hoursAgo = (6 - i) * 1.5
      events.push({
        id: `evt-${i}`,
        timestamp: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString(),
        type: types[i],
        detail: types[i] === "departure"
          ? `Departed from origin: ${route.origin}`
          : types[i] === "arrival"
          ? `Arrived at destination: ${route.destination}`
          : types[i] === "fuel"
          ? `Refueled 45L at ₹${92 + (seed % 10)}/L`
          : types[i] === "rest"
          ? "Mandatory 30-min rest break"
          : `Crossed checkpoint: ${pick(["NH-48 Toll", "State Border", "Highway Junction"], seed, i)}`,
        location: pick([route.origin, "Midway", route.destination], seed, i),
      })
    }
  } else if (route.status === "in-transit") {
    const types: TripEvent["type"][] = ["departure", "checkpoint", "fuel", "checkpoint"]
    for (let i = 0; i < 4; i++) {
      const hoursAgo = (4 - i) * 1.5
      events.push({
        id: `evt-${i}`,
        timestamp: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString(),
        type: types[i],
        detail: types[i] === "departure"
          ? `Departed from origin: ${route.origin}`
          : types[i] === "fuel"
          ? `Refueled 45L at ₹${92 + (seed % 10)}/L`
          : `Crossed checkpoint: ${pick(["NH-48 Toll", "State Border", "Highway Junction"], seed, i)}`,
        location: pick([route.origin, "Midway", "Approaching Destination"], seed, i),
      })
    }
  } else if (route.status === "delayed") {
    events.push({
      id: "evt-0",
      timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      type: "departure",
      detail: `Departed from origin: ${route.origin}`,
      location: route.origin,
    })
    events.push({
      id: "evt-1",
      timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      type: "checkpoint",
      detail: "Crossed midway checkpoint",
      location: "Midway",
    })
    events.push({
      id: "evt-2",
      timestamp: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
      type: "incident",
      detail: `Delay reported: ${pick(["Roadblock", "Traffic congestion", "Weather condition", "Breakdown"], seed, 0)}`,
      location: "Midway",
    })
  } else {
    // optimized — only scheduled events
    events.push({
      id: "evt-0",
      timestamp: new Date(now + 1 * 60 * 60 * 1000).toISOString(),
      type: "departure",
      detail: `Scheduled departure from ${route.origin}`,
      location: route.origin,
    })
  }
  return events
}

function generateCargo(route: RouteDetail): CargoItem[] {
  const seed = hashStr(route.id)
  const skus = [
    { sku: "SKU-BP-4421", desc: "Brake Pad Set - Front" },
    { sku: "SKU-FG-2208", desc: "Filter Assembly" },
    { sku: "SKU-CL-7755", desc: "Clutch Plate" },
    { sku: "SKU-BR-1190", desc: "Brake Rotor" },
    { sku: "SKU-EN-3344", desc: "Engine Mount" },
    { sku: "SKU-TR-9012", desc: "Transmission Assembly" },
  ]
  const types: CargoItem["type"][] = ["standard", "fragile", "hazardous", "cold-chain"]
  const cargo: CargoItem[] = []
  const count = 4 + (seed % 3)
  for (let i = 0; i < count; i++) {
    const sku = pick(skus, seed, i)
    const type = pick(types, seed, i + 3)
    cargo.push({
      id: `cargo-${i}`,
      sku: sku.sku,
      description: sku.desc,
      quantity: 10 + ((seed >> i) & 0x3F),
      weight: `${20 + ((seed >> i) & 0xF)} kg`,
      type,
      destination: route.destination,
    })
  }
  return cargo
}

function generateHourlyMetrics(route: RouteDetail): HourlyMetric[] {
  const seed = hashStr(route.id)
  const points: HourlyMetric[] = []
  const isActive = route.status === "in-transit" || route.status === "delayed"
  for (let i = 11; i >= 0; i--) {
    const t = new Date(Date.now() - i * 60 * 60 * 1000)
    const noise = ((seed >> (i % 16)) & 7) - 3
    points.push({
      hour: t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }),
      speed: isActive ? Math.max(0, 50 + noise + (i < 4 ? 5 : -3)) : 0,
      fuel: isActive ? Math.max(0, 7 + noise * 0.2) : 0,
      distance: isActive ? Math.max(0, 45 + noise + (i < 4 ? 8 : -5)) : 0,
    })
  }
  return points
}

function formatRelativeTime(ts: string): string {
  const date = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return "in " + Math.abs(Math.round(diffMs / 60000)) + "m"
  const min = Math.floor(diffMs / 60000)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}

function formatAbsoluteTime(ts: string): string {
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

function eventColor(type: TripEvent["type"]) {
  switch (type) {
    case "departure": return "bg-blue-500"
    case "arrival": return "bg-emerald-500"
    case "checkpoint": return "bg-slate-400 dark:bg-slate-500"
    case "incident": return "bg-red-500"
    case "rest": return "bg-amber-500"
    case "fuel": return "bg-purple-500"
  }
}

function cargoTypeColor(type: CargoItem["type"]) {
  switch (type) {
    case "standard": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    case "fragile": return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
    case "hazardous": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
    case "cold-chain": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
  }
}

function cargoTypeIcon(type: CargoItem["type"]) {
  switch (type) {
    case "standard": return Package
    case "fragile": return AlertTriangle
    case "hazardous": return Flame
    case "cold-chain": return Snowflake
  }
}

function stopStatusColor(status: RouteStop["status"]) {
  switch (status) {
    case "completed": return "bg-emerald-500 text-white"
    case "current": return "bg-blue-500 text-white animate-pulse"
    case "pending": return "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
    case "delayed": return "bg-red-500 text-white"
  }
}

function telemetrySeverityColor(s: TelemetryMetric["severity"]) {
  switch (s) {
    case "good": return "text-emerald-600 dark:text-emerald-400"
    case "warning": return "text-amber-600 dark:text-amber-400"
    case "critical": return "text-red-600 dark:text-red-400"
  }
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function RouteOptimizationDetailDrawer({
  open,
  onOpenChange,
  route,
  onOptimize,
  onShare,
}: RouteDetailDrawerProps) {
  const toast = useToast()

  // Hooks BEFORE early return
  const stops = React.useMemo(() => (route ? generateRouteStops(route) : []), [route])
  const telemetry = React.useMemo(() => (route ? generateTelemetry(route) : []), [route])
  const driver = React.useMemo(() => (route ? generateDriverInfo(route) : null), [route])
  const events = React.useMemo(() => (route ? generateTripEvents(route) : []), [route])
  const cargo = React.useMemo(() => (route ? generateCargo(route) : []), [route])
  const hourlyMetrics = React.useMemo(() => (route ? generateHourlyMetrics(route) : []), [route])

  if (!route) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl" />
      </Sheet>
    )
  }

  const statusCfg = statusConfig[route.status]
  const completedStops = stops.filter((s) => s.status === "completed").length
  const totalStops = stops.length
  const stopPct = Math.round((completedStops / totalStops) * 100)
  const totalCargoWeight = cargo.reduce((sum, c) => sum + parseInt(c.weight), 0)
  const totalCargoQty = cargo.reduce((sum, c) => sum + c.quantity, 0)

  const handleOptimize = () => {
    toast.success("Route re-optimization queued", `Recomputing optimal path for ${route.id}`, { duration: 3000 })
    onOptimize?.(route)
  }

  const handleShare = () => {
    toast.info("Route link copied", "Share with dispatch and customer", { duration: 2000 })
    onShare?.(route)
  }

  const handleContactDriver = () => {
    if (!driver) return
    toast.info("Calling driver", `${driver.name} · ${driver.phone}`, { duration: 3000 })
  }

  const handleExportCargo = () => {
    const data = cargo.map((c) => ({
      SKU: c.sku,
      Description: c.description,
      Quantity: c.quantity,
      Weight: c.weight,
      Type: c.type,
      Destination: c.destination,
    }))
    exportToCSV(data, `route-${route.id}-cargo`, ["SKU", "Description", "Quantity", "Weight", "Type", "Destination"])
    toast.success("Cargo manifest exported", `${cargo.length} items written to CSV`, { duration: 2500 })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-2xl overflow-y-auto p-0 border-l-2",
          statusCfg.border,
        )}
      >
        {/* ── Header Strip ─────────────────────────────────────────────── */}
        <div className={cn("relative bg-gradient-to-br text-white overflow-hidden", statusCfg.gradient)}>
          <div className="route-drawer-header absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 opacity-20"
               style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "16px 16px" }} />

          {statusCfg.pulse && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5">
              <span className="route-pulse-ring h-1.5 w-1.5 rounded-full bg-white" />
              <span className="text-[10px] font-medium text-white">LIVE</span>
            </div>
          )}

          <SheetHeader className="relative p-5 pb-4 space-y-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className={cn(
                "route-icon-pulse flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-2 ring-white/30 backdrop-blur-sm",
                "bg-white/20",
              )}>
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-base font-semibold text-white leading-tight">
                  <span className="font-mono">{route.id}</span>
                </SheetTitle>
                <SheetDescription className="text-white/80 text-xs mt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {route.origin}
                  </span>
                  <span className="mx-1.5"><ArrowRight className="h-3 w-3 inline" /></span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {route.destination}
                  </span>
                </SheetDescription>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-white/80">
                  <span className="inline-flex items-center gap-1">
                    <Route className="h-3 w-3" /> {route.stops} stops
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {route.estTime}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {route.distance}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Truck className="h-3 w-3" /> {route.vehicle}
                  </span>
                </div>
              </div>
              <Badge className="shrink-0 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {statusCfg.label}
              </Badge>
            </div>

            {/* Hero metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="route-stat-enter rounded-lg bg-white/15 backdrop-blur-sm p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/70">Progress</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  <span className="text-number">{route.progress}</span>%
                </p>
              </div>
              <div className="route-stat-enter rounded-lg bg-white/15 backdrop-blur-sm p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/70">Stops</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  <span className="text-number">{completedStops}</span>/<span className="text-number">{totalStops}</span>
                </p>
              </div>
              <div className="route-stat-enter rounded-lg bg-white/15 backdrop-blur-sm p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/70">Cargo</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  <span className="text-number">{totalCargoQty}</span> <span className="text-[10px] text-white/70">units</span>
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                size="sm"
                variant="secondary"
                className="h-7 text-[11px] gap-1.5 bg-white/90 hover:bg-white text-slate-900"
                onClick={handleOptimize}
              >
                <Zap className="h-3 w-3" /> Re-optimize
              </Button>
              {route.status === "in-transit" && driver && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-[11px] gap-1.5 bg-emerald-500/90 hover:bg-emerald-500 text-white border-emerald-400"
                  onClick={handleContactDriver}
                >
                  <Phone className="h-3 w-3" /> Call Driver
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[11px] gap-1.5 text-white hover:bg-white/20"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3" /> Share
              </Button>
            </div>
          </SheetHeader>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="route-drawer-body-enter space-y-5 p-5">
          {/* Route progress overview */}
          <section className="route-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Activity className="h-3.5 w-3.5" /> Route Progress
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Overall completion</span>
                <span className="font-medium text-foreground"><span className="text-number">{route.progress}</span>%</span>
              </div>
              <Progress value={route.progress} className="h-2 progress-bar-animated progress-gradient" />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                <span>Origin: <span className="font-medium text-foreground">{route.origin}</span></span>
                <span>Destination: <span className="font-medium text-foreground">{route.destination}</span></span>
              </div>
            </div>
          </section>

          {/* Telemetry metrics */}
          <section className="route-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Gauge className="h-3.5 w-3.5" /> Vehicle Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {telemetry.map((m) => (
                <div key={m.label} className="route-metric-enter rounded-lg border border-border/40 bg-muted/30 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                  <p className={cn("text-lg font-bold tabular-nums mt-0.5", telemetrySeverityColor(m.severity))}>
                    {m.value}<span className="text-[10px] font-normal text-muted-foreground ml-1">{m.unit}</span>
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-muted-foreground">vs {m.target}</p>
                    <p className={cn(
                      "text-[10px] flex items-center gap-0.5",
                      m.trend === "up" ? "text-emerald-500" :
                      m.trend === "down" ? "text-red-500" : "text-muted-foreground",
                    )}>
                      {m.trend === "up" ? <TrendingUp className="h-2.5 w-2.5" /> :
                       m.trend === "down" ? <TrendingDown className="h-2.5 w-2.5" /> :
                       <Activity className="h-2.5 w-2.5" />}
                      {m.delta}
                    </p>
                  </div>
                  <Progress value={m.pct} className="h-1 mt-1.5" />
                </div>
              ))}
            </div>
          </section>

          {/* Hourly performance chart */}
          <section className="route-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <TrendingUp className="h-3.5 w-3.5" /> 12-Hour Performance
            </h3>
            <ChartContainer
              config={{
                speed: { label: "Speed (km/h)", color: statusCfg.barColor },
                distance: { label: "Distance (km)", color: "#a855f7" },
              }}
              className="h-[180px] w-full"
            >
              <AreaChart data={hourlyMetrics}>
                <defs>
                  <linearGradient id="routeSpeedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={statusCfg.barColor} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={statusCfg.barColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} className="text-muted-foreground" interval={2} />
                <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="speed"
                  stroke={statusCfg.barColor}
                  strokeWidth={2}
                  fill="url(#routeSpeedFill)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="distance"
                  stroke="#a855f7"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fill="none"
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </section>

          {/* Route & stops timeline */}
          <section className="route-card-enter rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <MapIcon className="h-3.5 w-3.5" /> Route & Stops ({totalStops})
              </h3>
              <Badge variant="outline" className="text-[10px]">
                {completedStops}/{totalStops} completed
              </Badge>
            </div>
            <Progress value={stopPct} className="h-1 mb-3" />
            <div className="relative pl-6">
              <div className="absolute left-2 top-3 bottom-3 w-px bg-border" />
              <div className="space-y-3">
                {stops.map((stop) => (
                  <div key={stop.id} className="route-stop-enter relative">
                    <div className={cn(
                      "absolute -left-4 top-1 h-3 w-3 rounded-full ring-2 ring-background",
                      stopStatusColor(stop.status),
                    )} />
                    <div className="ml-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-foreground">{stop.name}</p>
                          <Badge variant="outline" className="text-[9px] capitalize">
                            {stop.type}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground shrink-0 capitalize">
                          {stop.status}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" /> Arr {stop.arrivalTime}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ArrowRight className="h-2.5 w-2.5" /> Dep {stop.departureTime}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" /> {stop.distanceFromPrev}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Activity className="h-2.5 w-2.5" /> {stop.durationAtStop}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Driver info */}
          {driver && (
            <section className="route-card-enter rounded-xl border border-border/60 bg-card p-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <User className="h-3.5 w-3.5" /> Driver Information
              </h3>
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white font-bold text-sm",
                  driver.avatarColor,
                )}>
                  {driver.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{driver.name}</p>
                    <Badge variant="outline" className="text-[9px] gap-0.5">
                      <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                      <span className="text-number">{driver.rating.toFixed(1)}</span>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                    <div>
                      <p className="text-[10px] text-muted-foreground">License</p>
                      <p className="font-mono font-medium text-foreground">{driver.license}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Experience</p>
                      <p className="font-medium text-foreground">{driver.experience}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Today</p>
                      <p className="font-medium text-foreground"><span className="text-number">{driver.todayHours}h</span> / 11h</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">This Week</p>
                      <p className="font-medium text-foreground"><span className="text-number">{driver.weekHours}h</span> / 60h</p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] gap-1 shrink-0"
                  onClick={handleContactDriver}
                >
                  <Phone className="h-3.5 w-3.5" /> Call
                </Button>
              </div>
            </section>
          )}

          {/* Trip events timeline */}
          <section className="route-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <History className="h-3.5 w-3.5" /> Trip Events
            </h3>
            <div className="relative pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
              <div className="space-y-3">
                {events.map((evt) => (
                  <div key={evt.id} className="route-event-enter relative">
                    <div className={cn(
                      "absolute -left-4 top-1 h-3 w-3 rounded-full ring-2 ring-background",
                      eventColor(evt.type),
                      evt.type === "incident" && "route-event-active",
                    )} />
                    <div className="ml-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-xs font-medium text-foreground capitalize">{evt.type}</p>
                        <p className="text-[10px] text-muted-foreground shrink-0">
                          {formatAbsoluteTime(evt.timestamp)}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{evt.detail}</p>
                      {evt.location && (
                        <p className="text-[10px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" /> {evt.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Cargo manifest */}
          <section className="route-card-enter rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Boxes className="h-3.5 w-3.5" /> Cargo Manifest ({cargo.length})
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] gap-1"
                onClick={handleExportCargo}
              >
                <Download className="h-3 w-3" /> Export
              </Button>
            </div>
            <div className="space-y-2">
              {cargo.map((item) => {
                const CargoIcon = cargoTypeIcon(item.type)
                return (
                  <div
                    key={item.id}
                    className="route-cargo-row flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 p-2.5 transition-smooth hover:bg-muted/60"
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", cargoTypeColor(item.type))}>
                      <CargoIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono font-medium text-foreground">{item.sku}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-foreground"><span className="text-number">{item.quantity}</span> units</p>
                      <p className="text-[10px] text-muted-foreground">{item.weight}</p>
                    </div>
                    <Badge className={cn("text-[9px] capitalize shrink-0", cargoTypeColor(item.type))}>
                      {item.type}
                    </Badge>
                  </div>
                )
              })}
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Units</p>
                <p className="font-bold text-foreground mt-0.5"><span className="text-number">{totalCargoQty}</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Weight</p>
                <p className="font-bold text-foreground mt-0.5"><span className="text-number">{totalCargoWeight}</span> kg</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Items</p>
                <p className="font-bold text-foreground mt-0.5"><span className="text-number">{cargo.length}</span></p>
              </div>
            </div>
          </section>

          {/* Route info grid */}
          <section className="route-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Settings className="h-3.5 w-3.5" /> Route Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Route ID</p>
                <p className="font-mono font-medium text-foreground mt-0.5">{route.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Vehicle</p>
                <p className="font-mono font-medium text-foreground mt-0.5">{route.vehicle}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Origin</p>
                <p className="font-medium text-foreground mt-0.5">{route.origin}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Destination</p>
                <p className="font-medium text-foreground mt-0.5">{route.destination}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Distance</p>
                <p className="font-medium text-foreground mt-0.5">{route.distance}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. Time</p>
                <p className="font-medium text-foreground mt-0.5">{route.estTime}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                <p className="font-medium text-foreground mt-0.5">{statusCfg.label}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Progress</p>
                <p className="font-medium text-foreground mt-0.5"><span className="text-number">{route.progress}</span>%</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={handleExportCargo}
            >
              <Download className="h-3.5 w-3.5" /> Export Route Report
            </Button>
            <Button
              size="sm"
              className="text-xs gap-1.5"
              onClick={handleOptimize}
            >
              <Zap className="h-3.5 w-3.5" /> Re-optimize
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
