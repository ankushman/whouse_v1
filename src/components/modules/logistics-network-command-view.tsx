"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Network, Zap, AlertTriangle, CheckCircle2, BarChart3, TrendingUp, TrendingDown, MapPin, Package, Timer, ArrowUpDown, Truck, TrainFront, Ship, Plane, Gauge, Clock, DollarSign, Wifi, Radio, Boxes, Globe, Building2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const NODE_TYPES = ["warehouse", "hub", "crossdock", "fulfillment", "dark_store", "micro_fc"] as const
const NODE_STATUS = ["active", "maintenance", "overloaded", "offline", "degraded", "scaling"] as const
const REGIONS = ["North", "South", "West", "East", "Central"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kochi", "Indore"] as const
const LINK_STATUS = ["healthy", "congested", "degraded", "down", "backup"] as const
const LINK_TYPES = ["road", "rail", "air", "sea", "pipeline"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#3b82f6", sec: "#059669", ter: "#7c3aed", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#3b82f6", "#059669", "#7c3aed", "#f59e0b", "#dc2626", "#06b6d4", "#ec4899", "#8b5cf6"]
const NODE_EMOJI: Record<string, string> = { warehouse: "\U0001f3e2", hub: "\U0001f4cd", crossdock: "\U0001f680", fulfillment: "\U0001f4e6", dark_store: "\U0001f3ea", micro_fc: "\U0001f39b" }
const LINK_EMOJI: Record<string, string> = { road: "\U0001f69a", rail: "\U0001f682", air: "\u2708\ufe0f", sea: "\U0001f6e2\ufe0f", pipeline: "\U0001f6e1\ufe0f" }

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function NodeTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { warehouse: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", hub: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", crossdock: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", fulfillment: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", dark_store: "bg-pink-100 text-pink-700 dark:bg-pink-900/30", micro_fc: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30" }
  return <span className={"lnc-node-type-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{NODE_EMOJI[type] || "\u2022"} {type.replace(/_/g, " ")}</span>
}

function StatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { active: "lnc-active bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", overloaded: "lnc-overloaded bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]", offline: "lnc-offline bg-gray-200 text-gray-500 dark:bg-gray-700", degraded: "lnc-degraded bg-orange-100 text-orange-700 dark:bg-orange-900/30", scaling: "bg-blue-100 text-blue-700 dark:bg-blue-900/30" }
  return <span className={"lnc-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status}</span>
}

function LinkStatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { healthy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", congested: "lnc-congested bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_6px_rgba(220,38,38,0.3)]", degraded: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", down: "lnc-down bg-gray-200 text-gray-500 dark:bg-gray-700", backup: "bg-blue-100 text-blue-700 dark:bg-blue-900/30" }
  return <span className={"lnc-link-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{LINK_EMOJI["road"] || ""} {status}</span>
}

function LinkTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { road: "bg-blue-100 text-blue-700", rail: "bg-red-100 text-red-700", air: "bg-cyan-100 text-cyan-700", sea: "bg-violet-100 text-violet-700", pipeline: "bg-amber-100 text-amber-700" }
  return <span className={"lnc-link-type-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "")}>{LINK_EMOJI[type] || "\u2022"} {type}</span>
}

function UtilBar({ value }: { value: number }) {
  const col = value >= 90 ? TH.err : value >= 70 ? TH.warn : TH.ok
  return <div className="lnc-util-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function ThroughputBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100); const col = pct >= 90 ? TH.err : pct >= 70 ? TH.warn : TH.ok
  return <div className="lnc-throughput-bar flex items-center gap-1.5"><div className="w-20 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: pct + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}/{max}</span></div>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0; const col = pos ? TH.ok : TH.err
  return <span className="lnc-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) { return <span className="lnc-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20">{city}</span> }

function RegionBadge({ region }: { region: string }) {
  const cols: Record<string, string> = { North: "bg-blue-100 text-blue-700", South: "bg-emerald-100 text-emerald-700", West: "bg-violet-100 text-violet-700", East: "bg-amber-100 text-amber-700", Central: "bg-pink-100 text-pink-700" }
  return <span className={"lnc-region-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium " + (cols[region] || "bg-gray-100 text-gray-600")}>{region}</span>
}

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) { return <Card className="lnc-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card> }

function ValueTile({ label, value }: { label: string; value: string | number }) { return <div className="lnc-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div> }

function HealthRing({ value, label }: { value: number; label: string }) { const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err; const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ; return <div className="lnc-health-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div> }

function NetworkDot({ status, size }: { status: string; size: number }) {
  const col = status === "active" ? TH.ok : status === "overloaded" ? TH.err : status === "degraded" ? TH.warn : "#94a3b8"
  return <div className="lnc-network-dot rounded-full" style={{ width: size, height: size, backgroundColor: col, boxShadow: "0 0 " + (size/2) + "px " + col }} />
}

function genNodes() {
  return Array.from({ length: 55 }, (_, i) => ({
    id: "N-" + String(i + 1).padStart(4, "0"),
    name: pick(["Mumbai Central WH", "Delhi NCR Hub", "Bangalore South FC", "Chennai Port Crossdock", "Hyderabad Mega Hub", "Kolkata East DC", "Pune West Fulfillment", "Ahmedabad North WH", "Jaipur Mini Hub", "Lucknow Central WH", "Kochi Spice Crossdock", "Indore Midland FC", "Gurgaon Tech Park DS", "Noida Express DS", "Whitefield Dark Store", "Tambaram FC", "Hi-Tec City Hub", "Howrah Bridge DC", "Magarpatta FC", "Bavdhan Micro FC"], i + 1),
    type: pick(NODE_TYPES, i * 3 + 2),
    city: pick(CITIES, i * 3 + 5),
    region: pick(REGIONS, i * 3 + 7),
    capacity: ri(500, 50000, i + 11),
    utilization: ri(15, 98, i + 17),
    throughput: ri(50, 8000, i + 23),
    status: pick(NODE_STATUS, i + 29),
    connectivity: ri(2, 12, i + 37),
    latency: ri(5, 200, i + 43),
    uptime: ri(85, 100, i + 47),
    SLA: ri(80, 100, i + 53),
    costPerUnit: ri(20, 500, i + 59),
    staffCount: ri(5, 300, i + 67)
  }))
}

function genLinks() {
  return Array.from({ length: 45 }, (_, i) => ({
    id: "LK-" + String(i + 1).padStart(4, "0"),
    source: pick(CITIES.slice(0, 8), i * 2 + 3),
    target: pick(CITIES.slice(0, 8), i * 2 + 7),
    type: pick(LINK_TYPES, i + 11),
    bandwidth: ri(100, 10000, i + 17),
    usedBandwidth: ri(10, 9000, i + 23),
    latency: ri(2, 500, i + 29),
    status: pick(LINK_STATUS, i + 37),
    cost: ri(1000, 200000, i + 43),
    packetsPerDay: ri(100, 50000, i + 47),
    redundancy: pick(["primary", "backup", "failover"], i + 53)
  }))
}

function genCharts() {
  const nodeTrend = MO.map((m, i) => ({ month: m, nodes: ri(40, 60, i + 101), newConnections: ri(5, 30, i + 151), incidents: ri(1, 15, i + 201) }))
  const regionDist = REGIONS.map((r, i) => ({ region: r, nodes: ri(5, 20, i + 301), capacity: ri(10000, 200000, i + 351) }))
  const throughputTrend = MO.map((m, i) => ({ month: m, inbound: ri(5000, 25000, i + 401), outbound: ri(4000, 22000, i + 451), internal: ri(1000, 8000, i + 501) }))
  const linkDist = LINK_TYPES.map((t, i) => ({ type: t, links: ri(3, 15, i + 601), bandwidth: ri(1000, 8000, i + 651) }))
  return { nodeTrend, regionDist, throughputTrend, linkDist }
}

export default function LogisticsNetworkCommandView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const nodes = useMemo(() => genNodes(), [])
  const links = useMemo(() => genLinks(), [])
  const charts = useMemo(() => genCharts(), [])
  const filterNodes = useMemo(() => { let res = nodes; if (search) { const q = search.toLowerCase(); res = res.filter(n => Object.values(n).some(val => typeof val === "string" && val.toLowerCase().includes(q))) } for (const [k, vals] of Object.entries(activeFilters)) { if (vals.length > 0) res = res.filter(n => vals.includes(String(n[k as keyof typeof n]))) } return res }, [nodes, search, activeFilters])
  const sortedNodes = useMemo(() => { if (!sortCol) return filterNodes; return [...filterNodes].sort((a: any, b: any) => { const av = a[sortCol], bv = b[sortCol]; const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv; return sortDir === "asc" ? cmp : -cmp }) }, [filterNodes, sortCol, sortDir])
  const toggleSort = (col: string) => { if (sortCol === col) { setSortDir(d => d === "asc" ? "desc" : "asc") } else { setSortCol(col); setSortDir("asc") } }
  const toggleFilter = (group: string, value: string) => { setActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } }) }
  const clearAllFilters = () => setActiveFilters({})
  const handleRefresh = () => { setSearch(""); setActiveFilters({}); setSortCol(null) }

  const nodeFilterGroups = useMemo(() => {
    const tc: Record<string, number> = {}; const sc: Record<string, number> = {}; const rc: Record<string, number> = {}
    nodes.forEach(n => { tc[n.type] = (tc[n.type] || 0) + 1; sc[n.status] = (sc[n.status] || 0) + 1; rc[n.region] = (rc[n.region] || 0) + 1 })
    return [{ key: "type", label: "Type", options: Object.entries(tc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "status", label: "Status", options: Object.entries(sc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "region", label: "Region", options: Object.entries(rc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }]
  }, [nodes])

  const activeNodes = nodes.filter((n: any) => n.status === "active").length
  const avgUptime = Math.round(nodes.reduce((s: number, n: any) => s + n.uptime, 0) / nodes.length)
  const healthyLinks = links.filter((l: any) => l.status === "healthy").length

  return <div className="space-y-4 p-4">
    <PageHeader title="Logistics Network Command" description="Centralized network topology management with real-time node monitoring and link optimization"/>

    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="grid grid-cols-4 w-full lnc-tabs">
        <TabsTrigger value="dashboard"><BarChart3 className="w-3 h-3 mr-1"/>Dashboard</TabsTrigger>
        <TabsTrigger value="nodes"><Network className="w-3 h-3 mr-1"/>Nodes</TabsTrigger>
        <TabsTrigger value="links"><Wifi className="w-3 h-3 mr-1"/>Links</TabsTrigger>
        <TabsTrigger value="insights"><TrendingUp className="w-3 h-3 mr-1"/>Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <KpiTile label="Active Nodes" value={String(activeNodes)} icon={<Network className="w-4 h-4" style={{ color: TH.pri }}/>} trend={6.5} color={TH.pri}/>
          <KpiTile label="Network Uptime" value={avgUptime + "%"} icon={<CheckCircle2 className="w-4 h-4" style={{ color: TH.ok }}/>} trend={2.1} color={TH.ok}/>
          <KpiTile label="Healthy Links" value={String(healthyLinks)} icon={<Wifi className="w-4 h-4" style={{ color: TH.ter }}/>} trend={4.8} color={TH.ter}/>
          <KpiTile label="Incidents" value={String(ri(3, 12, 99))} icon={<AlertTriangle className="w-4 h-4" style={{ color: TH.err }}/>} trend={-8.3} color={TH.err}/>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <HealthRing value={avgUptime} label="Uptime"/>
          <HealthRing value={Math.round(nodes.reduce((s: number, n: any) => s + n.utilization, 0) / nodes.length)} label="Util"/>
          <HealthRing value={Math.round(healthyLinks / links.length * 100)} label="Links"/>
          <HealthRing value={ri(85, 97, 77)} label="SLA"/>
          <HealthRing value={ri(70, 95, 78)} label="Throughput"/>
          <HealthRing value={ri(60, 90, 79)} label="Capacity"/>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card className="lnc-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Network Node Trend</CardTitle></CardHeader><CardContent className="p-2"><LineChart data={charts.nodeTrend} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Line type="monotone" dataKey="nodes" stroke={TH.pri}/><Line type="monotone" dataKey="newConnections" stroke={TH.ok}/><Line type="monotone" dataKey="incidents" stroke={TH.err}/></LineChart></CardContent></Card>
          <Card className="lnc-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Regional Distribution</CardTitle></CardHeader><CardContent className="p-2"><BarChart data={charts.regionDist} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="region" fontSize={9}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Bar dataKey="nodes" fill={TH.pri}/><Bar dataKey="capacity" fill={TH.ter}/></BarChart></CardContent></Card>
          <Card className="lnc-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Throughput Trend</CardTitle></CardHeader><CardContent className="p-2"><AreaChart data={charts.throughputTrend} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Area type="monotone" dataKey="inbound" stroke={TH.pri} fill={TH.pri} fillOpacity={0.15}/><Area type="monotone" dataKey="outbound" stroke={TH.ok} fill={TH.ok} fillOpacity={0.15}/><Area type="monotone" dataKey="internal" stroke={TH.ter} fill={TH.ter} fillOpacity={0.15}/></AreaChart></CardContent></Card>
        </div>
      </TabsContent>

      <TabsContent value="nodes" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Nodes" }]}/>
        <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={nodeFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={nodes.length} filteredCount={filterNodes.length} onRefresh={handleRefresh} placeholder="Search nodes..."/>
        <Card className="lnc-table-card"><CardContent className="p-2"><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="border-b lnc-table-header"><th className="p-1.5 text-left cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="w-3 h-3 inline"/></th><th className="p-1.5 text-left">Node Name</th><th className="p-1.5 text-left">Type</th><th className="p-1.5 text-left">City</th><th className="p-1.5 text-left">Region</th><th className="p-1.5 text-left cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("utilization")}>Util <ArrowUpDown className="w-3 h-3 inline"/></th><th className="p-1.5 text-left">Throughput</th><th className="p-1.5 text-left cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("uptime")}>Uptime</th><th className="p-1.5 text-left">Status</th><th className="p-1.5 text-left">Connect</th></tr></thead><tbody>
          {sortedNodes.map((n: any) => <tr key={n.id} className="border-b hover:bg-blue-50/50 dark:hover:bg-blue-900/10 lnc-table-row"><td className="p-1.5 font-mono">{n.id}</td><td className="p-1.5 font-medium text-[10px]">{n.name}</td><td className="p-1.5"><NodeTypeBadge type={n.type}/></td><td className="p-1.5"><CityBadge city={n.city}/></td><td className="p-1.5"><RegionBadge region={n.region}/></td><td className="p-1.5"><UtilBar value={n.utilization}/></td><td className="p-1.5"><ThroughputBar value={n.throughput} max={n.capacity}/></td><td className="p-1.5"><span className={"text-[10px] font-bold " + (n.uptime >= 99 ? "text-emerald-600" : n.uptime >= 95 ? "text-amber-600" : "text-red-600")}>{n.uptime}%</span></td><td className="p-1.5"><StatusBadge status={n.status}/></td><td className="p-1.5"><div className="flex items-center gap-1"><NetworkDot status={n.status} size={8}/><span className="text-[10px]">{n.connectivity}</span></div></td></tr>)}
          </tbody></table></div></CardContent></Card>
      </TabsContent>

      <TabsContent value="links" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Links" }]}/>
        <div className="grid grid-cols-4 gap-3">
          <ValueTile label="Healthy" value={String(links.filter((l: any) => l.status === "healthy").length)}/>
          <ValueTile label="Congested" value={String(links.filter((l: any) => l.status === "congested").length)}/>
          <ValueTile label="Degraded" value={String(links.filter((l: any) => l.status === "degraded").length)}/>
          <ValueTile label="Total Bandwidth" value={String(links.reduce((s: number, l: any) => s + l.bandwidth, 0).toLocaleString())}/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="lnc-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Link Type Distribution</CardTitle></CardHeader><CardContent className="p-2"><PieChart height={200}><Pie data={LINK_TYPES.map((t, i) => ({ name: t, value: ri(5, 20, i + 701) }))} cx="50%" cy="50%" outerRadius={60} dataKey="value" label><Cell fill={PC[0]}/><Cell fill={PC[1]}/><Cell fill={PC[2]}/><Cell fill={PC[3]}/><Cell fill={PC[4]}/></Pie><Tooltip contentStyle={{ fontSize: 11 }}/></PieChart></CardContent></Card>
          <Card className="lnc-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Bandwidth by Type</CardTitle></CardHeader><CardContent className="p-2"><BarChart data={charts.linkDist} height={200}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="type" fontSize={9}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Bar dataKey="bandwidth" fill={TH.pri}/></BarChart></CardContent></Card>
        </div>
        <Card className="lnc-table-card"><CardContent className="p-2"><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="border-b lnc-table-header"><th className="p-1.5 text-left">ID</th><th className="p-1.5 text-left">Source</th><th className="p-1.5 text-left">Target</th><th className="p-1.5 text-left">Type</th><th className="p-1.5 text-left">Bandwidth</th><th className="p-1.5 text-left">Usage</th><th className="p-1.5 text-left">Latency</th><th className="p-1.5 text-left">Status</th><th className="p-1.5 text-left">Redundancy</th></tr></thead><tbody>
          {links.slice(0, 25).map((l: any) => { const usedPct = Math.round(l.usedBandwidth / l.bandwidth * 100); return <tr key={l.id} className="border-b hover:bg-blue-50/50 dark:hover:bg-blue-900/10 lnc-table-row"><td className="p-1.5 font-mono">{l.id}</td><td className="p-1.5"><CityBadge city={l.source}/></td><td className="p-1.5"><CityBadge city={l.target}/></td><td className="p-1.5"><LinkTypeBadge type={l.type}/></td><td className="p-1.5">{l.bandwidth.toLocaleString()}</td><td className="p-1.5"><UtilBar value={usedPct}/></td><td className="p-1.5"><span className={"text-[10px] font-bold " + (l.latency <= 50 ? "text-emerald-600" : l.latency <= 200 ? "text-amber-600" : "text-red-600")}>{l.latency}ms</span></td><td className="p-1.5"><LinkStatusBadge status={l.status}/></td><td className="p-1.5"><span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{l.redundancy}</span></td></tr> })}
          </tbody></table></div></CardContent></Card>
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Insights" }]}/>
        <div className="grid grid-cols-2 gap-3">
          <Card className="lnc-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500"/>Network Bottleneck Detected</div><div className="text-[10px] text-muted-foreground">Mumbai-Delhi corridor shows 92% bandwidth utilization during peak hours. Crossdock nodes in Chennai and Kolkata report elevated latency {'>'}150ms. Recommend load balancing via Ahmedabad-Bangalore alternate path to redistribute 15% traffic.</div></Card>
          <Card className="lnc-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Network className="w-3 h-3 text-blue-500"/>Capacity Expansion Plan</div><div className="text-[10px] text-muted-foreground">3 dark stores in Pune and 2 micro-fulfillment centers in Lucknow approaching 90% capacity. Auto-scaling triggers should be configured at 85% threshold. Projected demand growth of 28% in Q3 requires 5 additional nodes by August.</div></Card>
          <Card className="lnc-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-500"/>Redundancy Optimization</div><div className="text-[10px] text-muted-foreground">8 critical links currently lack failover paths. Implementing redundant rail+road connections for North-South corridor reduces single-point-of-failure risk by 60%. Cost: INR 12L/month, ROI within 3 months via reduced downtime.</div></Card>
          <Card className="lnc-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Globe className="w-3 h-3 text-violet-500"/>Multi-Region Strategy</div><div className="text-[10px] text-muted-foreground">Central region underrepresented with only 8 nodes vs 15+ in other regions. Adding Kochi and Indore hubs enables 40-min delivery coverage for 12 tier-2 cities. Cross-regional links should use air for high-value, rail for bulk.</div></Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
}
