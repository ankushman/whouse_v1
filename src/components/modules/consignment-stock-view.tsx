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
  Landmark, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, Eye, X, Clock, Package, ArrowRight,
  ChevronRight, ShieldAlert, Boxes, FileText,
  IndianRupee, Warehouse, Filter, Users, Truck, Handshake,
  RefreshCw, AlertOctagon, Calendar, Percent, CircleDollarSign,
  ArrowUpRight, ArrowDownRight, PackageCheck, Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"

function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(139139)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const rDate = (start: number, end: number) => new Date(2026, 6, rInt(start, end)).toISOString().split("T")[0]
const fmtRupee = (n: number) => `₹${n.toLocaleString("en-IN")}`

const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"]
const CONSIGNMENT_STATUSES = ["Active", "Pending Receipt", "Partially Consumed", "Fully Consumed", "On Hold", "Disputed", "Expired", "Return Pending"]
const AGREEMENT_TYPES = ["Standard VMI", "JIT Consignment", "Safety Stock", "Promotional Stock", "Demo/Loan Stock", "Pipeline Stock"]
const PAYMENT_TERMS = ["Net 30", "Net 45", "Net 60", "Net 90", "On Consumption", "Monthly Settlement"]
const SUPPLIERS = [
  { id: "SUP-001", name: "Tata Steel Ltd", gst: "27AABCT1332R1Z5", city: "Mumbai" },
  { id: "SUP-002", name: "Reliance Industries", gst: "27AABCR5678S1Z3", city: "Mumbai" },
  { id: "SUP-003", name: "Mahindra & Mahindra", gst: "27AABCM9876D1Z1", city: "Mumbai" },
  { id: "SUP-004", name: "Godrej & Boyce", gst: "27AABCG4321F1Z9", city: "Mumbai" },
  { id: "SUP-005", name: "Bajaj Auto Ltd", gst: "27AABCB8765G1Z7", city: "Pune" },
  { id: "SUP-006", name: "TVS Motor Company", gst: "33AABCT6543H1Z5", city: "Chennai" },
  { id: "SUP-007", name: "Ashok Leyland", gst: "33AABCA3210I1Z2", city: "Chennai" },
  { id: "SUP-008", name: "Larsen & Toubro", gst: "27AABCL9876J1Z8", city: "Mumbai" },
  { id: "SUP-009", name: "Bharat Forge Ltd", gst: "27AABCB5432K1Z4", city: "Pune" },
  { id: "SUP-010", name: "Wipro Enterprises", gst: "29AABCW7654L1Z6", city: "Bangalore" },
]

const PRODUCTS = [
  { sku: "CS-001", name: "Steel Sheet HR 2mm", cat: "Raw Materials", unit: "kg" },
  { sku: "CS-002", name: "Aluminum Extrusion Profile", cat: "Raw Materials", unit: "pcs" },
  { sku: "CS-003", name: "Hydraulic Pump Assembly", cat: "Components", unit: "pcs" },
  { sku: "CS-004", name: "LED Panel Light 600x600", cat: "Electrical", unit: "pcs" },
  { sku: "CS-005", name: "Copper Wire 2.5mm", cat: "Raw Materials", unit: "m" },
  { sku: "CS-006", name: "Rubber Gasket Kit", cat: "Components", unit: "set" },
  { sku: "CS-007", name: "Industrial Bearing 6205", cat: "Components", unit: "pcs" },
  { sku: "CS-008", name: "Power Supply Unit 24V", cat: "Electrical", unit: "pcs" },
  { sku: "CS-009", name: "PVC Pipe 4-inch", cat: "Plumbing", unit: "m" },
  { sku: "CS-010", name: "Glass Wool Insulation 50mm", cat: "Insulation", unit: "sqm" },
  { sku: "CS-011", name: "PLC Controller Module", cat: "Electronics", unit: "pcs" },
  { sku: "CS-012", name: "Stainless Fasteners M10", cat: "Hardware", unit: "box" },
]

// Consignment agreements
const agreements = (() => {
  return SUPPLIERS.map((sup, idx) => ({
    id: `CA-${String(idx + 1).padStart(4, "0")}`,
    supplier: sup,
    type: pick(AGREEMENT_TYPES),
    paymentTerms: pick(PAYMENT_TERMS),
    totalValue: rInt(500000, 5000000),
    consumedValue: rInt(100000, 3000000),
    startDate: rDate(1, 15),
    endDate: rDate(1, 28).replace("2026-07", "2026-12"),
    status: pick(["Active", "Active", "Active", "Under Review", "Expiring Soon"]),
    slaDays: rInt(3, 15),
    autoReplenish: rand() > 0.5,
    minStockLevel: rInt(100, 500),
    maxStockLevel: rInt(1000, 5000),
    reorderPoint: rInt(200, 1000),
    lastSettlement: rDate(1, 25),
    nextReview: rDate(1, 28).replace("2026-07", "2026-08"),
  }))
})()

