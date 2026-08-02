"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  TrendingUp, TrendingDown, BarChart3, AlertTriangle, Target, Activity
} from "lucide-react"

const raw = [
  { id: "DFO-01", sku: "SKU-A1001", product: "Basmati Rice 5kg", category: "Staples", region: "North", hub: "DEL-HUB2", forecast: 2400, actual: 2280, accuracy: 95, bias: -5, mape: 4.2, horizon: "30d", trend: "Stable", safetyStock: 480, reorder: 1200, stock: 1850, supplier: "KRBL Ltd", leadTime: 5, season: "None", confidence: "High" },
  { id: "DFO-02", sku: "SKU-B2045", product: "Premium Olive Oil 500ml", category: "FMCG", region: "West", hub: "MUM-HUB1", forecast: 800, actual: 1120, accuracy: 62, bias: 40, mape: 28.5, horizon: "30d", trend: "Surge", safetyStock: 200, reorder: 400, stock: 120, supplier: "Borges India", leadTime: 14, season: "Festival", confidence: "Low" },
  { id: "DFO-03", sku: "SKU-C3012", product: "Cotton T-Shirt Pack", category: "Apparel", region: "South", hub: "BLR-HUB3", forecast: 1500, actual: 1420, accuracy: 94.7, bias: -5.3, mape: 5.3, horizon: "60d", trend: "Declining", safetyStock: 350, reorder: 750, stock: 2100, supplier: "Arvind Ltd", leadTime: 21, season: "Off-Season", confidence: "Medium" },
  { id: "DFO-04", sku: "SKU-D4088", product: "Bluetooth Speaker Mini", category: "Electronics", region: "West", hub: "PNQ-HUB6", forecast: 600, actual: 580, accuracy: 96.7, bias: -3.3, mape: 3.3, horizon: "30d", trend: "Stable", safetyStock: 150, reorder: 300, stock: 420, supplier: "BoAt India", leadTime: 7, season: "None", confidence: "High" },
  { id: "DFO-05", sku: "SKU-E5023", product: "Organic Honey 500g", category: "FMCG", region: "East", hub: "CCU-HUB7", forecast: 350, actual: 510, accuracy: 48, bias: 45.7, mape: 45.7, horizon: "14d", trend: "Surge", safetyStock: 100, reorder: 175, stock: 25, supplier: "Dabur India", leadTime: 10, season: "Monsoon", confidence: "Critical" },
  { id: "DFO-06", sku: "SKU-F6077", product: "AC Filter 1.5T", category: "Appliance Parts", region: "North", hub: "DEL-HUB2", forecast: 200, actual: 195, accuracy: 97.5, bias: -2.5, mape: 2.5, horizon: "30d", trend: "Stable", safetyStock: 50, reorder: 100, stock: 280, supplier: "Blue Star", leadTime: 3, season: "Summer", confidence: "High" },
  { id: "DFO-07", sku: "SKU-G7091", product: "School Bag Premium", category: "Education", region: "South", hub: "HYD-HUB5", forecast: 1800, actual: 1680, accuracy: 93.3, bias: -6.7, mape: 6.7, horizon: "45d", trend: "Rising", safetyStock: 400, reorder: 900, stock: 650, supplier: "Wildcraft", leadTime: 12, season: "Back to School", confidence: "Medium" },
  { id: "DFO-08", sku: "SKU-H8104", product: "Diwali Gift Hamper", category: "Festive", region: "West", hub: "MUM-HUB1", forecast: 5000, actual: 3200, accuracy: 64, bias: -36, mape: 36, horizon: "14d", trend: "Declining", safetyStock: 800, reorder: 2500, stock: 4500, supplier: "Haldiram\u2019s", leadTime: 8, season: "Diwali", confidence: "Low" },
  { id: "DFO-09", sku: "SKU-I9118", product: "Antibiotic Syrup 60ml", category: "Pharma", region: "North", hub: "JAI-HUB9", forecast: 450, actual: 445, accuracy: 98.9, bias: -1.1, mape: 1.1, horizon: "30d", trend: "Stable", safetyStock: 120, reorder: 225, stock: 380, supplier: "Cipla Ltd", leadTime: 4, season: "Monsoon", confidence: "High" },
  { id: "DFO-10", sku: "SKU-J0125", product: "Tulsi Green Tea 100bag", category: "Beverages", region: "East", hub: "CCU-HUB7", forecast: 2800, actual: 2950, accuracy: 94.6, bias: 5.4, mape: 5.4, horizon: "30d", trend: "Rising", safetyStock: 600, reorder: 1400, stock: 1100, supplier: "Organic India", leadTime: 6, season: "Monsoon", confidence: "Medium" },
]

