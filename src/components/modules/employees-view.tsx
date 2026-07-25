"use client"

import { useMemo, useState, useCallback } from "react"
import { employees } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Search,
  Clock,
  BarChart3,
  GitCompareArrows,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ShiftScheduler } from "@/components/shared/shift-scheduler"
import { EmployeeDetailModal } from "@/components/shared/employee-detail-modal"
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
  ResponsiveContainer,
} from "recharts"

function getRankBadge(rank: number) {
  if (rank === 1)
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 gap-1">
        <Crown className="size-3" /> 1st
      </Badge>
    )
  if (rank === 2)
    return (
      <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 gap-1">
        <Medal className="size-3" /> 2nd
      </Badge>
    )
  if (rank === 3)
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 gap-1">
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

export function EmployeesView() {
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<(typeof employees)[number] | null>(null)

  const warehouseList = useMemo(
    () => ["all", ...Array.from(new Set(employees.map((e) => e.warehouse)))],
    []
  )

  const filtered = useMemo(
    () =>
      employees.filter((e) => {
        if (warehouseFilter !== "all" && e.warehouse !== warehouseFilter) return false
        if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) && !e.role.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
      }),
    [warehouseFilter, searchQuery]
  )

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.rank - b.rank),
    [filtered]
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

  // Compare tab derived data
  const top5Employees = useMemo(
    () => [...employees].sort((a, b) => a.rank - b.rank).slice(0, 5),
    []
  )
  const top5RadarData = useMemo(() => buildTop5CompareData(filtered), [filtered])
  const top5BarData = useMemo(() => buildTop5BarData(filtered), [filtered])
  const warehouseBreakdown = useMemo(() => buildWarehouseBreakdown(filtered), [filtered])

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

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 stagger-children">
        <Card className="card-depth py-0 gap-0">
          <CardContent className="flex items-center gap-4 py-4">
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
          <CardContent className="flex items-center gap-4 py-4">
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
          <CardContent className="flex items-center gap-4 py-4">
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
          <CardContent className="flex items-center gap-4 py-4">
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
            </CardHeader>
            <CardContent>
              {/* Filter bar with search, warehouse select, and result count */}
              <div className="filter-bar flex flex-wrap items-center gap-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search name or role..."
                    className="h-8 w-[200px] pl-8 text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
                <div className="ml-auto text-xs text-muted-foreground">
                  {filtered.length} employee{filtered.length !== 1 ? "s" : ""} shown
                </div>
              </div>

              <ScrollArea className="max-h-[520px]">
                <Table className="table-row-hover">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Role</TableHead>
                      <TableHead className="hidden lg:table-cell">Warehouse</TableHead>
                      <TableHead className="hidden sm:table-cell">Shift</TableHead>
                      <TableHead className="text-right">Attend.</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Tasks</TableHead>
                      <TableHead className="text-right">Productivity</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sorted.map((emp) => (
                      <TableRow
                        key={emp.id}
                        className="cursor-pointer hover:bg-muted/60"
                        onClick={() => setSelectedEmployee(emp)}
                      >
                        <TableCell className="text-center">
                          {getRankBadge(emp.rank)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-7">
                              <AvatarFallback className="text-[10px] font-semibold bg-muted">
                                {emp.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm whitespace-nowrap">
                              {emp.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {emp.role}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                          {emp.warehouse}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-normal rounded-full",
                              shiftColor(emp.shift)
                            )}
                          >
                            {emp.shift}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm">
                          {emp.attendance}%
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm hidden sm:table-cell">
                          {emp.tasksCompleted}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm">
                          <span className={productivityColor(emp.productivity)}>
                            {emp.productivity}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm hidden md:table-cell">
                          <span
                            className={cn(
                              emp.errorRate > 3
                                ? "text-red-600"
                                : emp.errorRate > 1.5
                                  ? "text-amber-600"
                                  : "text-muted-foreground"
                            )}
                          >
                            {emp.errorRate}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
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
                  <Badge variant="outline" className="text-[10px]">Radar View</Badge>
                </div>
                <CardDescription className="text-xs">
                  Multi-dimensional performance comparison across key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    productivity: { label: "Productivity", color: "#2563EB" },
                    attendance: { label: "Attendance", color: "#10B981" },
                    tasks: { label: "Tasks", color: "#8B5CF6" },
                    accuracy: { label: "Accuracy", color: "#F59E0B" },
                  }}
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
                  <Badge variant="outline" className="text-[10px]">Grouped Bars</Badge>
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
                        <Badge variant="outline" className="text-[9px]">
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
                              {m.value}{m.label.includes("%") || m.label === "Error Rate" ? "%" : ""}
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                m.label === "Productivity" && m.value >= 90 ? "bg-emerald-500" :
                                m.label === "Productivity" && m.value >= 80 ? "bg-amber-500" : "bg-blue-500",
                                m.label === "Attendance" && m.value >= 90 ? "bg-emerald-500" : "bg-blue-500",
                                m.label === "Tasks" && "bg-violet-500",
                                m.label === "Error Rate" && m.value <= 2 ? "bg-emerald-500" :
                                m.label === "Error Rate" && m.value <= 3 ? "bg-amber-500" : "bg-red-500"
                              )}
                              style={{ width: `${Math.min(100, m.value)}%` }}
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

      <EmployeeDetailModal
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onOpenChange={(open) => {
          if (!open) setSelectedEmployee(null)
        }}
      />
    </div>
  )
}
