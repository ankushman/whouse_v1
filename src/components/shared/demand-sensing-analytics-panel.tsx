"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Brain, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, AlertTriangle, CheckCircle2, Clock, Package,
  TrendingUp, TrendingDown, Target, Zap, ArrowUpRight, ArrowDownRight,
  CircleDot, LineChart, PieChart, Calendar, FileText, Lightbulb
} from "lucide-react"

type Rec = any

interface DemandRecord {
  id: string; sku: string; productName: string; dc: string
  category: string; forecastDemand: number; actualDemand: number
  forecastAccuracy: number; mape: number; seasonality: string
  trendDirection: string; confidence: number; signalSource: string
  status: string; leadTime: number; safetyStock: number; expanded: boolean
}

const dcCfg: Record<string, Rec> = {
  dc1: { label: "DC Mumbai (Bhiwandi)", color: "#ef4444" },
  dc2: { label: "DC Delhi (Noida)", color: "#3b82f6" },
  dc3: { label: "DC Bengaluru (Whitefield)", color: "#8b5cf6" },
  dc4: { label: "DC Chennai (Sriperumbudur)", color: "#10b981" },
  dc5: { label: "DC Kolkata (Uluberia)", color: "#f59e0b" },
  dc6: { label: "DC Hyderabad (Patancheru)", color: "#06b6d4" }
}

const statusCfg: Record<string, Rec> = {
  accurate: { label: "Accurate", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: CheckCircle2 },
  moderate: { label: "Moderate", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: Target },
  divergent: { label: "Divergent", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: AlertTriangle },
  newproduct: { label: "New Product", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: Lightbulb },
  seasonal: { label: "Seasonal Spike", color: "bg-violet-500", textColor: "text-violet-700 dark:text-violet-400", bgColor: "bg-violet-50 dark:bg-violet-950/30", borderColor: "border-l-violet-500", icon: Calendar }
}

const trendCfg: Record<string, Rec> = {
  up: { label: "Rising", color: "#10b981", icon: ArrowUpRight },
  down: { label: "Falling", color: "#ef4444", icon: ArrowDownRight },
  flat: { label: "Stable", color: "#3b82f6", icon: TrendingUp },
  volatile: { label: "Volatile", color: "#f59e0b", icon: Activity }
}

const seasonCfg: Record<string, Rec> = {
  festive: { label: "Festive", color: "bg-orange-500" },
  monsoon: { label: "Monsoon", color: "bg-blue-500" },
  summer: { label: "Summer", color: "bg-amber-500" },
  winter: { label: "Winter", color: "bg-cyan-500" },
  none: { label: "None", color: "bg-slate-500" }
}

