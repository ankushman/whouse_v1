"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  RotateCcw, Package, AlertTriangle, CheckCircle, XCircle,
  TrendingDown, Activity, Clock, Trash2, RefreshCw, BarChart3, Tag
} from "lucide-react"

const raw = [
  { id: "RPA-01", rma: "RMA-2026-12045", product: "iPhone 15 Pro Case", category: "Electronics", reason: "Wrong Item", warehouse: "Mumbai DC1", received: 85, inspected: 82, grade: "A", resolution: "Restock", refund: 0, credit: 2550, turnaround: 24, carrier: "Delhivery", origin: "B2C", value: 212500, status: "Completed", city: "Mumbai" },
  { id: "RPA-02", rma: "RMA-2026-12046", product: "Cotton Kurta Set", category: "Fashion", reason: "Size Issue", warehouse: "Delhi DC2", received: 120, inspected: 118, grade: "B", resolution: "Restock", refund: 0, credit: 9600, turnaround: 36, carrier: "Shadowfax", origin: "Marketplace", value: 588000, status: "Completed", city: "Delhi" },
  { id: "RPA-03", rma: "RMA-2026-12047", product: "Basmati Rice 5kg", category: "FMCG", reason: "Damaged", warehouse: "Bengaluru DC3", received: 45, inspected: 40, grade: "C", resolution: "Dispose", refund: 13500, credit: 0, turnaround: 48, carrier: "Rivigo", origin: "B2B", value: 67500, status: "Processing", city: "Bengaluru" },
  { id: "RPA-04", rma: "RMA-2026-12048", product: "Power Bank 10000mAh", category: "Electronics", reason: "Defective", warehouse: "Kolkata DC7", received: 200, inspected: 195, grade: "D", resolution: "Vendor Return", refund: 0, credit: 150000, turnaround: 72, carrier: "Ecom Express", origin: "B2C", value: 600000, status: "Pending", city: "Kolkata" },
  { id: "RPA-05", rma: "RMA-2026-12049", product: "Running Shoes Size 9", category: "Fashion", reason: "Colour Mismatch", warehouse: "Pune DC6", received: 65, inspected: 64, grade: "A", resolution: "Restock", refund: 0, credit: 32500, turnaround: 18, carrier: "XpressBees", origin: "D2C", value: 227500, status: "Completed", city: "Pune" },
  { id: "RPA-06", rma: "RMA-2026-12050", product: "LED Bulb Pack of 4", category: "Home", reason: "Damaged", warehouse: "Chennai DC4", received: 180, inspected: 120, grade: "C", resolution: "Dispose", refund: 72000, credit: 0, turnaround: 60, carrier: "Ekart", origin: "Marketplace", value: 216000, status: "Overdue", city: "Chennai" },
  { id: "RPA-07", rma: "RMA-2026-12051", product: "Protein Powder 1kg", category: "Health", reason: "Expired", warehouse: "Hyderabad DC5", received: 30, inspected: 28, grade: "D", resolution: "Dispose", refund: 21000, credit: 0, turnaround: 42, carrier: "BlueDart", origin: "B2C", value: 63000, status: "Processing", city: "Hyderabad" },
  { id: "RPA-08", rma: "RMA-2026-12052", product: "Herbal Shampoo 500ml", category: "FMCG", reason: "Customer Changed Mind", warehouse: "Ahmedabad DC8", received: 95, inspected: 94, grade: "A", resolution: "Restock", refund: 0, credit: 14250, turnaround: 20, carrier: "Delhivery", origin: "B2C", value: 142500, status: "Completed", city: "Ahmedabad" },
  { id: "RPA-09", rma: "RMA-2026-12053", product: "Laptop Sleeve 15.6\"", category: "Electronics", reason: "Wrong Item", warehouse: "Jaipur DC9", received: 55, inspected: 53, grade: "B", resolution: "Restock", refund: 0, credit: 8250, turnaround: 30, carrier: "XpressBees", origin: "Marketplace", value: 110000, status: "Processing", city: "Jaipur" },
  { id: "RPA-10", rma: "RMA-2026-12054", product: "Steel Water Bottle 1L", category: "Home", reason: "Defective", warehouse: "Lucknow DC10", received: 150, inspected: 145, grade: "B", resolution: "Vendor Return", refund: 0, credit: 45000, turnaround: 54, carrier: "TCI Express", origin: "B2B", value: 225000, status: "Pending", city: "Lucknow" },
]

interface RPAItem {
  id: string; rma: string; product: string; category: string; reason: string
  warehouse: string; received: number; inspected: number; grade: string
  resolution: string; refund: number; credit: number; turnaround: number
  carrier: string; origin: string; value: number; status: string; city: string
}

