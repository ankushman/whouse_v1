"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Building2, Wrench, AlertTriangle, TrendingUp
} from "lucide-react"

const raw = [
  { id: "WLT-01", warehouse: "Navi Mumbai DC", hub: "MUM-HUB1", phase: "Expansion", category: "Primary", lifecycle: "Growth", yearBuilt: 2019, sqft: 120000, newSqft: 40000, budget: 8500000, spent: 6200000, completion: 72, onSchedule: true, contractor: "Shapoorji Corp", nextMilestone: "Rack Installation", nextDate: "2026-09-15", riskScore: 12, issues: 1, status: "On Track", region: "West" },
  { id: "WLT-02", warehouse: "Gurugram Hub", hub: "DEL-HUB2", phase: "Renovation", category: "Secondary", lifecycle: "Mature", yearBuilt: 2015, sqft: 85000, newSqft: 0, budget: 3200000, spent: 3800000, completion: 95, onSchedule: false, contractor: "L&T Construction", nextMilestone: "Fire System Testing", nextDate: "2026-08-20", riskScore: 35, issues: 3, status: "Over Budget", region: "North" },
  { id: "WLT-03", warehouse: "Devanahalli FC", hub: "BLR-HUB3", phase: "New Build", category: "Fulfillment", lifecycle: "Greenfield", yearBuilt: 2026, sqft: 0, newSqft: 180000, budget: 22000000, spent: 8800000, completion: 40, onSchedule: true, contractor: "Prestige Constructions", nextMilestone: "Structural Completion", nextDate: "2026-11-30", riskScore: 18, issues: 0, status: "On Track", region: "South" },
  { id: "WLT-04", warehouse: "Barasat DC", hub: "MAA-HUB4", phase: "Maintenance", category: "Secondary", lifecycle: "Mature", yearBuilt: 2017, sqft: 65000, newSqft: 0, budget: 1200000, spent: 450000, completion: 38, onSchedule: true, contractor: "Simplex Infra", nextMilestone: "Floor Resurfacing", nextDate: "2026-09-01", riskScore: 8, issues: 0, status: "On Track", region: "East" },
  { id: "WLT-05", warehouse: "Medchal LM", hub: "HYD-HUB5", phase: "Expansion", category: "Last Mile", lifecycle: "Growth", yearBuilt: 2021, sqft: 35000, newSqft: 15000, budget: 2800000, spent: 3200000, completion: 85, onSchedule: false, contractor: "NCC Limited", nextMilestone: "Cold Room Fit-out", nextDate: "2026-08-25", riskScore: 42, issues: 4, status: "Delayed", region: "South" },
  { id: "WLT-06", warehouse: "Sanand FC", hub: "AMD-HUB9", phase: "Modernization", category: "Fulfillment", lifecycle: "Mature", yearBuilt: 2016, sqft: 95000, newSqft: 0, budget: 5400000, spent: 2100000, completion: 39, onSchedule: true, contractor: "Tata Projects", nextMilestone: "Conveyor System Install", nextDate: "2026-12-15", riskScore: 15, issues: 1, status: "On Track", region: "West" },
  { id: "WLT-07", warehouse: "Sitapura Hub", hub: "PNQ-HUB6", phase: "Renovation", category: "Primary", lifecycle: "Declining", yearBuilt: 2013, sqft: 55000, newSqft: 0, budget: 4200000, spent: 4200000, completion: 100, onSchedule: true, contractor: "Gammon India", nextMilestone: "Completed", nextDate: "2026-07-30", riskScore: 5, issues: 0, status: "Completed", region: "West" },
  { id: "WLT-08", warehouse: "Chakan DC", hub: "PNQ-HUB6", phase: "New Build", category: "Primary", lifecycle: "Greenfield", yearBuilt: 2026, sqft: 0, newSqft: 220000, budget: 18500000, spent: 5200000, completion: 28, onSchedule: true, contractor: "Afcons Infra", nextMilestone: "Foundation Work", nextDate: "2027-02-28", riskScore: 22, issues: 1, status: "On Track", region: "West" },
  { id: "WLT-09", warehouse: "Amingaon DC", hub: "CCU-HUB7", phase: "Emergency Repair", category: "Secondary", lifecycle: "Mature", yearBuilt: 2014, sqft: 48000, newSqft: 0, budget: 1800000, spent: 1800000, completion: 100, onSchedule: false, contractor: "NBCC", nextMilestone: "Completed", nextDate: "2026-08-01", riskScore: 48, issues: 5, status: "Over Budget", region: "East" },
  { id: "WLT-10", warehouse: "Sriperumbudur FC", hub: "MAA-HUB4", phase: "Expansion", category: "Fulfillment", lifecycle: "Growth", yearBuilt: 2020, sqft: 110000, newSqft: 60000, budget: 12000000, spent: 4800000, completion: 40, onSchedule: true, contractor: "L&T Construction", nextMilestone: "MEP Work", nextDate: "2027-01-15", riskScore: 14, issues: 0, status: "On Track", region: "South" },
]

