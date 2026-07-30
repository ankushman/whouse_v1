"use client"

import { useMemo, useState, useCallback } from "react"
import { employees } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { DataTable, type Column } from "@/components/shared/data-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  UserCheck,
  TrendingUp,
  CalendarCheck,
  Trophy,
  Crown,
  Medal,
  Award,
  Clock,
  BarChart3,
  GitCompareArrows,
  Building2,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ShiftScheduler } from "@/components/shared/shift-scheduler"
import { EmployeeDetailDrawer } from "@/components/shared/employee-detail-drawer"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

function getRankBadge(rank: number) {
  if (rank === 1)
    return (
      <Badge className="badge-interactive bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 gap-1">
        <Crown className="size-3" /> 1st
      </Badge>
    )
  if (rank === 2)
    return (
      <Badge className="badge-interactive bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 gap-1">
        <Medal className="size-3" /> 2nd
      </Badge>
    )
  if (rank === 3)
    return (
      <Badge className="badge-interactive bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 gap-1">
        <Award className="size-3" /> 3rd
      </Badge>
    )
  return <span className="text-muted-foreground tabular-nums text-sm">{rank}</span>
}

function shiftColor(shift: string) {
  switch (shift) {
    case "Morning":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
    case "Afternoon":
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800"
    case "Night":
      return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800"
    default:
      return ""
  }
}

function productivityColor(p: number) {
  if (p >= 90) return "text-emerald-600 font-semibold"
  if (p >= 80) return "text-amber-600 font-medium"
  return "text-red-600"
}

// Bug E2 fix: Previously the warehouse breakdown bar used 4 chained ternaries inside cn(),
// each producing a `bg-*` class. tailwind-merge keeps the LAST conflicting class — so
// Productivity/Attendance/Tasks bars always ended up red (the Error Rate fallthrough).
// Now we return a SINGLE bg-* class based on metric label + value.
//
// Bug 33-AUDIT#6 (MEDIUM) fix: the helper checked `label === "Attendance"` but the actual
// label emitted by buildWarehouseBreakdown is `"Attendance %"`. The branch was dead.
// Now we normalize by checking both variants.
function getMetricBarColor(label: string, value: number): string {
  // Normalize: strip trailing " %" so "Attendance %" matches "Attendance".
  const norm = label.replace(/\s*%$/, "").trim()
  if (norm === "Productivity") {
    return value >= 90 ? "bg-emerald-500" : value >= 80 ? "bg-amber-500" : "bg-blue-500"
  }
  if (norm === "Attendance") {
    return value >= 90 ? "bg-emerald-500" : "bg-blue-500"
  }
  if (norm === "Tasks") return "bg-violet-500"
  if (norm === "Error Rate") {
    return value <= 2 ? "bg-emerald-500" : value <= 3 ? "bg-amber-500" : "bg-red-500"
  }
  return "bg-blue-500"
}

// Returns the width % for a metric bar. Tasks are raw counts (not percentages),
// so they need normalization to a 0-100 scale relative to a 200-task baseline.
// Bug 33-AUDIT#7 (MEDIUM) fix: previously Tasks bars were always 100% because
// Math.min(100, rawCount) clamped any count > 100 to 100.
function getMetricBarWidth(label: string, value: number): number {
  const norm = label.replace(/\s*%$/, "").trim()
  if (norm === "Tasks") {
    // Normalize: 200+ tasks = full bar
    return Math.min(100, Math.round((value / 200) * 100))
  }
  if (norm === "Error Rate") {
    // Invert: lower error rate = fuller bar (5% error → 0% bar, 0% error → 100% bar)
    return Math.max(0, Math.min(100, Math.round((1 - value / 5) * 100)))
  }
  // Productivity / Attendance are already 0-100
  return Math.min(100, Math.max(0, value))
}

// Weekly trend data for performance charts
const weeklyTrendData = [
  { week: "Wk 1", productivity: 82, attendance: 91, errorRate: 2.8, tasks: 145, target: 2.5 },
  { week: "Wk 2", productivity: 85, attendance: 88, errorRate: 2.1, tasks: 158, target: 2.5 },
  { week: "Wk 3", productivity: 79, attendance: 93, errorRate: 3.4, tasks: 139, target: 2.5 },
  { week: "Wk 4", productivity: 88, attendance: 90, errorRate: 1.9, tasks: 167, target: 2.5 },
  { week: "Wk 5", productivity: 84, attendance: 92, errorRate: 2.5, tasks: 152, target: 2.5 },
  { week: "Wk 6", productivity: 91, attendance: 94, errorRate: 1.4, tasks: 173, target: 2.5 },
  { week: "Wk 7", productivity: 87, attendance: 89, errorRate: 2.2, tasks: 161, target: 2.5 },
]

