"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Leaf, BarChart3, TrendingDown, Recycle
} from "lucide-react"

const raw = [
  { id: "SUS-01", facility: "Mumbai Mega DC", code: "DC-W001", city: "Navi Mumbai", region: "West", carbonFootprint: 245, target: 200, reduction: -8.5, energyKwh: 185000, solarKwh: 42000, solarPct: 22.7, wasteTonnes: 18.5, recycled: 14.8, recyclePct: 80, waterKl: 2850, rainwater: 420, waterSaved: 12.5, greenScore: 72, cert: "ISO 14001", status: "On Track", category: "Primary" },
  { id: "SUS-02", facility: "Delhi NCR Hub", code: "DC-N001", city: "Gurugram", region: "North", carbonFootprint: 312, target: 250, reduction: -4.2, energyKwh: 245000, solarKwh: 18000, solarPct: 7.3, wasteTonnes: 28.2, recycled: 16.9, recyclePct: 60, waterKl: 4200, rainwater: 180, waterSaved: 4.3, greenScore: 48, cert: "Pending", status: "At Risk", category: "Primary" },
  { id: "SUS-03", facility: "Bengaluru South DC", code: "DC-S001", city: "Devanahalli", region: "South", carbonFootprint: 185, target: 180, reduction: -12.1, energyKwh: 142000, solarKwh: 58000, solarPct: 40.8, wasteTonnes: 12.1, recycled: 11.5, recyclePct: 95, waterKl: 1800, rainwater: 680, waterSaved: 27.2, greenScore: 88, cert: "IGBC Platinum", status: "Excellent", category: "Secondary" },
  { id: "SUS-04", facility: "Kolkata DC", code: "DC-E001", city: "Barasat", region: "East", carbonFootprint: 165, target: 170, reduction: -15.3, energyKwh: 98000, solarKwh: 35000, solarPct: 35.7, wasteTonnes: 8.5, recycled: 7.2, recyclePct: 85, waterKl: 1200, rainwater: 350, waterSaved: 22.5, greenScore: 82, cert: "ISO 14001", status: "On Track", category: "Secondary" },
  { id: "SUS-05", facility: "Chennai Port DC", code: "DC-S002", city: "Sriperumbudur", region: "South", carbonFootprint: 198, target: 190, reduction: -6.8, energyKwh: 158000, solarKwh: 48000, solarPct: 30.4, wasteTonnes: 15.8, recycled: 12.6, recyclePct: 80, waterKl: 2100, rainwater: 520, waterSaved: 19.8, greenScore: 75, cert: "IGBC Gold", status: "On Track", category: "Secondary" },
  { id: "SUS-06", facility: "Hyderabad DC", code: "DC-S003", city: "Medchal", region: "South", carbonFootprint: 178, target: 185, reduction: -10.5, energyKwh: 128000, solarKwh: 52000, solarPct: 40.6, wasteTonnes: 10.2, recycled: 9.7, recyclePct: 95, waterKl: 1650, rainwater: 580, waterSaved: 26.1, greenScore: 85, cert: "IGBC Platinum", status: "Excellent", category: "Fulfillment" },
  { id: "SUS-07", facility: "Ahmedabad FC", code: "DC-W002", city: "Sanand", region: "West", carbonFootprint: 285, target: 220, reduction: -2.1, energyKwh: 168000, solarKwh: 12000, solarPct: 7.1, wasteTonnes: 22.4, recycled: 11.2, recyclePct: 50, waterKl: 3500, rainwater: 95, waterSaved: 2.7, greenScore: 35, cert: "None", status: "Critical", category: "Fulfillment" },
  { id: "SUS-08", facility: "Jaipur Mini DC", code: "DC-N002", city: "Sitapura", region: "North", carbonFootprint: 142, target: 150, reduction: -18.2, energyKwh: 82000, solarKwh: 38000, solarPct: 46.3, wasteTonnes: 6.8, recycled: 6.5, recyclePct: 96, waterKl: 980, rainwater: 440, waterSaved: 31.2, greenScore: 92, cert: "IGBC Platinum", status: "Excellent", category: "Fulfillment" },
  { id: "SUS-09", facility: "Pune DC", code: "DC-W003", city: "Chakan", region: "West", carbonFootprint: 225, target: 210, reduction: -5.5, energyKwh: 175000, solarKwh: 32000, solarPct: 18.3, wasteTonnes: 16.8, recycled: 13.4, recyclePct: 80, waterKl: 2600, rainwater: 380, waterSaved: 14.6, greenScore: 68, cert: "ISO 14001", status: "At Risk", category: "Primary" },
  { id: "SUS-10", facility: "Guwahati Last Mile", code: "DC-NE001", city: "Amingaon", region: "North-East", carbonFootprint: 68, target: 80, reduction: -22.4, energyKwh: 32000, solarKwh: 18000, solarPct: 56.3, wasteTonnes: 2.8, recycled: 2.7, recyclePct: 96, waterKl: 420, rainwater: 210, waterSaved: 33.3, greenScore: 95, cert: "IGBC Platinum", status: "Excellent", category: "Last Mile" },
]

