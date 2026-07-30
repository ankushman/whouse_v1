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
  Mail,
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
  Send,
  Inbox,
  PenLine,
  FileCheck,
  FileClock,
  ShieldCheck,
  Wrench,
  Target,
  ListChecks,
  Crosshair,
  History,
  Factory,
  Boxes,
  User,
  Users,
  Calendar,
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  ArrowRightCircle,
  ThumbsUp,
  Award,
  Star,
  Gauge,
  Stethoscope,
  Microscope,
  ClipboardList,
  FileWarning,
  AlertOctagon,
  CircleDollarSign,
  Building2,
  Phone,
  Mailbox,
  Briefcase,
  ShieldAlert,
  Repeat,
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

type SCARStatus =
  | "draft"
  | "issued"
  | "acknowledged"
  | "in-progress"
  | "response-received"
  | "under-review"
  | "closed-effective"
  | "closed-failed"
  | "rejected"

type SCARSeverity = "critical" | "major" | "minor"
type SCARPriority = "low" | "medium" | "high" | "critical"

type EightDStep =
  | "d1-team"
  | "d2-problem"
  | "d3-containment"
  | "d4-root-cause"
  | "d5-corrective"
  | "d6-implement"
  | "d7-prevent"
  | "d8-recognize"

interface EightDResponse {
  step: EightDStep
  title: string
  description: string
  supplierResponse: string
  responseDate: string | null
  status: "pending" | "in-progress" | "completed" | "verified" | "failed"
  owner: string
}

interface ContainmentAction {
  id: string
  action: string
  type: "supplier" | "internal" | "customer"
  owner: string
  dueDate: string
  completedDate: string | null
  status: "pending" | "in-progress" | "completed" | "overdue"
  effectiveness: "pending" | "effective" | "ineffective" | null
}

interface RCAContribution {
  category: "material" | "machine" | "method" | "manpower" | "measurement" | "environment" | "design"
  contribution: number
  description: string
}

interface CorrectiveAction {
  id: string
  type: "corrective" | "preventive"
  action: string
  owner: string
  dueDate: string
  completedDate: string | null
  status: "pending" | "in-progress" | "implemented" | "verified" | "effective" | "failed"
  verificationMethod: string
  verificationDate: string | null
  effectivenessScore: number
}

interface ScorecardImpact {
  pointsDeducted: number
  ratingBefore: string
  ratingAfter: string
  ratingBeforeScore: number
  ratingAfterScore: number
  recoveryPlan: string
  recoveryTimelineDays: number
  recoveryProgress: number
  reviewCycle: string
  nextAuditDate: string
}

interface SupplierCorrectiveActionRequest {
  id: string
  ncrRef: string
  title: string
  supplierName: string
  supplierCode: string
  supplierContact: string
  supplierEmail: string
  supplierPhone: string
  partNo: string
  partDescription: string
  warehouse: string
  severity: SCARSeverity
  priority: SCARPriority
  status: SCARStatus
  defectType: string
  defectDescription: string
  issueDate: string
  responseDueDate: string
  responseReceivedDate: string | null
  closedDate: string | null
  ageDays: number
  daysToClose: number | null
  owner: string
  ownerEmail: string
  eightDResponses: EightDResponse[]
  containmentActions: ContainmentAction[]
  rcaContributions: RCAContribution[]
  correctiveActions: CorrectiveAction[]
  scorecardImpact: ScorecardImpact
  costImpact: number
  recoveryCost: number
  notes: string
}

// ──────────────────────────────────────────────────────────
// META
// ──────────────────────────────────────────────────────────

const STATUS_META: Record<
  SCARStatus,
  { label: string; color: string; bg: string; border: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }
> = {
  draft:              { label: "Draft",              color: "text-slate-700",   bg: "bg-slate-100",   border: "border-slate-200",   pieColor: "#64748b", icon: PenLine },
  issued:             { label: "Issued",             color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200",    pieColor: "#3b82f6", icon: Send },
  acknowledged:       { label: "Acknowledged",       color: "text-cyan-700",    bg: "bg-cyan-50",     border: "border-cyan-200",    pieColor: "#06b6d4", icon: Inbox },
  "in-progress":      { label: "In Progress",        color: "text-violet-700",  bg: "bg-violet-50",   border: "border-violet-200",  pieColor: "#8b5cf6", icon: Activity },
  "response-received":{ label: "Response Received",  color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200",   pieColor: "#f59e0b", icon: FileClock },
  "under-review":     { label: "Under Review",       color: "text-indigo-700",  bg: "bg-indigo-50",   border: "border-indigo-200",  pieColor: "#6366f1", icon: Stethoscope },
  "closed-effective": { label: "Closed (Effective)", color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", pieColor: "#10b981", icon: CheckCircle2 },
  "closed-failed":    { label: "Closed (Failed)",    color: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-200",    pieColor: "#ef4444", icon: XCircle },
  rejected:           { label: "Rejected",           color: "text-red-700",     bg: "bg-red-50",      border: "border-red-200",     pieColor: "#dc2626", icon: AlertOctagon },
}

const SEVERITY_META: Record<SCARSeverity, { label: string; color: string; bg: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  critical: { label: "Critical", color: "text-rose-700",  bg: "bg-rose-50",  pieColor: "#ef4444", icon: AlertOctagon },
  major:    { label: "Major",    color: "text-amber-700", bg: "bg-amber-50", pieColor: "#f59e0b", icon: AlertTriangle },
  minor:    { label: "Minor",    color: "text-blue-700",  bg: "bg-blue-50",  pieColor: "#3b82f6", icon: Crosshair },
}

const PRIORITY_META: Record<SCARPriority, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  low:      { label: "Low",      color: "text-slate-700", bg: "bg-slate-100", icon: ChevronRight },
  medium:   { label: "Medium",   color: "text-blue-700",  bg: "bg-blue-50",   icon: ChevronRight },
  high:     { label: "High",     color: "text-amber-700", bg: "bg-amber-50",  icon: AlertTriangle },
  critical: { label: "Critical", color: "text-rose-700",  bg: "bg-rose-50",   icon: AlertTriangle },
}

const EIGHT_D_META: Record<
  EightDStep,
  { num: string; label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "d1-team":         { num: "D1", label: "Establish Team",          color: "text-blue-700",    bg: "bg-blue-50",    icon: Users },
  "d2-problem":      { num: "D2", label: "Describe Problem",        color: "text-cyan-700",    bg: "bg-cyan-50",    icon: ClipboardList },
  "d3-containment":  { num: "D3", label: "Interim Containment",     color: "text-amber-700",   bg: "bg-amber-50",   icon: ShieldAlert },
  "d4-root-cause":   { num: "D4", label: "Root Cause Analysis",     color: "text-violet-700",  bg: "bg-violet-50",  icon: Stethoscope },
  "d5-corrective":   { num: "D5", label: "Corrective Actions",      color: "text-indigo-700",  bg: "bg-indigo-50",  icon: Wrench },
  "d6-implement":    { num: "D6", label: "Implement & Validate",    color: "text-teal-700",    bg: "bg-teal-50",    icon: CheckCircle2 },
  "d7-prevent":      { num: "D7", label: "Prevent Recurrence",      color: "text-orange-700",  bg: "bg-orange-50",  icon: ShieldCheck },
  "d8-recognize":    { num: "D8", label: "Recognize Team",          color: "text-pink-700",    bg: "bg-pink-50",    icon: Award },
}

const EIGHT_D_STATUS: Record<
  EightDResponse["status"],
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending:     { label: "Pending",     color: "text-slate-700",  bg: "bg-slate-100",  icon: Clock },
  "in-progress": { label: "In Progress", color: "text-violet-700", bg: "bg-violet-50", icon: Activity },
  completed:   { label: "Completed",   color: "text-blue-700",   bg: "bg-blue-50",    icon: CheckCircle2 },
  verified:    { label: "Verified",    color: "text-emerald-700",bg: "bg-emerald-50", icon: ShieldCheck },
  failed:      { label: "Failed",      color: "text-rose-700",   bg: "bg-rose-50",    icon: XCircle },
}

const RCA_META: Record<
  RCAContribution["category"],
  { label: string; color: string; bg: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }
> = {
  material:    { label: "Material",    color: "text-rose-700",    bg: "bg-rose-50",    pieColor: "#ef4444", icon: Boxes },
  machine:     { label: "Machine",     color: "text-amber-700",   bg: "bg-amber-50",   pieColor: "#f59e0b", icon: Wrench },
  method:      { label: "Method",      color: "text-blue-700",    bg: "bg-blue-50",    pieColor: "#3b82f6", icon: ListChecks },
  manpower:    { label: "Manpower",    color: "text-violet-700",  bg: "bg-violet-50",  pieColor: "#8b5cf6", icon: User },
  measurement: { label: "Measurement", color: "text-emerald-700", bg: "bg-emerald-50", pieColor: "#10b981", icon: Crosshair },
  environment: { label: "Environment", color: "text-teal-700",    bg: "bg-teal-50",    pieColor: "#14b8a6", icon: Activity },
  design:      { label: "Design",      color: "text-orange-700",  bg: "bg-orange-50",  pieColor: "#f97316", icon: Target },
}

const CONTAINMENT_STATUS: Record<
  ContainmentAction["status"],
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending:     { label: "Pending",     color: "text-slate-700",  bg: "bg-slate-100",  icon: Clock },
  "in-progress": { label: "In Progress", color: "text-violet-700", bg: "bg-violet-50", icon: Activity },
  completed:   { label: "Completed",   color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2 },
  overdue:     { label: "Overdue",     color: "text-rose-700",   bg: "bg-rose-50",    icon: AlertTriangle },
}

const CONTAINMENT_TYPE: Record<
  ContainmentAction["type"],
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  supplier: { label: "Supplier",  color: "text-violet-700",  bg: "bg-violet-50",  icon: Factory },
  internal: { label: "Internal",  color: "text-blue-700",    bg: "bg-blue-50",    icon: Building2 },
  customer: { label: "Customer",  color: "text-amber-700",   bg: "bg-amber-50",   icon: Briefcase },
}

