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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  Truck,
  Mail,
  Phone,
  MapPin,
  Star,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Bell,
  Send,
  ChevronRight,
  Calendar,
  Route,
  Users,
  Shield,
  Award,
  Warehouse,
  Sparkles,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
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

export type SettingsEntityKind = "customer" | "transporter"

export interface SettingsDetailItem {
  id: string
  kind: SettingsEntityKind
  name: string
  code?: string
  status: "Active" | "Inactive"
  // customer fields
  city?: string
  state?: string
  contact?: string
  email?: string
  type?: "OEM" | "Tier1" | "Tier2"
  // transporter fields
  fleet?: number
  routes?: number
  phone?: string
  rating?: number
}

interface SettingsDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: SettingsDetailItem | null
}

// ── Status theming ───────────────────────────────────────────────────────────

const statusTheme = {
  Active: {
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/40",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(16,185,129,0.4)]",
    label: "Active",
    bar: "bg-emerald-500",
  },
  Inactive: {
    gradient: "from-slate-500/15 via-slate-500/5 to-transparent",
    border: "border-slate-500/40",
    text: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(100,116,139,0.4)]",
    label: "Inactive",
    bar: "bg-slate-500",
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

const DAY = 86_400_000

// ── 90-day activity trend (orders/shipments) ────────────────────────────────

interface ActivityPoint {
  day: string
  orders: number
  revenue: number
}

function getActivityTrend(item: SettingsDetailItem): ActivityPoint[] {
  const seed = hashStr(item.id + item.name)
  const base = item.kind === "customer" ? 30 + (seed % 60) : 15 + (seed % 30)
  const points: ActivityPoint[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY)
    const label = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    const weekendFactor = (d.getDay() === 0 || d.getDay() === 6) ? 0.55 : 1
    const variance = ((seed >> (i % 16)) & 0x7) - 3
    const orders = Math.max(0, Math.round(base * weekendFactor + variance * 4))
    const revenue = orders * (item.kind === "customer" ? 12000 + (seed % 8000) : 6500 + (seed % 4500))
    points.push({ day: label, orders, revenue })
  }
  return points
}

// ── KPI grid ────────────────────────────────────────────────────────────────

interface KPIMetric {
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "flat"
  severity: "good" | "warning" | "critical"
  icon: typeof Package
}

