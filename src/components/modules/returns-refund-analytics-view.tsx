"use client"

import { useState, useMemo, Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import {
  RotateCcw, TrendingUp, TrendingDown, IndianRupee, Clock, AlertTriangle,
  CheckCircle2, Package, Eye, X, ChevronRight, Search, Filter,
  ArrowUpRight, ArrowDownRight, Truck, User, Warehouse, Star,
  CreditCard, Send, FileText, BarChart3, ArrowLeftRight, Info,
  Recycle, Trash2, RefreshCw, Download, Tag, CalendarRange, Zap
} from "lucide-react"

// ──────────────────────────────────────────────────────
// Seed-based mock data generation
// ──────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rng = seededRandom(148148)

function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(rng() * (max - min + 1)) + min }
function randFloat(min: number, max: number, dec = 1): number { return Number((rng() * (max - min) + min).toFixed(dec)) }

// ──────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────
const REASONS = [
  "Defective Product", "Wrong Item Delivered", "Damaged in Transit",
  "Size/Fit Issue", "Quality Not as Expected", "No Longer Needed",
  "Late Delivery", "Missing Parts", "Color Mismatch", "Price Discrepancy"
] as const

const DISPOSITIONS = ["Restock", "Refurbish", "Liquidate", "Dispose", "Return to Vendor", "Donate"] as const

const STATUSES = ["Pending", "Inspected", "Approved", "Rejected", "Refunded", "Restocked", "Disposed"] as const

const CHANNELS = ["B2B Direct", "Amazon", "Flipkart", "Meesho", "Own Website", "JioMart", "Blinkit", "Nykaa"] as const

const WAREHOUSES = [
  "Mumbai Central", "Delhi NCR Hub", "Chennai Port", "Bangalore South",
  "Hyderabad East", "Kolkata Warehouse", "Pune West", "Ahmedabad North"
] as const

const SUPPLIERS = [
  "Tata Steel", "Godrej Consumer", "Sun Pharma", "ITC Ltd", "Hindustan Unilever",
  "Maruti Suzuki", "Bajaj Electricals", "Dabur India", "Asian Paints", "Dr. Reddy's"
] as const

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const RETURN_FLOW = ["Received", "Inspected", "Decision", "Processed", "Completed"] as const

// ──────────────────────────────────────────────────────
// Status/Reason styles
// ──────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  "Pending": "rra-status-pending",
  "Inspected": "rra-status-inspected",
  "Approved": "rra-status-approved",
  "Rejected": "rra-status-rejected",
  "Refunded": "rra-status-refunded",
  "Restocked": "rra-status-restocked",
  "Disposed": "rra-status-disposed",
}

const HEADER_GRADIENTS: Record<string, string> = {
  "Pending": "from-amber-500 to-orange-600",
  "Inspected": "from-blue-500 to-indigo-600",
  "Approved": "from-emerald-500 to-teal-600",
  "Rejected": "from-red-500 to-rose-600",
  "Refunded": "from-teal-500 to-cyan-600",
  "Restocked": "from-indigo-500 to-purple-600",
  "Disposed": "from-gray-500 to-slate-600",
}

const PIE_COLORS = ["#f97316", "#06b6d4", "#10b981", "#f43f5e", "#6366f1", "#8b5cf6", "#f59e0b", "#ec4899"]
const PIE_COLORS_2 = ["#f97316", "#06b6d4", "#10b981", "#f43f5e", "#eab308", "#8b5cf6", "#14b8a6", "#ec4899", "#6366f1", "#a3e635"]

// ──────────────────────────────────────────────────────
// Mock Data
// ──────────────────────────────────────────────────────
const returns: Array<{
  id: string; date: string; orderId: string; customer: string; channel: string;
  sku: string; product: string; reason: string; status: string;
  warehouse: string; supplier: string; value: number; refundAmount: number;
  disposition: string; qualityGrade: string; inspectionDays: number;
  category: string; city: string;
}> = []

