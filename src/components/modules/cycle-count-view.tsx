"use client"

import { useState, useMemo } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis,
} from "recharts"
import {
  ClipboardCheck, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, ArrowUpRight, ArrowDownRight, Eye, X, Package, Clock,
  ShieldCheck, Target, Layers, Scale, FileCheck, RefreshCw, Ban,
  ChevronRight, Star, Timer, MapPin, User, ArrowRight, Fingerprint,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Seed-based data generation
// ────────────────────────────────────────────────────────
function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(131131)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"] as const
const WH_SHORT = ["MUM", "DEL", "CHE", "KOL", "BLR", "PUN"] as const

const COUNT_TYPES = ["Full Count", "Spot Count", "ABC Triggered", "Recount", "Blind Count", "Negative Stock Audit"] as const
const COUNT_STATUSES = ["Scheduled", "In Progress", "Completed", "Paused", "Cancelled", "Pending Approval"] as const
const ABC_CLASSES = ["A - High Value", "B - Medium Value", "C - Low Value"] as const
const VARIANCE_REASONS = ["Theft/Shrinkage", "Data Entry Error", "Damaged/Expired", "Receiving Discrepancy", "Pick Error", "Putaway Error", "Unit of Measure Error", "System Glitch", "Unreported Transfer", "Supplier Short Ship"] as const
const ZONES = ["Zone A - Bulk", "Zone B - Picking", "Zone C - Receiving", "Zone D - Shipping", "Zone E - Returns", "Zone F - Cold Storage", "Zone G - Hazmat", "Zone H - High Value"] as const
const ADJUST_TYPES = ["Quantity Increase", "Quantity Decrease", "Location Correction", "Batch Correction", "Status Change", "Write-off"] as const
const ADJUST_STATUSES = ["Approved", "Pending", "Rejected", "Escalated"] as const

const PRODUCTS = [
  { sku: "F&B-1001", name: "Basmati Rice 25kg", cat: "Food", value: 2450 },
  { sku: "F&B-1002", name: "Turmeric Powder 500g", cat: "Food", value: 180 },
  { sku: "F&B-1003", name: "Organic Tea 1kg", cat: "Food", value: 1250 },
  { sku: "F&B-1006", name: "Ghee Tin 15kg", cat: "Food", value: 4800 },
  { sku: "F&B-1010", name: "Mustard Oil 5L", cat: "Food", value: 920 },
  { sku: "PHR-2001", name: "Paracetamol 500mg", cat: "Pharma", value: 350 },
  { sku: "PHR-2004", name: "ORS Sachets 100pc", cat: "Pharma", value: 780 },
  { sku: "PHR-2005", name: "Chyawanprash 500g", cat: "Pharma", value: 560 },
  { sku: "PHR-2007", name: "Cough Syrup 200ml", cat: "Pharma", value: 290 },
  { sku: "ELC-3001", name: "LED Panel 2x2ft", cat: "Electronics", value: 3200 },
  { sku: "ELC-3005", name: "Power Bank 20000mAh", cat: "Electronics", value: 1800 },
  { sku: "ELC-3006", name: "WiFi Router Dual Band", cat: "Electronics", value: 2400 },
  { sku: "AUT-4002", name: "Brake Pad Set", cat: "Auto Parts", value: 4500 },
  { sku: "AUT-4003", name: "Engine Oil 5L", cat: "Auto Parts", value: 1650 },
  { sku: "IND-5001", name: "Hex Bolt M12x40", cat: "Industrial", value: 85 },
  { sku: "IND-5003", name: "PVC Pipe 4in", cat: "Industrial", value: 420 },
  { sku: "IND-5006", name: "Electrical Cable 2.5mm", cat: "Industrial", value: 680 },
  { sku: "TXT-6001", name: "Cotton Fabric Roll", cat: "Textile", value: 5800 },
  { sku: "TXT-6004", name: "Denim Fabric 50m", cat: "Textile", value: 8900 },
  { sku: "TXT-6005", name: "Jute Bag Pack 100pc", cat: "Textile", value: 340 },
]

const COUNTERS = [
  { id: "CNT-01", name: "Rajesh Kumar", wh: "Mumbai Hub", cert: "L1 Certified" },
  { id: "CNT-02", name: "Priya Sharma", wh: "Delhi NCR", cert: "L2 Certified" },
  { id: "CNT-03", name: "Arun Patel", wh: "Chennai DC", cert: "L1 Certified" },
  { id: "CNT-04", name: "Sunita Devi", wh: "Kolkata Hub", cert: "L3 Expert" },
  { id: "CNT-05", name: "Vikram Singh", wh: "Bangalore South", cert: "L2 Certified" },
  { id: "CNT-06", name: "Meena Kumari", wh: "Pune West", cert: "L1 Certified" },
  { id: "CNT-07", name: "Amit Joshi", wh: "Mumbai Hub", cert: "L2 Certified" },
  { id: "CNT-08", name: "Kavitha Nair", wh: "Delhi NCR", cert: "L3 Expert" },
  { id: "CNT-09", name: "Suresh Reddy", wh: "Chennai DC", cert: "L1 Certified" },
  { id: "CNT-10", name: "Deepa Iyer", wh: "Bangalore South", cert: "L2 Certified" },
]

const SUPERVISORS = ["Vikram Malhotra", "Neha Gupta", "Rajiv Menon", "Ananya Das", "Prakash Kulkarni", "Lakshmi Iyer"] as const

const PIE_COLORS = ["#14b8a6", "#f97316", "#8b5cf6", "#ef4444", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"]
const RADAR_COLORS = ["#14b8a6", "#f97316", "#8b5cf6", "#ef4444", "#06b6d4", "#10b981"]

const MONTHS = ["Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26"]

// ─────────────────────────────────────────────────────────────────────────────
// Generate Mock Data
// ─────────────────────────────────────────────────────────────────────────────

// Count Schedules (120 records)
const countSchedules: Array<{
  id: string; type: string; status: string; abcClass: string;
  warehouse: string; zone: string; counter: typeof COUNTERS[0];
  supervisor: string; sku: typeof PRODUCTS[0]; location: string;
  systemQty: number; countedQty: number; variance: number; variancePct: number;
  scheduledDate: string; completedDate: string | null; duration: string | null;
  recountCount: number; reason: string | null; priority: string; notes: string;
}> = (() => {
  const result: typeof countSchedules = []
  for (let i = 0; i < 120; i++) {
    const product = pick(PRODUCTS)
    const sysQty = Math.floor(rand() * 500) + 10
    const vPct = (rand() - 0.5) * 12
    const countedQty = Math.max(0, Math.floor(sysQty * (1 + vPct / 100)))
    const variance = countedQty - sysQty
    const status = pick(COUNT_STATUSES)
    const abcClass = pick(ABC_CLASSES)
    const type = pick(COUNT_TYPES)
    const warehouse = pick(WAREHOUSES)
    const zone = pick(ZONES)
    const counter = pick(COUNTERS)
    const supervisor = pick(SUPERVISORS)
    const aisle = String.fromCharCode(65 + Math.floor(rand() * 8))
    const rack = String(Math.floor(rand() * 20) + 1).padStart(2, "0")
    const shelf = String(Math.floor(rand() * 6) + 1)
    const location = `${aisle}-${rack}-${shelf}`
    const priority = abcClass.startsWith("A") ? (rand() > 0.3 ? "High" : "Critical") : abcClass.startsWith("B") ? "Medium" : "Low"
    const day = String(Math.floor(rand() * 28) + 1).padStart(2, "0")
    const month = String(Math.floor(rand() * 6) + 7).padStart(2, "0")
    const scheduledDate = `2026-${month}-${day}`
    const isDone = status === "Completed" || status === "Pending Approval"
    const completedDate = isDone ? scheduledDate : null
    const dur = isDone ? `${Math.floor(rand() * 45) + 10}min` : null
    result.push({
      id: `CC-${String(i + 1).padStart(4, "0")}`,
      type, status, abcClass, warehouse, zone,
      counter, supervisor, sku: product, location,
      systemQty: sysQty, countedQty, variance, variancePct: Math.abs(vPct),
      scheduledDate, completedDate, duration: dur,
      recountCount: Math.floor(rand() * 3),
      reason: variance !== 0 ? pick(VARIANCE_REASONS) : null,
      priority,
      notes: variance !== 0 ? `${Math.abs(variance)} units ${variance > 0 ? "over" : "under"} system count` : "Count matched system",
    })
  }
  return result
})()

// Adjustment History (80 records)
const adjustments: Array<{
  id: string; countId: string; sku: typeof PRODUCTS[0];
  warehouse: string; zone: string; location: string;
  type: string; status: string; reason: string;
  systemQty: number; adjustedQty: number; diff: number;
  financialImpact: number; approver: string;
  requestedBy: typeof COUNTERS[0]; requestDate: string; approvalDate: string | null;
  batchNo: string; expiryDate: string | null;
}> = (() => {
  const result: typeof adjustments = []
  for (let i = 0; i < 80; i++) {
    const product = pick(PRODUCTS)
    const sysQty = Math.floor(rand() * 400) + 20
    const diff = Math.floor((rand() - 0.4) * 50)
    const adjustedQty = Math.max(0, sysQty + diff)
    const status = pick(ADJUST_STATUSES)
    const warehouse = pick(WAREHOUSES)
    const zone = pick(ZONES)
    const aisle = String.fromCharCode(65 + Math.floor(rand() * 8))
    const rack = String(Math.floor(rand() * 20) + 1).padStart(2, "0")
    const shelf = String(Math.floor(rand() * 6) + 1)
    const day = String(Math.floor(rand() * 28) + 1).padStart(2, "0")
    const month = String(Math.floor(rand() * 6) + 7).padStart(2, "0")
    result.push({
      id: `ADJ-${String(i + 1).padStart(4, "0")}`,
      countId: `CC-${String(Math.floor(rand() * 120) + 1).padStart(4, "0")}`,
      sku: product, warehouse, zone,
      location: `${aisle}-${rack}-${shelf}`,
      type: pick(ADJUST_TYPES), status, reason: pick(VARIANCE_REASONS),
      systemQty: sysQty, adjustedQty, diff,
      financialImpact: Math.abs(diff) * product.value,
      approver: pick(SUPERVISORS),
      requestedBy: pick(COUNTERS),
      requestDate: `2026-${month}-${day}`,
      approvalDate: status === "Approved" || status === "Rejected" ? `2026-${month}-${day}` : null,
      batchNo: `BATCH-${String(Math.floor(rand() * 9000) + 1000)}`,
      expiryDate: product.cat === "Food" || product.cat === "Pharma" ? `2027-${month}-${day}` : null,
    })
  }
  return result
})()

// Monthly trend data
const monthlyTrend = MONTHS.map((m) => ({
  month: m,
  counts: Math.floor(rand() * 80) + 60,
  variances: Math.floor(rand() * 25) + 5,
  adjustments: Math.floor(rand() * 18) + 3,
  accuracy: Math.floor(rand() * 8) + 91,
}))

// Counter performance data
const counterPerf = COUNTERS.map((c) => ({
  ...c,
  totalCounts: Math.floor(rand() * 200) + 50,
  accuracy: Math.floor(rand() * 8) + 92,
  avgTime: Math.floor(rand() * 20) + 8,
  variances: Math.floor(rand() * 15) + 2,
  speed: Math.floor(rand() * 30) + 70,
  thoroughness: Math.floor(rand() * 15) + 83,
}))

// ABC distribution data
const abcDist = MONTHS.map((m) => ({
  month: m,
  classA: Math.floor(rand() * 30) + 20,
  classB: Math.floor(rand() * 25) + 15,
  classC: Math.floor(rand() * 20) + 10,
}))

// Warehouse accuracy data
const whAccuracy = WAREHOUSES.map((wh) => ({
  warehouse: wh,
  accuracy: Math.floor(rand() * 6) + 94,
  onTime: Math.floor(rand() * 8) + 90,
  varianceRate: +(rand() * 5 + 1).toFixed(1),
  avgCountTime: Math.floor(rand() * 15) + 10,
  adjustments: Math.floor(rand() * 15) + 3,
}))

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function KpiCard({ title, value, icon: Icon, colorClass, subtitle }: {
  title: string; value: string; icon: React.ElementType; colorClass: string; subtitle?: string
}) {
  return (
    <Card className={cn("cc-kpi-card", colorClass)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-70 mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
          </div>
          <Icon className="h-5 w-5 opacity-50" />
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    "Scheduled": "cc-badge-scheduled",
    "In Progress": "cc-badge-progress",
    "Completed": "cc-badge-completed",
    "Paused": "cc-badge-paused",
    "Cancelled": "cc-badge-cancelled",
    "Pending Approval": "cc-badge-approval",
    "Approved": "cc-badge-completed",
    "Pending": "cc-badge-approval",
    "Rejected": "cc-badge-rejected",
    "Escalated": "cc-badge-escalated",
  }
  return <Badge className={cn("cc-badge", cls[status] || "cc-badge-scheduled")}>{status}</Badge>
}

function AbcBadge({ cls: abc }: { cls: string }) {
  const badgeCls: Record<string, string> = {
    "A - High Value": "cc-badge-abc-a",
    "B - Medium Value": "cc-badge-abc-b",
    "C - Low Value": "cc-badge-abc-c",
  }
  return <Badge className={cn("cc-badge", badgeCls[abc] || "cc-badge-abc-c")}>{abc.split(" - ")[0]}</Badge>
}

function TypeBadge({ type }: { type: string }) {
  const badgeCls: Record<string, string> = {
    "Full Count": "cc-badge-full",
    "Spot Count": "cc-badge-spot",
    "ABC Triggered": "cc-badge-abc-trigger",
    "Recount": "cc-badge-recount",
    "Blind Count": "cc-badge-blind",
    "Negative Stock Audit": "cc-badge-neg-audit",
    "Quantity Increase": "cc-badge-inc",
    "Quantity Decrease": "cc-badge-dec",
    "Location Correction": "cc-badge-loc",
    "Batch Correction": "cc-badge-batch",
    "Status Change": "cc-badge-status-chg",
    "Write-off": "cc-badge-writeoff",
  }
  return <Badge className={cn("cc-badge", badgeCls[type] || "cc-badge-scheduled")}>{type.length > 18 ? type.substring(0, 18) + "..." : type}</Badge>
}

function PriorityBadge({ priority }: { priority: string }) {
  const cls: Record<string, string> = { "Critical": "cc-badge-critical", "High": "cc-badge-high", "Medium": "cc-badge-medium", "Low": "cc-badge-low" }
  return <Badge className={cn("cc-badge", cls[priority] || "cc-badge-low")}>{priority}</Badge>
}

function MiniBar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="cc-mini-bar">
      <div className={cn("cc-mini-bar-fill", colorClass)} style={{ width: `${pct}%` }} />
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cn("h-3.5 w-3.5", s <= rating ? "cc-star-filled" : "cc-star-empty")} />
      ))}
    </div>
  )
}

