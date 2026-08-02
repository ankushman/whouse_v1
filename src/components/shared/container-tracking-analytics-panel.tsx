"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Container, Ship, Anchor, MapPin, FileText, AlertTriangle,
  CheckCircle, XCircle, Globe, DollarSign
} from "lucide-react"

const raw = [
  { id: "CTA-01", bl: "MAEU-2845731", container: "MSCU-7654321", type: "40ft HC Reefer", size: "40HC", port: "Nhava Sheva", destination: "Rotterdam", carrier: "MSC India", status: "In Transit", voyage: "MSC ILENIA V.48", etd: "2026-07-20", eta: "2026-08-15", dwell: 3, demurrage: 0, detention: 0, customs: "Cleared", temp: -18, humidity: 45, weight: 22.4, teu: 2.25, cargo: "Pharma (Dr Reddy)", igm: "2026-07-19", value: 45000000, vessel: "MSC ILENIA" },
  { id: "CTA-02", bl: "COSU-9182345", container: "CMAU-3345678", type: "20ft GP", size: "20GP", port: "Mundra", destination: "Shanghai", carrier: "CMA CGM", status: "At Port", voyage: "CMA PEGASUS V.22", etd: "2026-08-05", eta: "2026-08-28", dwell: 8, demurrage: 0, detention: 2400, customs: "Pending", temp: 32, humidity: 68, weight: 18.5, teu: 1.0, cargo: "Cotton (Arvind Ltd)", igm: "2026-07-28", value: 12500000, vessel: "CMA PEGASUS" },
  { id: "CTA-03", bl: "HLCU-5567890", container: "HLCU-9988776", type: "40ft HC", size: "40HC", port: "Chennai", destination: "Singapore", carrier: "Hapag-Lloyd", status: "Loaded", voyage: "MV BERLIN EXPRESS V.11", etd: "2026-07-30", eta: "2026-08-06", dwell: 2, demurrage: 0, detention: 0, customs: "Cleared", temp: 34, humidity: 72, weight: 24.8, teu: 2.25, cargo: "Auto Parts (TVS Group)", igm: "2026-07-29", value: 28000000, vessel: "BERLIN EXPRESS" },
  { id: "CTA-04", bl: "EGLV-4455667", container: "EGLV-1122334", type: "40ft RF", size: "40RF", port: "Nhava Sheva", destination: "Felixstowe", carrier: "Evergreen", status: "Customs Hold", voyage: "EVER GOLDEN V.33", etd: "2026-07-25", eta: "2026-08-18", dwell: 12, demurrage: 8500, detention: 0, customs: "Hold", temp: 4, humidity: 55, weight: 20.1, teu: 2.25, cargo: "Seafood (Sandhya Aqua)", igm: "2026-07-22", value: 18500000, vessel: "EVER GOLDEN" },
  { id: "CTA-05", bl: "OOLU-7788990", container: "OOLU-5566778", type: "20ft GP", size: "20GP", port: "Kolkata", destination: "Chittagong", carrier: "OOCL", status: "Discharged", voyage: "OOCL BERLIN V.18", etd: "2026-07-18", eta: "2026-07-22", dwell: 15, demurrage: 12000, detention: 4800, customs: "Pending", temp: 33, humidity: 80, weight: 16.2, teu: 1.0, cargo: "Jute Products (HPG)", igm: "2026-07-15", value: 5200000, vessel: "OOCL BERLIN" },
  { id: "CTA-06", bl: "ONEU-3344556", container: "ONEU-8899001", type: "40ft HC", size: "40HC", port: "Cochin", destination: "Dubai Jebel Ali", carrier: "ONE Line", status: "In Transit", voyage: "ONE CONTINUITY V.07", etd: "2026-07-28", eta: "2026-08-04", dwell: 1, demurrage: 0, detention: 0, customs: "Cleared", temp: 30, humidity: 75, weight: 21.5, teu: 2.25, cargo: "Spices (Synthite)", igm: "2026-07-27", value: 9800000, vessel: "ONE CONTINUITY" },
  { id: "CTA-07", bl: "YMLU-6677889", container: "YMLU-2233445", type: "45ft HC PW", size: "45PW", port: "Mundra", destination: "Los Angeles", carrier: "Yang Ming", status: "In Transit", voyage: "YM WARRANTY V.52", etd: "2026-07-22", eta: "2026-08-22", dwell: 0, demurrage: 0, detention: 0, customs: "Cleared", temp: 35, humidity: 50, weight: 28.3, teu: 2.5, cargo: "Textiles (Welspun)", igm: "2026-07-21", value: 34000000, vessel: "YM WARRANTY" },
  { id: "CTA-08", bl: "TCLU-1122334", container: "TCLU-4455667", type: "20ft RF", size: "20RF", port: "Nhava Sheva", destination: "Hamburg", carrier: "Maersk", status: "Gate In", voyage: "MAERSK ELBA V.65", etd: "2026-08-08", eta: "2026-08-30", dwell: 5, demurrage: 0, detention: 0, customs: "Exam Pending", temp: -25, humidity: 35, weight: 15.8, teu: 1.0, cargo: "Mango Pulp (Krushivalley)", igm: "2026-08-02", value: 7200000, vessel: "MAERSK ELBA" },
  { id: "CTA-09", bl: "ZIMU-8899001", container: "ZIMU-7788990", type: "40ft GP", size: "40GP", port: "Tuticorin", destination: "Colombo", carrier: "ZIM Lines", status: "Empty Return", voyage: "N/A", etd: "N/A", eta: "2026-07-25", dwell: 22, demurrage: 18500, detention: 9600, customs: "Cleared", temp: 34, humidity: 70, weight: 4.2, teu: 2.25, cargo: "Empty", igm: "2026-07-10", value: 0, vessel: "N/A" },
  { id: "CTA-10", bl: "PONU-5566778", container: "PONU-3344556", type: "40ft OT", size: "40OT", port: "Visakhapatnam", destination: "Mombasa", carrier: "PIL", status: "Stuffing", voyage: "KOTA PEKARANG V.14", etd: "2026-08-10", eta: "2026-09-02", dwell: 0, demurrage: 0, detention: 0, customs: "Pending", temp: 31, humidity: 78, weight: 26.7, teu: 2.25, cargo: "Steel Pipes (SAIL)", igm: "Pending", value: 22000000, vessel: "KOTA PEKARANG" },
]

