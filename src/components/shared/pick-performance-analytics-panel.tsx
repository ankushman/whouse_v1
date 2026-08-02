"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Target, AlertTriangle, Users, TrendingUp
} from "lucide-react"

const raw = [
  { id: "PPA-01", picker: "Rajesh Kumar", zone: "Zone A", hub: "MUM-HUB1", shift: "A", skill: "Expert", linesPicked: 185, unitsPicked: 1240, uph: 142, targetUPH: 120, accuracy: 99.2, errors: 1, avgTravelDist: 2.8, pickRate: 12.4, idlePct: 5.2, wave: "Wave-15", method: "RF Scanner", status: "On Track", category: "Single" },
  { id: "PPA-02", picker: "Amit Sharma", zone: "Zone B", hub: "MUM-HUB1", shift: "A", skill: "Advanced", linesPicked: 162, unitsPicked: 980, uph: 118, targetUPH: 120, accuracy: 98.8, errors: 2, avgTravelDist: 3.2, pickRate: 10.8, idlePct: 8.5, wave: "Wave-15", method: "Voice Directed", status: "On Track", category: "Batch" },
  { id: "PPA-03", picker: "Priya Patel", zone: "Zone C", hub: "DEL-HUB2", shift: "B", skill: "Certified", linesPicked: 210, unitsPicked: 1580, uph: 168, targetUPH: 130, accuracy: 99.6, errors: 1, avgTravelDist: 2.1, pickRate: 14.2, idlePct: 3.8, wave: "Wave-18", method: "Pick-to-Light", status: "Excellent", category: "Single" },
  { id: "PPA-04", picker: "Suresh Yadav", zone: "Zone D", hub: "DEL-HUB2", shift: "B", skill: "Standard", linesPicked: 88, unitsPicked: 520, uph: 72, targetUPH: 100, accuracy: 96.5, errors: 5, avgTravelDist: 4.5, pickRate: 7.2, idlePct: 18.2, wave: "Wave-18", method: "RF Scanner", status: "At Risk", category: "Single" },
  { id: "PPA-05", picker: "Vikram Singh", zone: "Zone E", hub: "BLR-HUB3", shift: "A", skill: "Expert", linesPicked: 195, unitsPicked: 1420, uph: 155, targetUPH: 125, accuracy: 99.4, errors: 1, avgTravelDist: 2.4, pickRate: 13.5, idlePct: 4.5, wave: "Wave-12", method: "RF Scanner", status: "Excellent", category: "Cluster" },
  { id: "PPA-06", picker: "Deepak Joshi", zone: "Zone F", hub: "BLR-HUB3", shift: "C", skill: "Advanced", linesPicked: 145, unitsPicked: 890, uph: 105, targetUPH: 110, accuracy: 97.8, errors: 3, avgTravelDist: 3.8, pickRate: 9.5, idlePct: 12.5, wave: "Wave-14", method: "Voice Directed", status: "Warning", category: "Batch" },
  { id: "PPA-07", picker: "Meena Kumari", zone: "Zone G", hub: "MAA-HUB4", shift: "A", skill: "Certified", linesPicked: 175, unitsPicked: 1100, uph: 128, targetUPH: 115, accuracy: 98.5, errors: 2, avgTravelDist: 2.9, pickRate: 11.2, idlePct: 7.2, wave: "Wave-20", method: "Pick-to-Light", status: "On Track", category: "Single" },
  { id: "PPA-08", picker: "Rahul Verma", zone: "Zone H", hub: "CCU-HUB7", shift: "B", skill: "Standard", linesPicked: 65, unitsPicked: 380, uph: 58, targetUPH: 95, accuracy: 94.2, errors: 8, avgTravelDist: 5.2, pickRate: 5.8, idlePct: 25.5, wave: "Wave-09", method: "RF Scanner", status: "Critical", category: "Single" },
  { id: "PPA-09", picker: "Anita Devi", zone: "Zone I", hub: "HYD-HUB5", shift: "A", skill: "Expert", linesPicked: 220, unitsPicked: 1650, uph: 175, targetUPH: 130, accuracy: 99.8, errors: 0, avgTravelDist: 1.9, pickRate: 15.0, idlePct: 2.8, wave: "Wave-22", method: "Pick-to-Light", status: "Excellent", category: "Cluster" },
  { id: "PPA-10", picker: "Karan Mehta", zone: "Zone J", hub: "PNQ-HUB6", shift: "C", skill: "Advanced", linesPicked: 130, unitsPicked: 750, uph: 92, targetUPH: 105, accuracy: 97.2, errors: 4, avgTravelDist: 4.0, pickRate: 8.5, idlePct: 15.8, wave: "Wave-11", method: "Voice Directed", status: "Warning", category: "Batch" },
]

