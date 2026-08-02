"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  MapPin, Truck, Clock, AlertTriangle, CheckCircle, TrendingUp, Navigation, Globe
} from "lucide-react"

const raw = [
  { id: "SVS-01", po: "PO-28471", carrier: "Maersk Line", mode: "FCL Ocean", origin: "Nhava Sheva", dest: "Rotterdam", etd: "02 Aug 06:00", eta: "18 Aug 14:00", atd: "02 Aug 05:30", ata: "18 Aug 13:45", milestones: 7, completed: 7, value: 4850000, weight: 18500, pkgs: 240, vessel: "MV Emerald Star", bl: "MAEU-IN-45812", status: "Delivered", exception: false, temp: null, customs: "Cleared", customer: "Royal Dutch Retail", region: "International" },
  { id: "SVS-02", po: "PO-55219", carrier: "BlueDart", mode: "Air Express", origin: "IGI Airport Delhi", dest: "Dubai DXB", etd: "03 Aug 09:00", eta: "03 Aug 18:00", atd: "03 Aug 08:45", ata: null, milestones: 5, completed: 4, value: 2450000, weight: 850, pkgs: 12, vessel: "BA-1042", bl: "BD-IN-77831", status: "In Transit", exception: false, temp: null, customs: "Pending", customer: "Al Mulla Electronics", region: "International" },
  { id: "SVS-03", po: "PO-11028", carrier: "Rivigo", mode: "FTL Road", origin: "Mumbai DC", dest: "Delhi NDC", etd: "02 Aug 22:00", eta: "04 Aug 08:00", atd: "03 Aug 02:15", ata: null, milestones: 4, completed: 2, value: 3200000, weight: 12000, pkgs: 180, vessel: "RIV-TRK-5521", bl: "RIV-IN-22908", status: "In Transit", exception: false, temp: null, customs: "N/A", customer: "Reliance Fresh", region: "West" },
  { id: "SVS-04", po: "PO-88346", carrier: "ColdStar Logistics", mode: "Reefer Road", origin: "Chennai Port", dest: "Kolkata DC", etd: "01 Aug 05:00", eta: "03 Aug 06:00", atd: "01 Aug 04:50", ata: null, milestones: 5, completed: 5, value: 890000, weight: 4200, pkgs: 65, vessel: "CSL-REF-2210", bl: "CSL-IN-45180", status: "Delayed", exception: true, temp: "-18\u00b0C", customs: "N/A", customer: "Metro Dairy Ltd", region: "South" },
  { id: "SVS-05", po: "PO-22903", carrier: "Adani Logistics", mode: "Rail Freight", origin: "Mundra Port", dest: "IGI Airport Cargo", etd: "04 Aug 10:00", eta: "06 Aug 16:00", atd: null, ata: null, milestones: 4, completed: 0, value: 6700000, weight: 28000, pkgs: 420, vessel: "IND-RAIL-8841", bl: "ADI-IN-66312", status: "Pending", exception: false, temp: null, customs: "Pending", customer: "Adani Wilmar", region: "West" },
  { id: "SVS-06", po: "PO-44557", carrier: "XpressBees", mode: "PTL Road", origin: "Bengaluru DC3", dest: "Hyderabad DC5", etd: "02 Aug 14:00", eta: "03 Aug 10:00", atd: "02 Aug 14:20", ata: "03 Aug 09:40", milestones: 4, completed: 4, value: 450000, weight: 1800, pkgs: 42, vessel: "XBE-PTL-3321", bl: "XBE-IN-11847", status: "Delivered", exception: false, temp: null, customs: "N/A", customer: "PharmEasy", region: "South" },
  { id: "SVS-07", po: "PO-66784", carrier: "Ecom Express", mode: "Surface Express", origin: "Pune DC6", dest: "Jaipur DC9", etd: "01 Aug 12:00", eta: "04 Aug 12:00", atd: "01 Aug 11:30", ata: null, milestones: 5, completed: 3, value: 780000, weight: 3200, pkgs: 95, vessel: "ECM-SRF-7712", bl: "ECM-IN-55920", status: "In Transit", exception: false, temp: null, customs: "N/A", customer: "JioMart", region: "West" },
  { id: "SVS-08", po: "PO-33125", carrier: "CMA CGM", mode: "LCL Ocean", origin: "Chennai Port", dest: "Hamburg", etd: "05 Aug 08:00", eta: "22 Aug 12:00", atd: null, ata: null, milestones: 6, completed: 0, value: 12500000, weight: 8500, pkgs: 85, vessel: "CMA Marco Polo", bl: "CMA-IN-33714", status: "Pending", exception: false, temp: null, customs: "Pending", customer: "Bosch GmbH", region: "International" },
  { id: "SVS-09", po: "PO-77891", carrier: "TCI Express", mode: "Express Road", origin: "Kolkata DC7", dest: "Guwahati Hub", etd: "02 Aug 08:00", eta: "03 Aug 20:00", atd: "02 Aug 07:45", ata: null, milestones: 4, completed: 2, value: 1200000, weight: 5600, pkgs: 110, vessel: "TCI-EXP-2291", bl: "TCI-IN-88162", status: "In Transit", exception: true, temp: null, customs: "N/A", customer: "Dabur India", region: "East" },
  { id: "SVS-10", po: "PO-99018", carrier: "Snowman Logistics", mode: "Cold Chain Air", origin: "IGI Airport Delhi", dest: "London Heathrow", etd: "06 Aug 02:00", eta: "06 Aug 22:00", atd: null, ata: null, milestones: 6, completed: 0, value: 8200000, weight: 1200, pkgs: 24, vessel: "AI-102 Cargo", bl: "SNW-IN-44721", status: "Pending", exception: false, temp: "-25\u00b0C", customs: "Pending", customer: "Serum Institute", region: "International" },
]

