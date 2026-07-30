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
  Landmark,
  History,
  ArrowLeftRight,
  PackageCheck,
  PackageX,
  Archive,
  Hourglass,
  Truck,
  Handshake,
  Layers3,
  BookMarked,
  Warehouse,
  RotateCcw,
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
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts"

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

type ValuationMethod = "fifo" | "lifo" | "weighted-average" | "standard"
type StockStatus = "active" | "slow-moving" | "obsolete" | "reserved" | "quarantine" | "in-transit" | "consignment"
type ABCClass = "A" | "B" | "C"
type RiskLevel = "low" | "medium" | "high" | "critical"

interface CostLayer {
  layerId: string
  receiptDate: string
  receiptNo: string
  poNumber: string
  supplier: string
  qtyReceived: number
  qtyRemaining: number
  unitCost: number
  extendedCost: number
  ageDays: number
}

interface MovementRecord {
  movementId: string
  date: string
  type: "receipt" | "issue" | "transfer-in" | "transfer-out" | "adjustment" | "return" | "scrap"
  reference: string
  qty: number
  unitCost: number
  extendedValue: number
  balance: number
  user: string
  notes: string
}

interface ReserveEntry {
  reserveType: "obsolete" | "slow-moving" | "price-decline" | "damage" | "expiry"
  description: string
  reservePercent: number
  reserveAmount: number
  justification: string
  status: "active" | "released" | "increased" | "reversed"
  approvedBy: string
  approvedDate: string
}

interface JournalEntry {
  entryId: string
  account: string
  accountCode: string
  debit: number
  credit: number
  narrative: string
}

interface ReconciliationRecord {
  reconId: string
  date: string
  bookQty: number
  physicalQty: number
  varianceQty: number
  bookValue: number
  physicalValue: number
  varianceValue: number
  status: "matched" | "variance" | "under-investigation"
  investigator: string
  notes: string
}

interface StdCostRollRecord {
  rollId: string
  effectiveDate: string
  prevStdCost: number
  newStdCost: number
  variance: number
  variancePercent: number
  reason: string
  pcvRef: string
  approvedBy: string
  status: "pending" | "approved" | "rejected"
}

interface MonthlyValuationTrend {
  month: string
  fifo: number
  lifo: number
  weightedAvg: number
  standard: number
  reserve: number
}

interface InventoryValuationItem {
  id: string
  partNo: string
  description: string
  category: string
  warehouse: string
  abcClass: ABCClass
  status: StockStatus
  method: ValuationMethod
  qtyOnHand: number
  unitCost: number
  totalValue: number
  stdCost: number
  stdCostVariance: number
  reserveAmount: number
  reservePercent: number
  lastReceiptDate: string
  lastIssueDate: string
  daysInStock: number
  riskLevel: RiskLevel
  supplier: string
  supplierRating: number
  binLocation: string
  lotNumber: string
  expiryDate?: string
  pcvRef?: string
  valuationDate: string
  costAccountant: string
}

