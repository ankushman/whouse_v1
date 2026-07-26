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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts"
import {
  UserPlus,
  MessageSquare,
  Activity,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Star,
  Clock,
  Phone,
  Mail,
  Award,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  Target,
  Briefcase,
  GraduationCap,
  Flame,
  Trophy,
  RefreshCw,
  CalendarClock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Gauge,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import type { Employee } from "@/data/mock-data"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmployeeDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  onAssignTask?: (employee: Employee) => void
  onScheduleReview?: (employee: Employee) => void
}

interface TrendPoint {
  day: string
  score: number
  attendance: number
  errorRate: number
}

interface ActivityEntry {
  text: string
  time: string
  icon: React.ReactNode
  accent: string
}

interface TrainingCert {
  name: string
  progress: number
  expiry: string
  category: "Safety" | "Operations" | "Compliance" | "Technical"
}

interface Achievement {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  earned: boolean
  date?: string
}

interface PerformanceAlert {
  level: "warning" | "critical" | "info"
  title: string
  description: string
  icon: React.ReactNode
}

interface TaskEntry {
  id: string
  description: string
  status: "completed" | "in-progress" | "pending" | "overdue"
  priority: "low" | "medium" | "high"
  dueIn: string
  progress: number
}

// ---------------------------------------------------------------------------
// Deterministic helpers — derive stable mock data from employee.id
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function getTrendData(employee: Employee): TrendPoint[] {
  const base = employee.productivity
  const h = hashStr(employee.id)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day, i) => {
    const seed = (h >> i) & 0xff
    const variance = (seed % 11) - 5
    return {
      day,
      score: Math.max(40, Math.min(100, Math.round(base + variance))),
      attendance: Math.max(60, Math.min(100, Math.round(employee.attendance + (seed % 7) - 3))),
      errorRate: Number(Math.max(0, employee.errorRate + ((seed % 11) - 5) * 0.2).toFixed(1)),
    }
  })
}

function getActivities(employee: Employee): ActivityEntry[] {
  const h = hashStr(employee.id)
  const baseHour = 6 + (h % 4)
  const batchNo = 4500 + (h % 200)
  const zoneId = String.fromCharCode(65 + (h % 6))
  return [
    {
      text: `Completed picking batch #${batchNo}`,
      time: `${String(baseHour + 4).padStart(2, "0")}:${String(h % 60).padStart(2, "0")}`,
      icon: <CheckCircle2 className="size-3.5 text-emerald-500" />,
      accent: "bg-emerald-500",
    },
    {
      text: `Quality check passed for zone ${zoneId}`,
      time: `${String(baseHour + 3).padStart(2, "0")}:15`,
      icon: <Shield className="size-3.5 text-sky-500" />,
      accent: "bg-sky-500",
    },
    {
      text: "Started inventory cycle count",
      time: `${String(baseHour + 2).padStart(2, "0")}:42`,
      icon: <BarChart3 className="size-3.5 text-violet-500" />,
      accent: "bg-violet-500",
    },
    {
      text: "Break — returned on time",
      time: `${String(baseHour + 1).padStart(2, "0")}:00`,
      icon: <Clock className="size-3.5 text-amber-500" />,
      accent: "bg-amber-500",
    },
    {
      text: "Clocked in for Morning shift",
      time: `${String(baseHour).padStart(2, "0")}:00`,
      icon: <CalendarCheck className="size-3.5 text-blue-500" />,
      accent: "bg-blue-500",
    },
    {
      text: "Pre-shift equipment inspection completed",
      time: `${String(baseHour).padStart(2, "0") - 1 < 0 ? "23" : String(baseHour - 1).padStart(2, "0")}:45`,
      icon: <CheckCircle2 className="size-3.5 text-emerald-500" />,
      accent: "bg-emerald-500",
    },
  ]
}

