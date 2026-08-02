"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Route, Gauge, AlertTriangle, TrendingUp, Clock, Navigation
} from "lucide-react"

const raw = [
  { id: "TRA-01", corridor: "Mumbai-Delhi NH8", mode: "FTL Road", carrier: "Rivigo", dist: 1420, time: 26, timePlan: 24, load: 92, tonnage: 18.5, costPerKm: 12.4, fuel: 385, toll: 4200, halts: 2, accidents: 0, otp: 94.2, region: "West-North", cargo: "FMCG", status: "On Track", congestion: "Low", season: "Monsoon" },
  { id: "TRA-02", corridor: "Delhi-Kolkata NH19", mode: "FTL Road", carrier: "TCI Express", dist: 1490, time: 38, timePlan: 28, load: 78, tonnage: 15.2, costPerKm: 14.8, fuel: 420, toll: 5800, halts: 4, accidents: 0, otp: 72.5, region: "North-East", cargo: "Electronics", status: "Delayed", congestion: "High", season: "Monsoon" },
  { id: "TRA-03", corridor: "Chennai-Bengaluru NH44", mode: "PTL Road", carrier: "XpressBees", dist: 350, time: 6, timePlan: 6, load: 85, tonnage: 8.4, costPerKm: 9.2, fuel: 95, toll: 1200, halts: 1, accidents: 0, otp: 98.1, region: "South", cargo: "E-commerce", status: "On Track", congestion: "Low", season: "Monsoon" },
  { id: "TRA-04", corridor: "Nhava Sheva-Mundra Port", mode: "Rail Freight", carrier: "Indian Railways", dist: 920, time: 18, timePlan: 16, load: 95, tonnage: 2800, costPerKm: 4.1, fuel: 4200, toll: 0, halts: 1, accidents: 0, otp: 88.4, region: "West", cargo: "Container", status: "At Risk", congestion: "Medium", season: "Monsoon" },
  { id: "TRA-05", corridor: "IGI Airport-Chennai Airport", mode: "Air Express", carrier: "BlueDart", dist: 2090, time: 3, timePlan: 3, load: 72, tonnage: 2.4, costPerKm: 85.0, fuel: 8200, toll: 0, halts: 0, accidents: 0, otp: 96.8, region: "North-South", cargo: "Pharma", status: "On Track", congestion: "Low", season: "Monsoon" },
  { id: "TRA-06", corridor: "Kolkata-Guwahati NH27", mode: "Express Road", carrier: "Shadowfax", dist: 1080, time: 32, timePlan: 18, load: 65, tonnage: 5.6, costPerKm: 16.5, fuel: 340, toll: 2800, halts: 5, accidents: 1, otp: 58.2, region: "East", cargo: "FMCG", status: "Critical", congestion: "Severe", season: "Monsoon" },
  { id: "TRA-07", corridor: "Mundra-Kandla ICD", mode: "Rail Freight", carrier: "Adani Logistics", dist: 180, time: 3, timePlan: 3, load: 88, tonnage: 1800, costPerKm: 3.2, fuel: 1800, toll: 0, halts: 0, accidents: 0, otp: 99.5, region: "West", cargo: "Container", status: "On Track", congestion: "Low", season: "Monsoon" },
  { id: "TRA-08", corridor: "Pune-Hyderabad NH65", mode: "FTL Road", carrier: "Delhivery", dist: 560, time: 12, timePlan: 10, load: 80, tonnage: 12.0, costPerKm: 11.8, fuel: 220, toll: 2100, halts: 2, accidents: 0, otp: 82.6, region: "West-South", cargo: "Auto Parts", status: "Delayed", congestion: "Medium", season: "Monsoon" },
  { id: "TRA-09", corridor: "Cochin-Mumbai Sea", mode: "Coastal", carrier: "Shreyas Shipping", dist: 1360, time: 42, timePlan: 36, load: 68, tonnage: 850, costPerKm: 2.8, fuel: 5200, toll: 0, halts: 2, accidents: 0,otp: 78.4, region: "South-West", cargo: "Spices", status: "At Risk", congestion: "Medium", season: "Monsoon" },
  { id: "TRA-10", corridor: "Bengaluru-Pune NH48", mode: "FTL Road", carrier: "Ecom Express", dist: 840, time: 14, timePlan: 14, load: 90, tonnage: 16.0, costPerKm: 10.5, fuel: 260, toll: 3200, halts: 1, accidents: 0, otp: 95.4, region: "South-West", cargo: "Fashion", status: "On Track", congestion: "Low", season: "Monsoon" },
]

