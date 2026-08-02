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
  AlertTriangle,
  Wrench,
  Gauge,
  BoxesIcon,
  Anchor,
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
import { kpiMetrics, inboundTrend, warehousePerformance, dispatchPerformance, costTrend, dailyThroughput, slaData, inventoryAccuracyTrend, manpowerProductivity } from "@/data/mock-data"
import { KPICard } from "@/components/shared/kpi-card"
import { LiveUpdatesFeed } from "@/components/shared/live-updates-feed"
import { SLAMonitoringPanel } from "@/components/shared/sla-monitoring-panel"
import { WarehouseCapacityHeatmap } from "@/components/shared/warehouse-capacity-heatmap"
import { MetricsTicker } from "@/components/shared/metrics-ticker"
import { ActivityTimeline } from "@/components/shared/activity-timeline"
import { AIInsightsPanel } from "@/components/shared/ai-insights-panel"
import { ShiftHandoverPanel } from "@/components/shared/shift-handover-panel"
import { WarehouseKPIComparison } from "@/components/shared/warehouse-kpi-comparison"
import { generateSparklineData } from "@/components/shared/mini-sparkline"
import { ShipmentTrackingTable } from "@/components/shared/shipment-tracking-table"
import { WarehouseHealthMonitor } from "@/components/shared/warehouse-health-monitor"
import { WeatherPanel } from "@/components/shared/weather-panel"
import { PullToRefreshContainer } from "@/components/shared/pull-to-refresh-container"
import { AirCargoPanel } from "@/components/shared/air-cargo-panel"
import { HazardousMaterialPanel } from "@/components/shared/hazardous-material-panel"
import { FleetVehicleTrackerPanel } from "@/components/shared/fleet-vehicle-tracker-panel"
import { SlabRackingUtilizationPanel } from "@/components/shared/slab-racking-utilization-panel"
import { DockSchedulingPanel } from "@/components/shared/dock-scheduling-panel"
import { CrossdockTransferPanel } from "@/components/shared/crossdock-transfer-panel"
import { ReturnsProcessingPanel } from "@/components/shared/returns-processing-panel"
import { QualityInspectionPanel } from "@/components/shared/quality-inspection-panel"
import { LaborProductivityTrackerPanel } from "@/components/shared/labor-productivity-tracker-panel"
import { ColdChainMonitoringPanel } from "@/components/shared/cold-chain-monitoring-panel"
import { ThreePLVendorScorecardPanel } from "@/components/shared/three-pl-vendor-scorecard-panel"
import { SlottingOptimizerPanel } from "@/components/shared/slotting-optimizer-panel"
import { DemandSensingAnalyticsPanel } from "@/components/shared/demand-sensing-analytics-panel"
import { WarehouseSimulationPanel } from "@/components/shared/warehouse-simulation-panel"
import { InventoryReplenishmentPanel } from "@/components/shared/inventory-replenishment-panel"
import { FreightRateOptimizerPanel } from "@/components/shared/freight-rate-optimizer-panel"
import { AutomatedPutawayPanel } from "@/components/shared/automated-putaway-panel"
import { PickPathOptimizerPanel } from "@/components/shared/pick-path-optimizer-panel"
import { ContainerUnloadingPanel } from "@/components/shared/container-unloading-panel"
import { CargoInsurancePanel } from "@/components/shared/cargo-insurance-panel"
import { RailConsignmentPanel } from "@/components/shared/rail-consignment-panel"
import { GateManagementPanel } from "@/components/shared/gate-management-panel"
import { ValueAddedServicesPanel } from "@/components/shared/value-added-services-panel"
import { LastMileDeliveryPanel } from "@/components/shared/last-mile-delivery-panel"
import { WarehouseEnergyAnalyticsPanel } from "@/components/shared/warehouse-energy-analytics-panel"
import { SafetyCompliancePanel } from "@/components/shared/safety-compliance-panel"
import { CarrierSLAScorecardPanel } from "@/components/shared/carrier-sla-scorecard-panel"
import { ReverseLogisticsHubPanel } from "@/components/shared/reverse-logistics-hub-panel"
import { IoTSensorDashboardPanel } from "@/components/shared/iot-sensor-dashboard-panel"
import { MultiModalTransportPlannerPanel } from "@/components/shared/multi-modal-transport-planner-panel"
import { WarehouseNetworkOptimizationPanel } from "@/components/shared/warehouse-network-optimization-panel"
import { CrossBorderTradePanel } from "@/components/shared/cross-border-trade-panel"
import { DemandForecastingPanel } from "@/components/shared/demand-forecasting-panel"
import { WarehouseSlottingOptimizerPanel } from "@/components/shared/warehouse-slotting-optimizer-panel"
import { ThreePLContractManagementPanel } from "@/components/shared/three-pl-contract-management-panel"
import { LaborManagementPanel } from "@/components/shared/labor-management-panel"
import { FleetTelematicsPanel } from "@/components/shared/fleet-telematics-panel"
import { WarehouseAutomationPanel } from "@/components/shared/warehouse-automation-panel"
import { ReturnsAnalyticsHubPanel } from "@/components/shared/returns-analytics-hub-panel"
import { OrderWaveManagementPanel } from "@/components/shared/order-wave-management-panel"
import { CarbonFootprintTrackerPanel } from "@/components/shared/carbon-footprint-tracker-panel"
import { SmartDockSchedulerPanel } from "@/components/shared/smart-dock-scheduler-panel"
import { ColdChainAnalyticsPanel } from "@/components/shared/cold-chain-analytics-panel"
import { WarehouseDigitalTwinPanel } from "@/components/shared/warehouse-digital-twin-panel"
import { WarehouseSafetyMonitoringPanel } from "@/components/shared/warehouse-safety-monitoring-panel"
import { PackagingOptimizationPanel } from "@/components/shared/packaging-optimization-panel"
import { ContainerTrackingAnalyticsPanel } from "@/components/shared/container-tracking-analytics-panel"
import { LastMileOptimizationPanel } from "@/components/shared/last-mile-optimization-panel"
import { LogisticsCostIntelligencePanel } from "@/components/shared/logistics-cost-intelligence-panel"
import { WarehouseEnergyManagementPanel } from "@/components/shared/warehouse-energy-management-panel"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/app-store"
import { useRealtimeKpi } from "@/hooks/use-realtime-kpi"

