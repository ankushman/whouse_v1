"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Network, MapPin, Route, Truck, Clock, IndianRupee, Zap, ArrowUpDown,
  Search, Eye, Activity, TrendingUp, TrendingDown, AlertTriangle,
  Package, BarChart3, Users, Globe, Navigation, Flame,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi"] as const
const ROUTE_MODES = ["Road", "Rail", "Air", "Waterway", "Multimodal", "Last Mile"] as const
const ROUTE_STATUSES = ["Active", "Planned", "Suspended", "Maintenance", "Delayed", "Completed", "Cancelled", "On Hold"] as const
const FLEET_STATUSES = ["In Transit", "At Hub", "Loading", "Unloading", "Maintenance", "Idle"] as const
const TERMINAL_TYPES = ["Freight Terminal", "Rail Yard", "Air Cargo Hub", "Port Terminal", "ICD", "CFS", "Transit Hub", "Micro Hub"] as const
const TERMINAL_STATUSES = ["Active", "Under Construction", "Maintenance", "Overloaded", "Closed", "Upgrading"] as const
const COST_CATEGORIES = ["Fuel", "Labor", "Maintenance", "Tolls", "Insurance", "Parking", "Depreciation", "Misc"] as const
const VEHICLE_TYPES = ["\U0001f69b Truck", "\U0001f68c Bus", "\U0001f682 Rail Wagon", "\u2708\ufe0f Air Cargo", "\U0001f6a2 Ship", "\U0001f3cd\ufe0f Bike", "\U0001f4f5 Scooter", "\U0001f4e6 Container"] as const
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const DRIVERS = ["Rajesh Kumar", "Suresh Patel", "Amit Sharma", "Vikram Singh", "Arjun Reddy", "Pradeep Gupta", "Manoj Tiwari", "Sunil Mehta", "Ravi Krishnan", "Deepak Verma", "Sanjay Mishra", "Anil Deshmukh", "Kiran Nair", "Ramesh Iyer", "Ajay Joshi", "Mohan Lal", "Rahul Saxena", "Vijay Bhat", "Ganesh Patil", "Harish Rao"] as const
const CHART_COLORS = ["#f97316", "#3b82f6", "#059669", "#7c3aed", "#d97706", "#ef4444", "#06b6d4", "#ec4899"]
const CITY_COLORS: Record<string, string> = { Mumbai: "bg-orange-100 text-orange-700", Delhi: "bg-blue-100 text-blue-700", Bangalore: "bg-emerald-100 text-emerald-700", Chennai: "bg-violet-100 text-violet-700", Hyderabad: "bg-amber-100 text-amber-700", Kolkata: "bg-rose-100 text-rose-700", Pune: "bg-cyan-100 text-cyan-700", Ahmedabad: "bg-teal-100 text-teal-700", Jaipur: "bg-pink-100 text-pink-700", Lucknow: "bg-indigo-100 text-indigo-700", Chandigarh: "bg-lime-100 text-lime-700", Kochi: "bg-fuchsia-100 text-fuchsia-700" }

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function fmtINR(n: number): string { const s = n < 0 ? "-" : ""; const a = Math.abs(n); if (a >= 1e7) return `\u20b9${s}${(a / 1e7).toFixed(2)} Cr`; if (a >= 1e5) return `\u20b9${s}${(a / 1e5).toFixed(2)} L`; return `\u20b9${s}${a.toLocaleString("en-IN")}` }
function filterData<T>(data: T[], q: string): T[] { if (!q) return data; const l = q.toLowerCase(); return data.filter(item => Object.values(item as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(data: T[], field: string, dir: "asc" | "desc"): T[] { return [...data].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[field]; const bv = (b as unknown as Record<string, string | number>)[field]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av)) }) }

type Route = { id: number; code: string; from: string; to: string; mode: string; status: string; distance: number; eta: number; cost: number; vehicles: number }
type FleetRec = { id: number; type: string; status: string; lat: string; lng: string; driver: string; speed: number; fuel: number; nextCheckpoint: string; route: string }
type Terminal = { id: number; name: string; city: string; type: string; status: string; capacity: number; throughput: number; staff: number; equipment: number; utilization: number }
type Cost = { id: number; category: string; month: string; costPerKm: number; costPerTon: number; budget: number; actual: number; savings: number }