function getKPIs(item: SettingsDetailItem): KPIMetric[] {
  const seed = hashStr(item.id)
  if (item.kind === "customer") {
    const totalOrders = 320 + (seed % 180)
    const onTimeRate = 88 + (seed % 11)
    const pending = 4 + (seed % 18)
    const outstanding = 1.2 + ((seed % 80) / 10)
    return [
      {
        label: "Total Orders (30d)",
        value: String(totalOrders),
        delta: `+${8 + (seed % 12)}% vs prev`,
        trend: "up",
        severity: "good",
        icon: Package,
      },
      {
        label: "On-time Rate",
        value: `${onTimeRate}%`,
        delta: onTimeRate >= 92 ? "Above SLA" : onTimeRate >= 88 ? "Meets SLA" : "Below SLA",
        trend: onTimeRate >= 88 ? "up" : "down",
        severity: onTimeRate >= 92 ? "good" : onTimeRate >= 88 ? "warning" : "critical",
        icon: CheckCircle2,
      },
      {
        label: "Pending Orders",
        value: String(pending),
        delta: pending > 12 ? "Backlog alert" : "Within capacity",
        trend: pending > 12 ? "down" : "flat",
        severity: pending > 15 ? "critical" : pending > 8 ? "warning" : "good",
        icon: Clock,
      },
      {
        label: "Outstanding ₹",
        value: `₹${outstanding.toFixed(1)}L`,
        delta: outstanding > 5 ? "Overdue > 30d" : "Within terms",
        trend: outstanding > 5 ? "down" : "flat",
        severity: outstanding > 5 ? "critical" : outstanding > 3 ? "warning" : "good",
        icon: TrendingDown,
      },
    ]
  }
  // transporter
  const fleet = item.fleet ?? 50
  const activeFleet = Math.round(fleet * 0.78)
  const onTimeDeliveries = 86 + (seed % 12)
  const avgTransit = 26 + (seed % 18)
  const damaged = 0.4 + ((seed % 30) / 10)
  return [
    {
      label: "Active Fleet",
      value: `${activeFleet}/${fleet}`,
      delta: `${Math.round((activeFleet / Math.max(1, fleet)) * 100)}% utilization`,
      trend: "up",
      severity: "good",
      icon: Truck,
    },
    {
      label: "On-time Delivery",
      value: `${onTimeDeliveries}%`,
      delta: onTimeDeliveries >= 92 ? "Above target" : onTimeDeliveries >= 85 ? "Meets target" : "Below target",
      trend: onTimeDeliveries >= 85 ? "up" : "down",
      severity: onTimeDeliveries >= 92 ? "good" : onTimeDeliveries >= 85 ? "warning" : "critical",
      icon: CheckCircle2,
    },
    {
      label: "Avg Transit Time",
      value: `${avgTransit}h`,
      delta: avgTransit <= 30 ? "Within SLA" : "Above SLA",
      trend: avgTransit <= 30 ? "up" : "down",
      severity: avgTransit <= 30 ? "good" : avgTransit <= 40 ? "warning" : "critical",
      icon: Clock,
    },
    {
      label: "Damage Rate",
      value: `${damaged.toFixed(1)}%`,
      delta: damaged < 1 ? "Within tolerance" : "Above threshold",
      trend: damaged < 1 ? "up" : "down",
      severity: damaged < 1 ? "good" : damaged < 2 ? "warning" : "critical",
      icon: AlertTriangle,
    },
  ]
}

// ── Recent shipments / orders list ──────────────────────────────────────────

interface ShipmentRow {
  id: string
  ref: string
  origin: string
  destination: string
  status: "Delivered" | "In Transit" | "Pending" | "Delayed"
  value: string
  date: string
}

function getShipments(item: SettingsDetailItem): ShipmentRow[] {
  const seed = hashStr(item.id + item.name)
  const cities = ["Chennai", "Pune", "Mumbai", "Gurugram", "Kolkata", "Hosur", "Sanand", "Bangalore"]
  const statuses: ShipmentRow["status"][] = ["Delivered", "In Transit", "Pending", "Delayed"]
  const rows: ShipmentRow[] = []
  const count = 5 + (seed % 3)
  for (let i = 0; i < count; i++) {
    const status = statuses[(seed + i * 7) % statuses.length]
    const date = new Date(Date.now() - i * DAY * 1.5)
    rows.push({
      id: `s-${i}`,
      ref: `${item.kind === "customer" ? "ORD" : "SHP"}-${4800 + (seed % 999) + i * 7}`,
      origin: cities[(seed + i) % cities.length],
      destination: cities[(seed + i + 3) % cities.length],
      status,
      value: `₹${(45 + ((seed + i * 11) % 280)).toLocaleString("en-IN")}k`,
      date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    })
  }
  return rows
}

// ── Contracts / SLAs ────────────────────────────────────────────────────────

interface ContractRow {
  id: string
  title: string
  type: string
  effective: string
  expires: string
  status: "Active" | "Expiring" | "Expired"
  sla: string
}

