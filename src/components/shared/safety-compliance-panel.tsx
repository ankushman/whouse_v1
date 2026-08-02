"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield, ShieldCheck, ClipboardCheck, AlertTriangle,
  Users, FileCheck, Award, Clock, Target
} from "lucide-react"

const raw = [
  { id: "SCM-01", dc: "Mumbai DC-1", category: "Fire Safety", item: "Smoke Detector Zone A", standard: "NBC 2016", status: "Compliant", lastAudit: "2026-07-15", nextDue: "2026-10-15", score: 98, auditor: "Safety First India", risk: "Low", findings: 0, corrective: 0, severity: "info" },
  { id: "SCM-02", dc: "Delhi DC-2", category: "PPE Compliance", item: "Hard Hat Usage Receiving", standard: "Factories Act 1948", status: "Non-Compliant", lastAudit: "2026-07-20", nextDue: "2026-08-20", score: 42, auditor: "Bureau Veritas India", risk: "High", findings: 3, corrective: 2, severity: "critical" },
  { id: "SCM-03", dc: "Bengaluru DC-3", category: "Electrical Safety", item: "Panel Inspection Zone B", standard: "IS 3043", status: "Compliant", lastAudit: "2026-06-28", nextDue: "2026-12-28", score: 95, auditor: "TUV India", risk: "Low", findings: 0, corrective: 0, severity: "info" },
  { id: "SCM-04", dc: "Kolkata DC-5", category: "Emergency Exit", item: "Exit Route Zone D Blocked", standard: "NFPA 101", status: "Non-Compliant", lastAudit: "2026-07-25", nextDue: "2026-08-25", score: 35, auditor: "Safety First India", risk: "Critical", findings: 5, corrective: 3, severity: "critical" },
  { id: "SCM-05", dc: "Chennai DC-6", category: "Machinery Safety", item: "Conveyor Guard Inspection", standard: "IS 5208", status: "Pending Review", lastAudit: "2026-07-10", nextDue: "2026-08-10", score: 78, auditor: "SGS India", risk: "Medium", findings: 2, corrective: 1, severity: "warning" },
  { id: "SCM-06", dc: "Hyderabad DC-4", category: "Chemical Storage", item: "Hazmat Segregation Cold Chain", standard: "MSDS Compliance", status: "Compliant", lastAudit: "2026-07-18", nextDue: "2027-01-18", score: 92, auditor: "Intertek India", risk: "Low", findings: 1, corrective: 1, severity: "info" },
  { id: "SCM-07", dc: "Mumbai DC-1", category: "Ergonomics", item: "Manual Lifting Limit Check", standard: "Factories Act 1948", status: "Pending Review", lastAudit: "2026-07-22", nextDue: "2026-08-22", score: 70, auditor: "Bureau Veritas India", risk: "Medium", findings: 1, corrective: 0, severity: "warning" },
  { id: "SCM-08", dc: "Delhi DC-2", category: "Fire Safety", item: "Sprinkler System Test", standard: "NBC 2016", status: "Compliant", lastAudit: "2026-07-05", nextDue: "2026-10-05", score: 100, auditor: "Safety First India", risk: "Low", findings: 0, corrective: 0, severity: "info" },
  { id: "SCM-09", dc: "Bengaluru DC-3", category: "Noise Exposure", item: "Packing Station dB Monitoring", standard: "OSHA/IS 7333", status: "Non-Compliant", lastAudit: "2026-07-28", nextDue: "2026-08-28", score: 55, auditor: "TUV India", risk: "High", findings: 2, corrective: 1, severity: "warning" },
  { id: "SCM-10", dc: "Kolkata DC-5", category: "Training", item: "Forklift Operator Cert", standard: "Factories Act 1948", status: "Overdue", lastAudit: "2026-03-15", nextDue: "2026-07-15", score: 20, auditor: "SGS India", risk: "Critical", findings: 4, corrective: 0, severity: "critical" },
]

