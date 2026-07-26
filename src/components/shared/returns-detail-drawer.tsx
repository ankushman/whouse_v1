"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
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
} from "recharts"
import {
  RotateCcw,
  Package,
  PackageX,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Truck,
  MapPin,
  User,
  DollarSign,
  ChevronRight,
  Recycle,
  ShieldAlert,
  ClipboardCheck,
  Building2,
  Boxes,
  FileText,
  Download,
  Send,
  Phone,
  Mail,
  Camera,
  X,
  CheckCircle,
  XCircle,
  Sparkles,
  History,
  Wrench,
  Trash2,
  Gift,
  RefreshCw,
  Calendar,
  Printer,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  CheckSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { exportToCSV } from "@/components/shared/export-button"
import { Input } from "@/components/ui/input"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ReturnStatus =
  | "initiated"
  | "pickup-scheduled"
  | "in-transit"
  | "received"
  | "inspection"
  | "restocked"
  | "refurbished"
  | "disposed"
  | "rejected"

export type ReturnReason =
  | "damaged"
  | "wrong-item"
  | "quality-defect"
  | "expired"
  | "customer-cancel"
  | "warranty-claim"
  | "overstock"
  | "recall"

export type Disposition =
  | "restock"
  | "refurbish"
  | "resell-discount"
  | "donate"
  | "recycle"
  | "dispose"

export interface ReturnDetailItem {
  id: string
  rma: string
  customer: string
  warehouse: string
  sku: string
  partName: string
  category: string
  quantity: number
  reason: ReturnReason
  status: ReturnStatus
  disposition: Disposition
  initiatedDate: string
  ageDays: number
  value: number
  inspector?: string
  priority: "high" | "medium" | "low"
}

interface ReturnsDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ReturnDetailItem | null
}

// ---------------------------------------------------------------------------
// Status config — full theming
// ---------------------------------------------------------------------------

const statusTheme: Record<
  ReturnStatus,
  {
    gradient: string
    border: string
    iconBg: string
    iconColor: string
    label: string
    barColor: string
    chipBg: string
    chipText: string
  }
> = {
  initiated: {
    gradient: "from-slate-500/15 via-slate-500/5 to-transparent",
    border: "border-slate-500/40",
    iconBg: "bg-slate-100 dark:bg-slate-900/70",
    iconColor: "text-slate-600 dark:text-slate-300",
    label: "Initiated",
    barColor: "#64748b",
    chipBg: "bg-slate-100 dark:bg-slate-900",
    chipText: "text-slate-700 dark:text-slate-300",
  },
  "pickup-scheduled": {
    gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
    border: "border-blue-500/40",
    iconBg: "bg-blue-100 dark:bg-blue-950/70",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "Pickup Scheduled",
    barColor: "#3b82f6",
    chipBg: "bg-blue-100 dark:bg-blue-950",
    chipText: "text-blue-700 dark:text-blue-300",
  },
  "in-transit": {
    gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
    border: "border-blue-500/40",
    iconBg: "bg-blue-100 dark:bg-blue-950/70",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "In Transit",
    barColor: "#3b82f6",
    chipBg: "bg-blue-100 dark:bg-blue-950",
    chipText: "text-blue-700 dark:text-blue-300",
  },
  received: {
    gradient: "from-violet-500/15 via-violet-500/5 to-transparent",
    border: "border-violet-500/40",
    iconBg: "bg-violet-100 dark:bg-violet-950/70",
    iconColor: "text-violet-600 dark:text-violet-400",
    label: "Received at WH",
    barColor: "#8b5cf6",
    chipBg: "bg-violet-100 dark:bg-violet-950",
    chipText: "text-violet-700 dark:text-violet-300",
  },
  inspection: {
    gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    border: "border-amber-500/40",
    iconBg: "bg-amber-100 dark:bg-amber-950/70",
    iconColor: "text-amber-600 dark:text-amber-400",
    label: "Under Inspection",
    barColor: "#f59e0b",
    chipBg: "bg-amber-100 dark:bg-amber-950",
    chipText: "text-amber-700 dark:text-amber-300",
  },
  restocked: {
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/70",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "Restocked",
    barColor: "#10b981",
    chipBg: "bg-emerald-100 dark:bg-emerald-950",
    chipText: "text-emerald-700 dark:text-emerald-300",
  },
  refurbished: {
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/70",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "Refurbished",
    barColor: "#10b981",
    chipBg: "bg-emerald-100 dark:bg-emerald-950",
    chipText: "text-emerald-700 dark:text-emerald-300",
  },
  disposed: {
    gradient: "from-red-500/15 via-red-500/5 to-transparent",
    border: "border-red-500/40",
    iconBg: "bg-red-100 dark:bg-red-950/70",
    iconColor: "text-red-600 dark:text-red-400",
    label: "Disposed",
    barColor: "#ef4444",
    chipBg: "bg-red-100 dark:bg-red-950",
    chipText: "text-red-700 dark:text-red-300",
  },
  rejected: {
    gradient: "from-red-500/15 via-red-500/5 to-transparent",
    border: "border-red-500/40",
    iconBg: "bg-red-100 dark:bg-red-950/70",
    iconColor: "text-red-600 dark:text-red-400",
    label: "Rejected",
    barColor: "#ef4444",
    chipBg: "bg-red-100 dark:bg-red-950",
    chipText: "text-red-700 dark:text-red-300",
  },
}

