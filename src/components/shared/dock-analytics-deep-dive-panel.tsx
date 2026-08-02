"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Anchor, Clock, AlertTriangle, Gauge
} from "lucide-react"

const raw = [
  { id: "DAD-01", dock: "Dock A1", door: "D-A1", warehouse: "Mumbai Mega DC", city: "Navi Mumbai", region: "West", type: "Inbound", status: "Active", turnaround: 45, targetTurnaround: 60, utilPct: 92, trucksProcessed: 28, avgWait: 18, currentTruck: "MH02AB1234", carrier: "Rivigo", cargo: "FMCG", weight: 18.5, pallets: 42, nextSlot: "16:30", delay: -15, equip: "Dock Leveller", operator: "Rajesh K", shift: "A", issues: 0 },
  { id: "DAD-02", dock: "Dock B3", door: "D-B3", warehouse: "Mumbai Mega DC", city: "Navi Mumbai", region: "West", type: "Outbound", status: "Idle", turnaround: 38, targetTurnaround: 45, utilPct: 85, trucksProcessed: 22, avgWait: 25, currentTruck: "-", carrier: "-", cargo: "-", weight: 0, pallets: 0, nextSlot: "16:45", delay: 0, equip: "Conveyor", operator: "Sunil M", shift: "A", issues: 0 },
  { id: "DAD-03", dock: "Dock C2", door: "D-C2", warehouse: "Delhi NCR Hub", city: "Gurugram", region: "North", type: "Inbound", status: "Blocked", turnaround: 95, targetTurnaround: 60, utilPct: 68, trucksProcessed: 12, avgWait: 52, currentTruck: "DL08CD5678", carrier: "Ecom Express", cargo: "E-commerce", weight: 8.2, pallets: 18, nextSlot: "-", delay: 35, equip: "Dock Leveller", operator: "Amit S", shift: "B", issues: 3 },
  { id: "DAD-04", dock: "Dock D1", door: "D-D1", warehouse: "Delhi NCR Hub", city: "Gurugram", region: "North", type: "Cross Dock", status: "Active", turnaround: 28, targetTurnaround: 30, utilPct: 78, trucksProcessed: 35, avgWait: 12, currentTruck: "HR26EF9012", carrier: "Delhivery", cargo: "Electronics", weight: 12.8, pallets: 28, nextSlot: "16:15", delay: -2, equip: "Roller Bed", operator: "Vikram P", shift: "A", issues: 0 },
  { id: "DAD-05", dock: "Dock E4", door: "D-E4", warehouse: "Bengaluru DC", city: "Devanahalli", region: "South", type: "Outbound", status: "Active", turnaround: 42, targetTurnaround: 45, utilPct: 88, trucksProcessed: 25, avgWait: 15, currentTruck: "KA01GH3456", carrier: "XpressBees", cargo: "Apparel", weight: 6.5, pallets: 22, nextSlot: "17:00", delay: -3, equip: "Dock Leveller", operator: "Pradeep R", shift: "A", issues: 0 },
  { id: "DAD-06", dock: "Dock F2", door: "D-F2", warehouse: "Bengaluru DC", city: "Devanahalli", region: "South", type: "Inbound", status: "Maintenance", turnaround: 0, targetTurnaround: 60, utilPct: 0, trucksProcessed: 0, avgWait: 0, currentTruck: "-", carrier: "-", cargo: "-", weight: 0, pallets: 0, nextSlot: "18:00", delay: 0, equip: "Dock Leveller", operator: "-", shift: "-", issues: 1 },
  { id: "DAD-07", dock: "Dock G1", door: "D-G1", warehouse: "Chennai DC", city: "Sriperumbudur", region: "South", type: "Outbound", status: "Active", turnaround: 55, targetTurnaround: 45, utilPct: 95, trucksProcessed: 32, avgWait: 28, currentTruck: "TN09IJ7890", carrier: "BlueDart", cargo: "Pharma", weight: 4.2, pallets: 15, nextSlot: "16:20", delay: 10, equip: "Cold Dock", operator: "Kumar V", shift: "B", issues: 2 },
  { id: "DAD-08", dock: "Dock H3", door: "D-H3", warehouse: "Chennai DC", city: "Sriperumbudur", region: "South", type: "Inbound", status: "Active", turnaround: 48, targetTurnaround: 60, utilPct: 82, trucksProcessed: 18, avgWait: 20, currentTruck: "TN04KL2345", carrier: "Snowman", cargo: "Cold Chain", weight: 22.0, pallets: 55, nextSlot: "16:50", delay: -12, equip: "Cold Dock", operator: "Arun D", shift: "A", issues: 0 },
  { id: "DAD-09", dock: "Dock J2", door: "D-J2", warehouse: "Hyderabad DC", city: "Medchal", region: "South", type: "Cross Dock", status: "Congested", turnaround: 82, targetTurnaround: 40, utilPct: 98, trucksProcessed: 15, avgWait: 45, currentTruck: "TS08MN6789", carrier: "Shadowfax", cargo: "FMCG", weight: 14.5, pallets: 35, nextSlot: "-", delay: 42, equip: "Conveyor", operator: "Suresh B", shift: "B", issues: 4 },
  { id: "DAD-10", dock: "Dock K1", door: "D-K1", warehouse: "Ahmedabad FC", city: "Sanand", region: "West", type: "Inbound", status: "Active", turnaround: 35, targetTurnaround: 60, utilPct: 72, trucksProcessed: 20, avgWait: 10, currentTruck: "GJ05OP0123", carrier: "Adani Logistics", cargo: "Auto Parts", weight: 28.5, pallets: 48, nextSlot: "17:15", delay: -25, equip: "Dock Leveller", operator: "Mehul P", shift: "A", issues: 0 },
]

