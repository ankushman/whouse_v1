"use client"
import { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  Network, Train, Ship, Plane, Truck, MapPin, Clock, DollarSign,
  TrendingUp, ArrowRight, Activity, Target, Zap, ArrowDownRight, ArrowUpRight,
  BarChart3, Package, Route,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { ExportButton } from "@/components/shared/export-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CC = { blue: "#1e40af", cyan: "#06b6d4", orange: "#ea580c", green: "#16a34a", amber: "#d97706", rose: "#e11d48", slate: "#475569", emerald: "#059669", sky: "#0284c7", teal: "#0d9488", purple: "#7c3aed" }
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}

function generateData() {
  const r = seededRandom(189189189)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(r() * arr.length)]
  const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min

  const HUB_TYPES = ["Rail-Road Terminal", "Port Terminal", "ICD/CFS", "Air Cargo Hub", "Inland Dry Port"]
  const HUB_STATUSES = ["Operational", "Congested", "Under Maintenance", "Closed", "New"]
  const REGIONS = ["West", "South", "North", "East"]
  const CONTAINER_STATUSES = ["In Transit", "At Hub", "Loading", "Unloading", "Custom Hold", "Delivered"]
  const CONTAINER_SIZES = ["20ft", "40ft", "45ft", "HC"]
  const TRANSPORT_MODES = ["Rail", "Road", "Coastal Ship", "Inland Waterway", "Air"]
  const PRIORITIES = ["Normal", "Express", "Priority", "Urgent"]
  const TRANSFER_TYPES = ["Rail-to-Road", "Port-to-Rail", "Port-to-Road", "Air-to-Road"]
  const SCHEDULE_STATUSES = ["Scheduled", "In Progress", "Completed", "Delayed", "Cancelled", "On Hold"]

  const HUB_NAMES = [
    "Nhava Sheva ICD", "Mundra Port Terminal", "Tughlakabad ICD", "Chennai Container Terminal",
    "Dadri ICD", "Whitefield ICD", "Pipavav Port", "Hazira Port", "Kolkata Dock", "Cochin Port",
    "Visakhapatnam Port", "Kandla Port", "Tuticorin Port", "Mormugao Port", "Haldia Dock",
    "Loni ICD", "Pantnagar ICD", "Bangalore ICD", "Hyderabad ICD", "Ahmedabad ICD",
    "Jaipur ICD", "Lucknow ICD", "Patna ICD", "Guwahati ICD", "Bhopal ICD",
    "Indore ICD", "Nagpur ICD", "Goa ICD", "Surat ICD", "Rajkot ICD",
    "Coimbatore ICD", "Madurai ICD", "Tirupur ICD", "Mangalore Port", "Karwar Port",
    "Paradip Port", "Ennore Port", "Krishnapatnam Port", "Dhamra Port", "Gangavaram Port",
    "Mumbai Airport Cargo", "Delhi T3 Cargo", "Bangalore Airport Cargo", "Hyderabad Airport Cargo",
    "Chennai Airport Cargo", "Kolkata Airport Cargo", "Kochi Air Freight", "Jaipur Cargo Hub",
    "Lucknow Air Cargo", "Pune ICD", "Nashik ICD", "Aurangabad ICD", "Vadodara ICD",
    "Salem ICD", "Guntur ICD", "Vijayawada ICD", "Jharsuguda Rail Hub", "Bilaspur ICD", "Varanasi ICD",
  ]
  const MANAGERS = ["R.K. Sharma", "A. Patel", "S. Krishnan", "M. Gupta", "P. Singh", "V. Reddy", "D. Mehta", "J. Rao", "N. Verma", "T. Nair"]

  const hubs = HUB_NAMES.slice(0, 60).map((name, i) => ({
    id: `ITH-${String(i + 1).padStart(4, "0")}`, name, type: pick(HUB_TYPES), status: pick(HUB_STATUSES),
    region: pick(REGIONS), capacity: ri(25, 98), throughput: ri(500, 15000), dwellTime: ri(4, 72),
    connectivity: ri(1, 10), area: ri(5000, 500000), railConnected: r() > 0.4, portConnected: r() > 0.5,
    established: ri(2005, 2024), manager: pick(MANAGERS),
  }))

  const containers = Array.from({ length: 80 }, (_, i) => {
    const o = pick(hubs), d = pick(hubs.filter(h => h.id !== o.id))
    const t = pick(hubs.filter(h => h.id !== o.id && h.id !== d.id))
    const etd = Date.now() - ri(1, 30) * 86400000, eta = etd + ri(2, 15) * 86400000
    return {
      id: `CNT-${String(i + 1).padStart(5, "0")}`, origin: o.name, destination: d.name, transferHub: t.name,
      mode: pick(TRANSPORT_MODES), status: pick(CONTAINER_STATUSES), size: pick(CONTAINER_SIZES),
      priority: pick(PRIORITIES), weight: +(r() * 25 + 2).toFixed(1), etd, eta, daysInTransit: ri(1, 20),
      shipper: pick(["Tata Steel", "Reliance Ind.", "Mahindra Log.", "TVS Supply", "Blue Dart", "DHL India"]),
    }
  })

  const schedules = Array.from({ length: 50 }, (_, i) => {
    const o = pick(hubs), d = pick(hubs.filter(h => h.id !== o.id))
    const dep = Date.now() + ri(-5, 14) * 86400000, arr = dep + ri(1, 8) * 86400000
    return {
      id: `TRS-${String(i + 1).padStart(4, "0")}`, route: `${o.name} → ${d.name}`,
      type: pick(TRANSFER_TYPES), mode: pick(TRANSPORT_MODES), status: pick(SCHEDULE_STATUSES),
      priority: pick(PRIORITIES), departure: dep, arrival: arr, containers: ri(3, 45), capacityUtil: ri(40, 100),
    }
  })

  const costs = Array.from({ length: 60 }, (_, i) => {
    const o = pick(hubs), d = pick(hubs.filter(h => h.id !== o.id))
    const mode = pick(TRANSPORT_MODES), dist = ri(100, 3000)
    const baseRate = mode === "Air" ? ri(8, 15) : mode === "Rail" ? ri(1, 3) : ri(2, 5)
    const fuel = +(baseRate * r() * 0.4).toFixed(2), handling = +(baseRate * r() * 0.2).toFixed(2)
    const storage = +(r() * 500).toFixed(0), customs = +(r() * 2000).toFixed(0)
    const totalCost = +(baseRate * dist + fuel * dist + handling * dist + storage + customs).toFixed(0)
    return { id: `CST-${String(i + 1).padStart(4, "0")}`, route: `${o.name} → ${d.name}`, mode, costPerTon: baseRate, distance: dist, transitDays: ri(1, 10), reliability: ri(75, 99), totalCost: +totalCost, baseRate, fuel, handling, storage, customs }
  })

  const performance = Array.from({ length: 40 }, (_, i) => {
    const h = hubs[i % hubs.length]
    const onTime = ri(70, 99), dwell = ri(8, 72), damage = +(r() * 3).toFixed(2)
    const sla = +((onTime * 0.5 + (100 - Math.min(dwell, 72) / 72 * 100) * 0.25 + (100 - damage * 20) * 0.25)).toFixed(1)
    return { id: `PERF-${String(i + 1).padStart(4, "0")}`, hub: h.name, onTime, dwellTime: dwell, damageRate: damage, throughput: ri(1000, 12000), slaScore: Math.min(sla, 100), status: onTime >= 95 ? "Excellent" : onTime >= 85 ? "Good" : "Needs Improvement", region: h.region, trend: pick(["up", "down", "stable"]) }
  })

  const monthlyThroughput = MONTHS.map(m => ({ month: m, roadTons: ri(8000, 25000), railTons: ri(5000, 18000), portTons: ri(2000, 10000) }))
  const hubTypeData = HUB_TYPES.map(t => ({ name: t, value: hubs.filter(h => h.type === t).length }))
  const modeShareData = TRANSPORT_MODES.map(m => ({ mode: m, share: m === "Road" ? 42 : m === "Rail" ? 28 : m === "Coastal Ship" ? 15 : m === "Air" ? 10 : 5 }))
  const hubRadarData = hubs.slice(0, 6).map(h => ({ hub: h.name.split(" ")[0], throughput: Math.min(h.throughput / 150, 100), efficiency: ri(60, 98), dwell: Math.max(0, 100 - h.dwellTime), cost: ri(50, 95) }))
  const weeklyScheduleData = DAYS.map(d => ({ day: d, scheduled: ri(5, 20), completed: ri(3, 15), delayed: ri(0, 5) }))
  const costByModeData = TRANSPORT_MODES.map(m => ({ mode: m, cost: m === "Air" ? ri(150, 300) : m === "Rail" ? ri(40, 80) : m === "Road" ? ri(60, 120) : m === "Coastal Ship" ? ri(30, 70) : ri(20, 50) }))
  const costTrendData = MONTHS.map(m => ({ month: m, road: ri(2.5, 5), rail: ri(1.5, 3), coastal: ri(1, 2.5) }))
  const slaTrendData = MONTHS.map(m => ({ month: m, target: 95, actual: ri(88, 99) }))

  return { hubs, containers, schedules, costs, performance, monthlyThroughput, hubTypeData, modeShareData, hubRadarData, weeklyScheduleData, costByModeData, costTrendData, slaTrendData, HUB_TYPES, HUB_STATUSES, CONTAINER_STATUSES, CONTAINER_SIZES, TRANSPORT_MODES, PRIORITIES, TRANSFER_TYPES, SCHEDULE_STATUSES, REGIONS }
}

