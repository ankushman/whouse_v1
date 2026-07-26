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
  LineChart,
  Line,
} from "recharts"
import {
  Truck,
  Package,
  User,
  Calendar,
  FileText,
  Activity,
  MapPin,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  ChevronRight,
  Zap,
  AlertTriangle,
  Sparkles,
  History,
  CheckCircle2,
  Clock,
  Circle,
  Box,
  Warehouse as WarehouseIcon,
  Gauge,
  Navigation,
  Fuel,
  Weight,
  Map as MapIcon,
  Phone,
  Mail,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"
import type { OutboundShipment } from "@/data/mock-data"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OutboundDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shipment: OutboundShipment | null
  onAdvanceStatus?: (shipment: OutboundShipment) => void
  onAssignVehicle?: (shipment: OutboundShipment) => void
}

interface OrderLine {
  sku: string
  description: string
  qty: number
  picked: number
  uom: string
  weight: number
  status: "picked" | "partial" | "pending"
}

interface PickMetric {
  label: string
  value: number
  unit: string
  target: number
  trend: number // % change vs last shipment
}

interface TrackingEvent {
  time: string
  location: string
  status: string
  completed: boolean
}

// ---------------------------------------------------------------------------
// Deterministic mock generators
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

const OUTBOUND_STEPS = ["Pending", "Picking", "Packing", "Ready", "Dispatched", "Delivered"] as const
const stepIndexMap: Record<string, number> = {
  Pending: 0, Picking: 1, Packing: 2, Ready: 3, Dispatched: 4, Delivered: 5,
}

function getOrderLines(shipment: OutboundShipment): OrderLine[] {
  const seed = hashStr(shipment.id)
  const items: Array<{ sku: string; description: string; uom: string; weight: number }> = [
    { sku: "ENG-CY-001", description: "Cylinder Block Assembly", uom: "PCS", weight: 38 },
    { sku: "BRK-PD-310", description: "Brake Pad Premium", uom: "SET", weight: 0.8 },
    { sku: "SUS-SH-415", description: "Shock Absorber Front", uom: "PCS", weight: 4.5 },
    { sku: "ELC-BT-502", description: "Battery 12V 80Ah", uom: "PCS", weight: 18 },
    { sku: "BDY-DR-203", description: "Door Panel LH", uom: "PCS", weight: 12 },
    { sku: "TRN-CL-118", description: "Clutch Plate", uom: "PCS", weight: 2.3 },
  ]
  const currentIdx = stepIndexMap[shipment.status] ?? 0
  const isPicked = currentIdx >= 1
  const isFullyPicked = currentIdx >= 2

  return items.slice(0, 4 + (seed % 3)).map((it, i) => {
    const qty = 10 + ((seed + i * 13) % 90)
    let picked: number
    let status: OrderLine["status"]
    if (isFullyPicked) {
      picked = qty
      status = "picked"
    } else if (isPicked) {
      picked = i < 2 ? qty : Math.floor(qty * (0.4 + ((seed + i) % 5) / 10))
      status = picked === qty ? "picked" : picked > 0 ? "partial" : "pending"
    } else {
      picked = 0
      status = "pending"
    }
    return { ...it, qty, picked, status }
  })
}

function getPickMetrics(shipment: OutboundShipment): PickMetric[] {
  const seed = hashStr(shipment.id + "pick")
  return [
    { label: "Pick Rate", value: 45 + (seed % 35), unit: "u/h", target: 60, trend: ((seed % 11) - 5) },
    { label: "Accuracy", value: 96 + (seed % 4) + (seed % 10) / 10, unit: "%", target: 99, trend: ((seed % 7) - 3) },
    { label: "Lines", value: 18 + (seed % 22), unit: "ea", target: 40, trend: ((seed % 9) - 4) },
    { label: "Time", value: 35 + (seed % 45), unit: "min", target: 60, trend: ((seed % 13) - 6) },
  ]
}

