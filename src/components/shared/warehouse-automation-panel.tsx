"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Bot, Cpu, Wrench, Zap, AlertTriangle, Clock,
  Activity, Target,
  XCircle, Wifi, Thermometer
} from "lucide-react"

const raw = [
  { id: "WAM-01", name: "AutoStore-M1", type: "AS/RS Shuttle", zone: "A-Pick-Fast", dc: "Mumbai DC-1", status: "Running", uptime: 98.2, cycles: 4200, cycleCapacity: 4500, errors: 2, lastError: "Bin mispick", temp: 42, utilization: 93, speed: "3.5m/s", maintDue: "2026-08-20", roi: "18 months", integrations: ["WMS", "WCS"], warranty: "Active" },
  { id: "WAM-02", name: "Sorter-S8", type: "Belt Sorter", zone: "B-Dispatch", dc: "Delhi DC-2", status: "Running", uptime: 96.8, cycles: 6800, cycleCapacity: 7200, errors: 5, lastError: "Jam at gate 4", temp: 48, utilization: 94, speed: "2.2m/s", maintDue: "Overdue", roi: "12 months", integrations: ["WMS", "SCADA"], warranty: "Expired" },
  { id: "WAM-03", name: "AGV-F12", type: "AMR Robot", zone: "C-Storage", dc: "Bengaluru DC-3", status: "Running", uptime: 94.5, cycles: 1800, cycleCapacity: 2000, errors: 8, lastError: "Path blocked", temp: 35, utilization: 90, speed: "1.8m/s", maintDue: "2026-08-25", roi: "14 months", integrations: ["WCS", "Fleet"], warranty: "Active" },
  { id: "WAM-04", name: "Palletizer-P3", type: "Robotic Arm", zone: "D-Shipping", dc: "Chennai DC-6", status: "Maintenance", uptime: 88.2, cycles: 1200, cycleCapacity: 1500, errors: 15, lastError: "Gripper misalign", temp: 52, utilization: 80, speed: "8 cycles/min", maintDue: "In Progress", roi: "24 months", integrations: ["WMS", "PLC"], warranty: "Active" },
  { id: "WAM-05", name: "Conveyor-L5", type: "Conveyor System", zone: "A-Receiving", dc: "Kolkata DC-5", status: "Running", uptime: 99.1, cycles: 8200, cycleCapacity: 8400, errors: 1, lastError: "Sensor false read", temp: 44, utilization: 98, speed: "1.5m/s", maintDue: "2026-09-01", roi: "10 months", integrations: ["WCS", "SCADA"], warranty: "Active" },
  { id: "WAM-06", name: "PickBot-R2", type: "Goods-to-Person", zone: "A-Pick-Fast", dc: "Hyderabad DC-4", status: "Error", uptime: 82.4, cycles: 800, cycleCapacity: 2000, errors: 22, lastError: "Lift motor failure", temp: 55, utilization: 40, speed: "2.0m/s", maintDue: "Overdue", roi: "20 months", integrations: ["WMS"], warranty: "Expired" },
  { id: "WAM-07", name: "AutoStore-M2", type: "AS/RS Shuttle", zone: "B-Storage", dc: "Mumbai DC-1", status: "Running", uptime: 97.8, cycles: 3800, cycleCapacity: 4500, errors: 3, lastError: "Battery low alert", temp: 40, utilization: 84, speed: "3.5m/s", maintDue: "2026-08-18", roi: "18 months", integrations: ["WMS", "WCS"], warranty: "Active" },
  { id: "WAM-08", name: "Depal-D1", type: "Depalletizer", zone: "C-Receiving", dc: "Delhi DC-2", status: "Running", uptime: 95.5, cycles: 2200, cycleCapacity: 2400, errors: 6, lastError: "Layer shift detect", temp: 46, utilization: 92, speed: "6 layers/min", maintDue: "2026-08-30", roi: "16 months", integrations: ["WCS", "PLC"], warranty: "Active" },
  { id: "WAM-09", name: "AGV-F18", type: "AMR Robot", zone: "E-VAS", dc: "Bengaluru DC-3", status: "Offline", uptime: 0, cycles: 0, cycleCapacity: 2000, errors: 0, lastError: "None", temp: 28, utilization: 0, speed: "0", maintDue: "Scheduled", roi: "14 months", integrations: ["Fleet"], warranty: "Active" },
  { id: "WAM-10", name: "WrapMaster-W1", type: "Stretch Wrapper", zone: "D-Shipping", dc: "Chennai DC-6", status: "Running", uptime: 99.5, cycles: 5200, cycleCapacity: 5400, errors: 1, lastError: "Film roll end", temp: 38, utilization: 96, speed: "25 pallets/hr", maintDue: "2026-09-10", roi: "8 months", integrations: ["WMS", "PLC"], warranty: "Active" },
]

