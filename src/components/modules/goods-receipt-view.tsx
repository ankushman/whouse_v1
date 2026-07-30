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
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import {
  FileCheck, Truck, Eye, Search, Star, Clock, Check,
  CircleCheck, CircleX, CircleAlert, ArrowRight, Package,
  Filter, X, Scale, Ruler, Scan, FlaskConical,
  Warehouse, ShieldCheck, Gauge, Timer,
  BarChart3, TrendingUp,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════
const WAREHOUSES = [
  { id: "WH-MUM", name: "Mumbai Central", city: "Mumbai" },
  { id: "WH-DEL", name: "Delhi NCR Hub", city: "Delhi" },
  { id: "WH-BLR", name: "Bengaluru South", city: "Bengaluru" },
  { id: "WH-CHN", name: "Chennai Port", city: "Chennai" },
  { id: "WH-HYD", name: "Hyderabad East", city: "Hyderabad" },
  { id: "WH-PUN", name: "Pune Industrial", city: "Pune" },
]

const GRN_STATUSES = ["Draft", "Submitted", "Under QC", "QC Passed", "QC Failed", "Partial Accepted", "Fully Accepted", "Rejected"]
const RECEIPT_TYPES = ["Purchase Order", "Stock Transfer", "Customer Return", "Vendor Return", "Sample/Free Goods", "Inter-Company"]
const PRIORITIES = ["Critical", "High", "Medium", "Low"]
const QC_METHODS = ["Visual Inspection", "Dimensional Check", "Weight Verification", "Lab Testing", "Barcode Scan", "Full Inspection", "Sampling (AQL)"]

const PRODUCTS = [
  { sku: "ELC-TV-001", name: 'Samsung 55-inch LED Smart TV', cat: "Electronics", uom: "Pcs", price: 42500, hsCode: "85287290" },
  { sku: "ELC-AC-002", name: "Daikin 1.5T Split AC", cat: "Electronics", uom: "Pcs", price: 38900, hsCode: "84151020" },
  { sku: "TEX-SH-003", name: "Cotton T-Shirt Pack (6pc)", cat: "Textiles", uom: "Box", price: 2400, hsCode: "61091020" },
  { sku: "PHA-MED-004", name: "Paracetamol 500mg (1000tab)", cat: "Pharma", uom: "Box", price: 850, hsCode: "30049099" },
  { sku: "FMT-RIC-005", name: "Basmati Rice 25kg Premium", cat: "Food", uom: "Bag", price: 1850, hsCode: "10063020" },
  { sku: "AUT-BR-006", name: "Brake Pad Set (Front)", cat: "Auto Parts", uom: "Set", price: 3200, hsCode: "87083010" },
  { sku: "ELC-MOB-007", name: "OnePlus 12 256GB", cat: "Electronics", uom: "Pcs", price: 54999, hsCode: "85171390" },
  { sku: "CHM-DTG-008", name: "Commercial Detergent 5L", cat: "Chemicals", uom: "Can", price: 680, hsCode: "34022000" },
  { sku: "TEX-DN-009", name: "Denim Jeans (32\"Waist)", cat: "Textiles", uom: "Pcs", price: 1850, hsCode: "62034290" },
  { sku: "FMT-OIL-010", name: "Mustard Oil 15L Tin", cat: "Food", uom: "Tin", price: 2750, hsCode: "15159010" },
  { sku: "PHA-INJ-011", name: "Insulin Pen (Pack of 5)", cat: "Pharma", uom: "Pack", price: 4200, hsCode: "30049099" },
  { sku: "AUT-FLT-012", name: "Air Filter Element", cat: "Auto Parts", uom: "Pcs", price: 950, hsCode: "84213190" },
  { sku: "ELC-LAP-013", name: "HP Laptop 15s (i5/8GB)", cat: "Electronics", uom: "Pcs", price: 52490, hsCode: "84713010" },
  { sku: "CHM-SOL-014", name: "Industrial Solvent 20L", cat: "Chemicals", uom: "Can", price: 3200, hsCode: "38140090" },
  { sku: "FMT-SPC-015", name: "Spice Mix Masala 500g", cat: "Food", uom: "Pkt", price: 280, hsCode: "09109990" },
]

const SUPPLIERS = [
  { id: "SUP-001", name: "Tata Steel Ltd", city: "Mumbai", gst: "27AABCT1332L1ZA", rating: 4.8, leadDays: 7 },
  { id: "SUP-002", name: "Mahindra & Mahindra", city: "Pune", gst: "27AABCM1234L1Z5", rating: 4.5, leadDays: 10 },
  { id: "SUP-003", name: "Dabur India Ltd", city: "Delhi", gst: "07AABCD5678L1Z1", rating: 4.7, leadDays: 5 },
  { id: "SUP-004", name: "Reliance Retail", city: "Mumbai", gst: "27AABCR9012L1Z3", rating: 4.3, leadDays: 3 },
  { id: "SUP-005", name: "Wipro Consumer Care", city: "Bengaluru", gst: "29AABCW3456L1Z9", rating: 4.6, leadDays: 6 },
  { id: "SUP-006", name: "TVS Electronics", city: "Chennai", gst: "33AABCT7890L1Z7", rating: 4.2, leadDays: 8 },
  { id: "SUP-007", name: "Asian Paints Ltd", city: "Mumbai", gst: "27AABCA2345L1Z2", rating: 4.9, leadDays: 4 },
  { id: "SUP-008", name: "Godrej Consumer Products", city: "Hyderabad", gst: "36AABCG6789L1Z4", rating: 4.4, leadDays: 6 },
]

const RECEIVERS = [
  { id: "RCV-01", name: "Rajesh Kumar", warehouse: "WH-MUM", cert: "QC Level-3" },
  { id: "RCV-02", name: "Priya Sharma", warehouse: "WH-DEL", cert: "QC Level-2" },
  { id: "RCV-03", name: "Arun Patel", warehouse: "WH-BLR", cert: "QC Level-3" },
  { id: "RCV-04", name: "Meena Iyer", warehouse: "WH-CHN", cert: "QC Level-2" },
  { id: "RCV-05", name: "Suresh Reddy", warehouse: "WH-HYD", cert: "QC Level-3" },
  { id: "RCV-06", name: "Vikram Joshi", warehouse: "WH-PUN", cert: "QC Level-2" },
]

const TEAL = "#14b8a6"
const ORANGE = "#f97316"
const LIME = "#84cc16"
const COLORS = [TEAL, ORANGE, LIME, "#6366f1", "#ec4899", "#06b6d4"]

const QC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Visual Inspection": Eye,
  "Dimensional Check": Ruler,
  "Weight Verification": Scale,
  "Lab Testing": FlaskConical,
  "Barcode Scan": Scan,
  "Full Inspection": ShieldCheck,
  "Sampling (AQL)": Package,
}

