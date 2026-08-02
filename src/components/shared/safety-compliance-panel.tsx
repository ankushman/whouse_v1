"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Shield, AlertTriangle, CheckCircle, Zap
} from "lucide-react"

const raw = [
  { id: "SFC-01", incident: "Fire Drill Q3", type: "Fire Safety", zone: "A1-A3 All", severity: "Low", status: "Completed", date: "25 Jul 2026", inspector: "Ravi Sharma", compliance: "OSHA 1910", hub: "MUM-HUB1", region: "West", action: "Drill completed, 98% evacuation in 4.2min", nextAudit: "25 Oct 2026", riskScore: 15, findings: 0, corrective: 0 },
  { id: "SFC-02", incident: "Forklift Near Miss", type: "Material Handling", zone: "B2-Picking", severity: "High", status: "Open", date: "01 Aug 2026", inspector: "Anita R", compliance: "ISO 45001", hub: "DEL-HUB2", region: "North", action: "Operator retraining scheduled, barriers installed", nextAudit: "15 Aug 2026", riskScore: 78, findings: 2, corrective: 1 },
  { id: "SFC-03", incident: "Cold Room Temp Excursion", type: "Cold Chain", zone: "F1-Cold Storage", severity: "Critical", status: "Escalated", date: "30 Jul 2026", inspector: "Kavitha N", compliance: "HACCP", hub: "MAA-HUB4", region: "South", action: "Compressor replaced, 3hr excursion, vaccine batch quarantined", nextAudit: "02 Aug 2026", riskScore: 92, findings: 3, corrective: 2 },
  { id: "SFC-04", incident: "PPE Non-Compliance", type: "Workplace Safety", zone: "D1-QA", severity: "Medium", status: "Resolved", date: "28 Jul 2026", inspector: "Manoj K", compliance: "OSHA 1910", hub: "CCU-HUB7", region: "East", action: "3 workers counseled, PPE dispensers added at entry", nextAudit: "28 Oct 2026", riskScore: 42, findings: 1, corrective: 1 },
  { id: "SFC-05", incident: "Rack Collapse Risk", type: "Structural", zone: "A2-Storage", severity: "High", status: "In Progress", date: "02 Aug 2026", inspector: "Deepak T", compliance: "FEM 10.2.02", hub: "BLR-HUB3", region: "South", action: "Selective rack inspection underway, section cordoned", nextAudit: "09 Aug 2026", riskScore: 85, findings: 4, corrective: 3 },
  { id: "SFC-06", incident: "Chemical Spill Minor", type: "Hazmat", zone: "E2-Hazmat", severity: "Medium", status: "Resolved", date: "27 Jul 2026", inspector: "Vikram J", compliance: "OSHA 1910.120", hub: "HYD-HUB5", region: "South", action: "Acetone spill 2L contained, SDS reviewed, signage updated", nextAudit: "27 Oct 2026", riskScore: 48, findings: 1, corrective: 1 },
  { id: "SFC-07", incident: "Emergency Exit Blocked", type: "Fire Safety", zone: "C2-Pack", severity: "High", status: "Resolved", date: "29 Jul 2026", inspector: "Sunita B", compliance: "NBC 2016", hub: "PNQ-HUB6", region: "West", action: "Exit cleared, pallets relocated, daily check protocol added", nextAudit: "29 Oct 2026", riskScore: 72, findings: 2, corrective: 2 },
  { id: "SFC-08", incident: "Ergonomic Assessment Due", type: "Ergonomics", zone: "B1-Picking", severity: "Low", status: "Scheduled", date: "05 Aug 2026", inspector: "Lakshmi P", compliance: "NIOSH Guidelines", hub: "DEL-HUB2", region: "North", action: "Annual ergonomic assessment for picking stations", nextAudit: "05 Aug 2026", riskScore: 25, findings: 0, corrective: 0 },
  { id: "SFC-09", incident: "Load Securing Failure", type: "Transport Safety", zone: "E1-Dispatch", severity: "High", status: "Open", date: "03 Aug 2026", inspector: "Rajesh Kumar", compliance: "AIS 018", hub: "JAI-HUB9", region: "North", action: "Shifting load on NH8 detected, strap tension protocol revised", nextAudit: "10 Aug 2026", riskScore: 80, findings: 2, corrective: 1 },
  { id: "SFC-10", incident: "First Aid Kit Expired", type: "Workplace Safety", zone: "All Zones", severity: "Low", status: "Completed", date: "26 Jul 2026", inspector: "Priya Sharma", compliance: "OSHA 1910.151", hub: "MUM-HUB1", region: "West", action: "All 12 first aid kits restocked, expiry tracking system added", nextAudit: "26 Jan 2027", riskScore: 18, findings: 1, corrective: 1 },
]

interface SFCItem {
  id: string; incident: string; type: string; zone: string; severity: string; status: string
  date: string; inspector: string; compliance: string; hub: string; region: string
  action: string; nextAudit: string; riskScore: number; findings: number; corrective: number
}

type Rec = any
const items: SFCItem[] = raw.map((r: Rec) => ({
  id: r.id, incident: r.incident, type: r.type, zone: r.zone, severity: r.severity, status: r.status,
  date: r.date, inspector: r.inspector, compliance: r.compliance, hub: r.hub, region: r.region,
  action: r.action, nextAudit: r.nextAudit, riskScore: r.riskScore, findings: r.findings, corrective: r.corrective,
}))

