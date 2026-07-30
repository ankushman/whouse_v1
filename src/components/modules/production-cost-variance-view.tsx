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
  Plus,
  Calculator,
  Layers,
  Calendar,
  Factory,
  Wrench,
  Boxes,
  ShoppingCart,
  ChevronRight,
  CircleCheck,
  CircleDot,
  CircleSlash,
  Target,
  Gauge,
  ArrowRightCircle,
  Zap,
  Timer,
  ListChecks,
  FileBarChart,
  Crosshair,
  ArrowDown,
  ArrowUp,
  Minus,
  Sparkles,
  Bell,
  Scale,
  Wallet,
  PiggyBank,
  Receipt,
  BookOpen,
  Lightbulb,
  FileWarning,
  ClipboardList,
  Star,
  BarChart3,
  Settings as SettingsIcon,
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
  LineChart,
  Line,
} from "recharts"

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

type PCVStatus =
  | "favorable"
  | "on-target"
  | "unfavorable"
  | "critical"
  | "investigating"
  | "approved"
  | "rejected"
  | "pending-review"

type PCVCategory =
  | "material"
  | "labor"
  | "overhead"
  | "scrap"
  | "setup"
  | "subcontract"

type PCVDirection = "favorable" | "unfavorable" | "neutral"

type PCVRiskLevel = "low" | "medium" | "high" | "critical"

interface PCVCostElement {
  category: PCVCategory
  planned: number
  actual: number
  unit: string
  variance: number
  variancePct: number
  direction: PCVDirection
  notes: string
}

interface PCVDriver {
  name: string
  impact: number
  impactPct: number
  direction: PCVDirection
  category: PCVCategory
  description: string
}

interface PCVMonthlyTrend {
  month: string
  plannedCost: number
  actualCost: number
  variance: number
  variancePct: number
}

interface PCVRollup {
  workOrder: string
  part: string
  qty: number
  plannedUnitCost: number
  actualUnitCost: number
  variance: number
  variancePct: number
}

interface PCVRootCause {
  id: string
  category: PCVCategory
  description: string
  probability: number
  impact: number
  riskScore: number
  status: "open" | "investigating" | "confirmed" | "mitigated"
  owner: string
  identifiedDate: string
}

interface PCVMitigationAction {
  id: string
  description: string
  owner: string
  dueDate: string
  status: "pending" | "in-progress" | "completed" | "overdue"
  estimatedSavings: number
  progressPct: number
  type: "negotiation" | "process" | "engineering" | "training" | "supplier" | "schedule"
}

interface PCVApproval {
  id: string
  approver: string
  role: string
  level: "supervisor" | "manager" | "controller" | "cfo"
  status: "approved" | "rejected" | "pending"
  timestamp: string
  comments: string
  amount: number
}

interface PCVJournalEntry {
  id: string
  date: string
  account: string
  accountName: string
  debit: number
  credit: number
  description: string
  ref: string
}

interface CostVarianceItem {
  id: string
  workOrder: string
  partNo: string
  partDescription: string
  category: string
  warehouse: string
  productionLine: string
  status: PCVStatus
  riskLevel: PCVRiskLevel
  plannedCost: number
  actualCost: number
  variance: number
  variancePct: number
  direction: PCVDirection
  qtyProduced: number
  qtyPlanned: number
  uom: string
  plannedUnitCost: number
  actualUnitCost: number
  abc: "A" | "B" | "C"
  supplier: string
  supplierRating: number
  productionStartDate: string
  productionEndDate: string
  costController: string
  productManager: string
  lastVarianceDate: string
  psRef: string
  bomRef: string
  ncrRef?: string
  scarRef?: string
}

// ──────────────────────────────────────────────────────────
// FORMATTERS (module scope for drawer sub-components)
// ──────────────────────────────────────────────────────────

