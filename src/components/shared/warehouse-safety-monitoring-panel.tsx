"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  HardHat, ShieldCheck, Flame, AlertTriangle,
  CheckCircle, XCircle, Thermometer, Gauge, Zap, Target,
  Eye, Heart, Activity
} from "lucide-react"

const raw = [
  { id: "WSM-01", area: "Pick Zone A", warehouse: "Mumbai DC1", type: "Near Miss", severity: "Low", ppeCompliance: 98, hazardLevel: 1, incidents: 0, lastAudit: "2026-07-30", auditScore: 92, fireExtinguishers: 8, exits: 4, emergencyDrills: 6, inspector: "SafetyCorp India", status: "Compliant", city: "Mumbai", workers: 45, floor: "Ground", temperature: 32, humidity: 65 },
  { id: "WSM-02", area: "Loading Dock B", warehouse: "Delhi DC2", type: "PPE Violation", severity: "Medium", ppeCompliance: 82, hazardLevel: 3, incidents: 3, lastAudit: "2026-07-28", auditScore: 74, fireExtinguishers: 5, exits: 3, emergencyDrills: 3, inspector: "SafeWork Delhi", status: "Non-Compliant", city: "Delhi", workers: 38, floor: "Ground", temperature: 38, humidity: 55 },
  { id: "WSM-03", area: "Cold Storage C", warehouse: "Bengaluru DC3", type: "Slip/Fall", severity: "Medium", ppeCompliance: 91, hazardLevel: 2, incidents: 1, lastAudit: "2026-07-31", auditScore: 85, fireExtinguishers: 4, exits: 2, emergencyDrills: 4, inspector: "Karnataka OSH", status: "Under Review", city: "Bengaluru", workers: 22, floor: "Basement", temperature: -18, humidity: 40 },
  { id: "WSM-04", area: "Conveyor Belt D", warehouse: "Chennai DC4", type: "Equipment Malfunction", severity: "High", ppeCompliance: 88, hazardLevel: 4, incidents: 5, lastAudit: "2026-07-22", auditScore: 62, fireExtinguishers: 6, exits: 3, emergencyDrills: 2, inspector: "TN Factory Inspector", status: "Critical", city: "Chennai", workers: 30, floor: "Ground", temperature: 34, humidity: 78 },
  { id: "WSM-05", area: "Packaging Line E", warehouse: "Pune DC6", type: "Ergonomic Risk", severity: "Low", ppeCompliance: 95, hazardLevel: 1, incidents: 0, lastAudit: "2026-07-29", auditScore: 90, fireExtinguishers: 5, exits: 3, emergencyDrills: 5, inspector: "Maharashtra ISI", status: "Compliant", city: "Pune", workers: 28, floor: "Ground", temperature: 30, humidity: 60 },
  { id: "WSM-06", area: "Rack Zone F", warehouse: "Hyderabad DC5", type: "Rack Collapse Risk", severity: "High", ppeCompliance: 78, hazardLevel: 4, incidents: 2, lastAudit: "2026-07-20", auditScore: 58, fireExtinguishers: 7, exits: 4, emergencyDrills: 1, inspector: "Telangana FIS", status: "Critical", city: "Hyderabad", workers: 42, floor: "Ground+Mezz", temperature: 35, humidity: 62 },
  { id: "WSM-07", area: "Chemical Store G", warehouse: "Kolkata DC7", type: "Chemical Spill", severity: "High", ppeCompliance: 85, hazardLevel: 5, incidents: 4, lastAudit: "2026-07-18", auditScore: 55, fireExtinguishers: 10, exits: 5, emergencyDrills: 2, inspector: "WB Pollution Board", status: "Critical", city: "Kolkata", workers: 15, floor: "Ground", temperature: 33, humidity: 82 },
  { id: "WSM-08", area: "Dispatch Bay H", warehouse: "Ahmedabad DC8", type: "Vehicle Incident", severity: "Medium", ppeCompliance: 90, hazardLevel: 3, incidents: 2, lastAudit: "2026-07-27", auditScore: 78, fireExtinguishers: 6, exits: 4, emergencyDrills: 4, inspector: "Gujarat OSH", status: "Under Review", city: "Ahmedabad", workers: 35, floor: "Ground", temperature: 36, humidity: 45 },
  { id: "WSM-09", area: "Returns Processing I", warehouse: "Jaipur DC9", type: "Fire Risk", severity: "Critical", ppeCompliance: 72, hazardLevel: 5, incidents: 7, lastAudit: "2026-07-15", auditScore: 42, fireExtinguishers: 3, exits: 2, emergencyDrills: 1, inspector: "Rajasthan FIS", status: "Shutdown", city: "Jaipur", workers: 18, floor: "Ground", temperature: 37, humidity: 30 },
  { id: "WSM-10", area: "Value Add Zone J", warehouse: "Lucknow DC10", type: "Near Miss", severity: "Low", ppeCompliance: 96, hazardLevel: 1, incidents: 0, lastAudit: "2026-08-01", auditScore: 94, fireExtinguishers: 5, exits: 3, emergencyDrills: 6, inspector: "UP Factory Board", status: "Compliant", city: "Lucknow", workers: 20, floor: "Ground", temperature: 34, humidity: 58 },
]

interface WSMItem {
  id: string; area: string; warehouse: string; type: string; severity: string
  ppeCompliance: number; hazardLevel: number; incidents: number; lastAudit: string
  auditScore: number; fireExtinguishers: number; exits: number; emergencyDrills: number
  inspector: string; status: string; city: string; workers: number; floor: string
  temperature: number; humidity: number
}

const items: WSMItem[] = raw.map((r: any) => ({
  id: r.id, area: r.area, warehouse: r.warehouse, type: r.type, severity: r.severity,
  ppeCompliance: r.ppeCompliance, hazardLevel: r.hazardLevel, incidents: r.incidents,
  lastAudit: r.lastAudit, auditScore: r.auditScore, fireExtinguishers: r.fireExtinguishers,
  exits: r.exits, emergencyDrills: r.emergencyDrills, inspector: r.inspector,
  status: r.status, city: r.city, workers: r.workers, floor: r.floor,
  temperature: r.temperature, humidity: r.humidity,
}))

const statusColors: Record<string, string> = {
  "Compliant": "text-emerald-600 font-semibold", "Under Review": "text-amber-600 font-semibold",
  "Non-Compliant": "text-orange-600 font-semibold", "Critical": "text-red-600 font-semibold",
  "Shutdown": "text-red-600 font-semibold",
}
const sevColors: Record<string, string> = {
  "Low": "bg-emerald-100 text-emerald-700", "Medium": "bg-amber-100 text-amber-700",
  "High": "bg-red-100 text-red-700", "Critical": "bg-red-200 text-red-800",
}
const typeColors: Record<string, string> = {
  "Near Miss": "bg-blue-100 text-blue-700", "PPE Violation": "bg-amber-100 text-amber-700",
  "Slip/Fall": "bg-orange-100 text-orange-700", "Equipment Malfunction": "bg-red-100 text-red-700",
  "Ergonomic Risk": "bg-purple-100 text-purple-700", "Rack Collapse Risk": "bg-rose-100 text-rose-700",
  "Chemical Spill": "bg-lime-100 text-lime-700", "Vehicle Incident": "bg-slate-100 text-slate-700",
  "Fire Risk": "bg-red-200 text-red-800",
}
const severities = [...new Set(items.map(i => i.severity))]
const totalIncidents = items.reduce((s, i) => s + i.incidents, 0)
const avgAuditScore = Math.round(items.reduce((s, i) => s + i.auditScore, 0) / items.length)
const criticalAreas = items.filter(i => i.status === "Critical" || i.status === "Shutdown").length

type Rec = any
type FV = Record<string, string>
type VT = "areas" | "compliance" | "hazards"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`wsm-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function WarehouseSafetyMonitoringPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("areas")

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
    ...items.filter(i => i.status === "Shutdown").map(i => ({ id: i.id, msg: `${i.area}: SHUTDOWN \u2014 ${i.incidents} incidents, audit ${i.auditScore}/100, ${i.inspector}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.area}: Critical \u2014 hazard level ${i.hazardLevel}/5, ${i.type}, audit ${i.auditScore}/100`, severity: "critical" as const })),
    ...items.filter(i => i.ppeCompliance < 80).map(i => ({ id: i.id, msg: `${i.area}: PPE compliance at ${i.ppeCompliance}% \u2014 below 80% threshold`, severity: "warning" as const })),
    ...items.filter(i => i.emergencyDrills < 2).map(i => ({ id: i.id, msg: `${i.area}: Only ${i.emergencyDrills} emergency drills conducted \u2014 ${i.warehouse}`, severity: "warning" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: ShieldCheck, title: "Avg Audit", desc: `${avgAuditScore}/100 across ${items.length} areas`, accent: "text-emerald-500" },
    { icon: HardHat, title: "PPE Avg", desc: `${Math.round(items.reduce((s, i) => s + i.ppeCompliance, 0) / items.length)}% avg PPE compliance`, accent: "text-amber-500" },
    { icon: Flame, title: "Incidents", desc: `${totalIncidents} total, ${criticalAreas} critical/shutdown areas`, accent: "text-red-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center"><HardHat className="h-4 w-4 text-orange-600" /></div>
            <div><h3 className="text-sm font-bold">Warehouse Safety Monitor</h3><p className="text-xs opacity-60">{items.length} areas | Indian Factory Act</p></div>
          </div>
          <div className="flex gap-1">
            {(["areas", "compliance", "hazards"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "areas" ? "Areas" : v === "compliance" ? "Compliance" : "Hazards"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Areas", items.length.toString(), Eye, "bg-orange-50/50")}
          {statCard("Incidents", totalIncidents.toString(), Flame, "bg-red-50/50")}
          {statCard("Critical", `${criticalAreas}/${items.length}`, AlertTriangle, "bg-amber-50/50")}
          {statCard("Audit Avg", `${avgAuditScore}/100`, ShieldCheck, "bg-emerald-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {severities.map(s => {
            const active = activeFilters.severity === s
            return <span key={s} onClick={() => toggle("severity", active ? undefined : s)} className={`wsm-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="wsm-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="wsm-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="wsm-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Safety Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`wsm-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "areas" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical" || item.status === "Shutdown"
              const isWarning = item.status === "Non-Compliant" || item.status === "Under Review"
              return (
                <div key={item.id} className={`wsm-area-card rounded-lg border p-2.5 bg-card ${isCritical ? "wsm-critical-pulse" : isWarning ? "wsm-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="wsm-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">{item.id}</span>
                      <span className={`wsm-type-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                      <span className={`wsm-sev-tag text-[10px] px-1.5 py-0.5 rounded ${sevColors[item.severity] || "bg-slate-100"}`}>{item.severity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Compliant" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Eye className="h-3 w-3 opacity-40" />{item.area} | {item.floor}</div>
                    <div className="flex items-center gap-1"><Gauge className="h-3 w-3 opacity-40" />{item.warehouse} | {item.city}</div>
                    <div className="flex items-center gap-1"><Heart className="h-3 w-3 opacity-40" />Audit: {item.lastAudit} | {item.inspector}</div>
                    <div className="flex items-center gap-1"><Thermometer className="h-3 w-3 opacity-40" />{item.temperature}\u00b0C | {item.humidity}% RH</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>PPE: <span className={`font-bold ${item.ppeCompliance >= 90 ? "text-emerald-600" : item.ppeCompliance >= 80 ? "text-amber-600" : "text-red-600"}`}>{item.ppeCompliance}%</span></div>
                    <div>Audit: <span className={`font-bold ${item.auditScore >= 80 ? "text-emerald-600" : item.auditScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{item.auditScore}/100</span></div>
                    <div>Incidents: <span className={`font-medium ${item.incidents > 0 ? "text-red-600" : "text-foreground"}`}>{item.incidents}</span></div>
                    <div>Workers: <span className="font-medium">{item.workers}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "compliance" && (
          <div className="space-y-2">
            <div className="wsm-comp-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.status === "Compliant").length}</div><div className="text-[10px] opacity-50">Compliant</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.status === "Under Review").length + items.filter(i => i.status === "Non-Compliant").length}</div><div className="text-[10px] opacity-50">Under Review</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.status === "Critical" || i.status === "Shutdown").length}</div><div className="text-[10px] opacity-50">Critical</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.reduce((s, i) => s + i.emergencyDrills, 0)}</div><div className="text-[10px] opacity-50">Total Drills</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.auditScore - b.auditScore).map(item => (
              <div key={item.id} className={`wsm-comp-row rounded-lg border p-2 bg-card ${item.auditScore < 60 ? "wsm-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.area}</span>
                    <span className={`wsm-type-tag text-[10px] px-1.5 py-0.5 rounded ${typeColors[item.type] || "bg-slate-100"}`}>{item.type}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.auditScore >= 80 ? "text-emerald-600" : item.auditScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{item.auditScore}/100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.auditScore >= 80 ? "bg-emerald-500" : item.auditScore >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.auditScore}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>PPE: <span className={`font-medium ${item.ppeCompliance >= 90 ? "text-emerald-600" : item.ppeCompliance < 80 ? "text-red-600" : "text-foreground"}`}>{item.ppeCompliance}%</span></div>
                  <div>Drills: <span className={`font-medium ${item.emergencyDrills < 2 ? "text-red-600" : "text-foreground"}`}>{item.emergencyDrills}</span></div>
                  <div>Extinguishers: <span className="font-medium">{item.fireExtinguishers}</span></div>
                  <div>Exits: <span className="font-medium">{item.exits}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "hazards" && (
          <div className="space-y-2">
            <div className="wsm-haz-header rounded-lg border p-2 bg-red-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.hazardLevel >= 4).length}</div><div className="text-[10px] opacity-50">High Hazard</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.hazardLevel === 2 || i.hazardLevel === 3).length}</div><div className="text-[10px] opacity-50">Moderate</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.hazardLevel === 1).length}</div><div className="text-[10px] opacity-50">Low Hazard</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{totalIncidents}</div><div className="text-[10px] opacity-50">Total Incidents</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.hazardLevel - a.hazardLevel).map(item => (
              <div key={item.id} className={`wsm-haz-row rounded-lg border p-2 bg-card ${item.hazardLevel >= 4 ? "wsm-critical-pulse" : item.hazardLevel === 3 ? "wsm-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.area}</span>
                    <span className={`wsm-sev-tag text-[10px] px-1.5 py-0.5 rounded ${sevColors[item.severity] || "bg-slate-100"}`}>{item.severity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Hazard</span>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < item.hazardLevel ? "bg-red-500" : "bg-muted"}`} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Type: <span className="font-medium">{item.type}</span></div>
                  <div>Incidents: <span className={`font-medium ${item.incidents > 3 ? "text-red-600" : item.incidents > 0 ? "text-amber-600" : "text-foreground"}`}>{item.incidents}</span></div>
                  <div>Workers: <span className="font-medium">{item.workers} exposed</span></div>
                  <div>Inspector: <span className="font-medium">{item.inspector}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
