"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Truck, Route, Clock, AlertTriangle, Package
} from "lucide-react"

const raw = [
  { id: "CPD-01", carrier: "Rivigo", mode: "FTL", region: "North", hub: "DEL-HUB2", shipments: 485, otp: 96.2, dmgRate: 0.8, claims: 2, costPerShip: 4200, avgTime: 18.5, planTime: 16, loadFactor: 92, revenue: 2037000, onboarded: "Jan 2024", rating: 4.6, fleet: 85, coverage: "Pan India", status: "Strategic" },
  { id: "CPD-02", carrier: "TCI Express", mode: "Express", region: "North", hub: "DEL-HUB2", shipments: 320, otp: 94.8, dmgRate: 1.2, claims: 4, costPerShip: 5800, avgTime: 22.3, planTime: 20, loadFactor: 88, revenue: 1856000, onboarded: "Mar 2023", rating: 4.4, fleet: 120, coverage: "Pan India", status: "Strategic" },
  { id: "CPD-03", carrier: "Delhivery", mode: "PTL", region: "West", hub: "MUM-HUB1", shipments: 620, otp: 89.5, dmgRate: 2.1, claims: 13, costPerShip: 2100, avgTime: 28.4, planTime: 24, loadFactor: 82, revenue: 1302000, onboarded: "Jun 2023", rating: 4.0, fleet: 250, coverage: "Metro + Tier 1", status: "Preferred" },
  { id: "CPD-04", carrier: "BlueDart", mode: "Air Express", region: "West", hub: "MUM-HUB1", shipments: 185, otp: 98.5, dmgRate: 0.3, claims: 1, costPerShip: 12500, avgTime: 8.2, planTime: 8, loadFactor: 95, revenue: 2312500, onboarded: "Jan 2022", rating: 4.8, fleet: 42, coverage: "Pan India", status: "Strategic" },
  { id: "CPD-05", carrier: "XpressBees", mode: "Express", region: "South", hub: "BLR-HUB3", shipments: 410, otp: 85.2, dmgRate: 2.8, claims: 11, costPerShip: 2800, avgTime: 32.1, planTime: 26, loadFactor: 78, revenue: 1148000, onboarded: "Sep 2023", rating: 3.8, fleet: 180, coverage: "South + West", status: "Under Review" },
  { id: "CPD-06", carrier: "Shadowfax", mode: "PTL", region: "South", hub: "BLR-HUB3", shipments: 290, otp: 91.4, dmgRate: 1.5, claims: 4, costPerShip: 3200, avgTime: 25.8, planTime: 22, loadFactor: 85, revenue: 928000, onboarded: "Nov 2023", rating: 4.2, fleet: 95, coverage: "South + East", status: "Preferred" },
  { id: "CPD-07", carrier: "Ecom Express", mode: "Last Mile", region: "East", hub: "CCU-HUB7", shipments: 520, otp: 78.5, dmgRate: 3.8, claims: 20, costPerShip: 1450, avgTime: 42.6, planTime: 36, loadFactor: 72, revenue: 754000, onboarded: "Feb 2024", rating: 3.2, fleet: 320, coverage: "Tier 2 + Rural", status: "Probationary" },
  { id: "CPD-08", carrier: "Adani Logistics", mode: "Rail", region: "West", hub: "MUM-HUB1", shipments: 95, otp: 99.1, dmgRate: 0.2, claims: 0, costPerShip: 8200, avgTime: 48.2, planTime: 48, loadFactor: 96, revenue: 779000, onboarded: "Aug 2023", rating: 4.7, fleet: 28, coverage: "Rail Corridors", status: "Strategic" },
  { id: "CPD-09", carrier: "Snowman Logistics", mode: "Cold Chain", region: "South", hub: "MAA-HUB4", shipments: 140, otp: 92.8, dmgRate: 1.0, claims: 1, costPerShip: 9500, avgTime: 20.5, planTime: 18, loadFactor: 88, revenue: 1330000, onboarded: "Apr 2023", rating: 4.3, fleet: 35, coverage: "South + West", status: "Preferred" },
  { id: "CPD-10", carrier: "Shreyas Shipping", mode: "Coastal", region: "West", hub: "MUM-HUB1", shipments: 45, otp: 94.2, dmgRate: 0.6, claims: 0, costPerShip: 15000, avgTime: 72.4, planTime: 72, loadFactor: 90, revenue: 675000, onboarded: "Jul 2024", rating: 4.1, fleet: 8, coverage: "Port Cities", status: "Preferred" },
]

