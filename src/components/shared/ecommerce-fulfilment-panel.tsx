"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart, AlertTriangle, CheckCircle, XCircle, TrendingUp, Clock, Package, Truck, Globe, MapPin, Zap, BarChart3
} from "lucide-react"

const raw = [
  { id: "ECF-01", order: "ORD-82451", channel: "Amazon", marketplace: "Amazon IN", priority: "Same Day", sku: "SK-2847 Basmati Rice", qty: 2, value: 1850, ack: "08:15", pick: "08:42", pack: "09:05", ship: "09:30", promised: "20:00", carrier: "Amazon Shipping", hub: "BOM-HUB1", city: "Mumbai", region: "West", status: "Shipped", rtoRisk: 5 },
  { id: "ECF-02", order: "ORD-82462", channel: "Flipkart", marketplace: "Flipkart", priority: "Next Day", sku: "SK-5521 LED Panel 32in", qty: 1, value: 12499, ack: "07:30", pick: "09:15", pack: "10:00", ship: null, promised: "18:00", carrier: "Ekart", hub: "DEL-HUB2", city: "Delhi", region: "North", status: "Packing", rtoRisk: 12 },
  { id: "ECF-03", order: "ORD-82478", channel: "Meesho", marketplace: "Meesho", priority: "Standard", sku: "SK-2290 Cotton Bedsheet", qty: 3, value: 897, ack: "06:00", pick: "08:00", pack: null, ship: null, promised: "T+3", carrier: "XpressBees", hub: "CCU-HUB7", city: "Kolkata", region: "East", status: "Picking", rtoRisk: 22 },
  { id: "ECF-04", order: "ORD-82491", channel: "Myntra", marketplace: "Myntra", priority: "Next Day", sku: "SK-9901 Running Shoes", qty: 1, value: 3499, ack: "09:00", pick: null, pack: null, ship: null, promised: "18:00", carrier: "Shadowfax", hub: "BLR-HUB3", city: "Bengaluru", region: "South", status: "Pending", rtoRisk: 8 },
  { id: "ECF-05", order: "ORD-82502", channel: "Ajio", marketplace: "Reliance AJIO", priority: "Same Day", sku: "SK-4455 Silk Scarf", qty: 2, value: 4200, ack: "10:00", pick: "10:30", pack: "10:55", ship: "11:20", promised: "22:00", carrier: "Delhivery", hub: "HYD-HUB5", city: "Hyderabad", region: "South", status: "Shipped", rtoRisk: 6 },
  { id: "ECF-06", order: "ORD-82515", channel: "Nykaa", marketplace: "Nykaa", priority: "Standard", sku: "SK-3312 Face Cream Set", qty: 1, value: 1899, ack: "05:30", pick: "07:00", pack: "07:30", ship: null, promised: "T+5", carrier: "BlueDart", hub: "MAA-HUB4", city: "Chennai", region: "South", status: "Packed", rtoRisk: 10 },
  { id: "ECF-07", order: "ORD-82528", channel: "JioMart", marketplace: "JioMart", priority: "Express 2h", sku: "SK-1102 Atta 10kg", qty: 1, value: 450, ack: "11:00", pick: null, pack: null, ship: null, promised: "13:00", carrier: "Dunzo", hub: "PNQ-HUB6", city: "Pune", region: "West", status: "Delayed", rtoRisk: 35 },
  { id: "ECF-08", order: "ORD-82533", channel: "Amazon", marketplace: "Amazon IN", priority: "Same Day", sku: "SK-7789 Bluetooth Speaker", qty: 1, value: 2199, ack: "09:45", pick: "10:10", pack: "10:35", ship: "11:00", promised: "21:00", carrier: "Amazon Shipping", hub: "DEL-HUB2", city: "Delhi", region: "North", status: "Shipped", rtoRisk: 4 },
  { id: "ECF-09", order: "ORD-82545", channel: "Snapdeal", marketplace: "Snapdeal", priority: "Standard", sku: "SK-6678 Phone Cover", qty: 5, value: 295, ack: "04:00", pick: "06:30", pack: "07:00", ship: null, promised: "T+7", carrier: "Ecom Express", hub: "JAI-HUB9", city: "Jaipur", region: "North", status: "Packed", rtoRisk: 28 },
  { id: "ECF-10", order: "ORD-82558", channel: "CRED", marketplace: "CRED Store", priority: "Next Day", sku: "SK-8834 Premium Gift Box", qty: 1, value: 8500, ack: "08:00", pick: null, pack: null, ship: null, promised: "20:00", carrier: "Rivigo", hub: "LKO-HUB10", city: "Lucknow", region: "North", status: "Pending", rtoRisk: 15 },
]

interface ECFItem {
  id: string; order: string; channel: string; marketplace: string; priority: string
  sku: string; qty: number; value: number; ack: string; pick: string | null
  pack: string | null; ship: string | null; promised: string; carrier: string
  hub: string; city: string; region: string; status: string; rtoRisk: number
}

