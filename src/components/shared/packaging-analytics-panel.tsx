"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Package, AlertTriangle, TrendingDown, BarChart3
} from "lucide-react"

const raw = [
  { id: "PKA-01", material: "Corrugated Box 3Ply", category: "Box", sku: "BOX-3P-STD", dimensions: "30x20x15cm", weight: 185, cost: 18.5, damageRate: 0.8, fillRate: 88, recyclable: 95, ecoScore: 88, status: "Optimal", supplier: "PackPro India", hub: "MUM-HUB1", usage: 12500, region: "West" },
  { id: "PKA-02", material: "Shrink Wrap LDPE", category: "Film", sku: "SHR-LD-20", dimensions: "100m roll", weight: 420, cost: 85, damageRate: 2.1, fillRate: 72, recyclable: 25, ecoScore: 32, status: "Eco-Noncompliant", supplier: "PolyWrap Chennai", hub: "MAA-HUB4", usage: 8200, region: "South" },
  { id: "PKA-03", material: "Foam Insert EPE", category: "Insert", sku: "INS-EPE-5", dimensions: "25x15x3cm", weight: 45, cost: 12.8, damageRate: 0.3, fillRate: 95, recyclable: 15, ecoScore: 22, status: "Eco-Noncompliant", supplier: "FoamTech NCR", hub: "DEL-HUB2", usage: 6800, region: "North" },
  { id: "PKA-04", material: "Stretch Film LLDPE", category: "Film", sku: "STR-LL-17", dimensions: "300m roll", weight: 380, cost: 62, damageRate: 1.5, fillRate: 78, recyclable: 30, ecoScore: 38, status: "Excess Cost", supplier: "WrapTech Pune", hub: "PNQ-HUB6", usage: 9400, region: "West" },
  { id: "PKA-05", material: "Kraft Paper Roll", category: "Paper", sku: "PAP-KR-60", dimensions: "60gsm x 1m", weight: 280, cost: 45, damageRate: 2.8, fillRate: 65, recyclable: 100, ecoScore: 92, status: "Under-protected", supplier: "KraftPack Bengaluru", hub: "BLR-HUB3", usage: 5600, region: "South" },
  { id: "PKA-06", material: "Air Column Bag", category: "Cushion", sku: "AIR-COL-20", dimensions: "20x40cm", weight: 12, cost: 8.2, damageRate: 0.5, fillRate: 92, recyclable: 40, ecoScore: 62, status: "Optimal", supplier: "AirCush Hyderabad", hub: "HYD-HUB5", usage: 15200, region: "South" },
  { id: "PKA-07", material: "Bubble Wrap LDPE", category: "Cushion", sku: "BUB-LD-10", dimensions: "10mm bubble", weight: 35, cost: 15.5, damageRate: 0.4, fillRate: 90, recyclable: 20, ecoScore: 28, status: "Over-packaged", supplier: "PolyPack Kolkata", hub: "CCU-HUB7", usage: 7800, region: "East" },
  { id: "PKA-08", material: "Custom Wooden Crate", category: "Crate", sku: "CRT-WD-50", dimensions: "50x40x35cm", weight: 3200, cost: 185, damageRate: 0.1, fillRate: 98, recyclable: 85, ecoScore: 72, status: "Over-packaged", supplier: "WoodCraft Ahmedabad", hub: "AMD-HUB9", usage: 1200, region: "West" },
  { id: "PKA-09", material: "Corrugated Box 5Ply", category: "Box", sku: "BOX-5P-HVY", dimensions: "45x30x25cm", weight: 320, cost: 32, damageRate: 0.6, fillRate: 86, recyclable: 95, ecoScore: 85, status: "Optimal", supplier: "PackPro India", hub: "MUM-HUB1", usage: 8900, region: "West" },
  { id: "PKA-10", material: "Pallet Wrap Bundle", category: "Film", sku: "PLT-WR-450", dimensions: "450mm x 300m", weight: 520, cost: 128, damageRate: 0.9, fillRate: 82, recyclable: 22, ecoScore: 30, status: "Excess Cost", supplier: "WrapTech Pune", hub: "PNQ-HUB6", usage: 4500, region: "West" },
]

interface PKAItem {
  id: string; material: string; category: string; sku: string; dimensions: string
  weight: number; cost: number; damageRate: number; fillRate: number; recyclable: number
  ecoScore: number; status: string; supplier: string; hub: string; usage: number; region: string
}

type Rec = any
const items: PKAItem[] = raw.map((r: Rec) => ({
  id: r.id, material: r.material, category: r.category, sku: r.sku, dimensions: r.dimensions,
  weight: r.weight, cost: r.cost, damageRate: r.damageRate, fillRate: r.fillRate, recyclable: r.recyclable,
  ecoScore: r.ecoScore, status: r.status, supplier: r.supplier, hub: r.hub, usage: r.usage, region: r.region,
}))

const catColors: Record<string, string> = {
  "Box": "bg-amber-100 text-amber-700", "Film": "bg-blue-100 text-blue-700",
  "Insert": "bg-rose-100 text-rose-700", "Paper": "bg-emerald-100 text-emerald-700",
  "Cushion": "bg-violet-100 text-violet-700", "Crate": "bg-orange-100 text-orange-700",
}

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "Over-packaged": "text-amber-600 font-semibold",
  "Under-protected": "text-amber-600 font-semibold", "Excess Cost": "text-red-600 font-semibold",
  "Eco-Noncompliant": "text-red-600 font-semibold",
}

