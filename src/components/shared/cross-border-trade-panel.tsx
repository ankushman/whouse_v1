"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Globe, Ship, Plane, Truck, FileCheck, Landmark, Shield,
  Clock, IndianRupee, AlertTriangle,
  Stamp, FileText, TrendingUp, Target,
  Scale, Lock, Unlock
} from "lucide-react"

const raw = [
  { id: "CBT-01", shipper: "Reliance Industries", consignee: "ADNOC Trading", origin: "Nhava Sheva", destination: "Jebel Ali", country: "UAE", commodity: "Petrochemicals", mode: "Sea", carrier: "Maersk India", hsCode: "27079990", value: 85000000, weight: 45000, customsDuty: 12750000, gst: 5, status: "Cleared", docStatus: "Verified", vessel: "MSC GULSUN", eta: "2026-08-05", clearanceDays: 3, igm: "IGM-2026-4421", riskFlag: "Low", cha: "V Xport Logistics" },
  { id: "CBT-02", shipper: "Tata Motors", consignee: "Auto BVBA", origin: "Mundra Port", destination: "Antwerp", country: "Belgium", commodity: "Auto Parts", mode: "Sea", carrier: "MSC India", hsCode: "87089900", value: 32000000, weight: 28000, customsDuty: 4800000, gst: 18, status: "In Transit", docStatus: "Verified", vessel: "MSC OSCAR", eta: "2026-08-22", clearanceDays: 2, igm: "IGM-2026-4418", riskFlag: "Low", cha: "DHL Global Forwarding" },
  { id: "CBT-03", shipper: "Dr Reddy Labs", consignee: "PharmaCo GmbH", origin: "Chennai Port", destination: "Hamburg", country: "Germany", commodity: "API Formulations", mode: "Sea", carrier: "Hapag-Lloyd", hsCode: "30049099", value: 18600000, weight: 4200, customsDuty: 2790000, gst: 12, status: "Customs Hold", docStatus: "Under Review", vessel: "MV BERLIN EXPRESS", eta: "2026-08-18", clearanceDays: 0, igm: "IGM-2026-4430", riskFlag: "High", cha: "Expeditors India" },
  { id: "CBT-04", shipper: "Wipro Enterprise", consignee: "TechMart LLC", origin: "Bengaluru SEZ", destination: "Dubai", country: "UAE", commodity: "IT Hardware", mode: "Air", carrier: "Emirates SkyCargo", hsCode: "84713000", value: 14200000, weight: 8500, customsDuty: 2130000, gst: 18, status: "Cleared", docStatus: "Verified", vessel: "EK-785", eta: "2026-07-30", clearanceDays: 1, igm: "AWB-2026-8821", riskFlag: "Low", cha: "BlueDart Customs" },
  { id: "CBT-05", shipper: "ITC Ltd", consignee: "FoodEx International", origin: "Kolkata Port", destination: "Colombo", country: "Sri Lanka", commodity: "Tobacco Products", mode: "Sea", carrier: "MSC India", hsCode: "24022000", value: 22400000, weight: 18000, customsDuty: 5600000, gst: 28, status: "Documentation", docStatus: "Pending", vessel: "MV LAKMALI", eta: "2026-08-12", clearanceDays: 0, igm: "IGM-2026-4425", riskFlag: "Medium", cha: "V Xport Logistics" },
  { id: "CBT-06", shipper: "Mahindra & Mahindra", consignee: "AutoServe Africa", origin: "Nhava Sheva", destination: "Dar es Salaam", country: "Tanzania", commodity: "Tractor CKD", mode: "Sea", carrier: "Maersk India", hsCode: "87012000", value: 45600000, weight: 52000, customsDuty: 0, gst: 0, status: "SEZ Clearance", docStatus: "Verified", vessel: "MAERSK SEALAND", eta: "2026-08-28", clearanceDays: 1, igm: "IGM-2026-4412", riskFlag: "Low", cha: "Container Corp" },
  { id: "CBT-07", shipper: "Sun Pharma", consignee: "MedSupply UK", origin: "Mumbai Airport", destination: "Heathrow", country: "UK", commodity: "Generics", mode: "Air", carrier: "British Airways Cargo", hsCode: "30049099", value: 9800000, weight: 3200, customsDuty: 1470000, gst: 12, status: "In Transit", docStatus: "Verified", vessel: "BA-155", eta: "2026-08-04", clearanceDays: 1, igm: "AWB-2026-8834", riskFlag: "Low", cha: "Expeditors India" },
  { id: "CBT-08", shipper: "Bajaj Electricals", consignee: "LightCo FZE", origin: "Mundra Port", destination: "Jebel Ali", country: "UAE", commodity: "LED Lighting", mode: "Sea", carrier: "MSC India", hsCode: "94054200", value: 6800000, weight: 12000, customsDuty: 1020000, gst: 18, status: "Documentation", docStatus: "Pending", vessel: "MSC DANUBE", eta: "2026-08-15", clearanceDays: 0, igm: "IGM-2026-4428", riskFlag: "Medium", cha: "DHL Global Forwarding" },
  { id: "CBT-09", shipper: "Larsen & Toubro", consignee: "BuildTech SA", origin: "Chennai Port", destination: "Jeddah", country: "Saudi Arabia", commodity: "Industrial Valves", mode: "Sea", carrier: "Hapag-Lloyd", hsCode: "84818000", value: 28500000, weight: 35000, customsDuty: 4275000, gst: 18, status: "Customs Hold", docStatus: "Invalid", vessel: "MV JEDDAH EXPRESS", eta: "2026-08-20", clearanceDays: 0, igm: "IGM-2026-4415", riskFlag: "High", cha: "V Xport Logistics" },
  { id: "CBT-10", shipper: "Maruti Suzuki", consignee: "AutoParts Mex", origin: "Nhava Sheva", destination: "Manzanillo", country: "Mexico", commodity: "Engine Parts", mode: "Sea", carrier: "Maersk India", hsCode: "84099100", value: 15200000, weight: 8000, customsDuty: 2280000, gst: 18, status: "In Transit", docStatus: "Verified", vessel: "MAERSK ELBROS", eta: "2026-09-01", clearanceDays: 2, igm: "IGM-2026-4422", riskFlag: "Low", cha: "Container Corp" },
]

