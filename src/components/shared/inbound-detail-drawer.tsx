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
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts"
import {
  PackageSearch,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Truck,
  Globe,
  Home,
  Building2,
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
  ClipboardCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"
import type { InboundShipment } from "@/data/mock-data"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InboundDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shipment: InboundShipment | null
  onAdvanceStep?: (shipment: InboundShipment) => void
  onHold?: (shipment: InboundShipment) => void
}

interface CargoItem {
  sku: string
  description: string
  qty: number
  uom: string
  weight: number
  condition: "ok" | "damaged" | "quarantine"
}

interface InspectionFinding {
  id: string
  severity: "info" | "warning" | "critical"
  title: string
  detail: string
  count: number
}

interface UnloadingMetric {
  label: string
  value: number
  unit: string
  target: number
}

// ---------------------------------------------------------------------------
// Deterministic mock generators
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function getCargoItems(shipment: InboundShipment): CargoItem[] {
  const seed = hashStr(shipment.id)
  const items: Array<{ sku: string; description: string; uom: string; weight: number }> = [
    { sku: "ENG-CY-001", description: "Cylinder Block Assembly", uom: "PCS", weight: 38 },
    { sku: "ENG-PN-014", description: "Piston Ring Set (Std)", uom: "SET", weight: 1.2 },
    { sku: "TRN-GB-205", description: "Gearbox Housing", uom: "PCS", weight: 22 },
    { sku: "BRK-PD-310", description: "Brake Pad Premium", uom: "SET", weight: 0.8 },
    { sku: "SUS-SH-415", description: "Shock Absorber Front", uom: "PCS", weight: 4.5 },
    { sku: "ELC-BT-502", description: "Battery 12V 80Ah", uom: "PCS", weight: 18 },
  ]
  const conditions: CargoItem["condition"][] = ["ok", "ok", "ok", "ok", "damaged", "quarantine"]
  return items.map((it, i) => {
    const qty = 25 + ((seed + i * 17) % 175)
    const condIdx = (seed + i * 3) % 6
    return {
      ...it,
      qty,
      condition: i === 4 && (seed % 3 === 0) ? "damaged" : i === 5 && (seed % 5 === 0) ? "quarantine" : "ok",
    } as CargoItem
  }).slice(0, 4 + (seed % 3))
}

function getInspectionFindings(shipment: InboundShipment): InspectionFinding[] {
  const seed = hashStr(shipment.id + "insp")
  const all: InspectionFinding[] = [
    { id: "F-001", severity: "info", title: "Packaging intact", detail: "All cartons sealed, no visible damage", count: 18 },
    { id: "F-002", severity: "warning", title: "Label smudge on 2 cartons", detail: "Barcodes still scannable, manual verification done", count: 2 },
    { id: "F-003", severity: "warning", title: "Temperature excursion (15 min)", detail: "Cold chain log shows 9°C for 15min (spec: 2-8°C)", count: 1 },
    { id: "F-004", severity: "critical", title: "Dented carton — possible product damage", detail: "Corner impact, awaiting QA disposition", count: 1 },
    { id: "F-005", severity: "info", title: "Documentation complete", detail: "Invoice, PL, COO matched against PO", count: 3 },
  ]
  // Return 3-5 findings deterministically
  const count = 3 + (seed % 3)
  return all.slice(0, count)
}

