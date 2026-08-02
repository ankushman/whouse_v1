"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  IndianRupee, TrendingDown, BarChart3,
  Target, AlertTriangle, CheckCircle, XCircle, DollarSign,
  Truck, MapPin, Package, Route
} from "lucide-react"

const raw = [
  { id: "LCI-01", route: "Mumbai-Delhi NH8", mode: "Road", carrier: "Rivigo", distance: 1420, cost: 85000, fuel: 32000, toll: 8500, labor: 18000, gst: 12750, total: 156250, budget: 160000, variance: -2.3, perKm: 110, packages: 2400, costPerPkg: 65, status: "Under Budget", city: "Mumbai", warehouse: "Mumbai DC1", month: "Jul 2026" },
  { id: "LCI-02", route: "Delhi-Bengaluru NH44", mode: "Road", carrier: "TCI Express", distance: 2480, cost: 165000, fuel: 62000, toll: 18500, labor: 35000, gst: 24750, total: 305250, budget: 280000, variance: 9.0, perKm: 123, packages: 3200, costPerPkg: 95, status: "Over Budget", city: "Delhi", warehouse: "Delhi DC2", month: "Jul 2026" },
  { id: "LCI-03", route: "Chennai-Kolkata NH16", mode: "Road", carrier: "SafeExpress", distance: 1660, cost: 98000, fuel: 38000, toll: 12000, labor: 22000, gst: 14700, total: 184700, budget: 190000, variance: -2.8, perKm: 111, packages: 1800, costPerPkg: 103, status: "Under Budget", city: "Chennai", warehouse: "Chennai DC4", month: "Jul 2026" },
  { id: "LCI-04", route: "Mumbai-Chennai Sea", mode: "Sea", carrier: "Maersk India", distance: 1380, cost: 42000, fuel: 18000, toll: 0, labor: 8500, gst: 6300, total: 74800, budget: 80000, variance: -6.5, perKm: 54, packages: 8000, costPerPkg: 9, status: "Under Budget", city: "Mumbai", warehouse: "Mumbai DC1", month: "Jul 2026" },
  { id: "LCI-05", route: "Delhi-Hyderabad Rail", mode: "Rail", carrier: "Container Corp", distance: 1640, cost: 55000, fuel: 0, toll: 0, labor: 12000, gst: 8250, total: 75250, budget: 70000, variance: 7.5, perKm: 46, packages: 5500, costPerPkg: 14, status: "Over Budget", city: "Delhi", warehouse: "Delhi DC2", month: "Jul 2026" },
  { id: "LCI-06", route: "Bengaluru-Pune NH48", mode: "Road", carrier: "Delhivery", distance: 840, cost: 48000, fuel: 18000, toll: 5200, labor: 12000, gst: 7200, total: 90400, budget: 95000, variance: -4.8, perKm: 108, packages: 1600, costPerPkg: 57, status: "Under Budget", city: "Bengaluru", warehouse: "Bengaluru DC3", month: "Jul 2026" },
  { id: "LCI-07", route: "Kolkata-Guwahati NH27", mode: "Road", carrier: "Safexpress", distance: 1080, cost: 72000, fuel: 28000, toll: 4500, labor: 15000, gst: 10800, total: 130300, budget: 110000, variance: 18.5, perKm: 121, packages: 900, costPerPkg: 145, status: "Critical", city: "Kolkata", warehouse: "Kolkata DC7", month: "Jul 2026" },
  { id: "LCI-08", route: "Ahmedabad-Jaipur NH48", mode: "Road", carrier: "Shadowfax", distance: 680, cost: 38000, fuel: 15000, toll: 3800, labor: 9500, gst: 5700, total: 72000, budget: 75000, variance: -4.0, perKm: 106, packages: 1200, costPerPkg: 60, status: "Under Budget", city: "Ahmedabad", warehouse: "Ahmedabad DC8", month: "Jul 2026" },
  { id: "LCI-09", route: "Hyderabad-Mumbai Air", mode: "Air", carrier: "BlueDart Aviation", distance: 620, cost: 185000, fuel: 95000, toll: 0, labor: 22000, gst: 27750, total: 329750, budget: 340000, variance: -3.0, perKm: 532, packages: 400, costPerPkg: 824, status: "Under Budget", city: "Hyderabad", warehouse: "Hyderabad DC5", month: "Jul 2026" },
  { id: "LCI-10", route: "Pune-Lucknow NH44", mode: "Road", carrier: "Ecom Express", distance: 1340, cost: 78000, fuel: 30000, toll: 9500, labor: 18500, gst: 11700, total: 147700, budget: 130000, variance: 13.6, perKm: 110, packages: 1100, costPerPkg: 134, status: "Over Budget", city: "Pune", warehouse: "Pune DC6", month: "Jul 2026" },
]

