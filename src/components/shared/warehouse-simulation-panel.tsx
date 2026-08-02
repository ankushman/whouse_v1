"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  FlaskConical, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  Timer, AlertTriangle, CheckCircle2, Clock, Package,
  TrendingUp, TrendingDown, Target, Zap, Box,
  ArrowRight, CircleDot, Warehouse, Gauge, GitBranch,
  AlertOctagon, Settings, Play, BarChart2
} from "lucide-react"

type Rec = any

interface SimRecord {
  id: string; scenarioName: string; dc: string; scenarioType: string
  currentThroughput: number; projectedThroughput: number
  improvement: number; bottleneck: string; utilizationPct: number
  resourceGap: number; costImpact: string; probability: number
  status: string; lastRun: string; runDuration: string; expanded: boolean
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
  completed: { label: "Completed", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: CheckCircle2 },
  running: { label: "Running", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: Play },
  queued: { label: "Queued", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: Clock },
  failed: { label: "Failed", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: AlertOctagon },
  draft: { label: "Draft", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: Settings }
}

const typeCfg: Record<string, Rec> = {
  capacity: { label: "Capacity Expansion", color: "bg-blue-500" },
  peakseason: { label: "Peak Season Surge", color: "bg-orange-500" },
  automation: { label: "Automation ROI", color: "bg-violet-500" },
  layout: { label: "Layout Change", color: "bg-emerald-500" },
  disruption: { label: "Disruption Test", color: "bg-red-500" },
  staffing: { label: "Staffing Model", color: "bg-cyan-500" }
}

const bottleneckCfg: Record<string, Rec> = {
  receiving: { label: "Receiving Dock", color: "#3b82f6" },
  picking: { label: "Picking Zone", color: "#8b5cf6" },
  packing: { label: "Packing Station", color: "#f59e0b" },
  shipping: { label: "Shipping Dock", color: "#10b981" },
  storage: { label: "Storage Area", color: "#ef4444" },
  none: { label: "No Bottleneck", color: "#10b981" }
}

const rawSims: Rec[] = [
  { id: "SIM-01", sn: "Diwali Peak Surge +30%", dc: "dc1", st: "peakseason", ct: 2500, pt: 3250, im: 30.0, bn: "receiving", up: 92, rg: 12, ci: "+\u20b98.5L", pr: 85, st2: "completed", lr: "02 Aug 2026", rd: "4m 32s", ex: false },
  { id: "SIM-02", sn: "AMR Fleet Deployment", dc: "dc2", st: "automation", ct: 1800, pt: 2400, im: 33.3, bn: "picking", up: 78, rg: 8, ci: "+\u20b922L (ROI 18mo)", pr: 72, st2: "completed", lr: "01 Aug 2026", rd: "8m 15s", ex: false },
  { id: "SIM-03", sn: "New Mezzanine Addition", dc: "dc3", st: "capacity", ct: 3000, pt: 4200, im: 40.0, bn: "storage", up: 95, rg: 15, ci: "+\u20b935L CapEx", pr: 68, st2: "completed", lr: "31 Jul 2026", rd: "12m 08s", ex: false },
  { id: "SIM-04", sn: "Holi Season +20%", dc: "dc4", st: "peakseason", ct: 2000, pt: 2600, im: 30.0, bn: "packing", up: 88, rg: 6, ci: "+\u20b94.2L", pr: 90, st2: "running", lr: "02 Aug 2026", rd: "2m 45s", ex: false },
  { id: "SIM-05", sn: "Conveyor Belt Upgrade", dc: "dc5", st: "layout", ct: 1500, pt: 1950, im: 30.0, bn: "shipping", up: 72, rg: 4, ci: "+\u20b912L", pr: 80, st2: "completed", lr: "30 Jul 2026", rd: "6m 22s", ex: false },
  { id: "SIM-06", sn: "Fire Drill Simulation", dc: "dc6", st: "disruption", ct: 2200, pt: 800, im: -63.6, bn: "receiving", up: 30, rg: 0, ci: "-\u20b915L/day", pr: 15, st2: "completed", lr: "29 Jul 2026", rd: "3m 10s", ex: false },
  { id: "SIM-07", sn: "Night Shift Addition", dc: "dc1", st: "staffing", ct: 2500, pt: 3800, im: 52.0, bn: "picking", up: 85, rg: 20, ci: "+\u20b96.8L/mo", pr: 88, st2: "queued", lr: "--", rd: "--", ex: false },
  { id: "SIM-08", sn: "Cross-Dock Flow Test", dc: "dc2", st: "layout", ct: 2800, pt: 3500, im: 25.0, bn: "none", up: 80, rg: 5, ci: "+\u20b97.5L", pr: 75, st2: "completed", lr: "28 Jul 2026", rd: "5m 48s", ex: false },
  { id: "SIM-09", sn: "Monsoon Disruption", dc: "dc3", st: "disruption", ct: 3000, pt: 1200, im: -60.0, bn: "shipping", up: 25, rg: 0, ci: "-\u20b922L/day", pr: 20, st2: "draft", lr: "--", rd: "--", ex: false },
  { id: "SIM-10", sn: "Put-to-Light System", dc: "dc4", st: "automation", ct: 1800, pt: 2800, im: 55.6, bn: "picking", up: 82, rg: 10, ci: "+\u20b918L (ROI 14mo)", pr: 70, st2: "failed", lr: "01 Aug 2026", rd: "0m 45s", ex: false }
]

