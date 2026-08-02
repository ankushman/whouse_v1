"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Leaf, Truck, TrendingDown, MapPin, Globe, Recycle, Wind, Cloud,
  AlertTriangle, CheckCircle, XCircle, Route, Target
} from "lucide-react"

const raw = [
  { id: "CFT-01", mode: "Road", route: "Mumbai→Delhi", carrier: "TCI Express", fuelType: "Diesel", distance: 1420, emission: 485, intensity: 0.342, offset: 120, scope: "Scope 1", compliance: "Bharat Stage VI", status: "On Track", baseEmission: 520, saving: 7, region: "West→North", trips: 28, cost: 34000 },
  { id: "CFT-02", mode: "Rail", route: "Delhi→Kolkata", carrier: "Container Corp", fuelType: "Electric", distance: 1500, emission: 85, intensity: 0.057, offset: 0, scope: "Scope 2", compliance: "Indian Railways Green", status: "Optimized", baseEmission: 150, saving: 43, region: "North→East", trips: 42, cost: 18000 },
  { id: "CFT-03", mode: "Sea", route: "Chennai→Singapore", carrier: "Maersk", fuelType: "HFO", distance: 2800, emission: 920, intensity: 0.329, offset: 200, scope: "Scope 1", compliance: "IMO 2020", status: "On Track", baseEmission: 980, saving: 6, region: "International", trips: 12, cost: 85000 },
  { id: "CFT-04", mode: "Air", route: "Mumbai→Dubai", carrier: "Emirates SkyCargo", fuelType: "Jet Fuel", distance: 1950, emission: 2450, intensity: 1.256, offset: 0, scope: "Scope 1", compliance: "ICAO CORSIA", status: "Over Budget", baseEmission: 2400, saving: -2, region: "International", trips: 6, cost: 125000 },
  { id: "CFT-05", mode: "Road", route: "Bengaluru→Chennai", carrier: "Snowman", fuelType: "Diesel", distance: 350, emission: 112, intensity: 0.320, offset: 30, scope: "Scope 1", compliance: "Bharat Stage VI", status: "On Track", baseEmission: 125, saving: 10, region: "South→South", trips: 35, cost: 8500 },
  { id: "CFT-06", mode: "Road", route: "Pune→Hyderabad", carrier: "Delhivery", fuelType: "CNG", distance: 560, emission: 128, intensity: 0.229, offset: 40, scope: "Scope 1", compliance: "Bharat Stage VI", status: "Optimized", baseEmission: 165, saving: 22, region: "West→South", trips: 22, cost: 12000 },
  { id: "CFT-07", mode: "Rail", route: "Mumbai→Ahmedabad", carrier: "Container Corp", fuelType: "Electric", distance: 520, emission: 28, intensity: 0.054, offset: 0, scope: "Scope 2", compliance: "Indian Railways Green", status: "Optimized", baseEmission: 48, saving: 42, region: "West→West", trips: 55, cost: 6500 },
  { id: "CFT-08", mode: "Sea", route: "Kolkata→Colombo", carrier: "MSC", fuelType: "VLSFO", distance: 2100, emission: 680, intensity: 0.324, offset: 150, scope: "Scope 1", compliance: "IMO 2020", status: "At Risk", baseEmission: 650, saving: -5, region: "International", trips: 8, cost: 62000 },
  { id: "CFT-09", mode: "Road", route: "Jaipur→Lucknow", carrier: "Safexpress", fuelType: "Diesel", distance: 580, emission: 198, intensity: 0.341, offset: 50, scope: "Scope 1", compliance: "Bharat Stage VI", status: "On Track", baseEmission: 210, saving: 6, region: "North→North", trips: 18, cost: 14200 },
  { id: "CFT-10", mode: "Air", route: "Delhi→London", carrier: "British Airways Cargo", fuelType: "Sustainable Aviation", distance: 6700, emission: 5200, intensity: 0.776, offset: 800, scope: "Scope 1", compliance: "ICAO CORSIA", status: "Over Budget", baseEmission: 5800, saving: 10, region: "International", trips: 3, cost: 340000 },
]

interface CFTItem {
  id: string; mode: string; route: string; carrier: string; fuelType: string
  distance: number; emission: number; intensity: number; offset: number
  scope: string; compliance: string; status: string; baseEmission: number
  saving: number; region: string; trips: number; cost: number
}

const items: CFTItem[] = raw.map((r: any) => ({
  id: r.id, mode: r.mode, route: r.route, carrier: r.carrier, fuelType: r.fuelType,
  distance: r.distance, emission: r.emission, intensity: r.intensity, offset: r.offset,
  scope: r.scope, compliance: r.compliance, status: r.status, baseEmission: r.baseEmission,
  saving: r.saving, region: r.region, trips: r.trips, cost: r.cost,
}))

