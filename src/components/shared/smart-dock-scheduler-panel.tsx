"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CalendarClock, Truck, Clock, Timer, MapPin, Package, Wrench,
  AlertTriangle, CheckCircle, XCircle, Warehouse, Zap
} from "lucide-react"

const raw = [
  { id: "SDS-01", dock: "D-01", type: "Inbound", vehicle: "MH-12-AB-1234", carrier: "TCI Express", appointment: "08:00 AM", checkIn: "07:45 AM", checkOut: null, status: "Loading", dwell: 85, maxDwell: 120, dockUtil: 71, pallets: 48, weight: 8200, warehouse: "Mumbai DC1", gate: "Gate A", priority: "High", nextAppt: "11:00 AM", equipment: "Forklift" },
  { id: "SDS-02", dock: "D-02", type: "Outbound", vehicle: "DL-04-CD-5678", carrier: "Delhivery", appointment: "08:30 AM", checkIn: "08:20 AM", checkOut: null, status: "Unloading", dwell: 55, maxDwell: 90, dockUtil: 61, pallets: 32, weight: 5400, warehouse: "Delhi DC2", gate: "Gate B", priority: "Medium", nextAppt: "12:00 PM", equipment: "Conveyor" },
  { id: "SDS-03", dock: "D-03", type: "Crossdock", vehicle: "KA-01-EF-9012", carrier: "Rivigo", appointment: "09:00 AM", checkIn: "09:00 AM", checkOut: null, status: "Waiting", dwell: 0, maxDwell: 60, dockUtil: 0, pallets: 65, weight: 12000, warehouse: "Bengaluru DC3", gate: "Gate C", priority: "High", nextAppt: "10:00 AM", equipment: "Pallet Jack" },
  { id: "SDS-04", dock: "D-04", type: "Inbound", vehicle: "TS-08-GH-3456", carrier: "Snowman", appointment: "07:00 AM", checkIn: "07:00 AM", checkOut: "09:15 AM", status: "Completed", dwell: 135, maxDwell: 120, dockUtil: 100, pallets: 24, weight: 1800, warehouse: "Hyderabad DC5", gate: "Gate A", priority: "Low", nextAppt: "02:00 PM", equipment: "Forklift" },
  { id: "SDS-05", dock: "D-05", type: "Outbound", vehicle: "WB-02-IJ-7890", carrier: "Ecom Express", appointment: "09:30 AM", checkIn: null, checkOut: null, status: "Scheduled", dwell: 0, maxDwell: 90, dockUtil: 0, pallets: 88, weight: 15000, warehouse: "Kolkata DC7", gate: "Gate D", priority: "High", nextAppt: "09:30 AM", equipment: "Conveyor" },
  { id: "SDS-06", dock: "D-06", type: "Inbound", vehicle: "TN-09-KL-2345", carrier: "Safexpress", appointment: "10:00 AM", checkIn: "09:50 AM", checkOut: null, status: "Delayed", dwell: 40, maxDwell: 60, dockUtil: 67, pallets: 55, weight: 9800, warehouse: "Chennai DC4", gate: "Gate B", priority: "Medium", nextAppt: "01:00 PM", equipment: "Reach Truck" },
  { id: "SDS-07", dock: "D-07", type: "Outbound", vehicle: "MH-14-MN-6789", carrier: "BlueDart", appointment: "10:30 AM", checkIn: "10:25 AM", checkOut: null, status: "Unloading", dwell: 20, maxDwell: 75, dockUtil: 27, pallets: 42, weight: 7200, warehouse: "Pune DC6", gate: "Gate C", priority: "High", nextAppt: "03:00 PM", equipment: "Forklift" },
  { id: "SDS-08", dock: "D-08", type: "Crossdock", vehicle: "GJ-01-OP-0123", carrier: "Container Corp", appointment: "08:00 AM", checkIn: "07:55 AM", checkOut: "10:10 AM", status: "Completed", dwell: 135, maxDwell: 120, dockUtil: 100, pallets: 40, weight: 22000, warehouse: "Ahmedabad DC8", gate: "Gate A", priority: "Low", nextAppt: "04:00 PM", equipment: "Reach Truck" },
  { id: "SDS-09", dock: "D-09", type: "Inbound", vehicle: "HR-26-QR-4567", carrier: "XpressBees", appointment: "11:00 AM", checkIn: null, checkOut: null, status: "No Show", dwell: 0, maxDwell: 60, dockUtil: 0, pallets: 28, weight: 4600, warehouse: "Jaipur DC9", gate: "Gate D", priority: "Medium", nextAppt: "11:00 AM", equipment: "Pallet Jack" },
  { id: "SDS-10", dock: "D-10", type: "Outbound", vehicle: "KL-08-ST-8901", carrier: "Shadowfax", appointment: "07:30 AM", checkIn: "07:30 AM", checkOut: null, status: "Overtime", dwell: 185, maxDwell: 90, dockUtil: 100, pallets: 72, weight: 11000, warehouse: "Mumbai DC1", gate: "Gate A", priority: "High", nextAppt: null, equipment: "Forklift" },
]

