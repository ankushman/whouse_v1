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
  Timer,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Download,
  Truck,
  Package,
  ArrowRightLeft,
  Warehouse,
  User,
  Phone,
  Mail,
  Bell,
  Zap,
  Target,
  Gauge,
  Activity,
  AlertCircle,
  ShieldAlert,
  Calendar,
  FileText,
  Sparkles,
  Flame,
  Snowflake,
  Pause,
  Play,
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
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ── Types ────────────────────────────────────────────────────────────────────

export interface SLADetailItem {
  id: string
  shipmentId: string
  type: "Inbound" | "Outbound" | "Cross-Dock"
  customer: string
  warehouse: string
  deadline: Date
  status: "on-track" | "at-risk" | "breached" | "completed"
  progress: number
  remainingMs: number
  priority: "high" | "medium" | "low"
  handler: string
}

interface SLACountdownDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: SLADetailItem | null
}

// ── Status theming ───────────────────────────────────────────────────────────

const statusTheme = {
  "on-track": {
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/40",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(16,185,129,0.4)]",
    label: "On Track",
    bar: "bg-emerald-500",
  },
  "at-risk": {
    gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    border: "border-amber-500/40",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(245,158,11,0.4)]",
    label: "At Risk",
    bar: "bg-amber-500",
  },
  breached: {
    gradient: "from-red-500/15 via-red-500/5 to-transparent",
    border: "border-red-500/40",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(239,68,68,0.4)]",
    label: "Breached",
    bar: "bg-red-500",
  },
  completed: {
    gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
    border: "border-blue-500/40",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(59,130,246,0.4)]",
    label: "Completed",
    bar: "bg-blue-500",
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

const MIN = 60_000
const HOUR = 3_600_000

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(Math.abs(ms) / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

// ── Shipment lifecycle timeline ──────────────────────────────────────────────

interface LifecycleEvent {
  time: string
  status: "completed" | "current" | "pending"
  label: string
  detail: string
  actor: string
}

function getLifecycle(item: SLADetailItem): LifecycleEvent[] {
  const seed = hashStr(item.id)
  const now = Date.now()
  const isBreached = item.status === "breached"
  const isCompleted = item.status === "completed"
  const progressIdx = Math.min(3, Math.floor(item.progress / 25))

  const events: LifecycleEvent[] = [
    {
      time: new Date(now - 4 * HOUR).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: "completed",
      label: "Order Received",
      detail: `${item.type} order from ${item.customer} registered in WMS`,
      actor: "System",
    },
    {
      time: new Date(now - 3 * HOUR + (seed % 30) * MIN).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: progressIdx >= 1 ? "completed" : "current",
      label: "Pick Started",
      detail: `Picker assigned to ${item.warehouse} — wave #${4821 + (seed % 100)}`,
      actor: item.handler,
    },
    {
      time: new Date(now - 2 * HOUR + (seed % 45) * MIN).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: progressIdx >= 2 ? "completed" : progressIdx === 1 ? "current" : "pending",
      label: "Pack Complete",
      detail: `${8 + (seed % 15)} items packed — QC passed`,
      actor: "Packaging Team",
    },
    {
      time: new Date(now - 1 * HOUR + (seed % 30) * MIN).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: progressIdx >= 3 ? "completed" : progressIdx === 2 ? "current" : "pending",
      label: "Dispatch Ready",
      detail: `Staged at dock D-${1 + (seed % 4)} — vehicle TN-09-AB-${1000 + (seed % 9000)} assigned`,
      actor: "Yard Manager",
    },
    {
      time: item.deadline.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: isCompleted ? "completed" : isBreached ? "completed" : "pending",
      label: isBreached ? "SLA Deadline Missed" : "Delivery Confirmed",
      detail: isBreached
        ? `Deadline passed ${formatCountdown(item.remainingMs)} ago — escalation triggered`
        : isCompleted
          ? `Delivered to ${item.customer} — POD captured`
          : `Target delivery window — ${item.customer} awaiting`,
      actor: isCompleted || isBreached ? "System" : "Customer",
    },
  ]
  return events
}

// ── 12-hour SLA progress trend ───────────────────────────────────────────────

interface ProgressPoint {
  hour: string
  expected: number
  actual: number
  threshold: number
}

function getProgressTrend(item: SLADetailItem): ProgressPoint[] {
  const seed = hashStr(item.id)
  const points: ProgressPoint[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 30 * MIN)
    const label = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    const expectedProgress = Math.max(0, Math.min(100, 100 - (i * (100 / 12))))
    const lag = (item.status === "at-risk" || item.status === "breached") ? -8 - (seed % 6) : -2 + (seed % 4)
    const actualProgress = Math.max(0, Math.min(100, expectedProgress + lag + ((seed >> (i % 16)) & 0x3) - 1))
    points.push({
      hour: label,
      expected: Math.round(expectedProgress),
      actual: Math.round(actualProgress),
      threshold: Math.round(expectedProgress - 5),
    })
  }
  // Last point: actual current progress
  if (points.length > 0) {
    points[points.length - 1].actual = item.progress
  }
  return points
}

