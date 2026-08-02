"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Globe, Plane, Ship, TrainFront, Truck, Route,
  MapPin, Clock, IndianRupee, Leaf, AlertTriangle,
  ArrowRightLeft, Target
} from "lucide-react"

const raw = [
  { id: "MMP-01", origin: "Mumbai", destination: "Delhi", cargo: "Auto Parts", weight: 12000, mode: "Road", carrier: "TCI Express", distance: 1420, transitTime: "28h", cost: 28400, co2: 1136, status: "Recommended", reliability: 94, alternatives: 3, via: "NH48 Expressway", priority: "Standard" },
  { id: "MMP-02", origin: "Chennai", destination: "Kolkata", cargo: "Textiles", weight: 8500, mode: "Rail", carrier: "Indian Railways", distance: 1660, transitTime: "36h", cost: 16600, co2: 498, status: "Recommended", reliability: 88, alternatives: 2, via: "Chennai Central\u2192Howrah", priority: "Standard" },
  { id: "MMP-03", origin: "Bengaluru", destination: "Delhi", cargo: "Electronics", weight: 3200, mode: "Air", carrier: "BlueDart Aviation", distance: 1740, transitTime: "4h", cost: 128000, co2: 2436, status: "Active", reliability: 98, alternatives: 3, via: "BLR\u2192DEL Direct", priority: "Express" },
  { id: "MMP-04", origin: "Nhava Sheva", destination: "Chennai Port", cargo: "FMCG Bulk", weight: 45000, mode: "Sea", carrier: "Maersk India", distance: 1280, transitTime: "72h", cost: 22500, co2: 256, status: "Active", reliability: 82, alternatives: 1, via: "Coastal Route", priority: "Economy" },
  { id: "MMP-05", origin: "Hyderabad", destination: "Mumbai", cargo: "Pharma", weight: 2800, mode: "Road", carrier: "Rivigo", distance: 710, transitTime: "14h", cost: 14200, co2: 568, status: "Active", reliability: 91, alternatives: 3, via: "NH65 via Pune", priority: "Express" },
  { id: "MMP-06", origin: "Kolkata", destination: "Bengaluru", cargo: "Steel", weight: 28000, mode: "Rail", carrier: "Container Corp", distance: 1960, transitTime: "42h", cost: 27440, co2: 840, status: "Delayed", reliability: 72, alternatives: 2, via: "Howrah\u2192YPR", priority: "Standard" },
  { id: "MMP-07", origin: "Delhi", destination: "Chennai", cargo: "Apparel", weight: 5500, mode: "Air", carrier: "Indigo Cargo", distance: 2090, transitTime: "3.5h", cost: 165000, co2: 3135, status: "Active", reliability: 96, alternatives: 3, via: "DEL\u2192MAA Direct", priority: "Express" },
  { id: "MMP-08", origin: "Mundra", destination: "Nhava Sheva", cargo: "Machinery", weight: 62000, mode: "Sea", carrier: "MSC India", distance: 920, transitTime: "48h", cost: 18400, co2: 184, status: "Active", reliability: 85, alternatives: 1, via: "Gujarat Coastal", priority: "Economy" },
  { id: "MMP-09", origin: "Mumbai", destination: "Hyderabad", cargo: "Spices", weight: 1800, mode: "Road", carrier: "Delhivery", distance: 710, transitTime: "16h", cost: 10650, co2: 426, status: "Rerouted", reliability: 87, alternatives: 3, via: "NH9 via Solapur", priority: "Standard" },
  { id: "MMP-10", origin: "Delhi", destination: "Kolkata", cargo: "Paper", weight: 15000, mode: "Road+Rail", carrier: "Safexpress", distance: 1500, transitTime: "32h", cost: 22500, co2: 675, status: "Active", reliability: 90, alternatives: 2, via: "Road to CNB then Rail", priority: "Standard" },
]

interface MMPItem {
  id: string; origin: string; destination: string; cargo: string; weight: number
  mode: string; carrier: string; distance: number; transitTime: string
  cost: number; co2: number; status: string; reliability: number
  alternatives: number; via: string; priority: string
}

