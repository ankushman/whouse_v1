"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Warehouse, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  Layers, AlertTriangle, CheckCircle2, Clock, ArrowRight, BoxSelect,
  Weight, Gauge, Shield, Package, BoxesIcon, ArrowDownToLine, ArrowUpFromLine
} from "lucide-react"

type Rec = any

interface RackRecord {
  id: string; zone: string; dc: string; rackType: string; levels: number
  totalSlots: number; usedSlots: number; maxWeight: string; currentWeight: string
  utilizationPct: number; status: string; lastAudit: string; commodity: string; expanded: boolean
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
  optimal: { label: "Optimal", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: CheckCircle2 },
  high: { label: "High Utilization", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: Gauge },
  critical: { label: "Critical", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: AlertTriangle },
  empty: { label: "Empty / Available", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: BoxSelect }
}

const typeCfg: Record<string, Rec> = {
  selective: { label: "Selective", color: "bg-blue-500" },
  drivein: { label: "Drive-In", color: "bg-orange-500" },
  pushback: { label: "Push-Back", color: "bg-violet-500" },
  palletflow: { label: "Pallet Flow", color: "bg-cyan-500" }
}

const rawRacks: Rec[] = [
  { id: "RCK-01", zn: "Zone A - Row 1", dc: "dc1", rt: "selective", lv: 5, ts: 120, us: 96, mw: "2,000 kg", cw: "1,680 kg", up: 80, st: "high", la: "28 Jul 2026", cm: "FMCG", ex: false },
  { id: "RCK-02", zn: "Zone B - Row 3", dc: "dc2", rt: "drivein", lv: 4, ts: 80, us: 72, mw: "3,500 kg", cw: "3,150 kg", up: 90, st: "critical", la: "25 Jul 2026", cm: "Steel Coils", ex: false },
  { id: "RCK-03", zn: "Zone C - Row 1", dc: "dc3", rt: "selective", lv: 6, ts: 144, us: 86, mw: "1,500 kg", cw: "890 kg", up: 60, st: "optimal", la: "30 Jul 2026", cm: "Electronics", ex: false },
  { id: "RCK-04", zn: "Zone D - Row 5", dc: "dc4", rt: "palletflow", lv: 3, ts: 60, us: 57, mw: "2,000 kg", cw: "1,900 kg", up: 95, st: "critical", la: "22 Jul 2026", cm: "Beverages", ex: false },
  { id: "RCK-05", zn: "Zone A - Row 2", dc: "dc5", rt: "pushback", lv: 4, ts: 48, us: 24, mw: "2,500 kg", cw: "1,200 kg", up: 50, st: "optimal", la: "31 Jul 2026", cm: "Textiles", ex: false },
  { id: "RCK-06", zn: "Zone E - Row 1", dc: "dc6", rt: "selective", lv: 5, ts: 100, us: 0, mw: "1,800 kg", cw: "0 kg", up: 0, st: "empty", la: "01 Aug 2026", cm: "\u2014", ex: false },
  { id: "RCK-07", zn: "Zone B - Row 1", dc: "dc1", rt: "drivein", lv: 4, ts: 80, us: 64, mw: "3,000 kg", cw: "2,400 kg", up: 80, st: "high", la: "27 Jul 2026", cm: "Cement Bags", ex: false },
  { id: "RCK-08", zn: "Zone C - Row 4", dc: "dc2", rt: "palletflow", lv: 3, ts: 72, us: 43, mw: "2,200 kg", cw: "1,320 kg", up: 60, st: "optimal", la: "29 Jul 2026", cm: "Pharma", ex: false },
  { id: "RCK-09", zn: "Zone F - Row 2", dc: "dc3", rt: "pushback", lv: 4, ts: 48, us: 46, mw: "2,800 kg", cw: "2,660 kg", up: 96, st: "critical", la: "20 Jul 2026", cm: "Auto Parts", ex: false },
  { id: "RCK-10", zn: "Zone A - Row 4", dc: "dc4", rt: "selective", lv: 6, ts: 144, us: 58, mw: "1,500 kg", cw: "600 kg", up: 40, st: "optimal", la: "31 Jul 2026", cm: "Food Grain", ex: false }
]