// ── Penalty / impact analysis ────────────────────────────────────────────────

interface ImpactMetric {
  label: string
  value: string
  delta: string
  severity: "good" | "warning" | "critical"
}

function getImpactMetrics(item: SLADetailItem): ImpactMetric[] {
  const seed = hashStr(item.id)
  const isBreached = item.status === "breached"
  const isAtRisk = item.status === "at-risk"

  return [
    {
      label: "Customer Penalty",
      value: `₹${(isBreached ? 25 + (seed % 50) : isAtRisk ? 5 + (seed % 10) : 0)}k`,
      delta: isBreached ? "SLA breached" : isAtRisk ? "At risk" : "No penalty",
      severity: isBreached ? "critical" : isAtRisk ? "warning" : "good",
    },
    {
      label: "Order Value",
      value: `₹${(2 + (seed % 8)).toFixed(1)}L`,
      delta: `${item.customer}`,
      severity: "good",
    },
    {
      label: "Customer Rating Impact",
      value: isBreached ? "-0.4" : isAtRisk ? "-0.1" : "0.0",
      delta: "stars (projected)",
      severity: isBreached ? "critical" : isAtRisk ? "warning" : "good",
    },
    {
      label: "Repeat Order Risk",
      value: isBreached ? "High" : isAtRisk ? "Medium" : "Low",
      delta: `${item.customer}`,
      severity: isBreached ? "critical" : isAtRisk ? "warning" : "good",
    },
  ]
}

// ── Escalation chain ─────────────────────────────────────────────────────────

interface EscalationLevel {
  level: number
  role: string
  name: string
  notifiedAt: string
  acknowledged: boolean
  action: string
}

function getEscalationChain(item: SLADetailItem): EscalationLevel[] {
  const seed = hashStr(item.id)
  const isBreached = item.status === "breached"
  const isAtRisk = item.status === "at-risk"
  const now = Date.now()

  return [
    {
      level: 1,
      role: "Shift Supervisor",
      name: item.handler,
      notifiedAt: new Date(now - 2 * HOUR).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      acknowledged: true,
      action: "Initial assignment — picker dispatched",
    },
    {
      level: 2,
      role: "Operations Manager",
      name: "Suresh Reddy",
      notifiedAt: new Date(now - 1 * HOUR - 15 * MIN).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      acknowledged: isAtRisk || isBreached,
      action: isAtRisk || isBreached ? "Resource reallocation approved" : "Monitoring — no action required",
    },
    {
      level: 3,
      role: "Regional Manager",
      name: "Amit Patel",
      notifiedAt: new Date(now - 30 * MIN).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      acknowledged: isBreached,
      action: isBreached ? "Customer escalation in progress" : "Will be notified if breached",
    },
    {
      level: 4,
      role: "Customer Success",
      name: "Kiran Joshi",
      notifiedAt: isBreached ? new Date(now - 15 * MIN).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—",
      acknowledged: isBreached,
      action: isBreached ? `Customer ${item.customer} notified — service credit approved` : "Standing by",
    },
  ]
}

