"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Truck, Route, Gauge, AlertTriangle, TrendingUp, Wrench, Thermometer, Navigation
} from "lucide-react"

const raw = [
  { id: "FLM-01", reg: "MH12AB1234", type: "32ft Container", class: "Heavy", driver: "Rajesh Kumar", carrier: "Rivigo", route: "Mumbai-Delhi", hub: "MUM-HUB1", nextHub: "DEL-HUB2", speed: 62, odo: 185420, fuel: 78, temp: null, tyre: 92, engine: 95, lastSvc: "15 Jul 2026", nextSvc: "15 Aug 2026", eol: "2029-03", uptime: 94.2, trips: 182, idle: 8, util: 88, region: "West", status: "On Route", cargo: "FMCG", gps: "Active", load: 18.5, capacity: 20 },
  { id: "FLM-02", reg: "DL04CD5678", type: "20ft Container", class: "Medium", driver: "Amit Singh", carrier: "Delhivery", route: "Delhi-Jaipur", hub: "DEL-HUB2", nextHub: "JAI-HUB9", speed: 45, odo: 242180, fuel: 42, temp: null, tyre: 68, engine: 82, lastSvc: "01 Jun 2026", nextSvc: "01 Jul 2026", eol: "2027-11", uptime: 88.1, trips: 245, idle: 22, util: 72, region: "North", status: "Maintenance", cargo: "Empty", gps: "Hub", load: 0, capacity: 14 },
  { id: "FLM-03", reg: "KA01EF9012", type: "Reefer Truck", class: "Reefer", driver: "Venkatesh R", carrier: "ColdStar", route: "Chennai-Bengaluru", hub: "MAA-HUB4", nextHub: "BLR-HUB3", speed: 55, odo: 156880, fuel: 62, temp: -18, tyre: 88, engine: 91, lastSvc: "20 Jul 2026", nextSvc: "20 Aug 2026", eol: "2030-06", uptime: 96.5, trips: 98, idle: 4, util: 92, region: "South", status: "On Route", cargo: "Pharma", gps: "Active", load: 8.5, capacity: 12 },
  { id: "FLM-04", reg: "WB11GH3456", type: "Flatbed Trailer", class: "Heavy", driver: "Suman Das", carrier: "TCI Express", route: "Kolkata-Guwahati", hub: "CCU-HUB7", nextHub: "GHY-HUB12", speed: 28, odo: 312450, fuel: 22, temp: null, tyre: 55, engine: 78, lastSvc: "10 May 2026", nextSvc: "10 Jun 2026", eol: "2026-09", uptime: 72.4, trips: 312, idle: 35, util: 58, region: "East", status: "Delayed", cargo: "Steel", gps: "Active", load: 22, capacity: 25 },
  { id: "FLM-05", reg: "GJ05IJ7890", type: "Tanker", class: "Specialized", driver: "Pranav Patel", carrier: "Adani Logistics", route: "Mundra-Kandla", hub: "MUN-HUB8", nextHub: "KDL-HUB11", speed: 40, odo: 128560, fuel: 85, temp: null, tyre: 94, engine: 97, lastSvc: "25 Jul 2026", nextSvc: "25 Aug 2026", eol: "2031-02", uptime: 98.1, trips: 145, idle: 2, util: 95, region: "West", status: "On Route", cargo: "Chemical", gps: "Active", load: 28, capacity: 30 },
  { id: "FLM-06", reg: "TN09KL1234", type: "16ft Box", class: "Light", driver: "Karthik S", carrier: "XpressBees", route: "Chennai-Coimbatore", hub: "MAA-HUB4", nextHub: "CBE-HUB13", speed: 58, odo: 95220, fuel: 55, temp: null, tyre: 82, engine: 89, lastSvc: "18 Jul 2026", nextSvc: "18 Aug 2026", eol: "2032-08", uptime: 92.8, trips: 420, idle: 6, util: 85, region: "South", status: "On Route", cargo: "E-commerce", gps: "Active", load: 4.2, capacity: 6 },
  { id: "FLM-07", reg: "MH14MN5678", type: "32ft Container", class: "Heavy", driver: "Suresh M", carrier: "Ecom Express", route: "Pune-Hyderabad", hub: "PNQ-HUB6", nextHub: "HYD-HUB5", speed: 0, odo: 278900, fuel: 18, temp: null, tyre: 45, engine: 72, lastSvc: "05 Apr 2026", nextSvc: "05 May 2026", eol: "2026-12", uptime: 68.5, trips: 198, idle: 48, util: 52, region: "West", status: "Breakdown", cargo: "Fashion", gps: "Offline", load: 0, capacity: 20 },
  { id: "FLM-08", reg: "RJ07OP9012", type: "Reefer Truck", class: "Reefer", driver: "Vikram J", carrier: "Snowman Logistics", route: "Jaipur-Delhi", hub: "JAI-HUB9", nextHub: "DEL-HUB2", speed: 52, odo: 142180, fuel: 70, temp: -25, tyre: 90, engine: 93, lastSvc: "22 Jul 2026", nextSvc: "22 Aug 2026", eol: "2030-01", uptime: 95.8, trips: 82, idle: 5, util: 90, region: "North", status: "On Route", cargo: "Vaccines", gps: "Active", load: 6.8, capacity: 10 },
  { id: "FLM-09", reg: "TS08QR3456", type: "20ft Container", class: "Medium", driver: "Ramesh B", carrier: "Shadowfax", route: "Hyderabad-Vizag", hub: "HYD-HUB5", nextHub: "VZG-HUB14", speed: 60, odo: 195320, fuel: 48, temp: null, tyre: 76, engine: 85, lastSvc: "12 Jul 2026", nextSvc: "12 Aug 2026", eol: "2028-05", uptime: 91.2, trips: 210, idle: 12, util: 80, region: "South", status: "On Route", cargo: "Electronics", gps: "Active", load: 11, capacity: 14 },
  { id: "FLM-10", reg: "UP10ST7890", type: "Flatbed Trailer", class: "Heavy", driver: "Manoj K", carrier: "BlueDart", route: "Delhi-Kolkata", hub: "DEL-HUB2", nextHub: "CCU-HUB7", speed: 50, odo: 358720, fuel: 35, temp: null, tyre: 52, engine: 75, lastSvc: "01 Mar 2026", nextSvc: "01 Apr 2026", eol: "2026-08", uptime: 74.8, trips: 380, idle: 28, util: 65, region: "North-East", status: "Overdue Service", cargo: "Machinery", gps: "Active", load: 20, capacity: 25 },
]

