"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BrainCircuit, TrendingUp, TrendingDown, Activity, BarChart3, Target, Zap, Signal, Search, ArrowUpDown, ChevronRight, Sparkles, AlertTriangle, CheckCircle2, Clock, Lightbulb } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

// ── Constants ──
const SIGNAL_TYPES = ["social_media", "weather", "event", "economic", "competitor", "search_trend", "supplier", "seasonal"] as const
const SIGNAL_EMOJI: Record<string, string> = { social_media: "\U0001f4f1", weather: "\u2600\ufe0f", event: "\U0001f389", economic: "\U0001f4b0", competitor: "\U0001f3af", search_trend: "\U0001f50d", supplier: "\U0001f4e6", seasonal: "\U0001f33f" }
const CATEGORIES = ["electronics", "fashion", "grocery", "pharma", "auto", "furniture", "beauty", "sports"] as const
const CAT_EMOJI: Record<string, string> = { electronics: "\U0001f4bb", fashion: "\U0001f457", grocery: "\U0001f34e", pharma: "\U0001f48a", auto: "\U0001f697", furniture: "\U0001f6cb", beauty: "\U0001f9f5", sports: "\u26bd" }
const MODEL_STATUS = ["active", "training", "stale", "retired"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"] as const
const REGIONS = ["West", "North", "South", "East", "Central"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#3b82f6", sec: "#7c3aed", ok: "#059669", warn: "#d97706", err: "#dc2626" }
const PC = ["#3b82f6", "#7c3aed", "#059669", "#d97706", "#dc2626", "#06b6d4", "#8b5cf6", "#ec4899"]

// ── Utilities ──
function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }
function filterData<T extends Record<string, unknown>>(d: T[], q: string): T[] { if (!q) return d; const lq = q.toLowerCase(); return d.filter(r => Object.values(r).some(v => typeof v === "string" && v.toLowerCase().includes(lq))) }
function sortedData<T extends Record<string, unknown>>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const va = a[f], vb = b[f]; if (va == null || vb == null) return 0; const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true }); return dir === "asc" ? cmp : -cmp }) }

