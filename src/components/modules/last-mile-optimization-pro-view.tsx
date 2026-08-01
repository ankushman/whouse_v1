"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { MapPin, Truck, Package, Clock, TrendingUp, TrendingDown, BarChart3, Zap, AlertTriangle, CheckCircle2, Navigation, Users, Fuel, Route, Star, Phone, Home, Building2, Bike, ChevronRight, Search, ArrowUpDown } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

// ── Constants ──
const VEHICLE_TYPES = ["bike", "van", "truck", "e Rickshaw", "drones"] as const
const VEHICLE_EMOJI: Record<string, string> = { bike: "\U0001f3cd", van: "\U0001f697", truck: "\U0001f69a", "e Rickshaw": "\u26a1", drones: "\U0001f681" }
const DELIVERY_STATUS = ["in_transit", "delivered", "failed", "rescheduled", "picked_up", "out_for_delivery"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"] as const
const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#f59e0b", sec: "#ef4444", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#f59e0b", "#ef4444", "#059669", "#3b82f6", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"]

// ── Utilities ──
function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

// ── Visual Components ──
function VehicleBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { bike: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", van: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", truck: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", "e Rickshaw": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", drones: "bg-sky-100 text-sky-700 dark:bg-sky-900/30" }
  return <span className={"lmo-vehicle-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{VEHICLE_EMOJI[type] || "\u2022"} {type}</span>
}

function DeliveryStatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { in_transit: "lmo-status-transit bg-blue-100 text-blue-700 dark:bg-blue-900/30", delivered: "lmo-status-delivered bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", failed: "lmo-status-failed bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]", rescheduled: "lmo-status-resched bg-amber-100 text-amber-700 dark:bg-amber-900/30", picked_up: "lmo-status-picked bg-violet-100 text-violet-700 dark:bg-violet-900/30", out_for_delivery: "lmo-status-ofd bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30" }
  const icons: Record<string, React.ReactNode> = { in_transit: <Truck className="w-3 h-3" />, delivered: <CheckCircle2 className="w-3 h-3" />, failed: <AlertTriangle className="w-3 h-3" />, rescheduled: <Clock className="w-3 h-3" />, picked_up: <Package className="w-3 h-3" />, out_for_delivery: <Navigation className="w-3 h-3" /> }
  return <span className={"lmo-delivery-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{icons[status]} {status.replace(/_/g, " ")}</span>
}

function SLABadge({ value }: { value: number }) {
  const col = value >= 95 ? TH.ok : value >= 85 ? TH.warn : TH.err
  return <span className="lmo-sla-badge inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: col }}>{value}%</span>
}

function EffBar({ value }: { value: number }) {
  const col = value >= 80 ? TH.ok : value >= 50 ? TH.warn : TH.err
  return <div className="lmo-eff-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0
  const col = pos ? TH.ok : TH.err
  return <span className="lmo-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) {
  return <span className="lmo-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/20">{city}</span>
}

function ZoneBadge({ zone }: { zone: string }) {
  return <span className="lmo-zone-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/20">{zone}</span>
}

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) {
  return <Card className="lmo-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card>
}

function ValueTile({ label, value }: { label: string; value: string | number }) {
  return <div className="lmo-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}

function FuelTile({ liters, cost, saved }: { liters: number; cost: number; saved: number }) {
  return <div className="lmo-fuel-tile p-2 rounded-lg border border-amber-200 dark:border-amber-800"><div className="flex items-center gap-1 mb-1"><Fuel className="w-3 h-3 text-amber-500"/><span className="text-[10px] font-medium">Fuel</span></div><div className="text-xs font-bold">{liters}L</div><div className="text-[10px] text-muted-foreground">{"\u20b9"}{cost}</div>{saved > 0 && <div className="text-[10px] text-emerald-600 font-medium">Saved {"\u20b9"}{saved}</div>}</div>
}

function StarRating({ value }: { value: number }) {
  return <div className="lmo-star-rating flex items-center gap-0.5">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={"w-3 h-3 " + (i < value ? "text-amber-400 fill-amber-400" : "text-gray-300")}/>)}</div>
}

