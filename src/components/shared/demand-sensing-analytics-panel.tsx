"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Brain, TrendingUp, BarChart3,
  AlertTriangle, CheckCircle, XCircle,
  Activity, Target, Calendar,
  Sun, CloudRain, Flame, ShoppingBag
} from "lucide-react"

const raw = [
  { id: "DSA-01", product: "Premium Basmati Rice 5kg", category: "FMCG", region: "North India", signal: "Festival Surge", accuracy: 92, forecast: 15000, actual: 14200, variance: -5.3, channel: "E-Commerce", weather: "Normal", season: "Diwali", leadTime: 7, stockDays: 22, demand: "High", confidence: 88, status: "Accurate", city: "Delhi", month: "Aug 2026", supplier: "LT Foods" },
  { id: "DSA-02", product: "Cotton T-Shirts (Pack of 3)", category: "Fashion", region: "West India", signal: "Seasonal Drop", accuracy: 78, forecast: 8000, actual: 11200, variance: 40.0, channel: "Omni-Channel", weather: "Heavy Rain", season: "Monsoon", leadTime: 14, stockDays: 8, demand: "Spike", confidence: 62, status: "Missed", city: "Mumbai", month: "Aug 2026", supplier: "Arvind Ltd" },
  { id: "DSA-03", product: "Smartphone Cover (Silicone)", category: "Electronics", region: "South India", signal: "Trend Driven", accuracy: 95, forecast: 22000, actual: 21800, variance: -0.9, channel: "Online", weather: "Normal", season: "Regular", leadTime: 5, stockDays: 30, demand: "Stable", confidence: 94, status: "Accurate", city: "Bengaluru", month: "Aug 2026", supplier: "Nillkin India" },
  { id: "DSA-04", product: " packaged Drinking Water 1L", category: "FMCG", region: "East India", signal: "Weather Spike", accuracy: 65, forecast: 35000, actual: 48000, variance: 37.1, channel: "General Trade", weather: "Heat Wave", season: "Summer", leadTime: 3, stockDays: 5, demand: "Critical", confidence: 48, status: "Critical Miss", city: "Kolkata", month: "Aug 2026", supplier: "Bisleri" },
  { id: "DSA-05", product: "Diwali Gift Hamper", category: "Gifting", region: "Pan India", signal: "Festival Surge", accuracy: 88, forecast: 25000, actual: 23500, variance: -6.0, channel: "Omni-Channel", weather: "Normal", season: "Diwali", leadTime: 21, stockDays: 18, demand: "High", confidence: 85, status: "Accurate", city: "Pune", month: "Aug 2026", supplier: "ITC Gifts" },
  { id: "DSA-06", product: "AC Inverter 1.5 Ton", category: "Appliances", region: "North India", signal: "Seasonal Peak", accuracy: 82, forecast: 5000, actual: 6200, variance: 24.0, channel: "E-Commerce", weather: "Heat Wave", season: "Summer", leadTime: 10, stockDays: 12, demand: "Spike", confidence: 70, status: "Missed", city: "Delhi", month: "Aug 2026", supplier: "Voltas Ltd" },
  { id: "DSA-07", product: "Organic Honey 500g", category: "Health", region: "South India", signal: "Trend Driven", accuracy: 91, forecast: 6000, actual: 5800, variance: -3.3, channel: "D2C", weather: "Normal", season: "Regular", leadTime: 8, stockDays: 35, demand: "Stable", confidence: 89, status: "Accurate", city: "Hyderabad", month: "Aug 2026", supplier: "Dabur India" },
  { id: "DSA-08", product: "School Bag (Grade 1-5)", category: "Education", region: "Pan India", signal: "Seasonal Peak", accuracy: 75, forecast: 18000, actual: 15500, variance: -13.9, channel: "Omni-Channel", weather: "Normal", season: "Back to School", leadTime: 12, stockDays: 28, demand: "Moderate", confidence: 72, status: "Warning", city: "Ahmedabad", month: "Aug 2026", supplier: "Wildcraft" },
  { id: "DSA-09", product: "Rain Jacket (Unisex)", category: "Fashion", region: "West India", signal: "Weather Spike", accuracy: 85, forecast: 12000, actual: 13500, variance: 12.5, channel: "E-Commerce", weather: "Heavy Rain", season: "Monsoon", leadTime: 6, stockDays: 9, demand: "Spike", confidence: 78, status: "Missed", city: "Mumbai", month: "Aug 2026", supplier: "Decathlon India" },
  { id: "DSA-10", product: "Curd 400g (Amul)", category: "Dairy", region: "West India", signal: "Steady State", accuracy: 96, forecast: 50000, actual: 49500, variance: -1.0, channel: "General Trade", weather: "Normal", season: "Regular", leadTime: 2, stockDays: 4, demand: "Stable", confidence: 96, status: "Accurate", city: "Ahmedabad", month: "Aug 2026", supplier: "Amul (GCMMF)" },
]