interface SCMItem {
  id: string; dc: string; category: string; item: string; standard: string
  status: string; lastAudit: string; nextDue: string; score: number
  auditor: string; risk: string; findings: number; corrective: number
  severity: string
}

const items: SCMItem[] = raw.map((r: any) => ({
  id: r.id, dc: r.dc, category: r.category, item: r.item,
  standard: r.standard, status: r.status, lastAudit: r.lastAudit,
  nextDue: r.nextDue, score: r.score, auditor: r.auditor,
  risk: r.risk, findings: r.findings, corrective: r.corrective,
  severity: r.severity,
}))

const statusColors: Record<string, string> = {
  "Compliant": "text-emerald-600 font-semibold", "Non-Compliant": "text-red-600 font-semibold",
  "Pending Review": "text-amber-600 font-semibold", "Overdue": "text-red-600 font-semibold",
}
const riskColors: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700", "High": "bg-orange-100 text-orange-700",
  "Medium": "bg-amber-100 text-amber-700", "Low": "bg-emerald-100 text-emerald-700",
}
const categories = [...new Set(items.map(i => i.category))]
const dcNames = [...new Set(items.map(i => i.dc))]
const compliant = items.filter(i => i.status === "Compliant").length
const nonCompliant = items.filter(i => i.status === "Non-Compliant" || i.status === "Overdue").length
const pending = items.filter(i => i.status === "Pending Review").length
const avgScore = Math.round(items.reduce((s, i) => s + i.score, 0) / items.length)
const totalFindings = items.reduce((s, i) => s + i.findings, 0)
const totalCorrective = items.reduce((s, i) => s + i.corrective, 0)