interface CPDItem {
  id: string; carrier: string; mode: string; region: string; hub: string
  shipments: number; otp: number; dmgRate: number; claims: number
  costPerShip: number; avgTime: number; planTime: number; loadFactor: number
  revenue: number; onboarded: string; rating: number; fleet: number
  coverage: string; status: string
}

type Rec = any
const items: CPDItem[] = raw.map((r: Rec) => ({
  id: r.id, carrier: r.carrier, mode: r.mode, region: r.region, hub: r.hub,
  shipments: r.shipments, otp: r.otp, dmgRate: r.dmgRate, claims: r.claims,
  costPerShip: r.costPerShip, avgTime: r.avgTime, planTime: r.planTime, loadFactor: r.loadFactor,
  revenue: r.revenue, onboarded: r.onboarded, rating: r.rating, fleet: r.fleet,
  coverage: r.coverage, status: r.status,
}))

const modeColors: Record<string, string> = {
  "FTL": "bg-emerald-100 text-emerald-700", "Express": "bg-blue-100 text-blue-700",
  "PTL": "bg-violet-100 text-violet-700", "Air Express": "bg-amber-100 text-amber-700",
  "Last Mile": "bg-sky-100 text-sky-700", "Rail": "bg-orange-100 text-orange-700",
  "Cold Chain": "bg-cyan-100 text-cyan-700", "Coastal": "bg-teal-100 text-teal-700",
}

const statusColors: Record<string, string> = {
  "Strategic": "bg-emerald-100 text-emerald-700", "Preferred": "bg-blue-100 text-blue-700",
  "Under Review": "bg-amber-100 text-amber-700", "Probationary": "bg-red-100 text-red-700",
}

