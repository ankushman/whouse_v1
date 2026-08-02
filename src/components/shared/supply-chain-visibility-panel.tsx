"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Eye, Globe, Route,
  Target, AlertTriangle, CheckCircle, XCircle,
  TrendingUp, Package, MapPin, IndianRupee, Activity
} from "lucide-react"

const raw = [
  { id: "SCV-01", lane: "Mumbai-Delhi", supplier: "Tata Steel", mode: "Road", stage: "In-Transit", leadTime: 4, eta: 2, onTime: 94, stock: 12400, riskScore: 2, value: 8500000, orders: 156, delayed: 8, status: "On Track", origin: "Mumbai DC1", dest: "Delhi DC2", month: "Aug 2026" },
  { id: "SCV-02", lane: "Chennai-Kolkata", supplier: "Reliance Logistics", mode: "Sea", stage: "Customs", leadTime: 12, eta: 5, onTime: 72, stock: 8200, riskScore: 7, value: 4200000, orders: 89, delayed: 18, status: "Delayed", origin: "Chennai Port", dest: "Kolkata DC7", month: "Aug 2026" },
  { id: "SCV-03", lane: "Bengaluru-Hyderabad", supplier: "Adani Ports", mode: "Road", stage: "Last Mile", leadTime: 2, eta: 1, onTime: 97, stock: 15600, riskScore: 1, value: 3200000, orders: 210, delayed: 4, status: "On Track", origin: "Bengaluru DC3", dest: "Hyderabad DC5", month: "Aug 2026" },
  { id: "SCV-04", lane: "Delhi-Pune", supplier: "Mahindra SCM", mode: "Rail", stage: "In-Transit", leadTime: 6, eta: 3, onTime: 85, stock: 6800, riskScore: 4, value: 12500000, orders: 72, delayed: 12, status: "On Track", origin: "Delhi DC2", dest: "Pune DC6", month: "Aug 2026" },
  { id: "SCV-05", lane: "Kolkata-Mumbai", supplier: "Asian Paints Supply", mode: "Sea", stage: "Procurement", leadTime: 14, eta: 10, onTime: 62, stock: 3400, riskScore: 8, value: 6800000, orders: 45, delayed: 22, status: "At Risk", origin: "Kolkata DC7", dest: "Mumbai DC1", month: "Aug 2026" },
  { id: "SCV-06", lane: "Pune-Ahmedabad", supplier: "Dalmia Cement", mode: "Road", stage: "Delivered", leadTime: 3, eta: 0, onTime: 96, stock: 22000, riskScore: 1, value: 1800000, orders: 185, delayed: 3, status: "On Track", origin: "Pune DC6", dest: "Ahmedabad DC8", month: "Aug 2026" },
  { id: "SCV-07", lane: "Hyderabad-Jaipur", supplier: "Britannia Industries", mode: "Road", stage: "Customs", leadTime: 8, eta: 6, onTime: 55, stock: 1200, riskScore: 9, value: 560000, orders: 34, delayed: 28, status: "Critical", origin: "Hyderabad DC5", dest: "Jaipur DC9", month: "Aug 2026" },
  { id: "SCV-08", lane: "Ahmedabad-Chennai", supplier: "ITC Distribution", mode: "Sea", stage: "In-Transit", leadTime: 10, eta: 4, onTime: 78, stock: 9500, riskScore: 5, value: 9200000, orders: 112, delayed: 15, status: "Delayed", origin: "Ahmedabad DC8", dest: "Chennai DC4", month: "Aug 2026" },
  { id: "SCV-09", lane: "Jaipur-Lucknow", supplier: "Tata Steel", mode: "Rail", stage: "Last Mile", leadTime: 5, eta: 1, onTime: 88, stock: 7800, riskScore: 3, value: 4500000, orders: 98, delayed: 9, status: "On Track", origin: "Jaipur DC9", dest: "Lucknow DC10", month: "Aug 2026" },
  { id: "SCV-10", lane: "Mumbai-Bengaluru", supplier: "Reliance Logistics", mode: "Air", stage: "Procurement", leadTime: 2, eta: 1, onTime: 98, stock: 4100, riskScore: 2, value: 7800000, orders: 67, delayed: 2, status: "On Track", origin: "Mumbai DC1", dest: "Bengaluru DC3", month: "Aug 2026" },
]

interface SCVItem {
  id: string; lane: string; supplier: string; mode: string; stage: string
  leadTime: number; eta: number; onTime: number; stock: number
  riskScore: number; value: number; orders: number; delayed: number
  status: string; origin: string; dest: string; month: string
}

