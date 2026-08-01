"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  ClipboardCheck, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, AlertTriangle, CheckCircle2, Clock, Package,
  Eye, XCircle, FileText, Shield, Star, AlertOctagon, CheckSquare,
  BadgeCheck, ListChecks, TrendingDown, CircleDot
} from "lucide-react"

type Rec = any

interface InspectionRecord {
  id: string; batchId: string; dc: string; product: string; category: string
  inspectionType: string; totalSamples: number; passedSamples: number
  failedSamples: number; defectRate: number; status: string
  inspector: string; inspectionDate: string; severity: string; expanded: boolean
}

const dcCfg: Record<string, Rec> = {
  dc1: { label: "DC Mumbai (Bhiwandi)", color: "#ef4444" },
  dc2: { label: "DC Delhi (Noida)", color: "#3b82f6" },
  dc3: { label: "DC Bengaluru (Whitefield)", color: "#8b5cf6" },
  dc4: { label: "DC Chennai (Sriperumbudur)", color: "#10b981" },
  dc5: { label: "DC Kolkata (Uluberia)", color: "#f59e0b" },
  dc6: { label: "DC Hyderabad (Patancheru)", color: "#06b6d4" }
}

const statusCfg: Record<string, Rec> = {
  passed: { label: "Passed", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: CheckCircle2 },
  conditional: { label: "Conditional", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: AlertTriangle },
  failed: { label: "Failed", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: XCircle },
  inprogress: { label: "In Progress", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: Activity },
  pending: { label: "Pending", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: Clock }
}

const typeCfg: Record<string, Rec> = {
  inbound: { label: "Inbound QC", color: "bg-blue-500" },
  outbound: { label: "Outbound QC", color: "bg-emerald-500" },
  periodic: { label: "Periodic Audit", color: "bg-violet-500" },
  customer: { label: "Customer Return QC", color: "bg-orange-500" }
}

const sevCfg: Record<string, Rec> = {
  critical: { label: "Critical", color: "bg-red-500" },
  major: { label: "Major", color: "bg-amber-500" },
  minor: { label: "Minor", color: "bg-blue-500" },
  none: { label: "No Defect", color: "bg-emerald-500" }
}

const rawInspections: Rec[] = [
  { id: "QIP-01", bi: "BCH-2024-401", dc: "dc1", pr: "Samsung Galaxy S24", ct: "Electronics", it: "inbound", ts: 50, ps: 48, fs: 2, dr: 4.0, st: "conditional", ins: "Ramesh K", id2: "02 Aug 2026", sv: "minor", ex: false },
  { id: "QIP-02", bi: "BCH-2024-402", dc: "dc2", pr: "Levis 501 Jeans", ct: "Apparel", it: "inbound", ts: 100, ps: 100, fs: 0, dr: 0.0, st: "passed", ins: "Priya S", id2: "02 Aug 2026", sv: "none", ex: false },
  { id: "QIP-03", bi: "BCH-2024-403", dc: "dc3", pr: "IKEA Bookshelf Unit", ct: "Furniture", it: "outbound", ts: 20, ps: 16, fs: 4, dr: 20.0, st: "failed", ins: "Mohan D", id2: "01 Aug 2026", sv: "major", ex: false },
  { id: "QIP-04", bi: "BCH-2024-404", dc: "dc4", pr: "Parle-G Biscuit 800g", ct: "FMCG", it: "periodic", ts: 200, ps: 198, fs: 2, dr: 1.0, st: "passed", ins: "Anita R", id2: "01 Aug 2026", sv: "minor", ex: false },
  { id: "QIP-05", bi: "BCH-2024-405", dc: "dc5", pr: "Bajaj Mixer Grinder", ct: "Appliances", it: "inbound", ts: 30, ps: 25, fs: 5, dr: 16.7, st: "failed", ins: "Suresh P", id2: "31 Jul 2026", sv: "critical", ex: false },
  { id: "QIP-06", bi: "BCH-2024-406", dc: "dc6", pr: "Nike Air Max Shoes", ct: "Footwear", it: "outbound", ts: 40, ps: 39, fs: 1, dr: 2.5, st: "conditional", ins: "Kavitha M", id2: "01 Aug 2026", sv: "minor", ex: false },
  { id: "QIP-07", bi: "BCH-2024-407", dc: "dc1", pr: "Dabur Chyawanprash 1kg", ct: "FMCG", it: "inbound", ts: 150, ps: 150, fs: 0, dr: 0.0, st: "passed", ins: "Vikram T", id2: "02 Aug 2026", sv: "none", ex: false },
  { id: "QIP-08", bi: "BCH-2024-408", dc: "dc2", pr: "HP Laptop 15s", ct: "Electronics", it: "customer", ts: 10, ps: 7, fs: 3, dr: 30.0, st: "failed", ins: "Sneha G", id2: "31 Jul 2026", sv: "critical", ex: false },
  { id: "QIP-09", bi: "BCH-2024-409", dc: "dc3", pr: "Titan wrist watch", ct: "Accessories", it: "outbound", ts: 60, ps: 58, fs: 2, dr: 3.3, st: "conditional", ins: "Rajesh N", id2: "02 Aug 2026", sv: "minor", ex: false },
  { id: "QIP-10", bi: "BCH-2024-410", dc: "dc4", pr: "Godrej Hair Oil 500ml", ct: "FMCG", it: "periodic", ts: 120, ps: 118, fs: 2, dr: 1.7, st: "inprogress", ins: "Deepa V", id2: "02 Aug 2026", sv: "minor", ex: false }
]

