"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Route, AlertTriangle, TrendingUp, DollarSign
} from "lucide-react"

const raw = [
  { id: "MMO-01", route: "Mumbai-Delhi", origin: "MUM-HUB1", dest: "DEL-HUB2", mode: "Road", altMode: "Rail", distance: 1420, transitHrs: 28, altTransitHrs: 42, costPerTkm: 2.8, altCost: 1.9, loadFactor: 88, otp: 92.5, co2PerTkm: 62, altCO2: 28, savingsPct: 18.2, status: "Optimized", volume: 8500, carrier: "Rivigo", region: "West-North" },
  { id: "MMO-02", route: "Delhi-Kolkata", origin: "DEL-HUB2", dest: "CCU-HUB7", mode: "Road", altMode: "Rail", distance: 1500, transitHrs: 32, altTransitHrs: 48, costPerTkm: 3.1, altCost: 2.2, loadFactor: 72, otp: 78.5, co2PerTkm: 68, altCO2: 32, savingsPct: 8.5, status: "Cost Excessive", volume: 4200, carrier: "TCI Express", region: "North-East" },
  { id: "MMO-03", route: "Bengaluru-Chennai", origin: "BLR-HUB3", dest: "MAA-HUB4", mode: "Road", altMode: "Road", distance: 350, transitHrs: 7, altTransitHrs: 7, costPerTkm: 2.4, altCost: 2.4, loadFactor: 94, otp: 97.8, co2PerTkm: 55, altCO2: 55, savingsPct: 0, status: "Active", volume: 6200, carrier: "Delhivery", region: "South" },
  { id: "MMO-04", route: "Mumbai-Kochi", origin: "MUM-HUB1", dest: "KOC-HUB8", mode: "Sea+Road", altMode: "Road", distance: 1200, transitHrs: 48, altTransitHrs: 24, costPerTkm: 1.5, altCost: 3.8, loadFactor: 82, otp: 88.2, co2PerTkm: 22, altCO2: 58, savingsPct: 35.6, status: "Optimized", volume: 12500, carrier: "Shreyas Shipping", region: "West-South" },
  { id: "MMO-05", route: "Delhi-Hyderabad", origin: "DEL-HUB2", dest: "HYD-HUB5", mode: "Road", altMode: "Air", distance: 1580, transitHrs: 30, altTransitHrs: 4, costPerTkm: 2.9, altCost: 12.5, loadFactor: 78, otp: 85.4, co2PerTkm: 65, altCO2: 185, savingsPct: 5.2, status: "Under Review", volume: 3800, carrier: "XpressBees", region: "North-South" },
  { id: "MMO-06", route: "Kolkata-Guwahati", origin: "CCU-HUB7", dest: "GAU-HUB10", mode: "Road", altMode: "River+Road", distance: 980, transitHrs: 22, altTransitHrs: 36, costPerTkm: 4.2, altCost: 2.8, loadFactor: 58, otp: 72.1, co2PerTkm: 72, altCO2: 35, savingsPct: -12.4, status: "Delayed", volume: 2100, carrier: "Shadowfax", region: "East-NE" },
  { id: "MMO-07", route: "Chennai-Visakhapatnam", origin: "MAA-HUB4", dest: "VIZ-HUB11", mode: "Sea+Road", altMode: "Road", distance: 760, transitHrs: 18, altTransitHrs: 12, costPerTkm: 1.8, altCost: 2.6, loadFactor: 90, otp: 94.5, co2PerTkm: 30, altCO2: 52, savingsPct: 22.8, status: "Optimized", volume: 7400, carrier: "Adani Logistics", region: "South-East" },
  { id: "MMO-08", route: "Mumbai-Ahmedabad", origin: "MUM-HUB1", dest: "AMD-HUB9", mode: "Rail", altMode: "Road", distance: 530, transitHrs: 10, altTransitHrs: 8, costPerTkm: 1.6, altCost: 2.2, loadFactor: 86, otp: 96.2, co2PerTkm: 25, altCO2: 48, savingsPct: 28.5, status: "Optimized", volume: 9800, carrier: "Indian Railways", region: "West" },
  { id: "MMO-09", route: "Bengaluru-Kolkata", origin: "BLR-HUB3", dest: "CCU-HUB7", mode: "Road", altMode: "Air+Road", distance: 1650, transitHrs: 34, altTransitHrs: 8, costPerTkm: 3.5, altCost: 18.2, loadFactor: 65, otp: 74.8, co2PerTkm: 70, altCO2: 195, savingsPct: -8.2, status: "Cost Excessive", volume: 2800, carrier: "BlueDart", region: "South-East" },
  { id: "MMO-10", route: "Pune-Nagpur", origin: "PNQ-HUB6", dest: "NGP-HUB12", mode: "Road", altMode: "Rail", distance: 720, transitHrs: 14, altTransitHrs: 20, costPerTkm: 2.5, altCost: 1.8, loadFactor: 76, otp: 91.0, co2PerTkm: 58, altCO2: 30, savingsPct: 12.4, status: "Under Review", volume: 5100, carrier: "Ecom Express", region: "West-Central" },
]