const items: ECFItem[] = raw.map((r: any) => ({
  id: r.id, order: r.order, channel: r.channel, marketplace: r.marketplace, priority: r.priority,
  sku: r.sku, qty: r.qty, value: r.value, ack: r.ack, pick: r.pick,
  pack: r.pack, ship: r.ship, promised: r.promised, carrier: r.carrier,
  hub: r.hub, city: r.city, region: r.region, status: r.status, rtoRisk: r.rtoRisk,
}))

const statusColors: Record<string, string> = {
  "Shipped": "text-emerald-600 font-semibold", "Packed": "text-blue-600 font-semibold",
  "Packing": "text-cyan-600 font-semibold", "Picking": "text-amber-600 font-semibold",
  "Pending": "text-gray-500 font-semibold", "Delayed": "text-red-600 font-semibold",
}
const channelColors: Record<string, string> = {
  "Amazon": "bg-orange-100 text-orange-700", "Flipkart": "bg-yellow-100 text-yellow-800",
  "Meesho": "bg-pink-100 text-pink-700", "Myntra": "bg-red-100 text-red-700",
  "Ajio": "bg-indigo-100 text-indigo-700", "Nykaa": "bg-fuchsia-100 text-fuchsia-700",
  "JioMart": "bg-blue-100 text-blue-700", "Snapdeal": "bg-red-100 text-red-600",
  "CRED": "bg-gray-900 text-gray-50",
}
const priorityColors: Record<string, string> = {
  "Express 2h": "bg-red-100 text-red-700", "Same Day": "bg-orange-100 text-orange-700",
  "Next Day": "bg-amber-100 text-amber-700", "Standard": "bg-gray-100 text-gray-600",
}
const regions = [...new Set(items.map(i => i.region))]
const totalValue = items.reduce((s, i) => s + i.value, 0)
const avgRTO = Math.round(items.reduce((s, i) => s + i.rtoRisk, 0) / items.length * 10) / 10
const shippedCount = items.filter(i => i.status === "Shipped").length
const delayedCount = items.filter(i => i.status === "Delayed").length

type Rec = any
type FV = Record<string, string>
type VT = "orders" | "performance" | "channels"

