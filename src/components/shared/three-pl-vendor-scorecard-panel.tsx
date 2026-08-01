"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Handshake, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  Timer, AlertTriangle, Clock,
  TrendingUp, TrendingDown, Star, Award, Target, Truck,
  IndianRupee, Shield, ShieldAlert, FileText,
  CircleDot, Briefcase,
  Calendar
} from "lucide-react"

type Rec = any

interface VendorRecord {
  id: string; vendorName: string; vendorCode: string; dc: string
  serviceType: string; contractValue: string; onboardDate: string
  deliveryRate: number; slaCompliance: number; damageRate: number
  onTimePct: number; costPerOrder: number; satisfaction: number
  status: string; expanded: boolean
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
  platinum: { label: "Platinum", color: "bg-violet-500", textColor: "text-violet-700 dark:text-violet-400", bgColor: "bg-violet-50 dark:bg-violet-950/30", borderColor: "border-l-violet-500", icon: Award },
  gold: { label: "Gold", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: Star },
  silver: { label: "Silver", color: "bg-slate-400", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-400", icon: Shield },
  review: { label: "Under Review", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: FileText },
  probation: { label: "Probation", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: ShieldAlert }
}

const svcCfg: Record<string, Rec> = {
  lastmile: { label: "Last Mile", color: "bg-blue-500" },
  linehaul: { label: "Line Haul", color: "bg-emerald-500" },
  warehousing: { label: "Warehousing", color: "bg-violet-500" },
  crossdock: { label: "Cross Dock", color: "bg-orange-500" },
  coldchain: { label: "Cold Chain", color: "bg-cyan-500" },
  express: { label: "Express", color: "bg-rose-500" }
}

const rawVendors: Rec[] = [
  { id: "TPL-01", vn: "TCI Express Ltd", vc: "TPL-TCI-001", dc: "dc1", sv: "express", cv: "\u20b945L", od: "15 Jan 2024", dr: 98.2, sc: 97.5, dm: 0.3, ot: 96.8, co: 185, sf: 4.7, st: "platinum", ex: false },
  { id: "TPL-02", vn: "Delhivery Pvt Ltd", vc: "TPL-DLV-002", dc: "dc2", sv: "lastmile", cv: "\u20b932L", od: "22 Mar 2024", dr: 95.8, sc: 94.2, dm: 0.8, ot: 93.5, co: 145, sf: 4.3, st: "gold", ex: false },
  { id: "TPL-03", vn: "BlueDart Express", vc: "TPL-BD-003", dc: "dc3", sv: "express", cv: "\u20b928L", od: "10 Feb 2024", dr: 97.5, sc: 96.8, dm: 0.2, ot: 97.2, co: 210, sf: 4.8, st: "platinum", ex: false },
  { id: "TPL-04", vn: "Rivigo Logistics", vc: "TPL-RVG-004", dc: "dc4", sv: "linehaul", cv: "\u20b955L", od: "05 Jun 2024", dr: 88.5, sc: 85.0, dm: 2.1, ot: 84.3, co: 120, sf: 3.6, st: "silver", ex: false },
  { id: "TPL-05", vn: "Safexpress Pvt Ltd", vc: "TPL-SFE-005", dc: "dc5", sv: "warehousing", cv: "\u20b918L", od: "18 Apr 2024", dr: 92.3, sc: 90.1, dm: 1.5, ot: 89.7, co: 95, sf: 4.1, st: "gold", ex: false },
  { id: "TPL-06", vn: "Ekart Logistics", vc: "TPL-EK-006", dc: "dc6", sv: "lastmile", cv: "\u20b940L", od: "01 Jan 2024", dr: 91.0, sc: 88.5, dm: 1.8, ot: 87.2, co: 110, sf: 3.9, st: "review", ex: false },
  { id: "TPL-07", vn: "Snowman Logistics", vc: "TPL-SNW-007", dc: "dc1", sv: "coldchain", cv: "\u20b922L", od: "20 Jul 2024", dr: 78.5, sc: 75.2, dm: 3.5, ot: 72.1, co: 280, sf: 3.2, st: "probation", ex: false },
  { id: "TPL-08", vn: "DTDC Express Ltd", vc: "TPL-DTDC-008", dc: "dc2", sv: "lastmile", cv: "\u20b915L", od: "12 May 2024", dr: 93.7, sc: 92.1, dm: 1.0, ot: 91.5, co: 98, sf: 4.2, st: "gold", ex: false },
  { id: "TPL-09", vn: "DHL Supply Chain", vc: "TPL-DHL-009", dc: "dc3", sv: "warehousing", cv: "\u20b965L", od: "08 Mar 2024", dr: 96.8, sc: 95.5, dm: 0.4, ot: 95.0, co: 165, sf: 4.6, st: "platinum", ex: false },
  { id: "TPL-10", vn: "Xpressbee Logistics", vc: "TPL-XB-010", dc: "dc4", sv: "crossdock", cv: "\u20b98L", od: "25 Aug 2024", dr: 85.2, sc: 82.0, dm: 2.8, ot: 80.5, co: 75, sf: 3.5, st: "review", ex: false }
]

const vendors: VendorRecord[] = rawVendors.map((r: Rec) => ({
  id: r.id, vendorName: r.vn, vendorCode: r.vc, dc: r.dc,
  serviceType: r.sv, contractValue: r.cv, onboardDate: r.od,
  deliveryRate: r.dr, slaCompliance: r.sc, damageRate: r.dm,
  onTimePct: r.ot, costPerOrder: r.co, satisfaction: r.sf,
  status: r.st, expanded: r.ex
}))

const viewTabs = [
  { key: "vendors", label: "Vendor Scorecard", icon: Handshake },
  { key: "service", label: "Service Analysis", icon: BarChart3 },
  { key: "risk", label: "Risk & Contracts", icon: ShieldAlert }
]

export function ThreePLVendorScorecardPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("vendors")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<VendorRecord[]>(vendors)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: VendorRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: VendorRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.vendorName.toLowerCase().includes(search.toLowerCase()) && !r.vendorCode.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.serviceType && r.serviceType !== activeFilters.serviceType) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const platinum = data.filter(r => r.status === "platinum").length
    const avgSLA = (data.reduce((s: number, r: VendorRecord) => s + r.slaCompliance, 0) / Math.max(total, 1)).toFixed(1)
    const avgDelivery = (data.reduce((s: number, r: VendorRecord) => s + r.deliveryRate, 0) / Math.max(total, 1)).toFixed(1)
    const probation = data.filter(r => r.status === "probation").length
    const avgCost = Math.round(data.reduce((s: number, r: VendorRecord) => s + r.costPerOrder, 0) / Math.max(total, 1))
    return { total, platinum, avgSLA, avgDelivery, probation, avgCost }
  }, [data])

  return (
    <div className="tps-root">
      <div className="tps-header">
        <div className="tps-header-left">
          <div className="tps-icon-wrap"><Handshake className="h-5 w-5 text-violet-600" /></div>
          <div>
            <h3 className="tps-title">3PL Vendor Scorecard</h3>
            <p className="tps-subtitle">Vendor performance scoring, SLA compliance, cost efficiency &amp; risk assessment for Indian logistics partners</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="tps-live-count">{stats.platinum} Platinum</span>
        </div>
      </div>
      <div className="tps-stats-grid">
        {[
          { label: "Total Vendors", value: String(stats.total), icon: Handshake, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
          { label: "Avg SLA", value: stats.avgSLA + "%", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Avg Delivery", value: stats.avgDelivery + "%", icon: Truck, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Avg Cost/Order", value: "\u20b9" + stats.avgCost, icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Platinum", value: String(stats.platinum), icon: Award, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/40" },
          { label: "Probation", value: String(stats.probation), icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" }
        ].map(s => (
          <div key={s.label} className="tps-stat-card">
            <div className={cn("tps-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="tps-stat-info"><span className="tps-stat-value">{s.value}</span><span className="tps-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="tps-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search vendor ID, name, code..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("tps-filter-chip", activeFilters.status === k && "tps-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="tps-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="tps-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(svcCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("serviceType", k)} className={cn("tps-type-chip", activeFilters.serviceType === k && "tps-type-active")}>
              <span className="tps-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="tps-chip-count">{data.filter(r => r.serviceType === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="tps-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("tps-view-tab", view === t.key && "tps-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "vendors" && (
        <div className="tps-grid">
          {filtered.map(v => {
            const sc = statusCfg[v.status] as Rec
            const dc = dcCfg[v.dc] as Rec
            const sv = svcCfg[v.serviceType] as Rec
            const SIcon = (sc.icon as React.ElementType) || Shield
            const isProbation = v.status === "probation"
            const slaColor = v.slaCompliance >= 95 ? "#10b981" : v.slaCompliance >= 85 ? "#f59e0b" : "#ef4444"
            const starsFilled = Math.round(v.satisfaction)
            return (
              <div key={v.id} className={cn("tps-card", `border-l-4 ${sc.borderColor || ""}`, isProbation && "tps-card-probation")}>
                <div className="tps-card-top">
                  <div className="flex items-center gap-2">
                    <span className="tps-card-id">{v.id}</span>
                    <span className={cn("tps-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                    <span className="tps-svc-badge" style={{ backgroundColor: sv.color + "18", color: sv.color }}>{sv.label}</span>
                  </div>
                  <span className="tps-contract"><IndianRupee className="h-3 w-3" />{v.contractValue}</span>
                </div>
                <div className="tps-name-row">
                  <span className="tps-name"><Briefcase className="h-3.5 w-3.5" />{v.vendorName}</span>
                  <span className="tps-dc" style={{ color: dc.color }}>{dc.label}</span>
                </div>
                <div className="tps-score-row">
                  <div className="tps-stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={cn("h-3.5 w-3.5", i < starsFilled ? "text-amber-400 fill-amber-400" : "text-gray-300")} />)}<span className="tps-stars-val">{v.satisfaction}</span></div>
                  <span className="tps-vcode">{v.vendorCode}</span>
                </div>
                <div className="tps-sla-bar-row">
                  <span className="tps-sla-label">SLA Compliance:</span>
                  <div className="tps-sla-bar-track"><div className="tps-sla-bar-fill" style={{ width: v.slaCompliance + "%", backgroundColor: slaColor }} /></div>
                  <span className="tps-sla-pct" style={{ color: slaColor }}>{v.slaCompliance}%</span>
                </div>
                <div className="tps-metrics-row">
                  <span className="tps-metric"><Truck className="h-3 w-3" />Delivery: {v.deliveryRate}%</span>
                  <span className="tps-metric"><Clock className="h-3 w-3" />On-Time: {v.onTimePct}%</span>
                  <span className="tps-metric"><AlertTriangle className="h-3 w-3" />Dmg: {v.damageRate}%</span>
                  <span className="tps-metric"><IndianRupee className="h-3 w-3" />\u20b9{v.costPerOrder}/ord</span>
                </div>
                <div className="tps-onboard-row">
                  <span className="tps-onboard"><Calendar className="h-3 w-3" />Onboard: {v.onboardDate}</span>
                  {v.damageRate >= 3.0 && <span className="tps-dmg-alert"><ShieldAlert className="h-3 w-3" />High Damage Rate</span>}
                </div>
                <button onClick={() => toggleExpand(v.id)} className="tps-expand-btn">
                  {v.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{v.expanded ? "Hide" : "Full Scorecard"}</span>
                </button>
                {v.expanded && (
                  <div className="tps-expanded"><div className="tps-detail-grid">
                    {[
                      { l: "Vendor ID", v: v.id }, { l: "Name", v: v.vendorName }, { l: "Code", v: v.vendorCode },
                      { l: "DC", v: dc.label }, { l: "Service", v: sv.label }, { l: "Contract", v: v.contractValue },
                      { l: "Delivery Rate", v: v.deliveryRate + "%" }, { l: "SLA", v: v.slaCompliance + "%" },
                      { l: "On-Time", v: v.onTimePct + "%" }, { l: "Damage", v: v.damageRate + "%" },
                      { l: "Cost/Order", v: "\u20b9" + v.costPerOrder }, { l: "Satisfaction", v: v.satisfaction + "/5" }
                    ].map(dd => (
                      <div key={dd.l} className="tps-detail-item"><span className="tps-detail-label">{dd.l}</span><span className="tps-detail-value">{dd.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="tps-empty">No vendors match your filters</div>}
        </div>
      )}

      {view === "service" && (
        <div className="tps-anal-view">
          <div className="tps-anal-col">
            <h4 className="tps-anal-title">Performance by Service Type</h4>
            {Object.entries(svcCfg).map(([k, v]: [string, Rec]) => {
              const sd = data.filter(r => r.serviceType === k)
              if (sd.length === 0) return null
              const avgSLA = (sd.reduce((s: number, r: VendorRecord) => s + r.slaCompliance, 0) / sd.length).toFixed(1)
              const avgCost = Math.round(sd.reduce((s: number, r: VendorRecord) => s + r.costPerOrder, 0) / sd.length)
              const avgDmg = (sd.reduce((s: number, r: VendorRecord) => s + r.damageRate, 0) / sd.length).toFixed(1)
              const slaNum = parseFloat(avgSLA)
              const slaColor = slaNum >= 95 ? "#10b981" : slaNum >= 85 ? "#f59e0b" : "#ef4444"
              return (
                <div key={k} className="tps-band-card">
                  <div className="flex items-center gap-2 mb-2"><CircleDot className="h-4 w-4" style={{ color: v.color }} /><span className="tps-band-name">{v.label}</span><span className="tps-band-sub">{sd.length} vendor(s)</span></div>
                  <div className="tps-band-stats">
                    <div className="tps-band-stat"><span className="tps-band-val" style={{ color: slaColor }}>{avgSLA}%</span><span className="tps-band-lbl">Avg SLA</span></div>
                    <div className="tps-band-stat"><span className="tps-band-val text-blue-600">\u20b9{avgCost}</span><span className="tps-band-lbl">Avg Cost/Ord</span></div>
                    <div className="tps-band-stat"><span className="tps-band-val text-amber-600">{avgDmg}%</span><span className="tps-band-lbl">Avg Damage</span></div>
                  </div>
                  <div className="tps-sla-bar-track mt-2"><div className="tps-sla-bar-fill" style={{ width: slaNum + "%", backgroundColor: slaColor }} /></div>
                </div>
              )
            })}
          </div>
          <div className="tps-anal-col">
            <h4 className="tps-anal-title">Top Performers</h4>
            {data.filter(r => r.status !== "probation").sort((a: VendorRecord, b: VendorRecord) => b.slaCompliance - a.slaCompliance).slice(0, 5).map(v => {
              const dc = dcCfg[v.dc] as Rec
              return (
                <div key={v.id} className="tps-alert-row">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="tps-alert-name">{v.vendorName}</span>
                  <span className="tps-alert-stat">{v.slaCompliance}%</span>
                  <span className="tps-alert-rooms">{dc.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "risk" && (
        <div className="tps-anal-view">
          <div className="tps-anal-col">
            <h4 className="tps-anal-title">Tier Distribution</h4>
            {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => {
              const td = data.filter(r => r.status === k)
              if (td.length === 0) return null
              const avgCost = Math.round(td.reduce((s: number, r: VendorRecord) => s + r.costPerOrder, 0) / td.length)
              return (
                <div key={k} className="tps-band-card">
                  <div className="flex items-center gap-2 mb-2"><v.icon className="h-4 w-4" /><span className="tps-band-name">{v.label}</span><span className="tps-band-sub">{td.length} vendor(s)</span></div>
                  <div className="tps-band-stats">
                    <div className="tps-band-stat"><span className="tps-band-val text-blue-600">\u20b9{avgCost}</span><span className="tps-band-lbl">Avg Cost/Ord</span></div>
                    <div className="tps-band-stat"><span className="tps-band-val text-violet-600">{td.length}</span><span className="tps-band-lbl">Vendors</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="tps-anal-col">
            <h4 className="tps-anal-title">High Risk Vendors</h4>
            {data.filter(r => r.status === "probation" || r.damageRate >= 2.5).sort((a: VendorRecord, b: VendorRecord) => b.damageRate - a.damageRate).map(v => {
              const dc = dcCfg[v.dc] as Rec
              const sc = statusCfg[v.status] as Rec
              return (
                <div key={v.id} className="tps-alert-row">
                  <ShieldAlert className="h-3 w-3 text-red-500" />
                  <span className="tps-alert-name">{v.id} {v.vendorName}</span>
                  <span className="tps-alert-stat">{v.damageRate}% dmg</span>
                  <span className="tps-alert-rooms">{sc.label} | {dc.label}</span>
                </div>
              )
            })}
            {data.filter(r => r.status === "probation" || r.damageRate >= 2.5).length === 0 && <div className="tps-empty">No high-risk vendors</div>}
          </div>
        </div>
      )}
    </div>
  )
}
