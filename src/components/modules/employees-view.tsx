"use client"

import { useMemo, useState, useCallback } from "react"
import { employees } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ShiftScheduler } from "@/components/shared/shift-scheduler"
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
  XAxis,
  YAxis,
  CartesianGrid,
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

export function EmployeesView() {
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

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
                      <TableRow key={emp.id}>
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
                    <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[4, 4]} />
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
      </Tabs>
    </div>
  )
}
