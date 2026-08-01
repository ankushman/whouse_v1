"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  LayoutGrid, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, AlertTriangle, CheckCircle2, Clock, Package,
  TrendingUp, TrendingDown, Target, Zap, Box, Boxes,
  ArrowRight, CircleDot,
  Warehouse, Layers, ScanSearch, GitBranch, AlertOctagon
} from "lucide-react"

type Rec = any

interface SlotRecord {
  id: string; slotZone: string; dc: string; aisle: string
  productCategory: string; abcClass: string; slotUtilPct: number
  pickFrequency: number; travelDist: number; slotType: string
  capacity: number; usedCapacity: number; turnoverRate: number
  status: string; lastReSlot: string; expanded: boolean
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
  optimized: { label: "Optimized", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: CheckCircle2 },
  needsreslot: { label: "Needs Reslot", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: AlertTriangle },
  overstocked: { label: "Overstocked", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: AlertOctagon },
  underutilized: { label: "Underutilized", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: TrendingDown },
  empty: { label: "Empty", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: Box }
}

const abcCfg: Record<string, Rec> = {
  a: { label: "A - Fast Moving", color: "bg-red-500" },
  b: { label: "B - Medium Moving", color: "bg-amber-500" },
  c: { label: "C - Slow Moving", color: "bg-blue-500" },
  d: { label: "D - Dormant", color: "bg-slate-500" }
}

const slotTypeCfg: Record<string, Rec> = {
  pallet: { label: "Pallet Racking", color: "bg-emerald-500" },
  shelves: { label: "Shelf Racking", color: "bg-blue-500" },
  floor: { label: "Floor Stacking", color: "bg-amber-500" },
  mezzanine: { label: "Mezzanine", color: "bg-violet-500" }
}

const catCfg: Record<string, Rec> = {
  electronics: { label: "Electronics" },
  apparel: { label: "Apparel" },
  fmcg: { label: "FMCG" },
  home: { label: "Home & Living" },
  pharma: { label: "Pharmaceuticals" },
  auto: { label: "Auto Parts" }
}

const rawSlots: Rec[] = [
  { id: "SLT-01", sz: "Zone-A / Aisle-01", dc: "dc1", ai: "A1", pc: "electronics", ac: "a", su: 92, pf: 45, td: 12, st: "pallet", ca: 100, uc: 92, tr: 8.5, st2: "optimized", lr: "28 Jul 2026", ex: false },
  { id: "SLT-02", sz: "Zone-A / Aisle-02", dc: "dc2", ai: "A2", pc: "fmcg", ac: "a", su: 98, pf: 52, td: 8, st: "shelves", ca: 200, uc: 196, tr: 12.3, st2: "overstocked", lr: "25 Jul 2026", ex: false },
  { id: "SLT-03", sz: "Zone-B / Aisle-03", dc: "dc3", ai: "B1", pc: "apparel", ac: "b", su: 75, pf: 28, td: 22, st: "shelves", ca: 150, uc: 112, tr: 5.2, st2: "optimized", lr: "01 Aug 2026", ex: false },
  { id: "SLT-04", sz: "Zone-B / Aisle-04", dc: "dc4", ai: "B2", pc: "home", ac: "c", su: 35, pf: 8, td: 45, st: "floor", ca: 50, uc: 18, tr: 1.8, st2: "underutilized", lr: "15 Jun 2026", ex: false },
  { id: "SLT-05", sz: "Zone-C / Aisle-05", dc: "dc5", ai: "C1", pc: "pharma", ac: "a", su: 88, pf: 38, td: 15, st: "mezzanine", ca: 80, uc: 70, tr: 7.1, st2: "needsreslot", lr: "20 Jul 2026", ex: false },
  { id: "SLT-06", sz: "Zone-C / Aisle-06", dc: "dc6", ai: "C2", pc: "auto", ac: "c", su: 0, pf: 0, td: 60, st: "pallet", ca: 60, uc: 0, tr: 0.0, st2: "empty", lr: "--", ex: false },
  { id: "SLT-07", sz: "Zone-D / Aisle-07", dc: "dc1", ai: "D1", pc: "fmcg", ac: "a", su: 95, pf: 48, td: 10, st: "shelves", ca: 180, uc: 171, tr: 10.8, st2: "overstocked", lr: "30 Jul 2026", ex: false },
  { id: "SLT-08", sz: "Zone-D / Aisle-08", dc: "dc2", ai: "D2", pc: "electronics", ac: "b", su: 68, pf: 22, td: 28, st: "pallet", ca: 120, uc: 82, tr: 4.5, st2: "needsreslot", lr: "10 Jul 2026", ex: false },
  { id: "SLT-09", sz: "Zone-E / Aisle-09", dc: "dc3", ai: "E1", pc: "apparel", ac: "d", su: 15, pf: 3, td: 55, st: "shelves", ca: 100, uc: 15, tr: 0.5, st2: "underutilized", lr: "01 May 2026", ex: false },
  { id: "SLT-10", sz: "Zone-E / Aisle-10", dc: "dc4", ai: "E2", pc: "fmcg", ac: "a", su: 85, pf: 42, td: 14, st: "floor", ca: 80, uc: 68, tr: 9.2, st2: "optimized", lr: "02 Aug 2026", ex: false }
]

