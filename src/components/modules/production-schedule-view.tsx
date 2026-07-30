"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Clock,
  Activity,
  Hash,
  Percent,
  IndianRupee,
  Play,
  Pause,
  Plus,
  Wrench,
  Timer,
  Calendar,
  ClipboardList,
  Factory,
  Users,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  CalendarRange,
  Gauge,
  Target,
  ListChecks,
  Briefcase,
  Boxes,
  Cog,
  Building2,
  CircleCheck,
  CircleDot,
  Circle,
  CirclePause,
  CircleSlash,
  CalendarClock,
  Layers,
  ArrowRightCircle,
  FileWarning,
  AlertOctagon,
  Flag,
  FlagTriangleRight,
  GanttChartSquare,
  LayoutGrid,
  ListTree,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

type ScheduleStatus =
  | "planned"
  | "released"
  | "started"
  | "in-progress"
  | "delayed"
  | "on-hold"
  | "completed"
  | "cancelled"

type SchedulePriority = "low" | "medium" | "high" | "critical"
type ScheduleType = "production" | "rework" | "prototype" | "maintenance" | "sample"

interface ScheduleDependency {
  fromScheduleId: string
  toScheduleId: string
  type: "finish-to-start" | "start-to-start" | "finish-to-finish"
  lagDays: number
}

interface ScheduleMilestone {
  id: string
  name: string
  date: string
  type: "planned" | "actual" | "milestone"
  status: "pending" | "achieved" | "missed"
  notes: string
}

interface ResourceAllocation {
  resourceType: "work-center" | "operator" | "tool" | "material"
  resourceName: string
  resourceId: string
  allocatedHours: number
  availableHours: number
  utilizationPct: number
  status: "available" | "partial" | "overallocated" | "unavailable"
}

interface CapacityBucket {
  workCenter: string
  date: string
  plannedHours: number
  availableHours: number
  utilizationPct: number
  status: "under" | "normal" | "high" | "over"
}

interface ProductionSchedule {
  id: string
  woRef: string
  bomRef: string
  qipRef: string
  title: string
  partNo: string
  partDescription: string
  customer: string
  warehouse: string
  workCenter: string
  type: ScheduleType
  status: ScheduleStatus
  priority: SchedulePriority
  orderQty: number
  plannedStart: string // ISO date
  plannedEnd: string // ISO date
  actualStart: string | null
  actualEnd: string | null
  plannedHours: number
  actualHours: number
  progressPct: number
  delayDays: number
  color: string
  dependencies: ScheduleDependency[]
  milestones: ScheduleMilestone[]
  resourceAllocations: ResourceAllocation[]
  supervisor: string
  createdAt: string
  notes: string
}

// ──────────────────────────────────────────────────────────
// META
// ──────────────────────────────────────────────────────────

const STATUS_META: Record<
  ScheduleStatus,
  { label: string; color: string; bg: string; border: string; pieColor: string; barColor: string; icon: React.ComponentType<{ className?: string }> }
> = {
  planned:     { label: "Planned",     color: "text-slate-700",    bg: "bg-slate-100",    border: "border-slate-200",    pieColor: "#64748b", barColor: "#94a3b8", icon: Circle },
  released:    { label: "Released",    color: "text-blue-700",     bg: "bg-blue-50",      border: "border-blue-200",     pieColor: "#3b82f6", barColor: "#3b82f6", icon: CircleDot },
  started:     { label: "Started",     color: "text-cyan-700",     bg: "bg-cyan-50",      border: "border-cyan-200",     pieColor: "#06b6d4", barColor: "#22d3ee", icon: Play },
  "in-progress": { label: "In Progress", color: "text-violet-700", bg: "bg-violet-50",    border: "border-violet-200",   pieColor: "#8b5cf6", barColor: "#a78bfa", icon: Activity },
  delayed:     { label: "Delayed",     color: "text-rose-700",     bg: "bg-rose-50",      border: "border-rose-200",     pieColor: "#ef4444", barColor: "#f87171", icon: AlertTriangle },
  "on-hold":   { label: "On Hold",     color: "text-amber-700",    bg: "bg-amber-50",     border: "border-amber-200",    pieColor: "#f59e0b", barColor: "#fbbf24", icon: CirclePause },
  completed:   { label: "Completed",   color: "text-emerald-700",  bg: "bg-emerald-50",   border: "border-emerald-200",  pieColor: "#10b981", barColor: "#34d399", icon: CircleCheck },
  cancelled:   { label: "Cancelled",   color: "text-rose-700",     bg: "bg-rose-50",      border: "border-rose-200",     pieColor: "#dc2626", barColor: "#fda4af", icon: CircleSlash },
}

const PRIORITY_META: Record<SchedulePriority, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  low:      { label: "Low",      color: "text-slate-700", bg: "bg-slate-100", icon: Flag },
  medium:   { label: "Medium",   color: "text-blue-700",  bg: "bg-blue-50",   icon: Flag },
  high:     { label: "High",     color: "text-amber-700", bg: "bg-amber-50",  icon: FlagTriangleRight },
  critical: { label: "Critical", color: "text-rose-700",  bg: "bg-rose-50",   icon: FlagTriangleRight },
}

const TYPE_META: Record<ScheduleType, { label: string; color: string; bg: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  production:   { label: "Production",   color: "text-blue-700",    bg: "bg-blue-50",    pieColor: "#3b82f6", icon: Factory },
  rework:       { label: "Rework",       color: "text-amber-700",   bg: "bg-amber-50",   pieColor: "#f59e0b", icon: Wrench },
  prototype:    { label: "Prototype",    color: "text-violet-700",  bg: "bg-violet-50",  pieColor: "#8b5cf6", icon: Layers },
  maintenance:  { label: "Maintenance",  color: "text-teal-700",    bg: "bg-teal-50",    pieColor: "#14b8a6", icon: Cog },
  sample:       { label: "Sample",       color: "text-pink-700",    bg: "bg-pink-50",    pieColor: "#ec4899", icon: ClipboardList },
}

const MILESTONE_STATUS: Record<
  ScheduleMilestone["status"],
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending:   { label: "Pending",   color: "text-slate-700",  bg: "bg-slate-100", icon: Circle },
  achieved:  { label: "Achieved",  color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2 },
  missed:    { label: "Missed",    color: "text-rose-700",   bg: "bg-rose-50",    icon: XCircle },
}

const RESOURCE_STATUS: Record<
  ResourceAllocation["status"],
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  available:     { label: "Available",     color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2 },
  partial:       { label: "Partial",       color: "text-amber-700",   bg: "bg-amber-50",   icon: CircleDot },
  overallocated: { label: "Overallocated", color: "text-rose-700",    bg: "bg-rose-50",    icon: AlertTriangle },
  unavailable:   { label: "Unavailable",   color: "text-slate-700",   bg: "bg-slate-100",  icon: CircleSlash },
}

const RESOURCE_TYPE_META: Record<
  ResourceAllocation["resourceType"],
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "work-center": { label: "Work Center", color: "text-blue-700",   bg: "bg-blue-50",   icon: Factory },
  operator:      { label: "Operator",    color: "text-violet-700", bg: "bg-violet-50", icon: Users },
  tool:          { label: "Tool",        color: "text-amber-700",  bg: "bg-amber-50",  icon: Wrench },
  material:      { label: "Material",    color: "text-teal-700",   bg: "bg-teal-50",   icon: Boxes },
}

// ──────────────────────────────────────────────────────────
// DETERMINISTIC HASH + MOCK DATA GEN
// ──────────────────────────────────────────────────────────

function hash(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) & 0x7fffffff
  }
  return h
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

