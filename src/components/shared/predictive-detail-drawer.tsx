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
  AlertTriangle,
  Activity,
  Brain,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Clock,
  Cpu,
  Database,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Download,
  Lightbulb,
  Gauge,
  Wrench,
  Users,
  Package,
  Truck,
  Flame,
  Snowflake,
  Bell,
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
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ── Types ────────────────────────────────────────────────────────────────────

export interface PredictiveAnomaly {
  id: string
  metric: string
  warehouse: string
  severity: "critical" | "warning" | "info"
  expected: number
  observed: number
  deviationPct: number
  detectedAt: string
  description: string
  recommendation: string
}

interface PredictiveDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  anomaly: PredictiveAnomaly | null
  onAcknowledge?: (a: PredictiveAnomaly) => void
  onResolve?: (a: PredictiveAnomaly) => void
}

// ── Deterministic helpers ────────────────────────────────────────────────────

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// ── Severity theming ─────────────────────────────────────────────────────────

const severityTheme = {
  critical: {
    gradient: "from-red-500/15 via-red-500/5 to-transparent",
    border: "border-red-500/40",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    ring: "ring-red-500/30",
    glow: "shadow-[0_0_30px_-8px_rgba(239,68,68,0.4)]",
    barFrom: "from-red-500",
    barTo: "to-red-400",
  },
  warning: {
    gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    border: "border-amber-500/40",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/30",
    glow: "shadow-[0_0_30px_-8px_rgba(245,158,11,0.4)]",
    barFrom: "from-amber-500",
    barTo: "to-amber-400",
  },
  info: {
    gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
    border: "border-blue-500/40",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/30",
    glow: "shadow-[0_0_30px_-8px_rgba(59,130,246,0.4)]",
    barFrom: "from-blue-500",
    barTo: "to-blue-400",
  },
} as const

// ── Metric-specific content ──────────────────────────────────────────────────

type MetricCategory = "throughput" | "cycle-time" | "utilization" | "energy" | "accuracy"

function categorize(metric: string): MetricCategory {
  const m = metric.toLowerCase()
  if (m.includes("throughput")) return "throughput"
  if (m.includes("cycle")) return "cycle-time"
  if (m.includes("utilization")) return "utilization"
  if (m.includes("energy")) return "energy"
  if (m.includes("accuracy")) return "accuracy"
  return "throughput"
}

function metricIcon(category: MetricCategory) {
  switch (category) {
    case "throughput": return Activity
    case "cycle-time": return Clock
    case "utilization": return Gauge
    case "energy": return Zap
    case "accuracy": return Target
  }
}

function metricUnit(category: MetricCategory): string {
  switch (category) {
    case "throughput": return "units/hr"
    case "cycle-time": return "min"
    case "utilization": return "%"
    case "energy": return "kWh"
    case "accuracy": return "%"
  }
}

// ── Root cause analysis ──────────────────────────────────────────────────────

interface RootCause {
  cause: string
  probability: number
  evidence: string
  category: "staffing" | "equipment" | "process" | "external" | "data-quality"
}