const reasonConfig: Record<
  ReturnReason,
  { label: string; icon: typeof AlertTriangle; color: string; bg: string; description: string }
> = {
  damaged: {
    label: "Damaged in Transit",
    icon: AlertTriangle,
    color: "text-red-700 dark:text-red-300",
    bg: "bg-red-100 dark:bg-red-950",
    description: "Item arrived physically damaged during shipping. Carrier liability assessment required.",
  },
  "wrong-item": {
    label: "Wrong Item Shipped",
    icon: PackageX,
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-100 dark:bg-amber-950",
    description: "SKU mismatch — wrong part was picked and shipped from warehouse. Order fulfillment audit needed.",
  },
  "quality-defect": {
    label: "Quality Defect",
    icon: ShieldAlert,
    color: "text-red-700 dark:text-red-300",
    bg: "bg-red-100 dark:bg-red-950",
    description: "Manufacturing defect detected by customer QA. Supplier escalation may be required.",
  },
  expired: {
    label: "Expired / Shelf-Life",
    icon: Clock,
    color: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-900",
    description: "Item exceeded shelf-life or expiry date. FIFO compliance review recommended.",
  },
  "customer-cancel": {
    label: "Customer Cancellation",
    icon: User,
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-100 dark:bg-blue-950",
    description: "Order cancelled by customer after dispatch. Restocking fee may apply per contract terms.",
  },
  "warranty-claim": {
    label: "Warranty Claim",
    icon: ShieldAlert,
    color: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-100 dark:bg-violet-950",
    description: "In-warranty failure claim. OEM/supplier credit request will be initiated.",
  },
  overstock: {
    label: "Customer Overstock",
    icon: Boxes,
    color: "text-cyan-700 dark:text-cyan-300",
    bg: "bg-cyan-100 dark:bg-cyan-950",
    description: "Customer returning excess inventory. Buy-back terms per MSA Schedule B.",
  },
  recall: {
    label: "Product Recall",
    icon: AlertTriangle,
    color: "text-red-700 dark:text-red-300",
    bg: "bg-red-100 dark:bg-red-950",
    description: "Manufacturer-initiated safety recall. Regulatory notification within 24h required.",
  },
}

const dispositionConfig: Record<
  Disposition,
  {
    label: string
    icon: typeof Recycle
    color: string
    bg: string
    recovery: number
    description: string
    pieColor: string
  }
> = {
  restock: {
    label: "Restock",
    icon: Package,
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-100 dark:bg-emerald-950",
    recovery: 100,
    description: "Item passes QA — return to sellable inventory at full value.",
    pieColor: "#10b981",
  },
  refurbish: {
    label: "Refurbish",
    icon: Wrench,
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-100 dark:bg-blue-950",
    recovery: 70,
    description: "Minor repair/refurbish required — resell as 'refurbished' at 70% of original value.",
    pieColor: "#3b82f6",
  },
  "resell-discount": {
    label: "Resell (Discount)",
    icon: TrendingDown,
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-100 dark:bg-amber-950",
    recovery: 50,
    description: "Cosmetic blemish — resell on secondary channel at 50% discount.",
    pieColor: "#f59e0b",
  },
  donate: {
    label: "Donate",
    icon: Gift,
    color: "text-cyan-700 dark:text-cyan-300",
    bg: "bg-cyan-100 dark:bg-cyan-950",
    recovery: 35,
    description: "Functional but unsellable — donate to partner NGO for 35% tax credit.",
    pieColor: "#06b6d4",
  },
  recycle: {
    label: "Recycle",
    icon: Recycle,
    color: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-100 dark:bg-violet-950",
    recovery: 15,
    description: "Material recovery — sell to recycler for 15% of component material value.",
    pieColor: "#8b5cf6",
  },
  dispose: {
    label: "Dispose",
    icon: Trash2,
    color: "text-red-700 dark:text-red-300",
    bg: "bg-red-100 dark:bg-red-950",
    recovery: 0,
    description: "Hazardous / unsalvageable — certified disposal per e-waste guidelines.",
    pieColor: "#ef4444",
  },
}

const priorityTheme = {
  high: {
    label: "HIGH",
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-700 dark:text-red-300",
    ring: "ring-red-500/30",
  },
  medium: {
    label: "MEDIUM",
    bg: "bg-amber-100 dark:bg-amber-950",
    text: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-500/30",
  },
  low: {
    label: "LOW",
    bg: "bg-slate-100 dark:bg-slate-900",
    text: "text-slate-700 dark:text-slate-300",
    ring: "ring-slate-500/30",
  },
} as const

// ---------------------------------------------------------------------------
// Deterministic helpers
// ---------------------------------------------------------------------------

function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

const DAY = 86_400_000

// ---------------------------------------------------------------------------
// Mock data generators
// ---------------------------------------------------------------------------

interface TimelineEvent {
  id: string
  timestamp: string
  kind: "initiated" | "pickup" | "transit" | "received" | "inspection" | "decision" | "resolved"
  title: string
  detail: string
  actor: string
  completed: boolean
}

