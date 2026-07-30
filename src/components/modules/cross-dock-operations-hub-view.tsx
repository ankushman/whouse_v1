"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Eye, Search, ArrowUpDown, Package, Truck, Clock, Gauge,
  Activity, TrendingUp, BarChart3, Users, MapPin, AlertTriangle,
} from "lucide-react"

// Enums & Constants
const INBOUND_STATUSES = [
  "Arriving", "At Gate", "Unloading", "Quality Check",
  "Sorted", "Consolidated", "Completed", "Rejected",
] as const

const DOCK_TYPES = [
  "Standard", "Refrigerated", "Hazardous", "Oversized", "Express", "Returns",
] as const

const DOCK_STATUSES = [
  "Available", "Occupied", "Reserved", "Maintenance", "Cleaning", "Blocked",
] as const

const SORT_PRIORITIES = [
  "Emergency", "High", "Medium", "Low", "Batch",
] as const

const SORT_STATUSES = [
  "Pending", "In Progress", "Completed", "On Hold", "Rerouted", "Cancelled",
] as const

const OUTBOUND_STATUSES = [
  "Staged", "Loading", "Dispatched", "In Transit",
  "Delivered", "Delayed", "Returned", "Cancelled",
] as const

const CARRIER_NAMES = [
  "Delhivery Express", "Blue Dart", "DTDC Surface", "Ecom Express",
  "Xpressbees", "Shadowfax", "Spoton", "VRL Logistics",
  "TCI Express", "Gati Ltd",
] as const

const INDIAN_WAREHOUSES = [
  "Mumbai Cross-Dock", "Delhi NCR Hub", "Bangalore Sort Center",
  "Chennai Terminal", "Hyderabad Transfer", "Pune Express",
  "Kolkata Gateway", "Ahmedabad Junction", "Jaipur Transit",
  "Lucknow Hub", "Nagpur Center", "Indore Point",
] as const

const PRODUCT_CATEGORIES = [
  "Electronics", "Apparel", "FMCG", "Pharma",
  "Auto Parts", "Food & Bev", "Home & Garden", "Industrial",
] as const

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune",
  "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Nagpur", "Indore",
  "Coimbatore", "Surat", "Bhopal",
] as const

const INDIAN_WORKERS = [
  "Rajesh Kumar", "Amit Singh", "Priya Sharma", "Vikram Patel",
  "Sunita Devi", "Arjun Reddy", "Kavitha Nair", "Manoj Gupta",
  "Deepak Verma", "Anita Kumari", "Suresh Menon", "Pooja Rani",
  "Rahul Joshi", "Meena Devi", "Sanjay Mishra",
] as const

const VEH_STATES = ["MH", "DL", "KA", "TN", "TS", "GJ", "WB", "RJ", "UP", "MP"] as const

const THEME = {
  orange: "#ea580c",
  cyan: "#0891b2",
  emerald: "#059669",
  violet: "#7c3aed",
  rose: "#e11d48",
  blue: "#3b82f6",
}
const CARRIER_COLORS = [
  THEME.orange, THEME.blue, "#dc2626", THEME.violet, THEME.cyan,
  THEME.emerald, THEME.rose, "#d97706", "#6366f1", "#14b8a6",
]

// PRNG & Helpers
function seededRandom(seed: number): number {
  const s = Math.abs(seed) || 1
  return ((s * 16807 + 7) % 2147483647) / 2147483647
}

function ri(min: number, max: number, seed: number): number {
  return min + seededRandom(seed) * (max - min)
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.floor(ri(0, arr.length, seed))]
}

