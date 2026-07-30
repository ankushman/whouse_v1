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
  Layers, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, Eye, X, Clock, Package, ArrowRight,
  Hash, ThermometerSun, FlaskConical, CalendarClock,
  ChevronRight, ShieldAlert, Boxes, RotateCcw, FileText,
  Timer, Bell, AlertOctagon, Calendar, Beaker, ScanBarcode,
  PackageCheck, Warehouse, Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(138138)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const rDate = (start: number, end: number) => {
  const ts = new Date(2026, 6, rInt(start, end)).toISOString().split("T")[0]
  return ts
}

const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"]
const BATCH_STATUSES = ["Active", "Quarantine", "On Hold", "Expired", "Consumed", "Recalled", "In Transit"]
const LOT_CATEGORIES = ["Pharmaceutical", "Food & Beverage", "Chemical", "FMCG", "Auto Parts", "Textile", "Electronics", "Agriculture"]
const STORAGE_CONDITIONS = ["Ambient", "Cold Chain (2-8°C)", "Frozen (-18°C)", "Cool (15-25°C)", "Humidity Controlled", "Temperature Controlled"]
const COMPLIANCE_STANDARDS = ["FSSAI", "CDSCO", "ISO 9001", "WHO-GMP", "EU-GMP", "US-FDA", "BIS", "AGMARK"]
const EXPIRY_STATUS = ["Fresh (>90d)", "Approaching (30-90d)", "Near Expiry (<30d)", "Expired"]
const RETENTION_POLICIES = ["FIFO", "FEFO", "LIFO", "FIFO+Expiry Override"]

const PRODUCTS = [
  { sku: "PRD-001", name: "Paracetamol 500mg Tabs", category: "Pharmaceutical", hs: "3004.90" },
  { sku: "PRD-002", name: "Amoxicillin 250mg Caps", category: "Pharmaceutical", hs: "3004.10" },
  { sku: "PRD-003", name: "ORS Sachets 21.8g", category: "Pharmaceutical", hs: "3004.90" },
  { sku: "PRD-004", name: "Basmati Rice Premium 5kg", category: "Food & Beverage", hs: "1006.30" },
  { sku: "PRD-005", name: "Olive Oil Extra Virgin 1L", category: "Food & Beverage", hs: "1509.10" },
  { sku: "PRD-006", name: "Milk Powder Full Cream 1kg", category: "Food & Beverage", hs: "0402.21" },
  { sku: "PRD-007", name: "Hydrogen Peroxide 30%", category: "Chemical", hs: "2847.00" },
  { sku: "PRD-008", name: "Ethanol Absolute 99.9%", category: "Chemical", hs: "2207.10" },
  { sku: "PRD-009", name: "Laundry Detergent 5L", category: "FMCG", hs: "3402.20" },
  { sku: "PRD-010", name: "Brake Fluid DOT 4 500ml", category: "Auto Parts", hs: "3819.00" },
  { sku: "PRD-011", name: "Cotton Yarn 40s Count", category: "Textile", hs: "5205.15" },
  { sku: "PRD-012", name: "LED Driver IC 60W", category: "Electronics", hs: "8542.39" },
  { sku: "PRD-013", name: "Organic Wheat Flour 10kg", category: "Agriculture", hs: "1101.00" },
  { sku: "PRD-014", name: "Insulin Pen 100IU/ml", category: "Pharmaceutical", hs: "3004.90" },
  { sku: "PRD-015", name: "Anti-Rust Paint 20L", category: "Chemical", hs: "3209.00" },
]