function getTimeline(item: ReturnDetailItem): TimelineEvent[] {
  const seed = hashStr(item.id + item.rma)
  const startedAt = Date.now() - item.ageDays * DAY
  const events: TimelineEvent[] = [
    {
      id: "e1",
      timestamp: new Date(startedAt).toISOString(),
      kind: "initiated",
      title: "RMA Initiated",
      detail: `Return request created by customer via portal. Reason: ${reasonConfig[item.reason].label}.`,
      actor: item.customer,
      completed: true,
    },
  ]
  if (item.ageDays >= 1 || item.status !== "initiated") {
    events.push({
      id: "e2",
      timestamp: new Date(startedAt + 0.5 * DAY).toISOString(),
      kind: "pickup",
      title: "Pickup Scheduled",
      detail: `Carrier assigned for pickup from ${item.customer} → ${item.warehouse}. Slot: ${8 + (seed % 8)}:00 IST.`,
      actor: "Reverse Logistics Team",
      completed: true,
    })
  }
  if (item.ageDays >= 2 || ["in-transit", "received", "inspection", "restocked", "refurbished", "disposed", "rejected"].includes(item.status)) {
    events.push({
      id: "e3",
      timestamp: new Date(startedAt + 1.2 * DAY).toISOString(),
      kind: "transit",
      title: "In Transit to Warehouse",
      detail: `Shipment picked up. Tracking ID: TRK${(seed % 900000 + 100000)}. ETA: ${1 + (seed % 2)} business day(s).`,
      actor: "BlueDart Reverse",
      completed: true,
    })
  }
  if (item.ageDays >= 3 || ["received", "inspection", "restocked", "refurbished", "disposed", "rejected"].includes(item.status)) {
    events.push({
      id: "e4",
      timestamp: new Date(startedAt + 2.4 * DAY).toISOString(),
      kind: "received",
      title: "Received at Warehouse",
      detail: `Item received at ${item.warehouse}. Dock: IN-REV-${(seed % 9) + 1}. GRN: GRN${seed % 90000 + 10000}.`,
      actor: `${item.warehouse} Inbound Team`,
      completed: true,
    })
  }
  if (item.ageDays >= 4 || ["inspection", "restocked", "refurbished", "disposed", "rejected"].includes(item.status)) {
    events.push({
      id: "e5",
      timestamp: new Date(startedAt + 3.1 * DAY).toISOString(),
      kind: "inspection",
      title: "Inspection Started",
      detail: `QA inspector ${item.inspector ?? "Auto-assigned"} began defect analysis. Estimated time: ${1 + (seed % 3)}h.`,
      actor: item.inspector ?? "QA Team",
      completed: true,
    })
  }
  if (["restocked", "refurbished", "disposed", "rejected"].includes(item.status)) {
    events.push({
      id: "e6",
      timestamp: new Date(startedAt + (3.6 + (seed % 10) / 10) * DAY).toISOString(),
      kind: "decision",
      title: "Disposition Decision",
      detail: `Disposition set to: ${dispositionConfig[item.disposition].label}. Recovery rate: ${dispositionConfig[item.disposition].recovery}%.`,
      actor: item.inspector ?? "QA Lead",
      completed: true,
    })
  }
  if (["restocked", "refurbished", "disposed", "rejected"].includes(item.status)) {
    events.push({
      id: "e7",
      timestamp: new Date(startedAt + (4.2 + (seed % 10) / 10) * DAY).toISOString(),
      kind: "resolved",
      title: "RMA Resolved",
      detail: item.status === "rejected"
        ? "RMA rejected — item non-conforming. Customer notified of denial with reason."
        : item.status === "disposed"
        ? "Item disposed per e-waste guidelines. Disposal certificate generated."
        : item.status === "refurbished"
        ? "Refurbishment complete. Item moved to refurbished inventory zone."
        : "Item restocked to sellable inventory. Stock updated in WMS.",
      actor: "System (Auto)",
      completed: true,
    })
  }
  return events
}

interface DefectCode {
  code: string
  description: string
  severity: "critical" | "major" | "minor"
}

function getDefectCodes(item: ReturnDetailItem): DefectCode[] {
  const seed = hashStr(item.id)
  const codePool: Record<ReturnReason, DefectCode[]> = {
    damaged: [
      { code: "DMG-OUT-01", description: "Outer carton crushed", severity: "major" },
      { code: "DMG-IN-02", description: "Inner packaging torn", severity: "minor" },
      { code: "DMG-PRT-03", description: "Part surface scratches", severity: "minor" },
      { code: "DMG-BRK-04", description: "Component broken / fractured", severity: "critical" },
    ],
    "wrong-item": [
      { code: "WRG-SKU-01", description: "SKU mismatch — wrong part picked", severity: "critical" },
      { code: "WRG-LBL-02", description: "Label correct, contents wrong", severity: "major" },
      { code: "WRG-QTY-03", description: "Wrong quantity in correct SKU", severity: "major" },
    ],
    "quality-defect": [
      { code: "QLT-DIM-01", description: "Dimensional tolerance exceeded", severity: "major" },
      { code: "QLT-SUR-02", description: "Surface finish below spec", severity: "minor" },
      { code: "QLT-FIT-03", description: "Fitment failure at assembly", severity: "critical" },
      { code: "QLT-MAT-04", description: "Material composition non-conforming", severity: "critical" },
    ],
    expired: [
      { code: "EXP-SHE-01", description: "Shelf-life exceeded", severity: "major" },
      { code: "EXP-FIFO-02", description: "FIFO violation in picking", severity: "major" },
    ],
    "customer-cancel": [
      { code: "CXL-CUS-01", description: "Customer-initiated cancellation", severity: "minor" },
    ],
    "warranty-claim": [
      { code: "WAR-FAIL-01", description: "In-warranty functional failure", severity: "major" },
      { code: "WAR-WEAR-02", description: "Premature wear detected", severity: "minor" },
      { code: "WAR-ELEC-03", description: "Electronic component failure", severity: "critical" },
    ],
    overstock: [
      { code: "OVS-CUS-01", description: "Customer excess inventory return", severity: "minor" },
    ],
    recall: [
      { code: "RCL-SAFE-01", description: "Safety recall — manufacturer notice", severity: "critical" },
      { code: "RCL-REG-02", description: "Regulatory compliance recall", severity: "critical" },
    ],
  }
  const pool = codePool[item.reason]
  // Pick 2-3 defect codes deterministically
  const count = Math.min(pool.length, 2 + (seed % 2))
  return pool.slice(0, count)
}

