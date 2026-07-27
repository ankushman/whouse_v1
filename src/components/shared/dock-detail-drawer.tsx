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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  PackageCheck,
  Timer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Wrench,
  RotateCcw,
  Play,
  Pause,
  Building2,
  Zap,
  Activity,
  History,
  TrendingUp,
  TrendingDown,
  Gauge,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  Share2,
  Boxes,
  Fuel,
  Settings,
  Lock,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DockStatus = "available" | "occupied" | "maintenance" | "reserved"
export type ShipmentType = "inbound" | "outbound"

export interface DockDetail {
  id: string
  name: string
  type: "inbound" | "outbound" | "flex"
  status: DockStatus
  zone: string
  capacity: number
}

export interface DockAssignmentDetail {
  id: string
  dockId: string
  vehicleReg: string
  driverName: string
  type: ShipmentType
  supplier: string
  status: "unloading" | "loading" | "inspection" | "waiting" | "completed"
  startTime: string
  estimatedDuration: number
  progress: number
  warehouse: string
  priority: "normal" | "high" | "urgent"
}

export interface DockDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dock: DockDetail | null
  assignment?: DockAssignmentDetail | null
  onComplete?: (assignmentId: string) => void
  onAdvanceProgress?: (assignmentId: string, amount: number) => void
  onMarkAvailable?: (dockId: string) => void
}

// ---------------------------------------------------------------------------
// Status configs
// ---------------------------------------------------------------------------

const dockStatusConfig: Record<
  DockStatus,
  {
    gradient: string
    border: string
    iconBg: string
    iconColor: string
    label: string
    accent: string
    barColor: string
  }
> = {
  available: {
    gradient: "from-emerald-500 via-emerald-600 to-teal-700",
    border: "border-emerald-500/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/70",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "Available",
    accent: "emerald",
    barColor: "#10b981",
  },
  occupied: {
    gradient: "from-blue-500 via-blue-600 to-indigo-700",
    border: "border-blue-500/40",
    iconBg: "bg-blue-100 dark:bg-blue-950/70",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "Occupied",
    accent: "blue",
    barColor: "#3b82f6",
  },
  maintenance: {
    gradient: "from-red-500 via-red-600 to-rose-700",
    border: "border-red-500/40",
    iconBg: "bg-red-100 dark:bg-red-950/70",
    iconColor: "text-red-600 dark:text-red-400",
    label: "Maintenance",
    accent: "red",
    barColor: "#ef4444",
  },
  reserved: {
    gradient: "from-amber-500 via-amber-600 to-orange-700",
    border: "border-amber-500/40",
    iconBg: "bg-amber-100 dark:bg-amber-950/70",
    iconColor: "text-amber-600 dark:text-amber-400",
    label: "Reserved",
    accent: "amber",
    barColor: "#f59e0b",
  },
}

const dockTypeConfig: Record<
  DockDetail["type"],
  { icon: typeof ArrowDownToLine; label: string; color: string }
