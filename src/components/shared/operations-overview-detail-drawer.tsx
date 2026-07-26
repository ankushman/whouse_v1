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
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Truck,
  Package,
  Users,
  Wrench,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Download,
  Zap,
  Gauge,
  ShieldCheck,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  AlertCircle,
  Phone,
  Mail,
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
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ── Types ────────────────────────────────────────────────────────────────────

export interface OperationsWarehouseSummary {
  name: string
  capacity: number
  health: number
  alerts: number
  status: "green" | "amber" | "red"
}

interface OperationsOverviewDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: OperationsWarehouseSummary | null
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
    bar: "bg-emerald-500",
  },
  amber: {
    gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    border: "border-amber-500/40",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(245,158,11,0.4)]",
    label: "Warning",
    bar: "bg-amber-500",
  },
  red: {
    gradient: "from-red-500/15 via-red-500/5 to-transparent",
    border: "border-red-500/40",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(239,68,68,0.4)]",
    label: "Critical",
    bar: "bg-red-500",
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

// ── 24-hour occupancy trend ──────────────────────────────────────────────────

interface HourlyPoint {
  hour: string
  occupancy: number
  throughput: number
  threshold: number
}

function getHourlyTrend(wh: OperationsWarehouseSummary): HourlyPoint[] {
  const seed = hashStr(wh.name)
  const points: HourlyPoint[] = []
  const baseOcc = wh.capacity
  for (let h = 0; h < 24; h++) {
    const businessFactor = h >= 8 && h <= 20 ? 1.0 + Math.sin(((h - 8) / 12) * Math.PI) * 0.15 : 0.7
    const noise = ((seed >> (h % 16)) & 0x3) - 1
    const occupancy = Math.max(40, Math.min(100, Math.round(baseOcc * businessFactor + noise)))
    const throughput = Math.round(40 + Math.sin((h + seed) * 0.5) * 18 + (h >= 8 && h <= 20 ? 20 : -10))
    points.push({
      hour: `${String(h).padStart(2, "0")}:00`,
      occupancy,
      throughput: Math.max(8, throughput),
      threshold: 90,
    })
  }
  return points
}

// ── KPI metrics grid ─────────────────────────────────────────────────────────

interface Kpi {
  label: string
  value: string
  target: string
  delta: number
  trend: "up" | "down" | "flat"
  severity: "good" | "warning" | "critical"
  icon: typeof Activity
}

function getKpis(wh: OperationsWarehouseSummary): Kpi[] {
  const seed = hashStr(wh.name)
  const isCritical = wh.status === "red"
  const isWarning = wh.status === "amber"

  return [
    {
      label: "Throughput Today",
      value: `${1200 + (seed % 400)}`,
      target: "1500",
      delta: +(((seed % 20) - 10)).toFixed(1),
      trend: (seed & 0x1) ? "up" : "down",
      severity: isCritical ? "critical" : "good",
      icon: Activity,
    },
    {
      label: "Inventory Accuracy",
      value: `${(94 + (seed % 6)).toFixed(1)}%`,
      target: "98%",
      delta: -1.2,
      trend: "down",
      severity: isCritical ? "critical" : isWarning ? "warning" : "good",
      icon: Package,
    },
    {
      label: "On-time Dispatch",
      value: `${(88 + (seed % 10)).toFixed(1)}%`,
      target: "95%",
      delta: +2.4,
      trend: "up",
      severity: isCritical ? "warning" : "good",
      icon: Truck,
    },
    {
      label: "Active Staff",
      value: `${18 + (seed % 12)}`,
      target: "22",
      delta: -2,
      trend: "down",
      severity: isCritical ? "warning" : "good",
      icon: Users,
    },
    {
      label: "Equipment Util.",
      value: `${(72 + (seed % 18))}%`,
      target: "80%",
      delta: +3.1,
      trend: "up",
      severity: "good",
      icon: Wrench,
    },
    {
      label: "SLA Compliance",
      value: `${(91 + (seed % 8))}%`,
      target: "95%",
      delta: +(seed % 4 - 1),
      trend: "flat",
      severity: isCritical ? "critical" : isWarning ? "warning" : "good",
      icon: ShieldCheck,
    },
  ]
}

// ── Active shipments ─────────────────────────────────────────────────────────