function getTrainingCerts(employee: Employee): TrainingCert[] {
  const h = hashStr(employee.id)
  const baseCerts: TrainingCert[] = [
    {
      name: "Forklift Safety Operations",
      progress: 60 + (h % 35),
      expiry: `Dec ${(h % 28) + 1}, 2026`,
      category: "Safety",
    },
    {
      name: "Warehouse Management System",
      progress: 75 + (h % 20),
      expiry: `Mar ${(h % 28) + 1}, 2027`,
      category: "Technical",
    },
    {
      name: "OSHA Compliance Refresher",
      progress: 45 + (h % 40),
      expiry: `Sep ${(h % 28) + 1}, 2026`,
      category: "Compliance",
    },
    {
      name: "Hazardous Materials Handling",
      progress: 90 + (h % 10),
      expiry: `Jan ${(h % 28) + 1}, 2027`,
      category: "Safety",
    },
  ]
  // Role-specific additional cert
  if (employee.role.includes("Supervisor") || employee.role.includes("Coordinator")) {
    baseCerts.push({
      name: "Leadership & Team Management",
      progress: 70 + (h % 25),
      expiry: `Jun ${(h % 28) + 1}, 2027`,
      category: "Operations",
    })
  }
  if (employee.role.includes("Quality") || employee.role.includes("Inspector")) {
    baseCerts.push({
      name: "Six Sigma Yellow Belt",
      progress: 80 + (h % 15),
      expiry: `Aug ${(h % 28) + 1}, 2026`,
      category: "Operations",
    })
  }
  return baseCerts
}

function getAchievements(employee: Employee): Achievement[] {
  const h = hashStr(employee.id)
  return [
    {
      title: "Top Performer",
      description: "Highest productivity in shift",
      icon: <Trophy className="size-3.5" />,
      color: "from-amber-400 to-orange-500",
      earned: employee.productivity >= 90,
      date: employee.productivity >= 90 ? "This month" : undefined,
    },
    {
      title: "Perfect Attendance",
      description: "30 days without absence",
      icon: <CalendarCheck className="size-3.5" />,
      color: "from-emerald-400 to-green-500",
      earned: employee.attendance >= 98,
      date: employee.attendance >= 98 ? "Last 30 days" : undefined,
    },
    {
      title: "Quality Champion",
      description: "Error rate below 1%",
      icon: <Shield className="size-3.5" />,
      color: "from-sky-400 to-blue-500",
      earned: employee.errorRate < 1,
      date: employee.errorRate < 1 ? "This quarter" : undefined,
    },
    {
      title: "Task Master",
      description: "500+ tasks completed",
      icon: <Target className="size-3.5" />,
      color: "from-violet-400 to-purple-500",
      earned: employee.tasksCompleted >= 500,
      date: employee.tasksCompleted >= 500 ? `${employee.tasksCompleted} tasks` : undefined,
    },
    {
      title: "Safety Streak",
      description: "90 days incident-free",
      icon: <Flame className="size-3.5" />,
      color: "from-rose-400 to-red-500",
      earned: (h % 3) === 0,
      date: (h % 3) === 0 ? "90 days" : undefined,
    },
    {
      title: "Mentor",
      description: "Trained 5+ new hires",
      icon: <GraduationCap className="size-3.5" />,
      color: "from-indigo-400 to-violet-500",
      earned: employee.role.includes("Supervisor") || (h % 4) === 0,
      date: employee.role.includes("Supervisor") ? "Ongoing" : undefined,
    },
  ]
}

function getTodayTasks(employee: Employee): TaskEntry[] {
  const h = hashStr(employee.id)
  return [
    {
      id: `TASK-${employee.id}-1`,
      description: "Cycle count — Zone A inventory audit",
      status: "in-progress",
      priority: "high",
      dueIn: "2h 15m",
      progress: 65,
    },
    {
      id: `TASK-${employee.id}-2`,
      description: "Pick batch #4821 — 47 items",
      status: "completed",
      priority: "medium",
      dueIn: "Done",
      progress: 100,
    },
    {
      id: `TASK-${employee.id}-3`,
      description: "Quality inspection — Inbound shipment",
      status: "pending",
      priority: "medium",
      dueIn: "5h",
      progress: 0,
    },
    {
      id: `TASK-${employee.id}-4`,
      description: "Loading dock #3 staging",
      status: "completed",
      priority: "low",
      dueIn: "Done",
      progress: 100,
    },
    {
      id: `TASK-${employee.id}-5`,
      description: "Safety walk-through — Aisle 12-18",
      status: "overdue",
      priority: "high",
      dueIn: "Overdue 1h",
      progress: 30,
    },
    {
      id: `TASK-${employee.id}-6`,
      description: `Shift handover notes — ${employee.shift} shift`,
      status: "pending",
      priority: "low",
      dueIn: "End of shift",
      progress: 0,
    },
  ].filter((_, i) => (h >> i) & 0x1 || i < 4)
}