interface WAMItem {
  id: string; name: string; type: string; zone: string; dc: string
  status: string; uptime: number; cycles: number; cycleCapacity: number
  errors: number; lastError: string; temp: number; utilization: number
  speed: string; maintDue: string; roi: string; integrations: string[]; warranty: string
}

const items: WAMItem[] = raw.map((r: any) => ({
  id: r.id, name: r.name, type: r.type, zone: r.zone, dc: r.dc,
  status: r.status, uptime: r.uptime, cycles: r.cycles, cycleCapacity: r.cycleCapacity,
  errors: r.errors, lastError: r.lastError, temp: r.temp, utilization: r.utilization,
  speed: r.speed, maintDue: r.maintDue, roi: r.roi, integrations: r.integrations, warranty: r.warranty,
}))

const statusColors: Record<string, string> = {
  "Running": "text-emerald-600 font-semibold", "Maintenance": "text-amber-600 font-semibold",
  "Error": "text-red-600 font-semibold", "Offline": "text-slate-500 font-semibold",
}
const typeColors: Record<string, string> = {
  "AS/RS Shuttle": "bg-purple-100 text-purple-700", "Belt Sorter": "bg-blue-100 text-blue-700",
  "AMR Robot": "bg-emerald-100 text-emerald-700", "Robotic Arm": "bg-amber-100 text-amber-700",
  "Conveyor System": "bg-cyan-100 text-cyan-700", "Goods-to-Person": "bg-indigo-100 text-indigo-700",
  "Depalletizer": "bg-orange-100 text-orange-700", "Stretch Wrapper": "bg-teal-100 text-teal-700",
}
const types = [...new Set(items.map(i => i.type))]
const totalCycles = items.reduce((s, i) => s + i.cycles, 0)
const avgUptime = (items.filter(i => i.uptime > 0).reduce((s, i) => s + i.uptime, 0) / items.filter(i => i.uptime > 0).length).toFixed(1)
const errorMachines = items.filter(i => i.status === "Error" || i.errors > 10)

