"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText, Clock,
  Building2, Shield, ShieldCheck, AlertTriangle,
  Target, CheckCircle, Lock, Scale, RefreshCw, IndianRupee
} from "lucide-react"

const raw = [
  { id: "PCM-01", vendor: "TCI Express", contractType: "Fulfillment", dc: "Mumbai DC-1", value: 48000000, startDate: "2025-04-01", endDate: "2027-03-31", msaStatus: "Active", slaScore: 94, penalty: 142000, kpiMet: 92, kpiTotal: 100, scope: "Warehousing+Transport", paymentTerms: "Net 45", renewal: "Auto-Renew", risk: "Low", utilization: 88, dispute: 0 },
  { id: "PCM-02", vendor: "Delhivery", contractType: "Last Mile", dc: "Pan India", value: 36000000, startDate: "2025-07-01", endDate: "2026-06-30", msaStatus: "Under Review", slaScore: 87, penalty: 486000, kpiMet: 84, kpiTotal: 100, scope: "Last Mile Delivery", paymentTerms: "Net 30", renewal: "Manual", risk: "Medium", utilization: 92, dispute: 2 },
  { id: "PCM-03", vendor: "DHL Supply Chain", contractType: "3PL", dc: "Delhi DC-2", value: 72000000, startDate: "2024-10-01", endDate: "2026-09-30", msaStatus: "Active", slaScore: 96, penalty: 288000, kpiMet: 95, kpiTotal: 100, scope: "End-to-End Logistics", paymentTerms: "Net 60", renewal: "Auto-Renew", risk: "Low", utilization: 78, dispute: 0 },
  { id: "PCM-04", vendor: "Snowman Logistics", contractType: "Cold Chain", dc: "Chennai DC-6", value: 24000000, startDate: "2025-01-15", endDate: "2026-01-14", msaStatus: "Expiring", slaScore: 82, penalty: 720000, kpiMet: 76, kpiTotal: 100, scope: "Cold Storage+Transport", paymentTerms: "Net 30", renewal: "Manual", risk: "High", utilization: 95, dispute: 1 },
  { id: "PCM-05", vendor: "Safexpress", contractType: "Distribution", dc: "Bengaluru DC-3", value: 18000000, startDate: "2025-06-01", endDate: "2027-05-31", msaStatus: "Active", slaScore: 91, penalty: 180000, kpiMet: 88, kpiTotal: 100, scope: "Regional Distribution", paymentTerms: "Net 45", renewal: "Auto-Renew", risk: "Low", utilization: 72, dispute: 0 },
  { id: "PCM-06", vendor: "BlueDart Aviation", contractType: "Express", dc: "Metro Hubs", value: 54000000, startDate: "2025-03-01", endDate: "2026-08-31", msaStatus: "Active", slaScore: 98, penalty: 54000, kpiMet: 97, kpiTotal: 100, scope: "Air Express", paymentTerms: "Net 15", renewal: "Negotiation", risk: "Low", utilization: 86, dispute: 0 },
  { id: "PCM-07", vendor: "Rivigo", contractType: "Line Haul", dc: "North India", value: 28000000, startDate: "2025-09-01", endDate: "2026-08-31", msaStatus: "Draft", slaScore: 0, penalty: 0, kpiMet: 0, kpiTotal: 100, scope: "Long Haul FTL", paymentTerms: "Net 30", renewal: "Manual", risk: "Medium", utilization: 0, dispute: 0 },
  { id: "PCM-08", vendor: "Ekart Logistics", contractType: "E-commerce", dc: "Kolkata DC-5", value: 12000000, startDate: "2025-11-01", endDate: "2026-10-31", msaStatus: "Active", slaScore: 74, penalty: 1200000, kpiMet: 68, kpiTotal: 100, scope: "E-commerce Fulfillment", paymentTerms: "Net 30", renewal: "Manual", risk: "High", utilization: 91, dispute: 3 },
  { id: "PCM-09", vendor: "Container Corp", contractType: "Rail Logistics", dc: "Nhava Sheva", value: 42000000, startDate: "2024-06-01", endDate: "2026-05-31", msaStatus: "Active", slaScore: 89, penalty: 840000, kpiMet: 85, kpiTotal: 100, scope: "Rail+Port Logistics", paymentTerms: "Net 60", renewal: "Renewal Pending", risk: "Medium", utilization: 82, dispute: 1 },
  { id: "PCM-10", vendor: "Shadowfax", contractType: "Quick Commerce", dc: "Hyderabad DC-4", value: 8000000, startDate: "2025-12-01", endDate: "2026-11-30", msaStatus: "Active", slaScore: 79, penalty: 400000, kpiMet: 72, kpiTotal: 100, scope: "Hyperlocal 10-min Delivery", paymentTerms: "Net 15", renewal: "Manual", risk: "Medium", utilization: 88, dispute: 1 },
]

