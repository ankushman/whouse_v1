"use client"

import { useMemo, useState, useCallback } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  MapPin,
  Clock,
  Route,
  Truck,
  Fuel,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Zap,
  TrendingUp,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ── Mock Data ──────────────────────────────────────────────────────────────

const routes = [
  { id: "RT-2024-001", origin: "Mumbai DC", destination: "Pune Hub", stops: 3, estTime: "2h 45m", distance: "152 km", status: "optimized" as const, progress: 0, vehicle: "TRK-101" },
  { id: "RT-2024-002", origin: "Delhi Hub", destination: "Jaipur DC", stops: 2, estTime: "4h 10m", distance: "268 km", status: "in-transit" as const, progress: 65, vehicle: "TRK-203" },
  { id: "RT-2024-003", origin: "Chennai Port", destination: "Bangalore DC", stops: 4, estTime: "6h 30m", distance: "347 km", status: "in-transit" as const, progress: 42, vehicle: "TRK-307" },
  { id: "RT-2024-004", origin: "Kolkata DC", destination: "Patna Hub", stops: 2, estTime: "5h 15m", distance: "573 km", status: "delayed" as const, progress: 80, vehicle: "TRK-412" },
  { id: "RT-2024-005", origin: "Hyderabad DC", destination: "Mumbai Port", stops: 3, estTime: "8h 20m", distance: "712 km", status: "optimized" as const, progress: 0, vehicle: "TRK-518" },
  { id: "RT-2024-006", origin: "Mumbai DC", destination: "Goa Warehouse", stops: 1, estTime: "5h 45m", distance: "559 km", status: "completed" as const, progress: 100, vehicle: "TRK-209" },
]

const performanceData = [
  { day: "Mon", planned: 4.0, actual: 4.3 },
  { day: "Tue", planned: 3.8, actual: 3.6 },
  { day: "Wed", planned: 4.2, actual: 4.8 },
  { day: "Thu", planned: 3.5, actual: 3.4 },
  { day: "Fri", planned: 4.1, actual: 4.5 },
  { day: "Sat", planned: 3.2, actual: 3.1 },
  { day: "Sun", planned: 2.8, actual: 2.9 },
]

const suggestions = [
  { text: "Consolidate routes RT-003 and RT-007 to reduce fuel by 15%", priority: "high" as const },
  { text: "Reschedule RT-005 delivery window to avoid Mumbai traffic (8-10 AM)", priority: "medium" as const },
  { text: "Switch RT-012 to NH-48 highway for 22 min faster delivery", priority: "low" as const },
]

const perfChartConfig = {
  planned: { label: "Planned Time (hrs)", color: "#94A3B8" },
  actual: { label: "Actual Time (hrs)", color: "#2563EB" },
}

// ── Helpers ────────────────────────────────────────────────────────────────

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  optimized: { bg: "bg-emerald-50 dark:bg-emerald-950/70", text: "text-emerald-700 dark:text-emerald-300", label: "Optimized" },
  "in-transit": { bg: "bg-blue-50 dark:bg-blue-950/70", text: "text-blue-700 dark:text-blue-300", label: "In Transit" },
  delayed: { bg: "bg-red-50 dark:bg-red-950/70", text: "text-red-700 dark:text-red-300", label: "Delayed" },
  completed: { bg: "bg-gray-100 dark:bg-gray-800/70", text: "text-gray-600 dark:text-gray-400", label: "Completed" },
}

const priorityStyles: Record<string, { bg: string; text: string }> = {
  high: { bg: "bg-red-50 dark:bg-red-950/70", text: "text-red-700 dark:text-red-300" },
  medium: { bg: "bg-amber-50 dark:bg-amber-950/70", text: "text-amber-700 dark:text-amber-300" },
  low: { bg: "bg-blue-50 dark:bg-blue-950/70", text: "text-blue-700 dark:text-blue-300" },
}