interface SVSItem {
  id: string; po: string; carrier: string; mode: string; origin: string; dest: string
  etd: string; eta: string; atd: string | null; ata: string | null
  milestones: number; completed: number; value: number; weight: number; pkgs: number
  vessel: string; bl: string; status: string; exception: boolean; temp: string | null
  customs: string; customer: string; region: string
}

type Rec = any
const items: SVSItem[] = raw.map((r: Rec) => ({
  id: r.id, po: r.po, carrier: r.carrier, mode: r.mode, origin: r.origin, dest: r.dest,
  etd: r.etd, eta: r.eta, atd: r.atd, ata: r.ata,
  milestones: r.milestones, completed: r.completed, value: r.value, weight: r.weight, pkgs: r.pkgs,
  vessel: r.vessel, bl: r.bl, status: r.status, exception: r.exception, temp: r.temp,
  customs: r.customs, customer: r.customer, region: r.region,
}))

const modeColors: Record<string, string> = {
  "FCL Ocean": "bg-blue-100 text-blue-700", "Air Express": "bg-purple-100 text-purple-700",
  "FTL Road": "bg-emerald-100 text-emerald-700", "Reefer Road": "bg-cyan-100 text-cyan-700",
  "Rail Freight": "bg-orange-100 text-orange-700", "PTL Road": "bg-teal-100 text-teal-700",
  "Surface Express": "bg-indigo-100 text-indigo-700", "LCL Ocean": "bg-sky-100 text-sky-700",
  "Express Road": "bg-lime-100 text-lime-700", "Cold Chain Air": "bg-violet-100 text-violet-700",
}

const statusColors: Record<string, string> = {
  "Delivered": "text-emerald-600 font-semibold", "In Transit": "text-blue-600 font-semibold",
  "Pending": "text-gray-500 font-semibold", "Delayed": "text-red-600 font-semibold", "At Risk": "text-orange-600 font-semibold",
}

const customsColors: Record<string, string> = {
  "Cleared": "bg-emerald-100 text-emerald-700", "Pending": "bg-amber-100 text-amber-700", "N/A": "bg-gray-100 text-gray-500",
}

