"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Zap, Thermometer, Sun,
  TrendingUp, AlertTriangle,
  BarChart3, IndianRupee, Leaf
} from "lucide-react"

const raw = [
  { id: "WEA-01", dc: "Mumbai DC-1", zone: "A-Receiving", source: "Grid", consumption: 4850, budget: 5200, solar: 1200, hvac: 2100, lighting: 850, equipment: 1900, cost: 38800, co2: 2425, status: "Normal", efficiency: 87, peakLoad: 620, temp: 28, alert: false },
  { id: "WEA-02", dc: "Delhi DC-2", zone: "B-Pick Pack", source: "Grid+Solar", consumption: 6200, budget: 5800, solar: 2400, hvac: 3100, lighting: 1200, equipment: 1900, cost: 55800, co2: 3100, status: "Over Budget", efficiency: 72, peakLoad: 780, temp: 35, alert: true },
  { id: "WEA-03", dc: "Bengaluru DC-3", zone: "C-Storage", source: "Solar", consumption: 3200, budget: 4000, solar: 3800, hvac: 800, lighting: 600, equipment: 1800, cost: 12800, co2: 960, status: "Optimal", efficiency: 94, peakLoad: 410, temp: 24, alert: false },
  { id: "WEA-04", dc: "Kolkata DC-5", zone: "D-Shipping", source: "Grid", consumption: 5100, budget: 5000, solar: 600, hvac: 2800, lighting: 900, equipment: 1400, cost: 45900, co2: 3060, status: "Over Budget", efficiency: 68, peakLoad: 650, temp: 33, alert: true },
  { id: "WEA-05", dc: "Chennai DC-6", zone: "A-Receiving", source: "Grid+Solar", consumption: 4300, budget: 4800, solar: 1800, hvac: 1900, lighting: 800, equipment: 1600, cost: 30100, co2: 1720, status: "Normal", efficiency: 89, peakLoad: 540, temp: 31, alert: false },
  { id: "WEA-06", dc: "Hyderabad DC-4", zone: "E-Cold Chain", source: "Grid", consumption: 7800, budget: 7500, solar: 400, hvac: 5200, lighting: 600, equipment: 2000, cost: 70200, co2: 4680, status: "Critical", efficiency: 58, peakLoad: 920, temp: 2, alert: true },
  { id: "WEA-07", dc: "Mumbai DC-1", zone: "F-VAS Area", source: "Grid", consumption: 2800, budget: 3000, solar: 900, hvac: 1000, lighting: 500, equipment: 1300, cost: 22400, co2: 1400, status: "Normal", efficiency: 91, peakLoad: 360, temp: 27, alert: false },
  { id: "WEA-08", dc: "Delhi DC-2", zone: "C-Storage", source: "Grid+Solar", consumption: 3900, budget: 4200, solar: 2100, hvac: 1200, lighting: 700, equipment: 2000, cost: 23400, co2: 1170, status: "Normal", efficiency: 85, peakLoad: 490, temp: 26, alert: false },
  { id: "WEA-09", dc: "Bengaluru DC-3", zone: "B-Pick Pack", source: "Solar", consumption: 2600, budget: 3500, solar: 3200, hvac: 600, lighting: 500, equipment: 1500, cost: 10400, co2: 520, status: "Optimal", efficiency: 96, peakLoad: 330, temp: 23, alert: false },
  { id: "WEA-10", dc: "Kolkata DC-5", zone: "E-Cold Chain", source: "Grid", consumption: 8200, budget: 8000, solar: 300, hvac: 5800, lighting: 400, equipment: 2000, cost: 73800, co2: 4920, status: "Critical", efficiency: 52, peakLoad: 980, temp: -18, alert: true },
]

interface WEItem {
  id: string; dc: string; zone: string; source: string; consumption: number
  budget: number; solar: number; hvac: number; lighting: number
  equipment: number; cost: number; co2: number; status: string
  efficiency: number; peakLoad: number; temp: number; alert: boolean
}

