"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  Ship, Anchor, Globe, FileText, Clock, AlertTriangle, CheckCircle, Truck,
  Package, Container, MapPin, ArrowRightLeft, Radio, Activity, TrendingUp,
  ArrowUpRight, ArrowDownRight, BarChart3, Timer, ShieldCheck, Users,
  Download, Eye, Banknote,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { ExportButton } from "@/components/shared/export-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CC = { navy: "#0f172a", teal: "#0d9488", coral: "#f97316", sky: "#0ea5e9", emerald: "#059669", rose: "#e11d48", amber: "#d97706", indigo: "#6366f1", slate: "#475569", purple: "#7c3aed", lime: "#65a30d", cyan: "#06b6d4", green: "#16a34a" }
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const PORTS = ["JNPT Mumbai", "Chennai", "V.O. Chidambaranar", "Kandla", "Mundra", "Haldia", "Visakhapatnam", "Cochin"]

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}

function generateData() {
  const r = seededRandom(192192192)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(r() * arr.length)]
  const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min
  const rf = (min: number, max: number) => +(r() * (max - min) + min).toFixed(2)

  const VESSEL_TYPES = ["Container", "Bulk Carrier", "Tanker", "Ro-Ro", "General Cargo", "LNG Carrier"]
  const VESSEL_STATUSES = ["Arrived", "Berthed", "Loading", "Discharging", "Departed", "Anchored", "Waiting"]
  const CARGO_TYPES = ["FCL", "LCL", "Break Bulk", "Liquid Bulk", "Dry Bulk", "Reefer", "OOG", "HAZ"]
  const DOC_TYPES = ["Bill of Entry", "Bill of Lading", "Customs Declaration", "Shipping Manifest", "Port Clearance", "Quarantine Certificate", "Phyto Certificate", "Fumigation Certificate"]
  const DOC_STATUSES = ["Submitted", "Under Review", "Approved", "Rejected", "Pending", "Expired"]
  const CLEARANCE_STAGES = ["Filed", "Assessment", "Examination", "Duty Payment", "Out of Charge"]
  const SHIPPING_LINES = ["Maersk", "MSC", "CMA CGM", "COSCO", "Hapag-Lloyd", "ONE", "Evergreen", "HMM", "Yang Ming", "ZIM"]
  const CONTAINER_SIZES = ["20ft", "40ft", "45ft", "20ft Reefer", "40ft Reefer", "20ft Tank", "40ft High Cube"]
  const AGENTS = ["Shreyas Shipping", "V.O. Shipping Agency", "Seaway Shipping", "Samudra Shipping", "Transworld Shipping", "DHL Global Forwarding", "Kintetsu Express", "TCIL Logistics", "Navkar Corporation", "Allcargo Logistics"]
  const BERTH_TYPES = ["Container", "Multi-Purpose", "Bulk", "Liquid", "Ro-Ro", "Cruise"]

  const vessels = Array.from({ length: 60 }, (_, i) => ({
    id: `VSL-${String(i + 1).padStart(4, "0")}`,
    name: pick(["MV Ocean Star", "MV Pacific Crown", "MV Indian Empress", "MV Sea Glory", "MV Bay Bridge", "MV Cape Fortune", "MV River Princess", "MV Wind Spirit", "MV Sun Chaser", "MV Coral Queen"]),
    imo: `IMO${ri(9000000, 9999999)}`,
    type: pick(VESSEL_TYPES), status: pick(VESSEL_STATUSES),
    port: pick(PORTS), shippingLine: pick(SHIPPING_LINES),
    agent: pick(AGENTS),
    eta: Date.now() - ri(-48, 72) * 3600000,
    etd: Date.now() + ri(0, 168) * 3600000,
    berthedAt: r() > 0.4 ? Date.now() - ri(0, 48) * 3600000 : null,
    grossTonnage: ri(5000, 120000), teuCapacity: ri(500, 24000),
    draft: rf(8, 18), cargoWeight: ri(500, 55000),
    flag: pick(["India", "Panama", "Liberia", "Marshall Islands", "Singapore", "Hong Kong"]),
  }))

  const containers = Array.from({ length: 80 }, (_, i) => ({
    id: `CTR-${String(i + 1).padStart(6, "0")}`,
    containerNo: `MSCU${ri(1000000, 9999999)}`,
    vessel: pick(vessels).name, port: pick(PORTS),
    size: pick(CONTAINER_SIZES),
    cargoType: pick(CARGO_TYPES),
    status: pick(["In Transit", "At Port", "Customs Hold", "Released", "Loaded", "Empty", "Gate Out"]),
    weight: ri(5000, 35000), temperature: ri(-25, 25),
    destination: pick(["Nhava Sheva ICD", "Tughlakabad ICD", "Patparganj ICD", "Whitefield ICD", "Sanathnagar ICD", "Dadri ICD", "Malanpur ICD", "Pipavav ICD"]),
    origin: pick(["Shanghai", "Singapore", "Rotterdam", "Dubai", "Colombo", "Busan", "Taipei", "Hong Kong", "Felixstowe", "Hamburg"]),
    blNumber: `BL${ri(2024, 2026)}${String(i + 1).padStart(6, "0")}`,
    customsStatus: pick(["Cleared", "Pending", "Exam Required", "Hold", "Released"]),
    dwellTime: ri(0, 120),
  }))

  const berths = Array.from({ length: 50 }, (_, i) => ({
    id: `BRH-${String(i + 1).padStart(3, "0")}`,
    name: `Berth ${String(i + 1).padStart(2, "0")}`,
    port: pick(PORTS),
    type: pick(BERTH_TYPES),
    length: ri(200, 500), depth: rf(10, 20),
    status: pick(["Occupied", "Available", "Under Maintenance", "Reserved"]),
    occupancy: ri(0, 100),
    currentVessel: r() > 0.3 ? pick(vessels).name : null,
    operations: pick(["Loading", "Discharging", "Idle", "Shift", "Lashing"]),
    craneCount: ri(1, 6), movesPerHour: ri(15, 45),
    cargoType: pick(CARGO_TYPES),
  }))

  const documents = Array.from({ length: 60 }, (_, i) => ({
    id: `DOC-${String(i + 1).padStart(5, "0")}`,
    docNumber: `PCS-${ri(2024, 2026)}-${String(i + 1).padStart(6, "0")}`,
    type: pick(DOC_TYPES), status: pick(DOC_STATUSES),
    vessel: pick(vessels).name, port: pick(PORTS),
    submittedBy: pick(["R.K. Sharma", "A. Patel", "S. Krishnan", "M. Gupta", "P. Singh", "V. Reddy", "N. Joshi", "D. Kumar"]),
    submittedDate: Date.now() - ri(1, 90) * 86400000,
    processedDate: r() > 0.4 ? Date.now() - ri(0, 30) * 86400000 : null,
    referenceNo: `REF-${ri(100000, 999999)}`,
    amount: ri(5000, 500000),
    remarks: pick(["Standard processing", "Priority clearance", "Examination required", "Awaiting additional docs", "Approved with conditions", "Manual review pending"]),
  }))

  const clearances = Array.from({ length: 50 }, (_, i) => {
    const stageIdx = ri(0, 4)
    return {
      id: `CLR-${String(i + 1).padStart(5, "0")}`,
      beNumber: `BE${ri(2024, 2026)}${String(i + 1).padStart(8, "0")}`,
      containerNo: pick(containers).containerNo,
      vessel: pick(vessels).name,
      port: pick(PORTS),
      importer: pick(["Reliance Industries", "Tata Steel", "Mahindra Logistics", "Adani Ports", "L&T Shipping", "Shapoorji Pallonji", "JSW Steel", "Godrej Agrovet"]),
      ieCode: `IEC${ri(10000000, 99999999)}`,
      currentStage: CLEARANCE_STAGES[stageIdx],
      stageIndex: stageIdx,
      goodsValue: ri(100000, 50000000),
      dutyAmount: ri(5000, 10000000),
      dutyPaid: stageIdx >= 3 ? ri(5000, 10000000) : 0,
      riskStatus: pick(["Low Risk", "Medium Risk", "High Risk"]),
      assessmentDate: Date.now() - ri(0, 72) * 3600000,
    }
  })

  const monthlyThroughput = MONTHS.map(m => ({ month: m, teu: ri(25000, 65000), bulk: ri(8000, 22000), liquid: ri(3000, 12000), vessels: ri(40, 90) }))
  const vesselTypeData = VESSEL_TYPES.map(t => ({ type: t, count: ri(5, 25) }))
  const portUtilData = PORTS.map(p => ({ port: p, occupancy: ri(50, 98), efficiency: ri(55, 95), turnaround: ri(48, 200) }))
  const dwellTimeTrend = MONTHS.map(m => ({ month: m, avgDwell: ri(3, 8), target: 5 }))
  const docProcessingData = MONTHS.map(m => ({ month: m, submitted: ri(200, 600), approved: ri(150, 500), rejected: ri(10, 50) }))
  const shippingLinePerf = SHIPPING_LINES.map(l => ({ line: l, teu: ri(5000, 25000), onTime: ri(60, 95), dwell: ri(2, 7), docs: ri(80, 100) }))

  return {
    vessels, containers, berths, documents, clearances,
    monthlyThroughput, vesselTypeData, portUtilData, dwellTimeTrend,
    docProcessingData, shippingLinePerf,
    VESSEL_TYPES, VESSEL_STATUSES, CARGO_TYPES, DOC_TYPES, DOC_STATUSES,
    CLEARANCE_STAGES, SHIPPING_LINES, CONTAINER_SIZES, AGENTS, BERTH_TYPES, PORTS,
  }
}

