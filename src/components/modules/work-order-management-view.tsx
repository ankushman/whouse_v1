"use client"

import React, { useState, useMemo } from "react"
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
  Factory,
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
  Square,
  Plus,
  Wrench,
  Timer,
  Calendar,
  ClipboardList,
  Boxes,
  Cog,
  Users,
  Stethoscope,
  FileWarning,
  ListChecks,
  ChevronRight,
  PenLine,
  Hammer,
  CircleCheck,
  CircleDot,
  Circle,
  CirclePause,
  CircleSlash,
  Briefcase,
  Target,
  Gauge,
  CalendarClock,
  ArrowRightCircle,
  ThumbsUp,
  Layers,
  Building2,
  Crosshair,
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

type WOStatus =
  | "created"
  | "released"
  | "started"
  | "in-progress"
  | "quality-hold"
  | "completed"
  | "closed"
  | "cancelled"

type WOPriority = "low" | "medium" | "high" | "critical"
type WOType = "production" | "rework" | "prototype" | "maintenance" | "sample"

interface WORoutingStep {
  seq: number
  operation: string
  workCenter: string
  setupHours: number
  runHoursPerUnit: number
  status: "pending" | "in-progress" | "completed" | "skipped"
  operator: string | null
  startTime: string | null
  endTime: string | null
}

interface WOMaterialIssue {
  partNo: string
  description: string
  requiredQty: number
  issuedQty: number
  unit: string
  warehouse: string
  status: "pending" | "partial" | "issued" | "shortage"
}

interface WOLaborEntry {
  operator: string
  role: string
  clockIn: string
  clockOut: string | null
  hours: number
  operation: string
}

interface WOInspectionResult {
  qipRef: string
  inspectionType: string
  seq: number
  characteristic: string
  spec: string
  measured: string
  result: "pass" | "fail" | "conditional"
  inspector: string
  timestamp: string
}

interface WONCRLink {
  ncrId: string
  title: string
  severity: "critical" | "major" | "minor"
  status: string
  raisedAt: string
}

interface WorkOrder {
  id: string
  partNo: string
  partDescription: string
  bomRef: string
  qipRef: string
  customer: string
  warehouse: string
  workCenter: string
  type: WOType
  status: WOStatus
  priority: WOPriority
  orderQty: number
  completedQty: number
  scrappedQty: number
  plannedStart: string
  plannedEnd: string
  actualStart: string | null
  actualEnd: string | null
  progressPct: number
  plannedHours: number
  actualHours: number
  laborCost: number
  materialCost: number
  overheadCost: number
  routingSteps: WORoutingStep[]
  materialIssues: WOMaterialIssue[]
  laborEntries: WOLaborEntry[]
  inspectionResults: WOInspectionResult[]
  ncrLinks: WONCRLink[]
  supervisor: string
  createdAt: string
  notes: string
}

// ──────────────────────────────────────────────────────────
// META
// ──────────────────────────────────────────────────────────

const STATUS_META: Record<
  WOStatus,
  { label: string; color: string; bg: string; border: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }
> = {
  created:     { label: "Created",      color: "text-slate-700",    bg: "bg-slate-100",    border: "border-slate-200",    pieColor: "#64748b", icon: Circle },
  released:    { label: "Released",     color: "text-blue-700",     bg: "bg-blue-50",      border: "border-blue-200",     pieColor: "#3b82f6", icon: CircleDot },
  started:     { label: "Started",      color: "text-cyan-700",     bg: "bg-cyan-50",      border: "border-cyan-200",     pieColor: "#06b6d4", icon: Play },
  "in-progress": { label: "In Progress", color: "text-violet-700", bg: "bg-violet-50",    border: "border-violet-200",   pieColor: "#8b5cf6", icon: Activity },
  "quality-hold": { label: "Quality Hold", color: "text-amber-700", bg: "bg-amber-50",    border: "border-amber-200",    pieColor: "#f59e0b", icon: CirclePause },
  completed:   { label: "Completed",    color: "text-emerald-700",  bg: "bg-emerald-50",   border: "border-emerald-200",  pieColor: "#10b981", icon: CircleCheck },
  closed:      { label: "Closed",       color: "text-teal-700",     bg: "bg-teal-50",      border: "border-teal-200",     pieColor: "#14b8a6", icon: CheckCircle2 },
  cancelled:   { label: "Cancelled",    color: "text-rose-700",     bg: "bg-rose-50",      border: "border-rose-200",     pieColor: "#ef4444", icon: CircleSlash },
}

const PRIORITY_META: Record<WOPriority, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  low:      { label: "Low",      color: "text-slate-700",  bg: "bg-slate-100",  icon: Circle },
  medium:   { label: "Medium",   color: "text-blue-700",   bg: "bg-blue-50",    icon: CircleDot },
  high:     { label: "High",     color: "text-amber-700",  bg: "bg-amber-50",   icon: AlertTriangle },
  critical: { label: "Critical", color: "text-rose-700",   bg: "bg-rose-50",    icon: AlertTriangle },
}

const TYPE_META: Record<WOType, { label: string; color: string; bg: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  production:   { label: "Production",   color: "text-blue-700",    bg: "bg-blue-50",    pieColor: "#3b82f6", icon: Factory },
  rework:       { label: "Rework",       color: "text-amber-700",   bg: "bg-amber-50",   pieColor: "#f59e0b", icon: Wrench },
  prototype:    { label: "Prototype",    color: "text-violet-700",  bg: "bg-violet-50",  pieColor: "#8b5cf6", icon: PenLine },
  maintenance:  { label: "Maintenance",  color: "text-teal-700",    bg: "bg-teal-50",    pieColor: "#14b8a6", icon: Hammer },
  sample:       { label: "Sample",       color: "text-pink-700",    bg: "bg-pink-50",    pieColor: "#ec4899", icon: ClipboardList },
}

const ROUTING_STEP_STATUS: Record<
  WORoutingStep["status"],
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending:     { label: "Pending",     color: "text-slate-700",  bg: "bg-slate-100",  icon: Circle },
  "in-progress": { label: "In Progress", color: "text-violet-700", bg: "bg-violet-50", icon: Activity },
  completed:   { label: "Completed",   color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2 },
  skipped:     { label: "Skipped",     color: "text-rose-700",   bg: "bg-rose-50",    icon: CircleSlash },
}

const MATERIAL_STATUS: Record<
  WOMaterialIssue["status"],
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending:  { label: "Pending",  color: "text-slate-700",  bg: "bg-slate-100",  icon: Circle },
  partial:  { label: "Partial",  color: "text-amber-700",  bg: "bg-amber-50",   icon: CircleDot },
  issued:   { label: "Issued",   color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2 },
  shortage: { label: "Shortage", color: "text-rose-700",   bg: "bg-rose-50",    icon: AlertTriangle },
}

const INSPECTION_RESULT: Record<
  WOInspectionResult["result"],
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pass:       { label: "Pass",       color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2 },
  fail:       { label: "Fail",       color: "text-rose-700",    bg: "bg-rose-50",    icon: XCircle },
  conditional:{ label: "Conditional",color: "text-amber-700",   bg: "bg-amber-50",   icon: AlertTriangle },
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

