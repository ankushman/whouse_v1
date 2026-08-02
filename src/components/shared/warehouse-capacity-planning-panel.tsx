"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Warehouse, TrendingUp, AlertTriangle, BarChart3
} from "lucide-react"

const raw = [
  { id: "WCP-01", warehouse: "Mumbai Mega DC", code: "WH-M001", city: "Navi Mumbai", region: "West", currentUtil: 91, peakUtil: 97, projected: 94, expansion: "Approved", budget: 18500000, timeline: "Q1 2027", sqft: 285000, newSqft: 85000, zones: 12, docks: 18, staff: 245, peakFactor: 1.35, scenario: "Diwali Surge", inventory: 18500, maxCapacity: 22000, status: "Critical", category: "Primary" },
  { id: "WCP-02", warehouse: "Delhi NCR Hub", code: "WH-N001", city: "Gurugram", region: "North", currentUtil: 88, peakUtil: 95, projected: 90, expansion: "Planned", budget: 22000000, timeline: "Q2 2027", sqft: 320000, newSqft: 120000, zones: 15, docks: 22, staff: 310, peakFactor: 1.28, scenario: "Festive Season", inventory: 22000, maxCapacity: 26000, status: "On Track", category: "Primary" },
  { id: "WCP-03", warehouse: "Bengaluru South DC", code: "WH-S001", city: "Devanahalli", region: "South", currentUtil: 94, peakUtil: 99, projected: 96, expansion: "In Progress", budget: 12000000, timeline: "Q4 2026", sqft: 195000, newSqft: 55000, zones: 10, docks: 14, staff: 185, peakFactor: 1.42, scenario: "Big Billion Days", inventory: 14200, maxCapacity: 16000, status: "Critical", category: "Secondary" },
  { id: "WCP-04", warehouse: "Kolkata DC", code: "WH-E001", city: "Barasat", region: "East", currentUtil: 72, peakUtil: 85, projected: 75, expansion: "None", budget: 0, timeline: "-", sqft: 145000, newSqft: 0, zones: 8, docks: 10, staff: 120, peakFactor: 1.18, scenario: "Pohela Boishakh", inventory: 8500, maxCapacity: 12000, status: "Healthy", category: "Secondary" },
  { id: "WCP-05", warehouse: "Chennai Port DC", code: "WH-S002", city: "Sriperumbudur", region: "South", currentUtil: 86, peakUtil: 93, projected: 88, expansion: "Planned", budget: 8500000, timeline: "Q3 2027", sqft: 210000, newSqft: 45000, zones: 11, docks: 16, staff: 210, peakFactor: 1.25, scenario: "Pongal Rush", inventory: 15800, maxCapacity: 18500, status: "On Track", category: "Secondary" },
  { id: "WCP-06", warehouse: "Hyderabad Medchal DC", code: "WH-S003", city: "Medchal", region: "South", currentUtil: 82, peakUtil: 90, projected: 84, expansion: "None", budget: 0, timeline: "-", sqft: 175000, newSqft: 0, zones: 9, docks: 12, staff: 165, peakFactor: 1.20, scenario: "Sankranti", inventory: 12800, maxCapacity: 15800, status: "Healthy", category: "Fulfillment" },
  { id: "WCP-07", warehouse: "Ahmedabad FC", code: "WH-W002", city: "Sanand", region: "West", currentUtil: 96, peakUtil: 100, projected: 98, expansion: "Urgent", budget: 15000000, timeline: "Q1 2027", sqft: 165000, newSqft: 70000, zones: 8, docks: 10, staff: 145, peakFactor: 1.50, scenario: "Uttarayan + Navratri", inventory: 11500, maxCapacity: 12000, status: "Critical", category: "Fulfillment" },
  { id: "WCP-08", warehouse: "Jaipur Mini DC", code: "WH-N002", city: "Sitapura", region: "North", currentUtil: 68, peakUtil: 78, projected: 70, expansion: "None", budget: 0, timeline: "-", sqft: 120000, newSqft: 0, zones: 7, docks: 8, staff: 95, peakFactor: 1.15, scenario: "Teej Festival", inventory: 7800, maxCapacity: 11500, status: "Healthy", category: "Fulfillment" },
  { id: "WCP-09", warehouse: "Pune Chakan DC", code: "WH-W003", city: "Chakan", region: "West", currentUtil: 93, peakUtil: 98, projected: 95, expansion: "Approved", budget: 11000000, timeline: "Q2 2027", sqft: 185000, newSqft: 60000, zones: 10, docks: 14, staff: 195, peakFactor: 1.32, scenario: "Ganesh Chaturthi", inventory: 13500, maxCapacity: 15000, status: "Warning", category: "Primary" },
  { id: "WCP-10", warehouse: "Guwahati Last Mile", code: "WH-NE001", city: "Amingaon", region: "North-East", currentUtil: 55, peakUtil: 72, projected: 58, expansion: "None", budget: 0, timeline: "-", sqft: 55000, newSqft: 0, zones: 4, docks: 4, staff: 48, peakFactor: 1.30, scenario: "Bihu Festival", inventory: 3200, maxCapacity: 5800, status: "Healthy", category: "Last Mile" },
]

