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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts"
import {
  User,
  Clock,
  Calendar,
  Award,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Star,
  Medal,
  Trophy,
  Flame,
  Sparkles,
  RefreshCw,
  Download,
  ChevronRight,
  Building2,
  Sun,
  Moon,
  Sunrise,
  ShieldCheck,
  Briefcase,
  GitBranch,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"
import type { Employee } from "@/data/mock-data"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductivityDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  onPromote?: (employee: Employee) => void
  onRecognize?: (employee: Employee) => void
}

interface WeeklyTrendPoint {
  day: string
  productivity: number
  target: number
}

interface TaskCategory {
  label: string
  count: number
  target: number
  icon: typeof Target
}

interface SkillRow {
  label: string
  level: number
  yearsExp: number
  certified: boolean
}

interface Achievement {
  id: string
  title: string
  detail: string
  date: string
  icon: typeof Award
  color: string
}

interface ShiftHistoryRow {
  date: string
  shift: "Morning" | "Afternoon" | "Night" | "Off Duty"
  start: string
  end: string
  productivity: number
  tasks: number
  status: "on-time" | "late" | "overtime"
}

// ---------------------------------------------------------------------------
// Deterministic mock generators
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function getWeeklyTrend(emp: Employee): WeeklyTrendPoint[] {
  const seed = hashStr(emp.id)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day, i) => {
    const base = emp.productivity
    const variance = ((seed + i * 13) % 21) - 10
    const value = Math.max(60, Math.min(100, base + variance))
    return {
      day,
      productivity: +value.toFixed(1),
      target: 85,
    }
  })
}

function getTaskCategories(emp: Employee): TaskCategory[] {
  const seed = hashStr(emp.id + "tasks")
  const total = emp.tasksCompleted
  const picking = Math.round(total * (0.32 + ((seed % 7) / 100)))
  const packing = Math.round(total * (0.24 + ((seed % 5) / 100)))
  const loading = Math.round(total * (0.18 + ((seed % 4) / 100)))
  const inspection = Math.round(total * (0.12 + ((seed % 3) / 100)))
  const cycleCount = Math.max(0, total - picking - packing - loading - inspection)
  return [
    { label: "Picking", count: picking, target: 350, icon: Target },
    { label: "Packing", count: packing, target: 280, icon: Briefcase },
    { label: "Loading", count: loading, target: 200, icon: Activity },
    { label: "Inspection", count: inspection, target: 120, icon: ShieldCheck },
    { label: "Cycle Count", count: cycleCount, target: 80, icon: CheckCircle2 },
  ]
}

function getSkills(emp: Employee): SkillRow[] {
  const seed = hashStr(emp.id + "skills")
  const base: { label: string; baseLevel: number }[] = [
    { label: "Forklift Operation", baseLevel: 70 },
    { label: "Inventory Management", baseLevel: 65 },
    { label: "Quality Inspection", baseLevel: 75 },
    { label: "Safety Protocols", baseLevel: 80 },
    { label: "RF Scanner Usage", baseLevel: 78 },
    { label: "Team Coordination", baseLevel: 72 },
    { label: "WMS Software", baseLevel: 68 },
  ]
  return base.map((s, i) => {
    const adj = ((seed + i * 11) % 25) - 5
    const level = Math.max(40, Math.min(100, s.baseLevel + adj))
    return {
      label: s.label,
      level,
      yearsExp: 1 + ((seed + i * 3) % 6),
      certified: (seed + i) % 3 !== 0,
    }
  })
}

