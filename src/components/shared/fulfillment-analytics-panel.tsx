"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Package, Truck, ArrowRight, Target,
  AlertTriangle, CheckCircle, XCircle,
  TrendingUp, Activity, Layers, BarChart3
} from "lucide-react"

const raw = [
  { id: "FLA-01", order: "ORD-2026-48210", channel: "B2C", warehouse: "Mumbai DC1", priority: "Same Day", picked: 12450, packed: 11800, shipped: 11200, pending: 1250, pickAcc: 99.2, packAcc: 99.5, shipRate: 94.8, cycleTime: 4.2, slaTarget: 95, slaActual: 96.8, errors: 12, returns: 85, carrier: "Delhivery", status: "On Track", city: "Mumbai", zone: "West" },
  { id: "FLA-02", order: "ORD-2026-48211", channel: "Marketplace", warehouse: "Delhi DC2", priority: "Next Day", picked: 15800, packed: 14200, shipped: 12800, pending: 3000, pickAcc: 97.8, packAcc: 98.2, shipRate: 90.1, cycleTime: 6.5, slaTarget: 92, slaActual: 88.4, errors: 45, returns: 210, carrier: "Shadowfax", status: "Delayed", city: "Delhi", zone: "North" },
  { id: "FLA-03", order: "ORD-2026-48212", channel: "B2B", warehouse: "Bengaluru DC3", priority: "Standard", picked: 8200, packed: 8100, shipped: 8000, pending: 200, pickAcc: 99.8, packAcc: 99.9, shipRate: 98.7, cycleTime: 12.5, slaTarget: 98, slaActual: 98.5, errors: 3, returns: 15, carrier: "Rivigo", status: "On Track", city: "Bengaluru", zone: "South" },
  { id: "FLA-04", order: "ORD-2026-48213", channel: "B2C", warehouse: "Kolkata DC7", priority: "Same Day", picked: 6800, packed: 5200, shipped: 3800, pending: 3000, pickAcc: 94.5, packAcc: 95.8, shipRate: 73.1, cycleTime: 8.2, slaTarget: 90, slaActual: 72.5, errors: 68, returns: 320, carrier: "Ecom Express", status: "Critical", city: "Kolkata", zone: "East" },
  { id: "FLA-05", order: "ORD-2026-48214", channel: "D2C", warehouse: "Pune DC6", priority: "Next Day", picked: 9500, packed: 9200, shipped: 8800, pending: 700, pickAcc: 98.8, packAcc: 99.1, shipRate: 95.6, cycleTime: 5.8, slaTarget: 95, slaActual: 95.2, errors: 18, returns: 95, carrier: "XpressBees", status: "On Track", city: "Pune", zone: "West" },
  { id: "FLA-06", order: "ORD-2026-48215", channel: "Marketplace", warehouse: "Chennai DC4", priority: "Same Day", picked: 11200, packed: 9800, shipped: 8500, pending: 2700, pickAcc: 96.2, packAcc: 97.5, shipRate: 86.7, cycleTime: 7.1, slaTarget: 93, slaActual: 84.2, errors: 52, returns: 180, carrier: "Ekart", status: "Warning", city: "Chennai", zone: "South" },
  { id: "FLA-07", order: "ORD-2026-48216", channel: "B2B", warehouse: "Hyderabad DC5", priority: "Standard", picked: 5600, packed: 5550, shipped: 5500, pending: 100, pickAcc: 99.9, packAcc: 99.9, shipRate: 99.1, cycleTime: 15.2, slaTarget: 97, slaActual: 99.1, errors: 1, returns: 8, carrier: "BlueDart", status: "On Track", city: "Hyderabad", zone: "South" },
  { id: "FLA-08", order: "ORD-2026-48217", channel: "B2C", warehouse: "Ahmedabad DC8", priority: "Next Day", picked: 10200, packed: 8900, shipped: 7600, pending: 2600, pickAcc: 97.1, packAcc: 97.8, shipRate: 85.4, cycleTime: 6.8, slaTarget: 94, slaActual: 83.8, errors: 38, returns: 145, carrier: "Delhivery", status: "At Risk", city: "Ahmedabad", zone: "West" },
  { id: "FLA-09", order: "ORD-2026-48218", channel: "D2C", warehouse: "Jaipur DC9", priority: "Same Day", picked: 4800, packed: 4500, shipped: 4100, pending: 700, pickAcc: 98.5, packAcc: 98.8, shipRate: 91.1, cycleTime: 5.2, slaTarget: 92, slaActual: 91.5, errors: 15, returns: 62, carrier: "XpressBees", status: "Warning", city: "Jaipur", zone: "North" },
  { id: "FLA-10", order: "ORD-2026-48219", channel: "B2B", warehouse: "Lucknow DC10", priority: "Standard", picked: 3200, packed: 3150, shipped: 3100, pending: 100, pickAcc: 99.7, packAcc: 99.8, shipRate: 98.4, cycleTime: 14.8, slaTarget: 96, slaActual: 98.4, errors: 2, returns: 10, carrier: "TCI Express", status: "On Track", city: "Lucknow", zone: "North" },
]

