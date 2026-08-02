"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin, Clock, CheckCircle, AlertTriangle,
  Navigation, Phone, Truck, Bike,
  Package, Star, IndianRupee,
  Route, Shield
} from "lucide-react"

const raw = [
  { id: "LMD-01", awb: "AWB-IN-78234", rider: "Arun Mehta", phone: "+91 98765 43210", partner: "Delhivery", zone: "Mumbai South", origin: "Mumbai DC-1", dest: "Colaba 400001", vehicle: "Bike", items: 3, weight: 2.5, distance: 12.4, status: "In Transit", attempt: 1, maxAttempts: 3, sla: "02:30 PM", eta: "02:15 PM", pod: false, cashOnDelivery: 1499, customerRating: 0, startTime: "01:45 PM" },
  { id: "LMD-02", awb: "AWB-IN-78235", rider: "Priya Nair", phone: "+91 87654 32109", partner: "BlueDart", zone: "Delhi NCR", origin: "Delhi DC-2", dest: "Connaught Place 110001", vehicle: "Van", items: 1, weight: 8.2, distance: 18.7, status: "Delivered", attempt: 1, maxAttempts: 3, sla: "11:00 AM", eta: "\u2014", pod: true, cashOnDelivery: 0, customerRating: 5, startTime: "09:30 AM" },
  { id: "LMD-03", awb: "AWB-IN-78236", rider: "Raju K.", phone: "+91 76543 21098", partner: "Ekart Logistics", zone: "Bengaluru East", origin: "Bengaluru DC-3", dest: "Whitefield 560066", vehicle: "Bike", items: 5, weight: 1.8, distance: 8.2, status: "Failed Attempt", attempt: 1, maxAttempts: 3, sla: "01:00 PM", eta: "03:00 PM", pod: false, cashOnDelivery: 2499, customerRating: 0, startTime: "11:00 AM" },
  { id: "LMD-04", awb: "AWB-IN-78237", rider: "Sneha Gupta", phone: "+91 65432 10987", partner: "Xpressbee", zone: "Hyderabad Central", origin: "Hyderabad DC-4", dest: "Banjara Hills 500034", vehicle: "Bike", items: 2, weight: 0.9, distance: 6.5, status: "Delivered", attempt: 1, maxAttempts: 2, sla: "12:00 PM", eta: "\u2014", pod: true, cashOnDelivery: 0, customerRating: 4, startTime: "10:15 AM" },
  { id: "LMD-05", awb: "AWB-IN-78238", rider: "Vikram S.", phone: "+91 54321 09876", partner: "DTDC", zone: "Chennai North", origin: "Chennai DC-6", dest: "T Nagar 600017", vehicle: "Van", items: 8, weight: 12.5, distance: 15.3, status: "Out for Delivery", attempt: 1, maxAttempts: 3, sla: "03:00 PM", eta: "02:45 PM", pod: false, cashOnDelivery: 5999, customerRating: 0, startTime: "01:30 PM" },
  { id: "LMD-06", awb: "AWB-IN-78239", rider: "Deepak Y.", phone: "+91 43210 98765", partner: "Rivigo", zone: "Kolkata South", origin: "Kolkata DC-5", dest: "Salt Lake 700091", vehicle: "Truck", items: 12, weight: 45.0, distance: 22.1, status: "Delayed", attempt: 1, maxAttempts: 2, sla: "01:00 PM", eta: "04:30 PM", pod: false, cashOnDelivery: 0, customerRating: 0, startTime: "09:00 AM" },
  { id: "LMD-07", awb: "AWB-IN-78240", rider: "Meena R.", phone: "+91 32109 87654", partner: "Shadowfax", zone: "Pune West", origin: "Mumbai DC-1", dest: "Kothrud 411038", vehicle: "Bike", items: 1, weight: 0.5, distance: 9.8, status: "Delivered", attempt: 1, maxAttempts: 3, sla: "11:30 AM", eta: "\u2014", pod: true, cashOnDelivery: 799, customerRating: 5, startTime: "10:00 AM" },
  { id: "LMD-08", awb: "AWB-IN-78241", rider: "Suresh M.", phone: "+91 21098 76543", partner: "Ecom Express", zone: "Delhi Faridabad", origin: "Delhi DC-2", dest: "Sector 15 121007", vehicle: "Van", items: 4, weight: 5.3, distance: 32.5, status: "Rerouted", attempt: 1, maxAttempts: 3, sla: "02:00 PM", eta: "03:30 PM", pod: false, cashOnDelivery: 1899, customerRating: 0, startTime: "10:45 AM" },
  { id: "LMD-09", awb: "AWB-IN-78242", rider: "Kavitha P.", phone: "+91 10987 65432", partner: "Delhivery", zone: "Bengaluru South", origin: "Bengaluru DC-3", dest: "JP Nagar 560078", vehicle: "Bike", items: 2, weight: 1.2, distance: 7.1, status: "Delivered", attempt: 2, maxAttempts: 3, sla: "12:30 PM", eta: "\u2014", pod: true, cashOnDelivery: 450, customerRating: 3, startTime: "08:00 AM" },
  { id: "LMD-10", awb: "AWB-IN-78243", rider: "Ramesh D.", phone: "+91 99887 76655", partner: "Amazon ATS", zone: "Hyderabad HITEC", origin: "Hyderabad DC-4", dest: "Gachibowli 500032", vehicle: "Van", items: 6, weight: 9.8, distance: 14.2, status: "In Transit", attempt: 1, maxAttempts: 3, sla: "04:00 PM", eta: "03:45 PM", pod: false, cashOnDelivery: 3200, customerRating: 0, startTime: "02:30 PM" },
]