const RouteModeBadge = ({ mode }: { mode: string }) => {
  const m: Record<string, [string, string]> = { Road: ["\U0001f6e3\ufe0f", "bg-orange-100 text-orange-700"], Rail: ["\U0001f682", "bg-blue-100 text-blue-700"], Air: ["\u2708\ufe0f", "bg-violet-100 text-violet-700"], Waterway: ["\U0001f6a2", "bg-emerald-100 text-emerald-700"], Multimodal: ["\U0001f504", "bg-amber-100 text-amber-700"], "Last Mile": ["\U0001f4cd", "bg-rose-100 text-rose-700"] }
  const [e, c] = m[mode] || ["\U0001f4e6", "bg-gray-100 text-gray-700"]
  return <span className={`tnh-mode-badge inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${c}`}>{e} {mode}</span>
}
const RouteStatusBadge = ({ status }: { status: string }) => {
  const s: Record<string, string> = { Active: "bg-emerald-100 text-emerald-700", Planned: "bg-blue-100 text-blue-700", Suspended: "bg-gray-100 text-gray-700", Maintenance: "bg-amber-100 text-amber-700", Delayed: "bg-red-100 text-red-700", Completed: "bg-violet-100 text-violet-700", Cancelled: "bg-rose-100 text-rose-700", "On Hold": "bg-cyan-100 text-cyan-700" }
  const pulse = status === "Active" || status === "Delayed" ? "tnh-pulse-dot" : ""
  return <span className={`tnh-status-badge inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${s[status] || "bg-gray-100 text-gray-700"}`}><span className={`tnh-dot h-1.5 w-1.5 rounded-full bg-current ${pulse}`} />{status}</span>
}
const VehicleTypeBadge = ({ type }: { type: string }) => <span className="tnh-vehicle-badge inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{type}</span>
const FleetStatusBadge = ({ status }: { status: string }) => {
  const s: Record<string, string> = { "In Transit": "bg-blue-100 text-blue-700", "At Hub": "bg-emerald-100 text-emerald-700", Loading: "bg-amber-100 text-amber-700", Unloading: "bg-violet-100 text-violet-700", Maintenance: "bg-red-100 text-red-700", Idle: "bg-gray-100 text-gray-700" }
  const pulse = status === "In Transit" ? "tnh-pulse-dot" : ""
  return <span className={`tnh-fleet-status inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${s[status] || ""}`}><span className={`tnh-dot h-1.5 w-1.5 rounded-full bg-current ${pulse}`} />{status}</span>
}
const TerminalTypeBadge = ({ type }: { type: string }) => {
  const icons: Record<string, React.ElementType> = { "Freight Terminal": Package, "Rail Yard": Route, "Air Cargo Hub": Globe, "Port Terminal": Navigation, ICD: MapPin, CFS: Truck, "Transit Hub": Activity, "Micro Hub": Network }
  const Icon = icons[type] || Package
  return <span className="tnh-terminal-type inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700"><Icon className="h-3 w-3" />{type}</span>
}
const TerminalStatusBadge = ({ status }: { status: string }) => {
  const s: Record<string, string> = { Active: "bg-emerald-100 text-emerald-700", "Under Construction": "bg-amber-100 text-amber-700", Maintenance: "bg-orange-100 text-orange-700", Overloaded: "bg-red-100 text-red-700", Closed: "bg-gray-100 text-gray-700", Upgrading: "bg-blue-100 text-blue-700" }
  return <span className={`tnh-term-status inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${s[status] || ""}`}>{status}</span>
}
const CapacityBar = ({ value }: { value: number }) => {
  const c = value > 70 ? "bg-emerald-500" : value > 40 ? "bg-blue-500" : value > 20 ? "bg-amber-500" : "bg-red-500"
  return <div className="tnh-capacity-bar w-20 h-2 bg-muted rounded-full overflow-hidden"><div className={`tnh-cap-fill h-full rounded-full transition-all ${c}`} style={{ width: `${value}%` }} /></div>
}
const CostCategoryBadge = ({ category }: { category: string }) => {
  const c: Record<string, string> = { Fuel: "bg-orange-100 text-orange-700", Labor: "bg-blue-100 text-blue-700", Maintenance: "bg-amber-100 text-amber-700", Tolls: "bg-violet-100 text-violet-700", Insurance: "bg-emerald-100 text-emerald-700", Parking: "bg-cyan-100 text-cyan-700", Depreciation: "bg-rose-100 text-rose-700", Misc: "bg-gray-100 text-gray-700" }
  return <span className={`tnh-cost-cat inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${c[category] || ""}`}>{category}</span>
}
const DistanceTile = ({ km }: { km: number }) => <span className="tnh-distance-tile inline-flex items-center gap-1 text-xs text-muted-foreground"><Route className="h-3 w-3" />{km.toLocaleString("en-IN")} km</span>
const ETATile = ({ hours }: { hours: number }) => { const c = hours <= 12 ? "text-emerald-600" : hours <= 24 ? "text-amber-600" : "text-red-600"; return <span className={`tnh-eta-tile inline-flex items-center gap-1 text-xs font-medium ${c}`}><Clock className="h-3 w-3" />{hours}h</span> }
const FuelBar = ({ value }: { value: number }) => { const c = value > 50 ? "bg-emerald-500" : value > 20 ? "bg-amber-500" : "bg-red-500"; return <div className="tnh-fuel-bar w-16 h-2 bg-muted rounded-full overflow-hidden"><div className={`tnh-fuel-fill h-full rounded-full ${c}`} style={{ width: `${value}%` }} /></div> }
const SpeedTile = ({ speed }: { speed: number }) => <span className="tnh-speed-tile inline-flex items-center gap-1 text-xs text-muted-foreground"><Zap className="h-3 w-3" />{speed} km/h</span>
const CityBadge = ({ city }: { city: string }) => <span className={`tnh-city-badge inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${CITY_COLORS[city] || "bg-gray-100 text-gray-700"}`}>{city}</span>
const RouteCodeTile = ({ code }: { code: string }) => <span className="tnh-route-code inline-flex rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white">{code}</span>
const DriverBadge = ({ name }: { name: string }) => <span className="tnh-driver-badge inline-flex items-center gap-1 text-xs text-muted-foreground"><Users className="h-3 w-3" />{name}</span>
const SavingsTile = ({ amount }: { amount: number }) => { const pos = amount >= 0; return <span className={`tnh-savings-tile inline-flex items-center gap-1 text-xs font-semibold ${pos ? "text-emerald-600" : "text-red-600"}`}><IndianRupee className="h-3 w-3" />{pos ? "+" : ""}{fmtINR(amount)}</span> }