function DeliveryRing({ delivered, total }: { delivered: number; total: number }) {
  const pct = Math.round((delivered / total) * 100)
  const r = 18, circ = 2 * Math.PI * r, offset = circ - (pct / 100) * circ
  const col = pct >= 95 ? TH.ok : pct >= 85 ? TH.warn : TH.err
  return <div className="lmo-delivery-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{pct}%</span><span className="text-[9px] text-muted-foreground">{delivered}/{total}</span></div>
}

function CostTile({ label, value }: { label: string; value: number }) {
  return <div className="lmo-cost-tile text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"><div className="text-xs font-bold text-red-600">{"\u20b9"}{value.toLocaleString()}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}

// ── Data Generators ──
function genDeliveries() {
  return Array.from({ length: 80 }, (_, i) => {
    const st = pick(DELIVERY_STATUS, i * 3 + 1)
    return {
      id: "ORD-" + String(i + 1).padStart(6, "0"),
      customer: pick(["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Gupta", "Vikram Singh", "Anjali Reddy", "Karan Mehta", "Divya Iyer", "Suresh Nair", "Meera Joshi", "Arjun Das", "Pooja Rao", "Rajesh Pillai", "Neha Bose", "Sunil Kulkarni"], i * 3 + 2),
      city: pick(CITIES, i * 3 + 3),
      zone: pick(ZONES, i * 3 + 4),
      vehicle: pick(VEHICLE_TYPES, i * 3 + 5),
      status: st,
      eta: String(ri(5, 240, i + 7)) + " min",
      distance: +(ri(1, 45, i + 11) / 10).toFixed(1),
      cost: ri(30, 500, i + 13),
      weight: ri(1, 50, i + 17),
      priority: pick(["high", "medium", "low"], i + 19),
      rating: ri(1, 5, i + 23),
      attempts: st === "failed" ? ri(2, 5, i + 29) : 1,
      driver: pick(["Ravi K.", "Suresh M.", "Manoj T.", "Arun D.", "Deepak S.", "Ramesh G.", "Vijay P.", "Ganesh B."], i + 31),
      timestamp: "2026-07-" + String(ri(1, 30, i + 37)).padStart(2, "0") + " " + String(ri(8, 21, i + 41)).padStart(2, "0") + ":" + String(ri(0, 59, i + 43)).padStart(2, "0")
    }
  })
}

function genFleet() {
  return Array.from({ length: 40 }, (_, i) => {
    return {
      id: "VH-" + String(i + 1).padStart(4, "0"),
      type: pick(VEHICLE_TYPES, i * 3 + 1),
      driver: pick(["Ravi K.", "Suresh M.", "Manoj T.", "Arun D.", "Deepak S.", "Ramesh G.", "Vijay P.", "Ganesh B.", "Kiran J.", "Prasad H."], i * 3 + 2),
      city: pick(CITIES, i * 3 + 3),
      zone: pick(ZONES, i * 3 + 4),
      capacity: ri(10, 500, i + 7),
      load: ri(5, 480, i + 11),
      efficiency: ri(45, 98, i + 13),
      fuelLevel: ri(10, 100, i + 17),
      deliveries: ri(5, 60, i + 19),
      delivered: ri(3, 58, i + 23),
      avgTime: ri(15, 90, i + 29),
      rating: +(ri(30, 50, i + 31) / 10).toFixed(1),
      status: pick(["active", "active", "active", "break", "maintenance", "charging"], i + 37),
      battery: pick(VEHICLE_TYPES, i + 1) === "bike" || pick(VEHICLE_TYPES, i + 1) === "e Rickshaw" ? ri(20, 100, i + 41) : null,
      kmToday: ri(20, 200, i + 43)
    }
  })
}

function genRoutes() {
  return Array.from({ length: 30 }, (_, i) => {
    return {
      id: "RT-" + String(i + 1).padStart(4, "0"),
      name: pick(["Metro Express", "Suburban Sprint", "Highway Direct", "City Loop", "Rapid Rural", "Downtown Dash", "Airport Shuttle", "Market Run", "Industrial Route", "Coastal Connect", "Hill Station Link", "Campus Circuit", "Hospitality Line", "Mall Express", "Residential Route"], i * 3 + 1),
      city: pick(CITIES, i * 3 + 2),
      stops: ri(5, 25, i + 7),
      distance: ri(10, 120, i + 11),
      time: ri(30, 480, i + 13),
      cost: ri(200, 3000, i + 17),
      efficiency: ri(50, 98, i + 19),
      deliveries: ri(10, 80, i + 23),
      fuelUsed: ri(5, 50, i + 29),
      co2Saved: ri(2, 30, i + 31),
      status: pick(["active", "active", "active", "delayed", "cancelled"], i + 37),
      vehicles: ri(2, 15, i + 41)
    }
  })
}

