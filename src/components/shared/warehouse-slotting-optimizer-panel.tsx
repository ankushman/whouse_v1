"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Grid3x3, Box, Move,
  Target, AlertTriangle,
  Zap, MapPin, Layers, Eye
} from "lucide-react"

const raw = [
  { id: "WSO-01", zone: "A-Pick-Fast", aisle: "A1-A8", slotType: "Golden Zone", currentSku: "SKU-INS-8842", product: "Amul Toned Milk 500ml", picks: 1240, velocity: "A+", utilPct: 96, distance: 8, pickTime: "12s", replenish: "4/day", lastMove: "2d ago", moveReason: "Seasonal Peak", ergoScore: 92, status: "Optimal", dc: "Mumbai DC-1" },
  { id: "WSO-02", zone: "A-Pick-Fast", aisle: "A9-A16", slotType: "Golden Zone", currentSku: "SKU-APL-7710", product: "Parle-G Biscuit 100g", picks: 980, velocity: "A+", utilPct: 88, distance: 10, pickTime: "15s", replenish: "6/day", lastMove: "5d ago", moveReason: "Velocity Increase", ergoScore: 88, status: "Optimal", dc: "Delhi DC-2" },
  { id: "WSO-03", zone: "B-Pick-Med", aisle: "B1-B12", slotType: "Mid-Flow", currentSku: "SKU-ELC-3321", product: "boAt Airdopes 141", picks: 520, velocity: "B+", utilPct: 82, distance: 22, pickTime: "28s", replenish: "2/day", lastMove: "12d ago", moveReason: "New Listing", ergoScore: 74, status: "Rebalance", dc: "Bengaluru DC-3" },
  { id: "WSO-04", zone: "C-Storage-Bulk", aisle: "C1-C20", slotType: "Bulk Rack", currentSku: "SKU-ELC-6612", product: "Samsung Galaxy M14", picks: 85, velocity: "C", utilPct: 94, distance: 45, pickTime: "55s", replenish: "1/week", lastMove: "30d ago", moveReason: "New Arrival", ergoScore: 52, status: "Overstocked", dc: "Delhi DC-2" },
  { id: "WSO-05", zone: "A-Pick-Fast", aisle: "A17-A24", slotType: "Golden Zone", currentSku: "SKU-SPT-8837", product: "Noise ColorFit Pro 4", picks: 860, velocity: "A+", utilPct: 45, distance: 12, pickTime: "14s", replenish: "3/day", lastMove: "7d ago", moveReason: "Flash Sale", ergoScore: 86, status: "Underutilized", dc: "Hyderabad DC-4" },
  { id: "WSO-06", zone: "B-Pick-Med", aisle: "B13-B24", slotType: "Mid-Flow", currentSku: "SKU-FAS-2218", product: "Nykaa Lipstick Matte Set", picks: 340, velocity: "B", utilPct: 91, distance: 25, pickTime: "32s", replenish: "2/day", lastMove: "18d ago", moveReason: "Demand Shift", ergoScore: 68, status: "Rebalance", dc: "Mumbai DC-1" },
  { id: "WSO-07", zone: "D-Cold-Chain", aisle: "D1-D6", slotType: "Cold Storage", currentSku: "SKU-INS-8842", product: "Amul Cheese Slices 200g", picks: 280, velocity: "B+", utilPct: 78, distance: 18, pickTime: "22s", replenish: "2/day", lastMove: "3d ago", moveReason: "Temp Zone Move", ergoScore: 82, status: "Optimal", dc: "Chennai DC-6" },
  { id: "WSO-08", zone: "E-Value-Add", aisle: "E1-E10", slotType: "VAS Area", currentSku: "SKU-APL-7710", product: "Parle Gift Pack 500g", picks: 120, velocity: "C+", utilPct: 65, distance: 30, pickTime: "40s", replenish: "1/day", lastMove: "22d ago", moveReason: "Promo Setup", ergoScore: 58, status: "Underutilized", dc: "Kolkata DC-5" },
  { id: "WSO-09", zone: "A-Pick-Fast", aisle: "A25-A32", slotType: "Golden Zone", currentSku: "SKU-GRC-1105", product: "Tata Salt 1kg", picks: 1100, velocity: "A+", utilPct: 98, distance: 6, pickTime: "10s", replenish: "8/day", lastMove: "1d ago", moveReason: "Velocity Peak", ergoScore: 95, status: "Optimal", dc: "Mumbai DC-1" },
  { id: "WSO-10", zone: "B-Pick-Med", aisle: "B25-B36", slotType: "Mid-Flow", currentSku: "SKU-HOM-4456", product: "IKEA KALLAX Shelf", picks: 45, velocity: "D+", utilPct: 92, distance: 50, pickTime: "90s", replenish: "1/2weeks", lastMove: "45d ago", moveReason: "Heavy Item Move", ergoScore: 38, status: "Ergo Risk", dc: "Bengaluru DC-3" },
]

