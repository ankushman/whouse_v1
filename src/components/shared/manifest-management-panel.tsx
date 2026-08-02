"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText, AlertTriangle, CheckCircle, XCircle, Clock, Truck, ArrowUpDown, Shield, ClipboardCheck, Hash, Package
} from "lucide-react"

const raw = [
  { id: "MFM-01", manifest: "MNF/MUM/2024/0842", vessel: "MSC Isabella", pol: "Nhava Sheva", pod: "Rotterdam", shipper: "Tata Steel Ltd", consignee: "BMW AG Munich", hs: "7208.10", value: 2450000, pkgs: 120, weight: 28500, cargo: "Hot Rolled Coils", incoterm: "CIF", mode: "FCL", lines: 8, docStat: "Complete", custStat: "Cleared", duty: 482000, broker: "ABC Customs", city: "Mumbai", region: "West", status: "Cleared", age: 5 },
  { id: "MFM-02", manifest: "MNF/DEL/2024/1103", vessel: "N/A", pol: "IGI Airport", pod: "Dubai DXB", shipper: "Raymond Ltd", consignee: "Al Futtaim Motors", hs: "6203.42", value: 1850000, pkgs: 450, weight: 2200, cargo: "Men's Suits", incoterm: "FOB", mode: "Air", lines: 12, docStat: "Pending EGM", custStat: "Exam Pending", duty: 296000, broker: "V-export Logistics", city: "Delhi", region: "North", status: "Exam Pending", age: 3 },
  { id: "MFM-03", manifest: "MNF/CHN/2024/0678", vessel: "CMA Marco Polo", pol: "Chennai Port", pod: "Singapore", shipper: "TVS Motor Co", consignee: "PT Astra Honda", hs: "8711.60", value: 920000, pkgs: 85, weight: 18500, cargo: "Motorcycle Engines", incoterm: "CFR", mode: "FCL", lines: 5, docStat: "Complete", custStat: "Cleared", duty: 138000, broker: "Seaways Shipping", city: "Chennai", region: "South", status: "Cleared", age: 2 },
  { id: "MFM-04", manifest: "MNF/KOL/2024/0392", vessel: "Maersk Sealand", pol: "Kolkata Port", pod: "Chittagong", shipper: "Exide Industries", consignee: "RSRM Bangladesh", hs: "8507.60", value: 680000, pkgs: 200, weight: 12000, cargo: "Lead Acid Batteries", incoterm: "DDP", mode: "LCL", lines: 15, docStat: "Pending License", custStat: "On Hold", duty: 118000, broker: "Continental Shipping", city: "Kolkata", region: "East", status: "On Hold", age: 12 },
  { id: "MFM-05", manifest: "MFN/MUN/2024/0921", vessel: "Ever Given", pol: "Mundra Port", pod: "Jebel Ali", shipper: "Adani Wilmar", consignee: "IFFCO UAE", hs: "1511.10", value: 3200000, pkgs: 800, weight: 42000, cargo: "Crude Palm Oil", incoterm: "FOB", mode: "Bulk", lines: 3, docStat: "Complete", custStat: "Cleared", duty: 640000, broker: "Adani Logistics", city: "Ahmedabad", region: "West", status: "Cleared", age: 4 },
  { id: "MFM-06", manifest: "MNF/BLR/2024/1456", vessel: "N/A", pol: "Kempegowda Airport", pod: "Frankfurt FRA", shipper: "Infosys Ltd", consignee: "SAP SE", hs: "8523.51", value: 420000, pkgs: 25, weight: 180, cargo: "Software Licenses", incoterm: "DDP", mode: "Air", lines: 1, docStat: "Complete", custStat: "Cleared", duty: 0, broker: "DHL Customs", city: "Bengaluru", region: "South", status: "Cleared", age: 1 },
  { id: "MFM-07", manifest: "MNF/HYD/2024/0784", vessel: "Yang Ming Unity", pol: "Visakhapatnam", pod: "Shanghai", shipper: "Dr Reddys Labs", consignee: "Sinopharm China", hs: "3004.90", value: 8900000, pkgs: 320, weight: 8500, cargo: "Pharmaceutical API", incoterm: "CIF", mode: "FCL", lines: 22, docStat: "Pending Test Cert", custStat: "Exam Pending", duty: 890000, broker: "Vijai Marine", city: "Hyderabad", region: "South", status: "Exam Pending", age: 8 },
  { id: "MFM-08", manifest: "MNF/COC/2024/0235", vessel: "COSCO Harmony", pol: "Cochin Port", pod: "Colombo", shipper: "SpiceJet Foods", consignee: "Cargills Ceylon", hs: "0901.11", value: 250000, pkgs: 1500, weight: 6000, cargo: "Robusta Coffee", incoterm: "FOB", mode: "FCL", lines: 8, docStat: "Complete", custStat: "Cleared", duty: 50000, broker: "Transworld Shipping", city: "Kochi", region: "South", status: "Cleared", age: 3 },
  { id: "MFM-09", manifest: "MNF/JAI/2024/0567", vessel: "Hapag Lloyd Express", pol: "Kandla Port", pod: "Bandar Abbas", shipper: "Gem Granites", consignee: "Isfahan Marble Co", hs: "6802.91", value: 1100000, pkgs: 45, weight: 32000, cargo: "Granite Blocks", incoterm: "FOB", mode: "Break Bulk", lines: 4, docStat: "Pending QC", custStat: "Pending", duty: 198000, broker: "Shreyas Shipping", city: "Jaipur", region: "North", status: "Pending", age: 6 },
  { id: "MFM-10", manifest: "MNF/LKO/2024/0418", vessel: "N/A", pol: "Lucknow Airport", pod: "Heathrow LHR", shipper: "Rainbow Children's Med", consignee: "GSK UK", hs: "3002.10", value: 5200000, pkgs: 60, weight: 950, cargo: "Pediatric Vaccines", incoterm: "DAP", mode: "Air", lines: 6, docStat: "WHO Prequal Pending", custStat: "On Hold", duty: 0, broker: "FedEx Trade Services", city: "Lucknow", region: "North", status: "On Hold", age: 15 },
]

