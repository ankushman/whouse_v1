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
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  FileBarChart,
  FileText,
  Building2,
  Package,
  Truck,
  DollarSign,
  Calendar,
  RefreshCw,
  Download,
  ChevronRight,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  History,
  Mail,
  Users,
  HardDrive,
  FileDown,
  Layers,
  Database,
  Share2,
  Settings,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReportDetail {
  id: string
  title: string
  description: string
  icon: typeof FileBarChart
  lastGenerated: string
  frequency: string
  formats: ("pdf" | "excel")[]
  color: string
}

export interface ReportsDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: ReportDetail | null
  onRegenerate?: (report: ReportDetail) => void
  onShare?: (report: ReportDetail) => void
}

interface ReportSection {
  id: string
  title: string
  rows: number
  type: "table" | "chart" | "kpis" | "text" | "pie"
  description: string
}

interface DistributionRecipient {
  id: string
  name: string
  email: string
  role: string
  lastViewed: string
  status: "viewed" | "pending" | "bounced"
}

interface ScheduleRun {
  id: string
  timestamp: string
  duration: string
  status: "completed" | "processing" | "failed"
  fileSize: string
  triggeredBy: "schedule" | "manual"
}

interface KpiRow {
  label: string
  value: string
  delta: number
  positive: boolean
}

// ---------------------------------------------------------------------------
// Deterministic mock generators
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function getSections(report: ReportDetail): ReportSection[] {
  const seed = hashStr(report.id + "sections")
  const base: Record<string, ReportSection[]> = {
    exec: [
      { id: "S1", title: "KPI Snapshot", rows: 11, type: "kpis", description: "All 11 executive KPIs with trend arrows" },
      { id: "S2", title: "Warehouse Heatmap", rows: 6, type: "chart", description: "6-warehouse capacity & accuracy heatmap" },
      { id: "S3", title: "Daily Throughput", rows: 7, type: "chart", description: "7-day inbound vs outbound volume" },
      { id: "S4", title: "SLA Compliance", rows: 6, type: "table", description: "Per-warehouse SLA achievement vs target" },
      { id: "S5", title: "Cost Summary", rows: 4, type: "kpis", description: "Labor/transport/equipment/storage totals" },
      { id: "S6", title: "Recommendations", rows: 5, type: "text", description: "AI-generated 5 action items" },
    ],
    warehouse: [
      { id: "S1", title: "Performance Overview", rows: 6, type: "table", description: "Per-warehouse throughput & accuracy" },
      { id: "S2", title: "Capacity Utilization", rows: 6, type: "chart", description: "Daily capacity vs actual utilization" },
      { id: "S3", title: "Equipment Status", rows: 12, type: "table", description: "All equipment with utilization %" },
      { id: "S4", title: "SLA per Warehouse", rows: 6, type: "kpis", description: "SLA achievement by warehouse" },
    ],
    mis: [
      { id: "S1", title: "Operations Summary", rows: 10, type: "kpis", description: "10 key operational metrics" },
      { id: "S2", title: "Financial Summary", rows: 8, type: "table", description: "Cost breakdown by category" },
      { id: "S3", title: "Workforce Stats", rows: 15, type: "table", description: "Top 15 employee performance" },
      { id: "S4", title: "Compliance Audit", rows: 6, type: "text", description: "Compliance items checked" },
    ],
    inventory: [
      { id: "S1", title: "Stock Levels", rows: 50, type: "table", description: "Top 50 SKUs by quantity" },
      { id: "S2", title: "ABC Classification", rows: 3, type: "kpis", description: "A/B/C class distribution" },
      { id: "S3", title: "Variance Analysis", rows: 12, type: "table", description: "12 SKUs with >5% variance" },
      { id: "S4", title: "Cycle Count Schedule", rows: 8, type: "table", description: "8 SKUs scheduled for count" },
      { id: "S5", title: "Accuracy Trend", rows: 6, type: "chart", description: "6-month accuracy trend" },
    ],
    transport: [
      { id: "S1", title: "Fleet Utilization", rows: 18, type: "table", description: "All 18 vehicles with utilization %" },
      { id: "S2", title: "Delivery Performance", rows: 7, type: "chart", description: "7-day on-time vs delayed" },
      { id: "S3", title: "OTIF Metrics", rows: 6, type: "kpis", description: "OTIF per warehouse" },
      { id: "S4", title: "Route Analytics", rows: 24, type: "table", description: "24 routes with cost/km" },
    ],
    cost: [
      { id: "S1", title: "Cost Breakdown", rows: 4, type: "pie", description: "Labor/transport/equipment/storage split" },
      { id: "S2", title: "Monthly Trend", rows: 6, type: "chart", description: "6-month cost trend" },
      { id: "S3", title: "Optimization Opportunities", rows: 5, type: "text", description: "5 identified savings opportunities" },
      { id: "S4", title: "Per-Warehouse Cost", rows: 6, type: "table", description: "Cost by warehouse" },
    ],
  }
  return base[report.id] || base.exec
}

