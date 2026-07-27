"use client"

import { useState } from "react"
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
  ComposedChart,
} from "recharts"
import {
  RefreshCw, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, Eye, X, Clock, Server, Database, Cable, Unplug,
  Star, Zap, ShieldAlert, ArrowRight, IndianRupee, AlertCircle,
  FileText, RotateCcw, ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(136136)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"]
const SYNC_STATUSES = ["Pending", "Syncing", "Synced", "Failed", "Queued", "Reversed"] as const
const DOC_TYPES = ["Purchase Voucher", "Sales Voucher", "Credit Note", "Debit Note", "Journal Entry", "Receipt", "Payment", "Contra"] as const
const LEDGERS = ["Sundry Creditors", "Sundry Debtors", "Purchase Account", "Sales Account", "Cash", "Bank - SBI", "Bank - HDFC", "Stock In Hand", "Input GST", "Output GST", "Round Off", "Capital Account", "Trading Account"] as const
const ERROR_TYPES = ["Gateway Timeout", "Duplicate Entry", "Invalid Ledger", "GST Mismatch", "Amount Variance", "Missing Mandatory", "Connection Lost", "Authentication Failed"] as const
const GST_RATES = ["Nil (0%)", "Exempt", "5%", "12%", "18%", "28%"] as const
const SEVERITIES = ["Critical", "High", "Medium", "Low"] as const

const COMPANIES = [
  { id: "TLY-001", name: "AutoFlow Mumbai Pvt Ltd", tallyVer: "Tally Prime 4.8", company: "AutoFlow Mumbai", gstin: "27AABCA1234A1Z5", lastSync: "2026-07-28 04:32", status: "Connected" },
  { id: "TLY-002", name: "AutoFlow Delhi Operations", tallyVer: "Tally Prime 4.8", company: "AutoFlow Delhi", gstin: "07AABCA5678B2Z3", lastSync: "2026-07-28 04:28", status: "Connected" },
  { id: "TLY-003", name: "AutoFlow Chennai Logistics", tallyVer: "Tally Prime 4.6", company: "AutoFlow Chennai", gstin: "33AABCA9012C3Z1", lastSync: "2026-07-28 03:15", status: "Connected" },
  { id: "TLY-004", name: "AutoFlow Kolkata DC", tallyVer: "Tally Prime 4.8", company: "AutoFlow Kolkata", gstin: "19AABCA3456D4Z9", lastSync: "2026-07-28 04:30", status: "Connected" },
  { id: "TLY-005", name: "AutoFlow Bangalore South", tallyVer: "Tally Prime 4.7", company: "AutoFlow Bangalore", gstin: "29AABCA7890E5Z7", lastSync: "2026-07-27 22:10", status: "Disconnected" },
  { id: "TLY-006", name: "AutoFlow Pune West", tallyVer: "Tally Prime 4.8", company: "AutoFlow Pune", gstin: "27AABCA1234F6Z5", lastSync: "2026-07-28 04:25", status: "Connected" },
  { id: "TLY-007", name: "AutoFlow Central Accounts", tallyVer: "Tally Prime 4.8", company: "AutoFlow HO", gstin: "27AABCA5678G1Z3", lastSync: "2026-07-28 04:33", status: "Syncing" },
  { id: "TLY-008", name: "AutoFlow Tax Unit", tallyVer: "Tally Prime 4.6", company: "AutoFlow Tax", gstin: "27AABCA9012H2Z1", lastSync: "2026-07-28 04:20", status: "Connected" },
  { id: "TLY-009", name: "AutoFlow East Region", tallyVer: "Tally Prime 4.5", company: "AutoFlow East", gstin: "19AABCA3456I3Z9", lastSync: "2026-07-27 18:00", status: "Disconnected" },
  { id: "TLY-010", name: "AutoFlow North accounts", tallyVer: "Tally Prime 4.8", company: "AutoFlow North", gstin: "07AABCA7890J4Z7", lastSync: "2026-07-28 04:18", status: "Connected" },
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Sync records
const syncRecords = (() => {
  const result: Array<{
    id: string; voucher: string; company: typeof COMPANIES[0]; docType: string;
    ledgerDr: string; ledgerCr: string; amount: number; gst: number; status: string;
    syncTime: string; attempts: number; error: string | null; timestamp: string;
  }> = []
  for (let i = 0; i < 150; i++) {
    const status = pick(SYNC_STATUSES)
    const company = pick(COMPANIES)
    const docType = pick(DOC_TYPES)
    const amount = rand() > 0.3 ? rInt(5000, 500000) : rInt(100000, 2000000)
    const gstRate = pick(GST_RATES)
    const gstPct = gstRate === "Nil (0%)" || gstRate === "Exempt" ? 0 : parseFloat(gstRate) / 100
    const gst = Math.round(amount * gstPct)
    const isError = status === "Failed"
    const hour = String(rInt(0, 23)).padStart(2, "0")
    const min = String(rInt(0, 59)).padStart(2, "0")
    result.push({
      id: `SYNC-${String(i + 1).padStart(4, "0")}`,
      voucher: `V-${2026}${String(rInt(1, 999)).padStart(4, "0")}`,
      company, docType,
      ledgerDr: status !== "Failed" ? pick(LEDGERS) : "Stock In Hand",
      ledgerCr: pick(LEDGERS),
      amount, gst, status,
      syncTime: `${(rand() * 4 + 0.5).toFixed(1)}s`,
      attempts: status === "Failed" ? rInt(2, 5) : 1,
      error: isError ? pick(ERROR_TYPES) : null,
      timestamp: `2026-07-28 ${hour}:${min}`,
    })
  }
  return result
})()

// Monthly trend
const monthlyTrend = MONTHS.map((m) => ({
  month: m,
  synced: rInt(250, 400),
  failed: rInt(5, 25),
  successRate: +(rand() * 5 + 92).toFixed(1),
}))

// Doc type distribution
const docTypeDist = DOC_TYPES.map((d) => ({ type: d, count: rInt(15, 60) }))

// Warehouse sync
const warehouseSync = WAREHOUSES.map((w) => ({ warehouse: w, syncs: rInt(200, 500), avgTime: +(rand() * 3 + 0.5).toFixed(1) }))

// GST distribution
const gstDist = GST_RATES.map((r) => ({ rate: r, count: rInt(30, 200) }))

// Ledger reconciliation
const ledgerRecon = LEDGERS.map((ledger) => {
  const tallyBal = rInt(50000, 5000000)
  const variance = rInt(-50000, 50000)
  return {
    ledger, tallyBal, whBal: tallyBal + variance,
    difference: Math.abs(variance),
    variancePct: +(Math.abs(variance) / tallyBal * 100).toFixed(2),
    status: Math.abs(variance) < 1000 ? "Matched" : Math.abs(variance) < 10000 ? "Pending" : "Mismatch",
    lastReconciled: `${rInt(1, 6)}h ago`,
  }
})

// Discrepancy breakdown
const discrepancyDist = [
  { type: "Amount Mismatch", count: rInt(10, 40) },
  { type: "Missing Entry", count: rInt(5, 20) },
  { type: "GST Variance", count: rInt(8, 30) },
  { type: "Posting Error", count: rInt(3, 15) },
]

// GST monthly
const gstMonthly = MONTHS.map((m) => ({
  month: m,
  cgst: rInt(100000, 800000),
  sgst: rInt(100000, 800000),
  igst: rInt(50000, 400000),
}))

// GST rate-wise transactions
const gstRateTx = GST_RATES.map((r) => ({ rate: r, inward: rInt(50, 300), outward: rInt(50, 300) }))

// GST filing
const gstFiling = MONTHS.map((m, i) => ({
  month: `FY26-${m}`,
  gstr1Status: i < 11 ? "Filed" : i === 11 ? "Pending" : "Filed",
  gstr3bStatus: i < 10 ? "Filed" : i === 10 ? "Overdue" : "Pending",
  filedDate: i < 10 ? `2026-${String(i + 8).padStart(2, "0")}-${rInt(10, 20)}` : "—",
  lateFee: i < 10 ? 0 : rInt(200, 5000),
}))

// Error log
const errorLog = (() => {
  const result: Array<{
    id: string; timestamp: string; syncId: string; company: typeof COMPANIES[0];
    docType: string; errorType: string; message: string; severity: string;
    status: string; resolution: string | null; timeToResolve: string | null;
  }> = []
  for (let i = 0; i < 80; i++) {
    const sev = pick(SEVERITIES)
    const isResolved = rand() > 0.4
    const hour = String(rInt(0, 23)).padStart(2, "0")
    result.push({
      id: `ERR-${String(i + 1).padStart(4, "0")}`,
      timestamp: `2026-07-28 ${hour}:${String(rInt(0, 59)).padStart(2, "0")}`,
      syncId: `SYNC-${String(rInt(1, 150)).padStart(4, "0")}`,
      company: pick(COMPANIES),
      docType: pick(DOC_TYPES),
      errorType: pick(ERROR_TYPES),
      message: `${pick(ERROR_TYPES)}: Voucher posting ${rand() > 0.5 ? "rejected" : "timeout"} after ${rInt(1, 30)}s`,
      severity: sev,
      status: isResolved ? "Resolved" : rand() > 0.5 ? "Open" : "Escalated",
      resolution: isResolved ? pick(["Retry succeeded", "Ledger corrected", "GST rate updated", "Connection reset", "Auth token refreshed"]) : null,
      timeToResolve: isResolved ? `${rInt(1, 15)}m` : null,
    })
  }
  return result
})()

// Error type distribution
const errorTypeDist = ERROR_TYPES.map((e) => ({ type: e, count: rInt(5, 30) }))

// Hourly error trend
const hourlyErrors = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  errors: rInt(0, 8),
  resolved: rInt(0, 6),
}))