// Weekly summary comparison data
const weeklySummary = [
  { label: "Productivity", value: "87%", change: 3.5 },
  { label: "Attendance", value: "92%", change: 1.2 },
  { label: "Tasks Done", value: "161", change: 5.8 },
  { label: "Error Rate", value: "2.2%", change: -0.3 },
]

// ── Compare Tab Data ──────────────────────────────────────────────────────────

const TOP5_COLORS = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"]

// Radar chart data for top 5 employees (computed dynamically)
function buildTop5CompareData(employeesList: typeof employees) {
  const top5 = [...employeesList].sort((a, b) => a.rank - b.rank).slice(0, 5)
  const metrics = ["Productivity", "Attendance", "Tasks", "Error Quality"]
  return metrics.map((metric) => {
    const row: Record<string, string | number> = { metric }
    for (const emp of top5) {
      if (metric === "Productivity") row[emp.name] = emp.productivity
      else if (metric === "Attendance") row[emp.name] = emp.attendance
      else if (metric === "Tasks") row[emp.name] = Math.min(100, (emp.tasksCompleted / 200) * 100)
      else row[emp.name] = Math.max(0, 100 - emp.errorRate * 20)
    }
    return row
  })
}

function buildTop5BarData(employeesList: typeof employees) {
  const top5 = [...employeesList].sort((a, b) => a.rank - b.rank).slice(0, 5)
  return top5.map((emp) => ({
    name: emp.name.split(" ")[0],
    productivity: emp.productivity,
    attendance: emp.attendance,
    taskScore: Math.min(100, (emp.tasksCompleted / 200) * 100),
  }))
}

function buildWarehouseBreakdown(employeesList: typeof employees) {
  const warehouseMap = new Map<string, typeof employeesList>()
  for (const emp of employeesList) {
    const list = warehouseMap.get(emp.warehouse) || []
    list.push(emp)
    warehouseMap.set(emp.warehouse, list)
  }
  return Array.from(warehouseMap.entries()).map(([warehouse, emps]) => ({
    warehouse,
    count: emps.length,
    metrics: [
      { label: "Productivity", value: Math.round(emps.reduce((s, e) => s + e.productivity, 0) / emps.length) },
      { label: "Attendance %", value: Math.round(emps.reduce((s, e) => s + e.attendance, 0) / emps.length) },
      { label: "Tasks", value: Math.round(emps.reduce((s, e) => s + e.tasksCompleted, 0) / emps.length) },
      { label: "Error Rate", value: Number((emps.reduce((s, e) => s + e.errorRate, 0) / emps.length).toFixed(1)) },
    ],
  }))
}


const employeeColumns: Column<(typeof employees)[number]>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (_val, emp) => (
      <div className="flex items-center gap-2.5">
        <Avatar className="size-7">
          <AvatarFallback className="text-[10px] font-semibold bg-muted">
            {emp.avatar}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm whitespace-nowrap">{emp.name}</span>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    sortable: true,
    className: "hidden md:table-cell text-muted-foreground",
  },
  {
    key: "warehouse",
    header: "Warehouse",
    sortable: true,
    className: "hidden lg:table-cell text-muted-foreground",
  },
  {
    key: "shift",
    header: "Shift",
    sortable: true,
    className: "hidden sm:table-cell",
    render: (val: unknown) => {
      const v = String(val ?? "")
      return (
        <Badge variant="outline" className={cn("text-[10px] font-normal rounded-full", shiftColor(v))}>
          {v}
        </Badge>
      )
    },
  },
  {
    key: "productivity",
    header: "Productivity",
    sortable: true,
    className: "text-right tabular-nums",
    render: (val: unknown) => {
      const v = Number(val ?? 0)
      return <span className={productivityColor(v)}>{v}%</span>
    },
  },
  {
    key: "attendance",
    header: "Attendance (%)",
    sortable: true,
    className: "text-right tabular-nums",
    render: (val: unknown) => {
      const v = Number(val ?? 0)
      return <span>{v}%</span>
    },
  },
  {
    key: "tasksCompleted",
    header: "Tasks",
    sortable: true,
    className: "text-right tabular-nums hidden sm:table-cell",
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    className: "hidden md:table-cell",
    render: (_val, emp) => {
      const isOnShift = emp.shift !== "Off Duty"
      return (
        <Badge variant={isOnShift ? "default" : "secondary"} className={cn(
          "text-[10px] rounded-full",
          isOnShift ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100" : ""
        )}>
          {isOnShift ? "Active" : "Off Duty"}
        </Badge>
      )
    },
  },
]

