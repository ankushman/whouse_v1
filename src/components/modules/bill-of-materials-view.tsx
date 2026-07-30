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
  Layers,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  GitBranch,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Phone,
  Mail,
  Calendar,
  Activity,
  IndianRupee,
  Package,
  Wrench,
  Factory,
  FileCheck,
  FileClock,
  FilePlus,
  Hash,
  Percent,
  CircleDollarSign,
  Boxes,
  Building2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  Cpu,
  ListTree,
  History,
  Repeat,
  ShieldCheck,
  PenLine,
  GitCommit,
  Workflow,
  Receipt,
  Wallet,
  Microscope,
  Award,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ============================================================================
// Types
// ============================================================================

type BOMStatus = "draft" | "in-review" | "approved" | "released" | "frozen" | "deprecated" | "obsolete"

type BOMCategory = "finished-good" | "sub-assembly" | "engineered" | "phantom" | "packaging-kit" | "service-kit"

type BOMType = "manufacturing" | "engineering" | "service" | "packaging"

type PartType = "raw-material" | "component" | "sub-assembly" | "fastener" | "consumable" | "packaging" | "service"

interface BOMPart {
  sr: number
  partNo: string
  description: string
  partType: PartType
  uom: string
  qty: number
  unitCost: number
  scrapPct: number
  leadTimeDays: number
  source: "make" | "buy" | "phantom"
  hasSubBOM: boolean
  subBOMId?: string
  totalCost: number
}

interface BOMRevision {
  rev: string
  date: string
  author: string
  approver: string
  status: "approved" | "pending" | "rejected" | "superseded"
  changeDescription: string
  impactedParts: number
  costImpact: number // percent change
  ecnNo: string // Engineering Change Notice
}

interface BOMWhereUsed {
  parentBOMId: string
  parentBOMName: string
  parentCategory: BOMCategory
  qtyPerParent: number
  effectiveDate: string
}

interface CostRollup {
  level: number
  partNo: string
  description: string
  source: "make" | "buy" | "phantom"
  qty: number
  unitCost: number
  extendedCost: number
  scrapCost: number
  laborCost: number
  overheadCost: number
  totalCost: number
  hasChildren: boolean
}

interface BillOfMaterials {
  id: string
  name: string
  description: string
  category: BOMCategory
  type: BOMType
  status: BOMStatus
  revision: string
  parentProductCode: string
  productLine: string
  uom: string
  qtyPerAssembly: number
  totalParts: number
  uniqueParts: number
  levels: number
  standardCost: number
  lastActualCost: number
  costVariancePct: number
  createdBy: string
  createdDate: string
  lastModified: string
  effectiveDate: string
  expiryDate: string | null
  approver: string
  engineeringOwner: string
  manufacturingOwner: string
  ecnCount: number
  lastECN: string
  parts: BOMPart[]
  revisions: BOMRevision[]
  whereUsed: BOMWhereUsed[]
  costRollup: CostRollup[]
  notes: string
}

// ============================================================================
// Mock Data — 16 BOMs
// ============================================================================

const PRODUCTS = [
  { code: "FG-WM-1001", name: "Front Wheel Assembly — Passenger Car", line: "Automotive", cat: "finished-good" as BOMCategory, type: "manufacturing" as BOMType },
  { code: "FG-WM-1002", name: "Rear Wheel Assembly — Passenger Car", line: "Automotive", cat: "finished-good" as BOMCategory, type: "manufacturing" as BOMType },
  { code: "FG-BR-2001", name: "Disc Brake Caliper Assembly", line: "Automotive", cat: "finished-good" as BOMCategory, type: "manufacturing" as BOMType },
  { code: "SA-BR-2002", name: "Brake Pad Sub-Assembly", line: "Automotive", cat: "sub-assembly" as BOMCategory, type: "manufacturing" as BOMType },
  { code: "SA-EN-3001", name: "Engine Mount Sub-Assembly", line: "Automotive", cat: "sub-assembly" as BOMCategory, type: "manufacturing" as BOMType },
  { code: "EG-CT-4001", name: "Custom Cable Harness — Truck", line: "Engineered", cat: "engineered" as BOMCategory, type: "engineering" as BOMType },
  { code: "EG-CT-4002", name: "Battery Pack Enclosure — EV", line: "Engineered", cat: "engineered" as BOMCategory, type: "engineering" as BOMType },
  { code: "PH-ST-5001", name: "Steering Column Phantom BOM", line: "Automotive", cat: "phantom" as BOMCategory, type: "manufacturing" as BOMType },
  { code: "PK-EX-6001", name: "Export Packaging Kit — 20ft Container", line: "Packaging", cat: "packaging-kit" as BOMCategory, type: "packaging" as BOMType },
  { code: "PK-DM-6002", name: "Domestic Packaging Kit — Single Unit", line: "Packaging", cat: "packaging-kit" as BOMCategory, type: "packaging" as BOMType },
  { code: "SV-PM-7001", name: "Preventive Maintenance Kit — Q1", line: "Service", cat: "service-kit" as BOMCategory, type: "service" as BOMType },
  { code: "SV-PM-7002", name: "Preventive Maintenance Kit — Q2", line: "Service", cat: "service-kit" as BOMCategory, type: "service" as BOMType },
  { code: "FG-EX-8001", name: "Exhaust Manifold Assembly — Diesel", line: "Automotive", cat: "finished-good" as BOMCategory, type: "manufacturing" as BOMType },
  { code: "SA-FL-3002", name: "Fuel Injector Sub-Assembly", line: "Automotive", cat: "sub-assembly" as BOMCategory, type: "manufacturing" as BOMType },
  { code: "EG-CU-4003", name: "Custom ECU Bracket — Heavy Truck", line: "Engineered", cat: "engineered" as BOMCategory, type: "engineering" as BOMType },
  { code: "PK-RW-6003", name: "Raw Material Kit — Steel Bundle", line: "Packaging", cat: "packaging-kit" as BOMCategory, type: "packaging" as BOMType },
]