interface MMOItem {
  id: string; route: string; origin: string; dest: string; mode: string
  altMode: string; distance: number; transitHrs: number; altTransitHrs: number
  costPerTkm: number; altCost: number; loadFactor: number; otp: number
  co2PerTkm: number; altCO2: number; savingsPct: number; status: string
  volume: number; carrier: string; region: string
}

type Rec = any
const items: MMOItem[] = raw.map((r: Rec) => ({
  id: r.id, route: r.route, origin: r.origin, dest: r.dest, mode: r.mode,
  altMode: r.altMode, distance: r.distance, transitHrs: r.transitHrs, altTransitHrs: r.altTransitHrs,
  costPerTkm: r.costPerTkm, altCost: r.altCost, loadFactor: r.loadFactor, otp: r.otp,
  co2PerTkm: r.co2PerTkm, altCO2: r.altCO2, savingsPct: r.savingsPct, status: r.status,
  volume: r.volume, carrier: r.carrier, region: r.region,
}))

const modeColors: Record<string, string> = {
  "Road": "bg-blue-100 text-blue-700", "Rail": "bg-orange-100 text-orange-700",
  "Air": "bg-sky-100 text-sky-700", "Sea+Road": "bg-cyan-100 text-cyan-700",
  "Air+Road": "bg-indigo-100 text-indigo-700", "River+Road": "bg-teal-100 text-teal-700",
}

const statusColors: Record<string, string> = {
  "Optimized": "text-emerald-600 font-semibold", "Active": "text-blue-600 font-semibold",
  "Under Review": "text-amber-600 font-semibold", "Cost Excessive": "text-red-600 font-semibold",
  "Delayed": "text-red-600 font-semibold",
}

const otpColor = (v: number) => v >= 95 ? "text-emerald-600" : v >= 85 ? "text-blue-600" : v >= 75 ? "text-amber-600" : "text-red-600"
const loadColor = (v: number) => v >= 85 ? "text-emerald-600" : v >= 70 ? "text-blue-600" : v >= 60 ? "text-amber-600" : "text-red-600"
const co2Color = (v: number, a: number) => v <= a * 0.6 ? "text-emerald-600" : v <= a ? "text-amber-600" : "text-red-600"
const savingsColor = (v: number) => v >= 20 ? "text-emerald-600" : v >= 10 ? "text-blue-600" : v >= 0 ? "text-amber-600" : "text-red-600"

const fmtAmt = (v: number) => `\u20b9${v.toFixed(1)}`

const MultiModalOptimizationPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"routes" | "cost" | "performance">("routes")
  const filters = [
    { key: "mode", label: "Mode", options: ["Road", "Rail", "Sea+Road", "Air+Road", "River+Road"] },
    { key: "status", label: "Status", options: ["Optimized", "Active", "Under Review", "Cost Excessive", "Delayed"] },
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

  const totalRoutes = filtered.length
  const avgSavings = totalRoutes ? Math.round(filtered.reduce((s, r) => s + r.savingsPct, 0) / totalRoutes * 10) / 10 : 0
  const avgOTP = totalRoutes ? Math.round(filtered.reduce((s, r) => s + r.otp, 0) / totalRoutes * 10) / 10 : 0
  const totalVolume = filtered.reduce((s, r) => s + r.volume, 0)

  const insights = [
    { label: "Active Routes", value: totalRoutes, icon: Route, bg: "bg-blue-50" },
    { label: "Avg Savings", value: `${avgSavings}%`, icon: DollarSign, bg: "bg-emerald-50" },
    { label: "Avg OTP", value: `${avgOTP}%`, icon: TrendingUp, bg: "bg-violet-50" },
    { label: "Total Volume", value: `${(totalVolume / 1000).toFixed(1)}K`, icon: AlertTriangle, bg: "bg-amber-50" },
  ]

  const isCritical = (r: MMOItem) => r.status === "Delayed" || r.status === "Cost Excessive"
  const isWarning = (r: MMOItem) => r.status === "Under Review" || r.loadFactor < 70 || r.otp < 80

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
                className={`mmo-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["routes", "cost", "performance"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "routes" && (
        <div className="mmo-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`mmo-item-card p-3 rounded-lg border ${isCritical(r) ? "mmo-critical" : isWarning(r) ? "mmo-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.route}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${modeColors[r.mode]}`}>{r.mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className="text-xs text-muted-foreground">{r.carrier}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Transit: <span className="font-medium">{r.transitHrs}h</span> | Alt: <span className="font-medium">{r.altTransitHrs}h</span> ({r.altMode})</div>
                <div>Distance: <span className="font-medium">{r.distance}km</span> | {r.region}</div>
                <div>Cost/tkm: <span className="font-medium">{fmtAmt(r.costPerTkm)}</span> | Alt: <span className="font-medium">{fmtAmt(r.altCost)}</span></div>
                <div>OTP: <span className={`font-medium ${otpColor(r.otp)}`}>{r.otp}%</span> | Load: <span className={`font-medium ${loadColor(r.loadFactor)}`}>{r.loadFactor}%</span></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div>CO2: <span className={`font-medium ${co2Color(r.co2PerTkm, r.altCO2)}`}>{r.co2PerTkm}g</span> vs {r.altCO2}g</div>
                <div>Savings: <span className={`font-medium ${savingsColor(r.savingsPct)}`}>{r.savingsPct >= 0 ? "+" : ""}{r.savingsPct}%</span></div>
                <div>Volume: <span className="font-medium">{r.volume.toLocaleString()}</span> kg</div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.origin} &gt; {r.dest}</span>
              </div>
              {isCritical(r) && <div className="mmo-alert-text text-xs mt-2">Route critical — OTP {r.otp}%, load {r.loadFactor}%, savings {r.savingsPct}%</div>}
            </div>
          ))}
        </div>
      )}

      {view === "cost" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.costPerTkm - a.costPerTkm).map(r => (
            <div key={r.id} className="mmo-cost-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.route}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${modeColors[r.mode]}`}>{r.mode}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${r.costPerTkm > 3 ? "text-red-600" : r.costPerTkm > 2 ? "text-amber-600" : "text-emerald-600"}`}>{fmtAmt(r.costPerTkm)}</span>
                  <span className="text-xs text-muted-foreground">per tkm</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="mmo-cost-bar h-2 rounded-full" style={{ width: `${Math.min(r.costPerTkm / 5 * 100, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Alt Cost: <span className="font-medium">{fmtAmt(r.altCost)}/tkm</span></div>
                <div>Savings: <span className={`font-medium ${savingsColor(r.savingsPct)}`}>{r.savingsPct >= 0 ? "+" : ""}{r.savingsPct}%</span></div>
                <div>Volume: <span className="font-medium">{r.volume.toLocaleString()} kg</span></div>
                <div>Distance: <span className="font-medium">{r.distance}km</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.carrier} | {r.origin} &gt; {r.dest}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "performance" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => a.otp - b.otp).map(r => (
            <div key={r.id} className="mmo-perf-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.route}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${modeColors[r.mode]}`}>{r.mode}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${otpColor(r.otp)}`}>{r.otp}%</span>
                  <span className="text-xs text-muted-foreground">OTP</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`mmo-otp-bar h-2 rounded-full ${r.otp >= 90 ? "" : "mmo-otp-low"}`} style={{ width: `${r.otp}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Load: <span className={`font-medium ${loadColor(r.loadFactor)}`}>{r.loadFactor}%</span></div>
                <div>CO2: <span className={`font-medium ${co2Color(r.co2PerTkm, r.altCO2)}`}>{r.co2PerTkm}g</span></div>
                <div>Transit: <span className="font-medium">{r.transitHrs}h</span></div>
                <div>Savings: <span className={`font-medium ${savingsColor(r.savingsPct)}`}>{r.savingsPct >= 0 ? "+" : ""}{r.savingsPct}%</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.carrier} | {r.volume.toLocaleString()} kg | {r.region}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { MultiModalOptimizationPanel }