const items: WEItem[] = raw.map((r: any) => ({
  id: r.id, dc: r.dc, zone: r.zone, source: r.source,
  consumption: r.consumption, budget: r.budget, solar: r.solar,
  hvac: r.hvac, lighting: r.lighting, equipment: r.equipment,
  cost: r.cost, co2: r.co2, status: r.status, efficiency: r.efficiency,
  peakLoad: r.peakLoad, temp: r.temp, alert: r.alert,
}))

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "Normal": "text-blue-600",
  "Over Budget": "text-amber-600 font-semibold", "Critical": "text-red-600 font-semibold",
}
const dcNames = [...new Set(items.map(i => i.dc))]
const totalConsumption = items.reduce((s, i) => s + i.consumption, 0)
const totalBudget = items.reduce((s, i) => s + i.budget, 0)
const totalSolar = items.reduce((s, i) => s + i.solar, 0)
const totalCost = items.reduce((s, i) => s + i.cost, 0)
const totalCO2 = items.reduce((s, i) => s + i.co2, 0)
const avgEfficiency = Math.round(items.reduce((s, i) => s + i.efficiency, 0) / items.length)
const solarPct = ((totalSolar / totalConsumption) * 100).toFixed(0)

type Rec = any
type FV = Record<string, string>
type VT = "zones" | "cost" | "sustainability"

