"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Zap, Thermometer, Sun,
  Target, AlertTriangle, CheckCircle, XCircle,
  Activity, TrendingDown, DollarSign
} from "lucide-react"

const raw = [
  { id: "WEM-01", zone: "Main Warehouse Floor", warehouse: "Mumbai DC1", source: "Grid + Solar", consumption: 18500, solarGen: 4200, peak: 420, offPeak: 280, avgPerSqm: 0.42, temp: 32, humidity: 65, occupancy: 78, efficiency: 92, solarPct: 23, status: "Optimal", city: "Mumbai", month: "Jul 2026", cost: 148000, co2: 12.4, area: 45000 },
  { id: "WEM-02", zone: "Cold Storage Block A", warehouse: "Delhi DC2", source: "Grid + Diesel", consumption: 32000, solarGen: 0, peak: 680, offPeak: 540, avgPerSqm: 0.85, temp: 4, humidity: 85, occupancy: 92, efficiency: 78, solarPct: 0, status: "High Usage", city: "Delhi", month: "Jul 2026", cost: 298000, co2: 24.1, area: 28000 },
  { id: "WEM-03", zone: "Pick & Pack Zone", warehouse: "Bengaluru DC3", source: "Solar + Grid", consumption: 12000, solarGen: 8500, peak: 320, offPeak: 180, avgPerSqm: 0.34, temp: 28, humidity: 55, occupancy: 65, efficiency: 96, solarPct: 71, status: "Optimal", city: "Bengaluru", month: "Jul 2026", cost: 42000, co2: 3.2, area: 35000 },
  { id: "WEM-04", zone: "Loading Dock B", warehouse: "Chennai DC4", source: "Grid Only", consumption: 8200, solarGen: 0, peak: 280, offPeak: 150, avgPerSqm: 0.29, temp: 34, humidity: 78, occupancy: 88, efficiency: 88, solarPct: 0, status: "Optimal", city: "Chennai", month: "Jul 2026", cost: 65600, co2: 5.8, area: 22000 },
  { id: "WEM-05", zone: "Returns Processing", warehouse: "Pune DC6", source: "Grid + Solar", consumption: 6800, solarGen: 2800, peak: 240, offPeak: 120, avgPerSqm: 0.21, temp: 30, humidity: 60, occupancy: 55, efficiency: 94, solarPct: 41, status: "Optimal", city: "Pune", month: "Jul 2026", cost: 38400, co2: 2.8, area: 28000 },
  { id: "WEM-06", zone: "Reefer Bank C", warehouse: "Kolkata DC7", source: "Grid + Diesel", consumption: 28000, solarGen: 500, peak: 720, offPeak: 580, avgPerSqm: 0.78, temp: -20, humidity: 40, occupancy: 95, efficiency: 72, solarPct: 2, status: "Critical", city: "Kolkata", month: "Jul 2026", cost: 252000, co2: 21.5, area: 30000 },
  { id: "WEM-07", zone: "Value Add Area", warehouse: "Hyderabad DC5", source: "Grid Only", consumption: 9500, solarGen: 0, peak: 340, offPeak: 180, avgPerSqm: 0.38, temp: 33, humidity: 62, occupancy: 72, efficiency: 90, solarPct: 0, status: "At Risk", city: "Hyderabad", month: "Jul 2026", cost: 76000, co2: 6.8, area: 25000 },
  { id: "WEM-08", zone: "Dispatch Yard", warehouse: "Ahmedabad DC8", source: "Solar + Grid", consumption: 5400, solarGen: 3800, peak: 200, offPeak: 100, avgPerSqm: 0.11, temp: 36, humidity: 45, occupancy: 48, efficiency: 98, solarPct: 70, status: "Optimal", city: "Ahmedabad", month: "Jul 2026", cost: 19200, co2: 1.2, area: 48000 },
  { id: "WEM-09", zone: "Mezzanine Storage", warehouse: "Jaipur DC9", source: "Grid Only", consumption: 7200, solarGen: 0, peak: 260, offPeak: 140, avgPerSqm: 0.26, temp: 35, humidity: 38, occupancy: 82, efficiency: 84, solarPct: 0, status: "At Risk", city: "Jaipur", month: "Jul 2026", cost: 57600, co2: 5.2, area: 24000 },
  { id: "WEM-10", zone: "Automation Floor", warehouse: "Lucknow DC10", source: "Grid + Solar + Battery", consumption: 22000, solarGen: 6500, peak: 580, offPeak: 350, avgPerSqm: 0.92, temp: 29, humidity: 52, occupancy: 90, efficiency: 86, solarPct: 30, status: "High Usage", city: "Lucknow", month: "Jul 2026", cost: 132000, co2: 15.8, area: 20000 },
]