interface CBTItem {
  id: string; shipper: string; consignee: string; origin: string; destination: string
  country: string; commodity: string; mode: string; carrier: string; hsCode: string
  value: number; weight: number; customsDuty: number; gst: number; status: string
  docStatus: string; vessel: string; eta: string; clearanceDays: number
  igm: string; riskFlag: string; cha: string
}

const items: CBTItem[] = raw.map((r: any) => ({
  id: r.id, shipper: r.shipper, consignee: r.consignee, origin: r.origin,
  destination: r.destination, country: r.country, commodity: r.commodity, mode: r.mode,
  carrier: r.carrier, hsCode: r.hsCode, value: r.value, weight: r.weight,
  customsDuty: r.customsDuty, gst: r.gst, status: r.status, docStatus: r.docStatus,
  vessel: r.vessel, eta: r.eta, clearanceDays: r.clearanceDays, igm: r.igm,
  riskFlag: r.riskFlag, cha: r.cha,
}))

const statusColors: Record<string, string> = {
  "Cleared": "text-emerald-600 font-semibold", "In Transit": "text-blue-600",
  "Customs Hold": "text-red-600 font-semibold", "Documentation": "text-amber-600 font-semibold",
  "SEZ Clearance": "text-purple-600 font-semibold",
}
const docStatusColors: Record<string, string> = {
  "Verified": "bg-emerald-100 text-emerald-700", "Pending": "bg-amber-100 text-amber-700",
  "Under Review": "bg-blue-100 text-blue-700", "Invalid": "bg-red-100 text-red-700",
}
const riskColors: Record<string, string> = {
  "Low": "text-emerald-600", "Medium": "text-amber-600", "High": "text-red-600 font-semibold",
}
const modes = [...new Set(items.map(i => i.mode))]
const countries = [...new Set(items.map(i => i.country))]
const totalValue = items.reduce((s, i) => s + i.value, 0)
const totalDuty = items.reduce((s, i) => s + i.customsDuty, 0)
const avgClearance = (items.filter(i => i.clearanceDays > 0).reduce((s, i) => s + i.clearanceDays, 0) / items.filter(i => i.clearanceDays > 0).length).toFixed(1)
const clearedCount = items.filter(i => i.status === "Cleared").length