interface SUSItem {
  id: string; facility: string; code: string; city: string; region: string
  carbonFootprint: number; target: number; reduction: number
  energyKwh: number; solarKwh: number; solarPct: number
  wasteTonnes: number; recycled: number; recyclePct: number
  waterKl: number; rainwater: number; waterSaved: number
  greenScore: number; cert: string; status: string; category: string
}

type Rec = any
const items: SUSItem[] = raw.map((r: Rec) => ({
  id: r.id, facility: r.facility, code: r.code, city: r.city, region: r.region,
  carbonFootprint: r.carbonFootprint, target: r.target, reduction: r.reduction,
  energyKwh: r.energyKwh, solarKwh: r.solarKwh, solarPct: r.solarPct,
  wasteTonnes: r.wasteTonnes, recycled: r.recycled, recyclePct: r.recyclePct,
  waterKl: r.waterKl, rainwater: r.rainwater, waterSaved: r.waterSaved,
  greenScore: r.greenScore, cert: r.cert, status: r.status, category: r.category,
}))

const catColors: Record<string, string> = {
  "Primary": "bg-emerald-100 text-emerald-700", "Secondary": "bg-blue-100 text-blue-700",
  "Fulfillment": "bg-violet-100 text-violet-700", "Last Mile": "bg-amber-100 text-amber-700",
}

const statusColors: Record<string, string> = {
  "Excellent": "text-emerald-600 font-semibold", "On Track": "text-blue-600 font-semibold",
  "At Risk": "text-amber-600 font-semibold", "Critical": "text-red-600 font-semibold",
}