const items: RPAItem[] = raw.map((r: any) => ({
  id: r.id, rma: r.rma, product: r.product, category: r.category, reason: r.reason,
  warehouse: r.warehouse, received: r.received, inspected: r.inspected, grade: r.grade,
  resolution: r.resolution, refund: r.refund, credit: r.credit, turnaround: r.turnaround,
  carrier: r.carrier, origin: r.origin, value: r.value, status: r.status, city: r.city,
}))

const statusColors: Record<string, string> = {
  "Completed": "text-emerald-600 font-semibold", "Processing": "text-blue-600 font-semibold",
  "Pending": "text-amber-600 font-semibold", "Overdue": "text-red-600 font-semibold",
}
const gradeColors: Record<string, string> = {
  "A": "bg-emerald-100 text-emerald-700", "B": "bg-blue-100 text-blue-700",
  "C": "bg-amber-100 text-amber-700", "D": "bg-red-100 text-red-700",
}
const reasonColors: Record<string, string> = {
  "Wrong Item": "bg-purple-100 text-purple-700", "Size Issue": "bg-indigo-100 text-indigo-700",
  "Damaged": "bg-red-100 text-red-700", "Defective": "bg-orange-100 text-orange-700",
  "Colour Mismatch": "bg-pink-100 text-pink-700", "Customer Changed Mind": "bg-gray-100 text-gray-600",
  "Expired": "bg-amber-100 text-amber-700",
}
const resolutionColors: Record<string, string> = {
  "Restock": "bg-emerald-100 text-emerald-700", "Dispose": "bg-red-100 text-red-700",
  "Vendor Return": "bg-blue-100 text-blue-700", "Refund": "bg-amber-100 text-amber-700",
}
const reasons = [...new Set(items.map(i => i.reason))]
const avgTurnaround = Math.round(items.reduce((s, i) => s + i.turnaround, 0) / items.length)
const totalRefund = items.reduce((s, i) => s + i.refund, 0)
const totalCredit = items.reduce((s, i) => s + i.credit, 0)
const totalValue = items.reduce((s, i) => s + i.value, 0)