interface WEMItem {
  id: string; zone: string; warehouse: string; source: string; consumption: number
  solarGen: number; peak: number; offPeak: number; avgPerSqm: number
  temp: number; humidity: number; occupancy: number; efficiency: number
  solarPct: number; status: string; city: string; month: string
  cost: number; co2: number; area: number
}

const items: WEMItem[] = raw.map((r: any) => ({
  id: r.id, zone: r.zone, warehouse: r.warehouse, source: r.source, consumption: r.consumption,
  solarGen: r.solarGen, peak: r.peak, offPeak: r.offPeak, avgPerSqm: r.avgPerSqm,
  temp: r.temp, humidity: r.humidity, occupancy: r.occupancy, efficiency: r.efficiency,
  solarPct: r.solarPct, status: r.status, city: r.city, month: r.month,
  cost: r.cost, co2: r.co2, area: r.area,
}))

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "High Usage": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Critical": "text-red-600 font-semibold",
}
const srcColors: Record<string, string> = {
  "Grid + Solar": "bg-emerald-100 text-emerald-700", "Solar + Grid": "bg-green-100 text-green-700",
  "Grid Only": "bg-slate-100 text-slate-700", "Grid + Diesel": "bg-red-100 text-red-700",
  "Solar + Grid + Battery": "bg-blue-100 text-blue-700",
}
const statuses = [...new Set(items.map(i => i.status))]
const totalKWh = items.reduce((s, i) => s + i.consumption, 0)
const totalSolar = items.reduce((s, i) => s + i.solarGen, 0)
const totalCO2 = items.reduce((s, i) => s + i.co2, 0)