const otpColor = (v: number) => v >= 95 ? "text-emerald-600" : v >= 85 ? "text-amber-600" : "text-red-600"
const dmgColor = (v: number) => v <= 1 ? "text-emerald-600" : v <= 2 ? "text-amber-600" : "text-red-600"
const formatINR = (v: number) => v >= 10000000 ? `\u20b9${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `\u20b9${(v / 100000).toFixed(1)}L` : `\u20b9${(v / 1000).toFixed(0)}K`

const CarrierPerformanceDeepDivePanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"carriers" | "performance" | "financials">("carriers")
  const filters = [
    { key: "mode", label: "Mode", options: ["FTL", "Express", "PTL", "Air Express", "Last Mile", "Rail", "Cold Chain", "Coastal"] },
    { key: "status", label: "Status", options: ["Strategic", "Preferred", "Under Review", "Probationary"] },
    { key: "region", label: "Region", options: ["North", "West", "South", "East"] },
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

  const totalCarriers = filtered.length
  const avgOTP = totalCarriers ? Math.round(filtered.reduce((s, r) => s + r.otp, 0) / totalCarriers * 10) / 10 : 0
  const totalShipments = filtered.reduce((s, r) => s + r.shipments, 0)
  const totalClaims = filtered.reduce((s, r) => s + r.claims, 0)

  const insights = [
    { label: "Active Carriers", value: totalCarriers, icon: Truck, bg: "bg-blue-50" },
    { label: "Avg OTP", value: `${avgOTP}%`, icon: Route, bg: "bg-emerald-50" },
    { label: "Total Shipments", value: totalShipments.toLocaleString(), icon: Package, bg: "bg-violet-50" },
    { label: "Open Claims", value: totalClaims, icon: AlertTriangle, bg: "bg-amber-50" },
  ]

  const isCritical = (r: CPDItem) => r.status === "Probationary"
  const isWarning = (r: CPDItem) => r.status === "Under Review" || r.otp < 85

  const starDisplay = (rating: number) => (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`text-xs ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-300"}`}>&#9733;</span>
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </span>
  )

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
                className={`cpd-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["carriers", "performance", "financials"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "carriers" && (
        <div className="cpd-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`cpd-item-card p-3 rounded-lg border ${isCritical(r) ? "cpd-critical" : isWarning(r) ? "cpd-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.carrier}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${modeColors[r.mode]}`}>{r.mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  {starDisplay(r.rating)}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>OTP: <span className={`font-medium ${otpColor(r.otp)}`}>{r.otp}%</span></div>
                <div>Shipments: <span className="font-medium">{r.shipments}</span></div>
                <div>Dmg Rate: <span className={`font-medium ${dmgColor(r.dmgRate)}`}>{r.dmgRate}%</span></div>
                <div>Claims: <span className={`font-medium ${r.claims > 5 ? "text-red-600" : r.claims > 0 ? "text-amber-600" : "text-emerald-600"}`}>{r.claims}</span></div>
                <div>Cost/Ship: <span className="font-medium">{formatINR(r.costPerShip)}</span></div>
                <div>Transit: <span className="font-medium">{r.avgTime}h / {r.planTime}h plan</span></div>
                <div>Load Factor: <span className={`font-medium ${r.loadFactor >= 90 ? "text-emerald-600" : r.loadFactor >= 80 ? "text-amber-600" : "text-red-600"}`}>{r.loadFactor}%</span></div>
                <div>Fleet: <span className="font-medium">{r.fleet} vehicles</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.hub}, {r.region} | Coverage: {r.coverage}</span>
                <span>Onboarded: {r.onboarded}</span>
              </div>
              {isCritical(r) && <div className="cpd-alert-text text-xs mt-2">Probationary — OTP {r.otp}%, {r.claims} claims, dmg rate {r.dmgRate}%</div>}
            </div>
          ))}
        </div>
      )}

      {view === "performance" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => a.otp - b.otp).map(r => (
            <div key={r.id} className="cpd-perf-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.carrier}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${modeColors[r.mode]}`}>{r.mode}</span>
                </div>
                <span className={`text-lg font-bold ${otpColor(r.otp)}`}>{r.otp}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="cpd-otp-bar h-2 rounded-full" style={{ width: `${r.otp}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Dmg: <span className={`font-medium ${dmgColor(r.dmgRate)}`}>{r.dmgRate}%</span></div>
                <div>Claims: <span className="font-medium">{r.claims}</span></div>
                <div>Load: <span className="font-medium">{r.loadFactor}%</span></div>
                <div>Delay: <span className={`font-medium ${r.avgTime - r.planTime <= 2 ? "text-emerald-600" : "text-red-600"}`}>{r.avgTime - r.planTime > 0 ? `+${(r.avgTime - r.planTime).toFixed(1)}h` : "On time"}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.shipments} shipments | Fleet: {r.fleet}</span>
                <span className="text-muted-foreground">{r.hub}, {r.region}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "financials" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.revenue - a.revenue).map(r => (
            <div key={r.id} className="cpd-fin-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.carrier}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${modeColors[r.mode]}`}>{r.mode}</span>
                </div>
                <span className="text-lg font-bold">{formatINR(r.revenue)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="cpd-rev-bar h-2 rounded-full" style={{ width: `${Math.min(r.loadFactor, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Cost/Ship: <span className="font-medium">{formatINR(r.costPerShip)}</span></div>
                <div>Shipments: <span className="font-medium">{r.shipments}</span></div>
                <div>Fleet: <span className="font-medium">{r.fleet}</span></div>
                <div>Rating: <span className="font-medium">{r.rating}/5</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${otpColor(r.otp)}`}>OTP: {r.otp}%</span>
                <span className="text-muted-foreground">{r.coverage}</span>
                <span className="text-muted-foreground">Since {r.onboarded}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { CarrierPerformanceDeepDivePanel }
