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
  FileWarning,
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
  Bug,
  AlertOctagon,
  PenLine,
  Wrench,
  Target,
  ListChecks,
  Crosshair,
  History,
  Repeat,
  Building2,
  User,
  Timer,
  Calendar,
  Stethoscope,
  ShieldAlert,
  FileCheck,
  FileClock,
  FilePlus,
  ClipboardList,
  ArrowRightCircle,
  ThumbsUp,
  CircleDollarSign,
  Factory,
  Boxes,
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

type NCRStatus = "open" | "investigation" | "containment" | "capa-open" | "verification" | "closed" | "cancelled"
type NCRSeverity = "critical" | "major" | "minor"
type NCRSource = "incoming-inspection" | "in-process" | "customer-complaint" | "internal-audit" | "supplier-audit" | "final-inspection" | "first-article"
type Disposition = "use-as-is" | "rework" | "return-to-vendor" | "scrap" | "reject"
type RCACategory = "material" | "machine" | "method" | "manpower" | "measurement" | "environment" | "design"
type CAPAStatus = "open" | "in-progress" | "implemented" | "verified" | "effective" | "failed"

interface NCRCAPA {
  id: string
  type: "corrective" | "preventive"
  action: string
  owner: string
  dueDate: string
  status: CAPAStatus
  progressPct: number
  verificationDate: string | null
  effectiveness: "pending" | "effective" | "failed" | null
}

interface NCRApproval {
  role: string
  name: string
  date: string
  status: "pending" | "approved" | "rejected"
  comment: string
}

interface NonConformanceReport {
  id: string
  title: string
  partNo: string
  partDescription: string
  supplierName: string
  warehouse: string
  source: NCRSource
  severity: NCRSeverity
  status: NCRStatus
  discoveryDate: string
  discoveryBy: string
  lotSize: number
  qtyAffected: number
  qtyDefective: number
  defectType: string
  defectDescription: string
  disposition: Disposition
  estimatedCost: number
  actualCost: number
  qipRef: string
  poRef: string
  grnRef: string
  rcaCategory: RCACategory
  rcaSummary: string
  capaList: NCRCAPA[]
  approvals: NCRApproval[]
  ageDays: number
  daysToClose: number | null
  owner: string
  reportDate: string
  closedDate: string | null
  notes: string
}

// ──────────────────────────────────────────────────────────
// META
// ──────────────────────────────────────────────────────────

const STATUS_META: Record<NCRStatus, { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  open:           { label: "Open",           color: "text-rose-700",     bg: "bg-rose-50",     border: "border-rose-200",     icon: AlertOctagon },
  investigation:  { label: "Investigation",  color: "text-amber-700",    bg: "bg-amber-50",    border: "border-amber-200",    icon: Stethoscope },
  containment:    { label: "Containment",    color: "text-orange-700",   bg: "bg-orange-50",   border: "border-orange-200",   icon: ShieldAlert },
  "capa-open":    { label: "CAPA Open",      color: "text-violet-700",   bg: "bg-violet-50",   border: "border-violet-200",   icon: PenLine },
  verification:   { label: "Verification",   color: "text-blue-700",     bg: "bg-blue-50",     border: "border-blue-200",     icon: FileCheck },
  closed:         { label: "Closed",         color: "text-emerald-700",  bg: "bg-emerald-50",  border: "border-emerald-200",  icon: CheckCircle2 },
  cancelled:      { label: "Cancelled",      color: "text-slate-600",    bg: "bg-slate-100",   border: "border-slate-200",    icon: XCircle },
}

const SEVERITY_META: Record<NCRSeverity, { label: string; color: string; bg: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  critical: { label: "Critical", color: "text-rose-700",  bg: "bg-rose-50",  pieColor: "#ef4444", icon: AlertOctagon },
  major:    { label: "Major",    color: "text-amber-700", bg: "bg-amber-50", pieColor: "#f59e0b", icon: AlertTriangle },
  minor:    { label: "Minor",    color: "text-blue-700",  bg: "bg-blue-50",  pieColor: "#3b82f6", icon: Crosshair },
}

const SOURCE_META: Record<NCRSource, { label: string; color: string; bg: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  "incoming-inspection":  { label: "Incoming Insp.",   color: "text-blue-700",    bg: "bg-blue-50",    pieColor: "#3b82f6", icon: Stethoscope },
  "in-process":           { label: "In-Process",       color: "text-violet-700",  bg: "bg-violet-50",  pieColor: "#8b5cf6", icon: Activity },
  "customer-complaint":   { label: "Customer Complaint",color: "text-rose-700",   bg: "bg-rose-50",    pieColor: "#ef4444", icon: AlertOctagon },
  "internal-audit":       { label: "Internal Audit",   color: "text-amber-700",   bg: "bg-amber-50",   pieColor: "#f59e0b", icon: ClipboardList },
  "supplier-audit":       { label: "Supplier Audit",   color: "text-orange-700",  bg: "bg-orange-50",  pieColor: "#f97316", icon: Factory },
  "final-inspection":     { label: "Final Inspection", color: "text-emerald-700", bg: "bg-emerald-50", pieColor: "#10b981", icon: FileCheck },
  "first-article":        { label: "First Article",    color: "text-pink-700",    bg: "bg-pink-50",    pieColor: "#ec4899", icon: FilePlus },
}

const DISPOSITION_META: Record<Disposition, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  "use-as-is":         { label: "Use As Is",         color: "text-blue-700",    bg: "bg-blue-50",    icon: CheckCircle2 },
  rework:              { label: "Rework",            color: "text-amber-700",   bg: "bg-amber-50",   icon: Wrench },
  "return-to-vendor":  { label: "Return to Vendor",  color: "text-rose-700",    bg: "bg-rose-50",    icon: Repeat },
  scrap:               { label: "Scrap",             color: "text-slate-700",   bg: "bg-slate-100",  icon: Bug },
  reject:              { label: "Reject",            color: "text-red-700",     bg: "bg-red-50",     icon: XCircle },
}

const RCA_META: Record<RCACategory, { label: string; color: string; bg: string; pieColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  material:    { label: "Material",    color: "text-rose-700",    bg: "bg-rose-50",    pieColor: "#ef4444", icon: Boxes },
  machine:     { label: "Machine",     color: "text-amber-700",   bg: "bg-amber-50",   pieColor: "#f59e0b", icon: Wrench },
  method:      { label: "Method",      color: "text-blue-700",    bg: "bg-blue-50",    pieColor: "#3b82f6", icon: ListChecks },
  manpower:    { label: "Manpower",    color: "text-violet-700",  bg: "bg-violet-50",  pieColor: "#8b5cf6", icon: User },
  measurement: { label: "Measurement", color: "text-emerald-700", bg: "bg-emerald-50", pieColor: "#10b981", icon: Crosshair },
  environment: { label: "Environment", color: "text-teal-700",    bg: "bg-teal-50",    pieColor: "#14b8a6", icon: Activity },
  design:      { label: "Design",      color: "text-orange-700",  bg: "bg-orange-50",  pieColor: "#f97316", icon: Target },
}

const CAPA_STATUS_META: Record<CAPAStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  open:         { label: "Open",         color: "text-rose-700",    bg: "bg-rose-50",    icon: FilePlus },
  "in-progress":{ label: "In Progress",  color: "text-amber-700",   bg: "bg-amber-50",   icon: Activity },
  implemented:  { label: "Implemented",  color: "text-blue-700",    bg: "bg-blue-50",    icon: ArrowRightCircle },
  verified:     { label: "Verified",     color: "text-violet-700",  bg: "bg-violet-50",  icon: FileCheck },
  effective:    { label: "Effective",    color: "text-emerald-700", bg: "bg-emerald-50", icon: ThumbsUp },
  failed:       { label: "Failed",       color: "text-red-700",     bg: "bg-red-50",     icon: XCircle },
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

function genCAPA(seed: string, count: number): NCRCAPA[] {
  const correctiveActions = [
    "Re-inspect 100% of affected lot under enhanced AQL",
    "Quarantine all open lots from same supplier batch",
    "Issue SCAR (Supplier Corrective Action Request) to vendor",
    "Update QIP to add new critical characteristic for affected dimension",
    "Calibrate gauge — verify traceability to NIST standard",
    "Retrain inspectors on updated inspection method per latest SOP",
    "Reject pending PO receipts pending supplier 8D submission",
    "Place supplier on probation — require 100% inspection for 90 days",
  ]
  const preventiveActions = [
    "Add Poka-Yoke (mistake-proofing) jig to assembly line for affected feature",
    "Update PFMEA to include new failure mode and severity rating",
    "Establish SPC control chart with continuous monitoring on critical dim",
    "Update supplier PPAP requirements — add annual requalification",
    "Modify receiving inspection sample size from AQL 1.0 to AQL 0.65",
    "Add automated vision inspection station at receiving dock",
    "Update Control Plan — increase frequency from 1-in-30 to 1-in-15",
    "Roll out 5-Why training program across all inspection teams",
  ]
  const owners = ["R. Krishnan", "A. Mehta", "P. Singh", "S. Iyer", "V. Gupta", "M. Reddy", "K. Nair"]
  const statuses: CAPAStatus[] = ["open", "in-progress", "implemented", "verified", "effective", "failed"]
  return Array.from({ length: count }, (_, i) => {
    const seedNum = hash(`${seed}-capa${i}`)
    const isCorrective = i % 2 === 0
    const status = pick(statuses, seedNum + i * 3)
    const dueDate = new Date(2026, 6 + (i % 3), 15 + (seedNum % 14)).toISOString().slice(0, 10)
    const verificationDate = (status === "verified" || status === "effective" || status === "failed")
      ? new Date(2026, 7 - (i % 2), 10 + (seedNum % 14)).toISOString().slice(0, 10)
      : null
    const effectiveness: NCRCAPA["effectiveness"] = status === "effective"
      ? "effective"
      : status === "failed"
        ? "failed"
        : status === "verified"
          ? "pending"
          : null
    return {
      id: `CAPA-${seedNum.toString(36).slice(-5).toUpperCase()}`,
      type: isCorrective ? "corrective" : "preventive",
      action: isCorrective ? pick(correctiveActions, seedNum + i) : pick(preventiveActions, seedNum + i * 2),
      owner: pick(owners, seedNum + i),
      dueDate,
      status,
      progressPct: status === "open" ? 0 : status === "in-progress" ? 35 : status === "implemented" ? 70 : status === "verified" ? 90 : status === "effective" ? 100 : 50,
      verificationDate,
      effectiveness,
    }
  })
}

function genApprovals(seed: string): NCRApproval[] {
  const roles = ["Quality Manager", "Operations Manager", "Engineering Lead", "Plant Director"]
  const names = ["S. Iyer", "V. Gupta", "R. Krishnan", "A. Mehta", "P. Singh"]
  return roles.map((role, idx) => {
    const seedNum = hash(`${seed}-appr${idx}`)
    const statuses: NCRApproval["status"][] = ["pending", "approved", "rejected"]
    const status: NCRApproval["status"] = idx < 2 ? "approved" : (seedNum % 4 === 0 ? "rejected" : (seedNum % 3 === 0 ? "pending" : "approved"))
    return {
      role,
      name: pick(names, seedNum + idx),
      date: status === "pending" ? "—" : new Date(2026, 6, 5 + idx + (seedNum % 10)).toISOString().slice(0, 10),
      status,
      comment: status === "approved"
        ? "Reviewed and concurred. Proceed with disposition."
        : status === "rejected"
          ? "Need additional root cause analysis before approval."
          : "Awaiting review.",
    }
  })
}

// ──────────────────────────────────────────────────────────
// STATIC NCR RECORDS
// ──────────────────────────────────────────────────────────

interface NCRSeed {
  id: string
  title: string
  partNo: string
  partDescription: string
  supplierName: string
  warehouse: string
  source: NCRSource
  severity: NCRSeverity
  status: NCRStatus
  discoveryDate: string
  discoveryBy: string
  lotSize: number
  qtyAffected: number
  qtyDefective: number
  defectType: string
  defectDescription: string
  disposition: Disposition
  estimatedCost: number
  actualCost: number
  qipRef: string
  poRef: string
  grnRef: string
  rcaCategory: RCACategory
  rcaSummary: string
  capaCount: number
  ageDays: number
  daysToClose: number | null
  owner: string
  closedDate: string | null
  notes: string
}