interface WSOItem {
  id: string; zone: string; aisle: string; slotType: string; currentSku: string
  product: string; picks: number; velocity: string; utilPct: number; distance: number
  pickTime: string; replenish: string; lastMove: string; moveReason: string
  ergoScore: number; status: string; dc: string
}

const items: WSOItem[] = raw.map((r: any) => ({
  id: r.id, zone: r.zone, aisle: r.aisle, slotType: r.slotType, currentSku: r.currentSku,
  product: r.product, picks: r.picks, velocity: r.velocity, utilPct: r.utilPct,
  distance: r.distance, pickTime: r.pickTime, replenish: r.replenish, lastMove: r.lastMove,
  moveReason: r.moveReason, ergoScore: r.ergoScore, status: r.status, dc: r.dc,
}))

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "Rebalance": "text-amber-600 font-semibold",
  "Overstocked": "text-blue-600", "Underutilized": "text-slate-500 font-semibold",
  "Ergo Risk": "text-red-600 font-semibold",
}
const slotTypeColors: Record<string, string> = {
  "Golden Zone": "bg-yellow-100 text-yellow-700", "Mid-Flow": "bg-blue-100 text-blue-700",
  "Bulk Rack": "bg-slate-100 text-slate-700", "Cold Storage": "bg-cyan-100 text-cyan-700",
  "VAS Area": "bg-purple-100 text-purple-700",
}
const zones = [...new Set(items.map(i => i.zone))]
const slotTypes = [...new Set(items.map(i => i.slotType))]
const totalPicks = items.reduce((s, i) => s + i.picks, 0)
const avgUtil = Math.round(items.reduce((s, i) => s + i.utilPct, 0) / items.length)
const avgErgo = Math.round(items.reduce((s, i) => s + i.ergoScore, 0) / items.length)
const rebalance = items.filter(i => i.status === "Rebalance" || i.status === "Ergo Risk")