const inspections: InspectionRecord[] = rawInspections.map((r: Rec) => ({
  id: r.id, batchId: r.bi, dc: r.dc, product: r.pr, category: r.ct,
  inspectionType: r.it, totalSamples: r.ts, passedSamples: r.ps,
  failedSamples: r.fs, defectRate: r.dr, status: r.st,
  inspector: r.ins, inspectionDate: r.id2, severity: r.sv, expanded: r.ex
}))

const viewTabs = [
  { key: "inspections", label: "QC Batches", icon: ListChecks },
  { key: "categories", label: "Category Analysis", icon: BarChart3 },
  { key: "inspectors", label: "Inspector Performance", icon: Star }
]

export function QualityInspectionPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("inspections")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<InspectionRecord[]>(inspections)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: InspectionRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: InspectionRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.product.toLowerCase().includes(search.toLowerCase()) && !r.batchId.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.inspectionType && r.inspectionType !== activeFilters.inspectionType) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const passed = data.filter(r => r.status === "passed").length
    const failed = data.filter(r => r.status === "failed").length
    const totalSamples = data.reduce((s: number, r: InspectionRecord) => s + r.totalSamples, 0)
    const totalDefects = data.reduce((s: number, r: InspectionRecord) => s + r.failedSamples, 0)
    const overallDR = ((totalDefects / Math.max(totalSamples, 1)) * 100).toFixed(1)
    return { total, passed, failed, totalSamples, totalDefects, overallDR }
  }, [data])

  return (
    <div className="qip-root">
      <div className="qip-header">
        <div className="qip-header-left">
          <div className="qip-icon-wrap"><ClipboardCheck className="h-5 w-5 text-lime-600" /></div>
          <div>
            <h3 className="qip-title">Quality Inspection</h3>
            <p className="qip-subtitle">Inbound/outbound QC, batch sampling, defect tracking &amp; inspector performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="qip-live-count">{stats.overallDR}% Defect Rate</span>
        </div>
      </div>
      <div className="qip-stats-grid">
        {[
          { label: "Total Batches", value: String(stats.total), icon: ListChecks, color: "text-lime-600", bg: "bg-lime-50 dark:bg-lime-950/40" },
          { label: "Passed", value: String(stats.passed), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Failed", value: String(stats.failed), icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
          { label: "Samples", value: String(stats.totalSamples), icon: Package, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Defects", value: String(stats.totalDefects), icon: TrendingDown, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Defect Rate", value: stats.overallDR + "%", icon: AlertOctagon, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" }
        ].map(s => (
          <div key={s.label} className="qip-stat-card">
            <div className={cn("qip-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="qip-stat-info"><span className="qip-stat-value">{s.value}</span><span className="qip-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="qip-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search batch, product, inspector..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("qip-filter-chip", activeFilters.status === k && "qip-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="qip-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="qip-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(typeCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("inspectionType", k)} className={cn("qip-type-chip", activeFilters.inspectionType === k && "qip-type-active")}>
              <span className="qip-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="qip-chip-count">{data.filter(r => r.inspectionType === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="qip-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("qip-view-tab", view === t.key && "qip-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "inspections" && (
        <div className="qip-grid">
          {filtered.map(q => {
            const sc = statusCfg[q.status] as Rec
            const dc = dcCfg[q.dc] as Rec
            const tc = typeCfg[q.inspectionType] as Rec
            const sv = sevCfg[q.severity] as Rec
            const SIcon = (sc.icon as React.ElementType) || CheckCircle2
            const isFailed = q.status === "failed"
            const passRate = Math.round((q.passedSamples / Math.max(q.totalSamples, 1)) * 100)
            const passColor = passRate >= 95 ? "#10b981" : passRate >= 80 ? "#f59e0b" : "#ef4444"
            return (
              <div key={q.id} className={cn("qip-card", `border-l-4 ${sc.borderColor || ""}`, isFailed && "qip-card-failed")}>
                <div className="qip-card-top">
                  <div className="flex items-center gap-2">
                    <span className="qip-card-id">{q.id}</span>
                    <span className="qip-batch-badge"><FileText className="h-3 w-3" />{q.batchId}</span>
                    <span className={cn("qip-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                  </div>
                  <span className="qip-sev-badge" style={{ backgroundColor: sv.color + "18", color: sv.color }}>{sv.label}</span>
                </div>
                <div className="qip-product-row">
                  <span className="qip-product">{q.product}</span>
                  <span className="qip-category">{q.category}</span>
                </div>
                <div className="qip-dc-row">
                  <span className="qip-dc" style={{ color: dc.color }}>{dc.label}</span>
                  <span className="qip-type-badge" style={{ backgroundColor: tc.color + "18", color: tc.color }}>{tc.label}</span>
                </div>
                <div className="qip-sample-bar-row">
                  <span className="qip-sample-label">Pass Rate:</span>
                  <div className="qip-sample-bar-track"><div className="qip-sample-bar-fill" style={{ width: passRate + "%", backgroundColor: passColor }} /></div>
                  <span className="qip-sample-pct" style={{ color: passColor }}>{passRate}%</span>
                </div>
                <div className="qip-metrics-row">
                  <span className="qip-metric"><Package className="h-3 w-3" />{q.passedSamples}/{q.totalSamples} passed</span>
                  <span className="qip-metric"><TrendingDown className="h-3 w-3" />{q.failedSamples} defects</span>
                  <span className="qip-metric"><Star className="h-3 w-3" />{q.defectRate}% defect</span>
                  <span className="qip-metric"><Eye className="h-3 w-3" />{q.inspector}</span>
                </div>
                <div className="qip-time-row">
                  <span className="qip-time-metric"><Clock className="h-3 w-3" />{q.inspectionDate}</span>
                  {isFailed && <span className="qip-fail-tag"><AlertOctagon className="h-3 w-3" />Batch Quarantined</span>}
                </div>
                <button onClick={() => toggleExpand(q.id)} className="qip-expand-btn">
                  {q.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{q.expanded ? "Hide" : "Details"}</span>
                </button>
                {q.expanded && (
                  <div className="qip-expanded"><div className="qip-detail-grid">
                    {[
                      { l: "ID", v: q.id }, { l: "Batch", v: q.batchId }, { l: "Product", v: q.product },
                      { l: "DC", v: dc.label }, { l: "Category", v: q.category }, { l: "Type", v: tc.label },
                      { l: "Inspector", v: q.inspector }, { l: "Severity", v: sv.label }
                    ].map(dd => (
                      <div key={dd.l} className="qip-detail-item"><span className="qip-detail-label">{dd.l}</span><span className="qip-detail-value">{dd.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="qip-empty">No inspections match your filters</div>}
        </div>
      )}

      {view === "categories" && (
        <div className="qip-anal-view">
          <div className="qip-anal-col">
            <h4 className="qip-anal-title">Defect Rate by Category</h4>
            {Array.from(new Set(data.map(r => r.category))).sort().map(cat => {
              const cd = data.filter(r => r.category === cat)
              const totalS = cd.reduce((s: number, r: InspectionRecord) => s + r.totalSamples, 0)
              const totalF = cd.reduce((s: number, r: InspectionRecord) => s + r.failedSamples, 0)
              const dr = ((totalF / Math.max(totalS, 1)) * 100).toFixed(1)
              const drNum = parseFloat(dr)
              const drColor = drNum < 3 ? "#10b981" : drNum < 10 ? "#f59e0b" : "#ef4444"
              return (
                <div key={cat} className="qip-band-card">
                  <div className="flex items-center gap-2 mb-2"><CircleDot className="h-4 w-4 text-lime-500" /><span className="qip-band-name">{cat}</span><span className="qip-band-sub">{cd.length} batch(es)</span></div>
                  <div className="qip-band-stats">
                    <div className="qip-band-stat"><span className="qip-band-val" style={{ color: drColor }}>{dr}%</span><span className="qip-band-lbl">Defect Rate</span></div>
                    <div className="qip-band-stat"><span className="qip-band-val text-blue-600">{totalS}</span><span className="qip-band-lbl">Samples</span></div>
                  </div>
                  <div className="qip-sample-bar-track mt-2"><div className="qip-sample-bar-fill" style={{ width: Math.min(drNum * 3, 100) + "%", backgroundColor: drColor }} /></div>
                </div>
              )
            })}
          </div>
          <div className="qip-anal-col">
            <h4 className="qip-anal-title">Failed Batches</h4>
            {data.filter(r => r.status === "failed").sort((a: InspectionRecord, b: InspectionRecord) => b.defectRate - a.defectRate).map(q => {
              const dc = dcCfg[q.dc] as Rec
              const sv = sevCfg[q.severity] as Rec
              return (
                <div key={q.id} className="qip-alert-row">
                  <XCircle className="h-3 w-3 text-red-500" />
                  <span className="qip-alert-name">{q.id} {q.product}</span>
                  <span className="qip-alert-stat">{q.defectRate}%</span>
                  <span className="qip-alert-rooms">{sv.label} | {dc.label}</span>
                </div>
              )
            })}
            {data.filter(r => r.status === "failed").length === 0 && <div className="qip-empty">No failed batches</div>}
          </div>
        </div>
      )}

      {view === "inspectors" && (
        <div className="qip-anal-view">
          <div className="qip-anal-col">
            <h4 className="qip-anal-title">Inspector Performance</h4>
            {Array.from(new Set(data.map(r => r.inspector))).sort().map(ins => {
              const id2 = data.filter(r => r.inspector === ins)
              const totalBatches = id2.length
              const passed = id2.filter(r => r.status === "passed").length
              const passRate = Math.round((passed / Math.max(totalBatches, 1)) * 100)
              const totalSamples = id2.reduce((s: number, r: InspectionRecord) => s + r.totalSamples, 0)
              const passColor = passRate >= 50 ? "#10b981" : "#f59e0b"
              return (
                <div key={ins} className="qip-band-card">
                  <div className="flex items-center gap-2 mb-2"><Star className="h-4 w-4 text-lime-500" /><span className="qip-band-name">{ins}</span><span className="qip-band-sub">{totalBatches} batches</span></div>
                  <div className="qip-band-stats">
                    <div className="qip-band-stat"><span className="qip-band-val" style={{ color: passColor }}>{passRate}%</span><span className="qip-band-lbl">Pass Rate</span></div>
                    <div className="qip-band-stat"><span className="qip-band-val text-blue-600">{totalSamples}</span><span className="qip-band-lbl">Samples</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="qip-anal-col">
            <h4 className="qip-anal-title">Inspection Type Distribution</h4>
            {Object.entries(typeCfg).map(([k, v]: [string, Rec]) => {
              const td = data.filter(r => r.inspectionType === k)
              const totalS = td.reduce((s: number, r: InspectionRecord) => s + r.totalSamples, 0)
              const totalF = td.reduce((s: number, r: InspectionRecord) => s + r.failedSamples, 0)
              return (
                <div key={k} className="qip-band-card">
                  <div className="flex items-center gap-2 mb-2"><Shield className="h-4 w-4" style={{ color: v.color }} /><span className="qip-band-name">{v.label}</span><span className="qip-band-sub">{td.length} batches</span></div>
                  <div className="qip-band-stats">
                    <div className="qip-band-stat"><span className="qip-band-val text-blue-600">{totalS}</span><span className="qip-band-lbl">Total Samples</span></div>
                    <div className="qip-band-stat"><span className="qip-band-val text-red-600">{totalF}</span><span className="qip-band-lbl">Defects Found</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
