"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Package, AlertTriangle, TrendingDown, BarChart3
} from "lucide-react"

const raw = [
  { id: "IHM-01", sku: "SKU-10021", product: "Tata Salt 1kg", category: "FMCG", abcClass: "A", xyzClass: "X", zone: "A-12", hub: "MUM-HUB1", onHand: 8500, allocated: 3200, available: 5300, daysOfStock: 42, avgDailyDemand: 125, lastReceived: "25 Jul 2026", lastSold: "02 Aug 2026", turnover: 8.2, deadStockDays: 0, expiry: "None", unitCost: 22, value: 187000, status: "Healthy", supplier: "Tata Consumer" },
  { id: "IHM-02", sku: "SKU-10345", product: "Samsung Galaxy S24", category: "Electronics", abcClass: "A", xyzClass: "Z", zone: "B-04", hub: "DEL-HUB2", onHand: 120, allocated: 85, available: 35, daysOfStock: 8, avgDailyDemand: 15, lastReceived: "28 Jul 2026", lastSold: "02 Aug 2026", turnover: 12.5, deadStockDays: 0, expiry: "None", unitCost: 62999, value: 7559880, status: "Low Stock", supplier: "Samsung India" },
  { id: "IHM-03", sku: "SKU-10489", product: "Whisper Pads Pack", category: "Personal Care", abcClass: "A", xyzClass: "Y", zone: "C-08", hub: "BLR-HUB3", onHand: 15000, allocated: 9500, available: 5500, daysOfStock: 28, avgDailyDemand: 200, lastReceived: "30 Jul 2026", lastSold: "02 Aug 2026", turnover: 6.8, deadStockDays: 0, expiry: "Mar 2028", unitCost: 85, value: 1275000, status: "Healthy", supplier: "P&G India" },
  { id: "IHM-04", sku: "SKU-10512", product: "Bosch Drill Machine", category: "Hardware", abcClass: "B", xyzClass: "Z", zone: "D-02", hub: "MAA-HUB4", onHand: 45, allocated: 12, available: 33, daysOfStock: 165, avgDailyDemand: 0.3, lastReceived: "15 Jan 2026", lastSold: "18 Jul 2026", turnover: 0.8, deadStockDays: 45, expiry: "None", unitCost: 4500, value: 202500, status: "Slow Moving", supplier: "Bosch India" },
  { id: "IHM-05", sku: "SKU-10678", product: "Aashirvaad Atta 5kg", category: "Staples", abcClass: "A", xyzClass: "X", zone: "E-15", hub: "DEL-HUB2", onHand: 0, allocated: 200, available: -200, daysOfStock: 0, avgDailyDemand: 180, lastReceived: "28 Jul 2026", lastSold: "02 Aug 2026", turnover: 15.2, deadStockDays: 0, expiry: "Dec 2026", unitCost: 245, value: 0, status: "Stockout", supplier: "ITC Foods" },
  { id: "IHM-06", sku: "SKU-10723", product: "Dell Monitor 27\"", category: "Electronics", abcClass: "C", xyzClass: "Z", zone: "F-01", hub: "CCU-HUB7", onHand: 8, allocated: 2, available: 6, daysOfStock: 240, avgDailyDemand: 0.03, lastReceived: "10 Nov 2025", lastSold: "22 Jun 2026", turnover: 0.2, deadStockDays: 120, expiry: "None", unitCost: 18500, value: 148000, status: "Dead Stock", supplier: "Dell India" },
  { id: "IHM-07", sku: "SKU-10845", product: "Maggi Noodles 5-Pack", category: "FMCG", abcClass: "A", xyzClass: "X", zone: "G-22", hub: "HYD-HUB5", onHand: 22000, allocated: 14000, available: 8000, daysOfStock: 35, avgDailyDemand: 250, lastReceived: "01 Aug 2026", lastSold: "02 Aug 2026", turnover: 9.5, deadStockDays: 0, expiry: "Jun 2027", unitCost: 55, value: 1210000, status: "Healthy", supplier: "Nestle India" },
  { id: "IHM-08", sku: "SKU-10902", product: "JBL Speaker BT", category: "Electronics", abcClass: "B", xyzClass: "Y", zone: "H-06", hub: "PNQ-HUB6", onHand: 65, allocated: 40, available: 25, daysOfStock: 18, avgDailyDemand: 3.5, lastReceived: "20 Jul 2026", lastSold: "01 Aug 2026", turnover: 4.2, deadStockDays: 0, expiry: "None", unitCost: 2999, value: 194935, status: "Low Stock", supplier: "Harman India" },
  { id: "IHM-09", sku: "SKU-11034", product: "Asian Paints 10L", category: "Paint", abcClass: "B", xyzClass: "Y", zone: "I-03", hub: "MUM-HUB1", onHand: 180, allocated: 95, available: 85, daysOfStock: 55, avgDailyDemand: 3.2, lastReceived: "18 Jul 2026", lastSold: "02 Aug 2026", turnover: 3.5, deadStockDays: 0, expiry: "Nov 2027", unitCost: 3200, value: 576000, status: "Healthy", supplier: "Asian Paints" },
  { id: "IHM-10", sku: "SKU-11156", product: "Philips Trimmer", category: "Personal Care", abcClass: "C", xyzClass: "Z", zone: "J-09", hub: "DEL-HUB2", onHand: 32, allocated: 5, available: 27, daysOfStock: 320, avgDailyDemand: 0.1, lastReceived: "05 Sep 2025", lastSold: "15 May 2026", turnover: 0.1, deadStockDays: 180, expiry: "None", unitCost: 1899, value: 60768, status: "Dead Stock", supplier: "Philips India" },
]

