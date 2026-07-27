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
  QrCode, Printer, ScanBarcode, Search, CheckCircle2, AlertTriangle,
  BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, Eye, X,
  Package, Tag, FileText, Activity, Zap, Clock, ShieldCheck, Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Seed-based data generation
// ─────────────────────────────────────────────────────────────────────
function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(130130)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────
const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"] as const
const WH_SHORT = ["MUM", "DEL", "CHE", "KOL", "BLR", "PUN"] as const

const BARCODE_TYPES = ["EAN-13", "EAN-8", "Code-128", "Code-39", "QR Code", "GS1-128", "ITF-14", "DataMatrix", "UPC-A", "PDF417"] as const
const LABEL_FORMATS = ["Product Label", "Shipping Label", "Pallet Label", "Carton Label", "Location Label", "Receiving Label", "Pick List Label", "Return Label"] as const
const LABEL_STATUSES = ["Active", "Draft", "Archived", "Under Review"] as const
const PRINT_STATUSES = ["Queued", "Printing", "Completed", "Failed", "Cancelled"] as const
const SCAN_STATUSES = ["Matched", "Mismatch", "Not Found", "Duplicate", "Damaged"] as const
const QUALITY_GRADES = ["A - Excellent", "B - Good", "C - Acceptable", "D - Poor", "F - Failed"] as const

const PRODUCTS = [
  { sku: "F&B-1001", name: "Basmati Rice 25kg", cat: "Food", gtin: "8901234567890" },
  { sku: "F&B-1002", name: "Turmeric Powder 500g", cat: "Food", gtin: "8901234567906" },
  { sku: "F&B-1003", name: "Organic Tea 1kg", cat: "Food", gtin: "8901234567913" },
  { sku: "F&B-1006", name: "Ghee Tin 15kg", cat: "Food", gtin: "8901234567920" },
  { sku: "PHR-2001", name: "Paracetamol 500mg", cat: "Pharma", gtin: "8901234567937" },
  { sku: "PHR-2004", name: "ORS Sachets 100pc", cat: "Pharma", gtin: "8901234567944" },
  { sku: "PHR-2005", name: "Chyawanprash 500g", cat: "Pharma", gtin: "8901234567951" },
  { sku: "ELC-3001", name: "LED Panel 2x2ft", cat: "Electronics", gtin: "8901234567968" },
  { sku: "ELC-3005", name: "Power Bank 20000mAh", cat: "Electronics", gtin: "8901234567975" },
  { sku: "AUT-4002", name: "Brake Pad Set", cat: "Auto Parts", gtin: "8901234567982" },
  { sku: "AUT-4003", name: "Engine Oil 5L", cat: "Auto Parts", gtin: "8901234567999" },
  { sku: "IND-5001", name: "Hex Bolt M12x40", cat: "Industrial", gtin: "8901234568006" },
  { sku: "IND-5003", name: "PVC Pipe 4in", cat: "Industrial", gtin: "8901234568013" },
  { sku: "TXT-6001", name: "Cotton Fabric Roll", cat: "Textile", gtin: "8901234568020" },
  { sku: "TXT-6005", name: "Jute Bag Pack 100pc", cat: "Textile", gtin: "8901234568037" },
  { sku: "F&B-1010", name: "Mustard Oil 5L", cat: "Food", gtin: "8901234568044" },
  { sku: "PHR-2007", name: "Cough Syrup 200ml", cat: "Pharma", gtin: "8901234568051" },
  { sku: "ELC-3006", name: "WiFi Router Dual Band", cat: "Electronics", gtin: "8901234568068" },
  { sku: "IND-5006", name: "Electrical Cable 2.5mm", cat: "Industrial", gtin: "8901234568075" },
  { sku: "TXT-6004", name: "Denim Fabric 50m", cat: "Textile", gtin: "8901234568082" },
]

const PRINTERS = [
  { id: "PRN-01", name: "Zebra ZT411", location: "Mumbai - Dock A", type: "Thermal", status: "Online" },
  { id: "PRN-02", name: "Zebra ZT411", location: "Delhi - Pack Area", type: "Thermal", status: "Online" },
  { id: "PRN-03", name: "TSC TE210", location: "Chennai - Receiving", type: "Thermal", status: "Online" },
  { id: "PRN-04", name: "Honeywell PC42t", location: "Kolkata - Shipping", type: "Thermal", status: "Maintenance" },
  { id: "PRN-05", name: "Zebra ZD621", location: "Bangalore - QC", type: "Thermal Transfer", status: "Online" },
  { id: "PRN-06", name: "SATO CL4NX", location: "Pune - Returns", type: "Thermal", status: "Offline" },
]

const SCANNERS = [
  { id: "SCN-01", name: "Zebra DS3608", warehouse: "Mumbai Hub", zone: "Receiving" },
  { id: "SCN-02", name: "Honeywell 1902g", warehouse: "Delhi NCR", zone: "Picking" },
  { id: "SCN-03", name: "Datalogic GBT4400", warehouse: "Chennai DC", zone: "Packing" },
  { id: "SCN-04", name: "Zebra DS8178", warehouse: "Kolkata Hub", zone: "Shipping" },
  { id: "SCN-05", name: "CipherLab 1682", warehouse: "Bangalore South", zone: "QC" },
]

