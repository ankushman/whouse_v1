"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Leaf, TreePine, Globe, TrendingUp, TrendingDown, BarChart3, AlertTriangle, CheckCircle2, Truck, Fuel, Zap, Recycle, Target, ArrowUpDown, Search, Eye, Award, ThermometerSun } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const MODES = ["truck", "rail", "sea", "air", "last_mile"] as const
const MODE_EMOJI: Record<string, string> = { truck: "\U0001f69a", rail: "\U0001f684", sea: "\u26f5", air: "\u2708", last_mile: "\U0001f3cd" }
const SOURCES = ["fuel_combustion", "electricity", "refrigeration", "packaging", "waste", "manufacturing", "logistics", "storage"] as const
const SOURCE_EMOJI: Record<string, string> = { fuel_combustion: "\u26fd", electricity: "\u26a1", refrigeration: "\u2744\ufe0f", packaging: "\U0001f4e6", waste: "\u267b\ufe0f", manufacturing: "\U0001f3ed", logistics: "\U0001f69a", storage: "\U0001f4e6" }
const OFFSET_TYPES = ["tree_planting", "renewable_energy", "carbon_credits", "ev_fleet", "route_optimization", "green_packaging", "waste_reduction", "supplier_green"] as const
const OFFSET_EMOJI: Record<string, string> = { tree_planting: "\U0001f333", renewable_energy: "\u2600\ufe0f", carbon_credits: "\U0001f4b0", ev_fleet: "\U0001f697", route_optimization: "\U0001f5fa", green_packaging: "\U0001f33f", waste_reduction: "\u267b\ufe0f", supplier_green: "\U0001f91d" }
const COMPLIANCE = ["compliant", "at_risk", "non_compliant", "pending", "exempt"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"] as const
const REGIONS = ["West", "North", "South", "East", "Central"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#059669", sec: "#06b6d4", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#059669", "#06b6d4", "#d97706", "#dc2626", "#8b5cf6", "#3b82f6", "#ec4899", "#14b8a6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function ModeBadge({ mode }: { mode: string }) {
  const cols: Record<string, string> = { truck: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", rail: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", sea: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", air: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", last_mile: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" }
  return <span className={"lct-mode-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[mode] || "bg-gray-100 text-gray-700")}>{MODE_EMOJI[mode] || "\u2022"} {mode.replace(/_/g, " ")}</span>
}

function SourceBadge({ source }: { source: string }) {
  return <span className="lct-source-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30">{SOURCE_EMOJI[source] || "\u2022"} {source.replace(/_/g, " ")}</span>
}

function ComplianceBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { compliant: "lct-compliant bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", at_risk: "lct-at-risk bg-amber-100 text-amber-700 dark:bg-amber-900/30", non_compliant: "lct-non-compliant bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]", pending: "lct-pending bg-gray-100 text-gray-500 dark:bg-gray-900/30", exempt: "lct-exempt bg-blue-100 text-blue-700 dark:bg-blue-900/30" }
  const icons: Record<string, React.ReactNode> = { compliant: <CheckCircle2 className="w-3 h-3" />, at_risk: <AlertTriangle className="w-3 h-3" />, non_compliant: <AlertTriangle className="w-3 h-3" />, pending: <Globe className="w-3 h-3" />, exempt: <Zap className="w-3 h-3" /> }
  return <span className={"lct-compliance-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{icons[status]} {status.replace(/_/g, " ")}</span>
}

function OffsetBadge({ type }: { type: string }) {
  return <span className="lct-offset-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">{OFFSET_EMOJI[type] || "\u2022"} {type.replace(/_/g, " ")}</span>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0; const col = pos ? TH.ok : TH.err
  return <span className="lct-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) {
  return <span className="lct-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20">{city}</span>
}

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) {
  return <Card className="lct-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card>
}

function ValueTile({ label, value }: { label: string; value: string | number }) {
  return <div className="lct-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}

function GreenRing({ value, label }: { value: number; label: string }) {
  const col = value >= 80 ? TH.ok : value >= 50 ? TH.warn : TH.err
  const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ
  return <div className="lct-green-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div>
}

function EmissionBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  const col = pct <= 30 ? TH.ok : pct <= 70 ? TH.warn : TH.err
  return <div className="lct-emission-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: pct + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}t</span></div>
}

function ScoreBadge({ score }: { score: number }) {
  const col = score >= 90 ? TH.ok : score >= 70 ? TH.warn : TH.err
  return <div className="lct-score-badge flex items-center gap-1"><Leaf className="w-3 h-3" style={{ color: col }}/><span className="text-[10px] font-bold" style={{ color: col }}>{score}/100</span></div>
}

function genEmissions() {
  return Array.from({ length: 60 }, (_, i) => ({
    id: "EM-" + String(i + 1).padStart(4, "0"),
    mode: pick(MODES, i * 3 + 2),
    source: pick(SOURCES, i * 3 + 3),
    city: pick(CITIES, i * 3 + 4),
    region: pick(REGIONS, i * 3 + 5),
    tons: +(ri(1, 500, i + 7) / 10).toFixed(1),
cost: ri(1000, 50000, i + 11),
offset: +(ri(0, 30, i + 13) / 10).toFixed(1),
compliance: pick(COMPLIANCE, i + 17),
scope: pick(["Scope 1", "Scope 2", "Scope 3"], i + 19),
target: ri(50, 200, i + 23),
reduction: ri(-15, 25, i + 29),
period: pick(["Q1 2026", "Q2 2026", "Q3 2026", "FY 2025-26"], i + 31),
verified: pick([true, false, false], i + 37),
timestamp: "2026-07-" + String(ri(1, 30, i + 41)).padStart(2, "0")
  }))
}

function genOffsets() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: "OFF-" + String(i + 1).padStart(4, "0"),
    type: pick(OFFSET_TYPES, i * 3 + 1),
    city: pick(CITIES, i * 3 + 2),
    tonsReduced: +(ri(5, 200, i + 7) / 10).toFixed(1),
investment: ri(10000, 500000, i + 11),
roi: ri(10, 300, i + 13),
trees: ri(50, 5000, i + 17),
renewableMwh: ri(100, 10000, i + 19),
status: pick(["active", "planned", "completed", "piloting"], i + 23),
certification: pick(["Verified", "Pending", "None"], i + 29),
started: "2026-0" + String(ri(1, 6, i + 31))
  }))
}

