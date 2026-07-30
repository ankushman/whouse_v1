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
  Microscope,
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
  Gauge,
  FlaskConical,
  ClipboardList,
  FileCheck,
  FileClock,
  FilePlus,
  History,
  Repeat,
  AlertOctagon,
  ThumbsUp,
  PenLine,
  Wrench,
  Target,
  ListChecks,
  Crosshair,
  ScanLine,
  Stethoscope,
  Bug,
  Building2,
  User,
  Timer,
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
} from "recharts"

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

type QIPStatus = "draft" | "active" | "suspended" | "in-revision" | "obsolete"
type InspectionType = "incoming" | "in-process" | "final" | "audit" | "first-article"
type Severity = "critical" | "major" | "minor"
type CharType = "variable" | "attribute" | "visual" | "dimensional" | "functional"
type InspectionResult = "passed" | "failed" | "conditional" | "pending"
type Disposition = "accept" | "reject" | "rework" | "return-to-vendor" | "use-as-is" | "scrap"

interface QIPCharacteristic {
  seq: number
  name: string
  charType: CharType
  spec: string
  tolerance: string
  gauge: string
  aql: string
  severity: Severity
  method: string
}

interface InspectionRecord {
  id: string
  date: string
  batch: string
  inspector: string
  sampleSize: number
  passed: number
  failed: number
  result: InspectionResult
  disposition: Disposition
  cycleTimeHrs: number
  notes: string
}

interface DefectRecord {
  id: string
  date: string
  charName: string
  defectType: string
  count: number
  severity: Severity
  disposition: Disposition
  capaRef: string
}

interface SamplingPlan {
  severity: Severity
  aql: number
  lotSize: string
  sampleSizeCode: string
  sampleSize: number
  accept: number
  reject: number
}

interface QualityInspectionPlan {
  id: string
  partNo: string
  partDescription: string
  partCategory: string
  inspectionType: InspectionType
  severity: Severity
  status: QIPStatus
  revision: string
  characteristics: QIPCharacteristic[]
  sampleSize: number
  passRate: number
  lastInspection: string
  totalInspections: number
  avgCycleTime: number
  pendingInspections: number
  criticalChars: number
  owner: string
  approver: string
  effectiveDate: string
  nextReview: string
  supplierName: string
  warehouse: string
  createdAt: string
  lastModified: string
  notes: string
}

// ──────────────────────────────────────────────────────────
// META
// ──────────────────────────────────────────────────────────

const STATUS_META: Record<QIPStatus, { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  draft:      { label: "Draft",       color: "text-slate-600",   bg: "bg-slate-100",   border: "border-slate-200",   icon: FilePlus },
  active:     { label: "Active",      color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", icon: CheckCircle2 },
  suspended:  { label: "Suspended",   color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200",   icon: AlertTriangle },
  "in-revision": { label: "In Revision", color: "text-blue-700", bg: "bg-blue-50",    border: "border-blue-200",    icon: PenLine },
  obsolete:   { label: "Obsolete",    color: "text-red-700",     bg: "bg-red-50",      border: "border-red-200",     icon: XCircle },
}

const INSPECTION_TYPE_META: Record<InspectionType, { label: string; color: string; bg: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  incoming:      { label: "Incoming",      color: "text-blue-700",    bg: "bg-blue-50",    pieColor: "#3b82f6", icon: FlaskConical },
  "in-process":  { label: "In-Process",    color: "text-violet-700",  bg: "bg-violet-50",  pieColor: "#8b5cf6", icon: ScanLine },
  final:         { label: "Final",         color: "text-emerald-700", bg: "bg-emerald-50", pieColor: "#10b981", icon: Stethoscope },
  audit:         { label: "Audit",         color: "text-amber-700",   bg: "bg-amber-50",   pieColor: "#f59e0b", icon: ClipboardList },
  "first-article": { label: "First Article", color: "text-rose-700",  bg: "bg-rose-50",    pieColor: "#f43f5e", icon: FileCheck },
}

const SEVERITY_META: Record<Severity, { label: string; color: string; bg: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  critical: { label: "Critical", color: "text-red-700",     bg: "bg-red-50",     pieColor: "#ef4444", icon: AlertOctagon },
  major:    { label: "Major",    color: "text-amber-700",   bg: "bg-amber-50",   pieColor: "#f59e0b", icon: AlertTriangle },
  minor:    { label: "Minor",    color: "text-blue-700",    bg: "bg-blue-50",    pieColor: "#3b82f6", icon: Crosshair },
}

const CHAR_TYPE_META: Record<CharType, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  variable:    { label: "Variable",    color: "text-blue-700",    icon: Gauge },
  attribute:   { label: "Attribute",   color: "text-violet-700",  icon: ListChecks },
  visual:      { label: "Visual",      color: "text-emerald-700", icon: Eye },
  dimensional: { label: "Dimensional", color: "text-amber-700",   icon: Crosshair },
  functional:  { label: "Functional",  color: "text-rose-700",    icon: Target },
}

const RESULT_META: Record<InspectionResult, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  passed:     { label: "Passed",     color: "text-emerald-700", bg: "bg-emerald-50", icon: ThumbsUp },
  failed:     { label: "Failed",     color: "text-red-700",     bg: "bg-red-50",     icon: XCircle },
  conditional:{ label: "Conditional",color: "text-amber-700",   bg: "bg-amber-50",   icon: AlertTriangle },
  pending:    { label: "Pending",    color: "text-slate-700",   bg: "bg-slate-100",  icon: Clock },
}

const DISPOSITION_META: Record<Disposition, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  accept:            { label: "Accept",            color: "text-emerald-700", icon: ThumbsUp },
  reject:            { label: "Reject",            color: "text-red-700",     icon: XCircle },
  rework:            { label: "Rework",            color: "text-amber-700",   icon: Wrench },
  "return-to-vendor":{ label: "Return to Vendor",  color: "text-rose-700",    icon: Repeat },
  "use-as-is":       { label: "Use As Is",         color: "text-blue-700",    icon: CheckCircle2 },
  scrap:             { label: "Scrap",             color: "text-slate-700",   icon: Bug },
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

function genCharacteristics(seed: string, count: number): QIPCharacteristic[] {
  const charNames = [
    "Outer Diameter Tolerance",
    "Inner Bore Diameter",
    "Length Overall",
    "Surface Roughness Ra",
    "Hardness Rockwell",
    "Concentricity",
    "Wall Thickness",
    "Thread Pitch",
    "Coating Thickness",
    "Tensile Strength",
    "Color Match",
    "Visual Surface Defects",
    "Parallelism",
    "Perpendicularity",
    "Flatness",
    "Roundness",
    "Hardness Vickers",
    "Elongation %",
    "Yield Strength",
    "Impact Resistance",
  ]
  const charTypes: CharType[] = ["variable", "attribute", "visual", "dimensional", "functional"]
  const specs = [
    "25.00 mm", "12.50 mm", "0.8 μm Ra", "60 HRC", "150 MPa", "1500 mm", "M8 × 1.25",
    "20 μm", "Ø 50 ± 0.02", "0.05 mm", "ISO 8501-3", "≤ 0.1 mm", "85 HRB",
    "0.4 μm Ra", "Ø 100 H7", "45° ± 0.5°", "200 HV", "≥ 12%", "≥ 350 MPa",
  ]
  const tolerances = ["±0.02 mm", "±0.05 mm", "±0.1 mm", "±0.005 mm", "±0.5°", "≤ 0.8 μm", "±5 HRC", "±0.01 mm", "≥ 95%", "≤ 0.05 mm", "±2 HV", "min 12%"]
  const gauges = [
    "Digital Micrometer 0-25mm", "Vernier Caliper 0-150mm", "CMM Zeiss Contura",
    "Surface Roughness Tester Mitutoyo SJ-410", "Rockwell Hardness Tester",
    "Bore Gauge 18-35mm", "Optical Comparator", "Thread Plug Gauge M8",
    "Coating Thickness Gauge Elcometer 456", "UTM Instron 5967",
    "Visual AQL Sample Board", "Height Gauge Mitutoyo 192-303",
    "Roundness Tester Taylor Hobson", "Vickers Hardness Tester",
  ]
  const methods = [
    "ISO 2859-1 Sampling", "ANSI/ASQ Z1.4 Sampling", "100% Inspection", "Variable Sampling",
    "Attribute Sampling", "First Article Inspection per AS9102", "SPC Control Chart",
    "Destructive Testing Sample", "Non-Destructive Testing",
  ]
  const aqls = ["0.65", "1.0", "1.5", "2.5", "4.0", "Critical (0)"]
  const severities: Severity[] = ["critical", "major", "minor"]

  return Array.from({ length: count }, (_, i) => {
    const seedNum = hash(`${seed}-c${i}`)
    const charType = pick(charTypes, seedNum)
    return {
      seq: i + 1,
      name: pick(charNames, seedNum + i),
      charType,
      spec: pick(specs, seedNum * 3 + i),
      tolerance: pick(tolerances, seedNum * 5 + i),
      gauge: pick(gauges, seedNum * 7 + i),
      aql: pick(aqls, seedNum),
      severity: i === 0 ? "critical" : pick(severities, seedNum + i),
      method: pick(methods, seedNum + i * 2),
    }
  })
}

