"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Network, Layers, Activity, TrendingUp, TrendingDown, BarChart3, Zap, AlertTriangle, CheckCircle2, Clock, Radio, Globe, Box, Truck, MapPin, GitBranch, Cpu, RefreshCw, Eye, ArrowUpDown, Search } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

// ── Constants ──
const NODE_TYPES = ["supplier", "factory", "warehouse", "dc", "retail", "customer", "port", "airport"] as const
const NODE_EMOJI: Record<string, string> = { supplier: "\U0001f4e6", factory: "\U0001f3ed", warehouse: "\U0001f4e6", dc: "\U0001f3e0", retail: "\U0001f3ea", customer: "\U0001f464", port: "\u2693", airport: "\u2708" }
const LINK_TYPES = ["road", "rail", "sea", "air", "pipeline"] as const
const LINK_EMOJI: Record<string, string> = { road: "\U0001f697", rail: "\U0001f684", sea: "\u26f5", air: "\u2708", pipeline: "\U0001f6e0" }
const SIM_STATUS = ["running", "paused", "completed", "failed", "queued"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"] as const
const REGIONS = ["West", "North", "South", "East", "Central"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#06b6d4", sec: "#8b5cf6", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#06b6d4", "#8b5cf6", "#059669", "#d97706", "#dc2626", "#3b82f6", "#ec4899", "#f59e0b"]

// ── Utilities ──
function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

// ── Visual Components ──
function NodeTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { supplier: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", factory: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", warehouse: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", dc: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", retail: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", customer: "bg-pink-100 text-pink-700 dark:bg-pink-900/30", port: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30", airport: "bg-sky-100 text-sky-700 dark:bg-sky-900/30" }
  return <span className={"sdt-node-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{NODE_EMOJI[type] || "\u2022"} {type}</span>
}

function LinkTypeBadge({ type }: { type: string }) {
  return <span className="sdt-link-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30">{LINK_EMOJI[type] || "\u2022"} {type}</span>
}

function SimStatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { running: "sdt-sim-running bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", paused: "sdt-sim-paused bg-amber-100 text-amber-700 dark:bg-amber-900/30", completed: "sdt-sim-done bg-blue-100 text-blue-700 dark:bg-blue-900/30", failed: "sdt-sim-failed bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]", queued: "sdt-sim-queued bg-gray-100 text-gray-500 dark:bg-gray-900/30" }
  const icons: Record<string, React.ReactNode> = { running: <Radio className="w-3 h-3" />, paused: <Clock className="w-3 h-3" />, completed: <CheckCircle2 className="w-3 h-3" />, failed: <AlertTriangle className="w-3 h-3" />, queued: <Clock className="w-3 h-3" /> }
  return <span className={"sdt-sim-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{icons[status]} {status}</span>
}

function ThroughputBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  const col = pct >= 80 ? TH.ok : pct >= 50 ? TH.pri : TH.err
  return <div className="sdt-throughput-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: pct + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{pct}%</span></div>
}

function UtilGauge({ value }: { value: number }) {
  const col = value >= 85 ? TH.err : value >= 60 ? TH.warn : TH.ok
  return <div className="sdt-util-gauge flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0
  const col = pos ? TH.ok : TH.err
  return <span className="sdt-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) {
  return <span className="sdt-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20">{city}</span>
}

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) {
  return <Card className="sdt-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card>
}

