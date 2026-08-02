"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3, Target, Brain,
  Clock, Package, AlertTriangle,
  ArrowUp, ArrowDown, Zap, MapPin
} from "lucide-react"

const raw = [
  { id: "DFO-01", sku: "SKU-INS-8842", product: "Amul Toned Milk 500ml", category: "Dairy", region: "West India", dc: "Mumbai DC-1", current: 18400, forecast: 21200, actual: 20800, accuracy: 98, trend: "up", growthPct: 15.2, confidence: 92, horizon: "30d", model: "ARIMA", stockDays: 28, safetyStock: 5200, status: "On Track", seasonality: "Monsoon Peak", lastUpdated: "2h ago" },
  { id: "DFO-02", sku: "SKU-ELC-3321", product: "boAt Airdopes 141", category: "Electronics", region: "South India", dc: "Bengaluru DC-3", current: 8200, forecast: 6800, actual: 7100, accuracy: 95, trend: "down", growthPct: -13.4, confidence: 88, horizon: "30d", model: "XGBoost", stockDays: 35, safetyStock: 3800, status: "On Track", seasonality: "Post-Festive Dip", lastUpdated: "1h ago" },
  { id: "DFO-03", sku: "SKU-APL-7710", product: "Parle-G Biscuit 100g", category: "FMCG", region: "North India", dc: "Delhi DC-2", current: 52000, forecast: 58600, actual: 61200, accuracy: 96, trend: "up", growthPct: 17.7, confidence: 94, horizon: "30d", model: "Prophet", stockDays: 22, safetyStock: 14000, status: "High Demand", seasonality: "Summer Peak", lastUpdated: "45m ago" },
  { id: "DFO-04", sku: "SKU-TXL-5543", product: "Levi's 501 Jeans 32W", category: "Apparel", region: "Metro", dc: "Chennai DC-6", current: 2400, forecast: 3800, actual: 1950, accuracy: 51, trend: "up", growthPct: 58.3, confidence: 62, horizon: "60d", model: "LSTM", stockDays: 12, safetyStock: 1800, status: "Forecast Miss", seasonality: "EOSS Clearance", lastUpdated: "3h ago" },
  { id: "DFO-05", sku: "SKU-PHR-9901", product: "Dabur Chyawanprash 500g", category: "Pharma", region: "East India", dc: "Kolkata DC-5", current: 6800, forecast: 7200, actual: 7000, accuracy: 97, trend: "up", growthPct: 2.9, confidence: 91, horizon: "30d", model: "ARIMA", stockDays: 38, safetyStock: 4200, status: "On Track", seasonality: "Monsoon Immunity", lastUpdated: "30m ago" },
  { id: "DFO-06", sku: "SKU-FAS-2218", product: "Nykaa Lipstick Matte Set", category: "Beauty", region: "West India", dc: "Mumbai DC-1", current: 4500, forecast: 5200, actual: 6800, accuracy: 76, trend: "up", growthPct: 51.1, confidence: 72, horizon: "30d", model: "XGBoost", stockDays: 8, safetyStock: 3200, status: "Stock Risk", seasonality: "Festive Surge", lastUpdated: "15m ago" },
  { id: "DFO-07", sku: "SKU-HOM-4456", product: "IKEA KALLAX Shelf", category: "Furniture", region: "South India", dc: "Bengaluru DC-3", current: 850, forecast: 920, actual: 880, accuracy: 96, trend: "up", growthPct: 3.5, confidence: 89, horizon: "60d", model: "Prophet", stockDays: 45, safetyStock: 400, status: "On Track", seasonality: "Flat", lastUpdated: "1h ago" },
  { id: "DFO-08", sku: "SKU-ELC-6612", product: "Samsung Galaxy M14", category: "Electronics", region: "North India", dc: "Delhi DC-2", current: 12000, forecast: 15000, actual: 9800, accuracy: 65, trend: "down", growthPct: -18.3, confidence: 58, horizon: "30d", model: "LSTM", stockDays: 18, safetyStock: 6500, status: "Forecast Miss", seasonality: "Pre-Launch Dip", lastUpdated: "4h ago" },
  { id: "DFO-09", sku: "SKU-GRC-1105", product: "Tata Salt 1kg", category: "FMCG", region: "Pan India", dc: "Mumbai DC-1", current: 38000, forecast: 40500, actual: 41200, accuracy: 98, trend: "up", growthPct: 8.4, confidence: 96, horizon: "30d", model: "ARIMA", stockDays: 32, safetyStock: 12000, status: "On Track", seasonality: "Flat", lastUpdated: "20m ago" },
  { id: "DFO-10", sku: "SKU-SPT-8837", product: "Noise ColorFit Pro 4", category: "Electronics", region: "South India", dc: "Hyderabad DC-4", current: 5600, forecast: 4200, actual: 5900, accuracy: 71, trend: "up", growthPct: 40.5, confidence: 68, horizon: "30d", model: "XGBoost", stockDays: 10, safetyStock: 3800, status: "Stock Risk", seasonality: "Flash Sale Spike", lastUpdated: "50m ago" },
]