function getAchievements(emp: Employee): Achievement[] {
  const seed = hashStr(emp.id + "ach")
  const all: Achievement[] = [
    {
      id: "A-001",
      title: "Top Performer of the Month",
      detail: "Highest productivity score across all Chennai shifts",
      date: "15 Jan 2025",
      icon: Trophy,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-950/40",
    },
    {
      id: "A-002",
      title: "100 Tasks Milestone",
      detail: "Completed 100+ tasks in a single shift without errors",
      date: "8 Jan 2025",
      icon: Target,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-950/40",
    },
    {
      id: "A-003",
      title: "Safety Excellence Award",
      detail: "Zero safety incidents for 90 consecutive days",
      date: "22 Dec 2024",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-950/40",
    },
    {
      id: "A-004",
      title: "Quality Champion",
      detail: "Maintained <1% error rate for 3 consecutive months",
      date: "5 Dec 2024",
      icon: Medal,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-950/40",
    },
    {
      id: "A-005",
      title: "Perfect Attendance",
      detail: "30 consecutive days without absence or lateness",
      date: "18 Nov 2024",
      icon: Calendar,
      color: "text-rose-500 bg-rose-100 dark:bg-rose-950/40",
    },
    {
      id: "A-006",
      title: "Streak Master",
      detail: "7-day streak of meeting daily targets",
      date: "10 Nov 2024",
      icon: Flame,
      color: "text-orange-500 bg-orange-100 dark:bg-orange-950/40",
    },
  ]
  const count = 3 + (seed % 4)
  return all.slice(0, count)
}