const NCR_SEEDS: NCRSeed[] = [
  { id: "NCR-2026-1001", title: "Brake Pad Hardness Below Spec", partNo: "BRK-PAD-1001", partDescription: "Brake Pad Assembly — Passenger Car", supplierName: "BrakeTech Industries", warehouse: "Chennai Hub", source: "incoming-inspection", severity: "critical", status: "capa-open", discoveryDate: "2026-07-18", discoveryBy: "R. Krishnan", lotSize: 1500, qtyAffected: 32, qtyDefective: 8, defectType: "Hardness Below Spec", defectDescription: "Sample hardness measured 52-54 HRC vs spec 58-62 HRC on 8 of 32 units sampled. Lot quarantined pending disposition.", disposition: "return-to-vendor", estimatedCost: 85000, actualCost: 0, qipRef: "QIP-2000", poRef: "PO-2026-10234", grnRef: "GRN-2026-8456", rcaCategory: "material", rcaSummary: "Material heat-treatment process at supplier deviated from spec — furnace temperature dropped 40°C below setpoint during quench cycle.", capaCount: 3, ageDays: 8, daysToClose: null, owner: "R. Krishnan", closedDate: null, notes: "Critical safety component — SCAR issued to supplier. Pending 8D response." },
  { id: "NCR-2026-1002", title: "Wheel Rim Concentricity OOT", partNo: "FRM-WHL-2001", partDescription: "Front Wheel Rim — 17 inch Alloy", supplierName: "AlloyWorks Ltd", warehouse: "Pune DC", source: "incoming-inspection", severity: "major", status: "investigation", discoveryDate: "2026-07-20", discoveryBy: "A. Mehta", lotSize: 800, qtyAffected: 50, qtyDefective: 6, defectType: "Concentricity Deviation", defectDescription: "Concentricity deviation 0.08mm vs tolerance 0.05mm on 6 of 50 sampled rims. Visual inspection passed.", disposition: "use-as-is", estimatedCost: 25000, actualCost: 0, qipRef: "QIP-2001", poRef: "PO-2026-10312", grnRef: "GRN-2026-8521", rcaCategory: "machine", rcaSummary: "CNC machining center spindle runout detected — scheduled recalibration.", capaCount: 2, ageDays: 6, daysToClose: null, owner: "A. Mehta", closedDate: null, notes: "Engineering review pending — use-as-is disposition under consideration." },
  { id: "NCR-2026-1003", title: "Engine Block Casting Porosity", partNo: "ENG-BLK-3001", partDescription: "Engine Cylinder Block — Cast Iron", supplierName: "Castings India Pvt Ltd", warehouse: "Chennai Hub", source: "first-article", severity: "critical", status: "containment", discoveryDate: "2026-07-22", discoveryBy: "P. Singh", lotSize: 25, qtyAffected: 5, qtyDefective: 3, defectType: "Casting Porosity", defectDescription: "X-ray inspection revealed internal porosity in 3 of 5 first-article samples. Porosity exceeds Class C per ASTM E155.", disposition: "scrap", estimatedCost: 180000, actualCost: 180000, qipRef: "QIP-2002", poRef: "PO-2026-10456", grnRef: "GRN-2026-8612", rcaCategory: "method", rcaSummary: "Casting pour temperature 50°C below optimal — gas evolution during solidification caused porosity.", capaCount: 4, ageDays: 4, daysToClose: null, owner: "P. Singh", closedDate: null, notes: "First article failed — production held pending FAI re-qualification." },
  { id: "NCR-2026-1004", title: "Caliper Seal Leakage", partNo: "BRT-CAL-4001", partDescription: "Brake Caliper Assembly", supplierName: "BrakeTech Industries", warehouse: "Chennai Hub", source: "in-process", severity: "critical", status: "verification", discoveryDate: "2026-07-15", discoveryBy: "R. Krishnan", lotSize: 400, qtyAffected: 25, qtyDefective: 4, defectType: "Seal Leakage", defectDescription: "Pressure test failed on 4 of 25 calipers — leakage at primary seal at 0.8 bar (spec: hold at 1.1 bar).", disposition: "rework", estimatedCost: 45000, actualCost: 38000, qipRef: "QIP-2003", poRef: "PO-2026-10523", grnRef: "GRN-2026-8421", rcaCategory: "material", rcaSummary: "O-ring supplier batch had hardness below spec (60 Shore A vs 70±5).", capaCount: 3, ageDays: 11, daysToClose: null, owner: "R. Krishnan", closedDate: null, notes: "Verification of effectiveness in progress — 30-day monitoring period." },
  { id: "NCR-2026-1005", title: "Shock Absorber Damping Force Variation", partNo: "SHK-ABS-5001", partDescription: "Shock Absorber — Rear", supplierName: "Suspension Systems Co", warehouse: "Delhi NCR Hub", source: "incoming-inspection", severity: "major", status: "closed", discoveryDate: "2026-06-28", discoveryBy: "M. Reddy", lotSize: 600, qtyAffected: 20, qtyDefective: 3, defectType: "Damping Force Variation", defectDescription: "Damping force at 0.3 m/s varied 18% from nominal (spec: ≤10%).", disposition: "use-as-is", estimatedCost: 12000, actualCost: 9500, qipRef: "QIP-2004", poRef: "PO-2026-10678", grnRef: "GRN-2026-8234", rcaCategory: "measurement", rcaSummary: "Test rig calibration drifted — recalibrated to NIST traceable standard.", capaCount: 2, ageDays: 0, daysToClose: 14, owner: "M. Reddy", closedDate: "2026-07-12", notes: "Closed — effectiveness verified after 30-day monitoring." },
  { id: "NCR-2026-1006", title: "Li-Ion Battery Thermal Anomaly", partNo: "BAT-LI-6001", partDescription: "Li-Ion Battery Pack 48V", supplierName: "PowerCell Energy", warehouse: "Bengaluru Hub", source: "incoming-inspection", severity: "critical", status: "capa-open", discoveryDate: "2026-07-19", discoveryBy: "T. Bose", lotSize: 130, qtyAffected: 13, qtyDefective: 2, defectType: "Thermal Runaway Risk", defectDescription: "UN38.3 thermal test anomaly — 2 of 13 samples showed 8°C temperature rise above spec during discharge.", disposition: "scrap", estimatedCost: 250000, actualCost: 0, qipRef: "QIP-2005", poRef: "PO-2026-10789", grnRef: "GRN-2026-8712", rcaCategory: "design", rcaSummary: "BMS firmware logic error in cell balancing algorithm — over-discharge of cell #4.", capaCount: 5, ageDays: 7, daysToClose: null, owner: "T. Bose", closedDate: null, notes: "Critical safety — recall initiated for in-field units. FDA-style investigation underway." },
  { id: "NCR-2026-1007", title: "Tire Bead Defect", partNo: "TIR-ALL-7001", partDescription: "All-Season Tire 215/55R17", supplierName: "MRF Tyres Ltd", warehouse: "Mumbai West DC", source: "incoming-inspection", severity: "minor", status: "closed", discoveryDate: "2026-06-15", discoveryBy: "K. Nair", lotSize: 1000, qtyAffected: 32, qtyDefective: 2, defectType: "Bead Defect", defectDescription: "Bead imperfection visible on 2 of 32 sampled tires — visual only, no leak detected.", disposition: "use-as-is", estimatedCost: 4500, actualCost: 4500, qipRef: "QIP-2006", poRef: "PO-2026-10845", grnRef: "GRN-2026-8167", rcaCategory: "method", rcaSummary: "Curing press mold release agent buildup — process updated to require mold cleaning every 50 cycles.", capaCount: 1, ageDays: 0, daysToClose: 8, owner: "K. Nair", closedDate: "2026-06-23", notes: "Closed — no customer complaints received post-implementation." },
  { id: "NCR-2026-1008", title: "Wiring Harness Continuity Fail", partNo: "WIR-HRN-8001", partDescription: "Wiring Harness — Main", supplierName: "Harness Mfg Co", warehouse: "Pune DC", source: "in-process", severity: "major", status: "investigation", discoveryDate: "2026-07-23", discoveryBy: "A. Mehta", lotSize: 250, qtyAffected: 25, qtyDefective: 5, defectType: "Continuity Fail", defectDescription: "Open circuit detected on pin 14 of connector C2 — 5 of 25 harnesses affected.", disposition: "rework", estimatedCost: 18000, actualCost: 0, qipRef: "QIP-2007", poRef: "PO-2026-10923", grnRef: "GRN-2026-8567", rcaCategory: "manpower", rcaSummary: "Crimping machine operator error — new operator did not verify crimp height gauge setting.", capaCount: 2, ageDays: 3, daysToClose: null, owner: "A. Mehta", closedDate: null, notes: "Operator retraining underway. 100% continuity re-test on hold lot." },
  { id: "NCR-2026-1009", title: "Engine Bolt Tensile Fail", partNo: "BLT-EN-9001", partDescription: "Engine Mounting Bolt M12", supplierName: "Fasteners India Ltd", warehouse: "Chennai Hub", source: "incoming-inspection", severity: "critical", status: "closed", discoveryDate: "2026-06-10", discoveryBy: "S. Iyer", lotSize: 5000, qtyAffected: 50, qtyDefective: 7, defectType: "Tensile Strength Below Spec", defectDescription: "Tensile test failed at 850 MPa vs spec ≥1000 MPa on 7 of 50 sampled bolts.", disposition: "return-to-vendor", estimatedCost: 62000, actualCost: 65000, qipRef: "QIP-2008", poRef: "PO-2026-11012", grnRef: "GRN-2026-8123", rcaCategory: "material", rcaSummary: "Heat treat lot certificate falsified — actual heat number did not match certificate.", capaCount: 4, ageDays: 0, daysToClose: 22, owner: "S. Iyer", closedDate: "2026-07-02", notes: "Supplier probation — 100% inspection for 90 days. Legal review initiated." },
  { id: "NCR-2026-1010", title: "Synthetic Oil Viscosity Out of Range", partNo: "OIL-SYN-1001", partDescription: "Synthetic Oil 5W-30 — 1L", supplierName: "Lubricants India", warehouse: "Kolkata East Hub", source: "incoming-inspection", severity: "minor", status: "closed", discoveryDate: "2026-06-05", discoveryBy: "V. Gupta", lotSize: 1300, qtyAffected: 13, qtyDefective: 1, defectType: "Viscosity Out of Range", defectDescription: "Kinematic viscosity at 100°C measured 10.8 cSt vs spec 11.0-12.5 cSt on 1 of 13 samples.", disposition: "use-as-is", estimatedCost: 2500, actualCost: 2500, qipRef: "QIP-2009", poRef: "PO-2026-11123", grnRef: "GRN-2026-8234", rcaCategory: "measurement", rcaSummary: "Viscometer calibration drift — recalibrated to NIST standard. Re-test passed.", capaCount: 1, ageDays: 0, daysToClose: 5, owner: "V. Gupta", closedDate: "2026-06-10", notes: "Closed quickly — measurement error, not material defect." },
  { id: "NCR-2026-1011", title: "Windshield Optical Distortion", partNo: "GLS-WND-1101", partDescription: "Windshield Glass — Laminated", supplierName: "AIS Glass Solutions", warehouse: "Delhi NCR Hub", source: "customer-complaint", severity: "critical", status: "open", discoveryDate: "2026-07-25", discoveryBy: "Customer (Dealer)", lotSize: 1, qtyAffected: 1, qtyDefective: 1, defectType: "Optical Distortion", defectDescription: "Customer complaint — driver-side windshield has visible optical distortion in primary vision zone.", disposition: "reject", estimatedCost: 35000, actualCost: 0, qipRef: "QIP-2010", poRef: "PO-2026-11234", grnRef: "GRN-2026-8567", rcaCategory: "method", rcaSummary: "Investigation pending — initial review suggests autoclave pressure deviation during lamination.", capaCount: 0, ageDays: 1, daysToClose: null, owner: "T. Bose", closedDate: null, notes: "Customer escalation — replaced under warranty. Investigation in progress." },
  { id: "NCR-2026-1012", title: "Radiator Cap Pressure Fail", partNo: "RAD-CAB-1201", partDescription: "Radiator Cap — Pressure 1.1 bar", supplierName: "Cooling Systems Co", warehouse: "Chennai Hub", source: "incoming-inspection", severity: "major", status: "verification", discoveryDate: "2026-07-10", discoveryBy: "M. Reddy", lotSize: 320, qtyAffected: 32, qtyDefective: 5, defectType: "Pressure Retention Fail", defectDescription: "Cap failed to hold 1.1 bar — relief valve opened at 0.9 bar on 5 of 32 samples.", disposition: "rework", estimatedCost: 22000, actualCost: 18000, qipRef: "QIP-2011", poRef: "PO-2026-11345", grnRef: "GRN-2026-8456", rcaCategory: "material", rcaSummary: "Spring tension below spec — vendor changed spring supplier without PPAP notification.", capaCount: 3, ageDays: 16, daysToClose: null, owner: "M. Reddy", closedDate: null, notes: "Verification — 60-day effectiveness monitoring on new spring supplier." },
  { id: "NCR-2026-1013", title: "Air Filter Dust Efficiency Below Spec", partNo: "FIL-AIR-1301", partDescription: "Air Filter Element — High Flow", supplierName: "Filtration Tech Pvt Ltd", warehouse: "Pune DC", source: "supplier-audit", severity: "major", status: "capa-open", discoveryDate: "2026-07-12", discoveryBy: "K. Nair (Audit)", lotSize: 2500, qtyAffected: 250, qtyDefective: 38, defectType: "Dust Efficiency Below Spec", defectDescription: "ISO 5011 dust efficiency test showed 99.2% vs spec ≥99.5% on 38 of 250 samples.", disposition: "return-to-vendor", estimatedCost: 48000, actualCost: 0, qipRef: "QIP-2012", poRef: "PO-2026-11456", grnRef: "GRN-2026-8789", rcaCategory: "material", rcaSummary: "Filter media supplier changed paper density from 80 g/m² to 75 g/m² — supplier audit revealed unapproved change.", capaCount: 4, ageDays: 14, daysToClose: null, owner: "K. Nair", closedDate: null, notes: "QIP-2012 suspended pending supplier corrective action. New supplier qualification underway." },
  { id: "NCR-2026-1014", title: "Spark Plug Gap Variation", partNo: "SPK-PLG-1401", partDescription: "Spark Plug Iridium Tip", supplierName: "NGK Spark Plugs", warehouse: "Bengaluru Hub", source: "final-inspection", severity: "minor", status: "closed", discoveryDate: "2026-06-20", discoveryBy: "A. Mehta", lotSize: 5000, qtyAffected: 50, qtyDefective: 3, defectType: "Gap Variation", defectDescription: "Gap measured 0.95mm vs spec 1.0±0.05mm on 3 of 50 samples.", disposition: "rework", estimatedCost: 3500, actualCost: 3200, qipRef: "QIP-2013", poRef: "PO-2026-11567", grnRef: "GRN-2026-8345", rcaCategory: "machine", rcaSummary: "Gap-setting machine indexing error — recalibrated and verified.", capaCount: 1, ageDays: 0, daysToClose: 7, owner: "A. Mehta", closedDate: "2026-06-27", notes: "Closed — effectiveness verified after 30-day SPC monitoring." },
  { id: "NCR-2026-1015", title: "Clutch Assembly FAI Fail", partNo: "CLT-ASB-1501", partDescription: "Clutch Assembly — Manual", supplierName: "Clutch Masters India", warehouse: "Chennai Hub", source: "first-article", severity: "major", status: "investigation", discoveryDate: "2026-07-24", discoveryBy: "R. Krishnan", lotSize: 13, qtyAffected: 13, qtyDefective: 2, defectType: "Torque Capacity Below Spec", defectDescription: "First article — torque capacity 180 Nm vs spec ≥210 Nm on 2 of 13 samples tested.", disposition: "reject", estimatedCost: 28000, actualCost: 0, qipRef: "QIP-2014", poRef: "PO-2026-11678", grnRef: "GRN-2026-8890", rcaCategory: "design", rcaSummary: "Friction material coefficient below expected — design review needed to verify material spec.", capaCount: 2, ageDays: 2, daysToClose: null, owner: "R. Krishnan", closedDate: null, notes: "First article rejected — production pending design review." },
  { id: "NCR-2026-1016", title: "Helmet Shell Impact Test Fail", partNo: "HLM-CVR-1601", partDescription: "Helmet Shell — DOT Certified", supplierName: "Safety Gear Ltd", warehouse: "Mumbai West DC", source: "internal-audit", severity: "critical", status: "cancelled", discoveryDate: "2026-05-10", discoveryBy: "V. Gupta (Audit)", lotSize: 80, qtyAffected: 8, qtyDefective: 2, defectType: "Impact Test Fail", defectDescription: "DOT impact test failed on 2 of 8 samples — shell crack at impact point.", disposition: "scrap", estimatedCost: 15000, actualCost: 15000, qipRef: "QIP-2015", poRef: "PO-2026-11789", grnRef: "GRN-2026-8123", rcaCategory: "design", rcaSummary: "QIP superseded by HLM-CVR-1602 with updated DOT-2026 spec — investigation cancelled, superseded.", capaCount: 0, ageDays: 0, daysToClose: null, owner: "T. Bose", closedDate: "2026-06-15", notes: "NCR cancelled — QIP-2015 obsolete, superseded by QIP-2016 for new helmet shell." },
]

