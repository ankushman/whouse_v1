"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Package, Box, DollarSign, Recycle,
  Target, Zap, TrendingDown,
  CheckCircle, XCircle, AlertTriangle, Activity, Scale
} from "lucide-react"

const raw = [
  { id: "PKO-01", sku: "iPhone 15 Pro", warehouse: "Mumbai DC1", material: "Corrugated Box", size: "30x20x10cm", weight: 0.85, materialCost: 42, voidFill: 12, sustainability: 72, recyclable: true, recycledContent: 35, damageRate: 0.8, dimensionWeight: 1.2, actualWeight: 0.85, status: "Optimized", city: "Mumbai", category: "Electronics", annualVol: 125000, savings: 18 },
  { id: "PKO-02", sku: "Levi's 501 Jeans", warehouse: "Delhi DC2", material: "Poly Mailer", size: "40x30x8cm", weight: 0.25, materialCost: 12, voidFill: 45, sustainability: 38, recyclable: false, recycledContent: 0, damageRate: 2.1, dimensionWeight: 0.96, actualWeight: 0.25, status: "Overpackaged", city: "Delhi", category: "Fashion", annualVol: 340000, savings: 0 },
  { id: "PKO-03", sku: "Amul Butter 500g", warehouse: "Bengaluru DC3", material: "EPS Foam + Box", size: "25x20x15cm", weight: 0.65, materialCost: 28, voidFill: 28, sustainability: 42, recyclable: false, recycledContent: 0, damageRate: 0.5, dimensionWeight: 0.75, actualWeight: 0.65, status: "At Risk", city: "Bengaluru", category: "Dairy", annualVol: 890000, savings: 5 },
  { id: "PKO-04", sku: "Samsung TV 55 inch", warehouse: "Chennai DC4", material: "Double Wall Box", size: "150x90x20cm", weight: 4.2, materialCost: 185, voidFill: 8, sustainability: 65, recyclable: true, recycledContent: 25, damageRate: 0.3, dimensionWeight: 5.4, actualWeight: 4.2, status: "Optimized", city: "Chennai", category: "Electronics", annualVol: 45000, savings: 22 },
  { id: "PKO-05", sku: "Nykaa Lipstick Set", warehouse: "Hyderabad DC5", material: "Rigid Box + Insert", size: "22x15x5cm", weight: 0.35, materialCost: 55, voidFill: 52, sustainability: 28, recyclable: true, recycledContent: 10, damageRate: 0.1, dimensionWeight: 0.17, actualWeight: 0.35, status: "Overpackaged", city: "Hyderabad", category: "Beauty", annualVol: 210000, savings: 0 },
  { id: "PKO-06", sku: "IKEA Table Lamp", warehouse: "Pune DC6", material: "Flat Pack Box", size: "45x30x25cm", weight: 2.1, materialCost: 38, voidFill: 15, sustainability: 78, recyclable: true, recycledContent: 60, damageRate: 1.2, dimensionWeight: 3.38, actualWeight: 2.1, status: "Optimized", city: "Pune", category: "Furniture", annualVol: 67000, savings: 15 },
  { id: "PKO-07", sku: "Bournvita 1kg", warehouse: "Kolkata DC7", material: "Shrink Wrap + Box", size: "28x18x12cm", weight: 0.55, materialCost: 15, voidFill: 32, sustainability: 45, recyclable: false, recycledContent: 5, damageRate: 0.9, dimensionWeight: 0.61, actualWeight: 0.55, status: "Needs Review", city: "Kolkata", category: "FMCG", annualVol: 520000, savings: 8 },
  { id: "PKO-08", sku: "Prestige Mixer", warehouse: "Ahmedabad DC8", material: "Molded Pulp Tray", size: "38x28x32cm", weight: 1.8, materialCost: 65, voidFill: 18, sustainability: 82, recyclable: true, recycledContent: 70, damageRate: 0.4, dimensionWeight: 3.42, actualWeight: 1.8, status: "Optimized", city: "Ahmedabad", category: "Appliances", annualVol: 92000, savings: 25 },
  { id: "PKO-09", sku: "Puma Running Shoes", warehouse: "Jaipur DC9", material: "Shoe Box", size: "35x22x12cm", weight: 0.45, materialCost: 22, voidFill: 38, sustainability: 55, recyclable: true, recycledContent: 20, damageRate: 0.6, dimensionWeight: 0.93, actualWeight: 0.45, status: "Needs Review", city: "Jaipur", category: "Footwear", annualVol: 185000, savings: 10 },
  { id: "PKO-10", sku: "Dabur Chyawanprash 1kg", warehouse: "Lucknow DC10", material: "Glass Jar + Foam", size: "15x15x20cm", weight: 1.4, materialCost: 48, voidFill: 55, sustainability: 22, recyclable: false, recycledContent: 0, damageRate: 1.8, dimensionWeight: 0.45, actualWeight: 1.4, status: "Critical", city: "Lucknow", category: "Pharma", annualVol: 310000, savings: 0 },
]