interface ChecklistItem {
  id: string
  label: string
  status: "pass" | "fail" | "n/a"
}

function getChecklist(item: ReturnDetailItem): ChecklistItem[] {
  const seed = hashStr(item.id)
  return [
    { id: "c1", label: "RMA number verified on carton", status: (seed & 1) === 1 ? "pass" : "fail" },
    { id: "c2", label: "Original packaging intact", status: (seed & 2) === 2 ? "pass" : "fail" },
    { id: "c3", label: "All accessories present", status: (seed & 4) === 4 ? "pass" : "n/a" },
    { id: "c4", label: "Serial number matches RMA", status: "pass" },
    { id: "c5", label: "Visual damage documented", status: (seed & 8) === 8 ? "pass" : "fail" },
    { id: "c6", label: "Functional test performed", status: (seed & 16) === 16 ? "pass" : "n/a" },
    { id: "c7", label: "Disposition category assigned", status: "pass" },
  ]
}

interface CommsMessage {
  id: string
  from: "customer" | "warehouse" | "system"
  author: string
  message: string
  time: string
}

function getCommunications(item: ReturnDetailItem): CommsMessage[] {
  const seed = hashStr(item.id)
  const startedAt = Date.now() - item.ageDays * DAY
  return [
    {
      id: "m1",
      from: "customer",
      author: item.customer,
      message: "Hi, we need to return this item as it doesn't meet our QA spec. Please arrange pickup.",
      time: new Date(startedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "m2",
      from: "warehouse",
      author: "Reverse Logistics Team",
      message: `Hello ${item.customer}, we've scheduled pickup for tomorrow morning. RMA ${item.rma} created. Please keep the item in original packaging.`,
      time: new Date(startedAt + 0.3 * DAY).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "m3",
      from: "system",
      author: "AutoFlow WMS",
      message: `Item received at ${item.warehouse}. Inspection in queue. ETA: ${1 + (seed % 2)} business day.`,
      time: new Date(startedAt + 2.4 * DAY).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "m4",
      from: "warehouse",
      author: item.inspector ?? "QA Inspector",
      message: `Inspection complete. Disposition: ${dispositionConfig[item.disposition].label}. Recovery: ${dispositionConfig[item.disposition].recovery}%. Credit memo will follow.`,
      time: new Date(startedAt + 3.5 * DAY).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    },
  ]
}

interface SimilarReturn {
  rma: string
  date: string
  disposition: Disposition
  value: number
  recovery: number
}

function getSimilarReturns(item: ReturnDetailItem): SimilarReturn[] {
  const seed = hashStr(item.id + item.sku)
  const dispositions: Disposition[] = ["restock", "refurbish", "resell-discount", "dispose", "donate", "recycle"]
  const rows: SimilarReturn[] = []
  for (let i = 0; i < 5; i++) {
    const d = dispositions[(seed + i * 3) % dispositions.length]
    rows.push({
      rma: `RMA-2024-${1000 + ((seed + i * 17) % 200)}`,
      date: new Date(Date.now() - (30 + i * 14) * DAY).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      disposition: d,
      value: Math.round(item.value * (0.4 + ((seed + i * 11) % 80) / 100)),
      recovery: dispositionConfig[d].recovery,
    })
  }
  return rows
}

// 14-day return-rate trend for this SKU
interface TrendPoint {
  day: string
  returns: number
  shipped: number
}

function getSkuTrend(item: ReturnDetailItem): TrendPoint[] {
  const seed = hashStr(item.sku)
  const points: TrendPoint[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY)
    const label = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    const weekend = d.getDay() === 0 || d.getDay() === 6
    const baseReturns = 1 + (seed % 4)
    const baseShipped = 12 + (seed % 18)
    const variance = ((seed >> (i % 14)) & 0x3) - 1
    points.push({
      day: label,
      returns: Math.max(0, baseReturns + variance + (weekend ? -1 : 0)),
      shipped: Math.max(0, baseShipped + variance * 2 + (weekend ? -4 : 0)),
    })
  }
  return points
}