// Consignment stock items
const stockItems = (() => {
  const result: Array<{
    id: string; agreementId: string; supplier: typeof SUPPLIERS[0]; product: typeof PRODUCTS[0];
    warehouse: string; zone: string; status: string;
    qtyConsigned: number; qtyConsumed: number; qtyAvailable: number; qtyDamaged: number;
    unitPrice: number; consignedValue: number; consumedValue: number;
    receivedDate: string; lastConsumption: string; expiryDate: string;
    settlementStatus: string; pendingInvoices: number; pendingAmount: number;
    daysInWarehouse: number; turnoverRate: number;
  }> = []

  for (let i = 0; i < 120; i++) {
    const agreement = pick(agreements)
    const product = pick(PRODUCTS)
    const warehouse = pick(WAREHOUSES)
    const status = pick(CONSIGNMENT_STATUSES)
    const qtyC = rInt(50, 5000)
    const qtyDmg = rInt(0, Math.floor(qtyC * 0.03))
    const qtyConsumed = status === "Fully Consumed" ? qtyC : status === "Partially Consumed" ? rInt(Math.floor(qtyC * 0.3), Math.floor(qtyC * 0.8)) : rInt(0, Math.floor(qtyC * 0.3))
    const qtyAvail = qtyC - qtyConsumed - qtyDmg
    const unitPrice = rInt(100, 5000)
    const receivedDate = rDate(1, 25)
    const daysInWH = rInt(5, 180)
    const settlementStatus = qtyConsumed > 0 ? pick(["Pending", "Partial", "Settled", "Disputed"]) : "N/A"

    result.push({
      id: `CSI-${String(i + 1).padStart(4, "0")}`,
      agreementId: agreement.id,
      supplier: agreement.supplier,
      product,
      warehouse,
      zone: pick(["Zone A - Bulk", "Zone B - Picking", "Zone C - Cold", "Zone D - Hazmat"]),
      status,
      qtyConsigned: qtyC,
      qtyConsumed,
      qtyAvailable: Math.max(0, qtyAvail),
      qtyDamaged: qtyDmg,
      unitPrice,
      consignedValue: qtyC * unitPrice,
      consumedValue: qtyConsumed * unitPrice,
      receivedDate,
      lastConsumption: qtyConsumed > 0 ? rDate(1, 28) : "—",
      expiryDate: rDate(1, 28).replace("2026-07", "2027-01"),
      settlementStatus,
      pendingInvoices: settlementStatus === "Pending" || settlementStatus === "Partial" ? rInt(1, 5) : 0,
      pendingAmount: settlementStatus === "Pending" ? rInt(50000, 500000) : settlementStatus === "Partial" ? rInt(10000, 100000) : 0,
      daysInWarehouse: daysInWH,
      turnoverRate: +(rand() * 3 + 0.2).toFixed(1),
    })
  }
  return result
})()