function getContracts(item: SettingsDetailItem): ContractRow[] {
  const seed = hashStr(item.id)
  const now = Date.now()
  const base = item.kind === "customer"
    ? [
        { title: "Master Service Agreement", type: "MSA", sla: "98% on-time" },
        { title: "Volume Discount Schedule", type: "Pricing", sla: "Tier-2 rebate" },
        { title: "Quality Inspection SLA", type: "Quality", sla: "<0.5% defect" },
        { title: "Reverse Logistics Addendum", type: "Returns", sla: "RMA <48h" },
      ]
    : [
        { title: "Fleet Service Contract", type: "Fleet", sla: "95% availability" },
        { title: "Lane Rate Card", type: "Pricing", sla: "Lock 12 months" },
        { title: "Insurance & Liability", type: "Risk", sla: "₹50L per shipment" },
        { title: "Driver SLA Addendum", type: "Ops", sla: "GPS + ELD mandate" },
      ]
  return base.map((c, i) => {
    const effective = new Date(now - (120 - i * 20) * DAY)
    const expiresIn = 30 + (seed % 400) - i * 30
    const expires = new Date(now + expiresIn * DAY)
    const status: ContractRow["status"] =
      expiresIn < 0 ? "Expired" : expiresIn < 45 ? "Expiring" : "Active"
    return {
      id: `c-${i}`,
      title: c.title,
      type: c.type,
      effective: effective.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      expires: expires.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status,
      sla: c.sla,
    }
  })
}

// ── Activity timeline ───────────────────────────────────────────────────────

interface TimelineEvent {
  time: string
  label: string
  detail: string
  actor: string
  kind: "created" | "updated" | "milestone" | "alert" | "renewal"
}

function getTimeline(item: SettingsDetailItem): TimelineEvent[] {
  const seed = hashStr(item.id + item.name)
  const now = Date.now()
  const events: TimelineEvent[] = [
    {
      time: new Date(now - 1 * DAY * 2).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      label: "Quarterly Business Review",
      detail: `Q2 review with ${item.name} — discussed growth plan and Q3 commitments`,
      actor: "Account Manager",
      kind: "milestone",
    },
    {
      time: new Date(now - 1 * DAY * 9).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      label: "Contract Amended",
      detail: `Volume rebate threshold updated to ₹${(2 + (seed % 8)).toFixed(1)}L/month`,
      actor: "Legal Team",
      kind: "updated",
    },
    {
      time: new Date(now - 1 * DAY * 21).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      label: "SLA Breach Resolved",
      detail: `On-time rate dipped to ${84 + (seed % 6)}% — corrective action plan executed`,
      actor: "Operations",
      kind: "alert",
    },
    {
      time: new Date(now - 1 * DAY * 65).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      label: "Compliance Audit Passed",
      detail: `Annual compliance review completed — ISO 9001:2015 re-certified`,
      actor: "Quality Team",
      kind: "milestone",
    },
    {
      time: new Date(now - 1 * DAY * 180).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      label: "Onboarded",
      detail: `${item.name} onboarded as ${item.kind === "customer" ? (item.type ?? "Tier1") : "logistics partner"}`,
      actor: "Sales Team",
      kind: "created",
    },
  ]
  return events
}

// ── Warehouse / Lane coverage ───────────────────────────────────────────────

interface CoverageRow {
  id: string
  label: string
  volume: number
  share: number
  status: "good" | "warning" | "critical"
}

function getCoverage(item: SettingsDetailItem): CoverageRow[] {
  const seed = hashStr(item.id)
  if (item.kind === "customer") {
    const warehouses = [
      { name: "Chennai Hub", share: 32 + (seed % 8) },
      { name: "Pune DC", share: 24 + (seed % 6) },
      { name: "Mumbai West", share: 18 - (seed % 5) },
      { name: "Gurugram NCR", share: 14 - (seed % 4) },
      { name: "Kolkata East", share: 12 - (seed % 3) },
    ]
    const total = warehouses.reduce((a, w) => a + w.share, 0)
    return warehouses.map((w, i) => ({
      id: `w-${i}`,
      label: w.name,
      volume: Math.round((w.share / total) * (320 + (seed % 180))),
      share: w.share,
      status: (w.share > 25 ? "warning" : "good") as CoverageRow["status"],
    }))
  }
  const lanes = [
    { name: "Chennai → Bangalore", share: 28 + (seed % 7) },
    { name: "Pune → Mumbai", share: 22 + (seed % 5) },
    { name: "Gurugram → Jaipur", share: 16 - (seed % 4) },
    { name: "Kolkata → Bhubaneswar", share: 12 - (seed % 3) },
    { name: "Hosur → Coimbatore", share: 22 - (seed % 6) },
  ]
  const total = lanes.reduce((a, l) => a + l.share, 0)
  return lanes.map((l, i) => ({
    id: `l-${i}`,
    label: l.name,
    volume: Math.round((l.share / total) * (180 + (seed % 100))),
    share: l.share,
    status: (l.share > 30 ? "warning" : "good") as CoverageRow["status"],
  }))
}

