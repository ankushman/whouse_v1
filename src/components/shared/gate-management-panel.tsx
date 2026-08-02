"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DoorOpen, Truck, AlertTriangle,
  CheckCircle,
  MapPin, Timer, BadgeCheck
} from "lucide-react"

const raw = [
  { id: "GMT-01", gate: "Gate 1", vehicle: "MH-12-AB-1234", driver: "Ravi Kumar", carrier: "TCI Express", type: "Inbound", purpose: "Delivery", dc: "Mumbai DC-1", loadType: "Palletized", weight: 8500, pkgs: 120, status: "Processing", checkIn: "08:12", checkOut: "\u2014", dock: "D-01", sealVerified: true, docStatus: "Verified", waitTime: 5 },
  { id: "GMT-02", gate: "Gate 2", vehicle: "DL-08-CD-5678", driver: "Manoj Sharma", carrier: "Delhivery", type: "Outbound", purpose: "Pickup", dc: "Delhi DC-2", loadType: "Loose", weight: 4200, pkgs: 85, status: "Completed", checkIn: "07:45", checkOut: "08:30", dock: "D-05", sealVerified: true, docStatus: "Verified", waitTime: 3 },
  { id: "GMT-03", gate: "Gate 3", vehicle: "KA-05-EF-9012", driver: "Suresh Babu", carrier: "Ekart Logistics", type: "Inbound", purpose: "Return Pickup", dc: "Bengaluru DC-3", loadType: "Boxed", weight: 2100, pkgs: 45, status: "Queued", checkIn: "08:30", checkOut: "\u2014", dock: "\u2014", sealVerified: false, docStatus: "Pending", waitTime: 15 },
  { id: "GMT-04", gate: "Gate 1", vehicle: "TS-08-GH-3456", driver: "Krishna Reddy", carrier: "Rivigo", type: "Inbound", purpose: "Delivery", dc: "Hyderabad DC-4", loadType: "Container", weight: 18000, pkgs: 240, status: "Processing", checkIn: "08:05", checkOut: "\u2014", dock: "D-03", sealVerified: true, docStatus: "Under Review", waitTime: 8 },
  { id: "GMT-05", gate: "Gate 4", vehicle: "WB-06-IJ-7890", driver: "Amit Das", carrier: "BlueDart", type: "Outbound", purpose: "Express Pickup", dc: "Kolkata DC-5", loadType: "Palletized", weight: 1500, pkgs: 35, status: "Rejected", checkIn: "07:58", checkOut: "08:02", dock: "\u2014", sealVerified: false, docStatus: "Invalid", waitTime: 2 },
  { id: "GMT-06", gate: "Gate 2", vehicle: "TN-09-KL-2345", driver: "Murugan V.", carrier: "Safexpress", type: "Inbound", purpose: "Cross-Dock", dc: "Chennai DC-6", loadType: "Palletized", weight: 12000, pkgs: 180, status: "Processing", checkIn: "08:20", checkOut: "\u2014", dock: "D-02", sealVerified: true, docStatus: "Verified", waitTime: 6 },
  { id: "GMT-07", gate: "Gate 3", vehicle: "GJ-01-MN-6789", driver: "Prakash Patel", carrier: "Xpressbee", type: "Outbound", purpose: "Last Mile", dc: "Mumbai DC-1", loadType: "Sorted", weight: 3800, pkgs: 220, status: "Completed", checkIn: "06:30", checkOut: "07:15", dock: "D-08", sealVerified: true, docStatus: "Verified", waitTime: 4 },
  { id: "GMT-08", gate: "Gate 5", vehicle: "UP-78-OP-0123", driver: "Anil Yadav", carrier: "DTDC", type: "Inbound", purpose: "Delivery", dc: "Delhi DC-2", loadType: "Loose", weight: 5500, pkgs: 95, status: "Security Hold", checkIn: "08:00", checkOut: "\u2014", dock: "D-06", sealVerified: false, docStatus: "Under Review", waitTime: 22 },
  { id: "GMT-09", gate: "Gate 1", vehicle: "HR-26-QR-4567", driver: "Jaspreet Singh", carrier: "DHL Supply Chain", type: "Inbound", purpose: "Scheduled Delivery", dc: "Kolkata DC-5", loadType: "Container", weight: 22000, pkgs: 310, status: "Processing", checkIn: "08:45", checkOut: "\u2014", dock: "D-04", sealVerified: true, docStatus: "Verified", waitTime: 3 },
  { id: "GMT-10", gate: "Gate 4", vehicle: "RJ-14-ST-8901", driver: "Rajesh Gupta", carrier: "Snowman Logistics", type: "Outbound", purpose: "Cold Chain Pickup", dc: "Chennai DC-6", loadType: "Refrigerated", weight: 9500, pkgs: 68, status: "Processing", checkIn: "08:15", checkOut: "\u2014", dock: "D-07", sealVerified: true, docStatus: "Verified", waitTime: 10 },
]

