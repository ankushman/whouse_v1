"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShieldCheck, Globe, FileCheck,
  AlertTriangle, CheckCircle, XCircle,
  IndianRupee, Receipt, Landmark, Scale, Clock
} from "lucide-react"

const raw = [
  { id: "CCT-01", shipment: "BL-489201", hsCode: "8703.23", cargo: "Auto Parts", origin: "Germany", port: "Nhava Sheva", regime: "Normal", dutyType: "Basic + IGST", dutyPct: 32.5, assessVal: 18500000, dutyAmount: 6012500, igst: 18, status: "Cleared", broker: "J.B. Customs", filingDate: "28-Jul", clearanceDate: "30-Jul", dwell: 2, exam: false, hazardClass: "None", statusRisk: "Low", city: "Mumbai", month: "Aug 2026", documents: "Bill of Entry, Invoice, BL, Packing List" },
  { id: "CCT-02", shipment: "BL-489315", hsCode: "3004.90", cargo: "Pharma Formulations", origin: "China", port: "Chennai", regime: "Normal", dutyType: "Basic + IGST + Cess", dutyPct: 42.0, assessVal: 4200000, dutyAmount: 1764000, igst: 18, status: "Exam Pending", broker: "Patel Customs", filingDate: "01-Aug", clearanceDate: "", dwell: 1, exam: true, hazardClass: "None", statusRisk: "Medium", city: "Chennai", month: "Aug 2026", documents: "Bill of Entry, Invoice, BL, FSSAI, WHO-GMP" },
  { id: "CCT-03", shipment: "BL-489402", hsCode: "5208.52", cargo: "Cotton Yarn", origin: "Bangladesh", port: "Kolkata", regime: "SAARC Preferential", dutyType: "Reduced + IGST", dutyPct: 15.0, assessVal: 2800000, dutyAmount: 420000, igst: 5, status: "Cleared", broker: "Das & Co.", filingDate: "25-Jul", clearanceDate: "26-Jul", dwell: 1, exam: false, hazardClass: "None", statusRisk: "Low", city: "Kolkata", month: "Aug 2026", documents: "Bill of Entry, SAARC Cert, Invoice" },
  { id: "CCT-04", shipment: "BL-489518", hsCode: "2710.12", cargo: "Diesel Engine Parts", origin: "Japan", port: "Mundra", regime: "Normal", dutyType: "Basic + IGST + SWS", dutyPct: 38.5, assessVal: 15600000, dutyAmount: 6006000, igst: 18, status: "Hold", broker: "Gujarat Shipping", filingDate: "29-Jul", clearanceDate: "", dwell: 4, exam: true, hazardClass: "None", statusRisk: "High", city: "Ahmedabad", month: "Aug 2026", documents: "Bill of Entry, Invoice, BL, Test Report, BIS" },
  { id: "CCT-05", shipment: "BL-489621", hsCode: "0901.11", cargo: "Coffee Beans", origin: "Vietnam", port: "Cochin", regime: "ASEAN Preferential", dutyType: "Reduced + IGST", dutyPct: 22.0, assessVal: 3200000, dutyAmount: 704000, igst: 5, status: "Cleared", broker: "Kerala Logistics", filingDate: "22-Jul", clearanceDate: "24-Jul", dwell: 2, exam: false, hazardClass: "None", statusRisk: "Low", city: "Kochi", month: "Aug 2026", documents: "Bill of Entry, ASEAN Cert, Phytosanitary" },
  { id: "CCT-06", shipment: "BL-489728", hsCode: "8504.40", cargo: "Power Transformers", origin: "South Korea", port: "Visakhapatnam", regime: "Normal", dutyType: "Basic + IGST + Cess", dutyPct: 35.0, assessVal: 22000000, dutyAmount: 7700000, igst: 18, status: "Pending", broker: "Vizag Port Agents", filingDate: "31-Jul", clearanceDate: "", dwell: 2, exam: true, hazardClass: "None", statusRisk: "Medium", city: "Visakhapatnam", month: "Aug 2026", documents: "Bill of Entry, Invoice, BL, BEE Rating" },
  { id: "CCT-07", shipment: "BL-489831", hsCode: "7606.12", cargo: "Aluminum Sheets", origin: "UAE", port: "Nhava Sheva", regime: "Normal", dutyType: "Basic + IGST + AIDC", dutyPct: 30.5, assessVal: 8500000, dutyAmount: 2592500, igst: 18, status: "Cleared", broker: "J.B. Customs", filingDate: "20-Jul", clearanceDate: "21-Jul", dwell: 1, exam: false, hazardClass: "None", statusRisk: "Low", city: "Mumbai", month: "Aug 2026", documents: "Bill of Entry, Invoice, BL, BIS" },
  { id: "CCT-08", shipment: "BL-489945", hsCode: "2842.10", cargo: "Titanium Dioxide", origin: "China", port: "Tuticorin", regime: "Normal", dutyType: "Basic + IGST + SWS", dutyPct: 45.0, assessVal: 6800000, dutyAmount: 3060000, igst: 18, status: "Hold", broker: "TN Customs Brokers", filingDate: "27-Jul", clearanceDate: "", dwell: 6, exam: true, hazardClass: "Class 9", statusRisk: "Critical", city: "Tuticorin", month: "Aug 2026", documents: "Bill of Entry, Invoice, BL, DG License, PESO" },
  { id: "CCT-09", shipment: "BL-490012", hsCode: "6110.20", cargo: "Cotton Garments", origin: "Sri Lanka", port: "Chennai", regime: "SAFTA Preferential", dutyType: "Reduced + IGST", dutyPct: 12.0, assessVal: 5400000, dutyAmount: 648000, igst: 5, status: "Cleared", broker: "Patel Customs", filingDate: "23-Jul", clearanceDate: "23-Jul", dwell: 0, exam: false, hazardClass: "None", statusRisk: "Low", city: "Chennai", month: "Aug 2026", documents: "Bill of Entry, SAFTA Cert, Invoice" },
  { id: "CCT-10", shipment: "BL-490128", hsCode: "8481.80", cargo: "Industrial Valves", origin: "Italy", port: "Mundra", regime: "Normal", dutyType: "Basic + IGST", dutyPct: 34.0, assessVal: 12300000, dutyAmount: 4182000, igst: 18, status: "Exam Pending", broker: "Gujarat Shipping", filingDate: "01-Aug", clearanceDate: "", dwell: 1, exam: true, hazardClass: "None", statusRisk: "Medium", city: "Ahmedabad", month: "Aug 2026", documents: "Bill of Entry, Invoice, BL, Test Report" },
]