function fmtINR(n: number) { if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`; if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`; return `\u20b9${(n / 1000).toFixed(1)}K` }

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`wea-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function WarehouseEnergyAnalyticsPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("zones")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const criticalZones = items.filter(i => i.status === "Critical")
  const overBudget = items.filter(i => i.status === "Over Budget")

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: Leaf, title: "Solar", desc: `${solarPct}% from renewable sources`, accent: "text-emerald-500" },
    { icon: TrendingUp, title: "Efficiency", desc: `${avgEfficiency}% avg zone efficiency`, accent: "text-blue-500" },
    { icon: Thermometer, title: "CO\u2082", desc: `${(totalCO2 / 1000).toFixed(1)}t CO\u2082 emissions total`, accent: "text-amber-500" },
  ]

  const alerts = [
    ...criticalZones.map(i => ({ id: i.id, msg: `${i.dc} ${i.zone}: Critical — ${i.efficiency}% efficiency, ${i.temp}\u00b0C`, severity: "critical" as const })),
    ...overBudget.map(i => ({ id: i.id, msg: `${i.dc} ${i.zone}: Over budget \u2014 ${i.consumption}/${i.budget} kWh`, severity: "warning" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center"><Zap className="h-4 w-4 text-amber-600" /></div>
            <div><h3 className="text-sm font-bold">Warehouse Energy Analytics</h3><p className="text-xs opacity-60">{items.length} zones | {dcNames.length} DCs</p></div>
          </div>
          <div className="flex gap-1">
            {(["zones", "cost", "sustainability"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "zones" ? "Zones" : v === "cost" ? "Cost" : "Green"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Consumption", `${(totalConsumption / 1000).toFixed(0)}MWh`, Zap, "bg-amber-50/50")}
          {statCard("Solar", `${(totalSolar / 1000).toFixed(1)}MWh`, Sun, "bg-emerald-50/50")}
          {statCard("Cost", fmtINR(totalCost), IndianRupee, "bg-red-50/50")}
          {statCard("Efficiency", `${avgEfficiency}%`, BarChart3, "bg-blue-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {dcNames.map(d => {
            const active = activeFilters.dc === d
            return <span key={d} onClick={() => toggle("dc", active ? undefined : d)} className={`wea-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{d.split(" ")[0]}</span>
          })}
          {activeFilters.dc && <span onClick={() => toggle("dc", undefined)} className="wea-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="wea-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="wea-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Energy Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`wea-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "zones" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const budgetPct = Math.min((item.consumption / item.budget) * 100, 100)
              const solarPctLocal = ((item.solar / Math.max(item.consumption, 1)) * 100).toFixed(0)
              return (
                <div key={item.id} className={`wea-zone-card rounded-lg border p-2.5 bg-card ${isCritical ? "wea-critical-pulse" : item.status === "Over Budget" ? "wea-overbudget-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="wea-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.dc} \u2014 {item.zone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.source === "Solar" ? "bg-emerald-100 text-emerald-700" : item.source === "Grid+Solar" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{item.source}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground mb-0.5">Budget: {item.consumption}/{item.budget} kWh</div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`wea-budget-bar h-full rounded-full ${budgetPct > 100 ? "bg-red-500" : budgetPct > 85 ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${budgetPct}%` }} />
                      </div>
                    </div>
                    <div className="text-right text-[10px]">
                      <div className="text-muted-foreground">Efficiency</div>
                      <span className={`font-bold ${item.efficiency >= 85 ? "text-emerald-600" : item.efficiency >= 70 ? "text-amber-600" : "text-red-600"}`}>{item.efficiency}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-0.5"><Sun className="h-3 w-3 text-emerald-500" />{solarPctLocal}%</div>
                    <div className="flex items-center gap-0.5"><Thermometer className="h-3 w-3 text-red-400" />{item.temp}\u00b0C</div>
                    <div className="flex items-center gap-0.5"><Zap className="h-3 w-3 text-amber-500" />{item.peakLoad}kW</div>
                    <div>Cost: <span className="font-medium text-foreground">{fmtINR(item.cost)}</span></div>
                    <div className="flex items-center gap-0.5"><Leaf className="h-3 w-3 text-emerald-400" />{item.co2}kg</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "cost" && (
          <div className="space-y-2">
            <div className="wea-cost-header rounded-lg border p-2 bg-amber-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-amber-600">{fmtINR(totalCost)}</div><div className="text-[10px] opacity-50">Total Cost</div></div>
                <div><div className="text-lg font-bold text-blue-600">{fmtINR(totalBudget > totalConsumption ? 0 : totalCost)}</div><div className="text-[10px] opacity-50">Grid Cost</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{totalSolar}kWh</div><div className="text-[10px] opacity-50">Solar Offset</div></div>
                <div><div className="text-lg font-bold text-red-500">{(totalConsumption > totalBudget ? totalConsumption - totalBudget : 0).toLocaleString()}kWh</div><div className="text-[10px] opacity-50">Over Budget</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.cost - a.cost).map(item => {
              const budgetUsed = ((item.consumption / item.budget) * 100).toFixed(0)
              const hvacPct = ((item.hvac / Math.max(item.consumption, 1)) * 100).toFixed(0)
              return (
                <div key={item.id} className="wea-cost-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.dc} \u2014 {item.zone}</span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${item.consumption > item.budget ? "text-red-600" : "text-foreground"}`}>{fmtINR(item.cost)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Budget: <span className="font-medium">{budgetUsed}%</span></div>
                    <div>HVAC: <span className="font-medium">{hvacPct}%</span> ({item.hvac}kWh)</div>
                    <div>Equipment: <span className="font-medium">{item.equipment}kWh</span></div>
                    <div>Lighting: <span className="font-medium">{item.lighting}kWh</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "sustainability" && (
          <div className="space-y-2">
            <div className="wea-green-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{totalSolar.toLocaleString()}kWh</div><div className="text-[10px] opacity-50">Solar Generated</div></div>
                <div><div className="text-lg font-bold text-green-600">{(totalCO2 / 1000).toFixed(1)}t</div><div className="text-[10px] opacity-50">CO\u2082 Emissions</div></div>
                <div><div className="text-lg font-bold text-teal-600">{solarPct}%</div><div className="text-[10px] opacity-50">Renewable Share</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.solar - a.solar).map(item => {
              const renewablePct = ((item.solar / Math.max(item.consumption, 1)) * 100).toFixed(0)
              const co2PerKwh = (item.co2 / Math.max(item.consumption, 1)).toFixed(2)
              return (
                <div key={item.id} className="wea-green-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.dc}</span>
                      <span className="text-[10px] opacity-50">{item.zone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sun className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600">{item.solar}kWh</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                    <div>Renewable: <span className="font-medium text-emerald-600">{renewablePct}%</span></div>
                    <div>CO\u2082/kWh: <span className={`font-medium ${Number(co2PerKwh) > 0.7 ? "text-red-600" : "text-foreground"}`}>{co2PerKwh}kg</span></div>
                    <div className="flex items-center gap-0.5"><Leaf className="h-3 w-3" />Total: <span className="font-medium">{item.co2}kg</span></div>
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