const items: MMPItem[] = raw.map((r: any) => ({
  id: r.id, origin: r.origin, destination: r.destination, cargo: r.cargo,
  weight: r.weight, mode: r.mode, carrier: r.carrier, distance: r.distance,
  transitTime: r.transitTime, cost: r.cost, co2: r.co2, status: r.status,
  reliability: r.reliability, alternatives: r.alternatives, via: r.via,
  priority: r.priority,
}))

const statusColors: Record<string, string> = {
  "Recommended": "text-emerald-600 font-semibold", "Active": "text-blue-600",
  "Delayed": "text-red-600 font-semibold", "Rerouted": "text-amber-600 font-semibold",
}
const modeIcons: Record<string, React.ElementType> = { Road: Truck, Rail: TrainFront, Air: Plane, Sea: Ship, "Road+Rail": ArrowRightLeft }
const priorityColors: Record<string, string> = {
  "Express": "bg-red-100 text-red-700", "Standard": "bg-blue-100 text-blue-700", "Economy": "bg-emerald-100 text-emerald-700",
}
const modes = [...new Set(items.map(i => i.mode))]
const totalCO2 = items.reduce((s, i) => s + i.co2, 0)
const totalCost = items.reduce((s, i) => s + i.cost, 0)
const avgReliability = Math.round(items.reduce((s, i) => s + i.reliability, 0) / items.length)
const totalDistance = items.reduce((s, i) => s + i.distance, 0)

type Rec = any
type FV = Record<string, string>
type VT = "routes" | "modes" | "carbon"