interface DrawerProps {
  item: InventoryValuationItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ──────────────────────────────────────────────────────────
// FORMATTERS
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
// STATUS / METHOD / ABC / RISK CONFIG
// ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StockStatus, {
  label: string
  color: string
  bg: string
  border: string
  pieColor: string
  icon: typeof CheckCircle2
}> = {
  active: { label: "Active", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-900", pieColor: "#10b981", icon: PackageCheck },
  "slow-moving": { label: "Slow-Moving", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-900", pieColor: "#f59e0b", icon: Hourglass },
  obsolete: { label: "Obsolete", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-50 dark:bg-rose-950/40", border: "border-rose-200 dark:border-rose-900", pieColor: "#f43f5e", icon: Archive },
  reserved: { label: "Reserved", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-900", pieColor: "#3b82f6", icon: BookMarked },
  quarantine: { label: "Quarantine", color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-950/40", border: "border-purple-200 dark:border-purple-900", pieColor: "#a855f7", icon: PackageX },
  "in-transit": { label: "In-Transit", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-50 dark:bg-cyan-950/40", border: "border-cyan-200 dark:border-cyan-900", pieColor: "#06b6d4", icon: Truck },
  consignment: { label: "Consignment", color: "text-indigo-700 dark:text-indigo-300", bg: "bg-indigo-50 dark:bg-indigo-950/40", border: "border-indigo-200 dark:border-indigo-900", pieColor: "#6366f1", icon: Handshake },
}

const METHOD_CONFIG: Record<ValuationMethod, {
  label: string
  short: string
  color: string
  bg: string
  pieColor: string
  icon: typeof Layers
  description: string
}> = {
  fifo: { label: "FIFO (First-In, First-Out)", short: "FIFO", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950/50", pieColor: "#3b82f6", icon: Layers, description: "Oldest inventory layers consumed first; ending inventory at most recent costs" },
  lifo: { label: "LIFO (Last-In, First-Out)", short: "LIFO", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-100 dark:bg-rose-950/50", pieColor: "#f43f5e", icon: Layers3, description: "Newest inventory layers consumed first; ending inventory at oldest costs" },
  "weighted-average": { label: "Weighted Average Cost", short: "WAC", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/50", pieColor: "#10b981", icon: Scale, description: "Total cost of goods available divided by total quantity; periodic recalculation" },
  standard: { label: "Standard Costing", short: "STD", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950/50", pieColor: "#f59e0b", icon: Target, description: "Predetermined cost; variance to actual booked to variance accounts" },
}

const ABC_CONFIG: Record<ABCClass, { label: string; color: string; bg: string }> = {
  A: { label: "A Class", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/50" },
  B: { label: "B Class", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950/50" },
  C: { label: "C Class", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950/50" },
}

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; icon: typeof AlertTriangle }> = {
  low: { label: "Low Risk", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/50", icon: CheckCircle2 },
  medium: { label: "Medium Risk", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950/50", icon: AlertTriangle },
  high: { label: "High Risk", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-950/50", icon: AlertTriangle },
  critical: { label: "Critical Risk", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-100 dark:bg-rose-950/50", icon: XCircle },
}

const CATEGORY_LIST = [
  "Brake System",
  "Wheel & Tire",
  "Engine Block",
  "Hydraulic Seal",
  "Suspension",
  "EV Battery",
  "Tire Assembly",
  "Electrical Harness",
  "Fastener",
  "Lubricant",
  "Glass",
  "Cooling System",
  "Filter",
  "Ignition",
  "Clutch Assembly",
  "Safety Gear",
] as const

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
    s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d)
    s = Math.imul(s ^ (s >>> 12), 0x297a2d39)
    return ((s ^= s >>> 15) >>> 0) / 4294967296
  }
}

const pick = <T,>(arr: T[], r: () => number): T => arr[Math.floor(r() * arr.length)]

const today = new Date("2026-07-26")
const dayMs = 24 * 60 * 60 * 1000
const fmtDate = (d: Date) => d.toISOString().split("T")[0]
const daysAgo = (n: number) => fmtDate(new Date(today.getTime() - n * dayMs))

// ──────────────────────────────────────────────────────────
// COST LAYER GENERATOR (FIFO/LIFO/WAC layers by receipt date)
// ──────────────────────────────────────────────────────────

const generateCostLayers = (item: InventoryValuationItem): CostLayer[] => {
  const seed = seedStr(item.id + "-layers")
  const r = rng(seed)
  const layerCount = 2 + Math.floor(r() * 3) // 2-4 layers
  const layers: CostLayer[] = []
  let qtyAllocated = 0
  for (let i = 0; i < layerCount; i++) {
    const isLast = i === layerCount - 1
    const qtyThisLayer = isLast
      ? Math.max(0, item.qtyOnHand - qtyAllocated)
      : Math.floor((item.qtyOnHand / layerCount) * (0.6 + r() * 0.8))
    if (qtyThisLayer <= 0) continue
    qtyAllocated += qtyThisLayer
    const ageDays = (i + 1) * (15 + Math.floor(r() * 30))
    const costJitter = (r() - 0.5) * 0.18 // ±9%
    const unitCost = Math.round(item.unitCost * (1 + costJitter))
    const receiptDate = daysAgo(ageDays)
    const supplierCode = item.supplier.substring(0, 3).toUpperCase()
    layers.push({
      layerId: `LYR-${item.partNo.substring(0, 6)}-${i + 1}`,
      receiptDate,
      receiptNo: `GRN-${2026000 + Math.floor(r() * 999)}`,
      poNumber: `PO-2026-${1000 + Math.floor(r() * 8999)}`,
      supplier: item.supplier,
      qtyReceived: qtyThisLayer + Math.floor(r() * 20),
      qtyRemaining: qtyThisLayer,
      unitCost,
      extendedCost: qtyThisLayer * unitCost,
      ageDays,
    })
    void supplierCode
  }
  return layers
}

// ──────────────────────────────────────────────────────────
// MOVEMENT HISTORY GENERATOR
// ──────────────────────────────────────────────────────────

const generateMovements = (item: InventoryValuationItem): MovementRecord[] => {
  const seed = seedStr(item.id + "-movements")
  const r = rng(seed)
  const movementCount = 8 + Math.floor(r() * 5) // 8-12 movements
  const movements: MovementRecord[] = []
  let runningBalance = 0
  const types: MovementRecord["type"][] = ["receipt", "issue", "transfer-in", "transfer-out", "adjustment", "return", "scrap"]
  const users = ["Rajesh Kumar", "Priya Nair", "Amit Patel", "Sneha Iyer", "Vikram Singh", "Anand Iyer", "Sunita Reddy"]
  for (let i = movementCount - 1; i >= 0; i--) {
    const ageDays = i * (3 + Math.floor(r() * 7)) + Math.floor(r() * 4)
    const type = i === movementCount - 1 ? "receipt" : pick(types, r)
    const baseQty = Math.floor(item.qtyOnHand / 8) + Math.floor(r() * 40)
    const qty = type === "receipt" || type === "transfer-in" || type === "return" ? baseQty : -baseQty
    runningBalance += qty
    if (runningBalance < 0) runningBalance = Math.abs(runningBalance)
    const costJitter = (r() - 0.5) * 0.12
    const unitCost = Math.round(item.unitCost * (1 + costJitter))
    movements.push({
      movementId: `MVT-${item.partNo.substring(0, 6)}-${String(i + 1).padStart(3, "0")}`,
      date: daysAgo(ageDays),
      type,
      reference: type === "receipt" ? `GRN-${2026000 + Math.floor(r() * 999)}` : type === "issue" ? `WO-${2026100 + Math.floor(r() * 99)}` : type === "scrap" ? `SCR-${2026300 + Math.floor(r() * 99)}` : `TRF-${2026400 + Math.floor(r() * 99)}`,
      qty,
      unitCost,
      extendedValue: qty * unitCost,
      balance: runningBalance,
      user: pick(users, r),
      notes: type === "receipt" ? "Goods receipt against PO" : type === "scrap" ? "Scrap — NCR-2026-" + (6000 + Math.floor(r() * 99)) : type === "adjustment" ? "Cycle count adjustment" : type === "issue" ? "Issue to production line" : "Stock transfer between bins",
    })
  }
  return movements.reverse()
}

// ──────────────────────────────────────────────────────────
// RESERVE GENERATOR (Obsolete/Slow-Moving/Price-Decline/Damage/Expiry)
// ──────────────────────────────────────────────────────────

const generateReserves = (item: InventoryValuationItem): ReserveEntry[] => {
  const seed = seedStr(item.id + "-reserves")
  const r = rng(seed)
  const reserves: ReserveEntry[] = []
  const approvers = ["Meera Krishnan (Controller)", "Rakesh Sharma (CFO)", "Divya Menon (FM)"]

  if (item.status === "obsolete" || item.riskLevel === "critical") {
    reserves.push({
      reserveType: "obsolete",
      description: "Obsolete inventory reserve — product discontinued",
      reservePercent: 100,
      reserveAmount: item.totalValue,
      justification: `Part ${item.partNo} is end-of-life per engineering change notice ECN-2026-${100 + Math.floor(r() * 99)}. No forecast demand for next 12 months.`,
      status: "active",
      approvedBy: pick(approvers, r),
      approvedDate: daysAgo(20 + Math.floor(r() * 30)),
    })
  }

  if (item.status === "slow-moving") {
    reserves.push({
      reserveType: "slow-moving",
      description: "Slow-moving inventory reserve",
      reservePercent: 35 + Math.floor(r() * 25),
      reserveAmount: Math.round(item.totalValue * (0.35 + r() * 0.25)),
      justification: `Inventory aging ${item.daysInStock}+ days. Velocity below threshold (turns < 2/yr). Reserve at ${35 + Math.floor(r() * 25)}% per Ind AS 2 guidance.`,
      status: "active",
      approvedBy: pick(approvers, r),
      approvedDate: daysAgo(15 + Math.floor(r() * 20)),
    })
  }

  if (item.riskLevel === "high" || item.riskLevel === "medium") {
    reserves.push({
      reserveType: "price-decline",
      description: "Net realizable value decline reserve",
      reservePercent: 10 + Math.floor(r() * 15),
      reserveAmount: Math.round(item.totalValue * (0.1 + r() * 0.15)),
      justification: `Market price erosion detected. Current replacement cost ${Math.round(item.unitCost * 0.88)}/unit vs book ${item.unitCost}/unit.`,
      status: r() > 0.4 ? "active" : "increased",
      approvedBy: pick(approvers, r),
      approvedDate: daysAgo(8 + Math.floor(r() * 12)),
    })
  }

  if (item.category === "Lubricant" || item.category === "Filter") {
    reserves.push({
      reserveType: "expiry",
      description: "Shelf-life expiry reserve",
      reservePercent: 8 + Math.floor(r() * 12),
      reserveAmount: Math.round(item.totalValue * (0.08 + r() * 0.12)),
      justification: `Lot ${item.lotNumber} within 90 days of expiry. Reserve at ${8 + Math.floor(r() * 12)}% per expiry risk assessment.`,
      status: "active",
      approvedBy: pick(approvers, r),
      approvedDate: daysAgo(5 + Math.floor(r() * 10)),
    })
  }

  // Add a damage reserve for quarantine items
  if (item.status === "quarantine") {
    reserves.push({
      reserveType: "damage",
      description: "Damage reserve — under QIP inspection",
      reservePercent: 25 + Math.floor(r() * 25),
      reserveAmount: Math.round(item.totalValue * (0.25 + r() * 0.25)),
      justification: `Lot ${item.lotNumber} quarantined pending NCR-2026-${6000 + Math.floor(r() * 99)} disposition.`,
      status: "active",
      approvedBy: pick(approvers, r),
      approvedDate: daysAgo(3 + Math.floor(r() * 7)),
    })
  }

  return reserves
}

// ──────────────────────────────────────────────────────────
// IND AS 2 JOURNAL ENTRIES (Period-end valuation adjustment)
// ──────────────────────────────────────────────────────────

const generateJournalEntries = (item: InventoryValuationItem): JournalEntry[] => {
  const reserves = generateReserves(item)
  const totalReserve = reserves.reduce((sum, r) => sum + r.reserveAmount, 0)
  if (totalReserve === 0) return []
  return [
    {
      entryId: "JE-2026-IV-001",
      account: "Inventory Reserve — Obsolete & Slow-Moving",
      accountCode: "1402.05",
      debit: 0,
      credit: totalReserve,
      narrative: `Provision for inventory reserve — ${item.partNo} (${reserves.length} reserve entries)`,
    },
    {
      entryId: "JE-2026-IV-002",
      account: "Cost of Goods Sold — Inventory Write-down",
      accountCode: "5001.10",
      debit: totalReserve,
      credit: 0,
      narrative: `Charge to P&L for Ind AS 2 valuation adjustment (period ${daysAgo(0).substring(0, 7)})`,
    },
    {
      entryId: "JE-2026-IV-003",
      account: "Deferred Tax Asset — Inventory Reserve",
      accountCode: "1205.02",
      debit: Math.round(totalReserve * 0.252),
      credit: 0,
      narrative: "Tax effect @ 25.2% on inventory write-down",
    },
    {
      entryId: "JE-2026-IV-004",
      account: "Income Tax Expense — Deferred",
      accountCode: "5401.02",
      debit: 0,
      credit: Math.round(totalReserve * 0.252),
      narrative: "Deferred tax credit matching valuation adjustment",
    },
  ]
}

// ──────────────────────────────────────────────────────────
// BOOK VS PHYSICAL RECONCILIATION HISTORY
// ──────────────────────────────────────────────────────────

const generateReconciliation = (item: InventoryValuationItem): ReconciliationRecord[] => {
  const seed = seedStr(item.id + "-recon")
  const r = rng(seed)
  const records: ReconciliationRecord[] = []
  const investigators = ["Sanjay Gupta", "Deepak Joshi", "Meera Krishnan"]
  for (let i = 0; i < 4; i++) {
    const ageDays = i * 30 + Math.floor(r() * 7)
    const bookQty = item.qtyOnHand + Math.floor((r() - 0.5) * 20)
    const physicalQty = bookQty + Math.floor((r() - 0.5) * 8)
    const varianceQty = physicalQty - bookQty
    const bookValue = bookQty * item.unitCost
    const physicalValue = physicalQty * item.unitCost
    const varianceValue = physicalValue - bookValue
    const status: ReconciliationRecord["status"] = varianceQty === 0 ? "matched" : Math.abs(varianceQty) > 5 ? "under-investigation" : "variance"
    records.push({
      reconId: `REC-${item.partNo.substring(0, 6)}-${String(i + 1).padStart(3, "0")}`,
      date: daysAgo(ageDays),
      bookQty,
      physicalQty,
      varianceQty,
      bookValue,
      physicalValue,
      varianceValue,
      status,
      investigator: pick(investigators, r),
      notes: status === "matched" ? "Cycle count reconciled with book balance." : status === "variance" ? "Minor variance — posted adjustment entry." : "Significant variance — root cause investigation in progress.",
    })
  }
  return records
}

// ──────────────────────────────────────────────────────────
// STANDARD COST ROLL HISTORY (Linked to PCV module)
// ──────────────────────────────────────────────────────────

const generateStdCostRolls = (item: InventoryValuationItem): StdCostRollRecord[] => {
  const seed = seedStr(item.id + "-rolls")
  const r = rng(seed)
  const rolls: StdCostRollRecord[] = []
  let currentCost = item.stdCost * 0.88
  const approvers = ["Meera Krishnan", "Rakesh Sharma", "Anand Iyer"]
  for (let i = 0; i < 3; i++) {
    const ageDays = i * 90 + Math.floor(r() * 15)
    const newCost = i === 2 ? item.stdCost : Math.round(currentCost * (1.05 + r() * 0.1))
    const variance = newCost - Math.round(currentCost)
    const variancePercent = (variance / currentCost) * 100
    const reasons = [
      "Annual standard cost roll — material price update",
      "Standard cost revision — labor rate increase",
      "Standard cost update — BOM change / ECN",
      "Standard cost roll — supplier price revision",
      "Standard cost update — overhead absorption rate change",
    ]
    rolls.push({
      rollId: `SCR-${item.partNo.substring(0, 6)}-${String(i + 1).padStart(2, "0")}`,
      effectiveDate: daysAgo(ageDays),
      prevStdCost: Math.round(currentCost),
      newStdCost: newCost,
      variance,
      variancePercent,
      reason: pick(reasons, r),
      pcvRef: item.pcvRef || `PCV-2026-90${10 + Math.floor(r() * 9)}`,
      approvedBy: pick(approvers, r),
      status: i === 0 ? "approved" : i === 1 ? "approved" : pick(["approved", "pending", "rejected"] as const, r),
    })
    currentCost = newCost
  }
  return rolls.reverse()
}

// ──────────────────────────────────────────────────────────
// MONTHLY VALUATION TREND (6 months)
// ──────────────────────────────────────────────────────────

const generateMonthlyTrend = (item: InventoryValuationItem): MonthlyValuationTrend[] => {
  const seed = seedStr(item.id + "-trend")
  const r = rng(seed)
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"]
  const baseFifo = item.totalValue
  return months.map((month, i) => {
    const drift = 1 - i * 0.04 + (r() - 0.5) * 0.08
    const fifo = Math.round(baseFifo * drift)
    const lifo = Math.round(fifo * (0.93 + r() * 0.04))
    const weightedAvg = Math.round(fifo * (0.97 + r() * 0.03))
    const standard = Math.round(item.qtyOnHand * item.stdCost * drift)
    const reserve = Math.round(fifo * (0.05 + r() * 0.08))
    return { month, fifo, lifo, weightedAvg, standard, reserve }
  })
}

// ──────────────────────────────────────────────────────────
// 16 MOCK INVENTORY VALUATION ITEMS
// (same Indian automotive parts as WO/PS/MRP/PCV for traceability)
// ──────────────────────────────────────────────────────────

const IV_ITEMS: InventoryValuationItem[] = [
  {
    id: "IV-2026-7001",
    partNo: "BRK-PAD-001",
    description: "Brake Pad Assembly — Passenger Car",
    category: "Brake System",
    warehouse: "Chennai Hub",
    abcClass: "A",
    status: "active",
    method: "fifo",
    qtyOnHand: 4800,
    unitCost: 385,
    totalValue: 1848000,
    stdCost: 372,
    stdCostVariance: 62400,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(8),
    lastIssueDate: daysAgo(2),
    daysInStock: 8,
    riskLevel: "low",
    supplier: "Bosch India",
    supplierRating: 4.6,
    binLocation: "A1-03-B",
    lotNumber: "LOT-BP-2026-001",
    valuationDate: daysAgo(0),
    costAccountant: "Anand Iyer",
  },
  {
    id: "IV-2026-7002",
    partNo: "WHL-RIM-002",
    description: "Wheel Rim 17-inch Alloy",
    category: "Wheel & Tire",
    warehouse: "Chennai Hub",
    abcClass: "A",
    status: "active",
    method: "weighted-average",
    qtyOnHand: 1240,
    unitCost: 2850,
    totalValue: 3534000,
    stdCost: 2780,
    stdCostVariance: 86800,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(12),
    lastIssueDate: daysAgo(1),
    daysInStock: 12,
    riskLevel: "low",
    supplier: "Minda Industries",
    supplierRating: 4.4,
    binLocation: "B2-01-A",
    lotNumber: "LOT-WR-2026-014",
    valuationDate: daysAgo(0),
    costAccountant: "Anand Iyer",
  },
  {
    id: "IV-2026-7003",
    partNo: "ENG-BLK-003",
    description: "Engine Block Cast Iron 1.5L",
    category: "Engine Block",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "active",
    method: "standard",
    qtyOnHand: 86,
    unitCost: 28500,
    totalValue: 2451000,
    stdCost: 28200,
    stdCostVariance: 25800,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(15),
    lastIssueDate: daysAgo(3),
    daysInStock: 15,
    riskLevel: "low",
    supplier: "Greaves Cotton",
    supplierRating: 4.5,
    binLocation: "C1-05-D",
    lotNumber: "LOT-EB-2026-007",
    valuationDate: daysAgo(0),
    costAccountant: "Sunita Reddy",
  },
  {
    id: "IV-2026-7004",
    partNo: "CAL-SEAL-004",
    description: "Caliper Hydraulic Seal Kit",
    category: "Hydraulic Seal",
    warehouse: "Chennai Hub",
    abcClass: "B",
    status: "slow-moving",
    method: "fifo",
    qtyOnHand: 3200,
    unitCost: 145,
    totalValue: 464000,
    stdCost: 138,
    stdCostVariance: 22400,
    reserveAmount: 162400,
    reservePercent: 35,
    lastReceiptDate: daysAgo(78),
    lastIssueDate: daysAgo(34),
    daysInStock: 78,
    riskLevel: "medium",
    supplier: "Greaves Cotton",
    supplierRating: 4.0,
    binLocation: "D3-02-C",
    lotNumber: "LOT-CS-2026-021",
    valuationDate: daysAgo(0),
    costAccountant: "Anand Iyer",
  },
  {
    id: "IV-2026-7005",
    partNo: "SHK-ABS-005",
    description: "Shock Absorber Gas-Filled Rear",
    category: "Suspension",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "active",
    method: "weighted-average",
    qtyOnHand: 980,
    unitCost: 1850,
    totalValue: 1813000,
    stdCost: 1790,
    stdCostVariance: 58800,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(10),
    lastIssueDate: daysAgo(2),
    daysInStock: 10,
    riskLevel: "low",
    supplier: "Gabriel India",
    supplierRating: 4.3,
    binLocation: "E2-04-B",
    lotNumber: "LOT-SA-2026-009",
    valuationDate: daysAgo(0),
    costAccountant: "Sunita Reddy",
  },
  {
    id: "IV-2026-7006",
    partNo: "BAT-LION-006",
    description: "Li-Ion Battery Pack 72V/50Ah",
    category: "EV Battery",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "active",
    method: "standard",
    qtyOnHand: 240,
    unitCost: 24500,
    totalValue: 5880000,
    stdCost: 23800,
    stdCostVariance: 168000,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(7),
    lastIssueDate: daysAgo(1),
    daysInStock: 7,
    riskLevel: "low",
    supplier: "PowerCell Energy",
    supplierRating: 4.7,
    binLocation: "F1-01-A",
    lotNumber: "LOT-BT-2026-003",
    pcvRef: "PCV-2026-9006",
    valuationDate: daysAgo(0),
    costAccountant: "Sunita Reddy",
  },
  {
    id: "IV-2026-7007",
    partNo: "TRE-BEAD-007",
    description: "Tire Bead Wire 0.96mm",
    category: "Tire Assembly",
    warehouse: "Chennai Hub",
    abcClass: "B",
    status: "active",
    method: "fifo",
    qtyOnHand: 5400,
    unitCost: 88,
    totalValue: 475200,
    stdCost: 85,
    stdCostVariance: 16200,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(5),
    lastIssueDate: daysAgo(1),
    daysInStock: 5,
    riskLevel: "low",
    supplier: "Bekaert India",
    supplierRating: 4.2,
    binLocation: "G4-02-D",
    lotNumber: "LOT-TB-2026-031",
    valuationDate: daysAgo(0),
    costAccountant: "Anand Iyer",
  },
  {
    id: "IV-2026-7008",
    partNo: "WRH-HRN-008",
    description: "Wiring Harness Assembly",
    category: "Electrical Harness",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "active",
    method: "weighted-average",
    qtyOnHand: 720,
    unitCost: 2150,
    totalValue: 1548000,
    stdCost: 2090,
    stdCostVariance: 43200,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(11),
    lastIssueDate: daysAgo(2),
    daysInStock: 11,
    riskLevel: "low",
    supplier: "Motherson Sumi",
    supplierRating: 4.5,
    binLocation: "H1-03-C",
    lotNumber: "LOT-WH-2026-018",
    valuationDate: daysAgo(0),
    costAccountant: "Sunita Reddy",
  },
  {
    id: "IV-2026-7009",
    partNo: "ENG-BLT-009",
    description: "Engine Bolt M10x40 Grade 10.9",
    category: "Fastener",
    warehouse: "Chennai Hub",
    abcClass: "C",
    status: "active",
    method: "fifo",
    qtyOnHand: 18500,
    unitCost: 12,
    totalValue: 222000,
    stdCost: 11,
    stdCostVariance: 18500,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(3),
    lastIssueDate: daysAgo(1),
    daysInStock: 3,
    riskLevel: "low",
    supplier: "Sundram Fasteners",
    supplierRating: 4.4,
    binLocation: "I2-05-A",
    lotNumber: "LOT-EB-2026-052",
    valuationDate: daysAgo(0),
    costAccountant: "Anand Iyer",
  },
  {
    id: "IV-2026-7010",
    partNo: "ENG-OIL-010",
    description: "Engine Oil 5W-30 Synthetic 1L",
    category: "Lubricant",
    warehouse: "Chennai Hub",
    abcClass: "B",
    status: "slow-moving",
    method: "fifo",
    qtyOnHand: 2400,
    unitCost: 480,
    totalValue: 1152000,
    stdCost: 465,
    stdCostVariance: 36000,
    reserveAmount: 138240,
    reservePercent: 12,
    lastReceiptDate: daysAgo(65),
    lastIssueDate: daysAgo(22),
    daysInStock: 65,
    riskLevel: "medium",
    supplier: "Castrol India",
    supplierRating: 4.6,
    binLocation: "J3-01-D",
    lotNumber: "LOT-EO-2026-011",
    expiryDate: daysAgo(-90),
    valuationDate: daysAgo(0),
    costAccountant: "Anand Iyer",
  },
  {
    id: "IV-2026-7011",
    partNo: "WSD-GLS-011",
    description: "Windshield Toughened Glass",
    category: "Glass",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "active",
    method: "standard",
    qtyOnHand: 420,
    unitCost: 4250,
    totalValue: 1785000,
    stdCost: 4180,
    stdCostVariance: 29400,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(9),
    lastIssueDate: daysAgo(2),
    daysInStock: 9,
    riskLevel: "low",
    supplier: "Asahi India",
    supplierRating: 4.5,
    binLocation: "K1-02-B",
    lotNumber: "LOT-WG-2026-007",
    valuationDate: daysAgo(0),
    costAccountant: "Sunita Reddy",
  },
  {
    id: "IV-2026-7012",
    partNo: "RAD-CAP-012",
    description: "Radiator Cap 1.1 Bar",
    category: "Cooling System",
    warehouse: "Chennai Hub",
    abcClass: "C",
    status: "obsolete",
    method: "fifo",
    qtyOnHand: 820,
    unitCost: 65,
    totalValue: 53300,
    stdCost: 60,
    stdCostVariance: 4100,
    reserveAmount: 53300,
    reservePercent: 100,
    lastReceiptDate: daysAgo(180),
    lastIssueDate: daysAgo(120),
    daysInStock: 180,
    riskLevel: "critical",
    supplier: "Minda Industries",
    supplierRating: 3.8,
    binLocation: "L4-04-C",
    lotNumber: "LOT-RC-2025-098",
    valuationDate: daysAgo(0),
    costAccountant: "Anand Iyer",
  },
  {
    id: "IV-2026-7013",
    partNo: "AIR-FLT-013",
    description: "Air Filter Element Passenger",
    category: "Filter",
    warehouse: "Chennai Hub",
    abcClass: "B",
    status: "slow-moving",
    method: "fifo",
    qtyOnHand: 1650,
    unitCost: 285,
    totalValue: 470250,
    stdCost: 270,
    stdCostVariance: 24750,
    reserveAmount: 79942,
    reservePercent: 17,
    lastReceiptDate: daysAgo(72),
    lastIssueDate: daysAgo(28),
    daysInStock: 72,
    riskLevel: "medium",
    supplier: "Bosch India",
    supplierRating: 4.4,
    binLocation: "M2-03-A",
    lotNumber: "LOT-AF-2026-015",
    expiryDate: daysAgo(-180),
    valuationDate: daysAgo(0),
    costAccountant: "Anand Iyer",
  },
  {
    id: "IV-2026-7014",
    partNo: "SPK-PLG-014",
    description: "Spark Plug Iridium Tip",
    category: "Ignition",
    warehouse: "Pune Plant",
    abcClass: "B",
    status: "active",
    method: "weighted-average",
    qtyOnHand: 3200,
    unitCost: 195,
    totalValue: 624000,
    stdCost: 188,
    stdCostVariance: 22400,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(6),
    lastIssueDate: daysAgo(1),
    daysInStock: 6,
    riskLevel: "low",
    supplier: "NGK Spark Plugs",
    supplierRating: 4.7,
    binLocation: "N3-01-D",
    lotNumber: "LOT-SP-2026-022",
    valuationDate: daysAgo(0),
    costAccountant: "Sunita Reddy",
  },
  {
    id: "IV-2026-7015",
    partNo: "CLU-FAI-015",
    description: "Clutch First Article Assembly",
    category: "Clutch Assembly",
    warehouse: "Pune Plant",
    abcClass: "A",
    status: "quarantine",
    method: "standard",
    qtyOnHand: 180,
    unitCost: 6850,
    totalValue: 1233000,
    stdCost: 6720,
    stdCostVariance: 23400,
    reserveAmount: 308250,
    reservePercent: 25,
    lastReceiptDate: daysAgo(4),
    lastIssueDate: daysAgo(0),
    daysInStock: 4,
    riskLevel: "high",
    supplier: "Schaeffler India",
    supplierRating: 4.1,
    binLocation: "Q1-01-Q",
    lotNumber: "LOT-CF-2026-002",
    valuationDate: daysAgo(0),
    costAccountant: "Sunita Reddy",
  },
  {
    id: "IV-2026-7016",
    partNo: "HLM-SHL-016",
    description: "Safety Helmet Shell ISI Marked",
    category: "Safety Gear",
    warehouse: "Chennai Hub",
    abcClass: "C",
    status: "reserved",
    method: "fifo",
    qtyOnHand: 950,
    unitCost: 425,
    totalValue: 403750,
    stdCost: 410,
    stdCostVariance: 14250,
    reserveAmount: 0,
    reservePercent: 0,
    lastReceiptDate: daysAgo(15),
    lastIssueDate: daysAgo(5),
    daysInStock: 15,
    riskLevel: "low",
    supplier: "Karam Safety",
    supplierRating: 4.3,
    binLocation: "O2-02-B",
    lotNumber: "LOT-HS-2026-019",
    valuationDate: daysAgo(0),
    costAccountant: "Anand Iyer",
  },
]

// ──────────────────────────────────────────────────────────
// DETAIL DRAWER (6 sub-tabs)
// ──────────────────────────────────────────────────────────

function InventoryValuationDetailDrawer({ item, open, onOpenChange }: DrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "layers" | "movements" | "reserves" | "reconciliation" | "roll">("overview")
  const layers = useMemo(() => generateCostLayers(item), [item])
  const movements = useMemo(() => generateMovements(item), [item])
  const reserves = useMemo(() => generateReserves(item), [item])
  const journalEntries = useMemo(() => generateJournalEntries(item), [item])
  const reconciliation = useMemo(() => generateReconciliation(item), [item])
  const rolls = useMemo(() => generateStdCostRolls(item), [item])
  const trend = useMemo(() => generateMonthlyTrend(item), [item])

  const method = METHOD_CONFIG[item.method]
  const status = STATUS_CONFIG[item.status]
  const risk = RISK_CONFIG[item.riskLevel]
  const abc = ABC_CONFIG[item.abcClass]
  const totalReserve = reserves.reduce((s, r) => s + r.reserveAmount, 0)
  const totalDebit = journalEntries.reduce((s, j) => s + j.debit, 0)
  const totalCredit = journalEntries.reduce((s, j) => s + j.credit, 0)
  const balanced = totalDebit === totalCredit
  const movementTypeIcon = (t: MovementRecord["type"]) => {
    switch (t) {
      case "receipt": return <ArrowDown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      case "issue": return <ArrowUp className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
      case "transfer-in": return <ArrowLeftRight className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
      case "transfer-out": return <ArrowLeftRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
      case "adjustment": return <Wrench className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
      case "return": return <RotateCcw className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
      case "scrap": return <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
    }
  }

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Eye },
    { id: "layers" as const, label: "Cost Layers", icon: Layers },
    { id: "movements" as const, label: "Movements", icon: History },
    { id: "reserves" as const, label: "Reserves", icon: PiggyBank },
    { id: "reconciliation" as const, label: "Reconciliation", icon: Scale },
    { id: "roll" as const, label: "Std Cost Roll", icon: TrendingUp },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="iv-drawer-sheen w-full sm:max-w-[1100px] overflow-y-auto p-0 bg-white dark:bg-zinc-950"
      >
        <SheetHeader className="iv-drawer-header sticky top-0 z-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-cyan-950/40 border-b border-emerald-200/60 dark:border-emerald-900/60 px-6 pt-5 pb-4 backdrop-blur-sm shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", status.color, status.bg, status.border)}>
              <status.icon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
            <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", risk.color, risk.bg)}>
              <risk.icon className="h-3 w-3 mr-1" />
              {risk.label}
            </Badge>
            <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", method.color, method.bg)}>
              <method.icon className="h-3 w-3 mr-1" />
              {method.short}
            </Badge>
            <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", abc.color, abc.bg)}>
              ABC-{item.abcClass}
            </Badge>
            {item.supplierRating >= 4.5 && (
              <Badge variant="outline" className="badge-interactive rounded-full px-2.5 py-0.5 text-[10px] font-bold border border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900">
                <Star className="h-3 w-3 mr-1 fill-current" />
                {item.supplierRating.toFixed(1)}
              </Badge>
            )}
          </div>
          <SheetTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Avatar className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-600 text-white text-xs">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white">
                {item.partNo.substring(0, 3)}
              </AvatarFallback>
            </Avatar>
            {item.description}
          </SheetTitle>
          <SheetDescription className="text-xs text-zinc-600 dark:text-zinc-400 flex flex-wrap items-center gap-2 mt-1">
            <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">{item.id}</span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span>Part: <span className="font-mono">{item.partNo}</span></span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span>Bin: <span className="font-mono">{item.binLocation}</span></span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span>Lot: <span className="font-mono">{item.lotNumber}</span></span>
          </SheetDescription>

          <div className="iv-stat-enter mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
              <CardContent className="glass-subtle p-3">
                <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">On-Hand Qty</div>
                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{fmtNum(item.qtyOnHand)} <span className="text-xs text-zinc-500 font-normal">units</span></div>
                <div className="text-[10px] text-zinc-500">{item.daysInStock} days in stock</div>
              </CardContent>
            </Card>
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
              <CardContent className="glass-subtle p-3">
                <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Unit Cost ({method.short})</div>
                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{fmtINRFull(item.unitCost)}</div>
                <div className="text-[10px] text-zinc-500">Std: {fmtINRFull(item.stdCost)} <span className={cn(item.unitCost >= item.stdCost ? "text-rose-600" : "text-emerald-600")}>{fmtPct(((item.unitCost - item.stdCost) / item.stdCost) * 100)}</span></div>
              </CardContent>
            </Card>
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
              <CardContent className="glass-subtle p-3">
                <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Value</div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{fmtINR(item.totalValue)}</div>
                <div className="text-[10px] text-zinc-500">{fmtINRFull(item.totalValue)} total</div>
              </CardContent>
            </Card>
            <Card className={cn("border backdrop-blur", totalReserve > 0 ? "border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40" : "border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80")}>
              <CardContent className="glass-subtle p-3">
                <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Reserve</div>
                <div className={cn("text-xl font-bold", totalReserve > 0 ? "text-rose-700 dark:text-rose-300" : "text-zinc-900 dark:text-zinc-50")}>{fmtINR(totalReserve)}</div>
                <div className="text-[10px] text-zinc-500">{item.reservePercent.toFixed(0)}% of book value</div>
              </CardContent>
            </Card>
          </div>
        </SheetHeader>

        {/* Sub-tab strip */}
        <div className="sticky top-[200px] z-10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 px-6 py-2 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "iv-tab-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900",
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="iv-body-enter px-6 py-5">
          {/* ─── Overview tab ─── */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
                  <CardContent className="glass-subtle p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Book Value</span>
                      <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{fmtINR(item.totalValue)}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{fmtNum(item.qtyOnHand)} units × {fmtINRFull(item.unitCost)}</div>
                  </CardContent>
                </Card>
                <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
                  <CardContent className="glass-subtle p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Standard Value</span>
                      <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{fmtINR(item.qtyOnHand * item.stdCost)}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Variance: <span className={cn("font-semibold", item.stdCostVariance >= 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400")}>{fmtINR(item.stdCostVariance)}</span></div>
                  </CardContent>
                </Card>
                <Card className={cn("iv-card-enter border", totalReserve > 0 ? "border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20" : "border-zinc-200 dark:border-zinc-800")}>
                  <CardContent className="glass-subtle p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Net Realizable Value</span>
                      <PiggyBank className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{fmtINR(item.totalValue - totalReserve)}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">After reserve of {fmtINR(totalReserve)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="iv-chart-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    6-Month Valuation Trend (by Method)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Comparative valuation across FIFO, LIFO, Weighted Average, and Standard Cost methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={trend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ivFifo" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="ivLifo" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="ivWac" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="ivStd" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="currentColor" className="text-zinc-500" />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtINR(v)} stroke="currentColor" className="text-zinc-500" />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e4e4e7" }}
                        formatter={(v: number) => fmtINRFull(v)}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="fifo" name="FIFO" stroke="#3b82f6" fill="url(#ivFifo)" strokeWidth={2} />
                      <Area type="monotone" dataKey="lifo" name="LIFO" stroke="#f43f5e" fill="url(#ivLifo)" strokeWidth={2} />
                      <Area type="monotone" dataKey="weightedAvg" name="Weighted Avg" stroke="#10b981" fill="url(#ivWac)" strokeWidth={2} />
                      <Area type="monotone" dataKey="standard" name="Standard" stroke="#f59e0b" fill="url(#ivStd)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Inventory Traceability & Ownership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Warehouse</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">{item.warehouse}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Bin Location</div>
                      <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">{item.binLocation}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Lot Number</div>
                      <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">{item.lotNumber}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Expiry Date</div>
                      <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">{item.expiryDate || "—"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Last Receipt</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">{item.lastReceiptDate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Last Issue</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">{item.lastIssueDate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Cost Accountant</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">{item.costAccountant}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Valuation Date</div>
                      <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">{item.valuationDate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    Supplier Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-md bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900">
                      <div className="text-[10px] uppercase text-cyan-700 dark:text-cyan-300 font-semibold tracking-wider">Supplier Name</div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-50 mt-1">{item.supplier}</div>
                    </div>
                    <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                      <div className="text-[10px] uppercase text-amber-700 dark:text-amber-300 font-semibold tracking-wider">Supplier Rating</div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-50 mt-1 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        {item.supplierRating.toFixed(1)} / 5.0
                      </div>
                    </div>
                    <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                      <div className="text-[10px] uppercase text-emerald-700 dark:text-emerald-300 font-semibold tracking-wider">Linked PCV</div>
                      <div className="font-mono font-bold text-zinc-900 dark:text-zinc-50 mt-1">{item.pcvRef || "—"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── Cost Layers tab ─── */}
          {activeTab === "layers" && (
            <div className="space-y-4">
              <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Cost Layer Breakdown — {method.label}
                  </CardTitle>
                  <CardDescription className="text-xs">{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                        <TableHead className="text-[10px] uppercase">Layer ID</TableHead>
                        <TableHead className="text-[10px] uppercase">Receipt Date</TableHead>
                        <TableHead className="text-[10px] uppercase">GRN / PO</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Qty Received</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Qty Remaining</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Unit Cost</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Extended</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Age (days)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {layers.map((layer, idx) => (
                        <TableRow key={layer.layerId} className={cn("iv-row-in", layer.ageDays > 90 && "bg-amber-50/40 dark:bg-amber-950/20")}>
                          <TableCell className="font-mono text-[11px]">{layer.layerId}</TableCell>
                          <TableCell className="font-mono text-[11px]">{layer.receiptDate}</TableCell>
                          <TableCell className="text-[11px]">
                            <div className="font-mono">{layer.receiptNo}</div>
                            <div className="text-zinc-500">{layer.poNumber}</div>
                          </TableCell>
                          <TableCell className="text-right font-mono text-[11px]">{fmtNum(layer.qtyReceived)}</TableCell>
                          <TableCell className="text-right font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">{fmtNum(layer.qtyRemaining)}</TableCell>
                          <TableCell className="numeric-cell text-right font-mono text-[11px]">{fmtINRFull(layer.unitCost)}</TableCell>
                          <TableCell className="numeric-cell text-right font-mono text-[11px] font-semibold">{fmtINR(layer.extendedCost)}</TableCell>
                          <TableCell className="text-right text-[11px]">
                            <Badge variant="outline" className={cn("text-[10px]", layer.ageDays > 90 ? "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900" : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900")}>
                              {layer.ageDays}d
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 font-semibold">
                        <TableCell colSpan={4} className="text-right text-[11px]">TOTAL</TableCell>
                        <TableCell className="text-right font-mono text-[11px]">{fmtNum(layers.reduce((s, l) => s + l.qtyRemaining, 0))}</TableCell>
                        <TableCell className="text-right text-[11px]">—</TableCell>
                        <TableCell className="numeric-cell text-right font-mono text-[11px]">{fmtINR(layers.reduce((s, l) => s + l.extendedCost, 0))}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="iv-chart-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Cost Layer Aging Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={layers.map((l) => ({ name: l.layerId.split("-").pop(), qty: l.qtyRemaining, value: l.extendedCost, age: l.ageDays }))} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="currentColor" className="text-zinc-500" />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtINR(v)} stroke="currentColor" className="text-zinc-500" />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8 }}
                        formatter={(v: number, n: string) => n === "value" ? fmtINRFull(v) : fmtNum(v)}
                      />
                      <Bar dataKey="value" name="Layer Value" radius={[6, 6, 0, 0]}>
                        {layers.map((l, i) => (
                          <Cell key={i} fill={l.ageDays > 90 ? "#f59e0b" : l.ageDays > 30 ? "#3b82f6" : "#10b981"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── Movements tab ─── */}
          {activeTab === "movements" && (
            <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <History className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Inventory Movement History
                </CardTitle>
                <CardDescription className="text-xs">
                  All in/out transactions affecting on-hand balance — receipts, issues, transfers, adjustments, returns, scrap
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                      <TableHead className="text-[10px] uppercase">Movement ID</TableHead>
                      <TableHead className="text-[10px] uppercase">Date</TableHead>
                      <TableHead className="text-[10px] uppercase">Type</TableHead>
                      <TableHead className="text-[10px] uppercase">Reference</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Qty</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Unit Cost</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Value</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Balance</TableHead>
                      <TableHead className="text-[10px] uppercase">User</TableHead>
                      <TableHead className="text-[10px] uppercase">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((m) => (
                      <TableRow key={m.movementId} className="iv-row-in">
                        <TableCell className="font-mono text-[10px]">{m.movementId}</TableCell>
                        <TableCell className="font-mono text-[10px]">{m.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {movementTypeIcon(m.type)}
                            <span className="text-[10px] capitalize font-semibold">{m.type.replace("-", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-[10px]">{m.reference}</TableCell>
                        <TableCell className={cn("text-right font-mono text-[11px] font-semibold", m.qty >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>
                          {m.qty > 0 ? "+" : ""}{fmtNum(m.qty)}
                        </TableCell>
                        <TableCell className="numeric-cell text-right font-mono text-[10px]">{fmtINRFull(m.unitCost)}</TableCell>
                        <TableCell className={cn("text-right font-mono text-[11px]", m.qty >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>{fmtINR(m.extendedValue)}</TableCell>
                        <TableCell className="text-right font-mono text-[10px] text-zinc-600 dark:text-zinc-400">{fmtNum(m.balance)}</TableCell>
                        <TableCell className="text-[10px]">{m.user}</TableCell>
                        <TableCell className="text-[10px] text-zinc-500 max-w-[180px] truncate">{m.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* ─── Reserves tab ─── */}
          {activeTab === "reserves" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="iv-card-enter border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20">
                  <CardContent className="glass-subtle p-4">
                    <div className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Total Reserve</div>
                    <div className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">{fmtINR(totalReserve)}</div>
                    <div className="text-xs text-zinc-500">{((totalReserve / item.totalValue) * 100).toFixed(1)}% of book value</div>
                  </CardContent>
                </Card>
                <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
                  <CardContent className="glass-subtle p-4">
                    <div className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Active Reserves</div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{reserves.filter((r) => r.status === "active").length}</div>
                    <div className="text-xs text-zinc-500">of {reserves.length} total entries</div>
                  </CardContent>
                </Card>
                <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
                  <CardContent className="glass-subtle p-4">
                    <div className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Net Book Value</div>
                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{fmtINR(item.totalValue - totalReserve)}</div>
                    <div className="text-xs text-zinc-500">After reserves applied</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <PiggyBank className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    Inventory Reserve Entries (Ind AS 2)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Per Ind AS 2 — inventory carried at lower of cost and net realizable value (NRV)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                        <TableHead className="text-[10px] uppercase">Reserve Type</TableHead>
                        <TableHead className="text-[10px] uppercase">Description</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Reserve %</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Reserve Amount</TableHead>
                        <TableHead className="text-[10px] uppercase">Status</TableHead>
                        <TableHead className="text-[10px] uppercase">Approved By</TableHead>
                        <TableHead className="text-[10px] uppercase">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reserves.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-zinc-500 py-8 italic">
                            No active reserves — inventory at full book value
                          </TableCell>
                        </TableRow>
                      ) : (
                        reserves.map((r) => (
                          <TableRow key={r.reserveType + r.description} className="iv-row-warn">
                            <TableCell>
                              <Badge variant="outline" className="badge-interactive text-[10px] capitalize border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
                                {r.reserveType.replace("-", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[11px]">
                              <div className="font-semibold">{r.description}</div>
                              <div className="text-zinc-500 text-[10px] max-w-[280px] truncate">{r.justification}</div>
                            </TableCell>
                            <TableCell className="numeric-cell text-right font-mono text-[11px] font-semibold">{r.reservePercent}%</TableCell>
                            <TableCell className="numeric-cell text-right font-mono text-[11px] font-semibold text-rose-700 dark:text-rose-300">{fmtINR(r.reserveAmount)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                "text-[10px] capitalize",
                                r.status === "active" && "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
                                r.status === "increased" && "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
                                r.status === "released" && "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
                                r.status === "reversed" && "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
                              )}>
                                {r.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[10px]">{r.approvedBy}</TableCell>
                            <TableCell className="font-mono text-[10px]">{r.approvedDate}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {journalEntries.length > 0 && (
                <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      Journal Entries — Ind AS 2 Style
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Period-end valuation adjustment journal — balanced debit/credit per double-entry bookkeeping
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table className="table-hover-highlight">
                      <TableHeader>
                        <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                          <TableHead className="text-[10px] uppercase">Entry ID</TableHead>
                          <TableHead className="text-[10px] uppercase">Account Code</TableHead>
                          <TableHead className="text-[10px] uppercase">Account Name</TableHead>
                          <TableHead className="text-[10px] uppercase">Narrative</TableHead>
                          <TableHead className="text-[10px] uppercase text-right">Debit</TableHead>
                          <TableHead className="text-[10px] uppercase text-right">Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {journalEntries.map((j) => (
                          <TableRow key={j.entryId} className="iv-row-in">
                            <TableCell className="font-mono text-[10px]">{j.entryId}</TableCell>
                            <TableCell className="font-mono text-[10px] text-blue-700 dark:text-blue-300">{j.accountCode}</TableCell>
                            <TableCell className="text-[11px] font-semibold">{j.account}</TableCell>
                            <TableCell className="text-[10px] text-zinc-500 max-w-[260px]">{j.narrative}</TableCell>
                            <TableCell className="text-right font-mono text-[11px] text-emerald-700 dark:text-emerald-300">{j.debit > 0 ? fmtINRFull(j.debit) : "—"}</TableCell>
                            <TableCell className="text-right font-mono text-[11px] text-rose-700 dark:text-rose-300">{j.credit > 0 ? fmtINRFull(j.credit) : "—"}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 font-semibold">
                          <TableCell colSpan={4} className="text-right text-[11px]">TOTAL</TableCell>
                          <TableCell className="numeric-cell text-right font-mono text-[11px]">{fmtINRFull(totalDebit)}</TableCell>
                          <TableCell className="numeric-cell text-right font-mono text-[11px]">{fmtINRFull(totalCredit)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={6} className="text-right text-[11px] py-2">
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-bold",
                              balanced ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900" : "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
                            )}>
                              {balanced ? <CheckCircle2 className="h-3 w-3 mr-1 inline" /> : <XCircle className="h-3 w-3 mr-1 inline" />}
                              {balanced ? "Balanced" : "Unbalanced"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* ─── Reconciliation tab ─── */}
          {activeTab === "reconciliation" && (
            <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Scale className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Book vs Physical Reconciliation History
                </CardTitle>
                <CardDescription className="text-xs">
                  Cycle count reconciliation — quarterly physical vs book inventory comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="table-hover-highlight">
                  <TableHeader>
                    <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                      <TableHead className="text-[10px] uppercase">Recon ID</TableHead>
                      <TableHead className="text-[10px] uppercase">Date</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Book Qty</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Physical Qty</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Variance Qty</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Book Value</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Physical Value</TableHead>
                      <TableHead className="text-[10px] uppercase text-right">Variance Value</TableHead>
                      <TableHead className="text-[10px] uppercase">Status</TableHead>
                      <TableHead className="text-[10px] uppercase">Investigator</TableHead>
                      <TableHead className="text-[10px] uppercase">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciliation.map((r) => (
                      <TableRow key={r.reconId} className={cn(
                        "iv-row-in",
                        r.status === "variance" && "bg-amber-50/40 dark:bg-amber-950/20",
                        r.status === "under-investigation" && "bg-rose-50/40 dark:bg-rose-950/20",
                      )}>
                        <TableCell className="font-mono text-[10px]">{r.reconId}</TableCell>
                        <TableCell className="font-mono text-[10px]">{r.date}</TableCell>
                        <TableCell className="text-right font-mono text-[11px]">{fmtNum(r.bookQty)}</TableCell>
                        <TableCell className="text-right font-mono text-[11px]">{fmtNum(r.physicalQty)}</TableCell>
                        <TableCell className={cn("text-right font-mono text-[11px] font-semibold", r.varianceQty === 0 ? "text-zinc-500" : r.varianceQty > 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>
                          {r.varianceQty > 0 ? "+" : ""}{fmtNum(r.varianceQty)}
                        </TableCell>
                        <TableCell className="numeric-cell text-right font-mono text-[10px]">{fmtINR(r.bookValue)}</TableCell>
                        <TableCell className="numeric-cell text-right font-mono text-[10px]">{fmtINR(r.physicalValue)}</TableCell>
                        <TableCell className={cn("text-right font-mono text-[11px] font-semibold", r.varianceValue === 0 ? "text-zinc-500" : r.varianceValue > 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>
                          {r.varianceValue > 0 ? "+" : ""}{fmtINR(r.varianceValue)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-[10px]",
                            r.status === "matched" && "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
                            r.status === "variance" && "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
                            r.status === "under-investigation" && "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
                          )}>
                            {r.status.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px]">{r.investigator}</TableCell>
                        <TableCell className="text-[10px] text-zinc-500 max-w-[160px] truncate">{r.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* ─── Std Cost Roll tab ─── */}
          {activeTab === "roll" && (
            <div className="space-y-4">
              <Card className="iv-card-enter border border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20">
                <CardContent className="glass-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase text-amber-700 dark:text-amber-300 tracking-wider">Current Standard Cost</div>
                      <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{fmtINRFull(item.stdCost)}<span className="text-sm font-normal text-zinc-500 ml-2">/ unit</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">vs Current Unit Cost</div>
                      <div className={cn("text-lg font-bold mt-1", item.unitCost > item.stdCost ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300")}>
                        {fmtPct(((item.unitCost - item.stdCost) / item.stdCost) * 100)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="iv-card-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Standard Cost Roll History
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Standard cost revisions linked to PCV module — effective dates, variances, and approval status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                        <TableHead className="text-[10px] uppercase">Roll ID</TableHead>
                        <TableHead className="text-[10px] uppercase">Effective Date</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Prev Std Cost</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">New Std Cost</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Variance</TableHead>
                        <TableHead className="text-[10px] uppercase text-right">Variance %</TableHead>
                        <TableHead className="text-[10px] uppercase">Reason</TableHead>
                        <TableHead className="text-[10px] uppercase">PCV Ref</TableHead>
                        <TableHead className="text-[10px] uppercase">Approved By</TableHead>
                        <TableHead className="text-[10px] uppercase">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rolls.map((roll) => (
                        <TableRow key={roll.rollId} className="iv-row-in">
                          <TableCell className="font-mono text-[10px]">{roll.rollId}</TableCell>
                          <TableCell className="font-mono text-[10px]">{roll.effectiveDate}</TableCell>
                          <TableCell className="numeric-cell text-right font-mono text-[10px]">{fmtINRFull(roll.prevStdCost)}</TableCell>
                          <TableCell className="numeric-cell text-right font-mono text-[11px] font-semibold">{fmtINRFull(roll.newStdCost)}</TableCell>
                          <TableCell className={cn("text-right font-mono text-[11px] font-semibold", roll.variance >= 0 ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300")}>
                            {roll.variance > 0 ? "+" : ""}{fmtINRFull(roll.variance)}
                          </TableCell>
                          <TableCell className={cn("text-right font-mono text-[11px]", roll.variancePercent >= 0 ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300")}>
                            {fmtPct(roll.variancePercent)}
                          </TableCell>
                          <TableCell className="text-[10px] max-w-[200px]">{roll.reason}</TableCell>
                          <TableCell className="font-mono text-[10px] text-blue-700 dark:text-blue-300">{roll.pcvRef}</TableCell>
                          <TableCell className="text-[10px]">{roll.approvedBy}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "text-[10px]",
                              roll.status === "approved" && "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
                              roll.status === "pending" && "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
                              roll.status === "rejected" && "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
                            )}>
                              {roll.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="iv-chart-enter border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Standard Cost Evolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={[...rolls].reverse().map((r) => ({ date: r.effectiveDate, cost: r.newStdCost, prev: r.prevStdCost }))} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="currentColor" className="text-zinc-500" />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtINR(v)} stroke="currentColor" className="text-zinc-500" />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8 }}
                        formatter={(v: number) => fmtINRFull(v)}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="cost" name="New Std Cost" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: "#f59e0b" }} />
                      <Line type="monotone" dataKey="prev" name="Prev Std Cost" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 bg-zinc-50 dark:bg-zinc-950/80 flex flex-row items-center justify-between gap-2 sticky bottom-0">
          <Button variant="outline" size="sm" onClick={() => {
            exportToCSV(
              [
                { field: "id", value: item.id },
                { field: "part_no", value: item.partNo },
                { field: "description", value: item.description },
                { field: "category", value: item.category },
                { field: "warehouse", value: item.warehouse },
                { field: "method", value: item.method },
                { field: "qty_on_hand", value: item.qtyOnHand },
                { field: "unit_cost", value: item.unitCost },
                { field: "total_value", value: item.totalValue },
                { field: "std_cost", value: item.stdCost },
                { field: "std_cost_variance", value: item.stdCostVariance },
                { field: "reserve_amount", value: totalReserve },
                { field: "net_realizable_value", value: item.totalValue - totalReserve },
                { field: "cost_layers_count", value: layers.length },
                { field: "movements_count", value: movements.length },
                { field: "active_reserves_count", value: reserves.filter((r) => r.status === "active").length },
                { field: "valuation_date", value: item.valuationDate },
              ].map((r) => ({ [r.field]: r.value })),
              `inventory-valuation-${item.id}.csv`,
            )
          }}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <div className="flex items-center gap-2">
            {item.status === "slow-moving" && (
              <Button size="sm" variant="default" className="bg-amber-600 hover:bg-amber-700" onClick={() => {}}>
                <Timer className="h-3.5 w-3.5 mr-1.5" />
                Initiate Clearance Plan
              </Button>
            )}
            {item.status === "obsolete" && (
              <Button size="sm" variant="destructive" onClick={() => {}}>
                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                Initiate Scrap Write-off
              </Button>
            )}
            {item.status === "quarantine" && (
              <Button size="sm" variant="destructive" className="bg-purple-600 hover:bg-purple-700" onClick={() => {}}>
                <Crosshair className="h-3.5 w-3.5 mr-1.5" />
                Initiate Disposition Review
              </Button>
            )}
            {item.status === "active" && item.stdCostVariance > 0 && (
              <Button size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {}}>
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Update Standard Cost
              </Button>
            )}
            {item.status === "reserved" && (
              <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={() => {}}>
                <BookMarked className="h-3.5 w-3.5 mr-1.5" />
                Release Reservation
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
              <XCircle className="h-3.5 w-3.5 mr-1.5" />
              Close
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ──────────────────────────────────────────────────────────
// MAIN VIEW
// ──────────────────────────────────────────────────────────

export function InventoryValuationView() {
  const { toast } = useToast()
  const [activeStatus, setActiveStatus] = useState<StockStatus | "all">("all")
  const [methodFilter, setMethodFilter] = useState<ValuationMethod | "all">("all")
  const [abcFilter, setAbcFilter] = useState<ABCClass | "all">("all")
  const [search, setSearch] = useState("")
  const [selectedItem, setSelectedItem] = useState<InventoryValuationItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = useMemo(() => {
    return IV_ITEMS.filter((item) => {
      if (activeStatus !== "all" && item.status !== activeStatus) return false
      if (methodFilter !== "all" && item.method !== methodFilter) return false
      if (abcFilter !== "all" && item.abcClass !== abcFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !item.id.toLowerCase().includes(q) &&
          !item.partNo.toLowerCase().includes(q) &&
          !item.description.toLowerCase().includes(q) &&
          !item.category.toLowerCase().includes(q) &&
          !item.warehouse.toLowerCase().includes(q) &&
          !item.supplier.toLowerCase().includes(q) &&
          !item.binLocation.toLowerCase().includes(q) &&
          !item.lotNumber.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [activeStatus, methodFilter, abcFilter, search])

  // Aggregate KPIs
  const totalValue = IV_ITEMS.reduce((s, i) => s + i.totalValue, 0)
  const fifoValue = IV_ITEMS.filter((i) => i.method === "fifo").reduce((s, i) => s + i.totalValue, 0)
  const lifoValue = IV_ITEMS.filter((i) => i.method === "lifo").reduce((s, i) => s + i.totalValue, 0)
  const wacValue = IV_ITEMS.filter((i) => i.method === "weighted-average").reduce((s, i) => s + i.totalValue, 0)
  const stdValue = IV_ITEMS.filter((i) => i.method === "standard").reduce((s, i) => s + i.totalValue, 0)
  const totalReserve = IV_ITEMS.reduce((s, i) => s + i.reserveAmount, 0)
  const totalStdVariance = IV_ITEMS.reduce((s, i) => s + i.stdCostVariance, 0)
  const obsoleteCount = IV_ITEMS.filter((i) => i.status === "obsolete").length
  const slowMovingCount = IV_ITEMS.filter((i) => i.status === "slow-moving").length
  const criticalCount = IV_ITEMS.filter((i) => i.riskLevel === "critical").length
  const quarantineCount = IV_ITEMS.filter((i) => i.status === "quarantine").length

  // Aggregate 6-month trend (sum across all items by month)
  const aggregateTrend = useMemo(() => {
    const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"]
    return months.map((month) => {
      const items = IV_ITEMS.map((it) => generateMonthlyTrend(it)).flat().filter((t) => t.month === month)
      return {
        month,
        fifo: items.reduce((s, t) => s + t.fifo, 0),
        lifo: items.reduce((s, t) => s + t.lifo, 0),
        weightedAvg: items.reduce((s, t) => s + t.weightedAvg, 0),
        standard: items.reduce((s, t) => s + t.standard, 0),
        reserve: items.reduce((s, t) => s + t.reserve, 0),
      }
    })
  }, [])

  // Status distribution
  const statusDistribution = useMemo(() => {
    const map = new Map<StockStatus, number>()
    IV_ITEMS.forEach((i) => map.set(i.status, (map.get(i.status) || 0) + 1))
    return Array.from(map.entries()).map(([status, count]) => ({ status, count }))
  }, [])

  // Method distribution
  const methodDistribution = useMemo(() => {
    const map = new Map<ValuationMethod, number>()
    IV_ITEMS.forEach((i) => map.set(i.method, (map.get(i.method) || 0) + i.totalValue))
    return Array.from(map.entries()).map(([method, value]) => ({ method, value }))
  }, [])

  // Top 10 parts by value
  const top10ByValue = useMemo(() => {
    return [...IV_ITEMS].sort((a, b) => b.totalValue - a.totalValue).slice(0, 10)
  }, [])

  // Reserve by category
  const reserveByCategory = useMemo(() => {
    const map = new Map<string, number>()
    IV_ITEMS.forEach((i) => {
      map.set(i.category, (map.get(i.category) || 0) + i.reserveAmount)
    })
    return Array.from(map.entries())
      .map(([category, amount]) => ({ category, amount }))
      .filter((r) => r.amount > 0)
      .sort((a, b) => b.amount - a.amount)
  }, [])

  // Value by warehouse
  const valueByWarehouse = useMemo(() => {
    const map = new Map<string, number>()
    IV_ITEMS.forEach((i) => map.set(i.warehouse, (map.get(i.warehouse) || 0) + i.totalValue))
    return Array.from(map.entries()).map(([warehouse, value]) => ({ warehouse, value }))
  }, [])

  const statusTabs: { id: StockStatus | "all"; label: string; count: number }[] = [
    { id: "all", label: "All", count: IV_ITEMS.length },
    ...Object.entries(STATUS_CONFIG).map(([id, cfg]) => ({
      id: id as StockStatus,
      label: cfg.label,
      count: IV_ITEMS.filter((i) => i.status === id).length,
    })),
  ]

  const handleRowClick = (item: InventoryValuationItem) => {
    setSelectedItem(item)
    setDrawerOpen(true)
  }

  const handleExport = () => {
    exportToCSV(
      filtered.map((i) => ({
        id: i.id,
        part_no: i.partNo,
        description: i.description,
        category: i.category,
        warehouse: i.warehouse,
        abc_class: i.abcClass,
        status: i.status,
        method: i.method,
        qty_on_hand: i.qtyOnHand,
        unit_cost: i.unitCost,
        total_value: i.totalValue,
        std_cost: i.stdCost,
        std_cost_variance: i.stdCostVariance,
        reserve_amount: i.reserveAmount,
        reserve_percent: i.reservePercent,
        days_in_stock: i.daysInStock,
        risk_level: i.riskLevel,
        supplier: i.supplier,
        supplier_rating: i.supplierRating,
        bin_location: i.binLocation,
        lot_number: i.lotNumber,
        expiry_date: i.expiryDate || "",
        pcv_ref: i.pcvRef || "",
        valuation_date: i.valuationDate,
        cost_accountant: i.costAccountant,
      })),
      "inventory-valuation-export.csv",
    )
    toast.success("Export Complete", `${filtered.length} records exported to CSV`)
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <PageHeader
        title="Inventory Valuation"
        description="Period-end inventory valuation by FIFO / LIFO / Weighted Average / Standard Cost — Ind AS 2 compliant reserves, journal entries, and standard cost roll history"
      />

      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Landmark className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">Ind AS 2</span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span>Lower of Cost or NRV</span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span>Valuation Date: <span className="font-mono font-semibold">{daysAgo(0)}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Refreshed", "Valuation recalculated from latest GL snapshot")}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.info("Period Close Started", "Period-end valuation run initiated — Ind AS 2 adjustment journals will be generated automatically")}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Run Period Close
          </Button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="iv-kpi-enter grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="iv-kpi-enter relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardContent className="glass-subtle p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Total Inventory Value</span>
              <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{fmtINR(totalValue)}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{fmtINRFull(totalValue)} across {IV_ITEMS.length} SKUs</div>
          </CardContent>
        </Card>
        <Card className="iv-kpi-enter relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardContent className="glass-subtle p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">FIFO Value</span>
              <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{fmtINR(fifoValue)}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{((fifoValue / totalValue) * 100).toFixed(1)}% of total</div>
          </CardContent>
        </Card>
        <Card className="iv-kpi-enter relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
          <CardContent className="glass-subtle p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">WAC Value</span>
              <Scale className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{fmtINR(wacValue)}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{((wacValue / totalValue) * 100).toFixed(1)}% of total</div>
          </CardContent>
        </Card>
        <Card className="iv-kpi-enter relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
          <CardContent className="glass-subtle p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Standard Value</span>
              <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{fmtINR(stdValue)}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Var: <span className={cn("font-semibold", totalStdVariance >= 0 ? "text-rose-600" : "text-emerald-600")}>{fmtINR(totalStdVariance)}</span></div>
          </CardContent>
        </Card>
        <Card className={cn("iv-kpi-enter relative overflow-hidden border", totalReserve > 0 ? "border-rose-200 dark:border-rose-900 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30" : "border-zinc-200 dark:border-zinc-800")}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
          {totalReserve > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          )}
          <CardContent className="glass-subtle p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Total Reserve</span>
              <PiggyBank className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">{fmtINR(totalReserve)}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Obsolete {obsoleteCount} · Slow {slowMovingCount} · Crit {criticalCount}</div>
          </CardContent>
        </Card>
        <Card className="iv-kpi-enter relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
          <CardContent className="glass-subtle p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Quarantine Value</span>
              <Archive className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{fmtINR(IV_ITEMS.filter((i) => i.status === "quarantine").reduce((s, i) => s + i.totalValue, 0))}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{quarantineCount} SKU{quarantineCount !== 1 ? "s" : ""} under QIP review</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="iv-chart-enter lg:col-span-2 border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              6-Month Valuation Trend (by Method)
            </CardTitle>
            <CardDescription className="text-xs">
              Comparative valuation trend — FIFO / LIFO / Weighted Average / Standard Cost aggregated across all SKUs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={aggregateTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="agIvFifo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="agIvLifo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="agIvWac" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="agIvStd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="currentColor" className="text-zinc-500" />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtINR(v)} stroke="currentColor" className="text-zinc-500" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtINRFull(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="fifo" name="FIFO" stroke="#3b82f6" fill="url(#agIvFifo)" strokeWidth={2} />
                <Area type="monotone" dataKey="lifo" name="LIFO" stroke="#f43f5e" fill="url(#agIvLifo)" strokeWidth={2} />
                <Area type="monotone" dataKey="weightedAvg" name="WAC" stroke="#10b981" fill="url(#agIvWac)" strokeWidth={2} />
                <Area type="monotone" dataKey="standard" name="STD" stroke="#f59e0b" fill="url(#agIvStd)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="iv-chart-enter border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Gauge className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Stock Status Distribution
            </CardTitle>
            <CardDescription className="text-xs">Inventory items by stock status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  label={(entry) => `${STATUS_CONFIG[entry.status as StockStatus].label}: ${entry.count}`}
                  labelLine={false}
                >
                  {statusDistribution.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_CONFIG[entry.status].pieColor} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second row charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="iv-chart-enter border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Value by Costing Method
            </CardTitle>
            <CardDescription className="text-xs">Total inventory value allocated by valuation method</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={methodDistribution}
                  dataKey="value"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  label={(entry) => `${METHOD_CONFIG[entry.method as ValuationMethod].short}: ${fmtINR(entry.value)}`}
                  labelLine={false}
                >
                  {methodDistribution.map((entry) => (
                    <Cell key={entry.method} fill={METHOD_CONFIG[entry.method].pieColor} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtINRFull(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="iv-chart-enter lg:col-span-2 border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Top 10 SKUs by Inventory Value
            </CardTitle>
            <CardDescription className="text-xs">Highest value items — focus of period-end reserve review</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={top10ByValue.map((i) => ({ name: i.partNo, value: i.totalValue, status: i.status, method: i.method }))} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => fmtINR(v)} stroke="currentColor" className="text-zinc-500" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} stroke="currentColor" className="text-zinc-500" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtINRFull(v)} />
                <Bar dataKey="value" name="Value" radius={[0, 6, 6, 0]}>
                  {top10ByValue.map((i) => (
                    <Cell key={i.id} fill={STATUS_CONFIG[i.status].pieColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="iv-chart-enter border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              Reserve by Category
            </CardTitle>
            <CardDescription className="text-xs">Total reserve amount (obsolete + slow-moving + price decline + damage + expiry) per part category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={reserveByCategory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                <XAxis dataKey="category" tick={{ fontSize: 9 }} stroke="currentColor" className="text-zinc-500" angle={-25} textAnchor="end" height={70} interval={0} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtINR(v)} stroke="currentColor" className="text-zinc-500" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtINRFull(v)} />
                <Bar dataKey="amount" name="Reserve" radius={[6, 6, 0, 0]} fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="iv-chart-enter border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              Inventory Value by Warehouse
            </CardTitle>
            <CardDescription className="text-xs">Total book value across warehouses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={valueByWarehouse} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                <XAxis dataKey="warehouse" tick={{ fontSize: 11 }} stroke="currentColor" className="text-zinc-500" />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtINR(v)} stroke="currentColor" className="text-zinc-500" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtINRFull(v)} />
                <Bar dataKey="value" name="Value" radius={[6, 6, 0, 0]} fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStatus(tab.id)}
            className={cn(
              "iv-tab-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
              activeStatus === tab.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800",
            )}
          >
            {tab.label}
            <Badge variant="secondary" className="badge-interactive ml-1 text-[10px] h-4 px-1.5">{tab.count}</Badge>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="iv-search-focus relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by ID, part no, description, supplier, bin, lot..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as ValuationMethod | "all")}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Costing Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="fifo">FIFO</SelectItem>
            <SelectItem value="lifo">LIFO</SelectItem>
            <SelectItem value="weighted-average">Weighted Average</SelectItem>
            <SelectItem value="standard">Standard Cost</SelectItem>
          </SelectContent>
        </Select>
        <Select value={abcFilter} onValueChange={(v) => setAbcFilter(v as ABCClass | "all")}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="ABC Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ABC</SelectItem>
            <SelectItem value="A">A Class</SelectItem>
            <SelectItem value="B">B Class</SelectItem>
            <SelectItem value="C">C Class</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-xs text-zinc-500 ml-auto">
          Showing <span className="font-semibold text-zinc-700 dark:text-zinc-300">{filtered.length}</span> of {IV_ITEMS.length} items
        </div>
      </div>

      {/* Master table */}
      <Card className="card-crud-lift iv-table-card border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <CardContent className="glass-subtle p-0">
          <Table className="table-hover-highlight">
            <TableHeader>
              <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                <TableHead className="text-[10px] uppercase">Part / Description</TableHead>
                <TableHead className="text-[10px] uppercase">Status</TableHead>
                <TableHead className="text-[10px] uppercase">Method</TableHead>
                <TableHead className="text-[10px] uppercase">ABC</TableHead>
                <TableHead className="text-[10px] uppercase">Risk</TableHead>
                <TableHead className="text-[10px] uppercase text-right">Qty On Hand</TableHead>
                <TableHead className="text-[10px] uppercase text-right">Unit Cost</TableHead>
                <TableHead className="text-[10px] uppercase text-right">Total Value</TableHead>
                <TableHead className="text-[10px] uppercase text-right">Reserve</TableHead>
                <TableHead className="text-[10px] uppercase text-right">Net Value</TableHead>
                <TableHead className="text-[10px] uppercase">Warehouse / Bin</TableHead>
                <TableHead className="text-[10px] uppercase">Supplier</TableHead>
                <TableHead className="text-[10px] uppercase">Days</TableHead>
                <TableHead className="text-[10px] uppercase"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const cfg = STATUS_CONFIG[item.status]
                const mCfg = METHOD_CONFIG[item.method]
                const rCfg = RISK_CONFIG[item.riskLevel]
                const aCfg = ABC_CONFIG[item.abcClass]
                return (
                  <TableRow
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className={cn(
                      "iv-row-in cursor-pointer group",
                      item.status === "obsolete" && "iv-row-critical",
                      (item.status === "slow-moving" || item.status === "quarantine") && "iv-row-warn",
                      item.status === "active" && "iv-row-favorable",
                    )}
                  >
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-600 text-white text-[10px]">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white">
                            {item.partNo.substring(0, 3)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">{item.description}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{item.id} · {item.partNo}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] border", cfg.color, cfg.bg, cfg.border)}>
                        <cfg.icon className="h-3 w-3 mr-1" />
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] border", mCfg.color, mCfg.bg)}>
                        {mCfg.short}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] border", aCfg.color, aCfg.bg)}>
                        {item.abcClass}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] border", rCfg.color, rCfg.bg)}>
                        <rCfg.icon className="h-3 w-3 mr-1" />
                        {rCfg.label.replace(" Risk", "")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[11px]">{fmtNum(item.qtyOnHand)}</TableCell>
                    <TableCell className="numeric-cell text-right font-mono text-[11px]">{fmtINRFull(item.unitCost)}</TableCell>
                    <TableCell className="numeric-cell text-right font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">{fmtINR(item.totalValue)}</TableCell>
                    <TableCell className="text-right font-mono text-[11px]">
                      {item.reserveAmount > 0 ? (
                        <span className="text-rose-700 dark:text-rose-300 font-semibold">{fmtINR(item.reserveAmount)}</span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="numeric-cell text-right font-mono text-[11px] font-semibold">{fmtINR(item.totalValue - item.reserveAmount)}</TableCell>
                    <TableCell>
                      <div className="text-[10px] font-semibold">{item.warehouse}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{item.binLocation}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[10px]">{item.supplier}</div>
                      <div className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                        {item.supplierRating.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px]", item.daysInStock > 90 ? "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900" : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400")}>
                        {item.daysInStock}d
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Eye className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={14} className="text-center py-12 text-zinc-500 text-xs">
                    No inventory items match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Drawer */}
      {selectedItem && (
        <InventoryValuationDetailDrawer
          item={selectedItem}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      )}
    </div>
  )
}