export default function TransportNetworkHubView() {
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const { toast } = useToast()

  const routes = useMemo(() => Array.from({ length: 75 }, (_, i) => ({
    id: i + 1, code: `${["NH", "IR", "AI", "NW", "MM", "LM"][i % 6]}-${String(ri(1, 999, i * 3 + 1)).padStart(3, "0")}`,
    from: CITIES[ri(0, 11, i * 7)], to: CITIES[ri(0, 11, i * 7 + 1)], mode: ROUTE_MODES[i % 6],
    status: ROUTE_STATUSES[i % 8], distance: ri(100, 2500, i * 5), eta: ri(2, 48, i * 11),
    cost: ri(50000, 5000000, i * 13), vehicles: ri(1, 50, i * 17),
  })), [])
  const fleet = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i + 1, type: VEHICLE_TYPES[i % 8], status: FLEET_STATUSES[i % 6],
    lat: (ri(8, 35, i * 3) + seededRandom(i * 3 + 0.5)).toFixed(4),
    lng: (ri(68, 97, i * 3 + 1) + seededRandom(i * 3 + 1.5)).toFixed(4),
    driver: DRIVERS[i % 20], speed: ri(0, 120, i * 5), fuel: ri(5, 100, i * 7),
    nextCheckpoint: CITIES[ri(0, 11, i * 9)],
    route: `${["NH", "IR", "AI", "NW", "MM", "LM"][i % 6]}-${String(ri(1, 999, i * 13)).padStart(3, "0")}`,
  })), [])
  const terminals = useMemo(() => Array.from({ length: 55 }, (_, i) => ({
    id: i + 1, name: `${TERMINAL_TYPES[i % 8]} ${CITIES[i % 12]}`, city: CITIES[i % 12],
    type: TERMINAL_TYPES[i % 8], status: TERMINAL_STATUSES[i % 6],
    capacity: ri(1000, 50000, i * 3), throughput: ri(200, 45000, i * 5),
    staff: ri(10, 500, i * 7), equipment: ri(5, 200, i * 9), utilization: ri(10, 98, i * 11),
  })), [])
  const costs = useMemo(() => Array.from({ length: 65 }, (_, i) => ({
    id: i + 1, category: COST_CATEGORIES[i % 8], month: MONTHS[i % 12],
    costPerKm: ri(5, 150, i * 3), costPerTon: ri(500, 5000, i * 5),
    budget: ri(100000, 10000000, i * 7), actual: ri(80000, 12000000, i * 9),
    savings: ri(-2000000, 3000000, i * 11),
  })), [])

  const monthlyShipments = useMemo(() => MONTHS.map((m, i) => ({ month: m, Road: ri(5000, 15000, i * 3), Rail: ri(3000, 10000, i * 3 + 1), Air: ri(1000, 5000, i * 3 + 2) })), [])
  const modeDist = useMemo(() => ROUTE_MODES.map(mode => ({ name: mode, value: routes.filter(r => r.mode === mode).length })), [routes])
  const cityThroughput = useMemo(() => { const c: Record<string, number> = {}; routes.forEach(r => { c[r.from] = (c[r.from] || 0) + r.vehicles; c[r.to] = (c[r.to] || 0) + r.vehicles }); return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([city, v]) => ({ city, throughput: v })) }, [routes])
  const costTrend = useMemo(() => MONTHS.map((m, i) => ({ month: m, actual: ri(3000000, 8000000, i * 7), budget: ri(4000000, 9000000, i * 7 + 1) })), [])
  const effTrend = useMemo(() => MONTHS.map((m, i) => ({ month: m, efficiency: ri(70, 98, i * 2), target: 90 })), [])
  const termUtil = useMemo(() => terminals.slice(0, 10).map(t => ({ name: t.city, utilization: t.utilization })), [terminals])
  const costBreakdown = useMemo(() => COST_CATEGORIES.map(cat => ({ name: cat, value: costs.filter(c => c.category === cat).reduce((s, c) => s + c.actual, 0) })), [costs])
  const modeComparison = useMemo(() => ["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((m, i) => ({ month: m, Road: ri(4000, 12000, i * 6), Rail: ri(2000, 8000, i * 6 + 1), Air: ri(500, 3000, i * 6 + 2), Waterway: ri(100, 1000, i * 6 + 3), Multimodal: ri(500, 2000, i * 6 + 4), "Last Mile": ri(1000, 4000, i * 6 + 5) })), [])
  const kpis = useMemo(() => [
    { label: "Total Routes", value: routes.length, icon: Route },
    { label: "Active Vehicles", value: fleet.filter(f => f.status === "In Transit").length, icon: Truck },
    { label: "Monthly Volume", value: fmtINR(routes.reduce((s, r) => s + r.vehicles * 1000, 0)), icon: Package },
    { label: "Avg ETA", value: `${Math.round(routes.reduce((s, r) => s + r.eta, 0) / routes.length)} hrs`, icon: Clock },
    { label: "Cities Covered", value: CITIES.length, icon: MapPin },
    { label: "Fleet Util %", value: `${Math.round(fleet.filter(f => f.status !== "Idle" && f.status !== "Maintenance").length / fleet.length * 100)}%`, icon: Activity },
    { label: "Revenue", value: fmtINR(routes.reduce((s, r) => s + r.cost, 0)), icon: IndianRupee },
    { label: "Efficiency", value: `${ri(87, 96, 42)}%`, icon: TrendingUp },
  ], [routes, fleet])

  const showSheet = !!(sheetOpen && selectedRoute)
  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }

  return (
    <div className="space-y-6">
      <PageHeader title="Transport Network Hub" description="Indian transport logistics \u2014 NH corridors, Railways, airports, ports & multimodal operations" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="tnh-tab-list flex-wrap h-auto gap-1">
          {[["0", "Network Overview"], ["1", "Route Mgmt"], ["2", "Fleet Tracking"], ["3", "Terminals"], ["4", "Cost Opt"], ["5", "Analytics"]].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="tnh-tab-trigger text-xs">{l}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="0" className="tnh-overview-tab space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((k, i) => (<Card key={i}><CardHeader className="tnh-kpi-card flex flex-row items-center justify-between pb-2"><CardTitle className="tnh-kpi-label text-xs font-medium text-muted-foreground">{k.label}</CardTitle><k.icon className="tnh-kpi-icon h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="tnh-kpi-value text-xl font-bold">{k.value}</div></CardContent></Card>))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card><CardHeader><CardTitle className="tnh-chart-title text-sm">Monthly Shipment Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyShipments} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="Road" stroke="#f97316" strokeWidth={2} /><Line type="monotone" dataKey="Rail" stroke="#3b82f6" strokeWidth={2} /><Line type="monotone" dataKey="Air" stroke="#7c3aed" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card><CardHeader><CardTitle className="tnh-chart-title text-sm">Route Mode Distribution</CardTitle></CardHeader><CardContent><PieChart width={250} height={220}><Pie data={modeDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2} label={({ name }) => name}>{modeDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card><CardHeader><CardTitle className="tnh-chart-title text-sm">Top 10 Cities by Throughput</CardTitle></CardHeader><CardContent><BarChart data={cityThroughput} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="throughput" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="1" className="tnh-route-tab space-y-4">
          <Card><CardContent className="glass-subtle tnh-route-panel p-4">
            <div className="btn-outline-animate flex gap-2 mb-4"><div className="relative flex-1"><Search className="tnh-search-icon absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search routes..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="tnh-search-input pl-9" /></div><Button variant="outline" size="icon" onClick={() => toggleSort(sortField)}><ArrowUpDown className="h-4 w-4" /></Button></div>
            <div className="tnh-route-table overflow-x-auto max-h-[420px] overflow-y-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-muted/90 backdrop-blur"><tr className="tnh-route-header">{["", "Code", "From", "To", "Mode", "Status", "Distance", "ETA", "Cost", "Vehicles"].map(h => <th key={h} className="tnh-route-th px-3 py-2 text-left text-xs font-medium whitespace-nowrap">{h}</th>)}</tr></thead><tbody>
              {sortedData(filterData(routes, searchQ), sortField, sortDir).map(r => (
                <tr key={r.id} className="tnh-route-row border-b hover:bg-muted/40 cursor-pointer" onClick={() => { setSelectedRoute(r); setSheetOpen(true); toast.success("Route Details", `Viewing ${r.code}`) }}>
                  <td className="px-2 py-2"><Eye className="tnh-eye-icon h-4 w-4 text-muted-foreground" /></td>
                  <td className="px-3 py-2"><RouteCodeTile code={r.code} /></td>
                  <td className="px-3 py-2"><CityBadge city={r.from} /></td>
                  <td className="px-3 py-2"><CityBadge city={r.to} /></td>
                  <td className="px-3 py-2"><RouteModeBadge mode={r.mode} /></td>
                  <td className="px-3 py-2"><RouteStatusBadge status={r.status} /></td>
                  <td className="px-3 py-2"><DistanceTile km={r.distance} /></td>
                  <td className="px-3 py-2"><ETATile hours={r.eta} /></td>
                  <td className="px-3 py-2 font-medium">{fmtINR(r.cost)}</td>
                  <td className="px-3 py-2">{r.vehicles}</td>
                </tr>
              ))}
            </tbody></table></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="2" className="tnh-fleet-tab space-y-4">
          <Card><CardContent className="glass-subtle tnh-fleet-panel p-4">
            <div className="btn-outline-animate flex gap-2 mb-4"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search fleet..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-9" /></div><Button variant="outline" size="icon" onClick={() => toggleSort(sortField)}><ArrowUpDown className="h-4 w-4" /></Button></div>
            <div className="tnh-fleet-table overflow-x-auto max-h-[420px] overflow-y-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-muted/90 backdrop-blur"><tr>{["", "Type", "Status", "Driver", "Speed", "Fuel", "GPS", "Next", "Route"].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-medium whitespace-nowrap">{h}</th>)}</tr></thead><tbody>
              {sortedData(filterData(fleet, searchQ), sortField, sortDir).map(f => (
                <tr key={f.id} className="border-b hover:bg-muted/40">
                  <td className="px-2 py-2 text-xs text-muted-foreground">{f.id}</td>
                  <td className="px-3 py-2"><VehicleTypeBadge type={f.type} /></td>
                  <td className="px-3 py-2"><FleetStatusBadge status={f.status} /></td>
                  <td className="px-3 py-2"><DriverBadge name={f.driver} /></td>
                  <td className="px-3 py-2"><SpeedTile speed={f.speed} /></td>
                  <td className="px-3 py-2"><div className="flex items-center gap-2"><FuelBar value={f.fuel} /><span className="text-xs">{f.fuel}%</span></div></td>
                  <td className="px-3 py-2 text-xs text-muted-foreground font-mono">{f.lat}, {f.lng}</td>
                  <td className="px-3 py-2"><CityBadge city={f.nextCheckpoint} /></td>
                  <td className="px-3 py-2"><RouteCodeTile code={f.route} /></td>
                </tr>
              ))}
            </tbody></table></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="3" className="tnh-terminal-tab space-y-4">
          <Card><CardContent className="glass-subtle tnh-terminal-panel p-4">
            <div className="btn-outline-animate flex gap-2 mb-4"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search terminals..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-9" /></div><Button variant="outline" size="icon" onClick={() => toggleSort(sortField)}><ArrowUpDown className="h-4 w-4" /></Button></div>
            <div className="tnh-terminal-table overflow-x-auto max-h-[420px] overflow-y-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-muted/90 backdrop-blur"><tr>{["Name", "City", "Type", "Status", "Capacity", "Throughput", "Staff", "Equipment", "Util %"].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-medium whitespace-nowrap">{h}</th>)}</tr></thead><tbody>
              {sortedData(filterData(terminals, searchQ), sortField, sortDir).map(t => (
                <tr key={t.id} className="border-b hover:bg-muted/40">
                  <td className="px-3 py-2 font-medium text-xs">{t.name}</td>
                  <td className="px-3 py-2"><CityBadge city={t.city} /></td>
                  <td className="px-3 py-2"><TerminalTypeBadge type={t.type} /></td>
                  <td className="px-3 py-2"><TerminalStatusBadge status={t.status} /></td>
                  <td className="px-3 py-2 text-xs">{t.capacity.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2 text-xs">{t.throughput.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2 text-xs">{t.staff}</td>
                  <td className="px-3 py-2 text-xs">{t.equipment}</td>
                  <td className="px-3 py-2"><div className="flex items-center gap-2"><CapacityBar value={t.utilization} /><span className="text-xs font-medium">{t.utilization}%</span></div></td>
                </tr>
              ))}
            </tbody></table></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="4" className="tnh-cost-tab space-y-4">
          <Card><CardHeader><CardTitle className="tnh-cost-chart-title text-sm">Monthly Cost Trend</CardTitle></CardHeader><CardContent><AreaChart data={costTrend} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} tickFormatter={v => fmtINR(v as number)} /><Tooltip formatter={(v: number) => fmtINR(v)} /><Area type="monotone" dataKey="actual" stroke="#f97316" fill="#f97316" fillOpacity={0.15} /><Area type="monotone" dataKey="budget" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} /></AreaChart></CardContent></Card>
          <Card><CardContent className="glass-subtle tnh-cost-panel p-4">
            <div className="btn-outline-animate flex gap-2 mb-4"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search costs..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-9" /></div><Button variant="outline" size="icon" onClick={() => toggleSort(sortField)}><ArrowUpDown className="h-4 w-4" /></Button></div>
            <div className="tnh-cost-table overflow-x-auto max-h-[360px] overflow-y-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-muted/90 backdrop-blur"><tr>{["Category", "Month", "Cost/km", "Cost/ton", "Budget", "Actual", "Savings"].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-medium whitespace-nowrap">{h}</th>)}</tr></thead><tbody>
              {sortedData(filterData(costs, searchQ), sortField, sortDir).map(c => (
                <tr key={c.id} className="border-b hover:bg-muted/40">
                  <td className="px-3 py-2"><CostCategoryBadge category={c.category} /></td>
                  <td className="px-3 py-2 text-xs">{c.month}</td>
                  <td className="px-3 py-2 text-xs">{fmtINR(c.costPerKm)}</td>
                  <td className="px-3 py-2 text-xs">{fmtINR(c.costPerTon)}</td>
                  <td className="px-3 py-2 text-xs">{fmtINR(c.budget)}</td>
                  <td className="px-3 py-2 text-xs font-medium">{fmtINR(c.actual)}</td>
                  <td className="px-3 py-2"><SavingsTile amount={c.savings} /></td>
                </tr>
              ))}
            </tbody></table></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="5" className="tnh-analytics-tab space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="tnh-eff-title text-sm">Efficiency Trend</CardTitle></CardHeader><CardContent><LineChart data={effTrend} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis domain={[60, 100]} tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="efficiency" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} /></LineChart></CardContent></Card>
            <Card><CardHeader><CardTitle className="tnh-util-title text-sm">Terminal Utilization (%)</CardTitle></CardHeader><CardContent><BarChart data={termUtil} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="utilization" radius={[4, 4, 0, 0]}>{termUtil.map((_, i) => <Cell key={i} fill={termUtil[i].utilization > 70 ? "#059669" : termUtil[i].utilization > 40 ? "#3b82f6" : "#f97316"} />)}</Bar></BarChart></CardContent></Card>
            <Card><CardHeader><CardTitle className="tnh-cb-title text-sm">Cost Breakdown</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={costBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" paddingAngle={2} label={({ name }) => name}>{costBreakdown.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % 8]} />)}</Pie><Tooltip formatter={(v: number) => fmtINR(v)} /></PieChart></CardContent></Card>
            <Card><CardHeader><CardTitle className="tnh-mc-title text-sm">Mode Comparison (Stacked)</CardTitle></CardHeader><CardContent><AreaChart data={modeComparison} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip />{ROUTE_MODES.map((m, i) => <Area key={m} type="monotone" dataKey={m} stackId="1" stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.6} />)}</AreaChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={showSheet} onOpenChange={setSheetOpen}>
        <SheetContent className="tnh-sheet-content w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="tnh-sheet-header"><SheetTitle className="tnh-sheet-title">Route Details</SheetTitle></SheetHeader>
          {selectedRoute && (
            <div className="tnh-sheet-body mt-6 space-y-4">
              <div className="flex items-center gap-3"><RouteCodeTile code={selectedRoute.code} /><RouteStatusBadge status={selectedRoute.status} /></div>
              <div className="tnh-sheet-grid grid grid-cols-2 gap-4">
                <div className="tnh-sheet-field"><p className="text-xs text-muted-foreground">From</p><CityBadge city={selectedRoute.from} /></div>
                <div className="tnh-sheet-field"><p className="text-xs text-muted-foreground">To</p><CityBadge city={selectedRoute.to} /></div>
                <div className="tnh-sheet-field"><p className="text-xs text-muted-foreground">Mode</p><RouteModeBadge mode={selectedRoute.mode} /></div>
                <div className="tnh-sheet-field"><p className="text-xs text-muted-foreground">Vehicles</p><p className="text-sm font-semibold">{selectedRoute.vehicles}</p></div>
                <div className="tnh-sheet-field"><p className="text-xs text-muted-foreground">Distance</p><DistanceTile km={selectedRoute.distance} /></div>
                <div className="tnh-sheet-field"><p className="text-xs text-muted-foreground">ETA</p><ETATile hours={selectedRoute.eta} /></div>
                <div className="tnh-sheet-field col-span-2"><p className="text-xs text-muted-foreground">Cost</p><p className="text-lg font-bold text-orange-600">{fmtINR(selectedRoute.cost)}</p></div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