const rawDemands: Rec[] = [
  { id: "DSM-01", sk: "SKU-100201", pn: "Samsung Galaxy S24 Ultra", dc: "dc1", ct: "Electronics", fd: 4500, ad: 4320, fa: 96.0, mp: 4.0, se: "festive", td: "up", cf: 92, ss: "AI + Sales History", st: "accurate", lt: 7, ss2: 800, ex: false },
  { id: "DSM-02", sk: "SKU-100302", pn: "Levi's 501 Original Jeans", dc: "dc2", ct: "Apparel", fd: 3200, ad: 2800, fa: 87.5, mp: 12.5, se: "festive", td: "up", cf: 85, ss: "Social + POS", st: "moderate", lt: 14, ss2: 500, ex: false },
  { id: "DSM-03", sk: "SKU-100403", pn: "Parle-G Biscuit 800g", dc: "dc3", ct: "FMCG", fd: 12000, ad: 11500, fa: 95.8, mp: 4.2, se: "monsoon", td: "flat", cf: 94, ss: "Historical + Weather", st: "accurate", lt: 3, ss2: 2000, ex: false },
  { id: "DSM-04", sk: "SKU-100504", pn: "IKEA KALLAX Shelf Unit", dc: "dc4", ct: "Home & Living", fd: 800, ad: 1200, fa: 66.7, mp: 33.3, se: "none", td: "volatile", cf: 55, ss: "Web Search + Catalog", st: "divergent", lt: 21, ss2: 200, ex: false },
  { id: "DSM-05", sk: "SKU-100605", pn: "Dabur Chyawanprash 1kg", dc: "dc5", ct: "FMCG", fd: 8000, ad: 9200, fa: 86.9, mp: 13.1, se: "winter", td: "up", cf: 80, ss: "Seasonal + Pharmacies", st: "moderate", lt: 5, ss2: 1500, ex: false },
  { id: "DSM-06", sk: "SKU-100706", pn: "Nike Air Max 90", dc: "dc6", ct: "Footwear", fd: 1500, ad: 1480, fa: 98.7, mp: 1.3, se: "none", td: "flat", cf: 96, ss: "AI + Marketplace", st: "accurate", lt: 10, ss2: 300, ex: false },
  { id: "DSM-07", sk: "SKU-100807", pn: "boAt Airdopes 141", dc: "dc1", ct: "Electronics", fd: 5000, ad: 3500, fa: 70.0, mp: 30.0, se: "festive", td: "volatile", cf: 60, ss: "Flash Sales + Ads", st: "divergent", lt: 7, ss2: 900, ex: false },
  { id: "DSM-08", sk: "SKU-100908", pn: "Titan Raga Watch", dc: "dc2", ct: "Accessories", fd: 600, ad: 580, fa: 96.7, mp: 3.3, se: "festive", td: "up", cf: 90, ss: "AI + Historical", st: "accurate", lt: 15, ss2: 100, ex: false },
  { id: "DSM-09", sk: "SKU-101009", pn: "Noise ColorFit Pro 4", dc: "dc3", ct: "Electronics", fd: 3500, ad: 0, fa: 0, mp: 0, se: "none", td: "up", cf: 72, ss: "Market Trend + Launch", st: "newproduct", lt: 10, ss2: 700, ex: false },
  { id: "DSM-10", sk: "SKU-101110", pn: "Amul Ice Cream Family Pack", dc: "dc4", ct: "FMCG", fd: 6000, ad: 8500, fa: 70.6, mp: 29.4, se: "summer", td: "up", cf: 78, ss: "Weather + Historical", st: "seasonal", lt: 2, ss2: 1200, ex: false }
]

const demands: DemandRecord[] = rawDemands.map((r: Rec) => ({
  id: r.id, sku: r.sk, productName: r.pn, dc: r.dc,
  category: r.ct, forecastDemand: r.fd, actualDemand: r.ad,
  forecastAccuracy: r.fa, mape: r.mp, seasonality: r.se,
  trendDirection: r.td, confidence: r.cf, signalSource: r.ss,
  status: r.st, leadTime: r.lt, safetyStock: r.ss2, expanded: r.ex
}))

const viewTabs = [
  { key: "demands", label: "SKU Forecasts", icon: Brain },
  { key: "accuracy", label: "Accuracy Analysis", icon: BarChart3 },
  { key: "signals", label: "Demand Signals", icon: Lightbulb }
]

export function DemandSensingAnalyticsPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("demands")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<DemandRecord[]>(demands)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: DemandRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: DemandRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.productName.toLowerCase().includes(search.toLowerCase()) && !r.sku.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.trendDirection && r.trendDirection !== activeFilters.trendDirection) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const accurate = data.filter(r => r.status === "accurate").length
    const trained = data.filter(r => r.status !== "newproduct")
    const avgAccuracy = trained.length > 0 ? Math.round(trained.reduce((s: number, r: DemandRecord) => s + r.forecastAccuracy, 0) / trained.length) : 0
    const avgConfidence = Math.round(data.reduce((s: number, r: DemandRecord) => s + r.confidence, 0) / Math.max(total, 1))
    const divergent = data.filter(r => r.status === "divergent").length
    return { total, accurate, avgAccuracy, avgConfidence, divergent }
  }, [data])

  return (
    <div className="dsa-root">
      <div className="dsa-header">
        <div className="dsa-header-left">
          <div className="dsa-icon-wrap"><Brain className="h-5 w-5 text-indigo-600" /></div>
          <div>
            <h3 className="dsa-title">Demand Sensing Analytics</h3>
            <p className="dsa-subtitle">AI-powered demand forecasting, seasonality trends, signal tracking &amp; forecast accuracy across Indian DCs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="dsa-live-count">{stats.avgAccuracy}% Avg Accuracy</span>
        </div>
      </div>
      <div className="dsa-stats-grid">
        {[
          { label: "SKU Forecasts", value: String(stats.total), icon: Brain, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
          { label: "Accurate", value: String(stats.accurate), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Avg Accuracy", value: stats.avgAccuracy + "%", icon: Target, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Confidence", value: stats.avgConfidence + "%", icon: Zap, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
          { label: "Divergent", value: String(stats.divergent), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
          { label: "Signals Active", value: "8", icon: Lightbulb, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" }
        ].map(s => (
          <div key={s.label} className="dsa-stat-card">
            <div className={cn("dsa-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="dsa-stat-info"><span className="dsa-stat-value">{s.value}</span><span className="dsa-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="dsa-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search SKU, product, forecast ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("dsa-filter-chip", activeFilters.status === k && "dsa-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="dsa-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="dsa-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(trendCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("trendDirection", k)} className={cn("dsa-type-chip", activeFilters.trendDirection === k && "dsa-type-active")}>
              <v.icon className="h-3 w-3" style={{ color: v.color }} />
              <span>{v.label}</span>
              <span className="dsa-chip-count">{data.filter(r => r.trendDirection === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="dsa-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("dsa-view-tab", view === t.key && "dsa-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "demands" && (
        <div className="dsa-grid">
          {filtered.map(d => {
            const sc = statusCfg[d.status] as Rec
            const dc = dcCfg[d.dc] as Rec
            const tr = trendCfg[d.trendDirection] as Rec
            const sn = seasonCfg[d.seasonality] as Rec
            const SIcon = (sc.icon as React.ElementType) || Brain
            const isDivergent = d.status === "divergent"
            const accColor = d.forecastAccuracy >= 90 ? "#10b981" : d.forecastAccuracy >= 75 ? "#f59e0b" : "#ef4444"
            const confColor = d.confidence >= 85 ? "#10b981" : d.confidence >= 60 ? "#f59e0b" : "#ef4444"
            const TIcon = (tr.icon as React.ElementType) || TrendingUp
            return (
              <div key={d.id} className={cn("dsa-card", `border-l-4 ${sc.borderColor || ""}`, isDivergent && "dsa-card-divergent")}>
                <div className="dsa-card-top">
                  <div className="flex items-center gap-2">
                    <span className="dsa-card-id">{d.id}</span>
                    <span className={cn("dsa-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                    <span className="dsa-trend-badge" style={{ color: tr.color }}><TIcon className="h-3 w-3" />{tr.label}</span>
                  </div>
                  <span className="dsa-season-badge" style={{ backgroundColor: sn.color + "18", color: sn.color }}>{sn.label}</span>
                </div>
                <div className="dsa-name-row">
                  <span className="dsa-name"><Package className="h-3.5 w-3.5" />{d.productName}</span>
                  <span className="dsa-dc" style={{ color: dc.color }}>{dc.label}</span>
                </div>
                <div className="dsa-sku-row">
                  <span className="dsa-sku">{d.sku}</span>
                  <span className="dsa-category">{d.category}</span>
                </div>
                <div className="dsa-forecast-row">
                  <div className="dsa-fc-block"><span className="dsa-fc-label">Forecast</span><span className="dsa-fc-val">{d.forecastDemand.toLocaleString()}</span></div>
                  {d.status !== "newproduct" && <div className="dsa-fc-block"><span className="dsa-fc-label">Actual</span><span className="dsa-fc-val">{d.actualDemand.toLocaleString()}</span></div>}
                </div>
                {d.status !== "newproduct" && (
                  <div className="dsa-acc-bar-row">
                    <span className="dsa-acc-label">Accuracy:</span>
                    <div className="dsa-acc-bar-track"><div className="dsa-acc-bar-fill" style={{ width: d.forecastAccuracy + "%", backgroundColor: accColor }} /></div>
                    <span className="dsa-acc-pct" style={{ color: accColor }}>{d.forecastAccuracy}%</span>
                    <span className="dsa-mape" style={{ color: accColor }}>MAPE: {d.mape}%</span>
                  </div>
                )}
                <div className="dsa-conf-row">
                  <span className="dsa-conf-label">Confidence:</span>
                  <div className="dsa-conf-bar-track"><div className="dsa-conf-bar-fill" style={{ width: d.confidence + "%", backgroundColor: confColor }} /></div>
                  <span className="dsa-conf-pct" style={{ color: confColor }}>{d.confidence}%</span>
                </div>
                <div className="dsa-metrics-row">
                  <span className="dsa-metric"><Clock className="h-3 w-3" />LT: {d.leadTime}d</span>
                  <span className="dsa-metric"><Package className="h-3 w-3" />SS: {d.safetyStock.toLocaleString()}</span>
                  <span className="dsa-metric"><Lightbulb className="h-3 w-3" />{d.signalSource}</span>
                </div>
                {isDivergent && <span className="dsa-div-alert"><AlertTriangle className="h-3 w-3" />Forecast Deviation &gt;20% — Review Model</span>}
                <button onClick={() => toggleExpand(d.id)} className="dsa-expand-btn">
                  {d.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{d.expanded ? "Hide" : "Forecast Details"}</span>
                </button>
                {d.expanded && (
                  <div className="dsa-expanded"><div className="dsa-detail-grid">
                    {[
                      { l: "ID", v: d.id }, { l: "SKU", v: d.sku }, { l: "Product", v: d.productName },
                      { l: "DC", v: dc.label }, { l: "Category", v: d.category }, { l: "Forecast", v: String(d.forecastDemand) },
                      { l: "Actual", v: String(d.actualDemand) }, { l: "Accuracy", v: d.forecastAccuracy + "%" },
                      { l: "MAPE", v: d.mape + "%" }, { l: "Confidence", v: d.confidence + "%" },
                      { l: "Lead Time", v: d.leadTime + " days" }, { l: "Safety Stock", v: String(d.safetyStock) }
                    ].map(dd => (
                      <div key={dd.l} className="dsa-detail-item"><span className="dsa-detail-label">{dd.l}</span><span className="dsa-detail-value">{dd.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="dsa-empty">No forecasts match your filters</div>}
        </div>
      )}

      {view === "accuracy" && (
        <div className="dsa-anal-view">
          <div className="dsa-anal-col">
            <h4 className="dsa-anal-title">Accuracy by Category</h4>
            {Array.from(new Set(data.filter(r => r.status !== "newproduct").map(r => r.category))).sort().map(cat => {
              const cd = data.filter(r => r.category === cat && r.status !== "newproduct")
              const avgAcc = Math.round(cd.reduce((s: number, r: DemandRecord) => s + r.forecastAccuracy, 0) / Math.max(cd.length, 1))
              const avgMAPE = (cd.reduce((s: number, r: DemandRecord) => s + r.mape, 0) / Math.max(cd.length, 1)).toFixed(1)
              const accColor = avgAcc >= 90 ? "#10b981" : avgAcc >= 75 ? "#f59e0b" : "#ef4444"
              return (
                <div key={cat} className="dsa-band-card">
                  <div className="flex items-center gap-2 mb-2"><PieChart className="h-4 w-4 text-indigo-500" /><span className="dsa-band-name">{cat}</span><span className="dsa-band-sub">{cd.length} SKU(s)</span></div>
                  <div className="dsa-band-stats">
                    <div className="dsa-band-stat"><span className="dsa-band-val" style={{ color: accColor }}>{avgAcc}%</span><span className="dsa-band-lbl">Avg Accuracy</span></div>
                    <div className="dsa-band-stat"><span className="dsa-band-val text-amber-600">{avgMAPE}%</span><span className="dsa-band-lbl">Avg MAPE</span></div>
                  </div>
                  <div className="dsa-acc-bar-track mt-2"><div className="dsa-acc-bar-fill" style={{ width: avgAcc + "%", backgroundColor: accColor }} /></div>
                </div>
              )
            })}
          </div>
          <div className="dsa-anal-col">
            <h4 className="dsa-anal-title">Worst Forecasts (Low Accuracy)</h4>
            {data.filter(r => r.status !== "newproduct").sort((a: DemandRecord, b: DemandRecord) => a.forecastAccuracy - b.forecastAccuracy).slice(0, 5).map(d => {
              const dc = dcCfg[d.dc] as Rec
              return (
                <div key={d.id} className="dsa-alert-row">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="dsa-alert-name">{d.id} {d.productName}</span>
                  <span className="dsa-alert-stat">{d.forecastAccuracy}%</span>
                  <span className="dsa-alert-rooms">{d.mape}% MAPE | {dc.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "signals" && (
        <div className="dsa-anal-view">
          <div className="dsa-anal-col">
            <h4 className="dsa-anal-title">Seasonal Patterns</h4>
            {Object.entries(seasonCfg).map(([k, v]: [string, Rec]) => {
              const sd = data.filter(r => r.seasonality === k)
              if (sd.length === 0) return null
              const avgConf = Math.round(sd.reduce((s: number, r: DemandRecord) => s + r.confidence, 0) / sd.length)
              return (
                <div key={k} className="dsa-band-card">
                  <div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4" style={{ color: v.color }} /><span className="dsa-band-name">{v.label}</span><span className="dsa-band-sub">{sd.length} SKU(s)</span></div>
                  <div className="dsa-band-stats">
                    <div className="dsa-band-stat"><span className="dsa-band-val text-violet-600">{avgConf}%</span><span className="dsa-band-lbl">Avg Confidence</span></div>
                    <div className="dsa-band-stat"><span className="dsa-band-val text-blue-600">{sd.length}</span><span className="dsa-band-lbl">Items</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="dsa-anal-col">
            <h4 className="dsa-anal-title">Signal Sources Distribution</h4>
            {Array.from(new Set(data.map(r => r.signalSource))).sort().map(src => {
              const sd = data.filter(r => r.signalSource === src)
              const avgAcc = sd.filter(r => r.status !== "newproduct").length > 0 ? Math.round(sd.filter(r => r.status !== "newproduct").reduce((s: number, r: DemandRecord) => s + r.forecastAccuracy, 0) / sd.filter(r => r.status !== "newproduct").length) : 0
              return (
                <div key={src} className="dsa-band-card">
                  <div className="flex items-center gap-2 mb-2"><LineChart className="h-4 w-4 text-indigo-500" /><span className="dsa-band-name">{src}</span><span className="dsa-band-sub">{sd.length} SKU(s)</span></div>
                  <div className="dsa-band-stats">
                    <div className="dsa-band-stat"><span className="dsa-band-val text-blue-600">{avgAcc}%</span><span className="dsa-band-lbl">Avg Accuracy</span></div>
                    <div className="dsa-band-stat"><span className="dsa-band-val text-violet-600">{sd.length}</span><span className="dsa-band-lbl">Items</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
