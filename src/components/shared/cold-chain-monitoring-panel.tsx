"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Thermometer, Snowflake, AlertTriangle, Activity
} from "lucide-react"

const raw = [
  { id: "CCM-01", chamber: "Cold Room A1", hub: "MUM-HUB1", commodity: "Dairy Products", capacity: 5000, current: 3200, setTemp: 4, actualTemp: 4.2, humidity: 85, doorOpen: 12, lastDefrost: "2h ago", energyUsage: 245, status: "Optimal", compressor: "Running", backup: "Standby", alarmCount: 0, avgTemp: 4.1, region: "West" },
  { id: "CCM-02", chamber: "Freezer B2", hub: "DEL-HUB2", commodity: "Frozen Food", capacity: 8000, current: 7500, setTemp: -18, actualTemp: -15.8, humidity: 45, doorOpen: 28, lastDefrost: "8h ago", energyUsage: 420, status: "Temp Deviation", compressor: "Overloaded", backup: "Active", alarmCount: 3, avgTemp: -16.2, region: "North" },
  { id: "CCM-03", chamber: "Pharma Vault C1", hub: "BLR-HUB3", commodity: "Vaccines", capacity: 2000, current: 1800, setTemp: 2, actualTemp: 2.1, humidity: 40, doorOpen: 4, lastDefrost: "1h ago", energyUsage: 180, status: "Optimal", compressor: "Running", backup: "Standby", alarmCount: 0, avgTemp: 2.0, region: "South" },
  { id: "CCM-04", chamber: "Chill Zone D3", hub: "MAA-HUB4", commodity: "Fresh Produce", capacity: 6000, current: 4500, setTemp: 8, actualTemp: 9.8, humidity: 92, doorOpen: 22, lastDefrost: "6h ago", energyUsage: 310, status: "At Risk", compressor: "Running", backup: "Standby", alarmCount: 2, avgTemp: 9.2, region: "South" },
  { id: "CCM-05", chamber: "Deep Freeze E1", hub: "HYD-HUB5", commodity: "Ice Cream", capacity: 3000, current: 2800, setTemp: -25, actualTemp: -24.5, humidity: 30, doorOpen: 8, lastDefrost: "4h ago", energyUsage: 380, status: "Optimal", compressor: "Running", backup: "Standby", alarmCount: 0, avgTemp: -24.8, region: "South" },
  { id: "CCM-06", chamber: "Banana Ripening F1", hub: "CCU-HUB7", commodity: "Bananas", capacity: 4000, current: 3500, setTemp: 14, actualTemp: 15.5, humidity: 95, doorOpen: 15, lastDefrost: "3h ago", energyUsage: 195, status: "Temp Deviation", compressor: "Cycling", backup: "Standby", alarmCount: 2, avgTemp: 15.0, region: "East" },
  { id: "CCM-07", chamber: "Meat Locker G2", hub: "AMD-HUB9", commodity: "Fresh Meat", capacity: 3500, current: 2800, setTemp: 0, actualTemp: 0.3, humidity: 80, doorOpen: 10, lastDefrost: "2h ago", energyUsage: 285, status: "Optimal", compressor: "Running", backup: "Standby", alarmCount: 0, avgTemp: 0.2, region: "West" },
  { id: "CCM-08", chamber: "Floral Cooler H1", hub: "PNQ-HUB6", commodity: "Flowers", capacity: 1500, current: 800, setTemp: 5, actualTemp: 5.2, humidity: 88, doorOpen: 6, lastDefrost: "1h ago", energyUsage: 120, status: "Optimal", compressor: "Running", backup: "Standby", alarmCount: 0, avgTemp: 5.1, region: "West" },
  { id: "CCM-09", chamber: "Chemical Store I1", hub: "DEL-HUB2", commodity: "Reagents", capacity: 1000, current: 950, setTemp: 10, actualTemp: 13.2, humidity: 55, doorOpen: 5, lastDefrost: "12h ago", energyUsage: 150, status: "Critical", compressor: "Failed", backup: "Active", alarmCount: 5, avgTemp: 11.8, region: "North" },
  { id: "CCM-10", chamber: "Beverage Vault J2", hub: "BLR-HUB3", commodity: "Juices", capacity: 7000, current: 5200, setTemp: 6, actualTemp: 6.1, humidity: 75, doorOpen: 9, lastDefrost: "2h ago", energyUsage: 220, status: "Optimal", compressor: "Running", backup: "Standby", alarmCount: 0, avgTemp: 6.0, region: "South" },
]