function getUnloadingMetrics(shipment: InboundShipment): UnloadingMetric[] {
  const seed = hashStr(shipment.id + "unload")
  const palletCount = 12 + (seed % 18)
  const cartonCount = palletCount * (8 + (seed % 6))
  const totalTime = 65 + (seed % 55)
  const workers = 4 + (seed % 3)
  return [
    { label: "Pallets", value: palletCount, unit: "ea", target: 30 },
    { label: "Cartons", value: cartonCount, unit: "ea", target: 250 },
    { label: "Unload Time", value: totalTime, unit: "min", target: 90 },
    { label: "Workers", value: workers, unit: "ppl", target: 6 },
  ]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InboundDetailDrawer({
  open,
  onOpenChange,
  shipment,
  onAdvanceStep,
  onHold,
}: InboundDetailDrawerProps) {
  const { toast } = useToast()

  // Compute all derived data unconditionally (Rules of Hooks).
  const cargoItems = React.useMemo(() => shipment ? getCargoItems(shipment) : [], [shipment])
  const findings = React.useMemo(() => shipment ? getInspectionFindings(shipment) : [], [shipment])
  const metrics = React.useMemo(() => shipment ? getUnloadingMetrics(shipment) : [], [shipment])

  // SLA radial chart data
  const slaData = React.useMemo(() => {
    if (!shipment) return []
    return [{ name: "SLA", value: shipment.slaProgress, fill: shipment.slaProgress > 80 ? "#10B981" : shipment.slaProgress > 50 ? "#F59E0B" : "#EF4444" }]
  }, [shipment])

  // Step chart data — for each timeline step, show duration in minutes
  const stepDurationData = React.useMemo(() => {
    if (!shipment) return []
    return shipment.timeline.map((step, i) => {
      const match = step.duration?.match(/(\d+)\s*min/)
      const minutes = match ? parseInt(match[1], 10) : (i === 0 ? 15 : 30)
      return {
        step: step.label.split(" ")[0],
        minutes,
        status: step.status,
      }
    })
  }, [shipment])

  if (!shipment) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-[680px] p-0 overflow-y-auto" />
      </Sheet>
    )
  }

  const sh = shipment
  const currentStep = sh.timeline.find((s) => s.status === "in-progress")
  const completedSteps = sh.timeline.filter((s) => s.status === "completed").length
  const totalSteps = sh.timeline.length
  const progressPct = Math.round((completedSteps / totalSteps) * 100)

  const isDelayed = sh.status === "Delayed"
  const isCompleted = sh.status === "Completed"
  const isOnHold = sh.status === "On Hold"

  const statusColor = isDelayed ? "text-red-600 dark:text-red-400" :
                      isCompleted ? "text-emerald-600 dark:text-emerald-400" :
                      isOnHold ? "text-amber-600 dark:text-amber-400" :
                      "text-blue-600 dark:text-blue-400"

  const statusBg = isDelayed ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800" :
                   isCompleted ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" :
                   isOnHold ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" :
                   "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800"

  const totalWeight = cargoItems.reduce((s, c) => s + c.weight * c.qty, 0)
  const totalQty = cargoItems.reduce((s, c) => s + c.qty, 0)
  const damagedCount = cargoItems.filter((c) => c.condition !== "ok").length

  const handleExport = () => {
    const data = cargoItems.map((c) => ({
      SKU: c.sku,
      Description: c.description,
      Qty: c.qty,
      UOM: c.uom,
      "Weight (kg)": c.weight,
      "Total Weight (kg)": (c.weight * c.qty).toFixed(1),
      Condition: c.condition,
    }))
    exportToCSV(data, `inbound-${sh.invoice}`, ["SKU", "Description", "Qty", "UOM", "Weight (kg)", "Total Weight (kg)", "Condition"])
  }

  const handleAdvance = () => {
    toast.success("Step Advanced", `${currentStep?.label || "Current step"} → next stage. Timeline updated.`)
    onAdvanceStep?.(sh)
  }

  const handleHold = () => {
    toast.warning("Shipment On Hold", `${sh.invoice} held pending QC review.`)
    onHold?.(sh)
  }

  const handleRefresh = () => {
    toast.info("Refreshing", `Re-fetching timeline for ${sh.invoice}…`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[680px] p-0 overflow-y-auto"
      >
        {/* Header strip */}
        <div className={cn(
          "sticky top-0 z-20 bg-gradient-to-br backdrop-blur-sm border-b inb-drawer-header",
          statusBg
        )}>
          <SheetHeader className="space-y-0 p-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "relative flex size-14 items-center justify-center rounded-2xl border-2 shadow-md inb-icon-pulse",
                  statusBg
                )}>
                  <PackageSearch className={cn("size-7", statusColor)} />
                  <div className={cn(
                    "absolute -top-1.5 -right-1.5 size-5 rounded-full bg-background border-2 flex items-center justify-center",
                    statusBg.replace("bg-", "border-").split(" ")[0]
                  )}>
                    <div className={cn("size-2 rounded-full", statusColor.replace("text-", "bg-"))} />
                  </div>
                </div>
                <div className="space-y-1">
                  <SheetTitle className="text-lg font-semibold leading-tight flex items-center gap-2">
                    <span className="font-mono">{sh.invoice}</span>
                    <Badge variant="outline" className={cn("text-[10px] gap-1", statusColor)}>
                      {sh.type === "Domestic" ? <Home className="size-2.5" /> : <Globe className="size-2.5" />}
                      {sh.type}
                    </Badge>
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground">
                    {sh.supplier} · {sh.warehouse}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8" onClick={handleRefresh} title="Refresh data">
                  <RefreshCw className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={handleExport} title="Export cargo list">
                  <Download className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Hero metrics */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 inb-stat-enter" style={{ animationDelay: "0ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Status</p>
                <p className={cn("mt-0.5 text-sm font-bold", statusColor)}>{sh.status}</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 inb-stat-enter" style={{ animationDelay: "60ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">SLA Progress</p>
                <p className="mt-0.5 text-sm font-bold text-number">{sh.slaProgress}%</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 inb-stat-enter" style={{ animationDelay: "120ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Current Step</p>
                <p className="mt-0.5 text-sm font-bold truncate" title={currentStep?.label || "—"}>
                  {currentStep?.label || "—"}
                </p>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 inb-drawer-body-enter">

          {/* SLA + Progress overview */}
          <div className="rounded-lg border border-border/60 bg-card p-4 inb-card-enter">
            <div className="grid gap-4 md:grid-cols-[140px_1fr]">
              <div className="flex flex-col items-center">
                <ChartContainer
                  config={{ value: { label: "SLA", color: "#2563EB" } }}
                  className="size-[120px]"
                >
                  <RadialBarChart data={slaData} innerRadius={45} outerRadius={60} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" background cornerRadius={8} />
                  </RadialBarChart>
                </ChartContainer>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className={cn("font-bold text-sm", statusColor)}>{sh.slaProgress}%</span> SLA
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="size-3" />
                  Pipeline Progress
                </h3>
                <div className="flex items-center gap-2">
                  <Progress value={progressPct} className="h-2 flex-1" />
                  <span className="text-xs font-semibold text-number">
                    {completedSteps}/{totalSteps}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="rounded-md border border-border/40 bg-background/60 p-2">
                    <p className="text-[9px] uppercase text-muted-foreground">Created</p>
                    <p className="text-xs font-medium">
                      {new Date(sh.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="rounded-md border border-border/40 bg-background/60 p-2">
                    <p className="text-[9px] uppercase text-muted-foreground">Shipment ID</p>
                    <p className="text-xs font-mono">{sh.id}</p>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  {!isCompleted && (
                    <Button size="sm" className="h-7 text-[10px] gap-1" onClick={handleAdvance}>
                      <Zap className="size-2.5" />
                      Advance Step
                    </Button>
                  )}
                  {!isOnHold && !isCompleted && (
                    <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={handleHold}>
                      <AlertCircle className="size-2.5" />
                      Put on Hold
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-border/60 bg-card p-4 inb-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <History className="size-3" />
                Process Timeline
              </h3>
              <Badge variant="outline" className="text-[10px]">
                {completedSteps} of {totalSteps} done
              </Badge>
            </div>
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-400/60 via-border/40 to-transparent" />
              <div className="space-y-3">
                {sh.timeline.map((step, i) => {
                  const Icon = step.status === "completed" ? CheckCircle2 : step.status === "in-progress" ? Clock : Circle
                  const accentClass = step.status === "completed"
                    ? "border-emerald-500 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                    : step.status === "in-progress"
                    ? "border-blue-500 bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    : "border-muted bg-muted text-muted-foreground"
                  return (
                    <div
                      key={step.step}
                      className="relative flex items-start gap-3 inb-timeline-enter"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className={cn(
                        "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                        accentClass,
                        step.status === "in-progress" && "inb-step-active"
                      )}>
                        <Icon className="size-3" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-medium leading-snug">{step.label}</p>
                          {step.status === "in-progress" && (
                            <Badge variant="outline" className="text-[9px] gap-1 border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400">
                              <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                              Live
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          {step.duration && step.duration !== "-" && <span className="flex items-center gap-0.5"><Clock className="size-2.5" />{step.duration}</span>}
                          {step.user && step.user !== "-" && <span className="flex items-center gap-0.5"><User className="size-2.5" />{step.user}</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Step duration chart */}
          {stepDurationData.length > 0 && (
            <div className="rounded-lg border border-border/60 bg-card p-4 inb-card-enter">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="size-3" />
                  Step Duration Analysis
                </h3>
                <span className="text-[10px] text-muted-foreground">minutes per step</span>
              </div>
              <ChartContainer
                config={{ minutes: { label: "Minutes", color: "#2563EB" } }}
                className="h-[140px] w-full"
              >
                <BarChart data={stepDurationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                  <XAxis dataKey="step" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(val: number) => [`${val} min`, "Duration"]}
                      />
                    }
                  />
                  <Bar dataKey="minutes" fill="#2563EB" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          )}

          {/* Cargo manifest */}
          <div className="rounded-lg border border-border/60 bg-card p-4 inb-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ClipboardCheck className="size-3" />
                Cargo Manifest
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{cargoItems.length} SKUs</span>
                <span>·</span>
                <span className="text-number">{totalQty} units</span>
                <span>·</span>
                <span className="text-number">{totalWeight.toFixed(1)} kg</span>
                {damagedCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                      <AlertTriangle className="size-2.5" />
                      {damagedCount} flagged
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              {cargoItems.map((item, i) => (
                <div
                  key={item.sku}
                  className="inb-cargo-row group flex items-center gap-3 rounded-md border border-border/40 bg-background/60 px-2.5 py-2"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md text-[9px] font-bold",
                    item.condition === "ok" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                    item.condition === "damaged" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  )}>
                    {item.condition === "ok" ? <CheckCircle2 className="size-3.5" /> :
                     item.condition === "damaged" ? <AlertTriangle className="size-3.5" /> :
                     <AlertCircle className="size-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-tight">
                      <span className="font-mono text-[10px] text-muted-foreground">{item.sku}</span>
                      <span className="ml-2">{item.description}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {item.qty} {item.uom} · {item.weight} kg each
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-number">
                      {(item.weight * item.qty).toFixed(1)} kg
                    </p>
                    <p className="text-[9px] text-muted-foreground">total weight</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unloading metrics */}
          <div className="rounded-lg border border-border/60 bg-card p-4 inb-card-enter">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Truck className="size-3" />
              Unloading Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {metrics.map((m, i) => {
                const pct = Math.min(100, Math.round((m.value / m.target) * 100))
                const isOver = m.label === "Unload Time" && m.value > m.target
                const color = isOver ? "text-red-600 dark:text-red-400" : "text-foreground"
                return (
                  <div
                    key={m.label}
                    className="rounded-md border border-border/40 bg-background/60 p-2.5 inb-metric-enter"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                    <p className={cn("mt-0.5 text-base font-bold text-number", color)}>
                      {m.value}<span className="text-[10px] text-muted-foreground ml-0.5">{m.unit}</span>
                    </p>
                    <div className="mt-1.5 h-1 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full inb-fill-animate",
                          isOver ? "bg-red-500" : "bg-blue-500"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-[9px] text-muted-foreground">target: {m.target} {m.unit}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Inspection findings */}
          <div className="rounded-lg border border-border/60 bg-card p-4 inb-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ClipboardCheck className="size-3" />
                Inspection Findings
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {findings.filter((f) => f.severity === "critical").length} critical · {findings.filter((f) => f.severity === "warning").length} warnings
              </span>
            </div>
            <div className="space-y-2">
              {findings.map((f, i) => {
                const sevColor = f.severity === "critical"
                  ? "border-red-200 dark:border-red-800 bg-red-50/40 dark:bg-red-950/20"
                  : f.severity === "warning"
                  ? "border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20"
                  : "border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20"
                const sevText = f.severity === "critical"
                  ? "text-red-700 dark:text-red-400"
                  : f.severity === "warning"
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-blue-700 dark:text-blue-400"
                const SevIcon = f.severity === "critical" ? AlertCircle : f.severity === "warning" ? AlertTriangle : Sparkles
                return (
                  <div
                    key={f.id}
                    className={cn("rounded-md border p-2.5 inb-finding-enter", sevColor)}
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <div className="flex items-start gap-2">
                      <SevIcon className={cn("size-3.5 shrink-0 mt-0.5", sevText)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold leading-tight">{f.title}</p>
                          {f.count > 1 && (
                            <Badge variant="outline" className={cn("text-[9px] h-4 px-1.5", sevText)}>
                              ×{f.count}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{f.detail}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick info */}
          <div className="rounded-lg border border-border/60 bg-card p-4 inb-card-enter">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="size-3" />
              Shipment Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Building2 className="size-2.5" /> Supplier
                </p>
                <p className="text-xs font-medium mt-0.5">{sh.supplier}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-2.5" /> Warehouse
                </p>
                <p className="text-xs font-medium mt-0.5">{sh.warehouse}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-2.5" /> Created
                </p>
                <p className="text-xs font-medium mt-0.5">
                  {new Date(sh.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <FileText className="size-2.5" /> Invoice
                </p>
                <p className="text-xs font-mono mt-0.5">{sh.invoice}</p>
              </div>
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
              onClick={() => toast.info("Opening ledger", `Loading GRN ledger for ${sh.invoice}…`)}
            >
              <ChevronRight className="size-3" />
              View ledger
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
