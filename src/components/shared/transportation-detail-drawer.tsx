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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  Truck,
  MapPin,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  PackageCheck,
  Timer,
  Download,
  Eye,
  ChevronRight,
  Route,
  RefreshCw,
  Clock,
  Calendar,
  User,
  Building2,
  Fuel,
  Gauge,
  Thermometer,
  CircleDot,
  Phone,
  Star,
  Activity,
  Zap,
  AlertCircle,
  Circle,
  History,
  FileText,
  Box,
  Weight,
  Crosshair,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"
import type { TransportVehicle } from "@/data/mock-data"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TransportationDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle: TransportVehicle | null
  onAssignRoute?: (vehicle: TransportVehicle) => void
  onContactDriver?: (vehicle: TransportVehicle) => void
}

interface RouteStop {
  id: string
  name: string
  city: string
  type: "warehouse" | "delivery" | "pickup" | "hub"
  status: "completed" | "current" | "pending"
  arrival: string
  departure: string
  distanceFromStart: number
}

interface VehicleHealthMetric {
  label: string
  value: number
  unit: string
  target: number
  warning: boolean
  critical: boolean
  icon: typeof Fuel
}

interface DriverInfo {
  name: string
  license: string
  rating: number
  todayHours: number
  weekHours: number
  experience: number
  phone: string
  avatar: string
}

interface TripEvent {
  id: string
  timestamp: string
  title: string
  detail: string
  status: "completed" | "current" | "pending"
  icon: typeof Activity
}

interface CargoItem {
  sku: string
  description: string
  qty: number
  weight: number
  type: "fragile" | "standard" | "hazardous" | "cold-chain"
}

// ---------------------------------------------------------------------------
// Deterministic mock generators
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function getRouteStops(vehicle: TransportVehicle): RouteStop[] {
  const seed = hashStr(vehicle.id)
  const stops: Array<{ name: string; city: string; type: RouteStop["type"] }> = [
    { name: "Origin Warehouse", city: vehicle.route.split("→")[0]?.trim() || "Chennai", type: "pickup" },
    { name: "Regional Hub", city: "Vellore Hub", type: "hub" },
    { name: "Customer Site A", city: "Hosur Industrial", type: "delivery" },
    { name: "Customer Site B", city: "Electronic City", type: "delivery" },
    { name: "Destination Warehouse", city: vehicle.route.split("→")[1]?.trim() || "Hosur", type: "warehouse" },
  ]
  // Determine current stop based on delivery progress
  const progress = vehicle.deliveriesTotal > 0 ? vehicle.deliveriesCompleted / vehicle.deliveriesTotal : 0
  const currentIdx = Math.min(stops.length - 1, Math.floor(progress * stops.length))

  return stops.map((s, i) => {
    const status: RouteStop["status"] = i < currentIdx ? "completed" : i === currentIdx ? "current" : "pending"
    const arrival = `${6 + i * 2}:${(seed + i * 17) % 60 < 10 ? "0" : ""}${(seed + i * 17) % 60}`
    const departure = `${6 + i * 2 + 1}:${(seed + i * 23) % 60 < 10 ? "0" : ""}${(seed + i * 23) % 60}`
    return {
      id: `stop-${i + 1}`,
      name: s.name,
      city: s.city,
      type: s.type,
      status,
      arrival,
      departure,
      distanceFromStart: i * (40 + (seed % 80)),
    }
  })
}

function getVehicleHealth(vehicle: TransportVehicle): VehicleHealthMetric[] {
  const seed = hashStr(vehicle.id + "health")
  const isMaintenance = vehicle.status === "maintenance"
  const isDelayed = vehicle.status === "delayed"
  return [
    {
      label: "Fuel Level",
      value: isMaintenance ? 25 : 60 + (seed % 35),
      unit: "%",
      target: 100,
      warning: false,
      critical: isMaintenance,
      icon: Fuel,
    },
    {
      label: "Engine Temp",
      value: 78 + (seed % 18),
      unit: "°C",
      target: 90,
      warning: isDelayed,
      critical: false,
      icon: Thermometer,
    },
    {
      label: "Tire Pressure",
      value: 32 + (seed % 8),
      unit: "PSI",
      target: 36,
      warning: false,
      critical: false,
      icon: Gauge,
    },
    {
      label: "Mileage",
      value: 5.5 + ((seed % 30) / 10),
      unit: "km/l",
      target: 7,
      warning: false,
      critical: false,
      icon: Activity,
    },
  ]
}

