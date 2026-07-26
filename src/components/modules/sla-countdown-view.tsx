"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Timer,
  TrendingDown,
  Zap,
  BarChart3,
  Shield,
  Activity,
  Truck,
  Package,
  User,
  Warehouse,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

// ── Types ────────────────────────────────────────────────────────────────────

interface SLAItem {
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

// ── Constants ────────────────────────────────────────────────────────────────

const MIN = 60_000
const HOUR = 3_600_000

function createSLAItems(now: number): SLAItem[] {
  return [
    { id: "sla-001", shipmentId: "SHP-4821", type: "Outbound", customer: "Maruti Suzuki India", warehouse: "Mumbai Hub", deadline: new Date(now + 12 * MIN), status: "at-risk", progress: 65, remainingMs: 12 * MIN, priority: "high", handler: "Rajesh Kumar" },
    { id: "sla-002", shipmentId: "SHP-4822", type: "Inbound", customer: "Tata Motors Ltd", warehouse: "Delhi NCR", deadline: new Date(now + 95 * MIN), status: "on-track", progress: 42, remainingMs: 95 * MIN, priority: "medium", handler: "Priya Sharma" },
    { id: "sla-003", shipmentId: "SHP-4823", type: "Cross-Dock", customer: "Bosch Ltd", warehouse: "Pune Warehouse", deadline: new Date(now + 3 * MIN), status: "at-risk", progress: 88, remainingMs: 3 * MIN, priority: "high", handler: "Amit Patel" },
    { id: "sla-004", shipmentId: "SHP-4824", type: "Outbound", customer: "Bharat Forge Ltd", warehouse: "Chennai Hub", deadline: new Date(now - 8 * MIN), status: "breached", progress: 100, remainingMs: -8 * MIN, priority: "high", handler: "Suresh Reddy" },
    { id: "sla-005", shipmentId: "SHP-4825", type: "Inbound", customer: "Motherson Sumi Systems", warehouse: "Kolkata Depot", deadline: new Date(now + 180 * MIN), status: "on-track", progress: 25, remainingMs: 180 * MIN, priority: "low", handler: "Vikram Singh" },
    { id: "sla-006", shipmentId: "SHP-4826", type: "Outbound", customer: "Uno Minda Ltd", warehouse: "Bangalore", deadline: new Date(now + 48 * MIN), status: "on-track", progress: 55, remainingMs: 48 * MIN, priority: "medium", handler: "Deepak Nair" },
    { id: "sla-007", shipmentId: "SHP-4827", type: "Cross-Dock", customer: "Varroc Polymers", warehouse: "Mumbai Hub", deadline: new Date(now + 22 * MIN), status: "at-risk", progress: 78, remainingMs: 22 * MIN, priority: "high", handler: "Kiran Joshi" },
    { id: "sla-008", shipmentId: "SHP-4828", type: "Inbound", customer: "Jamna Auto Industries", warehouse: "Delhi NCR", deadline: new Date(now - 25 * MIN), status: "breached", progress: 100, remainingMs: -25 * MIN, priority: "high", handler: "Manish Gupta" },
    { id: "sla-009", shipmentId: "SHP-4829", type: "Outbound", customer: "Maruti Suzuki India", warehouse: "Pune Warehouse", deadline: new Date(now + 145 * MIN), status: "on-track", progress: 35, remainingMs: 145 * MIN, priority: "medium", handler: "Rajesh Kumar" },
    { id: "sla-010", shipmentId: "SHP-4830", type: "Inbound", customer: "Tata Motors Ltd", warehouse: "Chennai Hub", deadline: new Date(now + 72 * MIN), status: "on-track", progress: 48, remainingMs: 72 * MIN, priority: "low", handler: "Priya Sharma" },
  ]
}

function createSlaTrendData(now: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const hour = new Date(now - (11 - i) * HOUR)
    const label = hour.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    return {
      hour: label,
      compliance: Math.round(92 + Math.random() * 7 - i * 0.3),
      target: 95,
    }
  })
}