function genCompliance() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: "CMP-" + String(i + 1).padStart(4, "0"),
    regulation: pick(["EU CBAM", "India BEE", "ISO 14001", "GHG Protocol", "Paris Agreement", "CDP Reporting", "SBTi", "RE100", "LEED", "BREEAM"], i + 3),
    city: pick(CITIES, i + 7),
    region: pick(REGIONS, i + 11),
    status: pick(COMPLIANCE, i + 13),
    score: ri(40, 100, i + 17),
deadline: "2026-" + String(ri(7, 12, i + 19)).padStart(2, "0") + "-" + String(ri(1, 28, i + 23)).padStart(2, "0"),
penalty: ri(0, 100000, i + 29),
progress: ri(20, 100, i + 31),
auditor: pick(["Bureau Veritas", "SGS", "TUV", "DNV", "Intertek", "EY"], i + 37)
  }))
}

function genCharts() {
  const monthly = MO.map((m, i) => ({ month: m, emissions: ri(200, 1500, i + 101), offset: ri(50, 500, i + 151), net: ri(150, 1200, i + 201), target: ri(100, 800, i + 251) }))
  const modePie = MODES.map((m, i) => ({ name: m, value: ri(100, 1000, i + 301) }))
  const sourcePie = SOURCES.map((s, i) => ({ name: s.replace(/_/g, " "), value: ri(50, 800, i + 351) }))
  const reductionLine = MO.map((m, i) => ({ month: m, actual: ri(-20, 30, i + 401), planned: ri(5, 15, i + 451), intensity: +(ri(80, 200, i + 501) / 10).toFixed(1) }))
  return { monthly, modePie, sourcePie, reductionLine }
}