import { type LucideIcon } from "lucide-react"

const kpiIcons: Record<string, LucideIcon> = {
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

// Bug D1 fix: removed "dispatched" key — there is no <Bar dataKey="dispatched"> rendered in the chart,
// so the legend was showing a phantom "Dispatched" entry with no corresponding bar.
const dispatchChartConfig = {
  onTime: { label: "On Time", color: "#10B981" },
  delayed: { label: "Delayed", color: "#F59E0B" },
}

// Bug D2 fix: removed "accuracy" and "sla" keys — only Inbound/Outbound Bars are rendered.
// The legend was showing 4 items but only 2 bars existed.
const warehouseChartConfig = {
  inbound: { label: "Inbound", color: "#2563EB" },
  outbound: { label: "Outbound", color: "#10B981" },
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

// Bug D3 fix: removed "target" key — no <Bar dataKey="target"> is rendered in the SLA chart.
// The legend was showing a phantom "Target %" entry with no corresponding bar.
const slaChartConfig = {
  achieved: { label: "Achieved %", color: "#2563EB" },
  breach: { label: "Breach %", color: "#EF4444" },
}

const manpowerChartConfig = {
  morning: { label: "Morning", color: "#2563EB" },
  afternoon: { label: "Afternoon", color: "#10B981" },
  night: { label: "Night", color: "#F59E0B" },
}

function getDateRange(range: DateRangeValue) {
  const now = new Date()
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let from: Date
  let label: string
  switch (range) {
    case "today":
      label = "Today"
      from = new Date(to)
      break
    case "7d":
      label = "Last 7 Days"
      from = new Date(to)
      from.setDate(from.getDate() - 6)
      break
    case "30d":
      label = "Last 30 Days"
      from = new Date(to)
      from.setDate(from.getDate() - 29)
      break
    case "90d":
      label = "Last 90 Days"
      from = new Date(to)
      from.setDate(from.getDate() - 89)
      break
    case "12m":
      label = "Last 12 Months"
      from = new Date(to)
      from.setFullYear(from.getFullYear() - 1)
      break
  }
  return { label, from: from!, to }
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
}

const quickStats = [
  { label: "Pending GRN", value: 24, icon: Package, colorClass: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/70 dark:text-blue-300" },
  { label: "Delayed", value: 8, icon: Truck, colorClass: "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950/70 dark:text-red-300" },
  { label: "SLA Breaches", value: 3, icon: AlertTriangle, colorClass: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/70 dark:text-amber-300" },
  { label: "Maintenance", value: 2, icon: Wrench, colorClass: "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800/60 dark:bg-zinc-950/70 dark:text-zinc-300" },
] as const

// Pre-generated sparkline data for KPI cards (stable across renders)
const kpiSparklineData: Record<string, number[]> = {
  totalWarehouses: [6, 6, 6, 6, 6, 6, 6],
  activeShipments: generateSparklineData(847, 12, 0.08),
  pendingGRN: generateSparklineData(63, 12, 0.12),
  inventoryAccuracy: generateSparklineData(97.8, 12, 0.02),
  todaysDispatches: generateSparklineData(193, 12, 0.1),
  dockToStockTime: generateSparklineData(3.2, 12, 0.1),
  slaAchievement: generateSparklineData(94.6, 12, 0.03),
  equipmentUtilization: generateSparklineData(82.4, 12, 0.05),
  costPerShipment: generateSparklineData(3245, 12, 0.06),
  warehouseOccupancy: generateSparklineData(79.7, 12, 0.04),
  productivity: generateSparklineData(86.3, 12, 0.04),
}

export function DashboardView() {
  const { kpi: realtimeKpi } = useRealtimeKpi()
  const [lastUpdated] = React.useState(() =>
    new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  )
  const [selectedRange, setSelectedRange] = React.useState<DateRangeValue>("7d")
  const dateInfo = getDateRange(selectedRange)

  // Pull-to-refresh handler — simulates a "refresh" by toggling a local state.
  // We don't actually refetch (mock data); the brief animation is the visual feedback.
  const [refreshNonce, setRefreshNonce] = React.useState(0)
  const handlePullRefresh = React.useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800))
    setRefreshNonce((n) => n + 1)
  }, [])
  // Reference refreshNonce to silence unused warning; the spinner state is enough.
  void refreshNonce

  return (
    <PullToRefreshContainer onRefresh={handlePullRefresh}>
    <div className="space-y-6 p-4 md:p-6" key={refreshNonce}>
      {/* Dashboard Header — negative margins cancel the parent's p-4/p-6 so the gradient extends edge-to-edge */}
      <div className="dashboard-header-gradient bg-mesh-gradient -m-4 mb-0 p-4 md:-m-6 md:p-6 rounded-none">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Executive Dashboard</span>
            </h1>
            <p className="text-xs text-muted-foreground">Real-time overview of all warehouse operations across India</p>
          </div>
        <div className="flex flex-col gap-1.5 shrink-0 sm:items-end">
          <div className="flex items-center gap-3">
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
            <div className="float-animation flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-emerald-500" />
              <span className="text-glow-blue font-medium">Live</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <p className="text-[11px] text-muted-foreground">
              {dateInfo.label} · {formatDateShort(dateInfo.from)} – {formatDateShort(dateInfo.to)}
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <MetricsTicker />

      {/* Real-time Operations Panel */}
      <Card className="card-depth overflow-hidden border-primary/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="live-dot pl-2">
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <CardTitle className="text-sm font-semibold">Real-time Operations</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] tabular-nums">
              Updated {new Date(realtimeKpi.lastUpdated).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" key={realtimeKpi.flashKey}>
            <div className={cn(
              "flex items-center gap-3 rounded-lg border p-3 transition-all",
              realtimeKpi.isUpdating && "kpi-update-pulse"
            )}>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/70">
                <Gauge className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Throughput</p>
                <p className="text-lg font-bold text-number tabular-nums leading-tight">
                  {realtimeKpi.throughput}
                  <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">/hr</span>
                </p>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-3 rounded-lg border p-3 transition-all",
              realtimeKpi.isUpdating && "kpi-update-pulse"
            )}>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/70">
                <BoxesIcon className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pending</p>
                <p className="text-lg font-bold text-number tabular-nums leading-tight">{realtimeKpi.pendingOrders}</p>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-3 rounded-lg border p-3 transition-all",
              realtimeKpi.isUpdating && "kpi-update-pulse"
            )}>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70">
                <Anchor className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active Docks</p>
                <p className="text-lg font-bold text-number tabular-nums leading-tight">
                  {realtimeKpi.activeDocks}
                  <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">/24</span>
                </p>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-3 rounded-lg border p-3 transition-all",
              realtimeKpi.isUpdating && "kpi-update-pulse"
            )}>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/70">
                <BarChart3 className="size-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Occupancy</p>
                <p className="text-lg font-bold text-number tabular-nums leading-tight">
                  {realtimeKpi.occupancyRate}
                  <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">%</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Conditions Panel */}
      <div className="stagger-children">
        <WeatherPanel />
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 stagger-children">
        {[
          { label: "New Inbound", icon: PackageSearch, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400", count: "12", view: "inbound" },
          { label: "Pending Dispatch", icon: Truck, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400", count: "8", view: "outbound" },
          { label: "Critical Alerts", icon: Activity, color: "text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400", count: "3", view: "alerts" },
          { label: "Reports Due", icon: BarChart3, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400", count: "2", view: "reports" },
        ].map((action) => {
          const ActionIcon = action.icon
          return (
            <Button
              key={action.label}
              variant="outline"
              onClick={() => useAppStore.getState().setActiveView(action.view)}
              className={cn("h-auto flex-col gap-1.5 rounded-xl border border-border/60 py-3 transition-all hover:shadow-sm hover:border-border btn-press", action.color)}
            >
              <ActionIcon className="h-4 w-4" />
              <span className="text-lg font-bold">{action.count}</span>
              <span className="text-[10px] font-medium opacity-70">{action.label}</span>
            </Button>
          )
        })}
      </div>

      {/* AI Insights + Shift Handover */}
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        <AIInsightsPanel />
        <ShiftHandoverPanel />
      </div>

      {/* Activity Feed + Timeline Row */}
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        <LiveUpdatesFeed maxItems={6} />
        <ActivityTimeline maxItems={5} />
      </div>

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
              sparklineData={kpiSparklineData[kpi.key]}
            />
          )
        })}
      </div>

      {/* SLA Monitoring Panel */}
      <div className="stagger-children">
        <SLAMonitoringPanel />
      </div>

      {/* Warehouse Health Monitor */}
      <div className="stagger-children">
        <WarehouseHealthMonitor />
      </div>

      {/* Warehouse KPI Comparison + Capacity Heatmap */}
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        <WarehouseKPIComparison />
        <WarehouseCapacityHeatmap />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        <Card className={cn("chart-card card-accent-blue card-elevated rounded-xl border border-t-2 border-border/60 shadow-sm")}>
          <CardHeader className="pb-2 flex-center">
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

        <Card className={cn("chart-card card-accent-green card-elevated rounded-xl border border-t-2 border-border/60 shadow-sm")}>
          <CardHeader className="pb-2 flex-center">
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
        <Card className={cn("chart-card card-accent-blue card-elevated rounded-xl border border-t-2 border-border/60 shadow-sm")}>
          <CardHeader className="pb-2 flex-center">
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

        <Card className={cn("chart-card card-accent-blue card-elevated rounded-xl border border-t-2 border-border/60 shadow-sm")}>
          <CardHeader className="pb-2 flex-center">
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
        <Card className={cn("chart-card card-accent-blue card-elevated rounded-xl border border-t-2 border-border/60 shadow-sm")}>
          <CardHeader className="pb-2 flex-center">
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

        <Card className={cn("chart-card card-accent-amber card-elevated rounded-xl border border-t-2 border-border/60 shadow-sm")}>
          <CardHeader className="pb-2 flex-center">
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

      {/* Recent Shipments Table */}
      <div className="stagger-children">
        <ShipmentTrackingTable />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        <Card className={cn("chart-card card-accent-red card-elevated rounded-xl border border-t-2 border-border/60 shadow-sm")}>
          <CardHeader className="pb-2 flex-center">
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

        <Card className={cn("chart-card card-accent-purple card-elevated rounded-xl border border-t-2 border-border/60 shadow-sm")}>
          <CardHeader className="pb-2 flex-center">
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

        {/* Air Cargo */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <AirCargoPanel />
          </CardContent>
        </Card>

        {/* Hazardous Materials */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <HazardousMaterialPanel />
          </CardContent>
        </Card>

        {/* Fleet Vehicle Tracker */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <FleetVehicleTrackerPanel />
          </CardContent>
        </Card>

        {/* Slab Racking Utilization */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <SlabRackingUtilizationPanel />
          </CardContent>
        </Card>

        {/* Dock Scheduling */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <DockSchedulingPanel />
          </CardContent>
        </Card>

        {/* Crossdock Transfers */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <CrossdockTransferPanel />
          </CardContent>
        </Card>

        {/* Returns Processing */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <ReturnsProcessingPanel />
          </CardContent>
        </Card>

        {/* Quality Inspection */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <QualityInspectionPanel />
          </CardContent>
        </Card>

        {/* Labor Productivity Tracker */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <LaborProductivityTrackerPanel />
          </CardContent>
        </Card>

        {/* Cold Chain Monitoring */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <ColdChainMonitoringPanel />
          </CardContent>
        </Card>

        {/* 3PL Vendor Scorecard */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <ThreePLVendorScorecardPanel />
          </CardContent>
        </Card>

        {/* Slotting Optimizer */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <SlottingOptimizerPanel />
          </CardContent>
        </Card>

        {/* Demand Sensing Analytics */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <DemandSensingAnalyticsPanel />
          </CardContent>
        </Card>

        {/* Warehouse Simulation */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <WarehouseSimulationPanel />
          </CardContent>
        </Card>

        {/* Inventory Replenishment */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <InventoryReplenishmentPanel />
          </CardContent>
        </Card>

        {/* Freight Rate Optimizer */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <FreightRateOptimizerPanel />
          </CardContent>
        </Card>

        {/* Automated Putaway */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <AutomatedPutawayPanel />
          </CardContent>
        </Card>

        {/* Pick Path Optimizer */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <PickPathOptimizerPanel />
          </CardContent>
        </Card>

        {/* Container Unloading */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <ContainerUnloadingPanel />
          </CardContent>
        </Card>

        {/* Cargo Insurance */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <CargoInsurancePanel />
          </CardContent>
        </Card>

        {/* Rail Consignment */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <RailConsignmentPanel />
          </CardContent>
        </Card>

        {/* Gate Management */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <GateManagementPanel />
          </CardContent>
        </Card>

        {/* Value-Added Services */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <ValueAddedServicesPanel />
          </CardContent>
        </Card>

        {/* Last-Mile Delivery */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <LastMileDeliveryPanel />
          </CardContent>
        </Card>

        {/* Warehouse Energy Analytics */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <WarehouseEnergyAnalyticsPanel />
          </CardContent>
        </Card>

        {/* Safety Compliance */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <SafetyCompliancePanel />
          </CardContent>
        </Card>

        {/* Carrier SLA Scorecard */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <CarrierSLAScorecardPanel />
          </CardContent>
        </Card>

        {/* Reverse Logistics Hub */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <ReverseLogisticsHubPanel />
          </CardContent>
        </Card>

        {/* IoT Sensor Dashboard */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <IoTSensorDashboardPanel />
          </CardContent>
        </Card>

        {/* Multi-Modal Transport Planner */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <MultiModalTransportPlannerPanel />
          </CardContent>
        </Card>

        {/* Warehouse Network Optimization */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <WarehouseNetworkOptimizationPanel />
          </CardContent>
        </Card>

        {/* Cross-Border Trade */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <CrossBorderTradePanel />
          </CardContent>
        </Card>

        {/* Demand Forecasting */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <DemandForecastingPanel />
          </CardContent>
        </Card>

        {/* Warehouse Slotting Optimizer */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <WarehouseSlottingOptimizerPanel />
          </CardContent>
        </Card>

        {/* 3PL Contract Management */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <ThreePLContractManagementPanel />
          </CardContent>
        </Card>

        {/* Labor Management */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <LaborManagementPanel />
          </CardContent>
        </Card>

        {/* Fleet Telematics */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <FleetTelematicsPanel />
          </CardContent>
        </Card>

        {/* Warehouse Automation */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <WarehouseAutomationPanel />
          </CardContent>
        </Card>

        {/* Returns Analytics Hub */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <ReturnsAnalyticsHubPanel />
          </CardContent>
        </Card>

        {/* Order Wave Management */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <OrderWaveManagementPanel />
          </CardContent>
        </Card>

        {/* Carbon Footprint Tracker */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <CarbonFootprintTrackerPanel />
          </CardContent>
        </Card>

        {/* Smart Dock Scheduler */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <SmartDockSchedulerPanel />
          </CardContent>
        </Card>

        {/* Cold Chain Analytics */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <ColdChainAnalyticsPanel />
          </CardContent>
        </Card>

        {/* Warehouse Digital Twin */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <WarehouseDigitalTwinPanel />
          </CardContent>
        </Card>

        {/* Warehouse Safety Monitoring */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <WarehouseSafetyMonitoringPanel />
          </CardContent>
        </Card>

        {/* Packaging Optimization */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <PackagingOptimizationPanel />
          </CardContent>
        </Card>

        {/* Container Tracking Analytics */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <ContainerTrackingAnalyticsPanel />
          </CardContent>
        </Card>

        {/* Last Mile Optimization */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <LastMileOptimizationPanel />
          </CardContent>
        </Card>

        {/* Logistics Cost Intelligence */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <LogisticsCostIntelligencePanel />
          </CardContent>
        </Card>

        {/* Warehouse Energy Management */}
        <Card className="card-depth overflow-hidden border-primary/10">
          <CardContent className="p-4">
            <WarehouseEnergyManagementPanel />
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
    </PullToRefreshContainer>
  )
}
