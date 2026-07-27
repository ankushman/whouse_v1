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
  ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts"
import {
  RotateCcw, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, ArrowUpRight, ArrowDownRight, Eye, X, Package, Clock,
  ShieldCheck, CreditCard, Receipt, MessageSquare, Warehouse,
  Truck, Star, Timer, MapPin, User, ChevronRight, ArrowRight,
  Banknote, FileWarning, ThumbsUp, ThumbsDown, RefreshCw, Undo2,
  Percent, IndianRupee,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Seed-based data generation
// ─────────────────────────────────────────────────────────────────────────────
function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(132132)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"] as const

const RETURN_REASONS = ["Defective Product", "Wrong Item Shipped", "Damaged in Transit", "Size/Fit Issue", "Color Mismatch", "Quality Below Standard", "Missing Parts", "Expired Product", "Customer Changed Mind", "Duplicate Order"] as const
const RETURN_CHANNELS = ["E-Commerce", "D2C Website", "Marketplace", "Wholesale", "Retail Store", "Phone Order"] as const
const RETURN_STATUSES = ["Received", "Inspecting", "QC Approved", "QC Rejected", "Refund Processing", "Refund Issued", "Replacement Shipped", "Closed", "Disputed"] as const
const REFUND_METHODS = ["Bank Transfer (NEFT/RTGS)", "UPI Instant", "Wallet Credit", "Store Credit", "Original Payment Method", "Cheque"] as const
const DISPOSITIONS = ["Restock to Inventory", "Liquidation", "Scrap/Destroy", "Return to Supplier", "Refurbish", "Donate", "Hold for Review"] as const
const QC_DECISIONS = ["Pass - Restock", "Pass - Refurbish", "Fail - Liquidate", "Fail - Scrap", "Fail - Return to Supplier", "Pending Inspection"] as const
const PRIORITY_LEVELS = ["Critical", "High", "Medium", "Low"] as const

const PRODUCTS = [
  { sku: "F&B-1001", name: "Basmati Rice 25kg", cat: "Food", price: 2450, margin: 18 },
  { sku: "F&B-1002", name: "Turmeric Powder 500g", cat: "Food", price: 180, margin: 35 },
  { sku: "F&B-1003", name: "Organic Tea 1kg", cat: "Food", price: 1250, margin: 42 },
  { sku: "PHR-2001", name: "Paracetamol 500mg", cat: "Pharma", price: 350, margin: 55 },
  { sku: "PHR-2004", name: "ORS Sachets 100pc", cat: "Pharma", price: 780, margin: 40 },
  { sku: "ELC-3001", name: "LED Panel 2x2ft", cat: "Electronics", price: 3200, margin: 22 },
  { sku: "ELC-3005", name: "Power Bank 20000mAh", cat: "Electronics", price: 1800, margin: 28 },
  { sku: "ELC-3006", name: "WiFi Router Dual Band", cat: "Electronics", price: 2400, margin: 25 },
  { sku: "AUT-4002", name: "Brake Pad Set", cat: "Auto Parts", price: 4500, margin: 15 },
  { sku: "TXT-6001", name: "Cotton Fabric Roll", cat: "Textile", price: 5800, margin: 30 },
  { sku: "TXT-6004", name: "Denim Fabric 50m", cat: "Textile", price: 8900, margin: 32 },
  { sku: "IND-5001", name: "Hex Bolt M12x40", cat: "Industrial", price: 85, margin: 60 },
  { sku: "F&B-1006", name: "Ghee Tin 15kg", cat: "Food", price: 4800, margin: 20 },
  { sku: "PHR-2007", name: "Cough Syrup 200ml", cat: "Pharma", price: 290, margin: 50 },
  { sku: "AUT-4003", name: "Engine Oil 5L", cat: "Auto Parts", price: 1650, margin: 18 },
  { sku: "ELC-3008", name: "Bluetooth Speaker", cat: "Electronics", price: 2200, margin: 30 },
  { sku: "TXT-6005", name: "Jute Bag Pack 100pc", cat: "Textile", price: 340, margin: 45 },
  { sku: "IND-5006", name: "Electrical Cable 2.5mm", cat: "Industrial", price: 680, margin: 38 },
]

const CUSTOMERS = [
  { id: "CUST-001", name: "Raj Mehta", city: "Mumbai", segment: "Premium" },
  { id: "CUST-002", name: "Priya Iyer", city: "Chennai", segment: "Regular" },
  { id: "CUST-003", name: "Arun Reddy", city: "Bangalore", segment: "Premium" },
  { id: "CUST-004", name: "Sunita Gupta", city: "Delhi", segment: "Regular" },
  { id: "CUST-005", name: "Vikram Singh", city: "Kolkata", segment: "Enterprise" },
  { id: "CUST-006", name: "Deepa Nair", city: "Pune", segment: "Premium" },
  { id: "CUST-007", name: "Suresh Kumar", city: "Hyderabad", segment: "Regular" },
  { id: "CUST-008", name: "Kavitha Das", city: "Mumbai", segment: "Enterprise" },
]

const PROCESSORS = [
  { id: "PROC-01", name: "Neha Sharma", role: "Returns Lead", wh: "Mumbai Hub" },
  { id: "PROC-02", name: "Rajiv Menon", role: "QC Inspector", wh: "Chennai DC" },
  { id: "PROC-03", name: "Ananya Das", role: "Returns Lead", wh: "Delhi NCR" },
  { id: "PROC-04", name: "Prakash K.", role: "QC Inspector", wh: "Bangalore South" },
  { id: "PROC-05", name: "Lakshmi Iyer", role: "Refund Analyst", wh: "Mumbai Hub" },
  { id: "PROC-06", name: "Manoj Patel", role: "Returns Lead", wh: "Kolkata Hub" },
]

const PIE_COLORS = ["#ec4899", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#14b8a6", "#f97316", "#6366f1", "#84cc16"]

const MONTHS = ["Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26"]

// ─────────────────────────────────────────────────────────────────────────────
// Generate Mock Data
// ─────────────────────────────────────────────────────────────────────────────

// Return Requests (100 records)
const returns: Array<{
  id: string; orderId: string; customer: typeof CUSTOMERS[0];
  product: typeof PRODUCTS[0]; qty: number; reason: string;
  channel: string; status: string; priority: string;
  warehouse: string; processor: typeof PROCESSORS[0] | null;
  qcDecision: string; disposition: string;
  refundMethod: string; refundAmount: number; restockValue: number;
  createdAt: string; receivedAt: string | null; qcAt: string | null; refundedAt: string | null;
  transitDays: number | null; customerFeedback: string;
  images: number; notes: string;
}> = (() => {
  const result: typeof returns = []
  for (let i = 0; i < 100; i++) {
    const product = pick(PRODUCTS)
    const customer = pick(CUSTOMERS)
    const qty = Math.floor(rand() * 5) + 1
    const status = pick(RETURN_STATUSES)
    const reason = pick(RETURN_REASONS)
    const channel = pick(RETURN_CHANNELS)
    const warehouse = pick(WAREHOUSES)
    const priority = reason === "Defective Product" || reason === "Wrong Item Shipped" ? pick(["Critical", "High"]) : pick(["Medium", "Low"])
    const processor = status !== "Received" ? pick(PROCESSORS) : null
    const qcDecision = status === "QC Approved" || status === "Refund Processing" || status === "Refund Issued" || status === "Replacement Shipped" || status === "Closed" ? pick(["Pass - Restock", "Pass - Refurbish"]) : status === "QC Rejected" || status === "Disputed" ? pick(["Fail - Liquidate", "Fail - Scrap", "Fail - Return to Supplier"]) : "Pending Inspection"
    const disposition = qcDecision.startsWith("Pass") ? pick(["Restock to Inventory", "Restock to Inventory", "Refurbish"]) : qcDecision.startsWith("Fail") ? pick(["Liquidation", "Scrap/Destroy", "Return to Supplier"]) : "Hold for Review"
    const refundMethod = status === "Refund Issued" || status === "Refund Processing" ? pick(REFUND_METHODS) : "—"
    const refundAmt = product.price * qty * (rand() > 0.3 ? 1 : rand() > 0.5 ? 0.9 : 0.8)
    const restockVal = disposition === "Restock to Inventory" ? product.price * qty * 0.7 : disposition === "Refurbish" ? product.price * qty * 0.4 : 0
    const day = String(Math.floor(rand() * 28) + 1).padStart(2, "0")
    const month = String(Math.floor(rand() * 6) + 7).padStart(2, "0")
    const createdAt = `2026-${month}-${day}`
    const isReceived = status !== "Received"
    const isQC = ["QC Approved", "QC Rejected", "Refund Processing", "Refund Issued", "Replacement Shipped", "Closed", "Disputed"].includes(status)
    const isRefunded = ["Refund Issued", "Replacement Shipped", "Closed"].includes(status)
    const feedback = pick(["Satisfied with resolution", "Slow processing", "Partial refund not acceptable", "Replacement received OK", "No response yet", "Appreciate quick refund", "Product condition mismatch"])
    result.push({
      id: `RMA-${String(i + 1).padStart(4, "0")}`,
      orderId: `ORD-${String(Math.floor(rand() * 9000) + 1000)}`,
      customer, product, qty, reason, channel, status, priority, warehouse,
      processor, qcDecision, disposition,
      refundMethod, refundAmount: Math.floor(refundAmt), restockValue: Math.floor(restockVal),
      createdAt, receivedAt: isReceived ? `2026-${month}-${day}` : null,
      qcAt: isQC ? `2026-${month}-${day}` : null,
      refundedAt: isRefunded ? `2026-${month}-${day}` : null,
      transitDays: isReceived ? Math.floor(rand() * 5) + 1 : null,
      customerFeedback: isRefunded ? feedback : "Awaiting",
      images: Math.floor(rand() * 5) + 1,
      notes: status === "Disputed" ? "Customer claims item not as described in listing" : reason === "Defective Product" ? `Defect: ${pick(["cosmetic damage", "functional failure", "missing component", "safety concern"])}` : `Standard ${reason} return`,
    })
  }
  return result
})()

// Monthly trend data
const monthlyTrend = MONTHS.map((m) => ({
  month: m,
  requests: Math.floor(rand() * 40) + 25,
  processed: Math.floor(rand() * 35) + 20,
  refundAmount: Math.floor(rand() * 200000) + 80000,
  restockValue: Math.floor(rand() * 120000) + 50000,
  avgTAT: Math.floor(rand() * 4) + 2,
  satisfaction: Math.floor(rand() * 15) + 80,
}))

// Processor performance
const procPerf = PROCESSORS.map((p) => ({
  ...p,
  processed: Math.floor(rand() * 150) + 40,
  avgTAT: Math.floor(rand() * 3) + 1,
  accuracy: Math.floor(rand() * 6) + 94,
  refunds: Math.floor(rand() * 30) + 10,
}))

// Channel distribution
const channelDist = RETURN_CHANNELS.map((ch) => ({
  channel: ch,
  returns: returns.filter((r) => r.channel === ch).length,
  avgRefund: Math.floor(returns.filter((r) => r.channel === ch).reduce((a, r) => a + r.refundAmount, 0) / Math.max(1, returns.filter((r) => r.channel === ch).length)),
}))

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function KpiCard({ title, value, icon: Icon, colorClass, subtitle }: {
  title: string; value: string; icon: React.ElementType; colorClass: string; subtitle?: string
}) {
  return (
    <Card className={cn("rp-kpi-card", colorClass)}>
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
    "Received": "rp-badge-received",
    "Inspecting": "rp-badge-inspecting",
    "QC Approved": "rp-badge-qc-pass",
    "QC Rejected": "rp-badge-qc-fail",
    "Refund Processing": "rp-badge-refund-proc",
    "Refund Issued": "rp-badge-refund-done",
    "Replacement Shipped": "rp-badge-replaced",
    "Closed": "rp-badge-closed",
    "Disputed": "rp-badge-disputed",
  }
  return <Badge className={cn("rp-badge", cls[status] || "rp-badge-received")}>{status}</Badge>
}

function ReasonBadge({ reason }: { reason: string }) {
  const cls: Record<string, string> = {
    "Defective Product": "rp-badge-defective",
    "Wrong Item Shipped": "rp-badge-wrong",
    "Damaged in Transit": "rp-badge-damaged",
    "Size/Fit Issue": "rp-badge-size",
    "Color Mismatch": "rp-badge-color",
    "Quality Below Standard": "rp-badge-quality",
    "Missing Parts": "rp-badge-missing",
    "Expired Product": "rp-badge-expired",
    "Customer Changed Mind": "rp-badge-mind",
    "Duplicate Order": "rp-badge-duplicate",
  }
  return <Badge className={cn("rp-badge", cls[reason] || "rp-badge-received")}>{reason.length > 16 ? reason.substring(0, 16) + "..." : reason}</Badge>
}

function ChannelBadge({ channel }: { channel: string }) {
  const cls: Record<string, string> = {
    "E-Commerce": "rp-badge-ecom",
    "D2C Website": "rp-badge-d2c",
    "Marketplace": "rp-badge-market",
    "Wholesale": "rp-badge-wholesale",
    "Retail Store": "rp-badge-retail",
    "Phone Order": "rp-badge-phone",
  }
  return <Badge className={cn("rp-badge", cls[channel] || "rp-badge-received")}>{channel}</Badge>
}

function PriorityBadge({ priority }: { priority: string }) {
  const cls: Record<string, string> = { "Critical": "rp-badge-critical", "High": "rp-badge-high", "Medium": "rp-badge-medium", "Low": "rp-badge-low" }
  return <Badge className={cn("rp-badge", cls[priority] || "rp-badge-low")}>{priority}</Badge>
}

function DispositionBadge({ disp }: { disp: string }) {
  const cls: Record<string, string> = {
    "Restock to Inventory": "rp-badge-restock",
    "Liquidation": "rp-badge-liquid",
    "Scrap/Destroy": "rp-badge-scrap",
    "Return to Supplier": "rp-badge-supplier-ret",
    "Refurbish": "rp-badge-refurb",
    "Donate": "rp-badge-donate",
    "Hold for Review": "rp-badge-hold",
  }
  return <Badge className={cn("rp-badge", cls[disp] || "rp-badge-hold")}>{disp.length > 14 ? disp.substring(0, 14) + "..." : disp}</Badge>
}

function MiniBar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="rp-mini-bar">
      <div className={cn("rp-mini-bar-fill", colorClass)} style={{ width: `${pct}%` }} />
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cn("h-3.5 w-3.5", s <= rating ? "rp-star-filled" : "rp-star-empty")} />
      ))}
    </div>
  )
}