function getShiftHistory(emp: Employee): ShiftHistoryRow[] {
  const seed = hashStr(emp.id + "shift")
  const shifts: ShiftHistoryRow["shift"][] = [emp.shift, emp.shift, emp.shift, "Afternoon", emp.shift]
  const statuses: ShiftHistoryRow["status"][] = ["on-time", "overtime", "on-time", "late", "on-time"]
  return shifts.map((shift, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    const base = emp.productivity
    const variance = ((seed + i * 7) % 17) - 8
    return {
      date: dateStr,
      shift,
      start: shift === "Morning" ? "06:00" : shift === "Afternoon" ? "14:00" : "22:00",
      end: shift === "Morning" ? "14:00" : shift === "Afternoon" ? "22:00" : "06:00",
      productivity: Math.max(60, Math.min(100, base + variance)),
      tasks: 25 + ((seed + i * 11) % 35),
      status: statuses[i],
    }
  })
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductivityDetailDrawer({
  open,
  onOpenChange,
  employee,
  onPromote,
  onRecognize,
}: ProductivityDetailDrawerProps) {
  const toast = useToast()

  // Compute all derived data unconditionally (Rules of Hooks).
  const weeklyTrend = React.useMemo(() => employee ? getWeeklyTrend(employee) : [], [employee])
  const taskCats = React.useMemo(() => employee ? getTaskCategories(employee) : [], [employee])
  const skills = React.useMemo(() => employee ? getSkills(employee) : [], [employee])
  const achievements = React.useMemo(() => employee ? getAchievements(employee) : [], [employee])
  const shiftHistory = React.useMemo(() => employee ? getShiftHistory(employee) : [], [employee])

  // Productivity radial chart data
  const radialData = React.useMemo(() => {
    if (!employee) return []
    const v = employee.productivity
    const fill = v >= 90 ? "#10B981" : v >= 75 ? "#2563EB" : v >= 60 ? "#F59E0B" : "#EF4444"
    return [{ name: "Productivity", value: v, fill }]
  }, [employee])

  // Tasks bar chart data
  const tasksChartData = React.useMemo(() => {
    return taskCats.map((c) => ({
      label: c.label,
      count: c.count,
      target: c.target,
    }))
  }, [taskCats])

  if (!employee) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-[680px] p-0 overflow-y-auto" />
      </Sheet>
    )
  }

  const emp = employee
  const isTop = emp.rank <= 3
  const isLow = emp.productivity < 75
  const isError = emp.errorRate > 2

  const shiftIcon = emp.shift === "Morning" ? Sunrise : emp.shift === "Afternoon" ? Sun : Moon
  const ShiftIcon = shiftIcon

  const statusColor = isTop
    ? "text-emerald-600 dark:text-emerald-400"
    : isLow
    ? "text-amber-600 dark:text-amber-400"
    : "text-blue-600 dark:text-blue-400"

  const statusBg = isTop
    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
    : isLow
    ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
    : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800"

  const handleExport = () => {
    const data = [
      {
        Employee: emp.name,
        ID: emp.id,
        Role: emp.role,
        Warehouse: emp.warehouse,
        Shift: emp.shift,
        Attendance: `${emp.attendance}%`,
        Tasks: emp.tasksCompleted,
        Productivity: `${emp.productivity}%`,
        Overtime: `${emp.overtime}h`,
        "Error Rate": `${emp.errorRate}%`,
        Rank: emp.rank,
      },
    ]
    exportToCSV(data, `productivity-${emp.id}`, [
      "Employee", "ID", "Role", "Warehouse", "Shift", "Attendance",
      "Tasks", "Productivity", "Overtime", "Error Rate", "Rank",
    ])
  }

  const handleExportShiftHistory = () => {
    const data = shiftHistory.map((s) => ({
      Date: s.date,
      Shift: s.shift,
      Start: s.start,
      End: s.end,
      Productivity: `${s.productivity.toFixed(1)}%`,
      Tasks: s.tasks,
      Status: s.status,
    }))
    exportToCSV(data, `shift-history-${emp.id}`, ["Date", "Shift", "Start", "End", "Productivity", "Tasks", "Status"])
  }

  const handlePromote = () => {
    toast.success("Promotion Recommended", `${emp.name} flagged for senior role review.`)
    onPromote?.(emp)
  }

  const handleRecognize = () => {
    toast.info("Sending Kudos", `Public recognition being sent to ${emp.name} and team.`)
    onRecognize?.(emp)
  }

  const handleRefresh = () => {
    toast.info("Refreshing", `Re-fetching performance data for ${emp.name}…`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[680px] p-0 overflow-y-auto"
      >
        {/* Header strip */}
        <div className={cn(
          "sticky top-0 z-20 bg-gradient-to-br backdrop-blur-sm border-b prod-drawer-header",
          statusBg
        )}>
          <SheetHeader className="space-y-0 p-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "relative flex size-14 items-center justify-center rounded-2xl border-2 shadow-md prod-icon-pulse",
                  statusBg
                )}>
                  <Avatar className="size-10">
                    <AvatarFallback className={cn(
                      "text-sm font-bold",
                      isTop ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                      isLow ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" :
                      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    )}>
                      {emp.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {isTop && (
                    <div className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-amber-400 border-2 border-background flex items-center justify-center">
                      <Medal className="size-2.5 text-amber-900" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <SheetTitle className="text-lg font-semibold leading-tight flex items-center gap-2">
                    {emp.name}
                    {isTop && (
                      <Badge variant="outline" className="text-[10px] gap-1 text-amber-600 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:bg-amber-950/40">
                        <Trophy className="size-2.5" />
                        Rank #{emp.rank}
                      </Badge>
                    )}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-0.5">
                      <Briefcase className="size-2.5" /> {emp.role}
                    </span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="flex items-center gap-0.5">
                      <Building2 className="size-2.5" /> {emp.warehouse}
                    </span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="flex items-center gap-0.5">
                      <ShiftIcon className="size-2.5" /> {emp.shift}
                    </span>
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8" onClick={handleRefresh} title="Refresh data">
                  <RefreshCw className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={handleExport} title="Export summary">
                  <Download className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Hero metrics */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 prod-stat-enter" style={{ animationDelay: "0ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Productivity</p>
                <p className={cn("mt-0.5 text-sm font-bold text-number", statusColor)}>{emp.productivity}%</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 prod-stat-enter" style={{ animationDelay: "60ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Attendance</p>
                <p className="mt-0.5 text-sm font-bold text-number">{emp.attendance}%</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 prod-stat-enter" style={{ animationDelay: "120ms" }}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Tasks Done</p>
                <p className="mt-0.5 text-sm font-bold text-number">{emp.tasksCompleted}</p>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 prod-drawer-body-enter">

          {/* Performance radial + KPI grid */}
          <div className="rounded-lg border border-border/60 bg-card p-4 prod-card-enter">
            <div className="grid gap-4 md:grid-cols-[140px_1fr]">
              <div className="flex flex-col items-center">
                <ChartContainer
                  config={{ value: { label: "Productivity", color: "#2563EB" } }}
                  className="size-[120px]"
                >
                  <RadialBarChart data={radialData} innerRadius={45} outerRadius={60} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" background cornerRadius={8} />
                  </RadialBarChart>
                </ChartContainer>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className={cn("font-bold text-sm", statusColor)}>{emp.productivity}%</span> vs 85% target
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="size-3" />
                  Key Performance Indicators
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-border/40 bg-background/60 p-2.5">
                    <div className="flex items-center gap-1">
                      <Clock className="size-2.5 text-muted-foreground" />
                      <p className="text-[9px] uppercase text-muted-foreground">Overtime</p>
                    </div>
                    <p className="text-sm font-bold text-number mt-0.5">{emp.overtime}<span className="text-[10px] text-muted-foreground ml-0.5">h</span></p>
                  </div>
                  <div className="rounded-md border border-border/40 bg-background/60 p-2.5">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="size-2.5 text-muted-foreground" />
                      <p className="text-[9px] uppercase text-muted-foreground">Error Rate</p>
                    </div>
                    <p className={cn(
                      "text-sm font-bold text-number mt-0.5",
                      isError ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>{emp.errorRate}<span className="text-[10px] text-muted-foreground ml-0.5">%</span></p>
                  </div>
                  <div className="rounded-md border border-border/40 bg-background/60 p-2.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-2.5 text-muted-foreground" />
                      <p className="text-[9px] uppercase text-muted-foreground">Attendance</p>
                    </div>
                    <p className={cn(
                      "text-sm font-bold text-number mt-0.5",
                      emp.attendance >= 95 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                    )}>{emp.attendance}<span className="text-[10px] text-muted-foreground ml-0.5">%</span></p>
                  </div>
                  <div className="rounded-md border border-border/40 bg-background/60 p-2.5">
                    <div className="flex items-center gap-1">
                      <Trophy className="size-2.5 text-muted-foreground" />
                      <p className="text-[9px] uppercase text-muted-foreground">Rank</p>
                    </div>
                    <p className="text-sm font-bold text-number mt-0.5">#{emp.rank}<span className="text-[10px] text-muted-foreground ml-0.5"> / 247</span></p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" className="h-7 text-[10px] gap-1" onClick={handleRecognize}>
                    <Sparkles className="size-2.5" />
                    Recognize
                  </Button>
                  {isTop && (
                    <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={handlePromote}>
                      <TrendingUp className="size-2.5" />
                      Promote
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Weekly trend line chart */}
          <div className="rounded-lg border border-border/60 bg-card p-4 prod-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="size-3" />
                Weekly Productivity Trend
              </h3>
              <Badge variant="outline" className="text-[10px] gap-1">
                <span className={cn("size-1.5 rounded-full", isTop ? "bg-emerald-500" : "bg-blue-500")} />
                7-day rolling
              </Badge>
            </div>
            <ChartContainer
              config={{
                productivity: { label: "Productivity", color: "#2563EB" },
                target: { label: "Target", color: "#94A3B8" },
              }}
              className="h-[180px] w-full"
            >
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} domain={[50, 100]} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#2563EB", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94A3B8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Task breakdown bar chart */}
          <div className="rounded-lg border border-border/60 bg-card p-4 prod-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Target className="size-3" />
                Task Category Breakdown
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {taskCats.reduce((s, c) => s + c.count, 0)} total · vs target
              </span>
            </div>
            <ChartContainer
              config={{
                count: { label: "Completed", color: "#2563EB" },
                target: { label: "Target", color: "#E5E7EB" },
              }}
              className="h-[160px] w-full"
            >
              <BarChart data={tasksChartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#2563EB" radius={[3, 3, 0, 0]} />
                <Bar dataKey="target" fill="#E5E7EB" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {taskCats.map((cat, i) => {
                const pct = cat.target > 0 ? Math.round((cat.count / cat.target) * 100) : 0
                const achieved = pct >= 100
                const Icon = cat.icon
                return (
                  <div
                    key={cat.label}
                    className="rounded-md border border-border/40 bg-background/60 p-2 text-center prod-task-enter"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Icon className={cn("size-3 mx-auto mb-1", achieved ? "text-emerald-500" : "text-muted-foreground")} />
                    <p className="text-[9px] uppercase text-muted-foreground">{cat.label}</p>
                    <p className={cn(
                      "text-xs font-bold text-number mt-0.5",
                      achieved ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                    )}>{cat.count}</p>
                    <p className="text-[9px] text-muted-foreground">/ {cat.target}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Skills matrix */}
          <div className="rounded-lg border border-border/60 bg-card p-4 prod-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <GitBranch className="size-3" />
                Skills Matrix
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {skills.filter((s) => s.certified).length}/{skills.length} certified
              </span>
            </div>
            <div className="space-y-2.5">
              {skills.map((skill, i) => {
                const color = skill.level >= 85 ? "bg-emerald-500" :
                              skill.level >= 70 ? "bg-blue-500" :
                              skill.level >= 55 ? "bg-amber-500" : "bg-red-500"
                return (
                  <div
                    key={skill.label}
                    className="prod-skill-enter"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium">{skill.label}</span>
                        {skill.certified && (
                          <ShieldCheck className="size-3 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{skill.yearsExp}y exp</span>
                        <span className={cn(
                          "font-semibold",
                          skill.level >= 85 ? "text-emerald-600 dark:text-emerald-400" :
                          skill.level >= 70 ? "text-blue-600 dark:text-blue-400" :
                          skill.level >= 55 ? "text-amber-600 dark:text-amber-400" :
                          "text-red-600 dark:text-red-400"
                        )}>{skill.level}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full prod-fill-animate", color)}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Achievements / Badges */}
          <div className="rounded-lg border border-border/60 bg-card p-4 prod-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Award className="size-3" />
                Achievements & Badges
              </h3>
              <span className="text-[10px] text-muted-foreground">{achievements.length} earned</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {achievements.map((ach, i) => {
                const Icon = ach.icon
                return (
                  <div
                    key={ach.id}
                    className="prod-achievement-enter flex items-start gap-2.5 rounded-md border border-border/40 bg-background/60 p-2.5"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", ach.color)}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-tight">{ach.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{ach.detail}</p>
                      <p className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="size-2.5" />
                        {ach.date}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Shift History */}
          <div className="rounded-lg border border-border/60 bg-card p-4 prod-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <History className="size-3" />
                Recent Shift History
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] gap-1"
                onClick={handleExportShiftHistory}
              >
                <Download className="size-3" />
                Export
              </Button>
            </div>
            <div className="space-y-1.5">
              {shiftHistory.map((row, i) => {
                const ShiftIcon = row.shift === "Morning" ? Sunrise : row.shift === "Afternoon" ? Sun : Moon
                const statusBadge = row.status === "on-time"
                  ? <Badge variant="outline" className="text-[9px] gap-1 text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700"><CheckCircle2 className="size-2.5" />On Time</Badge>
                  : row.status === "overtime"
                  ? <Badge variant="outline" className="text-[9px] gap-1 text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-700"><Clock className="size-2.5" />Overtime</Badge>
                  : <Badge variant="outline" className="text-[9px] gap-1 text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700"><AlertTriangle className="size-2.5" />Late</Badge>
                const prodColor = row.productivity >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                                  row.productivity >= 75 ? "text-blue-600 dark:text-blue-400" :
                                  "text-amber-600 dark:text-amber-400"
                return (
                  <div
                    key={i}
                    className="prod-shift-row group flex items-center gap-3 rounded-md border border-border/40 bg-background/60 px-2.5 py-2"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60">
                      <ShiftIcon className="size-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium">{row.date}</p>
                        <span className="text-[10px] text-muted-foreground">{row.shift}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {row.start} – {row.end} · {row.tasks} tasks
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className={cn("text-xs font-bold text-number", prodColor)}>
                          {row.productivity.toFixed(1)}%
                        </p>
                      </div>
                      {statusBadge}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick info */}
          <div className="rounded-lg border border-border/60 bg-card p-4 prod-card-enter">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="size-3" />
              Employee Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <User className="size-2.5" /> Employee ID
                </p>
                <p className="text-xs font-mono mt-0.5">{emp.id}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Briefcase className="size-2.5" /> Role
                </p>
                <p className="text-xs font-medium mt-0.5">{emp.role}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <Building2 className="size-2.5" /> Warehouse
                </p>
                <p className="text-xs font-medium mt-0.5">{emp.warehouse}</p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-2">
                <p className="text-[9px] uppercase text-muted-foreground flex items-center gap-1">
                  <ShiftIcon className="size-2.5" /> Shift
                </p>
                <p className="text-xs font-medium mt-0.5">{emp.shift}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 pb-1 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground">
              ID: <span className="font-mono">{emp.id}</span> · Last sync: just now
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] gap-1"
              onClick={() => toast.info("Opening profile", `Loading full HR profile for ${emp.name}…`)}
            >
              <ChevronRight className="size-3" />
              View full profile
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
