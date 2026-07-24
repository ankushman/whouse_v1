"use client"

import * as React from "react"
import {
  Warehouse,
  Truck,
  ClipboardCheck,
  Target,
  Zap,
  Clock,
  Cpu,
  IndianRupee,
  BarChart3,
  TrendingUp,
  Package,
  PackageSearch,
  Activity,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import {
  AreaChart,
  BarChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { kpiMetrics, inboundTrend, outboundTrend, warehousePerformance, dispatchPerformance, costTrend, dailyThroughput, slaData, inventoryAccuracyTrend, manpowerProductivity } from "@/data/mock-data"
import { KPICard } from "@/components/shared/kpi-card"
import { PageHeader } from "@/components/shared/page-header"
import { LiveUpdatesFeed } from "@/components/shared/live-updates-feed"
import { cn } from "@/lib/utils"

// ──────────────────────────────────────────────────────
// Chart card accent colors
// ──────────────────────────────────────────────────────
type ChartAccent = "blue" | "green" | "amber" | "purple" | "red"

const chartAccentBorder: Record<ChartAccent, string> = {
  blue: "border-t-blue-500",
  green: "border-t-emerald-500",
  amber: "border-t-amber-500",
  purple: "border-t-purple-500",
  red: "border-t-red-500",
}

const kpiIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  totalWarehouses: Warehouse,
  activeShipments: Truck,
  pendingGRN: ClipboardCheck,
  inventoryAccuracy: Target,
  todaysDispatches: Zap,
  dockToStockTime: Clock,
  slaAchievement: TrendingUp,
  equipmentUtilization: Cpu,
  costPerShipment: IndianRupee,
  warehouseOccupancy: BarChart3,
  productivity: TrendingUp,
}

const kpiColors: Record<string, string> = {
  totalWarehouses: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  activeShipments: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  pendingGRN: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  inventoryAccuracy: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  todaysDispatches: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  dockToStockTime: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  slaAchievement: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  equipmentUtilization: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  costPerShipment: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  warehouseOccupancy: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  productivity: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
}

const DATE_RANGES = [
  { label: "Today", value: "today" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "12M", value: "12m" },
] as const

type DateRangeValue = (typeof DATE_RANGES)[number]["value"]

const inboundChartConfig = {
  domestic: { label: "Domestic", color: "#2563EB" },
  imported: { label: "Imported", color: "#10B981" },
}

const dispatchChartConfig = {
  dispatched: { label: "Dispatched", color: "#2563EB" },
  onTime: { label: "On Time", color: "#10B981" },
  delayed: { label: "Delayed", color: "#F59E0B" },
}

const warehouseChartConfig = {
  inbound: { label: "Inbound", color: "#2563EB" },
  outbound: { label: "Outbound", color: "#10B981" },
  accuracy: { label: "Accuracy %", color: "#F59E0B" },
  sla: { label: "SLA %", color: "#8B5CF6" },
}

const accuracyChartConfig = {
  accuracy: { label: "Accuracy %", color: "#2563EB" },
}

const throughputChartConfig = {
  inbound: { label: "Inbound", color: "#2563EB" },
  outbound: { label: "Outbound", color: "#10B981" },
}

const costChartConfig = {
  labor: { label: "Labor", color: "#2563EB" },
  transport: { label: "Transport", color: "#10B981" },
  equipment: { label: "Equipment", color: "#F59E0B" },
  storage: { label: "Storage", color: "#8B5CF6" },
}

const slaChartConfig = {
  target: { label: "Target %", color: "#E2E8F0" },
  achieved: { label: "Achieved %", color: "#2563EB" },
  breach: { label: "Breach %", color: "#EF4444" },
}

const manpowerChartConfig = {
  morning: { label: "Morning", color: "#2563EB" },
  afternoon: { label: "Afternoon", color: "#10B981" },
  night: { label: "Night", color: "#F59E0B" },
}

export function DashboardView() {
  const [lastUpdated] = React.useState(() =>
    new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  )
  const [selectedRange, setSelectedRange] = React.useState<DateRangeValue>("7d")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Executive Dashboard"
          description="Real-time overview of all warehouse operations across India"
        />
        <div className="flex items-center gap-3 shrink-0">
          {/* Date Range Picker */}
          <div className="flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5">
            <Calendar className="ml-1.5 h-3 w-3 text-muted-foreground" />
            {DATE_RANGES.map((range) => (
              <Button
                key={range.value}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 rounded-md px-2 text-[11px] font-medium transition-colors",
                  selectedRange === range.value
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setSelectedRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Live Indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-3 w-3 text-emerald-500" />
            <span>Live</span>
            <span>•</span>
            <span>Updated {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 stagger-children">
        {[
          { label: "New Inbound", icon: PackageSearch, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400", count: "12" },
          { label: "Pending Dispatch", icon: Truck, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400", count: "8" },
          { label: "Critical Alerts", icon: Activity, color: "text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400", count: "3" },
          { label: "Reports Due", icon: BarChart3, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400", count: "2" },
        ].map((action) => {
          const ActionIcon = action.icon
          return (
            <Button
              key={action.label}
              variant="outline"
              className={cn("h-auto flex-col gap-1.5 rounded-xl border border-border/60 py-3 transition-all hover:shadow-sm hover:border-border", action.color)}
            >
              <ActionIcon className="h-4 w-4" />
              <span className="text-lg font-bold">{action.count}</span>
              <span className="text-[10px] font-medium opacity-70">{action.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Recent Activity Feed */}
      <LiveUpdatesFeed maxItems={6} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:gap-4 stagger-children">
        {kpiMetrics.map((kpi, index) => {
          const Icon = kpiIcons[kpi.key]
          if (!Icon) return null
          const displayValue = kpi.unit === "₹"
            ? `₹${kpi.value.toLocaleString("en-IN")}`
            : kpi.unit
              ? `${kpi.value}${kpi.unit}`
              : kpi.value.toLocaleString()
          return (
            <KPICard
              key={kpi.key}
              title={kpi.label}
              value={displayValue}
              change={kpi.trendValue}
              trend={kpi.trend}
              icon={Icon}
              index={index}
              colorClass={kpiColors[kpi.key]}
            />
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        <Card className={cn("rounded-xl border border-t-2 border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md", chartAccentBorder.blue)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Inbound vs Outbound Trend</CardTitle>
            <CardDescription className="text-xs">Monthly shipment volume comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={inboundChartConfig} className="h-[280px] w-full">
              <BarChart data={inboundTrend} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="domestic" fill="var(--color-domestic)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="imported" fill="var(--color-imported)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className={cn("rounded-xl border border-t-2 border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md", chartAccentBorder.green)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Dispatch Performance</CardTitle>
            <CardDescription className="text-xs">Last 7 days on-time vs delayed deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={dispatchChartConfig} className="h-[280px] w-full">
              <BarChart data={dispatchPerformance} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="onTime" stackId="a" fill="var(--color-onTime)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="delayed" stackId="a" fill="var(--color-delayed)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        <Card className={cn("rounded-xl border border-t-2 border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md", chartAccentBorder.blue)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Warehouse Performance</CardTitle>
            <CardDescription className="text-xs">Cross-warehouse metrics comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={warehouseChartConfig} className="h-[280px] w-full">
              <BarChart data={warehousePerformance} barGap={1} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="inbound" fill="var(--color-inbound)" radius={[0, 3, 3, 0]} />
                <Bar dataKey="outbound" fill="var(--color-outbound)" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className={cn("rounded-xl border border-t-2 border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md", chartAccentBorder.blue)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Inventory Accuracy Trend</CardTitle>
            <CardDescription className="text-xs">6-month accuracy tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={accuracyChartConfig} className="h-[280px] w-full">
              <AreaChart data={inventoryAccuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[94, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="accuracy" stroke="var(--color-accuracy)" fill="url(#accuracyGrad)" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        <Card className={cn("rounded-xl border border-t-2 border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md", chartAccentBorder.blue)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Daily Throughput</CardTitle>
            <CardDescription className="text-xs">Last 30 days inbound and outbound volumes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={throughputChartConfig} className="h-[280px] w-full">
              <AreaChart data={dailyThroughput.slice(-30)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="inbound" stroke="var(--color-inbound)" fill="url(#inboundGrad)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="outbound" stroke="var(--color-outbound)" fill="url(#outboundGrad)" strokeWidth={1.5} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className={cn("rounded-xl border border-t-2 border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md", chartAccentBorder.amber)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cost Trend Analysis</CardTitle>
            <CardDescription className="text-xs">Monthly cost breakdown (₹ Lakhs)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={costChartConfig} className="h-[280px] w-full">
              <AreaChart data={costTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="labor" stackId="cost" stroke="var(--color-labor)" fill="var(--color-labor)" fillOpacity={0.7} />
                <Area type="monotone" dataKey="transport" stackId="cost" stroke="var(--color-transport)" fill="var(--color-transport)" fillOpacity={0.7} />
                <Area type="monotone" dataKey="equipment" stackId="cost" stroke="var(--color-equipment)" fill="var(--color-equipment)" fillOpacity={0.7} />
                <Area type="monotone" dataKey="storage" stackId="cost" stroke="var(--color-storage)" fill="var(--color-storage)" fillOpacity={0.7} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        <Card className={cn("rounded-xl border border-t-2 border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md", chartAccentBorder.red)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">SLA Achievement by Warehouse</CardTitle>
            <CardDescription className="text-xs">Target vs achieved vs breach percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={slaChartConfig} className="h-[280px] w-full">
              <BarChart data={slaData} barGap={1} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="breach" stackId="sla" fill="var(--color-breach)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="achieved" stackId="sla" fill="var(--color-achieved)" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className={cn("rounded-xl border border-t-2 border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md", chartAccentBorder.purple)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Manpower Productivity by Shift</CardTitle>
            <CardDescription className="text-xs">Weekly shift-wise productivity comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={manpowerChartConfig} className="h-[280px] w-full">
              <BarChart data={manpowerProductivity} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="morning" fill="var(--color-morning)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="afternoon" fill="var(--color-afternoon)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="night" fill="var(--color-night)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