// Batch/Lot records
const batchRecords = (() => {
  const result: Array<{
    id: string; batchNo: string; lotNo: string; product: typeof PRODUCTS[0];
    mfgDate: string; expDate: string; receivedDate: string;
    status: string; warehouse: string; zone: string;
    qtyReceived: number; qtyAvailable: number; qtyReserved: number; qtyDamaged: number;
    storageCondition: string; compliance: string[];
    retentionPolicy: string; shelfLifeDays: number; daysToExpiry: number;
    expiryStatus: string; supplier: string; grnRef: string; qcStatus: string;
    temperature: string; lastInspected: string;
  }> = []

  for (let i = 0; i < 150; i++) {
    const product = pick(PRODUCTS)
    const status = pick(BATCH_STATUSES)
    const warehouse = pick(WAREHOUSES)
    const shelfLife = product.category === "Pharmaceutical" ? rInt(180, 730)
      : product.category === "Food & Beverage" ? rInt(90, 365)
      : product.category === "Chemical" ? rInt(365, 1460)
      : rInt(180, 720)
    const mfgDate = rDate(1, 25)
    const expDate = (() => {
      const d = new Date(mfgDate)
      d.setDate(d.getDate() + shelfLife)
      return d.toISOString().split("T")[0]
    })()
    const daysToExpiry = (() => {
      const diff = new Date(expDate).getTime() - new Date("2026-07-28").getTime()
      return Math.ceil(diff / 86400000)
    })()
    const expStatus = daysToExpiry > 90 ? EXPIRY_STATUS[0]
      : daysToExpiry > 30 ? EXPIRY_STATUS[1]
      : daysToExpiry > 0 ? EXPIRY_STATUS[2]
      : EXPIRY_STATUS[3]
    const qtyRcv = rInt(100, 10000)
    const qtyRes = rInt(0, Math.floor(qtyRcv * 0.4))
    const qtyDmg = rInt(0, Math.floor(qtyRcv * 0.05))
    const compliance = (() => {
      const c: string[] = []
      if (product.category === "Pharmaceutical") { c.push("CDSCO", "WHO-GMP"); if (rand() > 0.5) c.push("US-FDA") }
      else if (product.category === "Food & Beverage") { c.push("FSSAI"); if (rand() > 0.5) c.push("AGMARK") }
      else if (product.category === "Chemical") { c.push("BIS"); if (rand() > 0.5) c.push("ISO 9001") }
      else c.push("ISO 9001")
      return c
    })()
    const zones = ["Zone A - Bulk", "Zone B - Picking", "Zone C - Cold", "Zone D - Hazmat", "Zone E - High-Value"]
    const zone = product.category === "Pharmaceutical" ? (rand() > 0.5 ? "Zone C - Cold" : "Zone E - High-Value")
      : product.category === "Chemical" ? "Zone D - Hazmat"
      : pick(zones)

    result.push({
      id: `BL-${String(i + 1).padStart(4, "0")}`,
      batchNo: `BATCH-${String(i + 1).padStart(5, "0")}`,
      lotNo: `LOT-${String(rInt(1, 500)).padStart(4, "0")}`,
      product,
      mfgDate,
      expDate,
      receivedDate: rDate(1, 28),
      status,
      warehouse,
      zone,
      qtyReceived: qtyRcv,
      qtyAvailable: qtyRcv - qtyRes - qtyDmg,
      qtyReserved: qtyRes,
      qtyDamaged: qtyDmg,
      storageCondition: product.category === "Pharmaceutical"
        ? (rand() > 0.4 ? "Cold Chain (2-8°C)" : "Temperature Controlled")
        : product.category === "Chemical" ? (rand() > 0.5 ? "Humidity Controlled" : "Ambient")
        : pick(STORAGE_CONDITIONS),
      compliance,
      retentionPolicy: product.category === "Pharmaceutical" ? "FEFO" : pick(RETENTION_POLICIES),
      shelfLifeDays: shelfLife,
      daysToExpiry,
      expiryStatus: expStatus,
      supplier: pick(["Sun Pharma", "Cipla Ltd", "Dabur India", "ITC Foods", "BASF India", "Hindustan Unilever", "Dr Reddys", "Marico Ltd", "Godrej Consumer", "Larsen & Toubro"]),
      grnRef: `GRN-${String(rInt(1000, 9999))}`,
      qcStatus: status === "Active" ? (rand() > 0.1 ? "Passed" : "Pending") : status === "Quarantine" ? "Failed" : "N/A",
      temperature: product.category === "Pharmaceutical" ? `${rInt(2, 8)}°C` : product.category === "Chemical" ? `${rInt(15, 35)}°C` : "Ambient",
      lastInspected: rDate(1, 28),
    })
  }
  return result
})()

// Expiry alerts
const expiryAlerts = (() => {
  return batchRecords
    .filter((b) => b.daysToExpiry <= 60 && b.status === "Active")
    .sort((a, b) => a.daysToExpiry - b.daysToExpiry)
    .map((b) => ({
      ...b,
      urgency: b.daysToExpiry <= 7 ? "Critical" : b.daysToExpiry <= 30 ? "Warning" : "Info",
    }))
})()