type Rec = any
type FV = Record<string, string>
type VT = "audits" | "categories" | "compliance"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`scm-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function SafetyCompliancePanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("audits")

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

  const insights = [
    { icon: ShieldCheck, title: "Score", desc: `${avgScore}/100 avg compliance score`, accent: "text-emerald-500" },
    { icon: AlertTriangle, title: "Findings", desc: `${totalFindings} total, ${totalCorrective} in progress`, accent: "text-red-500" },
    { icon: Award, title: "Compliant", desc: `${compliant}/${items.length} items pass audit`, accent: "text-blue-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Overdue").map(i => ({ id: i.id, msg: `${i.dc}: ${i.item} \u2014 OVERDUE since ${i.nextDue}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Non-Compliant").map(i => ({ id: i.id, msg: `${i.dc}: ${i.item} \u2014 ${i.findings} findings (${i.risk} risk)`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Pending Review").map(i => ({ id: i.id, msg: `${i.dc}: ${i.item} \u2014 review due by ${i.nextDue}`, severity: "warning" as const })),
  ].slice(0, 6)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center"><Shield className="h-4 w-4 text-red-600" /></div>
            <div><h3 className="text-sm font-bold">Safety Compliance</h3><p className="text-xs opacity-60">{items.length} checks | {categories.length} categories</p></div>
          </div>
          <div className="flex gap-1">
            {(["audits", "categories", "compliance"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "audits" ? "Audits" : v === "categories" ? "Categories" : "Score"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Compliant", String(compliant), ShieldCheck, "bg-emerald-50/50")}
          {statCard("Non-Compliant", String(nonCompliant), AlertTriangle, "bg-red-50/50")}
          {statCard("Pending", String(pending), Clock, "bg-amber-50/50")}
          {statCard("Avg Score", `${avgScore}/100`, Target, "bg-blue-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map(c => {
            const active = activeFilters.category === c
            return <span key={c} onClick={() => toggle("category", active ? undefined : c)} className={`scm-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {dcNames.map(d => {
            const active = activeFilters.dc === d
            return <span key={d} onClick={() => toggle("dc", active ? undefined : d)} className={`scm-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{d.split(" ")[0]}</span>
          })}
          {(activeFilters.category || activeFilters.dc) && <span onClick={() => setActiveFilters({})} className="scm-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="scm-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="scm-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Safety Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`scm-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "audits" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isNonCompliant = item.status === "Non-Compliant"
              const isOverdue = item.status === "Overdue"
              const scoreColor = item.score >= 80 ? "text-emerald-600" : item.score >= 60 ? "text-amber-600" : "text-red-600"
              return (
                <div key={item.id} className={`scm-audit-card rounded-lg border p-2.5 bg-card ${isNonCompliant || isOverdue ? "scm-noncompliant-pulse" : item.status === "Pending Review" ? "scm-pending-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="scm-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-100 text-red-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.item}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`scm-risk-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${riskColors[item.risk] || "bg-slate-100"}`}>{item.risk}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Shield className="h-3 w-3 opacity-40" />{item.dc} \u2014 {item.category}</div>
                    <div className="flex items-center gap-1"><FileCheck className="h-3 w-3 opacity-40" />{item.standard}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />Last: {item.lastAudit} | Due: {item.nextDue}</div>
                    <div className="flex items-center gap-1"><Users className="h-3 w-3 opacity-40" />Auditor: {item.auditor.split(" ")[0]}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                    <div>Score: <span className={`font-bold ${scoreColor}`}>{item.score}/100</span></div>
                    <div>Findings: <span className={`font-medium ${item.findings > 0 ? "text-red-600" : "text-foreground"}`}>{item.findings}</span></div>
                    <div>Corrective: <span className="font-medium">{item.corrective}/{item.findings}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "categories" && (
          <div className="space-y-2">
            {categories.map(cat => {
              const catItems = items.filter(i => i.category === cat)
              const catCompliant = catItems.filter(i => i.status === "Compliant").length
              const catScore = Math.round(catItems.reduce((s, i) => s + i.score, 0) / catItems.length)
              const catFindings = catItems.reduce((s, i) => s + i.findings, 0)
              return (
                <div key={cat} className="scm-category-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-slate-500" />
                      <span className="text-xs font-semibold">{cat}</span>
                    </div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-emerald-600">{catCompliant}/{catItems.length} pass</span>
                      <span className={`font-bold ${catScore >= 80 ? "text-emerald-600" : catScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{catScore}/100</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    {catItems.map(ci => (
                      <div key={ci.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{ci.id}</span>{ci.dc.split(" ")[0]} \u2014 <span className="opacity-60">{ci.item.slice(0, 25)}</span></span>
                        <span className={statusColors[ci.status] || ""}>{ci.status}</span>
                      </div>
                    ))}
                  </div>
                  {catFindings > 0 && <div className="text-[10px] text-red-500 mt-1">{catFindings} open findings</div>}
                </div>
              )
            })}
          </div>
        )}

        {view === "compliance" && (
          <div className="space-y-2">
            <div className="scm-score-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{compliant}</div><div className="text-[10px] opacity-50">Compliant</div></div>
                <div><div className="text-lg font-bold text-red-600">{nonCompliant}</div><div className="text-[10px] opacity-50">Non-Compliant</div></div>
                <div><div className="text-lg font-bold text-amber-600">{totalFindings}</div><div className="text-[10px] opacity-50">Total Findings</div></div>
                <div><div className="text-lg font-bold text-blue-600">{avgScore}/100</div><div className="text-[10px] opacity-50">Avg Score</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.score - b.score).map(item => {
              const scoreColor = item.score >= 80 ? "text-emerald-600" : item.score >= 60 ? "text-amber-600" : "text-red-600"
              return (
                <div key={item.id} className="scm-score-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.dc.split(" ")[0]}</span>
                      <span className="text-[10px] opacity-50">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                        <div className={`scm-score-bar h-full rounded-full ${item.score >= 80 ? "bg-emerald-500" : item.score >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.score}%` }} />
                      </div>
                      <span className={`text-[10px] font-bold ${scoreColor}`}>{item.score}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                    <div>Risk: <span className={`scm-risk-inline font-medium px-1 py-0.5 rounded text-[9px] ${riskColors[item.risk] || ""}`}>{item.risk}</span></div>
                    <div>Findings: <span className="font-medium">{item.findings}</span></div>
                    <div>Standard: <span className="font-medium text-foreground">{item.standard}</span></div>
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
