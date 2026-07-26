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
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"
import {
  Users,
  Fuel,
  Wrench,
  Warehouse,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  AlertTriangle,
  Target,
  PiggyBank,
  Calculator,
  Truck,
  Package,
  Clock,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Download,
  Zap,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"
import { costTrend } from "@/data/mock-data"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CostCategory = "labor" | "transport" | "equipment" | "storage"

export interface CostDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CostCategory | null
  monthLabel?: string // e.g. "Dec" — defaults to latest
}

interface CostDriver {
  name: string
  amount: number
  share: number // 0-100
  trend: number // % change vs prev month
  note: string
}

interface Recommendation {
  title: string
  impact: string
  saving: number // ₹
  effort: "low" | "medium" | "high"
  category: "negotiation" | "efficiency" | "automation" | "policy"
}

// ---------------------------------------------------------------------------
// Category metadata
// ---------------------------------------------------------------------------

const CATEGORY_META: Record<CostCategory, {
  label: string
  icon: typeof Users
  color: string
  hex: string
  bgClass: string
  textClass: string
  borderClass: string
  description: string
}> = {
  labor: {
    label: "Labor Cost",
    icon: Users,
    color: "blue",
    hex: "#2563EB",
    bgClass: "bg-blue-50 dark:bg-blue-950/40",
    textClass: "text-blue-600 dark:text-blue-400",
    borderClass: "border-blue-200 dark:border-blue-800",
    description: "Wages, overtime, benefits, and contractor payments",
  },
  transport: {
    label: "Transport Cost",
    icon: Fuel,
    color: "emerald",
    hex: "#10B981",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    textClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    description: "Freight, last-mile delivery, fuel surcharges, and carrier fees",
  },
  equipment: {
    label: "Equipment Cost",
    icon: Wrench,
    color: "amber",
    hex: "#F59E0B",
    bgClass: "bg-amber-50 dark:bg-amber-950/40",
    textClass: "text-amber-600 dark:text-amber-400",
    borderClass: "border-amber-200 dark:border-amber-800",
    description: "Maintenance, leases, depreciation, and spare parts",
  },
  storage: {
    label: "Storage Cost",
    icon: Warehouse,
    color: "purple",
    hex: "#8B5CF6",
    bgClass: "bg-purple-50 dark:bg-purple-950/40",
    textClass: "text-purple-600 dark:text-purple-400",
    borderClass: "border-purple-200 dark:border-purple-800",
    description: "Rent, utilities, insurance, and warehousing overhead",
  },
}

// ---------------------------------------------------------------------------
// Deterministic mock generators (seeded by category)
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function getCostDrivers(category: CostCategory, currentAmount: number): CostDriver[] {
  const seed = hashStr(category)
  const driversByCategory: Record<CostCategory, Array<{ name: string; note: string }>> = {
    labor: [
      { name: "Regular Wages", note: "Base pay for 248 permanent staff" },
      { name: "Overtime Payments", note: "Avg 18h OT per employee this month" },
      { name: "Contractor Fees", note: "12 temp workers for peak season" },
      { name: "Benefits & PF", note: "Provident fund, ESI, gratuity" },
      { name: "Shift Allowances", note: "Night shift + weekend premiums" },
    ],
    transport: [
      { name: "Long-haul Freight", note: "Inter-state trucking (62% of total)" },
      { name: "Last-mile Delivery", note: "Local courier partnerships" },
      { name: "Fuel Surcharges", note: "Diesel price adjustment fees" },
      { name: "Carrier Penalty Fees", note: "SLA breach penalties (3 carriers)" },
      { name: "Vehicle Maintenance", note: "Owned fleet upkeep" },
    ],
    equipment: [
      { name: "Forklift Leases", note: "14 leased forklifts (₹38K/mo each)" },
      { name: "Preventive Maintenance", note: "Scheduled service contracts" },
      { name: "Spare Parts", note: "Hydraulic, electrical, tires" },
      { name: "Depreciation", note: "Owned fleet book depreciation" },
      { name: "Calibration & Inspection", note: "Annual safety certifications" },
    ],
    storage: [
      { name: "Warehouse Rent", note: "6 warehouses on long-term lease" },
      { name: "Electricity & Power", note: "HVAC, lighting, conveyor systems" },
      { name: "Insurance Premiums", note: "Property + inventory coverage" },
      { name: "Property Tax", note: "Annualized monthly accrual" },
      { name: "Security & Surveillance", note: "24/7 guard service + CCTV" },
    ],
  }
  const baseShares = [
    [52, 22, 12, 9, 5],
    [62, 18, 11, 6, 3],
    [42, 28, 14, 11, 5],
    [48, 22, 16, 9, 5],
  ][seed % 4]

  return driversByCategory[category].map((d, i) => {
    const share = baseShares[i]
    return {
      name: d.name,
      amount: Math.round((currentAmount * share) / 100),
      share,
      trend: ((seed + i * 7) % 21) - 10, // -10 to +10
      note: d.note,
    }
  })
}