function getDriverInfo(vehicle: TransportVehicle): DriverInfo {
  const seed = hashStr(vehicle.id + "driver")
  return {
    name: vehicle.driver,
    license: `DL-${vehicle.registration.slice(0, 2)}-${1000 + (seed % 8999)}`,
    rating: +(3.8 + ((seed % 12) / 10)).toFixed(1),
    todayHours: 4 + (seed % 6),
    weekHours: 28 + (seed % 22),
    experience: 2 + (seed % 8),
    phone: `+91 ${90000 + (seed % 9999)} ${(seed % 100000).toString().padStart(5, "0")}`,
    avatar: vehicle.driver.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
  }
}

function getTripEvents(vehicle: TransportVehicle): TripEvent[] {
  const seed = hashStr(vehicle.id + "events")
  const isTransit = vehicle.status === "in-transit"
  const isDelayed = vehicle.status === "delayed"
  const isMaintenance = vehicle.status === "maintenance"
  const all: Omit<TripEvent, "id">[] = [
    {
      timestamp: "06:00",
      title: "Pre-trip inspection completed",
      detail: "All safety checks passed, dispatched from origin",
      status: "completed",
      icon: CheckCircle2,
    },
    {
      timestamp: "06:30",
      title: "Cargo loaded",
      detail: `${12 + (seed % 18)} pallets · ${(2.5 + (seed % 5)).toFixed(1)}T total weight`,
      status: "completed",
      icon: Box,
    },
    {
      timestamp: "07:15",
      title: "Departed origin warehouse",
      detail: "On schedule, ETA confirmed",
      status: "completed",
      icon: Navigation,
    },
    {
      timestamp: "09:45",
      title: "Crossed state border",
      detail: "Toll paid · checkpoint cleared",
      status: isTransit || isDelayed ? "completed" : "pending",
      icon: MapPin,
    },
    {
      timestamp: "11:30",
      title: "Halt for refueling",
      detail: "Diesel top-up · driver break",
      status: isTransit && (seed % 2 === 0) ? "completed" : isTransit ? "current" : "pending",
      icon: Fuel,
    },
    {
      timestamp: "13:00",
      title: "Arrival at destination",
      detail: "POD collection scheduled",
      status: isMaintenance ? "pending" : "pending",
      icon: PackageCheck,
    },
  ]
  return all.map((e, i) => ({ ...e, id: `EVT-${i + 1}` }))
}