interface GateItem {
  id: string; gate: string; vehicle: string; driver: string; carrier: string
  type: string; purpose: string; dc: string; loadType: string; weight: number
  pkgs: number; status: string; checkIn: string; checkOut: string
  dock: string; sealVerified: boolean; docStatus: string; waitTime: number
}

const items: GateItem[] = raw.map((r: any) => ({
  id: r.id, gate: r.gate, vehicle: r.vehicle, driver: r.driver,
  carrier: r.carrier, type: r.type, purpose: r.purpose, dc: r.dc,
  loadType: r.loadType, weight: r.weight, pkgs: r.pkgs, status: r.status,
  checkIn: r.checkIn, checkOut: r.checkOut, dock: r.dock,
  sealVerified: r.sealVerified, docStatus: r.docStatus, waitTime: r.waitTime,
}))

const statusColors: Record<string, string> = {
  "Completed": "text-emerald-600", "Processing": "text-blue-600",
  "Queued": "text-muted-foreground", "Rejected": "text-red-600 font-semibold",
  "Security Hold": "text-orange-600 font-semibold",
}
const docColors: Record<string, string> = {
  "Verified": "text-emerald-600", "Pending": "text-amber-600",
  "Under Review": "text-blue-600", "Invalid": "text-red-600 font-semibold",
}
const gateNames = [...new Set(items.map(i => i.gate))]