interface FLMItem {
  id: string; reg: string; type: string; class: string; driver: string; carrier: string
  route: string; hub: string; nextHub: string; speed: number; odo: number; fuel: number
  temp: number | null; tyre: number; engine: number; lastSvc: string; nextSvc: string
  eol: string; uptime: number; trips: number; idle: number; util: number
  region: string; status: string; cargo: string; gps: string; load: number; capacity: number
}

type Rec = any
const items: FLMItem[] = raw.map((r: Rec) => ({
  id: r.id, reg: r.reg, type: r.type, class: r.class, driver: r.driver, carrier: r.carrier,
  route: r.route, hub: r.hub, nextHub: r.nextHub, speed: r.speed, odo: r.odo, fuel: r.fuel,
  temp: r.temp, tyre: r.tyre, engine: r.engine, lastSvc: r.lastSvc, nextSvc: r.nextSvc,
  eol: r.eol, uptime: r.uptime, trips: r.trips, idle: r.idle, util: r.util,
  region: r.region, status: r.status, cargo: r.cargo, gps: r.gps, load: r.load, capacity: r.capacity,
}))

const classColors: Record<string, string> = {
  "Heavy": "bg-orange-100 text-orange-700", "Medium": "bg-blue-100 text-blue-700",
  "Light": "bg-emerald-100 text-emerald-700", "Reefer": "bg-cyan-100 text-cyan-700",
  "Specialized": "bg-violet-100 text-violet-700",
}

