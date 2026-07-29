"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Building2, Search, Eye, ArrowUpDown, TrendingUp, Clock,
  IndianRupee, AlertTriangle, CheckCircle, Activity, BarChart3,
  Package, Truck, Users, MapPin, Zap, ArrowRightLeft, Gauge,
  Thermometer, Warehouse, ShieldCheck, Settings, RefreshCw,
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

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000
  return x - Math.floor(x)
}
function ri(min: number, max: number, seed: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min
}

const WH_NAMES = ["Mumbai Mega Hub", "Delhi NCR Distribution", "Bangalore Sort Center", "Chennai Gateway", "Hyderabad Fulfillment", "Pune Express Center", "Kolkata Regional Hub", "Ahmedabad Transit Point"] as const
const WH_CODES = ["WH-MUM", "WH-DEL", "WH-BLR", "WH-CHN", "WH-HYD", "WH-PUN", "WH-KOL", "WH-AMD"] as const
const WH_TYPES = ["Mega Hub", "Distribution Center", "Sort Center", "Gateway Terminal", "Fulfillment Center", "Express Center", "Regional Hub", "Transit Point"] as const
const WH_EMOJI = ["🏭", "🏢", "📦", "🚢", "🏗️", "⚡", "🏨", "🛤️"] as const
const WH_STATUSES = ["Operational", "Maintenance", "At Capacity", "Understaffed", "Scaling Up", "Shutting Down"] as const
const TRANSFER_TYPES = ["Stock Transfer", "Equipment Move", "Staff Deployment", "Emergency Supply", "Seasonal Rebalance", "Return Routing"] as const
const TRANSFER_STATUSES = ["Pending", "In Transit", "Delivered", "Delayed", "Cancelled"] as const
const INDIAN_CITIES = ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"] as const
const RESOURCES = ["Forklifts", "Pallet Jacks", "Conveyor Belts", "RF Scanners", "CCTV Systems", "HVAC Units", "Generators", "Fire Systems"] as const
const SLA_TYPES = ["Dock-to-Stock", "Order-to-Ship", "Pick Accuracy", "Inventory Accuracy", "On-Time Dispatch", "Customer Delivery"] as const
const INDIAN_NAMES = ["Aarav Sharma", "Priya Patel", "Rohit Kumar", "Sneha Reddy", "Vikram Singh", "Anjali Gupta", "Arjun Mehta", "Divya Nair", "Karthik Iyer", "Pooja Das", "Manish Verma", "Ritu Joshi"] as const
const COLORS = ["#3b82f6", "#059669", "#d97706", "#e11d48", "#7c3aed", "#0891b2", "#6366f1", "#f97316"]