function genCharts() {
  const daily = MO.map((m, i) => ({ month: m, deliveries: ri(2000, 12000, i + 101), delivered: ri(1800, 11500, i + 151), failed: ri(20, 500, i + 201), onTime: ri(1500, 11000, i + 251) }))
  const vehicleDist = VEHICLE_TYPES.map((v, i) => ({ type: v, count: ri(5, 20, i + 301), avgEff: ri(60, 95, i + 351) }))
  const zonePerf = ZONES.map((z, i) => ({ zone: z, sla: ri(80, 98, i + 401), cost: ri(100, 500, i + 451), satisfaction: ri(3, 5, i + 501) }))
  const costTrend = MO.map((m, i) => ({ month: m, fuel: ri(50000, 200000, i + 551), labor: ri(80000, 300000, i + 601), penalty: ri(5000, 50000, i + 651) }))
  return { daily, vehicleDist, zonePerf, costTrend }
}

// ── Main Component ──
export default function LastMileOptimizationProView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null)
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const deliveries = useMemo(() => genDeliveries(), [])
  const fleet = useMemo(() => genFleet(), [])
  const routes = useMemo(() => genRoutes(), [])
  const charts = useMemo(() => genCharts(), [])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const sortIcon = (f: string) => sortField === f ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""

  const filterDeliveries = useMemo(() => {
    if (!search) return deliveries
    const lq = search.toLowerCase()
    return deliveries.filter(d => Object.values(d).some(v => typeof v === "string" && v.toLowerCase().includes(lq)))
  }, [deliveries, search])

  const sortedDeliveries = useMemo(() => [...filterDeliveries].sort((a, b) => { const va = a[sortField as keyof typeof a], vb = b[sortField as keyof typeof b]; if (va == null || vb == null) return 0; const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true }); return sortDir === "asc" ? cmp : -cmp }), [filterDeliveries, sortField, sortDir])

  const filterFleet = useMemo(() => {
    if (!search) return fleet
    const lq = search.toLowerCase()
    return fleet.filter(f => Object.values(f).some(v => typeof v === "string" && v.toLowerCase().includes(lq)))
  }, [fleet, search])

  // Computed KPIs
  const totalDelivered = deliveries.filter(d => d.status === "delivered").length
  const totalFailed = deliveries.filter(d => d.status === "failed").length
  const inTransit = deliveries.filter(d => d.status === "in_transit" || d.status === "out_for_delivery").length
  const avgRating = +(fleet.reduce((s, f) => s + f.rating, 0) / fleet.length).toFixed(1)
  const slaRate = Math.round((totalDelivered / Math.max(1, totalDelivered + totalFailed)) * 100)

  const handleRefresh = () => { setSearch(""); setSortField("id"); setSortDir("asc") }

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const toggleFilter = (group: string, value: string) => {
    setActiveFilters(prev => {
      const cur = prev[group] || []
      const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
      if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest }
      return { ...prev, [group]: next }
    })
  }
  const clearAllFilters = () => setActiveFilters({})
  const totalActiveFilters = Object.values(activeFilters).reduce((s, v) => s + v.length, 0)

  const deliveryFilterGroups = useMemo(() => {
    const statusCounts: Record<string, number> = {}
    const vehicleCounts: Record<string, number> = {}
    const cityCounts: Record<string, number> = {}
    deliveries.forEach(d => { statusCounts[d.status] = (statusCounts[d.status] || 0) + 1; vehicleCounts[d.vehicle] = (vehicleCounts[d.vehicle] || 0) + 1; cityCounts[d.city] = (cityCounts[d.city] || 0) + 1 })
    return [
      { key: "status", label: "Status", options: Object.entries(statusCounts).map(([value, count]) => ({ value: value.replace(/_/g, " "), count })).sort((a, b) => b.count - a.count) },
      { key: "vehicle", label: "Vehicle", options: Object.entries(vehicleCounts).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) },
      { key: "city", label: "City", options: Object.entries(cityCounts).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count).slice(0, 8) }
    ]
  }, [deliveries])

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile label="Total Deliveries" value={deliveries.length.toString()} icon={<Package className="w-4 h-4 text-amber-500"/>} trend={12.5} color={TH.pri}/>
        <KpiTile label="In Transit" value={inTransit.toString()} icon={<Truck className="w-4 h-4 text-blue-500"/>} trend={3.2} color="#3b82f6"/>
        <KpiTile label="SLA Rate" value={slaRate + "%"} icon={<CheckCircle2 className="w-4 h-4 text-emerald-500"/>} trend={1.8} color={TH.ok}/>
        <KpiTile label="Failed" value={totalFailed.toString()} icon={<AlertTriangle className="w-4 h-4 text-red-500"/>} trend={-8.3} color={TH.err}/>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DeliveryRing delivered={totalDelivered} total={deliveries.length}/>
        <DeliveryRing delivered={fleet.reduce((s, f) => s + f.delivered, 0)} total={fleet.reduce((s, f) => s + f.deliveries, 0)}/>
        <div className="lmo-fleet-summary text-center p-3"><div className="text-2xl font-bold text-amber-600">{fleet.length}</div><div className="text-[10px] text-muted-foreground">Active Vehicles</div><div className="text-xs text-emerald-600 font-medium mt-1">Rating: {avgRating}/5</div></div>
        <div className="lmo-zone-summary text-center p-3"><div className="text-2xl font-bold text-violet-600">{routes.length}</div><div className="text-[10px] text-muted-foreground">Active Routes</div><div className="text-xs text-cyan-600 font-medium mt-1">{routes.reduce((s, r) => s + r.vehicles, 0)} vehicles assigned</div></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="lmo-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Daily Delivery Volume</CardTitle></CardHeader><CardContent><AreaChart data={charts.daily} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Area type="monotone" dataKey="deliveries" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/><Area type="monotone" dataKey="delivered" stroke={TH.ok} fill={TH.ok} fillOpacity={0.15}/><Line type="monotone" dataKey="failed" stroke={TH.err} strokeWidth={2} dot={{ r: 3 }}/></AreaChart></CardContent></Card>
        <Card className="lmo-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Vehicle Distribution & Efficiency</CardTitle></CardHeader><CardContent><BarChart data={charts.vehicleDist} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="type" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="count" fill={TH.pri} radius={[2, 2, 0, 0]}/><Bar dataKey="avgEff" fill={TH.ok} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card>
        <Card className="lmo-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Zone Performance</CardTitle></CardHeader><CardContent><BarChart data={charts.zonePerf} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="zone" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="sla" fill={TH.sec} radius={[2, 2, 0, 0]}/><Bar dataKey="satisfaction" fill={TH.ok} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card>
        <Card className="lmo-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Cost Breakdown Trend</CardTitle></CardHeader><CardContent><LineChart data={charts.costTrend} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Line type="monotone" dataKey="fuel" stroke={TH.pri} strokeWidth={2} dot={{ r: 3 }}/><Line type="monotone" dataKey="labor" stroke={TH.sec} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }}/><Line type="monotone" dataKey="penalty" stroke={TH.err} strokeWidth={2} dot={{ r: 3 }}/></LineChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <ModuleBreadcrumb items={[{ label: "Logistics" }, { label: "Last Mile" }, { label: "Deliveries" }]}/>
      <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={deliveryFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={deliveries.length} filteredCount={filterDeliveries.length} onRefresh={handleRefresh} placeholder="Search orders, customers, drivers..." />
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]">
        <table className="lmo-table w-full text-xs"><thead className="bg-amber-50 dark:bg-amber-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>Order ID {sortIcon("id")}</th><th className="p-2 text-left">Customer</th><th className="p-2 text-left">City</th><th className="p-2 text-left">Vehicle</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">ETA</th><th className="p-2 text-right">Distance</th><th className="p-2 text-right">Cost</th><th className="p-2 text-left">Priority</th><th className="p-2 text-left">Driver</th></tr></thead>
        <tbody>{sortedDeliveries.map(d => <tr key={d.id} className="lmo-table-row border-t hover:bg-amber-50/50 dark:hover:bg-amber-900/10 cursor-pointer" onClick={() => setDetail(d as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{d.id}</td><td className="p-2 font-medium">{d.customer}</td><td className="p-2"><CityBadge city={d.city}/></td><td className="p-2"><VehicleBadge type={d.vehicle}/></td><td className="p-2"><DeliveryStatusBadge status={d.status}/></td><td className="p-2">{d.eta}</td><td className="p-2 text-right">{d.distance} km</td><td className="p-2 text-right">{"\u20b9"}{d.cost}</td><td className="p-2"><span className={"lmo-priority-badge inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium " + (d.priority === "high" ? "bg-red-100 text-red-700" : d.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{d.priority}</span></td><td className="p-2 text-[10px]">{d.driver}</td></tr>)}</tbody></table>
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>Showing {sortedDeliveries.length} of {deliveries.length} deliveries</span>{totalActiveFilters > 0 && <span>{totalActiveFilters} filters active</span>}</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-4">
      <ModuleBreadcrumb items={[{ label: "Logistics" }, { label: "Last Mile" }, { label: "Fleet" }]}/>
      <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={[]} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={fleet.length} filteredCount={filterFleet.length} onRefresh={handleRefresh} placeholder="Search vehicles, drivers..." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filterFleet.map(f => (
          <Card key={f.id} className={"lmo-fleet-card glass-subtle hover:shadow-lg transition-shadow " + (f.status === "active" ? "border-emerald-300 dark:border-emerald-700" : f.status === "maintenance" ? "border-amber-300 dark:border-amber-700" : "")}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between"><span className="font-semibold text-xs">{f.id}</span><VehicleBadge type={f.type}/></div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Driver</span><span className="font-medium">{f.driver}</span></div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">City</span><CityBadge city={f.city}/></div>
              <div className="grid grid-cols-3 gap-1.5"><ValueTile label="Capacity" value={f.capacity}/><ValueTile label="Load" value={f.load}/><EffBar value={Math.round((f.load / f.capacity) * 100)}/></div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Efficiency</span><EffBar value={f.efficiency}/></div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Fuel</span><div className="flex items-center gap-1"><div className="w-10 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full" style={{ width: f.fuelLevel + "%", backgroundColor: f.fuelLevel <= 20 ? TH.err : f.fuelLevel <= 50 ? TH.warn : TH.ok }}/></div><span className="text-[10px]">{f.fuelLevel}%</span></div></div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Deliveries</span><DeliveryRing delivered={f.delivered} total={f.deliveries}/></div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Rating</span><StarRating value={Math.round(f.rating)}/></div>
              <div className="flex items-center justify-between"><span className={"lmo-veh-status inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium " + (f.status === "active" ? "bg-emerald-100 text-emerald-700" : f.status === "break" ? "bg-amber-100 text-amber-700" : f.status === "maintenance" ? "bg-red-100 text-red-700" : f.status === "charging" ? "bg-cyan-100 text-cyan-700" : "bg-gray-100 text-gray-600")}>{f.status}</span><span className="text-[10px] text-muted-foreground">{f.kmToday} km today</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tab3 = (
    <div className="space-y-3">
      <ModuleBreadcrumb items={[{ label: "Logistics" }, { label: "Last Mile" }, { label: "Routes" }]}/>
      <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={[]} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={routes.length} filteredCount={routes.length} onRefresh={handleRefresh} placeholder="Search routes..." />
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]">
        <table className="lmo-table w-full text-xs"><thead className="bg-violet-50 dark:bg-violet-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Route Name</th><th className="p-2 text-left">City</th><th className="p-2 text-right">Stops</th><th className="p-2 text-right">Distance</th><th className="p-2 text-right">Time</th><th className="p-2 text-left">Efficiency</th><th className="p-2 text-right">Deliveries</th><th className="p-2 text-left">CO2 Saved</th><th className="p-2 text-left">Status</th></tr></thead>
        <tbody>{routes.map(r => <tr key={r.id} className="lmo-table-row border-t hover:bg-violet-50/50 dark:hover:bg-violet-900/10 cursor-pointer" onClick={() => setDetail(r as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{r.id}</td><td className="p-2 font-medium">{r.name}</td><td className="p-2"><CityBadge city={r.city}/></td><td className="p-2 text-right">{r.stops}</td><td className="p-2 text-right">{r.distance} km</td><td className="p-2 text-right">{r.time} min</td><td className="p-2"><EffBar value={r.efficiency}/></td><td className="p-2 text-right">{r.deliveries}</td><td className="p-2"><span className="text-[10px] text-emerald-600 font-medium">{r.co2Saved} kg</span></td><td className="p-2"><span className={"lmo-route-status inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium " + (r.status === "active" ? "bg-emerald-100 text-emerald-700" : r.status === "delayed" ? "bg-amber-100 text-amber-700" : r.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600")}>{r.status}</span></td></tr>)}</tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{routes.length} routes</div>
    </div>
  )

  const tab4 = (
    <div className="space-y-4">
      <ModuleBreadcrumb items={[{ label: "Logistics" }, { label: "Last Mile" }, { label: "Analytics" }]}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="lmo-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-amber-600">{"\u20b9"}{deliveries.reduce((s, d) => s + d.cost, 0).toLocaleString()}</div><div className="text-[10px] text-muted-foreground mt-1">Total Delivery Cost</div></CardContent></Card>
        <Card className="lmo-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-emerald-600">{slaRate}%</div><div className="text-[10px] text-muted-foreground mt-1">SLA Achievement</div><div className="mt-2 h-1 rounded-full bg-gray-200"><div className="h-full rounded-full" style={{ width: slaRate + "%", backgroundColor: slaRate >= 95 ? TH.ok : TH.warn }}/></div></CardContent></Card>
        <Card className="lmo-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-blue-600">{fleet.filter(f => f.status === "active").length}</div><div className="text-[10px] text-muted-foreground mt-1">Vehicles Active Now</div></CardContent></Card>
        <Card className="lmo-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-violet-600">{routes.reduce((s, r) => s + r.co2Saved, 0)} kg</div><div className="text-[10px] text-muted-foreground mt-1">Total CO2 Saved</div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="lmo-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Delivery Status Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={DELIVERY_STATUS.map((s) => ({ name: s.replace(/_/g, " "), value: deliveries.filter(d => d.status === s).length }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{DELIVERY_STATUS.map((_, i) => <Cell key={i} fill={PC[i % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
        <Card className="lmo-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Vehicle Type Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={VEHICLE_TYPES.map((v) => ({ name: v, value: fleet.filter(f => f.type === v).length }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{VEHICLE_TYPES.map((_, i) => <Cell key={i} fill={PC[(i + 2) % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
      </div>
    </div>
  )

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-3.5 h-3.5" />, content: tab0 },
    { key: "deliveries", label: "Deliveries", icon: <Package className="w-3.5 h-3.5" />, content: tab1 },
    { key: "fleet", label: "Fleet Manager", icon: <Truck className="w-3.5 h-3.5" />, content: tab2 },
    { key: "routes", label: "Route Planner", icon: <Route className="w-3.5 h-3.5" />, content: tab3 },
    { key: "analytics", label: "Analytics", icon: <TrendingUp className="w-3.5 h-3.5" />, content: tab4 }
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Last Mile Optimization Pro" description="End-to-end last mile delivery optimization with fleet management, route planning, real-time tracking, and SLA monitoring"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><Truck className="w-3 h-3 text-amber-600"/><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">{inTransit} In Transit</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><CheckCircle2 className="w-3 h-3 text-emerald-600"/><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{slaRate}% SLA Rate</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30"><Navigation className="w-3 h-3 text-violet-600"/><span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">{fleet.length} Vehicles | {routes.length} Routes</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><Star className="w-3 h-3 text-blue-600"/><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">{avgRating}/5 Rating</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-amber-500/10 to-red-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-amber-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Delivery Detail</SheetTitle></SheetHeader>
          {detail && <div className="mt-4 space-y-3">
            <div className="lmo-detail-header rounded-lg p-4 bg-gradient-to-br from-amber-500 to-red-600 text-white"><div className="text-lg font-bold">{String(detail.id)}</div><div className="text-xs opacity-80 mt-1">{String(detail.customer || detail.name || "Record")}</div></div>
            {Object.entries(detail).filter(([k]) => k !== "id").map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b"><span className="text-[10px] text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><span className="text-xs font-medium">{typeof v === "number" ? v.toLocaleString() : String(v)}</span></div>)}
          </div>}
        </SheetContent>
      </Sheet>
    </div>
  )
}