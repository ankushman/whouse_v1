"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Handshake, Scale, Award,
  AlertTriangle, CheckCircle, XCircle,
  TrendingUp, Activity, Globe, Clock
} from "lucide-react"

const raw = [
  { id: "TPO-01", provider: "Delhivery Express", service: "Fulfilment", region: "North India", dc: "Delhi NCR Hub", sla: 99.2, actual: 98.8, contract: "Gold Tier", value: 4200000, penalty: 0, rebate: 125000, onTime: 96.5, damage: 0.3, costPerOrder: 42, volume: 85000, status: "Compliant", city: "Delhi", period: "Q3 2026", started: "Jan 2025", expires: "Dec 2026" },
  { id: "TPO-02", provider: "Shadowfax Logistics", service: "Last Mile", region: "South India", dc: "Bengaluru DC3", sla: 97, actual: 93.4, contract: "Silver Tier", value: 2800000, penalty: 85000, rebate: 0, onTime: 91.2, damage: 1.8, costPerOrder: 56, volume: 52000, status: "At Risk", city: "Bengaluru", period: "Q3 2026", started: "Mar 2025", expires: "Mar 2027" },
  { id: "TPO-03", provider: "Rivigo Relay", service: "Line Haul", region: "West India", dc: "Mumbai DC1", sla: 98, actual: 97.6, contract: "Platinum Tier", value: 6500000, penalty: 0, rebate: 320000, onTime: 97.8, damage: 0.1, costPerOrder: 78, volume: 42000, status: "Compliant", city: "Mumbai", period: "Q3 2026", started: "Jun 2024", expires: "Jun 2026" },
  { id: "TPO-04", provider: "Ecom Express", service: "Reverse Logistics", region: "East India", dc: "Kolkata DC7", sla: 95, actual: 88.1, contract: "Standard", value: 1800000, penalty: 142000, rebate: 0, onTime: 82.5, damage: 3.2, costPerOrder: 65, volume: 28000, status: "Breach", city: "Kolkata", period: "Q3 2026", started: "Sep 2025", expires: "Sep 2026" },
  { id: "TPO-05", provider: "XpressBees", service: "E-Commerce Fulfilment", region: "West India", dc: "Pune DC6", sla: 98.5, actual: 97.2, contract: "Gold Tier", value: 3600000, penalty: 0, rebate: 185000, onTime: 96.1, damage: 0.5, costPerOrder: 48, volume: 68000, status: "Compliant", city: "Pune", period: "Q3 2026", started: "Feb 2025", expires: "Feb 2027" },
  { id: "TPO-06", provider: "BlueDart Express", service: "Express Delivery", region: "North India", dc: "Jaipur DC9", sla: 99.5, actual: 96.8, contract: "Platinum Tier", value: 5200000, penalty: 195000, rebate: 0, onTime: 94.2, damage: 0.8, costPerOrder: 125, volume: 35000, status: "Warning", city: "Jaipur", period: "Q3 2026", started: "Jan 2025", expires: "Jan 2027" },
  { id: "TPO-07", provider: "Ekart Logistics", service: "Marketplace Fulfilment", region: "South India", dc: "Chennai DC4", sla: 96, actual: 89.5, contract: "Standard", value: 2200000, penalty: 168000, rebate: 0, onTime: 85.8, damage: 2.5, costPerOrder: 38, volume: 95000, status: "Breach", city: "Chennai", period: "Q3 2026", started: "Aug 2025", expires: "Aug 2026" },
  { id: "TPO-08", provider: "Mahindra Logistics", service: "Warehousing", region: "Central India", dc: "Hyderabad DC5", sla: 99, actual: 98.5, contract: "Gold Tier", value: 7800000, penalty: 0, rebate: 450000, onTime: 97.5, damage: 0.2, costPerOrder: 92, volume: 72000, status: "Compliant", city: "Hyderabad", period: "Q3 2026", started: "Apr 2024", expires: "Apr 2027" },
  { id: "TPO-09", provider: "TCI Express", service: "Cold Chain", region: "North India", dc: "Lucknow DC10", sla: 98, actual: 94.2, contract: "Silver Tier", value: 3100000, penalty: 92000, rebate: 0, onTime: 90.5, damage: 1.5, costPerOrder: 145, volume: 18000, status: "Warning", city: "Lucknow", period: "Q3 2026", started: "Jul 2025", expires: "Jul 2027" },
  { id: "TPO-10", provider: "Allcargo Logistics", service: "Multi-Modal Transport", region: "West India", dc: "Ahmedabad DC8", sla: 97.5, actual: 96.8, contract: "Gold Tier", value: 5500000, penalty: 0, rebate: 210000, onTime: 95.8, damage: 0.4, costPerOrder: 68, volume: 48000, status: "Compliant", city: "Ahmedabad", period: "Q3 2026", started: "Nov 2024", expires: "Nov 2026" },
]