function fmtINR(n: number) { if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`; if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`; return `\u20b9${(n / 1000).toFixed(1)}K` }

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`mmp-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function MultiModalTransportPlannerPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("routes")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const delayed = items.filter(i => i.status === "Delayed")
  const rerouted = items.filter(i => i.status === "Rerouted")

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: Leaf, title: "CO\u2082", desc: `${(totalCO2 / 1000).toFixed(1)}t total emissions`, accent: "text-emerald-500" },
    { icon: Target, title: "Reliability", desc: `${avgReliability}% avg across modes`, accent: "text-blue-500" },
    { icon: Globe, title: "Distance", desc: `${(totalDistance / 1000).toFixed(1)}km total network`, accent: "text-amber-500" },
  ]

  const alerts = [
    ...delayed.map(i => ({ id: i.id, msg: `${i.origin}\u2192${i.destination} (${i.mode}): Delayed \u2014 ${i.transitTime} transit`, severity: "critical" as const })),
    ...rerouted.map(i => ({ id: i.id, msg: `${i.origin}\u2192${i.destination} (${i.mode}): Rerouted via ${i.via.split(" ").slice(0, 3).join(" ")}`, severity: "warning" as const })),
    ...items.filter(i => i.reliability < 80).map(i => ({ id: i.id, msg: `${i.carrier}: Low reliability ${i.reliability}% on ${i.mode}`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center"><Globe className="h-4 w-4 text-indigo-600" /></div>
            <div><h3 className="text-sm font-bold">Multi-Modal Transport Planner</h3><p className="text-xs opacity-60">{items.length} routes | {modes.length} modes</p></div>
          </div>
          <div className="flex gap-1">
            {(["routes", "modes", "carbon"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "routes" ? "Routes" : v === "modes" ? "Modes" : "Carbon"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Cost", fmtINR(totalCost), IndianRupee, "bg-blue-50/50")}
          {statCard("CO\u2082", `${(totalCO2 / 1000).toFixed(1)}t`, Leaf, "bg-emerald-50/50")}
          {statCard("Distance", `${(totalDistance / 1000).toFixed(0)}km`, Route, "bg-amber-50/50")}
          {statCard("Reliability", `${avgReliability}%`, Target, "bg-indigo-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {modes.map(m => {
            const active = activeFilters.mode === m
            return <span key={m} onClick={() => toggle("mode", active ? undefined : m)} className={`mmp-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{m}</span>
          })}
          {activeFilters.mode && <span onClick={() => toggle("mode", undefined)} className="mmp-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="mmp-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="mmp-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Transport Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`mmp-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "routes" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isDelayed = item.status === "Delayed"
              const isRerouted = item.status === "Rerouted"
              const MIcon = modeIcons[item.mode] || Truck
              const co2PerKm = (item.co2 / Math.max(item.distance, 1)).toFixed(2)
              return (
                <div key={item.id} className={`mmp-route-card rounded-lg border p-2.5 bg-card ${isDelayed ? "mmp-delayed-pulse" : isRerouted ? "mmp-reroute-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="mmp-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">{item.id}</span>
                      <MIcon className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="text-xs font-semibold">{item.origin} \u2192 {item.destination}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`mmp-priority-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${priorityColors[item.priority] || "bg-slate-100"}`}>{item.priority}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Route className="h-3 w-3 opacity-40" />{item.via} | {item.mode}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Transit: {item.transitTime} | {item.distance}km</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.carrier} | {item.cargo} {(item.weight / 1000).toFixed(1)}T</div>
                    <div className="flex items-center gap-1"><Leaf className="h-3 w-3 opacity-40" />CO\u2082/km: {co2PerKm}kg</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                    <div>Cost: <span className="font-bold text-foreground">{fmtINR(item.cost)}</span></div>
                    <div>CO\u2082: <span className="font-medium">{item.co2}kg</span></div>
                    <div>Reliability: <span className={`font-bold ${item.reliability >= 90 ? "text-emerald-600" : item.reliability >= 80 ? "text-amber-600" : "text-red-600"}`}>{item.reliability}%</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "modes" && (
          <div className="space-y-2">
            {modes.map(mode => {
              const mItems = items.filter(i => i.mode === mode)
              const mDist = mItems.reduce((s, i) => s + i.distance, 0)
              const mCost = mItems.reduce((s, i) => s + i.cost, 0)
              const mCO2 = mItems.reduce((s, i) => s + i.co2, 0)
              const mRel = Math.round(mItems.reduce((s, i) => s + i.reliability, 0) / mItems.length)
              const MIcon = modeIcons[mode] || Truck
              return (
                <div key={mode} className="mmp-mode-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><MIcon className="h-4 w-4 text-indigo-500" /><span className="text-xs font-semibold">{mode}</span></div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-blue-600">{mItems.length} routes</span>
                      <span className={`font-bold ${mRel >= 90 ? "text-emerald-600" : "text-amber-600"}`}>{mRel}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                    <div>Distance: <span className="font-medium text-foreground">{mDist.toLocaleString()}km</span></div>
                    <div>Cost: <span className="font-medium text-foreground">{fmtINR(mCost)}</span></div>
                    <div>CO\u2082: <span className="font-medium text-foreground">{mCO2.toLocaleString()}kg</span></div>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {mItems.map(mi => (
                      <div key={mi.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{mi.id}</span>{mi.origin}\u2192{mi.destination}</span>
                        <span className={statusColors[mi.status] || ""}>{mi.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "carbon" && (
          <div className="space-y-2">
            <div className="mmp-carbon-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{(totalCO2 / 1000).toFixed(1)}t</div><div className="text-[10px] opacity-50">Total CO\u2082</div></div>
                <div><div className="text-lg font-bold text-blue-600">{(totalCO2 / totalDistance).toFixed(2)}kg</div><div className="text-[10px] opacity-50">kg CO\u2082/km</div></div>
                <div><div className="text-lg font-bold text-amber-600">{(totalCO2 / items.reduce((s, i) => s + i.weight, 0) * 1000).toFixed(1)}g</div><div className="text-[10px] opacity-50">g CO\u2082/kg</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{fmtINR(totalCost)}</div><div className="text-[10px] opacity-50">Total Cost</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.co2 - a.co2).map(item => {
              const co2PerKm = (item.co2 / Math.max(item.distance, 1)).toFixed(2)
              const costPerKm = (item.cost / Math.max(item.distance, 1)).toFixed(0)
              return (
                <div key={item.id} className="mmp-carbon-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.origin}\u2192{item.destination}</span>
                      <span className="text-[10px] opacity-50">{item.mode}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600">{item.co2}kg</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>CO\u2082/km: <span className="font-medium">{co2PerKm}kg</span></div>
                    <div>Cost/km: <span className="font-medium">\u20b9{costPerKm}</span></div>
                    <div>Distance: <span className="font-medium">{item.distance}km</span></div>
                    <div>Weight: <span className="font-medium">{(item.weight / 1000).toFixed(1)}T</span></div>
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