// ── Recovery actions ─────────────────────────────────────────────────────────

interface RecoveryAction {
  id: string
  action: string
  impact: "high" | "medium" | "low"
  eta: string
  owner: string
  status: "pending" | "in-progress" | "done"
}

function getRecoveryActions(item: SLADetailItem): RecoveryAction[] {
  const seed = hashStr(item.id)
  const isBreached = item.status === "breached"
  const isAtRisk = item.status === "at-risk"

  if (item.status === "on-track" || item.status === "completed") {
    return [
      { id: "R1", action: "Continue current pace — no intervention needed", impact: "low", eta: "—", owner: item.handler, status: "in-progress" },
      { id: "R2", action: "Monitor progress at next checkpoint (15 min)", impact: "low", eta: "15 min", owner: "System", status: "pending" },
    ]
  }

  return [
    { id: "R1", action: `Deploy 2 additional pickers to ${item.warehouse}`, impact: "high", eta: "10 min", owner: "Shift Supervisor", status: isBreached ? "done" : "in-progress" },
    { id: "R2", action: "Priority lane assignment at dock D-1", impact: "high", eta: "5 min", owner: "Yard Manager", status: isAtRisk ? "in-progress" : isBreached ? "done" : "pending" },
    { id: "R3", action: `Notify customer ${item.customer} of updated ETA`, impact: "medium", eta: "8 min", owner: "Customer Success", status: isBreached ? "done" : "pending" },
    { id: "R4", action: "Schedule backup vehicle from reserve fleet", impact: "medium", eta: "20 min", owner: "Transport Manager", status: "pending" },
    { id: "R5", action: "Document root cause for post-mortem review", impact: "low", eta: "1 hr", owner: "Operations Manager", status: "pending" },
  ]
}

// ── Component ────────────────────────────────────────────────────────────────

const typeIcon = {
  Inbound: Package,
  Outbound: Truck,
  "Cross-Dock": ArrowRightLeft,
} as const

const impactColor = {
  high: "text-red-600 dark:text-red-400 bg-red-500/10",
  medium: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  low: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
} as const

const actionStatusColor = {
  pending: "text-muted-foreground bg-muted",
  "in-progress": "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  done: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
} as const

const severityText = {
  good: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  critical: "text-red-600 dark:text-red-400",
} as const

const chartConfig: ChartConfig = {
  expected: { label: "Expected", color: "#94a3b8" },
  actual: { label: "Actual", color: "#2563EB" },
  threshold: { label: "Threshold", color: "#EF4444" },
}

