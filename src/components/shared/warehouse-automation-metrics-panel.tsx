"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Cpu, TrendingUp, Zap, Activity
} from "lucide-react"

const raw = [
  { id: "WAM-01", system: "AutoStore Grid", type: "Micro-Fulfillment", vendor: "AutoStore", zone: "A1-AutoStore", status: "Running", uptime: 99.2, throughput: 850, capacity: 92, robots: 42, active: 40, tasks: 12400, errors: 2, response: 0.8, region: "West", hub: "MUM-HUB1", maint: "25 Aug 2026", lastDown: "12 Jul 2026", energy: 45, temp: 22 },
  { id: "WAM-02", system: "AMR Fleet", type: "Mobile Robot", vendor: "Locus Robotics", zone: "B1-B3 Picking", status: "Running", uptime: 97.8, throughput: 620, capacity: 85, robots: 30, active: 28, tasks: 8900, errors: 5, response: 1.2, region: "North", hub: "DEL-HUB2", maint: "18 Aug 2026", lastDown: "28 Jul 2026", energy: 32, temp: 24 },
  { id: "WAM-03", system: "Conveyor Line C2", type: "Belt Conveyor", vendor: "Dematic", zone: "C2-Pack", status: "Degraded", uptime: 88.5, throughput: 380, capacity: 60, robots: 0, active: 0, tasks: 5200, errors: 18, response: 2.8, region: "South", hub: "BLR-HUB3", maint: "05 Aug 2026", lastDown: "01 Aug 2026", energy: 28, temp: 28 },
  { id: "WAM-04", system: "Sortation Hub", type: "Cross-Belt Sorter", vendor: "Hans Technologies", zone: "E1-Dispatch", status: "Running", uptime: 98.1, throughput: 1200, capacity: 78, robots: 0, active: 0, tasks: 18500, errors: 3, response: 0.5, region: "East", hub: "CCU-HUB7", maint: "22 Aug 2026", lastDown: "15 Jun 2026", energy: 65, temp: 25 },
  { id: "WAM-05", system: "Palletizer Arm R1", type: "Robotic Arm", vendor: "ABB Robotics", zone: "D1-Palletize", status: "Running", uptime: 96.5, throughput: 280, capacity: 72, robots: 4, active: 4, tasks: 3200, errors: 4, response: 1.8, region: "West", hub: "MUM-HUB1", maint: "10 Aug 2026", lastDown: "20 Jul 2026", energy: 38, temp: 26 },
  { id: "WAM-06", system: "AGV Fleet South", type: "Automated Guided", vendor: "KION Group", zone: "F1-Cold Storage", status: "Down", uptime: 72.0, throughput: 0, capacity: 0, robots: 12, active: 0, tasks: 4100, errors: 42, response: 0, region: "South", hub: "MAA-HUB4", maint: "03 Aug 2026", lastDown: "02 Aug 2026", energy: 0, temp: 4 },
  { id: "WAM-07", system: "Pick-to-Light L1", type: "Pick-to-Light", vendor: "Lightning Pick", zone: "B2-Picking", status: "Running", uptime: 99.8, throughput: 950, capacity: 95, robots: 0, active: 0, tasks: 15000, errors: 1, response: 0.3, region: "North", hub: "HYD-HUB5", maint: "30 Sep 2026", lastDown: "05 May 2026", energy: 8, temp: 23 },
  { id: "WAM-08", system: "Vertical Lift M1", type: "VLM", vendor: "Modula", zone: "A2-Storage", status: "Running", uptime: 97.2, throughput: 420, capacity: 88, robots: 2, active: 2, tasks: 6800, errors: 6, response: 1.5, region: "West", hub: "PNQ-HUB6", maint: "15 Aug 2026", lastDown: "22 Jul 2026", energy: 22, temp: 24 },
  { id: "WAM-09", system: "ASRS High Bay", type: "Automated Storage", vendor: "SSI Schaefer", zone: "A3-High Bay", status: "Maintenance", uptime: 85.4, throughput: 180, capacity: 45, robots: 8, active: 3, tasks: 7600, errors: 22, response: 3.2, region: "North", hub: "DEL-HUB2", maint: "04 Aug 2026", lastDown: "03 Aug 2026", energy: 55, temp: 21 },
  { id: "WAM-10", system: "Voice Pick System", type: "Voice Directed", vendor: "Honeywell Intelligrated", zone: "B1-B4 Picking", status: "Running", uptime: 98.5, throughput: 720, capacity: 82, robots: 0, active: 0, tasks: 11200, errors: 3, response: 0.9, region: "South", hub: "BLR-HUB3", maint: "28 Aug 2026", lastDown: "10 Jul 2026", energy: 5, temp: 23 },
]

