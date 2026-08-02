"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Network, MapPin, ArrowUpDown, Activity,
  AlertTriangle, CheckCircle, XCircle,
  Server, Gauge
} from "lucide-react"

const raw = [
  { id: "WNM-01", dc: "Mumbai Mega Hub", zone: "West Region", city: "Mumbai", role: "Primary Hub", capacity: 95000, utilized: 78200, throughput: 12500, inbound: 5200, outbound: 7300, network: "Connected", latency: 12, uptime: 99.8, nodes: 24, bandwidth: 850, status: "Healthy", month: "Aug 2026", pods: 18, aisles: 96, docks: 32 },
  { id: "WNM-02", dc: "Delhi NCR Hub", zone: "North Region", city: "Delhi", role: "Primary Hub", capacity: 88000, utilized: 83600, throughput: 14200, inbound: 6100, outbound: 8100, network: "Connected", latency: 8, uptime: 99.5, nodes: 28, bandwidth: 920, status: "Warning", month: "Aug 2026", pods: 16, aisles: 88, docks: 28 },
  { id: "WNM-03", dc: "Bengaluru DC3", zone: "South Region", city: "Bengaluru", role: "Secondary Hub", capacity: 62000, utilized: 43400, throughput: 8900, inbound: 3800, outbound: 5100, network: "Connected", latency: 15, uptime: 99.9, nodes: 18, bandwidth: 680, status: "Healthy", month: "Aug 2026", pods: 12, aisles: 64, docks: 20 },
  { id: "WNM-04", dc: "Kolkata DC7", zone: "East Region", city: "Kolkata", role: "Spoke", capacity: 35000, utilized: 33200, throughput: 5600, inbound: 2400, outbound: 3200, network: "Degraded", latency: 45, uptime: 97.2, nodes: 10, bandwidth: 320, status: "Critical", month: "Aug 2026", pods: 8, aisles: 40, docks: 12 },
  { id: "WNM-05", dc: "Hyderabad DC5", zone: "South Region", city: "Hyderabad", role: "Secondary Hub", capacity: 55000, utilized: 41200, throughput: 9800, inbound: 4200, outbound: 5600, network: "Connected", latency: 18, uptime: 99.6, nodes: 16, bandwidth: 720, status: "Healthy", month: "Aug 2026", pods: 14, aisles: 72, docks: 18 },
  { id: "WNM-06", dc: "Chennai DC4", zone: "South Region", city: "Chennai", role: "Port Gateway", capacity: 48000, utilized: 43200, throughput: 7800, inbound: 4200, outbound: 3600, network: "Connected", latency: 22, uptime: 99.1, nodes: 14, bandwidth: 580, status: "Warning", month: "Aug 2026", pods: 10, aisles: 56, docks: 24 },
  { id: "WNM-07", dc: "Pune DC6", zone: "West Region", city: "Pune", role: "Fulfilment Centre", capacity: 42000, utilized: 35700, throughput: 7200, inbound: 3000, outbound: 4200, network: "Connected", latency: 14, uptime: 99.7, nodes: 12, bandwidth: 520, status: "Healthy", month: "Aug 2026", pods: 10, aisles: 48, docks: 14 },
  { id: "WNM-08", dc: "Jaipur DC9", zone: "North Region", city: "Jaipur", role: "Spoke", capacity: 28000, utilized: 26600, throughput: 4200, inbound: 1800, outbound: 2400, network: "Degraded", latency: 38, uptime: 98.5, nodes: 8, bandwidth: 280, status: "At Risk", month: "Aug 2026", pods: 6, aisles: 32, docks: 8 },
  { id: "WNM-09", dc: "Ahmedabad DC8", zone: "West Region", city: "Ahmedabad", role: "Distribution Centre", capacity: 52000, utilized: 41600, throughput: 8400, inbound: 3600, outbound: 4800, network: "Connected", latency: 10, uptime: 99.4, nodes: 14, bandwidth: 640, status: "Healthy", month: "Aug 2026", pods: 12, aisles: 60, docks: 16 },
  { id: "WNM-10", dc: "Lucknow DC10", zone: "North Region", city: "Lucknow", role: "Spoke", capacity: 22000, utilized: 20900, throughput: 3200, inbound: 1400, outbound: 1800, network: "Connected", latency: 25, uptime: 99.2, nodes: 6, bandwidth: 200, status: "Warning", month: "Aug 2026", pods: 5, aisles: 28, docks: 6 },
]

interface WNMItem {
  id: string; dc: string; zone: string; city: string; role: string
  capacity: number; utilized: number; throughput: number; inbound: number
  outbound: number; network: string; latency: number; uptime: number
  nodes: number; bandwidth: number; status: string; month: string
  pods: number; aisles: number; docks: number
}

