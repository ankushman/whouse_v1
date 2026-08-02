"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Truck, MapPin, Clock, Users, Package, CheckCircle,
  XCircle, AlertTriangle, Zap, Target,
  Navigation, Route
} from "lucide-react"

const raw = [
  { id: "LMO-01", route: "Mumbai South Zone", partner: "Delhivery", city: "Mumbai", pincode: "400001-400051", status: "On Track", deliveries: 342, attempted: 298, firstAttempt: 94.2, codAmount: 285000, avgTime: 42, distance: 18, density: 85, satisfaction: 4.5, sla: "Same Day", slaMet: 96, rto: 8, cancelled: 2, vehicle: "Electric Van", hub: "Andheri Hub", agents: 12 },
  { id: "LMO-02", route: "Delhi NCR West", partner: "Shadowfax", city: "Delhi", pincode: "110001-110064", status: "Delayed", deliveries: 520, attempted: 445, firstAttempt: 85.6, codAmount: 620000, avgTime: 58, distance: 24, density: 72, satisfaction: 3.8, sla: "Next Day", slaMet: 78, rto: 32, cancelled: 8, vehicle: "Motorcycle", hub: "Dwarka Hub", agents: 18 },
  { id: "LMO-03", route: "Bengaluru East", partner: "Dunzo", city: "Bengaluru", pincode: "560001-560049", status: "On Track", deliveries: 280, attempted: 265, firstAttempt: 94.7, codAmount: 145000, avgTime: 35, distance: 12, density: 92, satisfaction: 4.6, sla: "Same Day", slaMet: 98, rto: 5, cancelled: 1, vehicle: "Electric Scooter", hub: "Whitefield Hub", agents: 10 },
  { id: "LMO-04", route: "Chennai Suburban", partner: "Ecom Express", city: "Chennai", pincode: "600001-600113", status: "At Risk", deliveries: 195, attempted: 162, firstAttempt: 83.1, codAmount: 178000, avgTime: 72, distance: 32, density: 58, satisfaction: 3.2, sla: "Next Day", slaMet: 68, rto: 22, cancelled: 12, vehicle: "3-Wheeler", hub: "Velachery Hub", agents: 8 },
  { id: "LMO-05", route: "Hyderabad IT Corridor", partner: "XpressBees", city: "Hyderabad", pincode: "500001-500081", status: "On Track", deliveries: 310, attempted: 290, firstAttempt: 93.5, codAmount: 210000, avgTime: 38, distance: 15, density: 88, satisfaction: 4.4, sla: "Same Day", slaMet: 95, rto: 10, cancelled: 3, vehicle: "Electric Van", hub: "Gachibowli Hub", agents: 11 },
  { id: "LMO-06", route: "Pune Hinjewadi", partner: "Rivigo", city: "Pune", pincode: "411001-411057", status: "On Track", deliveries: 225, attempted: 215, firstAttempt: 95.6, codAmount: 165000, avgTime: 28, distance: 10, density: 95, satisfaction: 4.7, sla: "Same Day", slaMet: 99, rto: 4, cancelled: 1, vehicle: "Electric Scooter", hub: "Hinjewadi Hub", agents: 7 },
  { id: "LMO-07", route: "Kolkata Metro", partner: "Ekart", city: "Kolkata", pincode: "700001-700156", status: "Critical", deliveries: 180, attempted: 140, firstAttempt: 77.8, codAmount: 340000, avgTime: 88, distance: 28, density: 52, satisfaction: 2.9, sla: "Next Day", slaMet: 55, rto: 28, cancelled: 18, vehicle: "Van", hub: "Salt Lake Hub", agents: 9 },
  { id: "LMO-08", route: "Ahmedabad SG Highway", partner: "Delhivery", city: "Ahmedabad", pincode: "380001-380060", status: "On Track", deliveries: 260, attempted: 248, firstAttempt: 95.4, codAmount: 198000, avgTime: 32, distance: 14, density: 90, satisfaction: 4.5, sla: "Same Day", slaMet: 97, rto: 6, cancelled: 2, vehicle: "Electric Scooter", hub: "SG Highway Hub", agents: 9 },
  { id: "LMO-09", route: "Jaipur Walled City", partner: "BlueDart", city: "Jaipur", pincode: "302001-302020", status: "Delayed", deliveries: 165, attempted: 138, firstAttempt: 83.6, codAmount: 125000, avgTime: 65, distance: 20, density: 65, satisfaction: 3.5, sla: "Next Day", slaMet: 72, rto: 18, cancelled: 7, vehicle: "Motorcycle", hub: "MI Road Hub", agents: 6 },
  { id: "LMO-10", route: "Lucknow Gomti Nagar", partner: "Shadowfax", city: "Lucknow", pincode: "226001-226031", status: "On Track", deliveries: 200, attempted: 190, firstAttempt: 95.0, codAmount: 155000, avgTime: 40, distance: 16, density: 82, satisfaction: 4.3, sla: "Same Day", slaMet: 94, rto: 5, cancelled: 3, vehicle: "3-Wheeler", hub: "Gomti Nagar Hub", agents: 8 },
]

