"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowUpDown, Warehouse, AlertTriangle, CheckCircle, XCircle,
  TrendingUp, Activity, Clock, Truck, Route, ArrowRight, Timer
} from "lucide-react"

const raw = [
  { id: "CDO-01", lane: "Mumbai-Pune Express", from: "Mumbai DC1", to: "Pune DC6", mode: "Road", volume: 4200, throughput: 3800, dwell: 2.5, sortAcc: 99.4, transferTime: 4.5, outbound: 3750, pending: 50, carrier: "Rivigo", status: "On Track", city: "Mumbai", zone: "West", docks: 8, priority: "High" },
  { id: "CDO-02", lane: "Delhi-Jaipur Corridor", from: "Delhi DC2", to: "Jaipur DC9", mode: "Road", volume: 2800, throughput: 2100, dwell: 6.2, sortAcc: 97.8, transferTime: 8.5, outbound: 2050, pending: 650, carrier: "Delhivery", status: "Delayed", city: "Delhi", zone: "North", docks: 6, priority: "Medium" },
  { id: "CDO-03", lane: "Chennai-Bengaluru Link", from: "Chennai DC4", to: "Bengaluru DC3", mode: "Road", volume: 3500, throughput: 3400, dwell: 1.8, sortAcc: 99.6, transferTime: 3.2, outbound: 3380, pending: 20, carrier: "Shadowfax", status: "On Track", city: "Chennai", zone: "South", docks: 10, priority: "High" },
  { id: "CDO-04", lane: "Kolkata-Guwahati Route", from: "Kolkata DC7", to: "Guwahati Spoke", mode: "Road+Rail", volume: 1800, throughput: 900, dwell: 12.5, sortAcc: 94.2, transferTime: 18.0, outbound: 850, pending: 950, carrier: "TCI Express", status: "Critical", city: "Kolkata", zone: "East", docks: 4, priority: "High" },
  { id: "CDO-05", lane: "Hyderabad-Ahmedabad Hub", from: "Hyderabad DC5", to: "Ahmedabad DC8", mode: "Road", volume: 2400, throughput: 2200, dwell: 3.8, sortAcc: 98.5, transferTime: 6.5, outbound: 2150, pending: 200, carrier: "XpressBees", status: "On Track", city: "Hyderabad", zone: "South", docks: 6, priority: "Medium" },
  { id: "CDO-06", lane: "Pune-Goa Seasonal", from: "Pune DC6", to: "Goa Spoke", mode: "Road", volume: 1200, throughput: 850, dwell: 8.0, sortAcc: 96.5, transferTime: 10.0, outbound: 800, pending: 350, carrier: "Ecom Express", status: "Warning", city: "Pune", zone: "West", docks: 3, priority: "Low" },
  { id: "CDO-07", lane: "Lucknow-Delhi Fast", from: "Lucknow DC10", to: "Delhi DC2", mode: "Road", volume: 3100, throughput: 2950, dwell: 2.2, sortAcc: 99.2, transferTime: 5.0, outbound: 2900, pending: 50, carrier: "Rivigo", status: "On Track", city: "Lucknow", zone: "North", docks: 7, priority: "High" },
  { id: "CDO-08", lane: "Nhava Sheva-Inland Rail", from: "Nhava Sheva Port", to: "Delhi DC2", mode: "Rail+Road", volume: 5200, throughput: 4200, dwell: 9.5, sortAcc: 96.8, transferTime: 14.0, outbound: 4100, pending: 1100, carrier: "Indian Railways", status: "Warning", city: "Mumbai", zone: "West", docks: 12, priority: "Critical" },
  { id: "CDO-09", lane: "Cochin-Trivandrum South", from: "Cochin Port", to: "Trivandrum Spoke", mode: "Road", volume: 950, throughput: 880, dwell: 4.0, sortAcc: 98.8, transferTime: 5.5, outbound: 860, pending: 90, carrier: "BlueDart", status: "On Track", city: "Kochi", zone: "South", docks: 3, priority: "Medium" },
  { id: "CDO-10", lane: "Mundra-North Rail Link", from: "Mundra Port", to: "Jaipur DC9", mode: "Rail", volume: 6500, throughput: 3800, dwell: 15.2, sortAcc: 92.5, transferTime: 22.0, outbound: 3600, pending: 2700, carrier: "Indian Railways", status: "Critical", city: "Ahmedabad", zone: "West", docks: 14, priority: "Critical" },
]

interface CDOItem {
  id: string; lane: string; from: string; to: string; mode: string
  volume: number; throughput: number; dwell: number; sortAcc: number
  transferTime: number; outbound: number; pending: number; carrier: string
  status: string; city: string; zone: string; docks: number; priority: string
}