const items: SCVItem[] = raw.map((r: any) => ({
  id: r.id, lane: r.lane, supplier: r.supplier, mode: r.mode, stage: r.stage,
  leadTime: r.leadTime, eta: r.eta, onTime: r.onTime, stock: r.stock,
  riskScore: r.riskScore, value: r.value, orders: r.orders, delayed: r.delayed,
  status: r.status, origin: r.origin, dest: r.dest, month: r.month,
}))

const statusColors: Record<string, string> = {
  "On Track": "text-emerald-600 font-semibold", "Delayed": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Critical": "text-red-600 font-semibold",
}
const stageColors: Record<string, string> = {
  "Procurement": "bg-blue-100 text-blue-700", "In-Transit": "bg-indigo-100 text-indigo-700",
  "Customs": "bg-purple-100 text-purple-700", "Last Mile": "bg-cyan-100 text-cyan-700",
  "Delivered": "bg-emerald-100 text-emerald-700",
}
const modeColors: Record<string, string> = {
  "Road": "bg-slate-100 text-slate-700", "Sea": "bg-cyan-100 text-cyan-700",
  "Rail": "bg-purple-100 text-purple-700", "Air": "bg-indigo-100 text-indigo-700",
}
const stages = [...new Set(items.map(i => i.stage))]
const totalValue = items.reduce((s, i) => s + i.value, 0)
const avgOnTime = Math.round(items.reduce((s, i) => s + i.onTime, 0) / items.length)
const atRisk = items.filter(i => i.status === "At Risk" || i.status === "Critical").length