const slots: SlotRecord[] = rawSlots.map((r: Rec) => ({
  id: r.id, slotZone: r.sz, dc: r.dc, aisle: r.ai,
  productCategory: r.pc, abcClass: r.ac, slotUtilPct: r.su,
  pickFrequency: r.pf, travelDist: r.td, slotType: r.st,
  capacity: r.ca, usedCapacity: r.uc, turnoverRate: r.tr,
  status: r.st2, lastReSlot: r.lr, expanded: r.ex
}))

const viewTabs = [
  { key: "slots", label: "Slot Zones", icon: LayoutGrid },
  { key: "abc", label: "ABC Analysis", icon: Box },
  { key: "optimize", label: "Optimization", icon: Zap }
]

export function SlottingOptimizerPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("slots")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<SlotRecord[]>(slots)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: SlotRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: SlotRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.slotZone.toLowerCase().includes(search.toLowerCase()) && !r.aisle.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.abcClass && r.abcClass !== activeFilters.abcClass) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const optimized = data.filter(r => r.status === "optimized").length
    const avgUtil = Math.round(data.reduce((s: number, r: SlotRecord) => s + r.slotUtilPct, 0) / Math.max(total, 1))
    const avgTravel = Math.round(data.reduce((s: number, r: SlotRecord) => s + r.travelDist, 0) / Math.max(total, 1))
    const needsReslot = data.filter(r => r.status === "needsreslot" || r.status === "overstocked").length
    const empty = data.filter(r => r.status === "empty").length
    return { total, optimized, avgUtil, avgTravel, needsReslot, empty }
  }, [data])

  return (
    <div className="sto-root">
      <div className="sto-header">
        <div className="sto-header-left">
          <div className="sto-icon-wrap"><LayoutGrid className="h-5 w-5 text-teal-600" /></div>
          <div>
            <h3 className="sto-title">Warehouse Slotting Optimizer</h3>
            <p className="sto-subtitle">ABC slotting analysis, pick path optimization, zone utilization &amp; travel distance reduction across Indian DCs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="sto-live-count">{stats.needsReslot} Need Action</span>
        </div>
      </div>
      <div className="sto-stats-grid">
        {[
          { label: "Slot Zones", value: String(stats.total), icon: LayoutGrid, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/40" },
          { label: "Optimized", value: String(stats.optimized), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Avg Utilization", value: stats.avgUtil + "%", icon: Target, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Avg Travel", value: stats.avgTravel + "m", icon: ArrowRight, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
          { label: "Needs Reslot", value: String(stats.needsReslot), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Empty", value: String(stats.empty), icon: Box, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-950/40" }
        ].map(s => (
          <div key={s.label} className="sto-stat-card">
            <div className={cn("sto-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="sto-stat-info"><span className="sto-stat-value">{s.value}</span><span className="sto-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="sto-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search slot ID, zone, aisle..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("sto-filter-chip", activeFilters.status === k && "sto-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="sto-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="sto-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(abcCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("abcClass", k)} className={cn("sto-type-chip", activeFilters.abcClass === k && "sto-type-active")}>
              <span className="sto-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="sto-chip-count">{data.filter(r => r.abcClass === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="sto-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("sto-view-tab", view === t.key && "sto-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "slots" && (
        <div className="sto-grid">
          {filtered.map(s => {
            const sc = statusCfg[s.status] as Rec
            const dc = dcCfg[s.dc] as Rec
            const abc = abcCfg[s.abcClass] as Rec
            const st = slotTypeCfg[s.slotType] as Rec
            const cat = catCfg[s.productCategory] as Rec
            const SIcon = (sc.icon as React.ElementType) || Box
            const isOverstocked = s.status === "overstocked"
            const isEmpty = s.status === "empty"
            const utilColor = s.slotUtilPct >= 90 ? "#ef4444" : s.slotUtilPct >= 70 ? "#10b981" : s.slotUtilPct >= 40 ? "#3b82f6" : "#94a3b8"
            const turnColor = s.turnoverRate >= 8 ? "#10b981" : s.turnoverRate >= 3 ? "#3b82f6" : "#f59e0b"
            return (
              <div key={s.id} className={cn("sto-card", `border-l-4 ${sc.borderColor || ""}`, isOverstocked && "sto-card-overstocked", isEmpty && "sto-card-empty")}>
                <div className="sto-card-top">
                  <div className="flex items-center gap-2">
                    <span className="sto-card-id">{s.id}</span>
                    <span className={cn("sto-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                    <span className="sto-abc-badge" style={{ backgroundColor: abc.color + "18", color: abc.color }}>{abc.label.split(" - ")[0]} Class</span>
                  </div>
                  <span className="sto-st-badge" style={{ backgroundColor: st.color + "18", color: st.color }}>{st.label}</span>
                </div>
                <div className="sto-zone-row">
                  <span className="sto-zone"><Warehouse className="h-3.5 w-3.5" />{s.slotZone}</span>
                  <span className="sto-dc" style={{ color: dc.color }}>{dc.label}</span>
                </div>
                <div className="sto-cat-row">
                  <span className="sto-cat">{cat.label}</span>
                  <span className="sto-aisle"><Layers className="h-3 w-3" />Aisle: {s.aisle}</span>
                </div>
                <div className="sto-util-bar-row">
                  <span className="sto-util-label">Utilization:</span>
                  <div className="sto-util-bar-track"><div className="sto-util-bar-fill" style={{ width: s.slotUtilPct + "%", backgroundColor: utilColor }} /></div>
                  <span className="sto-util-pct" style={{ color: utilColor }}>{s.slotUtilPct}%</span>
                  <span className="sto-cap-info">{s.usedCapacity}/{s.capacity}</span>
                </div>
                <div className="sto-turnover-row">
                  <span className="sto-turn-label">Turnover:</span>
                  <span className="sto-turn-val" style={{ color: turnColor }}>{s.turnoverRate}x</span>
                  <span className="sto-turn-bar-wrap"><div className="sto-turn-bar-track"><div className="sto-turn-bar-fill" style={{ width: Math.min(s.turnoverRate * 8, 100) + "%", backgroundColor: turnColor }} /></div></span>
                </div>
                <div className="sto-metrics-row">
                  <span className="sto-metric"><ScanSearch className="h-3 w-3" />{s.pickFrequency} picks/day</span>
                  <span className="sto-metric"><ArrowRight className="h-3 w-3" />{s.travelDist}m travel</span>
                  <span className="sto-metric"><GitBranch className="h-3 w-3" />{s.slotType}</span>
                </div>
                <div className="sto-time-row">
                  <span className="sto-time-metric"><Clock className="h-3 w-3" />Reslot: {s.lastReSlot}</span>
                  {isOverstocked && <span className="sto-over-tag"><AlertOctagon className="h-3 w-3" />Capacity Exceeded</span>}
                </div>
                <button onClick={() => toggleExpand(s.id)} className="sto-expand-btn">
                  {s.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{s.expanded ? "Hide" : "Slot Details"}</span>
                </button>
                {s.expanded && (
                  <div className="sto-expanded"><div className="sto-detail-grid">
                    {[
                      { l: "Slot ID", v: s.id }, { l: "Zone", v: s.slotZone }, { l: "Aisle", v: s.aisle },
                      { l: "DC", v: dc.label }, { l: "Category", v: cat.label }, { l: "ABC Class", v: abc.label },
                      { l: "Slot Type", v: st.label }, { l: "Capacity", v: s.usedCapacity + "/" + s.capacity },
                      { l: "Utilization", v: s.slotUtilPct + "%" }, { l: "Picks/Day", v: String(s.pickFrequency) },
                      { l: "Travel", v: s.travelDist + "m" }, { l: "Turnover", v: s.turnoverRate + "x" }
                    ].map(dd => (
                      <div key={dd.l} className="sto-detail-item"><span className="sto-detail-label">{dd.l}</span><span className="sto-detail-value">{dd.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="sto-empty">No slot zones match your filters</div>}
        </div>
      )}

      {view === "abc" && (
        <div className="sto-anal-view">
          <div className="sto-anal-col">
            <h4 className="sto-anal-title">ABC Distribution</h4>
            {Object.entries(abcCfg).map(([k, v]: [string, Rec]) => {
              const ad = data.filter(r => r.abcClass === k)
              if (ad.length === 0) return null
              const avgUtil = Math.round(ad.reduce((s: number, r: SlotRecord) => s + r.slotUtilPct, 0) / ad.length)
              const avgTravel = Math.round(ad.reduce((s: number, r: SlotRecord) => s + r.travelDist, 0) / ad.length)
              const avgTurn = (ad.reduce((s: number, r: SlotRecord) => s + r.turnoverRate, 0) / ad.length).toFixed(1)
              const utilColor = avgUtil >= 90 ? "#ef4444" : avgUtil >= 70 ? "#10b981" : "#3b82f6"
              return (
                <div key={k} className="sto-band-card">
                  <div className="flex items-center gap-2 mb-2"><Boxes className="h-4 w-4" style={{ color: v.color }} /><span className="sto-band-name">{v.label}</span><span className="sto-band-sub">{ad.length} zone(s)</span></div>
                  <div className="sto-band-stats">
                    <div className="sto-band-stat"><span className="sto-band-val" style={{ color: utilColor }}>{avgUtil}%</span><span className="sto-band-lbl">Avg Util</span></div>
                    <div className="sto-band-stat"><span className="sto-band-val text-blue-600">{avgTravel}m</span><span className="sto-band-lbl">Avg Travel</span></div>
                    <div className="sto-band-stat"><span className="sto-band-val text-violet-600">{avgTurn}x</span><span className="sto-band-lbl">Turnover</span></div>
                  </div>
                  <div className="sto-util-bar-track mt-2"><div className="sto-util-bar-fill" style={{ width: avgUtil + "%", backgroundColor: utilColor }} /></div>
                </div>
              )
            })}
          </div>
          <div className="sto-anal-col">
            <h4 className="sto-anal-title">Slot Type Mix</h4>
            {Object.entries(slotTypeCfg).map(([k, v]: [string, Rec]) => {
              const sd = data.filter(r => r.slotType === k)
              if (sd.length === 0) return null
              const totalCap = sd.reduce((s: number, r: SlotRecord) => s + r.capacity, 0)
              const totalUsed = sd.reduce((s: number, r: SlotRecord) => s + r.usedCapacity, 0)
              const utilPct = Math.round((totalUsed / Math.max(totalCap, 1)) * 100)
              return (
                <div key={k} className="sto-band-card">
                  <div className="flex items-center gap-2 mb-2"><GitBranch className="h-4 w-4" style={{ color: v.color }} /><span className="sto-band-name">{v.label}</span><span className="sto-band-sub">{sd.length} zone(s)</span></div>
                  <div className="sto-band-stats">
                    <div className="sto-band-stat"><span className="sto-band-val text-blue-600">{totalCap}</span><span className="sto-band-lbl">Total Cap</span></div>
                    <div className="sto-band-stat"><span className="sto-band-val text-violet-600">{utilPct}%</span><span className="sto-band-lbl">Utilization</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "optimize" && (
        <div className="sto-anal-view">
          <div className="sto-anal-col">
            <h4 className="sto-anal-title">Utilization by DC</h4>
            {Object.entries(dcCfg).map(([k, v]: [string, Rec]) => {
              const dd = data.filter(r => r.dc === k)
              if (dd.length === 0) return null
              const avgUtil = Math.round(dd.reduce((s: number, r: SlotRecord) => s + r.slotUtilPct, 0) / dd.length)
              const avgTravel = Math.round(dd.reduce((s: number, r: SlotRecord) => s + r.travelDist, 0) / dd.length)
              const needsAction = dd.filter(r => r.status === "needsreslot" || r.status === "overstocked").length
              const utilColor = avgUtil >= 90 ? "#ef4444" : avgUtil >= 70 ? "#10b981" : "#3b82f6"
              return (
                <div key={k} className="sto-band-card">
                  <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4" style={{ color: v.color }} /><span className="sto-band-name">{v.label}</span><span className="sto-band-sub">{dd.length} zone(s)</span></div>
                  <div className="sto-band-stats">
                    <div className="sto-band-stat"><span className="sto-band-val" style={{ color: utilColor }}>{avgUtil}%</span><span className="sto-band-lbl">Avg Util</span></div>
                    <div className="sto-band-stat"><span className="sto-band-val text-blue-600">{avgTravel}m</span><span className="sto-band-lbl">Avg Travel</span></div>
                    <div className="sto-band-stat"><span className="sto-band-val text-amber-600">{needsAction}</span><span className="sto-band-lbl">Needs Action</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="sto-anal-col">
            <h4 className="sto-anal-title">Zones Needing Reslot</h4>
            {data.filter(r => r.status === "needsreslot" || r.status === "overstocked").sort((a: SlotRecord, b: SlotRecord) => b.slotUtilPct - a.slotUtilPct).map(s => {
              const dc = dcCfg[s.dc] as Rec
              const abc = abcCfg[s.abcClass] as Rec
              return (
                <div key={s.id} className="sto-alert-row">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  <span className="sto-alert-name">{s.id} {s.slotZone}</span>
                  <span className="sto-alert-stat">{s.slotUtilPct}%</span>
                  <span className="sto-alert-rooms">{abc.label.split(" - ")[0]} | {dc.label}</span>
                </div>
              )
            })}
            {data.filter(r => r.status === "needsreslot" || r.status === "overstocked").length === 0 && <div className="sto-empty">No zones need reslotting</div>}
            <h4 className="sto-anal-title mt-4">High Travel Zones (&gt;40m)</h4>
            {data.filter(r => r.travelDist > 40).sort((a: SlotRecord, b: SlotRecord) => b.travelDist - a.travelDist).map(s => {
              const dc = dcCfg[s.dc] as Rec
              return (
                <div key={s.id} className="sto-alert-row">
                  <ArrowRight className="h-3 w-3 text-red-500" />
                  <span className="sto-alert-name">{s.id}</span>
                  <span className="sto-alert-stat">{s.travelDist}m</span>
                  <span className="sto-alert-rooms">{dc.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