// ═══════════════════════════════════════════════════════════════
// Data Generators
// ═══════════════════════════════════════════════════════════════
const seed = 135135
const sRand = (i: number) => ((Math.sin(seed + i) * 10000) % 1 + 1) % 1

const genGRNRecords = () => {
  const records: Array<{
    id: string; poRef: string; supplier: typeof SUPPLIERS[0]; gst: string;
    product: typeof PRODUCTS[0]; orderedQty: number; receivedQty: number;
    variance: number; type: string; priority: string; status: string;
    unitPrice: number; total: number; warehouse: typeof WAREHOUSES[0];
    receiver: typeof RECEIVERS[0]; date: string;
  }> = []
  for (let i = 0; i < 120; i++) {
    const supplier = SUPPLIERS[Math.floor(sRand(i * 7) * 8)]
    const product = PRODUCTS[Math.floor(sRand(i * 3 + 1) * 15)]
    const warehouse = WAREHOUSES[Math.floor(sRand(i * 5 + 2) * 6)]
    const receiver = RECEIVERS[Math.floor(sRand(i * 11 + 3) * 6)]
    const orderedQty = Math.floor(sRand(i * 13 + 4) * 450) + 50
    const varPct = (sRand(i * 17 + 5) - 0.45) * 0.2
    const receivedQty = Math.round(orderedQty * (1 + varPct))
    const variance = receivedQty - orderedQty
    const type = RECEIPT_TYPES[Math.floor(sRand(i * 19 + 6) * 6)]
    const priority = PRIORITIES[Math.floor(sRand(i * 23 + 7) * 4)]
    const status = GRN_STATUSES[Math.floor(sRand(i * 29 + 8) * 8)]
    const day = Math.floor(sRand(i * 31 + 9) * 28) + 1
    const month = Math.floor(sRand(i * 37 + 10) * 6) + 7
    const total = receivedQty * product.price
    records.push({
      id: `GRN-2026-${String(10001 + i).slice(1)}`,
      poRef: `PO-2026-${String(2001 + i).slice(1)}`,
      supplier, gst: supplier.gst,
      product, orderedQty, receivedQty, variance,
      type, priority, status,
      unitPrice: product.price, total, warehouse, receiver,
      date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    })
  }
  return records
}

const genQCQueue = () => {
  const items: Array<{
    id: string; supplier: string; product: string; sku: string;
    cat: string; qty: number; method: string; result: string;
    inspector: string; defects: number; timeMin: number; notes: string;
  }> = []
  for (let i = 0; i < 60; i++) {
    const supplier = SUPPLIERS[Math.floor(sRand(i * 7 + 100) * 8)]
    const product = PRODUCTS[Math.floor(sRand(i * 3 + 101) * 15)]
    const method = QC_METHODS[Math.floor(sRand(i * 11 + 102) * 7)]
    const results = ["Pass", "Pass", "Pass", "Fail", "Conditional Pass"]
    const result = results[Math.floor(sRand(i * 13 + 103) * 5)]
    const receiver = RECEIVERS[Math.floor(sRand(i * 17 + 104) * 6)]
    items.push({
      id: `GRN-2026-${String(10001 + i).slice(1)}`,
      supplier: supplier.name,
      product: product.name,
      sku: product.sku,
      cat: product.cat,
      qty: Math.floor(sRand(i * 19 + 105) * 450) + 50,
      method,
      result,
      inspector: receiver.name,
      defects: Math.floor(sRand(i * 23 + 106) * 8),
      timeMin: Math.floor(sRand(i * 29 + 107) * 25) + 3,
      notes: result === "Fail" ? "Surface scratches" : sRand(i * 31 + 108) > 0.5 ? "Within spec" : "Minor dents",
    })
  }
  return items
}

const genInvoiceData = () => {
  const items: Array<{
    id: string; grnId: string; poId: string; supplier: string;
    invAmt: number; poAmt: number; grnAmt: number;
    variance: number; varPct: number; matchStatus: string;
  }> = []
  const statuses = ["Matched", "Matched", "Matched", "Matched", "Mismatch", "Mismatch", "Pending"]
  for (let i = 0; i < 60; i++) {
    const supplier = SUPPLIERS[Math.floor(sRand(i * 7 + 200) * 8)]
    const poAmt = (Math.floor(sRand(i * 11 + 201) * 500) + 50) * 1000
    const invVar = (sRand(i * 13 + 202) - 0.4) * 0.15
    const invAmt = Math.round(poAmt * (1 + invVar))
    const grnVar = (sRand(i * 17 + 203) - 0.4) * 0.1
    const grnAmt = Math.round(poAmt * (1 + grnVar))
    const variance = invAmt - grnAmt
    const varPct = poAmt > 0 ? (variance / poAmt) * 100 : 0
    items.push({
      id: `INV-2026-${String(3001 + i).slice(1)}`,
      grnId: `GRN-2026-${String(10001 + i).slice(1)}`,
      poId: `PO-2026-${String(2001 + i).slice(1)}`,
      supplier: supplier.name,
      invAmt, poAmt, grnAmt,
      variance, varPct: Math.round(varPct * 10) / 10,
      matchStatus: statuses[Math.floor(sRand(i * 19 + 204) * 7)],
    })
  }
  return items
}

