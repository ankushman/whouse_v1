"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Box, Layers, LayoutGrid, Cpu, Target, Zap, Activity,
  AlertTriangle, CheckCircle, XCircle, Clock
} from "lucide-react"

const raw = [
  { id: "WDT-01", twin: "DC1-Mumbai-Main", warehouse: "Mumbai DC1", syncStatus: "Live", accuracy: 98.2, lastSync: "30s ago", zones: 12, slots: 4800, used: 3840, throughput: 1250, bottleneck: "Zone A Pick", simulation: "Running", whatIf: "Add 2 Pickers to Zone A", improvement: 15, mirrorLatency: 200, dataPoints: 24000, modelVersion: "v3.8", status: "Optimal", city: "Mumbai", floors: 3, area: 45000 },
  { id: "WDT-02", twin: "DC2-Delhi-Hub", warehouse: "Delhi DC2", syncStatus: "Live", accuracy: 97.5, lastSync: "45s ago", zones: 15, slots: 6200, used: 5580, throughput: 1580, bottleneck: "Outbound Staging", simulation: "Idle", whatIf: "Expand Staging Area by 200sqft", improvement: 22, mirrorLatency: 350, dataPoints: 32000, modelVersion: "v3.8", status: "At Risk", city: "Delhi", floors: 4, area: 62000 },
  { id: "WDT-03", twin: "DC3-Bengaluru-South", warehouse: "Bengaluru DC3", syncStatus: "Live", accuracy: 99.1, lastSync: "15s ago", zones: 10, slots: 4000, used: 2800, throughput: 980, bottleneck: "None", simulation: "Completed", whatIf: "Optimal Layout Confirmed", improvement: 8, mirrorLatency: 150, dataPoints: 18000, modelVersion: "v3.9", status: "Optimal", city: "Bengaluru", floors: 2, area: 35000 },
  { id: "WDT-04", twin: "DC4-Chennai-East", warehouse: "Chennai DC4", syncStatus: "Delayed", accuracy: 92.8, lastSync: "5m ago", zones: 8, slots: 3200, used: 2880, throughput: 720, bottleneck: "Receiving Dock", simulation: "Failed", whatIf: "N/A", improvement: 0, mirrorLatency: 2000, dataPoints: 8500, modelVersion: "v3.7", status: "Degraded", city: "Chennai", floors: 2, area: 28000 },
  { id: "WDT-05", twin: "DC5-Hyderabad-Central", warehouse: "Hyderabad DC5", syncStatus: "Live", accuracy: 96.4, lastSync: "1m ago", zones: 11, slots: 4400, used: 3960, throughput: 1100, bottleneck: "Cold Room C", simulation: "Running", whatIf: "Reallocate Cold Storage Zone", improvement: 18, mirrorLatency: 400, dataPoints: 21000, modelVersion: "v3.8", status: "At Risk", city: "Hyderabad", floors: 3, area: 40000 },
  { id: "WDT-06", twin: "DC6-Pune-West", warehouse: "Pune DC6", syncStatus: "Live", accuracy: 98.8, lastSync: "20s ago", zones: 9, slots: 3600, used: 2520, throughput: 890, bottleneck: "None", simulation: "Idle", whatIf: "Test 3-Shift Model", improvement: 12, mirrorLatency: 180, dataPoints: 15000, modelVersion: "v3.9", status: "Optimal", city: "Pune", floors: 2, area: 32000 },
  { id: "WDT-07", twin: "DC7-Kolkata-East", warehouse: "Kolkata DC7", syncStatus: "Offline", accuracy: 85.2, lastSync: "2h ago", zones: 7, slots: 2800, used: 2520, throughput: 0, bottleneck: "System Down", simulation: "Stopped", whatIf: "N/A", improvement: 0, mirrorLatency: 9999, dataPoints: 0, modelVersion: "v3.7", status: "Offline", city: "Kolkata", floors: 2, area: 24000 },
  { id: "WDT-08", twin: "DC8-Ahmedabad-West", warehouse: "Ahmedabad DC8", syncStatus: "Live", accuracy: 97.9, lastSync: "25s ago", zones: 10, slots: 5000, used: 3500, throughput: 1050, bottleneck: "Sortation Area", simulation: "Running", whatIf: "Add Secondary Sorter", improvement: 25, mirrorLatency: 220, dataPoints: 22000, modelVersion: "v3.8", status: "Optimal", city: "Ahmedabad", floors: 3, area: 48000 },
  { id: "WDT-09", twin: "DC9-Jaipur-North", warehouse: "Jaipur DC9", syncStatus: "Live", accuracy: 99.5, lastSync: "10s ago", zones: 8, slots: 3200, used: 2240, throughput: 750, bottleneck: "None", simulation: "Completed", whatIf: "Night Shift Optimization", improvement: 10, mirrorLatency: 120, dataPoints: 12000, modelVersion: "v3.9", status: "Optimal", city: "Jaipur", floors: 2, area: 30000 },
  { id: "WDT-10", twin: "DC10-Lucknow-North", warehouse: "Lucknow DC10", syncStatus: "Syncing", accuracy: 94.1, lastSync: "30s ago", zones: 6, slots: 2400, used: 2160, throughput: 580, bottleneck: "Putaway Zone", simulation: "Queued", whatIf: "Auto-Slot Reassignment", improvement: 16, mirrorLatency: 800, dataPoints: 9500, modelVersion: "v3.7", status: "At Risk", city: "Lucknow", floors: 2, area: 22000 },
]

