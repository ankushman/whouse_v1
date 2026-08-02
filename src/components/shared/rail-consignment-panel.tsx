"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrainFront, MapPin, AlertTriangle, PackageSearch,
  Package, Warehouse,
  IndianRupee, ClipboardList, Calendar, Tag
} from "lucide-react"

const raw = [
  { id: "RCN-01", consignment: "CN-2024-IR-4581", train: "12433 Rajdhani Exp", origin: "New Delhi", dest: "Mumbai Central", dc: "Nhava Sheva DC", wagon: "W-12A", commodity: "Auto Parts", status: "In Transit", departure: "28 Jul 22:00", eta: "29 Jul 11:00", weight: 42000, pkgs: 850, wagonType: "Box N", priority: "High", demurrage: 0, advance: 185000, trackPct: 72 },
  { id: "RCN-02", consignment: "CN-2024-IR-4582", train: "12309 Rajdhani Exp", origin: "Howrah Jn", dest: "New Delhi", dc: "Delhi DC", wagon: "W-08C", commodity: "FMCG", status: "Arrived", departure: "27 Jul 20:00", eta: "28 Jul 10:00", weight: 38000, pkgs: 1200, wagonType: "Box N", priority: "Critical", demurrage: 0, advance: 142000, trackPct: 100 },
  { id: "RCN-03", consignment: "CN-2024-IR-4583", train: "12621 Tamil Nadu Exp", origin: "Chennai Central", dest: "New Delhi", dc: "Delhi DC", wagon: "W-03B", commodity: "Textiles", status: "Loading", departure: "30 Jul 06:00", eta: "31 Jul 08:00", weight: 28000, pkgs: 620, wagonType: "Box HL", priority: "Medium", demurrage: 0, advance: 98000, trackPct: 0 },
  { id: "RCN-04", consignment: "CN-2024-IR-4584", train: "12259 Sealdah Duronto", origin: "Sealdah", dest: "H Nizamuddin", dc: "Kolkata DC", wagon: "W-15D", commodity: "Steel", status: "Demurrage", departure: "26 Jul 18:00", eta: "27 Jul 14:00", weight: 65000, pkgs: 180, wagonType: "Open BCN", priority: "Low", demurrage: 4200, advance: 210000, trackPct: 100 },
  { id: "RCN-05", consignment: "CN-2024-IR-4585", train: "12951 Mumbai Rajdhani", origin: "Hazrat Nizamuddin", dest: "Mumbai Central", dc: "Mumbai DC", wagon: "W-21A", commodity: "Electronics", status: "In Transit", departure: "29 Jul 04:00", eta: "29 Jul 16:00", weight: 22000, pkgs: 450, wagonType: "Box N", priority: "High", demurrage: 0, advance: 165000, trackPct: 45 },
  { id: "RCN-06", consignment: "CN-2024-IR-4586", train: "12627 Karnataka Exp", origin: "KSR Bengaluru", dest: "New Delhi", dc: "Bengaluru DC", wagon: "W-09F", commodity: "Pharma", status: "Customs Hold", departure: "27 Jul 15:00", eta: "29 Jul 06:00", weight: 15000, pkgs: 280, wagonType: "Box N", priority: "Critical", demurrage: 0, advance: 128000, trackPct: 85 },
  { id: "RCN-07", consignment: "CN-2024-IR-4587", train: "12301 Howrah Rajdhani", origin: "New Delhi", dest: "Sealdah", dc: "Kolkata DC", wagon: "W-06G", commodity: "Machinery", status: "Dispatched", departure: "29 Jul 16:00", eta: "30 Jul 06:00", weight: 48000, pkgs: 92, wagonType: "Flat BCN", priority: "Medium", demurrage: 0, advance: 195000, trackPct: 10 },
  { id: "RCN-08", consignment: "CN-2024-IR-4588", train: "12521 Rapti Sagar Exp", origin: "Gorakhpur Jn", dest: "Trivandrum Ctrl", dc: "Chennai DC", wagon: "W-18E", commodity: "Spices", status: "In Transit", departure: "28 Jul 08:00", eta: "30 Jul 12:00", weight: 32000, pkgs: 560, wagonType: "Box N", priority: "Medium", demurrage: 0, advance: 156000, trackPct: 38 },
  { id: "RCN-09", consignment: "CN-2024-IR-4589", train: "12611 Garib Rath", origin: "Chennai Egmore", dest: "Hazrat Nizamuddin", dc: "Chennai DC", wagon: "W-11H", commodity: "Paper Products", status: "Completed", departure: "25 Jul 10:00", eta: "26 Jul 08:00", weight: 35000, pkgs: 720, wagonType: "Box N", priority: "Low", demurrage: 0, advance: 88000, trackPct: 100 },
  { id: "RCN-10", consignment: "CN-2024-IR-4590", train: "12431 Trivandrum Rajdhani", origin: "Trivandrum Ctrl", dest: "Hazrat Nizamuddin", dc: "Mundra DC", wagon: "W-22C", commodity: "Rubber", status: "Delayed", departure: "28 Jul 14:00", eta: "30 Jul 00:00", weight: 55000, pkgs: 320, wagonType: "Box HL", priority: "High", demurrage: 0, advance: 172000, trackPct: 55 },
]