function getRootCauses(anomaly: PredictiveAnomaly): RootCause[] {
  const seed = hashStr(anomaly.id)
  const category = categorize(anomaly.metric)

  const base: Record<MetricCategory, RootCause[]> = {
    throughput: [
      {
        cause: "Insufficient forklift operator staffing on shift B",
        probability: 78,
        evidence: "Headcount 12 vs. forecast 16. Break ratio 18% above target.",
        category: "staffing",
      },
      {
        cause: "Dock door D-3 conveyor intermittent jam (45 min downtime)",
        probability: 64,
        evidence: "Sensor log shows 7 stop events in last 90 min.",
        category: "equipment",
      },
      {
        cause: "Wave picking sequence inefficient for SKU velocity change",
        probability: 41,
        evidence: "Pick path length 22% above optimal for ABC class A.",
        category: "process",
      },
    ],
    "cycle-time": [
      {
        cause: "Pick path suboptimal after SKU relocation",
        probability: 72,
        evidence: "Avg travel distance 38m vs. baseline 28m.",
        category: "process",
      },
      {
        cause: "RF scanner latency on bay C-12 (1.2s avg)",
        probability: 58,
        evidence: "Network packet loss 4.8% on AP-7.",
        category: "equipment",
      },
      {
        cause: "Insufficient packing stations for peak window",
        probability: 36,
        evidence: "Queue depth 6 vs. target 2.",
        category: "staffing",
      },
    ],
    utilization: [
      {
        cause: "Inbound truck arrival clustering (3 within 20 min)",
        probability: 81,
        evidence: "Yard management timestamp delta below SLA.",
        category: "external",
      },
      {
        cause: "Dock D-1 unavailable (maintenance window extended)",
        probability: 55,
        evidence: "CMMS shows reopen delayed by 35 min.",
        category: "equipment",
      },
      {
        cause: "Staging lane overflow cascading to dock hold",
        probability: 33,
        evidence: "Lane B at 96% capacity.",
        category: "process",
      },
    ],
    energy: [
      {
        cause: "Chiller defrost cycle extended (HVAC-2)",
        probability: 76,
        evidence: "Defrost duration 22 min vs. spec 12 min.",
        category: "equipment",
      },
      {
        cause: "Peak demand window not shifted (schedule drift)",
        probability: 49,
        evidence: "Load shift log shows 2 missed windows.",
        category: "process",
      },
      {
        cause: "External temperature spike (+4°C above forecast)",
        probability: 28,
        evidence: "Weather API delta confirmed.",
        category: "external",
      },
    ],
    accuracy: [
      {
        cause: "Barcode label degradation on SKU 4100-4199",
        probability: 84,
        evidence: "Scan retry rate 18% on this range vs. 2% baseline.",
        category: "data-quality",
      },
      {
        cause: "Picker on bay C-12 not retrained on new SKU layout",
        probability: 47,
        evidence: "Training log last entry 47 days ago.",
        category: "staffing",
      },
      {
        cause: "Pick verification camera misaligned on aisle C",
        probability: 29,
        evidence: "Image sharpness score below threshold.",
        category: "equipment",
      },
    ],
  }

  // Deterministically vary order
  const causes = [...base[category]]
  causes.sort((a, b) => ((seed >> 8) & 0x1) ? b.probability - a.probability : a.probability - b.probability)
  return causes.slice(0, 3 + (seed % 2))
}

// ── Recommendation actions ───────────────────────────────────────────────────

interface ActionItem {
  id: string
  action: string
  owner: string
  eta: string
  impact: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "done"
}

function getActionItems(anomaly: PredictiveAnomaly): ActionItem[] {
  const seed = hashStr(anomaly.id + "actions")
  const category = categorize(anomaly.metric)

  const base: Record<MetricCategory, ActionItem[]> = {
    throughput: [
      { id: "A1", action: "Deploy 3 cross-trained forklift operators from reserve pool", owner: "Shift Supervisor", eta: "15 min", impact: "high", status: "pending" },
      { id: "A2", action: "Dispatch maintenance tech to dock D-3 conveyor", owner: "Maintenance Lead", eta: "10 min", impact: "high", status: "pending" },
      { id: "A3", action: "Recalculate wave picking sequence for ABC class A", owner: "Operations Analyst", eta: "25 min", impact: "medium", status: "pending" },
      { id: "A4", action: "Notify customer success of potential 45-min recovery", owner: "CS Lead", eta: "5 min", impact: "low", status: "pending" },
    ],
    "cycle-time": [
      { id: "A1", action: "Optimize pick path for SKU relocation zones", owner: "Operations Analyst", eta: "20 min", impact: "high", status: "pending" },
      { id: "A2", action: "Reboot RF scanner AP-7 and verify latency", owner: "IT Ops", eta: "8 min", impact: "high", status: "pending" },
      { id: "A3", action: "Open auxiliary packing station P-4", owner: "Shift Supervisor", eta: "12 min", impact: "medium", status: "pending" },
    ],
    utilization: [
      { id: "A1", action: "Reroute 2 inbound trucks to secondary dock", owner: "Yard Manager", eta: "10 min", impact: "high", status: "pending" },
      { id: "A2", action: "Activate overflow staging lane B", owner: "Operations Lead", eta: "5 min", impact: "high", status: "pending" },
      { id: "A3", action: "Escalate D-1 maintenance reopen to CMMS priority 1", owner: "Maintenance Lead", eta: "15 min", impact: "medium", status: "pending" },
    ],
    energy: [
      { id: "A1", action: "Schedule HVAC-2 defrost cycle reset", owner: "Facilities", eta: "20 min", impact: "high", status: "pending" },
      { id: "A2", action: "Activate peak load shift on chiller group", owner: "Energy Manager", eta: "10 min", impact: "high", status: "pending" },
      { id: "A3", action: "Log schedule drift and update BMS rule", owner: "Facilities", eta: "30 min", impact: "medium", status: "pending" },
    ],
    accuracy: [
      { id: "A1", action: "Reprint barcode labels for SKU 4100-4199", owner: "Inventory Clerk", eta: "25 min", impact: "high", status: "pending" },
      { id: "A2", action: "Schedule picker retraining on bay C-12", owner: "Training Lead", eta: "1 hr", impact: "medium", status: "pending" },
      { id: "A3", action: "Realign pick verification camera on aisle C", owner: "Maintenance Tech", eta: "15 min", impact: "medium", status: "pending" },
      { id: "A4", action: "Quarantine SKU 4100-4199 stock until verified", owner: "QA Lead", eta: "5 min", impact: "high", status: "pending" },
    ],
  }

  const items = [...base[category]]
  // Mark first item as in-progress deterministically
  if (items.length > 0 && (seed & 0x1)) items[0].status = "in-progress"
  return items
}