// Recovery breakdown donut
function getRecoveryBreakdown(item: ReturnDetailItem) {
  const disp = dispositionConfig[item.disposition]
  const recovered = Math.round(item.value * disp.recovery / 100)
  const disposalCost = item.disposition === "dispose" ? Math.round(item.value * 0.05) : Math.round(item.value * 0.02)
  const transportCost = Math.round(item.value * 0.03)
  const inspectionCost = Math.round(item.value * 0.01)
  const netImpact = recovered - disposalCost - transportCost - inspectionCost
  return [
    { name: "Recovered Value", value: recovered, color: "#10b981" },
    { name: "Transport Cost", value: transportCost, color: "#3b82f6" },
    { name: "Inspection Cost", value: inspectionCost, color: "#f59e0b" },
    { name: "Disposal Cost", value: disposalCost, value2: disposalCost, color: "#ef4444" },
    { name: "Net Loss", value: Math.max(0, item.value - recovered + disposalCost + transportCost + inspectionCost), color: "#94a3b8" },
  ]
}

// ---------------------------------------------------------------------------
// Charts config
// ---------------------------------------------------------------------------

const trendChartConfig = {
  returns: { label: "Returns", color: "#ef4444" },
  shipped: { label: "Shipped", color: "#3b82f6" },
} satisfies ChartConfig