interface RailItem {
  id: string; consignment: string; train: string; origin: string; dest: string
  dc: string; wagon: string; commodity: string; status: string
  departure: string; eta: string; weight: number; pkgs: number
  wagonType: string; priority: string; demurrage: number
  advance: number; trackPct: number
}

const items: RailItem[] = raw.map((r: any) => ({
  id: r.id, consignment: r.consignment, train: r.train, origin: r.origin,
  dest: r.dest, dc: r.dc, wagon: r.wagon, commodity: r.commodity,
  status: r.status, departure: r.departure, eta: r.eta, weight: r.weight,
  pkgs: r.pkgs, wagonType: r.wagonType, priority: r.priority,
  demurrage: r.demurrage, advance: r.advance, trackPct: r.trackPct,
}))

const statusColors: Record<string, string> = {
  "In Transit": "text-blue-600", "Arrived": "text-emerald-600",
  "Loading": "text-violet-600", "Demurrage": "text-red-600 font-semibold",
  "Customs Hold": "text-orange-600 font-semibold", "Dispatched": "text-sky-600",
  "Completed": "text-emerald-600", "Delayed": "text-amber-600 font-semibold",
}
const priorityColors: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700", "High": "bg-orange-100 text-orange-700",
  "Medium": "bg-blue-100 text-blue-700", "Low": "bg-gray-100 text-gray-600",
}

const commodities = [...new Set(items.map(i => i.commodity))]