> = {
  inbound: { icon: ArrowDownToLine, label: "Inbound", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  outbound: { icon: ArrowUpFromLine, label: "Outbound", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  flex: { icon: Zap, label: "Flex", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
}

const shipmentStatusConfig: Record<
  DockAssignmentDetail["status"],
  { icon: typeof Clock; label: string; color: string }
> = {
  unloading: { icon: ArrowDownToLine, label: "Unloading", color: "text-blue-600 dark:text-blue-400" },
  loading: { icon: ArrowUpFromLine, label: "Loading", color: "text-emerald-600 dark:text-emerald-400" },
  inspection: { icon: PackageCheck, label: "Inspection", color: "text-amber-600 dark:text-amber-400" },
  waiting: { icon: Timer, label: "Waiting", color: "text-slate-500 dark:text-slate-400" },
  completed: { icon: CheckCircle2, label: "Completed", color: "text-emerald-600 dark:text-emerald-400" },
}

const priorityConfig: Record<
  DockAssignmentDetail["priority"],
  { color: string; label: string; ring: string }
> = {
  normal: { color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", label: "Normal", ring: "ring-slate-500/20" },
  high: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300", label: "High", ring: "ring-amber-500/20" },
  urgent: { color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300", label: "Urgent", ring: "ring-red-500/20" },
}

// ---------------------------------------------------------------------------
// Deterministic mock data generators
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function pick<T>(arr: T[], seed: number, offset: number): T {
  return arr[(seed + offset) % arr.length]
}

interface UtilizationPoint {
  hour: string
  utilization: number
  throughput: number
}

interface MaintenanceLogEntry {
  id: string
  timestamp: string
  type: "scheduled" | "repair" | "inspection" | "incident"
  description: string
  technician: string
  duration: string
  cost: string
  status: "completed" | "in-progress" | "scheduled"
}

interface DockEvent {
  id: string
  timestamp: string
  type: "arrival" | "departure" | "assignment" | "completion" | "delay" | "maintenance"
  detail: string
  vehicle?: string
}

interface ThroughputMetric {
  label: string
  value: string
  target: string
  pct: number
  trend: "up" | "down" | "flat"
  delta: string
}

function generateUtilizationHistory(dock: DockDetail): UtilizationPoint[] {
  const seed = hashStr(dock.id)
  const points: UtilizationPoint[] = []
  const now = new Date()
  const baseUtil =
    dock.status === "occupied" ? 80 + (seed % 15) :
    dock.status === "maintenance" ? 0 :
    dock.status === "reserved" ? 30 + (seed % 20) :
    25 + (seed % 20)
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hour = t.getHours()
    // Lower utilization during night hours
    const isNight = hour < 6 || hour > 22
    const adjusted = isNight ? Math.max(0, baseUtil - 30) : baseUtil
    const noise = ((seed >> (i % 16)) & 7) - 3
    const util = Math.max(0, Math.min(100, adjusted + noise))
    const throughput = Math.round((util / 100) * dock.capacity * 0.8)
    points.push({
      hour: t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }),
      utilization: util,
      throughput,
    })
  }
  return points
}

function generateMaintenanceLog(dock: DockDetail): MaintenanceLogEntry[] {
  const seed = hashStr(dock.id)
  const technicians = ["Crown Service Center", "Ravi Kumar (In-house)", "Toyota Service Team", "External Vendor"]
  const logTypes: MaintenanceLogEntry["type"][] = ["scheduled", "repair", "inspection", "incident"]
  const descriptions: Record<MaintenanceLogEntry["type"], string[]> = {
    scheduled: [
      "Weekly hydraulic system inspection",
      "Monthly dock leveler calibration",
      "Quarterly safety system check",
    ],
    repair: [
      "Hydraulic pump replacement",
      "Dock leveler spring repair",
      "Conveyor belt realignment",
    ],
    inspection: [
      "Safety barrier inspection",
      "Dock seal integrity check",
      "Vehicle restraint system test",
    ],
    incident: [
      "Minor collision with trailer — surface damage",
      "Hydraulic fluid leak detected",
      "Power outage during operation",
    ],
  }

  const entries: MaintenanceLogEntry[] = []
  const now = Date.now()
  for (let i = 0; i < 6; i++) {
    const daysAgo = i * 7 + (seed % 4)
    const type = pick(logTypes, seed, i)
    const desc = pick(descriptions[type], seed, i)
    const isInProgress = i === 0 && dock.status === "maintenance"
    const isScheduled = i === 0 && !isInProgress && (seed % 5 === 0)
    entries.push({
      id: `MNT-${dock.id}-${1000 + i * 37 + (seed % 100)}`,
      timestamp: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      type,
      description: desc,
      technician: pick(technicians, seed, i),
      duration: `${1 + (seed % 4) % 3 + i % 2}h ${15 + ((seed >> i) & 3) * 15}m`,
      cost: `₹${(2 + (seed % 8) + i * 0.5).toFixed(1)}k`,
      status: isInProgress ? "in-progress" : isScheduled ? "scheduled" : "completed",
    })
  }
  return entries.reverse() // Most recent first
}

function generateDockEvents(dock: DockDetail, assignment?: DockAssignmentDetail | null): DockEvent[] {
  const seed = hashStr(dock.id)
  const events: DockEvent[] = []
  const now = Date.now()

  if (assignment) {
    const startMs = new Date(`${new Date().toDateString()} ${assignment.startTime}`).getTime()
    if (!isNaN(startMs)) {
      events.push({
        id: `evt-arrival-${assignment.id}`,
        timestamp: new Date(startMs - 5 * 60000).toISOString(),
        type: "arrival",
        detail: `Vehicle ${assignment.vehicleReg} arrived at dock`,
        vehicle: assignment.vehicleReg,
      })
      events.push({
        id: `evt-assign-${assignment.id}`,
        timestamp: new Date(startMs).toISOString(),
        type: "assignment",
        detail: `Assigned to ${assignment.driverName} (${assignment.supplier})`,
        vehicle: assignment.vehicleReg,
      })
      if (assignment.progress > 30) {
        events.push({
          id: `evt-mid-${assignment.id}`,
          timestamp: new Date(startMs + assignment.estimatedDuration * 30000).toISOString(),
          type: "completion",
          detail: `${shipmentStatusConfig[assignment.status].label} progress reached ${Math.round(assignment.progress / 2)}%`,
          vehicle: assignment.vehicleReg,
        })
      }
    }
  }

  // Historical events
  for (let i = 0; i < 5; i++) {
    const hoursAgo = 4 + i * 6 + (seed % 3)
    const types: DockEvent["type"][] = ["arrival", "departure", "completion", "completion", "delay"]
    const t = pick(types, seed, i)
    const vehicleReg = `${pick(["TN", "MH", "KA", "HR", "GJ"], seed, i)}-${String(10 + (seed % 90)).padStart(2, "0")}-${String.fromCharCode(65 + (seed % 26))}${String.fromCharCode(65 + (seed % 26))}-${1000 + i * 137 + (seed % 999)}`
    events.push({
      id: `evt-hist-${i}`,
      timestamp: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString(),
      type: t,
      detail: t === "arrival"
        ? `Vehicle ${vehicleReg} arrived for loading`
        : t === "departure"
        ? `Vehicle ${vehicleReg} departed — completed in ${45 + (seed % 60)} min`
        : t === "completion"
        ? `Assignment completed: ${50 + (seed % 40)} units processed`
        : `Delay of ${10 + (seed % 30)} min due to paperwork`,
      vehicle: vehicleReg,
    })
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8)
}

function generateThroughputMetrics(dock: DockDetail, assignment?: DockAssignmentDetail | null): ThroughputMetric[] {
  const seed = hashStr(dock.id)
  const isActive = dock.status === "occupied"
  return [
    {
      label: "Today's Throughput",
      value: `${isActive ? 18 + (seed % 12) : 0} units`,
      target: "30 units",
      pct: isActive ? Math.round(((18 + (seed % 12)) / 30) * 100) : 0,
      trend: isActive ? "up" : "flat",
      delta: isActive ? `+${2 + (seed % 5)}` : "0",
    },
    {
      label: "Avg Processing Time",
      value: `${45 + (seed % 30)} min`,
      target: "60 min",
      pct: Math.round(((45 + (seed % 30)) / 60) * 100),
      trend: "down",
      delta: `-${5 + (seed % 10)} min`,
    },
    {
      label: "Utilization (24h)",
      value: `${isActive ? 78 + (seed % 15) : dock.status === "maintenance" ? 0 : 25 + (seed % 20)}%`,
      target: "85%",
      pct: isActive ? 78 + (seed % 15) : dock.status === "maintenance" ? 0 : 25 + (seed % 20),
      trend: isActive ? "up" : "flat",
      delta: isActive ? `+${3 + (seed % 6)}%` : "0%",
    },
    {
      label: "On-time Completion",
      value: `${88 + (seed % 10)}%`,
      target: "95%",
      pct: 88 + (seed % 10),
      trend: "up",
      delta: `+${1 + (seed % 4)}%`,
    },
  ]
}

function formatTimeRemaining(duration: number, progress: number): string {
  const elapsed = Math.round(duration * (progress / 100))
  const remaining = duration - elapsed
  if (remaining <= 0) return "Completing..."
  if (remaining < 15) return `${remaining} min left`
  return `${Math.floor(remaining / 60)}h ${remaining % 60}m left`
}

function formatRelativeTime(ts: string): string {
  const date = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return "just now"
  const min = Math.floor(diffMs / 60000)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}

function formatAbsoluteTime(ts: string): string {
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

function eventColor(type: DockEvent["type"]) {
  switch (type) {
    case "arrival": return "bg-blue-500"
    case "departure": return "bg-emerald-500"
    case "assignment": return "bg-indigo-500"
    case "completion": return "bg-emerald-500"
    case "delay": return "bg-amber-500"
    case "maintenance": return "bg-red-500"
  }
}

function maintenanceLogColor(type: MaintenanceLogEntry["type"]) {
  switch (type) {
    case "scheduled": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
    case "repair": return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
    case "inspection": return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
    case "incident": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
  }
}

function maintenanceStatusColor(status: MaintenanceLogEntry["status"]) {
  switch (status) {
    case "completed": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
    case "in-progress": return "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
    case "scheduled": return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
  }
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function DockDetailDrawer({
  open,
  onOpenChange,
  dock,
  assignment,
  onComplete,
  onAdvanceProgress,
  onMarkAvailable,
}: DockDetailDrawerProps) {
  const toast = useToast()

  // Deterministic data — hooks BEFORE early return
  const utilizationHistory = React.useMemo(() => (dock ? generateUtilizationHistory(dock) : []), [dock])
  const maintenanceLog = React.useMemo(() => (dock ? generateMaintenanceLog(dock) : []), [dock])
  const events = React.useMemo(
    () => (dock ? generateDockEvents(dock, assignment ?? null) : []),
    [dock, assignment],
  )
  const throughputMetrics = React.useMemo(
    () => (dock ? generateThroughputMetrics(dock, assignment ?? null) : []),
    [dock, assignment],
  )

  if (!dock) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl" />
      </Sheet>
    )
  }

  const statusCfg = dockStatusConfig[dock.status]
  const typeCfg = dockTypeConfig[dock.type]
  const TypeIcon = typeCfg.icon

  const handleComplete = () => {
    if (!assignment) return
    toast.success("Assignment completed", `${assignment.vehicleReg} marked as completed`, { duration: 3000 })
    onComplete?.(assignment.id)
  }

  const handleAdvance = () => {
    if (!assignment) return
    toast.info("Progress advanced", `+15% for ${assignment.vehicleReg}`, { duration: 2000 })
    onAdvanceProgress?.(assignment.id, 15)
  }

  const handleMarkAvailable = () => {
    toast.success("Dock marked available", `${dock.name} is now available for assignment`, { duration: 3000 })
    onMarkAvailable?.(dock.id)
  }

  const handleExportUtilization = () => {
    const data = utilizationHistory.map((p) => ({
      Hour: p.hour,
      "Utilization %": p.utilization,
      "Throughput (units)": p.throughput,
    }))
    exportToCSV(data, `dock-${dock.id}-utilization`, ["Hour", "Utilization %", "Throughput (units)"])
    toast.success("Utilization exported", `${utilizationHistory.length} hourly points written`, { duration: 2500 })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-2xl overflow-y-auto p-0 border-l-2",
          statusCfg.border,
        )}
      >
        {/* ── Header Strip ─────────────────────────────────────────────── */}
        <div className={cn("relative bg-gradient-to-br text-white overflow-hidden", statusCfg.gradient)}>
          <div className="dock-drawer-header absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 opacity-20"
               style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "16px 16px" }} />

          <SheetHeader className="relative p-5 pb-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className={cn(
                  "dock-icon-pulse flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-2 ring-white/30 backdrop-blur-sm",
                  "bg-white/20",
                )}>
                  <TypeIcon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-base font-semibold text-white leading-tight">
                    {dock.name}
                  </SheetTitle>
                  <SheetDescription className="text-white/80 text-xs mt-1">
                    <span className="font-mono">{dock.id}</span>
                    <span className="mx-1.5">·</span>
                    <span>Zone {dock.zone}</span>
                    <span className="mx-1.5">·</span>
                    <span>{dock.capacity} tons capacity</span>
                  </SheetDescription>
                </div>
              </div>
              <Badge className="shrink-0 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {statusCfg.label}
              </Badge>
            </div>

            {/* Hero metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="dock-stat-enter rounded-lg bg-white/15 backdrop-blur-sm p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/70">Type</p>
                <p className="text-sm font-semibold text-white mt-0.5 capitalize">{typeCfg.label}</p>
              </div>
              <div className="dock-stat-enter rounded-lg bg-white/15 backdrop-blur-sm p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/70">Capacity</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  <span className="text-number">{dock.capacity}</span> <span className="text-[10px] text-white/70">tons</span>
                </p>
              </div>
              <div className="dock-stat-enter rounded-lg bg-white/15 backdrop-blur-sm p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-white/70">Utilization</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  <span className="text-number">{throughputMetrics[2]?.pct ?? 0}</span>%
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {dock.status === "occupied" && assignment && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 text-[11px] gap-1.5 bg-white/90 hover:bg-white text-slate-900"
                    onClick={handleAdvance}
                  >
                    <Play className="h-3 w-3" /> Advance +15%
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 text-[11px] gap-1.5 bg-emerald-500/90 hover:bg-emerald-500 text-white border-emerald-400"
                    onClick={handleComplete}
                  >
                    <CheckCircle2 className="h-3 w-3" /> Complete
                  </Button>
                </>
              )}
              {dock.status === "maintenance" && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-[11px] gap-1.5 bg-white/90 hover:bg-white text-slate-900"
                  onClick={handleMarkAvailable}
                >
                  <RotateCcw className="h-3 w-3" /> Mark Available
                </Button>
              )}
              {dock.status === "available" && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-[11px] gap-1.5 bg-white/90 hover:bg-white text-slate-900"
                  onClick={() => toast.info("Assign vehicle", "Use drag-and-drop from queue or Assign button", { duration: 2500 })}
                >
                  <Truck className="h-3 w-3" /> Assign Vehicle
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[11px] gap-1.5 text-white hover:bg-white/20"
                onClick={() => toast.info("Dock link copied", "Share with team members", { duration: 2000 })}
              >
                <Share2 className="h-3 w-3" /> Share
              </Button>
            </div>
          </SheetHeader>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="dock-drawer-body-enter space-y-5 p-5">
          {/* Current assignment */}
          {assignment && (
            <section className="dock-card-enter rounded-xl border border-border/60 bg-card p-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <Truck className="h-3.5 w-3.5" /> Current Assignment
              </h3>
              <div className="rounded-lg border border-border/40 bg-muted/30 p-3 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono font-medium text-foreground">{assignment.vehicleReg}</p>
                      <Badge variant="outline" className="text-[9px]">
                        {assignment.type === "inbound" ? "IN" : "OUT"}
                      </Badge>
                      <Badge className={cn("text-[9px]", priorityConfig[assignment.priority].color)}>
                        {priorityConfig[assignment.priority].label}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">{assignment.supplier}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1.5">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-2.5 w-2.5" /> {assignment.driverName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> Started {assignment.startTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {(() => {
                      const StatusIcon = shipmentStatusConfig[assignment.status].icon
                      return (
                        <div className={cn("flex items-center gap-1 text-xs font-medium", shipmentStatusConfig[assignment.status].color)}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="capitalize">{shipmentStatusConfig[assignment.status].label}</span>
                        </div>
                      )
                    })()}
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      <span className="text-number">{formatTimeRemaining(assignment.estimatedDuration, assignment.progress)}</span>
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Progress</span>
                    <span className="text-number font-medium">{assignment.progress}%</span>
                  </div>
                  <Progress
                    value={assignment.progress}
                    className={cn(
                      "h-1.5 progress-bar-animated",
                      assignment.progress < 30 && "progress-gradient",
                      assignment.progress >= 30 && assignment.progress < 70 && "[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-emerald-500",
                      assignment.progress >= 70 && assignment.progress < 90 && "progress-gradient-amber",
                      assignment.progress >= 90 && "progress-gradient-red",
                    )}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Throughput metrics */}
          <section className="dock-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Gauge className="h-3.5 w-3.5" /> Throughput Metrics
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {throughputMetrics.map((m) => (
                <div key={m.label} className="dock-metric-enter rounded-lg border border-border/40 bg-muted/30 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                  <p className="text-lg font-bold tabular-nums text-foreground mt-0.5">{m.value}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-muted-foreground">vs {m.target}</p>
                    <p className={cn(
                      "text-[10px] flex items-center gap-0.5",
                      m.trend === "up" ? "text-emerald-500" :
                      m.trend === "down" ? "text-red-500" : "text-muted-foreground",
                    )}>
                      {m.trend === "up" ? <TrendingUp className="h-2.5 w-2.5" /> :
                       m.trend === "down" ? <TrendingDown className="h-2.5 w-2.5" /> :
                       <Activity className="h-2.5 w-2.5" />}
                      {m.delta}
                    </p>
                  </div>
                  <Progress value={m.pct} className="h-1 mt-1.5" />
                </div>
              ))}
            </div>
          </section>

          {/* Utilization history chart */}
          <section className="dock-card-enter rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Activity className="h-3.5 w-3.5" /> 24-Hour Utilization
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] gap-1"
                onClick={handleExportUtilization}
              >
                <Download className="h-3 w-3" /> Export
              </Button>
            </div>
            <ChartContainer
              config={{
                utilization: { label: "Utilization %", color: statusCfg.barColor },
                throughput: { label: "Throughput (units)", color: "#a855f7" },
              }}
              className="h-[180px] w-full"
            >
              <AreaChart data={utilizationHistory}>
                <defs>
                  <linearGradient id="dockUtilFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={statusCfg.barColor} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={statusCfg.barColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} className="text-muted-foreground" interval={3} />
                <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke={statusCfg.barColor}
                  strokeWidth={2}
                  fill="url(#dockUtilFill)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="throughput"
                  stroke="#a855f7"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fill="none"
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </section>

          {/* Recent events */}
          <section className="dock-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <History className="h-3.5 w-3.5" /> Recent Dock Events
            </h3>
            <div className="relative pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
              <div className="space-y-3">
                {events.map((evt) => (
                  <div key={evt.id} className="dock-event-enter relative">
                    <div className={cn(
                      "absolute -left-4 top-1 h-3 w-3 rounded-full ring-2 ring-background",
                      eventColor(evt.type),
                    )} />
                    <div className="ml-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-xs font-medium text-foreground capitalize">{evt.type}</p>
                        <p className="text-[10px] text-muted-foreground shrink-0">
                          {formatRelativeTime(evt.timestamp)}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{evt.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Maintenance log */}
          <section className="dock-card-enter rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Wrench className="h-3.5 w-3.5" /> Maintenance Log
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] gap-1"
                onClick={() => toast.info("Schedule maintenance", "Open maintenance scheduler", { duration: 2000 })}
              >
                <Calendar className="h-3 w-3" /> Schedule
              </Button>
            </div>
            <div className="space-y-2">
              {maintenanceLog.map((entry) => (
                <div
                  key={entry.id}
                  className="dock-maint-row flex items-start gap-3 rounded-lg border border-border/40 bg-muted/30 p-3 transition-smooth hover:bg-muted/60"
                >
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className={cn("rounded px-1.5 py-0.5 text-[9px] uppercase font-medium", maintenanceLogColor(entry.type))}>
                      {entry.type}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground">{entry.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground mt-1">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-2.5 w-2.5" /> {entry.technician}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {entry.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Activity className="h-2.5 w-2.5" /> {entry.cost}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" /> {formatAbsoluteTime(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                  <Badge className={cn("text-[9px] capitalize shrink-0", maintenanceStatusColor(entry.status))}>
                    {entry.status}
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Dock info grid */}
          <section className="dock-card-enter rounded-xl border border-border/60 bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Settings className="h-3.5 w-3.5" /> Dock Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Dock ID</p>
                <p className="font-mono font-medium text-foreground mt-0.5">{dock.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Zone</p>
                <p className="font-medium text-foreground mt-0.5">{dock.zone}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Type</p>
                <p className="font-medium text-foreground mt-0.5 capitalize">{dock.type}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Capacity</p>
                <p className="font-medium text-foreground mt-0.5"><span className="text-number">{dock.capacity}</span> tons</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                <p className="font-medium text-foreground mt-0.5">{statusCfg.label}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Warehouse</p>
                <p className="font-medium text-foreground mt-0.5">Chennai Hub</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={handleExportUtilization}
            >
              <Download className="h-3.5 w-3.5" /> Export Dock Report
            </Button>
            <Button
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => toast.info("Configuration", "Open dock configuration panel", { duration: 2000 })}
            >
              <Settings className="h-3.5 w-3.5" /> Configure
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