interface DFOItem {
  id: string; sku: string; product: string; category: string; region: string
  dc: string; current: number; forecast: number; actual: number; accuracy: number
  trend: string; growthPct: number; confidence: number; horizon: string; model: string
  stockDays: number; safetyStock: number; status: string; seasonality: string
  lastUpdated: string
}

const items: DFOItem[] = raw.map((r: any) => ({
  id: r.id, sku: r.sku, product: r.product, category: r.category, region: r.region,
  dc: r.dc, current: r.current, forecast: r.forecast, actual: r.actual, accuracy: r.accuracy,
  trend: r.trend, growthPct: r.growthPct, confidence: r.confidence, horizon: r.horizon, model: r.model,
  stockDays: r.stockDays, safetyStock: r.safetyStock, status: r.status, seasonality: r.seasonality,
  lastUpdated: r.lastUpdated,
}))

const statusColors: Record<string, string> = {
  "On Track": "text-emerald-600 font-semibold", "High Demand": "text-blue-600 font-semibold",
  "Forecast Miss": "text-red-600 font-semibold", "Stock Risk": "text-amber-600 font-semibold",
}
const categoryColors: Record<string, string> = {
  "Dairy": "bg-yellow-100 text-yellow-700", "Electronics": "bg-blue-100 text-blue-700",
  "FMCG": "bg-emerald-100 text-emerald-700", "Apparel": "bg-purple-100 text-purple-700",
  "Pharma": "bg-rose-100 text-rose-700", "Beauty": "bg-pink-100 text-pink-700",
  "Furniture": "bg-amber-100 text-amber-700", "Sports": "bg-cyan-100 text-cyan-700",
}
const categories = [...new Set(items.map(i => i.category))]
const models = [...new Set(items.map(i => i.model))]
const avgAccuracy = Math.round(items.reduce((s, i) => s + i.accuracy, 0) / items.length)
const avgConfidence = Math.round(items.reduce((s, i) => s + i.confidence, 0) / items.length)
const misses = items.filter(i => i.status === "Forecast Miss")
const stockRisks = items.filter(i => i.status === "Stock Risk")

