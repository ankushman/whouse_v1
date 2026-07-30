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
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  FileText,
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
  Truck,
  Receipt,
  PenLine,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Gauge,
  Layers,
  Factory,
  FileCheck,
  FileClock,
  FilePlus,
  Building2,
  Hash,
  Percent,
  CircleDollarSign,
  Wallet,
  ClipboardList,
  ThumbsUp,
  ShieldAlert,
  Boxes,
  Wrench,
  ShieldCheck,
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

type POStatus =
  | "draft"
  | "pending-approval"
  | "approved"
  | "sent-to-vendor"
  | "acknowledged"
  | "in-transit"
  | "received-partial"
  | "received-full"
  | "invoiced"
  | "paid"
  | "closed"
  | "cancelled"
  | "on-hold"

type POCategory =
  | "raw-material"
  | "packaging"
  | "consumables"
  | "spares"
  | "capex"
  | "services"

type POReleaseType = "scheduled" | "spot" | "blanket-call" | "urgent"

type POApprovalStage = "initiated" | "manager-review" | "finance-review" | "procurement-head" | "completed"

type GRNStatus = "pending" | "partial" | "completed" | "qa-hold" | "rejected"

type InvoiceStatus = "pending" | "matched" | "disputed" | "paid" | "short-paid"

interface POItem {
  sr: number
  partNo: string
  description: string
  uom: string
  qty: number
  receivedQty: number
  unitPrice: number
  taxRate: number
  discountPct: number
  total: number
}

interface GRNEntry {
  id: string
  date: string
  warehouse: string
  receivedBy: string
  qtyReceived: number
  qtyAccepted: number
  qtyRejected: number
  status: GRNStatus
  invoiceNo: string
  notes: string
}

interface InvoiceEntry {
  id: string
  invoiceNo: string
  invoiceDate: string
  receivedDate: string
  amount: number
  taxAmount: number
  total: number
  status: InvoiceStatus
  matchedBy: string
  paymentRef: string
  paymentDate: string
}

interface ApprovalStep {
  stage: POApprovalStage
  approver: string
  role: string
  status: "pending" | "approved" | "rejected" | "skipped"
  timestamp: string
  remarks: string
}

interface PurchaseOrder {
  id: string
  vendorName: string
  vendorCode: string
  vendorCategory: POCategory
  releaseType: POReleaseType
  status: POStatus
  priority: "low" | "medium" | "high" | "critical"
  poDate: string
  expectedDelivery: string
  actualDelivery: string | null
  warehouse: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  approver: string
  totalValue: number
  taxAmount: number
  totalPayable: number
  paidAmount: number
  outstanding: number
  currency: "INR"
  paymentTerms: string
  deliveryTerms: string
  items: POItem[]
  grnEntries: GRNEntry[]
  invoices: InvoiceEntry[]
  approvals: ApprovalStep[]
  notes: string
  costSavingPct: number
  leadTimeDays: number
  contractedLeadTimeDays: number
}

// ============================================================================
// Mock Data — 18 Purchase Orders covering all 13 statuses
// ============================================================================

const VENDORS = [
  { name: "Tata Steel Long Products Ltd", code: "VND-0001", category: "raw-material" as POCategory, buyer: "Rajesh Kumar" },
  { name: "Bosch Auto Components India", code: "VND-0007", category: "raw-material" as POCategory, buyer: "Priya Sharma" },
  { name: "Saint-Gobain India Glass", code: "VND-0012", category: "raw-material" as POCategory, buyer: "Amit Patel" },
  { name: "Ball Corporation Packaging", code: "VND-0018", category: "packaging" as POCategory, buyer: "Sneha Reddy" },
  { name: "EPL Limited (EPL Ltd)", code: "VND-0023", category: "packaging" as POCategory, buyer: "Sneha Reddy" },
  { name: "3M India Consumables", code: "VND-0031", category: "consumables" as POCategory, buyer: "Vikram Singh" },
  { name: "SKF Bearings India", code: "VND-0038", category: "spares" as POCategory, buyer: "Karthik Iyer" },
  { name: "Siemens Equipment Spares", code: "VND-0044", category: "spares" as POCategory, buyer: "Karthik Iyer" },
  { name: "Honeywell Automation India", code: "VND-0052", category: "capex" as POCategory, buyer: "Deepak Mehta" },
  { name: "Blue Star Climate Systems", code: "VND-0061", category: "capex" as POCategory, buyer: "Deepak Mehta" },
  { name: "Gati-KWE Logistics Services", code: "VND-0070", category: "services" as POCategory, buyer: "Rohit Gupta" },
  { name: "Sodexo Facility Services", code: "VND-0083", category: "services" as POCategory, buyer: "Rohit Gupta" },
]

const WAREHOUSES = ["Chennai Hub", "Mumbai DC", "Delhi North", "Kolkata East", "Bangalore South", "Pune West"]
const PARTS = [
  { no: "RM-CR-1001", desc: "Cold Rolled Steel Coil 2.0mm", uom: "MT" },
  { no: "RM-AL-2003", desc: "Aluminium Sheet 1.5mm", uom: "MT" },
  { no: "RM-SS-3005", desc: "Stainless Steel Bar 12mm", uom: "MT" },
  { no: "PKG-CT-4001", desc: "Corrugated Carton 600x400x300", uom: "NOS" },
  { no: "PKG-STR-4015", desc: "PET Strapping Roll 12mm", uom: "ROL" },
  { no: "PKG-LBL-4022", desc: "Thermal Label 100x150mm", uom: "PCS" },
  { no: "CON-GL-5002", desc: "Industrial Gloves Cut-Resistant", uom: "PR" },
  { no: "CON-OIL-5011", desc: "Hydraulic Oil ISO VG 46", uom: "LTR" },
  { no: "SPR-BRG-6001", desc: "Deep Groove Ball Bearing 6205", uom: "NOS" },
  { no: "SPR-BLT-6012", desc: "Hex Bolt M12x60 Grade 8.8", uom: "NOS" },
  { no: "SPR-MTR-6025", desc: "AC Motor 5.5kW 3-Phase", uom: "NOS" },
  { no: "CPX-CHL-7001", desc: "Chiller Unit 50TR Scroll", uom: "NOS" },
  { no: "CPX-RCK-7015", desc: "Pallet Racking Bay 2.7m", uom: "SET" },
  { no: "SVC-LOG-8001", desc: "Intra-city Logistics Contract", uom: "JOB" },
  { no: "SVC-FAC-8005", desc: "Annual Facility Maintenance", uom: "JOB" },
]

// Deterministic hash helper for stable mock data
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return h
}

function genItems(seed: string, count: number): POItem[] {
  const items: POItem[] = []
  for (let i = 0; i < count; i++) {
    const h = hash(`${seed}-item-${i}`)
    const partIdx = h % PARTS.length
    const part = PARTS[partIdx]
    const qty = 5 + (h % 95)
    const receivedQty = Math.floor(qty * ((h % 100) / 100))
    const unitPrice = part.uom === "MT" ? 55000 + (h % 30000) : part.uom === "NOS" ? 50 + (h % 1500) : 200 + (h % 5000)
    const taxRate = 12 + (h % 6) * 3 // 12, 15, 18, 21, 24, 27%
    const discountPct = (h % 5) * 2 // 0, 2, 4, 6, 8%
    const gross = qty * unitPrice
    const afterDiscount = gross * (1 - discountPct / 100)
    const total = afterDiscount * (1 + taxRate / 100)
    items.push({
      sr: i + 1,
      partNo: part.no,
      description: part.desc,
      uom: part.uom,
      qty,
      receivedQty,
      unitPrice,
      taxRate,
      discountPct,
      total: Math.round(total),
    })
  }
  return items
}

