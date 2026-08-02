"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertOctagon, Siren, Clock, ShieldAlert,
  CheckCircle, XCircle, AlertTriangle, IndianRupee,
  Truck, MapPin, User
} from "lucide-react"

const raw = [
  { id: "SEM-01", shipment: "SH-48291", lane: "Mumbai-Delhi", excType: "Delay", severity: "Medium", escalation: "L2 Supervisor", rootCause: "Carrier Delay", resTime: 8, impact: 45000, custImpact: 4, slaBreach: false, carrier: "Rivigo", status: "Resolved", city: "Delhi", dc: "Delhi DC2", month: "Aug 2026", assignedTo: "Rajesh K.", reported: "01-Aug 14:30", resolved: "01-Aug 22:30" },
  { id: "SEM-02", shipment: "SH-48302", lane: "Chennai-Kolkata", excType: "Damage", severity: "High", escalation: "L3 Manager", rootCause: "Road Condition", resTime: 24, impact: 185000, custImpact: 7, slaBreach: true, carrier: "SafeExpress", status: "Open", city: "Kolkata", dc: "Kolkata DC7", month: "Aug 2026", assignedTo: "Priya M.", reported: "02-Aug 08:15", resolved: "" },
  { id: "SEM-03", shipment: "SH-48315", lane: "Bengaluru-Pune", excType: "Misroute", severity: "Low", escalation: "L1 Agent", rootCause: "Documentation Error", resTime: 3, impact: 8000, custImpact: 2, slaBreach: false, carrier: "Delhivery", status: "Closed", city: "Pune", dc: "Pune DC6", month: "Aug 2026", assignedTo: "Amit S.", reported: "28-Jul 11:00", resolved: "28-Jul 14:00" },
  { id: "SEM-04", shipment: "SH-48328", lane: "Kolkata-Mumbai", excType: "Customs Hold", severity: "Critical", escalation: "L4 Director", rootCause: "Documentation Error", resTime: 48, impact: 520000, custImpact: 9, slaBreach: true, carrier: "Maersk India", status: "Escalated", city: "Mumbai", dc: "Mumbai DC1", month: "Aug 2026", assignedTo: "Sunita R.", reported: "31-Jul 06:45", resolved: "" },
  { id: "SEM-05", shipment: "SH-48341", lane: "Delhi-Hyderabad", excType: "Shortage", severity: "Medium", escalation: "L2 Supervisor", rootCause: "Carrier Delay", resTime: 12, impact: 62000, custImpact: 5, slaBreach: false, carrier: "TCI Express", status: "Resolved", city: "Hyderabad", dc: "Hyderabad DC5", month: "Aug 2026", assignedTo: "Vikram D.", reported: "30-Jul 16:20", resolved: "31-Jul 04:20" },
  { id: "SEM-06", shipment: "SH-48355", lane: "Pune-Ahmedabad", excType: "Weather Disruption", severity: "High", escalation: "L3 Manager", rootCause: "Weather", resTime: 36, impact: 298000, custImpact: 8, slaBreach: true, carrier: "Shadowfax", status: "Open", city: "Ahmedabad", dc: "Ahmedabad DC8", month: "Aug 2026", assignedTo: "Neha P.", reported: "01-Aug 03:10", resolved: "" },
  { id: "SEM-07", shipment: "SH-48368", lane: "Hyderabad-Jaipur", excType: "Carrier Failure", severity: "Critical", escalation: "L4 Director", rootCause: "Carrier Delay", resTime: 72, impact: 850000, custImpact: 10, slaBreach: true, carrier: "Ecom Express", status: "Open", city: "Jaipur", dc: "Jaipur DC9", month: "Aug 2026", assignedTo: "Deepak T.", reported: "29-Jul 22:00", resolved: "" },
  { id: "SEM-08", shipment: "SH-48381", lane: "Ahmedabad-Chennai", excType: "Address Mismatch", severity: "Low", escalation: "L1 Agent", rootCause: "Documentation Error", resTime: 2, impact: 5000, custImpact: 1, slaBreach: false, carrier: "XpressBees", status: "Closed", city: "Chennai", dc: "Chennai DC4", month: "Aug 2026", assignedTo: "Kavita J.", reported: "27-Jul 09:30", resolved: "27-Jul 11:30" },
  { id: "SEM-09", shipment: "SH-48394", lane: "Jaipur-Lucknow", excType: "Delay", severity: "Medium", escalation: "L2 Supervisor", rootCause: "Road Condition", resTime: 16, impact: 78000, custImpact: 5, slaBreach: false, carrier: "Rivigo", status: "Resolved", city: "Lucknow", dc: "Lucknow DC10", month: "Aug 2026", assignedTo: "Manoj G.", reported: "30-Jul 07:45", resolved: "30-Jul 23:45" },
  { id: "SEM-10", shipment: "SH-48407", lane: "Mumbai-Bengaluru", excType: "Damage", severity: "High", escalation: "L3 Manager", rootCause: "Road Condition", resTime: 18, impact: 325000, custImpact: 7, slaBreach: true, carrier: "BlueDart", status: "Escalated", city: "Bengaluru", dc: "Bengaluru DC3", month: "Aug 2026", assignedTo: "Anita V.", reported: "01-Aug 12:00", resolved: "" },
]