const CORRECTIVE_STATUS: Record<
  CorrectiveAction["status"],
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending:      { label: "Pending",      color: "text-slate-700",  bg: "bg-slate-100",  icon: Clock },
  "in-progress":{ label: "In Progress",  color: "text-amber-700",  bg: "bg-amber-50",   icon: Activity },
  implemented:  { label: "Implemented",  color: "text-blue-700",   bg: "bg-blue-50",    icon: ArrowRightCircle },
  verified:     { label: "Verified",     color: "text-violet-700", bg: "bg-violet-50",  icon: FileCheck },
  effective:    { label: "Effective",    color: "text-emerald-700",bg: "bg-emerald-50", icon: ThumbsUp },
  failed:       { label: "Failed",       color: "text-rose-700",   bg: "bg-rose-50",    icon: XCircle },
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

// 16 SCAR seeds — Indian automotive supplier corrective actions
const SCAR_SEEDS: Array<{
  id: string
  ncrRef: string
  title: string
  supplierName: string
  supplierCode: string
  supplierContact: string
  supplierEmail: string
  supplierPhone: string
  partNo: string
  partDescription: string
  warehouse: string
  severity: SCARSeverity
  priority: SCARPriority
  status: SCARStatus
  defectType: string
  defectDescription: string
  issueDate: string
  responseDueDate: string
  responseReceivedDate: string | null
  closedDate: string | null
  ageDays: number
  daysToClose: number | null
  owner: string
  ownerEmail: string
  costImpact: number
  recoveryCost: number
}> = [
  { id: "SCAR-2026-3001", ncrRef: "NCR-2026-1001", title: "Brake Pad Hardness Below Spec — Supplier Process Drift", supplierName: "BrakeTech Industries", supplierCode: "SUP-1001", supplierContact: "Ramesh Patel", supplierEmail: "quality@braketech.in", supplierPhone: "+91-9876543001", partNo: "BP-1001", partDescription: "Brake Pad Assembly — Passenger Car", warehouse: "Chennai Hub", severity: "critical", priority: "critical", status: "closed-effective", defectType: "Hardness Out of Spec", defectDescription: "Shore A hardness measured 78-82 vs spec 85±5 across 3 consecutive lots. Root cause: curing press temperature drift 8°C below set point.", issueDate: "2026-06-15", responseDueDate: "2026-07-15", responseReceivedDate: "2026-07-10", closedDate: "2026-07-22", ageDays: 37, daysToClose: 37, owner: "Quality Manager", ownerEmail: "qm@autoflow.in", costImpact: 184000, recoveryCost: 42000 },
  { id: "SCAR-2026-3002", ncrRef: "NCR-2026-1002", title: "Wheel Rim Concentricity Fail — CNC Tool Wear", supplierName: "WheelCast Pvt Ltd", supplierCode: "SUP-1002", supplierContact: "Sunil Mehta", supplierEmail: "sunil.m@wheelcast.in", supplierPhone: "+91-9876543002", partNo: "WR-2002", partDescription: "Wheel Rim 17\" Machined", warehouse: "Chennai Hub", severity: "major", priority: "high", status: "closed-effective", defectType: "Concentricity Out of Tolerance", defectDescription: "Concentricity measured 0.08-0.12mm vs spec ≤0.05mm on 17\" rim batch. Tool wear exceeded lifecycle limit by 22%.", issueDate: "2026-06-20", responseDueDate: "2026-07-20", responseReceivedDate: "2026-07-12", closedDate: "2026-07-25", ageDays: 35, daysToClose: 35, owner: "Quality Manager", ownerEmail: "qm@autoflow.in", costImpact: 96000, recoveryCost: 18500 },
  { id: "SCAR-2026-3003", ncrRef: "NCR-2026-1003", title: "Engine Block Porosity — Sand Mold Moisture", supplierName: "CastIron Foundry", supplierCode: "SUP-1003", supplierContact: "Anil Agarwal", supplierEmail: "foundry@castiron.co.in", supplierPhone: "+91-9876543003", partNo: "EB-3003", partDescription: "Engine Block Cast Iron V3", warehouse: "Pune Plant", severity: "critical", priority: "critical", status: "under-review", defectType: "Casting Porosity", defectDescription: "X-ray inspection revealed 3-5mm gas porosity in critical wall sections across 6 of 12 blocks. Sand mold moisture 4.2% vs target 2.5-3.0%.", issueDate: "2026-06-25", responseDueDate: "2026-07-25", responseReceivedDate: "2026-07-23", closedDate: null, ageDays: 31, daysToClose: null, owner: "Plant Quality Head", ownerEmail: "pqh.pune@autoflow.in", costImpact: 640000, recoveryCost: 95000 },
  { id: "SCAR-2026-3004", ncrRef: "NCR-2026-1004", title: "Caliper Seal Leakage — Compound Hardness Drift", supplierName: "SealMaster Rubber", supplierCode: "SUP-1004", supplierContact: "Vinod Sharma", supplierEmail: "vinod@sealmaster.in", supplierPhone: "+91-9876543004", partNo: "CS-4004", partDescription: "Caliper Seal Assembly", warehouse: "Chennai Hub", severity: "critical", priority: "critical", status: "closed-effective", defectType: "Seal Leakage", defectDescription: "Pressure decay test failed at 1.6 bar vs ≥2.0 bar requirement. Compound hardness drift 87A vs 75A target due to incorrect polymer blend ratio.", issueDate: "2026-06-10", responseDueDate: "2026-07-10", responseReceivedDate: "2026-07-05", closedDate: "2026-07-18", ageDays: 38, daysToClose: 38, owner: "Quality Manager", ownerEmail: "qm@autoflow.in", costImpact: 198400, recoveryCost: 38000 },
  { id: "SCAR-2026-3005", ncrRef: "NCR-2026-1005", title: "Shock Absorber Damping Variation — Valve Assembly", supplierName: "SuspensionCorp", supplierCode: "SUP-1005", supplierContact: "Mahesh Iyer", supplierEmail: "mahesh@suspensioncorp.in", supplierPhone: "+91-9876543005", partNo: "SA-5005", partDescription: "Shock Absorber Rear Damping", warehouse: "Pune Plant", severity: "major", priority: "high", status: "response-received", defectType: "Damping Force Variation", defectDescription: "Damping force varies 18-25% across test sample vs ≤10% spec. Valve plate shim stack assembly procedure non-compliant with control plan.", issueDate: "2026-07-01", responseDueDate: "2026-07-31", responseReceivedDate: "2026-07-25", closedDate: null, ageDays: 25, daysToClose: null, owner: "Plant Quality Head", ownerEmail: "pqh.pune@autoflow.in", costImpact: 210000, recoveryCost: 0 },
  { id: "SCAR-2026-3006", ncrRef: "NCR-2026-1006", title: "Li-Ion Thermal Anomaly — BMS Firmware Bug", supplierName: "PowerCell Energy", supplierCode: "SUP-1006", supplierContact: "Sneha Reddy", supplierEmail: "sneha.r@powercell.in", supplierPhone: "+91-9876543006", partNo: "BT-6006", partDescription: "Li-Ion Battery Pack 48V", warehouse: "Bengaluru Plant", severity: "critical", priority: "critical", status: "in-progress", defectType: "Thermal Runaway Risk", defectDescription: "Battery pack temperature exceeded 65°C during fast-charge test. BMS firmware v2.3.1 has incorrect thermal threshold calibration.", issueDate: "2026-07-08", responseDueDate: "2026-08-08", responseReceivedDate: null, closedDate: null, ageDays: 18, daysToClose: null, owner: "EV Quality Lead", ownerEmail: "evq@autoflow.in", costImpact: 425000, recoveryCost: 0 },
  { id: "SCAR-2026-3007", ncrRef: "NCR-2026-1007", title: "Tire Bead Damage — Curing Press Misalignment", supplierName: "MRF Tyres Ltd", supplierCode: "SUP-1007", supplierContact: "George Thomas", supplierEmail: "george.t@mrf.co.in", supplierPhone: "+91-9876543007", partNo: "TB-7007", partDescription: "Tire Bead 18\" Heavy Duty", warehouse: "Chennai Hub", severity: "major", priority: "medium", status: "acknowledged", defectType: "Bead Damage", defectDescription: "Visual bead damage on 4% of sample. Curing press #3 lower platen misaligned 0.8mm from baseline.", issueDate: "2026-07-12", responseDueDate: "2026-08-11", responseReceivedDate: null, closedDate: null, ageDays: 14, daysToClose: null, owner: "Quality Manager", ownerEmail: "qm@autoflow.in", costImpact: 360000, recoveryCost: 0 },
  { id: "SCAR-2026-3008", ncrRef: "NCR-2026-1008", title: "Wiring Harness Continuity Fail — Solder Joint", supplierName: "WireTech Electronics", supplierCode: "SUP-1008", supplierContact: "Priya Krishnan", supplierEmail: "priya@wiretech.in", supplierPhone: "+91-9876543008", partNo: "WH-8008", partDescription: "Wiring Harness Continuity", warehouse: "Bengaluru Plant", severity: "major", priority: "high", status: "closed-effective", defectType: "Continuity Fail", defectDescription: "Open circuit on connector pin 14. Solder joint cold due to wave solder flux density below control limit.", issueDate: "2026-06-18", responseDueDate: "2026-07-18", responseReceivedDate: "2026-07-10", closedDate: "2026-07-20", ageDays: 32, daysToClose: 32, owner: "EV Quality Lead", ownerEmail: "evq@autoflow.in", costImpact: 88000, recoveryCost: 15500 },
  { id: "SCAR-2026-3009", ncrRef: "NCR-2026-1009", title: "Engine Bolt Tensile Fail — Heat Treatment Lapse", supplierName: "FastenWell Forge", supplierCode: "SUP-1009", supplierContact: "Sanjay Gupta", supplierEmail: "sanjay@fastenwell.in", supplierPhone: "+91-9876543009", partNo: "EB-9009", partDescription: "Engine Bolt M12 Tensile", warehouse: "Pune Plant", severity: "critical", priority: "critical", status: "closed-effective", defectType: "Tensile Strength Fail", defectDescription: "Tensile strength 480 MPa vs ≥520 MPa requirement. Heat treatment batch SK-2406 had quench delay of 8s vs ≤3s specification.", issueDate: "2026-06-05", responseDueDate: "2026-07-05", responseReceivedDate: "2026-06-28", closedDate: "2026-07-12", ageDays: 37, daysToClose: 37, owner: "Plant Quality Head", ownerEmail: "pqh.pune@autoflow.in", costImpact: 124000, recoveryCost: 28000 },
  { id: "SCAR-2026-3010", ncrRef: "NCR-2026-1010", title: "Engine Oil Viscosity — Blend Ratio Off", supplierName: "LubeIndia Blending", supplierCode: "SUP-1010", supplierContact: "Rakesh Mittal", supplierEmail: "rakesh@lubeindia.in", supplierPhone: "+91-9876543010", partNo: "OL-1010", partDescription: "Engine Oil SAE 15W-40", warehouse: "Mumbai DC", severity: "minor", priority: "low", status: "closed-effective", defectType: "Viscosity Out of Spec", defectDescription: "Kinematic viscosity 14.2 cSt vs 13.5-15.0 target. Blend ratio 14.7:1 vs 15.0:1 spec — within tolerance but borderline.", issueDate: "2026-06-22", responseDueDate: "2026-07-22", responseReceivedDate: "2026-07-15", closedDate: "2026-07-24", ageDays: 32, daysToClose: 32, owner: "Quality Manager", ownerEmail: "qm@autoflow.in", costImpact: 18000, recoveryCost: 4200 },
  { id: "SCAR-2026-3011", ncrRef: "NCR-2026-1011", title: "Windshield Optical Distortion — Glass Flow Rate", supplierName: "GlassVision Industries", supplierCode: "SUP-1011", supplierContact: "Vikram Sethi", supplierEmail: "vikram@glassvision.in", supplierPhone: "+91-9876543011", partNo: "WS-1011", partDescription: "Windshield Optical Grade", warehouse: "Delhi NCR Hub", severity: "major", priority: "medium", status: "issued", defectType: "Optical Distortion", defectDescription: "Optical distortion 2.4 diopters vs ≤1.5 spec. Glass flow rate 8% below control plan during forming.", issueDate: "2026-07-20", responseDueDate: "2026-08-19", responseReceivedDate: null, closedDate: null, ageDays: 6, daysToClose: null, owner: "Quality Manager", ownerEmail: "qm@autoflow.in", costImpact: 96000, recoveryCost: 0 },
  { id: "SCAR-2026-3012", ncrRef: "NCR-2026-1012", title: "Radiator Cap Pressure Fail — Spring Fatigue", supplierName: "SpringWorks Mfg", supplierCode: "SUP-1012", supplierContact: "Amit Bansal", supplierEmail: "amit@springworks.in", supplierPhone: "+91-9876543012", partNo: "RC-1012", partDescription: "Radiator Cap Pressure 1.1 bar", warehouse: "Pune Plant", severity: "major", priority: "high", status: "closed-failed", defectType: "Pressure Hold Fail", defectDescription: "Pressure decay 0.3 bar/min vs ≤0.05 spec. Spring fatigue life 8,000 cycles vs 25,000 minimum — material grade SAE 9254 vs spec SAE 9260.", issueDate: "2026-06-08", responseDueDate: "2026-07-08", responseReceivedDate: "2026-07-15", closedDate: "2026-07-28", ageDays: 50, daysToClose: 50, owner: "Plant Quality Head", ownerEmail: "pqh.pune@autoflow.in", costImpact: 36000, recoveryCost: 22000 },
  { id: "SCAR-2026-3013", ncrRef: "NCR-2026-1013", title: "Air Filter Dust Efficiency — Media Pore Size", supplierName: "FilterFlow Systems", supplierCode: "SUP-1013", supplierContact: "Kavita Nair", supplierEmail: "kavita@filterflow.in", supplierPhone: "+91-9876543013", partNo: "AF-1013", partDescription: "Air Filter Dust Efficiency", warehouse: "Chennai Hub", severity: "minor", priority: "low", status: "draft", defectType: "Efficiency Below Spec", defectDescription: "Dust efficiency 98.7% vs ≥99.2% spec. Media pore size 28µm vs 22µm target.", issueDate: "2026-07-25", responseDueDate: "2026-08-24", responseReceivedDate: null, closedDate: null, ageDays: 1, daysToClose: null, owner: "Quality Manager", ownerEmail: "qm@autoflow.in", costImpact: 8500, recoveryCost: 0 },
  { id: "SCAR-2026-3014", ncrRef: "NCR-2026-1014", title: "Spark Plug Gap Drift — Center Electrode Bend", supplierName: "IgnitionPro", supplierCode: "SUP-1014", supplierContact: "Manish Jain", supplierEmail: "manish@ignitionpro.in", supplierPhone: "+91-9876543014", partNo: "SP-1014", partDescription: "Spark Plug Gap 0.9mm", warehouse: "Bengaluru Plant", severity: "minor", priority: "low", status: "closed-effective", defectType: "Gap Out of Spec", defectDescription: "Gap measured 1.05-1.15mm vs 0.9±0.05 spec. Center electrode bend operation station 4 has worn locating pin.", issueDate: "2026-06-15", responseDueDate: "2026-07-15", responseReceivedDate: "2026-07-08", closedDate: "2026-07-15", ageDays: 30, daysToClose: 30, owner: "EV Quality Lead", ownerEmail: "evq@autoflow.in", costImpact: 8500, recoveryCost: 1800 },
  { id: "SCAR-2026-3015", ncrRef: "NCR-2026-1015", title: "Clutch Assembly FAI Deviation — Friction Material", supplierName: "ClutchTech India", supplierCode: "SUP-1015", supplierContact: "Rohit Deshpande", supplierEmail: "rohit@clutchtech.in", supplierPhone: "+91-9876543015", partNo: "CA-1015", partDescription: "Clutch Assembly FAI", warehouse: "Pune Plant", severity: "critical", priority: "critical", status: "in-progress", defectType: "FAI Dimensional Fail", defectDescription: "First article inspection: friction material thickness 3.8mm vs 4.2±0.1mm spec. Supplier changed sub-tier friction material vendor without PPAP notification.", issueDate: "2026-07-15", responseDueDate: "2026-08-14", responseReceivedDate: null, closedDate: null, ageDays: 11, daysToClose: null, owner: "Plant Quality Head", ownerEmail: "pqh.pune@autoflow.in", costImpact: 48000, recoveryCost: 0 },
  { id: "SCAR-2026-3016", ncrRef: "NCR-2026-1016", title: "Helmet Shell Impact Test Fail — Resin Mix Ratio", supplierName: "SafeHead Mfg", supplierCode: "SUP-1016", supplierContact: "Sridhar Rao", supplierEmail: "sridhar@safehead.in", supplierPhone: "+91-9876543016", partNo: "HS-1016", partDescription: "Helmet Shell Impact Test", warehouse: "Delhi NCR Hub", severity: "critical", priority: "critical", status: "rejected", defectType: "Impact Test Fail", defectDescription: "Impact test G-force 285g vs ≤250g spec. Resin mix ratio 100:8 vs 100:11 spec — insufficient hardener caused under-cure.", issueDate: "2026-06-28", responseDueDate: "2026-07-28", responseReceivedDate: "2026-08-01", closedDate: "2026-08-02", ageDays: 35, daysToClose: 35, owner: "Quality Manager", ownerEmail: "qm@autoflow.in", costImpact: 96000, recoveryCost: 0 },
]