type Rec = any
type FV = Record<string, string>
type VT = "machines" | "utilization" | "maintenance"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`wam-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function WarehouseAutomationPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("machines")

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
    { icon: Activity, title: "Uptime", desc: `${avgUptime}% avg uptime`, accent: "text-emerald-500" },
    { icon: Target, title: "Cycles", desc: `${(totalCycles / 1000).toFixed(1)}K total cycles/day`, accent: "text-indigo-500" },
    { icon: Zap, title: "Errors", desc: `${errorMachines.length} machines with issues`, accent: "text-red-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Error").map(i => ({ id: i.id, msg: `${i.name}: ${i.lastError} \u2014 ${i.errors} errors, ${i.uptime}% uptime`, severity: "critical" as const })),
    ...items.filter(i => i.maintDue === "Overdue").map(i => ({ id: i.id, msg: `${i.name}: Maintenance overdue \u2014 warranty ${i.warranty}`, severity: "critical" as const })),
    ...items.filter(i => i.temp > 50).map(i => ({ id: i.id, msg: `${i.name}: High temp ${i.temp}\u00b0C \u2014 ${i.zone}`, severity: "warning" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center"><Bot className="h-4 w-4 text-violet-600" /></div>
            <div><h3 className="text-sm font-bold">Warehouse Automation</h3><p className="text-xs opacity-60">{items.length} machines | {types.length} types</p></div>
          </div>
          <div className="flex gap-1">
            {(["machines", "utilization", "maintenance"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "machines" ? "Machines" : v === "utilization" ? "Utilization" : "Maint."}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Uptime", `${avgUptime}%`, Activity, "bg-violet-50/50")}
          {statCard("Cycles", `${(totalCycles / 1000).toFixed(1)}K/day`, Zap, "bg-indigo-50/50")}
          {statCard("Running", `${items.filter(i => i.status === "Running").length}/${items.length}`, CheckCircle, "bg-emerald-50/50")}
          {statCard("Errors", `${items.reduce((s, i) => s + i.errors, 0)} total`, AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {types.map(t => {
            const active = activeFilters.type === t
            return <span key={t} onClick={() => toggle("type", active ? undefined : t)} className={`wam-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="wam-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="wam-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="wam-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Automation Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`wam-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "machines" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isError = item.status === "Error"
              const isMaint = item.status === "Maintenance"
              const cyclePct = item.cycleCapacity > 0 ? Math.round((item.cycles / item.cycleCapacity) * 100) : 0
              return (
                <div key={item.id} className={`wam-machine-card rounded-lg border p-2.5 bg-card ${isError ? "wam-critical-pulse" : isMaint ? "wam-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="wam-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">{item.id}</span>
                      <span className={`wam-type-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {item.status === "Running" ? <Wifi className="h-3 w-3 text-emerald-500" /> : isError ? <XCircle className="h-3 w-3 text-red-500" /> : <Wrench className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Cpu className="h-3 w-3 opacity-40" />{item.name} | {item.dc}</div>
                    <div className="flex items-center gap-1"><Target className="h-3 w-3 opacity-40" />{item.zone} | Speed: {item.speed}</div>
                    <div className="flex items-center gap-1"><Thermometer className="h-3 w-3 opacity-40" />Temp: {item.temp}\u00b0C | {item.integrations.join("+")}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Cycles: {item.cycles}/{item.cycleCapacity} | ROI: {item.roi}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Uptime: <span className={`font-bold ${item.uptime >= 97 ? "text-emerald-600" : item.uptime >= 90 ? "text-amber-600" : "text-red-600"}`}>{item.uptime}%</span></div>
                    <div>Util: <span className={`font-bold ${item.utilization >= 95 ? "text-amber-600" : item.utilization >= 80 ? "text-emerald-600" : "text-red-600"}`}>{item.utilization}%</span></div>
                    <div>Errors: <span className={`font-bold ${item.errors > 10 ? "text-red-600" : item.errors > 0 ? "text-amber-600" : "text-emerald-600"}`}>{item.errors}</span></div>
                    <div>Warranty: <span className={`font-medium ${item.warranty === "Expired" ? "text-red-600" : "text-emerald-600"}`}>{item.warranty}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "utilization" && (
          <div className="space-y-2">
            <div className="wam-util-header rounded-lg border p-2 bg-violet-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{Math.round(items.filter(i => i.utilization > 0).reduce((s, i) => s + i.utilization, 0) / items.filter(i => i.utilization > 0).length)}%</div><div className="text-[10px] opacity-50">Avg Utilization</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{(totalCycles / 1000).toFixed(1)}K</div><div className="text-[10px] opacity-50">Total Cycles</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.utilization >= 95).length}</div><div className="text-[10px] opacity-50">Maxed Out</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.utilization > 0 && i.utilization < 50).length}</div><div className="text-[10px] opacity-50">Underutilized</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.utilization - a.utilization).map(item => {
              const cyclePct = item.cycleCapacity > 0 ? Math.round((item.cycles / item.cycleCapacity) * 100) : 0
              return (
                <div key={item.id} className="wam-util-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.name}</span>
                      <span className="text-[10px] opacity-50">{item.type}</span>
                    </div>
                    <span className={`text-xs font-bold ${item.utilization >= 95 ? "text-amber-600" : item.utilization >= 80 ? "text-emerald-600" : "text-red-600"}`}>{item.utilization > 0 ? `${item.utilization}%` : "Off"}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.utilization >= 95 ? "bg-amber-500" : item.utilization >= 80 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${item.utilization}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Cycles: <span className="font-medium">{item.cycles.toLocaleString()}/{item.cycleCapacity.toLocaleString()}</span></div>
                    <div>Cycle %: <span className="font-medium">{cyclePct}%</span></div>
                    <div>Uptime: <span className="font-medium">{item.uptime}%</span></div>
                    <div>Temp: <span className={`font-medium ${item.temp > 50 ? "text-red-600" : "text-foreground"}`}>{item.temp}\u00b0C</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "maintenance" && (
          <div className="space-y-2">
            <div className="wam-maint-header rounded-lg border p-2 bg-amber-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.maintDue === "Overdue").length}</div><div className="text-[10px] opacity-50">Overdue</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.status === "Maintenance").length}</div><div className="text-[10px] opacity-50">In Maint.</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.warranty === "Expired").length}</div><div className="text-[10px] opacity-50">Warranty Expired</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.reduce((s, i) => s + i.errors, 0)}</div><div className="text-[10px] opacity-50">Total Errors</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.uptime - b.uptime).map(item => (
              <div key={item.id} className="wam-maint-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.name}</span>
                    <span className="text-[10px] opacity-50">{item.dc}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] ${item.maintDue === "Overdue" ? "text-red-600 font-semibold" : item.maintDue === "In Progress" ? "text-amber-600" : "text-muted-foreground"}`}>{item.maintDue}</span>
                    <span className={`text-[10px] ${item.warranty === "Expired" ? "text-red-600" : "text-emerald-600"}`}>{item.warranty}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.uptime >= 97 ? "bg-emerald-500" : item.uptime >= 90 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.uptime}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Uptime: <span className="font-medium">{item.uptime}%</span></div>
                  <div>Errors: <span className={`font-medium ${item.errors > 10 ? "text-red-600" : "text-foreground"}`}>{item.errors}</span></div>
                  <div>Last: <span className="font-medium">{item.lastError}</span></div>
                  <div>ROI: <span className="font-medium">{item.roi}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