interface WDTItem {
  id: string; twin: string; warehouse: string; syncStatus: string; accuracy: number
  lastSync: string; zones: number; slots: number; used: number; throughput: number
  bottleneck: string; simulation: string; whatIf: string; improvement: number
  mirrorLatency: number; dataPoints: number; modelVersion: string; status: string
  city: string; floors: number; area: number
}

const items: WDTItem[] = raw.map((r: any) => ({
  id: r.id, twin: r.twin, warehouse: r.warehouse, syncStatus: r.syncStatus, accuracy: r.accuracy,
  lastSync: r.lastSync, zones: r.zones, slots: r.slots, used: r.used, throughput: r.throughput,
  bottleneck: r.bottleneck, simulation: r.simulation, whatIf: r.whatIf, improvement: r.improvement,
  mirrorLatency: r.mirrorLatency, dataPoints: r.dataPoints, modelVersion: r.modelVersion,
  status: r.status, city: r.city, floors: r.floors, area: r.area,
}))

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "At Risk": "text-amber-600 font-semibold",
  "Degraded": "text-orange-600 font-semibold", "Offline": "text-red-600 font-semibold",
}
const syncColors: Record<string, string> = {
  "Live": "bg-emerald-100 text-emerald-700", "Delayed": "bg-amber-100 text-amber-700",
  "Offline": "bg-red-100 text-red-700", "Syncing": "bg-blue-100 text-blue-700",
}
const simColors: Record<string, string> = {
  "Running": "bg-blue-100 text-blue-700", "Idle": "bg-slate-100 text-slate-700",
  "Completed": "bg-emerald-100 text-emerald-700", "Failed": "bg-red-100 text-red-700",
  "Stopped": "bg-gray-100 text-gray-700", "Queued": "bg-amber-100 text-amber-700",
}
const syncStatuses = [...new Set(items.map(i => i.syncStatus))]
const liveCount = items.filter(i => i.syncStatus === "Live").length
const avgAccuracy = (items.filter(i => i.syncStatus !== "Offline").reduce((s, i) => s + i.accuracy, 0) / items.filter(i => i.syncStatus !== "Offline").length).toFixed(1)
const totalDataPoints = items.reduce((s, i) => s + i.dataPoints, 0)