interface IHMItem {
  id: string; sku: string; product: string; category: string; abcClass: string; xyzClass: string
  zone: string; hub: string; onHand: number; allocated: number; available: number
  daysOfStock: number; avgDailyDemand: number; lastReceived: string; lastSold: string
  turnover: number; deadStockDays: number; expiry: string; unitCost: number
  value: number; status: string; supplier: string
}

type Rec = any
const items: IHMItem[] = raw.map((r: Rec) => ({
  id: r.id, sku: r.sku, product: r.product, category: r.category, abcClass: r.abcClass, xyzClass: r.xyzClass,
  zone: r.zone, hub: r.hub, onHand: r.onHand, allocated: r.allocated, available: r.available,
  daysOfStock: r.daysOfStock, avgDailyDemand: r.avgDailyDemand, lastReceived: r.lastReceived, lastSold: r.lastSold,
  turnover: r.turnover, deadStockDays: r.deadStockDays, expiry: r.expiry, unitCost: r.unitCost,
  value: r.value, status: r.status, supplier: r.supplier,
}))

const abcColors: Record<string, string> = {
  "A": "bg-emerald-100 text-emerald-700", "B": "bg-blue-100 text-blue-700", "C": "bg-amber-100 text-amber-700",
}

const statusColors: Record<string, string> = {
  "Healthy": "text-emerald-600 font-semibold", "Low Stock": "text-amber-600 font-semibold",
  "Stockout": "text-red-600 font-semibold", "Dead Stock": "text-red-600 font-semibold", "Slow Moving": "text-orange-600 font-semibold",
}