interface WLTItem {
  id: string; warehouse: string; hub: string; phase: string; category: string
  lifecycle: string; yearBuilt: number; sqft: number; newSqft: number
  budget: number; spent: number; completion: number; onSchedule: boolean
  contractor: string; nextMilestone: string; nextDate: string
  riskScore: number; issues: number; status: string; region: string
}

type Rec = any
const items: WLTItem[] = raw.map((r: Rec) => ({
  id: r.id, warehouse: r.warehouse, hub: r.hub, phase: r.phase, category: r.category,
  lifecycle: r.lifecycle, yearBuilt: r.yearBuilt, sqft: r.sqft, newSqft: r.newSqft,
  budget: r.budget, spent: r.spent, completion: r.completion, onSchedule: r.onSchedule,
  contractor: r.contractor, nextMilestone: r.nextMilestone, nextDate: r.nextDate,
  riskScore: r.riskScore, issues: r.issues, status: r.status, region: r.region,
}))

const phaseColors: Record<string, string> = {
  "Expansion": "bg-blue-100 text-blue-700", "Renovation": "bg-amber-100 text-amber-700",
  "New Build": "bg-emerald-100 text-emerald-700", "Maintenance": "bg-slate-100 text-slate-700",
  "Modernization": "bg-violet-100 text-violet-700", "Emergency Repair": "bg-red-100 text-red-700",
}

const lifecycleColors: Record<string, string> = {
  "Greenfield": "bg-emerald-100 text-emerald-700", "Growth": "bg-blue-100 text-blue-700",
  "Mature": "bg-amber-100 text-amber-700", "Declining": "bg-rose-100 text-rose-700",
}

const statusColors: Record<string, string> = {
  "On Track": "text-emerald-600 font-semibold", "Delayed": "text-red-600 font-semibold",
  "Over Budget": "text-red-600 font-semibold", "Completed": "text-blue-600 font-semibold",
}

const compColor = (v: number) => v >= 80 ? "text-emerald-600" : v >= 50 ? "text-blue-600" : v >= 30 ? "text-amber-600" : "text-red-600"
const riskColor = (v: number) => v >= 40 ? "text-red-600" : v >= 20 ? "text-amber-600" : "text-emerald-600"
const budgetColor = (spent: number, budget: number) => {
  if (budget === 0) return "text-muted-foreground"
  const pct = spent / budget * 100
  return pct > 105 ? "text-red-600" : pct > 90 ? "text-amber-600" : "text-emerald-600"
}

const fmtBudget = (v: number) => {
  if (v >= 10000000) return `\u20b9${(v / 10000000).toFixed(1)}Cr`
  if (v >= 100000) return `\u20b9${(v / 100000).toFixed(1)}L`
  return `\u20b9${(v / 1000).toFixed(0)}K`
}

const WarehouseLifecycleTrackerPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"projects" | "budget" | "timeline">("projects")
  const filters = [
    { key: "phase", label: "Phase", options: ["Expansion", "Renovation", "New Build", "Maintenance", "Modernization", "Emergency Repair"] },
    { key: "status", label: "Status", options: ["On Track", "Delayed", "Over Budget", "Completed"] },
    { key: "lifecycle", label: "Lifecycle", options: ["Greenfield", "Growth", "Mature", "Declining"] },
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

  const activeProjects = filtered.filter(r => r.status !== "Completed").length
  const totalBudget = filtered.reduce((s, r) => s + r.budget, 0)
  const totalSpent = filtered.reduce((s, r) => s + r.spent, 0)
  const avgComp = filtered.length ? Math.round(filtered.filter(r => r.status !== "Completed").reduce((s, r) => s + r.completion, 0) / activeProjects) : 0

  const insights = [
    { label: "Active Projects", value: activeProjects, icon: Building2, bg: "bg-blue-50" },
    { label: "Avg Completion", value: `${avgComp}%`, icon: TrendingUp, bg: "bg-emerald-50" },
    { label: "Budget Spent", value: fmtBudget(totalSpent), icon: Wrench, bg: "bg-violet-50" },
    { label: "Total Budget", value: fmtBudget(totalBudget), icon: AlertTriangle, bg: "bg-amber-50" },
  ]

  const isCritical = (r: WLTItem) => r.status === "Delayed" || r.status === "Over Budget" || r.riskScore >= 40
  const isWarning = (r: WLTItem) => r.issues >= 2 || !r.onSchedule || r.riskScore >= 25

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
                className={`wlt-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["projects", "budget", "timeline"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "projects" && (
        <div className="wlt-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`wlt-item-card p-3 rounded-lg border ${isCritical(r) ? "wlt-critical" : isWarning(r) ? "wlt-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.warehouse}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${phaseColors[r.phase]}`}>{r.phase}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  {!r.onSchedule && <span className="text-xs text-red-600">Off Schedule</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Completion: <span className={`font-medium ${compColor(r.completion)}`}>{r.completion}%</span> | Sqft: <span className="font-medium">{r.sqft.toLocaleString()}</span>{r.newSqft > 0 && <span> +{r.newSqft.toLocaleString()}</span>}</div>
                <div>Budget: <span className={`font-medium ${budgetColor(r.spent, r.budget)}`}>{fmtBudget(r.spent)}</span> / {fmtBudget(r.budget)}</div>
                <div>Contractor: <span className="font-medium">{r.contractor}</span></div>
                <div>Risk: <span className={`font-medium ${riskColor(r.riskScore)}`}>{r.riskScore}</span> | Issues: <span className="font-medium">{r.issues}</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span><span className={`text-xs px-1.5 py-0.5 rounded-full ${lifecycleColors[r.lifecycle]}`}>{r.lifecycle}</span> {r.category} | Built {r.yearBuilt}</span>
                <span>Next: {r.nextMilestone} ({r.nextDate})</span>
              </div>
              {isCritical(r) && <div className="wlt-alert-text text-xs mt-2">Project critical — status: {r.status}, risk {r.riskScore}, {r.issues} issues, budget {fmtBudget(r.spent)}/{fmtBudget(r.budget)}</div>}
            </div>
          ))}
        </div>
      )}

      {view === "budget" && (
        <div className="space-y-2">
          {[...filtered].filter(r => r.status !== "Completed").sort((a, b) => (b.spent / Math.max(b.budget, 1)) - (a.spent / Math.max(a.budget, 1))).map(r => {
            const pct = r.budget > 0 ? Math.round(r.spent / r.budget * 100) : 0
            return (
              <div key={r.id} className="wlt-budget-card p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                    <span className="font-semibold text-sm">{r.warehouse}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${phaseColors[r.phase]}`}>{r.phase}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${budgetColor(r.spent, r.budget)}`}>{pct}%</span>
                    <span className="text-xs text-muted-foreground">spent</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`wlt-budget-bar h-2 rounded-full ${pct > 100 ? "wlt-budget-over" : pct > 80 ? "wlt-budget-warn" : ""}`} style={{ width: `${Math.min(pct, 100)}%` }} /></div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>Spent: <span className="font-medium">{fmtBudget(r.spent)}</span></div>
                  <div>Budget: <span className="font-medium">{fmtBudget(r.budget)}</span></div>
                  <div>Risk: <span className={`font-medium ${riskColor(r.riskScore)}`}>{r.riskScore}</span></div>
                  <div>Issues: <span className="font-medium">{r.issues}</span></div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className="text-muted-foreground">{r.contractor} | Completion: {r.completion}%</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {view === "timeline" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime()).map(r => (
            <div key={r.id} className="wlt-timeline-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.warehouse}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${phaseColors[r.phase]}`}>{r.phase}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{r.completion}%</span>
                  <span className="text-xs text-muted-foreground">done</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`wlt-timeline-bar h-2 rounded-full ${r.completion >= 80 ? "" : "wlt-timeline-early"}`} style={{ width: `${r.completion}%` }} /></div>
              <div className="grid grid-cols-2 gap-x-4 gap-2 text-xs">
                <div>Milestone: <span className="font-medium">{r.nextMilestone}</span></div>
                <div>Due: <span className="font-medium">{r.nextDate}</span></div>
                <div>Contractor: <span className="font-medium">{r.contractor}</span></div>
                <div>Risk: <span className={`font-medium ${riskColor(r.riskScore)}`}>{r.riskScore}</span> | {!r.onSchedule && <span className="text-red-600 font-medium">Delayed</span>}</div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.hub} | {r.region} | Sqft: {r.sqft.toLocaleString()}{r.newSqft > 0 ? `+${r.newSqft.toLocaleString()}` : ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { WarehouseLifecycleTrackerPanel }
