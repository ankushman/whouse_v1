"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  RotateCcw, Recycle, Tag,
  AlertTriangle, CheckCircle, Clock,
  BarChart3, IndianRupee, Activity, ArrowRightLeft, MapPin
} from "lucide-react"

const raw = [
  { id: "RLH-01", item: "Samsung M14 128GB", reason: "Defective Display", disposition: "Refurbish", channel: "Online", dc: "Delhi DC-2", vendor: "Samsung India", pickup: "Delhivery", status: "Inspecting", received: "2026-07-28", qty: 45, refundAmt: 89955, refurbCost: 22500, resaleVal: 54000, grade: "B", turnaround: 5, carrier: "Delhivery", priority: "High" },
  { id: "RLH-02", item: "Nike Air Max 90", reason: "Wrong Size", disposition: "Restock", channel: "Online", dc: "Mumbai DC-1", vendor: "Nike India", pickup: "Xpressbee", status: "Completed", received: "2026-07-25", qty: 120, refundAmt: 0, refurbCost: 1800, resaleVal: 108000, grade: "A", turnaround: 2, carrier: "Xpressbee", priority: "Low" },
  { id: "RLH-03", item: "Amul Butter 500g", reason: "Expired", disposition: "Dispose", channel: "Retail", dc: "Kolkata DC-5", vendor: "Amul", pickup: "Self", status: "Disposing", received: "2026-07-30", qty: 200, refundAmt: 12000, refurbCost: 500, resaleVal: 0, grade: "F", turnaround: 1, carrier: "Self", priority: "Critical" },
  { id: "RLH-04", item: "boAt Airdopes 141", reason: "Battery Issue", disposition: "Refurbish", channel: "Online", dc: "Bengaluru DC-3", vendor: "boAt Lifestyle", pickup: "Ekart", status: "In Queue", received: "2026-08-01", qty: 78, refundAmt: 58482, refurbCost: 15600, resaleVal: 39000, grade: "B", turnaround: 0, carrier: "Ekart", priority: "Medium" },
  { id: "RLH-05", item: "IKEA KALLAX Shelf", reason: "Damaged in Transit", disposition: "Recycle", channel: "Online", dc: "Chennai DC-6", vendor: "IKEA India", pickup: "DTDC", status: "Processing", received: "2026-07-27", qty: 15, refundAmt: 29985, refurbCost: 0, resaleVal: 0, grade: "D", turnaround: 4, carrier: "DTDC", priority: "Medium" },
  { id: "RLH-06", item: "Parle-G 6-Pack", reason: "Customer Cancel", disposition: "Restock", channel: "Quick Commerce", dc: "Hyderabad DC-4", vendor: "Parle Products", pickup: "Shadowfax", status: "Completed", received: "2026-07-26", qty: 500, refundAmt: 0, refurbCost: 400, resaleVal: 25000, grade: "A", turnaround: 1, carrier: "Shadowfax", priority: "Low" },
  { id: "RLH-07", item: "Dabur Chyawanprash 1kg", reason: "Seal Broken", disposition: "Dispose", channel: "Pharmacy", dc: "Delhi DC-2", vendor: "Dabur India", pickup: "Delhivery", status: "Inspecting", received: "2026-07-31", qty: 85, refundAmt: 12750, refurbCost: 0, resaleVal: 0, grade: "F", turnaround: 2, carrier: "Delhivery", priority: "High" },
  { id: "RLH-08", item: "Levi's 501 Jeans", reason: "Colour Fade", disposition: "Refurbish", channel: "Online", dc: "Mumbai DC-1", vendor: "Levi's India", pickup: "BlueDart", status: "Refurbishing", received: "2026-07-29", qty: 32, refundAmt: 38336, refurbCost: 9600, resaleVal: 22400, grade: "C", turnaround: 3, carrier: "BlueDart", priority: "Medium" },
  { id: "RLH-09", item: "Noise ColorFit Pro", reason: "Software Bug", disposition: "Repair", channel: "Online", dc: "Bengaluru DC-3", vendor: "Noise India", pickup: "Ekart", status: "Completed", received: "2026-07-22", qty: 56, refundAmt: 0, refurbCost: 5600, resaleVal: 33600, grade: "A", turnaround: 6, carrier: "Ekart", priority: "High" },
  { id: "RLH-10", item: "Tata Salt 1kg x48", reason: "Packaging Damaged", disposition: "Repack", channel: "Retail", dc: "Kolkata DC-5", vendor: "Tata Consumer", pickup: "Rivigo", status: "Repackaging", received: "2026-07-30", qty: 48, refundAmt: 0, refurbCost: 2400, resaleVal: 11520, grade: "A", turnaround: 2, carrier: "Rivigo", priority: "Low" },
]