function fmtINR(v: number): string {
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`
  return `₹${v.toLocaleString("en-IN")}`
}

function genVehicle(i: number): string {
  const st = pick(VEH_STATES, i + 6)
  const num = String(Math.floor(ri(10, 99, i + 7))).padStart(2, "0")
  const ch = String.fromCharCode(65 + Math.floor(ri(0, 26, i + 8)))
  const ch2 = String.fromCharCode(65 + Math.floor(ri(0, 26, i + 9)))
  const tail = String(Math.floor(ri(1000, 9999, i + 10)))
  return `${st}-${num}-${ch}${ch2}-${tail}`
}

// Sort & Filter (exact required pattern)
let statusFilter = "all"
let searchQ = ""

const sortedData = <T,>(data: T[], field: string, dir: string): T[] => {
  if (!field) return data
  return [...data].sort((a, b) => {
    const recA = a as unknown as Record<string, string | number>
    const recB = b as unknown as Record<string, string | number>
    const av = recA[field] ?? ""
    const bv = recB[field] ?? ""
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return dir === "asc" ? cmp : -cmp
  })
}

const filterData = <T,>(data: T[], statusKey: string, searchKeys?: string[]): T[] => {
  return data.filter((item) => {
    const rec = item as unknown as Record<string, string | number>
    if (statusFilter !== "all" && rec[statusKey] !== statusFilter) return false
    if (searchQ) {
      const q = searchQ.toLowerCase()
      const keys = searchKeys ?? Object.keys(rec)
      return keys.some((k) => String(rec[k]).toLowerCase().includes(q))
    }
    return true
  })
}

// 16+ Unique Visual Components

/** InboundStatusBadge: 8-tier with pulses on Arriving/At Gate/Unloading/Rejected */
function InboundStatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Arriving: "bg-blue-500/15 text-blue-600",
    "At Gate": "bg-amber-500/15 text-amber-600",
    Unloading: "bg-orange-500/15 text-orange-600",
    "Quality Check": "bg-violet-500/15 text-violet-600",
    Sorted: "bg-cyan-500/15 text-cyan-600",
    Consolidated: "bg-emerald-500/15 text-emerald-600",
    Completed: "bg-emerald-600/15 text-emerald-700",
    Rejected: "bg-rose-500/15 text-rose-600",
  }
  const pulse = ["Arriving", "At Gate", "Unloading", "Rejected"].includes(status)
  return (
    <span
      className={`cdh-inbound-badge inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m[status] || "bg-gray-100 text-gray-600"}${pulse ? " animate-pulse" : ""}`}
    >
      {status}
    </span>
  )
}

/** DockTypeBadge: 6 types with emoji indicators */
function DockTypeBadge({ type }: { type: string }) {
  const emoji: Record<string, string> = {
    Standard: "📦", Refrigerated: "❄️", Hazardous: "⚠️",
    Oversized: "📏", Express: "⚡", Returns: "🔄",
  }
  return (
    <span className="cdh-dock-type inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {emoji[type] || ""} {type}
    </span>
  )
}

/** DockStatusBadge: 6-tier with pulse on Occupied/Maintenance */
function DockStatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Available: "bg-emerald-500/15 text-emerald-600",
    Occupied: "bg-amber-500/15 text-amber-600",
    Reserved: "bg-blue-500/15 text-blue-600",
    Maintenance: "bg-rose-500/15 text-rose-600",
    Cleaning: "bg-cyan-500/15 text-cyan-600",
    Blocked: "bg-gray-500/15 text-gray-600",
  }
  const pulse = ["Occupied", "Maintenance"].includes(status)
  return (
    <span
      className={`cdh-dock-status inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m[status] || ""}${pulse ? " animate-pulse" : ""}`}
    >
      {status}
    </span>
  )
}

/** CarrierBadge: 10 Indian logistics carriers with unique colors */
function CarrierBadge({ name }: { name: string }) {
  const colors = [
    "bg-orange-500/15 text-orange-600", "bg-blue-500/15 text-blue-600",
    "bg-rose-500/15 text-rose-600", "bg-violet-500/15 text-violet-600",
    "bg-cyan-500/15 text-cyan-600", "bg-emerald-500/15 text-emerald-600",
    "bg-amber-500/15 text-amber-600", "bg-indigo-500/15 text-indigo-600",
    "bg-teal-500/15 text-teal-600", "bg-pink-500/15 text-pink-600",
  ]
  const idx = CARRIER_NAMES.indexOf(name as typeof CARRIER_NAMES[number])
  return (
    <span className={`cdh-carrier inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[Math.max(0, idx)]}`}>
      {name}
    </span>
  )
}

/** PriorityBadge: 5-tier with Emergency red pulse */
function PriorityBadge({ level }: { level: string }) {
  const m: Record<string, string> = {
    Emergency: "bg-rose-600 text-white",
    High: "bg-orange-500 text-white",
    Medium: "bg-amber-500 text-white",
    Low: "bg-slate-400 text-white",
    Batch: "bg-violet-500/15 text-violet-600",
  }
  const pulse = level === "Emergency"
  return (
    <span className={`cdh-priority inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${m[level] || ""}${pulse ? " animate-pulse" : ""}`}>
      {level}
    </span>
  )
}

/** CategoryBadge: 8 product categories */
function CategoryBadge({ cat }: { cat: string }) {
  const m: Record<string, string> = {
    Electronics: "bg-blue-500/15 text-blue-600",
    Apparel: "bg-pink-500/15 text-pink-600",
    FMCG: "bg-amber-500/15 text-amber-600",
    Pharma: "bg-emerald-500/15 text-emerald-600",
    "Auto Parts": "bg-slate-500/15 text-slate-600",
    "Food & Bev": "bg-orange-500/15 text-orange-600",
    "Home & Garden": "bg-cyan-500/15 text-cyan-600",
    Industrial: "bg-violet-500/15 text-violet-600",
  }
  return (
    <span className={`cdh-category inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${m[cat] || "bg-gray-100 text-gray-600"}`}>
      {cat}
    </span>
  )
}

/** SortStatusBadge: 6-tier with pulse on In Progress/On Hold */
function SortStatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Pending: "bg-slate-400/15 text-slate-600",
    "In Progress": "bg-cyan-500/15 text-cyan-600",
    Completed: "bg-emerald-500/15 text-emerald-600",
    "On Hold": "bg-amber-500/15 text-amber-600",
    Rerouted: "bg-violet-500/15 text-violet-600",
    Cancelled: "bg-rose-500/15 text-rose-600",
  }
  const pulse = ["In Progress", "On Hold"].includes(status)
  return (
    <span className={`cdh-sort-status inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m[status] || ""}${pulse ? " animate-pulse" : ""}`}>
      {status}
    </span>
  )
}

/** OutboundStatusBadge: 8-tier with pulse on Staged/Loading/Dispatched/Delayed/Returned */
function OutboundStatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Staged: "bg-blue-500/15 text-blue-600",
    Loading: "bg-orange-500/15 text-orange-600",
    Dispatched: "bg-cyan-500/15 text-cyan-600",
    "In Transit": "bg-violet-500/15 text-violet-600",
    Delivered: "bg-emerald-500/15 text-emerald-600",
    Delayed: "bg-amber-500/15 text-amber-600",
    Returned: "bg-rose-500/15 text-rose-600",
    Cancelled: "bg-gray-500/15 text-gray-600",
  }
  const pulse = ["Staged", "Loading", "Dispatched", "Delayed", "Returned"].includes(status)
  return (
    <span className={`cdh-outbound-status inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m[status] || ""}${pulse ? " animate-pulse" : ""}`}>
      {status}
    </span>
  )
}

/** WeightTile: kg formatted with Indian locale */
function WeightTile({ w }: { w: number }) {
  return <span className="cdh-weight-tile text-xs text-muted-foreground">{w.toLocaleString("en-IN")} kg</span>
}

/** DurationTile: converts minutes to h m display */
function DurationTile({ d }: { d: number }) {
  const h = Math.floor(d / 60)
  return (
    <span className="cdh-duration-tile text-xs text-muted-foreground">
      {h > 0 ? `${h}h ` : ""}{d % 60}m
    </span>
  )
}

/** PalletTile */
function PalletTile({ p }: { p: number }) {
  return <span className="cdh-pallet-tile text-xs text-muted-foreground">{p} pallets</span>
}

/** ThroughputTile: units/hr */
function ThroughputTile({ t }: { t: number }) {
  return <span className="cdh-throughput-tile text-xs text-muted-foreground">{t} units/hr</span>
}

/** DwellTimeTile: conditional coloring */
function DwellTimeTile({ d }: { d: number }) {
  const color = d > 120 ? "text-rose-600" : d > 60 ? "text-amber-600" : "text-emerald-600"
  return <span className={`cdh-dwell-tile text-xs font-medium ${color}`}>{d} min</span>
}

/** ValueTile: INR with Lakh/Crore notation */
function ValueTile({ v }: { v: number }) {
  return <span className="cdh-value-tile text-xs font-semibold text-emerald-600">{fmtINR(v)}</span>
}

/** WorkerBadge: Indian worker name with user icon */
function WorkerBadge({ name }: { name: string }) {
  return (
    <span className="cdh-worker inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-xs text-violet-600">
      <Users className="h-3 w-3" />{name}
    </span>
  )
}

/** LaneBadge: dashed border mono font */
function LaneBadge({ lane }: { lane: string }) {
  return (
    <span className="cdh-lane inline-flex items-center rounded-md border border-dashed border-slate-300 px-2 py-0.5 text-xs font-mono text-slate-600">
      Lane {lane}
    </span>
  )
}

// Data Generation
interface InboundRec {
  id: string; carrier: string; origin: string; warehouse: string
  status: string; eta: string; vehicle: string; pallets: number
  weight: number; category: string; priority: string
}
interface DockRec {
  id: string; type: string; status: string; shipment: string
  carrier: string; warehouse: string; occupancy: number
  throughput: number; worker: string
}
interface SortRec {
  id: string; orderId: string; source: string; dest: string
  category: string; priority: string; status: string; items: number
  weight: number; lane: string; worker: string; start: string
  duration: number
}
interface OutboundRec {
  id: string; carrier: string; destination: string; origin: string
  status: string; vehicle: string; driver: string; departure: string
  eta: string; pallets: number; weight: number; value: number
  tracking: string
}

function genInbound(): InboundRec[] {
  return Array.from({ length: 75 }, (_, i) => ({
    id: `INB-${String(i + 1).padStart(4, "0")}`,
    carrier: pick(CARRIER_NAMES, i) as string,
    origin: pick(INDIAN_CITIES, i + 1) as string,
    warehouse: pick(INDIAN_WAREHOUSES, i + 2) as string,
    status: pick(INBOUND_STATUSES, i + 3) as string,
    eta: `${String(Math.floor(ri(6, 23, i + 4))).padStart(2, "0")}:${String(Math.floor(ri(0, 59, i + 5))).padStart(2, "0")}`,
    vehicle: genVehicle(i),
    pallets: Math.floor(ri(2, 48, i + 11)),
    weight: Math.floor(ri(200, 8000, i + 12)),
    category: pick(PRODUCT_CATEGORIES, i + 13) as string,
    priority: pick(SORT_PRIORITIES, i + 14) as string,
  }))
}

function genDocks(): DockRec[] {
  const ib = genInbound()
  return Array.from({ length: 70 }, (_, i) => ({
    id: `D-${String(i + 1).padStart(2, "0")}`,
    type: pick(DOCK_TYPES, i) as string,
    status: pick(DOCK_STATUSES, i + 1) as string,
    shipment: ib[i % 75].id,
    carrier: pick(CARRIER_NAMES, i + 3) as string,
    warehouse: pick(INDIAN_WAREHOUSES, i + 4) as string,
    occupancy: Math.floor(ri(10, 480, i + 5)),
    throughput: Math.floor(ri(40, 320, i + 6)),
    worker: pick(INDIAN_WORKERS, i + 7) as string,
  }))
}

function genSorts(): SortRec[] {
  const ib = genInbound()
  return Array.from({ length: 65 }, (_, i) => {
    const st = Math.floor(ri(6, 22, i + 3))
    return {
      id: `STK-${String(i + 1).padStart(4, "0")}`,
      orderId: `ORD-${String(Math.floor(ri(10000, 99999, i + 1))).padStart(5, "0")}`,
      source: ib[i % 75].id,
      dest: pick(INDIAN_WAREHOUSES, i + 3) as string,
      category: pick(PRODUCT_CATEGORIES, i + 4) as string,
      priority: pick(SORT_PRIORITIES, i + 5) as string,
      status: pick(SORT_STATUSES, i + 6) as string,
      items: Math.floor(ri(5, 200, i + 7)),
      weight: Math.floor(ri(10, 2000, i + 8)),
      lane: `L-${String(Math.floor(ri(1, 24, i + 9))).padStart(2, "0")}`,
      worker: pick(INDIAN_WORKERS, i + 10) as string,
      start: `${String(st).padStart(2, "0")}:${String(Math.floor(ri(0, 59, i + 11))).padStart(2, "0")}`,
      duration: Math.floor(ri(8, 180, i + 12)),
    }
  })
}

function genOutbound(): OutboundRec[] {
  return Array.from({ length: 55 }, (_, i) => {
    const dep = Math.floor(ri(6, 22, i + 3))
    return {
      id: `OUT-${String(i + 1).padStart(4, "0")}`,
      carrier: pick(CARRIER_NAMES, i) as string,
      destination: pick(INDIAN_CITIES, i + 1) as string,
      origin: pick(INDIAN_WAREHOUSES, i + 2) as string,
      status: pick(OUTBOUND_STATUSES, i + 3) as string,
      vehicle: genVehicle(i + 50),
      driver: pick(INDIAN_WORKERS, i + 9) as string,
      departure: `${String(dep).padStart(2, "0")}:${String(Math.floor(ri(0, 59, i + 10))).padStart(2, "0")}`,
      eta: `${String(Math.min(23, dep + Math.floor(ri(2, 8, i + 11)))).padStart(2, "0")}:${String(Math.floor(ri(0, 59, i + 12))).padStart(2, "0")}`,
      pallets: Math.floor(ri(1, 40, i + 13)),
      weight: Math.floor(ri(150, 6000, i + 14)),
      value: Math.floor(ri(50000, 5000000, i + 15)),
      tracking: `TRK${String(Math.floor(ri(1e8, 9e8, i + 16)))}`,
    }
  })
}

// Shared UI Helpers
function GradientHeader({ gradient, title, subtitle }: { gradient: string; title: string; subtitle?: string }) {
  return (
    <div className={`cdh-sheet-header bg-gradient-to-r ${gradient} rounded-lg p-5 mb-4`}>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {subtitle && <p className="text-sm text-white/80 mt-1">{subtitle}</p>}
    </div>
  )
}

function FilterButtons({ items, value, onChange }: { items: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {(["all", ...items] as string[]).map((s) => (
        <Button key={s} size="sm" variant={value === s ? "default" : "outline"} onClick={() => onChange(s)}>
          {s === "all" ? "All" : s}
        </Button>
      ))}
    </div>
  )
}

function StatusStrip({ data, statusKey }: { data: Record<string, unknown>[]; statusKey: string }) {
  const counts = data.reduce<Record<string, number>>((acc, item) => {
    const rec = item as unknown as Record<string, string | number>
    const val = String(rec[statusKey])
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})
  return (
    <div className="cdh-status-strip flex flex-wrap gap-2 mb-4">
      {Object.entries(counts).map(([status, count]) => (
        <span key={status} className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-current opacity-60" />
          {status}: <span className="font-bold">{count}</span>
        </span>
      ))}
    </div>
  )
}

// Main Component
export default function CrossDockOperationsHubView() {
  const [activeTab, setActiveTab] = useState("0")
  const { toast } = useToast()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selInbound, setSelInbound] = useState<InboundRec | null>(null)
  const [selOutbound, setSelOutbound] = useState<OutboundRec | null>(null)
  const [selSort, setSelSort] = useState<SortRec | null>(null)
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState("asc")

  // Tab-specific filters
  const [ibFilter, setIbFilter] = useState("all")
  const [dkFilter, setDkFilter] = useState("all")
  const [stFilter, setStFilter] = useState("all")
  const [obFilter, setObFilter] = useState("all")
  const [ibSearch, setIbSearch] = useState("")
  const [stSearch, setStSearch] = useState("")
  const [obSearch, setObSearch] = useState("")

  // Memoized datasets
  const ibData = useMemo(() => genInbound(), [])
  const dkData = useMemo(() => genDocks(), [])
  const stData = useMemo(() => genSorts(), [])
  const obData = useMemo(() => genOutbound(), [])

  const handleSort = (field: string) => {
    setSortField(field)
    setSortDir((d) => (d === "asc" ? "desc" : "asc"))
  }

  // Set module-level filter vars, then compute filtered/sorted results
  const ibFiltered = useMemo(() => {
    statusFilter = ibFilter; searchQ = ibSearch
    return sortedData(filterData(ibData, "status", ["id", "carrier", "origin", "warehouse", "vehicle"]), sortField, sortDir)
  }, [ibData, ibFilter, ibSearch, sortField, sortDir])

  const dkFiltered = useMemo(() => {
    statusFilter = dkFilter; searchQ = ""
    return filterData(dkData, "status", ["id", "shipment", "carrier", "worker"])
  }, [dkData, dkFilter])

  const stFiltered = useMemo(() => {
    statusFilter = stFilter; searchQ = stSearch
    return sortedData(filterData(stData, "status", ["id", "orderId", "source", "dest", "worker"]), sortField, sortDir)
  }, [stData, stFilter, stSearch, sortField, sortDir])

  const obFiltered = useMemo(() => {
    statusFilter = obFilter; searchQ = obSearch
    return sortedData(filterData(obData, "status", ["id", "carrier", "destination", "origin", "vehicle", "driver", "tracking"]), sortField, sortDir)
  }, [obData, obFilter, obSearch, sortField, sortDir])

  // Chart data
  const hrThroughput = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      hour: `${6 + i}:00`,
      inbound: Math.floor(ri(80, 350, i + 200)),
      outbound: Math.floor(ri(60, 280, i + 300)),
    })), [])

  const carrierDist = useMemo(() =>
    CARRIER_NAMES.map((c, i) => ({ name: c, value: Math.floor(ri(20, 200, i + 500)) })), [])

  const dockUtil = useMemo(() =>
    INDIAN_WAREHOUSES.map((w, i) => ({
      name: w.split(" ")[0],
      utilization: Math.floor(ri(40, 98, i + 700)),
    })), [])

  const dailyTrend = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      day: `Day ${i + 1}`,
      inbound: Math.floor(ri(400, 1200, i + 800)),
      outbound: Math.floor(ri(350, 1100, i + 900)),
    })), [])

  const whPerf = useMemo(() =>
    INDIAN_WAREHOUSES.map((w, i) => ({
      name: w.split(" ")[0],
      score: Math.floor(ri(60, 99, i + 1000)),
    })), [])

  const carPerf = useMemo(() =>
    CARRIER_NAMES.map((c, i) => ({
      name: c,
      onTime: Math.floor(ri(70, 99, i + 1100)),
    })), [])

  const costTrend = useMemo(() =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
      month: m,
      labor: Math.floor(ri(80, 200, i + 1200)),
      equipment: Math.floor(ri(40, 120, i + 1300)),
      space: Math.floor(ri(30, 80, i + 1400)),
      overhead: Math.floor(ri(20, 60, i + 1500)),
    })), [])

  // KPI data arrays
  const dashKpis = [
    { l: "Total Inbound Today", v: "75", I: Truck, c: THEME.orange },
    { l: "Docks in Use", v: "48", I: Package, c: THEME.cyan },
    { l: "Sort Queue", v: "23", I: Activity, c: THEME.violet },
    { l: "Outbound Ready", v: "34", I: TrendingUp, c: THEME.emerald },
    { l: "Avg Dwell Time", v: "42 min", I: Clock, c: THEME.rose },
    { l: "Throughput", v: "245 units/hr", I: Gauge, c: THEME.blue },
    { l: "Dock Utilization", v: "78%", I: BarChart3, c: THEME.orange },
    { l: "Orders Processed", v: "1,247", I: Package, c: THEME.emerald },
  ]
  const analyticsKpis = [
    { l: "Dwell Time Index", v: "0.82", I: Clock, c: THEME.orange },
    { l: "Sort Accuracy", v: "97.3%", I: Activity, c: THEME.cyan },
    { l: "Dock Turnover", v: "4.2x/day", I: Gauge, c: THEME.emerald },
    { l: "Labor Efficiency", v: "89%", I: Users, c: THEME.violet },
    { l: "Carrier On-Time %", v: "94.1%", I: Truck, c: THEME.rose },
    { l: "Cost per Unit", v: "₹12.40", I: TrendingUp, c: THEME.blue },
    { l: "Volume Growth %", v: "+14.7%", I: BarChart3, c: THEME.orange },
    { l: "Error Rate", v: "1.2%", I: Package, c: THEME.emerald },
  ]

  return (
    <div className="cdh-root space-y-6">
      <PageHeader
        title="Cross-Dock Operations Hub"
        description="Real-time management of cross-docking operations across 12 Indian warehouses"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="0"><Gauge className="mr-1 h-4 w-4" />Dashboard</TabsTrigger>
          <TabsTrigger value="1"><Truck className="mr-1 h-4 w-4" />Inbound</TabsTrigger>
          <TabsTrigger value="2"><Package className="mr-1 h-4 w-4" />Docks</TabsTrigger>
          <TabsTrigger value="3"><Activity className="mr-1 h-4 w-4" />Sorting</TabsTrigger>
          <TabsTrigger value="4"><Truck className="mr-1 h-4 w-4" />Outbound</TabsTrigger>
          <TabsTrigger value="5"><BarChart3 className="mr-1 h-4 w-4" />Analytics</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* Tab 0 — Cross-Dock Dashboard                                   */}
        {/* ============================================================ */}
        <TabsContent value="0">
          <div className="cdh-dashboard grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashKpis.map((k) => (
              <Card key={k.l}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{k.l}</CardTitle>
                  <k.I className="h-4 w-4" style={{ color: k.c }} />
                </CardHeader>
                <CardContent><span className="text-2xl font-bold">{k.v}</span></CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Inbound Pipeline Status</h4>
            <StatusStrip data={ibData as unknown as Record<string, unknown>[]} statusKey="status" />
          </div>
          <div className="cdh-charts mt-2 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle className="text-sm">Hourly Throughput (Stacked)</CardTitle></CardHeader>
              <CardContent>
                <AreaChart data={hrThroughput} height={260}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="inbound" stackId="a" fill={THEME.orange} />
                  <Area type="monotone" dataKey="outbound" stackId="a" fill={THEME.cyan} />
                </AreaChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Carrier Distribution</CardTitle></CardHeader>
              <CardContent className="flex justify-center">
                <PieChart width={260} height={260}>
                  <Pie data={carrierDist} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" paddingAngle={2}
                    label={({ name, percent }: { name: string; percent: number }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}>
                    {carrierDist.map((_, i) => <Cell key={i} fill={CARRIER_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Dock Utilization by Warehouse</CardTitle></CardHeader>
              <CardContent>
                <BarChart data={dockUtil} height={260}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="utilization" fill={THEME.blue} radius={[4, 4, 0, 0]} />
                </BarChart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/* Tab 1 — Inbound Schedule                                        */}
        {/* ============================================================ */}
        <TabsContent value="1">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search shipments..." value={ibSearch} onChange={(e) => setIbSearch(e.target.value)} className="pl-8" />
            </div>
            <FilterButtons items={INBOUND_STATUSES} value={ibFilter} onChange={setIbFilter} />
          </div>
          <Card>
            <CardContent className="p-0 max-h-[540px] overflow-y-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="cursor-pointer select-none text-xs" onClick={() => handleSort("id")}><div className="flex items-center gap-1">Shipment<ArrowUpDown className="h-3 w-3" /></div></TableHead>
                  <TableHead className="cursor-pointer select-none text-xs" onClick={() => handleSort("carrier")}><div className="flex items-center gap-1">Carrier<ArrowUpDown className="h-3 w-3" /></div></TableHead>
                  <TableHead className="text-xs">Origin</TableHead>
                  <TableHead className="text-xs">Warehouse</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">ETA</TableHead>
                  <TableHead className="text-xs">Vehicle Reg</TableHead>
                  <TableHead className="text-xs">Pallets</TableHead>
                  <TableHead className="text-xs">Weight</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Priority</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {ibFiltered.map((row) => {
                    const r = row as unknown as Record<string, string | number>
                    return (
                      <TableRow key={r.id as string}>
                        <TableCell className="font-mono text-xs">{r.id}</TableCell>
                        <TableCell><CarrierBadge name={r.carrier as string} /></TableCell>
                        <TableCell className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{r.origin}</TableCell>
                        <TableCell className="text-xs">{r.warehouse}</TableCell>
                        <TableCell><InboundStatusBadge status={r.status as string} /></TableCell>
                        <TableCell className="text-xs font-mono">{r.eta}</TableCell>
                        <TableCell className="text-xs font-mono">{r.vehicle}</TableCell>
                        <TableCell><PalletTile p={r.pallets as number} /></TableCell>
                        <TableCell><WeightTile w={r.weight as number} /></TableCell>
                        <TableCell><CategoryBadge cat={r.category as string} /></TableCell>
                        <TableCell><PriorityBadge level={r.priority as string} /></TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => {
                            setSelInbound(ibData.find((x) => x.id === r.id as string) || null)
                            setSheetOpen(true)
                            toast.info("Shipment Detail", `Viewing ${r.id}`)
                          }}><Eye className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* Tab 2 — Dock Management                                        */}
        {/* ============================================================ */}
        <TabsContent value="2">
          <div className="mb-4 flex flex-wrap gap-2">
            <FilterButtons items={DOCK_STATUSES} value={dkFilter} onChange={setDkFilter} />
          </div>
          <StatusStrip data={dkData as unknown as Record<string, unknown>[]} statusKey="status" />
          <Card>
            <CardContent className="p-0 max-h-[540px] overflow-y-auto">
              <Table>
                <TableHeader><TableRow>
                  {["Door ID", "Type", "Status", "Current Shipment", "Carrier", "Warehouse", "Occupancy", "Throughput", "Assigned Worker"].map((h) => (
                    <TableHead key={h} className="text-xs">{h}</TableHead>
                  ))}
                </TableRow></TableHeader>
                <TableBody>
                  {dkFiltered.map((row) => {
                    const r = row as unknown as Record<string, string | number>
                    return (
                      <TableRow key={r.id as string}>
                        <TableCell className="font-mono font-bold text-xs">{r.id}</TableCell>
                        <TableCell><DockTypeBadge type={r.type as string} /></TableCell>
                        <TableCell><DockStatusBadge status={r.status as string} /></TableCell>
                        <TableCell className="font-mono text-xs">{r.shipment}</TableCell>
                        <TableCell><CarrierBadge name={r.carrier as string} /></TableCell>
                        <TableCell className="text-xs">{r.warehouse}</TableCell>
                        <TableCell><DurationTile d={r.occupancy as number} /></TableCell>
                        <TableCell><ThroughputTile t={r.throughput as number} /></TableCell>
                        <TableCell><WorkerBadge name={r.worker as string} /></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* Tab 3 — Sorting & Consolidation                                  */}
        {/* ============================================================ */}
        <TabsContent value="3">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." value={stSearch} onChange={(e) => setStSearch(e.target.value)} className="pl-8" />
            </div>
            <FilterButtons items={SORT_STATUSES} value={stFilter} onChange={setStFilter} />
          </div>
          {/* High-priority task cards */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-4 w-4" />High-Priority Tasks
            </h4>
            <div className="grid gap-2">
              {stData.filter((t) => t.priority === "Emergency" || t.priority === "High").slice(0, 4).map((t) => (
                <Card key={t.id} className="cdh-priority-card border-l-4" style={{ borderLeftColor: t.priority === "Emergency" ? THEME.rose : THEME.orange }}>
                  <CardContent className="flex flex-wrap items-center gap-3 p-3">
                    <span className="font-mono text-xs font-bold">{t.id}</span>
                    <PriorityBadge level={t.priority} /><CategoryBadge cat={t.category} /><SortStatusBadge status={t.status} />
                    <LaneBadge lane={t.lane} /><WorkerBadge name={t.worker} />
                    <span className="ml-auto text-xs text-muted-foreground">{t.items} items</span>
                    <Button size="sm" variant="ghost" onClick={() => { setSelSort(t); setSheetOpen(true) }}><Eye className="h-4 w-4" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Card>
            <CardContent className="p-0 max-h-[420px] overflow-y-auto">
              <Table>
                <TableHeader><TableRow>
                  {[
                    ["id", "Task ID", true], ["orderId", "Order ID", true], ["source", "Source", false],
                    ["dest", "Destination", false], ["category", "Category", false], ["priority", "Priority", false],
                    ["status", "Status", false], ["items", "Items", true], ["weight", "Weight", false],
                    ["lane", "Sort Lane", false], ["worker", "Worker", false], ["start", "Start", false],
                    ["duration", "Duration", true],
                  ].map(([key, label, sortable]) => (
                    <TableHead key={key as string} className={`text-xs${sortable ? " cursor-pointer select-none" : ""}`} onClick={() => sortable && handleSort(key as string)}>
                      <div className="flex items-center gap-1">{label}{sortable && <ArrowUpDown className="h-3 w-3" />}</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {stFiltered.map((row) => {
                    const r = row as unknown as Record<string, string | number>
                    return (
                      <TableRow key={r.id as string}>
                        <TableCell className="font-mono text-xs">{r.id}</TableCell>
                        <TableCell className="font-mono text-xs">{r.orderId}</TableCell>
                        <TableCell className="font-mono text-xs">{r.source}</TableCell>
                        <TableCell className="text-xs">{r.dest}</TableCell>
                        <TableCell><CategoryBadge cat={r.category as string} /></TableCell>
                        <TableCell><PriorityBadge level={r.priority as string} /></TableCell>
                        <TableCell><SortStatusBadge status={r.status as string} /></TableCell>
                        <TableCell className="text-xs">{r.items}</TableCell>
                        <TableCell><WeightTile w={r.weight as number} /></TableCell>
                        <TableCell><LaneBadge lane={r.lane as string} /></TableCell>
                        <TableCell><WorkerBadge name={r.worker as string} /></TableCell>
                        <TableCell className="text-xs font-mono">{r.start}</TableCell>
                        <TableCell><DurationTile d={r.duration as number} /></TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => { setSelSort(stData.find((x) => x.id === r.id as string) || null); setSheetOpen(true) }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* Tab 4 — Outbound Dispatch                                       */}
        {/* ============================================================ */}
        <TabsContent value="4">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search outbound..." value={obSearch} onChange={(e) => setObSearch(e.target.value)} className="pl-8" />
            </div>
            <FilterButtons items={OUTBOUND_STATUSES} value={obFilter} onChange={setObFilter} />
          </div>
          <StatusStrip data={obData as unknown as Record<string, unknown>[]} statusKey="status" />
          <Card>
            <CardContent className="p-0 max-h-[540px] overflow-y-auto">
              <Table>
                <TableHeader><TableRow>
                  {["id", "carrier", "destination", "origin", "status", "vehicle", "driver", "departure", "eta", "pallets", "weight", "value", "tracking"].map((h) => (
                    <TableHead key={h} className="text-xs cursor-pointer select-none" onClick={() => handleSort(h)}>
                      <div className="flex items-center gap-1">{h === "id" ? "Shipment" : h === "destination" ? "Dest" : h.charAt(0).toUpperCase() + h.slice(1)}<ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                  ))}
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {obFiltered.map((row) => {
                    const r = row as unknown as Record<string, string | number>
                    return (
                      <TableRow key={r.id as string}>
                        <TableCell className="font-mono text-xs">{r.id}</TableCell>
                        <TableCell><CarrierBadge name={r.carrier as string} /></TableCell>
                        <TableCell className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{r.destination}</TableCell>
                        <TableCell className="text-xs">{r.origin}</TableCell>
                        <TableCell><OutboundStatusBadge status={r.status as string} /></TableCell>
                        <TableCell className="text-xs font-mono">{r.vehicle}</TableCell>
                        <TableCell><WorkerBadge name={r.driver as string} /></TableCell>
                        <TableCell className="text-xs font-mono">{r.departure}</TableCell>
                        <TableCell className="text-xs font-mono">{r.eta}</TableCell>
                        <TableCell><PalletTile p={r.pallets as number} /></TableCell>
                        <TableCell><WeightTile w={r.weight as number} /></TableCell>
                        <TableCell><ValueTile v={r.value as number} /></TableCell>
                        <TableCell className="font-mono text-xs">{r.tracking}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => {
                            setSelOutbound(obData.find((x) => x.id === r.id as string) || null)
                            setSheetOpen(true)
                            toast.success("Dispatch Detail", `Viewing ${r.id}`)
                          }}><Eye className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* Tab 5 — Cross-Dock Analytics                                     */}
        {/* ============================================================ */}
        <TabsContent value="5">
          <div className="cdh-analytics-kpis grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {analyticsKpis.map((k) => (
              <Card key={k.l}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{k.l}</CardTitle>
                  <k.I className="h-4 w-4" style={{ color: k.c }} />
                </CardHeader>
                <CardContent><span className="text-2xl font-bold">{k.v}</span></CardContent>
              </Card>
            ))}
          </div>
          <div className="cdh-analytics-charts mt-4 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-sm">Daily Throughput Trend (14 Days)</CardTitle></CardHeader>
              <CardContent>
                <LineChart data={dailyTrend} height={280}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip />
                  <Line type="monotone" dataKey="inbound" stroke={THEME.orange} strokeWidth={2} />
                  <Line type="monotone" dataKey="outbound" stroke={THEME.cyan} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Warehouse Performance Score</CardTitle></CardHeader>
              <CardContent>
                <BarChart data={whPerf} height={280} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} /><Tooltip />
                  <Bar dataKey="score" fill={THEME.emerald} radius={[0, 4, 4, 0]} />
                </BarChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Carrier On-Time Performance</CardTitle></CardHeader>
              <CardContent>
                <BarChart data={carPerf} height={280} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} /><Tooltip />
                  <Bar dataKey="onTime" fill={THEME.violet} radius={[0, 4, 4, 0]} />
                </BarChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Monthly Cost Breakdown (6 Months)</CardTitle></CardHeader>
              <CardContent>
                <AreaChart data={costTrend} height={280}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip />
                  <Area type="monotone" dataKey="labor" stackId="c" fill={THEME.orange} />
                  <Area type="monotone" dataKey="equipment" stackId="c" fill={THEME.cyan} />
                  <Area type="monotone" dataKey="space" stackId="c" fill={THEME.emerald} />
                  <Area type="monotone" dataKey="overhead" stackId="c" fill={THEME.violet} />
                </AreaChart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ================================================================ */}
      {/* Sheet: Inbound Detail (orange→cyan gradient)                      */}
      {/* ================================================================ */}
      <Sheet open={!!(sheetOpen && selInbound)} onOpenChange={(o) => { setSheetOpen(o); if (!o) setSelInbound(null) }}>
        <SheetContent className="cdh-sheet-inbound w-full max-w-lg overflow-y-auto">
          {selInbound && (<>
            <GradientHeader gradient="from-orange-600 to-cyan-500" title={`Shipment ${selInbound.id}`} subtitle="Cross-Dock Inbound Detail" />
            <div className="space-y-3 text-sm">
              {([["id", "Shipment ID"], ["carrier", "Carrier"], ["origin", "Origin"], ["warehouse", "Warehouse"], ["status", "Status"], ["eta", "ETA"], ["vehicle", "Vehicle Reg No"], ["pallets", "Pallets"], ["weight", "Weight"], ["category", "Category"], ["priority", "Priority"]] as [keyof InboundRec, string][]).map(([k, label]) => (
                <div key={k} className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">
                    {k === "status" ? <InboundStatusBadge status={selInbound[k]} /> : k === "carrier" ? <CarrierBadge name={selInbound[k]} /> : k === "category" ? <CategoryBadge cat={selInbound[k]} /> : k === "priority" ? <PriorityBadge level={selInbound[k]} /> : k === "weight" ? <WeightTile w={selInbound[k]} /> : k === "pallets" ? <PalletTile p={selInbound[k]} /> : String(selInbound[k])}
                  </span>
                </div>
              ))}
            </div>
          </>)}
        </SheetContent>
      </Sheet>

      {/* Sheet: Sort Detail (violet→orange gradient) */}
      <Sheet open={!!(sheetOpen && selSort)} onOpenChange={(o) => { setSheetOpen(o); if (!o) setSelSort(null) }}>
        <SheetContent className="cdh-sheet-sort w-full max-w-lg overflow-y-auto">
          {selSort && (<>
            <GradientHeader gradient="from-violet-600 to-orange-500" title={`Task ${selSort.id}`} subtitle="Sorting & Consolidation Detail" />
            <div className="space-y-3 text-sm">
              {([["id", "Task ID"], ["orderId", "Order ID"], ["source", "Source Shipment"], ["dest", "Destination"], ["category", "Category"], ["priority", "Priority"], ["status", "Status"], ["items", "Items Count"], ["weight", "Weight"], ["lane", "Sort Lane"], ["worker", "Worker"], ["start", "Start Time"], ["duration", "Duration"]] as [keyof SortRec, string][]).map(([k, label]) => (
                <div key={k} className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">
                    {k === "status" ? <SortStatusBadge status={selSort[k]} /> : k === "priority" ? <PriorityBadge level={selSort[k]} /> : k === "category" ? <CategoryBadge cat={selSort[k]} /> : k === "lane" ? <LaneBadge lane={selSort[k]} /> : k === "worker" ? <WorkerBadge name={selSort[k]} /> : k === "weight" ? <WeightTile w={selSort[k]} /> : k === "duration" ? <DurationTile d={selSort[k]} /> : String(selSort[k])}
                  </span>
                </div>
              ))}
            </div>
          </>)}
        </SheetContent>
      </Sheet>

      {/* Sheet: Outbound Detail (cyan→emerald gradient) */}
      <Sheet open={!!(sheetOpen && selOutbound)} onOpenChange={(o) => { setSheetOpen(o); if (!o) setSelOutbound(null) }}>
        <SheetContent className="cdh-sheet-outbound w-full max-w-lg overflow-y-auto">
          {selOutbound && (<>
            <GradientHeader gradient="from-cyan-600 to-emerald-500" title={`Shipment ${selOutbound.id}`} subtitle="Cross-Dock Outbound Dispatch Detail" />
            <div className="space-y-3 text-sm">
              {([["id", "Shipment ID"], ["carrier", "Carrier"], ["destination", "Destination"], ["origin", "Origin Warehouse"], ["status", "Status"], ["vehicle", "Vehicle"], ["driver", "Driver"], ["departure", "Departure Time"], ["eta", "ETA"], ["pallets", "Pallets"], ["weight", "Weight"], ["value", "Value"], ["tracking", "Tracking No"]] as [keyof OutboundRec, string][]).map(([k, label]) => (
                <div key={k} className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">
                    {k === "status" ? <OutboundStatusBadge status={selOutbound[k]} /> : k === "carrier" ? <CarrierBadge name={selOutbound[k]} /> : k === "weight" ? <WeightTile w={selOutbound[k]} /> : k === "pallets" ? <PalletTile p={selOutbound[k]} /> : k === "value" ? <ValueTile v={selOutbound[k]} /> : k === "driver" ? <WorkerBadge name={selOutbound[k]} /> : String(selOutbound[k])}
                  </span>
                </div>
              ))}
            </div>
          </>)}
        </SheetContent>
      </Sheet>
    </div>
  )
}