function genEightDResponses(seed: number, status: SCARStatus): EightDResponse[] {
  const h = hash(`8d-${seed}`)
  const statuses: EightDResponse["status"][] = ["pending", "in-progress", "completed", "verified", "failed"]
  // Status mapping: closed-effective → all verified; closed-failed → all completed but one failed; etc.
  const stepStatuses: EightDResponse["status"][] =
    status === "closed-effective"
      ? ["verified", "verified", "verified", "verified", "verified", "verified", "verified", "verified"]
      : status === "closed-failed"
      ? ["verified", "verified", "verified", "completed", "completed", "failed", "pending", "pending"]
      : status === "rejected"
      ? ["completed", "completed", "in-progress", "pending", "pending", "pending", "pending", "pending"]
      : status === "under-review"
      ? ["verified", "verified", "verified", "verified", "completed", "completed", "in-progress", "pending"]
      : status === "response-received"
      ? ["verified", "verified", "verified", "verified", "completed", "completed", "in-progress", "pending"]
      : status === "in-progress"
      ? ["completed", "completed", "completed", "in-progress", "in-progress", "pending", "pending", "pending"]
      : status === "acknowledged"
      ? ["completed", "in-progress", "in-progress", "pending", "pending", "pending", "pending", "pending"]
      : status === "issued"
      ? ["in-progress", "pending", "pending", "pending", "pending", "pending", "pending", "pending"]
      : ["pending", "pending", "pending", "pending", "pending", "pending", "pending", "pending"] // draft
  const owners = ["Ramesh Patel", "Sunil Mehta", "Anil Agarwal", "Vinod Sharma", "Mahesh Iyer", "Sneha Reddy", "George Thomas", "Priya Krishnan"]
  const descriptions: Record<EightDStep, string> = {
    "d1-team": "Cross-functional team assembled: Supplier Quality Engineer, Process Engineer, Production Supervisor, Customer Quality Liaison",
    "d2-problem": "Problem statement defined using 5W2H method. Defect characteristics, frequency, and impact quantified",
    "d3-containment": "Interim containment: 100% sort of affected lots, quarantine of suspect inventory, replacement shipment expedited",
    "d4-root-cause": "Root cause identified via Ishikawa 6M analysis and 5-Why technique. Verified with process data and on-site audit",
    "d5-corrective": "Corrective actions developed and validated via pilot run. Process parameters updated in control plan",
    "d6-implement": "Corrective actions implemented in production. Statistical verification (Cpk ≥1.33) over 30 consecutive pieces",
    "d7-prevent": "Preventive actions: PFMEA update, control plan revision, operator training, work instruction update, layered process audit",
    "d8-recognize": "Team recognition: lessons learned documented, cross-functional review completed, supplier development award considered",
  }
  const supplierResponses: Record<EightDStep, string> = {
    "d1-team": "Team formed with 6 members from Quality, Production, and Engineering departments. Charter signed by Plant Manager.",
    "d2-problem": "Problem clearly defined with measurable characteristics. Affected parts isolated. Defect rate 4.2% across 3 lots.",
    "d3-containment": "Containment actions: 100% inspection of last 5 lots, suspect material quarantined, replacement shipped at no cost.",
    "d4-root-cause": "Root cause: equipment drift due to missed preventive maintenance. Verified with calibration records and process logs.",
    "d5-corrective": "Corrective action: PM schedule revised from 90 to 60 days, automated drift alarm added, secondary verification checkpoint created.",
    "d6-implement": "Implementation complete. Cpk improved from 0.94 to 1.52 over 30-piece capability study. Sustained for 5 consecutive days.",
    "d7-prevent": "Prevention: PFMEA updated, control plan revised, work instructions reissued, 12 operators retrained, LPA added to layer 1.",
    "d8-recognize": "Recognition: team achievement acknowledged in monthly review. Best practice shared across other production lines.",
  }
  const steps: EightDStep[] = ["d1-team", "d2-problem", "d3-containment", "d4-root-cause", "d5-corrective", "d6-implement", "d7-prevent", "d8-recognize"]
  return steps.map((step, i) => {
    const st = stepStatuses[i]
    return {
      step,
      title: EIGHT_D_META[step].label,
      description: descriptions[step],
      supplierResponse: supplierResponses[step],
      responseDate: st === "pending" || st === "in-progress" ? null : `2026-07-${(10 + i).toString().padStart(2, "0")}T14:30`,
      status: st,
      owner: pick(owners, h + i),
    }
  })
}

