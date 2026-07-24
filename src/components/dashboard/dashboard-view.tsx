"use client"

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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import {
  AreaChart,
  BarChart,
  Bar,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { kpiMetrics, inboundTrend, outboundTrend, warehousePerformance, dispatchPerformance, costTrend, dailyThroughput, slaData, inventoryAccuracyTrend, manpowerProductivity } from "@/data/mock-data"
import { KPICard } from "@/components/shared/kpi-card"
import { PageHeader } from "@/components/shared/page-header"

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

const SLA_COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

export function DashboardView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description="Real-time overview of all warehouse operations across India"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:gap-4">
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
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-xl border-border/60 shadow-sm">
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

        <Card className="rounded-xl border-border/60 shadow-sm">
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
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-xl border-border/60 shadow-sm">
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

        <Card className="rounded-xl border-border/60 shadow-sm">
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
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-xl border-border/60 shadow-sm">
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

        <Card className="rounded-xl border-border/60 shadow-sm">
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
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-xl border-border/60 shadow-sm">
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

        <Card className="rounded-xl border-border/60 shadow-sm">
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