interface LMDItem {
  id: string; awb: string; rider: string; phone: string; partner: string
  zone: string; origin: string; dest: string; vehicle: string; items: number
  weight: number; distance: number; status: string; attempt: number
  maxAttempts: number; sla: string; eta: string; pod: boolean
  cashOnDelivery: number; customerRating: number; startTime: string
}

const items: LMDItem[] = raw.map((r: any) => ({
  id: r.id, awb: r.awb, rider: r.rider, phone: r.phone, partner: r.partner,
  zone: r.zone, origin: r.origin, dest: r.dest, vehicle: r.vehicle,
  items: r.items, weight: r.weight, distance: r.distance, status: r.status,
  attempt: r.attempt, maxAttempts: r.maxAttempts, sla: r.sla, eta: r.eta,
  pod: r.pod, cashOnDelivery: r.cashOnDelivery, customerRating: r.customerRating,
  startTime: r.startTime,
}))

const statusColors: Record<string, string> = {
  "Delivered": "text-emerald-600", "In Transit": "text-blue-600",
  "Out for Delivery": "text-indigo-600", "Failed Attempt": "text-red-600 font-semibold",
  "Delayed": "text-red-600 font-semibold", "Rerouted": "text-amber-600 font-semibold",
}
const partnerNames = [...new Set(items.map(i => i.partner))]

type Rec = any
type FV = Record<string, string>
type VT = "shipments" | "partners" | "performance"

