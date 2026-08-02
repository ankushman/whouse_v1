"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  PackageSearch, RotateCcw, AlertTriangle,
  TrendingUp, Clock, MapPin, Timer,
  Calculator, Layers, RefreshCw, PackageCheck
} from "lucide-react"

const raw = [
  { id: "IRP-01", sku: "Parle-G 500g", dc: "Mumbai DC-1", category: "FMCG", vendor: "Parle Products", status: "Auto-Replenished", reorderPoint: 5000, currentStock: 3200, safetyStock: 1500, leadTime: 3, dailyDemand: 450, lastOrder: "25 Jul", nextOrder: "28 Jul", orderQty: 8000, costPerUnit: 22, method: "Min-Max" },
  { id: "IRP-02", sku: "Samsung M14", dc: "Delhi DC-2", category: "Electronics", vendor: "Samsung India", status: "Critical Low", reorderPoint: 800, currentStock: 320, safetyStock: 200, leadTime: 7, dailyDemand: 95, lastOrder: "20 Jul", nextOrder: "26 Jul", orderQty: 2000, costPerUnit: 9500, method: "MRP" },
  { id: "IRP-03", sku: "Amul Butter 500g", dc: "Bengaluru DC-3", category: "Dairy", vendor: "Amul GCMMF", status: "On Track", reorderPoint: 3000, currentStock: 4800, safetyStock: 1000, leadTime: 2, dailyDemand: 380, lastOrder: "24 Jul", nextOrder: "02 Aug", orderQty: 5000, costPerUnit: 270, method: "Reorder Point" },
  { id: "IRP-04", sku: "Nike Air Max", dc: "Hyderabad DC-4", category: "Apparel", vendor: "Nike India", status: "Overstocked", reorderPoint: 200, currentStock: 890, safetyStock: 60, leadTime: 14, dailyDemand: 18, lastOrder: "10 Jul", nextOrder: "—", orderQty: 0, costPerUnit: 7200, method: "JIT" },
  { id: "IRP-05", sku: "Dabur Chyawanprash", dc: "Kolkata DC-5", category: "Ayurveda", vendor: "Dabur India", status: "Auto-Replenished", reorderPoint: 2500, currentStock: 2100, safetyStock: 800, leadTime: 4, dailyDemand: 310, lastOrder: "22 Jul", nextOrder: "29 Jul", orderQty: 4500, costPerUnit: 185, method: "Min-Max" },
  { id: "IRP-06", sku: "boAt Airdopes 141", dc: "Chennai DC-6", category: "Electronics", vendor: "boAt Lifestyle", status: "Critical Low", reorderPoint: 600, currentStock: 180, safetyStock: 150, leadTime: 5, dailyDemand: 72, lastOrder: "18 Jul", nextOrder: "26 Jul", orderQty: 1500, costPerUnit: 1299, method: "MRP" },
  { id: "IRP-07", sku: "Tata Salt 1kg", dc: "Mumbai DC-1", category: "FMCG", vendor: "Tata Consumer", status: "On Track", reorderPoint: 10000, currentStock: 14500, safetyStock: 3000, leadTime: 2, dailyDemand: 1200, lastOrder: "23 Jul", nextOrder: "01 Aug", orderQty: 12000, costPerUnit: 24, method: "Reorder Point" },
  { id: "IRP-08", sku: "Levi's 501 Jeans", dc: "Delhi DC-2", category: "Apparel", vendor: "Levi Strauss India", status: "Pending Approval", reorderPoint: 150, currentStock: 95, safetyStock: 40, leadTime: 12, dailyDemand: 12, lastOrder: "05 Jul", nextOrder: "Awaiting", orderQty: 300, costPerUnit: 3299, method: "JIT" },
  { id: "IRP-09", sku: "IKEA KALLAX Shelf", dc: "Bengaluru DC-3", category: "Furniture", vendor: "IKEA India", status: "On Track", reorderPoint: 80, currentStock: 130, safetyStock: 25, leadTime: 21, dailyDemand: 4, lastOrder: "01 Jul", nextOrder: "15 Aug", orderQty: 100, costPerUnit: 5990, method: "MRP" },
  { id: "IRP-10", sku: "Noise ColorFit Pro", dc: "Hyderabad DC-4", category: "Electronics", vendor: "Noise India", status: "Auto-Replenished", reorderPoint: 400, currentStock: 280, safetyStock: 120, leadTime: 4, dailyDemand: 55, lastOrder: "21 Jul", nextOrder: "27 Jul", orderQty: 900, costPerUnit: 2499, method: "Min-Max" },
]