interface WCPItem {
  id: string; warehouse: string; code: string; city: string; region: string
  currentUtil: number; peakUtil: number; projected: number; expansion: string
  budget: number; timeline: string; sqft: number; newSqft: number
  zones: number; docks: number; staff: number; peakFactor: number
  scenario: string; inventory: number; maxCapacity: number; status: string; category: string
}

type Rec = any
const items: WCPItem[] = raw.map((r: Rec) => ({
  id: r.id, warehouse: r.warehouse, code: r.code, city: r.city, region: r.region,
  currentUtil: r.currentUtil, peakUtil: r.peakUtil, projected: r.projected, expansion: r.expansion,
  budget: r.budget, timeline: r.timeline, sqft: r.sqft, newSqft: r.newSqft,
  zones: r.zones, docks: r.docks, staff: r.staff, peakFactor: r.peakFactor,
  scenario: r.scenario, inventory: r.inventory, maxCapacity: r.maxCapacity, status: r.status, category: r.category,
}))

const catColors: Record<string, string> = {
  "Primary": "bg-emerald-100 text-emerald-700", "Secondary": "bg-blue-100 text-blue-700",
  "Fulfillment": "bg-violet-100 text-violet-700", "Last Mile": "bg-amber-100 text-amber-700",
}

const statusColors: Record<string, string> = {
  "Critical": "text-red-600 font-semibold", "Warning": "text-amber-600 font-semibold",
  "On Track": "text-blue-600 font-semibold", "Healthy": "text-emerald-600 font-semibold",
}

const expansionColors: Record<string, string> = {
  "Urgent": "bg-red-100 text-red-700", "Approved": "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700", "Planned": "bg-amber-100 text-amber-700",
  "None": "bg-gray-100 text-gray-500",
}