function getRecommendations(category: CostCategory, currentAmount: number): Recommendation[] {
  const seed = hashStr(category + "rec")
  const recsByCategory: Record<CostCategory, Recommendation[]> = {
    labor: [
      {
        title: "Optimize Shift Scheduling",
        impact: "Reduce overtime by 25% via better demand forecasting",
        saving: Math.round(currentAmount * 0.055),
        effort: "medium",
        category: "efficiency",
      },
      {
        title: "Cross-train Workforce",
        impact: "Enable flexible staffing across warehouses",
        saving: Math.round(currentAmount * 0.035),
        effort: "high",
        category: "policy",
      },
      {
        title: "Automate Repetitive Tasks",
        impact: "Deploy handheld scanners to cut picking labor by 15%",
        saving: Math.round(currentAmount * 0.08),
        effort: "high",
        category: "automation",
      },
      {
        title: "Renegotiate Contractor Rates",
        impact: "Volume discount with top 2 staffing agencies",
        saving: Math.round(currentAmount * 0.025),
        effort: "low",
        category: "negotiation",
      },
    ],
    transport: [
      {
        title: "Consolidate Shipments",
        impact: "Merge LTL loads to FTL — 18% reduction in freight cost",
        saving: Math.round(currentAmount * 0.09),
        effort: "medium",
        category: "efficiency",
      },
      {
        title: "Negotiate Fuel Surcharges",
        impact: "Cap surcharge at ₹6/L with top 3 carriers",
        saving: Math.round(currentAmount * 0.045),
        effort: "low",
        category: "negotiation",
      },
      {
        title: "Route Optimization AI",
        impact: "ML-based routing saves 12% on last-mile delivery",
        saving: Math.round(currentAmount * 0.075),
        effort: "high",
        category: "automation",
      },
      {
        title: "Carrier Performance Audit",
        impact: "Identify and replace low-SLA carriers",
        saving: Math.round(currentAmount * 0.03),
        effort: "medium",
        category: "policy",
      },
    ],
    equipment: [
      {
        title: "Predictive Maintenance Pilot",
        impact: "IoT sensors cut unplanned downtime by 35%",
        saving: Math.round(currentAmount * 0.11),
        effort: "high",
        category: "automation",
      },
      {
        title: "Buy vs Lease Analysis",
        impact: "Refinance 6 forklifts — ownership saves ₹2K/mo each",
        saving: Math.round(currentAmount * 0.06),
        effort: "medium",
        category: "policy",
      },
      {
        title: "Bulk Spare Parts Contract",
        impact: "Annual contract with OEM — 18% discount on parts",
        saving: Math.round(currentAmount * 0.04),
        effort: "low",
        category: "negotiation",
      },
      {
        title: "Right-size Fleet",
        impact: "Retire 2 underutilized forklifts (avg 22% utilization)",
        saving: Math.round(currentAmount * 0.025),
        effort: "low",
        category: "efficiency",
      },
    ],
    storage: [
      {
        title: " renegotiate Warehouse Leases",
        impact: "Extend 2 leases by 3yr for 8% rent reduction",
        saving: Math.round(currentAmount * 0.05),
        effort: "medium",
        category: "negotiation",
      },
      {
        title: "Solar Panel Installation",
        impact: "Cut electricity bills by 40% at 3 warehouses",
        saving: Math.round(currentAmount * 0.085),
        effort: "high",
        category: "automation",
      },
      {
        title: "Consolidate Slow-moving SKUs",
        impact: "Release 15% floor space at Mumbai DC",
        saving: Math.round(currentAmount * 0.035),
        effort: "medium",
        category: "efficiency",
      },
      {
        title: "Insurance Market Review",
        impact: "Re-shop property insurance — 12% lower quotes available",
        saving: Math.round(currentAmount * 0.02),
        effort: "low",
        category: "policy",
      },
    ],
  }
  return recsByCategory[category].sort((a, b) => b.saving - a.saving).map((r, i) => ({
    ...r,
    // Adjust order by saving descending (already sorted above)
    _rank: i + 1,
  })) as Recommendation[]
}