interface CCTItem {
  id: string; shipment: string; hsCode: string; cargo: string; origin: string
  port: string; regime: string; dutyType: string; dutyPct: number
  assessVal: number; dutyAmount: number; igst: number; status: string
  broker: string; filingDate: string; clearanceDate: string; dwell: number
  exam: boolean; hazardClass: string; statusRisk: string
  city: string; month: string; documents: string
}

const items: CCTItem[] = raw.map((r: any) => ({
  id: r.id, shipment: r.shipment, hsCode: r.hsCode, cargo: r.cargo, origin: r.origin,
  port: r.port, regime: r.regime, dutyType: r.dutyType, dutyPct: r.dutyPct,
  assessVal: r.assessVal, dutyAmount: r.dutyAmount, igst: r.igst, status: r.status,
  broker: r.broker, filingDate: r.filingDate, clearanceDate: r.clearanceDate, dwell: r.dwell,
  exam: r.exam, hazardClass: r.hazardClass, statusRisk: r.statusRisk,
  city: r.city, month: r.month, documents: r.documents,
}))

const statusColors: Record<string, string> = {
  "Cleared": "text-emerald-600 font-semibold", "Pending": "text-amber-600 font-semibold",
  "Exam Pending": "text-orange-600 font-semibold", "Hold": "text-red-600 font-semibold",
}
const regimeColors: Record<string, string> = {
  "Normal": "bg-slate-100 text-slate-700", "SAARC Preferential": "bg-emerald-100 text-emerald-700",
  "SAFTA Preferential": "bg-green-100 text-green-700", "ASEAN Preferential": "bg-teal-100 text-teal-700",
  "SEZ/FTWZ": "bg-indigo-100 text-indigo-700",
}
const riskColors: Record<string, string> = {
  "Low": "bg-emerald-100 text-emerald-700", "Medium": "bg-amber-100 text-amber-700",
  "High": "bg-orange-100 text-orange-700", "Critical": "bg-red-100 text-red-700",
}
const statuses = [...new Set(items.map(i => i.status))]
const totalDuty = items.reduce((s, i) => s + i.dutyAmount, 0)
const avgDwell = (items.reduce((s, i) => s + i.dwell, 0) / items.length).toFixed(1)
const heldItems = items.filter(i => i.status === "Hold" || i.status === "Exam Pending").length