const dosColor = (v: number) => v >= 30 ? "text-emerald-600" : v >= 14 ? "text-amber-600" : "text-red-600"
const turnoverColor = (v: number) => v >= 6 ? "text-emerald-600" : v >= 3 ? "text-amber-600" : "text-red-600"
const formatINR = (v: number) => v >= 10000000 ? `\u20b9${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `\u20b9${(v / 100000).toFixed(1)}L` : `\u20b9${(v / 1000).toFixed(0)}K`

const InventoryHealthMonitorPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"inventory" | "aging" | "value">("inventory")
  const filters = [
    { key: "abcClass", label: "ABC", options: ["A", "B", "C"] },
    { key: "status", label: "Status", options: ["Healthy", "Low Stock", "Stockout", "Slow Moving", "Dead Stock"] },
    { key: "category", label: "Category", options: ["FMCG", "Electronics", "Staples", "Personal Care", "Hardware", "Paint"] },
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
  const stockouts = filtered.filter(r => r.status === "Stockout").length
  const deadStock = filtered.filter(r => r.deadStockDays >= 90).length
  const totalValue = filtered.reduce((s, r) => s + r.value, 0)

  const insights = [
    { label: "Total SKUs", value: totalSKU, icon: Package, bg: "bg-blue-50" },
    { label: "Stockouts", value: stockouts, icon: AlertTriangle, bg: "bg-red-50" },
    { label: "Dead Stock", value: deadStock, icon: TrendingDown, bg: "bg-amber-50" },
    { label: "Inventory Value", value: formatINR(totalValue), icon: BarChart3, bg: "bg-violet-50" },
  ]

  const isCritical = (r: IHMItem) => r.status === "Stockout" || r.status === "Dead Stock"
  const isWarning = (r: IHMItem) => r.status === "Low Stock" || r.status === "Slow Moving" || r.deadStockDays >= 45

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
                className={`ihm-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["inventory", "aging", "value"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "inventory" && (
        <div className="ihm-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`ihm-item-card p-3 rounded-lg border ${isCritical(r) ? "ihm-critical" : isWarning(r) ? "ihm-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.product}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${abcColors[r.abcClass]}`}>{r.abcClass}{r.xyzClass}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>On Hand: <span className="font-medium">{r.onHand.toLocaleString()}</span> | Alloc: <span className="font-medium">{r.allocated.toLocaleString()}</span></div>
                <div>Available: <span className={`font-medium ${r.available <= 0 ? "text-red-600" : r.available < 100 ? "text-amber-600" : "text-emerald-600"}`}>{r.available.toLocaleString()}</span></div>
                <div>Days of Stock: <span className={`font-medium ${dosColor(r.daysOfStock)}`}>{r.daysOfStock}d</span></div>
                <div>Demand: <span className="font-medium">{r.avgDailyDemand}/day</span> | Turnover: <span className={`font-medium ${turnoverColor(r.turnover)}`}>{r.turnover}x</span></div>
                <div>Value: <span className="font-medium">{formatINR(r.value)}</span></div>
                <div>Zone: <span className="font-medium">{r.zone}</span> | Hub: <span className="font-medium">{r.hub}</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Supplier: {r.supplier} | {r.category}</span>
                <span>Last Sold: {r.lastSold} | Expiry: {r.expiry}</span>
              </div>
              {isCritical(r) && <div className="ihm-alert-text text-xs mt-2">{r.status === "Stockout" ? "Stockout — backorder of {Math.abs(r.available)} units, demand {r.avgDailyDemand}/day" : `Dead Stock — ${r.deadStockDays} days since last sale, value ${formatINR(r.value)}`}</div>}
            </div>
          ))}
        </div>
      )}

      {view === "aging" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.deadStockDays - a.deadStockDays).map(r => (
            <div key={r.id} className="ihm-aging-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.sku}</span>
                  <span className="font-semibold text-sm">{r.product}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${abcColors[r.abcClass]}`}>{r.abcClass}{r.xyzClass}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${r.deadStockDays >= 90 ? "text-red-600" : r.deadStockDays >= 30 ? "text-amber-600" : "text-emerald-600"}`}>{r.deadStockDays}d</span>
                  <span className="text-xs text-muted-foreground">aging</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`ihm-aging-bar h-2 rounded-full ${r.deadStockDays >= 90 ? "ihm-aging-critical" : ""}`} style={{ width: `${Math.min(r.deadStockDays / 365 * 100, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>On Hand: <span className="font-medium">{r.onHand.toLocaleString()}</span></div>
                <div>Turnover: <span className={`font-medium ${turnoverColor(r.turnover)}`}>{r.turnover}x</span></div>
                <div>Last Sold: <span className="font-medium">{r.lastSold}</span></div>
                <div>Value: <span className="font-medium">{formatINR(r.value)}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.hub} | {r.supplier}</span>
                <span className="text-muted-foreground">Expiry: {r.expiry}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "value" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.value - a.value).map(r => (
            <div key={r.id} className="ihm-value-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.product}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${abcColors[r.abcClass]}`}>{r.abcClass}</span>
                </div>
                <span className="text-lg font-bold">{formatINR(r.value)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="ihm-value-bar h-2 rounded-full" style={{ width: `${Math.min(r.onHand / 22000 * 100, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>On Hand: <span className="font-medium">{r.onHand.toLocaleString()}</span></div>
                <div>Unit Cost: <span className="font-medium">{formatINR(r.unitCost)}</span></div>
                <div>Turnover: <span className={`font-medium ${turnoverColor(r.turnover)}`}>{r.turnover}x</span></div>
                <div>DOS: <span className={`font-medium ${dosColor(r.daysOfStock)}`}>{r.daysOfStock}d</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.hub} | {r.category}</span>
                <span className="text-muted-foreground">Supplier: {r.supplier}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { InventoryHealthMonitorPanel }