function genContainmentActions(seed: number, status: SCARStatus): ContainmentAction[] {
  const h = hash(`contain-${seed}`)
  if (status === "draft") return []
  const baseActions = [
    { action: "100% sort of all affected lots at supplier site", type: "supplier" as const, owner: "Supplier Quality Engineer" },
    { action: "Quarantine suspect inventory in our warehouse", type: "internal" as const, owner: "Warehouse Manager" },
    { action: "Notify customer of potential delivery impact", type: "customer" as const, owner: "Customer Quality Liaison" },
    { action: "Expedite replacement shipment from supplier", type: "supplier" as const, owner: "Procurement Manager" },
    { action: "Switch to alternate approved supplier for 30 days", type: "internal" as const, owner: "Procurement Manager" },
  ]
  const numActions = 3 + (h % 3)
  return baseActions.slice(0, numActions).map((a, i) => {
    const ah = hash(`contain-${seed}-${i}`)
    const isClosed = status === "closed-effective" || status === "closed-failed" || status === "rejected"
    // status !== "draft" check eliminated by control flow: function returned early above for draft
    const st: ContainmentAction["status"] = isClosed
      ? "completed"
      : i < 2
      ? "completed"
      : i === 2
      ? "in-progress"
      : ah % 11 === 0
      ? "overdue"
      : "pending"
    const eff: ContainmentAction["effectiveness"] =
      st === "completed"
        ? status === "closed-failed"
          ? ah % 3 === 0
            ? "ineffective"
            : "effective"
          : "effective"
        : "pending"
    return {
      id: `CA-${(seed % 1000).toString().padStart(3, "0")}-${i + 1}`,
      action: a.action,
      type: a.type,
      owner: a.owner,
      dueDate: `2026-07-${(15 + i * 3).toString().padStart(2, "0")}`,
      completedDate: st === "completed" ? `2026-07-${(12 + i).toString().padStart(2, "0")}` : null,
      status: st,
      effectiveness: eff,
    }
  })
}

function genRCAContributions(seed: number): RCAContribution[] {
  const h = hash(`rca-${seed}`)
  // Pick one dominant category and 1-2 secondary
  const cats: RCAContribution["category"][] = ["material", "machine", "method", "manpower", "measurement", "environment", "design"]
  const dominantIdx = h % cats.length
  const secondaryIdx = (dominantIdx + 1 + (h % 5)) % cats.length
  const tertiaryIdx = (dominantIdx + 3 + (h % 3)) % cats.length
  const descs: Record<RCAContribution["category"], string> = {
    material: "Raw material specification deviation — incoming inspection failed to detect drift",
    machine: "Equipment drift / wear beyond PM cycle — process capability degraded",
    method: "Process parameter out of control plan — work instruction not followed",
    manpower: "Operator training gap — new operator not certified for critical operation",
    measurement: "Gauge calibration lapse — measurement system accuracy compromised",
    environment: "Environmental condition (temperature/humidity) outside specification",
    design: "Product design specification ambiguous — tolerance stack-up not analyzed",
  }
  return [
    { category: cats[dominantIdx], contribution: 55 + (h % 20), description: descs[cats[dominantIdx]] },
    { category: cats[secondaryIdx], contribution: 18 + (h % 12), description: descs[cats[secondaryIdx]] },
    { category: cats[tertiaryIdx], contribution: 8 + (h % 8), description: descs[cats[tertiaryIdx]] },
  ]
}

function genCorrectiveActions(seed: number, status: SCARStatus): CorrectiveAction[] {
  const h = hash(`corr-${seed}`)
  if (status === "draft" || status === "issued") return []
  const baseActions = [
    { action: "Revise PM schedule from 90 to 60 days for affected equipment", type: "corrective" as const, method: "PM compliance audit + 6-month data review" },
    { action: "Add automated process drift alarm with supervisor escalation", type: "corrective" as const, method: "Alarm log review + 30-day uptime report" },
    { action: "Update PFMEA and control plan with new failure modes", type: "preventive" as const, method: "Document control review + audit sign-off" },
    { action: "Retrain all line operators on revised work instructions", type: "preventive" as const, method: "Training records + competency assessment" },
    { action: "Add Layered Process Audit (LPA) check at Layer 1", type: "preventive" as const, method: "LPA compliance report + 90-day trend" },
  ]
  const numActions = 3 + (h % 3)
  return baseActions.slice(0, numActions).map((a, i) => {
    const ch = hash(`corr-${seed}-${i}`)
    const st: CorrectiveAction["status"] =
      status === "closed-effective"
        ? "effective"
        : status === "closed-failed" && i === 0
        ? "failed"
        : status === "closed-failed"
        ? "implemented"
        : status === "under-review" || status === "response-received"
        ? i < 2
          ? "verified"
          : "implemented"
        : status === "in-progress"
        ? i < 2
          ? "implemented"
          : "in-progress"
        : i < 1
        ? "in-progress"
        : "pending"
    return {
      id: `CARR-${(seed % 1000).toString().padStart(3, "0")}-${i + 1}`,
      type: a.type,
      action: a.action,
      owner: i % 2 === 0 ? "Supplier Process Engineer" : "Supplier Quality Manager",
      dueDate: `2026-08-${(15 + i * 5).toString().padStart(2, "0")}`,
      completedDate: st === "effective" || st === "verified" || st === "implemented" ? `2026-07-${(20 + i).toString().padStart(2, "0")}` : null,
      status: st,
      verificationMethod: a.method,
      verificationDate: st === "effective" || st === "verified" ? `2026-07-${(25 + i).toString().padStart(2, "0")}` : null,
      effectivenessScore: st === "effective" ? 92 + (ch % 7) : st === "verified" ? 78 + (ch % 12) : 0,
    }
  })
}

function genScorecardImpact(seed: number, severity: SCARSeverity, status: SCARStatus): ScorecardImpact {
  const h = hash(`score-${seed}`)
  const pointsMap: Record<SCARSeverity, number> = { critical: 12, major: 6, minor: 2 }
  const points = status === "closed-effective" ? Math.floor(pointsMap[severity] * 0.7) : pointsMap[severity]
  const ratingBeforeScore = 88 + (h % 8)
  const ratingAfterScore = Math.max(60, ratingBeforeScore - points)
  const ratingBefore = ratingBeforeScore >= 90 ? "A" : ratingBeforeScore >= 80 ? "B" : ratingBeforeScore >= 70 ? "C" : "D"
  const ratingAfter = ratingAfterScore >= 90 ? "A" : ratingAfterScore >= 80 ? "B" : ratingAfterScore >= 70 ? "C" : "D"
  const recoveryDays = 90 + (h % 60)
  const recoveryProgress = status === "closed-effective" ? 100 : status === "closed-failed" || status === "rejected" ? 0 : 25 + (h % 50)
  return {
    pointsDeducted: points,
    ratingBefore,
    ratingAfter,
    ratingBeforeScore,
    ratingAfterScore,
    recoveryPlan: `Supplier must demonstrate sustained Cpk ≥1.50 over ${recoveryDays} days with zero recurrence. Monthly scorecard review with senior leadership until rating recovers to ${ratingBefore}.`,
    recoveryTimelineDays: recoveryDays,
    recoveryProgress,
    reviewCycle: "Monthly",
    nextAuditDate: `2026-${(8 + (h % 3)).toString().padStart(2, "0")}-15`,
  }
}

