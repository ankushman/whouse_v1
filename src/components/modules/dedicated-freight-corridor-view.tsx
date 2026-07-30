"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  TrainFront, Gauge, MapPin, ArrowRightLeft, Activity, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, BarChart3, Clock, AlertTriangle, CheckCircle,
  Package, Truck, Container, Radio, Eye, Download, Timer, Zap,
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

const CC = { violet: "#7c3aed", emerald: "#059669", amber: "#d97706", sky: "#0ea5e9", rose: "#e11d48", teal: "#0d9488", indigo: "#6366f1", slate: "#475569", orange: "#ea580c", cyan: "#06b6d4", lime: "#65a30d", green: "#16a34a", blue: "#1e40af" }
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const CORRIDORS = ["Western DFC", "Eastern DFC", "Eastern DFC-II", "Southern DFC (Proposed)", "North-South DFC (Proposed)"]
const ROUTES = [
  "Delhi–Mumbai (WDFC)", "Rajkot–Mumbai (WDFC)", "Delhi–Kolkata (EDFC)", "Ludhiana–Dankuni (EDFC)",
  "Mumbai–Chennai (Proposed)", "Delhi–Chennai (Proposed)", "Delhi–Ahmedabad (WDFC)",
  "JNPT–Pune (WDFC Spur)", "Sonnagar–Dankuni (EDFC-II)", "Delhi–Bengaluru (Proposed)",
]

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}

function generateData() {
  const r = seededRandom(193193193)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(r() * arr.length)]
  const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min
  const rf = (min: number, max: number) => +(r() * (max - min) + min).toFixed(2)

  const RAKE_TYPES = ["BOXN", "BOY", "BCN", "BTPN", "BLCA", "BVZI", "BOBRN", "NAL"]
  const COMMODITIES = ["Coal", "Iron Ore", "Steel Products", "Cement", "Fertilizers", "Foodgrains", "Container", "Automobiles", "Petroleum", "Chemicals", "FMCG", "Textiles"]
  const TERMINALS = ["Bhilwara ICD", "Tughlakabad ICD", "Patparganj ICD", "Whitefield ICD", "Sanathnagar ICD", "Dadri ICD", "Khurja ICD", "Dhanbad Terminal", "Jamshedpur Terminal", "Bhadrak Terminal", "Kalinganagar Terminal", "JNPT Terminal", "Mundra Terminal", "Hazira Terminal", "Pipavav Terminal"]
  const TRAIN_STATUSES = ["In Transit", "Loading", "Unloading", "At Terminal", "Maintenance", "Delayed", "On Time", "Held"]
  const CORRIDOR_STATUSES = ["Operational", "Under Construction", "Partially Operational", "Planned"]
  const OPERATORS = ["DFCCIL", "CONCOR", "IRFC", "Indian Railways", "Adani Logistics", "DP World", "Container Corporation"]

  const trains = Array.from({ length: 70 }, (_, i) => ({
    id: `TRN-${String(i + 1).padStart(5, "0")}`,
    trainNo: pick(["22401", "22402", "22403", "22404", "22405", "22406", "22407", "22408", "22409", "22410", "22411", "22412", "22413", "22414", "22415", "22416"]) + String(ri(100, 999)),
    route: pick(ROUTES), corridor: pick(CORRIDORS),
    commodity: pick(COMMODITIES), rakeType: pick(RAKE_TYPES),
    status: pick(TRAIN_STATUSES), operator: pick(OPERATORS),
    origin: pick(TERMINALS), destination: pick(TERMINALS),
    departureTime: Date.now() - ri(1, 72) * 3600000,
    arrivalTime: Date.now() + ri(-12, 48) * 3600000,
    loadWeight: ri(2000, 6000), wagonCount: ri(20, 60),
    speed: ri(30, 100), distance: ri(200, 1500),
    delay: ri(0, 180), fuelConsumption: rf(3, 12),
    locoType: pick(["WAG-12B", "WAG-9H", "WAG-7", "WAG-5", "WAP-7", "WAP-5"]),
  }))

  const corridorData = CORRIDORS.map((c, i) => ({
    id: `CRD-${String(i + 1).padStart(3, "0")}`,
    name: c,
    status: i < 2 ? "Operational" : i < 4 ? "Under Construction" : "Planned",
    totalLength: ri(500, 1800), completedLength: i < 2 ? ri(800, 1500) : ri(100, 800),
    stations: ri(15, 50), terminals: ri(3, 12),
    dailyCapacity: ri(50, 150), currentUtilization: ri(40, 95),
    maxSpeed: i < 2 ? 100 : ri(60, 100),
    avgTransitTime: ri(8, 36), investment: ri(50000, 150000),
    openDate: i < 2 ? "Operational" : i < 4 ? `${ri(2026, 2028)}` : "TBD",
  }))

  const terminals = TERMINALS.map((t, i) => ({
    id: `TRM-${String(i + 1).padStart(3, "0")}`,
    name: t,
    corridor: pick(CORRIDORS),
    type: pick(["ICD", "Freight Terminal", "Container Terminal", "Logistics Park", "Inland Port"]),
    capacity: ri(500, 5000), utilization: ri(30, 95),
    monthlyThroughput: ri(10000, 200000), yardCapacity: ri(200, 3000),
    connectivity: pick(["Rail", "Road", "Rail + Road", "Multimodal"]),
    cranes: ri(2, 12), reachStackers: ri(2, 8),
    avgDwellTime: ri(12, 72), status: pick(["Active", "Expansion", "Upgrading"]),
    railLines: ri(1, 6),
  }))

  const schedules = Array.from({ length: 60 }, (_, i) => ({
    id: `SCH-${String(i + 1).padStart(5, "0")}`,
    trainNo: pick(trains).trainNo, route: pick(ROUTES),
    origin: pick(TERMINALS), destination: pick(TERMINALS),
    departure: Date.now() + ri(1, 168) * 3600000,
    arrival: Date.now() + ri(24, 336) * 3600000,
    frequency: pick(["Daily", "Bi-weekly", "Weekly", "3x/week", "5x/week"]),
    commodity: pick(COMMODITIES), rakeType: pick(RAKE_TYPES),
    priority: pick(["Normal", "Priority", "Express", "Special"]),
    status: pick(["Scheduled", "On Schedule", "Delayed", "Cancelled"]),
    expectedLoad: ri(2000, 6000),
  }))

  const performanceMetrics = Array.from({ length: 50 }, (_, i) => ({
    id: `PM-${String(i + 1).padStart(4, "0")}`,
    corridor: pick(CORRIDORS), month: pick(MONTHS),
    punctuality: ri(60, 98), avgSpeed: ri(40, 95),
    throughput: ri(10000, 80000), revenue: ri(5000000, 50000000),
    delays: ri(0, 30), cancellations: ri(0, 5),
    coalVolume: ri(5000, 40000), containerTEU: ri(2000, 25000),
    incidents: ri(0, 8), fuelEfficiency: rf(2, 8),
  }))

  const monthlyVolume = MONTHS.map(m => ({ month: m, dfcTrains: ri(80, 200), conventional: ri(60, 150), road: ri(100, 300) }))
  const commodityBreakdown = COMMODITIES.map(c => ({ commodity: c, volume: ri(50000, 500000) }))
  const punctualityTrend = MONTHS.map(m => ({ month: m, wdfc: ri(78, 96), edfc: ri(72, 94), target: 90 }))
  const routeUtilization = ROUTES.map(rt => ({ route: rt.split("(")[0].trim(), utilization: ri(40, 98), capacity: ri(50, 150) }))
  const revenueByCorridor = CORRIDORS.map(c => ({ corridor: c.split(" ")[0], freight: ri(10000000, 80000000), leasing: ri(5000000, 30000000), other: ri(1000000, 10000000) }))
  const speedAnalysis = MONTHS.map(m => ({ month: m, dfcAvg: ri(65, 95), conventionalAvg: ri(30, 55), target: 75 }))

  return {
    trains, corridorData, terminals, schedules, performanceMetrics,
    monthlyVolume, commodityBreakdown, punctualityTrend, routeUtilization,
    revenueByCorridor, speedAnalysis,
    RAKE_TYPES, COMMODITIES, TERMINALS, TRAIN_STATUSES, CORRIDOR_STATUSES, OPERATORS, CORRIDORS, ROUTES,
  }
}