function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="cc-drawer-overlay" onClick={onClose}>
      <div className="cc-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <button className="cc-drawer-close" onClick={onClose}><X className="h-4 w-4" /></button>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function CycleCountView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [scheduleSearch, setScheduleSearch] = useState("")
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState("All")
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState("All")
  const [execSearch, setExecSearch] = useState("")
  const [varianceSearch, setVarianceSearch] = useState("")
  const [adjSearch, setAdjSearch] = useState("")
  const [adjStatusFilter, setAdjStatusFilter] = useState("All")
  const [selectedCount, setSelectedCount] = useState<typeof countSchedules[0] | null>(null)
  const [selectedAdj, setSelectedAdj] = useState<typeof adjustments[0] | null>(null)

  const filteredSchedules = useMemo(() => {
    return countSchedules.filter((s) => {
      const q = scheduleSearch.toLowerCase()
      const matchSearch = !q || s.id.toLowerCase().includes(q) || s.sku.sku.toLowerCase().includes(q)
        || s.sku.name.toLowerCase().includes(q) || s.warehouse.toLowerCase().includes(q) || s.counter.name.toLowerCase().includes(q)
      const matchStatus = scheduleStatusFilter === "All" || s.status === scheduleStatusFilter
      const matchType = scheduleTypeFilter === "All" || s.type === scheduleTypeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [scheduleSearch, scheduleStatusFilter, scheduleTypeFilter])

  const filteredExec = useMemo(() => {
    const q = execSearch.toLowerCase()
    return countSchedules.filter((s) => s.status === "In Progress" || s.status === "Paused").filter((s) => {
      return !q || s.id.toLowerCase().includes(q) || s.sku.sku.toLowerCase().includes(q)
        || s.counter.name.toLowerCase().includes(q) || s.warehouse.toLowerCase().includes(q)
    })
  }, [execSearch])

  const filteredVariance = useMemo(() => {
    const q = varianceSearch.toLowerCase()
    return countSchedules.filter((s) => Math.abs(s.variance) > 0).filter((s) => {
      return !q || s.id.toLowerCase().includes(q) || s.sku.sku.toLowerCase().includes(q)
        || s.reason?.toLowerCase().includes(q) || s.warehouse.toLowerCase().includes(q)
    })
  }, [varianceSearch])

  const filteredAdj = useMemo(() => {
    const q = adjSearch.toLowerCase()
    return adjustments.filter((a) => {
      const matchSearch = !q || a.id.toLowerCase().includes(q) || a.sku.sku.toLowerCase().includes(q)
        || a.sku.name.toLowerCase().includes(q) || a.warehouse.toLowerCase().includes(q) || a.approver.toLowerCase().includes(q)
      const matchStatus = adjStatusFilter === "All" || a.status === adjStatusFilter
      return matchSearch && matchStatus
    })
  }, [adjSearch, adjStatusFilter])

  const inProgressCount = countSchedules.filter((s) => s.status === "In Progress").length
  const completedCount = countSchedules.filter((s) => s.status === "Completed").length
  const varianceItems = countSchedules.filter((s) => Math.abs(s.variance) > 0).length
  const totalAccuracy = Math.floor(countSchedules.filter((s) => s.status === "Completed").length
    ? (countSchedules.filter((s) => s.status === "Completed" && s.variance === 0).length
      / countSchedules.filter((s) => s.status === "Completed").length) * 100 : 96)
  const pendingApproval = countSchedules.filter((s) => s.status === "Pending Approval").length
  const totalFinancialImpact = adjustments.filter((a) => a.status === "Approved")
    .reduce((sum, a) => sum + a.financialImpact, 0)

  return (
    <div className="cc-container">
      {/* ─── Header ─── */}
      <div className="cc-header">
        <div className="cc-header-content">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-6 w-6 text-teal-400" />
            <div>
              <h1 className="cc-header-title">Cycle Count Management</h1>
              <p className="cc-header-subtitle">Inventory Accuracy & Periodic Counting across 6 Warehouses</p>
            </div>
          </div>
          <div className="cc-header-badges">
            <Badge className="cc-header-badge cc-hb-total">Total Counts: {countSchedules.length}</Badge>
            <Badge className="cc-header-badge cc-hb-active">{inProgressCount} Active</Badge>
            <Badge className="cc-header-badge cc-hb-done">{completedCount} Done</Badge>
            <Badge className="cc-header-badge cc-hb-var">{varianceItems} Variances</Badge>
            <Badge className="cc-header-badge cc-hb-pending">{pendingApproval} Pending</Badge>
          </div>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="cc-tabs">
        <TabsList className="cc-tabs-list">
          <TabsTrigger value="dashboard" className="cc-tab-trigger"><BarChart3 className="h-4 w-4 mr-1" />Dashboard</TabsTrigger>
          <TabsTrigger value="schedules" className="cc-tab-trigger"><Clock className="h-4 w-4 mr-1" />Count Schedules</TabsTrigger>
          <TabsTrigger value="execution" className="cc-tab-trigger"><Target className="h-4 w-4 mr-1" />Execution</TabsTrigger>
          <TabsTrigger value="variance" className="cc-tab-trigger"><Scale className="h-4 w-4 mr-1" />Variance Analysis</TabsTrigger>
          <TabsTrigger value="adjustments" className="cc-tab-trigger"><FileCheck className="h-4 w-4 mr-1" />Adjustments</TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: Dashboard */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "dashboard" && (
          <div className="cc-tab-content">
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {[
                { label: "Total Counts", value: String(countSchedules.length), icon: ClipboardCheck, cls: "cc-kpi-teal", subtitle: "All time" },
                { label: "In Progress", value: String(inProgressCount), icon: RefreshCw, cls: "cc-kpi-orange" },
                { label: "Accuracy Rate", value: `${totalAccuracy}%`, icon: Target, cls: "cc-kpi-violet" },
                { label: "Variances Found", value: String(varianceItems), icon: AlertTriangle, cls: "cc-kpi-red" },
                { label: "Pending Approval", value: String(pendingApproval), icon: Clock, cls: "cc-kpi-amber" },
                { label: "Financial Impact", value: `₹${(totalFinancialImpact / 1000).toFixed(0)}K`, icon: Scale, cls: "cc-kpi-teal-2" },
              ].map((kpi) => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} subtitle={kpi.subtitle} />
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Monthly Count Volume & Accuracy Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" domain={[85, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar yAxisId="left" dataKey="counts" fill="#14b8a6" radius={[3, 3, 0, 0]} name="Counts" />
                      <Bar yAxisId="left" dataKey="variances" fill="#ef4444" radius={[3, 3, 0, 0]} name="Variances" />
                      <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={2} name="Accuracy %" dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Count Type Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={COUNT_TYPES.map((t) => ({ name: t, value: countSchedules.filter((s) => s.type === t).length }))} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                        {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Warehouse Accuracy Performance</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={whAccuracy.map((w) => ({ warehouse: w.warehouse.split(" ")[0], accuracy: w.accuracy, onTime: w.onTime, speed: 100 - w.varianceRate * 5 }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="warehouse" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis domain={[80, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Accuracy %" dataKey="accuracy" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
                      <Radar name="On-Time %" dataKey="onTime" stroke="#f97316" fill="#f97316" fillOpacity={0.2} />
                      <Radar name="Speed Score" dataKey="speed" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">ABC Classification Count Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={abcDist}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" dataKey="classA" stackId="1" fill="#ef4444" stroke="#ef4444" fillOpacity={0.6} name="Class A" />
                      <Area type="monotone" dataKey="classB" stackId="1" fill="#f97316" stroke="#f97316" fillOpacity={0.6} name="Class B" />
                      <Area type="monotone" dataKey="classC" stackId="1" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.6} name="Class C" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Variance Reasons Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={VARIANCE_REASONS.map((r) => ({
                      reason: r.length > 15 ? r.substring(0, 15) + "..." : r,
                      count: countSchedules.filter((s) => s.reason === r).length,
                    })).sort((a, b) => b.count - a.count).slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="reason" tick={{ fontSize: 9 }} width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} name="Occurrences" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Counter Accuracy vs Speed</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" dataKey="avgTime" name="Avg Time (min)" tick={{ fontSize: 10 }} label={{ value: "Avg Time (min)", position: "insideBottom", offset: -5, fontSize: 10 }} />
                      <YAxis type="number" dataKey="accuracy" name="Accuracy %" domain={[88, 100]} tick={{ fontSize: 10 }} label={{ value: "Accuracy %", angle: -90, position: "insideLeft", fontSize: 10 }} />
                      <ZAxis type="number" dataKey="totalCounts" range={[40, 200]} name="Total Counts" />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value: number, name: string) => [name === "totalCounts" ? `${value} counts` : value, name]} />
                      {counterPerf.map((c, i) => (
                        <Scatter key={i} data={[{ avgTime: c.avgTime, accuracy: c.accuracy, totalCounts: c.totalCounts, name: c.name }]} fill={PIE_COLORS[i % PIE_COLORS.length]} name={c.name} />
                      ))}
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Warehouse Accuracy Table */}
            <Card className="cc-card">
              <CardHeader className="pb-2"><CardTitle className="cc-card-title">Warehouse Accuracy Summary</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="cc-table-header">
                        <TableHead className="cc-th">Warehouse</TableHead>
                        <TableHead className="cc-th">Accuracy</TableHead>
                        <TableHead className="cc-th">On-Time Rate</TableHead>
                        <TableHead className="cc-th">Variance Rate</TableHead>
                        <TableHead className="cc-th">Avg Count Time</TableHead>
                        <TableHead className="cc-th">Adjustments</TableHead>
                        <TableHead className="cc-th">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {whAccuracy.map((wh, idx) => (
                        <TableRow key={wh.warehouse} className={cn("cc-table-row", idx % 2 === 0 ? "" : "cc-table-row-alt")}>
                          <TableCell className="cc-td">
                            <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-teal-500" /><span className="text-sm">{wh.warehouse}</span></div>
                          </TableCell>
                          <TableCell className="cc-td">
                            <div className="flex items-center gap-2">
                              <MiniBar value={wh.accuracy} max={100} colorClass="cc-bar-teal" />
                              <span className="text-sm font-medium">{wh.accuracy}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="cc-td">
                            <div className="flex items-center gap-2">
                              <MiniBar value={wh.onTime} max={100} colorClass="cc-bar-orange" />
                              <span className="text-sm">{wh.onTime}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="cc-td">
                            <span className={cn("text-sm", wh.varianceRate < 3 ? "text-green-500" : wh.varianceRate < 4 ? "text-amber-500" : "text-red-500")}>
                              {wh.varianceRate}%
                            </span>
                          </TableCell>
                          <TableCell className="cc-td"><span className="text-sm">{wh.avgCountTime}min</span></TableCell>
                          <TableCell className="cc-td"><span className="text-sm">{wh.adjustments}</span></TableCell>
                          <TableCell className="cc-td">
                            <StarRating rating={wh.accuracy >= 98 ? 5 : wh.accuracy >= 96 ? 4 : wh.accuracy >= 94 ? 3 : 2} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: Count Schedules */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "schedules" && (
          <div className="cc-tab-content">
            {/* Filter Bar */}
            <div className="cc-filter-bar">
              <div className="flex items-center gap-2 cc-filter-search">
                <Search className="h-4 w-4 opacity-50" />
                <input
                  type="text"
                  placeholder="Search by ID, SKU, product, warehouse, counter..."
                  value={scheduleSearch}
                  onChange={(e) => setScheduleSearch(e.target.value)}
                  className="cc-filter-input"
                />
              </div>
              <div className="flex items-center gap-2">
                <select value={scheduleStatusFilter} onChange={(e) => setScheduleStatusFilter(e.target.value)} className="cc-filter-select">
                  <option value="All">All Statuses</option>
                  {COUNT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={scheduleTypeFilter} onChange={(e) => setScheduleTypeFilter(e.target.value)} className="cc-filter-select">
                  <option value="All">All Types</option>
                  {COUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Schedule Table */}
            <Card className="cc-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="cc-table-header">
                        <TableHead className="cc-th">Count ID</TableHead>
                        <TableHead className="cc-th">Type</TableHead>
                        <TableHead className="cc-th">ABC</TableHead>
                        <TableHead className="cc-th">Priority</TableHead>
                        <TableHead className="cc-th">Status</TableHead>
                        <TableHead className="cc-th">Product / SKU</TableHead>
                        <TableHead className="cc-th">Location</TableHead>
                        <TableHead className="cc-th">Sys Qty</TableHead>
                        <TableHead className="cc-th">Counted</TableHead>
                        <TableHead className="cc-th">Variance</TableHead>
                        <TableHead className="cc-th">Warehouse</TableHead>
                        <TableHead className="cc-th">Zone</TableHead>
                        <TableHead className="cc-th">Counter</TableHead>
                        <TableHead className="cc-th">Scheduled</TableHead>
                        <TableHead className="cc-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSchedules.slice(0, 60).map((s, idx) => (
                        <TableRow key={s.id} className={cn("cc-table-row", idx % 2 === 0 ? "" : "cc-table-row-alt")}>
                          <TableCell className="cc-td"><span className="font-mono text-xs font-medium">{s.id}</span></TableCell>
                          <TableCell className="cc-td"><TypeBadge type={s.type} /></TableCell>
                          <TableCell className="cc-td"><AbcBadge cls={s.abcClass} /></TableCell>
                          <TableCell className="cc-td"><PriorityBadge priority={s.priority} /></TableCell>
                          <TableCell className="cc-td"><StatusBadge status={s.status} /></TableCell>
                          <TableCell className="cc-td">
                            <div className="min-w-0">
                              <span className="text-xs block truncate max-w-28">{s.sku.name}</span>
                              <span className="text-xs text-gray-400 font-mono">{s.sku.sku}</span>
                            </div>
                          </TableCell>
                          <TableCell className="cc-td"><span className="font-mono text-xs">{s.location}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-sm">{s.systemQty}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-sm">{s.countedQty}</span></TableCell>
                          <TableCell className="cc-td">
                            <span className={cn("text-sm font-medium", s.variance > 0 ? "text-green-500" : s.variance < 0 ? "text-red-500" : "text-gray-400")}>
                              {s.variance > 0 ? "+" : ""}{s.variance} ({s.variancePct.toFixed(1)}%)
                            </span>
                          </TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{s.warehouse.length > 10 ? s.warehouse.substring(0, 10) + "..." : s.warehouse}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{s.zone.split(" - ")[0]}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{s.counter.name}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{s.scheduledDate}</span></TableCell>
                          <TableCell className="cc-td">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCount(s)}><Eye className="h-3.5 w-3.5" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: Execution (Active Counts) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "execution" && (
          <div className="cc-tab-content">
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "In Progress", value: String(inProgressCount), icon: RefreshCw, cls: "cc-kpi-orange" },
                { label: "Paused", value: String(countSchedules.filter((s) => s.status === "Paused").length), icon: PauseCircle, cls: "cc-kpi-amber" },
                { label: "Avg Duration", value: `${Math.floor(countSchedules.filter((s) => s.duration).length ? countSchedules.filter((s) => s.duration).reduce((a, s) => a + parseInt(s.duration || "0"), 0) / countSchedules.filter((s) => s.duration).length : 25)}min`, icon: Timer, cls: "cc-kpi-teal" },
                { label: "Active Counters", value: String(new Set(filteredExec.map((s) => s.counter.id)).size), icon: User, cls: "cc-kpi-violet" },
              ].map((kpi) => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            {/* Filter */}
            <div className="cc-filter-bar mb-4">
              <div className="flex items-center gap-2 cc-filter-search">
                <Search className="h-4 w-4 opacity-50" />
                <input type="text" placeholder="Search active counts..." value={execSearch} onChange={(e) => setExecSearch(e.target.value)} className="cc-filter-input" />
              </div>
            </div>

            {/* Active Counter Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Counter Leaderboard</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="cc-table-header">
                          <TableHead className="cc-th">#</TableHead>
                          <TableHead className="cc-th">Counter</TableHead>
                          <TableHead className="cc-th">Warehouse</TableHead>
                          <TableHead className="cc-th">Cert.</TableHead>
                          <TableHead className="cc-th">Total</TableHead>
                          <TableHead className="cc-th">Accuracy</TableHead>
                          <TableHead className="cc-th">Avg Time</TableHead>
                          <TableHead className="cc-th">Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {counterPerf.sort((a, b) => b.accuracy - a.accuracy).map((c, idx) => (
                          <TableRow key={c.id} className={cn("cc-table-row", idx % 2 === 0 ? "" : "cc-table-row-alt")}>
                            <TableCell className="cc-td">
                              <span className={cn("cc-rank-badge", idx === 0 ? "cc-rank-gold" : idx === 1 ? "cc-rank-silver" : idx === 2 ? "cc-rank-bronze" : "")}>
                                {idx + 1}
                              </span>
                            </TableCell>
                            <TableCell className="cc-td"><span className="text-sm font-medium">{c.name}</span></TableCell>
                            <TableCell className="cc-td"><span className="text-xs">{c.wh}</span></TableCell>
                            <TableCell className="cc-td"><Badge className={cn("cc-badge", c.cert === "L3 Expert" ? "cc-badge-abc-a" : c.cert === "L2 Certified" ? "cc-badge-abc-b" : "cc-badge-abc-c")}>{c.cert}</Badge></TableCell>
                            <TableCell className="cc-td"><span className="text-sm">{c.totalCounts}</span></TableCell>
                            <TableCell className="cc-td">
                              <div className="flex items-center gap-2">
                                <MiniBar value={c.accuracy} max={100} colorClass="cc-bar-teal" />
                                <span className="text-sm">{c.accuracy}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="cc-td"><span className="text-sm">{c.avgTime}min</span></TableCell>
                            <TableCell className="cc-td">
                              <StarRating rating={c.accuracy >= 98 ? 5 : c.accuracy >= 96 ? 4 : c.accuracy >= 93 ? 3 : 2} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Counter Speed vs Thoroughness</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" dataKey="speed" name="Speed Score" domain={[60, 100]} tick={{ fontSize: 10 }} label={{ value: "Speed Score", position: "insideBottom", offset: -5, fontSize: 10 }} />
                      <YAxis type="number" dataKey="thoroughness" name="Thoroughness" domain={[78, 100]} tick={{ fontSize: 10 }} label={{ value: "Thoroughness %", angle: -90, position: "insideLeft", fontSize: 10 }} />
                      <ZAxis type="number" dataKey="totalCounts" range={[30, 150]} name="Total Counts" />
                      <Tooltip formatter={(value: number, name: string) => [name === "totalCounts" ? `${value} counts` : value, name]} />
                      {counterPerf.map((c, i) => (
                        <Scatter key={i} data={[{ speed: c.speed, thoroughness: c.thoroughness, totalCounts: c.totalCounts, name: c.name }]} fill={PIE_COLORS[i % PIE_COLORS.length]} name={c.name} />
                      ))}
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Active Count Cards */}
            <Card className="cc-card">
              <CardHeader className="pb-2"><CardTitle className="cc-card-title">Active & Paused Counts</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="cc-table-header">
                        <TableHead className="cc-th">Count ID</TableHead>
                        <TableHead className="cc-th">Status</TableHead>
                        <TableHead className="cc-th">Product / SKU</TableHead>
                        <TableHead className="cc-th">Location</TableHead>
                        <TableHead className="cc-th">Counter</TableHead>
                        <TableHead className="cc-th">Warehouse</TableHead>
                        <TableHead className="cc-th">Zone</TableHead>
                        <TableHead className="cc-th">Sys Qty</TableHead>
                        <TableHead className="cc-th">Counted</TableHead>
                        <TableHead className="cc-th">Recounts</TableHead>
                        <TableHead className="cc-th">Notes</TableHead>
                        <TableHead className="cc-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExec.slice(0, 40).map((s, idx) => (
                        <TableRow key={s.id} className={cn("cc-table-row", idx % 2 === 0 ? "" : "cc-table-row-alt", s.status === "In Progress" ? "cc-row-active" : "")}>
                          <TableCell className="cc-td"><span className="font-mono text-xs font-medium">{s.id}</span></TableCell>
                          <TableCell className="cc-td"><StatusBadge status={s.status} /></TableCell>
                          <TableCell className="cc-td">
                            <div className="min-w-0">
                              <span className="text-xs block truncate max-w-28">{s.sku.name}</span>
                              <span className="text-xs text-gray-400 font-mono">{s.sku.sku}</span>
                            </div>
                          </TableCell>
                          <TableCell className="cc-td"><span className="font-mono text-xs">{s.location}</span></TableCell>
                          <TableCell className="cc-td">
                            <div className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-teal-500" /><span className="text-xs">{s.counter.name}</span></div>
                          </TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{s.warehouse.length > 10 ? s.warehouse.substring(0, 10) + "..." : s.warehouse}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{s.zone.split(" - ")[0]}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-sm">{s.systemQty}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-sm font-medium">{s.countedQty}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-sm">{s.recountCount}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-xs max-w-40 truncate block">{s.notes}</span></TableCell>
                          <TableCell className="cc-td">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCount(s)}><Eye className="h-3.5 w-3.5" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: Variance Analysis */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "variance" && (
          <div className="cc-tab-content">
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Variances", value: String(varianceItems), icon: AlertTriangle, cls: "cc-kpi-red" },
                { label: "Over-counted", value: String(countSchedules.filter((s) => s.variance > 0).length), icon: ArrowUpRight, cls: "cc-kpi-teal" },
                { label: "Under-counted", value: String(countSchedules.filter((s) => s.variance < 0).length), icon: ArrowDownRight, cls: "cc-kpi-orange" },
                { label: "Avg Variance %", value: `${(countSchedules.filter((s) => s.variance !== 0).reduce((a, s) => a + s.variancePct, 0) / Math.max(1, varianceItems)).toFixed(1)}%`, icon: Scale, cls: "cc-kpi-violet" },
              ].map((kpi) => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Monthly Variance Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="variances" fill="#f97316" radius={[3, 3, 0, 0]} name="Variances" />
                      <Line type="monotone" dataKey="adjustments" stroke="#ef4444" strokeWidth={2} name="Adjustments" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Variance by ABC Class</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={ABC_CLASSES.map((cls) => ({
                        name: cls.split(" - ")[0],
                        value: countSchedules.filter((s) => s.abcClass === cls && Math.abs(s.variance) > 0).length,
                      }))} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                        <Cell fill="#ef4444" /><Cell fill="#f97316" /><Cell fill="#8b5cf6" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Zone Variance Heatmap-style Bar */}
            <Card className="cc-card mb-6">
              <CardHeader className="pb-2"><CardTitle className="cc-card-title">Variance by Warehouse Zone</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ZONES.map((z) => ({
                    zone: z.split(" - ")[0],
                    over: countSchedules.filter((s) => s.zone === z && s.variance > 0).length,
                    under: countSchedules.filter((s) => s.zone === z && s.variance < 0).length,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="zone" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="over" fill="#14b8a6" stackId="var" name="Over-counted" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="under" fill="#ef4444" stackId="var" name="Under-counted" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Filter */}
            <div className="cc-filter-bar mb-4">
              <div className="flex items-center gap-2 cc-filter-search">
                <Search className="h-4 w-4 opacity-50" />
                <input type="text" placeholder="Search variances by ID, SKU, reason, warehouse..." value={varianceSearch} onChange={(e) => setVarianceSearch(e.target.value)} className="cc-filter-input" />
              </div>
            </div>

            {/* Variance Table */}
            <Card className="cc-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="cc-table-header">
                        <TableHead className="cc-th">Count ID</TableHead>
                        <TableHead className="cc-th">Product / SKU</TableHead>
                        <TableHead className="cc-th">ABC</TableHead>
                        <TableHead className="cc-th">Location</TableHead>
                        <TableHead className="cc-th">System Qty</TableHead>
                        <TableHead className="cc-th">Actual Qty</TableHead>
                        <TableHead className="cc-th">Variance</TableHead>
                        <TableHead className="cc-th">Var %</TableHead>
                        <TableHead className="cc-th">Reason</TableHead>
                        <TableHead className="cc-th">Warehouse</TableHead>
                        <TableHead className="cc-th">Counter</TableHead>
                        <TableHead className="cc-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVariance.slice(0, 50).map((s, idx) => (
                        <TableRow key={s.id} className={cn("cc-table-row", idx % 2 === 0 ? "" : "cc-table-row-alt", Math.abs(s.variance) > 10 ? "cc-row-high-variance" : "")}>
                          <TableCell className="cc-td"><span className="font-mono text-xs font-medium">{s.id}</span></TableCell>
                          <TableCell className="cc-td">
                            <div className="min-w-0">
                              <span className="text-xs block truncate max-w-28">{s.sku.name}</span>
                              <span className="text-xs text-gray-400 font-mono">{s.sku.sku}</span>
                            </div>
                          </TableCell>
                          <TableCell className="cc-td"><AbcBadge cls={s.abcClass} /></TableCell>
                          <TableCell className="cc-td"><span className="font-mono text-xs">{s.location}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-sm">{s.systemQty}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-sm font-medium">{s.countedQty}</span></TableCell>
                          <TableCell className="cc-td">
                            <span className={cn("text-sm font-bold", s.variance > 0 ? "text-green-500" : "text-red-500")}>
                              {s.variance > 0 ? "+" : ""}{s.variance}
                            </span>
                          </TableCell>
                          <TableCell className="cc-td">
                            <span className={cn("text-sm", s.variancePct > 5 ? "text-red-500 font-bold" : s.variancePct > 2 ? "text-amber-500" : "text-green-500")}>
                              {s.variancePct.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="cc-td"><span className="text-xs max-w-32 truncate block">{s.reason || "—"}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{s.warehouse.length > 10 ? s.warehouse.substring(0, 10) + "..." : s.warehouse}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{s.counter.name}</span></TableCell>
                          <TableCell className="cc-td">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCount(s)}><Eye className="h-3.5 w-3.5" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: Adjustments */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "adjustments" && (
          <div className="cc-tab-content">
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {[
                { label: "Total Adjustments", value: String(adjustments.length), icon: FileCheck, cls: "cc-kpi-teal" },
                { label: "Approved", value: String(adjustments.filter((a) => a.status === "Approved").length), icon: CheckCircle2, cls: "cc-kpi-teal-2" },
                { label: "Pending", value: String(adjustments.filter((a) => a.status === "Pending").length), icon: Clock, cls: "cc-kpi-orange" },
                { label: "Rejected", value: String(adjustments.filter((a) => a.status === "Rejected").length), icon: Ban, cls: "cc-kpi-red" },
                { label: "Total Impact", value: `₹${(totalFinancialImpact / 100000).toFixed(1)}L`, icon: Scale, cls: "cc-kpi-violet" },
              ].map((kpi) => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Adjustment Type Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={ADJUST_TYPES.map((t) => ({ name: t, value: adjustments.filter((a) => a.type === t).length }))} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                        {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="cc-card">
                <CardHeader className="pb-2"><CardTitle className="cc-card-title">Monthly Adjustment Trend & Value</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar yAxisId="left" dataKey="adjustments" fill="#14b8a6" radius={[3, 3, 0, 0]} name="Adjustments" />
                      <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#f97316" strokeWidth={2} name="Accuracy %" dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <div className="cc-filter-bar mb-4">
              <div className="flex items-center gap-2 cc-filter-search">
                <Search className="h-4 w-4 opacity-50" />
                <input type="text" placeholder="Search by ID, SKU, product, warehouse, approver..." value={adjSearch} onChange={(e) => setAdjSearch(e.target.value)} className="cc-filter-input" />
              </div>
              <div className="flex items-center gap-2">
                <select value={adjStatusFilter} onChange={(e) => setAdjStatusFilter(e.target.value)} className="cc-filter-select">
                  <option value="All">All Statuses</option>
                  {ADJUST_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Adjustment Table */}
            <Card className="cc-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="cc-table-header">
                        <TableHead className="cc-th">Adj. ID</TableHead>
                        <TableHead className="cc-th">Count ID</TableHead>
                        <TableHead className="cc-th">Type</TableHead>
                        <TableHead className="cc-th">Status</TableHead>
                        <TableHead className="cc-th">Product / SKU</TableHead>
                        <TableHead className="cc-th">Warehouse</TableHead>
                        <TableHead className="cc-th">Location</TableHead>
                        <TableHead className="cc-th">System</TableHead>
                        <TableHead className="cc-th">Adjusted</TableHead>
                        <TableHead className="cc-th">Diff</TableHead>
                        <TableHead className="cc-th">Impact ₹</TableHead>
                        <TableHead className="cc-th">Reason</TableHead>
                        <TableHead className="cc-th">Approver</TableHead>
                        <TableHead className="cc-th">Date</TableHead>
                        <TableHead className="cc-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAdj.slice(0, 50).map((a, idx) => (
                        <TableRow key={a.id} className={cn("cc-table-row", idx % 2 === 0 ? "" : "cc-table-row-alt", a.status === "Escalated" ? "cc-row-escalated" : "")}>
                          <TableCell className="cc-td"><span className="font-mono text-xs font-medium">{a.id}</span></TableCell>
                          <TableCell className="cc-td"><span className="font-mono text-xs text-gray-400">{a.countId}</span></TableCell>
                          <TableCell className="cc-td"><TypeBadge type={a.type} /></TableCell>
                          <TableCell className="cc-td"><StatusBadge status={a.status} /></TableCell>
                          <TableCell className="cc-td">
                            <div className="min-w-0">
                              <span className="text-xs block truncate max-w-28">{a.sku.name}</span>
                              <span className="text-xs text-gray-400 font-mono">{a.sku.sku}</span>
                            </div>
                          </TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{a.warehouse.length > 10 ? a.warehouse.substring(0, 10) + "..." : a.warehouse}</span></TableCell>
                          <TableCell className="cc-td"><span className="font-mono text-xs">{a.location}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-sm">{a.systemQty}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-sm font-medium">{a.adjustedQty}</span></TableCell>
                          <TableCell className="cc-td">
                            <span className={cn("text-sm font-bold", a.diff > 0 ? "text-green-500" : "text-red-500")}>
                              {a.diff > 0 ? "+" : ""}{a.diff}
                            </span>
                          </TableCell>
                          <TableCell className="cc-td">
                            <span className={cn("text-sm font-medium", a.financialImpact > 10000 ? "text-red-500" : a.financialImpact > 5000 ? "text-amber-500" : "text-green-500")}>
                              ₹{a.financialImpact.toLocaleString("en-IN")}
                            </span>
                          </TableCell>
                          <TableCell className="cc-td"><span className="text-xs max-w-24 truncate block">{a.reason}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{a.approver}</span></TableCell>
                          <TableCell className="cc-td"><span className="text-xs">{a.requestDate}</span></TableCell>
                          <TableCell className="cc-td">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedAdj(a)}><Eye className="h-3.5 w-3.5" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>

      {/* ─── Count Detail Drawer ─── */}
      <Drawer open={!!selectedCount} onClose={() => setSelectedCount(null)}>
        {selectedCount && (
          <div className="cc-drawer-content">
            <div className={cn("cc-drawer-status", selectedCount.status === "Completed" ? "cc-drawer-done" : selectedCount.status === "In Progress" ? "cc-drawer-active" : selectedCount.status === "Pending Approval" ? "cc-drawer-approval" : "cc-drawer-default")}>
              {selectedCount.status === "Completed" && <CheckCircle2 className="h-4 w-4" />}
              {selectedCount.status === "In Progress" && <RefreshCw className="h-4 w-4" />}
              {selectedCount.status === "Pending Approval" && <ShieldCheck className="h-4 w-4" />}
              {selectedCount.status === "Paused" && <Clock className="h-4 w-4" />}
              {selectedCount.status === "Cancelled" && <Ban className="h-4 w-4" />}
              {selectedCount.status === "Scheduled" && <Clock className="h-4 w-4" />}
              <span className="text-sm font-medium">{selectedCount.status}</span>
            </div>

            <h3 className="cc-drawer-title">{selectedCount.id}</h3>
            <p className="cc-drawer-subtitle">{selectedCount.type} — {selectedCount.abcClass}</p>

            {/* Location Visualization */}
            <div className="cc-location-viz">
              <div className="cc-location-dot cc-loc-start">
                <MapPin className="h-4 w-4" />
                <span className="text-xs">{selectedCount.warehouse}</span>
              </div>
              <div className="cc-location-line">
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
              <div className="cc-location-dot cc-loc-zone">
                <Layers className="h-4 w-4" />
                <span className="text-xs">{selectedCount.zone}</span>
              </div>
              <div className="cc-location-line">
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
              <div className="cc-location-dot cc-loc-bin">
                <Fingerprint className="h-4 w-4" />
                <span className="text-xs font-mono">{selectedCount.location}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="cc-info-grid">
              <div className="cc-info-item"><span className="cc-info-label">Product</span><span className="cc-info-value">{selectedCount.sku.name}</span></div>
              <div className="cc-info-item"><span className="cc-info-label">SKU</span><span className="cc-info-value font-mono">{selectedCount.sku.sku}</span></div>
              <div className="cc-info-item"><span className="cc-info-label">Category</span><span className="cc-info-value">{selectedCount.sku.cat}</span></div>
              <div className="cc-info-item"><span className="cc-info-label">Unit Value</span><span className="cc-info-value">₹{selectedCount.sku.value.toLocaleString("en-IN")}</span></div>
              <div className="cc-info-item"><span className="cc-info-label">Priority</span><span className="cc-info-value"><PriorityBadge priority={selectedCount.priority} /></span></div>
              <div className="cc-info-item"><span className="cc-info-label">Count Type</span><span className="cc-info-value">{selectedCount.type}</span></div>
              <div className="cc-info-item"><span className="cc-info-label">Counter</span><span className="cc-info-value">{selectedCount.counter.name} ({selectedCount.counter.cert})</span></div>
              <div className="cc-info-item"><span className="cc-info-label">Supervisor</span><span className="cc-info-value">{selectedCount.supervisor}</span></div>
            </div>

            {/* Quantity Comparison */}
            <div className="cc-qty-comparison">
              <h4 className="cc-section-heading">Quantity Comparison</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="cc-qty-box cc-qty-system">
                  <span className="cc-qty-label">System</span>
                  <span className="cc-qty-number">{selectedCount.systemQty}</span>
                </div>
                <div className="cc-qty-box cc-qty-counted">
                  <span className="cc-qty-label">Counted</span>
                  <span className="cc-qty-number">{selectedCount.countedQty}</span>
                </div>
                <div className={cn("cc-qty-box", selectedCount.variance > 0 ? "cc-qty-positive" : selectedCount.variance < 0 ? "cc-qty-negative" : "cc-qty-match")}>
                  <span className="cc-qty-label">Variance</span>
                  <span className="cc-qty-number">{selectedCount.variance > 0 ? "+" : ""}{selectedCount.variance}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="cc-timeline">
              <h4 className="cc-section-heading">Count Timeline</h4>
              <div className="cc-timeline-track">
                {["Scheduled", "Assigned", "Counting", "Verified", "Completed"].map((step, i) => {
                  const statusOrder = ["Scheduled", "In Progress", "Paused", "Pending Approval", "Completed", "Cancelled"]
                  const stepIdx = step === "Scheduled" ? 0 : step === "Assigned" ? 0.5 : step === "Counting" ? 1.5 : step === "Verified" ? 2.5 : 3.5
                  const currentIdx = selectedCount.status === "Scheduled" ? 0 : selectedCount.status === "In Progress" ? 2 : selectedCount.status === "Paused" ? 2 : selectedCount.status === "Pending Approval" ? 3 : selectedCount.status === "Completed" ? 4 : selectedCount.status === "Cancelled" ? 2 : 0
                  const isDone = stepIdx <= currentIdx
                  const isCurrent = step === "Scheduled" && selectedCount.status === "Scheduled" || step === "Counting" && selectedCount.status === "In Progress" || step === "Verified" && selectedCount.status === "Pending Approval" || step === "Completed" && selectedCount.status === "Completed"
                  return (
                    <div key={step} className="cc-timeline-step">
                      <div className={cn("cc-timeline-dot", isDone && "cc-dot-done", isCurrent && "cc-dot-current")} />
                      <span className={cn("cc-timeline-label", isDone && "cc-label-done", isCurrent && "cc-label-current")}>{step}</span>
                      {i < 4 && <div className={cn("cc-timeline-connector", isDone && "cc-connector-done")} />}
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedCount.reason && (
              <div className="cc-reason-box">
                <h4 className="cc-section-heading">Variance Reason</h4>
                <p className="cc-reason-text">{selectedCount.reason}</p>
              </div>
            )}

            <div className="cc-drawer-footer">
              <div className="cc-footer-item"><span className="cc-info-label">Scheduled</span><span className="cc-info-value">{selectedCount.scheduledDate}</span></div>
              {selectedCount.completedDate && <div className="cc-footer-item"><span className="cc-info-label">Completed</span><span className="cc-info-value">{selectedCount.completedDate}</span></div>}
              {selectedCount.duration && <div className="cc-footer-item"><span className="cc-info-label">Duration</span><span className="cc-info-value">{selectedCount.duration}</span></div>}
              <div className="cc-footer-item"><span className="cc-info-label">Recounts</span><span className="cc-info-value">{selectedCount.recountCount}</span></div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ─── Adjustment Detail Drawer ─── */}
      <Drawer open={!!selectedAdj} onClose={() => setSelectedAdj(null)}>
        {selectedAdj && (
          <div className="cc-drawer-content">
            <div className={cn("cc-drawer-status", selectedAdj.status === "Approved" ? "cc-drawer-done" : selectedAdj.status === "Pending" ? "cc-drawer-approval" : selectedAdj.status === "Rejected" ? "cc-drawer-rejected" : "cc-drawer-escalated")}>
              {selectedAdj.status === "Approved" && <CheckCircle2 className="h-4 w-4" />}
              {selectedAdj.status === "Pending" && <Clock className="h-4 w-4" />}
              {selectedAdj.status === "Rejected" && <Ban className="h-4 w-4" />}
              {selectedAdj.status === "Escalated" && <AlertTriangle className="h-4 w-4" />}
              <span className="text-sm font-medium">{selectedAdj.status}</span>
            </div>

            <h3 className="cc-drawer-title">{selectedAdj.id}</h3>
            <p className="cc-drawer-subtitle">{selectedAdj.type} — {selectedAdj.reason}</p>

            {/* Route Visualization */}
            <div className="cc-location-viz">
              <div className="cc-location-dot cc-loc-start">
                <Package className="h-4 w-4" />
                <span className="text-xs">{selectedAdj.warehouse}</span>
              </div>
              <div className="cc-location-line">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
              <div className="cc-location-dot cc-loc-zone">
                <MapPin className="h-4 w-4" />
                <span className="text-xs">{selectedAdj.zone}</span>
              </div>
              <div className="cc-location-line">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
              <div className="cc-location-dot cc-loc-bin">
                <Fingerprint className="h-4 w-4" />
                <span className="text-xs font-mono">{selectedAdj.location}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="cc-info-grid">
              <div className="cc-info-item"><span className="cc-info-label">Product</span><span className="cc-info-value">{selectedAdj.sku.name}</span></div>
              <div className="cc-info-item"><span className="cc-info-label">SKU</span><span className="cc-info-value font-mono">{selectedAdj.sku.sku}</span></div>
              <div className="cc-info-item"><span className="cc-info-label">Category</span><span className="cc-info-value">{selectedAdj.sku.cat}</span></div>
              <div className="cc-info-item"><span className="cc-info-label">Batch No.</span><span className="cc-info-value font-mono">{selectedAdj.batchNo}</span></div>
              {selectedAdj.expiryDate && <div className="cc-info-item"><span className="cc-info-label">Expiry</span><span className="cc-info-value">{selectedAdj.expiryDate}</span></div>}
              <div className="cc-info-item"><span className="cc-info-label">Unit Value</span><span className="cc-info-value">₹{selectedAdj.sku.value.toLocaleString("en-IN")}</span></div>
            </div>

            {/* Financial Impact */}
            <div className="cc-financial-impact">
              <h4 className="cc-section-heading">Financial Impact</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="cc-qty-box cc-qty-system">
                  <span className="cc-qty-label">System Qty</span>
                  <span className="cc-qty-number">{selectedAdj.systemQty}</span>
                </div>
                <div className="cc-qty-box cc-qty-counted">
                  <span className="cc-qty-label">Adjusted Qty</span>
                  <span className="cc-qty-number">{selectedAdj.adjustedQty}</span>
                </div>
                <div className={cn("cc-qty-box", selectedAdj.diff > 0 ? "cc-qty-positive" : "cc-qty-negative")}>
                  <span className="cc-qty-label">Difference</span>
                  <span className="cc-qty-number">{selectedAdj.diff > 0 ? "+" : ""}{selectedAdj.diff}</span>
                </div>
              </div>
              <div className={cn("cc-impact-banner", selectedAdj.financialImpact > 10000 ? "cc-impact-high" : "cc-impact-low")}>
                <Scale className="h-5 w-5" />
                <div>
                  <span className="cc-impact-label">Financial Impact</span>
                  <span className="cc-impact-value">₹{selectedAdj.financialImpact.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Approval Chain */}
            <div className="cc-approval-chain">
              <h4 className="cc-section-heading">Approval Chain</h4>
              <div className="cc-chain-track">
                <div className="cc-chain-step">
                  <div className="cc-chain-dot cc-dot-done" />
                  <span className="text-xs">{selectedAdj.requestedBy.name}</span>
                  <span className="text-xs text-gray-400">Requested</span>
                </div>
                <div className={cn("cc-chain-line", selectedAdj.status === "Approved" || selectedAdj.status === "Rejected" ? "cc-connector-done" : "")} />
                <div className="cc-chain-step">
                  <div className={cn("cc-chain-dot", selectedAdj.status === "Approved" ? "cc-dot-done" : selectedAdj.status === "Rejected" ? "cc-dot-rejected" : selectedAdj.status === "Escalated" ? "cc-dot-escalated" : "cc-dot-current")} />
                  <span className="text-xs">{selectedAdj.approver}</span>
                  <span className="text-xs text-gray-400">{selectedAdj.status === "Approved" ? "Approved" : selectedAdj.status === "Rejected" ? "Rejected" : selectedAdj.status === "Escalated" ? "Escalated" : "Pending"}</span>
                </div>
              </div>
            </div>

            <div className="cc-drawer-footer">
              <div className="cc-footer-item"><span className="cc-info-label">Request Date</span><span className="cc-info-value">{selectedAdj.requestDate}</span></div>
              {selectedAdj.approvalDate && <div className="cc-footer-item"><span className="cc-info-label">Approval Date</span><span className="cc-info-value">{selectedAdj.approvalDate}</span></div>}
              <div className="cc-footer-item"><span className="cc-info-label">Linked Count</span><span className="cc-info-value font-mono">{selectedAdj.countId}</span></div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

// PauseCircle icon (not in lucide-react main set)
function PauseCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="10" y1="15" x2="10" y2="9" />
      <line x1="14" y1="15" x2="14" y2="9" />
    </svg>
  )
}