const PRODUCTS = [
  "Tata Tiscon 12mm Rebar", "Godrej Lock AL-01", "Sun Pharma Dolo 650", "ITC Bingo Mad Angles",
  "HUL Surf Excel 2kg", "Maruti Alto K10 Mirror", "Bajaj LED Bulb 9W", "Dabur Chyawanprash 1kg",
  "Asian Paints Royale Matt", "Dr. Reddy's Ciprofloxacin"
]

for (let i = 0; i < 150; i++) {
  const status = pick([...STATUSES])
  const reason = pick([...REASONS])
  const channel = pick([...CHANNELS])
  const warehouse = pick([...WAREHOUSES])
  const supplier = pick([...SUPPLIERS])
  const disposition = status === "Restocked" ? "Restock" : status === "Disposed" ? pick(["Liquidate", "Dispose", "Donate"]) : status === "Refunded" ? "Refund" : "—"
  const value = randInt(200, 45000)
  const refundAmount = (status === "Refunded" || status === "Restocked") ? Math.round(value * randFloat(0.7, 1.0)) : 0
  const qualityGrade = status === "Inspected" || status === "Approved" || status === "Restocked" || status === "Refunded"
    ? pick(["A - Like New", "B - Minor Defect", "C - Major Defect", "D - Unsalvageable"])
    : "—"

  returns.push({
    id: `RET-${String(148001 + i).padStart(6, "0")}`,
    date: `2026-07-${String(randInt(1, 28)).padStart(2, "0")}`,
    orderId: `ORD-${String(2607001 + randInt(0, 500)).padStart(7, "0")}`,
    customer: pick(["Tata Motors", "Reliance Retail", "BigBasket", "DMart", "Spencer's", "Metro Cash", "Vijay Sales", "Croma", "Decathlon", "Pepperfry", "Nykaa", "Usha International"]),
    channel,
    sku: `SKU-${String(1000 + randInt(0, 999)).padStart(4, "0")}`,
    product: pick([...PRODUCTS]),
    reason, status, warehouse, supplier, value, refundAmount, disposition,
    qualityGrade,
    inspectionDays: status === "Pending" ? 0 : randInt(1, 5),
    category: pick(["Building Materials", "Consumer Goods", "Pharmaceuticals", "FMCG", "Auto Parts", "Electronics", "Healthcare", "Paints", "Personal Care"]),
    city: pick(["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"]),
  })
}

// Monthly data
const monthlyReturns = MONTHS.map(m => ({
  month: m,
  returns: randInt(80, 180),
  refunds: randInt(60, 150),
  restocks: randInt(30, 90),
  valueLoss: randInt(5, 25),
  rate: randFloat(3, 8),
}))

// Reason distribution
const reasonDist = REASONS.map(r => ({
  reason: r,
  count: returns.filter(ret => ret.reason === r).length,
  value: returns.filter(ret => ret.reason === r).reduce((s, ret) => s + ret.value, 0),
}))

// Supplier return analysis
const supplierAnalysis = SUPPLIERS.map(sup => {
  const supReturns = returns.filter(ret => ret.supplier === sup)
  return {
    supplier: sup.split(" ").slice(0, 2).join(" "),
    returns: supReturns.length,
    rate: supReturns.length > 0 ? (supReturns.length / returns.length * 100).toFixed(1) : "0",
    value: supReturns.reduce((s, ret) => s + ret.value, 0),
    avgValue: supReturns.length > 0 ? Math.round(supReturns.reduce((s, ret) => s + ret.value, 0) / supReturns.length) : 0,
    gradeA: supReturns.filter(ret => ret.qualityGrade === "A - Like New").length,
    refundRate: supReturns.length > 0 ? ((supReturns.filter(ret => ret.status === "Refunded").length / supReturns.length) * 100).toFixed(0) : "0",
  }
}).filter(s => s.returns > 0).sort((a, b) => b.returns - a.returns)