interface RLHItem {
  id: string; item: string; reason: string; disposition: string; channel: string
  dc: string; vendor: string; pickup: string; status: string; received: string
  qty: number; refundAmt: number; refurbCost: number; resaleVal: number
  grade: string; turnaround: number; carrier: string; priority: string
}

const items: RLHItem[] = raw.map((r: any) => ({
  id: r.id, item: r.item, reason: r.reason, disposition: r.disposition,
  channel: r.channel, dc: r.dc, vendor: r.vendor, pickup: r.pickup,
  status: r.status, received: r.received, qty: r.qty, refundAmt: r.refundAmt,
  refurbCost: r.refurbCost, resaleVal: r.resaleVal, grade: r.grade,
  turnaround: r.turnaround, carrier: r.carrier, priority: r.priority,
}))

const statusColors: Record<string, string> = {
  "Completed": "text-emerald-600", "Inspecting": "text-blue-600",
  "Refurbishing": "text-indigo-600", "Repackaging": "text-indigo-600",
  "Disposing": "text-red-600 font-semibold", "In Queue": "text-muted-foreground",
  "Processing": "text-amber-600",
}
const dispColors: Record<string, string> = {
  "Refurbish": "bg-blue-100 text-blue-700", "Restock": "bg-emerald-100 text-emerald-700",
  "Dispose": "bg-red-100 text-red-700", "Recycle": "bg-green-100 text-green-700",
  "Repair": "bg-indigo-100 text-indigo-700", "Repack": "bg-amber-100 text-amber-700",
}
const gradeColors: Record<string, string> = {
  "A": "text-emerald-600", "B": "text-blue-600", "C": "text-amber-600",
  "D": "text-orange-600", "F": "text-red-600 font-semibold",
}
const dispositions = [...new Set(items.map(i => i.disposition))]
const totalQty = items.reduce((s, i) => s + i.qty, 0)
const totalRefund = items.reduce((s, i) => s + i.refundAmt, 0)
const totalResale = items.reduce((s, i) => s + i.resaleVal, 0)
const totalRefurbCost = items.reduce((s, i) => s + i.refurbCost, 0)
const completed = items.filter(i => i.status === "Completed").length
const avgTurnaround = (items.filter(i => i.turnaround > 0).reduce((s, i) => s + i.turnaround, 0) / Math.max(items.filter(i => i.turnaround > 0).length, 1)).toFixed(1)
const recoveryRate = totalResale > 0 ? (((totalResale - totalRefurbCost) / Math.max(totalRefund + totalRefurbCost, 1)) * 100).toFixed(0) : "0"

type Rec = any
type FV = Record<string, string>
type VT = "returns" | "disposition" | "recovery"