interface SDSItem {
  id: string; dock: string; type: string; vehicle: string; carrier: string
  appointment: string; checkIn: string; checkOut: string; status: string
  dwell: number; maxDwell: number; dockUtil: number; pallets: number; weight: number
  warehouse: string; gate: string; priority: string; nextAppt: string; equipment: string
}

const items: SDSItem[] = raw.map((r: any) => ({
  id: r.id, dock: r.dock, type: r.type, vehicle: r.vehicle, carrier: r.carrier,
  appointment: r.appointment, checkIn: r.checkIn, checkOut: r.checkOut,
  status: r.status, dwell: r.dwell, maxDwell: r.maxDwell, dockUtil: r.dockUtil,
  pallets: r.pallets, weight: r.weight, warehouse: r.warehouse, gate: r.gate,
  priority: r.priority, nextAppt: r.nextAppt, equipment: r.equipment,
}))

const statusColors: Record<string, string> = {
  "Loading": "text-blue-600 font-semibold", "Unloading": "text-indigo-600 font-semibold",
  "Completed": "text-emerald-600 font-semibold", "Waiting": "text-slate-500 font-semibold",
  "Scheduled": "text-cyan-600 font-semibold", "Delayed": "text-amber-600 font-semibold",
  "No Show": "text-red-600 font-semibold", "Overtime": "text-red-600 font-semibold",
}
const typeColors: Record<string, string> = {
  "Inbound": "bg-blue-100 text-blue-700", "Outbound": "bg-emerald-100 text-emerald-700",
  "Crossdock": "bg-amber-100 text-amber-700",
}
const priorityColors: Record<string, string> = {
  "High": "bg-red-100 text-red-700", "Medium": "bg-amber-100 text-amber-700",
  "Low": "bg-slate-100 text-slate-700",
}
const docks = [...new Set(items.map(i => i.dock))]
const types = [...new Set(items.map(i => i.type))]
const activeDocks = items.filter(i => i.status !== "Completed" && i.status !== "Scheduled" && i.status !== "No Show").length
const avgDwell = Math.round(items.filter(i => i.dwell > 0).reduce((s, i) => s + i.dwell, 0) / items.filter(i => i.dwell > 0).length)
const overtime = items.filter(i => i.dwell > i.maxDwell).length
const totalPallets = items.reduce((s, i) => s + i.pallets, 0)

type Rec = any
type FV = Record<string, string>
type VT = "docks" | "schedule" | "utilization"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`sds-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatWeight(kg: number) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}T`
  return `${kg}kg`
}