interface TRAItem {
  id: string; corridor: string; mode: string; carrier: string; dist: number
  time: number; timePlan: number; load: number; tonnage: number; costPerKm: number
  fuel: number; toll: number; halts: number; accidents: number; otp: number
  region: string; cargo: string; status: string; congestion: string; season: string
}

type Rec = any
const items: TRAItem[] = raw.map((r: Rec) => ({
  id: r.id, corridor: r.corridor, mode: r.mode, carrier: r.carrier, dist: r.dist,
  time: r.time, timePlan: r.timePlan, load: r.load, tonnage: r.tonnage, costPerKm: r.costPerKm,
  fuel: r.fuel, toll: r.toll, halts: r.halts, accidents: r.accidents, otp: r.otp,
  region: r.region, cargo: r.cargo, status: r.status, congestion: r.congestion, season: r.season,
}))

const modeColors: Record<string, string> = {
  "FTL Road": "bg-emerald-100 text-emerald-700", "PTL Road": "bg-teal-100 text-teal-700",
  "Rail Freight": "bg-orange-100 text-orange-700", "Air Express": "bg-purple-100 text-purple-700",
  "Express Road": "bg-lime-100 text-lime-700", "Coastal": "bg-sky-100 text-sky-700",
}

const statusColors: Record<string, string> = {
  "On Track": "text-emerald-600 font-semibold", "Delayed": "text-orange-600 font-semibold",
  "At Risk": "text-amber-600 font-semibold", "Critical": "text-red-600 font-semibold",
}

const congestionColors: Record<string, string> = {
  "Low": "bg-emerald-100 text-emerald-700", "Medium": "bg-amber-100 text-amber-700",
  "High": "bg-orange-100 text-orange-700", "Severe": "bg-red-100 text-red-700",
}

