"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BrainCircuit, Sparkles, MessageSquare, BarChart3, TrendingUp, TrendingDown, Lightbulb, Target, Zap, CheckCircle2, Clock, AlertTriangle, Search, Eye, FileText, ArrowRight, Star, ThumbsUp, ThumbsDown, Bot } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const AI_MODULES = ["demand_forecast", "route_optimizer", "inventory_agent", "risk_analyzer", "cost_predictor", "supplier_eval", "shipment_tracker", "warehouse_planner"] as const
const AI_EMOJI: Record<string, string> = { demand_forecast: "\U0001f4ca", route_optimizer: "\U0001f5fa", inventory_agent: "\U0001f4e6", risk_analyzer: "\u26a0\ufe0f", cost_predictor: "\U0001f4b0", supplier_eval: "\U0001f91d", shipment_tracker: "\U0001f4e8", warehouse_planner: "\U0001f3ed" }
const SUGGESTION_TYPES = ["cost_saving", "efficiency", "risk_mitigation", "automation", "capacity", "quality", "sustainability", "customer_exp"] as const
const SUGG_EMOJI: Record<string, string> = { cost_saving: "\U0001f4b0", efficiency: "\u26a1", risk_mitigation: "\U0001f6e1", automation: "\U0001f916", capacity: "\U0001f4e6", quality: "\u2b50", sustainability: "\U0001f333", customer_exp: "\u2764\ufe0f" }
const INSIGHT_STATUS = ["new", "reviewed", "implemented", "dismissed", "expired"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#8b5cf6", sec: "#f59e0b", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#8b5cf6", "#f59e0b", "#059669", "#dc2626", "#3b82f6", "#06b6d4", "#ec4899", "#14b8a6"]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }

function AiModuleBadge({ module }: { module: string }) {
  const cols: Record<string, string> = { demand_forecast: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", route_optimizer: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", inventory_agent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", risk_analyzer: "bg-red-100 text-red-700 dark:bg-red-900/30", cost_predictor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", supplier_eval: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", shipment_tracker: "bg-pink-100 text-pink-700 dark:bg-pink-900/30", warehouse_planner: "bg-orange-100 text-orange-700 dark:bg-orange-900/30" }
  return <span className={"aic-module-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[module] || "bg-gray-100 text-gray-700")}>{AI_EMOJI[module] || "\u2022"} {module.replace(/_/g, " ")}</span>
}

function SuggTypeBadge({ type }: { type: string }) { return <span className="aic-sugg-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">{SUGG_EMOJI[type] || "\u2022"} {type.replace(/_/g, " ")}</span> }

function InsightStatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { new: "aic-new bg-blue-100 text-blue-700 dark:bg-blue-900/30 shadow-[0_0_6px_rgba(59,130,246,0.3)]", reviewed: "aic-reviewed bg-amber-100 text-amber-700 dark:bg-amber-900/30", implemented: "aic-implemented bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 shadow-[0_0_6px_rgba(5,150,105,0.3)]", dismissed: "aic-dismissed bg-gray-100 text-gray-500 dark:bg-gray-900/30", expired: "aic-expired bg-gray-200 text-gray-400 dark:bg-gray-800" }
  return <span className={"aic-status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status}</span>
}

function ConfBar({ value }: { value: number }) { const col = value >= 80 ? TH.ok : value >= 50 ? TH.warn : TH.err; return <div className="aic-conf-bar flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div> }

function TrendIndicator({ value }: { value: number }) { const pos = value > 0; const col = pos ? TH.ok : TH.err; return <span className="aic-trend inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span> }

function CityBadge({ city }: { city: string }) { return <span className="aic-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/20">{city}</span> }

function KpiTile({ label, value, icon, trend, color }: { label: string; value: string; icon: React.ReactNode; trend: number; color: string }) { return <Card className="aic-kpi-tile glass-subtle hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: color }}><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card> }

function ValueTile({ label, value }: { label: string; value: string | number }) { return <div className="aic-value-tile text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><div className="text-sm font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div> }

function HealthRing({ value, label }: { value: number; label: string }) { const col = value >= 90 ? TH.ok : value >= 70 ? TH.warn : TH.err; const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ; return <div className="aic-health-ring flex flex-col items-center gap-1"><svg width={48} height={48} className="-rotate-90"><circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all"/></svg><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span><span className="text-[9px] text-muted-foreground">{label}</span></div> }

function SavingsTile({ amount, label }: { amount: number; label: string }) { return <div className="aic-savings-tile p-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"><div className="flex items-center gap-1 mb-1"><Lightbulb className="w-3 h-3 text-emerald-500"/><span className="text-[10px] font-medium">{label}</span></div><div className="text-xs font-bold text-emerald-600">{"\u20b9"}{amount.toLocaleString()}</div></div> }

function StarRating({ value }: { value: number }) { return <div className="aic-star-rating flex items-center gap-0.5">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={"w-3 h-3 " + (i < value ? "text-amber-400 fill-amber-400" : "text-gray-300")}/>)}</div> }

function genInsights() {
  return Array.from({ length: 60 }, (_, i) => ({
    id: "INS-" + String(i + 1).padStart(4, "0"),
    module: pick(AI_MODULES, i * 3 + 1),
    type: pick(SUGGESTION_TYPES, i * 3 + 2),
    city: pick(CITIES, i * 3 + 3),
    title: pick(["Reduce warehouse overflow by 25%", "Optimize last mile routes", "Switch to rail for Mumbai-Delhi", "Preorder inventory for Diwali", "Renegotiate supplier contract", "Add cold storage capacity", "Implement cross-docking at BLR", "Deploy EV fleet for Zone A", "Automate quality inspection", "Reduce picking errors", "Consolidate small shipments", "Dynamic pricing for excess stock"], i + 5),
    confidence: ri(55, 98, i + 7),
    impact: pick(["high", "medium", "low"], i + 11),
    savings: ri(10000, 500000, i + 13),
    status: pick(INSIGHT_STATUS, i + 17),
    aiModel: pick(["GPT-Logistics", "Transformer-T", "XGBoost-v5", "LSTM-v4", "Ensemble-Hybrid", "Prophet-X"], i + 19),
    processingTime: ri(50, 5000, i + 23),
    rating: ri(1, 5, i + 29),
    feedback: pick(["positive", "negative", "neutral"], i + 31),
    timestamp: "2026-07-" + String(ri(1, 30, i + 37)).padStart(2, "0") + " " + String(ri(0, 23, i + 41)).padStart(2, "0") + ":" + String(ri(0, 59, i + 43)).padStart(2, "0")
  }))
}

function genModels() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: "AI-" + String(i + 1).padStart(3, "0"),
    name: pick(["GPT-Logistics", "Transformer-T", "XGBoost-v5", "LSTM-v4", "Ensemble-Hybrid", "Prophet-X", "DeepAR-Net", "NBEATS-V2", "Temporal-Fusion", "CNN-LSTM", "WaveNet-Small", "LightGBM-Fast"], i + 1),
    category: pick(AI_MODULES, i + 3),
    accuracy: ri(70, 98, i + 7),
    latency: ri(20, 500, i + 11),
    requests: ri(100, 5000, i + 13),
    savings: ri(5000, 200000, i + 17),
    lastTrained: "2026-07-" + String(ri(1, 30, i + 19)).padStart(2, "0"),
    status: pick(["active", "training", "stale", "retired"], i + 23),
    version: "v" + ri(1, 5, i + 29) + "." + ri(0, 9, i + 31),
    uptime: ri(95, 100, i + 37)
  }))
}

function genCharts() {
  const daily = MO.map((m, i) => ({ month: m, suggestions: ri(20, 150, i + 101), implemented: ri(10, 100, i + 151), savings: ri(100000, 2000000, i + 201), accuracy: ri(75, 98, i + 251) }))
  const modDist = AI_MODULES.map((m, i) => ({ module: m.replace(/_/g, " "), count: ri(5, 40, i + 301), savings: ri(50000, 500000, i + 351) }))
  const typePie = SUGGESTION_TYPES.map((t, i) => ({ type: t.replace(/_/g, " "), value: ri(3, 25, i + 401) }))
  return { daily, modDist, typePie }
}

export default function LogisticsAiCopilotView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null)
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const insights = useMemo(() => genInsights(), [])
  const models = useMemo(() => genModels(), [])
  const charts = useMemo(() => genCharts(), [])
  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const sortIcon = (f: string) => sortField === f ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""
  const filterInsights = useMemo(() => { if (!search) return insights; const lq = search.toLowerCase(); return insights.filter(ins => Object.values(ins).some(v => typeof v === "string" && v.toLowerCase().includes(lq))) }, [insights, search])
  const sortedInsights = useMemo(() => [...filterInsights].sort((a, b) => { const va = a[sortField as keyof typeof a], vb = b[sortField as keyof typeof b]; if (va == null || vb == null) return 0; return sortDir === "asc" ? String(va).localeCompare(String(vb), undefined, { numeric: true }) : -String(va).localeCompare(String(vb), undefined, { numeric: true }) }), [filterInsights, sortField, sortDir])
  const totalSavings = insights.reduce((s, i) => s + i.savings, 0)
  const implemented = insights.filter(i => i.status === "implemented").length
  const avgConf = Math.round(insights.reduce((s, i) => s + i.confidence, 0) / insights.length)
  const activeModels = models.filter(m => m.status === "active").length
  const handleRefresh = () => { setSearch(""); setSortField("id"); setSortDir("asc"); setActiveFilters({}) }
  const toggleFilter = (group: string, value: string) => { setActiveFilters(prev => { const cur = prev[group] || []; const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]; if (next.length === 0) { const { [group]: _, ...rest } = prev; return rest } return { ...prev, [group]: next } }) }
  const clearAllFilters = () => setActiveFilters({})
  const totalActiveFilters = Object.values(activeFilters).reduce((s, v) => s + v.length, 0)
  const insightFilterGroups = useMemo(() => { const mc: Record<string, number> = {}; const tc: Record<string, number> = {}; const ic: Record<string, number> = {}; insights.forEach(ins => { mc[ins.module] = (mc[ins.module] || 0) + 1; tc[ins.type] = (tc[ins.type] || 0) + 1; ic[ins.impact] = (ic[ins.impact] || 0) + 1 }); return [{ key: "module", label: "AI Module", options: Object.entries(mc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "type", label: "Category", options: Object.entries(tc).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }, { key: "impact", label: "Impact", options: Object.entries(ic).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count) }] }, [insights])

  const tab0 = (<div className="space-y-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><KpiTile label="Total Savings" value={"\u20b9" + (totalSavings / 100000).toFixed(1) + "L"} icon={<Lightbulb className="w-4 h-4 text-amber-500"/>} trend={18.5} color={TH.sec}/><KpiTile label="AI Insights" value={String(insights.length)} icon={<Sparkles className="w-4 h-4 text-violet-500"/>} trend={12.3} color={TH.pri}/><KpiTile label="Implemented" value={String(implemented)} icon={<CheckCircle2 className="w-4 h-4 text-emerald-500"/>} trend={8.7} color={TH.ok}/><KpiTile label="Active Models" value={String(activeModels)} icon={<BrainCircuit className="w-4 h-4 text-blue-500"/>} trend={3.1} color="#3b82f6"/></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><HealthRing value={avgConf} label="AI Confidence"/><HealthRing value={Math.round(implemented / insights.length * 100)} label="Adoption"/><HealthRing value={95} label="Model Uptime"/><HealthRing value={88} label="Data Quality"/></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Card className="aic-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">AI Suggestions & Savings Trend</CardTitle></CardHeader><CardContent><AreaChart data={charts.daily} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Area type="monotone" dataKey="suggestions" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/><Area type="monotone" dataKey="implemented" stroke={TH.ok} fill={TH.ok} fillOpacity={0.15}/><Line type="monotone" dataKey="accuracy" stroke={TH.sec} strokeWidth={2} dot={{ r: 3 }}/></AreaChart></CardContent></Card><Card className="aic-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">AI Module Distribution</CardTitle></CardHeader><CardContent><BarChart data={charts.modDist} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="module" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="count" fill={TH.pri} radius={[2, 2, 0, 0]}/><Bar dataKey="savings" fill={TH.sec} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card><Card className="aic-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Insight Category</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={charts.typePie} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{SUGGESTION_TYPES.map((_, i) => <Cell key={i} fill={PC[i % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card><Card className="aic-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Model Performance</CardTitle></CardHeader><CardContent><BarChart data={models.map(m => ({ name: m.name, accuracy: m.accuracy, latency: m.latency }))} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="name" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="accuracy" fill={TH.ok} radius={[2, 2, 0, 0]}/><Bar dataKey="latency" fill={TH.warn} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card></div></div>)

  const tab1 = (<div className="space-y-3"><ModuleBreadcrumb items={[{ label: "AI" }, { label: "Copilot" }, { label: "Insights" }]}/><SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={insightFilterGroups} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={insights.length} filteredCount={sortedInsights.length} onRefresh={handleRefresh} placeholder="Search insights by title, module, type..." /><div className="rounded-lg border overflow-auto max-h-[calc(100vh-340px)]"><table className="aic-table w-full text-xs"><thead className="bg-violet-50 dark:bg-violet-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Title</th><th className="p-2 text-left">Module</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">Impact</th><th className="p-2 text-left">Confidence</th><th className="p-2 text-right">Savings</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Model</th></tr></thead><tbody>{sortedInsights.map(ins => <tr key={ins.id} className="aic-table-row border-t hover:bg-violet-50/50 dark:hover:bg-violet-900/10 cursor-pointer" onClick={() => setDetail(ins as unknown as Record<string, unknown>)}><td className="p-2 font-mono">{ins.id}</td><td className="p-2 font-medium max-w-[200px] truncate">{ins.title}</td><td className="p-2"><AiModuleBadge module={ins.module}/></td><td className="p-2"><SuggTypeBadge type={ins.type}/></td><td className="p-2"><span className={"inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium " + (ins.impact === "high" ? "bg-red-100 text-red-700" : ins.impact === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{ins.impact}</span></td><td className="p-2"><ConfBar value={ins.confidence}/></td><td className="p-2 text-right font-medium text-emerald-600">{"\u20b9"}{ins.savings.toLocaleString()}</td><td className="p-2"><InsightStatusBadge status={ins.status}/></td><td className="p-2 text-[10px]">{ins.aiModel}</td></tr>)}</tbody></table></div><div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>Showing {sortedInsights.length} of {insights.length} insights</span>{totalActiveFilters > 0 && <span>{totalActiveFilters} filters</span>}</div></div>)

  const tab2 = (<div className="space-y-4"><ModuleBreadcrumb items={[{ label: "AI" }, { label: "Copilot" }, { label: "Models" }]}/><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{models.map(m => <Card key={m.id} className={"aic-model-card glass-subtle hover:shadow-lg transition-shadow " + (m.status === "active" ? "border-emerald-300 dark:border-emerald-700" : m.status === "training" ? "border-blue-300 dark:border-blue-700" : m.status === "stale" ? "border-amber-300 dark:border-amber-700" : "")}><CardContent className="p-3 space-y-2"><div className="flex items-center justify-between"><span className="font-semibold text-xs">{m.name}</span><span className={"inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium " + (m.status === "active" ? "bg-emerald-100 text-emerald-700" : m.status === "training" ? "bg-blue-100 text-blue-700 animate-pulse" : m.status === "stale" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500")}>{m.status}</span></div><div className="grid grid-cols-2 gap-1.5"><ValueTile label="Accuracy" value={m.accuracy + "%"}/><ValueTile label="Latency" value={m.latency + "ms"}/></div><div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Requests</span><span className="font-medium">{m.requests.toLocaleString()}</span></div><div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Savings</span><span className="font-bold text-emerald-600">{"\u20b9"}{m.savings.toLocaleString()}</span></div><div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Uptime</span><ConfBar value={m.uptime}/></div><div className="flex items-center justify-between"><AiModuleBadge module={m.category}/><span className="text-[10px] text-muted-foreground">{m.version}</span></div></CardContent></Card>)}</div></div>)

  const tabs = [{ key: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-3.5 h-3.5" />, content: tab0 }, { key: "insights", label: "AI Insights", icon: <Sparkles className="w-3.5 h-3.5" />, content: tab1 }, { key: "models", label: "AI Models", icon: <BrainCircuit className="w-3.5 h-3.5" />, content: tab2 }]

  return (<div className="space-y-4 p-4"><PageHeader title="Logistics AI Copilot" description="AI-powered logistics intelligence platform with predictive insights, cost optimization, risk analysis, and automated decision support"/><div className="flex items-center gap-3 flex-wrap"><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30"><BrainCircuit className="w-3 h-3 text-violet-600"/><span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">{activeModels} AI Models Active</span></div><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><Lightbulb className="w-3 h-3 text-emerald-600"/><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{insights.length} Insights Generated</span></div><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><Sparkles className="w-3 h-3 text-amber-600"/><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">{avgConf}% Confidence</span></div><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><Bot className="w-3 h-3 text-blue-600"/><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">{"\u20b9"}{(totalSavings / 100000).toFixed(1)}L Savings</span></div></div><Tabs value={tab} onValueChange={setTab}><TabsList className="bg-gradient-to-r from-violet-500/10 to-amber-500/10 p-0.5 h-9">{tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-violet-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}</TabsList>{tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}</Tabs><Sheet open={!!detail} onOpenChange={() => setDetail(null)}><SheetContent className="w-[420px] overflow-y-auto"><SheetHeader><SheetTitle className="text-sm">Insight Detail</SheetTitle></SheetHeader>{detail && <div className="mt-4 space-y-3"><div className="aic-detail-header rounded-lg p-4 bg-gradient-to-br from-violet-500 to-amber-600 text-white"><div className="text-lg font-bold">{String(detail.id)}</div><div className="text-xs opacity-80 mt-1">{String(detail.title || "Insight")}</div></div>{Object.entries(detail).filter(([k]) => k !== "id").map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b"><span className="text-[10px] text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><span className="text-xs font-medium">{typeof v === "number" ? v.toLocaleString() : String(v)}</span></div>)}</div>}</SheetContent></Sheet></div>)
}