type Rec = any
type FV = Record<string, string>
type VT = "forecasts" | "models" | "alerts"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`dfo-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function DemandForecastingPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("forecasts")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: Target, title: "Accuracy", desc: `${avgAccuracy}% avg forecast accuracy`, accent: "text-emerald-500" },
    { icon: Brain, title: "Confidence", desc: `${avgConfidence}% avg model confidence`, accent: "text-indigo-500" },
    { icon: Zap, title: "Misses", desc: `${misses.length} forecast misses this cycle`, accent: "text-red-500" },
  ]

  const alerts = [
    ...misses.map(i => ({ id: i.id, msg: `${i.product}: Accuracy ${i.accuracy}% \u2014 forecast ${i.forecast.toLocaleString()} vs actual ${i.actual.toLocaleString()}`, severity: "critical" as const })),
    ...stockRisks.map(i => ({ id: i.id, msg: `${i.product}: ${i.stockDays}d stock remaining \u2014 safety stock at ${i.safetyStock.toLocaleString()}`, severity: "warning" as const })),
    ...items.filter(i => i.confidence < 70).map(i => ({ id: i.id, msg: `${i.product}: Low confidence ${i.confidence}% \u2014 ${i.model} model`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center"><Brain className="h-4 w-4 text-teal-600" /></div>
            <div><h3 className="text-sm font-bold">Demand Forecasting</h3><p className="text-xs opacity-60">{items.length} SKUs | {models.length} models</p></div>
          </div>
          <div className="flex gap-1">
            {(["forecasts", "models", "alerts"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "forecasts" ? "Forecasts" : v === "models" ? "Models" : "Alerts"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Accuracy", `${avgAccuracy}%`, Target, "bg-teal-50/50")}
          {statCard("Confidence", `${avgConfidence}%`, Brain, "bg-indigo-50/50")}
          {statCard("Misses", `${misses.length} items`, AlertTriangle, "bg-red-50/50")}
          {statCard("Stock Risk", `${stockRisks.length} items`, Clock, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map(c => {
            const active = activeFilters.category === c
            return <span key={c} onClick={() => toggle("category", active ? undefined : c)} className={`dfo-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="dfo-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="dfo-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="dfo-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Forecast Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`dfo-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "forecasts" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isMiss = item.status === "Forecast Miss"
              const isRisk = item.status === "Stock Risk"
              const TIcon = item.trend === "up" ? ArrowUp : ArrowDown
              const accColor = item.accuracy >= 90 ? "text-emerald-500" : item.accuracy >= 75 ? "text-amber-500" : "text-red-500"
              const varPct = (((item.actual - item.forecast) / Math.max(item.forecast, 1)) * 100).toFixed(1)
              return (
                <div key={item.id} className={`dfo-forecast-card rounded-lg border p-2.5 bg-card ${isMiss ? "dfo-critical-pulse" : isRisk ? "dfo-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="dfo-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-100 text-teal-700">{item.id}</span>
                      <span className={`dfo-category-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${categoryColors[item.category] || "bg-slate-100"}`}>{item.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      <TIcon className={`h-3 w-3 ${item.trend === "up" ? "text-emerald-500" : "text-red-500"}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.product}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.dc} | {item.region}</div>
                    <div className="flex items-center gap-1"><BarChart3 className="h-3 w-3 opacity-40" />{item.model} | {item.horizon} horizon</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Updated {item.lastUpdated} | {item.seasonality}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Forecast: <span className="font-bold text-foreground">{item.forecast.toLocaleString()}</span></div>
                    <div>Actual: <span className="font-bold text-foreground">{item.actual.toLocaleString()}</span></div>
                    <div>Variance: <span className={`font-bold ${parseFloat(varPct) > 10 ? "text-red-600" : parseFloat(varPct) > 5 ? "text-amber-600" : "text-emerald-600"}`}>{varPct}%</span></div>
                    <div>Accuracy: <span className={`font-bold ${accColor}`}>{item.accuracy}%</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "models" && (
          <div className="space-y-2">
            {models.map(model => {
              const mItems = items.filter(i => i.model === model)
              const mAcc = Math.round(mItems.reduce((s, i) => s + i.accuracy, 0) / mItems.length)
              const mConf = Math.round(mItems.reduce((s, i) => s + i.confidence, 0) / mItems.length)
              const mMiss = mItems.filter(i => i.status === "Forecast Miss").length
              return (
                <div key={model} className="dfo-model-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><Brain className="h-4 w-4 text-teal-500" /><span className="text-xs font-semibold">{model}</span></div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-blue-600">{mItems.length} SKUs</span>
                      <span className={`font-bold ${mAcc >= 90 ? "text-emerald-600" : "text-amber-600"}`}>{mAcc}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground mb-1">
                    <div>Avg Accuracy: <span className="font-medium text-foreground">{mAcc}%</span></div>
                    <div>Avg Confidence: <span className="font-medium text-foreground">{mConf}%</span></div>
                    <div>Misses: <span className={`font-medium ${mMiss > 0 ? "text-red-600" : "text-emerald-600"}`}>{mMiss}</span></div>
                  </div>
                  <div className="space-y-0.5">
                    {mItems.map(mi => (
                      <div key={mi.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{mi.id}</span>{mi.product.split(" ").slice(0, 3).join(" ")}</span>
                        <span className={statusColors[mi.status] || ""}>{mi.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "alerts" && (
          <div className="space-y-2">
            <div className="dfo-alert-header rounded-lg border p-2 bg-red-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{misses.length}</div><div className="text-[10px] opacity-50">Forecast Misses</div></div>
                <div><div className="text-lg font-bold text-amber-600">{stockRisks.length}</div><div className="text-[10px] opacity-50">Stock Risks</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.confidence < 70).length}</div><div className="text-[10px] opacity-50">Low Confidence</div></div>
                <div><div className="text-lg font-bold text-teal-600">{items.filter(i => i.stockDays < 15).length}</div><div className="text-[10px] opacity-50">Low Stock (&lt;15d)</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.accuracy - b.accuracy).map(item => {
              const varPct = (((item.actual - item.forecast) / Math.max(item.forecast, 1)) * 100).toFixed(1)
              const isLow = item.stockDays < 15
              return (
                <div key={item.id} className="dfo-alert-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.product.split(" ").slice(0, 3).join(" ")}</span>
                      <span className="text-[10px] opacity-50">{item.dc}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-bold ${item.accuracy >= 90 ? "text-emerald-600" : item.accuracy >= 75 ? "text-amber-600" : "text-red-600"}`}>{item.accuracy}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.accuracy >= 90 ? "bg-emerald-500" : item.accuracy >= 75 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.accuracy}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Variance: <span className={`font-medium ${Math.abs(parseFloat(varPct)) > 10 ? "text-red-600" : "text-foreground"}`}>{varPct}%</span></div>
                    <div>Confidence: <span className="font-medium">{item.confidence}%</span></div>
                    <div>Stock: <span className={`font-medium ${isLow ? "text-red-600" : "text-foreground"}`}>{item.stockDays}d</span></div>
                    <div>Safety: <span className="font-medium">{item.safetyStock.toLocaleString()}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