type Rec = any
type FV = Record<string, string>
type VT = "pipeline" | "suppliers" | "risk"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`scv-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function SupplyChainVisibilityPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("pipeline")

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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.lane}: CRITICAL \u2014 on-time ${i.onTime}%, ${i.delayed}/${i.orders} delayed, stock ${i.stock.toLocaleString()} units`, severity: "critical" as const })),
    ...items.filter(i => i.status === "At Risk").map(i => ({ id: i.id, msg: `${i.lane}: At risk \u2014 ${i.stage}, ETA ${i.eta}d, risk score ${i.riskScore}/10`, severity: "warning" as const })),
    ...items.filter(i => i.stock < 2000).map(i => ({ id: i.id, msg: `${i.lane}: Low stock \u2014 ${i.stock.toLocaleString()} units, ${i.stage}, ${i.supplier}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: TrendingUp, title: "On-Time Rate", desc: `${avgOnTime}% average across ${items.length} lanes`, accent: "text-emerald-500" },
    { icon: Globe, title: "Pipeline Value", desc: `${formatINR(totalValue)} in-transit and pending`, accent: "text-blue-500" },
    { icon: AlertTriangle, title: "At-Risk Lanes", desc: `${atRisk}/${items.length} lanes need attention`, accent: atRisk > 2 ? "text-red-500" : "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center"><Eye className="h-4 w-4 text-indigo-600" /></div>
            <div><h3 className="text-sm font-bold">Supply Chain Visibility</h3><p className="text-xs opacity-60">{items.length} lanes | {stages.length} stages</p></div>
          </div>
          <div className="flex gap-1">
            {(["pipeline", "suppliers", "risk"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "pipeline" ? "Pipeline" : v === "suppliers" ? "Suppliers" : "Risk"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Lanes", items.length.toString(), Route, "bg-blue-50/50")}
          {statCard("Pipeline", formatINR(totalValue), IndianRupee, "bg-amber-50/50")}
          {statCard("On-Time", `${avgOnTime}%`, Target, "bg-emerald-50/50")}
          {statCard("At Risk", `${atRisk}/${items.length}`, AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {stages.map(s => {
            const active = activeFilters.stage === s
            return <span key={s} onClick={() => toggle("stage", active ? undefined : s)} className={`scv-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="scv-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="scv-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="scv-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Visibility Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`scv-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "pipeline" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "Delayed" || item.status === "At Risk"
              return (
                <div key={item.id} className={`scv-pipe-card rounded-lg border p-2.5 bg-card ${isCritical ? "scv-critical-pulse" : isWarning ? "scv-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="scv-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.lane}</span>
                      <span className={`scv-stage-tag text-[10px] px-1.5 py-0.5 rounded ${stageColors[item.stage] || "bg-slate-100"}`}>{item.stage}</span>
                      <span className={`scv-mode-tag text-[10px] px-1.5 py-0.5 rounded ${modeColors[item.mode] || "bg-slate-100"}`}>{item.mode}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "On Track" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.supplier} | {item.orders} orders</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.origin} \u2192 {item.dest}</div>
                    <div className="flex items-center gap-1"><Route className="h-3 w-3 opacity-40" />Lead: {item.leadTime}d | ETA: {item.eta}d</div>
                    <div className="flex items-center gap-1"><Activity className="h-3 w-3 opacity-40" />On-time: {item.onTime}% | {item.delayed} delayed</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Value: <span className="font-bold">{formatINR(item.value)}</span></div>
                    <div>Stock: <span className={`font-medium ${item.stock < 2000 ? "text-red-600" : "text-foreground"}`}>{item.stock.toLocaleString()}</span></div>
                    <div>Risk: <span className={`font-bold ${item.riskScore >= 7 ? "text-red-600" : item.riskScore >= 4 ? "text-amber-600" : "text-emerald-600"}`}>{item.riskScore}/10</span></div>
                    <div>SLA: <span className={`font-medium ${item.onTime >= 90 ? "text-emerald-600" : item.onTime >= 70 ? "text-amber-600" : "text-red-600"}`}>{item.onTime}%</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "suppliers" && (
          <div className="space-y-2">
            <div className="scv-sup-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{[...new Set(items.map(i => i.supplier))].length}</div><div className="text-[10px] opacity-50">Suppliers</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.reduce((s, i) => s + i.orders, 0).toLocaleString()}</div><div className="text-[10px] opacity-50">Total Orders</div></div>
                <div><div className="text-lg font-bold text-amber-600">{formatINR(totalValue)}</div><div className="text-[10px] opacity-50">Total Value</div></div>
                <div><div className="text-lg font-bold text-purple-600">{avgOnTime}%</div><div className="text-[10px] opacity-50">Avg On-Time</div></div>
              </div>
            </div>
            {[...new Set(items.map(i => i.supplier))].map(supplier => {
              const supItems = items.filter(i => i.supplier === supplier)
              const supOnTime = Math.round(supItems.reduce((s, i) => s + i.onTime, 0) / supItems.length)
              const supOrders = supItems.reduce((s, i) => s + i.orders, 0)
              const supValue = supItems.reduce((s, i) => s + i.value, 0)
              const supDelayed = supItems.reduce((s, i) => s + i.delayed, 0)
              const supRisk = Math.max(...supItems.map(i => i.riskScore))
              return (
                <div key={supplier} className="scv-sup-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{supplier}</span>
                      <span className="text-[10px] text-muted-foreground">{supItems.length} lane(s)</span>
                    </div>
                    <span className={`text-xs font-bold ${supOnTime >= 90 ? "text-emerald-600" : supOnTime >= 70 ? "text-amber-600" : "text-red-600"}`}>{supOnTime}% on-time</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${supOnTime >= 90 ? "bg-emerald-500" : supOnTime >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${supOnTime}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Orders: <span className="font-medium">{supOrders.toLocaleString()}</span></div>
                    <div>Delayed: <span className={`font-medium ${supDelayed > 20 ? "text-red-600" : "text-foreground"}`}>{supDelayed}</span></div>
                    <div>Value: <span className="font-medium">{formatINR(supValue)}</span></div>
                    <div>Max Risk: <span className={`font-medium ${supRisk >= 7 ? "text-red-600" : "text-foreground"}`}>{supRisk}/10</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "risk" && (
          <div className="space-y-2">
            <div className="scv-risk-header rounded-lg border p-2 bg-red-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{atRisk}</div><div className="text-[10px] opacity-50">At-Risk Lanes</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.delayed > 15).length}</div><div className="text-[10px] opacity-50">High Delay</div></div>
                <div><div className="text-lg font-bold text-orange-600">{items.filter(i => i.stock < 2000).length}</div><div className="text-[10px] opacity-50">Low Stock</div></div>
                <div><div className="text-lg font-bold text-purple-600">{Math.max(...items.map(i => i.riskScore))}/10</div><div className="text-[10px] opacity-50">Peak Risk</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.riskScore - a.riskScore).map(item => (
              <div key={item.id} className={`scv-risk-row rounded-lg border p-2 bg-card ${item.riskScore >= 8 ? "scv-critical-pulse" : item.riskScore >= 6 ? "scv-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.lane}</span>
                    <span className={`scv-stage-tag text-[10px] px-1.5 py-0.5 rounded ${stageColors[item.stage] || "bg-slate-100"}`}>{item.stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    <span className={`text-xs font-bold ${item.riskScore >= 7 ? "text-red-600" : item.riskScore >= 4 ? "text-amber-600" : "text-emerald-600"}`}>{item.riskScore}/10</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.riskScore >= 7 ? "bg-red-500" : item.riskScore >= 4 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${item.riskScore * 10}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>On-Time: <span className={`font-medium ${item.onTime < 70 ? "text-red-600" : "text-foreground"}`}>{item.onTime}%</span></div>
                  <div>Delayed: <span className="font-medium">{item.delayed}/{item.orders}</span></div>
                  <div>Stock: <span className={`font-medium ${item.stock < 2000 ? "text-red-600" : "text-foreground"}`}>{item.stock.toLocaleString()}</span></div>
                  <div>Value: <span className="font-medium">{formatINR(item.value)}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
