"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Award, Star, TrendingUp, TrendingDown, AlertTriangle,
  Clock, Truck, MapPin, Package, ArrowRightLeft, Target
} from "lucide-react"

const raw = [
  { id: "CSL-01", carrier: "TCI Express", mode: "Road", region: "North India", shipments: 2450, onTime: 2280, damaged: 12, lost: 1, avgCost: 850, slaScore: 96.2, otif: 93.1, damageRate: 0.49, responseTime: "4.2h", claims: 8, openClaims: 2, status: "Excellent", contract: "Active", since: "2022-01", volume: "High", trend: "up" },
  { id: "CSL-02", carrier: "Delhivery", mode: "Road", region: "Pan India", shipments: 5820, onTime: 5122, damaged: 58, lost: 3, avgCost: 420, slaScore: 87.5, otif: 88.0, damageRate: 1.00, responseTime: "6.1h", claims: 35, openClaims: 12, status: "Good", contract: "Active", since: "2021-06", volume: "Very High", trend: "up" },
  { id: "CSL-03", carrier: "BlueDart Aviation", mode: "Air", region: "Metro", shipments: 1280, onTime: 1216, damaged: 5, lost: 0, avgCost: 2200, slaScore: 98.1, otif: 95.0, damageRate: 0.39, responseTime: "2.8h", claims: 3, openClaims: 1, status: "Excellent", contract: "Active", since: "2020-03", volume: "Medium", trend: "up" },
  { id: "CSL-04", carrier: "Rivigo", mode: "Road", region: "North India", shipments: 1850, onTime: 1573, damaged: 28, lost: 2, avgCost: 680, slaScore: 82.3, otif: 85.0, damageRate: 1.51, responseTime: "5.5h", claims: 18, openClaims: 7, status: "Good", contract: "Active", since: "2023-02", volume: "Medium", trend: "down" },
  { id: "CSL-05", carrier: "Safexpress", mode: "Road", region: "West India", shipments: 960, onTime: 883, damaged: 8, lost: 0, avgCost: 1100, slaScore: 93.8, otif: 92.0, damageRate: 0.83, responseTime: "3.9h", claims: 5, openClaims: 2, status: "Excellent", contract: "Active", since: "2021-11", volume: "Medium", trend: "up" },
  { id: "CSL-06", carrier: "Container Corp", mode: "Rail", region: "Pan India", shipments: 340, onTime: 272, damaged: 15, lost: 1, avgCost: 3200, slaScore: 74.6, otif: 80.0, damageRate: 4.41, responseTime: "12.0h", claims: 12, openClaims: 5, status: "At Risk", contract: "Under Review", since: "2022-08", volume: "Low", trend: "down" },
  { id: "CSL-07", carrier: "Ekart Logistics", mode: "Road", region: "South India", shipments: 3200, onTime: 2848, damaged: 42, lost: 4, avgCost: 380, slaScore: 84.0, otif: 89.0, damageRate: 1.31, responseTime: "5.8h", claims: 22, openClaims: 8, status: "Good", contract: "Active", since: "2022-04", volume: "High", trend: "up" },
  { id: "CSL-08", carrier: "DTDC", mode: "Road", region: "East India", shipments: 1450, onTime: 1160, damaged: 35, lost: 3, avgCost: 520, slaScore: 76.2, otif: 80.0, damageRate: 2.41, responseTime: "7.2h", claims: 20, openClaims: 9, status: "At Risk", contract: "Active", since: "2023-01", volume: "Medium", trend: "down" },
  { id: "CSL-09", carrier: "Xpressbee", mode: "Road", region: "West India", shipments: 2100, onTime: 1953, damaged: 18, lost: 1, avgCost: 460, slaScore: 91.5, otif: 93.0, damageRate: 0.86, responseTime: "4.5h", claims: 10, openClaims: 3, status: "Excellent", contract: "Active", since: "2022-06", volume: "High", trend: "up" },
  { id: "CSL-10", carrier: "Maersk India", mode: "Sea", region: "West Coast", shipments: 180, onTime: 144, damaged: 10, lost: 0, avgCost: 8500, slaScore: 72.0, otif: 80.0, damageRate: 5.56, responseTime: "18.0h", claims: 8, openClaims: 4, status: "Critical", contract: "Expiring", since: "2021-09", volume: "Low", trend: "down" },
]

