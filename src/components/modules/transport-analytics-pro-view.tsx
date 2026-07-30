"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, Truck, TrainFront, Ship, Plane, Gauge, Clock, DollarSign, Rss, Zap, AlertTriangle, CheckCircle2, Route, Activity, Thermometer, Fuel, Wrench, Users } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const VEHICLE_TYPES = ["truck", "van", "bike", "ev_truck", "ev_van", "drone", "electric_scooter", "rail_carriage"] as const
const VEHICLE_STATUS = ["in_transit", "idle", "maintenance", "charging", "loaded", "delivering", "returning"] as const
const ZONES = ["Zone-A North", "Zone-B South", "Zone-C East", "Zone-D West", "Zone-E Central", "Zone-F Port", "Zone-G Airport", "Zone-H Industrial"] as const
const FUEL_TYPES = ["diesel", "petrol", "electric", "cng", "hybrid"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"] as const
const PERFORMANCE = ["excellent", "good", "average", "poor", "critical"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#4f46e5", sec: "#06b6d4", ter: "#f43f5e", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#4f46e5", "#06b6d4", "#059669", "#f59e0b", "#dc2626", "#8b5cf6", "#ec4899", "#14b8a6"]
const VEHICLE_EMOJI: Record<string, string> = { truck: "\U0001f69a", van: "\U0001f690", bike: "\U0001f3cd\ufe0f", ev_truck: "\U0001f69a\u26a1", ev_van: "\U0001f690\u26a1", drone: "\U0001f681", electric_scooter: "\U0001f6f4", rail_carriage: "\U0001f683" }
const FUEL_EMOJI: Record<string, string> = { diesel: "\U0001f6e2\ufe0f", petrol: "\u26fd", electric: "\u26a1", cng: "\U0001f525", hybrid: "\U0001f50b" }

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function VehicleTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { truck: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", van: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", bike: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", ev_truck: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30", ev_van: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", drone: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", electric_scooter: "bg-teal-100 text-teal-700 dark:bg-teal-900/30", rail_carriage: "bg-red-100 text-red-700 dark:bg-red-900/30" }
  return <span className={"tap-vehicle-type-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{VEHICLE_EMOJI[type] || "\u2022"} {type.replace(/_/g, " ")}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { in_transit: "tap-in-transit bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 shadow-[0_0_6px_rgba(79,70,229,0.3)]", idle: "bg-gray-200 text-gray-600 dark:bg-gray-700", maintenance: "tap-maintenance bg-amber-100 text-amber-700 dark:bg-amber-900/30", charging: "tap-charging bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 shadow-[0_0_6px_rgba(6,182,212,0.3)]", loaded: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", delivering: "tap-delivering bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", returning: "bg-violet-100 text-violet-700 dark:bg-violet-900/30" }
  return <span className={"tap-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function FuelBadge({ fuel }: { fuel: string }) {
  const cols: Record<string, string> = { diesel: "bg-gray-100 text-gray-700", petrol: "bg-red-100 text-red-700", electric: "tap-electric bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", cng: "bg-green-100 text-green-700", hybrid: "bg-violet-100 text-violet-700" }
  return <span className={"tap-fuel-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[fuel] || "")}>{FUEL_EMOJI[fuel] || "\u2022"} {fuel}</span>
}

function PerfBadge({ perf }: { perf: string }) {
  const cols: Record<string, string> = { excellent: "tap-excellent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_8px_rgba(5,150,105,0.4)]", good: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", average: "bg-amber-100 text-amber-700", poor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", critical: "tap-critical bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]" }
  return <span className={"tap-perf-badge inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase " + (cols[perf] || "")}>{perf}</span>
}

function ZoneBadge({ zone }: { zone: string }) {
  const short = zone.split("-")[1] || zone
  const cols: Record<string, string> = { North: "bg-blue-100 text-blue-700", South: "bg-emerald-100 text-emerald-700", East: "bg-amber-100 text-amber-700", West: "bg-violet-100 text-violet-700", Central: "bg-pink-100 text-pink-700", Port: "bg-cyan-100 text-cyan-700", Airport: "bg-sky-100 text-sky-700", Industrial: "bg-orange-100 text-orange-700" }
  return <span className={"tap-zone-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium " + (cols[short] || "bg-gray-100 text-gray-600")}>{zone}</span>
}

function UtilBar({ value }: { value: number }) {
  const col = value >= 90 ? TH.err : value >= 70 ? TH.warn : TH.ok
  return <div className="tap-util-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function FuelGauge({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100); const col = pct <= 15 ? TH.err : pct <= 30 ? TH.warn : TH.ok
  return <div className="tap-fuel-gauge flex items-center gap-1.5"><div className="w-14 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: pct + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}L</span></div>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0; const col = pos ? TH.ok : TH.err
  return <span className="tap-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) { return <span className="tap-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20">{city}</span> }

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) { return <Card className="tap-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card> }

function ValueTile({ label, value }: { label: string; value: string | number }) { return <div className="tap-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div> }

function HealthRing({ value, label }: { value: number; label: string }) { const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err; const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ; return <div className="tap-health-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div> }

function Speedometer({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.round((value / max) * 100); const col = pct >= 80 ? TH.err : pct >= 60 ? TH.warn : TH.ok
  return <div className="tap-speedometer flex flex-col items-center gap-0.5"><div className="relative w-10 h-10"><svg width={40} height={40} viewBox="0 0 40 40"><circle cx={20} cy={20} r={16} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={20} cy={20} r={16} fill="none" stroke={col} strokeWidth={3} strokeDasharray={100.5} strokeDashoffset={100.5 - (pct / 100) * 75.4} strokeLinecap="round" transform="rotate(135 20 20)" className="transition-all"/></svg></div><span className="text-[9px] font-bold" style={{ color: col }}>{value}{label}</span></div>
}

function genVehicles() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: "VH-" + String(i + 1).padStart(4, "0"),
    registration: pick(["MH-01-AB-1234", "DL-02-CD-5678", "KA-03-EF-9012", "TN-04-GH-3456", "TS-05-IJ-7890", "WB-06-KL-2345", "GJ-07-MN-6789", "RJ-08-OP-0123", "UP-09-QR-4567", "KL-10-ST-8901"], i + 1),
    type: pick(VEHICLE_TYPES, i * 3 + 2),
    zone: pick(ZONES, i * 3 + 5),
    city: pick(CITIES, i * 3 + 7),
    fuel: pick(FUEL_TYPES, i * 3 + 9),
    fuelLevel: ri(5, 100, i + 11),
    mileage: ri(10000, 200000, i + 17),
    speed: ri(0, 80, i + 23),
    maxSpeed: pick([60, 80, 100, 120], i + 29),
    status: pick(VEHICLE_STATUS, i + 31),
    performance: pick(PERFORMANCE, i + 37),
    deliveries: ri(0, 50, i + 43),
    onTimeRate: ri(60, 100, i + 47),
    avgCostPerKm: ri(3, 25, i + 53),
    lastService: ri(1, 90, i + 59) + " days ago",
    nextService: ri(1, 60, i + 67) + " days",
    loadPercent: ri(0, 100, i + 71)
  }))
}

function genRoutes() {
  return Array.from({ length: 35 }, (_, i) => ({
    id: "RT-" + String(i + 1).padStart(4, "0"),
    name: pick(["Mumbai Express", "Delhi Fast Track", "Bangalore City Run", "Chennai Coastal", "Hyderabad Metro", "Kolkata East Express", "Pune Tech Route", "Ahmedabad Industrial", "Jaipur Heritage Run", "Lucknow Central Loop", "Port-to-City Express", "Airport Shuttle", "Last Mile Sprint", "Milk Run Alpha", "Hub Feeder Circuit"], i + 1),
    origin: pick(CITIES, i + 7),
    dest: pick(CITIES, i + 11),
    distance: ri(5, 1500, i + 17),
    stops: ri(2, 15, i + 23),
    avgTime: ri(15, 1440, i + 29),
    costPerTrip: ri(500, 50000, i + 37),
    frequency: pick(["hourly", "2-hourly", "daily", "twice-daily", "on-demand"], i + 43),
    efficiency: ri(50, 98, i + 47),
    vehicleCount: ri(2, 20, i + 53),
    co2PerKm: ri(20, 500, i + 59)
  }))
}

function genCharts() {
  const fleetMix = VEHICLE_TYPES.slice(0, 6).map((t, i) => ({ type: t, count: ri(5, 30, i + 101), cost: ri(10000, 200000, i + 151) }))
  const perfTrend = MO.map((m, i) => ({ month: m, onTime: ri(75, 98, i + 201), utilization: ri(50, 90, i + 251), fuelEfficiency: ri(60, 95, i + 301) }))
  const costTrend = MO.map((m, i) => ({ month: m, fuel: ri(100000, 500000, i + 351), maintenance: ri(50000, 200000, i + 401), tolls: ri(20000, 100000, i + 451) }))
  const zoneLoad = ZONES.slice(0, 6).map((z, i) => ({ zone: z.split("-")[1], vehicles: ri(3, 15, i + 501), load: ri(40, 95, i + 551) }))
  return { fleetMix, perfTrend, costTrend, zoneLoad }
}

export default function TransportAnalyticsProView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const vehicles = useMemo(() => genVehicles(), [])
  const routes = useMemo(() => genRoutes(), [])
  const charts = useMemo(() => genCharts(), [])
  const filterVehicles = useMemo(() => { let res = vehicles; if (search) { const q = search.toLowerCase(); res = res.filter(v => Object.values(v).some(val => typeof val === "string" && val.toLowerCase().includes(q))) } for (const [k, vals] of Object.entries(activeFilters)) { if (vals.length > 0) res = res.filter(v => vals.includes(String(v[k as keyof typeof v]))) } return res }, [vehicles, search, activeFilters])
  const sortedVehicles = useMemo(() => { if (!sortCol) return filterVehicles; return [...filterVehicles].sort((a: any, b: any) => { const av = a[sortCol], bv = b[sortCol]; const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv; return sortDir === "asc" ? cmp : -cmp }) }, [filterVehicles, sortCol, sortDir])
  const toggleSort = (col: string) => { if (sortCol === col) { setSortDir(d => d === "asc" ? "desc" : "asc") } else { setSortCol(col); setSortDir("asc") } }
  const toggleFilter = (group: string, value: string) => { setActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } }) }
  const clearAllFilters = () => setActiveFilters({})
  const handleRefresh = () => { setSearch(""); setActiveFilters({}); setSortCol(null) }

  const vehicleFilterGroups = useMemo(() => {
    const tc: Record<string, number> = {}; const sc: Record<string, number> = {}; const zc: Record<string, number> = {}
    vehicles.forEach(v => { tc[v.type] = (tc[v.type] || 0) + 1; sc[v.status] = (sc[v.status] || 0) + 1; zc[v.zone] = (zc[v.zone] || 0) + 1 })
    return [{ key: "type", label: "Type", options: Object.entries(tc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "status", label: "Status", options: Object.entries(sc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "zone", label: "Zone", options: Object.entries(zc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }]
  }, [vehicles])

  const activeVehicles = vehicles.filter((v: any) => v.status === "in_transit" || v.status === "delivering").length
  const evCount = vehicles.filter((v: any) => v.fuel === "electric").length

  return <div className="space-y-4 p-4">
    <PageHeader title="Transport Analytics Pro" description="Advanced fleet analytics with real-time vehicle tracking, performance scoring, and route optimization"/>

    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="grid grid-cols-4 w-full tap-tabs">
        <TabsTrigger value="dashboard"><BarChart3 className="w-3 h-3 mr-1"/>Dashboard</TabsTrigger>
        <TabsTrigger value="fleet"><Truck className="w-3 h-3 mr-1"/>Fleet</TabsTrigger>
        <TabsTrigger value="routes"><Route className="w-3 h-3 mr-1"/>Routes</TabsTrigger>
        <TabsTrigger value="insights"><TrendingUp className="w-3 h-3 mr-1"/>Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <KpiTile label="Active Vehicles" value={String(activeVehicles)} icon={<Truck className="w-4 h-4" style={{ color: TH.pri }}/>} trend={5.3} color={TH.pri}/>
          <KpiTile label="EV Fleet" value={String(evCount)} icon={<Zap className="w-4 h-4" style={{ color: TH.ok }}/>} trend={22.1} color={TH.ok}/>
          <KpiTile label="Avg On-Time" value={Math.round(vehicles.reduce((s: number, v: any) => s + v.onTimeRate, 0) / vehicles.length) + "%"} icon={<Clock className="w-4 h-4" style={{ color: TH.sec }}/>} trend={3.7} color={TH.sec}/>
          <KpiTile label="Cost/Km" value={"INR " + Math.round(vehicles.reduce((s: number, v: any) => s + v.avgCostPerKm, 0) / vehicles.length)} icon={<DollarSign className="w-4 h-4" style={{ color: TH.ter }}/>} trend={-6.2} color={TH.ter}/>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <HealthRing value={ri(85, 97, 99)} label="Uptime"/>
          <HealthRing value={ri(70, 90, 100)} label="Util"/>
          <HealthRing value={ri(80, 96, 101)} label="On-Time"/>
          <HealthRing value={ri(75, 95, 102)} label="Fuel Eff"/>
          <HealthRing value={ri(65, 88, 103)} label="Load"/>
          <HealthRing value={ri(70, 92, 104)} label="Safety"/>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card className="tap-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Performance Trend</CardTitle></CardHeader><CardContent className="p-2"><LineChart data={charts.perfTrend} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Line type="monotone" dataKey="onTime" stroke={TH.pri}/><Line type="monotone" dataKey="utilization" stroke={TH.ok}/><Line type="monotone" dataKey="fuelEfficiency" stroke={TH.sec}/></LineChart></CardContent></Card>
          <Card className="tap-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Cost Breakdown</CardTitle></CardHeader><CardContent className="p-2"><AreaChart data={charts.costTrend} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Area type="monotone" dataKey="fuel" stroke={TH.err} fill={TH.err} fillOpacity={0.15}/><Area type="monotone" dataKey="maintenance" stroke={TH.warn} fill={TH.warn} fillOpacity={0.15}/><Area type="monotone" dataKey="tolls" stroke={TH.pri} fill={TH.pri} fillOpacity={0.15}/></AreaChart></CardContent></Card>
          <Card className="tap-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Zone Load</CardTitle></CardHeader><CardContent className="p-2"><BarChart data={charts.zoneLoad} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="zone" fontSize={9}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Bar dataKey="vehicles" fill={TH.pri}/><Bar dataKey="load" fill={TH.sec}/></BarChart></CardContent></Card>
        </div>
      </TabsContent>

      <TabsContent value="fleet" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Fleet" }]}/>
        <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={vehicleFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={vehicles.length} filteredCount={filterVehicles.length} onRefresh={handleRefresh} placeholder="Search vehicles..."/>
        <Card className="tap-table-card"><CardContent className="p-2"><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="border-b tap-table-header"><th className="p-1.5 text-left cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="w-3 h-3 inline"/></th><th className="p-1.5 text-left">Type</th><th className="p-1.5 text-left">Zone</th><th className="p-1.5 text-left">Fuel</th><th className="p-1.5 text-left">Fuel Lvl</th><th className="p-1.5 text-left cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("loadPercent")}>Load</th><th className="p-1.5 text-left">Speed</th><th className="p-1.5 text-left cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("onTimeRate")}>On-Time</th><th className="p-1.5 text-left">Perf</th><th className="p-1.5 text-left">Status</th><th className="p-1.5 text-left">Deliveries</th></tr></thead><tbody>
          {sortedVehicles.map((v: any) => <tr key={v.id} className="border-b hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 tap-table-row"><td className="p-1.5 font-mono text-[10px]">{v.id}</td><td className="p-1.5"><VehicleTypeBadge type={v.type}/></td><td className="p-1.5"><ZoneBadge zone={v.zone.split("-")[1]}/></td><td className="p-1.5"><FuelBadge fuel={v.fuel}/></td><td className="p-1.5"><FuelGauge value={v.fuelLevel} max={100}/></td><td className="p-1.5"><UtilBar value={v.loadPercent}/></td><td className="p-1.5"><Speedometer value={v.speed} max={v.maxSpeed} label="km/h"/></td><td className="p-1.5"><span className={"text-[10px] font-bold " + (v.onTimeRate >= 95 ? "text-emerald-600" : v.onTimeRate >= 80 ? "text-amber-600" : "text-red-600")}>{v.onTimeRate}%</span></td><td className="p-1.5"><PerfBadge perf={v.performance}/></td><td className="p-1.5"><StatusBadge status={v.status}/></td><td className="p-1.5">{v.deliveries}</td></tr>)}
          </tbody></table></div></CardContent></Card>
      </TabsContent>

      <TabsContent value="routes" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Routes" }]}/>
        <div className="grid grid-cols-4 gap-3">
          <ValueTile label="Total Routes" value={routes.length}/>
          <ValueTile label="Avg Efficiency" value={Math.round(routes.reduce((s: number, r: any) => s + r.efficiency, 0) / routes.length) + "%"}/>
          <ValueTile label="Avg CO2/Km" value={Math.round(routes.reduce((s: number, r: any) => s + r.co2PerKm, 0) / routes.length) + "g"}/>
          <ValueTile label="Total Vehicles" value={String(routes.reduce((s: number, r: any) => s + r.vehicleCount, 0))}/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="tap-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Fleet Composition</CardTitle></CardHeader><CardContent className="p-2"><PieChart height={200}><Pie data={VEHICLE_TYPES.slice(0, 6).map((t, i) => ({ name: t, value: ri(3, 15, i + 701) }))} cx="50%" cy="50%" outerRadius={60} dataKey="value" label><Cell fill={PC[0]}/><Cell fill={PC[1]}/><Cell fill={PC[2]}/><Cell fill={PC[3]}/><Cell fill={PC[4]}/><Cell fill={PC[5]}/></Pie><Tooltip contentStyle={{ fontSize: 11 }}/></PieChart></CardContent></Card>
          <Card className="tap-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Fleet Cost by Type</CardTitle></CardHeader><CardContent className="p-2"><BarChart data={charts.fleetMix} height={200}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="type" fontSize={8}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Bar dataKey="cost" fill={TH.pri}/></BarChart></CardContent></Card>
        </div>
        <Card className="tap-table-card"><CardContent className="p-2"><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="border-b tap-table-header"><th className="p-1.5 text-left">ID</th><th className="p-1.5 text-left">Route</th><th className="p-1.5 text-left">Path</th><th className="p-1.5 text-left">Dist</th><th className="p-1.5 text-left">Stops</th><th className="p-1.5 text-left">Time</th><th className="p-1.5 text-left">Cost/Trip</th><th className="p-1.5 text-left">Freq</th><th className="p-1.5 text-left">Efficiency</th><th className="p-1.5 text-left">CO2/Km</th></tr></thead><tbody>
          {routes.map((r: any) => <tr key={r.id} className="border-b hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 tap-table-row"><td className="p-1.5 font-mono text-[10px]">{r.id}</td><td className="p-1.5 font-medium text-[10px]">{r.name}</td><td className="p-1.5"><CityBadge city={r.origin}/> <span className="text-muted-foreground">-</span> <CityBadge city={r.dest}/></td><td className="p-1.5">{r.distance} km</td><td className="p-1.5">{r.stops}</td><td className="p-1.5">{r.avgTime >= 60 ? Math.round(r.avgTime / 60) + "h" : r.avgTime + "m"}</td><td className="p-1.5">INR {r.costPerTrip.toLocaleString()}</td><td className="p-1.5"><span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{r.frequency}</span></td><td className="p-1.5"><UtilBar value={r.efficiency}/></td><td className="p-1.5"><span className={"text-[10px] font-bold " + (r.co2PerKm <= 100 ? "text-emerald-600" : r.co2PerKm <= 250 ? "text-amber-600" : "text-red-600")}>{r.co2PerKm}g</span></td></tr>)}
          </tbody></table></div></CardContent></Card>
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Insights" }]}/>
        <div className="grid grid-cols-2 gap-3">
          <Card className="tap-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-500"/>EV Transition Opportunity</div><div className="text-[10px] text-muted-foreground">68% of last-mile deliveries can switch to EV by Q4. Charging infrastructure needed at 12 hub locations. Projected fuel cost savings: INR 45L/month. Government FAME-II subsidy covers 40% of fleet conversion cost.</div></Card>
          <Card className="tap-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500"/>Maintenance Alerts</div><div className="text-[10px] text-muted-foreground">7 vehicles have exceeded service intervals by 15+ days. Preventive maintenance scheduling can reduce breakdown incidents by 35%. Predictive maintenance ML model shows 89% accuracy for failure prediction.</div></Card>
          <Card className="tap-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Route className="w-3 h-3 text-cyan-500"/>Route Optimization</div><div className="text-[10px] text-muted-foreground">Dynamic routing algorithm can reduce avg delivery time by 18%. 5 routes show under 60% efficiency due to suboptimal stop sequencing. AI re-routing in Zone-C East can save 12km per trip during peak traffic.</div></Card>
          <Card className="tap-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Thermometer className="w-3 h-3 text-amber-500"/>Fuel Analytics</div><div className="text-[10px] text-muted-foreground">Fuel consumption 12% above benchmark for diesel fleet. Driver behavior coaching for 8 drivers showing aggressive acceleration patterns. CNG conversion for 15 trucks in Zone-A can reduce CO2 by 22% and fuel cost by 30%.</div></Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
}