const genScorecard = () => SUPPLIERS.map((s, i) => {
  const grns = Math.floor(sRand(i * 7 + 300) * 40) + 15
  const accPct = Math.round((90 + sRand(i * 11 + 301) * 10) * 10) / 10
  const leadDays = Math.round(s.leadDays * (0.8 + sRand(i * 13 + 302) * 0.4))
  const otif = Math.round((85 + sRand(i * 17 + 303) * 15) * 10) / 10
  const quality = Math.round((90 + sRand(i * 19 + 304) * 10) * 10) / 10
  const terms = ["Net 30", "Net 45", "Net 60", "Net 15"][i % 4]
  return { supplier: s.name, city: s.city, grns, accPct, leadDays, otif, quality, terms, rating: s.rating }
})

// ═══════════════════════════════════════════════════════════════
// Chart Data
// ═══════════════════════════════════════════════════════════════
const monthlyVolume = (() => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((m, i) => ({
    month: m,
    received: Math.floor(120 + sRand(i * 7 + 400) * 80),
    acceptance: Math.round((90 + sRand(i * 11 + 401) * 9) * 10) / 10,
  }))
})()

const receiptTypeData = (() => RECEIPT_TYPES.map((t, i) => ({ name: t, value: Math.floor(10 + sRand(i * 7 + 500) * 40) })))()

const warehousePerf = (() => WAREHOUSES.map((w, i) => ({
  name: w.city,
  grns: Math.floor(80 + sRand(i * 7 + 600) * 60),
  avgTime: Math.round(40 + sRand(i * 11 + 601) * 30),
})))()

const supplierQuality = (() => SUPPLIERS.map((s, i) => ({
  name: s.name.split(" ")[0],
  passed: Math.floor(50 + sRand(i * 7 + 700) * 50),
  failed: Math.floor(2 + sRand(i * 11 + 701) * 10),
})))()

const qcMethodData = (() => QC_METHODS.map((m, i) => ({ name: m, value: Math.floor(5 + sRand(i * 7 + 800) * 20) })))()

const catQCData = (() => {
  const cats = ["Electronics", "Textiles", "Pharma", "Food", "Auto Parts", "Chemicals"]
  return cats.map((c, i) => ({
    category: c,
    pass: Math.floor(30 + sRand(i * 7 + 900) * 40),
    fail: Math.floor(1 + sRand(i * 11 + 901) * 8),
    conditional: Math.floor(1 + sRand(i * 13 + 902) * 5),
  }))
})()

const mismatchTrend = (() => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((m, i) => ({
    month: m,
    matched: Math.floor(10 + sRand(i * 7 + 1000) * 8),
    mismatch: Math.floor(1 + sRand(i * 11 + 1001) * 3),
    mismatchRate: Math.round((5 + sRand(i * 13 + 1002) * 10) * 10) / 10,
  }))
})()

const leadTimeData = (() => SUPPLIERS.map((s, i) => ({
  name: s.name.split(" ")[0],
  days: Math.round(s.leadDays * (0.8 + sRand(i * 7 + 1100) * 0.4)),
})))()

const receiptValueData = (() => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((m, i) => ({
    month: m,
    value: Math.floor(200 + sRand(i * 7 + 1200) * 300),
    cost: Math.floor(120 + sRand(i * 11 + 1201) * 100),
  }))
})()