const recoveryChartConfig = {
  recovered: { label: "Recovered", color: "#10b981" },
  cost: { label: "Cost", color: "#ef4444" },
} satisfies ChartConfig

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReturnsDetailDrawer({ open, onOpenChange, item }: ReturnsDetailDrawerProps) {
  const toast = useToast()
  const [selectedTab, setSelectedTab] = React.useState<"overview" | "inspection" | "recovery" | "communications" | "timeline">("overview")

  React.useEffect(() => {
    if (open) setSelectedTab("overview")
  }, [open, item?.id])

  if (!item) return null

  const theme = statusTheme[item.status]
  const reason = reasonConfig[item.reason]
  const disposition = dispositionConfig[item.disposition]
  const priority = priorityTheme[item.priority]

  const ReasonIcon = reason.icon
  const DispIcon = disposition.icon
  const StatusIcon = item.status === "initiated" ? Clock : item.status === "pickup-scheduled" || item.status === "in-transit" ? Truck : item.status === "received" ? Package : item.status === "inspection" ? ClipboardCheck : item.status === "restocked" ? CheckCircle2 : item.status === "refurbished" ? Recycle : item.status === "disposed" ? Trash2 : ShieldAlert

  const timeline = getTimeline(item)
  const defectCodes = getDefectCodes(item)
  const checklist = getChecklist(item)
  const communications = getCommunications(item)
  const similarReturns = getSimilarReturns(item)
  const skuTrend = getSkuTrend(item)
  const recoveryBreakdown = getRecoveryBreakdown(item)
  const recoveredValue = Math.round(item.value * disposition.recovery / 100)
  const netImpact = recoveredValue - Math.round(item.value * 0.05) - Math.round(item.value * 0.03) - Math.round(item.value * 0.01)

  const initials = item.customer.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  const handleExport = () => {
    const rows = [{
      rma: item.rma,
      customer: item.customer,
      warehouse: item.warehouse,
      sku: item.sku,
      partName: item.partName,
      category: item.category,
      quantity: item.quantity,
      reason: reason.label,
      status: theme.label,
      disposition: disposition.label,
      recovery: disposition.recovery,
      value: item.value,
      recoveredValue,
      netImpact,
      ageDays: item.ageDays,
      inspector: item.inspector ?? "—",
      priority: item.priority,
      initiatedDate: item.initiatedDate,
    }]
    exportToCSV(rows, `rma-${item.rma}-detail`)
    toast.success("Export complete", `${item.rma} detail exported to CSV.`)
  }

  const handleApprove = () => {
    toast.success("RMA Approved", `${item.rma} disposition confirmed as ${disposition.label}. Stock updated.`)
  }

  const handleReject = () => {
    toast.error("RMA Rejected", `${item.rma} rejected. Customer will be notified with denial reason.`)
  }

  const handlePrint = () => {
    toast.info("Print label", `Generating return shipping label for ${item.rma}.`)
  }

  const handleContact = () => {
    toast.info("Opening dialer", `Calling ${item.customer} contact...`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header strip */}
        <SheetHeader className={cn(
          "relative px-5 py-4 border-b returns-drawer-header",
          "bg-gradient-to-b",
          theme.gradient,
          theme.border
        )}>
          <div className="absolute inset-0 returns-drawer-sheen pointer-events-none" />
          <div className="relative flex items-start gap-3">
            <div className={cn("rounded-xl p-2.5 border returns-icon-pulse", theme.border, theme.iconBg, theme.iconColor)}>
              <RotateCcw className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <SheetTitle className="text-base font-semibold flex items-center gap-2">
                <span className="font-mono">{item.rma}</span>
                <Badge variant="outline" className={cn("text-[10px] rounded-full", theme.chipText, theme.border)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {theme.label}
                </Badge>
                <Badge variant="outline" className={cn("text-[9px] rounded-full ring-1", priority.bg, priority.text, priority.ring)}>
                  {priority.label}
                </Badge>
              </SheetTitle>
              <SheetDescription className="text-xs flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground/80">{item.customer}</span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-0.5">
                  <Building2 className="h-3 w-3" /> {item.warehouse}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="font-mono">{item.sku}</span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-0.5">
                  <Calendar className="h-3 w-3" /> Initiated {item.ageDays}d ago
                </span>
              </SheetDescription>
            </div>
          </div>

          {/* Hero stat grid */}
          <div className="relative mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 returns-stat-enter">
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", theme.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Package className="h-3 w-3" /> Quantity
              </p>
              <p className="text-sm font-bold text-number">{item.quantity} units</p>
              <p className="text-[9px] text-muted-foreground">{item.category}</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", theme.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Gross Value
              </p>
              <p className="text-sm font-bold text-number">₹{item.value.toLocaleString("en-IN")}</p>
              <p className="text-[9px] text-muted-foreground">{item.partName.slice(0, 20)}{item.partName.length > 20 ? "…" : ""}</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", theme.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Recovery
              </p>
              <p className={cn("text-sm font-bold text-number", disposition.recovery >= 70 ? "text-emerald-600 dark:text-emerald-400" : disposition.recovery >= 35 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                {disposition.recovery}%
              </p>
              <p className="text-[9px] text-muted-foreground">₹{recoveredValue.toLocaleString("en-IN")} recovered</p>
            </div>
            <div className={cn("rounded-lg border bg-background/80 backdrop-blur px-2.5 py-2", theme.border)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Aging
              </p>
              <p className={cn("text-sm font-bold text-number", item.ageDays < 3 ? "text-emerald-600 dark:text-emerald-400" : item.ageDays < 7 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                {item.ageDays}d
              </p>
              <p className="text-[9px] text-muted-foreground">{item.ageDays < 3 ? "On track" : item.ageDays < 7 ? "Watch" : "SLA risk"}</p>
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="relative mt-3 flex gap-1 rounded-lg bg-muted/60 p-0.5 overflow-x-auto">
            {([
              { id: "overview", label: "Overview" },
              { id: "inspection", label: `Inspection (${defectCodes.length})` },
              { id: "recovery", label: "Recovery" },
              { id: "communications", label: `Comms (${communications.length})` },
              { id: "timeline", label: `Timeline (${timeline.length})` },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTab(t.id)}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium transition-all returns-tab-switch",
                  selectedTab === t.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="p-4 space-y-3 returns-body-enter min-h-[400px]">
          {/* ── OVERVIEW TAB ─────────────────────────────────────────── */}
          {selectedTab === "overview" && (
            <>
              {/* Reason card */}
              <div className={cn("rounded-xl border p-3 returns-card-enter", reason.bg, reason.color)}>
                <div className="flex items-start gap-2">
                  <div className={cn("rounded-lg p-1.5 bg-background/60", reason.color)}>
                    <ReasonIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">Return Reason: {reason.label}</p>
                    <p className="text-[11px] mt-0.5 opacity-90">{reason.description}</p>
                  </div>
                </div>
              </div>

              {/* Part info */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Package className="h-3 w-3" /> Part Information
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground">SKU</p>
                    <p className="font-mono font-medium">{item.sku}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Part Name</p>
                    <p className="font-medium">{item.partName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Category</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Quantity</p>
                    <p className="font-medium text-number">{item.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Unit Value</p>
                    <p className="font-medium text-number">₹{Math.round(item.value / item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Gross Value</p>
                    <p className="font-medium text-number">₹{item.value.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>

              {/* Customer & warehouse */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border bg-card p-3 returns-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <User className="h-3 w-3" /> Customer
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{item.customer}</p>
                      <p className="text-[10px] text-muted-foreground">OEM / Tier-1</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-3 returns-card-enter">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Receiving WH
                  </p>
                  <p className="text-xs font-medium">{item.warehouse}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                    <MapPin className="h-2.5 w-2.5" /> Reverse Logistics Bay
                  </p>
                </div>
              </div>

              {/* SKU return trend chart */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <History className="h-3 w-3" /> 14-Day SKU Return Trend
                  </p>
                  <Badge variant="outline" className="text-[9px]">
                    {skuTrend.reduce((a, p) => a + p.returns, 0)} returns / {skuTrend.reduce((a, p) => a + p.shipped, 0)} shipped
                  </Badge>
                </div>
                <ChartContainer config={trendChartConfig} className="aspect-[16/6] w-full">
                    <AreaChart data={skuTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="rGradReturns" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="rGradShipped" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={2} />
                      <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area dataKey="shipped" type="monotone" stroke="#3b82f6" strokeWidth={1.5} fill="url(#rGradShipped)" />
                      <Area dataKey="returns" type="monotone" stroke="#ef4444" strokeWidth={1.5} fill="url(#rGradReturns)" />
                    </AreaChart>
                </ChartContainer>
              </div>

              {/* Disposition snapshot */}
              <div className={cn("rounded-xl border p-3 returns-card-enter", disposition.bg, disposition.color)}>
                <div className="flex items-start gap-2">
                  <div className={cn("rounded-lg p-1.5 bg-background/60", disposition.color)}>
                    <DispIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">Disposition: {disposition.label}</p>
                    <p className="text-[11px] mt-0.5 opacity-90">{disposition.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={disposition.recovery} className="h-1.5 flex-1" />
                      <span className="text-[10px] font-bold">{disposition.recovery}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── INSPECTION TAB ───────────────────────────────────────── */}
          {selectedTab === "inspection" && (
            <>
              {/* Inspector info */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <ClipboardCheck className="h-3 w-3" /> Inspector
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      {item.inspector ? item.inspector.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "QA"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium">{item.inspector ?? "Auto-assigned"}</p>
                    <p className="text-[10px] text-muted-foreground">QA Inspector · {item.warehouse}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Inspection started: {item.ageDays >= 4 ? `${item.ageDays - 4}d ago` : "today"}</p>
                  </div>
                </div>
              </div>

              {/* Defect codes */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Identified Defect Codes ({defectCodes.length})
                </p>
                <div className="space-y-1.5">
                  {defectCodes.map((d) => (
                    <div key={d.code} className="flex items-start justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                      <div className="flex items-start gap-2 min-w-0">
                        <Badge variant="outline" className="font-mono text-[9px] shrink-0">{d.code}</Badge>
                        <p className="text-xs truncate">{d.description}</p>
                      </div>
                      <Badge className={cn(
                        "text-[9px] shrink-0 ml-2",
                        d.severity === "critical" && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                        d.severity === "major" && "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                        d.severity === "minor" && "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                      )}>
                        {d.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo evidence (placeholders) */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Camera className="h-3 w-3" /> Photo Evidence (4)
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {["Carton Front", "Damage Close-up", "Serial Number", "Inner Pack"].map((label, i) => (
                    <div key={i} className="group relative aspect-square rounded-lg bg-muted/60 border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-colors cursor-pointer returns-photo-pop">
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1">
                        <ImageIcon className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary/60 transition-colors" />
                        <span className="text-[9px] text-center text-muted-foreground/80">{label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Tap a tile to view full-resolution image with annotations.</p>
              </div>

              {/* QA Checklist */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <CheckSquare className="h-3 w-3" /> QA Checklist
                </p>
                <div className="space-y-1">
                  {checklist.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/40 transition-colors">
                      <span className="text-xs">{c.label}</span>
                      {c.status === "pass" && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                      {c.status === "fail" && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                      {c.status === "n/a" && <span className="text-[9px] text-muted-foreground">N/A</span>}
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">
                    {checklist.filter((c) => c.status === "pass").length} pass · {checklist.filter((c) => c.status === "fail").length} fail · {checklist.filter((c) => c.status === "n/a").length} n/a
                  </span>
                  <span className="font-medium">
                    {checklist.filter((c) => c.status === "fail").length > 0 ? "Non-conforming" : "Conforming"}
                  </span>
                </div>
              </div>

              {/* Inspector notes */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Inspector Notes
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground italic">
                  "{item.reason === "damaged" ? "Outer carton shows crush damage consistent with carrier handling. Inner product intact but cosmetic blemishes observed on housing. Recommend resell-discount disposition." : item.reason === "quality-defect" ? "Dimensional check shows bore diameter 0.3mm below tolerance. Material composition test pending. Likely supplier batch defect — recommend quarantine of batch LOT-2024-Q2." : item.reason === "wrong-item" ? "SKU label matches RMA but contents are wrong part (similar SKU suffix). Picking error at original outbound. Process improvement: scan-verify at pack station." : "Inspection complete. Disposition set per standard operating procedure for this reason category."}"
                </p>
                <p className="text-[10px] text-muted-foreground mt-2">— {item.inspector ?? "QA Inspector"}, {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
              </div>
            </>
          )}

          {/* ── RECOVERY TAB ─────────────────────────────────────────── */}
          {selectedTab === "recovery" && (
            <>
              {/* Financial breakdown */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Financial Breakdown
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Gross Item Value</span>
                    <span className="font-medium text-number">₹{item.value.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Recovery ({disposition.recovery}%)</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400 text-number">+₹{recoveredValue.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Transport Cost</span>
                    <span className="font-medium text-red-600 dark:text-red-400 text-number">−₹{Math.round(item.value * 0.03).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Inspection Cost</span>
                    <span className="font-medium text-red-600 dark:text-red-400 text-number">−₹{Math.round(item.value * 0.01).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Disposal Cost</span>
                    <span className="font-medium text-red-600 dark:text-red-400 text-number">−₹{(item.disposition === "dispose" ? Math.round(item.value * 0.05) : Math.round(item.value * 0.02)).toLocaleString("en-IN")}</span>
                  </div>
                  <Separator className="my-1.5" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Net Financial Impact</span>
                    <span className={cn("font-bold text-number", netImpact >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                      {netImpact >= 0 ? "+" : ""}₹{netImpact.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="mt-1">
                    <Progress
                      value={Math.max(0, (netImpact / item.value) * 100)}
                      className="h-1.5"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {((netImpact / item.value) * 100).toFixed(1)}% of gross value retained
                    </p>
                  </div>
                </div>
              </div>

              {/* Recovery breakdown donut */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Recycle className="h-3 w-3" /> Recovery Breakdown
                </p>
                <div className="flex items-center gap-3">
                  <ChartContainer config={recoveryChartConfig} className="aspect-square w-32 shrink-0">
                    <PieChart>
                      <Pie
                        data={recoveryBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={28}
                        outerRadius={48}
                        paddingAngle={2}
                        strokeWidth={0}
                      >
                        {recoveryBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="flex-1 space-y-1">
                    {recoveryBreakdown.map((b) => (
                      <div key={b.name} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-sm" style={{ background: b.color }} />
                          <span className="text-muted-foreground">{b.name}</span>
                        </span>
                        <span className="font-medium text-number">₹{b.value.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Disposition comparison */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Disposition Comparison (₹ Recovered)
                </p>
                <ChartContainer config={recoveryChartConfig} className="aspect-[16/8] w-full">
                  <BarChart data={
                    (Object.keys(dispositionConfig) as Disposition[]).map((d) => ({
                      name: dispositionConfig[d].label,
                      recovered: Math.round(item.value * dispositionConfig[d].recovery / 100),
                      color: dispositionConfig[d].pieColor,
                    }))
                  } margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={40} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="recovered" radius={[4, 4, 0, 0]}>
                      {(Object.keys(dispositionConfig) as Disposition[]).map((d, i) => (
                        <Cell key={i} fill={dispositionConfig[d].pieColor} opacity={d === item.disposition ? 1 : 0.4} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Selected disposition highlighted. Highest-recovery option shown for comparison.
                </p>
              </div>

              {/* Similar returns history */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <History className="h-3 w-3" /> Similar Returns for {item.sku} (last 90 days)
                </p>
                <div className="space-y-1">
                  {similarReturns.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/40 transition-colors returns-row-in" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] text-muted-foreground shrink-0">{s.rma}</span>
                        <Badge variant="outline" className={cn("text-[9px] shrink-0", dispositionConfig[s.disposition].color, dispositionConfig[s.disposition].bg)}>
                          {dispositionConfig[s.disposition].label}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground truncate">{s.date}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-muted-foreground text-number">₹{s.value.toLocaleString("en-IN")}</span>
                        <span className={cn("text-[10px] font-medium text-number", s.recovery >= 70 ? "text-emerald-600 dark:text-emerald-400" : s.recovery >= 35 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                          {s.recovery}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── COMMUNICATIONS TAB ──────────────────────────────────── */}
          {selectedTab === "communications" && (
            <>
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Communications ({communications.length})
                </p>
                <div className="space-y-3">
                  {communications.map((m, i) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex gap-2 returns-msg-in",
                        m.from === "warehouse" && "flex-row-reverse"
                      )}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className={cn(
                          "text-[9px]",
                          m.from === "customer" && "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
                          m.from === "warehouse" && "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
                          m.from === "system" && "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                        )}>
                          {m.from === "system" ? "WMS" : m.author.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "max-w-[78%] rounded-lg p-2",
                        m.from === "customer" && "bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50",
                        m.from === "warehouse" && "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50",
                        m.from === "system" && "bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50"
                      )}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-medium">{m.author}</span>
                          <span className="text-[9px] text-muted-foreground">{m.time}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{m.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick reply */}
              <div className="rounded-xl border bg-card p-3 returns-card-enter">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Quick Reply</p>
                <div className="flex gap-2">
                  <Input placeholder="Type a message to customer..." className="h-8 text-xs" />
                  <Button size="sm" className="h-8 px-3 shrink-0">
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {["Pickup confirmed", "Inspection complete", "Credit memo issued", "Need more info"].map((q) => (
                    <button
                      key={q}
                      className="text-[10px] rounded-full border bg-muted/40 px-2 py-0.5 hover:bg-muted/60 transition-colors"
                      onClick={() => toast.info("Quick reply", `Sent: "${q}"`)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── TIMELINE TAB ─────────────────────────────────────────── */}
          {selectedTab === "timeline" && (
            <div className="rounded-xl border bg-card p-3 returns-card-enter">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1">
                <History className="h-3 w-3" /> RMA Lifecycle Timeline
              </p>
              <ol className="relative border-l-2 border-muted ml-3 space-y-3">
                {timeline.map((e, i) => {
                  const dotColor =
                    e.kind === "initiated" ? "bg-blue-500" :
                    e.kind === "pickup" ? "bg-cyan-500" :
                    e.kind === "transit" ? "bg-blue-500" :
                    e.kind === "received" ? "bg-violet-500" :
                    e.kind === "inspection" ? "bg-amber-500" :
                    e.kind === "decision" ? "bg-orange-500" :
                    "bg-emerald-500"
                  const icon =
                    e.kind === "initiated" ? Sparkles :
                    e.kind === "pickup" ? Truck :
                    e.kind === "transit" ? Truck :
                    e.kind === "received" ? Package :
                    e.kind === "inspection" ? ClipboardCheck :
                    e.kind === "decision" ? CheckCircle2 :
                    CheckCircle2
                  const EventIcon = icon
                  return (
                    <li
                      key={e.id}
                      className="ml-4 space-y-1 returns-timeline-in"
                      style={{ animationDelay: `${i * 70}ms` }}
                    >
                      <span className={cn(
                        "absolute -left-[9px] mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background text-white",
                        dotColor
                      )}>
                        <EventIcon className="h-2 w-2" />
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium">{e.title}</p>
                        <p className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(e.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{e.detail}</p>
                      <p className="text-[10px] text-muted-foreground/70">— {e.actor}</p>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handlePrint}>
            <Printer className="h-3.5 w-3.5" />
            Label
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleContact}>
            <Phone className="h-3.5 w-3.5" />
            Call
          </Button>
          {item.status === "inspection" && (
            <>
              <Button variant="destructive" size="sm" className="flex-1 gap-1.5" onClick={handleReject}>
                <ThumbsDown className="h-3.5 w-3.5" />
                Reject
              </Button>
              <Button size="sm" className="flex-1 gap-1.5" onClick={handleApprove}>
                <ThumbsUp className="h-3.5 w-3.5" />
                Approve
              </Button>
            </>
          )}
          {item.status !== "inspection" && (
            <Button size="sm" className="flex-1 gap-1.5" onClick={handleApprove}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Acknowledge
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
