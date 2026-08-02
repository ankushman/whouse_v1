"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Truck, Plane, Ship, TrainFront, Fuel, Route, TrendingDown,
  DollarSign, Zap, Package,
  AlertTriangle, CheckCircle, Gauge, Navigation
} from "lucide-react"

const raw = [
  { id: "FRO-01", lane: "Mumbai → Delhi", mode: "Road", carrier: "TCI Express", rateType: "Contract", baseRate: 12, currentRate: 14.5, spotRate: 18, fuelSurcharge: 3.2, transitTime: 48, volume: 24000, savings: 16, compliance: 98, status: "Rate Optimized" },
  { id: "FRO-02", lane: "Delhi → Bengaluru", mode: "Road", carrier: "Rivigo", rateType: "Spot", baseRate: 18, currentRate: 22, spotRate: 22, fuelSurcharge: 4.1, transitTime: 72, volume: 18500, savings: 0, compliance: 91, status: "High Cost" },
  { id: "FRO-03", lane: "Chennai → Kolkata", mode: "Rail", carrier: "Indian Railways", rateType: "Contract", baseRate: 8, currentRate: 7.5, spotRate: 9, fuelSurcharge: 0.8, transitTime: 36, volume: 42000, savings: 6, compliance: 94, status: "Optimal" },
  { id: "FRO-04", lane: "Mumbai → Hyderabad", mode: "Road", carrier: "Delhivery", rateType: "Contract", baseRate: 10, currentRate: 11.2, spotRate: 15, fuelSurcharge: 2.8, transitTime: 24, volume: 31000, savings: 25, compliance: 96, status: "Rate Optimized" },
  { id: "FRO-05", lane: "Delhi → Chennai", mode: "Air", carrier: "BlueDart Aviation", rateType: "Spot", baseRate: 45, currentRate: 52, spotRate: 52, fuelSurcharge: 12.5, transitTime: 4, volume: 5200, savings: 0, compliance: 88, status: "Critical Spike" },
  { id: "FRO-06", lane: "Bengaluru → Mumbai", mode: "Road", carrier: "Safexpress", rateType: "Contract", baseRate: 11, currentRate: 10.8, spotRate: 14, fuelSurcharge: 2.5, transitTime: 30, volume: 27500, savings: 2, compliance: 97, status: "Optimal" },
  { id: "FRO-07", lane: "Kolkata → Delhi", mode: "Rail", carrier: "Container Corp", rateType: "Contract", baseRate: 9, currentRate: 9.5, spotRate: 11, fuelSurcharge: 1.1, transitTime: 42, volume: 35000, savings: -6, compliance: 93, status: "Rate Increased" },
  { id: "FRO-08", lane: "Hyderabad → Bengaluru", mode: "Road", carrier: "Ekart Logistics", rateType: "Contract", baseRate: 7, currentRate: 8.1, spotRate: 11, fuelSurcharge: 2.0, transitTime: 18, volume: 15600, savings: 14, compliance: 95, status: "Rate Optimized" },
  { id: "FRO-09", lane: "Mumbai → Kochi", mode: "Sea", carrier: "Maersk India", rateType: "Contract", baseRate: 5, currentRate: 5.2, spotRate: 7, fuelSurcharge: 1.8, transitTime: 96, volume: 48000, savings: -4, compliance: 92, status: "Rate Increased" },
  { id: "FRO-10", lane: "Delhi → Jaipur", mode: "Road", carrier: "Xpressbee", rateType: "Spot", baseRate: 6, currentRate: 8.5, spotRate: 8.5, fuelSurcharge: 1.9, transitTime: 12, volume: 21000, savings: 0, compliance: 89, status: "High Cost" },
]

interface FreightLane {
  id: string; lane: string; mode: string; carrier: string; rateType: string
  baseRate: number; currentRate: number; spotRate: number; fuelSurcharge: number
  transitTime: number; volume: number; savings: number; compliance: number; status: string
}

const lanes: FreightLane[] = raw.map((r: any) => ({
  id: r.id, lane: r.lane, mode: r.mode, carrier: r.carrier, rateType: r.rateType,
  baseRate: r.baseRate, currentRate: r.currentRate, spotRate: r.spotRate,
  fuelSurcharge: r.fuelSurcharge, transitTime: r.transitTime, volume: r.volume,
  savings: r.savings, compliance: r.compliance, status: r.status,
}))

const statusColors: Record<string, string> = {
  "Rate Optimized": "text-emerald-600", "Optimal": "text-emerald-600",
  "High Cost": "text-amber-600 font-semibold", "Critical Spike": "text-red-600 font-semibold",
  "Rate Increased": "text-orange-600",
}