const PART_LIBRARY = [
  { no: "RM-CR-1001", desc: "Cold Rolled Steel Coil 2.0mm", uom: "MT", type: "raw-material" as PartType, cost: 58000, lead: 14, source: "buy" as const },
  { no: "RM-AL-2003", desc: "Aluminium Sheet 1.5mm", uom: "MT", type: "raw-material" as PartType, cost: 220000, lead: 21, source: "buy" as const },
  { no: "RM-SS-3005", desc: "Stainless Steel Bar 12mm", uom: "MT", type: "raw-material" as PartType, cost: 185000, lead: 18, source: "buy" as const },
  { no: "CP-BR-4001", desc: "Brake Pad Friction Material", uom: "SET", type: "component" as PartType, cost: 1200, lead: 10, source: "buy" as const },
  { no: "CP-BR-4002", desc: "Brake Caliper Piston 38mm", uom: "NOS", type: "component" as PartType, cost: 850, lead: 12, source: "buy" as const },
  { no: "CP-BR-4003", desc: "Brake Seal Kit", uom: "SET", type: "component" as PartType, cost: 320, lead: 7, source: "buy" as const },
  { no: "CP-WL-5001", desc: "Wheel Bearing Hub Assembly", uom: "NOS", type: "component" as PartType, cost: 3200, lead: 15, source: "buy" as const },
  { no: "CP-WL-5002", desc: "Wheel Stud M14x1.5", uom: "NOS", type: "fastener" as PartType, cost: 28, lead: 5, source: "buy" as const },
  { no: "CP-WL-5003", desc: "Wheel Nut M14x1.5 Chrome", uom: "NOS", type: "fastener" as PartType, cost: 12, lead: 5, source: "buy" as const },
  { no: "SA-EN-3001", desc: "Engine Mount Sub-Assembly", uom: "SET", type: "sub-assembly" as PartType, cost: 4500, lead: 20, source: "make" as const },
  { no: "SA-BR-2002", desc: "Brake Pad Sub-Assembly", uom: "SET", type: "sub-assembly" as PartType, cost: 1800, lead: 12, source: "make" as const },
  { no: "PH-ST-5001", desc: "Steering Column Phantom BOM", uom: "SET", type: "sub-assembly" as PartType, cost: 0, lead: 0, source: "phantom" as const },
  { no: "PK-CT-4001", desc: "Corrugated Carton 600x400x300", uom: "NOS", type: "packaging" as PartType, cost: 85, lead: 3, source: "buy" as const },
  { no: "PKG-STR-4015", desc: "PET Strapping Roll 12mm", uom: "ROL", type: "packaging" as PartType, cost: 450, lead: 7, source: "buy" as const },
  { no: "PKG-LBL-4022", desc: "Thermal Label 100x150mm", uom: "PCS", type: "packaging" as PartType, cost: 2, lead: 4, source: "buy" as const },
  { no: "CON-GL-5002", desc: "Industrial Gloves Cut-Resistant", uom: "PR", type: "consumable" as PartType, cost: 95, lead: 6, source: "buy" as const },
  { no: "CON-OIL-5011", desc: "Hydraulic Oil ISO VG 46", uom: "LTR", type: "consumable" as PartType, cost: 380, lead: 8, source: "buy" as const },
  { no: "SPR-BRG-6001", desc: "Deep Groove Ball Bearing 6205", uom: "NOS", type: "component" as PartType, cost: 280, lead: 9, source: "buy" as const },
  { no: "CP-EN-7001", desc: "Engine Mounting Bracket", uom: "NOS", type: "component" as PartType, cost: 650, lead: 11, source: "make" as const },
  { no: "CP-EN-7002", desc: "Rubber Isolator 60 Shore A", uom: "NOS", type: "component" as PartType, cost: 220, lead: 14, source: "buy" as const },
  { no: "SV-LBR-8001", desc: "Labor Hour — Skilled", uom: "HRS", type: "service" as PartType, cost: 850, lead: 0, source: "make" as const },
]

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function genParts(seed: string, count: number): BOMPart[] {
  const parts: BOMPart[] = []
  for (let i = 0; i < count; i++) {
    const h = hash(`${seed}-p-${i}`)
    const lib = PART_LIBRARY[h % PART_LIBRARY.length]
    const qty = 1 + (h % 20)
    const scrap = (h % 5) * 1.5 // 0, 1.5, 3, 4.5, 6%
    const totalCost = qty * lib.cost * (1 + scrap / 100)
    parts.push({
      sr: i + 1,
      partNo: lib.no,
      description: lib.desc,
      partType: lib.type,
      uom: lib.uom,
      qty,
      unitCost: lib.cost,
      scrapPct: scrap,
      leadTimeDays: lib.lead,
      source: lib.source,
      hasSubBOM: lib.type === "sub-assembly",
      subBOMId: lib.type === "sub-assembly" ? `BOM-${lib.no.replace(/[^0-9]/g, "").padStart(4, "0")}` : undefined,
      totalCost: Math.round(totalCost),
    })
  }
  return parts
}

function genRevisions(seed: string, currentRev: string): BOMRevision[] {
  const revs = ["A", "B", "C", "D", "E"]
  const cutoffIdx = revs.indexOf(currentRev)
  if (cutoffIdx < 0) return []
  const statuses: BOMRevision["status"][] = ["approved", "approved", "approved", "approved", "approved"]
  // If current rev is pending, mark it pending
  if (currentRev === "D") statuses[3] = "pending"
  return revs.slice(0, cutoffIdx + 1).map((rev, idx) => {
    const h = hash(`${seed}-r-${rev}`)
    const day = new Date()
    day.setDate(day.getDate() - (cutoffIdx - idx) * 45 - (h % 20))
    return {
      rev,
      date: day.toISOString().slice(0, 10),
      author: ["Rajesh Kumar", "Anita Desai", "Sunil Bansal", "Meera Krishnan"][h % 4],
      approver: idx === cutoffIdx && statuses[idx] === "pending" ? "Pending Review" : "Vikram Singh",
      status: statuses[idx],
      changeDescription:
        idx === 0
          ? "Initial release — BOM created from engineering drawing."
          : idx === 1
          ? "Updated part numbers per latest engineering standard. Replaced 2 components."
          : idx === 2
          ? "Cost optimization — substituted raw material grade. No functional change."
          : idx === 3
          ? "Added new sub-assembly for improved reliability. Pending engineering review."
          : "Engineering Change Notice — alternate vendor qualification for critical component.",
      impactedParts: 1 + (h % 6),
      costImpact: Math.round(((h % 21) - 10) * 10) / 10, // -100% to +100% in 0.1 steps
      ecnNo: `ECN-${day.getFullYear()}-${1000 + (h % 9000)}`,
    }
  })
}

function genWhereUsed(seed: string, count: number): BOMWhereUsed[] {
  const result: BOMWhereUsed[] = []
  for (let i = 0; i < count; i++) {
    const h = hash(`${seed}-wu-${i}`)
    const prod = PRODUCTS[h % PRODUCTS.length]
    const day = new Date()
    day.setDate(day.getDate() - (h % 365))
    result.push({
      parentBOMId: `BOM-${prod.code.replace(/[^0-9]/g, "").padStart(4, "0")}`,
      parentBOMName: prod.name,
      parentCategory: prod.cat,
      qtyPerParent: 1 + (h % 4),
      effectiveDate: day.toISOString().slice(0, 10),
    })
  }
  return result
}

function genCostRollup(seed: string, parts: BOMPart[]): CostRollup[] {
  const rollup: CostRollup[] = []
  parts.forEach((p, idx) => {
    const h = hash(`${seed}-cr-${idx}`)
    const isMake = p.source === "make"
    const laborCost = isMake ? Math.round(p.unitCost * 0.15 * p.qty) : 0
    const overheadCost = isMake ? Math.round(p.unitCost * 0.08 * p.qty) : 0
    const scrapCost = Math.round(p.unitCost * p.qty * (p.scrapPct / 100))
    rollup.push({
      level: p.source === "phantom" ? 0 : 1,
      partNo: p.partNo,
      description: p.description,
      source: p.source,
      qty: p.qty,
      unitCost: p.unitCost,
      extendedCost: p.unitCost * p.qty,
      scrapCost,
      laborCost,
      overheadCost,
      totalCost: p.unitCost * p.qty + scrapCost + laborCost + overheadCost,
      hasChildren: p.hasSubBOM,
    })
  })
  return rollup
}