function getProgressColor(progress: number): string {
  if (progress === 100) return "bg-gray-400 dark:bg-gray-500"
  if (progress > 70) return "bg-red-500"
  if (progress > 40) return "bg-amber-500"
  return "bg-blue-500"
}

// ── Component ──────────────────────────────────────────────────────────────

export function RouteOptimizationView() {
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredRoutes = useMemo(() => {
    if (statusFilter === "all") return routes
    return routes.filter((r) => r.status === statusFilter)
  }, [statusFilter])

  const handleExportCSV = useCallback(() => {
    const data = routes.map((r) => ({
      ID: r.id,
      Origin: r.origin,
      Destination: r.destination,
      Stops: r.stops,
      "Est. Time": r.estTime,
      Distance: r.distance,
      Status: r.status,
      Progress: `${r.progress}%`,
      Vehicle: r.vehicle,
    }))
    exportToCSV(data, "route-optimization", ["ID", "Origin", "Destination", "Stops", "Est. Time", "Distance", "Status", "Progress", "Vehicle"])
  }, [])

  const summaryCards = useMemo(() => [
    { label: "Active Routes", value: "24", change: "+3 today", icon: Route, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
    { label: "Avg. Delivery Time", value: "4.2 hrs", change: "↓ 12%", icon: Clock, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
    { label: "Fuel Efficiency", value: "8.5 km/L", change: "↑ 5%", icon: Fuel, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
    { label: "On-time Rate", value: "94.7%", change: "↑ 2.3%", icon: CheckCircle, color: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
  ], [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Route Optimization"
        description="Plan and optimize delivery routes across the warehouse network"
        actions={
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <Filter className="h-3 w-3 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="optimized">Optimized</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <ExportButton onExportCSV={handleExportCSV} />
            <Button variant="outline" size="sm" className="gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Optimize All
            </Button>
          </div>
        }
      />

      {/* ── Summary Stats ── */}
      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="card-depth shadow-card hover-lift-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", card.color)}>
                <card.icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold tabular-nums text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Route List */}
        <Card className="card-depth shadow-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="size-4 text-muted-foreground" />
              Optimized Routes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredRoutes.map((route) => {
              const status = statusStyles[route.status]
              return (
                <div
                  key={route.id}
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4 transition-smooth hover:bg-muted/40 hover-lift-sm"
                >
                  {/* Route Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-muted-foreground">{route.id}</span>
                      <span className={cn("badge-soft", status.bg, status.text)}>{status.label}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                      <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                      <span>{route.origin}</span>
                      <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                      <span>{route.destination}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Route className="size-3" />{route.stops} stops</span>
                      <span className="flex items-center gap-1"><Clock className="size-3" />{route.estTime}</span>
                      <span>{route.distance}</span>
                      <span className="flex items-center gap-1"><Truck className="size-3" />{route.vehicle}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {route.status !== "optimized" && (
                    <div className="flex w-24 shrink-0 flex-col items-end gap-1.5">
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className={cn("h-2 rounded-full transition-all", getProgressColor(route.progress))}
                          style={{ width: `${route.progress}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">{route.progress}%</span>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Performance Chart */}
          <Card className="card-depth chart-card card-accent-blue shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4 text-muted-foreground" />
                Delivery Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={perfChartConfig} className="h-[200px] w-full">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" domain={[0, 6]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    stroke="var(--color-planned)"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--color-actual)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="card-depth shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="size-4 text-amber-500" />
                Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((s, i) => {
                const prio = priorityStyles[s.priority]
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-border/50 bg-muted/20 p-3 transition-smooth hover:bg-muted/40"
                  >
                    <p className="text-sm text-foreground">{s.text}</p>
                    <span className={cn("mt-1.5 inline-block badge-soft", prio.bg, prio.text)}>
                      {s.priority.charAt(0).toUpperCase() + s.priority.slice(1)}
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