interface MFMItem {
  id: string; manifest: string; vessel: string; pol: string; pod: string
  shipper: string; consignee: string; hs: string; value: number; pkgs: number
  weight: number; cargo: string; incoterm: string; mode: string; lines: number
  docStat: string; custStat: string; duty: number; broker: string
  city: string; region: string; status: string; age: number
}

const items: MFMItem[] = raw.map((r: any) => ({
  id: r.id, manifest: r.manifest, vessel: r.vessel, pol: r.pol, pod: r.pod,
  shipper: r.shipper, consignee: r.consignee, hs: r.hs, value: r.value, pkgs: r.pkgs,
  weight: r.weight, cargo: r.cargo, incoterm: r.incoterm, mode: r.mode, lines: r.lines,
  docStat: r.docStat, custStat: r.custStat, duty: r.duty, broker: r.broker,
  city: r.city, region: r.region, status: r.status, age: r.age,
}))

const statusColors: Record<string, string> = {
  "Cleared": "text-emerald-600 font-semibold", "Pending": "text-blue-600 font-semibold",
  "Exam Pending": "text-amber-600 font-semibold", "On Hold": "text-red-600 font-semibold",
}
const modeColors: Record<string, string> = {
  "FCL": "bg-blue-100 text-blue-700", "LCL": "bg-purple-100 text-purple-700",
  "Air": "bg-cyan-100 text-cyan-700", "Bulk": "bg-amber-100 text-amber-700",
  "Break Bulk": "bg-orange-100 text-orange-700",
}
const docStatColors: Record<string, string> = {
  "Complete": "bg-emerald-100 text-emerald-700", "Pending EGM": "bg-amber-100 text-amber-700",
  "Pending License": "bg-red-100 text-red-700", "Pending Test Cert": "bg-orange-100 text-orange-700",
  "Pending QC": "bg-amber-100 text-amber-700", "WHO Prequal Pending": "bg-red-100 text-red-800",
}
const regions = [...new Set(items.map(i => i.region))]
const totalValue = items.reduce((s, i) => s + i.value, 0)
const totalDuty = items.reduce((s, i) => s + i.duty, 0)
const avgAge = Math.round(items.reduce((s, i) => s + i.age, 0) / items.length * 10) / 10
const onHold = items.filter(i => i.status === "On Hold").length