const STATUSES_BY_INDEX: BOMStatus[] = [
  "draft", "in-review", "approved", "released", "frozen",
  "deprecated", "obsolete",
  "released", "frozen", "approved", "released",
  "frozen", "in-review", "approved", "released", "frozen",
]

const BOMS: BillOfMaterials[] = PRODUCTS.map((prod, i) => {
  const seed = `BOM${prod.code.replace(/[^0-9]/g, "")}`
  const h = hash(seed)
  const status = STATUSES_BY_INDEX[i]
  const revision =
    status === "draft" ? "A"
    : status === "in-review" ? "D"
    : status === "approved" ? "C"
    : status === "released" ? "C"
    : status === "frozen" ? "E"
    : status === "deprecated" ? "B"
    : "A" // obsolete
  const parts = genParts(seed, 4 + (h % 8))
  const revisions = genRevisions(seed, revision)
  const whereUsed = prod.cat === "sub-assembly" || prod.cat === "phantom"
    ? genWhereUsed(seed, 1 + (h % 3))
    : []
  const costRollup = genCostRollup(seed, parts)
  const standardCost = parts.reduce((s, p) => s + p.totalCost, 0)
  const lastActualCost = Math.round(standardCost * (1 + (((h % 21) - 10) / 100)))
  const costVariancePct = Math.round(((lastActualCost - standardCost) / standardCost) * 1000) / 10
  const created = new Date(2026, 0, 1 + (i * 12 % 200))
  const modified = new Date(2026, 5, 1 + (i * 4 % 60))
  const effective = new Date(2026, 5, 15 + (h % 15))
  const expiry = status === "deprecated" || status === "obsolete"
    ? new Date(2026, 2, 1 + (h % 30)).toISOString().slice(0, 10)
    : null
  return {
    id: `BOM-${prod.code.replace(/[^0-9]/g, "").padStart(4, "0")}`,
    name: prod.name,
    description: `Multi-level BOM for ${prod.name}. Includes raw materials, components, sub-assemblies, and labor.`,
    category: prod.cat,
    type: prod.type,
    status,
    revision,
    parentProductCode: prod.code,
    productLine: prod.line,
    uom: "SET",
    qtyPerAssembly: 1,
    totalParts: parts.length,
    uniqueParts: new Set(parts.map((p) => p.partNo)).size,
    levels: 1 + (h % 3),
    standardCost: Math.round(standardCost),
    lastActualCost,
    costVariancePct,
    createdBy: ["Rajesh Kumar", "Anita Desai", "Sunil Bansal"][h % 3],
    createdDate: created.toISOString().slice(0, 10),
    lastModified: modified.toISOString().slice(0, 10),
    effectiveDate: effective.toISOString().slice(0, 10),
    expiryDate: expiry,
    approver: "Vikram Singh",
    engineeringOwner: ["Anita Desai", "Sunil Bansal", "Meera Krishnan"][h % 3],
    manufacturingOwner: ["Rajesh Kumar", "Karthik Iyer", "Deepak Mehta"][h % 3],
    ecnCount: revisions.length - 1,
    lastECN: revisions.length > 0 ? revisions[revisions.length - 1].ecnNo : "",
    parts,
    revisions,
    whereUsed,
    costRollup,
    notes: prod.cat === "phantom"
      ? "Phantom BOM — used for engineering reference only, not a buildable item."
      : prod.cat === "engineered"
      ? "Engineered-to-order BOM — custom configuration per customer requirement."
      : "Standard production BOM with cost rollup and revision tracking.",
  }
})

// ============================================================================
// Constants & Theming
// ============================================================================

