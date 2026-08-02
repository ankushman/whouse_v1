"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Truck, Navigation, Gauge, Fuel, Thermometer,
  Battery, AlertTriangle, Clock, Target, Zap, Route,
  Wrench, CheckCircle, XCircle, Signal
} from "lucide-react"

const raw = [
  { id: "FLT-01", vehicle: "MH-12-AB-1234", driver: "Ravi Patil", type: "Truck 20T", route: "Mumbai→Pune", carrier: "TCI Express", fuel: 72, fuelCap: 150, fuelCost: 8400, mileage: 4.2, speed: 58, maxSpeed: 80, distance: 180, remaining: 42, temp: 82, engineTemp: 91, battery: 94, gps: "Online", acOn: true, lastPing: "2m ago", status: "In Transit", nextService: "2026-08-15", trips: 28, efficiency: 88 },
  { id: "FLT-02", vehicle: "DL-04-CD-5678", driver: "Manoj Singh", type: "Truck 14T", route: "Delhi→Jaipur", carrier: "Rivigo", fuel: 45, fuelCap: 120, fuelCost: 5200, mileage: 5.1, speed: 0, maxSpeed: 70, distance: 260, remaining: 260, temp: 38, engineTemp: 45, battery: 82, gps: "Parked", acOn: false, lastPing: "15m ago", status: "Idle", nextService: "2026-08-20", trips: 18, efficiency: 92 },
  { id: "FLT-03", vehicle: "KA-01-EF-9012", driver: "Kiran Rao", type: "Reefer 10T", route: "Bengaluru→Chennai", carrier: "Snowman", fuel: 28, fuelCap: 100, fuelCost: 6200, mileage: 3.8, speed: 52, maxSpeed: 65, distance: 350, remaining: 120, temp: -18, engineTemp: 88, battery: 68, gps: "Online", acOn: true, lastPing: "1m ago", status: "In Transit", nextService: "2026-08-10", trips: 32, efficiency: 85 },
  { id: "FLT-04", vehicle: "TS-08-GH-3456", driver: "Srinivas Reddy", type: "Container 40T", route: "Hyderabad→Mumbai", carrier: "Container Corp", fuel: 12, fuelCap: 200, fuelCost: 12800, mileage: 3.2, speed: 45, maxSpeed: 60, distance: 620, remaining: 280, temp: 42, engineTemp: 96, battery: 55, gps: "Low Signal", acOn: true, lastPing: "8m ago", status: "Low Fuel", nextService: "Overdue", trips: 42, efficiency: 74 },
  { id: "FLT-05", vehicle: "WB-02-IJ-7890", driver: "Amit Das", type: "Truck 7T", route: "Kolkata→Delhi", carrier: "Safexpress", fuel: 88, fuelCap: 90, fuelCost: 9400, mileage: 4.5, speed: 62, maxSpeed: 75, distance: 1500, remaining: 680, temp: 44, engineTemp: 93, battery: 91, gps: "Online", acOn: true, lastPing: "30s ago", status: "In Transit", nextService: "2026-09-01", trips: 22, efficiency: 90 },
  { id: "FLT-06", vehicle: "TN-09-KL-2345", driver: "Murugan V", type: "Truck 16T", route: "Chennai→Bengaluru", carrier: "Delhivery", fuel: 56, fuelCap: 140, fuelCost: 7100, mileage: 4.0, speed: 71, maxSpeed: 70, distance: 340, remaining: 85, temp: 40, engineTemp: 90, battery: 78, gps: "Online", acOn: true, lastPing: "1m ago", status: "Speeding", nextService: "2026-08-25", trips: 35, efficiency: 82 },
  { id: "FLT-07", vehicle: "MH-14-MN-6789", driver: "Sanjay Deshmukh", type: "Van 3.5T", route: "Pune→Mumbai", carrier: "Shadowfax", fuel: 65, fuelCap: 50, fuelCost: 3200, mileage: 8.5, speed: 48, maxSpeed: 80, distance: 150, remaining: 0, temp: 35, engineTemp: 85, battery: 99, gps: "Online", acOn: false, lastPing: "10s ago", status: "Completed", nextService: "2026-08-18", trips: 48, efficiency: 96 },
  { id: "FLT-08", vehicle: "GJ-01-OP-0123", driver: "Rajesh Patel", type: "Truck 20T", route: "Ahmedabad→Delhi", carrier: "TCI Express", fuel: 0, fuelCap: 160, fuelCost: 0, mileage: 0, speed: 0, maxSpeed: 80, distance: 920, remaining: 920, temp: 45, engineTemp: 0, battery: 8, gps: "Offline", acOn: false, lastPing: "4h ago", status: "Breakdown", nextService: "Overdue", trips: 15, efficiency: 0 },
  { id: "FLT-09", vehicle: "HR-26-QR-4567", driver: "Harpal Singh", type: "Truck 10T", route: "Chandigarh→Jaipur", carrier: "Ekart Logistics", fuel: 38, fuelCap: 80, fuelCost: 4500, mileage: 4.8, speed: 55, maxSpeed: 70, distance: 480, remaining: 210, temp: 41, engineTemp: 89, battery: 86, gps: "Online", acOn: true, lastPing: "2m ago", status: "In Transit", nextService: "2026-08-30", trips: 20, efficiency: 87 },
  { id: "FLT-10", vehicle: "KL-08-ST-8901", driver: "Thomas K", type: "Reefer 12T", route: "Kochi→Chennai", carrier: "Snowman", fuel: 18, fuelCap: 110, fuelCost: 5800, mileage: 3.5, speed: 50, maxSpeed: 60, distance: 680, remaining: 320, temp: -22, engineTemp: 92, battery: 42, gps: "Weak Signal", acOn: true, lastPing: "12m ago", status: "Low Battery", nextService: "2026-08-12", trips: 26, efficiency: 79 },
]