const COLORS_VIOLET = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#ec4899", "#6366f1", "#14b8a6"]
const STATUS_COLORS: Record<string, string> = {
  Pending: "tally-badge-pending", Syncing: "tally-badge-syncing", Synced: "tally-badge-synced",
  Failed: "tally-badge-failed", Queued: "tally-badge-queued", Reversed: "tally-badge-reversed",
}
const DOC_COLORS: Record<string, string> = {
  "Purchase Voucher": "tally-badge-purchase", "Sales Voucher": "tally-badge-sales",
  "Credit Note": "tally-badge-credit", "Debit Note": "tally-badge-debit",
  "Journal Entry": "tally-badge-journal", "Receipt": "tally-badge-receipt",
  "Payment": "tally-badge-payment", "Contra": "tally-badge-contra",
}
const SEVERITY_COLORS: Record<string, string> = {
  Critical: "tally-badge-critical", High: "tally-badge-high", Medium: "tally-badge-medium", Low: "tally-badge-low",
}
const GST_COLORS: Record<string, string> = {
  "Filed": "tally-badge-filed", "Pending": "tally-badge-gst-pending", "Overdue": "tally-badge-overdue",
}

const fmtRupee = (n: number) => `₹${n.toLocaleString("en-IN")}`

export default function TallyIntegrationView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [syncSearch, setSyncSearch] = useState("")
  const [syncStatusFilter, setSyncStatusFilter] = useState("All")
  const [syncDocFilter, setSyncDocFilter] = useState("All")
  const [selectedSync, setSelectedSync] = useState<typeof syncRecords[0] | null>(null)
  const [errorSearch, setErrorSearch] = useState("")
  const [errorStatusFilter, setErrorStatusFilter] = useState("All")

  const filteredSync = (() => {
    const q = syncSearch.toLowerCase()
    return syncRecords.filter((s) => {
      const matchSearch = !q || s.id.toLowerCase().includes(q) || s.voucher.toLowerCase().includes(q)
        || s.company.name.toLowerCase().includes(q) || s.ledgerDr.toLowerCase().includes(q)
        || s.docType.toLowerCase().includes(q)
      const matchStatus = syncStatusFilter === "All" || s.status === syncStatusFilter
      const matchDoc = syncDocFilter === "All" || s.docType === syncDocFilter
      return matchSearch && matchStatus && matchDoc
    })
  })()
  const visibleSync = filteredSync.slice(0, 60)

  const filteredErrors = (() => {
    const q = errorSearch.toLowerCase()
    return errorLog.filter((e) => {
      const matchSearch = !q || e.id.toLowerCase().includes(q) || e.company.name.toLowerCase().includes(q)
        || e.errorType.toLowerCase().includes(q) || e.message.toLowerCase().includes(q)
      const matchStatus = errorStatusFilter === "All" || e.status === errorStatusFilter
      return matchSearch && matchStatus
    })
  })()
  const visibleErrors = filteredErrors.slice(0, 60)

  const connectedCount = COMPANIES.filter((c) => c.status === "Connected").length
  const syncingCount = COMPANIES.filter((c) => c.status === "Syncing").length
  const disconnectedCount = COMPANIES.filter((c) => c.status === "Disconnected").length

  return (
    <div className="tally-container">
      {/* Header */}
      <div className="tally-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <RefreshCw className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tally Integration</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Accounting Interface & GST Compliance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="tally-status-dot tally-status-connected" />
          <span className="text-xs text-gray-500">{connectedCount} Connected</span>
          <span className="tally-status-dot tally-status-syncing" />
          <span className="text-xs text-gray-500">{syncingCount} Syncing</span>
          {disconnectedCount > 0 && (
            <>
              <span className="tally-status-dot tally-status-disconnected" />
              <span className="text-xs text-gray-500">{disconnectedCount} Down</span>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tally-tabs-wrapper mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Dashboard</TabsTrigger>
            <TabsTrigger value="sync" className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" />Sync Queue</TabsTrigger>
            <TabsTrigger value="recon" className="gap-1.5"><Database className="h-3.5 w-3.5" />Reconciliation</TabsTrigger>
            <TabsTrigger value="gst" className="gap-1.5"><FileText className="h-3.5 w-3.5" />GST Compliance</TabsTrigger>
            <TabsTrigger value="errors" className="gap-1.5"><AlertTriangle className="h-3.5 w-3.5" />Error & Audit</TabsTrigger>
          </TabsList>

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="mt-4 space-y-4">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { title: "Total Syncs", val: "342", icon: RefreshCw, cls: "tally-kpi-violet" },
                  { title: "Synced", val: "298", icon: CheckCircle2, cls: "tally-kpi-emerald" },
                  { title: "Failed", val: "12", icon: AlertCircle, cls: "tally-kpi-rose" },
                  { title: "Pending", val: "18", icon: Clock, cls: "tally-kpi-amber" },
                  { title: "Success Rate", val: "94.7%", icon: TrendingUp, cls: "tally-kpi-cyan" },
                  { title: "Avg Sync", val: "1.8s", icon: Zap, cls: "tally-kpi-teal" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("tally-kpi-card rounded-xl p-3", kpi.cls)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className="h-3.5 w-3.5 text-white/50" />
                    </div>
                    <div className="text-lg font-bold text-white">{kpi.val}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Sync Volume & Success</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><ComposedChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="synced" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Synced" />
                    <Bar dataKey="failed" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Failed" />
                    <Line type="monotone" dataKey="successRate" stroke="#10b981" strokeWidth={2} dot={false} name="Success %" />
                  </ComposedChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Document Type Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={docTypeDist} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="count" nameKey="type" label={({ type, percent }) => `${type.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {docTypeDist.map((_, i) => <Cell key={i} fill={COLORS_VIOLET[i % COLORS_VIOLET.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse Sync Performance</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={220}><BarChart data={warehouseSync}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="warehouse" fontSize={10} angle={-25} textAnchor="end" height={50} />
                    <YAxis fontSize={11} /><Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="syncs" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Syncs" />
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">GST Rate Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={220}><PieChart>
                    <Pie data={gstDist} cx="50%" cy="50%" innerRadius={45} outerRadius={85} dataKey="count" nameKey="rate" label={({ rate, percent }) => `${rate} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {gstDist.map((_, i) => <Cell key={i} fill={COLORS_VIOLET[i % COLORS_VIOLET.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              {/* Connection Status Grid */}
              <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Tally Company Connection Status</CardTitle></CardHeader><CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {COMPANIES.map((c) => (
                    <div key={c.id} className={cn("tally-company-card rounded-lg p-3 border", c.status === "Connected" ? "border-emerald-200 dark:border-emerald-800" : c.status === "Syncing" ? "border-cyan-200 dark:border-cyan-800" : "border-red-200 dark:border-red-800")}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("tally-status-dot", c.status === "Connected" ? "tally-status-connected" : c.status === "Syncing" ? "tally-status-syncing" : "tally-status-disconnected")} />
                        <span className="text-[10px] font-semibold truncate">{c.company}</span>
                      </div>
                      <div className="text-[9px] text-gray-500">{c.tallyVer}</div>
                      <div className="text-[9px] text-gray-400 mt-1">Last: {c.lastSync}</div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 2: SYNC QUEUE */}
          {activeTab === "sync" && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2 tally-filter-bar">
                <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" /><input type="text" placeholder="Sync ID / Voucher / Company / Ledger..." value={syncSearch} onChange={(e) => setSyncSearch(e.target.value)} className="tally-input w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" /></div>
                <select value={syncStatusFilter} onChange={(e) => setSyncStatusFilter(e.target.value)} className="tally-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2">
                  <option value="All">All Status</option>{SYNC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={syncDocFilter} onChange={(e) => setSyncDocFilter(e.target.value)} className="tally-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2">
                  <option value="All">All Doc Types</option>{DOC_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="tally-table-wrapper overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <Table><TableHeader><TableRow>
                  <TableHead className="text-[10px]">Sync ID</TableHead><TableHead className="text-[10px]">Voucher</TableHead>
                  <TableHead className="text-[10px]">Company</TableHead><TableHead className="text-[10px]">Doc Type</TableHead>
                  <TableHead className="text-[10px]">Ledger Dr</TableHead><TableHead className="text-[10px]">Ledger Cr</TableHead>
                  <TableHead className="text-[10px]">Amount ₹</TableHead><TableHead className="text-[10px]">GST ₹</TableHead>
                  <TableHead className="text-[10px]">Status</TableHead><TableHead className="text-[10px]">Time</TableHead>
                  <TableHead className="text-[10px]">Attempts</TableHead><TableHead className="text-[10px] hidden lg:table-cell">Error</TableHead>
                  <TableHead className="text-[10px]">Actions</TableHead>
                </TableRow></TableHeader><TableBody>
                  {visibleSync.map((s) => (
                    <TableRow key={s.id} className={cn("text-xs", s.status === "Failed" ? "tally-row-failed" : s.status === "Syncing" ? "tally-row-syncing" : "")}>
                      <TableCell className="font-mono font-medium">{s.id}</TableCell>
                      <TableCell className="font-mono">{s.voucher}</TableCell>
                      <TableCell><span className="truncate block max-w-[120px]">{s.company.company}</span></TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0", DOC_COLORS[s.docType] || "tally-badge-purchase")}>{s.docType.split(" ")[0]}</Badge></TableCell>
                      <TableCell className="max-w-[100px] truncate">{s.ledgerDr}</TableCell>
                      <TableCell className="max-w-[100px] truncate">{s.ledgerCr}</TableCell>
                      <TableCell className="font-mono font-medium">{fmtRupee(s.amount)}</TableCell>
                      <TableCell className="font-mono">{fmtRupee(s.gst)}</TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0", STATUS_COLORS[s.status])}>{s.status}</Badge></TableCell>
                      <TableCell className="tabular-nums">{s.syncTime}</TableCell>
                      <TableCell className={cn("tabular-nums", s.attempts > 1 && "text-red-500 font-semibold")}>{s.attempts}</TableCell>
                      <TableCell className="hidden lg:table-cell"><span className="text-red-500 text-[10px] truncate block max-w-[120px]">{s.error || "—"}</span></TableCell>
                      <TableCell><Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => setSelectedSync(s)}><Eye className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody></Table>
              </div>
              <div className="text-xs text-gray-400 text-right">Showing {visibleSync.length} of {filteredSync.length} records</div>
            </div>
          )}

          {/* TAB 3: RECONCILIATION */}
          {activeTab === "recon" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Ledgers Mapped", val: "24", icon: Database, cls: "tally-kpi-violet" },
                  { title: "Unmapped", val: "3", icon: Unplug, cls: "tally-kpi-amber" },
                  { title: "Discrepancies", val: "8", icon: AlertTriangle, cls: "tally-kpi-rose" },
                  { title: "Last Reconciled", val: "2h ago", icon: Clock, cls: "tally-kpi-cyan" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("tally-kpi-card rounded-xl p-3", kpi.cls)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className="h-3.5 w-3.5 text-white/50" />
                    </div>
                    <div className="text-lg font-bold text-white">{kpi.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">WH vs Tally Balance</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={300}><BarChart data={ledgerRecon.slice(0, 12)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" fontSize={10} /><YAxis type="category" dataKey="ledger" fontSize={9} width={90} />
                    <Tooltip formatter={(v: number) => fmtRupee(v)} /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="tallyBal" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Tally Balance" />
                    <Bar dataKey="whBal" fill="#06b6d4" radius={[0, 4, 4, 0]} name="WH Balance" />
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Discrepancy Breakdown</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={300}><PieChart>
                    <Pie data={discrepancyDist} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="count" nameKey="type" label={({ type, percent }) => `${type.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {discrepancyDist.map((_, i) => <Cell key={i} fill={COLORS_VIOLET[i % COLORS_VIOLET.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <div className="tally-table-wrapper overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <Table><TableHeader><TableRow>
                  <TableHead className="text-[10px]">Ledger</TableHead><TableHead className="text-[10px]">Tally Bal ₹</TableHead>
                  <TableHead className="text-[10px]">WH Bal ₹</TableHead><TableHead className="text-[10px]">Difference ₹</TableHead>
                  <TableHead className="text-[10px]">Variance %</TableHead><TableHead className="text-[10px]">Status</TableHead>
                  <TableHead className="text-[10px]">Last Recon</TableHead><TableHead className="text-[10px]">Action</TableHead>
                </TableRow></TableHeader><TableBody>
                  {ledgerRecon.map((r) => (
                    <TableRow key={r.ledger} className={cn("text-xs", r.status === "Mismatch" ? "tally-row-failed" : "")}>
                      <TableCell className="font-medium">{r.ledger}</TableCell>
                      <TableCell className="font-mono">{fmtRupee(r.tallyBal)}</TableCell>
                      <TableCell className="font-mono">{fmtRupee(r.whBal)}</TableCell>
                      <TableCell className={cn("font-mono font-semibold", r.difference > 10000 ? "text-red-500" : r.difference > 1000 ? "text-amber-500" : "text-emerald-500")}>{fmtRupee(r.difference)}</TableCell>
                      <TableCell className={cn("tabular-nums", parseFloat(r.variancePct) > 2 ? "text-red-500" : parseFloat(r.variancePct) > 0.5 ? "text-amber-500" : "text-emerald-500")}>{r.variancePct}%</TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0", r.status === "Matched" ? "tally-badge-synced" : r.status === "Pending" ? "tally-badge-queued" : "tally-badge-failed")}>{r.status}</Badge></TableCell>
                      <TableCell className="text-gray-500">{r.lastReconciled}</TableCell>
                      <TableCell><Button size="sm" variant="ghost" className="h-7 text-[10px]"><RefreshCw className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody></Table>
              </div>
            </div>
          )}

          {/* TAB 4: GST COMPLIANCE */}
          {activeTab === "gst" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "GST Entries", val: "856", icon: FileText, cls: "tally-kpi-violet" },
                  { title: "GSTR-1 Filed", val: "11/12", icon: CheckCircle2, cls: "tally-kpi-emerald" },
                  { title: "GSTR-3B Filed", val: "10/12", icon: CheckCircle2, cls: "tally-kpi-cyan" },
                  { title: "Input Credit", val: "₹24.5L", icon: IndianRupee, cls: "tally-kpi-amber" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("tally-kpi-card rounded-xl p-3", kpi.cls)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className="h-3.5 w-3.5 text-white/50" />
                    </div>
                    <div className="text-lg font-bold text-white">{kpi.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly GST Liability</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={260}><AreaChart data={gstMonthly}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip formatter={(v: number) => fmtRupee(v)} /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" stackId="1" dataKey="cgst" fill="#8b5cf680" stroke="#8b5cf6" name="CGST" />
                    <Area type="monotone" stackId="1" dataKey="sgst" fill="#06b6d480" stroke="#06b6d4" name="SGST" />
                    <Area type="monotone" stackId="1" dataKey="igst" fill="#10b98180" stroke="#10b981" name="IGST" />
                  </AreaChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">GST Rate-wise Transactions</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={260}><BarChart data={gstRateTx}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="rate" fontSize={10} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="inward" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Inward" />
                    <Bar dataKey="outward" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Outward" />
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <div className="tally-table-wrapper overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <Table><TableHeader><TableRow>
                  <TableHead className="text-[10px]">Period</TableHead><TableHead className="text-[10px]">GSTR-1</TableHead>
                  <TableHead className="text-[10px]">GSTR-3B</TableHead><TableHead className="text-[10px]">Filed Date</TableHead>
                  <TableHead className="text-[10px]">Late Fee ₹</TableHead><TableHead className="text-[10px]">Status</TableHead>
                </TableRow></TableHeader><TableBody>
                  {gstFiling.map((g) => (
                    <TableRow key={g.month} className={cn("text-xs", g.gstr3bStatus === "Overdue" ? "tally-row-failed" : "")}>
                      <TableCell className="font-medium">{g.month}</TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0", GST_COLORS[g.gstr1Status])}>{g.gstr1Status}</Badge></TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0", GST_COLORS[g.gstr3bStatus])}>{g.gstr3bStatus}</Badge></TableCell>
                      <TableCell className="text-gray-500">{g.filedDate}</TableCell>
                      <TableCell className={cn("font-mono", g.lateFee > 0 ? "text-red-500 font-semibold" : "text-emerald-500")}>{g.lateFee > 0 ? fmtRupee(g.lateFee) : "—"}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-[9px] px-1.5 py-0", g.gstr3bStatus === "Filed" ? "tally-badge-filed" : g.gstr3bStatus === "Overdue" ? "tally-badge-overdue" : "tally-badge-gst-pending")}>
                          {g.gstr3bStatus === "Filed" && g.gstr1Status === "Filed" ? "Complete" : g.gstr3bStatus === "Overdue" ? "Action Required" : "In Progress"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody></Table>
              </div>
            </div>
          )}

          {/* TAB 5: ERROR & AUDIT */}
          {activeTab === "errors" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Errors Today", val: "12", icon: AlertTriangle, cls: "tally-kpi-rose" },
                  { title: "Resolved", val: "8", icon: CheckCircle2, cls: "tally-kpi-emerald" },
                  { title: "Resolution Rate", val: "66.7%", icon: TrendingUp, cls: "tally-kpi-violet" },
                  { title: "Avg Resolution", val: "4.2m", icon: Clock, cls: "tally-kpi-cyan" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("tally-kpi-card rounded-xl p-3", kpi.cls)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className="h-3.5 w-3.5 text-white/50" />
                    </div>
                    <div className="text-lg font-bold text-white">{kpi.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Error Type Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={errorTypeDist} cx="50%" cy="50%" innerRadius={45} outerRadius={85} dataKey="count" nameKey="type" label={({ type, percent }) => `${type.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {errorTypeDist.map((_, i) => <Cell key={i} fill={COLORS_VIOLET[i % COLORS_VIOLET.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="tally-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Hourly Error Trend</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><ComposedChart data={hourlyErrors}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" fontSize={9} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="errors" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Errors" />
                    <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={false} name="Resolved" />
                  </ComposedChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              {/* Error filter */}
              <div className="flex flex-wrap gap-2 tally-filter-bar">
                <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" /><input type="text" placeholder="Error ID / Company / Type / Message..." value={errorSearch} onChange={(e) => setErrorSearch(e.target.value)} className="tally-input w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" /></div>
                <select value={errorStatusFilter} onChange={(e) => setErrorStatusFilter(e.target.value)} className="tally-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2">
                  <option value="All">All Status</option>
                  <option>Open</option><option>Resolved</option><option>Escalated</option>
                </select>
              </div>

              <div className="tally-table-wrapper overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <Table><TableHeader><TableRow>
                  <TableHead className="text-[10px]">Error ID</TableHead><TableHead className="text-[10px]">Timestamp</TableHead>
                  <TableHead className="text-[10px]">Sync ID</TableHead><TableHead className="text-[10px]">Company</TableHead>
                  <TableHead className="text-[10px]">Error Type</TableHead><TableHead className="text-[10px] hidden md:table-cell">Message</TableHead>
                  <TableHead className="text-[10px]">Severity</TableHead><TableHead className="text-[10px]">Status</TableHead>
                  <TableHead className="text-[10px] hidden lg:table-cell">Resolution</TableHead>
                  <TableHead className="text-[10px] hidden lg:table-cell">TTR</TableHead>
                  <TableHead className="text-[10px]">Action</TableHead>
                </TableRow></TableHeader><TableBody>
                  {visibleErrors.map((e) => (
                    <TableRow key={e.id} className={cn("text-xs", e.status === "Escalated" ? "tally-row-failed" : e.status === "Open" ? "tally-row-syncing" : "")}>
                      <TableCell className="font-mono font-medium">{e.id}</TableCell>
                      <TableCell className="tabular-nums">{e.timestamp}</TableCell>
                      <TableCell className="font-mono">{e.syncId}</TableCell>
                      <TableCell className="truncate max-w-[100px]">{e.company.company}</TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0 tally-badge-error-type")}>{e.errorType.split(" ").slice(0, 2).join(" ")}</Badge></TableCell>
                      <TableCell className="hidden md:table-cell text-red-500 truncate max-w-[180px]">{e.message}</TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0", SEVERITY_COLORS[e.severity])}>{e.severity}</Badge></TableCell>
                      <TableCell><Badge className={cn("text-[9px] px-1.5 py-0", e.status === "Resolved" ? "tally-badge-synced" : e.status === "Escalated" ? "tally-badge-escalated" : "tally-badge-syncing")}>{e.status}</Badge></TableCell>
                      <TableCell className="hidden lg:table-cell text-emerald-600 truncate max-w-[120px]">{e.resolution || "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell tabular-nums">{e.timeToResolve || "—"}</TableCell>
                      <TableCell><Button size="sm" variant="ghost" className="h-7 text-[10px]"><Eye className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody></Table>
              </div>
              <div className="text-xs text-gray-400 text-right">Showing {visibleErrors.length} of {filteredErrors.length} records</div>
            </div>
          )}
        </Tabs>
      </div>

      {/* Sync Detail Drawer */}
      {selectedSync && (
        <div className="tally-drawer-overlay" onClick={() => setSelectedSync(null)}>
          <div className="tally-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Sync Detail: {selectedSync.id}</h3>
              <Button size="sm" variant="ghost" onClick={() => setSelectedSync(null)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
            </div>

            {/* Status Banner */}
            <div className={cn("tally-drawer-banner rounded-lg p-3 mb-4", selectedSync.status === "Synced" ? "tally-banner-synced" : selectedSync.status === "Syncing" ? "tally-banner-syncing" : selectedSync.status === "Failed" ? "tally-banner-failed" : selectedSync.status === "Reversed" ? "tally-banner-reversed" : "tally-banner-pending")}>
              <div className="flex items-center gap-2">
                {selectedSync.status === "Synced" ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> :
                 selectedSync.status === "Failed" ? <AlertCircle className="h-4 w-4 text-red-300" /> :
                 selectedSync.status === "Syncing" ? <RefreshCw className="h-4 w-4 text-cyan-300 animate-spin" /> :
                 <Clock className="h-4 w-4 text-gray-300" />}
                <span className="text-sm font-semibold text-white">{selectedSync.status}</span>
                {selectedSync.status === "Syncing" && <span className="tally-pulse-dot" />}
              </div>
            </div>

            {/* Sync Flow */}
            <div className="tally-flow mb-4">
              <div className="flex items-center justify-between">
                {["WH Event", "Mapper", "Tally API", "Response"].map((step, i) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={cn("tally-flow-dot", i === 0 ? "tally-dot-violet" : i === 1 ? "tally-dot-cyan" : i === 2 ? "tally-dot-emerald" : "tally-dot-amber", i < 3 && selectedSync.status !== "Failed" ? "scale-100" : i === 3 && selectedSync.status === "Synced" ? "scale-100" : "opacity-40")} />
                      <span className="text-[9px] mt-1 text-gray-500">{step}</span>
                    </div>
                    {i < 3 && <ArrowRight className="h-3 w-3 text-gray-300 mx-1" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "Sync ID", value: selectedSync.id }, { label: "Voucher", value: selectedSync.voucher },
                { label: "Company", value: selectedSync.company.company }, { label: "Doc Type", value: selectedSync.docType },
                { label: "Ledger Dr", value: selectedSync.ledgerDr }, { label: "Ledger Cr", value: selectedSync.ledgerCr },
                { label: "Amount", value: fmtRupee(selectedSync.amount) }, { label: "GST Rate", value: fmtRupee(selectedSync.gst) },
              ].map((item) => (
                <div key={item.label} className="tally-info-box rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                  <div className="text-[9px] text-gray-400 uppercase">{item.label}</div>
                  <div className="text-xs font-medium">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Tax Computation */}
            <div className="tally-tax-box rounded-lg p-3 mb-4">
              <div className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Tax Computation</div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Taxable", val: fmtRupee(selectedSync.amount - selectedSync.gst), cls: "" },
                  { label: "CGST", val: fmtRupee(Math.round(selectedSync.gst / 2)), cls: "" },
                  { label: "SGST", val: fmtRupee(Math.round(selectedSync.gst / 2)), cls: "" },
                  { label: "Total Tax", val: fmtRupee(selectedSync.gst), cls: "font-semibold text-emerald-700 dark:text-emerald-300" },
                ].map((t) => (
                  <div key={t.label} className="text-center">
                    <div className="text-[9px] text-emerald-600 dark:text-emerald-400">{t.label}</div>
                    <div className={cn("text-xs font-mono", t.cls)}>{t.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Box (if failed) */}
            {selectedSync.status === "Failed" && (
              <div className="tally-error-box rounded-lg p-3 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-[10px] font-semibold text-red-700 dark:text-red-300">Error Details</span>
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">{selectedSync.error}</div>
                <div className="text-[10px] text-gray-500 mt-1">Retry attempts: {selectedSync.attempts}</div>
              </div>
            )}

            {/* Timeline */}
            <div className="tally-timeline mb-4">
              <div className="text-[10px] font-semibold text-gray-500 mb-2">Sync Timeline</div>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
                {[
                  { step: "Queued", time: selectedSync.timestamp, done: true },
                  { step: "Mapping", time: "04:32:01", done: selectedSync.status !== "Failed" || true },
                  { step: "Validation", time: "04:32:01", done: ["Synced", "Reversed"].includes(selectedSync.status) },
                  { step: "Posting", time: "04:32:02", done: selectedSync.status === "Synced" },
                  { step: "Confirmed", time: selectedSync.status === "Synced" ? "04:32:03" : "—", done: selectedSync.status === "Synced" },
                ].map((t, i) => (
                  <div key={t.step} className="flex flex-col items-center relative z-10">
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold", t.done ? "bg-emerald-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400")}>
                      {t.done ? "✓" : i + 1}
                    </div>
                    <span className="text-[9px] mt-1 text-gray-500">{t.step}</span>
                    <span className="text-[8px] text-gray-400">{t.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="tally-drawer-footer flex justify-between text-[10px] text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Duration: {selectedSync.syncTime}</span>
              <span>Company: {selectedSync.company.tallyVer}</span>
              <span>Attempts: {selectedSync.attempts}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