type Rec = any
type FV = Record<string, string>
type VT = "slots" | "zones" | "ergonomics"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`wso-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function WarehouseSlottingOptimizerPanel() {
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

  const insights = [
    { icon: Zap, title: "Total Picks", desc: `${totalPicks.toLocaleString()} picks/day avg`, accent: "text-amber-500" },
    { icon: Target, title: "Utilization", desc: `${avgUtil}% avg slot utilization`, accent: "text-indigo-500" },
    { icon: Eye, title: "Ergonomics", desc: `${avgErgo}/100 avg ergo score`, accent: "text-emerald-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Ergo Risk").map(i => ({ id: i.id, msg: `${i.product}: Ergo score ${i.ergoScore}/100 \u2014 ${i.distance}m walk, ${i.pickTime} pick time`, severity: "critical" as const })),
    ...rebalance.filter(i => i.status === "Rebalance").map(i => ({ id: i.id, msg: `${i.product}: Rebalance needed \u2014 ${i.utilPct}% util, ${i.velocity} velocity`, severity: "warning" as const })),
    ...items.filter(i => i.status === "Overstocked").map(i => ({ id: i.id, msg: `${i.product}: Overstocked at ${i.utilPct}% \u2014 consider move to bulk`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center"><Grid3x3 className="h-4 w-4 text-cyan-600" /></div>
            <div><h3 className="text-sm font-bold">Warehouse Slotting Optimizer</h3><p className="text-xs opacity-60">{items.length} slots | {zones.length} zones</p></div>
          </div>
          <div className="flex gap-1">
            {(["slots", "zones", "ergonomics"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "slots" ? "Slots" : v === "zones" ? "Zones" : "Ergo"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Total Picks", totalPicks.toLocaleString(), Zap, "bg-cyan-50/50")}
          {statCard("Utilization", `${avgUtil}%`, Target, "bg-indigo-50/50")}
          {statCard("Rebalance", `${rebalance.length} slots`, AlertTriangle, "bg-amber-50/50")}
          {statCard("Ergo Score", `${avgErgo}/100`, Eye, "bg-emerald-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {zones.map(z => {
            const active = activeFilters.zone === z
            return <span key={z} onClick={() => toggle("zone", active ? undefined : z)} className={`wso-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{z}</span>
          })}
          {slotTypes.map(t => {
            const active = activeFilters.slotType === t
            return <span key={t} onClick={() => toggle("slotType", active ? undefined : t)} className={`wso-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="wso-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="wso-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="wso-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Slotting Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`wso-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "slots" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isErgo = item.status === "Ergo Risk"
              const isRebal = item.status === "Rebalance"
              const velColor = item.velocity.startsWith("A") ? "text-emerald-600" : item.velocity.startsWith("B") ? "text-amber-600" : item.velocity.startsWith("C") ? "text-blue-600" : "text-slate-500"
              return (
                <div key={item.id} className={`wso-slot-card rounded-lg border p-2.5 bg-card ${isErgo ? "wso-critical-pulse" : isRebal ? "wso-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="wso-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-700">{item.id}</span>
                      <span className={`wso-type-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${slotTypeColors[item.slotType] || "bg-slate-100"}`}>{item.slotType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold ${velColor}`}>{item.velocity}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Box className="h-3 w-3 opacity-40" />{item.product} | {item.aisle}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.dc} | {item.zone}</div>
                    <div className="flex items-center gap-1"><Zap className="h-3 w-3 opacity-40" />{item.picks} picks/day | Replenish: {item.replenish}</div>
                    <div className="flex items-center gap-1"><Move className="h-3 w-3 opacity-40" />Last move: {item.lastMove} ({item.moveReason})</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Util: <span className={`font-bold ${item.utilPct >= 90 ? "text-amber-600" : item.utilPct >= 70 ? "text-emerald-600" : "text-red-600"}`}>{item.utilPct}%</span></div>
                    <div>Walk: <span className="font-medium">{item.distance}m</span></div>
                    <div>Pick: <span className="font-medium">{item.pickTime}</span></div>
                    <div>Ergo: <span className={`font-bold ${item.ergoScore >= 80 ? "text-emerald-600" : item.ergoScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{item.ergoScore}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "zones" && (
          <div className="space-y-2">
            {zones.map(zone => {
              const zItems = items.filter(i => i.zone === zone)
              const zPicks = zItems.reduce((s, i) => s + i.picks, 0)
              const zUtil = Math.round(zItems.reduce((s, i) => s + i.utilPct, 0) / zItems.length)
              const zErgo = Math.round(zItems.reduce((s, i) => s + i.ergoScore, 0) / zItems.length)
              return (
                <div key={zone} className="wso-zone-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><Layers className="h-4 w-4 text-cyan-500" /><span className="text-xs font-semibold">{zone}</span></div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-blue-600">{zItems.length} slots</span>
                      <span className="font-bold">{zPicks.toLocaleString()} picks</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground mb-1">
                    <div>Avg Util: <span className="font-medium text-foreground">{zUtil}%</span></div>
                    <div>Avg Ergo: <span className={`font-medium ${zErgo >= 80 ? "text-emerald-600" : "text-amber-600"}`}>{zErgo}</span></div>
                    <div>Types: <span className="font-medium">{[...new Set(zItems.map(i => i.slotType))].join(", ")}</span></div>
                  </div>
                  <div className="space-y-0.5">
                    {zItems.map(zi => (
                      <div key={zi.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{zi.id}</span>{zi.product.split(" ").slice(0, 3).join(" ")}</span>
                        <span className={statusColors[zi.status] || ""}>{zi.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "ergonomics" && (
          <div className="space-y-2">
            <div className="wso-ergo-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{avgErgo}</div><div className="text-[10px] opacity-50">Avg Ergo Score</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.ergoScore < 60).length}</div><div className="text-[10px] opacity-50">High Risk</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.ergoScore >= 60 && i.ergoScore < 80).length}</div><div className="text-[10px] opacity-50">Medium Risk</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{(items.reduce((s, i) => s + i.distance, 0) / items.length).toFixed(0)}m</div><div className="text-[10px] opacity-50">Avg Walk Dist</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.ergoScore - b.ergoScore).map(item => {
              const isRisk = item.ergoScore < 60
              return (
                <div key={item.id} className="wso-ergo-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.product.split(" ").slice(0, 3).join(" ")}</span>
                      <span className="text-[10px] opacity-50">{item.slotType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-bold ${item.ergoScore >= 80 ? "text-emerald-600" : item.ergoScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{item.ergoScore}/100</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full transition-all ${item.ergoScore >= 80 ? "bg-emerald-500" : item.ergoScore >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.ergoScore}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Walk: <span className={`font-medium ${isRisk ? "text-red-600" : "text-foreground"}`}>{item.distance}m</span></div>
                    <div>Pick Time: <span className="font-medium">{item.pickTime}</span></div>
                    <div>Picks/day: <span className="font-medium">{item.picks}</span></div>
                    <div>Zone: <span className="font-medium">{item.zone}</span></div>
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