const NCRS: NonConformanceReport[] = NCR_SEEDS.map((s) => {
  const seed = s.id
  return {
    ...s,
    capaList: genCAPA(seed, s.capaCount),
    approvals: genApprovals(seed),
    reportDate: s.discoveryDate,
  }
})

// Static analytics
const NCR_TREND_6M = [
  { month: "Feb", opened: 8, closed: 7 },
  { month: "Mar", opened: 6, closed: 8 },
  { month: "Apr", opened: 9, closed: 6 },
  { month: "May", opened: 5, closed: 7 },
  { month: "Jun", opened: 7, closed: 9 },
  { month: "Jul", opened: 11, closed: 5 },
]

const DEFECT_TYPE_PARETO = [
  { defect: "Hardness Below",     count: 12, color: "#ef4444" },
  { defect: "Dimensional OOT",    count: 10, color: "#ef4444" },
  { defect: "Seal Leakage",       count: 8,  color: "#f59e0b" },
  { defect: "Continuity Fail",    count: 7,  color: "#f59e0b" },
  { defect: "Casting Porosity",   count: 5,  color: "#f59e0b" },
  { defect: "Surface Defect",     count: 5,  color: "#3b82f6" },
  { defect: "Pressure Fail",      count: 4,  color: "#3b82f6" },
  { defect: "Optical Distortion", count: 3,  color: "#8b5cf6" },
]

const STATUS_TABS: { value: NCRStatus | "all" | "open"; label: string; filter: (n: NonConformanceReport) => boolean }[] = [
  { value: "all",          label: "All",          filter: () => true },
  { value: "open",         label: "Open",         filter: (n) => n.status === "open" },
  { value: "investigation",label: "Investigation",filter: (n) => n.status === "investigation" },
  { value: "containment",  label: "Containment",  filter: (n) => n.status === "containment" },
  { value: "capa-open",    label: "CAPA Open",    filter: (n) => n.status === "capa-open" },
  { value: "verification", label: "Verification", filter: (n) => n.status === "verification" },
  { value: "closed",       label: "Closed",       filter: (n) => n.status === "closed" },
  { value: "cancelled",    label: "Cancelled",    filter: (n) => n.status === "cancelled" },
]

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────