const items: WNMItem[] = raw.map((r: any) => ({
  id: r.id, dc: r.dc, zone: r.zone, city: r.city, role: r.role,
  capacity: r.capacity, utilized: r.utilized, throughput: r.throughput, inbound: r.inbound,
  outbound: r.outbound, network: r.network, latency: r.latency, uptime: r.uptime,
  nodes: r.nodes, bandwidth: r.bandwidth, status: r.status, month: r.month,
  pods: r.pods, aisles: r.aisles, docks: r.docks,
}))

const statusColors: Record<string, string> = {
  "Healthy": "text-emerald-600 font-semibold", "Warning": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Critical": "text-red-600 font-semibold",
}
const roleColors: Record<string, string> = {
  "Primary Hub": "bg-blue-100 text-blue-700", "Secondary Hub": "bg-indigo-100 text-indigo-700",
  "Spoke": "bg-gray-100 text-gray-600", "Port Gateway": "bg-teal-100 text-teal-700",
  "Fulfilment Centre": "bg-purple-100 text-purple-700", "Distribution Centre": "bg-orange-100 text-orange-700",
}
const networkColors: Record<string, string> = {
  "Connected": "text-emerald-600", "Degraded": "text-red-600", "Offline": "text-gray-400",
}
const zones = [...new Set(items.map(i => i.zone))]
const avgUptime = Math.round(items.reduce((s, i) => s + i.uptime, 0) / items.length * 10) / 10
const totalThroughput = items.reduce((s, i) => s + i.throughput, 0)
const avgUtilization = Math.round(items.reduce((s, i) => s + (i.utilized / i.capacity * 100), 0) / items.length)
const totalNodes = items.reduce((s, i) => s + i.nodes, 0)