// ── 24-hour trend ────────────────────────────────────────────────────────────

function getTrendData(anomaly: PredictiveAnomaly) {
  const seed = hashStr(anomaly.id)
  const points: Array<{
    hour: string
    baseline: number
    actual: number
    threshold: number
  }> = []
  const baseline = anomaly.expected
  const observed = anomaly.observed
  for (let i = 23; i >= 0; i--) {
    const hour = (24 - i + (seed % 6)) % 24
    const wave = Math.sin((hour + seed) * 0.5) * (baseline * 0.08)
    const driftDown = i < 6 ? (observed - baseline) * (1 - i / 6) : 0
    const noise = ((seed >> (i % 16)) & 0x7) * (baseline * 0.015)
    points.push({
      hour: `${String(hour).padStart(2, "0")}:00`,
      baseline: Math.round(baseline + wave),
      actual: Math.round(baseline + wave + driftDown - noise),
      threshold: Math.round(baseline * 0.85),
    })
  }
  return points
}

// ── ML model details ─────────────────────────────────────────────────────────

interface ModelDetail {
  name: string
  accuracy: number
  lastTrained: string
  features: number
  algorithm: string
}

function getModelDetails(anomaly: PredictiveAnomaly): ModelDetail {
  const seed = hashStr(anomaly.id)
  const category = categorize(anomaly.metric)
  const base: Record<MetricCategory, ModelDetail> = {
    throughput: { name: "THR-LSTM-v3.2", accuracy: 94.2, lastTrained: "6 hr ago", features: 47, algorithm: "LSTM + Attention" },
    "cycle-time": { name: "CYC-XGB-v2.1", accuracy: 91.8, lastTrained: "12 hr ago", features: 32, algorithm: "XGBoost Ensemble" },
    utilization: { name: "UTL-ARIMA-v4.0", accuracy: 96.1, lastTrained: "3 hr ago", features: 28, algorithm: "ARIMA + Fourier" },
    energy: { name: "ENR-PROPHET-v1.8", accuracy: 88.7, lastTrained: "1 day ago", features: 19, algorithm: "Prophet + Holidays" },
    accuracy: { name: "ACC-RF-v2.5", accuracy: 92.4, lastTrained: "8 hr ago", features: 41, algorithm: "Random Forest" },
  }
  const d = base[category]
  // Small deterministic variance
  return {
    ...d,
    accuracy: +(d.accuracy + ((seed % 7) - 3) * 0.1).toFixed(1),
  }
}

// ── Affected entities ────────────────────────────────────────────────────────

interface AffectedEntity {
  type: "warehouse" | "shipment" | "sku" | "employee" | "vehicle" | "customer"
  label: string
  detail: string
}