const utilColor = (v: number) => v >= 95 ? "text-red-600" : v >= 85 ? "text-amber-600" : "text-emerald-600"
const formatINR = (v: number) => v >= 10000000 ? `\u20b9${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `\u20b9${(v / 100000).toFixed(1)}L` : v >= 1000 ? `\u20b9${(v / 1000).toFixed(0)}K` : `\u20b90`

const WarehouseCapacityPlanningPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"capacity" | "expansion" | "resources">("capacity")
  const filters = [
    { key: "category", label: "Category", options: ["Primary", "Secondary", "Fulfillment", "Last Mile"] },
    { key: "status", label: "Status", options: ["Critical", "Warning", "On Track", "Healthy"] },
    { key: "expansion", label: "Expansion", options: ["Urgent", "Approved", "In Progress", "Planned", "None"] },
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

  const totalWH = filtered.length
  const avgUtil = totalWH ? Math.round(filtered.reduce((s, r) => s + r.currentUtil, 0) / totalWH) : 0
  const criticalCount = filtered.filter(r => r.status === "Critical").length
  const totalBudget = filtered.reduce((s, r) => s + r.budget, 0)

  const insights = [
    { label: "Warehouses", value: totalWH, icon: Warehouse, bg: "bg-blue-50" },
    { label: "Avg Utilization", value: `${avgUtil}%`, icon: BarChart3, bg: "bg-emerald-50" },
    { label: "Critical Sites", value: criticalCount, icon: AlertTriangle, bg: "bg-red-50" },
    { label: "Expansion Budget", value: formatINR(totalBudget), icon: TrendingUp, bg: "bg-violet-50" },
  ]

  const isCritical = (r: WCPItem) => r.status === "Critical"
  const isWarning = (r: WCPItem) => r.status === "Warning" || r.currentUtil >= 93

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
                className={`wcp-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["capacity", "expansion", "resources"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "capacity" && (
        <div className="wcp-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`wcp-item-card p-3 rounded-lg border ${isCritical(r) ? "wcp-critical" : isWarning(r) ? "wcp-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.warehouse}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${expansionColors[r.expansion]}`}>{r.expansion}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Current: <span className={`font-medium ${utilColor(r.currentUtil)}`}>{r.currentUtil}%</span></div>
                <div>Peak: <span className={`font-medium ${r.peakUtil >= 98 ? "text-red-600" : r.peakUtil >= 90 ? "text-amber-600" : "text-emerald-600"}`}>{r.peakUtil}%</span></div>
                <div>Projected: <span className={`font-medium ${utilColor(r.projected)}`}>{r.projected}%</span></div>
                <div>Peak Factor: <span className="font-medium">{r.peakFactor}x</span></div>
                <div>Inventory: <span className="font-medium">{r.inventory.toLocaleString()}/{r.maxCapacity.toLocaleString()}</span></div>
                <div>Scenario: <span className="font-medium">{r.scenario}</span></div>
                <div>Size: <span className="font-medium">{(r.sqft / 1000).toFixed(0)}K sqft</span></div>
                <div>City: <span className="font-medium">{r.city}, {r.region}</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Zones: {r.zones} | Docks: {r.docks}</span>
                {r.newSqft > 0 && <span>Adding: +{(r.newSqft / 1000).toFixed(0)}K sqft ({r.timeline})</span>}
              </div>
              {isCritical(r) && <div className="wcp-alert-text text-xs mt-2">Critical capacity — peak at {r.peakUtil}%, needs immediate {r.newSqft > 0 ? `${(r.newSqft / 1000).toFixed(0)}K sqft expansion` : "capacity review"}</div>}
            </div>
          ))}
        </div>
      )}

      {view === "expansion" && (
        <div className="space-y-2">
          {[...filtered].filter(r => r.budget > 0).sort((a, b) => b.budget - a.budget).map(r => (
            <div key={r.id} className="wcp-exp-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
                  <span className="font-semibold text-sm">{r.warehouse}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${expansionColors[r.expansion]}`}>{r.expansion}</span>
                </div>
                <span className="text-lg font-bold">{formatINR(r.budget)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="wcp-util-bar h-2 rounded-full" style={{ width: `${r.currentUtil}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Current: <span className={`font-medium ${utilColor(r.currentUtil)}`}>{r.currentUtil}%</span></div>
                <div>Peak: <span className="font-medium">{r.peakUtil}%</span></div>
                <div>Adding: <span className="font-medium">+{(r.newSqft / 1000).toFixed(0)}K sqft</span></div>
                <div>Timeline: <span className="font-medium">{r.timeline}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                <span className="text-muted-foreground">{r.city}, {r.region}</span>
                <span className="text-muted-foreground">Peak: {r.scenario} ({r.peakFactor}x)</span>
              </div>
            </div>
          ))}
          {[...filtered].filter(r => r.budget === 0).length > 0 && (
            <div className="text-xs text-muted-foreground p-2 border border-dashed rounded-lg mt-2">
              No expansion planned: {[...filtered].filter(r => r.budget === 0).map(r => r.warehouse).join(", ")}
            </div>
          )}
        </div>
      )}

      {view === "resources" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.currentUtil - a.currentUtil).map(r => (
            <div key={r.id} className="wcp-res-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.warehouse}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Staff: <span className="font-bold">{r.staff}</span></span>
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="wcp-res-bar h-2 rounded-full" style={{ width: `${r.currentUtil}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Zones: <span className="font-medium">{r.zones}</span></div>
                <div>Docks: <span className="font-medium">{r.docks}</span></div>
                <div>Size: <span className="font-medium">{(r.sqft / 1000).toFixed(0)}K sqft</span></div>
                <div>Inventory: <span className="font-medium">{r.inventory.toLocaleString()}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                <span className="text-muted-foreground">{r.city}, {r.region}</span>
                <span className="text-muted-foreground">Peak: {r.scenario} | Factor: {r.peakFactor}x</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { WarehouseCapacityPlanningPanel }