interface LMOItem {
  id: string; route: string; partner: string; city: string; pincode: string
  status: string; deliveries: number; attempted: number; firstAttempt: number
  codAmount: number; avgTime: number; distance: number; density: number
  satisfaction: number; sla: string; slaMet: number; rto: number
  cancelled: number; vehicle: string; hub: string; agents: number
}

const items: LMOItem[] = raw.map((r: any) => ({
  id: r.id, route: r.route, partner: r.partner, city: r.city, pincode: r.pincode,
  status: r.status, deliveries: r.deliveries, attempted: r.attempted,
  firstAttempt: r.firstAttempt, codAmount: r.codAmount, avgTime: r.avgTime,
  distance: r.distance, density: r.density, satisfaction: r.satisfaction,
  sla: r.sla, slaMet: r.slaMet, rto: r.rto, cancelled: r.cancelled,
  vehicle: r.vehicle, hub: r.hub, agents: r.agents,
}))

const statusColors: Record<string, string> = {
  "On Track": "text-emerald-600 font-semibold", "Delayed": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Critical": "text-red-600 font-semibold",
}
const vehColors: Record<string, string> = {
  "Electric Van": "bg-emerald-100 text-emerald-700", "Motorcycle": "bg-blue-100 text-blue-700",
  "Electric Scooter": "bg-teal-100 text-teal-700", "3-Wheeler": "bg-amber-100 text-amber-700",
  "Van": "bg-purple-100 text-purple-700",
}
const cities = [...new Set(items.map(i => i.city))]
const totalDeliveries = items.reduce((s, i) => s + i.deliveries, 0)
const avgFAD = (items.reduce((s, i) => s + i.firstAttempt, 0) / items.length).toFixed(1)
const totalRTO = items.reduce((s, i) => s + i.rto, 0)