interface PPAItem {
  id: string; picker: string; zone: string; hub: string; shift: string
  skill: string; linesPicked: number; unitsPicked: number; uph: number
  targetUPH: number; accuracy: number; errors: number; avgTravelDist: number
  pickRate: number; idlePct: number; wave: string; method: string; status: string; category: string
}

type Rec = any
const items: PPAItem[] = raw.map((r: Rec) => ({
  id: r.id, picker: r.picker, zone: r.zone, hub: r.hub, shift: r.shift,
  skill: r.skill, linesPicked: r.linesPicked, unitsPicked: r.unitsPicked, uph: r.uph,
  targetUPH: r.targetUPH, accuracy: r.accuracy, errors: r.errors, avgTravelDist: r.avgTravelDist,
  pickRate: r.pickRate, idlePct: r.idlePct, wave: r.wave, method: r.method, status: r.status, category: r.category,
}))

const skillColors: Record<string, string> = {
  "Expert": "bg-emerald-100 text-emerald-700", "Advanced": "bg-blue-100 text-blue-700",
  "Certified": "bg-violet-100 text-violet-700", "Standard": "bg-amber-100 text-amber-700",
}

const statusColors: Record<string, string> = {
  "Excellent": "text-emerald-600 font-semibold", "On Track": "text-blue-600 font-semibold",
  "Warning": "text-amber-600 font-semibold", "Critical": "text-red-600 font-semibold", "At Risk": "text-red-600 font-semibold",
}

const methodColors: Record<string, string> = {
  "RF Scanner": "bg-sky-100 text-sky-700", "Voice Directed": "bg-violet-100 text-violet-700",
  "Pick-to-Light": "bg-emerald-100 text-emerald-700",
}

const uphColor = (v: number, t: number) => v >= t * 1.2 ? "text-emerald-600" : v >= t ? "text-blue-600" : v >= t * 0.8 ? "text-amber-600" : "text-red-600"
const accColor = (v: number) => v >= 99 ? "text-emerald-600" : v >= 97 ? "text-amber-600" : "text-red-600"
const idleColor = (v: number) => v <= 5 ? "text-emerald-600" : v <= 10 ? "text-amber-600" : "text-red-600"

const PickPerformanceAnalyticsPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"pickers" | "productivity" | "methods">("pickers")
  const filters = [
    { key: "skill", label: "Skill", options: ["Expert", "Advanced", "Certified", "Standard"] },
    { key: "status", label: "Status", options: ["Excellent", "On Track", "Warning", "At Risk", "Critical"] },
    { key: "method", label: "Method", options: ["RF Scanner", "Voice Directed", "Pick-to-Light"] },
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

  const totalPickers = filtered.length
  const avgUPH = totalPickers ? Math.round(filtered.reduce((s, r) => s + r.uph, 0) / totalPickers) : 0
  const totalErrors = filtered.reduce((s, r) => s + r.errors, 0)
  const avgAcc = totalPickers ? Math.round(filtered.reduce((s, r) => s + r.accuracy, 0) / totalPickers * 10) / 10 : 0

  const insights = [
    { label: "Active Pickers", value: totalPickers, icon: Users, bg: "bg-blue-50" },
    { label: "Avg UPH", value: avgUPH, icon: Target, bg: "bg-emerald-50" },
    { label: "Avg Accuracy", value: `${avgAcc}%`, icon: TrendingUp, bg: "bg-violet-50" },
    { label: "Total Errors", value: totalErrors, icon: AlertTriangle, bg: "bg-amber-50" },
  ]

  const isCritical = (r: PPAItem) => r.status === "Critical" || r.errors >= 5
  const isWarning = (r: PPAItem) => r.status === "Warning" || r.status === "At Risk" || r.errors >= 3

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
                className={`ppa-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["pickers", "productivity", "methods"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "pickers" && (
        <div className="ppa-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`ppa-item-card p-3 rounded-lg border ${isCritical(r) ? "ppa-critical" : isWarning(r) ? "ppa-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.picker}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${skillColors[r.skill]}`}>{r.skill}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${methodColors[r.method]}`}>{r.method}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>UPH: <span className={`font-medium ${uphColor(r.uph, r.targetUPH)}`}>{r.uph}</span> / Target: {r.targetUPH}</div>
                <div>Accuracy: <span className={`font-medium ${accColor(r.accuracy)}`}>{r.accuracy}%</span></div>
                <div>Lines: <span className="font-medium">{r.linesPicked}</span> | Units: <span className="font-medium">{r.unitsPicked}</span></div>
                <div>Errors: <span className={`font-medium ${r.errors >= 3 ? "text-red-600" : r.errors > 0 ? "text-amber-600" : "text-emerald-600"}`}>{r.errors}</span></div>
                <div>Travel: <span className="font-medium">{r.avgTravelDist}km</span> | Idle: <span className={`font-medium ${idleColor(r.idlePct)}`}>{r.idlePct}%</span></div>
                <div>Wave: <span className="font-medium">{r.wave}</span> | {r.category} Pick</div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.zone}, {r.hub} | Shift {r.shift}</span>
                <span>Pick Rate: {r.pickRate} lines/min</span>
              </div>
              {isCritical(r) && <div className="ppa-alert-text text-xs mt-2">Critical performance — UPH {r.uph} vs target {r.targetUPH}, {r.errors} errors, accuracy {r.accuracy}%</div>}
            </div>
          ))}
        </div>
      )}

      {view === "productivity" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => a.uph - b.uph).map(r => (
            <div key={r.id} className="ppa-prod-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.zone}</span>
                  <span className="font-semibold text-sm">{r.picker}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${skillColors[r.skill]}`}>{r.skill}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${uphColor(r.uph, r.targetUPH)}`}>{r.uph}</span>
                  <span className="text-xs text-muted-foreground">Target: {r.targetUPH}</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`ppa-uph-bar h-2 rounded-full ${r.uph >= r.targetUPH ? "" : "ppa-uph-under"}`} style={{ width: `${Math.min(r.uph / r.targetUPH * 100, 120) / 1.2}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Accuracy: <span className={`font-medium ${accColor(r.accuracy)}`}>{r.accuracy}%</span></div>
                <div>Errors: <span className="font-medium">{r.errors}</span></div>
                <div>Idle: <span className={`font-medium ${idleColor(r.idlePct)}`}>{r.idlePct}%</span></div>
                <div>Travel: <span className="font-medium">{r.avgTravelDist}km</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${methodColors[r.method]}`}>{r.method}</span>
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.hub} | {r.linesPicked} lines</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "methods" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.linesPicked - a.linesPicked).map(r => (
            <div key={r.id} className="ppa-method-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{r.picker}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${methodColors[r.method]}`}>{r.method}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${skillColors[r.skill]}`}>{r.skill}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{r.linesPicked} lines</span>
                  <span className="text-sm font-medium">{r.unitsPicked} units</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="ppa-rate-bar h-2 rounded-full" style={{ width: `${Math.min(r.pickRate / 15 * 100, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>UPH: <span className={`font-medium ${uphColor(r.uph, r.targetUPH)}`}>{r.uph}</span></div>
                <div>Accuracy: <span className={`font-medium ${accColor(r.accuracy)}`}>{r.accuracy}%</span></div>
                <div>Pick Rate: <span className="font-medium">{r.pickRate}/min</span></div>
                <div>Wave: <span className="font-medium">{r.wave}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.zone}, {r.hub} | Shift {r.shift} | {r.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { PickPerformanceAnalyticsPanel }