// Settlements
const settlements = (() => {
  const result: Array<{
    id: string; agreementId: string; supplier: typeof SUPPLIERS[0]; warehouse: string;
    period: string; totalConsumed: number; totalValue: number;
    gstAmount: number; tdsAmount: number; netPayable: number;
    status: string; invoiceRef: string; dueDate: string; paidDate: string | null;
    items: number;
  }> = []

  for (let i = 0; i < 50; i++) {
    const agreement = pick(agreements)
    const totalConsumed = rInt(50, 2000)
    const unitRate = rInt(100, 3000)
    const totalValue = totalConsumed * unitRate
    const gst = Math.round(totalValue * 0.18)
    const tds = Math.round(totalValue * 0.02)
    const status = pick(["Paid", "Paid", "Pending", "Pending", "Processing", "Disputed", "Overdue"])
    const month = pick(["Jun-2026", "Jul-2026"])

    result.push({
      id: `STL-${String(i + 1).padStart(4, "0")}`,
      agreementId: agreement.id,
      supplier: agreement.supplier,
      warehouse: pick(WAREHOUSES),
      period: month,
      totalConsumed,
      totalValue,
      gstAmount: gst,
      tdsAmount: tds,
      netPayable: totalValue + gst - tds,
      status,
      invoiceRef: `INV-${String(rInt(100000, 999999))}`,
      dueDate: rDate(1, 28),
      paidDate: status === "Paid" ? rDate(1, 28) : null,
      items: rInt(3, 15),
    })
  }
  return result
})()

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const COLORS = ["#0891b2", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"]

const monthlyConsumption = MONTHS.map((m) => ({
  month: m, consumed: rInt(2000, 8000), settled: rInt(1500, 7000), pending: rInt(200, 2000),
}))

const monthlyStockValue = MONTHS.map((m) => ({
  month: m, totalValue: rInt(5000000, 12000000), consumedValue: rInt(1000000, 4000000), settlementOut: rInt(500000, 2000000),
}))

const supplierDist = (() => {
  const counts: Record<string, number> = {}
  stockItems.forEach((s) => { counts[s.supplier.name] = (counts[s.supplier.name] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name: name.split(" ")[0], count })).sort((a, b) => b.count - a.count).slice(0, 8)
})()

const typeDist = (() => {
  const counts: Record<string, number> = {}
  agreements.forEach((a) => { counts[a.type] = (counts[a.type] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

const warehouseValue = WAREHOUSES.map((w) => ({
  warehouse: w,
  consigned: rInt(2000000, 8000000),
  consumed: rInt(500000, 3000000),
  pending: rInt(100000, 800000),
  disputed: rInt(0, 200000),
}))

const statusDist = (() => {
  const counts: Record<string, number> = {}
  stockItems.forEach((s) => { counts[s.status] = (counts[s.status] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

// Dispute records
const disputes = (() => {
  const result: Array<{
    id: string; agreementId: string; supplier: typeof SUPPLIERS[0]; item: string;
    issue: string; severity: string; warehouse: string; raisedDate: string;
    amount: number; status: string; resolution: string | null;
  }> = []
  for (let i = 0; i < 20; i++) {
    const agreement = pick(agreements)
    const status = pick(["Open", "Under Review", "Resolved", "Escalated"])
    result.push({
      id: `DSP-${String(i + 1).padStart(4, "0")}`,
      agreementId: agreement.id,
      supplier: agreement.supplier,
      item: pick(PRODUCTS).name,
      issue: pick(["Qty mismatch at receipt", "Damaged goods not reported", "Wrong pricing applied", "Missing documentation", "Expiry date dispute", "Quality below standard", "Late delivery penalty", "Invoice discrepancy"]),
      severity: pick(["High", "Medium", "Low"]),
      warehouse: pick(WAREHOUSES),
      raisedDate: rDate(1, 28),
      amount: rInt(10000, 300000),
      status,
      resolution: status === "Resolved" ? pick(["Credit note issued", "Stock replaced", "Discount applied", "Partial adjustment"]) : null,
    })
  }
  return result
})()

const STATUS_COLORS: Record<string, string> = {
  Active: "cs-badge-active", "Pending Receipt": "cs-badge-pending", "Partially Consumed": "cs-badge-partial",
  "Fully Consumed": "cs-badge-consumed", "On Hold": "cs-badge-hold", Disputed: "cs-badge-disputed",
  Expired: "cs-badge-expired", "Return Pending": "cs-badge-return",
}
const SETTLEMENT_COLORS: Record<string, string> = {
  Paid: "cs-badge-paid", Pending: "cs-badge-settle-pending", Processing: "cs-badge-processing",
  Disputed: "cs-badge-disputed", Overdue: "cs-badge-overdue",
}
const SEVERITY_COLORS: Record<string, string> = {
  High: "cs-badge-severity-high", Medium: "cs-badge-severity-medium", Low: "cs-badge-severity-low",
}
const AGREEMENT_BG: Record<string, string> = {
  "Standard VMI": "cs-chip-vmi", "JIT Consignment": "cs-chip-jit",
  "Safety Stock": "cs-chip-safety", "Promotional Stock": "cs-chip-promo",
  "Demo/Loan Stock": "cs-chip-demo", "Pipeline Stock": "cs-chip-pipeline",
}

export default function ConsignmentStockView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stockSearch, setStockSearch] = useState("")
  const [stockStatusFilter, setStockStatusFilter] = useState("All")
  const [stockSupplierFilter, setStockSupplierFilter] = useState("All")
  const [settleStatusFilter, setSettleStatusFilter] = useState("All")
  const [selectedStock, setSelectedStock] = useState<typeof stockItems[0] | null>(null)

  const totalConsignedValue = stockItems.reduce((a, b) => a + b.consignedValue, 0)
  const totalConsumedValue = stockItems.reduce((a, b) => a + b.consumedValue, 0)
  const totalPendingSettlement = stockItems.reduce((a, b) => a + b.pendingAmount, 0)
  const activeItems = stockItems.filter((s) => s.status === "Active").length

  const filteredStock = (() => {
    const q = stockSearch.toLowerCase()
    return stockItems.filter((s) => {
      const matchSearch = !q || s.id.toLowerCase().includes(q) || s.product.sku.toLowerCase().includes(q)
        || s.product.name.toLowerCase().includes(q) || s.supplier.name.toLowerCase().includes(q)
        || s.warehouse.toLowerCase().includes(q) || s.agreementId.toLowerCase().includes(q)
      const matchStatus = stockStatusFilter === "All" || s.status === stockStatusFilter
      const matchSupplier = stockSupplierFilter === "All" || s.supplier.name === stockSupplierFilter
      return matchSearch && matchStatus && matchSupplier
    })
  })()
  const visibleStock = filteredStock.slice(0, 60)

  const filteredSettlements = (() => {
    return settlements.filter((s) => settleStatusFilter === "All" || s.status === settleStatusFilter)
  })()

  return (
    <div className="cs-container">
      {/* Header */}
      <div className="cs-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-600 to-amber-500 flex items-center justify-center">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Consignment Stock</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">VMI Agreements · Settlement Tracking · Supplier Liability</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="cs-stat-chip"><span className="text-[10px] text-gray-500">Active Items</span><span className="text-sm font-bold text-cyan-600">{activeItems}</span></span>
          <span className="cs-stat-chip"><span className="text-[10px] text-gray-500">Consigned Value</span><span className="text-sm font-bold text-amber-600">{fmtRupee(totalConsignedValue)}</span></span>
          <span className="cs-stat-chip"><span className="text-[10px] text-gray-500">Settlements</span><span className="text-sm font-bold text-emerald-600">{settlements.filter((s) => s.status === "Pending" || s.status === "Overdue").length}</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="cs-tabs-wrapper mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Dashboard</TabsTrigger>
            <TabsTrigger value="stock" className="gap-1.5"><Package className="h-3.5 w-3.5" />Stock Register</TabsTrigger>
            <TabsTrigger value="agreements" className="gap-1.5"><Handshake className="h-3.5 w-3.5" />Agreements</TabsTrigger>
            <TabsTrigger value="settlements" className="gap-1.5"><CircleDollarSign className="h-3.5 w-3.5" />Settlements</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Analytics</TabsTrigger>
          </TabsList>

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { title: "Total Consigned", val: fmtRupee(totalConsignedValue), icon: Package, cls: "cs-kpi-cyan" },
                  { title: "Consumed Value", val: fmtRupee(totalConsumedValue), icon: PackageCheck, cls: "cs-kpi-emerald" },
                  { title: "Pending Settlement", val: fmtRupee(totalPendingSettlement), icon: AlertOctagon, cls: "cs-kpi-red" },
                  { title: "Active Stock Items", val: String(activeItems), icon: Boxes, cls: "cs-kpi-amber" },
                  { title: "Agreements", val: `${agreements.length}`, icon: Handshake, cls: "cs-kpi-teal" },
                  { title: "Disputes", val: `${disputes.filter((d) => d.status !== "Resolved").length}`, icon: AlertTriangle, cls: "cs-kpi-rose" },
                ].map((kpi) => (
                  <div key={kpi.title} className={cn("cs-kpi-card rounded-xl p-3", kpi.cls)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{kpi.title}</span>
                      <kpi.icon className="h-3.5 w-3.5 text-white/50" />
                    </div>
                    <div className="text-base font-bold text-white">{kpi.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Consumption & Settlement</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><ComposedChart data={monthlyConsumption}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip formatter={(v: number) => fmtRupee(v)} /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="consumed" fill="#0891b2" radius={[4, 4, 0, 0]} name="Consumed (units)" />
                    <Line type="monotone" dataKey="settled" stroke="#10b981" strokeWidth={2} dot={false} name="Settled" />
                    <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={false} name="Pending" />
                  </ComposedChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Stock Value Trend</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><AreaChart data={monthlyStockValue}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip formatter={(v: number) => fmtRupee(v)} /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="totalValue" stackId="a" stroke="#0891b2" fill="#0891b220" name="Total Consigned" />
                    <Area type="monotone" dataKey="consumedValue" stackId="a" stroke="#10b981" fill="#10b98120" name="Consumed" />
                    <Area type="monotone" dataKey="settlementOut" stackId="a" stroke="#f59e0b" fill="#f59e0b20" name="Settlement Out" />
                  </AreaChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse Consignment Value</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><BarChart data={warehouseValue} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" fontSize={11} tickFormatter={(v: number) => `₹${(v / 1000000).toFixed(1)}M`} /><YAxis type="category" dataKey="warehouse" fontSize={10} width={95} />
                    <Tooltip formatter={(v: number) => fmtRupee(v)} /><Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="consigned" fill="#0891b2" stackId="a" name="Consigned" />
                    <Bar dataKey="consumed" fill="#10b981" stackId="a" name="Consumed" />
                    <Bar dataKey="pending" fill="#f59e0b" stackId="a" name="Pending" />
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Supplier Distribution (Top 8)</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={supplierDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="count" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {supplierDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              {/* Top Pending Settlements */}
              <Card className="card-crud-lift cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertOctagon className="h-4 w-4 text-red-500" />Pending Settlements ({settlements.filter((s) => s.status === "Pending" || s.status === "Overdue").length})</CardTitle></CardHeader><CardContent>
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader><TableRow>
                      <TableHead className="text-[10px]">ID</TableHead>
                      <TableHead className="text-[10px]">Supplier</TableHead>
                      <TableHead className="text-[10px]">Period</TableHead>
                      <TableHead className="text-[10px]">Items</TableHead>
                      <TableHead className="text-[10px]">Total Value</TableHead>
                      <TableHead className="text-[10px]">GST (18%)</TableHead>
                      <TableHead className="text-[10px]">TDS (2%)</TableHead>
                      <TableHead className="text-[10px]">Net Payable</TableHead>
                      <TableHead className="text-[10px]">Status</TableHead>
                      <TableHead className="text-[10px]">Due Date</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {settlements.filter((s) => s.status === "Pending" || s.status === "Overdue").slice(0, 12).map((s) => (
                        <TableRow key={s.id} className="hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20">
                          <TableCell className="text-[10px] font-mono">{s.id}</TableCell>
                          <TableCell className="text-[11px] font-semibold">{s.supplier.name}</TableCell>
                          <TableCell className="text-[10px]">{s.period}</TableCell>
                          <TableCell className="text-[10px]">{s.items}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono">{fmtRupee(s.totalValue)}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono text-amber-600">{fmtRupee(s.gstAmount)}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono text-red-600">-{fmtRupee(s.tdsAmount)}</TableCell>
                          <TableCell className="text-[10px] font-mono font-bold">{fmtRupee(s.netPayable)}</TableCell>
                          <TableCell><Badge className={cn("text-[9px]", SETTLEMENT_COLORS[s.status])}>{s.status}</Badge></TableCell>
                          <TableCell className="text-[10px] font-mono">{s.dueDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 2: STOCK REGISTER */}
          {activeTab === "stock" && (
            <div className="mt-4 space-y-4">
              <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Filter className="h-4 w-4 text-cyan-500" />Filter Consignment Stock</CardTitle></CardHeader><CardContent>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                    <input className="cs-filter-input pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full" placeholder="Search ID, SKU, Product, Supplier..." value={stockSearch} onChange={(e) => setStockSearch(e.target.value)} />
                  </div>
                  <select className="cs-filter-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2" value={stockStatusFilter} onChange={(e) => setStockStatusFilter(e.target.value)}>
                    <option value="All">All Status</option>
                    {CONSIGNMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="cs-filter-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2" value={stockSupplierFilter} onChange={(e) => setStockSupplierFilter(e.target.value)}>
                    <option value="All">All Suppliers</option>
                    {SUPPLIERS.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                  <Badge variant="outline" className="badge-interactive text-[10px]">{filteredStock.length} results</Badge>
                </div>
              </CardContent></Card>

              <Card className="card-crud-lift glass-subtle cs-chart-card"><CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader><TableRow className="cs-table-header">
                      <TableHead className="text-[10px]">ID</TableHead>
                      <TableHead className="text-[10px]">Product</TableHead>
                      <TableHead className="text-[10px]">Supplier</TableHead>
                      <TableHead className="text-[10px]">Warehouse</TableHead>
                      <TableHead className="text-[10px]">Status</TableHead>
                      <TableHead className="text-[10px]">Consigned</TableHead>
                      <TableHead className="text-[10px]">Consumed</TableHead>
                      <TableHead className="text-[10px]">Available</TableHead>
                      <TableHead className="text-[10px]">Consigned Value</TableHead>
                      <TableHead className="text-[10px]">Settlement</TableHead>
                      <TableHead className="text-[10px]">Turnover</TableHead>
                      <TableHead className="text-[10px]">Days</TableHead>
                      <TableHead className="text-[10px]"></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {visibleStock.map((s) => (
                        <TableRow key={s.id} className="hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 cursor-pointer" onClick={() => setSelectedStock(s)}>
                          <TableCell className="text-[10px] font-mono font-semibold text-cyan-700 dark:text-cyan-400">{s.id}</TableCell>
                          <TableCell className="text-[11px]">
                            <div className="max-w-[130px] truncate font-semibold">{s.product.name}</div>
                            <div className="text-[9px] text-gray-400">{s.product.sku} · {s.product.unit}</div>
                          </TableCell>
                          <TableCell className="text-[10px]"><div className="max-w-[100px] truncate">{s.supplier.name}</div></TableCell>
                          <TableCell className="text-[10px]">{s.warehouse}</TableCell>
                          <TableCell><Badge className={cn("text-[9px]", STATUS_COLORS[s.status])}>{s.status}</Badge></TableCell>
                          <TableCell className="text-[10px] font-mono">{s.qtyConsigned.toLocaleString()}</TableCell>
                          <TableCell className="text-[10px] font-mono text-emerald-600">{s.qtyConsumed.toLocaleString()}</TableCell>
                          <TableCell className="text-[10px] font-mono font-semibold">{s.qtyAvailable.toLocaleString()}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono">{fmtRupee(s.consignedValue)}</TableCell>
                          <TableCell>
                            <Badge className={cn("text-[8px]", s.settlementStatus === "Pending" ? "cs-badge-settle-pending" : s.settlementStatus === "Settled" ? "cs-badge-paid" : s.settlementStatus === "Disputed" ? "cs-badge-disputed" : "text-gray-500 bg-gray-100")}>
                              {s.settlementStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono">{s.turnoverRate}x</TableCell>
                          <TableCell className="text-[10px] font-mono">{s.daysInWarehouse}d</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={(e) => { e.stopPropagation(); setSelectedStock(s) }}>
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

          {/* TAB 3: AGREEMENTS */}
          {activeTab === "agreements" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Agreement Type Distribution</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={typeDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="count" nameKey="name" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Stock Status Mix</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={statusDist} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="count" nameKey="name" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 9 }} />
                  </PieChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Vendor Consignment Agreements ({agreements.length})</CardTitle></CardHeader><CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {agreements.map((a) => (
                    <div key={a.id} className="cs-agreement-card rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-cyan-600 font-semibold">{a.id}</span>
                        <Badge variant="outline" className={cn("text-[8px]",
                          a.status === "Active" ? "border-emerald-300 text-emerald-600"
                          : a.status === "Expiring Soon" ? "border-amber-300 text-amber-600"
                          : "border-blue-300 text-blue-600"
                        )}>{a.status}</Badge>
                      </div>
                      <div className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-1">{a.supplier.name}</div>
                      <div className="text-[9px] text-gray-500 mb-2">{a.supplier.city} · GST: {a.supplier.gst.slice(-5)}</div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge className={cn("text-[8px] px-1", AGREEMENT_BG[a.type] || "")}>{a.type}</Badge>
                        <Badge variant="outline" className="badge-interactive text-[8px]">{a.paymentTerms}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        <div><span className="text-gray-500">Value:</span> <span className="font-semibold">{fmtRupee(a.totalValue)}</span></div>
                        <div><span className="text-gray-500">Consumed:</span> <span className="font-semibold text-emerald-600">{fmtRupee(a.consumedValue)}</span></div>
                        <div><span className="text-gray-500">SLA:</span> <span className="font-semibold">{a.slaDays}d</span></div>
                        <div><span className="text-gray-500">Auto-RPL:</span> <span className="font-semibold">{a.autoReplenish ? "Yes" : "No"}</span></div>
                        <div><span className="text-gray-500">Period:</span> <span className="font-mono text-[9px]">{a.startDate} → {a.endDate}</span></div>
                        <div><span className="text-gray-500">Review:</span> <span className="font-mono text-[9px]">{a.nextReview}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* TAB 4: SETTLEMENTS */}
          {activeTab === "settlements" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { title: "Total Settled", val: fmtRupee(settlements.filter((s) => s.status === "Paid").reduce((a, b) => a + b.netPayable, 0)), cls: "cs-settle-paid" },
                  { title: "Pending", val: fmtRupee(settlements.filter((s) => s.status === "Pending").reduce((a, b) => a + b.netPayable, 0)), cls: "cs-settle-pending" },
                  { title: "Processing", val: String(settlements.filter((s) => s.status === "Processing").length), cls: "cs-settle-processing" },
                  { title: "Disputed/Overdue", val: fmtRupee(settlements.filter((s) => s.status === "Disputed" || s.status === "Overdue").reduce((a, b) => a + b.netPayable, 0)), cls: "cs-settle-disputed" },
                ].map((s) => (
                  <div key={s.title} className={cn("rounded-xl p-4 border border-gray-200 dark:border-gray-700", s.cls)}>
                    <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">{s.title}</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{s.val}</div>
                  </div>
                ))}
              </div>

              <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Filter className="h-4 w-4 text-cyan-500" />Settlement Records ({filteredSettlements.length})</CardTitle></CardHeader><CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  <select className="cs-filter-select text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5" value={settleStatusFilter} onChange={(e) => setSettleStatusFilter(e.target.value)}>
                    <option value="All">All Status</option>
                    <option>Paid</option><option>Pending</option><option>Processing</option><option>Disputed</option><option>Overdue</option>
                  </select>
                  <Badge variant="outline" className="badge-interactive text-[10px]">{filteredSettlements.length} results</Badge>
                </div>
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader><TableRow className="cs-table-header">
                      <TableHead className="text-[10px]">ID</TableHead>
                      <TableHead className="text-[10px]">Supplier</TableHead>
                      <TableHead className="text-[10px]">Warehouse</TableHead>
                      <TableHead className="text-[10px]">Period</TableHead>
                      <TableHead className="text-[10px]">Items</TableHead>
                      <TableHead className="text-[10px]">Gross Value</TableHead>
                      <TableHead className="text-[10px]">GST 18%</TableHead>
                      <TableHead className="text-[10px]">TDS 2%</TableHead>
                      <TableHead className="text-[10px]">Net Payable</TableHead>
                      <TableHead className="text-[10px]">Status</TableHead>
                      <TableHead className="text-[10px]">Invoice</TableHead>
                      <TableHead className="text-[10px]">Due</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {filteredSettlements.slice(0, 40).map((s) => (
                        <TableRow key={s.id} className="hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20">
                          <TableCell className="text-[10px] font-mono">{s.id}</TableCell>
                          <TableCell className="text-[11px] font-semibold">{s.supplier.name}</TableCell>
                          <TableCell className="text-[10px]">{s.warehouse}</TableCell>
                          <TableCell className="text-[10px]">{s.period}</TableCell>
                          <TableCell className="text-[10px]">{s.items}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono">{fmtRupee(s.totalValue)}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono text-amber-600">+{fmtRupee(s.gstAmount)}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono text-red-600">-{fmtRupee(s.tdsAmount)}</TableCell>
                          <TableCell className="text-[10px] font-mono font-bold">{fmtRupee(s.netPayable)}</TableCell>
                          <TableCell><Badge className={cn("text-[9px]", SETTLEMENT_COLORS[s.status])}>{s.status}</Badge></TableCell>
                          <TableCell className="text-[10px] font-mono">{s.invoiceRef}</TableCell>
                          <TableCell className="text-[10px] font-mono">{s.dueDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent></Card>

              {/* Disputes */}
              <Card className="card-crud-lift cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" />Disputes ({disputes.length})</CardTitle></CardHeader><CardContent>
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader><TableRow>
                      <TableHead className="text-[10px]">ID</TableHead>
                      <TableHead className="text-[10px]">Supplier</TableHead>
                      <TableHead className="text-[10px]">Item</TableHead>
                      <TableHead className="text-[10px]">Issue</TableHead>
                      <TableHead className="text-[10px]">Severity</TableHead>
                      <TableHead className="text-[10px]">Warehouse</TableHead>
                      <TableHead className="text-[10px]">Amount</TableHead>
                      <TableHead className="text-[10px]">Status</TableHead>
                      <TableHead className="text-[10px]">Resolution</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {disputes.map((d) => (
                        <TableRow key={d.id} className="hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20">
                          <TableCell className="text-[10px] font-mono">{d.id}</TableCell>
                          <TableCell className="text-[11px] font-semibold">{d.supplier.name}</TableCell>
                          <TableCell className="text-[11px]"><div className="max-w-[100px] truncate">{d.item}</div></TableCell>
                          <TableCell className="text-[11px]">{d.issue}</TableCell>
                          <TableCell><Badge className={cn("text-[9px]", SEVERITY_COLORS[d.severity])}>{d.severity}</Badge></TableCell>
                          <TableCell className="text-[10px]">{d.warehouse}</TableCell>
                          <TableCell className="numeric-cell text-[10px] font-mono font-semibold">{fmtRupee(d.amount)}</TableCell>
                          <TableCell><Badge variant="outline" className={cn("text-[9px]",
                            d.status === "Open" ? "border-red-300 text-red-600"
                            : d.status === "Resolved" ? "border-emerald-300 text-emerald-600"
                            : d.status === "Escalated" ? "border-amber-300 text-amber-600" : ""
                          )}>{d.status}</Badge></TableCell>
                          <TableCell className="text-[10px] text-emerald-600">{d.resolution || "—"}</TableCell>
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
                  { title: "Avg Turnover Rate", val: `${(stockItems.reduce((a, b) => a + b.turnoverRate, 0) / stockItems.length).toFixed(1)}x/mo`, sub: "Consignment velocity" },
                  { title: "Avg Days in WH", val: `${Math.round(stockItems.reduce((a, b) => a + b.daysInWarehouse, 0) / stockItems.length)}d`, sub: "Dwell time" },
                  { title: "Damage Rate", val: `${(stockItems.reduce((a, b) => a + b.qtyDamaged, 0) / stockItems.reduce((a, b) => a + b.qtyConsigned, 0) * 100).toFixed(1)}%`, sub: "Consigned qty" },
                  { title: "Settlement Cycle", val: `${rInt(25, 40)}d`, sub: "Avg days to pay" },
                ].map((s) => (
                  <Card key={s.title} className="cs-analytics-card rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-[10px] font-medium text-gray-500 uppercase">{s.title}</div>
                    <div className="text-xl font-bold text-cyan-700 dark:text-cyan-400 mt-1">{s.val}</div>
                    <div className="text-[9px] text-gray-400">{s.sub}</div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Consumption vs Settlement Trend</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><ComposedChart data={monthlyConsumption}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="consumed" fill="#0891b2" radius={[4, 4, 0, 0]} name="Consumed" />
                    <Line type="monotone" dataKey="settled" stroke="#10b981" strokeWidth={2} name="Settled" />
                    <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Pending" />
                  </ComposedChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Consignment Value Decomposition</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><AreaChart data={monthlyStockValue}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="totalValue" fill="#0891b230" stroke="#0891b2" name="Total" />
                    <Area type="monotone" dataKey="consumedValue" fill="#10b98130" stroke="#10b981" name="Consumed" />
                  </AreaChart></ResponsiveContainer>
                </CardContent></Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse-Wise Settlement Summary</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><BarChart data={warehouseValue}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="warehouse" fontSize={10} angle={-20} textAnchor="end" height={50} /><YAxis fontSize={11} />
                    <Tooltip formatter={(v: number) => fmtRupee(v)} /><Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="consigned" fill="#0891b2" stackId="s" name="Consigned" />
                    <Bar dataKey="consumed" fill="#10b981" stackId="s" name="Consumed" />
                    <Bar dataKey="disputed" fill="#ef4444" stackId="s" name="Disputed" />
                  </BarChart></ResponsiveContainer>
                </CardContent></Card>

                <Card className="cs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Dispute Breakdown</CardTitle></CardHeader><CardContent>
                  <ResponsiveContainer width="100%" height={240}><PieChart>
                    <Pie data={(() => {
                      const counts: Record<string, number> = {}
                      disputes.forEach((d) => { counts[d.issue.split(" ")[0]] = (counts[d.issue.split(" ")[0]] || 0) + 1 })
                      return Object.entries(counts).map(([name, count]) => ({ name, count }))
                    })()} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="count" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {(() => {
                      const counts: Record<string, number> = {}
                      disputes.forEach((d) => { counts[d.issue.split(" ")[0]] = (counts[d.issue.split(" ")[0]] || 0) + 1 })
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

      {/* STOCK DETAIL DRAWER */}
      {selectedStock && (
        <div className="cs-drawer-overlay" onClick={() => setSelectedStock(null)}>
          <div className="cs-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cs-drawer-header">
              <div className={cn("cs-status-banner", selectedStock.status === "Active" ? "cs-banner-active" : selectedStock.status === "Disputed" ? "cs-banner-disputed" : selectedStock.status === "Fully Consumed" ? "cs-banner-consumed" : selectedStock.status === "On Hold" ? "cs-banner-hold" : "cs-banner-default")}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedStock.id}</h3>
                    <p className="text-xs text-white/70">{selectedStock.product.name} · {selectedStock.supplier.name}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => setSelectedStock(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="cs-drawer-content space-y-4">
              {/* Flow */}
              <div className="cs-flow-dots">
                {["Consigned", "Received", "Consumed", "Settled"].map((step, i) => {
                  const active = (() => {
                    if (selectedStock.status === "Fully Consumed") return i <= 3
                    if (selectedStock.status === "Partially Consumed") return i <= 2
                    if (selectedStock.status === "Active") return i <= 1
                    return i === 0
                  })()
                  return (
                    <div key={step} className="flex items-center gap-1.5">
                      <div className={cn("cs-flow-dot", active ? "cs-dot-active" : "cs-dot-inactive")} />
                      <span className={cn("text-[10px]", active ? "text-cyan-700 font-medium" : "text-gray-400")}>{step}</span>
                      {i < 3 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                    </div>
                  )
                })}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Product SKU", value: selectedStock.product.sku, icon: Tag },
                  { label: "Category", value: selectedStock.product.cat, icon: Package },
                  { label: "Warehouse", value: selectedStock.warehouse, icon: Warehouse },
                  { label: "Zone", value: selectedStock.zone, icon: Boxes },
                  { label: "Supplier GST", value: selectedStock.supplier.gst.slice(-8), icon: FileText },
                  { label: "Agreement", value: selectedStock.agreementId, icon: Handshake },
                  { label: "Received", value: selectedStock.receivedDate, icon: Calendar },
                  { label: "Last Consumption", value: selectedStock.lastConsumption, icon: Clock },
                  { label: "Days in WH", value: `${selectedStock.daysInWarehouse} days`, icon: Clock },
                  { label: "Turnover Rate", value: `${selectedStock.turnoverRate}x/mo`, icon: RefreshCw },
                  { label: "Expiry", value: selectedStock.expiryDate, icon: Calendar },
                  { label: "Unit Price", value: fmtRupee(selectedStock.unitPrice), icon: IndianRupee },
                ].map((info) => (
                  <div key={info.label} className="cs-info-item rounded-lg p-2.5 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <info.icon className="h-3 w-3 text-cyan-500" />
                      <span className="text-[9px] text-gray-500 uppercase font-medium">{info.label}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">{info.value}</div>
                  </div>
                ))}
              </div>

              {/* Qty Box */}
              <div className="cs-qty-box rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-medium text-gray-500 uppercase mb-2">Quantity Summary</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedStock.qtyConsigned.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500">Consigned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-emerald-600">{selectedStock.qtyConsumed.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500">Consumed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-cyan-600">{selectedStock.qtyAvailable.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-red-600">{selectedStock.qtyDamaged.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500">Damaged</div>
                  </div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(selectedStock.qtyConsumed / selectedStock.qtyConsigned) * 100}%` }} />
                  <div className="bg-cyan-500 h-full" style={{ width: `${(selectedStock.qtyAvailable / selectedStock.qtyConsigned) * 100}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${(selectedStock.qtyDamaged / selectedStock.qtyConsigned) * 100}%` }} />
                </div>
                <div className="flex gap-3 mt-1">
                  <div className="flex items-center gap-1"><div className="h-1.5 w-3 rounded bg-emerald-500" /><span className="text-[8px] text-gray-500">Consumed</span></div>
                  <div className="flex items-center gap-1"><div className="h-1.5 w-3 rounded bg-cyan-500" /><span className="text-[8px] text-gray-500">Available</span></div>
                  <div className="flex items-center gap-1"><div className="h-1.5 w-3 rounded bg-red-500" /><span className="text-[8px] text-gray-500">Damaged</span></div>
                </div>
              </div>

              {/* Value Summary */}
              <div className="rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-medium text-gray-500 uppercase mb-2">Financial Summary</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-sm font-bold text-cyan-700">{fmtRupee(selectedStock.consignedValue)}</div>
                    <div className="text-[9px] text-gray-500">Consigned Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-emerald-600">{fmtRupee(selectedStock.consumedValue)}</div>
                    <div className="text-[9px] text-gray-500">Consumed Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-amber-600">{fmtRupee(selectedStock.pendingAmount)}</div>
                    <div className="text-[9px] text-gray-500">Pending Settlement</div>
                  </div>
                </div>
              </div>

              {/* Settlement Status */}
              <div className="rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-medium text-gray-500 uppercase mb-2">Settlement Status</div>
                <div className="flex items-center justify-between">
                  <Badge className={cn("text-[10px]", selectedStock.settlementStatus === "Pending" ? "cs-badge-settle-pending" : selectedStock.settlementStatus === "Settled" ? "cs-badge-paid" : selectedStock.settlementStatus === "Disputed" ? "cs-badge-disputed" : "text-gray-500 bg-gray-100")}>
                    {selectedStock.settlementStatus}
                  </Badge>
                  {selectedStock.pendingInvoices > 0 && (
                    <span className="text-[10px] text-amber-600">{selectedStock.pendingInvoices} pending invoices</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