// Build the SCAR list
const SCARS: SupplierCorrectiveActionRequest[] = SCAR_SEEDS.map((s) => {
  const eightDResponses = genEightDResponses(hash(s.id), s.status)
  const containmentActions = genContainmentActions(hash(s.id), s.status)
  const rcaContributions = genRCAContributions(hash(s.id))
  const correctiveActions = genCorrectiveActions(hash(s.id), s.status)
  const scorecardImpact = genScorecardImpact(hash(s.id), s.severity, s.status)
  return {
    ...s,
    eightDResponses,
    containmentActions,
    rcaContributions,
    correctiveActions,
    scorecardImpact,
    notes:
      s.priority === "critical"
        ? "Critical-priority SCAR — expedited supplier response required. Customer SLA at risk. Daily status review with Plant Director."
        : s.status === "rejected"
        ? "Supplier 8D response rejected — does not meet minimum methodology requirements. Escalation to senior supplier management."
        : s.status === "closed-failed"
        ? "Corrective action failed effectiveness verification. SCAR reissued with mandatory on-site supplier development engagement."
        : "Standard SCAR workflow. Supplier response within 30 calendar days per supplier quality manual.",
  }
})

// ──────────────────────────────────────────────────────────
// STATUS TABS
// ──────────────────────────────────────────────────────────

const STATUS_TABS: Array<{ key: SCARStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "issued", label: "Issued" },
  { key: "acknowledged", label: "Acknowledged" },
  { key: "in-progress", label: "In Progress" },
  { key: "response-received", label: "Response" },
  { key: "under-review", label: "Under Review" },
  { key: "closed-effective", label: "Closed ✓" },
  { key: "closed-failed", label: "Closed ✗" },
  { key: "rejected", label: "Rejected" },
]

const fmtINR = (n: number) => "₹" + n.toLocaleString("en-IN")
const fmtNum = (n: number) => n.toLocaleString("en-IN")

// ──────────────────────────────────────────────────────────
// MAIN VIEW
// ──────────────────────────────────────────────────────────

