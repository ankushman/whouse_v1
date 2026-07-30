"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { useToast } from "@/hooks/use-toast-helper";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Bot, Battery, Zap, Gauge, Activity, AlertTriangle,
  Clock, Wrench, Play, ArrowUpDown, Filter, MapPin, Package,
  TrendingUp, BarChart3, CheckCircle2, XCircle, RefreshCw,
  Cpu, ShieldAlert, Timer, IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  seededRandom + helpers                                              */
/* ------------------------------------------------------------------ */
function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  s = (s * 16807) % 2147483647
  return (s - 1) / 2147483646
}
const ri = (min: number, max: number, seed: number) => Math.floor(seededRandom(seed) * (max - min + 1)) + min
const rf = (min: number, max: number, seed: number) => +(seededRandom(seed) * (max - min) + min).toFixed(2)
const pick = <T,>(arr: readonly T[], seed: number) => arr[Math.floor(seededRandom(seed) * arr.length)]
function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

/* ------------------------------------------------------------------ */
/*  Theme Colors                                                        */
/* ------------------------------------------------------------------ */
const C = {
  indigo: "#6366f1", cyan: "#0891b2", emerald: "#059669",
  orange: "#ea580c", rose: "#e11d48", amber: "#d97706",
}
const PIE_COLORS = [C.indigo, C.cyan, C.emerald, C.orange, C.rose, C.amber, "#7c3aed", "#475569"]
const CHART_COLORS = [C.indigo, C.cyan, C.emerald, C.orange, C.rose, C.amber]