const racks: RackRecord[] = rawRacks.map((r: Rec) => ({
  id: r.id, zone: r.zn, dc: r.dc, rackType: r.rt, levels: r.lv,
  totalSlots: r.ts, usedSlots: r.us, maxWeight: r.mw, currentWeight: r.cw,
  utilizationPct: r.up, status: r.st, lastAudit: r.la, commodity: r.cm, expanded: r.ex
}))

const viewTabs = [
  { key: "zones", label: "Rack Zones", icon: Layers },
  { key: "capacity", label: "Capacity Analysis", icon: BarChart3 },
  { key: "weight", label: "Weight Distribution", icon: Weight }
]

export function SlabRackingUtilizationPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("zones")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<RackRecord[]>(racks)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: RackRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: RackRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.zone.toLowerCase().includes(search.toLowerCase()) && !r.commodity.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.rackType && r.rackType !== activeFilters.rackType) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const optimal = data.filter(r => r.status === "optimal").length
    const critical = data.filter(r => r.status === "critical").length
    const avgUtil = Math.round(data.reduce((s: number, r: RackRecord) => s + r.utilizationPct, 0) / Math.max(data.length, 1))
    const totalSlots = data.reduce((s: number, r: RackRecord) => s + r.totalSlots, 0)
    const usedSlots = data.reduce((s: number, r: RackRecord) => s + r.usedSlots, 0)
    return { total, optimal, critical, avgUtil, totalSlots, usedSlots }
  }, [data])

  return (
    <div className="sru-root">
      <div className="sru-header">
        <div className="sru-header-left">
          <div className="sru-icon-wrap"><Layers className="h-5 w-5 text-indigo-600" /></div>
          <div>
            <h3 className="sru-title">Slab Racking Utilization</h3>
            <p className="sru-subtitle">Warehouse racking system capacity, weight distribution &amp; rack health monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="sru-live-count">{stats.avgUtil}% Avg Util</span>
        </div>
      </div>
      <div className="sru-stats-grid">
        {[
          { label: "Total Zones", value: String(stats.total), icon: Layers, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
          { label: "Optimal", value: String(stats.optimal), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Critical", value: String(stats.critical), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
          { label: "Avg Utilization", value: stats.avgUtil + "%", icon: Gauge, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Used Slots", value: String(stats.usedSlots), icon: BoxesIcon, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Total Slots", value: String(stats.totalSlots), icon: Package, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" }
        ].map(s => (
          <div key={s.label} className="sru-stat-card">
            <div className={cn("sru-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="sru-stat-info"><span className="sru-stat-value">{s.value}</span><span className="sru-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="sru-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search zone, rack ID, commodity..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("sru-filter-chip", activeFilters.status === k && "sru-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="sru-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="sru-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(typeCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("rackType", k)} className={cn("sru-type-chip", activeFilters.rackType === k && "sru-type-active")}>
              <span className="sru-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="sru-chip-count">{data.filter(r => r.rackType === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="sru-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("sru-view-tab", view === t.key && "sru-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "zones" && (
        <div className="sru-grid">
          {filtered.map(rk => {
            const sc = statusCfg[rk.status] as Rec
            const dc = dcCfg[rk.dc] as Rec
            const tc = typeCfg[rk.rackType] as Rec
            const SIcon = (sc.icon as React.ElementType) || CheckCircle2
            const isCritical = rk.status === "critical"
            const utilColor = rk.utilizationPct > 85 ? "#ef4444" : rk.utilizationPct > 60 ? "#f59e0b" : "#10b981"
            const freeSlots = rk.totalSlots - rk.usedSlots
            return (
              <div key={rk.id} className={cn("sru-card", `border-l-4 ${sc.borderColor || ""}`, isCritical && "sru-card-critical")}>
                <div className="sru-card-top">
                  <div className="flex items-center gap-2">
                    <span className="sru-card-id">{rk.id}</span>
                    <span className="sru-zone-badge"><Warehouse className="h-3 w-3" />{rk.zone}</span>
                    <span className={cn("sru-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                  </div>
                  <span className="sru-type-badge" style={{ backgroundColor: tc.color + "18", color: tc.color }}>{tc.label}</span>
                </div>
                <div className="sru-dc-row">
                  <span className="sru-dc" style={{ color: dc.color }}>{dc.label}</span>
                  <span className="sru-levels"><Layers className="h-3 w-3" />{rk.levels} levels</span>
                </div>
                <div className="sru-metrics-row">
                  <span className="sru-metric"><Package className="h-3 w-3" />{rk.usedSlots}/{rk.totalSlots} slots</span>
                  <span className="sru-metric"><ArrowUpFromLine className="h-3 w-3" />{rk.maxWeight}</span>
                  <span className="sru-metric"><ArrowDownToLine className="h-3 w-3" />{rk.currentWeight}</span>
                  <span className="sru-metric"><BoxSelect className="h-3 w-3" />{freeSlots} free</span>
                </div>
                <div className="sru-util-bar-row">
                  <span className="sru-util-label">Utilization:</span>
                  <div className="sru-util-bar-track"><div className="sru-util-bar-fill" style={{ width: rk.utilizationPct + "%", backgroundColor: utilColor }} /></div>
                  <span className="sru-util-pct" style={{ color: utilColor }}>{rk.utilizationPct}%</span>
                </div>
                <div className="sru-time-row">
                  <span className="sru-time-metric"><Clock className="h-3 w-3" />Audit: {rk.lastAudit}</span>
                  <span className="sru-time-metric"><BoxSelect className="h-3 w-3" />{rk.commodity}</span>
                  {isCritical && <span className="sru-delay-tag"><AlertTriangle className="h-3 w-3" />Overloaded</span>}
                </div>
                <button onClick={() => toggleExpand(rk.id)} className="sru-expand-btn">
                  {rk.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{rk.expanded ? "Hide" : "Details"}</span>
                </button>
                {rk.expanded && (
                  <div className="sru-expanded"><div className="sru-detail-grid">
                    {[
                      { l: "ID", v: rk.id }, { l: "Zone", v: rk.zone }, { l: "DC", v: dc.label },
                      { l: "Rack Type", v: tc.label }, { l: "Levels", v: String(rk.levels) },
                      { l: "Max Weight", v: rk.maxWeight }, { l: "Current Weight", v: rk.currentWeight },
                      { l: "Free Slots", v: String(freeSlots) }
                    ].map(d => (
                      <div key={d.l} className="sru-detail-item"><span className="sru-detail-label">{d.l}</span><span className="sru-detail-value">{d.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="sru-empty">No rack zones match your filters</div>}
        </div>
      )}

      {view === "capacity" && (
        <div className="sru-anal-view">
          <div className="sru-anal-col">
            <h4 className="sru-anal-title">Utilization by DC</h4>
            {Object.entries(dcCfg).map(([k, v]: [string, Rec]) => {
              const dd = data.filter(r => r.dc === k)
              if (dd.length === 0) return null
              const avgU = Math.round(dd.reduce((s: number, r: RackRecord) => s + r.utilizationPct, 0) / dd.length)
              const totalS = dd.reduce((s: number, r: RackRecord) => s + r.totalSlots, 0)
              const usedS = dd.reduce((s: number, r: RackRecord) => s + r.usedSlots, 0)
              const utilColor = avgU > 85 ? "#ef4444" : avgU > 60 ? "#f59e0b" : "#10b981"
              return (
                <div key={k} className="sru-band-card">
                  <div className="flex items-center gap-2 mb-2"><Warehouse className="h-4 w-4" style={{ color: v.color }} /><span className="sru-band-name">{v.label}</span></div>
                  <div className="sru-band-stats">
                    <div className="sru-band-stat"><span className="sru-band-val" style={{ color: utilColor }}>{avgU}%</span><span className="sru-band-lbl">Avg Util</span></div>
                    <div className="sru-band-stat"><span className="sru-band-val text-blue-600">{usedS}/{totalS}</span><span className="sru-band-lbl">Slots Used</span></div>
                  </div>
                  <div className="sru-util-bar-track mt-2"><div className="sru-util-bar-fill" style={{ width: avgU + "%", backgroundColor: utilColor }} /></div>
                </div>
              )
            })}
          </div>
          <div className="sru-anal-col">
            <h4 className="sru-anal-title">Rack Type Distribution</h4>
            {Object.entries(typeCfg).map(([k, v]: [string, Rec]) => {
              const dd = data.filter(r => r.rackType === k)
              const avgU = Math.round(dd.reduce((s: number, r: RackRecord) => s + r.utilizationPct, 0) / Math.max(dd.length, 1))
              const critCount = dd.filter(r => r.status === "critical").length
              return (
                <div key={k} className="sru-band-card">
                  <div className="flex items-center gap-2 mb-2"><BoxSelect className="h-4 w-4" style={{ color: v.color }} /><span className="sru-band-name">{v.label}</span><span className="sru-band-sub">{dd.length} zones</span></div>
                  <div className="sru-band-stats">
                    <div className="sru-band-stat"><span className="sru-band-val text-amber-600">{avgU}%</span><span className="sru-band-lbl">Avg Util</span></div>
                    <div className="sru-band-stat"><span className="sru-band-val text-red-600">{critCount}</span><span className="sru-band-lbl">Critical</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "weight" && (
        <div className="sru-anal-view">
          <div className="sru-anal-col">
            <h4 className="sru-anal-title">Weight Load per Zone</h4>
            {data.map(rk => {
              const dc = dcCfg[rk.dc] as Rec
              const maxW = parseInt(rk.maxWeight.replace(/,/g, ""), 10)
              const curW = parseInt(rk.currentWeight.replace(/,/g, ""), 10)
              const wPct = Math.round((curW / Math.max(maxW, 1)) * 100)
              const wColor = wPct > 90 ? "#ef4444" : wPct > 70 ? "#f59e0b" : "#10b981"
              return (
                <div key={rk.id} className="sru-weight-row">
                  <div className="sru-weight-row-left">
                    <span className="sru-weight-rid">{rk.id}</span>
                    <span className="sru-weight-zone">{rk.zone}</span>
                  </div>
                  <div className="sru-weight-bar-track"><div className="sru-weight-bar-fill" style={{ width: wPct + "%", backgroundColor: wColor }} /></div>
                  <span className="sru-weight-pct" style={{ color: wColor }}>{wPct}%</span>
                  <span className="sru-weight-lbl">{rk.currentWeight} / {rk.maxWeight}</span>
                </div>
              )
            })}
          </div>
          <div className="sru-anal-col">
            <h4 className="sru-anal-title">Critical Overload Alerts</h4>
            {data.filter(r => r.status === "critical").map(rk => {
              const dc = dcCfg[rk.dc] as Rec
              return (
                <div key={rk.id} className="sru-alert-row">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span className="sru-alert-name">{rk.id} {rk.zone}</span>
                  <span className="sru-alert-stat">{rk.utilizationPct}% util</span>
                  <span className="sru-alert-rooms">{dc.label} | {rk.commodity}</span>
                </div>
              )
            })}
            {data.filter(r => r.status === "critical").length === 0 && <div className="sru-empty">No overload alerts</div>}
          </div>
        </div>
      )}
    </div>
  )
}
