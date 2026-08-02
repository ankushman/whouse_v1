"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  RotateCcw, TrendingDown, AlertTriangle, ShoppingCart,
  RefreshCw, CreditCard, Shield, FileText,
  PackageCheck, PackageX, PackageOpen, ThumbsDown
} from "lucide-react"

const raw = [
  { id: "RAH-01", cat: "Electronics", reason: "Defective", channel: "Amazon", segment: "Premium", rma: "RMA-20260701", orderId: "ORD-88234", sku: "iPhone 15 Pro", qty: 1, refund: 84900, processDays: 2, returnRate: 4.2, qualityScore: 2, fraudScore: 12, status: "Completed", age: 5, city: "Mumbai", carrier: "Delhivery", refundStatus: "Processed" },
  { id: "RAH-02", cat: "Fashion", reason: "Size Mismatch", channel: "Myntra", segment: "Regular", rma: "RMA-20260702", orderId: "ORD-77345", sku: "Levi's Slim Fit", qty: 2, refund: 4200, processDays: 3, returnRate: 8.7, qualityScore: 4, fraudScore: 8, status: "In Progress", age: 12, city: "Delhi", carrier: "XpressBees", refundStatus: "Pending" },
  { id: "RAH-03", cat: "Home Appliances", reason: "Damaged in Transit", channel: "Flipkart", segment: "Standard", rma: "RMA-20260703", orderId: "ORD-66128", sku: "Samsung 1.5T AC", qty: 1, refund: 38900, processDays: 5, returnRate: 2.1, qualityScore: 1, fraudScore: 5, status: "Completed", age: 8, city: "Bengaluru", carrier: "Ecom Express", refundStatus: "Processed" },
  { id: "RAH-04", cat: "Beauty", reason: "Wrong Product", channel: "Nykaa", segment: "Premium", rma: "RMA-20260704", orderId: "ORD-55921", sku: "Lakme Kit Pro", qty: 1, refund: 2800, processDays: 2, returnRate: 3.5, qualityScore: 5, fraudScore: 15, status: "Completed", age: 3, city: "Hyderabad", carrier: "Shadowfax", refundStatus: "Processed" },
  { id: "RAH-05", cat: "Electronics", reason: "Not as Described", channel: "Flipkart", segment: "Regular", rma: "RMA-20260705", orderId: "ORD-44189", sku: "Boat Airdopes", qty: 1, refund: 3200, processDays: 4, returnRate: 6.8, qualityScore: 3, fraudScore: 22, status: "Under Review", age: 18, city: "Chennai", carrier: "DTDC", refundStatus: "On Hold" },
  { id: "RAH-06", cat: "Grocery", reason: "Expired Product", channel: "BigBasket", segment: "Standard", rma: "RMA-20260706", orderId: "ORD-33872", sku: "Organic Dal 5Kg", qty: 3, refund: 1800, processDays: 1, returnRate: 1.2, qualityScore: 1, fraudScore: 3, status: "Completed", age: 2, city: "Pune", carrier: "Swiggy Instamart", refundStatus: "Processed" },
  { id: "RAH-07", cat: "Footwear", reason: "Color Mismatch", channel: "Myntra", segment: "Premium", rma: "RMA-20260707", orderId: "ORD-22456", sku: "Nike Air Max", qty: 1, refund: 12900, processDays: 3, returnRate: 5.4, qualityScore: 4, fraudScore: 10, status: "In Progress", age: 10, city: "Kolkata", carrier: "Delhivery", refundStatus: "Pending" },
  { id: "RAH-08", cat: "Electronics", reason: "Battery Issue", channel: "Amazon", segment: "Regular", rma: "RMA-20260708", orderId: "ORD-11298", sku: "OnePlus Nord CE", qty: 1, refund: 24999, processDays: 6, returnRate: 3.8, qualityScore: 2, fraudScore: 18, status: "Escalated", age: 25, city: "Jaipur", carrier: "Amazon Logistics", refundStatus: "Rejected" },
  { id: "RAH-09", cat: "Furniture", reason: "Missing Parts", channel: "Flipkart", segment: "Standard", rma: "RMA-20260709", orderId: "ORD-99234", sku: "IKEA Wardrobe", qty: 1, refund: 18500, processDays: 7, returnRate: 2.8, qualityScore: 1, fraudScore: 6, status: "Under Review", age: 20, city: "Ahmedabad", carrier: "Ecom Express", refundStatus: "On Hold" },
  { id: "RAH-10", cat: "Sports", reason: "Defective", channel: "Amazon", segment: "Regular", rma: "RMA-20260710", orderId: "ORD-87612", sku: "Yonex Badminton Set", qty: 2, refund: 5600, processDays: 2, returnRate: 1.8, qualityScore: 2, fraudScore: 4, status: "Completed", age: 4, city: "Lucknow", carrier: "India Post", refundStatus: "Processed" },
]

