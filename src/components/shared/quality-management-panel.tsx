"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShieldCheck, ClipboardCheck, AlertTriangle, CheckCircle, XCircle,
  TrendingUp, Activity, FileText, Star, Eye, Target
} from "lucide-react"

const raw = [
  { id: "QMS-01", batch: "BCH-2026-0842", product: "Basmati Rice Premium", category: "FMCG", supplier: "LT Foods", warehouse: "Mumbai DC1", inspection: "In-Process", standard: "FSSAI", aql: 1.0, defectRate: 0.2, inspected: 2500, defects: 5, rework: 2, rejected: 0, score: 98.5, auditDate: "01-Aug", nextAudit: "01-Sep", auditor: "R. Sharma", capa: 0, status: "Passed", city: "Mumbai", hold: false },
  { id: "QMS-02", batch: "BCH-2026-0843", product: "Cotton T-Shirts Lot-A", category: "Fashion", supplier: "Arvind Ltd", warehouse: "Bengaluru DC3", inspection: "Incoming", standard: "ISO 9001", aql: 2.5, defectRate: 3.8, inspected: 1800, defects: 68, rework: 45, rejected: 23, score: 82.1, auditDate: "28-Jul", nextAudit: "28-Aug", auditor: "P. Patel", capa: 2, status: "Conditional", city: "Bengaluru", hold: false },
  { id: "QMS-03", batch: "BCH-2026-0844", product: "Power Bank 20000mAh", category: "Electronics", supplier: "Nillkin Tech", warehouse: "Delhi DC2", inspection: "Final", standard: "BIS CRS", aql: 0.65, defectRate: 0.8, inspected: 3200, defects: 26, rework: 12, rejected: 14, score: 91.5, auditDate: "30-Jul", nextAudit: "30-Aug", auditor: "A. Kumar", capa: 1, status: "Passed", city: "Delhi", hold: false },
  { id: "QMS-04", batch: "BCH-2026-0845", product: "Organic Honey 500g", category: "FMCG", supplier: "Dabur India", warehouse: "Kolkata DC7", inspection: "In-Process", standard: "FSSAI", aql: 1.0, defectRate: 1.5, inspected: 1500, defects: 22, rework: 8, rejected: 14, score: 88.2, auditDate: "25-Jul", nextAudit: "25-Aug", auditor: "S. Gupta", capa: 1, status: "Conditional", city: "Kolkata", hold: false },
  { id: "QMS-05", batch: "BCH-2026-0846", product: "Steel Utensil Set", category: "Home", supplier: "Milton India", warehouse: "Chennai DC4", inspection: "Outgoing", standard: "BIS IS 3043", aql: 1.5, defectRate: 6.2, inspected: 900, defects: 56, rework: 28, rejected: 28, score: 72.8, auditDate: "22-Jul", nextAudit: "22-Aug", auditor: "V. Reddy", capa: 3, status: "Failed", city: "Chennai", hold: true },
  { id: "QMS-06", batch: "BCH-2026-0847", product: "Pharma Tablets Paracetamol", category: "Health", supplier: "Cipla Ltd", warehouse: "Hyderabad DC5", inspection: "Final", standard: "WHO GMP", aql: 0.4, defectRate: 0.1, inspected: 5000, defects: 5, rework: 0, rejected: 5, score: 99.2, auditDate: "02-Aug", nextAudit: "02-Sep", auditor: "D. Mehta", capa: 0, status: "Passed", city: "Hyderabad", hold: false },
  { id: "QMS-07", batch: "BCH-2026-0848", product: "LED Panel Light 36W", category: "Electronics", supplier: "Havells India", warehouse: "Pune DC6", inspection: "Incoming", standard: "BIS IS 10322", aql: 1.5, defectRate: 4.5, inspected: 2200, defects: 99, rework: 55, rejected: 44, score: 78.4, auditDate: "29-Jul", nextAudit: "29-Aug", auditor: "N. Singh", capa: 2, status: "Conditional", city: "Pune", hold: false },
  { id: "QMS-08", batch: "BCH-2026-0849", product: "Sports Shoes Running", category: "Fashion", supplier: "Wildcraft", warehouse: "Ahmedabad DC8", inspection: "In-Process", standard: "ISO 9001", aql: 2.5, defectRate: 1.8, inspected: 1600, defects: 29, rework: 15, rejected: 14, score: 90.2, auditDate: "31-Jul", nextAudit: "31-Aug", auditor: "K. Joshi", capa: 1, status: "Passed", city: "Ahmedabad", hold: false },
  { id: "QMS-09", batch: "BCH-2026-0850", product: "Packaged Drinking Water", category: "FMCG", supplier: "Bisleri Intl", warehouse: "Jaipur DC9", inspection: "Outgoing", standard: "FSSAI+BIS", aql: 0.65, defectRate: 0.4, inspected: 8000, defects: 32, rework: 12, rejected: 20, score: 95.8, auditDate: "03-Aug", nextAudit: "03-Sep", auditor: "M. Yadav", capa: 0, status: "Passed", city: "Jaipur", hold: false },
  { id: "QMS-10", batch: "BCH-2026-0851", product: "Industrial Bearing SKF-6205", category: "Industrial", supplier: "SKF India", warehouse: "Lucknow DC10", inspection: "Final", standard: "BIS IS 3824", aql: 0.4, defectRate: 8.5, inspected: 600, defects: 51, rework: 18, rejected: 33, score: 65.2, auditDate: "20-Jul", nextAudit: "20-Aug", auditor: "R. Verma", capa: 4, status: "Failed", city: "Lucknow", hold: true },
]