// ── Chart config ────────────────────────────────────────────────────────────

const activityChartConfig = {
  orders: { label: "Orders", color: "hsl(217, 91%, 60%)" },
  revenue: { label: "Revenue (₹)", color: "hsl(142, 71%, 45%)" },
} satisfies ChartConfig

const coverageChartConfig = {
  volume: { label: "Volume", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig

// ── Component ───────────────────────────────────────────────────────────────

export function SettingsDetailDrawer({ open, onOpenChange, item }: SettingsDetailDrawerProps) {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = React.useState<"overview" | "shipments" | "contracts" | "timeline">("overview")

  React.useEffect(() => {
    if (open) setSelectedTab("overview")
  }, [open, item?.id])

  if (!item) return null

  const theme = statusTheme[item.status]
  const Icon = item.kind === "customer" ? Building2 : Truck
  const kpis = getKPIs(item)
  const trend = getActivityTrend(item)
  const shipments = getShipments(item)
  const contracts = getContracts(item)
  const timeline = getTimeline(item)
  const coverage = getCoverage(item)
  const totalVolume = coverage.reduce((a, c) => a + c.volume, 0)

  const initials = item.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleExport = () => {
    toast.info(
      "Export started",
      `${item.name} report will be downloaded as PDF in ~30 seconds.`,
    )
  }
  const handleNotify = () => {
    toast.success(
      "Notification sent",
      `Account manager for ${item.name} has been notified.`,
    )
  }
  const handleContact = () => {
    toast.info(
      "Opening dialer",
      `Calling ${item.contact ?? item.name}...`,
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header strip */}
        <SheetHeader className={cn(
          "relative px-5 py-4 border-b settings-drawer-header",
          "bg-gradient-to-b",
          theme.gradient,
          theme.border,
          theme.glow
        )}>
          <div className="flex items-start gap-3">
            <div className={cn("rounded-xl p-2.5 border settings-icon-pulse", theme.border, theme.bg, theme.text)}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <SheetTitle className="text-base font-semibold flex items-center gap-2">
                <span className="truncate">{item.name}</span>
                <Badge variant="outline" className={cn("text-[10px] rounded-full", theme.text, theme.border)}>
                  {theme.label}
                </Badge>
              </SheetTitle>
              <SheetDescription className="text-xs flex items-center gap-2 flex-wrap">
                {item.code && (
                  <span className="font-mono">{item.code}</span>
                )}
                {item.kind === "customer" ? (
                  <>
                    {item.type && <span>· {item.type}</span>}
                    {item.city && item.state && (
                      <span className="flex items-center gap-0.5">
                        · <MapPin className="h-3 w-3" /> {item.city}, {item.state}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span>· {item.fleet} vehicles</span>
                    <span>· {item.routes} routes</span>
                    {item.rating != null && (
                      <span className="flex items-center gap-0.5">
                        · <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {item.rating}.0
                      </span>
                    )}
                  </>
                )}
              </SheetDescription>
            </div>
          </div>

          {/* Hero stat grid */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 settings-stat-enter">
            {kpis.slice(0, 4).map((k) => (
              <div key={k.label} className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", theme.border)}>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <k.icon className="h-3 w-3" />
                  {k.label.split(" ")[0]}
                </p>
                <p className="text-sm font-bold text-number">{k.value}</p>
                <p className={cn(
                  "text-[9px]",
                  k.severity === "good" && "text-emerald-600 dark:text-emerald-400",
                  k.severity === "warning" && "text-amber-600 dark:text-amber-400",
                  k.severity === "critical" && "text-red-600 dark:text-red-400"
                )}>
                  {k.delta}
                </p>
              </div>
            ))}
          </div>

          {/* Sub-tab navigation */}
          <div className="mt-3 flex gap-1 rounded-lg bg-muted/60 p-0.5">
            {([
              { id: "overview", label: "Overview" },
              { id: "shipments", label: `Shipments (${shipments.length})` },
              { id: "contracts", label: `Contracts (${contracts.length})` },
              { id: "timeline", label: "Timeline" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTab(t.id)}
                className={cn(
                  "flex-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all",
                  selectedTab === t.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="settings-drawer-body-enter px-5 py-4 space-y-4">
          {selectedTab === "overview" && (
            <>
              {/* Contact Card */}
              <div className="settings-card-enter rounded-xl border bg-card p-3 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Primary Contact
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn("text-xs", theme.bg, theme.text)}>
                      {(item.contact ?? item.name).split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.contact ?? "—"}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                      {item.email && (
                        <span className="flex items-center gap-0.5">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[180px]">{item.email}</span>
                        </span>
                      )}
                      {item.phone && (
                        <span className="flex items-center gap-0.5">
                          <Phone className="h-3 w-3" />
                          {item.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={handleContact}>
                    <Phone className="h-3 w-3" />
                    Call
                  </Button>
                </div>
              </div>

              {/* KPI grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 settings-stat-enter">
                {kpis.map((k) => (
                  <Card key={k.label} className="settings-card-enter rounded-lg border-border/60 shadow-none">
                    <CardContent className="p-2.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                          <k.icon className="h-3 w-3" />
                          {k.label}
                        </p>
                        {k.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                        ) : k.trend === "down" ? (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        ) : null}
                      </div>
                      <p className="text-base font-bold text-number">{k.value}</p>
                      <p className={cn(
                        "text-[10px]",
                        k.severity === "good" && "text-emerald-600 dark:text-emerald-400",
                        k.severity === "warning" && "text-amber-600 dark:text-amber-400",
                        k.severity === "critical" && "text-red-600 dark:text-red-400"
                      )}>
                        {k.delta}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 30-day activity chart */}
              <div className="settings-card-enter rounded-xl border bg-card p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5" />
                    30-Day Activity
                  </h3>
                  <Badge variant="outline" className="text-[10px]">
                    {trend.reduce((a, p) => a + p.orders, 0)} orders
                  </Badge>
                </div>
                <ChartContainer config={activityChartConfig} className="h-[140px] w-full">
                    <AreaChart data={trend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={5} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="hsl(217, 91%, 60%)"
                        strokeWidth={2}
                        fill="url(#ordersGrad)"
                      />
                    </AreaChart>
                </ChartContainer>
              </div>

              {/* Coverage list */}
              <div className="settings-card-enter rounded-xl border bg-card p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                    {item.kind === "customer" ? (
                      <>
                        <Warehouse className="h-3.5 w-3.5" />
                        Warehouse Coverage
                      </>
                    ) : (
                      <>
                        <Route className="h-3.5 w-3.5" />
                        Lane Coverage
                      </>
                    )}
                  </h3>
                  <Badge variant="outline" className="text-[10px]">
                    {coverage.length} {item.kind === "customer" ? "warehouses" : "lanes"}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  {coverage.map((c) => (
                    <div key={c.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium truncate">{c.label}</span>
                        <span className="text-muted-foreground text-number">
                          {c.volume} · {c.share}%
                        </span>
                      </div>
                      <Progress
                        value={c.share}
                        className={cn(
                          "h-1.5",
                          c.status === "warning" && "[&>div]:bg-amber-500",
                          c.status === "critical" && "[&>div]:bg-red-500"
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Coverage chart */}
              <div className="settings-card-enter rounded-xl border bg-card p-3 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Volume Distribution
                </h3>
                <ChartContainer config={coverageChartConfig} className="h-[120px] w-full">
                  <BarChart data={coverage} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 8 }} interval={0} tickLine={false} axisLine={false} tickFormatter={(v: string) => v.length > 10 ? v.slice(0, 8) + "…" : v} />
                    <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                      {coverage.map((c, i) => (
                        <Cell
                          key={i}
                          fill={
                            c.status === "good"
                              ? "hsl(142, 71%, 45%)"
                              : c.status === "warning"
                                ? "hsl(38, 92%, 50%)"
                                : "hsl(0, 84%, 60%)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <p className="text-[10px] text-muted-foreground text-center">
                  Total volume: <span className="font-semibold text-foreground text-number">{totalVolume.toLocaleString("en-IN")}</span> units
                </p>
              </div>
            </>
          )}

          {selectedTab === "shipments" && (
            <div className="settings-card-enter rounded-xl border bg-card overflow-hidden">
              <div className="max-h-[460px] overflow-y-auto divide-y">
                {shipments.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 hover:bg-accent/40 transition-colors">
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                      s.status === "Delivered" && "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
                      s.status === "In Transit" && "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
                      s.status === "Pending" && "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
                      s.status === "Delayed" && "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
                    )}>
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium font-mono">{s.ref}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" />
                        {s.origin} → {s.destination}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={cn(
                        "text-[10px]",
                        s.status === "Delivered" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                        s.status === "In Transit" && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                        s.status === "Pending" && "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                        s.status === "Delayed" && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      )}>
                        {s.status}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground text-number mt-0.5">{s.value}</p>
                      <p className="text-[9px] text-muted-foreground">{s.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "contracts" && (
            <div className="settings-card-enter rounded-xl border bg-card overflow-hidden">
              <div className="divide-y">
                {contracts.map((c) => (
                  <div key={c.id} className="p-3 hover:bg-accent/40 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                          c.status === "Active" && "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
                          c.status === "Expiring" && "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
                          c.status === "Expired" && "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
                        )}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{c.title}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {c.type} · Effective {c.effective} → {c.expires}
                          </p>
                          <p className="text-[10px] mt-0.5 flex items-center gap-1">
                            <Shield className="h-2.5 w-2.5" />
                            <span className="text-muted-foreground">SLA:</span>
                            <span className="font-medium">{c.sla}</span>
                          </p>
                        </div>
                      </div>
                      <Badge className={cn(
                        "text-[9px] shrink-0",
                        c.status === "Active" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                        c.status === "Expiring" && "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                        c.status === "Expired" && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      )}>
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "timeline" && (
            <div className="settings-card-enter rounded-xl border bg-card p-3">
              <ol className="relative border-l border-border ml-3 space-y-3">
                {timeline.map((e, i) => (
                  <li key={i} className="ml-3 space-y-1" style={{ animationDelay: `${i * 60}ms` }}>
                    <span className={cn(
                      "absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-background",
                      e.kind === "created" && "bg-blue-500",
                      e.kind === "updated" && "bg-violet-500",
                      e.kind === "milestone" && "bg-emerald-500",
                      e.kind === "alert" && "bg-red-500",
                      e.kind === "renewal" && "bg-amber-500"
                    )} />
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium flex items-center gap-1">
                        {e.kind === "milestone" && <Award className="h-3 w-3 text-emerald-500" />}
                        {e.kind === "alert" && <AlertTriangle className="h-3 w-3 text-red-500" />}
                        {e.kind === "created" && <Sparkles className="h-3 w-3 text-blue-500" />}
                        {e.kind === "updated" && <FileText className="h-3 w-3 text-violet-500" />}
                        {e.kind === "renewal" && <Calendar className="h-3 w-3 text-amber-500" />}
                        {e.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{e.time}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{e.detail}</p>
                    <p className="text-[10px] text-muted-foreground/70">— {e.actor}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleNotify}>
            <Send className="h-3.5 w-3.5" />
            Notify
          </Button>
          <Button size="sm" className="flex-1 gap-1.5" onClick={handleContact}>
            <Phone className="h-3.5 w-3.5" />
            Call
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