interface LCIItem {
  id: string; route: string; mode: string; carrier: string; distance: number
  cost: number; fuel: number; toll: number; labor: number; gst: number
  total: number; budget: number; variance: number; perKm: number
  packages: number; costPerPkg: number; status: string
  city: string; warehouse: string; month: string
}

const items: LCIItem[] = raw.map((r: any) => ({
  id: r.id, route: r.route, mode: r.mode, carrier: r.carrier, distance: r.distance,
  cost: r.cost, fuel: r.fuel, toll: r.toll, labor: r.labor, gst: r.gst,
  total: r.total, budget: r.budget, variance: r.variance, perKm: r.perKm,
  packages: r.packages, costPerPkg: r.costPerPkg, status: r.status,
  city: r.city, warehouse: r.warehouse, month: r.month,
}))

const statusColors: Record<string, string> = {
  "Under Budget": "text-emerald-600 font-semibold", "Over Budget": "text-amber-600 font-semibold",
  "Critical": "text-red-600 font-semibold",
}
const modeColors: Record<string, string> = {
  "Road": "bg-blue-100 text-blue-700", "Sea": "bg-cyan-100 text-cyan-700",
  "Rail": "bg-purple-100 text-purple-700", "Air": "bg-indigo-100 text-indigo-700",
}
const modes = [...new Set(items.map(i => i.mode))]
const totalCost = items.reduce((s, i) => s + i.total, 0)
const totalBudget = items.reduce((s, i) => s + i.budget, 0)
const overBudget = items.filter(i => i.variance > 5).length