interface TPOItem {
  id: string; provider: string; service: string; region: string; dc: string
  sla: number; actual: number; contract: string; value: number; penalty: number
  rebate: number; onTime: number; damage: number; costPerOrder: number
  volume: number; status: string; city: string; period: string
  started: string; expires: string
}

const items: TPOItem[] = raw.map((r: any) => ({
  id: r.id, provider: r.provider, service: r.service, region: r.region, dc: r.dc,
  sla: r.sla, actual: r.actual, contract: r.contract, value: r.value, penalty: r.penalty,
  rebate: r.rebate, onTime: r.onTime, damage: r.damage, costPerOrder: r.costPerOrder,
  volume: r.volume, status: r.status, city: r.city, period: r.period,
  started: r.started, expires: r.expires,
}))

const statusColors: Record<string, string> = {
  "Compliant": "text-emerald-600 font-semibold", "Warning": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Breach": "text-red-600 font-semibold",
}
const contractColors: Record<string, string> = {
  "Platinum Tier": "bg-violet-100 text-violet-700", "Gold Tier": "bg-amber-100 text-amber-700",
  "Silver Tier": "bg-slate-200 text-slate-700", "Standard": "bg-gray-100 text-gray-600",
}
const serviceColors: Record<string, string> = {
  "Fulfilment": "bg-blue-100 text-blue-700", "Last Mile": "bg-green-100 text-green-700",
  "Line Haul": "bg-indigo-100 text-indigo-700", "Reverse Logistics": "bg-red-100 text-red-700",
  "E-Commerce Fulfilment": "bg-purple-100 text-purple-700", "Express Delivery": "bg-rose-100 text-rose-700",
  "Marketplace Fulfilment": "bg-teal-100 text-teal-700", "Warehousing": "bg-cyan-100 text-cyan-700",
  "Cold Chain": "bg-sky-100 text-sky-700", "Multi-Modal Transport": "bg-orange-100 text-orange-700",
}
const services = [...new Set(items.map(i => i.service))]
const avgSLA = Math.round(items.reduce((s, i) => s + i.actual, 0) / items.length * 10) / 10
const totalPenalty = items.reduce((s, i) => s + i.penalty, 0)
const totalRebate = items.reduce((s, i) => s + i.rebate, 0)
const totalValue = items.reduce((s, i) => s + i.value, 0)