interface PCMItem {
  id: string; vendor: string; contractType: string; dc: string; value: number
  startDate: string; endDate: string; msaStatus: string; slaScore: number
  penalty: number; kpiMet: number; kpiTotal: number; scope: string
  paymentTerms: string; renewal: string; risk: string; utilization: number; dispute: number
}

const items: PCMItem[] = raw.map((r: any) => ({
  id: r.id, vendor: r.vendor, contractType: r.contractType, dc: r.dc, value: r.value,
  startDate: r.startDate, endDate: r.endDate, msaStatus: r.msaStatus, slaScore: r.slaScore,
  penalty: r.penalty, kpiMet: r.kpiMet, kpiTotal: r.kpiTotal, scope: r.scope,
  paymentTerms: r.paymentTerms, renewal: r.renewal, risk: r.risk, utilization: r.utilization,
  dispute: r.dispute,
}))

const statusColors: Record<string, string> = {
  "Active": "text-emerald-600 font-semibold", "Under Review": "text-amber-600 font-semibold",
  "Expiring": "text-red-600 font-semibold", "Draft": "text-slate-500 font-semibold",
  "Renewal Pending": "text-purple-600 font-semibold",
}
const typeColors: Record<string, string> = {
  "Fulfillment": "bg-blue-100 text-blue-700", "Last Mile": "bg-emerald-100 text-emerald-700",
  "3PL": "bg-purple-100 text-purple-700", "Cold Chain": "bg-cyan-100 text-cyan-700",
  "Distribution": "bg-amber-100 text-amber-700", "Express": "bg-indigo-100 text-indigo-700",
  "Line Haul": "bg-orange-100 text-orange-700", "E-commerce": "bg-pink-100 text-pink-700",
  "Rail Logistics": "bg-teal-100 text-teal-700", "Quick Commerce": "bg-rose-100 text-rose-700",
}
const riskColors: Record<string, string> = { "Low": "text-emerald-600", "Medium": "text-amber-600", "High": "text-red-600 font-semibold" }
const types = [...new Set(items.map(i => i.contractType))]
const totalValue = items.reduce((s, i) => s + i.value, 0)
const totalPenalty = items.reduce((s, i) => s + i.penalty, 0)
const avgSLA = Math.round(items.filter(i => i.slaScore > 0).reduce((s, i) => s + i.slaScore, 0) / items.filter(i => i.slaScore > 0).length)
const activeContracts = items.filter(i => i.msaStatus === "Active").length

type Rec = any
type FV = Record<string, string>
type VT = "contracts" | "performance" | "compliance"

