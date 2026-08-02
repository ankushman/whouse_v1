"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Star, AlertTriangle, Users, MessageCircle
} from "lucide-react"

const raw = [
  { id: "CXP-01", customer: "Reliance Fresh", segment: "Enterprise", region: "West", hub: "MUM-HUB1", nps: 82, csat: 91, ces: 88, tickets: 12, openTickets: 2, avgResponse: 4.2, resolution: 92, totalOrders: 2450, returns: 42, rtoRate: 1.7, value: 48500000, lastContact: "01 Aug 2026", channel: "Dedicated", priority: "Strategic" },
  { id: "CXP-02", customer: "PharmEasy", segment: "Enterprise", region: "North", hub: "DEL-HUB2", nps: 45, csat: 68, ces: 62, tickets: 38, openTickets: 12, avgResponse: 12.8, resolution: 72, totalOrders: 1820, returns: 85, rtoRate: 4.7, value: 32000000, lastContact: "02 Aug 2026", channel: "Email", priority: "At Risk" },
  { id: "CXP-03", customer: "Bosch GmbH", segment: "Global MNC", region: "South", hub: "BLR-HUB3", nps: 90, csat: 95, ces: 94, tickets: 5, openTickets: 0, avgResponse: 2.1, resolution: 100, totalOrders: 420, returns: 2, rtoRate: 0.5, value: 125000000, lastContact: "28 Jul 2026", channel: "Dedicated", priority: "Strategic" },
  { id: "CXP-04", customer: "JioMart", segment: "Enterprise", region: "West", hub: "MUM-HUB1", nps: 72, csat: 85, ces: 80, tickets: 22, openTickets: 5, avgResponse: 6.5, resolution: 85, totalOrders: 3800, returns: 120, rtoRate: 3.2, value: 21500000, lastContact: "03 Aug 2026", channel: "Phone", priority: "Growth" },
  { id: "CXP-05", customer: "Adani Wilmar", segment: "Enterprise", region: "East", hub: "CCU-HUB7", nps: 38, csat: 62, ces: 58, tickets: 45, openTickets: 18, avgResponse: 18.2, resolution: 65, totalOrders: 980, returns: 65, rtoRate: 6.6, value: 8900000, lastContact: "01 Aug 2026", channel: "Email", priority: "At Risk" },
  { id: "CXP-06", customer: "Metro Dairy Ltd", segment: "Mid-Market", region: "South", hub: "MAA-HUB4", nps: 78, csat: 88, ces: 85, tickets: 15, openTickets: 3, avgResponse: 5.8, resolution: 90, totalOrders: 620, returns: 18, rtoRate: 2.9, value: 5620000, lastContact: "30 Jul 2026", channel: "Phone", priority: "Growth" },
  { id: "CXP-07", customer: "Dabur India", segment: "Enterprise", region: "North", hub: "DEL-HUB2", nps: 85, csat: 92, ces: 90, tickets: 8, openTickets: 1, avgResponse: 3.5, resolution: 96, totalOrders: 1400, returns: 22, rtoRate: 1.6, value: 7800000, lastContact: "29 Jul 2026", channel: "Dedicated", priority: "Strategic" },
  { id: "CXP-08", customer: "Serum Institute", segment: "Global MNC", region: "West", hub: "PNQ-HUB6", nps: 88, csat: 93, ces: 91, tickets: 4, openTickets: 0, avgResponse: 1.8, resolution: 100, totalOrders: 180, returns: 0, rtoRate: 0, value: 210000000, lastContact: "25 Jul 2026", channel: "Dedicated", priority: "Strategic" },
  { id: "CXP-09", customer: "Royal Dutch Retail", segment: "Global MNC", region: "West", hub: "MUM-HUB1", nps: 75, csat: 82, ces: 78, tickets: 18, openTickets: 4, avgResponse: 7.2, resolution: 82, totalOrders: 560, returns: 15, rtoRate: 2.7, value: 18500000, lastContact: "31 Jul 2026", channel: "Phone", priority: "Growth" },
  { id: "CXP-10", customer: "Al Mulla Electronics", segment: "Mid-Market", region: "North", hub: "DEL-HUB2", nps: 52, csat: 72, ces: 68, tickets: 28, openTickets: 9, avgResponse: 14.5, resolution: 70, totalOrders: 340, returns: 28, rtoRate: 8.2, value: 4200000, lastContact: "02 Aug 2026", channel: "Email", priority: "At Risk" },
]