function fmtINR(n: number): string {
  const sign = n < 0 ? "-" : ""
  const abs = Math.abs(n)
  if (abs >= 1e7) return `₹${sign}${(abs / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `₹${sign}${(abs / 1e5).toFixed(2)} L`
  return `₹${sign}${abs.toLocaleString("en-IN")}`
}

/* ═══════════ 16 Unique Visual Components ═══════════ */

function WHTypeBadge({ type }: { type: string }) {
  const idx = WH_TYPES.indexOf(type as typeof WH_TYPES[number])
  return <Badge variant="outline" className="mwo-type-badge gap-1 text-[10px] px-2 py-0.5 font-medium">{idx >= 0 ? WH_EMOJI[idx] : "🏭"} {type}</Badge>
}

function WHStatusBadge({ status }: { status: string }) {
  const pulse = ["At Capacity", "Understaffed", "Maintenance"].includes(status)
  const colorMap: Record<string, string> = { Operational: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", Maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", "At Capacity": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", Understaffed: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400", "Scaling Up": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", "Shutting Down": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" }
  return <Badge variant="outline" className={`mwo-status-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${pulse ? "mwo-pulse-active" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>{status}</Badge>
}

function CapacityBar({ pct }: { pct: number }) {
  const color = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : pct > 40 ? "bg-blue-500" : "bg-emerald-500"
  return (
    <div className="mwo-capacity-bar flex items-center gap-2">
      <div className="h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-bold" style={{ color: pct > 90 ? "#e11d48" : pct > 70 ? "#d97706" : "#3b82f6" }}>{pct}%</span>
    </div>
  )
}

function TransferTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = { "Stock Transfer": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", "Equipment Move": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", "Staff Deployment": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400", "Emergency Supply": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", "Seasonal Rebalance": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", "Return Routing": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" }
  return <Badge variant="outline" className={`mwo-transfer-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}>{type}</Badge>
}

function TransferStatusBadge({ status }: { status: string }) {
  const pulse = status === "In Transit" || status === "Delayed"
  const colorMap: Record<string, string> = { Pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", "In Transit": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", Delayed: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" }
  return <Badge variant="outline" className={`mwo-tstatus-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${pulse ? "mwo-pulse-warning" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>{status}</Badge>
}

function ResourceBadge({ name }: { name: string }) {
  const emoji = [" forklift", "🛒", "🔧", "📱", "📹", "❄️", "🔌", "🧯"]
  const idx = RESOURCES.indexOf(name as typeof RESOURCES[number])
  return <Badge variant="outline" className="mwo-resource-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">{idx >= 0 ? emoji[idx] : "📦"} {name}</Badge>
}

function HealthBar({ score }: { score: number }) {
  const color = score > 85 ? "bg-emerald-500" : score > 60 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="mwo-health-bar flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-bold" style={{ color: score > 85 ? "#059669" : score > 60 ? "#d97706" : "#e11d48" }}>{score}%</span>
    </div>
  )
}

function SLATile({ name, value, target }: { name: string; value: number; target: number }) {
  const met = value >= target
  const color = met ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
  return (
    <div className="mwo-sla-tile flex items-center justify-between gap-2 rounded bg-gray-50 dark:bg-gray-800 px-2 py-1.5">
      <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{name}</span>
      <span className={`text-[11px] font-bold ${color}`}>{value}h / {target}h</span>
    </div>
  )
}

function ValueTile({ amount }: { amount: number }) {
  return <span className="mwo-value-tile inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><IndianRupee className="h-3 w-3" /> {fmtINR(amount)}</span>
}

function CountTile({ count, label }: { count: number; label: string }) {
  return <span className="mwo-count-tile inline-flex items-center gap-1 rounded bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">{count.toLocaleString()} {label}</span>
}

function CityBadge({ city }: { city: string }) {
  return <Badge variant="outline" className="mwo-city-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><MapPin className="h-3 w-3" /> {city}</Badge>
}

function RouteTile({ from, to }: { from: string; to: string }) {
  return <div className="mwo-route-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300"><ArrowRightLeft className="h-3 w-3" /> {from} → {to}</div>
}

function ManagerBadge({ name }: { name: string }) {
  return <Badge variant="outline" className="mwo-manager-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Users className="h-3 w-3" /> {name}</Badge>
}

function ThroughputTile({ units }: { units: number }) {
  return <span className="mwo-throughput-tile inline-flex items-center gap-1 rounded bg-cyan-50 px-2 py-0.5 text-[11px] font-bold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"><Activity className="h-3 w-3" /> {units}/hr</span>
}

function AreaTile({ sqft }: { sqft: number }) {
  return <span className="mwo-area-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[11px] font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">{sqft.toLocaleString()} sqft</span>
}

/* ═══════════ Data Generation ═══════════ */

function generateData() {
  const warehouses = Array.from({ length: 75 }, (_, i) => {
    const s = i * 7 + 1
    const idx = i % 8
    return { id: `WH-${String(i + 100).padStart(3, "0")}`, code: WH_CODES[idx], name: WH_NAMES[idx], type: WH_TYPES[idx], status: WH_STATUSES[i % 6], city: INDIAN_CITIES[idx], capacity: ri(40, 98, s), sqft: ri(10000, 200000, s + 1), throughput: ri(200, 2000, s + 2), staff: ri(50, 500, s + 3), manager: INDIAN_NAMES[i % 12], monthlyCost: ri(1000000, 15000000, s + 4), utilization: ri(30, 95, s + 5), healthScore: ri(55, 99, s + 6) }
  })
  const transfers = Array.from({ length: 70 }, (_, i) => {
    const s = i * 6 + 200
    const from = INDIAN_CITIES[i % 8]
    const to = INDIAN_CITIES[(i + 3) % 8]
    return { id: `TRF-${String(i + 2001).padStart(4, "0")}`, type: TRANSFER_TYPES[i % 6], status: TRANSFER_STATUSES[i % 5], from, to, items: ri(10, 500, s), weight: ri(100, 5000, s + 1), eta: ri(4, 72, s + 2), cost: ri(5000, 200000, s + 3), vehicle: ["Truck", "Container", "Van", "Tempo", "Train"][i % 5], driver: INDIAN_NAMES[i % 12] }
  })
  const resources = Array.from({ length: 55 }, (_, i) => {
    const s = i * 5 + 400
    return { id: `RES-${String(i + 3001).padStart(4, "0")}`, resource: RESOURCES[i % 8], warehouse: WH_NAMES[i % 8], quantity: ri(1, 20, s), health: ri(40, 100, s + 1), lastService: `2026-${String(ri(1, 7, s + 2)).padStart(2, "0")}-${String(ri(1, 28, s + 3)).padStart(2, "0")}`, nextService: ri(1, 90, s + 4), cost: ri(5000, 500000, s + 5), status: i % 5 === 0 ? "Needs Repair" : i % 5 === 1 ? "In Service" : "Available" }
  })
  const slas = Array.from({ length: 65 }, (_, i) => {
    const s = i * 4 + 600
    return { id: `SLA-${String(i + 4001).padStart(4, "0")}`, type: SLA_TYPES[i % 6], warehouse: WH_NAMES[i % 8], current: ri(1, 12, s), target: ri(2, 8, s + 1), trend: ri(-3, 5, s + 2), compliance: ri(60, 100, s + 3), period: `W${ri(1, 52, s + 4)}` }
  })
  return { WH_NAMES, WH_CODES, WH_TYPES, WH_STATUSES, TRANSFER_TYPES, TRANSFER_STATUSES, RESOURCES, SLA_TYPES, INDIAN_CITIES, INDIAN_NAMES, warehouses, transfers, resources, slas }
}

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

/* ═══════════ Main Component ═══════════ */

export default function MultiWarehouseOperationsView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedWH, setSelectedWH] = useState<typeof data.warehouses[0] | null>(null)
  const { toast } = useToast()

  const handleSort = (f: string) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(f); setSortDir("asc") }
  }

  const kpis = [
    { label: "Total Warehouses", value: WH_NAMES.length, icon: Building2, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Avg Capacity", value: `${Math.round(data.warehouses.reduce((s, w) => s + w.capacity, 0) / data.warehouses.length)}%`, icon: Gauge, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Total Staff", value: data.warehouses.reduce((s, w) => s + w.staff, 0).toLocaleString(), icon: Users, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Monthly Cost", value: fmtINR(data.warehouses.reduce((s, w) => s + w.monthlyCost, 0)), icon: IndianRupee, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { label: "Active Transfers", value: data.transfers.filter(x => x.status === "Pending" || x.status === "In Transit").length, icon: ArrowRightLeft, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Avg Health", value: `${Math.round(data.warehouses.reduce((s, w) => s + w.healthScore, 0) / data.warehouses.length)}%`, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "SLA Compliance", value: `${Math.round(data.slas.reduce((s, x) => s + x.compliance, 0) / data.slas.length)}%`, icon: ShieldCheck, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { label: "Total Area", value: `${((data.warehouses.reduce((s, w) => s + w.sqft, 0) / 1e6).toFixed(1))}M sqft`, icon: MapPin, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
  ]

  const capBar = WH_NAMES.map((n, i) => ({ name: WH_CODES[i], Capacity: ri(40, 98, i + 10), Utilization: ri(30, 95, i + 50) }))
  const whPie = WH_TYPES.map((t, i) => ({ name: t, value: ri(1, 3, i + 100) }))
  const filteredWH = sortedData(filterData(data.warehouses, searchQ), sortField, sortDir)
  const filteredTransfers = sortedData(filterData(data.transfers, searchQ), sortField, sortDir)

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button variant="ghost" size="sm" className="mwo-sort-header h-8 px-2 text-[10px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handleSort(field)}>
      <span className="flex items-center gap-1">{children}<ArrowUpDown className="h-3 w-3" /></span>
    </Button>
  )

  return (
    <div className="mwo-root space-y-4 p-4">
      <PageHeader title="Multi-warehouse Operations" description="Cross-warehouse monitoring, inter-warehouse transfers, resource allocation and SLA management" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mwo-tabs space-y-4">
        <TabsList className="mwo-tabs-list h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
          {["Warehouse Overview", "Warehouse Registry", "Inter-WH Transfers", "Resource Allocation", "SLA Management", "Network Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="mwo-tab-trigger text-xs font-medium px-3">{t}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="0" className="mwo-tab-content space-y-4">
          <div className="mwo-kpi-grid grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">{kpis.map((k, i) => (
            <Card key={i} className={`mwo-kpi-card group hover:shadow-md transition-all duration-300 ${k.bg}`}><CardContent className="flex items-center gap-3 p-4"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${k.color}`}><k.icon className="h-5 w-5" /></div><div className="min-w-0"><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{k.label}</p><p className={`text-lg font-bold ${k.color}`}>{k.value}</p></div></CardContent></Card>
          ))}</div>
          <div className="mwo-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="mwo-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Warehouse Capacity vs Utilization</CardTitle></CardHeader><CardContent><BarChart data={capBar}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} domain={[0, 100]} /><Tooltip /><Bar dataKey="Capacity" fill="#3b82f6" radius={[4, 4, 0, 0]} /><Bar dataKey="Utilization" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card className="mwo-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Warehouse Type Mix</CardTitle></CardHeader><CardContent><PieChart><Pie data={whPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{whPie.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="mwo-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Cost Trend</CardTitle></CardHeader><CardContent><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], Cost: ri(80, 150, i + 200), Revenue: ri(100, 200, i + 250) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} unit="L" /><Tooltip /><Area type="monotone" dataKey="Cost" stackId="a" fill="#e11d48" /><Area type="monotone" dataKey="Revenue" stackId="a" fill="#059669" /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="1" className="mwo-tab-content space-y-4">
          <div className="flex gap-2 items-center"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search warehouses..." className="pl-9 h-9 text-sm" /></div><Badge variant="outline" className="text-xs">{filteredWH.length} records</Badge></div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="mwo-wh-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">Code</th><th className="p-2 text-left">Name</th><th className="p-2 text-left">Type</th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">City</th><th className="p-2 text-left"><SortHeader field="capacity">Capacity</SortHeader></th><th className="p-2 text-left">Throughput</th><th className="p-2 text-left">Health</th><th className="p-2 text-center">Action</th></tr></thead>
              <tbody>{filteredWH.map((wh) => (
                <tr key={wh.id} className="mwo-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-2 font-mono font-semibold">{wh.code}</td>
                  <td className="p-2 text-[10px] font-semibold">{wh.name}</td>
                  <td className="p-2"><WHTypeBadge type={wh.type} /></td>
                  <td className="p-2"><WHStatusBadge status={wh.status} /></td>
                  <td className="p-2"><CityBadge city={wh.city} /></td>
                  <td className="p-2"><CapacityBar pct={wh.capacity} /></td>
                  <td className="p-2"><ThroughputTile units={wh.throughput} /></td>
                  <td className="p-2"><HealthBar score={wh.healthScore} /></td>
                  <td className="p-2 text-center"><Button variant="ghost" size="sm" className="mwo-view-btn h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30" onClick={() => { setSelectedWH(wh); setSheetOpen(true); toast.success("Viewing Warehouse", `${wh.code} details`) }}><Eye className="h-3.5 w-3.5" /></Button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="2" className="mwo-tab-content space-y-4">
          <div className="flex gap-2 items-center"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search transfers..." className="pl-9 h-9 text-sm" /></div><Badge variant="outline" className="text-xs">{filteredTransfers.length} transfers</Badge></div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="mwo-transfer-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Type</th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">Route</th><th className="p-2 text-left">Items</th><th className="p-2 text-left">ETA</th><th className="p-2 text-left">Cost</th><th className="p-2 text-left">Vehicle</th></tr></thead>
              <tbody>{filteredTransfers.map((tr) => (
                <tr key={tr.id} className="mwo-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-2 font-mono font-semibold">{tr.id}</td>
                  <td className="p-2"><TransferTypeBadge type={tr.type} /></td>
                  <td className="p-2"><TransferStatusBadge status={tr.status} /></td>
                  <td className="p-2"><RouteTile from={tr.from} to={tr.to} /></td>
                  <td className="p-2"><CountTile count={tr.items} label="items" /></td>
                  <td className="p-2 text-[10px]">{tr.eta}h</td>
                  <td className="p-2"><ValueTile amount={tr.cost} /></td>
                  <td className="p-2 text-[10px]">{tr.vehicle}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="3" className="mwo-tab-content space-y-4">
          <div className="mwo-resource-grid grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.resources.map((res) => (
              <Card key={res.id} className={`mwo-resource-card group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${res.status === "Needs Repair" ? "border-l-4 border-l-red-500" : res.status === "In Service" ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-emerald-500"}`}>
                <div className={`mwo-res-header p-3 ${res.status === "Needs Repair" ? "bg-gradient-to-r from-red-500 to-red-600" : res.status === "In Service" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-gradient-to-r from-emerald-500 to-emerald-600"} text-white`}>
                  <div className="flex items-center justify-between"><ResourceBadge name={res.resource} /><Badge variant="outline" className="text-[10px] px-2 py-0.5 border-white/30 text-white bg-white/10">{res.status}</Badge></div>
                  <p className="text-lg font-bold mt-1">{res.id}</p>
                </div>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Qty</span><CountTile count={res.quantity} label="units" /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Health</span><HealthBar score={res.health} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Next Service</span><span className="text-[10px] font-medium">{res.nextService}d</span></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Cost</span><ValueTile amount={res.cost} /></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="4" className="mwo-tab-content space-y-4">
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="mwo-sla-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Warehouse</th><th className="p-2 text-left">Current</th><th className="p-2 text-left">Target</th><th className="p-2 text-left">Trend</th><th className="p-2 text-left">Compliance</th><th className="p-2 text-left">Period</th></tr></thead>
              <tbody>{data.slas.map((sla) => (
                <tr key={sla.id} className="mwo-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-2 font-mono font-semibold">{sla.id}</td>
                  <td className="p-2 text-[10px] font-semibold">{sla.type}</td>
                  <td className="p-2 text-[10px]">{sla.warehouse}</td>
                  <td className="p-2 text-[10px] font-bold">{sla.current}h</td>
                  <td className="p-2 text-[10px] font-medium">{sla.target}h</td>
                  <td className="p-2 text-[10px]">{sla.trend > 0 ? "+" : ""}{sla.trend}h</td>
                  <td className="p-2"><HealthBar score={sla.compliance} /></td>
                  <td className="p-2 text-[10px]">{sla.period}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="5" className="mwo-tab-content space-y-4">
          <div className="mwo-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="mwo-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Health Score Trend (12 months)</CardTitle></CardHeader><CardContent><LineChart data={Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], Score: ri(70, 98, i + 300), Target: 90 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} domain={[50, 100]} /><Tooltip /><Line type="monotone" dataKey="Score" stroke="#3b82f6" strokeWidth={2} /><Line type="monotone" dataKey="Target" stroke="#e11d48" strokeWidth={1.5} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="mwo-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Staff Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={WH_NAMES.map((n, i) => ({ name: WH_CODES[i], value: ri(50, 300, i + 400) }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{WH_NAMES.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="mwo-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Transfer Volume Trend</CardTitle></CardHeader><CardContent><AreaChart data={Array.from({ length: 6 }, (_, i) => ({ month: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"][i], Incoming: ri(30, 100, i + 500), Outgoing: ri(20, 80, i + 550) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Incoming" stackId="a" fill="#3b82f6" /><Area type="monotone" dataKey="Outgoing" stackId="a" fill="#059669" /></AreaChart></CardContent></Card>
            <Card className="mwo-chart-card hover:shadow-lg transition-shadow duration-300"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Cost per Warehouse</CardTitle></CardHeader><CardContent><BarChart data={WH_NAMES.map((n, i) => ({ name: WH_CODES[i], Cost: ri(5, 50, i + 600) }))} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} unit="L" /><YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={55} /><Tooltip /><Bar dataKey="Cost" fill="#d97706" radius={[0, 4, 4, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!(sheetOpen && selectedWH)} onOpenChange={o => { setSheetOpen(o); if (!o) setSelectedWH(null) }}>
        <SheetContent className="mwo-sheet w-full sm:w-[540px]">
          {selectedWH && (<>
            <div className="mwo-sheet-header bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 p-6 mx-6 mt-6 rounded-xl text-white">
              <SheetHeader><SheetTitle className="text-white">Warehouse Detail</SheetTitle></SheetHeader>
              <p className="text-sm opacity-80 mt-1">{selectedWH.code} | {selectedWH.name}</p>
            </div>
            <ScrollArea className="mt-4 px-6"><div className="space-y-3 pb-6">
              <div className="mwo-detail-grid grid grid-cols-2 gap-3">
                {[{ l: "Type", c: <WHTypeBadge type={selectedWH.type} /> }, { l: "Status", c: <WHStatusBadge status={selectedWH.status} /> }, { l: "City", c: <CityBadge city={selectedWH.city} /> }, { l: "Manager", c: <ManagerBadge name={selectedWH.manager} /> }, { l: "Capacity", c: <CapacityBar pct={selectedWH.capacity} /> }, { l: "Throughput", c: <ThroughputTile units={selectedWH.throughput} /> }, { l: "Staff", c: <CountTile count={selectedWH.staff} label="people" /> }, { l: "Area", c: <AreaTile sqft={selectedWH.sqft} /> }, { l: "Utilization", c: <HealthBar score={selectedWH.utilization} /> }, { l: "Health", c: <HealthBar score={selectedWH.healthScore} /> }, { l: "Monthly Cost", c: <ValueTile amount={selectedWH.monthlyCost} /> }].map((item, i) => (
                  <div key={i} className="mwo-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">{item.l}</p>{item.c}</div>
                ))}
              </div>
            </div></ScrollArea>
          </>)}
        </SheetContent>
      </Sheet>
    </div>
  )
}