// Reference window: 2026-07-20 to 2026-08-10 (3-week planning horizon)
// Each schedule is positioned within this window
const SCHEDULE_SEEDS: Array<{
  id: string
  woRef: string
  bomRef: string
  qipRef: string
  title: string
  partNo: string
  partDescription: string
  customer: string
  warehouse: string
  workCenter: string
  type: ScheduleType
  status: ScheduleStatus
  priority: SchedulePriority
  orderQty: number
  plannedStart: string
  plannedEnd: string
  actualStart: string | null
  actualEnd: string | null
  plannedHours: number
  actualHours: number
  progressPct: number
  delayDays: number
  color: string
  supervisor: string
}> = [
  { id: "SCH-2026-7001", woRef: "WO-2026-5001", bomRef: "BOM-1001", qipRef: "QIP-2000", title: "Brake Pad Assembly — 500 units", partNo: "BP-1001", partDescription: "Brake Pad Assembly — Passenger Car", customer: "Tata Motors", warehouse: "Chennai Hub", workCenter: "WC-ASSY-01", type: "production", status: "in-progress", priority: "high", orderQty: 500, plannedStart: "2026-07-20", plannedEnd: "2026-07-28", actualStart: "2026-07-20", actualEnd: null, plannedHours: 80, actualHours: 52, progressPct: 64, delayDays: 0, color: "#8b5cf6", supervisor: "Rajesh Kumar" },
  { id: "SCH-2026-7002", woRef: "WO-2026-5002", bomRef: "BOM-1002", qipRef: "QIP-2001", title: "Wheel Rim Machining — 300 units", partNo: "WR-2002", partDescription: "Wheel Rim 17\" Machined", customer: "Mahindra", warehouse: "Chennai Hub", workCenter: "WC-CNC-02", type: "production", status: "in-progress", priority: "medium", orderQty: 300, plannedStart: "2026-07-21", plannedEnd: "2026-07-29", actualStart: "2026-07-21", actualEnd: null, plannedHours: 64, actualHours: 41, progressPct: 60, delayDays: 0, color: "#3b82f6", supervisor: "Priya Sharma" },
  { id: "SCH-2026-7003", woRef: "WO-2026-5003", bomRef: "BOM-1003", qipRef: "QIP-2002", title: "Engine Block Casting — 80 units", partNo: "EB-3003", partDescription: "Engine Block Cast Iron V3", customer: "Ashok Leyland", warehouse: "Pune Plant", workCenter: "WC-CAST-01", type: "production", status: "delayed", priority: "critical", orderQty: 80, plannedStart: "2026-07-18", plannedEnd: "2026-07-30", actualStart: "2026-07-18", actualEnd: null, plannedHours: 120, actualHours: 88, progressPct: 60, delayDays: 2, color: "#ef4444", supervisor: "Arun Gupta" },
  { id: "SCH-2026-7004", woRef: "WO-2026-5004", bomRef: "BOM-1004", qipRef: "QIP-2003", title: "Caliper Seal Assembly — 1000 units", partNo: "CS-4004", partDescription: "Caliper Seal Assembly", customer: "Bosch India", warehouse: "Chennai Hub", workCenter: "WC-ASSY-02", type: "production", status: "completed", priority: "high", orderQty: 1000, plannedStart: "2026-07-12", plannedEnd: "2026-07-22", actualStart: "2026-07-12", actualEnd: "2026-07-22", plannedHours: 96, actualHours: 102, progressPct: 100, delayDays: 0, color: "#10b981", supervisor: "Rajesh Kumar" },
  { id: "SCH-2026-7005", woRef: "WO-2026-5005", bomRef: "BOM-1005", qipRef: "QIP-2004", title: "Shock Absorber Damping — 600 units", partNo: "SA-5005", partDescription: "Shock Absorber Rear Damping", customer: "Honda Motorcycle", warehouse: "Pune Plant", workCenter: "WC-ASSY-03", type: "production", status: "started", priority: "medium", orderQty: 600, plannedStart: "2026-07-25", plannedEnd: "2026-08-02", actualStart: "2026-07-25", actualEnd: null, plannedHours: 72, actualHours: 9, progressPct: 8, delayDays: 0, color: "#06b6d4", supervisor: "Priya Sharma" },
  { id: "SCH-2026-7006", woRef: "WO-2026-5006", bomRef: "BOM-1006", qipRef: "QIP-2005", title: "Li-Ion Battery Pack Prototype — 25 units", partNo: "BT-6006", partDescription: "Li-Ion Battery Pack 48V", customer: "Ather Energy", warehouse: "Bengaluru Plant", workCenter: "WC-ASSY-04", type: "prototype", status: "in-progress", priority: "critical", orderQty: 25, plannedStart: "2026-07-22", plannedEnd: "2026-08-05", actualStart: "2026-07-22", actualEnd: null, plannedHours: 160, actualHours: 79, progressPct: 48, delayDays: 0, color: "#8b5cf6", supervisor: "Sneha Reddy" },
  { id: "SCH-2026-7007", woRef: "WO-2026-5007", bomRef: "BOM-1007", qipRef: "QIP-2006", title: "Tire Bead Vulcanization — 1200 units", partNo: "TB-7007", partDescription: "Tire Bead 18\" Heavy Duty", customer: "MRF Tyres", warehouse: "Chennai Hub", workCenter: "WC-VULC-01", type: "production", status: "released", priority: "low", orderQty: 1200, plannedStart: "2026-07-27", plannedEnd: "2026-08-04", actualStart: null, actualEnd: null, plannedHours: 96, actualHours: 0, progressPct: 0, delayDays: 0, color: "#3b82f6", supervisor: "Arun Gupta" },
  { id: "SCH-2026-7008", woRef: "WO-2026-5008", bomRef: "BOM-1008", qipRef: "QIP-2007", title: "Wiring Harness — 800 units", partNo: "WH-8008", partDescription: "Wiring Harness Continuity", customer: "TVS Motors", warehouse: "Bengaluru Plant", workCenter: "WC-ASSY-05", type: "production", status: "in-progress", priority: "high", orderQty: 800, plannedStart: "2026-07-19", plannedEnd: "2026-07-29", actualStart: "2026-07-19", actualEnd: null, plannedHours: 80, actualHours: 51, progressPct: 60, delayDays: 0, color: "#8b5cf6", supervisor: "Sneha Reddy" },
  { id: "SCH-2026-7009", woRef: "WO-2026-5009", bomRef: "BOM-1009", qipRef: "QIP-2008", title: "Engine Bolt Forging — 5000 units", partNo: "EB-9009", partDescription: "Engine Bolt M12 Tensile", customer: "Tata Motors", warehouse: "Pune Plant", workCenter: "WC-FORG-01", type: "production", status: "completed", priority: "medium", orderQty: 5000, plannedStart: "2026-07-05", plannedEnd: "2026-07-18", actualStart: "2026-07-05", actualEnd: "2026-07-18", plannedHours: 104, actualHours: 110, progressPct: 100, delayDays: 0, color: "#10b981", supervisor: "Rajesh Kumar" },
  { id: "SCH-2026-7010", woRef: "WO-2026-5010", bomRef: "BOM-1010", qipRef: "QIP-2009", title: "Engine Oil Blending — 2000 L", partNo: "OL-1010", partDescription: "Engine Oil SAE 15W-40", customer: "Castrol India", warehouse: "Mumbai DC", workCenter: "WC-BLD-01", type: "production", status: "completed", priority: "low", orderQty: 2000, plannedStart: "2026-07-10", plannedEnd: "2026-07-20", actualStart: "2026-07-10", actualEnd: "2026-07-19", plannedHours: 80, actualHours: 78, progressPct: 100, delayDays: 0, color: "#10b981", supervisor: "Priya Sharma" },
  { id: "SCH-2026-7011", woRef: "WO-2026-5011", bomRef: "BOM-1011", qipRef: "QIP-2010", title: "Windshield Tempering — 200 units", partNo: "WS-1011", partDescription: "Windshield Optical Grade", customer: "Maruti Suzuki", warehouse: "Delhi NCR Hub", workCenter: "WC-TEMP-01", type: "production", status: "cancelled", priority: "low", orderQty: 200, plannedStart: "2026-07-15", plannedEnd: "2026-07-25", actualStart: null, actualEnd: null, plannedHours: 80, actualHours: 0, progressPct: 0, delayDays: 0, color: "#94a3b8", supervisor: "Arun Gupta" },
  { id: "SCH-2026-7012", woRef: "WO-2026-5012", bomRef: "BOM-1012", qipRef: "QIP-2011", title: "Radiator Cap Rework — 400 units", partNo: "RC-1012", partDescription: "Radiator Cap Pressure 1.1 bar", customer: "Honda Cars", warehouse: "Pune Plant", workCenter: "WC-STMP-01", type: "rework", status: "in-progress", priority: "high", orderQty: 400, plannedStart: "2026-07-22", plannedEnd: "2026-07-30", actualStart: "2026-07-22", actualEnd: null, plannedHours: 56, actualHours: 32, progressPct: 55, delayDays: 0, color: "#f59e0b", supervisor: "Rajesh Kumar" },
  { id: "SCH-2026-7013", woRef: "WO-2026-5013", bomRef: "BOM-1013", qipRef: "QIP-2012", title: "Air Filter Production — 1500 units", partNo: "AF-1013", partDescription: "Air Filter Dust Efficiency", customer: "Bosch India", warehouse: "Chennai Hub", workCenter: "WC-ASSY-06", type: "production", status: "planned", priority: "medium", orderQty: 1500, plannedStart: "2026-07-29", plannedEnd: "2026-08-08", actualStart: null, actualEnd: null, plannedHours: 88, actualHours: 0, progressPct: 0, delayDays: 0, color: "#94a3b8", supervisor: "Sneha Reddy" },
  { id: "SCH-2026-7014", woRef: "WO-2026-5014", bomRef: "BOM-1014", qipRef: "QIP-2013", title: "Spark Plug Sample — 50 units", partNo: "SP-1014", partDescription: "Spark Plug Gap 0.9mm", customer: "NGK Spark Plugs", warehouse: "Bengaluru Plant", workCenter: "WC-ASSY-07", type: "sample", status: "completed", priority: "low", orderQty: 50, plannedStart: "2026-07-12", plannedEnd: "2026-07-16", actualStart: "2026-07-12", actualEnd: "2026-07-15", plannedHours: 32, actualHours: 30, progressPct: 100, delayDays: 0, color: "#10b981", supervisor: "Priya Sharma" },
  { id: "SCH-2026-7015", woRef: "WO-2026-5015", bomRef: "BOM-1015", qipRef: "QIP-2014", title: "Clutch Assembly Prototype — 10 units", partNo: "CA-1015", partDescription: "Clutch Assembly FAI", customer: "Mahindra", warehouse: "Pune Plant", workCenter: "WC-ASSY-08", type: "prototype", status: "on-hold", priority: "critical", orderQty: 10, plannedStart: "2026-07-15", plannedEnd: "2026-07-28", actualStart: "2026-07-15", actualEnd: null, plannedHours: 120, actualHours: 84, progressPct: 60, delayDays: 0, color: "#f59e0b", supervisor: "Arun Gupta" },
  { id: "SCH-2026-7016", woRef: "WO-2026-5016", bomRef: "BOM-1016", qipRef: "QIP-2015", title: "Helmet Shell Molding — 800 units", partNo: "HS-1016", partDescription: "Helmet Shell Impact Test", customer: "Steelbird", warehouse: "Delhi NCR Hub", workCenter: "WC-MOLD-01", type: "production", status: "released", priority: "medium", orderQty: 800, plannedStart: "2026-07-28", plannedEnd: "2026-08-05", actualStart: null, actualEnd: null, plannedHours: 80, actualHours: 0, progressPct: 0, delayDays: 0, color: "#3b82f6", supervisor: "Sneha Reddy" },
]

