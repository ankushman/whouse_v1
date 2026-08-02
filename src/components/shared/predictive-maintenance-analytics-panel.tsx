"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Wrench, Gauge, Thermometer, Activity,
  AlertTriangle, CheckCircle, XCircle,
  IndianRupee, Timer, Zap, Settings
} from "lucide-react"

const raw = [
  { id: "PMA-01", equipment: "Conveyor Belt C3", type: "Conveyor", warehouse: "Mumbai DC1", zone: "Outbound", health: 92, mtbf: 480, mttr: 2.5, lastMaint: "25-Jul", nextDue: "22-Aug", maintCost: 15000, downtime: 4, riskScore: 1, vibration: 2.1, temp: 42, age: 5, cycles: 185000, status: "Healthy", city: "Mumbai", month: "Aug 2026", vendor: "Siemens India" },
  { id: "PMA-02", equipment: "Forklift FL-07", type: "Forklift", warehouse: "Delhi DC2", zone: "Inbound", health: 68, mtbf: 240, mttr: 8, lastMaint: "10-Jul", nextDue: "05-Aug", maintCost: 45000, downtime: 18, riskScore: 7, vibration: 4.8, temp: 78, age: 8, cycles: 92000, status: "At Risk", city: "Delhi", month: "Aug 2026", vendor: "Toyota Material" },
  { id: "PMA-03", equipment: "Cold Room CR-2", type: "Refrigeration", warehouse: "Bengaluru DC3", zone: "Cold Storage", health: 95, mtbf: 720, mttr: 1.5, lastMaint: "20-Jul", nextDue: "18-Aug", maintCost: 28000, downtime: 2, riskScore: 1, vibration: 0.8, temp: -18, age: 3, cycles: 45000, status: "Healthy", city: "Bengaluru", month: "Aug 2026", vendor: "Blue Star" },
  { id: "PMA-04", equipment: "Dock Leveler DL-4", type: "Dock Equip", warehouse: "Chennai DC4", zone: "Loading Dock", health: 45, mtbf: 120, mttr: 14, lastMaint: "01-Jul", nextDue: "01-Aug", maintCost: 62000, downtime: 36, riskScore: 9, vibration: 6.2, temp: 56, age: 12, cycles: 210000, status: "Critical", city: "Chennai", month: "Aug 2026", vendor: "Rite-Hite" },
  { id: "PMA-05", equipment: "Sorter System SS-1", type: "Sorter", warehouse: "Pune DC6", zone: "Dispatch", health: 85, mtbf: 360, mttr: 3, lastMaint: "18-Jul", nextDue: "15-Aug", maintCost: 22000, downtime: 6, riskScore: 3, vibration: 2.8, temp: 48, age: 4, cycles: 320000, status: "Healthy", city: "Pune", month: "Aug 2026", vendor: "Beumer Group" },
  { id: "PMA-06", equipment: "Stretch Wrapper SW-3", type: "Packaging", warehouse: "Hyderabad DC5", zone: "Pack Area", health: 72, mtbf: 200, mttr: 6, lastMaint: "05-Jul", nextDue: "02-Aug", maintCost: 18000, downtime: 12, riskScore: 6, vibration: 3.9, temp: 44, age: 6, cycles: 78000, status: "Warning", city: "Hyderabad", month: "Aug 2026", vendor: "Lantech" },
  { id: "PMA-07", equipment: "Pallet Jack PJ-12", type: "Material Handling", warehouse: "Kolkata DC7", zone: "Warehouse Floor", health: 38, mtbf: 96, mttr: 18, lastMaint: "15-Jun", nextDue: "Overdue", maintCost: 35000, downtime: 48, riskScore: 10, vibration: 7.1, temp: 65, age: 14, cycles: 340000, status: "Critical", city: "Kolkata", month: "Aug 2026", vendor: "Crown Equip" },
  { id: "PMA-08", equipment: "RF Scanner Hub", type: "IT Equipment", warehouse: "Ahmedabad DC8", zone: "Receiving", health: 88, mtbf: 600, mttr: 2, lastMaint: "22-Jul", nextDue: "19-Aug", maintCost: 8000, downtime: 3, riskScore: 2, vibration: 0.2, temp: 35, age: 2, cycles: 120000, status: "Healthy", city: "Ahmedabad", month: "Aug 2026", vendor: "Zebra Tech" },
  { id: "PMA-09", equipment: "Vertical Lift VL-1", type: "Storage System", warehouse: "Jaipur DC9", zone: "Mezzanine", health: 78, mtbf: 300, mttr: 4, lastMaint: "12-Jul", nextDue: "08-Aug", maintCost: 52000, downtime: 8, riskScore: 4, vibration: 3.2, temp: 50, age: 7, cycles: 156000, status: "Warning", city: "Jaipur", month: "Aug 2026", vendor: "SSI Schaefer" },
  { id: "PMA-10", equipment: "Solar Inverter SI-2", type: "Energy System", warehouse: "Lucknow DC10", zone: "Rooftop", health: 82, mtbf: 540, mttr: 3, lastMaint: "28-Jul", nextDue: "25-Aug", maintCost: 12000, downtime: 2, riskScore: 2, vibration: 0.5, temp: 55, age: 4, cycles: 88000, status: "Healthy", city: "Lucknow", month: "Aug 2026", vendor: "ABB India" },
]