function genGRN(seed: string, count: number, poDate: string, expected: string): GRNEntry[] {
  const entries: GRNEntry[] = []
  const statuses: GRNStatus[] = ["completed", "completed", "partial", "completed", "qa-hold", "completed", "rejected"]
  for (let i = 0; i < count; i++) {
    const h = hash(`${seed}-grn-${i}`)
    const day = new Date(poDate)
    day.setDate(day.getDate() + 3 + (h % 12))
    const qty = 5 + (h % 90)
    const rejected = h % 7 === 0 ? Math.floor(qty * 0.05) : 0
    entries.push({
      id: `GRN-${seed.slice(-5)}-${(i + 1).toString().padStart(2, "0")}`,
      date: day.toISOString().slice(0, 10),
      warehouse: WAREHOUSES[h % WAREHOUSES.length],
      receivedBy: ["Suresh Kumar", "Mahesh Yadav", "Anil Joshi", "Ramesh Babu"][h % 4],
      qtyReceived: qty,
      qtyAccepted: qty - rejected,
      qtyRejected: rejected,
      status: statuses[h % statuses.length],
      invoiceNo: `INV-${1000 + (h % 9000)}`,
      notes: rejected > 0 ? "Quality inspection pending — minor surface defects" : "Received in good condition",
    })
  }
  return entries
}

function genInvoices(seed: string, count: number, totalPayable: number, poStatus: POStatus): InvoiceEntry[] {
  const invoices: InvoiceEntry[] = []
  // Status priority driven by PO status: paid/closed → all paid; invoiced → mixed matched/pending/disputed
  const statusesByPO: Record<string, InvoiceStatus[]> = {
    paid: ["paid", "paid", "paid", "paid"],
    closed: ["paid", "paid", "paid", "paid"],
    invoiced: ["matched", "matched", "pending", "disputed", "short-paid"],
  }
  const statuses = statusesByPO[poStatus] || ["matched", "matched", "pending"]
  const splitters = [1, 1, 2, 1, 1, 1, 1]
  for (let i = 0; i < count; i++) {
    const h = hash(`${seed}-inv-${i}`)
    const day = new Date()
    day.setDate(day.getDate() - (h % 30))
    const amount = Math.round(totalPayable / splitters[i % splitters.length])
    const taxAmount = Math.round(amount * 0.18)
    const status = statuses[h % statuses.length]
    invoices.push({
      id: `INV-ROW-${seed.slice(-5)}-${i + 1}`,
      invoiceNo: `INV/${day.getFullYear()}/${100 + (h % 900)}`,
      invoiceDate: day.toISOString().slice(0, 10),
      receivedDate: new Date(day.getTime() + 86400000 * 2).toISOString().slice(0, 10),
      amount,
      taxAmount,
      total: amount + taxAmount,
      status,
      matchedBy: status === "matched" || status === "paid" ? "Auto 3-way match" : "Manual review",
      paymentRef: status === "paid" ? `PMT/${day.getFullYear()}/${2000 + (h % 8000)}` : "",
      paymentDate: status === "paid" ? new Date(day.getTime() + 86400000 * 10).toISOString().slice(0, 10) : "",
    })
  }
  return invoices
}

function genApprovals(seed: string, currentStatus: POStatus): ApprovalStep[] {
  const stages: POApprovalStage[] = ["initiated", "manager-review", "finance-review", "procurement-head", "completed"]
  const approvers = [
    { name: "Rajesh Kumar", role: "Procurement Officer" },
    { name: "Anita Desai", role: "Procurement Manager" },
    { name: "Sunil Bansal", role: "Finance Controller" },
    { name: "Meera Krishnan", role: "Head of Procurement" },
    { name: "—", role: "System" },
  ]
  // Determine cutoff based on status
  const cutoffIdx =
    currentStatus === "draft" ? 0
    : currentStatus === "pending-approval" ? 1
    : ["approved", "sent-to-vendor", "acknowledged", "on-hold"].includes(currentStatus) ? 3
    : 4 // post-receipt stages

  return stages.map((stage, idx) => {
    const h = hash(`${seed}-appr-${stage}`)
    const approver = approvers[idx]
    let status: ApprovalStep["status"]
    if (idx < cutoffIdx) status = "approved"
    else if (idx === cutoffIdx && currentStatus === "on-hold") status = "rejected"
    else if (idx === cutoffIdx) status = "pending"
    else status = "skipped"

    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - (4 - idx) * 2 - (h % 3))
    return {
      stage,
      approver: approver.name,
      role: approver.role,
      status,
      timestamp: status === "pending" || status === "skipped" ? "" : timestamp.toISOString().slice(0, 16).replace("T", " "),
      remarks: status === "approved"
        ? "Reviewed and approved within budget."
        : status === "rejected"
        ? "On hold pending vendor clarification."
        : status === "pending"
        ? "Awaiting review."
        : "Skipped — not required for this PO.",
    }
  })
}

// Build 18 mock POs
const STATUSES_BY_INDEX: POStatus[] = [
  "draft", "pending-approval", "approved", "sent-to-vendor", "acknowledged",
  "in-transit", "received-partial", "received-full", "invoiced", "paid",
  "closed", "cancelled", "on-hold",
  "received-full", "invoiced", "in-transit", "approved", "paid",
]