interface FLAItem {
  id: string; order: string; channel: string; warehouse: string; priority: string
  picked: number; packed: number; shipped: number; pending: number
  pickAcc: number; packAcc: number; shipRate: number; cycleTime: number
  slaTarget: number; slaActual: number; errors: number; returns: number
  carrier: string; status: string; city: string; zone: string
}

const items: FLAItem[] = raw.map((r: any) => ({
  id: r.id, order: r.order, channel: r.channel, warehouse: r.warehouse, priority: r.priority,
  picked: r.picked, packed: r.packed, shipped: r.shipped, pending: r.pending,
  pickAcc: r.pickAcc, packAcc: r.packAcc, shipRate: r.shipRate, cycleTime: r.cycleTime,
  slaTarget: r.slaTarget, slaActual: r.slaActual, errors: r.errors, returns: r.returns,
  carrier: r.carrier, status: r.status, city: r.city, zone: r.zone,
}))

const statusColors: Record<string, string> = {
  "On Track": "text-emerald-600 font-semibold", "Warning": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Delayed": "text-red-600 font-semibold",
  "Critical": "text-red-600 font-semibold",
}
const channelColors: Record<string, string> = {
  "B2C": "bg-blue-100 text-blue-700", "B2B": "bg-indigo-100 text-indigo-700",
  "Marketplace": "bg-purple-100 text-purple-700", "D2C": "bg-teal-100 text-teal-700",
}
const priorityColors: Record<string, string> = {
  "Same Day": "bg-red-100 text-red-700", "Next Day": "bg-amber-100 text-amber-700",
  "Standard": "bg-green-100 text-green-700",
}
const channels = [...new Set(items.map(i => i.channel))]
const avgSLA = Math.round(items.reduce((s, i) => s + i.slaActual, 0) / items.length * 10) / 10
const totalShipped = items.reduce((s, i) => s + i.shipped, 0)
const totalPending = items.reduce((s, i) => s + i.pending, 0)
const totalErrors = items.reduce((s, i) => s + i.errors, 0)