const typeColors: Record<string, string> = {
  "Fire Safety": "bg-red-100 text-red-700", "Material Handling": "bg-orange-100 text-orange-700",
  "Cold Chain": "bg-cyan-100 text-cyan-700", "Workplace Safety": "bg-amber-100 text-amber-700",
  "Structural": "bg-violet-100 text-violet-700", "Hazmat": "bg-rose-100 text-rose-700",
  "Ergonomics": "bg-blue-100 text-blue-700", "Transport Safety": "bg-indigo-100 text-indigo-700",
}

const sevColors: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700", "High": "bg-orange-100 text-orange-700",
  "Medium": "bg-amber-100 text-amber-700", "Low": "bg-emerald-100 text-emerald-700",
}

const statusColors: Record<string, string> = {
  "Completed": "text-emerald-600 font-semibold", "Open": "text-orange-600 font-semibold",
  "Escalated": "text-red-600 font-semibold", "Resolved": "text-blue-600 font-semibold",
  "In Progress": "text-amber-600 font-semibold", "Scheduled": "text-gray-500 font-semibold",
}

const riskColor = (v: number) => v >= 80 ? "text-red-600" : v >= 50 ? "text-amber-600" : "text-emerald-600"
const riskBarColor = (v: number) => v >= 80 ? "#dc2626" : v >= 50 ? "#f59e0b" : "#22c55e"

const SafetyCompliancePanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"incidents" | "risk" | "audits">("incidents")
  const filters = [
    { key: "type", label: "Type", options: ["Fire Safety", "Material Handling", "Cold Chain", "Workplace Safety", "Structural", "Hazmat", "Ergonomics", "Transport Safety"] },
    { key: "severity", label: "Severity", options: ["Critical", "High", "Medium", "Low"] },
    { key: "status", label: "Status", options: ["Completed", "Open", "Escalated", "Resolved", "In Progress", "Scheduled"] },
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

  const totalInc = filtered.length
  const openInc = filtered.filter(r => r.status === "Open" || r.status === "Escalated" || r.status === "In Progress").length
  const avgRisk = totalInc ? Math.round(filtered.reduce((s, r) => s + r.riskScore, 0) / totalInc) : 0
  const totalFindings = filtered.reduce((s, r) => s + r.findings, 0)

  const insights = [
    { label: "Total Incidents", value: totalInc, icon: Shield, bg: "bg-blue-50" },
    { label: "Open Cases", value: openInc, icon: AlertTriangle, bg: "bg-red-50" },
    { label: "Avg Risk Score", value: avgRisk, icon: Zap, bg: "bg-amber-50" },
    { label: "Findings", value: totalFindings, icon: CheckCircle, bg: "bg-violet-50" },
  ]

  const isCritical = (r: SFCItem) => r.severity === "Critical" || r.status === "Escalated"
  const isWarning = (r: SFCItem) => r.severity === "High" && r.status !== "Resolved" && r.status !== "Completed"

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
                className={`sfc-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["incidents", "risk", "audits"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "incidents" && (
        <div className="sfc-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`sfc-item-card p-3 rounded-lg border ${isCritical(r) ? "sfc-critical" : isWarning(r) ? "sfc-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.incident}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${sevColors[r.severity]}`}>{r.severity}</span>
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Zone: <span className="font-medium">{r.zone}</span></div>
                <div>Inspector: <span className="font-medium">{r.inspector}</span></div>
                <div>Compliance: <span className="sfc-compliance-badge">{r.compliance}</span></div>
                <div>Date: <span className="font-medium">{r.date}</span></div>
                <div>Risk Score: <span className={`font-medium ${riskColor(r.riskScore)}`}>{r.riskScore}/100</span></div>
                <div>Findings: <span className="font-medium">{r.findings} ({r.corrective} corrective)</span></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">Action: {r.action}</div>
              <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                <span>{r.hub}, {r.region}</span>
                <span>Next Audit: {r.nextAudit}</span>
              </div>
              {isCritical(r) && <div className="sfc-alert-text text-xs mt-2">Escalated — immediate management attention required</div>}
            </div>
          ))}
        </div>
      )}

      {view === "risk" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.riskScore - a.riskScore).map(r => (
            <div key={r.id} className="sfc-risk-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.incident}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${sevColors[r.severity]}`}>{r.severity}</span>
                </div>
                <span className={`text-lg font-bold ${riskColor(r.riskScore)}`}>{r.riskScore}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="sfc-risk-bar h-2 rounded-full" style={{ width: `${r.riskScore}%`, backgroundColor: riskBarColor(r.riskScore) }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Type: <span className={`px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span></div>
                <div>Status: <span className={`font-medium ${statusColors[r.status]}`}>{r.status}</span></div>
                <div>Findings: <span className="font-medium">{r.findings}</span></div>
                <div>Hub: <span className="font-medium">{r.hub}</span></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">{r.action}</div>
            </div>
          ))}
        </div>
      )}

      {view === "audits" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => new Date(a.nextAudit).getTime() - new Date(b.nextAudit).getTime()).map(r => (
            <div key={r.id} className="sfc-audit-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.incident}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="sfc-compliance-badge">{r.compliance}</span>
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Next Audit: <span className="font-medium">{r.nextAudit}</span></div>
                <div>Inspector: <span className="font-medium">{r.inspector}</span></div>
                <div>Zone: <span className="font-medium">{r.zone}</span></div>
                <div>Risk: <span className={`font-medium ${riskColor(r.riskScore)}`}>{r.riskScore}/100</span></div>
                <div>Hub: <span className="font-medium">{r.hub}</span></div>
                <div>Severity: <span className={`px-1.5 py-0.5 rounded-full ${sevColors[r.severity]}`}>{r.severity}</span></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">{r.action}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { SafetyCompliancePanel }