interface QMSItem {
  id: string; batch: string; product: string; category: string; supplier: string
  warehouse: string; inspection: string; standard: string; aql: number
  defectRate: number; inspected: number; defects: number; rework: number
  rejected: number; score: number; auditDate: string; nextAudit: string
  auditor: string; capa: number; status: string; city: string; hold: boolean
}

const items: QMSItem[] = raw.map((r: any) => ({
  id: r.id, batch: r.batch, product: r.product, category: r.category, supplier: r.supplier,
  warehouse: r.warehouse, inspection: r.inspection, standard: r.standard, aql: r.aql,
  defectRate: r.defectRate, inspected: r.inspected, defects: r.defects, rework: r.rework,
  rejected: r.rejected, score: r.score, auditDate: r.auditDate, nextAudit: r.nextAudit,
  auditor: r.auditor, capa: r.capa, status: r.status, city: r.city, hold: r.hold,
}))

const statusColors: Record<string, string> = {
  "Passed": "text-emerald-600 font-semibold", "Conditional": "text-amber-600 font-semibold",
  "Failed": "text-red-600 font-semibold",
}
const categoryColors: Record<string, string> = {
  "FMCG": "bg-green-100 text-green-700", "Fashion": "bg-purple-100 text-purple-700",
  "Electronics": "bg-blue-100 text-blue-700", "Home": "bg-orange-100 text-orange-700",
  "Health": "bg-rose-100 text-rose-700", "Industrial": "bg-slate-100 text-slate-700",
}
const standardColors: Record<string, string> = {
  "FSSAI": "bg-green-100 text-green-700", "ISO 9001": "bg-blue-100 text-blue-700",
  "BIS CRS": "bg-amber-100 text-amber-700", "BIS IS 3043": "bg-orange-100 text-orange-700",
  "WHO GMP": "bg-rose-100 text-rose-700", "BIS IS 10322": "bg-indigo-100 text-indigo-700",
  "FSSAI+BIS": "bg-teal-100 text-teal-700", "BIS IS 3824": "bg-violet-100 text-violet-700",
}
const categories = [...new Set(items.map(i => i.category))]
const avgScore = Math.round(items.reduce((s, i) => s + i.score, 0) / items.length * 10) / 10
const totalDefects = items.reduce((s, i) => s + i.defects, 0)
const totalInspected = items.reduce((s, i) => s + i.inspected, 0)
const totalRejected = items.reduce((s, i) => s + i.rejected, 0)