const DATA = generateData()

// ─── Unique Visual Components ──────────────────────────────

function CorridorProgressRing({ completed, total }: { completed: number; total: number }) {
  const pct = Math.round((completed / total) * 100)
  const r = 28, circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = pct < 30 ? CC.rose : pct < 60 ? CC.amber : pct < 90 ? CC.sky : CC.emerald
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
    </div>
  )
}

function SpeedGauge({ speed, maxSpeed }: { speed: number; maxSpeed: number }) {
  const pct = Math.min((speed / maxSpeed) * 100, 100)
  const color = pct < 30 ? CC.rose : pct < 60 ? CC.amber : pct < 85 ? CC.sky : CC.emerald
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
      <span className="text-xs font-bold min-w-[48px] text-right" style={{ color }}>{speed} km/h</span>
    </div>
  )
}

function LoadIndicator({ loadWeight }: { loadWeight: number }) {
  const pct = Math.min((loadWeight / 6000) * 100, 100)
  const color = pct < 40 ? CC.sky : pct < 70 ? CC.emerald : pct < 90 ? CC.amber : CC.rose
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-semibold min-w-[36px] text-right" style={{ color }}>{(loadWeight / 1000).toFixed(1)}T</span>
    </div>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, string> = {
    "Normal": "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    "Priority": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Express": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    "Special": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  }
  return <span className={cn("dfc-priority-pill", config[priority] || config["Normal"])}>{priority}</span>
}