export function SmartDockSchedulerPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("docks")

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
    ...items.filter(i => i.status === "Overtime").map(i => ({ id: i.id, msg: `${i.dock}: ${i.vehicle} overtime \u2014 ${i.dwell}min vs max ${i.maxDwell}min, ${i.carrier}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "No Show").map(i => ({ id: i.id, msg: `${i.dock}: No show at ${i.appointment} \u2014 ${i.carrier}, ${i.vehicle}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Delayed" && i.dwell > 0).map(i => ({ id: i.id, msg: `${i.dock}: Delayed \u2014 ${i.dwell}min elapsed of ${i.maxDwell}max, ${i.warehouse}`, severity: "warning" as const })),
    ...items.filter(i => i.dockUtil >= 100 && i.checkOut === null).map(i => ({ id: i.id, msg: `${i.dock}: Dock at 100% capacity \u2014 ${i.type}, ${i.equipment}`, severity: "warning" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Warehouse, title: "Active Docks", desc: `${activeDocks}/${items.length} docks in operation`, accent: "text-blue-500" },
    { icon: Timer, title: "Avg Dwell", desc: `${avgDwell}min avg across active docks`, accent: "text-amber-500" },
    { icon: Zap, title: "Throughput", desc: `${totalPallets} pallets scheduled today`, accent: "text-emerald-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"><CalendarClock className="h-4 w-4 text-blue-600" /></div>
            <div><h3 className="text-sm font-bold">Smart Dock Scheduler</h3><p className="text-xs opacity-60">{items.length} docks | {types.length} types</p></div>
          </div>
          <div className="flex gap-1">
            {(["docks", "schedule", "utilization"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "docks" ? "Docks" : v === "schedule" ? "Schedule" : "Utilization"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Active", `${activeDocks}/${items.length}`, Warehouse, "bg-blue-50/50")}
          {statCard("Avg Dwell", `${avgDwell}m`, Timer, "bg-amber-50/50")}
          {statCard("Overtime", `${overtime}`, AlertTriangle, "bg-red-50/50")}
          {statCard("Pallets", totalPallets.toString(), Package, "bg-emerald-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {types.map(t => {
            const active = activeFilters.type === t
            return <span key={t} onClick={() => toggle("type", active ? undefined : t)} className={`sds-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="sds-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="sds-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="sds-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Dock Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`sds-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "docks" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Overtime" || item.status === "No Show"
              const isWarning = item.status === "Delayed"
              const dwellPct = item.maxDwell > 0 ? Math.min(Math.round((item.dwell / item.maxDwell) * 100), 100) : 0
              return (
                <div key={item.id} className={`sds-dock-card rounded-lg border p-2.5 bg-card ${isCritical ? "sds-critical-pulse" : isWarning ? "sds-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="sds-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{item.id}</span>
                      <span className="sds-dock-tag text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">{item.dock}</span>
                      <span className={`sds-type-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                      <span className={`sds-priority-tag text-[10px] px-1.5 py-0.5 rounded ${priorityColors[item.priority] || "bg-slate-100"}`}>{item.priority}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Completed" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 opacity-40" />{item.vehicle} | {item.carrier}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.warehouse} | {item.gate}</div>
                    <div className="flex items-center gap-1"><CalendarClock className="h-3 w-3 opacity-40" />Appt: {item.appointment} {item.checkIn ? `| In: ${item.checkIn}` : ""} {item.checkOut ? `| Out: ${item.checkOut}` : ""}</div>
                    <div className="flex items-center gap-1"><Wrench className="h-3 w-3 opacity-40" />{item.equipment} | {item.pallets} pallets | {formatWeight(item.weight)}</div>
                  </div>
                  {item.dwell > 0 && (
                    <div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                        <div className={`h-full rounded-full ${dwellPct >= 100 ? "bg-red-500" : dwellPct >= 75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${dwellPct}%` }} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                        <div>Dwell: <span className={`font-bold ${dwellPct >= 100 ? "text-red-600" : "text-foreground"}`}>{item.dwell}m</span></div>
                        <div>Max: <span className="font-medium">{item.maxDwell}m</span></div>
                        <div>Util: <span className="font-medium">{item.dockUtil}%</span></div>
                      </div>
                    </div>
                  )}
                  {item.nextAppt && <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Next: {item.nextAppt}</div>}
                </div>
              )
            })}
          </div>
        )}

        {view === "schedule" && (
          <div className="space-y-2">
            <div className="sds-schedule-header rounded-lg border p-2 bg-indigo-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.status === "Completed").length}</div><div className="text-[10px] opacity-50">Completed</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.status === "Scheduled").length}</div><div className="text-[10px] opacity-50">Scheduled</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.status === "Loading" || i.status === "Unloading").length}</div><div className="text-[10px] opacity-50">In Progress</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.status === "Overtime" || i.status === "No Show").length}</div><div className="text-[10px] opacity-50">Issues</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.appointment.localeCompare(b.appointment)).map(item => (
              <div key={item.id} className="sds-schedule-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="sds-dock-tag text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">{item.dock}</span>
                    <span className="text-xs font-semibold">{item.appointment}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    {item.status === "Completed" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : item.status === "No Show" ? <XCircle className="h-3 w-3 text-red-500" /> : null}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Carrier: <span className="font-medium">{item.carrier}</span></div>
                  <div>Type: <span className="font-medium">{item.type}</span></div>
                  <div>Pallets: <span className="font-medium">{item.pallets}</span></div>
                  <div>Weight: <span className="font-medium">{formatWeight(item.weight)}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "utilization" && (
          <div className="space-y-2">
            <div className="sds-util-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.dockUtil > 0).length}</div><div className="text-[10px] opacity-50">Active Docks</div></div>
                <div><div className="text-lg font-bold text-blue-600">{Math.round(items.filter(i => i.dockUtil > 0).reduce((s, i) => s + i.dockUtil, 0) / items.filter(i => i.dockUtil > 0).length)}%</div><div className="text-[10px] opacity-50">Avg Utilization</div></div>
                <div><div className="text-lg font-bold text-amber-600">{overtime}</div><div className="text-[10px] opacity-50">Over Max Dwell</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.status === "Completed").reduce((s, i) => s + i.pallets, 0)}</div><div className="text-[10px] opacity-50">Completed Pallets</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.dockUtil - a.dockUtil).map(item => {
              const isOver = item.dockUtil >= 100 && item.checkOut === null
              return (
                <div key={item.id} className={`sds-util-row rounded-lg border p-2 bg-card ${isOver ? "sds-critical-pulse" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="sds-dock-tag text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">{item.dock}</span>
                      <span className={`sds-type-tag text-[10px] px-1.5 py-0.5 rounded ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                    </div>
                    <span className={`text-xs font-bold ${item.dockUtil >= 100 ? "text-red-600" : item.dockUtil >= 75 ? "text-amber-600" : "text-emerald-600"}`}>{item.dockUtil}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.dockUtil >= 100 ? "bg-red-500" : item.dockUtil >= 75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(item.dockUtil, 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Dwell: <span className={`font-medium ${item.dwell > item.maxDwell ? "text-red-600" : "text-foreground"}`}>{item.dwell}m/{item.maxDwell}m</span></div>
                    <div>Equipment: <span className="font-medium">{item.equipment}</span></div>
                    <div>Pallets: <span className="font-medium">{item.pallets}</span></div>
                    <div>Status: <span className={`font-medium ${statusColors[item.status] || "text-foreground"}`}>{item.status}</span></div>
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