function getCargoManifest(vehicle: TransportVehicle): CargoItem[] {
  const seed = hashStr(vehicle.id + "cargo")
  const items: Array<{ sku: string; description: string; weight: number; type: CargoItem["type"] }> = [
    { sku: "ENG-CY-001", description: "Cylinder Block Assembly", weight: 38, type: "standard" },
    { sku: "TRN-GB-205", description: "Gearbox Housing", weight: 22, type: "standard" },
    { sku: "ELC-BT-502", description: "Battery 12V 80Ah", weight: 18, type: "hazardous" },
    { sku: "PHR-MD-118", description: "Medicine Cold Chain Box", weight: 4.5, type: "cold-chain" },
    { sku: "GLS-WN-411", description: "Windshield Tempered Glass", weight: 12, type: "fragile" },
    { sku: "BRK-PD-310", description: "Brake Pad Premium", weight: 0.8, type: "standard" },
  ]
  return items.map((it, i) => ({
    ...it,
    qty: 25 + ((seed + i * 17) % 100),
  })).slice(0, 4 + (seed % 3))
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TransportationDetailDrawer({
  open,
  onOpenChange,
  vehicle,
  onAssignRoute,
  onContactDriver,
}: TransportationDetailDrawerProps) {
  const toast = useToast()

  // Compute all derived data unconditionally (Rules of Hooks).
  const stops = React.useMemo(() => vehicle ? getRouteStops(vehicle) : [], [vehicle])
  const health = React.useMemo(() => vehicle ? getVehicleHealth(vehicle) : [], [vehicle])
  const driver = React.useMemo(() => vehicle ? getDriverInfo(vehicle) : null, [vehicle])
  const events = React.useMemo(() => vehicle ? getTripEvents(vehicle) : [], [vehicle])
  const cargo = React.useMemo(() => vehicle ? getCargoManifest(vehicle) : [], [vehicle])

  // Stop completion bar chart data
  const stopChartData = React.useMemo(() => {
    return stops.map((s) => ({
      label: s.city.length > 12 ? s.city.slice(0, 12) + "..." : s.city,
      distance: s.distanceFromStart,
      status: s.status,
    }))
  }, [stops])

  if (!vehicle) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-[680px] p-0 overflow-y-auto" />
      </Sheet>
    )
  }

  const vh = vehicle
  const isDelayed = vh.status === "delayed"
  const isTransit = vh.status === "in-transit"
  const isAvailable = vh.status === "available"
  const isMaintenance = vh.status === "maintenance"

  const statusColor = isDelayed ? "text-red-600 dark:text-red-400" :
                      isTransit ? "text-blue-600 dark:text-blue-400" :
                      isAvailable ? "text-emerald-600 dark:text-emerald-400" :
                      "text-amber-600 dark:text-amber-400"

  const statusBg = isDelayed ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800" :
                   isTransit ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800" :
                   isAvailable ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" :
                   "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"

  const totalWeight = cargo.reduce((s, c) => s + c.weight * c.qty, 0)
  const totalQty = cargo.reduce((s, c) => s + c.qty, 0)
  const hazardousCount = cargo.filter((c) => c.type === "hazardous").length
  const fragileCount = cargo.filter((c) => c.type === "fragile").length
  const coldChainCount = cargo.filter((c) => c.type === "cold-chain").length

  const otifPct = vh.deliveriesTotal > 0 ? Math.round((vh.deliveriesCompleted / vh.deliveriesTotal) * 100) : 0
  const progressPct = stops.length > 0
    ? Math.round((stops.filter((s) => s.status === "completed").length / stops.length) * 100)
    : 0
  const currentStop = stops.find((s) => s.status === "current")

  const handleExport = () => {
    const data = cargo.map((c) => ({
      SKU: c.sku,
      Description: c.description,
      Qty: c.qty,
      "Weight (kg)": c.weight,
      "Total Weight (kg)": (c.weight * c.qty).toFixed(1),
      Type: c.type,
    }))
    exportToCSV(data, `vehicle-${vh.registration}-cargo`, ["SKU", "Description", "Qty", "Weight (kg)", "Total Weight (kg)", "Type"])
  }

  const handleAssignRoute = () => {
    toast.success("Route Assignment", `Opening route planner for ${vh.registration}.`)
    onAssignRoute?.(vh)
  }

  const handleContactDriver = () => {
    if (driver) {
      toast.info("Contacting Driver", `Calling ${driver.name} at ${driver.phone}...`)
    }
    onContactDriver?.(vh)
  }

  const handleRefresh = () => {
    toast.info("Refreshing", `Re-fetching live telemetry for ${vh.registration}…`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[680px] p-0 overflow-y-auto"
      >
        {/* Header strip */}
        <div className={cn(
          "sticky top-0 z-20 bg-gradient-to-br backdrop-blur-sm border-b trans-drawer-header",
          statusBg
        )}>
          <SheetHeader className="space-y-0 p-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "relative flex size-14 items-center justify-center rounded-2xl border-2 shadow-md trans-icon-pulse",
                  statusBg
                )}>
                  <Truck className={cn("size-7", statusColor)} />
                  {isTransit && (
                    <div className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center trans-pulse-ring">
                      <Navigation className="size-2.5 text-white" />
                    </div>
                  )}
                  {isMaintenance && (
                    <div className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-amber-500 border-2 border-background flex items-center justify-center">
                      <Wrench className="size-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <SheetTitle className="text-lg font-semibold leading-tight flex items-center gap-2">
                    <span className="font-mono">{vh.registration}</span>
                    <Badge variant="outline" className={cn("text-[10px] gap-1", statusColor)}>
                      {vh.type}
                    </Badge>
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-0.5">
                      <Route className="size-2.5" /> {vh.route}
                    </span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="flex items-center gap-0.5">
                      <User className="size-2.5" /> {vh.driver}
                    </span>
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8" onClick={handleRefresh} title="Refresh telemetry">
                  <RefreshCw className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={handleExport} title="Export cargo manifest">
                  <Download className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Hero metrics */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 trans-stat-enter" style={{ animationDelay: "0ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Status</p>
                <p className={cn("mt-0.5 text-sm font-bold capitalize", statusColor)}>{vh.status.replace("-", " ")}</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 trans-stat-enter" style={{ animationDelay: "60ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Deliveries</p>
                <p className="mt-0.5 text-sm font-bold text-number">{vh.deliveriesCompleted}<span className="text-[10px] text-muted-foreground">/{vh.deliveriesTotal}</span></p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 trans-stat-enter" style={{ animationDelay: "120ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">ETA</p>
                <p className={cn("mt-0.5 text-sm font-bold text-number", isDelayed ? "text-red-600 dark:text-red-400" : "")}>
                  {vh.eta ? new Date(vh.eta).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                </p>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 trans-drawer-body-enter">

          {/* Route progress + OTIF overview */}
          <div className="rounded-lg border border-border/60 bg-card p-4 trans-card-enter">
            <div className="grid gap-4 md:grid-cols-[140px_1fr]">
              <div className="flex flex-col items-center justify-center">
                <div className={cn(
                  "relative flex size-[120px] items-center justify-center rounded-full border-4",
                  isDelayed ? "border-red-200 dark:border-red-900" :
                  isTransit ? "border-blue-200 dark:border-blue-900" :
                  "border-muted"
                )}>
                  <div className="text-center">
                    <p className={cn("text-2xl font-bold text-number", statusColor)}>{progressPct}%</p>
                    <p className="text-[9px] uppercase text-muted-foreground">route done</p>
                  </div>
                  {isTransit && (
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 trans-pulse-ring" />
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-bold text-sm">{stops.filter((s) => s.status === "completed").length}</span>
                  <span className="text-muted-foreground"> / {stops.length} stops</span>
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="size-3" />
                  Delivery Performance
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-border/40 bg-background/60 p-2.5">
                    <p className="text-[9px] uppercase text-muted-foreground">OTIF Rate</p>
                    <p className={cn(
                      "text-sm font-bold text-number mt-0.5",
                      otifPct >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                      otifPct >= 75 ? "text-blue-600 dark:text-blue-400" :
                      "text-amber-600 dark:text-amber-400"
                    )}>{otifPct}%</p>
                  </div>
                  <div className="rounded-md border border-border/40 bg-background/60 p-2.5">
                    <p className="text-[9px] uppercase text-muted-foreground">Current Location</p>
                    <p className="text-xs font-medium mt-0.5 truncate" title={vh.currentLocation}>{vh.currentLocation}</p>
                  </div>
                </div>
                <div className="rounded-md border border-border/40 bg-background/60 p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] uppercase text-muted-foreground">Next Stop</p>
                    {currentStop && (
                      <Badge variant="outline" className="text-[9px] gap-1 text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-700">
                        <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                        En route
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-medium mt-0.5">
                    {currentStop?.name || "Final destination"}
                  </p>
                  {currentStop && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      ETA {currentStop.arrival} · {currentStop.distanceFromStart}km from start
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  {!isTransit && (
                    <Button size="sm" className="h-7 text-[10px] gap-1" onClick={handleAssignRoute}>
                      <Zap className="size-2.5" />
                      Assign Route
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={handleContactDriver}>
                    <Phone className="size-2.5" />
                    Contact Driver
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Route timeline */}
          <div className="rounded-lg border border-border/60 bg-card p-4 trans-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Route className="size-3" />
                Route & Stops
              </h3>
              <Badge variant="outline" className="text-[10px]">
                {stops.filter((s) => s.status === "completed").length} of {stops.length} done
              </Badge>
            </div>
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-400/60 via-border/40 to-transparent" />
              <div className="space-y-3">
                {stops.map((stop, i) => {
                  const Icon = stop.status === "completed" ? CheckCircle2 : stop.status === "current" ? CircleDot : Circle
                  const TypeIcon = stop.type === "warehouse" ? Building2 :
                                   stop.type === "hub" ? Crosshair :
                                   stop.type === "pickup" ? Box : PackageCheck
                  const accentClass = stop.status === "completed"
                    ? "border-emerald-500 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                    : stop.status === "current"
                    ? "border-blue-500 bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    : "border-muted bg-muted text-muted-foreground"
                  return (
                    <div
                      key={stop.id}
                      className="relative flex items-start gap-3 trans-stop-enter"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className={cn(
                        "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                        accentClass,
                        stop.status === "current" && "trans-stop-active"
                      )}>
                        <Icon className="size-3" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-medium leading-snug flex items-center gap-1.5">
                            <TypeIcon className="size-3 text-muted-foreground" />
                            {stop.name}
                          </p>
                          {stop.status === "current" && (
                            <Badge variant="outline" className="text-[9px] gap-1 border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400">
                              <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                              Live
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-0.5"><MapPin className="size-2.5" />{stop.city}</span>
                          <span className="flex items-center gap-0.5"><Clock className="size-2.5" />{stop.arrival}–{stop.departure}</span>
                          <span className="flex items-center gap-0.5"><Route className="size-2.5" />{stop.distanceFromStart}km</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Stop distance chart */}
          <div className="rounded-lg border border-border/60 bg-card p-4 trans-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Navigation className="size-3" />
                Distance Between Stops
              </h3>
              <span className="text-[10px] text-muted-foreground">cumulative km</span>
            </div>
            <ChartContainer
              config={{ distance: { label: "Distance (km)", color: "#2563EB" } }}
              className="h-[140px] w-full"
            >
              <BarChart data={stopChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(val) => [`${val} km`, "Distance"]}
                    />
                  }
                />
                <Bar dataKey="distance" fill="#2563EB" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Vehicle health */}
          <div className="rounded-lg border border-border/60 bg-card p-4 trans-card-enter">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Gauge className="size-3" />
              Vehicle Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {health.map((m, i) => {
                const Icon = m.icon
                const color = m.critical ? "text-red-600 dark:text-red-400" :
                              m.warning ? "text-amber-600 dark:text-amber-400" :
                              "text-foreground"
                const barColor = m.critical ? "bg-red-500" :
                                 m.warning ? "bg-amber-500" :
                                 "bg-blue-500"
                return (
                  <div
                    key={m.label}
                    className="rounded-md border border-border/40 bg-background/60 p-2.5 trans-metric-enter"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center gap-1">
                      <Icon className={cn("size-3", color)} />
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                    </div>
                    <p className={cn("mt-0.5 text-base font-bold text-number", color)}>
                      {m.value.toFixed(m.unit === "km/l" ? 1 : 0)}<span className="text-[10px] text-muted-foreground ml-0.5">{m.unit}</span>
                    </p>
                    <div className="mt-1.5 h-1 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full trans-fill-animate", barColor)}
                        style={{ width: `${Math.min(100, (m.value / m.target) * 100)}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-[9px] text-muted-foreground">target: {m.target}{m.unit}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Driver info card */}
          {driver && (
            <div className="rounded-lg border border-border/60 bg-card p-4 trans-card-enter">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="size-3" />
                Driver Information
              </h3>
              <div className="flex items-start gap-3">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-sm font-bold">
                    {driver.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold">{driver.name}</p>
                    <Badge variant="outline" className="text-[10px] gap-1 text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700">
                      <Star className="size-2.5 fill-current" />
                      {driver.rating}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    License: <span className="font-mono">{driver.license}</span> · {driver.experience}y exp
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-border/40 bg-background/60 p-2">
                      <p className="text-[9px] uppercase text-muted-foreground">Today's Hours</p>
                      <p className={cn(
                        "text-xs font-bold text-number",
                        driver.todayHours > 8 ? "text-amber-600 dark:text-amber-400" : "text-foreground"
                      )}>{driver.todayHours}h</p>
                    </div>
                    <div className="rounded-md border border-border/40 bg-background/60 p-2">
                      <p className="text-[9px] uppercase text-muted-foreground">This Week</p>
                      <p className={cn(
                        "text-xs font-bold text-number",
                        driver.weekHours > 50 ? "text-amber-600 dark:text-amber-400" : "text-foreground"
                      )}>{driver.weekHours}h</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="size-8" onClick={handleContactDriver} title="Call driver">
                  <Phone className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Trip event timeline */}
          <div className="rounded-lg border border-border/60 bg-card p-4 trans-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <History className="size-3" />
                Trip Events
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {events.filter((e) => e.status === "completed").length} completed
              </span>
            </div>
            <div className="space-y-2">
              {events.map((evt, i) => {
                const Icon = evt.icon
                const sevColor = evt.status === "completed"
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20"
                  : evt.status === "current"
                  ? "border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20"
                  : "border-border/60 bg-background/60"
                const sevText = evt.status === "completed"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : evt.status === "current"
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-muted-foreground"
                return (
                  <div
                    key={evt.id}
                    className={cn("rounded-md border p-2.5 trans-event-enter", sevColor)}
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn("size-3.5 shrink-0 mt-0.5", sevText)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold leading-tight">{evt.title}</p>
                          <span className="text-[10px] text-muted-foreground tabular-nums">{evt.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{evt.detail}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cargo manifest */}
          <div className="rounded-lg border border-border/60 bg-card p-4 trans-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Box className="size-3" />
                Cargo Manifest
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{cargo.length} SKUs</span>
                <span>·</span>
                <span className="text-number">{totalQty} units</span>
                <span>·</span>
                <span className="text-number">{totalWeight.toFixed(1)} kg</span>
                {hazardousCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-0.5">
                      <AlertTriangle className="size-2.5" />
                      {hazardousCount} haz
                    </span>
                  </>
                )}
                {fragileCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                      <AlertCircle className="size-2.5" />
                      {fragileCount} frag
                    </span>
                  </>
                )}
                {coldChainCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                      <Thermometer className="size-2.5" />
                      {coldChainCount} cold
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              {cargo.map((item, i) => {
                const typeColor = item.type === "fragile" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                                  item.type === "hazardous" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                                  item.type === "cold-chain" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                const TypeIcon = item.type === "fragile" ? AlertCircle :
                                 item.type === "hazardous" ? AlertTriangle :
                                 item.type === "cold-chain" ? Thermometer :
                                 CheckCircle2
                return (
                  <div
                    key={item.sku}
                    className="trans-cargo-row group flex items-center gap-3 rounded-md border border-border/40 bg-background/60 px-2.5 py-2"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-md", typeColor)}>
                      <TypeIcon className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-tight">
                        <span className="font-mono text-[10px] text-muted-foreground">{item.sku}</span>
                        <span className="ml-2">{item.description}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <Weight className="size-2.5" />{item.weight} kg each
                        </span>
                        <span>·</span>
                        <span className="capitalize">{item.type.replace("-", " ")}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-number">
                        {(item.weight * item.qty).toFixed(1)} kg
                      </p>
                      <p className="text-[9px] text-muted-foreground">×{item.qty}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick info */}
          <div className="rounded-lg border border-border/60 bg-card p-4 trans-card-enter">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="size-3" />
              Vehicle Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Truck className="size-2.5" /> Vehicle ID
                </p>
                <p className="text-xs font-mono mt-0.5">{vh.id}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Crosshair className="size-2.5" /> Type
                </p>
                <p className="text-xs font-medium mt-0.5">{vh.type}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Route className="size-2.5" /> Route
                </p>
                <p className="text-xs font-medium mt-0.5 truncate" title={vh.route}>{vh.route}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-2.5" /> Current Location
                </p>
                <p className="text-xs font-medium mt-0.5 truncate" title={vh.currentLocation}>{vh.currentLocation}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 pb-1 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground">
              ID: <span className="font-mono">{vh.id}</span> · Last sync: just now
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] gap-1"
              onClick={() => toast.info("Opening tracker", `Loading live map for ${vh.registration}…`)}
            >
              <ChevronRight className="size-3" />
              Live map
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