interface SEMItem {
  id: string; shipment: string; lane: string; excType: string; severity: string
  escalation: string; rootCause: string; resTime: number; impact: number
  custImpact: number; slaBreach: boolean; carrier: string; status: string
  city: string; dc: string; month: string; assignedTo: string
  reported: string; resolved: string
}

const items: SEMItem[] = raw.map((r: any) => ({
  id: r.id, shipment: r.shipment, lane: r.lane, excType: r.excType, severity: r.severity,
  escalation: r.escalation, rootCause: r.rootCause, resTime: r.resTime, impact: r.impact,
  custImpact: r.custImpact, slaBreach: r.slaBreach, carrier: r.carrier, status: r.status,
  city: r.city, dc: r.dc, month: r.month, assignedTo: r.assignedTo,
  reported: r.reported, resolved: r.resolved,
}))

const statusColors: Record<string, string> = {
  "Open": "text-red-600 font-semibold", "Escalated": "text-orange-600 font-semibold",
  "Resolved": "text-emerald-600 font-semibold", "Closed": "text-slate-500 font-semibold",
}
const excColors: Record<string, string> = {
  "Delay": "bg-amber-100 text-amber-700", "Damage": "bg-red-100 text-red-700",
  "Misroute": "bg-purple-100 text-purple-700", "Shortage": "bg-orange-100 text-orange-700",
  "Customs Hold": "bg-indigo-100 text-indigo-700", "Weather Disruption": "bg-cyan-100 text-cyan-700",
  "Carrier Failure": "bg-rose-100 text-rose-700", "Address Mismatch": "bg-slate-100 text-slate-700",
}
const sevColors: Record<string, string> = {
  "Low": "bg-emerald-100 text-emerald-700", "Medium": "bg-amber-100 text-amber-700",
  "High": "bg-orange-100 text-orange-700", "Critical": "bg-red-100 text-red-700",
}
const rcaColors: Record<string, string> = {
  "Carrier Delay": "bg-blue-100 text-blue-700", "Weather": "bg-cyan-100 text-cyan-700",
  "Road Condition": "bg-amber-100 text-amber-700", "Documentation Error": "bg-purple-100 text-purple-700",
}
const statuses = [...new Set(items.map(i => i.status))]
const totalImpact = items.reduce((s, i) => s + i.impact, 0)
const slaBreaches = items.filter(i => i.slaBreach).length
const openItems = items.filter(i => i.status === "Open" || i.status === "Escalated").length

