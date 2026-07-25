"use client"

import { useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis } from "recharts"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Employee } from "@/data/mock-data"

// ---- Types ----

interface EmployeeDetailModalProps {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ---- Mock skill/ activity data generators ----

function getEmployeeSkills(employee: Employee): { label: string; icon: React.ReactNode; color: string }[] {
  // Assign skills based on role
  const baseSkills: { label: string; icon: React.ReactNode; color: string }[] = [
    { label: "Team Player", icon: <Star className="size-3" />, color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" },
    { label: "Safety Certified", icon: <CheckCircle2 className="size-3" />, color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
  ]

  const roleSkills: Record<string, { label: string; icon: React.ReactNode; color: string }[]> = {
    "Warehouse Supervisor": [
      { label: "Team Lead", icon: <UserPlus className="size-3" />, color: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800" },
      { label: "Inventory Expert", icon: <BarChart3 className="size-3" />, color: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800" },
      { label: "SOP Trainer", icon: <Activity className="size-3" />, color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800" },
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
    "Picker": [
      { label: "Picking Expert", icon: <CheckCircle2 className="size-3" />, color: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800" },
      { label: "Speed Optimizer", icon: <Activity className="size-3" />, color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800" },
    ],
    "Packer": [
      { label: "Packaging Expert", icon: <Star className="size-3" />, color: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800" },
      { label: "Quality Check", icon: <CheckCircle2 className="size-3" />, color: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800" },
    ],
    "Quality Inspector": [
      { label: "QA Certified", icon: <CheckCircle2 className="size-3" />, color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
      { label: "Audit Specialist", icon: <Activity className="size-3" />, color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800" },
      { label: "Compliance Expert", icon: <AlertTriangle className="size-3" />, color: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800" },
    ],
    "Loading Clerk": [
      { label: "Dock Operations", icon: <BarChart3 className="size-3" />, color: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800" },
      { label: "Forklift Certified", icon: <AlertTriangle className="size-3" />, color: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800" },
    ],
    "Shipping Coordinator": [
      { label: "Logistics Expert", icon: <Activity className="size-3" />, color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800" },
      { label: "Route Planner", icon: <BarChart3 className="size-3" />, color: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800" },
    ],
  }

  const roleSpecific = roleSkills[employee.role] || [
    { label: "Operations Expert", icon: <Activity className="size-3" />, color: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800" },
  ]

  return [...baseSkills, ...roleSpecific.slice(0, 3)]
}

function getRecentActivities(employee: Employee): { text: string; time: string; icon: React.ReactNode }[] {
  // Deterministic mock activities based on employee id
  const hash = employee.id.charCodeAt(employee.id.length - 1)
  const baseHour = 6 + (hash % 4)
  return [
    {
      text: `Completed picking batch #${4500 + (hash % 200)}`,
      time: `${String(baseHour + 4).padStart(2, "0")}:${hash % 60 < 10 ? "0" : ""}${hash % 60}`,
      icon: <CheckCircle2 className="size-3.5 text-emerald-500" />,
    },
    {
      text: "Started inventory cycle count",
      time: `${String(baseHour + 3).padStart(2, "0")}:15`,
      icon: <BarChart3 className="size-3.5 text-sky-500" />,
    },
    {
      text: "Quality check passed for zone B",
      time: `${String(baseHour + 2).padStart(2, "0")}:42`,
      icon: <CheckCircle2 className="size-3.5 text-emerald-500" />,
    },
    {
      text: "Break — returned on time",
      time: `${String(baseHour + 1).padStart(2, "0")}:00`,
      icon: <Clock className="size-3.5 text-muted-foreground" />,
    },
    {
      text: "Started shift",
      time: `${String(baseHour).padStart(2, "0")}:00`,
      icon: <CalendarCheck className="size-3.5 text-amber-500" />,
    },
  ]
}

function getPerformanceTrend(employee: Employee) {
  // Generate deterministic 7-day productivity trend from employee data
  const base = employee.productivity
  return [
    { day: "Mon", score: Math.round(base - 3 + (employee.id.charCodeAt(4) % 5)) },
    { day: "Tue", score: Math.round(base - 1 + (employee.id.charCodeAt(5) % 4)) },
    { day: "Wed", score: Math.round(base - 2 + (employee.id.charCodeAt(6) % 6)) },
    { day: "Thu", score: Math.round(base + 1 - (employee.id.charCodeAt(3) % 3)) },
    { day: "Fri", score: Math.round(base + 2 - (employee.id.charCodeAt(2) % 4)) },
    { day: "Sat", score: Math.round(base - 1 + (employee.id.charCodeAt(1) % 5)) },
    { day: "Sun", score: Math.round(base) },
  ]
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

function getScoreRingStatus(score: number): { color: string; textColor: string } {
  if (score >= 90) return { color: "#10B981", textColor: "text-emerald-600 dark:text-emerald-400" }
  if (score >= 75) return { color: "#F59E0B", textColor: "text-amber-600 dark:text-amber-400" }
  return { color: "#EF4444", textColor: "text-red-600 dark:text-red-400" }
}

// ---- Performance Score Ring (simplified from HealthScoreRing) ----

function PerformanceScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
}: {
  score: number
  size?: number
  strokeWidth?: number
}) {
  const { color, textColor } = getScoreRingStatus(score)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const center = size / 2

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
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
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-base font-bold leading-none", textColor)}>
          {Math.round(score)}
        </span>
        <span className="text-[9px] text-muted-foreground mt-0.5">Score</span>
      </div>
    </div>
  )
}

// ---- Main Component ----

export function EmployeeDetailModal({
  employee,
  open,
  onOpenChange,
}: EmployeeDetailModalProps) {
  const skills = useMemo(
    () => (employee ? getEmployeeSkills(employee) : []),
    [employee]
  )
  const activities = useMemo(
    () => (employee ? getRecentActivities(employee) : []),
    [employee]
  )
  const trendData = useMemo(
    () => (employee ? getPerformanceTrend(employee) : []),
    [employee]
  )

  const sparklineConfig = {
    score: { label: "Productivity", color: "#10B981" },
  }

  if (!employee) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header with gradient */}
        <DialogHeader className="relative bg-gradient-to-br from-muted/80 to-muted/40 px-6 pt-6 pb-4 rounded-b-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 border-2 border-background shadow-md">
                <AvatarFallback className="text-sm font-bold bg-primary text-primary-foreground">
                  {employee.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg font-semibold leading-tight">
                  {employee.name}
                </DialogTitle>
                <DialogDescription className="text-sm mt-0.5">
                  {employee.role}
                </DialogDescription>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className={cn("text-[10px] rounded-full", shiftColor(employee.shift))}>
                    {employee.shift} Shift
                  </Badge>
                  <span className="text-xs text-muted-foreground">{employee.warehouse} WH</span>
                </div>
              </div>
            </div>
            <PerformanceScoreRing score={employee.productivity} />
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="py-0 gap-0 border-border/60">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60">
                  <Activity className="size-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Productivity</p>
                  <p className={cn(
                    "text-base font-bold tabular-nums leading-tight",
                    employee.productivity >= 90 ? "text-emerald-600" : employee.productivity >= 80 ? "text-amber-600" : "text-red-600"
                  )}>
                    {employee.productivity}%
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="py-0 gap-0 border-border/60">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/60">
                  <CalendarCheck className="size-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attendance</p>
                  <p className="text-base font-bold tabular-nums leading-tight">
                    {employee.attendance}%
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="py-0 gap-0 border-border/60">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/60">
                  <CheckCircle2 className="size-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tasks Done</p>
                  <p className="text-base font-bold tabular-nums leading-tight">
                    {employee.tasksCompleted}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="py-0 gap-0 border-border/60">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/60">
                  <AlertTriangle className="size-4 text-red-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Error Rate</p>
                  <p className={cn(
                    "text-base font-bold tabular-nums leading-tight",
                    employee.errorRate > 3 ? "text-red-600" : employee.errorRate > 1.5 ? "text-amber-600" : "text-foreground"
                  )}>
                    {employee.errorRate}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="opacity-60" />

          {/* Skills Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              Skills & Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill.label}
                  variant="outline"
                  className={cn("gap-1.5 rounded-full text-[11px] font-medium", skill.color)}
                >
                  {skill.icon}
                  {skill.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="opacity-60" />

          {/* Performance Trend Sparkline */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              7-Day Productivity Trend
            </h3>
            <ChartContainer
              config={sparklineConfig}
              className="h-[80px] w-full"
            >
              <LineChart
                data={trendData}
                margin={{ left: -20, right: -10, top: 5, bottom: -20 }}
              >
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  domain={["dataMin - 5", "dataMax + 5"]}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-score)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-score)" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          <Separator className="opacity-60" />

          {/* Recent Activity */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              Recent Activity
            </h3>
            <div className="space-y-2.5">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted/60 mt-0.5">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">{activity.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="opacity-60" />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1 pb-1">
            <Button className="flex-1 gap-2" size="sm">
              <UserPlus className="size-4" />
              Assign Task
            </Button>
            <Button variant="outline" className="flex-1 gap-2" size="sm">
              <MessageSquare className="size-4" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