const fmtINR = (v: number) => v >= 10000000 ? `\u20b9${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `\u20b9${(v / 100000).toFixed(1)}L` : `\u20b9${(v / 1000).toFixed(0)}K`

const TransportAnalyticsPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"corridors" | "cost" | "performance">("corridors")
  const filters = [
    { key: "mode", label: "Mode", options: ["FTL Road", "PTL Road", "Rail Freight", "Air Express", "Express Road", "Coastal"] },
    { key: "status", label: "Status", options: ["On Track", "Delayed", "At Risk", "Critical"] },
    { key: "region", label: "Region", options: ["West-North", "North-East", "South", "West", "North-South", "East", "West-South", "South-West"] },
  ]

  const toggleFilter = (k: string, v: string) => setActiveFilters((p: Record<string, string>) => {
    const n = Object.assign({}, p)
    if (n[k] === v) { delete n[k] } else { n[k] = v }
    return n
  })

  const filtered = items.filter((r: Rec) => Object.entries(activeFilters).every(([k, v]) => r[k as keyof Rec] === v))

  const stats = [
    { label: "Avg OTP", value: Math.round(items.reduce((a, b) => a + b.otp, 0) / items.length) + "%", icon: Navigation, color: "bg-blue-50 text-blue-600" },
    { label: "Total Distance", value: (items.reduce((a, b) => a + b.dist, 0) / 1000).toFixed(1) + "K km", icon: Route, color: "bg-emerald-50 text-emerald-600" },
    { label: "Accidents", value: items.reduce((a, b) => a + b.accidents, 0).toString(), icon: AlertTriangle, color: "bg-red-50 text-red-600" },
    { label: "Avg Load Factor", value: Math.round(items.reduce((a, b) => a + b.load, 0) / items.length) + "%", icon: Gauge, color: "bg-violet-50 text-violet-600" },
  ]

  const insights = [
    { icon: AlertTriangle, title: "NH27 Severe Congestion", desc: "TRA-06 Kolkata-Guwahati corridor: 32h vs 18h plan, 78% delay, 1 accident near Siliguri. OTP 58.2%. Shadowfax rerouting via NH31.", color: "text-red-500" },
    { icon: TrendingUp, title: "Rail Cost Efficiency", desc: "TRA-04 and TRA-07 rail corridors at \u20b93.2-4.1/km vs road average \u20b912.4/km. 66% cheaper for container cargo. OTP 88-99%.", color: "text-emerald-500" },
    { icon: Clock, title: "Air Premium Trade-off", desc: "TRA-05 IGI-Chennai air at \u20b985/km delivers 96.8% OTP for pharma. Cost 8x road but time 9x faster. Critical for cold chain.", color: "text-blue-500" },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {stats.map((sc) => { const SIcon = sc.icon as React.ElementType; return (
          <div key={sc.label} className={`tra-stat-card rounded-lg border p-3 ${sc.color.split(" ")[0]}`}>
            <div className="flex items-center gap-2 mb-1">
              <SIcon className="h-4 w-4" />
              <span className="text-xs font-medium opacity-70">{sc.label}</span>
            </div>
            <p className={`text-lg font-bold ${sc.color.split(" ")[1]}`}>{sc.value}</p>
          </div>
        )})}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map(f => f.options.map(opt => {
          const active = activeFilters[f.key] === opt
          return <button key={`${f.key}-${opt}`} onClick={() => toggleFilter(f.key, opt)}
            className={`tra-filter-pill px-2 py-0.5 rounded-full text-xs border ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-muted-foreground/20"}`}>{opt}</button>
        }))}
        {Object.keys(activeFilters).length > 0 && <button onClick={() => setActiveFilters({})}
          className="px-2 py-0.5 rounded-full text-xs border border-red-200 text-red-500 hover:bg-red-50">Clear</button>}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {insights.map(ins => { const IIcon = ins.icon as React.ElementType; return (
          <div key={ins.title} className="rounded-lg border p-2.5 flex items-start gap-2">
            <IIcon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${ins.color}`} />
            <div><p className="text-xs font-semibold">{ins.title}</p><p className="text-[11px] text-muted-foreground mt-0.5">{ins.desc}</p></div>
          </div>
        )})}
      </div>

      <div className="flex gap-1.5">
        {(["corridors", "cost", "performance"] as const).map(v => (
          <Button key={v} size="sm" variant={view === v ? "default" : "outline"} onClick={() => setView(v)}
            className="text-xs h-7 capitalize">{v}</Button>
        ))}
      </div>

      {view === "corridors" && filtered.map(item => {
        const delayPct = Math.round(((item.time - item.timePlan) / item.timePlan) * 100)
        const isCritical = item.status === "Critical"
        const isDelayed = item.status === "Delayed"
        return (
          <div key={item.id} className={`tra-corridor-card rounded-lg border p-3 ${isCritical ? "tra-critical-pulse" : ""} ${isDelayed ? "tra-warning-border" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{item.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${modeColors[item.mode] || "bg-gray-100 text-gray-600"}`}>{item.mode}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${congestionColors[item.congestion] || "bg-gray-100 text-gray-600"}`}>{item.congestion}</span>
              </div>
              <span className={statusColors[item.status]}>{item.status}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
              <Route className="h-3 w-3" /><span className="font-medium text-foreground">{item.corridor}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] mb-2">
              <span className="font-medium">{item.carrier}</span>
              <span>{item.region}</span>
              <span>{item.cargo}</span>
              <span>{item.season}</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-[11px] mb-2">
              <div><span className="text-muted-foreground block text-[10px]">Distance</span><span>{item.dist} km</span></div>
              <div><span className="text-muted-foreground block text-[10px]">Time</span>
                <span className={delayPct > 20 ? "text-red-600" : delayPct > 0 ? "text-amber-600" : "text-emerald-600"}>
                  {item.time}h / {item.timePlan}h
                </span>
              </div>
              <div><span className="text-muted-foreground block text-[10px]">Load</span><span>{item.load}%</span></div>
              <div><span className="text-muted-foreground block text-[10px]">OTP</span>
                <span className={item.otp >= 90 ? "text-emerald-600" : item.otp >= 75 ? "text-amber-600" : "text-red-600"}>
                  {item.otp}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span>Halts: {item.halts}</span>
              <span>Fuel: {item.fuel >= 1000 ? `${(item.fuel / 1000).toFixed(1)}KL` : `${item.fuel}L`}</span>
              <span>Toll: {fmtINR(item.toll)}</span>
              {item.accidents > 0 && <span className="text-red-500 font-medium">Accidents: {item.accidents}</span>}
            </div>
          </div>
        )
      })}

      {view === "cost" && filtered.sort((a, b) => a.costPerKm - b.costPerKm).map(item => {
        const totalCost = item.dist * item.costPerKm
        return (
          <div key={item.id} className={`tra-cost-row rounded-lg border p-3 ${item.status === "Critical" ? "tra-critical-pulse" : "tra-cost-row"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{item.id}</span>
                <span className="text-[11px] font-medium">{item.corridor}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${modeColors[item.mode] || "bg-gray-100 text-gray-600"}`}>{item.mode}</span>
              </div>
              <span className="text-xs font-semibold">{fmtINR(Math.round(totalCost))}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-2">
              <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${Math.min((item.costPerKm / 90) * 100, 100)}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <div className="flex gap-4">
                <span>\u20b9{item.costPerKm}/km</span>
                <span>{item.dist} km</span>
                <span>Tonnage: {item.tonnage >= 1000 ? `${(item.tonnage / 1000).toFixed(1)}T` : `${item.tonnage}T`}</span>
              </div>
              <span className={statusColors[item.status]}>{item.status}</span>
            </div>
          </div>
        )
      })}

      {view === "performance" && filtered.sort((a, b) => a.otp - b.otp).map(item => {
        const delayPct = Math.round(((item.time - item.timePlan) / item.timePlan) * 100)
        return (
          <div key={item.id} className={`tra-perf-row rounded-lg border p-3 ${item.status === "Critical" ? "tra-critical-pulse" : "tra-perf-row"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{item.id}</span>
                <span className="text-[11px] font-medium">{item.corridor}</span>
              </div>
              <span className={`text-xs font-bold ${item.otp >= 90 ? "text-emerald-600" : item.otp >= 75 ? "text-amber-600" : "text-red-600"}`}>OTP {item.otp}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-2">
              <div className={`h-1.5 rounded-full transition-all ${item.otp >= 90 ? "bg-emerald-500" : item.otp >= 75 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.otp}%` }} />
            </div>
            <div className="grid grid-cols-5 gap-3 text-[11px] text-muted-foreground">
              <div><span className="block text-[10px]">Carrier</span><span className="text-foreground">{item.carrier}</span></div>
              <div><span className="block text-[10px]">Delay</span><span className={delayPct > 20 ? "text-red-600" : delayPct > 0 ? "text-amber-600" : "text-emerald-600"}>{delayPct > 0 ? `+${delayPct}%` : "On time"}</span></div>
              <div><span className="block text-[10px]">Load</span><span>{item.load}%</span></div>
              <div><span className="block text-[10px]">Congestion</span><span className={`px-1 py-0.5 rounded text-[9px] ${congestionColors[item.congestion]}`}>{item.congestion}</span></div>
              <div><span className="block text-[10px]">Accidents</span><span>{item.accidents}</span></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { TransportAnalyticsPanel }