function formatINR(n: number): string {
  if (n >= 100000) return `\u20b9${(n / 1000).toFixed(1)}K`
  return `\u20b9${n.toLocaleString()}`
}

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`ecf-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function EcommerceFulfilmentPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("orders")

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
    ...items.filter(i => i.status === "Delayed").map(i => ({ id: i.id, msg: `${i.order}: DELAYED \u2014 ${i.priority}, promised ${i.promised}, ${i.marketplace}, carrier ${i.carrier}`, severity: "critical" as const })),
    ...items.filter(i => i.rtoRisk > 25).map(i => ({ id: i.id, msg: `${i.order}: HIGH RTO RISK ${i.rtoRisk}% \u2014 ${i.marketplace}, ${i.sku}, value ${formatINR(i.value)}`, severity: "warning" as const })),
    ...items.filter(i => i.status === "Pending" && i.priority === "Express 2h").map(i => ({ id: i.id, msg: `${i.order}: EXPRESS PENDING \u2014 2h SLA at risk, ${i.marketplace}, ${i.sku}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: ShoppingCart, title: "Order Value", desc: `${formatINR(totalValue)} across ${items.length} orders | ${shippedCount} shipped`, accent: delayedCount > 0 ? "text-red-500" : "text-emerald-500" },
    { icon: Zap, title: "Fulfil Rate", desc: `${Math.round(shippedCount / items.length * 100)}% same-day shipped | ${delayedCount} delayed`, accent: delayedCount > 0 ? "text-red-500" : "text-blue-500" },
    { icon: TrendingUp, title: "RTO Risk", desc: `${avgRTO}% avg risk | ${items.filter(i => i.rtoRisk > 20).length} high risk orders`, accent: avgRTO > 15 ? "text-red-500" : "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center"><Globe className="h-4 w-4 text-orange-600" /></div>
            <div><h3 className="text-sm font-bold">E-commerce Fulfilment</h3><p className="text-xs opacity-60">{items.length} orders | {regions.length} regions</p></div>
          </div>
          <div className="flex gap-1">
            {(["orders", "performance", "channels"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "orders" ? "Orders" : v === "performance" ? "Performance" : "Channels"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Orders", items.length.toString(), ShoppingCart, "bg-orange-50/50")}
          {statCard("Value", formatINR(totalValue), BarChart3, "bg-blue-50/50")}
          {statCard("Shipped", `${shippedCount}/${items.length}`, Truck, "bg-emerald-50/50")}
          {statCard("Avg RTO", `${avgRTO}%`, AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {regions.map(t => {
            const active = activeFilters.region === t
            return <span key={t} onClick={() => toggle("region", active ? undefined : t)} className={`ecf-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="ecf-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="ecf-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="ecf-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Fulfilment Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`ecf-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "orders" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isDelayed = item.status === "Delayed"
              const isPending = item.status === "Pending"
              const pipelineStep = item.ship ? 4 : item.pack ? 3 : item.pick ? 2 : 1
              return (
                <div key={item.id} className={`ecf-order-card rounded-lg border p-2.5 bg-card ${isDelayed ? "ecf-delayed-pulse" : isPending && item.priority === "Express 2h" ? "ecf-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="ecf-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.order}</span>
                      <span className={`ecf-channel-tag text-[10px] px-1.5 py-0.5 rounded ${channelColors[item.channel] || "bg-slate-100"}`}>{item.channel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`ecf-priority-tag text-[10px] px-1.5 py-0.5 rounded ${priorityColors[item.priority] || "bg-slate-100"}`}>{item.priority}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isDelayed ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Shipped" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.sku} | Qty: {item.qty} | {formatINR(item.value)}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.hub} | {item.city}, {item.region}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Ack: {item.ack} | Pick: {item.pick || "--"} | Pack: {item.pack || "--"} | Ship: {item.ship || "--"}</div>
                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 opacity-40" />{item.carrier} | Promised: <span className={isDelayed ? "text-red-600 font-semibold" : "text-foreground"}>{item.promised}</span></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Pipeline: <span className="font-medium">{pipelineStep}/4</span></div>
                    <div>RTO Risk: <span className={`font-medium ${item.rtoRisk > 20 ? "text-red-600" : item.rtoRisk > 10 ? "text-amber-600" : "text-emerald-600"}`}>{item.rtoRisk}%</span></div>
                    <div>Marketplace: <span className="font-medium">{item.marketplace}</span></div>
                    <div>Hub: <span className="font-medium">{item.hub}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "performance" && (
          <div className="space-y-2">
            <div className="ecf-perf-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">${Math.round(shippedCount / items.length * 100)}%</div><div className="text-[10px] opacity-50">Fulfil Rate</div></div>
                <div><div className="text-lg font-bold text-red-600">${avgRTO}%</div><div className="text-[10px] opacity-50">Avg RTO Risk</div></div>
                <div><div className="text-lg font-bold text-blue-600">{formatINR(Math.round(totalValue / items.length))}</div><div className="text-[10px] opacity-50">Avg Order Value</div></div>
                <div><div className="text-lg font-bold text-orange-600">${delayedCount}</div><div className="text-[10px] opacity-50">Delayed</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.value - a.value).map(item => (
              <div key={item.id} className={`ecf-perf-row rounded-lg border p-2 bg-card ${item.status === "Delayed" ? "ecf-delayed-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.order}</span>
                    <span className="text-[10px] text-muted-foreground">{item.marketplace}</span>
                  </div>
                  <span className="text-xs font-bold">{formatINR(item.value)}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.status === "Shipped" ? "bg-emerald-500" : item.status === "Delayed" ? "bg-red-500" : "bg-amber-500"}`} style={{ width: `${item.status === "Shipped" ? 100 : item.pack ? 75 : item.pick ? 50 : 25}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Status: <span className={`font-medium ${statusColors[item.status] || "text-foreground"}`}>{item.status}</span></div>
                  <div>RTO: <span className={`font-medium ${item.rtoRisk > 20 ? "text-red-600" : "text-foreground"}`}>{item.rtoRisk}%</span></div>
                  <div>Carrier: <span className="font-medium">{item.carrier}</span></div>
                  <div>Priority: <span className="font-medium">{item.priority}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "channels" && (
          <div className="space-y-2">
            <div className="ecf-chan-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{[...new Set(items.map(i => i.channel))].length}</div><div className="text-[10px] opacity-50">Channels</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{formatINR(totalValue)}</div><div className="text-[10px] opacity-50">Total GMV</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.reduce((s, i) => s + i.qty, 0)}</div><div className="text-[10px] opacity-50">Total Units</div></div>
                <div><div className="text-lg font-bold text-orange-600">{[...new Set(items.map(i => i.carrier))].length}</div><div className="text-[10px] opacity-50">Carriers</div></div>
              </div>
            </div>
            {([...new Set(items.map(i => i.channel))] as string[]).map(channel => {
              const channelItems = items.filter(i => i.channel === channel)
              const chanValue = channelItems.reduce((s, i) => s + i.value, 0)
              const chanShipped = channelItems.filter(i => i.status === "Shipped").length
              const maxVal = Math.max(...[...new Set(items.map(i => i.channel))].map(c => items.filter(i => i.channel === c).reduce((s, i) => s + i.value, 0)))
              return (
              <div key={channel} className="ecf-chan-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`ecf-channel-tag text-[10px] px-1.5 py-0.5 rounded ${channelColors[channel] || "bg-slate-100"}`}>{channel}</span>
                    <span className="text-xs font-semibold">{channelItems.length} orders</span>
                  </div>
                  <span className="text-xs font-bold">{formatINR(chanValue)}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.round(chanValue / maxVal * 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Shipped: <span className="font-medium">{chanShipped}/{channelItems.length}</span></div>
                  <div>Avg RTO: <span className="font-medium">{Math.round(channelItems.reduce((s, i) => s + i.rtoRisk, 0) / channelItems.length)}%</span></div>
                  <div>Units: <span className="font-medium">{channelItems.reduce((s, i) => s + i.qty, 0)}</span></div>
                  <div>Carriers: <span className="font-medium">{channelItems.map(i => i.carrier).join(", ")}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