interface CSLItem {
  id: string; carrier: string; mode: string; region: string; shipments: number
  onTime: number; damaged: number; lost: number; avgCost: number
  slaScore: number; otif: number; damageRate: number; responseTime: string
  claims: number; openClaims: number; status: string; contract: string
  since: string; volume: string; trend: string
}

const items: CSLItem[] = raw.map((r: any) => ({
  id: r.id, carrier: r.carrier, mode: r.mode, region: r.region,
  shipments: r.shipments, onTime: r.onTime, damaged: r.damaged,
  lost: r.lost, avgCost: r.avgCost, slaScore: r.slaScore, otif: r.otif,
  damageRate: r.damageRate, responseTime: r.responseTime, claims: r.claims,
  openClaims: r.openClaims, status: r.status, contract: r.contract,
  since: r.since, volume: r.volume, trend: r.trend,
}))

const statusColors: Record<string, string> = {
  "Excellent": "text-emerald-600 font-semibold", "Good": "text-blue-600",
  "At Risk": "text-amber-600 font-semibold", "Critical": "text-red-600 font-semibold",
}
const contractColors: Record<string, string> = {
  "Active": "bg-emerald-100 text-emerald-700", "Under Review": "bg-amber-100 text-amber-700",
  "Expiring": "bg-red-100 text-red-700",
}
const modeIcons: Record<string, React.ElementType> = { Road: Truck, Air: MapPin, Rail: ArrowRightLeft, Sea: ArrowRightLeft }
const regions = [...new Set(items.map(i => i.region))]
const totalShipments = items.reduce((s, i) => s + i.shipments, 0)
const avgSLA = (items.reduce((s, i) => s + i.slaScore, 0) / items.length).toFixed(1)
const totalClaims = items.reduce((s, i) => s + i.openClaims, 0)
const excellentCount = items.filter(i => i.status === "Excellent").length

type Rec = any
type FV = Record<string, string>
type VT = "carriers" | "regions" | "claims"