interface CTAItem {
  id: string; bl: string; container: string; type: string; size: string
  port: string; destination: string; carrier: string; status: string
  voyage: string; etd: string; eta: string; dwell: number; demurrage: number
  detention: number; customs: string; temp: number; humidity: number
  weight: number; teu: number; cargo: string; igm: string; value: number; vessel: string
}

const items: CTAItem[] = raw.map((r: any) => ({
  id: r.id, bl: r.bl, container: r.container, type: r.type, size: r.size,
  port: r.port, destination: r.destination, carrier: r.carrier, status: r.status,
  voyage: r.voyage, etd: r.etd, eta: r.eta, dwell: r.dwell, demurrage: r.demurrage,
  detention: r.detention, customs: r.customs, temp: r.temp, humidity: r.humidity,
  weight: r.weight, teu: r.teu, cargo: r.cargo, igm: r.igm, value: r.value, vessel: r.vessel,
}))

const statusColors: Record<string, string> = {
  "In Transit": "text-blue-600 font-semibold", "At Port": "text-amber-600 font-semibold",
  "Loaded": "text-indigo-600 font-semibold", "Customs Hold": "text-red-600 font-semibold",
  "Discharged": "text-purple-600 font-semibold", "Gate In": "text-teal-600 font-semibold",
  "Empty Return": "text-slate-600 font-semibold", "Stuffing": "text-cyan-600 font-semibold",
}
const typeColors: Record<string, string> = {
  "40ft HC Reefer": "bg-cyan-100 text-cyan-700", "20ft GP": "bg-amber-100 text-amber-700",
  "40ft HC": "bg-blue-100 text-blue-700", "40ft RF": "bg-purple-100 text-purple-700",
  "45ft HC PW": "bg-indigo-100 text-indigo-700",
  "20ft RF": "bg-rose-100 text-rose-700", "40ft GP": "bg-orange-100 text-orange-700",
  "40ft OT": "bg-slate-100 text-slate-700",
}
const customColors: Record<string, string> = {
  "Cleared": "bg-emerald-100 text-emerald-700", "Pending": "bg-amber-100 text-amber-700",
  "Hold": "bg-red-100 text-red-700", "Exam Pending": "bg-orange-100 text-orange-700",
}
const ports = [...new Set(items.map(i => i.port))]
const totalTEU = items.reduce((s, i) => s + i.teu, 0)
const totalDemDet = items.reduce((s, i) => s + i.demurrage + i.detention, 0)
const held = items.filter(i => i.status === "Customs Hold" || i.customs === "Hold").length