const items: CDOItem[] = raw.map((r: any) => ({
  id: r.id, lane: r.lane, from: r.from, to: r.to, mode: r.mode,
  volume: r.volume, throughput: r.throughput, dwell: r.dwell, sortAcc: r.sortAcc,
  transferTime: r.transferTime, outbound: r.outbound, pending: r.pending, carrier: r.carrier,
  status: r.status, city: r.city, zone: r.zone, docks: r.docks, priority: r.priority,
}))

const statusColors: Record<string, string> = {
  "On Track": "text-emerald-600 font-semibold", "Warning": "text-amber-600 font-semibold",
  "Delayed": "text-orange-600 font-semibold", "Critical": "text-red-600 font-semibold",
}
const modeColors: Record<string, string> = {
  "Road": "bg-blue-100 text-blue-700", "Rail": "bg-emerald-100 text-emerald-700",
  "Road+Rail": "bg-purple-100 text-purple-700", "Rail+Road": "bg-indigo-100 text-indigo-700",
}
const priorityColors: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700", "High": "bg-orange-100 text-orange-700",
  "Medium": "bg-amber-100 text-amber-700", "Low": "bg-gray-100 text-gray-600",
}
const zones = [...new Set(items.map(i => i.zone))]
const avgDwell = Math.round(items.reduce((s, i) => s + i.dwell, 0) / items.length * 10) / 10
const totalThroughput = items.reduce((s, i) => s + i.throughput, 0)
const totalPending = items.reduce((s, i) => s + i.pending, 0)
const avgSortAcc = Math.round(items.reduce((s, i) => s + i.sortAcc, 0) / items.length * 10) / 10

type Rec = any
type FV = Record<string, string>
type VT = "lanes" | "throughput" | "docks"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`cdo-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function CrossDockOperationsPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("lanes")

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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.lane}: CRITICAL \u2014 ${i.pending.toLocaleString()} pending, dwell ${i.dwell}h, sort acc ${i.sortAcc}%, ${i.docks} docks`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Delayed").map(i => ({ id: i.id, msg: `${i.lane}: Delayed \u2014 ${Math.round(i.throughput / i.volume * 100)}% throughput, transfer ${i.transferTime}h, carrier ${i.carrier}`, severity: "warning" as const })),
    ...items.filter(i => i.dwell > 10).map(i => ({ id: i.id, msg: `${i.lane}: High dwell ${i.dwell}h \u2014 exceeds 6h threshold, backlog risk at ${i.docks} docks`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: ArrowUpDown, title: "Throughput", desc: `${(totalThroughput / 1000).toFixed(1)}K units moved | ${(totalPending / 1000).toFixed(1)}K pending`, accent: totalPending > 5000 ? "text-red-500" : "text-blue-500" },
    { icon: Timer, title: "Avg Dwell", desc: `${avgDwell}h across ${items.length} lanes | target &lt;6h`, accent: avgDwell <= 6 ? "text-emerald-500" : "text-red-500" },
    { icon: Activity, title: "Sort Accuracy", desc: `${avgSortAcc}% avg | ${items.filter(i => i.sortAcc >= 99).length} lanes above 99%`, accent: avgSortAcc >= 98 ? "text-emerald-500" : "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center"><Warehouse className="h-4 w-4 text-indigo-600" /></div>
            <div><h3 className="text-sm font-bold">Cross-Dock Operations</h3><p className="text-xs opacity-60">{items.length} lanes | {zones.length} zones</p></div>
          </div>
          <div className="flex gap-1">
            {(["lanes", "throughput", "docks"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "lanes" ? "Lanes" : v === "throughput" ? "Throughput" : "Docks"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Lanes", items.length.toString(), Route, "bg-indigo-50/50")}
          {statCard("Dwell", `${avgDwell}h`, Clock, "bg-amber-50/50")}
          {statCard("Throughput", `${(totalThroughput / 1000).toFixed(1)}K`, TrendingUp, "bg-blue-50/50")}
          {statCard("Sort Acc", `${avgSortAcc}%`, CheckCircle, "bg-emerald-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {zones.map(t => {
            const active = activeFilters.zone === t
            return <span key={t} onClick={() => toggle("zone", active ? undefined : t)} className={`cdo-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="cdo-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="cdo-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="cdo-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Dock Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`cdo-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "lanes" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "Warning" || item.status === "Delayed"
              const tpPct = Math.round(item.throughput / item.volume * 100)
              return (
                <div key={item.id} className={`cdo-lane-card rounded-lg border p-2.5 bg-card ${isCritical ? "cdo-critical-pulse" : isWarning ? "cdo-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="cdo-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.lane}</span>
                      <span className={`cdo-mode-tag text-[10px] px-1.5 py-0.5 rounded ${modeColors[item.mode] || "bg-slate-100"}`}>{item.mode}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`cdo-pri-tag text-[10px] px-1.5 py-0.5 rounded ${priorityColors[item.priority] || "bg-slate-100"}`}>{item.priority}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "On Track" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><ArrowRight className="h-3 w-3 opacity-40" />{item.from} <span className="opacity-40">\u2192</span> {item.to}</div>
                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 opacity-40" />{item.carrier} | {item.docks} docks</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Dwell: <span className={item.dwell > 6 ? "text-red-600 font-semibold" : "text-foreground"}>{item.dwell}h</span> | Transfer: {item.transferTime}h</div>
                    <div className="flex items-center gap-1"><Activity className="h-3 w-3 opacity-40" />Throughput: <span className={`font-bold ${tpPct >= 95 ? "text-emerald-600" : tpPct >= 80 ? "text-amber-600" : "text-red-600"}`}>{tpPct}%</span></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Volume: <span className="font-bold">{item.volume.toLocaleString()}</span></div>
                    <div>Outbound: <span className="font-medium">{item.outbound.toLocaleString()}</span></div>
                    <div>Pending: <span className={`font-medium ${item.pending > 500 ? "text-red-600" : "text-foreground"}`}>{item.pending.toLocaleString()}</span></div>
                    <div>Sort Acc: <span className={`font-medium ${item.sortAcc >= 99 ? "text-emerald-600" : item.sortAcc >= 96 ? "text-amber-600" : "text-red-600"}`}>{item.sortAcc}%</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "throughput" && (
          <div className="space-y-2">
            <div className="cdo-tp-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{(totalThroughput / 1000).toFixed(1)}K</div><div className="text-[10px] opacity-50">Total Moved</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.round(items.reduce((s, i) => s + i.throughput, 0) / items.reduce((s, i) => s + i.volume, 0) * 100)}%</div><div className="text-[10px] opacity-50">Avg Throughput %</div></div>
                <div><div className="text-lg font-bold text-red-600">{(totalPending / 1000).toFixed(1)}K</div><div className="text-[10px] opacity-50">Total Pending</div></div>
                <div><div className="text-lg font-bold text-blue-600">{Math.round(items.reduce((s, i) => s + i.transferTime, 0) / items.length)}h</div><div className="text-[10px] opacity-50">Avg Transfer</div></div>
              </div>
            </div>
            {items.sort((a, b) => (a.throughput / a.volume) - (b.throughput / b.volume)).map(item => {
              const tpPct = Math.round(item.throughput / item.volume * 100)
              return (
              <div key={item.id} className={`cdo-tp-row rounded-lg border p-2 bg-card ${tpPct < 70 ? "cdo-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.lane}</span>
                    <span className="text-[10px] text-muted-foreground">{item.mode}</span>
                  </div>
                  <span className={`text-xs font-bold ${tpPct >= 95 ? "text-emerald-600" : tpPct >= 80 ? "text-amber-600" : "text-red-600"}`}>{tpPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${tpPct >= 95 ? "bg-emerald-500" : tpPct >= 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${tpPct}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Dwell: <span className={`font-medium ${item.dwell > 6 ? "text-red-600" : "text-foreground"}`}>{item.dwell}h</span></div>
                  <div>Transfer: <span className="font-medium">{item.transferTime}h</span></div>
                  <div>Sort: <span className="font-medium">{item.sortAcc}%</span></div>
                  <div>Pending: <span className={`font-medium ${item.pending > 500 ? "text-red-600" : "text-foreground"}`}>{item.pending.toLocaleString()}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}

        {view === "docks" && (
          <div className="space-y-2">
            <div className="cdo-dock-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-indigo-600">{items.reduce((s, i) => s + i.docks, 0)}</div><div className="text-[10px] opacity-50">Total Docks</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.status === "On Track").length}/{items.length}</div><div className="text-[10px] opacity-50">On Track</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.status === "Critical").length}</div><div className="text-[10px] opacity-50">Critical Lanes</div></div>
                <div><div className="text-lg font-bold text-purple-600">{items.filter(i => i.priority === "Critical").length}</div><div className="text-[10px] opacity-50">Critical Priority</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.docks - a.docks).map(item => (
              <div key={item.id} className="cdo-dock-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.lane}</span>
                    <span className={`cdo-pri-tag text-[10px] px-1.5 py-0.5 rounded ${priorityColors[item.priority] || "bg-slate-100"}`}>{item.priority}</span>
                  </div>
                  <span className="text-xs font-bold">{item.docks} docks</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.status === "On Track" ? "bg-emerald-500" : item.status === "Critical" ? "bg-red-500" : "bg-amber-500"}`} style={{ width: `${Math.min(item.docks / 15 * 100, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>From: <span className="font-medium">{item.from}</span></div>
                  <div>To: <span className="font-medium">{item.to}</span></div>
                  <div>Carrier: <span className="font-medium">{item.carrier}</span></div>
                  <div>Status: <span className={`font-medium ${statusColors[item.status] || "text-foreground"}`}>{item.status}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
