"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Waves, Users, Target, Zap, Package,
  CheckCircle, XCircle, AlertTriangle, Timer, Gauge, Layers
} from "lucide-react"

const raw = [
  { id: "OWM-01", wave: "W-20260802-01", type: "Single Order", zone: "Zone A - Pick Fast", picker: "Ravi K", orders: 45, lines: 128, picks: 198, completed: 198, sla: "2h", elapsed: 105, slaPercent: 100, accuracy: 99.5, uph: 113, status: "Completed", priority: "High", cutoff: "10:00 AM", release: "10:05 AM", dc: "Mumbai DC1", method: "Discrete" },
  { id: "OWM-02", wave: "W-20260802-02", type: "Batch", zone: "Zone B - Mid Flow", picker: "Suresh M", orders: 82, lines: 245, picks: 380, completed: 342, sla: "3h", elapsed: 165, slaPercent: 90, accuracy: 97.8, uph: 124, status: "In Progress", priority: "Medium", cutoff: "10:30 AM", release: "10:35 AM", dc: "Delhi DC2", method: "Batch Pick" },
  { id: "OWM-03", wave: "W-20260802-03", type: "Wave", zone: "Zone C - Bulk", picker: "Anita P", orders: 30, lines: 95, picks: 145, completed: 145, sla: "2.5h", elapsed: 120, slaPercent: 100, accuracy: 98.2, uph: 72, status: "Completed", priority: "Low", cutoff: "11:00 AM", release: "11:10 AM", dc: "Bengaluru DC3", method: "Wave Pick" },
  { id: "OWM-04", wave: "W-20260802-04", type: "Cluster", zone: "Zone A - Pick Fast", picker: "Deepak S", orders: 65, lines: 180, picks: 290, completed: 180, sla: "2h", elapsed: 130, slaPercent: 62, accuracy: 96.5, uph: 83, status: "Behind Schedule", priority: "High", cutoff: "11:30 AM", release: "11:32 AM", dc: "Mumbai DC1", method: "Cluster Pick" },
  { id: "OWM-05", wave: "W-20260802-05", type: "Zone", zone: "Zone D - Value Add", picker: "Kavita R", orders: 18, lines: 54, picks: 82, completed: 82, sla: "4h", elapsed: 200, slaPercent: 100, accuracy: 99.8, uph: 25, status: "Completed", priority: "Medium", cutoff: "09:00 AM", release: "09:15 AM", dc: "Chennai DC4", method: "Zone Pick" },
  { id: "OWM-06", wave: "W-20260802-06", type: "Single Order", zone: "Zone B - Mid Flow", picker: "Murugan V", orders: 55, lines: 165, picks: 255, completed: 0, sla: "2h", elapsed: 15, slaPercent: 100, accuracy: 0, uph: 0, status: "Queued", priority: "High", cutoff: "01:00 PM", release: "Pending", dc: "Hyderabad DC5", method: "Discrete" },
  { id: "OWM-07", wave: "W-20260802-07", type: "Batch", zone: "Zone A - Pick Fast", picker: "Thomas K", orders: 92, lines: 275, picks: 420, completed: 320, sla: "2.5h", elapsed: 160, slaPercent: 76, accuracy: 94.2, uph: 120, status: "At Risk", priority: "High", cutoff: "12:00 PM", release: "12:02 PM", dc: "Pune DC6", method: "Batch Pick" },
  { id: "OWM-08", wave: "W-20260802-08", type: "Wave", zone: "Zone E - Cold Store", picker: "Rajesh P", orders: 22, lines: 68, picks: 105, completed: 105, sla: "3h", elapsed: 145, slaPercent: 100, accuracy: 100, uph: 43, status: "Completed", priority: "Low", cutoff: "08:30 AM", release: "08:45 AM", dc: "Kolkata DC7", method: "Wave Pick" },
  { id: "OWM-09", wave: "W-20260802-09", type: "Cluster", zone: "Zone C - Bulk", picker: "Sanjay D", orders: 48, lines: 142, picks: 215, completed: 108, sla: "2h", elapsed: 95, slaPercent: 50, accuracy: 95.8, uph: 68, status: "Behind Schedule", priority: "Medium", cutoff: "12:30 PM", release: "12:35 PM", dc: "Ahmedabad DC8", method: "Cluster Pick" },
  { id: "OWM-10", wave: "W-20260802-10", type: "Zone", zone: "Zone A - Pick Fast", picker: "Harpal S", orders: 72, lines: 210, picks: 325, completed: 280, sla: "1.5h", elapsed: 75, slaPercent: 86, accuracy: 98.9, uph: 224, status: "In Progress", priority: "High", cutoff: "01:30 PM", release: "01:32 PM", dc: "Jaipur DC9", method: "Zone Pick" },
]

