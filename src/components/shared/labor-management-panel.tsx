"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users, Clock,
  AlertTriangle, TrendingUp, Target, Zap,
  Shield, ShieldCheck, HardHat, Award, Briefcase
} from "lucide-react"

const raw = [
  { id: "LMN-01", name: "Rajesh Kumar", role: "Shift Supervisor", department: "Warehouse Ops", dc: "Mumbai DC-1", shift: "Morning", skill: "Forklift+Picking", hourlyRate: 320, hoursWorked: 192, overtime: 24, productivity: 112, attendance: 96, safetyScore: 98, certifications: ["Forklift", "Fire Safety"], status: "Active", since: "2022-03", performance: "Excellent" },
  { id: "LMN-02", name: "Priya Sharma", role: "Picker", department: "Order Fulfillment", dc: "Delhi DC-2", shift: "Afternoon", skill: "Pick-Pack", hourlyRate: 250, hoursWorked: 184, overtime: 16, productivity: 94, attendance: 92, safetyScore: 95, certifications: ["Pick-Pack L2"], status: "Active", since: "2023-01", performance: "Good" },
  { id: "LMN-03", name: "Suresh Yadav", role: "Forklift Operator", department: "Receiving", dc: "Bengaluru DC-3", shift: "Night", skill: "Forklift+Loading", hourlyRate: 350, hoursWorked: 208, overtime: 40, productivity: 88, attendance: 78, safetyScore: 72, certifications: ["Forklift L3", "Loading"], status: "Warning", since: "2021-08", performance: "Average" },
  { id: "LMN-04", name: "Anjali Patel", role: "QC Inspector", department: "Quality Control", dc: "Chennai DC-6", shift: "Morning", skill: "Quality Check+Audit", hourlyRate: 380, hoursWorked: 176, overtime: 8, productivity: 108, attendance: 98, safetyScore: 99, certifications: ["ISO Audit", "QC L3"], status: "Active", since: "2020-11", performance: "Excellent" },
  { id: "LMN-05", name: "Vikram Singh", role: "Packer", department: "Dispatch", dc: "Kolkata DC-5", shift: "Afternoon", skill: "Packing+Labeling", hourlyRate: 240, hoursWorked: 168, overtime: 0, productivity: 76, attendance: 88, safetyScore: 91, certifications: ["Pack L1"], status: "Active", since: "2024-02", performance: "Needs Improvement" },
  { id: "LMN-06", name: "Meena Devi", role: "Team Lead", department: "Warehouse Ops", dc: "Hyderabad DC-4", shift: "Morning", skill: "Leadership+WMS", hourlyRate: 420, hoursWorked: 200, overtime: 32, productivity: 118, attendance: 99, safetyScore: 100, certifications: ["WMS Admin", "Six Sigma", "Fire Safety"], status: "Active", since: "2019-06", performance: "Excellent" },
  { id: "LMN-07", name: "Arun Babu", role: "Loader", department: "Shipping", dc: "Mumbai DC-1", shift: "Night", skill: "Loading+Dock Ops", hourlyRate: 260, hoursWorked: 192, overtime: 24, productivity: 85, attendance: 84, safetyScore: 68, certifications: ["Loading L1"], status: "On Leave", since: "2023-07", performance: "Average" },
  { id: "LMN-08", name: "Kavitha Raman", role: "Inventory Clerk", department: "Inventory", dc: "Chennai DC-6", shift: "Morning", skill: "Cycle Count+Barcode", hourlyRate: 280, hoursWorked: 180, overtime: 12, productivity: 102, attendance: 95, safetyScore: 97, certifications: ["Cycle Count L2", "Barcode Sys"], status: "Active", since: "2022-09", performance: "Good" },
  { id: "LMN-09", name: "Deepak Joshi", role: "Forklift Operator", department: "Receiving", dc: "Delhi DC-2", shift: "Afternoon", skill: "Forklift+Unloading", hourlyRate: 340, hoursWorked: 220, overtime: 52, productivity: 72, attendance: 72, safetyScore: 65, certifications: ["Forklift L3"], status: "Critical", since: "2021-01", performance: "Poor" },
  { id: "LMN-10", name: "Fatima Khan", role: "VAS Operator", department: "Value Add", dc: "Bengaluru DC-3", shift: "Morning", skill: "Kitting+Gift Wrap", hourlyRate: 290, hoursWorked: 188, overtime: 20, productivity: 106, attendance: 94, safetyScore: 93, certifications: ["VAS L2", "Kitting"], status: "Active", since: "2023-05", performance: "Good" },
]