function getAffectedEntities(anomaly: PredictiveAnomaly): AffectedEntity[] {
  const seed = hashStr(anomaly.id)
  const category = categorize(anomaly.metric)
  const base: Record<MetricCategory, AffectedEntity[]> = {
    throughput: [
      { type: "warehouse", label: anomaly.warehouse, detail: "Primary impact zone — dock D-3" },
      { type: "employee", label: "12 forklift operators on shift B", detail: "Headcount below forecast" },
      { type: "shipment", label: "ASN-2024-0847, ASN-2024-0851", detail: "Inbound pending unloading" },
      { type: "customer", label: "Maruti Suzuki India", detail: "1 order SLA at risk (ETA +18 min)" },
    ],
    "cycle-time": [
      { type: "warehouse", label: anomaly.warehouse, detail: "Pick path zone C-12" },
      { type: "sku", label: "SKU 4100-4199 (relocated)", detail: "Velocity bin reclassification pending" },
      { type: "employee", label: "Picker ID P-023", detail: "Last retrained 47 days ago" },
    ],
    utilization: [
      { type: "warehouse", label: anomaly.warehouse, detail: "Dock cluster D-1 to D-4" },
      { type: "vehicle", label: "Trucks TN-09-AB-1234, TN-09-XY-5678", detail: "Queued >25 min" },
      { type: "shipment", label: "3 inbound ASNs", detail: "Awaiting dock assignment" },
    ],
    energy: [
      { type: "warehouse", label: anomaly.warehouse, detail: "HVAC-2 chiller group" },
      { type: "employee", label: "Facilities team on call", detail: "1 technician on-site" },
    ],
    accuracy: [
      { type: "sku", label: "SKU 4100-4199", detail: "Label integrity degraded" },
      { type: "employee", label: "Picker P-023 (bay C-12)", detail: "Error cluster 4.2σ above peer mean" },
      { type: "warehouse", label: anomaly.warehouse, detail: "Aisle C camera misalignment" },
    ],
  }
  const entities = [...base[category]]
  return entities.slice(0, 3 + (seed % 2))
}

// ── Component ────────────────────────────────────────────────────────────────

const entityIcon = {
  warehouse: Package,
  shipment: Truck,
  sku: Database,
  employee: Users,
  vehicle: Truck,
  customer: Sparkles,
} as const

const impactColor = {
  high: "text-red-600 dark:text-red-400 bg-red-500/10",
  medium: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  low: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
} as const

const statusColor = {
  pending: "text-muted-foreground bg-muted",
  "in-progress": "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  done: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
} as const

