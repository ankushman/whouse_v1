"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users, Clock, DollarSign,
  AlertTriangle, CheckCircle, XCircle,
  TrendingUp, Activity,
  UserCheck, HardHat
} from "lucide-react"

const raw = [
  { id: "WLA-01", shift: "Morning A", zone: "Receiving Dock", warehouse: "Mumbai DC1", dept: "Inbound", headcount: 32, present: 30, overtime: 4, uph: 42, costPerUnit: 4.2, monthlyCost: 680000, skillLevel: "Semi-Skilled", trainingHrs: 12, attendance: 94, safetyIncidents: 0, productivity: 88, status: "Optimal", city: "Mumbai", month: "Aug 2026", supervisor: "Ramesh P." },
  { id: "WLA-02", shift: "Morning B", zone: "Pick & Pack", warehouse: "Delhi DC2", dept: "Outbound", headcount: 45, present: 38, overtime: 8, uph: 35, costPerUnit: 5.8, monthlyCost: 920000, skillLevel: "Skilled", trainingHrs: 24, attendance: 84, safetyIncidents: 2, productivity: 72, status: "Understaffed", city: "Delhi", month: "Aug 2026", supervisor: "Anil K." },
  { id: "WLA-03", shift: "Evening A", zone: "Cold Storage", warehouse: "Bengaluru DC3", dept: "Cold Chain", headcount: 18, present: 18, overtime: 2, uph: 28, costPerUnit: 8.5, monthlyCost: 520000, skillLevel: "Specialized", trainingHrs: 48, attendance: 100, safetyIncidents: 0, productivity: 95, status: "Optimal", city: "Bengaluru", month: "Aug 2026", supervisor: "Suresh M." },
  { id: "WLA-04", shift: "Night A", zone: "Loading Bay", warehouse: "Chennai DC4", dept: "Dispatch", headcount: 28, present: 22, overtime: 12, uph: 38, costPerUnit: 6.1, monthlyCost: 580000, skillLevel: "Semi-Skilled", trainingHrs: 16, attendance: 79, safetyIncidents: 3, productivity: 65, status: "Critical", city: "Chennai", month: "Aug 2026", supervisor: "Kumar V." },
  { id: "WLA-05", shift: "Morning C", zone: "Returns Area", warehouse: "Pune DC6", dept: "Reverse Logistics", headcount: 22, present: 21, overtime: 3, uph: 31, costPerUnit: 5.2, monthlyCost: 420000, skillLevel: "Skilled", trainingHrs: 20, attendance: 95, safetyIncidents: 1, productivity: 85, status: "Optimal", city: "Pune", month: "Aug 2026", supervisor: "Mohan R." },
  { id: "WLA-06", shift: "Evening B", zone: "VMI Zone", warehouse: "Hyderabad DC5", dept: "Inbound", headcount: 35, present: 28, overtime: 6, uph: 40, costPerUnit: 4.8, monthlyCost: 620000, skillLevel: "Semi-Skilled", trainingHrs: 14, attendance: 80, safetyIncidents: 1, productivity: 70, status: "At Risk", city: "Hyderabad", month: "Aug 2026", supervisor: "Ravi S." },
  { id: "WLA-07", shift: "Night B", zone: "Conveyor Belt", warehouse: "Kolkata DC7", dept: "Operations", headcount: 40, present: 32, overtime: 10, uph: 45, costPerUnit: 3.9, monthlyCost: 750000, skillLevel: "Skilled", trainingHrs: 22, attendance: 80, safetyIncidents: 4, productivity: 62, status: "Critical", city: "Kolkata", month: "Aug 2026", supervisor: "Dipak G." },
  { id: "WLA-08", shift: "Morning D", zone: "Quality Control", warehouse: "Ahmedabad DC8", dept: "QA", headcount: 15, present: 15, overtime: 1, uph: 22, costPerUnit: 9.2, monthlyCost: 380000, skillLevel: "Specialized", trainingHrs: 56, attendance: 100, safetyIncidents: 0, productivity: 92, status: "Optimal", city: "Ahmedabad", month: "Aug 2026", supervisor: "Harish J." },
  { id: "WLA-09", shift: "Evening C", zone: "Putaway Zone", warehouse: "Jaipur DC9", dept: "Inbound", headcount: 25, present: 20, overtime: 5, uph: 36, costPerUnit: 5.5, monthlyCost: 440000, skillLevel: "Semi-Skilled", trainingHrs: 18, attendance: 80, safetyIncidents: 2, productivity: 74, status: "At Risk", city: "CPU", month: "Aug 2026", supervisor: "Gaurav T." },
  { id: "WLA-10", shift: "Morning E", zone: "Automation Floor", warehouse: "Lucknow DC10", dept: "Operations", headcount: 20, present: 19, overtime: 2, uph: 52, costPerUnit: 3.5, monthlyCost: 480000, skillLevel: "Specialized", trainingHrs: 40, attendance: 95, safetyIncidents: 0, productivity: 96, status: "Optimal", city: "Lucknow", month: "Aug 2026", supervisor: "Sanjay N." },
]