function getPerformanceAlerts(employee: Employee): PerformanceAlert[] {
  const alerts: PerformanceAlert[] = []
  if (employee.productivity < 80) {
    alerts.push({
      level: "critical",
      title: "Low Productivity",
      description: `Current productivity ${employee.productivity}% is below the 80% threshold. Consider coaching or workload review.`,
      icon: <TrendingDown className="size-4" />,
    })
  }
  if (employee.errorRate > 3) {
    alerts.push({
      level: "critical",
      title: "High Error Rate",
      description: `Error rate ${employee.errorRate}% exceeds 3% limit. Immediate retraining recommended.`,
      icon: <AlertTriangle className="size-4" />,
    })
  }
  if (employee.attendance < 90) {
    alerts.push({
      level: "warning",
      title: "Attendance Concern",
      description: `Attendance at ${employee.attendance}% is below the 90% target. HR follow-up suggested.`,
      icon: <CalendarClock className="size-4" />,
    })
  }
  if (employee.overtime > 20) {
    alerts.push({
      level: "warning",
      title: "High Overtime",
      description: `${employee.overtime}h overtime this period. Fatigue risk — review workload distribution.`,
      icon: <Clock className="size-4" />,
    })
  }
  if (alerts.length === 0) {
    alerts.push({
      level: "info",
      title: "Performance On Track",
      description: "All metrics are within healthy thresholds. No action required.",
      icon: <Sparkles className="size-4" />,
    })
  }
  return alerts
}

function getPerformanceBreakdown(employee: Employee) {
  return [
    { name: "Productivity", value: employee.productivity, fill: "#10B981" },
    { name: "Attendance", value: employee.attendance, fill: "#3B82F6" },
    { name: "Task Completion", value: Math.min(100, Math.round((employee.tasksCompleted / 1000) * 100)), fill: "#8B5CF6" },
    { name: "Quality", value: Math.max(0, 100 - employee.errorRate * 20), fill: "#F59E0B" },
  ]
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function shiftColor(shift: string): string {
  switch (shift) {
    case "Morning":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
    case "Afternoon":
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800"
    case "Night":
      return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800"
    default:
      return ""
  }
}

function PerformanceScoreRing({
  score,
  size = 96,
  strokeWidth = 7,
}: {
  score: number
  size?: number
  strokeWidth?: number
}) {
  const color = score >= 90 ? "#10B981" : score >= 75 ? "#F59E0B" : "#EF4444"
  const textColor =
    score >= 90 ? "text-emerald-600 dark:text-emerald-400"
    : score >= 75 ? "text-amber-600 dark:text-amber-400"
    : "text-red-600 dark:text-red-400"
  const label = score >= 90 ? "Excellent" : score >= 75 ? "Good" : "Needs Focus"
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const center = size / 2

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 health-ring-draw">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color}55)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-xl font-bold leading-none tabular-nums", textColor)}>
          {Math.round(score)}
        </span>
        <span className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wide">{label}</span>
      </div>
    </div>
  )
}