interface OWMItem {
  id: string; wave: string; type: string; zone: string; picker: string
  orders: number; lines: number; picks: number; completed: number; sla: string
  elapsed: number; slaPercent: number; accuracy: number; uph: number; status: string
  priority: string; cutoff: string; release: string; dc: string; method: string
}

const items: OWMItem[] = raw.map((r: any) => ({
  id: r.id, wave: r.wave, type: r.type, zone: r.zone, picker: r.picker,
  orders: r.orders, lines: r.lines, picks: r.picks, completed: r.completed,
  sla: r.sla, elapsed: r.elapsed, slaPercent: r.slaPercent, accuracy: r.accuracy,
  uph: r.uph, status: r.status, priority: r.priority, cutoff: r.cutoff,
  release: r.release, dc: r.dc, method: r.method,
}))

const statusColors: Record<string, string> = {
  "Completed": "text-emerald-600 font-semibold", "In Progress": "text-blue-600 font-semibold",
  "Behind Schedule": "text-red-600 font-semibold", "At Risk": "text-amber-600 font-semibold",
  "Queued": "text-slate-500 font-semibold",
}
const typeColors: Record<string, string> = {
  "Single Order": "bg-blue-100 text-blue-700", "Batch": "bg-purple-100 text-purple-700",
  "Wave": "bg-emerald-100 text-emerald-700", "Cluster": "bg-amber-100 text-amber-700",
  "Zone": "bg-teal-100 text-teal-700",
}
const priorityColors: Record<string, string> = {
  "High": "bg-red-100 text-red-700", "Medium": "bg-amber-100 text-amber-700",
  "Low": "bg-slate-100 text-slate-700",
}
const zones = [...new Set(items.map(i => i.zone))]
const types = [...new Set(items.map(i => i.type))]
const totalOrders = items.reduce((s, i) => s + i.orders, 0)
const totalPicks = items.reduce((s, i) => s + i.picks, 0)
const avgAccuracy = (items.filter(i => i.accuracy > 0).reduce((s, i) => s + i.accuracy, 0) / items.filter(i => i.accuracy > 0).length).toFixed(1)
const activeWaves = items.filter(i => i.status === "In Progress" || i.status === "Behind Schedule" || i.status === "At Risk").length