interface WLAItem {
  id: string; shift: string; zone: string; warehouse: string; dept: string
  headcount: number; present: number; overtime: number; uph: number
  costPerUnit: number; monthlyCost: number; skillLevel: string
  trainingHrs: number; attendance: number; safetyIncidents: number
  productivity: number; status: string; city: string; month: string; supervisor: string
}

const items: WLAItem[] = raw.map((r: any) => ({
  id: r.id, shift: r.shift, zone: r.zone, warehouse: r.warehouse, dept: r.dept,
  headcount: r.headcount, present: r.present, overtime: r.overtime, uph: r.uph,
  costPerUnit: r.costPerUnit, monthlyCost: r.monthlyCost, skillLevel: r.skillLevel,
  trainingHrs: r.trainingHrs, attendance: r.attendance, safetyIncidents: r.safetyIncidents,
  productivity: r.productivity, status: r.status, city: r.city, month: r.month, supervisor: r.supervisor,
}))

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "Understaffed": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Critical": "text-red-600 font-semibold",
}
const skillColors: Record<string, string> = {
  "Semi-Skilled": "bg-blue-100 text-blue-700", "Skilled": "bg-purple-100 text-purple-700",
  "Specialized": "bg-indigo-100 text-indigo-700", "Trainee": "bg-emerald-100 text-emerald-700",
}
const shiftTypes = [...new Set(items.map(i => i.shift))]
const totalWorkers = items.reduce((s, i) => s + i.headcount, 0)
const avgAttendance = Math.round(items.reduce((s, i) => s + i.attendance, 0) / items.length)
const totalCost = items.reduce((s, i) => s + i.monthlyCost, 0)
const criticalShifts = items.filter(i => i.status === "Critical" || i.status === "At Risk").length