interface DADItem {
  id: string; dock: string; door: string; warehouse: string; city: string; region: string
  type: string; status: string; turnaround: number; targetTurnaround: number
  utilPct: number; trucksProcessed: number; avgWait: number; currentTruck: string
  carrier: string; cargo: string; weight: number; pallets: number
  nextSlot: string; delay: number; equip: string; operator: string; shift: string; issues: number
}

type Rec = any
const items: DADItem[] = raw.map((r: Rec) => ({
  id: r.id, dock: r.dock, door: r.door, warehouse: r.warehouse, city: r.city, region: r.region,
  type: r.type, status: r.status, turnaround: r.turnaround, targetTurnaround: r.targetTurnaround,
  utilPct: r.utilPct, trucksProcessed: r.trucksProcessed, avgWait: r.avgWait, currentTruck: r.currentTruck,
  carrier: r.carrier, cargo: r.cargo, weight: r.weight, pallets: r.pallets,
  nextSlot: r.nextSlot, delay: r.delay, equip: r.equip, operator: r.operator, shift: r.shift, issues: r.issues,
}))

const typeColors: Record<string, string> = {
  "Inbound": "bg-emerald-100 text-emerald-700", "Outbound": "bg-blue-100 text-blue-700",
  "Cross Dock": "bg-violet-100 text-violet-700",
}

const statusColors: Record<string, string> = {
  "Active": "text-emerald-600 font-semibold", "Idle": "text-gray-500 font-semibold",
  "Blocked": "text-red-600 font-semibold", "Maintenance": "text-amber-600 font-semibold",
  "Congested": "text-red-600 font-semibold",
}

const utilColor = (v: number) => v >= 95 ? "text-red-600" : v >= 80 ? "text-amber-600" : "text-emerald-600"
const waitColor = (v: number) => v <= 15 ? "text-emerald-600" : v <= 30 ? "text-amber-600" : "text-red-600"
const delayColor = (v: number) => v <= 0 ? "text-emerald-600" : v <= 10 ? "text-amber-600" : "text-red-600"

const DockAnalyticsDeepDivePanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"docks" | "turnaround" | "utilization">("docks")
  const filters = [
    { key: "type", label: "Type", options: ["Inbound", "Outbound", "Cross Dock"] },
    { key: "status", label: "Status", options: ["Active", "Idle", "Blocked", "Maintenance", "Congested"] },
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

  const activeDocks = filtered.filter(r => r.status === "Active").length
  const avgTurn = filtered.filter(r => r.turnaround > 0).length ? Math.round(filtered.reduce((s, r) => s + (r.turnaround || 0), 0) / filtered.filter(r => r.turnaround > 0).length) : 0
  const avgUtil = filtered.length ? Math.round(filtered.reduce((s, r) => s + r.utilPct, 0) / filtered.length) : 0
  const totalIssues = filtered.reduce((s, r) => s + r.issues, 0)

  const insights = [
    { label: "Active Docks", value: activeDocks, icon: Anchor, bg: "bg-blue-50" },
    { label: "Avg Turnaround", value: `${avgTurn}m`, icon: Clock, bg: "bg-emerald-50" },
    { label: "Avg Utilization", value: `${avgUtil}%`, icon: Gauge, bg: "bg-violet-50" },
    { label: "Issues", value: totalIssues, icon: AlertTriangle, bg: "bg-amber-50" },
  ]

  const isCritical = (r: DADItem) => r.status === "Blocked" || r.status === "Congested"
  const isWarning = (r: DADItem) => r.delay > 10 || r.issues >= 2

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
                className={`dad-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["docks", "turnaround", "utilization"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "docks" && (
        <div className="dad-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`dad-item-card p-3 rounded-lg border ${isCritical(r) ? "dad-critical" : isWarning(r) ? "dad-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.dock}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className="text-xs text-muted-foreground">{r.shift} Shift</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Turnaround: <span className={`font-medium ${r.turnaround > r.targetTurnaround ? "text-red-600" : "text-emerald-600"}`}>{r.turnaround}m</span> / Target: {r.targetTurnaround}m</div>
                <div>Utilization: <span className={`font-medium ${utilColor(r.utilPct)}`}>{r.utilPct}%</span></div>
                <div>Avg Wait: <span className={`font-medium ${waitColor(r.avgWait)}`}>{r.avgWait}m</span></div>
                <div>Trucks: <span className="font-medium">{r.trucksProcessed}</span></div>
                <div>Delay: <span className={`font-medium ${delayColor(r.delay)}`}>{r.delay > 0 ? `+${r.delay}m` : r.delay === 0 ? "On time" : `${r.delay}m`}</span></div>
                <div>Equipment: <span className="font-medium">{r.equip}</span></div>
                {r.currentTruck !== "-" && (
                  <>
                    <div>Truck: <span className="font-medium">{r.currentTruck}</span></div>
                    <div>Carrier: <span className="font-medium">{r.carrier}</span></div>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.warehouse}, {r.city} | Door: {r.door}</span>
                <span>Operator: {r.operator} | {r.issues > 0 ? `${r.issues} issues` : "No issues"}</span>
              </div>
              {isCritical(r) && <div className="dad-alert-text text-xs mt-2">{r.status === "Blocked" ? "Blocked dock" : "Congested"} — turnaround {r.turnaround}m, delay +{r.delay}m, {r.issues} active issues</div>}
            </div>
          ))}
        </div>
      )}

      {view === "turnaround" && (
        <div className="space-y-2">
          {[...filtered].filter(r => r.turnaround > 0).sort((a, b) => b.turnaround - a.turnaround).map(r => (
            <div key={r.id} className="dad-turn-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.dock}</span>
                  <span className="font-semibold text-sm">{r.warehouse}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${r.turnaround > r.targetTurnaround ? "text-red-600" : "text-emerald-600"}`}>{r.turnaround}m</span>
                  <span className="text-xs text-muted-foreground">Target: {r.targetTurnaround}m</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`dad-turn-bar h-2 rounded-full ${r.turnaround > r.targetTurnaround ? "dad-turn-over" : ""}`} style={{ width: `${Math.min(r.turnaround / r.targetTurnaround * 100, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Wait: <span className={`font-medium ${waitColor(r.avgWait)}`}>{r.avgWait}m</span></div>
                <div>Delay: <span className={`font-medium ${delayColor(r.delay)}`}>{r.delay > 0 ? `+${r.delay}m` : r.delay === 0 ? "On time" : `${r.delay}m`}</span></div>
                <div>Trucks: <span className="font-medium">{r.trucksProcessed}</span></div>
                <div>Issues: <span className={`font-medium ${r.issues > 0 ? "text-red-600" : "text-emerald-600"}`}>{r.issues}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.city}, {r.region} | {r.equip}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "utilization" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.utilPct - a.utilPct).map(r => (
            <div key={r.id} className="dad-util-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.door}</span>
                  <span className="font-semibold text-sm">{r.dock}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                </div>
                <span className={`text-lg font-bold ${utilColor(r.utilPct)}`}>{r.utilPct}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="dad-util-bar h-2 rounded-full" style={{ width: `${r.utilPct}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Turnaround: <span className="font-medium">{r.turnaround}m</span></div>
                <div>Trucks: <span className="font-medium">{r.trucksProcessed}</span></div>
                <div>Weight: <span className="font-medium">{r.weight}T</span></div>
                <div>Pallets: <span className="font-medium">{r.pallets}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.warehouse}, {r.city}</span>
                {r.currentTruck !== "-" && <span className="text-muted-foreground">{r.carrier} | {r.cargo}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { DockAnalyticsDeepDivePanel }