function ValueTile({ label, value }: { label: string; value: string | number }) {
  return <div className="sdt-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}

function HealthRing({ value, label }: { value: number; label: string }) {
  const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err
  const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ
  return <div className="sdt-health-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div>
}

function LatencyBadge({ ms }: { ms: number }) {
  const col = ms <= 100 ? TH.ok : ms <= 300 ? TH.warn : TH.err
  return <span className="sdt-latency-badge inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: col }}><Zap className="w-3 h-3"/>{ms}ms</span>
}

function RiskBadge({ level }: { level: string }) {
  const cols: Record<string, string> = { low: "sdt-risk-low bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", medium: "sdt-risk-med bg-amber-100 text-amber-700 dark:bg-amber-900/30", high: "sdt-risk-high bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_6px_rgba(220,38,38,0.3)]", critical: "sdt-risk-crit bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_10px_rgba(220,38,38,0.5)]" }
  return <span className={"sdt-risk-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[level] || "")}>{level}</span>
}

// ── Data Generators ──
function genNodes() {
  return Array.from({ length: 60 }, (_, i) => {
    const nt = pick(NODE_TYPES, i * 3 + 1)
    return {
      id: "NODE-" + String(i + 1).padStart(4, "0"),
      type: nt,
      name: pick(["Tata Steel Hub", "Reliance DC South", "Flipkart Warehouse BLR", "Amazon FC HYD", "BigBasket DC MUM", "DMart Hub DEL", "Bhilwara Warehouse", "Port Mundra", "IGI Airport Hub", "Rail Terminal NCR", "Pharma cold chain", "Auto parts depot", "FMCG super hub", "Electronics zone", "Textile warehouse", "Food processing unit"], i * 3 + 2),
      city: pick(CITIES, i * 3 + 3),
      region: pick(REGIONS, i * 3 + 4),
      capacity: ri(500, 50000, i + 7),
      utilization: ri(30, 98, i + 13),
      throughput: ri(200, 15000, i + 17),
      health: ri(60, 99, i + 19),
      status: pick(["active", "active", "active", "maintenance", "overflow", "degraded"], i + 23),
      latency: ri(15, 450, i + 29),
      connections: ri(2, 18, i + 31)
    }
  })
}

function genLinks() {
  return Array.from({ length: 50 }, (_, i) => {
    const lt = pick(LINK_TYPES, i * 3 + 1)
    return {
      id: "LINK-" + String(i + 1).padStart(4, "0"),
      type: lt,
      source: "NODE-" + String(ri(1, 60, i + 7)).padStart(4, "0"),
      dest: "NODE-" + String(ri(1, 60, i + 11)).padStart(4, "0"),
      distance: ri(50, 2500, i + 13),
      cost: ri(500, 50000, i + 17),
      transitTime: ri(2, 120, i + 19),
      utilization: ri(20, 95, i + 23),
      reliability: ri(75, 99, i + 29),
      co2: +(ri(1, 500, i + 31) / 10).toFixed(1),
      status: pick(["active", "active", "active", "delayed", "disrupted", "congested"], i + 37),
      volume: ri(100, 8000, i + 41)
    }
  })
}

function genSimulations() {
  return Array.from({ length: 20 }, (_, i) => {
    const st = pick(SIM_STATUS, i * 3 + 1)
    return {
      id: "SIM-" + String(i + 1).padStart(4, "0"),
      name: pick(["Festival Rush Surge", "Monsoon Disruption", "Port Strike Impact", "Rail Blockage Test", "Demand Spike 200%", "Supplier Failure Cascade", "Warehouse Fire Drill", "Road Flood Scenario", "Customs Delay Wave", "Fuel Price Hike", "New Market Entry", "DC Closure Model", "Multi-Modal Shift", "Inventory Buffer Test", "Lead Time Analysis", "Cost Optimization Run", "Carbon Reduction Plan", "Capacity Expansion", "Network Redesign", "Peak Season Stress"], i * 3 + 2),
      status: st,
      duration: ri(10, 480, i + 7),
      progress: st === "completed" ? 100 : st === "running" ? ri(10, 95, i + 11) : 0,
      nodes: ri(10, 60, i + 13),
      events: ri(50, 2000, i + 17),
      accuracy: ri(70, 98, i + 19),
      created: "2026-07-" + String(ri(1, 30, i + 23)).padStart(2, "0"),
      riskImpact: pick(["low", "medium", "high", "critical"], i + 29)
    }
  })
}

function genCharts() {
  const throughput = MO.map((m, i) => ({ month: m, actual: ri(20000, 80000, i + 101), digital: ri(18000, 75000, i + 151), predicted: ri(19000, 82000, i + 201) }))
  const nodeDist = NODE_TYPES.map((n, i) => ({ type: n, count: ri(3, 25, i + 301), avgHealth: ri(60, 98, i + 351) }))
  const linkUtil = LINK_TYPES.map((l, i) => ({ type: l, utilization: ri(30, 95, i + 401), cost: ri(10000, 200000, i + 451), co2: ri(50, 800, i + 501) }))
  const riskTrend = MO.map((m, i) => ({ month: m, disruptions: ri(1, 15, i + 551), resilience: ri(70, 98, i + 601), cost: ri(5000, 50000, i + 651) }))
  return { throughput, nodeDist, linkUtil, riskTrend }
}

// ── Main Component ──
export default function SupplyChainDigitalTwinView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null)
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const nodes = useMemo(() => genNodes(), [])
  const links = useMemo(() => genLinks(), [])
  const simulations = useMemo(() => genSimulations(), [])
  const charts = useMemo(() => genCharts(), [])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const sortIcon = (f: string) => sortField === f ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""

  const filterNodes = useMemo(() => {
    if (!search) return nodes
    const lq = search.toLowerCase()
    return nodes.filter(n => Object.values(n).some(v => typeof v === "string" && v.toLowerCase().includes(lq)))
  }, [nodes, search])
  const sortedNodes = useMemo(() => [...filterNodes].sort((a, b) => { const va = a[sortField as keyof typeof a], vb = b[sortField as keyof typeof b]; if (va == null || vb == null) return 0; const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true }); return sortDir === "asc" ? cmp : -cmp }), [filterNodes, sortField, sortDir])

  const filterLinks = useMemo(() => {
    if (!search) return links
    const lq = search.toLowerCase()
    return links.filter(l => Object.values(l).some(v => typeof v === "string" && v.toLowerCase().includes(lq)))
  }, [links, search])

  const filterSims = useMemo(() => {
    if (!search) return simulations
    const lq = search.toLowerCase()
    return simulations.filter(s => Object.values(s).some(v => typeof v === "string" && v.toLowerCase().includes(lq)))
  }, [simulations, search])

  // Computed KPIs
  const avgUtil = Math.round(nodes.reduce((s, n) => s + n.utilization, 0) / nodes.length)
  const totalThroughput = nodes.reduce((s, n) => s + n.throughput, 0)
  const activeSims = simulations.filter(s => s.status === "running").length
  const avgHealth = Math.round(nodes.reduce((s, n) => s + n.health, 0) / nodes.length)

  const handleRefresh = () => { setSearch(""); setSortField("id"); setSortDir("asc") }

  // Build filter groups for toolbar
  const nodeFilterGroups = useMemo(() => {
    const typeCounts: Record<string, number> = {}
    const cityCounts: Record<string, number> = {}
    nodes.forEach(n => { typeCounts[n.type] = (typeCounts[n.type] || 0) + 1; cityCounts[n.city] = (cityCounts[n.city] || 0) + 1 })
    return [
      { key: "type", label: "Node Type", options: Object.entries(typeCounts).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) },
      { key: "city", label: "City", options: Object.entries(cityCounts).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count).slice(0, 10) }
    ]
  }, [nodes])

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
  const filteredCount = filterNodes.length

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile label="Total Nodes" value={nodes.length.toString()} icon={<Box className="w-4 h-4 text-cyan-500"/>} trend={5.2} color={TH.pri}/>
        <KpiTile label="Total Throughput" value={totalThroughput.toLocaleString()} icon={<Truck className="w-4 h-4 text-violet-500"/>} trend={8.7} color={TH.sec}/>
        <KpiTile label="Avg Utilization" value={avgUtil + "%"} icon={<Activity className="w-4 h-4 text-emerald-500"/>} trend={2.1} color={TH.ok}/>
        <KpiTile label="Active Simulations" value={activeSims.toString()} icon={<Cpu className="w-4 h-4 text-amber-500"/>} trend={-3.4} color={TH.warn}/>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <HealthRing value={avgHealth} label="Network Health"/>
        <HealthRing value={Math.round(links.reduce((s, l) => s + l.reliability, 0) / links.length)} label="Link Reliability"/>
        <HealthRing value={Math.round(simulations.reduce((s, si) => s + si.accuracy, 0) / simulations.length)} label="Sim Accuracy"/>
        <HealthRing value={95} label="Data Freshness"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="sdt-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Throughput: Real vs Digital Twin (Monthly)</CardTitle></CardHeader><CardContent><AreaChart data={charts.throughput} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Area type="monotone" dataKey="actual" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/><Area type="monotone" dataKey="digital" stroke={TH.sec} fill={TH.sec} fillOpacity={0.15}/><Line type="monotone" dataKey="predicted" stroke={TH.ok} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }}/></AreaChart></CardContent></Card>
        <Card className="sdt-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Node Distribution & Health</CardTitle></CardHeader><CardContent><BarChart data={charts.nodeDist} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="type" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="count" fill={TH.pri} radius={[2, 2, 0, 0]}/><Bar dataKey="avgHealth" fill={TH.ok} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card>
        <Card className="sdt-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Link Utilization by Type</CardTitle></CardHeader><CardContent><BarChart data={charts.linkUtil} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="type" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="utilization" fill={TH.sec} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card>
        <Card className="sdt-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Risk & Resilience Trend</CardTitle></CardHeader><CardContent><LineChart data={charts.riskTrend} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Line type="monotone" dataKey="disruptions" stroke={TH.err} strokeWidth={2} dot={{ r: 3 }}/><Line type="monotone" dataKey="resilience" stroke={TH.ok} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }}/></LineChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <ModuleBreadcrumb items={[{ label: "Analytics" }, { label: "Digital Twin" }, { label: "Network Nodes" }]}/>
      <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={nodeFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={nodes.length} filteredCount={filteredCount} onRefresh={handleRefresh} placeholder="Search nodes by name, city, type..." />
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]">
        <table className="sdt-table w-full text-xs"><thead className="bg-cyan-50 dark:bg-cyan-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("name")}>Name {sortIcon("name")}</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">City</th><th className="p-2 text-right">Utilization</th><th className="p-2 text-right">Throughput</th><th className="p-2 text-left">Health</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Latency</th><th className="p-2 text-right">Connections</th></tr></thead>
        <tbody>{sortedNodes.map(n => <tr key={n.id} className="sdt-table-row border-t hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 cursor-pointer" onClick={() => setDetail(n as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{n.id}</td><td className="p-2 font-medium">{n.name}</td><td className="p-2"><NodeTypeBadge type={n.type}/></td><td className="p-2"><CityBadge city={n.city}/></td><td className="p-2"><UtilGauge value={n.utilization}/></td><td className="p-2 text-right">{n.throughput.toLocaleString()}</td><td className="p-2"><div className="flex items-center gap-1"><div className="w-8 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full" style={{ width: n.health + "%", backgroundColor: n.health >= 90 ? TH.ok : n.health >= 70 ? TH.warn : TH.err }}/></div><span className="text-[10px]">{n.health}%</span></div></td><td className="p-2"><span className={"sdt-status-badge inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium " + (n.status === "active" ? "bg-emerald-100 text-emerald-700" : n.status === "maintenance" ? "bg-amber-100 text-amber-700" : n.status === "overflow" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600")}>{n.status}</span></td><td className="p-2"><LatencyBadge ms={n.latency}/></td><td className="p-2 text-right">{n.connections}</td></tr>)}</tbody></table>
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>Showing {sortedNodes.length} of {nodes.length} nodes</span>{totalActiveFilters > 0 && <span>{totalActiveFilters} filters active</span>}</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-3">
      <ModuleBreadcrumb items={[{ label: "Analytics" }, { label: "Digital Twin" }, { label: "Network Links" }]}/>
      <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={[]} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={links.length} filteredCount={filterLinks.length} onRefresh={handleRefresh} placeholder="Search links by ID, type, status..." />
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]">
        <table className="sdt-table w-full text-xs"><thead className="bg-violet-50 dark:bg-violet-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Source</th><th className="p-2 text-left">Dest</th><th className="p-2 text-right">Distance</th><th className="p-2 text-right">Cost</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Utilization</th><th className="p-2 text-left">Reliability</th><th className="p-2 text-left">Status</th></tr></thead>
        <tbody>{filterLinks.map(l => <tr key={l.id} className="sdt-table-row border-t hover:bg-violet-50/50 dark:hover:bg-violet-900/10 cursor-pointer" onClick={() => setDetail(l as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{l.id}</td><td className="p-2"><LinkTypeBadge type={l.type}/></td><td className="p-2 font-mono text-[10px]">{l.source}</td><td className="p-2 font-mono text-[10px]">{l.dest}</td><td className="p-2 text-right">{l.distance} km</td><td className="p-2 text-right font-medium">{"\u20b9"}{l.cost.toLocaleString()}</td><td className="p-2 text-right">{l.transitTime}h</td><td className="p-2"><ThroughputBar value={l.utilization} max={100}/></td><td className="p-2"><span className="text-[10px] font-bold" style={{ color: l.reliability >= 95 ? TH.ok : l.reliability >= 85 ? TH.warn : TH.err }}>{l.reliability}%</span></td><td className="p-2"><span className={"sdt-link-status inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium " + (l.status === "active" ? "bg-emerald-100 text-emerald-700" : l.status === "delayed" ? "bg-amber-100 text-amber-700" : l.status === "disrupted" ? "bg-red-100 text-red-700 shadow-[0_0_4px_rgba(220,38,38,0.3)]" : "bg-gray-100 text-gray-600")}>{l.status}</span></td></tr>)}</tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filterLinks.length} links</div>
    </div>
  )

  const tab3 = (
    <div className="space-y-4">
      <ModuleBreadcrumb items={[{ label: "Analytics" }, { label: "Digital Twin" }, { label: "Simulations" }]}/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {simulations.map(s => (
          <Card key={s.id} className={"sdt-sim-card glass-subtle hover:shadow-lg transition-shadow " + (s.status === "running" ? "border-emerald-300 dark:border-emerald-700" : s.status === "failed" ? "border-red-300 dark:border-red-700" : "")}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between"><span className="font-semibold text-xs">{s.name}</span><SimStatusBadge status={s.status}/></div>
              <div className="grid grid-cols-3 gap-1.5"><ValueTile label="Nodes" value={s.nodes}/><ValueTile label="Events" value={s.events.toLocaleString()}/><ValueTile label="Accuracy" value={s.accuracy + "%"}/></div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Duration</span><span>{s.duration} min</span></div>
              {s.status === "running" && <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: s.progress + "%" }}/></div>}
              {s.status === "completed" && <div className="text-[10px] text-emerald-600 font-medium">100% complete</div>}
              <div className="flex items-center justify-between"><RiskBadge level={s.riskImpact}/><span className="text-[10px] text-muted-foreground">{s.created}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tab4 = (
    <div className="space-y-4">
      <ModuleBreadcrumb items={[{ label: "Analytics" }, { label: "Digital Twin" }, { label: "KPI Dashboard" }]}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="sdt-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-cyan-600">{nodes.filter(n => n.utilization >= 80).length}</div><div className="text-[10px] text-muted-foreground mt-1">High Util Nodes</div><div className="mt-2 h-1 rounded-full bg-gray-200"><div className="h-full rounded-full bg-cyan-500" style={{ width: (nodes.filter(n => n.utilization >= 80).length / nodes.length * 100) + "%" }}/></div></CardContent></Card>
        <Card className="sdt-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-violet-600">{links.filter(l => l.status === "disrupted").length}</div><div className="text-[10px] text-muted-foreground mt-1">Disrupted Links</div><div className="mt-2 h-1 rounded-full bg-gray-200"><div className="h-full rounded-full bg-red-500" style={{ width: (links.filter(l => l.status === "disrupted").length / links.length * 100) + "%" }}/></div></CardContent></Card>
        <Card className="sdt-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-emerald-600">{"\u20b9"}{links.reduce((s, l) => s + l.co2 * 100, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div><div className="text-[10px] text-muted-foreground mt-1">Total CO2 Cost</div></CardContent></Card>
        <Card className="sdt-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-amber-600">{simulations.filter(s => s.riskImpact === "critical").length}</div><div className="text-[10px] text-muted-foreground mt-1">Critical Risk Sims</div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="sdt-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Node Type Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={NODE_TYPES.map((t) => ({ name: t, value: nodes.filter(n => n.type === t).length }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{NODE_TYPES.map((_, i) => <Cell key={i} fill={PC[i % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
        <Card className="sdt-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Link Mode Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={LINK_TYPES.map((t) => ({ name: t, value: links.filter(l => l.type === t).length }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{LINK_TYPES.map((_, i) => <Cell key={i} fill={PC[(i + 3) % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
      </div>
    </div>
  )

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: <Network className="w-3.5 h-3.5" />, content: tab0 },
    { key: "nodes", label: "Network Nodes", icon: <Box className="w-3.5 h-3.5" />, content: tab1 },
    { key: "links", label: "Network Links", icon: <GitBranch className="w-3.5 h-3.5" />, content: tab2 },
    { key: "simulations", label: "Simulations", icon: <Cpu className="w-3.5 h-3.5" />, content: tab3 },
    { key: "insights", label: "Insights", icon: <Eye className="w-3.5 h-3.5" />, content: tab4 }
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Supply Chain Digital Twin" description="Real-time digital replica of your entire supply chain network with simulation, risk analysis, and predictive optimization"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30"><Radio className="w-3 h-3 text-cyan-600"/><span className="text-[10px] font-semibold text-cyan-700 dark:text-cyan-300">{activeSims} Simulations Running</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><CheckCircle2 className="w-3 h-3 text-emerald-600"/><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{avgHealth}% Network Health</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30"><Layers className="w-3 h-3 text-violet-600"/><span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">{nodes.length} Nodes | {links.length} Links</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><RefreshCw className="w-3 h-3 text-amber-600"/><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">Live Sync</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Node Detail</SheetTitle></SheetHeader>
          {detail && <div className="mt-4 space-y-3">
            <div className="sdt-detail-header rounded-lg p-4 bg-gradient-to-br from-cyan-500 to-violet-600 text-white"><div className="text-lg font-bold">{String(detail.id)}</div><div className="text-xs opacity-80 mt-1">{String(detail.name || detail.type || "Record")}</div></div>
            {Object.entries(detail).filter(([k]) => k !== "id").map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b"><span className="text-[10px] text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><span className="text-xs font-medium">{typeof v === "number" ? v.toLocaleString() : String(v)}</span></div>)}
          </div>}
        </SheetContent>
      </Sheet>
    </div>
  )
}