interface DSAItem {
  id: string; product: string; category: string; region: string; signal: string
  accuracy: number; forecast: number; actual: number; variance: number
  channel: string; weather: string; season: string; leadTime: number
  stockDays: number; demand: string; confidence: number; status: string
  city: string; month: string; supplier: string
}

const items: DSAItem[] = raw.map((r: any) => ({
  id: r.id, product: r.product, category: r.category, region: r.region, signal: r.signal,
  accuracy: r.accuracy, forecast: r.forecast, actual: r.actual, variance: r.variance,
  channel: r.channel, weather: r.weather, season: r.season, leadTime: r.leadTime,
  stockDays: r.stockDays, demand: r.demand, confidence: r.confidence, status: r.status,
  city: r.city, month: r.month, supplier: r.supplier,
}))

const statusColors: Record<string, string> = {
  "Accurate": "text-emerald-600 font-semibold", "Warning": "text-amber-600 font-semibold",
  "Missed": "text-orange-600 font-semibold", "Critical Miss": "text-red-600 font-semibold",
}
const signalColors: Record<string, string> = {
  "Festival Surge": "bg-amber-100 text-amber-700", "Seasonal Drop": "bg-blue-100 text-blue-700",
  "Trend Driven": "bg-purple-100 text-purple-700", "Weather Spike": "bg-cyan-100 text-cyan-700",
  "Seasonal Peak": "bg-orange-100 text-orange-700", "Steady State": "bg-slate-100 text-slate-700",
}
const weatherIcons: Record<string, React.ElementType> = {
  "Normal": Sun, "Heavy Rain": CloudRain, "Heat Wave": Flame,
}
const signals = [...new Set(items.map(i => i.signal))]
const avgAccuracy = Math.round(items.reduce((s, i) => s + i.accuracy, 0) / items.length)
const missedForecasts = items.filter(i => i.status === "Missed" || i.status === "Critical Miss").length
const totalForecast = items.reduce((s, i) => s + i.forecast, 0)
const totalActual = items.reduce((s, i) => s + i.actual, 0)