const carbonColor = (v: number, t: number) => v > t * 1.2 ? "text-red-600" : v > t ? "text-amber-600" : "text-emerald-600"
const scoreColor = (v: number) => v >= 80 ? "text-emerald-600" : v >= 60 ? "text-amber-600" : "text-red-600"
const formatK = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`

const SustainabilityTrackingPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"overview" | "energy" | "waste">("overview")
  const filters = [
    { key: "category", label: "Category", options: ["Primary", "Secondary", "Fulfillment", "Last Mile"] },
    { key: "status", label: "Status", options: ["Excellent", "On Track", "At Risk", "Critical"] },
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

  const totalFac = filtered.length
  const avgGreen = totalFac ? Math.round(filtered.reduce((s, r) => s + r.greenScore, 0) / totalFac) : 0
  const totalCarbon = filtered.reduce((s, r) => s + r.carbonFootprint, 0)
  const avgRecycle = totalFac ? Math.round(filtered.reduce((s, r) => s + r.recyclePct, 0) / totalFac) : 0

  const insights = [
    { label: "Facilities", value: totalFac, icon: Leaf, bg: "bg-emerald-50" },
    { label: "Avg Green Score", value: avgGreen, icon: BarChart3, bg: "bg-blue-50" },
    { label: "Total CO2 (t)", value: totalCarbon, icon: TrendingDown, bg: "bg-amber-50" },
    { label: "Avg Recycling", value: `${avgRecycle}%`, icon: Recycle, bg: "bg-violet-50" },
  ]

  const isCritical = (r: SUSItem) => r.status === "Critical"
  const isWarning = (r: SUSItem) => r.status === "At Risk" || r.greenScore < 50

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
                className={`sus-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["overview", "energy", "waste"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "overview" && (
        <div className="sus-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`sus-item-card p-3 rounded-lg border ${isCritical(r) ? "sus-critical" : isWarning(r) ? "sus-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.facility}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Green: <span className={`font-bold ${scoreColor(r.greenScore)}`}>{r.greenScore}</span></span>
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>CO2: <span className={`font-medium ${carbonColor(r.carbonFootprint, r.target)}`}>{r.carbonFootprint}t</span> / Target: {r.target}t</div>
                <div>Reduction: <span className={`font-medium ${r.reduction <= -10 ? "text-emerald-600" : r.reduction <= -5 ? "text-amber-600" : "text-red-600"}`}>{r.reduction}%</span></div>
                <div>Solar: <span className={`font-medium ${r.solarPct >= 30 ? "text-emerald-600" : r.solarPct >= 15 ? "text-amber-600" : "text-red-600"}`}>{r.solarPct}%</span> ({formatK(r.solarKwh)} kWh)</div>
                <div>Energy: <span className="font-medium">{formatK(r.energyKwh)} kWh</span></div>
                <div>Recycling: <span className={`font-medium ${r.recyclePct >= 85 ? "text-emerald-600" : r.recyclePct >= 70 ? "text-amber-600" : "text-red-600"}`}>{r.recyclePct}%</span> ({r.recycled}/{r.wasteTonnes}t)</div>
                <div>Water Saved: <span className="font-medium">{r.waterSaved}%</span> ({r.rainwater} KL)</div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.city}, {r.region}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${r.cert === "IGBC Platinum" ? "bg-emerald-100 text-emerald-700" : r.cert === "IGBC Gold" ? "bg-amber-100 text-amber-700" : r.cert === "ISO 14001" ? "bg-blue-100 text-blue-700" : r.cert === "Pending" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"}`}>{r.cert}</span>
              </div>
              {isCritical(r) && <div className="sus-alert-text text-xs mt-2">Critical — CO2 {r.carbonFootprint}t exceeds target by {Math.round((r.carbonFootprint / r.target - 1) * 100)}%, green score {r.greenScore}</div>}
            </div>
          ))}
        </div>
      )}

      {view === "energy" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.energyKwh - a.energyKwh).map(r => (
            <div key={r.id} className="sus-energy-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
                  <span className="font-semibold text-sm">{r.facility}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{formatK(r.energyKwh)} kWh</span>
                  <span className={`text-sm font-medium ${r.solarPct >= 30 ? "text-emerald-600" : "text-amber-600"}`}>Solar: {r.solarPct}%</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="sus-solar-bar h-2 rounded-full" style={{ width: `${Math.min(r.solarPct, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Solar Gen: <span className="font-medium">{formatK(r.solarKwh)} kWh</span></div>
                <div>Grid: <span className="font-medium">{formatK(r.energyKwh - r.solarKwh)} kWh</span></div>
                <div>CO2: <span className={`font-medium ${carbonColor(r.carbonFootprint, r.target)}`}>{r.carbonFootprint}t</span></div>
                <div>Reduction: <span className="font-medium">{r.reduction}%</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">{r.city}, {r.region}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${r.cert === "IGBC Platinum" ? "bg-emerald-100 text-emerald-700" : r.cert === "IGBC Gold" ? "bg-amber-100 text-amber-700" : r.cert === "ISO 14001" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{r.cert}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "waste" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => a.recyclePct - b.recyclePct).map(r => (
            <div key={r.id} className="sus-waste-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.facility}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${r.recyclePct >= 85 ? "text-emerald-600" : r.recyclePct >= 70 ? "text-amber-600" : "text-red-600"}`}>{r.recyclePct}%</span>
                  <span className="text-sm text-muted-foreground">{r.recycled}/{r.wasteTonnes}t</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="sus-recycle-bar h-2 rounded-full" style={{ width: `${r.recyclePct}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Waste: <span className="font-medium">{r.wasteTonnes}t</span></div>
                <div>Recycled: <span className="font-medium">{r.recycled}t</span></div>
                <div>Water: <span className="font-medium">{formatK(r.waterKl)} KL</span></div>
                <div>Rainwater: <span className="font-medium">{r.rainwater} KL</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${catColors[r.category]}`}>{r.category}</span>
                <span className="text-muted-foreground">Green: {r.greenScore} | {r.city}, {r.region}</span>
                <span className="text-muted-foreground">Water saved: {r.waterSaved}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { SustainabilityTrackingPanel }
