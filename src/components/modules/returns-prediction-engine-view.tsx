"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Brain, TrendingUp, TrendingDown, ShieldAlert, ShieldCheck, Target, Search, ArrowUpDown, AlertTriangle, Package, Recycle, DollarSign, Clock, CheckCircle2, XCircle, Lightbulb, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

// ── Constants ──
const RETURN_REASONS = ["defective", "wrong_item", "size_issue", "color_mismatch", "damaged_shipping", "changed_mind", "late_delivery", "quality_below"] as const
const REASON_EMOJI: Record<string, string> = { defective: "\u274c", wrong_item: "\U0001f504", size_issue: "\U0001f4cf", color_mismatch: "\U0001f3a8", damaged_shipping: "\U0001f4e6", changed_mind: "\U0001f914", late_delivery: "\u23f0", quality_below: "\u2622\ufe0f" }
const CATEGORIES = ["electronics", "fashion", "grocery", "pharma", "furniture", "beauty", "sports", "auto"] as const
const CAT_EMOJI: Record<string, string> = { electronics: "\U0001f4bb", fashion: "\U0001f457", grocery: "\U0001f34e", pharma: "\U0001f48a", furniture: "\U0001f6cb", beauty: "\U0001f9f5", sports: "\u26bd", auto: "\U0001f697" }
const RISK_LEVELS = ["low", "medium", "high", "critical"] as const
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"] as const
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { pri: "#d97706", sec: "#dc2626", ok: "#059669", info: "#3b82f6" }
const PC = ["#d97706", "#dc2626", "#3b82f6", "#059669", "#7c3aed", "#06b6d4", "#ec4899", "#8b5cf6"]

// ── Utilities ──
function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function pick<T>(arr: readonly T[], seed: number): T { return arr[Math.floor(seededRandom(seed) * arr.length)] }
function filterData<T extends Record<string, unknown>>(d: T[], q: string): T[] { if (!q) return d; const lq = q.toLowerCase(); return d.filter(r => Object.values(r).some(v => typeof v === "string" && v.toLowerCase().includes(lq))) }
function sortedData<T extends Record<string, unknown>>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const va = a[f], vb = b[f]; if (va == null || vb == null) return 0; const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true }); return dir === "asc" ? cmp : -cmp }) }

// ── Visual Components ──
function ReasonBadge({ reason }: { reason: string }) {
  const cols: Record<string, string> = { defective: "bg-red-100 text-red-700 dark:bg-red-900/30", wrong_item: "bg-blue-100 text-blue-700 dark:bg-blue-900/30", size_issue: "bg-amber-100 text-amber-700 dark:bg-amber-900/30", color_mismatch: "bg-pink-100 text-pink-700 dark:bg-pink-900/30", damaged_shipping: "bg-orange-100 text-orange-700 dark:bg-orange-900/30", changed_mind: "bg-violet-100 text-violet-700 dark:bg-violet-900/30", late_delivery: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30", quality_below: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" }
  return <span className={"rpe-reason-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[reason] || "bg-gray-100 text-gray-700")}>{REASON_EMOJI[reason] || "\u2022"} {reason.replace(/_/g, " ")}</span>
}

function CatBadge({ cat }: { cat: string }) {
  return <span className={"rpe-cat-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30"}>{CAT_EMOJI[cat] || "\u2022"} {cat}</span>
}

function RiskBadge({ risk }: { risk: string }) {
  const cols: Record<string, string> = { low: "rpe-risk-low bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", medium: "rpe-risk-med bg-amber-100 text-amber-700 dark:bg-amber-900/30", high: "rpe-risk-high bg-red-100 text-red-700 dark:bg-red-900/30 shadow-[0_0_6px_rgba(220,38,38,0.3)]", critical: "rpe-risk-critical bg-red-200 text-red-800 dark:bg-red-900/40 shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse" }
  return <span className={"rpe-risk-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold " + (cols[risk] || "")}>{risk.toUpperCase()}</span>
}

function CityBadge({ city }: { city: string }) {
  return <span className="rpe-city-badge inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/20">{city}</span>
}

function ProbGauge({ value }: { value: number }) {
  const col = value >= 70 ? TH.sec : value >= 40 ? TH.pri : TH.ok
  return <div className="rpe-prob-gauge flex items-center gap-1.5"><div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: value + "%", backgroundColor: col }}/></div><span className="text-[10px] font-bold" style={{ color: col }}>{value}%</span></div>
}

function CostBadge({ cost }: { cost: number }) {
  const col = cost >= 5000 ? TH.sec : cost >= 2000 ? TH.pri : TH.ok
  return <span className="rpe-cost-badge inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: col }}><DollarSign className="w-3 h-3"/>{cost.toLocaleString()}</span>
}

function TrendIndicator({ value }: { value: number }) {
  const neg = value < 0; const col = neg ? TH.sec : TH.ok
  return <span className="rpe-trend-indicator inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: col }}>{neg ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(value).toFixed(1)}%</span>
}

function ValueTile({ label, value, icon, trend }: { label: string; value: string; icon: React.ReactNode; trend: number }) {
  return <Card className="rpe-value-tile glass-subtle hover:shadow-lg transition-shadow"><CardContent className="p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span>{icon}</div><div className="text-xl font-bold mt-1">{value}</div><TrendIndicator value={trend}/></CardContent></Card>
}

function SavingsTile({ label, value }: { label: string; value: string }) {
  return <div className="rpe-savings-tile p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-center"><div className="text-lg font-bold text-emerald-600">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}

function StrategyBadge({ status }: { status: string }) {
  const cols: Record<string, string> = { active: "rpe-strategy-active bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30", planned: "rpe-strategy-plan bg-blue-100 text-blue-700 dark:bg-blue-900/30", piloting: "rpe-strategy-pilot bg-violet-100 text-violet-700 dark:bg-violet-900/30", completed: "rpe-strategy-done bg-gray-100 text-gray-600 dark:bg-gray-800" }
  return <span className={"rpe-strategy-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cols[status] || "")}>{status}</span>
}

function ProgressRing({ pct }: { pct: number }) {
  const col = pct >= 80 ? TH.ok : pct >= 50 ? TH.info : TH.pri
  const r = 18; const circ = 2 * Math.PI * r; const off = circ * (1 - pct / 100)
  return <svg width={44} height={44} className="rpe-progress-ring"><circle cx={22} cy={22} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-200 dark:text-gray-700"/><circle cx={22} cy={22} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 22 22)"/><text x={22} y={22} textAnchor="middle" dominantBaseline="central" className="text-[9px] font-bold fill-current" style={{ color: col }}>{pct}%</text></svg>
}

function ROIIndicator({ roi }: { roi: number }) {
  const col = roi >= 200 ? TH.ok : roi >= 100 ? TH.info : TH.pri
  return <span className="rpe-roi-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: col + "20", color: col }}>{roi}x ROI</span>
}

// ── Data Generators ──
function genPredictions() {
  return Array.from({ length: 80 }, (_, i) => {
    const reason = pick(RETURN_REASONS, i * 3 + 1)
    const cat = pick(CATEGORIES, i * 3 + 2)
    return {
      id: "RP-" + String(i + 1).padStart(4, "0"),
      orderId: "ORD-" + String(ri(100000, 999999, i + 7)).padStart(6, "0"),
      category: cat,
      reason: reason,
      city: pick(CITIES, i * 3 + 3),
      returnProb: ri(5, 95, i + 11),
      risk: pick(RISK_LEVELS, i + 13),
      estimatedCost: ri(200, 15000, i + 17),
      predictedDate: `2026-08-${String(ri(1, 31, i + 19)).padStart(2, "0")}`,
      model: pick(["RandomForest", "XGBoost-Returns", "NeuralNet-V2", "LogisticReg", "Ensemble-Returns", "LightGBM-R"], i + 23),
      confidence: ri(50, 97, i + 29),
      customerSegment: pick(["Premium", "Regular", "First-time", "Wholesale", "Loyalty"], i + 31)
    }
  })
}

function genRisks() {
  return Array.from({ length: 60 }, (_, i) => {
    const cat = pick(CATEGORIES, i * 3 + 1)
    return {
      id: "RSK-" + String(i + 1).padStart(4, "0"),
      category: cat,
      city: pick(CITIES, i * 3 + 2),
      riskFactor: pick(["supplier_quality", "packaging", "shipping_carrier", "last_mile", "customer_expectation", "product_complexity", "storage_conditions", "handling_procedures"], i + 3),
      riskLevel: pick(RISK_LEVELS, i + 7),
      returnRate: ri(2, 35, i + 11),
      avgCostPerReturn: ri(300, 8000, i + 13),
      monthlyImpact: ri(10, 500, i + 17),
      trend: pick(["increasing", "decreasing", "stable", "spike"], i + 19),
      mitigation: pick(["Improve packaging", "Switch carrier", "Better QC", "Enhanced inspection", "Customer education", "Improve product desc", "Better handling SOP"], i + 23)
    }
  })
}

function genStrategies() {
  return Array.from({ length: 16 }, (_, i) => {
    const st = pick(["active", "planned", "piloting", "completed"] as const, i * 2 + 1)
    return {
      id: "STR-" + String(i + 1).padStart(3, "0"),
      name: pick(["Enhanced Pre-Ship QC", "AI Size Recommendation", "Virtual Try-On", "Improved Packaging", "Carrier Scorecard", "Customer Feedback Loop", "Predictive QA Gates", "Return Reason Dashboard", "Auto-Refund Threshold", "Restock Automation", "Product Photo Accuracy", "Dimensional Check AI", "Smart Return Routing", "Quality Correlation AI", "Supplier Penalty Program", "Last-Mile Protection"], i + 2),
      status: st,
      reductionPct: ri(5, 45, i + 7),
      savings: ri(50000, 2000000, i + 11),
      roi: ri(80, 400, i + 13),
      progress: st === "completed" ? 100 : ri(10, 90, i + 17),
      category: pick(CATEGORIES, i + 19),
      startDate: `2026-${String(ri(1, 7, i + 23)).padStart(2, "0")}-${String(ri(1, 28, i + 29)).padStart(2, "0")}`
    }
  })
}

function genCharts() {
  const monthly = MO.map((m, i) => ({ month: m, actual_returns: ri(200, 1200, i + 101), predicted_returns: ri(200, 1200, i + 151), prevented: ri(50, 400, i + 201), cost_savings: ri(100000, 800000, i + 251) }))
  const reasonPie = RETURN_REASONS.map((r, i) => ({ name: r.replace(/_/g, " "), value: ri(50, 800, i + 301) }))
  const catBar = CATEGORIES.map((c, i) => ({ category: c, return_rate: ri(3, 28, i + 401), cost: ri(50000, 500000, i + 451) }))
  const riskLine = MO.map((m, i) => ({ month: m, avg_risk: +(ri(15, 55, i + 501) / 10).toFixed(1), high_risk_count: ri(5, 40, i + 551) }))
  return { monthly, reasonPie, catBar, riskLine }
}

// ── Main Component ──
export default function ReturnsPredictionEngineView() {
  const [tab, setTab] = useState("dashboard")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null)

  const predictions = useMemo(() => genPredictions(), [])
  const risks = useMemo(() => genRisks(), [])
  const strategies = useMemo(() => genStrategies(), [])
  const charts = useMemo(() => genCharts(), [])
  const filtPreds = useMemo(() => sortedData(filterData(predictions, search), sortField, sortDir), [predictions, search, sortField, sortDir])
  const filtRisks = useMemo(() => sortedData(filterData(risks, search), sortField, sortDir), [risks, search, sortField, sortDir])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const sortIcon = (f: string) => sortField === f ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""

  const avgReturnRate = Math.round(risks.reduce((s, r) => s + r.returnRate, 0) / risks.length)
  const totalCost = predictions.reduce((s, p) => s + p.estimatedCost, 0)
  const highRiskCount = risks.filter(r => r.riskLevel === "high" || r.riskLevel === "critical").length
  const activeStrategies = strategies.filter(s => s.status === "active" || s.status === "piloting").length

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ValueTile label="Avg Return Rate" value={avgReturnRate + "%"} icon={<Package className="w-4 h-4 text-amber-500"/>} trend={-4.2}/>
        <ValueTile label="Total Cost at Risk" value={"\u20b9" + (totalCost / 100000).toFixed(1) + "L"} icon={<DollarSign className="w-4 h-4 text-red-500"/>} trend={6.8}/>
        <ValueTile label="High Risk Items" value={highRiskCount.toString()} icon={<ShieldAlert className="w-4 h-4 text-red-500"/>} trend={2.1}/>
        <ValueTile label="Active Strategies" value={activeStrategies.toString()} icon={<Lightbulb className="w-4 h-4 text-blue-500"/>} trend={15.5}/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="rpe-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Returns Trend (Actual vs Predicted)</CardTitle></CardHeader><CardContent><AreaChart data={charts.monthly} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Area type="monotone" dataKey="actual_returns" stroke={TH.pri} fill={TH.pri} fillOpacity={0.2}/><Area type="monotone" dataKey="predicted_returns" stroke={TH.sec} fill={TH.sec} fillOpacity={0.15}/></AreaChart></CardContent></Card>
        <Card className="rpe-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Return Reasons Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={charts.reasonPie} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>{charts.reasonPie.map((_, i) => <Cell key={i} fill={PC[i % PC.length]}/>)}</Pie><Tooltip contentStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
        <Card className="rpe-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Return Rate & Cost by Category</CardTitle></CardHeader><CardContent><BarChart data={charts.catBar} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="category" tick={{ fontSize: 9 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Bar dataKey="return_rate" fill={TH.pri} radius={[2, 2, 0, 0]}/><Bar dataKey="cost" fill={TH.sec} radius={[2, 2, 0, 0]}/></BarChart></CardContent></Card>
        <Card className="rpe-chart-card glass-subtle"><CardHeader className="pb-1"><CardTitle className="text-xs">Risk Score Trend</CardTitle></CardHeader><CardContent><LineChart data={charts.riskLine} height={200}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip contentStyle={{ fontSize: 10 }}/><Line type="monotone" dataKey="avg_risk" stroke={TH.pri} strokeWidth={2} dot={{ r: 3 }}/><Line type="monotone" dataKey="high_risk_count" stroke={TH.sec} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }}/></LineChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><Search className="w-4 h-4 text-muted-foreground"/><Input placeholder="Search predictions..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-xs max-w-xs"/></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="rpe-table w-full text-xs"><thead className="bg-amber-50 dark:bg-amber-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Order</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">Reason</th><th className="p-2 text-left">City</th><th className="p-2 text-left">Return Prob</th><th className="p-2 text-left">Risk</th><th className="p-2 text-right">Est. Cost</th><th className="p-2 text-left">Segment</th><th className="p-2 text-left">Model</th></tr></thead><tbody>{filtPreds.map(p => <tr key={p.id as string} className="rpe-table-row border-t hover:bg-amber-50/50 dark:hover:bg-amber-900/10 cursor-pointer" onClick={() => setDetail(p)}><td className="p-2 font-mono">{p.id as string}</td><td className="p-2 font-mono text-[10px]">{p.orderId as string}</td><td className="p-2"><CatBadge cat={p.category as string}/></td><td className="p-2"><ReasonBadge reason={p.reason as string}/></td><td className="p-2"><CityBadge city={p.city as string}/></td><td className="p-2"><ProbGauge value={p.returnProb as number}/></td><td className="p-2"><RiskBadge risk={p.risk as string}/></td><td className="p-2 text-right"><CostBadge cost={p.estimatedCost as number}/></td><td className="p-2 text-[10px]">{p.customerSegment as string}</td><td className="p-2 text-[10px]">{p.model as string}</td></tr>)}</tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filtPreds.length} predictions</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><Search className="w-4 h-4 text-muted-foreground"/><Input placeholder="Search risks..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-xs max-w-xs"/></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="rpe-table w-full text-xs"><thead className="bg-red-50 dark:bg-red-900/20 sticky top-0"><tr><th className="p-2 text-left cursor-pointer select-none" onClick={() => toggleSort("id")}>ID {sortIcon("id")}</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">City</th><th className="p-2 text-left">Risk Factor</th><th className="p-2 text-left">Level</th><th className="p-2 text-right">Return Rate</th><th className="p-2 text-right">Avg Cost</th><th className="p-2 text-right">Monthly Impact</th><th className="p-2 text-left">Trend</th><th className="p-2 text-left">Mitigation</th></tr></thead><tbody>{filtRisks.map(r => <tr key={r.id as string} className="rpe-table-row border-t hover:bg-red-50/50 dark:hover:bg-red-900/10 cursor-pointer" onClick={() => setDetail(r)}><td className="p-2 font-mono">{r.id as string}</td><td className="p-2"><CatBadge cat={r.category as string}/></td><td className="p-2"><CityBadge city={r.city as string}/></td><td className="p-2"><span className="rpe-risk-factor text-[10px] font-medium">{(r.riskFactor as string).replace(/_/g, " ")}</span></td><td className="p-2"><RiskBadge risk={r.riskLevel as string}/></td><td className="p-2 text-right font-semibold">{r.returnRate}%</td><td className="p-2 text-right"><CostBadge cost={r.avgCostPerReturn as number}/></td><td className="p-2 text-right">{r.monthlyImpact}</td><td className="p-2"><span className="rpe-trend-cell text-[10px]">{r.trend as string}</span></td><td className="p-2 text-[10px] max-w-[150px] truncate">{r.mitigation as string}</td></tr>)}</tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filtRisks.length} risk items</div>
    </div>
  )

  const tab3 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {strategies.slice(0, 8).map(s => {
          const sv = "Rs." + (s.savings / 100000).toFixed(1) + "L"
          return <SavingsTile key={s.id} label={s.name} value={sv}/>
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {strategies.map(s => (
          <Card key={s.id} className="rpe-strategy-card glass-subtle hover:shadow-lg transition-shadow">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between"><span className="font-semibold text-xs">{s.name}</span><StrategyBadge status={s.status}/></div>
              <div className="flex items-center gap-4">
                <ProgressRing pct={s.progress}/>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Reduction</span><span className="font-semibold">{s.reductionPct}%</span></div>
                  <div className="flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Savings</span><span className="font-semibold text-emerald-600">\u20b9{(s.savings / 100000).toFixed(1)}L</span></div>
                </div>
              </div>
              <div className="flex items-center justify-between"><ROIIndicator roi={s.roi}/><CatBadge cat={s.category}/></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: <Target className="w-3.5 h-3.5" />, content: tab0 },
    { key: "predictions", label: "Return Predictions", icon: <Brain className="w-3.5 h-3.5" />, content: tab1 },
    { key: "risks", label: "Risk Analysis", icon: <ShieldAlert className="w-3.5 h-3.5" />, content: tab2 },
    { key: "strategies", label: "Reduction Strategies", icon: <Lightbulb className="w-3.5 h-3.5" />, content: tab3 }
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Returns Prediction Engine" description="AI-powered return risk prediction with multi-factor analysis, cost modeling, and proactive reduction strategies"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><ShieldAlert className="w-3 h-3 text-amber-600"/><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">{highRiskCount} High Risk</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><ShieldCheck className="w-3 h-3 text-emerald-600"/><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{activeStrategies} Strategies Active</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><Recycle className="w-3 h-3 text-blue-600"/><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">{avgReturnRate}% Avg Return</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30"><DollarSign className="w-3 h-3 text-red-600"/><span className="text-[10px] font-semibold text-red-700 dark:text-red-300">\u20b9{(totalCost/100000).toFixed(0)}L Cost at Risk</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-amber-500/10 to-red-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-amber-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Detail View</SheetTitle></SheetHeader>
          {detail && <div className="mt-4 space-y-3">
            <div className="rpe-detail-header rounded-lg p-4 bg-gradient-to-br from-amber-500 to-red-600 text-white"><div className="text-lg font-bold">{String(detail.id)}</div><div className="text-xs opacity-80 mt-1">{String(detail.category || detail.riskFactor || detail.reason || "Record")}</div></div>
            {Object.entries(detail).filter(([k]) => k !== "id").map(([k, v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b"><span className="text-[10px] text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><span className="text-xs font-medium">{typeof v === "number" ? v.toLocaleString() : String(v)}</span></div>)}
          </div>}
        </SheetContent>
      </Sheet>
    </div>
  )
}