type Rec = any
type FV = Record<string, string>
type VT = "pipeline" | "performance" | "sla"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`fla-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function FulfillmentAnalyticsPanel() {
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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.warehouse}: CRITICAL \u2014 SLA ${i.slaActual}% vs ${i.slaTarget}% target, ${i.pending.toLocaleString()} pending, ${i.errors} errors`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Delayed" || i.status === "At Risk").map(i => ({ id: i.id, msg: `${i.warehouse}: ${i.status} \u2014 ship rate ${i.shipRate}%, SLA gap ${i.slaTarget - i.slaActual > 0 ? `${(i.slaTarget - i.slaActual).toFixed(1)}pp` : "met"}`, severity: "warning" as const })),
    ...items.filter(i => i.errors > 30).map(i => ({ id: i.id, msg: `${i.warehouse}: High error count ${i.errors} \u2014 ${i.returns} returns, cycle time ${i.cycleTime}h`, severity: "info" as const })),
  ].slice(0, 6)

  const insights = [
    { icon: TrendingUp, title: "SLA Performance", desc: `${avgSLA}% avg | ${items.filter(i => i.slaActual >= i.slaTarget).length}/${items.length} meeting SLA`, accent: avgSLA >= 90 ? "text-emerald-500" : "text-red-500" },
    { icon: Package, title: "Shipment Volume", desc: `${totalShipped.toLocaleString()} shipped | ${totalPending.toLocaleString()} pending fulfillment`, accent: "text-blue-500" },
    { icon: AlertTriangle, title: "Error Rate", desc: `${totalErrors} total errors | ${items.reduce((s, i) => s + i.returns, 0)} returns across all channels`, accent: totalErrors > 200 ? "text-red-500" : "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"><Layers className="h-4 w-4 text-blue-600" /></div>
            <div><h3 className="text-sm font-bold">Fulfillment Analytics</h3><p className="text-xs opacity-60">{items.length} orders | {channels.length} channels</p></div>
          </div>
          <div className="flex gap-1">
            {(["pipeline", "performance", "sla"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "pipeline" ? "Pipeline" : v === "performance" ? "Performance" : "SLA"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Orders", items.length.toString(), BarChart3, "bg-blue-50/50")}
          {statCard("SLA Avg", `${avgSLA}%`, Target, "bg-emerald-50/50")}
          {statCard("Shipped", `${(totalShipped / 1000).toFixed(1)}K`, Truck, "bg-cyan-50/50")}
          {statCard("Errors", totalErrors.toString(), AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {channels.map(t => {
            const active = activeFilters.channel === t
            return <span key={t} onClick={() => toggle("channel", active ? undefined : t)} className={`fla-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="fla-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="fla-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="fla-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Fulfillment Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`fla-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "pipeline" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical" || item.status === "Delayed"
              const isWarning = item.status === "Warning" || item.status === "At Risk"
              const pipelinePct = Math.round(item.shipped / item.picked * 100)
              return (
                <div key={item.id} className={`fla-pipe-card rounded-lg border p-2.5 bg-card ${isCritical ? "fla-critical-pulse" : isWarning ? "fla-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="fla-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.warehouse}</span>
                      <span className={`fla-channel-tag text-[10px] px-1.5 py-0.5 rounded ${channelColors[item.channel] || "bg-slate-100"}`}>{item.channel}</span>
                      <span className={`fla-pri-tag text-[10px] px-1.5 py-0.5 rounded ${priorityColors[item.priority] || "bg-slate-100"}`}>{item.priority}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "On Track" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />Pick: {item.picked.toLocaleString()} <ArrowRight className="h-2.5 w-2.5 opacity-30" /> Pack: {item.packed.toLocaleString()} <ArrowRight className="h-2.5 w-2.5 opacity-30" /> Ship: {item.shipped.toLocaleString()}</div>
                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 opacity-40" />{item.carrier} | Cycle: {item.cycleTime}h</div>
                    <div className="flex items-center gap-1"><Activity className="h-3 w-3 opacity-40" />Pending: <span className={item.pending > 2000 ? "text-red-600 font-semibold" : "text-foreground"}>{item.pending.toLocaleString()}</span></div>
                    <div className="flex items-center gap-1"><Target className="h-3 w-3 opacity-40" />SLA: {item.slaActual}% vs {item.slaTarget}% target</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Pick Acc: <span className={`font-bold ${item.pickAcc >= 99 ? "text-emerald-600" : item.pickAcc >= 96 ? "text-amber-600" : "text-red-600"}`}>{item.pickAcc}%</span></div>
                    <div>Pack Acc: <span className={`font-medium ${item.packAcc >= 99 ? "text-emerald-600" : "text-foreground"}`}>{item.packAcc}%</span></div>
                    <div>Ship Rate: <span className={`font-bold ${item.shipRate >= 95 ? "text-emerald-600" : item.shipRate >= 85 ? "text-amber-600" : "text-red-600"}`}>{item.shipRate}%</span></div>
                    <div>Errors: <span className={`font-medium ${item.errors > 30 ? "text-red-600" : "text-foreground"}`}>{item.errors}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "performance" && (
          <div className="space-y-2">
            <div className="fla-perf-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{(totalShipped / 1000).toFixed(1)}K</div><div className="text-[10px] opacity-50">Total Shipped</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.round(items.reduce((s, i) => s + i.cycleTime, 0) / items.length)}h</div><div className="text-[10px] opacity-50">Avg Cycle Time</div></div>
                <div><div className="text-lg font-bold text-blue-600">{totalErrors}</div><div className="text-[10px] opacity-50">Total Errors</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.reduce((s, i) => s + i.returns, 0)}</div><div className="text-[10px] opacity-50">Total Returns</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.shipRate - b.shipRate).map(item => (
              <div key={item.id} className={`fla-perf-row rounded-lg border p-2 bg-card ${item.status === "Critical" ? "fla-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.warehouse}</span>
                    <span className="text-[10px] text-muted-foreground">{item.channel}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.shipRate >= 95 ? "text-emerald-600" : item.shipRate >= 85 ? "text-amber-600" : "text-red-600"}`}>{item.shipRate}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.shipRate >= 95 ? "bg-emerald-500" : item.shipRate >= 85 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.shipRate}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Cycle: <span className="font-medium">{item.cycleTime}h</span></div>
                  <div>Pick Acc: <span className="font-medium">{item.pickAcc}%</span></div>
                  <div>Errors: <span className={`font-medium ${item.errors > 30 ? "text-red-600" : "text-foreground"}`}>{item.errors}</span></div>
                  <div>Returns: <span className="font-medium">{item.returns}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "sla" && (
          <div className="space-y-2">
            <div className="fla-sla-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{avgSLA}%</div><div className="text-[10px] opacity-50">Avg SLA Actual</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.slaActual >= i.slaTarget).length}/{items.length}</div><div className="text-[10px] opacity-50">Meeting Target</div></div>
                <div><div className="text-lg font-bold text-red-600">{Math.max(...items.map(i => i.slaTarget - i.slaActual).filter(g => g > 0)) > 0 ? `${Math.max(...items.map(i => i.slaTarget - i.slaActual).filter(g => g > 0)).toFixed(1)}pp` : "None"}</div><div className="text-[10px] opacity-50">Max SLA Gap</div></div>
                <div><div className="text-lg font-bold text-purple-600">{totalPending.toLocaleString()}</div><div className="text-[10px] opacity-50">Pending Orders</div></div>
              </div>
            </div>
            {items.sort((a, b) => (a.slaActual - a.slaTarget) - (b.slaActual - b.slaTarget)).map(item => {
              const gap = item.slaActual - item.slaTarget
              return (
              <div key={item.id} className={`fla-sla-row rounded-lg border p-2 bg-card ${gap < -5 ? "fla-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.warehouse}</span>
                    <span className="text-[10px] text-muted-foreground">{item.priority}</span>
                  </div>
                  <span className={`text-xs font-bold ${gap >= 0 ? "text-emerald-600" : gap >= -5 ? "text-amber-600" : "text-red-600"}`}>{item.slaActual}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${gap >= 0 ? "bg-emerald-500" : gap >= -5 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(item.slaActual, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Target: <span className="font-medium">{item.slaTarget}%</span></div>
                  <div>Gap: <span className={`font-medium ${gap >= 0 ? "text-emerald-600" : "text-red-600"}`}>{gap >= 0 ? `+${gap.toFixed(1)}pp` : `${gap.toFixed(1)}pp`}</span></div>
                  <div>Carrier: <span className="font-medium">{item.carrier}</span></div>
                  <div>Pending: <span className={`font-medium ${item.pending > 2000 ? "text-red-600" : "text-foreground"}`}>{item.pending.toLocaleString()}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