interface RAHItem {
  id: string; cat: string; reason: string; channel: string; segment: string
  rma: string; orderId: string; sku: string; qty: number; refund: number
  processDays: number; returnRate: number; qualityScore: number; fraudScore: number
  status: string; age: number; city: string; carrier: string; refundStatus: string
}

const items: RAHItem[] = raw.map((r: any) => ({
  id: r.id, cat: r.cat, reason: r.reason, channel: r.channel, segment: r.segment,
  rma: r.rma, orderId: r.orderId, sku: r.sku, qty: r.qty, refund: r.refund,
  processDays: r.processDays, returnRate: r.returnRate, qualityScore: r.qualityScore,
  fraudScore: r.fraudScore, status: r.status, age: r.age, city: r.city,
  carrier: r.carrier, refundStatus: r.refundStatus,
}))

const statusColors: Record<string, string> = {
  "Completed": "text-emerald-600 font-semibold", "In Progress": "text-blue-600 font-semibold",
  "Under Review": "text-amber-600 font-semibold", "Escalated": "text-red-600 font-semibold",
}
const reasonColors: Record<string, string> = {
  "Defective": "bg-red-100 text-red-700", "Size Mismatch": "bg-amber-100 text-amber-700",
  "Damaged in Transit": "bg-orange-100 text-orange-700", "Wrong Product": "bg-purple-100 text-purple-700",
  "Not as Described": "bg-indigo-100 text-indigo-700", "Expired Product": "bg-rose-100 text-rose-700",
  "Color Mismatch": "bg-pink-100 text-pink-700", "Battery Issue": "bg-sky-100 text-sky-700",
  "Missing Parts": "bg-teal-100 text-teal-700",
}
const refundStatColors: Record<string, string> = {
  "Processed": "bg-emerald-100 text-emerald-700", "Pending": "bg-amber-100 text-amber-700",
  "On Hold": "bg-orange-100 text-orange-700", "Rejected": "bg-red-100 text-red-700",
}
const categories = [...new Set(items.map(i => i.cat))]
const channels = [...new Set(items.map(i => i.channel))]
const totalRefund = items.reduce((s, i) => s + i.refund, 0)
const avgReturnRate = (items.reduce((s, i) => s + i.returnRate, 0) / items.length).toFixed(1)
const avgProcessDays = (items.reduce((s, i) => s + i.processDays, 0) / items.length).toFixed(1)
const highFraud = items.filter(i => i.fraudScore >= 15).length