type Rec = any
type FV = Record<string, string>
type VT = "shipments" | "compliance" | "duty"

function fmtINR(n: number) { if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`; if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`; return `\u20b9${(n / 1000).toFixed(1)}K` }

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`cbt-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function CrossBorderTradePanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("shipments")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const holds = items.filter(i => i.status === "Customs Hold")
  const invalidDocs = items.filter(i => i.docStatus === "Invalid")
  const highRisk = items.filter(i => i.riskFlag === "High")

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: Shield, title: "Clearance", desc: `${clearedCount}/${items.length} shipments cleared`, accent: "text-emerald-500" },
    { icon: Clock, title: "Avg Days", desc: `${avgClearance} days avg clearance`, accent: "text-blue-500" },
    { icon: Scale, title: "Duty", desc: `${fmtINR(totalDuty)} total customs duty`, accent: "text-amber-500" },
  ]

  const alerts = [
    ...holds.map(i => ({ id: i.id, msg: `${i.shipper}: Customs hold at ${i.origin} \u2014 ${i.commodity}`, severity: "critical" as const })),
    ...invalidDocs.map(i => ({ id: i.id, msg: `${i.shipper}: Invalid documentation \u2014 ${i.cha} assigned`, severity: "critical" as const })),
    ...highRisk.filter(i => i.status !== "Customs Hold").map(i => ({ id: i.id, msg: `${i.shipper}: High risk flag \u2014 ${i.riskFlag} assessment`, severity: "warning" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center"><Globe className="h-4 w-4 text-orange-600" /></div>
            <div><h3 className="text-sm font-bold">Cross-Border Trade</h3><p className="text-xs opacity-60">{items.length} shipments | {countries.length} countries</p></div>
          </div>
          <div className="flex gap-1">
            {(["shipments", "compliance", "duty"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "shipments" ? "Shipments" : v === "compliance" ? "Compliance" : "Duty"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Trade Value", fmtINR(totalValue), IndianRupee, "bg-orange-50/50")}
          {statCard("Cleared", `${clearedCount}/${items.length}`, FileCheck, "bg-emerald-50/50")}
          {statCard("Customs Duty", fmtINR(totalDuty), Landmark, "bg-blue-50/50")}
          {statCard("Avg Clearance", `${avgClearance}d`, Clock, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {modes.map(m => {
            const active = activeFilters.mode === m
            return <span key={m} onClick={() => toggle("mode", active ? undefined : m)} className={`cbt-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{m}</span>
          })}
          {countries.map(c => {
            const active = activeFilters.country === c
            return <span key={c} onClick={() => toggle("country", active ? undefined : c)} className={`cbt-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="cbt-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="cbt-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="cbt-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Trade Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`cbt-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "shipments" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isHold = item.status === "Customs Hold"
              const isDoc = item.status === "Documentation" && item.docStatus === "Pending"
              const MIcon = item.mode === "Air" ? Plane : item.mode === "Sea" ? Ship : Truck
              return (
                <div key={item.id} className={`cbt-ship-card rounded-lg border p-2.5 bg-card ${isHold ? "cbt-critical-pulse" : isDoc ? "cbt-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="cbt-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">{item.id}</span>
                      <MIcon className="h-3.5 w-3.5 text-orange-500" />
                      <span className="text-xs font-semibold">{item.origin} \u2192 {item.destination}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${docStatusColors[item.docStatus] || "bg-slate-100"}`}>{item.docStatus}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Stamp className="h-3 w-3 opacity-40" />{item.shipper} \u2192 {item.consignee}</div>
                    <div className="flex items-center gap-1"><Ship className="h-3 w-3 opacity-40" />{item.vessel} | {item.carrier}</div>
                    <div className="flex items-center gap-1"><FileText className="h-3 w-3 opacity-40" />HS: {item.hsCode} | {item.commodity}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />ETA: {item.eta} | CHA: {item.cha}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Value: <span className="font-bold text-foreground">{fmtINR(item.value)}</span></div>
                    <div>Weight: <span className="font-medium">{(item.weight / 1000).toFixed(1)}T</span></div>
                    <div>GST: <span className="font-medium">{item.gst}%</span></div>
                    <div>Risk: <span className={`font-bold ${riskColors[item.riskFlag] || "text-muted-foreground"}`}>{item.riskFlag}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "compliance" && (
          <div className="space-y-2">
            <div className="cbt-compliance-header rounded-lg border p-2 bg-orange-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{clearedCount}</div><div className="text-[10px] opacity-50">Cleared</div></div>
                <div><div className="text-lg font-bold text-red-600">{holds.length}</div><div className="text-[10px] opacity-50">On Hold</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.docStatus === "Pending").length}</div><div className="text-[10px] opacity-50">Pending Docs</div></div>
                <div><div className="text-lg font-bold text-orange-600">{highRisk.length}</div><div className="text-[10px] opacity-50">High Risk</div></div>
              </div>
            </div>
            {items.sort((a, b) => {
              const so: Record<string, number> = { "Customs Hold": 0, "Documentation": 1, "In Transit": 2, "SEZ Clearance": 3, "Cleared": 4 }
              return (so[a.status] ?? 5) - (so[b.status] ?? 5)
            }).map(item => {
              const isVerified = item.docStatus === "Verified"
              return (
                <div key={item.id} className="cbt-compliance-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.shipper}</span>
                      <span className="text-[10px] opacity-50">{item.commodity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || ""}`}>{item.status}</span>
                      {isVerified ? <Lock className="h-3 w-3 text-emerald-500" /> : <Unlock className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Doc: <span className={`font-semibold ${docStatusColors[item.docStatus]?.split(" ")[1] || "text-muted-foreground"}`}>{item.docStatus}</span></div>
                    <div>CHA: <span className="font-medium">{item.cha}</span></div>
                    <div>IGM: <span className="font-mono">{item.igm}</span></div>
                    <div>Clearance: <span className={`font-bold ${item.clearanceDays === 0 ? "text-amber-600" : item.clearanceDays <= 2 ? "text-emerald-600" : "text-red-600"}`}>{item.clearanceDays === 0 ? "Pending" : `${item.clearanceDays}d`}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "duty" && (
          <div className="space-y-2">
            <div className="cbt-duty-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-orange-600">{fmtINR(totalValue)}</div><div className="text-[10px] opacity-50">Total Trade Value</div></div>
                <div><div className="text-lg font-bold text-blue-600">{fmtINR(totalDuty)}</div><div className="text-[10px] opacity-50">Total Duty</div></div>
                <div><div className="text-lg font-bold text-amber-600">{((totalDuty / totalValue) * 100).toFixed(1)}%</div><div className="text-[10px] opacity-50">Effective Rate</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.gst === 0).length} SEZ</div><div className="text-[10px] opacity-50">Duty-Free Shipments</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.customsDuty - a.customsDuty).map(item => {
              const dutyRate = item.value > 0 ? ((item.customsDuty / item.value) * 100).toFixed(1) : "0.0"
              const netValue = item.value - item.customsDuty
              return (
                <div key={item.id} className="cbt-duty-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.shipper}</span>
                      <span className="text-[10px] opacity-50">{item.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-blue-600">{fmtINR(item.customsDuty)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(parseFloat(dutyRate) * 3, 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Value: <span className="font-medium">{fmtINR(item.value)}</span></div>
                    <div>Duty Rate: <span className="font-medium">{dutyRate}%</span></div>
                    <div>GST: <span className="font-medium">{item.gst}%</span></div>
                    <div>Net: <span className="font-medium">{fmtINR(netValue)}</span></div>
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