const BOM_STATUS_META: Record<BOMStatus, { label: string; color: string; bg: string; border: string; icon: typeof GitBranch }> = {
  draft: { label: "Draft", color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800/50", border: "border-slate-300 dark:border-slate-700", icon: FileClock },
  "in-review": { label: "In Review", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", icon: Eye },
  approved: { label: "Approved", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", icon: CheckCircle2 },
  released: { label: "Released", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", icon: FileCheck },
  frozen: { label: "Frozen", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-cyan-200 dark:border-cyan-800", icon: ShieldCheck },
  deprecated: { label: "Deprecated", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", icon: AlertTriangle },
  obsolete: { label: "Obsolete", color: "text-red-700 dark:text-red-300", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", icon: XCircle },
}

const CATEGORY_META: Record<BOMCategory, { label: string; color: string; bg: string; pieColor: string; icon: typeof Boxes }> = {
  "finished-good": { label: "Finished Good", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/40", pieColor: "#3b82f6", icon: Package },
  "sub-assembly": { label: "Sub-Assembly", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/40", pieColor: "#8b5cf6", icon: Boxes },
  engineered: { label: "Engineered", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/40", pieColor: "#f59e0b", icon: Cpu },
  phantom: { label: "Phantom", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/50", pieColor: "#64748b", icon: Eye },
  "packaging-kit": { label: "Packaging Kit", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-900/40", pieColor: "#fb923c", icon: Package },
  "service-kit": { label: "Service Kit", color: "text-teal-700 dark:text-teal-300", bg: "bg-teal-100 dark:bg-teal-900/40", pieColor: "#14b8a6", icon: Wrench },
}

const TYPE_META: Record<BOMType, { label: string; color: string; bg: string }> = {
  manufacturing: { label: "Manufacturing", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/40" },
  engineering: { label: "Engineering", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/40" },
  service: { label: "Service", color: "text-teal-700 dark:text-teal-300", bg: "bg-teal-100 dark:bg-teal-900/40" },
  packaging: { label: "Packaging", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-900/40" },
}

const PART_TYPE_META: Record<PartType, { label: string; color: string; bg: string }> = {
  "raw-material": { label: "Raw Material", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/40" },
  component: { label: "Component", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/40" },
  "sub-assembly": { label: "Sub-Assembly", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/40" },
  fastener: { label: "Fastener", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800/50" },
  consumable: { label: "Consumable", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-100 dark:bg-cyan-900/40" },
  packaging: { label: "Packaging", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-900/40" },
  service: { label: "Service", color: "text-teal-700 dark:text-teal-300", bg: "bg-teal-100 dark:bg-teal-900/40" },
}

const STATUS_TABS: { value: BOMStatus | "all"; label: string; filter: (b: BillOfMaterials) => boolean }[] = [
  { value: "all", label: "All", filter: () => true },
  { value: "draft", label: "Draft", filter: (b) => b.status === "draft" },
  { value: "in-review", label: "In Review", filter: (b) => b.status === "in-review" },
  { value: "approved", label: "Approved", filter: (b) => b.status === "approved" },
  { value: "released", label: "Released", filter: (b) => b.status === "released" },
  { value: "frozen", label: "Frozen", filter: (b) => b.status === "frozen" },
  { value: "deprecated", label: "Deprecated", filter: (b) => b.status === "deprecated" },
  { value: "obsolete", label: "Obsolete", filter: (b) => b.status === "obsolete" },
]

const spendTrendConfig = {
  value: { label: "BOM Value (₹ Lakh)", color: "#2563eb" },
  target: { label: "Target", color: "#94a3b8" },
} satisfies ChartConfig

const categoryConfig = {
  value: { label: "BOMs" },
} satisfies ChartConfig

const costVarianceConfig = {
  standard: { label: "Standard Cost", color: "#3b82f6" },
  actual: { label: "Actual Cost", color: "#f59e0b" },
} satisfies ChartConfig

const revisionActivityConfig = {
  count: { label: "Revisions", color: "#7c3aed" },
} satisfies ChartConfig

// 6-month revision activity mock
const REVISION_ACTIVITY = Array.from({ length: 6 }, (_, i) => {
  const h = hash(`rev-act-${i}`)
  return {
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    count: 3 + (h % 12),
  }
})

// Cost variance by category
const COST_VARIANCE_BY_CAT = (() => {
  const groups: Record<string, { standard: number[]; actual: number[] }> = {}
  BOMS.forEach((b) => {
    const cat = CATEGORY_META[b.category].label
    if (!groups[cat]) groups[cat] = { standard: [], actual: [] }
    groups[cat].standard.push(b.standardCost / 100000)
    groups[cat].actual.push(b.lastActualCost / 100000)
  })
  return Object.entries(groups).map(([k, v]) => ({
    name: k,
    standard: Math.round((v.standard.reduce((s, x) => s + x, 0) / v.standard.length) * 10) / 10,
    actual: Math.round((v.actual.reduce((s, x) => s + x, 0) / v.actual.length) * 10) / 10,
  }))
})()

// Helper functions
function formatINR(value: number, compact = false): string {
  if (compact) {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)} K`
  }
  return `₹${value.toLocaleString("en-IN")}`
}

function formatPct(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
}

// ============================================================================
// Sub-components
// ============================================================================

interface KPICardProps {
  title: string
  value: string
  subValue?: string
  trend?: number
  trendLabel?: string
  icon: typeof Layers
  color: "blue" | "emerald" | "amber" | "violet" | "rose" | "cyan"
  index: number
}

function KPIBox({ title, value, subValue, trend, trendLabel, icon: Icon, color, index }: KPICardProps) {
  const colorMap: Record<string, { bg: string; text: string; ring: string; gradient: string }> = {
    blue: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-200 dark:ring-blue-800", gradient: "from-blue-500/10" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-200 dark:ring-emerald-800", gradient: "from-emerald-500/10" },
    amber: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-200 dark:ring-amber-800", gradient: "from-amber-500/10" },
    violet: { bg: "bg-violet-50 dark:bg-violet-950/30", text: "text-violet-600 dark:text-violet-400", ring: "ring-violet-200 dark:ring-violet-800", gradient: "from-violet-500/10" },
    rose: { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-200 dark:ring-rose-800", gradient: "from-rose-500/10" },
    cyan: { bg: "bg-cyan-50 dark:bg-cyan-950/30", text: "text-cyan-600 dark:text-cyan-400", ring: "ring-cyan-200 dark:ring-cyan-800", gradient: "from-cyan-500/10" },
  }
  const c = colorMap[color]
  return (
    <Card
      className={cn(
        "bom-kpi-enter relative overflow-hidden ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        c.ring
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", c.gradient, "to-transparent")} />
      <div className={cn("absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl", c.bg)} />
      <CardContent className="inner-glow glass-subtle p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
            {subValue && (
              <p className={cn("mt-0.5 text-xs font-medium", c.text)}>{subValue}</p>
            )}
          </div>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", c.bg, c.text)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            <div
              className={cn(
                "flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold",
                trend >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
              )}
            >
              {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {formatPct(trend)}
            </div>
            {trendLabel && (
              <span className="text-[11px] text-muted-foreground">{trendLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Main View
// ============================================================================

export function BillOfMaterialsView() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<BOMStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<BOMCategory | "all">("all")
  const [typeFilter, setTypeFilter] = useState<BOMType | "all">("all")
  const [selectedBOM, setSelectedBOM] = useState<BillOfMaterials | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredBOMs = useMemo(() => {
    return BOMS.filter((b) => {
      const tab = STATUS_TABS.find((t) => t.value === activeTab)
      if (!tab?.filter(b)) return false
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false
      if (typeFilter !== "all" && b.type !== typeFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          b.id.toLowerCase().includes(q) ||
          b.name.toLowerCase().includes(q) ||
          b.parentProductCode.toLowerCase().includes(q) ||
          b.productLine.toLowerCase().includes(q) ||
          b.engineeringOwner.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activeTab, searchQuery, categoryFilter, typeFilter])

  const kpis = useMemo(() => {
    const total = BOMS.length
    const active = BOMS.filter((b) => ["approved", "released", "frozen"].includes(b.status)).length
    const pendingRev = BOMS.filter((b) => ["draft", "in-review"].includes(b.status)).length
    const totalParts = BOMS.reduce((s, b) => s + b.totalParts, 0)
    const avgPartsPerBOM = Math.round(totalParts / total)
    const totalValue = BOMS.reduce((s, b) => s + b.standardCost, 0)
    const multiLevel = BOMS.filter((b) => b.levels > 1).length
    return { total, active, pendingRev, avgPartsPerBOM, totalValue, multiLevel }
  }, [])

  const bomByCategory = useMemo(() => {
    const groups: Record<BOMCategory, number> = {
      "finished-good": 0,
      "sub-assembly": 0,
      engineered: 0,
      phantom: 0,
      "packaging-kit": 0,
      "service-kit": 0,
    }
    BOMS.forEach((b) => {
      groups[b.category] += 1
    })
    return Object.entries(groups).map(([k, v]) => ({
      name: CATEGORY_META[k as BOMCategory].label,
      value: v,
      color: CATEGORY_META[k as BOMCategory].pieColor,
    }))
  }, [])

  const partsPareto = useMemo(() => {
    const counter: Record<string, { count: number; type: PartType }> = {}
    BOMS.forEach((b) => {
      b.parts.forEach((p) => {
        if (!counter[p.partNo]) {
          counter[p.partNo] = { count: 0, type: p.partType }
        }
        counter[p.partNo].count += p.qty
      })
    })
    return Object.entries(counter)
      .map(([k, v]) => ({
        name: k,
        count: v.count,
        type: v.type,
        color: PART_TYPE_META[v.type] ? PART_TYPE_META[v.type].color : "#94a3b8",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [])

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    STATUS_TABS.forEach((t) => {
      counts[t.value] = BOMS.filter(t.filter).length
    })
    return counts
  }, [])

  function openDetail(bom: BillOfMaterials) {
    setSelectedBOM(bom)
    setDrawerOpen(true)
  }

  function handleExport() {
    const rows = filteredBOMs.map((b) => ({
      "BOM ID": b.id,
      "Name": b.name,
      "Product Code": b.parentProductCode,
      "Product Line": b.productLine,
      "Category": CATEGORY_META[b.category].label,
      "Type": TYPE_META[b.type].label,
      "Status": BOM_STATUS_META[b.status].label,
      "Revision": b.revision,
      "Total Parts": b.totalParts,
      "Unique Parts": b.uniqueParts,
      "Levels": b.levels,
      "Standard Cost (INR)": b.standardCost,
      "Last Actual Cost (INR)": b.lastActualCost,
      "Cost Variance %": b.costVariancePct,
      "Created By": b.createdBy,
      "Created Date": b.createdDate,
      "Last Modified": b.lastModified,
      "Effective Date": b.effectiveDate,
      "Expiry Date": b.expiryDate || "",
      "Approver": b.approver,
      "Engineering Owner": b.engineeringOwner,
      "Manufacturing Owner": b.manufacturingOwner,
      "ECN Count": b.ecnCount,
      "Last ECN": b.lastECN,
      "Notes": b.notes,
    }))
    exportToCSV(rows, `boms-${new Date().toISOString().slice(0, 10)}`)
    toast.success(
      "Export complete",
      `Exported ${rows.length} BOMs to CSV`
    )
  }

  function handleRefresh() {
    toast.info(
      "Refreshing BOMs",
      "Fetching latest BOM data from ERP…"
    )
  }

  function handleNewBOM() {
    toast.success(
      "New BOM drafted",
      "BOM-2026-0017 created in Draft state. Add line items to proceed."
    )
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <PageHeader
        title="Bill of Materials (BOM)"
        description="Multi-level BOM management with revision control, cost rollup, and where-used traceability"
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KPIBox
          index={0}
          title="Total BOMs"
          value={kpis.total.toString()}
          subValue={`${kpis.active} active`}
          trend={6.2}
          trendLabel="vs last month"
          icon={Layers}
          color="blue"
        />
        <KPIBox
          index={1}
          title="Active BOMs"
          value={kpis.active.toString()}
          subValue="approved / released / frozen"
          trend={4.4}
          trendLabel="vs last month"
          icon={FileCheck}
          color="emerald"
        />
        <KPIBox
          index={2}
          title="Revisions Pending"
          value={kpis.pendingRev.toString()}
          subValue="draft / in-review"
          trend={-8.1}
          trendLabel="faster cycle"
          icon={FileClock}
          color="amber"
        />
        <KPIBox
          index={3}
          title="Avg Parts/BOM"
          value={kpis.avgPartsPerBOM.toString()}
          subValue="across all BOMs"
          trend={1.2}
          trendLabel="stable"
          icon={ListTree}
          color="violet"
        />
        <KPIBox
          index={4}
          title="Total BOM Value"
          value={formatINR(kpis.totalValue, true)}
          subValue="sum of standard costs"
          trend={9.7}
          trendLabel="vs last quarter"
          icon={CircleDollarSign}
          color="cyan"
        />
        <KPIBox
          index={5}
          title="Multi-Level BOMs"
          value={kpis.multiLevel.toString()}
          subValue="2+ levels deep"
          trend={3.3}
          trendLabel="vs last month"
          icon={GitBranch}
          color="rose"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* 6-month revision activity */}
        <Card className="hover-lift-sm bom-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Revision Activity (6 Months)</CardTitle>
                <CardDescription className="text-xs">
                  Number of BOM revisions approved per month
                </CardDescription>
              </div>
              <Badge variant="outline" className="badge-interactive gap-1 text-[11px]">
                <Activity className="h-3 w-3" /> Trending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle pt-0">
            <ChartContainer config={revisionActivityConfig} className="h-[220px] w-full">
              <AreaChart data={REVISION_ACTIVITY} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
                <defs>
                  <linearGradient id="bomRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  fill="url(#bomRevGrad)"
                  dot={{ r: 3, fill: "#7c3aed" }}
                  activeDot={{ r: 5, fill: "#7c3aed" }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* BOM by category donut */}
        <Card className="hover-lift-sm bom-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">BOMs by Category</CardTitle>
            <CardDescription className="text-xs">{BOMS.length} BOMs across 6 categories</CardDescription>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle pt-0">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <ChartContainer config={categoryConfig} className="h-[200px] w-full sm:w-1/2">
                <PieChart>
                  <Pie
                    data={bomByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {bomByCategory.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="grid w-full grid-cols-2 gap-1.5 sm:w-1/2">
                {bomByCategory.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="truncate text-muted-foreground">{entry.name}</span>
                    <span className="ml-auto font-semibold">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost variance by category */}
        <Card className="hover-lift-sm bom-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cost Variance by Category</CardTitle>
            <CardDescription className="text-xs">Avg standard vs actual cost (₹ Lakh)</CardDescription>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle pt-0">
            <ChartContainer config={costVarianceConfig} className="h-[200px] w-full">
              <BarChart data={COST_VARIANCE_BY_CAT} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="standard" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={26} />
                <Bar dataKey="actual" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Parts usage Pareto */}
        <Card className="hover-lift-sm bom-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top 8 Parts Usage</CardTitle>
            <CardDescription className="text-xs">Most frequently used parts across all BOMs</CardDescription>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle pt-0">
            <ChartContainer
              config={{
                count: { label: "Usage Count", color: "#10b981" },
              }}
              className="h-[200px] w-full"
            >
              <BarChart
                data={partsPareto}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 60, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={90} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={22}>
                  {partsPareto.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Master Table Card */}
      <Card className="hover-lift-sm bom-table-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base">Bill of Materials</CardTitle>
              <CardDescription className="text-xs">
                {filteredBOMs.length} of {kpis.total} BOMs · showing {activeTab === "all" ? "all statuses" : BOM_STATUS_META[activeTab as BOMStatus]?.label}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search BOM / product / owner…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-[220px] pl-8 text-sm bom-search-focus"
                />
              </div>
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as BOMCategory | "all")}>
                <SelectTrigger className="h-9 w-[140px] text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(CATEGORY_META).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as BOMType | "all")}>
                <SelectTrigger className="h-9 w-[130px] text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(TYPE_META).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-9" onClick={handleRefresh}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-9" onClick={handleExport}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Export
              </Button>
              <Button size="sm" className="press-scale h-9" onClick={handleNewBOM}>
                <FilePlus className="mr-1.5 h-3.5 w-3.5" /> New BOM
              </Button>
            </div>
          </div>

          {/* Status tabs */}
          <div className="mt-3 flex flex-wrap gap-1.5 border-b pb-2">
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab === tab.value
              const count = tabCounts[tab.value] || 0
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-all bom-tab-btn",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "ml-1.5 rounded px-1 py-0.5 text-[10px] font-semibold",
                      isActive ? "bg-primary-foreground/20" : "bg-muted"
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="inner-glow glass-subtle pt-0">
          <div className="overflow-x-auto">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="h-9 text-[11px] uppercase">BOM ID</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Product / BOM Name</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Status</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Rev</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Category</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase text-right">Parts</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase text-right">Levels</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase text-right">Std Cost ₹</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase text-right">Variance</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Last Modified</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Eng. Owner</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBOMs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="py-8 text-center text-muted-foreground">
                      No BOMs match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBOMs.map((bom, idx) => {
                    const statusMeta = BOM_STATUS_META[bom.status]
                    const catMeta = CATEGORY_META[bom.category]
                    const isCritical = bom.status === "obsolete" || bom.costVariancePct > 5
                    const isWarning = bom.status === "deprecated" || (bom.costVariancePct > 0 && bom.costVariancePct <= 5)
                    return (
                      <TableRow
                        key={bom.id}
                        onClick={() => openDetail(bom)}
                        className={cn(
                          "bom-row-in cursor-pointer border-b transition-colors",
                          isCritical
                            ? "bom-row-critical"
                            : isWarning
                            ? "bom-row-warning"
                            : "hover:bg-muted/30"
                        )}
                        style={{ animationDelay: `${Math.min(idx, 8) * 30}ms` }}
                      >
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-semibold">{bom.id}</span>
                            {bom.levels > 1 && (
                              <span className="rounded bg-violet-100 px-1 py-0.5 text-[9px] font-bold uppercase text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                                L{bom.levels}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{bom.parentProductCode}</div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className={cn("text-[10px] font-semibold", catMeta.bg, catMeta.color)}>
                                <catMeta.icon className="h-3.5 w-3.5" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="truncate text-xs font-medium">{bom.name}</div>
                              <div className="text-[10px] text-muted-foreground">{bom.productLine}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
                              statusMeta.bg, statusMeta.color, statusMeta.border
                            )}
                          >
                            <statusMeta.icon className="h-3 w-3" />
                            {statusMeta.label}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold">
                            Rev {bom.revision}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", catMeta.bg, catMeta.color)}>
                            {catMeta.label}
                          </span>
                        </TableCell>
                        <TableCell className="numeric-cell py-2.5 text-right text-xs font-semibold">{bom.totalParts}</TableCell>
                        <TableCell className="py-2.5 text-right text-xs">{bom.levels}</TableCell>
                        <TableCell className="numeric-cell py-2.5 text-right text-xs font-semibold">{formatINR(bom.standardCost, true)}</TableCell>
                        <TableCell className="py-2.5 text-right">
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              bom.costVariancePct > 5
                                ? "text-red-600 dark:text-red-400"
                                : bom.costVariancePct > 0
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            )}
                          >
                            {formatPct(bom.costVariancePct)}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5 text-[11px] text-muted-foreground">{bom.lastModified}</TableCell>
                        <TableCell className="py-2.5 text-[11px]">{bom.engineeringOwner}</TableCell>
                        <TableCell className="py-2.5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDetail(bom)
                            }}
                          >
                            <Eye className="h-4 w-4" />
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

      {/* Detail Drawer */}
      <BOMDetailDrawer
        bom={selectedBOM}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}

// ============================================================================
// Detail Drawer Component
// ============================================================================

interface DetailDrawerProps {
  bom: BillOfMaterials | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DrawerTab = "overview" | "parts-tree" | "revisions" | "cost-rollup" | "where-used"

function BOMDetailDrawer({ bom, open, onOpenChange }: DetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview")
  const toast = useToast()

  React.useEffect(() => {
    if (open) setActiveTab("overview")
  }, [open, bom])

  if (!bom) return null

  const statusMeta = BOM_STATUS_META[bom.status]
  const catMeta = CATEGORY_META[bom.category]
  const typeMeta = TYPE_META[bom.type]
  const totalCost = bom.parts.reduce((s, p) => s + p.totalCost, 0)
  const buyParts = bom.parts.filter((p) => p.source === "buy").length
  const makeParts = bom.parts.filter((p) => p.source === "make").length
  const phantomParts = bom.parts.filter((p) => p.source === "phantom").length
  const avgLeadTime = Math.round(bom.parts.reduce((s, p) => s + p.leadTimeDays, 0) / bom.parts.length)

  function handleExport() {
    toast.success(
      "BOM exported",
      `BOM ${bom!.id} details exported as PDF`
    )
  }

  function handleApprove() {
    toast.success(
      "BOM approved",
      `BOM ${bom!.id} moved to Approved state`
    )
  }

  function handleReject() {
    toast.error(
      "BOM rejected",
      `BOM ${bom!.id} sent back to engineering`
    )
  }

  function handleRelease() {
    toast.success(
      "BOM released",
      `BOM ${bom!.id} moved to Released state — production ready`
    )
  }

  const tabs: { id: DrawerTab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "parts-tree", label: "Parts Tree", count: bom.parts.length },
    { id: "revisions", label: "Revisions", count: bom.revisions.length },
    { id: "cost-rollup", label: "Cost Rollup" },
    { id: "where-used", label: "Where Used", count: bom.whereUsed.length },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bom-drawer-sheen w-full overflow-y-auto p-0 sm:max-w-3xl">
        <SheetHeader className="bom-drawer-header border-b bg-gradient-to-r from-muted/60 to-transparent px-6 pb-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg font-bold">
                  {bom.name}
                </SheetTitle>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
                    statusMeta.bg, statusMeta.color, statusMeta.border
                  )}
                >
                  <statusMeta.icon className="h-3 w-3" />
                  {statusMeta.label}
                </span>
              </div>
              <SheetDescription className="mt-0.5 flex items-center gap-2 text-xs">
                <span className="font-mono">{bom.id}</span>
                <span className="text-muted-foreground">·</span>
                <span className="font-mono text-muted-foreground">{bom.parentProductCode}</span>
                <span className="text-muted-foreground">·</span>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold">Rev {bom.revision}</span>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", catMeta.bg, catMeta.color)}>
                  {catMeta.label}
                </span>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", typeMeta.bg, typeMeta.color)}>
                  {typeMeta.label}
                </span>
              </SheetDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={cn(
                      "h-2 w-2 rounded-full",
                      s <= Math.min(5, bom.levels) ? "bg-violet-400" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">{bom.levels} levels deep</span>
            </div>
          </div>

          {/* Hero stats */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              { label: "Standard Cost", value: formatINR(bom.standardCost, true), icon: CircleDollarSign },
              { label: "Cost Variance", value: formatPct(bom.costVariancePct), icon: TrendingUp, sub: `${formatINR(bom.lastActualCost, true)} actual` },
              { label: "Total Parts", value: bom.totalParts.toString(), icon: ListTree, sub: `${bom.uniqueParts} unique` },
              { label: "Avg Lead Time", value: `${avgLeadTime}d`, icon: Clock },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="bom-stat-enter rounded-lg border bg-background/60 p-2"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <stat.icon className="h-3 w-3" />
                  {stat.label}
                </div>
                <div className="mt-0.5 text-sm font-bold">{stat.value}</div>
                {stat.sub && (
                  <div className="text-[10px] text-muted-foreground">{stat.sub}</div>
                )}
              </div>
            ))}
          </div>
        </SheetHeader>

        {/* Tabs */}
        <div className="flex border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "relative px-3 py-2.5 text-xs font-medium transition-all bom-tab-switch",
                activeTab === t.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className="ml-1 rounded bg-muted px-1 text-[10px]">{t.count}</span>
              )}
              {activeTab === t.id && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="bom-body-enter space-y-3 p-4">
          {activeTab === "overview" && <OverviewTab bom={bom} totalCost={totalCost} buyParts={buyParts} makeParts={makeParts} phantomParts={phantomParts} avgLeadTime={avgLeadTime} />}
          {activeTab === "parts-tree" && <PartsTreeTab bom={bom} />}
          {activeTab === "revisions" && <RevisionsTab bom={bom} />}
          {activeTab === "cost-rollup" && <CostRollupTab bom={bom} />}
          {activeTab === "where-used" && <WhereUsedTab bom={bom} />}
        </div>

        <SheetFooter className="border-t bg-muted/30 px-4 py-3">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="text-[11px] text-muted-foreground">
              Created: <span className="font-medium text-foreground">{bom.createdDate}</span>
              <span className="mx-2">·</span>
              Last Modified: <span className="font-medium text-foreground">{bom.lastModified}</span>
            </div>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-8" onClick={handleExport}>
                <Download className="mr-1 h-3.5 w-3.5" /> Export
              </Button>
              {bom.status === "in-review" && (
                <>
                  <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-8 text-red-600 hover:text-red-700" onClick={handleReject}>
                    <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button size="sm" className="press-scale h-8" onClick={handleApprove}>
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                  </Button>
                </>
              )}
              {bom.status === "approved" && (
                <Button size="sm" className="press-scale h-8" onClick={handleRelease}>
                  <FileCheck className="mr-1 h-3.5 w-3.5" /> Release
                </Button>
              )}
              {!["draft", "in-review", "approved"].includes(bom.status) && (
                <Button variant="outline" size="sm" className="press-scale btn-outline-animate h-8" onClick={() => toast.info("New revision", `Started new revision for ${bom.id}`)}>
                  <GitBranch className="mr-1 h-3.5 w-3.5" /> New Revision
                </Button>
              )}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ============================================================
// Drawer Sub-Tabs
// ============================================================

function OverviewTab({ bom, totalCost, buyParts, makeParts, phantomParts, avgLeadTime }: {
  bom: BillOfMaterials
  totalCost: number
  buyParts: number
  makeParts: number
  phantomParts: number
  avgLeadTime: number
}) {
  return (
    <div className="space-y-3">
      {/* Ownership + Lifecycle */}
      <div className="bom-card-enter grid gap-3 md:grid-cols-2">
        <Card className="hover-lift-sm overflow-hidden">
          <CardHeader className="bg-muted/40 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Ownership</CardTitle>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle p-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-violet-100 text-[10px] font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                    {bom.engineeringOwner.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-[11px] text-muted-foreground">Engineering Owner</div>
                  <div className="text-xs font-semibold">{bom.engineeringOwner}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-blue-100 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    {bom.manufacturingOwner.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-[11px] text-muted-foreground">Manufacturing Owner</div>
                  <div className="text-xs font-semibold">{bom.manufacturingOwner}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-emerald-100 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {bom.approver.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-[11px] text-muted-foreground">Approver</div>
                  <div className="text-xs font-semibold">{bom.approver}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm overflow-hidden">
          <CardHeader className="bg-muted/40 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Lifecycle</CardTitle>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle p-3">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <div className="text-muted-foreground">Created By</div>
                <div className="font-medium">{bom.createdBy}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Created Date</div>
                <div className="font-medium">{bom.createdDate}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Last Modified</div>
                <div className="font-medium">{bom.lastModified}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Effective Date</div>
                <div className="font-medium text-emerald-600 dark:text-emerald-400">{bom.effectiveDate}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Expiry Date</div>
                <div className={cn("font-medium", bom.expiryDate ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                  {bom.expiryDate || "—"}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">ECNs</div>
                <div className="font-medium">{bom.ecnCount} issued</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost analysis */}
      <Card className="hover-lift-sm bom-card-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Cost Analysis</CardTitle>
          <CardDescription className="text-[11px]">Standard vs actual cost with variance breakdown</CardDescription>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-0">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border p-2">
              <CircleDollarSign className="mx-auto mb-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Standard</div>
              <div className="text-base font-bold">{formatINR(bom.standardCost, true)}</div>
            </div>
            <div className="rounded-lg border p-2">
              <Wallet className="mx-auto mb-1 h-4 w-4 text-amber-600 dark:text-amber-400" />
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Actual</div>
              <div className="text-base font-bold">{formatINR(bom.lastActualCost, true)}</div>
            </div>
            <div className={cn("rounded-lg border p-2", bom.costVariancePct > 5 ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30" : bom.costVariancePct > 0 ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30" : "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30")}>
              {bom.costVariancePct > 0 ? <TrendingUp className="mx-auto mb-1 h-4 w-4 text-red-600 dark:text-red-400" /> : <TrendingDown className="mx-auto mb-1 h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Variance</div>
              <div className={cn("text-base font-bold", bom.costVariancePct > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                {formatPct(bom.costVariancePct)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Source breakdown */}
      <Card className="hover-lift-sm bom-card-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Part Source Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-0">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-center dark:border-blue-800 dark:bg-blue-950/30">
              <div className="text-[10px] uppercase text-muted-foreground">Buy</div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{buyParts}</div>
              <div className="text-[10px] text-muted-foreground">procured</div>
            </div>
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-2 text-center dark:border-violet-800 dark:bg-violet-950/30">
              <div className="text-[10px] uppercase text-muted-foreground">Make</div>
              <div className="text-lg font-bold text-violet-700 dark:text-violet-300">{makeParts}</div>
              <div className="text-[10px] text-muted-foreground">manufactured</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center dark:border-slate-700 dark:bg-slate-800/30">
              <div className="text-[10px] uppercase text-muted-foreground">Phantom</div>
              <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{phantomParts}</div>
              <div className="text-[10px] text-muted-foreground">reference only</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="hover-lift-sm bom-card-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Description</CardTitle>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-0">
          <p className="text-xs text-muted-foreground">{bom.description}</p>
          {bom.notes && (
            <div className="mt-2 flex items-start gap-2 rounded border bg-amber-50/50 p-2 dark:bg-amber-950/20">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-[11px] text-amber-800 dark:text-amber-200">{bom.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PartsTreeTab({ bom }: { bom: BillOfMaterials }) {
  return (
    <Card className="hover-lift-sm bom-card-enter">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Parts Tree ({bom.parts.length})</CardTitle>
        <CardDescription className="text-[11px]">Line items with quantities, costs, and sources</CardDescription>
      </CardHeader>
      <CardContent className="inner-glow glass-subtle pt-0">
        <div className="overflow-x-auto">
          <Table className="table-hover-highlight">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="h-8 text-[10px] uppercase">#</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Part No</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Description</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Type</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Source</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">UOM</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Qty</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Unit ₹</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Scrap%</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Lead</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Total ₹</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bom.parts.map((p) => {
                const partMeta = PART_TYPE_META[p.partType]
                return (
                  <TableRow key={p.sr} className="text-xs">
                    <TableCell className="py-2">{p.sr}</TableCell>
                    <TableCell className="py-2 font-mono font-semibold">
                      <div className="flex items-center gap-1">
                        {p.partNo}
                        {p.hasSubBOM && (
                          <ListTree className="h-3 w-3 text-violet-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">{p.description}</TableCell>
                    <TableCell className="py-2">
                      <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", partMeta.bg, partMeta.color)}>
                        {partMeta.label}
                      </span>
                    </TableCell>
                    <TableCell className="py-2">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                          p.source === "buy"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                            : p.source === "make"
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
                        )}
                      >
                        {p.source.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="py-2">{p.uom}</TableCell>
                    <TableCell className="py-2 text-right">{p.qty}</TableCell>
                    <TableCell className="numeric-cell py-2 text-right">{p.unitCost.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="py-2">{p.scrapPct}%</TableCell>
                    <TableCell className="py-2">{p.leadTimeDays}d</TableCell>
                    <TableCell className="numeric-cell py-2 text-right font-semibold">{formatINR(p.totalCost, true)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-2 text-xs">
          <div>
            <span className="text-muted-foreground">Total Parts: </span>
            <span className="font-semibold">{bom.totalParts}</span>
            <span className="text-muted-foreground"> ({bom.uniqueParts} unique)</span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Total Cost: </span>
            <span className="font-bold text-primary">{formatINR(bom.parts.reduce((s, p) => s + p.totalCost, 0), true)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RevisionsTab({ bom }: { bom: BillOfMaterials }) {
  if (bom.revisions.length === 0) {
    return (
      <Card className="hover-lift-sm bom-card-enter">
        <CardContent className="inner-glow glass-subtle flex flex-col items-center justify-center py-12">
          <History className="mb-2 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium">No revisions yet</p>
          <p className="text-[11px] text-muted-foreground">Revision history will appear here as the BOM evolves</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="hover-lift-sm bom-card-enter">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Revision History</CardTitle>
        <CardDescription className="text-[11px]">{bom.revisions.length} revisions · current: Rev {bom.revision}</CardDescription>
      </CardHeader>
      <CardContent className="inner-glow glass-subtle pt-0">
        <div className="space-y-2">
          {bom.revisions.slice().reverse().map((rev, idx) => {
            const statusVisual = rev.status === "approved"
              ? { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", icon: CheckCircle2 }
              : rev.status === "rejected"
              ? { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", icon: XCircle }
              : rev.status === "pending"
              ? { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", icon: Clock }
              : { color: "text-slate-500 dark:text-slate-400", bg: "bg-muted/50", border: "border-transparent", icon: GitCommit }
            return (
              <div
                key={rev.rev}
                className={cn(
                  "bom-revision-step relative flex items-start gap-3 rounded-lg border p-2.5",
                  statusVisual.bg, statusVisual.border
                )}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", statusVisual.bg, statusVisual.color)}>
                  <span className="text-xs font-bold">{rev.rev}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold">Rev {rev.rev} · {rev.date}</div>
                    <span className={cn("text-[10px] font-semibold uppercase", statusVisual.color)}>
                      {rev.status}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {rev.author} → {rev.approver}
                  </div>
                  <div className="mt-1 text-[11px]">{rev.changeDescription}</div>
                  <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <GitCommit className="h-3 w-3" />
                      {rev.ecnNo}
                    </span>
                    <span>{rev.impactedParts} parts impacted</span>
                    <span className={cn("font-semibold", rev.costImpact > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                      {formatPct(rev.costImpact)} cost
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function CostRollupTab({ bom }: { bom: BillOfMaterials }) {
  const totals = bom.costRollup.reduce(
    (acc, c) => {
      acc.extended += c.extendedCost
      acc.scrap += c.scrapCost
      acc.labor += c.laborCost
      acc.overhead += c.overheadCost
      acc.total += c.totalCost
      return acc
    },
    { extended: 0, scrap: 0, labor: 0, overhead: 0, total: 0 }
  )
  return (
    <Card className="hover-lift-sm bom-card-enter">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Cost Rollup</CardTitle>
        <CardDescription className="text-[11px]">Multi-level cost breakdown including labor, overhead, and scrap</CardDescription>
      </CardHeader>
      <CardContent className="inner-glow glass-subtle pt-0">
        <div className="overflow-x-auto">
          <Table className="table-hover-highlight">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="h-8 text-[10px] uppercase">Lvl</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Part No</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Description</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Source</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Qty</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Unit ₹</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Extended</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Scrap</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Labor</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Overhead</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Total ₹</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bom.costRollup.map((c, idx) => (
                <TableRow key={idx} className="text-xs">
                  <TableCell className="py-2">
                    <span className="rounded bg-muted px-1 py-0.5 text-[10px] font-bold">L{c.level}</span>
                  </TableCell>
                  <TableCell className="py-2 font-mono font-semibold">
                    <div className="flex items-center gap-1">
                      {c.partNo}
                      {c.hasChildren && <ListTree className="h-3 w-3 text-violet-500" />}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">{c.description}</TableCell>
                  <TableCell className="py-2">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                        c.source === "buy"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : c.source === "make"
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
                      )}
                    >
                      {c.source.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 text-right">{c.qty}</TableCell>
                  <TableCell className="numeric-cell py-2 text-right">{c.unitCost.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="numeric-cell py-2 text-right">{c.extendedCost.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="numeric-cell py-2 text-right text-amber-600 dark:text-amber-400">{c.scrapCost > 0 ? c.scrapCost.toLocaleString("en-IN") : "—"}</TableCell>
                  <TableCell className="numeric-cell py-2 text-right text-violet-600 dark:text-violet-400">{c.laborCost > 0 ? c.laborCost.toLocaleString("en-IN") : "—"}</TableCell>
                  <TableCell className="numeric-cell py-2 text-right text-cyan-600 dark:text-cyan-400">{c.overheadCost > 0 ? c.overheadCost.toLocaleString("en-IN") : "—"}</TableCell>
                  <TableCell className="numeric-cell py-2 text-right font-bold">{c.totalCost.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2 border-t pt-2 text-[11px]">
          <div>
            <div className="text-muted-foreground">Extended</div>
            <div className="font-semibold">{formatINR(totals.extended, true)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Scrap</div>
            <div className="font-semibold text-amber-600 dark:text-amber-400">{formatINR(totals.scrap, true)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Labor</div>
            <div className="font-semibold text-violet-600 dark:text-violet-400">{formatINR(totals.labor, true)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Overhead</div>
            <div className="font-semibold text-cyan-600 dark:text-cyan-400">{formatINR(totals.overhead, true)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total</div>
            <div className="font-bold text-primary">{formatINR(totals.total, true)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function WhereUsedTab({ bom }: { bom: BillOfMaterials }) {
  if (bom.whereUsed.length === 0) {
    return (
      <Card className="hover-lift-sm bom-card-enter">
        <CardContent className="inner-glow glass-subtle flex flex-col items-center justify-center py-12">
          <Workflow className="mb-2 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium">Not used in any parent BOM</p>
          <p className="text-[11px] text-muted-foreground">This is a top-level BOM (finished good or independent item)</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="hover-lift-sm bom-card-enter">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Where Used ({bom.whereUsed.length})</CardTitle>
        <CardDescription className="text-[11px]">Parent BOMs that consume this item</CardDescription>
      </CardHeader>
      <CardContent className="inner-glow glass-subtle pt-0">
        <div className="overflow-x-auto">
          <Table className="table-hover-highlight">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="h-8 text-[10px] uppercase">Parent BOM ID</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Parent Name</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Category</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Qty/Parent</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Effective Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bom.whereUsed.map((wu, idx) => {
                const catMeta = CATEGORY_META[wu.parentCategory]
                return (
                  <TableRow key={idx} className="text-xs">
                    <TableCell className="py-2 font-mono font-semibold">{wu.parentBOMId}</TableCell>
                    <TableCell className="py-2">{wu.parentBOMName}</TableCell>
                    <TableCell className="py-2">
                      <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", catMeta.bg, catMeta.color)}>
                        {catMeta.label}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-right font-semibold">{wu.qtyPerParent}</TableCell>
                    <TableCell className="py-2 text-[11px] text-muted-foreground">{wu.effectiveDate}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