function getDistributionList(report: ReportDetail): DistributionRecipient[] {
  const seed = hashStr(report.id + "dist")
  const names = [
    { name: "Rajesh Kumar", email: "rajesh.k@autoflow.in", role: "Operations Head" },
    { name: "Priya Sharma", email: "priya.s@autoflow.in", role: "Warehouse Manager" },
    { name: "Vikram Singh", email: "vikram.s@autoflow.in", role: "Finance Controller" },
    { name: "Anjali Mehta", email: "anjali.m@autoflow.in", role: "Regional Director" },
    { name: "Suresh Babu", email: "suresh.b@autoflow.in", role: "Shift Supervisor" },
  ]
  const statuses: DistributionRecipient["status"][] = ["viewed", "viewed", "pending", "viewed", "bounced"]
  return names.map((n, i) => ({
    id: `R-${i + 1}`,
    ...n,
    lastViewed: i === 0 ? "5 min ago" : i === 1 ? "1 hour ago" : i === 2 ? "—" : i === 3 ? "3 hours ago" : "Bounced",
    status: statuses[(seed + i) % 5],
  })).slice(0, 3 + (seed % 3))
}

function getScheduleHistory(report: ReportDetail): ScheduleRun[] {
  const seed = hashStr(report.id + "history")
  const statuses: ScheduleRun["status"][] = ["completed", "completed", "completed", "processing", "failed"]
  return Array.from({ length: 5 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const status = statuses[(seed + i) % 5]
    return {
      id: `RUN-${i + 1}`,
      timestamp: d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      duration: `${2 + (seed % 5)}.${(seed * 7 + i) % 10}s`,
      status,
      fileSize: status === "failed" ? "—" : `${(1 + (seed % 4)).toFixed(1)} MB`,
      triggeredBy: i === 0 ? "schedule" : (seed + i) % 3 === 0 ? "manual" : "schedule",
    }
  })
}