function genMilestones(seed: number, plannedStart: string, plannedEnd: string, status: ScheduleStatus): ScheduleMilestone[] {
  const h = hash(`ms-${seed}`)
  if (status === "planned" || status === "released" || status === "cancelled") {
    return [
      { id: `MS-${seed}-1`, name: "Material Issue", date: plannedStart, type: "planned", status: "pending", notes: "Raw material issued from stores to work center" },
      { id: `MS-${seed}-2`, name: "Production Start", date: plannedStart, type: "planned", status: "pending", notes: "First piece starts production" },
      { id: `MS-${seed}-3`, name: "In-Process Inspection", date: plannedEnd, type: "planned", status: "pending", notes: "QIP in-process inspection during production" },
      { id: `MS-${seed}-4`, name: "Final Inspection", date: plannedEnd, type: "planned", status: "pending", notes: "QIP final inspection on completed pieces" },
    ]
  }
  const isCompleted = status === "completed"
  return [
    { id: `MS-${seed}-1`, name: "Material Issue", date: plannedStart, type: "actual", status: "achieved", notes: "Material issued on schedule" },
    { id: `MS-${seed}-2`, name: "Production Start", date: plannedStart, type: "actual", status: "achieved", notes: "First piece started on time" },
    { id: `MS-${seed}-3`, name: "In-Process Inspection", date: plannedEnd, type: isCompleted ? "actual" : "planned", status: isCompleted ? "achieved" : "achieved", notes: "Inspection completed per QIP" },
    { id: `MS-${seed}-4`, name: "Final Inspection", date: plannedEnd, type: isCompleted ? "actual" : "planned", status: isCompleted ? "achieved" : status === "delayed" ? "missed" : "pending", notes: isCompleted ? "All pieces inspected and approved" : status === "delayed" ? "Final inspection delayed due to production slippage" : "Pending completion of production run" },
    { id: `MS-${seed}-5`, name: "Customer Delivery", date: plannedEnd, type: isCompleted ? "actual" : "milestone", status: isCompleted ? "achieved" : "pending", notes: isCompleted ? "Shipment delivered to customer" : "Customer delivery scheduled" },
  ]
}

function genResourceAllocations(seed: number, workCenter: string): ResourceAllocation[] {
  const h = hash(`res-${seed}`)
  const baseResources: Array<Omit<ResourceAllocation, "allocatedHours" | "availableHours" | "utilizationPct" | "status">> = [
    { resourceType: "work-center", resourceName: workCenter, resourceId: workCenter },
    { resourceType: "operator", resourceName: pick(["Ravi Patel", "Sunil Yadav", "Anita Desai", "Manoj Singh"], h), resourceId: `OP-${(h % 1000).toString().padStart(3, "0")}` },
    { resourceType: "tool", resourceName: pick(["CNC Tool Set A", "Press Tool #3", "Inspection Gauge G-12", "Welding Fixture W-7"], h >> 2), resourceId: `TL-${((h >> 2) % 1000).toString().padStart(3, "0")}` },
    { resourceType: "material", resourceName: pick(["Steel Sheet CR 2mm", "Cast Iron Block", "Rubber Compound", "Aluminum Alloy 6061"], h >> 4), resourceId: `RM-${((h >> 4) % 1000).toString().padStart(3, "0")}` },
  ]
  const statuses: ResourceAllocation["status"][] = ["available", "partial", "overallocated", "unavailable"]
  return baseResources.map((r, i) => {
    const rh = hash(`res-${seed}-${i}`)
    const allocated = 20 + (rh % 80)
    const available = 80 + (rh % 40)
    const util = Math.round((allocated / available) * 100)
    const status: ResourceAllocation["status"] = util < 60 ? "available" : util < 90 ? "partial" : util < 110 ? "partial" : "overallocated"
    return {
      ...r,
      allocatedHours: allocated,
      availableHours: available,
      utilizationPct: Math.min(120, util),
      status,
    }
  })
}

// Build the schedule list
const SCHEDULES: ProductionSchedule[] = SCHEDULE_SEEDS.map((s) => {
  const milestones = genMilestones(hash(s.id), s.plannedStart, s.plannedEnd, s.status)
  const resourceAllocations = genResourceAllocations(hash(s.id), s.workCenter)
  return {
    ...s,
    milestones,
    resourceAllocations,
    dependencies: [],
    createdAt: "2026-07-10T09:00",
    notes:
      s.priority === "critical"
        ? "Critical-priority schedule — customer SLA at risk. Daily standup review with Plant Director."
        : s.status === "delayed"
        ? "Schedule delayed — recovery plan required. Consider overtime or alternate work center allocation."
        : s.status === "on-hold"
        ? "Schedule paused pending quality review. Material lot under investigation per QIP."
        : "Standard production schedule. Material availability confirmed and capacity reserved.",
  }
})

// Add a few dependencies (finish-to-start)
SCHEDULES[1].dependencies = [{ fromScheduleId: "SCH-2026-7001", toScheduleId: "SCH-2026-7002", type: "finish-to-start", lagDays: 1 }]
SCHEDULES[6].dependencies = [{ fromScheduleId: "SCH-2026-7002", toScheduleId: "SCH-2026-7007", type: "finish-to-start", lagDays: 0 }]
SCHEDULES[12].dependencies = [{ fromScheduleId: "SCH-2026-7008", toScheduleId: "SCH-2026-7013", type: "finish-to-start", lagDays: 0 }]

// ──────────────────────────────────────────────────────────
// STATUS TABS
// ──────────────────────────────────────────────────────────

const STATUS_TABS: Array<{ key: ScheduleStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "planned", label: "Planned" },
  { key: "released", label: "Released" },
  { key: "started", label: "Started" },
  { key: "in-progress", label: "In Progress" },
  { key: "delayed", label: "Delayed" },
  { key: "on-hold", label: "On Hold" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
]

const fmtINR = (n: number) => "₹" + n.toLocaleString("en-IN")
const fmtNum = (n: number) => n.toLocaleString("en-IN")

// ──────────────────────────────────────────────────────────
// GANTT CHART COMPONENT
// ──────────────────────────────────────────────────────────

// Planning horizon: 4 weeks (28 days) from 2026-07-12 to 2026-08-08
const GANTT_START = new Date("2026-07-12")
const GANTT_END = new Date("2026-08-09")
const GANTT_DAYS = Math.ceil((GANTT_END.getTime() - GANTT_START.getTime()) / (1000 * 60 * 60 * 24))

function daysBetween(start: string, end: string): number {
  return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
}