const PIE_COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16"]

const MONTHS = ["Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26"]

// ─────────────────────────────────────────────────────────────────────────────
// Generate Mock Data
// ─────────────────────────────────────────────────────────────────────────
const labels: Array<{
  id: string; name: string; format: string; status: string; barcodeType: string;
  product: typeof PRODUCTS[0]; warehouse: string; size: string; dpi: number;
  copies: number; lastPrinted: string; createdDate: string; templateId: string;
}> = (() => {
  const result: typeof labels = []
  for (let i = 0; i < 120; i++) {
    const product = pick(PRODUCTS)
    const wh = Math.floor(rand() * WAREHOUSES.length)
    const dpi = pick([203, 300, 600])
    result.push({
      id: `LBL-${String(130000 + i).padStart(6, '0')}`,
      name: `${product.name} - ${pick(LABEL_FORMATS)}`,
      format: pick(LABEL_FORMATS),
      status: pick(LABEL_STATUSES),
      barcodeType: pick(BARCODE_TYPES),
      product,
      warehouse: WAREHOUSES[wh],
      size: pick(["50x25mm", "100x50mm", "100x100mm", "150x100mm", "200x150mm", "A4", "A5"]),
      dpi,
      copies: Math.floor(rand() * 500) + 1,
      lastPrinted: new Date(2026, Math.floor(rand() * 7), Math.floor(rand() * 28) + 1).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      createdDate: new Date(2025, Math.floor(rand() * 12), Math.floor(rand() * 28) + 1).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }),
      templateId: `TPL-${String(Math.floor(rand() * 200) + 100).padStart(3, '0')}`,
    })
  }
  return result
})()

const printJobs: Array<{
  id: string; labelId: string; labelName: string; printer: typeof PRINTERS[0];
  status: string; copies: number; warehouse: string; startTime: string;
  endTime: string | null; paperUsed: number; inkLevel: number; error: string | null;
}> = (() => {
  const result: typeof printJobs = []
  for (let i = 0; i < 80; i++) {
    const status = pick(PRINT_STATUSES)
    const printer = pick(PRINTERS)
    const label = pick(labels)
    const hour = Math.floor(rand() * 16) + 6
    const isDone = status === "Completed"
    result.push({
      id: `PJT-${String(130000 + i).padStart(6, '0')}`,
      labelId: label.id,
      labelName: label.name,
      printer,
      status,
      copies: Math.floor(rand() * 50) + 1,
      warehouse: printer.location.split(" - ")[0],
      startTime: `${String(hour).padStart(2, '0')}:${String(pick([0, 15, 30, 45])).padStart(2, '0')}`,
      endTime: isDone ? `${String(Math.min(23, hour + 1)).padStart(2, '0')}:${String(pick([0, 15, 30, 45])).padStart(2, '0')}` : null,
      paperUsed: Math.floor(rand() * 200) + 10,
      inkLevel: Math.floor(rand() * 40) + 60,
      error: status === "Failed" ? pick(["Paper Jam", "Ink Low", "Connection Lost", "Driver Error", "Memory Full"]) : null,
    })
  }
  return result
})()

const scanHistory: Array<{
  id: string; barcode: string; product: string; sku: string; scanner: typeof SCANNERS[0];
  status: string; warehouse: string; timestamp: string; responseTime: number;
  location: string; quantity: number;
}> = (() => {
  const result: typeof scanHistory = []
  for (let i = 0; i < 150; i++) {
    const product = pick(PRODUCTS)
    const scanner = pick(SCANNERS)
    const status = pick(SCAN_STATUSES)
    const hour = Math.floor(rand() * 16) + 6
    result.push({
      id: `SCN-${String(130000 + i).padStart(6, '0')}`,
      barcode: product.gtin,
      product: product.name,
      sku: product.sku,
      scanner,
      status,
      warehouse: scanner.warehouse,
      timestamp: `${String(hour).padStart(2, '0')}:${String(pick([0, 15, 30, 45])).padStart(2, '0')}`,
      responseTime: Math.floor(rand() * 300) + 50,
      location: `BIN-${Math.floor(rand() * 6) + 1}${String(Math.floor(rand() * 12) + 1).padStart(2, '0')}${Math.floor(rand() * 5) + 1}${Math.floor(rand() * 8) + 1}`,
      quantity: Math.floor(rand() * 100) + 1,
    })
  }
  return result
})()