// Unique Visual Components
function CapacityBar({ value }: { value: number }) {
  const color = value < 70 ? "bg-emerald-500" : value <= 90 ? "bg-amber-500" : "bg-rose-500"
  return <div className="ith-cap-bar w-full h-2 rounded-full bg-muted overflow-hidden"><div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} /></div>
}

function ConnectivityScore({ score }: { score: number }) {
  const cls = score <= 3 ? "bg-amber-100 text-amber-700" : score <= 7 ? "bg-cyan-100 text-cyan-700" : "bg-emerald-100 text-emerald-700"
  return <Badge className={cn("ith-conn-score text-[10px] font-bold rounded-md px-2", cls)}>{score}/10</Badge>
}

function RouteTimeline({ origin, transfer, destination, mode }: { origin: string; transfer: string; destination: string; mode: string }) {
  const MIcon = mode === "Rail" ? Train : mode === "Air" ? Plane : mode === "Coastal Ship" ? Ship : Truck
  return (
    <div className="ith-route-timeline flex items-center gap-1 py-3 px-2">
      <div className="flex flex-col items-center gap-1"><div className="h-3 w-3 rounded-full bg-blue-600" /><span className="text-[9px] text-muted-foreground max-w-[70px] truncate text-center">{origin.split(" ")[0]}</span></div>
      <div className="flex-1 flex items-center gap-0.5"><div className="h-0.5 flex-1 bg-cyan-400" /><MIcon className="h-3 w-3 text-cyan-600" /><div className="h-0.5 flex-1 bg-orange-400" /></div>
      <div className="flex flex-col items-center gap-1"><div className="h-3 w-3 rounded-full bg-orange-500" /><span className="text-[9px] text-muted-foreground max-w-[70px] truncate text-center">{transfer.split(" ")[0]}</span></div>
      <div className="flex-1 flex items-center gap-0.5"><div className="h-0.5 flex-1 bg-orange-400" /><MIcon className="h-3 w-3 text-orange-600" /><div className="h-0.5 flex-1 bg-emerald-400" /></div>
      <div className="flex flex-col items-center gap-1"><div className="h-3 w-3 rounded-full bg-emerald-600" /><span className="text-[9px] text-muted-foreground max-w-[70px] truncate text-center">{destination.split(" ")[0]}</span></div>
    </div>
  )
}

