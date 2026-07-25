"use client"

import { useMemo, useState } from "react"
import { employees, manpowerProductivity } from "@/data/mock-data"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  Users,
  Award,
  TrendingUp,
  Clock,
  Star,
  Medal,
  BarChart3,
  Sun,
  Moon,
  Sunrise,
} from "lucide-react"
import { cn } from "@/lib/utils"

const manpowerChartConfig = {
  morning: { label: "Morning", color: "#2563EB" },
  afternoon: { label: "Afternoon", color: "#10B981" },
  night: { label: "Night", color: "#F59E0B" },
}

const shiftIcons: Record<string, typeof Sun> = {
  Morning: Sunrise,
  Afternoon: Sun,
  Night: Moon,
}

export function ProductivityView() {
  const [warehouseFilter, setWarehouseFilter] = useState("all")

  const filtered = useMemo(() => {
    if (warehouseFilter === "all") return employees
    return employees.filter((e) => e.warehouse.includes(warehouseFilter))
  }, [warehouseFilter])

  const summary = useMemo(() => {
    const avg = (arr: number[]) => arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0
    return {
      overall: avg(employees.map((e) => e.productivity)).toFixed(1),
      morning: avg(manpowerProductivity.map((d) => d.morning)).toFixed(1),
      afternoon: avg(manpowerProductivity.map((d) => d.afternoon)).toFixed(1),
      night: avg(manpowerProductivity.map((d) => d.night)).toFixed(1),
    }
  }, [])

  const topPerformers = useMemo(() =>
    [...employees].sort((a, b) => a.rank - b.rank).slice(0, 5),
  [])

  const lowPerformers = useMemo(() =>
    [...employees].sort((a, b) => b.rank - a.rank).slice(0, 5),
  [])

  const warehouseData = useMemo(() => {
    const whMap: Record<string, { name: string; morning: number[]; afternoon: number[]; night: number[] }> = {}
    employees.forEach((e) => {
      const shift = e.shift
      if (!whMap[e.warehouse]) whMap[e.warehouse] = { name: e.warehouse, morning: [], afternoon: [], night: [] }
      if (shift === "Morning") whMap[e.warehouse].morning.push(e.productivity)
      else if (shift === "Afternoon") whMap[e.warehouse].afternoon.push(e.productivity)
      else whMap[e.warehouse].night.push(e.productivity)
    })
    return Object.values(whMap).map((w) => ({
      name: w.name.length > 15 ? w.name.slice(0, 15) + "..." : w.name,
      morning: w.morning.length > 0 ? +(w.morning.reduce((a, b) => a + b, 0) / w.morning.length).toFixed(1) : 0,
      afternoon: w.afternoon.length > 0 ? +(w.afternoon.reduce((a, b) => a + b, 0) / w.afternoon.length).toFixed(1) : 0,
      night: w.night.length > 0 ? +(w.night.reduce((a, b) => a + b, 0) / w.night.length).toFixed(1) : 0,
    }))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productivity"
        description="Workforce productivity analysis and benchmarks"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 stagger-children">
        {[
          { label: "Overall Productivity", value: `${summary.overall}%`, icon: TrendingUp, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "Morning Shift", value: `${summary.morning}%`, icon: Sunrise, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "Afternoon Shift", value: `${summary.afternoon}%`, icon: Sun, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
          { label: "Night Shift", value: `${summary.night}%`, icon: Moon, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
        ].map((item) => (
          <Card key={item.label} className="card-depth rounded-xl border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", item.color)}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Shift Productivity Chart */}
      <Card className="card-accent-blue card-shine rounded-xl border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Shift-wise Productivity</CardTitle>
          <CardDescription className="text-xs">Daily productivity by shift</CardDescription>
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

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Warehouse Heatmap */}
        <Card className="card-depth card-shine rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Warehouse × Shift Heatmap</CardTitle>
            <CardDescription className="text-xs">Productivity % by warehouse and shift</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-[10px] font-medium text-muted-foreground px-2">
                <div>Warehouse</div>
                <div className="text-center">Morning</div>
                <div className="text-center">Afternoon</div>
                <div className="text-center">Night</div>
              </div>
              {warehouseData.map((wh) => (
                <div key={wh.name} className="grid grid-cols-4 gap-2 items-center rounded-lg border px-2 py-2">
                  <div className="text-xs font-medium truncate">{wh.name}</div>
                  {["morning", "afternoon", "night"].map((shift) => {
                    const val = wh[shift as keyof typeof wh] as number
                    const bg = val >= 85 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : val >= 70 ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                    return (
                      <div key={shift} className={cn("rounded-md px-2 py-1.5 text-center text-xs font-semibold", bg)}>
                        {val}%
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top & Low Performers */}
        <Card className="card-depth rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top Performers</CardTitle>
            <CardDescription className="text-xs">Ranked by productivity score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPerformers.map((emp, idx) => {
              const rankIcon = idx === 0 ? <Medal className="h-4 w-4 text-amber-500" /> : idx === 1 ? <Medal className="h-4 w-4 text-slate-400" /> : idx === 2 ? <Medal className="h-4 w-4 text-amber-700" /> : <span className="text-xs text-muted-foreground">#{emp.rank}</span>
              return (
                <div key={emp.id} className="flex items-center gap-3 rounded-lg border p-2.5 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-center w-6">{rankIcon}</div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px]">{emp.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{emp.name}</p>
                    <p className="text-[10px] text-muted-foreground">{emp.role} • {emp.warehouse}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", emp.productivity >= 90 ? "text-emerald-600" : "text-foreground")}>{emp.productivity}%</p>
                    <p className="text-[10px] text-muted-foreground">{emp.tasksCompleted} tasks</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