const qualityChecks: Array<{
  id: string; barcode: string; product: string; barcodeType: string; grade: string;
  readability: number; contrast: number; quietZone: number; defects: string[];
  checkedBy: string; date: string; warehouse: string; pass: boolean;
}> = (() => {
  const result: typeof qualityChecks = []
  for (let i = 0; i < 60; i++) {
    const product = pick(PRODUCTS)
    const grade = pick(QUALITY_GRADES)
    const readability = grade.startsWith("A") ? Math.floor(rand() * 5) + 95 : grade.startsWith("B") ? Math.floor(rand() * 8) + 85 : grade.startsWith("C") ? Math.floor(rand() * 10) + 70 : grade.startsWith("D") ? Math.floor(rand() * 15) + 50 : Math.floor(rand() * 30) + 20
    const contrast = Math.min(100, readability + Math.floor(rand() * 10) - 5)
    const pass = grade.startsWith("A") || grade.startsWith("B") || grade.startsWith("C")
    result.push({
      id: `QC-${String(130000 + i).padStart(6, '0')}`,
      barcode: product.gtin,
      product: product.name,
      barcodeType: pick(BARCODE_TYPES),
      grade,
      readability,
      contrast,
      quietZone: Math.floor(rand() * 15) + 3,
      defects: grade === "F - Failed" ? pick([["Low Contrast"], ["Damaged Print"], ["Quiet Zone Violation"], ["Spot Error"], ["Growth/Truncation"]]) : [],
      checkedBy: pick(["Auto-Verifier", "QC Inspector A", "QC Inspector B"]),
      date: new Date(2026, Math.floor(rand() * 7), Math.floor(rand() * 28) + 1).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      warehouse: pick(WAREHOUSES),
      pass,
    })
  }
  return result
})()

const monthlyData = MONTHS.map(month => ({
  month,
  labelsPrinted: Math.floor(rand() * 3000) + 2000,
  scans: Math.floor(rand() * 8000) + 5000,
  qualityPass: Math.floor(rand() * 10) + 88,
  printErrors: Math.floor(rand() * 20) + 2,
}))

const printerStatusData = PRINTERS.map(p => ({
  printer: p.id,
  name: p.name,
  jobsCompleted: Math.floor(rand() * 500) + 100,
  jobsFailed: Math.floor(rand() * 15),
  paperUsed: Math.floor(rand() * 5000) + 500,
  inkLevel: p.status === "Online" ? Math.floor(rand() * 40) + 60 : p.status === "Maintenance" ? 45 : 0,
  status: p.status,
}))

const totalLabels = labels.length
const activeLabels = labels.filter(l => l.status === "Active").length
const totalPrints = printJobs.length
const failedPrints = printJobs.filter(p => p.status === "Failed").length
const totalScans = scanHistory.length
const scanMatchRate = Math.floor((scanHistory.filter(s => s.status === "Matched").length / scanHistory.length) * 100)
const avgResponseMs = Math.floor(scanHistory.reduce((a, s) => a + s.responseTime, 0) / scanHistory.length)
const qualityPassRate = Math.floor((qualityChecks.filter(q => q.pass).length / qualityChecks.length) * 100)