const DATA = generateData()

// ─── Unique Visual Components ──────────────────────────────

function BerthOccupancyBar({ occupancy }: { occupancy: number }) {
  const color = occupancy < 40 ? CC.emerald : occupancy < 70 ? CC.amber : occupancy < 90 ? CC.coral : CC.rose
  return (
    <div className="flex items-center gap-2">
      <div className="pcs-berth-bar-track">
        <div className="pcs-berth-bar-fill" style={{ width: `${occupancy}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{occupancy}%</span>
    </div>
  )
}

function VesselStatusRing({ status }: { status: string }) {
  const config: Record<string, { bg: string; color: string; label: string }> = {
    "Arrived": { bg: "bg-sky-100 dark:bg-sky-900/40", color: "text-sky-600 dark:text-sky-400", label: "ARR" },
    "Berthed": { bg: "bg-teal-100 dark:bg-teal-900/40", color: "text-teal-600 dark:text-teal-400", label: "BRD" },
    "Loading": { bg: "bg-amber-100 dark:bg-amber-900/40", color: "text-amber-600 dark:text-amber-400", label: "LDG" },
    "Discharging": { bg: "bg-orange-100 dark:bg-orange-900/40", color: "text-orange-600 dark:text-orange-400", label: "DIS" },
    "Departed": { bg: "bg-emerald-100 dark:bg-emerald-900/40", color: "text-emerald-600 dark:text-emerald-400", label: "DEP" },
    "Anchored": { bg: "bg-indigo-100 dark:bg-indigo-900/40", color: "text-indigo-600 dark:text-indigo-400", label: "ANC" },
    "Waiting": { bg: "bg-rose-100 dark:bg-rose-900/40", color: "text-rose-600 dark:text-rose-400", label: "WAT" },
  }
  const c = config[status] || { bg: "bg-gray-100 dark:bg-gray-800", color: "text-gray-600 dark:text-gray-400", label: "UNK" }
  return (
    <div className={cn("pcs-vessel-ring", c.bg, c.color)} style={{ color: c.color.includes("sky") ? "#0ea5e9" : c.color.includes("teal") ? "#0d9488" : c.color.includes("amber") ? "#d97706" : c.color.includes("orange") ? "#f97316" : c.color.includes("emerald") ? "#059669" : c.color.includes("indigo") ? "#6366f1" : "#e11d48" }}>
      {c.label}
    </div>
  )
}

function ClearanceTracker({ stageIndex }: { stageIndex: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {DATA.CLEARANCE_STAGES.map((stage, idx) => (
        <div key={stage} className="flex items-center">
          <div className={cn("pcs-clearance-num", idx <= stageIndex ? "bg-teal-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400")}>
            {idx + 1}
          </div>
          {idx < DATA.CLEARANCE_STAGES.length - 1 && (
            <div className={cn("pcs-clearance-line", idx < stageIndex ? "done" : "pending")} />
          )}
        </div>
      ))}
    </div>
  )
}

function ContainerSizeBadge({ size }: { size: string }) {
  const isReefer = size.toLowerCase().includes("reefer")
  const isTank = size.toLowerCase().includes("tank")
  const bg = isReefer ? "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300" : isTank ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
  return <span className={cn("pcs-container-size", bg)}>{size}</span>
}

function CustomsStatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    "Cleared": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Released": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Pending": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Exam Required": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    "Hold": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  }
  return <span className={cn("pcs-doc-pill", config[status] || "bg-gray-100 text-gray-600")}>{status}</span>
}

// ─── Status badge helper ───────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isDark = status === "Hold" || status === "Rejected" || status === "Waiting" || status === "Under Maintenance" || status === "Occupied"
  const darkClass = "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
  const normalMap: Record<string, string> = {
    "Arrived": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Berthed": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    "Loading": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Discharging": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Departed": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Anchored": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    "In Transit": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "At Port": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    "Customs Hold": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    "Released": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Loaded": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Empty": "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    "Gate Out": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    "Submitted": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Under Review": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Approved": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Pending": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Expired": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    "Available": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Reserved": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    "Low Risk": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Medium Risk": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "High Risk": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  }
  return (
    <span className={cn("pcs-doc-pill", isDark ? darkClass : normalMap[status] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300")}>
      {status}
    </span>
  )
}

function fmtINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${n.toLocaleString("en-IN")}`
}

function fmtDate(ts: number | null) {
  if (!ts) return "—"
  return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

function fmtDateTime(ts: number | null) {
  if (!ts) return "—"
  return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
}

// ─── Sortable Table Helper ────────────────────────────────

function SortIcon({ field, sortBy }: { field: string; sortBy: string }) {
  if (sortBy !== field) return <span className="text-gray-300 dark:text-gray-600 ml-0.5">↕</span>
  return <span className="text-teal-500 ml-0.5">↑</span>
}

// ─── Main Component ────────────────────────────────────────

export default function PortCommunitySystemView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState<string>("")
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState<string>("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { toast } = useToast()

  const openDrawer = (type: string, data: any) => {
    setDrawerType(type)
    setDrawerData(data)
    setDrawerOpen(true)
  }

  const handleSort = (field: string) => {
    setSortBy(sortBy === field ? "" : field)
  }

  const sortData = <T extends Record<string, any>>(data: T[], field: string): T[] => {
    if (!sortBy || sortBy !== field) return data
    return [...data].sort((a, b) => {
      const va = a[field], vb = b[field]
      if (typeof va === "number" && typeof vb === "number") return vb - va
      return String(va).localeCompare(String(vb))
    })
  }

  const filteredVessels = useMemo(() => {
    let d = DATA.vessels
    if (searchTerm) d = d.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.port.toLowerCase().includes(searchTerm.toLowerCase()) || v.shippingLine.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== "All") d = d.filter(v => v.status === filterStatus)
    return sortData(d, "id")
  }, [searchTerm, filterStatus, sortBy])

  const filteredContainers = useMemo(() => {
    let d = DATA.containers
    if (searchTerm) d = d.filter(c => c.containerNo.toLowerCase().includes(searchTerm.toLowerCase()) || c.destination.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== "All") d = d.filter(c => c.status === filterStatus)
    return sortData(d, "id")
  }, [searchTerm, filterStatus, sortBy])

  const filteredBerths = useMemo(() => {
    let d = DATA.berths
    if (searchTerm) d = d.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.port.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== "All") d = d.filter(b => b.status === filterStatus)
    return sortData(d, "id")
  }, [searchTerm, filterStatus, sortBy])

  const filteredDocs = useMemo(() => {
    let d = DATA.documents
    if (searchTerm) d = d.filter(doc => doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) || doc.vessel.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== "All") d = d.filter(doc => doc.status === filterStatus)
    return sortData(d, "id")
  }, [searchTerm, filterStatus, sortBy])

  const filteredClearances = useMemo(() => {
    let d = DATA.clearances
    if (searchTerm) d = d.filter(c => c.beNumber.toLowerCase().includes(searchTerm.toLowerCase()) || c.importer.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== "All") d = d.filter(c => c.riskStatus === filterStatus)
    return sortData(d, "id")
  }, [searchTerm, filterStatus, sortBy])

  const kpis = [
    { label: "Active Vessels", value: DATA.vessels.filter(v => ["Arrived", "Berthed", "Loading", "Discharging", "Anchored", "Waiting"].includes(v.status)).length, icon: Ship, color: CC.teal, trend: "+8%", up: true },
    { label: "Containers at Port", value: DATA.containers.filter(c => ["At Port", "Customs Hold", "Loaded"].includes(c.status)).length, icon: Container, color: CC.sky, trend: "+12%", up: true },
    { label: "Berth Utilization", value: `${Math.round(DATA.berths.reduce((a, b) => a + b.occupancy, 0) / DATA.berths.length)}%`, icon: Anchor, color: CC.coral, trend: "-3%", up: false },
    { label: "Avg Dwell Time", value: `${(DATA.containers.reduce((a, c) => a + c.dwellTime, 0) / DATA.containers.length).toFixed(1)}d`, icon: Timer, color: CC.amber, trend: "-0.5d", up: false },
    { label: "Documents Pending", value: DATA.documents.filter(d => d.status === "Under Review" || d.status === "Pending").length, icon: FileText, color: CC.indigo, trend: "-15%", up: false },
    { label: "Customs Cleared", value: DATA.clearances.filter(c => c.stageIndex >= 4).length, icon: ShieldCheck, color: CC.emerald, trend: "+22%", up: true },
  ]

  const tabs = ["Port Dashboard", "Vessel Tracking", "Container Yard", "Berth Management", "Documentation", "Customs Clearance"]

  // ─── Tab 0: Port Dashboard ──────────────────────────────
  const dashboardTab = (
    <div className="space-y-4">
      <div className="pcs-kpi-grid grid grid-cols-4 gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {kpis.map((kpi, i) => (
          <Card key={i} className="pcs-kpi-card pcs-stat-card">
            <CardContent className="glass-subtle p-3.5">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg" style={{ background: `${kpi.color}15` }}>
                  <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} />
                </div>
                <div className={cn("flex items-center gap-0.5 text-[11px] font-semibold", kpi.up ? "text-emerald-600" : "text-rose-600")}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.trend}
                </div>
              </div>
              <div className="mt-2.5">
                <div className="pcs-counter-value text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{kpi.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="col-span-2">
          <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Monthly Port Throughput (TEU)</CardTitle></CardHeader>
          <CardContent className="glass-subtle px-4 pb-3">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={DATA.monthlyThroughput}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="teu" fill={CC.teal} radius={[3, 3, 0, 0]} name="TEU" />
                <Bar dataKey="bulk" fill={CC.coral} radius={[3, 3, 0, 0]} name="Bulk (MT)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Vessel Type Distribution</CardTitle></CardHeader>
          <CardContent className="glass-subtle px-4 pb-3 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={DATA.vesselTypeData} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={3} label={({ type, percent }) => `${type.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {DATA.vesselTypeData.map((_, i) => <Cell key={i} fill={[CC.teal, CC.sky, CC.coral, CC.amber, CC.indigo, CC.emerald][i]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Port Utilization & Turnaround</CardTitle></CardHeader>
          <CardContent className="glass-subtle px-4 pb-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DATA.portUtilData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <YAxis dataKey="port" type="category" tick={{ fontSize: 10 }} width={130} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="occupancy" fill={CC.teal} radius={[0, 3, 3, 0]} name="Occupancy %" />
                <Bar dataKey="efficiency" fill={CC.sky} radius={[0, 3, 3, 0]} name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Container Dwell Time Trend (Days)</CardTitle></CardHeader>
          <CardContent className="glass-subtle px-4 pb-3">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={DATA.dwellTimeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 10]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="avgDwell" stroke={CC.coral} strokeWidth={2} dot={{ r: 3 }} name="Avg Dwell" />
                <Line type="monotone" dataKey="target" stroke={CC.slate} strokeWidth={2} strokeDasharray="6 3" dot={false} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // ─── Tab 1: Vessel Tracking ────────────────────────────
  const vesselTab = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Input placeholder="Search vessels, ports, lines..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="h-8 text-xs" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-white dark:bg-gray-900">
          <option value="All">All Status</option>
          {DATA.VESSEL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ExportButton data={filteredVessels} filename="vessels" />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table className="table-hover-highlight">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { key: "name", label: "Vessel" }, { key: "type", label: "Type" }, { key: "status", label: "Status" },
                { key: "port", label: "Port" }, { key: "shippingLine", label: "Line" }, { key: "eta", label: "ETA" },
                { key: "etd", label: "ETD" }, { key: "teuCapacity", label: "TEU Cap." },
                { key: "cargoWeight", label: "Cargo (MT)" }, { key: "flag", label: "Flag" },
              ].map(col => (
                <TableHead key={col.key} className="text-[11px] pcs-sort-header" onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon field={col.key} sortBy={sortBy} />
                </TableHead>
              ))}
              <TableHead className="text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVessels.slice(0, 25).map(v => (
              <TableRow key={v.id} className="pcs-table-row">
                <TableCell className="text-xs font-medium">{v.name}</TableCell>
                <TableCell><StatusBadge status={v.type} /></TableCell>
                <TableCell><VesselStatusRing status={v.status} /></TableCell>
                <TableCell className="text-xs">{v.port}</TableCell>
                <TableCell className="text-xs font-medium">{v.shippingLine}</TableCell>
                <TableCell className="text-xs">{fmtDateTime(v.eta)}</TableCell>
                <TableCell className="text-xs">{fmtDateTime(v.etd)}</TableCell>
                <TableCell className="text-xs text-right">{v.teuCapacity.toLocaleString()}</TableCell>
                <TableCell className="numeric-cell text-xs text-right">{v.cargoWeight.toLocaleString()}</TableCell>
                <TableCell className="text-xs">{v.flag}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button className="pcs-action-btn p-1.5 rounded-md" onClick={() => openDrawer("vessel", v)}><Eye className="h-3.5 w-3.5 text-teal-600" /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-[11px] text-gray-500">Showing {Math.min(25, filteredVessels.length)} of {filteredVessels.length} vessels</div>
    </div>
  )

  // ─── Tab 2: Container Yard ─────────────────────────────
  const containerTab = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Input placeholder="Search containers, destinations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="h-8 text-xs" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-white dark:bg-gray-900">
          <option value="All">All Status</option>
          {["In Transit", "At Port", "Customs Hold", "Released", "Loaded", "Empty", "Gate Out"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ExportButton data={filteredContainers} filename="containers" />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table className="table-hover-highlight">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { key: "containerNo", label: "Container" }, { key: "size", label: "Size" }, { key: "status", label: "Status" },
                { key: "cargoType", label: "Cargo" }, { key: "port", label: "Port" }, { key: "origin", label: "Origin" },
                { key: "destination", label: "Dest. ICD" }, { key: "weight", label: "Weight (kg)" },
                { key: "dwellTime", label: "Dwell (hrs)" }, { key: "customsStatus", label: "Customs" },
              ].map(col => (
                <TableHead key={col.key} className="text-[11px] pcs-sort-header" onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon field={col.key} sortBy={sortBy} />
                </TableHead>
              ))}
              <TableHead className="text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContainers.slice(0, 25).map(c => (
              <TableRow key={c.id} className="pcs-table-row">
                <TableCell className="text-xs font-mono font-medium">{c.containerNo}</TableCell>
                <TableCell><ContainerSizeBadge size={c.size} /></TableCell>
                <TableCell><StatusBadge status={c.status} /></TableCell>
                <TableCell className="text-xs">{c.cargoType}</TableCell>
                <TableCell className="text-xs">{c.port}</TableCell>
                <TableCell className="text-xs">{c.origin}</TableCell>
                <TableCell className="text-xs">{c.destination}</TableCell>
                <TableCell className="numeric-cell text-xs text-right">{c.weight.toLocaleString()}</TableCell>
                <TableCell className="text-xs text-right">{c.dwellTime}</TableCell>
                <TableCell><CustomsStatusBadge status={c.customsStatus} /></TableCell>
                <TableCell>
                  <button className="pcs-action-btn p-1.5 rounded-md" onClick={() => openDrawer("container", c)}><Eye className="h-3.5 w-3.5 text-teal-600" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-[11px] text-gray-500">Showing {Math.min(25, filteredContainers.length)} of {filteredContainers.length} containers</div>
    </div>
  )

  // ─── Tab 3: Berth Management ────────────────────────────
  const berthTab = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Input placeholder="Search berths, ports..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="h-8 text-xs" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-white dark:bg-gray-900">
          <option value="All">All Status</option>
          {["Occupied", "Available", "Under Maintenance", "Reserved"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ExportButton data={filteredBerths} filename="berths" />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table className="table-hover-highlight">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { key: "name", label: "Berth" }, { key: "port", label: "Port" }, { key: "type", label: "Type" },
                { key: "status", label: "Status" }, { key: "occupancy", label: "Occupancy" },
                { key: "currentVessel", label: "Current Vessel" }, { key: "operations", label: "Ops" },
                { key: "craneCount", label: "Cranes" }, { key: "movesPerHour", label: "Moves/hr" },
              ].map(col => (
                <TableHead key={col.key} className="text-[11px] pcs-sort-header" onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon field={col.key} sortBy={sortBy} />
                </TableHead>
              ))}
              <TableHead className="text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBerths.slice(0, 25).map(b => (
              <TableRow key={b.id} className="pcs-table-row">
                <TableCell className="text-xs font-medium">{b.name}</TableCell>
                <TableCell className="text-xs">{b.port}</TableCell>
                <TableCell><StatusBadge status={b.type} /></TableCell>
                <TableCell><StatusBadge status={b.status} /></TableCell>
                <TableCell><BerthOccupancyBar occupancy={b.occupancy} /></TableCell>
                <TableCell className="text-xs">{b.currentVessel || "—"}</TableCell>
                <TableCell className="text-xs">{b.operations}</TableCell>
                <TableCell className="text-xs text-center">{b.craneCount}</TableCell>
                <TableCell className="text-xs text-right">{b.movesPerHour}</TableCell>
                <TableCell>
                  <button className="pcs-action-btn p-1.5 rounded-md" onClick={() => openDrawer("berth", b)}><Eye className="h-3.5 w-3.5 text-teal-600" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-[11px] text-gray-500">Showing {Math.min(25, filteredBerths.length)} of {filteredBerths.length} berths</div>
    </div>
  )

  // ─── Tab 4: Documentation ──────────────────────────────
  const docTab = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Input placeholder="Search documents, vessels..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="h-8 text-xs" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-white dark:bg-gray-900">
          <option value="All">All Status</option>
          {DATA.DOC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ExportButton data={filteredDocs} filename="documents" />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table className="table-hover-highlight">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { key: "docNumber", label: "Doc No." }, { key: "type", label: "Type" }, { key: "status", label: "Status" },
                { key: "vessel", label: "Vessel" }, { key: "port", label: "Port" }, { key: "submittedBy", label: "Submitted By" },
                { key: "submittedDate", label: "Submitted" }, { key: "processedDate", label: "Processed" },
                { key: "amount", label: "Amount (₹)" }, { key: "remarks", label: "Remarks" },
              ].map(col => (
                <TableHead key={col.key} className="text-[11px] pcs-sort-header" onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon field={col.key} sortBy={sortBy} />
                </TableHead>
              ))}
              <TableHead className="text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.slice(0, 25).map(doc => (
              <TableRow key={doc.id} className="pcs-table-row">
                <TableCell className="text-xs font-mono font-medium">{doc.docNumber}</TableCell>
                <TableCell className="text-xs">{doc.type}</TableCell>
                <TableCell><StatusBadge status={doc.status} /></TableCell>
                <TableCell className="text-xs">{doc.vessel}</TableCell>
                <TableCell className="text-xs">{doc.port}</TableCell>
                <TableCell className="text-xs">{doc.submittedBy}</TableCell>
                <TableCell className="text-xs">{fmtDate(doc.submittedDate)}</TableCell>
                <TableCell className="text-xs">{fmtDate(doc.processedDate)}</TableCell>
                <TableCell className="numeric-cell text-xs text-right">{fmtINR(doc.amount)}</TableCell>
                <TableCell className="text-xs text-gray-500 dark:text-gray-400 max-w-[120px] truncate">{doc.remarks}</TableCell>
                <TableCell>
                  <button className="pcs-action-btn p-1.5 rounded-md" onClick={() => openDrawer("document", doc)}><Eye className="h-3.5 w-3.5 text-teal-600" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-[11px] text-gray-500">Showing {Math.min(25, filteredDocs.length)} of {filteredDocs.length} documents</div>
    </div>
  )

  // ─── Tab 5: Customs Clearance ───────────────────────────
  const clearanceTab = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Input placeholder="Search BE numbers, importers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="h-8 text-xs" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-white dark:bg-gray-900">
          <option value="All">All Risk</option>
          {["Low Risk", "Medium Risk", "High Risk"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ExportButton data={filteredClearances} filename="clearances" />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table className="table-hover-highlight">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { key: "beNumber", label: "BE Number" }, { key: "containerNo", label: "Container" }, { key: "importer", label: "Importer" },
                { key: "vessel", label: "Vessel" }, { key: "port", label: "Port" }, { key: "currentStage", label: "Stage" },
                { key: "riskStatus", label: "Risk" }, { key: "goodsValue", label: "Goods Value" },
                { key: "dutyAmount", label: "Duty (₹)" }, { key: "ieCode", label: "IEC" },
              ].map(col => (
                <TableHead key={col.key} className="text-[11px] pcs-sort-header" onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon field={col.key} sortBy={sortBy} />
                </TableHead>
              ))}
              <TableHead className="text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClearances.slice(0, 25).map(cl => (
              <TableRow key={cl.id} className="pcs-table-row">
                <TableCell className="text-xs font-mono font-medium">{cl.beNumber}</TableCell>
                <TableCell className="text-xs font-mono">{cl.containerNo}</TableCell>
                <TableCell className="text-xs font-medium">{cl.importer}</TableCell>
                <TableCell className="text-xs">{cl.vessel}</TableCell>
                <TableCell className="text-xs">{cl.port}</TableCell>
                <TableCell><ClearanceTracker stageIndex={cl.stageIndex} /></TableCell>
                <TableCell><StatusBadge status={cl.riskStatus} /></TableCell>
                <TableCell className="numeric-cell text-xs text-right">{fmtINR(cl.goodsValue)}</TableCell>
                <TableCell className="numeric-cell text-xs text-right">{fmtINR(cl.dutyAmount)}</TableCell>
                <TableCell className="text-xs font-mono">{cl.ieCode}</TableCell>
                <TableCell>
                  <button className="pcs-action-btn p-1.5 rounded-md" onClick={() => openDrawer("clearance", cl)}><Eye className="h-3.5 w-3.5 text-teal-600" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-[11px] text-gray-500">Showing {Math.min(25, filteredClearances.length)} of {filteredClearances.length} clearances</div>
    </div>
  )

  // ─── Tab content routing ───────────────────────────────
  const tabContent = [dashboardTab, vesselTab, containerTab, berthTab, docTab, clearanceTab]

  // ─── Drawer Renders ────────────────────────────────────
  const renderDrawer = () => {
    if (!drawerData) return null

    const drawerConfigs: Record<string, { title: string; gradient: string }> = {
      vessel: { title: "Vessel Details", gradient: "from-teal-600 to-sky-600" },
      container: { title: "Container Details", gradient: "from-sky-600 to-indigo-600" },
      berth: { title: "Berth Details", gradient: "from-coral-500 to-orange-600" },
      document: { title: "Document Details", gradient: "from-indigo-600 to-purple-600" },
      clearance: { title: "Customs Clearance Details", gradient: "from-emerald-600 to-teal-600" },
    }
    const cfg = drawerConfigs[drawerType] || { title: "Details", gradient: "from-teal-600 to-sky-600" }

    return (
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader>
            <div className={cn("h-24 -mx-6 -mt-6 mb-4 flex items-end px-6 pb-3 rounded-b-lg bg-gradient-to-r", cfg.gradient)}>
              <SheetTitle className="text-white text-sm">{cfg.title}</SheetTitle>
            </div>
            <SheetDescription className="text-xs text-gray-500 dark:text-gray-400">
              {drawerData.name || drawerData.containerNo || drawerData.docNumber || drawerData.beNumber || drawerData.id}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {/* Vessel Drawer */}
            {drawerType === "vessel" && drawerData && (
              <>
                <div className="flex items-center gap-2">
                  <VesselStatusRing status={drawerData.status} />
                  <div>
                    <div className="text-sm font-bold">{drawerData.name}</div>
                    <div className="text-xs text-gray-500">{drawerData.imo} • {drawerData.flag}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={drawerData.type} />
                  <span className="pcs-line-badge bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"><Ship className="h-3 w-3" />{drawerData.shippingLine}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">TEU Capacity</div>
                    <div className="text-sm font-bold" style={{ color: CC.teal }}>{drawerData.teuCapacity.toLocaleString()}</div>
                  </div>
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Gross Tonnage</div>
                    <div className="text-sm font-bold" style={{ color: CC.sky }}>{drawerData.grossTonnage.toLocaleString()}</div>
                  </div>
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Cargo (MT)</div>
                    <div className="text-sm font-bold" style={{ color: CC.coral }}>{drawerData.cargoWeight.toLocaleString()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Port</span><span className="font-medium">{drawerData.port}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Agent</span><span className="font-medium">{drawerData.agent}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Draft</span><span className="font-medium">{drawerData.depth}m</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">ETA</span><span className="font-medium">{fmtDateTime(drawerData.eta)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">ETD</span><span className="font-medium">{fmtDateTime(drawerData.etd)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Berthed</span><span className="font-medium">{fmtDateTime(drawerData.berthedAt)}</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Voyage record opened") }}>Voyage Log</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1 h-8 text-xs" onClick={() => { toast.success("Berth assigned") }}>Assign Berth</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { toast.success("Notified agent") }}><Radio className="h-3.5 w-3.5" /></Button>
                </div>
              </>
            )}

            {/* Container Drawer */}
            {drawerType === "container" && drawerData && (
              <>
                <div className="flex items-center gap-2">
                  <ContainerSizeBadge size={drawerData.size} />
                  <div>
                    <div className="text-sm font-bold font-mono">{drawerData.containerNo}</div>
                    <div className="text-xs text-gray-500">{drawerData.cargoType} • {drawerData.blNumber}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={drawerData.status} />
                  <CustomsStatusBadge status={drawerData.customsStatus} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Weight</div>
                    <div className="text-sm font-bold" style={{ color: CC.teal }}>{drawerData.weight.toLocaleString()} kg</div>
                  </div>
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Dwell Time</div>
                    <div className="text-sm font-bold" style={{ color: drawerData.dwellTime > 72 ? CC.coral : CC.emerald }}>{drawerData.dwellTime}h</div>
                  </div>
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Temp (°C)</div>
                    <div className="text-sm font-bold" style={{ color: CC.sky }}>{drawerData.temperature}°</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Port</span><span className="font-medium">{drawerData.port}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Vessel</span><span className="font-medium">{drawerData.vessel}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Origin</span><span className="font-medium">{drawerData.origin}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Destination</span><span className="font-medium">{drawerData.destination}</span></div>
                  <div className="flex justify-between col-span-2"><span className="text-gray-500">BL Number</span><span className="font-medium font-mono">{drawerData.blNumber}</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Tracking initiated") }}>Track</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1 h-8 text-xs" onClick={() => { toast.success("Gate pass generated") }}>Gate Pass</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { toast.success("Document downloaded") }}><Download className="h-3.5 w-3.5" /></Button>
                </div>
              </>
            )}

            {/* Berth Drawer */}
            {drawerType === "berth" && drawerData && (
              <>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30"><Anchor className="h-4 w-4 text-orange-600" /></div>
                  <div>
                    <div className="text-sm font-bold">{drawerData.name}</div>
                    <div className="text-xs text-gray-500">{drawerData.port}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={drawerData.status} />
                  <StatusBadge status={drawerData.type} />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs text-gray-500 mb-1">Occupancy</div>
                  <BerthOccupancyBar occupancy={drawerData.occupancy} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Cranes</div>
                    <div className="text-sm font-bold" style={{ color: CC.teal }}>{drawerData.craneCount}</div>
                  </div>
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Moves/hr</div>
                    <div className="text-sm font-bold" style={{ color: CC.sky }}>{drawerData.movesPerHour}</div>
                  </div>
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Depth (m)</div>
                    <div className="text-sm font-bold" style={{ color: CC.coral }}>{drawerData.depth}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Length</span><span className="font-medium">{drawerData.length}m</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Operations</span><span className="font-medium">{drawerData.operations}</span></div>
                  <div className="flex justify-between col-span-2"><span className="text-gray-500">Current Vessel</span><span className="font-medium">{drawerData.currentVessel || "None"}</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Berth allocated") }}>Allocate</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1 h-8 text-xs" onClick={() => { toast.success("Schedule updated") }}>Schedule</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { toast.success("Maintenance requested") }}><AlertTriangle className="h-3.5 w-3.5" /></Button>
                </div>
              </>
            )}

            {/* Document Drawer */}
            {drawerType === "document" && drawerData && (
              <>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30"><FileText className="h-4 w-4 text-indigo-600" /></div>
                  <div>
                    <div className="text-sm font-bold font-mono">{drawerData.docNumber}</div>
                    <div className="text-xs text-gray-500">Ref: {drawerData.referenceNo}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={drawerData.type} />
                  <StatusBadge status={drawerData.status} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Amount</div>
                    <div className="text-sm font-bold" style={{ color: CC.teal }}>{fmtINR(drawerData.amount)}</div>
                  </div>
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Submitted</div>
                    <div className="text-sm font-bold" style={{ color: CC.sky }}>{fmtDate(drawerData.submittedDate)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Vessel</span><span className="font-medium">{drawerData.vessel}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Port</span><span className="font-medium">{drawerData.port}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Submitted By</span><span className="font-medium">{drawerData.submittedBy}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Processed</span><span className="font-medium">{fmtDate(drawerData.processedDate)}</span></div>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs">
                  <div className="text-[10px] text-gray-500 mb-0.5">Remarks</div>
                  <div>{drawerData.remarks}</div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Approved successfully") }}>Approve</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1 h-8 text-xs" onClick={() => { toast.success("Request revision") }}>Revise</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { toast.success("Downloaded") }}><Download className="h-3.5 w-3.5" /></Button>
                </div>
              </>
            )}

            {/* Clearance Drawer */}
            {drawerType === "clearance" && drawerData && (
              <>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30"><ShieldCheck className="h-4 w-4 text-emerald-600" /></div>
                  <div>
                    <div className="text-sm font-bold font-mono">{drawerData.beNumber}</div>
                    <div className="text-xs text-gray-500">IEC: {drawerData.ieCode}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Clearance Progress</div>
                  <ClearanceTracker stageIndex={drawerData.stageIndex} />
                  <div className="text-xs font-medium" style={{ color: drawerData.stageIndex >= 4 ? CC.emerald : CC.amber }}>
                    Current: {drawerData.currentStage}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={drawerData.riskStatus} />
                  <span className="pcs-line-badge bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Truck className="h-3 w-3" />{drawerData.importer}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Goods Value</div>
                    <div className="text-sm font-bold" style={{ color: CC.teal }}>{fmtINR(drawerData.goodsValue)}</div>
                  </div>
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Duty</div>
                    <div className="text-sm font-bold" style={{ color: CC.coral }}>{fmtINR(drawerData.dutyAmount)}</div>
                  </div>
                  <div className="pcs-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Paid</div>
                    <div className="text-sm font-bold" style={{ color: drawerData.dutyPaid > 0 ? CC.emerald : CC.slate }}>{fmtINR(drawerData.dutyPaid)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Vessel</span><span className="font-medium">{drawerData.vessel}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Port</span><span className="font-medium">{drawerData.port}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Container</span><span className="font-medium font-mono">{drawerData.containerNo}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Assessment</span><span className="font-medium">{fmtDateTime(drawerData.assessmentDate)}</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Assessment completed") }}>Assess</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate flex-1 h-8 text-xs" onClick={() => { toast.success("Examination scheduled") }}>Examine</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { toast.success("Payment processed") }}><Banknote className="h-3.5 w-3.5" /></Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Port Community System" description="Indian port operations, vessel tracking, customs clearance and container management" />

      <Tabs value={String(activeTab)} onValueChange={v => { setActiveTab(Number(v)); setSearchTerm(""); setFilterStatus("All") }}>
        <TabsList className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg h-auto">
          {tabs.map((tab, i) => (
            <TabsTrigger key={i} value={String(i)} className={cn("text-xs px-3 py-1.5 rounded-md", activeTab === i && "pcs-tab-active")}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {tabContent[activeTab]}
      {renderDrawer()}
    </div>
  )
}