type Rec = any
type FV = Record<string, string>
type VT = "returns" | "reasons" | "fraud"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`rah-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function ReturnsAnalyticsHubPanel() {
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
    ...items.filter(i => i.status === "Escalated").map(i => ({ id: i.id, msg: `${i.rma}: ${i.sku} \u2014 ${i.status}, fraud score ${i.fraudScore}, age ${i.age}d`, severity: "critical" as const })),
    ...items.filter(i => i.age > 15).map(i => ({ id: i.id, msg: `${i.rma}: RMA aging ${i.age}d \u2014 ${i.refundStatus}, carrier ${i.carrier}`, severity: "warning" as const })),
    ...items.filter(i => i.fraudScore >= 15).map(i => ({ id: i.id, msg: `${i.rma}: High fraud score ${i.fraudScore} \u2014 ${i.reason}, ${i.channel}`, severity: "warning" as const })),
    ...items.filter(i => i.qualityScore <= 2).map(i => ({ id: i.id, msg: `${i.rma}: Quality issue \u2014 score ${i.qualityScore}/5, ${i.cat}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: TrendingDown, title: "Return Rate", desc: `${avgReturnRate}% avg across ${categories.length} categories`, accent: "text-red-500" },
    { icon: CreditCard, title: "Refunds", desc: `${formatINR(totalRefund)} total processed`, accent: "text-amber-500" },
    { icon: Shield, title: "Fraud Alerts", desc: `${highFraud}/${items.length} flagged (score >= 15)`, accent: "text-purple-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center"><RotateCcw className="h-4 w-4 text-red-600" /></div>
            <div><h3 className="text-sm font-bold">Returns Analytics Hub</h3><p className="text-xs opacity-60">{items.length} RMAs | {categories.length} categories</p></div>
          </div>
          <div className="flex gap-1">
            {(["returns", "reasons", "fraud"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "returns" ? "Returns" : v === "reasons" ? "Reasons" : "Fraud"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Refunds", formatINR(totalRefund), CreditCard, "bg-amber-50/50")}
          {statCard("Return Rate", `${avgReturnRate}%`, TrendingDown, "bg-red-50/50")}
          {statCard("Avg Process", `${avgProcessDays}d`, Clock, "bg-blue-50/50")}
          {statCard("Fraud Flags", `${highFraud}`, Shield, "bg-purple-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map(c => {
            const active = activeFilters.cat === c
            return <span key={c} onClick={() => toggle("cat", active ? undefined : c)} className={`rah-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {channels.map(c => {
            const active = activeFilters.channel === c
            return <span key={c} onClick={() => toggle("channel", active ? undefined : c)} className={`rah-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="rah-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="rah-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="rah-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Return Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`rah-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "returns" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Escalated"
              const isWarning = item.status === "Under Review" || item.age > 15
              return (
                <div key={item.id} className={`rah-returns-card rounded-lg border p-2.5 bg-card ${isCritical ? "rah-critical-pulse" : isWarning ? "rah-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="rah-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-100 text-red-700">{item.id}</span>
                      <span className={`rah-reason-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${reasonColors[item.reason] || "bg-slate-100"}`}>{item.reason}</span>
                      <span className={`rah-refund-stat text-[10px] px-1.5 py-0.5 rounded ${refundStatColors[item.refundStatus] || "bg-slate-100"}`}>{item.refundStatus}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <PackageX className="h-3 w-3 text-red-500" /> : item.status === "Completed" ? <PackageCheck className="h-3 w-3 text-emerald-500" /> : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><PackageOpen className="h-3 w-3 opacity-40" />{item.sku} x{item.qty}</div>
                    <div className="flex items-center gap-1"><ShoppingCart className="h-3 w-3 opacity-40" />{item.channel} | {item.segment}</div>
                    <div className="flex items-center gap-1"><FileText className="h-3 w-3 opacity-40" />{item.rma} | {item.orderId}</div>
                    <div className="flex items-center gap-1"><RefreshCw className="h-3 w-3 opacity-40" />{item.city} | {item.carrier}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Refund: <span className="font-bold text-foreground">{formatINR(item.refund)}</span></div>
                    <div>Rate: <span className={`font-bold ${item.returnRate > 5 ? "text-red-600" : "text-foreground"}`}>{item.returnRate}%</span></div>
                    <div>Process: <span className={`font-medium ${item.processDays > 4 ? "text-amber-600" : "text-foreground"}`}>{item.processDays}d</span></div>
                    <div>Age: <span className={`font-medium ${item.age > 15 ? "text-red-600" : item.age > 10 ? "text-amber-600" : "text-foreground"}`}>{item.age}d</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "reasons" && (
          <div className="space-y-2">
            <div className="rah-reasons-header rounded-lg border p-2 bg-indigo-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-indigo-600">{new Set(items.map(i => i.reason)).size}</div><div className="text-[10px] opacity-50">Return Reasons</div></div>
                <div><div className="text-lg font-bold text-red-600">{formatINR(items.reduce((s, i) => s + i.refund, 0))}</div><div className="text-[10px] opacity-50">Total Refund Cost</div></div>
                <div><div className="text-lg font-bold text-amber-600">{categories.length}</div><div className="text-[10px] opacity-50">Categories Affected</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.qualityScore >= 4).length}</div><div className="text-[10px] opacity-50">High Quality</div></div>
              </div>
            </div>
            {[...new Set(items.map(i => i.reason))].map(reason => {
              const rItems = items.filter(i => i.reason === reason)
              const avgRefund = rItems.reduce((s, i) => s + i.refund, 0) / rItems.length
              const avgRate = rItems.reduce((s, i) => s + i.returnRate, 0) / rItems.length
              const avgQuality = (rItems.reduce((s, i) => s + i.qualityScore, 0) / rItems.length).toFixed(1)
              return (
                <div key={reason} className="rah-reason-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`rah-reason-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${reasonColors[reason] || "bg-slate-100"}`}>{reason}</span>
                      <span className="text-xs font-semibold">{rItems.length} return(s)</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{formatINR(Math.round(avgRefund))}/avg</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                    <div>Avg Rate: <span className={`font-medium ${Number(avgRate) > 5 ? "text-red-600" : "text-foreground"}`}>{avgRate.toFixed(1)}%</span></div>
                    <div>Quality: <span className="font-medium">{avgQuality}/5</span></div>
                    <div>Channels: <span className="font-medium">{new Set(rItems.map(i => i.channel)).size}</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {rItems.map(i => <span key={i.id} className="text-[9px] px-1 py-0.5 rounded bg-muted/50">{i.cat}</span>)}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "fraud" && (
          <div className="space-y-2">
            <div className="rah-fraud-header rounded-lg border p-2 bg-purple-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{highFraud}</div><div className="text-[10px] opacity-50">High Risk (&gt;=15)</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.fraudScore >= 10 && i.fraudScore < 15).length}</div><div className="text-[10px] opacity-50">Medium Risk</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{formatINR(items.filter(i => i.fraudScore >= 15).reduce((s, i) => s + i.refund, 0))}</div><div className="text-[10px] opacity-50">High Risk Refund</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.status === "Escalated").length}</div><div className="text-[10px] opacity-50">Escalated</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.fraudScore - a.fraudScore).map(item => {
              const isHighRisk = item.fraudScore >= 15
              return (
                <div key={item.id} className={`rah-fraud-row rounded-lg border p-2 bg-card ${isHighRisk ? "rah-critical-pulse" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.rma}</span>
                      <span className="text-[10px] opacity-50">{item.sku}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isHighRisk ? <Shield className="h-3 w-3 text-red-500" /> : <ThumbsDown className="h-3 w-3 text-amber-500" />}
                      <span className={`text-xs font-bold ${isHighRisk ? "text-red-600" : item.fraudScore >= 10 ? "text-amber-600" : "text-emerald-600"}`}>{item.fraudScore}/100</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${isHighRisk ? "bg-red-500" : item.fraudScore >= 10 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(item.fraudScore * 2, 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Reason: <span className="font-medium">{item.reason}</span></div>
                    <div>Channel: <span className="font-medium">{item.channel}</span></div>
                    <div>Refund: <span className="font-medium">{formatINR(item.refund)}</span></div>
                    <div>Status: <span className={`font-medium ${statusColors[item.status] || "text-foreground"}`}>{item.status}</span></div>
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