const dmgColor = (v: number) => v >= 2 ? "text-red-600" : v >= 1 ? "text-amber-600" : "text-emerald-600"
const fillColor = (v: number) => v >= 90 ? "text-emerald-600" : v >= 75 ? "text-blue-600" : "text-amber-600"
const ecoColor = (v: number) => v >= 80 ? "text-emerald-600" : v >= 50 ? "text-amber-600" : "text-red-600"
const recycleColor = (v: number) => v >= 80 ? "text-emerald-600" : v >= 40 ? "text-amber-600" : "text-red-600"

const fmtCost = (v: number) => `\u20b9${v.toFixed(v >= 100 ? 0 : 1)}`

const PackagingAnalyticsPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"materials" | "cost" | "sustainability">("materials")
  const filters = [
    { key: "category", label: "Category", options: ["Box", "Film", "Insert", "Paper", "Cushion", "Crate"] },
    { key: "status", label: "Status", options: ["Optimal", "Over-packaged", "Under-protected", "Excess Cost", "Eco-Noncompliant"] },
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

  const totalMats = filtered.length
  const avgEco = totalMats ? Math.round(filtered.reduce((s, r) => s + r.ecoScore, 0) / totalMats) : 0
  const avgDmg = totalMats ? Math.round(filtered.reduce((s, r) => s + r.damageRate, 0) / totalMats * 100) / 100 : 0
  const totalUsage = filtered.reduce((s, r) => s + r.usage, 0)

  const insights = [
    { label: "Materials", value: totalMats, icon: Package, bg: "bg-blue-50" },
    { label: "Avg Eco Score", value: avgEco, icon: BarChart3, bg: "bg-emerald-50" },
    { label: "Avg Damage", value: `${avgDmg}%`, icon: TrendingDown, bg: "bg-violet-50" },
    { label: "Total Usage", value: `${(totalUsage / 1000).toFixed(1)}K`, icon: AlertTriangle, bg: "bg-amber-50" },
  ]

  const isCritical = (r: PKAItem) => r.status === "Eco-Noncompliant" || r.status === "Excess Cost"
  const isWarning = (r: PKAItem) => r.status === "Over-packaged" || r.status === "Under-protected" || r.damageRate >= 2

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
                className={`pka-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["materials", "cost", "sustainability"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "materials" && (
        <div className="pka-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`pka-item-card p-3 rounded-lg border ${isCritical(r) ? "pka-critical" : isWarning(r) ? "pka-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.material}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className="text-xs text-muted-foreground">{r.hub}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>SKU: <span className="font-medium">{r.sku}</span> | {r.dimensions}</div>
                <div>Weight: <span className="font-medium">{r.weight}g</span> | Usage: <span className="font-medium">{r.usage.toLocaleString()}</span></div>
                <div>Damage: <span className={`font-medium ${dmgColor(r.damageRate)}`}>{r.damageRate}%</span> | Fill: <span className={`font-medium ${fillColor(r.fillRate)}`}>{r.fillRate}%</span></div>
                <div>Cost/unit: <span className="font-medium">{fmtCost(r.cost)}</span> | Eco: <span className={`font-medium ${ecoColor(r.ecoScore)}`}>{r.ecoScore}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div>Recyclable: <span className={`font-medium ${recycleColor(r.recyclable)}`}>{r.recyclable}%</span></div>
                <div>Supplier: <span className="font-medium">{r.supplier}</span></div>
                <div>Region: <span className="font-medium">{r.region}</span></div>
              </div>
              {isCritical(r) && <div className="pka-alert-text text-xs mt-2">Material critical — eco score {r.ecoScore}, recyclability {r.recyclable}%, status: {r.status}</div>}
            </div>
          ))}
        </div>
      )}

      {view === "cost" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.cost - a.cost).map(r => (
            <div key={r.id} className="pka-cost-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.material}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${r.cost > 100 ? "text-red-600" : r.cost > 50 ? "text-amber-600" : "text-emerald-600"}`}>{fmtCost(r.cost)}</span>
                  <span className="text-xs text-muted-foreground">per unit</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="pka-cost-bar h-2 rounded-full" style={{ width: `${Math.min(r.cost / 200 * 100, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Monthly: <span className="font-medium">{fmtCost(r.cost * r.usage)}</span></div>
                <div>Usage: <span className="font-medium">{r.usage.toLocaleString()}</span></div>
                <div>Weight: <span className="font-medium">{r.weight}g</span></div>
                <div>Damage: <span className={`font-medium ${dmgColor(r.damageRate)}`}>{r.damageRate}%</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.supplier} | {r.hub} | {r.dimensions}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "sustainability" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => a.ecoScore - b.ecoScore).map(r => (
            <div key={r.id} className="pka-sust-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.material}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${ecoColor(r.ecoScore)}`}>{r.ecoScore}</span>
                  <span className="text-xs text-muted-foreground">Eco Score</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`pka-eco-bar h-2 rounded-full ${r.ecoScore >= 60 ? "" : "pka-eco-low"}`} style={{ width: `${r.ecoScore}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Recyclable: <span className={`font-medium ${recycleColor(r.recyclable)}`}>{r.recyclable}%</span></div>
                <div>Damage: <span className={`font-medium ${dmgColor(r.damageRate)}`}>{r.damageRate}%</span></div>
                <div>Fill Rate: <span className={`font-medium ${fillColor(r.fillRate)}`}>{r.fillRate}%</span></div>
                <div>Weight: <span className="font-medium">{r.weight}g</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.supplier} | {r.hub} | Usage: {r.usage.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { PackagingAnalyticsPanel }