type Rec = any
type FV = Record<string, string>
type VT = "containers" | "cargo" | "cost"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`cta-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `\u20b9${(amount / 1000).toFixed(0)}K`
  return `\u20b9${amount}`
}

export function ContainerTrackingAnalyticsPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("containers")

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
    ...items.filter(i => i.status === "Customs Hold").map(i => ({ id: i.id, msg: `${i.container}: Customs HOLD \u2014 ${i.cargo}, ${i.port}, demurrage \u20b9${(i.demurrage / 1000).toFixed(0)}K`, severity: "critical" as const })),
    ...items.filter(i => i.dwell > 10).map(i => ({ id: i.id, msg: `${i.container}: Excess dwell ${i.dwell}d at ${i.port} \u2014 dem/det \u20b9${formatINR(i.demurrage + i.detention)}`, severity: "warning" as const })),
    ...items.filter(i => i.type.includes("Reefer") || i.type.includes("RF")).map(i => ({ id: i.id, msg: `${i.container}: Reefer ${i.temp}\u00b0C \u2014 ${i.cargo}, voyage ${i.voyage}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Anchor, title: "Total TEU", desc: `${totalTEU.toFixed(1)} TEU across ${items.length} containers`, accent: "text-blue-500" },
    { icon: Globe, title: "Ports", desc: `${ports.length} Indian ports active`, accent: "text-emerald-500" },
    { icon: DollarSign, title: "Dem/Det Cost", desc: `${formatINR(totalDemDet)} charges pending`, accent: "text-red-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center"><Ship className="h-4 w-4 text-indigo-600" /></div>
            <div><h3 className="text-sm font-bold">Container Tracking Analytics</h3><p className="text-xs opacity-60">{items.length} containers | {ports.length} ports</p></div>
          </div>
          <div className="flex gap-1">
            {(["containers", "cargo", "cost"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "containers" ? "Containers" : v === "cargo" ? "Cargo" : "Cost"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Containers", items.length.toString(), Container, "bg-indigo-50/50")}
          {statCard("TEU", totalTEU.toFixed(1), Anchor, "bg-blue-50/50")}
          {statCard("On Hold", `${held}/${items.length}`, AlertTriangle, "bg-red-50/50")}
          {statCard("Dem/Det", formatINR(totalDemDet), DollarSign, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {ports.map(p => {
            const active = activeFilters.port === p
            return <span key={p} onClick={() => toggle("port", active ? undefined : p)} className={`cta-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{p}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="cta-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="cta-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="cta-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Container Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`cta-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "containers" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Customs Hold" || item.customs === "Hold"
              const isWarning = item.dwell > 10 || item.demurrage > 5000
              return (
                <div key={item.id} className={`cta-ctn-card rounded-lg border p-2.5 bg-card ${isCritical ? "cta-critical-pulse" : isWarning ? "cta-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="cta-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">{item.id}</span>
                      <span className={`cta-type-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                      <span className={`cta-customs-tag text-[10px] px-1.5 py-0.5 rounded ${customColors[item.customs] || "bg-slate-100"}`}>{item.customs}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "In Transit" ? <Ship className="h-3 w-3 text-blue-500" /> : <CheckCircle className="h-3 w-3 text-emerald-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Container className="h-3 w-3 opacity-40" />{item.container} | {item.size}</div>
                    <div className="flex items-center gap-1"><Ship className="h-3 w-3 opacity-40" />{item.carrier} | {item.port}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.port} → {item.destination}</div>
                    <div className="flex items-center gap-1"><FileText className="h-3 w-3 opacity-40" />BL: {item.bl} | IGM: {item.igm}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Weight: <span className="font-bold">{item.weight}T</span></div>
                    <div>TEU: <span className="font-medium">{item.teu}</span></div>
                    <div>Dwell: <span className={`font-medium ${item.dwell > 10 ? "text-red-600" : "text-foreground"}`}>{item.dwell}d</span></div>
                    <div>Temp: <span className="font-medium">{item.temp}\u00b0C</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "cargo" && (
          <div className="space-y-2">
            <div className="cta-cargo-header rounded-lg border p-2 bg-indigo-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-indigo-600">{totalTEU.toFixed(1)}</div><div className="text-[10px] opacity-50">Total TEU</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{Math.round(items.reduce((s, i) => s + i.weight, 0))}T</div><div className="text-[10px] opacity-50">Total Weight</div></div>
                <div><div className="text-lg font-bold text-amber-600">{formatINR(items.reduce((s, i) => s + i.value, 0))}</div><div className="text-[10px] opacity-50">Cargo Value</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.customs === "Cleared").length}</div><div className="text-[10px] opacity-50">Customs Cleared</div></div>
              </div>
            </div>
            {items.filter(i => i.cargo !== "Empty").sort((a, b) => b.value - a.value).map(item => (
              <div key={item.id} className="cta-cargo-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.cargo}</span>
                    <span className="text-[10px] opacity-50">{item.type}</span>
                  </div>
                  <span className="text-xs font-bold">{formatINR(item.value)}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Route: <span className="font-medium">{item.port} → {item.destination}</span></div>
                  <div>Vessel: <span className="font-medium">{item.vessel}</span></div>
                  <div>Weight: <span className="font-medium">{item.weight}T ({item.teu} TEU)</span></div>
                  <div>Customs: <span className={`font-medium ${item.customs === "Cleared" ? "text-emerald-600" : item.customs === "Hold" ? "text-red-600" : "text-amber-600"}`}>{item.customs}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "cost" && (
          <div className="space-y-2">
            <div className="cta-cost-header rounded-lg border p-2 bg-amber-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-amber-600">{formatINR(totalDemDet)}</div><div className="text-[10px] opacity-50">Total Dem/Det</div></div>
                <div><div className="text-lg font-bold text-red-600">{formatINR(items.reduce((s, i) => s + i.demurrage, 0))}</div><div className="text-[10px] opacity-50">Demurrage</div></div>
                <div><div className="text-lg font-bold text-orange-600">{formatINR(items.reduce((s, i) => s + i.detention, 0))}</div><div className="text-[10px] opacity-50">Detention</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.demurrage > 0 || i.detention > 0).length}</div><div className="text-[10px] opacity-50">Charged</div></div>
              </div>
            </div>
            {items.filter(i => i.demurrage > 0 || i.detention > 0 || i.dwell > 5).sort((a, b) => (b.demurrage + b.detention) - (a.demurrage + a.detention)).map(item => (
              <div key={item.id} className={`cta-cost-row rounded-lg border p-2 bg-card ${(item.demurrage + item.detention) > 10000 ? "cta-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.container}</span>
                    <span className="text-[10px] opacity-50">{item.port}</span>
                  </div>
                  <span className="text-xs font-bold text-red-600">{formatINR(item.demurrage + item.detention)}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Dwell: <span className={`font-medium ${item.dwell > 10 ? "text-red-600" : "text-foreground"}`}>{item.dwell}d</span></div>
                  <div>Demurrage: <span className="font-medium">{formatINR(item.demurrage)}</span></div>
                  <div>Detention: <span className="font-medium">{formatINR(item.detention)}</span></div>
                  <div>Carrier: <span className="font-medium">{item.carrier}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