const sims: SimRecord[] = rawSims.map((r: Rec) => ({
  id: r.id, scenarioName: r.sn, dc: r.dc, scenarioType: r.st,
  currentThroughput: r.ct, projectedThroughput: r.pt,
  improvement: r.im, bottleneck: r.bn, utilizationPct: r.up,
  resourceGap: r.rg, costImpact: r.ci, probability: r.pr,
  status: r.st2, lastRun: r.lr, runDuration: r.rd, expanded: r.ex
}))

const viewTabs = [
  { key: "simulations", label: "Scenarios", icon: FlaskConical },
  { key: "throughput", label: "Throughput", icon: BarChart2 },
  { key: "bottleneck", label: "Bottleneck Analysis", icon: AlertTriangle }
]

export function WarehouseSimulationPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("simulations")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<SimRecord[]>(sims)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: SimRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: SimRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.scenarioName.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.scenarioType && r.scenarioType !== activeFilters.scenarioType) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const completed = data.filter(r => r.status === "completed").length
    const avgImprove = (data.filter(r => r.improvement > 0).reduce((s: number, r: SimRecord) => s + r.improvement, 0) / Math.max(data.filter(r => r.improvement > 0).length, 1)).toFixed(1)
    const running = data.filter(r => r.status === "running").length
    const failed = data.filter(r => r.status === "failed").length
    return { total, completed, avgImprove, running, failed }
  }, [data])

  return (
    <div className="wsm-root">
      <div className="wsm-header">
        <div className="wsm-header-left">
          <div className="wsm-icon-wrap"><FlaskConical className="h-5 w-5 text-fuchsia-600" /></div>
          <div>
            <h3 className="wsm-title">Warehouse Simulation</h3>
            <p className="wsm-subtitle">What-if scenario modeling, throughput simulation, capacity planning &amp; bottleneck analysis for Indian DCs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="wsm-live-count">{stats.running} Running</span>
        </div>
      </div>
      <div className="wsm-stats-grid">
        {[
          { label: "Scenarios", value: String(stats.total), icon: FlaskConical, color: "text-fuchsia-600", bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40" },
          { label: "Completed", value: String(stats.completed), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Avg Uplift", value: stats.avgImprove + "%", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Running", value: String(stats.running), icon: Play, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
          { label: "Failed", value: String(stats.failed), icon: AlertOctagon, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
          { label: "Queued", value: String(data.filter(r => r.status === "queued").length), icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" }
        ].map(s => (
          <div key={s.label} className="wsm-stat-card">
            <div className={cn("wsm-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="wsm-stat-info"><span className="wsm-stat-value">{s.value}</span><span className="wsm-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="wsm-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search scenario ID, name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("wsm-filter-chip", activeFilters.status === k && "wsm-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="wsm-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="wsm-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(typeCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("scenarioType", k)} className={cn("wsm-type-chip", activeFilters.scenarioType === k && "wsm-type-active")}>
              <span className="wsm-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="wsm-chip-count">{data.filter(r => r.scenarioType === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="wsm-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("wsm-view-tab", view === t.key && "wsm-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "simulations" && (
        <div className="wsm-grid">
          {filtered.map(s => {
            const sc = statusCfg[s.status] as Rec
            const dc = dcCfg[s.dc] as Rec
            const tp = typeCfg[s.scenarioType] as Rec
            const bn = bottleneckCfg[s.bottleneck] as Rec
            const SIcon = (sc.icon as React.ElementType) || FlaskConical
            const isFailed = s.status === "failed"
            const isRunning = s.status === "running"
            const impColor = s.improvement >= 30 ? "#10b981" : s.improvement >= 0 ? "#3b82f6" : "#ef4444"
            const probColor = s.probability >= 80 ? "#10b981" : s.probability >= 50 ? "#f59e0b" : "#ef4444"
            const utilColor = s.utilizationPct >= 90 ? "#ef4444" : s.utilizationPct >= 70 ? "#10b981" : "#3b82f6"
            return (
              <div key={s.id} className={cn("wsm-card", `border-l-4 ${sc.borderColor || ""}`, isFailed && "wsm-card-failed", isRunning && "wsm-card-running")}>
                <div className="wsm-card-top">
                  <div className="flex items-center gap-2">
                    <span className="wsm-card-id">{s.id}</span>
                    <span className={cn("wsm-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                    <span className="wsm-type-badge" style={{ backgroundColor: tp.color + "18", color: tp.color }}>{tp.label}</span>
                  </div>
                  <span className="wsm-cost">{s.costImpact}</span>
                </div>
                <div className="wsm-name-row">
                  <span className="wsm-name"><FlaskConical className="h-3.5 w-3.5" />{s.scenarioName}</span>
                  <span className="wsm-dc" style={{ color: dc.color }}>{dc.label}</span>
                </div>
                <div className="wsm-throughput-row">
                  <div className="wsm-tp-block"><span className="wsm-tp-label">Current</span><span className="wsm-tp-val">{s.currentThroughput.toLocaleString()}/hr</span></div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <div className="wsm-tp-block"><span className="wsm-tp-label">Projected</span><span className="wsm-tp-val" style={{ color: impColor }}>{s.projectedThroughput.toLocaleString()}/hr</span></div>
                  <span className="wsm-imp-badge" style={{ color: impColor }}>{s.improvement > 0 ? "+" : ""}{s.improvement}%</span>
                </div>
                <div className="wsm-util-bar-row">
                  <span className="wsm-util-label">Utilization:</span>
                  <div className="wsm-util-bar-track"><div className="wsm-util-bar-fill" style={{ width: s.utilizationPct + "%", backgroundColor: utilColor }} /></div>
                  <span className="wsm-util-pct" style={{ color: utilColor }}>{s.utilizationPct}%</span>
                </div>
                <div className="wsm-conf-row">
                  <span className="wsm-conf-label">Success Probability:</span>
                  <div className="wsm-conf-bar-track"><div className="wsm-conf-bar-fill" style={{ width: s.probability + "%", backgroundColor: probColor }} /></div>
                  <span className="wsm-conf-pct" style={{ color: probColor }}>{s.probability}%</span>
                </div>
                <div className="wsm-metrics-row">
                  <span className="wsm-metric"><AlertTriangle className="h-3 w-3" style={{ color: bn.color }} />{bn.label}</span>
                  <span className="wsm-metric"><Gauge className="h-3 w-3" />Gap: {s.resourceGap}</span>
                  <span className="wsm-metric"><Clock className="h-3 w-3" />{s.lastRun !== "--" ? s.runDuration : "Not run"}</span>
                </div>
                {isFailed && <span className="wsm-fail-alert"><AlertOctagon className="h-3 w-3" />Simulation failed at t=0m 45s — check constraints</span>}
                {isRunning && <span className="wsm-run-indicator"><Play className="h-3 w-3" />Simulating... {s.runDuration} elapsed</span>}
                <button onClick={() => toggleExpand(s.id)} className="wsm-expand-btn">
                  {s.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{s.expanded ? "Hide" : "Scenario Details"}</span>
                </button>
                {s.expanded && (
                  <div className="wsm-expanded"><div className="wsm-detail-grid">
                    {[
                      { l: "ID", v: s.id }, { l: "Scenario", v: s.scenarioName }, { l: "DC", v: dc.label },
                      { l: "Type", v: tp.label }, { l: "Current TP", v: s.currentThroughput + "/hr" },
                      { l: "Projected TP", v: s.projectedThroughput + "/hr" }, { l: "Improvement", v: s.improvement + "%" },
                      { l: "Bottleneck", v: bn.label }, { l: "Utilization", v: s.utilizationPct + "%" },
                      { l: "Resource Gap", v: String(s.resourceGap) }, { l: "Cost Impact", v: s.costImpact },
                      { l: "Probability", v: s.probability + "%" }
                    ].map(dd => (
                      <div key={dd.l} className="wsm-detail-item"><span className="wsm-detail-label">{dd.l}</span><span className="wsm-detail-value">{dd.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="wsm-empty">No scenarios match your filters</div>}
        </div>
      )}

      {view === "throughput" && (
        <div className="wsm-anal-view">
          <div className="wsm-anal-col">
            <h4 className="wsm-anal-title">Throughput by Scenario Type</h4>
            {Object.entries(typeCfg).map(([k, v]: [string, Rec]) => {
              const td = data.filter(r => r.scenarioType === k)
              if (td.length === 0) return null
              const avgCurrent = Math.round(td.reduce((s: number, r: SimRecord) => s + r.currentThroughput, 0) / td.length)
              const avgProjected = Math.round(td.reduce((s: number, r: SimRecord) => s + r.projectedThroughput, 0) / td.length)
              const avgImprove = ((avgProjected - avgCurrent) / Math.max(avgCurrent, 1) * 100).toFixed(1)
              const impNum = parseFloat(avgImprove)
              const impColor = impNum >= 30 ? "#10b981" : impNum >= 0 ? "#3b82f6" : "#ef4444"
              return (
                <div key={k} className="wsm-band-card">
                  <div className="flex items-center gap-2 mb-2"><GitBranch className="h-4 w-4" style={{ color: v.color }} /><span className="wsm-band-name">{v.label}</span><span className="wsm-band-sub">{td.length} scenario(s)</span></div>
                  <div className="wsm-band-stats">
                    <div className="wsm-band-stat"><span className="wsm-band-val text-blue-600">{avgCurrent}/hr</span><span className="wsm-band-lbl">Current Avg</span></div>
                    <div className="wsm-band-stat"><span className="wsm-band-val" style={{ color: impColor }}>{avgProjected}/hr</span><span className="wsm-band-lbl">Projected Avg</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="wsm-anal-col">
            <h4 className="wsm-anal-title">Best Improvement Scenarios</h4>
            {data.filter(r => r.improvement > 0 && r.status === "completed").sort((a: SimRecord, b: SimRecord) => b.improvement - a.improvement).slice(0, 5).map(s => {
              const dc = dcCfg[s.dc] as Rec
              return (
                <div key={s.id} className="wsm-alert-row">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="wsm-alert-name">{s.scenarioName}</span>
                  <span className="wsm-alert-stat">+{s.improvement}%</span>
                  <span className="wsm-alert-rooms">{dc.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "bottleneck" && (
        <div className="wsm-anal-view">
          <div className="wsm-anal-col">
            <h4 className="wsm-anal-title">Bottleneck Distribution</h4>
            {Object.entries(bottleneckCfg).map(([k, v]: [string, Rec]) => {
              const bd = data.filter(r => r.bottleneck === k)
              if (bd.length === 0) return null
              const avgUtil = Math.round(bd.reduce((s: number, r: SimRecord) => s + r.utilizationPct, 0) / bd.length)
              return (
                <div key={k} className="wsm-band-card">
                  <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4" style={{ color: v.color }} /><span className="wsm-band-name">{v.label}</span><span className="wsm-band-sub">{bd.length} scenario(s)</span></div>
                  <div className="wsm-band-stats">
                    <div className="wsm-band-stat"><span className="wsm-band-val" style={{ color: v.color }}>{bd.length}</span><span className="wsm-band-lbl">Scenarios</span></div>
                    <div className="wsm-band-stat"><span className="wsm-band-val text-blue-600">{avgUtil}%</span><span className="wsm-band-lbl">Avg Utilization</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="wsm-anal-col">
            <h4 className="wsm-anal-title">Failed / Disruption Scenarios</h4>
            {data.filter(r => r.status === "failed" || r.improvement < 0).sort((a: SimRecord, b: SimRecord) => a.improvement - b.improvement).map(s => {
              const dc = dcCfg[s.dc] as Rec
              const bn = bottleneckCfg[s.bottleneck] as Rec
              return (
                <div key={s.id} className="wsm-alert-row">
                  <AlertOctagon className="h-3 w-3 text-red-500" />
                  <span className="wsm-alert-name">{s.id} {s.scenarioName}</span>
                  <span className="wsm-alert-stat">{s.improvement}%</span>
                  <span className="wsm-alert-rooms">{bn.label} | {dc.label}</span>
                </div>
              )
            })}
            {data.filter(r => r.status === "failed" || r.improvement < 0).length === 0 && <div className="wsm-empty">No failed scenarios</div>}
          </div>
        </div>
      )}
    </div>
  )
}