type Rec = any
type FV = Record<string, string>
type VT = "vehicles" | "gates" | "throughput"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`gmt-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function GateManagementPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("vehicles")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const processed = items.filter(i => i.status === "Completed").length
  const processing = items.filter(i => i.status === "Processing").length
  const rejected = items.filter(i => i.status === "Rejected").length
  const holdItems = items.filter(i => i.status === "Security Hold")
  const avgWait = (items.reduce((s, i) => s + i.waitTime, 0) / items.length).toFixed(0)
  const inbound = items.filter(i => i.type === "Inbound").length
  const outbound = items.filter(i => i.type === "Outbound").length

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: DoorOpen, title: "Processing", desc: `${processing} vehicles at gates now`, accent: "text-blue-500" },
    { icon: AlertTriangle, title: "Issues", desc: `${rejected + holdItems.length} (rejected + hold)`, accent: "text-red-500" },
    { icon: Timer, title: "Avg Wait", desc: `${avgWait} min check-in to processing`, accent: "text-amber-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Rejected").map(i => ({ id: i.id, msg: `${i.vehicle} (${i.carrier}) rejected — invalid docs`, severity: "critical" as const })),
    ...holdItems.map(i => ({ id: i.id, msg: `${i.vehicle}: Security hold — ${i.waitTime}min waiting`, severity: "warning" as const })),
    ...items.filter(i => i.docStatus === "Pending").map(i => ({ id: i.id, msg: `${i.vehicle}: Documents pending verification`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center"><DoorOpen className="h-4 w-4 text-slate-600" /></div>
            <div><h3 className="text-sm font-bold">Gate Management</h3><p className="text-xs opacity-60">{items.length} vehicles | IN {inbound} / OUT {outbound}</p></div>
          </div>
          <div className="flex gap-1">
            {(["vehicles", "gates", "throughput"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "vehicles" ? "Vehicles" : v === "gates" ? "Gates" : "Throughput"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Processed", String(processed), CheckCircle, "bg-slate-50/50")}
          {statCard("Active", String(processing), Truck, "bg-blue-50/50")}
          {statCard("Rejected", String(rejected), AlertTriangle, "bg-red-50/50")}
          {statCard("Avg Wait", `${avgWait}min`, Timer, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {gateNames.map(g => {
            const active = activeFilters.gate === g
            return <span key={g} onClick={() => toggle("gate", active ? undefined : g)} className={`gmt-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{g}</span>
          })}
          {activeFilters.gate && <span onClick={() => toggle("gate", undefined)} className="gmt-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="gmt-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="gmt-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Gate Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`gmt-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "vehicles" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isRejected = item.status === "Rejected"
              const isHold = item.status === "Security Hold"
              return (
                <div key={item.id} className={`gmt-vehicle-card rounded-lg border p-2.5 bg-card ${isRejected ? "gmt-rejected-pulse" : isHold ? "gmt-hold-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="gmt-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">{item.id}</span>
                      <div className="flex items-center gap-1.5">
                        <Truck className={`h-3.5 w-3.5 ${item.type === "Inbound" ? "text-blue-500" : "text-emerald-500"}`} />
                        <span className="text-xs font-semibold">{item.vehicle}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`gmt-type-tag text-[10px] px-1.5 py-0.5 rounded ${item.type === "Inbound" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>{item.type}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><UserCheck className="h-3 w-3 opacity-40" />{item.driver} ({item.carrier})</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.dc} — {item.purpose}</div>
                    <div className="flex items-center gap-1"><PackageSearch className="h-3 w-3 opacity-40" />{item.loadType} | {(item.weight / 1000).toFixed(1)}T | {item.pkgs} pkgs</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />{item.checkIn} {item.checkOut !== "\u2014" ? `\u2192 ${item.checkOut}` : ""}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground">
                    <div>Gate: <span className="font-medium text-foreground">{item.gate}</span></div>
                    <div>Doc: <span className={`font-medium ${docColors[item.docStatus] || ""}`}>{item.docStatus}</span></div>
                    <div className="flex items-center gap-1">
                      {item.sealVerified ? <BadgeCheck className="h-3 w-3 text-emerald-500" /> : <span className="text-red-400">\u2717</span>}
                      <span>Seal: <span className="font-medium">{item.sealVerified ? "OK" : "Fail"}</span></span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "gates" && (
          <div className="space-y-2">
            {gateNames.sort().map(gate => {
              const gateItems = items.filter(i => i.gate === gate)
              const gateActive = gateItems.filter(i => i.status === "Processing").length
              const gateDone = gateItems.filter(i => i.status === "Completed").length
              return (
                <div key={gate} className="gmt-gate-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><DoorOpen className="h-4 w-4 text-slate-500" /><span className="text-xs font-semibold">{gate}</span></div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-blue-600">{gateActive} active</span>
                      <span className="text-emerald-600">{gateDone} done</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    {gateItems.map(gi => (
                      <div key={gi.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{gi.id}</span><Truck className={`h-3 w-3 ${gi.type === "Inbound" ? "text-blue-400" : "text-emerald-400"}`} />{gi.vehicle} <span className="opacity-40">{gi.carrier}</span></span>
                        <span className={statusColors[gi.status] || ""}>{gi.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "throughput" && (
          <div className="space-y-2">
            <div className="gmt-thru-header rounded-lg border p-2 bg-slate-50/50">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{inbound}</div><div className="text-[10px] opacity-50">Inbound Today</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{outbound}</div><div className="text-[10px] opacity-50">Outbound Today</div></div>
                <div><div className="text-lg font-bold text-amber-600">{avgWait}min</div><div className="text-[10px] opacity-50">Avg Wait Time</div></div>
              </div>
            </div>
            {items.filter(i => i.status === "Completed").sort((a, b) => b.waitTime - a.waitTime).map(item => {
              const dur = item.checkOut !== "\u2014" ? `${item.checkIn} \u2192 ${item.checkOut}` : item.checkIn
              return (
                <div key={item.id} className="gmt-thru-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Truck className={`h-3.5 w-3.5 ${item.type === "Inbound" ? "text-blue-400" : "text-emerald-400"}`} />
                      <span className="text-xs font-semibold">{item.vehicle}</span>
                      <span className="text-[10px] opacity-50">{item.carrier}</span>
                    </div>
                    <span className="text-xs font-mono font-bold">{item.waitTime}min wait</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground">
                    <div>Time: <span className="font-medium text-foreground">{dur}</span></div>
                    <div>Dock: <span className="font-medium text-foreground">{item.dock}</span></div>
                    <div>Load: <span className="font-medium text-foreground">{item.loadType}</span></div>
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
