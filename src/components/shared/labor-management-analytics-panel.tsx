"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Users, Clock, AlertTriangle, TrendingUp
} from "lucide-react"

const raw = [
  { id: "LMA-01", team: "Warehouse Ops A", hub: "MUM-HUB1", dept: "Operations", shift: "Morning", headcount: 45, present: 42, absent: 3, overtime: 12, productivity: 94.2, attritionRisk: 8, avgTenure: 24, trainingHrs: 16, safetyIncidents: 0, costPerHead: 18500, efficiency: 91.5, status: "Optimal", region: "West" },
  { id: "LMA-02", team: "Warehouse Ops B", hub: "DEL-HUB2", dept: "Operations", shift: "Evening", headcount: 38, present: 32, absent: 6, overtime: 18, productivity: 82.5, attritionRisk: 28, avgTenure: 12, trainingHrs: 8, safetyIncidents: 2, costPerHead: 19200, efficiency: 78.2, status: "High Attrition", region: "North" },
  { id: "LMA-03", team: "Quality Control", hub: "BLR-HUB3", dept: "Quality", shift: "Morning", headcount: 18, present: 18, absent: 0, overtime: 4, productivity: 98.1, attritionRisk: 5, avgTenure: 36, trainingHrs: 24, safetyIncidents: 0, costPerHead: 22500, efficiency: 96.8, status: "Optimal", region: "South" },
  { id: "LMA-04", team: "Loading Dock", hub: "CCU-HUB7", dept: "Logistics", shift: "Night", headcount: 22, present: 19, absent: 3, overtime: 8, productivity: 88.4, attritionRisk: 18, avgTenure: 15, trainingHrs: 12, safetyIncidents: 1, costPerHead: 17800, efficiency: 85.0, status: "Understaffed", region: "East" },
  { id: "LMA-05", team: "Cold Storage", hub: "HYD-HUB5", dept: "Cold Chain", shift: "Morning", headcount: 15, present: 14, absent: 1, overtime: 6, productivity: 92.8, attritionRisk: 10, avgTenure: 28, trainingHrs: 20, safetyIncidents: 0, costPerHead: 24000, efficiency: 90.5, status: "Optimal", region: "South" },
  { id: "LMA-06", team: "Dispatch Team", hub: "PNQ-HUB6", dept: "Logistics", shift: "Evening", headcount: 28, present: 24, absent: 4, overtime: 14, productivity: 79.2, attritionRisk: 35, avgTenure: 8, trainingHrs: 6, safetyIncidents: 3, costPerHead: 16800, efficiency: 74.8, status: "Critical", region: "West" },
  { id: "LMA-07", team: "Returns Processing", hub: "MAA-HUB4", dept: "Reverse", shift: "Morning", headcount: 12, present: 11, absent: 1, overtime: 5, productivity: 90.5, attritionRisk: 15, avgTenure: 18, trainingHrs: 14, safetyIncidents: 0, costPerHead: 17200, efficiency: 88.2, status: "Optimal", region: "South" },
  { id: "LMA-08", team: "Fulfillment Alpha", hub: "AMD-HUB9", dept: "E-Commerce", shift: "Night", headcount: 52, present: 45, absent: 7, overtime: 22, productivity: 76.8, attritionRisk: 42, avgTenure: 6, trainingHrs: 4, safetyIncidents: 4, costPerHead: 15500, efficiency: 70.5, status: "Critical", region: "West" },
  { id: "LMA-09", team: "Inventory Mgmt", hub: "DEL-HUB2", dept: "Inventory", shift: "Morning", headcount: 20, present: 20, absent: 0, overtime: 3, productivity: 96.5, attritionRisk: 7, avgTenure: 32, trainingHrs: 18, safetyIncidents: 0, costPerHead: 21000, efficiency: 94.2, status: "Optimal", region: "North" },
  { id: "LMA-10", team: "Packaging Unit", hub: "BLR-HUB3", dept: "Packaging", shift: "Evening", headcount: 25, present: 22, absent: 3, overtime: 10, productivity: 85.1, attritionRisk: 22, avgTenure: 14, trainingHrs: 10, safetyIncidents: 1, costPerHead: 16200, efficiency: 82.4, status: "At Risk", region: "South" },
]