function genInspectionRecords(seed: string, count: number, passRate: number): InspectionRecord[] {
  const inspectors = ["R. Krishnan", "A. Mehta", "P. Singh", "S. Iyer", "V. Gupta", "M. Reddy", "K. Nair", "T. Bose"]
  const results: InspectionResult[] = ["passed", "failed", "conditional", "pending"]
  const dispositions: Disposition[] = ["accept", "reject", "rework", "return-to-vendor", "use-as-is", "scrap"]
  const notesPool = [
    "All dimensions within tolerance.",
    "Minor surface blemish on 2 units — accepted as-is.",
    "Hardness out of spec on 1 sample — rework scheduled.",
    "Coating thickness below target — pending disposition.",
    "First article inspection — all critical characteristics passed.",
    "Thread gauge rejected 3 samples — returned to vendor.",
    "Visual defect on edge — accepted with deviation note.",
    "Tensile test passed at 95% confidence.",
  ]
  const today = new Date("2026-07-26")
  return Array.from({ length: count }, (_, i) => {
    const seedNum = hash(`${seed}-ir${i}`)
    const passed = Math.max(0, 30 - ((seedNum + i) % 8))
    const failed = (seedNum + i) % 5
    const sampleSize = passed + failed + ((seedNum + i) % 3)
    // Bias result based on plan's overall passRate
    const isPass = ((seedNum % 100) < passRate)
    const result: InspectionResult = isPass ? "passed" : (failed > 5 ? "failed" : "conditional")
    const disposition: Disposition = isPass ? "accept" : (failed > 5 ? "reject" : "rework")
    const daysAgo = i * 3 + (seedNum % 7)
    const d = new Date(today)
    d.setDate(d.getDate() - daysAgo)
    return {
      id: `IR-${seedNum.toString(36).slice(-5).toUpperCase()}`,
      date: d.toISOString().slice(0, 10),
      batch: `B-${(seedNum % 9000 + 1000).toString()}`,
      inspector: pick(inspectors, seedNum + i),
      sampleSize,
      passed,
      failed,
      result,
      disposition,
      cycleTimeHrs: 1.5 + ((seedNum % 30) / 10),
      notes: pick(notesPool, seedNum + i),
    }
  })
}

function genDefectRecords(seed: string, count: number): DefectRecord[] {
  const defectTypes = [
    "Surface Scratch", "Dimensional Out-of-Tol", "Burr on Edge", "Color Mismatch",
    "Plating Defect", "Coating Pinhole", "Thread Damage", "Hardness Below Spec",
    "Concentricity Deviation", "Flatness Out-of-Tol", "Roundness Error",
    "Missing Chamfer", "Tool Mark", "Surface Pitting", "Bore Undersize",
    "Length Variation", "Parallelism Fail",
  ]
  const chars = ["Outer Diameter", "Surface Finish", "Hardness", "Coating Thickness", "Thread Pitch", "Bore Diameter"]
  const dispositions: Disposition[] = ["rework", "return-to-vendor", "scrap", "use-as-is", "reject"]
  const today = new Date("2026-07-26")
  return Array.from({ length: count }, (_, i) => {
    const seedNum = hash(`${seed}-dr${i}`)
    const sev: Severity = (i % 5 === 0) ? "critical" : (i % 3 === 0 ? "major" : "minor")
    const daysAgo = i * 5 + (seedNum % 14)
    const d = new Date(today)
    d.setDate(d.getDate() - daysAgo)
    return {
      id: `DR-${seedNum.toString(36).slice(-5).toUpperCase()}`,
      date: d.toISOString().slice(0, 10),
      charName: pick(chars, seedNum + i),
      defectType: pick(defectTypes, seedNum + i),
      count: (seedNum % 15) + 1,
      severity: sev,
      disposition: pick(dispositions, seedNum + i),
      capaRef: sev === "critical" || sev === "major" ? `CAPA-${(seedNum % 9000 + 1000).toString()}` : "—",
    }
  })
}

// ──────────────────────────────────────────────────────────
// STATIC QIP RECORDS
// ──────────────────────────────────────────────────────────

interface QIPSeed {
  partNo: string
  partDescription: string
  partCategory: string
  inspectionType: InspectionType
  severity: Severity
  status: QIPStatus
  revision: string
  charCount: number
  sampleSize: number
  passRate: number
  totalInspections: number
  avgCycleTime: number
  pendingInspections: number
  owner: string
  approver: string
  effectiveDate: string
  nextReview: string
  supplierName: string
  warehouse: string
  notes: string
}