type Rec = any
type FV = Record<string, string>
type VT = "routes" | "breakdown" | "variance"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`lci-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function LogisticsCostIntelligencePanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("routes")

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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.route}: CRITICAL +${i.variance}% overspend \u2014 budget ${formatINR(i.budget)}, actual ${formatINR(i.total)}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Over Budget").map(i => ({ id: i.id, msg: `${i.route}: Over budget +${i.variance}% \u2014 ${i.mode}, ${i.carrier}`, severity: "warning" as const })),
    ...items.filter(i => i.costPerPkg > 200).map(i => ({ id: i.id, msg: `${i.route}: High per-pkg cost \u20b9${i.costPerPkg} \u2014 ${i.mode}, ${i.packages} packages`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: TrendingDown, title: "Total Cost", desc: `${formatINR(totalCost)} vs ${formatINR(totalBudget)} budget`, accent: "text-blue-500" },
    { icon: Target, title: "Variance", desc: `${((totalCost / totalBudget - 1) * 100).toFixed(1)}% net vs budget`, accent: totalCost > totalBudget ? "text-red-500" : "text-emerald-500" },
    { icon: BarChart3, title: "Avg Cost/km", desc: `\u20b9${Math.round(items.reduce((s, i) => s + i.perKm, 0) / items.length)}/km avg across routes`, accent: "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"><IndianRupee className="h-4 w-4 text-blue-600" /></div>
            <div><h3 className="text-sm font-bold">Logistics Cost Intelligence</h3><p className="text-xs opacity-60">{items.length} routes | {modes.length} modes</p></div>
          </div>
          <div className="flex gap-1">
            {(["routes", "breakdown", "variance"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "routes" ? "Routes" : v === "breakdown" ? "Breakdown" : "Variance"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Routes", items.length.toString(), Route, "bg-blue-50/50")}
          {statCard("Total Cost", formatINR(totalCost), DollarSign, "bg-amber-50/50")}
          {statCard("Budget", formatINR(totalBudget), Target, "bg-emerald-50/50")}
          {statCard("Over Budget", `${overBudget}/${items.length}`, AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {modes.map(m => {
            const active = activeFilters.mode === m
            return <span key={m} onClick={() => toggle("mode", active ? undefined : m)} className={`lci-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{m}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="lci-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="lci-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="lci-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Cost Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`lci-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "routes" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "Over Budget"
              return (
                <div key={item.id} className={`lci-route-card rounded-lg border p-2.5 bg-card ${isCritical ? "lci-critical-pulse" : isWarning ? "lci-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="lci-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.route}</span>
                      <span className={`lci-mode-tag text-[10px] px-1.5 py-0.5 rounded ${modeColors[item.mode] || "bg-slate-100"}`}>{item.mode}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Under Budget" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 opacity-40" />{item.carrier} | {item.warehouse}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.city} | {item.month}</div>
                    <div className="flex items-center gap-1"><Route className="h-3 w-3 opacity-40" />{item.distance}km | \u20b9{item.perKm}/km</div>
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.packages.toLocaleString()} pkgs | \u20b9{item.costPerPkg}/pkg</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Total: <span className="font-bold">{formatINR(item.total)}</span></div>
                    <div>Budget: <span className="font-medium">{formatINR(item.budget)}</span></div>
                    <div>Variance: <span className={`font-bold ${item.variance > 5 ? "text-red-600" : item.variance > 0 ? "text-amber-600" : "text-emerald-600"}`}>{item.variance > 0 ? "+" : ""}{item.variance}%</span></div>
                    <div>GST: <span className="font-medium">{formatINR(item.gst)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "breakdown" && (
          <div className="space-y-2">
            <div className="lci-bd-header rounded-lg border p-2 bg-amber-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-amber-600">{formatINR(items.reduce((s, i) => s + i.fuel, 0))}</div><div className="text-[10px] opacity-50">Total Fuel</div></div>
                <div><div className="text-lg font-bold text-blue-600">{formatINR(items.reduce((s, i) => s + i.labor, 0))}</div><div className="text-[10px] opacity-50">Total Labor</div></div>
                <div><div className="text-lg font-bold text-purple-600">{formatINR(items.reduce((s, i) => s + i.toll, 0))}</div><div className="text-[10px] opacity-50">Total Toll</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{formatINR(items.reduce((s, i) => s + i.gst, 0))}</div><div className="text-[10px] opacity-50">Total GST</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.total - a.total).map(item => {
              const fuelPct = Math.round(item.fuel / Math.max(item.total, 1) * 100)
              const laborPct = Math.round(item.labor / Math.max(item.total, 1) * 100)
              const tollPct = Math.round(item.toll / Math.max(item.total, 1) * 100)
              return (
                <div key={item.id} className="lci-bd-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.route}</span>
                      <span className={`lci-mode-tag text-[10px] px-1.5 py-0.5 rounded ${modeColors[item.mode] || "bg-slate-100"}`}>{item.mode}</span>
                    </div>
                    <span className="text-xs font-bold">{formatINR(item.total)}</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden mb-1">
                    <div className="bg-amber-500" style={{ width: `${fuelPct}%` }} />
                    <div className="bg-blue-500" style={{ width: `${laborPct}%` }} />
                    <div className="bg-purple-500" style={{ width: `${tollPct}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Fuel: <span className="font-medium">{formatINR(item.fuel)} ({fuelPct}%)</span></div>
                    <div>Labor: <span className="font-medium">{formatINR(item.labor)} ({laborPct}%)</span></div>
                    <div>Toll: <span className="font-medium">{formatINR(item.toll)} ({tollPct}%)</span></div>
                    <div>GST: <span className="font-medium">{formatINR(item.gst)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "variance" && (
          <div className="space-y-2">
            <div className="lci-var-header rounded-lg border p-2 bg-red-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{overBudget}</div><div className="text-[10px] opacity-50">Over Budget</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.status === "Under Budget").length}</div><div className="text-[10px] opacity-50">Under Budget</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.max(...items.map(i => Math.abs(i.variance))).toFixed(1)}%</div><div className="text-[10px] opacity-50">Max Variance</div></div>
                <div><div className="text-lg font-bold text-blue-600">{formatINR(items.reduce((s, i) => s + Math.abs(i.total - i.budget), 0))}</div><div className="text-[10px] opacity-50">Total Deviation</div></div>
              </div>
            </div>
            {items.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance)).map(item => {
              const deviation = item.total - item.budget
              return (
                <div key={item.id} className={`lci-var-row rounded-lg border p-2 bg-card ${item.variance > 10 ? "lci-critical-pulse" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.route}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">Budget: {formatINR(item.budget)}</span>
                      <span className={`text-xs font-bold ${item.variance > 5 ? "text-red-600" : item.variance > 0 ? "text-amber-600" : "text-emerald-600"}`}>{item.variance > 0 ? "+" : ""}{item.variance}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.variance > 10 ? "bg-red-500" : item.variance > 5 ? "bg-amber-500" : item.variance < 0 ? "bg-emerald-500" : "bg-amber-400"}`} style={{ width: `${Math.min(Math.abs(item.variance) * 4, 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Actual: <span className="font-medium">{formatINR(item.total)}</span></div>
                    <div>Deviation: <span className={`font-medium ${deviation > 0 ? "text-red-600" : "text-emerald-600"}`}>{deviation > 0 ? "+" : ""}{formatINR(deviation)}</span></div>
                    <div>Cost/km: <span className="font-medium">\u20b9{item.perKm}</span></div>
                    <div>Carrier: <span className="font-medium">{item.carrier}</span></div>
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