interface ActiveShipment {
  id: string
  customer: string
  type: "Inbound" | "Outbound"
  status: "in-transit" | "delayed" | "delivered" | "processing"
  eta: string
  progress: number
  value: string
}

function getActiveShipments(wh: OperationsWarehouseSummary): ActiveShipment[] {
  const seed = hashStr(wh.name)
  const customers = ["Maruti Suzuki India", "Tata Motors Ltd", "Bosch Ltd", "Bharat Forge Ltd", "Uno Minda Ltd", "Motherson Sumi Systems"]
  const types: ActiveShipment["type"][] = ["Inbound", "Outbound"]
  const statuses: ActiveShipment["status"][] = ["in-transit", "delayed", "delivered", "processing"]

  return Array.from({ length: 4 + (seed % 3) }, (_, i) => {
    const s = (seed >> (i * 2)) & 0x3
    const isDelayed = i === 0 && wh.status !== "green"
    return {
      id: `SHP-${4821 + (seed % 100) + i}`,
      customer: customers[(seed + i) % customers.length],
      type: types[(seed + i) % 2],
      status: isDelayed ? "delayed" : statuses[s],
      eta: `${(2 + (s * 3))}h ${15 + i * 5}m`,
      progress: isDelayed ? 65 : [30, 55, 100, 25][s],
      value: `₹${(2 + (seed % 8) + i).toFixed(1)}L`,
    }
  })
}

// ── Active alerts ────────────────────────────────────────────────────────────

interface AlertItem {
  id: string
  title: string
  severity: "critical" | "warning" | "info"
  age: string
  owner: string
  acknowledged: boolean
}

function getAlerts(wh: OperationsWarehouseSummary): AlertItem[] {
  const seed = hashStr(wh.name)
  const base: AlertItem[] = [
    { id: "ALT-001", title: "Capacity exceeded 90% threshold", severity: "critical", age: "12 min ago", owner: "Shift Supervisor", acknowledged: false },
    { id: "ALT-002", title: "Dock D-3 conveyor intermittent jam", severity: "warning", age: "28 min ago", owner: "Maintenance Lead", acknowledged: false },
    { id: "ALT-003", title: "Picker P-023 error rate spike", severity: "warning", age: "1 hr ago", owner: "Operations Manager", acknowledged: true },
    { id: "ALT-004", title: "Inbound truck TN-09-AB-1234 waiting >25 min", severity: "info", age: "1 hr ago", owner: "Yard Manager", acknowledged: false },
    { id: "ALT-005", title: "Chiller HVAC-2 defrost cycle extended", severity: "info", age: "2 hr ago", owner: "Facilities", acknowledged: true },
  ]
  // Filter deterministically by warehouse status
  const take = wh.status === "red" ? 5 : wh.status === "amber" ? 4 : 2
  return base.slice(0, take + (seed % 2))
}

// ── Activity timeline (last 6 hours) ─────────────────────────────────────────

interface TimelineEvent {
  time: string
  event: string
  actor: string
  type: "success" | "warning" | "info" | "critical"
}

