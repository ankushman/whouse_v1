"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  ArrowRightLeft, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, AlertTriangle, CheckCircle2, Clock, Package,
  Truck, ArrowRight, BoxSelect, Gauge, Shuffle, Zap, ScanBarcode,
  Tags, Warehouse, Calendar
} from "lucide-react"

type Rec = any

interface TransferRecord {
  id: string; originDC: string; destinationDC: string; sku: string; commodity: string
  quantity: number; sortMethod: string; status: string; startTime: string; transitSLA: string
  elapsedTime: string; chaseVehicle: string; priority: string; scannedPct: number; expanded: boolean
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
  inprogress: { label: "In Progress", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: Shuffle },
  sorting: { label: "Sorting", color: "bg-violet-500", textColor: "text-violet-700 dark:text-violet-400", bgColor: "bg-violet-50 dark:bg-violet-950/30", borderColor: "border-l-violet-500", icon: ScanBarcode },
  intransit: { label: "In Transit", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: Truck },
  completed: { label: "Completed", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: CheckCircle2 },
  overdue: { label: "SLA Overdue", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: AlertTriangle }
}

const sortCfg: Record<string, Rec> = {
  scan: { label: "Scan-Based", color: "bg-blue-500" },
  sorttolight: { label: "Sort-to-Light", color: "bg-amber-500" },
  putwall: { label: "Put Wall", color: "bg-emerald-500" },
  automated: { label: "Auto Sort", color: "bg-violet-500" }
}

const priCfg: Record<string, Rec> = {
  high: { label: "High", color: "bg-red-500" },
  medium: { label: "Medium", color: "bg-amber-500" },
  low: { label: "Low", color: "bg-slate-500" }
}

const rawTransfers: Rec[] = [
  { id: "CDT-01", od: "dc1", dd: "dc2", sk: "SKU-FL-44521", cm: "FMCG Assorted", qt: 480, sm: "scan", st: "inprogress", sr: "02 Aug 06:00", ts: "30 min", et: "18 min", cv: "Tugger TV-04", pr: "high", sp: 62, ex: false },
  { id: "CDT-02", od: "dc2", dd: "dc3", sk: "SKU-EL-77234", cm: "Electronics", qt: 120, sm: "sorttolight", st: "sorting", sr: "02 Aug 07:30", ts: "20 min", et: "14 min", cv: "Chase CV-02", pr: "high", sp: 45, ex: false },
  { id: "CDT-03", od: "dc3", dd: "dc4", sk: "SKU-AP-11987", cm: "Auto Components", qt: 200, sm: "putwall", st: "intransit", sr: "02 Aug 05:00", ts: "45 min", et: "38 min", cv: "TV-07", pr: "medium", sp: 100, ex: false },
  { id: "CDT-04", od: "dc4", dd: "dc5", sk: "SKU-TX-33456", cm: "Textile Rolls", qt: 350, sm: "automated", st: "inprogress", sr: "02 Aug 08:00", ts: "25 min", et: "28 min", cv: "TV-01", pr: "medium", sp: 78, ex: false },
  { id: "CDT-05", od: "dc5", dd: "dc6", sk: "SKU-PS-66789", cm: "Pharma Samples", qt: 80, sm: "scan", st: "completed", sr: "01 Aug 22:00", ts: "20 min", et: "19 min", cv: "CV-05", pr: "low", sp: 100, ex: false },
  { id: "CDT-06", od: "dc6", dd: "dc1", sk: "SKU-GR-00234", cm: "Grocery Staples", qt: 600, sm: "sorttolight", st: "inprogress", sr: "02 Aug 09:00", ts: "35 min", et: "22 min", cv: "TV-03", pr: "high", sp: 55, ex: false },
  { id: "CDT-07", od: "dc1", dd: "dc3", sk: "SKU-BV-55678", cm: "Beverage Cartons", qt: 400, sm: "putwall", st: "overdue", sr: "02 Aug 06:30", ts: "40 min", et: "52 min", cv: "TV-06", pr: "high", sp: 88, ex: false },
  { id: "CDT-08", od: "dc2", dd: "dc4", sk: "SKU-SP-89012", cm: "Sports Equipment", qt: 60, sm: "automated", st: "sorting", sr: "02 Aug 10:00", ts: "15 min", et: "8 min", cv: "CV-01", pr: "medium", sp: 32, ex: false },
  { id: "CDT-09", od: "dc4", dd: "dc6", sk: "SKU-CH-12345", cm: "Chemical Reagents", qt: 150, sm: "scan", st: "intransit", sr: "02 Aug 07:00", ts: "50 min", et: "41 min", cv: "TV-09", pr: "high", sp: 100, ex: false },
  { id: "CDT-10", od: "dc3", dd: "dc5", sk: "SKU-FD-44567", cm: "Food Packets", qt: 520, sm: "sorttolight", st: "completed", sr: "01 Aug 21:00", ts: "30 min", et: "27 min", cv: "CV-08", pr: "low", sp: 100, ex: false }
]