const fmtINR = (v: number) => v >= 10000000 ? `\u20b9${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `\u20b9${(v / 100000).toFixed(1)}L` : `\u20b9${(v / 1000).toFixed(0)}K`

const ShipmentVisibilityPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"shipments" | "exceptions" | "carriers">("shipments")
  const filters = [
    { key: "mode", label: "Mode", options: ["FCL Ocean", "FTL Road", "Air Express", "Reefer Road", "Rail Freight", "PTL Road", "LCL Ocean", "Surface Express", "Express Road", "Cold Chain Air"] },
    { key: "status", label: "Status", options: ["Delivered", "In Transit", "Pending", "Delayed"] },
    { key: "region", label: "Region", options: ["International", "West", "South", "East", "North"] },
  ]

  const toggleFilter = (k: string, v: string) => setActiveFilters((p: Record<string, string>) => {
    const n = Object.assign({}, p)
    if (n[k] === v) { delete n[k] } else { n[k] = v }
    return n
  })

  const filtered = items.filter((r: Rec) => Object.entries(activeFilters).every(([k, v]) => r[k as keyof Rec] === v))

  const stats = [
    { label: "Active Shipments", value: items.filter(i => i.status === "In Transit").length.toString(), icon: Navigation, color: "bg-blue-50 text-blue-600" },
    { label: "On-Time Rate", value: "78%", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { label: "Exceptions", value: items.filter(i => i.exception).length.toString(), icon: AlertTriangle, color: "bg-red-50 text-red-600" },
    { label: "Total Value", value: fmtINR(items.reduce((a, b) => a + b.value, 0)), icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
  ]

  const insights = [
    { icon: AlertTriangle, title: "Temperature Alert", desc: "SVS-04 ColdStar reefer running 2\u00b0C above target at -16\u00b0C. ETA missed by 4h. Metro Dairy pharma shipment at risk.", color: "text-red-500" },
    { icon: Globe, title: "Ocean Lane Update", desc: "SVS-01 delivered on time via Nhava Sheva-Rotterdam. SVS-08 LCL Chennai-Hamburg pending carrier confirmation, \u20b91.25Cr at stake.", color: "text-blue-500" },
    { icon: Clock, title: "Road Congestion", desc: "SVS-09 Kolkata-Guwahati express delayed 6h due to NH27 flooding near Siliguri. Dabur India consignment rerouted via NH31.", color: "text-amber-500" },
  ]

  const carriers = [...new Set(items.map(i => i.carrier))].map(c => {
    const cItems = items.filter(i => i.carrier === c)
    return { name: c, count: cItems.length, delivered: cItems.filter(i => i.status === "Delivered").length, value: cItems.reduce((a, b) => a + b.value, 0), modes: [...new Set(cItems.map(i => i.mode))], regions: [...new Set(cItems.map(i => i.region))] }
  })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {stats.map((sc) => { const SIcon = sc.icon as React.ElementType; return (
          <div key={sc.label} className={`svs-stat-card rounded-lg border p-3 ${sc.color.split(" ")[0]}`}>
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
            className={`svs-filter-pill px-2 py-0.5 rounded-full text-xs border ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-muted-foreground/20"}`}>{opt}</button>
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
        {(["shipments", "exceptions", "carriers"] as const).map(v => (
          <Button key={v} size="sm" variant={view === v ? "default" : "outline"} onClick={() => setView(v)}
            className="text-xs h-7 capitalize">{v}</Button>
        ))}
      </div>

      {view === "shipments" && filtered.map(item => {
        const pct = Math.round((item.completed / item.milestones) * 100)
        const isDelayed = item.status === "Delayed"
        return (
          <div key={item.id} className={`svs-shipment-card rounded-lg border p-3 ${isDelayed ? "svs-delayed-pulse" : ""} ${item.exception && !isDelayed ? "svs-warning-border" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{item.id}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">{item.po}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${modeColors[item.mode] || "bg-gray-100 text-gray-600"}`}>{item.mode}</span>
                {item.exception && <span className="svs-alert-dot h-2 w-2 rounded-full bg-red-500 inline-block" />}
              </div>
              <span className={statusColors[item.status] || "text-gray-500"}>{item.status}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
              <MapPin className="h-3 w-3" /><span className="font-medium">{item.origin}</span>
              <span className="text-xs">&rarr;</span><span className="font-medium">{item.dest}</span>
              <span className="ml-2 text-muted-foreground/60">{item.region}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] mb-2">
              <span className="font-medium">{item.carrier}</span>
              <span className="text-muted-foreground">{item.vessel}</span>
              <span className="text-muted-foreground">{item.bl}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] mb-1.5">
              <span className="text-muted-foreground">Customer: <span className="font-medium text-foreground">{item.customer}</span></span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${customsColors[item.customs] || "bg-gray-100 text-gray-500"}`}>{item.customs === "N/A" ? "Domestic" : `Customs: ${item.customs}`}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] mb-2">
              <span>ETD: {item.etd}</span><span>ETA: {item.eta}</span>
              {item.temp && <span className="text-cyan-600 font-medium">{item.temp}</span>}
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-1.5">
              <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{item.completed}/{item.milestones} milestones ({pct}%)</span>
              <span>{fmtINR(item.value)} &middot; {(item.weight / 1000).toFixed(1)}T &middot; {item.pkgs} pkgs</span>
            </div>
          </div>
        )
      })}

      {view === "exceptions" && filtered.filter(i => i.exception).map(item => (
        <div key={item.id} className={`svs-exception-card rounded-lg border p-3 ${item.status === "Delayed" ? "svs-delayed-pulse" : "svs-warning-border"}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="font-mono text-xs font-bold">{item.id}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">Exception</span>
            </div>
            <span className={statusColors[item.status]}>{item.status}</span>
          </div>
          <div className="text-[11px] space-y-1 mb-2">
            <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{item.origin} &rarr; {item.dest}</div>
            <div><span className="font-medium">{item.carrier}</span> &middot; {item.mode} &middot; {item.vessel}</div>
            <div>Customer: <span className="font-medium">{item.customer}</span> &middot; {item.po}</div>
            {item.temp && <div className="text-cyan-600 font-medium">Temperature: {item.temp}</div>}
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mb-2">
            <div className="h-1.5 rounded-full bg-red-400 transition-all" style={{ width: `${Math.round((item.completed / item.milestones) * 100)}%` }} />
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span>ETD: {item.etd}</span><span>ETA: {item.eta}</span>
            <span>Value: {fmtINR(item.value)}</span><span>Weight: {(item.weight / 1000).toFixed(1)}T</span>
          </div>
        </div>
      ))}

      {view === "carriers" && carriers.sort((a, b) => b.value - a.value).map(c => {
        const onTime = c.count > 0 ? Math.round((c.delivered / c.count) * 100) : 0
        return (
          <div key={c.name} className="svs-carrier-row rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">{c.regions.join(", ")}</span>
              </div>
              <span className="text-xs font-semibold">{fmtINR(c.value)}</span>
            </div>
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {c.modes.map(m => <span key={m} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${modeColors[m] || "bg-gray-100 text-gray-600"}`}>{m}</span>)}
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-1">
              <div className="h-1.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${onTime}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{c.count} shipment{c.count > 1 ? "s" : ""}</span>
              <span>{c.delivered} delivered ({onTime}% on-time)</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { ShipmentVisibilityPanel }