const PURCHASE_ORDERS: PurchaseOrder[] = Array.from({ length: 18 }, (_, i) => {
  const vendor = VENDORS[i % VENDORS.length]
  const status = STATUSES_BY_INDEX[i]
  const poId = `PO-2026-${(1001 + i).toString()}`
  const seed = poId.replace(/-/g, "")
  const h = hash(seed)
  const poDate = new Date(2026, 5, 1 + (i * 4 % 80))
  const expectedDelivery = new Date(poDate.getTime() + 86400000 * (7 + (h % 14)))
  const actualDelivery =
    ["received-partial", "received-full", "invoiced", "paid", "closed"].includes(status)
      ? new Date(expectedDelivery.getTime() + 86400000 * ((h % 5) - 2)).toISOString().slice(0, 10)
      : null
  const leadTimeDays = actualDelivery
    ? Math.ceil((new Date(actualDelivery).getTime() - poDate.getTime()) / 86400000)
    : Math.ceil((expectedDelivery.getTime() - poDate.getTime()) / 86400000)
  const items = genItems(seed, 2 + (h % 4))
  const totalValue = items.reduce((sum, it) => sum + it.total / (1 + it.taxRate / 100), 0)
  const taxAmount = items.reduce((sum, it) => sum + it.total - it.total / (1 + it.taxRate / 100), 0)
  const totalPayable = totalValue + taxAmount
  const paidAmount = ["paid", "closed"].includes(status) ? totalPayable : status === "invoiced" ? 0 : 0
  const outstanding = totalPayable - paidAmount
  const releaseType: POReleaseType = (["scheduled", "spot", "blanket-call", "urgent"][h % 4]) as POReleaseType
  const priority = (["low", "medium", "high", "critical"][h % 4]) as PurchaseOrder["priority"]
  const grnEntries =
    ["received-partial", "received-full", "invoiced", "paid", "closed"].includes(status)
      ? genGRN(seed, 1 + (h % 3), poDate.toISOString().slice(0, 10), expectedDelivery.toISOString().slice(0, 10))
      : []
  const invoices =
    ["invoiced", "paid", "closed"].includes(status)
      ? genInvoices(seed, 1 + (h % 2), totalPayable, status)
      : []
  return {
    id: poId,
    vendorName: vendor.name,
    vendorCode: vendor.code,
    vendorCategory: vendor.category,
    releaseType,
    status,
    priority,
    poDate: poDate.toISOString().slice(0, 10),
    expectedDelivery: expectedDelivery.toISOString().slice(0, 10),
    actualDelivery,
    warehouse: WAREHOUSES[h % WAREHOUSES.length],
    buyerName: vendor.buyer,
    buyerEmail: `${vendor.buyer.toLowerCase().replace(/\s+/g, ".")}@autoflow.in`,
    buyerPhone: `+91 ${90000 + (h % 99999)}`,
    approver: "Anita Desai",
    totalValue: Math.round(totalValue),
    taxAmount: Math.round(taxAmount),
    totalPayable: Math.round(totalPayable),
    paidAmount: Math.round(paidAmount),
    outstanding: Math.round(outstanding),
    currency: "INR",
    paymentTerms: ["Net 30", "Net 45", "Net 60", "Advance 30%", "Net 15"][h % 5],
    deliveryTerms: ["FOR Destination", "Ex-Works", "DAP", "FCA Origin"][h % 4],
    items,
    grnEntries,
    invoices,
    approvals: genApprovals(seed, status),
    notes: releaseType === "urgent" ? "Urgent release — production line down. Verbal approval obtained from Head of Procurement." : "Standard scheduled release.",
    costSavingPct: 2 + (h % 8),
    leadTimeDays,
    contractedLeadTimeDays: 10 + (h % 10),
  }
})

// ============================================================================
// Constants & Theming
// ============================================================================