function getKpisForReport(report: ReportDetail): KpiRow[] {
  const seed = hashStr(report.id + "kpis")
  const base: Record<string, KpiRow[]> = {
    exec: [
      { label: "Total Shipments", value: "1,847", delta: 12.5, positive: true },
      { label: "Inventory Accuracy", value: "97.8%", delta: 0.4, positive: true },
      { label: "SLA Achievement", value: "94.6%", delta: -1.2, positive: false },
      { label: "Daily Throughput", value: "12.4k", delta: 8.3, positive: true },
    ],
    warehouse: [
      { label: "Avg Occupancy", value: "79.7%", delta: 3.2, positive: true },
      { label: "Equipment Utilization", value: "82.4%", delta: 1.8, positive: true },
      { label: "Dock-to-Stock", value: "3.2 hrs", delta: -0.4, positive: true },
      { label: "Cycle Count Accuracy", value: "98.1%", delta: 0.3, positive: true },
    ],
    mis: [
      { label: "Active Warehouses", value: "6", delta: 0, positive: true },
      { label: "Total Employees", value: "247", delta: 4, positive: true },
      { label: "Monthly Dispatch", value: "5,832", delta: 9.1, positive: true },
      { label: "Monthly Revenue", value: "₹4.2Cr", delta: 6.4, positive: true },
    ],
    inventory: [
      { label: "Total SKUs", value: "1,247", delta: 23, positive: true },
      { label: "Stock Value", value: "₹2.8Cr", delta: 4.1, positive: true },
      { label: "Dead Stock", value: "3.2%", delta: -0.5, positive: true },
      { label: "Pending Putaway", value: "63", delta: -8, positive: true },
    ],
    transport: [
      { label: "OTIF Rate", value: "91.2%", delta: 1.4, positive: true },
      { label: "Fleet Utilization", value: "87%", delta: 2.1, positive: true },
      { label: "Avg Transit Time", value: "8.4 hrs", delta: -0.3, positive: true },
      { label: "Delayed Shipments", value: "23", delta: 4, positive: false },
    ],
    cost: [
      { label: "Total Cost", value: "₹38.4L", delta: 3.2, positive: false },
      { label: "Cost per Unit", value: "₹4.20", delta: -0.8, positive: true },
      { label: "Savings Identified", value: "₹2.1L", delta: 12.5, positive: true },
      { label: "Budget Variance", value: "+2.4%", delta: -0.6, positive: true },
    ],
  }
  return base[report.id] || base.exec
}