function getTimeline(wh: OperationsWarehouseSummary): TimelineEvent[] {
  const seed = hashStr(wh.name)
  const now = new Date()
  const events: TimelineEvent[] = [
    {
      time: new Date(now.getTime() - 8 * 60_000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      event: "Outbound shipment SHP-4821 dispatched to Maruti Suzuki Manesar plant",
      actor: "Rajesh Kumar",
      type: "success",
    },
    {
      time: new Date(now.getTime() - 22 * 60_000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      event: "Inbound ASN-2024-0847 arrived at dock D-2 — 18 pallets",
      actor: "Priya Sharma",
      type: "info",
    },
    {
      time: new Date(now.getTime() - 45 * 60_000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      event: "Equipment EQ-012 (forklift) reported battery low — reassigned to charging bay",
      actor: "System",
      type: "warning",
    },
    {
      time: new Date(now.getTime() - 78 * 60_000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      event: "Cycle count completed for Zone A — 47 SKUs verified, 0 variance",
      actor: "Amit Patel",
      type: "success",
    },
    {
      time: new Date(now.getTime() - 124 * 60_000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      event: "SLA breach warning raised for customer Bharat Forge — escalation triggered",
      actor: "SLA Monitor",
      type: wh.status === "red" ? "critical" : "warning",
    },
    {
      time: new Date(now.getTime() - 180 * 60_000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      event: "Shift handover from Morning to Afternoon completed — 12 operators",
      actor: "Kiran Joshi",
      type: "info",
    },
  ]
  return events.slice(0, 5 + (seed % 2))
}

// ── Staff on shift ───────────────────────────────────────────────────────────

interface StaffMember {
  id: string
  name: string
  role: string
  shift: "Morning" | "Afternoon" | "Night"
  productivity: number
  tasksCompleted: number
  status: "active" | "break" | "offline"
}

function getStaff(wh: OperationsWarehouseSummary): StaffMember[] {
  const seed = hashStr(wh.name)
  const names = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Suresh Reddy", "Deepak Nair", "Vikram Singh", "Kiran Joshi", "Manish Gupta"]
  const roles = ["Forklift Operator", "Picker", "Packer", "Supervisor", "QC Inspector", "Dock Worker", "Inventory Clerk", "Yard Manager"]
  const shifts: StaffMember["shift"][] = ["Morning", "Afternoon", "Night"]

  return Array.from({ length: 5 + (seed % 4) }, (_, i) => ({
    id: `EMP-${100 + i + (seed % 50)}`,
    name: names[(seed + i) % names.length],
    role: roles[(seed + i * 2) % roles.length],
    shift: shifts[(seed + i) % 3],
    productivity: 70 + ((seed >> i) & 0x1f),
    tasksCompleted: 8 + ((seed >> (i * 2)) & 0xf),
    status: i === 0 && wh.status === "red" ? "break" : (i + seed) % 5 === 0 ? "offline" : "active",
  }))
}

// ── Component ────────────────────────────────────────────────────────────────

const kpiSeverityColor = {
  good: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  critical: "text-red-600 dark:text-red-400",
} as const

const shipmentStatusColor = {
  "in-transit": "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  delayed: "text-red-600 dark:text-red-400 bg-red-500/10",
  delivered: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  processing: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
} as const

const alertSeverityColor = {
  critical: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30",
  warning: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
  info: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
} as const

const timelineColor = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  critical: "bg-red-500",
} as const

const staffStatusColor = {
  active: "bg-emerald-500",
  break: "bg-amber-500",
  offline: "bg-slate-400",
} as const

const chartConfig: ChartConfig = {
  occupancy: { label: "Occupancy %", color: "#2563EB" },
  throughput: { label: "Throughput", color: "#10B981" },
}

export function OperationsOverviewDetailDrawer({
  open,
  onOpenChange,
  warehouse,
}: OperationsOverviewDetailDrawerProps) {
  const { toast } = useToast()

  const theme = warehouse ? statusTheme[warehouse.status] : statusTheme.green

  const hourlyTrend = React.useMemo(() => (warehouse ? getHourlyTrend(warehouse) : []), [warehouse])
  const kpis = React.useMemo(() => (warehouse ? getKpis(warehouse) : []), [warehouse])
  const shipments = React.useMemo(() => (warehouse ? getActiveShipments(warehouse) : []), [warehouse])
  const alerts = React.useMemo(() => (warehouse ? getAlerts(warehouse) : []), [warehouse])
  const timeline = React.useMemo(() => (warehouse ? getTimeline(warehouse) : []), [warehouse])
  const staff = React.useMemo(() => (warehouse ? getStaff(warehouse) : []), [warehouse])

  if (!warehouse) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto" />
      </Sheet>
    )
  }

  const handleExport = () => {
    const csv = [
      `Operations Overview Report - ${warehouse.name}`,
      `Status,${theme.label}`,
      `Capacity,${warehouse.capacity}%`,
      `Health Score,${warehouse.health}%`,
      `Active Alerts,${warehouse.alerts}`,
      ``,
      `KPIs:`,
      ...kpis.map((k) => `${k.label}: ${k.value} (target: ${k.target}, delta: ${k.delta > 0 ? "+" : ""}${k.delta})`),
      ``,
      `Active Shipments:`,
      ...shipments.map((s) => `${s.id} [${s.status}] ${s.customer} - ${s.type} - ETA ${s.eta} - Progress ${s.progress}% - Value ${s.value}`),
      ``,
      `Active Alerts:`,
      ...alerts.map((a) => `${a.id} [${a.severity}] ${a.title} - ${a.age} - Owner: ${a.owner}`),
      ``,
      `Staff on Shift:`,
      ...staff.map((s) => `${s.name} (${s.role}) - Shift: ${s.shift} - Productivity: ${s.productivity}% - Tasks: ${s.tasksCompleted} - Status: ${s.status}`),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `operations-${warehouse.name.replace(/\s+/g, "-").toLowerCase()}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Report exported", `operations-${warehouse.name.replace(/\s+/g, "-").toLowerCase()}.csv`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header strip */}
        <div className={cn(
          "ops-drawer-header relative overflow-hidden bg-gradient-to-br border-b",
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
                "ops-icon-pulse size-11 rounded-xl flex items-center justify-center shrink-0",
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
                    India
                  </Badge>
                </div>
                <SheetTitle className="text-lg font-bold leading-tight">
                  {warehouse.name}
                </SheetTitle>
                <SheetDescription className="text-xs mt-0.5 flex items-center gap-2">
                  <Clock className="size-3" />
                  Live operations overview
                </SheetDescription>
              </div>
            </div>

            {/* Hero metrics */}
            <div className="ops-stat-enter grid grid-cols-4 gap-2 mt-4">
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Capacity</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", warehouse.capacity > 90 ? "text-red-600 dark:text-red-400" : warehouse.capacity > 75 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                  {warehouse.capacity}%
                </p>
                <p className="text-[9px] text-muted-foreground">occupied</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Health</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", warehouse.health >= 80 ? "text-emerald-600 dark:text-emerald-400" : warehouse.health >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                  {warehouse.health}%
                </p>
                <p className="text-[9px] text-muted-foreground">score</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Alerts</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", warehouse.alerts > 5 ? "text-red-600 dark:text-red-400" : warehouse.alerts > 2 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                  {warehouse.alerts}
                </p>
                <p className="text-[9px] text-muted-foreground">active</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Staff</p>
                <p className="text-sm font-bold text-number tabular-nums">{staff.length}</p>
                <p className="text-[9px] text-muted-foreground">on shift</p>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="ops-drawer-body-enter p-5 space-y-5">
          {/* 24-hour occupancy + throughput chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Activity className="size-3.5 text-muted-foreground" />
                24-Hour Occupancy & Throughput
              </h3>
              <Badge variant="outline" className="text-[9px]">Last 24h</Badge>
            </div>
            <Card className="border-border/40">
              <CardContent className="p-3">
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                  <AreaChart data={hourlyTrend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="hour" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
                    <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ReferenceLine y={90} stroke="#EF4444" strokeDasharray="4 2" strokeWidth={1} />
                    <Area type="monotone" dataKey="occupancy" stroke="#2563EB" strokeWidth={2} fill="url(#occGrad)" />
                    <Area type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={1.5} fill="none" strokeDasharray="3 2" />
                  </AreaChart>
                </ChartContainer>
                <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-blue-500" /> Occupancy %</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-emerald-500" /> Throughput</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-red-500" /> 90% Threshold</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* KPI grid */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Gauge className="size-3.5 text-muted-foreground" />
              Key Performance Indicators
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {kpis.map((kpi, i) => {
                const KIcon = kpi.icon
                return (
                  <div
                    key={kpi.label}
                    className="ops-card-enter rounded-lg border border-border/40 bg-background/60 p-2.5"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className={cn("size-6 rounded-md flex items-center justify-center shrink-0", kpi.severity === "good" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : kpi.severity === "warning" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-red-500/10 text-red-600 dark:text-red-400")}>
                        <KIcon className="size-3" />
                      </div>
                      <span className={cn("text-[10px] font-medium flex items-center gap-0.5", kpi.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : kpi.trend === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                        {kpi.trend === "up" ? <ArrowUpRight className="size-2.5" /> : kpi.trend === "down" ? <ArrowDownRight className="size-2.5" /> : null}
                        {kpi.delta > 0 ? "+" : ""}{kpi.delta}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{kpi.label}</p>
                    <p className={cn("text-sm font-bold text-number tabular-nums", kpiSeverityColor[kpi.severity])}>{kpi.value}</p>
                    <p className="text-[9px] text-muted-foreground">Target: {kpi.target}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active shipments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Truck className="size-3.5 text-muted-foreground" />
                Active Shipments
              </h3>
              <Badge variant="outline" className="text-[9px]">{shipments.length} active</Badge>
            </div>
            <div className="space-y-1.5">
              {shipments.map((s, i) => (
                <div
                  key={s.id}
                  className="ops-card-enter flex items-center gap-2.5 rounded-lg border border-border/40 bg-background/60 px-3 py-2"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex size-8 rounded-md bg-muted/40 items-center justify-center shrink-0">
                    {s.type === "Inbound" ? <Package className="size-3.5 text-blue-500" /> : <Truck className="size-3.5 text-emerald-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono font-semibold shrink-0">{s.id}</p>
                      <Badge variant="outline" className={cn("text-[9px] uppercase shrink-0", shipmentStatusColor[s.status])}>
                        {s.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{s.customer} · {s.type} · ETA {s.eta}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={s.progress} className="h-1 flex-1" />
                      <span className="text-[9px] text-muted-foreground shrink-0 tabular-nums">{s.progress}%</span>
                      <span className="text-[10px] font-semibold text-number shrink-0">{s.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active alerts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 text-muted-foreground" />
                Active Alerts
              </h3>
              <Badge variant="outline" className="text-[9px]">
                {alerts.filter((a) => !a.acknowledged).length} unack
              </Badge>
            </div>
            <div className="space-y-1.5">
              {alerts.map((a, i) => (
                <div
                  key={a.id}
                  className={cn(
                    "ops-card-enter flex items-start gap-2.5 rounded-lg border bg-background/60 px-3 py-2",
                    alertSeverityColor[a.severity]
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={cn(
                    "size-5 rounded shrink-0 flex items-center justify-center mt-0.5",
                    a.severity === "critical" ? "bg-red-500/20" : a.severity === "warning" ? "bg-amber-500/20" : "bg-blue-500/20"
                  )}>
                    {a.severity === "critical" ? <XCircle className="size-3 text-red-600 dark:text-red-400" /> :
                     a.severity === "warning" ? <AlertTriangle className="size-3 text-amber-600 dark:text-amber-400" /> :
                     <AlertCircle className="size-3 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-snug">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      <span className="font-mono">{a.id}</span> · {a.age} · Owner: {a.owner}
                    </p>
                  </div>
                  {a.acknowledged && (
                    <Badge variant="outline" className="text-[9px] shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-2.5 mr-0.5" />
                      Ack
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity timeline */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Clock className="size-3.5 text-muted-foreground" />
              Activity Timeline (Last 3h)
            </h3>
            <div className="relative">
              <div className="absolute left-[10px] top-2 bottom-2 w-px bg-gradient-to-b from-border via-border to-transparent" />
              <div className="space-y-2">
                {timeline.map((event, i) => (
                  <div
                    key={i}
                    className="ops-card-enter relative flex items-start gap-3 pl-1"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className={cn(
                      "size-5 rounded-full border-2 border-background shrink-0 z-10 flex items-center justify-center",
                      timelineColor[event.type]
                    )}>
                      <div className="size-1.5 rounded-full bg-white" />
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-medium text-muted-foreground tabular-nums">{event.time}</p>
                        <span className="text-[9px] text-muted-foreground italic">{event.actor}</span>
                      </div>
                      <p className="text-xs text-foreground leading-snug mt-0.5">{event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Staff on shift */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Users className="size-3.5 text-muted-foreground" />
                Staff On Shift
              </h3>
              <Badge variant="outline" className="text-[9px]">
                {staff.filter((s) => s.status === "active").length} active
              </Badge>
            </div>
            <div className="space-y-1.5">
              {staff.map((s, i) => (
                <div
                  key={s.id}
                  className="ops-card-enter flex items-center gap-2.5 rounded-lg border border-border/40 bg-background/60 px-3 py-2"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="relative shrink-0">
                    <div className="size-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                      {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className={cn("absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background", staffStatusColor[s.status])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{s.role} · {s.shift} shift</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-number tabular-nums">{s.productivity}%</p>
                    <p className="text-[9px] text-muted-foreground">{s.tasksCompleted} tasks</p>
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
              toast.success("Operations team notified", `${warehouse.name} operations team alerted`)
            }}>
              <Bell className="size-3.5" />
              Notify Team
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8 ml-auto" onClick={() => {
              toast.info("Calling warehouse", `Dialing ${warehouse.name} main line…`)
            }}>
              <Phone className="size-3.5" />
              Call
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
