"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Truck, Timer, MapPin, AlertTriangle, CheckCircle, XCircle,
  Clock, ParkingCircle, MoveRight, Users, Gauge
} from "lucide-react"

const raw = [
  { id: "YMO-01", trailer: "TRK-2041 MH14AB", type: "20ft Container", zone: "Inbound Staging", gate: "Gate A", driver: "Rajesh Kumar", carrier: "Delhivery", checkin: "06:15", dwell: 2.5, targetDwell: 4, status: "Checked In", chassis: "Available", moves: 0, weight: 18.5, city: "Mumbai", region: "West", priority: "High", temp: null, hazmat: false },
  { id: "YMO-02", trailer: "TRK-1087 HR26CD", type: "40ft Container", zone: "Active Dock", gate: "Gate B", driver: "Suresh Yadav", carrier: "Rivigo", checkin: "04:30", dwell: 8.2, targetDwell: 4, status: "Unloading", chassis: "Detached", moves: 1, weight: 24.2, city: "Delhi", region: "North", priority: "Critical", temp: null, hazmat: false },
  { id: "YMO-03", trailer: "TRK-3321 KA01EF", type: "Reefer", zone: "Cold Hold", gate: "Gate C", driver: "Anil Reddy", carrier: "ColdStar", checkin: "02:00", dwell: 14.5, targetDwell: 3, status: "Hold", chassis: "Attached", moves: 0, weight: 12.8, city: "Bengaluru", region: "South", priority: "Critical", temp: -18, hazmat: false },
  { id: "YMO-04", trailer: "TRK-0982 TN09GH", type: "Flatbed", zone: "Outbound Staging", gate: "Gate A", driver: "Karthik M", carrier: "TCI Express", checkin: "05:45", dwell: 3.0, targetDwell: 4, status: "Loading", chassis: "Detached", moves: 2, weight: 8.5, city: "Chennai", region: "South", priority: "Medium", temp: null, hazmat: false },
  { id: "YMO-05", trailer: "TRK-4410 GJ05IJ", type: "Tanker", zone: "Hazmat Hold", gate: "Gate D", driver: "Prakash Patel", carrier: "Adani Logistics", checkin: "22:00", dwell: 18.0, targetDwell: 2, status: "Hold", chassis: "Attached", moves: 0, weight: 22.0, city: "Ahmedabad", region: "West", priority: "Critical", temp: null, hazmat: true },
  { id: "YMO-06", trailer: "TRK-2205 WB12KL", type: "Open", zone: "Cross-Dock", gate: "Gate B", driver: "Bikash Das", carrier: "XpressBees", checkin: "07:00", dwell: 1.2, targetDwell: 4, status: "Spotting", chassis: "Available", moves: 1, weight: 6.2, city: "Kolkata", region: "East", priority: "Medium", temp: null, hazmat: false },
  { id: "YMO-07", trailer: "TRK-5543 UP16MN", type: "20ft Container", zone: "Inbound Staging", gate: "Gate A", driver: "Manoj Singh", carrier: "Shadowfax", checkin: "08:30", dwell: 0.5, targetDwell: 4, status: "Checked In", chassis: "Available", moves: 0, weight: 15.0, city: "Lucknow", region: "North", priority: "Low", temp: null, hazmat: false },
  { id: "YMO-08", trailer: "TRK-1189 RJ14OP", type: "40ft Container", zone: "Active Dock", gate: "Gate C", driver: "Gopal Sharma", carrier: "Ecom Express", checkin: "01:30", dwell: 10.5, targetDwell: 4, status: "Unloading", chassis: "Detached", moves: 1, weight: 20.8, city: "Jaipur", region: "North", priority: "High", temp: null, hazmat: false },
  { id: "YMO-09", trailer: "TRK-6678 KL08QR", type: "Skeletal", zone: "Outbound Staging", gate: "Gate B", driver: "Arun Nair", carrier: "BlueDart", checkin: "06:00", dwell: 4.5, targetDwell: 4, status: "Loading", chassis: "Detached", moves: 2, weight: 0, city: "Kochi", region: "South", priority: "High", temp: null, hazmat: false },
  { id: "YMO-10", trailer: "TRK-7732 MH12ST", type: "Reefer", zone: "Cold Hold", gate: "Gate D", driver: "Dinesh Joshi", carrier: "Snowman Logistics", checkin: "03:00", dwell: 22.0, targetDwell: 3, status: "Hold", chassis: "Attached", moves: 0, weight: 10.5, city: "Pune", region: "West", priority: "Critical", temp: -25, hazmat: false },
]