interface LMNItem {
  id: string; name: string; role: string; department: string; dc: string
  shift: string; skill: string; hourlyRate: number; hoursWorked: number
  overtime: number; productivity: number; attendance: number; safetyScore: number
  certifications: string[]; status: string; since: string; performance: string
}

const items: LMNItem[] = raw.map((r: any) => ({
  id: r.id, name: r.name, role: r.role, department: r.department, dc: r.dc,
  shift: r.shift, skill: r.skill, hourlyRate: r.hourlyRate, hoursWorked: r.hoursWorked,
  overtime: r.overtime, productivity: r.productivity, attendance: r.attendance,
  safetyScore: r.safetyScore, certifications: r.certifications, status: r.status,
  since: r.since, performance: r.performance,
}))

const statusColors: Record<string, string> = {
  "Active": "text-emerald-600 font-semibold", "Warning": "text-amber-600 font-semibold",
  "Critical": "text-red-600 font-semibold", "On Leave": "text-slate-500 font-semibold",
}
const perfColors: Record<string, string> = {
  "Excellent": "text-emerald-600 font-semibold", "Good": "text-blue-600",
  "Average": "text-amber-600", "Needs Improvement": "text-orange-600", "Poor": "text-red-600 font-semibold",
}
const shiftColors: Record<string, string> = {
  "Morning": "bg-amber-100 text-amber-700", "Afternoon": "bg-blue-100 text-blue-700", "Night": "bg-indigo-100 text-indigo-700",
}
const departments = [...new Set(items.map(i => i.department))]
const shifts = [...new Set(items.map(i => i.shift))]
const avgProductivity = Math.round(items.reduce((s, i) => s + i.productivity, 0) / items.length)
const avgAttendance = Math.round(items.reduce((s, i) => s + i.attendance, 0) / items.length)
const totalOvertime = items.reduce((s, i) => s + i.overtime, 0)
const criticals = items.filter(i => i.status === "Critical" || i.status === "Warning")