// Effort badge styling
const EFFORT_STYLES: Record<Recommendation["effort"], { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  low: { variant: "secondary", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  medium: { variant: "secondary", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  high: { variant: "secondary", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
}

const CATEGORY_LABELS: Record<Recommendation["category"], string> = {
  negotiation: "Negotiation",
  efficiency: "Efficiency",
  automation: "Automation",
  policy: "Policy",
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CostDetailDrawer({
  open,
  onOpenChange,
  category,
  monthLabel,
}: CostDetailDrawerProps) {
  const { toast } = useToast()

  // Resolve current + previous month data (must be called unconditionally — Rules of Hooks)
  const { currentEntry, prevEntry, monthStr } = React.useMemo(() => {
    if (!monthLabel) {
      return {
        currentEntry: costTrend[costTrend.length - 1],
        prevEntry: costTrend[costTrend.length - 2],
        monthStr: costTrend[costTrend.length - 1].month,
      }
    }
    const idx = costTrend.findIndex(e => e.month === monthLabel)
    const safeIdx = idx < 0 ? costTrend.length - 1 : idx
    return {
      currentEntry: costTrend[safeIdx],
      prevEntry: safeIdx > 0 ? costTrend[safeIdx - 1] : costTrend[safeIdx],
      monthStr: costTrend[safeIdx].month,
    }
  }, [monthLabel])

  // 6-month projection (linear regression-ish mock) — also must be unconditional
  const projection = React.useMemo(() => {
    if (!category) return []
    type TrendPoint = {
      month: string
      amount: number
      total: number
      share: number
      type?: "actual" | "projected"
    }
    const trend: TrendPoint[] = costTrend.map(e => ({
      month: e.month,
      amount: e[category],
      total: e.total,
      share: e.total > 0 ? (e[category] / e.total) * 100 : 0,
    }))
    const last6 = trend.slice(-6)
    if (last6.length < 2) return trend
    const avgChange = last6.reduce((acc, d, i) => {
      if (i === 0) return acc
      return acc + (d.amount - last6[i - 1].amount)
    }, 0) / (last6.length - 1)
    const last = last6[last6.length - 1].amount
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const actuals: TrendPoint[] = last6.map((d) => ({ ...d, type: "actual" as const }))
    const projected: TrendPoint[] = Array.from({ length: 3 }).map((_, i) => ({
      month: months[i % 6] || `M+${i + 1}`,
      amount: Math.max(0, Math.round(last + avgChange * (i + 1))),
      total: 0,
      share: 0,
      type: "projected" as const,
    }))
    return actuals.concat(projected)
  }, [category])

  // Quarterly comparison — also unconditional
  const quarterlyData = React.useMemo(() => {
    if (!category) return []
    const q = [
      { quarter: "Q1", months: costTrend.slice(0, 3) },
      { quarter: "Q2", months: costTrend.slice(3, 6) },
      { quarter: "Q3", months: costTrend.slice(6, 9) },
      { quarter: "Q4", months: costTrend.slice(9, 12) },
    ]
    return q.map(qtr => ({
      quarter: qtr.quarter,
      amount: qtr.months.reduce((s, m) => s + m[category], 0),
    }))
  }, [category])

  if (!category || !currentEntry) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-[640px] p-0 overflow-y-auto" />
      </Sheet>
    )
  }

  const meta = CATEGORY_META[category]
  const Icon = meta.icon

  const currentAmount = currentEntry[category]
  const prevAmount = prevEntry[category]
  const changePct = prevAmount === 0 ? 0 : ((currentAmount - prevAmount) / prevAmount) * 100
  const isIncrease = changePct > 0

  // 12-month trend for this category
  const trendData = costTrend.map(e => ({
    month: e.month,
    amount: e[category],
    total: e.total,
    share: e.total > 0 ? (e[category] / e.total) * 100 : 0,
  }))

  // Drivers
  const drivers = getCostDrivers(category, currentAmount)
  const totalSaving = drivers.reduce((s, d) => s + d.amount, 0)

  // Recommendations
  const recommendations = getRecommendations(category, currentAmount)
  const totalPotentialSaving = recommendations.reduce((s, r) => s + r.saving, 0)

  const handleExport = () => {
    const data = drivers.map(d => ({
      Driver: d.name,
      "Amount (₹)": d.amount,
      "Share %": d.share,
      "Trend %": d.trend,
      Note: d.note,
    }))
    exportToCSV(data, `cost-${category}-${monthStr}`, ["Driver", "Amount (₹)", "Share %", "Trend %", "Note"])
  }

  const handleApplyRec = (rec: Recommendation) => {
    toast.success(
      "Recommendation Queued",
      `${rec.title} → est. saving ₹${(rec.saving / 1000).toFixed(0)}K/mo. Forwarded to ops review.`
    )
  }

  const handleRefresh = () => {
    toast.info("Refreshing cost data", `Re-fetching ${meta.label.toLowerCase()} figures for ${monthStr}…`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[680px] p-0 overflow-y-auto"
      >
        {/* Header strip with gradient */}
        <div className={cn(
          "sticky top-0 z-20 bg-gradient-to-br backdrop-blur-sm border-b cost-drawer-header",
          meta.bgClass,
          meta.borderClass
        )}>
          <SheetHeader className="space-y-0 p-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "relative flex size-14 items-center justify-center rounded-2xl border-2 shadow-md cost-icon-pulse",
                  meta.bgClass,
                  meta.borderClass
                )}>
                  <Icon className={cn("size-7", meta.textClass)} />
                  <div className={cn(
                    "absolute -top-1.5 -right-1.5 size-5 rounded-full bg-background border-2 flex items-center justify-center",
                    meta.borderClass
                  )}>
                    <div className={cn("size-2 rounded-full", meta.textClass.replace("text-", "bg-"))} />
                  </div>
                </div>
                <div className="space-y-1">
                  <SheetTitle className="text-lg font-semibold leading-tight flex items-center gap-2">
                    {meta.label}
                    <Badge variant="outline" className={cn("text-[10px] font-medium", meta.textClass, meta.borderClass)}>
                      {monthStr} {new Date().getFullYear()}
                    </Badge>
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground">
                    {meta.description}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={handleRefresh}
                  title="Refresh data"
                >
                  <RefreshCw className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={handleExport}
                  title="Export to CSV"
                >
                  <Download className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Hero metric */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 cost-stat-enter" style={{ animationDelay: "0ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Current Month</p>
                <p className="mt-0.5 text-base font-bold text-number">
                  ₹{(currentAmount / 100000).toFixed(2)}L
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 cost-stat-enter" style={{ animationDelay: "60ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">vs Last Month</p>
                <p className={cn(
                  "mt-0.5 text-base font-bold flex items-center gap-0.5 text-number",
                  isIncrease ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                )}>
                  {isIncrease ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                  {Math.abs(changePct).toFixed(1)}%
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 cost-stat-enter" style={{ animationDelay: "120ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">% of Total Cost</p>
                <p className="mt-0.5 text-base font-bold text-number">
                  {((currentAmount / currentEntry.total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 cost-drawer-body-enter">

          {/* 12-month trend */}
          <div className="rounded-lg border border-border/60 bg-card p-4 cost-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="size-3" />
                12-Month Trend
              </h3>
              <Badge variant="outline" className="text-[10px]">
                ₹ {(currentAmount / 100000).toFixed(2)}L latest
              </Badge>
            </div>
            <ChartContainer
              config={{ amount: { label: meta.label, color: meta.hex } }}
              className="h-[180px] w-full"
            >
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id={`costGrad-${category}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={meta.hex} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={meta.hex} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(val) => [`₹${(Number(val) / 100000).toFixed(2)}L`, meta.label]}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke={meta.hex}
                  strokeWidth={2}
                  fill={`url(#costGrad-${category})`}
                  dot={false}
                  activeDot={{ r: 4, fill: meta.hex }}
                  className="cost-trend-draw"
                  style={{ strokeDasharray: 1000, strokeDashoffset: 0 }}
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Projection */}
          <div className="rounded-lg border border-border/60 bg-card p-4 cost-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="size-3" />
                3-Month Projection
              </h3>
              <Badge variant="outline" className="text-[10px] gap-1">
                <Sparkles className="size-2.5" />
                Linear forecast
              </Badge>
            </div>
            <ChartContainer
              config={{
                actual: { label: "Actual", color: meta.hex },
                projected: { label: "Projected", color: "#94A3B8" },
              }}
              className="h-[150px] w-full"
            >
              <LineChart data={projection}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(val) => [`₹${(Number(val) / 100000).toFixed(2)}L`, "Amount"]}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={meta.hex}
                  strokeWidth={2}
                  dot={(props: { payload?: { type?: string }; cx?: number; cy?: number }) => {
                    const { payload, cx, cy } = props
                    if (!payload || !cx || !cy) return <></>
                    return payload.type === "projected"
                      ? <circle cx={cx} cy={cy} r={3} fill="#94A3B8" stroke="#FFF" strokeWidth={1} />
                      : <circle cx={cx} cy={cy} r={2} fill={meta.hex} />
                  }}
                  // Render two segments: solid for actual, dashed for projected.
                  // Recharts <Line> doesn't support per-segment strokeDasharray as a function,
                  // so we use a single solid line — the projected portion is visually distinguished
                  // by the gray dot markers (set above).
                />
              </LineChart>
            </ChartContainer>
            <p className="mt-1.5 text-[10px] text-muted-foreground italic">
              Projected values assume current trend continues. Adjust quarterly based on actuals.
            </p>
          </div>

          {/* Cost drivers breakdown */}
          <div className="rounded-lg border border-border/60 bg-card p-4 cost-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calculator className="size-3" />
                Cost Drivers Breakdown
              </h3>
              <span className="text-[10px] text-muted-foreground">
                Total: ₹{(totalSaving / 100000).toFixed(2)}L
              </span>
            </div>
            <div className="space-y-2.5">
              {drivers.map((d, i) => (
                <div
                  key={d.name}
                  className="cost-driver-row group"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold",
                        meta.bgClass,
                        meta.textClass
                      )}>
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{d.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{d.note}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-number">
                        ₹{(d.amount / 1000).toFixed(0)}K
                      </span>
                      <span className={cn(
                        "text-[10px] flex items-center gap-0.5 w-12 justify-end",
                        d.trend > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                      )}>
                        {d.trend > 0 ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
                        {Math.abs(d.trend)}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-8 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full cost-fill-animate", meta.textClass.replace("text-", "bg-"))}
                        style={{ width: `${d.share}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{d.share}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quarterly comparison */}
          <div className="rounded-lg border border-border/60 bg-card p-4 cost-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BarChart3Icon className="size-3" />
                Quarterly Comparison
              </h3>
              <span className="text-[10px] text-muted-foreground">FY {new Date().getFullYear()}</span>
            </div>
            <ChartContainer
              config={{ amount: { label: meta.label, color: meta.hex } }}
              className="h-[140px] w-full"
            >
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="quarter" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(val) => [`₹${(Number(val) / 100000).toFixed(2)}L`, meta.label]}
                    />
                  }
                />
                <Bar dataKey="amount" fill={meta.hex} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Savings recommendations */}
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 cost-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <PiggyBank className="size-3" />
                Savings Recommendations
              </h3>
              <Badge className="bg-emerald-600 text-white text-[10px] gap-1">
                <Target className="size-2.5" />
                ₹{(totalPotentialSaving / 1000).toFixed(0)}K/mo potential
              </Badge>
            </div>
            <div className="space-y-2">
              {recommendations.map((rec, i) => (
                <div
                  key={rec.title}
                  className="rounded-md border border-emerald-200/60 dark:border-emerald-800/60 bg-background p-2.5 cost-rec-enter"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-[10px] font-bold">
                        #{i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-tight">{rec.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{rec.impact}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 text-number">
                        ₹{(rec.saving / 1000).toFixed(0)}K
                      </p>
                      <p className="text-[9px] text-muted-foreground">per month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 ml-8">
                      <Badge variant={EFFORT_STYLES[rec.effort].variant} className={cn("text-[9px] h-4 px-1.5", EFFORT_STYLES[rec.effort].className)}>
                        {rec.effort} effort
                      </Badge>
                      <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                        {CATEGORY_LABELS[rec.category]}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] gap-1 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                      onClick={() => handleApplyRec(rec)}
                    >
                      <Zap className="size-2.5" />
                      Apply
                      <ChevronRight className="size-2.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert if cost increased */}
          {isIncrease && changePct > 5 && (
            <div className="rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-3 cost-alert-enter">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Cost increase above 5% threshold
                  </p>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">
                    {meta.label} rose {changePct.toFixed(1)}% vs last month (₹{((currentAmount - prevAmount) / 1000).toFixed(0)}K increase).
                    Consider reviewing the top driver and applying the highest-impact recommendation above.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 pb-1 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground">
              Category: <span className="font-mono">{category}</span> · Month: <span className="font-mono">{monthStr}</span> · Last sync: just now
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] gap-1"
              onClick={() => toast.info("Drill-down", "Opening detailed ledger view…")}
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

// Small helper to avoid importing BarChart3 from recharts (lucide already exports BarChart3)
function BarChart3Icon({ className }: { className?: string }) {
  return <Activity className={className} />
}