interface ReplenItem {
  id: string; sku: string; dc: string; category: string; vendor: string; status: string
  reorderPoint: number; currentStock: number; safetyStock: number; leadTime: number
  dailyDemand: number; lastOrder: string; nextOrder: string; orderQty: number
  costPerUnit: number; method: string
}

const items: ReplenItem[] = raw.map((r: any) => ({
  id: r.id, sku: r.sku, dc: r.dc, category: r.category, vendor: r.vendor, status: r.status,
  reorderPoint: r.reorderPoint, currentStock: r.currentStock, safetyStock: r.safetyStock,
  leadTime: r.leadTime, dailyDemand: r.dailyDemand, lastOrder: r.lastOrder,
  nextOrder: r.nextOrder, orderQty: r.orderQty, costPerUnit: r.costPerUnit, method: r.method,
}))

const statusColors: Record<string, string> = {
  "Auto-Replenished": "text-emerald-600", "Critical Low": "text-red-600 font-semibold",
  "On Track": "text-blue-600", "Overstocked": "text-amber-600", "Pending Approval": "text-orange-600",
}

const categories = [...new Set(items.map(i => i.category))]
const methods = [...new Set(items.map(i => i.method))]
const dcs = [...new Set(items.map(i => i.dc))]

type Rec = any
type FV = Record<string, string>
type VT = "sku" | "category" | "method"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`irp-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function InventoryReplenishmentPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("sku")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const criticalCount = items.filter(i => i.status === "Critical Low").length
  const autoCount = items.filter(i => i.status === "Auto-Replenished").length
  const totalOrderValue = items.reduce((s, i) => s + i.orderQty * i.costPerUnit, 0)
  const avgLeadTime = (items.reduce((s, i) => s + i.leadTime, 0) / items.length).toFixed(1)
  const stockoutRisk = items.filter(i => i.currentStock <= i.safetyStock).length

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const overstockedItems = items.filter(i => i.status === "Overstocked")
  const pendingItems = items.filter(i => i.status === "Pending Approval")
  const lowCoverItems = items.filter(i => { const cover = i.currentStock / i.dailyDemand; return cover < 7 })

  const insights = [
    { icon: AlertTriangle, title: "Stockout Risk", desc: `${stockoutRisk} SKUs below safety stock level`, accent: "text-red-500" },
    { icon: PackageCheck, title: "Auto-Replen", desc: `${autoCount} SKUs on automated replenishment`, accent: "text-emerald-500" },
    { icon: TrendingUp, title: "Order Value", desc: `\u20b9${(totalOrderValue / 100000).toFixed(1)}L pending orders`, accent: "text-blue-500" },
  ]

  const alerts = [
    ...(items.filter(i => i.currentStock <= i.safetyStock).map(i => ({ id: i.id, msg: `${i.sku} stock below safety level (${i.currentStock}/${i.safetyStock})`, severity: "critical" as const }))),
    ...(lowCoverItems.map(i => ({ id: i.id, msg: `${i.sku} has only ${Math.floor(i.currentStock / i.dailyDemand)}d cover remaining`, severity: "warning" as const }))),
    ...(pendingItems.map(i => ({ id: i.id, msg: `${i.sku} PO awaiting approval — ${i.orderQty.toLocaleString()} units`, severity: "info" as const }))),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center"><RotateCcw className="h-4 w-4 text-emerald-600" /></div>
            <div><h3 className="text-sm font-bold">Inventory Replenishment</h3><p className="text-xs opacity-60">{items.length} SKUs across {dcs.length} DCs</p></div>
          </div>
          <div className="flex gap-1">
            {(["sku", "category", "method"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "sku" ? "SKUs" : v === "category" ? "Category" : "Method"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Total SKUs", String(items.length), PackageSearch, "bg-blue-50/50")}
          {statCard("Critical", String(criticalCount), AlertTriangle, "bg-red-50/50")}
          {statCard("Avg Lead (days)", avgLeadTime, Clock, "bg-amber-50/50")}
          {statCard("Auto-Replen", String(autoCount), RefreshCw, "bg-emerald-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map(c => {
            const active = activeFilters.category === c
            return <span key={c} onClick={() => toggle("category", active ? undefined : c)} className={`irp-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {activeFilters.category && <span onClick={() => toggle("category", undefined)} className="irp-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">✕</span>}
        </div>

        <div className="irp-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="irp-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Active Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`irp-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "sku" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const stockPct = Math.min(100, (item.currentStock / (item.reorderPoint + item.safetyStock)) * 100)
              const coverDays = Math.floor(item.currentStock / item.dailyDemand)
              const isCritical = item.status === "Critical Low"
              const isPending = item.status === "Pending Approval"
              return (
                <div key={item.id} className={`irp-sku-card rounded-lg border p-2.5 bg-card ${isCritical ? "irp-critical-pulse" : isPending ? "irp-pending-blink" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="irp-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">{item.id}</span>
                      <div><span className="text-xs font-semibold">{item.sku}</span><span className="text-[10px] opacity-50 ml-1.5">{item.dc}</span></div>
                    </div>
                    <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.vendor}</div>
                    <div className="flex items-center gap-1"><Calculator className="h-3 w-3 opacity-40" />{item.method}</div>
                    <div className="flex items-center gap-1"><Layers className="h-3 w-3 opacity-40" />ROP: {item.reorderPoint.toLocaleString()}</div>
                    <div className="flex items-center gap-1"><Timer className="h-3 w-3 opacity-40" />Lead: {item.leadTime}d</div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-16">Stock</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${isCritical ? "bg-red-500 irp-bar-pulse" : stockPct > 80 ? "bg-emerald-500" : stockPct > 50 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${stockPct}%` }} /></div>
                    <span className="text-[10px] font-mono w-14 text-right">{item.currentStock.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
                    <div>Safety: <span className="font-medium text-foreground">{item.safetyStock.toLocaleString()}</span></div>
                    <div>Cover: <span className="font-medium text-foreground">{coverDays}d</span></div>
                    <div>Demand: <span className="font-medium text-foreground">{item.dailyDemand}/d</span></div>
                    <div>Order: <span className={`font-medium ${item.orderQty > 0 ? "text-foreground" : "text-muted-foreground/50"}`}>{item.orderQty > 0 ? item.orderQty.toLocaleString() : "—"}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "category" && (
          <div className="space-y-2">
            {categories.map(cat => {
              const catItems = items.filter(i => i.category === cat)
              const avgAcc = catItems.reduce((s, i) => Math.max(0, (i.currentStock / (i.reorderPoint + i.safetyStock)) * 100), 0) / catItems.length
              const totalCost = catItems.reduce((s, i) => s + i.orderQty * i.costPerUnit, 0)
              const catCritical = catItems.filter(i => i.status === "Critical Low").length
              return (
                <div key={cat} className="irp-cat-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="irp-cat-dot h-2 w-2 rounded-full" style={{ backgroundColor: avgAcc > 80 ? "#10b981" : avgAcc > 50 ? "#f59e0b" : "#ef4444" }} />
                      <span className="text-xs font-semibold">{cat}</span>
                      <span className="text-[10px] opacity-50">({catItems.length} SKUs)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono">\u20b9{(totalCost / 100000).toFixed(1)}L</span>
                      {catCritical > 0 && <span className="irp-cat-critical text-[10px] text-red-500 font-semibold">{catCritical} critical</span>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    {catItems.map(ci => (
                      <div key={ci.id} className="flex items-center gap-2 text-[10px]">
                        <span className="w-10 font-mono opacity-50">{ci.id}</span>
                        <span className="flex-1 truncate">{ci.sku}</span>
                        <span className={statusColors[ci.status] || ""}>{ci.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-muted-foreground">Avg Stock Level</span>
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, avgAcc)}%` }} /></div>
                    <span className="text-[10px] font-mono">{avgAcc.toFixed(0)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "method" && (
          <div className="space-y-2">
            {methods.map(meth => {
              const methItems = items.filter(i => i.method === meth)
              const avgLead = methItems.reduce((s, i) => s + i.leadTime, 0) / methItems.length
              const autoRate = methItems.filter(i => i.status === "Auto-Replenished").length / methItems.length
              return (
                <div key={meth} className="irp-method-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold">{meth}</span>
                    <span className="text-[10px] opacity-50">{methItems.length} SKUs</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] mb-1.5">
                    <div className="irp-method-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{avgLead.toFixed(1)}d</div><div className="opacity-50">Avg Lead</div></div>
                    <div className="irp-method-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{(autoRate * 100).toFixed(0)}%</div><div className="opacity-50">Auto Rate</div></div>
                    <div className="irp-method-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{methItems.reduce((s, i) => s + i.orderQty, 0).toLocaleString()}</div><div className="opacity-50">Total Qty</div></div>
                  </div>
                  <div className="space-y-0.5">
                    {methItems.map(mi => (
                      <div key={mi.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{mi.id}</span>{mi.sku}</span>
                        <span className="font-mono">\u20b9{(mi.costPerUnit * mi.orderQty).toLocaleString()}</span>
                      </div>
                    ))}
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