interface LMAItem {
  id: string; team: string; hub: string; dept: string; shift: string
  headcount: number; present: number; absent: number; overtime: number
  productivity: number; attritionRisk: number; avgTenure: number; trainingHrs: number
  safetyIncidents: number; costPerHead: number; efficiency: number
  status: string; region: string
}

type Rec = any
const items: LMAItem[] = raw.map((r: Rec) => ({
  id: r.id, team: r.team, hub: r.hub, dept: r.dept, shift: r.shift,
  headcount: r.headcount, present: r.present, absent: r.absent, overtime: r.overtime,
  productivity: r.productivity, attritionRisk: r.attritionRisk, avgTenure: r.avgTenure,
  trainingHrs: r.trainingHrs, safetyIncidents: r.safetyIncidents, costPerHead: r.costPerHead,
  efficiency: r.efficiency, status: r.status, region: r.region,
}))

const deptColors: Record<string, string> = {
  "Operations": "bg-blue-100 text-blue-700", "Quality": "bg-emerald-100 text-emerald-700",
  "Logistics": "bg-amber-100 text-amber-700", "Cold Chain": "bg-cyan-100 text-cyan-700",
  "Reverse": "bg-rose-100 text-rose-700", "E-Commerce": "bg-violet-100 text-violet-700",
  "Inventory": "bg-orange-100 text-orange-700", "Packaging": "bg-teal-100 text-teal-700",
}

const shiftColors: Record<string, string> = {
  "Morning": "bg-yellow-100 text-yellow-700", "Evening": "bg-indigo-100 text-indigo-700",
  "Night": "bg-slate-100 text-slate-700",
}

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "At Risk": "text-amber-600 font-semibold",
  "Understaffed": "text-amber-600 font-semibold", "High Attrition": "text-red-600 font-semibold",
  "Critical": "text-red-600 font-semibold",
}

const prodColor = (v: number) => v >= 95 ? "text-emerald-600" : v >= 85 ? "text-blue-600" : v >= 75 ? "text-amber-600" : "text-red-600"
const attrColor = (v: number) => v >= 30 ? "text-red-600" : v >= 15 ? "text-amber-600" : "text-emerald-600"
const attenColor = (v: number, t: number) => v <= 2 ? "text-emerald-600" : v <= 5 ? "text-amber-600" : "text-red-600"
const effColor = (v: number) => v >= 90 ? "text-emerald-600" : v >= 80 ? "text-blue-600" : v >= 70 ? "text-amber-600" : "text-red-600"
const trainColor = (v: number) => v >= 16 ? "text-emerald-600" : v >= 10 ? "text-amber-600" : "text-red-600"

const fmtCost = (v: number) => `\u20b9${(v / 1000).toFixed(1)}K`

const LaborManagementAnalyticsPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"teams" | "productivity" | "retention">("teams")
  const filters = [
    { key: "dept", label: "Dept", options: ["Operations", "Quality", "Logistics", "Cold Chain", "Reverse", "E-Commerce", "Inventory", "Packaging"] },
    { key: "status", label: "Status", options: ["Optimal", "At Risk", "Understaffed", "High Attrition", "Critical"] },
    { key: "shift", label: "Shift", options: ["Morning", "Evening", "Night"] },
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

  const totalHeadcount = filtered.reduce((s, r) => s + r.headcount, 0)
  const avgProd = filtered.length ? Math.round(filtered.reduce((s, r) => s + r.productivity, 0) / filtered.length * 10) / 10 : 0
  const totalAbsent = filtered.reduce((s, r) => s + r.absent, 0)
  const avgAttrition = filtered.length ? Math.round(filtered.reduce((s, r) => s + r.attritionRisk, 0) / filtered.length) : 0

  const insights = [
    { label: "Total Staff", value: totalHeadcount, icon: Users, bg: "bg-blue-50" },
    { label: "Avg Productivity", value: `${avgProd}%`, icon: TrendingUp, bg: "bg-emerald-50" },
    { label: "Absent Today", value: totalAbsent, icon: Clock, bg: "bg-violet-50" },
    { label: "Avg Attrition Risk", value: `${avgAttrition}%`, icon: AlertTriangle, bg: "bg-amber-50" },
  ]

  const isCritical = (r: LMAItem) => r.status === "Critical" || r.attritionRisk >= 35 || r.safetyIncidents >= 3
  const isWarning = (r: LMAItem) => r.status === "High Attrition" || r.status === "Understaffed" || r.status === "At Risk" || r.absent >= 5

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
                className={`lma-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["teams", "productivity", "retention"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "teams" && (
        <div className="lma-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`lma-item-card p-3 rounded-lg border ${isCritical(r) ? "lma-critical" : isWarning(r) ? "lma-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.team}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${deptColors[r.dept]}`}>{r.dept}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${shiftColors[r.shift]}`}>{r.shift}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className="text-xs text-muted-foreground">{r.hub}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Headcount: <span className="font-medium">{r.headcount}</span> | Present: <span className="font-medium">{r.present}</span> | Absent: <span className={`font-medium ${attenColor(r.absent, r.headcount)}`}>{r.absent}</span></div>
                <div>Productivity: <span className={`font-medium ${prodColor(r.productivity)}`}>{r.productivity}%</span> | Efficiency: <span className={`font-medium ${effColor(r.efficiency)}`}>{r.efficiency}%</span></div>
                <div>Overtime: <span className="font-medium">{r.overtime}h</span> | Training: <span className={`font-medium ${trainColor(r.trainingHrs)}`}>{r.trainingHrs}h</span></div>
                <div>Attrition Risk: <span className={`font-medium ${attrColor(r.attritionRisk)}`}>{r.attritionRisk}%</span> | Tenure: <span className="font-medium">{r.avgTenure}mo</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Cost/head: {fmtCost(r.costPerHead)} | Safety: <span className={r.safetyIncidents > 0 ? "text-red-600 font-medium" : "text-emerald-600"}>{r.safetyIncidents} incidents</span></span>
                <span>{r.region}</span>
              </div>
              {isCritical(r) && <div className="lma-alert-text text-xs mt-2">Team critical — attrition {r.attritionRisk}%, {r.absent} absent, {r.safetyIncidents} safety incidents, productivity {r.productivity}%</div>}
            </div>
          ))}
        </div>
      )}

      {view === "productivity" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => a.productivity - b.productivity).map(r => (
            <div key={r.id} className="lma-prod-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.team}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${deptColors[r.dept]}`}>{r.dept}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${prodColor(r.productivity)}`}>{r.productivity}%</span>
                  <span className="text-xs text-muted-foreground">productivity</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`lma-prod-bar h-2 rounded-full ${r.productivity >= 85 ? "" : "lma-prod-low"}`} style={{ width: `${r.productivity}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Efficiency: <span className={`font-medium ${effColor(r.efficiency)}`}>{r.efficiency}%</span></div>
                <div>Present: <span className="font-medium">{r.present}/{r.headcount}</span></div>
                <div>Overtime: <span className="font-medium">{r.overtime}h</span></div>
                <div>Cost/head: <span className="font-medium">{fmtCost(r.costPerHead)}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.hub} | {r.shift} | Training: {r.trainingHrs}h</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "retention" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.attritionRisk - a.attritionRisk).map(r => (
            <div key={r.id} className="lma-ret-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.team}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${deptColors[r.dept]}`}>{r.dept}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${attrColor(r.attritionRisk)}`}>{r.attritionRisk}%</span>
                  <span className="text-xs text-muted-foreground">attrition risk</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`lma-ret-bar h-2 rounded-full ${r.attritionRisk >= 25 ? "lma-ret-high" : r.attritionRisk >= 15 ? "lma-ret-med" : ""}`} style={{ width: `${r.attritionRisk}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Tenure: <span className="font-medium">{r.avgTenure}mo</span></div>
                <div>Training: <span className={`font-medium ${trainColor(r.trainingHrs)}`}>{r.trainingHrs}h</span></div>
                <div>Safety: <span className="font-medium">{r.safetyIncidents}</span></div>
                <div>Productivity: <span className={`font-medium ${prodColor(r.productivity)}`}>{r.productivity}%</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.hub} | {r.shift} | Absent: {r.absent}/{r.headcount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { LaborManagementAnalyticsPanel }