interface PKOItem {
  id: string; sku: string; warehouse: string; material: string; size: string
  weight: number; materialCost: number; voidFill: number; sustainability: number
  recyclable: boolean; recycledContent: number; damageRate: number
  dimensionWeight: number; actualWeight: number; status: string
  city: string; category: string; annualVol: number; savings: number
}

const items: PKOItem[] = raw.map((r: any) => ({
  id: r.id, sku: r.sku, warehouse: r.warehouse, material: r.material, size: r.size,
  weight: r.weight, materialCost: r.materialCost, voidFill: r.voidFill,
  sustainability: r.sustainability, recyclable: r.recyclable, recycledContent: r.recycledContent,
  damageRate: r.damageRate, dimensionWeight: r.dimensionWeight, actualWeight: r.actualWeight,
  status: r.status, city: r.city, category: r.category, annualVol: r.annualVol, savings: r.savings,
}))

const statusColors: Record<string, string> = {
  "Optimized": "text-emerald-600 font-semibold", "Overpackaged": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Needs Review": "text-blue-600 font-semibold",
  "Critical": "text-red-600 font-semibold",
}
const matColors: Record<string, string> = {
  "Corrugated Box": "bg-amber-100 text-amber-700", "Poly Mailer": "bg-blue-100 text-blue-700",
  "EPS Foam + Box": "bg-cyan-100 text-cyan-700", "Double Wall Box": "bg-orange-100 text-orange-700",
  "Rigid Box + Insert": "bg-purple-100 text-purple-700", "Flat Pack Box": "bg-green-100 text-green-700",
  "Shrink Wrap + Box": "bg-pink-100 text-pink-700", "Molded Pulp Tray": "bg-lime-100 text-lime-700",
  "Shoe Box": "bg-indigo-100 text-indigo-700", "Glass Jar + Foam": "bg-red-100 text-red-700",
}
const catColors: Record<string, string> = {
  "Electronics": "bg-slate-100 text-slate-700", "Fashion": "bg-pink-100 text-pink-700",
  "Dairy": "bg-blue-100 text-blue-700", "Beauty": "bg-purple-100 text-purple-700",
  "Furniture": "bg-amber-100 text-amber-700", "FMCG": "bg-green-100 text-green-700",
  "Appliances": "bg-orange-100 text-orange-700", "Footwear": "bg-indigo-100 text-indigo-700",
  "Pharma": "bg-red-100 text-red-700",
}
const categories = [...new Set(items.map(i => i.category))]
const totalSavings = items.reduce((s, i) => s + i.savings, 0)
const avgVoidFill = Math.round(items.reduce((s, i) => s + i.voidFill, 0) / items.length)
const avgSustainability = Math.round(items.reduce((s, i) => s + i.sustainability, 0) / items.length)