function CostBreakdown({ data }: { data: { baseRate: number; fuel: number; handling: number; storage: number; customs: number; totalCost: number } }) {
  const items = [
    { label: "Base Rate", value: data.baseRate, color: "bg-blue-500", pct: Math.round(data.baseRate / (data.totalCost || 1) * 100) },
    { label: "Fuel", value: data.fuel, color: "bg-orange-500", pct: Math.round(data.fuel / (data.totalCost || 1) * 100) },
    { label: "Handling", value: data.handling, color: "bg-cyan-500", pct: Math.round(data.handling / (data.totalCost || 1) * 100) },
    { label: "Storage", value: data.storage, color: "bg-teal-500", pct: Math.round(data.storage / (data.totalCost || 1) * 100) },
    { label: "Customs", value: data.customs, color: "bg-rose-500", pct: Math.round(data.customs / (data.totalCost || 1) * 100) },
  ]
  return (
    <div className="ith-cost-breakdown space-y-2 px-2">
      {items.map(it => (
        <div key={it.label} className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-16 shrink-0">{it.label}</span>
          <div className="flex-1 h-3 rounded bg-muted overflow-hidden"><div className={cn("h-full rounded", it.color)} style={{ width: `${Math.min(it.pct, 100)}%` }} /></div>
          <span className="text-[10px] font-medium w-10 text-right">{it.pct}%</span>
        </div>
      ))}
    </div>
  )
}

function SLARing({ score }: { score: number }) {
  const color = score >= 95 ? CC.green : score >= 85 ? CC.amber : CC.rose
  const circ = 2 * Math.PI * 36, offset = circ - (score / 100) * circ
  return (
    <div className="ith-sla-ring relative flex items-center justify-center">
      <svg width="90" height="90" className="-rotate-90"><circle cx="45" cy="45" r="36" fill="none" stroke="#e5e7eb" strokeWidth="6" /><circle cx="45" cy="45" r="36" fill="none" stroke={color} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" /></svg>
      <span className="absolute text-lg font-bold" style={{ color }}>{score.toFixed(1)}%</span>
    </div>
  )
}

// Badge Helpers
function SBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Operational: "bg-emerald-100 text-emerald-700", Congested: "bg-amber-100 text-amber-700",
    "Under Maintenance": "bg-blue-100 text-blue-700", Closed: "bg-slate-800 text-white", New: "bg-purple-100 text-purple-700",
    "In Transit": "bg-sky-100 text-sky-700", "At Hub": "bg-amber-100 text-amber-700",
    Loading: "bg-blue-100 text-blue-700", Unloading: "bg-teal-100 text-teal-700",
    "Custom Hold": "bg-slate-800 text-white", Delivered: "bg-emerald-100 text-emerald-700",
    Scheduled: "bg-blue-100 text-blue-700", "In Progress": "bg-amber-100 text-amber-700",
    Completed: "bg-emerald-100 text-emerald-700", Delayed: "bg-rose-100 text-rose-700",
    Cancelled: "bg-slate-200 text-slate-600", "On Hold": "bg-slate-800 text-white",
    Excellent: "bg-emerald-100 text-emerald-700", Good: "bg-blue-100 text-blue-700", "Needs Improvement": "bg-rose-100 text-rose-700",
  }
  return <Badge variant="outline" className={cn("ith-sbadge text-[10px] px-2 py-0.5", m[status] || "")}>{status}</Badge>
}

function SizeBadge({ size }: { size: string }) {
  const m: Record<string, string> = { "20ft": "bg-blue-100 text-blue-700", "40ft": "bg-cyan-100 text-cyan-700", "45ft": "bg-purple-100 text-purple-700", HC: "bg-orange-100 text-orange-700" }
  return <Badge className={cn("ith-size-badge text-[10px] px-2", m[size] || "")}>{size}</Badge>
}

function ModeBadge({ mode }: { mode: string }) {
  const m: Record<string, string> = { Rail: "bg-blue-100 text-blue-700", Road: "bg-orange-100 text-orange-700", "Coastal Ship": "bg-cyan-100 text-cyan-700", "Inland Waterway": "bg-teal-100 text-teal-700", Air: "bg-purple-100 text-purple-700" }
  return <Badge className={cn("ith-mode-badge text-[10px] px-2", m[mode] || "")}>{mode}</Badge>
}

function PriorityBadge({ priority }: { priority: string }) {
  const m: Record<string, string> = { Normal: "bg-slate-100 text-slate-600", Express: "bg-blue-100 text-blue-700", Priority: "bg-amber-100 text-amber-700", Urgent: "bg-slate-800 text-white" }
  return <Badge className={cn("ith-priority-badge text-[10px] px-2", m[priority] || "")}>{priority}</Badge>
}

function TypeBadge({ type }: { type: string }) {
  const m: Record<string, string> = { "Rail-to-Road": "bg-blue-100 text-blue-700", "Port-to-Rail": "bg-cyan-100 text-cyan-700", "Port-to-Road": "bg-orange-100 text-orange-700", "Air-to-Road": "bg-purple-100 text-purple-700" }
  return <Badge className={cn("ith-type-badge text-[10px] px-2", m[type] || "")}>{type}</Badge>
}

function RegionBadge({ region }: { region: string }) {
  const m: Record<string, string> = { West: "bg-blue-100 text-blue-700", South: "bg-emerald-100 text-emerald-700", North: "bg-orange-100 text-orange-700", East: "bg-purple-100 text-purple-700" }
  return <Badge className={cn("ith-region-badge text-[10px] px-1.5", m[region] || "")}>{region}</Badge>
}

const sheetGrad = "bg-gradient-to-r from-[#1e40af] to-[#06b6d4] text-white"
const fmtDate = (ts: number) => new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
const fmtINR = (v: number) => `\u20b9${(v / 100000).toFixed(1)}L`