function fmtINR(n: number) { if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`; if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`; return `\u20b9${(n / 1000).toFixed(1)}K` }

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`csl-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function CarrierSLAScorecardPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("carriers")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const criticalCount = items.filter(i => i.status === "Critical" || i.status === "At Risk").length

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: Award, title: "Avg SLA", desc: `${avgSLA}/100 across ${items.length} carriers`, accent: "text-emerald-500" },
    { icon: Star, title: "Excellent", desc: `${excellentCount} carriers rated Excellent`, accent: "text-amber-500" },
    { icon: AlertTriangle, title: "Open Claims", desc: `${totalClaims} unresolved claims`, accent: "text-red-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.carrier}: Critical SLA ${i.slaScore} \u2014 ${i.damageRate}% damage, ${i.openClaims} claims`, severity: "critical" as const })),
    ...items.filter(i => i.status === "At Risk").map(i => ({ id: i.id, msg: `${i.carrier}: At Risk \u2014 OTIF ${i.otif}%, response ${i.responseTime}`, severity: "warning" as const })),
    ...items.filter(i => i.contract === "Expiring").map(i => ({ id: i.id, msg: `${i.carrier}: Contract expiring \u2014 review needed`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"><Award className="h-4 w-4 text-blue-600" /></div>
            <div><h3 className="text-sm font-bold">Carrier SLA Scorecard</h3><p className="text-xs opacity-60">{items.length} carriers | {totalShipments.toLocaleString()} shipments</p></div>
          </div>
          <div className="flex gap-1">
            {(["carriers", "regions", "claims"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "carriers" ? "Carriers" : v === "regions" ? "Regions" : "Claims"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Shipments", totalShipments.toLocaleString(), Package, "bg-blue-50/50")}
          {statCard("Avg SLA", `${avgSLA}`, Target, "bg-emerald-50/50")}
          {statCard("At Risk", String(criticalCount), AlertTriangle, "bg-red-50/50")}
          {statCard("Excellent", String(excellentCount), Star, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {regions.map(r => {
            const active = activeFilters.region === r
            return <span key={r} onClick={() => toggle("region", active ? undefined : r)} className={`csl-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{r}</span>
          })}
          {activeFilters.region && <span onClick={() => toggle("region", undefined)} className="csl-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="csl-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="csl-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />SLA Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`csl-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "carriers" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isAtRisk = item.status === "At Risk"
              const MIcon = modeIcons[item.mode] || Truck
              const TrendIcon = item.trend === "up" ? TrendingUp : TrendingDown
              return (
                <div key={item.id} className={`csl-carrier-card rounded-lg border p-2.5 bg-card ${isCritical ? "csl-critical-pulse" : isAtRisk ? "csl-atrisk-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="csl-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{item.id}</span>
                      <MIcon className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs font-semibold">{item.carrier}</span>
                      <span className={`csl-volume-tag text-[10px] px-1.5 py-0.5 rounded ${item.volume === "Very High" ? "bg-violet-100 text-violet-700" : item.volume === "High" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{item.volume}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendIcon className={`h-3 w-3 ${item.trend === "up" ? "text-emerald-500" : "text-red-500"}`} />
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground mb-0.5">SLA Score: {item.slaScore}/100</div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`csl-sla-bar h-full rounded-full ${item.slaScore >= 90 ? "bg-emerald-500" : item.slaScore >= 80 ? "bg-blue-500" : item.slaScore >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.slaScore}%` }} />
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${item.slaScore >= 90 ? "text-emerald-600" : item.slaScore >= 80 ? "text-blue-600" : item.slaScore >= 70 ? "text-amber-600" : "text-red-600"}`}>{item.slaScore}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-[10px] text-muted-foreground">
                    <div>OTIF: <span className="font-medium text-foreground">{item.otif}%</span></div>
                    <div>Damage: <span className={`font-medium ${item.damageRate > 2 ? "text-red-600" : "text-foreground"}`}>{item.damageRate}%</span></div>
                    <div>Cost: <span className="font-medium text-foreground">{fmtINR(item.avgCost)}</span></div>
                    <div>Claims: <span className="font-medium">{item.openClaims}/{item.claims}</span></div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.responseTime}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "regions" && (
          <div className="space-y-2">
            {regions.map(region => {
              const rItems = items.filter(i => i.region === region)
              const rShipments = rItems.reduce((s, i) => s + i.shipments, 0)
              const rSLA = (rItems.reduce((s, i) => s + i.slaScore, 0) / rItems.length).toFixed(1)
              const rClaims = rItems.reduce((s, i) => s + i.openClaims, 0)
              return (
                <div key={region} className="csl-region-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" /><span className="text-xs font-semibold">{region}</span></div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-blue-600">{rShipments.toLocaleString()} shipments</span>
                      <span className={`font-bold ${Number(rSLA) >= 90 ? "text-emerald-600" : Number(rSLA) >= 80 ? "text-blue-600" : "text-red-600"}`}>{rSLA}/100</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    {rItems.map(ci => (
                      <div key={ci.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{ci.id}</span>{ci.carrier} <span className="opacity-40">{ci.mode}</span></span>
                        <span className={statusColors[ci.status] || ""}>{ci.status}</span>
                      </div>
                    ))}
                  </div>
                  {rClaims > 0 && <div className="text-[10px] text-red-500 mt-1">{rClaims} open claims</div>}
                </div>
              )
            })}
          </div>
        )}

        {view === "claims" && (
          <div className="space-y-2">
            <div className="csl-claims-header rounded-lg border p-2 bg-red-50/50">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{totalClaims}</div><div className="text-[10px] opacity-50">Open Claims</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.reduce((s, i) => s + i.claims, 0)}</div><div className="text-[10px] opacity-50">Total Claims</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.reduce((s, i) => s + i.claims - i.openClaims, 0)}</div><div className="text-[10px] opacity-50">Resolved</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.openClaims - a.openClaims).filter(i => i.openClaims > 0).map(item => (
              <div key={item.id} className="csl-claims-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.carrier}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-red-600">{item.openClaims} open</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Total: <span className="font-medium">{item.claims}</span></div>
                  <div>Resolved: <span className="font-medium text-emerald-600">{item.claims - item.openClaims}</span></div>
                  <div>Damage: <span className="font-medium">{item.damaged} pkgs</span></div>
                  <div>Lost: <span className="font-medium text-red-600">{item.lost} pkgs</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