function getSkillSet(employee: Employee): { label: string; icon: React.ReactNode; color: string }[] {
  const base: { label: string; icon: React.ReactNode; color: string }[] = [
    { label: "Team Player", icon: <Star className="size-3" />, color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" },
    { label: "Safety Certified", icon: <CheckCircle2 className="size-3" />, color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
  ]
  const roleMap: Record<string, { label: string; icon: React.ReactNode; color: string }[]> = {
    "Warehouse Supervisor": [
      { label: "Team Lead", icon: <UserPlus className="size-3" />, color: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800" },
      { label: "Inventory Expert", icon: <BarChart3 className="size-3" />, color: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800" },
      { label: "SOP Trainer", icon: <GraduationCap className="size-3" />, color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800" },
    ],
    "Forklift Operator": [
      { label: "Forklift Certified", icon: <AlertTriangle className="size-3" />, color: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800" },
      { label: "Heavy Load Expert", icon: <BarChart3 className="size-3" />, color: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800" },
    ],
    "Inventory Analyst": [
      { label: "Picking Expert", icon: <CheckCircle2 className="size-3" />, color: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800" },
      { label: "Data Analytics", icon: <BarChart3 className="size-3" />, color: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800" },
      { label: "Audit Specialist", icon: <Activity className="size-3" />, color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800" },
    ],
    "Quality Inspector": [
      { label: "QA Certified", icon: <CheckCircle2 className="size-3" />, color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
      { label: "Audit Specialist", icon: <Activity className="size-3" />, color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800" },
      { label: "Compliance Expert", icon: <Shield className="size-3" />, color: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800" },
    ],
  }
  const roleSpecific = roleMap[employee.role] || [
    { label: "Operations Expert", icon: <Activity className="size-3" />, color: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800" },
  ]
  return [...base, ...roleSpecific.slice(0, 3)]
}

function statusBadge(s: TaskEntry["status"]) {
  switch (s) {
    case "completed":
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-[10px] gap-1"><CheckCircle2 className="size-2.5" />Done</Badge>
    case "in-progress":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 text-[10px] gap-1"><Activity className="size-2.5" />In Progress</Badge>
    case "pending":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 text-[10px] gap-1"><Clock className="size-2.5" />Pending</Badge>
    case "overdue":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 text-[10px] gap-1 critical-pulse-border"><AlertTriangle className="size-2.5" />Overdue</Badge>
  }
}

function priorityDot(p: TaskEntry["priority"]) {
  return p === "high" ? "bg-red-500" : p === "medium" ? "bg-amber-500" : "bg-slate-400"
}

function alertStyle(level: PerformanceAlert["level"]) {
  switch (level) {
    case "critical":
      return {
        wrapper: "border-red-200 dark:border-red-900 bg-red-50/80 dark:bg-red-950/40",
        icon: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950",
        title: "text-red-700 dark:text-red-300",
        body: "text-red-600/90 dark:text-red-400/90",
      }
    case "warning":
      return {
        wrapper: "border-amber-200 dark:border-amber-900 bg-amber-50/80 dark:bg-amber-950/40",
        icon: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950",
        title: "text-amber-700 dark:text-amber-300",
        body: "text-amber-600/90 dark:text-amber-400/90",
      }
    case "info":
      return {
        wrapper: "border-emerald-200 dark:border-emerald-900 bg-emerald-50/80 dark:bg-emerald-950/40",
        icon: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950",
        title: "text-emerald-700 dark:text-emerald-300",
        body: "text-emerald-600/90 dark:text-emerald-400/90",
      }
  }
}

function certCategoryColor(c: TrainingCert["category"]) {
  switch (c) {
    case "Safety":
      return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800"
    case "Operations":
      return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800"
    case "Compliance":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
    case "Technical":
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800"
  }
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function EmployeeDetailDrawer({
  open,
  onOpenChange,
  employee,
  onAssignTask,
  onScheduleReview,
}: EmployeeDetailDrawerProps) {
  const { toast } = useToast()

  const trendData = React.useMemo(() => (employee ? getTrendData(employee) : []), [employee])
  const activities = React.useMemo(() => (employee ? getActivities(employee) : []), [employee])
  const trainingCerts = React.useMemo(() => (employee ? getTrainingCerts(employee) : []), [employee])
  const achievements = React.useMemo(() => (employee ? getAchievements(employee) : []), [employee])
  const todayTasks = React.useMemo(() => (employee ? getTodayTasks(employee) : []), [employee])
  const alerts = React.useMemo(() => (employee ? getPerformanceAlerts(employee) : []), [employee])
  const breakdownData = React.useMemo(() => (employee ? getPerformanceBreakdown(employee) : []), [employee])
  const skills = React.useMemo(() => (employee ? getSkillSet(employee) : []), [employee])

  if (!employee) return null

  const emp = employee
  const productivityTrend = trendData.length >= 2 ? trendData[trendData.length - 1].score - trendData[0].score : 0
  const completedTasksToday = todayTasks.filter(t => t.status === "completed").length
  const overdueTasksToday = todayTasks.filter(t => t.status === "overdue").length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[640px] p-0 overflow-y-auto"
      >
        {/* Header strip with gradient */}
        <div className="sticky top-0 z-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm border-b border-border/40 emp-drawer-header">
          <SheetHeader className="space-y-0 p-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="size-16 border-2 border-background shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-base font-bold text-primary-foreground">
                      {emp.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center emp-online-pulse">
                    <div className="size-1.5 rounded-full bg-white" />
                  </div>
                </div>
                <div>
                  <SheetTitle className="text-lg font-semibold leading-tight flex items-center gap-2">
                    {emp.name}
                    <Badge variant="outline" className="text-[9px] gap-1 font-mono">
                      <Briefcase className="size-2.5" />
                      {emp.id}
                    </Badge>
                  </SheetTitle>
                  <SheetDescription className="text-sm mt-1 flex items-center gap-2">
                    <span className="font-medium text-foreground/80">{emp.role}</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="flex items-center gap-1">
                      <CalendarClock className="size-3" />
                      {emp.warehouse} WH
                    </span>
                  </SheetDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={cn("text-[10px] rounded-full gap-1", shiftColor(emp.shift))}>
                      <Clock className="size-2.5" />
                      {emp.shift} Shift
                    </Badge>
                    <Badge variant="outline" className="text-[10px] rounded-full gap-1 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                      <Trophy className="size-2.5" />
                      Rank #{emp.rank}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] rounded-full gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                      <Zap className="size-2.5" />
                      {emp.overtime}h OT
                    </Badge>
                  </div>
                </div>
              </div>
              <PerformanceScoreRing score={emp.productivity} />
            </div>

            {/* Action button row */}
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                className="gap-1.5 h-7 text-xs flex-1"
                onClick={() => {
                  if (onAssignTask) {
                    onAssignTask(emp)
                  } else {
                    toast({
                      title: "Task assigned",
                      description: `New task assigned to ${emp.name}`,
                    })
                  }
                }}
              >
                <UserPlus className="size-3.5" />
                Assign Task
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-7 text-xs flex-1"
                onClick={() => toast({ title: "Message sent", description: `Message delivered to ${emp.name}` })}
              >
                <MessageSquare className="size-3.5" />
                Message
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-7 text-xs flex-1"
                onClick={() => {
                  if (onScheduleReview) {
                    onScheduleReview(emp)
                  } else {
                    toast({ title: "Review scheduled", description: `Performance review for ${emp.name} scheduled` })
                  }
                }}
              >
                <CalendarClock className="size-3.5" />
                Review
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 h-7 text-xs px-2"
                onClick={() => toast({ title: "Calling", description: `Dialing ${emp.name}…` })}
              >
                <Phone className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 h-7 text-xs px-2"
                onClick={() => toast({ title: "Email", description: `Composing email to ${emp.name}…` })}
              >
                <Mail className="size-3.5" />
              </Button>
            </div>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 emp-drawer-body-enter">
          {/* Performance Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <AlertTriangle className="size-3" />
                Performance Alerts
              </h3>
              <div className="space-y-2">
                {alerts.map((alert, i) => {
                  const s = alertStyle(alert.level)
                  return (
                    <div
                      key={i}
                      className={cn("rounded-lg border px-3 py-2 flex items-start gap-2.5 emp-alert-enter", s.wrapper)}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className={cn("flex size-6 shrink-0 items-center justify-center rounded-md mt-0.5", s.icon)}>
                        {alert.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-xs font-semibold", s.title)}>{alert.title}</p>
                        <p className={cn("text-[11px] leading-snug mt-0.5", s.body)}>{alert.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              {
                label: "Productivity",
                value: `${emp.productivity}%`,
                icon: <Activity className="size-3.5" />,
                tint: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
                trend: productivityTrend >= 0 ? "up" as const : "down" as const,
                trendVal: `${productivityTrend >= 0 ? "+" : ""}${productivityTrend} pts`,
              },
              {
                label: "Attendance",
                value: `${emp.attendance}%`,
                icon: <CalendarCheck className="size-3.5" />,
                tint: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
                trend: emp.attendance >= 95 ? "up" as const : "down" as const,
                trendVal: emp.attendance >= 95 ? "above 95%" : "below target",
              },
              {
                label: "Tasks Done",
                value: emp.tasksCompleted.toLocaleString("en-IN"),
                icon: <CheckCircle2 className="size-3.5" />,
                tint: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
                trend: "up" as const,
                trendVal: `${completedTasksToday} today`,
              },
              {
                label: "Error Rate",
                value: `${emp.errorRate}%`,
                icon: <AlertTriangle className="size-3.5" />,
                tint: emp.errorRate > 3 ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400" : emp.errorRate > 1.5 ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
                trend: emp.errorRate < 1.5 ? "up" as const : "down" as const,
                trendVal: emp.errorRate < 1.5 ? "low" : "elevated",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-lg border border-border/60 bg-card p-2.5 emp-stat-card-hover",
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={cn("flex size-6 items-center justify-center rounded", stat.tint)}>
                    {stat.icon}
                  </div>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="size-3 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="size-3 text-red-500" />
                  )}
                </div>
                <p className="text-base font-bold text-foreground tabular-nums leading-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
                <p className={cn(
                  "text-[10px] mt-0.5 tabular-nums",
                  stat.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                )}>
                  {stat.trendVal}
                </p>
              </div>
            ))}
          </div>

          {/* Performance Breakdown — Radial bars */}
          <div className="rounded-lg border border-border/60 bg-card p-4 emp-card-enter">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Performance Breakdown
                </h3>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                  Multi-dimensional score across 4 metrics
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] gap-1 bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800">
                <Gauge className="size-2.5" />
                Composite
              </Badge>
            </div>
            <div className="grid grid-cols-[1fr_140px] gap-4 items-center">
              <ChartContainer
                config={{}}
                className="h-[120px] w-full"
              >
                <RadialBarChart
                  data={breakdownData}
                  innerRadius="30%"
                  outerRadius="100%"
                  barSize={9}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" background cornerRadius={4} />
                </RadialBarChart>
              </ChartContainer>
              <div className="space-y-1.5">
                {breakdownData.map((b) => (
                  <div key={b.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: b.fill }} />
                      <span className="text-[11px] text-muted-foreground truncate">{b.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold tabular-nums text-foreground">
                      {Math.round(b.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7-Day Productivity Trend */}
          <div className="rounded-lg border border-border/60 bg-card p-4 emp-card-enter">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  7-Day Productivity Trend
                </h3>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                  {productivityTrend >= 0
                    ? `Trending up by ${productivityTrend} points this week`
                    : `Trending down by ${Math.abs(productivityTrend)} points this week`}
                </p>
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                productivityTrend >= 0
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300"
              )}>
                {productivityTrend >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {Math.abs(productivityTrend)} pts
              </div>
            </div>
            <ChartContainer
              config={{
                score: { label: "Productivity", color: "#10B981" },
                attendance: { label: "Attendance", color: "#3B82F6" },
              }}
              className="h-[140px] w-full"
            >
              <AreaChart data={trendData} margin={{ left: -20, right: 4, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="prodFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  domain={[60, 100]}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#3B82F6"
                  strokeWidth={1.5}
                  fill="url(#attFill)"
                  strokeDasharray="4 3"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#prodFill)"
                  dot={{ r: 2.5, fill: "#10B981" }}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Skills & Certifications */}
          <div className="rounded-lg border border-border/60 bg-card p-4 emp-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Award className="size-3" />
                Skills & Certifications
              </h3>
              <span className="text-[10px] text-muted-foreground">{skills.length} active</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <Badge
                  key={skill.label}
                  variant="outline"
                  className={cn("gap-1.5 rounded-full text-[11px] font-medium emp-skill-enter", skill.color)}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {skill.icon}
                  {skill.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="rounded-lg border border-border/60 bg-card p-4 emp-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Target className="size-3" />
                Today's Tasks
              </h3>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-emerald-600 dark:text-emerald-400">{completedTasksToday} done</span>
                {overdueTasksToday > 0 && (
                  <span className="text-red-600 dark:text-red-400">· {overdueTasksToday} overdue</span>
                )}
                <span className="text-muted-foreground">· {todayTasks.length} total</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {todayTasks.map((task, i) => (
                <div
                  key={task.id}
                  className="flex items-start gap-2.5 rounded-md border border-border/40 bg-background/60 p-2 emp-task-row-hover"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className={cn("size-1.5 rounded-full mt-1.5 shrink-0", priorityDot(task.priority))} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-foreground leading-snug truncate">{task.description}</p>
                      {statusBadge(task.status)}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden max-w-[200px]">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            task.status === "completed" ? "bg-emerald-500"
                            : task.status === "in-progress" ? "bg-blue-500"
                            : task.status === "overdue" ? "bg-red-500"
                            : "bg-muted-foreground/30"
                          )}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">{task.dueIn}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-lg border border-border/60 bg-card p-4 emp-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Trophy className="size-3" />
                Achievements
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {achievements.filter(a => a.earned).length}/{achievements.length} earned
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {achievements.map((ach, i) => (
                <div
                  key={ach.title}
                  className={cn(
                    "relative rounded-lg border p-2.5 flex items-start gap-2 emp-ach-enter",
                    ach.earned
                      ? "border-border/60 bg-background"
                      : "border-dashed border-border/40 bg-muted/30 opacity-60"
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md text-white",
                    ach.earned ? `bg-gradient-to-br ${ach.color}` : "bg-muted-foreground/30"
                  )}>
                    {ach.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground leading-tight">{ach.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{ach.description}</p>
                    {ach.earned && ach.date && (
                      <p className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                        ✓ {ach.date}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training & Certifications Progress */}
          <div className="rounded-lg border border-border/60 bg-card p-4 emp-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <GraduationCap className="size-3" />
                Training Progress
              </h3>
              <span className="text-[10px] text-muted-foreground">{trainingCerts.length} active</span>
            </div>
            <div className="space-y-2.5">
              {trainingCerts.map((cert, i) => (
                <div
                  key={cert.name}
                  className="emp-cert-row"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Badge variant="outline" className={cn("text-[9px] gap-0.5 px-1", certCategoryColor(cert.category))}>
                        {cert.category}
                      </Badge>
                      <p className="text-xs text-foreground truncate">{cert.name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
                        <CalendarClock className="size-2.5 inline mr-0.5" />
                        {cert.expiry}
                      </span>
                      <span className={cn(
                        "text-[10px] font-semibold tabular-nums",
                        cert.progress >= 80 ? "text-emerald-600 dark:text-emerald-400"
                        : cert.progress >= 50 ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                      )}>
                        {cert.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        cert.progress >= 80 ? "bg-emerald-500"
                        : cert.progress >= 50 ? "bg-amber-500"
                        : "bg-red-500"
                      )}
                      style={{ width: `${cert.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="rounded-lg border border-border/60 bg-card p-4 emp-card-enter">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="size-3" />
                Today's Activity
              </h3>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-muted-foreground">
                View full log
                <ChevronRight className="size-3" />
              </Button>
            </div>
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-border/60 via-border/40 to-transparent" />
              <div className="space-y-3">
                {activities.map((act, i) => (
                  <div
                    key={i}
                    className="relative flex items-start gap-3 emp-activity-enter"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className={cn(
                      "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-background border-2",
                      act.accent.replace("bg-", "border-")
                    )}>
                      <div className={cn("size-2 rounded-full", act.accent)} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-xs text-foreground leading-snug">{act.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="size-2.5" />
                        {act.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 pb-1 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground">
              Employee ID: <span className="font-mono">{emp.id}</span> · Last sync: just now
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] gap-1"
              onClick={() => toast({ title: "Refreshing", description: `Re-fetching ${emp.name}'s data…` })}
            >
              <RefreshCw className="size-3" />
              Refresh
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