function getTrackingEvents(shipment: OutboundShipment): TrackingEvent[] {
  const seed = hashStr(shipment.id + "track")
  const currentIdx = stepIndexMap[shipment.status] ?? 0
  if (currentIdx < 4) return [] // Not dispatched yet

  const events: TrackingEvent[] = [
    { time: "09:30", location: "Chennai DC", status: "Dispatched", completed: true },
    { time: "11:15", location: "Chennai Outskirts", status: "In Transit", completed: true },
    { time: "13:45", location: "Tambaram Toll Plaza", status: "Checkpoint", completed: true },
    { time: "15:20", location: "Tindivanam", status: "In Transit", completed: currentIdx >= 5 },
    { time: "17:00", location: "Villupuram", status: "Checkpoint", completed: currentIdx >= 5 },
    { time: "19:30", location: "Customer Site", status: "Delivered", completed: currentIdx >= 5 },
  ]
  return events.slice(0, 4 + (seed % 3))
}

function getPickerStats(shipment: OutboundShipment) {
  const seed = hashStr(shipment.picker)
  return {
    rating: 4 + (seed % 2) + ((seed % 10) / 10),
    todayPicks: 28 + (seed % 35),
    accuracy: 95 + (seed % 5),
    avgPickTime: 35 + (seed % 25),
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OutboundDetailDrawer({
  open,
  onOpenChange,
  shipment,
  onAdvanceStatus,
  onAssignVehicle,
}: OutboundDetailDrawerProps) {
  const { toast } = useToast()

  // Compute all derived data unconditionally (Rules of Hooks).
  const orderLines = React.useMemo(() => shipment ? getOrderLines(shipment) : [], [shipment])
  const metrics = React.useMemo(() => shipment ? getPickMetrics(shipment) : [], [shipment])
  const tracking = React.useMemo(() => shipment ? getTrackingEvents(shipment) : [], [shipment])
  const pickerStats = React.useMemo(() => shipment ? getPickerStats(shipment) : null, [shipment])

  // Pick progress chart data
  const pickProgressData = React.useMemo(() => {
    if (!shipment) return []
    return orderLines.map((line, i) => ({
      line: `L${i + 1}`,
      ordered: line.qty,
      picked: line.picked,
    }))
  }, [shipment, orderLines])

  if (!shipment) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-[680px] p-0 overflow-y-auto" />
      </Sheet>
    )
  }

  const sh = shipment
  const currentIdx = stepIndexMap[sh.status] ?? 0
  const totalPicked = orderLines.reduce((s, l) => s + l.picked, 0)
  const totalOrdered = orderLines.reduce((s, l) => s + l.qty, 0)
  const pickProgress = totalOrdered > 0 ? Math.round((totalPicked / totalOrdered) * 100) : 0
  const totalWeight = orderLines.reduce((s, l) => s + l.weight * l.qty, 0)

  const isDispatched = sh.status === "Dispatched"
  const isDelivered = sh.status === "Delivered"
  const isPending = sh.status === "Pending"
  const isReady = sh.status === "Ready"

  const statusColor = isDelivered ? "text-emerald-600 dark:text-emerald-400" :
                      isDispatched ? "text-indigo-600 dark:text-indigo-400" :
                      isReady ? "text-blue-600 dark:text-blue-400" :
                      sh.status === "Packing" ? "text-amber-600 dark:text-amber-400" :
                      sh.status === "Picking" ? "text-blue-600 dark:text-blue-400" :
                      "text-slate-600 dark:text-slate-400"

  const statusBg = isDelivered ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" :
                   isDispatched ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800" :
                   isReady ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800" :
                   sh.status === "Packing" ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" :
                   sh.status === "Picking" ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800" :
                   "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800"

  const handleExport = () => {
    const data = orderLines.map((l) => ({
      SKU: l.sku,
      Description: l.description,
      Ordered: l.qty,
      Picked: l.picked,
      UOM: l.uom,
      "Weight (kg)": l.weight,
      "Total Weight (kg)": (l.weight * l.qty).toFixed(1),
      Status: l.status,
    }))
    exportToCSV(data, `outbound-${sh.invoice}`, ["SKU", "Description", "Ordered", "Picked", "UOM", "Weight (kg)", "Total Weight (kg)", "Status"])
  }

  const handleAdvance = () => {
    const next = OUTBOUND_STEPS[currentIdx + 1]
    toast.success("Status Advanced", `${sh.invoice}: ${sh.status} → ${next || "Complete"}`)
    onAdvanceStatus?.(sh)
  }

  const handleAssign = () => {
    toast.info("Vehicle Assignment", `Searching available vehicles for ${sh.invoice}…`)
    onAssignVehicle?.(sh)
  }

  const handleRefresh = () => {
    toast.info("Refreshing", `Re-fetching dispatch status for ${sh.invoice}…`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[680px] p-0 overflow-y-auto"
      >
        {/* Header strip */}
        <div className={cn(
          "sticky top-0 z-20 bg-gradient-to-br backdrop-blur-sm border-b outb-drawer-header",
          statusBg
        )}>
          <SheetHeader className="space-y-0 p-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "relative flex size-14 items-center justify-center rounded-2xl border-2 shadow-md outb-icon-pulse",
                  statusBg
                )}>
                  <Truck className={cn("size-7", statusColor)} />
                  {isDispatched && (
                    <div className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center outb-pulse-ring">
                      <Navigation className="size-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <SheetTitle className="text-lg font-semibold leading-tight flex items-center gap-2">
                    <span className="font-mono">{sh.invoice}</span>
                    <Badge variant="outline" className={cn("text-[10px] gap-1", statusColor)}>
                      {sh.pickingType} Pick
                    </Badge>
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground">
                    {sh.customer} · {sh.warehouse}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8" onClick={handleRefresh} title="Refresh data">
                  <RefreshCw className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={handleExport} title="Export order lines">
                  <Download className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Hero metrics */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 outb-stat-enter" style={{ animationDelay: "0ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Status</p>
                <p className={cn("mt-0.5 text-sm font-bold", statusColor)}>{sh.status}</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 outb-stat-enter" style={{ animationDelay: "60ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Pick Progress</p>
                <p className="mt-0.5 text-sm font-bold text-number">{pickProgress}%</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 outb-stat-enter" style={{ animationDelay: "120ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Vehicle</p>
                <p className="mt-0.5 text-sm font-mono font-bold">{sh.vehicle || "—"}</p>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 outb-drawer-body-enter">

          {/* Pipeline progress */}
          <div className="rounded-lg border border-border/60 bg-card p-4 outb-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="size-3" />
                Dispatch Pipeline
              </h3>
              <Badge variant="outline" className="text-[10px]">
                Step {currentIdx + 1} of {OUTBOUND_STEPS.length}
              </Badge>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {OUTBOUND_STEPS.map((step, idx) => {
                const isDone = idx < currentIdx
                const isCurrent = idx === currentIdx
                const isFuture = idx > currentIdx
                const Icon = isDone ? CheckCircle2 : isCurrent ? Clock : Circle
                return (
                  <div key={step} className="flex items-center shrink-0">
                    <div className={cn(
                      "flex flex-col items-center gap-1 px-2",
                    )}>
                      <div className={cn(
                        "flex size-7 items-center justify-center rounded-full border-2 outb-step-enter",
                        isDone && "border-emerald-500 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
                        isCurrent && "border-blue-500 bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 outb-step-active",
                        isFuture && "border-muted bg-background text-muted-foreground"
                      )}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <Icon className="size-3.5" />
                      </div>
                      <p className={cn(
                        "text-[9px] font-medium whitespace-nowrap",
                        isCurrent ? "text-blue-600 dark:text-blue-400" : isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                      )}>
                        {step}
                      </p>
                    </div>
                    {idx < OUTBOUND_STEPS.length - 1 && (
                      <div className={cn("h-0.5 w-3 md:w-6", idx < currentIdx ? "bg-emerald-500" : "bg-muted")} />
                    )}
                  </div>
                )
              })}
            </div>
            {/* Action buttons */}
            <div className="flex gap-2 mt-2 pt-2 border-t border-border/40">
              {!isDelivered && (
                <Button size="sm" className="h-7 text-[10px] gap-1" onClick={handleAdvance}>
                  <Zap className="size-2.5" />
                  Advance to {OUTBOUND_STEPS[currentIdx + 1] || "Complete"}
                </Button>
              )}
              {isPending && (
                <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={handleAssign}>
                  <Truck className="size-2.5" />
                  Assign Vehicle
                </Button>
              )}
            </div>
          </div>

          {/* Pick metrics */}
          <div className="rounded-lg border border-border/60 bg-card p-4 outb-card-enter">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Gauge className="size-3" />
              Pick Performance Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {metrics.map((m, i) => {
                const pct = Math.min(100, Math.round((m.value / m.target) * 100))
                const isOverTarget = m.label === "Time" ? m.value > m.target : m.value >= m.target
                const color = isOverTarget ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                return (
                  <div
                    key={m.label}
                    className="rounded-md border border-border/40 bg-background/60 p-2.5 outb-metric-enter"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                    <p className={cn("mt-0.5 text-base font-bold text-number", color)}>
                      {m.value}<span className="text-[10px] text-muted-foreground ml-0.5">{m.unit}</span>
                    </p>
                    <div className="mt-1.5 h-1 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full outb-fill-animate", isOverTarget ? "bg-emerald-500" : "bg-amber-500")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-0.5 flex items-center gap-0.5 text-[9px]">
                      <span className="text-muted-foreground">target: {m.target}{m.unit}</span>
                      <span className={cn(m.trend > 0 ? "text-emerald-600" : "text-red-600", "flex items-center")}>
                        {m.trend > 0 ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
                        {Math.abs(m.trend)}%
                      </span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pick progress chart */}
          {pickProgressData.length > 0 && (
            <div className="rounded-lg border border-border/60 bg-card p-4 outb-card-enter">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="size-3" />
                  Order Line Pick Progress
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  {totalPicked}/{totalOrdered} units
                </span>
              </div>
              <ChartContainer
                config={{
                  ordered: { label: "Ordered", color: "#94A3B8" },
                  picked: { label: "Picked", color: "#2563EB" },
                }}
                className="h-[140px] w-full"
              >
                <BarChart data={pickProgressData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                  <XAxis dataKey="line" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="ordered" fill="#94A3B8" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="picked" fill="#2563EB" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          )}

          {/* Order lines */}
          <div className="rounded-lg border border-border/60 bg-card p-4 outb-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Box className="size-3" />
                Order Lines
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{orderLines.length} lines</span>
                <span>·</span>
                <span className="text-number">{totalOrdered} units</span>
                <span>·</span>
                <span className="text-number">{totalWeight.toFixed(1)} kg</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {orderLines.map((line, i) => {
                const linePct = line.qty > 0 ? Math.round((line.picked / line.qty) * 100) : 0
                const statusBadge = line.status === "picked"
                  ? { text: "Picked", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" }
                  : line.status === "partial"
                  ? { text: "Partial", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" }
                  : { text: "Pending", cls: "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300" }
                return (
                  <div
                    key={line.sku}
                    className="outb-line-row group rounded-md border border-border/40 bg-background/60 px-2.5 py-2"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-md text-[9px] font-bold",
                          statusBadge.cls
                        )}>
                          {line.status === "picked" ? <CheckCircle2 className="size-3" /> :
                           line.status === "partial" ? <Clock className="size-3" /> :
                           <Circle className="size-3" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium leading-tight">
                            <span className="font-mono text-[10px] text-muted-foreground">{line.sku}</span>
                            <span className="ml-2">{line.description}</span>
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {line.picked}/{line.qty} {line.uom} · {line.weight} kg each
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("text-[9px] h-4 px-1.5", statusBadge.cls)}>
                        {statusBadge.text}
                      </Badge>
                    </div>
                    <div className="ml-8 h-1 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full outb-fill-animate",
                          line.status === "picked" ? "bg-emerald-500" : line.status === "partial" ? "bg-amber-500" : "bg-slate-300"
                        )}
                        style={{ width: `${linePct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Picker & Packer info */}
          {pickerStats && (
            <div className="rounded-lg border border-border/60 bg-card p-4 outb-card-enter">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="size-3" />
                Picker & Packer
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {/* Picker */}
                <div className="rounded-md border border-border/40 bg-background/60 p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="size-10 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">
                        {sh.picker.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{sh.picker}</p>
                      <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn("size-2.5", i < Math.floor(pickerStats.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
                          />
                        ))}
                        <span className="ml-1 text-muted-foreground">{pickerStats.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <div>
                      <p className="text-muted-foreground">Today</p>
                      <p className="font-semibold text-number">{pickerStats.todayPicks}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Accuracy</p>
                      <p className="font-semibold text-emerald-600">{pickerStats.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg/min</p>
                      <p className="font-semibold text-number">{pickerStats.avgPickTime}</p>
                    </div>
                  </div>
                </div>
                {/* Packer */}
                <div className="rounded-md border border-border/40 bg-background/60 p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="size-10 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-xs font-bold text-white">
                        {sh.packer.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{sh.packer}</p>
                      <p className="text-[10px] text-muted-foreground">Packing Specialist</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <div>
                      <p className="text-muted-foreground">Today</p>
                      <p className="font-semibold text-number">32</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Accuracy</p>
                      <p className="font-semibold text-emerald-600">98%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg/min</p>
                      <p className="font-semibold text-number">2.4</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tracking timeline (only if dispatched) */}
          {tracking.length > 0 && (
            <div className="rounded-lg border border-border/60 bg-card p-4 outb-card-enter">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Navigation className="size-3" />
                  Live Tracking
                </h3>
                <Badge variant="outline" className="text-[10px] gap-1 border-indigo-300 text-indigo-600 dark:border-indigo-700 dark:text-indigo-400">
                  <span className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  In Transit
                </Badge>
              </div>
              <div className="relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-400/60 via-border/40 to-transparent" />
                <div className="space-y-3">
                  {tracking.map((evt, i) => {
                    const isLast = i === tracking.length - 1
                    const Icon = evt.completed ? CheckCircle2 : isLast ? Navigation : Circle
                    const accentClass = evt.completed
                      ? "border-emerald-500 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                      : isLast
                      ? "border-indigo-500 bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 outb-tracking-active"
                      : "border-muted bg-background text-muted-foreground"
                    return (
                      <div
                        key={i}
                        className="relative flex items-start gap-3 outb-tracking-enter"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className={cn(
                          "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                          accentClass
                        )}>
                          <Icon className="size-3" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium leading-snug">{evt.location}</p>
                            <span className="text-[10px] text-muted-foreground font-mono shrink-0">{evt.time}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{evt.status}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Shipment info */}
          <div className="rounded-lg border border-border/60 bg-card p-4 outb-card-enter">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="size-3" />
              Shipment Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <User className="size-2.5" /> Customer
                </p>
                <p className="text-xs font-medium mt-0.5 truncate">{sh.customer}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <WarehouseIcon className="size-2.5" /> Warehouse
                </p>
                <p className="text-xs font-medium mt-0.5">{sh.warehouse}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Truck className="size-2.5" /> Vehicle
                </p>
                <p className="text-xs font-mono mt-0.5">{sh.vehicle || "—"}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-2.5" /> Created
                </p>
                <p className="text-xs font-medium mt-0.5">
                  {new Date(sh.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              {sh.dispatchTime && (
                <div className="rounded-md border border-border/40 bg-background/60 p-2">
                  <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                    <Zap className="size-2.5" /> Dispatched
                  </p>
                  <p className="text-xs font-medium mt-0.5">
                    {new Date(sh.dispatchTime).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}
              {sh.deliveryTime && (
                <div className="rounded-md border border-border/40 bg-background/60 p-2">
                  <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="size-2.5" /> Delivered
                  </p>
                  <p className="text-xs font-medium mt-0.5">
                    {new Date(sh.deliveryTime).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 pb-1 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground">
              ID: <span className="font-mono">{sh.id}</span> · Last sync: just now
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] gap-1"
              onClick={() => toast.info("Opening POD", `Loading proof-of-delivery for ${sh.invoice}…`)}
            >
              <ChevronRight className="size-3" />
              View POD
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
