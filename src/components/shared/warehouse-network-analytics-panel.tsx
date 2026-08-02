"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  MapPin, Package, Warehouse, Activity
} from "lucide-react"

const raw = [
  { id: "WNA-01", dc: "Mumbai DC", code: "DC-W001", city: "Navi Mumbai", region: "West", sqft: 285000, utilization: 91, throughput: 8200, capacity: 9000, zones: 12, docks: 18, routes: 45, monthlyCost: 4200000, shipTo: "West+South", transit: 2.5, carrierCount: 12, inventory: 18500, orders: 6800, status: "Optimal", type: "Primary" },
  { id: "WNA-02", dc: "Delhi NCR Hub", code: "DC-N001", city: "Gurugram", region: "North", sqft: 320000, utilization: 88, throughput: 9500, capacity: 10800, zones: 15, docks: 22, routes: 52, monthlyCost: 5100000, shipTo: "North+East", transit: 2.0, carrierCount: 15, inventory: 22000, orders: 8200, status: "Optimal", type: "Primary" },
  { id: "WNA-03", dc: "Bengaluru DC", code: "DC-S001", city: "Devanahalli", region: "South", sqft: 195000, utilization: 94, throughput: 6200, capacity: 6600, zones: 10, docks: 14, routes: 38, monthlyCost: 3200000, shipTo: "South", transit: 3.0, carrierCount: 10, inventory: 14200, orders: 5100, status: "Strained", type: "Secondary" },
  { id: "WNA-04", dc: "Kolkata DC", code: "DC-E001", city: "Barasat", region: "East", sqft: 145000, utilization: 78, throughput: 3800, capacity: 4900, zones: 8, docks: 10, routes: 28, monthlyCost: 2100000, shipTo: "East+NE", transit: 3.5, carrierCount: 8, inventory: 8500, orders: 2900, status: "Underutilized", type: "Secondary" },
  { id: "WNA-05", dc: "Chennai DC", code: "DC-S002", city: "Sriperumbudur", region: "South", sqft: 210000, utilization: 86, throughput: 5800, capacity: 6700, zones: 11, docks: 16, routes: 35, monthlyCost: 3400000, shipTo: "South+East", transit: 2.8, carrierCount: 11, inventory: 15800, orders: 4800, status: "Optimal", type: "Secondary" },
  { id: "WNA-06", dc: "Hyderabad DC", code: "DC-S003", city: "Medchal", region: "South", sqft: 175000, utilization: 82, throughput: 5200, capacity: 6300, zones: 9, docks: 12, routes: 30, monthlyCost: 2800000, shipTo: "South+Central", transit: 2.5, carrierCount: 9, inventory: 12800, orders: 4200, status: "Optimal", type: "Secondary" },
  { id: "WNA-07", dc: "Ahmedabad DC", code: "DC-W002", city: "Sanand", region: "West", sqft: 165000, utilization: 96, throughput: 4800, capacity: 5000, zones: 8, docks: 10, routes: 25, monthlyCost: 2400000, shipTo: "West", transit: 1.8, carrierCount: 7, inventory: 11500, orders: 3800, status: "Overloaded", type: "Fulfillment" },
  { id: "WNA-08", dc: "Jaipur DC", code: "DC-N002", city: "Sitapura", region: "North", sqft: 120000, utilization: 72, throughput: 3200, capacity: 4400, zones: 7, docks: 8, routes: 20, monthlyCost: 1800000, shipTo: "North+West", transit: 3.2, carrierCount: 6, inventory: 7800, orders: 2400, status: "Underutilized", type: "Fulfillment" },
  { id: "WNA-09", dc: "Pune DC", code: "DC-W003", city: "Chakan", region: "West", sqft: 185000, utilization: 93, throughput: 5600, capacity: 6000, zones: 10, docks: 14, routes: 32, monthlyCost: 3100000, shipTo: "West+South", transit: 2.2, carrierCount: 10, inventory: 13500, orders: 4500, status: "Strained", type: "Primary" },
  { id: "WNA-10", dc: "Guwahati DC", code: "DC-NE001", city: "Amingaon", region: "North-East", sqft: 55000, utilization: 65, throughput: 1200, capacity: 1850, zones: 4, docks: 4, routes: 8, monthlyCost: 680000, shipTo: "NE", transit: 5.0, carrierCount: 4, inventory: 3200, orders: 850, status: "Underutilized", type: "Last Mile" },
]

interface WNAItem {
  id: string; dc: string; code: string; city: string; region: string; sqft: number
  utilization: number; throughput: number; capacity: number; zones: number; docks: number
  routes: number; monthlyCost: number; shipTo: string; transit: number; carrierCount: number
  inventory: number; orders: number; status: string; type: string
}

type Rec = any
const items: WNAItem[] = raw.map((r: Rec) => ({
  id: r.id, dc: r.dc, code: r.code, city: r.city, region: r.region, sqft: r.sqft,
  utilization: r.utilization, throughput: r.throughput, capacity: r.capacity, zones: r.zones, docks: r.docks,
  routes: r.routes, monthlyCost: r.monthlyCost, shipTo: r.shipTo, transit: r.transit, carrierCount: r.carrierCount,
  inventory: r.inventory, orders: r.orders, status: r.status, type: r.type,
}))