const statusColors: Record<string, string> = {
  "On Track": "text-emerald-600 font-semibold", "Optimized": "text-blue-600 font-semibold",
  "Over Budget": "text-red-600 font-semibold", "At Risk": "text-amber-600 font-semibold",
}
const modeColors: Record<string, string> = {
  "Road": "bg-blue-100 text-blue-700", "Rail": "bg-emerald-100 text-emerald-700",
  "Sea": "bg-cyan-100 text-cyan-700", "Air": "bg-purple-100 text-purple-700",
}
const fuelColors: Record<string, string> = {
  "Diesel": "bg-slate-100 text-slate-700", "CNG": "bg-green-100 text-green-700",
  "Electric": "bg-yellow-100 text-yellow-700", "HFO": "bg-gray-100 text-gray-700",
  "Jet Fuel": "bg-indigo-100 text-indigo-700", "VLSFO": "bg-teal-100 text-teal-700",
  "Sustainable Aviation": "bg-lime-100 text-lime-700",
}
const modes = [...new Set(items.map(i => i.mode))]
const scopes = [...new Set(items.map(i => i.scope))]
const totalEmission = items.reduce((s, i) => s + i.emission, 0)
const totalOffset = items.reduce((s, i) => s + i.offset, 0)
const netEmission = totalEmission - totalOffset
const avgIntensity = (items.reduce((s, i) => s + i.intensity, 0) / items.length).toFixed(3)