interface CXPItem {
  id: string; customer: string; segment: string; region: string; hub: string
  nps: number; csat: number; ces: number; tickets: number; openTickets: number
  avgResponse: number; resolution: number; totalOrders: number; returns: number
  rtoRate: number; value: number; lastContact: string; channel: string; priority: string
}

type Rec = any
const items: CXPItem[] = raw.map((r: Rec) => ({
  id: r.id, customer: r.customer, segment: r.segment, region: r.region, hub: r.hub,
  nps: r.nps, csat: r.csat, ces: r.ces, tickets: r.tickets, openTickets: r.openTickets,
  avgResponse: r.avgResponse, resolution: r.resolution, totalOrders: r.totalOrders, returns: r.returns,
  rtoRate: r.rtoRate, value: r.value, lastContact: r.lastContact, channel: r.channel, priority: r.priority,
}))

const segColors: Record<string, string> = {
  "Enterprise": "bg-violet-100 text-violet-700", "Global MNC": "bg-emerald-100 text-emerald-700",
  "Mid-Market": "bg-sky-100 text-sky-700",
}

const priorityColors: Record<string, string> = {
  "Strategic": "bg-emerald-100 text-emerald-700", "Growth": "bg-blue-100 text-blue-700",
  "At Risk": "bg-red-100 text-red-700",
}