const QIP_SEEDS: QIPSeed[] = [
  { partNo: "BRK-PAD-1001", partDescription: "Brake Pad Assembly — Passenger Car", partCategory: "Sub-Assembly", inspectionType: "incoming", severity: "critical", status: "active", revision: "E", charCount: 12, sampleSize: 32, passRate: 96, totalInspections: 184, avgCycleTime: 2.4, pendingInspections: 3, owner: "R. Krishnan", approver: "S. Iyer", effectiveDate: "2026-04-15", nextReview: "2026-10-15", supplierName: "BrakeTech Industries", warehouse: "Chennai Hub", notes: "Critical safety component — strict AQL 0.65 on hardness." },
  { partNo: "FRM-WHL-2001", partDescription: "Front Wheel Rim — 17 inch Alloy", partCategory: "Finished Good", inspectionType: "incoming", severity: "critical", status: "active", revision: "C", charCount: 14, sampleSize: 50, passRate: 94, totalInspections: 142, avgCycleTime: 3.1, pendingInspections: 2, owner: "A. Mehta", approver: "S. Iyer", effectiveDate: "2026-05-02", nextReview: "2026-11-02", supplierName: "AlloyWorks Ltd", warehouse: "Pune DC", notes: "Dimensional inspection with CMM — concentration on concentricity." },
  { partNo: "ENG-BLK-3001", partDescription: "Engine Cylinder Block — Cast Iron", partCategory: "Finished Good", inspectionType: "first-article", severity: "critical", status: "active", revision: "B", charCount: 18, sampleSize: 5, passRate: 88, totalInspections: 12, avgCycleTime: 8.5, pendingInspections: 1, owner: "P. Singh", approver: "V. Gupta", effectiveDate: "2026-06-10", nextReview: "2026-09-10", supplierName: "Castings India Pvt Ltd", warehouse: "Chennai Hub", notes: "First article inspection per AS9102 — full dimensional layout." },
  { partNo: "BRT-CAL-4001", partDescription: "Brake Caliper Assembly", partCategory: "Sub-Assembly", inspectionType: "incoming", severity: "critical", status: "active", revision: "D", charCount: 11, sampleSize: 25, passRate: 92, totalInspections: 156, avgCycleTime: 2.8, pendingInspections: 4, owner: "R. Krishnan", approver: "S. Iyer", effectiveDate: "2026-03-22", nextReview: "2026-09-22", supplierName: "BrakeTech Industries", warehouse: "Chennai Hub", notes: "Pressure test mandatory — leakage >0 acceptable." },
  { partNo: "SHK-ABS-5001", partDescription: "Shock Absorber — Rear", partCategory: "Finished Good", inspectionType: "incoming", severity: "major", status: "active", revision: "F", charCount: 9, sampleSize: 20, passRate: 97, totalInspections: 168, avgCycleTime: 1.8, pendingInspections: 0, owner: "M. Reddy", approver: "K. Nair", effectiveDate: "2026-04-30", nextReview: "2026-10-30", supplierName: "Suspension Systems Co", warehouse: "Delhi NCR Hub", notes: "Damping force test on every batch." },
  { partNo: "BAT-LI-6001", partDescription: "Li-Ion Battery Pack 48V", partCategory: "Finished Good", inspectionType: "incoming", severity: "critical", status: "active", revision: "A", charCount: 16, sampleSize: 13, passRate: 91, totalInspections: 89, avgCycleTime: 4.2, pendingInspections: 2, owner: "T. Bose", approver: "V. Gupta", effectiveDate: "2026-06-01", nextReview: "2026-09-01", supplierName: "PowerCell Energy", warehouse: "Bengaluru Hub", notes: "UN38.3 certified — thermal runaway test mandatory." },
  { partNo: "TIR-ALL-7001", partDescription: "All-Season Tire 215/55R17", partCategory: "Finished Good", inspectionType: "incoming", severity: "major", status: "active", revision: "H", charCount: 8, sampleSize: 32, passRate: 98, totalInspections: 224, avgCycleTime: 1.5, pendingInspections: 1, owner: "K. Nair", approver: "S. Iyer", effectiveDate: "2026-02-15", nextReview: "2026-08-15", supplierName: "MRF Tyres Ltd", warehouse: "Mumbai West DC", notes: "Visual inspection + balance test — no bead defects." },
  { partNo: "WIR-HRN-8001", partDescription: "Wiring Harness — Main", partCategory: "Sub-Assembly", inspectionType: "in-process", severity: "major", status: "active", revision: "C", charCount: 10, sampleSize: 25, passRate: 95, totalInspections: 132, avgCycleTime: 2.1, pendingInspections: 3, owner: "A. Mehta", approver: "K. Nair", effectiveDate: "2026-05-12", nextReview: "2026-11-12", supplierName: "Harness Mfg Co", warehouse: "Pune DC", notes: "Continuity test 100% — HiPot test AQL 1.0." },
  { partNo: "BLT-EN-9001", partDescription: "Engine Mounting Bolt M12", partCategory: "Component", inspectionType: "incoming", severity: "major", status: "active", revision: "B", charCount: 7, sampleSize: 50, passRate: 99, totalInspections: 312, avgCycleTime: 0.9, pendingInspections: 0, owner: "S. Iyer", approver: "R. Krishnan", effectiveDate: "2026-01-20", nextReview: "2026-07-20", supplierName: "Fasteners India Ltd", warehouse: "Chennai Hub", notes: "Tensile test + hardness test — lot traceability mandatory." },
  { partNo: "OIL-SYN-1001", partDescription: "Synthetic Oil 5W-30 — 1L", partCategory: "Consumable", inspectionType: "incoming", severity: "minor", status: "active", revision: "A", charCount: 5, sampleSize: 13, passRate: 99, totalInspections: 198, avgCycleTime: 1.2, pendingInspections: 0, owner: "V. Gupta", approver: "M. Reddy", effectiveDate: "2026-03-01", nextReview: "2026-09-01", supplierName: "Lubricants India", warehouse: "Kolkata East Hub", notes: "Viscosity + flash point test per ASTM." },
  { partNo: "GLS-WND-1101", partDescription: "Windshield Glass — Laminated", partCategory: "Finished Good", inspectionType: "incoming", severity: "critical", status: "active", revision: "D", charCount: 13, sampleSize: 8, passRate: 93, totalInspections: 78, avgCycleTime: 3.5, pendingInspections: 2, owner: "T. Bose", approver: "V. Gupta", effectiveDate: "2026-04-08", nextReview: "2026-10-08", supplierName: "AIS Glass Solutions", warehouse: "Delhi NCR Hub", notes: "Optical distortion + impact test — critical safety item." },
  { partNo: "RAD-CAB-1201", partDescription: "Radiator Cap — Pressure 1.1 bar", partCategory: "Component", inspectionType: "in-process", severity: "major", status: "in-revision", revision: "E", charCount: 8, sampleSize: 32, passRate: 94, totalInspections: 145, avgCycleTime: 1.6, pendingInspections: 5, owner: "M. Reddy", approver: "S. Iyer", effectiveDate: "2025-11-15", nextReview: "2026-08-15", supplierName: "Cooling Systems Co", warehouse: "Chennai Hub", notes: "Pressure retention test — AQL revision under review." },
  { partNo: "FIL-AIR-1301", partDescription: "Air Filter Element — High Flow", partCategory: "Component", inspectionType: "incoming", severity: "minor", status: "suspended", revision: "B", charCount: 6, sampleSize: 25, passRate: 89, totalInspections: 167, avgCycleTime: 1.4, pendingInspections: 8, owner: "K. Nair", approver: "R. Krishnan", effectiveDate: "2025-12-20", nextReview: "2026-08-20", supplierName: "Filtration Tech Pvt Ltd", warehouse: "Pune DC", notes: "Suspended — supplier audit findings on dust efficiency." },
  { partNo: "SPK-PLG-1401", partDescription: "Spark Plug Iridium Tip", partCategory: "Component", inspectionType: "final", severity: "major", status: "active", revision: "G", charCount: 9, sampleSize: 50, passRate: 96, totalInspections: 256, avgCycleTime: 1.1, pendingInspections: 1, owner: "A. Mehta", approver: "S. Iyer", effectiveDate: "2026-02-28", nextReview: "2026-08-28", supplierName: "NGK Spark Plugs", warehouse: "Bengaluru Hub", notes: "Gap measurement + dielectric strength test." },
  { partNo: "CLT-ASB-1501", partDescription: "Clutch Assembly — Manual", partCategory: "Sub-Assembly", inspectionType: "final", severity: "critical", status: "draft", revision: "A", charCount: 15, sampleSize: 13, passRate: 0, totalInspections: 0, avgCycleTime: 0, pendingInspections: 1, owner: "R. Krishnan", approver: "V. Gupta", effectiveDate: "2026-08-01", nextReview: "2027-02-01", supplierName: "Clutch Masters India", warehouse: "Chennai Hub", notes: "Draft — pending first article inspection plan setup." },
  { partNo: "HLM-CVR-1601", partDescription: "Helmet Shell — DOT Certified", partCategory: "Finished Good", inspectionType: "audit", severity: "critical", status: "obsolete", revision: "C", charCount: 11, sampleSize: 8, passRate: 87, totalInspections: 67, avgCycleTime: 4.5, pendingInspections: 0, owner: "T. Bose", approver: "V. Gupta", effectiveDate: "2024-08-10", nextReview: "2025-08-10", supplierName: "Safety Gear Ltd", warehouse: "Mumbai West DC", notes: "Obsolete — superseded by HLM-CVR-1602 with updated DOT-2026 spec." },
]

const QIPS: QualityInspectionPlan[] = QIP_SEEDS.map((s, idx) => {
  const seed = `${s.partNo}-${s.revision}`
  const characteristics = genCharacteristics(seed, s.charCount)
  const criticalChars = characteristics.filter((c) => c.severity === "critical").length
  const inspections = genInspectionRecords(seed, 8, s.passRate)
  const defects = genDefectRecords(seed, 6)
  return {
    id: `QIP-${(2000 + idx).toString()}`,
    partNo: s.partNo,
    partDescription: s.partDescription,
    partCategory: s.partCategory,
    inspectionType: s.inspectionType,
    severity: s.severity,
    status: s.status,
    revision: s.revision,
    characteristics,
    sampleSize: s.sampleSize,
    passRate: s.passRate,
    lastInspection: inspections[0]?.date || "—",
    totalInspections: s.totalInspections,
    avgCycleTime: s.avgCycleTime,
    pendingInspections: s.pendingInspections,
    criticalChars,
    owner: s.owner,
    approver: s.approver,
    effectiveDate: s.effectiveDate,
    nextReview: s.nextReview,
    supplierName: s.supplierName,
    warehouse: s.warehouse,
    createdAt: "2025-08-15",
    lastModified: inspections[0]?.date || s.effectiveDate,
    notes: s.notes,
  }
})

// Static lists for derived data
const INSPECTION_TREND = [
  { month: "Feb", passRate: 92, inspections: 168 },
  { month: "Mar", passRate: 94, inspections: 184 },
  { month: "Apr", passRate: 93, inspections: 172 },
  { month: "May", passRate: 95, inspections: 196 },
  { month: "Jun", passRate: 96, inspections: 210 },
  { month: "Jul", passRate: 94, inspections: 188 },
]

const DEFECT_PARETO_DATA = [
  { defect: "Surface Scratch", count: 47, color: "#ef4444" },
  { defect: "Dimensional OOT", count: 38, color: "#f59e0b" },
  { defect: "Hardness Below", count: 28, color: "#f59e0b" },
  { defect: "Coating Pinhole", count: 22, color: "#3b82f6" },
  { defect: "Burr on Edge", count: 18, color: "#3b82f6" },
  { defect: "Thread Damage", count: 14, color: "#8b5cf6" },
  { defect: "Color Mismatch", count: 11, color: "#8b5cf6" },
  { defect: "Bore Undersize", count: 8, color: "#10b981" },
]

const AQL_BY_SEVERITY = [
  { severity: "Critical", count: 6, aql: "0.65", color: "#ef4444" },
  { severity: "Major", count: 8, aql: "1.0", color: "#f59e0b" },
  { severity: "Minor", count: 4, aql: "2.5", color: "#3b82f6" },
]