export function SLACountdownDetailDrawer({
  open,
  onOpenChange,
  item,
}: SLACountdownDetailDrawerProps) {
  const { toast } = useToast()

  const theme = item ? statusTheme[item.status] : statusTheme["on-track"]
  const TypeIcon = item ? typeIcon[item.type] : Package

  const lifecycle = React.useMemo(() => (item ? getLifecycle(item) : []), [item])
  const progressTrend = React.useMemo(() => (item ? getProgressTrend(item) : []), [item])
  const impactMetrics = React.useMemo(() => (item ? getImpactMetrics(item) : []), [item])
  const escalationChain = React.useMemo(() => (item ? getEscalationChain(item) : []), [item])
  const recoveryActions = React.useMemo(() => (item ? getRecoveryActions(item) : []), [item])

  const [actions, setActions] = React.useState<RecoveryAction[]>([])
  React.useEffect(() => {
    setActions(recoveryActions)
  }, [recoveryActions])

  if (!item) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto" />
      </Sheet>
    )
  }

  const isBreached = item.remainingMs < 0
  const isCompleted = item.status === "completed"
  const countdown = item.remainingMs

  const handleExport = () => {
    const csv = [
      `SLA Report - ${item.id}`,
      `Shipment,${item.shipmentId}`,
      `Type,${item.type}`,
      `Customer,${item.customer}`,
      `Warehouse,${item.warehouse}`,
      `Status,${item.status}`,
      `Priority,${item.priority}`,
      `Progress,${item.progress}%`,
      `Remaining,${formatCountdown(countdown)}`,
      `Deadline,${item.deadline.toLocaleString("en-IN")}`,
      `Handler,${item.handler}`,
      ``,
      `Impact Metrics:`,
      ...impactMetrics.map((m) => `${m.label}: ${m.value} (${m.delta})`),
      ``,
      `Escalation Chain:`,
      ...escalationChain.map((e) => `L${e.level}. ${e.role} (${e.name}) — Notified: ${e.notifiedAt} — Ack: ${e.acknowledged ? "Yes" : "No"} — Action: ${e.action}`),
      ``,
      `Recovery Actions:`,
      ...actions.map((a) => `${a.id}. [${a.status}] ${a.action} (Owner: ${a.owner}, ETA: ${a.eta}, Impact: ${a.impact})`),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `sla-${item.id}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Report exported", `sla-${item.id}.csv`)
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
        {/* Header */}
        <div className={cn(
          "sla-drawer-header relative overflow-hidden bg-gradient-to-br border-b",
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
                "sla-icon-pulse size-11 rounded-xl flex items-center justify-center shrink-0",
                theme.bg,
                theme.text
              )}>
                <TypeIcon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider font-bold", theme.text, theme.border)}>
                    {theme.label}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    <Timer className="size-2.5 mr-1" />
                    {item.id}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px] uppercase", item.priority === "high" ? "border-red-500/40 text-red-600 dark:text-red-400" : item.priority === "medium" ? "border-amber-500/40 text-amber-600 dark:text-amber-400" : "border-blue-500/40 text-blue-600 dark:text-blue-400")}>
                    {item.priority} priority
                  </Badge>
                </div>
                <SheetTitle className="text-lg font-bold leading-tight font-mono">
                  {item.shipmentId}
                </SheetTitle>
                <SheetDescription className="text-xs mt-0.5">
                  {item.customer} · {item.type} · {item.warehouse}
                </SheetDescription>
              </div>
            </div>

            {/* Hero countdown + metrics */}
            <div className="sla-stat-enter grid grid-cols-4 gap-2 mt-4">
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5 col-span-2">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  {isBreached ? "Overdue By" : isCompleted ? "Completed" : "Time Remaining"}
                </p>
                <p className={cn(
                  "text-xl font-bold text-number tabular-nums leading-tight",
                  isBreached ? "text-red-500 animate-pulse" : countdown < 30 * MIN ? "text-amber-600 dark:text-amber-400" : "text-foreground"
                )}>
                  {isCompleted ? "✓" : formatCountdown(countdown)}
                </p>
                <p className="text-[9px] text-muted-foreground">
                  Due {item.deadline.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Progress</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", theme.text)}>{item.progress}%</p>
                <Progress value={Math.min(100, item.progress)} className="h-1 mt-1" />
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Handler</p>
                <p className="text-xs font-bold truncate">{item.handler}</p>
                <p className="text-[9px] text-muted-foreground truncate">{item.warehouse}</p>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="sla-drawer-body-enter p-5 space-y-5">
          {/* 12-hour progress trend */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Activity className="size-3.5 text-muted-foreground" />
                12-Hour Progress vs. Expected
              </h3>
              <Badge variant="outline" className="text-[9px]">Last 6h</Badge>
            </div>
            <Card className="border-border/40">
              <CardContent className="p-3">
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                  <AreaChart data={progressTrend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="actualSlaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="hour" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
                    <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="expected" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 2" fill="none" />
                    <Area type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2} fill="url(#actualSlaGrad)" />
                    <ReferenceLine y={item.progress} stroke="#10B981" strokeDasharray="2 2" strokeWidth={0.5} />
                  </AreaChart>
                </ChartContainer>
                <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-blue-500" /> Actual progress</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-slate-400" /> Expected</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact metrics */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Target className="size-3.5 text-muted-foreground" />
              Impact Analysis
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {impactMetrics.map((m, i) => (
                <div
                  key={m.label}
                  className="sla-card-enter rounded-lg border border-border/40 bg-background/60 p-2.5"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                  <p className={cn("text-sm font-bold text-number tabular-nums", severityText[m.severity])}>{m.value}</p>
                  <p className="text-[9px] text-muted-foreground truncate">{m.delta}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment lifecycle timeline */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Clock className="size-3.5 text-muted-foreground" />
              Shipment Lifecycle
            </h3>
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-400/60 via-border/40 to-transparent" />
              <div className="space-y-3">
                {lifecycle.map((event, i) => (
                  <div
                    key={i}
                    className="sla-card-enter relative flex items-start gap-3"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className={cn(
                      "size-6 rounded-full border-2 border-background shrink-0 z-10 flex items-center justify-center",
                      event.status === "completed" ? "bg-emerald-500" :
                      event.status === "current" ? "bg-blue-500 animate-pulse" :
                      "bg-muted border-muted-foreground/30"
                    )}>
                      {event.status === "completed" && <CheckCircle2 className="size-3 text-white" />}
                      {event.status === "current" && <Clock className="size-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold leading-snug">{event.label}</p>
                        <p className="text-[10px] text-muted-foreground tabular-nums shrink-0">{event.time}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{event.detail}</p>
                      <p className="text-[9px] text-muted-foreground italic mt-0.5">— {event.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Escalation chain */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <ShieldAlert className="size-3.5 text-muted-foreground" />
              Escalation Chain
            </h3>
            <div className="space-y-1.5">
              {escalationChain.map((e, i) => (
                <div
                  key={e.level}
                  className={cn(
                    "sla-card-enter flex items-center gap-3 rounded-lg border bg-background/60 px-3 py-2",
                    e.acknowledged ? "border-emerald-500/30" : "border-border/40"
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={cn(
                    "size-7 rounded-md flex items-center justify-center shrink-0 font-bold text-[10px]",
                    e.acknowledged ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  )}>
                    L{e.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium truncate">{e.role}</p>
                      {e.acknowledged ? (
                        <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                          <CheckCircle2 className="size-2.5 mr-0.5" /> Ack
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                          <Clock className="size-2.5 mr-0.5" /> Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {e.name} · Notified {e.notifiedAt}
                    </p>
                    <p className="text-[10px] text-foreground/80 italic mt-0.5 truncate">{e.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery actions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Zap className="size-3.5 text-muted-foreground" />
                Recovery Actions
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
                    "sla-card-enter w-full text-left flex items-center gap-2.5 rounded-lg border bg-background/60 px-3 py-2 transition-all hover:bg-accent/40",
                    a.status === "done" ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/40"
                  )}
                  style={{ animationDelay: `${i * 40}ms` }}
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

          {/* Footer */}
          <div className="flex items-center gap-2 pb-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={handleExport}>
              <Download className="size-3.5" />
              Export Report
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={() => {
              toast.success("Customer notified", `${item.customer} updated with new ETA`)
            }}>
              <Bell className="size-3.5" />
              Notify Customer
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={() => {
              toast.info("Calling handler", `Dialing ${item.handler}…`)
            }}>
              <Phone className="size-3.5" />
              Call
            </Button>
            {!isCompleted && (
              <Button size="sm" className={cn("gap-1.5 text-xs h-8 ml-auto", theme.text.replace("text-", "bg-").replace("600", "500").replace("400", "500"))} onClick={() => {
                toast.success("SLA marked complete", `${item.shipmentId} closed successfully`)
                onOpenChange(false)
              }}>
                <CheckCircle2 className="size-3.5" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