interface YMOItem {
  id: string; trailer: string; type: string; zone: string; gate: string
  driver: string; carrier: string; checkin: string; dwell: number; targetDwell: number
  status: string; chassis: string; moves: number; weight: number
  city: string; region: string; priority: string; temp: number | null; hazmat: boolean
}

const items: YMOItem[] = raw.map((r: any) => ({
  id: r.id, trailer: r.trailer, type: r.type, zone: r.zone, gate: r.gate,
  driver: r.driver, carrier: r.carrier, checkin: r.checkin, dwell: r.dwell, targetDwell: r.targetDwell,
  status: r.status, chassis: r.chassis, moves: r.moves, weight: r.weight,
  city: r.city, region: r.region, priority: r.priority, temp: r.temp, hazmat: r.hazmat,
}))

const statusColors: Record<string, string> = {
  "Checked In": "text-blue-600 font-semibold", "Spotting": "text-indigo-600 font-semibold",
  "Loading": "text-emerald-600 font-semibold", "Unloading": "text-cyan-600 font-semibold",
  "Hold": "text-red-600 font-semibold",
}
const typeColors: Record<string, string> = {
  "20ft Container": "bg-blue-100 text-blue-700", "40ft Container": "bg-indigo-100 text-indigo-700",
  "Reefer": "bg-cyan-100 text-cyan-700", "Flatbed": "bg-amber-100 text-amber-700",
  "Tanker": "bg-red-100 text-red-700", "Open": "bg-green-100 text-green-700",
  "Skeletal": "bg-gray-100 text-gray-600",
}
const zoneColors: Record<string, string> = {
  "Inbound Staging": "bg-blue-100 text-blue-700", "Active Dock": "bg-emerald-100 text-emerald-700",
  "Outbound Staging": "bg-orange-100 text-orange-700", "Hold": "bg-red-100 text-red-700",
  "Cross-Dock": "bg-purple-100 text-purple-700", "Cold Hold": "bg-cyan-100 text-cyan-700",
  "Hazmat Hold": "bg-red-100 text-red-800",
}
const priorityColors: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700", "High": "bg-orange-100 text-orange-700",
  "Medium": "bg-amber-100 text-amber-700", "Low": "bg-gray-100 text-gray-600",
}
const regions = [...new Set(items.map(i => i.region))]
const avgDwell = Math.round(items.reduce((s, i) => s + i.dwell, 0) / items.length * 10) / 10
const overTarget = items.filter(i => i.dwell > i.targetDwell).length
const onHold = items.filter(i => i.status === "Hold").length
const totalMoves = items.reduce((s, i) => s + i.moves, 0)