type Rec = any
type FV = Record<string, string>
type VT = "returns" | "grading" | "financials"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`rpa-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function ReturnsProcessingAnalyticsPanel() {
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

  const alerts = [
    ...items.filter(i => i.status === "Overdue").map(i => ({ id: i.id, msg: `${i.product}: OVERDUE \u2014 ${i.turnaround}h turnaround, ${i.received} units at ${i.warehouse}, ${i.resolution}`, severity: "critical" as const })),
    ...items.filter(i => i.grade === "D").map(i => ({ id: i.id, msg: `${i.product}: Grade D \u2014 ${i.inspected}/${i.received} inspected, ${i.resolution}, value ${formatINR(i.value)}`, severity: "warning" as const })),
    ...items.filter(i => i.refund > 0).map(i => ({ id: i.id, msg: `${i.product}: Refund ${formatINR(i.refund)} \u2014 ${i.reason}, carrier ${i.carrier}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: RotateCcw, title: "Avg Turnaround", desc: `${avgTurnaround}h across ${items.length} RMAs | target &lt;48h`, accent: avgTurnaround <= 48 ? "text-emerald-500" : "text-red-500" },
    { icon: TrendingDown, title: "Recovery Rate", desc: `${items.filter(i => i.resolution === "Restock").length}/${items.length} restocked | ${items.filter(i => i.resolution === "Dispose").length} disposed`, accent: "text-blue-500" },
    { icon: Tag, title: "Total Value", desc: `${formatINR(totalValue)} in returns | ${formatINR(totalCredit)} credits issued`, accent: "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center"><RotateCcw className="h-4 w-4 text-rose-600" /></div>
            <div><h3 className="text-sm font-bold">Returns Processing Analytics</h3><p className="text-xs opacity-60">{items.length} RMAs | {reasons.length} reasons</p></div>
          </div>
          <div className="flex gap-1">
            {(["returns", "grading", "financials"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "returns" ? "Returns" : v === "grading" ? "Grading" : "Financials"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("RMAs", items.length.toString(), BarChart3, "bg-rose-50/50")}
          {statCard("Turnaround", `${avgTurnaround}h`, Clock, "bg-blue-50/50")}
          {statCard("Refunds", formatINR(totalRefund), Trash2, "bg-red-50/50")}
          {statCard("Credits", formatINR(totalCredit), RefreshCw, "bg-emerald-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {reasons.map(t => {
            const active = activeFilters.reason === t
            return <span key={t} onClick={() => toggle("reason", active ? undefined : t)} className={`rpa-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="rpa-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="rpa-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="rpa-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Returns Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`rpa-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "returns" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isOverdue = item.status === "Overdue"
              const isPending = item.status === "Pending"
              return (
                <div key={item.id} className={`rpa-ret-card rounded-lg border p-2.5 bg-card ${isOverdue ? "rpa-overdue-pulse" : isPending ? "rpa-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="rpa-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.product}</span>
                      <span className={`rpa-reason-tag text-[10px] px-1.5 py-0.5 rounded ${reasonColors[item.reason] || "bg-slate-100"}`}>{item.reason}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isOverdue ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Completed" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <Activity className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.warehouse} | {item.carrier}</div>
                    <div className="flex items-center gap-1"><Tag className="h-3 w-3 opacity-40" />{item.origin} | Value: {formatINR(item.value)}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Received: {item.received} | Inspected: {item.inspected}</div>
                    <div className="flex items-center gap-1"><RefreshCw className="h-3 w-3 opacity-40" />{item.resolution} | {item.turnaround}h</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Grade: <span className={`font-bold ${gradeColors[item.grade] ? "" : "text-foreground"}`}><span className={`rpa-grade-tag text-[10px] px-1.5 py-0.5 rounded ${gradeColors[item.grade]}`}>{item.grade}</span></span></div>
                    <div>Refund: <span className={`font-medium ${item.refund > 0 ? "text-red-600" : "text-foreground"}`}>{formatINR(item.refund)}</span></div>
                    <div>Credit: <span className={`font-medium ${item.credit > 0 ? "text-emerald-600" : "text-foreground"}`}>{formatINR(item.credit)}</span></div>
                    <div>RMA: <span className="font-medium font-mono">{item.rma.slice(-6)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "grading" && (
          <div className="space-y-2">
            <div className="rpa-grade-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.grade === "A" || i.grade === "B").length}</div><div className="text-[10px] opacity-50">Restockable (A+B)</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.grade === "C").length}</div><div className="text-[10px] opacity-50">Marginal (C)</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.grade === "D").length}</div><div className="text-[10px] opacity-50">Unsalvageable (D)</div></div>
                <div><div className="text-lg font-bold text-blue-600">{Math.round(items.reduce((s, i) => s + i.inspected, 0) / items.reduce((s, i) => s + i.received, 0) * 100)}%</div><div className="text-[10px] opacity-50">Inspection Rate</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.grade.localeCompare(b.grade)).map(item => {
              const inspectedPct = Math.round(item.inspected / item.received * 100)
              return (
              <div key={item.id} className={`rpa-grade-row rounded-lg border p-2 bg-card ${item.grade === "D" ? "rpa-overdue-pulse" : item.grade === "C" ? "rpa-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.product}</span>
                    <span className={`rpa-grade-tag text-[10px] px-1.5 py-0.5 rounded ${gradeColors[item.grade]}`}>{item.grade}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.grade === "A" ? "text-emerald-600" : item.grade === "B" ? "text-blue-600" : item.grade === "C" ? "text-amber-600" : "text-red-600"}`}>{inspectedPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.grade === "A" || item.grade === "B" ? "bg-emerald-500" : item.grade === "C" ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${inspectedPct}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Reason: <span className="font-medium">{item.reason}</span></div>
                  <div>Resolution: <span className="font-medium">{item.resolution}</span></div>
                  <div>Units: <span className="font-medium">{item.received}</span></div>
                  <div>Value: <span className="font-medium">{formatINR(item.value)}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}

        {view === "financials" && (
          <div className="space-y-2">
            <div className="rpa-fin-header rounded-lg border p-2 bg-amber-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{formatINR(totalValue)}</div><div className="text-[10px] opacity-50">Total Return Value</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{formatINR(totalCredit)}</div><div className="text-[10px] opacity-50">Vendor Credits</div></div>
                <div><div className="text-lg font-bold text-red-600">{formatINR(totalRefund)}</div><div className="text-[10px] opacity-50">Customer Refunds</div></div>
                <div><div className="text-lg font-bold text-purple-600">{formatINR(totalValue - totalRefund - totalCredit)}</div><div className="text-[10px] opacity-50">Net Loss</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.value - a.value).map(item => (
              <div key={item.id} className="rpa-fin-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.product}</span>
                  </div>
                  <span className="text-xs font-bold">{formatINR(item.value)}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.refund > 0 ? "bg-red-500" : item.credit > 0 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${Math.min(item.value / 600000 * 100, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Refund: <span className={`font-medium ${item.refund > 0 ? "text-red-600" : "text-foreground"}`}>{formatINR(item.refund)}</span></div>
                  <div>Credit: <span className={`font-medium ${item.credit > 0 ? "text-emerald-600" : "text-foreground"}`}>{formatINR(item.credit)}</span></div>
                  <div>Recovery: <span className="font-medium">{item.resolution === "Restock" ? "100%" : "0%"}</span></div>
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