const typeColors: Record<string, string> = {
  "Primary": "bg-emerald-100 text-emerald-700", "Secondary": "bg-blue-100 text-blue-700",
  "Fulfillment": "bg-violet-100 text-violet-700", "Last Mile": "bg-amber-100 text-amber-700",
}

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "Strained": "text-amber-600 font-semibold",
  "Overloaded": "text-red-600 font-semibold", "Underutilized": "text-blue-600 font-semibold",
}

const utilPct = (v: number) => v >= 90 ? "text-red-600" : v >= 80 ? "text-emerald-600" : "text-amber-600"
const formatINR = (v: number) => v >= 10000000 ? `\u20b9${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `\u20b9${(v / 100000).toFixed(1)}L` : `\u20b9${(v / 1000).toFixed(0)}K`

const WarehouseNetworkAnalyticsPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"network" | "capacity" | "financials">("network")
  const filters = [
    { key: "type", label: "Type", options: ["Primary", "Secondary", "Fulfillment", "Last Mile"] },
    { key: "status", label: "Status", options: ["Optimal", "Strained", "Overloaded", "Underutilized"] },
    { key: "region", label: "Region", options: ["West", "North", "South", "East", "North-East"] },
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

  const totalDC = filtered.length
  const totalSqft = filtered.reduce((s, r) => s + r.sqft, 0)
  const avgUtil = totalDC ? Math.round(filtered.reduce((s, r) => s + r.utilization, 0) / totalDC * 10) / 10 : 0
  const totalOrders = filtered.reduce((s, r) => s + r.orders, 0)

  const insights = [
    { label: "DCs Active", value: totalDC, icon: Warehouse, bg: "bg-blue-50" },
    { label: "Total Sqft", value: `${(totalSqft / 1000).toFixed(0)}K`, icon: MapPin, bg: "bg-emerald-50" },
    { label: "Avg Utilization", value: `${avgUtil}%`, icon: Activity, bg: "bg-violet-50" },
    { label: "Monthly Orders", value: totalOrders.toLocaleString(), icon: Package, bg: "bg-amber-50" },
  ]

  const isCritical = (r: WNAItem) => r.status === "Overloaded"
  const isWarning = (r: WNAItem) => r.status === "Strained" || r.utilization >= 93

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
                className={`wna-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["network", "capacity", "financials"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "network" && (
        <div className="wna-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`wna-item-card p-3 rounded-lg border ${isCritical(r) ? "wna-critical" : isWarning(r) ? "wna-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.dc}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>City: <span className="font-medium">{r.city}</span></div>
                <div>Region: <span className="font-medium">{r.region}</span></div>
                <div>Size: <span className="font-medium">{(r.sqft / 1000).toFixed(0)}K sqft</span></div>
                <div>Utilization: <span className={`font-medium ${utilPct(r.utilization)}`}>{r.utilization}%</span></div>
                <div>Throughput: <span className="font-medium">{r.throughput.toLocaleString()}/{r.capacity.toLocaleString()}</span></div>
                <div>Transit: <span className="font-medium">{r.transit}d avg</span></div>
                <div>Routes: <span className="font-medium">{r.routes}</span></div>
                <div>Carriers: <span className="font-medium">{r.carrierCount}</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Zones: {r.zones} | Docks: {r.docks}</span>
                <span>Ship to: {r.shipTo}</span>
              </div>
              {isCritical(r) && <div className="wna-alert-text text-xs mt-2">Overloaded at {r.utilization}% — expansion or offload to nearby DC recommended</div>}
            </div>
          ))}
        </div>
      )}

      {view === "capacity" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.utilization - a.utilization).map(r => (
            <div key={r.id} className="wna-cap-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
                  <span className="font-semibold text-sm">{r.dc}</span>
                </div>
                <span className={`text-lg font-bold ${utilPct(r.utilization)}`}>{r.utilization}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="wna-util-bar h-2 rounded-full" style={{ width: `${r.utilization}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Throughput: <span className="font-medium">{r.throughput.toLocaleString()}</span></div>
                <div>Capacity: <span className="font-medium">{r.capacity.toLocaleString()}</span></div>
                <div>Inventory: <span className="font-medium">{r.inventory.toLocaleString()}</span></div>
                <div>Orders: <span className="font-medium">{r.orders.toLocaleString()}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                <span className="text-muted-foreground">{r.city}, {r.region}</span>
                <span className="text-muted-foreground">{r.zones} zones / {r.docks} docks</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "financials" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.monthlyCost - a.monthlyCost).map(r => (
            <div key={r.id} className="wna-fin-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.dc}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                </div>
                <span className="text-lg font-bold">{formatINR(r.monthlyCost)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="wna-cost-bar h-2 rounded-full" style={{ width: `${Math.min(r.utilization, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Sqft: <span className="font-medium">{(r.sqft / 1000).toFixed(0)}K</span></div>
                <div>Cost/sqft: <span className="font-medium">{formatINR(Math.round(r.monthlyCost / r.sqft * 100))}</span></div>
                <div>Routes: <span className="font-medium">{r.routes}</span></div>
                <div>Carriers: <span className="font-medium">{r.carrierCount}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.city}, {r.region}</span>
                <span className="text-muted-foreground">Transit: {r.transit}d</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { WarehouseNetworkAnalyticsPanel }