function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)} K`
  return `₹${value}`
}

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
  color: "blue" | "emerald" | "amber" | "violet" | "rose" | "slate" | "orange"
  index: number
}

const KPI_COLORS: Record<string, { bar: string; bg: string; text: string; bubble: string }> = {
  blue:    { bar: "from-blue-500 to-blue-700",     bg: "bg-blue-50",     text: "text-blue-700",     bubble: "bg-blue-200/40" },
  emerald: { bar: "from-emerald-500 to-emerald-700", bg: "bg-emerald-50", text: "text-emerald-700", bubble: "bg-emerald-200/40" },
  amber:   { bar: "from-amber-500 to-amber-700",   bg: "bg-amber-50",    text: "text-amber-700",    bubble: "bg-amber-200/40" },
  violet:  { bar: "from-violet-500 to-violet-700", bg: "bg-violet-50",   text: "text-violet-700",   bubble: "bg-violet-200/40" },
  rose:    { bar: "from-rose-500 to-rose-700",     bg: "bg-rose-50",     text: "text-rose-700",     bubble: "bg-rose-200/40" },
  slate:   { bar: "from-slate-500 to-slate-700",   bg: "bg-slate-50",    text: "text-slate-700",    bubble: "bg-slate-200/40" },
  orange:  { bar: "from-orange-500 to-orange-700", bg: "bg-orange-50",   text: "text-orange-700",   bubble: "bg-orange-200/40" },
}

function KPIBox({ title, value, subValue, trend, trendLabel, icon: Icon, color, index }: KPICardProps) {
  const c = KPI_COLORS[color]
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Activity
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-slate-500"
  return (
    <Card
      className={cn("ncr-kpi-enter relative overflow-hidden border-t-0 pt-0", c.bg, "border", "border-slate-200")}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={cn("h-1.5 w-full bg-gradient-to-r", c.bar)} />
      <CardContent className="p-4 relative">
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

export function NonConformanceReportView() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<NCRStatus | "all" | "open">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sourceFilter, setSourceFilter] = useState<NCRSource | "all">("all")
  const [severityFilter, setSeverityFilter] = useState<NCRSeverity | "all">("all")
  const [selectedNCR, setSelectedNCR] = useState<NonConformanceReport | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredNCRs = useMemo(() => {
    return NCRS.filter((n) => {
      const tab = STATUS_TABS.find((t) => t.value === activeTab)
      if (!tab?.filter(n)) return false
      if (sourceFilter !== "all" && n.source !== sourceFilter) return false
      if (severityFilter !== "all" && n.severity !== severityFilter) return false
      if (searchQuery) {
        const s = searchQuery.toLowerCase()
        return (
          n.id.toLowerCase().includes(s) ||
          n.title.toLowerCase().includes(s) ||
          n.partNo.toLowerCase().includes(s) ||
          n.supplierName.toLowerCase().includes(s) ||
          n.defectType.toLowerCase().includes(s)
        )
      }
      return true
    })
  }, [activeTab, searchQuery, sourceFilter, severityFilter])

  const kpis = useMemo(() => {
    const total = NCRS.length
    const open = NCRS.filter((n) => ["open", "investigation", "containment", "capa-open", "verification"].includes(n.status)).length
    const closed = NCRS.filter((n) => n.status === "closed").length
    const critical = NCRS.filter((n) => n.severity === "critical").length
    const totalEstCost = NCRS.reduce((s, n) => s + n.estimatedCost, 0)
    const totalActualCost = NCRS.reduce((s, n) => s + n.actualCost, 0)
    const openNCRAging = NCRS.filter((n) => n.status !== "closed" && n.status !== "cancelled")
    const avgAge = openNCRAging.length > 0
      ? openNCRAging.reduce((s, n) => s + n.ageDays, 0) / openNCRAging.length
      : 0
    return { total, open, closed, critical, totalEstCost, totalActualCost, avgAge }
  }, [])

  const sourceBreakdown = useMemo(() => {
    const groups: Record<NCRSource, number> = {
      "incoming-inspection": 0,
      "in-process": 0,
      "customer-complaint": 0,
      "internal-audit": 0,
      "supplier-audit": 0,
      "final-inspection": 0,
      "first-article": 0,
    }
    NCRS.forEach((n) => { groups[n.source] += 1 })
    return (Object.entries(groups) as [NCRSource, number][])
      .map(([k, v]) => ({
        name: SOURCE_META[k].label,
        value: v,
        color: SOURCE_META[k].pieColor,
      }))
      .filter((e) => e.value > 0)
  }, [])

  const severityBreakdown = useMemo(() => {
    const groups: Record<NCRSeverity, number> = { critical: 0, major: 0, minor: 0 }
    NCRS.forEach((n) => { groups[n.severity] += 1 })
    return (Object.entries(groups) as [NCRSeverity, number][])
      .map(([k, v]) => ({
        name: SEVERITY_META[k].label,
        value: v,
        color: SEVERITY_META[k].pieColor,
      }))
  }, [])

  const rcaBreakdown = useMemo(() => {
    const groups: Record<RCACategory, number> = {
      material: 0, machine: 0, method: 0, manpower: 0, measurement: 0, environment: 0, design: 0,
    }
    NCRS.forEach((n) => { groups[n.rcaCategory] += 1 })
    return (Object.entries(groups) as [RCACategory, number][])
      .map(([k, v]) => ({
        name: RCA_META[k].label,
        value: v,
        color: RCA_META[k].pieColor,
      }))
      .filter((e) => e.value > 0)
  }, [])

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    STATUS_TABS.forEach((t) => {
      counts[t.value] = NCRS.filter(t.filter).length
    })
    return counts
  }, [])

  function openDetail(ncr: NonConformanceReport) {
    setSelectedNCR(ncr)
    setDrawerOpen(true)
  }

  function handleExport() {
    const rows = filteredNCRs.map((n) => ({
      "NCR ID": n.id,
      "Title": n.title,
      "Part No": n.partNo,
      "Description": n.partDescription,
      "Supplier": n.supplierName,
      "Warehouse": n.warehouse,
      "Source": SOURCE_META[n.source].label,
      "Severity": SEVERITY_META[n.severity].label,
      "Status": STATUS_META[n.status].label,
      "Discovery Date": n.discoveryDate,
      "Lot Size": n.lotSize,
      "Qty Affected": n.qtyAffected,
      "Qty Defective": n.qtyDefective,
      "Defect Type": n.defectType,
      "Disposition": DISPOSITION_META[n.disposition].label,
      "Estimated Cost (INR)": n.estimatedCost,
      "Actual Cost (INR)": n.actualCost,
      "QIP Ref": n.qipRef,
      "PO Ref": n.poRef,
      "GRN Ref": n.grnRef,
      "RCA Category": RCA_META[n.rcaCategory].label,
      "Age (days)": n.ageDays,
      "Days to Close": n.daysToClose ?? "",
      "Owner": n.owner,
    }))
    exportToCSV(rows, `non-conformance-reports-${new Date().toISOString().slice(0, 10)}`)
    toast.success("Export complete", `${filteredNCRs.length} NCR records exported to CSV`)
  }

  function handleRefresh() {
    toast.info("Refreshing", "Non-conformance reports reloaded from latest data")
  }

  function handleNewNCR() {
    toast.success("New NCR", "Started new Non-Conformance Report — opening wizard")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Non-Conformance Reports"
        description="NCR lifecycle — defect discovery, root cause analysis (5-Why / Fishbone), CAPA tracking, disposition, and approval workflow. Links QIP defects to supplier scorecard impact."
      />

      {/* KPI ROW */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <KPIBox title="Total NCRs" value={String(kpis.total)} subValue="All time" trend="up" trendLabel="+3 this month" icon={FileWarning} color="slate" index={0} />
        <KPIBox title="Open NCRs" value={String(kpis.open)} subValue="In workflow" trend="up" trendLabel="Action required" icon={AlertOctagon} color="rose" index={1} />
        <KPIBox title="Closed (30d)" value={String(kpis.closed)} subValue="Effectiveness verified" trend="up" trendLabel="+1 vs last month" icon={CheckCircle2} color="emerald" index={2} />
        <KPIBox title="Critical" value={String(kpis.critical)} subValue="Require escalation" trend="down" trendLabel="-1 vs last week" icon={ShieldAlert} color="orange" index={3} />
        <KPIBox title="Total Cost Impact" value={formatINR(kpis.totalActualCost + kpis.totalEstCost)} subValue={`Actual: ${formatINR(kpis.totalActualCost)}`} trend="up" trendLabel="Est. pending" icon={CircleDollarSign} color="violet" index={4} />
        <KPIBox title="Avg Aging (Open)" value={`${kpis.avgAge.toFixed(1)} d`} subValue="Days open" trend="down" trendLabel="-2.1 d MoM" icon={Timer} color="amber" index={5} />
      </div>

      {/* CHARTS ROW */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="ncr-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" /> 6-Month NCR Trend
                </CardTitle>
                <CardDescription className="text-xs mt-1">Opened vs Closed NCRs per month</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">LAST 6M</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <AreaChart data={NCR_TREND_6M} width={520} height={240} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ncrOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ncrClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Area type="monotone" dataKey="opened" stroke="#ef4444" strokeWidth={2.5} fill="url(#ncrOpened)" name="Opened" />
              <Area type="monotone" dataKey="closed" stroke="#10b981" strokeWidth={2.5} fill="url(#ncrClosed)" name="Closed" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </CardContent>
        </Card>

        <Card className="ncr-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> NCRs by Severity
                </CardTitle>
                <CardDescription className="text-xs mt-1">Distribution of NCRs across severity tiers</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">3 TIERS</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <PieChart width={520} height={240}>
              <Pie
                data={severityBreakdown}
                cx={180}
                cy={120}
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {severityBreakdown.map((entry, idx) => (
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

        <Card className="ncr-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bug className="h-4 w-4 text-rose-600" /> Defect Pareto — Top 8
                </CardTitle>
                <CardDescription className="text-xs mt-1">Most common defect types across all NCRs</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">PARETO</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart data={DEFECT_TYPE_PARETO} width={520} height={240} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis type="category" dataKey="defect" tick={{ fontSize: 11 }} stroke="#94a3b8" width={120} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {DEFECT_TYPE_PARETO.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </CardContent>
        </Card>

        <Card className="ncr-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-violet-600" /> Root Cause (Fishbone 6M)
                </CardTitle>
                <CardDescription className="text-xs mt-1">NCRs grouped by root cause category (Material/Machine/Method/Manpower/Measurement/Environment/Design)</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-violet-50 text-violet-700 border-violet-200">6M RCA</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart data={rcaBreakdown} width={520} height={240} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {rcaBreakdown.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS + TABS + TABLE */}
      <Card className="ncr-table-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileWarning className="h-4 w-4 text-blue-600" /> NCR Master List
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {filteredNCRs.length} of {NCRS.length} reports · Click a row to view root cause analysis, CAPA, disposition, and approvals
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search NCR / part / supplier / defect..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 w-64 ncr-search-focus"
                />
              </div>
              <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as NCRSource | "all")}>
                <SelectTrigger className="h-8 w-44 text-xs">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="incoming-inspection">Incoming Inspection</SelectItem>
                  <SelectItem value="in-process">In-Process</SelectItem>
                  <SelectItem value="customer-complaint">Customer Complaint</SelectItem>
                  <SelectItem value="internal-audit">Internal Audit</SelectItem>
                  <SelectItem value="supplier-audit">Supplier Audit</SelectItem>
                  <SelectItem value="final-inspection">Final Inspection</SelectItem>
                  <SelectItem value="first-article">First Article</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as NCRSeverity | "all")}>
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
              <Button variant="outline" size="sm" className="h-8" onClick={handleRefresh}>
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="h-8" onClick={handleExport}>
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
              <Button size="sm" className="h-8 bg-rose-600 hover:bg-rose-700" onClick={handleNewNCR}>
                <FilePlus className="h-3.5 w-3.5 mr-1" /> New NCR
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
                    "ncr-tab-btn inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                    isActive ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "ncr-badge-pop inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold min-w-[18px]",
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-32">NCR ID</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide min-w-[260px]">Title / Part</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-32">Source</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-24">Severity</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-28">Status</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide text-center w-20">Defective</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-28">Disposition</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide text-right w-28">Est. Cost</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide text-center w-16">Age (d)</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-32">Owner</TableHead>
                  <TableHead className="h-9 text-[11px] font-semibold text-slate-600 uppercase tracking-wide text-center w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNCRs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-slate-500 py-10 text-sm">
                      No NCRs match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNCRs.map((ncr, idx) => {
                    const StatusIcon = STATUS_META[ncr.status].icon
                    const SourceIcon = SOURCE_META[ncr.source].icon
                    const SevIcon = SEVERITY_META[ncr.severity].icon
                    const DispIcon = DISPOSITION_META[ncr.disposition].icon
                    const isCritical = ncr.severity === "critical" && ncr.status !== "closed" && ncr.status !== "cancelled"
                    const isWarning = ncr.severity === "major" && ncr.status !== "closed" && ncr.status !== "cancelled"
                    return (
                      <TableRow
                        key={ncr.id}
                        onClick={() => openDetail(ncr)}
                        className={cn(
                          "ncr-row-in cursor-pointer border-slate-100 transition-colors",
                          isCritical
                            ? "ncr-row-critical bg-rose-50/40 hover:bg-rose-50/70"
                            : isWarning
                              ? "ncr-row-warning bg-amber-50/40 hover:bg-amber-50/70"
                              : ncr.status === "closed"
                                ? "opacity-70 hover:bg-slate-50"
                                : "hover:bg-slate-50"
                        )}
                        style={{ animationDelay: `${idx * 25}ms` }}
                      >
                        <TableCell className="py-2.5 text-xs font-mono font-semibold text-slate-700">{ncr.id}</TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-start gap-2.5">
                            <Avatar className="h-8 w-8 rounded-md bg-rose-50 ring-1 ring-inset ring-rose-100">
                              <AvatarFallback className="rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                                {ncr.partNo.split("-")[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-900 truncate">{ncr.title}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{ncr.partNo} · {ncr.supplierName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className={cn("text-[10px] gap-1 h-6", SOURCE_META[ncr.source].bg, SOURCE_META[ncr.source].color, "border-current/20")}>
                            <SourceIcon className="h-3 w-3" />
                            {SOURCE_META[ncr.source].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className={cn("text-[10px] gap-1 h-6", SEVERITY_META[ncr.severity].bg, SEVERITY_META[ncr.severity].color, "border-current/20")}>
                            <SevIcon className="h-3 w-3" />
                            {SEVERITY_META[ncr.severity].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className={cn("text-[10px] gap-1 h-6", STATUS_META[ncr.status].bg, STATUS_META[ncr.status].color, STATUS_META[ncr.status].border, "border")}>
                            <StatusIcon className="h-3 w-3" />
                            {STATUS_META[ncr.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-center">
                          <span className="text-xs font-mono font-bold text-rose-700">{ncr.qtyDefective}</span>
                          <span className="text-[10px] text-slate-500">/{ncr.qtyAffected}</span>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className={cn("text-[10px] gap-1 h-6", DISPOSITION_META[ncr.disposition].bg, DISPOSITION_META[ncr.disposition].color, "border-current/20")}>
                            <DispIcon className="h-3 w-3" />
                            {DISPOSITION_META[ncr.disposition].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-xs font-mono font-semibold text-slate-700">{formatINR(ncr.estimatedCost)}</TableCell>
                        <TableCell className="py-2.5 text-center">
                          {ncr.ageDays === 0 ? (
                            <span className="text-xs text-slate-400">—</span>
                          ) : (
                            <span className={cn("text-xs font-bold tabular-nums", ncr.ageDays > 14 ? "text-rose-700" : ncr.ageDays > 7 ? "text-amber-700" : "text-slate-700")}>
                              {ncr.ageDays}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[9px] bg-slate-100 text-slate-700">
                                {ncr.owner.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-xs text-slate-700 font-medium">{ncr.owner}</div>
                              <div className="text-[10px] text-slate-500">{ncr.warehouse}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-rose-100"
                            onClick={(e) => { e.stopPropagation(); openDetail(ncr) }}
                          >
                            <Eye className="h-3.5 w-3.5 text-rose-600" />
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
      {selectedNCR && (
        <NCRDetailDrawer
          ncr={selectedNCR}
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
  ncr: NonConformanceReport
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DrawerTab = "overview" | "rca" | "capa" | "disposition" | "approvals"

const DRAWER_TABS: { value: DrawerTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "overview",    label: "Overview",        icon: Activity },
  { value: "rca",         label: "Root Cause (RCA)",icon: Target },
  { value: "capa",        label: "CAPA Actions",    icon: ListChecks },
  { value: "disposition", label: "Disposition",     icon: ArrowRightCircle },
  { value: "approvals",   label: "Approvals",       icon: FileCheck },
]

function NCRDetailDrawer({ ncr, open, onOpenChange }: DetailDrawerProps) {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview")

  const StatusIcon = STATUS_META[ncr.status].icon
  const SourceIcon = SOURCE_META[ncr.source].icon
  const SevIcon = SEVERITY_META[ncr.severity].icon
  const DispIcon = DISPOSITION_META[ncr.disposition].icon

  const capaStats = useMemo(() => {
    const total = ncr.capaList.length
    const completed = ncr.capaList.filter((c) => c.status === "effective").length
    const inProgress = ncr.capaList.filter((c) => ["in-progress", "implemented", "verified"].includes(c.status)).length
    const open = ncr.capaList.filter((c) => c.status === "open").length
    const failed = ncr.capaList.filter((c) => c.status === "failed").length
    const avgProgress = total > 0 ? ncr.capaList.reduce((s, c) => s + c.progressPct, 0) / total : 0
    return { total, completed, inProgress, open, failed, avgProgress }
  }, [ncr])

  function handleExport() {
    toast.success("Export complete", `${ncr.id} details exported to PDF`)
  }
  function handleApprove() {
    toast.success("NCR Approved", `${ncr.id} approved — moving to next workflow stage`)
  }
  function handleReject() {
    toast.error("NCR Rejected", `${ncr.id} rejected — returned to originator for rework`)
  }
  function handleClose() {
    toast.success("NCR Closed", `${ncr.id} closed — effectiveness verified, supplier scorecard updated`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="ncr-drawer-sheen w-full sm:max-w-5xl overflow-y-auto p-0">
        {/* Header */}
        <div className="ncr-drawer-header sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <SheetHeader className="space-y-1 p-0">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle className="text-lg font-bold text-slate-900 truncate">{ncr.title}</SheetTitle>
                  <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", STATUS_META[ncr.status].bg, STATUS_META[ncr.status].color, STATUS_META[ncr.status].border, "border")}>
                    <StatusIcon className="h-3 w-3" />
                    {STATUS_META[ncr.status].label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", SOURCE_META[ncr.source].bg, SOURCE_META[ncr.source].color, "border-current/20")}>
                    <SourceIcon className="h-3 w-3" />
                    {SOURCE_META[ncr.source].label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", SEVERITY_META[ncr.severity].bg, SEVERITY_META[ncr.severity].color, "border-current/20")}>
                    <SevIcon className="h-3 w-3" />
                    {SEVERITY_META[ncr.severity].label}
                  </Badge>
                </div>
                <SheetDescription className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                  <span className="font-mono">{ncr.id}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono">{ncr.partNo}</span>
                  <span className="text-slate-300">·</span>
                  <span>{ncr.partDescription}</span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{ncr.warehouse}</span>
                </SheetDescription>
              </div>
            </div>

            {/* HERO STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <div className="ncr-stat-enter rounded-md bg-slate-50 border border-slate-200 px-3 py-2" style={{ animationDelay: "0ms" }}>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                  <Hash className="h-3 w-3" /> Defective
                </div>
                <div className="text-lg font-bold text-rose-700 tabular-nums">{ncr.qtyDefective}</div>
                <div className="text-[10px] text-slate-500">of {ncr.qtyAffected} sampled</div>
              </div>
              <div className="ncr-stat-enter rounded-md bg-slate-50 border border-slate-200 px-3 py-2" style={{ animationDelay: "80ms" }}>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                  <CircleDollarSign className="h-3 w-3" /> Cost Impact
                </div>
                <div className="text-lg font-bold text-violet-700 tabular-nums">{formatINR(ncr.actualCost || ncr.estimatedCost)}</div>
                <div className="text-[10px] text-slate-500">{ncr.actualCost > 0 ? "actual" : "estimated"}</div>
              </div>
              <div className="ncr-stat-enter rounded-md bg-slate-50 border border-slate-200 px-3 py-2" style={{ animationDelay: "160ms" }}>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                  <Timer className="h-3 w-3" /> Aging
                </div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">{ncr.ageDays === 0 ? "—" : `${ncr.ageDays}d`}</div>
                <div className="text-[10px] text-slate-500">{ncr.daysToClose ? `closed in ${ncr.daysToClose}d` : "open"}</div>
              </div>
              <div className="ncr-stat-enter rounded-md bg-slate-50 border border-slate-200 px-3 py-2" style={{ animationDelay: "240ms" }}>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                  <ListChecks className="h-3 w-3" /> CAPA
                </div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">{ncr.capaList.length}</div>
                <div className="text-[10px] text-slate-500">{capaStats.completed} effective</div>
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
              const tabCount = t.value === "capa" ? ncr.capaList.length : t.value === "approvals" ? ncr.approvals.length : null
              return (
                <button
                  key={t.value}
                  onClick={() => setActiveTab(t.value)}
                  className={cn(
                    "ncr-tab-btn inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                    isActive ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
        <div className="ncr-body-enter px-6 py-5 space-y-5">
          {activeTab === "overview" && <OverviewTab ncr={ncr} />}
          {activeTab === "rca" && <RCATab ncr={ncr} />}
          {activeTab === "capa" && <CAPATab ncr={ncr} stats={capaStats} />}
          {activeTab === "disposition" && <DispositionTab ncr={ncr} />}
          {activeTab === "approvals" && <ApprovalsTab ncr={ncr} />}
        </div>

        <SheetFooter className="border-t border-slate-200 px-6 py-3 bg-slate-50">
          <div className="flex items-center justify-between w-full gap-2">
            <div className="text-[11px] text-slate-500">
              <span className="font-medium">Discovered:</span> {ncr.discoveryDate} by {ncr.discoveryBy}
              {ncr.closedDate && <> · <span className="font-medium">Closed:</span> {ncr.closedDate}</>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8" onClick={handleExport}>
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
              {ncr.status === "verification" && (
                <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700" onClick={handleClose}>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Close NCR
                </Button>
              )}
              {(ncr.status === "open" || ncr.status === "investigation") && (
                <>
                  <Button variant="outline" size="sm" className="h-8 text-rose-700 border-rose-300 hover:bg-rose-50" onClick={handleReject}>
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                  <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={handleApprove}>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                </>
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

function OverviewTab({ ncr }: { ncr: NonConformanceReport }) {
  return (
    <div className="space-y-4">
      {/* TOP: Defect Details + Traceability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="ncr-card-enter border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <Bug className="h-3.5 w-3.5 text-rose-600" /> Defect Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Defect Type</span>
              <span className="text-xs font-medium text-slate-800">{ncr.defectType}</span>
            </div>
            <Separator />
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Description</span>
              <p className="text-xs text-slate-700 leading-relaxed">{ncr.defectDescription}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[10px] uppercase text-slate-500">Lot Size</div>
                <div className="text-sm font-bold text-slate-800 tabular-nums">{ncr.lotSize}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-500">Sampled</div>
                <div className="text-sm font-bold text-slate-800 tabular-nums">{ncr.qtyAffected}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-rose-700">Defective</div>
                <div className="text-sm font-bold text-rose-700 tabular-nums">{ncr.qtyDefective}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ncr-card-enter border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <History className="h-3.5 w-3.5 text-violet-600" /> Traceability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">QIP Reference</span>
              <span className="text-xs font-mono text-blue-700 underline cursor-pointer">{ncr.qipRef}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">PO Reference</span>
              <span className="text-xs font-mono text-blue-700 underline cursor-pointer">{ncr.poRef}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">GRN Reference</span>
              <span className="text-xs font-mono text-blue-700 underline cursor-pointer">{ncr.grnRef}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Factory className="h-3 w-3" /> Supplier</span>
              <span className="text-xs font-medium text-slate-800">{ncr.supplierName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Building2 className="h-3 w-3" /> Warehouse</span>
              <span className="text-xs font-medium text-slate-800">{ncr.warehouse}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Discovery By</span>
              <div className="flex items-center gap-1.5">
                <Avatar className="h-5 w-5"><AvatarFallback className="text-[8px] bg-slate-100 text-slate-700">{ncr.discoveryBy.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                <span className="text-xs font-medium text-slate-800">{ncr.discoveryBy}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MID: Cost Analysis + Aging */}
      <Card className="ncr-card-enter border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            <CircleDollarSign className="h-3.5 w-3.5 text-violet-600" /> Cost Impact & Aging
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-md bg-violet-50 border border-violet-200 p-3">
              <div className="text-[10px] uppercase tracking-wide text-violet-700 font-semibold">Estimated Cost</div>
              <div className="text-2xl font-bold text-violet-700 tabular-nums mt-1">{formatINR(ncr.estimatedCost)}</div>
              <div className="text-[10px] text-violet-600 mt-0.5">at discovery</div>
            </div>
            <div className="rounded-md bg-rose-50 border border-rose-200 p-3">
              <div className="text-[10px] uppercase tracking-wide text-rose-700 font-semibold">Actual Cost</div>
              <div className="text-2xl font-bold text-rose-700 tabular-nums mt-1">{formatINR(ncr.actualCost)}</div>
              <div className="text-[10px] text-rose-600 mt-0.5">{ncr.actualCost > 0 ? "to date" : "pending"}</div>
            </div>
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
              <div className="text-[10px] uppercase tracking-wide text-amber-700 font-semibold">Aging</div>
              <div className="text-2xl font-bold text-amber-700 tabular-nums mt-1">{ncr.ageDays === 0 ? "—" : `${ncr.ageDays}d`}</div>
              <div className="text-[10px] text-amber-600 mt-0.5">{ncr.status === "closed" ? "closed" : "since discovery"}</div>
            </div>
            <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
              <div className="text-[10px] uppercase tracking-wide text-emerald-700 font-semibold">Days to Close</div>
              <div className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">{ncr.daysToClose === null ? "—" : `${ncr.daysToClose}d`}</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">{ncr.closedDate ? `closed ${ncr.closedDate}` : "open"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NOTES */}
      <Card className="ncr-card-enter border-amber-200 bg-amber-50/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 uppercase tracking-wide">
            <AlertTriangle className="h-3.5 w-3.5" /> NCR Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-xs text-slate-700 leading-relaxed">{ncr.notes}</p>
        </CardContent>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// TAB: ROOT CAUSE ANALYSIS
// ──────────────────────────────────────────────────────────

function RCATab({ ncr }: { ncr: NonConformanceReport }) {
  const RCAIcon = RCA_META[ncr.rcaCategory].icon
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Root Cause Analysis</h3>
          <p className="text-[11px] text-slate-500">Fishbone (Ishikawa) 6M categorization — Material/Machine/Method/Manpower/Measurement/Environment/Design</p>
        </div>
        <Badge variant="outline" className={cn("text-[10px] gap-1 h-6", RCA_META[ncr.rcaCategory].bg, RCA_META[ncr.rcaCategory].color, "border-current/20")}>
          <RCAIcon className="h-3 w-3" />
          {RCA_META[ncr.rcaCategory].label}
        </Badge>
      </div>

      <Card className="ncr-card-enter border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            <Target className="h-3.5 w-3.5 text-violet-600" /> RCA Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 space-y-3">
          <p className="text-sm text-slate-700 leading-relaxed">{ncr.rcaSummary}</p>
          <Separator />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {(Object.entries(RCA_META) as [RCACategory, typeof RCA_META[RCACategory]][]).map(([cat, meta]) => {
              const Icon = meta.icon
              const isActive = cat === ncr.rcaCategory
              return (
                <div
                  key={cat}
                  className={cn(
                    "rounded-md border p-2 text-center transition-all",
                    isActive ? cn(meta.bg, meta.color, "border-current shadow-sm scale-105") : "bg-slate-50 border-slate-200 text-slate-500"
                  )}
                >
                  <Icon className={cn("h-4 w-4 mx-auto mb-1", isActive ? meta.color : "text-slate-400")} />
                  <div className="text-[10px] font-medium">{meta.label}</div>
                  {isActive && <div className="text-[9px] mt-0.5">SELECTED</div>}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="ncr-card-enter border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            <ListChecks className="h-3.5 w-3.5 text-blue-600" /> 5-Why Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 space-y-2">
          {[
            { why: "Why did the defect occur?", ans: "Defective units produced at supplier." },
            { why: "Why were defective units produced?", ans: "Process parameter out of spec at supplier." },
            { why: "Why was the parameter out of spec?", ans: "Equipment drift not detected." },
            { why: "Why wasn't drift detected?", ans: "No SPC monitoring on critical parameter." },
            { why: "Why no SPC monitoring?", ans: "Process FMEA did not identify this failure mode." },
          ].map((item, i) => (
            <div key={i} className="ncr-card-enter rounded-md border border-slate-200 bg-slate-50 p-2.5" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start gap-2">
                <div className="rounded-md bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 mt-0.5">#{i + 1}</div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-800">{item.why}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{item.ans}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// TAB: CAPA ACTIONS
// ──────────────────────────────────────────────────────────

function CAPATab({ ncr, stats }: { ncr: NonConformanceReport; stats: { total: number; completed: number; inProgress: number; open: number; failed: number; avgProgress: number } }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Corrective & Preventive Actions (CAPA)</h3>
          <p className="text-[11px] text-slate-500">{stats.total} actions · {stats.completed} effective · {stats.inProgress} in progress · {stats.open} open · {stats.failed} failed</p>
        </div>
      </div>

      {/* PROGRESS SUMMARY */}
      <Card className="ncr-card-enter border-slate-200">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">Overall CAPA Progress</span>
            <span className="text-sm font-bold text-blue-700 tabular-nums">{stats.avgProgress.toFixed(0)}%</span>
          </div>
          <Progress value={stats.avgProgress} className="h-2" />
        </CardContent>
      </Card>

      {ncr.capaList.length === 0 ? (
        <Card className="ncr-card-enter border-slate-200">
          <CardContent className="pt-6 pb-6 text-center">
            <FileClock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No CAPA actions defined for this NCR.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {ncr.capaList.map((capa, idx) => {
            const StatusIcon = CAPA_STATUS_META[capa.status].icon
            const typeColor = capa.type === "corrective" ? "text-rose-700 bg-rose-50" : "text-blue-700 bg-blue-50"
            return (
              <Card key={capa.id} className="ncr-card-enter border-slate-200" style={{ animationDelay: `${idx * 50}ms` }}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-start gap-3">
                    <div className={cn("rounded-md p-1.5 ring-1 ring-inset", typeColor, "ring-current/20")}>
                      {capa.type === "corrective" ? <Wrench className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold text-slate-700">{capa.id}</span>
                            <Badge variant="outline" className={cn("text-[9px] gap-1 h-4", typeColor, "border-current/20")}>
                              {capa.type === "corrective" ? "CORRECTIVE" : "PREVENTIVE"}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-800 mt-1">{capa.action}</p>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", CAPA_STATUS_META[capa.status].bg, CAPA_STATUS_META[capa.status].color, "border-current/20")}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {CAPA_STATUS_META[capa.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{capa.owner}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due: {capa.dueDate}</span>
                          {capa.verificationDate && (
                            <span className="flex items-center gap-1"><FileCheck className="h-3 w-3" />Verified: {capa.verificationDate}</span>
                          )}
                        </div>
                        <span className="font-semibold tabular-nums">{capa.progressPct}%</span>
                      </div>
                      <Progress value={capa.progressPct} className="h-1.5" />
                      {capa.effectiveness && (
                        <div className={cn(
                          "text-[10px] font-semibold uppercase tracking-wide",
                          capa.effectiveness === "effective" ? "text-emerald-700" : capa.effectiveness === "failed" ? "text-rose-700" : "text-amber-700"
                        )}>
                          Effectiveness: {capa.effectiveness}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// TAB: DISPOSITION
// ──────────────────────────────────────────────────────────

function DispositionTab({ ncr }: { ncr: NonConformanceReport }) {
  const DispIcon = DISPOSITION_META[ncr.disposition].icon
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Disposition Decision</h3>
          <p className="text-[11px] text-slate-500">Final disposition of non-conforming material</p>
        </div>
        <Badge variant="outline" className={cn("text-[10px] gap-1 h-6", DISPOSITION_META[ncr.disposition].bg, DISPOSITION_META[ncr.disposition].color, "border-current/20")}>
          <DispIcon className="h-3 w-3" />
          {DISPOSITION_META[ncr.disposition].label}
        </Badge>
      </div>

      {/* DISPOSITION OPTIONS */}
      <Card className="ncr-card-enter border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            <ArrowRightCircle className="h-3.5 w-3.5 text-blue-600" /> Disposition Options Considered
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(Object.entries(DISPOSITION_META) as [Disposition, typeof DISPOSITION_META[Disposition]][]).map(([disp, meta]) => {
              const Icon = meta.icon
              const isSelected = disp === ncr.disposition
              return (
                <div
                  key={disp}
                  className={cn(
                    "rounded-md border p-3 flex items-start gap-2 transition-all",
                    isSelected ? cn(meta.bg, meta.color, "border-current shadow-sm") : "bg-slate-50 border-slate-200 text-slate-600"
                  )}
                >
                  <Icon className={cn("h-4 w-4 mt-0.5", isSelected ? meta.color : "text-slate-400")} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{meta.label}</span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <p className="text-[10px] mt-0.5 opacity-80">
                      {disp === "use-as-is" && "Accept with deviation note — fit for purpose."}
                      {disp === "rework" && "Repair to meet spec — re-inspect after rework."}
                      {disp === "return-to-vendor" && "Reject lot — return to supplier at their cost."}
                      {disp === "scrap" && "Dispose as scrap — material cannot be recovered."}
                      {disp === "reject" && "Reject entire lot — quarantine and dispose."}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* COST BREAKDOWN */}
      <Card className="ncr-card-enter border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            <CircleDollarSign className="h-3.5 w-3.5 text-violet-600" /> Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Material Cost (scrap value)</span>
            <span className="font-mono font-semibold text-slate-800">{formatINR(Math.round(ncr.estimatedCost * 0.6))}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Labor Cost (rework/inspection)</span>
            <span className="font-mono font-semibold text-slate-800">{formatINR(Math.round(ncr.estimatedCost * 0.25))}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Overhead Cost (handling/transport)</span>
            <span className="font-mono font-semibold text-slate-800">{formatINR(Math.round(ncr.estimatedCost * 0.15))}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Total Estimated</span>
            <span className="font-mono font-bold text-violet-700">{formatINR(ncr.estimatedCost)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Actual Cost</span>
            <span className="font-mono font-bold text-rose-700">{formatINR(ncr.actualCost)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// TAB: APPROVALS
// ──────────────────────────────────────────────────────────

function ApprovalsTab({ ncr }: { ncr: NonConformanceReport }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Approval Workflow</h3>
          <p className="text-[11px] text-slate-500">{ncr.approvals.filter((a) => a.status === "approved").length} of {ncr.approvals.length} approvals received</p>
        </div>
      </div>

      <Card className="ncr-card-enter border-slate-200">
        <CardContent className="pt-4">
          <div className="space-y-3">
            {ncr.approvals.map((appr, idx) => {
              const StatusIcon = appr.status === "approved" ? CheckCircle2 : appr.status === "rejected" ? XCircle : Clock
              const statusColor = appr.status === "approved" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : appr.status === "rejected" ? "text-rose-700 bg-rose-50 border-rose-200" : "text-amber-700 bg-amber-50 border-amber-200"
              return (
                <div key={idx} className="ncr-card-enter relative" style={{ animationDelay: `${idx * 60}ms` }}>
                  {/* Connector line */}
                  {idx < ncr.approvals.length - 1 && (
                    <div className="absolute left-[15px] top-10 bottom-0 w-px bg-slate-200" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className={cn("rounded-full p-1.5 ring-2 ring-white", statusColor)}>
                      <StatusIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[9px] bg-slate-100 text-slate-700">
                              {appr.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-semibold text-slate-800">{appr.name}</div>
                            <div className="text-[10px] text-slate-500">{appr.role}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={cn("text-[10px] gap-1 h-5", statusColor, "border")}>
                            <StatusIcon className="h-2.5 w-2.5" />
                            {appr.status.charAt(0).toUpperCase() + appr.status.slice(1)}
                          </Badge>
                          <div className="text-[10px] text-slate-500 mt-0.5">{appr.date}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1.5 italic">"{appr.comment}"</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