type Rec = any
type FV = Record<string, string>
type VT = "shifts" | "productivity" | "cost"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`wla-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function WarehouseLaborAnalyticsPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("shifts")

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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.shift} ${i.zone}: CRITICAL \u2014 ${i.safetyIncidents} safety incidents, attendance ${i.attendance}%, productivity ${i.productivity}%`, severity: "critical" as const })),
    ...items.filter(i => i.status === "At Risk").map(i => ({ id: i.id, msg: `${i.shift} ${i.zone}: At risk \u2014 ${i.headcount - i.present} absent, ${i.overtime}h overtime, attendance ${i.attendance}%`, severity: "warning" as const })),
    ...items.filter(i => i.safetyIncidents >= 3).map(i => ({ id: i.id, msg: `${i.shift} ${i.zone}: High safety incidents (${i.safetyIncidents}) \u2014 ${i.warehouse}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Users, title: "Total Workforce", desc: `${totalWorkers} workers across ${items.length} shifts | ${avgAttendance}% avg attendance`, accent: "text-blue-500" },
    { icon: TrendingUp, title: "Avg UPH", desc: `${Math.round(items.reduce((s, i) => s + i.uph, 0) / items.length)} units/hour avg | peak ${Math.max(...items.map(i => i.uph))}`, accent: "text-emerald-500" },
    { icon: DollarSign, title: "Labor Cost", desc: `${formatINR(totalCost)}/month | avg \u20b9${(items.reduce((s, i) => s + i.costPerUnit, 0) / items.length).toFixed(1)}/unit`, accent: "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center"><HardHat className="h-4 w-4 text-violet-600" /></div>
            <div><h3 className="text-sm font-bold">Warehouse Labor Analytics</h3><p className="text-xs opacity-60">{items.length} shifts | {totalWorkers} workers</p></div>
          </div>
          <div className="flex gap-1">
            {(["shifts", "productivity", "cost"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "shifts" ? "Shifts" : v === "productivity" ? "Productivity" : "Cost"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Shifts", items.length.toString(), Clock, "bg-violet-50/50")}
          {statCard("Workers", `${totalWorkers}`, Users, "bg-blue-50/50")}
          {statCard("Attendance", `${avgAttendance}%`, UserCheck, "bg-emerald-50/50")}
          {statCard("At Risk", `${criticalShifts}/${items.length}`, AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {shiftTypes.map(s => {
            const active = activeFilters.shift === s
            return <span key={s} onClick={() => toggle("shift", active ? undefined : s)} className={`wla-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="wla-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="wla-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="wla-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Labor Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`wla-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "shifts" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "At Risk" || item.status === "Understaffed"
              const absent = item.headcount - item.present
              return (
                <div key={item.id} className={`wla-shift-card rounded-lg border p-2.5 bg-card ${isCritical ? "wla-critical-pulse" : isWarning ? "wla-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="wla-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.shift}</span>
                      <span className={`wla-skill-tag text-[10px] px-1.5 py-0.5 rounded ${skillColors[item.skillLevel] || "bg-slate-100"}`}>{item.skillLevel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Optimal" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Users className="h-3 w-3 opacity-40" />{item.warehouse} | {item.zone}</div>
                    <div className="flex items-center gap-1"><Activity className="h-3 w-3 opacity-40" />{item.dept} | {item.supervisor}</div>
                    <div className="flex items-center gap-1"><UserCheck className="h-3 w-3 opacity-40" />{item.present}/{item.headcount} present | {absent} absent</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />{item.overtime}h overtime | {item.trainingHrs}h training</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>UPH: <span className={`font-bold ${item.uph >= 40 ? "text-emerald-600" : item.uph >= 30 ? "text-amber-600" : "text-red-600"}`}>{item.uph}</span></div>
                    <div>Attendance: <span className={`font-bold ${item.attendance >= 90 ? "text-emerald-600" : item.attendance >= 80 ? "text-amber-600" : "text-red-600"}`}>{item.attendance}%</span></div>
                    <div>Cost: <span className="font-medium">{formatINR(item.monthlyCost)}/mo</span></div>
                    <div>Safety: <span className={`font-medium ${item.safetyIncidents > 0 ? "text-red-600" : "text-emerald-600"}`}>{item.safetyIncidents} incidents</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "productivity" && (
          <div className="space-y-2">
            <div className="wla-prod-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{Math.round(items.reduce((s, i) => s + i.uph, 0) / items.length)}</div><div className="text-[10px] opacity-50">Avg UPH</div></div>
                <div><div className="text-lg font-bold text-violet-600">{Math.max(...items.map(i => i.uph))}</div><div className="text-[10px] opacity-50">Peak UPH</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.reduce((s, i) => s + i.safetyIncidents, 0)}</div><div className="text-[10px] opacity-50">Total Incidents</div></div>
                <div><div className="text-lg font-bold text-blue-600">{Math.round(items.reduce((s, i) => s + i.trainingHrs, 0) / items.length)}h</div><div className="text-[10px] opacity-50">Avg Training</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.productivity - a.productivity).map(item => (
              <div key={item.id} className={`wla-prod-row rounded-lg border p-2 bg-card ${item.productivity < 70 ? "wla-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.shift}</span>
                    <span className="text-[10px] text-muted-foreground">{item.zone}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.productivity >= 85 ? "text-emerald-600" : item.productivity >= 70 ? "text-amber-600" : "text-red-600"}`}>{item.productivity}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.productivity >= 85 ? "bg-emerald-500" : item.productivity >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.productivity}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>UPH: <span className="font-medium">{item.uph}</span></div>
                  <div>Training: <span className="font-medium">{item.trainingHrs}h</span></div>
                  <div>Attendance: <span className={`font-medium ${item.attendance < 85 ? "text-red-600" : "text-foreground"}`}>{item.attendance}%</span></div>
                  <div>Incidents: <span className={`font-medium ${item.safetyIncidents > 0 ? "text-red-600" : "text-foreground"}`}>{item.safetyIncidents}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "cost" && (
          <div className="space-y-2">
            <div className="wla-cost-header rounded-lg border p-2 bg-amber-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-amber-600">{formatINR(totalCost)}</div><div className="text-[10px] opacity-50">Monthly Labor Cost</div></div>
                <div><div className="text-lg font-bold text-red-600">\u20b9{(items.reduce((s, i) => s + i.costPerUnit, 0) / items.length).toFixed(1)}</div><div className="text-[10px] opacity-50">Avg Cost/Unit</div></div>
                <div><div className="text-lg font-bold text-purple-600">{items.reduce((s, i) => s + i.overtime, 0)}h</div><div className="text-[10px] opacity-50">Total Overtime</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.reduce((s, i) => s + i.headcount, 0)}</div><div className="text-[10px] opacity-50">Total Headcount</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.monthlyCost - a.monthlyCost).map(item => (
              <div key={item.id} className="wla-cost-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.shift}</span>
                    <span className="text-[10px] text-muted-foreground">{item.warehouse}</span>
                  </div>
                  <span className="text-xs font-bold">{formatINR(item.monthlyCost)}/mo</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(item.monthlyCost / 10000, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Per Unit: <span className={`font-medium ${item.costPerUnit > 7 ? "text-red-600" : "text-foreground"}`}>\u20b9{item.costPerUnit}</span></div>
                  <div>Workers: <span className="font-medium">{item.present}/{item.headcount}</span></div>
                  <div>Overtime: <span className={`font-medium ${item.overtime > 6 ? "text-red-600" : "text-foreground"}`}>{item.overtime}h</span></div>
                  <div>UPH: <span className="font-medium">{item.uph}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