type Rec = any
type FV = Record<string, string>
type VT = "zones" | "energy" | "sustainability"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`wem-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function WarehouseEnergyManagementPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("zones")

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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.zone}: CRITICAL \u2014 ${i.consumption.toLocaleString()} kWh, efficiency ${i.efficiency}%, CO2 ${i.co2}T, diesel backup`, severity: "critical" as const })),
    ...items.filter(i => i.status === "At Risk").map(i => ({ id: i.id, msg: `${i.zone}: At risk \u2014 efficiency ${i.efficiency}%, ${i.source}, \u20b9${formatINR(i.cost)}/mo`, severity: "warning" as const })),
    ...items.filter(i => i.solarPct === 0 && i.consumption > 10000).map(i => ({ id: i.id, msg: `${i.zone}: No solar for ${i.consumption.toLocaleString()} kWh zone \u2014 ${i.warehouse}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Sun, title: "Solar Mix", desc: `${(totalSolar / totalKWh * 100).toFixed(1)}% from solar (${(totalSolar / 1000).toFixed(0)}K kWh)`, accent: "text-amber-500" },
    { icon: TrendingDown, title: "CO2 Output", desc: `${totalCO2.toFixed(1)}T CO2/month across zones`, accent: "text-green-500" },
    { icon: DollarSign, title: "Energy Cost", desc: `${formatINR(items.reduce((s, i) => s + i.cost, 0))}/month total`, accent: "text-blue-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center"><Zap className="h-4 w-4 text-amber-600" /></div>
            <div><h3 className="text-sm font-bold">Warehouse Energy Management</h3><p className="text-xs opacity-60">{items.length} zones | {(totalKWh / 1000).toFixed(0)}K kWh</p></div>
          </div>
          <div className="flex gap-1">
            {(["zones", "energy", "sustainability"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "zones" ? "Zones" : v === "energy" ? "Energy" : "Green"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Zones", items.length.toString(), Activity, "bg-amber-50/50")}
          {statCard("kWh/mo", `${(totalKWh / 1000).toFixed(0)}K`, Zap, "bg-blue-50/50")}
          {statCard("Solar", `${(totalSolar / 1000).toFixed(0)}K kWh`, Sun, "bg-emerald-50/50")}
          {statCard("Cost", formatINR(items.reduce((s, i) => s + i.cost, 0)), DollarSign, "bg-purple-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {statuses.map(s => {
            const active = activeFilters.status === s
            return <span key={s} onClick={() => toggle("status", active ? undefined : s)} className={`wem-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="wem-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="wem-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="wem-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Energy Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`wem-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "zones" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "At Risk" || item.status === "High Usage"
              return (
                <div key={item.id} className={`wem-zone-card rounded-lg border p-2.5 bg-card ${isCritical ? "wem-critical-pulse" : isWarning ? "wem-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="wem-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.zone}</span>
                      <span className={`wem-src-tag text-[10px] px-1.5 py-0.5 rounded ${srcColors[item.source] || "bg-slate-100"}`}>{item.source}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Optimal" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Zap className="h-3 w-3 opacity-40" />{item.warehouse} | {item.city}</div>
                    <div className="flex items-center gap-1"><Thermometer className="h-3 w-3 opacity-40" />{item.temp}\u00b0C | {item.humidity}% RH</div>
                    <div className="flex items-center gap-1"><Sun className="h-3 w-3 opacity-40" />Solar: {item.solarGen.toLocaleString()} kWh ({item.solarPct}%)</div>
                    <div className="flex items-center gap-1"><Activity className="h-3 w-3 opacity-40" />Occ: {item.occupancy}% | Area: {(item.area / 1000).toFixed(0)}K sqft</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>kWh: <span className={`font-bold ${item.consumption > 25000 ? "text-red-600" : "text-foreground"}`}>{item.consumption.toLocaleString()}</span></div>
                    <div>Efficiency: <span className={`font-bold ${item.efficiency >= 90 ? "text-emerald-600" : item.efficiency >= 80 ? "text-amber-600" : "text-red-600"}`}>{item.efficiency}%</span></div>
                    <div>Cost: <span className="font-medium">{formatINR(item.cost)}/mo</span></div>
                    <div>CO2: <span className={`font-medium ${item.co2 > 15 ? "text-red-600" : "text-foreground"}`}>{item.co2}T</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "energy" && (
          <div className="space-y-2">
            <div className="wem-eng-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{(totalKWh / 1000).toFixed(0)}K</div><div className="text-[10px] opacity-50">Total kWh</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.max(...items.map(i => i.peak))} kW</div><div className="text-[10px] opacity-50">Peak Load</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{Math.round(items.reduce((s, i) => s + i.efficiency, 0) / items.length)}%</div><div className="text-[10px] opacity-50">Avg Efficiency</div></div>
                <div><div className="text-lg font-bold text-purple-600">{items.reduce((s, i) => s + i.offPeak, 0).toLocaleString()}</div><div className="text-[10px] opacity-50">Off-Peak Total</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.consumption - a.consumption).map(item => (
              <div key={item.id} className={`wem-eng-row rounded-lg border p-2 bg-card ${item.consumption > 25000 ? "wem-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.zone}</span>
                  </div>
                  <span className="text-xs font-bold">{item.consumption.toLocaleString()} kWh</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.efficiency >= 90 ? "bg-emerald-500" : item.efficiency >= 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.efficiency}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Peak: <span className="font-medium">{item.peak} kW</span></div>
                  <div>Off-Peak: <span className="font-medium">{item.offPeak} kW</span></div>
                  <div>kWh/sqm: <span className="font-medium">{item.avgPerSqm}</span></div>
                  <div>Efficiency: <span className={`font-medium ${item.efficiency >= 90 ? "text-emerald-600" : "text-amber-600"}`}>{item.efficiency}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "sustainability" && (
          <div className="space-y-2">
            <div className="wem-green-header rounded-lg border p-2 bg-green-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{(totalSolar / 1000).toFixed(0)}K kWh</div><div className="text-[10px] opacity-50">Solar Generated</div></div>
                <div><div className="text-lg font-bold text-green-600">{totalCO2.toFixed(1)}T</div><div className="text-[10px] opacity-50">CO2 Emissions</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.solarPct > 0).length}/{items.length}</div><div className="text-[10px] opacity-50">Solar Zones</div></div>
                <div><div className="text-lg font-bold text-blue-600">{formatINR(items.reduce((s, i) => s + i.cost, 0))}</div><div className="text-[10px] opacity-50">Monthly Cost</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.solarPct - b.solarPct).map(item => (
              <div key={item.id} className={`wem-green-row rounded-lg border p-2 bg-card ${item.co2 > 20 ? "wem-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.zone}</span>
                    <span className={`wem-src-tag text-[10px] px-1.5 py-0.5 rounded ${srcColors[item.source] || "bg-slate-100"}`}>{item.source}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.solarPct >= 40 ? "text-emerald-600" : item.solarPct > 0 ? "text-amber-600" : "text-slate-500"}`}>{item.solarPct > 0 ? `${item.solarPct}% solar` : "No solar"}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(item.solarPct * 1.3, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>CO2: <span className={`font-medium ${item.co2 > 15 ? "text-red-600" : "text-foreground"}`}>{item.co2}T</span></div>
                  <div>Cost: <span className="font-medium">{formatINR(item.cost)}/mo</span></div>
                  <div>kWh/sqm: <span className="font-medium">{item.avgPerSqm}</span></div>
                  <div>Efficiency: <span className="font-medium">{item.efficiency}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
