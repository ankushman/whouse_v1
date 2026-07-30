"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { DollarSign, TrendingUp, TrendingDown, Zap, AlertTriangle, CheckCircle2, BarChart3, Calculator, ArrowUpDown, Tag, Target, Package, Truck, Clock, Star, ArrowRightLeft, ShieldCheck, Percent } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const SERVICE_TYPES = ["ftl", "ptl", "express", "air", "surface", "rail", "last_mile", "cold_chain"] as const
const SERVICE_EMOJI: Record<string, string> = { ftl: "🚚", ptl: "📦", express: "⚡", air: "✈️", surface: "🛑", rail: "🚂", last_mile: "🏎️", cold_chain: "❄️" }
const PRICING_STATUS = ["active", "draft", "expired", "pending_review", "rejected", "archived"] as const
const COMPETITOR_NAMES = ["BlueDart", "Delhivery", "DTDC", "XpressBees", "Ecom Express", "Shadowfax", "Spoton", "DHL"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"] as const
const ZONES = ["North", "South", "East", "West", "Central"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#8b5cf6", sec: "#f59e0b", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#8b5cf6", "#f59e0b", "#059669", "#dc2626", "#06b6d4", "#ec4899", "#14b8a6", "#3b82f6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function ServiceBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { ftl: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", ptl: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", express: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", air: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", surface: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", rail: "bg-red-100 text-red-700 dark:bg-red-900/30", last_mile: "bg-pink-100 text-pink-700 dark:bg-pink-900/30", cold_chain: "bg-sky-100 text-sky-700 dark:bg-sky-900/30" }
  return <span className={"dpe-service-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{SERVICE_EMOJI[type] || "•"} {type.replace(/_/g, " ")}</span>
}

function PricingStatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { active: "dpe-active bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", draft: "bg-gray-100 text-gray-600", expired: "bg-red-100 text-red-700", pending_review: "bg-amber-100 text-amber-700", rejected: "bg-red-100 text-red-700", archived: "bg-gray-200 text-gray-500" }
  const icons: Record<string, React.ReactNode> = { active: <CheckCircle2 className="w-3 h-3" />, draft: <Clock className="w-3 h-3" />, expired: <AlertTriangle className="w-3 h-3" />, pending_review: <Star className="w-3 h-3" />, rejected: <ShieldCheck className="w-3 h-3" />, archived: <Package className="w-3 h-3" /> }
  return <span className={"dpe-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{icons[status]} {status.replace(/_/g, " ")}</span>
}

function CompetitorBadge({ name }: { name: string }) {
  return <span className="dpe-competitor-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/20">{name}</span>
}

function MarginBar({ margin }: { margin: number }) {
  const col = margin >= 25 ? TH.ok : margin >= 10 ? TH.warn : TH.err
  return <div className="dpe-margin-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: Math.min(margin * 2, 100) + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{margin}%</span></div>
}

function DemandIndicator({ level }: { level: number }) {
  const col = level >= 80 ? TH.err : level >= 50 ? TH.warn : TH.ok
  const label = level >= 80 ? "High" : level >= 50 ? "Medium" : "Low"
  return <span className="dpe-demand inline-flex items-center gap-0.5 text-[10px] font-bold" style={{ color: col }}>{label} ({level}%)</span>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0; const col = pos ? TH.ok : TH.err
  return <span className="dpe-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function ZoneBadge({ zone }: { zone: string }) { return <span className="dpe-zone-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/20">{zone}</span> }

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) { return <Card className="dpe-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card> }

function ValueTile({ label, value }: { label: string; value: string | number }) { return <div className="dpe-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div> }

function HealthRing({ value, label }: { value: number; label: string }) { const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err; const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ; return <div className="dpe-health-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div> }

function genPricingRules() {
  return Array.from({ length: 80 }, (_, i) => ({
    id: "PR-" + String(i + 1).padStart(5, "0"),
    service: pick(SERVICE_TYPES, i * 3 + 1),
    origin: pick(CITIES, i * 3 + 2),
    dest: pick(CITIES, i * 3 + 3),
    baseRate: ri(5, 80, i + 7) + (ri(0, 99, i + 11) / 100),
    surgeFactor: ri(80, 200, i + 13) / 100,
    minCharge: ri(200, 5000, i + 17),
    margin: ri(-5, 35, i + 23),
    demand: ri(10, 95, i + 29),
    competitor: pick(COMPETITOR_NAMES, i + 37),
    compRate: ri(5, 80, i + 45) + (ri(0, 99, i + 49) / 100),
    volume: ri(50, 2000, i + 53),
    zone: pick(ZONES, i + 59),
    status: pick(PRICING_STATUS, i + 67),
    effectiveDate: "2026-07-" + String(ri(1, 30, i + 73)).padStart(2, "0")
  }))
}

function genCompetitorData() {
  return Array.from({ length: 40 }, (_, i) => ({
    id: "CD-" + String(i + 1).padStart(4, "0"),
    competitor: pick(COMPETITOR_NAMES, i + 7),
    service: pick(SERVICE_TYPES, i + 11),
    lane: pick(CITIES, i + 17) + " -> " + pick(CITIES, i + 23),
    theirRate: ri(5, 80, i + 29) + (ri(0, 99, i + 33) / 100),
    ourRate: ri(5, 80, i + 37) + (ri(0, 99, i + 41) / 100),
    diff: ri(-20, 20, i + 47),
    marketShare: ri(5, 45, i + 53),
    volume: ri(100, 5000, i + 59),
    trend: pick(["up", "down", "stable"], i + 67)
  }))
}

function genCharts() {
  const revenue = MO.map((m, i) => ({ month: m, revenue: ri(500000, 2000000, i + 101), margin: ri(8, 30, i + 151), volume: ri(1000, 8000, i + 201) }))
  const svcDist = SERVICE_TYPES.map((s, i) => ({ service: s.replace(/_/g, " "), rules: ri(5, 20, i + 301), avgMargin: ri(5, 25, i + 351) }))
  const surgeLine = MO.map((m, i) => ({ month: m, surge: ri(80, 200, i + 401) / 100, demand: ri(30, 95, i + 451) }))
  return { revenue, svcDist, surgeLine }
}

export default function DynamicPricingEngineView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [compActiveFilters, setCompActiveFilters] = useState<Record<string, string[]>>({})
  const rules = useMemo(() => genPricingRules(), [])
  const compData = useMemo(() => genCompetitorData(), [])
  const charts = useMemo(() => genCharts(), [])
  const filterRules = useMemo(() => { let res = rules; if (search) { const q = search.toLowerCase(); res = res.filter(r => Object.values(r).some(val => typeof val === "string" && val.toLowerCase().includes(q))) } for (const [k, vals] of Object.entries(activeFilters)) { if (vals.length > 0) res = res.filter(r => vals.includes(String(r[k as keyof typeof r]))) } return res }, [rules, search, activeFilters])
  const filterComp = useMemo(() => { let res = compData; for (const [k, vals] of Object.entries(compActiveFilters)) { if (vals.length > 0) res = res.filter(c => vals.includes(String(c[k as keyof typeof c]))) } return res }, [compData, compActiveFilters])
  const sortedRules = useMemo(() => { if (!sortCol) return filterRules; return [...filterRules].sort((a: any, b: any) => { const av = a[sortCol], bv = b[sortCol]; const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv; return sortDir === "asc" ? cmp : -cmp }) }, [filterRules, sortCol, sortDir])
  const toggleSort = (col: string) => { if (sortCol === col) { setSortDir(d => d === "asc" ? "desc" : "asc") } else { setSortCol(col); setSortDir("asc") } }
  const toggleFilter = (group: string, value: string) => { setActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } }) }
  const clearAllFilters = () => setActiveFilters({})
  const toggleCompFilter = (group: string, value: string) => { setCompActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } }) }
  const clearCompFilters = () => setCompActiveFilters({})
  const handleRefresh = () => { setSearch(""); setActiveFilters({}); setSortCol(null) }

  const ruleFilterGroups = useMemo(() => { const sc: Record<string, number> = {}; const stc: Record<string, number> = {}; const zc: Record<string, number> = {}; const oc: Record<string, number> = {}; rules.forEach(r => { sc[r.service] = (sc[r.service] || 0) + 1; stc[r.status] = (stc[r.status] || 0) + 1; zc[r.zone] = (zc[r.zone] || 0) + 1; oc[r.origin] = (oc[r.origin] || 0) + 1 }); return [{ key: "service", label: "Service", options: Object.entries(sc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "status", label: "Status", options: Object.entries(stc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "zone", label: "Zone", options: Object.entries(zc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "origin", label: "Origin", options: Object.entries(oc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }] }, [rules])

  const compFilterGroups = useMemo(() => { const cc: Record<string, number> = {}; compData.forEach(c => { cc[c.competitor] = (cc[c.competitor] || 0) + 1 }); return [{ key: "competitor", label: "Competitor", options: Object.entries(cc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }] }, [compData])

  return <div className="space-y-4 p-4">
    <PageHeader title="Dynamic Pricing Engine" description="AI-powered pricing optimization, competitor intelligence and margin management"/>

    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="grid grid-cols-5 w-full dpe-tabs">
        <TabsTrigger value="dashboard"><BarChart3 className="w-3 h-3 mr-1"/>Dashboard</TabsTrigger>
        <TabsTrigger value="rules"><DollarSign className="w-3 h-3 mr-1"/>Pricing Rules</TabsTrigger>
        <TabsTrigger value="competitors"><Target className="w-3 h-3 mr-1"/>Competitors</TabsTrigger>
        <TabsTrigger value="surge"><Zap className="w-3 h-3 mr-1"/>Surge Analysis</TabsTrigger>
        <TabsTrigger value="insights"><TrendingUp className="w-3 h-3 mr-1"/>Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <KpiTile label="Active Rules" value={String(rules.filter((r: any) => r.status === "active").length)} icon={<DollarSign className="w-4 h-4" style={{ color: TH.pri }}/>} trend={15.3} color={TH.pri}/>
          <KpiTile label="Avg Margin" value="18.2%" icon={<Percent className="w-4 h-4" style={{ color: TH.ok }}/>} trend={3.8} color={TH.ok}/>
          <KpiTile label="Surge Events" value="24" icon={<Zap className="w-4 h-4" style={{ color: TH.err }}/>} trend={-5.1} color={TH.err}/>
          <KpiTile label="Competitors" value="8" icon={<Target className="w-4 h-4" style={{ color: TH.sec }}/>} trend={0} color={TH.sec}/>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <HealthRing value={88} label="Accuracy"/>
          <HealthRing value={72} label="Win Rate"/>
          <HealthRing value={95} label="Auto Apply"/>
          <HealthRing value={81} label="ROI"/>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card className="dpe-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Revenue & Margin Trend</CardTitle></CardHeader><CardContent className="p-2"><AreaChart data={charts.revenue} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Area type="monotone" dataKey="revenue" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/></AreaChart></CardContent></Card>
          <Card className="dpe-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Service Type Rules</CardTitle></CardHeader><CardContent className="p-2"><BarChart data={charts.svcDist} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="service" fontSize={8}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Bar dataKey="rules" fill={TH.sec}/></BarChart></CardContent></Card>
          <Card className="dpe-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Surge & Demand</CardTitle></CardHeader><CardContent className="p-2"><LineChart data={charts.surgeLine} height={180}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Line type="monotone" dataKey="surge" stroke={TH.err}/><Line type="monotone" dataKey="demand" stroke={TH.ok}/></LineChart></CardContent></Card>
        </div>
      </TabsContent>

      <TabsContent value="rules" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Pricing Rules" }]}/>
        <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={ruleFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={rules.length} filteredCount={filterRules.length} onRefresh={handleRefresh} placeholder="Search pricing rules..."/>
        <Card className="dpe-table-card"><CardContent className="p-2"><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="border-b dpe-table-header"><th className="p-1.5 text-left cursor-pointer hover:bg-gray-100" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="w-3 h-3 inline"/></th><th className="p-1.5 text-left">Service</th><th className="p-1.5 text-left">Lane</th><th className="p-1.5 text-left">Base Rate</th><th className="p-1.5 text-left">Surge</th><th className="p-1.5 text-left">Margin</th><th className="p-1.5 text-left">Demand</th><th className="p-1.5 text-left">Competitor</th><th className="p-1.5 text-left">Status</th></tr></thead><tbody>
          {sortedRules.map((r: any) => <tr key={r.id} className="border-b hover:bg-violet-50/50 dark:hover:bg-violet-900/10 dpe-table-row"><td className="p-1.5 font-mono">{r.id}</td><td className="p-1.5"><ServiceBadge type={r.service}/></td><td className="p-1.5">{r.origin} - {r.dest}</td><td className="p-1.5 font-semibold">₹{r.baseRate.toFixed(2)}</td><td className="p-1.5 text-amber-600 font-semibold">{r.surgeFactor.toFixed(2)}x</td><td className="p-1.5"><MarginBar margin={r.margin}/></td><td className="p-1.5"><DemandIndicator level={r.demand}/></td><td className="p-1.5"><CompetitorBadge name={r.competitor}/></td><td className="p-1.5"><PricingStatusBadge status={r.status}/></td></tr>)}
          </tbody></table></div></CardContent></Card>
      </TabsContent>

      <TabsContent value="competitors" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Competitors" }]}/>
        <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={compActiveFilters} filterGroups={compFilterGroups} onToggleFilter={toggleCompFilter} onClearAllFilters={clearCompFilters} totalItems={compData.length} filteredCount={filterComp.length} onRefresh={handleRefresh} placeholder="Search competitors..."/>
        <Card className="dpe-table-card"><CardContent className="p-2"><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="border-b dpe-table-header"><th className="p-1.5 text-left">ID</th><th className="p-1.5 text-left">Competitor</th><th className="p-1.5 text-left">Service</th><th className="p-1.5 text-left">Lane</th><th className="p-1.5 text-left">Their Rate</th><th className="p-1.5 text-left">Our Rate</th><th className="p-1.5 text-left">Diff</th><th className="p-1.5 text-left">Share</th><th className="p-1.5 text-left">Trend</th></tr></thead><tbody>
          {filterComp.map((c: any) => <tr key={c.id} className="border-b hover:bg-violet-50/50 dark:hover:bg-violet-900/10 dpe-table-row"><td className="p-1.5 font-mono">{c.id}</td><td className="p-1.5"><CompetitorBadge name={c.competitor}/></td><td className="p-1.5"><ServiceBadge type={c.service}/></td><td className="p-1.5">{c.lane}</td><td className="p-1.5 font-semibold">₹{c.theirRate.toFixed(2)}</td><td className="p-1.5 font-semibold">₹{c.ourRate.toFixed(2)}</td><td className="p-1.5"><span className={"font-bold " + (c.diff > 0 ? "text-emerald-600" : c.diff < 0 ? "text-red-600" : "text-gray-500")}>{c.diff > 0 ? "+" : ""}{c.diff}%</span></td><td className="p-1.5"><div className="dpe-share-bar w-12 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full" style={{ width: c.marketShare + "%", backgroundColor: TH.pri }}/></div><span className="text-[10px] ml-1">{c.marketShare}%</span></td><td className="p-1.5">{c.trend === "up" ? <TrendingUp className="w-3 h-3 text-emerald-500"/> : c.trend === "down" ? <TrendingDown className="w-3 h-3 text-red-500"/> : <ArrowRightLeft className="w-3 h-3 text-gray-400"/>}</td></tr>)}
          </tbody></table></div></CardContent></Card>
      </TabsContent>

      <TabsContent value="surge" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Surge Analysis" }]}/>
        <div className="grid grid-cols-4 gap-3">
          <ValueTile label="Active Surges" value="12"/>
          <ValueTile label="Avg Surge Factor" value="1.45x"/>
          <ValueTile label="Peak Surge Today" value="2.1x"/>
          <ValueTile label="Revenue Impact" value="+₹8.5L"/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="dpe-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Surge Factor Trend</CardTitle></CardHeader><CardContent className="p-2"><AreaChart data={charts.surgeLine} height={200}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={10}/><YAxis fontSize={10}/><Tooltip contentStyle={{ fontSize: 11 }}/><Area type="monotone" dataKey="surge" stroke={TH.err} fill={TH.err} fillOpacity={0.15}/></AreaChart></CardContent></Card>
          <Card className="dpe-chart-card"><CardHeader className="p-2 pb-0"><CardTitle className="text-xs">Service Type Distribution</CardTitle></CardHeader><CardContent className="p-2"><PieChart height={200}><Pie data={SERVICE_TYPES.map((s, i) => ({ name: s.replace(/_/g, " "), value: ri(5, 30, i + 701) }))} cx="50%" cy="50%" outerRadius={60} dataKey="value" label><Cell fill={PC[0]}/><Cell fill={PC[1]}/><Cell fill={PC[2]}/><Cell fill={PC[3]}/><Cell fill={PC[4]}/><Cell fill={PC[5]}/><Cell fill={PC[6]}/><Cell fill={PC[7]}/></Pie><Tooltip contentStyle={{ fontSize: 11 }}/></PieChart></CardContent></Card>
        </div>
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <ModuleBreadcrumb items={[{ label: "Dashboard" }, { label: "Insights" }]}/>
        <div className="grid grid-cols-2 gap-3">
          <Card className="dpe-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><DollarSign className="w-3 h-3 text-violet-500"/>Margin Improvement</div><div className="text-[10px] text-muted-foreground">Express and air services show highest margin potential. Consider dynamic base rate adjustment for Delhi-Bangalore and Mumbai-Chennai corridors where demand exceeds supply by 30%.</div></Card>
          <Card className="dpe-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Target className="w-3 h-3 text-amber-500"/>Competitor Gap Analysis</div><div className="text-[10px] text-muted-foreground">Delhivery undercuts on PTL by 12%. XpressBees has 18% higher express rates creating opportunity. Shadowfax gaining market share in last-mile with 8% lower pricing.</div></Card>
          <Card className="dpe-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><Zap className="w-3 h-3 text-red-500"/>Surge Patterns</div><div className="text-[10px] text-muted-foreground">Festival seasons show 2x surge. E-commerce sale events like Big Billion Days and Great Indian Festival trigger 2.5x. Pre-plan capacity allocation and communicate surge pricing 72h ahead.</div></Card>
          <Card className="dpe-insight-card p-4"><div className="text-xs font-semibold mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-500"/>Revenue Optimization</div><div className="text-[10px] text-muted-foreground">Implement zone-based pricing for North region where volumes are 25% higher. Cold chain margins can improve 8% with distance-weighted pricing. FTL corridor optimization yields 15% uplift.</div></Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
}