function fmtINR(n: number) { if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`; if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`; return `\u20b9${(n / 1000).toFixed(1)}K` }

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`pcm-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function ThreePLContractManagementPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("contracts")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const expiring = items.filter(i => i.msaStatus === "Expiring")
  const highRisk = items.filter(i => i.risk === "High")
  const disputes = items.filter(i => i.dispute > 0)

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: ShieldCheck, title: "SLA", desc: `${avgSLA}% avg SLA score`, accent: "text-emerald-500" },
    { icon: Scale, title: "Penalty", desc: `${fmtINR(totalPenalty)} total penalties`, accent: "text-red-500" },
    { icon: Target, title: "Active", desc: `${activeContracts}/${items.length} contracts active`, accent: "text-indigo-500" },
  ]

  const alerts = [
    ...expiring.map(i => ({ id: i.id, msg: `${i.vendor}: Expiring ${i.endDate} \u2014 ${i.contractType}`, severity: "critical" as const })),
    ...highRisk.map(i => ({ id: i.id, msg: `${i.vendor}: High risk \u2014 SLA ${i.slaScore}%, ${i.dispute} disputes`, severity: "warning" as const })),
    ...disputes.map(i => ({ id: i.id, msg: `${i.vendor}: ${i.dispute} open dispute${i.dispute > 1 ? "s" : ""} \u2014 ${fmtINR(i.penalty)} penalty`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center"><FileText className="h-4 w-4 text-slate-600" /></div>
            <div><h3 className="text-sm font-bold">3PL Contract Management</h3><p className="text-xs opacity-60">{items.length} contracts | {types.length} types</p></div>
          </div>
          <div className="flex gap-1">
            {(["contracts", "performance", "compliance"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "contracts" ? "Contracts" : v === "performance" ? "Performance" : "Compliance"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Total Value", fmtINR(totalValue), IndianRupee, "bg-blue-50/50")}
          {statCard("Active", `${activeContracts}/${items.length}`, CheckCircle, "bg-emerald-50/50")}
          {statCard("SLA Score", `${avgSLA}%`, Target, "bg-indigo-50/50")}
          {statCard("Penalties", fmtINR(totalPenalty), AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {types.map(t => {
            const active = activeFilters.contractType === t
            return <span key={t} onClick={() => toggle("contractType", active ? undefined : t)} className={`pcm-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="pcm-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="pcm-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="pcm-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Contract Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`pcm-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "contracts" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isExpiring = item.msaStatus === "Expiring"
              const isDraft = item.msaStatus === "Draft"
              const kpiPct = item.kpiTotal > 0 ? Math.round((item.kpiMet / item.kpiTotal) * 100) : 0
              return (
                <div key={item.id} className={`pcm-contract-card rounded-lg border p-2.5 bg-card ${isExpiring ? "pcm-critical-pulse" : isDraft ? "pcm-draft-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="pcm-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{item.id}</span>
                      <span className={`pcm-type-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${typeColors[item.contractType] || "bg-slate-100"}`}>{item.contractType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${riskColors[item.risk] || "text-muted-foreground"}`}>{item.risk}</span>
                      <span className={`text-[10px] ${statusColors[item.msaStatus] || "text-muted-foreground"}`}>{item.msaStatus}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Building2 className="h-3 w-3 opacity-40" />{item.vendor} | {item.dc}</div>
                    <div className="flex items-center gap-1"><FileText className="h-3 w-3 opacity-40" />{item.scope} | {item.paymentTerms}</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />{item.startDate} \u2192 {item.endDate}</div>
                    <div className="flex items-center gap-1"><RefreshCw className="h-3 w-3 opacity-40" />Renewal: {item.renewal}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Value: <span className="font-bold text-foreground">{fmtINR(item.value)}</span></div>
                    <div>SLA: <span className={`font-bold ${item.slaScore >= 90 ? "text-emerald-600" : item.slaScore >= 80 ? "text-amber-600" : "text-red-600"}`}>{item.slaScore > 0 ? `${item.slaScore}%` : "N/A"}</span></div>
                    <div>KPI: <span className={`font-bold ${kpiPct >= 85 ? "text-emerald-600" : kpiPct >= 70 ? "text-amber-600" : "text-red-600"}`}>{kpiPct}%</span></div>
                    <div>Util: <span className="font-medium">{item.utilization > 0 ? `${item.utilization}%` : "N/A"}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "performance" && (
          <div className="space-y-2">
            {items.filter(i => i.slaScore > 0).sort((a, b) => a.slaScore - b.slaScore).map(item => {
              const kpiPct = Math.round((item.kpiMet / item.kpiTotal) * 100)
              return (
                <div key={item.id} className="pcm-perf-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.vendor}</span>
                      <span className="text-[10px] opacity-50">{item.contractType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-bold ${item.slaScore >= 90 ? "text-emerald-600" : item.slaScore >= 80 ? "text-amber-600" : "text-red-600"}`}>{item.slaScore}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.slaScore >= 90 ? "bg-emerald-500" : item.slaScore >= 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.slaScore}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>KPI: <span className="font-medium">{kpiPct}% ({item.kpiMet}/{item.kpiTotal})</span></div>
                    <div>Penalty: <span className={`font-medium ${item.penalty > 500000 ? "text-red-600" : "text-foreground"}`}>{fmtINR(item.penalty)}</span></div>
                    <div>Utilization: <span className="font-medium">{item.utilization}%</span></div>
                    <div>Disputes: <span className={`font-medium ${item.dispute > 0 ? "text-red-600" : "text-emerald-600"}`}>{item.dispute}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "compliance" && (
          <div className="space-y-2">
            <div className="pcm-compliance-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{activeContracts}</div><div className="text-[10px] opacity-50">Active MSAs</div></div>
                <div><div className="text-lg font-bold text-red-600">{expiring.length}</div><div className="text-[10px] opacity-50">Expiring Soon</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.msaStatus === "Under Review").length}</div><div className="text-[10px] opacity-50">Under Review</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.filter(i => i.dispute > 0).length}</div><div className="text-[10px] opacity-50">Dispute Open</div></div>
              </div>
            </div>
            {items.sort((a, b) => {
              const so: Record<string, number> = { "Expiring": 0, "Under Review": 1, "Active": 2, "Renewal Pending": 3, "Draft": 4 }
              return (so[a.msaStatus] ?? 5) - (so[b.msaStatus] ?? 5)
            }).map(item => (
              <div key={item.id} className="pcm-compliance-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.vendor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] ${statusColors[item.msaStatus] || ""}`}>{item.msaStatus}</span>
                    {item.msaStatus === "Active" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : item.msaStatus === "Expiring" ? <AlertTriangle className="h-3 w-3 text-red-500" /> : <Lock className="h-3 w-3 text-slate-400" />}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Type: <span className="font-medium">{item.contractType}</span></div>
                  <div>Ends: <span className={`font-medium ${item.msaStatus === "Expiring" ? "text-red-600" : ""}`}>{item.endDate}</span></div>
                  <div>Renewal: <span className="font-medium">{item.renewal}</span></div>
                  <div>Terms: <span className="font-medium">{item.paymentTerms}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