const statusColors: Record<string, string> = {
  "On Route": "text-emerald-600 font-semibold", "Maintenance": "text-amber-600 font-semibold",
  "Delayed": "text-orange-600 font-semibold", "Breakdown": "text-red-600 font-semibold", "Overdue Service": "text-red-700 font-semibold",
}

const gpsColors: Record<string, string> = {
  "Active": "bg-emerald-100 text-emerald-700", "Hub": "bg-blue-100 text-blue-700", "Offline": "bg-red-100 text-red-700",
}

const healthPct = (v: number) => v >= 85 ? "text-emerald-600" : v >= 60 ? "text-amber-600" : "text-red-600"

const FleetManagementPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"vehicles" | "health" | "utilization">("vehicles")
  const filters = [
    { key: "class", label: "Class", options: ["Heavy", "Medium", "Light", "Reefer", "Specialized"] },
    { key: "status", label: "Status", options: ["On Route", "Maintenance", "Delayed", "Breakdown", "Overdue Service"] },
    { key: "region", label: "Region", options: ["West", "North", "South", "East", "North-East", "West-South"] },
  ]

  const toggleFilter = (k: string, v: string) => setActiveFilters((p: Record<string, string>) => {
    const n = Object.assign({}, p)
    if (n[k] === v) { delete n[k] } else { n[k] = v }
    return n
  })

  const filtered = items.filter((r: Rec) => Object.entries(activeFilters).every(([k, v]) => r[k as keyof Rec] === v))

  const stats = [
    { label: "On Route", value: items.filter(i => i.status === "On Route").length.toString(), icon: Navigation, color: "bg-emerald-50 text-emerald-600" },
    { label: "Fleet Utilization", value: Math.round(items.reduce((a, b) => a + b.util, 0) / items.length) + "%", icon: Gauge, color: "bg-blue-50 text-blue-600" },
    { label: "Breakdowns", value: items.filter(i => i.status === "Breakdown").length.toString(), icon: Wrench, color: "bg-red-50 text-red-600" },
    { label: "Total Trips", value: items.reduce((a, b) => a + b.trips, 0).toLocaleString(), icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
  ]

  const insights = [
    { icon: AlertTriangle, title: "Breakdown: FLM-07 Pune", desc: "MH14MN5678 broke down near Nashik. Engine 72%, tyre 45%, fuel 18%. Overdue service since May. Needs towing and emergency repair.", color: "text-red-500" },
    { icon: Wrench, title: "Overdue: FLM-10 Delhi", desc: "UP10ST7890 overdue service since April. Engine 75%, tyre 52%, eol Aug 2026. Only 2 months left. Consider retirement or major overhaul.", color: "text-orange-500" },
    { icon: Thermometer, title: "Reefer Health OK", desc: "FLM-03 at -18\u00b0C (Chennai-Bengaluru) and FLM-08 at -25\u00b0C (Jaipur-Delhi). Both performing within spec. Snowman/ColdStar reefer fleet healthy.", color: "text-cyan-500" },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {stats.map((sc) => { const SIcon = sc.icon as React.ElementType; return (
          <div key={sc.label} className={`flm-stat-card rounded-lg border p-3 ${sc.color.split(" ")[0]}`}>
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
            className={`flm-filter-pill px-2 py-0.5 rounded-full text-xs border ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-muted-foreground/20"}`}>{opt}</button>
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
        {(["vehicles", "health", "utilization"] as const).map(v => (
          <Button key={v} size="sm" variant={view === v ? "default" : "outline"} onClick={() => setView(v)}
            className="text-xs h-7 capitalize">{v}</Button>
        ))}
      </div>

      {view === "vehicles" && filtered.map(item => {
        const isBreakdown = item.status === "Breakdown"
        const isOverdue = item.status === "Overdue Service"
        return (
          <div key={item.id} className={`flm-vehicle-card rounded-lg border p-3 ${isBreakdown ? "flm-breakdown-pulse" : ""} ${isOverdue ? "flm-warning-border" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{item.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${classColors[item.class] || "bg-gray-100 text-gray-600"}`}>{item.type}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${gpsColors[item.gps] || "bg-gray-100"}`}>{item.gps}</span>
              </div>
              <span className={statusColors[item.status]}>{item.status}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
              <Truck className="h-3 w-3" /><span className="font-medium text-foreground">{item.reg}</span>
              <span className="mx-1">&middot;</span>
              <span>{item.driver}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
              <Route className="h-3 w-3" /><span className="font-medium text-foreground">{item.route}</span>
              <span className="text-muted-foreground/60">{item.hub} &rarr; {item.nextHub}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] mb-2">
              <span className="font-medium">{item.carrier}</span>
              <span>{item.cargo}</span>
              {item.temp !== null && <span className="text-cyan-600 font-medium">{item.temp}\u00b0C</span>}
              {item.speed > 0 ? <span>{item.speed} km/h</span> : <span className="text-red-500">Stationary</span>}
            </div>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span>Odo: {(item.odo / 1000).toFixed(0)}K km</span>
              <span>Fuel: {item.fuel}%</span>
              <span>Load: {item.load}T/{item.capacity}T</span>
              <span>Uptime: {item.uptime}%</span>
              <span>Trips: {item.trips}</span>
            </div>
          </div>
        )
      })}

      {view === "health" && filtered.sort((a, b) => a.engine - b.engine).map(item => {
        const isBreakdown = item.status === "Breakdown"
        return (
          <div key={item.id} className={`flm-health-row rounded-lg border p-3 ${isBreakdown ? "flm-breakdown-pulse" : "flm-health-row"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs font-bold">{item.id}</span>
                <span className="text-[11px] font-medium">{item.reg}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">EOL: {item.eol}</span>
                <span className={statusColors[item.status]}>{item.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 text-[11px] mb-2">
              <div><span className="text-muted-foreground block text-[10px]">Engine</span>
                <span className={`font-medium ${healthPct(item.engine)}`}>{item.engine}%</span></div>
              <div><span className="text-muted-foreground block text-[10px]">Tyre</span>
                <span className={`font-medium ${healthPct(item.tyre)}`}>{item.tyre}%</span></div>
              <div><span className="text-muted-foreground block text-[10px]">Fuel Level</span>
                <span className={item.fuel >= 50 ? "text-emerald-600" : item.fuel >= 25 ? "text-amber-600" : "text-red-600"}>{item.fuel}%</span></div>
              <div><span className="text-muted-foreground block text-[10px]">Next Service</span>
                <span className={item.status === "Overdue Service" ? "text-red-600 font-medium" : "text-foreground"}>{item.nextSvc}</span></div>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-1">
              <div className={`h-1.5 rounded-full transition-all ${item.engine >= 85 ? "bg-emerald-500" : item.engine >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.engine}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{item.carrier} &middot; {item.type}</span>
              <span>Odo: {(item.odo / 1000).toFixed(0)}K km &middot; {item.trips} trips</span>
            </div>
          </div>
        )
      })}

      {view === "utilization" && filtered.sort((a, b) => a.util - b.util).map(item => {
        const loadPct = item.capacity > 0 ? Math.round((item.load / item.capacity) * 100) : 0
        return (
          <div key={item.id} className={`flm-util-row rounded-lg border p-3 ${item.status === "Breakdown" ? "flm-breakdown-pulse" : "flm-util-row"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{item.id}</span>
                <span className="text-[11px] font-medium">{item.reg}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${classColors[item.class]}`}>{item.class}</span>
              </div>
              <span className={`text-xs font-bold ${item.util >= 85 ? "text-emerald-600" : item.util >= 70 ? "text-amber-600" : "text-red-600"}`}>{item.util}%</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] mb-2">
              <span>{item.route}</span>
              <span>{item.carrier}</span>
              <span>{item.cargo}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-1">
              <div className={`h-1.5 rounded-full transition-all ${item.util >= 85 ? "bg-emerald-500" : item.util >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.util}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <div className="flex gap-4">
                <span>Load: {item.load}T/{item.capacity}T ({loadPct}%)</span>
                <span>Idle: {item.idle} days</span>
                <span>Trips: {item.trips}</span>
              </div>
              <span>Uptime: {item.uptime}%</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { FleetManagementPanel }