// 16 WO seeds — Indian automotive parts spanning multiple work centers
const WO_SEEDS: Array<{
  id: string
  partNo: string
  partDescription: string
  bomRef: string
  qipRef: string
  customer: string
  warehouse: string
  workCenter: string
  type: WOType
  status: WOStatus
  priority: WOPriority
  orderQty: number
  completedQty: number
  scrappedQty: number
  plannedStart: string
  plannedEnd: string
  actualStart: string | null
  actualEnd: string | null
  progressPct: number
  plannedHours: number
  actualHours: number
  laborCost: number
  materialCost: number
  overheadCost: number
  supervisor: string
}> = [
  { id: "WO-2026-5001", partNo: "BP-1001", partDescription: "Brake Pad Assembly — Passenger Car", bomRef: "BOM-1001", qipRef: "QIP-2000", customer: "Tata Motors", warehouse: "Chennai Hub", workCenter: "WC-ASSY-01", type: "production", status: "in-progress", priority: "high", orderQty: 500, completedQty: 320, scrappedQty: 8, plannedStart: "2026-07-20", plannedEnd: "2026-07-28", actualStart: "2026-07-20T06:00", actualEnd: null, progressPct: 64, plannedHours: 80, actualHours: 52, laborCost: 28800, materialCost: 184000, overheadCost: 14400, supervisor: "Rajesh Kumar" },
  { id: "WO-2026-5002", partNo: "WR-2002", partDescription: "Wheel Rim 17\" Machined", bomRef: "BOM-1002", qipRef: "QIP-2001", customer: "Mahindra", warehouse: "Chennai Hub", workCenter: "WC-CNC-02", type: "production", status: "in-progress", priority: "medium", orderQty: 300, completedQty: 180, scrappedQty: 4, plannedStart: "2026-07-21", plannedEnd: "2026-07-29", actualStart: "2026-07-21T07:00", actualEnd: null, progressPct: 60, plannedHours: 64, actualHours: 41, laborCost: 22100, materialCost: 96000, overheadCost: 11000, supervisor: "Priya Sharma" },
  { id: "WO-2026-5003", partNo: "EB-3003", partDescription: "Engine Block Cast Iron V3", bomRef: "BOM-1003", qipRef: "QIP-2002", customer: "Ashok Leyland", warehouse: "Pune Plant", workCenter: "WC-CAST-01", type: "production", status: "quality-hold", priority: "critical", orderQty: 80, completedQty: 48, scrappedQty: 6, plannedStart: "2026-07-18", plannedEnd: "2026-07-30", actualStart: "2026-07-18T05:00", actualEnd: null, progressPct: 60, plannedHours: 120, actualHours: 88, laborCost: 52800, materialCost: 640000, overheadCost: 26400, supervisor: "Arun Gupta" },
  { id: "WO-2026-5004", partNo: "CS-4004", partDescription: "Caliper Seal Assembly", bomRef: "BOM-1004", qipRef: "QIP-2003", customer: "Bosch India", warehouse: "Chennai Hub", workCenter: "WC-ASSY-02", type: "production", status: "completed", priority: "high", orderQty: 1000, completedQty: 992, scrappedQty: 8, plannedStart: "2026-07-12", plannedEnd: "2026-07-22", actualStart: "2026-07-12T06:00", actualEnd: "2026-07-22T15:30", progressPct: 100, plannedHours: 96, actualHours: 102, laborCost: 36720, materialCost: 198400, overheadCost: 18360, supervisor: "Rajesh Kumar" },
  { id: "WO-2026-5005", partNo: "SA-5005", partDescription: "Shock Absorber Rear Damping", bomRef: "BOM-1005", qipRef: "QIP-2004", customer: "Honda Motorcycle", warehouse: "Pune Plant", workCenter: "WC-ASSY-03", type: "production", status: "started", priority: "medium", orderQty: 600, completedQty: 50, scrappedQty: 0, plannedStart: "2026-07-25", plannedEnd: "2026-08-02", actualStart: "2026-07-25T06:30", actualEnd: null, progressPct: 8, plannedHours: 72, actualHours: 9, laborCost: 5400, materialCost: 210000, overheadCost: 2700, supervisor: "Priya Sharma" },
  { id: "WO-2026-5006", partNo: "BT-6006", partDescription: "Li-Ion Battery Pack 48V", bomRef: "BOM-1006", qipRef: "QIP-2005", customer: "Ather Energy", warehouse: "Bengaluru Plant", workCenter: "WC-ASSY-04", type: "prototype", status: "in-progress", priority: "critical", orderQty: 25, completedQty: 12, scrappedQty: 1, plannedStart: "2026-07-22", plannedEnd: "2026-08-05", actualStart: "2026-07-22T09:00", actualEnd: null, progressPct: 48, plannedHours: 160, actualHours: 79, laborCost: 47400, materialCost: 425000, overheadCost: 23700, supervisor: "Sneha Reddy" },
  { id: "WO-2026-5007", partNo: "TB-7007", partDescription: "Tire Bead 18\" Heavy Duty", bomRef: "BOM-1007", qipRef: "QIP-2006", customer: "MRF Tyres", warehouse: "Chennai Hub", workCenter: "WC-VULC-01", type: "production", status: "released", priority: "low", orderQty: 1200, completedQty: 0, scrappedQty: 0, plannedStart: "2026-07-27", plannedEnd: "2026-08-04", actualStart: null, actualEnd: null, progressPct: 0, plannedHours: 96, actualHours: 0, laborCost: 0, materialCost: 360000, overheadCost: 0, supervisor: "Arun Gupta" },
  { id: "WO-2026-5008", partNo: "WH-8008", partDescription: "Wiring Harness Continuity", bomRef: "BOM-1008", qipRef: "QIP-2007", customer: "TVS Motors", warehouse: "Bengaluru Plant", workCenter: "WC-ASSY-05", type: "production", status: "in-progress", priority: "high", orderQty: 800, completedQty: 480, scrappedQty: 12, plannedStart: "2026-07-19", plannedEnd: "2026-07-29", actualStart: "2026-07-19T07:00", actualEnd: null, progressPct: 60, plannedHours: 80, actualHours: 51, laborCost: 30600, materialCost: 88000, overheadCost: 15300, supervisor: "Sneha Reddy" },
  { id: "WO-2026-5009", partNo: "EB-9009", partDescription: "Engine Bolt M12 Tensile", bomRef: "BOM-1009", qipRef: "QIP-2008", customer: "Tata Motors", warehouse: "Pune Plant", workCenter: "WC-FORG-01", type: "production", status: "closed", priority: "medium", orderQty: 5000, completedQty: 4960, scrappedQty: 40, plannedStart: "2026-07-05", plannedEnd: "2026-07-18", actualStart: "2026-07-05T06:00", actualEnd: "2026-07-18T16:00", progressPct: 100, plannedHours: 104, actualHours: 110, laborCost: 39600, materialCost: 124000, overheadCost: 19800, supervisor: "Rajesh Kumar" },
  { id: "WO-2026-5010", partNo: "OL-1010", partDescription: "Engine Oil SAE 15W-40 Viscosity", bomRef: "BOM-1010", qipRef: "QIP-2009", customer: "Castrol India", warehouse: "Mumbai DC", workCenter: "WC-BLD-01", type: "production", status: "completed", priority: "low", orderQty: 2000, completedQty: 2000, scrappedQty: 0, plannedStart: "2026-07-10", plannedEnd: "2026-07-20", actualStart: "2026-07-10T06:00", actualEnd: "2026-07-19T18:00", progressPct: 100, plannedHours: 80, actualHours: 78, laborCost: 28080, materialCost: 600000, overheadCost: 14040, supervisor: "Priya Sharma" },
  { id: "WO-2026-5011", partNo: "WS-1011", partDescription: "Windshield Optical Grade", bomRef: "BOM-1011", qipRef: "QIP-2010", customer: "Maruti Suzuki", warehouse: "Delhi NCR Hub", workCenter: "WC-TEMP-01", type: "production", status: "cancelled", priority: "low", orderQty: 200, completedQty: 0, scrappedQty: 0, plannedStart: "2026-07-15", plannedEnd: "2026-07-25", actualStart: null, actualEnd: null, progressPct: 0, plannedHours: 80, actualHours: 0, laborCost: 0, materialCost: 0, overheadCost: 0, supervisor: "Arun Gupta" },
  { id: "WO-2026-5012", partNo: "RC-1012", partDescription: "Radiator Cap Pressure 1.1 bar", bomRef: "BOM-1012", qipRef: "QIP-2011", customer: "Honda Cars", warehouse: "Pune Plant", workCenter: "WC-STMP-01", type: "rework", status: "in-progress", priority: "high", orderQty: 400, completedQty: 220, scrappedQty: 5, plannedStart: "2026-07-22", plannedEnd: "2026-07-30", actualStart: "2026-07-22T08:00", actualEnd: null, progressPct: 55, plannedHours: 56, actualHours: 32, laborCost: 19200, materialCost: 36000, overheadCost: 9600, supervisor: "Rajesh Kumar" },
  { id: "WO-2026-5013", partNo: "AF-1013", partDescription: "Air Filter Dust Efficiency", bomRef: "BOM-1013", qipRef: "QIP-2012", customer: "Bosch India", warehouse: "Chennai Hub", workCenter: "WC-ASSY-06", type: "production", status: "created", priority: "medium", orderQty: 1500, completedQty: 0, scrappedQty: 0, plannedStart: "2026-07-29", plannedEnd: "2026-08-08", actualStart: null, actualEnd: null, progressPct: 0, plannedHours: 88, actualHours: 0, laborCost: 0, materialCost: 0, overheadCost: 0, supervisor: "Sneha Reddy" },
  { id: "WO-2026-5014", partNo: "SP-1014", partDescription: "Spark Plug Gap 0.9mm", bomRef: "BOM-1014", qipRef: "QIP-2013", customer: "NGK Spark Plugs", warehouse: "Bengaluru Plant", workCenter: "WC-ASSY-07", type: "sample", status: "completed", priority: "low", orderQty: 50, completedQty: 50, scrappedQty: 0, plannedStart: "2026-07-12", plannedEnd: "2026-07-16", actualStart: "2026-07-12T10:00", actualEnd: "2026-07-15T17:00", progressPct: 100, plannedHours: 32, actualHours: 30, laborCost: 10800, materialCost: 8500, overheadCost: 5400, supervisor: "Priya Sharma" },
  { id: "WO-2026-5015", partNo: "CA-1015", partDescription: "Clutch Assembly FAI", bomRef: "BOM-1015", qipRef: "QIP-2014", customer: "Mahindra", warehouse: "Pune Plant", workCenter: "WC-ASSY-08", type: "prototype", status: "quality-hold", priority: "critical", orderQty: 10, completedQty: 6, scrappedQty: 1, plannedStart: "2026-07-15", plannedEnd: "2026-07-28", actualStart: "2026-07-15T09:00", actualEnd: null, progressPct: 60, plannedHours: 120, actualHours: 84, laborCost: 50400, materialCost: 48000, overheadCost: 25200, supervisor: "Arun Gupta" },
  { id: "WO-2026-5016", partNo: "HS-1016", partDescription: "Helmet Shell Impact Test", bomRef: "BOM-1016", qipRef: "QIP-2015", customer: "Steelbird", warehouse: "Delhi NCR Hub", workCenter: "WC-MOLD-01", type: "production", status: "released", priority: "medium", orderQty: 800, completedQty: 0, scrappedQty: 0, plannedStart: "2026-07-28", plannedEnd: "2026-08-05", actualStart: null, actualEnd: null, progressPct: 0, plannedHours: 80, actualHours: 0, laborCost: 0, materialCost: 192000, overheadCost: 0, supervisor: "Sneha Reddy" },
]

function genRoutingSteps(seed: number): WORoutingStep[] {
  const h = hash(`routing-${seed}`)
  const ops = [
    { op: "Material Issue & Setup", wc: "WC-STG-01", setup: 1.5, run: 0.0 },
    { op: "CNC Turning", wc: "WC-CNC-01", setup: 2.0, run: 0.08 },
    { op: "Milling Operation", wc: "WC-MILL-01", setup: 1.8, run: 0.12 },
    { op: "Welding Joint", wc: "WC-WLD-01", setup: 1.2, run: 0.05 },
    { op: "Surface Grinding", wc: "WC-GRND-01", setup: 1.0, run: 0.04 },
    { op: "Sub-Assembly", wc: "WC-ASSY-01", setup: 0.8, run: 0.10 },
    { op: "Final Assembly", wc: "WC-ASSY-FN", setup: 0.5, run: 0.06 },
    { op: "In-Process Inspection", wc: "QC-LAB-01", setup: 0.3, run: 0.02 },
    { op: "Final Inspection", wc: "QC-FNL-01", setup: 0.2, run: 0.03 },
    { op: "Packaging", wc: "WC-PKG-01", setup: 0.5, run: 0.02 },
  ]
  const operators = ["Ravi Patel", "Sunil Yadav", "Anita Desai", "Manoj Singh", "Lakshmi Iyer", "Vikram Rao", "Deepak Joshi", "Meena Nair"]
  // Pick 5-7 steps based on seed
  const numSteps = 5 + (h % 3)
  const chosen = ops.slice(0, numSteps)
  const statuses: WORoutingStep["status"][] = ["pending", "in-progress", "completed", "skipped"]
  return chosen.map((o, i) => {
    const stepH = hash(`step-${seed}-${i}`)
    const st = i < numSteps - 2 ? "completed" : i === numSteps - 2 ? "in-progress" : "pending"
    const st2 = i < 2 ? "completed" : st === "completed" && stepH % 17 === 0 ? "skipped" : st
    return {
      seq: i + 10,
      operation: o.op,
      workCenter: o.wc,
      setupHours: o.setup,
      runHoursPerUnit: o.run,
      status: st2 as WORoutingStep["status"],
      operator: st2 === "completed" || st2 === "in-progress" ? pick(operators, stepH) : null,
      startTime: st2 === "completed" || st2 === "in-progress" ? "2026-07-22T07:30" : null,
      endTime: st2 === "completed" ? "2026-07-22T15:45" : null,
    }
  })
}

function genMaterialIssues(seed: number, partNo: string): WOMaterialIssue[] {
  const h = hash(`mat-${seed}-${partNo}`)
  const baseMats = [
    { partNo: "RM-001", desc: "Steel Sheet CR 2mm", unit: "kg", wh: "Chennai Hub" },
    { partNo: "RM-002", desc: "Cast Iron Block", unit: "pc", wh: "Pune Plant" },
    { partNo: "RM-003", desc: "Rubber Compound", unit: "kg", wh: "Chennai Hub" },
    { partNo: "RM-004", desc: "Aluminum Alloy 6061", unit: "kg", wh: "Bengaluru Plant" },
    { partNo: "RM-005", desc: "Hex Bolt M12", unit: "pc", wh: "Chennai Hub" },
    { partNo: "RM-006", desc: "Seal Ring NBR", unit: "pc", wh: "Pune Plant" },
    { partNo: "RM-007", desc: "Lithium Grease", unit: "kg", wh: "Mumbai DC" },
    { partNo: "RM-008", desc: "Paint Powder Coat", unit: "kg", wh: "Delhi NCR Hub" },
  ]
  const statuses: WOMaterialIssue["status"][] = ["pending", "partial", "issued", "shortage"]
  const numMats = 4 + (h % 3)
  const chosen = baseMats.slice(0, numMats)
  return chosen.map((m, i) => {
    const mh = hash(`mat-${seed}-${partNo}-${i}`)
    const required = 50 + (mh % 450)
    const statusIdx = (mh >> 3) % 4
    const status = statuses[statusIdx]
    const issued = status === "issued" ? required : status === "partial" ? Math.floor(required * 0.6) : status === "shortage" ? Math.floor(required * 0.3) : 0
    return {
      partNo: m.partNo,
      description: m.desc,
      requiredQty: required,
      issuedQty: issued,
      unit: m.unit,
      warehouse: m.wh,
      status,
    }
  })
}

function genLaborEntries(seed: number): WOLaborEntry[] {
  const h = hash(`labor-${seed}`)
  const ops = ["CNC Turning", "Milling Operation", "Sub-Assembly", "Final Assembly", "In-Process Inspection"]
  const names = ["Ravi Patel", "Sunil Yadav", "Anita Desai", "Manoj Singh", "Lakshmi Iyer", "Vikram Rao"]
  const roles = ["Operator L2", "Operator L3", "Operator L1", "Inspector", "Setup Technician"]
  const numEntries = 3 + (h % 3)
  return Array.from({ length: numEntries }, (_, i) => {
    const lh = hash(`labor-${seed}-${i}`)
    const op = ops[i % ops.length]
    const name = names[lh % names.length]
    const role = roles[lh % roles.length]
    const hours = 4 + (lh % 6)
    return {
      operator: name,
      role,
      clockIn: "2026-07-22T07:00",
      clockOut: i < numEntries - 1 ? "2026-07-22T15:00" : null,
      hours,
      operation: op,
    }
  })
}

function genInspectionResults(seed: number, qipRef: string): WOInspectionResult[] {
  const h = hash(`insp-${seed}-${qipRef}`)
  const chars = [
    { name: "Hardness Shore A", spec: "85±5", type: "in-process" },
    { name: "Bore Diameter", spec: "Ø50±0.02", type: "in-process" },
    { name: "Surface Roughness Ra", spec: "≤1.6µm", type: "in-process" },
    { name: "Tensile Strength", spec: "≥520 MPa", type: "final" },
    { name: "Concentricity", spec: "≤0.05mm", type: "final" },
    { name: "Dimensional Length", spec: "120±0.1", type: "final" },
    { name: "Visual Inspection", spec: "No defects", type: "final" },
    { name: "Leak Test Pressure", spec: "≥2 bar", type: "audit" },
  ]
  const results: WOInspectionResult["result"][] = ["pass", "fail", "conditional"]
  const inspectors = ["Anil K.", "Sunita P.", "Manoj R.", "Geeta S."]
  const numResults = 5 + (h % 3)
  return chars.slice(0, numResults).map((c, i) => {
    const ih = hash(`insp-${seed}-${qipRef}-${i}`)
    // 80% pass, 10% conditional, 10% fail
    const r = (ih % 10) < 8 ? "pass" : (ih % 10) === 8 ? "conditional" : "fail"
    return {
      qipRef,
      inspectionType: c.type,
      seq: i + 1,
      characteristic: c.name,
      spec: c.spec,
      measured: r === "pass" ? c.spec.split(/[±≤≥]/)[0] : r === "conditional" ? c.spec + " (borderline)" : "Out of spec",
      result: r as WOInspectionResult["result"],
      inspector: inspectors[ih % inspectors.length],
      timestamp: "2026-07-22T14:30",
    }
  })
}

function genNCRLinks(seed: number): WONCRLink[] {
  const h = hash(`ncr-${seed}`)
  // 35% of WOs have at least one NCR
  if (h % 100 > 35) return []
  const titles = [
    { id: "NCR-2026-1001", title: "Brake Pad Hardness Below Spec", sev: "critical" as const, st: "capa-open" },
    { id: "NCR-2026-1004", title: "Caliper Seal Leakage Detected", sev: "critical" as const, st: "verification" },
    { id: "NCR-2026-1006", title: "Battery Thermal Anomaly", sev: "critical" as const, st: "containment" },
    { id: "NCR-2026-1008", title: "Wiring Harness Continuity Fail", sev: "major" as const, st: "open" },
    { id: "NCR-2026-1012", title: "Radiator Cap Pressure Fail", sev: "major" as const, st: "investigation" },
    { id: "NCR-2026-1015", title: "Clutch Assembly FAI Deviation", sev: "major" as const, st: "capa-open" },
  ]
  const numLinks = 1 + (h % 2)
  return Array.from({ length: numLinks }, (_, i) => {
    const nh = hash(`ncr-${seed}-${i}`)
    const t = titles[nh % titles.length]
    return {
      ncrId: t.id,
      title: t.title,
      severity: t.sev,
      status: t.st,
      raisedAt: "2026-07-23T11:20",
    }
  })
}

// Build the WO list
const WORK_ORDERS: WorkOrder[] = WO_SEEDS.map((s) => {
  const routingSteps = genRoutingSteps(hash(s.id))
  const materialIssues = genMaterialIssues(hash(s.id), s.partNo)
  const laborEntries = s.status === "created" || s.status === "released" || s.status === "cancelled" ? [] : genLaborEntries(hash(s.id))
  const inspectionResults = s.status === "created" || s.status === "released" || s.status === "cancelled" ? [] : genInspectionResults(hash(s.id), s.qipRef)
  const ncrLinks = genNCRLinks(hash(s.id))
  return {
    ...s,
    routingSteps,
    materialIssues,
    laborEntries,
    inspectionResults,
    ncrLinks,
    createdAt: "2026-07-15T09:00",
    notes:
      s.priority === "critical"
        ? "Critical priority — expedite through quality review. Customer SLA at risk."
        : s.status === "quality-hold"
        ? "Production paused pending QIP review. Material lot under investigation."
        : "Standard production schedule. Material availability confirmed.",
  }
})

// ──────────────────────────────────────────────────────────
// STATUS TABS
// ──────────────────────────────────────────────────────────

const STATUS_TABS: Array<{ key: WOStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "created", label: "Created" },
  { key: "released", label: "Released" },
  { key: "started", label: "Started" },
  { key: "in-progress", label: "In Progress" },
  { key: "quality-hold", label: "Quality Hold" },
  { key: "completed", label: "Completed" },
  { key: "closed", label: "Closed" },
  { key: "cancelled", label: "Cancelled" },
]

// Shared formatters (so drawer + main view both can use)
const fmtINR = (n: number) => "₹" + n.toLocaleString("en-IN")
const fmtNum = (n: number) => n.toLocaleString("en-IN")

// ──────────────────────────────────────────────────────────
// MAIN VIEW
// ──────────────────────────────────────────────────────────

export function WorkOrderManagementView() {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<WOStatus | "all">("all")
  const [typeFilter, setTypeFilter] = useState<WOType | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<WOPriority | "all">("all")
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredWOs = useMemo(() => {
    return WORK_ORDERS.filter((w) => {
      if (statusFilter !== "all" && w.status !== statusFilter) return false
      if (typeFilter !== "all" && w.type !== typeFilter) return false
      if (priorityFilter !== "all" && w.priority !== priorityFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          w.id.toLowerCase().includes(q) ||
          w.partNo.toLowerCase().includes(q) ||
          w.partDescription.toLowerCase().includes(q) ||
          w.customer.toLowerCase().includes(q) ||
          w.bomRef.toLowerCase().includes(q) ||
          w.qipRef.toLowerCase().includes(q) ||
          w.workCenter.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, statusFilter, typeFilter, priorityFilter])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: WORK_ORDERS.length }
    STATUS_TABS.forEach((t) => {
      if (t.key !== "all") counts[t.key] = WORK_ORDERS.filter((w) => w.status === t.key).length
    })
    return counts
  }, [])

  // KPI calculations
  const kpis = useMemo(() => {
    const total = WORK_ORDERS.length
    const active = WORK_ORDERS.filter((w) => w.status === "started" || w.status === "in-progress" || w.status === "quality-hold").length
    const completed30d = WORK_ORDERS.filter((w) => w.status === "completed" || w.status === "closed").length
    const onHold = WORK_ORDERS.filter((w) => w.status === "quality-hold").length
    const totalScrap = WORK_ORDERS.reduce((s, w) => s + w.scrappedQty, 0)
    const totalPlanned = WORK_ORDERS.reduce((s, w) => s + w.orderQty, 0)
    const scrapRate = totalPlanned > 0 ? (totalScrap / totalPlanned) * 100 : 0
    const totalLaborCost = WORK_ORDERS.reduce((s, w) => s + w.laborCost, 0)
    const totalMaterialCost = WORK_ORDERS.reduce((s, w) => s + w.materialCost, 0)
    const totalOverheadCost = WORK_ORDERS.reduce((s, w) => s + w.overheadCost, 0)
    const totalCost = totalLaborCost + totalMaterialCost + totalOverheadCost
    const avgProgress = total > 0 ? WORK_ORDERS.reduce((s, w) => s + w.progressPct, 0) / total : 0
    const totalNCRs = WORK_ORDERS.reduce((s, w) => s + w.ncrLinks.length, 0)
    return {
      total,
      active,
      completed30d,
      onHold,
      scrapRate,
      totalCost,
      avgProgress,
      totalNCRs,
      totalLaborCost,
      totalMaterialCost,
      totalOverheadCost,
    }
  }, [])

  // 6-month WO trend
  const trendData = useMemo(() => {
    return [
      { month: "Feb", opened: 12, completed: 10 },
      { month: "Mar", opened: 14, completed: 13 },
      { month: "Apr", opened: 11, completed: 12 },
      { month: "May", opened: 16, completed: 14 },
      { month: "Jun", opened: 18, completed: 16 },
      { month: "Jul", opened: 16, completed: 13 },
    ]
  }, [])

  // WOs by status (pie)
  const statusPieData = useMemo(() => {
    const data: { name: string; value: number; color: string }[] = []
    Object.keys(STATUS_META).forEach((k) => {
      const count = WORK_ORDERS.filter((w) => w.status === k).length
      if (count > 0) data.push({ name: STATUS_META[k as WOStatus].label, value: count, color: STATUS_META[k as WOStatus].pieColor })
    })
    return data
  }, [])

  // WOs by type (bar)
  const typeBarData = useMemo(() => {
    return Object.keys(TYPE_META).map((k) => ({
      name: TYPE_META[k as WOType].label,
      count: WORK_ORDERS.filter((w) => w.type === k).length,
      color: TYPE_META[k as WOType].pieColor,
    }))
  }, [])

  // Top work centers (bar)
  const wcBarData = useMemo(() => {
    const map = new Map<string, number>()
    WORK_ORDERS.forEach((w) => {
      map.set(w.workCenter, (map.get(w.workCenter) || 0) + 1)
    })
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [])

  function handleExport() {
    const rows = filteredWOs.map((w) => ({
      "WO ID": w.id,
      "Part No": w.partNo,
      Description: w.partDescription,
      "BOM Ref": w.bomRef,
      "QIP Ref": w.qipRef,
      Customer: w.customer,
      Warehouse: w.warehouse,
      "Work Center": w.workCenter,
      Type: TYPE_META[w.type].label,
      Status: STATUS_META[w.status].label,
      Priority: PRIORITY_META[w.priority].label,
      "Order Qty": w.orderQty,
      "Completed Qty": w.completedQty,
      "Scrapped Qty": w.scrappedQty,
      "Progress %": w.progressPct,
      "Planned Start": w.plannedStart,
      "Planned End": w.plannedEnd,
      "Actual Start": w.actualStart || "",
      "Actual End": w.actualEnd || "",
      "Planned Hours": w.plannedHours,
      "Actual Hours": w.actualHours,
      "Labor Cost": w.laborCost,
      "Material Cost": w.materialCost,
      "Overhead Cost": w.overheadCost,
      "Total Cost": w.laborCost + w.materialCost + w.overheadCost,
      Supervisor: w.supervisor,
      "NCR Count": w.ncrLinks.length,
    }))
    exportToCSV(rows, `work-orders-${new Date().toISOString().slice(0, 10)}`)
    toast.success("Export complete", `${filteredWOs.length} work order records exported to CSV`)
  }

  function handleRefresh() {
    toast.success("Data refreshed", "Work order list synchronized with ERP/MES")
  }

  function handleNewWO() {
    toast.info("New WO", "Work order creation wizard will open — select BOM and routing template")
  }

  function handleRowClick(wo: WorkOrder) {
    setSelectedWO(wo)
    setDrawerOpen(true)
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <style jsx global>{`
        @keyframes wo-kpi-enter {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes wo-chart-enter {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes wo-row-in {
          0% { opacity: 0; transform: translateX(-6px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes wo-row-pulse {
          0%, 100% { background-color: rgb(254 226 226 / 0.6); }
          50% { background-color: rgb(254 202 202 / 0.85); }
        }
        @keyframes wo-sheen {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes wo-badge-pop {
          0% { transform: scale(0.6); }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes wo-stat-enter {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <PageHeader
        title="Work Order Management"
        description="Manufacturing execution backbone — links BOM → routing → QIP → NCR. Plan, release, execute, inspect, and close work orders across all plants."
      />

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleNewWO} className="wo-kpi-enter gap-2">
          <Plus className="h-4 w-4" />
          New Work Order
        </Button>
        <Button variant="outline" onClick={handleRefresh} className="btn-outline-animate gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" onClick={handleExport} className="btn-outline-animate gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <div className="ml-auto text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredWOs.length}</span> of {WORK_ORDERS.length} work orders
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="wo-kpi-enter relative overflow-hidden border-blue-200/50" style={{ animationDelay: "0ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-blue-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Total WOs</p>
              <Hash className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{kpis.total}</p>
            <p className="text-xs text-blue-700 mt-1">{kpis.active} active now</p>
          </CardContent>
        </Card>
        <Card className="wo-kpi-enter relative overflow-hidden border-emerald-200/50" style={{ animationDelay: "60ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-emerald-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Completed (30d)</p>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{kpis.completed30d}</p>
            <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +18% MoM
            </p>
          </CardContent>
        </Card>
        <Card className="wo-kpi-enter relative overflow-hidden border-amber-200/50" style={{ animationDelay: "120ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-amber-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Quality Hold</p>
              <CirclePause className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-amber-700">{kpis.onHold}</p>
            <p className="text-xs text-amber-700 mt-1">Needs disposition</p>
          </CardContent>
        </Card>
        <Card className="wo-kpi-enter relative overflow-hidden border-rose-200/50" style={{ animationDelay: "180ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-rose-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Scrap Rate</p>
              <XCircle className="h-4 w-4 text-rose-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{kpis.scrapRate.toFixed(2)}%</p>
            <p className="text-xs text-rose-700 mt-1 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" /> -0.4% WoW
            </p>
          </CardContent>
        </Card>
        <Card className="wo-kpi-enter relative overflow-hidden border-violet-200/50" style={{ animationDelay: "240ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-violet-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Total Cost</p>
              <IndianRupee className="h-4 w-4 text-violet-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{fmtINR(kpis.totalCost)}</p>
            <p className="text-xs text-violet-700 mt-1">{fmtINR(kpis.totalLaborCost)} labor</p>
          </CardContent>
        </Card>
        <Card className="wo-kpi-enter relative overflow-hidden border-orange-200/50" style={{ animationDelay: "300ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-orange-100/60 blur-lg" />
          <CardContent className="glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Linked NCRs</p>
              <FileWarning className="h-4 w-4 text-orange-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{kpis.totalNCRs}</p>
            <p className="text-xs text-orange-700 mt-1">From active WOs</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="wo-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">6-Month WO Trend</CardTitle>
            <CardDescription className="text-xs">Opened vs Completed work orders per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="woOpenedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="woCompletedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="opened" name="Opened" stroke="#3b82f6" strokeWidth={2} fill="url(#woOpenedGrad)" />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} fill="url(#woCompletedGrad)" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="wo-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">WOs by Status</CardTitle>
            <CardDescription className="text-xs">Distribution across the 8 lifecycle stages</CardDescription>
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

        <Card className="wo-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">WOs by Type</CardTitle>
            <CardDescription className="text-xs">Production vs rework vs prototype vs maintenance</CardDescription>
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

        <Card className="wo-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Work Centers</CardTitle>
            <CardDescription className="text-xs">Most active work centers by WO count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={wcBarData} layout="vertical" margin={{ top: 10, right: 20, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" className="text-xs" tick={{ fontSize: 10 }} width={80} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#8b5cf6" />
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
                "wo-tab-btn inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "wo-badge-pop inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold",
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
            placeholder="Search by WO ID, part, customer, BOM/QIP ref, work center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="wo-search-focus pl-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as WOType | "all")}>
          <SelectTrigger className="w-[160px]">
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
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as WOPriority | "all")}>
          <SelectTrigger className="w-[150px]">
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
      </div>

      {/* WO Master Table */}
      <Card className="card-crud-lift wo-table-card">
        <CardContent className="glass-subtle p-0">
          <Table className="table-hover-highlight">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[120px]">WO ID</TableHead>
                <TableHead className="min-w-[280px]">Part / Customer</TableHead>
                <TableHead className="w-[110px]">Type</TableHead>
                <TableHead className="w-[130px]">Status</TableHead>
                <TableHead className="w-[90px]">Priority</TableHead>
                <TableHead className="w-[120px] text-right">Qty (Done/Order)</TableHead>
                <TableHead className="w-[110px]">Progress</TableHead>
                <TableHead className="w-[100px] text-right">Hours</TableHead>
                <TableHead className="w-[110px] text-right">Cost (₹)</TableHead>
                <TableHead className="w-[100px]">Work Center</TableHead>
                <TableHead className="w-[60px] text-right">NCRs</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWOs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-muted-foreground text-sm">
                    No work orders match the current filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredWOs.map((wo, idx) => {
                  const SM = STATUS_META[wo.status]
                  const PM = PRIORITY_META[wo.priority]
                  const TM = TYPE_META[wo.type]
                  const StatusIcon = SM.icon
                  const PriIcon = PM.icon
                  const TypeIcon = TM.icon
                  const totalCost = wo.laborCost + wo.materialCost + wo.overheadCost
                  const isCritical = wo.priority === "critical" && wo.status !== "closed" && wo.status !== "cancelled"
                  const isHold = wo.status === "quality-hold"
                  const isClosed = wo.status === "closed" || wo.status === "cancelled"
                  return (
                    <TableRow
                      key={wo.id}
                      onClick={() => handleRowClick(wo)}
                      className={cn(
                        "wo-row-in cursor-pointer border-b transition-colors",
                        isCritical && "wo-row-critical",
                        isHold && "bg-amber-50/40 hover:bg-amber-50/70",
                        isClosed && "opacity-60",
                        !isCritical && !isHold && !isClosed && "hover:bg-muted/40"
                      )}
                      style={{ animationDelay: `${Math.min(idx * 18, 360)}ms` }}
                    >
                      <TableCell className="font-mono text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={cn("bg-primary/10 text-[10px] font-bold", TM.color)}>
                              {wo.type === "production" ? "PR" : wo.type === "rework" ? "RW" : wo.type === "prototype" ? "PT" : wo.type === "maintenance" ? "MT" : "SM"}
                            </AvatarFallback>
                          </Avatar>
                          {wo.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{wo.partDescription}</span>
                          <span className="text-xs text-muted-foreground">
                            {wo.partNo} · {wo.customer} · {wo.warehouse}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {wo.bomRef} · {wo.qipRef}
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
                        <span className="font-medium">{fmtNum(wo.completedQty)}</span>
                        <span className="text-muted-foreground"> / {fmtNum(wo.orderQty)}</span>
                        {wo.scrappedQty > 0 && (
                          <div className="text-[10px] text-rose-600">-{fmtNum(wo.scrappedQty)} scrap</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={wo.progressPct} className="h-2 w-[80px]" />
                          <span className="text-xs tabular-nums text-muted-foreground">{wo.progressPct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-xs">
                        <span className={cn(wo.actualHours > wo.plannedHours ? "text-rose-600 font-medium" : "")}>
                          {wo.actualHours}h
                        </span>
                        <span className="text-muted-foreground"> / {wo.plannedHours}h</span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-xs">
                        {totalCost === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="font-medium">{fmtINR(totalCost)}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono">{wo.workCenter}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {wo.ncrLinks.length > 0 ? (
                          <Badge variant="outline" className="badge-interactive bg-rose-50 text-rose-700 border-rose-200 text-xs">
                            {wo.ncrLinks.length} NCR
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

      {/* Detail Drawer */}
      <WorkOrderDetailDrawer wo={selectedWO} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// DETAIL DRAWER
// ──────────────────────────────────────────────────────────

type DrawerTab = "overview" | "routing" | "materials" | "labor" | "quality" | "ncrs"

function WorkOrderDetailDrawer({
  wo,
  open,
  onOpenChange,
}: {
  wo: WorkOrder | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const toast = useToast()
  const [tab, setTab] = useState<DrawerTab>("overview")

  React.useEffect(() => {
    if (open) setTab("overview")
  }, [open, wo?.id])

  if (!wo) return null

  const SM = STATUS_META[wo.status]
  const PM = PRIORITY_META[wo.priority]
  const TM = TYPE_META[wo.type]
  const StatusIcon = SM.icon
  const totalCost = wo.laborCost + wo.materialCost + wo.overheadCost
  const plannedCost = wo.plannedHours * 450 + wo.materialCost
  const costVariance = totalCost - plannedCost
  const routingCompleted = wo.routingSteps.filter((s) => s.status === "completed").length
  const routingTotal = wo.routingSteps.length
  const routingPct = routingTotal > 0 ? Math.round((routingCompleted / routingTotal) * 100) : 0
  const inspectionPass = wo.inspectionResults.filter((i) => i.result === "pass").length
  const inspectionFail = wo.inspectionResults.filter((i) => i.result === "fail").length
  const inspectionTotal = wo.inspectionResults.length
  const passRate = inspectionTotal > 0 ? Math.round((inspectionPass / inspectionTotal) * 100) : 0
  const materialIssued = wo.materialIssues.filter((m) => m.status === "issued").length
  const materialTotal = wo.materialIssues.length

  function handleExport() {
    if (!wo) return
    const rows = [
      {
        "WO ID": wo.id,
        Part: wo.partNo,
        Description: wo.partDescription,
        Customer: wo.customer,
        Status: SM.label,
        "Progress %": wo.progressPct,
        "Routing Completed": `${routingCompleted}/${routingTotal}`,
        "Inspection Pass Rate": `${passRate}%`,
        "Total Cost": totalCost,
        NCRs: wo.ncrLinks.length,
      },
    ]
    exportToCSV(rows, `${wo.id}-summary`)
    toast.success("Export complete", `${wo.id} summary exported`)
  }

  function handleAction(action: string) {
    if (!wo) return
    if (action === "release") toast.success("WO Released", `${wo.id} is now ready for production start`)
    else if (action === "start") toast.success("WO Started", `${wo.id} production has begun`)
    else if (action === "hold") toast.warning("Quality Hold", `${wo.id} paused pending QIP review`)
    else if (action === "resume") toast.success("WO Resumed", `${wo.id} production resumed after hold`)
    else if (action === "complete") toast.success("WO Completed", `${wo.id} marked as completed — ready for closure`)
    else if (action === "close") toast.success("WO Closed", `${wo.id} closed — moved to archive`)
  }

  const tabs: Array<{ key: DrawerTab; label: string; count?: number }> = [
    { key: "overview", label: "Overview" },
    { key: "routing", label: "Routing", count: routingTotal },
    { key: "materials", label: "Materials", count: materialTotal },
    { key: "labor", label: "Labor", count: wo.laborEntries.length },
    { key: "quality", label: "Quality", count: inspectionTotal },
    { key: "ncrs", label: "NCRs", count: wo.ncrLinks.length },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="wo-drawer-content w-full sm:max-w-[900px] overflow-y-auto p-0">
        <style jsx>{`
          .wo-drawer-content {
            background:
              linear-gradient(180deg, var(--background) 0%, var(--background) 100%);
          }
          .wo-drawer-content::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
            z-index: 50;
          }
        `}</style>

        {/* Sheen sweep on open */}
        <div className="wo-drawer-sheen pointer-events-none absolute inset-x-0 top-0 h-12 overflow-hidden">
          <div className="wo-sheen absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        <SheetHeader className="wo-drawer-header border-b bg-gradient-to-r from-blue-50/60 via-violet-50/40 to-transparent px-6 pb-4 pt-6">
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
              <SheetTitle className="text-xl">{wo.partDescription}</SheetTitle>
              <SheetDescription className="font-mono text-xs">
                {wo.id} · {wo.partNo} · {wo.bomRef} · {wo.qipRef}
              </SheetDescription>
              <div className="text-xs text-muted-foreground">
                {wo.customer} · {wo.warehouse} · {wo.workCenter} · Supervisor: {wo.supervisor}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>

          {/* Hero stat grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="wo-stat-enter rounded-lg border border-blue-200/50 bg-white/60 p-3" style={{ animationDelay: "0ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Hash className="h-3 w-3" />
                Progress
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">{wo.progressPct}%</p>
              <p className="text-[10px] text-muted-foreground">{routingCompleted}/{routingTotal} routing steps</p>
            </div>
            <div className="wo-stat-enter rounded-lg border border-emerald-200/50 bg-white/60 p-3" style={{ animationDelay: "80ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">{fmtNum(wo.completedQty)}</p>
              <p className="text-[10px] text-muted-foreground">of {fmtNum(wo.orderQty)} ordered</p>
            </div>
            <div className="wo-stat-enter rounded-lg border border-violet-200/50 bg-white/60 p-3" style={{ animationDelay: "160ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IndianRupee className="h-3 w-3" />
                Total Cost
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">{fmtINR(totalCost)}</p>
              <p className={cn("text-[10px]", costVariance > 0 ? "text-rose-600" : "text-emerald-600")}>
                {costVariance > 0 ? "+" : ""}{fmtINR(costVariance)} vs planned
              </p>
            </div>
            <div className="wo-stat-enter rounded-lg border border-orange-200/50 bg-white/60 p-3" style={{ animationDelay: "240ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileWarning className="h-3 w-3" />
                NCRs
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">{wo.ncrLinks.length}</p>
              <p className="text-[10px] text-muted-foreground">{passRate}% inspection pass</p>
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
                    "wo-tab-btn relative -mb-px px-3 py-2.5 text-xs font-medium transition-all",
                    isActive ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                  {t.count !== undefined && t.count > 0 && (
                    <span className="wo-badge-pop ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-muted-foreground/15 px-1 text-[10px] font-bold">
                      {t.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="wo-body-enter space-y-4 p-6">
          {tab === "overview" && (
            <>
              {/* Production Progress */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Production Progress</CardTitle>
                </CardHeader>
                <CardContent className="glass-subtle grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="wo-stat-enter space-y-1">
                    <p className="text-xs text-muted-foreground">Order Qty</p>
                    <p className="text-xl font-bold tabular-nums">{fmtNum(wo.orderQty)}</p>
                  </div>
                  <div className="wo-stat-enter space-y-1">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-xl font-bold tabular-nums text-emerald-700">{fmtNum(wo.completedQty)}</p>
                  </div>
                  <div className="wo-stat-enter space-y-1">
                    <p className="text-xs text-muted-foreground">Scrapped</p>
                    <p className="text-xl font-bold tabular-nums text-rose-700">{fmtNum(wo.scrappedQty)}</p>
                  </div>
                  <div className="wo-stat-enter space-y-1">
                    <p className="text-xs text-muted-foreground">In WIP</p>
                    <p className="text-xl font-bold tabular-nums text-violet-700">
                      {fmtNum(wo.orderQty - wo.completedQty - wo.scrappedQty)}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Overall Completion</span>
                      <span className="font-medium tabular-nums">{wo.progressPct}%</span>
                    </div>
                    <Progress value={wo.progressPct} className="h-2.5" />
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Schedule</CardTitle>
                </CardHeader>
                <CardContent className="glass-subtle grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" /> Planned Start
                    </div>
                    <p className="mt-1 text-sm font-medium">{wo.plannedStart}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClock className="h-3 w-3" /> Planned End
                    </div>
                    <p className="mt-1 text-sm font-medium">{wo.plannedEnd}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Play className="h-3 w-3" /> Actual Start
                    </div>
                    <p className="mt-1 text-sm font-medium">{wo.actualStart || "—"}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" /> Actual End
                    </div>
                    <p className="mt-1 text-sm font-medium">{wo.actualEnd || "—"}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-2 rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Timer className="h-3 w-3" /> Planned vs Actual Hours
                    </div>
                    <p className="mt-1 text-sm font-medium tabular-nums">
                      {wo.actualHours}h / {wo.plannedHours}h
                      <span className={cn("ml-2 text-xs", wo.actualHours > wo.plannedHours ? "text-rose-600" : "text-emerald-600")}>
                        ({wo.actualHours > wo.plannedHours ? "+" : ""}{wo.actualHours - wo.plannedHours}h variance)
                      </span>
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-2 rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Briefcase className="h-3 w-3" /> Work Center / Supervisor
                    </div>
                    <p className="mt-1 text-sm font-medium">
                      {wo.workCenter} · {wo.supervisor}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="glass-subtle grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-md border p-3 bg-blue-50/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" /> Labor
                    </div>
                    <p className="mt-1 text-sm font-bold tabular-nums">{fmtINR(wo.laborCost)}</p>
                  </div>
                  <div className="rounded-md border p-3 bg-violet-50/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Boxes className="h-3 w-3" /> Material
                    </div>
                    <p className="mt-1 text-sm font-bold tabular-nums">{fmtINR(wo.materialCost)}</p>
                  </div>
                  <div className="rounded-md border p-3 bg-amber-50/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Cog className="h-3 w-3" /> Overhead
                    </div>
                    <p className="mt-1 text-sm font-bold tabular-nums">{fmtINR(wo.overheadCost)}</p>
                  </div>
                  <div className="rounded-md border p-3 bg-emerald-50/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <IndianRupee className="h-3 w-3" /> Total
                    </div>
                    <p className="mt-1 text-sm font-bold tabular-nums">{fmtINR(totalCost)}</p>
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
                    onClick={() => toast.info("Navigate", `Opening BOM record: ${wo.bomRef}`)}
                    className="wo-card-enter rounded-md border border-blue-200/50 bg-blue-50/30 p-3 text-left hover:border-blue-400 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Layers className="h-3 w-3" /> BOM Ref
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="mt-1 font-mono text-sm font-semibold text-blue-700">{wo.bomRef}</p>
                  </button>
                  <button
                    onClick={() => toast.info("Navigate", `Opening QIP record: ${wo.qipRef}`)}
                    className="wo-card-enter rounded-md border border-violet-200/50 bg-violet-50/30 p-3 text-left hover:border-violet-400 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Stethoscope className="h-3 w-3" /> QIP Ref
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="mt-1 font-mono text-sm font-semibold text-violet-700">{wo.qipRef}</p>
                  </button>
                  <div className="rounded-md border p-3 bg-muted/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" /> Customer / Warehouse
                    </div>
                    <p className="mt-1 text-sm font-medium">{wo.customer}</p>
                    <p className="text-xs text-muted-foreground">{wo.warehouse}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="border-amber-200/50 bg-amber-50/20">
                <CardContent className="glass-subtle p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800">Production Notes</p>
                      <p className="mt-1 text-xs text-amber-900/80">{wo.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {tab === "routing" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Routing Steps — {routingCompleted}/{routingTotal} Completed ({routingPct}%)</CardTitle>
                <CardDescription className="text-xs">Sequential manufacturing operations for this work order</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={routingPct} className="mb-4 h-2" />
                <div className="space-y-2">
                  {wo.routingSteps.map((step, idx) => {
                    const meta = ROUTING_STEP_STATUS[step.status]
                    const Icon = meta.icon
                    const isLast = idx === wo.routingSteps.length - 1
                    return (
                      <div
                        key={step.seq}
                        className={cn(
                          "wo-card-enter relative flex items-start gap-3 rounded-md border p-3",
                          step.status === "in-progress" && "border-violet-300 bg-violet-50/40",
                          step.status === "completed" && "border-emerald-200/50 bg-emerald-50/20",
                          step.status === "skipped" && "border-rose-200/50 bg-rose-50/20 opacity-75"
                        )}
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        {/* Connector line */}
                        {!isLast && (
                          <div className="absolute left-[26px] top-12 bottom-[-12px] w-px bg-muted-foreground/20" />
                        )}
                        <div
                          className={cn(
                            "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                            meta.bg,
                            meta.color
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-muted-foreground">#{step.seq}</span>
                                <p className="text-sm font-medium">{step.operation}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {step.workCenter} · Setup {step.setupHours}h · Run {step.runHoursPerUnit}h/unit
                              </p>
                              {step.operator && (
                                <p className="text-[10px] text-muted-foreground">
                                  Operator: <span className="font-medium text-foreground">{step.operator}</span>
                                  {step.startTime && ` · Started ${step.startTime}`}
                                  {step.endTime && ` · Ended ${step.endTime}`}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className={cn("gap-1 text-xs", meta.color, meta.bg)}>
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

          {tab === "materials" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Material Issues — {materialIssued}/{materialTotal} Fully Issued</CardTitle>
                <CardDescription className="text-xs">Raw material requirements and issue status from stores</CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-[100px]">Part No</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Required</TableHead>
                      <TableHead className="text-right">Issued</TableHead>
                      <TableHead className="w-[80px]">Unit</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="w-[110px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wo.materialIssues.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                          No material issues yet (WO not yet released)
                        </TableCell>
                      </TableRow>
                    ) : (
                      wo.materialIssues.map((m, idx) => {
                        const meta = MATERIAL_STATUS[m.status]
                        const Icon = meta.icon
                        const issuePct = m.requiredQty > 0 ? Math.min(100, Math.round((m.issuedQty / m.requiredQty) * 100)) : 0
                        return (
                          <TableRow
                            key={m.partNo}
                            className="wo-row-in hover:bg-muted/40"
                            style={{ animationDelay: `${idx * 40}ms` }}
                          >
                            <TableCell className="font-mono text-xs font-semibold">{m.partNo}</TableCell>
                            <TableCell className="text-sm">{m.description}</TableCell>
                            <TableCell className="text-right tabular-nums text-sm">{fmtNum(m.requiredQty)}</TableCell>
                            <TableCell className="text-right tabular-nums text-sm">
                              <div className="flex flex-col items-end">
                                <span className={cn(m.issuedQty < m.requiredQty ? "text-amber-700 font-medium" : "text-emerald-700 font-medium")}>
                                  {fmtNum(m.issuedQty)}
                                </span>
                                <Progress value={issuePct} className="mt-1 h-1 w-[60px]" />
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{m.unit}</TableCell>
                            <TableCell className="text-xs">{m.warehouse}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("gap-1 text-xs", meta.color, meta.bg)}>
                                <Icon className="h-3 w-3" />
                                {meta.label}
                              </Badge>
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

          {tab === "labor" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Labor Entries — {wo.laborEntries.length} Operators</CardTitle>
                <CardDescription className="text-xs">Clock-in / clock-out records per operator</CardDescription>
              </CardHeader>
              <CardContent>
                {wo.laborEntries.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No labor entries yet (WO not yet started)
                  </div>
                ) : (
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-[180px]">Operator</TableHead>
                        <TableHead className="w-[140px]">Role</TableHead>
                        <TableHead>Operation</TableHead>
                        <TableHead className="w-[140px]">Clock In</TableHead>
                        <TableHead className="w-[140px]">Clock Out</TableHead>
                        <TableHead className="w-[80px] text-right">Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wo.laborEntries.map((l, idx) => (
                        <TableRow
                          key={`${l.operator}-${idx}`}
                          className="wo-row-in hover:bg-muted/40"
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-blue-100 text-[10px] font-bold text-blue-700">
                                  {l.operator.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{l.operator}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="outline" className="badge-interactive bg-blue-50 text-blue-700">
                              {l.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{l.operation}</TableCell>
                          <TableCell className="font-mono text-xs">{l.clockIn}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {l.clockOut || <span className="text-violet-600 font-medium">Active</span>}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm font-medium">{l.hours}h</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {tab === "quality" && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Inspection Results — {passRate}% Pass Rate</CardTitle>
                  <CardDescription className="text-xs">
                    Linked to QIP: <span className="font-mono font-semibold text-violet-700">{wo.qipRef}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="glass-subtle grid grid-cols-3 gap-3">
                  <div className="rounded-md border border-emerald-200/50 bg-emerald-50/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Passed</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">{inspectionPass}</p>
                  </div>
                  <div className="rounded-md border border-rose-200/50 bg-rose-50/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Failed</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-rose-700">{inspectionFail}</p>
                  </div>
                  <div className="rounded-md border border-blue-200/50 bg-blue-50/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums">{inspectionTotal}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="glass-subtle p-0">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-[60px]">Seq</TableHead>
                        <TableHead className="w-[110px]">Type</TableHead>
                        <TableHead>Characteristic</TableHead>
                        <TableHead>Spec</TableHead>
                        <TableHead>Measured</TableHead>
                        <TableHead className="w-[110px]">Result</TableHead>
                        <TableHead className="w-[100px]">Inspector</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wo.inspectionResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                            No inspection results yet (WO not yet in production)
                          </TableCell>
                        </TableRow>
                      ) : (
                        wo.inspectionResults.map((r, idx) => {
                          const meta = INSPECTION_RESULT[r.result]
                          const Icon = meta.icon
                          return (
                            <TableRow
                              key={r.seq}
                              className={cn(
                                "wo-row-in hover:bg-muted/40",
                                r.result === "fail" && "bg-rose-50/30",
                                r.result === "conditional" && "bg-amber-50/30"
                              )}
                              style={{ animationDelay: `${idx * 40}ms` }}
                            >
                              <TableCell className="font-mono text-xs">{r.seq}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="badge-interactive text-[10px] bg-muted">
                                  {r.inspectionType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-medium">{r.characteristic}</TableCell>
                              <TableCell className="font-mono text-xs">{r.spec}</TableCell>
                              <TableCell className="font-mono text-xs">{r.measured}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn("gap-1 text-xs", meta.color, meta.bg)}>
                                  <Icon className="h-3 w-3" />
                                  {meta.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs">{r.inspector}</TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {tab === "ncrs" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Linked NCRs — {wo.ncrLinks.length} Total</CardTitle>
                <CardDescription className="text-xs">Non-conformances raised against this work order</CardDescription>
              </CardHeader>
              <CardContent>
                {wo.ncrLinks.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                    No NCRs — quality record clean
                  </div>
                ) : (
                  <div className="space-y-2">
                    {wo.ncrLinks.map((n, idx) => {
                      const sevMeta =
                        n.severity === "critical"
                          ? { color: "text-rose-700", bg: "bg-rose-50", icon: AlertTriangle }
                          : n.severity === "major"
                          ? { color: "text-amber-700", bg: "bg-amber-50", icon: AlertTriangle }
                          : { color: "text-blue-700", bg: "bg-blue-50", icon: Crosshair }
                      const SevIcon = sevMeta.icon
                      return (
                        <button
                          key={n.ncrId}
                          onClick={() => toast.info("Navigate", `Opening NCR record: ${n.ncrId}`)}
                          className={cn(
                            "wo-card-enter w-full rounded-md border p-3 text-left hover:shadow-sm",
                            sevMeta.color,
                            sevMeta.bg,
                            "border-current/20"
                          )}
                          style={{ animationDelay: `${idx * 60}ms` }}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <SevIcon className="h-3 w-3" />
                                <span className="font-mono text-xs font-semibold">{n.ncrId}</span>
                                <Badge variant="outline" className={cn("text-[10px]", sevMeta.color, sevMeta.bg)}>
                                  {n.severity}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Raised: {n.raisedAt} · Status: {n.status}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer with status-aware actions */}
        <SheetFooter className="border-t bg-muted/30 px-6 py-3">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              Created: <span className="font-mono">{wo.createdAt}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="btn-outline-animate gap-1">
                <Download className="h-3 w-3" />
                Export
              </Button>
              {wo.status === "created" && (
                <Button size="sm" onClick={() => handleAction("release")} className="gap-1">
                  <ArrowRightCircle className="h-3 w-3" />
                  Release
                </Button>
              )}
              {wo.status === "released" && (
                <Button size="sm" onClick={() => handleAction("start")} className="gap-1">
                  <Play className="h-3 w-3" />
                  Start Production
                </Button>
              )}
              {(wo.status === "started" || wo.status === "in-progress") && (
                <Button variant="outline" size="sm" onClick={() => handleAction("hold")} className="btn-outline-animate gap-1 border-amber-300 text-amber-700">
                  <CirclePause className="h-3 w-3" />
                  Quality Hold
                </Button>
              )}
              {wo.status === "quality-hold" && (
                <Button size="sm" onClick={() => handleAction("resume")} className="gap-1">
                  <Play className="h-3 w-3" />
                  Resume
                </Button>
              )}
              {wo.status === "in-progress" && wo.progressPct >= 95 && (
                <Button size="sm" onClick={() => handleAction("complete")} className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Complete
                </Button>
              )}
              {wo.status === "completed" && (
                <Button size="sm" onClick={() => handleAction("close")} className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Close WO
                </Button>
              )}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