interface CCMItem {
  id: string; chamber: string; hub: string; commodity: string; capacity: number
  current: number; setTemp: number; actualTemp: number; humidity: number
  doorOpen: number; lastDefrost: string; energyUsage: number; status: string
  compressor: string; backup: string; alarmCount: number; avgTemp: number; region: string
}

type Rec = any
const items: CCMItem[] = raw.map((r: Rec) => ({
  id: r.id, chamber: r.chamber, hub: r.hub, commodity: r.commodity, capacity: r.capacity,
  current: r.current, setTemp: r.setTemp, actualTemp: r.actualTemp, humidity: r.humidity,
  doorOpen: r.doorOpen, lastDefrost: r.lastDefrost, energyUsage: r.energyUsage, status: r.status,
  compressor: r.compressor, backup: r.backup, alarmCount: r.alarmCount, avgTemp: r.avgTemp, region: r.region,
}))

const commodityColors: Record<string, string> = {
  "Dairy Products": "bg-blue-100 text-blue-700", "Frozen Food": "bg-cyan-100 text-cyan-700",
  "Vaccines": "bg-emerald-100 text-emerald-700", "Fresh Produce": "bg-green-100 text-green-700",
  "Ice Cream": "bg-indigo-100 text-indigo-700", "Bananas": "bg-yellow-100 text-yellow-700",
  "Fresh Meat": "bg-rose-100 text-rose-700", "Flowers": "bg-pink-100 text-pink-700",
  "Reagents": "bg-orange-100 text-orange-700", "Juices": "bg-amber-100 text-amber-700",
}

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "At Risk": "text-amber-600 font-semibold",
  "Temp Deviation": "text-red-600 font-semibold", "Critical": "text-red-600 font-semibold",
}

const tempColor = (actual: number, set: number) => {
  const diff = Math.abs(actual - set)
  if (set >= 0) return diff <= 1 ? "text-emerald-600" : diff <= 2 ? "text-amber-600" : "text-red-600"
  return diff <= 2 ? "text-emerald-600" : diff <= 3 ? "text-amber-600" : "text-red-600"
}
const humColor = (v: number) => v >= 40 && v <= 90 ? "text-emerald-600" : v >= 30 && v <= 95 ? "text-amber-600" : "text-red-600"
const energyColor = (v: number) => v >= 350 ? "text-red-600" : v >= 250 ? "text-amber-600" : "text-emerald-600"
const utilColor = (cur: number, cap: number) => {
  const pct = cur / cap * 100
  return pct >= 90 ? "text-red-600" : pct >= 75 ? "text-amber-600" : "text-emerald-600"
}

const ColdChainMonitoringPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"chambers" | "temperature" | "energy">("chambers")
  const filters = [
    { key: "status", label: "Status", options: ["Optimal", "At Risk", "Temp Deviation", "Critical"] },
    { key: "compressor", label: "Compressor", options: ["Running", "Cycling", "Overloaded", "Failed"] },
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

  const totalChambers = filtered.length
  const optimalCount = filtered.filter(r => r.status === "Optimal").length
  const totalAlarms = filtered.reduce((s, r) => s + r.alarmCount, 0)
  const totalEnergy = filtered.reduce((s, r) => s + r.energyUsage, 0)

  const insights = [
    { label: "Chambers", value: totalChambers, icon: Snowflake, bg: "bg-blue-50" },
    { label: "Optimal", value: optimalCount, icon: Activity, bg: "bg-emerald-50" },
    { label: "Alarms", value: totalAlarms, icon: AlertTriangle, bg: "bg-amber-50" },
    { label: "Energy kWh", value: totalEnergy, icon: Thermometer, bg: "bg-violet-50" },
  ]

  const isCritical = (r: CCMItem) => r.status === "Critical" || r.compressor === "Failed" || r.alarmCount >= 4
  const isWarning = (r: CCMItem) => r.status === "Temp Deviation" || r.status === "At Risk" || r.compressor === "Overloaded"

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
                className={`ccm-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["chambers", "temperature", "energy"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "chambers" && (
        <div className="ccm-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`ccm-item-card p-3 rounded-lg border ${isCritical(r) ? "ccm-critical" : isWarning(r) ? "ccm-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.chamber}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${commodityColors[r.commodity]}`}>{r.commodity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className="text-xs text-muted-foreground">{r.hub}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Temp: <span className={`font-medium ${tempColor(r.actualTemp, r.setTemp)}`}>{r.actualTemp}\u00b0C</span> / Set: {r.setTemp}\u00b0C | Avg: {r.avgTemp}\u00b0C</div>
                <div>Humidity: <span className={`font-medium ${humColor(r.humidity)}`}>{r.humidity}%</span> | Doors: <span className="font-medium">{r.doorOpen}</span> | Defrost: {r.lastDefrost}</div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                <div>Util: <span className={`font-medium ${utilColor(r.current, r.capacity)}`}>{r.current}/{r.capacity}</span></div>
                <div>Energy: <span className={`font-medium ${energyColor(r.energyUsage)}`}>{r.energyUsage} kWh</span></div>
                <div>Compressor: <span className="font-medium">{r.compressor}</span></div>
                <div>Backup: <span className="font-medium">{r.backup}</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Alarms: <span className={r.alarmCount > 0 ? "text-red-600 font-medium" : "text-emerald-600"}>{r.alarmCount}</span></span>
                <span>{r.region}</span>
              </div>
              {isCritical(r) && <div className="ccm-alert-text text-xs mt-2">Chamber critical — temp {r.actualTemp}\u00b0C vs set {r.setTemp}\u00b0C, compressor {r.compressor}, {r.alarmCount} alarms</div>}
            </div>
          ))}
        </div>
      )}

      {view === "temperature" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => Math.abs(b.actualTemp - b.setTemp) - Math.abs(a.actualTemp - a.setTemp)).map(r => {
            const dev = Math.abs(r.actualTemp - r.setTemp)
            return (
              <div key={r.id} className="ccm-temp-card p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                    <span className="font-semibold text-sm">{r.chamber}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${commodityColors[r.commodity]}`}>{r.commodity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${tempColor(r.actualTemp, r.setTemp)}`}>{r.actualTemp}\u00b0C</span>
                    <span className="text-xs text-muted-foreground">/ {r.setTemp}\u00b0C</span>
                    {dev > 2 && <span className="text-xs text-red-600 font-medium">+{dev.toFixed(1)}\u00b0</span>}
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`ccm-temp-bar h-2 rounded-full ${dev > 3 ? "ccm-temp-crit" : dev > 2 ? "ccm-temp-warn" : ""}`} style={{ width: `${Math.min(Math.max((1 - dev / 10) * 100, 10), 100)}%` }} /></div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>Avg Temp: <span className="font-medium">{r.avgTemp}\u00b0C</span></div>
                  <div>Humidity: <span className={`font-medium ${humColor(r.humidity)}`}>{r.humidity}%</span></div>
                  <div>Doors: <span className="font-medium">{r.doorOpen}</span></div>
                  <div>Defrost: <span className="font-medium">{r.lastDefrost}</span></div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className="text-muted-foreground">{r.hub} | Compressor: {r.compressor} | Alarms: {r.alarmCount}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {view === "energy" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.energyUsage - a.energyUsage).map(r => (
            <div key={r.id} className="ccm-energy-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.chamber}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${commodityColors[r.commodity]}`}>{r.commodity}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${energyColor(r.energyUsage)}`}>{r.energyUsage}</span>
                  <span className="text-xs text-muted-foreground">kWh</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`ccm-energy-bar h-2 rounded-full ${r.energyUsage >= 350 ? "ccm-energy-high" : r.energyUsage >= 250 ? "ccm-energy-med" : ""}`} style={{ width: `${Math.min(r.energyUsage / 500 * 100, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Util: <span className={`font-medium ${utilColor(r.current, r.capacity)}`}>{r.current}/{r.capacity}</span></div>
                <div>Temp: <span className={`font-medium ${tempColor(r.actualTemp, r.setTemp)}`}>{r.actualTemp}\u00b0C</span></div>
                <div>Compressor: <span className="font-medium">{r.compressor}</span></div>
                <div>Doors: <span className="font-medium">{r.doorOpen}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.hub} | Alarms: {r.alarmCount} | {r.region}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { ColdChainMonitoringPanel }