const modeIcons: Record<string, React.ElementType> = { Road: Truck, Air: Plane, Rail: TrainFront, Sea: Ship }
const modes = [...new Set(lanes.map(l => l.mode))]
const carriers = [...new Set(lanes.map(l => l.carrier))]

type Rec = any
type FV = Record<string, string>
type VT = "lanes" | "savings" | "carriers"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`fro-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function FreightRateOptimizerPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("lanes")

  const filtered = lanes.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const totalSavings = lanes.reduce((s, l) => s + (l.savings > 0 ? l.savings * l.volume * l.currentRate / 100 : 0), 0)
  const highCostLanes = lanes.filter(l => l.status === "High Cost" || l.status === "Critical Spike").length
  const avgCompliance = (lanes.reduce((s, l) => s + l.compliance, 0) / lanes.length).toFixed(1)
  const avgFuelSur = (lanes.filter(l => l.mode === "Road").reduce((s, l) => s + l.fuelSurcharge, 0) / lanes.filter(l => l.mode === "Road").length).toFixed(1)
  const spotLanes = lanes.filter(l => l.rateType === "Spot")
  const contractLanes = lanes.filter(l => l.rateType === "Contract")
  const spotPremium = contractLanes.length > 0 ? ((spotLanes.reduce((s, l) => s + l.currentRate, 0) / spotLanes.length) / (contractLanes.reduce((s, l) => s + l.currentRate, 0) / contractLanes.length) * 100 - 100).toFixed(0) : "—"

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: TrendingDown, title: "Savings", desc: `\u20b9${(totalSavings / 100000).toFixed(1)}L from ${lanes.filter(l => l.savings > 0).length} lanes`, accent: "text-emerald-500" },
    { icon: AlertTriangle, title: "High Cost", desc: `${highCostLanes} lanes need renegotiation`, accent: "text-red-500" },
    { icon: Fuel, title: "Fuel Surchg", desc: `Road avg \u20b9${avgFuelSur}/kg`, accent: "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center"><Gauge className="h-4 w-4 text-violet-600" /></div>
            <div><h3 className="text-sm font-bold">Freight Rate Optimizer</h3><p className="text-xs opacity-60">{lanes.length} lanes across {modes.length} modes</p></div>
          </div>
          <div className="flex gap-1">
            {(["lanes", "savings", "carriers"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "lanes" ? "Lanes" : v === "savings" ? "Savings" : "Carriers"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Total Lanes", String(lanes.length), Route, "bg-violet-50/50")}
          {statCard("High Cost", String(highCostLanes), AlertTriangle, "bg-red-50/50")}
          {statCard("Compliance", `${avgCompliance}%`, CheckCircle, "bg-blue-50/50")}
          {statCard("Fuel Sur.", `\u20b9${avgFuelSur}`, Fuel, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {modes.map(m => {
            const active = activeFilters.mode === m
            const MIcon = modeIcons[m] || Truck
            return <span key={m} onClick={() => toggle("mode", active ? undefined : m)} className={`fro-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none flex items-center gap-1 ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}><MIcon className="h-3 w-3" />{m}</span>
          })}
          {activeFilters.mode && <span onClick={() => toggle("mode", undefined)} className="fro-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">✕</span>}
        </div>

        <div className="fro-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {view === "lanes" && (
          <div className="space-y-1.5">
            <div className="fro-rate-alert rounded-lg border border-amber-200/50 bg-amber-50/20 p-2 mb-1">
              <div className="text-[10px] flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-amber-700"><Zap className="h-3 w-3 inline mr-0.5" />Rate Intel</span>
                <span>Spot vs Contract: <span className="font-medium text-foreground">+{spotPremium}%</span></span>
                <span>Spot lanes: <span className="font-medium text-foreground">{spotLanes.length}</span></span>
                <span>Contract lanes: <span className="font-medium text-foreground">{contractLanes.length}</span></span>
              </div>
            </div>
            {filtered.map(lane => {
              const MIcon = modeIcons[lane.mode] || Truck
              const rateDev = ((lane.currentRate - lane.baseRate) / lane.baseRate * 100).toFixed(1)
              const isHighCost = lane.status === "High Cost" || lane.status === "Critical Spike"
              const isSpike = lane.status === "Critical Spike"
              const savingsPct = Math.abs(lane.savings)
              return (
                <div key={lane.id} className={`fro-lane-card rounded-lg border p-2.5 bg-card ${isSpike ? "fro-spike-pulse" : isHighCost ? "fro-highcost-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="fro-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">{lane.id}</span>
                      <div className="flex items-center gap-1.5">
                        <MIcon className={`h-3.5 w-3.5 ${lane.mode === "Air" ? "text-sky-500" : lane.mode === "Sea" ? "text-blue-500" : lane.mode === "Rail" ? "text-orange-500" : "text-green-600"}`} />
                        <span className="text-xs font-semibold">{lane.lane}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] ${statusColors[lane.status] || "text-muted-foreground"}`}>{lane.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{lane.carrier}</div>
                    <div className="flex items-center gap-1"><Navigation className="h-3 w-3 opacity-40" />{lane.rateType} Rate</div>
                    <div className="flex items-center gap-1"><DollarSign className="h-3 w-3 opacity-40" />Base: \u20b9{lane.baseRate}/kg</div>
                    <div className="flex items-center gap-1"><Gauge className="h-3 w-3 opacity-40" />Transit: {lane.transitTime}h</div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-14">Rate</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${isSpike ? "bg-red-500 fro-bar-pulse" : lane.savings > 0 ? "bg-emerald-500" : lane.savings < 0 ? "bg-orange-500" : "bg-amber-400"}`} style={{ width: `${Math.min(100, Math.abs(lane.savings) * 2.5 + 50)}%` }} /></div>
                    <span className="text-[10px] font-mono w-20 text-right">\u20b9{lane.currentRate}/kg</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-14">Comply</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${lane.compliance}%`, backgroundColor: lane.compliance > 95 ? "#10b981" : lane.compliance > 90 ? "#f59e0b" : "#ef4444" }} /></div>
                    <span className="text-[10px] font-mono w-14 text-right">{lane.compliance}%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
                    <div>Spot: <span className="font-medium text-foreground">\u20b9{lane.spotRate}</span></div>
                    <div>Fuel: <span className="font-medium text-foreground">+\u20b9{lane.fuelSurcharge}</span></div>
                    <div>Dev: <span className={`font-medium ${Number(rateDev) > 15 ? "text-red-500" : Number(rateDev) > 0 ? "text-amber-500" : "text-emerald-500"}`}>{Number(rateDev) > 0 ? "+" : ""}{rateDev}%</span></div>
                    <div>Vol: <span className="font-medium text-foreground">{(lane.volume / 1000).toFixed(0)}T</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "savings" && (
          <div className="space-y-2">
            <div className="fro-savings-header rounded-lg border p-2 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Total Estimated Savings</span>
                <span className="text-sm font-bold text-emerald-600">\u20b9{(totalSavings / 100000).toFixed(1)}L</span>
              </div>
            </div>
            {lanes.filter(l => l.savings !== 0).sort((a, b) => b.savings - a.savings).map(lane => {
              const MIcon = modeIcons[lane.mode] || Truck
              const estSaving = Math.abs(lane.savings * lane.volume * lane.currentRate / 100)
              return (
                <div key={lane.id} className="fro-savings-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <MIcon className="h-3.5 w-3.5 opacity-60" />
                      <span className="text-xs font-semibold">{lane.lane}</span>
                      <span className="text-[10px] opacity-50">{lane.carrier}</span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${lane.savings > 0 ? "text-emerald-600" : "text-orange-600"}`}>
                      {lane.savings > 0 ? "-" : "+"}\u20b9{estSaving.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>\u20b9{lane.baseRate} → \u20b9{lane.currentRate}/kg</span>
                    <span>•</span>
                    <span>{lane.savings > 0 ? "Saved" : "Overpaid"} {Math.abs(lane.savings)}%</span>
                    <span>•</span>
                    <span>Vol: {(lane.volume / 1000).toFixed(0)}T</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "carriers" && (
          <div className="space-y-2">
            {carriers.map(carrier => {
              const carrierLanes = lanes.filter(l => l.carrier === carrier)
              const avgRate = carrierLanes.reduce((s, l) => s + l.currentRate, 0) / carrierLanes.length
              const avgComp = carrierLanes.reduce((s, l) => s + l.compliance, 0) / carrierLanes.length
              const totalVol = carrierLanes.reduce((s, l) => s + l.volume, 0)
              const carrierModes = [...new Set(carrierLanes.map(l => l.mode))]
              return (
                <div key={carrier} className="fro-carrier-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div><span className="text-xs font-semibold">{carrier}</span><div className="flex gap-1 mt-0.5">{carrierModes.map(m => { const MI = modeIcons[m] || Truck; return <span key={m} className="fro-mode-tag text-[10px] px-1.5 py-0.5 rounded bg-muted flex items-center gap-0.5"><MI className="h-2.5 w-2.5" />{m}</span> })}</div></div>
                    <span className="text-[10px] opacity-50">{carrierLanes.length} lanes</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="fro-carrier-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">\u20b9{avgRate.toFixed(1)}</div><div className="opacity-50">Avg Rate/kg</div></div>
                    <div className="fro-carrier-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{avgComp.toFixed(0)}%</div><div className="opacity-50">Compliance</div></div>
                    <div className="fro-carrier-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{(totalVol / 1000).toFixed(0)}T</div><div className="opacity-50">Total Vol</div></div>
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