const radarData = [
  { metric: "Scan Accuracy", value: scanMatchRate, fullMark: 100 },
  { metric: "Print Success", value: Math.floor((printJobs.filter(p => p.status === "Completed").length / printJobs.length) * 100), fullMark: 100 },
  { metric: "Quality Pass", value: qualityPassRate, fullMark: 100 },
  { metric: "Label Coverage", value: 85, fullMark: 100 },
  { metric: "GTIN Compliance", value: 92, fullMark: 100 },
  { metric: "Printer Uptime", value: Math.floor((PRINTERS.filter(p => p.status === "Online").length / PRINTERS.length) * 100), fullMark: 100 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function KpiCard({ title, value, subtitle, icon: Icon, colorClass, trend, trendValue }: {
  title: string; value: string; subtitle?: string; icon: React.ElementType; colorClass: string; trend?: "up" | "down"; trendValue?: string
}) {
  return (
    <Card className={cn("bcl-kpi-card", colorClass)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="bcl-kpi-label">{title}</p>
            <p className="bcl-kpi-value">{value}</p>
            {subtitle && <p className="bcl-kpi-sub">{subtitle}</p>}
          </div>
          <div className="bcl-kpi-icon"><Icon className="h-5 w-5" /></div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" /> : <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />}
            <span className={cn("text-xs font-medium", trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FormatBadge({ format }: { format: string }) {
  const cls: Record<string, string> = {
    "Product Label": "bcl-badge-format-product", "Shipping Label": "bcl-badge-format-ship",
    "Pallet Label": "bcl-badge-format-pallet", "Carton Label": "bcl-badge-format-carton",
    "Location Label": "bcl-badge-format-loc", "Receiving Label": "bcl-badge-format-recv",
    "Pick List Label": "bcl-badge-format-pick", "Return Label": "bcl-badge-format-ret",
  }
  return <span className={cn("bcl-badge", cls[format] || "")}>{format}</span>
}

function TypeBadge({ type }: { type: string }) {
  const cls: Record<string, string> = {
    "EAN-13": "bcl-badge-type-ean13", "EAN-8": "bcl-badge-type-ean8",
    "Code-128": "bcl-badge-type-c128", "Code-39": "bcl-badge-type-c39",
    "QR Code": "bcl-badge-type-qr", "GS1-128": "bcl-badge-type-gs1",
    "ITF-14": "bcl-badge-type-itf", "DataMatrix": "bcl-badge-type-dm",
    "UPC-A": "bcl-badge-type-upca", "PDF417": "bcl-badge-type-pdf",
  }
  return <span className={cn("bcl-badge", cls[type] || "")}>{type}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    Active: "bcl-badge-status-active", Draft: "bcl-badge-status-draft",
    Archived: "bcl-badge-status-archived", "Under Review": "bcl-badge-status-review",
    Queued: "bcl-badge-print-queued", Printing: "bcl-badge-print-printing",
    Completed: "bcl-badge-print-completed", Failed: "bcl-badge-print-failed",
    Cancelled: "bcl-badge-print-cancelled",
    Matched: "bcl-badge-scan-matched", Mismatch: "bcl-badge-scan-mismatch",
    "Not Found": "bcl-badge-scan-notfound", Duplicate: "bcl-badge-scan-dup", Damaged: "bcl-badge-scan-damaged",
  }
  const pulse = ["Printing", "Failed", "Mismatch", "Damaged"].includes(status)
  return <span className={cn("bcl-badge", cls[status] || "", pulse && "bcl-badge-pulse")}>{status}</span>
}

function GradeBadge({ grade }: { grade: string }) {
  const letter = grade.charAt(0)
  const cls: Record<string, string> = {
    A: "bcl-badge-grade-a", B: "bcl-badge-grade-b", C: "bcl-badge-grade-c",
    D: "bcl-badge-grade-d", F: "bcl-badge-grade-f",
  }
  return <span className={cn("bcl-badge bcl-badge-grade", cls[letter] || "")}>{grade}</span>
}

function PrinterStatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    Online: "bcl-badge-printer-online", Maintenance: "bcl-badge-printer-maint", Offline: "bcl-badge-printer-offline",
  }
  return <span className={cn("bcl-badge", cls[status] || "")}>{status}</span>
}

// ─────────────────────────────────────────────────────────────────────────────
// Label Detail Drawer
// ─────────────────────────────────────────────────────────────────────────────
function LabelDetailDrawer({ label, onClose }: { label: typeof labels[0]; onClose: () => void }) {
  const labelPrints = printJobs.filter(p => p.labelId === label.id)
  return (
    <div className="bcl-drawer-overlay" onClick={onClose}>
      <div className="bcl-drawer" onClick={e => e.stopPropagation()}>
        <div className="bcl-drawer-header">
          <div>
            <h3 className="bcl-drawer-title">{label.id}</h3>
            <p className="bcl-drawer-subtitle">{label.name}</p>
          </div>
          <button className="bcl-drawer-close" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="bcl-drawer-body">
          <div className={cn("bcl-drawer-banner", label.status === "Active" ? "bcl-drawer-banner-active" : label.status === "Draft" ? "bcl-drawer-banner-draft" : "bcl-drawer-banner-archived")}>
            <StatusBadge status={label.status} />
          </div>

          {/* Preview area */}
          <div className="bcl-label-preview">
            <div className="bcl-label-preview-box">
              <div className="bcl-label-barcode-area">
                <div className="bcl-label-bars">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="bcl-label-bar" style={{ height: `${30 + (i % 3) * 10}px`, width: `${rand() > 0.5 ? 3 : 2}px` }} />
                  ))}
                </div>
                <p className="bcl-label-barcode-text">{label.product.gtin}</p>
              </div>
              <div className="bcl-label-info-area">
                <p className="text-xs font-bold">{label.product.name}</p>
                <p className="text-xs text-gray-500">SKU: {label.product.sku}</p>
                <p className="text-xs text-gray-500">WH: {label.warehouse}</p>
              </div>
            </div>
          </div>

          <div className="bcl-drawer-grid">
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">Format</span><FormatBadge format={label.format} /></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">Barcode Type</span><TypeBadge type={label.barcodeType} /></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">Product</span><span className="text-sm font-medium">{label.product.name}</span></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">GTIN</span><span className="text-sm font-mono">{label.product.gtin}</span></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">Warehouse</span><span className="text-sm">{label.warehouse}</span></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">Size</span><span className="text-sm">{label.size}</span></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">DPI</span><span className="text-sm">{label.dpi}</span></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">Total Copies</span><span className="text-sm font-semibold">{label.copies}</span></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">Template</span><span className="text-sm font-mono">{label.templateId}</span></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">Last Printed</span><span className="text-sm">{label.lastPrinted}</span></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">Created</span><span className="text-sm">{label.createdDate}</span></div>
            <div className="bcl-drawer-field"><span className="bcl-drawer-label">Print Jobs</span><span className="text-sm">{labelPrints.length}</span></div>
          </div>

          {/* Recent print jobs */}
          <div className="mt-5">
            <h4 className="bcl-drawer-section-title">Recent Print Jobs ({labelPrints.length})</h4>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {labelPrints.slice(0, 8).map((pj, idx) => (
                <div key={idx} className="bcl-drawer-job-row">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono">{pj.id}</span>
                    <StatusBadge status={pj.status} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">{pj.printer.name} &middot; {pj.copies} copies</span>
                    <span className="text-xs text-gray-400">{pj.startTime}</span>
                  </div>
                  {pj.error && <span className="text-xs text-red-500 mt-1">Error: {pj.error}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function BarcodeLabelView() {
  const [activeTab, setActiveTab] = useState("overview")
  const [labelSearch, setLabelSearch] = useState("")
  const [labelStatusFilter, setLabelStatusFilter] = useState("all")
  const [labelFormatFilter, setLabelFormatFilter] = useState("all")
  const [scanSearch, setScanSearch] = useState("")
  const [scanStatusFilter, setScanStatusFilter] = useState("all")
  const [selectedLabel, setSelectedLabel] = useState<typeof labels[0] | null>(null)

  const filteredLabels = useMemo(() => labels.filter(l => {
    if (labelSearch && !l.id.toLowerCase().includes(labelSearch.toLowerCase()) && !l.name.toLowerCase().includes(labelSearch.toLowerCase()) && !l.product.sku.toLowerCase().includes(labelSearch.toLowerCase())) return false
    if (labelStatusFilter !== "all" && l.status !== labelStatusFilter) return false
    if (labelFormatFilter !== "all" && l.format !== labelFormatFilter) return false
    return true
  }), [labelSearch, labelStatusFilter, labelFormatFilter])

  const filteredScans = useMemo(() => scanHistory.filter(s => {
    if (scanSearch && !s.barcode.includes(scanSearch) && !s.sku.toLowerCase().includes(scanSearch.toLowerCase()) && !s.product.toLowerCase().includes(scanSearch.toLowerCase())) return false
    if (scanStatusFilter !== "all" && s.status !== scanStatusFilter) return false
    return true
  }), [scanSearch, scanStatusFilter])

  const formatDistribution = LABEL_FORMATS.map(f => ({ name: f, value: labels.filter(l => l.format === f).length }))
  const typeDistribution = BARCODE_TYPES.map(t => ({ name: t, value: labels.filter(l => l.barcodeType === t).length })).filter(d => d.value > 0)
  const scanStatusData = SCAN_STATUSES.map(s => ({ name: s, value: scanHistory.filter(sc => sc.status === s).length }))
  const gradeDistribution = QUALITY_GRADES.map(g => ({ name: g.charAt(0), fullName: g, value: qualityChecks.filter(q => q.grade === g).length }))

  return (
    <div className="bcl-container">
      {/* Header */}
      <div className="bcl-header">
        <div className="flex items-center gap-3">
          <div className="bcl-header-icon"><QrCode className="h-6 w-6" /></div>
          <div>
            <h1 className="bcl-header-title">Barcode & Label Management</h1>
            <p className="bcl-header-subtitle">Manage barcode templates, label printing, scan verification, and GS1/GTIN compliance</p>
          </div>
        </div>
        <div className="bcl-header-badges">
          <span className="bcl-header-badge bcl-hb-labels">{totalLabels} Labels</span>
          <span className="bcl-header-badge bcl-hb-active">{activeLabels} Active</span>
          <span className="bcl-header-badge bcl-hb-prints">{totalPrints} Prints</span>
          <span className="bcl-header-badge bcl-hb-failed">{failedPrints} Failed</span>
          <span className="bcl-header-badge bcl-hb-scans">{totalScans} Scans</span>
          <span className="bcl-header-badge bcl-hb-accuracy">{scanMatchRate}% Match</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
        <TabsList className="bcl-tabs-list">
          <TabsTrigger value="overview" className="bcl-tab-trigger"><BarChart3 className="h-4 w-4 mr-1.5" /> Dashboard</TabsTrigger>
          <TabsTrigger value="labels" className="bcl-tab-trigger"><Tag className="h-4 w-4 mr-1.5" /> Label Library</TabsTrigger>
          <TabsTrigger value="printers" className="bcl-tab-trigger"><Printer className="h-4 w-4 mr-1.5" /> Print Jobs</TabsTrigger>
          <TabsTrigger value="scans" className="bcl-tab-trigger"><ScanBarcode className="h-4 w-4 mr-1.5" /> Scan History</TabsTrigger>
          <TabsTrigger value="quality" className="bcl-tab-trigger"><ShieldCheck className="h-4 w-4 mr-1.5" /> Quality Checks</TabsTrigger>
        </TabsList>

        {/* ═══ TAB 1: DASHBOARD ═══ */}
        {activeTab === "overview" && (
          <div className="bcl-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <KpiCard title="Total Labels" value={String(totalLabels)} icon={Tag} colorClass="bcl-kpi-purple" trend="up" trendValue="+15 new" />
              <KpiCard title="Active" value={String(activeLabels)} icon={CheckCircle2} colorClass="bcl-kpi-cyan" />
              <KpiCard title="Print Jobs" value={String(totalPrints)} icon={Printer} colorClass="bcl-kpi-amber" />
              <KpiCard title="Failed Prints" value={String(failedPrints)} icon={AlertTriangle} colorClass="bcl-kpi-purple" />
              <KpiCard title="Total Scans" value={String(totalScans)} icon={ScanBarcode} colorClass="bcl-kpi-cyan" />
              <KpiCard title="Match Rate" value={`${scanMatchRate}%`} icon={Zap} colorClass="bcl-kpi-amber" trend="up" trendValue="+2.1%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <Card className="bcl-card">
                <CardHeader className="pb-2"><CardTitle className="bcl-card-title">Label Format Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={formatDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {formatDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bcl-card">
                <CardHeader className="pb-2"><CardTitle className="bcl-card-title">Barcode System Radar</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                      <PolarGrid /><PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Current" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
                      <Radar name="Target" dataKey="fullMark" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.08} />
                      <Legend wrapperStyle={{ fontSize: 10 }} /><Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bcl-card">
                <CardHeader className="pb-2"><CardTitle className="bcl-card-title">Monthly Activity</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[80, 100]} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar yAxisId="left" dataKey="labelsPrinted" fill="#7c3aed" name="Labels Printed" radius={[3, 3, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="qualityPass" stroke="#06b6d4" strokeWidth={2} name="Quality Pass %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bcl-card">
                <CardHeader className="pb-2"><CardTitle className="bcl-card-title">Scan Status Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={scanStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {scanStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie><Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bcl-card">
                <CardHeader className="pb-2"><CardTitle className="bcl-card-title">Quality Grade Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700 }} />
                      <YAxis tick={{ fontSize: 10 }} /><Tooltip />
                      <Bar dataKey="value" fill="#7c3aed" name="Checks" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ═══ TAB 2: LABEL LIBRARY ═══ */}
        {activeTab === "labels" && (
          <div className="bcl-tab-content">
            <div className="bcl-filter-bar">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input className="bcl-filter-input" placeholder="Search label ID, name, SKU..." value={labelSearch} onChange={e => setLabelSearch(e.target.value)} />
              </div>
              <select className="bcl-filter-select" value={labelStatusFilter} onChange={e => setLabelStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {LABEL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="bcl-filter-select" value={labelFormatFilter} onChange={e => setLabelFormatFilter(e.target.value)}>
                <option value="all">All Formats</option>
                {LABEL_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <Badge variant="outline" className="text-xs">{filteredLabels.length} labels</Badge>
            </div>

            <Card className="bcl-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bcl-table-header">
                        <TableHead className="bcl-th">Label ID</TableHead>
                        <TableHead className="bcl-th">Name</TableHead>
                        <TableHead className="bcl-th">Format</TableHead>
                        <TableHead className="bcl-th">Barcode</TableHead>
                        <TableHead className="bcl-th">Product / SKU</TableHead>
                        <TableHead className="bcl-th">GTIN</TableHead>
                        <TableHead className="bcl-th">Status</TableHead>
                        <TableHead className="bcl-th">Warehouse</TableHead>
                        <TableHead className="bcl-th">Size</TableHead>
                        <TableHead className="bcl-th">DPI</TableHead>
                        <TableHead className="bcl-th">Copies</TableHead>
                        <TableHead className="bcl-th">Template</TableHead>
                        <TableHead className="bcl-th">Last Print</TableHead>
                        <TableHead className="bcl-th">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLabels.slice(0, 60).map((l, idx) => (
                        <TableRow key={l.id} className={cn("bcl-table-row", idx % 2 === 0 ? "" : "bcl-table-row-alt")}>
                          <TableCell className="bcl-td"><span className="font-mono font-medium text-sm">{l.id}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs max-w-36 truncate block">{l.name}</span></TableCell>
                          <TableCell className="bcl-td"><FormatBadge format={l.format} /></TableCell>
                          <TableCell className="bcl-td"><TypeBadge type={l.barcodeType} /></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs font-mono">{l.product.sku}</span><span className="text-xs block max-w-28 truncate">{l.product.name}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs font-mono">{l.product.gtin}</span></TableCell>
                          <TableCell className="bcl-td"><StatusBadge status={l.status} /></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{l.warehouse.length > 10 ? l.warehouse.substring(0, 10) + "..." : l.warehouse}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{l.size}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-sm">{l.dpi}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-sm font-medium">{l.copies}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs font-mono">{l.templateId}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{l.lastPrinted}</span></TableCell>
                          <TableCell className="bcl-td">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedLabel(l)}><Eye className="h-3.5 w-3.5" /></Button>
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

        {/* ═══ TAB 3: PRINT JOBS ═══ */}
        {activeTab === "printers" && (
          <div className="bcl-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {[
                { label: "Total Jobs", value: String(totalPrints), icon: Printer, cls: "bcl-kpi-purple" },
                { label: "Completed", value: String(printJobs.filter(p => p.status === "Completed").length), icon: CheckCircle2, cls: "bcl-kpi-cyan" },
                { label: "Failed", value: String(failedPrints), icon: AlertTriangle, cls: "bcl-kpi-amber" },
                { label: "Paper Used", value: `${(printJobs.reduce((a, p) => a + p.paperUsed, 0) / 1000).toFixed(1)}K`, icon: FileText, cls: "bcl-kpi-amber" },
                { label: "Avg Ink", value: `${Math.floor(printJobs.reduce((a, p) => a + p.inkLevel, 0) / printJobs.length)}%`, icon: Layers, cls: "bcl-kpi-cyan" },
                { label: "Avg Response", value: `${avgResponseMs}ms`, icon: Zap, cls: "bcl-kpi-purple" },
              ].map(kpi => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            {/* Printer Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {PRINTERS.map(p => {
                const jobs = printJobs.filter(pj => pj.printer.id === p.id)
                return (
                  <Card key={p.id} className="bcl-card">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="bcl-card-title text-sm">{p.name}</CardTitle>
                        <PrinterStatusBadge status={p.status} />
                      </div>
                      <p className="text-xs text-gray-500">{p.location} &middot; {p.type}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-600">{jobs.filter(j => j.status === "Completed").length}</p>
                          <p className="text-xs text-gray-500">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-red-600">{jobs.filter(j => j.status === "Failed").length}</p>
                          <p className="text-xs text-gray-500">Failed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-amber-600">{p.status === "Offline" ? "--" : `${Math.floor(rand() * 40) + 60}%`}</p>
                          <p className="text-xs text-gray-500">Ink Level</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Print Jobs Table */}
            <Card className="bcl-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bcl-table-header">
                        <TableHead className="bcl-th">Job ID</TableHead>
                        <TableHead className="bcl-th">Label</TableHead>
                        <TableHead className="bcl-th">Printer</TableHead>
                        <TableHead className="bcl-th">Status</TableHead>
                        <TableHead className="bcl-th">Copies</TableHead>
                        <TableHead className="bcl-th">Warehouse</TableHead>
                        <TableHead className="bcl-th">Start</TableHead>
                        <TableHead className="bcl-th">Paper</TableHead>
                        <TableHead className="bcl-th">Ink</TableHead>
                        <TableHead className="bcl-th">Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {printJobs.slice(0, 40).map((pj, idx) => (
                        <TableRow key={pj.id} className={cn("bcl-table-row", idx % 2 === 0 ? "" : "bcl-table-row-alt")}>
                          <TableCell className="bcl-td"><span className="font-mono text-sm">{pj.id}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs max-w-28 truncate block">{pj.labelName}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{pj.printer.name}</span><span className="text-xs text-gray-400 block">{pj.printer.id}</span></TableCell>
                          <TableCell className="bcl-td"><StatusBadge status={pj.status} /></TableCell>
                          <TableCell className="bcl-td"><span className="text-sm font-medium">{pj.copies}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{pj.warehouse}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{pj.startTime}{pj.endTime ? ` - ${pj.endTime}` : ""}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-sm">{pj.paperUsed}</span></TableCell>
                          <TableCell className="bcl-td">
                            <div className="flex items-center gap-2">
                              <div className="bcl-mini-bar w-12"><div className={cn("bcl-mini-bar-fill", pj.inkLevel > 50 ? "bcl-bar-purple" : pj.inkLevel > 20 ? "bcl-bar-amber" : "bcl-bar-red")} style={{ width: `${pj.inkLevel}%` }} /></div>
                              <span className="text-xs">{pj.inkLevel}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="bcl-td">{pj.error ? <span className="text-xs text-red-600 font-medium">{pj.error}</span> : <span className="text-xs text-gray-400">--</span>}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══ TAB 4: SCAN HISTORY ═══ */}
        {activeTab === "scans" && (
          <div className="bcl-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {[
                { label: "Total Scans", value: String(totalScans), icon: ScanBarcode, cls: "bcl-kpi-cyan" },
                { label: "Match Rate", value: `${scanMatchRate}%`, icon: CheckCircle2, cls: "bcl-kpi-amber" },
                { label: "Mismatch", value: String(scanHistory.filter(s => s.status === "Mismatch").length), icon: AlertTriangle, cls: "bcl-kpi-purple" },
                { label: "Not Found", value: String(scanHistory.filter(s => s.status === "Not Found").length), icon: X, cls: "bcl-kpi-cyan" },
                { label: "Avg Response", value: `${avgResponseMs}ms`, icon: Zap, cls: "bcl-kpi-amber" },
              ].map(kpi => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            <div className="bcl-filter-bar">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input className="bcl-filter-input" placeholder="Search barcode, SKU, product..." value={scanSearch} onChange={e => setScanSearch(e.target.value)} />
              </div>
              <select className="bcl-filter-select" value={scanStatusFilter} onChange={e => setScanStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {SCAN_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Badge variant="outline" className="text-xs">{filteredScans.length} scans</Badge>
            </div>

            <Card className="bcl-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bcl-table-header">
                        <TableHead className="bcl-th">Scan ID</TableHead>
                        <TableHead className="bcl-th">Barcode</TableHead>
                        <TableHead className="bcl-th">Product</TableHead>
                        <TableHead className="bcl-th">Status</TableHead>
                        <TableHead className="bcl-th">Scanner</TableHead>
                        <TableHead className="bcl-th">Warehouse</TableHead>
                        <TableHead className="bcl-th">Location</TableHead>
                        <TableHead className="bcl-th">Qty</TableHead>
                        <TableHead className="bcl-th">Response</TableHead>
                        <TableHead className="bcl-th">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredScans.slice(0, 60).map((s, idx) => (
                        <TableRow key={s.id} className={cn("bcl-table-row", idx % 2 === 0 ? "" : "bcl-table-row-alt")}>
                          <TableCell className="bcl-td"><span className="font-mono text-sm">{s.id}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs font-mono font-medium">{s.barcode}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs font-mono">{s.sku}</span><span className="text-xs block max-w-28 truncate">{s.product}</span></TableCell>
                          <TableCell className="bcl-td"><StatusBadge status={s.status} /></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{s.scanner.name}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{s.warehouse}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs font-mono">{s.location}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-sm">{s.quantity}</span></TableCell>
                          <TableCell className="bcl-td"><span className={cn("text-xs font-medium", s.responseTime < 150 ? "text-emerald-600" : s.responseTime < 250 ? "text-amber-600" : "text-red-600")}>{s.responseTime}ms</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{s.timestamp}</span></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══ TAB 5: QUALITY CHECKS ═══ */}
        {activeTab === "quality" && (
          <div className="bcl-tab-content">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {[
                { label: "Total Checks", value: String(qualityChecks.length), icon: ShieldCheck, cls: "bcl-kpi-purple" },
                { label: "Pass Rate", value: `${qualityPassRate}%`, icon: CheckCircle2, cls: "bcl-kpi-cyan" },
                { label: "Grade A", value: String(qualityChecks.filter(q => q.grade.startsWith("A")).length), icon: Zap, cls: "bcl-kpi-amber" },
                { label: "Grade F", value: String(qualityChecks.filter(q => q.grade.startsWith("F")).length), icon: AlertTriangle, cls: "bcl-kpi-purple" },
                { label: "Avg Readability", value: `${Math.floor(qualityChecks.reduce((a, q) => a + q.readability, 0) / qualityChecks.length)}%`, icon: BarChart3, cls: "bcl-kpi-cyan" },
              ].map(kpi => (
                <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} icon={kpi.icon} colorClass={kpi.cls} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card className="bcl-card">
                <CardHeader className="pb-2"><CardTitle className="bcl-card-title">Readability Score Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={MONTHS.map((m, i) => ({ month: m, readability: Math.floor(rand() * 15) + 85, contrast: Math.floor(rand() * 10) + 90 }))}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis domain={[70, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" dataKey="readability" fill="#7c3aed" stroke="#7c3aed" fillOpacity={0.2} name="Readability %" />
                      <Line type="monotone" dataKey="contrast" stroke="#06b6d4" strokeWidth={2} name="Contrast %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bcl-card">
                <CardHeader className="pb-2"><CardTitle className="bcl-card-title">Quiet Zone Compliance</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={MONTHS.map((m, i) => ({ month: m, avg: Math.floor(rand() * 10) + 5, violations: Math.floor(rand() * 5) }))}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="avg" fill="#7c3aed" name="Avg Quiet Zone (mm)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="violations" fill="#ef4444" name="Violations" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bcl-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bcl-table-header">
                        <TableHead className="bcl-th">QC ID</TableHead>
                        <TableHead className="bcl-th">Barcode</TableHead>
                        <TableHead className="bcl-th">Product</TableHead>
                        <TableHead className="bcl-th">Type</TableHead>
                        <TableHead className="bcl-th">Grade</TableHead>
                        <TableHead className="bcl-th">Readability</TableHead>
                        <TableHead className="bcl-th">Contrast</TableHead>
                        <TableHead className="bcl-th">Quiet Zone</TableHead>
                        <TableHead className="bcl-th">Defects</TableHead>
                        <TableHead className="bcl-th">Checked By</TableHead>
                        <TableHead className="bcl-th">Warehouse</TableHead>
                        <TableHead className="bcl-th">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {qualityChecks.slice(0, 40).map((q, idx) => (
                        <TableRow key={q.id} className={cn("bcl-table-row", idx % 2 === 0 ? "" : "bcl-table-row-alt")}>
                          <TableCell className="bcl-td"><span className="font-mono text-sm">{q.id}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs font-mono">{q.barcode}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs max-w-28 truncate block">{q.product}</span></TableCell>
                          <TableCell className="bcl-td"><TypeBadge type={q.barcodeType} /></TableCell>
                          <TableCell className="bcl-td"><GradeBadge grade={q.grade} /></TableCell>
                          <TableCell className="bcl-td">
                            <div className="flex items-center gap-2">
                              <div className="bcl-mini-bar w-12"><div className={cn("bcl-mini-bar-fill", q.readability >= 90 ? "bcl-bar-purple" : q.readability >= 70 ? "bcl-bar-amber" : "bcl-bar-red")} style={{ width: `${q.readability}%` }} /></div>
                              <span className="text-xs">{q.readability}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="bcl-td"><span className="text-sm">{q.contrast}%</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-sm">{q.quietZone}mm</span></TableCell>
                          <TableCell className="bcl-td">
                            {q.defects.length > 0
                              ? q.defects.map((d, i) => <Badge key={i} variant="destructive" className="text-xs mr-1">{d[0]}</Badge>)
                              : <span className="text-xs text-gray-400">None</span>}
                          </TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{q.checkedBy}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{q.warehouse.length > 10 ? q.warehouse.substring(0, 10) + "..." : q.warehouse}</span></TableCell>
                          <TableCell className="bcl-td"><span className="text-xs">{q.date}</span></TableCell>
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

      {selectedLabel && <LabelDetailDrawer label={selectedLabel} onClose={() => setSelectedLabel(null)} />}
    </div>
  )
}