interface DFOItem {
  id: string; sku: string; product: string; category: string; region: string; hub: string
  forecast: number; actual: number; accuracy: number; bias: number; mape: number
  horizon: string; trend: string; safetyStock: number; reorder: number; stock: number
  supplier: string; leadTime: number; season: string; confidence: string
}

type Rec = any
const items: DFOItem[] = raw.map((r: Rec) => ({
  id: r.id, sku: r.sku, product: r.product, category: r.category, region: r.region, hub: r.hub,
  forecast: r.forecast, actual: r.actual, accuracy: r.accuracy, bias: r.bias, mape: r.mape,
  horizon: r.horizon, trend: r.trend, safetyStock: r.safetyStock, reorder: r.reorder, stock: r.stock,
  supplier: r.supplier, leadTime: r.leadTime, season: r.season, confidence: r.confidence,
}))

const catColors: Record<string, string> = {
  "Staples": "bg-amber-100 text-amber-700", "FMCG": "bg-emerald-100 text-emerald-700",
  "Apparel": "bg-violet-100 text-violet-700", "Electronics": "bg-sky-100 text-sky-700",
  "Appliance Parts": "bg-blue-100 text-blue-700", "Education": "bg-indigo-100 text-indigo-700",
  "Festive": "bg-rose-100 text-rose-700", "Pharma": "bg-cyan-100 text-cyan-700",
  "Beverages": "bg-lime-100 text-lime-700",
}

const trendColors: Record<string, string> = {
  "Stable": "text-emerald-600 font-semibold", "Surge": "text-red-600 font-semibold",
  "Declining": "text-orange-600 font-semibold", "Rising": "text-blue-600 font-semibold",
}

const confColors: Record<string, string> = {
  "High": "bg-emerald-100 text-emerald-700", "Medium": "bg-amber-100 text-amber-700",
  "Low": "bg-orange-100 text-orange-700", "Critical": "bg-red-100 text-red-700",
}

const accPct = (v: number) => v >= 90 ? "text-emerald-600" : v >= 70 ? "text-amber-600" : "text-red-600"
const biasColor = (v: number) => Math.abs(v) <= 10 ? "text-emerald-600" : Math.abs(v) <= 25 ? "text-amber-600" : "text-red-600"
const stockPct = (stock: number, reorder: number) => stock >= reorder ? "text-emerald-600" : stock >= reorder * 0.5 ? "text-amber-600" : "text-red-600"

const DemandForecastingPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"forecasts" | "accuracy" | "inventory">("forecasts")
  const filters = [
    { key: "category", label: "Category", options: ["Staples", "FMCG", "Apparel", "Electronics", "Appliance Parts", "Education", "Festive", "Pharma", "Beverages"] },
    { key: "trend", label: "Trend", options: ["Stable", "Surge", "Declining", "Rising"] },
    { key: "confidence", label: "Confidence", options: ["High", "Medium", "Low", "Critical"] },
    { key: "region", label: "Region", options: ["West", "North", "South", "East"] },
  ]

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n = Object.assign({}, prev)
      if (n[key] === value) { delete n[key] } else { n[key] = value }
      return n
    })
  }

  const filtered = items.filter((r: Rec) =>
    Object.entries(activeFilters).every(([k, v]) => r[k as keyof Rec] === v)
  )

  const totalSKU = filtered.length
  const avgAcc = totalSKU ? Math.round(filtered.reduce((s, r) => s + r.accuracy, 0) / totalSKU * 10) / 10 : 0
  const surgeCount = filtered.filter(r => r.trend === "Surge").length
  const lowStock = filtered.filter(r => r.stock < r.reorder).length

  const insights = [
    { label: "Total SKUs", value: totalSKU, icon: BarChart3, bg: "bg-blue-50" },
    { label: "Avg Accuracy", value: `${avgAcc}%`, icon: Target, bg: "bg-emerald-50" },
    { label: "Surge Alerts", value: surgeCount, icon: TrendingUp, bg: "bg-red-50" },
    { label: "Low Stock", value: lowStock, icon: AlertTriangle, bg: "bg-amber-50" },
  ]

  const isCritical = (r: DFOItem) => r.confidence === "Critical" || r.accuracy < 60
  const isWarning = (r: DFOItem) => r.confidence === "Low" || r.accuracy < 70 || r.stock < r.reorder

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {insights.map(sc => {
          const SIcon = sc.icon as React.ElementType
          return (
            <div key={sc.label} className={`${sc.bg} rounded-lg p-3`}>
              <div className="flex items-center gap-2 mb-1"><SIcon className="w-4 h-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{sc.label}</span></div>
              <div className="text-lg font-bold">{sc.value}</div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <div key={f.key} className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">{f.label}:</span>
            {f.options.map(o => (
              <button key={o} onClick={() => toggleFilter(f.key, o)}
                className={`dfo-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["forecasts", "accuracy", "inventory"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "forecasts" && (
        <div className="dfo-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`dfo-item-card p-3 rounded-lg border ${isCritical(r) ? "dfo-critical" : isWarning(r) ? "dfo-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.product}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${trendColors[r.trend]}`}>{r.trend === "Surge" ? <TrendingUp className="w-3 h-3 inline" /> : r.trend === "Declining" ? <TrendingDown className="w-3 h-3 inline" /> : null} {r.trend}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${confColors[r.confidence]}`}>{r.confidence}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Forecast: <span className="font-medium">{r.forecast.toLocaleString()}</span></div>
                <div>Actual: <span className="font-medium">{r.actual.toLocaleString()}</span></div>
                <div>Accuracy: <span className={`font-medium ${accPct(r.accuracy)}`}>{r.accuracy}%</span></div>
                <div>Bias: <span className={`font-medium ${biasColor(r.bias)}`}>{r.bias > 0 ? "+" : ""}{r.bias}%</span></div>
                <div>MAPE: <span className="font-medium">{r.mape}%</span></div>
                <div>Horizon: <span className="font-medium">{r.horizon}</span></div>
                <div>Hub: <span className="font-medium">{r.hub}</span></div>
                <div>Season: <span className="font-medium">{r.season}</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.supplier} | Lead: {r.leadTime}d</span>
                <span>Stock: <span className={`font-medium ${stockPct(r.stock, r.reorder)}`}>{r.stock}</span> / Reorder: {r.reorder}</span>
              </div>
              {isCritical(r) && <div className="dfo-alert-text text-xs mt-2">Critical forecast failure — accuracy {r.accuracy}%, bias {r.bias > 0 ? "+" : ""}{r.bias}% — model recalibration needed</div>}
              {isWarning(r) && !isCritical(r) && r.stock < r.reorder && <div className="text-amber-600 text-xs mt-2 font-medium">Stock ({r.stock}) below reorder point ({r.reorder})</div>}
            </div>
          ))}
        </div>
      )}

      {view === "accuracy" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => a.accuracy - b.accuracy).map(r => (
            <div key={r.id} className="dfo-acc-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.product}</span>
                </div>
                <span className={`text-lg font-bold ${accPct(r.accuracy)}`}>{r.accuracy}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="dfo-acc-bar h-2 rounded-full" style={{ width: `${r.accuracy}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>MAPE: <span className="font-medium">{r.mape}%</span></div>
                <div>Bias: <span className={`font-medium ${biasColor(r.bias)}`}>{r.bias > 0 ? "+" : ""}{r.bias}%</span></div>
                <div>Horizon: <span className="font-medium">{r.horizon}</span></div>
                <div>Confidence: <span className={`px-1.5 py-0.5 rounded-full ${confColors[r.confidence]}`}>{r.confidence}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                <span className={`text-xs ${trendColors[r.trend]}`}>{r.trend}</span>
                <span className="text-muted-foreground">Forecast: {r.forecast} vs Actual: {r.actual}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "inventory" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => (a.stock / a.reorder) - (b.stock / b.reorder)).map(r => {
            const stockRatio = Math.round(r.stock / r.reorder * 100)
            return (
              <div key={r.id} className="dfo-inv-card p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                    <span className="font-semibold text-sm">{r.product}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${stockPct(r.stock, r.reorder)}`}>{r.stock}</span>
                    <span className="text-muted-foreground">/ {r.reorder}</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="dfo-stock-bar h-2 rounded-full" style={{ width: `${Math.min(stockRatio, 100)}%` }} /></div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>Safety Stock: <span className="font-medium">{r.safetyStock}</span></div>
                  <div>Supplier: <span className="font-medium">{r.supplier}</span></div>
                  <div>Lead Time: <span className="font-medium">{r.leadTime}d</span></div>
                  <div>Accuracy: <span className={`font-medium ${accPct(r.accuracy)}`}>{r.accuracy}%</span></div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className={`px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                  <span className="text-muted-foreground">{r.hub}, {r.region}</span>
                  <span className={`text-xs ${trendColors[r.trend]}`}>{r.trend}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { DemandForecastingPanel }