type Rec = any
type FV = Record<string, string>
type VT = "manifests" | "documents" | "financials"

function formatINR(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `\u20b9${(n / 1000).toFixed(1)}K`
  return `\u20b9${n}`
}

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`mfm-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function ManifestManagementPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("manifests")

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
    ...items.filter(i => i.status === "On Hold").map(i => ({ id: i.id, msg: `${i.manifest}: ON HOLD \u2014 ${i.docStat}, ${i.cargo}, HS ${i.hs}, age ${i.age}d, broker ${i.broker}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Exam Pending").map(i => ({ id: i.id, msg: `${i.manifest}: EXAM PENDING \u2014 ${i.custStat}, ${i.lines} lines, duty ${formatINR(i.duty)}, ${i.pkgs} packages`, severity: "warning" as const })),
    ...items.filter(i => i.age > 10).map(i => ({ id: i.id, msg: `${i.manifest}: STALE MANIFEST \u2014 ${i.age}d old, ${i.status}, shipper ${i.shipper}, value ${formatINR(i.value)}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: FileText, title: "Total Value", desc: `${formatINR(totalValue)} across ${items.length} manifests | avg age ${avgAge}d`, accent: totalValue > 20000000 ? "text-blue-500" : "text-emerald-500" },
    { icon: ClipboardCheck, title: "Doc Status", desc: `${items.filter(i => i.docStat === "Complete").length}/${items.length} complete | ${items.filter(i => i.docStat.startsWith("Pending")).length} pending`, accent: onHold > 1 ? "text-red-500" : "text-emerald-500" },
    { icon: Shield, title: "Duty & Tax", desc: `${formatINR(totalDuty)} total duty | ${items.filter(i => i.duty === 0).length} exempt`, accent: "text-indigo-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sky-100 flex items-center justify-center"><FileText className="h-4 w-4 text-sky-600" /></div>
            <div><h3 className="text-sm font-bold">Manifest Management</h3><p className="text-xs opacity-60">{items.length} manifests | {regions.length} regions</p></div>
          </div>
          <div className="flex gap-1">
            {(["manifests", "documents", "financials"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "manifests" ? "Manifests" : v === "documents" ? "Documents" : "Financials"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Manifests", items.length.toString(), Hash, "bg-sky-50/50")}
          {statCard("Total Value", formatINR(totalValue), Package, "bg-blue-50/50")}
          {statCard("On Hold", onHold.toString(), AlertTriangle, "bg-red-50/50")}
          {statCard("Avg Age", `${avgAge}d`, Clock, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {regions.map(t => {
            const active = activeFilters.region === t
            return <span key={t} onClick={() => toggle("region", active ? undefined : t)} className={`mfm-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="mfm-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="mfm-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="mfm-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Manifest Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`mfm-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "manifests" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isHold = item.status === "On Hold"
              const isExam = item.status === "Exam Pending"
              return (
                <div key={item.id} className={`mfm-manifest-card rounded-lg border p-2.5 bg-card ${isHold ? "mfm-hold-pulse" : isExam ? "mfm-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="mfm-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.manifest}</span>
                      <span className={`mfm-mode-tag text-[10px] px-1.5 py-0.5 rounded ${modeColors[item.mode] || "bg-slate-100"}`}>{item.mode}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`mfm-doc-tag text-[10px] px-1.5 py-0.5 rounded ${docStatColors[item.docStat] || "bg-slate-100"}`}>{item.docStat}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isHold ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Cleared" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 opacity-40" />{item.vessel !== "N/A" ? item.vessel : "Air Shipment"}</div>
                    <div className="flex items-center gap-1"><ArrowUpDown className="h-3 w-3 opacity-40" />{item.pol} <span className="opacity-40">\u2192</span> {item.pod}</div>
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.shipper} <span className="opacity-40">\u2192</span> {item.consignee.split(" ").slice(0, 2).join(" ")}</div>
                    <div className="flex items-center gap-1"><Shield className="h-3 w-3 opacity-40" />HS: <span className="font-mono">{item.hs}</span> | {item.incoterm}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Cargo: <span className="font-medium">{item.cargo}</span></div>
                    <div>Value: <span className="font-medium">{formatINR(item.value)}</span></div>
                    <div>{item.weight >= 1000 ? `Weight: <span className="font-medium">${(item.weight / 1000).toFixed(1)}T</span>` : `Pkgs: <span className="font-medium">${item.pkgs.toLocaleString()}</span>`}</div>
                    <div>Age: <span className={`font-medium ${item.age > 10 ? "text-red-600" : "text-foreground"}`}>{item.age}d</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "documents" && (
          <div className="space-y-2">
            <div className="mfm-doc-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.docStat === "Complete").length}/{items.length}</div><div className="text-[10px] opacity-50">Docs Complete</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.docStat.startsWith("Pending")).length}</div><div className="text-[10px] opacity-50">Pending Docs</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.reduce((s, i) => s + i.lines, 0)}</div><div className="text-[10px] opacity-50">Total Lines</div></div>
                <div><div className="text-lg font-bold text-red-600">{onHold}</div><div className="text-[10px] opacity-50">On Hold</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.age - b.age).map(item => {
              const completePct = item.docStat === "Complete" ? 100 : item.docStat.startsWith("Pending") ? 40 : 20
              return (
              <div key={item.id} className={`mfm-doc-row rounded-lg border p-2 bg-card ${item.status === "On Hold" ? "mfm-hold-pulse" : item.status === "Exam Pending" ? "mfm-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.manifest}</span>
                    <span className={`mfm-mode-tag text-[10px] px-1.5 py-0.5 rounded ${modeColors[item.mode] || "bg-slate-100"}`}>{item.mode}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.docStat === "Complete" ? "text-emerald-600" : "text-amber-600"}`}>{item.lines} lines</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${completePct === 100 ? "bg-emerald-500" : completePct >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${completePct}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Doc: <span className={`font-medium ${docStatColors[item.docStat] ? "" : ""}`}>{item.docStat}</span></div>
                  <div>Customs: <span className="font-medium">{item.custStat}</span></div>
                  <div>Age: <span className={`font-medium ${item.age > 10 ? "text-red-600" : "text-foreground"}`}>{item.age}d</span></div>
                  <div>Broker: <span className="font-medium">{item.broker.split(" ")[0]}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}

        {view === "financials" && (
          <div className="space-y-2">
            <div className="mfm-fin-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{formatINR(totalValue)}</div><div className="text-[10px] opacity-50">Total Value</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{formatINR(totalDuty)}</div><div className="text-[10px] opacity-50">Total Duty</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{Math.round(totalDuty / totalValue * 100)}%</div><div className="text-[10px] opacity-50">Effective Rate</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.duty === 0).length}</div><div className="text-[10px] opacity-50">Exempt</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.value - a.value).map(item => {
              const valuePct = Math.round(item.value / items[0].value * 100)
              return (
              <div key={item.id} className={`mfm-fin-row rounded-lg border p-2 bg-card ${item.status === "On Hold" ? "mfm-hold-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.cargo}</span>
                    <span className="text-[10px] text-muted-foreground">{item.shipper.split(" ")[0]}</span>
                  </div>
                  <span className="text-xs font-bold">{formatINR(item.value)}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${valuePct >= 50 ? "bg-blue-500" : valuePct >= 20 ? "bg-indigo-500" : "bg-sky-400"}`} style={{ width: `${valuePct}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Duty: <span className="font-medium">{formatINR(item.duty)}</span></div>
                  <div>Incoterm: <span className="font-medium">{item.incoterm}</span></div>
                  <div>Pkgs: <span className="font-medium">{item.pkgs.toLocaleString()}</span></div>
                  <div>Status: <span className={`font-medium ${statusColors[item.status] || "text-foreground"}`}>{item.status}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