interface WAMItem {
  id: string; system: string; type: string; vendor: string; zone: string; status: string
  uptime: number; throughput: number; capacity: number; robots: number; active: number
  tasks: number; errors: number; response: number; region: string; hub: string
  maint: string; lastDown: string; energy: number; temp: number
}

type Rec = any
const items: WAMItem[] = raw.map((r: Rec) => ({
  id: r.id, system: r.system, type: r.type, vendor: r.vendor, zone: r.zone, status: r.status,
  uptime: r.uptime, throughput: r.throughput, capacity: r.capacity, robots: r.robots, active: r.active,
  tasks: r.tasks, errors: r.errors, response: r.response, region: r.region, hub: r.hub,
  maint: r.maint, lastDown: r.lastDown, energy: r.energy, temp: r.temp,
}))

const typeColors: Record<string, string> = {
  "Micro-Fulfillment": "bg-violet-100 text-violet-700", "Mobile Robot": "bg-sky-100 text-sky-700",
  "Belt Conveyor": "bg-orange-100 text-orange-700", "Cross-Belt Sorter": "bg-rose-100 text-rose-700",
  "Robotic Arm": "bg-emerald-100 text-emerald-700", "Automated Guided": "bg-cyan-100 text-cyan-700",
  "Pick-to-Light": "bg-amber-100 text-amber-700", "VLM": "bg-indigo-100 text-indigo-700",
  "Automated Storage": "bg-blue-100 text-blue-700", "Voice Directed": "bg-lime-100 text-lime-700",
}

const statusColors: Record<string, string> = {
  "Running": "text-emerald-600 font-semibold", "Degraded": "text-amber-600 font-semibold",
  "Down": "text-red-600 font-semibold", "Maintenance": "text-blue-600 font-semibold",
}

const uptimePct = (v: number) => v >= 97 ? "text-emerald-600" : v >= 90 ? "text-amber-600" : "text-red-600"
const errColor = (v: number) => v === 0 ? "text-emerald-600" : v <= 5 ? "text-amber-600" : "text-red-600"
const respColor = (v: number) => v <= 1 ? "text-emerald-600" : v <= 2.5 ? "text-amber-600" : "text-red-600"

const WarehouseAutomationMetricsPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"systems" | "performance" | "maintenance">("systems")
  const filters = [
    { key: "type", label: "Type", options: ["Micro-Fulfillment", "Mobile Robot", "Belt Conveyor", "Cross-Belt Sorter", "Robotic Arm", "Automated Guided", "Pick-to-Light", "VLM", "Automated Storage", "Voice Directed"] },
    { key: "status", label: "Status", options: ["Running", "Degraded", "Down", "Maintenance"] },
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

  const totalSys = filtered.length
  const running = filtered.filter(r => r.status === "Running").length
  const avgUptime = totalSys ? Math.round(filtered.reduce((s, r) => s + r.uptime, 0) / totalSys * 10) / 10 : 0
  const totalTasks = filtered.reduce((s, r) => s + r.tasks, 0)

  const insights = [
    { label: "Total Systems", value: totalSys, icon: Cpu, bg: "bg-blue-50" },
    { label: "Running", value: running, icon: Zap, bg: "bg-emerald-50" },
    { label: "Avg Uptime", value: `${avgUptime}%`, icon: TrendingUp, bg: "bg-violet-50" },
    { label: "Total Tasks", value: totalTasks.toLocaleString(), icon: Activity, bg: "bg-amber-50" },
  ]

  const isCritical = (r: WAMItem) => r.status === "Down" || r.errors >= 20
  const isWarning = (r: WAMItem) => r.status === "Degraded" || r.status === "Maintenance" || r.errors >= 10

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
                className={`wam-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["systems", "performance", "maintenance"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "systems" && (
        <div className="wam-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`wam-item-card p-3 rounded-lg border ${isCritical(r) ? "wam-critical" : isWarning(r) ? "wam-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.system}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type] || "bg-gray-100 text-gray-600"}`}>{r.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status] || "text-gray-600"}`}>{r.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Vendor: <span className="font-medium">{r.vendor}</span></div>
                <div>Zone: <span className="font-medium">{r.zone}</span></div>
                <div>Uptime: <span className={`font-medium ${uptimePct(r.uptime)}`}>{r.uptime}%</span></div>
                <div>Throughput: <span className="font-medium">{r.throughput} units/h</span></div>
                <div>Tasks Today: <span className="font-medium">{r.tasks.toLocaleString()}</span></div>
                <div>Errors: <span className={`font-medium ${errColor(r.errors)}`}>{r.errors}</span></div>
                <div>Response: <span className={`font-medium ${respColor(r.response)}`}>{r.response}s</span></div>
                <div>Capacity: <span className="font-medium">{r.capacity}%</span></div>
              </div>
              {r.robots > 0 && (
                <div className="text-xs mt-2 text-muted-foreground">Robots: <span className="font-medium">{r.active}/{r.robots} active</span></div>
              )}
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.hub}, {r.region}</span>
                <span>Energy: {r.energy} kWh | Temp: {r.temp}\u00b0C</span>
              </div>
              {isCritical(r) && r.status === "Down" && <div className="wam-alert-text text-xs mt-2">System offline — {r.errors} errors, last down {r.lastDown}</div>}
              {isCritical(r) && r.status !== "Down" && <div className="wam-alert-text text-xs mt-2">Critical error count ({r.errors}) — immediate inspection required</div>}
            </div>
          ))}
        </div>
      )}

      {view === "performance" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => a.uptime - b.uptime).map(r => (
            <div key={r.id} className="wam-perf-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.system}</span>
                </div>
                <span className={`text-lg font-bold ${uptimePct(r.uptime)}`}>{r.uptime}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="wam-uptime-bar h-2 rounded-full" style={{ width: `${r.uptime}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Throughput: <span className="font-medium">{r.throughput}/h</span></div>
                <div>Errors: <span className={`font-medium ${errColor(r.errors)}`}>{r.errors}</span></div>
                <div>Response: <span className={`font-medium ${respColor(r.response)}`}>{r.response}s</span></div>
                <div>Tasks: <span className="font-medium">{r.tasks.toLocaleString()}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${typeColors[r.type] || "bg-gray-100 text-gray-600"}`}>{r.type}</span>
                <span className={`text-xs ${statusColors[r.status] || "text-gray-600"}`}>{r.status}</span>
                <span className="text-muted-foreground">Capacity: {r.capacity}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "maintenance" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => new Date(a.maint).getTime() - new Date(b.maint).getTime()).map(r => (
            <div key={r.id} className="wam-maint-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.system}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type] || "bg-gray-100 text-gray-600"}`}>{r.type}</span>
                </div>
                <span className={`text-xs ${statusColors[r.status] || "text-gray-600"}`}>{r.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Vendor: <span className="font-medium">{r.vendor}</span></div>
                <div>Hub: <span className="font-medium">{r.hub}</span></div>
                <div>Next Maint: <span className="font-medium">{r.maint}</span></div>
                <div>Last Down: <span className="font-medium">{r.lastDown}</span></div>
                <div>Energy: <span className="font-medium">{r.energy} kWh</span></div>
                <div>Temp: <span className="font-medium">{r.temp}\u00b0C</span></div>
                <div>Uptime: <span className={`font-medium ${uptimePct(r.uptime)}`}>{r.uptime}%</span></div>
                <div>Errors: <span className={`font-medium ${errColor(r.errors)}`}>{r.errors}</span></div>
              </div>
              {(r.status === "Maintenance" || r.status === "Down") && <div className="wam-alert-text text-xs mt-2">{r.status === "Down" ? "System offline" : "Scheduled maintenance"} — {r.robots > 0 ? `${r.active}/${r.robots} robots active` : "Crew dispatched"}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { WarehouseAutomationMetricsPanel }