type Rec = any
type FV = Record<string, string>
type VT = "trailers" | "dwell" | "zones"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`ymo-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function YardManagementOptimizationPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("trailers")

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
    ...items.filter(i => i.status === "Hold" && i.hazmat).map(i => ({ id: i.id, msg: `${i.trailer}: HAZMAT HOLD \u2014 ${i.type}, dwell ${i.dwell}h exceeds ${i.targetDwell}h target, gate ${i.gate}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Hold" && !i.hazmat).map(i => ({ id: i.id, msg: `${i.trailer}: ON HOLD \u2014 dwell ${i.dwell}h, zone ${i.zone}${i.temp !== null ? `, temp ${i.temp}\u00b0C` : ""}, driver ${i.driver}`, severity: "warning" as const })),
    ...items.filter(i => i.dwell > i.targetDwell * 2 && i.status !== "Hold").map(i => ({ id: i.id, msg: `${i.trailer}: Dwell ${i.dwell}h exceeds 2x target (${i.targetDwell}h) \u2014 zone ${i.zone}, carrier ${i.carrier}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Timer, title: "Avg Dwell", desc: `${avgDwell}h across ${items.length} trailers | ${overTarget} over target`, accent: overTarget > 4 ? "text-red-500" : "text-blue-500" },
    { icon: ParkingCircle, title: "Yard Util", desc: `${Math.round(items.length / 12 * 100)}% capacity | ${onHold} on hold`, accent: onHold > 2 ? "text-red-500" : "text-emerald-500" },
    { icon: MoveRight, title: "Move Activity", desc: `${totalMoves} total moves today | ${items.filter(i => i.moves > 0).length} trailers relocated`, accent: "text-indigo-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center"><ParkingCircle className="h-4 w-4 text-orange-600" /></div>
            <div><h3 className="text-sm font-bold">Yard Management Optimization</h3><p className="text-xs opacity-60">{items.length} trailers | {regions.length} regions</p></div>
          </div>
          <div className="flex gap-1">
            {(["trailers", "dwell", "zones"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "trailers" ? "Trailers" : v === "dwell" ? "Dwell" : "Zones"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Trailers", items.length.toString(), Truck, "bg-orange-50/50")}
          {statCard("Avg Dwell", `${avgDwell}h`, Clock, "bg-amber-50/50")}
          {statCard("Over Target", `${overTarget}/${items.length}`, AlertTriangle, "bg-red-50/50")}
          {statCard("Moves", totalMoves.toString(), MoveRight, "bg-indigo-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {regions.map(t => {
            const active = activeFilters.region === t
            return <span key={t} onClick={() => toggle("region", active ? undefined : t)} className={`ymo-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="ymo-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="ymo-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="ymo-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Yard Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`ymo-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "trailers" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isHold = item.status === "Hold"
              const isOverdue = item.dwell > item.targetDwell * 2 && !isHold
              const dwellPct = Math.min(Math.round(item.dwell / item.targetDwell * 100), 200)
              return (
                <div key={item.id} className={`ymo-trailer-card rounded-lg border p-2.5 bg-card ${isHold ? "ymo-hold-pulse" : isOverdue ? "ymo-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="ymo-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.trailer}</span>
                      <span className={`ymo-type-tag text-[10px] px-1.5 py-0.5 rounded ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                      {item.hazmat && <span className="ymo-hazmat-badge text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold animate-pulse">HAZMAT</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`ymo-zone-tag text-[10px] px-1.5 py-0.5 rounded ${zoneColors[item.zone] || "bg-slate-100"}`}>{item.zone}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isHold ? <XCircle className="h-3 w-3 text-red-500" /> : item.dwell <= item.targetDwell ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Users className="h-3 w-3 opacity-40" />{item.driver} | {item.carrier}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.city}, {item.region} | Gate {item.gate}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Check-in: {item.checkin} | Dwell: <span className={item.dwell > item.targetDwell ? "text-red-600 font-semibold" : "text-foreground"}>{item.dwell}h</span></div>
                    <div className="flex items-center gap-1"><Gauge className="h-3 w-3 opacity-40" />{item.weight > 0 ? `${item.weight}T` : "Empty"} | Chassis: <span className={item.chassis === "Available" ? "text-emerald-600" : item.chassis === "Detached" ? "text-amber-600" : "text-foreground"}>{item.chassis}</span></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Target: <span className="font-bold">{item.targetDwell}h</span></div>
                    <div>Moves: <span className="font-medium">{item.moves}</span></div>
                    <div>Dwell %: <span className={`font-medium ${dwellPct <= 100 ? "text-emerald-600" : dwellPct <= 150 ? "text-amber-600" : "text-red-600"}`}>{dwellPct}%</span></div>
                    <div>{item.temp !== null ? `Temp: <span className="font-medium text-cyan-600">${item.temp}\u00b0C</span>` : `Priority: <span className="font-medium">${item.priority}</span>`}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "dwell" && (
          <div className="space-y-2">
            <div className="ymo-dwell-header rounded-lg border p-2 bg-amber-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-orange-600">{avgDwell}h</div><div className="text-[10px] opacity-50">Avg Dwell</div></div>
                <div><div className="text-lg font-bold text-red-600">{overTarget}</div><div className="text-[10px] opacity-50">Over Target</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.round(items.reduce((s, i) => s + i.dwell, 0) / items.filter(i => i.status !== "Hold").length * 10) / 10}h</div><div className="text-[10px] opacity-50">Active Avg</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{totalMoves}</div><div className="text-[10px] opacity-50">Total Moves</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.dwell - a.dwell).map(item => {
              const dwellPct = Math.min(Math.round(item.dwell / item.targetDwell * 100), 200)
              const barWidth = Math.min(dwellPct, 100)
              return (
              <div key={item.id} className={`ymo-dwell-row rounded-lg border p-2 bg-card ${item.status === "Hold" && item.hazmat ? "ymo-hold-pulse" : item.dwell > item.targetDwell * 2 ? "ymo-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.trailer}</span>
                    <span className="text-[10px] text-muted-foreground">{item.zone}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.status === "Hold" ? "text-red-600" : dwellPct <= 100 ? "text-emerald-600" : dwellPct <= 150 ? "text-amber-600" : "text-red-600"}`}>{item.dwell}h / {item.targetDwell}h</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1 relative">
                  <div className={`h-full rounded-full ${dwellPct <= 100 ? "bg-emerald-500" : dwellPct <= 150 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${barWidth}%` }} />
                  {dwellPct > 100 && <div className="absolute top-0 left-1/2 h-full w-px bg-foreground/30" />}
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Carrier: <span className="font-medium">{item.carrier}</span></div>
                  <div>Type: <span className="font-medium">{item.type}</span></div>
                  <div>Moves: <span className="font-medium">{item.moves}</span></div>
                  <div>Status: <span className={`font-medium ${statusColors[item.status] || "text-foreground"}`}>{item.status}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}

        {view === "zones" && (
          <div className="space-y-2">
            <div className="ymo-zone-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.zone.includes("Staging") || i.zone === "Cross-Dock").length}</div><div className="text-[10px] opacity-50">Active Zones</div></div>
                <div><div className="text-lg font-bold text-red-600">{onHold}</div><div className="text-[10px] opacity-50">On Hold</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.chassis === "Available").length}</div><div className="text-[10px] opacity-50">Chassis Free</div></div>
                <div><div className="text-lg font-bold text-orange-600">{items.filter(i => i.hazmat).length}</div><div className="text-[10px] opacity-50">Hazmat</div></div>
              </div>
            </div>
            {([...new Set(items.map(i => i.zone))] as string[]).map(zone => {
              const zoneItems = items.filter(i => i.zone === zone)
              const avgZoneDwell = Math.round(zoneItems.reduce((s, i) => s + i.dwell, 0) / zoneItems.length * 10) / 10
              return (
              <div key={zone} className="ymo-zone-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`ymo-zone-tag text-[10px] px-1.5 py-0.5 rounded ${zoneColors[zone] || "bg-slate-100"}`}>{zone}</span>
                    <span className="text-xs font-semibold">{zoneItems.length} trailers</span>
                  </div>
                  <span className={`text-xs font-bold ${avgZoneDwell <= 4 ? "text-emerald-600" : avgZoneDwell <= 10 ? "text-amber-600" : "text-red-600"}`}>{avgZoneDwell}h avg dwell</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${avgZoneDwell <= 4 ? "bg-emerald-500" : avgZoneDwell <= 10 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(avgZoneDwell / 20 * 100, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Types: <span className="font-medium">{zoneItems.map(i => i.type.split(" ")[0]).join(", ")}</span></div>
                  <div>Carriers: <span className="font-medium">{zoneItems.map(i => i.carrier).join(", ")}</span></div>
                  <div>Chassis: <span className="font-medium">{zoneItems.filter(i => i.chassis === "Available").length}/{zoneItems.length}</span></div>
                  <div>Moves: <span className="font-medium">{zoneItems.reduce((s, i) => s + i.moves, 0)}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