const STATUS_TABS: { value: QIPStatus | "all"; label: string; filter: (q: QualityInspectionPlan) => boolean }[] = [
  { value: "all", label: "All", filter: () => true },
  { value: "draft", label: "Draft", filter: (q) => q.status === "draft" },
  { value: "active", label: "Active", filter: (q) => q.status === "active" },
  { value: "suspended", label: "Suspended", filter: (q) => q.status === "suspended" },
  { value: "in-revision", label: "In Revision", filter: (q) => q.status === "in-revision" },
  { value: "obsolete", label: "Obsolete", filter: (q) => q.status === "obsolete" },
]

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`
}

// ──────────────────────────────────────────────────────────
// KPI CARD COMPONENT
// ──────────────────────────────────────────────────────────

interface KPICardProps {
  title: string
  value: string
  subValue?: string
  trend?: "up" | "down" | "neutral"
  trendLabel?: string
  icon: React.ComponentType<{ className?: string }>
  color: "blue" | "emerald" | "amber" | "violet" | "rose" | "slate"
  index: number
}

const KPI_COLORS: Record<string, { bar: string; bg: string; text: string; bubble: string }> = {
  blue:    { bar: "from-blue-500 to-blue-700",     bg: "bg-blue-50",     text: "text-blue-700",     bubble: "bg-blue-200/40" },
  emerald: { bar: "from-emerald-500 to-emerald-700", bg: "bg-emerald-50", text: "text-emerald-700", bubble: "bg-emerald-200/40" },
  amber:   { bar: "from-amber-500 to-amber-700",   bg: "bg-amber-50",    text: "text-amber-700",    bubble: "bg-amber-200/40" },
  violet:  { bar: "from-violet-500 to-violet-700", bg: "bg-violet-50",   text: "text-violet-700",   bubble: "bg-violet-200/40" },
  rose:    { bar: "from-rose-500 to-rose-700",     bg: "bg-rose-50",     text: "text-rose-700",     bubble: "bg-rose-200/40" },
  slate:   { bar: "from-slate-500 to-slate-700",   bg: "bg-slate-50",    text: "text-slate-700",    bubble: "bg-slate-200/40" },
}

function KPIBox({ title, value, subValue, trend, trendLabel, icon: Icon, color, index }: KPICardProps) {
  const c = KPI_COLORS[color]
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Activity
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-slate-500"
  return (
    <Card
      className={cn(
        "qip-kpi-enter relative overflow-hidden border-t-0 pt-0",
        c.bg, "border", "border-slate-200"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={cn("h-1.5 w-full bg-gradient-to-r", c.bar)} />
      <CardContent className="inner-glow glass-subtle p-4 relative">
        <div className={cn("absolute -top-6 -right-6 w-24 h-24 rounded-full blur-xl", c.bubble)} />
        <div className="flex items-start justify-between gap-2 relative">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 truncate">{title}</p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
            {subValue && <p className="text-[11px] text-slate-600 truncate">{subValue}</p>}
          </div>
          <div className={cn("rounded-lg p-2 ring-1 ring-inset ring-slate-200 bg-white shadow-sm", c.text)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {trendLabel && (
          <div className={cn("mt-2 flex items-center gap-1 text-[11px] font-medium relative", trendColor)}>
            <TrendIcon className="h-3 w-3" />
            <span>{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ──────────────────────────────────────────────────────────
// MAIN VIEW
// ──────────────────────────────────────────────────────────

export function QualityInspectionPlanView() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<QIPStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [inspectionTypeFilter, setInspectionTypeFilter] = useState<InspectionType | "all">("all")
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all")
  const [selectedQIP, setSelectedQIP] = useState<QualityInspectionPlan | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredQIPs = useMemo(() => {
    return QIPS.filter((q) => {
      const tab = STATUS_TABS.find((t) => t.value === activeTab)
      if (!tab?.filter(q)) return false
      if (inspectionTypeFilter !== "all" && q.inspectionType !== inspectionTypeFilter) return false
      if (severityFilter !== "all" && q.severity !== severityFilter) return false
      if (searchQuery) {
        const s = searchQuery.toLowerCase()
        return (
          q.id.toLowerCase().includes(s) ||
          q.partNo.toLowerCase().includes(s) ||
          q.partDescription.toLowerCase().includes(s) ||
          q.supplierName.toLowerCase().includes(s) ||
          q.owner.toLowerCase().includes(s)
        )
      }
      return true
    })
  }, [activeTab, searchQuery, inspectionTypeFilter, severityFilter])

  const kpis = useMemo(() => {
    const total = QIPS.length
    const active = QIPS.filter((q) => q.status === "active").length
    const pendingInsp = QIPS.reduce((s, q) => s + q.pendingInspections, 0)
    const passedInsp = QIPS.filter((q) => q.totalInspections > 0)
    const avgPassRate = passedInsp.length > 0
      ? passedInsp.reduce((s, q) => s + q.passRate, 0) / passedInsp.length
      : 0
    const criticalChars = QIPS.reduce((s, q) => s + q.criticalChars, 0)
    const inspectedQIPs = QIPS.filter((q) => q.totalInspections > 0)
    const avgCycle = inspectedQIPs.length > 0
      ? inspectedQIPs.reduce((s, q) => s + q.avgCycleTime, 0) / inspectedQIPs.length
      : 0
    return { total, active, pendingInsp, avgPassRate, criticalChars, avgCycle }
  }, [])

  const inspectionTypeBreakdown = useMemo(() => {
    const groups: Record<InspectionType, number> = {
      incoming: 0,
      "in-process": 0,
      final: 0,
      audit: 0,
      "first-article": 0,
    }
    QIPS.forEach((q) => { groups[q.inspectionType] += 1 })
    return (Object.entries(groups) as [InspectionType, number][])
      .map(([k, v]) => ({
        name: INSPECTION_TYPE_META[k].label,
        value: v,
        color: INSPECTION_TYPE_META[k].pieColor,
      }))
      .filter((e) => e.value > 0)
  }, [])

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    STATUS_TABS.forEach((t) => {
      counts[t.value] = QIPS.filter(t.filter).length
    })
    return counts
  }, [])

  function openDetail(qip: QualityInspectionPlan) {
    setSelectedQIP(qip)
    setDrawerOpen(true)
  }

  function handleExport() {
    const rows = filteredQIPs.map((q) => ({
      "QIP ID": q.id,
      "Part No": q.partNo,
      "Description": q.partDescription,
      "Inspection Type": INSPECTION_TYPE_META[q.inspectionType].label,
      "Severity": SEVERITY_META[q.severity].label,
      "Status": STATUS_META[q.status].label,
      "Revision": q.revision,
      "Characteristics": q.characteristics.length,
      "Critical Chars": q.criticalChars,
      "Sample Size": q.sampleSize,
      "Pass Rate %": q.passRate,
      "Total Inspections": q.totalInspections,
      "Pending Inspections": q.pendingInspections,
      "Avg Cycle (hrs)": q.avgCycleTime,
      "Owner": q.owner,
      "Approver": q.approver,
      "Supplier": q.supplierName,
      "Warehouse": q.warehouse,
      "Effective Date": q.effectiveDate,
      "Next Review": q.nextReview,
      "Last Inspection": q.lastInspection,
    }))
    exportToCSV(rows, `quality-inspection-plans-${new Date().toISOString().slice(0, 10)}`)
    toast.success("Export complete", `${filteredQIPs.length} QIP records exported to CSV`)
  }

  function handleRefresh() {
    toast.info("Refreshing", "Quality inspection plans reloaded from latest data")
  }

  function handleNewQIP() {
    toast.success("New QIP", "Started new Quality Inspection Plan draft — opening wizard")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Inspection Plans"
        description="Inspection plan lifecycle management — characteristics, sampling, AQL, gauge assignment, and pass-rate analytics across all inspected parts."
      />

      {/* KPI ROW */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <KPIBox
          title="Total QIPs"
          value={String(kpis.total)}
          subValue="Across all parts"
          trend="up"
          trendLabel="+2 this quarter"
          icon={ClipboardList}
          color="slate"
          index={0}
        />
        <KPIBox
          title="Active QIPs"
          value={String(kpis.active)}
          subValue="Currently in production"
          trend="up"
          trendLabel="All on-spec"
          icon={CheckCircle2}
          color="emerald"
          index={1}
        />
        <KPIBox
          title="Pending Inspections"
          value={String(kpis.pendingInsp)}
          subValue="Awaiting inspector"
          trend="down"
          trendLabel="-3 vs last week"
          icon={FileClock}
          color="amber"
          index={2}
        />
        <KPIBox
          title="Avg Pass Rate"
          value={formatPct(kpis.avgPassRate)}
          subValue="Last 6 months"
          trend="up"
          trendLabel="+1.8% MoM"
          icon={Percent}
          color="blue"
          index={3}
        />
        <KPIBox
          title="Critical Chars"
          value={String(kpis.criticalChars)}
          subValue="Across all QIPs"
          trend="neutral"
          trendLabel="AQL 0.65 enforced"
          icon={AlertOctagon}
          color="rose"
          index={4}
        />
        <KPIBox
          title="Avg Cycle Time"
          value={`${kpis.avgCycle.toFixed(1)} h`}
          subValue="Per inspection"
          trend="down"
          trendLabel="-12 min vs Q1"
          icon={Timer}
          color="violet"
          index={5}
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="hover-lift-sm qip-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  6-Month Inspection Trend
                </CardTitle>
                <CardDescription className="text-xs mt-1">Pass rate % + total inspections per month</CardDescription>
              </div>
              <Badge variant="outline" className="badge-interactive text-[10px] bg-blue-50 text-blue-700 border-blue-200">LAST 6M</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <AreaChart data={INSPECTION_TREND} width={520} height={240} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="qipPassRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[85, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Area yAxisId="left" type="monotone" dataKey="passRate" stroke="#3b82f6" strokeWidth={2.5} fill="url(#qipPassRate)" name="Pass Rate %" />
              <Area yAxisId="right" type="monotone" dataKey="inspections" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Inspections" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm qip-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-violet-600" />
                  QIPs by Inspection Type
                </CardTitle>
                <CardDescription className="text-xs mt-1">Distribution of inspection plans by stage</CardDescription>
              </div>
              <Badge variant="outline" className="badge-interactive text-[10px] bg-violet-50 text-violet-700 border-violet-200">5 TYPES</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <PieChart width={520} height={240}>
              <Pie
                data={inspectionTypeBreakdown}
                cx={180}
                cy={120}
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {inspectionTypeBreakdown.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                width={180}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm qip-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bug className="h-4 w-4 text-rose-600" />
                  Defect Pareto — Top 8
                </CardTitle>
                <CardDescription className="text-xs mt-1">Most common defect types across all inspections</CardDescription>
              </div>
              <Badge variant="outline" className="badge-interactive text-[10px] bg-rose-50 text-rose-700 border-rose-200">PARETO</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart data={DEFECT_PARETO_DATA} width={520} height={240} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis type="category" dataKey="defect" tick={{ fontSize: 11 }} stroke="#94a3b8" width={100} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {DEFECT_PARETO_DATA.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm qip-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-amber-600" />
                  AQL Distribution by Severity
                </CardTitle>
                <CardDescription className="text-xs mt-1">Plans per severity tier with AQL level</CardDescription>
              </div>
              <Badge variant="outline" className="badge-interactive text-[10px] bg-amber-50 text-amber-700 border-amber-200">3 TIERS</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart data={AQL_BY_SEVERITY} width={520} height={240} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="severity" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {AQL_BY_SEVERITY.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
              <Legend
                content={() => (
                  <div className="flex items-center justify-center gap-4 mt-2 text-[11px]">
                    {AQL_BY_SEVERITY.map((e, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: e.color }} />
                        <span className="text-slate-600">{e.severity} (AQL {e.aql})</span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </BarChart>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS + TABS + TABLE */}
      <Card className="hover-lift-sm qip-table-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Microscope className="h-4 w-4 text-blue-600" />
                QIP Master List
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {filteredQIPs.length} of {QIPS.length} plans · Click a row to view inspection details, characteristics, and defect history
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search QIP / part / supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 w-56 qip-search-focus"
                />
              </div>
              <Select value={inspectionTypeFilter} onValueChange={(v) => setInspectionTypeFilter(v as InspectionType | "all")}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Inspection Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="in-process">In-Process</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="first-article">First Article</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as Severity | "all")}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-8" onClick={handleRefresh}>
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-8" onClick={handleExport}>
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
              <Button size="sm" className="press-scale h-8 bg-blue-600 hover:bg-blue-700" onClick={handleNewQIP}>
                <FilePlus className="h-3.5 w-3.5 mr-1" />
                New QIP
              </Button>
            </div>
          </div>

          {/* STATUS TABS */}
          <div className="flex flex-wrap gap-1 mt-3 border-b border-slate-200 pb-2">
            {STATUS_TABS.map((t) => {
              const count = tabCounts[t.value] || 0
              const isActive = activeTab === t.value
              return (
                <button
                  key={t.value}
                  onClick={() => setActiveTab(t.value)}
                  className={cn(
                    "qip-tab-btn inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "qip-badge-pop inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold min-w-[18px]",
                      isActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-700"
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle p-0">
          <div className="overflow-x-auto">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-20">QIP ID</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide min-w-[240px]">Part Description</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-28">Inspection Type</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-24">Severity</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-28">Status</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide text-center w-16">Rev</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide text-center w-16">Chars</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide text-center w-20">Sample</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide text-right w-24">Pass Rate</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-28">Last Insp</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-36">Owner</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide text-center w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQIPs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center text-slate-500 py-10 text-sm">
                      No QIPs match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQIPs.map((qip, idx) => {
                    const StatusIcon = STATUS_META[qip.status].icon
                    const TypeIcon = INSPECTION_TYPE_META[qip.inspectionType].icon
                    const SevIcon = SEVERITY_META[qip.severity].icon
                    const passColor = qip.passRate >= 95 ? "text-emerald-600" : qip.passRate >= 90 ? "text-amber-600" : qip.passRate === 0 ? "text-slate-400" : "text-rose-600"
                    const isCritical = qip.status === "obsolete" || qip.passRate < 90
                    const isWarning = qip.status === "suspended" || (qip.passRate >= 90 && qip.passRate < 95)
                    return (
                      <TableRow
                        key={qip.id}
                        onClick={() => openDetail(qip)}
                        className={cn(
                          "qip-row-in cursor-pointer border-slate-100 transition-colors",
                          isCritical
                            ? "qip-row-critical bg-rose-50/40 hover:bg-rose-50/70"
                            : isWarning
                              ? "qip-row-warning bg-amber-50/40 hover:bg-amber-50/70"
                              : "hover:bg-slate-50"
                        )}
                        style={{ animationDelay: `${idx * 25}ms` }}
                      >
                        <TableCell className="py-2.5 text-xs font-mono font-semibold text-slate-700">{qip.id}</TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-start gap-2.5">
                            <Avatar className="h-8 w-8 rounded-md bg-blue-50 ring-1 ring-inset ring-blue-100">
                              <AvatarFallback className="rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                                {qip.partNo.split("-")[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-900 truncate">{qip.partDescription}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{qip.partNo} · {qip.partCategory}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className={cn("text-[10px] gap-1 h-6", INSPECTION_TYPE_META[qip.inspectionType].bg, INSPECTION_TYPE_META[qip.inspectionType].color, "border-current/20")}>
                            <TypeIcon className="h-3 w-3" />
                            {INSPECTION_TYPE_META[qip.inspectionType].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className={cn("text-[10px] gap-1 h-6", SEVERITY_META[qip.severity].bg, SEVERITY_META[qip.severity].color, "border-current/20")}>
                            <SevIcon className="h-3 w-3" />
                            {SEVERITY_META[qip.severity].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className={cn("text-[10px] gap-1 h-6", STATUS_META[qip.status].bg, STATUS_META[qip.status].color, STATUS_META[qip.status].border, "border")}>
                            <StatusIcon className="h-3 w-3" />
                            {STATUS_META[qip.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-center text-xs font-mono font-semibold text-slate-700">{qip.revision}</TableCell>
                        <TableCell className="py-2.5 text-center">
                          <span className="inline-flex items-center gap-1 text-xs">
                            <span className="font-semibold text-slate-700">{qip.characteristics.length}</span>
                            {qip.criticalChars > 0 && (
                              <span className="text-[9px] text-rose-700 bg-rose-100 px-1 rounded font-semibold">{qip.criticalChars} crit</span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5 text-center text-xs font-mono text-slate-700">{qip.sampleSize}</TableCell>
                        <TableCell className="py-2.5 text-right">
                          {qip.passRate === 0 ? (
                            <span className="text-xs text-slate-400">—</span>
                          ) : (
                            <span className={cn("text-xs font-bold tabular-nums", passColor)}>{formatPct(qip.passRate)}</span>
                          )}
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-slate-600">{qip.lastInspection}</TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[9px] bg-slate-100 text-slate-700">
                                {qip.owner.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-xs text-slate-700 font-medium">{qip.owner}</div>
                              <div className="text-[10px] text-slate-500">{qip.warehouse}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-blue-100"
                            onClick={(e) => { e.stopPropagation(); openDetail(qip) }}
                          >
                            <Eye className="h-3.5 w-3.5 text-blue-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* DETAIL DRAWER */}
      {selectedQIP && (
        <QIPDetailDrawer
          qip={selectedQIP}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// DETAIL DRAWER
// ──────────────────────────────────────────────────────────

interface DetailDrawerProps {
  qip: QualityInspectionPlan
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DrawerTab = "overview" | "characteristics" | "inspections" | "defects" | "sampling"

const DRAWER_TABS: { value: DrawerTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "overview", label: "Overview", icon: Activity },
  { value: "characteristics", label: "Characteristics", icon: ListChecks },
  { value: "inspections", label: "Inspection Records", icon: ClipboardList },
  { value: "defects", label: "Defect History", icon: Bug },
  { value: "sampling", label: "Sampling Plan", icon: Crosshair },
]

function QIPDetailDrawer({ qip, open, onOpenChange }: DetailDrawerProps) {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview")

  const StatusIcon = STATUS_META[qip.status].icon
  const TypeIcon = INSPECTION_TYPE_META[qip.inspectionType].icon
  const SevIcon = SEVERITY_META[qip.severity].icon

  const inspections = useMemo(() => genInspectionRecords(`${qip.partNo}-${qip.revision}`, 12, qip.passRate), [qip])
  const defects = useMemo(() => genDefectRecords(`${qip.partNo}-${qip.revision}`, 10), [qip])

  const inspectionStats = useMemo(() => {
    if (qip.totalInspections === 0) {
      return { total: 0, passRate: 0, avgCycle: 0, rejectRate: 0 }
    }
    const total = inspections.length
    const passed = inspections.filter((i) => i.result === "passed").length
    const rejected = inspections.filter((i) => i.disposition === "reject" || i.disposition === "scrap").length
    return {
      total,
      passRate: total > 0 ? (passed / total) * 100 : 0,
      avgCycle: inspections.reduce((s, i) => s + i.cycleTimeHrs, 0) / Math.max(1, total),
      rejectRate: total > 0 ? (rejected / total) * 100 : 0,
    }
  }, [inspections, qip])

  const samplingPlans: SamplingPlan[] = useMemo(() => {
    const plans: SamplingPlan[] = []
    const sevMap: { sev: Severity; aql: number; lotSize: string; code: string; size: number; a: number; r: number }[] = [
      { sev: "critical", aql: 0.65, lotSize: "3,201 – 10,000", code: "G", size: 32, a: 0, r: 1 },
      { sev: "major",    aql: 1.0,  lotSize: "3,201 – 10,000", code: "G", size: 32, a: 1, r: 2 },
      { sev: "minor",    aql: 2.5,  lotSize: "3,201 – 10,000", code: "G", size: 32, a: 2, r: 3 },
    ]
    sevMap.forEach((s) => {
      plans.push({
        severity: s.sev,
        aql: s.aql,
        lotSize: s.lotSize,
        sampleSizeCode: s.code,
        sampleSize: s.size,
        accept: s.a,
        reject: s.r,
      })
    })
    return plans
  }, [])

  function handleExport() {
    toast.success("Export complete", `${qip.id} details exported to PDF`)
  }
  function handleApprove() {
    toast.success("QIP Approved", `${qip.id} Rev ${qip.revision} approved by ${qip.approver}`)
  }
  function handleSuspend() {
    toast.warning("QIP Suspended", `${qip.id} inspection plan suspended pending review`)
  }
  function handleRevise() {
    toast.info("New Revision", `Started new revision for ${qip.id} — current Rev ${qip.revision}`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="qip-drawer-sheen w-full sm:max-w-5xl overflow-y-auto p-0">
        {/* Header */}
        <div className="qip-drawer-header sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <SheetHeader className="space-y-1 p-0">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle className="text-lg font-bold text-slate-900 truncate">
                    {qip.partDescription}
                  </SheetTitle>
                  <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", STATUS_META[qip.status].bg, STATUS_META[qip.status].color, STATUS_META[qip.status].border, "border")}>
                    <StatusIcon className="h-3 w-3" />
                    {STATUS_META[qip.status].label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", INSPECTION_TYPE_META[qip.inspectionType].bg, INSPECTION_TYPE_META[qip.inspectionType].color, "border-current/20")}>
                    <TypeIcon className="h-3 w-3" />
                    {INSPECTION_TYPE_META[qip.inspectionType].label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", SEVERITY_META[qip.severity].bg, SEVERITY_META[qip.severity].color, "border-current/20")}>
                    <SevIcon className="h-3 w-3" />
                    {SEVERITY_META[qip.severity].label}
                  </Badge>
                </div>
                <SheetDescription className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                  <span className="font-mono">{qip.id}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono">{qip.partNo}</span>
                  <span className="text-slate-300">·</span>
                  <span>Revision <span className="font-bold text-slate-700">{qip.revision}</span></span>
                  <span className="text-slate-300">·</span>
                  <span>{qip.partCategory}</span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{qip.warehouse}</span>
                </SheetDescription>
              </div>
            </div>

            {/* HERO STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <div className="qip-stat-enter rounded-md bg-slate-50 border border-slate-200 px-3 py-2" style={{ animationDelay: "0ms" }}>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                  <Hash className="h-3 w-3" /> Chars
                </div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">{qip.characteristics.length}</div>
                <div className="text-[10px] text-rose-600 font-medium">{qip.criticalChars} critical</div>
              </div>
              <div className="qip-stat-enter rounded-md bg-slate-50 border border-slate-200 px-3 py-2" style={{ animationDelay: "80ms" }}>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                  <Crosshair className="h-3 w-3" /> Sample Size
                </div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">{qip.sampleSize}</div>
                <div className="text-[10px] text-slate-500">AQL {SEVERITY_META[qip.severity] ? "0.65/1.0/2.5" : "—"}</div>
              </div>
              <div className="qip-stat-enter rounded-md bg-slate-50 border border-slate-200 px-3 py-2" style={{ animationDelay: "160ms" }}>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                  <Timer className="h-3 w-3" /> Avg Cycle
                </div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">{qip.avgCycleTime.toFixed(1)}h</div>
                <div className="text-[10px] text-slate-500">per inspection</div>
              </div>
              <div className="qip-stat-enter rounded-md bg-slate-50 border border-slate-200 px-3 py-2" style={{ animationDelay: "240ms" }}>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                  <Percent className="h-3 w-3" /> Pass Rate
                </div>
                <div className={cn("text-lg font-bold tabular-nums", qip.passRate >= 95 ? "text-emerald-600" : qip.passRate >= 90 ? "text-amber-600" : qip.passRate === 0 ? "text-slate-400" : "text-rose-600")}>
                  {qip.passRate === 0 ? "—" : formatPct(qip.passRate)}
                </div>
                <div className="text-[10px] text-slate-500">{qip.totalInspections} total inspections</div>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* TAB BAR */}
        <div className="sticky top-[168px] z-20 bg-white border-b border-slate-200 px-6 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {DRAWER_TABS.map((t) => {
              const Icon = t.icon
              const isActive = activeTab === t.value
              const tabCount = t.value === "characteristics" ? qip.characteristics.length
                : t.value === "inspections" ? inspections.length
                : t.value === "defects" ? defects.length
                : t.value === "sampling" ? samplingPlans.length
                : null
              return (
                <button
                  key={t.value}
                  onClick={() => setActiveTab(t.value)}
                  className={cn(
                    "qip-tab-btn inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                  {tabCount !== null && (
                    <span className={cn(
                      "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold min-w-[18px]",
                      isActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-700"
                    )}>
                      {tabCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* BODY */}
        <div className="qip-body-enter px-6 py-5 space-y-5">
          {activeTab === "overview" && <OverviewTab qip={qip} inspectionStats={inspectionStats} />}
          {activeTab === "characteristics" && <CharacteristicsTab qip={qip} />}
          {activeTab === "inspections" && <InspectionsTab qip={qip} records={inspections} />}
          {activeTab === "defects" && <DefectsTab qip={qip} records={defects} />}
          {activeTab === "sampling" && <SamplingTab qip={qip} plans={samplingPlans} />}
        </div>

        <SheetFooter className="border-t border-slate-200 px-6 py-3 bg-slate-50">
          <div className="flex items-center justify-between w-full gap-2">
            <div className="text-[11px] text-slate-500">
              <span className="font-medium">Effective:</span> {qip.effectiveDate} · <span className="font-medium">Next Review:</span> {qip.nextReview}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-8" onClick={handleExport}>
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
              {qip.status === "draft" && (
                <Button size="sm" className="press-scale h-8 bg-emerald-600 hover:bg-emerald-700" onClick={handleApprove}>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                </Button>
              )}
              {qip.status === "active" && (
                <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-8 text-amber-700 border-amber-300 hover:bg-amber-50" onClick={handleSuspend}>
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Suspend
                </Button>
              )}
              {(qip.status === "active" || qip.status === "suspended" || qip.status === "in-revision") && (
                <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-8" onClick={handleRevise}>
                  <PenLine className="h-3.5 w-3.5 mr-1" /> New Revision
                </Button>
              )}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ──────────────────────────────────────────────────────────
// TAB: OVERVIEW
// ──────────────────────────────────────────────────────────

function OverviewTab({ qip, inspectionStats }: { qip: QualityInspectionPlan; inspectionStats: { total: number; passRate: number; avgCycle: number; rejectRate: number } }) {
  return (
    <div className="space-y-4">
      {/* TOP: Ownership + Lifecycle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="hover-lift-sm qip-card-enter border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <User className="h-3.5 w-3.5 text-blue-600" /> Ownership & Accountability
            </CardTitle>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Plan Owner</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6"><AvatarFallback className="text-[9px] bg-blue-100 text-blue-700">{qip.owner.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                <span className="text-xs font-medium text-slate-800">{qip.owner}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Approver</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6"><AvatarFallback className="text-[9px] bg-emerald-100 text-emerald-700">{qip.approver.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                <span className="text-xs font-medium text-slate-800">{qip.approver}</span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Building2 className="h-3 w-3" /> Supplier</span>
              <span className="text-xs font-medium text-slate-800">{qip.supplierName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Building2 className="h-3 w-3" /> Warehouse</span>
              <span className="text-xs font-medium text-slate-800">{qip.warehouse}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm qip-card-enter border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <History className="h-3.5 w-3.5 text-violet-600" /> Lifecycle
            </CardTitle>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Effective Date</span>
              <span className="text-xs font-medium text-slate-800">{qip.effectiveDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Next Review</span>
              <span className="text-xs font-medium text-slate-800">{qip.nextReview}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Created</span>
              <span className="text-xs font-medium text-slate-800">{qip.createdAt}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Last Modified</span>
              <span className="text-xs font-medium text-slate-800">{qip.lastModified}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Last Inspection</span>
              <span className="text-xs font-medium text-slate-800">{qip.lastInspection}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MID: Inspection Performance */}
      <Card className="hover-lift-sm qip-card-enter border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            <Activity className="h-3.5 w-3.5 text-blue-600" /> Inspection Performance (Last 30 days)
          </CardTitle>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
              <div className="text-[10px] uppercase tracking-wide text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Pass Rate
              </div>
              <div className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                {inspectionStats.total === 0 ? "—" : formatPct(inspectionStats.passRate)}
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5">{inspectionStats.total} inspections</div>
            </div>
            <div className="rounded-md bg-rose-50 border border-rose-200 p-3">
              <div className="text-[10px] uppercase tracking-wide text-rose-700 font-semibold flex items-center gap-1">
                <XCircle className="h-3 w-3" /> Reject Rate
              </div>
              <div className="text-2xl font-bold text-rose-700 tabular-nums mt-1">
                {inspectionStats.total === 0 ? "—" : formatPct(inspectionStats.rejectRate)}
              </div>
              <div className="text-[10px] text-rose-600 mt-0.5">rejected / scrapped</div>
            </div>
            <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
              <div className="text-[10px] uppercase tracking-wide text-blue-700 font-semibold flex items-center gap-1">
                <Timer className="h-3 w-3" /> Avg Cycle
              </div>
              <div className="text-2xl font-bold text-blue-700 tabular-nums mt-1">
                {inspectionStats.total === 0 ? "—" : `${inspectionStats.avgCycle.toFixed(1)}h`}
              </div>
              <div className="text-[10px] text-blue-600 mt-0.5">per inspection</div>
            </div>
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
              <div className="text-[10px] uppercase tracking-wide text-amber-700 font-semibold flex items-center gap-1">
                <FileClock className="h-3 w-3" /> Pending
              </div>
              <div className="text-2xl font-bold text-amber-700 tabular-nums mt-1">{qip.pendingInspections}</div>
              <div className="text-[10px] text-amber-600 mt-0.5">awaiting inspector</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CHARACTERISTICS SUMMARY */}
      <Card className="hover-lift-sm qip-card-enter border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            <ListChecks className="h-3.5 w-3.5 text-violet-600" /> Characteristics Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-2">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="rounded-md bg-slate-50 border border-slate-200 p-2 text-center">
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Total</div>
              <div className="text-xl font-bold text-slate-800 tabular-nums">{qip.characteristics.length}</div>
            </div>
            <div className="rounded-md bg-rose-50 border border-rose-200 p-2 text-center">
              <div className="text-[10px] uppercase text-rose-700 font-semibold">Critical</div>
              <div className="text-xl font-bold text-rose-700 tabular-nums">{qip.characteristics.filter((c) => c.severity === "critical").length}</div>
            </div>
            <div className="rounded-md bg-amber-50 border border-amber-200 p-2 text-center">
              <div className="text-[10px] uppercase text-amber-700 font-semibold">Major</div>
              <div className="text-xl font-bold text-amber-700 tabular-nums">{qip.characteristics.filter((c) => c.severity === "major").length}</div>
            </div>
            <div className="rounded-md bg-blue-50 border border-blue-200 p-2 text-center">
              <div className="text-[10px] uppercase text-blue-700 font-semibold">Minor</div>
              <div className="text-xl font-bold text-blue-700 tabular-nums">{qip.characteristics.filter((c) => c.severity === "minor").length}</div>
            </div>
            <div className="rounded-md bg-violet-50 border border-violet-200 p-2 text-center">
              <div className="text-[10px] uppercase text-violet-700 font-semibold">Gauges</div>
              <div className="text-xl font-bold text-violet-700 tabular-nums">{new Set(qip.characteristics.map((c) => c.gauge)).size}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NOTES */}
      <Card className="hover-lift-sm qip-card-enter border-amber-200 bg-amber-50/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 uppercase tracking-wide">
            <AlertTriangle className="h-3.5 w-3.5" /> Plan Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-2">
          <p className="text-xs text-slate-700 leading-relaxed">{qip.notes}</p>
        </CardContent>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// TAB: CHARACTERISTICS
// ──────────────────────────────────────────────────────────

function CharacteristicsTab({ qip }: { qip: QualityInspectionPlan }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Inspection Characteristics</h3>
          <p className="text-[11px] text-slate-500">{qip.characteristics.length} characteristics defined in this QIP</p>
        </div>
        <Badge variant="outline" className="badge-interactive text-[10px] bg-blue-50 text-blue-700 border-blue-200">REV {qip.revision}</Badge>
      </div>

      <div className="rounded-md border border-slate-200 overflow-hidden">
        <Table className="table-hover-highlight">
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-10">#</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase min-w-[180px]">Characteristic</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-24">Type</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-28">Spec</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-24">Tolerance</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase min-w-[180px]">Gauge</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-14">AQL</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-20">Severity</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase min-w-[150px]">Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qip.characteristics.map((c, idx) => {
              const TypeIcon = CHAR_TYPE_META[c.charType].icon
              const SevIcon = SEVERITY_META[c.severity].icon
              return (
                <TableRow
                  key={c.seq}
                  className={cn(
                    "qip-card-enter border-slate-100",
                    c.severity === "critical" && "bg-rose-50/30"
                  )}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <TableCell className="py-2 text-xs font-mono font-semibold text-slate-700">{c.seq}</TableCell>
                  <TableCell className="py-2">
                    <div className="text-xs font-medium text-slate-800">{c.name}</div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", "bg-white", CHAR_TYPE_META[c.charType].color, "border-current/20")}>
                      <TypeIcon className="h-2.5 w-2.5" />
                      {CHAR_TYPE_META[c.charType].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-xs font-mono text-slate-700">{c.spec}</TableCell>
                  <TableCell className="py-2 text-xs font-mono text-slate-700">{c.tolerance}</TableCell>
                  <TableCell className="py-2 text-xs text-slate-700">
                    <div className="flex items-center gap-1">
                      <Gauge className="h-3 w-3 text-slate-400" />
                      <span>{c.gauge}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono font-semibold text-slate-700">{c.aql}</TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", SEVERITY_META[c.severity].bg, SEVERITY_META[c.severity].color, "border-current/20")}>
                      <SevIcon className="h-2.5 w-2.5" />
                      {SEVERITY_META[c.severity].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-[11px] text-slate-600">{c.method}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// TAB: INSPECTION RECORDS
// ──────────────────────────────────────────────────────────

function InspectionsTab({ qip, records }: { qip: QualityInspectionPlan; records: InspectionRecord[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Recent Inspection Records</h3>
          <p className="text-[11px] text-slate-500">{records.length} of {qip.totalInspections} total inspections shown</p>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 overflow-hidden">
        <Table className="table-hover-highlight">
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-24">Record ID</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-24">Date</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-20">Batch</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-32">Inspector</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-16">Sample</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-14">Pass</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-14">Fail</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-24">Result</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-28">Disposition</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-20">Cycle (h)</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase min-w-[200px]">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r, idx) => {
              const ResultIcon = RESULT_META[r.result].icon
              const DispIcon = DISPOSITION_META[r.disposition].icon
              return (
                <TableRow
                  key={r.id}
                  className={cn(
                    "qip-card-enter border-slate-100",
                    r.result === "failed" && "bg-rose-50/40",
                    r.result === "conditional" && "bg-amber-50/40"
                  )}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <TableCell className="py-2 text-xs font-mono font-semibold text-slate-700">{r.id}</TableCell>
                  <TableCell className="py-2 text-xs text-slate-700">{r.date}</TableCell>
                  <TableCell className="py-2 text-xs font-mono text-slate-700">{r.batch}</TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5"><AvatarFallback className="text-[8px] bg-slate-100 text-slate-700">{r.inspector.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                      <span className="text-xs text-slate-700">{r.inspector}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono text-slate-700">{r.sampleSize}</TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono font-semibold text-emerald-700">{r.passed}</TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono font-semibold text-rose-700">{r.failed}</TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", RESULT_META[r.result].bg, RESULT_META[r.result].color, "border-current/20")}>
                      <ResultIcon className="h-2.5 w-2.5" />
                      {RESULT_META[r.result].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", "bg-white", DISPOSITION_META[r.disposition].color, "border-current/20")}>
                      <DispIcon className="h-2.5 w-2.5" />
                      {DISPOSITION_META[r.disposition].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono text-slate-700">{r.cycleTimeHrs.toFixed(1)}</TableCell>
                  <TableCell className="py-2 text-[11px] text-slate-600 italic">{r.notes}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// TAB: DEFECTS
// ──────────────────────────────────────────────────────────

function DefectsTab({ qip, records }: { qip: QualityInspectionPlan; records: DefectRecord[] }) {
  const pareto = useMemo(() => {
    const counts: Record<string, { count: number; severity: Severity }> = {}
    records.forEach((r) => {
      if (!counts[r.defectType]) counts[r.defectType] = { count: 0, severity: r.severity }
      counts[r.defectType].count += r.count
      if (r.severity === "critical") counts[r.defectType].severity = "critical"
    })
    return Object.entries(counts)
      .map(([k, v]) => ({ name: k, count: v.count, color: SEVERITY_META[v.severity].pieColor }))
      .sort((a, b) => b.count - a.count)
  }, [records])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Defect History & Pareto</h3>
          <p className="text-[11px] text-slate-500">{records.length} defect incidents recorded for {qip.partNo}</p>
        </div>
      </div>

      {pareto.length > 0 && (
        <Card className="hover-lift-sm qip-card-enter border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <Bug className="h-3.5 w-3.5 text-rose-600" /> Defect Pareto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={pareto} width={860} height={180} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" width={140} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {pareto.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border border-slate-200 overflow-hidden">
        <Table className="table-hover-highlight">
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-24">Defect ID</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-24">Date</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase min-w-[180px]">Characteristic</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase min-w-[160px]">Defect Type</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-14">Count</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-20">Severity</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-28">Disposition</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-28">CAPA Ref</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((d, idx) => {
              const SevIcon = SEVERITY_META[d.severity].icon
              const DispIcon = DISPOSITION_META[d.disposition].icon
              return (
                <TableRow
                  key={d.id}
                  className={cn(
                    "qip-card-enter border-slate-100",
                    d.severity === "critical" && "bg-rose-50/40"
                  )}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <TableCell className="py-2 text-xs font-mono font-semibold text-slate-700">{d.id}</TableCell>
                  <TableCell className="py-2 text-xs text-slate-700">{d.date}</TableCell>
                  <TableCell className="py-2 text-xs text-slate-700">{d.charName}</TableCell>
                  <TableCell className="py-2 text-xs text-slate-700">{d.defectType}</TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono font-semibold text-slate-700">{d.count}</TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", SEVERITY_META[d.severity].bg, SEVERITY_META[d.severity].color, "border-current/20")}>
                      <SevIcon className="h-2.5 w-2.5" />
                      {SEVERITY_META[d.severity].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", "bg-white", DISPOSITION_META[d.disposition].color, "border-current/20")}>
                      <DispIcon className="h-2.5 w-2.5" />
                      {DISPOSITION_META[d.disposition].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-xs font-mono text-slate-700">
                    {d.capaRef !== "—" ? (
                      <span className="text-blue-700 underline cursor-pointer">{d.capaRef}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// TAB: SAMPLING PLAN
// ──────────────────────────────────────────────────────────

function SamplingTab({ qip, plans }: { qip: QualityInspectionPlan; plans: SamplingPlan[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Sampling Plan (ANSI/ASQ Z1.4 — Level II)</h3>
          <p className="text-[11px] text-slate-500">AQL levels per severity tier — single sampling plan</p>
        </div>
        <Badge variant="outline" className="badge-interactive text-[10px] bg-blue-50 text-blue-700 border-blue-200">LOT 3,201-10,000</Badge>
      </div>

      <div className="rounded-md border border-slate-200 overflow-hidden">
        <Table className="table-hover-highlight">
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-24">Severity</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-20">AQL</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase w-32">Lot Size</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-16">Code</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-20">Sample</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-16">Accept</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase text-center w-16">Reject</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold text-slate-600 uppercase min-w-[200px]">Interpretation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((p, idx) => {
              const SevIcon = SEVERITY_META[p.severity].icon
              return (
                <TableRow
                  key={p.severity}
                  className={cn(
                    "qip-card-enter border-slate-100",
                    p.severity === "critical" && "bg-rose-50/30"
                  )}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <TableCell className="py-2">
                    <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", SEVERITY_META[p.severity].bg, SEVERITY_META[p.severity].color, "border-current/20")}>
                      <SevIcon className="h-2.5 w-2.5" />
                      {SEVERITY_META[p.severity].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono font-semibold text-slate-700">{p.aql}</TableCell>
                  <TableCell className="py-2 text-xs text-slate-700">{p.lotSize}</TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono font-semibold text-slate-700">{p.sampleSizeCode}</TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono font-bold text-blue-700">{p.sampleSize}</TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono font-semibold text-emerald-700">≤ {p.accept}</TableCell>
                  <TableCell className="py-2 text-center text-xs font-mono font-semibold text-rose-700">≥ {p.reject}</TableCell>
                  <TableCell className="py-2 text-[11px] text-slate-600">
                    {p.severity === "critical"
                      ? "Zero Acceptance Number — any defect rejects lot"
                      : p.severity === "major"
                        ? "Reject lot if 2 or more defects found in sample"
                        : "Reject lot if 3 or more defects found in sample"}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* GAUGE CALIBRATION CARD */}
      <Card className="hover-lift-sm qip-card-enter border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            <Gauge className="h-3.5 w-3.5 text-violet-600" /> Gauge Calibration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Array.from(new Set(qip.characteristics.map((c) => c.gauge))).slice(0, 6).map((g, idx) => {
              const calibDate = new Date(2026, 5 - (idx % 3), 15).toISOString().slice(0, 10)
              const nextDate = new Date(2026, 11 - (idx % 3), 15).toISOString().slice(0, 10)
              const status = (idx % 4 === 0) ? "due" : "ok"
              return (
                <div key={idx} className="rounded-md border border-slate-200 bg-slate-50 p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("rounded-md p-1.5", status === "due" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>
                      <Gauge className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-800 truncate">{g}</div>
                      <div className="text-[10px] text-slate-500">Last: {calibDate} · Next: {nextDate}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[10px] h-5",
                    status === "due"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}>
                    {status === "due" ? "Due Soon" : "Current"}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* SAMPLE SIZE CALCULATOR CARD */}
      <Card className="hover-lift-sm qip-card-enter border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            <Crosshair className="h-3.5 w-3.5 text-blue-600" /> Sample Size Calculation Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-2 space-y-2">
          <div className="text-xs text-slate-600">
            Sample size for this QIP is <span className="font-bold text-blue-700">{qip.sampleSize} units</span> based on:
          </div>
          <ul className="text-xs text-slate-700 space-y-1 ml-4 list-disc">
            <li>Inspection Level: <span className="font-semibold">Level II (General)</span></li>
            <li>Lot Size Range: <span className="font-semibold">3,201 – 10,000 units</span></li>
            <li>Code Letter: <span className="font-semibold">G</span></li>
            <li>Sampling Plan: <span className="font-semibold">Single Sampling</span></li>
            <li>AQL Master Severity: <span className="font-semibold">{SEVERITY_META[qip.severity].label} (AQL {qip.severity === "critical" ? "0.65" : qip.severity === "major" ? "1.0" : "2.5"})</span></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