type Rec = any
type FV = Record<string, string>
type VT = "packages" | "sustainability" | "cost"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`pko-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function PackagingOptimizationPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("packages")

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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.sku}: Critical packaging \u2014 ${i.material}, void fill ${i.voidFill}%, damage ${i.damageRate}%`, severity: "critical" as const })),
    ...items.filter(i => i.voidFill > 40).map(i => ({ id: i.id, msg: `${i.sku}: Excessive void fill at ${i.voidFill}% \u2014 ${i.material}, ${i.size}`, severity: "warning" as const })),
    ...items.filter(i => !i.recyclable && i.annualVol > 200000).map(i => ({ id: i.id, msg: `${i.sku}: Non-recyclable ${i.material} for ${i.annualVol.toLocaleString()} units/year`, severity: "warning" as const })),
    ...items.filter(i => i.damageRate > 1.5).map(i => ({ id: i.id, msg: `${i.sku}: High damage rate ${i.damageRate}% \u2014 ${i.warehouse}, ${i.category}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Recycle, title: "Sustainability", desc: `${avgSustainability}/100 avg eco-score`, accent: "text-emerald-500" },
    { icon: TrendingDown, title: "Void Fill", desc: `${avgVoidFill}% avg \u2014 target &lt;20%`, accent: "text-amber-500" },
    { icon: DollarSign, title: "Savings", desc: `${totalSavings}% material cost reduction potential`, accent: "text-blue-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center"><Package className="h-4 w-4 text-green-600" /></div>
            <div><h3 className="text-sm font-bold">Packaging Optimization</h3><p className="text-xs opacity-60">{items.length} SKUs | {categories.length} categories</p></div>
          </div>
          <div className="flex gap-1">
            {(["packages", "sustainability", "cost"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "packages" ? "Packages" : v === "sustainability" ? "Eco" : "Cost"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("SKUs", items.length.toString(), Box, "bg-green-50/50")}
          {statCard("Optimized", `${items.filter(i => i.status === "Optimized").length}/${items.length}`, CheckCircle, "bg-emerald-50/50")}
          {statCard("Void Fill", `${avgVoidFill}%`, Target, "bg-amber-50/50")}
          {statCard("Savings", `${totalSavings}%`, Zap, "bg-blue-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map(c => {
            const active = activeFilters.category === c
            return <span key={c} onClick={() => toggle("category", active ? undefined : c)} className={`pko-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="pko-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="pko-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="pko-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Packaging Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`pko-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "packages" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "Overpackaged" || item.status === "At Risk"
              const dimWaste = item.dimensionWeight > item.actualWeight
              return (
                <div key={item.id} className={`pko-pkg-card rounded-lg border p-2.5 bg-card ${isCritical ? "pko-critical-pulse" : isWarning ? "pko-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="pko-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-green-100 text-green-700">{item.id}</span>
                      <span className={`pko-cat-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${catColors[item.category] || "bg-slate-100"}`}>{item.category}</span>
                      <span className={`pko-mat-tag text-[10px] px-1.5 py-0.5 rounded ${matColors[item.material] || "bg-slate-100"}`}>{item.material}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Optimized" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.sku} | {item.size}</div>
                    <div className="flex items-center gap-1"><Box className="h-3 w-3 opacity-40" />{item.warehouse} | {item.city}</div>
                    <div className="flex items-center gap-1"><Scale className="h-3 w-3 opacity-40" />Actual: {item.actualWeight}kg | Dim: {item.dimensionWeight}kg</div>
                    <div className="flex items-center gap-1"><Activity className="h-3 w-3 opacity-40" />Vol: {item.annualVol.toLocaleString()}/yr | Damage: {item.damageRate}%</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Void: <span className={`font-bold ${item.voidFill > 40 ? "text-red-600" : item.voidFill > 20 ? "text-amber-600" : "text-emerald-600"}`}>{item.voidFill}%</span></div>
                    <div>Cost: <span className="font-medium">\u20b9{item.materialCost}/unit</span></div>
                    <div>Eco: <span className={`font-bold ${item.sustainability >= 70 ? "text-emerald-600" : item.sustainability >= 40 ? "text-amber-600" : "text-red-600"}`}>{item.sustainability}/100</span></div>
                    <div>Savings: <span className={`font-bold ${item.savings > 0 ? "text-emerald-600" : "text-slate-400"}`}>{item.savings > 0 ? `${item.savings}%` : "N/A"}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "sustainability" && (
          <div className="space-y-2">
            <div className="pko-eco-header rounded-lg border p-2 bg-green-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.recyclable).length}/{items.length}</div><div className="text-[10px] opacity-50">Recyclable</div></div>
                <div><div className="text-lg font-bold text-blue-600">{avgSustainability}/100</div><div className="text-[10px] opacity-50">Avg Eco Score</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.round(items.reduce((s, i) => s + i.recycledContent, 0) / items.length)}%</div><div className="text-[10px] opacity-50">Avg Recycled</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.sustainability < 30).length}</div><div className="text-[10px] opacity-50">Non-Eco</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.sustainability - b.sustainability).map(item => (
              <div key={item.id} className={`pko-eco-row rounded-lg border p-2 bg-card ${item.sustainability < 30 ? "pko-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.sku}</span>
                    <span className={`pko-cat-tag text-[10px] px-1.5 py-0.5 rounded ${catColors[item.category] || "bg-slate-100"}`}>{item.category}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.sustainability >= 70 ? "text-emerald-600" : item.sustainability >= 40 ? "text-amber-600" : "text-red-600"}`}>{item.sustainability}/100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.sustainability >= 70 ? "bg-emerald-500" : item.sustainability >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.sustainability}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Material: <span className="font-medium">{item.material}</span></div>
                  <div>Recyclable: <span className={`font-medium ${item.recyclable ? "text-emerald-600" : "text-red-600"}`}>{item.recyclable ? "Yes" : "No"}</span></div>
                  <div>Recycled: <span className="font-medium">{item.recycledContent}%</span></div>
                  <div>Vol/yr: <span className="font-medium">{item.annualVol.toLocaleString()}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "cost" && (
          <div className="space-y-2">
            <div className="pko-cost-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{formatINR(items.reduce((s, i) => s + i.materialCost * i.annualVol, 0))}</div><div className="text-[10px] opacity-50">Annual Material Cost</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{formatINR(items.reduce((s, i) => s + i.materialCost * i.annualVol * i.savings / 100, 0))}</div><div className="text-[10px] opacity-50">Potential Savings</div></div>
                <div><div className="text-lg font-bold text-amber-600">\u20b9{Math.round(items.reduce((s, i) => s + i.materialCost, 0) / items.length)}</div><div className="text-[10px] opacity-50">Avg Cost/Unit</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.reduce((s, i) => s + i.annualVol, 0).toLocaleString()}</div><div className="text-[10px] opacity-50">Total Volume</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.materialCost * b.annualVol - a.materialCost * a.annualVol).map(item => {
              const annualCost = item.materialCost * item.annualVol
              const savingAmt = annualCost * item.savings / 100
              return (
                <div key={item.id} className="pko-cost-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.sku}</span>
                      <span className="text-[10px] opacity-50">{item.size}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{formatINR(annualCost)}/yr</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.savings > 15 ? "bg-emerald-500" : item.savings > 0 ? "bg-amber-500" : "bg-slate-300"}`} style={{ width: `${Math.min(item.savings * 4, 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Cost: <span className="font-medium">\u20b9{item.materialCost}/unit</span></div>
                    <div>Savings: <span className={`font-medium ${item.savings > 0 ? "text-emerald-600" : "text-slate-400"}`}>{item.savings > 0 ? `${formatINR(savingAmt)}` : "No optimization"}</span></div>
                    <div>Void: <span className={`font-medium ${item.voidFill > 40 ? "text-red-600" : "text-foreground"}`}>{item.voidFill}%</span></div>
                    <div>Volume: <span className="font-medium">{item.annualVol.toLocaleString()}/yr</span></div>
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