interface FLTItem {
  id: string; vehicle: string; driver: string; type: string; route: string
  carrier: string; fuel: number; fuelCap: number; fuelCost: number; mileage: number
  speed: number; maxSpeed: number; distance: number; remaining: number
  temp: number; engineTemp: number; battery: number; gps: string; acOn: boolean
  lastPing: string; status: string; nextService: string; trips: number; efficiency: number
}

const items: FLTItem[] = raw.map((r: any) => ({
  id: r.id, vehicle: r.vehicle, driver: r.driver, type: r.type, route: r.route,
  carrier: r.carrier, fuel: r.fuel, fuelCap: r.fuelCap, fuelCost: r.fuelCost, mileage: r.mileage,
  speed: r.speed, maxSpeed: r.maxSpeed, distance: r.distance, remaining: r.remaining,
  temp: r.temp, engineTemp: r.engineTemp, battery: r.battery, gps: r.gps, acOn: r.acOn,
  lastPing: r.lastPing, status: r.status, nextService: r.nextService, trips: r.trips, efficiency: r.efficiency,
}))

const statusColors: Record<string, string> = {
  "In Transit": "text-blue-600 font-semibold", "Idle": "text-slate-500 font-semibold",
  "Low Fuel": "text-red-600 font-semibold", "Speeding": "text-amber-600 font-semibold",
  "Completed": "text-emerald-600 font-semibold", "Breakdown": "text-red-600 font-semibold",
  "Low Battery": "text-orange-600 font-semibold",
}
const typeColors: Record<string, string> = {
  "Truck 20T": "bg-blue-100 text-blue-700", "Truck 14T": "bg-indigo-100 text-indigo-700",
  "Reefer 10T": "bg-cyan-100 text-cyan-700", "Container 40T": "bg-purple-100 text-purple-700",
  "Truck 7T": "bg-amber-100 text-amber-700", "Truck 16T": "bg-teal-100 text-teal-700",
  "Van 3.5T": "bg-emerald-100 text-emerald-700", "Truck 10T": "bg-orange-100 text-orange-700",
  "Reefer 12T": "bg-sky-100 text-sky-700",
}
const carriers = [...new Set(items.map(i => i.carrier))]
const totalFuelCost = items.reduce((s, i) => s + i.fuelCost, 0)
const avgEfficiency = Math.round(items.filter(i => i.efficiency > 0).reduce((s, i) => s + i.efficiency, 0) / items.filter(i => i.efficiency > 0).length)
const inTransit = items.filter(i => i.status === "In Transit").length
const totalTrips = items.reduce((s, i) => s + i.trips, 0)