type Rec = any
type FV = Record<string, string>
type VT = "waves" | "performance" | "zones"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`owm-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function OrderWaveManagementPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("waves")

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
    ...items.filter(i => i.status === "Behind Schedule").map(i => ({ id: i.id, msg: `${i.wave}: Only ${i.slaPercent}% SLA \u2014 ${i.completed}/${i.picks} picks, ${i.elapsed}m elapsed`, severity: "critical" as const })),
    ...items.filter(i => i.status === "At Risk").map(i => ({ id: i.id, msg: `${i.wave}: Accuracy ${i.accuracy}%, picker ${i.picker}, ${i.method}`, severity: "warning" as const })),
    ...items.filter(i => i.accuracy > 0 && i.accuracy < 95).map(i => ({ id: i.id, msg: `${i.wave}: Low accuracy ${i.accuracy}% \u2014 ${i.zone}, ${i.dc}`, severity: "warning" as const })),
    ...items.filter(i => i.release === "Pending").map(i => ({ id: i.id, msg: `${i.wave}: Queued, ${i.orders} orders waiting release \u2014 cutoff ${i.cutoff}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Waves, title: "Active Waves", desc: `${activeWaves}/${items.length} waves in progress`, accent: "text-blue-500" },
    { icon: Target, title: "Accuracy", desc: `${avgAccuracy}% avg pick accuracy`, accent: "text-emerald-500" },
    { icon: Zap, title: "Throughput", desc: `${totalPicks} picks across ${totalOrders} orders`, accent: "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"><Waves className="h-4 w-4 text-blue-600" /></div>
            <div><h3 className="text-sm font-bold">Order Wave Management</h3><p className="text-xs opacity-60">{items.length} waves | {zones.length} zones</p></div>
          </div>
          <div className="flex gap-1">
            {(["waves", "performance", "zones"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "waves" ? "Waves" : v === "performance" ? "Performance" : "Zones"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Total Orders", totalOrders.toString(), ShoppingCart, "bg-blue-50/50")}
          {statCard("Active Waves", `${activeWaves}/${items.length}`, Waves, "bg-emerald-50/50")}
          {statCard("Accuracy", `${avgAccuracy}%`, Target, "bg-indigo-50/50")}
          {statCard("Total Picks", totalPicks.toString(), Zap, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {types.map(t => {
            const active = activeFilters.type === t
            return <span key={t} onClick={() => toggle("type", active ? undefined : t)} className={`owm-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {zones.map(z => {
            const active = activeFilters.zone === z
            return <span key={z} onClick={() => toggle("zone", active ? undefined : z)} className={`owm-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{z.split(" - ")[1] || z}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="owm-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="owm-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="owm-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Wave Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`owm-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "waves" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Behind Schedule"
              const isWarning = item.status === "At Risk"
              const pickPct = item.picks > 0 ? Math.round((item.completed / item.picks) * 100) : 0
              return (
                <div key={item.id} className={`owm-wave-card rounded-lg border p-2.5 bg-card ${isCritical ? "owm-critical-pulse" : isWarning ? "owm-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="owm-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{item.id}</span>
                      <span className={`owm-type-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                      <span className={`owm-priority-tag text-[10px] px-1.5 py-0.5 rounded ${priorityColors[item.priority] || "bg-slate-100"}`}>{item.priority}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Completed" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Users className="h-3 w-3 opacity-40" />{item.picker} | {item.wave}</div>
                    <div className="flex items-center gap-1"><Layers className="h-3 w-3 opacity-40" />{item.zone} | {item.dc}</div>
                    <div className="flex items-center gap-1"><Timer className="h-3 w-3 opacity-40" />Cutoff: {item.cutoff} | Release: {item.release}</div>
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.orders} orders | {item.lines} lines | {item.method}</div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${pickPct >= 100 ? "bg-emerald-500" : pickPct >= 75 ? "bg-blue-500" : pickPct >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(pickPct, 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Picks: <span className="font-bold text-foreground">{item.completed}/{item.picks}</span></div>
                    <div>SLA: <span className={`font-bold ${item.slaPercent < 70 ? "text-red-600" : item.slaPercent < 90 ? "text-amber-600" : "text-emerald-600"}`}>{item.slaPercent}%</span></div>
                    <div>Accuracy: <span className={`font-bold ${item.accuracy > 0 && item.accuracy < 95 ? "text-red-600" : "text-foreground"}`}>{item.accuracy > 0 ? `${item.accuracy}%` : "N/A"}</span></div>
                    <div>UPH: <span className="font-medium">{item.uph > 0 ? item.uph : "N/A"}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "performance" && (
          <div className="space-y-2">
            <div className="owm-perf-header rounded-lg border p-2 bg-indigo-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-indigo-600">{avgAccuracy}%</div><div className="text-[10px] opacity-50">Avg Accuracy</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.status === "Completed").length}</div><div className="text-[10px] opacity-50">Completed</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.round(items.filter(i => i.uph > 0).reduce((s, i) => s + i.uph, 0) / items.filter(i => i.uph > 0).length)}</div><div className="text-[10px] opacity-50">Avg UPH</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.status === "Behind Schedule").length}</div><div className="text-[10px] opacity-50">Behind Schedule</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.uph - a.uph).map(item => {
              const pickPct = item.picks > 0 ? Math.round((item.completed / item.picks) * 100) : 0
              return (
                <div key={item.id} className="owm-perf-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.wave}</span>
                      <span className="text-[10px] opacity-50">{item.picker}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="h-3 w-3 opacity-50" />
                      <span className={`text-xs font-bold ${item.uph > 100 ? "text-emerald-600" : item.uph > 50 ? "text-amber-600" : "text-slate-600"}`}>{item.uph} UPH</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.accuracy >= 98 ? "bg-emerald-500" : item.accuracy >= 95 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(item.accuracy, 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Accuracy: <span className={`font-medium ${item.accuracy < 95 ? "text-red-600" : "text-foreground"}`}>{item.accuracy > 0 ? `${item.accuracy}%` : "N/A"}</span></div>
                    <div>Picks: <span className="font-medium">{item.completed}/{item.picks} ({pickPct}%)</span></div>
                    <div>SLA: <span className="font-medium">{item.slaPercent}%</span></div>
                    <div>Elapsed: <span className="font-medium">${item.elapsed}m</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "zones" && (
          <div className="space-y-2">
            <div className="owm-zones-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{zones.length}</div><div className="text-[10px] opacity-50">Active Zones</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.status === "Completed").reduce((s, i) => s + i.picks, 0)}</div><div className="text-[10px] opacity-50">Completed Picks</div></div>
                <div><div className="text-lg font-bold text-amber-600">{types.length}</div><div className="text-[10px] opacity-50">Pick Methods</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{new Set(items.map(i => i.dc)).size}</div><div className="text-[10px] opacity-50">DCs Active</div></div>
              </div>
            </div>
            {zones.map(zone => {
              const zItems = items.filter(i => i.zone === zone)
              const totalPicksZ = zItems.reduce((s, i) => s + i.picks, 0)
              const completedZ = zItems.reduce((s, i) => s + i.completed, 0)
              const pctZ = totalPicksZ > 0 ? Math.round((completedZ / totalPicksZ) * 100) : 0
              const avgUPHz = zItems.filter(i => i.uph > 0).reduce((s, i) => s + i.uph, 0) / Math.max(zItems.filter(i => i.uph > 0).length, 1)
              return (
                <div key={zone} className="owm-zone-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{zone}</span>
                      <span className="text-[10px] opacity-50">{zItems.length} wave(s)</span>
                    </div>
                    <span className={`text-xs font-bold ${pctZ >= 90 ? "text-emerald-600" : pctZ >= 70 ? "text-amber-600" : "text-red-600"}`}>{pctZ}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${pctZ >= 90 ? "bg-emerald-500" : pctZ >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pctZ}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Picks: <span className="font-medium">{completedZ}/{totalPicksZ}</span></div>
                    <div>Orders: <span className="font-medium">{zItems.reduce((s, i) => s + i.orders, 0)}</span></div>
                    <div>Avg UPH: <span className="font-medium">{Math.round(avgUPHz)}</span></div>
                    <div>Methods: <span className="font-medium">{new Set(zItems.map(i => i.method)).size}</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {zItems.map(i => <span key={i.id} className={`text-[9px] px-1 py-0.5 rounded ${i.status === "Completed" ? "bg-emerald-100 text-emerald-700" : i.status === "Behind Schedule" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{i.wave.split("-").pop()}</span>)}
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
