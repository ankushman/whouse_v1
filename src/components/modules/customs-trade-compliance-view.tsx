"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Gavel, FileCheck, Globe, ShieldCheck, AlertTriangle, Search,
  Eye, ArrowUpDown, TrendingUp, Clock, IndianRupee, Package,
  Ship, Anchor, MapPin, BarChart3, Activity, FileWarning, Scale,
  Landmark, CheckCircle, XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"

/* ═══════════════════════════════════════════════════════════════════
   Seed-based deterministic random helpers
   ═══════════════════════════════════════════════════════════════════ */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000
  return x - Math.floor(x)
}
function ri(min: number, max: number, seed: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min
}

/* ═══════════════════════════════════════════════════════════════════
   Enums (as const)
   ═══════════════════════════════════════════════════════════════════ */
const IMPORT_STATUSES = ["Pending", "Customs Hold", "Under Examination", "Duty Assessed", "Cleared", "Released", "Rejected", "Quarantine"] as const
const EXPORT_STATUSES = ["Documentation", "Customs Filing", "Inspection", "Cleared", "Loaded", "Departed", "Returned", "Cancelled"] as const
const INDIAN_PORTS = ["Nhava Sheva", "JNPT", "Mundra", "Chennai", "Kolkata", "Hazira", "Tuticorin", "Cochin", "Vizag", "Kandla"] as const
const SHIPMENT_TYPES = ["Electronics", "Pharma", "Machinery", "Textiles", "Auto Parts", "Chemicals", "Food Items", "Crude Oil"] as const
const SHIPMENT_EMOJI = ["📱", "💊", "⚙️", "👔", "🔩", "🧪", "🍞", "🛢️"] as const
const ORIGIN_COUNTRIES = ["🇨🇳 China", "🇺🇸 USA", "🇩🇪 Germany", "🇯🇵 Japan", "🇰🇷 South Korea", "🇬🇧 UK", "🇸🇬 Singapore", "🇹🇼 Taiwan", "🇮🇹 Italy", "🇦🇪 UAE"] as const
const DUTY_TYPES = ["Basic Customs Duty", "Countervailing Duty", "Anti-Dumping Duty", "IGST", "Compensation Cess", "Social Welfare Surcharge"] as const
const LICENSE_TYPES = ["IEC", "RCMC", "AD Code", "FSSAI", "BIS", "NSIC", "ISO 9001", "AGMARK"] as const
const LICENSE_STATUSES = ["Active", "Expiring Soon", "Expired", "Under Review"] as const
const RISK_CATEGORIES = ["Low", "Medium", "High", "Critical", "Prohibited"] as const
const CHA_NAMES = ["Sethi & Co", "Meridian Freight", "Blue Star CHA", "Continental Agency", "VXL Logistics", "Patriot Shipping", "Allcargo Customs", "Gateway Distriparks", "DHL Customs", "FedEx Trade"] as const
const COLORS = ["#e11d48", "#d97706", "#3b82f6", "#059669", "#7c3aed", "#0891b2", "#6366f1", "#f97316"]

/* ═══════════════════════════════════════════════════════════════════
   INR formatting
   ═══════════════════════════════════════════════════════════════════ */