type Rec = any
type FV = Record<string, string>
type VT = "exceptions" | "rca" | "impact"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`sem-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function ShippingExceptionManagementPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("exceptions")

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
    ...items.filter(i => i.status === "Open" && i.severity === "Critical").map(i => ({ id: i.id, msg: `${i.shipment}: CRITICAL ${i.excType} \u2014 ${i.lane}, ${i.resTime}h unresolved, impact ${formatINR(i.impact)}, cust score ${i.custImpact}/10`, severity: "critical" as const })),
    ...items.filter(i => i.slaBreach && (i.status === "Open" || i.status === "Escalated")).map(i => ({ id: i.id, msg: `${i.shipment}: SLA BREACH \u2014 ${i.excType}, ${i.escalation}, ${i.resTime}h resolution time`, severity: "warning" as const })),
    ...items.filter(i => i.custImpact >= 8).map(i => ({ id: i.id, msg: `${i.shipment}: High customer impact (${i.custImpact}/10) \u2014 ${i.carrier}, ${i.lane}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Siren, title: "Open Cases", desc: `${openItems}/${items.length} exceptions need resolution`, accent: openItems > 4 ? "text-red-500" : "text-amber-500" },
    { icon: IndianRupee, title: "Financial Impact", desc: `${formatINR(totalImpact)} total across exceptions`, accent: "text-red-500" },
    { icon: ShieldAlert, title: "SLA Breaches", desc: `${slaBreaches}/${items.length} shipments breached SLA`, accent: slaBreaches > 3 ? "text-red-500" : "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center"><AlertOctagon className="h-4 w-4 text-rose-600" /></div>
            <div><h3 className="text-sm font-bold">Shipping Exception Management</h3><p className="text-xs opacity-60">{items.length} exceptions | {statuses.length} statuses</p></div>
          </div>
          <div className="flex gap-1">
            {(["exceptions", "rca", "impact"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "exceptions" ? "Exceptions" : v === "rca" ? "RCA" : "Impact"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Exceptions", items.length.toString(), AlertOctagon, "bg-rose-50/50")}
          {statCard("Open", `${openItems}`, Siren, "bg-amber-50/50")}
          {statCard("SLA Breach", `${slaBreaches}/${items.length}`, ShieldAlert, "bg-red-50/50")}
          {statCard("Impact", formatINR(totalImpact), IndianRupee, "bg-purple-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {statuses.map(s => {
            const active = activeFilters.status === s
            return <span key={s} onClick={() => toggle("status", active ? undefined : s)} className={`sem-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="sem-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="sem-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="sem-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Exception Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`sem-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "exceptions" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isOpen = item.status === "Open"
              const isEscalated = item.status === "Escalated"
              const isCritical = item.severity === "Critical"
              return (
                <div key={item.id} className={`sem-exc-card rounded-lg border p-2.5 bg-card ${isCritical && isOpen ? "sem-critical-pulse" : isOpen || isEscalated ? "sem-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="sem-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.shipment}</span>
                      <span className={`sem-exc-tag text-[10px] px-1.5 py-0.5 rounded ${excColors[item.excType] || "bg-slate-100"}`}>{item.excType}</span>
                      <span className={`sem-sev-tag text-[10px] px-1.5 py-0.5 rounded ${sevColors[item.severity] || "bg-slate-100"}`}>{item.severity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.slaBreach && <span className="sem-sla-badge text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold">SLA BREACH</span>}
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isOpen ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Resolved" || item.status === "Closed" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 opacity-40" />{item.carrier} | {item.lane}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.city} | {item.dc}</div>
                    <div className="flex items-center gap-1"><User className="h-3 w-3 opacity-40" />{item.assignedTo} | {item.escalation}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Reported: {item.reported}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Resolution: <span className={`font-bold ${item.resTime > 24 ? "text-red-600" : item.resTime > 8 ? "text-amber-600" : "text-emerald-600"}`}>{item.resTime}h</span></div>
                    <div>Impact: <span className="font-bold">{formatINR(item.impact)}</span></div>
                    <div>Cust Score: <span className={`font-bold ${item.custImpact >= 8 ? "text-red-600" : item.custImpact >= 5 ? "text-amber-600" : "text-emerald-600"}`}>{item.custImpact}/10</span></div>
                    <div>Root Cause: <span className="font-medium">{item.rootCause}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "rca" && (
          <div className="space-y-2">
            <div className="sem-rca-header rounded-lg border p-2 bg-purple-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-purple-600">{[...new Set(items.map(i => i.rootCause))].length}</div><div className="text-[10px] opacity-50">Root Causes</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.rootCause === "Carrier Delay").length}</div><div className="text-[10px] opacity-50">Carrier Delay</div></div>
                <div><div className="text-lg font-bold text-blue-600">{formatINR(items.reduce((s, i) => s + i.impact, 0))}</div><div className="text-[10px] opacity-50">Total Impact</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.round(items.reduce((s, i) => s + i.resTime, 0) / items.length)}h</div><div className="text-[10px] opacity-50">Avg Resolution</div></div>
              </div>
            </div>
            {[...new Set(items.map(i => i.rootCause))].map(cause => {
              const rcaItems = items.filter(i => i.rootCause === cause)
              const rcaCount = rcaItems.length
              const rcaImpact = rcaItems.reduce((s, i) => s + i.impact, 0)
              const rcaAvgRes = Math.round(rcaItems.reduce((s, i) => s + i.resTime, 0) / rcaCount)
              const rcaAvgCust = (rcaItems.reduce((s, i) => s + i.custImpact, 0) / rcaCount).toFixed(1)
              return (
                <div key={cause} className="sem-rca-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`sem-rca-tag text-[10px] px-1.5 py-0.5 rounded ${rcaColors[cause] || "bg-slate-100"}`}>{cause}</span>
                      <span className="text-[10px] text-muted-foreground">{rcaCount} exception(s)</span>
                    </div>
                    <span className="text-xs font-bold">{formatINR(rcaImpact)} impact</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.min(rcaCount / items.length * 100 * 2, 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Count: <span className="font-medium">{rcaCount}</span></div>
                    <div>Avg Time: <span className={`font-medium ${rcaAvgRes > 24 ? "text-red-600" : "text-foreground"}`}>{rcaAvgRes}h</span></div>
                    <div>SLA Breach: <span className={`font-medium ${rcaItems.filter(i => i.slaBreach).length > 0 ? "text-red-600" : "text-foreground"}`}>{rcaItems.filter(i => i.slaBreach).length}/{rcaCount}</span></div>
                    <div>Avg Cust: <span className="font-medium">{rcaAvgCust}/10</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "impact" && (
          <div className="space-y-2">
            <div className="sem-imp-header rounded-lg border p-2 bg-red-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{formatINR(totalImpact)}</div><div className="text-[10px] opacity-50">Total Impact</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.max(...items.map(i => i.impact))}</div><div className="text-[10px] opacity-50">Max Single</div></div>
                <div><div className="text-lg font-bold text-orange-600">{items.filter(i => i.custImpact >= 8).length}</div><div className="text-[10px] opacity-50">High Cust Impact</div></div>
                <div><div className="text-lg font-bold text-rose-600">{slaBreaches}</div><div className="text-[10px] opacity-50">SLA Breaches</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.impact - a.impact).map(item => (
              <div key={item.id} className={`sem-imp-row rounded-lg border p-2 bg-card ${item.impact > 500000 ? "sem-critical-pulse" : item.impact > 200000 ? "sem-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.shipment}</span>
                    <span className={`sem-exc-tag text-[10px] px-1.5 py-0.5 rounded ${excColors[item.excType] || "bg-slate-100"}`}>{item.excType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.slaBreach && <span className="text-[10px] text-red-600 font-semibold">SLA BREACH</span>}
                    <span className="text-xs font-bold">{formatINR(item.impact)}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.custImpact >= 8 ? "bg-red-500" : item.custImpact >= 5 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${item.custImpact * 10}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Cust Score: <span className={`font-medium ${item.custImpact >= 8 ? "text-red-600" : "text-foreground"}`}>{item.custImpact}/10</span></div>
                  <div>Resolution: <span className="font-medium">{item.resTime}h</span></div>
                  <div>Carrier: <span className="font-medium">{item.carrier}</span></div>
                  <div>Status: <span className={`font-medium ${statusColors[item.status] || ""}`}>{item.status}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