function fmtINR(n: number) { if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`; if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`; return `\u20b9${(n / 1000).toFixed(1)}K` }

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`rlh-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function ReverseLogisticsHubPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("returns")

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

  const insights = [
    { icon: IndianRupee, title: "Recovery", desc: `${recoveryRate}% net recovery rate`, accent: "text-emerald-500" },
    { icon: Clock, title: "TAT", desc: `${avgTurnaround} days avg turnaround`, accent: "text-blue-500" },
    { icon: Activity, title: "Active", desc: `${items.length - completed} items in pipeline`, accent: "text-amber-500" },
  ]

  const alerts = [
    ...items.filter(i => i.disposition === "Dispose").map(i => ({ id: i.id, msg: `${i.item}: ${i.qty} units disposal \u2014 ${i.reason}`, severity: "critical" as const })),
    ...items.filter(i => i.turnaround > 5).map(i => ({ id: i.id, msg: `${i.item}: TAT ${i.turnaround} days exceeds 5-day SLA`, severity: "warning" as const })),
    ...items.filter(i => i.status === "In Queue").map(i => ({ id: i.id, msg: `${i.item}: Queued since ${i.received} \u2014 ${i.qty} units`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center"><RotateCcw className="h-4 w-4 text-teal-600" /></div>
            <div><h3 className="text-sm font-bold">Reverse Logistics Hub</h3><p className="text-xs opacity-60">{items.length} items | {totalQty.toLocaleString()} units</p></div>
          </div>
          <div className="flex gap-1">
            {(["returns", "disposition", "recovery"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "returns" ? "Returns" : v === "disposition" ? "Disposition" : "Recovery"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Completed", String(completed), CheckCircle, "bg-emerald-50/50")}
          {statCard("Total Refund", fmtINR(totalRefund), IndianRupee, "bg-red-50/50")}
          {statCard("Resale", fmtINR(totalResale), BarChart3, "bg-blue-50/50")}
          {statCard("Recovery", `${recoveryRate}%`, ArrowRightLeft, "bg-teal-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {dispositions.map(d => {
            const active = activeFilters.disposition === d
            return <span key={d} onClick={() => toggle("disposition", active ? undefined : d)} className={`rlh-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{d}</span>
          })}
          {activeFilters.disposition && <span onClick={() => toggle("disposition", undefined)} className="rlh-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="rlh-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="rlh-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Reverse Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`rlh-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "returns" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isDisposing = item.disposition === "Dispose"
              const isQueued = item.status === "In Queue"
              return (
                <div key={item.id} className={`rlh-return-card rounded-lg border p-2.5 bg-card ${isDisposing ? "rlh-dispose-pulse" : isQueued ? "rlh-queue-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="rlh-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-100 text-teal-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.item}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`rlh-disp-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${dispColors[item.disposition] || "bg-slate-100"}`}>{item.disposition}</span>
                      <span className={`rlh-grade-tag text-[10px] px-1.5 py-0.5 rounded ${gradeColors[item.grade] || ""}`}>Grade {item.grade}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><RotateCcw className="h-3 w-3 opacity-40" />{item.reason} | {item.channel}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.dc} \u2014 {item.carrier} pickup</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Received: {item.received} | TAT: {item.turnaround}d</div>
                    <div className="flex items-center gap-1"><Tag className="h-3 w-3 opacity-40" />{item.qty} units | {item.vendor}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Refund: <span className={`font-medium ${item.refundAmt > 0 ? "text-red-600" : "text-foreground"}`}>{item.refundAmt > 0 ? fmtINR(item.refundAmt) : "\u2014"}</span></div>
                    <div>Refurb: <span className="font-medium text-foreground">{fmtINR(item.refurbCost)}</span></div>
                    <div>Resale: <span className="font-medium text-emerald-600">{item.resaleVal > 0 ? fmtINR(item.resaleVal) : "\u2014"}</span></div>
                    <div><span className={`font-medium ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "disposition" && (
          <div className="space-y-2">
            {dispositions.map(disp => {
              const dItems = items.filter(i => i.disposition === disp)
              const dQty = dItems.reduce((s, i) => s + i.qty, 0)
              const dRefund = dItems.reduce((s, i) => s + i.refundAmt, 0)
              const dResale = dItems.reduce((s, i) => s + i.resaleVal, 0)
              const dCost = dItems.reduce((s, i) => s + i.refurbCost, 0)
              return (
                <div key={disp} className="rlh-disp-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`rlh-disp-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${dispColors[disp] || "bg-slate-100"}`}>{disp}</span>
                      <span className="text-xs font-semibold">{dQty} units</span>
                    </div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-red-600">Loss: {fmtINR(dRefund)}</span>
                      <span className="text-emerald-600">Recovery: {fmtINR(dResale)}</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    {dItems.map(di => (
                      <div key={di.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{di.id}</span>{di.item.slice(0, 20)} <span className="opacity-40">x{di.qty}</span></span>
                        <span className={statusColors[di.status] || ""}>{di.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">Cost: {fmtINR(dCost)} | Net: <span className={`font-medium ${dResale > dCost + dRefund ? "text-emerald-600" : "text-red-600"}`}>{fmtINR(dResale - dCost - dRefund)}</span></div>
                </div>
              )
            })}
          </div>
        )}

        {view === "recovery" && (
          <div className="space-y-2">
            <div className="rlh-recovery-header rounded-lg border p-2 bg-teal-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{fmtINR(totalRefund)}</div><div className="text-[10px] opacity-50">Total Refunds</div></div>
                <div><div className="text-lg font-bold text-amber-600">{fmtINR(totalRefurbCost)}</div><div className="text-[10px] opacity-50">Refurb Cost</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{fmtINR(totalResale)}</div><div className="text-[10px] opacity-50">Resale Value</div></div>
                <div><div className="text-lg font-bold text-teal-600">{recoveryRate}%</div><div className="text-[10px] opacity-50">Recovery Rate</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.resaleVal - a.resaleVal).map(item => {
              const net = item.resaleVal - item.refurbCost - item.refundAmt
              return (
                <div key={item.id} className="rlh-recovery-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.item}</span>
                      <span className={`rlh-grade-tag text-[10px] px-1.5 py-0.5 rounded ${gradeColors[item.grade] || ""}`}>{item.grade}</span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${net > 0 ? "text-emerald-600" : "text-red-600"}`}>{net > 0 ? "+" : ""}{fmtINR(net)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Refund: <span className="font-medium">{fmtINR(item.refundAmt)}</span></div>
                    <div>Refurb: <span className="font-medium">{fmtINR(item.refurbCost)}</span></div>
                    <div>Resale: <span className="font-medium text-emerald-600">{fmtINR(item.resaleVal)}</span></div>
                    <div>TAT: <span className="font-medium">{item.turnaround}d</span></div>
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