// Channel return analysis
const channelAnalysis = CHANNELS.map(ch => {
  const chReturns = returns.filter(ret => ret.channel === ch)
  return {
    channel: ch,
    returns: chReturns.length,
    refundRate: chReturns.length > 0 ? ((chReturns.filter(ret => ret.status === "Refunded").length / chReturns.length) * 100).toFixed(1) : "0",
    avgValue: chReturns.length > 0 ? Math.round(chReturns.reduce((s, ret) => s + ret.value, 0) / chReturns.length) : 0,
    topReason: chReturns.length > 0 ? chReturns[0].reason.split(" ").slice(0, 2).join(" ") : "—",
  }
}).filter(c => c.returns > 0)

// Disposition data
const dispositionData = DISPOSITIONS.map(d => ({
  disposition: d,
  count: returns.filter(ret => ret.disposition === d).length,
}))

// ──────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────
function fmtNum(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

function fmtINR(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`
}

// ──────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────
export default function ReturnsRefundAnalyticsView() {
  const [activeTab, setActiveTab] = useState(0)
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState<typeof returns[0] | null>(null)

  const tabs = ["Dashboard", "Returns Register", "Reason & Supplier Analysis", "Refund Tracking", "Disposition & Recovery"]

  // ── KPI calculations ──────────────────────────────
  const totalReturns = returns.length
  const totalRefunded = returns.reduce((s, r) => s + r.refundAmount, 0)
  const avgRefundTime = randFloat(2.5, 6.8)
  const restockRate = ((returns.filter(r => r.status === "Restocked").length / Math.max(returns.filter(r => ["Refunded", "Restocked", "Disposed"].includes(r.status)).length, 1)) * 100).toFixed(1)
  const returnRate = randFloat(4.2, 7.8)
  const recoveryRate = ((returns.filter(r => r.disposition === "Restock").length / Math.max(returns.filter(r => r.disposition !== "—").length, 1)) * 100).toFixed(1)

  // ── Filtered data ──────────────────────────────────
  const filteredReturns = useMemo(() => {
    let data = [...returns]
    if (statusFilter !== "All") data = data.filter(r => r.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.orderId.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, searchQuery])

  // ── Status counts ──────────────────────────────────
  const statusCounts: Record<string, number> = {
    "All": returns.length,
    ...Object.fromEntries(STATUSES.map(s => [s, returns.filter(r => r.status === s).length])),
  }

  // ── Drawer ─────────────────────────────────────────
  const openDrawer = (r: typeof returns[0]) => {
    setSelectedReturn(r)
    setDrawerOpen(true)
  }
  const closeDrawer = () => {
    setDrawerOpen(false)
    setSelectedReturn(null)
  }

  // ── Get current flow step ─────────────────────────
  const getCurrentStep = (status: string): number => {
    const map: Record<string, number> = {
      "Pending": 0, "Inspected": 1, "Approved": 2,
      "Rejected": 2, "Refunded": 3, "Restocked": 4, "Disposed": 4,
    }
    return map[status] ?? 0
  }

  // ══════════════════════════════════════════════════
  // TAB 0: Dashboard
  // ══════════════════════════════════════════════════
  function renderDashboard() {
    return (
      <Fragment>
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total Returns", value: String(totalReturns), icon: RotateCcw, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400", trend: "+6.2%", up: false },
            { label: "Return Rate", value: `${returnRate}%`, icon: TrendingUp, color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400", trend: "-0.8%", up: true },
            { label: "Total Refunded", value: fmtINR(totalRefunded), icon: IndianRupee, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", trend: "+4.1%", up: false },
            { label: "Avg Refund Time", value: `${avgRefundTime}d`, icon: Clock, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", trend: "-1.2d", up: true },
            { label: "Restock Rate", value: `${restockRate}%`, icon: Package, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400", trend: "+2.3%", up: true },
            { label: "Recovery Rate", value: `${recoveryRate}%`, icon: Recycle, color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400", trend: "+1.5%", up: true },
          ].map((kpi, idx) => (
            <div key={idx} className="rra-kpi-card">
              <div className="flex items-start justify-between">
                <div className="rra-kpi-label">{kpi.label}</div>
                <div className={`rra-kpi-icon ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1 rra-kpi-value">{kpi.value}</div>
              <div className={`mt-1 rra-kpi-trend ${kpi.up ? "rra-kpi-trend-up" : "rra-kpi-trend-down"}`}>
                {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.trend} vs last month
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Monthly Returns Volume */}
          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4 text-orange-500" />
                Monthly Returns Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="returns" fill="#f97316" radius={[2, 2, 0, 0]} name="Returns" />
                  <Bar dataKey="refunds" fill="#06b6d4" radius={[2, 2, 0, 0]} name="Refunds" />
                  <Bar dataKey="restocks" fill="#10b981" radius={[2, 2, 0, 0]} name="Restocks" />
                  <Line dataKey="rate" stroke="#f43f5e" strokeWidth={2} dot={false} name="Rate %" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Return Reasons PieChart */}
          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <RotateCcw className="h-4 w-4 text-cyan-500" />
                Return Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={reasonDist.slice(0, 8)} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="count" label={({ reason, percent }) => `${reason.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {reasonDist.slice(0, 8).map((_, idx) => {
                      const rc = [...PIE_COLORS_2]
                      return <Cell key={String(idx)} fill={rc[idx] || "#f97316"} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Disposition Distribution */}
          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Recycle className="h-4 w-4 text-emerald-500" />
                Disposition Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dispositionData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="count" label={({ disposition, percent }) => `${disposition.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {dispositionData.map((_, idx) => {
                      const dc = [...PIE_COLORS]
                      return <Cell key={String(idx)} fill={dc[idx] || "#f97316"} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Warehouse Returns */}
          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Warehouse className="h-4 w-4 text-blue-500" />
                Returns by Warehouse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={WAREHOUSES.map(wh => ({
                  name: wh.split(" ")[0],
                  pending: returns.filter(r => r.warehouse === wh && r.status === "Pending").length,
                  refunded: returns.filter(r => r.warehouse === wh && r.status === "Refunded").length,
                  restocked: returns.filter(r => r.warehouse === wh && r.status === "Restocked").length,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Pending" />
                  <Bar dataKey="refunded" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} name="Refunded" />
                  <Bar dataKey="restocked" stackId="a" fill="#10b981" radius={[2, 2, 0, 0]} name="Restocked" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Channel Analysis */}
          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Zap className="h-4 w-4 text-amber-500" />
                Channel Return Rate Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={channelAnalysis.slice(0, 6)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="channel" tick={{ fontSize: 10 }} width={65} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="returns" fill="#f97316" radius={[0, 4, 4, 0]} name="Returns" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Return Analytics Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { type: "critical", title: "Defective Product returns up 18% in July", desc: "Tata Steel and Godrej products showing quality degradation trend" },
                { type: "warning", title: "Average refund processing time increased to 5.2 days", desc: "Target is 3 days — inspection bottleneck at Mumbai warehouse" },
                { type: "info", title: "Restock recovery rate improved to 42.3%", desc: "Up from 38% last month due to faster inspection turnaround" },
                { type: "critical", title: "₹12.8L in refunds pending approval for 48+ hours", desc: "7 high-value returns awaiting finance team sign-off" },
                { type: "warning", title: "Amazon return rate exceeds 8% threshold", desc: "Category: Electronics — coordinate with Amazon quality team" },
                { type: "info", title: "New quality grading system showing positive results", desc: "Grade A items up 15% — faster restocking for like-new products" },
              ].map((alert, idx) => (
                <div key={idx} className={`rra-alert rra-alert-${alert.type}`}>
                  <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${alert.type === "critical" ? "text-red-500" : alert.type === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{alert.title}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">{alert.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 1: Returns Register
  // ══════════════════════════════════════════════════
  function renderReturnsRegister() {
    return (
      <Fragment>
        {/* Filter + Search */}
        <div className="flex flex-wrap gap-2">
          {(["All", ...STATUSES] as Array<string>).map(s => (
            <button
              key={s}
              className={`rra-status-badge cursor-pointer px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm ${
                statusFilter === s ? "ring-2 ring-orange-500" : ""
              }`}
              onClick={() => setStatusFilter(s)}
            >
              {s} ({String(statusCounts[s] || 0)})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by ID, order, customer, reason, SKU..." className="rra-search w-full pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <Badge variant="outline" className="badge-interactive text-xs">{filteredReturns.length} returns</Badge>
        </div>

        {/* Table */}
        <div className="rra-table-wrap">
          <table className="rra-table">
            <thead className="rra-table-head">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Channel</th>
                <th>SKU</th>
                <th>Reason</th>
                <th>Value</th>
                <th>Refund</th>
                <th>Grade</th>
                <th>Disposition</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.slice(0, 30).map(r => (
                <tr key={r.id} className="rra-table-row">
                  <td className="font-mono text-xs font-semibold text-orange-600 dark:text-orange-400">{r.id}</td>
                  <td className="text-xs">{r.date}</td>
                  <td className="text-xs font-medium">{r.customer}</td>
                  <td className="text-xs">{r.channel}</td>
                  <td className="font-mono text-[10px] text-gray-500 dark:text-gray-400">{r.sku}</td>
                  <td><span className="rra-reason-badge rra-reason-other">{r.reason.split(" ").slice(0, 2).join(" ")}</span></td>
                  <td className="text-xs font-medium">{fmtINR(r.value)}</td>
                  <td className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{r.refundAmount > 0 ? fmtINR(r.refundAmount) : "—"}</td>
                  <td className="text-[10px]">{r.qualityGrade !== "—" ? r.qualityGrade.split(" ")[0] : "—"}</td>
                  <td className="text-xs">{r.disposition}</td>
                  <td><span className={`rra-status-badge ${STATUS_STYLES[r.status]}`}>{r.status}</span></td>
                  <td>
                    <button onClick={() => openDrawer(r)} className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-orange-600 dark:hover:bg-gray-800">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 2: Reason & Supplier Analysis
  // ══════════════════════════════════════════════════
  function renderReasonSupplierAnalysis() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Reason Value BarChart */}
          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <RotateCcw className="h-4 w-4 text-orange-500" />
                Return Reasons by Value (₹)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reasonDist.sort((a, b) => b.value - a.value)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `₹${fmtNum(v)}`} />
                  <YAxis type="category" dataKey="reason" tick={{ fontSize: 9 }} width={90} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [fmtINR(v), "Value"]} />
                  <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Supplier Return Table */}
          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <User className="h-4 w-4 text-cyan-500" />
                Supplier Return Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rra-table-wrap">
                <table className="rra-table">
                  <thead className="rra-table-head">
                    <tr>
                      <th>Supplier</th>
                      <th>Returns</th>
                      <th>Rate</th>
                      <th>Avg Value</th>
                      <th>Grade A</th>
                      <th>Refund %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierAnalysis.slice(0, 10).map(s => (
                      <tr key={s.supplier} className="rra-table-row">
                        <td className="text-xs font-medium">{s.supplier}</td>
                        <td className="text-xs font-bold text-gray-900 dark:text-gray-100">{String(s.returns)}</td>
                        <td className="text-xs">{s.rate}%</td>
                        <td className="text-xs">{fmtINR(s.avgValue)}</td>
                        <td className="text-xs text-emerald-600 dark:text-emerald-400">{String(s.gradeA)}</td>
                        <td className="text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-16">
                              <div className="rra-progress-track">
                                <div className={`rra-progress-fill ${Number(s.refundRate) > 60 ? "rra-progress-red" : Number(s.refundRate) > 30 ? "rra-progress-amber" : "rra-progress-emerald"}`} style={{ width: `${Math.min(Number(s.refundRate), 100)}%` }} />
                              </div>
                            </div>
                            <span className="text-[10px]">{s.refundRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supplier Quality Scatter (simulated as Bar) */}
        <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Star className="h-4 w-4 text-amber-500" />
              Supplier Quality Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={supplierAnalysis.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="supplier" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="returns" fill="#f97316" radius={[4, 4, 0, 0]} name="Total Returns" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 3: Refund Tracking
  // ══════════════════════════════════════════════════
  function renderRefundTracking() {
    const refunded = returns.filter(r => r.status === "Refunded" || r.status === "Restocked")
    const totalRefundValue = refunded.reduce((s, r) => s + r.refundAmount, 0)
    const avgRefundAmt = refunded.length > 0 ? Math.round(totalRefundValue / refunded.length) : 0
    const pendingRefundValue = returns.filter(r => r.status === "Approved" || r.status === "Inspected").reduce((s, r) => s + r.value, 0)

    return (
      <Fragment>
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Refunded", value: fmtINR(totalRefundValue), icon: CreditCard, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { label: "Avg Refund Amount", value: fmtINR(avgRefundAmt), icon: IndianRupee, color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
            { label: "Pending Refunds", value: fmtINR(pendingRefundValue), icon: Clock, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
            { label: "GST on Refunds", value: fmtINR(Math.round(totalRefundValue * 0.18)), icon: FileText, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
          ].map((kpi, idx) => (
            <div key={idx} className="rra-kpi-card">
              <div className="flex items-start justify-between">
                <div className="rra-kpi-label">{kpi.label}</div>
                <div className={`rra-kpi-icon ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1 rra-kpi-value">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Refund Trend */}
        <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Monthly Refund Value Trend (₹ Lakhs)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={MONTHS.map(m => ({
                month: m,
                refundValue: randInt(3, 15),
                refundCount: randInt(40, 120),
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="refundValue" fill="#06b6d4" fillOpacity={0.15} stroke="#06b6d4" strokeWidth={2} name="Value (₹L)" />
                <Line type="monotone" dataKey="refundCount" stroke="#f97316" strokeWidth={2} dot={false} name="Count" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Refund by channel + warehouse */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ArrowLeftRight className="h-4 w-4 text-indigo-500" />
                Refund Rate by Channel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {channelAnalysis.sort((a, b) => Number(b.refundRate) - Number(a.refundRate)).map(ch => (
                  <div key={ch.channel} className="rra-comparison-bar">
                    <span className="rra-comparison-label">{ch.channel}</span>
                    <div className="rra-comparison-track">
                      <div
                        className={`rra-comparison-fill ${Number(ch.refundRate) > 60 ? "bg-red-500" : Number(ch.refundRate) > 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${Math.min(Number(ch.refundRate), 100)}%` }}
                      />
                    </div>
                    <span className="rra-comparison-value">{ch.refundRate}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Warehouse className="h-4 w-4 text-purple-500" />
                Refund Value by Warehouse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={WAREHOUSES.map(wh => ({
                  name: wh.split(" ")[0],
                  refundValue: refunded.filter(r => r.warehouse === wh).reduce((s, r) => s + r.refundAmount, 0),
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${fmtNum(v)}`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [fmtINR(v)]} />
                  <Bar dataKey="refundValue" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Refund Value" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 4: Disposition & Recovery
  // ══════════════════════════════════════════════════
  function renderDispositionRecovery() {
    const disposed = returns.filter(r => r.disposition !== "—" && r.disposition !== "Refund")
    const totalDisposedValue = disposed.reduce((s, r) => s + r.value, 0)
    const recoveredValue = returns.filter(r => r.disposition === "Restock").reduce((s, r) => s + r.value, 0)
    const liquidatedValue = returns.filter(r => r.disposition === "Liquidate").reduce((s, r) => s + r.value, 0)

    return (
      <Fragment>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Disposed", value: fmtINR(totalDisposedValue), icon: Trash2, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
            { label: "Recovered (Restock)", value: fmtINR(recoveredValue), icon: Recycle, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { label: "Liquidated", value: fmtINR(liquidatedValue), icon: Tag, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
            { label: "Recovery Rate", value: `${recoveryRate}%`, icon: TrendingUp, color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" },
          ].map((kpi, idx) => (
            <div key={idx} className="rra-kpi-card">
              <div className="flex items-start justify-between">
                <div className="rra-kpi-label">{kpi.label}</div>
                <div className={`rra-kpi-icon ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1 rra-kpi-value">{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Disposition Mix */}
          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Recycle className="h-4 w-4 text-emerald-500" />
                Disposition Mix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={dispositionData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="count" label={({ disposition, percent }) => `${disposition} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {dispositionData.map((_, idx) => {
                      const dc = [...PIE_COLORS]
                      return <Cell key={String(idx)} fill={dc[idx] || "#f97316"} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quality Grade Distribution */}
          <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Star className="h-4 w-4 text-amber-500" />
                Quality Grade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={["A - Like New", "B - Minor Defect", "C - Major Defect", "D - Unsalvageable"].map(grade => ({
                  grade,
                  count: returns.filter(r => r.qualityGrade === grade).length,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="grade" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {["#10b981", "#3b82f6", "#f59e0b", "#f43f5e"].map((c, idx) => {
                      const colors = ["#10b981", "#3b82f6", "#f59e0b", "#f43f5e"]
                      const tc = [...colors]
                      return <Cell key={String(idx)} fill={tc[idx]} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recovery by warehouse */}
        <Card className="hover-lift-sm border-orange-100 dark:border-orange-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Warehouse className="h-4 w-4 text-indigo-500" />
              Recovery Rate by Warehouse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={WAREHOUSES.map(wh => ({
                name: wh.split(" ")[0],
                restocked: returns.filter(r => r.warehouse === wh && r.disposition === "Restock").length,
                liquidated: returns.filter(r => r.warehouse === wh && r.disposition === "Liquidate").length,
                disposed: returns.filter(r => r.warehouse === wh && (r.disposition === "Dispose" || r.disposition === "Donate")).length,
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="restocked" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Restocked" />
                <Bar dataKey="liquidated" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Liquidated" />
                <Bar dataKey="disposed" stackId="a" fill="#f43f5e" radius={[2, 2, 0, 0]} name="Disposed/Donated" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // DRAWER: Return Detail
  // ══════════════════════════════════════════════════
  function renderDrawer() {
    if (!selectedReturn) return null
    const r = selectedReturn
    const currentStep = getCurrentStep(r.status)
    const gradientClass = HEADER_GRADIENTS[r.status] || "from-gray-500 to-slate-600"

    return (
      <div className="rra-drawer-overlay" onClick={closeDrawer}>
        <div className="rra-drawer-panel" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className={`rra-drawer-header-gradient bg-gradient-to-r ${gradientClass} text-white`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  <span className="text-lg font-bold">{r.id}</span>
                </div>
                <div className="mt-1 text-sm opacity-90">{r.product}</div>
                <div className="mt-1 text-xs opacity-75">{r.customer} | {r.city}</div>
              </div>
              <button onClick={closeDrawer} className="rounded-lg bg-white/20 p-1.5 transition-colors hover:bg-white/30">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{r.status}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{r.channel}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{r.reason.split(" ").slice(0, 2).join(" ")}</span>
            </div>
          </div>

          <div className="rra-drawer-body">
            {/* Return Flow */}
            <div className="rra-drawer-section">
              <div className="rra-drawer-section-title">Return Processing Flow</div>
              <div className="flex items-center justify-between">
                {RETURN_FLOW.map((step, sIdx) => (
                  <Fragment key={step}>
                    <div className="rra-flow-step">
                      <div className={`rra-flow-circle ${sIdx < currentStep ? "rra-flow-circle-done" : sIdx === currentStep ? "rra-flow-circle-current" : "rra-flow-circle-pending"}`}>
                        {sIdx < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : sIdx + 1}
                      </div>
                      <span className="text-[9px] text-gray-500 dark:text-gray-400">{step}</span>
                    </div>
                    {sIdx < RETURN_FLOW.length - 1 && (
                      <div className={`rra-flow-line ${sIdx < currentStep ? "rra-flow-line-done" : "rra-flow-line-pending"}`} />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="rra-drawer-section">
              <div className="rra-drawer-section-title">Return Details</div>
              <div className="rra-drawer-field-grid">
                {[
                  { label: "Date", value: r.date },
                  { label: "Order ID", value: r.orderId },
                  { label: "SKU", value: r.sku },
                  { label: "Warehouse", value: r.warehouse },
                  { label: "Supplier", value: r.supplier },
                  { label: "Category", value: r.category },
                  { label: "Inspection Days", value: String(r.inspectionDays) },
                  { label: "Disposition", value: r.disposition },
                ].map((f, idx) => (
                  <div key={idx} className="rra-drawer-field">
                    <div className="rra-drawer-field-label">{f.label}</div>
                    <div className="rra-drawer-field-value">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="rra-drawer-section">
              <div className="rra-drawer-section-title">Financial Summary</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Original Value</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{fmtINR(r.value)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Refund Amount</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmtINR(r.refundAmount)}</span>
                </div>
                {r.refundAmount > 0 && (
                  <div className="rra-refund-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Refund Processed</span>
                      </div>
                      <span className="rra-refund-value">{fmtINR(r.refundAmount)}</span>
                    </div>
                    <div className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                      GST 18% reverse charge applicable | Refund ID: RFN-2026-{String(randInt(1000, 9999))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quality Grade */}
            {r.qualityGrade !== "—" && (
              <div className="rra-drawer-section">
                <div className="rra-drawer-section-title">Quality Assessment</div>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${
                    r.qualityGrade.startsWith("A") ? "bg-emerald-500" :
                    r.qualityGrade.startsWith("B") ? "bg-blue-500" :
                    r.qualityGrade.startsWith("C") ? "bg-amber-500" : "bg-red-500"
                  }`}>
                    {r.qualityGrade.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{r.qualityGrade}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {r.qualityGrade.startsWith("A") ? "Ready for restocking" :
                       r.qualityGrade.startsWith("B") ? "Minor repair needed" :
                       r.qualityGrade.startsWith("C") ? "Requires refurbishment" : "No salvageable value"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="rra-drawer-section">
              <div className="rra-drawer-section-title">Actions</div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="press-scale bg-orange-600 text-white hover:bg-orange-700 gap-1">
                  <Package className="h-3.5 w-3.5" /> Process Return
                </Button>
                <Button size="sm" variant="outline" className="press-scale btn-outline-animate gap-1">
                  <CreditCard className="h-3.5 w-3.5" /> Issue Refund
                </Button>
                <Button size="sm" variant="outline" className="press-scale btn-outline-animate gap-1">
                  <Recycle className="h-3.5 w-3.5" /> Initiate Restock
                </Button>
                <Button size="sm" variant="outline" className="press-scale btn-outline-animate gap-1">
                  <Send className="h-3.5 w-3.5" /> Return to Vendor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════════════
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
            <RotateCcw className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">Returns & Refund Analytics</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Deep analysis of returns, refunds, quality grades, and recovery rates</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="badge-interactive bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0">
            {fmtNum(totalReturns)} Returns
          </Badge>
          <Badge variant="outline">{fmtINR(totalRefunded)} Refunded</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all duration-150 ${
              activeTab === idx
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-50"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rra-tab-content">
        {activeTab === 0 && renderDashboard()}
        {activeTab === 1 && renderReturnsRegister()}
        {activeTab === 2 && renderReasonSupplierAnalysis()}
        {activeTab === 3 && renderRefundTracking()}
        {activeTab === 4 && renderDispositionRecovery()}
      </div>

      {/* Drawer */}
      {drawerOpen && renderDrawer()}
    </div>
  )
}