function fmtINR(n: number): string {
  const sign = n < 0 ? "-" : ""
  const abs = Math.abs(n)
  if (abs >= 1e7) return `₹${sign}${(abs / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `₹${sign}${(abs / 1e5).toFixed(2)} L`
  return `₹${sign}${abs.toLocaleString("en-IN")}`
}

/* ═══════════════════════════════════════════════════════════════════
   16 Unique Visual Components
   ═══════════════════════════════════════════════════════════════════ */

function ShipmentStatusBadge({ status }: { status: string }) {
  const pulse = ["Customs Hold", "Under Examination", "Rejected", "Quarantine"].includes(status)
  const colorMap: Record<string, string> = {
    Pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "Customs Hold": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Under Examination": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Duty Assessed": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    Cleared: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Released: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Quarantine: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  }
  return (
    <Badge variant="outline" className={`ctc-status-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${pulse ? "ctc-pulse-active" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function PortBadge({ port }: { port: string }) {
  return (
    <Badge variant="outline" className="badge-interactive ctc-port-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
      <Anchor className="h-3 w-3" /> {port}
    </Badge>
  )
}

function ShipmentTypeBadge({ type }: { type: string }) {
  const idx = SHIPMENT_TYPES.indexOf(type as typeof SHIPMENT_TYPES[number])
  return (
    <Badge variant="outline" className="badge-interactive ctc-stype-badge gap-1 text-[10px] px-2 py-0.5 font-medium">
      {idx >= 0 ? SHIPMENT_EMOJI[idx] : "📦"} {type}
    </Badge>
  )
}

function OriginCountryBadge({ country }: { country: string }) {
  return (
    <Badge variant="outline" className="badge-interactive ctc-origin-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
      {country}
    </Badge>
  )
}

function DutyTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    "Basic Customs Duty": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
    "Countervailing Duty": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Anti-Dumping Duty": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    IGST: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Compensation Cess": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    "Social Welfare Surcharge": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  }
  return (
    <Badge variant="outline" className={`ctc-duty-type-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}>
      {type}
    </Badge>
  )
}

function DutyRateBar({ rate }: { rate: number }) {
  const color = rate > 25 ? "bg-red-500" : rate > 15 ? "bg-amber-500" : "bg-emerald-500"
  return (
    <div className="ctc-duty-rate-bar flex items-center gap-2">
      <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(rate * 3, 100)}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">{rate}%</span>
    </div>
  )
}

function LicenseTypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline" className="badge-interactive ctc-license-type-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
      {type}
    </Badge>
  )
}

function LicenseStatusBadge({ status }: { status: string }) {
  const pulse = ["Expiring Soon", "Expired"].includes(status)
  const colorMap: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "Expiring Soon": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Expired: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Under Review": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  }
  return (
    <Badge variant="outline" className={`ctc-license-status-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${pulse ? "ctc-pulse-warning" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function ComplianceScoreBar({ score }: { score: number }) {
  const color = score > 85 ? "bg-emerald-500" : score > 60 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="ctc-compliance-bar flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-bold" style={{ color: score > 85 ? "#059669" : score > 60 ? "#d97706" : "#e11d48" }}>{score}%</span>
    </div>
  )
}

function RiskBadge({ risk }: { risk: string }) {
  const pulse = ["Critical", "Prohibited"].includes(risk)
  const glow = risk === "Prohibited"
  const colorMap: Record<string, string> = {
    Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Prohibited: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
  }
  return (
    <Badge variant="outline" className={`ctc-risk-badge gap-1 text-[10px] px-2 py-0.5 font-bold ${pulse ? (glow ? "ctc-pulse-critical-glow" : "ctc-pulse-active") : ""} ${colorMap[risk] || "bg-gray-100 text-gray-700"}`}>
      <ShieldCheck className="h-3 w-3" /> {risk}
    </Badge>
  )
}

function CHABadge({ name }: { name: string }) {
  return (
    <Badge variant="outline" className="badge-interactive ctc-cha-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
      <Landmark className="h-3 w-3" /> {name}
    </Badge>
  )
}

function HSCodeTile({ code }: { code: string }) {
  return (
    <div className="ctc-hs-code-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[11px] font-mono font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
      <FileCheck className="h-3 w-3 text-blue-500" /> {code}
    </div>
  )
}

function DutyTile({ amount }: { amount: number }) {
  return (
    <div className="ctc-duty-tile inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
      <IndianRupee className="h-3 w-3" /> {fmtINR(amount)}
    </div>
  )
}

function FOBValueTile({ value }: { value: number }) {
  return (
    <div className="ctc-fob-tile inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
      <IndianRupee className="h-3 w-3" /> {fmtINR(value)}
    </div>
  )
}

function ClearanceTimeTile({ hours }: { hours: number }) {
  const color = hours > 72 ? "text-red-600 dark:text-red-400" : hours > 24 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
  return (
    <div className={`ctc-clearance-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[11px] font-bold ${color} dark:bg-gray-800`}>
      <Clock className="h-3 w-3" /> {hours}h
    </div>
  )
}

function ContainerTile({ id }: { id: string }) {
  return (
    <div className="ctc-container-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[11px] font-mono font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
      <Ship className="h-3 w-3 text-cyan-500" /> {id}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Data Generation
   ═══════════════════════════════════════════════════════════════════ */
function generateData() {
  const imports = Array.from({ length: 75 }, (_, i) => {
    const s = i * 7 + 1
    return {
      id: `IMP-${String(i + 1001).padStart(4, "0")}`,
      status: IMPORT_STATUSES[i % 8],
      port: INDIAN_PORTS[i % 10],
      type: SHIPMENT_TYPES[i % 8],
      origin: ORIGIN_COUNTRIES[i % 10],
      hsCode: `${ri(10, 99, s)}${ri(10, 99, s + 1)}.${ri(10, 99, s + 2)}.${ri(10, 99, s + 3)}`,
      dutyAmount: ri(50000, 5000000, s + 3),
      containerNo: `MSCU${ri(1000000, 9999999, s + 4)}`,
      boeNo: `BOE/${ri(2024, 2026, s + 5)}/${String(ri(1, 99999, s + 6)).padStart(5, "0")}`,
      igmNo: `IGM/${String(ri(1, 99999, s + 7)).padStart(5, "0")}`,
      clearanceHrs: ri(4, 168, s + 8),
      riskLevel: RISK_CATEGORIES[i % 5],
      cha: CHA_NAMES[i % 10],
    }
  })
  const exports = Array.from({ length: 70 }, (_, i) => {
    const s = i * 7 + 200
    return {
      id: `EXP-${String(i + 2001).padStart(4, "0")}`,
      status: EXPORT_STATUSES[i % 8],
      port: INDIAN_PORTS[i % 10],
      type: SHIPMENT_TYPES[i % 8],
      destination: ORIGIN_COUNTRIES[(i + 3) % 10],
      fobValue: ri(200000, 8000000, s + 1),
      shippingBillNo: `SB/${ri(2024, 2026, s + 2)}/${String(ri(1, 99999, s + 3)).padStart(5, "0")}`,
      letNo: `LET/${String(ri(1, 9999, s + 4)).padStart(4, "0")}`,
      vesselName: ["MV Ocean Star", "MV Pacific Pearl", "MV Indian Sovereign", "MV Cape Fortune", "MV Dragon Bay", "MV Coral Princess", "MV Sea Victory", "MV Golden Bridge"][i % 8],
      edpmsStatus: i % 3 === 0 ? "Confirmed" : i % 3 === 1 ? "Pending" : "Re-validated",
      hsCode: `${ri(10, 99, s + 5)}${ri(10, 99, s + 6)}.${ri(10, 99, s + 7)}.${ri(10, 99, s + 8)}`,
    }
  })
  const duties = Array.from({ length: 55 }, (_, i) => {
    const s = i * 5 + 400
    const dutyType = DUTY_TYPES[i % 6]
    return {
      id: `DUT-${String(i + 3001).padStart(4, "0")}`,
      type: dutyType,
      rate: dutyType === "Basic Customs Duty" ? ri(5, 25, s) : dutyType === "IGST" ? ri(5, 28, s) : dutyType === "Anti-Dumping Duty" ? ri(10, 60, s) : ri(2, 15, s),
      assessedValue: ri(100000, 10000000, s + 1),
      dutyAmount: ri(50000, 3000000, s + 2),
      settlementStatus: ["Paid", "Pending", "Under Appeal", "Refunded", "Adjusted"][i % 5],
      cha: CHA_NAMES[i % 10],
      section: dutyType === "Basic Customs Duty" ? "Sec 12" : dutyType === "IGST" ? "Sec 5(IGST)" : dutyType === "Anti-Dumping Duty" ? "Sec 9A" : dutyType === "Countervailing Duty" ? "Sec 9" : dutyType === "Compensation Cess" ? "Sec 140" : "Sec 10",
    }
  })
  const licenses = Array.from({ length: 65 }, (_, i) => {
    const s = i * 4 + 600
    const licType = LICENSE_TYPES[i % 8]
    return {
      id: `LIC-${String(i + 4001).padStart(4, "0")}`,
      type: licType,
      status: LICENSE_STATUSES[i % 4],
      licenseNo: `${licType.substring(0, 2).toUpperCase()}-${ri(10000000, 99999999, s)}`,
      authority: ["DGFT", "FSSAI", "BIS", "NSIC", "ISO Registrar", "AGMARK Authority", "Reserve Bank", "CBIC"][i % 8],
      validFrom: `2024-${String(ri(1, 12, s + 1)).padStart(2, "0")}-${String(ri(1, 28, s + 2)).padStart(2, "0")}`,
      validTo: `2026-${String(ri(1, 12, s + 3)).padStart(2, "0")}-${String(ri(1, 28, s + 3)).padStart(2, "0")}`,
      renewalStatus: ["Not Due", "Submitted", "Approved", "Rejected"][i % 4],
      complianceScore: ri(45, 100, s),
    }
  })
  return { IMPORT_STATUSES, EXPORT_STATUSES, INDIAN_PORTS, SHIPMENT_TYPES, ORIGIN_COUNTRIES, DUTY_TYPES, LICENSE_TYPES, LICENSE_STATUSES, RISK_CATEGORIES, CHA_NAMES, imports, exports, duties, licenses }
}

/* ═══════════════════════════════════════════════════════════════════
   Sort / Filter helpers
   ═══════════════════════════════════════════════════════════════════ */
function filterData<T,>(data: T[], q: string): T[] {
  if (!q) return data
  const lower = q.toLowerCase()
  return data.filter(item => Object.values(item as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(lower)))
}
function sortedData<T,>(data: T[], field: string, dir: "asc" | "desc"): T[] {
  return [...data].sort((a, b) => {
    const av = (a as unknown as Record<string, string | number>)[field]
    const bv = (b as unknown as Record<string, string | number>)[field]
    if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av
    return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
  })
}

/* ═══════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════ */
export default function CustomsTradeComplianceView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedImport, setSelectedImport] = useState<typeof data.imports[0] | null>(null)
  const { toast } = useToast()

  const handleSort = (f: string) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(f); setSortDir("asc") }
  }

  // KPI data
  const kpis = [
    { label: "Pending Filings", value: data.imports.filter(x => x.status === "Pending").length, icon: FileWarning, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Cleared Shipments", value: data.imports.filter(x => x.status === "Cleared").length + data.exports.filter(x => x.status === "Cleared").length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Duty Collected", value: fmtINR(data.duties.reduce((s, d) => s + d.dutyAmount, 0)), icon: IndianRupee, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { label: "Avg Clearance", value: `${Math.round(data.imports.reduce((s, x) => s + x.clearanceHrs, 0) / data.imports.length)}h`, icon: Clock, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Compliance Score", value: `${Math.round(data.licenses.reduce((s, l) => s + l.complianceScore, 0) / data.licenses.length)}%`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Active Licenses", value: data.licenses.filter(x => x.status === "Active").length, icon: FileCheck, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Risk Alerts", value: data.imports.filter(x => ["High", "Critical", "Prohibited"].includes(x.riskLevel)).length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
    { label: "Pending Assessments", value: data.duties.filter(x => x.settlementStatus === "Pending").length, icon: Scale, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
  ]

  // Charts
  const clearanceMonthly = Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], Cleared: ri(40, 90, i + 10), Held: ri(5, 20, i + 50), Rejected: ri(2, 10, i + 90) }))
  const typePie = SHIPMENT_TYPES.map((t, i) => ({ name: t, value: ri(10, 60, i + 100) }))
  const portBar = INDIAN_PORTS.map((p, i) => ({ port: p, Clearance: ri(50, 200, i + 150), Hold: ri(5, 30, i + 250) }))

  const filteredImports = sortedData(filterData(data.imports, searchQ), sortField, sortDir)
  const filteredExports = sortedData(filterData(data.exports, searchQ), sortField, sortDir)

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button variant="ghost" size="sm" className="press-scale ctc-sort-header h-8 px-2 text-[10px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handleSort(field)}>
      <span className="flex items-center gap-1">{children}<ArrowUpDown className="h-3 w-3" /></span>
    </Button>
  )

  return (
    <div className="ctc-root space-y-4 p-4">
      <PageHeader title="Customs & Trade Compliance" description="Import/export customs filing, duty management, licenses, and trade risk monitoring" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="ctc-tabs space-y-4">
        <TabsList className="ctc-tabs-list h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
          {["Compliance Dashboard", "Import Shipments", "Export Shipments", "Duty & Taxation", "Licenses & Certifications", "Risk & Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="ctc-tab-trigger text-xs font-medium px-3">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ══════════ Tab 0: Dashboard ══════════ */}
        <TabsContent value="0" className="ctc-tab-content space-y-4">
          <div className="ctc-kpi-grid grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className={`ctc-kpi-card group hover:shadow-md transition-all duration-300 ${k.bg}`}>
                <CardContent className="inner-glow glass-subtle flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${k.color}`}><k.icon className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{k.label}</p><p className={`text-lg font-bold ${k.color}`}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="ctc-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-lift-sm ctc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Clearance Trend</CardTitle></CardHeader>
              <CardContent><AreaChart data={clearanceMonthly}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Cleared" stackId="a" fill="#059669" /><Area type="monotone" dataKey="Held" stackId="a" fill="#d97706" /><Area type="monotone" dataKey="Rejected" stackId="a" fill="#e11d48" /></AreaChart></CardContent>
            </Card>
            <Card className="hover-lift-sm ctc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Shipment Type Distribution</CardTitle></CardHeader>
              <CardContent><PieChart><Pie data={typePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{typePie.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="hover-lift-sm ctc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Port-wise Clearance</CardTitle></CardHeader>
              <CardContent><BarChart data={portBar}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="port" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="Clearance" fill="#3b82f6" radius={[4, 4, 0, 0]} /><Bar dataKey="Hold" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart></CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ══════════ Tab 1: Import Shipments ══════════ */}
        <TabsContent value="1" className="ctc-tab-content space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search imports..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="badge-interactive text-xs">{filteredImports.length} shipments</Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="ctc-import-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left"><SortHeader field="id">ID</SortHeader></th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">Port</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">HS Code</th><th className="p-2 text-left"><SortHeader field="dutyAmount">Duty</SortHeader></th><th className="p-2 text-left">CHA</th><th className="p-2 text-left">Risk</th><th className="p-2 text-left">Clearance</th><th className="p-2 text-center">Action</th></tr></thead>
              <tbody>
                {filteredImports.map((imp, i) => (
                  <tr key={imp.id} className="ctc-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{imp.id}</td>
                    <td className="p-2"><ShipmentStatusBadge status={imp.status} /></td>
                    <td className="p-2"><PortBadge port={imp.port} /></td>
                    <td className="p-2"><ShipmentTypeBadge type={imp.type} /></td>
                    <td className="p-2"><OriginCountryBadge country={imp.origin} /></td>
                    <td className="p-2"><HSCodeTile code={imp.hsCode} /></td>
                    <td className="p-2"><DutyTile amount={imp.dutyAmount} /></td>
                    <td className="p-2"><CHABadge name={imp.cha} /></td>
                    <td className="p-2"><RiskBadge risk={imp.riskLevel} /></td>
                    <td className="p-2"><ClearanceTimeTile hours={imp.clearanceHrs} /></td>
                    <td className="press-scale p-2 text-center"><Button variant="ghost" size="sm" className="ctc-view-btn h-7 w-7 p-0 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30" onClick={() => { setSelectedImport(imp); setSheetOpen(true); toast.success("Viewing Import", `${imp.id} details opened`) }}><Eye className="h-3.5 w-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 2: Export Shipments ══════════ */}
        <TabsContent value="2" className="ctc-tab-content space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search exports..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="badge-interactive text-xs">{filteredExports.length} shipments</Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="ctc-export-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left"><SortHeader field="id">ID</SortHeader></th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">Port</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Destination</th><th className="p-2 text-left">HS Code</th><th className="p-2 text-left"><SortHeader field="fobValue">FOB Value</SortHeader></th><th className="p-2 text-left">Vessel</th><th className="p-2 text-left">EDPMS</th><th className="p-2 text-center">Action</th></tr></thead>
              <tbody>
                {filteredExports.map((exp, i) => (
                  <tr key={exp.id} className="ctc-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{exp.id}</td>
                    <td className="p-2"><ShipmentStatusBadge status={exp.status} /></td>
                    <td className="p-2"><PortBadge port={exp.port} /></td>
                    <td className="p-2"><ShipmentTypeBadge type={exp.type} /></td>
                    <td className="p-2"><OriginCountryBadge country={exp.destination} /></td>
                    <td className="p-2"><HSCodeTile code={exp.hsCode} /></td>
                    <td className="p-2"><FOBValueTile value={exp.fobValue} /></td>
                    <td className="p-2 text-[10px] font-medium text-gray-600 dark:text-gray-400 truncate max-w-[120px]">{exp.vesselName}</td>
                    <td className="badge-interactive p-2"><Badge variant="outline" className={`text-[10px] px-2 py-0.5 font-medium ${exp.edpmsStatus === "Confirmed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>{exp.edpmsStatus}</Badge></td>
                    <td className="press-scale p-2 text-center"><Button variant="ghost" size="sm" className="ctc-view-btn h-7 w-7 p-0 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30" onClick={() => toast.success("Viewing Export", `${exp.id} details opened`)}><Eye className="h-3.5 w-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 3: Duty & Taxation ══════════ */}
        <TabsContent value="3" className="ctc-tab-content space-y-4">
          <div className="ctc-duty-grid grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.duties.map((d, i) => {
              const isDuty = !["IGST", "Compensation Cess", "Social Welfare Surcharge"].includes(d.type)
              return (
                <Card key={d.id} className={`ctc-duty-card group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${isDuty ? "border-l-4 border-l-rose-500" : "border-l-4 border-l-amber-500"}`}>
                  <div className={`ctc-duty-card-header p-3 ${isDuty ? "bg-gradient-to-r from-rose-500 to-rose-600" : "bg-gradient-to-r from-amber-500 to-amber-600"} text-white`}>
                    <div className="flex items-center justify-between"><DutyTypeBadge type={d.type} /><span className="text-[10px] opacity-80">{d.section}</span></div>
                  </div>
                  <CardContent className="inner-glow glass-subtle p-3 space-y-2">
                    <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Rate</span><DutyRateBar rate={d.rate} /></div>
                    <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Assessed</span><span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{fmtINR(d.assessedValue)}</span></div>
                    <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Duty</span><DutyTile amount={d.dutyAmount} /></div>
                    <div className="badge-interactive flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Settlement</span><Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${d.settlementStatus === "Paid" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : d.settlementStatus === "Pending" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>{d.settlementStatus}</Badge></div>
                    <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">CHA</span><CHABadge name={d.cha} /></div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ══════════ Tab 4: Licenses ══════════ */}
        <TabsContent value="4" className="ctc-tab-content space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search licenses..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="badge-interactive text-xs">{data.licenses.length} licenses</Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="ctc-license-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Type</th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">License No</th><th className="p-2 text-left">Authority</th><th className="p-2 text-left">Valid From</th><th className="p-2 text-left">Valid To</th><th className="p-2 text-left">Renewal</th><th className="p-2 text-left">Compliance</th></tr></thead>
              <tbody>
                {data.licenses.map((lic) => (
                  <tr key={lic.id} className="ctc-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{lic.id}</td>
                    <td className="p-2"><LicenseTypeBadge type={lic.type} /></td>
                    <td className="p-2"><LicenseStatusBadge status={lic.status} /></td>
                    <td className="p-2 text-[10px] font-mono font-medium">{lic.licenseNo}</td>
                    <td className="p-2 text-[10px] font-medium text-gray-600 dark:text-gray-400">{lic.authority}</td>
                    <td className="p-2 text-[10px]">{lic.validFrom}</td>
                    <td className="p-2 text-[10px]">{lic.validTo}</td>
                    <td className="badge-interactive p-2"><Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${lic.renewalStatus === "Approved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : lic.renewalStatus === "Submitted" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>{lic.renewalStatus}</Badge></td>
                    <td className="p-2"><ComplianceScoreBar score={lic.complianceScore} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 5: Risk & Analytics ══════════ */}
        <TabsContent value="5" className="ctc-tab-content space-y-4">
          <div className="ctc-kpi-grid grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            {[
              { label: "Total Shipments", value: data.imports.length + data.exports.length, icon: Package, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { label: "Avg Compliance", value: `${Math.round(data.licenses.reduce((s, l) => s + l.complianceScore, 0) / data.licenses.length)}%`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Total Duty (FY)", value: fmtINR(data.duties.reduce((s, d) => s + d.dutyAmount, 0)), icon: IndianRupee, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
              { label: "High Risk Items", value: data.imports.filter(x => ["Critical", "Prohibited"].includes(x.riskLevel)).length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
            ].map((k, i) => (
              <Card key={i} className={`ctc-kpi-card group hover:shadow-md transition-all duration-300 ${k.bg}`}>
                <CardContent className="inner-glow glass-subtle flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${k.color}`}><k.icon className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{k.label}</p><p className={`text-lg font-bold ${k.color}`}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="ctc-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="hover-lift-sm ctc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Duty Collection</CardTitle></CardHeader>
              <CardContent><LineChart data={Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], Duty: ri(500, 2000, i + 300), Refund: ri(50, 200, i + 400) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="Duty" stroke="#e11d48" strokeWidth={2} /><Line type="monotone" dataKey="Refund" stroke="#d97706" strokeWidth={2} /></LineChart></CardContent>
            </Card>
            <Card className="hover-lift-sm ctc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Risk Category Distribution</CardTitle></CardHeader>
              <CardContent><PieChart><Pie data={RISK_CATEGORIES.map((r, i) => ({ name: r, value: ri(5, 40, i + 500) }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{RISK_CATEGORIES.map((_, i) => <Cell key={i} fill={["#059669", "#d97706", "#f97316", "#e11d48", "#7c3aed"][i]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="hover-lift-sm ctc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top HS Codes by Volume</CardTitle></CardHeader>
              <CardContent><BarChart data={Array.from({ length: 8 }, (_, i) => ({ code: `${ri(10, 99, i + 600)}${ri(10, 99, i + 700)}`, Volume: ri(20, 150, i + 800) }))} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis dataKey="code" type="category" tick={{ fontSize: 10 }} width={60} /><Tooltip /><Bar dataKey="Volume" fill="#3b82f6" radius={[0, 4, 4, 0]} /></BarChart></CardContent>
            </Card>
            <Card className="hover-lift-sm ctc-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Port Performance (6 months)</CardTitle></CardHeader>
              <CardContent><AreaChart data={Array.from({ length: 6 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i], JNPT: ri(80, 150, i + 900), Chennai: ri(50, 120, i + 950), Mundra: ri(60, 130, i + 1000), Nhava: ri(70, 140, i + 1050) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="JNPT" stackId="a" fill="#3b82f6" /><Area type="monotone" dataKey="Chennai" stackId="a" fill="#059669" /><Area type="monotone" dataKey="Mundra" stackId="a" fill="#d97706" /><Area type="monotone" dataKey="Nhava" stackId="a" fill="#7c3aed" /></AreaChart></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ══════════ Sheet ══════════ */}
      <Sheet open={!!(sheetOpen && selectedImport)} onOpenChange={o => { setSheetOpen(o); if (!o) setSelectedImport(null) }}>
        <SheetContent className="ctc-sheet w-full sm:w-[540px]">
          {selectedImport && (
            <>
              <div className="ctc-sheet-header bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 p-6 mx-6 mt-6 rounded-xl text-white">
                <SheetHeader><SheetTitle className="text-white">Import Shipment Detail</SheetTitle></SheetHeader>
                <p className="text-sm opacity-80 mt-1">{selectedImport.id} | {selectedImport.port}</p>
              </div>
              <ScrollArea className="mt-4 px-6">
                <div className="space-y-3 pb-6">
                  <div className="ctc-detail-grid grid grid-cols-2 gap-3">
                    <div className="ctc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Status</p><ShipmentStatusBadge status={selectedImport.status} /></div>
                    <div className="ctc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Type</p><ShipmentTypeBadge type={selectedImport.type} /></div>
                    <div className="ctc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Origin</p><OriginCountryBadge country={selectedImport.origin} /></div>
                    <div className="ctc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">HS Code</p><HSCodeTile code={selectedImport.hsCode} /></div>
                    <div className="ctc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Duty Amount</p><DutyTile amount={selectedImport.dutyAmount} /></div>
                    <div className="ctc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Clearance Time</p><ClearanceTimeTile hours={selectedImport.clearanceHrs} /></div>
                    <div className="ctc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Risk Level</p><RiskBadge risk={selectedImport.riskLevel} /></div>
                    <div className="ctc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">CHA</p><CHABadge name={selectedImport.cha} /></div>
                    <div className="ctc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Container</p><ContainerTile id={selectedImport.containerNo} /></div>
                    <div className="ctc-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">BOE No</p><p className="text-[11px] font-mono font-semibold">{selectedImport.boeNo}</p></div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