interface PMAItem {
  id: string; equipment: string; type: string; warehouse: string; zone: string
  health: number; mtbf: number; mttr: number; lastMaint: string; nextDue: string
  maintCost: number; downtime: number; riskScore: number; vibration: number
  temp: number; age: number; cycles: number; status: string
  city: string; month: string; vendor: string
}

const items: PMAItem[] = raw.map((r: any) => ({
  id: r.id, equipment: r.equipment, type: r.type, warehouse: r.warehouse, zone: r.zone,
  health: r.health, mtbf: r.mtbf, mttr: r.mttr, lastMaint: r.lastMaint, nextDue: r.nextDue,
  maintCost: r.maintCost, downtime: r.downtime, riskScore: r.riskScore, vibration: r.vibration,
  temp: r.temp, age: r.age, cycles: r.cycles, status: r.status,
  city: r.city, month: r.month, vendor: r.vendor,
}))

const statusColors: Record<string, string> = {
  "Healthy": "text-emerald-600 font-semibold", "Warning": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Critical": "text-red-600 font-semibold",
}
const typeColors: Record<string, string> = {
  "Conveyor": "bg-blue-100 text-blue-700", "Forklift": "bg-purple-100 text-purple-700",
  "Refrigeration": "bg-cyan-100 text-cyan-700", "Dock Equip": "bg-orange-100 text-orange-700",
  "Sorter": "bg-indigo-100 text-indigo-700", "Packaging": "bg-pink-100 text-pink-700",
  "Material Handling": "bg-amber-100 text-amber-700", "IT Equipment": "bg-slate-100 text-slate-700",
  "Storage System": "bg-violet-100 text-violet-700", "Energy System": "bg-emerald-100 text-emerald-700",
}
const types = [...new Set(items.map(i => i.type))]
const avgHealth = Math.round(items.reduce((s, i) => s + i.health, 0) / items.length)
const totalDowntime = items.reduce((s, i) => s + i.downtime, 0)
const totalCost = items.reduce((s, i) => s + i.maintCost, 0)