export function PredictiveDetailDrawer({
  open,
  onOpenChange,
  anomaly,
  onAcknowledge,
  onResolve,
}: PredictiveDetailDrawerProps) {
  const { toast } = useToast()

  // Compute everything unconditionally (Rules of Hooks)
  const theme = anomaly ? severityTheme[anomaly.severity] : severityTheme.info
  const category = anomaly ? categorize(anomaly.metric) : "throughput"
  const Icon = metricIcon(category)
  const unit = metricUnit(category)

  const rootCauses = React.useMemo(
    () => (anomaly ? getRootCauses(anomaly) : []),
    [anomaly]
  )
  const actionItems = React.useMemo(
    () => (anomaly ? getActionItems(anomaly) : []),
    [anomaly]
  )
  const trendData = React.useMemo(
    () => (anomaly ? getTrendData(anomaly) : []),
    [anomaly]
  )
  const model = React.useMemo(
    () => (anomaly ? getModelDetails(anomaly) : null),
    [anomaly]
  )
  const affected = React.useMemo(
    () => (anomaly ? getAffectedEntities(anomaly) : []),
    [anomaly]
  )

  const [actions, setActions] = React.useState<ActionItem[]>([])
  React.useEffect(() => {
    setActions(actionItems)
  }, [actionItems])

  if (!anomaly) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto" />
      </Sheet>
    )
  }

  const deviation = Math.abs(anomaly.deviationPct)
  const isPositiveDev = anomaly.deviationPct > 0

  const chartConfig: ChartConfig = {
    baseline: { label: "Baseline", color: "#94a3b8" },
    actual: { label: "Actual", color: theme.text.includes("red") ? "#ef4444" : theme.text.includes("amber") ? "#f59e0b" : "#3b82f6" },
    threshold: { label: "Threshold", color: "#ef4444" },
  }

  const handleAcknowledge = () => {
    toast.success("Anomaly acknowledged", `${anomaly.metric} at ${anomaly.warehouse}`)
    onAcknowledge?.(anomaly)
  }

  const handleResolve = () => {
    toast.success("Anomaly resolved", `${anomaly.metric} marked as resolved`)
    onResolve?.(anomaly)
    onOpenChange(false)
  }

  const handleExport = () => {
    const csv = [
      `Anomaly Report - ${anomaly.id}`,
      `Metric,${anomaly.metric}`,
      `Warehouse,${anomaly.warehouse}`,
      `Severity,${anomaly.severity}`,
      `Expected,${anomaly.expected}`,
      `Observed,${anomaly.observed}`,
      `Deviation %,${anomaly.deviationPct}`,
      `Detected,${anomaly.detectedAt}`,
      ``,
      `Description:,${anomaly.description}`,
      `Recommendation:,${anomaly.recommendation}`,
      ``,
      `Root Causes:`,
      ...rootCauses.map((rc, i) => `${i + 1}. ${rc.cause} (${rc.probability}% probability) — ${rc.evidence}`),
      ``,
      `Action Items:`,
      ...actions.map((a) => `${a.id}. [${a.status}] ${a.action} (Owner: ${a.owner}, ETA: ${a.eta}, Impact: ${a.impact})`),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `anomaly-${anomaly.id}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Report exported", `anomaly-${anomaly.id}.csv`)
  }

  const toggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "done" ? "pending" : a.status === "in-progress" ? "done" : "in-progress" }
          : a
      )
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header strip with severity gradient + sheen */}
        <div className={cn(
          "predictive-drawer-header relative overflow-hidden bg-gradient-to-br border-b",
          theme.gradient,
          theme.border,
          theme.glow
        )}>
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          </div>
          <SheetHeader className="p-5 pb-4 relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={cn(
                  "predictive-icon-pulse size-11 rounded-xl flex items-center justify-center shrink-0",
                  theme.bg,
                  theme.text
                )}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider font-bold", theme.text, theme.border)}>
                      {anomaly.severity}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      <Brain className="size-2.5 mr-1" />
                      {anomaly.id}
                    </Badge>
                  </div>
                  <SheetTitle className="text-lg font-bold leading-tight">
                    {anomaly.metric}
                  </SheetTitle>
                  <SheetDescription className="text-xs mt-0.5">
                    {anomaly.warehouse} · Detected {anomaly.detectedAt}
                  </SheetDescription>
                </div>
              </div>
            </div>

            {/* Hero metrics */}
            <div className="predictive-stat-enter grid grid-cols-4 gap-2 mt-4">
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Expected</p>
                <p className="text-sm font-bold text-number tabular-nums">{anomaly.expected.toLocaleString("en-IN")}</p>
                <p className="text-[9px] text-muted-foreground">{unit}</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Observed</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", theme.text)}>{anomaly.observed.toLocaleString("en-IN")}</p>
                <p className="text-[9px] text-muted-foreground">{unit}</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Deviation</p>
                <p className={cn("text-sm font-bold text-number tabular-nums flex items-center gap-0.5", theme.text)}>
                  {isPositiveDev ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {deviation.toFixed(1)}%
                </p>
                <p className="text-[9px] text-muted-foreground">{isPositiveDev ? "above" : "below"} baseline</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Model Conf.</p>
                <p className="text-sm font-bold text-number tabular-nums">{model?.accuracy.toFixed(1)}%</p>
                <p className="text-[9px] text-muted-foreground">{model?.algorithm.split(" ")[0]}</p>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="predictive-drawer-body-enter p-5 space-y-5">
          {/* Description card */}
          <Card className="border-border/40">
            <CardContent className="p-4">
              <div className="flex items-start gap-2.5">
                <div className={cn("size-7 rounded-md flex items-center justify-center shrink-0 mt-0.5", theme.bg, theme.text)}>
                  <AlertTriangle className="size-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-foreground mb-1">Anomaly Description</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{anomaly.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 24-hour trend chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Activity className="size-3.5 text-muted-foreground" />
                24-Hour Trend vs. Baseline
              </h3>
              <Badge variant="outline" className="text-[9px]">Last 24h</Badge>
            </div>
            <Card className="border-border/40">
              <CardContent className="p-3">
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                  <AreaChart data={trendData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.text.includes("red") ? "#ef4444" : theme.text.includes("amber") ? "#f59e0b" : "#3b82f6"} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={theme.text.includes("red") ? "#ef4444" : theme.text.includes("amber") ? "#f59e0b" : "#3b82f6"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="hour" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
                    <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ReferenceLine y={trendData[0]?.threshold} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1} />
                    <Area
                      type="monotone"
                      dataKey="baseline"
                      stroke="#94a3b8"
                      strokeWidth={1.5}
                      strokeDasharray="4 2"
                      fill="none"
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke={theme.text.includes("red") ? "#ef4444" : theme.text.includes("amber") ? "#f59e0b" : "#3b82f6"}
                      strokeWidth={2}
                      fill="url(#actualGrad)"
                    />
                  </AreaChart>
                </ChartContainer>
                <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-slate-400" /> Baseline (ML forecast)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className={cn("size-2 rounded-full", theme.text.includes("red") ? "bg-red-500" : theme.text.includes("amber") ? "bg-amber-500" : "bg-blue-500")} /> Actual
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-red-500" /> Threshold
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Root cause analysis */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Cpu className="size-3.5 text-muted-foreground" />
              Root Cause Analysis
              <Badge variant="outline" className="text-[9px] ml-1">ML-inferred</Badge>
            </h3>
            <div className="space-y-2">
              {rootCauses.map((rc, i) => (
                <div
                  key={i}
                  className="predictive-card-enter rounded-lg border border-border/40 bg-background/60 p-3"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <Badge variant="outline" className="text-[9px] uppercase shrink-0 mt-0.5">
                        {rc.category}
                      </Badge>
                      <p className="text-xs font-medium text-foreground leading-snug">{rc.cause}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Probability</p>
                      <p className={cn("text-sm font-bold text-number", rc.probability > 70 ? "text-red-600 dark:text-red-400" : rc.probability > 50 ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400")}>
                        {rc.probability}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={rc.probability} className="h-1" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 italic">
                    <ChevronRight className="size-2.5 inline mr-0.5" />
                    {rc.evidence}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ML model details */}
          {model && (
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Brain className="size-3.5 text-muted-foreground" />
                Detection Model
              </h3>
              <Card className="border-border/40">
                <CardContent className="p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Model</p>
                      <p className="text-xs font-mono font-semibold">{model.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Algorithm</p>
                      <p className="text-xs font-medium">{model.algorithm}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Accuracy</p>
                      <p className="text-xs font-bold text-number text-emerald-600 dark:text-emerald-400">{model.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Features</p>
                      <p className="text-xs font-bold text-number">{model.features}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Last Trained</p>
                      <p className="text-xs">{model.lastTrained}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Detection Latency</p>
                      <p className="text-xs font-bold text-number text-emerald-600 dark:text-emerald-400">{(hashStr(anomaly.id) % 40 + 10)}s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Affected entities */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-muted-foreground" />
              Affected Entities
            </h3>
            <div className="space-y-1.5">
              {affected.map((e, i) => {
                const EIcon = entityIcon[e.type]
                return (
                  <div
                    key={i}
                    className="predictive-card-enter flex items-center gap-2.5 rounded-lg border border-border/40 bg-background/60 px-3 py-2"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="size-7 rounded-md bg-muted/40 flex items-center justify-center shrink-0">
                      <EIcon className="size-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{e.label}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{e.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Wrench className="size-3.5 text-muted-foreground" />
                Recommended Actions
              </h3>
              <Badge variant="outline" className="text-[9px]">
                {actions.filter((a) => a.status === "done").length}/{actions.length} done
              </Badge>
            </div>
            <div className="space-y-1.5">
              {actions.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => toggleAction(a.id)}
                  className={cn(
                    "predictive-card-enter w-full text-left flex items-center gap-2.5 rounded-lg border bg-background/60 px-3 py-2 transition-all hover:bg-accent/40",
                    a.status === "done" ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/40"
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={cn(
                    "size-5 rounded-full flex items-center justify-center shrink-0 border",
                    a.status === "done" ? "border-emerald-500 bg-emerald-500 text-white" :
                    a.status === "in-progress" ? "border-blue-500 bg-blue-500/10 text-blue-500" :
                    "border-muted-foreground/30"
                  )}>
                    {a.status === "done" && <CheckCircle2 className="size-3" />}
                    {a.status === "in-progress" && <Clock className="size-3 animate-pulse" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-xs font-medium leading-snug",
                      a.status === "done" && "line-through text-muted-foreground"
                    )}>
                      {a.action}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {a.owner} · ETA {a.eta}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("text-[9px] uppercase shrink-0", impactColor[a.impact])}>
                    {a.impact}
                  </Badge>
                </button>
              ))}
            </div>
            <div className="mt-2">
              <Progress value={(actions.filter((a) => a.status === "done").length / actions.length) * 100} className="h-1" />
            </div>
          </div>

          <Separator />

          {/* Footer actions */}
          <div className="flex items-center gap-2 pb-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={handleExport}>
              <Download className="size-3.5" />
              Export Report
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={handleAcknowledge}>
              <Bell className="size-3.5" />
              Acknowledge
            </Button>
            <Button size="sm" className={cn("gap-1.5 text-xs h-8 ml-auto", theme.text.replace("text-", "bg-").replace("600", "500").replace("400", "500"))} onClick={handleResolve}>
              <CheckCircle2 className="size-3.5" />
              Mark Resolved
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
