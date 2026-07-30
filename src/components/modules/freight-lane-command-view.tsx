"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Workflow, Zap, AlertTriangle, CheckCircle2, BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, Radio, Truck, Ship, TrainFront, Plane, Gauge, Clock, DollarSign } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const MODES = ["road", "rail", "air", "sea", "multimodal"] as const
const MODE_EMOJI: Record<string, string> = { road: "\U0001f69a", rail: "\U0001f682", air: "\u2708\ufe0f", sea: "\U0001f6e2\ufe0f", multimodal: "\U0001f517" }
const LANE_STATUS = ["active", "under_maintenance", "congested", "disrupted", "seasonal", "planned"] as const
const PRIORITY = ["critical", "high", "medium", "low"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#06b6d4", sec: "#f59e0b", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#06b6d4", "#f59e0b", "#059669", "#dc2626", "#8b5cf6", "#ec4899", "#14b8a6", "#3b82f6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function ModeBadge({ mode }: { mode: string }) {
  const cols: Record<string, string> = { road: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", rail: "bg-red-100 text-red-700 dark:bg-red-900/30", air: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", sea: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", multimodal: "bg-amber-100 text-amber-700 dark:bg-amber-900/30" }
  return <span className={"flc-mode-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[mode] || "bg-gray-100 text-gray-700")}>{MODE_EMOJI[mode] || "\u2022"} {mode}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { active: "flc-active bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", under_maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", congested: "flc-congested bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_6px_rgba(220,38,38,0.3)]", disrupted: "flc-disrupted bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]", seasonal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", planned: "bg-gray-100 text-gray-600" }
  return <span className={"flc-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status.replace(/_/g, " ")}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const cols: Record<string, string> = { critical: "bg-red-100 text-red-700 dark:bg-red-900/30", high: "bg-amber-100 text-amber-700", medium: "bg-blue-100 text-blue-700", low: "bg-gray-100 text-gray-600" }
  return <span className={"flc-priority-badge inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold " + (cols[priority] || "")}>{priority.toUpperCase()}</span>
}

function UtilBar({ value }: { value: number }) {
  const col = value >= 90 ? TH.err : value >= 70 ? TH.warn : TH.ok
  return <div className="flc-util-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0; const col = pos ? TH.ok : TH.err
  return <span className="flc-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) { return <span className="flc-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20">{city}</span> }

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) { return <Card className="flc-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card> }

function ValueTile({ label, value }: { label: string; value: string | number }) { return <div className="flc-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div> }

function HealthRing({ value, label }: { value: number; label: string }) { const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err; const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ; return <div className="flc-health-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div> }

function genLanes() {
  return Array.from({ length: 60 }, (_, i) => ({
    id: "LN-" + String(i + 1).padStart(4, "0"),
    name: pick(["NH-48 Delhi-Mumbai", "NH-44 Delhi-Chennai", "NH-8 Mumbai-Ahmedabad", "Eastern Freight Corridor", "Western Dedicated Corridor", "Delhi-Kolkata Route", "Mumbai-Bangalore Express", "Chennai-Hyderabad Route", "North-South Express", "Golden Quadrilateral", "Port-to-Factory Link", "SEZ Hub Connector"], i + 1),
    mode: pick(MODES, i * 3 + 2),
    origin: pick(CITIES, i * 3 + 3),
    dest: pick(CITIES, i * 3 + 5),
    distance: ri(100, 2500, i + 7),
    transitTime: ri(2, 72, i + 11),
    cost: ri(5000, 500000, i + 17),
    utilization: ri(20, 98, i + 23),
    onTime: ri(60, 99, i + 29),
    status: pick(LANE_STATUS, i + 37),
    priority: pick(PRIORITY, i + 43),
    shipments: ri(10, 500, i + 47),
    incidents: ri(0, 15, i + 53),
    avgSpeed: ri(20, 80, i + 59)
  }))
}

function genShipments() {
  return Array.from({ length: 40 }, (_, i) => ({
    id: "SHP-" + String(i + 1).padStart(5, "0"),
    lane: "LN-" + String(ri(1, 60, i + 7)).padStart(4, "0"),
    carrier: pick(["BlueDart", "Delhivery", "DFLC", "Container Corp", "IRFC", "Spoton", "XpressBees", "DHL Supply Chain"], i + 11),
    status: pick(["in_transit", "delivered", "delayed", "at_hub", "customs_hold", "cancelled"], i + 19),
    eta: String(ri(1, 48, i + 27)) + "h",
    weight: ri(50, 20000, i + 31),
    value: ri(10000, 5000000, i + 37),
    priority: pick(PRIORITY, i + 43),
    origin: pick(CITIES, i + 47),
    dest: pick(CITIES, i + 53)
  }))
}

function genCharts() {
  const throughput = MO.map((m, i) => ({ month: m, shipments: ri(2000, 8000, i + 101), onTime: ri(70, 98, i + 151), cost: ri(1000000, 5000000, i + 201) }))
  const modeDist = MODES.map((m, i) => ({ mode: m, lanes: ri(5, 25, i + 301), volume: ri(100, 2000, i + 351) }))
  const incLine = MO.map((m, i) => ({ month: m, critical: ri(1, 10, i + 401), major: ri(5, 20, i + 451), minor: ri(10, 40, i + 501) }))
  return { throughput, modeDist, incLine }
}

export default function FreightLaneCommandView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const lanes = useMemo(() => genLanes(), [])
  const shipments = useMemo(() => genShipments(), [])
  const charts = useMemo(() => genCharts(), [])
  const filterLanes = useMemo(() => { let res = lanes; if (search) { const q = search.toLowerCase(); res = res.filter(l => Object.values(l).some(val => typeof val === "string" && val.toLowerCase().includes(q))) } for (const [k, vals] of Object.entries(activeFilters)) { if (vals.length > 0) res = res.filter(l => vals.includes(String(l[k as keyof typeof l]))) } return res }, [lanes, search, activeFilters])
  const sortedLanes = useMemo(() => { if (!sortCol) return filterLanes; return [...filterLanes].sort((a: any, b: any) => { const av = a[sortCol], bv = b[sortCol]; const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv; return sortDir === "asc" ? cmp : -cmp }) }, [filterLanes, sortCol, sortDir])
  const toggleSort = (col: string) => { if (sortCol === col) { setSortDir(d => d === "asc" ? "desc" : "asc") } else { setSortCol(col); setSortDir("asc") } }
  const toggleFilter = (group: string, value: string) => { setActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } }) }
  const clearAllFilters = () => setActiveFilters({})
  const handleRefresh = () => { setSearch(""); setActiveFilters({}); setSortCol(null) }

  const laneFilterGroups = useMemo(() => { const mc: Record<string, number> = {}; const sc: Record<string, number> = {}; const pc: Record<string, number> = {}; lanes.forEach(l => { mc[l.mode] = (mc[l.mode] || 0) + 1; sc[l.status] = (sc[l.status] || 0) + 1; pc[l.priority] = (pc[l.priority] || 0) + 1 }); return [{ key: "mode", label: "Mode", options: Object.entries(mc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "status", label: "Status", options: Object.entries(sc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "priority", label: "Priority", options: Object.entries(pc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }] }, [lanes])

  return <div className="space-y-4 p-4">
    <PageHeader title="Freight Lane Command Center" description="End-to-end transport corridor management with real-time visibility and optimization"/>

    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="grid grid-cols-4 w-full flc-tabs">
        <TabsTrigger value="dashboard"><BarChart3 className="w-3 h-3 mr-1"/>Dashboard</TabsTrigger>
        <TabsTrigger value="lanes"><Workflow className="w-3 h-3 mr-1"/>Lanes</TabsTrigger>
        <TabsTrigger value="shipments"><Package className="w-3 h-3 mr-1"/>Shipments</TabsTrigger>
        <TabsTrigger value="insights"><TrendingUp className="w-3 h-3 mr-1"/>Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <KpiTile label="Active Lanes" value={String(lanes.filter((l: any) => l.status === "active").length)} icon={<Workflow className="w-4 h-4" style={{ color: TH.pri }}/>} trend={8.2} color={TH.pri}/>
          <KpiTile label="Avg Utilization" value="74%" icon={<Gauge className="w-4 h-4" style={{ color: TH.ok }}/>} trend={4.1} color={TH.ok}/>
          <KpiTile label="Incidents" value={String(lanes.reduce((s: number, l: any) => s + l.incidents, 0))} icon={<AlertTriangle className="w-4 h-4" style={{ color: TH.err }}/>} trend={-12.5} color={TH.err}/>
          <KpiTile label="On-Time Rate" value="91%" icon={<Clock className="w-4 h-4" style={{ color: TH.sec }}/>} trend={3.3} color={TH.sec}/>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <HealthRing value={92} label="Uptime"/>
          <HealthRing value={74} label="Util"/>
          <HealthRing value={91} label="On-Time"/>
          <HealthRing value={85} label="Capacity"/>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card className="flc-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Shipment Throughput</CardTitle></CardHeader><CardContent className="p-2"><AreaChart data={charts.throughput} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Area type="monotone" dataKey="shipments" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/></AreaChart></CardContent></Card>
          <Card className="flc-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Mode Distribution</CardTitle></CardHeader><CardContent className="p-2"><BarChart data={charts.modeDist} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="mode" fontSize={9}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Bar dataKey="lanes" fill={TH.sec}/></BarChart></CardContent></Card>
          <Card className="flc-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Incident Trend</CardTitle></CardHeader><CardContent className="p-2"><LineChart data={charts.incLine} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Line type="monotone" dataKey="critical" stroke={TH.err}/><Line type="monotone" dataKey="major" stroke={TH.warn}/><Line type="monotone" dataKey="minor" stroke={TH.ok}/></LineChart></CardContent></Card>
        </div>
      </TabsContent>

      <TabsContent value="lanes" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Lanes" }]}/>
        <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={laneFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={lanes.length} filteredCount={filterLanes.length} onRefresh={handleRefresh} placeholder="Search lanes..."/>
        <Card className="flc-table-card"><CardContent className="p-2"><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="border-b flc-table-header"><th className="p-1.5 text-left cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="w-3 h-3 inline"/></th><th className="p-1.5 text-left">Lane Name</th><th className="p-1.5 text-left">Mode</th><th className="p-1.5 text-left">Route</th><th className="p-1.5 text-left">Distance</th><th className="p-1.5 text-left">Util</th><th className="p-1.5 text-left">On-Time</th><th className="p-1.5 text-left">Status</th><th className="p-1.5 text-left">Priority</th><th className="p-1.5 text-left">Shipments</th></tr></thead><tbody>
          {sortedLanes.map((l: any) => <tr key={l.id} className="border-b hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 flc-table-row"><td className="p-1.5 font-mono">{l.id}</td><td className="p-1.5 font-medium text-[10px]">{l.name}</td><td className="p-1.5"><ModeBadge mode={l.mode}/></td><td className="p-1.5">{l.origin} - {l.dest}</td><td className="p-1.5">{l.distance} km</td><td className="p-1.5"><UtilBar value={l.utilization}/></td><td className="p-1.5"><span className={"text-[10px] font-bold " + (l.onTime >= 90 ? "text-emerald-600" : l.onTime >= 75 ? "text-amber-600" : "text-red-600")}>{l.onTime}%</span></td><td className="p-1.5"><StatusBadge status={l.status}/></td><td className="p-1.5"><PriorityBadge priority={l.priority}/></td><td className="p-1.5">{l.shipments}</td></tr>)}
          </tbody></table></div></CardContent></Card>
      </TabsContent>

      <TabsContent value="shipments" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Shipments" }]}/>
        <div className="grid grid-cols-4 gap-3">
          <ValueTile label="In Transit" value={String(shipments.filter((s: any) => s.status === "in_transit").length)}/>
          <ValueTile label="Delivered" value={String(shipments.filter((s: any) => s.status === "delivered").length)}/>
          <ValueTile label="Delayed" value={String(shipments.filter((s: any) => s.status === "delayed").length)}/>
          <ValueTile label="Avg Transit" value="18h"/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="flc-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Monthly Cost</CardTitle></CardHeader><CardContent className="p-2"><AreaChart data={charts.throughput} height={200}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Area type="monotone" dataKey="cost" stroke={TH.err} fill={TH.err} fillOpacity={0.15}/></AreaChart></CardContent></Card>
          <Card className="flc-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Mode Distribution</CardTitle></CardHeader><CardContent className="p-2"><PieChart height={200}><Pie data={MODES.map((m, i) => ({ name: m, value: ri(10, 50, i + 601) }))} cx="50%" cy="50%" outerRadius={60} dataKey="value" label><Cell fill={PC[0]}/><Cell fill={PC[1]}/><Cell fill={PC[2]}/><Cell fill={PC[3]}/><Cell fill={PC[4]}/></Pie><Tooltip contentStyle={{ fontSize: 11 }}/></PieChart></CardContent></Card>
        </div>
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Insights" }]}/>
        <div className="grid grid-cols-2 gap-3">
          <Card className="flc-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500"/>Congestion Hotspots</div><div className="text-[10px] text-muted-foreground">NH-48 Delhi-Gurgaon and Mumbai-Pune expressway show peak congestion. Average delay increased 22% this month. Recommend time-slot scheduling and alternative routing during peak hours.</div></Card>
          <Card className="flc-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Workflow className="w-3 h-3 text-cyan-500"/>Multimodal Opportunity</div><div className="text-[10px] text-muted-foreground">12 high-volume lanes could benefit from multi-modal shift. Rail-sea combo on Delhi-Chennai route saves 35% cost. Air-road for time-critical shipments on 5 lanes.</div></Card>
          <Card className="flc-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><DollarSign className="w-3 h-3 text-amber-500"/>Cost Optimization</div><div className="text-[10px] text-muted-foreground">Backhaul optimization on 8 lanes could reduce empty miles by 18%. Consolidation centers at Jaipur and Lucknow can improve load factors by 25%.</div></Card>
          <Card className="flc-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-500"/>Digital Corridor</div><div className="text-[10px] text-muted-foreground">Implement GPS tracking on 15 unmonitored lanes. Real-time ETA accuracy currently at 78%. Predictive delay modeling can improve customer SLA by 15%.</div></Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
}