type Rec = any
type FV = Record<string, string>
type VT = "twins" | "simulation" | "capacity"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`wdt-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function WarehouseDigitalTwinPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("twins")

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
    ...items.filter(i => i.status === "Offline").map(i => ({ id: i.id, msg: `${i.twin}: System OFFLINE \u2014 last sync ${i.lastSync}, accuracy ${i.accuracy}%`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Degraded").map(i => ({ id: i.id, msg: `${i.twin}: Degraded \u2014 accuracy ${i.accuracy}%, latency ${i.mirrorLatency}ms`, severity: "warning" as const })),
    ...items.filter(i => i.simulation === "Failed").map(i => ({ id: i.id, msg: `${i.twin}: Simulation FAILED \u2014 bottleneck: ${i.bottleneck}`, severity: "warning" as const })),
    ...items.filter(i => i.used / i.slots > 0.9).map(i => ({ id: i.id, msg: `${i.twin}: Capacity at ${Math.round((i.used / i.slots) * 100)}% \u2014 ${i.warehouse}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Activity, title: "Live Twins", desc: `${liveCount}/${items.length} mirrors actively syncing`, accent: "text-emerald-500" },
    { icon: Target, title: "Accuracy", desc: `${avgAccuracy}% avg model accuracy`, accent: "text-blue-500" },
    { icon: Cpu, title: "Data Points", desc: `${(totalDataPoints / 1000).toFixed(0)}K real-time data feeds`, accent: "text-purple-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center"><Box className="h-4 w-4 text-purple-600" /></div>
            <div><h3 className="text-sm font-bold">Warehouse Digital Twin</h3><p className="text-xs opacity-60">{items.length} twins | {syncStatuses.length} sync states</p></div>
          </div>
          <div className="flex gap-1">
            {(["twins", "simulation", "capacity"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "twins" ? "Twins" : v === "simulation" ? "Simulation" : "Capacity"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Live", `${liveCount}/${items.length}`, Activity, "bg-purple-50/50")}
          {statCard("Accuracy", `${avgAccuracy}%`, Target, "bg-blue-50/50")}
          {statCard("Throughput", `${items.reduce((s, i) => s + i.throughput, 0)}/hr`, Zap, "bg-emerald-50/50")}
          {statCard("Data", `${(totalDataPoints / 1000).toFixed(0)}K`, Cpu, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {syncStatuses.map(s => {
            const active = activeFilters.syncStatus === s
            return <span key={s} onClick={() => toggle("syncStatus", active ? undefined : s)} className={`wdt-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="wdt-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="wdt-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="wdt-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Twin Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`wdt-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "twins" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Offline"
              const isWarning = item.status === "Degraded"
              const utilPct = Math.round((item.used / Math.max(item.slots, 1)) * 100)
              return (
                <div key={item.id} className={`wdt-twin-card rounded-lg border p-2.5 bg-card ${isCritical ? "wdt-critical-pulse" : isWarning ? "wdt-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="wdt-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">{item.id}</span>
                      <span className={`wdt-sync-tag text-[10px] px-1.5 py-0.5 rounded ${syncColors[item.syncStatus] || "bg-slate-100"}`}>{item.syncStatus}</span>
                      <span className="wdt-version-tag text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">{item.modelVersion}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Optimal" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Box className="h-3 w-3 opacity-40" />{item.twin}</div>
                    <div className="flex items-center gap-1"><LayoutGrid className="h-3 w-3 opacity-40" />{item.warehouse} | {item.city}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Sync: {item.lastSync} | Latency: {item.mirrorLatency}ms</div>
                    <div className="flex items-center gap-1"><Layers className="h-3 w-3 opacity-40" />{item.zones} zones | {item.floors} floors | {(item.area / 1000).toFixed(0)}K sqft</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Accuracy: <span className={`font-bold ${item.accuracy >= 98 ? "text-emerald-600" : item.accuracy >= 95 ? "text-amber-600" : "text-red-600"}`}>{item.accuracy}%</span></div>
                    <div>Util: <span className="font-bold text-foreground">{utilPct}%</span></div>
                    <div>Throughput: <span className="font-medium">{item.throughput}/hr</span></div>
                    <div>Data: <span className="font-medium">{(item.dataPoints / 1000).toFixed(1)}K</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "simulation" && (
          <div className="space-y-2">
            <div className="wdt-sim-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.simulation === "Running").length}</div><div className="text-[10px] opacity-50">Running</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.simulation === "Completed").length}</div><div className="text-[10px] opacity-50">Completed</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.improvement > 0).reduce((s, i) => s + i.improvement, 0)}%</div><div className="text-[10px] opacity-50">Total Improvement</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.bottleneck !== "None" && i.bottleneck !== "System Down").length}</div><div className="text-[10px] opacity-50">Bottlenecks Found</div></div>
              </div>
            </div>
            {items.filter(i => i.bottleneck !== "None" || i.simulation !== "Idle").sort((a, b) => b.improvement - a.improvement).map(item => (
              <div key={item.id} className={`wdt-sim-row rounded-lg border p-2 bg-card ${item.simulation === "Failed" ? "wdt-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.twin}</span>
                    <span className={`wdt-sim-tag text-[10px] px-1.5 py-0.5 rounded ${simColors[item.simulation] || "bg-slate-100"}`}>{item.simulation}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.improvement > 20 ? "text-emerald-600" : item.improvement > 0 ? "text-amber-600" : "text-slate-500"}`}>{item.improvement > 0 ? `+${item.improvement}%` : "N/A"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground mb-1">
                  <div>Bottleneck: <span className={`font-medium ${item.bottleneck !== "None" && item.bottleneck !== "System Down" ? "text-red-600" : "text-foreground"}`}>{item.bottleneck}</span></div>
                  <div>What-If: <span className="font-medium">{item.whatIf}</span></div>
                </div>
                {item.improvement > 0 && (
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(item.improvement * 3, 100)}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {view === "capacity" && (
          <div className="space-y-2">
            <div className="wdt-cap-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.reduce((s, i) => s + i.slots, 0)}</div><div className="text-[10px] opacity-50">Total Slots</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.reduce((s, i) => s + i.used, 0)}</div><div className="text-[10px] opacity-50">Used Slots</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.round(items.reduce((s, i) => s + (i.used / Math.max(i.slots, 1)), 0) / items.length * 100)}%</div><div className="text-[10px] opacity-50">Avg Utilization</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{(items.reduce((s, i) => s + i.area, 0) / 1000).toFixed(0)}K sqft</div><div className="text-[10px] opacity-50">Total Area</div></div>
              </div>
            </div>
            {items.sort((a, b) => (b.used / Math.max(b.slots, 1)) - (a.used / Math.max(a.slots, 1))).map(item => {
              const utilPct = Math.round((item.used / Math.max(item.slots, 1)) * 100)
              return (
                <div key={item.id} className="wdt-cap-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.twin}</span>
                    </div>
                    <span className={`text-xs font-bold ${utilPct > 90 ? "text-red-600" : utilPct > 75 ? "text-amber-600" : "text-emerald-600"}`}>{utilPct}% ({item.used}/{item.slots})</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${utilPct > 90 ? "bg-red-500" : utilPct > 75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${utilPct}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Area: <span className="font-medium">{(item.area / 1000).toFixed(0)}K sqft</span></div>
                    <div>Zones: <span className="font-medium">{item.zones}</span></div>
                    <div>Throughput: <span className="font-medium">{item.throughput}/hr</span></div>
                    <div>Sync: <span className={`font-medium ${item.syncStatus === "Live" ? "text-emerald-600" : item.syncStatus === "Offline" ? "text-red-600" : "text-foreground"}`}>{item.syncStatus}</span></div>
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