export default function LogisticsCarbonTrackerView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null)
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const emissions = useMemo(() => genEmissions(), [])
  const offsets = useMemo(() => genOffsets(), [])
  const compliance = useMemo(() => genCompliance(), [])
  const charts = useMemo(() => genCharts(), [])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const sortIcon = (f: string) => sortField === f ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""

  const filterEmissions = useMemo(() => {
    if (!search) return emissions
    const lq = search.toLowerCase()
    return emissions.filter(e => Object.values(e).some(v => typeof v === "string" && v.toLowerCase().includes(lq)))
  }, [emissions, search])
  const sortedEmissions = useMemo(() => [...filterEmissions].sort((a, b) => { const va = a[sortField as keyof typeof a], vb = b[sortField as keyof typeof b]; if (va == null || vb == null) return 0; return sortDir === "asc" ? String(va).localeCompare(String(vb), undefined, { numeric: true }) : -String(va).localeCompare(String(vb), undefined, { numeric: true }) }), [filterEmissions, sortField, sortDir])

  const filterOffsets = useMemo(() => {
    if (!search) return offsets
    const lq = search.toLowerCase()
    return offsets.filter(o => Object.values(o).some(v => typeof v === "string" && v.toLowerCase().includes(lq)))
  }, [offsets, search])

  const totalEmissions = +(emissions.reduce((s, e) => s + e.tons, 0)).toFixed(1)
  const totalOffset = +(offsets.reduce((s, o) => s + o.tonsReduced, 0)).toFixed(1)
  const netEmissions = +(totalEmissions - totalOffset).toFixed(1)
  const complianceRate = Math.round(compliance.filter(c => c.status === "compliant").length / compliance.length * 100)

  const handleRefresh = () => { setSearch(""); setSortField("id"); setSortDir("asc"); setActiveFilters({}) }
  const toggleFilter = (group: string, value: string) => {
    setActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } })
  }
  const clearAllFilters = () => setActiveFilters({})
  const totalActiveFilters = Object.values(activeFilters).reduce((s, v) => s + v.length, 0)

  const emissionFilterGroups = useMemo(() => {
    const mc: Record<string, number> = {}; const sc: Record<string, number> = {}; const cc: Record<string, number> = {}
    emissions.forEach(e => { mc[e.mode] = (mc[e.mode] || 0) + 1; sc[e.scope] = (sc[e.scope] || 0) + 1; cc[e.city] = (cc[e.city] || 0) + 1 })
    return [
      { key: "mode", label: "Transport Mode", options: Object.entries(mc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) },
      { key: "scope", label: "Scope", options: Object.entries(sc).map(([value, count]) => ({ value, count })) },
      { key: "city", label: "City", options: Object.entries(cc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count).slice(0, 8) }
    ]
  }, [emissions])

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile label="Total Emissions" value={totalEmissions + "t"} icon={<ThermometerSun className="w-4 h-4 text-red-500"/>} trend={-8.2} color={TH.err}/>
        <KpiTile label="Total Offset" value={totalOffset + "t"} icon={<TreePine className="w-4 h-4 text-emerald-500"/>} trend={15.3} color={TH.ok}/>
        <KpiTile label="Net Emissions" value={netEmissions + "t"} icon={<Leaf className="w-4 h-4 text-green-500"/>} trend={-12.5} color={TH.pri}/>
        <KpiTile label="Compliance" value={complianceRate + "%"} icon={<Award className="w-4 h-4 text-amber-500"/>} trend={3.1} color={TH.warn}/>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GreenRing value={complianceRate} label="Compliance"/>
        <GreenRing value={Math.round(totalOffset / totalEmissions * 100)} label="Offset Rate"/>
        <GreenRing value={75} label="Target Progress"/>
        <GreenRing value={Math.round(emissions.filter(e => e.verified).length / emissions.length * 100)} label="Verified"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="lct-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Monthly Emissions vs Offset vs Net</CardTitle></CardHeader><CardContent><AreaChart data={charts.monthly} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Area type="monotone" dataKey="emissions" stroke={TH.err} fill={TH.err} fillOpacity={0.15}/><Area type="monotone" dataKey="offset" stroke={TH.ok} fill={TH.ok} fillOpacity={0.15}/><Line type="monotone" dataKey="target" stroke={TH.warn} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }}/></AreaChart></CardContent></Card>
        <Card className="lct-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Transport Mode Emissions</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={charts.modePie} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{MODES.map((_, i) => <Cell key={i} fill={PC[i % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
        <Card className="lct-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Emission Source Breakdown</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={charts.sourcePie} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{SOURCES.map((_, i) => <Cell key={i} fill={PC[(i + 2) % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
        <Card className="lct-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Reduction Progress</CardTitle></CardHeader><CardContent><LineChart data={charts.reductionLine} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Line type="monotone" dataKey="actual" stroke={TH.ok} strokeWidth={2} dot={{ r: 3 }}/><Line type="monotone" dataKey="planned" stroke={TH.warn} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }}/><Line type="monotone" dataKey="intensity" stroke={TH.sec} strokeWidth={2} dot={{ r: 3 }}/></LineChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <ModuleBreadcrumb items={[{ label: "Sustainability" }, { label: "Carbon Tracker" }, { label: "Emissions Log" }]}/>
      <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={emissionFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={emissions.length} filteredCount={sortedEmissions.length} onRefresh={handleRefresh} placeholder="Search by mode, city, scope..." />
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]">
        <table className="lct-table w-full text-xs"><thead className="bg-emerald-50 dark:bg-emerald-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Mode</th><th className="p-2 text-left">Source</th><th className="p-2 text-left">City</th><th className="p-2 text-right">Tons CO2</th><th className="p-2 text-left">Offset</th><th className="p-2 text-left">Scope</th><th className="p-2 text-left">Compliance</th><th className="p-2 text-right">Cost</th><th className="p-2 text-right">Reduction</th></tr></thead><tbody>{sortedEmissions.map(e => <tr key={e.id} className="lct-table-row border-t hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 cursor-pointer" onClick={() => setDetail(e as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{e.id}</td><td className="p-2"><ModeBadge mode={e.mode}/></td><td className="p-2"><SourceBadge source={e.source}/></td><td className="p-2"><CityBadge city={e.city}/></td><td className="p-2 text-right font-bold" style={{ color: e.tons > 30 ? TH.err : e.tons > 15 ? TH.warn : TH.ok }}>{e.tons}t</td><td className="p-2">{e.offset > 0 ? <span className="text-[10px] text-emerald-600 font-medium">-{e.offset}t</span> : <span className="text-[10px] text-gray-400">-</span>}</td><td className="p-2"><span className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-gray-50 dark:bg-gray-800">{e.scope}</span></td><td className="p-2"><ComplianceBadge status={e.compliance}/></td><td className="p-2 text-right">{"\u20b9"}{e.cost.toLocaleString()}</td><td className="p-2 text-right"><TrendIndicator value={e.reduction}/></td></tr>)}</tbody></table>
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>Showing {sortedEmissions.length} of {emissions.length} records</span>{totalActiveFilters > 0 && <span>{totalActiveFilters} filters active</span>}</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-4">
      <ModuleBreadcrumb items={[{ label: "Sustainability" }, { label: "Carbon Tracker" }, { label: "Offset Projects" }]}/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filterOffsets.map(o => (
          <Card key={o.id} className={"lct-offset-card glass-subtle hover:shadow-lg transition-shadow " + (o.status === "active" ? "border-emerald-300 dark:border-emerald-700" : o.status === "piloting" ? "border-blue-300 dark:border-blue-700" : "")}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between"><span className="font-semibold text-xs">{o.id}</span><OffsetBadge type={String(o.type)}/></div>
              <div className="grid grid-cols-2 gap-1.5"><ValueTile label="Reduced" value={o.tonsReduced + "t"}/><ValueTile label="Investment" value={"\u20b9" + o.investment.toLocaleString()}/></div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">ROI</span><span className="font-bold text-emerald-600">{o.roi}%</span></div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Trees</span><span className="font-medium">{o.trees.toLocaleString()}</span></div>
              <div className="flex items-center justify-between"><span className={"inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium " + (o.status === "active" ? "bg-emerald-100 text-emerald-700" : o.status === "completed" ? "bg-blue-100 text-blue-700" : o.status === "piloting" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600")}>{o.status}</span><span className={"lct-cert-badge inline-flex px-1.5 py-0.5 rounded text-[10px] " + (o.certification === "Verified" ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-500")}>{o.certification}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tab3 = (
    <div className="space-y-3">
      <ModuleBreadcrumb items={[{ label: "Sustainability" }, { label: "Carbon Tracker" }, { label: "Compliance" }]}/>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]">
        <table className="lct-table w-full text-xs"><thead className="bg-amber-50 dark:bg-amber-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Regulation</th><th className="p-2 text-left">City</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Score</th><th className="p-2 text-right">Penalty</th><th className="p-2 text-left">Progress</th><th className="p-2 text-left">Auditor</th><th className="p-2 text-left">Deadline</th></tr></thead><tbody>{compliance.map(c => <tr key={c.id} className="lct-table-row border-t hover:bg-amber-50/50 dark:hover:bg-amber-900/10 cursor-pointer" onClick={() => setDetail(c as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{c.id}</td><td className="p-2 font-medium">{c.regulation}</td><td className="p-2"><CityBadge city={c.city}/></td><td className="p-2"><ComplianceBadge status={c.status}/></td><td className="p-2"><ScoreBadge score={c.score}/></td><td className="p-2 text-right">{c.penalty > 0 ? "\u20b9" + c.penalty.toLocaleString() : "-"}</td><td className="p-2"><div className="flex items-center gap-1"><div className="w-12 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full" style={{ width: c.progress + "%", backgroundColor: c.progress >= 80 ? TH.ok : c.progress >= 50 ? TH.warn : TH.err }}/></div><span className="text-[10px]">{c.progress}%</span></div></td><td className="p-2 text-[10px]">{c.auditor}</td><td className="p-2 text-[10px]">{c.deadline}</td></tr>)}</tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{compliance.length} regulations</div>
    </div>
  )

  const tab4 = (
    <div className="space-y-4">
      <ModuleBreadcrumb items={[{ label: "Sustainability" }, { label: "Carbon Tracker" }, { label: "Insights" }]}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="lct-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-emerald-600">{offsets.filter(o => o.status === "active").length}</div><div className="text-[10px] text-muted-foreground mt-1">Active Offset Projects</div></CardContent></Card>
        <Card className="lct-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-green-600">{offsets.reduce((s, o) => s + o.trees, 0).toLocaleString()}</div><div className="text-[10px] text-muted-foreground mt-1">Total Trees Planted</div></CardContent></Card>
        <Card className="lct-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-cyan-600">{offsets.reduce((s, o) => s + o.renewableMwh, 0).toLocaleString()} MWh</div><div className="text-[10px] text-muted-foreground mt-1">Renewable Energy</div></CardContent></Card>
        <Card className="lct-insight-card glass-subtle"><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-red-600">{compliance.filter(c => c.status === "non_compliant").length}</div><div className="text-[10px] text-muted-foreground mt-1">Non-Compliant</div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="lct-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Offset Type Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={OFFSET_TYPES.map(t => ({ name: t.replace(/_/g, " "), value: offsets.filter(o => o.type === t).length }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{OFFSET_TYPES.map((_, i) => <Cell key={i} fill={PC[(i + 4) % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
        <Card className="lct-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Compliance Status</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={COMPLIANCE.map(s => ({ name: s.replace(/_/g, " "), value: compliance.filter(c => c.status === s).length }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{COMPLIANCE.map((_, i) => <Cell key={i} fill={PC[i % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
      </div>
    </div>
  )

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-3.5 h-3.5" />, content: tab0 },
    { key: "emissions", label: "Emissions", icon: <ThermometerSun className="w-3.5 h-3.5" />, content: tab1 },
    { key: "offsets", label: "Offsets", icon: <TreePine className="w-3.5 h-3.5" />, content: tab2 },
    { key: "compliance", label: "Compliance", icon: <Award className="w-3.5 h-3.5" />, content: tab3 },
    { key: "insights", label: "Insights", icon: <Eye className="w-3.5 h-3.5" />, content: tab4 }
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Logistics Carbon Tracker" description="End-to-end carbon footprint monitoring with emission tracking, offset management, regulatory compliance, and sustainability insights"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><Leaf className="w-3 h-3 text-emerald-600"/><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{totalEmissions}t Total CO2</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30"><TreePine className="w-3 h-3 text-green-600"/><span className="text-[10px] font-semibold text-green-700 dark:text-green-300">{totalOffset}t Offset</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><Award className="w-3 h-3 text-amber-600"/><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">{complianceRate}% Compliant</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30"><Globe className="w-3 h-3 text-cyan-600"/><span className="text-[10px] font-semibold text-cyan-700 dark:text-cyan-300">{netEmissions}t Net</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Record Detail</SheetTitle></SheetHeader>
          {detail && <div className="mt-4 space-y-3">
            <div className="lct-detail-header rounded-lg p-4 bg-gradient-to-br from-emerald-500 to-cyan-600 text-white"><div className="text-lg font-bold">{String(detail.id)}</div><div className="text-xs opacity-80 mt-1">{String(detail.regulation || detail.mode || detail.type || "Record")}</div></div>
            {Object.entries(detail).filter(([k]) => k !== "id").map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b"><span className="text-[10px] text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><span className="text-xs font-medium">{typeof v === "number" ? v.toLocaleString() : String(v)}</span></div>)}
          </div>}
        </SheetContent>
      </Sheet>
    </div>
  )
}