type Rec = any
type FV = Record<string, string>
type VT = "workforce" | "performance" | "safety"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`lmn-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function LaborManagementPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("workforce")

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
    { icon: TrendingUp, title: "Productivity", desc: `${avgProductivity}% avg output rate`, accent: "text-emerald-500" },
    { icon: Award, title: "Attendance", desc: `${avgAttendance}% avg attendance`, accent: "text-blue-500" },
    { icon: AlertTriangle, title: "At Risk", desc: `${criticals.length} workers flagged`, accent: "text-red-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.name}: Safety ${i.safetyScore}, attendance ${i.attendance}%, ${i.overtime}h OT`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Warning").map(i => ({ id: i.id, msg: `${i.name}: Warning \u2014 productivity ${i.productivity}%, attendance ${i.attendance}%`, severity: "warning" as const })),
    ...items.filter(i => i.overtime > 40).map(i => ({ id: i.id, msg: `${i.name}: Excessive overtime ${i.overtime}h this month`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center"><Users className="h-4 w-4 text-rose-600" /></div>
            <div><h3 className="text-sm font-bold">Labor Management</h3><p className="text-xs opacity-60">{items.length} workers | {departments.length} departments</p></div>
          </div>
          <div className="flex gap-1">
            {(["workforce", "performance", "safety"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "workforce" ? "Workforce" : v === "performance" ? "Performance" : "Safety"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Productivity", `${avgProductivity}%`, TrendingUp, "bg-rose-50/50")}
          {statCard("Attendance", `${avgAttendance}%`, UserCheck, "bg-blue-50/50")}
          {statCard("Overtime", `${totalOvertime}h total`, Clock, "bg-amber-50/50")}
          {statCard("Headcount", `${items.length} active`, Users, "bg-indigo-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {departments.map(d => {
            const active = activeFilters.department === d
            return <span key={d} onClick={() => toggle("department", active ? undefined : d)} className={`lmn-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{d}</span>
          })}
          {shifts.map(s => {
            const active = activeFilters.shift === s
            return <span key={s} onClick={() => toggle("shift", active ? undefined : s)} className={`lmn-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="lmn-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="lmn-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="lmn-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Workforce Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`lmn-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "workforce" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "Warning"
              const monthlyCost = item.hourlyRate * item.hoursWorked
              return (
                <div key={item.id} className={`lmn-worker-card rounded-lg border p-2.5 bg-card ${isCritical ? "lmn-critical-pulse" : isWarning ? "lmn-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="lmn-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">{item.id}</span>
                      <HardHat className="h-3.5 w-3.5 text-rose-500" />
                      <span className="text-xs font-semibold">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`lmn-shift-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${shiftColors[item.shift] || "bg-slate-100"}`}>{item.shift}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Briefcase className="h-3 w-3 opacity-40" />{item.role} | {item.department}</div>
                    <div className="flex items-center gap-1"><Target className="h-3 w-3 opacity-40" />{item.dc} | Since {item.since}</div>
                    <div className="flex items-center gap-1"><Zap className="h-3 w-3 opacity-40" />{item.skill} | {item.certifications.length} certs</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />{item.hoursWorked}h + {item.overtime}h OT | {item.hourlyRate}/hr</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Productivity: <span className={`font-bold ${item.productivity >= 100 ? "text-emerald-600" : item.productivity >= 85 ? "text-amber-600" : "text-red-600"}`}>{item.productivity}%</span></div>
                    <div>Attendance: <span className={`font-bold ${item.attendance >= 95 ? "text-emerald-600" : item.attendance >= 85 ? "text-amber-600" : "text-red-600"}`}>{item.attendance}%</span></div>
                    <div>Safety: <span className={`font-bold ${item.safetyScore >= 90 ? "text-emerald-600" : item.safetyScore >= 75 ? "text-amber-600" : "text-red-600"}`}>{item.safetyScore}</span></div>
                    <div>Cost/mo: <span className="font-medium">{(monthlyCost / 1000).toFixed(1)}K</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "performance" && (
          <div className="space-y-2">
            <div className="lmn-perf-header rounded-lg border p-2 bg-rose-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.performance === "Excellent").length}</div><div className="text-[10px] opacity-50">Excellent</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.performance === "Good").length}</div><div className="text-[10px] opacity-50">Good</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.performance === "Average").length}</div><div className="text-[10px] opacity-50">Average</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.performance === "Poor" || i.performance === "Needs Improvement").length}</div><div className="text-[10px] opacity-50">At Risk</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.productivity - b.productivity).map(item => {
              const monthlyCost = item.hourlyRate * item.hoursWorked
              return (
                <div key={item.id} className="lmn-perf-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.name}</span>
                      <span className="text-[10px] opacity-50">{item.role}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] ${perfColors[item.performance] || "text-muted-foreground"}`}>{item.performance}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.productivity >= 100 ? "bg-emerald-500" : item.productivity >= 85 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(item.productivity, 120) / 1.2}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Productivity: <span className="font-bold">{item.productivity}%</span></div>
                    <div>Hours: <span className="font-medium">{item.hoursWorked}h + {item.overtime}h</span></div>
                    <div>Attendance: <span className="font-medium">{item.attendance}%</span></div>
                    <div>Cost/mo: <span className="font-medium">{(monthlyCost / 1000).toFixed(1)}K</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "safety" && (
          <div className="space-y-2">
            <div className="lmn-safety-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{Math.round(items.reduce((s, i) => s + i.safetyScore, 0) / items.length)}</div><div className="text-[10px] opacity-50">Avg Safety</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.safetyScore < 75).length}</div><div className="text-[10px] opacity-50">Below 75</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.overtime > 40).length}</div><div className="text-[10px] opacity-50">High OT</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.reduce((s, i) => s + i.certifications.length, 0)}</div><div className="text-[10px] opacity-50">Total Certs</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.safetyScore - b.safetyScore).map(item => {
              const isLow = item.safetyScore < 75
              return (
                <div key={item.id} className="lmn-safety-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.name}</span>
                      <span className="text-[10px] opacity-50">{item.certifications.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.safetyScore >= 90 ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> : isLow ? <AlertTriangle className="h-3.5 w-3.5 text-red-500" /> : <Shield className="h-3.5 w-3.5 text-amber-500" />}
                      <span className={`text-xs font-bold ${item.safetyScore >= 90 ? "text-emerald-600" : item.safetyScore >= 75 ? "text-amber-600" : "text-red-600"}`}>{item.safetyScore}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.safetyScore >= 90 ? "bg-emerald-500" : item.safetyScore >= 75 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.safetyScore}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Attendance: <span className={`font-medium ${item.attendance < 85 ? "text-red-600" : "text-foreground"}`}>{item.attendance}%</span></div>
                    <div>OT Hours: <span className={`font-medium ${item.overtime > 40 ? "text-red-600" : "text-foreground"}`}>{item.overtime}h</span></div>
                    <div>Shift: <span className="font-medium">{item.shift}</span></div>
                    <div>Dept: <span className="font-medium">{item.department}</span></div>
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