const fmtINR = (n: number): string => {
  if (Math.abs(n) >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n.toFixed(0)}`
}

const fmtNum = (n: number): string => n.toLocaleString("en-IN")

const fmtPct = (n: number): string => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`

const fmtINRFull = (n: number): string => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`

// ──────────────────────────────────────────────────────────
// STATUS / CATEGORY / DIRECTION CONFIG
// ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PCVStatus, {
  label: string
  color: string
  bg: string
  border: string
  pieColor: string
  icon: typeof CheckCircle2
}> = {
  favorable: { label: "Favorable", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-900", pieColor: "#10b981", icon: TrendingDown },
  "on-target": { label: "On Target", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-900", pieColor: "#3b82f6", icon: Target },
  unfavorable: { label: "Unfavorable", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-900", pieColor: "#f59e0b", icon: TrendingUp },
  critical: { label: "Critical", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-50 dark:bg-rose-950/40", border: "border-rose-200 dark:border-rose-900", pieColor: "#f43f5e", icon: XCircle },
  investigating: { label: "Investigating", color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-950/40", border: "border-purple-200 dark:border-purple-900", pieColor: "#a855f7", icon: Search },
  approved: { label: "Approved", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-900", pieColor: "#22c55e", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-50 dark:bg-rose-950/40", border: "border-rose-200 dark:border-rose-900", pieColor: "#ef4444", icon: XCircle },
  "pending-review": { label: "Pending Review", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-50 dark:bg-cyan-950/40", border: "border-cyan-200 dark:border-cyan-900", pieColor: "#06b6d4", icon: Clock },
}

const CATEGORY_CONFIG: Record<PCVCategory, {
  label: string
  color: string
  bg: string
  pieColor: string
  icon: typeof Boxes
}> = {
  material: { label: "Material", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950/50", pieColor: "#3b82f6", icon: Boxes },
  labor: { label: "Labor", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/50", pieColor: "#10b981", icon: Wrench },
  overhead: { label: "Overhead", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950/50", pieColor: "#f59e0b", icon: Factory },
  scrap: { label: "Scrap", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-100 dark:bg-rose-950/50", pieColor: "#f43f5e", icon: XCircle },
  setup: { label: "Setup", color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-100 dark:bg-purple-950/50", pieColor: "#a855f7", icon: Timer },
  subcontract: { label: "Subcontract", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-100 dark:bg-cyan-950/50", pieColor: "#06b6d4", icon: Factory },
}

const RISK_CONFIG: Record<PCVRiskLevel, { label: string; color: string; bg: string; icon: typeof AlertTriangle }> = {
  low: { label: "Low Risk", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/50", icon: CheckCircle2 },
  medium: { label: "Medium Risk", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950/50", icon: AlertTriangle },
  high: { label: "High Risk", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-950/50", icon: AlertTriangle },
  critical: { label: "Critical Risk", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-100 dark:bg-rose-950/50", icon: XCircle },
}

const DIRECTION_CONFIG: Record<PCVDirection, { label: string; color: string; icon: typeof TrendingUp }> = {
  favorable: { label: "Favorable", color: "text-emerald-600 dark:text-emerald-400", icon: TrendingDown },
  unfavorable: { label: "Unfavorable", color: "text-rose-600 dark:text-rose-400", icon: TrendingUp },
  neutral: { label: "Neutral", color: "text-blue-600 dark:text-blue-400", icon: Minus },
}

// ──────────────────────────────────────────────────────────
// HASH-SEEDED DETERMINISTIC MOCK DATA GENERATORS
// ──────────────────────────────────────────────────────────

const seedStr = (s: string): number => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const rng = (seed: number) => {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const pick = <T,>(arr: T[], r: () => number): T => arr[Math.floor(r() * arr.length)]

const generateMonthlyTrend = (seed: string): PCVMonthlyTrend[] => {
  const r = rng(seedStr(seed))
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map((m, i) => {
    const planned = 18 + r() * 12 // 18L-30L
    const variancePct = (r() - 0.45) * 18 // -8.1% to +9.9%
    const actual = planned * (1 + variancePct / 100)
    return {
      month: m,
      plannedCost: Math.round(planned * 100000),
      actualCost: Math.round(actual * 100000),
      variance: Math.round((actual - planned) * 100000),
      variancePct: parseFloat(variancePct.toFixed(2)),
    }
  })
}

const generateCostElements = (item: CostVarianceItem): PCVCostElement[] => {
  const r = rng(seedStr(item.id))
  const elements: PCVCostElement[] = []
  const totalPlanned = item.plannedCost
  // typical cost breakdown: 55% material, 20% labor, 15% overhead, 5% scrap, 3% setup, 2% subcontract
  const splits: { cat: PCVCategory; pct: number }[] = [
    { cat: "material", pct: 0.50 + r() * 0.10 },
    { cat: "labor", pct: 0.17 + r() * 0.06 },
    { cat: "overhead", pct: 0.12 + r() * 0.05 },
    { cat: "scrap", pct: 0.03 + r() * 0.05 },
    { cat: "setup", pct: 0.02 + r() * 0.03 },
    { cat: "subcontract", pct: 0.01 + r() * 0.03 },
  ]
  const norm = splits.reduce((s, x) => s + x.pct, 0)
  for (const sp of splits) {
    const planned = (totalPlanned * sp.pct) / norm
    const variancePct = (r() - 0.45) * 30 // -13.5% to +16.5%
    const actual = planned * (1 + variancePct / 100)
    const direction: PCVDirection =
      Math.abs(variancePct) < 2 ? "neutral" : variancePct > 0 ? "unfavorable" : "favorable"
    const notesMap: Record<PCVCategory, string[]> = {
      material: [
        "Raw steel price hike +7% MoM",
        "Bulk discount realized on brake pad compound",
        "Plating subcontract surcharge",
        "Imported bearing FX impact",
        "Standard cost revision pending",
      ],
      labor: [
        "Overtime authorized for catch-up",
        "Trainee productivity ramp-up",
        "Shift premium for night run",
        "Skilled operator absenteeism",
        "Incentive bonus accrued",
      ],
      overhead: [
        "Power tariff revised upward",
        "Compressor maintenance amortized",
        "Rent escalation clause triggered",
        "Insurance premium prorated",
        "Depreciation on new CNC machine",
      ],
      scrap: [
        "Material rejection at QC stage",
        "Tool wear caused rework",
        "Heat treatment quench failure",
        "Handling damage in transit",
        "First-article scrap during setup",
      ],
      setup: [
        "Tool changeover delayed",
        "Die tryout extended runs",
        "Calibration check repeated",
        "Changeover crew understaffed",
        "Quick-change fixture deployed",
      ],
      subcontract: [
        "Heat treatment outsourced",
        "Surface grinding specialist used",
        "Anodizing job lot surcharge",
        "CNC wire-cut emergency job",
        "Hard chrome plating extra",
      ],
    }
    elements.push({
      category: sp.cat,
      planned: Math.round(planned),
      actual: Math.round(actual),
      unit: "INR",
      variance: Math.round(actual - planned),
      variancePct: parseFloat(variancePct.toFixed(2)),
      direction,
      notes: pick(notesMap[sp.cat], r),
    })
  }
  return elements
}

const generateDrivers = (item: CostVarianceItem): PCVDriver[] => {
  const r = rng(seedStr(item.id + "drivers"))
  const drivers: PCVDriver[] = []
  const totalVar = Math.abs(item.variance)
  if (totalVar < 1000) return drivers
  const driverSeeds: { name: string; cat: PCVCategory; pct: number; desc: string }[] = [
    { name: "Material price variance", cat: "material", pct: 0.30 + r() * 0.20, desc: "Standard vs actual purchase price differential" },
    { name: "Material usage variance", cat: "material", pct: 0.15 + r() * 0.10, desc: "BOM qty vs actual qty consumed per piece" },
    { name: "Labor rate variance", cat: "labor", pct: 0.08 + r() * 0.08, desc: "Standard vs actual hourly labor rate" },
    { name: "Labor efficiency variance", cat: "labor", pct: 0.10 + r() * 0.08, desc: "Standard vs actual hours per unit produced" },
    { name: "Variable overhead variance", cat: "overhead", pct: 0.07 + r() * 0.06, desc: "Spending + efficiency components per labor hour" },
    { name: "Fixed overhead variance", cat: "overhead", pct: 0.05 + r() * 0.05, desc: "Volume + budget variance per allocation base" },
    { name: "Scrap / yield variance", cat: "scrap", pct: 0.06 + r() * 0.05, desc: "Unplanned scrap and rework cost absorption" },
    { name: "Setup time variance", cat: "setup", pct: 0.04 + r() * 0.04, desc: "Planned vs actual changeover time per lot" },
    { name: "Subcontract premium", cat: "subcontract", pct: 0.03 + r() * 0.04, desc: "Outsourced operation cost over standard" },
  ]
  for (const ds of driverSeeds) {
    const impact = Math.round(totalVar * ds.pct)
    if (impact < 500) continue
    const direction: PCVDirection =
      r() > 0.7 ? "favorable" : r() > 0.15 ? "unfavorable" : "neutral"
    const sign = direction === "favorable" ? -1 : direction === "unfavorable" ? 1 : 0
    drivers.push({
      name: ds.name,
      impact: impact * sign,
      impactPct: parseFloat((ds.pct * 100 * sign).toFixed(2)),
      direction,
      category: ds.cat,
      description: ds.desc,
    })
  }
  return drivers.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)).slice(0, 6)
}

const generateRootCauses = (item: CostVarianceItem): PCVRootCause[] => {
  const r = rng(seedStr(item.id + "rootcause"))
  const causes: PCVRootCause[] = []
  const pool: { cat: PCVCategory; desc: string }[] = [
    { cat: "material", desc: "Supplier price escalation not yet captured in standard cost update" },
    { cat: "material", desc: "Higher-than-planned material consumption due to surface tolerance issue" },
    { cat: "material", desc: "Imported bearing FX exposure — INR depreciated 2.3% against USD" },
    { cat: "labor", desc: "Skilled operator on leave, substitute required 1.4x standard hours" },
    { cat: "labor", desc: "New CNC cell still in productivity ramp curve (week 3 of 6)" },
    { cat: "overhead", desc: "Power tariff revision effective July 1, 2026 — pending standard cost roll" },
    { cat: "overhead", desc: "Air compressor unplanned maintenance caused production line stoppage" },
    { cat: "scrap", desc: "Heat treatment quench oil contamination led to 14-piece rejection" },
    { cat: "scrap", desc: "Tool wear not detected by sensor, caused surface finish NCR" },
    { cat: "setup", desc: "Die tryout required additional 3 setup cycles beyond plan" },
    { cat: "subcontract", desc: "Heat treatment vendor applied emergency surcharge for weekend run" },
  ]
  const count = Math.floor(r() * 3) + 2
  const owners = ["Anand Iyer", "Priya Menon", "Rajesh Khanna", "Sunita Reddy", "Vikram Singh", "Meena Joshi"]
  const statuses: PCVRootCause["status"][] = ["open", "investigating", "confirmed", "mitigated"]
  for (let i = 0; i < count; i++) {
    const p = pick(pool, r)
    const probability = Math.round((40 + r() * 60) * 10) / 10
    const impact = Math.round((20 + r() * 80) * 10) / 10
    const riskScore = Math.round((probability * impact) / 100 * 10) / 10
    const daysAgo = Math.floor(r() * 30) + 1
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10)
    causes.push({
      id: `RC-${item.id.split("-")[1]}-${(i + 1).toString().padStart(2, "0")}`,
      category: p.cat,
      description: p.desc,
      probability,
      impact,
      riskScore,
      status: pick(statuses, r),
      owner: pick(owners, r),
      identifiedDate: date,
    })
  }
  return causes.sort((a, b) => b.riskScore - a.riskScore)
}

const generateMitigationActions = (item: CostVarianceItem): PCVMitigationAction[] => {
  const r = rng(seedStr(item.id + "mitigation"))
  const actions: PCVMitigationAction[] = []
  const pool: { desc: string; type: PCVMitigationAction["type"]; est: number }[] = [
    { desc: "Renegotiate raw steel contract with vendor for Q3 lock-in price", type: "negotiation", est: 180000 },
    { desc: "Revise standard cost roll to reflect power tariff revision", type: "process", est: 95000 },
    { desc: "Implement tool wear predictive monitoring on CNC cell", type: "engineering", est: 245000 },
    { desc: "Cross-train second-shift operators to reduce absenteeism impact", type: "training", est: 68000 },
    { desc: "Approve alternate supplier qualification for imported bearing", type: "supplier", est: 155000 },
    { desc: "Optimize production batch size to reduce setup cost per piece", type: "schedule", est: 110000 },
    { desc: "Calibrate heat treatment quench oil sensor monthly", type: "process", est: 42000 },
    { desc: "Roll out quick-change fixture across all 4 production lines", type: "engineering", est: 320000 },
  ]
  const count = Math.floor(r() * 3) + 2
  const owners = ["Anand Iyer", "Priya Menon", "Rajesh Khanna", "Sunita Reddy", "Vikram Singh"]
  const statuses: PCVMitigationAction["status"][] = ["pending", "in-progress", "completed", "overdue"]
  for (let i = 0; i < count; i++) {
    const p = pick(pool, r)
    const daysAhead = Math.floor(r() * 30) + 5
    const dueDate = new Date(Date.now() + daysAhead * 86400000).toISOString().slice(0, 10)
    const status = pick(statuses, r)
    const progressPct = status === "completed" ? 100 : status === "overdue" ? Math.floor(r() * 50) + 20 : status === "in-progress" ? Math.floor(r() * 60) + 30 : Math.floor(r() * 20)
    actions.push({
      id: `MA-${item.id.split("-")[1]}-${(i + 1).toString().padStart(2, "0")}`,
      description: p.desc,
      owner: pick(owners, r),
      dueDate,
      status,
      estimatedSavings: p.est,
      progressPct,
      type: p.type,
    })
  }
  return actions
}

const generateApprovals = (item: CostVarianceItem): PCVApproval[] => {
  const r = rng(seedStr(item.id + "approvals"))
  const approvals: PCVApproval[] = []
  const approvers: { name: string; role: string; level: PCVApproval["level"] }[] = [
    { name: "Karthik Raman", role: "Production Supervisor", level: "supervisor" },
    { name: "Lakshmi Iyer", role: "Operations Manager", level: "manager" },
    { name: "Arjun Nair", role: "Plant Controller", level: "controller" },
    { name: "Deepak Sharma", role: "CFO", level: "cfo" },
  ]
  const thresholds: Record<PCVApproval["level"], number> = {
    supervisor: 50000,
    manager: 200000,
    controller: 1000000,
    cfo: 5000000,
  }
  const absVar = Math.abs(item.variance)
  let status: PCVApproval["status"] = "pending"
  if (absVar < 50000) status = "approved"
  const comments: Record<PCVApproval["status"], string[]> = {
    approved: [
      "Variance within tolerance band, standard cost revision not required",
      "Confirmed — root cause documented, mitigation plan in place",
      "Acceptable variance given production ramp-up phase",
      "Approved — close monitoring next 2 production cycles",
    ],
    rejected: [
      "Insufficient root cause analysis — please provide driver breakdown",
      "Mitigation plan not quantified — resubmit with savings estimate",
      "Variance exceeds tolerance — escalate to plant controller",
    ],
    pending: [
      "Awaiting supervisor review",
      "Pending cost controller verification",
      "Escalated to CFO — variance > 5L threshold",
    ],
  }
  let idx = 0
  for (const a of approvers) {
    if (absVar < thresholds[a.level] && status === "approved") {
      const ts = new Date(Date.now() - (idx + 1) * 86400000).toISOString().slice(0, 16).replace("T", " ")
      approvals.push({
        id: `AP-${item.id.split("-")[1]}-${(idx + 1).toString().padStart(2, "0")}`,
        approver: a.name,
        role: a.role,
        level: a.level,
        status: "approved",
        timestamp: ts,
        comments: pick(comments.approved, r),
        amount: absVar,
      })
    } else if (status === "pending") {
      approvals.push({
        id: `AP-${item.id.split("-")[1]}-${(idx + 1).toString().padStart(2, "0")}`,
        approver: a.name,
        role: a.role,
        level: a.level,
        status: "pending",
        timestamp: "—",
        comments: pick(comments.pending, r),
        amount: absVar,
      })
      break
    } else {
      break
    }
    idx++
  }
  return approvals
}

const generateJournalEntries = (item: CostVarianceItem): PCVJournalEntry[] => {
  const entries: PCVJournalEntry[] = []
  const absVar = Math.abs(item.variance)
  if (absVar < 1000) return entries
  const isUnfav = item.variance > 0
  // Standard cost variance journal entries (Indian GAAP / Ind AS 2 style)
  const date = item.productionEndDate
  const baseId = item.id.split("-")[1]
  if (isUnfav) {
    entries.push({
      id: `JE-${baseId}-001`,
      date,
      account: "WIP-Var-Unfav-Material",
      accountName: "Work in Process — Unfavorable Material Variance",
      debit: Math.round(absVar * 0.55),
      credit: 0,
      description: `Material variance booked for ${item.workOrder}`,
      ref: item.workOrder,
    })
    entries.push({
      id: `JE-${baseId}-002`,
      date,
      account: "WIP-Var-Unfav-Labor",
      accountName: "Work in Process — Unfavorable Labor Variance",
      debit: Math.round(absVar * 0.25),
      credit: 0,
      description: `Labor variance booked for ${item.workOrder}`,
      ref: item.workOrder,
    })
    entries.push({
      id: `JE-${baseId}-003`,
      date,
      account: "WIP-Var-Unfav-OH",
      accountName: "Work in Process — Unfavorable Overhead Variance",
      debit: Math.round(absVar * 0.20),
      credit: 0,
      description: `Overhead variance booked for ${item.workOrder}`,
      ref: item.workOrder,
    })
    entries.push({
      id: `JE-${baseId}-004`,
      date,
      account: "Std-Cost-Variance-Clearing",
      accountName: "Standard Cost Variance Clearing Account",
      debit: 0,
      credit: absVar,
      description: `Offset to variance booking — ${item.workOrder}`,
      ref: item.workOrder,
    })
  } else {
    entries.push({
      id: `JE-${baseId}-001`,
      date,
      account: "Std-Cost-Variance-Clearing",
      accountName: "Standard Cost Variance Clearing Account",
      debit: absVar,
      credit: 0,
      description: `Favorable variance clearing — ${item.workOrder}`,
      ref: item.workOrder,
    })
    entries.push({
      id: `JE-${baseId}-002`,
      date,
      account: "WIP-Var-Fav-Material",
      accountName: "Work in Process — Favorable Material Variance",
      debit: 0,
      credit: Math.round(absVar * 0.55),
      description: `Material favorable variance — ${item.workOrder}`,
      ref: item.workOrder,
    })
    entries.push({
      id: `JE-${baseId}-003`,
      date,
      account: "WIP-Var-Fav-Labor",
      accountName: "Work in Process — Favorable Labor Variance",
      debit: 0,
      credit: Math.round(absVar * 0.25),
      description: `Labor favorable variance — ${item.workOrder}`,
      ref: item.workOrder,
    })
    entries.push({
      id: `JE-${baseId}-004`,
      date,
      account: "WIP-Var-Fav-OH",
      accountName: "Work in Process — Favorable Overhead Variance",
      debit: 0,
      credit: Math.round(absVar * 0.20),
      description: `Overhead favorable variance — ${item.workOrder}`,
      ref: item.workOrder,
    })
  }
  return entries
}

// ──────────────────────────────────────────────────────────
// MOCK DATA — 16 PCV ITEMS (Indian automotive parts)
// ──────────────────────────────────────────────────────────

const PCV_ITEMS: CostVarianceItem[] = [
  {
    id: "PCV-2026-9001", workOrder: "WO-2026-1001", partNo: "BRK-PAD-PC-001", partDescription: "Brake Pad Assembly — Passenger Car",
    category: "Brakes", warehouse: "Chennai Hub", productionLine: "Line-A1", status: "unfavorable", riskLevel: "high",
    plannedCost: 2840000, actualCost: 3128000, variance: 288000, variancePct: 10.14, direction: "unfavorable",
    qtyProduced: 14200, qtyPlanned: 15000, uom: "EA", plannedUnitCost: 189.33, actualUnitCost: 220.28,
    abc: "A", supplier: "BrakeTech India Pvt Ltd", supplierRating: 4.6,
    productionStartDate: "2026-07-01", productionEndDate: "2026-07-15",
    costController: "Anand Iyer", productManager: "Priya Menon", lastVarianceDate: "2026-07-25",
    psRef: "PS-2026-4001", bomRef: "BOM-2026-001", ncrRef: "NCR-2026-6001", scarRef: "SCAR-2026-3001",
  },
  {
    id: "PCV-2026-9002", workOrder: "WO-2026-1002", partNo: "WHL-RIM-15-IN", partDescription: "Wheel Rim 15-inch — Alloy",
    category: "Wheels", warehouse: "Pune DC", productionLine: "Line-B2", status: "favorable", riskLevel: "low",
    plannedCost: 4280000, actualCost: 4012000, variance: -268000, variancePct: -6.26, direction: "favorable",
    qtyProduced: 8500, qtyPlanned: 8500, uom: "EA", plannedUnitCost: 503.53, actualUnitCost: 472.00,
    abc: "A", supplier: "AlloyWheels Co", supplierRating: 4.8,
    productionStartDate: "2026-07-05", productionEndDate: "2026-07-20",
    costController: "Rajesh Khanna", productManager: "Sunita Reddy", lastVarianceDate: "2026-07-22",
    psRef: "PS-2026-4002", bomRef: "BOM-2026-002",
  },
  {
    id: "PCV-2026-9003", workOrder: "WO-2026-1003", partNo: "ENG-BLK-CST-4C", partDescription: "Engine Block — Cast Iron 4-Cylinder",
    category: "Engine", warehouse: "Chennai Hub", productionLine: "Line-C1", status: "critical", riskLevel: "critical",
    plannedCost: 12580000, actualCost: 14820000, variance: 2240000, variancePct: 17.81, direction: "unfavorable",
    qtyProduced: 1800, qtyPlanned: 2000, uom: "EA", plannedUnitCost: 6290.00, actualUnitCost: 8233.33,
    abc: "A", supplier: "CastIndia Foundry", supplierRating: 4.2,
    productionStartDate: "2026-06-20", productionEndDate: "2026-07-18",
    costController: "Anand Iyer", productManager: "Vikram Singh", lastVarianceDate: "2026-07-24",
    psRef: "PS-2026-4003", bomRef: "BOM-2026-003", ncrRef: "NCR-2026-6002",
  },
  {
    id: "PCV-2026-9004", workOrder: "WO-2026-1004", partNo: "CAL-SEAL-VIT-A", partDescription: "Caliper Seal Kit — Viton A",
    category: "Brakes", warehouse: "Delhi NCR", productionLine: "Line-A3", status: "on-target", riskLevel: "low",
    plannedCost: 685000, actualCost: 698000, variance: 13000, variancePct: 1.90, direction: "neutral",
    qtyProduced: 22000, qtyPlanned: 22000, uom: "SET", plannedUnitCost: 31.14, actualUnitCost: 31.73,
    abc: "B", supplier: "SealMaster India", supplierRating: 4.5,
    productionStartDate: "2026-07-08", productionEndDate: "2026-07-22",
    costController: "Meena Joshi", productManager: "Priya Menon", lastVarianceDate: "2026-07-24",
    psRef: "PS-2026-4004", bomRef: "BOM-2026-004",
  },
  {
    id: "PCV-2026-9005", workOrder: "WO-2026-1005", partNo: "SHK-ABS-GAS-STD", partDescription: "Shock Absorber — Gas Charged Standard",
    category: "Suspension", warehouse: "Mumbai West", productionLine: "Line-D2", status: "unfavorable", riskLevel: "medium",
    plannedCost: 3450000, actualCost: 3698000, variance: 248000, variancePct: 7.19, direction: "unfavorable",
    qtyProduced: 6500, qtyPlanned: 6800, uom: "EA", plannedUnitCost: 530.77, actualUnitCost: 568.92,
    abc: "A", supplier: "SuspensionPro", supplierRating: 4.4,
    productionStartDate: "2026-07-03", productionEndDate: "2026-07-21",
    costController: "Rajesh Khanna", productManager: "Vikram Singh", lastVarianceDate: "2026-07-25",
    psRef: "PS-2026-4005", bomRef: "BOM-2026-005", ncrRef: "NCR-2026-6003",
  },
  {
    id: "PCV-2026-9006", workOrder: "WO-2026-1006", partNo: "BAT-LION-72V-50", partDescription: "Li-Ion Battery Pack 72V/50Ah",
    category: "Electrical", warehouse: "Chennai Hub", productionLine: "Line-EV1", status: "investigating", riskLevel: "high",
    plannedCost: 18950000, actualCost: 21280000, variance: 2330000, variancePct: 12.30, direction: "unfavorable",
    qtyProduced: 850, qtyPlanned: 900, uom: "EA", plannedUnitCost: 21055.56, actualUnitCost: 25035.29,
    abc: "A", supplier: "PowerCell Energy", supplierRating: 4.3,
    productionStartDate: "2026-06-25", productionEndDate: "2026-07-23",
    costController: "Anand Iyer", productManager: "Sunita Reddy", lastVarianceDate: "2026-07-25",
    psRef: "PS-2026-4006", bomRef: "BOM-2026-006", ncrRef: "NCR-2026-6004", scarRef: "SCAR-2026-3002",
  },
  {
    id: "PCV-2026-9007", workOrder: "WO-2026-1007", partNo: "TIR-BEAD-175-65", partDescription: "Tire Bead Wire 175/65 R14",
    category: "Tires", warehouse: "Pune DC", productionLine: "Line-F1", status: "favorable", riskLevel: "low",
    plannedCost: 1280000, actualCost: 1192000, variance: -88000, variancePct: -6.88, direction: "favorable",
    qtyProduced: 18000, qtyPlanned: 18000, uom: "EA", plannedUnitCost: 71.11, actualUnitCost: 66.22,
    abc: "B", supplier: "BeadMaster", supplierRating: 4.7,
    productionStartDate: "2026-07-10", productionEndDate: "2026-07-22",
    costController: "Meena Joshi", productManager: "Rajesh Khanna", lastVarianceDate: "2026-07-23",
    psRef: "PS-2026-4007", bomRef: "BOM-2026-007",
  },
  {
    id: "PCV-2026-9008", workOrder: "WO-2026-1008", partNo: "WRN-HAR-FRT-LH", partDescription: "Wiring Harness — Front LH",
    category: "Electrical", warehouse: "Delhi NCR", productionLine: "Line-G2", status: "pending-review", riskLevel: "medium",
    plannedCost: 2240000, actualCost: 2398000, variance: 158000, variancePct: 7.05, direction: "unfavorable",
    qtyProduced: 4200, qtyPlanned: 4500, uom: "EA", plannedUnitCost: 533.33, actualUnitCost: 570.95,
    abc: "B", supplier: "WireTech Solutions", supplierRating: 4.1,
    productionStartDate: "2026-07-05", productionEndDate: "2026-07-24",
    costController: "Vikram Singh", productManager: "Meena Joshi", lastVarianceDate: "2026-07-25",
    psRef: "PS-2026-4008", bomRef: "BOM-2026-008", ncrRef: "NCR-2026-6005",
  },
  {
    id: "PCV-2026-9009", workOrder: "WO-2026-1009", partNo: "BLT-ENG-M8-HEX", partDescription: "Engine Bolt M8 Hex — Grade 10.9",
    category: "Fasteners", warehouse: "Kolkata East", productionLine: "Line-H1", status: "on-target", riskLevel: "low",
    plannedCost: 425000, actualCost: 432000, variance: 7000, variancePct: 1.65, direction: "neutral",
    qtyProduced: 85000, qtyPlanned: 85000, uom: "EA", plannedUnitCost: 5.00, actualUnitCost: 5.08,
    abc: "C", supplier: "FastenWell", supplierRating: 4.5,
    productionStartDate: "2026-07-12", productionEndDate: "2026-07-23",
    costController: "Meena Joshi", productManager: "Rajesh Khanna", lastVarianceDate: "2026-07-24",
    psRef: "PS-2026-4009", bomRef: "BOM-2026-009",
  },
  {
    id: "PCV-2026-9010", workOrder: "WO-2026-1010", partNo: "OIL-ENG-5W30-4L", partDescription: "Engine Oil 5W-30 Synthetic — 4L",
    category: "Fluids", warehouse: "Mumbai West", productionLine: "Line-I2", status: "approved", riskLevel: "low",
    plannedCost: 1820000, actualCost: 1748000, variance: -72000, variancePct: -3.96, direction: "favorable",
    qtyProduced: 12000, qtyPlanned: 12000, uom: "EA", plannedUnitCost: 151.67, actualUnitCost: 145.67,
    abc: "B", supplier: "LubeTech India", supplierRating: 4.6,
    productionStartDate: "2026-07-08", productionEndDate: "2026-07-20",
    costController: "Anand Iyer", productManager: "Vikram Singh", lastVarianceDate: "2026-07-22",
    psRef: "PS-2026-4010", bomRef: "BOM-2026-010",
  },
  {
    id: "PCV-2026-9011", workOrder: "WO-2026-1011", partNo: "WSH-LAM-SED-FRT", partDescription: "Windshield Laminated — Sedan Front",
    category: "Body", warehouse: "Pune DC", productionLine: "Line-J1", status: "rejected", riskLevel: "high",
    plannedCost: 3120000, actualCost: 3650000, variance: 530000, variancePct: 16.99, direction: "unfavorable",
    qtyProduced: 1450, qtyPlanned: 1600, uom: "EA", plannedUnitCost: 1950.00, actualUnitCost: 2517.24,
    abc: "A", supplier: "GlassPro Automotive", supplierRating: 4.0,
    productionStartDate: "2026-06-28", productionEndDate: "2026-07-22",
    costController: "Rajesh Khanna", productManager: "Sunita Reddy", lastVarianceDate: "2026-07-25",
    psRef: "PS-2026-4011", bomRef: "BOM-2026-011", ncrRef: "NCR-2026-6006", scarRef: "SCAR-2026-3003",
  },
  {
    id: "PCV-2026-9012", workOrder: "WO-2026-1012", partNo: "RAD-CAP-PRES-1.1", partDescription: "Radiator Pressure Cap 1.1 Bar",
    category: "Cooling", warehouse: "Chennai Hub", productionLine: "Line-K3", status: "favorable", riskLevel: "low",
    plannedCost: 218000, actualCost: 209000, variance: -9000, variancePct: -4.13, direction: "favorable",
    qtyProduced: 28000, qtyPlanned: 28000, uom: "EA", plannedUnitCost: 7.79, actualUnitCost: 7.46,
    abc: "C", supplier: "CoolComp", supplierRating: 4.4,
    productionStartDate: "2026-07-15", productionEndDate: "2026-07-24",
    costController: "Meena Joshi", productManager: "Rajesh Khanna", lastVarianceDate: "2026-07-25",
    psRef: "PS-2026-4012", bomRef: "BOM-2026-012",
  },
  {
    id: "PCV-2026-9013", workOrder: "WO-2026-1013", partNo: "AIR-FLT-CAE-STD", partDescription: "Air Filter Cartridge — Standard",
    category: "Filters", warehouse: "Delhi NCR", productionLine: "Line-L2", status: "on-target", riskLevel: "low",
    plannedCost: 580000, actualCost: 590000, variance: 10000, variancePct: 1.72, direction: "neutral",
    qtyProduced: 18000, qtyPlanned: 18000, uom: "EA", plannedUnitCost: 32.22, actualUnitCost: 32.78,
    abc: "C", supplier: "FilterPro India", supplierRating: 4.5,
    productionStartDate: "2026-07-12", productionEndDate: "2026-07-23",
    costController: "Vikram Singh", productManager: "Meena Joshi", lastVarianceDate: "2026-07-24",
    psRef: "PS-2026-4013", bomRef: "BOM-2026-013",
  },
  {
    id: "PCV-2026-9014", workOrder: "WO-2026-1014", partNo: "SPK-PLG-IRI-NGK", partDescription: "Spark Plug Iridium — NGK Spec",
    category: "Ignition", warehouse: "Kolkata East", productionLine: "Line-M1", status: "unfavorable", riskLevel: "medium",
    plannedCost: 980000, actualCost: 1085000, variance: 105000, variancePct: 10.71, direction: "unfavorable",
    qtyProduced: 14000, qtyPlanned: 15000, uom: "EA", plannedUnitCost: 70.00, actualUnitCost: 77.50,
    abc: "B", supplier: "IgniteCo", supplierRating: 4.3,
    productionStartDate: "2026-07-06", productionEndDate: "2026-07-22",
    costController: "Anand Iyer", productManager: "Vikram Singh", lastVarianceDate: "2026-07-24",
    psRef: "PS-2026-4014", bomRef: "BOM-2026-014", ncrRef: "NCR-2026-6007",
  },
  {
    id: "PCV-2026-9015", workOrder: "WO-2026-1015", partNo: "CLU-FAI-ASSY-225", partDescription: "Clutch FAI Assembly 225mm",
    category: "Transmission", warehouse: "Mumbai West", productionLine: "Line-N2", status: "investigating", riskLevel: "medium",
    plannedCost: 3450000, actualCost: 3820000, variance: 370000, variancePct: 10.72, direction: "unfavorable",
    qtyProduced: 2200, qtyPlanned: 2400, uom: "EA", plannedUnitCost: 1568.18, actualUnitCost: 1736.36,
    abc: "A", supplier: "ClutchTech India", supplierRating: 4.4,
    productionStartDate: "2026-07-02", productionEndDate: "2026-07-23",
    costController: "Rajesh Khanna", productManager: "Sunita Reddy", lastVarianceDate: "2026-07-25",
    psRef: "PS-2026-4015", bomRef: "BOM-2026-015", ncrRef: "NCR-2026-6008",
  },
  {
    id: "PCV-2026-9016", workOrder: "WO-2026-1016", partNo: "HMT-SHL-MOT-Full", partDescription: "Helmet Shell — Full Face Motorbike",
    category: "Accessories", warehouse: "Pune DC", productionLine: "Line-O1", status: "favorable", riskLevel: "low",
    plannedCost: 1180000, actualCost: 1112000, variance: -68000, variancePct: -5.76, direction: "favorable",
    qtyProduced: 5500, qtyPlanned: 5500, uom: "EA", plannedUnitCost: 214.55, actualUnitCost: 202.18,
    abc: "B", supplier: "ShellMakers Co", supplierRating: 4.7,
    productionStartDate: "2026-07-09", productionEndDate: "2026-07-22",
    costController: "Meena Joshi", productManager: "Rajesh Khanna", lastVarianceDate: "2026-07-23",
    psRef: "PS-2026-4016", bomRef: "BOM-2026-016",
  },
]

// ──────────────────────────────────────────────────────────
// DETAIL DRAWER (inline sub-component)
// ──────────────────────────────────────────────────────────

interface DrawerProps {
  item: CostVarianceItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CostVarianceDetailDrawer({ item, open, onOpenChange }: DrawerProps) {
  const [activeTab, setActiveTab] = useState<string>("overview")
  const { toast } = useToast()

  // Stable references for memo-derived data
  const monthlyTrend = useMemo(() => (item ? generateMonthlyTrend(item.id) : []), [item])
  const costElements = useMemo(() => (item ? generateCostElements(item) : []), [item])
  const drivers = useMemo(() => (item ? generateDrivers(item) : []), [item])
  const rootCauses = useMemo(() => (item ? generateRootCauses(item) : []), [item])
  const mitigationActions = useMemo(() => (item ? generateMitigationActions(item) : []), [item])
  const approvals = useMemo(() => (item ? generateApprovals(item) : []), [item])
  const journalEntries = useMemo(() => (item ? generateJournalEntries(item) : []), [item])

  if (!item) return null

  const statusCfg = STATUS_CONFIG[item.status]
  const riskCfg = RISK_CONFIG[item.riskLevel]
  const StatusIcon = statusCfg.icon
  const RiskIcon = riskCfg.icon
  const dirCfg = DIRECTION_CONFIG[item.direction]
  const DirIcon = dirCfg.icon

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "elements", label: "Cost Elements", icon: Layers },
    { id: "drivers", label: "Variance Drivers", icon: Calculator },
    { id: "rootcause", label: "Root Causes", icon: Crosshair },
    { id: "mitigation", label: "Mitigation", icon: Lightbulb },
    { id: "approvals", label: "Approvals", icon: ClipboardList },
  ]

  const totalDebit = journalEntries.reduce((s, e) => s + e.debit, 0)
  const totalCredit = journalEntries.reduce((s, e) => s + e.credit, 0)
  const totalMitigationSavings = mitigationActions.reduce((s, a) => s + a.estimatedSavings, 0)
  const avgMitigationProgress = mitigationActions.length
    ? Math.round(mitigationActions.reduce((s, a) => s + a.progressPct, 0) / mitigationActions.length)
    : 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-5xl overflow-y-auto p-0 flex flex-col",
          "bg-gradient-to-br from-white via-white to-blue-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-blue-950/20",
          "pcv-drawer-sheen"
        )}
      >
        {/* Header */}
        <SheetHeader className={cn("p-6 pb-4 border-b space-y-3 pcv-drawer-header", statusCfg.bg, statusCfg.border)}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn("border", statusCfg.bg, statusCfg.color, statusCfg.border)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusCfg.label}
                </Badge>
                <Badge variant="outline" className={cn("border", riskCfg.bg, riskCfg.color)}>
                  <RiskIcon className="h-3 w-3 mr-1" />
                  {riskCfg.label}
                </Badge>
                <Badge variant="outline" className={cn(dirCfg.color, "font-medium")}>
                  <DirIcon className="h-3 w-3 mr-1" />
                  {fmtPct(item.variancePct)}
                </Badge>
                <Badge variant="outline" className="badge-interactive text-xs">
                  ABC-{item.abc}
                </Badge>
              </div>
              <SheetTitle className="text-xl font-bold leading-tight">
                {item.partDescription}
              </SheetTitle>
              <SheetDescription className="text-xs flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><Hash className="h-3 w-3" />{item.id}</span>
                <span>•</span>
                <span>WO: {item.workOrder}</span>
                <span>•</span>
                <span>Part: {item.partNo}</span>
                <span>•</span>
                <span>Line: {item.productionLine}</span>
              </SheetDescription>
            </div>
          </div>

          {/* 4 hero stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div className="rounded-lg border bg-card p-3 space-y-1 pcv-stat-enter" style={{ animationDelay: "0ms" }}>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide">
                <IndianRupee className="h-3 w-3" /> Planned Cost
              </div>
              <div className="text-base font-bold text-blue-700 dark:text-blue-300">{fmtINRFull(item.plannedCost)}</div>
              <div className="text-[10px] text-muted-foreground">{fmtINR(item.plannedCost)} total</div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1 pcv-stat-enter" style={{ animationDelay: "60ms" }}>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide">
                <Receipt className="h-3 w-3" /> Actual Cost
              </div>
              <div className="text-base font-bold text-amber-700 dark:text-amber-300">{fmtINRFull(item.actualCost)}</div>
              <div className="text-[10px] text-muted-foreground">{fmtINR(item.actualCost)} total</div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1 pcv-stat-enter" style={{ animationDelay: "120ms" }}>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide">
                <Scale className="h-3 w-3" /> Variance
              </div>
              <div className={cn("text-base font-bold flex items-center gap-1", dirCfg.color)}>
                <DirIcon className="h-4 w-4" />
                {item.variance > 0 ? "+" : ""}{fmtINR(item.variance)}
              </div>
              <div className="text-[10px] text-muted-foreground">{fmtPct(item.variancePct)} vs plan</div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1 pcv-stat-enter" style={{ animationDelay: "180ms" }}>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide">
                <Percent className="h-3 w-3" /> Unit Cost Δ
              </div>
              <div className={cn("text-base font-bold", dirCfg.color)}>
                {fmtINRFull(item.actualUnitCost - item.plannedUnitCost)}
              </div>
              <div className="text-[10px] text-muted-foreground">
                ₹{item.plannedUnitCost.toFixed(2)} → ₹{item.actualUnitCost.toFixed(2)}
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
          <div className="flex gap-1 px-3 py-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all pcv-tab-btn",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-4 pcv-body-enter">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Cost Summary 3-card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="hover-lift-sm border-blue-200 dark:border-blue-900 pcv-card-enter">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                      <Wallet className="h-3.5 w-3.5" /> Planned Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="inner-glow glass-subtle space-y-1">
                    <div className="text-xl font-bold">{fmtINRFull(item.plannedCost)}</div>
                    <div className="text-xs text-muted-foreground">{fmtNum(item.qtyPlanned)} units planned @ ₹{item.plannedUnitCost.toFixed(2)}/unit</div>
                  </CardContent>
                </Card>
                <Card className="hover-lift-sm border-amber-200 dark:border-amber-900 pcv-card-enter">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                      <Receipt className="h-3.5 w-3.5" /> Actual Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="inner-glow glass-subtle space-y-1">
                    <div className="text-xl font-bold">{fmtINRFull(item.actualCost)}</div>
                    <div className="text-xs text-muted-foreground">{fmtNum(item.qtyProduced)} units produced @ ₹{item.actualUnitCost.toFixed(2)}/unit</div>
                  </CardContent>
                </Card>
                <Card className={cn("border pcv-card-enter", dirCfg.color.replace("text-", "border-"))}>
                  <CardHeader className="pb-2">
                    <CardTitle className={cn("text-xs flex items-center gap-1.5", dirCfg.color)}>
                      <Scale className="h-3.5 w-3.5" /> Variance Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="inner-glow glass-subtle space-y-1">
                    <div className={cn("text-xl font-bold flex items-center gap-1", dirCfg.color)}>
                      <DirIcon className="h-4 w-4" />
                      {item.variance > 0 ? "+" : ""}{fmtINR(item.variance)}
                    </div>
                    <div className="text-xs text-muted-foreground">{fmtPct(item.variancePct)} vs planned · {fmtNum(Math.abs(item.qtyProduced - item.qtyPlanned))} qty gap</div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Trend Chart */}
              <Card className="hover-lift-sm pcv-card-enter">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" /> 6-Month Cost Trend (Planned vs Actual)
                  </CardTitle>
                  <CardDescription className="text-xs">Rolling 6-month variance pattern for this part number</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={monthlyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => fmtINR(v)} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="plannedCost" name="Planned Cost" stroke="#3b82f6" strokeWidth={2} fill="url(#plannedGrad)" />
                      <Area type="monotone" dataKey="actualCost" name="Actual Cost" stroke="#f59e0b" strokeWidth={2} fill="url(#actualGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Traceability */}
              <Card className="hover-lift-sm pcv-card-enter">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-600" /> Traceability & Ownership
                  </CardTitle>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Production Schedule</div>
                    <div className="font-mono font-medium text-blue-700 dark:text-blue-300">{item.psRef}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">BOM Reference</div>
                    <div className="font-mono font-medium text-blue-700 dark:text-blue-300">{item.bomRef}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Cost Controller</div>
                    <div className="font-medium">{item.costController}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Product Manager</div>
                    <div className="font-medium">{item.productManager}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Production Start</div>
                    <div className="font-medium">{item.productionStartDate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Production End</div>
                    <div className="font-medium">{item.productionEndDate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Linked NCR</div>
                    <div className="font-mono font-medium text-rose-700 dark:text-rose-300">{item.ncrRef || "—"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Linked SCAR</div>
                    <div className="font-mono font-medium text-rose-700 dark:text-rose-300">{item.scarRef || "—"}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Supplier card */}
              <Card className="hover-lift-sm pcv-card-enter">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Factory className="h-4 w-4 text-emerald-600" /> Supplier Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Supplier Name</div>
                    <div className="font-medium text-sm">{item.supplier}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Supplier Rating</div>
                    <Badge className="badge-interactive bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                      <Star className="h-3 w-3 mr-1 inline" />
                      {item.supplierRating.toFixed(1)} / 5.0
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Last Variance Date</div>
                    <div className="font-medium">{item.lastVarianceDate}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "elements" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" /> Cost Element Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs">Planned vs Actual variance by cost category ({costElements.length} elements)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-md border">
                    <Table className="table-hover-highlight">
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="text-xs">Category</TableHead>
                          <TableHead className="text-xs text-right">Planned</TableHead>
                          <TableHead className="text-xs text-right">Actual</TableHead>
                          <TableHead className="text-xs text-right">Variance</TableHead>
                          <TableHead className="text-xs text-right">%</TableHead>
                          <TableHead className="text-xs">Direction</TableHead>
                          <TableHead className="text-xs">Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {costElements.map((el) => {
                          const cfg = CATEGORY_CONFIG[el.category]
                          const Icon = cfg.icon
                          const elDir = DIRECTION_CONFIG[el.direction]
                          const ElDirIcon = elDir.icon
                          return (
                            <TableRow key={el.category} className="text-xs">
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={cn("rounded-md p-1.5", cfg.bg)}>
                                    <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
                                  </div>
                                  <span className="font-medium">{cfg.label}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-mono">{fmtINR(el.planned)}</TableCell>
                              <TableCell className="text-right font-mono">{fmtINR(el.actual)}</TableCell>
                              <TableCell className={cn("text-right font-mono font-medium", elDir.color)}>
                                {el.variance > 0 ? "+" : ""}{fmtINR(el.variance)}
                              </TableCell>
                              <TableCell className={cn("text-right font-mono font-medium", elDir.color)}>
                                {fmtPct(el.variancePct)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn("text-[10px]", elDir.color)}>
                                  <ElDirIcon className="h-3 w-3 mr-1" />
                                  {elDir.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{el.notes}</TableCell>
                            </TableRow>
                          )
                        })}
                        <TableRow className="bg-muted/40 font-bold">
                          <TableCell>Total</TableCell>
                          <TableCell className="numeric-cell text-right font-mono">{fmtINR(item.plannedCost)}</TableCell>
                          <TableCell className="numeric-cell text-right font-mono">{fmtINR(item.actualCost)}</TableCell>
                          <TableCell className={cn("text-right font-mono", dirCfg.color)}>
                            {item.variance > 0 ? "+" : ""}{fmtINR(item.variance)}
                          </TableCell>
                          <TableCell className={cn("text-right font-mono", dirCfg.color)}>{fmtPct(item.variancePct)}</TableCell>
                          <TableCell colSpan={2} />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Cost element bar chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-600" /> Planned vs Actual by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={costElements.map(el => ({ name: CATEGORY_CONFIG[el.category].label, Planned: el.planned, Actual: el.actual, Variance: el.variance }))} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => fmtINR(v)} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Planned" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Actual" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Variance" radius={[3, 3, 0, 0]}>
                        {costElements.map((el, i) => (
                          <Cell key={i} fill={el.variance > 0 ? "#f43f5e" : el.variance < 0 ? "#10b981" : "#94a3b8"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "drivers" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-purple-600" /> Variance Drivers — Top {drivers.length}
                  </CardTitle>
                  <CardDescription className="text-xs">Quantified impact of each variance driver, sorted by absolute value</CardDescription>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle space-y-2">
                  {drivers.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No significant drivers identified (variance below ₹1,000 threshold).
                    </div>
                  )}
                  {drivers.map((driver, idx) => {
                    const cfg = CATEGORY_CONFIG[driver.category]
                    const Icon = cfg.icon
                    const dDir = DIRECTION_CONFIG[driver.direction]
                    const DirIcon2 = dDir.icon
                    const absImpact = Math.abs(driver.impact)
                    const maxAbs = Math.max(...drivers.map(d => Math.abs(d.impact)))
                    const barPct = maxAbs > 0 ? (absImpact / maxAbs) * 100 : 0
                    return (
                      <div key={idx} className="rounded-lg border bg-card p-3 space-y-2 pcv-card-enter">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <div className={cn("rounded-md p-1.5 shrink-0", cfg.bg)}>
                              <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <div className="text-sm font-medium">{driver.name}</div>
                              <div className="text-xs text-muted-foreground">{driver.description}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className={cn("text-sm font-bold font-mono flex items-center gap-1 justify-end", dDir.color)}>
                              <DirIcon2 className="h-3.5 w-3.5" />
                              {driver.impact > 0 ? "+" : ""}{fmtINR(driver.impact)}
                            </div>
                            <div className={cn("text-[10px] font-mono", dDir.color)}>{fmtPct(driver.impactPct)} of variance</div>
                          </div>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", driver.direction === "favorable" ? "bg-emerald-500" : driver.direction === "unfavorable" ? "bg-rose-500" : "bg-blue-500")}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "rootcause" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Crosshair className="h-4 w-4 text-purple-600" /> Root Cause Analysis — {rootCauses.length} identified
                  </CardTitle>
                  <CardDescription className="text-xs">Ranked by risk score (probability × impact)</CardDescription>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle space-y-2">
                  {rootCauses.map((rc) => {
                    const cfg = CATEGORY_CONFIG[rc.category]
                    const Icon = cfg.icon
                    const statusColor = rc.status === "open" ? "text-rose-600" : rc.status === "investigating" ? "text-amber-600" : rc.status === "confirmed" ? "text-purple-600" : "text-emerald-600"
                    const statusBg = rc.status === "open" ? "bg-rose-50 dark:bg-rose-950/30" : rc.status === "investigating" ? "bg-amber-50 dark:bg-amber-950/30" : rc.status === "confirmed" ? "bg-purple-50 dark:bg-purple-950/30" : "bg-emerald-50 dark:bg-emerald-950/30"
                    return (
                      <div key={rc.id} className={cn("rounded-lg border bg-card p-3 space-y-2 pcv-card-enter", statusBg)}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <div className={cn("rounded-md p-1.5 shrink-0", cfg.bg)}>
                              <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[10px] text-muted-foreground">{rc.id}</span>
                                <Badge variant="outline" className={cn("text-[10px]", statusColor)}>
                                  {rc.status}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">Owner: {rc.owner}</span>
                                <span className="text-[10px] text-muted-foreground">Identified: {rc.identifiedDate}</span>
                              </div>
                              <div className="text-sm">{rc.description}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0 space-y-1">
                            <div className={cn("text-sm font-bold", rc.riskScore >= 50 ? "text-rose-600" : rc.riskScore >= 25 ? "text-amber-600" : "text-emerald-600")}>
                              Score: {rc.riskScore.toFixed(1)}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Probability</div>
                            <div className="text-xs font-medium">{rc.probability.toFixed(1)}%</div>
                            <div className="h-1 bg-muted rounded-full overflow-hidden mt-0.5">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${rc.probability}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Impact</div>
                            <div className="text-xs font-medium">{rc.impact.toFixed(1)}%</div>
                            <div className="h-1 bg-muted rounded-full overflow-hidden mt-0.5">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${rc.impact}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Risk</div>
                            <div className="text-xs font-medium">{rc.riskScore.toFixed(1)}/100</div>
                            <div className="h-1 bg-muted rounded-full overflow-hidden mt-0.5">
                              <div className={cn("h-full rounded-full", rc.riskScore >= 50 ? "bg-rose-500" : rc.riskScore >= 25 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${rc.riskScore}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "mitigation" && (
            <div className="space-y-4">
              <Card className="hover-lift-sm border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/10">
                <CardContent className="inner-glow glass-subtle pt-4 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Total Estimated Savings</div>
                    <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{fmtINR(totalMitigationSavings)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Avg Progress</div>
                    <div className="text-lg font-bold">{avgMitigationProgress}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground uppercase tracking-wide text-[10px]">Active Actions</div>
                    <div className="text-lg font-bold">{mitigationActions.length}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600" /> Mitigation Actions — {mitigationActions.length} active
                  </CardTitle>
                  <CardDescription className="text-xs">Cost recovery actions with estimated savings and progress tracking</CardDescription>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle space-y-2">
                  {mitigationActions.map((action) => {
                    const typeIcons: Record<PCVMitigationAction["type"], typeof Wrench> = {
                      negotiation: IndianRupee,
                      process: SettingsIcon,
                      engineering: Wrench,
                      training: BookOpen,
                      supplier: Factory,
                      schedule: Calendar,
                    }
                    const TypeIcon = typeIcons[action.type]
                    const statusColors = {
                      pending: "text-muted-foreground bg-muted/50",
                      "in-progress": "text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300",
                      completed: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300",
                      overdue: "text-rose-700 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-300",
                    }
                    return (
                      <div key={action.id} className="rounded-lg border bg-card p-3 space-y-2 pcv-card-enter">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <div className="rounded-md p-1.5 bg-amber-100 dark:bg-amber-950/50 shrink-0">
                              <TypeIcon className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300" />
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[10px] text-muted-foreground">{action.id}</span>
                                <Badge variant="outline" className={cn("text-[10px] capitalize", statusColors[action.status])}>
                                  {action.status.replace("-", " ")}
                                </Badge>
                                <Badge variant="outline" className="badge-interactive text-[10px] capitalize">
                                  {action.type}
                                </Badge>
                              </div>
                              <div className="text-sm">{action.description}</div>
                              <div className="text-[10px] text-muted-foreground">Owner: {action.owner} · Due: {action.dueDate}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs text-muted-foreground">Est. Savings</div>
                            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{fmtINR(action.estimatedSavings)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={action.progressPct} className="h-1.5 flex-1" />
                          <span className="text-[10px] font-mono w-10 text-right">{action.progressPct}%</span>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-blue-600" /> Approval Workflow
                  </CardTitle>
                  <CardDescription className="text-xs">Multi-tier approval chain based on variance amount threshold</CardDescription>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle space-y-2">
                  {approvals.map((ap, idx) => {
                    const levelColors: Record<PCVApproval["level"], string> = {
                      supervisor: "text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300",
                      manager: "text-purple-700 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-300",
                      controller: "text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-300",
                      cfo: "text-rose-700 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-300",
                    }
                    const statusIcon = ap.status === "approved" ? CheckCircle2 : ap.status === "rejected" ? XCircle : Clock
                    const StatusIcon2 = statusIcon
                    const statusColor = ap.status === "approved" ? "text-emerald-600" : ap.status === "rejected" ? "text-rose-600" : "text-amber-600"
                    return (
                      <div key={ap.id} className="flex items-stretch gap-2 pcv-card-enter">
                        <div className="flex flex-col items-center">
                          <div className={cn("rounded-full p-2", levelColors[ap.level])}>
                            <StatusIcon2 className={cn("h-4 w-4", statusColor)} />
                          </div>
                          {idx < approvals.length - 1 && <div className="flex-1 w-px bg-border my-1" />}
                        </div>
                        <div className="flex-1 rounded-lg border bg-card p-3 space-y-1">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <div className="text-sm font-medium">{ap.approver}</div>
                              <div className="text-xs text-muted-foreground">{ap.role}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn("text-[10px] capitalize", levelColors[ap.level])}>
                                {ap.level}
                              </Badge>
                              <Badge variant="outline" className={cn("text-[10px] capitalize", statusColor)}>
                                {ap.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground pt-1 border-t mt-2">
                            <span className="font-medium">Comments:</span> {ap.comments}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Amount: {fmtINRFull(ap.amount)} · Timestamp: {ap.timestamp}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Journal Entries */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-600" /> Journal Entries — Ind AS 2 Style
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {journalEntries.length} entries · Debit: {fmtINR(totalDebit)} · Credit: {fmtINR(totalCredit)} · {totalDebit === totalCredit ? "✓ Balanced" : "⚠ Unbalanced"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-md border">
                    <Table className="table-hover-highlight">
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="text-xs">JE ID</TableHead>
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="text-xs">Account</TableHead>
                          <TableHead className="text-xs">Description</TableHead>
                          <TableHead className="text-xs text-right">Debit</TableHead>
                          <TableHead className="text-xs text-right">Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {journalEntries.map((je) => (
                          <TableRow key={je.id} className="text-xs">
                            <TableCell className="font-mono">{je.id}</TableCell>
                            <TableCell>{je.date}</TableCell>
                            <TableCell>
                              <div className="font-mono text-[10px] text-muted-foreground">{je.account}</div>
                              <div className="text-xs">{je.accountName}</div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{je.description}</TableCell>
                            <TableCell className="text-right font-mono text-emerald-700 dark:text-emerald-300">
                              {je.debit > 0 ? fmtINR(je.debit) : "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono text-rose-700 dark:text-rose-300">
                              {je.credit > 0 ? fmtINR(je.credit) : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/40 font-bold">
                          <TableCell colSpan={4}>Total</TableCell>
                          <TableCell className="numeric-cell text-right font-mono text-emerald-700 dark:text-emerald-300">{fmtINR(totalDebit)}</TableCell>
                          <TableCell className="numeric-cell text-right font-mono text-rose-700 dark:text-rose-300">{fmtINR(totalCredit)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer with status-aware actions */}
        <SheetFooter className="border-t p-4 flex flex-row gap-2 flex-wrap items-center justify-end bg-muted/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const csvData = [{
                id: item.id, workOrder: item.workOrder, partNo: item.partNo,
                partDescription: item.partDescription, status: item.status,
                plannedCost: item.plannedCost, actualCost: item.actualCost,
                variance: item.variance, variancePct: item.variancePct,
                qtyProduced: item.qtyProduced, qtyPlanned: item.qtyPlanned,
                plannedUnitCost: item.plannedUnitCost, actualUnitCost: item.actualUnitCost,
                supplier: item.supplier, riskLevel: item.riskLevel,
                costController: item.costController, psRef: item.psRef, bomRef: item.bomRef,
                ncrRef: item.ncrRef || "", scarRef: item.scarRef || "",
                productionStartDate: item.productionStartDate, productionEndDate: item.productionEndDate,
              }]
              exportToCSV(csvData, `pcv-${item.id}`)
              toast.success("CSV Exported", `${item.id} variance details exported successfully`)
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>

          {item.status === "pending-review" && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => toast.success("Approval Submitted", `${item.id} forwarded to cost controller for review`)}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Submit for Approval
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => toast.error("Variance Rejected", `${item.id} sent back for re-analysis`)}
              >
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Reject
              </Button>
            </>
          )}

          {item.status === "investigating" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => toast.info("Investigation Update", `${item.id} root cause analysis initiated`)}
            >
              <Search className="h-3.5 w-3.5 mr-1" />
              Initiate Root Cause Analysis
            </Button>
          )}

          {item.status === "unfavorable" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => toast.info("Mitigation Plan", `Mitigation plan drafted for ${item.id}`)}
            >
              <Lightbulb className="h-3.5 w-3.5 mr-1" />
              Draft Mitigation Plan
            </Button>
          )}

          {item.status === "critical" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast.error("CFO Escalation", `${item.id} escalated to CFO — variance > ₹5L threshold`)}
            >
              <Bell className="h-3.5 w-3.5 mr-1" />
              Escalate to CFO
            </Button>
          )}

          {item.status === "rejected" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => toast.info("Resubmission", `${item.id} reopened for re-analysis`)}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Reopen for Re-analysis
            </Button>
          )}

          {(item.status === "favorable" || item.status === "on-target" || item.status === "approved") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Standard Cost Update", `Standard cost roll scheduled for ${item.partNo}`)}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Update Standard Cost
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ──────────────────────────────────────────────────────────
// MAIN VIEW COMPONENT
// ──────────────────────────────────────────────────────────

export function ProductionCostVarianceView() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [drawerItem, setDrawerItem] = useState<CostVarianceItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Compute KPIs from all items
  const kpis = useMemo(() => {
    const total = PCV_ITEMS.length
    const totalPlanned = PCV_ITEMS.reduce((s, i) => s + i.plannedCost, 0)
    const totalActual = PCV_ITEMS.reduce((s, i) => s + i.actualCost, 0)
    const totalVariance = PCV_ITEMS.reduce((s, i) => s + i.variance, 0)
    const variancePct = totalPlanned > 0 ? (totalVariance / totalPlanned) * 100 : 0
    const criticalCount = PCV_ITEMS.filter(i => i.status === "critical").length
    const unfavorableCount = PCV_ITEMS.filter(i => i.status === "unfavorable" || i.status === "critical").length
    const favorableCount = PCV_ITEMS.filter(i => i.direction === "favorable").length
    const avgVariancePct = PCV_ITEMS.reduce((s, i) => s + Math.abs(i.variancePct), 0) / total
    const pendingApproval = PCV_ITEMS.filter(i => i.status === "pending-review" || i.status === "investigating").length
    const highRiskCount = PCV_ITEMS.filter(i => i.riskLevel === "high" || i.riskLevel === "critical").length
    return {
      total, totalPlanned, totalActual, totalVariance, variancePct,
      criticalCount, unfavorableCount, favorableCount, avgVariancePct,
      pendingApproval, highRiskCount,
    }
  }, [])

  // Status tabs with counts
  const statusTabs = useMemo(() => {
    const tabs = [
      { id: "all", label: "All", count: PCV_ITEMS.length, color: "text-foreground" },
      { id: "favorable", label: "Favorable", count: PCV_ITEMS.filter(i => i.status === "favorable").length, color: "text-emerald-600" },
      { id: "on-target", label: "On Target", count: PCV_ITEMS.filter(i => i.status === "on-target").length, color: "text-blue-600" },
      { id: "unfavorable", label: "Unfavorable", count: PCV_ITEMS.filter(i => i.status === "unfavorable").length, color: "text-amber-600" },
      { id: "critical", label: "Critical", count: PCV_ITEMS.filter(i => i.status === "critical").length, color: "text-rose-600" },
      { id: "investigating", label: "Investigating", count: PCV_ITEMS.filter(i => i.status === "investigating").length, color: "text-purple-600" },
      { id: "pending-review", label: "Pending Review", count: PCV_ITEMS.filter(i => i.status === "pending-review").length, color: "text-cyan-600" },
      { id: "approved", label: "Approved", count: PCV_ITEMS.filter(i => i.status === "approved").length, color: "text-emerald-600" },
      { id: "rejected", label: "Rejected", count: PCV_ITEMS.filter(i => i.status === "rejected").length, color: "text-rose-600" },
    ]
    return tabs
  }, [])

  // Filter items
  const filteredItems = useMemo(() => {
    return PCV_ITEMS.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false
      if (riskFilter !== "all" && item.riskLevel !== riskFilter) return false
      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        const matches =
          item.id.toLowerCase().includes(q) ||
          item.workOrder.toLowerCase().includes(q) ||
          item.partNo.toLowerCase().includes(q) ||
          item.partDescription.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.warehouse.toLowerCase().includes(q) ||
          item.supplier.toLowerCase().includes(q) ||
          item.productionLine.toLowerCase().includes(q) ||
          item.costController.toLowerCase().includes(q) ||
          item.productManager.toLowerCase().includes(q) ||
          item.bomRef.toLowerCase().includes(q) ||
          item.psRef.toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })
  }, [searchTerm, statusFilter, categoryFilter, riskFilter])

  // Chart data
  const monthlyTrendAll = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((m, idx) => {
      const planned = PCV_ITEMS.reduce((s, i) => {
        const r = rng(seedStr(i.id) + idx)
        return s + i.plannedCost / 6 * (0.9 + r() * 0.2)
      }, 0)
      const actual = PCV_ITEMS.reduce((s, i) => {
        const r = rng(seedStr(i.id + "act") + idx)
        return s + i.actualCost / 6 * (0.9 + r() * 0.2)
      }, 0)
      return {
        month: m,
        plannedCost: Math.round(planned),
        actualCost: Math.round(actual),
        variance: Math.round(actual - planned),
      }
    })
  }, [])

  const statusDistribution = useMemo(() => {
    return Object.keys(STATUS_CONFIG).map((status) => ({
      name: STATUS_CONFIG[status as PCVStatus].label,
      value: PCV_ITEMS.filter(i => i.status === status).length,
      color: STATUS_CONFIG[status as PCVStatus].pieColor,
    })).filter(d => d.value > 0)
  }, [])

  const categoryBreakdown = useMemo(() => {
    const catMap = new Map<string, { planned: number; actual: number; variance: number }>()
    for (const item of PCV_ITEMS) {
      const existing = catMap.get(item.category) || { planned: 0, actual: 0, variance: 0 }
      existing.planned += item.plannedCost
      existing.actual += item.actualCost
      existing.variance += item.variance
      catMap.set(item.category, existing)
    }
    return Array.from(catMap.entries()).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.variance - a.variance)
  }, [])

  const riskDistribution = useMemo(() => {
    return (["low", "medium", "high", "critical"] as PCVRiskLevel[]).map(r => ({
      name: RISK_CONFIG[r].label,
      value: PCV_ITEMS.filter(i => i.riskLevel === r).length,
      color: r === "low" ? "#10b981" : r === "medium" ? "#f59e0b" : r === "high" ? "#fb923c" : "#f43f5e",
    }))
  }, [])

  const warehouseVariance = useMemo(() => {
    const whMap = new Map<string, { planned: number; actual: number; variance: number; count: number }>()
    for (const item of PCV_ITEMS) {
      const existing = whMap.get(item.warehouse) || { planned: 0, actual: 0, variance: 0, count: 0 }
      existing.planned += item.plannedCost
      existing.actual += item.actualCost
      existing.variance += item.variance
      existing.count += 1
      whMap.set(item.warehouse, existing)
    }
    return Array.from(whMap.entries()).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.variance - a.variance)
  }, [])

  const categories = useMemo(() => Array.from(new Set(PCV_ITEMS.map(i => i.category))).sort(), [])

  const handleRowClick = (item: CostVarianceItem) => {
    setDrawerItem(item)
    setDrawerOpen(true)
  }

  const handleExport = () => {
    const csvData = filteredItems.map(item => ({
      id: item.id, workOrder: item.workOrder, partNo: item.partNo,
      partDescription: item.partDescription, category: item.category,
      warehouse: item.warehouse, productionLine: item.productionLine,
      status: item.status, riskLevel: item.riskLevel,
      plannedCost: item.plannedCost, actualCost: item.actualCost,
      variance: item.variance, variancePct: item.variancePct,
      direction: item.direction,
      qtyProduced: item.qtyProduced, qtyPlanned: item.qtyPlanned,
      plannedUnitCost: item.plannedUnitCost, actualUnitCost: item.actualUnitCost,
      abc: item.abc, supplier: item.supplier, supplierRating: item.supplierRating,
      productionStartDate: item.productionStartDate, productionEndDate: item.productionEndDate,
      costController: item.costController, productManager: item.productManager,
      lastVarianceDate: item.lastVarianceDate, psRef: item.psRef, bomRef: item.bomRef,
      ncrRef: item.ncrRef || "", scarRef: item.scarRef || "",
    }))
    exportToCSV(csvData, `production-cost-variance-${new Date().toISOString().slice(0, 10)}`)
    toast.success("CSV Exported", `${filteredItems.length} cost variance records exported`)
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Production Cost Variance"
        description="Finance operations layer — planned vs actual cost variance analysis across work orders, with driver breakdown, root cause analysis, mitigation actions, and multi-tier approval workflow. Closes the manufacturing finance loop: BOM → Production Schedule → Work Order → Cost Variance → Journal Entries → Standard Cost Update."
      />

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Card className={cn("relative overflow-hidden pcv-kpi-enter border-blue-200 dark:border-blue-900", kpis.criticalCount > 0 && "border-rose-300 dark:border-rose-800")}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400" />
          <CardContent className="inner-glow glass-subtle pt-4 pb-3 space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" /> Total Variance Records
              </div>
              <FileBarChart className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{kpis.total}</div>
            <div className="text-[10px] text-muted-foreground">
              Across {categories.length} categories · {new Set(PCV_ITEMS.map(i => i.warehouse)).size} warehouses
            </div>
          </CardContent>
        </Card>

        <Card className={cn("relative overflow-hidden pcv-kpi-enter", kpis.criticalCount > 0 && "border-rose-300 dark:border-rose-800")}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-rose-400" />
          <CardContent className="inner-glow glass-subtle pt-4 pb-3 space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <XCircle className="h-3 w-3" /> Critical Variances
              </div>
              {kpis.criticalCount > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 animate-ping" />}
            </div>
            <div className={cn("text-2xl font-bold", kpis.criticalCount > 0 ? "text-rose-700 dark:text-rose-300" : "")}>
              {kpis.criticalCount}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {kpis.highRiskCount} high-risk · {kpis.pendingApproval} pending review
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm relative overflow-hidden pcv-kpi-enter">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
          <CardContent className="inner-glow glass-subtle pt-4 pb-3 space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <IndianRupee className="h-3 w-3" /> Total Variance
              </div>
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <div className={cn("text-2xl font-bold", kpis.totalVariance > 0 ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300")}>
              {kpis.totalVariance > 0 ? "+" : ""}{fmtINR(kpis.totalVariance)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {kpis.variancePct > 0 ? "+" : ""}{kpis.variancePct.toFixed(2)}% of planned
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm relative overflow-hidden pcv-kpi-enter">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
          <CardContent className="inner-glow glass-subtle pt-4 pb-3 space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <PiggyBank className="h-3 w-3" /> Favorable Variance
              </div>
              <TrendingDown className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{kpis.favorableCount}</div>
            <div className="text-[10px] text-muted-foreground">under-plan cost savings</div>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm relative overflow-hidden pcv-kpi-enter">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-400" />
          <CardContent className="inner-glow glass-subtle pt-4 pb-3 space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Percent className="h-3 w-3" /> Avg Variance %
              </div>
              <Scale className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{kpis.avgVariancePct.toFixed(2)}%</div>
            <div className="text-[10px] text-muted-foreground">absolute mean across records</div>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm relative overflow-hidden pcv-kpi-enter">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-400" />
          <CardContent className="inner-glow glass-subtle pt-4 pb-3 space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Wallet className="h-3 w-3" /> Total Planned Cost
              </div>
              <Receipt className="h-4 w-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{fmtINR(kpis.totalPlanned)}</div>
            <div className="text-[10px] text-muted-foreground">actual: {fmtINR(kpis.totalActual)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-lift-sm md:col-span-2 pcv-chart-enter">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" /> 6-Month Cost Trend (Planned vs Actual)
            </CardTitle>
            <CardDescription className="text-xs">Aggregated cost variance trend across all work orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyTrendAll} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pcvPlannedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="pcvActualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => fmtINR(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="plannedCost" name="Planned Cost" stroke="#3b82f6" strokeWidth={2} fill="url(#pcvPlannedGrad)" />
                <Area type="monotone" dataKey="actualCost" name="Actual Cost" stroke="#f59e0b" strokeWidth={2} fill="url(#pcvActualGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm pcv-chart-enter">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" /> Status Distribution
            </CardTitle>
            <CardDescription className="text-xs">Variance status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  label={(entry: any) => `${entry.value}`}
                  labelLine={false}
                >
                  {statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-lift-sm md:col-span-2 pcv-chart-enter">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" /> Cost Variance by Category
            </CardTitle>
            <CardDescription className="text-xs">Planned vs Actual cost broken down by part category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryBreakdown} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-35} textAnchor="end" height={60} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => fmtINR(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="planned" name="Planned" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm pcv-chart-enter">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Gauge className="h-4 w-4 text-rose-600" /> Risk Distribution
            </CardTitle>
            <CardDescription className="text-xs">Variance records by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={riskDistribution} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={80} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 — Warehouse Variance */}
      <Card className="hover-lift-sm pcv-chart-enter">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Factory className="h-4 w-4 text-emerald-600" /> Cost Variance by Warehouse
          </CardTitle>
          <CardDescription className="text-xs">Variance impact by warehouse (sorted by absolute variance)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={warehouseVariance} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => fmtINR(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="variance" name="Variance" radius={[3, 3, 0, 0]}>
                {warehouseVariance.map((entry, i) => (
                  <Cell key={i} fill={entry.variance > 0 ? "#f43f5e" : entry.variance < 0 ? "#10b981" : "#94a3b8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters + Status Tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileBarChart className="h-4 w-4 text-blue-600" /> Cost Variance Records
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search PCV, WO, part, supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 w-64 text-xs pcv-search-focus"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 w-40 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info("Refresh", "Cost variance data refreshed from ERP")}>
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
              </Button>
              <Button variant="default" size="sm" onClick={() => toast.success("New Variance Run", "Standard cost roll triggered for next period")}>
                <Plus className="h-3.5 w-3.5 mr-1" /> New Variance Run
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-0">
          {/* Status tabs */}
          <div className="flex gap-1 flex-wrap mb-3">
            {statusTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all",
                  statusFilter === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <span>{tab.label}</span>
                <span className={cn("ml-0.5 px-1 rounded text-[10px] bg-white/20", statusFilter === tab.id ? "" : "bg-background/80")}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Master Table */}
          <div className="overflow-x-auto rounded-md border">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs">PCV ID / WO</TableHead>
                  <TableHead className="text-xs">Part Description</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Warehouse / Line</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Risk</TableHead>
                  <TableHead className="text-xs text-right">Planned</TableHead>
                  <TableHead className="text-xs text-right">Actual</TableHead>
                  <TableHead className="text-xs text-right">Variance</TableHead>
                  <TableHead className="text-xs text-right">%</TableHead>
                  <TableHead className="text-xs text-right">Qty</TableHead>
                  <TableHead className="text-xs">Supplier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-sm text-muted-foreground">
                      No cost variance records match the current filters.
                    </TableCell>
                  </TableRow>
                )}
                {filteredItems.map((item, idx) => {
                  const statusCfg = STATUS_CONFIG[item.status]
                  const StatusIcon = statusCfg.icon
                  const riskCfg = RISK_CONFIG[item.riskLevel]
                  const RiskIcon = riskCfg.icon
                  const dirCfg = DIRECTION_CONFIG[item.direction]
                  const DirIcon = dirCfg.icon
                  const rowClass = item.status === "critical"
                    ? "pcv-row-critical"
                    : item.status === "unfavorable" || item.status === "investigating" || item.status === "pending-review" || item.status === "rejected"
                    ? "pcv-row-warn"
                    : item.status === "favorable"
                    ? "pcv-row-favorable"
                    : "pcv-row-in"
                  return (
                    <TableRow
                      key={item.id}
                      onClick={() => handleRowClick(item)}
                      className={cn("cursor-pointer text-xs pcv-row-in", rowClass)}
                      style={{ animationDelay: `${Math.min(idx * 20, 400)}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 rounded">
                            <AvatarFallback className={cn("text-[10px] font-bold", statusCfg.bg, statusCfg.color)}>
                              {item.partDescription.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <div className="font-mono font-medium text-[11px]">{item.id}</div>
                            <div className="text-[10px] text-muted-foreground">{item.workOrder}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-xs">{item.partDescription}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{item.partNo}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="badge-interactive text-[10px]">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">{item.warehouse}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{item.productionLine}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px]", statusCfg.bg, statusCfg.color, statusCfg.border, "border")}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px]", riskCfg.bg, riskCfg.color)}>
                          <RiskIcon className="h-3 w-3 mr-1" />
                          {riskCfg.label.split(" ")[0]}
                        </Badge>
                      </TableCell>
                      <TableCell className="numeric-cell text-right font-mono text-blue-700 dark:text-blue-300">{fmtINR(item.plannedCost)}</TableCell>
                      <TableCell className="numeric-cell text-right font-mono text-amber-700 dark:text-amber-300">{fmtINR(item.actualCost)}</TableCell>
                      <TableCell className={cn("text-right font-mono font-medium", dirCfg.color)}>
                        <span className="inline-flex items-center gap-0.5">
                          <DirIcon className="h-3 w-3" />
                          {item.variance > 0 ? "+" : ""}{fmtINR(item.variance)}
                        </span>
                      </TableCell>
                      <TableCell className={cn("text-right font-mono font-medium", dirCfg.color)}>
                        {fmtPct(item.variancePct)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-xs font-mono">{fmtNum(item.qtyProduced)}</div>
                        <div className="text-[10px] text-muted-foreground">/ {fmtNum(item.qtyPlanned)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">{item.supplier}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 text-amber-500" />
                          {item.supplierRating.toFixed(1)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>Showing {filteredItems.length} of {PCV_ITEMS.length} records</span>
            <span>Click any row to view detailed variance analysis, drivers, root causes, and approval workflow</span>
          </div>
        </CardContent>
      </Card>

      <CostVarianceDetailDrawer
        item={drawerItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