type Rec = any
type FV = Record<string, string>
type VT = "signals" | "accuracy" | "seasonal"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`dsa-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function DemandSensingAnalyticsPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("signals")

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

  const alerts = [
    ...items.filter(i => i.status === "Critical Miss").map(i => ({ id: i.id, msg: `${i.product}: CRITICAL MISS \u2014 ${Math.abs(i.variance)}% error, ${i.weather}, stock only ${i.stockDays}d`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Missed").map(i => ({ id: i.id, msg: `${i.product}: Forecast missed \u2014 +${i.variance}% vs forecast, ${i.signal}, ${i.channel}`, severity: "warning" as const })),
    ...items.filter(i => i.stockDays < 6).map(i => ({ id: i.id, msg: `${i.product}: Low stock ${i.stockDays}d \u2014 demand ${i.demand}, lead time ${i.leadTime}d`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: TrendingUp, title: "Avg Accuracy", desc: `${avgAccuracy}% | ${items.length - missedForecasts}/${items.length} forecasts on target`, accent: avgAccuracy >= 85 ? "text-emerald-500" : "text-amber-500" },
    { icon: BarChart3, title: "Volume", desc: `Forecast ${(totalForecast / 1000).toFixed(0)}K vs Actual ${(totalActual / 1000).toFixed(0)}K units`, accent: "text-blue-500" },
    { icon: Brain, title: "Signals Active", desc: `${signals.length} demand signals | ${[...new Set(items.map(i => i.season))].length} seasonal patterns`, accent: "text-purple-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center"><Brain className="h-4 w-4 text-purple-600" /></div>
            <div><h3 className="text-sm font-bold">Demand Sensing Analytics</h3><p className="text-xs opacity-60">{items.length} products | {signals.length} signals</p></div>
          </div>
          <div className="flex gap-1">
            {(["signals", "accuracy", "seasonal"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "signals" ? "Signals" : v === "accuracy" ? "Accuracy" : "Seasonal"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Products", items.length.toString(), ShoppingBag, "bg-purple-50/50")}
          {statCard("Accuracy", `${avgAccuracy}%`, Target, "bg-emerald-50/50")}
          {statCard("Missed", `${missedForecasts}/${items.length}`, AlertTriangle, "bg-red-50/50")}
          {statCard("Stock Risk", `${items.filter(i => i.stockDays < 7).length}`, Activity, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {signals.map(s => {
            const active = activeFilters.signal === s
            return <span key={s} onClick={() => toggle("signal", active ? undefined : s)} className={`dsa-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="dsa-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="dsa-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="dsa-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Demand Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`dsa-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "signals" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical Miss"
              const isMissed = item.status === "Missed" || item.status === "Warning"
              const WIcon = weatherIcons[item.weather] || Sun
              return (
                <div key={item.id} className={`dsa-sig-card rounded-lg border p-2.5 bg-card ${isCritical ? "dsa-critical-pulse" : isMissed ? "dsa-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="dsa-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.product}</span>
                      <span className={`dsa-signal-tag text-[10px] px-1.5 py-0.5 rounded ${signalColors[item.signal] || "bg-slate-100"}`}>{item.signal}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Accurate" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><WIcon className="h-3 w-3 opacity-40" />{item.weather} | {item.season}</div>
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3 opacity-40" />{item.city} | {item.supplier}</div>
                    <div className="flex items-center gap-1"><Activity className="h-3 w-3 opacity-40" />Demand: {item.demand} | Stock: {item.stockDays}d</div>
                    <div className="flex items-center gap-1"><Target className="h-3 w-3 opacity-40" />Confidence: {item.confidence}% | Lead: {item.leadTime}d</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Forecast: <span className="font-bold">{item.forecast.toLocaleString()}</span></div>
                    <div>Actual: <span className="font-bold">{item.actual.toLocaleString()}</span></div>
                    <div>Variance: <span className={`font-bold ${Math.abs(item.variance) > 20 ? "text-red-600" : Math.abs(item.variance) > 5 ? "text-amber-600" : "text-emerald-600"}`}>{item.variance > 0 ? "+" : ""}{item.variance}%</span></div>
                    <div>Accuracy: <span className={`font-medium ${item.accuracy >= 90 ? "text-emerald-600" : item.accuracy >= 75 ? "text-amber-600" : "text-red-600"}`}>{item.accuracy}%</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "accuracy" && (
          <div className="space-y-2">
            <div className="dsa-acc-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{avgAccuracy}%</div><div className="text-[10px] opacity-50">Avg Accuracy</div></div>
                <div><div className="text-lg font-bold text-red-600">{missedForecasts}</div><div className="text-[10px] opacity-50">Missed Forecasts</div></div>
                <div><div className="text-lg font-bold text-purple-600">{Math.max(...items.map(i => i.accuracy))}%</div><div className="text-[10px] opacity-50">Best Accuracy</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.min(...items.map(i => i.accuracy))}%</div><div className="text-[10px] opacity-50">Lowest Accuracy</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.accuracy - b.accuracy).map(item => (
              <div key={item.id} className={`dsa-acc-row rounded-lg border p-2 bg-card ${item.accuracy < 70 ? "dsa-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.product}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.accuracy >= 90 ? "text-emerald-600" : item.accuracy >= 75 ? "text-amber-600" : "text-red-600"}`}>{item.accuracy}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.accuracy >= 90 ? "bg-emerald-500" : item.accuracy >= 75 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.accuracy}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Confidence: <span className="font-medium">{item.confidence}%</span></div>
                  <div>Variance: <span className="font-medium">{item.variance > 0 ? "+" : ""}{item.variance}%</span></div>
                  <div>Signal: <span className="font-medium">{item.signal}</span></div>
                  <div>Stock: <span className={`font-medium ${item.stockDays < 7 ? "text-red-600" : "text-foreground"}`}>{item.stockDays}d</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "seasonal" && (
          <div className="space-y-2">
            <div className="dsa-sea-header rounded-lg border p-2 bg-orange-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-orange-600">{[...new Set(items.map(i => i.season))].length}</div><div className="text-[10px] opacity-50">Seasonal Patterns</div></div>
                <div><div className="text-lg font-bold text-purple-600">{[...new Set(items.map(i => i.channel))].length}</div><div className="text-[10px] opacity-50">Sales Channels</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.weather !== "Normal").length}</div><div className="text-[10px] opacity-50">Weather Impacted</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.stockDays >= 15).length}</div><div className="text-[10px] opacity-50">Well Stocked</div></div>
              </div>
            </div>
            {[...new Set(items.map(i => i.season))].map(season => {
              const seaItems = items.filter(i => i.season === season)
              const seaAvgAcc = Math.round(seaItems.reduce((s, i) => s + i.accuracy, 0) / seaItems.length)
              const seaForecast = seaItems.reduce((s, i) => s + i.forecast, 0)
              const seaActual = seaItems.reduce((s, i) => s + i.actual, 0)
              const seaStock = Math.round(seaItems.reduce((s, i) => s + i.stockDays, 0) / seaItems.length)
              return (
                <div key={season} className="dsa-sea-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{season}</span>
                      <span className="text-[10px] text-muted-foreground">{seaItems.length} product(s)</span>
                    </div>
                    <span className={`text-xs font-bold ${seaAvgAcc >= 85 ? "text-emerald-600" : seaAvgAcc >= 75 ? "text-amber-600" : "text-red-600"}`}>{seaAvgAcc}% avg accuracy</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${seaAvgAcc}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Forecast: <span className="font-medium">{seaForecast.toLocaleString()}</span></div>
                    <div>Actual: <span className="font-medium">{seaActual.toLocaleString()}</span></div>
                    <div>Avg Stock: <span className={`font-medium ${seaStock < 10 ? "text-red-600" : "text-foreground"}`}>{seaStock}d</span></div>
                    <div>Channels: <span className="font-medium">{[...seaItems.map(i => i.channel)].join(", ")}</span></div>
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