// ── Helper Functions ──────────────────────────────────────────────────────

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(Math.abs(ms) / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function formatRemaining(ms: number): string {
  const totalMin = Math.abs(Math.floor(ms / MIN))
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function getStatusFromMs(ms: number, progress: number): SLAItem["status"] {
  // Check breach FIRST — a shipment past deadline is breached even if progress hit 100% late.
  // Otherwise completed items with progress=100 and ms<0 (breached mock items) would be
  // instantly reclassified as "completed" on the first tick, hiding breaches.
  if (ms < 0) return "breached"
  if (progress >= 100) return "completed"
  if (ms < 30 * MIN) return "at-risk"
  return "on-track"
}

const statusColors = {
  "on-track": { text: "text-emerald-600 dark:text-emerald-400", bg: "card-accent-green", badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500", progress: "bg-emerald-500", badgeType: "info" as const },
  "at-risk": { text: "text-amber-600 dark:text-amber-400", bg: "card-accent-amber", badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800", dot: "bg-amber-500", progress: "bg-amber-500", badgeType: "warning" as const },
  "breached": { text: "text-red-600 dark:text-red-400", bg: "card-accent-red", badge: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800", dot: "bg-red-500", progress: "bg-red-500", badgeType: "critical" as const },
  "completed": { text: "text-blue-600 dark:text-blue-400", bg: "card-accent-blue", badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800", dot: "bg-blue-500", progress: "bg-blue-500", badgeType: "info" as const },
}

const priorityColors = {
  high: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400 border-gray-200 dark:border-gray-700",
}

const typeIcons: Record<string, React.ReactNode> = {
  Inbound: <Package className="size-3" />,
  Outbound: <Truck className="size-3" />,
  "Cross-Dock": <Zap className="size-3" />,
}

// ── SLA Card Component ───────────────────────────────────────────────────

function SLACard({ item }: { item: SLAItem; mountTime: number }) {
  // Single source of truth: parent (SLACountdownView) already decrements item.remainingMs
  // by 1000ms every second via setSlaItems. We just read item.remainingMs directly.
  //
  // Previously this component also ran its own setInterval + re-synced from item.remainingMs - elapsed,
  // which compounded with the parent's decrement → countdown dropped at 2x real speed.
  const countdown = item.remainingMs
  const colors = statusColors[item.status]

  const isBreached = countdown < 0
  const isFlashing = countdown < 0 && Math.floor(Date.now() / 1000) % 2 === 0

  return (
    <Card className={cn("card-depth overflow-hidden transition-all duration-300 hover-lift", colors.bg)}>
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-foreground">{item.shipmentId}</span>
              <span className={cn("badge-status-dot inline-flex border text-[9px]", colors.badge, colors.badgeType)}>
                {item.status === "breached" ? "BREACHED" : item.status === "at-risk" ? "AT RISK" : item.status === "completed" ? "DONE" : "ON TRACK"}
              </span>
            </div>
            <p className="text-xs font-semibold text-foreground truncate">{item.customer}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge className={cn("text-[9px] gap-0.5 border", priorityColors[item.priority])}>
              {item.priority}
            </Badge>
            <Badge variant="outline" className="text-[9px] gap-0.5">
              {typeIcons[item.type]}
              {item.type}
            </Badge>
          </div>
        </div>

        {/* Warehouse + Handler */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Warehouse className="size-3" />
            <span>{item.warehouse}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="size-3" />
            <span>{item.handler}</span>
          </div>
        </div>

        {/* Countdown Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className={cn("size-4", isBreached ? "text-red-500" : "text-muted-foreground")} />
            <div className={cn(
              "text-2xl font-bold text-number tabular-nums leading-tight transition-colors",
              isBreached ? "text-red-500" : countdown < 30 * MIN ? "text-amber-600" : "text-foreground",
              isBreached && isFlashing && "animate-pulse"
            )}>
              {isBreached && <span className="text-[10px] font-medium mr-1">OVERDUE</span>}
              {formatCountdown(countdown)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-muted-foreground uppercase">Due by</p>
            <p className="text-xs font-medium text-foreground tabular-nums">
              {item.deadline.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-muted-foreground">Progress</span>
            <span className="text-[9px] font-bold text-number tabular-nums">{Math.min(100, item.progress)}%</span>
          </div>
          <Progress value={Math.min(100, item.progress)} className={cn("h-1.5")} />
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export function SLACountdownView() {
  const mountTimeRef = useRef(Date.now())
  const [slaItems, setSlaItems] = useState<SLAItem[]>(() => createSLAItems(mountTimeRef.current))
  const [slaTrendData] = useState(() => createSlaTrendData(mountTimeRef.current))

  // Update countdowns every second — decrement by fixed 1000ms each tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSlaItems((prev) =>
        prev.map((item) => {
          if (item.status === "completed") return item
          const newRemaining = item.remainingMs - 1000
          const newStatus = getStatusFromMs(newRemaining, item.progress)
          return { ...item, remainingMs: newRemaining, status: newStatus }
        })
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Stats
  const stats = useMemo(() => {
    const active = slaItems.filter((s) => s.status !== "completed")
    const onTrack = active.filter((s) => s.status === "on-track")
    const atRisk = active.filter((s) => s.status === "at-risk")
    const breached = active.filter((s) => s.status === "breached")
    const avgRemaining = active.length > 0
      ? Math.round(active.reduce((s, i) => s + Math.max(0, i.remainingMs), 0) / active.length / MIN)
      : 0
    return { active: active.length, onTrack: onTrack.length, atRisk: atRisk.length, breached: breached.length, avgRemaining }
  }, [slaItems])

  // Priority breakdown
  const priorityBreakdown = useMemo(() => {
    const high = slaItems.filter((s) => s.priority === "high" && s.status !== "completed").length
    const medium = slaItems.filter((s) => s.priority === "medium" && s.status !== "completed").length
    const low = slaItems.filter((s) => s.priority === "low" && s.status !== "completed").length
    return [
      { priority: "High", count: high, fill: "var(--color-high)" },
      { priority: "Medium", count: medium, fill: "var(--color-medium)" },
      { priority: "Low", count: low, fill: "var(--color-low)" },
    ]
  }, [slaItems])

  // Sort: breached first, then at-risk, then on-track, then completed
  const sorted = useMemo(() => {
    const order = { breached: 0, "at-risk": 1, "on-track": 2, completed: 3 }
    return [...slaItems].sort((a, b) => order[a.status] - order[b.status] || a.remainingMs - b.remainingMs)
  }, [slaItems])

  // CSV export handler
  const handleExportCSV = useCallback(() => {
    const data = slaItems.map((item) => ({
      "Shipment ID": item.shipmentId,
      Type: item.type,
      Customer: item.customer,
      Warehouse: item.warehouse,
      Status: item.status === "at-risk" ? "At Risk" : item.status === "on-track" ? "On Track" : item.status.charAt(0).toUpperCase() + item.status.slice(1),
      Priority: item.priority,
      Progress: `${Math.min(100, item.progress)}%`,
      Handler: item.handler,
      Deadline: item.deadline.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    }))
    exportToCSV(data, "sla-countdown", ["Shipment ID", "Type", "Customer", "Warehouse", "Status", "Priority", "Progress", "Handler", "Deadline"])
  }, [slaItems])

  return (
    <div className="space-y-6">
      <PageHeader
        title="SLA Countdown"
        description="Real-time shipment SLA monitoring with live countdown timers"
        actions={
          <ExportButton onExportCSV={handleExportCSV} />
        }
      />

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 stagger-children">
        <Card className="card-depth py-0 gap-0">
          <CardContent className="flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/80">
              <Activity className="size-4 text-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Active</p>
              <p className="text-lg font-bold text-number leading-tight text-foreground">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth py-0 gap-0">
          <CardContent className="flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/70">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">On Track</p>
              <p className="text-lg font-bold text-number leading-tight text-emerald-600">{stats.onTrack}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth py-0 gap-0">
          <CardContent className="flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/70">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">At Risk</p>
              <p className="text-lg font-bold text-number leading-tight text-amber-600">{stats.atRisk}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth py-0 gap-0">
          <CardContent className="flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/70">
              <TrendingDown className="size-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Breached</p>
              <p className="text-lg font-bold text-number leading-tight text-red-600">{stats.breached}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-depth py-0 gap-0">
          <CardContent className="flex items-center gap-3 py-3 px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70">
              <Clock className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Avg Remaining</p>
              <p className="text-lg font-bold text-number leading-tight text-foreground">{formatRemaining(stats.avgRemaining * MIN)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── SLA Timeline Cards ── */}
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        {sorted.map((item) => (
          <SLACard key={item.id} item={item} mountTime={mountTimeRef.current} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* SLA Compliance Trend */}
        <Card className="card-depth chart-card card-accent-blue shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="size-4 text-blue-500" />
                SLA Compliance Trend (12h)
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">Hourly</Badge>
            </div>
            <CardDescription className="text-xs">Hourly SLA compliance rate vs. 95% target</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                compliance: { label: "Compliance %", color: "#10B981" },
                target: { label: "Target (95%)", color: "#EF4444" },
              }}
              className="h-[220px] w-full"
            >
              <AreaChart data={slaTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={1} />
                <YAxis tick={{ fontSize: 10 }} domain={[85, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="compliance" stroke="var(--color-compliance)" fill="var(--color-compliance)" fillOpacity={0.15} strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="var(--color-target)" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card className="card-depth chart-card shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="size-4 text-violet-500" />
                Priority Breakdown
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">Active SLAs</Badge>
            </div>
            <CardDescription className="text-xs">Active shipments grouped by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                high: { label: "High", color: "#EF4444" },
                medium: { label: "Medium", color: "#F59E0B" },
                low: { label: "Low", color: "#6B7280" },
              }}
              className="h-[220px] w-full"
            >
              <BarChart data={priorityBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="priority" tick={{ fontSize: 11 }} width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {priorityBreakdown.map((entry) => (
                    <Cell key={entry.priority} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>

            {/* Quick summary below chart */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {priorityBreakdown.map((p) => (
                <div key={p.priority} className={cn(
                  "rounded-lg border p-2 text-center",
                  p.priority === "High" ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30" :
                  p.priority === "Medium" ? "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30" :
                  "border-gray-200 dark:border-gray-700 bg-muted/30"
                )}>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{p.priority}</p>
                  <p className="text-lg font-bold text-number">{p.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