function dayOffset(dateStr: string): number {
  return Math.floor((new Date(dateStr).getTime() - GANTT_START.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

interface GanttChartProps {
  schedules: ProductionSchedule[]
  onBarClick: (s: ProductionSchedule) => void
  selectedId: string | null
}

function GanttChart({ schedules, onBarClick, selectedId }: GanttChartProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const today = new Date("2026-07-26")
  const todayOffset = dayOffset(today.toISOString().slice(0, 10))

  // Generate week markers
  const weeks: { label: string; startOffset: number; endOffset: number }[] = []
  let weekStart = getWeekStart(GANTT_START)
  while (weekStart < GANTT_END) {
    const ws = dayOffset(weekStart.toISOString().slice(0, 10))
    const we = Math.min(GANTT_DAYS, ws + 7)
    weeks.push({
      label: weekStart.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + " — " + new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      startOffset: ws,
      endOffset: we,
    })
    weekStart = new Date(weekStart.getTime() + 7 * 86400000)
  }

  // Generate day labels (every other day for brevity)
  const dayLabels: { offset: number; label: string; isWeekend: boolean }[] = []
  for (let i = 0; i < GANTT_DAYS; i++) {
    const d = new Date(GANTT_START.getTime() + i * 86400000)
    if (i % 2 === 0 || i === GANTT_DAYS - 1) {
      dayLabels.push({
        offset: i,
        label: d.toLocaleDateString("en-IN", { day: "2-digit" }),
        isWeekend: isWeekend(d),
      })
    }
  }

  return (
    <div className="ps-gantt-container overflow-x-auto">
      <div className="min-w-[1100px]">
        {/* Header: week markers */}
        <div className="flex border-b bg-muted/30 sticky top-0 z-20">
          <div className="w-[280px] shrink-0 border-r p-2 text-xs font-semibold">
            <div>Schedule / Work Center</div>
          </div>
          <div className="relative flex-1" style={{ height: 36 }}>
            {/* Week markers */}
            {weeks.map((w, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-r border-l border-muted-foreground/20 bg-muted/40 flex items-center justify-center text-[10px] font-medium text-muted-foreground"
                style={{
                  left: `${(w.startOffset / GANTT_DAYS) * 100}%`,
                  width: `${((w.endOffset - w.startOffset) / GANTT_DAYS) * 100}%`,
                }}
              >
                {w.label}
              </div>
            ))}
            {/* Day labels */}
            <div className="absolute bottom-0 left-0 right-0 flex">
              {dayLabels.map((d, i) => (
                <div
                  key={i}
                  className={cn("absolute text-[9px] text-muted-foreground/80", d.isWeekend && "text-rose-500")}
                  style={{ left: `${(d.offset / GANTT_DAYS) * 100}%` }}
                >
                  {d.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body: one row per schedule */}
        <div>
          {schedules.map((s, idx) => {
            const startOffset = Math.max(0, dayOffset(s.plannedStart))
            const duration = Math.max(1, daysBetween(s.plannedStart, s.plannedEnd))
            const widthPct = (duration / GANTT_DAYS) * 100
            const leftPct = (startOffset / GANTT_DAYS) * 100
            const SM = STATUS_META[s.status]
            const actualStartOffset = s.actualStart ? dayOffset(s.actualStart) : null
            const actualDuration =
              s.actualEnd && s.actualStart
                ? Math.max(1, daysBetween(s.actualStart, s.actualEnd))
                : s.actualStart
                ? Math.max(1, daysBetween(s.actualStart, today.toISOString().slice(0, 10)))
                : 0
            const actualWidthPct = (actualDuration / GANTT_DAYS) * 100
            const actualLeftPct = actualStartOffset !== null ? (actualStartOffset / GANTT_DAYS) * 100 : 0
            const isHovered = hoveredId === s.id
            const isSelected = selectedId === s.id
            return (
              <div
                key={s.id}
                className={cn(
                  "ps-gantt-row flex border-b transition-colors",
                  isHovered && "bg-muted/20",
                  isSelected && "bg-primary/5",
                  idx % 2 === 0 && "bg-muted/10"
                )}
                onMouseEnter={() => setHoveredId(s.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ animationDelay: `${Math.min(idx * 30, 360)}ms` }}
              >
                <div className="w-[280px] shrink-0 border-r p-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={cn("text-[9px] font-bold", SM.color, SM.bg)}>
                        {s.workCenter.split("-")[1]?.slice(0, 2) || s.workCenter.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{s.title}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {s.id} · {s.workCenter}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative flex-1" style={{ height: 44 }}>
                  {/* Weekend shading */}
                  {Array.from({ length: GANTT_DAYS }, (_, i) => {
                    const d = new Date(GANTT_START.getTime() + i * 86400000)
                    return isWeekend(d) ? (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 bg-muted-foreground/5"
                        style={{ left: `${(i / GANTT_DAYS) * 100}%`, width: `${(1 / GANTT_DAYS) * 100}%` }}
                      />
                    ) : null
                  })}

                  {/* Planned bar (background) */}
                  <button
                    onClick={() => onBarClick(s)}
                    className="absolute top-1/2 -translate-y-1/2 rounded transition-all hover:z-10 hover:brightness-110 hover:shadow-md"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: 22,
                      background: `linear-gradient(90deg, ${SM.barColor}40, ${SM.barColor}30)`,
                      border: `1px solid ${SM.barColor}80`,
                    }}
                    title={`${s.title}\nPlanned: ${s.plannedStart} → ${s.plannedEnd}\nStatus: ${SM.label}\nProgress: ${s.progressPct}%`}
                  />

                  {/* Actual bar (foreground) */}
                  {actualStartOffset !== null && actualDuration > 0 && (
                    <button
                      onClick={() => onBarClick(s)}
                      className="absolute top-1/2 -translate-y-1/2 rounded overflow-hidden transition-all hover:z-10 hover:shadow-md"
                      style={{
                        left: `${actualLeftPct}%`,
                        width: `${actualWidthPct}%`,
                        height: 18,
                        background: `linear-gradient(90deg, ${SM.barColor}, ${SM.barColor}cc)`,
                      }}
                      title={`Actual: ${s.actualStart} → ${s.actualEnd || "in progress"}\nHours: ${s.actualHours}/${s.plannedHours}\nDelay: ${s.delayDays}d`}
                    >
                      {/* Progress overlay */}
                      <div
                        className="absolute inset-y-0 left-0 bg-white/25"
                        style={{ width: `${s.progressPct}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                        {s.progressPct > 15 ? `${s.progressPct}%` : ""}
                      </span>
                    </button>
                  )}

                  {/* Delay indicator */}
                  {s.delayDays > 0 && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 flex items-center text-[10px] text-rose-600 font-bold"
                      style={{ left: `${actualLeftPct + actualWidthPct + 0.5}%` }}
                    >
                      <AlertTriangle className="h-3 w-3 mr-0.5" />
                      +{s.delayDays}d
                    </div>
                  )}

                  {/* Milestone markers */}
                  {s.milestones
                    .filter((m) => m.type === "actual" || m.type === "milestone")
                    .map((m) => {
                      const mOffset = dayOffset(m.date)
                      if (mOffset < 0 || mOffset >= GANTT_DAYS) return null
                      const Icon = MILESTONE_STATUS[m.status].icon
                      return (
                        <div
                          key={m.id}
                          className={cn(
                            "absolute top-0 bottom-0 flex items-center justify-center",
                            m.status === "achieved" ? "text-emerald-600" : m.status === "missed" ? "text-rose-600" : "text-slate-400"
                          )}
                          style={{ left: `${(mOffset / GANTT_DAYS) * 100}%`, transform: "translateX(-50%)" }}
                          title={`${m.name} (${MILESTONE_STATUS[m.status].label})\n${m.date}\n${m.notes}`}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                      )
                    })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Today marker line */}
        {todayOffset >= 0 && todayOffset <= GANTT_DAYS && (
          <div
            className="absolute top-0 bottom-0 border-l-2 border-rose-500/70 pointer-events-none z-10"
            style={{ left: `calc(280px + ${(todayOffset / GANTT_DAYS) * 100}% * (100% - 280px) / 100%)` }}
          >
            <div className="absolute -top-0 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              TODAY
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 border-t bg-muted/20 px-3 py-2 text-[10px]">
          <span className="font-semibold">Legend:</span>
          {Object.entries(STATUS_META).slice(0, 6).map(([k, m]) => (
            <div key={k} className="flex items-center gap-1">
              <div className="h-2.5 w-4 rounded" style={{ background: m.barColor }} />
              <span className="text-muted-foreground">{m.label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-4 rounded border border-dashed border-muted-foreground/60 bg-muted/40" />
              <span className="text-muted-foreground">Planned</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-4 rounded bg-primary/80" />
              <span className="text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span className="text-muted-foreground">Milestone achieved</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-rose-600" />
              <span className="text-muted-foreground">Missed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// MAIN VIEW
// ──────────────────────────────────────────────────────────

export function ProductionScheduleView() {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | "all">("all")
  const [typeFilter, setTypeFilter] = useState<ScheduleType | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<SchedulePriority | "all">("all")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [view, setView] = useState<"gantt" | "list">("gantt")
  const [selectedSchedule, setSelectedSchedule] = useState<ProductionSchedule | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const warehouses = useMemo(() => Array.from(new Set(SCHEDULES.map((s) => s.warehouse))), [])

  const filteredSchedules = useMemo(() => {
    return SCHEDULES.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false
      if (typeFilter !== "all" && s.type !== typeFilter) return false
      if (priorityFilter !== "all" && s.priority !== priorityFilter) return false
      if (warehouseFilter !== "all" && s.warehouse !== warehouseFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          s.id.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.partNo.toLowerCase().includes(q) ||
          s.customer.toLowerCase().includes(q) ||
          s.woRef.toLowerCase().includes(q) ||
          s.workCenter.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, statusFilter, typeFilter, priorityFilter, warehouseFilter])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SCHEDULES.length }
    STATUS_TABS.forEach((t) => {
      if (t.key !== "all") counts[t.key] = SCHEDULES.filter((s) => s.status === t.key).length
    })
    return counts
  }, [])

  // KPI calculations
  const kpis = useMemo(() => {
    const total = SCHEDULES.length
    const active = SCHEDULES.filter((s) => s.status === "started" || s.status === "in-progress").length
    const delayed = SCHEDULES.filter((s) => s.status === "delayed").length
    const onHold = SCHEDULES.filter((s) => s.status === "on-hold").length
    const completed = SCHEDULES.filter((s) => s.status === "completed").length
    const onTimeRate = completed > 0 ? Math.round((SCHEDULES.filter((s) => s.status === "completed" && s.delayDays === 0).length / completed) * 100) : 0
    const totalDelayDays = SCHEDULES.reduce((sum, s) => sum + s.delayDays, 0)
    const avgUtilization = Math.round(
      SCHEDULES.reduce((sum, s) => {
        const util = s.resourceAllocations.reduce((su, r) => su + r.utilizationPct, 0) / Math.max(1, s.resourceAllocations.length)
        return sum + util
      }, 0) / Math.max(1, SCHEDULES.length)
    )
    const critical = SCHEDULES.filter((s) => s.priority === "critical").length
    return { total, active, delayed, onHold, completed, onTimeRate, totalDelayDays, avgUtilization, critical }
  }, [])

  // Trend data
  const trendData = useMemo(() => {
    return [
      { month: "Feb", scheduled: 14, completed: 12 },
      { month: "Mar", scheduled: 16, completed: 14 },
      { month: "Apr", scheduled: 13, completed: 13 },
      { month: "May", scheduled: 18, completed: 16 },
      { month: "Jun", scheduled: 20, completed: 18 },
      { month: "Jul", scheduled: 16, completed: 9 },
    ]
  }, [])

  // Status pie
  const statusPieData = useMemo(() => {
    const data: { name: string; value: number; color: string }[] = []
    Object.keys(STATUS_META).forEach((k) => {
      const count = SCHEDULES.filter((s) => s.status === k).length
      if (count > 0) data.push({ name: STATUS_META[k as ScheduleStatus].label, value: count, color: STATUS_META[k as ScheduleStatus].pieColor })
    })
    return data
  }, [])

  // Type bar
  const typeBarData = useMemo(() => {
    return Object.keys(TYPE_META).map((k) => ({
      name: TYPE_META[k as ScheduleType].label,
      count: SCHEDULES.filter((s) => s.type === k).length,
      color: TYPE_META[k as ScheduleType].pieColor,
    }))
  }, [])

  // Work center utilization (bar)
  const wcUtilData = useMemo(() => {
    const map = new Map<string, { planned: number; available: number; count: number }>()
    SCHEDULES.forEach((s) => {
      const existing = map.get(s.workCenter) || { planned: 0, available: 0, count: 0 }
      existing.planned += s.plannedHours
      existing.available += 200 // assume 200h/week available per work center
      existing.count += 1
      map.set(s.workCenter, existing)
    })
    return Array.from(map.entries())
      .map(([wc, v]) => ({
        name: wc,
        utilization: Math.round((v.planned / v.available) * 100),
        schedules: v.count,
      }))
      .sort((a, b) => b.utilization - a.utilization)
      .slice(0, 8)
  }, [])

  function handleExport() {
    const rows = filteredSchedules.map((s) => ({
      "Schedule ID": s.id,
      "WO Ref": s.woRef,
      "BOM Ref": s.bomRef,
      "QIP Ref": s.qipRef,
      Title: s.title,
      "Part No": s.partNo,
      Customer: s.customer,
      Warehouse: s.warehouse,
      "Work Center": s.workCenter,
      Type: TYPE_META[s.type].label,
      Status: STATUS_META[s.status].label,
      Priority: PRIORITY_META[s.priority].label,
      "Order Qty": s.orderQty,
      "Planned Start": s.plannedStart,
      "Planned End": s.plannedEnd,
      "Actual Start": s.actualStart || "",
      "Actual End": s.actualEnd || "",
      "Planned Hours": s.plannedHours,
      "Actual Hours": s.actualHours,
      "Progress %": s.progressPct,
      "Delay Days": s.delayDays,
      Supervisor: s.supervisor,
    }))
    exportToCSV(rows, `production-schedules-${new Date().toISOString().slice(0, 10)}`)
    toast.success("Export complete", `${filteredSchedules.length} schedule records exported to CSV`)
  }

  function handleRefresh() {
    toast.success("Data refreshed", "Production schedule synchronized with MES/ERP")
  }

  function handleNewSchedule() {
    toast.info("New Schedule", "Schedule creation wizard will open — select WO and work center")
  }

  function handleBarClick(s: ProductionSchedule) {
    setSelectedSchedule(s)
    setDrawerOpen(true)
  }

  function handleRowClick(s: ProductionSchedule) {
    setSelectedSchedule(s)
    setDrawerOpen(true)
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <style jsx global>{`
        @keyframes ps-kpi-enter {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ps-chart-enter {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ps-row-in {
          0% { opacity: 0; transform: translateX(-6px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes ps-row-pulse {
          0%, 100% { background-color: rgb(254 226 226 / 0.4); }
          50% { background-color: rgb(254 202 202 / 0.7); }
        }
        @keyframes ps-sheen {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes ps-badge-pop {
          0% { transform: scale(0.6); }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes ps-stat-enter {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ps-gantt-row-enter {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <PageHeader
        title="Production Schedule"
        description="Manufacturing planning layer above Work Orders. Visualizes planned vs actual timelines across work centers via Gantt chart. Capacity planning, dependencies, milestones, and resource allocation."
      />

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleNewSchedule} className="ps-kpi-enter gap-2">
          <Plus className="h-4 w-4" />
          New Schedule
        </Button>
        <Button variant="outline" onClick={handleRefresh} className="btn-outline-animate gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" onClick={handleExport} className="btn-outline-animate gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        {/* View toggle */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-md border bg-muted/40 p-0.5">
            <button
              onClick={() => setView("gantt")}
              className={cn(
                "ps-tab-btn inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-all",
                view === "gantt" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <GanttChartSquare className="h-3.5 w-3.5" />
              Gantt
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "ps-tab-btn inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-all",
                view === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ListTree className="h-3.5 w-3.5" />
              List
            </button>
          </div>
          <div className="text-xs text-muted-foreground">
            {view === "gantt" ? "Gantt view" : "List view"} · <span className="font-semibold text-foreground">{filteredSchedules.length}</span> of {SCHEDULES.length} schedules
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="ps-kpi-enter relative overflow-hidden border-blue-200/50" style={{ animationDelay: "0ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-blue-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Total Schedules</p>
              <Hash className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{kpis.total}</p>
            <p className="text-xs text-blue-700 mt-1">{kpis.active} active · {kpis.completed} done</p>
          </CardContent>
        </Card>
        <Card className="ps-kpi-enter relative overflow-hidden border-emerald-200/50" style={{ animationDelay: "60ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-emerald-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">On-Time Rate</p>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-700">{kpis.onTimeRate}%</p>
            <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +3% MoM
            </p>
          </CardContent>
        </Card>
        <Card className="ps-kpi-enter relative overflow-hidden border-rose-200/50" style={{ animationDelay: "120ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-rose-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Delayed</p>
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-rose-700">{kpis.delayed}</p>
            <p className="text-xs text-rose-700 mt-1">{kpis.totalDelayDays}d total delay</p>
          </CardContent>
        </Card>
        <Card className="ps-kpi-enter relative overflow-hidden border-amber-200/50" style={{ animationDelay: "180ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-amber-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">On Hold</p>
              <CirclePause className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-amber-700">{kpis.onHold}</p>
            <p className="text-xs text-amber-700 mt-1">Awaiting review</p>
          </CardContent>
        </Card>
        <Card className="ps-kpi-enter relative overflow-hidden border-violet-200/50" style={{ animationDelay: "240ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-violet-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Avg Utilization</p>
              <Gauge className="h-4 w-4 text-violet-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{kpis.avgUtilization}%</p>
            <p className="text-xs text-violet-700 mt-1">Across all work centers</p>
          </CardContent>
        </Card>
        <Card className="ps-kpi-enter relative overflow-hidden border-orange-200/50" style={{ animationDelay: "300ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-orange-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Critical</p>
              <FlagTriangleRight className="h-4 w-4 text-orange-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-orange-700">{kpis.critical}</p>
            <p className="text-xs text-orange-700 mt-1">Priority schedules</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="ps-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">6-Month Schedule Trend</CardTitle>
            <CardDescription className="text-xs">Scheduled vs completed production runs per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="psSchedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="psCompGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="scheduled" name="Scheduled" stroke="#3b82f6" strokeWidth={2} fill="url(#psSchedGrad)" />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} fill="url(#psCompGrad)" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="ps-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Schedules by Status</CardTitle>
            <CardDescription className="text-xs">Distribution across 8 lifecycle stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusPieData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="ps-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Schedules by Type</CardTitle>
            <CardDescription className="text-xs">Production vs rework vs prototype vs maintenance vs sample</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={typeBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {typeBarData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="ps-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Work Center Utilization</CardTitle>
            <CardDescription className="text-xs">Capacity utilization % across active work centers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={wcUtilData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" className="text-xs" tick={{ fontSize: 11 }} unit="%" />
                <YAxis type="category" dataKey="name" className="text-xs" tick={{ fontSize: 10 }} width={80} />
                <Bar dataKey="utilization" radius={[0, 6, 6, 0]}>
                  {wcUtilData.map((e, i) => (
                    <Cell
                      key={i}
                      fill={e.utilization > 100 ? "#ef4444" : e.utilization > 85 ? "#f59e0b" : e.utilization > 60 ? "#3b82f6" : "#10b981"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1 border-b pb-2">
        {STATUS_TABS.map((t) => {
          const count = statusCounts[t.key] || 0
          const isActive = statusFilter === t.key
          return (
            <button
              key={t.key}
              onClick={() => setStatusFilter(t.key)}
              className={cn(
                "ps-tab-btn inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "ps-badge-pop inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold",
                  isActive ? "bg-primary-foreground/30" : "bg-muted-foreground/15"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by Schedule ID, title, part, customer, WO ref, work center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-search-focus pl-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ScheduleType | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(TYPE_META).map(([k, m]) => (
              <SelectItem key={k} value={k}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as SchedulePriority | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {Object.entries(PRIORITY_META).map(([k, m]) => (
              <SelectItem key={k} value={k}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {warehouses.map((w) => (
              <SelectItem key={w} value={w}>
                {w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gantt or List view */}
      {view === "gantt" ? (
        <Card className="ps-table-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GanttChartSquare className="h-4 w-4 text-violet-600" />
              Production Gantt Chart
            </CardTitle>
            <CardDescription className="text-xs">
              Planning horizon: 2026-07-12 to 2026-08-08 · Click any bar to open schedule detail · Today marked with red line
            </CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle p-0">
            <GanttChart schedules={filteredSchedules} onBarClick={handleBarClick} selectedId={selectedSchedule?.id || null} />
          </CardContent>
        </Card>
      ) : (
        <Card className="card-crud-lift ps-table-card">
          <CardContent className="glass-subtle p-0">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[130px]">Schedule ID</TableHead>
                  <TableHead className="min-w-[260px]">Title / Customer</TableHead>
                  <TableHead className="w-[110px]">Type</TableHead>
                  <TableHead className="w-[130px]">Status</TableHead>
                  <TableHead className="w-[90px]">Priority</TableHead>
                  <TableHead className="w-[120px] text-right">Qty</TableHead>
                  <TableHead className="w-[180px]">Planned Window</TableHead>
                  <TableHead className="w-[110px]">Progress</TableHead>
                  <TableHead className="w-[100px] text-right">Hours</TableHead>
                  <TableHead className="w-[110px]">Work Center</TableHead>
                  <TableHead className="w-[70px] text-right">Delay</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground text-sm">
                      No schedules match the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((s, idx) => {
                    const SM = STATUS_META[s.status]
                    const PM = PRIORITY_META[s.priority]
                    const TM = TYPE_META[s.type]
                    const StatusIcon = SM.icon
                    const PriIcon = PM.icon
                    const TypeIcon = TM.icon
                    const isDelayed = s.status === "delayed"
                    const isOnHold = s.status === "on-hold"
                    const isCancelled = s.status === "cancelled"
                    return (
                      <TableRow
                        key={s.id}
                        onClick={() => handleRowClick(s)}
                        className={cn(
                          "ps-row-in cursor-pointer border-b transition-colors",
                          isDelayed && "ps-row-critical",
                          isOnHold && "bg-amber-50/40 hover:bg-amber-50/70",
                          isCancelled && "opacity-60",
                          !isDelayed && !isOnHold && !isCancelled && "hover:bg-muted/40"
                        )}
                        style={{ animationDelay: `${Math.min(idx * 18, 360)}ms` }}
                      >
                        <TableCell className="font-mono text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className={cn("bg-primary/10 text-[10px] font-bold", TM.color)}>
                                {s.type === "production" ? "PR" : s.type === "rework" ? "RW" : s.type === "prototype" ? "PT" : s.type === "maintenance" ? "MT" : "SM"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{s.id}</div>
                              <div className="text-[10px] text-muted-foreground">{s.woRef}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{s.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {s.partNo} · {s.customer} · {s.warehouse}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {s.bomRef} · {s.qipRef}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("gap-1 text-xs", TM.color, TM.bg)}>
                            <TypeIcon className="h-3 w-3" />
                            {TM.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("gap-1 text-xs", SM.color, SM.bg, SM.border)}>
                            <StatusIcon className="h-3 w-3" />
                            {SM.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("gap-1 text-xs", PM.color, PM.bg)}>
                            <PriIcon className="h-3 w-3" />
                            {PM.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm">
                          {fmtNum(s.orderQty)}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-mono">
                            <div>{formatDateShort(s.plannedStart)} → {formatDateShort(s.plannedEnd)}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {daysBetween(s.plannedStart, s.plannedEnd)}d duration
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={s.progressPct} className="h-2 w-[70px]" />
                            <span className="text-xs tabular-nums text-muted-foreground">{s.progressPct}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-xs">
                          <span className={cn(s.actualHours > s.plannedHours ? "text-rose-600 font-medium" : "")}>
                            {s.actualHours}h
                          </span>
                          <span className="text-muted-foreground"> / {s.plannedHours}h</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono">{s.workCenter}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          {s.delayDays > 0 ? (
                            <Badge variant="outline" className="badge-interactive bg-rose-50 text-rose-700 border-rose-200 text-xs">
                              +{s.delayDays}d
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Detail Drawer */}
      <ScheduleDetailDrawer schedule={selectedSchedule} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// DETAIL DRAWER
// ──────────────────────────────────────────────────────────

type DrawerTab = "overview" | "timeline" | "milestones" | "resources" | "dependencies" | "capacity"

function ScheduleDetailDrawer({
  schedule,
  open,
  onOpenChange,
}: {
  schedule: ProductionSchedule | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const toast = useToast()
  const [tab, setTab] = useState<DrawerTab>("overview")

  React.useEffect(() => {
    if (open) setTab("overview")
  }, [open, schedule?.id])

  if (!schedule) return null

  const SM = STATUS_META[schedule.status]
  const PM = PRIORITY_META[schedule.priority]
  const TM = TYPE_META[schedule.type]
  const StatusIcon = SM.icon
  const duration = daysBetween(schedule.plannedStart, schedule.plannedEnd)
  const actualDuration =
    schedule.actualEnd && schedule.actualStart
      ? daysBetween(schedule.actualStart, schedule.actualEnd)
      : schedule.actualStart
      ? daysBetween(schedule.actualStart, "2026-07-26")
      : 0
  const variance = schedule.actualHours - schedule.plannedHours
  const achievedMilestones = schedule.milestones.filter((m) => m.status === "achieved").length
  const missedMilestones = schedule.milestones.filter((m) => m.status === "missed").length
  const totalMilestones = schedule.milestones.length
  const overallocatedResources = schedule.resourceAllocations.filter((r) => r.status === "overallocated").length
  const totalResources = schedule.resourceAllocations.length
  const avgUtilization = Math.round(
    schedule.resourceAllocations.reduce((s, r) => s + r.utilizationPct, 0) / Math.max(1, schedule.resourceAllocations.length)
  )

  function handleExport() {
    if (!schedule) return
    const rows = [
      {
        "Schedule ID": schedule.id,
        "WO Ref": schedule.woRef,
        Title: schedule.title,
        Status: SM.label,
        Progress: schedule.progressPct,
        "Planned Duration": duration,
        "Actual Duration": actualDuration,
        "Delay Days": schedule.delayDays,
        "Milestones Achieved": `${achievedMilestones}/${totalMilestones}`,
        "Avg Utilization": `${avgUtilization}%`,
      },
    ]
    exportToCSV(rows, `${schedule.id}-summary`)
    toast.success("Export complete", `${schedule.id} summary exported`)
  }

  function handleAction(action: string) {
    if (!schedule) return
    if (action === "release") toast.success("Schedule Released", `${schedule.id} released to production`)
    else if (action === "start") toast.success("Schedule Started", `${schedule.id} production has begun`)
    else if (action === "hold") toast.warning("Schedule On Hold", `${schedule.id} paused pending review`)
    else if (action === "resume") toast.success("Schedule Resumed", `${schedule.id} production resumed`)
    else if (action === "complete") toast.success("Schedule Completed", `${schedule.id} marked as completed`)
    else if (action === "expedite") toast.warning("Schedule Expedited", `${schedule.id} escalated — recovery plan required`)
  }

  const tabs: Array<{ key: DrawerTab; label: string; count?: number }> = [
    { key: "overview", label: "Overview" },
    { key: "timeline", label: "Timeline" },
    { key: "milestones", label: "Milestones", count: totalMilestones },
    { key: "resources", label: "Resources", count: totalResources },
    { key: "dependencies", label: "Dependencies", count: schedule.dependencies.length },
    { key: "capacity", label: "Capacity" },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="ps-drawer-content w-full sm:max-w-[920px] overflow-y-auto p-0">
        <style jsx>{`
          .ps-drawer-content::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
            z-index: 50;
          }
        `}</style>

        {/* Sheen sweep on open */}
        <div className="ps-drawer-sheen pointer-events-none absolute inset-x-0 top-0 h-12 overflow-hidden">
          <div className="ps-sheen absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        <SheetHeader className="ps-drawer-header border-b bg-gradient-to-r from-blue-50/60 via-violet-50/40 to-cyan-50/30 px-6 pb-4 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("gap-1", SM.color, SM.bg, SM.border)}>
                  <StatusIcon className="h-3 w-3" />
                  {SM.label}
                </Badge>
                <Badge variant="outline" className={cn("gap-1", TM.color, TM.bg)}>
                  {TM.label}
                </Badge>
                <Badge variant="outline" className={cn("gap-1", PM.color, PM.bg)}>
                  {PM.label}
                </Badge>
              </div>
              <SheetTitle className="text-xl">{schedule.title}</SheetTitle>
              <SheetDescription className="font-mono text-xs">
                {schedule.id} · {schedule.woRef} · {schedule.bomRef} · {schedule.qipRef}
              </SheetDescription>
              <div className="text-xs text-muted-foreground">
                {schedule.partNo} · {schedule.partDescription} · {schedule.customer} · {schedule.warehouse}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>

          {/* Hero stat grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="ps-stat-enter rounded-lg border border-blue-200/50 bg-white/60 p-3" style={{ animationDelay: "0ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarRange className="h-3 w-3" />
                Duration
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">{duration}<span className="text-sm font-normal">d planned</span></p>
              <p className="text-[10px] text-muted-foreground">{actualDuration > 0 ? `${actualDuration}d actual` : "Not started"}</p>
            </div>
            <div className="ps-stat-enter rounded-lg border border-violet-200/50 bg-white/60 p-3" style={{ animationDelay: "80ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                Progress
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">{schedule.progressPct}%</p>
              <p className="text-[10px] text-muted-foreground">{schedule.actualHours}h / {schedule.plannedHours}h</p>
            </div>
            <div className="ps-stat-enter rounded-lg border border-amber-200/50 bg-white/60 p-3" style={{ animationDelay: "160ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Timer className="h-3 w-3" />
                Hours Variance
              </div>
              <p className={cn("mt-1 text-lg font-bold tabular-nums", variance > 0 ? "text-rose-700" : "text-emerald-700")}>
                {variance > 0 ? "+" : ""}{variance}h
              </p>
              <p className="text-[10px] text-muted-foreground">{variance > 0 ? "Over plan" : variance < 0 ? "Under plan" : "On plan"}</p>
            </div>
            <div className="ps-stat-enter rounded-lg border border-emerald-200/50 bg-white/60 p-3" style={{ animationDelay: "240ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3" />
                Milestones
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">{achievedMilestones}/{totalMilestones}</p>
              <p className="text-[10px] text-rose-600">{missedMilestones > 0 ? `${missedMilestones} missed` : "None missed"}</p>
            </div>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => {
              const isActive = tab === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "ps-tab-btn relative -mb-px px-3 py-2.5 text-xs font-medium transition-all",
                    isActive ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                  {t.count !== undefined && t.count > 0 && (
                    <span className="ps-badge-pop ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-muted-foreground/15 px-1 text-[10px] font-bold">
                      {t.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="ps-body-enter space-y-4 p-6">
          {tab === "overview" && (
            <>
              {/* Production Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Production Summary</CardTitle>
                </CardHeader>
                <CardContent className="glass-subtle grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="ps-stat-enter space-y-1">
                    <p className="text-xs text-muted-foreground">Order Qty</p>
                    <p className="text-xl font-bold tabular-nums">{fmtNum(schedule.orderQty)}</p>
                  </div>
                  <div className="ps-stat-enter space-y-1">
                    <p className="text-xs text-muted-foreground">Work Center</p>
                    <p className="text-sm font-medium font-mono">{schedule.workCenter}</p>
                    <p className="text-xs text-muted-foreground">{schedule.warehouse}</p>
                  </div>
                  <div className="ps-stat-enter space-y-1">
                    <p className="text-xs text-muted-foreground">Supervisor</p>
                    <p className="text-sm font-medium">{schedule.supervisor}</p>
                  </div>
                  <div className="ps-stat-enter space-y-1">
                    <p className="text-xs text-muted-foreground">Delay Days</p>
                    <p className={cn("text-xl font-bold tabular-nums", schedule.delayDays > 0 ? "text-rose-700" : "text-emerald-700")}>
                      {schedule.delayDays}d
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Overall Completion</span>
                      <span className="font-medium tabular-nums">{schedule.progressPct}%</span>
                    </div>
                    <Progress value={schedule.progressPct} className="h-2.5" />
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Window */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Schedule Window</CardTitle>
                </CardHeader>
                <CardContent className="glass-subtle grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" /> Planned Start
                    </div>
                    <p className="mt-1 text-sm font-medium">{formatDateShort(schedule.plannedStart)}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{schedule.plannedStart}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClock className="h-3 w-3" /> Planned End
                    </div>
                    <p className="mt-1 text-sm font-medium">{formatDateShort(schedule.plannedEnd)}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{schedule.plannedEnd}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Play className="h-3 w-3" /> Actual Start
                    </div>
                    <p className="mt-1 text-sm font-medium">{schedule.actualStart ? formatDateShort(schedule.actualStart) : "—"}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{schedule.actualStart || "Not started"}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" /> Actual End
                    </div>
                    <p className="mt-1 text-sm font-medium">{schedule.actualEnd ? formatDateShort(schedule.actualEnd) : "—"}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{schedule.actualEnd || "In progress"}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-4 rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Timer className="h-3 w-3" /> Hours Variance
                    </div>
                    <p className="mt-1 text-sm font-medium tabular-nums">
                      {schedule.actualHours}h / {schedule.plannedHours}h
                      <span className={cn("ml-2 text-xs", variance > 0 ? "text-rose-600" : "text-emerald-600")}>
                        ({variance > 0 ? "+" : ""}{variance}h variance)
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Traceability */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Traceability Links</CardTitle>
                </CardHeader>
                <CardContent className="glass-subtle grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <button
                    onClick={() => toast.info("Navigate", `Opening Work Order: ${schedule.woRef}`)}
                    className="ps-card-enter rounded-md border border-blue-200/50 bg-blue-50/30 p-3 text-left hover:border-blue-400 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ClipboardList className="h-3 w-3" /> Work Order
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="mt-1 font-mono text-sm font-semibold text-blue-700">{schedule.woRef}</p>
                  </button>
                  <button
                    onClick={() => toast.info("Navigate", `Opening BOM record: ${schedule.bomRef}`)}
                    className="ps-card-enter rounded-md border border-violet-200/50 bg-violet-50/30 p-3 text-left hover:border-violet-400 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Layers className="h-3 w-3" /> BOM Ref
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="mt-1 font-mono text-sm font-semibold text-violet-700">{schedule.bomRef}</p>
                  </button>
                  <button
                    onClick={() => toast.info("Navigate", `Opening QIP record: ${schedule.qipRef}`)}
                    className="ps-card-enter rounded-md border border-teal-200/50 bg-teal-50/30 p-3 text-left hover:border-teal-400 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Target className="h-3 w-3" /> QIP Ref
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="mt-1 font-mono text-sm font-semibold text-teal-700">{schedule.qipRef}</p>
                  </button>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="border-amber-200/50 bg-amber-50/20">
                <CardContent className="glass-subtle p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800">Schedule Notes</p>
                      <p className="mt-1 text-xs text-amber-900/80">{schedule.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {tab === "timeline" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Schedule Timeline</CardTitle>
                <CardDescription className="text-xs">Visualized planned vs actual timeline for this schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <GanttChart schedules={[schedule]} onBarClick={() => {}} selectedId={schedule.id} />
              </CardContent>
            </Card>
          )}

          {tab === "milestones" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Milestones — {achievedMilestones}/{totalMilestones} Achieved, {missedMilestones} Missed</CardTitle>
                <CardDescription className="text-xs">Key production milestones with planned vs actual dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedule.milestones.map((m, idx) => {
                    const meta = MILESTONE_STATUS[m.status]
                    const Icon = meta.icon
                    const isLast = idx === schedule.milestones.length - 1
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "ps-card-enter relative flex items-start gap-3 rounded-md border p-3",
                          m.status === "achieved" && "border-emerald-200/50 bg-emerald-50/20",
                          m.status === "missed" && "border-rose-200/50 bg-rose-50/20",
                          m.status === "pending" && "border-slate-200/50 bg-slate-50/20"
                        )}
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        {!isLast && (
                          <div className="absolute left-[26px] top-12 bottom-[-12px] w-px bg-muted-foreground/20" />
                        )}
                        <div className={cn("relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2", meta.bg, meta.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{m.name}</p>
                                <Badge variant="outline" className={cn("text-[10px]", m.type === "actual" ? "bg-emerald-50 text-emerald-700" : m.type === "milestone" ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-700")}>
                                  {m.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{m.date} · {m.notes}</p>
                            </div>
                            <Badge variant="outline" className={cn("gap-1 text-xs", meta.color, meta.bg)}>
                              <Icon className="h-3 w-3" />
                              {meta.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {tab === "resources" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Resource Allocations — {overallocatedResources} Overallocated</CardTitle>
                <CardDescription className="text-xs">Work center, operator, tool, and material allocations for this schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {schedule.resourceAllocations.map((r, idx) => {
                    const statusMeta = RESOURCE_STATUS[r.status]
                    const typeMeta = RESOURCE_TYPE_META[r.resourceType]
                    const StatusIcon = statusMeta.icon
                    const TypeIcon = typeMeta.icon
                    return (
                      <div
                        key={r.resourceId}
                        className={cn(
                          "ps-card-enter rounded-md border p-3",
                          r.status === "overallocated" && "border-rose-200/50 bg-rose-50/30",
                          r.status === "partial" && "border-amber-200/50 bg-amber-50/30",
                          r.status === "available" && "border-emerald-200/50 bg-emerald-50/30"
                        )}
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", typeMeta.bg, typeMeta.color)}>
                              <TypeIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{r.resourceName}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{r.resourceId} · {typeMeta.label}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={cn("gap-1 text-xs", statusMeta.color, statusMeta.bg)}>
                            <StatusIcon className="h-3 w-3" />
                            {statusMeta.label}
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Utilization</span>
                            <span className={cn("font-bold", r.utilizationPct > 100 ? "text-rose-700" : r.utilizationPct > 85 ? "text-amber-700" : "text-emerald-700")}>
                              {r.utilizationPct}%
                            </span>
                          </div>
                          <Progress value={Math.min(100, r.utilizationPct)} className="h-1.5" />
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            Allocated {r.allocatedHours}h / Available {r.availableHours}h
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {tab === "dependencies" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Schedule Dependencies</CardTitle>
                <CardDescription className="text-xs">Predecessor and successor schedule relationships</CardDescription>
              </CardHeader>
              <CardContent>
                {schedule.dependencies.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    <ListTree className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                    No dependencies — this schedule is independent
                  </div>
                ) : (
                  <div className="space-y-2">
                    {schedule.dependencies.map((d, idx) => {
                      const predecessor = SCHEDULES.find((s) => s.id === d.fromScheduleId)
                      const successor = SCHEDULES.find((s) => s.id === d.toScheduleId)
                      if (!predecessor || !successor) return null
                      return (
                        <div
                          key={idx}
                          className="ps-card-enter rounded-md border p-3"
                          style={{ animationDelay: `${idx * 60}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 rounded-md border border-blue-200/50 bg-blue-50/30 p-2">
                              <p className="text-[10px] text-muted-foreground">Predecessor</p>
                              <p className="text-sm font-medium">{predecessor.title}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{predecessor.id} · {predecessor.workCenter}</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                              <ArrowRightCircle className="h-5 w-5 text-violet-600" />
                              <span className="text-[10px] font-medium text-violet-700">{d.type}</span>
                              {d.lagDays > 0 && <span className="text-[10px] text-muted-foreground">+{d.lagDays}d lag</span>}
                            </div>
                            <div className="flex-1 rounded-md border border-emerald-200/50 bg-emerald-50/30 p-2">
                              <p className="text-[10px] text-muted-foreground">Successor</p>
                              <p className="text-sm font-medium">{successor.title}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{successor.id} · {successor.workCenter}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {tab === "capacity" && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Work Center Capacity — {avgUtilization}% Avg Utilization</CardTitle>
                  <CardDescription className="text-xs">Daily capacity utilization for {schedule.workCenter} during this schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={Array.from({ length: duration }, (_, i) => {
                        const date = new Date(new Date(schedule.plannedStart).getTime() + i * 86400000)
                        const dateStr = date.toISOString().slice(0, 10)
                        const planned = 8 + (hash(`${schedule.id}-${i}`) % 4)
                        const available = 16
                        return {
                          date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
                          planned,
                          available,
                          utilization: Math.round((planned / available) * 100),
                        }
                      })}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 10 }} />
                      <YAxis className="text-xs" tick={{ fontSize: 11 }} unit="h" />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="planned" name="Planned Hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="available" name="Available Hours" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Capacity Summary</CardTitle>
                </CardHeader>
                <CardContent className="glass-subtle grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-md border p-3 bg-violet-50/30">
                    <p className="text-xs text-muted-foreground">Total Planned Hours</p>
                    <p className="mt-1 text-lg font-bold tabular-nums">{schedule.plannedHours}h</p>
                  </div>
                  <div className="rounded-md border p-3 bg-blue-50/30">
                    <p className="text-xs text-muted-foreground">Total Available Hours</p>
                    <p className="mt-1 text-lg font-bold tabular-nums">{duration * 16}h</p>
                  </div>
                  <div className="rounded-md border p-3 bg-emerald-50/30">
                    <p className="text-xs text-muted-foreground">Avg Daily Utilization</p>
                    <p className="mt-1 text-lg font-bold tabular-nums">{avgUtilization}%</p>
                  </div>
                  <div className="rounded-md border p-3 bg-amber-50/30">
                    <p className="text-xs text-muted-foreground">Peak Day Utilization</p>
                    <p className="mt-1 text-lg font-bold tabular-nums">{Math.min(100, avgUtilization + 15)}%</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Footer with status-aware actions */}
        <SheetFooter className="border-t bg-muted/30 px-6 py-3">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              Created: <span className="font-mono">{schedule.createdAt}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="btn-outline-animate gap-1">
                <Download className="h-3 w-3" />
                Export
              </Button>
              {schedule.status === "planned" && (
                <Button size="sm" onClick={() => handleAction("release")} className="gap-1">
                  <ArrowRightCircle className="h-3 w-3" />
                  Release
                </Button>
              )}
              {schedule.status === "released" && (
                <Button size="sm" onClick={() => handleAction("start")} className="gap-1">
                  <Play className="h-3 w-3" />
                  Start
                </Button>
              )}
              {(schedule.status === "started" || schedule.status === "in-progress") && (
                <Button variant="outline" size="sm" onClick={() => handleAction("hold")} className="btn-outline-animate gap-1 border-amber-300 text-amber-700">
                  <CirclePause className="h-3 w-3" />
                  Hold
                </Button>
              )}
              {schedule.status === "on-hold" && (
                <Button size="sm" onClick={() => handleAction("resume")} className="gap-1">
                  <Play className="h-3 w-3" />
                  Resume
                </Button>
              )}
              {schedule.status === "delayed" && (
                <Button variant="outline" size="sm" onClick={() => handleAction("expedite")} className="btn-outline-animate gap-1 border-rose-300 text-rose-700">
                  <AlertTriangle className="h-3 w-3" />
                  Expedite
                </Button>
              )}
              {schedule.status === "in-progress" && schedule.progressPct >= 95 && (
                <Button size="sm" onClick={() => handleAction("complete")} className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Complete
                </Button>
              )}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