function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="rp-drawer-overlay" onClick={onClose}>
      <div className="rp-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <button className="rp-drawer-close" onClick={onClose}><X className="h-4 w-4" /></button>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function ReturnsProcessingView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [returnsSearch, setReturnsSearch] = useState("")
  const [returnsStatusFilter, setReturnsStatusFilter] = useState("All")
  const [returnsChannelFilter, setReturnsChannelFilter] = useState("All")
  const [refundSearch, setRefundSearch] = useState("")
  const [refundStatusFilter, setRefundStatusFilter] = useState("All")
  const [qcSearch, setQcSearch] = useState("")
  const [selectedReturn, setSelectedReturn] = useState<typeof returns[0] | null>(null)

  const filteredReturns = useMemo(() => {
    return returns.filter((r) => {
      const q = returnsSearch.toLowerCase()
      const matchSearch = !q || r.id.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q)
        || r.product.sku.toLowerCase().includes(q) || r.product.name.toLowerCase().includes(q)
        || r.customer.name.toLowerCase().includes(q) || r.warehouse.toLowerCase().includes(q)
        || r.reason.toLowerCase().includes(q)
      const matchStatus = returnsStatusFilter === "All" || r.status === returnsStatusFilter
      const matchChannel = returnsChannelFilter === "All" || r.channel === returnsChannelFilter
      return matchSearch && matchStatus && matchChannel
    })
  }, [returnsSearch, returnsStatusFilter, returnsChannelFilter])

  const filteredRefunds = useMemo(() => {
    return returns.filter((r) => r.status === "Refund Processing" || r.status === "Refund Issued" || r.status === "Replacement Shipped" || r.status === "Closed").filter((r) => {
      const q = refundSearch.toLowerCase()
      return !q || r.id.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q)
        || r.customer.name.toLowerCase().includes(q) || r.refundMethod.toLowerCase().includes(q)
    }).filter((r) => refundStatusFilter === "All" || r.status === refundStatusFilter)
  }, [refundSearch, refundStatusFilter])

  const filteredQC = useMemo(() => {
    const q = qcSearch.toLowerCase()
    return returns.filter((r) => ["Inspecting", "QC Approved", "QC Rejected"].includes(r.status)).filter((r) => {
      return !q || r.id.toLowerCase().includes(q) || r.product.sku.toLowerCase().includes(q)
        || r.processor?.name.toLowerCase().includes(q) || r.warehouse.toLowerCase().includes(q)
    })
  }, [qcSearch])

  const totalReturns = returns.length
  const pendingQC = returns.filter((r) => r.status === "Received" || r.status === "Inspecting").length
  const totalRefunded = returns.filter((r) => r.status === "Refund Issued" || r.status === "Closed" || r.status === "Replacement Shipped").length
  const totalRefundValue = returns.filter((r) => ["Refund Issued", "Closed", "Replacement Shipped"].includes(r.status)).reduce((a, r) => a + r.refundAmount, 0)
  const totalRestockValue = returns.reduce((a, r) => a + r.restockValue, 0)
  const disputed = returns.filter((r) => r.status === "Disputed").length
  const avgTAT = monthlyTrend.reduce((a, m) => a + m.avgTAT, 0) / monthlyTrend.length

  return (
    <div className="rp-container">
      {/* ─── Header ─── */}
      <div className="rp-header">
        <div className="rp-header-content">
          <div className="flex items-center gap-3">
            <Undo2 className="h-6 w-6 text-pink-400" />
            <div>
              <h1 className="rp-header-title">Returns Processing & Refund Management</h1>
              <p className="rp-header-subtitle">End-to-end RMA, QC inspection, refund & disposition tracking</p>
            </div>
          </div>
          <div className="rp-header-badges">
            <Badge className="rp-header-badge rp-hb-total">Returns: {totalReturns}</Badge>
            <Badge className="rp-header-badge rp-hb-pending">{pendingQC} Pending QC</Badge>
            <Badge className="rp-header-badge rp-hb-refunded">{totalRefunded} Refunded</Badge>
            <Badge className="rp-header-badge rp-hb-disputed">{disputed} Disputed</Badge>
            <Badge className="rp-header-badge rp-hb-value">₹{(totalRefundValue / 1000).toFixed(0)}K Refunded</Badge>
          </div>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="rp-tabs">
        <TabsList className="rp-tabs-list">
          <TabsTrigger value="dashboard" className="rp-tab-trigger"><BarChart3 className="h-4 w-4 mr-1" />Dashboard</TabsTrigger>
          <TabsTrigger value="returns-queue" className="rp-tab-trigger"><Package className="h-4 w-4 mr-1" />Returns Queue</TabsTrigger>
          <TabsTrigger value="qc-inspection" className="rp-tab-trigger"><ShieldCheck className="h-4 w-4 mr-1" />QC Inspection</TabsTrigger>
          <TabsTrigger value="refunds" className="rp-tab-trigger"><CreditCard className="h-4 w-4 mr-1" />Refunds</TabsTrigger>
          <TabsTrigger value="analytics" className="rp-tab-trigger"><TrendingUp className="h-4 w-4 mr-1" />Analytics</TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: Dashboard */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "dashboard" && (
          <div className="rp-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {[
                { label: "Total Returns", value: String(totalReturns), icon: RotateCcw, cls: "rp-kpi-pink" },
                { label: "Pending QC", value: String(pendingQC), icon: ShieldCheck, cls: "rp-kpi-cyan" },
                { label: "Refunded", value: String(totalRefunded), icon: CreditCard, cls: "rp-kpi-green" },
                { label: "Disputed", value: String(disputed), icon: FileWarning, cls: "rp-kpi-red" },
                { label: "Refund Value", value: `₹${(totalRefundValue / 1000).toFixed(0)}K`, icon: IndianRupee, cls: "rp-kpi-amber" },
                { label: "Restock Value", value: `₹${(totalRestockValue / 1000).toFixed(0)}K`, icon: Warehouse, cls: "rp-kpi-violet" },
              ].map((kpi) => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="rp-card">
                <CardHeader className="pb-2"><CardTitle className="rp-card-title">Monthly Returns & Refund Volume</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar yAxisId="left" dataKey="requests" fill="#ec4899" radius={[3, 3, 0, 0]} name="Requests" />
                      <Bar yAxisId="left" dataKey="processed" fill="#06b6d4" radius={[3, 3, 0, 0]} name="Processed" />
                      <Line yAxisId="right" type="monotone" dataKey="avgTAT" stroke="#f59e0b" strokeWidth={2} name="Avg TAT (days)" dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rp-card">
                <CardHeader className="pb-2"><CardTitle className="rp-card-title">Return Reason Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={RETURN_REASONS.map((r) => ({ name: r.split(" ")[0], value: returns.filter((ret) => ret.reason === r).length }))} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                        {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="rp-card">
                <CardHeader className="pb-2"><CardTitle className="rp-card-title">Channel-wise Returns & Avg Refund</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={channelDist}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="channel" tick={{ fontSize: 9 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar yAxisId="left" dataKey="returns" fill="#ec4899" radius={[3, 3, 0, 0]} name="Returns" />
                      <Line yAxisId="right" type="monotone" dataKey="avgRefund" stroke="#06b6d4" strokeWidth={2} name="Avg Refund ₹" dot={{ r: 3 }} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rp-card">
                <CardHeader className="pb-2"><CardTitle className="rp-card-title">Disposition Analysis</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={DISPOSITIONS.map((d) => ({ name: d.split(" ")[0], value: returns.filter((r) => r.disposition === d).length }))} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                        <Cell fill="#10b981" /><Cell fill="#f97316" /><Cell fill="#ef4444" /><Cell fill="#8b5cf6" /><Cell fill="#06b6d4" /><Cell fill="#f59e0b" /><Cell fill="#94a3b8" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Processor Performance Table */}
            <Card className="rp-card">
              <CardHeader className="pb-2"><CardTitle className="rp-card-title">Returns Team Performance</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="rp-table-header">
                        <TableHead className="rp-th">Processor</TableHead>
                        <TableHead className="rp-th">Role</TableHead>
                        <TableHead className="rp-th">Warehouse</TableHead>
                        <TableHead className="rp-th">Processed</TableHead>
                        <TableHead className="rp-th">Refunds Issued</TableHead>
                        <TableHead className="rp-th">Accuracy</TableHead>
                        <TableHead className="rp-th">Avg TAT</TableHead>
                        <TableHead className="rp-th">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {procPerf.sort((a, b) => b.processed - a.processed).map((p, idx) => (
                        <TableRow key={p.id} className={cn("rp-table-row", idx % 2 === 0 ? "" : "rp-table-row-alt")}>
                          <TableCell className="rp-td"><div className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-pink-500" /><span className="text-sm font-medium">{p.name}</span></div></TableCell>
                          <TableCell className="rp-td"><span className="text-xs">{p.role}</span></TableCell>
                          <TableCell className="rp-td"><span className="text-xs">{p.wh}</span></TableCell>
                          <TableCell className="rp-td"><span className="text-sm font-medium">{p.processed}</span></TableCell>
                          <TableCell className="rp-td"><span className="text-sm">{p.refunds}</span></TableCell>
                          <TableCell className="rp-td">
                            <div className="flex items-center gap-2">
                              <MiniBar value={p.accuracy} max={100} colorClass="rp-bar-pink" />
                              <span className="text-sm">{p.accuracy}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="rp-td"><span className="text-sm">{p.avgTAT}d</span></TableCell>
                          <TableCell className="rp-td"><StarRating rating={p.accuracy >= 98 ? 5 : p.accuracy >= 95 ? 4 : p.accuracy >= 92 ? 3 : 2} /></TableCell>
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
        {/* TAB 2: Returns Queue */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "returns-queue" && (
          <div className="rp-tab-content">
            <div className="rp-filter-bar">
              <div className="flex items-center gap-2 rp-filter-search">
                <Search className="h-4 w-4 opacity-50" />
                <input type="text" placeholder="Search by RMA, Order, SKU, product, customer, reason..." value={returnsSearch} onChange={(e) => setReturnsSearch(e.target.value)} className="rp-filter-input" />
              </div>
              <div className="flex items-center gap-2">
                <select value={returnsStatusFilter} onChange={(e) => setReturnsStatusFilter(e.target.value)} className="rp-filter-select">
                  <option value="All">All Statuses</option>
                  {RETURN_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={returnsChannelFilter} onChange={(e) => setReturnsChannelFilter(e.target.value)} className="rp-filter-select">
                  <option value="All">All Channels</option>
                  {RETURN_CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <Card className="rp-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="rp-table-header">
                        <TableHead className="rp-th">RMA ID</TableHead>
                        <TableHead className="rp-th">Order ID</TableHead>
                        <TableHead className="rp-th">Customer</TableHead>
                        <TableHead className="rp-th">Product / SKU</TableHead>
                        <TableHead className="rp-th">Qty</TableHead>
                        <TableHead className="rp-th">Reason</TableHead>
                        <TableHead className="rp-th">Channel</TableHead>
                        <TableHead className="rp-th">Priority</TableHead>
                        <TableHead className="rp-th">Status</TableHead>
                        <TableHead className="rp-th">Refund ₹</TableHead>
                        <TableHead className="rp-th">Warehouse</TableHead>
                        <TableHead className="rp-th">Created</TableHead>
                        <TableHead className="rp-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReturns.slice(0, 60).map((r, idx) => (
                        <TableRow key={r.id} className={cn("rp-table-row", idx % 2 === 0 ? "" : "rp-table-row-alt", r.priority === "Critical" ? "rp-row-critical" : r.status === "Disputed" ? "rp-row-disputed" : "")}>
                          <TableCell className="rp-td"><span className="font-mono text-xs font-medium">{r.id}</span></TableCell>
                          <TableCell className="rp-td"><span className="font-mono text-xs text-gray-400">{r.orderId}</span></TableCell>
                          <TableCell className="rp-td">
                            <div className="min-w-0">
                              <span className="text-xs block">{r.customer.name}</span>
                              <span className="text-xs text-gray-400">{r.customer.city} · {r.customer.segment}</span>
                            </div>
                          </TableCell>
                          <TableCell className="rp-td">
                            <div className="min-w-0">
                              <span className="text-xs block truncate max-w-24">{r.product.name}</span>
                              <span className="text-xs text-gray-400 font-mono">{r.product.sku}</span>
                            </div>
                          </TableCell>
                          <TableCell className="rp-td"><span className="text-sm">{r.qty}</span></TableCell>
                          <TableCell className="rp-td"><ReasonBadge reason={r.reason} /></TableCell>
                          <TableCell className="rp-td"><ChannelBadge channel={r.channel} /></TableCell>
                          <TableCell className="rp-td"><PriorityBadge priority={r.priority} /></TableCell>
                          <TableCell className="rp-td"><StatusBadge status={r.status} /></TableCell>
                          <TableCell className="rp-td"><span className="text-sm font-medium">₹{r.refundAmount.toLocaleString("en-IN")}</span></TableCell>
                          <TableCell className="rp-td"><span className="text-xs">{r.warehouse.length > 10 ? r.warehouse.substring(0, 10) + ".." : r.warehouse}</span></TableCell>
                          <TableCell className="rp-td"><span className="text-xs">{r.createdAt}</span></TableCell>
                          <TableCell className="rp-td">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedReturn(r)}><Eye className="h-3.5 w-3.5" /></Button>
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
        {/* TAB 3: QC Inspection */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "qc-inspection" && (
          <div className="rp-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Pending Inspection", value: String(returns.filter((r) => r.status === "Received" || r.status === "Inspecting").length), icon: Search, cls: "rp-kpi-cyan" },
                { label: "QC Approved", value: String(returns.filter((r) => r.status === "QC Approved").length), icon: CheckCircle2, cls: "rp-kpi-green" },
                { label: "QC Rejected", value: String(returns.filter((r) => r.status === "QC Rejected").length), icon: X, cls: "rp-kpi-red" },
                { label: "Avg QC TAT", value: `${avgTAT.toFixed(1)}d`, icon: Timer, cls: "rp-kpi-amber" },
              ].map((kpi) => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            {/* QC Decision Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="rp-card">
                <CardHeader className="pb-2"><CardTitle className="rp-card-title">QC Decision Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={QC_DECISIONS.map((d) => ({ name: d.split(" - ")[0], value: returns.filter((r) => r.qcDecision === d).length }))} cx="50%" cy="50%" outerRadius={85} innerRadius={45} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                        <Cell fill="#10b981" /><Cell fill="#06b6d4" /><Cell fill="#f97316" /><Cell fill="#ef4444" /><Cell fill="#8b5cf6" /><Cell fill="#94a3b8" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rp-card">
                <CardHeader className="pb-2"><CardTitle className="rp-card-title">Reason vs QC Outcome</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={RETURN_REASONS.slice(0, 6).map((reason) => ({
                      reason: reason.length > 12 ? reason.substring(0, 12) + ".." : reason,
                      pass: returns.filter((r) => r.reason === reason && r.qcDecision.startsWith("Pass")).length,
                      fail: returns.filter((r) => r.reason === reason && r.qcDecision.startsWith("Fail")).length,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="reason" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="pass" fill="#10b981" name="QC Pass" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="fail" fill="#ef4444" name="QC Fail" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="rp-filter-bar mb-4">
              <div className="flex items-center gap-2 rp-filter-search">
                <Search className="h-4 w-4 opacity-50" />
                <input type="text" placeholder="Search QC items..." value={qcSearch} onChange={(e) => setQcSearch(e.target.value)} className="rp-filter-input" />
              </div>
            </div>

            <Card className="rp-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="rp-table-header">
                        <TableHead className="rp-th">RMA ID</TableHead>
                        <TableHead className="rp-th">Status</TableHead>
                        <TableHead className="rp-th">Product / SKU</TableHead>
                        <TableHead className="rp-th">Qty</TableHead>
                        <TableHead className="rp-th">Reason</TableHead>
                        <TableHead className="rp-th">QC Decision</TableHead>
                        <TableHead className="rp-th">Disposition</TableHead>
                        <TableHead className="rp-th">Processor</TableHead>
                        <TableHead className="rp-th">Warehouse</TableHead>
                        <TableHead className="rp-th">Images</TableHead>
                        <TableHead className="rp-th">Notes</TableHead>
                        <TableHead className="rp-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQC.slice(0, 40).map((r, idx) => (
                        <TableRow key={r.id} className={cn("rp-table-row", idx % 2 === 0 ? "" : "rp-table-row-alt", r.status === "Inspecting" ? "rp-row-inspecting" : "")}>
                          <TableCell className="rp-td"><span className="font-mono text-xs font-medium">{r.id}</span></TableCell>
                          <TableCell className="rp-td"><StatusBadge status={r.status} /></TableCell>
                          <TableCell className="rp-td">
                            <div className="min-w-0">
                              <span className="text-xs block truncate max-w-24">{r.product.name}</span>
                              <span className="text-xs text-gray-400 font-mono">{r.product.sku}</span>
                            </div>
                          </TableCell>
                          <TableCell className="rp-td"><span className="text-sm">{r.qty}</span></TableCell>
                          <TableCell className="rp-td"><ReasonBadge reason={r.reason} /></TableCell>
                          <TableCell className="rp-td">
                            <Badge className={cn("rp-badge", r.qcDecision.startsWith("Pass") ? "rp-badge-qc-pass" : r.qcDecision.startsWith("Fail") ? "rp-badge-qc-fail" : "rp-badge-hold")}>
                              {r.qcDecision.split(" - ")[0]}
                            </Badge>
                          </TableCell>
                          <TableCell className="rp-td"><DispositionBadge disp={r.disposition} /></TableCell>
                          <TableCell className="rp-td"><span className="text-xs">{r.processor?.name || "—"}</span></TableCell>
                          <TableCell className="rp-td"><span className="text-xs">{r.warehouse.length > 10 ? r.warehouse.substring(0, 10) + ".." : r.warehouse}</span></TableCell>
                          <TableCell className="rp-td">
                            <div className="flex items-center gap-1">
                              <Receipt className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{r.images} photos</span>
                            </div>
                          </TableCell>
                          <TableCell className="rp-td"><span className="text-xs max-w-32 truncate block">{r.notes}</span></TableCell>
                          <TableCell className="rp-td">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedReturn(r)}><Eye className="h-3.5 w-3.5" /></Button>
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
        {/* TAB 4: Refunds */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "refunds" && (
          <div className="rp-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Refund Issued", value: String(totalRefunded), icon: CreditCard, cls: "rp-kpi-green" },
                { label: "Processing", value: String(returns.filter((r) => r.status === "Refund Processing").length), icon: RefreshCw, cls: "rp-kpi-cyan" },
                { label: "Total Refunded", value: `₹${(totalRefundValue / 1000).toFixed(0)}K`, icon: IndianRupee, cls: "rp-kpi-pink" },
                { label: "Avg Refund", value: `₹${Math.floor(totalRefundValue / Math.max(1, totalRefunded)).toLocaleString("en-IN")}`, icon: Banknote, cls: "rp-kpi-amber" },
              ].map((kpi) => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="rp-card">
                <CardHeader className="pb-2"><CardTitle className="rp-card-title">Refund Method Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={REFUND_METHODS.map((m) => ({ name: m.split("(")[0].trim(), value: returns.filter((r) => r.refundMethod === m).length }))} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                        {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rp-card">
                <CardHeader className="pb-2"><CardTitle className="rp-card-title">Monthly Refund & Restock Value Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" dataKey="refundAmount" stackId="1" fill="#ec4899" stroke="#ec4899" fillOpacity={0.3} name="Refund ₹" />
                      <Area type="monotone" dataKey="restockValue" stackId="2" fill="#10b981" stroke="#10b981" fillOpacity={0.3} name="Restock ₹" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="rp-filter-bar mb-4">
              <div className="flex items-center gap-2 rp-filter-search">
                <Search className="h-4 w-4 opacity-50" />
                <input type="text" placeholder="Search refunds..." value={refundSearch} onChange={(e) => setRefundSearch(e.target.value)} className="rp-filter-input" />
              </div>
              <select value={refundStatusFilter} onChange={(e) => setRefundStatusFilter(e.target.value)} className="rp-filter-select">
                <option value="All">All Statuses</option>
                {["Refund Processing", "Refund Issued", "Replacement Shipped", "Closed"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <Card className="rp-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="rp-table-header">
                        <TableHead className="rp-th">RMA ID</TableHead>
                        <TableHead className="rp-th">Order</TableHead>
                        <TableHead className="rp-th">Customer</TableHead>
                        <TableHead className="rp-th">Product</TableHead>
                        <TableHead className="rp-th">Refund Status</TableHead>
                        <TableHead className="rp-th">Method</TableHead>
                        <TableHead className="rp-th">Amount ₹</TableHead>
                        <TableHead className="rp-th">Restock ₹</TableHead>
                        <TableHead className="rp-th">Disposition</TableHead>
                        <TableHead className="rp-th">Feedback</TableHead>
                        <TableHead className="rp-th">Refunded On</TableHead>
                        <TableHead className="rp-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRefunds.slice(0, 50).map((r, idx) => (
                        <TableRow key={r.id} className={cn("rp-table-row", idx % 2 === 0 ? "" : "rp-table-row-alt", r.status === "Refund Processing" ? "rp-row-inspecting" : "")}>
                          <TableCell className="rp-td"><span className="font-mono text-xs font-medium">{r.id}</span></TableCell>
                          <TableCell className="rp-td"><span className="font-mono text-xs text-gray-400">{r.orderId}</span></TableCell>
                          <TableCell className="rp-td"><span className="text-xs">{r.customer.name}</span></TableCell>
                          <TableCell className="rp-td"><span className="text-xs truncate max-w-24 block">{r.product.name}</span></TableCell>
                          <TableCell className="rp-td"><StatusBadge status={r.status} /></TableCell>
                          <TableCell className="rp-td"><span className="text-xs">{r.refundMethod}</span></TableCell>
                          <TableCell className="rp-td"><span className="text-sm font-bold text-pink-600">₹{r.refundAmount.toLocaleString("en-IN")}</span></TableCell>
                          <TableCell className="rp-td">
                            <span className={cn("text-sm", r.restockValue > 0 ? "text-green-600" : "text-gray-400")}>
                              {r.restockValue > 0 ? `₹${r.restockValue.toLocaleString("en-IN")}` : "—"}
                            </span>
                          </TableCell>
                          <TableCell className="rp-td"><DispositionBadge disp={r.disposition} /></TableCell>
                          <TableCell className="rp-td">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3 text-gray-400" />
                              <span className="text-xs max-w-28 truncate block">{r.customerFeedback}</span>
                            </div>
                          </TableCell>
                          <TableCell className="rp-td"><span className="text-xs">{r.refundedAt || "—"}</span></TableCell>
                          <TableCell className="rp-td">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedReturn(r)}><Eye className="h-3.5 w-3.5" /></Button>
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
        {/* TAB 5: Analytics */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "analytics" && (
          <div className="rp-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Return Rate", value: `${(returns.length / 500 * 100).toFixed(1)}%`, icon: Percent, cls: "rp-kpi-pink", subtitle: "of 500 orders" },
                { label: "Net Loss", value: `₹${((totalRefundValue - totalRestockValue) / 1000).toFixed(0)}K`, icon: ArrowDownRight, cls: "rp-kpi-red" },
                { label: "Recovery Rate", value: `${Math.floor(totalRestockValue / Math.max(1, totalRefundValue) * 100)}%`, icon: ArrowUpRight, cls: "rp-kpi-green" },
                { label: "Avg Satisfaction", value: `${Math.floor(monthlyTrend.reduce((a, m) => a + m.satisfaction, 0) / monthlyTrend.length)}%`, icon: ThumbsUp, cls: "rp-kpi-amber" },
              ].map((kpi) => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} subtitle={kpi.subtitle} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="rp-card">
                <CardHeader className="pb-2"><CardTitle className="rp-card-title">Cost of Returns Analysis</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="refundAmount" fill="#ec4899" radius={[3, 3, 0, 0]} name="Refund Cost ₹" />
                      <Line type="monotone" dataKey="restockValue" stroke="#10b981" strokeWidth={2} name="Recovery ₹" />
                      <Line type="monotone" dataKey="satisfaction" stroke="#f59e0b" strokeWidth={2} name="Satisfaction %" dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rp-card">
                <CardHeader className="pb-2"><CardTitle className="rp-card-title">Customer Segment Return Analysis</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={(["Premium", "Regular", "Enterprise"] as const).map((seg) => ({
                      segment: seg,
                      returns: returns.filter((r) => r.customer.segment === seg).length,
                      avgRefund: Math.floor(returns.filter((r) => r.customer.segment === seg).reduce((a, r) => a + r.refundAmount, 0) / Math.max(1, returns.filter((r) => r.customer.segment === seg).length) / 100),
                      satisfaction: Math.floor(rand() * 10) + 85,
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="segment" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis tick={{ fontSize: 9 }} />
                      <Radar name="Returns" dataKey="returns" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} />
                      <Radar name="Avg Refund (×100)" dataKey="avgRefund" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
                      <Radar name="Satisfaction" dataKey="satisfaction" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="rp-card">
              <CardHeader className="pb-2"><CardTitle className="rp-card-title">Top Return Products</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="rp-table-header">
                        <TableHead className="rp-th">#</TableHead>
                        <TableHead className="rp-th">Product</TableHead>
                        <TableHead className="rp-th">SKU</TableHead>
                        <TableHead className="rp-th">Category</TableHead>
                        <TableHead className="rp-th">Returns</TableHead>
                        <TableHead className="rp-th">Top Reason</TableHead>
                        <TableHead className="rp-th">Total Refund ₹</TableHead>
                        <TableHead className="rp-th">Restock ₹</TableHead>
                        <TableHead className="rp-th">Recovery %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PRODUCTS.map((p, idx) => {
                        const pReturns = returns.filter((r) => r.product.sku === p.sku)
                        const pRefund = pReturns.reduce((a, r) => a + r.refundAmount, 0)
                        const pRestock = pReturns.reduce((a, r) => a + r.restockValue, 0)
                        if (pReturns.length === 0) return null
                        const topReason = pReturns.reduce((acc, r) => { acc[r.reason] = (acc[r.reason] || 0) + 1; return acc }, {} as Record<string, number>)
                        const topR = Object.entries(topReason).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
                        return (
                          <TableRow key={p.sku} className={cn("rp-table-row", idx % 2 === 0 ? "" : "rp-table-row-alt")}>
                            <TableCell className="rp-td">
                              <span className={cn("rp-rank-badge", idx === 0 ? "rp-rank-gold" : idx === 1 ? "rp-rank-silver" : idx === 2 ? "rp-rank-bronze" : "")}>
                                {idx + 1}
                              </span>
                            </TableCell>
                            <TableCell className="rp-td"><span className="text-sm">{p.name}</span></TableCell>
                            <TableCell className="rp-td"><span className="font-mono text-xs">{p.sku}</span></TableCell>
                            <TableCell className="rp-td"><span className="text-xs">{p.cat}</span></TableCell>
                            <TableCell className="rp-td"><span className="text-sm font-medium">{pReturns.length}</span></TableCell>
                            <TableCell className="rp-td"><ReasonBadge reason={topR} /></TableCell>
                            <TableCell className="rp-td"><span className="text-sm text-pink-600 font-medium">₹{pRefund.toLocaleString("en-IN")}</span></TableCell>
                            <TableCell className="rp-td"><span className="text-sm text-green-600">₹{pRestock.toLocaleString("en-IN")}</span></TableCell>
                            <TableCell className="rp-td">
                              <div className="flex items-center gap-2">
                                <MiniBar value={pRestock} max={Math.max(1, pRefund)} colorClass="rp-bar-green" />
                                <span className="text-xs">{Math.floor(pRestock / Math.max(1, pRefund) * 100)}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>

      {/* ─── Return Detail Drawer ─── */}
      <Drawer open={!!selectedReturn} onClose={() => setSelectedReturn(null)}>
        {selectedReturn && (
          <div className="rp-drawer-content">
            <div className={cn("rp-drawer-status", selectedReturn.status === "Closed" || selectedReturn.status === "Refund Issued" || selectedReturn.status === "Replacement Shipped" ? "rp-drawer-done" : selectedReturn.status === "Disputed" ? "rp-drawer-disputed" : selectedReturn.status === "QC Rejected" ? "rp-drawer-rejected" : selectedReturn.status === "Inspecting" || selectedReturn.status === "Refund Processing" ? "rp-drawer-active" : "rp-drawer-default")}>
              {selectedReturn.status === "Closed" || selectedReturn.status === "Refund Issued" ? <CheckCircle2 className="h-4 w-4" /> :
                selectedReturn.status === "Disputed" ? <ThumbsDown className="h-4 w-4" /> :
                selectedReturn.status === "QC Rejected" ? <X className="h-4 w-4" /> :
                selectedReturn.status === "Replacement Shipped" ? <Truck className="h-4 w-4" /> :
                <RefreshCw className="h-4 w-4" />}
              <span className="text-sm font-medium">{selectedReturn.status}</span>
            </div>

            <h3 className="rp-drawer-title">{selectedReturn.id}</h3>
            <p className="rp-drawer-subtitle">Order {selectedReturn.orderId} — {selectedReturn.reason}</p>

            {/* Customer Info */}
            <div className="rp-customer-box">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-pink-500" />
                <span className="rp-drawer-field-label">Customer</span>
              </div>
              <div className="rp-drawer-field-value">{selectedReturn.customer.name} — {selectedReturn.customer.city}</div>
              <div className="text-xs text-gray-400">{selectedReturn.customer.id} · {selectedReturn.customer.segment} segment</div>
            </div>

            {/* Product Info */}
            <div className="rp-location-viz">
              <div className="rp-location-dot rp-loc-product">
                <Package className="h-4 w-4" />
                <span className="text-xs">{selectedReturn.product.name}</span>
              </div>
              <div className="rp-location-line"><ChevronRight className="h-3.5 w-3.5" /></div>
              <div className="rp-location-dot rp-loc-warehouse">
                <Warehouse className="h-4 w-4" />
                <span className="text-xs">{selectedReturn.warehouse}</span>
              </div>
              <div className="rp-location-line"><ArrowRight className="h-3.5 w-3.5" /></div>
              <div className="rp-location-dot rp-loc-status">
                {selectedReturn.disposition === "Restock to Inventory" ? <CheckCircle2 className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                <span className="text-xs">{selectedReturn.disposition.split(" ")[0]}</span>
              </div>
            </div>

            <div className="rp-info-grid">
              <div className="rp-info-item"><span className="rp-info-label">SKU</span><span className="rp-info-value font-mono">{selectedReturn.product.sku}</span></div>
              <div className="rp-info-item"><span className="rp-info-label">Category</span><span className="rp-info-value">{selectedReturn.product.cat}</span></div>
              <div className="rp-info-item"><span className="rp-info-label">Unit Price</span><span className="rp-info-value">₹{selectedReturn.product.price.toLocaleString("en-IN")}</span></div>
              <div className="rp-info-item"><span className="rp-info-label">Quantity</span><span className="rp-info-value">{selectedReturn.qty}</span></div>
              <div className="rp-info-item"><span className="rp-info-label">Channel</span><span className="rp-info-value"><ChannelBadge channel={selectedReturn.channel} /></span></div>
              <div className="rp-info-item"><span className="rp-info-label">Priority</span><span className="rp-info-value"><PriorityBadge priority={selectedReturn.priority} /></span></div>
            </div>

            {/* Financial Summary */}
            <div className="rp-financial-box">
              <h4 className="rp-section-heading">Financial Summary</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="rp-qty-box rp-qty-refund">
                  <span className="rp-qty-label">Refund</span>
                  <span className="rp-qty-number">₹{selectedReturn.refundAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="rp-qty-box rp-qty-restock">
                  <span className="rp-qty-label">Restock</span>
                  <span className="rp-qty-number">₹{selectedReturn.restockValue.toLocaleString("en-IN")}</span>
                </div>
                <div className={cn("rp-qty-box", selectedReturn.restockValue > selectedReturn.refundAmount * 0.5 ? "rp-qty-positive" : "rp-qty-negative")}>
                  <span className="rp-qty-label">Net Loss</span>
                  <span className="rp-qty-number">₹{(selectedReturn.refundAmount - selectedReturn.restockValue).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Return Timeline */}
            <div className="rp-timeline">
              <h4 className="rp-section-heading">Return Timeline</h4>
              <div className="rp-timeline-track">
                {[
                  { step: "Requested", date: selectedReturn.createdAt },
                  { step: "Received", date: selectedReturn.receivedAt },
                  { step: "QC Check", date: selectedReturn.qcAt },
                  { step: "Refund", date: selectedReturn.refundedAt },
                  { step: "Closed", date: selectedReturn.status === "Closed" ? selectedReturn.refundedAt : null },
                ].map((item, i) => {
                  const isDone = !!item.date
                  const statusOrder = ["Received", "Inspecting", "QC Approved", "QC Rejected", "Refund Processing", "Refund Issued", "Replacement Shipped", "Closed", "Disputed"]
                  const currentStep = ["Requested", "Received", "QC Check", "Refund", "Closed"].findIndex((_, si) => {
                    const mapping = ["Received", "Inspecting", "QC Approved", "Refund Processing", "Closed"]
                    return mapping[si] === selectedReturn.status
                  })
                  const isCurrent = i > 0 && i <= (currentStep >= 0 ? currentStep : 0) + 1
                  return (
                    <div key={item.step} className="rp-timeline-step">
                      <div className={cn("rp-timeline-dot", isDone && "rp-dot-done", isCurrent && "rp-dot-current")} />
                      <span className={cn("rp-timeline-label", isDone && "rp-label-done", isCurrent && "rp-label-current")}>{item.step}</span>
                      <span className="rp-timeline-date">{item.date || "—"}</span>
                      {i < 4 && <div className={cn("rp-timeline-connector", isDone && "rp-connector-done")} />}
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedReturn.customerFeedback !== "Awaiting" && (
              <div className="rp-feedback-box">
                <h4 className="rp-section-heading">Customer Feedback</h4>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{selectedReturn.customerFeedback}</span>
                </div>
              </div>
            )}

            <div className="rp-drawer-footer">
              <div className="rp-footer-item"><span className="rp-info-label">Processor</span><span className="rp-info-value">{selectedReturn.processor?.name || "Unassigned"}</span></div>
              <div className="rp-footer-item"><span className="rp-info-label">QC Decision</span><span className="rp-info-value">{selectedReturn.qcDecision}</span></div>
              <div className="rp-footer-item"><span className="rp-info-label">Refund Method</span><span className="rp-info-value">{selectedReturn.refundMethod}</span></div>
              {selectedReturn.transitDays && <div className="rp-footer-item"><span className="rp-info-label">Transit</span><span className="rp-info-value">{selectedReturn.transitDays} days</span></div>}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