function TerminalConnectivityBadge({ conn }: { conn: string }) {
  const colors: Record<string, string> = {
    "Rail": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    "Road": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Rail + Road": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Multimodal": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  }
  return <span className={cn("dfc-conn-pill", colors[conn] || colors["Road"])}>{conn}</span>
}

// ─── Status badge helper ───────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isDark = status === "Delayed" || status === "Cancelled" || status === "Maintenance" || status === "Held"
  const darkClass = "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
  const normalMap: Record<string, string> = {
    "In Transit": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Loading": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Unloading": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "At Terminal": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    "On Time": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Operational": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Under Construction": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Partially Operational": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Planned": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    "Active": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Expansion": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Upgrading": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    "Scheduled": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "On Schedule": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "ICD": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    "Freight Terminal": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "Container Terminal": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    "Logistics Park": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Inland Port": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  }
  return (
    <span className={cn("dfc-status-pill", isDark ? darkClass : normalMap[status] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300")}>
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

function SortIcon({ field, sortBy }: { field: string; sortBy: string }) {
  if (sortBy !== field) return <span className="text-gray-300 dark:text-gray-600 ml-0.5">↕</span>
  return <span className="text-violet-500 ml-0.5">↑</span>
}

// ─── Main Component ────────────────────────────────────────

export default function DedicatedFreightCorridorView() {
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

  const filteredTrains = useMemo(() => {
    let d = DATA.trains
    if (searchTerm) d = d.filter(t => t.trainNo.includes(searchTerm) || t.route.toLowerCase().includes(searchTerm.toLowerCase()) || t.commodity.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== "All") d = d.filter(t => t.status === filterStatus)
    return sortData(d, "id")
  }, [searchTerm, filterStatus, sortBy])

  const filteredCorridors = useMemo(() => {
    let d = DATA.corridorData
    if (searchTerm) d = d.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== "All") d = d.filter(c => c.status === filterStatus)
    return sortData(d, "id")
  }, [searchTerm, filterStatus, sortBy])

  const filteredTerminals = useMemo(() => {
    let d = DATA.terminals
    if (searchTerm) d = d.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.corridor.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== "All") d = d.filter(t => t.status === filterStatus)
    return sortData(d, "id")
  }, [searchTerm, filterStatus, sortBy])

  const filteredSchedules = useMemo(() => {
    let d = DATA.schedules
    if (searchTerm) d = d.filter(s => s.trainNo.includes(searchTerm) || s.route.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== "All") d = d.filter(s => s.status === filterStatus)
    return sortData(d, "id")
  }, [searchTerm, filterStatus, sortBy])

  const filteredPerf = useMemo(() => {
    let d = DATA.performanceMetrics
    if (searchTerm) d = d.filter(p => p.corridor.toLowerCase().includes(searchTerm.toLowerCase()))
    return sortData(d, "id")
  }, [searchTerm, filterStatus, sortBy])

  const kpis = [
    { label: "Trains in Service", value: DATA.trains.filter(t => ["In Transit", "Loading", "Unloading", "On Time"].includes(t.status)).length, icon: TrainFront, color: CC.violet, trend: "+12%", up: true },
    { label: "Avg Speed (km/h)", value: Math.round(DATA.trains.reduce((a, t) => a + t.speed, 0) / DATA.trains.length), icon: Gauge, color: CC.sky, trend: "+5 km/h", up: true },
    { label: "Corridor Utilization", value: `${Math.round(DATA.corridorData.reduce((a, c) => a + c.currentUtilization, 0) / DATA.corridorData.length)}%`, icon: Activity, color: CC.emerald, trend: "+8%", up: true },
    { label: "Total Load (MT)", value: DATA.trains.reduce((a, t) => a + t.loadWeight, 0).toLocaleString(), icon: Package, color: CC.amber, trend: "+15%", up: true },
    { label: "Delayed Trains", value: DATA.trains.filter(t => t.status === "Delayed").length, icon: AlertTriangle, color: CC.rose, trend: "-20%", up: false },
    { label: "Punctuality Rate", value: `${Math.round(DATA.performanceMetrics.reduce((a, p) => a + p.punctuality, 0) / DATA.performanceMetrics.length)}%`, icon: Timer, color: CC.teal, trend: "+3%", up: true },
    { label: "Monthly Throughput", value: `${((DATA.performanceMetrics.reduce((a, p) => a + p.throughput, 0) / DATA.performanceMetrics.length) / 1000).toFixed(0)}K tons`, icon: BarChart3, color: CC.indigo, trend: "+10%", up: true },
    { label: "Active Corridors", value: DATA.corridorData.filter(c => c.status === "Operational" || c.status === "Partially Operational").length, icon: MapPin, color: CC.orange, trend: "+1", up: true },
  ]

  const tabs = ["Corridor Dashboard", "Train Tracking", "Corridor Map", "Terminal Network", "Scheduling", "Performance Analytics"]

  // ─── Tab 0: Corridor Dashboard ──────────────────────────
  const dashboardTab = (
    <div className="space-y-4">
      <div className="dfc-kpi-grid grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {kpis.map((kpi, i) => (
          <Card key={i} className="dfc-kpi-card dfc-stat-card">
            <CardContent className="p-3.5">
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
                <div className="dfc-counter-value text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{kpi.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="col-span-2">
          <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Monthly Freight Volume (Trains)</CardTitle></CardHeader>
          <CardContent className="px-4 pb-3">
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={DATA.monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="dfcTrains" fill={CC.violet} stroke={CC.violet} fillOpacity={0.15} name="DFC" />
                <Area type="monotone" dataKey="conventional" fill={CC.sky} stroke={CC.sky} fillOpacity={0.1} name="Conventional" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Commodity Breakdown</CardTitle></CardHeader>
          <CardContent className="px-4 pb-3 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={DATA.commodityBreakdown} dataKey="volume" nameKey="commodity" cx="50%" cy="50%" outerRadius={72} innerRadius={38} paddingAngle={2} label={({ commodity, percent }) => `${commodity.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {DATA.commodityBreakdown.map((_, i) => <Cell key={i} fill={[CC.violet, CC.emerald, CC.sky, CC.amber, CC.rose, CC.teal, CC.indigo, CC.orange, CC.cyan, CC.lime, CC.blue, CC.green][i]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Punctuality Trend (%)</CardTitle></CardHeader>
          <CardContent className="px-4 pb-3">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={DATA.punctualityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[60, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="wdfc" stroke={CC.violet} strokeWidth={2} dot={{ r: 3 }} name="WDFC" />
                <Line type="monotone" dataKey="edfc" stroke={CC.emerald} strokeWidth={2} dot={{ r: 3 }} name="EDFC" />
                <Line type="monotone" dataKey="target" stroke={CC.slate} strokeWidth={2} strokeDasharray="6 3" dot={false} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Revenue by Corridor (₹ Cr)</CardTitle></CardHeader>
          <CardContent className="px-4 pb-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DATA.revenueByCorridor}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="corridor" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="freight" fill={CC.violet} radius={[3, 3, 0, 0]} name="Freight" stackId="a" />
                <Bar dataKey="leasing" fill={CC.sky} radius={[3, 3, 0, 0]} name="Leasing" stackId="a" />
                <Bar dataKey="other" fill={CC.amber} radius={[3, 3, 0, 0]} name="Other" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // ─── Tab 1: Train Tracking ────────────────────────────
  const trainTab = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Input placeholder="Search train numbers, routes, commodities..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="h-8 text-xs" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-white dark:bg-gray-900">
          <option value="All">All Status</option>
          {DATA.TRAIN_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ExportButton data={filteredTrains} filename="freight-trains" />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { key: "trainNo", label: "Train No." }, { key: "route", label: "Route" }, { key: "commodity", label: "Commodity" },
                { key: "status", label: "Status" }, { key: "speed", label: "Speed" },
                { key: "origin", label: "Origin" }, { key: "destination", label: "Destination" },
                { key: "loadWeight", label: "Load" }, { key: "delay", label: "Delay (min)" },
                { key: "locoType", label: "Loco" },
              ].map(col => (
                <TableHead key={col.key} className="text-[11px] dfc-sort-header" onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon field={col.key} sortBy={sortBy} />
                </TableHead>
              ))}
              <TableHead className="text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrains.slice(0, 25).map(t => (
              <TableRow key={t.id} className="dfc-table-row">
                <TableCell className="text-xs font-mono font-medium">{t.trainNo}</TableCell>
                <TableCell className="text-xs">{t.route}</TableCell>
                <TableCell className="text-xs">{t.commodity}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell><SpeedGauge speed={t.speed} maxSpeed={100} /></TableCell>
                <TableCell className="text-xs">{t.origin}</TableCell>
                <TableCell className="text-xs">{t.destination}</TableCell>
                <TableCell><LoadIndicator loadWeight={t.loadWeight} /></TableCell>
                <TableCell className={cn("text-xs text-right font-semibold", t.delay > 60 ? "text-rose-600" : t.delay > 15 ? "text-amber-600" : "text-emerald-600")}>{t.delay}</TableCell>
                <TableCell className="text-xs">{t.locoType}</TableCell>
                <TableCell>
                  <button className="dfc-action-btn p-1.5 rounded-md" onClick={() => openDrawer("train", t)}><Eye className="h-3.5 w-3.5 text-violet-600" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-[11px] text-gray-500">Showing {Math.min(25, filteredTrains.length)} of {filteredTrains.length} trains</div>
    </div>
  )

  // ─── Tab 2: Corridor Map (Data Table View) ────────────
  const corridorTab = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Input placeholder="Search corridors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="h-8 text-xs" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-white dark:bg-gray-900">
          <option value="All">All Status</option>
          {DATA.CORRIDOR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Corridor Cards */}
      <div className="grid grid-cols-2 gap-3">
        {filteredCorridors.map(c => (
          <Card key={c.id} className="dfc-stat-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={c.status} />
                    <span className="text-[10px] text-gray-500">{c.stations} stations • {c.terminals} terminals</span>
                  </div>
                </div>
                <CorridorProgressRing completed={c.completedLength} total={c.totalLength} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: CC.violet }}>{c.totalLength} km</div>
                  <div className="text-[10px] text-gray-500">Total Length</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: CC.emerald }}>{c.dailyCapacity}</div>
                  <div className="text-[10px] text-gray-500">Daily Trains</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: CC.amber }}>{c.maxSpeed} km/h</div>
                  <div className="text-[10px] text-gray-500">Max Speed</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="text-[10px] text-gray-500">Utilization</div>
                  <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.currentUtilization}%`, background: c.currentUtilization > 85 ? CC.rose : c.currentUtilization > 60 ? CC.amber : CC.emerald }} />
                  </div>
                  <span className="text-[10px] font-semibold">{c.currentUtilization}%</span>
                </div>
                <button className="dfc-action-btn p-1.5 rounded-md" onClick={() => openDrawer("corridor", c)}><Eye className="h-3.5 w-3.5 text-violet-600" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Route Utilization</CardTitle></CardHeader>
        <CardContent className="px-4 pb-3">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DATA.routeUtilization} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <YAxis dataKey="route" type="category" tick={{ fontSize: 9 }} width={150} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="utilization" fill={CC.violet} radius={[0, 3, 3, 0]} name="Utilization %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  // ─── Tab 3: Terminal Network ──────────────────────────
  const terminalTab = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Input placeholder="Search terminals, corridors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="h-8 text-xs" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-white dark:bg-gray-900">
          <option value="All">All Status</option>
          {["Active", "Expansion", "Upgrading"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ExportButton data={filteredTerminals} filename="terminals" />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { key: "name", label: "Terminal" }, { key: "corridor", label: "Corridor" }, { key: "type", label: "Type" },
                { key: "status", label: "Status" }, { key: "connectivity", label: "Connectivity" },
                { key: "capacity", label: "Capacity" }, { key: "utilization", label: "Utilization" },
                { key: "monthlyThroughput", label: "Monthly (MT)" }, { key: "avgDwellTime", label: "Dwell (hrs)" },
              ].map(col => (
                <TableHead key={col.key} className="text-[11px] dfc-sort-header" onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon field={col.key} sortBy={sortBy} />
                </TableHead>
              ))}
              <TableHead className="text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTerminals.slice(0, 20).map(t => (
              <TableRow key={t.id} className="dfc-table-row">
                <TableCell className="text-xs font-medium">{t.name}</TableCell>
                <TableCell className="text-xs">{t.corridor.split(" ")[0]}</TableCell>
                <TableCell><StatusBadge status={t.type} /></TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell><TerminalConnectivityBadge conn={t.connectivity} /></TableCell>
                <TableCell className="text-xs text-right">{t.capacity.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${t.utilization}%`, background: t.utilization > 85 ? CC.rose : t.utilization > 60 ? CC.amber : CC.emerald }} />
                    </div>
                    <span className="text-[10px] font-semibold">{t.utilization}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-right">{(t.monthlyThroughput / 1000).toFixed(0)}K</TableCell>
                <TableCell className={cn("text-xs text-right font-semibold", t.avgDwellTime > 48 ? "text-rose-600" : t.avgDwellTime > 24 ? "text-amber-600" : "text-emerald-600")}>{t.avgDwellTime}</TableCell>
                <TableCell>
                  <button className="dfc-action-btn p-1.5 rounded-md" onClick={() => openDrawer("terminal", t)}><Eye className="h-3.5 w-3.5 text-violet-600" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  // ─── Tab 4: Scheduling ────────────────────────────────
  const scheduleTab = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Input placeholder="Search train numbers, routes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="h-8 text-xs" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-white dark:bg-gray-900">
          <option value="All">All Status</option>
          {["Scheduled", "On Schedule", "Delayed", "Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ExportButton data={filteredSchedules} filename="schedules" />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { key: "trainNo", label: "Train No." }, { key: "route", label: "Route" }, { key: "commodity", label: "Commodity" },
                { key: "priority", label: "Priority" }, { key: "status", label: "Status" },
                { key: "frequency", label: "Frequency" }, { key: "departure", label: "Departure" },
                { key: "arrival", label: "Arrival" }, { key: "expectedLoad", label: "Exp. Load" },
              ].map(col => (
                <TableHead key={col.key} className="text-[11px] dfc-sort-header" onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon field={col.key} sortBy={sortBy} />
                </TableHead>
              ))}
              <TableHead className="text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.slice(0, 25).map(s => (
              <TableRow key={s.id} className="dfc-table-row">
                <TableCell className="text-xs font-mono font-medium">{s.trainNo}</TableCell>
                <TableCell className="text-xs">{s.route}</TableCell>
                <TableCell className="text-xs">{s.commodity}</TableCell>
                <TableCell><PriorityBadge priority={s.priority} /></TableCell>
                <TableCell><StatusBadge status={s.status} /></TableCell>
                <TableCell className="text-xs">{s.frequency}</TableCell>
                <TableCell className="text-xs">{fmtDateTime(s.departure)}</TableCell>
                <TableCell className="text-xs">{fmtDateTime(s.arrival)}</TableCell>
                <TableCell className="text-xs text-right">{s.expectedLoad.toLocaleString()} MT</TableCell>
                <TableCell>
                  <button className="dfc-action-btn p-1.5 rounded-md" onClick={() => openDrawer("schedule", s)}><Eye className="h-3.5 w-3.5 text-violet-600" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-[11px] text-gray-500">Showing {Math.min(25, filteredSchedules.length)} of {filteredSchedules.length} schedules</div>
    </div>
  )

  // ─── Tab 5: Performance Analytics ──────────────────────
  const perfTab = (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <Card className="dfc-stat-card"><CardContent className="p-3"><div className="text-[10px] text-gray-500">Avg Punctuality</div><div className="text-lg font-bold" style={{ color: CC.violet }}>{Math.round(DATA.performanceMetrics.reduce((a, p) => a + p.punctuality, 0) / DATA.performanceMetrics.length)}%</div></CardContent></Card>
        <Card className="dfc-stat-card"><CardContent className="p-3"><div className="text-[10px] text-gray-500">Avg Speed</div><div className="text-lg font-bold" style={{ color: CC.sky }}>{Math.round(DATA.performanceMetrics.reduce((a, p) => a + p.avgSpeed, 0) / DATA.performanceMetrics.length)} km/h</div></CardContent></Card>
        <Card className="dfc-stat-card"><CardContent className="p-3"><div className="text-[10px] text-gray-500">Total Revenue</div><div className="text-lg font-bold" style={{ color: CC.emerald }}>{fmtINR(DATA.performanceMetrics.reduce((a, p) => a + p.revenue, 0))}</div></CardContent></Card>
        <Card className="dfc-stat-card"><CardContent className="p-3"><div className="text-[10px] text-gray-500">Total Incidents</div><div className="text-lg font-bold" style={{ color: CC.rose }}>{DATA.performanceMetrics.reduce((a, p) => a + p.incidents, 0)}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Speed Analysis: DFC vs Conventional</CardTitle></CardHeader>
          <CardContent className="px-4 pb-3">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={DATA.speedAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="dfcAvg" stroke={CC.violet} strokeWidth={2} dot={{ r: 3 }} name="DFC Avg" />
                <Line type="monotone" dataKey="conventionalAvg" stroke={CC.sky} strokeWidth={2} dot={{ r: 3 }} name="Conventional Avg" />
                <Line type="monotone" dataKey="target" stroke={CC.emerald} strokeWidth={2} strokeDasharray="6 3" dot={false} name="Target 75" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Monthly Throughput (Tons)</CardTitle></CardHeader>
          <CardContent className="px-4 pb-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DATA.monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="dfcTrains" fill={CC.violet} radius={[3, 3, 0, 0]} name="DFC Trains" />
                <Bar dataKey="conventional" fill={CC.sky} radius={[3, 3, 0, 0]} name="Conventional" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { key: "corridor", label: "Corridor" }, { key: "month", label: "Month" }, { key: "punctuality", label: "Punct. %" },
                { key: "avgSpeed", label: "Speed" }, { key: "throughput", label: "Throughput" },
                { key: "revenue", label: "Revenue" }, { key: "delays", label: "Delays" },
                { key: "incidents", label: "Incidents" }, { key: "fuelEfficiency", label: "Fuel Eff." },
              ].map(col => (
                <TableHead key={col.key} className="text-[11px] dfc-sort-header" onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon field={col.key} sortBy={sortBy} />
                </TableHead>
              ))}
              <TableHead className="text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPerf.slice(0, 20).map(p => (
              <TableRow key={p.id} className="dfc-table-row">
                <TableCell className="text-xs font-medium">{p.corridor.split(" ")[0]}</TableCell>
                <TableCell className="text-xs">{p.month}</TableCell>
                <TableCell className={cn("text-xs text-right font-semibold", p.punctuality >= 85 ? "text-emerald-600" : p.punctuality >= 70 ? "text-amber-600" : "text-rose-600")}>{p.punctuality}%</TableCell>
                <TableCell className="text-xs text-right">{p.avgSpeed} km/h</TableCell>
                <TableCell className="text-xs text-right">{(p.throughput / 1000).toFixed(0)}K</TableCell>
                <TableCell className="text-xs text-right">{fmtINR(p.revenue)}</TableCell>
                <TableCell className={cn("text-xs text-right font-semibold", p.delays > 15 ? "text-rose-600" : p.delays > 5 ? "text-amber-600" : "text-emerald-600")}>{p.delays}</TableCell>
                <TableCell className={cn("text-xs text-right font-semibold", p.incidents > 3 ? "text-rose-600" : p.incidents > 0 ? "text-amber-600" : "text-emerald-600")}>{p.incidents}</TableCell>
                <TableCell className="text-xs text-right">{p.fuelEfficiency} l/km</TableCell>
                <TableCell>
                  <button className="dfc-action-btn p-1.5 rounded-md" onClick={() => openDrawer("perf", p)}><Eye className="h-3.5 w-3.5 text-violet-600" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  const tabContent = [dashboardTab, trainTab, corridorTab, terminalTab, scheduleTab, perfTab]

  // ─── Drawer Renders ────────────────────────────────────
  const renderDrawer = () => {
    if (!drawerData) return null

    const drawerConfigs: Record<string, { title: string; gradient: string }> = {
      train: { title: "Train Details", gradient: "from-violet-600 to-indigo-600" },
      corridor: { title: "Corridor Details", gradient: "from-violet-600 to-purple-600" },
      terminal: { title: "Terminal Details", gradient: "from-emerald-600 to-teal-600" },
      schedule: { title: "Schedule Details", gradient: "from-sky-600 to-blue-600" },
      perf: { title: "Performance Details", gradient: "from-amber-600 to-orange-600" },
    }
    const cfg = drawerConfigs[drawerType] || { title: "Details", gradient: "from-violet-600 to-indigo-600" }

    return (
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader>
            <div className={cn("h-24 -mx-6 -mt-6 mb-4 flex items-end px-6 pb-3 rounded-b-lg bg-gradient-to-r", cfg.gradient)}>
              <SheetTitle className="text-white text-sm">{cfg.title}</SheetTitle>
            </div>
            <SheetDescription className="text-xs text-gray-500 dark:text-gray-400">
              {drawerData.trainNo || drawerData.name || drawerData.id}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {/* Train Drawer */}
            {drawerType === "train" && drawerData && (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-violet-100 dark:bg-violet-900/30"><TrainFront className="h-5 w-5 text-violet-600" /></div>
                  <div>
                    <div className="text-sm font-bold">Train {drawerData.trainNo}</div>
                    <div className="text-xs text-gray-500">{drawerData.route}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={drawerData.status} />
                  <span className="dfc-conn-pill bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{drawerData.commodity}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] text-gray-500">Current Speed</div>
                  <SpeedGauge speed={drawerData.speed} maxSpeed={100} />
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] text-gray-500">Load</div>
                  <LoadIndicator loadWeight={drawerData.loadWeight} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Distance</div>
                    <div className="text-sm font-bold" style={{ color: CC.violet }}>{drawerData.distance} km</div>
                  </div>
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Wagons</div>
                    <div className="text-sm font-bold" style={{ color: CC.sky }}>{drawerData.wagonCount}</div>
                  </div>
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Delay</div>
                    <div className="text-sm font-bold" style={{ color: drawerData.delay > 60 ? CC.rose : drawerData.delay > 15 ? CC.amber : CC.emerald }}>{drawerData.delay}m</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Origin</span><span className="font-medium">{drawerData.origin}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Destination</span><span className="font-medium">{drawerData.destination}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Loco Type</span><span className="font-medium">{drawerData.locoType}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Rake Type</span><span className="font-medium">{drawerData.rakeType}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Operator</span><span className="font-medium">{drawerData.operator}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Fuel</span><span className="font-medium">{drawerData.fuelConsumption} l/km</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Live tracking activated") }}>Live Track</Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Schedule adjusted") }}>Reschedule</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { toast.success("Notified control room") }}><Radio className="h-3.5 w-3.5" /></Button>
                </div>
              </>
            )}

            {/* Corridor Drawer */}
            {drawerType === "corridor" && drawerData && (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-violet-100 dark:bg-violet-900/30"><MapPin className="h-5 w-5 text-violet-600" /></div>
                  <div>
                    <div className="text-sm font-bold">{drawerData.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={drawerData.status} />
                      <span className="text-[10px] text-gray-500">{drawerData.openDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center py-2">
                  <CorridorProgressRing completed={drawerData.completedLength} total={drawerData.totalLength} />
                  <div className="ml-4">
                    <div className="text-lg font-bold" style={{ color: CC.violet }}>{drawerData.completedLength} / {drawerData.totalLength} km</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Stations</div>
                    <div className="text-sm font-bold" style={{ color: CC.violet }}>{drawerData.stations}</div>
                  </div>
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Terminals</div>
                    <div className="text-sm font-bold" style={{ color: CC.sky }}>{drawerData.terminals}</div>
                  </div>
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Investment</div>
                    <div className="text-sm font-bold" style={{ color: CC.amber }}>{fmtINR(drawerData.investment * 10000000)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Daily Capacity</span><span className="font-medium">{drawerData.dailyCapacity} trains</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Utilization</span><span className="font-medium">{drawerData.currentUtilization}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Max Speed</span><span className="font-medium">{drawerData.maxSpeed} km/h</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Avg Transit</span><span className="font-medium">{drawerData.avgTransitTime} hrs</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Corridor report generated") }}>Report</Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Capacity plan opened") }}>Capacity Plan</Button>
                </div>
              </>
            )}

            {/* Terminal Drawer */}
            {drawerType === "terminal" && drawerData && (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30"><Package className="h-5 w-5 text-emerald-600" /></div>
                  <div>
                    <div className="text-sm font-bold">{drawerData.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={drawerData.status} />
                      <TerminalConnectivityBadge conn={drawerData.connectivity} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Capacity</div>
                    <div className="text-sm font-bold" style={{ color: CC.emerald }}>{drawerData.capacity.toLocaleString()}</div>
                  </div>
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Utilization</div>
                    <div className="text-sm font-bold" style={{ color: drawerData.utilization > 85 ? CC.rose : CC.sky }}>{drawerData.utilization}%</div>
                  </div>
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Dwell</div>
                    <div className="text-sm font-bold" style={{ color: drawerData.avgDwellTime > 48 ? CC.rose : CC.amber }}>{drawerData.avgDwellTime}h</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Corridor</span><span className="font-medium">{drawerData.corridor}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{drawerData.type}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Monthly</span><span className="font-medium">{(drawerData.monthlyThroughput / 1000).toFixed(0)}K MT</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Yard Cap.</span><span className="font-medium">{drawerData.yardCapacity}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Cranes</span><span className="font-medium">{drawerData.cranes}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Rail Lines</span><span className="font-medium">{drawerData.railLines}</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Terminal report generated") }}>Report</Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Capacity expanded") }}>Expand</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { toast.success("Diagram downloaded") }}><Download className="h-3.5 w-3.5" /></Button>
                </div>
              </>
            )}

            {/* Schedule Drawer */}
            {drawerType === "schedule" && drawerData && (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-sky-100 dark:bg-sky-900/30"><Clock className="h-5 w-5 text-sky-600" /></div>
                  <div>
                    <div className="text-sm font-bold font-mono">{drawerData.trainNo}</div>
                    <div className="text-xs text-gray-500">{drawerData.route}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={drawerData.status} />
                  <PriorityBadge priority={drawerData.priority} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Departure</div>
                    <div className="text-sm font-bold" style={{ color: CC.sky }}>{fmtDateTime(drawerData.departure)}</div>
                  </div>
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Arrival</div>
                    <div className="text-sm font-bold" style={{ color: CC.emerald }}>{fmtDateTime(drawerData.arrival)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Origin</span><span className="font-medium">{drawerData.origin}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Destination</span><span className="font-medium">{drawerData.destination}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Commodity</span><span className="font-medium">{drawerData.commodity}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Rake Type</span><span className="font-medium">{drawerData.rakeType}</span></div>
                  <div className="flex justify-between col-span-2"><span className="text-gray-500">Frequency</span><span className="font-medium">{drawerData.frequency}</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Schedule confirmed") }}>Confirm</Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Schedule modified") }}>Modify</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { toast.success("Cancelled") }}><AlertTriangle className="h-3.5 w-3.5" /></Button>
                </div>
              </>
            )}

            {/* Performance Drawer */}
            {drawerType === "perf" && drawerData && (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/30"><BarChart3 className="h-5 w-5 text-amber-600" /></div>
                  <div>
                    <div className="text-sm font-bold">{drawerData.corridor}</div>
                    <div className="text-xs text-gray-500">{drawerData.month}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Punctuality</div>
                    <div className="text-sm font-bold" style={{ color: drawerData.punctuality >= 85 ? CC.emerald : drawerData.punctuality >= 70 ? CC.amber : CC.rose }}>{drawerData.punctuality}%</div>
                  </div>
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Revenue</div>
                    <div className="text-sm font-bold" style={{ color: CC.violet }}>{fmtINR(drawerData.revenue)}</div>
                  </div>
                  <div className="dfc-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
                    <div className="text-[10px] text-gray-500">Throughput</div>
                    <div className="text-sm font-bold" style={{ color: CC.sky }}>{(drawerData.throughput / 1000).toFixed(0)}K</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Avg Speed</span><span className="font-medium">{drawerData.avgSpeed} km/h</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Delays</span><span className="font-medium">{drawerData.delays}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Cancellations</span><span className="font-medium">{drawerData.cancellations}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Incidents</span><span className="font-medium">{drawerData.incidents}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Fuel Eff.</span><span className="font-medium">{drawerData.fuelEfficiency} l/km</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Coal Vol.</span><span className="font-medium">{(drawerData.coalVolume / 1000).toFixed(0)}K MT</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Report downloaded") }}>Download</Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => { toast.success("Drill-down opened") }}>Drill Down</Button>
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
      <PageHeader title="Dedicated Freight Corridor" description="Indian DFC network analytics — Western, Eastern corridors, rail freight optimization, terminal management and scheduling" />

      <Tabs value={String(activeTab)} onValueChange={v => { setActiveTab(Number(v)); setSearchTerm(""); setFilterStatus("All") }}>
        <TabsList className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg h-auto">
          {tabs.map((tab, i) => (
            <TabsTrigger key={i} value={String(i)} className={cn("text-xs px-3 py-1.5 rounded-md", activeTab === i && "dfc-tab-active")}>
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