type Rec = any
type FV = Record<string, string>
type VT = "shipments" | "duty" | "risk"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`cct-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function CustomsComplianceTrackerPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("shipments")

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
    ...items.filter(i => i.status === "Hold").map(i => ({ id: i.id, msg: `${i.shipment}: ON HOLD \u2014 ${i.cargo}, ${i.port}, dwell ${i.dwell}d, duty ${formatINR(i.dutyAmount)}, ${i.exam ? "under examination" : "documentation pending"}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Exam Pending").map(i => ({ id: i.id, msg: `${i.shipment}: Exam pending \u2014 ${i.cargo}, ${i.port}, ${i.origin}, IGST ${i.igst}%`, severity: "warning" as const })),
    ...items.filter(i => i.statusRisk === "Critical").map(i => ({ id: i.id, msg: `${i.shipment}: Critical risk \u2014 ${i.hazardClass}, ${i.port}, ${i.regime} regime`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Receipt, title: "Total Duty", desc: `${formatINR(totalDuty)} across ${items.length} shipments | avg duty ${Math.round(items.reduce((s, i) => s + i.dutyPct, 0) / items.length)}%`, accent: "text-amber-500" },
    { icon: Clock, title: "Avg Dwell", desc: `${avgDwell} days | ${heldItems} held/exam pending`, accent: heldItems > 3 ? "text-red-500" : "text-emerald-500" },
    { icon: Globe, title: "Trade Regimes", desc: `${[...new Set(items.map(i => i.regime))].length} regimes | ${[...new Set(items.map(i => i.origin))].length} origins`, accent: "text-blue-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center"><ShieldCheck className="h-4 w-4 text-teal-600" /></div>
            <div><h3 className="text-sm font-bold">Customs Compliance Tracker</h3><p className="text-xs opacity-60">{items.length} shipments | {statuses.length} statuses</p></div>
          </div>
          <div className="flex gap-1">
            {(["shipments", "duty", "risk"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "shipments" ? "Shipments" : v === "duty" ? "Duty" : "Risk"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Shipments", items.length.toString(), FileCheck, "bg-teal-50/50")}
          {statCard("Total Duty", formatINR(totalDuty), IndianRupee, "bg-amber-50/50")}
          {statCard("Avg Dwell", `${avgDwell}d`, Clock, "bg-blue-50/50")}
          {statCard("On Hold", `${heldItems}/${items.length}`, AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {statuses.map(s => {
            const active = activeFilters.status === s
            return <span key={s} onClick={() => toggle("status", active ? undefined : s)} className={`cct-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="cct-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="cct-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="cct-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Customs Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`cct-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "shipments" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isHold = item.status === "Hold"
              const isExam = item.status === "Exam Pending"
              return (
                <div key={item.id} className={`cct-ship-card rounded-lg border p-2.5 bg-card ${isHold ? "cct-critical-pulse" : isExam ? "cct-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="cct-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-100 text-teal-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.shipment}</span>
                      <span className={`cct-regime-tag text-[10px] px-1.5 py-0.5 rounded ${regimeColors[item.regime] || "bg-slate-100"}`}>{item.regime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.exam && <span className="cct-exam-badge text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-semibold">EXAM</span>}
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isHold ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Cleared" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Globe className="h-3 w-3 opacity-40" />{item.origin} | {item.cargo}</div>
                    <div className="flex items-center gap-1"><Landmark className="h-3 w-3 opacity-40" />{item.port} | {item.broker}</div>
                    <div className="flex items-center gap-1"><Scale className="h-3 w-3 opacity-40" />HS: {item.hsCode} | {item.dutyType}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Filed: {item.filingDate} | Dwell: {item.dwell}d</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Value: <span className="font-bold">{formatINR(item.assessVal)}</span></div>
                    <div>Duty: <span className="font-bold">{formatINR(item.dutyAmount)}</span></div>
                    <div>Rate: <span className={`font-bold ${item.dutyPct > 40 ? "text-red-600" : item.dutyPct > 25 ? "text-amber-600" : "text-emerald-600"}`}>{item.dutyPct}%</span></div>
                    <div>Risk: <span className={`font-medium ${riskColors[item.statusRisk]}`}>{item.statusRisk}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "duty" && (
          <div className="space-y-2">
            <div className="cct-duty-header rounded-lg border p-2 bg-amber-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-amber-600">{formatINR(totalDuty)}</div><div className="text-[10px] opacity-50">Total Duty Collected</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.status === "Cleared").length}</div><div className="text-[10px] opacity-50">Cleared</div></div>
                <div><div className="text-lg font-bold text-purple-600">{[...new Set(items.map(i => i.port))].length}</div><div className="text-[10px] opacity-50">Ports</div></div>
                <div><div className="text-lg font-bold text-blue-600">{Math.round(items.reduce((s, i) => s + i.assessVal, 0) / 10000000)}Cr</div><div className="text-[10px] opacity-50">Total Value</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.dutyAmount - a.dutyAmount).map(item => (
              <div key={item.id} className="cct-duty-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.shipment}</span>
                    <span className="text-[10px] text-muted-foreground">{item.cargo}</span>
                  </div>
                  <span className="text-xs font-bold">{formatINR(item.dutyAmount)}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.dutyPct > 40 ? "bg-red-500" : item.dutyPct > 25 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(item.dutyPct * 2, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Rate: <span className="font-medium">{item.dutyPct}%</span></div>
                  <div>IGST: <span className="font-medium">{item.igst}%</span></div>
                  <div>Value: <span className="font-medium">{formatINR(item.assessVal)}</span></div>
                  <div>Dwell: <span className={`font-medium ${item.dwell > 3 ? "text-red-600" : "text-foreground"}`}>{item.dwell}d</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "risk" && (
          <div className="space-y-2">
            <div className="cct-risk-header rounded-lg border p-2 bg-red-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{heldItems}</div><div className="text-[10px] opacity-50">Held / Exam</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.exam).length}</div><div className="text-[10px] opacity-50">Under Exam</div></div>
                <div><div className="text-lg font-bold text-orange-600">{items.filter(i => i.hazardClass !== "None").length}</div><div className="text-[10px] opacity-50">Hazardous</div></div>
                <div><div className="text-lg font-bold text-purple-600">{items.reduce((s, i) => s + i.dwell, 0)}d</div><div className="text-[10px] opacity-50">Total Dwell</div></div>
              </div>
            </div>
            {items.sort((a, b) => {
              const riskOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 }
              return (riskOrder[b.statusRisk] || 0) - (riskOrder[a.statusRisk] || 0)
            }).map(item => (
              <div key={item.id} className={`cct-risk-row rounded-lg border p-2 bg-card ${item.statusRisk === "Critical" ? "cct-critical-pulse" : item.statusRisk === "High" ? "cct-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.shipment}</span>
                    <span className={`cct-risk-tag text-[10px] px-1.5 py-0.5 rounded ${riskColors[item.statusRisk] || "bg-slate-100"}`}>{item.statusRisk}</span>
                    {item.hazardClass !== "None" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-semibold">{item.hazardClass}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    <span className="text-xs font-medium">{item.dwell}d dwell</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Origin: <span className="font-medium">{item.origin}</span></div>
                  <div>Port: <span className="font-medium">{item.port}</span></div>
                  <div>Broker: <span className="font-medium">{item.broker}</span></div>
                  <div>Duty: <span className="font-medium">{formatINR(item.dutyAmount)}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