const transfers: TransferRecord[] = rawTransfers.map((r: Rec) => ({
  id: r.id, originDC: r.od, destinationDC: r.dd, sku: r.sk, commodity: r.cm,
  quantity: r.qt, sortMethod: r.sm, status: r.st, startTime: r.sr, transitSLA: r.ts,
  elapsedTime: r.et, chaseVehicle: r.cv, priority: r.pr, scannedPct: r.sp, expanded: r.ex
}))

const viewTabs = [
  { key: "transfers", label: "Transfers", icon: ArrowRightLeft },
  { key: "methods", label: "Sort Methods", icon: ScanBarcode },
  { key: "lanes", label: "DC Lane Flow", icon: BarChart3 }
]

export function CrossdockTransferPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("transfers")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<TransferRecord[]>(transfers)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: TransferRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: TransferRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.sku.toLowerCase().includes(search.toLowerCase()) && !r.commodity.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.sortMethod && r.sortMethod !== activeFilters.sortMethod) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const active = data.filter(r => r.status === "inprogress" || r.status === "sorting").length
    const overdue = data.filter(r => r.status === "overdue").length
    const totalQty = data.reduce((s: number, r: TransferRecord) => s + r.quantity, 0)
    const avgScan = Math.round(data.filter(r => r.status !== "completed").reduce((s: number, r: TransferRecord) => s + r.scannedPct, 0) / Math.max(data.filter(r => r.status !== "completed").length, 1))
    return { total, active, overdue, totalQty, avgScan }
  }, [data])

  return (
    <div className="cdt-root">
      <div className="cdt-header">
        <div className="cdt-header-left">
          <div className="cdt-icon-wrap"><ArrowRightLeft className="h-5 w-5 text-fuchsia-600" /></div>
          <div>
            <h3 className="cdt-title">Crossdock Transfers</h3>
            <p className="cdt-subtitle">Sort-to-light, put wall &amp; chase vehicle operations for cross-dock logistics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="cdt-live-count">{stats.active} Active</span>
        </div>
      </div>
      <div className="cdt-stats-grid">
        {[
          { label: "Total Transfers", value: String(stats.total), icon: ArrowRightLeft, color: "text-fuchsia-600", bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40" },
          { label: "Active", value: String(stats.active), icon: Shuffle, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "SLA Overdue", value: String(stats.overdue), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
          { label: "Total Qty", value: String(stats.totalQty), icon: Package, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Avg Scan %", value: stats.avgScan + "%", icon: ScanBarcode, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "DCs Active", value: "6", icon: Warehouse, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" }
        ].map(s => (
          <div key={s.label} className="cdt-stat-card">
            <div className={cn("cdt-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="cdt-stat-info"><span className="cdt-stat-value">{s.value}</span><span className="cdt-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="cdt-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search transfer ID, SKU, commodity..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("cdt-filter-chip", activeFilters.status === k && "cdt-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="cdt-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="cdt-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(sortCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("sortMethod", k)} className={cn("cdt-type-chip", activeFilters.sortMethod === k && "cdt-type-active")}>
              <span className="cdt-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="cdt-chip-count">{data.filter(r => r.sortMethod === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="cdt-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("cdt-view-tab", view === t.key && "cdt-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "transfers" && (
        <div className="cdt-grid">
          {filtered.map(t => {
            const sc = statusCfg[t.status] as Rec
            const oc = dcCfg[t.originDC] as Rec
            const dc2 = dcCfg[t.destinationDC] as Rec
            const sm = sortCfg[t.sortMethod] as Rec
            const pm = priCfg[t.priority] as Rec
            const SIcon = (sc.icon as React.ElementType) || CheckCircle2
            const isOverdue = t.status === "overdue"
            const scanColor = t.scannedPct >= 90 ? "#10b981" : t.scannedPct >= 50 ? "#f59e0b" : "#ef4444"
            return (
              <div key={t.id} className={cn("cdt-card", `border-l-4 ${sc.borderColor || ""}`, isOverdue && "cdt-card-overdue")}>
                <div className="cdt-card-top">
                  <div className="flex items-center gap-2">
                    <span className="cdt-card-id">{t.id}</span>
                    <span className={cn("cdt-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                    <span className="cdt-pri-badge" style={{ backgroundColor: pm.color + "18", color: pm.color }}>{pm.label}</span>
                  </div>
                  <span className="cdt-type-badge" style={{ backgroundColor: sm.color + "18", color: sm.color }}>{sm.label}</span>
                </div>
                <div className="cdt-route-row">
                  <span className="cdt-origin" style={{ color: oc.color }}>{oc.label}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="cdt-dest" style={{ color: dc2.color }}>{dc2.label}</span>
                </div>
                <div className="cdt-sku-row">
                  <span className="cdt-sku"><Tags className="h-3 w-3" />{t.sku}</span>
                  <span className="cdt-commodity">{t.commodity}</span>
                  <span className="cdt-qty"><Package className="h-3 w-3" />{t.quantity} units</span>
                </div>
                <div className="cdt-scan-bar-row">
                  <span className="cdt-scan-label">Scan Progress:</span>
                  <div className="cdt-scan-bar-track"><div className="cdt-scan-bar-fill" style={{ width: t.scannedPct + "%", backgroundColor: scanColor }} /></div>
                  <span className="cdt-scan-pct" style={{ color: scanColor }}>{t.scannedPct}%</span>
                </div>
                <div className="cdt-metrics-row">
                  <span className="cdt-metric"><Timer className="h-3 w-3" />SLA: {t.transitSLA}</span>
                  <span className="cdt-metric"><Clock className="h-3 w-3" />Elapsed: {t.elapsedTime}</span>
                  <span className="cdt-metric"><Zap className="h-3 w-3" />{t.chaseVehicle}</span>
                  <span className="cdt-metric"><Calendar className="h-3 w-3" />{t.startTime}</span>
                </div>
                {isOverdue && <div className="cdt-overdue-tag"><AlertTriangle className="h-3 w-3" />SLA breached by {parseInt(t.elapsedTime) - parseInt(t.transitSLA)} min</div>}
                <button onClick={() => toggleExpand(t.id)} className="cdt-expand-btn">
                  {t.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{t.expanded ? "Hide" : "Details"}</span>
                </button>
                {t.expanded && (
                  <div className="cdt-expanded"><div className="cdt-detail-grid">
                    {[
                      { l: "ID", v: t.id }, { l: "SKU", v: t.sku }, { l: "Origin", v: oc.label },
                      { l: "Destination", v: dc2.label }, { l: "Sort Method", v: sm.label }, { l: "Quantity", v: String(t.quantity) },
                      { l: "Chase Vehicle", v: t.chaseVehicle }, { l: "Priority", v: pm.label }
                    ].map(dd => (
                      <div key={dd.l} className="cdt-detail-item"><span className="cdt-detail-label">{dd.l}</span><span className="cdt-detail-value">{dd.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="cdt-empty">No transfers match your filters</div>}
        </div>
      )}

      {view === "methods" && (
        <div className="cdt-anal-view">
          <div className="cdt-anal-col">
            <h4 className="cdt-anal-title">Throughput by Sort Method</h4>
            {Object.entries(sortCfg).map(([k, v]: [string, Rec]) => {
              const md = data.filter(r => r.sortMethod === k)
              const totalQty = md.reduce((s: number, r: TransferRecord) => s + r.quantity, 0)
              const activeCt = md.filter(r => r.status === "inprogress" || r.status === "sorting").length
              return (
                <div key={k} className="cdt-band-card">
                  <div className="flex items-center gap-2 mb-2"><ScanBarcode className="h-4 w-4" style={{ color: v.color }} /><span className="cdt-band-name">{v.label}</span><span className="cdt-band-sub">{md.length} transfers</span></div>
                  <div className="cdt-band-stats">
                    <div className="cdt-band-stat"><span className="cdt-band-val text-fuchsia-600">{totalQty}</span><span className="cdt-band-lbl">Total Qty</span></div>
                    <div className="cdt-band-stat"><span className="cdt-band-val text-blue-600">{activeCt}</span><span className="cdt-band-lbl">Active</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="cdt-anal-col">
            <h4 className="cdt-anal-title">SLA Compliance</h4>
            {data.filter(r => r.status !== "completed").map(t => {
              const sc = statusCfg[t.status] as Rec
              const slaMin = parseInt(t.transitSLA)
              const elapsed = parseInt(t.elapsedTime)
              const breach = elapsed > slaMin
              return (
                <div key={t.id} className="cdt-sla-row">
                  <div className="cdt-sla-left">
                    <span className="cdt-sla-id">{t.id}</span>
                    <span className="cdt-sla-sku">{t.sku}</span>
                  </div>
                  <div className="cdt-sla-metrics">
                    <span className="cdt-sla-time">SLA: {t.transitSLA}</span>
                    <span className={cn("cdt-sla-time", breach && "text-red-600 font-semibold")}>Actual: {t.elapsedTime}</span>
                  </div>
                  <span className={cn("cdt-sla-badge", sc.bgColor, sc.textColor)}>{sc.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "lanes" && (
        <div className="cdt-anal-view">
          <div className="cdt-anal-col">
            <h4 className="cdt-anal-title">Active DC-to-DC Lanes</h4>
            {Array.from(new Set(data.map(r => r.originDC + ">" + r.destinationDC))).sort().map(lane => {
              const [ok, dk] = lane.split(">")
              const ld = data.filter(r => r.originDC === ok && r.destinationDC === dk)
              const oc = dcCfg[ok] as Rec
              const dc2 = dcCfg[dk] as Rec
              const totalQty = ld.reduce((s: number, r: TransferRecord) => s + r.quantity, 0)
              return (
                <div key={lane} className="cdt-lane-card">
                  <div className="cdt-lane-from" style={{ borderColor: oc.color }}>{oc.label}</div>
                  <div className="cdt-lane-arrow"><ArrowRight className="h-3 w-3 text-muted-foreground" /></div>
                  <div className="cdt-lane-to" style={{ borderColor: dc2.color }}>{dc2.label}</div>
                  <div className="cdt-lane-meta"><span className="cdt-lane-qty"><Package className="h-3 w-3" />{totalQty} units</span><span className="cdt-lane-count">{ld.length} transfers</span></div>
                </div>
              )
            })}
          </div>
          <div className="cdt-anal-col">
            <h4 className="cdt-anal-title">Overdue Transfers</h4>
            {data.filter(r => r.status === "overdue").map(t => {
              const oc = dcCfg[t.originDC] as Rec
              const dc2 = dcCfg[t.destinationDC] as Rec
              return (
                <div key={t.id} className="cdt-alert-row">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span className="cdt-alert-name">{t.id} {t.sku}</span>
                  <span className="cdt-alert-stat">{t.elapsedTime} / {t.transitSLA}</span>
                  <span className="cdt-alert-rooms">{oc.label} &#x2192; {dc2.label}</span>
                </div>
              )
            })}
            {data.filter(r => r.status === "overdue").length === 0 && <div className="cdt-empty">No overdue transfers</div>}
          </div>
        </div>
      )}
    </div>
  )
}