type Rec = any
type FV = Record<string, string>
type VT = "consignments" | "commodities" | "costs"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`rcn-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function fmtAmt(n: number): string {
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `\u20b9${(n / 1000).toFixed(1)}K`
  return `\u20b9${n}`
}

export function RailConsignmentPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("consignments")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const transitCount = items.filter(i => i.status === "In Transit").length
  const demurrageCount = items.filter(i => i.demurrage > 0).length
  const totalDemurrage = items.reduce((s, i) => s + i.demurrage, 0)
  const totalAdvance = items.reduce((s, i) => s + i.advance, 0)
  const totalWeight = items.reduce((s, i) => s + i.weight, 0)

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: TrainFront, title: "In Transit", desc: `${transitCount}/${items.length} consignments en route`, accent: "text-blue-500" },
    { icon: AlertTriangle, title: "Demurrage", desc: `${demurrageCount} wagons owe ${fmtAmt(totalDemurrage)}`, accent: "text-red-500" },
    { icon: IndianRupee, title: "Advance", desc: `${fmtAmt(totalAdvance)} total paid`, accent: "text-emerald-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Demurrage").map(i => ({ id: i.id, msg: `${i.consignment}: ${fmtAmt(i.demurrage)} demurrage charge at ${i.dest}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Customs Hold").map(i => ({ id: i.id, msg: `${i.consignment}: ${i.commodity} held at customs check`, severity: "warning" as const })),
    ...items.filter(i => i.status === "Delayed").map(i => ({ id: i.id, msg: `${i.consignment}: Delayed — new ETA ${i.eta}`, severity: "warning" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center"><TrainFront className="h-4 w-4 text-orange-600" /></div>
            <div><h3 className="text-sm font-bold">Rail Consignment</h3><p className="text-xs opacity-60">{items.length} consignments on Indian Railways</p></div>
          </div>
          <div className="flex gap-1">
            {(["consignments", "commodities", "costs"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "consignments" ? "Trains" : v === "commodities" ? "Cargo" : "Costs"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Consignments", String(items.length), ClipboardList, "bg-orange-50/50")}
          {statCard("In Transit", String(transitCount), TrainFront, "bg-blue-50/50")}
          {statCard("Total Weight", `${(totalWeight / 1000).toFixed(0)}T`, PackageSearch, "bg-amber-50/50")}
          {statCard("Demurrage", fmtAmt(totalDemurrage), AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {commodities.map(c => {
            const active = activeFilters.commodity === c
            return <span key={c} onClick={() => toggle("commodity", active ? undefined : c)} className={`rcn-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {activeFilters.commodity && <span onClick={() => toggle("commodity", undefined)} className="rcn-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="rcn-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="rcn-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Rail Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`rcn-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "consignments" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isDmg = item.status === "Demurrage"
              const isHold = item.status === "Customs Hold"
              return (
                <div key={item.id} className={`rcn-item-card rounded-lg border p-2.5 bg-card ${isDmg ? "rcn-dmg-pulse" : isHold ? "rcn-hold-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="rcn-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">{item.id}</span>
                      <div><span className="text-xs font-semibold">{item.train}</span></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`rcn-priority text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityColors[item.priority] || "bg-muted"}`}>{item.priority}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.origin} \u2192 {item.dest}</div>
                    <div className="flex items-center gap-1"><Warehouse className="h-3 w-3 opacity-40" />{item.dc}</div>
                    <div className="flex items-center gap-1"><Tag className="h-3 w-3 opacity-40" />{item.wagon} ({item.wagonType})</div>
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3 opacity-40" />Dep {item.departure}</div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-12">Track</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${item.trackPct === 100 ? "bg-emerald-500" : item.trackPct > 50 ? "bg-blue-500" : item.trackPct > 0 ? "bg-amber-500" : "bg-muted-foreground/20"} ${item.trackPct > 0 && item.trackPct < 100 ? "rcn-bar-progress" : ""}`} style={{ width: `${item.trackPct}%` }} /></div>
                    <span className="text-[10px] font-mono w-8 text-right">{item.trackPct}%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
                    <div>{item.commodity}</div>
                    <div>Wt: <span className="font-medium text-foreground">{(item.weight / 1000).toFixed(0)}T</span></div>
                    <div>Pkgs: <span className="font-medium text-foreground">{item.pkgs}</span></div>
                    <div>{item.demurrage > 0 ? <span className="text-red-500 font-medium">Dem: {fmtAmt(item.demurrage)}</span> : <span className="font-medium text-foreground">ETA {item.eta}</span>}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "commodities" && (
          <div className="space-y-2">
            {commodities.map(comm => {
              const commItems = items.filter(i => i.commodity === comm)
              const commWt = commItems.reduce((s, i) => s + i.weight, 0)
              const commPkgs = commItems.reduce((s, i) => s + i.pkgs, 0)
              return (
                <div key={comm} className="rcn-comm-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><Package className="h-4 w-4 text-orange-500" /><span className="text-xs font-semibold">{comm}</span></div>
                    <span className="text-[10px] opacity-50">{commItems.length} consignments</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="rcn-comm-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{(commWt / 1000).toFixed(0)}T</div><div className="opacity-50">Weight</div></div>
                    <div className="rcn-comm-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{commPkgs}</div><div className="opacity-50">Packages</div></div>
                    <div className="rcn-comm-metric rounded-md bg-muted/30 p-1.5 text-center"><div className={`font-bold text-sm ${commItems.some(i => i.demurrage > 0) ? "text-red-500" : "text-foreground"}`}>{commItems.some(i => i.demurrage > 0) ? "Issue" : "OK"}</div><div className="opacity-50">Status</div></div>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {commItems.map(ci => (
                      <div key={ci.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{ci.id}</span>{ci.train.slice(0, 12)} <span className="opacity-40">{ci.origin}\u2192{ci.dest.split(" ")[0]}</span></span>
                        <span className={statusColors[ci.status] || ""}>{ci.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "costs" && (
          <div className="space-y-2">
            <div className="rcn-cost-header rounded-lg border p-2 bg-orange-50/30">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{fmtAmt(totalAdvance)}</div><div className="text-[10px] opacity-50">Total Advance Paid</div></div>
                <div><div className="text-lg font-bold text-red-600">{fmtAmt(totalDemurrage)}</div><div className="text-[10px] opacity-50">Total Demurrage Charges</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.advance - a.advance).map(item => (
              <div key={item.id} className="rcn-cost-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.commodity}</span>
                    <span className="text-[10px] opacity-50">{item.train.slice(0, 15)}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600">{fmtAmt(item.advance)}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground">
                  <div>Route: <span className="font-medium text-foreground">{item.origin}\u2192{item.dest.split(" ")[0]}</span></div>
                  <div>Weight: <span className="font-medium text-foreground">{(item.weight / 1000).toFixed(0)}T</span></div>
                  <div>{item.demurrage > 0 ? <span className="text-red-500 font-medium">Dem: +{fmtAmt(item.demurrage)}</span> : <span className="font-medium text-foreground">No charges</span>}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