type Rec = any
type FV = Record<string, string>
type VT = "batches" | "quality" | "compliance"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`qms-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function QualityManagementPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("batches")

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
    ...items.filter(i => i.status === "Failed").map(i => ({ id: i.id, msg: `${i.product}: FAILED \u2014 score ${i.score}%, ${i.defects} defects, ${i.rejected} rejected, ${i.capa} CAPA open, BATCH ON HOLD`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Conditional").map(i => ({ id: i.id, msg: `${i.product}: Conditional pass \u2014 score ${i.score}%, defect rate ${i.defectRate}% vs AQL ${i.aql}%, ${i.capa} CAPA pending`, severity: "warning" as const })),
    ...items.filter(i => i.hold).map(i => ({ id: i.id, msg: `${i.product}: BATCH ON HOLD \u2014 ${i.rejected} units quarantined, awaiting QA release at ${i.warehouse}`, severity: "info" as const })),
  ].slice(0, 6)

  const insights = [
    { icon: ShieldCheck, title: "Quality Score", desc: `${avgScore}% avg across ${items.length} batches | ${items.filter(i => i.status === "Passed").length} passed`, accent: avgScore >= 90 ? "text-emerald-500" : "text-red-500" },
    { icon: Activity, title: "Defect Rate", desc: `${(totalDefects / totalInspected * 100).toFixed(2)}% overall | ${totalRejected} units rejected`, accent: totalDefects / totalInspected > 0.02 ? "text-red-500" : "text-amber-500" },
    { icon: Star, title: "CAPA Actions", desc: `${items.reduce((s, i) => s + i.capa, 0)} open across ${items.filter(i => i.capa > 0).length} batches`, accent: "text-blue-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center"><ClipboardCheck className="h-4 w-4 text-emerald-600" /></div>
            <div><h3 className="text-sm font-bold">Quality Management System</h3><p className="text-xs opacity-60">{items.length} batches | {categories.length} categories</p></div>
          </div>
          <div className="flex gap-1">
            {(["batches", "quality", "compliance"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "batches" ? "Batches" : v === "quality" ? "Quality" : "Compliance"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Batches", items.length.toString(), FileText, "bg-emerald-50/50")}
          {statCard("Avg Score", `${avgScore}%`, ShieldCheck, "bg-blue-50/50")}
          {statCard("Defects", totalDefects.toString(), AlertTriangle, "bg-red-50/50")}
          {statCard("Rejected", totalRejected.toString(), XCircle, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map(t => {
            const active = activeFilters.category === t
            return <span key={t} onClick={() => toggle("category", active ? undefined : t)} className={`qms-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="qms-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="qms-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="qms-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Quality Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`qms-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "batches" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isFailed = item.status === "Failed"
              const isWarning = item.status === "Conditional"
              return (
                <div key={item.id} className={`qms-batch-card rounded-lg border p-2.5 bg-card ${isFailed ? "qms-failed-pulse" : isWarning ? "qms-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="qms-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.product}</span>
                      <span className={`qms-cat-tag text-[10px] px-1.5 py-0.5 rounded ${categoryColors[item.category] || "bg-slate-100"}`}>{item.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.hold && <span className="qms-hold-badge text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold">HOLD</span>}
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isFailed ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Passed" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 opacity-40" />{item.standard} | {item.inspection}</div>
                    <div className="flex items-center gap-1"><Target className="h-3 w-3 opacity-40" />{item.supplier} | {item.warehouse}</div>
                    <div className="flex items-center gap-1"><Eye className="h-3 w-3 opacity-40" />Inspected: {item.inspected.toLocaleString()} | AQL: {item.aql}%</div>
                    <div className="flex items-center gap-1"><TrendingUp className="h-3 w-3 opacity-40" />Score: <span className={item.score >= 90 ? "text-emerald-600 font-semibold" : item.score >= 75 ? "text-amber-600" : "text-red-600 font-semibold"}>{item.score}%</span></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Defects: <span className={`font-bold ${item.defectRate > 5 ? "text-red-600" : "text-foreground"}`}>{item.defects}</span></div>
                    <div>Rework: <span className="font-medium">{item.rework}</span></div>
                    <div>Rejected: <span className={`font-medium ${item.rejected > 0 ? "text-red-600" : "text-foreground"}`}>{item.rejected}</span></div>
                    <div>Auditor: <span className="font-medium">{item.auditor}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "quality" && (
          <div className="space-y-2">
            <div className="qms-qual-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{avgScore}%</div><div className="text-[10px] opacity-50">Avg Quality Score</div></div>
                <div><div className="text-lg font-bold text-red-600">{(totalDefects / totalInspected * 100).toFixed(2)}%</div><div className="text-[10px] opacity-50">Overall Defect Rate</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.reduce((s, i) => s + i.rework, 0)}</div><div className="text-[10px] opacity-50">Total Rework Units</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.reduce((s, i) => s + i.capa, 0)}</div><div className="text-[10px] opacity-50">Open CAPA</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.score - b.score).map(item => (
              <div key={item.id} className={`qms-qual-row rounded-lg border p-2 bg-card ${item.status === "Failed" ? "qms-failed-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.product}</span>
                    <span className="text-[10px] text-muted-foreground">{item.category}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.score >= 90 ? "text-emerald-600" : item.score >= 75 ? "text-amber-600" : "text-red-600"}`}>{item.score}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.score >= 90 ? "bg-emerald-500" : item.score >= 75 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.score}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Defect Rate: <span className={`font-medium ${item.defectRate > item.aql * 2 ? "text-red-600" : "text-foreground"}`}>{item.defectRate}%</span></div>
                  <div>AQL: <span className="font-medium">{item.aql}%</span></div>
                  <div>Rework: <span className="font-medium">{item.rework}</span></div>
                  <div>CAPA: <span className={`font-medium ${item.capa > 0 ? "text-red-600" : "text-foreground"}`}>{item.capa}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "compliance" && (
          <div className="space-y-2">
            <div className="qms-comp-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{[...new Set(items.map(i => i.standard))].length}</div><div className="text-[10px] opacity-50">Standards</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.status === "Passed").length}/{items.length}</div><div className="text-[10px] opacity-50">Pass Rate</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.hold).length}</div><div className="text-[10px] opacity-50">On Hold</div></div>
                <div><div className="text-lg font-bold text-purple-600">{items.reduce((s, i) => s + i.capa, 0)}</div><div className="text-[10px] opacity-50">CAPA Total</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.capa - a.capa).map(item => (
              <div key={item.id} className="qms-comp-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.product}</span>
                    <span className={`qms-std-tag text-[10px] px-1.5 py-0.5 rounded ${standardColors[item.standard] || "bg-slate-100"}`}>{item.standard}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.capa > 0 ? "text-red-600" : "text-emerald-600"}`}>{item.capa} CAPA</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.capa > 2 ? "bg-red-500" : item.capa > 0 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(item.capa / 4 * 100, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Audit: <span className="font-medium">{item.auditDate}</span></div>
                  <div>Next: <span className="font-medium">{item.nextAudit}</span></div>
                  <div>Inspector: <span className="font-medium">{item.auditor}</span></div>
                  <div>Hold: <span className={`font-medium ${item.hold ? "text-red-600" : "text-foreground"}`}>{item.hold ? "YES" : "No"}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