export function SupplierCorrectiveActionRequestView() {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<SCARStatus | "all">("all")
  const [severityFilter, setSeverityFilter] = useState<SCARSeverity | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<SCARPriority | "all">("all")
  const [selectedSCAR, setSelectedSCAR] = useState<SupplierCorrectiveActionRequest | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredSCARs = useMemo(() => {
    return SCARS.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false
      if (severityFilter !== "all" && s.severity !== severityFilter) return false
      if (priorityFilter !== "all" && s.priority !== priorityFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          s.id.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.supplierName.toLowerCase().includes(q) ||
          s.supplierCode.toLowerCase().includes(q) ||
          s.partNo.toLowerCase().includes(q) ||
          s.ncrRef.toLowerCase().includes(q) ||
          s.defectType.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, statusFilter, severityFilter, priorityFilter])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SCARS.length }
    STATUS_TABS.forEach((t) => {
      if (t.key !== "all") counts[t.key] = SCARS.filter((s) => s.status === t.key).length
    })
    return counts
  }, [])

  // KPI calculations
  const kpis = useMemo(() => {
    const total = SCARS.length
    const open = SCARS.filter((s) => s.status !== "closed-effective" && s.status !== "closed-failed" && s.status !== "rejected").length
    const closed30d = SCARS.filter((s) => s.status === "closed-effective" || s.status === "closed-failed").length
    const effective = SCARS.filter((s) => s.status === "closed-effective").length
    const effectivenessRate = closed30d > 0 ? Math.round((effective / closed30d) * 100) : 0
    const critical = SCARS.filter((s) => s.severity === "critical").length
    const totalCostImpact = SCARS.reduce((sum, s) => sum + s.costImpact, 0)
    const totalRecoveryCost = SCARS.reduce((sum, s) => sum + s.recoveryCost, 0)
    const avgAge = SCARS.length > 0 ? Math.round(SCARS.reduce((sum, s) => sum + s.ageDays, 0) / SCARS.length) : 0
    const overdueResponses = SCARS.filter((s) => {
      if (s.responseReceivedDate || s.status === "closed-effective" || s.status === "closed-failed" || s.status === "rejected") return false
      const due = new Date(s.responseDueDate).getTime()
      const now = new Date("2026-07-26").getTime()
      return due < now
    }).length
    return { total, open, closed30d, effectivenessRate, critical, totalCostImpact, totalRecoveryCost, avgAge, overdueResponses }
  }, [])

  // 6-month trend
  const trendData = useMemo(() => {
    return [
      { month: "Feb", issued: 8, closed: 6 },
      { month: "Mar", opened: 10, closed: 9 },
      { month: "Apr", opened: 9, closed: 11 },
      { month: "May", opened: 12, closed: 10 },
      { month: "Jun", opened: 14, closed: 12 },
      { month: "Jul", opened: 16, closed: 8 },
    ].map((d) => ({ month: d.month, issued: (d as { issued?: number; opened?: number }).issued ?? d.opened ?? 0, closed: d.closed }))
  }, [])

  // SCARs by severity
  const severityPieData = useMemo(() => {
    return Object.keys(SEVERITY_META).map((k) => ({
      name: SEVERITY_META[k as SCARSeverity].label,
      value: SCARS.filter((s) => s.severity === k).length,
      color: SEVERITY_META[k as SCARSeverity].pieColor,
    }))
  }, [])

  // SCARs by status
  const statusPieData = useMemo(() => {
    const data: { name: string; value: number; color: string }[] = []
    Object.keys(STATUS_META).forEach((k) => {
      const count = SCARS.filter((s) => s.status === k).length
      if (count > 0) data.push({ name: STATUS_META[k as SCARStatus].label, value: count, color: STATUS_META[k as SCARStatus].pieColor })
    })
    return data
  }, [])

  // Top suppliers by SCAR count
  const supplierBarData = useMemo(() => {
    const map = new Map<string, { count: number; cost: number }>()
    SCARS.forEach((s) => {
      const existing = map.get(s.supplierName) || { count: 0, cost: 0 }
      existing.count += 1
      existing.cost += s.costImpact
      map.set(s.supplierName, existing)
    })
    return Array.from(map.entries())
      .map(([name, v]) => ({ name: name.length > 22 ? name.slice(0, 22) + "…" : name, count: v.count, cost: v.cost }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [])

  function handleExport() {
    const rows = filteredSCARs.map((s) => ({
      "SCAR ID": s.id,
      "NCR Ref": s.ncrRef,
      Title: s.title,
      Supplier: s.supplierName,
      "Supplier Code": s.supplierCode,
      "Part No": s.partNo,
      Description: s.partDescription,
      Warehouse: s.warehouse,
      Severity: SEVERITY_META[s.severity].label,
      Priority: PRIORITY_META[s.priority].label,
      Status: STATUS_META[s.status].label,
      "Defect Type": s.defectType,
      "Issue Date": s.issueDate,
      "Response Due": s.responseDueDate,
      "Response Received": s.responseReceivedDate || "",
      "Closed Date": s.closedDate || "",
      "Age (Days)": s.ageDays,
      "Days to Close": s.daysToClose || "",
      Owner: s.owner,
      "Cost Impact": s.costImpact,
      "Recovery Cost": s.recoveryCost,
      "8D Completion": `${s.eightDResponses.filter((e) => e.status === "verified" || e.status === "completed").length}/${s.eightDResponses.length}`,
      "Scorecard Points": s.scorecardImpact.pointsDeducted,
      "Rating Before": s.scorecardImpact.ratingBefore,
      "Rating After": s.scorecardImpact.ratingAfter,
    }))
    exportToCSV(rows, `supplier-corrective-actions-${new Date().toISOString().slice(0, 10)}`)
    toast.success("Export complete", `${filteredSCARs.length} SCAR records exported to CSV`)
  }

  function handleRefresh() {
    toast.success("Data refreshed", "SCAR list synchronized with supplier quality portal")
  }

  function handleNewSCAR() {
    toast.info("New SCAR", "SCAR creation wizard will open — select NCR and supplier")
  }

  function handleRowClick(scar: SupplierCorrectiveActionRequest) {
    setSelectedSCAR(scar)
    setDrawerOpen(true)
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <style jsx global>{`
        @keyframes scar-kpi-enter {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scar-chart-enter {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes scar-row-in {
          0% { opacity: 0; transform: translateX(-6px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes scar-row-pulse {
          0%, 100% { background-color: rgb(254 226 226 / 0.6); }
          50% { background-color: rgb(254 202 202 / 0.85); }
        }
        @keyframes scar-sheen {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scar-badge-pop {
          0% { transform: scale(0.6); }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes scar-stat-enter {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scar-d-step {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <PageHeader
        title="Supplier Corrective Action Requests"
        description="Formal 8D-methodology workflow linking NCRs to supplier corrective actions. Tracks supplier response, root cause analysis, effectiveness verification, and supplier scorecard impact."
      />

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleNewSCAR} className="press-scale scar-kpi-enter gap-2">
          <PenLine className="h-4 w-4" />
          New SCAR
        </Button>
        <Button variant="outline" onClick={handleRefresh} className="press-scale btn-outline-animate gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" onClick={handleExport} className="press-scale btn-outline-animate gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <div className="ml-auto text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredSCARs.length}</span> of {SCARS.length} SCARs
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="hover-lift-sm scar-kpi-enter relative overflow-hidden border-blue-200/50" style={{ animationDelay: "0ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-blue-100/60 blur-lg" />
          <CardContent className="inner-glow glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Total SCARs</p>
              <Hash className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{kpis.total}</p>
            <p className="text-xs text-blue-700 mt-1">{kpis.open} open · {kpis.closed30d} closed</p>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm scar-kpi-enter relative overflow-hidden border-emerald-200/50" style={{ animationDelay: "60ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-emerald-100/60 blur-lg" />
          <CardContent className="inner-glow glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Effectiveness</p>
              <ThumbsUp className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-700">{kpis.effectivenessRate}%</p>
            <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +5% MoM
            </p>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm scar-kpi-enter relative overflow-hidden border-rose-200/50" style={{ animationDelay: "120ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-rose-100/60 blur-lg" />
          <CardContent className="inner-glow glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Critical SCARs</p>
              <AlertOctagon className="h-4 w-4 text-rose-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-rose-700">{kpis.critical}</p>
            <p className="text-xs text-rose-700 mt-1">Customer-impacting</p>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm scar-kpi-enter relative overflow-hidden border-amber-200/50" style={{ animationDelay: "180ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-amber-100/60 blur-lg" />
          <CardContent className="inner-glow glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Overdue</p>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-amber-700">{kpis.overdueResponses}</p>
            <p className="text-xs text-amber-700 mt-1">Supplier response past due</p>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm scar-kpi-enter relative overflow-hidden border-violet-200/50" style={{ animationDelay: "240ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-violet-100/60 blur-lg" />
          <CardContent className="inner-glow glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Cost Impact</p>
              <IndianRupee className="h-4 w-4 text-violet-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{fmtINR(kpis.totalCostImpact)}</p>
            <p className="text-xs text-violet-700 mt-1">{fmtINR(kpis.totalRecoveryCost)} recovered</p>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm scar-kpi-enter relative overflow-hidden border-orange-200/50" style={{ animationDelay: "300ms" }}>
          <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-orange-100/60 blur-lg" />
          <CardContent className="inner-glow glass-subtle p-4 relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Avg Aging</p>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{kpis.avgAge}<span className="text-sm font-normal text-muted-foreground">d</span></p>
            <p className="text-xs text-orange-700 mt-1">Open + closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="hover-lift-sm scar-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">6-Month SCAR Trend</CardTitle>
            <CardDescription className="text-xs">Issued vs closed SCARs per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scarIssuedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="scarClosedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="issued" name="Issued" stroke="#8b5cf6" strokeWidth={2} fill="url(#scarIssuedGrad)" />
                <Area type="monotone" dataKey="closed" name="Closed" stroke="#10b981" strokeWidth={2} fill="url(#scarClosedGrad)" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm scar-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">SCARs by Severity</CardTitle>
            <CardDescription className="text-xs">Critical vs major vs minor distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={severityPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                  {severityPieData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm scar-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">SCARs by Status</CardTitle>
            <CardDescription className="text-xs">Distribution across 9 lifecycle stages</CardDescription>
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

        <Card className="hover-lift-sm scar-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Suppliers by SCAR Count</CardTitle>
            <CardDescription className="text-xs">Most SCARs raised against supplier in last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={supplierBarData} layout="vertical" margin={{ top: 10, right: 20, left: 100, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" className="text-xs" tick={{ fontSize: 10 }} width={100} />
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
                "scar-tab-btn inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "scar-badge-pop inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold",
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
            placeholder="Search by SCAR ID, title, supplier, part, NCR ref, defect type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="scar-search-focus pl-8"
          />
        </div>
        <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as SCARSeverity | "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            {Object.entries(SEVERITY_META).map(([k, m]) => (
              <SelectItem key={k} value={k}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as SCARPriority | "all")}>
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

      {/* SCAR Master Table */}
      <Card className="hover-lift-sm card-crud-lift scar-table-card">
        <CardContent className="inner-glow glass-subtle p-0">
          <Table className="table-hover-highlight">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[130px]">SCAR ID</TableHead>
                <TableHead className="min-w-[300px]">Title / Supplier</TableHead>
                <TableHead className="w-[110px]">Severity</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead className="w-[90px]">Priority</TableHead>
                <TableHead className="w-[110px] text-right">8D Progress</TableHead>
                <TableHead className="w-[100px] text-right">Age (days)</TableHead>
                <TableHead className="w-[110px] text-right">Cost Impact</TableHead>
                <TableHead className="w-[110px]">Scorecard</TableHead>
                <TableHead className="w-[100px]">Owner</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSCARs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground text-sm">
                    No SCARs match the current filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredSCARs.map((scar, idx) => {
                  const SM = STATUS_META[scar.status]
                  const SVM = SEVERITY_META[scar.severity]
                  const PM = PRIORITY_META[scar.priority]
                  const StatusIcon = SM.icon
                  const SevIcon = SVM.icon
                  const PriIcon = PM.icon
                  const completed8D = scar.eightDResponses.filter((e) => e.status === "verified" || e.status === "completed").length
                  const total8D = scar.eightDResponses.length
                  const pct8D = total8D > 0 ? Math.round((completed8D / total8D) * 100) : 0
                  const isCritical = scar.severity === "critical" && scar.status !== "closed-effective" && scar.status !== "rejected"
                  const isClosedEff = scar.status === "closed-effective"
                  const isClosedFail = scar.status === "closed-failed" || scar.status === "rejected"
                  return (
                    <TableRow
                      key={scar.id}
                      onClick={() => handleRowClick(scar)}
                      className={cn(
                        "scar-row-in cursor-pointer border-b transition-colors",
                        isCritical && "scar-row-critical",
                        isClosedFail && "bg-rose-50/30 opacity-75",
                        isClosedEff && "opacity-90",
                        !isCritical && !isClosedFail && !isClosedEff && "hover:bg-muted/40"
                      )}
                      style={{ animationDelay: `${Math.min(idx * 18, 360)}ms` }}
                    >
                      <TableCell className="font-mono text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={cn("text-[10px] font-bold", SVM.color, SVM.bg)}>
                              {scar.supplierName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{scar.id}</div>
                            <div className="text-[10px] text-muted-foreground">{scar.ncrRef}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm line-clamp-1">{scar.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {scar.supplierName} ({scar.supplierCode}) · {scar.partNo} · {scar.partDescription}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {scar.defectType} · {scar.warehouse}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("gap-1 text-xs", SVM.color, SVM.bg)}>
                          <SevIcon className="h-3 w-3" />
                          {SVM.label}
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
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="tabular-nums text-sm font-medium">{completed8D}/{total8D}</span>
                          <Progress value={pct8D} className="mt-1 h-1.5 w-[80px]" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        <span
                          className={cn(
                            scar.ageDays > 30 ? "text-rose-600 font-medium" : scar.ageDays > 14 ? "text-amber-700 font-medium" : ""
                          )}
                        >
                          {scar.ageDays}d
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-xs">
                        {scar.costImpact === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="font-medium">{fmtINR(scar.costImpact)}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className={cn("text-xs font-bold", scar.scorecardImpact.ratingBefore === scar.scorecardImpact.ratingAfter ? "text-emerald-700" : "text-rose-700")}>
                            {scar.scorecardImpact.ratingBefore}
                          </span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          <span className={cn("text-xs font-bold", scar.scorecardImpact.ratingAfter < scar.scorecardImpact.ratingBefore ? "text-rose-700" : "text-emerald-700")}>
                            {scar.scorecardImpact.ratingAfter}
                          </span>
                          <span className="text-[10px] text-rose-600">-{scar.scorecardImpact.pointsDeducted}pt</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div>{scar.owner}</div>
                        <div className="text-[10px] text-muted-foreground">{scar.issueDate}</div>
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
      <SCARDetailDrawer scar={selectedSCAR} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// DETAIL DRAWER
// ──────────────────────────────────────────────────────────

type DrawerTab = "overview" | "8d-response" | "containment" | "rca" | "corrective" | "scorecard"

function SCARDetailDrawer({
  scar,
  open,
  onOpenChange,
}: {
  scar: SupplierCorrectiveActionRequest | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const toast = useToast()
  const [tab, setTab] = useState<DrawerTab>("overview")

  React.useEffect(() => {
    if (open) setTab("overview")
  }, [open, scar?.id])

  if (!scar) return null

  const SM = STATUS_META[scar.status]
  const SVM = SEVERITY_META[scar.severity]
  const PM = PRIORITY_META[scar.priority]
  const StatusIcon = SM.icon
  const totalCost = scar.costImpact + scar.recoveryCost
  const completed8D = scar.eightDResponses.filter((e) => e.status === "verified" || e.status === "completed").length
  const total8D = scar.eightDResponses.length
  const pct8D = total8D > 0 ? Math.round((completed8D / total8D) * 100) : 0
  const containmentCompleted = scar.containmentActions.filter((c) => c.status === "completed").length
  const containmentTotal = scar.containmentActions.length
  const correctiveEffective = scar.correctiveActions.filter((c) => c.status === "effective").length
  const correctiveTotal = scar.correctiveActions.length
  const scorecardDelta = scar.scorecardImpact.ratingBeforeScore - scar.scorecardImpact.ratingAfterScore

  function handleExport() {
    if (!scar) return
    const rows = [
      {
        "SCAR ID": scar.id,
        "NCR Ref": scar.ncrRef,
        Supplier: scar.supplierName,
        Title: scar.title,
        Status: SM.label,
        "8D Progress": `${completed8D}/${total8D}`,
        "Cost Impact": scar.costImpact,
        "Scorecard Impact": scorecardDelta,
        "Rating Change": `${scar.scorecardImpact.ratingBefore} → ${scar.scorecardImpact.ratingAfter}`,
      },
    ]
    exportToCSV(rows, `${scar.id}-summary`)
    toast.success("Export complete", `${scar.id} summary exported`)
  }

  function handleAction(action: string) {
    if (!scar) return
    if (action === "issue") toast.success("SCAR Issued", `${scar.id} sent to ${scar.supplierName} via supplier portal`)
    else if (action === "acknowledge") toast.success("Acknowledged", `${scar.id} acknowledgment recorded from supplier`)
    else if (action === "verify") toast.success("Verified", `${scar.id} 8D response verified by Quality`)
    else if (action === "close-effective") toast.success("Closed (Effective)", `${scar.id} closed — corrective actions effective`)
    else if (action === "reject") toast.warning("Rejected", `${scar.id} 8D response rejected — reissue with mandatory on-site engagement`)
    else if (action === "escalate") toast.warning("Escalated", `${scar.id} escalated to senior supplier management`)
  }

  const tabs: Array<{ key: DrawerTab; label: string; count?: number }> = [
    { key: "overview", label: "Overview" },
    { key: "8d-response", label: "8D Response", count: total8D },
    { key: "containment", label: "Containment", count: containmentTotal },
    { key: "rca", label: "Root Cause" },
    { key: "corrective", label: "Corrective", count: correctiveTotal },
    { key: "scorecard", label: "Scorecard" },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="scar-drawer-content w-full sm:max-w-[920px] overflow-y-auto p-0">
        <style jsx>{`
          .scar-drawer-content::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
            z-index: 50;
          }
        `}</style>

        {/* Sheen sweep on open */}
        <div className="scar-drawer-sheen pointer-events-none absolute inset-x-0 top-0 h-12 overflow-hidden">
          <div className="scar-sheen absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        <SheetHeader className="scar-drawer-header border-b bg-gradient-to-r from-violet-50/60 via-pink-50/40 to-amber-50/30 px-6 pb-4 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("gap-1", SM.color, SM.bg, SM.border)}>
                  <StatusIcon className="h-3 w-3" />
                  {SM.label}
                </Badge>
                <Badge variant="outline" className={cn("gap-1", SVM.color, SVM.bg)}>
                  <SVM.icon className="h-3 w-3" />
                  {SVM.label}
                </Badge>
                <Badge variant="outline" className={cn("gap-1", PM.color, PM.bg)}>
                  {PM.label}
                </Badge>
              </div>
              <SheetTitle className="text-xl">{scar.title}</SheetTitle>
              <SheetDescription className="font-mono text-xs">
                {scar.id} · {scar.ncrRef} · {scar.supplierName} ({scar.supplierCode})
              </SheetDescription>
              <div className="text-xs text-muted-foreground">
                {scar.partNo} · {scar.partDescription} · {scar.warehouse}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>

          {/* Hero stat grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="scar-stat-enter rounded-lg border border-violet-200/50 bg-white/60 p-3" style={{ animationDelay: "0ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                8D Progress
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">{pct8D}%</p>
              <p className="text-[10px] text-muted-foreground">{completed8D}/{total8D} disciplines complete</p>
            </div>
            <div className="scar-stat-enter rounded-lg border border-amber-200/50 bg-white/60 p-3" style={{ animationDelay: "80ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Aging
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">{scar.ageDays}<span className="text-sm font-normal">d</span></p>
              <p className="text-[10px] text-muted-foreground">{scar.daysToClose ? `Closed in ${scar.daysToClose}d` : "Open"}</p>
            </div>
            <div className="scar-stat-enter rounded-lg border border-rose-200/50 bg-white/60 p-3" style={{ animationDelay: "160ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IndianRupee className="h-3 w-3" />
                Cost Impact
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">{fmtINR(scar.costImpact)}</p>
              <p className="text-[10px] text-rose-600">{fmtINR(scar.recoveryCost)} recovered</p>
            </div>
            <div className="scar-stat-enter rounded-lg border border-emerald-200/50 bg-white/60 p-3" style={{ animationDelay: "240ms" }}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Star className="h-3 w-3" />
                Scorecard
              </div>
              <p className="mt-1 text-lg font-bold tabular-nums">
                {scar.scorecardImpact.ratingBefore} → <span className={scorecardDelta > 0 ? "text-rose-700" : "text-emerald-700"}>{scar.scorecardImpact.ratingAfter}</span>
              </p>
              <p className="text-[10px] text-rose-600">-{scar.scorecardImpact.pointsDeducted} points</p>
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
                    "scar-tab-btn relative -mb-px px-3 py-2.5 text-xs font-medium transition-all",
                    isActive ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                  {t.count !== undefined && t.count > 0 && (
                    <span className="scar-badge-pop ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-muted-foreground/15 px-1 text-[10px] font-bold">
                      {t.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="scar-body-enter space-y-4 p-6">
          {tab === "overview" && (
            <>
              {/* Defect Details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Defect Details</CardTitle>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle space-y-3">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-md border p-3">
                      <p className="text-xs text-muted-foreground">Defect Type</p>
                      <p className="mt-1 text-sm font-medium">{scar.defectType}</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="text-xs text-muted-foreground">Affected Part</p>
                      <p className="mt-1 text-sm font-medium">{scar.partNo}</p>
                      <p className="text-[10px] text-muted-foreground">{scar.partDescription}</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="text-xs text-muted-foreground">Warehouse</p>
                      <p className="mt-1 text-sm font-medium">{scar.warehouse}</p>
                    </div>
                  </div>
                  <div className="rounded-md border border-amber-200/50 bg-amber-50/20 p-3">
                    <p className="text-xs font-semibold text-amber-800">Defect Description</p>
                    <p className="mt-1 text-xs text-amber-900/80">{scar.defectDescription}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Supplier Contact */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Supplier Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-md border p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-violet-100 text-xs font-bold text-violet-700">
                            {scar.supplierName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{scar.supplierName}</p>
                          <p className="text-xs text-muted-foreground">{scar.supplierCode} · {scar.supplierContact}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md border p-3 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono">{scar.supplierEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono">{scar.supplierPhone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">SCAR Lifecycle Timeline</CardTitle>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" /> Issue Date
                    </div>
                    <p className="mt-1 text-sm font-medium">{scar.issueDate}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClock className="h-3 w-3" /> Response Due
                    </div>
                    <p className="mt-1 text-sm font-medium">{scar.responseDueDate}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Inbox className="h-3 w-3" /> Response Received
                    </div>
                    <p className="mt-1 text-sm font-medium">{scar.responseReceivedDate || "—"}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarCheck className="h-3 w-3" /> Closed Date
                    </div>
                    <p className="mt-1 text-sm font-medium">{scar.closedDate || "—"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Internal Owner */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Internal Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-100 text-xs font-bold text-blue-700">
                        {scar.owner.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{scar.owner}</p>
                      <p className="text-xs text-muted-foreground font-mono">{scar.ownerEmail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="hover-lift-sm border-amber-200/50 bg-amber-50/20">
                <CardContent className="inner-glow glass-subtle p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800">SCAR Notes</p>
                      <p className="mt-1 text-xs text-amber-900/80">{scar.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {tab === "8d-response" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">8D Methodology — {completed8D}/{total8D} Disciplines Complete ({pct8D}%)</CardTitle>
                <CardDescription className="text-xs">Supplier's structured problem-solving response following the 8D methodology</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={pct8D} className="mb-4 h-2" />
                <div className="space-y-3">
                  {scar.eightDResponses.map((d, idx) => {
                    const meta = EIGHT_D_META[d.step]
                    const statusMeta = EIGHT_D_STATUS[d.status]
                    const DIcon = meta.icon
                    const SIcon = statusMeta.icon
                    const isLast = idx === scar.eightDResponses.length - 1
                    return (
                      <div
                        key={d.step}
                        className="scar-d-step relative flex items-start gap-3 rounded-md border p-3"
                        style={{ animationDelay: `${idx * 60}ms`, animation: "scar-d-step 320ms cubic-bezier(0.22, 1, 0.36, 1) both" }}
                      >
                        {!isLast && (
                          <div className="absolute left-[26px] top-14 bottom-[-12px] w-px bg-muted-foreground/20" />
                        )}
                        <div className={cn("relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold text-[10px]", meta.bg, meta.color)}>
                          {meta.num}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <DIcon className={cn("h-4 w-4", meta.color)} />
                              <p className="text-sm font-medium">{d.title}</p>
                            </div>
                            <Badge variant="outline" className={cn("gap-1 text-xs", statusMeta.color, statusMeta.bg)}>
                              <SIcon className="h-3 w-3" />
                              {statusMeta.label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{d.description}</p>
                          <div className="mt-2 rounded-md bg-muted/40 p-2">
                            <p className="text-[10px] font-semibold text-muted-foreground">Supplier Response:</p>
                            <p className="mt-0.5 text-xs">{d.supplierResponse}</p>
                            {d.responseDate && (
                              <p className="mt-1 text-[10px] text-muted-foreground">
                                Responded: {d.responseDate} · Owner: {d.owner}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {tab === "containment" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Containment Actions — {containmentCompleted}/{containmentTotal} Completed</CardTitle>
                <CardDescription className="text-xs">Interim actions to contain the problem while permanent corrective actions are being developed</CardDescription>
              </CardHeader>
              <CardContent>
                {scar.containmentActions.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No containment actions yet (SCAR still in draft)
                  </div>
                ) : (
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead className="w-[110px]">Type</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead className="w-[110px]">Due</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                        <TableHead className="w-[110px]">Effectiveness</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scar.containmentActions.map((c, idx) => {
                        const cStatus = CONTAINMENT_STATUS[c.status]
                        const cType = CONTAINMENT_TYPE[c.type]
                        const SIcon = cStatus.icon
                        const TIcon = cType.icon
                        return (
                          <TableRow
                            key={c.id}
                            className={cn(
                              "scar-row-in hover:bg-muted/40",
                              c.status === "overdue" && "bg-rose-50/40",
                              c.status === "completed" && "bg-emerald-50/20"
                            )}
                            style={{ animationDelay: `${idx * 40}ms` }}
                          >
                            <TableCell className="font-mono text-xs">{c.id}</TableCell>
                            <TableCell className="text-sm">{c.action}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("gap-1 text-xs", cType.color, cType.bg)}>
                                <TIcon className="h-3 w-3" />
                                {cType.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">{c.owner}</TableCell>
                            <TableCell className="font-mono text-xs">{c.dueDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("gap-1 text-xs", cStatus.color, cStatus.bg)}>
                                <SIcon className="h-3 w-3" />
                                {cStatus.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                              {c.effectiveness === null ? (
                                <span className="text-muted-foreground">—</span>
                              ) : c.effectiveness === "effective" ? (
                                <span className="text-emerald-700 font-medium">Effective</span>
                              ) : c.effectiveness === "ineffective" ? (
                                <span className="text-rose-700 font-medium">Ineffective</span>
                              ) : (
                                <span className="text-amber-700">Pending</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {tab === "rca" && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Root Cause Contributions (Ishikawa 6M+1)</CardTitle>
                  <CardDescription className="text-xs">Supplier's fishbone analysis — percentage contribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={scar.rcaContributions.map((r) => ({ name: RCA_META[r.category].label, value: r.contribution, color: RCA_META[r.category].pieColor }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                      <YAxis className="text-xs" tick={{ fontSize: 11 }} unit="%" />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {scar.rcaContributions.map((r, i) => (
                          <Cell key={i} fill={RCA_META[r.category].pieColor} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-2">
                    {scar.rcaContributions.map((r) => {
                      const meta = RCA_META[r.category]
                      const Icon = meta.icon
                      return (
                        <div key={r.category} className={cn("scar-card-enter rounded-md border p-3", meta.bg)}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className={cn("h-4 w-4", meta.color)} />
                              <div>
                                <p className={cn("text-sm font-medium", meta.color)}>{meta.label}</p>
                                <p className="text-xs text-muted-foreground">{r.description}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={cn("text-xs", meta.color, meta.bg)}>
                              {r.contribution}%
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {tab === "corrective" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Permanent Corrective Actions — {correctiveEffective}/{correctiveTotal} Effective</CardTitle>
                <CardDescription className="text-xs">Long-term corrective and preventive actions with effectiveness verification</CardDescription>
              </CardHeader>
              <CardContent>
                {scar.correctiveActions.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No corrective actions yet (SCAR not yet at implementation stage)
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scar.correctiveActions.map((c, idx) => {
                      const meta = CORRECTIVE_STATUS[c.status]
                      const Icon = meta.icon
                      return (
                        <div
                          key={c.id}
                          className={cn(
                            "scar-card-enter rounded-md border p-3",
                            c.status === "effective" && "border-emerald-200/50 bg-emerald-50/20",
                            c.status === "failed" && "border-rose-200/50 bg-rose-50/20",
                            c.status === "verified" && "border-violet-200/50 bg-violet-50/20"
                          )}
                          style={{ animationDelay: `${idx * 60}ms` }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={cn("text-[10px]", c.type === "corrective" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700")}>
                                  {c.type === "corrective" ? "CORRECTIVE" : "PREVENTIVE"}
                                </Badge>
                                <span className="font-mono text-xs">{c.id}</span>
                              </div>
                              <p className="mt-1 text-sm font-medium">{c.action}</p>
                              <p className="text-xs text-muted-foreground">Owner: {c.owner} · Due: {c.dueDate}</p>
                              <div className="mt-2 rounded-md bg-muted/30 p-2">
                                <p className="text-[10px] font-semibold text-muted-foreground">Verification Method</p>
                                <p className="mt-0.5 text-xs">{c.verificationMethod}</p>
                                {c.verificationDate && (
                                  <p className="mt-1 text-[10px] text-muted-foreground">
                                    Verified: {c.verificationDate}
                                    {c.effectivenessScore > 0 && ` · Effectiveness Score: ${c.effectivenessScore}%`}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className={cn("gap-1 text-xs", meta.color, meta.bg)}>
                              <Icon className="h-3 w-3" />
                              {meta.label}
                            </Badge>
                          </div>
                          {c.effectivenessScore > 0 && (
                            <div className="mt-2">
                              <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                                <span>Effectiveness Score</span>
                                <span className={cn("font-bold", c.effectivenessScore >= 85 ? "text-emerald-700" : c.effectivenessScore >= 70 ? "text-amber-700" : "text-rose-700")}>
                                  {c.effectivenessScore}%
                                </span>
                              </div>
                              <Progress value={c.effectivenessScore} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {tab === "scorecard" && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Supplier Scorecard Impact</CardTitle>
                  <CardDescription className="text-xs">Automatic rating adjustment based on SCAR outcome</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Rating Before → After visual */}
                    <div className="rounded-md border p-4 bg-gradient-to-br from-blue-50/30 to-violet-50/30">
                      <p className="text-xs font-medium text-muted-foreground">Rating Transition</p>
                      <div className="mt-3 flex items-center justify-center gap-4">
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">Before</p>
                          <div className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 text-3xl font-bold",
                            scar.scorecardImpact.ratingBeforeScore >= 90 ? "border-emerald-400 text-emerald-700 bg-emerald-50" :
                            scar.scorecardImpact.ratingBeforeScore >= 80 ? "border-blue-400 text-blue-700 bg-blue-50" :
                            scar.scorecardImpact.ratingBeforeScore >= 70 ? "border-amber-400 text-amber-700 bg-amber-50" :
                            "border-rose-400 text-rose-700 bg-rose-50"
                          )}>
                            {scar.scorecardImpact.ratingBefore}
                          </div>
                          <p className="mt-1 text-xs tabular-nums font-medium">{scar.scorecardImpact.ratingBeforeScore}/100</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <ArrowRightCircle className="h-5 w-5 text-muted-foreground" />
                          <span className="text-[10px] text-rose-600 font-bold">-{scar.scorecardImpact.pointsDeducted}pt</span>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">After</p>
                          <div className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 text-3xl font-bold",
                            scar.scorecardImpact.ratingAfterScore >= 90 ? "border-emerald-400 text-emerald-700 bg-emerald-50" :
                            scar.scorecardImpact.ratingAfterScore >= 80 ? "border-blue-400 text-blue-700 bg-blue-50" :
                            scar.scorecardImpact.ratingAfterScore >= 70 ? "border-amber-400 text-amber-700 bg-amber-50" :
                            "border-rose-400 text-rose-700 bg-rose-50"
                          )}>
                            {scar.scorecardImpact.ratingAfter}
                          </div>
                          <p className="mt-1 text-xs tabular-nums font-medium">{scar.scorecardImpact.ratingAfterScore}/100</p>
                        </div>
                      </div>
                    </div>

                    {/* Recovery Progress */}
                    <div className="rounded-md border p-4">
                      <p className="text-xs font-medium text-muted-foreground">Recovery Progress</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Timeline</span>
                          <span className="text-xs font-medium tabular-nums">{scar.scorecardImpact.recoveryTimelineDays} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Review Cycle</span>
                          <span className="text-xs font-medium">{scar.scorecardImpact.reviewCycle}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Next Audit</span>
                          <span className="text-xs font-medium">{scar.scorecardImpact.nextAuditDate}</span>
                        </div>
                        <div className="mt-2">
                          <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Recovery</span>
                            <span className={cn("font-bold", scar.scorecardImpact.recoveryProgress === 100 ? "text-emerald-700" : scar.scorecardImpact.recoveryProgress > 0 ? "text-amber-700" : "text-rose-700")}>
                              {scar.scorecardImpact.recoveryProgress}%
                            </span>
                          </div>
                          <Progress value={scar.scorecardImpact.recoveryProgress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-md border border-amber-200/50 bg-amber-50/20 p-3">
                    <p className="text-xs font-semibold text-amber-800">Recovery Plan</p>
                    <p className="mt-1 text-xs text-amber-900/80">{scar.scorecardImpact.recoveryPlan}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Impact Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Cost Impact Summary</CardTitle>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle grid grid-cols-3 gap-3">
                  <div className="rounded-md border border-rose-200/50 bg-rose-50/30 p-3 text-center">
                    <CircleDollarSign className="mx-auto h-5 w-5 text-rose-600" />
                    <p className="mt-1 text-[10px] text-muted-foreground">Cost Impact</p>
                    <p className="mt-1 text-sm font-bold tabular-nums text-rose-700">{fmtINR(scar.costImpact)}</p>
                  </div>
                  <div className="rounded-md border border-emerald-200/50 bg-emerald-50/30 p-3 text-center">
                    <IndianRupee className="mx-auto h-5 w-5 text-emerald-600" />
                    <p className="mt-1 text-[10px] text-muted-foreground">Recovered</p>
                    <p className="mt-1 text-sm font-bold tabular-nums text-emerald-700">{fmtINR(scar.recoveryCost)}</p>
                  </div>
                  <div className="rounded-md border border-violet-200/50 bg-violet-50/30 p-3 text-center">
                    <CircleDollarSign className="mx-auto h-5 w-5 text-violet-600" />
                    <p className="mt-1 text-[10px] text-muted-foreground">Net Impact</p>
                    <p className="mt-1 text-sm font-bold tabular-nums text-violet-700">{fmtINR(scar.costImpact - scar.recoveryCost)}</p>
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
              Issued: <span className="font-mono">{scar.issueDate}</span>
              {scar.closedDate && <> · Closed: <span className="font-mono">{scar.closedDate}</span></>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="press-scale btn-outline-animate gap-1">
                <Download className="h-3 w-3" />
                Export
              </Button>
              {scar.status === "draft" && (
                <Button size="sm" onClick={() => handleAction("issue")} className="press-scale gap-1">
                  <Send className="h-3 w-3" />
                  Issue SCAR
                </Button>
              )}
              {scar.status === "issued" && (
                <Button size="sm" onClick={() => handleAction("acknowledge")} className="press-scale gap-1">
                  <Inbox className="h-3 w-3" />
                  Acknowledge
                </Button>
              )}
              {scar.status === "response-received" && (
                <Button size="sm" onClick={() => handleAction("verify")} className="press-scale gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verify Response
                </Button>
              )}
              {scar.status === "under-review" && (
                <>
                  <Button size="sm" onClick={() => handleAction("close-effective")} className="press-scale gap-1 bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Close (Effective)
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAction("reject")} className="press-scale btn-outline-animate gap-1 border-rose-300 text-rose-700">
                    <XCircle className="h-3 w-3" />
                    Reject
                  </Button>
                </>
              )}
              {(scar.status === "in-progress" || scar.status === "acknowledged") && (
                <Button variant="outline" size="sm" onClick={() => handleAction("escalate")} className="press-scale btn-outline-animate gap-1 border-amber-300 text-amber-700">
                  <AlertTriangle className="h-3 w-3" />
                  Escalate
                </Button>
              )}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
