"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Fuel, Thermometer, Zap, AlertTriangle, CheckCircle2, BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, Radio, Battery, Gauge, Wrench, Satellite } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const VEHICLE_TYPES = ["truck", "van", "refrigerated", "tanker", "flatbed", "pickup"] as const
const VEHICLE_EMOJI: Record<string, string> = { truck: "🚚", van: "💐", refrigerated: "❄️", tanker: "🛢️", flatbed: "📦", pickup: "🏎️" }
const DRIVER_STATUS = ["on_route", "resting", "loading", "unloading", "available", "offline", "idle"] as const
const ALERT_SEV = ["critical", "warning", "info"] as const
const FUEL_TYPES = ["diesel", "petrol", "cng", "electric", "hybrid"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#3b82f6", sec: "#f59e0b", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#3b82f6", "#f59e0b", "#059669", "#dc2626", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function VehicleTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { truck: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", van: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", refrigerated: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", tanker: "bg-red-100 text-red-700 dark:bg-red-900/30", flatbed: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", pickup: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" }
  return <span className={"ftp-vehicle-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{VEHICLE_EMOJI[type] || "•"} {type}</span>
}

function FuelTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { diesel: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", petrol: "bg-red-100 text-red-700 dark:bg-red-900/30", cng: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", electric: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", hybrid: "bg-violet-100 text-violet-700 dark:bg-violet-900/30" }
  const icons: Record<string, React.ReactNode> = { diesel: <Fuel className="w-3 h-3" />, petrol: <Fuel className="w-3 h-3" />, cng: <Zap className="w-3 h-3" />, electric: <Battery className="w-3 h-3" />, hybrid: <Gauge className="w-3 h-3" /> }
  return <span className={"ftp-fuel-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "")}>{icons[type]} {type}</span>
}

function DriverStatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { on_route: "ftp-onroute bg-blue-100 text-blue-700 dark:bg-blue-900/30 shadow-[0_0_6px_rgba(59,130,246,0.3)]", resting: "bg-gray-100 text-gray-600", loading: "bg-violet-100 text-violet-700", unloading: "bg-amber-100 text-amber-700", available: "ftp-avail bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", offline: "bg-red-100 text-red-700", idle: "bg-gray-200 text-gray-500" }
  return <span className={"ftp-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function SevBadge({ severity }: { severity: string }) {
  const cols: Record<string, string> = { critical: "ftp-critical bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]", warning: "bg-amber-100 text-amber-700", info: "bg-blue-100 text-blue-700" }
  const icons: Record<string, React.ReactNode> = { critical: <AlertTriangle className="w-3 h-3" />, warning: <AlertTriangle className="w-3 h-3" />, info: <Radio className="w-3 h-3" /> }
  return <span className={"ftp-sev-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[severity] || "")}>{icons[severity]} {severity}</span>
}

function FuelBar({ value, capacity }: { value: number; capacity: number }) {
  const pct = Math.round((value / capacity) * 100); const col = pct <= 20 ? TH.err : pct <= 40 ? TH.warn : TH.ok
  return <div className="ftp-fuel-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: pct + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{pct}%</span></div>
}

function SpeedGauge({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100); const col = pct >= 90 ? TH.err : pct >= 70 ? TH.warn : TH.ok
  return <div className="ftp-speed-gauge flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: pct + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}</span></div>
}

function TempBadge({ temp }: { temp: number }) {
  const col = temp >= 95 ? TH.err : temp >= 80 ? TH.warn : TH.ok
  return <span className="ftp-temp-badge inline-flex items-center gap-0.5 text-[10px] font-bold" style={{ color: col }}><Thermometer className="w-3 h-3"/>{temp}&deg;C</span>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0; const col = pos ? TH.ok : TH.err
  return <span className="ftp-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) { return <span className="ftp-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20">{city}</span> }

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) { return <Card className="ftp-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card> }

function ValueTile({ label, value }: { label: string; value: string | number }) { return <div className="ftp-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div> }

function HealthRing({ value, label }: { value: number; label: string }) { const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err; const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ; return <div className="ftp-health-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div> }

function genVehicles() {
  return Array.from({ length: 60 }, (_, i) => ({
    id: "VH-" + String(i + 1).padStart(4, "0"),
    type: pick(VEHICLE_TYPES, i * 3 + 1),
    reg: pick(["MH", "DL", "KA", "TN", "TS", "WB", "GJ", "UP"], i * 3 + 2) + String(ri(1, 99, i * 3 + 3)).padStart(2, "0") + " " + String.fromCharCode(65 + ri(0, 25, i + 4)) + " " + String.fromCharCode(65 + ri(0, 25, i + 5)) + String.fromCharCode(65 + ri(0, 25, i + 6)),
    driver: pick(["Raj Kumar", "Amit Singh", "Priya Patel", "Suresh Yadav", "Deepak Sharma", "Manoj Tiwari", "Kavita Devi", "Ravi Verma"], i + 7),
    fuelType: pick(FUEL_TYPES, i + 15),
    fuel: ri(5, 120, i + 23),
    fuelCap: pick([60, 80, 100, 120, 150], i + 31),
    speed: ri(0, 120, i + 37),
    maxSpeed: pick([80, 100, 120, 140], i + 43),
    engineTemp: ri(70, 110, i + 47),
    tirePressure: ri(28, 42, i + 53),
    odometer: ri(10000, 200000, i + 59),
    city: pick(CITIES, i + 67),
    status: pick(DRIVER_STATUS, i + 75),
    lastPing: String(ri(0, 59, i + 83)) + "m ago",
    battery: ri(60, 100, i + 89),
    acOn: ri(0, 1, i + 91) === 1
  }))
}

function genAlerts() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: "ALT-" + String(i + 1).padStart(4, "0"),
    vehicle: "VH-" + String(ri(1, 60, i + 7)).padStart(4, "0"),
    severity: pick(ALERT_SEV, i + 13),
    type: pick(["Over Speed", "Low Fuel", "Engine Overheat", "Tire Low", "Geofence Exit", "Harsh Braking", "Idling Too Long", "Battery Drain", "AC Failure", "Fuel Theft Alert"], i + 19),
    message: pick(["Vehicle exceeded speed limit on NH-48", "Fuel level below 15% threshold", "Engine temperature above 105C", "Tire pressure below 30 PSI", "Vehicle exited designated geofence", "Harsh braking detected at junction", "Vehicle idling for over 30 minutes", "Battery voltage dropped below 11V", "AC compressor malfunction detected", "Possible fuel siphoning detected"], i + 29),
    city: pick(CITIES, i + 39),
    timestamp: "2026-07-30 " + String(ri(0, 23, i + 47)).padStart(2, "0") + ":" + String(ri(0, 59, i + 53)).padStart(2, "0"),
    resolved: ri(0, 1, i + 59) === 1
  }))
}

function genCharts() {
  const fuel = MO.map((m, i) => ({ month: m, consumed: ri(800, 3000, i + 101), cost: ri(50000, 200000, i + 151), efficiency: ri(4, 12, i + 201) }))
  const typeDist = VEHICLE_TYPES.map((t, i) => ({ type: t, count: ri(5, 20, i + 301), avgKm: ri(50, 300, i + 351) }))
  const alertTrend = MO.map((m, i) => ({ month: m, critical: ri(2, 15, i + 401), warning: ri(10, 40, i + 451), info: ri(20, 60, i + 501) }))
  return { fuel, typeDist, alertTrend }
}

export default function FleetTelematicsProView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const vehicles = useMemo(() => genVehicles(), [])
  const alerts = useMemo(() => genAlerts(), [])
  const charts = useMemo(() => genCharts(), [])
  const filterVehicles = useMemo(() => { let res = vehicles; if (search) { const q = search.toLowerCase(); res = res.filter(v => Object.values(v).some(val => typeof val === "string" && val.toLowerCase().includes(q))) } for (const [k, vals] of Object.entries(activeFilters)) { if (vals.length > 0) res = res.filter(v => vals.includes(String(v[k as keyof typeof v]))) } return res }, [vehicles, search, activeFilters])
  const filterAlerts = useMemo(() => { let res = alerts; for (const [k, vals] of Object.entries(activeFilters)) { if (vals.length > 0) res = res.filter(a => vals.includes(String(a[k as keyof typeof a]))) } return res }, [alerts, activeFilters])
  const sortedVehicles = useMemo(() => { if (!sortCol) return filterVehicles; return [...filterVehicles].sort((a: any, b: any) => { const av = a[sortCol], bv = b[sortCol]; const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv; return sortDir === "asc" ? cmp : -cmp }) }, [filterVehicles, sortCol, sortDir])
  const toggleSort = (col: string) => { if (sortCol === col) { setSortDir(d => d === "asc" ? "desc" : "asc") } else { setSortCol(col); setSortDir("asc") } }
  const toggleFilter = (group: string, value: string) => { setActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } }) }
  const clearAllFilters = () => setActiveFilters({})
  const handleRefresh = () => { setSearch(""); setActiveFilters({}); setSortCol(null) }

  const vehicleFilterGroups = useMemo(() => { const tc: Record<string, number> = {}; const fc: Record<string, number> = {}; const sc: Record<string, number> = {}; const cc: Record<string, number> = {}; vehicles.forEach(v => { tc[v.type] = (tc[v.type] || 0) + 1; fc[v.fuelType] = (fc[v.fuelType] || 0) + 1; sc[v.status] = (sc[v.status] || 0) + 1; cc[v.city] = (cc[v.city] || 0) + 1 }); return [{ key: "type", label: "Type", options: Object.entries(tc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "fuelType", label: "Fuel", options: Object.entries(fc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "status", label: "Status", options: Object.entries(sc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "city", label: "City", options: Object.entries(cc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }] }, [vehicles])

  const alertFilterGroups = useMemo(() => { const sc: Record<string, number> = {}; alerts.forEach(a => { sc[a.severity] = (sc[a.severity] || 0) + 1 }); return [{ key: "severity", label: "Severity", options: Object.entries(sc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }] }, [alerts])

  return <div className="space-y-4 p-4">
    <PageHeader title="Fleet Telematics Pro" description="Real-time vehicle tracking, fuel monitoring and driver analytics"/>

    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="grid grid-cols-5 w-full ftp-tabs">
        <TabsTrigger value="dashboard"><BarChart3 className="w-3 h-3 mr-1"/>Dashboard</TabsTrigger>
        <TabsTrigger value="vehicles"><Satellite className="w-3 h-3 mr-1"/>Vehicles</TabsTrigger>
        <TabsTrigger value="alerts"><AlertTriangle className="w-3 h-3 mr-1"/>Alerts</TabsTrigger>
        <TabsTrigger value="fuel"><Fuel className="w-3 h-3 mr-1"/>Fuel Analytics</TabsTrigger>
        <TabsTrigger value="insights"><TrendingUp className="w-3 h-3 mr-1"/>Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <KpiTile label="Active Vehicles" value={String(vehicles.filter((v: any) => v.status === "on_route").length)} icon={<Satellite className="w-4 h-4" style={{ color: TH.pri }}/>} trend={12.5} color={TH.pri}/>
          <KpiTile label="Avg Fuel Level" value="68%" icon={<Fuel className="w-4 h-4" style={{ color: TH.sec }}/>} trend={-3.2} color={TH.sec}/>
          <KpiTile label="Open Alerts" value={String(alerts.filter((a: any) => !a.resolved).length)} icon={<AlertTriangle className="w-4 h-4" style={{ color: TH.err }}/>} trend={8.1} color={TH.err}/>
          <KpiTile label="Fleet Efficiency" value="87%" icon={<Gauge className="w-4 h-4" style={{ color: TH.ok }}/>} trend={5.4} color={TH.ok}/>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <HealthRing value={92} label="Uptime"/>
          <HealthRing value={78} label="Fuel Opt"/>
          <HealthRing value={95} label="GPS Acc"/>
          <HealthRing value={64} label="Maint"/>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card className="ftp-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Monthly Fuel Consumption</CardTitle></CardHeader><CardContent className="p-2"><AreaChart data={charts.fuel} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Area type="monotone" dataKey="consumed" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/></AreaChart></CardContent></Card>
          <Card className="ftp-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Vehicle Type Distribution</CardTitle></CardHeader><CardContent className="p-2"><BarChart data={charts.typeDist} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="type" fontSize={9}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Bar dataKey="count" fill={TH.sec}/></BarChart></CardContent></Card>
          <Card className="ftp-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Alert Trend</CardTitle></CardHeader><CardContent className="p-2"><LineChart data={charts.alertTrend} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Line type="monotone" dataKey="critical" stroke={TH.err}/><Line type="monotone" dataKey="warning" stroke={TH.warn}/><Line type="monotone" dataKey="info" stroke={TH.pri}/></LineChart></CardContent></Card>
        </div>
      </TabsContent>

      <TabsContent value="vehicles" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Vehicles" }]}/>
        <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={vehicleFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={vehicles.length} filteredCount={filterVehicles.length} onRefresh={handleRefresh} placeholder="Search vehicles..."/>
        <Card className="ftp-table-card"><CardContent className="p-2"><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="border-b ftp-table-header"><th className="p-1.5 text-left cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="w-3 h-3 inline"/></th><th className="p-1.5 text-left">Type</th><th className="p-1.5 text-left">Registration</th><th className="p-1.5 text-left">Driver</th><th className="p-1.5 text-left">Fuel</th><th className="p-1.5 text-left">Speed</th><th className="p-1.5 text-left">Engine</th><th className="p-1.5 text-left">Status</th><th className="p-1.5 text-left">City</th><th className="p-1.5 text-left">Last Ping</th></tr></thead><tbody>
          {sortedVehicles.map((v: any) => <tr key={v.id} className="border-b hover:bg-blue-50/50 dark:hover:bg-blue-900/10 ftp-table-row"><td className="p-1.5 font-mono">{v.id}</td><td className="p-1.5"><VehicleTypeBadge type={v.type}/></td><td className="p-1.5 font-medium">{v.reg}</td><td className="p-1.5">{v.driver}</td><td className="p-1.5"><FuelBar value={v.fuel} capacity={v.fuelCap}/></td><td className="p-1.5"><SpeedGauge value={v.speed} max={v.maxSpeed}/></td><td className="p-1.5"><TempBadge temp={v.engineTemp}/></td><td className="p-1.5"><DriverStatusBadge status={v.status}/></td><td className="p-1.5"><CityBadge city={v.city}/></td><td className="p-1.5 text-muted-foreground">{v.lastPing}</td></tr>)}
          </tbody></table></div></CardContent></Card>
      </TabsContent>

      <TabsContent value="alerts" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Alerts" }]}/>
        <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={alertFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={alerts.length} filteredCount={filterAlerts.length} onRefresh={handleRefresh} placeholder="Search alerts..."/>
        <div className="grid grid-cols-3 gap-3">
          {filterAlerts.map((a: any) => <Card key={a.id} className={"ftp-alert-card p-3 " + (a.severity === "critical" && !a.resolved ? "ftp-alert-critical" : "")}><div className="flex items-center justify-between mb-2"><SevBadge severity={a.severity}/><span className="text-[9px] text-muted-foreground">{a.timestamp}</span></div><div className="text-[11px] font-semibold mb-1">{a.type}</div><div className="text-[10px] text-muted-foreground mb-2">{a.message}</div><div className="flex items-center justify-between"><span className="text-[10px] font-mono">{a.vehicle}</span><span className="text-[10px]">{a.resolved ? <CheckCircle2 className="w-3 h-3 text-emerald-500 inline"/> : <span className="text-red-500 font-semibold">Open</span>}</span></div></Card>)}
        </div>
      </TabsContent>

      <TabsContent value="fuel" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Fuel Analytics" }]}/>
        <div className="grid grid-cols-4 gap-3">
          <ValueTile label="Diesel Cost (MTD)" value="₹1.2L"/>
          <ValueTile label="Total Liters" value="18,450L"/>
          <ValueTile label="Avg KMPL" value="8.2"/>
          <ValueTile label="Fuel Theft Alerts" value="3"/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="ftp-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Fuel Cost Trend</CardTitle></CardHeader><CardContent className="p-2"><AreaChart data={charts.fuel} height={200}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Area type="monotone" dataKey="cost" stroke={TH.err} fill={TH.err} fillOpacity={0.15}/></AreaChart></CardContent></Card>
          <Card className="ftp-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Fuel Type Distribution</CardTitle></CardHeader><CardContent className="p-2"><PieChart height={200}><Pie data={FUEL_TYPES.map((f, i) => ({ name: f, value: ri(10, 50, i + 601) }))} cx="50%" cy="50%" outerRadius={60} dataKey="value" label><Cell fill={PC[0]}/><Cell fill={PC[1]}/><Cell fill={PC[2]}/><Cell fill={PC[3]}/><Cell fill={PC[4]}/></Pie><Tooltip contentStyle={{ fontSize: 11 }}/></PieChart></CardContent></Card>
        </div>
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Insights" }]}/>
        <div className="grid grid-cols-2 gap-3">
          <Card className="ftp-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500"/>Over-Speeding Hotspots</div><div className="text-[10px] text-muted-foreground">12 vehicles exceeded 100 km/h in last 24h. NH-48 near Mumbai and Delhi-Gurgaon expressway are the top zones for speed violations.</div></Card>
          <Card className="ftp-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Fuel className="w-3 h-3 text-amber-500"/>Fuel Optimization Opportunity</div><div className="text-[10px] text-muted-foreground">Route optimization could save 15% fuel. 8 vehicles have consistently high idle times. CNG fleet shows 22% lower cost per km than diesel.</div></Card>
          <Card className="ftp-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Thermometer className="w-3 h-3 text-orange-500"/>Preventive Maintenance</div><div className="text-[10px] text-muted-foreground">5 vehicles show engine temp above 95C regularly. Schedule service for VH-0012, VH-0023, VH-0034, VH-0045, VH-0056 to prevent breakdowns.</div></Card>
          <Card className="ftp-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Gauge className="w-3 h-3 text-emerald-500"/>Fleet Performance</div><div className="text-[10px] text-muted-foreground">Electric vehicles have 95% uptime vs 78% for diesel. Refrigerated trucks show 12% higher maintenance cost. Van fleet is most cost-efficient.</div></Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
}