const npsColor = (v: number) => v >= 75 ? "text-emerald-600" : v >= 50 ? "text-amber-600" : "text-red-600"
const respColor = (v: number) => v <= 4 ? "text-emerald-600" : v <= 8 ? "text-amber-600" : "text-red-600"
const rtoColor = (v: number) => v <= 2 ? "text-emerald-600" : v <= 5 ? "text-amber-600" : "text-red-600"
const formatINR = (v: number) => v >= 10000000 ? `\u20b9${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `\u20b9${(v / 100000).toFixed(1)}L` : `\u20b9${(v / 1000).toFixed(0)}K`

const CustomerExperiencePanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"customers" | "satisfaction" | "service">("customers")
  const filters = [
    { key: "segment", label: "Segment", options: ["Enterprise", "Global MNC", "Mid-Market"] },
    { key: "priority", label: "Priority", options: ["Strategic", "Growth", "At Risk"] },
    { key: "region", label: "Region", options: ["West", "North", "South", "East"] },
  ]

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n = Object.assign({}, prev)
      if (n[key] === value) { delete n[key] } else { n[key] = value }
      return n
    })
  }

  const filtered = items.filter((r: Rec) =>
    Object.entries(activeFilters).every(([k, v]) => r[k as keyof Rec] === v)
  )

  const totalCust = filtered.length
  const avgNPS = totalCust ? Math.round(filtered.reduce((s, r) => s + r.nps, 0) / totalCust) : 0
  const openTickets = filtered.reduce((s, r) => s + r.openTickets, 0)
  const atRisk = filtered.filter(r => r.priority === "At Risk").length

  const insights = [
    { label: "Total Customers", value: totalCust, icon: Users, bg: "bg-blue-50" },
    { label: "Avg NPS", value: avgNPS, icon: Star, bg: "bg-amber-50" },
    { label: "Open Tickets", value: openTickets, icon: MessageCircle, bg: "bg-violet-50" },
    { label: "At Risk", value: atRisk, icon: AlertTriangle, bg: "bg-red-50" },
  ]

  const isCritical = (r: CXPItem) => r.priority === "At Risk" && r.nps < 45
  const isWarning = (r: CXPItem) => r.priority === "At Risk" || r.openTickets >= 10

  const starDisplay = (nps: number) => (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`w-3 h-3 ${s <= Math.round(nps / 20) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
      ))}
    </span>
  )

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {insights.map(sc => {
          const SIcon = sc.icon as React.ElementType
          return (
            <div key={sc.label} className={`${sc.bg} rounded-lg p-3`}>
              <div className="flex items-center gap-2 mb-1"><SIcon className="w-4 h-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{sc.label}</span></div>
              <div className="text-lg font-bold">{sc.value}</div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <div key={f.key} className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">{f.label}:</span>
            {f.options.map(o => (
              <button key={o} onClick={() => toggleFilter(f.key, o)}
                className={`cxp-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["customers", "satisfaction", "service"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "customers" && (
        <div className="cxp-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`cxp-item-card p-3 rounded-lg border ${isCritical(r) ? "cxp-critical" : isWarning(r) ? "cxp-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.customer}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${segColors[r.segment]}`}>{r.segment}</span>
                </div>
                <div className="flex items-center gap-2">
                  {starDisplay(r.nps)}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${priorityColors[r.priority]}`}>{r.priority}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>NPS: <span className={`font-medium ${npsColor(r.nps)}`}>{r.nps}</span></div>
                <div>CSAT: <span className={`font-medium ${r.csat >= 85 ? "text-emerald-600" : r.csat >= 70 ? "text-amber-600" : "text-red-600"}`}>{r.csat}%</span></div>
                <div>CES: <span className="font-medium">{r.ces}%</span></div>
                <div>Open Tickets: <span className={`font-medium ${r.openTickets >= 10 ? "text-red-600" : r.openTickets > 0 ? "text-amber-600" : "text-emerald-600"}`}>{r.openTickets}/{r.tickets}</span></div>
                <div>Orders: <span className="font-medium">{r.totalOrders.toLocaleString()}</span></div>
                <div>Value: <span className="font-medium">{formatINR(r.value)}</span></div>
                <div>RTO Rate: <span className={`font-medium ${rtoColor(r.rtoRate)}`}>{r.rtoRate}%</span></div>
                <div>Channel: <span className="font-medium">{r.channel}</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.hub}, {r.region}</span>
                <span>Last Contact: {r.lastContact}</span>
              </div>
              {isCritical(r) && <div className="cxp-alert-text text-xs mt-2">Critical — NPS {r.nps}, {r.openTickets} open tickets, {formatINR(r.value)} at risk</div>}
            </div>
          ))}
        </div>
      )}

      {view === "satisfaction" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => a.nps - b.nps).map(r => (
            <div key={r.id} className="cxp-sat-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.customer}</span>
                  {starDisplay(r.nps)}
                </div>
                <span className={`text-lg font-bold ${npsColor(r.nps)}`}>{r.nps}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="cxp-nps-bar h-2 rounded-full" style={{ width: `${r.nps}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>CSAT: <span className="font-medium">{r.csat}%</span></div>
                <div>CES: <span className="font-medium">{r.ces}%</span></div>
                <div>RTO: <span className={`font-medium ${rtoColor(r.rtoRate)}`}>{r.rtoRate}%</span></div>
                <div>Value: <span className="font-medium">{formatINR(r.value)}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${segColors[r.segment]}`}>{r.segment}</span>
                <span className={`px-1.5 py-0.5 rounded-full ${priorityColors[r.priority]}`}>{r.priority}</span>
                <span className="text-muted-foreground">{r.totalOrders.toLocaleString()} orders</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "service" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.openTickets - a.openTickets).map(r => (
            <div key={r.id} className="cxp-svc-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.customer}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Open: <span className={`font-bold ${r.openTickets >= 10 ? "text-red-600" : "text-gray-600"}`}>{r.openTickets}</span></span>
                  <span className="text-sm text-muted-foreground">Total: {r.tickets}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Avg Response: <span className={`font-medium ${respColor(r.avgResponse)}`}>{r.avgResponse}h</span></div>
                <div>Resolution: <span className="font-medium">{r.resolution}%</span></div>
                <div>Channel: <span className="font-medium">{r.channel}</span></div>
                <div>Last Contact: <span className="font-medium">{r.lastContact}</span></div>
                <div>Returns: <span className="font-medium">{r.returns}</span></div>
                <div>RTO Rate: <span className={`font-medium ${rtoColor(r.rtoRate)}`}>{r.rtoRate}%</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${priorityColors[r.priority]}`}>{r.priority}</span>
                <span className="text-muted-foreground">{r.hub}, {r.region} | {formatINR(r.value)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { CustomerExperiencePanel }