type Rec = any
type FV = Record<string, string>
type VT = "routes" | "performance" | "partners"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`lmo-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function LastMileOptimizationPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("routes")

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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.route}: CRITICAL \u2014 SLA met ${i.slaMet}%, ${i.rto} RTO, ${i.cancelled} cancelled, ${i.partner}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "At Risk").map(i => ({ id: i.id, msg: `${i.route}: At risk \u2014 SLA ${i.slaMet}%, avg ${i.avgTime}min, satisfaction ${i.satisfaction}`, severity: "warning" as const })),
    ...items.filter(i => i.rto > 20).map(i => ({ id: i.id, msg: `${i.route}: High RTO ${i.rto} packages \u2014 ${i.city}, ${i.hub}`, severity: "warning" as const })),
    ...items.filter(i => i.firstAttempt < 85).map(i => ({ id: i.id, msg: `${i.route}: Low first-attempt ${i.firstAttempt}% \u2014 target &gt;90%`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Navigation, title: "Avg FAD", desc: `${avgFAD}% first-attempt delivery rate`, accent: "text-emerald-500" },
    { icon: Route, title: "Routes", desc: `${totalDeliveries} deliveries across ${items.length} routes`, accent: "text-blue-500" },
    { icon: Target, title: "RTO Rate", desc: `${totalRTO} returns to origin (${(totalRTO / totalDeliveries * 100).toFixed(1)}%)`, accent: "text-red-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center"><Truck className="h-4 w-4 text-teal-600" /></div>
            <div><h3 className="text-sm font-bold">Last Mile Optimization</h3><p className="text-xs opacity-60">{items.length} routes | {cities.length} cities</p></div>
          </div>
          <div className="flex gap-1">
            {(["routes", "performance", "partners"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "routes" ? "Routes" : v === "performance" ? "Performance" : "Partners"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Routes", items.length.toString(), MapPin, "bg-teal-50/50")}
          {statCard("Deliveries", totalDeliveries.toLocaleString(), Package, "bg-blue-50/50")}
          {statCard("FAD Rate", `${avgFAD}%`, Zap, "bg-emerald-50/50")}
          {statCard("RTO", totalRTO.toString(), XCircle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {cities.map(c => {
            const active = activeFilters.city === c
            return <span key={c} onClick={() => toggle("city", active ? undefined : c)} className={`lmo-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="lmo-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="lmo-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="lmo-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Last Mile Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`lmo-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "routes" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "Delayed" || item.status === "At Risk"
              return (
                <div key={item.id} className={`lmo-route-card rounded-lg border p-2.5 bg-card ${isCritical ? "lmo-critical-pulse" : isWarning ? "lmo-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="lmo-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-100 text-teal-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.route}</span>
                      <span className={`lmo-veh-tag text-[10px] px-1.5 py-0.5 rounded ${vehColors[item.vehicle] || "bg-slate-100"}`}>{item.vehicle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "On Track" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 opacity-40" />{item.partner} | {item.hub}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.pincode} | {item.sla}</div>
                    <div className="flex items-center gap-1"><Users className="h-3 w-3 opacity-40" />{item.agents} agents | {item.attempted}/{item.deliveries} delivered</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Avg: {item.avgTime}min | COD: {formatINR(item.codAmount)}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>FAD: <span className={`font-bold ${item.firstAttempt >= 90 ? "text-emerald-600" : item.firstAttempt >= 80 ? "text-amber-600" : "text-red-600"}`}>{item.firstAttempt}%</span></div>
                    <div>SLA: <span className={`font-bold ${item.slaMet >= 90 ? "text-emerald-600" : item.slaMet >= 70 ? "text-amber-600" : "text-red-600"}`}>{item.slaMet}%</span></div>
                    <div>RTO: <span className={`font-medium ${item.rto > 20 ? "text-red-600" : "text-foreground"}`}>{item.rto}</span></div>
                    <div>Rating: <span className="font-medium">{item.satisfaction}/5.0</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "performance" && (
          <div className="space-y-2">
            <div className="lmo-perf-header rounded-lg border p-2 bg-teal-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-teal-600">{avgFAD}%</div><div className="text-[10px] opacity-50">Avg FAD Rate</div></div>
                <div><div className="text-lg font-bold text-blue-600">{Math.round(items.reduce((s, i) => s + i.slaMet, 0) / items.length)}%</div><div className="text-[10px] opacity-50">Avg SLA Met</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.reduce((s, i) => s + i.satisfaction, 0) / items.length > 0 ? (items.reduce((s, i) => s + i.satisfaction, 0) / items.length).toFixed(1) : "0"}/5</div><div className="text-[10px] opacity-50">Avg Satisfaction</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{Math.round(items.reduce((s, i) => s + i.density, 0) / items.length)}%</div><div className="text-[10px] opacity-50">Avg Density</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.firstAttempt - b.firstAttempt).map(item => (
              <div key={item.id} className={`lmo-perf-row rounded-lg border p-2 bg-card ${item.firstAttempt < 80 ? "lmo-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.route}</span>
                    <span className="text-[10px] opacity-50">{item.city}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.firstAttempt >= 90 ? "text-emerald-600" : item.firstAttempt >= 80 ? "text-amber-600" : "text-red-600"}`}>{item.firstAttempt}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.firstAttempt >= 90 ? "bg-emerald-500" : item.firstAttempt >= 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.firstAttempt}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>SLA: <span className={`font-medium ${item.slaMet >= 90 ? "text-emerald-600" : item.slaMet < 70 ? "text-red-600" : "text-foreground"}`}>{item.slaMet}%</span></div>
                  <div>Avg Time: <span className="font-medium">{item.avgTime}min</span></div>
                  <div>Rating: <span className="font-medium">{item.satisfaction}/5.0</span></div>
                  <div>Density: <span className="font-medium">{item.density}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "partners" && (
          <div className="space-y-2">
            <div className="lmo-part-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{[...new Set(items.map(i => i.partner))].length}</div><div className="text-[10px] opacity-50">Partners</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.reduce((s, i) => s + i.agents, 0)}</div><div className="text-[10px] opacity-50">Total Agents</div></div>
                <div><div className="text-lg font-bold text-amber-600">{formatINR(items.reduce((s, i) => s + i.codAmount, 0))}</div><div className="text-[10px] opacity-50">COD Volume</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.vehicle.includes("Electric")).length}/{items.length}</div><div className="text-[10px] opacity-50">Electric Fleet</div></div>
              </div>
            </div>
            {[...new Set(items.map(i => i.partner))].map(partner => {
              const partnerItems = items.filter(i => i.partner === partner)
              const total = partnerItems.reduce((s, i) => s + i.deliveries, 0)
              const fad = (partnerItems.reduce((s, i) => s + i.firstAttempt, 0) / partnerItems.length).toFixed(1)
              const rto = partnerItems.reduce((s, i) => s + i.rto, 0)
              const sat = (partnerItems.reduce((s, i) => s + i.satisfaction, 0) / partnerItems.length).toFixed(1)
              return (
                <div key={partner} className="lmo-part-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{partner}</span>
                      <span className="text-[10px] opacity-50">{partnerItems.length} route{partnerItems.length > 1 ? "s" : ""}</span>
                    </div>
                    <span className="text-xs font-bold">{total} deliveries</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>FAD: <span className={`font-medium ${parseFloat(fad) >= 90 ? "text-emerald-600" : "text-amber-600"}`}>{fad}%</span></div>
                    <div>RTO: <span className="font-medium">{rto}</span></div>
                    <div>Rating: <span className="font-medium">{sat}/5.0</span></div>
                    <div>Agents: <span className="font-medium">{partnerItems.reduce((s, i) => s + i.agents, 0)}</span></div>
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