function getPreviewChartData(report: ReportDetail): { type: "area" | "bar" | "line" | "pie"; data: Array<Record<string, unknown>>; config: Record<string, { label: string; color: string }> } {
  const seed = hashStr(report.id + "preview")
  if (report.id === "cost") {
    return {
      type: "pie",
      data: [
        { name: "Labor", value: 35 + (seed % 8) },
        { name: "Transport", value: 28 + (seed % 6) },
        { name: "Equipment", value: 18 + (seed % 4) },
        { name: "Storage", value: 19 + (seed % 3) },
      ],
      config: {
        labor: { label: "Labor", color: "#2563EB" },
        transport: { label: "Transport", color: "#10B981" },
        equipment: { label: "Equipment", color: "#F59E0B" },
        storage: { label: "Storage", color: "#8B5CF6" },
      },
    }
  }
  if (report.id === "exec" || report.id === "mis") {
    return {
      type: "area",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
        month: m,
        inbound: 800 + (seed % 200) + i * 50,
        outbound: 750 + (seed % 180) + i * 45,
      })),
      config: {
        inbound: { label: "Inbound", color: "#2563EB" },
        outbound: { label: "Outbound", color: "#10B981" },
      },
    }
  }
  if (report.id === "warehouse") {
    return {
      type: "bar",
      data: [
        { name: "Chennai", inbound: 1247, outbound: 1183 },
        { name: "Mumbai", inbound: 982, outbound: 945 },
        { name: "Delhi", inbound: 1102, outbound: 1067 },
        { name: "Kolkata", inbound: 743, outbound: 712 },
        { name: "Pune", inbound: 658, outbound: 624 },
        { name: "Bangalore", inbound: 891, outbound: 854 },
      ],
      config: {
        inbound: { label: "Inbound", color: "#2563EB" },
        outbound: { label: "Outbound", color: "#10B981" },
      },
    }
  }
  // inventory + transport -> line
  return {
    type: "line",
    data: ["W1", "W2", "W3", "W4", "W5", "W6"].map((w, i) => ({
      week: w,
      target: 90,
      actual: 85 + (seed % 12) + i,
    })),
    config: {
      target: { label: "Target", color: "#94A3B8" },
      actual: { label: "Actual", color: "#2563EB" },
    },
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReportsDetailDrawer({
  open,
  onOpenChange,
  report,
  onRegenerate,
  onShare,
}: ReportsDetailDrawerProps) {
  const toast = useToast()

  const sections = React.useMemo(() => report ? getSections(report) : [], [report])
  const distribution = React.useMemo(() => report ? getDistributionList(report) : [], [report])
  const scheduleHistory = React.useMemo(() => report ? getScheduleHistory(report) : [], [report])
  const kpis = React.useMemo(() => report ? getKpisForReport(report) : [], [report])
  const chartData = React.useMemo(() => report ? getPreviewChartData(report) : null, [report])

  if (!report) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-[680px] p-0 overflow-y-auto" />
      </Sheet>
    )
  }

  const rpt = report
  const Icon = rpt.icon

  const isReady = rpt.lastGenerated.toLowerCase().includes("today")
  const isFailed = scheduleHistory.some((s) => s.status === "failed" && s.id === "RUN-1")
  const statusColor = isFailed
    ? "text-red-600 dark:text-red-400"
    : isReady
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-amber-600 dark:text-amber-400"
  const statusBg = isFailed
    ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800"
    : isReady
    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
    : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"

  const handleExportCSV = () => {
    const data = kpis.map((k) => ({
      KPI: k.label,
      Value: k.value,
      "Change (%)": `${k.delta > 0 ? "+" : ""}${k.delta}`,
      Trend: k.positive ? "↑" : "↓",
    }))
    exportToCSV(data, `report-${rpt.id}-kpis`, ["KPI", "Value", "Change (%)", "Trend"])
  }

  const handleRegenerate = () => {
    toast.success("Regeneration Started", `${rpt.title} is being regenerated. ETA: 2-3 minutes.`)
    onRegenerate?.(rpt)
  }

  const handleShare = () => {
    toast.info("Sharing Report", `Opening share dialog for ${rpt.title}...`)
    onShare?.(rpt)
  }

  const handleRefresh = () => {
    toast.info("Refreshing", `Re-fetching latest snapshot for ${rpt.title}...`)
  }

  const renderPreviewChart = () => {
    if (!chartData) return null
    if (chartData.type === "pie") {
      return (
        <ChartContainer config={chartData.config} className="h-[220px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie
              data={chartData.data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {chartData.data.map((entry, i) => {
                const colors = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6"]
                return <Cell key={i} fill={colors[i % colors.length]} />
              })}
            </Pie>
          </PieChart>
        </ChartContainer>
      )
    }
    if (chartData.type === "area") {
      return (
        <ChartContainer config={chartData.config} className="h-[220px] w-full">
          <AreaChart data={chartData.data}>
            <defs>
              <linearGradient id="rptAreaIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rptAreaOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="inbound" stroke="#2563EB" strokeWidth={2} fill="url(#rptAreaIn)" />
            <Area type="monotone" dataKey="outbound" stroke="#10B981" strokeWidth={2} fill="url(#rptAreaOut)" />
          </AreaChart>
        </ChartContainer>
      )
    }
    if (chartData.type === "bar") {
      return (
        <ChartContainer config={chartData.config} className="h-[220px] w-full">
          <BarChart data={chartData.data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="inbound" fill="#2563EB" radius={[3, 3, 0, 0]} />
            <Bar dataKey="outbound" fill="#10B981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
      )
    }
    return (
      <ChartContainer config={chartData.config} className="h-[220px] w-full">
        <LineChart data={chartData.data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
          <XAxis dataKey="week" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          <Line type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3, fill: "#2563EB" }} />
        </LineChart>
      </ChartContainer>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[680px] p-0 overflow-y-auto"
      >
        {/* Header strip */}
        <div className={cn(
          "sticky top-0 z-20 bg-gradient-to-br backdrop-blur-sm border-b rpt-drawer-header",
          statusBg
        )}>
          <SheetHeader className="space-y-0 p-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "relative flex size-14 items-center justify-center rounded-2xl border-2 shadow-md rpt-icon-pulse",
                  statusBg
                )}>
                  <Icon className={cn("size-7", statusColor)} />
                </div>
                <div className="space-y-1">
                  <SheetTitle className="text-lg font-semibold leading-tight flex items-center gap-2">
                    {rpt.title}
                    {isFailed && (
                      <Badge variant="outline" className="text-[10px] gap-1 text-red-600 border-red-300 dark:text-red-400 dark:border-red-700">
                        <AlertCircle className="size-2.5" />
                        Failed
                      </Badge>
                    )}
                    {isReady && !isFailed && (
                      <Badge variant="outline" className="text-[10px] gap-1 text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700">
                        <CheckCircle2 className="size-2.5" />
                        Ready
                      </Badge>
                    )}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-0.5">
                      <Clock className="size-2.5" /> {rpt.lastGenerated}
                    </span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="size-2.5" /> {rpt.frequency}
                    </span>
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8" onClick={handleRefresh} title="Refresh">
                  <RefreshCw className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={handleExportCSV} title="Export KPIs">
                  <Download className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Hero metrics */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 rpt-stat-enter" style={{ animationDelay: "0ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Sections</p>
                <p className="mt-0.5 text-sm font-bold text-number">{sections.length}</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 rpt-stat-enter" style={{ animationDelay: "60ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Data Rows</p>
                <p className="mt-0.5 text-sm font-bold text-number">{sections.reduce((s, x) => s + x.rows, 0)}</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 rpt-stat-enter" style={{ animationDelay: "120ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Recipients</p>
                <p className="mt-0.5 text-sm font-bold text-number">{distribution.length}</p>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 rpt-drawer-body-enter">

          {/* KPI summary */}
          <div className="rounded-lg border border-border/60 bg-card p-4 rpt-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="size-3" />
                Key Metrics Snapshot
              </h3>
              <Badge variant="outline" className="text-[10px] gap-1">
                <Sparkles className="size-2.5" />
                Auto-extracted
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {kpis.map((k, i) => (
                <div
                  key={k.label}
                  className="rounded-md border border-border/40 bg-background/60 p-2.5 rpt-kpi-enter"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <p className="text-[9px] uppercase text-muted-foreground">{k.label}</p>
                  <div className="mt-0.5 flex items-center justify-between">
                    <p className="text-sm font-bold text-number">{k.value}</p>
                    <span className={cn(
                      "text-[10px] font-semibold flex items-center gap-0.5",
                      k.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {k.positive ? <TrendingUp className="size-2.5" /> : <AlertTriangle className="size-2.5" />}
                      {k.delta > 0 ? "+" : ""}{k.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-3">
              <Button size="sm" className="h-7 text-[10px] gap-1" onClick={handleRegenerate}>
                <RefreshCw className="size-2.5" />
                Regenerate
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={handleShare}>
                <Share2 className="size-2.5" />
                Share
              </Button>
            </div>
          </div>

          {/* Preview chart */}
          <div className="rounded-lg border border-border/60 bg-card p-4 rpt-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="size-3" />
                Visual Preview
              </h3>
              <span className="text-[10px] text-muted-foreground">embedded chart sample</span>
            </div>
            {renderPreviewChart()}
          </div>

          {/* Sections list */}
          <div className="rounded-lg border border-border/60 bg-card p-4 rpt-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3" />
                Report Sections
              </h3>
              <span className="text-[10px] text-muted-foreground">{sections.length} sections</span>
            </div>
            <div className="space-y-1.5">
              {sections.map((section, i) => {
                const TypeIcon = section.type === "table" ? Database :
                                 section.type === "chart" ? TrendingUp :
                                 section.type === "kpis" ? Sparkles :
                                 section.type === "pie" ? Layers :
                                 FileText
                return (
                  <div
                    key={section.id}
                    className="rpt-section-row group flex items-center gap-3 rounded-md border border-border/40 bg-background/60 px-2.5 py-2"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      <TypeIcon className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-tight">{section.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{section.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-number">{section.rows}</p>
                      <p className="text-[9px] text-muted-foreground">rows</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Distribution list */}
          <div className="rounded-lg border border-border/60 bg-card p-4 rpt-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3" />
                Distribution List
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {distribution.filter((d) => d.status === "viewed").length} viewed
              </span>
            </div>
            <div className="space-y-1.5">
              {distribution.map((rec, i) => {
                const statusBadge = rec.status === "viewed"
                  ? <Badge variant="outline" className="text-[9px] gap-1 text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700"><CheckCircle2 className="size-2.5" />Viewed</Badge>
                  : rec.status === "pending"
                  ? <Badge variant="outline" className="text-[9px] gap-1 text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700"><Clock className="size-2.5" />Pending</Badge>
                  : <Badge variant="outline" className="text-[9px] gap-1 text-red-600 border-red-300 dark:text-red-400 dark:border-red-700"><AlertCircle className="size-2.5" />Bounced</Badge>
                const initials = rec.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                return (
                  <div
                    key={rec.id}
                    className="rpt-recipient-row group flex items-center gap-3 rounded-md border border-border/40 bg-background/60 px-2.5 py-2"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-tight">{rec.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{rec.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">{rec.role}</p>
                        <p className="text-[9px] text-muted-foreground">{rec.lastViewed}</p>
                      </div>
                      {statusBadge}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Schedule history */}
          <div className="rounded-lg border border-border/60 bg-card p-4 rpt-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <History className="size-3" />
                Schedule History
              </h3>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
                <Settings className="size-3" />
                Configure
              </Button>
            </div>
            <div className="space-y-1.5">
              {scheduleHistory.map((run, i) => {
                const statusBadge = run.status === "completed"
                  ? <Badge variant="outline" className="text-[9px] gap-1 text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700"><CheckCircle2 className="size-2.5" />Completed</Badge>
                  : run.status === "processing"
                  ? <Badge variant="outline" className="text-[9px] gap-1 text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700"><Loader2 className="size-2.5 animate-spin" />Processing</Badge>
                  : <Badge variant="outline" className="text-[9px] gap-1 text-red-600 border-red-300 dark:text-red-400 dark:border-red-700"><AlertCircle className="size-2.5" />Failed</Badge>
                return (
                  <div
                    key={run.id}
                    className="rpt-history-row group flex items-center gap-3 rounded-md border border-border/40 bg-background/60 px-2.5 py-2"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60">
                      {run.triggeredBy === "schedule"
                        ? <Calendar className="size-3 text-muted-foreground" />
                        : <Users className="size-3 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-tight">{run.timestamp}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Duration: <span className="text-number">{run.duration}</span> · Size: <span className="text-number">{run.fileSize}</span> · {run.triggeredBy}
                      </p>
                    </div>
                    {statusBadge}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick info */}
          <div className="rounded-lg border border-border/60 bg-card p-4 rpt-card-enter">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Info className="size-3" />
              Report Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <FileText className="size-2.5" /> Report ID
                </p>
                <p className="text-xs font-mono mt-0.5">{rpt.id}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-2.5" /> Frequency
                </p>
                <p className="text-xs font-medium mt-0.5">{rpt.frequency}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <HardDrive className="size-2.5" /> Format
                </p>
                <p className="text-xs font-medium mt-0.5 uppercase">{rpt.formats.join(", ")}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Clock className="size-2.5" /> Last Generated
                </p>
                <p className="text-xs font-medium mt-0.5">{rpt.lastGenerated}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 pb-1 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground">
              ID: <span className="font-mono">{rpt.id}</span> · Last sync: just now
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] gap-1"
              onClick={() => toast.info("Opening full preview", `Loading full ${rpt.title} preview...`)}
            >
              <ChevronRight className="size-3" />
              Full preview
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