type Rec = any
type FV = Record<string, string>
type VT = "contracts" | "performance" | "financials"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`tpo-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

export function ThirdPartyLogisticsPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("contracts")

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
    ...items.filter(i => i.status === "Breach").map(i => ({ id: i.id, msg: `${i.provider}: SLA BREACH \u2014 actual ${i.actual}% vs target ${i.sla}%, penalty ${formatINR(i.penalty)}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Warning").map(i => ({ id: i.id, msg: `${i.provider}: SLA at risk \u2014 ${i.actual}% vs ${i.sla}% target, damage rate ${i.damage}%`, severity: "warning" as const })),
    ...items.filter(i => i.penalty > 100000).map(i => ({ id: i.id, msg: `${i.provider}: Penalty accumulation ${formatINR(i.penalty)} \u2014 contract ${i.contract} under review`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Award, title: "SLA Compliance", desc: `${items.filter(i => i.status === "Compliant").length}/${items.length} compliant | avg ${avgSLA}% actual`, accent: avgSLA >= 96 ? "text-emerald-500" : "text-red-500" },
    { icon: TrendingUp, title: "Rebate Earned", desc: `${formatINR(totalRebate)} rebates vs ${formatINR(totalPenalty)} penalties this quarter`, accent: totalRebate > totalPenalty ? "text-emerald-500" : "text-red-500" },
    { icon: Globe, title: "Portfolio Value", desc: `${formatINR(totalValue)} across ${items.length} contracts | ${services.length} service types`, accent: "text-blue-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center"><Handshake className="h-4 w-4 text-violet-600" /></div>
            <div><h3 className="text-sm font-bold">3PL Contract Optimization</h3><p className="text-xs opacity-60">{items.length} contracts | {services.length} services</p></div>
          </div>
          <div className="flex gap-1">
            {(["contracts", "performance", "financials"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "contracts" ? "Contracts" : v === "performance" ? "Performance" : "Financials"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Contracts", items.length.toString(), Scale, "bg-violet-50/50")}
          {statCard("SLA Avg", `${avgSLA}%`, CheckCircle, "bg-emerald-50/50")}
          {statCard("Penalties", formatINR(totalPenalty), AlertTriangle, "bg-red-50/50")}
          {statCard("Rebates", formatINR(totalRebate), TrendingUp, "bg-blue-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {services.map(t => {
            const active = activeFilters.service === t
            return <span key={t} onClick={() => toggle("service", active ? undefined : t)} className={`tpo-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="tpo-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="tpo-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="tpo-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />SLA Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`tpo-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "contracts" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isBreach = item.status === "Breach"
              const isWarning = item.status === "Warning" || item.status === "At Risk"
              const gap = item.sla - item.actual
              return (
                <div key={item.id} className={`tpo-contract-card rounded-lg border p-2.5 bg-card ${isBreach ? "tpo-breach-pulse" : isWarning ? "tpo-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="tpo-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.provider}</span>
                      <span className={`tpo-contract-tag text-[10px] px-1.5 py-0.5 rounded ${contractColors[item.contract] || "bg-slate-100"}`}>{item.contract}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isBreach ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Compliant" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Globe className="h-3 w-3 opacity-40" />{item.region} | {item.dc}</div>
                    <div className="flex items-center gap-1"><Activity className="h-3 w-3 opacity-40" />{item.service} | Vol: {(item.volume / 1000).toFixed(0)}K/mo</div>
                    <div className="flex items-center gap-1"><Scale className="h-3 w-3 opacity-40" />SLA: {item.sla}% | Actual: <span className={gap > 2 ? "text-red-600 font-semibold" : gap > 0 ? "text-amber-600" : "text-emerald-600"}>{item.actual}%</span></div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />{item.started} \u2192 {item.expires}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>On-Time: <span className={`font-bold ${item.onTime >= 96 ? "text-emerald-600" : item.onTime >= 90 ? "text-amber-600" : "text-red-600"}`}>{item.onTime}%</span></div>
                    <div>Damage: <span className={`font-medium ${item.damage > 1.5 ? "text-red-600" : "text-foreground"}`}>{item.damage}%</span></div>
                    <div>Cost/Order: <span className="font-medium">{formatINR(item.costPerOrder)}</span></div>
                    <div>Value: <span className="font-medium">{formatINR(item.value)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "performance" && (
          <div className="space-y-2">
            <div className="tpo-perf-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.onTime >= 96).length}/{items.length}</div><div className="text-[10px] opacity-50">On-Time Score</div></div>
                <div><div className="text-lg font-bold text-amber-600">{(items.reduce((s, i) => s + i.damage, 0) / items.length).toFixed(1)}%</div><div className="text-[10px] opacity-50">Avg Damage Rate</div></div>
                <div><div className="text-lg font-bold text-blue-600">{Math.round(items.reduce((s, i) => s + i.volume, 0) / items.length / 1000)}K</div><div className="text-[10px] opacity-50">Avg Volume/mo</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.status === "Breach").length}</div><div className="text-[10px] opacity-50">SLA Breaches</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.onTime - b.onTime).map(item => {
              const gap = item.sla - item.actual
              return (
              <div key={item.id} className={`tpo-perf-row rounded-lg border p-2 bg-card ${item.status === "Breach" ? "tpo-breach-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.provider}</span>
                    <span className="text-[10px] text-muted-foreground">{item.service}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.onTime >= 96 ? "text-emerald-600" : item.onTime >= 90 ? "text-amber-600" : "text-red-600"}`}>{item.onTime}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.onTime >= 96 ? "bg-emerald-500" : item.onTime >= 90 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.onTime}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>SLA Gap: <span className={`font-medium ${gap > 2 ? "text-red-600" : gap > 0 ? "text-amber-600" : "text-emerald-600"}`}>{gap > 0 ? `-${gap}%` : "Met"}</span></div>
                  <div>Damage: <span className={`font-medium ${item.damage > 1.5 ? "text-red-600" : "text-foreground"}`}>{item.damage}%</span></div>
                  <div>Volume: <span className="font-medium">{(item.volume / 1000).toFixed(0)}K/mo</span></div>
                  <div>CPO: <span className="font-medium">{formatINR(item.costPerOrder)}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}

        {view === "financials" && (
          <div className="space-y-2">
            <div className="tpo-fin-header rounded-lg border p-2 bg-amber-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{formatINR(totalValue)}</div><div className="text-[10px] opacity-50">Total Contract Value</div></div>
                <div><div className="text-lg font-bold text-red-600">{formatINR(totalPenalty)}</div><div className="text-[10px] opacity-50">Total Penalties</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{formatINR(totalRebate)}</div><div className="text-[10px] opacity-50">Total Rebates</div></div>
                <div><div className="text-lg font-bold text-purple-600">{formatINR(totalValue - totalPenalty + totalRebate)}</div><div className="text-[10px] opacity-50">Net Spend</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.penalty - a.penalty).map(item => (
              <div key={item.id} className="tpo-fin-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.provider}</span>
                  </div>
                  <span className="text-xs font-bold">{formatINR(item.value)}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.penalty > 100000 ? "bg-red-500" : item.penalty > 0 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min((item.penalty + item.rebate) / 500000 * 100, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Penalty: <span className={`font-medium ${item.penalty > 0 ? "text-red-600" : "text-foreground"}`}>{formatINR(item.penalty)}</span></div>
                  <div>Rebate: <span className={`font-medium ${item.rebate > 0 ? "text-emerald-600" : "text-foreground"}`}>{formatINR(item.rebate)}</span></div>
                  <div>CPO: <span className="font-medium">{formatINR(item.costPerOrder)}</span></div>
                  <div>ROI: <span className="font-medium">{item.penalty > 0 ? "Negative" : "Positive"}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