/* ------------------------------------------------------------------ */
/*  Data Generation                                                     */
/* ------------------------------------------------------------------ */
function generateData() {
  let seed = 2121
  const next = () => ++seed
  const p = <T,>(a: readonly T[]) => pick(a, next())
  const r = (mn: number, mx: number) => ri(mn, mx, next())
  const f = (mn: number, mx: number) => rf(mn, mx, next())

  const ROBOT_TYPES = ["AGV", "AMR", "ASRS Crane", "Robotic Arm", "Pick Station", "Sortation Robot", "Palletizer", "Conveyor System"] as const
  const ROBOT_STATUSES = ["Active", "Idle", "Charging", "Maintenance", "Error", "Offline", "Updating", "Calibrating"] as const
  const ZONES = ["Receiving Dock", "Putaway Aisle", "Storage Rack Zone", "Pick Face", "Packing Station", "Shipping Dock", "Returns Area", "QC Lab"] as const
  const TASK_TYPES = ["Putaway", "Picking", "Replenishment", "Inter-zone Transfer", "Returns Processing", "Cycle Count", "Charging", "Maintenance"] as const
  const TASK_PRIORITIES = ["Critical", "High", "Medium", "Low"] as const
  const TASK_STATUSES = ["Queued", "Dispatched", "In Progress", "Completed", "Failed", "Cancelled", "Requeued"] as const
  const ERROR_TYPES = ["Path Obstruction", "Sensor Malfunction", "Battery Drain", "Network Lost", "Motor Failure", "Calibration Drift", "Load Imbalance", "Software Crash"] as const
  const SEVERITIES = ["Critical", "High", "Medium", "Low"] as const
  const RESOLUTIONS = ["Auto-recovered", "Manual Reset", "Part Replacement", "Software Update", "Recharge Required", "Recalibration", "Escalated to Vendor", "Under Investigation"] as const
  const MAINT_TYPES = ["Routine Check", "Battery Replacement", "Sensor Calibration", "Motor Service", "Software Update", "Deep Cleaning", "Wheel Replacement", "Full Overhaul"] as const
  const MAINT_STATUSES = ["Scheduled", "In Progress", "Completed", "Overdue", "Cancelled", "Rescheduled"] as const
  const TECHS = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Neha Gupta", "Vikram Singh", "Sunita Joshi", "Rahul Mehta", "Deepa Nair", "Karthik Rajan", "Manoj Tiwari", "Sanjay Verma", "Lakshmi Iyer", "Arjun Reddy", "Pooja Deshmukh", "Harish Chandra"] as const
  const WH_CODES = ["WH-MUM-R01", "WH-MUM-P02", "WH-DEL-S03", "WH-DEL-A04", "WH-BLR-R05", "WH-BLR-P06", "WH-CHN-S07", "WH-CHN-A08", "WH-HYD-R09", "WH-PNE-P10", "WH-KOL-S11", "WH-JAI-A12"] as const
  const AUTOMATION_TYPES = ["AGV", "AMR", "ASRS", "Conveyor", "Robotic Arm", "Sortation System", "Pick Station", "Palletizer"] as const
  const PARTS = ["Li-ion Battery Pack", "Lidar Sensor Module", "DC Motor Unit", "Wheel Assembly", "Control Board", "Belt Segment", "Proximity Sensor", "Firmware Chip"]

  const robots = Array.from({ length: 75 }, (_, i) => {
    const battery = r(5, 100)
    return {
      id: `RB-${String(i + 1).padStart(3, "0")}`, type: p(ROBOT_TYPES), zone: p(ZONES),
      status: p(ROBOT_STATUSES), battery, tasksCompleted: r(50, 2400),
      lastMaintenance: `2026-${String(r(1, 6)).padStart(2, "0")}-${String(r(1, 28)).padStart(2, "0")}`,
      uptime: f(78, 99.9), errorCount: r(0, 12),
    }
  })

  const tasks = Array.from({ length: 70 }, (_, i) => ({
    id: `TSK-${String(i + 1).padStart(4, "0")}`, type: p(TASK_TYPES),
    assignedRobot: robots[r(0, 74)].id, priority: p(TASK_PRIORITIES),
    status: p(TASK_STATUSES),
    pickupLocation: p(WH_CODES), dropLocation: p(WH_CODES),
    weight: f(0.5, 850), eta: `${String(r(0, 23)).padStart(2, "0")}:${String(r(0, 59)).padStart(2, "0")}`,
    createdAt: `2026-01-${String(r(1, 28)).padStart(2, "0")} ${String(r(6, 18)).padStart(2, "0")}:${String(r(0, 59)).padStart(2, "0")}`,
  }))

  const errors = Array.from({ length: 60 }, (_, i) => ({
    id: `ERR-${String(i + 1).padStart(4, "0")}`, robotId: robots[r(0, 74)].id,
    errorType: p(ERROR_TYPES), severity: p(SEVERITIES),
    description: `${p(ERROR_TYPES)} detected at ${p(ZONES)} – requires ${p(RESOLUTIONS).toLowerCase()}`,
    zone: p(ZONES),
    occurredAt: `2026-01-${String(r(1, 28)).padStart(2, "0")} ${String(r(0, 23)).padStart(2, "0")}:${String(r(0, 59)).padStart(2, "0")}`,
    resolution: p(RESOLUTIONS), downtime: r(1, 480),
  }))

  const maintenance = Array.from({ length: 55 }, (_, i) => ({
    id: `MNT-${String(i + 1).padStart(4, "0")}`, robotId: robots[r(0, 74)].id,
    type: p(MAINT_TYPES),
    scheduledDate: `2026-${String(r(1, 12)).padStart(2, "0")}-${String(r(1, 28)).padStart(2, "0")}`,
    assignedTech: p(TECHS), status: p(MAINT_STATUSES),
    duration: f(0.5, 24), partsUsed: p(PARTS), cost: r(2000, 250000),
  }))

  const hourlyThroughput = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`, manual: r(10, 60), semiAuto: r(15, 80), fullyAuto: r(20, 120),
  }))

  const automationPie = AUTOMATION_TYPES.map((name) => ({ name, value: r(3, 18) }))
  const zoneCoverage = ZONES.map((zone) => ({ zone, coverage: r(30, 98) }))

  const dailyPerformance = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`, agv: r(80, 200), amr: r(60, 180), asrs: r(40, 150),
    conveyor: r(50, 160), roboticArm: r(20, 80), sortation: r(30, 100),
  }))

  const zoneThroughput = ZONES.map((zone) => ({ zone, throughput: r(200, 900) }))

  const errorTrend = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`, pathObstruction: r(1, 8), sensor: r(0, 6), battery: r(0, 5),
    network: r(0, 4), motor: r(0, 3), software: r(1, 7),
  }))

  const roiData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => ({
    month: m, laborSavings: r(800000, 2500000), throughputGain: r(500000, 1800000),
    errorReduction: r(100000, 600000), maintenanceCost: r(200000, 800000),
  }))

  return {
    robots, tasks, errors, maintenance,
    hourlyThroughput, automationPie, zoneCoverage,
    dailyPerformance, zoneThroughput, errorTrend, roiData,
    ROBOT_TYPES, ROBOT_STATUSES, ZONES, TASK_TYPES,
    TASK_PRIORITIES, TASK_STATUSES, ERROR_TYPES, SEVERITIES,
    RESOLUTIONS, MAINT_TYPES, MAINT_STATUSES, TECHS, WH_CODES,
    AUTOMATION_TYPES, PARTS,
  }
}

const data = generateData()

/* ------------------------------------------------------------------ */
/*  Visual Components (16+)                                             */
/* ------------------------------------------------------------------ */

// 1. RobotTypeBadge
function RobotTypeBadge({ type }: { type: string }) {
  const map: Record<string, { cls: string; icon: string }> = {
    AGV: { cls: "bg-indigo-100 text-indigo-700", icon: "🤖" },
    AMR: { cls: "bg-cyan-100 text-cyan-700", icon: "📦" },
    "ASRS Crane": { cls: "bg-emerald-100 text-emerald-700", icon: "🏗️" },
    "Robotic Arm": { cls: "bg-rose-100 text-rose-700", icon: "🦾" },
    "Pick Station": { cls: "bg-amber-100 text-amber-700", icon: "🎯" },
    "Sortation Robot": { cls: "bg-orange-100 text-orange-700", icon: "✂️" },
    Palletizer: { cls: "bg-fuchsia-100 text-fuchsia-700", icon: "🔄" },
    "Conveyor System": { cls: "bg-slate-100 text-slate-600", icon: "⬆️" },
  }
  const m = map[type] ?? { cls: "bg-gray-100 text-gray-600", icon: "⬤" }
  return <span className={cn("wam-robot-type inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", m.cls)}>{m.icon} {type}</span>
}

// 2. RobotStatusBadge
function RobotStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Idle: "bg-slate-100 text-slate-600 border-slate-300",
    Charging: "bg-amber-100 text-amber-700 border-amber-300",
    Maintenance: "bg-violet-100 text-violet-700 border-violet-300",
    Error: "bg-red-100 text-red-700 border-red-300",
    Offline: "bg-gray-100 text-gray-500 border-gray-300",
    Updating: "bg-blue-100 text-blue-700 border-blue-300",
    Calibrating: "bg-cyan-100 text-cyan-700 border-cyan-300",
  }
  return (
    <span className={cn("wam-robot-status inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold", map[status] ?? "bg-gray-100 text-gray-600",
      status === "Active" && "animate-pulse", status === "Error" && "animate-pulse", status === "Charging" && "animate-pulse")}>
      {status}
    </span>
  )
}

// 3. BatteryLevelBar
function BatteryLevelBar({ battery }: { battery: number }) {
  const color = battery > 60 ? "#059669" : battery > 20 ? "#d97706" : "#e11d48"
  return (
    <div className="wam-battery flex items-center gap-2">
      <div className="h-3.5 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full rounded-full" style={{ width: `${battery}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }} />
      </div>
      <span className="text-[10px] font-mono font-semibold" style={{ color }}>{battery}%</span>
    </div>
  )
}

