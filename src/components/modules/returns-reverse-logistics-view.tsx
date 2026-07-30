"use client"

import { useState, useMemo, useCallback } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  RotateCcw,
  Package,
  PackageX,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  Download,
  RefreshCw,
  Truck,
  MapPin,
  User,
  DollarSign,
  ChevronRight,
  ArrowRightLeft,
  Recycle,
  ShieldAlert,
  ClipboardCheck,
  Eye,
  Boxes,
  Building2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { ReturnsDetailDrawer, type ReturnDetailItem } from "@/components/shared/returns-detail-drawer"
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ============================================================================
// Types
// ============================================================================

type ReturnStatus =
  | "initiated"
  | "pickup-scheduled"
  | "in-transit"
  | "received"
  | "inspection"
  | "restocked"
  | "refurbished"
  | "disposed"
  | "rejected"

type ReturnReason =
  | "damaged"
  | "wrong-item"
  | "quality-defect"
  | "expired"
  | "customer-cancel"
  | "warranty-claim"
  | "overstock"
  | "recall"

type Disposition =
  | "restock"
  | "refurbish"
  | "resell-discount"
  | "donate"
  | "recycle"
  | "dispose"

interface ReturnRecord {
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

// ============================================================================
// Mock data — 14 returns across 6 warehouses, 5 customers, 8 reasons, 9 statuses
// ============================================================================

const returnsData: ReturnRecord[] = [
  { id: "1", rma: "RMA-2024-1101", customer: "Maruti Suzuki India", warehouse: "Gurugram Hub", sku: "BRK-PAD-4521", partName: "Brake Pad Set — Front", category: "Brakes", quantity: 24, reason: "damaged", status: "inspection", disposition: "refurbish", initiatedDate: "2024-07-22", ageDays: 4, value: 38400, inspector: "Priya S.", priority: "high" },
  { id: "2", rma: "RMA-2024-1102", customer: "Tata Motors Ltd", warehouse: "Pune DC", sku: "ENG-CYL-2231", partName: "Engine Cylinder Block", category: "Engine", quantity: 2, reason: "quality-defect", status: "received", disposition: "dispose", initiatedDate: "2024-07-19", ageDays: 7, value: 86000, inspector: "Amit M.", priority: "high" },
  { id: "3", rma: "RMA-2024-1103", customer: "Bosch Ltd", warehouse: "Bangalore Tech", sku: "SNS-PROX-1180", partName: "Proximity Sensor — 12mm", category: "Sensors", quantity: 60, reason: "wrong-item", status: "restocked", disposition: "restock", initiatedDate: "2024-07-15", ageDays: 11, value: 18000, inspector: "Sneha R.", priority: "medium" },
  { id: "4", rma: "RMA-2024-1104", customer: "Motherson Sumi Systems", warehouse: "Noida North", sku: "WIR-HAR-5520", partName: "Wiring Harness — 2.4m", category: "Electrical", quantity: 12, reason: "customer-cancel", status: "pickup-scheduled", disposition: "restock", initiatedDate: "2024-07-25", ageDays: 1, value: 7200, priority: "low" },
  { id: "5", rma: "RMA-2024-1105", customer: "Bharat Forge Ltd", warehouse: "Pune DC", sku: "FRG-CRANK-7791", partName: "Forged Crankshaft", category: "Engine", quantity: 4, reason: "warranty-claim", status: "in-transit", disposition: "refurbish", initiatedDate: "2024-07-23", ageDays: 3, value: 124000, priority: "high" },
  { id: "6", rma: "RMA-2024-1106", customer: "Maruti Suzuki India", warehouse: "Gurugram Hub", sku: "OIL-FILT-3301", partName: "Oil Filter — Spin-on", category: "Filters", quantity: 36, reason: "expired", status: "disposed", disposition: "dispose", initiatedDate: "2024-07-10", ageDays: 16, value: 5400, inspector: "Priya S.", priority: "low" },
  { id: "7", rma: "RMA-2024-1107", customer: "Uno Minda Ltd", warehouse: "Manesar West", sku: "LMP-HEAD-9920", partName: "LED Headlamp Assembly", category: "Lighting", quantity: 8, reason: "damaged", status: "inspection", disposition: "resell-discount", initiatedDate: "2024-07-21", ageDays: 5, value: 44800, inspector: "Vikram T.", priority: "high" },
  { id: "8", rma: "RMA-2024-1108", customer: "Bosch Ltd", warehouse: "Bangalore Tech", sku: "ECU-ENG-4400", partName: "Engine Control Unit", category: "Electronics", quantity: 1, reason: "quality-defect", status: "received", disposition: "dispose", initiatedDate: "2024-07-18", ageDays: 8, value: 62000, inspector: "Sneha R.", priority: "high" },
  { id: "9", rma: "RMA-2024-1109", customer: "Tata Motors Ltd", warehouse: "Pune DC", sku: "TIR-225-6017", partName: "Radial Tyre — 225/60 R17", category: "Wheels", quantity: 20, reason: "overstock", status: "restocked", disposition: "restock", initiatedDate: "2024-07-12", ageDays: 14, value: 40000, inspector: "Amit M.", priority: "low" },
  { id: "10", rma: "RMA-2024-1110", customer: "Bharat Forge Ltd", warehouse: "Chennai Hub", sku: "BLT-TIM-2244", partName: "Timing Belt — Reinforced", category: "Engine", quantity: 16, reason: "recall", status: "in-transit", disposition: "dispose", initiatedDate: "2024-07-24", ageDays: 2, value: 19200, priority: "high" },
  { id: "11", rma: "RMA-2024-1111", customer: "Motherson Sumi Systems", warehouse: "Noida North", sku: "MIR-GLS-LH-3340", partName: "Side Mirror Glass — LH", category: "Body", quantity: 24, reason: "damaged", status: "pickup-scheduled", disposition: "resell-discount", initiatedDate: "2024-07-25", ageDays: 1, value: 9600, priority: "medium" },
  { id: "12", rma: "RMA-2024-1112", customer: "Maruti Suzuki India", warehouse: "Gurugram Hub", sku: "BAT-LION-12V", partName: "Li-ion Battery 12V 60Ah", category: "Electrical", quantity: 6, reason: "warranty-claim", status: "refurbished", disposition: "refurbish", initiatedDate: "2024-07-14", ageDays: 12, value: 48000, inspector: "Priya S.", priority: "medium" },
  { id: "13", rma: "RMA-2024-1113", customer: "Uno Minda Ltd", warehouse: "Manesar West", sku: "HORN-DUAL-88", partName: "Dual-Tone Horn Set", category: "Electrical", quantity: 18, reason: "wrong-item", status: "initiated", disposition: "restock", initiatedDate: "2024-07-26", ageDays: 0, value: 10800, priority: "low" },
  { id: "14", rma: "RMA-2024-1114", customer: "Bosch Ltd", warehouse: "Bangalore Tech", sku: "PMP-FUEL-2200", partName: "Fuel Pump Module", category: "Fuel System", quantity: 5, reason: "quality-defect", status: "rejected", disposition: "dispose", initiatedDate: "2024-07-16", ageDays: 10, value: 27500, inspector: "Sneha R.", priority: "high" },
]

// ============================================================================
// Status & reason configs
// ============================================================================

const statusConfig: Record<ReturnStatus, { label: string; color: string; bg: string; border: string; icon: typeof Clock }> = {
  initiated: { label: "Initiated", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-900", border: "border-slate-300 dark:border-slate-700", icon: Clock },
  "pickup-scheduled": { label: "Pickup Scheduled", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", border: "border-blue-300 dark:border-blue-700", icon: Truck },
  "in-transit": { label: "In Transit", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", border: "border-blue-300 dark:border-blue-700", icon: Truck },
  received: { label: "Received at WH", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-950", border: "border-violet-300 dark:border-violet-700", icon: Package },
  inspection: { label: "Under Inspection", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950", border: "border-amber-300 dark:border-amber-700", icon: ClipboardCheck },
  restocked: { label: "Restocked", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950", border: "border-emerald-300 dark:border-emerald-700", icon: CheckCircle2 },
  refurbished: { label: "Refurbished", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950", border: "border-emerald-300 dark:border-emerald-700", icon: Recycle },
  disposed: { label: "Disposed", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", border: "border-red-300 dark:border-red-700", icon: PackageX },
  rejected: { label: "Rejected", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", border: "border-red-300 dark:border-red-700", icon: ShieldAlert },
}

const reasonConfig: Record<ReturnReason, { label: string; color: string; bg: string; icon: typeof AlertTriangle }> = {
  damaged: { label: "Damaged in Transit", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", icon: AlertTriangle },
  "wrong-item": { label: "Wrong Item Shipped", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-950", icon: PackageX },
  "quality-defect": { label: "Quality Defect", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", icon: ShieldAlert },
  expired: { label: "Expired / Shelf-Life", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-900", icon: Clock },
  "customer-cancel": { label: "Customer Cancellation", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950", icon: User },
  "warranty-claim": { label: "Warranty Claim", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-950", icon: ShieldAlert },
  overstock: { label: "Customer Overstock", color: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-100 dark:bg-cyan-950", icon: Boxes },
  recall: { label: "Product Recall", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950", icon: AlertTriangle },
}

const dispositionConfig: Record<Disposition, { label: string; color: string; recovery: number }> = {
  restock: { label: "Restock (full value)", color: "text-emerald-700 dark:text-emerald-300", recovery: 100 },
  refurbish: { label: "Refurbish (70% value)", color: "text-blue-700 dark:text-blue-300", recovery: 70 },
  "resell-discount": { label: "Resell @ 50% discount", color: "text-amber-700 dark:text-amber-300", recovery: 50 },
  donate: { label: "Donate (tax credit)", color: "text-violet-700 dark:text-violet-300", recovery: 35 },
  recycle: { label: "Recycle (materials)", color: "text-cyan-700 dark:text-cyan-300", recovery: 15 },
  dispose: { label: "Dispose (loss)", color: "text-red-700 dark:text-red-300", recovery: 0 },
}

// ============================================================================
// Chart configs
// ============================================================================

const trendChartConfig = {
  inbound: { label: "Inbound Returns", color: "hsl(217, 91%, 60%)" },
  processed: { label: "Processed", color: "hsl(142, 71%, 45%)" },
} satisfies ChartConfig

const recoveryChartConfig = {
  value: { label: "Recovery Value", color: "hsl(142, 71%, 45%)" },
} satisfies ChartConfig

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#ef4444"]

// ============================================================================
// Helpers
// ============================================================================

function formatCurrency(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`
}

function formatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`
  return `₹${n}`
}

// 30-day return volume trend
function get30DayTrend(): Array<{ day: string; inbound: number; processed: number }> {
  const days = 30
  const out: Array<{ day: string; inbound: number; processed: number }> = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000)
    const label = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    const weekday = d.getDay()
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.55 : 1
    const seed = (i * 7 + weekday * 11) % 13
    const inbound = Math.max(0, Math.round((6 + (seed % 8)) * weekendFactor))
    const processed = Math.max(0, Math.round(inbound * (0.78 + (seed % 5) / 20)))
    out.push({ day: label, inbound, processed })
  }
  return out
}

// ============================================================================
// Main component
// ============================================================================

export function ReturnsReverseLogisticsView() {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [reasonFilter, setReasonFilter] = useState<string>("all")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [selectedTab, setSelectedTab] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<ReturnDetailItem | null>(null)

  const openDetail = (r: typeof returnsData[0]) => {
    setDetailItem({
      id: r.id,
      rma: r.rma,
      customer: r.customer,
      warehouse: r.warehouse,
      sku: r.sku,
      partName: r.partName,
      category: r.category,
      quantity: r.quantity,
      reason: r.reason,
      status: r.status,
      disposition: r.disposition,
      initiatedDate: r.initiatedDate,
      ageDays: r.ageDays,
      value: r.value,
      inspector: r.inspector,
      priority: r.priority,
    })
    setDetailOpen(true)
  }

  const filteredReturns = useMemo(() => {
    return returnsData.filter((r) => {
      const matchSearch =
        r.rma.toLowerCase().includes(search.toLowerCase()) ||
        r.customer.toLowerCase().includes(search.toLowerCase()) ||
        r.sku.toLowerCase().includes(search.toLowerCase()) ||
        r.partName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "all" || r.status === statusFilter
      const matchReason = reasonFilter === "all" || r.reason === reasonFilter
      const matchWarehouse = warehouseFilter === "all" || r.warehouse === warehouseFilter
      const matchTab =
        selectedTab === "all" ||
        (selectedTab === "open" && !["restocked", "refurbished", "disposed", "rejected"].includes(r.status)) ||
        (selectedTab === "aging" && r.ageDays >= 7 && !["restocked", "refurbished", "disposed", "rejected"].includes(r.status)) ||
        (selectedTab === "closed" && ["restocked", "refurbished", "disposed", "rejected"].includes(r.status))
      return matchSearch && matchStatus && matchReason && matchWarehouse && matchTab
    })
  }, [search, statusFilter, reasonFilter, warehouseFilter, selectedTab])

  // KPI metrics
  const totalReturns = returnsData.length
  const openReturns = returnsData.filter((r) => !["restocked", "refurbished", "disposed", "rejected"].includes(r.status)).length
  const agingReturns = returnsData.filter((r) => r.ageDays >= 7 && !["restocked", "refurbished", "disposed", "rejected"].includes(r.status)).length
  const totalValue = returnsData.reduce((sum, r) => sum + r.value, 0)
  const recoveredValue = returnsData
    .filter((r) => ["restocked", "refurbished"].includes(r.status))
    .reduce((sum, r) => sum + (r.value * dispositionConfig[r.disposition].recovery) / 100, 0)
  const recoveryRate = totalValue > 0 ? (recoveredValue / totalValue) * 100 : 0
  const avgProcessingDays = returnsData
    .filter((r) => ["restocked", "refurbished", "disposed", "rejected"].includes(r.status))
    .reduce((sum, r, _, arr) => sum + r.ageDays / arr.length, 0)

  const trend = get30DayTrend()
  const trendInbound = trend.reduce((s, p) => s + p.inbound, 0)
  const trendProcessed = trend.reduce((s, p) => s + p.processed, 0)

  // Reason breakdown (for pie chart)
  const reasonBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    returnsData.forEach((r) => {
      counts[r.reason] = (counts[r.reason] || 0) + 1
    })
    return Object.entries(counts).map(([key, count]) => ({
      name: reasonConfig[key as ReturnReason].label,
      value: count,
      key,
    }))
  }, [])

  // Disposition breakdown (bar chart)
  const dispositionBreakdown = useMemo(() => {
    const sums: Record<string, { count: number; value: number }> = {}
    returnsData.forEach((r) => {
      if (!sums[r.disposition]) sums[r.disposition] = { count: 0, value: 0 }
      sums[r.disposition].count += 1
      sums[r.disposition].value += (r.value * dispositionConfig[r.disposition].recovery) / 100
    })
    return Object.entries(sums).map(([key, v]) => ({
      name: dispositionConfig[key as Disposition].label.split(" ")[0],
      count: v.count,
      value: Math.round(v.value),
      key,
    }))
  }, [])

  const warehouses = Array.from(new Set(returnsData.map((r) => r.warehouse)))

  const handleExport = () => {
    const rows = filteredReturns.map((r) => ({
      RMA: r.rma,
      Customer: r.customer,
      Warehouse: r.warehouse,
      SKU: r.sku,
      Part: r.partName,
      Qty: r.quantity,
      Reason: reasonConfig[r.reason].label,
      Status: statusConfig[r.status].label,
      Disposition: dispositionConfig[r.disposition].label,
      "Initiated": r.initiatedDate,
      "Age (days)": r.ageDays,
      "Value (INR)": r.value,
      Priority: r.priority,
    }))
    exportToCSV(rows, "returns-reverse-logistics")
    toast.success("Export complete", `${rows.length} returns exported to CSV.`)
  }

  const handleRefresh = () => {
    toast.info("Refreshing returns", "Syncing RMA data from WMS...")
  }

  const handleQuickAction = (action: string, rma: string) => {
    toast.success(action, `${rma}: status updated successfully.`)
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <PageHeader
        title="Returns & Reverse Logistics"
        description="Manage customer returns, RMA processing, refurbishment, and disposition workflows"
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 returns-kpi-enter">
        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                Total Returns
              </p>
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-number">{totalReturns}</p>
            <p className="text-[10px] text-muted-foreground">last 30 days</p>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Open RMAs
              </p>
              <span className="text-[9px] font-medium text-blue-600 dark:text-blue-400">
                {Math.round((openReturns / Math.max(1, totalReturns)) * 100)}%
              </span>
            </div>
            <p className="text-xl font-bold text-number text-blue-600 dark:text-blue-400">{openReturns}</p>
            <p className="text-[10px] text-muted-foreground">in workflow</p>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Aging &gt; 7d
              </p>
              <TrendingDown className="h-3 w-3 text-red-500" />
            </div>
            <p className={cn(
              "text-xl font-bold text-number",
              agingReturns > 3 && "text-red-600 dark:text-red-400",
              agingReturns > 0 && agingReturns <= 3 && "text-amber-600 dark:text-amber-400",
              agingReturns === 0 && "text-emerald-600 dark:text-emerald-400"
            )}>
              {agingReturns}
            </p>
            <p className="text-[10px] text-muted-foreground">needs attention</p>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Total Value
              </p>
            </div>
            <p className="text-base font-bold text-number">{formatINR(totalValue)}</p>
            <p className="text-[10px] text-muted-foreground">at-risk inventory</p>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Recycle className="h-3 w-3" />
                Recovery Rate
              </p>
              <span className={cn(
                "text-[9px] font-medium",
                recoveryRate >= 60 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
              )}>
                {recoveryRate >= 60 ? "Healthy" : "Below target"}
              </span>
            </div>
            <p className={cn(
              "text-xl font-bold text-number",
              recoveryRate >= 60 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            )}>
              {recoveryRate.toFixed(1)}%
            </p>
            <p className="text-[10px] text-muted-foreground">{formatINR(recoveredValue)} recovered</p>
          </CardContent>
        </Card>

        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm hover-zoom">
          <CardContent className="inner-glow glass-subtle p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <ClipboardCheck className="h-3 w-3" />
                Avg Process Time
              </p>
            </div>
            <p className="text-xl font-bold text-number">{avgProcessingDays.toFixed(1)}d</p>
            <p className="text-[10px] text-muted-foreground">closed RMAs</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 returns-chart-enter">
        {/* 30-day trend */}
        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  30-Day Returns Inbound vs Processed
                </CardTitle>
                <CardDescription className="text-[10px]">
                  {trendInbound} inbound · {trendProcessed} processed · {Math.round((trendProcessed / Math.max(1, trendInbound)) * 100)}% throughput
                </CardDescription>
              </div>
              <Badge variant="outline" className="badge-interactive text-[10px]">last 30 days</Badge>
            </div>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle pt-2">
            <ChartContainer config={trendChartConfig} className="h-[180px] w-full">
              <AreaChart data={trend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="processedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={4} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={24} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="inbound" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#inboundGrad)" />
                <Area type="monotone" dataKey="processed" stroke="hsl(142, 71%, 45%)" strokeWidth={2} fill="url(#processedGrad)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Reason breakdown pie */}
        <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Return Reasons
            </CardTitle>
            <CardDescription className="text-[10px]">distribution by count</CardDescription>
          </CardHeader>
          <CardContent className="inner-glow glass-subtle pt-2">
            <ChartContainer config={{}} className="h-[180px] w-full">
              <PieChart>
                <Pie
                  data={reasonBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={32}
                  paddingAngle={2}
                >
                  {reasonBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {reasonBreakdown.map((r, i) => (
                <div key={r.key} className="flex items-center gap-1 text-[9px]">
                  <div
                    className="h-2 w-2 rounded-sm shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-muted-foreground truncate">{r.name.split(" ")[0]}</span>
                  <span className="font-medium ml-auto">{r.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disposition recovery bar chart */}
      <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm returns-chart-enter">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                <Recycle className="h-3.5 w-3.5" />
                Disposition & Recovery Value
              </CardTitle>
              <CardDescription className="text-[10px]">
                How returned items are being processed — and how much value is recovered
              </CardDescription>
            </div>
            <Badge variant="outline" className="badge-interactive text-[10px]">
              {dispositionBreakdown.reduce((s, d) => s + d.value, 0).toLocaleString("en-IN")} recovered
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="inner-glow glass-subtle pt-2">
          <ChartContainer config={recoveryChartConfig} className="h-[160px] w-full">
            <BarChart data={dispositionBreakdown} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={50} tickFormatter={(v: number) => formatINR(v)} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => {
                      const v = typeof value === "number" ? value : Number(value) || 0
                      const count = (item?.payload as { count?: number } | undefined)?.count ?? 0
                      return (
                        <div className="text-xs">
                          <p className="font-medium">{formatCurrency(v)}</p>
                          <p className="text-muted-foreground">{count} item(s)</p>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {dispositionBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tabs + Filters + Table */}
      <Card className="hover-lift-sm rounded-xl border-border/60 shadow-sm returns-table-enter">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Package className="h-4 w-4" />
                Return Material Authorizations (RMA)
              </CardTitle>
              <CardDescription className="text-xs">
                {filteredReturns.length} of {returnsData.length} returns shown
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" className="press-scale btn-outline-animate h-7 text-xs gap-1" onClick={handleRefresh}>
                <RefreshCw className="h-3 w-3" />
                Refresh
              </Button>
              <Button size="sm" variant="outline" className="press-scale btn-outline-animate h-7 text-xs gap-1" onClick={handleExport}>
                <Download className="h-3 w-3" />
                Export
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-[11px]">All ({returnsData.length})</TabsTrigger>
              <TabsTrigger value="open" className="text-[11px]">Open ({openReturns})</TabsTrigger>
              <TabsTrigger value="aging" className="text-[11px]">Aging &gt;7d ({agingReturns})</TabsTrigger>
              <TabsTrigger value="closed" className="text-[11px]">Closed ({returnsData.length - openReturns})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search RMA, customer, SKU, part..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs w-[140px]">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="h-8 text-xs w-[150px]">
                <SelectValue placeholder="Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All reasons</SelectItem>
                {Object.entries(reasonConfig).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="h-8 text-xs w-[140px]">
                <SelectValue placeholder="Warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All warehouses</SelectItem>
                {warehouses.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border max-h-[520px] overflow-y-auto">
            <Table className="table-hover-highlight">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">RMA / Customer</TableHead>
                  <TableHead className="text-xs">SKU / Part</TableHead>
                  <TableHead className="text-xs text-right">Qty</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Reason</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Disposition</TableHead>
                  <TableHead className="text-xs text-right hidden md:table-cell">Value</TableHead>
                  <TableHead className="text-xs text-right hidden lg:table-cell">Age</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((r) => {
                  const StatusIcon = statusConfig[r.status].icon
                  const ReasonIcon = reasonConfig[r.reason].icon
                  return (
                    <TableRow key={r.id} className="cursor-pointer hover:bg-accent/40 transition-colors returns-row-in" onClick={() => openDetail(r)}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-semibold">{r.rma}</span>
                            {r.priority === "high" && (
                              <Badge className="badge-interactive text-[9px] h-4 px-1 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                HIGH
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Building2 className="h-2.5 w-2.5" />
                            {r.customer}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            {r.warehouse}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{r.partName}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{r.sku}</span>
                          <Badge variant="outline" className="badge-interactive text-[9px] h-4 w-fit mt-0.5">{r.category}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs font-semibold text-number">{r.quantity}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={cn("text-[10px] gap-1", reasonConfig[r.reason].bg, reasonConfig[r.reason].color, "border-0")}>
                          <ReasonIcon className="h-2.5 w-2.5" />
                          {reasonConfig[r.reason].label.split(" ")[0]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                          statusConfig[r.status].bg,
                          statusConfig[r.status].color,
                          statusConfig[r.status].border
                        )}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {statusConfig[r.status].label}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-medium">{dispositionConfig[r.disposition].label}</span>
                          <div className="flex items-center gap-1">
                            <Progress value={dispositionConfig[r.disposition].recovery} className="h-1 w-16" />
                            <span className={cn(
                              "text-[9px] font-medium",
                              dispositionConfig[r.disposition].recovery === 100 && "text-emerald-600 dark:text-emerald-400",
                              dispositionConfig[r.disposition].recovery >= 50 && dispositionConfig[r.disposition].recovery < 100 && "text-amber-600 dark:text-amber-400",
                              dispositionConfig[r.disposition].recovery < 50 && "text-red-600 dark:text-red-400"
                            )}>
                              {dispositionConfig[r.disposition].recovery}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        <span className="text-xs font-semibold text-number">{formatINR(r.value)}</span>
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        <span className={cn(
                          "text-xs font-medium text-number",
                          r.ageDays >= 7 && "text-red-600 dark:text-red-400",
                          r.ageDays >= 3 && r.ageDays < 7 && "text-amber-600 dark:text-amber-400",
                          r.ageDays < 3 && "text-emerald-600 dark:text-emerald-400"
                        )}>
                          {r.ageDays}d
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {r.status === "inspection" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] gap-1"
                              onClick={() => handleQuickAction("Inspection complete", r.rma)}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Approve
                            </Button>
                          )}
                          {r.status === "received" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] gap-1"
                              onClick={() => handleQuickAction("Inspection started", r.rma)}
                            >
                              <ClipboardCheck className="h-3 w-3" />
                              Inspect
                            </Button>
                          )}
                          {r.status === "pickup-scheduled" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] gap-1"
                              onClick={() => handleQuickAction("Pickup complete", r.rma)}
                            >
                              <Truck className="h-3 w-3" />
                              Pickup
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openDetail(r)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredReturns.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-xs text-muted-foreground">
                      No returns match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Universal detail drawer — drill-down from RMA rows */}
      <ReturnsDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        item={detailItem}
      />
    </div>
  )
}