type Rec = any
type FV = Record<string, string>
type VT = "emissions" | "transport" | "offsets"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`cft-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatTons(t: number) {
  if (t >= 1000) return `${(t / 1000).toFixed(1)}KT`
  return `${t.toFixed(0)}T`
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function CarbonFootprintTrackerPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("emissions")

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
    ...items.filter(i => i.status === "Over Budget").map(i => ({ id: i.id, msg: `${i.route}: ${formatTons(i.emission)} CO\u2082 emitted \u2014 ${i.mode}, ${i.compliance}, ${i.fuelType}`, severity: "critical" as const })),
    ...items.filter(i => i.saving < 0).map(i => ({ id: i.id, msg: `${i.route}: ${Math.abs(i.saving)}% over budget vs baseline ${formatTons(i.baseEmission)}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "At Risk").map(i => ({ id: i.id, msg: `${i.route}: At risk \u2014 ${i.carrier}, ${i.fuelType}, saving ${i.saving}%`, severity: "warning" as const })),
    ...items.filter(i => i.intensity > 1).map(i => ({ id: i.id, msg: `${i.route}: High carbon intensity ${i.intensity} kgCO\u2082/km \u2014 ${i.mode}`, severity: "warning" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: TrendingDown, title: "Net Emissions", desc: `${formatTons(netEmission)} after ${formatTons(totalOffset)} offsets`, accent: "text-emerald-500" },
    { icon: Leaf, title: "Avg Intensity", desc: `${avgIntensity} kgCO\u2082/km across all routes`, accent: "text-green-500" },
    { icon: Globe, title: "Compliance", desc: `${items.filter(i => i.compliance.includes("Bharat")).length} BS-VI certified`, accent: "text-blue-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center"><Leaf className="h-4 w-4 text-green-600" /></div>
            <div><h3 className="text-sm font-bold">Carbon Footprint Tracker</h3><p className="text-xs opacity-60">{items.length} routes | {modes.length} modes</p></div>
          </div>
          <div className="flex gap-1">
            {(["emissions", "transport", "offsets"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "emissions" ? "Emissions" : v === "transport" ? "Transport" : "Offsets"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Total CO\u2082", formatTons(totalEmission), Cloud, "bg-green-50/50")}
          {statCard("Net (Offset)", formatTons(netEmission), TrendingDown, "bg-emerald-50/50")}
          {statCard("Offsets", formatTons(totalOffset), Recycle, "bg-blue-50/50")}
          {statCard("Intensity", `${avgIntensity}`, Target, "bg-indigo-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {modes.map(m => {
            const active = activeFilters.mode === m
            return <span key={m} onClick={() => toggle("mode", active ? undefined : m)} className={`cft-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{m}</span>
          })}
          {scopes.map(s => {
            const active = activeFilters.scope === s
            return <span key={s} onClick={() => toggle("scope", active ? undefined : s)} className={`cft-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="cft-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="cft-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="cft-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Carbon Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`cft-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "emissions" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Over Budget"
              const isWarning = item.status === "At Risk"
              const maxE = Math.max(...items.map(i => i.emission))
              return (
                <div key={item.id} className={`cft-emission-card rounded-lg border p-2.5 bg-card ${isCritical ? "cft-critical-pulse" : isWarning ? "cft-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="cft-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-green-100 text-green-700">{item.id}</span>
                      <span className={`cft-mode-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${modeColors[item.mode] || "bg-slate-100"}`}>{item.mode}</span>
                      <span className={`cft-fuel-tag text-[10px] px-1.5 py-0.5 rounded ${fuelColors[item.fuelType] || "bg-slate-100"}`}>{item.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Optimized" ? <CheckCircle className="h-3 w-3 text-blue-500" /> : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Route className="h-3 w-3 opacity-40" />{item.route} | {item.carrier}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.region} | {item.scope}</div>
                    <div className="flex items-center gap-1"><Globe className="h-3 w-3 opacity-40" />{item.compliance}</div>
                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 opacity-40" />{item.trips} trips | {item.distance}km</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>CO\u2082: <span className="font-bold text-foreground">{formatTons(item.emission)}</span></div>
                    <div>Intensity: <span className={`font-bold ${item.intensity > 1 ? "text-red-600" : item.intensity > 0.3 ? "text-amber-600" : "text-emerald-600"}`}>{item.intensity}</span></div>
                    <div>Saving: <span className={`font-bold ${item.saving < 0 ? "text-red-600" : "text-emerald-600"}`}>{item.saving > 0 ? "+" : ""}{item.saving}%</span></div>
                    <div>Cost: <span className="font-medium">{formatINR(item.cost)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "transport" && (
          <div className="space-y-2">
            <div className="cft-transport-header rounded-lg border p-2 bg-cyan-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.mode === "Road").reduce((s, i) => s + i.emission, 0)}</div><div className="text-[10px] opacity-50">Road CO\u2082</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.mode === "Rail").reduce((s, i) => s + i.emission, 0)}</div><div className="text-[10px] opacity-50">Rail CO\u2082</div></div>
                <div><div className="text-lg font-bold text-cyan-600">{items.filter(i => i.mode === "Sea").reduce((s, i) => s + i.emission, 0)}</div><div className="text-[10px] opacity-50">Sea CO\u2082</div></div>
                <div><div className="text-lg font-bold text-purple-600">{items.filter(i => i.mode === "Air").reduce((s, i) => s + i.emission, 0)}</div><div className="text-[10px] opacity-50">Air CO\u2082</div></div>
              </div>
            </div>
            {[...new Set(items.map(i => i.mode))].map(mode => {
              const mItems = items.filter(i => i.mode === mode)
              const total = mItems.reduce((s, i) => s + i.emission, 0)
              const avgInt = (mItems.reduce((s, i) => s + i.intensity, 0) / mItems.length).toFixed(3)
              const avgSaving = (mItems.reduce((s, i) => s + i.saving, 0) / mItems.length).toFixed(0)
              const totalTrips = mItems.reduce((s, i) => s + i.trips, 0)
              return (
                <div key={mode} className="cft-mode-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`cft-mode-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${modeColors[mode] || "bg-slate-100"}`}>{mode}</span>
                      <span className="text-xs font-semibold">{mItems.length} route(s)</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{formatTons(total)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Avg Intensity: <span className="font-medium">{avgInt}</span></div>
                    <div>Avg Saving: <span className={`font-medium ${Number(avgSaving) < 0 ? "text-red-600" : "text-emerald-600"}`}>{avgSaving}%</span></div>
                    <div>Trips: <span className="font-medium">{totalTrips}</span></div>
                    <div>Fuels: <span className="font-medium">{new Set(mItems.map(i => i.fuelType)).size}</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mItems.map(i => <span key={i.id} className="text-[9px] px-1 py-0.5 rounded bg-muted/50">{i.carrier}</span>)}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "offsets" && (
          <div className="space-y-2">
            <div className="cft-offsets-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{formatTons(totalOffset)}</div><div className="text-[10px] opacity-50">Total Offsets</div></div>
                <div><div className="text-lg font-bold text-green-600">{items.filter(i => i.offset > 0).length}</div><div className="text-[10px] opacity-50">Routes Offset</div></div>
                <div><div className="text-lg font-bold text-amber-600">{formatTons(totalEmission)}</div><div className="text-[10px] opacity-50">Gross Emissions</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{formatTons(netEmission)}</div><div className="text-[10px] opacity-50">Net Emissions</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.offset - a.offset).map(item => {
              const hasOffset = item.offset > 0
              return (
                <div key={item.id} className={`cft-offset-row rounded-lg border p-2 bg-card ${hasOffset ? "border-l-2 border-l-emerald-400" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.route}</span>
                      <span className={`cft-mode-tag text-[10px] px-1.5 py-0.5 rounded ${modeColors[item.mode] || "bg-slate-100"}`}>{item.mode}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasOffset ? <Recycle className="h-3 w-3 text-emerald-500" /> : <Wind className="h-3 w-3 text-slate-400" />}
                      <span className={`text-xs font-bold ${hasOffset ? "text-emerald-600" : "text-slate-500"}`}>{formatTons(item.offset)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Gross: <span className="font-medium">{formatTons(item.emission)}</span></div>
                    <div>Offset: <span className={`font-medium ${hasOffset ? "text-emerald-600" : "text-slate-500"}`}>{formatTons(item.offset)}</span></div>
                    <div>Net: <span className="font-medium">{formatTons(item.emission - item.offset)}</span></div>
                    <div>Saving: <span className={`font-medium ${item.saving < 0 ? "text-red-600" : "text-emerald-600"}`}>{item.saving > 0 ? "+" : ""}{item.saving}%</span></div>
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
