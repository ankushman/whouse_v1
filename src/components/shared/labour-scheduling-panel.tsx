"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Users, Clock, TrendingUp, UserCheck
} from "lucide-react"

const raw = [
  { id: "LAB-01", emp: "Rajesh Kumar", role: "Forklift Operator", shift: "A", zone: "A1-Receiving", skill: "Certified", ot: 2.5, attendance: 96, tasks: 18, tasksDone: 17, perf: 94.4, rate: 580, region: "West", status: "On Shift", hub: "MUM-HUB1", certification: "OSHA", experience: 8, lastBreak: "13:00", nextBreak: "16:00", pendingLeave: 0 },
  { id: "LAB-02", emp: "Priya Sharma", role: "Picker", shift: "B", zone: "B3-Picking", skill: "Advanced", ot: 4.0, attendance: 92, tasks: 24, tasksDone: 22, perf: 91.7, rate: 420, region: "North", status: "On Shift", hub: "DEL-HUB2", certification: "Six Sigma", experience: 5, lastBreak: "14:30", nextBreak: "17:30", pendingLeave: 2 },
  { id: "LAB-03", emp: "Suresh M", role: "Packer", shift: "A", zone: "C2-Packing", skill: "Standard", ot: 0, attendance: 78, tasks: 15, tasksDone: 11, perf: 73.3, rate: 380, region: "South", status: "Absent", hub: "BLR-HUB3", certification: "None", experience: 2, lastBreak: "—", nextBreak: "—", pendingLeave: 5 },
  { id: "LAB-04", emp: "Anita R", role: "Quality Inspector", shift: "C", zone: "D1-QA", skill: "Expert", ot: 1.0, attendance: 99, tasks: 12, tasksDone: 12, perf: 100, rate: 720, region: "West", status: "On Shift", hub: "MUM-HUB1", certification: "ISO 9001", experience: 12, lastBreak: "12:00", nextBreak: "15:00", pendingLeave: 0 },
  { id: "LAB-05", emp: "Manoj K", role: "Loader", shift: "A", zone: "E1-Dispatch", skill: "Certified", ot: 3.5, attendance: 88, tasks: 20, tasksDone: 18, perf: 90, rate: 450, region: "East", status: "Late", hub: "CCU-HUB7", certification: "OSHA", experience: 4, lastBreak: "13:30", nextBreak: "16:30", pendingLeave: 1 },
  { id: "LAB-06", emp: "Kavitha N", role: "Supervisor", shift: "B", zone: "All Zones", skill: "Expert", ot: 6.0, attendance: 95, tasks: 8, tasksDone: 8, perf: 100, rate: 850, region: "South", status: "On Shift", hub: "MAA-HUB4", certification: "PMP", experience: 15, lastBreak: "14:00", nextBreak: "17:00", pendingLeave: 0 },
  { id: "LAB-07", emp: "Deepak T", role: "Forklift Operator", shift: "C", zone: "A2-Storage", skill: "Advanced", ot: 0, attendance: 82, tasks: 16, tasksDone: 13, perf: 81.3, rate: 580, region: "North", status: "Training", hub: "DEL-HUB2", certification: "OSHA", experience: 6, lastBreak: "12:30", nextBreak: "15:30", pendingLeave: 3 },
  { id: "LAB-08", emp: "Lakshmi P", role: "Picker", shift: "A", zone: "B1-Picking", skill: "Standard", ot: 1.5, attendance: 90, tasks: 22, tasksDone: 20, perf: 90.9, rate: 420, region: "South", status: "On Shift", hub: "HYD-HUB5", certification: "Lean", experience: 3, lastBreak: "13:15", nextBreak: "16:15", pendingLeave: 1 },
  { id: "LAB-09", emp: "Vikram J", role: "Cold Room Operator", shift: "B", zone: "F1-Cold", skill: "Certified", ot: 2.0, attendance: 94, tasks: 10, tasksDone: 10, perf: 100, rate: 650, region: "North", status: "On Shift", hub: "JAI-HUB9", certification: "HACCP", experience: 7, lastBreak: "14:45", nextBreak: "17:45", pendingLeave: 0 },
  { id: "LAB-10", emp: "Sunita B", role: "Receiving Clerk", shift: "A", zone: "A1-Receiving", skill: "Advanced", ot: 5.0, attendance: 75, tasks: 14, tasksDone: 10, perf: 71.4, rate: 400, region: "West", status: "Fatigue Alert", hub: "PNQ-HUB6", certification: "None", experience: 1, lastBreak: "11:00", nextBreak: "14:00", pendingLeave: 4 },
]