function fmtINR(n: number) { if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`; if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`; return `\u20b9${(n / 1000).toFixed(1)}K` }

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`lmd-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function LastMileDeliveryPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("shipments")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const delivered = items.filter(i => i.status === "Delivered").length
  const inTransit = items.filter(i => i.status === "In Transit" || i.status === "Out for Delivery").length
  const failed = items.filter(i => i.status === "Failed Attempt").length
  const delayed = items.filter(i => i.status === "Delayed").length
  const totalCOD = items.reduce((s, i) => s + i.cashOnDelivery, 0)
  const avgRating = items.filter(i => i.customerRating > 0).reduce((s, i) => s + i.customerRating, 0) / Math.max(items.filter(i => i.customerRating > 0).length, 1)
  const firstAttemptRate = ((delivered / items.filter(i => i.attempt === 1 && (i.status === "Delivered" || i.status === "Failed Attempt")).length) * 100).toFixed(0)
  const totalDist = items.reduce((s, i) => s + i.distance, 0)

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: Star, title: "Rating", desc: `${avgRating.toFixed(1)} avg customer rating`, accent: "text-amber-500" },
    { icon: Package, title: "Active", desc: `${inTransit} in transit / out for delivery`, accent: "text-blue-500" },
    { icon: IndianRupee, title: "COD", desc: `${fmtINR(totalCOD)} cash on delivery`, accent: "text-emerald-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Delayed").map(i => ({ id: i.id, msg: `${i.rider} (${i.partner}): ${i.dest} delayed — ETA ${i.eta}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Failed Attempt").map(i => ({ id: i.id, msg: `${i.rider}: Attempt ${i.attempt}/${i.maxAttempts} failed — ${i.dest}`, severity: "warning" as const })),
    ...items.filter(i => i.status === "Rerouted").map(i => ({ id: i.id, msg: `${i.rider} (${i.partner}) rerouted to ${i.dest}`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center"><Navigation className="h-4 w-4 text-emerald-600" /></div>
            <div><h3 className="text-sm font-bold">Last-Mile Delivery</h3><p className="text-xs opacity-60">{items.length} shipments | {totalDist.toFixed(0)}km total</p></div>
          </div>
          <div className="flex gap-1">
            {(["shipments", "partners", "performance"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "shipments" ? "Shipments" : v === "partners" ? "Partners" : "Performance"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Delivered", String(delivered), CheckCircle, "bg-emerald-50/50")}
          {statCard("In Transit", String(inTransit), Truck, "bg-blue-50/50")}
          {statCard("Failed", String(failed + delayed), AlertTriangle, "bg-red-50/50")}
          {statCard("COD", fmtINR(totalCOD), IndianRupee, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {partnerNames.map(p => {
            const active = activeFilters.partner === p
            return <span key={p} onClick={() => toggle("partner", active ? undefined : p)} className={`lmd-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{p.split(" ")[0]}</span>
          })}
          {activeFilters.partner && <span onClick={() => toggle("partner", undefined)} className="lmd-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="lmd-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="lmd-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Delivery Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`lmd-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "shipments" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isFailed = item.status === "Failed Attempt"
              const isDelayed = item.status === "Delayed"
              const VIcon = item.vehicle === "Bike" ? Bike : item.vehicle === "Van" ? Truck : Truck
              return (
                <div key={item.id} className={`lmd-shipment-card rounded-lg border p-2.5 bg-card ${isFailed ? "lmd-failed-pulse" : isDelayed ? "lmd-delayed-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="lmd-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">{item.id}</span>
                      <div className="flex items-center gap-1.5">
                        <VIcon className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-xs font-semibold">{item.rider}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.pod && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">POD</span>}
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Route className="h-3 w-3 opacity-40" />{item.origin} \u2192 {item.dest}</div>
                    <div className="flex items-center gap-1"><Navigation className="h-3 w-3 opacity-40" />{item.partner} | {item.zone}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.distance}km | {item.items} items | {item.weight}kg</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />SLA: {item.sla} | {item.eta !== "\u2014" ? `ETA: ${item.eta}` : `Done`}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Attempt: <span className="font-medium text-foreground">{item.attempt}/{item.maxAttempts}</span></div>
                    <div className="flex items-center gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className={`h-2.5 w-2.5 ${s <= item.customerRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />)}</div>
                    <div>COD: <span className="font-medium text-foreground">{item.cashOnDelivery > 0 ? fmtINR(item.cashOnDelivery) : "Prepaid"}</span></div>
                    <div className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" /><span className="font-mono text-[9px]">{item.phone.slice(-10)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "partners" && (
          <div className="space-y-2">
            {partnerNames.map(partner => {
              const pItems = items.filter(i => i.partner === partner)
              const pDelivered = pItems.filter(i => i.status === "Delivered").length
              const pFailed = pItems.filter(i => i.status === "Failed Attempt" || i.status === "Delayed").length
              const pCOD = pItems.reduce((s, i) => s + i.cashOnDelivery, 0)
              const pDist = pItems.reduce((s, i) => s + i.distance, 0)
              const pRating = pItems.filter(i => i.customerRating > 0).reduce((s, i) => s + i.customerRating, 0) / Math.max(pItems.filter(i => i.customerRating > 0).length, 1)
              const pActive = pItems.filter(i => i.status === "In Transit" || i.status === "Out for Delivery").length
              return (
                <div key={partner} className="lmd-partner-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" /><span className="text-xs font-semibold">{partner}</span></div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-emerald-600">{pDelivered} delivered</span>
                      <span className="text-blue-600">{pActive} active</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Failed: <span className={`font-medium ${pFailed > 0 ? "text-red-600" : "text-foreground"}`}>{pFailed}</span></div>
                    <div>Distance: <span className="font-medium text-foreground">{pDist.toFixed(0)}km</span></div>
                    <div>COD: <span className="font-medium text-foreground">{fmtINR(pCOD)}</span></div>
                    <div className="flex items-center gap-0.5">Rating: <span className="font-medium">{pRating.toFixed(1)}</span>{[1,2,3,4,5].map(s => <Star key={s} className={`h-2.5 w-2.5 ${s <= Math.round(pRating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "performance" && (
          <div className="space-y-2">
            <div className="lmd-perf-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{delivered}/{items.length}</div><div className="text-[10px] opacity-50">Delivered</div></div>
                <div><div className="text-lg font-bold text-amber-600">{avgRating.toFixed(1)}</div><div className="text-[10px] opacity-50">Avg Rating</div></div>
                <div><div className="text-lg font-bold text-blue-600">{totalDist.toFixed(0)}km</div><div className="text-[10px] opacity-50">Total Distance</div></div>
                <div><div className="text-lg font-bold text-violet-600">{items.filter(i => i.attempt > 1).length}</div><div className="text-[10px] opacity-50">Re-attempts</div></div>
              </div>
            </div>
            {items.filter(i => i.status === "Delivered").sort((a, b) => b.distance - a.distance).map(item => (
              <div key={item.id} className="lmd-perf-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.rider}</span>
                    <span className="text-[10px] opacity-50">{item.partner}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px]">{item.distance}km</span>
                    {[1,2,3,4,5].map(s => <Star key={s} className={`h-2.5 w-2.5 ${s <= item.customerRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                  <div>Zone: <span className="font-medium text-foreground">{item.zone}</span></div>
                  <div>Items: <span className="font-medium text-foreground">{item.items}</span></div>
                  <div>Attempt: <span className="font-medium text-foreground">{item.attempt}/{item.maxAttempts}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
