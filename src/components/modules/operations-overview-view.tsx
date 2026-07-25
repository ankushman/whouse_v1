"use client"

import { useMemo, useState } from "react"
import {
  warehouses,
  kpiData,
  inboundShipments,
  outboundShipments,
  alerts,
  employees,
  equipmentData,
  costTrend,
} from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { KPICard } from "@/components/shared/kpi-card"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
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
  AreaChart,
  Area,
} from "recharts"
import {
  Warehouse,
  Truck,
  PackageSearch,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  BarChart3,
  Users,
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Timer,
  ShieldCheck,
  Layers,
  Package,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Chart Configs ──────────────────────────────────────────────────────────

const throughputChartConfig = {
  inbound: { label: "Inbound", color: "#2563EB" },
  outbound: { label: "Outbound", color: "#10B981" },
}

const pieChartConfig = {
  green: { label: "Healthy", color: "#10B981" },
  amber: { label: "Warning", color: "#F59E0B" },
  red: { label: "Critical", color: "#EF4444" },
}

const PIE_COLORS = ["#10B981", "#F59E0B", "#EF4444"]

const costLineConfig = {
  total: { label: "Total Cost", color: "#2563EB" },
}

// ── Component ──────────────────────────────────────────────────────────────

export function OperationsOverviewView() {
  const [timeRange, setTimeRange] = useState("today")

  // ── Derived KPIs ──
  const executiveKPIs = useMemo(() => {
    const criticalAlerts = alerts.filter((a) => a.severity === "critical" && !a.acknowledged)
    const activeShipments = outboundShipments.filter((s) => s.status === "in-transit")
    const pendingGRN = inboundShipments.filter((s) => s.status === "pending")
    const totalCapacity = warehouses.reduce((s, w) => s + w.capacity, 0)
    const totalUsed = warehouses.reduce((s, w) => s + w.capacityUsed, 0)
    const occupancy = Math.round((totalUsed / totalCapacity) * 100)
    const avgHealth = Math.round(warehouses.reduce((s, w) => s + w.healthScore, 0) / warehouses.length)
    const activeForklifts = equipmentData.filter((e) => e.status === "active" && e.type === "Forklift").length
    const totalForklifts = equipmentData.filter((e) => e.type === "Forklift").length
    const utilization = totalForklifts > 0 ? Math.round((activeForklifts / totalForklifts) * 100) : 0

    return [
      {
        title: "Total Warehouses",
        value: String(warehouses.length),
        change: `${warehouses.filter((w) => w.status === "green").length} healthy`,
        trend: "up" as const,
        icon: Warehouse,
        color: "blue",
      },
      {
        title: "Active Shipments",
        value: String(activeShipments.length),
        change: `${outboundShipments.filter((s) => s.status === "delayed").length} delayed`,
        trend: activeShipments.length > 5 ? "up" : "down" as const,
        icon: Truck,
        color: "emerald",
      },
      {
        title: "Pending GRN",
        value: String(pendingGRN.length),
        change: "Requires attention",
        trend: "down" as const,
        icon: PackageSearch,
        color: "amber",
      },
      {
        title: "Critical Alerts",
        value: String(criticalAlerts.length),
        change: criticalAlerts.length > 0 ? "Needs action" : "All clear",
        trend: criticalAlerts.length > 2 ? "down" as const : "up" as const,
        icon: AlertTriangle,
        color: "red",
      },
      {
        title: "Avg Occupancy",
        value: `${occupancy}%`,
        change: occupancy > 85 ? "High utilization" : "Normal",
        trend: occupancy > 85 ? "up" as const : "down" as const,
        icon: Layers,
        color: "blue",
      },
      {
        title: "Avg Health Score",
        value: `${avgHealth}%`,
        change: avgHealth >= 80 ? "Good" : "Needs improvement",
        trend: avgHealth >= 80 ? "up" as const : "down" as const,
        icon: ShieldCheck,
        color: "emerald",
      },
      {
        title: "Equipment Util.",
        value: `${utilization}%`,
        change: `${activeForklifts}/${totalForklifts} forklifts active`,
        trend: utilization >= 70 ? "up" as const : "down" as const,
        icon: Wrench,
        color: "amber",
      },
      {
        title: "SLA Achievement",
        value: `${kpiData.slaAchievement}%`,
        change: kpiData.slaAchievement >= 95 ? "On target" : "Below target",
        trend: kpiData.slaAchievement >= 95 ? "up" as const : "down" as const,
        icon: Timer,
        color: "blue",
      },
    ]
  }, [])

  // ── Warehouse Health Distribution ──
  const healthDistribution = useMemo(() => {
    const green = warehouses.filter((w) => w.status === "green").length
    const amber = warehouses.filter((w) => w.status === "amber").length
    const red = warehouses.filter((w) => w.status === "red").length
    return [
      { name: "Healthy", value: green, color: PIE_COLORS[0] },
      { name: "Warning", value: amber, color: PIE_COLORS[1] },
      { name: "Critical", value: red, color: PIE_COLORS[2] },
    ]
  }, [])

  // ── Throughput Data ──
  const throughputData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days.map((day) => ({
      day,
      inbound: Math.floor(Math.random() * 40 + 60),
      outbound: Math.floor(Math.random() * 35 + 55),
    }))
  }, [])

  // ── Cost Trend ──
  const costAreaData = useMemo(() =>
    costTrend.slice(-6).map((entry) => ({
      month: entry.month,
      total: entry.total,
    })), [])

  // ── Top Issues ──
  const topIssues = useMemo(() =>
    alerts
      .filter((a) => a.severity === "critical" || a.severity === "warning")
      .slice(0, 6), [])

  // ── Active Shipments Table ──
  const activeShipmentsData = useMemo(() =>
    outboundShipments
      .filter((s) => s.status === "in-transit" || s.status === "delayed")
      .slice(0, 8), [])

  // ── Warehouse Quick Status ──
  const warehouseStatus = useMemo(() =>
    warehouses.map((w) => ({
      name: w.city,
      capacity: Math.round((w.capacityUsed / w.capacity) * 100),
      health: w.healthScore,
      alerts: w.alerts,
      status: w.status,
    })), [])

  // ── CSV Export ──
  const handleExportCSV = useMemo(() => () => {
    const data = warehouseStatus.map((w) => ({
      Warehouse: w.name,
      Occupancy: `${w.capacity}%`,
      "Health Score": `${w.health}%`,
      Alerts: w.alerts,
      Status: w.status,
    }))
    exportToCSV(data, "operations-overview", ["Warehouse", "Occupancy", "Health Score", "Alerts", "Status"])
  }, [warehouseStatus])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Overview"
        description="Executive summary of all warehouse operations in real-time"
        actions={
          <div className="flex items-center gap-2">
            <Tabs value={timeRange} onValueChange={setTimeRange} className="hidden sm:block">
              <TabsList className="h-8">
                <TabsTrigger value="today" className="text-xs px-3">Today</TabsTrigger>
                <TabsTrigger value="7d" className="text-xs px-3">7D</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs px-3">30D</TabsTrigger>
              </TabsList>
            </Tabs>
            <ExportButton onExportCSV={handleExportCSV} />
          </div>
        }
      />

      {/* ── Executive KPI Cards ── */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 xl:grid-cols-4 stagger-children">
        {executiveKPIs.map((kpi) => (
          <Card key={kpi.title} className="card-depth hover-scale-sm rounded-xl border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{kpi.title}</p>
                  <p className="text-xl font-bold text-number">{kpi.value}</p>
                </div>
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  kpi.color === "blue" && "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
                  kpi.color === "emerald" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
                  kpi.color === "amber" && "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
                  kpi.color === "red" && "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
                )}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span>{kpi.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Main Dashboard Grid ── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Throughput Chart */}
        <Card className="card-accent-blue card-shine rounded-xl border-border/60 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Weekly Throughput
            </CardTitle>
            <CardDescription className="text-xs">Inbound vs Outbound volume (shipments/day)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={throughputChartConfig} className="h-[280px] w-full">
              <BarChart data={throughputData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="inbound" fill="var(--color-inbound)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="outbound" fill="var(--color-outbound)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Health Distribution */}
          <Card className="card-shine rounded-xl border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                Warehouse Health
              </CardTitle>
              <CardDescription className="text-xs">Distribution by status</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={pieChartConfig} className="h-[160px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie data={healthDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={2}>
                    {healthDistribution.map((entry, idx) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Issues */}
          <Card className="card-depth rounded-xl border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Top Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topIssues.map((issue) => (
                <div key={issue.id} className={cn(
                  "flex items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-colors hover:bg-muted/40",
                  issue.severity === "critical" ? "border-red-200 dark:border-red-900/50" : "border-amber-200 dark:border-amber-900/50",
                )}>
                  <div className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded",
                    issue.severity === "critical" ? "bg-red-100 dark:bg-red-950/50" : "bg-amber-100 dark:bg-amber-950/50",
                  )}>
                    {issue.severity === "critical"
                      ? <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                      : <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{issue.title}</p>
                    <p className="text-[10px] text-muted-foreground">{issue.warehouse}</p>
                  </div>
                  <Badge className={cn(
                    "text-[9px] rounded-full px-1.5 py-0 shrink-0",
                    issue.severity === "critical"
                      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                  )}>
                    {issue.severity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Second Row: Cost Trend + Active Shipments ── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Cost Trend */}
        <Card className="card-accent-amber card-shine rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Cost Trend
            </CardTitle>
            <CardDescription className="text-xs">Last 6 months total cost</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={costLineConfig} className="h-[220px] w-full">
              <AreaChart data={costAreaData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="total" stroke="#2563EB" fill="url(#costGrad)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Active Shipments Table */}
        <Card className="card-depth rounded-xl border-border/60 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              Active Shipments
            </CardTitle>
            <CardDescription className="text-xs">Currently in-transit and delayed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mobile-scroll-hint -mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-x-visible md:px-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">Destination</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">Customer</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">ETA</TableHead>
                    <TableHead className="text-xs text-right">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeShipmentsData.map((shipment) => (
                    <TableRow key={shipment.id} className="table-row-hover">
                      <TableCell className="text-xs font-mono">{shipment.id}</TableCell>
                      <TableCell className="text-xs font-medium">{shipment.destination}</TableCell>
                      <TableCell className="text-xs hidden sm:table-cell text-muted-foreground">{shipment.customer}</TableCell>
                      <TableCell>
                        <StatusBadge
                          variant={shipment.status === "delayed" ? "red" : shipment.status === "in-transit" ? "blue" : "green"}
                          label={shipment.status}
                        />
                      </TableCell>
                      <TableCell className="text-xs text-right text-number">{shipment.eta}</TableCell>
                      <TableCell className="text-xs text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={shipment.progress || 0} className="h-1.5 w-16" />
                          <span className="text-number tabular-nums">{shipment.progress || 0}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Warehouse Grid Status ── */}
      <Card className="card-depth rounded-xl border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            Warehouse Network Status
          </CardTitle>
          <CardDescription className="text-xs">Occupancy, health, and alert count per warehouse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mobile-scroll-hint -mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-x-visible md:px-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Warehouse</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Occupancy</TableHead>
                  <TableHead className="text-xs">Health</TableHead>
                  <TableHead className="text-xs text-right">Alerts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouseStatus.map((wh) => (
                  <TableRow key={wh.name} className="table-row-hover">
                    <TableCell className="text-xs font-medium">{wh.name}</TableCell>
                    <TableCell>
                      <StatusBadge
                        variant={wh.status === "green" ? "green" : wh.status === "amber" ? "amber" : "red"}
                        label={wh.status === "green" ? "Healthy" : wh.status === "amber" ? "Warning" : "Critical"}
                      />
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <Progress value={wh.capacity} className={cn(
                          "h-2 w-16",
                          wh.capacity > 90 ? "[&>div]:bg-red-500" : wh.capacity > 75 ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500",
                        )} />
                        <span className="text-number tabular-nums">{wh.capacity}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className={cn(
                        "font-medium tabular-nums",
                        wh.health >= 85 ? "text-emerald-600" : wh.health >= 70 ? "text-amber-600" : "text-red-600",
                      )}>
                        {wh.health}%
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-right">
                      <span className={cn(
                        "font-medium tabular-nums",
                        wh.alerts > 5 ? "text-red-600" : wh.alerts > 2 ? "text-amber-600" : "text-muted-foreground",
                      )}>
                        {wh.alerts}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