interface LABItem {
  id: string; emp: string; role: string; shift: string; zone: string; skill: string
  ot: number; attendance: number; tasks: number; tasksDone: number; perf: number
  rate: number; region: string; status: string; hub: string; certification: string
  experience: number; lastBreak: string; nextBreak: string; pendingLeave: number
}

type Rec = any
const items: LABItem[] = raw.map((r: Rec) => ({
  id: r.id, emp: r.emp, role: r.role, shift: r.shift, zone: r.zone, skill: r.skill,
  ot: r.ot, attendance: r.attendance, tasks: r.tasks, tasksDone: r.tasksDone, perf: r.perf,
  rate: r.rate, region: r.region, status: r.status, hub: r.hub, certification: r.certification,
  experience: r.experience, lastBreak: r.lastBreak, nextBreak: r.nextBreak, pendingLeave: r.pendingLeave,
}))

const shiftColors: Record<string, string> = {
  "A": "bg-sky-100 text-sky-700", "B": "bg-amber-100 text-amber-700", "C": "bg-violet-100 text-violet-700",
}

const roleColors: Record<string, string> = {
  "Forklift Operator": "bg-orange-100 text-orange-700", "Picker": "bg-emerald-100 text-emerald-700",
  "Packer": "bg-blue-100 text-blue-700", "Quality Inspector": "bg-violet-100 text-violet-700",
  "Loader": "bg-rose-100 text-rose-700", "Supervisor": "bg-indigo-100 text-indigo-700",
  "Cold Room Operator": "bg-cyan-100 text-cyan-700", "Receiving Clerk": "bg-lime-100 text-lime-700",
  "Training": "bg-gray-100 text-gray-600",
}

const statusColors: Record<string, string> = {
  "On Shift": "text-emerald-600 font-semibold", "Absent": "text-red-600 font-semibold",
  "Late": "text-orange-600 font-semibold", "Training": "text-blue-600 font-semibold", "Fatigue Alert": "text-red-700 font-semibold",
}

const skillColors: Record<string, string> = {
  "Expert": "bg-amber-100 text-amber-700", "Advanced": "bg-emerald-100 text-emerald-700",
  "Certified": "bg-blue-100 text-blue-700", "Standard": "bg-gray-100 text-gray-600",
}

const certBadge = (c: string) => c !== "None" ? <span className="lab-cert-badge">{c}</span> : <span className="text-gray-400 text-xs">No cert</span>
const perfPct = (v: number) => v >= 90 ? "text-emerald-600" : v >= 75 ? "text-amber-600" : "text-red-600"
const attPct = (v: number) => v >= 90 ? "text-emerald-600" : v >= 80 ? "text-amber-600" : "text-red-600"
const otColor = (v: number) => v >= 4 ? "text-red-600" : v >= 2 ? "text-amber-600" : "text-emerald-600"

const LabourSchedulingPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"workforce" | "performance" | "compliance">("workforce")
  const filters = [
    { key: "role", label: "Role", options: ["Forklift Operator", "Picker", "Packer", "Quality Inspector", "Loader", "Supervisor", "Cold Room Operator", "Receiving Clerk"] },
    { key: "shift", label: "Shift", options: ["A", "B", "C"] },
    { key: "status", label: "Status", options: ["On Shift", "Absent", "Late", "Training", "Fatigue Alert"] },
    { key: "region", label: "Region", options: ["West", "North", "South", "East"] },
  ]

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n = Object.assign({}, prev)
      if (n[key] === value) { delete n[key] } else { n[key] = value }
      return n
    })
  }

  const filtered = items.filter((r: Rec) =>
    Object.entries(activeFilters).every(([k, v]) => r[k as keyof Rec] === v)
  )

  const totalStaff = filtered.length
  const onShift = filtered.filter(r => r.status === "On Shift").length
  const avgPerf = totalStaff ? Math.round(filtered.reduce((s, r) => s + r.perf, 0) / totalStaff * 10) / 10 : 0
  const totalOt = Math.round(filtered.reduce((s, r) => s + r.ot, 0) * 10) / 10

  const insights = [
    { label: "Total Staff", value: totalStaff, icon: Users, bg: "bg-blue-50" },
    { label: "On Shift", value: onShift, icon: UserCheck, bg: "bg-emerald-50" },
    { label: "Avg Performance", value: `${avgPerf}%`, icon: TrendingUp, bg: "bg-violet-50" },
    { label: "Total OT (hrs)", value: `${totalOt}h`, icon: Clock, bg: "bg-amber-50" },
  ]

  const isCritical = (r: LABItem) => r.status === "Fatigue Alert" || r.status === "Absent"
  const isWarning = (r: LABItem) => r.status === "Late" || r.attendance < 80

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {insights.map(sc => {
          const SIcon = sc.icon as React.ElementType
          return (
            <div key={sc.label} className={`${sc.bg} rounded-lg p-3`}>
              <div className="flex items-center gap-2 mb-1"><SIcon className="w-4 h-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{sc.label}</span></div>
              <div className="text-lg font-bold">{sc.value}</div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <div key={f.key} className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">{f.label}:</span>
            {f.options.map(o => (
              <button key={o} onClick={() => toggleFilter(f.key, o)}
                className={`lab-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["workforce", "performance", "compliance"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "workforce" && (
        <div className="lab-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`lab-item-card p-3 rounded-lg border ${isCritical(r) ? "lab-critical" : isWarning(r) ? "lab-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.emp}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleColors[r.role] || "bg-gray-100 text-gray-600"}`}>{r.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${shiftColors[r.shift]}`}>Shift {r.shift}</span>
                  <span className={`text-xs ${statusColors[r.status] || "text-gray-600"}`}>{r.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Zone: <span className="font-medium">{r.zone}</span></div>
                <div>Hub: <span className="font-medium">{r.hub}</span></div>
                <div>Tasks: <span className="font-medium">{r.tasksDone}/{r.tasks}</span></div>
                <div>Performance: <span className={`font-medium ${perfPct(r.perf)}`}>{r.perf}%</span></div>
                <div>Experience: <span className="font-medium">{r.experience}yr</span></div>
                <div>OT: <span className={`font-medium ${otColor(r.ot)}`}>{r.ot}h</span></div>
                <div>Attendance: <span className={`font-medium ${attPct(r.attendance)}`}>{r.attendance}%</span></div>
                <div>Leave Pending: <span className={`font-medium ${r.pendingLeave >= 3 ? "text-red-600" : "text-gray-600"}`}>{r.pendingLeave}d</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded-full ${skillColors[r.skill]}`}>{r.skill}</span>
                  {certBadge(r.certification)}
                </div>
                <div className="text-muted-foreground">
                  Break: {r.lastBreak} &rarr; {r.nextBreak}
                </div>
              </div>
              {isCritical(r) && r.status === "Fatigue Alert" && <div className="lab-alert-text text-xs mt-2">Excessive overtime — mandatory rest recommended</div>}
              {isCritical(r) && r.status === "Absent" && <div className="lab-alert-text text-xs mt-2">No-show — replacement required for {r.zone}</div>}
            </div>
          ))}
        </div>
      )}

      {view === "performance" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.perf - a.perf).map(r => (
            <div key={r.id} className="lab-perf-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.emp}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleColors[r.role] || "bg-gray-100 text-gray-600"}`}>{r.role}</span>
                </div>
                <span className={`text-lg font-bold ${perfPct(r.perf)}`}>{r.perf}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="lab-perf-bar h-2 rounded-full" style={{ width: `${r.perf}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Tasks: <span className="font-medium">{r.tasksDone}/{r.tasks}</span></div>
                <div>Attendance: <span className={`font-medium ${attPct(r.attendance)}`}>{r.attendance}%</span></div>
                <div>OT: <span className={`font-medium ${otColor(r.ot)}`}>{r.ot}h</span></div>
                <div>Zone: <span className="font-medium">{r.zone}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${skillColors[r.skill]}`}>{r.skill}</span>
                <span className="text-muted-foreground">Experience: {r.experience}yr</span>
                <span className="text-muted-foreground">Rate: \u20b9{r.rate}/day</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "compliance" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.experience - a.experience).map(r => (
            <div key={r.id} className="lab-comp-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.emp}</span>
                </div>
                <div className="flex items-center gap-2">
                  {certBadge(r.certification)}
                  <span className="text-xs text-muted-foreground">Exp: {r.experience}yr</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Role: <span className="font-medium">{r.role}</span></div>
                <div>Skill Level: <span className={`px-1.5 py-0.5 rounded-full ${skillColors[r.skill]}`}>{r.skill}</span></div>
                <div>Shift: <span className={`px-1.5 py-0.5 rounded-full ${shiftColors[r.shift]}`}>Shift {r.shift}</span></div>
                <div>Hub: <span className="font-medium">{r.hub}</span></div>
                <div>Attendance: <span className={`font-medium ${attPct(r.attendance)}`}>{r.attendance}%</span></div>
                <div>Pending Leave: <span className={`font-medium ${r.pendingLeave >= 3 ? "text-red-600" : "text-gray-600"}`}>{r.pendingLeave}d</span></div>
              </div>
              {r.ot >= 4 && <div className="lab-alert-text text-xs mt-2">OT exceeds 4h — labour law review required</div>}
              {r.certification === "None" && <div className="text-amber-600 text-xs mt-1">Uncertified — training assignment recommended</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { LabourSchedulingPanel }
