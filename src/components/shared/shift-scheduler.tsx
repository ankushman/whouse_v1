"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Sun, Sunset, Moon, Users, Clock, ShieldCheck } from "lucide-react"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

type ShiftType = "morning" | "afternoon" | "night"

interface ShiftConfig {
  key: ShiftType
  label: string
  time: string
  icon: typeof Sun
  colorClass: string
  bgClass: string
  borderClass: string
  dotClass: string
  badgeClass: string
}

const SHIFTS: ShiftConfig[] = [
  {
    key: "morning",
    label: "Morning",
    time: "6AM – 2PM",
    icon: Sun,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/40",
    borderClass: "border-amber-200 dark:border-amber-800",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  {
    key: "afternoon",
    label: "Afternoon",
    time: "2PM – 10PM",
    icon: Sunset,
    colorClass: "text-sky-600 dark:text-sky-400",
    bgClass: "bg-sky-50 dark:bg-sky-950/40",
    borderClass: "border-sky-200 dark:border-sky-800",
    dotClass: "bg-sky-500",
    badgeClass: "bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
  },
  {
    key: "night",
    label: "Night",
    time: "10PM – 6AM",
    icon: Moon,
    colorClass: "text-violet-600 dark:text-violet-400",
    bgClass: "bg-violet-50 dark:bg-violet-950/40",
    borderClass: "border-violet-200 dark:border-violet-800",
    dotClass: "bg-violet-500",
    badgeClass: "bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  },
]

// Determine current active shift based on the hour of the day
function getActiveShift(): ShiftType {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 14) return "morning"
  if (hour >= 14 && hour < 22) return "afternoon"
  return "night"
}

// Generate mock employee counts per shift per day (week)
function generateWeekData() {
  const activeShift = getActiveShift()
  const data: Record<ShiftType, number[]> = {
    morning: [15, 14, 16, 15, 13, 8, 6],
    afternoon: [12, 11, 13, 12, 10, 6, 5],
    night: [5, 5, 4, 5, 4, 3, 2],
  }
  return { data, activeShift }
}

export function ShiftScheduler() {
  const { data, activeShift } = useMemo(() => generateWeekData(), [])

  // Total coverage: sum of all shifts for the whole week / (168 hours * ideal_ratio)
  const totalEmployees = Object.values(data).flat().reduce((a, b) => a + b, 0)
  const maxPossible = 21 * 20 // 21 shift-slots * 20 ideal
  const coveragePercent = Math.min(100, Math.round((totalEmployees / maxPossible) * 100))

  return (
    <div className="space-y-4">
      {/* Shift Coverage Summary Card */}
      <Card className="card-depth">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60">
                <ShieldCheck className="size-4.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Shift Coverage</p>
                <p className="text-xs text-muted-foreground">
                  {totalEmployees} staff-hours allocated this week
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {SHIFTS.map((shift) => {
                const total = data[shift.key].reduce((a, b) => a + b, 0)
                const isActive = activeShift === shift.key
                return (
                  <div key={shift.key} className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "size-2 rounded-full",
                        shift.dotClass,
                        isActive && "status-dot-pulse"
                      )}
                    />
                    <span className={cn(
                      "text-xs tabular-nums",
                      isActive ? "font-semibold" : "text-muted-foreground"
                    )}>
                      {total}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground">Total Hours Coverage</span>
              <span className="text-[11px] font-semibold tabular-nums">{coveragePercent}%</span>
            </div>
            <Progress value={coveragePercent} className="h-1.5 progress-animated" />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Timeline View */}
      <Card className="card-depth">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Weekly Shift Timeline</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-normal">
              <Users className="mr-1 size-3" />
              {totalEmployees} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          {/* Day Headers */}
          <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-1 mb-2">
            <div />
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Shift Rows */}
          {SHIFTS.map((shift) => {
            const Icon = shift.icon
            const isActive = activeShift === shift.key
            return (
              <div
                key={shift.key}
                className={cn(
                  "grid grid-cols-[100px_repeat(7,1fr)] gap-1 mb-2 rounded-lg p-2 transition-colors",
                  isActive ? shift.bgClass : ""
                )}
              >
                {/* Shift Label */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md",
                    isActive
                      ? cn(shift.badgeClass)
                      : "bg-muted/60 text-muted-foreground"
                  )}>
                    <Icon className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className={cn(
                      "text-xs font-medium leading-tight truncate",
                      isActive && shift.colorClass
                    )}>
                      {shift.label}
                    </p>
                    <p className="text-[9px] text-muted-foreground leading-tight">
                      {shift.time}
                    </p>
                  </div>
                </div>

                {/* Day Cells */}
                {data[shift.key].map((count, idx) => {
                  const intensity = Math.min(1, count / 18)
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "relative flex items-center justify-center h-10 rounded-md border transition-all",
                        isActive
                          ? cn(shift.borderClass, "shadow-sm")
                          : "border-border/50 hover:border-border"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-semibold tabular-nums",
                        isActive ? shift.colorClass : "text-foreground"
                      )}>
                        {count}
                      </span>
                      {/* Subtle fill bar at bottom */}
                      <div
                        className={cn(
                          "absolute bottom-0 left-1 right-1 h-1 rounded-full opacity-40",
                          shift.dotClass
                        )}
                        style={{ width: `${Math.max(20, intensity * 100)}%` }}
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t">
            {SHIFTS.map((shift) => {
              const Icon = shift.icon
              const isActive = activeShift === shift.key
              return (
                <div key={shift.key} className="flex items-center gap-1.5">
                  <Icon className={cn("size-3", shift.colorClass)} />
                  <span className={cn(
                    "text-[10px]",
                    isActive ? "font-semibold" : "text-muted-foreground"
                  )}>
                    {shift.label}
                    {isActive && (
                      <span className="ml-1 inline-flex items-center gap-1">
                        <span className="size-1.5 rounded-full status-dot-pulse" style={{ background: 'oklch(0.627 0.194 149)' }} />
                        <span className="text-emerald-600 dark:text-emerald-400">Active</span>
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
