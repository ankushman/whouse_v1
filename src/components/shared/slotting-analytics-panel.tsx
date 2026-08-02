"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LayoutGrid, AlertTriangle, CheckCircle, XCircle, TrendingUp, Clock, Package, Layers, Target, MoveDown, RotateCw
} from "lucide-react"

const raw = [
  { id: "SLA-01", zone: "A-01 Fast", loc: "Mumbai DC1", sku: "SK-2847 Basmati Rice 5kg", abc: "A", picks: 2450, velocity: 98, slotUtil: 95, cubeUtil: 82, travelDist: 12, ergo: 92, reorder: 180, stock: 450, replen: "Auto", freq: "Hourly", city: "Mumbai", region: "West", status: "Optimal", lastMove: "2d ago" },
  { id: "SLA-02", zone: "B-03 Medium", loc: "Delhi DC2", sku: "SK-5521 LED Panel 32in", abc: "B", picks: 820, velocity: 65, slotUtil: 78, cubeUtil: 60, travelDist: 45, ergo: 68, reorder: 60, stock: 120, replen: "Manual", freq: "Daily", city: "Delhi", region: "North", status: "Review", lastMove: "15d ago" },
  { id: "SLA-03", zone: "C-08 Slow", loc: "Bengaluru DC3", sku: "SK-1102 Industrial Seal Kit", abc: "C", picks: 45, velocity: 8, slotUtil: 35, cubeUtil: 90, travelDist: 120, ergo: 42, reorder: 8, stock: 200, replen: "Manual", freq: "Weekly", city: "Bengaluru", region: "South", status: "At Risk", lastMove: "45d ago" },
  { id: "SLA-04", zone: "A-02 Fast", loc: "Chennai DC4", sku: "SK-8834 Soap Combo Pack", abc: "A", picks: 3200, velocity: 99, slotUtil: 100, cubeUtil: 88, travelDist: 8, ergo: 95, reorder: 240, stock: 320, replen: "Auto", freq: "Continuous", city: "Chennai", region: "South", status: "Overloaded", lastMove: "0d ago" },
  { id: "SLA-05", zone: "B-06 Medium", loc: "Kolkata DC7", sku: "SK-2290 Cotton Bedsheet", abc: "B", picks: 580, velocity: 52, slotUtil: 72, cubeUtil: 55, travelDist: 55, ergo: 72, reorder: 40, stock: 180, replen: "Semi-Auto", freq: "Daily", city: "Kolkata", region: "East", status: "Optimal", lastMove: "5d ago" },
  { id: "SLA-06", zone: "A-03 Fast", loc: "Hyderabad DC5", sku: "SK-4455 Mobile Case Pack", abc: "A", picks: 1850, velocity: 88, slotUtil: 92, cubeUtil: 75, travelDist: 15, ergo: 90, reorder: 150, stock: 600, replen: "Auto", freq: "Hourly", city: "Hyderabad", region: "South", status: "Optimal", lastMove: "1d ago" },
  { id: "SLA-07", zone: "D-02 Dead", loc: "Ahmedabad DC8", sku: "SK-6678 Legacy Adapter Cable", abc: "D", picks: 5, velocity: 1, slotUtil: 15, cubeUtil: 95, travelDist: 180, ergo: 20, reorder: 2, stock: 80, replen: "None", freq: "Monthly", city: "Ahmedabad", region: "West", status: "Critical", lastMove: "90d ago" },
  { id: "SLA-08", zone: "B-01 Medium", loc: "Pune DC6", sku: "SK-3312 Organic Honey 500g", abc: "A", picks: 1400, velocity: 82, slotUtil: 88, cubeUtil: 68, travelDist: 22, ergo: 85, reorder: 120, stock: 280, replen: "Auto", freq: "Hourly", city: "Pune", region: "West", status: "Optimal", lastMove: "3d ago" },
  { id: "SLA-09", zone: "C-05 Slow", loc: "Jaipur DC9", sku: "SK-7789 Handicraft Photo Frame", abc: "C", picks: 85, velocity: 12, slotUtil: 42, cubeUtil: 78, travelDist: 95, ergo: 38, reorder: 12, stock: 95, replen: "Manual", freq: "Weekly", city: "Jaipur", region: "North", status: "At Risk", lastMove: "30d ago" },
  { id: "SLA-10", zone: "A-04 Fast", loc: "Lucknow DC10", sku: "SK-9901 Atta 10kg", abc: "A", picks: 2800, velocity: 96, slotUtil: 98, cubeUtil: 85, travelDist: 10, ergo: 94, reorder: 200, stock: 520, replen: "Auto", freq: "Continuous", city: "Lucknow", region: "North", status: "Overloaded", lastMove: "0d ago" },
]

interface SLAItem {
  id: string; zone: string; loc: string; sku: string; abc: string
  picks: number; velocity: number; slotUtil: number; cubeUtil: number
  travelDist: number; ergo: number; reorder: number; stock: number
  replen: string; freq: string; city: string; region: string; status: string; lastMove: string
}

const items: SLAItem[] = raw.map((r: any) => ({
  id: r.id, zone: r.zone, loc: r.loc, sku: r.sku, abc: r.abc,
  picks: r.picks, velocity: r.velocity, slotUtil: r.slotUtil, cubeUtil: r.cubeUtil,
  travelDist: r.travelDist, ergo: r.ergo, reorder: r.reorder, stock: r.stock,
  replen: r.replen, freq: r.freq, city: r.city, region: r.region, status: r.status, lastMove: r.lastMove,
}))

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "Review": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Overloaded": "text-red-600 font-semibold", "Critical": "text-red-700 font-semibold",
}
const abcColors: Record<string, string> = {
  "A": "bg-red-100 text-red-700", "B": "bg-amber-100 text-amber-700",
  "C": "bg-blue-100 text-blue-700", "D": "bg-gray-100 text-gray-600",
}
const replenColors: Record<string, string> = {
  "Auto": "bg-emerald-100 text-emerald-700", "Semi-Auto": "bg-amber-100 text-amber-700",
  "Manual": "bg-orange-100 text-orange-700", "None": "bg-red-100 text-red-700",
}
const regions = [...new Set(items.map(i => i.region))]
const totalPicks = items.reduce((s, i) => s + i.picks, 0)
const avgVelocity = Math.round(items.reduce((s, i) => s + i.velocity, 0) / items.length * 10) / 10
const avgTravel = Math.round(items.reduce((s, i) => s + i.travelDist, 0) / items.length)
const overloadCount = items.filter(i => i.status === "Overloaded").length

type Rec = any
type FV = Record<string, string>
type VT = "slots" | "velocity" | "placement"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`sla-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function SlottingAnalyticsPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("slots")

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
    ...items.filter(i => i.status === "Overloaded").map(i => ({ id: i.id, msg: `${i.sku}: OVERLOADED \u2014 ${i.slotUtil}% slot util, ${i.picks.toLocaleString()} picks, velocity ${i.velocity}, ${i.loc}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.sku}: DEAD ZONE \u2014 ${i.picks} picks, velocity ${i.velocity}, travel ${i.travelDist}m, ${i.lastMove} since move`, severity: "warning" as const })),
    ...items.filter(i => i.travelDist > 100).map(i => ({ id: i.id, msg: `${i.sku}: HIGH TRAVEL \u2014 ${i.travelDist}m per pick, ergo ${i.ergo}%, zone ${i.zone}, consider re-slot`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: TrendingUp, title: "Avg Velocity", desc: `${avgVelocity} across ${items.length} slots | ${totalPicks.toLocaleString()} total picks`, accent: avgVelocity >= 60 ? "text-emerald-500" : "text-amber-500" },
    { icon: Target, title: "Slot Health", desc: `${overloadCount} overloaded | ${items.filter(i => i.status === "Optimal").length} optimal`, accent: overloadCount > 2 ? "text-red-500" : "text-blue-500" },
    { icon: MoveDown, title: "Avg Travel", desc: `${avgTravel}m per pick | ${items.filter(i => i.travelDist <= 20).length} in golden zone`, accent: avgTravel <= 40 ? "text-emerald-500" : "text-orange-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center"><LayoutGrid className="h-4 w-4 text-violet-600" /></div>
            <div><h3 className="text-sm font-bold">Slotting Analytics</h3><p className="text-xs opacity-60">{items.length} slots | {regions.length} regions</p></div>
          </div>
          <div className="flex gap-1">
            {(["slots", "velocity", "placement"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "slots" ? "Slots" : v === "velocity" ? "Velocity" : "Placement"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Total Picks", totalPicks.toLocaleString(), Package, "bg-violet-50/50")}
          {statCard("Avg Velocity", `${avgVelocity}`, TrendingUp, "bg-blue-50/50")}
          {statCard("Overloaded", `${overloadCount}`, AlertTriangle, "bg-red-50/50")}
          {statCard("Avg Travel", `${avgTravel}m`, MoveDown, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {regions.map(t => {
            const active = activeFilters.region === t
            return <span key={t} onClick={() => toggle("region", active ? undefined : t)} className={`sla-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="sla-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="sla-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="sla-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Slotting Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`sla-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "slots" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isOverload = item.status === "Overloaded"
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "At Risk" || item.status === "Review"
              return (
                <div key={item.id} className={`sla-slot-card rounded-lg border p-2.5 bg-card ${isCritical ? "sla-critical-pulse" : isOverload ? "sla-overload-pulse" : isWarning ? "sla-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="sla-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.sku}</span>
                      <span className={`sla-abc-tag text-[10px] px-1.5 py-0.5 rounded ${abcColors[item.abc] || "bg-slate-100"}`}>ABC {item.abc}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`sla-replen-tag text-[10px] px-1.5 py-0.5 rounded ${replenColors[item.replen] || "bg-slate-100"}`}>{item.replen}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical || isOverload ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Optimal" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Layers className="h-3 w-3 opacity-40" />{item.zone} | {item.loc} | {item.city}</div>
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.picks.toLocaleString()} picks | Freq: {item.freq}</div>
                    <div className="flex items-center gap-1"><TrendingUp className="h-3 w-3 opacity-40" />Velocity: <span className={item.velocity >= 80 ? "text-emerald-600 font-semibold" : item.velocity >= 40 ? "text-amber-600" : "text-red-600"}>{item.velocity}%</span> | Ergo: {item.ergo}%</div>
                    <div className="flex items-center gap-1"><RotateCw className="h-3 w-3 opacity-40" />Last move: <span className={item.lastMove === "0d ago" ? "text-emerald-600" : item.lastMove === "90d ago" ? "text-red-600 font-semibold" : "text-foreground"}>{item.lastMove}</span></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Slot Util: <span className={`font-medium ${item.slotUtil >= 95 ? "text-red-600" : item.slotUtil >= 70 ? "text-amber-600" : "text-foreground"}`}>{item.slotUtil}%</span></div>
                    <div>Cube Util: <span className="font-medium">{item.cubeUtil}%</span></div>
                    <div>Travel: <span className={`font-medium ${item.travelDist <= 20 ? "text-emerald-600" : item.travelDist > 100 ? "text-red-600" : "text-foreground"}`}>{item.travelDist}m</span></div>
                    <div>Stock: <span className="font-medium">{item.stock}</span> | Reorder: {item.reorder}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "velocity" && (
          <div className="space-y-2">
            <div className="sla-vel-header rounded-lg border p-2 bg-violet-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-violet-600">{avgVelocity}</div><div className="text-[10px] opacity-50">Avg Velocity</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.velocity >= 80).length}</div><div className="text-[10px] opacity-50">High Velocity</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.velocity < 20).length}</div><div className="text-[10px] opacity-50">Dead Stock</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.round(items.reduce((s, i) => s + i.travelDist, 0) / items.length)}</div><div className="text-[10px] opacity-50">Avg Travel (m)</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.velocity - a.velocity).map(item => (
              <div key={item.id} className={`sla-vel-row rounded-lg border p-2 bg-card ${item.velocity < 20 ? "sla-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.sku.split(" ").slice(0, 3).join(" ")}</span>
                    <span className={`sla-abc-tag text-[10px] px-1.5 py-0.5 rounded ${abcColors[item.abc] || "bg-slate-100"}`}>{item.abc}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.velocity >= 80 ? "text-emerald-600" : item.velocity >= 40 ? "text-amber-600" : "text-red-600"}`}>{item.velocity}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.velocity >= 80 ? "bg-emerald-500" : item.velocity >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.velocity}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Picks: <span className="font-medium">{item.picks.toLocaleString()}</span></div>
                  <div>Zone: <span className="font-medium">{item.zone}</span></div>
                  <div>Travel: <span className="font-medium">{item.travelDist}m</span></div>
                  <div>Freq: <span className="font-medium">{item.freq}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "placement" && (
          <div className="space-y-2">
            <div className="sla-place-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.ergo >= 80).length}</div><div className="text-[10px] opacity-50">Good Ergo</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.ergo < 50).length}</div><div className="text-[10px] opacity-50">Poor Ergo</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.slotUtil <= 50).length}</div><div className="text-[10px] opacity-50">Under-utilized</div></div>
                <div><div className="text-lg font-bold text-orange-600">{items.filter(i => i.slotUtil >= 95).length}</div><div className="text-[10px] opacity-50">Over-utilized</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.ergo - b.ergo).map(item => (
              <div key={item.id} className={`sla-place-row rounded-lg border p-2 bg-card ${item.ergo < 40 ? "sla-critical-pulse" : item.slotUtil >= 95 ? "sla-overload-pulse" : item.ergo < 60 ? "sla-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.sku.split(" ").slice(0, 3).join(" ")}</span>
                    <span className="text-[10px] text-muted-foreground">{item.zone}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.ergo >= 80 ? "text-emerald-600" : item.ergo >= 60 ? "text-amber-600" : "text-red-600"}`}>Ergo {item.ergo}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.ergo >= 80 ? "bg-emerald-500" : item.ergo >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.ergo}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Slot: <span className={`font-medium ${item.slotUtil >= 95 ? "text-red-600" : "text-foreground"}`}>{item.slotUtil}%</span></div>
                  <div>Cube: <span className="font-medium">{item.cubeUtil}%</span></div>
                  <div>Replen: <span className={`sla-replen-tag text-[10px] px-1 py-0 rounded ${replenColors[item.replen] || "bg-slate-100"}`}>{item.replen}</span></div>
                  <div>Move: <span className="font-medium">{item.lastMove}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