type Rec = any
type FV = Record<string, string>
type VT = "equipment" | "reliability" | "cost"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`pma-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function PredictiveMaintenanceAnalyticsPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("equipment")

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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.equipment}: CRITICAL \u2014 health ${i.health}%, vibration ${i.vibration}mm/s, ${i.downtime}h downtime, maintenance OVERDUE`, severity: "critical" as const })),
    ...items.filter(i => i.status === "At Risk").map(i => ({ id: i.id, msg: `${i.equipment}: At risk \u2014 MTBF ${i.mtbf}h, MTTR ${i.mttr}h, next due ${i.nextDue}`, severity: "warning" as const })),
    ...items.filter(i => i.nextDue === "Overdue").map(i => ({ id: i.id, msg: `${i.equipment}: OVERDUE maintenance \u2014 last ${i.lastMaint}, ${i.downtime}h accumulated downtime`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Activity, title: "Fleet Health", desc: `${avgHealth}% avg across ${items.length} assets | ${items.filter(i => i.health >= 80).length} healthy`, accent: avgHealth >= 75 ? "text-emerald-500" : "text-red-500" },
    { icon: Timer, title: "Total Downtime", desc: `${totalDowntime}h this month | avg MTTR ${Math.round(items.reduce((s, i) => s + i.mttr, 0) / items.length)}h`, accent: totalDowntime > 100 ? "text-red-500" : "text-amber-500" },
    { icon: IndianRupee, title: "Maintenance Cost", desc: `${formatINR(totalCost)} this month across all assets`, accent: "text-blue-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center"><Wrench className="h-4 w-4 text-orange-600" /></div>
            <div><h3 className="text-sm font-bold">Predictive Maintenance Analytics</h3><p className="text-xs opacity-60">{items.length} assets | {types.length} types</p></div>
          </div>
          <div className="flex gap-1">
            {(["equipment", "reliability", "cost"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "equipment" ? "Assets" : v === "reliability" ? "Reliability" : "Cost"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Assets", items.length.toString(), Settings, "bg-orange-50/50")}
          {statCard("Health", `${avgHealth}%`, Activity, "bg-emerald-50/50")}
          {statCard("Downtime", `${totalDowntime}h`, Timer, "bg-amber-50/50")}
          {statCard("Cost", formatINR(totalCost), IndianRupee, "bg-blue-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {types.map(t => {
            const active = activeFilters.type === t
            return <span key={t} onClick={() => toggle("type", active ? undefined : t)} className={`pma-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="pma-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="pma-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="pma-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Maintenance Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`pma-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "equipment" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "Warning" || item.status === "At Risk"
              return (
                <div key={item.id} className={`pma-eq-card rounded-lg border p-2.5 bg-card ${isCritical ? "pma-critical-pulse" : isWarning ? "pma-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="pma-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.equipment}</span>
                      <span className={`pma-type-tag text-[10px] px-1.5 py-0.5 rounded ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Healthy" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Zap className="h-3 w-3 opacity-40" />{item.warehouse} | {item.zone}</div>
                    <div className="flex items-center gap-1"><Wrench className="h-3 w-3 opacity-40" />{item.vendor} | Age: {item.age}yr</div>
                    <div className="flex items-center gap-1"><Gauge className="h-3 w-3 opacity-40" />Health: {item.health}% | Risk: {item.riskScore}/10</div>
                    <div className="flex items-center gap-1"><Thermometer className="h-3 w-3 opacity-40" />Vibration: {item.vibration}mm/s | {item.temp}\u00b0C</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>MTBF: <span className={`font-bold ${item.mtbf >= 400 ? "text-emerald-600" : item.mtbf >= 200 ? "text-amber-600" : "text-red-600"}`}>{item.mtbf}h</span></div>
                    <div>MTTR: <span className={`font-medium ${item.mttr > 10 ? "text-red-600" : "text-foreground"}`}>{item.mttr}h</span></div>
                    <div>Next Due: <span className={`font-medium ${item.nextDue === "Overdue" ? "text-red-600" : "text-foreground"}`}>{item.nextDue}</span></div>
                    <div>Cycles: <span className="font-medium">{(item.cycles / 1000).toFixed(0)}K</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "reliability" && (
          <div className="space-y-2">
            <div className="pma-rel-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{avgHealth}%</div><div className="text-[10px] opacity-50">Avg Health</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.health < 60).length}</div><div className="text-[10px] opacity-50">Unhealthy Assets</div></div>
                <div><div className="text-lg font-bold text-blue-600">{Math.round(items.reduce((s, i) => s + i.mtbf, 0) / items.length)}h</div><div className="text-[10px] opacity-50">Avg MTBF</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.reduce((s, i) => s + i.downtime, 0)}h</div><div className="text-[10px] opacity-50">Total Downtime</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.health - b.health).map(item => (
              <div key={item.id} className={`pma-rel-row rounded-lg border p-2 bg-card ${item.health < 50 ? "pma-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.equipment}</span>
                    <span className="text-[10px] text-muted-foreground">{item.type}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.health >= 80 ? "text-emerald-600" : item.health >= 60 ? "text-amber-600" : "text-red-600"}`}>{item.health}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.health >= 80 ? "bg-emerald-500" : item.health >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.health}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>MTBF: <span className="font-medium">{item.mtbf}h</span></div>
                  <div>MTTR: <span className={`font-medium ${item.mttr > 10 ? "text-red-600" : "text-foreground"}`}>{item.mttr}h</span></div>
                  <div>Age: <span className="font-medium">{item.age}yr</span></div>
                  <div>Cycles: <span className="font-medium">{(item.cycles / 1000).toFixed(0)}K</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "cost" && (
          <div className="space-y-2">
            <div className="pma-cost-header rounded-lg border p-2 bg-amber-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-amber-600">{formatINR(totalCost)}</div><div className="text-[10px] opacity-50">Monthly Cost</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.nextDue === "Overdue").length}</div><div className="text-[10px] opacity-50">Overdue Maint</div></div>
                <div><div className="text-lg font-bold text-purple-600">{formatINR(items.reduce((s, i) => s + i.maintCost + i.downtime * 500, 0))}</div><div className="text-[10px] opacity-50">Cost + Loss</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.reduce((s, i) => s + i.downtime, 0)}h</div><div className="text-[10px] opacity-50">Downtime Hours</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.maintCost - a.maintCost).map(item => (
              <div key={item.id} className="pma-cost-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.equipment}</span>
                  </div>
                  <span className="text-xs font-bold">{formatINR(item.maintCost)}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(item.maintCost / 700, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Downtime: <span className={`font-medium ${item.downtime > 20 ? "text-red-600" : "text-foreground"}`}>{item.downtime}h</span></div>
                  <div>Loss: <span className="font-medium">{formatINR(item.downtime * 500)}</span></div>
                  <div>Health: <span className={`font-medium ${item.health < 60 ? "text-red-600" : "text-foreground"}`}>{item.health}%</span></div>
                  <div>Vendor: <span className="font-medium">{item.vendor}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