// ── Visual Components ──
function SignalTypeBadge({ type }: { type: string }) {
  const cols: Record<string, string> = { social_media: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", weather: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", event: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", economic: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", competitor: "bg-red-100 text-red-700 dark:bg-red-900/30", search_trend: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", supplier: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", seasonal: "bg-pink-100 text-pink-700 dark:bg-pink-900/30" }
  return <span className={"dsa-signal-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[type] || "bg-gray-100 text-gray-700")}>{SIGNAL_EMOJI[type] || "\u2022"} {type.replace(/_/g, " ")}</span>
}

function CatBadge({ cat }: { cat: string }) {
  return <span className={"dsa-cat-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30"}>{CAT_EMOJI[cat] || "\u2022"} {cat}</span>
}

function ModelStatusBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { active: "dsa-active-badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", training: "dsa-training-badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 animate-pulse", stale: "dsa-stale-badge bg-amber-100 text-amber-700 dark:bg-amber-900/30", retired: "dsa-retired-badge bg-gray-100 text-gray-500 dark:bg-gray-900/30" }
  const icons: Record<string, React.ReactNode> = { active: <CheckCircle2 className="w-3 h-3" />, training: <Sparkles className="w-3 h-3" />, stale: <AlertTriangle className="w-3 h-3" />, retired: <Clock className="w-3 h-3" /> }
  return <span className={"dsa-model-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{icons[status]} {status}</span>
}

function ConfidenceGauge({ value }: { value: number }) {
  const col = value >= 85 ? TH.ok : value >= 60 ? TH.warn : TH.err
  return <div className="dsa-confidence-gauge flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function TrendIndicator({ value }: { value: number }) {
  const pos = value > 0; const col = pos ? TH.ok : TH.err
  return <span className="dsa-trend-indicator inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function CityBadge({ city }: { city: string }) {
  return <span className="dsa-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20">{city}</span>
}

function RegionBadge({ region }: { region: string }) {
  return <span className="dsa-region-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/20">{region}</span>
}

function AccuracyTile({ label, value }: { label: string; value: number }) {
  const col = value >= 90 ? TH.ok : value >= 75 ? TH.warn : TH.err
  return <div className="dsa-accuracy-tile text-center p-2 rounded-lg border" style={{ borderColor: col + "40" }}><div className="text-lg font-bold" style={{ color: col }}>{value}%</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}

function ImpactBadge({ impact }: { impact: string }) {
  const cols: Record<string, string> = { high: "dsa-impact-high bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_6px_rgba(220,38,38,0.3)]", medium: "dsa-impact-med bg-amber-100 text-amber-700 dark:bg-amber-900/30", low: "dsa-impact-low bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" }
  return <span className={"dsa-impact-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[impact] || "")}>{impact}</span>
}

function ValueTile({ label, value, icon, trend }: { label: string; value: string; icon: React.ReactNode; trend: number }) {
  return <Card className="dsa-value-tile glass-subtle hover:shadow-lg transition-shadow"><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card>
}

function MAPEBar({ value }: { value: number }) {
  const col = value <= 5 ? TH.ok : value <= 10 ? TH.warn : TH.err
  return <div className="dsa-mape-bar flex items-center gap-1.5"><div className="w-12 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full" style={{ width: Math.min(value * 10, 100) + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function LatencyBadge({ ms }: { ms: number }) {
  const col = ms <= 50 ? TH.ok : ms <= 200 ? TH.warn : TH.err
  return <span className="dsa-latency-badge inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: col }}><Zap className="w-3 h-3"/>{ms}ms</span>
}

function DriftIndicator({ drift }: { drift: number }) {
  const col = drift <= 2 ? TH.ok : drift <= 5 ? TH.warn : TH.err
  return <span className={"dsa-drift-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (drift <= 2 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : drift <= 5 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30" : "dsa-drift-critical bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_8px_rgba(220,38,38,0.4)]")}><Activity className="w-3 h-3"/>Drift {drift}%</span>
}

// ── Data Generators ──
function genSignals() {
  return Array.from({ length: 80 }, (_, i) => {
    const st = pick(SIGNAL_TYPES, i * 3 + 1)
    const cat = pick(CATEGORIES, i * 3 + 2)
    return {
      id: "SIG-" + String(i + 1).padStart(4, "0"),
      type: st,
      category: cat,
      city: pick(CITIES, i * 3 + 3),
      region: pick(REGIONS, i * 3 + 4),
      strength: ri(10, 100, i + 7),
      impact: pick(["high", "medium", "low"] as const, i + 11),
      confidence: ri(45, 98, i + 13),
      trend: pick(["rising", "falling", "stable", "spike"] as const, i + 17),
      source: pick(["Twitter", "News API", "WeatherStation", "MarketData", "Google Trends", "Internal ERP", "Supplier Feed"], i + 19),
      timestamp: `2026-07-${String(ri(1, 30, i + 23)).padStart(2, "0")} ${String(ri(0, 23, i + 29)).padStart(2, "0")}:${String(ri(0, 59, i + 31)).padStart(2, "0")}`
    }
  })
}

function genForecasts() {
  return Array.from({ length: 70 }, (_, i) => {
    const cat = pick(CATEGORIES, i * 3 + 1)
    return {
      id: "FC-" + String(i + 1).padStart(4, "0"),
      category: cat,
      city: pick(CITIES, i * 3 + 2),
      sku: "SKU-" + String(ri(10000, 99999, i + 7)).padStart(5, "0"),
      current: ri(100, 5000, i + 13),
      predicted: ri(100, 6000, i + 17),
      variance: ri(-25, 30, i + 23),
      confidence: ri(55, 97, i + 29),
      horizon: pick(["7d", "14d", "30d", "60d", "90d"] as const, i + 31),
      model: pick(["LSTM-v3", "Prophet-X", "XGBoost-AI", "Transformer", "ARIMA-Plus", "Ensemble-Hybrid"], i + 37),
      lastUpdated: `2026-07-${String(ri(1, 30, i + 41)).padStart(2, "0")}`
    }
  })
}

function genModels() {
  return Array.from({ length: 12 }, (_, i) => {
    const st = pick(MODEL_STATUS, i * 3 + 1)
    return {
      id: "MDL-" + String(i + 1).padStart(3, "0"),
      name: pick(["LSTM-v3", "Prophet-X", "XGBoost-AI", "Transformer-T", "ARIMA-Plus", "Ensemble-Hybrid", "LightGBM-Fast", "DeepAR-NET", "NBEATS-V2", "Temporal-Fusion", "CNN-LSTM", "WaveNet-Small"], i + 3),
      status: st,
      category: pick(CATEGORIES, i + 7),
      mape: ri(2, 18, i + 11),
      accuracy: ri(68, 98, i + 13),
      latency: ri(12, 350, i + 17),
      drift: ri(0, 12, i + 19),
      trainSamples: ri(10000, 500000, i + 23),
      lastTrained: `2026-07-${String(ri(1, 30, i + 29)).padStart(2, "0")}`,
      version: `v${ri(1, 5, i + 31)}.${ri(0, 9, i + 37)}.${ri(0, 20, i + 41)}`
    }
  })
}

function genCharts() {
  const monthly = MO.map((m, i) => ({ month: m, actual: ri(800, 3200, i + 101), predicted: ri(800, 3200, i + 151), signal_count: ri(20, 120, i + 201), alerts: ri(2, 25, i + 251) }))
  const catPie = CATEGORIES.map((c, i) => ({ name: c, value: ri(500, 8000, i + 301) }))
  const regionBar = REGIONS.map((r, i) => ({ region: r, demand: ri(2000, 15000, i + 401), fulfilled: ri(1500, 14000, i + 451), gap: ri(100, 2000, i + 501) }))
  const accuracyLine = MO.map((m, i) => ({ month: m, mape: +(ri(3, 15, i + 551) / 10).toFixed(1), bias: +(ri(-8, 8, i + 601) / 10).toFixed(1) }))
  return { monthly, catPie, regionBar, accuracyLine }
}

// ── Main Component ──
export default function DemandSensingAiView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null)

  const signals = useMemo(() => genSignals(), [])
  const forecasts = useMemo(() => genForecasts(), [])
  const models = useMemo(() => genModels(), [])
  const charts = useMemo(() => genCharts(), [])
  const filtSignals = useMemo(() => sortedData(filterData(signals, search), sortField, sortDir), [signals, search, sortField, sortDir])
  const filtForecasts = useMemo(() => sortedData(filterData(forecasts, search), sortField, sortDir), [forecasts, search, sortField, sortDir])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const sortIcon = (f: string) => sortField === f ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""

  const avgConf = Math.round(models.filter(m => m.status === "active").reduce((s, m) => s + m.accuracy, 0) / Math.max(1, models.filter(m => m.status === "active").length))
  const activeModels = models.filter(m => m.status === "active").length
  const totalSignals = signals.length
  const highImpact = signals.filter(s => s.impact === "high").length

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ValueTile label="Total Signals" value={totalSignals.toString()} icon={<Signal className="w-4 h-4 text-blue-500"/>} trend={8.5}/>
        <ValueTile label="Active Models" value={activeModels.toString()} icon={<BrainCircuit className="w-4 h-4 text-violet-500"/>} trend={12.3}/>
        <ValueTile label="Avg Accuracy" value={avgConf + "%"} icon={<Target className="w-4 h-4 text-emerald-500"/>} trend={3.2}/>
        <ValueTile label="High Impact" value={highImpact.toString()} icon={<AlertTriangle className="w-4 h-4 text-red-500"/>} trend={-5.1}/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="dsa-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Demand vs Forecast (Monthly)</CardTitle></CardHeader><CardContent><AreaChart data={charts.monthly} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Area type="monotone" dataKey="actual" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/><Area type="monotone" dataKey="predicted" stroke={TH.sec} fill={TH.sec} fillOpacity={0.15}/></AreaChart></CardContent></Card>
        <Card className="dsa-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Demand by Category</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={charts.catPie} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{charts.catPie.map((_, i) => <Cell key={i} fill={PC[i % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
        <Card className="dsa-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Regional Demand Gap</CardTitle></CardHeader><CardContent><BarChart data={charts.regionBar} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="region" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="demand" fill={TH.pri} radius={[2, 2, 0, 0]}/><Bar dataKey="fulfilled" fill={TH.ok} radius={[2, 2, 0, 0]}/><Bar dataKey="gap" fill={TH.warn} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card>
        <Card className="dsa-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">MAPE & Bias Trend</CardTitle></CardHeader><CardContent><LineChart data={charts.accuracyLine} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Line type="monotone" dataKey="mape" stroke={TH.warn} strokeWidth={2} dot={{ r: 3 }}/><Line type="monotone" dataKey="bias" stroke={TH.err} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }}/></LineChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><Search className="w-4 h-4 text-muted-foreground"/><Input placeholder="Search signals..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-xs max-w-xs"/></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="dsa-table w-full text-xs"><thead className="bg-blue-50 dark:bg-blue-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">City</th><th className="p-2 text-left">Impact</th><th className="p-2 text-left">Confidence</th><th className="p-2 text-left">Trend</th><th className="p-2 text-left">Source</th><th className="p-2 text-left">Time</th></tr></thead><tbody>{filtSignals.map(s => <tr key={s.id as string} className="dsa-table-row border-t hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer" onClick={() => setDetail(s)}><td className="p-2 font-mono">{s.id as string}</td><td className="p-2"><SignalTypeBadge type={s.type as string}/></td><td className="p-2"><CatBadge cat={s.category as string}/></td><td className="p-2"><CityBadge city={s.city as string}/></td><td className="p-2"><ImpactBadge impact={s.impact as string}/></td><td className="p-2"><ConfidenceGauge value={s.confidence as number}/></td><td className="p-2"><span className="dsa-trend-cell text-[10px] font-medium">{s.trend as string}</span></td><td className="p-2 text-[10px]">{s.source as string}</td><td className="p-2 text-[10px] text-muted-foreground">{s.timestamp as string}</td></tr>)}</tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filtSignals.length} signals</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><Search className="w-4 h-4 text-muted-foreground"/><Input placeholder="Search forecasts..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-xs max-w-xs"/></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="dsa-table w-full text-xs"><thead className="bg-violet-50 dark:bg-violet-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">City</th><th className="p-2 text-left">SKU</th><th className="p-2 text-right">Current</th><th className="p-2 text-right">Predicted</th><th className="p-2 text-right">Variance</th><th className="p-2 text-left">Confidence</th><th className="p-2 text-left">Model</th><th className="p-2 text-left">Horizon</th></tr></thead><tbody>{filtForecasts.map(f => <tr key={f.id as string} className="dsa-table-row border-t hover:bg-violet-50/50 dark:hover:bg-violet-900/10 cursor-pointer" onClick={() => setDetail(f)}><td className="p-2 font-mono">{f.id as string}</td><td className="p-2"><CatBadge cat={f.category as string}/></td><td className="p-2"><CityBadge city={f.city as string}/></td><td className="p-2 font-mono text-[10px]">{f.sku as string}</td><td className="p-2 text-right">{(f.current as number).toLocaleString()}</td><td className="p-2 text-right font-semibold">{(f.predicted as number).toLocaleString()}</td><td className="p-2 text-right"><TrendIndicator value={f.variance as number}/></td><td className="p-2"><ConfidenceGauge value={f.confidence as number}/></td><td className="p-2 text-[10px]">{f.model as string}</td><td className="p-2"><span className="dsa-horizon-badge inline-flex px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-900/20">{f.horizon as string}</span></td></tr>)}</tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filtForecasts.length} forecasts</div>
    </div>
  )

  const tab3 = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {models.map(m => (
          <Card key={m.id} className="dsa-model-card glass-subtle hover:shadow-lg transition-shadow">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between"><span className="font-semibold text-xs">{m.name}</span><ModelStatusBadge status={m.status}/></div>
              <div className="grid grid-cols-2 gap-2">
                <AccuracyTile label="MAPE" value={100 - m.mape}/>
                <AccuracyTile label="Accuracy" value={m.accuracy}/>
              </div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Latency</span><LatencyBadge ms={m.latency}/></div>
              <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Data Drift</span><DriftIndicator drift={m.drift}/></div>
              <div className="text-[10px] text-muted-foreground">Training: {m.trainSamples.toLocaleString()} samples</div>
              <div className="flex items-center justify-between text-[10px]"><span>{m.version}</span><span>{m.lastTrained}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-3.5 h-3.5" />, content: tab0 },
    { key: "signals", label: "Demand Signals", icon: <Signal className="w-3.5 h-3.5" />, content: tab1 },
    { key: "forecasts", label: "Forecasts", icon: <TrendingUp className="w-3.5 h-3.5" />, content: tab2 },
    { key: "models", label: "Model Performance", icon: <BrainCircuit className="w-3.5 h-3.5" />, content: tab3 }
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Demand Sensing AI" description="AI-powered demand sensing with real-time signal processing, multi-model forecasting, and drift monitoring"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><Sparkles className="w-3 h-3 text-blue-600"/><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">{activeModels} AI Models Active</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><CheckCircle2 className="w-3 h-3 text-emerald-600"/><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{avgConf}% Avg Accuracy</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30"><Lightbulb className="w-3 h-3 text-violet-600"/><span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">{totalSignals} Signals Tracked</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><AlertTriangle className="w-3 h-3 text-amber-600"/><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">{highImpact} High Impact</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Detail View</SheetTitle></SheetHeader>
          {detail && <div className="mt-4 space-y-3">
            <div className="dsa-detail-header rounded-lg p-4 bg-gradient-to-br from-blue-500 to-violet-600 text-white"><div className="text-lg font-bold">{String(detail.id)}</div><div className="text-xs opacity-80 mt-1">{String(detail.type || detail.category || detail.model || "Record")}</div></div>
            {Object.entries(detail).filter(([k]) => k !== "id").map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b"><span className="text-[10px] text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><span className="text-xs font-medium">{typeof v === "number" ? v.toLocaleString() : String(v)}</span></div>)}
          </div>}
        </SheetContent>
      </Sheet>
    </div>
  )
}