// ═══════════════════════════════════════════════════════════════
// Helper Components
// ═══════════════════════════════════════════════════════════════
function KPICard({ title, value, icon: Icon, color, sub }: {
  title: string; value: string; icon: React.ComponentType<{ className?: string }>; color: string; sub?: string
}) {
  return (
    <Card className="grn-kpi-card">
      <CardContent className="glass-subtle p-4 flex items-center gap-3">
        <div className={"grn-kpi-icon " + color}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground truncate">{title}</p>
          <p className={"text-xl font-bold " + color}>{value}</p>
          {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cls = (() => {
    switch (status) {
      case "Draft": return "grn-badge-draft"
      case "Submitted": return "grn-badge-submitted"
      case "Under QC": return "grn-badge-under-qc"
      case "QC Passed": return "grn-badge-qc-passed"
      case "QC Failed": return "grn-badge-qc-failed"
      case "Partial Accepted": return "grn-badge-partial"
      case "Fully Accepted": return "grn-badge-accepted"
      case "Rejected": return "grn-badge-rejected"
      default: return ""
    }
  })()
  const pulse = status === "Under QC" || status === "QC Failed" ? "grn-pulse-badge" : ""
  return <Badge className={`${cls} ${pulse}`}>{status}</Badge>
}

function TypeBadge({ type }: { type: string }) {
  const cls = (() => {
    switch (type) {
      case "Purchase Order": return "grn-badge-po"
      case "Stock Transfer": return "grn-badge-transfer"
      case "Customer Return": return "grn-badge-cust-return"
      case "Vendor Return": return "grn-badge-vendor-return"
      case "Sample/Free Goods": return "grn-badge-sample"
      case "Inter-Company": return "grn-badge-interco"
      default: return ""
    }
  })()
  return <Badge className={cls}>{type}</Badge>
}

function PriorityBadge({ priority }: { priority: string }) {
  const cls = (() => {
    switch (priority) {
      case "Critical": return "grn-badge-critical"
      case "High": return "grn-badge-high"
      case "Medium": return "grn-badge-medium"
      case "Low": return "grn-badge-low"
      default: return ""
    }
  })()
  return <Badge className={cls}>{priority}</Badge>
}

function QCMethodBadge({ method }: { method: string }) {
  const IconComp = QC_ICONS[method] || Eye
  return <Badge className="badge-interactive grn-badge-qc-method"><IconComp className="h-3 w-3 mr-1" />{method}</Badge>
}

function QCResultBadge({ result }: { result: string }) {
  const cls = (() => {
    switch (result) {
      case "Pass": return "grn-badge-pass"
      case "Fail": return "grn-badge-fail"
      case "Conditional Pass": return "grn-badge-conditional"
      default: return ""
    }
  })()
  return <Badge className={cls}>{result}</Badge>
}

function MatchBadge({ status }: { status: string }) {
  const cls = (() => {
    switch (status) {
      case "Matched": return "grn-badge-matched"
      case "Mismatch": return "grn-badge-mismatch"
      case "Pending": return "grn-badge-pending"
      default: return ""
    }
  })()
  return <Badge className={cls}>{status}</Badge>
}

function VarianceDisplay({ variance }: { variance: number }) {
  return (
    <span className={"grn-variance " + (variance > 0 ? "grn-var-pos" : variance < 0 ? "grn-var-neg" : "")}>
      {variance > 0 ? "+" : ""}{variance}
    </span>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={"h-3.5 w-3.5 grn-star " + (s <= Math.round(rating) ? "grn-star-filled" : "grn-star-empty")} />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  )
}

function QualityBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 w-24">
      <div className="grn-quality-bar-bg flex-1 h-2 rounded-full">
        <div className="grn-quality-bar-fill h-2 rounded-full" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-10 text-right">{value}%</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// GRN Detail Drawer
// ═══════════════════════════════════════════════════════════════
function GRNDetailDrawer({ grn, open, onOpenChange }: {
  grn: ReturnType<typeof genGRNRecords>[0] | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  if (!grn) return null
  const acceptedQty = Math.round(grn.receivedQty * 0.92)
  const rejectedQty = grn.receivedQty - acceptedQty
  const poTotal = grn.orderedQty * grn.unitPrice
  const invTotal = Math.round(poTotal * (1 + (sRand(parseInt(grn.id.slice(-5)) + 2000) - 0.4) * 0.1))
  const variance = invTotal - poTotal

  const statusStep = (() => {
    const idx = GRN_STATUSES.indexOf(grn.status)
    return idx >= 0 ? idx : 0
  })()

  const flowStep = (() => {
    if (statusStep >= 6) return 4
    if (statusStep >= 3) return 3
    if (statusStep >= 1) return 2
    return 1
  })()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="grn-drawer w-full sm:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="grn-drawer-header p-4 pb-2">
          <SheetTitle className="text-base font-semibold flex items-center gap-2">
            <FileCheck className="h-5 w-5" style={{ color: TEAL }} />
            {grn.id}
          </SheetTitle>
          <StatusBadge status={grn.status} />
        </SheetHeader>

        <div className="p-4 space-y-4">
          {/* Receipt Flow */}
          <div className="grn-receipt-flow">
            {["Truck Arrival", "Unloading", "QC", "Putaway"].map((step, i) => (
              <div key={step} className="grn-flow-step">
                <div className={"grn-flow-dot " + (i < flowStep ? "grn-flow-dot-active" : i === flowStep ? "grn-flow-dot-current" : "")}>
                  {i < flowStep ? <Check className="h-3 w-3" /> : <span className="text-[10px]">{i + 1}</span>}
                </div>
                <span className={"text-[10px] mt-1 " + (i <= flowStep ? "text-foreground" : "text-muted-foreground")}>{step}</span>
                {i < 3 && <ArrowRight className="h-3 w-3 text-muted-foreground mt-0.5" />}
              </div>
            ))}
          </div>

          {/* Info Grid */}
          <div className="grn-info-grid">
            <div className="grn-info-item"><span className="text-[10px] text-muted-foreground">PO Reference</span><span className="text-xs font-medium">{grn.poRef}</span></div>
            <div className="grn-info-item"><span className="text-[10px] text-muted-foreground">Supplier</span><span className="text-xs font-medium">{grn.supplier.name}</span></div>
            <div className="grn-info-item"><span className="text-[10px] text-muted-foreground">GST</span><span className="text-xs font-mono">{grn.gst}</span></div>
            <div className="grn-info-item"><span className="text-[10px] text-muted-foreground">Product</span><span className="text-xs font-medium">{grn.product.name}</span></div>
            <div className="grn-info-item"><span className="text-[10px] text-muted-foreground">SKU</span><span className="text-xs font-mono">{grn.product.sku}</span></div>
            <div className="grn-info-item"><span className="text-[10px] text-muted-foreground">Category</span><span className="text-xs font-medium">{grn.product.cat}</span></div>
            <div className="grn-info-item"><span className="text-[10px] text-muted-foreground">Warehouse</span><span className="text-xs font-medium">{grn.warehouse.name}</span></div>
            <div className="grn-info-item"><span className="text-[10px] text-muted-foreground">Receiver</span><span className="text-xs font-medium">{grn.receiver.name}</span></div>
          </div>

          {/* Qty Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="grn-qty-box grn-qty-ordered"><span className="text-[10px]">Ordered</span><span className="text-lg font-bold">{grn.orderedQty}</span></div>
            <div className="grn-qty-box grn-qty-received"><span className="text-[10px]">Received</span><span className="text-lg font-bold">{grn.receivedQty}</span></div>
            <div className="grn-qty-box grn-qty-accepted"><span className="text-[10px]">Accepted</span><span className="text-lg font-bold">{acceptedQty}</span></div>
            <div className="grn-qty-box grn-qty-rejected"><span className="text-[10px]">Rejected</span><span className="text-lg font-bold">{rejectedQty}</span></div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="grn-fin-box grn-fin-po"><span className="text-[10px]">PO Value</span><span className="text-sm font-bold">₹{(poTotal / 1000).toFixed(1)}K</span></div>
            <div className="grn-fin-box grn-fin-inv"><span className="text-[10px]">Invoice Value</span><span className="text-sm font-bold">₹{(invTotal / 1000).toFixed(1)}K</span></div>
            <div className="grn-fin-box grn-fin-var"><span className="text-[10px]">Variance</span><span className={"text-sm font-bold " + (variance >= 0 ? "text-emerald-500" : "text-red-500")}>{variance >= 0 ? "+" : ""}₹{(variance / 1000).toFixed(1)}K</span></div>
          </div>

          {/* QC Result Box */}
          <div className="grn-qc-result-box">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4" style={{ color: ORANGE }} />
              <span className="text-xs font-semibold">Quality Check Result</span>
            </div>
            <div className="flex items-center gap-3">
              <QCResultBadge result={statusStep >= 3 && statusStep < 5 ? "Pass" : statusStep === 4 ? "Fail" : "Pending"} />
              <span className="text-xs text-muted-foreground">Method: {QC_METHODS[statusStep % 7]}</span>
              <span className="text-xs text-muted-foreground">Inspector: {grn.receiver.name}</span>
            </div>
          </div>

          {/* Invoice Match Box */}
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="h-4 w-4" style={{ color: TEAL }} />
              <span className="text-xs font-semibold">Invoice Match</span>
            </div>
            <div className="flex items-center gap-3">
              <MatchBadge status={variance <= poTotal * 0.05 ? "Matched" : "Mismatch"} />
              <span className="text-xs text-muted-foreground">3-Way: PO ↔ GRN ↔ Invoice</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-1">
            <span className="text-xs font-semibold">Receipt Timeline</span>
            <div className="grn-timeline">
              {[
                { label: "PO Created", time: "2026-07-15 09:00", done: true },
                { label: "GRN Drafted", time: "2026-07-22 08:30", done: true },
                { label: "Truck Arrived", time: "2026-07-22 10:15", done: true },
                { label: "Unloading Done", time: "2026-07-22 11:45", done: true },
                { label: "QC Completed", time: "2026-07-22 14:20", done: statusStep >= 3 },
                { label: "Putaway Done", time: "2026-07-22 16:00", done: statusStep >= 6 },
              ].map((step, i) => (
                <div key={step.label} className="grn-timeline-step">
                  <div className={"grn-timeline-dot " + (step.done ? "grn-timeline-dot-done" : "")}>
                    {step.done && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={"text-xs " + (step.done ? "font-medium" : "text-muted-foreground")}>{step.label}</span>
                    <span className="text-[10px] text-muted-foreground block">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="grn-drawer-footer">
            <div><Timer className="h-3 w-3" /><span>Duration: 7h 15m</span></div>
            <div><Warehouse className="h-3 w-3" /><span>Dock: D-{String(Math.floor(sRand(parseInt(grn.id.slice(-5)) + 3000) * 8) + 1).padStart(2, "0")}</span></div>
            <div><Truck className="h-3 w-3" /><span>Transporter: TC-{String(1000 + parseInt(grn.id.slice(-5)))}</span></div>
            <div><FileCheck className="h-3 w-3" /><span>LR#: LR-2026-{String(parseInt(grn.id.slice(-5)) + 5000)}</span></div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════
export default function GoodsReceiptView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedGRN, setSelectedGRN] = useState<ReturnType<typeof genGRNRecords>[0] | null>(null)

  const grnRecords = (() => genGRNRecords())()
  const qcQueue = (() => genQCQueue())()
  const invoiceData = (() => genInvoiceData())()
  const scorecard = (() => genScorecard())()

  const filteredGRN = (() => {
    return grnRecords.filter((r) => {
      const q = search.toLowerCase()
      if (q && !r.id.toLowerCase().includes(q) && !r.poRef.toLowerCase().includes(q) &&
          !r.supplier.name.toLowerCase().includes(q) && !r.product.sku.toLowerCase().includes(q) &&
          !r.product.name.toLowerCase().includes(q)) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (typeFilter !== "all" && r.type !== typeFilter) return false
      if (priorityFilter !== "all" && r.priority !== priorityFilter) return false
      return true
    })
  })()

  const openDrawer = (grn: typeof grnRecords[0]) => { setSelectedGRN(grn); setDrawerOpen(true) }

  const fmt = (n: number) => n.toLocaleString("en-IN")

  return (
    <div className="grn-container space-y-4">
      <div className="grn-top-bar">
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" style={{ color: TEAL }} />
          <h1 className="text-lg font-bold">Goods Receipt & GRN Management</h1>
          <Badge className="badge-interactive grn-badge-teal">R135</Badge>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grn-tab-list">
          <TabsTrigger value="dashboard" className="grn-tab-trigger"><BarChart3 className="h-3.5 w-3.5 mr-1" />Dashboard</TabsTrigger>
          <TabsTrigger value="register" className="grn-tab-trigger"><FileCheck className="h-3.5 w-3.5 mr-1" />GRN Register</TabsTrigger>
          <TabsTrigger value="quality" className="grn-tab-trigger"><ShieldCheck className="h-3.5 w-3.5 mr-1" />Quality Inspection</TabsTrigger>
          <TabsTrigger value="invoice" className="grn-tab-trigger"><Scale className="h-3.5 w-3.5 mr-1" />Invoice Matching</TabsTrigger>
          <TabsTrigger value="analytics" className="grn-tab-trigger"><TrendingUp className="h-3.5 w-3.5 mr-1" />Receipt Analytics</TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: Dashboard ─── */}
        {tab === "dashboard" && (
          <div className="grn-tab-content space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <KPICard title="Total GRNs Today" value="156" icon={FileCheck} color="grn-text-teal" sub="+12% vs yesterday" />
              <KPICard title="Pending QC" value="18" icon={ShieldCheck} color="grn-text-orange" sub="3 critical" />
              <KPICard title="QC Passed" value="98" icon={CircleCheck} color="grn-text-lime" sub="95.6% rate" />
              <KPICard title="Rejected" value="4" icon={CircleX} color="grn-text-red" sub="-2 vs last week" />
              <KPICard title="Avg Receipt Time" value="52 min" icon={Timer} color="grn-text-teal" sub="Dock-to-stock" />
              <KPICard title="Acceptance Rate" value="94.8%" icon={Gauge} color="grn-text-lime" sub="Target: 95%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="grn-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly GRN Volume & Acceptance Trend</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={monthlyVolume}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[85, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="received" fill={TEAL} radius={[4, 4, 0, 0]} name="GRNs Received" />
                    <Line yAxisId="right" type="monotone" dataKey="acceptance" stroke={ORANGE} strokeWidth={2} name="Acceptance %" dot={{ fill: ORANGE, r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer></CardContent>
              </Card>

              <Card className="grn-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Receipt Type Distribution</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={260}>
                  <PieChart><Pie data={receiptTypeData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ fontSize: 10 }}>
                    {receiptTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie><Tooltip /><Legend /></PieChart>
                </ResponsiveContainer></CardContent>
              </Card>

              <Card className="grn-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse Performance</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={260}>
                  <BarChart data={warehousePerf}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="grns" fill={TEAL} radius={[4, 4, 0, 0]} name="GRNs Processed" />
                    <Bar dataKey="avgTime" fill={ORANGE} radius={[4, 4, 0, 0]} name="Avg Time (min)" />
                  </BarChart>
                </ResponsiveContainer></CardContent>
              </Card>

              <Card className="grn-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Supplier Quality Overview</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={260}>
                  <BarChart data={supplierQuality} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="passed" fill={LIME} radius={[0, 4, 4, 0]} name="Passed" />
                    <Bar dataKey="failed" fill="#ef4444" radius={[0, 4, 4, 0]} name="Failed" />
                  </BarChart>
                </ResponsiveContainer></CardContent>
              </Card>
            </div>

            <Card className="grn-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">QC Method Distribution</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={240}>
                <PieChart><Pie data={qcMethodData} cx="50%" cy="50%" outerRadius={85} innerRadius={45} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ fontSize: 10 }}>
                  {qcMethodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie><Tooltip /><Legend /></PieChart>
              </ResponsiveContainer></CardContent>
            </Card>
          </div>
        )}

        {/* ─── TAB 2: GRN Register ─── */}
        {tab === "register" && (
          <div className="grn-tab-content space-y-4">
            <div className="grn-filter-bar">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search GRN#/PO#/Supplier/SKU/Product" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 text-xs" />
                {search && <X className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground cursor-pointer" onClick={() => setSearch("")} />}
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>{["all", ...GRN_STATUSES].map((s) => <SelectItem key={s} value={s} className="text-xs">{s === "all" ? "All Statuses" : s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-36 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>{["all", ...RECEIPT_TYPES].map((t) => <SelectItem key={t} value={t} className="text-xs">{t === "all" ? "All Types" : t}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="h-9 w-36 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>{["all", ...PRIORITIES].map((p) => <SelectItem key={p} value={p} className="text-xs">{p === "all" ? "All Priorities" : p}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="btn-outline-animate h-9 text-xs" onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); setPriorityFilter("all") }}><Filter className="h-3 w-3 mr-1" />Reset</Button>
            </div>

            <div className="rounded-lg border overflow-auto">
              <Table className="table-hover-highlight grn-table">
                <TableHeader><TableRow className="grn-table-header">
                  <TableHead className="text-[10px]">GRN#</TableHead>
                  <TableHead className="text-[10px]">PO Ref</TableHead>
                  <TableHead className="text-[10px]">Supplier</TableHead>
                  <TableHead className="text-[10px]">GST</TableHead>
                  <TableHead className="text-[10px]">SKU</TableHead>
                  <TableHead className="text-[10px]">Product</TableHead>
                  <TableHead className="text-[10px]">Cat</TableHead>
                  <TableHead className="text-[10px]">Ord Qty</TableHead>
                  <TableHead className="text-[10px]">Rcv Qty</TableHead>
                  <TableHead className="text-[10px]">Var</TableHead>
                  <TableHead className="text-[10px]">Type</TableHead>
                  <TableHead className="text-[10px]">Priority</TableHead>
                  <TableHead className="text-[10px]">Status</TableHead>
                  <TableHead className="text-[10px]">Unit Price</TableHead>
                  <TableHead className="text-[10px]">Total ₹</TableHead>
                  <TableHead className="text-[10px]">Warehouse</TableHead>
                  <TableHead className="text-[10px]">Receiver</TableHead>
                  <TableHead className="text-[10px]">Date</TableHead>
                  <TableHead className="text-[10px]">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredGRN.map((r) => (
                    <TableRow key={r.id} className="grn-table-row">
                      <TableCell className="text-xs font-mono font-medium">{r.id}</TableCell>
                      <TableCell className="text-xs font-mono">{r.poRef}</TableCell>
                      <TableCell className="text-xs"><div>{r.supplier.name}</div><div className="text-[10px] text-muted-foreground">{r.supplier.city}</div></TableCell>
                      <TableCell className="text-[10px] font-mono text-muted-foreground">{r.gst}</TableCell>
                      <TableCell className="text-[10px] font-mono">{r.product.sku}</TableCell>
                      <TableCell className="text-xs max-w-[140px] truncate">{r.product.name}</TableCell>
                      <TableCell className="text-xs">{r.product.cat}</TableCell>
                      <TableCell className="text-xs text-right">{r.orderedQty}</TableCell>
                      <TableCell className="text-xs text-right">{r.receivedQty}</TableCell>
                      <TableCell className="text-xs text-right"><VarianceDisplay variance={r.variance} /></TableCell>
                      <TableCell><TypeBadge type={r.type} /></TableCell>
                      <TableCell><PriorityBadge priority={r.priority} /></TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="numeric-cell text-xs text-right">₹{fmt(r.unitPrice)}</TableCell>
                      <TableCell className="numeric-cell text-xs text-right font-medium">₹{fmt(r.total)}</TableCell>
                      <TableCell className="text-[10px]">{r.warehouse.city}</TableCell>
                      <TableCell className="text-xs">{r.receiver.name}</TableCell>
                      <TableCell className="text-[10px]">{r.date}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" className="h-7" onClick={() => openDrawer(r)}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="text-xs text-muted-foreground">Showing {filteredGRN.length} of {grnRecords.length} GRN records</div>
          </div>
        )}

        {/* ─── TAB 3: Quality Inspection ─── */}
        {tab === "quality" && (
          <div className="grn-tab-content space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPICard title="Pending Inspection" value="18" icon={Clock} color="grn-text-orange" sub="3 overdue" />
              <KPICard title="Inspected Today" value="82" icon={ShieldCheck} color="grn-text-teal" sub="+15% vs avg" />
              <KPICard title="Pass Rate" value="95.6%" icon={CircleCheck} color="grn-text-lime" sub="Target: 95%" />
              <KPICard title="Avg QC Time" value="12 min" icon={Timer} color="grn-text-teal" sub="-2 min vs last week" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="grn-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">QC Result Distribution</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={260}>
                  <PieChart><Pie data={[
                    { name: "Pass", value: 75 }, { name: "Fail", value: 4 }, { name: "Conditional", value: 12 }, { name: "Pending", value: 18 },
                  ]} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ fontSize: 10 }}>
                    <Cell fill={LIME} /><Cell fill="#ef4444" /><Cell fill={ORANGE} /><Cell fill="#94a3b8" />
                  </Pie><Tooltip /><Legend /></PieChart>
                </ResponsiveContainer></CardContent>
              </Card>

              <Card className="grn-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Category-wise QC Results</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={260}>
                  <BarChart data={catQCData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pass" fill={LIME} radius={[4, 4, 0, 0]} name="Pass" />
                    <Bar dataKey="fail" fill="#ef4444" radius={[4, 4, 0, 0]} name="Fail" />
                    <Bar dataKey="conditional" fill={ORANGE} radius={[4, 4, 0, 0]} name="Conditional" />
                  </BarChart>
                </ResponsiveContainer></CardContent>
              </Card>
            </div>

            <Card className="card-crud-lift grn-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">QC Queue ({qcQueue.length} items)</CardTitle></CardHeader>
              <CardContent><div className="rounded-lg border overflow-auto">
                <Table className="table-hover-highlight grn-table">
                  <TableHeader><TableRow className="grn-table-header">
                    <TableHead className="text-[10px]">GRN#</TableHead>
                    <TableHead className="text-[10px]">Supplier</TableHead>
                    <TableHead className="text-[10px]">Product / SKU</TableHead>
                    <TableHead className="text-[10px]">Cat</TableHead>
                    <TableHead className="text-[10px]">Qty</TableHead>
                    <TableHead className="text-[10px]">QC Method</TableHead>
                    <TableHead className="text-[10px]">Result</TableHead>
                    <TableHead className="text-[10px]">Inspector</TableHead>
                    <TableHead className="text-[10px]">Defects</TableHead>
                    <TableHead className="text-[10px]">Time</TableHead>
                    <TableHead className="text-[10px]">Notes</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {qcQueue.map((item) => (
                      <TableRow key={item.id} className="grn-table-row">
                        <TableCell className="text-xs font-mono">{item.id}</TableCell>
                        <TableCell className="text-xs">{item.supplier}</TableCell>
                        <TableCell className="text-xs"><div className="font-medium">{item.product}</div><div className="text-[10px] text-muted-foreground font-mono">{item.sku}</div></TableCell>
                        <TableCell className="text-xs">{item.cat}</TableCell>
                        <TableCell className="text-xs text-right">{item.qty}</TableCell>
                        <TableCell><QCMethodBadge method={item.method} /></TableCell>
                        <TableCell><QCResultBadge result={item.result} /></TableCell>
                        <TableCell className="text-xs">{item.inspector}</TableCell>
                        <TableCell className={"text-xs text-right font-medium " + (item.defects > 3 ? "text-red-500" : "")}>{item.defects}</TableCell>
                        <TableCell className="text-xs text-right">{item.timeMin} min</TableCell>
                        <TableCell className="text-[10px] text-muted-foreground max-w-[120px] truncate">{item.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div></CardContent>
            </Card>
          </div>
        )}

        {/* ─── TAB 4: Invoice Matching ─── */}
        {tab === "invoice" && (
          <div className="grn-tab-content space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPICard title="Total Invoices" value="142" icon={FileCheck} color="grn-text-teal" sub="This month" />
              <KPICard title="Matched" value="118" icon={CircleCheck} color="grn-text-lime" sub="83.1%" />
              <KPICard title="Mismatch" value="16" icon={CircleAlert} color="grn-text-orange" sub="11.3%" />
              <KPICard title="Pending" value="8" icon={Clock} color="grn-text-muted" sub="Awaiting review" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="grn-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">3-Way Match Status</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={260}>
                  <PieChart><Pie data={[
                    { name: "Matched", value: 118 }, { name: "Mismatch", value: 16 }, { name: "Pending", value: 8 },
                  ]} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ fontSize: 10 }}>
                    <Cell fill={LIME} /><Cell fill={ORANGE} /><Cell fill="#94a3b8" />
                  </Pie><Tooltip /><Legend /></PieChart>
                </ResponsiveContainer></CardContent>
              </Card>

              <Card className="grn-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Mismatch Trend</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={mismatchTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[0, 20]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="matched" fill={LIME} radius={[4, 4, 0, 0]} name="Matched" />
                    <Bar yAxisId="left" dataKey="mismatch" fill={ORANGE} radius={[4, 4, 0, 0]} name="Mismatch" />
                    <Line yAxisId="right" type="monotone" dataKey="mismatchRate" stroke="#ef4444" strokeWidth={2} name="Mismatch %" dot={{ fill: "#ef4444", r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer></CardContent>
              </Card>
            </div>

            <Card className="card-crud-lift grn-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Invoice Matching Details ({invoiceData.length})</CardTitle></CardHeader>
              <CardContent><div className="rounded-lg border overflow-auto">
                <Table className="table-hover-highlight grn-table">
                  <TableHeader><TableRow className="grn-table-header">
                    <TableHead className="text-[10px]">Invoice#</TableHead>
                    <TableHead className="text-[10px]">GRN#</TableHead>
                    <TableHead className="text-[10px]">PO#</TableHead>
                    <TableHead className="text-[10px]">Supplier</TableHead>
                    <TableHead className="text-[10px] text-right">Invoice Amt ₹</TableHead>
                    <TableHead className="text-[10px] text-right">PO Amt ₹</TableHead>
                    <TableHead className="text-[10px] text-right">GRN Amt ₹</TableHead>
                    <TableHead className="text-[10px] text-right">Variance ₹</TableHead>
                    <TableHead className="text-[10px] text-right">Variance %</TableHead>
                    <TableHead className="text-[10px]">Match Status</TableHead>
                    <TableHead className="text-[10px]">Action</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {invoiceData.map((inv) => (
                      <TableRow key={inv.id} className="grn-table-row">
                        <TableCell className="text-xs font-mono font-medium">{inv.id}</TableCell>
                        <TableCell className="text-xs font-mono">{inv.grnId}</TableCell>
                        <TableCell className="text-xs font-mono">{inv.poId}</TableCell>
                        <TableCell className="text-xs">{inv.supplier}</TableCell>
                        <TableCell className="text-xs text-right">₹{fmt(inv.invAmt)}</TableCell>
                        <TableCell className="text-xs text-right">₹{fmt(inv.poAmt)}</TableCell>
                        <TableCell className="text-xs text-right">₹{fmt(inv.grnAmt)}</TableCell>
                        <TableCell className={"text-xs text-right font-medium " + (inv.variance > 0 ? "text-red-500" : inv.variance < 0 ? "text-emerald-500" : "")}>{inv.variance > 0 ? "+" : ""}₹{fmt(inv.variance)}</TableCell>
                        <TableCell className={"text-xs text-right " + (Math.abs(inv.varPct) > 5 ? "text-red-500 font-medium" : "")}>{inv.varPct}%</TableCell>
                        <TableCell><MatchBadge status={inv.matchStatus} /></TableCell>
                        <TableCell><Button variant="ghost" size="sm" className="h-7 text-[10px]">Review</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div></CardContent>
            </Card>
          </div>
        )}

        {/* ─── TAB 5: Receipt Analytics ─── */}
        {tab === "analytics" && (
          <div className="grn-tab-content space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPICard title="Avg Lead Time" value="8.2 days" icon={Clock} color="grn-text-orange" sub="-0.5 vs last month" />
              <KPICard title="Supplier OTIF" value="91.4%" icon={Gauge} color="grn-text-teal" sub="Target: 92%" />
              <KPICard title="Dock Utilization" value="82.5%" icon={Warehouse} color="grn-text-lime" sub="Peak hours" />
              <KPICard title="Cost per Receipt" value="₹185" icon={TrendingUp} color="grn-text-teal" sub="-₹12 vs avg" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="grn-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Lead Time by Supplier</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={280}>
                  <BarChart data={leadTimeData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} unit=" days" />
                    <Tooltip />
                    <Bar dataKey="days" fill={TEAL} radius={[4, 4, 0, 0]}>
                      {leadTimeData.map((entry, i) => <Cell key={i} fill={entry.days > 9 ? ORANGE : TEAL} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer></CardContent>
              </Card>

              <Card className="grn-chart-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Receipt Value & Cost</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={receiptValueData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="L" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="value" stroke={TEAL} fill={TEAL} fillOpacity={0.2} name="Receipt Value (L)" />
                    <Area type="monotone" dataKey="cost" stroke={ORANGE} fill={ORANGE} fillOpacity={0.15} name="Cost (L)" />
                  </AreaChart>
                </ResponsiveContainer></CardContent>
              </Card>
            </div>

            <Card className="card-crud-lift grn-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Supplier Scorecard</CardTitle></CardHeader>
              <CardContent><div className="rounded-lg border overflow-auto">
                <Table className="table-hover-highlight grn-table">
                  <TableHeader><TableRow className="grn-table-header">
                    <TableHead className="text-[10px]">Supplier</TableHead>
                    <TableHead className="text-[10px]">City</TableHead>
                    <TableHead className="text-[10px] text-right">GRNs</TableHead>
                    <TableHead className="text-[10px]">Acceptance %</TableHead>
                    <TableHead className="text-[10px] text-right">Lead Days</TableHead>
                    <TableHead className="text-[10px]">OTIF %</TableHead>
                    <TableHead className="text-[10px]">Quality</TableHead>
                    <TableHead className="text-[10px]">Payment Term</TableHead>
                    <TableHead className="text-[10px]">Rating</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {scorecard.map((s) => (
                      <TableRow key={s.supplier} className="grn-table-row">
                        <TableCell className="text-xs font-medium">{s.supplier}</TableCell>
                        <TableCell className="text-xs">{s.city}</TableCell>
                        <TableCell className="text-xs text-right">{s.grns}</TableCell>
                        <TableCell><QualityBar value={s.accPct} /></TableCell>
                        <TableCell className={"text-xs text-right " + (s.leadDays > 9 ? "text-orange-500 font-medium" : "")}>{s.leadDays}</TableCell>
                        <TableCell className={"text-xs " + (s.otif >= 92 ? "text-emerald-500" : "text-orange-500")}>{s.otif}%</TableCell>
                        <TableCell><QualityBar value={s.quality} /></TableCell>
                        <TableCell className="text-xs">{s.terms}</TableCell>
                        <TableCell><StarRating rating={s.rating} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div></CardContent>
            </Card>
          </div>
        )}
      </Tabs>

      <GRNDetailDrawer grn={selectedGRN} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}