export default function IntermodalTransportHubView() {
  const data = useMemo(() => generateData(), [])
  const [tab, setTab] = useState("0")
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState("")
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRegion, setFilterRegion] = useState("all")
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()

  const sortFn = <T extends Record<string, any>>(items: T[], key: any) => {
    const s = [...items].sort((a, b) => { const va = a[key], vb = b[key]; return va < vb ? -1 : va > vb ? 1 : 0 })
    return sortDir === "asc" ? s : s.reverse()
  }

  const SH = ({ label, field }: { label: string; field: any }) => (
    <TableHead className="underline-animated cursor-pointer select-none text-[11px]" onClick={() => { if (sortBy === field) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortBy(field); setSortDir("asc") } }}>
      <span className="ith-sort-head flex items-center gap-1">{label} {sortBy === field && (sortDir === "asc" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}</span>
    </TableHead>
  )

  const ActBtn = ({ d, t }: { d: any; t: string }) => (
    <Button variant="ghost" size="sm" className="press-scale ith-view-btn h-6 text-[10px]" onClick={() => { setDrawerData(d); setDrawerType(t) }}><Activity className="h-3 w-3 mr-1" />View</Button>
  )

  const DrawerActions = ({ id, name }: { id: string; name: string }) => (
    <div className="flex gap-2 pt-2">
      {[{ label: "Edit", icon: Zap }, { label: "Details", icon: Target }, { label: "Report", icon: BarChart3 }].map(a => (
        <Button key={a.label} variant="outline" size="sm" className="press-scale btn-outline-animate ith-action-btn flex-1 text-xs h-8" onClick={() => toast.success(a.label, `${id} ${a.label.toLowerCase()} action triggered`)}><a.icon className="h-3 w-3 mr-1" />{a.label}</Button>
      ))}
    </div>
  )

  // Tab 0: Dashboard
  const DashboardTab = () => {
    const kpis = [
      { label: "Total Hubs", value: data.hubs.length, icon: Network, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Active Transfers", value: data.schedules.filter(s => s.status === "In Progress" || s.status === "Scheduled").length, icon: ArrowRight, color: "text-cyan-600", bg: "bg-cyan-50" },
      { label: "Monthly Throughput (tons)", value: data.monthlyThroughput.reduce((a, m) => a + m.roadTons + m.railTons + m.portTons, 0).toLocaleString(), icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
      { label: "Avg Dwell Time (hrs)", value: (data.hubs.reduce((a, h) => a + h.dwellTime, 0) / data.hubs.length).toFixed(1), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Intermodal Efficiency", value: "87.3%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Cost Savings", value: "\u20b942.5L", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
    ]
    return (
      <div className="ith-dashboard space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpis.map(k => (
            <Card key={k.label} className="inner-glow hover-lift-sm glass-subtle ith-kpi-card border-border/60"><CardContent className="p-4 flex items-center gap-3">
              <div className={cn("ith-kpi-icon p-2 rounded-lg", k.bg)}><k.icon className={cn("h-4 w-4", k.color)} /></div>
              <div><p className="text-[10px] text-muted-foreground uppercase tracking-wide">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></div>
            </CardContent></Card>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover-lift-sm ith-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Throughput (tons)</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><AreaChart data={data.monthlyThroughput}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="roadTons" stackId="1" stroke={CC.orange} fill={CC.orange} fillOpacity={0.6} name="Road" />
              <Area type="monotone" dataKey="railTons" stackId="1" stroke={CC.blue} fill={CC.blue} fillOpacity={0.6} name="Rail" />
              <Area type="monotone" dataKey="portTons" stackId="1" stroke={CC.cyan} fill={CC.cyan} fillOpacity={0.6} name="Port" />
            </AreaChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="hover-lift-sm ith-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Hub Type Distribution</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><PieChart>
              <Pie data={data.hubTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {[CC.blue, CC.cyan, CC.orange, CC.purple, CC.emerald].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="hover-lift-sm ith-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Mode Share (%)</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><BarChart data={data.modeShareData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="mode" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="share" radius={[4, 4, 0, 0]}>{[CC.orange, CC.blue, CC.cyan, CC.purple, CC.teal].map((c, i) => <Cell key={i} fill={c} />)}</Bar>
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
        </div>
        <Card className="hover-lift-sm ith-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Hub Performance Radar</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={260}><RadarChart data={data.hubRadarData}>
            <PolarGrid stroke="#e5e7eb" /><PolarAngleAxis dataKey="hub" tick={{ fontSize: 10 }} /><PolarRadiusAxis tick={{ fontSize: 9 }} />
            <Radar name="Throughput" dataKey="throughput" stroke={CC.blue} fill={CC.blue} fillOpacity={0.2} />
            <Radar name="Efficiency" dataKey="efficiency" stroke={CC.cyan} fill={CC.cyan} fillOpacity={0.15} />
            <Radar name="Dwell" dataKey="dwell" stroke={CC.orange} fill={CC.orange} fillOpacity={0.15} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} />
          </RadarChart></ResponsiveContainer>
        </CardContent></Card>
      </div>
    )
  }

  // Tab 1: Transport Hubs
  const HubsTab = () => {
    const rows = sortFn(data.hubs.filter(h => {
      if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.id.toLowerCase().includes(search.toLowerCase())) return false
      if (filterType !== "all" && h.type !== filterType) return false
      if (filterStatus !== "all" && h.status !== filterStatus) return false
      if (filterRegion !== "all" && h.region !== filterRegion) return false
      return true
    }), sortBy)
    return (
      <div className="ith-hubs-tab space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search hubs..." value={search} onChange={e => setSearch(e.target.value)} className="ith-search h-8 text-xs w-60" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Types</option>{data.HUB_TYPES.map(t => <option key={t}>{t}</option>)}</select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{data.HUB_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
          <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Regions</option>{data.REGIONS.map(r => <option key={r}>{r}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="ID" field="id" /><SH label="Name" field="name" /><TableHead className="text-[11px]">Type</TableHead><TableHead className="text-[11px]">Region</TableHead><TableHead className="text-[11px]">Status</TableHead><SH label="Capacity %" field="capacity" /><SH label="Throughput" field="throughput" /><SH label="Dwell Time" field="dwellTime" /><TableHead className="text-[11px]">Connectivity</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(h => (
          <TableRow key={h.id} className="ith-hub-row">
            <TableCell className="text-xs font-mono">{h.id}</TableCell><TableCell className="text-xs font-medium max-w-[120px] truncate">{h.name}</TableCell>
            <TableCell><Badge variant="outline" className="badge-interactive text-[10px]">{h.type}</Badge></TableCell><TableCell><RegionBadge region={h.region} /></TableCell>
            <TableCell><SBadge status={h.status} /></TableCell>
            <TableCell><div className="numeric-cell w-20"><CapacityBar value={h.capacity} /><span className="text-[10px] text-muted-foreground">{h.capacity}%</span></div></TableCell>
            <TableCell className="text-xs">{h.throughput.toLocaleString()}</TableCell><TableCell className="text-xs">{h.dwellTime}h</TableCell>
            <TableCell><ConnectivityScore score={h.connectivity} /></TableCell><TableCell><ActBtn d={h} t="hub" /></TableCell>
          </TableRow>
        ))}</TableBody></Table></div>
        <p className="text-xs text-muted-foreground">Showing {Math.min(rows.length, 15)} of {rows.length} hubs</p>
      </div>
    )
  }

  // Tab 2: Container Tracking
  const ContainersTab = () => {
    const [fm, setFm] = useState("all"), [fs, setFs] = useState("all")
    const rows = sortFn(data.containers.filter(c => {
      if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.origin.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus !== "all" && c.status !== filterStatus) return false
      if (fm !== "all" && c.mode !== fm) return false
      if (fs !== "all" && c.size !== fs) return false
      return true
    }), sortBy)
    return (
      <div className="ith-containers-tab space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search containers..." value={search} onChange={e => setSearch(e.target.value)} className="ith-search h-8 text-xs w-60" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{data.CONTAINER_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
          <select value={fm} onChange={e => setFm(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Modes</option>{data.TRANSPORT_MODES.map(m => <option key={m}>{m}</option>)}</select>
          <select value={fs} onChange={e => setFs(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Sizes</option>{data.CONTAINER_SIZES.map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="Container ID" field="id" /><TableHead className="text-[11px]">Origin</TableHead><TableHead className="text-[11px]">Destination</TableHead>
          <TableHead className="text-[11px]">Mode</TableHead><TableHead className="text-[11px]">Status</TableHead><SH label="Weight" field="weight" />
          <TableHead className="text-[11px]">ETD</TableHead><TableHead className="text-[11px]">ETA</TableHead><SH label="Days" field="daysInTransit" /><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(c => (
          <TableRow key={c.id} className="ith-container-row">
            <TableCell className="text-xs font-mono">{c.id}</TableCell><TableCell className="text-[10px] max-w-[100px] truncate">{c.origin}</TableCell><TableCell className="text-[10px] max-w-[100px] truncate">{c.destination}</TableCell>
            <TableCell><ModeBadge mode={c.mode} /></TableCell><TableCell><SBadge status={c.status} /></TableCell>
            <TableCell className="numeric-cell text-xs">{c.weight}t</TableCell><TableCell className="text-[10px]">{fmtDate(c.etd)}</TableCell><TableCell className="text-[10px]">{fmtDate(c.eta)}</TableCell>
            <TableCell className="text-xs">{c.daysInTransit}d</TableCell><TableCell><ActBtn d={c} t="container" /></TableCell>
          </TableRow>
        ))}</TableBody></Table></div>
        <p className="text-xs text-muted-foreground">Showing {Math.min(rows.length, 15)} of {rows.length} containers</p>
      </div>
    )
  }

  // Tab 3: Transfer Scheduling
  const SchedulingTab = () => {
    const [ft, setFt] = useState("all")
    const rows = sortFn(data.schedules.filter(s => {
      if (search && !s.id.toLowerCase().includes(search.toLowerCase()) && !s.route.toLowerCase().includes(search.toLowerCase())) return false
      if (ft !== "all" && s.type !== ft) return false
      if (filterStatus !== "all" && s.status !== filterStatus) return false
      return true
    }), sortBy)
    return (
      <div className="ith-scheduling-tab space-y-4">
        <Card className="hover-lift-sm ith-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Weekly Schedule Overview</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={200}><BarChart data={data.weeklyScheduleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="scheduled" fill={CC.blue} radius={[2, 2, 0, 0]} name="Scheduled" /><Bar dataKey="completed" fill={CC.green} radius={[2, 2, 0, 0]} name="Completed" /><Bar dataKey="delayed" fill={CC.rose} radius={[2, 2, 0, 0]} name="Delayed" />
          </BarChart></ResponsiveContainer>
        </CardContent></Card>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search schedules..." value={search} onChange={e => setSearch(e.target.value)} className="ith-search h-8 text-xs w-60" />
          <select value={ft} onChange={e => setFt(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Types</option>{data.TRANSFER_TYPES.map(t => <option key={t}>{t}</option>)}</select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{data.SCHEDULE_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="ID" field="id" /><TableHead className="text-[11px]">Route</TableHead><TableHead className="text-[11px]">Type</TableHead><TableHead className="text-[11px]">Mode</TableHead>
          <TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Departure</TableHead><TableHead className="text-[11px]">Arrival</TableHead>
          <SH label="Containers" field="containers" /><SH label="Util %" field="capacityUtil" /><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(s => (
          <TableRow key={s.id} className="ith-schedule-row">
            <TableCell className="text-xs font-mono">{s.id}</TableCell><TableCell className="text-[10px] max-w-[120px] truncate">{s.route}</TableCell>
            <TableCell><TypeBadge type={s.type} /></TableCell><TableCell><ModeBadge mode={s.mode} /></TableCell><SBadge status={s.status} />
            <TableCell className="text-[10px]">{fmtDate(s.departure)}</TableCell><TableCell className="text-[10px]">{fmtDate(s.arrival)}</TableCell>
            <TableCell className="text-xs">{s.containers}</TableCell>
            <TableCell><div className="numeric-cell w-16"><CapacityBar value={s.capacityUtil} /><span className="text-[10px] text-muted-foreground">{s.capacityUtil}%</span></div></TableCell>
            <TableCell><ActBtn d={s} t="schedule" /></TableCell>
          </TableRow>
        ))}</TableBody></Table></div>
      </div>
    )
  }

  // Tab 4: Cost Analytics
  const CostTab = () => {
    const [fm, setFm] = useState("all"), [fh, setFh] = useState("all")
    const rows = sortFn(data.costs.filter(c => {
      if (search && !c.route.toLowerCase().includes(search.toLowerCase())) return false
      if (fm !== "all" && c.mode !== fm) return false
      if (fh !== "all" && !c.route.includes(fh)) return false
      return true
    }), sortBy)
    return (
      <div className="ith-cost-tab space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover-lift-sm ith-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost by Mode (\u20b9/ton-km)</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><BarChart data={data.costByModeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="mode" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="cost" radius={[4, 4, 0, 0]}>{[CC.orange, CC.blue, CC.cyan, CC.teal, CC.purple].map((c, i) => <Cell key={i} fill={c} />)}</Bar>
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="hover-lift-sm ith-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost Trend (\u20b9/ton-km)</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><LineChart data={data.costTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="road" stroke={CC.orange} strokeWidth={2} name="Road" /><Line type="monotone" dataKey="rail" stroke={CC.blue} strokeWidth={2} name="Rail" /><Line type="monotone" dataKey="coastal" stroke={CC.cyan} strokeWidth={2} name="Coastal" />
            </LineChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="inner-glow hover-lift-sm glass-subtle ith-comparison-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Mode Comparison</CardTitle></CardHeader><CardContent className="space-y-2">
            {[{ m: "Road", cost: "\u20b93.2/t-km", time: "2-5 days", rel: "88%" }, { m: "Rail", cost: "\u20b92.1/t-km", time: "3-7 days", rel: "92%" }, { m: "Coastal", cost: "\u20b91.5/t-km", time: "5-10 days", rel: "85%" }].map(c => (
              <div key={c.m} className="ith-comparison-item flex justify-between items-center p-2 rounded-lg bg-muted/50 text-xs">
                <span className="font-medium">{c.m}</span><div className="flex gap-4 text-[10px] text-muted-foreground"><span>{c.cost}</span><span>{c.time}</span><span>{c.rel}</span></div>
              </div>))}
          </CardContent></Card>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search routes..." value={search} onChange={e => setSearch(e.target.value)} className="ith-search h-8 text-xs w-60" />
          <select value={fm} onChange={e => setFm(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Modes</option>{data.TRANSPORT_MODES.map(m => <option key={m}>{m}</option>)}</select>
          <select value={fh} onChange={e => setFh(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Hubs</option>{data.hubs.slice(0, 10).map(h => <option key={h.id}>{h.name}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="ID" field="id" /><TableHead className="text-[11px]">Route</TableHead><TableHead className="text-[11px]">Mode</TableHead><SH label="Cost/ton" field="costPerTon" />
          <SH label="Distance" field="distance" /><SH label="Transit" field="transitDays" /><SH label="Reliability" field="reliability" /><SH label="Total Cost" field="totalCost" /><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(c => (
          <TableRow key={c.id} className="ith-cost-row">
            <TableCell className="text-xs font-mono">{c.id}</TableCell><TableCell className="text-[10px] max-w-[120px] truncate">{c.route}</TableCell><ModeBadge mode={c.mode} />
            <TableCell className="numeric-cell text-xs">\u20b9{c.costPerTon}/t</TableCell><TableCell className="text-xs">{c.distance}km</TableCell><TableCell className="text-xs">{c.transitDays}d</TableCell>
            <TableCell className="numeric-cell text-xs">{c.reliability}%</TableCell><TableCell className="text-xs font-medium">{fmtINR(c.totalCost)}</TableCell><ActBtn d={c} t="cost" />
          </TableRow>
        ))}</TableBody></Table></div>
        <Card className="inner-glow hover-lift-sm glass-subtle ith-savings-card border-border/60"><CardContent className="p-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-emerald-600" /><div><p className="text-sm font-medium">Potential Savings Opportunity</p><p className="text-xs text-muted-foreground">{rows.filter(r => r.reliability > 90).length} routes with &gt;90% reliability eligible for volume discounts</p></div>
        </CardContent></Card>
      </div>
    )
  }

  // Tab 5: Performance & SLA
  const PerfTab = () => {
    const rows = sortFn(data.performance.filter(p => {
      if (search && !p.hub.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus !== "all" && p.status !== filterStatus) return false
      if (filterRegion !== "all" && p.region !== filterRegion) return false
      return true
    }), sortBy)
    return (
      <div className="ith-perf-tab space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover-lift-sm ith-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly SLA Compliance</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><LineChart data={data.slaTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis domain={[80, 100]} tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="target" stroke={CC.rose} strokeDasharray="5 5" strokeWidth={2} name="Target" /><Line type="monotone" dataKey="actual" stroke={CC.cyan} strokeWidth={2} dot={{ r: 3 }} name="Actual" />
            </LineChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="inner-glow hover-lift-sm glass-subtle ith-summary-card border-border/60"><CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-medium">SLA Summary</h3>
            {[
              { label: "Hubs >95% On-Time", value: data.performance.filter(p => p.onTime >= 95).length, color: "text-emerald-600" },
              { label: "Avg Dwell Time", value: `${(data.performance.reduce((a, p) => a + p.dwellTime, 0) / data.performance.length).toFixed(1)}h`, color: "text-amber-600" },
              { label: "Avg Damage Rate", value: `${(data.performance.reduce((a, p) => a + p.damageRate, 0) / data.performance.length).toFixed(2)}%`, color: "text-rose-600" },
              { label: "Avg SLA Score", value: `${(data.performance.reduce((a, p) => a + p.slaScore, 0) / data.performance.length).toFixed(1)}%`, color: "text-blue-600" },
            ].map(s => (<div key={s.label} className="ith-perf-summary flex justify-between text-xs"><span className="text-muted-foreground">{s.label}</span><span className={cn("font-medium", s.color)}>{s.value}</span></div>))}
          </CardContent></Card>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search hubs..." value={search} onChange={e => setSearch(e.target.value)} className="ith-search h-8 text-xs w-60" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{["Excellent", "Good", "Needs Improvement"].map(s => <option key={s}>{s}</option>)}</select>
          <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="ith-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Regions</option>{data.REGIONS.map(r => <option key={r}>{r}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <TableHead className="text-[11px]">Hub</TableHead><SH label="On-Time %" field="onTime" /><SH label="Dwell Time" field="dwellTime" /><SH label="Damage Rate" field="damageRate" />
          <SH label="Throughput" field="throughput" /><SH label="SLA Score" field="slaScore" /><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Region</TableHead>
          <TableHead className="text-[11px]">Trend</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(p => (
          <TableRow key={p.id} className="ith-perf-row">
            <TableCell className="text-xs font-medium">{p.hub}</TableCell>
<div className="chip-group">
            <TableCell><Badge className={cn("text-[10px]", p.onTime >= 95 ? "bg-emerald-100 text-emerald-700" : p.onTime >= 85 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")}>{p.onTime}%</Badge></TableCell>
            <TableCell><Badge className={cn("text-[10px]", p.dwellTime < 24 ? "bg-emerald-100 text-emerald-700" : p.dwellTime <= 48 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")}>{p.dwellTime}h</Badge></TableCell>
            <TableCell><Badge className={cn("text-[10px]", p.damageRate < 0.5 ? "bg-emerald-100 text-emerald-700" : p.damageRate <= 2 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")}>{p.damageRate}%</Badge></TableCell>
</div>
            <TableCell className="numeric-cell text-xs">{p.throughput.toLocaleString()}</TableCell><TableCell className="text-xs font-medium">{p.slaScore.toFixed(1)}%</TableCell>
            <SBadge status={p.status} /><RegionBadge region={p.region} />
            <TableCell>{p.trend === "up" ? <ArrowUpRight className="h-3 w-3 text-emerald-600" /> : p.trend === "down" ? <ArrowDownRight className="h-3 w-3 text-rose-600" /> : <span className="text-[10px] text-muted-foreground">\u2014</span>}</TableCell>
            <ActBtn d={p} t="perf" />
          </TableRow>
        ))}</TableBody></Table></div>
      </div>
    )
  }

  // Drawers
  const open = !!drawerData
  const close = () => setDrawerData(null)

  const DrawerHeader = ({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) => (
    <SheetHeader className={cn("ith-drawer-header rounded-lg p-4 -mx-6 -mt-6 mb-4", sheetGrad)}>
      <SheetTitle className="text-white text-sm">{title}</SheetTitle>
      {desc && <SheetDescription className="text-cyan-100 mt-1">{desc}</SheetDescription>}
      {children && <SheetDescription className="text-cyan-100 flex flex-wrap gap-1.5 mt-1">{children}</SheetDescription>}
    </SheetHeader>
  )

  const InfoGrid = ({ items }: { items: [string, string][] }) => (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {items.map(([l, v]) => (<div key={l} className="flex justify-between p-1.5 rounded bg-muted/50"><span className="text-muted-foreground">{l}</span><span className="font-medium">{v}</span></div>))}
    </div>
  )

  return (
    <div className="ith-root space-y-6">
      <PageHeader title="Intermodal Transport Hub" description="Multi-modal logistics hub management across India's transport network" actions={<ExportButton data={data.hubs.map(h => ({ ID: h.id, Name: h.name, Type: h.type, Status: h.status, Region: h.region, "Capacity %": h.capacity }))} filename="intermodal-hubs" />} />
      <Tabs value={tab} onValueChange={v => { setTab(v); setSearch(""); setFilterType("all"); setFilterStatus("all"); setFilterRegion("all") }}>
        <TabsList className="flex-wrap h-auto gap-1">
          {[{ v: "0", l: "Hub Dashboard" }, { v: "1", l: "Transport Hubs" }, { v: "2", l: "Container Tracking" }, { v: "3", l: "Transfer Scheduling" }, { v: "4", l: "Cost Analytics" }, { v: "5", l: "Performance & SLA" }].map(t => <TabsTrigger key={t.v} value={t.v} className="ith-tab-trigger text-xs h-7 px-3">{t.l}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {tab === "0" && <DashboardTab />}
      {tab === "1" && <HubsTab />}
      {tab === "2" && <ContainersTab />}
      {tab === "3" && <SchedulingTab />}
      {tab === "4" && <CostTab />}
      {tab === "5" && <PerfTab />}

      {/* Hub Drawer */}
      <Sheet open={open && drawerType === "hub"} onOpenChange={close}><SheetContent className="ith-hub-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.name} ${drawerData.id}`} >
          <Badge className="badge-interactive bg-white/20 text-white text-[10px] border-0">{drawerData.type}</Badge><SBadge status={drawerData.status} />
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Throughput", value: `${drawerData.throughput.toLocaleString()} tons` },
            { label: "Dwell Time", value: `${drawerData.dwellTime}h` },
            { label: "Area", value: `${(drawerData.area / 1000).toFixed(0)}K sqft` },
          ].map(m => (<Card key={m.label} className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-blue-700">{m.value}</p></CardContent></Card>))}</div>
          <div><p className="text-[10px] text-muted-foreground mb-1">Capacity Utilization</p><CapacityBar value={drawerData.capacity} /><p className="text-[10px] text-muted-foreground mt-0.5">{drawerData.capacity}%</p></div>
          <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Connectivity:</span><ConnectivityScore score={drawerData.connectivity} /></div>
          <InfoGrid items={[["Region", drawerData.region], ["Manager", drawerData.manager], ["Established", drawerData.established], ["Rail", drawerData.railConnected ? "Yes" : "No"], ["Port", drawerData.portConnected ? "Yes" : "No"], ["Type", drawerData.type], ["Status", drawerData.status], ["ID", drawerData.id]]} />
          <DrawerActions id={drawerData.id} name={drawerData.name} />
        </div></>}
      </SheetContent></Sheet>

      {/* Container Drawer */}
      <Sheet open={open && drawerType === "container"} onOpenChange={close}><SheetContent className="ith-container-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.id}`} >
          <ModeBadge mode={drawerData.mode} /><SBadge status={drawerData.status} /><SizeBadge size={drawerData.size} /><PriorityBadge priority={drawerData.priority} />
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <Card className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-1">Route</p><RouteTimeline origin={drawerData.origin} transfer={drawerData.transferHub} destination={drawerData.destination} mode={drawerData.mode} /></CardContent></Card>
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Weight", value: `${drawerData.weight}t` },
            { label: "In Transit", value: `${drawerData.daysInTransit}d` },
            { label: "Shipper", value: drawerData.shipper },
          ].map(m => (<Card key={m.label} className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-cyan-700">{m.value}</p></CardContent></Card>))}</div>
          <InfoGrid items={[["ETD", fmtDate(drawerData.etd)], ["ETA", fmtDate(drawerData.eta)], ["Mode", drawerData.mode], ["Size", drawerData.size], ["Priority", drawerData.priority], ["Status", drawerData.status]]} />
          <DrawerActions id={drawerData.id} name={drawerData.id} />
        </div></>}
      </SheetContent></Sheet>

      {/* Schedule Drawer */}
      <Sheet open={open && drawerType === "schedule"} onOpenChange={close}><SheetContent className="ith-schedule-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={drawerData.id}>
          <TypeBadge type={drawerData.type} /><SBadge status={drawerData.status} /><PriorityBadge priority={drawerData.priority} />
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <Card className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-1">Route</p><p className="text-sm font-medium">{drawerData.route}</p><div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{fmtDate(drawerData.departure)} <ArrowRight className="h-3 w-3" /><MapPin className="h-3 w-3" />{fmtDate(drawerData.arrival)}</div></CardContent></Card>
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Containers", value: drawerData.containers },
            { label: "Capacity", value: `${drawerData.capacityUtil}%` },
            { label: "Mode", value: drawerData.mode },
          ].map(m => (<Card key={m.label} className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-blue-700">{m.value}</p></CardContent></Card>))}</div>
          <InfoGrid items={[["Type", drawerData.type], ["Status", drawerData.status], ["Departure", fmtDate(drawerData.departure)], ["Arrival", fmtDate(drawerData.arrival)], ["Priority", drawerData.priority], ["Mode", drawerData.mode]]} />
          <DrawerActions id={drawerData.id} name={drawerData.id} />
        </div></>}
      </SheetContent></Sheet>

      {/* Cost Drawer */}
      <Sheet open={open && drawerType === "cost"} onOpenChange={close}><SheetContent className="ith-cost-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.id}`}>
          <ModeBadge mode={drawerData.mode} />
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <Card className="hover-lift-sm border-border/60"><CardHeader className="pb-1"><CardTitle className="text-xs">Cost Breakdown</CardTitle></CardHeader><CardContent><CostBreakdown data={drawerData} /></CardContent></Card>
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Total Cost", value: fmtINR(drawerData.totalCost) },
            { label: "Reliability", value: `${drawerData.reliability}%` },
            { label: "Transit", value: `${drawerData.transitDays}d` },
          ].map(m => (<Card key={m.label} className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-orange-700">{m.value}</p></CardContent></Card>))}</div>
          <DrawerActions id={drawerData.id} name={drawerData.id} />
        </div></>}
      </SheetContent></Sheet>

      {/* Performance Drawer */}
      <Sheet open={open && drawerType === "perf"} onOpenChange={close}><SheetContent className="ith-perf-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={drawerData.hub}>
<div className="chip-group">
          <Badge className={cn("text-[10px]", drawerData.onTime >= 95 ? "bg-emerald-400/30 text-white border-0" : drawerData.onTime >= 85 ? "bg-amber-400/30 text-white border-0" : "bg-rose-400/30 text-white border-0")}>On-Time {drawerData.onTime}%</Badge>
          <Badge className={cn("text-[10px]", drawerData.dwellTime < 24 ? "bg-emerald-400/30 text-white border-0" : drawerData.dwellTime <= 48 ? "bg-amber-400/30 text-white border-0" : "bg-rose-400/30 text-white border-0")}>Dwell {drawerData.dwellTime}h</Badge>
          <Badge className={cn("text-[10px]", drawerData.damageRate < 0.5 ? "bg-emerald-400/30 text-white border-0" : drawerData.damageRate <= 2 ? "bg-amber-400/30 text-white border-0" : "bg-rose-400/30 text-white border-0")}>Damage {drawerData.damageRate}%</Badge>
</div>
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <div className="flex justify-center"><SLARing score={drawerData.slaScore} /></div>
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Throughput", value: drawerData.throughput.toLocaleString() },
            { label: "Region", value: drawerData.region },
            { label: "Status", value: drawerData.status },
          ].map(m => (<Card key={m.label} className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-blue-700">{m.value}</p></CardContent></Card>))}</div>
          <InfoGrid items={[["Hub", drawerData.hub], ["On-Time", `${drawerData.onTime}%`], ["Dwell Time", `${drawerData.dwellTime}h`], ["Damage Rate", `${drawerData.damageRate}%`]]} />
          <DrawerActions id={drawerData.id} name={drawerData.hub} />
        </div></>}
      </SheetContent></Sheet>
    </div>
  )
}