type Rec = any
type FV = Record<string, string>
type VT = "network" | "capacity" | "topology"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`wnm-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function WarehouseNetworkMonitoringPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("network")

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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.dc}: CRITICAL \u2014 ${Math.round(i.utilized / i.capacity * 100)}% utilized, network ${i.network}, uptime ${i.uptime}%`, severity: "critical" as const })),
    ...items.filter(i => i.network === "Degraded").map(i => ({ id: i.id, msg: `${i.dc}: Network DEGRADED \u2014 latency ${i.latency}ms, ${i.nodes} nodes at risk`, severity: "warning" as const })),
    ...items.filter(i => i.latency > 30).map(i => ({ id: i.id, msg: `${i.dc}: High latency ${i.latency}ms \u2014 exceeds 30ms threshold, throughput impacted`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Network, title: "Network Health", desc: `${items.filter(i => i.network === "Connected").length}/${items.length} connected | ${totalNodes} nodes active`, accent: avgUptime >= 99 ? "text-emerald-500" : "text-red-500" },
    { icon: ArrowUpDown, title: "Throughput", desc: `${(totalThroughput / 1000).toFixed(1)}K units/day across all DCs`, accent: "text-blue-500" },
    { icon: Gauge, title: "Utilization", desc: `${avgUtilization}% avg | ${items.filter(i => i.utilized / i.capacity > 0.9).length} DCs above 90%`, accent: avgUtilization > 85 ? "text-red-500" : "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center"><Server className="h-4 w-4 text-cyan-600" /></div>
            <div><h3 className="text-sm font-bold">Warehouse Network Monitoring</h3><p className="text-xs opacity-60">{items.length} DCs | {totalNodes} nodes</p></div>
          </div>
          <div className="flex gap-1">
            {(["network", "capacity", "topology"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "network" ? "Network" : v === "capacity" ? "Capacity" : "Topology"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("DCs", items.length.toString(), MapPin, "bg-cyan-50/50")}
          {statCard("Uptime", `${avgUptime}%`, CheckCircle, "bg-emerald-50/50")}
          {statCard("Throughput", `${(totalThroughput / 1000).toFixed(1)}K/d`, ArrowUpDown, "bg-blue-50/50")}
          {statCard("Utilization", `${avgUtilization}%`, Gauge, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {zones.map(t => {
            const active = activeFilters.zone === t
            return <span key={t} onClick={() => toggle("zone", active ? undefined : t)} className={`wnm-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="wnm-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="wnm-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="wnm-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Network Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`wnm-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "network" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const utilPct = Math.round(item.utilized / item.capacity * 100)
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "Warning" || item.status === "At Risk"
              return (
                <div key={item.id} className={`wnm-net-card rounded-lg border p-2.5 bg-card ${isCritical ? "wnm-critical-pulse" : isWarning ? "wnm-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="wnm-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.dc}</span>
                      <span className={`wnm-role-tag text-[10px] px-1.5 py-0.5 rounded ${roleColors[item.role] || "bg-slate-100"}`}>{item.role}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${networkColors[item.network] || "text-muted-foreground"}`}>{item.network}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Healthy" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.zone} | {item.city}</div>
                    <div className="flex items-center gap-1"><Server className="h-3 w-3 opacity-40" />{item.nodes} nodes | {item.bandwidth} Mbps</div>
                    <div className="flex items-center gap-1"><Gauge className="h-3 w-3 opacity-40" />Uptime: <span className={item.uptime >= 99.5 ? "text-emerald-600" : item.uptime >= 99 ? "text-amber-600" : "text-red-600"}>{item.uptime}%</span></div>
                    <div className="flex items-center gap-1"><Activity className="h-3 w-3 opacity-40" />Latency: <span className={item.latency > 30 ? "text-red-600 font-semibold" : item.latency > 20 ? "text-amber-600" : "text-foreground"}>{item.latency}ms</span></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Throughput: <span className="font-bold">{item.throughput.toLocaleString()}</span></div>
                    <div>Inbound: <span className="font-medium">{item.inbound.toLocaleString()}</span></div>
                    <div>Outbound: <span className="font-medium">{item.outbound.toLocaleString()}</span></div>
                    <div>Docks: <span className="font-medium">{item.docks}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "capacity" && (
          <div className="space-y-2">
            <div className="wnm-cap-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-cyan-600">{(items.reduce((s, i) => s + i.capacity, 0) / 1000).toFixed(0)}K</div><div className="text-[10px] opacity-50">Total Capacity</div></div>
                <div><div className="text-lg font-bold text-amber-600">{avgUtilization}%</div><div className="text-[10px] opacity-50">Avg Utilization</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.utilized / i.capacity > 0.9).length}</div><div className="text-[10px] opacity-50">Over 90% Full</div></div>
                <div><div className="text-lg font-bold text-blue-600">{(totalThroughput / 1000).toFixed(1)}K</div><div className="text-[10px] opacity-50">Daily Throughput</div></div>
              </div>
            </div>
            {items.sort((a, b) => (b.utilized / b.capacity) - (a.utilized / a.capacity)).map(item => {
              const utilPct = Math.round(item.utilized / item.capacity * 100)
              return (
              <div key={item.id} className={`wnm-cap-row rounded-lg border p-2 bg-card ${utilPct > 90 ? "wnm-critical-pulse" : utilPct > 80 ? "wnm-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.dc}</span>
                    <span className="text-[10px] text-muted-foreground">{item.role}</span>
                  </div>
                  <span className={`text-xs font-bold ${utilPct > 90 ? "text-red-600" : utilPct > 80 ? "text-amber-600" : "text-emerald-600"}`}>{utilPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${utilPct > 90 ? "bg-red-500" : utilPct > 80 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${utilPct}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Used: <span className="font-medium">{(item.utilized / 1000).toFixed(1)}K</span></div>
                  <div>Free: <span className="font-medium">{((item.capacity - item.utilized) / 1000).toFixed(1)}K</span></div>
                  <div>Pods: <span className="font-medium">{item.pods}</span></div>
                  <div>Aisles: <span className="font-medium">{item.aisles}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}

        {view === "topology" && (
          <div className="space-y-2">
            <div className="wnm-topo-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-violet-600">{items.filter(i => i.role === "Primary Hub").length}</div><div className="text-[10px] opacity-50">Primary Hubs</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.role === "Secondary Hub").length}</div><div className="text-[10px] opacity-50">Secondary Hubs</div></div>
                <div><div className="text-lg font-bold text-gray-600">{items.filter(i => i.role === "Spoke").length}</div><div className="text-[10px] opacity-50">Spoke DCs</div></div>
                <div><div className="text-lg font-bold text-teal-600">{items.filter(i => i.role.includes("Gateway") || i.role.includes("Centre") || i.role.includes("Distribution")).length}</div><div className="text-[10px] opacity-50">Specialized</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.bandwidth - a.bandwidth).map(item => (
              <div key={item.id} className="wnm-topo-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.dc}</span>
                    <span className={`wnm-role-tag text-[10px] px-1.5 py-0.5 rounded ${roleColors[item.role] || "bg-slate-100"}`}>{item.role}</span>
                  </div>
                  <span className="text-xs font-bold">{item.bandwidth} Mbps</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${Math.min(item.bandwidth / 10, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Latency: <span className={`font-medium ${item.latency > 30 ? "text-red-600" : "text-foreground"}`}>{item.latency}ms</span></div>
                  <div>Uptime: <span className={`font-medium ${item.uptime < 99 ? "text-red-600" : "text-foreground"}`}>{item.uptime}%</span></div>
                  <div>Nodes: <span className="font-medium">{item.nodes}</span></div>
                  <div>Network: <span className={`font-medium ${networkColors[item.network] || "text-foreground"}`}>{item.network}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