// 4. UptimeBar
function UptimeBar({ uptime }: { uptime: number }) {
  const color = uptime > 95 ? "#059669" : uptime > 85 ? "#d97706" : "#e11d48"
  return (
    <div className="wam-uptime flex items-center gap-2">
      <div className="h-3 w-14 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full rounded-full" style={{ width: `${uptime}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }} />
      </div>
      <span className="text-[10px] font-mono font-semibold" style={{ color }}>{uptime}%</span>
    </div>
  )
}

// 5. TaskTypeBadge
function TaskTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    Putaway: "bg-indigo-100 text-indigo-700", Picking: "bg-cyan-100 text-cyan-700",
    Replenishment: "bg-emerald-100 text-emerald-700", "Inter-zone Transfer": "bg-amber-100 text-amber-700",
    "Returns Processing": "bg-rose-100 text-rose-700", "Cycle Count": "bg-violet-100 text-violet-700",
    Charging: "bg-orange-100 text-orange-700", Maintenance: "bg-slate-100 text-slate-600",
  }
  return <span className={cn("wam-task-type inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", map[type] ?? "bg-gray-100 text-gray-600")}>{type}</span>
}

// 6. TaskStatusBadge
function TaskStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Queued: "bg-slate-100 text-slate-600 border-slate-300", Dispatched: "bg-indigo-100 text-indigo-700 border-indigo-300",
    "In Progress": "bg-cyan-100 text-cyan-700 border-cyan-300", Completed: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Failed: "bg-red-100 text-red-700 border-red-300", Cancelled: "bg-gray-100 text-gray-500 border-gray-300",
    Requeued: "bg-amber-100 text-amber-700 border-amber-300",
  }
  return (
    <span className={cn("wam-task-status inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold", map[status] ?? "bg-gray-100",
      (status === "In Progress" || status === "Failed") && "animate-pulse")}>{status}</span>
  )
}

// 7. TaskPriorityBadge
function TaskPriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    Critical: "bg-red-100 text-red-700 border-red-300", High: "bg-rose-100 text-rose-700 border-rose-300",
    Medium: "bg-amber-100 text-amber-700 border-amber-300", Low: "bg-emerald-100 text-emerald-700 border-emerald-300",
  }
  return <span className={cn("wam-task-priority inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold", map[priority] ?? "bg-gray-100", priority === "Critical" && "animate-pulse")}>{priority}</span>
}

// 8. ErrorTypeBadge
function ErrorTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    "Path Obstruction": "bg-indigo-100 text-indigo-700", "Sensor Malfunction": "bg-cyan-100 text-cyan-700",
    "Battery Drain": "bg-amber-100 text-amber-700", "Network Lost": "bg-orange-100 text-orange-700",
    "Motor Failure": "bg-rose-100 text-rose-700", "Calibration Drift": "bg-violet-100 text-violet-700",
    "Load Imbalance": "bg-emerald-100 text-emerald-700", "Software Crash": "bg-red-100 text-red-700",
  }
  return <span className={cn("wam-error-type inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", map[type] ?? "bg-gray-100 text-gray-600")}>{type}</span>
}

// 9. ErrorSeverityBadge
function ErrorSeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    Critical: "bg-red-100 text-red-700 border-red-300", High: "bg-rose-100 text-rose-700 border-rose-300",
    Medium: "bg-amber-100 text-amber-700 border-amber-300", Low: "bg-slate-100 text-slate-600 border-slate-300",
  }
  return <span className={cn("wam-error-severity inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold", map[severity] ?? "bg-gray-100", severity === "Critical" && "animate-pulse")}>{severity}</span>
}

// 10. ResolutionBadge
function ResolutionBadge({ resolution }: { resolution: string }) {
  const map: Record<string, string> = {
    "Auto-recovered": "bg-emerald-100 text-emerald-700", "Manual Reset": "bg-amber-100 text-amber-700",
    "Part Replacement": "bg-indigo-100 text-indigo-700", "Software Update": "bg-cyan-100 text-cyan-700",
    "Recharge Required": "bg-orange-100 text-orange-700", Recalibration: "bg-violet-100 text-violet-700",
    "Escalated to Vendor": "bg-rose-100 text-rose-700", "Under Investigation": "bg-slate-100 text-slate-600",
  }
  return <span className={cn("wam-resolution inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", map[resolution] ?? "bg-gray-100 text-gray-600")}>{resolution}</span>
}

// 11. MaintenanceTypeBadge
function MaintenanceTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    "Routine Check": "bg-emerald-100 text-emerald-700", "Battery Replacement": "bg-amber-100 text-amber-700",
    "Sensor Calibration": "bg-cyan-100 text-cyan-700", "Motor Service": "bg-rose-100 text-rose-700",
    "Software Update": "bg-indigo-100 text-indigo-700", "Deep Cleaning": "bg-sky-100 text-sky-700",
    "Wheel Replacement": "bg-orange-100 text-orange-700", "Full Overhaul": "bg-violet-100 text-violet-700",
  }
  return <span className={cn("wam-maint-type inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", map[type] ?? "bg-gray-100 text-gray-600")}>{type}</span>
}

// 12. MaintenanceStatusBadge
function MaintenanceStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Scheduled: "bg-blue-100 text-blue-700", "In Progress": "bg-cyan-100 text-cyan-700",
    Completed: "bg-emerald-100 text-emerald-700", Overdue: "bg-amber-100 text-amber-700",
    Cancelled: "bg-gray-100 text-gray-500", Rescheduled: "bg-violet-100 text-violet-700",
  }
  return <span className={cn("wam-maint-status inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold", map[status] ?? "bg-gray-100",
    (status === "Overdue" || status === "In Progress") && "animate-pulse")}>{status}</span>
}

// 13. CostTile
function CostTile({ cost }: { cost: number }) {
  return (
    <div className="wam-cost-tile rounded-lg border border-indigo-200 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-800 p-2 text-center">
      <p className="text-[10px] text-indigo-600 font-medium">Cost</p>
      <p className="text-sm font-bold text-indigo-800 dark:text-indigo-200">{formatINR(cost)}</p>
    </div>
  )
}

// 14. DowntimeTile
function DowntimeTile({ minutes }: { minutes: number }) {
  const color = minutes > 120 ? "text-red-700 dark:text-red-400" : minutes > 30 ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
  return <span className={cn("wam-downtime text-xs font-bold", color)}>{minutes} min</span>
}

// 15. LocationBadge
function LocationBadge({ location }: { location: string }) {
  return <span className="wam-location inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300"><MapPin className="h-2.5 w-2.5" />{location}</span>
}

// 16. ErrorCountBadge
function ErrorCountBadge({ count }: { count: number }) {
  const color = count === 0 ? "bg-emerald-100 text-emerald-700" : count <= 3 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
  return <span className={cn("wam-error-count inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold", color)}>{count}</span>
}

// 17. RobotCard
function RobotCard({ robot, onClick }: { robot: typeof data.robots[0]; onClick: () => void }) {
  return (
    <div onClick={onClick} className="wam-robot-card cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{robot.id}</span>
        <RobotStatusBadge status={robot.status} />
      </div>
      <RobotTypeBadge type={robot.type} />
      <div className="mt-2"><BatteryLevelBar battery={robot.battery} /></div>
      <div className="mt-1"><UptimeBar uptime={robot.uptime} /></div>
      <div className="mt-1.5 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <span>Tasks: {robot.tasksCompleted}</span><span>{robot.zone}</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sort helper                                                         */
/* ------------------------------------------------------------------ */
function sortData(d: any[], key: string, dir: "asc" | "desc") {
  return [...d].sort((a, b) => {
    const va = a[key], vb = b[key]
    if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va
    return dir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
  })
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */
export default function WarehouseAutomationView() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("0")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetRobot, setSheetRobot] = useState<typeof data.robots[0] | null>(null)

  // Tab 1 state
  const [robotSearch, setRobotSearch] = useState("")
  const [robotStatusFilter, setRobotStatusFilter] = useState("all")
  const [robotTypeFilter, setRobotTypeFilter] = useState("all")
  const [robotZoneFilter, setRobotZoneFilter] = useState("all")
  const [robotSortKey, setRobotSortKey] = useState("id")
  const [robotSortDir, setRobotSortDir] = useState<"asc" | "desc">("asc")

  // Tab 2 state
  const [taskSearch, setTaskSearch] = useState("")
  const [taskStatusFilter, setTaskStatusFilter] = useState("all")
  const [taskTypeFilter, setTaskTypeFilter] = useState("all")
  const [taskSortKey, setTaskSortKey] = useState("id")
  const [taskSortDir, setTaskSortDir] = useState<"asc" | "desc">("asc")

  // Tab 3 state
  const [errSearch, setErrSearch] = useState("")
  const [errSeverityFilter, setErrSeverityFilter] = useState("all")
  const [errSortKey, setErrSortKey] = useState("id")
  const [errSortDir, setErrSortDir] = useState<"asc" | "desc">("asc")

  // Tab 4 state
  const [maintSearch, setMaintSearch] = useState("")
  const [maintStatusFilter, setMaintStatusFilter] = useState("all")
  const [maintTypeFilter, setMaintTypeFilter] = useState("all")
  const [maintSortKey, setMaintSortKey] = useState("id")
  const [maintSortDir, setMaintSortDir] = useState<"asc" | "desc">("asc")

  const openSheet = useCallback((robot: typeof data.robots[0]) => {
    setSheetRobot(robot)
    setSheetOpen(true)
  }, [])

  // Tab 0 KPIs
  const activeRobots = data.robots.filter(r => r.status === "Active").length
  const tasksToday = data.robots.reduce((s, r) => s + r.tasksCompleted, 0)
  const avgPickRate = (tasksToday / 75).toFixed(1)
  const automationCoverage = 72.4
  const errorRate = ((data.robots.reduce((s, r) => s + r.errorCount, 0) / tasksToday) * 100).toFixed(1)
  const uptimePct = (data.robots.reduce((s, r) => s + r.uptime, 0) / 75).toFixed(1)
  const costSavings = 1850000

  // Tab 1 filtered/sorted
  const filteredRobots = useMemo(() => {
    let d = data.robots.filter(r => {
      if (robotSearch && !r.id.toLowerCase().includes(robotSearch.toLowerCase()) && !r.type.toLowerCase().includes(robotSearch.toLowerCase())) return false
      if (robotStatusFilter !== "all" && r.status !== robotStatusFilter) return false
      if (robotTypeFilter !== "all" && r.type !== robotTypeFilter) return false
      if (robotZoneFilter !== "all" && r.zone !== robotZoneFilter) return false
      return true
    })
    return sortData(d as any[], robotSortKey, robotSortDir)
  }, [robotSearch, robotStatusFilter, robotTypeFilter, robotZoneFilter, robotSortKey, robotSortDir])

  // Tab 2 filtered/sorted
  const filteredTasks = useMemo(() => {
    let d = data.tasks.filter(t => {
      if (taskSearch && !t.id.toLowerCase().includes(taskSearch.toLowerCase()) && !t.assignedRobot.toLowerCase().includes(taskSearch.toLowerCase())) return false
      if (taskStatusFilter !== "all" && t.status !== taskStatusFilter) return false
      if (taskTypeFilter !== "all" && t.type !== taskTypeFilter) return false
      return true
    })
    return sortData(d as any[], taskSortKey, taskSortDir)
  }, [taskSearch, taskStatusFilter, taskTypeFilter, taskSortKey, taskSortDir])

  // Tab 3 filtered/sorted
  const filteredErrors = useMemo(() => {
    let d = data.errors.filter(e => {
      if (errSearch && !e.id.toLowerCase().includes(errSearch.toLowerCase()) && !e.robotId.toLowerCase().includes(errSearch.toLowerCase())) return false
      if (errSeverityFilter !== "all" && e.severity !== errSeverityFilter) return false
      return true
    })
    return sortData(d as any[], errSortKey, errSortDir)
  }, [errSearch, errSeverityFilter, errSortKey, errSortDir])

  // Tab 4 filtered/sorted
  const filteredMaint = useMemo(() => {
    let d = data.maintenance.filter(m => {
      if (maintSearch && !m.id.toLowerCase().includes(maintSearch.toLowerCase()) && !m.robotId.toLowerCase().includes(maintSearch.toLowerCase())) return false
      if (maintStatusFilter !== "all" && m.status !== maintStatusFilter) return false
      if (maintTypeFilter !== "all" && m.type !== maintTypeFilter) return false
      return true
    })
    return sortData(d as any[], maintSortKey, maintSortDir)
  }, [maintSearch, maintStatusFilter, maintTypeFilter, maintSortKey, maintSortDir])

  // Tab 5 analytics KPIs
  const analyticsKPIs = [
    { label: "Tasks/Day (Avg)", value: Math.round(tasksToday / 14), color: "text-indigo-600 dark:text-indigo-400" },
    { label: "Fleet Efficiency", value: `${automationCoverage}%`, color: "text-cyan-600 dark:text-cyan-400" },
    { label: "Error Reduction", value: "18.3%", color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Throughput Gain", value: "+34%", color: "text-orange-600 dark:text-orange-400" },
    { label: "Labor Savings", value: formatINR(costSavings * 12), color: "text-amber-600 dark:text-amber-400" },
    { label: "Avg Response Time", value: "4.2s", color: "text-rose-600 dark:text-rose-400" },
    { label: "ROI (6-month)", value: "247%", color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Automation Score", value: "87/100", color: "text-indigo-600 dark:text-indigo-400" },
  ]

  const SortHeader = ({ col, label }: { col: string; label: string }) => (
    <th className="wam-sort-header cursor-pointer select-none px-3 py-2 text-left text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => {
      if (activeTab === "1") { if (robotSortKey === col) setRobotSortDir(robotSortDir === "asc" ? "desc" : "asc"); else { setRobotSortKey(col); setRobotSortDir("asc") } }
      else if (activeTab === "2") { if (taskSortKey === col) setTaskSortDir(taskSortDir === "asc" ? "desc" : "asc"); else { setTaskSortKey(col); setTaskSortDir("asc") } }
      else if (activeTab === "3") { if (errSortKey === col) setErrSortDir(errSortDir === "asc" ? "desc" : "asc"); else { setErrSortKey(col); setErrSortDir("asc") } }
      else if (activeTab === "4") { if (maintSortKey === col) setMaintSortDir(maintSortDir === "asc" ? "desc" : "asc"); else { setMaintSortKey(col); setMaintSortDir("asc") } }
    }}>
      <div className="flex items-center gap-0.5">{label}<ArrowUpDown className="h-3 w-3" /></div>
    </th>
  )

  return (
    <div className="wam-root space-y-6">
      <PageHeader title="Warehouse Automation Management" description="Robot fleet monitoring, task dispatch, error diagnostics & automation analytics" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex w-full overflow-x-auto">
          {["Automation Dashboard", "Robot Fleet Management", "Task Queue & Dispatch", "Error & Diagnostics", "Maintenance Schedule", "Automation Analytics"].map((t, i) => (
            <TabsTrigger key={t} value={String(i)} className="text-xs">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ===== TAB 0 – Automation Dashboard ===== */}
        <TabsContent value="0" className="space-y-6 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Robots", value: data.robots.length, icon: <Bot className="h-4 w-4 text-indigo-500" /> },
              { label: "Active Robots", value: activeRobots, icon: <Activity className="h-4 w-4 text-emerald-500" /> },
              { label: "Tasks Completed Today", value: tasksToday, icon: <Package className="h-4 w-4 text-cyan-500" /> },
              { label: "Avg Pick Rate/hr", value: avgPickRate, icon: <Gauge className="h-4 w-4 text-amber-500" /> },
              { label: "Automation Coverage %", value: `${automationCoverage}%`, icon: <Cpu className="h-4 w-4 text-indigo-500" /> },
              { label: "Error Rate %", value: `${errorRate}%`, icon: <AlertTriangle className="h-4 w-4 text-rose-500" /> },
              { label: "Uptime %", value: `${uptimePct}%`, icon: <Zap className="h-4 w-4 text-emerald-500" /> },
              { label: "Cost Savings", value: formatINR(costSavings), icon: <IndianRupee className="h-4 w-4 text-orange-500" /> },
            ].map(k => (
              <Card key={k.label}>
                <CardContent className="glass-subtle p-3 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">{k.icon}</div>
                  <div><p className="text-[10px] text-slate-500 dark:text-slate-400">{k.label}</p><p className="text-lg font-bold text-slate-800 dark:text-slate-100">{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Hourly Throughput (Stacked)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={data.hourlyThroughput}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                    <Tooltip /><Legend />
                    <Area type="monotone" dataKey="manual" stackId="a" fill="#475569" stroke="#475569" name="Manual" />
                    <Area type="monotone" dataKey="semiAuto" stackId="a" fill={C.amber} stroke={C.amber} name="Semi-Auto" />
                    <Area type="monotone" dataKey="fullyAuto" stackId="a" fill={C.indigo} stroke={C.indigo} name="Fully Auto" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Automation Type Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={data.automationPie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={undefined}>
                      {data.automationPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie><Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Zone Coverage</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.zoneCoverage}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={70} /><YAxis tick={{ fontSize: 10 }} />
                  <Tooltip /><Legend /><Bar dataKey="coverage" fill={C.indigo} radius={[6, 6, 0, 0]} name="Coverage %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Fleet Type Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data.ROBOT_TYPES.map(t => ({ name: t, value: data.robots.filter(r => r.type === t).length }))} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={undefined}>
                    {data.ROBOT_TYPES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie><Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Cost & Savings Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900">
                  <p className="text-[10px] text-indigo-500 font-medium">Fleet Investment</p>
                  <p className="text-base font-bold text-indigo-700 dark:text-indigo-200">{formatINR(48500000)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950 border border-cyan-100 dark:border-cyan-900">
                  <p className="text-[10px] text-cyan-500 font-medium">Annual Savings</p>
                  <p className="text-base font-bold text-cyan-700 dark:text-cyan-200">{formatINR(12800000)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900">
                  <p className="text-[10px] text-emerald-500 font-medium">Labor Cost Saved</p>
                  <p className="text-base font-bold text-emerald-700 dark:text-emerald-200">{formatINR(8200000)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900">
                  <p className="text-[10px] text-amber-500 font-medium">Operational Cost</p>
                  <p className="text-base font-bold text-amber-700 dark:text-amber-200">{formatINR(6400000)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 1 – Robot Fleet Management ===== */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Active", "Idle", "Charging", "Error"].map(status => {
              const count = data.robots.filter(r => r.status === status).length
              const color = status === "Active" ? "text-emerald-600" : status === "Idle" ? "text-slate-500" : status === "Charging" ? "text-amber-600" : "text-red-600"
              return (
                <Card key={status}>
                  <CardContent className="glass-subtle p-3 flex items-center gap-3">
                    <RobotStatusBadge status={status} />
                    <div><p className="text-[10px] text-slate-500 dark:text-slate-400">{status}</p><p className={cn("text-lg font-bold", color)}>{count}</p></div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" /><Input placeholder="Search robots..." value={robotSearch} onChange={e => setRobotSearch(e.target.value)} className="pl-8 h-9 text-sm" /></div>
            <Select value={robotStatusFilter} onValueChange={setRobotStatusFilter}><SelectTrigger className="w-[130px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{data.ROBOT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <Select value={robotTypeFilter} onValueChange={setRobotTypeFilter}><SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent>{data.ROBOT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            <Select value={robotZoneFilter} onValueChange={setRobotZoneFilter}><SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Zone" /></SelectTrigger><SelectContent>{data.ZONES.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredRobots.map(r => <RobotCard key={r.id} robot={r as unknown as typeof data.robots[0]} onClick={() => openSheet(r as unknown as typeof data.robots[0])} />)}
          </div>
          <Card>
            <CardContent className="glass-subtle p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-slate-50 dark:bg-slate-800 text-left text-xs text-slate-500 dark:text-slate-400">
                    <SortHeader col="id" label="Robot ID" /><SortHeader col="type" label="Type" /><SortHeader col="zone" label="Zone" /><SortHeader col="status" label="Status" /><SortHeader col="battery" label="Battery" /><SortHeader col="tasksCompleted" label="Tasks" /><SortHeader col="uptime" label="Uptime" /><th className="px-3 py-2">Errors</th>
                  </tr></thead>
                  <tbody>{filteredRobots.map(r => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => openSheet(r as unknown as typeof data.robots[0])}>
                      <td className="px-3 py-2 font-mono font-semibold text-xs">{r.id}</td>
                      <td className="px-3 py-2"><RobotTypeBadge type={r.type as string} /></td>
                      <td className="px-3 py-2 text-[10px]">{r.zone}</td>
                      <td className="px-3 py-2"><RobotStatusBadge status={r.status} /></td>
                      <td className="px-3 py-2"><BatteryLevelBar battery={r.battery as number} /></td>
                      <td className="px-3 py-2 font-mono text-xs">{r.tasksCompleted}</td>
                      <td className="px-3 py-2"><UptimeBar uptime={r.uptime as number} /></td>
                      <td className="px-3 py-2"><ErrorCountBadge count={r.errorCount as number} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 2 – Task Queue & Dispatch ===== */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" /><Input placeholder="Search tasks..." value={taskSearch} onChange={e => setTaskSearch(e.target.value)} className="pl-8 h-9 text-sm" /></div>
            <Select value={taskStatusFilter} onValueChange={setTaskStatusFilter}><SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{data.TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <Select value={taskTypeFilter} onValueChange={setTaskTypeFilter}><SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent>{data.TASK_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card>
            <CardContent className="glass-subtle p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-slate-50 dark:bg-slate-800 text-left text-xs text-slate-500 dark:text-slate-400">
                    <SortHeader col="id" label="Task ID" /><SortHeader col="type" label="Type" /><th className="px-3 py-2">Robot</th><SortHeader col="priority" label="Priority" /><SortHeader col="status" label="Status" /><th className="px-3 py-2">Pickup</th><th className="px-3 py-2">Drop</th><SortHeader col="weight" label="Weight (kg)" /><th className="px-3 py-2">ETA</th><SortHeader col="createdAt" label="Created" />
                  </tr></thead>
                  <tbody>{filteredTasks.map(t => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2 font-mono font-semibold text-xs">{t.id}</td>
                      <td className="px-3 py-2"><TaskTypeBadge type={t.type} /></td>
                      <td className="px-3 py-2 font-mono text-[10px]">{t.assignedRobot}</td>
                      <td className="px-3 py-2"><TaskPriorityBadge priority={t.priority} /></td>
                      <td className="px-3 py-2"><TaskStatusBadge status={t.status} /></td>
                      <td className="px-3 py-2"><LocationBadge location={t.pickupLocation} /></td>
                      <td className="px-3 py-2"><LocationBadge location={t.dropLocation} /></td>
                      <td className="px-3 py-2 font-mono text-xs">{t.weight}</td>
                      <td className="px-3 py-2 text-[10px]">{t.eta}</td>
                      <td className="px-3 py-2 text-[10px]">{t.createdAt}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 3 – Error & Diagnostics ===== */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Errors", value: data.errors.length, color: "text-rose-600 dark:text-rose-400" },
              { label: "Critical", value: data.errors.filter(e => e.severity === "Critical").length, color: "text-red-600 dark:text-red-400" },
              { label: "Auto-recovered", value: data.errors.filter(e => e.resolution === "Auto-recovered").length, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Avg Downtime (min)", value: Math.round(data.errors.reduce((s, e) => s + e.downtime, 0) / data.errors.length), color: "text-amber-600 dark:text-amber-400" },
            ].map(k => (
              <Card key={k.label}><CardContent className="glass-subtle p-3"><p className="text-[10px] text-slate-500 dark:text-slate-400">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></CardContent></Card>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" /><Input placeholder="Search errors..." value={errSearch} onChange={e => setErrSearch(e.target.value)} className="pl-8 h-9 text-sm" /></div>
            <Select value={errSeverityFilter} onValueChange={setErrSeverityFilter}><SelectTrigger className="w-[130px] h-9 text-sm"><SelectValue placeholder="Severity" /></SelectTrigger><SelectContent>{data.SEVERITIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card>
            <CardContent className="glass-subtle p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-slate-50 dark:bg-slate-800 text-left text-xs text-slate-500 dark:text-slate-400">
                    <SortHeader col="id" label="Error ID" /><th className="px-3 py-2">Robot</th><SortHeader col="errorType" label="Error Type" /><SortHeader col="severity" label="Severity" /><th className="px-3 py-2">Description</th><th className="px-3 py-2">Zone</th><SortHeader col="occurredAt" label="Occurred" /><th className="px-3 py-2">Resolution</th><SortHeader col="downtime" label="Downtime" />
                  </tr></thead>
                  <tbody>{filteredErrors.map(e => (
                    <tr key={e.id} className={cn("border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50", e.severity === "Critical" && "bg-red-50/50 dark:bg-red-950/20")}>
                      <td className="px-3 py-2 font-mono font-semibold text-xs">{e.id}</td>
                      <td className="px-3 py-2 font-mono text-[10px]">{e.robotId}</td>
                      <td className="px-3 py-2"><ErrorTypeBadge type={e.errorType} /></td>
                      <td className="px-3 py-2"><ErrorSeverityBadge severity={e.severity} /></td>
                      <td className="px-3 py-2 text-[10px] max-w-[200px] truncate">{e.description}</td>
                      <td className="px-3 py-2 text-[10px]">{e.zone}</td>
                      <td className="px-3 py-2 text-[10px]">{e.occurredAt}</td>
                      <td className="px-3 py-2"><ResolutionBadge resolution={e.resolution} /></td>
                      <td className="px-3 py-2"><DowntimeTile minutes={e.downtime} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 4 – Maintenance Schedule ===== */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Scheduled", value: data.maintenance.filter(m => m.status === "Scheduled").length, color: "text-blue-600 dark:text-blue-400" },
              { label: "In Progress", value: data.maintenance.filter(m => m.status === "In Progress").length, color: "text-cyan-600 dark:text-cyan-400" },
              { label: "Overdue", value: data.maintenance.filter(m => m.status === "Overdue").length, color: "text-amber-600 dark:text-amber-400" },
              { label: "Total Cost", value: formatINR(data.maintenance.reduce((s, m) => s + m.cost, 0)), color: "text-rose-600 dark:text-rose-400" },
            ].map(k => (
              <Card key={k.label}><CardContent className="glass-subtle p-3"><p className="text-[10px] text-slate-500 dark:text-slate-400">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></CardContent></Card>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" /><Input placeholder="Search maintenance..." value={maintSearch} onChange={e => setMaintSearch(e.target.value)} className="pl-8 h-9 text-sm" /></div>
            <Select value={maintStatusFilter} onValueChange={setMaintStatusFilter}><SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{data.MAINT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <Select value={maintTypeFilter} onValueChange={setMaintTypeFilter}><SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent>{data.MAINT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card>
            <CardContent className="glass-subtle p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-slate-50 dark:bg-slate-800 text-left text-xs text-slate-500 dark:text-slate-400">
                    <SortHeader col="id" label="Maint ID" /><th className="px-3 py-2">Robot</th><SortHeader col="type" label="Type" /><SortHeader col="scheduledDate" label="Date" /><th className="px-3 py-2">Technician</th><SortHeader col="status" label="Status" /><SortHeader col="duration" label="Duration (hrs)" /><th className="px-3 py-2">Parts</th><SortHeader col="cost" label="Cost" />
                  </tr></thead>
                  <tbody>{filteredMaint.map(m => (
                    <tr key={m.id} className={cn("border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50", m.status === "Overdue" && "bg-amber-50/50 dark:bg-amber-950/20")}>
                      <td className="px-3 py-2 font-mono font-semibold text-xs">{m.id}</td>
                      <td className="px-3 py-2 font-mono text-[10px]">{m.robotId}</td>
                      <td className="px-3 py-2"><MaintenanceTypeBadge type={m.type} /></td>
                      <td className="px-3 py-2 text-[10px]">{m.scheduledDate}</td>
                      <td className="px-3 py-2 text-[10px]">{m.assignedTech}</td>
                      <td className="px-3 py-2"><MaintenanceStatusBadge status={m.status} /></td>
                      <td className="px-3 py-2 font-mono text-xs">{m.duration}</td>
                      <td className="px-3 py-2 text-[10px] max-w-[120px] truncate">{m.partsUsed}</td>
                      <td className="px-3 py-2"><CostTile cost={m.cost} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 5 – Automation Analytics ===== */}
        <TabsContent value="5" className="space-y-6 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {analyticsKPIs.map(k => (
              <Card key={k.label}><CardContent className="glass-subtle p-3"><p className="text-[10px] text-slate-500 dark:text-slate-400">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></CardContent></Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Daily Performance (14 Days)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.dailyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                    <Tooltip /><Legend />
                    <Line type="monotone" dataKey="agv" stroke={C.indigo} strokeWidth={2} name="AGV" />
                    <Line type="monotone" dataKey="amr" stroke={C.cyan} strokeWidth={2} name="AMR" />
                    <Line type="monotone" dataKey="asrs" stroke={C.emerald} strokeWidth={2} name="ASRS" />
                    <Line type="monotone" dataKey="conveyor" stroke={C.amber} strokeWidth={2} name="Conveyor" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Zone-wise Throughput</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.zoneThroughput}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={70} /><YAxis tick={{ fontSize: 10 }} />
                    <Tooltip /><Legend /><Bar dataKey="throughput" fill={C.cyan} radius={[6, 6, 0, 0]} name="Throughput" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Error Trend (Daily by Type)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.errorTrend}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                    <Tooltip /><Legend />
                    <Bar dataKey="pathObstruction" stackId="e" fill={C.indigo} name="Path Obstruction" />
                    <Bar dataKey="sensor" stackId="e" fill={C.cyan} name="Sensor" />
                    <Bar dataKey="battery" stackId="e" fill={C.amber} name="Battery" />
                    <Bar dataKey="network" stackId="e" fill={C.orange} name="Network" />
                    <Bar dataKey="motor" stackId="e" fill={C.rose} name="Motor" />
                    <Bar dataKey="software" stackId="e" fill="#7c3aed" name="Software" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">ROI Stacked Area (6-Month)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={data.roiData}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="laborSavings" stackId="r" fill={C.indigo} stroke={C.indigo} name="Labor Savings" />
                    <Area type="monotone" dataKey="throughputGain" stackId="r" fill={C.cyan} stroke={C.cyan} name="Throughput Gain" />
                    <Area type="monotone" dataKey="errorReduction" stackId="r" fill={C.emerald} stroke={C.emerald} name="Error Reduction" />
                    <Area type="monotone" dataKey="maintenanceCost" stackId="r" fill={C.rose} stroke={C.rose} name="Maintenance Cost" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ===== SHEET – Robot Detail View ===== */}
      {/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */}
      <Sheet open={!!sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <>
            <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-5 rounded-b-xl mb-4 -mx-6 -mt-6">
              <SheetHeader>
                <SheetTitle className="text-white text-base">{sheetRobot?.id ?? "Robot Details"}</SheetTitle>
              </SheetHeader>
              {sheetRobot && (
                <div className="mt-3 flex items-center gap-2">
                  <RobotTypeBadge type={sheetRobot.type} />
                  <RobotStatusBadge status={sheetRobot.status} />
                </div>
              )}
            </div>
            {sheetRobot && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Battery</p>
                    <BatteryLevelBar battery={sheetRobot.battery} />
                  </div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Uptime</p>
                    <UptimeBar uptime={sheetRobot.uptime} />
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Recent Tasks</p>
                  <div className="space-y-1">
                    {data.tasks.filter(t => t.assignedRobot === sheetRobot.id).slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-600 dark:text-slate-300">{t.id}</span>
                        <TaskStatusBadge status={t.status} />
                      </div>
                    ))}
                  </div>
                </div>
                {[
                  { label: "Zone", value: sheetRobot.zone },
                  { label: "Tasks Completed", value: String(sheetRobot.tasksCompleted) },
                  { label: "Last Maintenance", value: sheetRobot.lastMaintenance },
                  { label: "Error Count", value: String(sheetRobot.errorCount) },
                ].map(t => (
                  <div key={t.label} className="flex justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{t.label}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{t.value}</span>
                  </div>
                ))}
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Recent Maintenance</p>
                  <div className="space-y-1">
                    {data.maintenance.filter(m => m.robotId === sheetRobot.id).slice(0, 2).map(m => (
                      <div key={m.id} className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-600 dark:text-slate-300">{m.id}</span>
                        <MaintenanceStatusBadge status={m.status} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => { toast.success("Dispatched", `${sheetRobot.id} dispatched successfully`); setSheetOpen(false) }}>
                    <Play className="h-3.5 w-3.5 mr-1" />Dispatch
                  </Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1" onClick={() => { toast.info("Charging", `${sheetRobot.id} sent to charging station`) }}>
                    <Zap className="h-3.5 w-3.5 mr-1" />Charge
                  </Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1" onClick={() => { toast.warning("Maintenance", `${sheetRobot.id} flagged for maintenance`) }}>
                    <Wrench className="h-3.5 w-3.5 mr-1" />Maintain
                  </Button>
                </div>
              </div>
            )}
          </>
        </SheetContent>
      </Sheet>
    </div>
  )
}