// An employee "needs attention" if any of their core metrics breach thresholds.
// Used by the new "Needs Attention" filter + stat card + tab badge.
function needsAttention(e: { productivity: number; attendance: number; errorRate: number; overtime: number }): boolean {
  return e.productivity < 80 || e.attendance < 90 || e.errorRate > 3 || e.overtime > 20
}

export function EmployeesView() {
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [attentionFilter, setAttentionFilter] = useState<string>("all")
  const [selectedEmployee, setSelectedEmployee] = useState<(typeof employees)[number] | null>(null)

  const warehouseList = useMemo(
    () => ["all", ...Array.from(new Set(employees.map((e) => e.warehouse)))],
    []
  )

  const filtered = useMemo(
    () =>
      employees.filter((e) => {
        if (warehouseFilter !== "all" && e.warehouse !== warehouseFilter) return false
        if (attentionFilter === "needs-attention" && !needsAttention(e)) return false
        if (attentionFilter === "top-performers" && e.productivity < 90) return false
        return true
      }),
    [warehouseFilter, attentionFilter]
  )

  const stats = useMemo(
    () => ({
      total: filtered.length,
      onShift: Math.round(filtered.length * 0.78),
      avgProductivity: Math.round(
        filtered.reduce((s, e) => s + e.productivity, 0) / (filtered.length || 1)
      ),
      avgAttendance: Math.round(
        filtered.reduce((s, e) => s + e.attendance, 0) / (filtered.length || 1)
      ),
    }),
    [filtered]
  )

  // Count employees needing attention across the warehouse filter (not attention filter)
  // so the stat card always reflects the warehouse selection regardless of attention filter.
  const needsAttentionCount = useMemo(
    () => employees.filter((e) => {
      if (warehouseFilter !== "all" && e.warehouse !== warehouseFilter) return false
      return needsAttention(e)
    }).length,
    [warehouseFilter]
  )

  // Compare tab derived data
  // Bug E1 fix: top5Employees must be derived from `filtered` (not the global `employees` array)
  // so the radar lines stay in sync with the radar data when a warehouse filter is applied.
  // Previously: top5RadarData used `filtered`, but top5Employees used `employees` (global),
  // so radars were rendered for the global top-5 names even when those employees weren't in
  // the filtered set — producing empty radar lines and a legend disconnected from the data.
  const top5Employees = useMemo(
    () => [...filtered].sort((a, b) => a.rank - b.rank).slice(0, 5),
    [filtered]
  )
  const top5RadarData = useMemo(() => buildTop5CompareData(filtered), [filtered])
  const top5BarData = useMemo(() => buildTop5BarData(filtered), [filtered])
  const warehouseBreakdown = useMemo(() => buildWarehouseBreakdown(filtered), [filtered])

  // Bug 33-AUDIT#21 (LOW) fix: memoize the radar chart config so it's not rebuilt
  // on every render. Previously the config object was constructed inline via .reduce
  // inside the JSX, defeating any memoization inside ChartContainer.
  const top5RadarConfig = useMemo<Record<string, { label: string; color: string }>>(
    () => top5Employees.reduce<Record<string, { label: string; color: string }>>(
      (acc, emp, idx) => {
        acc[emp.name] = { label: emp.name, color: TOP5_COLORS[idx] ?? "#94A3B8" }
        return acc
      },
      {}
    ),
    [top5Employees]
  )

  const handleExportCSV = useCallback(() => {
    const data = filtered.map((e) => ({
      Name: e.name,
      Role: e.role,
      Warehouse: e.warehouse,
      Shift: e.shift,
      "Productivity (%)": e.productivity,
      "Attendance (%)": e.attendance,
      "Tasks Completed": e.tasksCompleted,
      "Error Rate (%)": e.errorRate,
    }))
    exportToCSV(data, "employees-data")
  }, [filtered])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Workforce management and performance tracking"
        actions={<ExportButton onExportCSV={handleExportCSV} />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 stagger-children">
        <Card className="card-depth py-0 gap-0">
          <CardContent className="glass-subtle flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/80">
              <Users className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Employees
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums leading-tight">
                {stats.total}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-depth py-0 gap-0">
          <CardContent className="glass-subtle flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60">
              <UserCheck className="size-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                On Shift Today
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums leading-tight text-emerald-600">
                {stats.onShift}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-depth py-0 gap-0">
          <CardContent className="glass-subtle flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/80">
              <TrendingUp className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Avg Productivity
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums leading-tight">
                {stats.avgProductivity}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-depth py-0 gap-0">
          <CardContent className="glass-subtle flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/80">
              <CalendarCheck className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Avg Attendance
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums leading-tight">
                {stats.avgAttendance}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "card-depth py-0 gap-0 cursor-pointer transition-all hover:shadow-md",
            attentionFilter === "needs-attention" && "ring-2 ring-amber-400/60"
          )}
          onClick={() => setAttentionFilter(attentionFilter === "needs-attention" ? "all" : "needs-attention")}
        >
          <CardContent className="glass-subtle flex items-center gap-4 py-4">
            <div className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
              needsAttentionCount > 0
                ? "bg-amber-50 dark:bg-amber-950/60"
                : "bg-emerald-50 dark:bg-emerald-950/60"
            )}>
              <AlertTriangle className={cn(
                "size-5",
                needsAttentionCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
              )} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Needs Attention
              </p>
              <p className={cn(
                "mt-0.5 text-xl font-bold tabular-nums leading-tight",
                needsAttentionCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
              )}>
                {needsAttentionCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="h-9">
          <TabsTrigger value="leaderboard" className="text-xs gap-1.5">
            <Trophy className="size-3" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="shifts" className="text-xs gap-1.5">
            <Clock className="size-3" />
            Shift Schedule
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs gap-1.5">
            <TrendingUp className="size-3" />
            Performance Trends
          </TabsTrigger>
          <TabsTrigger value="compare" className="text-xs gap-1.5">
            <GitCompareArrows className="size-3" />
            Compare
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-4">
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4 gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="size-5 text-amber-500" />
                <CardTitle className="text-base font-semibold">
                  Performance Leaderboard
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Select value={attentionFilter} onValueChange={setAttentionFilter}>
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue placeholder="Performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="needs-attention">Needs Attention</SelectItem>
                    <SelectItem value="top-performers">Top Performers</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger className="w-[180px] h-8 text-xs">
                    <SelectValue placeholder="Filter warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseList.map((wh) => (
                      <SelectItem key={wh} value={wh}>
                        {wh === "all" ? "All Warehouses" : wh}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filtered}
                columns={employeeColumns}
                pageSize={8}
                searchableColumns={["name", "role"]}
                searchPlaceholder="Search name or role..."
                onRowClick={(row) => setSelectedEmployee(row as typeof employees[number])}
                className="max-h-[520px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="mt-4">
          <ShiftScheduler />
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Productivity Trend */}
            <Card className="card-depth chart-card card-accent-blue shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Productivity Trend (Weekly)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ productivity: { label: "Productivity %", color: "#2563EB" }, attendance: { label: "Attendance %", color: "#10B981" } }}
                  className="h-[220px] w-full"
                >
                  <AreaChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[60, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area type="monotone" dataKey="productivity" stroke="var(--color-productivity)" fill="var(--color-productivity)" fillOpacity={0.15} strokeWidth={2} />
                    <Area type="monotone" dataKey="attendance" stroke="var(--color-attendance)" fill="var(--color-attendance)" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 2" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Error Rate Trend */}
            <Card className="card-depth chart-card card-accent-red shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Error Rate Trend (Weekly)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ errorRate: { label: "Error Rate %", color: "#EF4444" }, target: { label: "Target", color: "#94A3B8" } }}
                  className="h-[220px] w-full"
                >
                  <LineChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 5]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="errorRate" stroke="var(--color-errorRate)" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="target" stroke="var(--color-target)" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Tasks Completed Trend */}
            <Card className="card-depth chart-card card-accent-green shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Tasks Completed Trend (Weekly)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ tasks: { label: "Tasks Completed", color: "#8B5CF6" } }}
                  className="h-[220px] w-full"
                >
                  <BarChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Summary comparison */}
            <Card className="card-depth shadow-card lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Weekly Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {weeklySummary.map((item) => (
                    <div key={item.label} className="rounded-lg border border-border/50 bg-muted/20 p-3 text-center transition-smooth">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className={cn("text-lg font-bold tabular-nums", item.change > 0 ? "text-emerald-600" : item.change < 0 ? "text-red-600" : "text-foreground")}>
                        {item.change > 0 ? "+" : ""}{item.value}
                      </p>
                      <p className={cn("text-xs", item.change > 0 ? "text-emerald-500" : "text-red-500")}>
                        {item.change > 0 ? "↑" : "↓"}{Math.abs(item.change)}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Compare Tab ── */}
        <TabsContent value="compare" className="mt-4">
          <div className="space-y-4">
            {/* Head-to-Head: Top 5 Radar Comparison */}
            <Card className="card-depth chart-card card-accent-blue shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <GitCompareArrows className="size-4 text-blue-500" />
                    Top 5 Employees — Skill Comparison
                  </CardTitle>
                  <Badge variant="outline" className="badge-interactive text-[10px]">Radar View</Badge>
                </div>
                <CardDescription className="text-xs">
                  Multi-dimensional performance comparison across key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={top5RadarConfig}
                  className="h-[320px] w-full"
                >
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={top5RadarData}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    {top5Employees.map((emp, idx) => (
                      <Radar
                        key={emp.name}
                        name={emp.name}
                        dataKey={emp.name}
                        stroke={TOP5_COLORS[idx]}
                        fill={TOP5_COLORS[idx]}
                        fillOpacity={0.08}
                        strokeWidth={2}
                      />
                    ))}
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Bar Chart: Top 5 Multi-Metric Comparison */}
            <Card className="card-depth chart-card card-accent-green shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="size-4 text-emerald-500" />
                    Metric Breakdown — Top Performers
                  </CardTitle>
                  <Badge variant="outline" className="badge-interactive text-[10px]">Grouped Bars</Badge>
                </div>
                <CardDescription className="text-xs">
                  Side-by-side comparison of productivity, attendance, and task completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    productivity: { label: "Productivity %", color: "#2563EB" },
                    attendance: { label: "Attendance %", color: "#10B981" },
                    tasks: { label: "Task Score", color: "#8B5CF6" },
                  }}
                  className="h-[260px] w-full"
                >
                  <BarChart data={top5BarData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="productivity" fill="var(--color-productivity)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="attendance" fill="var(--color-attendance)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="taskScore" fill="var(--color-tasks)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Warehouse-level Performance Comparison */}
            <Card className="card-depth shadow-card lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="size-4 text-violet-500" />
                  Warehouse Performance Breakdown
                </CardTitle>
                <CardDescription className="text-xs">
                  Average performance metrics grouped by warehouse location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {warehouseBreakdown.map((wh) => (
                    <div key={wh.warehouse} className="rounded-lg border border-border/50 bg-muted/15 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{wh.warehouse}</span>
                        <Badge variant="outline" className="badge-interactive text-[9px]">
                          {wh.count} staff
                        </Badge>
                      </div>
                      {wh.metrics.map((m) => (
                        <div key={m.label} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{m.label}</span>
                            <span className={cn(
                              "text-[10px] font-bold tabular-nums",
                              m.label === "Productivity" ? productivityColor(m.value) :
                              m.label === "Error Rate" && m.value > 3 ? "text-red-600" :
                              m.label === "Error Rate" && m.value > 1.5 ? "text-amber-600" :
                              "text-foreground"
                            )}>
                              {/* Bug 33-AUDIT#8 (MEDIUM) fix: "Productivity" was rendered without % suffix.
                                  Now % is added for Productivity, Attendance %, and Error Rate. */}
                              {m.value}{m.label.includes("%") || m.label === "Error Rate" || m.label === "Productivity" ? "%" : ""}
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                getMetricBarColor(m.label, m.value)
                              )}
                              style={{ width: `${getMetricBarWidth(m.label, m.value)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <EmployeeDetailDrawer
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onOpenChange={(open) => {
          if (!open) setSelectedEmployee(null)
        }}
      />
    </div>
  )
}