// Monthly data
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const COLORS = ["#7c3aed", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#06b6d4", "#f97316"]

const monthlyBatches = MONTHS.map((m) => ({
  month: m, created: rInt(20, 60), expired: rInt(2, 15), recalled: rInt(0, 5), consumed: rInt(30, 80),
}))

const monthlyCompliance = MONTHS.map((m) => ({
  month: m, fssai: rInt(85, 99), cdsc: rInt(80, 98), iso: rInt(90, 100), who: rInt(82, 99),
}))

const categoryDist = (() => {
  const counts: Record<string, number> = {}
  batchRecords.forEach((b) => { counts[b.product.category] = (counts[b.product.category] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
})()

const retentionDist = (() => {
  const counts: Record<string, number> = {}
  batchRecords.forEach((b) => { counts[b.retentionPolicy] = (counts[b.retentionPolicy] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

const warehouseBatchCount = WAREHOUSES.map((w) => ({
  warehouse: w, active: rInt(8, 25), quarantine: rInt(0, 5), expired: rInt(0, 8), recalled: rInt(0, 3),
}))

const expiryTimeline = (() => {
  const buckets = [
    { range: "Expired", count: batchRecords.filter((b) => b.daysToExpiry <= 0).length },
    { range: "0-30 days", count: batchRecords.filter((b) => b.daysToExpiry > 0 && b.daysToExpiry <= 30).length },
    { range: "31-60 days", count: batchRecords.filter((b) => b.daysToExpiry > 30 && b.daysToExpiry <= 60).length },
    { range: "61-90 days", count: batchRecords.filter((b) => b.daysToExpiry > 60 && b.daysToExpiry <= 90).length },
    { range: "91-180 days", count: batchRecords.filter((b) => b.daysToExpiry > 90 && b.daysToExpiry <= 180).length },
    { range: ">180 days", count: batchRecords.filter((b) => b.daysToExpiry > 180).length },
  ]
  return buckets
})()

const complianceViolations = (() => {
  const result: Array<{
    id: string; batchNo: string; product: string; standard: string;
    violation: string; severity: string; warehouse: string; date: string; status: string;
  }> = []
  for (let i = 0; i < 40; i++) {
    const b = pick(batchRecords)
    const standard = pick(COMPLIANCE_STANDARDS)
    const violations = ["Label mismatch", "Missing COA", "Expiry documentation gap", "Storage condition breach", "Missing GST label", "Temperature log gap", "Batch trace incomplete", "Retest overdue"]
    const severities = ["Critical", "Major", "Minor", "Observation"]
    result.push({
      id: `VIO-${String(i + 1).padStart(4, "0")}`,
      batchNo: b.batchNo,
      product: b.product.name,
      standard,
      violation: pick(violations),
      severity: pick(severities),
      warehouse: b.warehouse,
      date: rDate(1, 28),
      status: pick(["Open", "Under Review", "Resolved", "Escalated"]),
    })
  }
  return result
})()

// Storage condition distribution
const storageDist = (() => {
  const counts: Record<string, number> = {}
  batchRecords.forEach((b) => { counts[b.storageCondition] = (counts[b.storageCondition] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
})()

const STATUS_COLORS: Record<string, string> = {
  Active: "bl-badge-active", Quarantine: "bl-badge-quarantine", "On Hold": "bl-badge-hold",
  Expired: "bl-badge-expired", Consumed: "bl-badge-consumed", Recalled: "bl-badge-recalled", "In Transit": "bl-badge-transit",
}
const EXPIRY_COLORS: Record<string, string> = {
  "Fresh (>90d)": "bl-badge-fresh", "Approaching (30-90d)": "bl-badge-approaching",
  "Near Expiry (<30d)": "bl-badge-near-expiry", Expired: "bl-badge-expired",
}
const URGENCY_COLORS: Record<string, string> = {
  Critical: "bl-badge-critical", Warning: "bl-badge-warning", Info: "bl-badge-info",
}
const SEVERITY_COLORS: Record<string, string> = {
  Critical: "bl-badge-critical", Major: "bl-badge-major", Minor: "bl-badge-minor", Observation: "bl-badge-observation",
}
const COMPLIANCE_BG: Record<string, string> = {
  FSSAI: "bl-chip-fssai", CDSCO: "bl-chip-cdsco", "ISO 9001": "bl-chip-iso", "WHO-GMP": "bl-chip-who",
  "EU-GMP": "bl-chip-eu", "US-FDA": "bl-chip-fda", BIS: "bl-chip-bis", AGMARK: "bl-chip-agmark",
}

export default function BatchLotView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [expiryFilter, setExpiryFilter] = useState("All")
  const [selectedBatch, setSelectedBatch] = useState<typeof batchRecords[0] | null>(null)
  const [vioSearch, setVioSearch] = useState("")
  const [vioStatusFilter, setVioStatusFilter] = useState("All")

  const filteredBatches = (() => {
    const q = search.toLowerCase()
    return batchRecords.filter((b) => {
      const matchSearch = !q || b.batchNo.toLowerCase().includes(q) || b.lotNo.toLowerCase().includes(q)
        || b.product.name.toLowerCase().includes(q) || b.product.sku.toLowerCase().includes(q)
        || b.warehouse.toLowerCase().includes(q) || b.supplier.toLowerCase().includes(q)
      const matchStatus = statusFilter === "All" || b.status === statusFilter
      const matchCat = categoryFilter === "All" || b.product.category === categoryFilter
      const matchExp = expiryFilter === "All" || b.expiryStatus === expiryFilter
      return matchSearch && matchStatus && matchCat && matchExp
    })
  })()
  const visibleBatches = filteredBatches.slice(0, 60)

  const filteredVio = (() => {
    const q = vioSearch.toLowerCase()
    return complianceViolations.filter((v) => {
      const matchSearch = !q || v.batchNo.toLowerCase().includes(q) || v.product.toLowerCase().includes(q)
        || v.standard.toLowerCase().includes(q) || v.violation.toLowerCase().includes(q)
      const matchStatus = vioStatusFilter === "All" || v.status === vioStatusFilter
      return matchSearch && matchStatus
    })
  })()

  const activeCount = batchRecords.filter((b) => b.status === "Active").length
  const nearExpiryCount = batchRecords.filter((b) => b.daysToExpiry > 0 && b.daysToExpiry <= 30 && b.status === "Active").length
  const expiredCount = batchRecords.filter((b) => b.status === "Expired" || b.daysToExpiry <= 0).length
  const quarantineCount = batchRecords.filter((b) => b.status === "Quarantine").length
  const totalValue = batchRecords.reduce((acc, b) => acc + b.qtyAvailable * rInt(50, 500), 0)

  return (
    <div className="bl-container">
      {/* Header */}
      <div className="bl-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Batch & Lot Management</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">FIFO/FEFO Compliance · Expiry Tracking · Regulatory Standards</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bl-stat-chip"><span className="text-[10px] text-gray-500">Active Batches</span><span className="text-sm font-bold text-violet-600">{activeCount}</span></span>
          <span className="bl-stat-chip"><span className="text-[10px] text-gray-500">Near Expiry</span><span className="text-sm font-bold text-red-600">{nearExpiryCount}</span></span>
          <span className="bl-stat-chip"><span className="text-[10px] text-gray-500">Alerts</span><span className="text-sm font-bold text-amber-600">{expiryAlerts.length}</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bl-tabs-wrapper mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Dashboard</TabsTrigger>
            <TabsTrigger value="register" className="gap-1.5"><Hash className="h-3.5 w-3.5" />Batch Register</TabsTrigger>
            <TabsTrigger value="expiry" className="gap-1.5"><Timer className="h-3.5 w-3.5" />Expiry Alerts</TabsTrigger>
            <TabsTrigger value="compliance" className="gap-1.5"><FlaskConical className="h-3.5 w-3.5" />Compliance</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Analytics</TabsTrigger>
          </TabsList>

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { title: "Total Batches", val: "150", icon: Layers, cls: "bl-kpi-violet" },
                  { title: "Active", val: String(activeCount), icon: PackageCheck, cls: "bl-kpi-emerald" },
                  { title: "Near Expiry (<30d)", val: String(nearExpiryCount), icon: AlertTriangle, cls: "bl-kpi-red" },
                  { title: "Expired / Recalled", val: `${expiredCount} / ${batchRecords.filter((b) => b.status === "Recalled").length}`, icon: AlertOctagon, cls: "bl-kpi-amber" },
                  { title: "Quarantine", val: String(quarantineCount), icon: ShieldAlert, cls: "bl-kpi-orange" },
                  { title: "Compliance Rate", val: `${rInt(94, 99)}%`, icon: CheckCircle2, cls: "bl-kpi-sky" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("bl-kpi-card rounded-xl p-3", kpi.cls)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className="h-3.5 w-3.5 text-white/50" />
                    </div>
                    <div className="text-lg font-bold text-white">{kpi.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Batch Lifecycle</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><ComposedChart data={monthlyBatches}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="created" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Created" />
                    <Bar dataKey="consumed" fill="#10b981" radius={[4, 4, 0, 0]} name="Consumed" />
                    <Line type="monotone" dataKey="expired" stroke="#ef4444" strokeWidth={2} dot={false} name="Expired" />
                  </ComposedChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Category Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={categoryDist} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="count" nameKey="name" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Expiry Timeline Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><BarChart data={expiryTimeline}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="range" fontSize={10} /><YAxis fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Batches">
                      {expiryTimeline.map((entry, i) => (
                        <Cell key={i} fill={entry.range === "Expired" ? "#ef4444" : entry.range === "0-30 days" ? "#f97316" : entry.range === "31-60 days" ? "#f59e0b" : "#10b981"} />
                      ))}
                    </Bar>
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse Batch Status</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><BarChart data={warehouseBatchCount} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" fontSize={11} /><YAxis type="category" dataKey="warehouse" fontSize={10} width={95} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="active" fill="#7c3aed" stackId="a" name="Active" />
                    <Bar dataKey="quarantine" fill="#f97316" stackId="a" name="Quarantine" />
                    <Bar dataKey="expired" fill="#ef4444" stackId="a" name="Expired" />
                    <Bar dataKey="recalled" fill="#ec4899" stackId="a" name="Recalled" />
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              {/* Critical Expiry Alerts Quick View */}
              <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Bell className="h-4 w-4 text-red-500" />Critical Expiry Alerts ({expiryAlerts.filter((e) => e.urgency === "Critical").length} Critical)</CardTitle></CardHeader><CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead className="text-[10px]">Batch No</TableHead>
                      <TableHead className="text-[10px]">Product</TableHead>
                      <TableHead className="text-[10px]">Category</TableHead>
                      <TableHead className="text-[10px]">Expiry Date</TableHead>
                      <TableHead className="text-[10px]">Days Left</TableHead>
                      <TableHead className="text-[10px]">Warehouse</TableHead>
                      <TableHead className="text-[10px]">Qty Available</TableHead>
                      <TableHead className="text-[10px]">Urgency</TableHead>
                      <TableHead className="text-[10px]">Action</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {expiryAlerts.slice(0, 12).map((alert) => (
                        <TableRow key={alert.id} className="hover:bg-violet-50/50 dark:hover:bg-violet-950/20 cursor-pointer" onClick={() => setSelectedBatch(alert)}>
                          <TableCell className="text-[11px] font-mono font-semibold">{alert.batchNo}</TableCell>
                          <TableCell className="text-[11px]">{alert.product.name}</TableCell>
                          <TableCell className="text-[11px]">{alert.product.category}</TableCell>
                          <TableCell className="text-[11px] font-mono">{alert.expDate}</TableCell>
                          <TableCell className="text-[11px]">
                            <span className={cn("font-bold", alert.daysToExpiry <= 7 ? "text-red-600" : alert.daysToExpiry <= 30 ? "text-amber-600" : "text-emerald-600")}>
                              {alert.daysToExpiry > 0 ? `${alert.daysToExpiry}d` : "EXPIRED"}
                            </span>
                          </TableCell>
                          <TableCell className="text-[11px]">{alert.warehouse}</TableCell>
                          <TableCell className="text-[11px] font-semibold">{alert.qtyAvailable.toLocaleString()}</TableCell>
                          <TableCell><Badge className={cn("text-[9px]", URGENCY_COLORS[alert.urgency])}>{alert.urgency}</Badge></TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={(e) => { e.stopPropagation(); setSelectedBatch(alert) }}>
                              <Eye className="h-3 w-3 mr-1" />View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 2: BATCH REGISTER */}
          {activeTab === "register" && (
            <div className="mt-4 space-y-4">
              <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Filter className="h-4 w-4 text-violet-500" />Filter Batch Records</CardTitle></CardHeader><CardContent>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                    <input className="bl-filter-input pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full" placeholder="Batch, Lot, SKU, Product, Warehouse..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <select className="bl-filter-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">All Status</option>
                    {BATCH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="bl-filter-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="All">All Categories</option>
                    {LOT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="bl-filter-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2" value={expiryFilter} onChange={(e) => setExpiryFilter(e.target.value)}>
                    <option value="All">All Expiry</option>
                    {EXPIRY_STATUS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <Badge variant="outline" className="text-[10px]">{filteredBatches.length} results</Badge>
                </div>
              </CardContent></Card>

              <Card className="bl-chart-card"><CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow className="bl-table-header">
                      <TableHead className="text-[10px]">Batch No</TableHead>
                      <TableHead className="text-[10px]">Lot No</TableHead>
                      <TableHead className="text-[10px]">Product</TableHead>
                      <TableHead className="text-[10px]">MFG</TableHead>
                      <TableHead className="text-[10px]">EXP</TableHead>
                      <TableHead className="text-[10px]">Days</TableHead>
                      <TableHead className="text-[10px]">Status</TableHead>
                      <TableHead className="text-[10px]">Warehouse</TableHead>
                      <TableHead className="text-[10px]">Qty Avail</TableHead>
                      <TableHead className="text-[10px]">Storage</TableHead>
                      <TableHead className="text-[10px]">Policy</TableHead>
                      <TableHead className="text-[10px]">Compliance</TableHead>
                      <TableHead className="text-[10px]">QC</TableHead>
                      <TableHead className="text-[10px]"></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {visibleBatches.map((b) => (
                        <TableRow key={b.id} className="hover:bg-violet-50/50 dark:hover:bg-violet-950/20 cursor-pointer" onClick={() => setSelectedBatch(b)}>
                          <TableCell className="text-[11px] font-mono font-semibold text-violet-700 dark:text-violet-400">{b.batchNo}</TableCell>
                          <TableCell className="text-[11px] font-mono">{b.lotNo}</TableCell>
                          <TableCell className="text-[11px]">
                            <div className="max-w-[140px] truncate">{b.product.name}</div>
                            <div className="text-[9px] text-gray-400">{b.product.sku}</div>
                          </TableCell>
                          <TableCell className="text-[10px] font-mono">{b.mfgDate}</TableCell>
                          <TableCell className="text-[10px] font-mono">{b.expDate}</TableCell>
                          <TableCell className="text-[11px]">
                            <span className={cn("font-bold", b.daysToExpiry <= 7 ? "text-red-600" : b.daysToExpiry <= 30 ? "text-amber-600" : b.daysToExpiry <= 90 ? "text-blue-600" : "text-emerald-600")}>
                              {b.daysToExpiry > 0 ? `${b.daysToExpiry}d` : "EXP"}
                            </span>
                          </TableCell>
                          <TableCell><Badge className={cn("text-[9px]", STATUS_COLORS[b.status])}>{b.status}</Badge></TableCell>
                          <TableCell className="text-[10px]">{b.warehouse}</TableCell>
                          <TableCell className="text-[11px] font-semibold">{b.qtyAvailable.toLocaleString()}</TableCell>
                          <TableCell className="text-[10px]">
                            <div className="flex items-center gap-1">
                              <ThermometerSun className="h-3 w-3 text-amber-500" />
                              <span className="max-w-[80px] truncate">{b.storageCondition.split("(")[0]}</span>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="text-[9px]">{b.retentionPolicy}</Badge></TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-0.5">
                              {b.compliance.slice(0, 2).map((c) => (
                                <Badge key={c} className={cn("text-[8px] px-1", COMPLIANCE_BG[c] || "")}>{c}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-[9px]", b.qcStatus === "Passed" ? "bl-badge-passed" : b.qcStatus === "Failed" ? "bl-badge-failed" : "bl-badge-pending")}>{b.qcStatus}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={(e) => { e.stopPropagation(); setSelectedBatch(b) }}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 3: EXPIRY ALERTS */}
          {activeTab === "expiry" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bl-expiry-card bl-expiry-critical rounded-xl p-4 border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-2"><AlertOctagon className="h-4 w-4 text-red-500" /><span className="text-[10px] font-medium text-gray-500 uppercase">Critical (≤7d)</span></div>
                  <div className="text-2xl font-bold text-red-600">{expiryAlerts.filter((e) => e.urgency === "Critical").length}</div>
                  <div className="text-[9px] text-gray-400 mt-1">Immediate action required</div>
                </div>
                <div className="bl-expiry-card bl-expiry-warning rounded-xl p-4 border-l-4 border-amber-500">
                  <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-amber-500" /><span className="text-[10px] font-medium text-gray-500 uppercase">Warning (8-30d)</span></div>
                  <div className="text-2xl font-bold text-amber-600">{expiryAlerts.filter((e) => e.urgency === "Warning").length}</div>
                  <div className="text-[9px] text-gray-400 mt-1">Plan for markdown or return</div>
                </div>
                <div className="bl-expiry-card bl-expiry-info rounded-xl p-4 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2"><Bell className="h-4 w-4 text-blue-500" /><span className="text-[10px] font-medium text-gray-500 uppercase">Info (31-60d)</span></div>
                  <div className="text-2xl font-bold text-blue-600">{expiryAlerts.filter((e) => e.urgency === "Info").length}</div>
                  <div className="text-[9px] text-gray-400 mt-1">Monitor and prioritize picking</div>
                </div>
                <div className="bl-expiry-card bl-expiry-total rounded-xl p-4 border-l-4 border-violet-500">
                  <div className="flex items-center gap-2 mb-2"><Timer className="h-4 w-4 text-violet-500" /><span className="text-[10px] font-medium text-gray-500 uppercase">Total Alerts</span></div>
                  <div className="text-2xl font-bold text-violet-600">{expiryAlerts.length}</div>
                  <div className="text-[9px] text-gray-400 mt-1">Active batches needing attention</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Expiry Timeline Bucket View</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={220}><BarChart data={expiryTimeline}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="range" fontSize={10} /><YAxis fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" name="Batches" radius={[6, 6, 0, 0]}>
                      {expiryTimeline.map((entry, i) => (
                        <Cell key={i} fill={entry.range === "Expired" ? "#dc2626" : entry.range === "0-30 days" ? "#f97316" : entry.range === "31-60 days" ? "#f59e0b" : entry.range === "61-90 days" ? "#0ea5e9" : "#10b981"} />
                      ))}
                    </Bar>
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Retention Policy Split</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={220}><PieChart>
                    <Pie data={retentionDist} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="count" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {retentionDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">All Expiry Alerts ({expiryAlerts.length} batches)</CardTitle></CardHeader><CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead className="text-[10px]">Batch</TableHead>
                      <TableHead className="text-[10px]">Product</TableHead>
                      <TableHead className="text-[10px]">Category</TableHead>
                      <TableHead className="text-[10px]">MFG Date</TableHead>
                      <TableHead className="text-[10px]">EXP Date</TableHead>
                      <TableHead className="text-[10px]">Days Left</TableHead>
                      <TableHead className="text-[10px]">Warehouse</TableHead>
                      <TableHead className="text-[10px]">Zone</TableHead>
                      <TableHead className="text-[10px]">Qty Avail</TableHead>
                      <TableHead className="text-[10px]">Policy</TableHead>
                      <TableHead className="text-[10px]">Urgency</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {expiryAlerts.map((a) => (
                        <TableRow key={a.id} className="hover:bg-violet-50/50 dark:hover:bg-violet-950/20 cursor-pointer" onClick={() => setSelectedBatch(a)}>
                          <TableCell className="text-[11px] font-mono font-semibold">{a.batchNo}</TableCell>
                          <TableCell className="text-[11px]"><div className="max-w-[130px] truncate">{a.product.name}</div></TableCell>
                          <TableCell className="text-[11px]">{a.product.category}</TableCell>
                          <TableCell className="text-[10px] font-mono">{a.mfgDate}</TableCell>
                          <TableCell className="text-[10px] font-mono">{a.expDate}</TableCell>
                          <TableCell className="text-[11px] font-bold text-red-600">{a.daysToExpiry > 0 ? `${a.daysToExpiry}d` : "EXPIRED"}</TableCell>
                          <TableCell className="text-[10px]">{a.warehouse}</TableCell>
                          <TableCell className="text-[10px]">{a.zone}</TableCell>
                          <TableCell className="text-[11px] font-semibold">{a.qtyAvailable.toLocaleString()}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[9px]">{a.retentionPolicy}</Badge></TableCell>
                          <TableCell><Badge className={cn("text-[9px]", URGENCY_COLORS[a.urgency])}>{a.urgency}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 4: COMPLIANCE */}
          {activeTab === "compliance" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {COMPLIANCE_STANDARDS.slice(0, 4).map((std, i) => {
                  const rate = rInt(88, 99)
                  return (
                    <div key={std} className={cn("bl-compliance-card rounded-xl p-4 border border-gray-200 dark:border-gray-700", i === 0 ? "border-l-4 border-l-violet-500" : i === 1 ? "border-l-4 border-l-sky-500" : i === 2 ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-emerald-500")}>
                      <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">{std} Compliance</div>
                      <div className="text-2xl font-bold" style={{ color: rate >= 95 ? "#10b981" : rate >= 90 ? "#f59e0b" : "#ef4444" }}>{rate}%</div>
                      <div className="text-[9px] text-gray-400">{rInt(5, 20)} audits this month</div>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Compliance Rates</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><AreaChart data={monthlyCompliance}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis domain={[70, 100]} fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="fssai" stackId="1" stroke="#7c3aed" fill="#7c3aed20" name="FSSAI" />
                    <Area type="monotone" dataKey="cdsc" stackId="1" stroke="#0ea5e9" fill="#0ea5e920" name="CDSCO" />
                    <Area type="monotone" dataKey="iso" stackId="1" stroke="#10b981" fill="#10b98120" name="ISO 9001" />
                  </AreaChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Storage Condition Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={storageDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="count" nameKey="name" label={({ name, percent }) => `${name.split("(")[0].trim()} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {storageDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 9 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              {/* Violations */}
              <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-500" />Compliance Violations ({complianceViolations.length})</CardTitle></CardHeader><CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="relative flex-1 min-w-[150px]">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                    <input className="bl-filter-input pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full" placeholder="Search violations..." value={vioSearch} onChange={(e) => setVioSearch(e.target.value)} />
                  </div>
                  <select className="bl-filter-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5" value={vioStatusFilter} onChange={(e) => setVioStatusFilter(e.target.value)}>
                    <option value="All">All Status</option>
                    <option>Open</option><option>Under Review</option><option>Resolved</option><option>Escalated</option>
                  </select>
                  <Badge variant="outline" className="text-[10px]">{filteredVio.length} results</Badge>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead className="text-[10px]">ID</TableHead>
                      <TableHead className="text-[10px]">Batch</TableHead>
                      <TableHead className="text-[10px]">Product</TableHead>
                      <TableHead className="text-[10px]">Standard</TableHead>
                      <TableHead className="text-[10px]">Violation</TableHead>
                      <TableHead className="text-[10px]">Severity</TableHead>
                      <TableHead className="text-[10px]">Warehouse</TableHead>
                      <TableHead className="text-[10px]">Date</TableHead>
                      <TableHead className="text-[10px]">Status</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {filteredVio.slice(0, 40).map((v) => (
                        <TableRow key={v.id} className="hover:bg-violet-50/50 dark:hover:bg-violet-950/20">
                          <TableCell className="text-[10px] font-mono">{v.id}</TableCell>
                          <TableCell className="text-[10px] font-mono font-semibold">{v.batchNo}</TableCell>
                          <TableCell className="text-[11px]"><div className="max-w-[120px] truncate">{v.product}</div></TableCell>
                          <TableCell><Badge className={cn("text-[8px] px-1", COMPLIANCE_BG[v.standard] || "")}>{v.standard}</Badge></TableCell>
                          <TableCell className="text-[11px]">{v.violation}</TableCell>
                          <TableCell><Badge className={cn("text-[9px]", SEVERITY_COLORS[v.severity])}>{v.severity}</Badge></TableCell>
                          <TableCell className="text-[10px]">{v.warehouse}</TableCell>
                          <TableCell className="text-[10px] font-mono">{v.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-[9px]",
                              v.status === "Open" ? "border-red-300 text-red-600" :
                              v.status === "Resolved" ? "border-emerald-300 text-emerald-600" :
                              v.status === "Escalated" ? "border-amber-300 text-amber-600" : ""
                            )}>{v.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 5: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { title: "Avg Shelf Life", val: `${Math.round(batchRecords.reduce((a, b) => a + b.shelfLifeDays, 0) / batchRecords.length)}d`, sub: "All categories" },
                  { title: "FEFO Compliance", val: `${rInt(91, 97)}%`, sub: "First Expired, First Out" },
                  { title: "Waste Rate", val: `${(rand() * 3 + 0.5).toFixed(1)}%`, sub: "Expired / Total units" },
                  { title: "Recovery Rate", val: `${rInt(78, 95)}%`, sub: "Near-expiry salvage" },
                ].map((s) => (
                  <Card key={s.title} className="bl-analytics-card rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-[10px] font-medium text-gray-500 uppercase">{s.title}</div>
                    <div className="text-xl font-bold text-violet-700 dark:text-violet-400 mt-1">{s.val}</div>
                    <div className="text-[9px] text-gray-400">{s.sub}</div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Batch Creation & Consumption Trend</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><ComposedChart data={monthlyBatches}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="created" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Created" />
                    <Bar dataKey="consumed" fill="#10b981" radius={[4, 4, 0, 0]} name="Consumed" />
                    <Line type="monotone" dataKey="expired" stroke="#ef4444" strokeWidth={2} name="Expired" />
                    <Line type="monotone" dataKey="recalled" stroke="#f97316" strokeWidth={2} name="Recalled" />
                  </ComposedChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Batch Status Mix</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={(() => {
                      const counts: Record<string, number> = {}
                      batchRecords.forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1 })
                      return Object.entries(counts).map(([name, count]) => ({ name, count }))
                    })()} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="count" nameKey="name" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {BATCH_STATUSES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse-Wise Batch Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><BarChart data={warehouseBatchCount}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="warehouse" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="active" fill="#7c3aed" stackId="s" name="Active" />
                    <Bar dataKey="quarantine" fill="#f97316" stackId="s" name="Quarantine" />
                    <Bar dataKey="expired" fill="#ef4444" stackId="s" name="Expired" />
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="bl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Compliance Violations by Type</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={(() => {
                      const counts: Record<string, number> = {}
                      complianceViolations.forEach((v) => { counts[v.violation] = (counts[v.violation] || 0) + 1 })
                      return Object.entries(counts).map(([name, count]) => ({ name, count }))
                    })()} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="count" nameKey="name" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {(() => {
                        const counts: Record<string, number> = {}
                        complianceViolations.forEach((v) => { counts[v.violation] = (counts[v.violation] || 0) + 1 })
                        return Object.keys(counts).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)
                      })()}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 9 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>
            </div>
          )}
        </Tabs>
      </div>

      {/* BATCH DETAIL DRAWER */}
      {selectedBatch && (
        <div className="bl-drawer-overlay" onClick={() => setSelectedBatch(null)}>
          <div className="bl-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="bl-drawer-header">
              <div className={cn("bl-status-banner", selectedBatch.status === "Active" ? "bl-banner-active" : selectedBatch.status === "Quarantine" ? "bl-banner-quarantine" : selectedBatch.status === "Expired" ? "bl-banner-expired" : selectedBatch.status === "Recalled" ? "bl-banner-recalled" : "bl-banner-default")}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedBatch.batchNo}</h3>
                    <p className="text-xs text-white/70">{selectedBatch.lotNo} · {selectedBatch.product.name}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => setSelectedBatch(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bl-drawer-content space-y-4">
              {/* Status Flow */}
              <div className="bl-flow-dots">
                {["Received", "Inspected", "Stored", "Dispatched"].map((step, i) => {
                  const active = (() => {
                    if (selectedBatch.status === "Active" || selectedBatch.status === "Consumed") return true
                    if (i === 0) return true
                    if (i === 1 && selectedBatch.qcStatus !== "N/A") return true
                    if (i === 2 && selectedBatch.status === "Active") return true
                    return false
                  })()
                  return (
                    <div key={step} className="flex items-center gap-1.5">
                      <div className={cn("bl-flow-dot", active ? "bl-dot-active" : "bl-dot-inactive")} />
                      <span className={cn("text-[10px]", active ? "text-violet-700 font-medium" : "text-gray-400")}>{step}</span>
                      {i < 3 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                    </div>
                  )
                })}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Product SKU", value: selectedBatch.product.sku, icon: ScanBarcode },
                  { label: "Category", value: selectedBatch.product.category, icon: Boxes },
                  { label: "Warehouse", value: selectedBatch.warehouse, icon: Warehouse },
                  { label: "Zone", value: selectedBatch.zone, icon: Package },
                  { label: "MFG Date", value: selectedBatch.mfgDate, icon: Calendar },
                  { label: "EXP Date", value: selectedBatch.expDate, icon: CalendarClock },
                  { label: "Shelf Life", value: `${selectedBatch.shelfLifeDays} days`, icon: Clock },
                  { label: "Days to Expiry", value: selectedBatch.daysToExpiry > 0 ? `${selectedBatch.daysToExpiry} days` : "EXPIRED", icon: Timer },
                  { label: "Storage", value: selectedBatch.storageCondition, icon: ThermometerSun },
                  { label: "Temperature", value: selectedBatch.temperature, icon: Beaker },
                  { label: "Retention", value: selectedBatch.retentionPolicy, icon: RotateCcw },
                  { label: "GRN Ref", value: selectedBatch.grnRef, icon: FileText },
                ].map((info) => (
                  <div key={info.label} className="bl-info-item rounded-lg p-2.5 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <info.icon className="h-3 w-3 text-violet-500" />
                      <span className="text-[9px] text-gray-500 uppercase font-medium">{info.label}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">{info.value}</div>
                  </div>
                ))}
              </div>

              {/* Quantity Summary */}
              <div className="bl-qty-box rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-medium text-gray-500 uppercase mb-2">Quantity Summary</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedBatch.qtyReceived.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500">Received</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-violet-600">{selectedBatch.qtyAvailable.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-amber-600">{selectedBatch.qtyReserved.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500">Reserved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-red-600">{selectedBatch.qtyDamaged.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500">Damaged</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
                  <div className="bg-violet-500 h-full" style={{ width: `${(selectedBatch.qtyAvailable / selectedBatch.qtyReceived) * 100}%` }} />
                  <div className="bg-amber-500 h-full" style={{ width: `${(selectedBatch.qtyReserved / selectedBatch.qtyReceived) * 100}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${(selectedBatch.qtyDamaged / selectedBatch.qtyReceived) * 100}%` }} />
                </div>
                <div className="flex gap-3 mt-1">
                  <div className="flex items-center gap-1"><div className="h-1.5 w-3 rounded bg-violet-500" /><span className="text-[8px] text-gray-500">Available</span></div>
                  <div className="flex items-center gap-1"><div className="h-1.5 w-3 rounded bg-amber-500" /><span className="text-[8px] text-gray-500">Reserved</span></div>
                  <div className="flex items-center gap-1"><div className="h-1.5 w-3 rounded bg-red-500" /><span className="text-[8px] text-gray-500">Damaged</span></div>
                </div>
              </div>

              {/* Compliance badges */}
              <div className="rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-medium text-gray-500 uppercase mb-2">Compliance Standards</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBatch.compliance.map((c) => (
                    <Badge key={c} className={cn("text-[10px] px-2 py-0.5", COMPLIANCE_BG[c] || "")}>{c}</Badge>
                  ))}
                </div>
              </div>

              {/* QC Status */}
              <div className="rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-medium text-gray-500 uppercase mb-2">Quality Check</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-[10px]", selectedBatch.qcStatus === "Passed" ? "bl-badge-passed" : selectedBatch.qcStatus === "Failed" ? "bl-badge-failed" : "bl-badge-pending")}>{selectedBatch.qcStatus}</Badge>
                    <span className="text-[10px] text-gray-500">Last: {selectedBatch.lastInspected}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Supplier: {selectedBatch.supplier}</span>
                </div>
              </div>

              {/* HS Code */}
              <div className="rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">HS Code</div>
                <div className="text-sm font-mono text-gray-900 dark:text-gray-100">{selectedBatch.product.hs}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