const PO_STATUS_META: Record<POStatus, { label: string; color: string; bg: string; border: string; icon: typeof FileText }> = {
  draft: { label: "Draft", color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800/50", border: "border-slate-300 dark:border-slate-700", icon: FileText },
  "pending-approval": { label: "Pending Approval", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", icon: FileClock },
  approved: { label: "Approved", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", icon: CheckCircle2 },
  "sent-to-vendor": { label: "Sent to Vendor", color: "text-indigo-700 dark:text-indigo-300", bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800", icon: Truck },
  acknowledged: { label: "Acknowledged", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-cyan-200 dark:border-cyan-800", icon: ThumbsUp },
  "in-transit": { label: "In Transit", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800", icon: Truck },
  "received-partial": { label: "Partial Receipt", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", icon: Package },
  "received-full": { label: "Fully Received", color: "text-teal-700 dark:text-teal-300", bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-teal-200 dark:border-teal-800", icon: Package },
  invoiced: { label: "Invoiced", color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", icon: Receipt },
  paid: { label: "Paid", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", icon: Banknote },
  closed: { label: "Closed", color: "text-green-700 dark:text-green-300", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800", icon: FileCheck },
  cancelled: { label: "Cancelled", color: "text-red-700 dark:text-red-300", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", icon: XCircle },
  "on-hold": { label: "On Hold", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-50 dark:bg-rose-950/30", border: "border-rose-200 dark:border-rose-800", icon: ShieldAlert },
}

const CATEGORY_META: Record<POCategory, { label: string; color: string; bg: string; pieColor: string; icon: typeof Factory }> = {
  "raw-material": { label: "Raw Material", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/40", pieColor: "#f59e0b", icon: Layers },
  packaging: { label: "Packaging", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-900/40", pieColor: "#fb923c", icon: Package },
  consumables: { label: "Consumables", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/40", pieColor: "#3b82f6", icon: Boxes },
  spares: { label: "Spares", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/40", pieColor: "#8b5cf6", icon: Wrench },
  capex: { label: "CapEx", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-900/40", pieColor: "#10b981", icon: Building2 },
  services: { label: "Services", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-100 dark:bg-cyan-900/40", pieColor: "#06b6d4", icon: ClipboardList },
}

const RELEASE_TYPE_META: Record<POReleaseType, { label: string; color: string; bg: string }> = {
  scheduled: { label: "Scheduled", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/40" },
  spot: { label: "Spot Buy", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/40" },
  "blanket-call": { label: "Blanket Call", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/40" },
  urgent: { label: "Urgent", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/40" },
}

const PRIORITY_META: Record<PurchaseOrder["priority"], { label: string; color: string }> = {
  low: { label: "Low", color: "text-slate-600 dark:text-slate-400" },
  medium: { label: "Medium", color: "text-blue-600 dark:text-blue-400" },
  high: { label: "High", color: "text-amber-600 dark:text-amber-400" },
  critical: { label: "Critical", color: "text-red-600 dark:text-red-400" },
}

const GRN_STATUS_META: Record<GRNStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800/50" },
  partial: { label: "Partial", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-900/40" },
  completed: { label: "Completed", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  "qa-hold": { label: "QA Hold", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/40" },
  rejected: { label: "Rejected", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/40" },
}

const INVOICE_STATUS_META: Record<InvoiceStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800/50" },
  matched: { label: "3-Way Matched", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  disputed: { label: "Disputed", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/40" },
  paid: { label: "Paid", color: "text-green-700 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/40" },
  "short-paid": { label: "Short Paid", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/40" },
}

// Status tabs for the master table
const STATUS_TABS: { value: POStatus | "all"; label: string; filter: (po: PurchaseOrder) => boolean }[] = [
  { value: "all", label: "All", filter: () => true },
  { value: "draft", label: "Draft", filter: (po) => po.status === "draft" },
  { value: "pending-approval", label: "Pending Approval", filter: (po) => po.status === "pending-approval" },
  { value: "approved", label: "Approved", filter: (po) => po.status === "approved" || po.status === "sent-to-vendor" || po.status === "acknowledged" },
  { value: "in-transit", label: "In Transit", filter: (po) => po.status === "in-transit" },
  { value: "received-partial", label: "Partial Receipt", filter: (po) => po.status === "received-partial" },
  { value: "received-full", label: "Fully Received", filter: (po) => po.status === "received-full" },
  { value: "invoiced", label: "Invoiced", filter: (po) => po.status === "invoiced" },
  { value: "paid", label: "Paid", filter: (po) => po.status === "paid" },
  { value: "closed", label: "Closed", filter: (po) => po.status === "closed" },
  { value: "on-hold", label: "On Hold", filter: (po) => po.status === "on-hold" },
  { value: "cancelled", label: "Cancelled", filter: (po) => po.status === "cancelled" },
]

// Chart configs
const spendTrendConfig = {
  spend: { label: "Spend (₹ Lakh)", color: "#2563eb" },
  target: { label: "Target", color: "#94a3b8" },
} satisfies ChartConfig

const categoryConfig = {
  value: { label: "Spend (₹ Lakh)" },
} satisfies ChartConfig

const leadTimeConfig = {
  actual: { label: "Actual Lead Time", color: "#7c3aed" },
  contracted: { label: "Contracted Lead Time", color: "#94a3b8" },
} satisfies ChartConfig

const approvalConfig = {
  value: { label: "Avg Approval Hours" },
} satisfies ChartConfig

// 30-day spend trend mock
const SPEND_TREND = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const base = 25 + Math.sin(i / 4) * 5
  const noise = (hash(`spend-${i}`) % 8) - 4
  return {
    day: `D${day}`,
    spend: Math.round((base + noise) * 10) / 10,
    target: 28,
  }
})

// ============================================================================
// Helper Functions
// ============================================================================

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

function daysFromNow(dateStr: string): number {
  if (!dateStr) return 0
  const target = new Date(dateStr)
  const now = new Date()
  return Math.ceil((target.getTime() - now.getTime()) / 86400000)
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
  icon: typeof ShoppingCart
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
        "po-kpi-enter relative overflow-hidden ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        c.ring
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", c.gradient, "to-transparent")} />
      <div className={cn("absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl", c.bg)} />
      <CardContent className="glass-subtle p-4">
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

export function ProcurementPurchaseOrdersView() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<POStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<POCategory | "all">("all")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filtered POs
  const filteredPOs = useMemo(() => {
    return PURCHASE_ORDERS.filter((po) => {
      const tab = STATUS_TABS.find((t) => t.value === activeTab)
      if (!tab?.filter(po)) return false
      if (categoryFilter !== "all" && po.vendorCategory !== categoryFilter) return false
      if (warehouseFilter !== "all" && po.warehouse !== warehouseFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          po.id.toLowerCase().includes(q) ||
          po.vendorName.toLowerCase().includes(q) ||
          po.vendorCode.toLowerCase().includes(q) ||
          po.buyerName.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activeTab, searchQuery, categoryFilter, warehouseFilter])

  // KPIs
  const kpis = useMemo(() => {
    const total = PURCHASE_ORDERS.length
    const totalSpend = PURCHASE_ORDERS.reduce((s, po) => s + po.totalPayable, 0)
    const pendingApproval = PURCHASE_ORDERS.filter((p) => p.status === "pending-approval").length
    const inTransit = PURCHASE_ORDERS.filter((p) => p.status === "in-transit").length
    const openGRN = PURCHASE_ORDERS.filter((p) => p.status === "received-partial").length
    const outstanding = PURCHASE_ORDERS.reduce((s, po) => s + po.outstanding, 0)
    const paidThisMonth = PURCHASE_ORDERS.reduce((s, po) => s + po.paidAmount, 0)
    const onHold = PURCHASE_ORDERS.filter((p) => p.status === "on-hold").length
    const avgApproval = 18.5 // mock hours
    const costSavings = 6.4 // mock pct
    return {
      total,
      totalSpend,
      pendingApproval,
      inTransit,
      openGRN,
      outstanding,
      paidThisMonth,
      onHold,
      avgApproval,
      costSavings,
    }
  }, [])

  // Charts data
  const spendByCategory = useMemo(() => {
    const groups: Record<POCategory, number> = {
      "raw-material": 0,
      packaging: 0,
      consumables: 0,
      spares: 0,
      capex: 0,
      services: 0,
    }
    PURCHASE_ORDERS.forEach((po) => {
      groups[po.vendorCategory] += po.totalPayable / 100000 // to Lakh
    })
    return Object.entries(groups).map(([k, v]) => ({
      name: CATEGORY_META[k as POCategory].label,
      value: Math.round(v * 10) / 10,
      color: CATEGORY_META[k as POCategory].pieColor,
    }))
  }, [])

  const leadTimeByCategory = useMemo(() => {
    const groups: Record<string, { actual: number[]; contracted: number[] }> = {}
    PURCHASE_ORDERS.forEach((po) => {
      const cat = CATEGORY_META[po.vendorCategory].label
      if (!groups[cat]) groups[cat] = { actual: [], contracted: [] }
      groups[cat].actual.push(po.leadTimeDays)
      groups[cat].contracted.push(po.contractedLeadTimeDays)
    })
    return Object.entries(groups).map(([k, v]) => ({
      name: k,
      actual: Math.round((v.actual.reduce((s, x) => s + x, 0) / v.actual.length) * 10) / 10,
      contracted: Math.round((v.contracted.reduce((s, x) => s + x, 0) / v.contracted.length) * 10) / 10,
    }))
  }, [])

  const approvalFunnel = useMemo(() => {
    const stages: { name: string; value: number; color: string }[] = [
      { name: "Initiated", value: 18, color: "#3b82f6" },
      { name: "Manager", value: 16, color: "#06b6d4" },
      { name: "Finance", value: 13, color: "#8b5cf6" },
      { name: "Head", value: 11, color: "#f59e0b" },
      { name: "Closed", value: 10, color: "#10b981" },
    ]
    return stages
  }, [])

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    STATUS_TABS.forEach((t) => {
      counts[t.value] = PURCHASE_ORDERS.filter(t.filter).length
    })
    return counts
  }, [])

  function openDetail(po: PurchaseOrder) {
    setSelectedPO(po)
    setDrawerOpen(true)
  }

  function handleExport() {
    const rows = filteredPOs.map((po) => ({
      "PO Number": po.id,
      "Vendor": po.vendorName,
      "Vendor Code": po.vendorCode,
      "Category": CATEGORY_META[po.vendorCategory].label,
      "Release Type": RELEASE_TYPE_META[po.releaseType].label,
      "Status": PO_STATUS_META[po.status].label,
      "Priority": PRIORITY_META[po.priority].label,
      "PO Date": po.poDate,
      "Expected Delivery": po.expectedDelivery,
      "Actual Delivery": po.actualDelivery || "",
      "Warehouse": po.warehouse,
      "Buyer": po.buyerName,
      "Approver": po.approver,
      "Total Value (INR)": po.totalValue,
      "Tax Amount (INR)": po.taxAmount,
      "Total Payable (INR)": po.totalPayable,
      "Paid Amount (INR)": po.paidAmount,
      "Outstanding (INR)": po.outstanding,
      "Payment Terms": po.paymentTerms,
      "Delivery Terms": po.deliveryTerms,
      "Lead Time (Days)": po.leadTimeDays,
      "Contracted Lead Time": po.contractedLeadTimeDays,
      "Cost Saving %": po.costSavingPct,
      "Items Count": po.items.length,
      "GRN Count": po.grnEntries.length,
      "Invoice Count": po.invoices.length,
      "Notes": po.notes,
    }))
    exportToCSV(rows, `purchase-orders-${new Date().toISOString().slice(0, 10)}`)
    toast.success(
      "Export complete",
      `Exported ${rows.length} purchase orders to CSV`
    )
  }

  function handleRefresh() {
    toast.info(
      "Refreshing purchase orders",
      "Fetching latest PO data from ERP…"
    )
  }

  function handleNewPO() {
    toast.success(
      "New PO drafted",
      "PO-2026-1019 created in Draft state. Add line items to proceed."
    )
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="space-y-4 p-4 md:p-6">
      <PageHeader
        title="Procurement & Purchase Orders"
        description="End-to-end PO lifecycle: draft → approval → vendor ack → GRN → invoice → payment"
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KPIBox
          index={0}
          title="Total POs"
          value={kpis.total.toString()}
          subValue="across 18 vendors"
          trend={8.2}
          trendLabel="vs last month"
          icon={FileText}
          color="blue"
        />
        <KPIBox
          index={1}
          title="Total Spend"
          value={formatINR(kpis.totalSpend, true)}
          subValue="YTD procurement"
          trend={12.5}
          trendLabel="vs last month"
          icon={CircleDollarSign}
          color="violet"
        />
        <KPIBox
          index={2}
          title="Pending Approval"
          value={kpis.pendingApproval.toString()}
          subValue={`Avg ${kpis.avgApproval}h to approve`}
          trend={-15.3}
          trendLabel="faster cycle"
          icon={FileClock}
          color="amber"
        />
        <KPIBox
          index={3}
          title="In Transit"
          value={kpis.inTransit.toString()}
          subValue="awaiting receipt"
          trend={4.1}
          trendLabel="vs last week"
          icon={Truck}
          color="cyan"
        />
        <KPIBox
          index={4}
          title="Outstanding Payable"
          value={formatINR(kpis.outstanding, true)}
          subValue="net of paid"
          trend={-3.8}
          trendLabel="improving"
          icon={Wallet}
          color="rose"
        />
        <KPIBox
          index={5}
          title="Cost Savings"
          value={`${kpis.costSavings}%`}
          subValue={`₹${((kpis.totalSpend * kpis.costSavings) / 100 / 100000).toFixed(1)} L saved`}
          trend={1.2}
          trendLabel="vs target"
          icon={Sparkles}
          color="emerald"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* 30-day spend trend */}
        <Card className="po-chart-enter">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">30-Day Spend Trend</CardTitle>
                <CardDescription className="text-xs">
                  Daily procurement spend (₹ Lakh) vs target
                </CardDescription>
              </div>
              <Badge variant="outline" className="badge-interactive gap-1 text-[11px]">
                <Activity className="h-3 w-3" /> Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="glass-subtle pt-0">
            <ChartContainer config={spendTrendConfig} className="h-[220px] w-full">
              <AreaChart data={SPEND_TREND} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
                <defs>
                  <linearGradient id="poSpendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={3} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#poSpendGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#2563eb" }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Spend by Category donut */}
        <Card className="po-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Spend by Category</CardTitle>
            <CardDescription className="text-xs">YTD procurement breakdown</CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <ChartContainer config={categoryConfig} className="h-[200px] w-full sm:w-1/2">
                <PieChart>
                  <Pie
                    data={spendByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {spendByCategory.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="grid w-full grid-cols-2 gap-1.5 sm:w-1/2">
                {spendByCategory.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="truncate text-muted-foreground">{entry.name}</span>
                    <span className="ml-auto font-semibold">₹{entry.value}L</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead time actual vs contracted */}
        <Card className="po-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lead Time Compliance</CardTitle>
            <CardDescription className="text-xs">Actual vs contracted lead time (days) by category</CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0">
            <ChartContainer config={leadTimeConfig} className="h-[200px] w-full">
              <BarChart data={leadTimeByCategory} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="contracted" fill="#94a3b8" radius={[3, 3, 0, 0]} maxBarSize={26} />
                <Bar dataKey="actual" fill="#7c3aed" radius={[3, 3, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Approval funnel */}
        <Card className="po-chart-enter">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Approval Funnel</CardTitle>
            <CardDescription className="text-xs">PO count by approval stage</CardDescription>
          </CardHeader>
          <CardContent className="glass-subtle pt-0">
            <ChartContainer config={approvalConfig} className="h-[200px] w-full">
              <BarChart
                data={approvalFunnel}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 32, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={26}>
                  {approvalFunnel.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Master Table Card */}
      <Card className="po-table-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base">Purchase Orders</CardTitle>
              <CardDescription className="text-xs">
                {filteredPOs.length} of {kpis.total} POs · showing {activeTab === "all" ? "all statuses" : PO_STATUS_META[activeTab as POStatus]?.label}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search PO / vendor / buyer…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-[220px] pl-8 text-sm po-search-focus"
                />
              </div>
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as POCategory | "all")}>
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
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="h-9 w-[140px] text-sm">
                  <SelectValue placeholder="Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {WAREHOUSES.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="btn-outline-animate h-9" onClick={handleRefresh}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="btn-outline-animate h-9" onClick={handleExport}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Export
              </Button>
              <Button size="sm" className="h-9" onClick={handleNewPO}>
                <FilePlus className="mr-1.5 h-3.5 w-3.5" /> New PO
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
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-all po-tab-btn",
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

        <CardContent className="glass-subtle pt-0">
          <div className="overflow-x-auto">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="h-9 text-[11px] uppercase">PO Number</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Vendor</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Status</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Release</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">PO Date</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Expected</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase text-right">Total (₹)</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase text-right">Outstanding</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Warehouse</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase">Buyer</TableHead>
                  <TableHead className="h-9 text-[11px] uppercase text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="py-8 text-center text-muted-foreground">
                      No purchase orders match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPOs.map((po, idx) => {
                    const statusMeta = PO_STATUS_META[po.status]
                    const relMeta = RELEASE_TYPE_META[po.releaseType]
                    const catMeta = CATEGORY_META[po.vendorCategory]
                    const daysUntil = daysFromNow(po.expectedDelivery)
                    const isOverdue = !po.actualDelivery && daysUntil < 0 && !["closed", "cancelled", "paid"].includes(po.status)
                    const isCritical = po.priority === "critical"
                    const isOnHold = po.status === "on-hold"
                    return (
                      <TableRow
                        key={po.id}
                        onClick={() => openDetail(po)}
                        className={cn(
                          "po-row-in cursor-pointer border-b transition-colors",
                          isOnHold
                            ? "po-row-critical"
                            : isCritical
                            ? "po-row-warning"
                            : "hover:bg-muted/30"
                        )}
                        style={{ animationDelay: `${Math.min(idx, 8) * 30}ms` }}
                      >
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-semibold">{po.id}</span>
                            {po.priority === "critical" && (
                              <span className="rounded bg-red-100 px-1 py-0.5 text-[9px] font-bold uppercase text-red-700 dark:bg-red-950/40 dark:text-red-300">
                                CRIT
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                            <catMeta.icon className="h-2.5 w-2.5" />
                            {catMeta.label}
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className={cn("text-[10px] font-semibold", catMeta.bg, catMeta.color)}>
                                {po.vendorName.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="truncate text-xs font-medium">{po.vendorName}</div>
                              <div className="font-mono text-[10px] text-muted-foreground">{po.vendorCode}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
                              statusMeta.bg,
                              statusMeta.color,
                              statusMeta.border
                            )}
                          >
                            <statusMeta.icon className="h-3 w-3" />
                            {statusMeta.label}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", relMeta.bg, relMeta.color)}>
                            {relMeta.label}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5 text-[11px] text-muted-foreground">{po.poDate}</TableCell>
                        <TableCell className="py-2.5">
                          <div className="text-[11px]">{po.expectedDelivery}</div>
                          {isOverdue && (
                            <div className="text-[10px] font-semibold text-red-600 dark:text-red-400">
                              {Math.abs(daysUntil)}d overdue
                            </div>
                          )}
                          {po.actualDelivery && (
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                              received
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-xs font-semibold">
                          {formatINR(po.totalPayable, true)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          {po.outstanding > 0 ? (
                            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                              {formatINR(po.outstanding, true)}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-2.5 text-[11px]">{po.warehouse}</TableCell>
                        <TableCell className="py-2.5 text-[11px]">{po.buyerName}</TableCell>
                        <TableCell className="py-2.5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDetail(po)
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
      <ProcurementDetailDrawer
        po={selectedPO}
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
  po: PurchaseOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DrawerTab = "overview" | "items" | "grn" | "invoices" | "approval"

function ProcurementDetailDrawer({ po, open, onOpenChange }: DetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview")
  const toast = useToast()

  React.useEffect(() => {
    if (open) setActiveTab("overview")
  }, [open, po])

  if (!po) return null

  const statusMeta = PO_STATUS_META[po.status]
  const catMeta = CATEGORY_META[po.vendorCategory]
  const relMeta = RELEASE_TYPE_META[po.releaseType]
  const prMeta = PRIORITY_META[po.priority]
  const totalAccepted = po.grnEntries.reduce((s, g) => s + g.qtyAccepted, 0)
  const totalReceived = po.grnEntries.reduce((s, g) => s + g.qtyReceived, 0)
  const totalRejected = po.grnEntries.reduce((s, g) => s + g.qtyRejected, 0)
  const receiptProgress = po.items.reduce((s, it) => s + it.qty, 0) > 0
    ? Math.min(100, Math.round((totalAccepted / po.items.reduce((s, it) => s + it.qty, 0)) * 100))
    : 0
  const paymentProgress = po.totalPayable > 0 ? Math.round((po.paidAmount / po.totalPayable) * 100) : 0
  const leadTimeVariance = po.leadTimeDays - po.contractedLeadTimeDays

  function handleExport() {
    toast.success(
      "PO exported",
      `PO ${po!.id} details exported as PDF`
    )
  }

  function handleApprove() {
    toast.success(
      "PO approved",
      `PO ${po!.id} moved to Approved state`
    )
  }

  function handleReject() {
    toast.error(
      "PO rejected",
      `PO ${po!.id} sent back to buyer for revision`
    )
  }

  function handleAck() {
    toast.info(
      "Acknowledged",
      `Marked PO ${po!.id} as acknowledged`
    )
  }

  const tabs: { id: DrawerTab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "items", label: "Items", count: po.items.length },
    { id: "grn", label: "GRN", count: po.grnEntries.length },
    { id: "invoices", label: "Invoices", count: po.invoices.length },
    { id: "approval", label: "Approval" },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="po-drawer-sheen w-full overflow-y-auto p-0 sm:max-w-3xl">
        <SheetHeader className="po-drawer-header border-b bg-gradient-to-r from-muted/60 to-transparent px-6 pb-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg font-bold">
                  {po.vendorName}
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
                <span className="font-mono">{po.id}</span>
                <span className="text-muted-foreground">·</span>
                <span className="font-mono text-muted-foreground">{po.vendorCode}</span>
                <span className="text-muted-foreground">·</span>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", catMeta.bg, catMeta.color)}>
                  {catMeta.label}
                </span>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", relMeta.bg, relMeta.color)}>
                  {relMeta.label}
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
                      s <= Math.ceil(po.costSavingPct / 2) ? "bg-amber-400" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">Cost saving {po.costSavingPct}%</span>
            </div>
          </div>

          {/* Hero stats */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              { label: "Total Payable", value: formatINR(po.totalPayable, true), icon: CircleDollarSign },
              { label: "Outstanding", value: formatINR(po.outstanding, true), icon: Wallet },
              { label: "Lead Time", value: `${po.leadTimeDays}d`, icon: Clock, sub: `${leadTimeVariance >= 0 ? "+" : ""}${leadTimeVariance}d vs SLA` },
              { label: "Items", value: po.items.length.toString(), icon: Package },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="po-stat-enter rounded-lg border bg-background/60 p-2"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <stat.icon className="h-3 w-3" />
                  {stat.label}
                </div>
                <div className="mt-0.5 text-sm font-bold">{stat.value}</div>
                {stat.sub && (
                  <div className={cn("text-[10px] font-medium", leadTimeVariance > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                    {stat.sub}
                  </div>
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
                "relative px-3 py-2.5 text-xs font-medium transition-all po-tab-switch",
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
        <div className="po-body-enter space-y-3 p-4">
          {activeTab === "overview" && (
            <OverviewTab po={po} receiptProgress={receiptProgress} paymentProgress={paymentProgress} leadTimeVariance={leadTimeVariance} />
          )}
          {activeTab === "items" && <ItemsTab po={po} />}
          {activeTab === "grn" && <GRNTab po={po} totalReceived={totalReceived} totalAccepted={totalAccepted} totalRejected={totalRejected} />}
          {activeTab === "invoices" && <InvoicesTab po={po} />}
          {activeTab === "approval" && <ApprovalTab po={po} />}
        </div>

        <SheetFooter className="border-t bg-muted/30 px-4 py-3">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="text-[11px] text-muted-foreground">
              PO Date: <span className="font-medium text-foreground">{po.poDate}</span>
              <span className="mx-2">·</span>
              Warehouse: <span className="font-medium text-foreground">{po.warehouse}</span>
            </div>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="btn-outline-animate h-8" onClick={handleExport}>
                <Download className="mr-1 h-3.5 w-3.5" /> Export
              </Button>
              {po.status === "pending-approval" && (
                <>
                  <Button variant="outline" size="sm" className="btn-outline-animate h-8 text-red-600 hover:text-red-700" onClick={handleReject}>
                    <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button size="sm" className="h-8" onClick={handleApprove}>
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                  </Button>
                </>
              )}
              {po.status === "approved" && (
                <Button size="sm" className="h-8" onClick={handleAck}>
                  <ThumbsUp className="mr-1 h-3.5 w-3.5" /> Send to Vendor
                </Button>
              )}
              {po.status === "acknowledged" && (
                <Button size="sm" className="h-8" onClick={handleAck}>
                  <Truck className="mr-1 h-3.5 w-3.5" /> Mark In-Transit
                </Button>
              )}
              {!["draft", "pending-approval", "approved", "acknowledged"].includes(po.status) && (
                <Button variant="outline" size="sm" className="btn-outline-animate h-8" onClick={handleAck}>
                  <PenLine className="mr-1 h-3.5 w-3.5" /> Add Note
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

function OverviewTab({ po, receiptProgress, paymentProgress, leadTimeVariance }: {
  po: PurchaseOrder
  receiptProgress: number
  paymentProgress: number
  leadTimeVariance: number
}) {
  return (
    <div className="space-y-3">
      {/* Buyer / Vendor Contact */}
      <div className="po-card-enter grid gap-3 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/40 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Buyer (Internal)</CardTitle>
          </CardHeader>
          <CardContent className="glass-subtle p-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  {po.buyerName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold">{po.buyerName}</div>
                <div className="text-[11px] text-muted-foreground">Procurement Officer</div>
              </div>
            </div>
            <div className="mt-2 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{po.buyerEmail}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span>{po.buyerPhone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/40 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Vendor Details</CardTitle>
          </CardHeader>
          <CardContent className="glass-subtle p-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={cn("text-xs font-semibold", CATEGORY_META[po.vendorCategory].bg, CATEGORY_META[po.vendorCategory].color)}>
                  {po.vendorName.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold">{po.vendorName}</div>
                <div className="font-mono text-[11px] text-muted-foreground">{po.vendorCode}</div>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
              <div>
                <span className="text-muted-foreground">Payment Terms: </span>
                <span className="font-medium">{po.paymentTerms}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Delivery: </span>
                <span className="font-medium">{po.deliveryTerms}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Approver: </span>
                <span className="font-medium">{po.approver}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Priority: </span>
                <span className={cn("font-semibold", PRIORITY_META[po.priority].color)}>{PRIORITY_META[po.priority].label}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6-month spend trend mock */}
      <Card className="po-card-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">6-Month Spend with Vendor</CardTitle>
          <CardDescription className="text-[11px]">Total value of POs placed with {po.vendorName}</CardDescription>
        </CardHeader>
        <CardContent className="glass-subtle pt-0">
          <ChartContainer
            config={{
              value: { label: "Spend (₹ Lakh)", color: "#2563eb" },
            }}
            className="h-[160px] w-full"
          >
            <AreaChart
              data={Array.from({ length: 6 }, (_, i) => {
                const h = hash(`${po.id}-trend-${i}`)
                return {
                  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
                  value: Math.round((8 + (h % 12)) * 10) / 10,
                }
              })}
              margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="vendorSpendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#vendorSpendGrad)"
                dot={{ r: 3, fill: "#2563eb" }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Progress trackers */}
      <div className="po-card-enter grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Receipt Progress</CardTitle>
          </CardHeader>
          <CardContent className="glass-subtle space-y-2 pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Received vs Ordered</span>
              <span className="font-semibold">{receiptProgress}%</span>
            </div>
            <Progress value={receiptProgress} className="h-2 po-progress-fill" />
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div>
                <div className="text-muted-foreground">Ordered</div>
                <div className="font-semibold">{po.items.reduce((s, it) => s + it.qty, 0)} units</div>
              </div>
              <div>
                <div className="text-muted-foreground">Received</div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">{po.grnEntries.reduce((s, g) => s + g.qtyReceived, 0)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Rejected</div>
                <div className="font-semibold text-red-600 dark:text-red-400">{po.grnEntries.reduce((s, g) => s + g.qtyRejected, 0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Payment Progress</CardTitle>
          </CardHeader>
          <CardContent className="glass-subtle space-y-2 pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Paid vs Payable</span>
              <span className="font-semibold">{paymentProgress}%</span>
            </div>
            <Progress value={paymentProgress} className="h-2 po-progress-fill" />
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div>
                <div className="text-muted-foreground">Payable</div>
                <div className="font-semibold">{formatINR(po.totalPayable, true)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Paid</div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">{formatINR(po.paidAmount, true)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Outstanding</div>
                <div className="font-semibold text-amber-600 dark:text-amber-400">{formatINR(po.outstanding, true)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead time vs SLA */}
      <Card className="po-card-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Lead Time Analysis</CardTitle>
        </CardHeader>
        <CardContent className="glass-subtle pt-0">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border p-2">
              <Clock className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Contracted SLA</div>
              <div className="text-base font-bold">{po.contractedLeadTimeDays}d</div>
            </div>
            <div className="rounded-lg border p-2">
              <Activity className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Actual</div>
              <div className="text-base font-bold">{po.leadTimeDays}d</div>
            </div>
            <div className={cn("rounded-lg border p-2", leadTimeVariance > 0 ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30" : "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30")}>
              {leadTimeVariance > 0 ? <TrendingUp className="mx-auto mb-1 h-4 w-4 text-red-600 dark:text-red-400" /> : <TrendingDown className="mx-auto mb-1 h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Variance</div>
              <div className={cn("text-base font-bold", leadTimeVariance > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                {leadTimeVariance > 0 ? "+" : ""}{leadTimeVariance}d
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {po.notes && (
        <Card className="po-card-enter bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="glass-subtle p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="text-xs font-semibold text-amber-700 dark:text-amber-300">PO Notes</div>
                <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-200">{po.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ItemsTab({ po }: { po: PurchaseOrder }) {
  return (
    <Card className="po-card-enter">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Line Items ({po.items.length})</CardTitle>
        <CardDescription className="text-[11px]">Parts, quantities, and pricing</CardDescription>
      </CardHeader>
      <CardContent className="glass-subtle pt-0">
        <div className="overflow-x-auto">
          <Table className="table-hover-highlight">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="h-8 text-[10px] uppercase">#</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Part No</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Description</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">UOM</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Qty</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Recv'd</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Unit ₹</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Tax</TableHead>
                <TableHead className="h-8 text-[10px] uppercase">Disc%</TableHead>
                <TableHead className="h-8 text-[10px] uppercase text-right">Total ₹</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {po.items.map((it) => (
                <TableRow key={it.sr} className="text-xs">
                  <TableCell className="py-2">{it.sr}</TableCell>
                  <TableCell className="py-2 font-mono font-semibold">{it.partNo}</TableCell>
                  <TableCell className="py-2">{it.description}</TableCell>
                  <TableCell className="py-2">{it.uom}</TableCell>
                  <TableCell className="py-2 text-right">{it.qty}</TableCell>
                  <TableCell className="py-2 text-right">
                    <span className={cn(it.receivedQty >= it.qty ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                      {it.receivedQty}
                    </span>
                  </TableCell>
                  <TableCell className="numeric-cell py-2 text-right">{it.unitPrice.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="numeric-cell py-2">{it.taxRate}%</TableCell>
                  <TableCell className="py-2">{it.discountPct}%</TableCell>
                  <TableCell className="numeric-cell py-2 text-right font-semibold">{formatINR(it.total, true)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-2 text-xs">
          <div>
            <div className="text-muted-foreground">Subtotal</div>
            <div className="font-semibold">{formatINR(po.totalValue, true)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Tax</div>
            <div className="font-semibold">{formatINR(po.taxAmount, true)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total Payable</div>
            <div className="font-bold text-primary">{formatINR(po.totalPayable, true)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function GRNTab({ po, totalReceived, totalAccepted, totalRejected }: {
  po: PurchaseOrder
  totalReceived: number
  totalAccepted: number
  totalRejected: number
}) {
  if (po.grnEntries.length === 0) {
    return (
      <Card className="po-card-enter">
        <CardContent className="glass-subtle flex flex-col items-center justify-center py-12">
          <Package className="mb-2 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium">No GRN entries yet</p>
          <p className="text-[11px] text-muted-foreground">Goods Receipt Notes will appear here once the vendor delivers</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="po-stat-enter">
          <CardContent className="glass-subtle p-3 text-center">
            <Package className="mx-auto mb-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div className="text-[10px] uppercase text-muted-foreground">Received</div>
            <div className="text-lg font-bold">{totalReceived}</div>
          </CardContent>
        </Card>
        <Card className="po-stat-enter" >
          <CardContent className="glass-subtle p-3 text-center">
            <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <div className="text-[10px] uppercase text-muted-foreground">Accepted</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{totalAccepted}</div>
          </CardContent>
        </Card>
        <Card className="po-stat-enter">
          <CardContent className="glass-subtle p-3 text-center">
            <XCircle className="mx-auto mb-1 h-5 w-5 text-red-600 dark:text-red-400" />
            <div className="text-[10px] uppercase text-muted-foreground">Rejected</div>
            <div className="text-lg font-bold text-red-600 dark:text-red-400">{totalRejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* GRN Table */}
      <Card className="po-card-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">GRN History</CardTitle>
        </CardHeader>
        <CardContent className="glass-subtle pt-0">
          <div className="overflow-x-auto">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="h-8 text-[10px] uppercase">GRN ID</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase">Date</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase">Warehouse</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase">Received By</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase text-right">Recv'd</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase text-right">Accepted</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase text-right">Rejected</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase">Status</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.grnEntries.map((g) => {
                  const meta = GRN_STATUS_META[g.status]
                  return (
                    <TableRow key={g.id} className="text-xs">
                      <TableCell className="py-2 font-mono font-semibold">{g.id}</TableCell>
                      <TableCell className="py-2">{g.date}</TableCell>
                      <TableCell className="py-2">{g.warehouse}</TableCell>
                      <TableCell className="py-2">{g.receivedBy}</TableCell>
                      <TableCell className="py-2 text-right">{g.qtyReceived}</TableCell>
                      <TableCell className="py-2 text-right text-emerald-600 dark:text-emerald-400">{g.qtyAccepted}</TableCell>
                      <TableCell className="py-2 text-right text-red-600 dark:text-red-400">{g.qtyRejected}</TableCell>
                      <TableCell className="py-2">
                        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", meta.bg, meta.color)}>
                          {meta.label}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 font-mono text-[11px]">{g.invoiceNo}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Notes from GRN */}
          <div className="mt-3 space-y-1.5">
            {po.grnEntries.map((g) => (
              <div key={g.id} className="flex items-start gap-2 rounded border bg-muted/30 p-2 text-[11px]">
                <Hash className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                <div>
                  <span className="font-mono font-semibold">{g.id}:</span>{" "}
                  <span className="text-muted-foreground">{g.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InvoicesTab({ po }: { po: PurchaseOrder }) {
  if (po.invoices.length === 0) {
    return (
      <Card className="po-card-enter">
        <CardContent className="glass-subtle flex flex-col items-center justify-center py-12">
          <Receipt className="mb-2 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium">No invoices yet</p>
          <p className="text-[11px] text-muted-foreground">Vendor invoices will appear here after goods are received</p>
        </CardContent>
      </Card>
    )
  }

  const totalInv = po.invoices.reduce((s, i) => s + i.total, 0)
  const totalPaid = po.invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0)

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="po-stat-enter">
          <CardContent className="glass-subtle p-3 text-center">
            <Receipt className="mx-auto mb-1 h-5 w-5 text-purple-600 dark:text-purple-400" />
            <div className="text-[10px] uppercase text-muted-foreground">Invoiced</div>
            <div className="text-lg font-bold">{formatINR(totalInv, true)}</div>
          </CardContent>
        </Card>
        <Card className="po-stat-enter">
          <CardContent className="glass-subtle p-3 text-center">
            <Banknote className="mx-auto mb-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <div className="text-[10px] uppercase text-muted-foreground">Paid</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatINR(totalPaid, true)}</div>
          </CardContent>
        </Card>
        <Card className="po-stat-enter">
          <CardContent className="glass-subtle p-3 text-center">
            <Clock className="mx-auto mb-1 h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div className="text-[10px] uppercase text-muted-foreground">Pending</div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatINR(totalInv - totalPaid, true)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Table */}
      <Card className="po-card-enter">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Invoice Register</CardTitle>
        </CardHeader>
        <CardContent className="glass-subtle pt-0">
          <div className="overflow-x-auto">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="h-8 text-[10px] uppercase">Invoice No</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase">Date</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase">Received</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase text-right">Amount ₹</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase text-right">Tax ₹</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase text-right">Total ₹</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase">Status</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase">Matched By</TableHead>
                  <TableHead className="h-8 text-[10px] uppercase">Payment Ref</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.invoices.map((inv) => {
                  const meta = INVOICE_STATUS_META[inv.status]
                  return (
                    <TableRow key={inv.id} className="text-xs">
                      <TableCell className="py-2 font-mono font-semibold">{inv.invoiceNo}</TableCell>
                      <TableCell className="py-2">{inv.invoiceDate}</TableCell>
                      <TableCell className="py-2">{inv.receivedDate}</TableCell>
                      <TableCell className="numeric-cell py-2 text-right">{inv.amount.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="numeric-cell py-2 text-right">{inv.taxAmount.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="numeric-cell py-2 text-right font-semibold">{inv.total.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="py-2">
                        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", meta.bg, meta.color)}>
                          {meta.label}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-[11px]">{inv.matchedBy}</TableCell>
                      <TableCell className="py-2 font-mono text-[11px]">{inv.paymentRef || "—"}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-2 text-xs">
            <div>
              <span className="text-muted-foreground">Total Invoiced: </span>
              <span className="font-semibold">{formatINR(totalInv, true)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Paid: </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatINR(totalPaid, true)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ApprovalTab({ po }: { po: PurchaseOrder }) {
  return (
    <Card className="po-card-enter">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Approval Workflow</CardTitle>
        <CardDescription className="text-[11px]">Multi-stage approval chain with status tracking</CardDescription>
      </CardHeader>
      <CardContent className="glass-subtle pt-0">
        <div className="space-y-2">
          {po.approvals.map((step, idx) => {
            const stageLabels: Record<POApprovalStage, { label: string; icon: typeof FileText }> = {
              initiated: { label: "Initiated by Buyer", icon: FilePlus },
              "manager-review": { label: "Procurement Manager Review", icon: ClipboardList },
              "finance-review": { label: "Finance Controller Review", icon: CircleDollarSign },
              "procurement-head": { label: "Head of Procurement Approval", icon: ShieldCheck },
              completed: { label: "Workflow Completed", icon: CheckCircle2 },
            }
            const stageMeta = stageLabels[step.stage]
            const statusVisual = step.status === "approved"
              ? { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", icon: CheckCircle2 }
              : step.status === "rejected"
              ? { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", icon: XCircle }
              : step.status === "pending"
              ? { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", icon: Clock }
              : { color: "text-slate-500 dark:text-slate-400", bg: "bg-muted/50", border: "border-transparent", icon: FileText }

            return (
              <div
                key={step.stage}
                className={cn(
                  "po-approval-step relative flex items-start gap-3 rounded-lg border p-2.5",
                  statusVisual.bg,
                  statusVisual.border
                )}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-full", statusVisual.bg, statusVisual.color)}>
                  <stageMeta.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold">{stageMeta.label}</div>
                    <span className={cn("text-[10px] font-semibold uppercase", statusVisual.color)}>
                      {step.status}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {step.approver} · {step.role}
                  </div>
                  {step.timestamp && (
                    <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      {step.timestamp}
                    </div>
                  )}
                  <div className="mt-1 text-[11px] italic text-muted-foreground">
                    "{step.remarks}"
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