type Rec = any
type FV = Record<string, string>
type VT = "vehicles" | "fuel" | "health"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`flt-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function FleetTelematicsPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("vehicles")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const alerts = [
    ...items.filter(i => i.status === "Breakdown").map(i => ({ id: i.id, msg: `${i.vehicle}: Breakdown \u2014 battery ${i.battery}%, GPS ${i.gps}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Low Fuel").map(i => ({ id: i.id, msg: `${i.vehicle}: ${i.fuel}L remaining of ${i.fuelCap}L \u2014 service ${i.nextService}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Speeding").map(i => ({ id: i.id, msg: `${i.vehicle}: ${i.speed}km/h exceeds max ${i.maxSpeed}km/h`, severity: "warning" as const })),
    ...items.filter(i => i.status === "Low Battery").map(i => ({ id: i.id, msg: `${i.vehicle}: Battery at ${i.battery}%, GPS ${i.gps}`, severity: "warning" as const })),
    ...items.filter(i => i.nextService === "Overdue").map(i => ({ id: i.id, msg: `${i.vehicle}: Service overdue \u2014 immediate attention needed`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Navigation, title: "In Transit", desc: `${inTransit}/${items.length} vehicles active`, accent: "text-blue-500" },
    { icon: Target, title: "Efficiency", desc: `${avgEfficiency}% avg fleet efficiency`, accent: "text-emerald-500" },
    { icon: Zap, title: "Trips", desc: `${totalTrips} total this month`, accent: "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"><Truck className="h-4 w-4 text-blue-600" /></div>
            <div><h3 className="text-sm font-bold">Fleet Telematics</h3><p className="text-xs opacity-60">{items.length} vehicles | {carriers.length} carriers</p></div>
          </div>
          <div className="flex gap-1">
            {(["vehicles", "fuel", "health"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "vehicles" ? "Vehicles" : v === "fuel" ? "Fuel" : "Health"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Fuel Cost", `\u20b9${(totalFuelCost / 1000).toFixed(0)}K/mo`, Fuel, "bg-blue-50/50")}
          {statCard("Active", `${inTransit}/${items.length}`, Navigation, "bg-emerald-50/50")}
          {statCard("Efficiency", `${avgEfficiency}%`, Target, "bg-indigo-50/50")}
          {statCard("Trips/mo", totalTrips.toString(), Zap, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {carriers.map(c => {
            const active = activeFilters.carrier === c
            return <span key={c} onClick={() => toggle("carrier", active ? undefined : c)} className={`flt-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="flt-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="flt-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="flt-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Fleet Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`flt-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "vehicles" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Breakdown" || item.status === "Low Fuel"
              const isWarning = item.status === "Speeding" || item.status === "Low Battery"
              const fuelPct = Math.round((item.fuel / Math.max(item.fuelCap, 1)) * 100)
              return (
                <div key={item.id} className={`flt-vehicle-card rounded-lg border p-2.5 bg-card ${isCritical ? "flt-critical-pulse" : isWarning ? "flt-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flt-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{item.id}</span>
                      <span className={`flt-type-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {item.status === "In Transit" ? <Signal className="h-3 w-3 text-emerald-500" /> : item.status === "Breakdown" ? <XCircle className="h-3 w-3 text-red-500" /> : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 opacity-40" />{item.vehicle} | {item.driver}</div>
                    <div className="flex items-center gap-1"><Route className="h-3 w-3 opacity-40" />{item.route} | {item.carrier}</div>
                    <div className="flex items-center gap-1"><Gauge className="h-3 w-3 opacity-40" />{item.speed > 0 ? `${item.speed}km/h` : "Stopped"} | {item.distance}km | {item.remaining > 0 ? `${item.remaining}km left` : "Arrived"}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Ping: {item.lastPing} | GPS: {item.gps}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Fuel: <span className={`font-bold ${fuelPct <= 20 ? "text-red-600" : fuelPct <= 40 ? "text-amber-600" : "text-foreground"}`}>{fuelPct}%</span></div>
                    <div>Battery: <span className={`font-bold ${item.battery <= 30 ? "text-red-600" : item.battery <= 50 ? "text-amber-600" : "text-foreground"}`}>{item.battery}%</span></div>
                    <div>Temp: <span className="font-medium">{item.temp > 0 ? `${item.temp}\u00b0C` : `${item.temp}\u00b0C`}</span></div>
                    <div>Trips: <span className="font-medium">{item.trips}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "fuel" && (
          <div className="space-y-2">
            <div className="flt-fuel-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">\u20b9{(totalFuelCost / 1000).toFixed(0)}K</div><div className="text-[10px] opacity-50">Total Fuel Cost</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{(items.filter(i => i.mileage > 0).reduce((s, i) => s + i.mileage, 0) / items.filter(i => i.mileage > 0).length).toFixed(1)}km/L</div><div className="text-[10px] opacity-50">Avg Mileage</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => ((i.fuel / Math.max(i.fuelCap, 1)) * 100) <= 20).length}</div><div className="text-[10px] opacity-50">Critical Fuel</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.acOn).length}/{items.length}</div><div className="text-[10px] opacity-50">AC Running</div></div>
              </div>
            </div>
            {items.sort((a, b) => (a.fuel / Math.max(a.fuelCap, 1)) - (b.fuel / Math.max(b.fuelCap, 1))).map(item => {
              const fuelPct = Math.round((item.fuel / Math.max(item.fuelCap, 1)) * 100)
              return (
                <div key={item.id} className="flt-fuel-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.vehicle}</span>
                      <span className="text-[10px] opacity-50">{item.type}</span>
                    </div>
                    <span className={`text-xs font-bold ${fuelPct <= 20 ? "text-red-600" : fuelPct <= 40 ? "text-amber-600" : "text-emerald-600"}`}>{fuelPct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${fuelPct <= 20 ? "bg-red-500" : fuelPct <= 40 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(fuelPct, 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Fuel: <span className="font-medium">{item.fuel}L / {item.fuelCap}L</span></div>
                    <div>Cost: <span className="font-medium">\u20b9${(item.fuelCost / 1000).toFixed(1)}K</span></div>
                    <div>Mileage: <span className="font-medium">{item.mileage > 0 ? `${item.mileage}km/L` : "N/A"}</span></div>
                    <div>Efficiency: <span className="font-medium">{item.efficiency > 0 ? `${item.efficiency}%` : "N/A"}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "health" && (
          <div className="space-y-2">
            <div className="flt-health-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.status !== "Breakdown").length}</div><div className="text-[10px] opacity-50">Running</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.status === "Breakdown").length}</div><div className="text-[10px] opacity-50">Breakdown</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.nextService === "Overdue").length}</div><div className="text-[10px] opacity-50">Service Overdue</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.engineTemp > 95).length}</div><div className="text-[10px] opacity-50">Engine Hot</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.battery - b.battery).map(item => {
              const isLow = item.battery <= 30
              return (
                <div key={item.id} className="flt-health-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.vehicle}</span>
                      <span className="text-[10px] opacity-50">{item.driver}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.battery >= 80 ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : isLow ? <AlertTriangle className="h-3 w-3 text-red-500" /> : <Wrench className="h-3 w-3 text-amber-500" />}
                      <span className={`text-xs font-bold ${item.battery >= 80 ? "text-emerald-600" : item.battery >= 50 ? "text-amber-600" : "text-red-600"}`}>{item.battery}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.battery >= 80 ? "bg-emerald-500" : item.battery >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.battery}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Engine: <span className={`font-medium ${item.engineTemp > 95 ? "text-red-600" : item.engineTemp > 88 ? "text-amber-600" : "text-foreground"}`}>{item.engineTemp > 0 ? `${item.engineTemp}\u00b0C` : "Off"}</span></div>
                    <div>Service: <span className={`font-medium ${item.nextService === "Overdue" ? "text-red-600" : "text-foreground"}`}>{item.nextService}</span></div>
                    <div>GPS: <span className="font-medium">{item.gps}</span></div>
                    <div>Trips: <span className="font-medium">{item.trips}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
