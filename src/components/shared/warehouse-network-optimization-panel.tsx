"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Network, MapPin, Warehouse, Building2, TrendingUp, AlertTriangle,
  BarChart3, Zap, Target, Route, Layers
} from "lucide-react"

const raw = [
  { id: "WNO-01", name: "Mumbai DC-1", type: "Hub", region: "West India", capacity: 95000, utilized: 87450, monthlyVol: 42000, inbound: 28000, outbound: 14000, transfers: 8200, networkCost: 4250000, efficiency: 92, status: "Optimal", connections: 6, avgTransit: "18h", bottleneck: false, expansion: false },
  { id: "WNO-02", name: "Delhi DC-2", type: "Hub", region: "North India", capacity: 88000, utilized: 73920, monthlyVol: 38000, inbound: 25000, outbound: 13000, transfers: 9100, networkCost: 5120000, efficiency: 84, status: "Under Pressure", connections: 7, avgTransit: "22h", bottleneck: true, expansion: false },
  { id: "WNO-03", name: "Bengaluru DC-3", type: "Spoke", region: "South India", capacity: 52000, utilized: 46800, monthlyVol: 22000, inbound: 14000, outbound: 8000, transfers: 5600, networkCost: 2890000, efficiency: 90, status: "Optimal", connections: 4, avgTransit: "16h", bottleneck: false, expansion: true },
  { id: "WNO-04", name: "Hyderabad DC-4", type: "Spoke", region: "South India", capacity: 38000, utilized: 26600, monthlyVol: 15000, inbound: 9000, outbound: 6000, transfers: 3200, networkCost: 1780000, efficiency: 70, status: "Under-utilized", connections: 3, avgTransit: "20h", bottleneck: false, expansion: false },
  { id: "WNO-05", name: "Kolkata DC-5", type: "Spoke", region: "East India", capacity: 42000, utilized: 42840, monthlyVol: 18000, inbound: 11000, outbound: 7000, transfers: 4800, networkCost: 2150000, efficiency: 78, status: "Over Capacity", connections: 4, avgTransit: "24h", bottleneck: true, expansion: true },
  { id: "WNO-06", name: "Chennai DC-6", type: "Hub", region: "South India", capacity: 65000, utilized: 52000, monthlyVol: 28000, inbound: 18000, outbound: 10000, transfers: 6200, networkCost: 3340000, efficiency: 80, status: "Normal", connections: 5, avgTransit: "19h", bottleneck: false, expansion: false },
  { id: "WNO-07", name: "Pune DC-7", type: "Fulfillment", region: "West India", capacity: 30000, utilized: 24000, monthlyVol: 12000, inbound: 8000, outbound: 4000, transfers: 2800, networkCost: 1240000, efficiency: 80, status: "Normal", connections: 3, avgTransit: "12h", bottleneck: false, expansion: false },
  { id: "WNO-08", name: "Jaipur DC-8", type: "Spoke", region: "North India", capacity: 25000, utilized: 25000, monthlyVol: 10000, inbound: 7000, outbound: 3000, transfers: 1800, networkCost: 980000, efficiency: 75, status: "At Capacity", connections: 2, avgTransit: "26h", bottleneck: true, expansion: true },
  { id: "WNO-09", name: "Ahmedabad DC-9", type: "Fulfillment", region: "West India", capacity: 28000, utilized: 19600, monthlyVol: 9000, inbound: 6000, outbound: 3000, transfers: 2200, networkCost: 1120000, efficiency: 70, status: "Under-utilized", connections: 2, avgTransit: "14h", bottleneck: false, expansion: false },
  { id: "WNO-10", name: "Lucknow DC-10", type: "Spoke", region: "North India", capacity: 20000, utilized: 18400, monthlyVol: 8000, inbound: 5000, outbound: 3000, transfers: 1500, networkCost: 860000, efficiency: 92, status: "Optimal", connections: 2, avgTransit: "28h", bottleneck: false, expansion: false },
]

interface WNOItem {
  id: string; name: string; type: string; region: string; capacity: number
  utilized: number; monthlyVol: number; inbound: number; outbound: number
  transfers: number; networkCost: number; efficiency: number; status: string
  connections: number; avgTransit: string; bottleneck: boolean; expansion: boolean
}

const items: WNOItem[] = raw.map((r: any) => ({
  id: r.id, name: r.name, type: r.type, region: r.region, capacity: r.capacity,
  utilized: r.utilized, monthlyVol: r.monthlyVol, inbound: r.inbound, outbound: r.outbound,
  transfers: r.transfers, networkCost: r.networkCost, efficiency: r.efficiency, status: r.status,
  connections: r.connections, avgTransit: r.avgTransit, bottleneck: r.bottleneck, expansion: r.expansion,
}))

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "Normal": "text-blue-600",
  "Under Pressure": "text-amber-600 font-semibold", "Over Capacity": "text-red-600 font-semibold",
  "Under-utilized": "text-slate-500", "At Capacity": "text-orange-600 font-semibold",
}
const typeColors: Record<string, string> = {
  "Hub": "bg-purple-100 text-purple-700", "Spoke": "bg-blue-100 text-blue-700", "Fulfillment": "bg-teal-100 text-teal-700",
}
const regions = [...new Set(items.map(i => i.region))]
const types = [...new Set(items.map(i => i.type))]
const totalCapacity = items.reduce((s, i) => s + i.capacity, 0)
const totalUtilized = items.reduce((s, i) => s + i.utilized, 0)
const avgEfficiency = Math.round(items.reduce((s, i) => s + i.efficiency, 0) / items.length)
const totalNetworkCost = items.reduce((s, i) => s + i.networkCost, 0)
const totalTransfers = items.reduce((s, i) => s + i.transfers, 0)

type Rec = any
type FV = Record<string, string>
type VT = "nodes" | "flows" | "capacity"

function fmtINR(n: number) { if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`; if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`; return `\u20b9${(n / 1000).toFixed(1)}K` }

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`wno-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function WarehouseNetworkOptimizationPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("nodes")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const bottlenecks = items.filter(i => i.bottleneck)
  const overCapacity = items.filter(i => i.status === "Over Capacity" || i.status === "At Capacity")
  const expanding = items.filter(i => i.expansion)

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: Network, title: "Utilization", desc: `${((totalUtilized / totalCapacity) * 100).toFixed(1)}% network utilization`, accent: "text-indigo-500" },
    { icon: Zap, title: "Transfers", desc: `${(totalTransfers / 1000).toFixed(1)}K inter-DC monthly`, accent: "text-amber-500" },
    { icon: Target, title: "Efficiency", desc: `${avgEfficiency}% avg efficiency`, accent: "text-emerald-500" },
  ]

  const alerts = [
    ...overCapacity.map(i => ({ id: i.id, msg: `${i.name}: ${i.status} \u2014 ${((i.utilized / i.capacity) * 100).toFixed(0)}% utilized`, severity: "critical" as const })),
    ...bottlenecks.filter(i => i.status !== "Over Capacity" && i.status !== "At Capacity").map(i => ({ id: i.id, msg: `${i.name}: Bottleneck detected \u2014 ${i.connections} connections`, severity: "warning" as const })),
    ...expanding.map(i => ({ id: i.id, msg: `${i.name}: Expansion planned \u2014 +${Math.round(i.capacity * 0.3).toLocaleString()} sqft`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center"><Network className="h-4 w-4 text-purple-600" /></div>
            <div><h3 className="text-sm font-bold">Warehouse Network Optimization</h3><p className="text-xs opacity-60">{items.length} DCs | {regions.length} regions</p></div>
          </div>
          <div className="flex gap-1">
            {(["nodes", "flows", "capacity"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "nodes" ? "Nodes" : v === "flows" ? "Flows" : "Capacity"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Capacity", `${(totalCapacity / 1000).toFixed(0)}K sqft`, Warehouse, "bg-purple-50/50")}
          {statCard("Utilized", `${((totalUtilized / totalCapacity) * 100).toFixed(0)}%`, BarChart3, "bg-indigo-50/50")}
          {statCard("Network Cost", fmtINR(totalNetworkCost), TrendingUp, "bg-amber-50/50")}
          {statCard("Efficiency", `${avgEfficiency}%`, Target, "bg-emerald-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {regions.map(r => {
            const active = activeFilters.region === r
            return <span key={r} onClick={() => toggle("region", active ? undefined : r)} className={`wno-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{r}</span>
          })}
          {types.map(t => {
            const active = activeFilters.type === t
            return <span key={t} onClick={() => toggle("type", active ? undefined : t)} className={`wno-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="wno-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="wno-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="wno-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Network Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`wno-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "nodes" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isOver = item.status === "Over Capacity" || item.status === "At Capacity"
              const isBottleneck = item.bottleneck && !isOver
              const utilPct = ((item.utilized / item.capacity) * 100).toFixed(0)
              return (
                <div key={item.id} className={`wno-node-card rounded-lg border p-2.5 bg-card ${isOver ? "wno-critical-pulse" : isBottleneck ? "wno-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="wno-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">{item.id}</span>
                      <Building2 className="h-3.5 w-3.5 text-purple-500" />
                      <span className="text-xs font-semibold">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`wno-type-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.region} | {item.connections} connections</div>
                    <div className="flex items-center gap-1"><Route className="h-3 w-3 opacity-40" />Avg transit: {item.avgTransit} | {item.transfers.toLocaleString()} transfers/mo</div>
                    <div className="flex items-center gap-1"><Layers className="h-3 w-3 opacity-40" />Volume: {item.monthlyVol.toLocaleString()} units/mo</div>
                    <div className="flex items-center gap-1"><TrendingUp className="h-3 w-3 opacity-40" />Network cost: {fmtINR(item.networkCost)}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Util: <span className={`font-bold ${isOver ? "text-red-600" : parseInt(utilPct) > 90 ? "text-amber-600" : "text-foreground"}`}>{utilPct}%</span></div>
                    <div>Efficiency: <span className={`font-bold ${item.efficiency >= 90 ? "text-emerald-600" : item.efficiency >= 80 ? "text-amber-600" : "text-red-600"}`}>{item.efficiency}%</span></div>
                    <div>Inbound: <span className="font-medium">{(item.inbound / 1000).toFixed(0)}K</span></div>
                    <div>Outbound: <span className="font-medium">{(item.outbound / 1000).toFixed(0)}K</span></div>
                  </div>
                  {item.expansion && <div className="mt-1 text-[10px] text-indigo-600 flex items-center gap-1"><TrendingUp className="h-3 w-3" />Expansion planned</div>}
                </div>
              )
            })}
          </div>
        )}

        {view === "flows" && (
          <div className="space-y-2">
            {filtered.map(item => {
              const transferPct = Math.round((item.transfers / Math.max(item.monthlyVol, 1)) * 100)
              return (
                <div key={item.id} className="wno-flow-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-purple-500" /><span className="text-xs font-semibold">{item.name}</span></div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-blue-600">{item.connections} links</span>
                      <span className={`font-bold ${item.efficiency >= 90 ? "text-emerald-600" : "text-amber-600"}`}>{item.efficiency}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground mb-1">
                    <div>Inbound: <span className="font-medium text-foreground">{item.inbound.toLocaleString()}</span></div>
                    <div>Outbound: <span className="font-medium text-foreground">{item.outbound.toLocaleString()}</span></div>
                    <div>Transfers: <span className="font-medium text-foreground">{item.transfers.toLocaleString()}</span></div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="opacity-50">Transfer ratio:</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${transferPct > 30 ? "bg-amber-500" : "bg-indigo-500"}`} style={{ width: `${Math.min(transferPct, 100)}%` }} /></div>
                    <span className="font-medium w-8 text-right">{transferPct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "capacity" && (
          <div className="space-y-2">
            <div className="wno-cap-header rounded-lg border p-2 bg-purple-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-purple-600">{(totalCapacity / 1000).toFixed(0)}K</div><div className="text-[10px] opacity-50">Total Capacity sqft</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{(totalUtilized / 1000).toFixed(0)}K</div><div className="text-[10px] opacity-50">Utilized sqft</div></div>
                <div><div className="text-lg font-bold text-amber-600">{(totalCapacity - totalUtilized).toLocaleString()}</div><div className="text-[10px] opacity-50">Available sqft</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{fmtINR(totalNetworkCost)}</div><div className="text-[10px] opacity-50">Network Cost/mo</div></div>
              </div>
            </div>
            {items.sort((a, b) => (b.utilized / b.capacity) - (a.utilized / a.capacity)).map(item => {
              const utilPct = ((item.utilized / item.capacity) * 100).toFixed(0)
              const costPerUnit = (item.networkCost / Math.max(item.monthlyVol, 1)).toFixed(0)
              return (
                <div key={item.id} className="wno-cap-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.name}</span>
                      <span className="text-[10px] opacity-50">{item.region}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-bold ${parseInt(utilPct) >= 95 ? "text-red-600" : parseInt(utilPct) >= 85 ? "text-amber-600" : "text-emerald-600"}`}>{utilPct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full transition-all ${parseInt(utilPct) >= 95 ? "bg-red-500" : parseInt(utilPct) >= 85 ? "bg-amber-500" : "bg-indigo-500"}`} style={{ width: `${Math.min(parseInt(utilPct), 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Utilized: <span className="font-medium">{(item.utilized / 1000).toFixed(1)}K</span></div>
                    <div>Free: <span className="font-medium">{((item.capacity - item.utilized) / 1000).toFixed(1)}K</span></div>
                    <div>Cost/unit: <span className="font-medium">\u20b9{costPerUnit}</span></div>
                    <div>Volume: <span className="font-medium">{item.monthlyVol.toLocaleString()}</span></div>
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
