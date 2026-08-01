"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Users, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, AlertTriangle, CheckCircle2, Clock, Package,
  TrendingUp, TrendingDown, UserCheck, Wrench, Zap, Target,
  HardHat, Briefcase, Award, Flame, ArrowUpRight, ArrowDownRight
} from "lucide-react"

type Rec = any

interface WorkerRecord {
  id: string; employeeName: string; employeeId: string; dc: string
  department: string; shift: string; tasksCompleted: number
  tasksTarget: number; productivity: number; uph: number
  status: string; overtimeHrs: number; attendance: string
  skillLevel: string; lastActive: string; expanded: boolean
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
  active: { label: "Active", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: Activity },
  break: { label: "On Break", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: Clock },
  overtime: { label: "Overtime", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: Timer },
  absent: { label: "Absent", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: AlertTriangle },
  training: { label: "Training", color: "bg-violet-500", textColor: "text-violet-700 dark:text-violet-400", bgColor: "bg-violet-50 dark:bg-violet-950/30", borderColor: "border-l-violet-500", icon: Briefcase }
}

const deptCfg: Record<string, Rec> = {
  picking: { label: "Picking", color: "bg-blue-500" },
  packing: { label: "Packing", color: "bg-emerald-500" },
  receiving: { label: "Receiving", color: "bg-violet-500" },
  shipping: { label: "Shipping", color: "bg-orange-500" },
  putaway: { label: "Putaway", color: "bg-cyan-500" },
  qc: { label: "Quality Check", color: "bg-amber-500" }
}

const shiftCfg: Record<string, Rec> = {
  morning: { label: "Morning (6AM-2PM)", color: "#f59e0b" },
  afternoon: { label: "Afternoon (2PM-10PM)", color: "#3b82f6" },
  night: { label: "Night (10PM-6AM)", color: "#6366f1" }
}

const skillCfg: Record<string, Rec> = {
  expert: { label: "Expert", color: "bg-emerald-500", stars: 5 },
  senior: { label: "Senior", color: "bg-blue-500", stars: 4 },
  intermediate: { label: "Intermediate", color: "bg-amber-500", stars: 3 },
  junior: { label: "Junior", color: "bg-slate-500", stars: 2 },
  trainee: { label: "Trainee", color: "bg-violet-500", stars: 1 }
}

const rawWorkers: Rec[] = [
  { id: "WRK-01", en: "Rajesh Kumar", ei: "EMP-1001", dc: "dc1", dp: "picking", sh: "morning", tc: 87, tt: 90, pr: 97, uph: 22, st: "active", oh: 0, at: "Present", sk: "expert", la: "11:45 AM", ex: false },
  { id: "WRK-02", en: "Priya Sharma", ei: "EMP-1002", dc: "dc2", dp: "packing", sh: "morning", tc: 95, tt: 100, pr: 95, uph: 28, st: "active", oh: 0, at: "Present", sk: "senior", la: "11:42 AM", ex: false },
  { id: "WRK-03", en: "Suresh Patel", ei: "EMP-1003", dc: "dc3", dp: "receiving", sh: "afternoon", tc: 42, tt: 50, pr: 84, uph: 15, st: "break", oh: 0, at: "Present", sk: "intermediate", la: "05:30 PM", ex: false },
  { id: "WRK-04", en: "Neha Gupta", ei: "EMP-1004", dc: "dc4", dp: "shipping", sh: "afternoon", tc: 60, tt: 60, pr: 100, uph: 18, st: "overtime", oh: 2.5, at: "Present", sk: "senior", la: "08:15 PM", ex: false },
  { id: "WRK-05", en: "Arun Kumar", ei: "EMP-1005", dc: "dc5", dp: "putaway", sh: "morning", tc: 35, tt: 45, pr: 78, uph: 12, st: "active", oh: 0, at: "Present", sk: "junior", la: "11:38 AM", ex: false },
  { id: "WRK-06", en: "Kavitha R", ei: "EMP-1006", dc: "dc6", dp: "qc", sh: "night", tc: 28, tt: 30, pr: 93, uph: 10, st: "active", oh: 0, at: "Present", sk: "expert", la: "02:20 AM", ex: false },
  { id: "WRK-07", en: "Manoj Singh", ei: "EMP-1007", dc: "dc1", dp: "picking", sh: "afternoon", tc: 55, tt: 70, pr: 79, uph: 14, st: "training", oh: 0, at: "Present", sk: "trainee", la: "06:10 PM", ex: false },
  { id: "WRK-08", en: "Deepa Menon", ei: "EMP-1008", dc: "dc2", dp: "packing", sh: "morning", tc: 82, tt: 80, pr: 103, uph: 25, st: "active", oh: 0, at: "Present", sk: "senior", la: "11:50 AM", ex: false },
  { id: "WRK-09", en: "Vikram T", ei: "EMP-1009", dc: "dc3", dp: "receiving", sh: "night", tc: 18, tt: 40, pr: 45, uph: 8, st: "absent", oh: 0, at: "Absent", sk: "junior", la: "--", ex: false },
  { id: "WRK-10", en: "Sneha K", ei: "EMP-1010", dc: "dc4", dp: "shipping", sh: "afternoon", tc: 72, tt: 75, pr: 96, uph: 20, st: "overtime", oh: 1.5, at: "Present", sk: "intermediate", la: "07:45 PM", ex: false }
]

const workers: WorkerRecord[] = rawWorkers.map((r: Rec) => ({
  id: r.id, employeeName: r.en, employeeId: r.ei, dc: r.dc,
  department: r.dp, shift: r.sh, tasksCompleted: r.tc,
  tasksTarget: r.tt, productivity: r.pr, uph: r.uph,
  status: r.st, overtimeHrs: r.oh, attendance: r.at,
  skillLevel: r.sk, lastActive: r.la, expanded: r.ex
}))

const viewTabs = [
  { key: "workers", label: "Worker Roster", icon: Users },
  { key: "departments", label: "Dept Analysis", icon: BarChart3 },
  { key: "shifts", label: "Shift Utilization", icon: Timer }
]

export function LaborProductivityTrackerPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("workers")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<WorkerRecord[]>(workers)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: WorkerRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: WorkerRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.employeeName.toLowerCase().includes(search.toLowerCase()) && !r.employeeId.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.department && r.department !== activeFilters.department) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const active = data.filter(r => r.status === "active").length
    const avgProd = Math.round(data.reduce((s: number, r: WorkerRecord) => s + r.productivity, 0) / Math.max(total, 1))
    const avgUPH = Math.round(data.reduce((s: number, r: WorkerRecord) => s + r.uph, 0) / Math.max(total, 1))
    const totalOT = data.reduce((s: number, r: WorkerRecord) => s + r.overtimeHrs, 0)
    const topPerformer = data.filter(r => r.status !== "absent").sort((a: WorkerRecord, b: WorkerRecord) => b.productivity - a.productivity)[0]
    return { total, active, avgProd, avgUPH, totalOT, topPerformer }
  }, [data])

  return (
    <div className="lpt-root">
      <div className="lpt-header">
        <div className="lpt-header-left">
          <div className="lpt-icon-wrap"><Users className="h-5 w-5 text-orange-600" /></div>
          <div>
            <h3 className="lpt-title">Labor Productivity Tracker</h3>
            <p className="lpt-subtitle">Worker performance, task completion, shift utilization &amp; skill tracking across Indian DCs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="lpt-live-count">{stats.active} Active Now</span>
        </div>
      </div>
      <div className="lpt-stats-grid">
        {[
          { label: "Total Workers", value: String(stats.total), icon: Users, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/40" },
          { label: "Active", value: String(stats.active), icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Avg Productivity", value: stats.avgProd + "%", icon: Target, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Avg UPH", value: String(stats.avgUPH), icon: Zap, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
          { label: "Total OT Hours", value: stats.totalOT.toFixed(1) + "h", icon: Timer, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Top Performer", value: stats.topPerformer ? stats.topPerformer.employeeName.split(" ")[0] : "--", icon: Award, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/40" }
        ].map(s => (
          <div key={s.label} className="lpt-stat-card">
            <div className={cn("lpt-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="lpt-stat-info"><span className="lpt-stat-value">{s.value}</span><span className="lpt-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="lpt-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search worker ID, name, employee..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("lpt-filter-chip", activeFilters.status === k && "lpt-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="lpt-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="lpt-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(deptCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("department", k)} className={cn("lpt-type-chip", activeFilters.department === k && "lpt-type-active")}>
              <span className="lpt-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="lpt-chip-count">{data.filter(r => r.department === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="lpt-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("lpt-view-tab", view === t.key && "lpt-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "workers" && (
        <div className="lpt-grid">
          {filtered.map(w => {
            const sc = statusCfg[w.status] as Rec
            const dc = dcCfg[w.dc] as Rec
            const dp = deptCfg[w.department] as Rec
            const sh = shiftCfg[w.shift] as Rec
            const sk = skillCfg[w.skillLevel] as Rec
            const SIcon = (sc.icon as React.ElementType) || Activity
            const isAbsent = w.status === "absent"
            const prodColor = w.productivity >= 95 ? "#10b981" : w.productivity >= 80 ? "#f59e0b" : "#ef4444"
            const taskProgress = Math.round((w.tasksCompleted / Math.max(w.tasksTarget, 1)) * 100)
            return (
              <div key={w.id} className={cn("lpt-card", `border-l-4 ${sc.borderColor || ""}`, isAbsent && "lpt-card-absent")}>
                <div className="lpt-card-top">
                  <div className="flex items-center gap-2">
                    <span className="lpt-card-id">{w.id}</span>
                    <span className={cn("lpt-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                    {w.overtimeHrs > 0 && <span className="lpt-ot-badge"><Timer className="h-3 w-3" />OT: {w.overtimeHrs}h</span>}
                  </div>
                  <span className="lpt-emp-id"><HardHat className="h-3 w-3" />{w.employeeId}</span>
                </div>
                <div className="lpt-name-row">
                  <span className="lpt-name">{w.employeeName}</span>
                  <span className="lpt-dc" style={{ color: dc.color }}>{dc.label}</span>
                </div>
                <div className="lpt-dept-row">
                  <span className="lpt-dept-badge" style={{ backgroundColor: dp.color + "18", color: dp.color }}>{dp.label}</span>
                  <span className="lpt-shift-badge" style={{ color: sh.color }}><Clock className="h-3 w-3" />{sh.label}</span>
                  <span className="lpt-skill-badge" style={{ backgroundColor: sk.color + "18", color: sk.color }}>
                    <Award className="h-3 w-3" />{sk.label} ({sk.stars}/5)
                  </span>
                </div>
                <div className="lpt-prod-bar-row">
                  <span className="lpt-prod-label">Productivity:</span>
                  <div className="lpt-prod-bar-track"><div className="lpt-prod-bar-fill" style={{ width: Math.min(w.productivity, 110) / 1.1 + "%", backgroundColor: prodColor }} /></div>
                  <span className="lpt-prod-pct" style={{ color: prodColor }}>{w.productivity}%</span>
                </div>
                <div className="lpt-task-bar-row">
                  <span className="lpt-task-label">Tasks:</span>
                  <span className="lpt-task-count">{w.tasksCompleted}/{w.tasksTarget}</span>
                  <div className="lpt-task-bar-track"><div className="lpt-task-bar-fill" style={{ width: taskProgress + "%" }} /></div>
                  <span className="lpt-task-pct">{taskProgress}%</span>
                </div>
                <div className="lpt-metrics-row">
                  <span className="lpt-metric"><Zap className="h-3 w-3" />{w.uph} UPH</span>
                  <span className="lpt-metric"><TrendingUp className="h-3 w-3" />{w.uph >= stats.avgUPH ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}{w.uph >= stats.avgUPH ? "Above" : "Below"} avg</span>
                  <span className="lpt-metric"><Clock className="h-3 w-3" />{w.lastActive}</span>
                </div>
                <button onClick={() => toggleExpand(w.id)} className="lpt-expand-btn">
                  {w.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{w.expanded ? "Hide" : "Details"}</span>
                </button>
                {w.expanded && (
                  <div className="lpt-expanded"><div className="lpt-detail-grid">
                    {[
                      { l: "ID", v: w.id }, { l: "Employee", v: w.employeeName }, { l: "Emp ID", v: w.employeeId },
                      { l: "DC", v: dc.label }, { l: "Department", v: dp.label }, { l: "Shift", v: sh.label },
                      { l: "Tasks Done", v: w.tasksCompleted + "/" + w.tasksTarget }, { l: "UPH", v: String(w.uph) },
                      { l: "Skill", v: sk.label + " (" + sk.stars + "/5)" }, { l: "Last Active", v: w.lastActive }
                    ].map(dd => (
                      <div key={dd.l} className="lpt-detail-item"><span className="lpt-detail-label">{dd.l}</span><span className="lpt-detail-value">{dd.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="lpt-empty">No workers match your filters</div>}
        </div>
      )}

      {view === "departments" && (
        <div className="lpt-anal-view">
          <div className="lpt-anal-col">
            <h4 className="lpt-anal-title">Productivity by Department</h4>
            {Object.entries(deptCfg).map(([k, v]: [string, Rec]) => {
              const dd = data.filter(r => r.department === k)
              if (dd.length === 0) return null
              const avgProd = Math.round(dd.reduce((s: number, r: WorkerRecord) => s + r.productivity, 0) / dd.length)
              const avgUPH = Math.round(dd.reduce((s: number, r: WorkerRecord) => s + r.uph, 0) / dd.length)
              const totalTasks = dd.reduce((s: number, r: WorkerRecord) => s + r.tasksCompleted, 0)
              const prodColor = avgProd >= 95 ? "#10b981" : avgProd >= 80 ? "#f59e0b" : "#ef4444"
              return (
                <div key={k} className="lpt-band-card">
                  <div className="flex items-center gap-2 mb-2"><Wrench className="h-4 w-4" style={{ color: v.color }} /><span className="lpt-band-name">{v.label}</span><span className="lpt-band-sub">{dd.length} worker(s)</span></div>
                  <div className="lpt-band-stats">
                    <div className="lpt-band-stat"><span className="lpt-band-val" style={{ color: prodColor }}>{avgProd}%</span><span className="lpt-band-lbl">Avg Productivity</span></div>
                    <div className="lpt-band-stat"><span className="lpt-band-val text-blue-600">{avgUPH}</span><span className="lpt-band-lbl">Avg UPH</span></div>
                    <div className="lpt-band-stat"><span className="lpt-band-val text-violet-600">{totalTasks}</span><span className="lpt-band-lbl">Tasks Done</span></div>
                  </div>
                  <div className="lpt-prod-bar-track mt-2"><div className="lpt-prod-bar-fill" style={{ width: avgProd / 1.1 + "%", backgroundColor: prodColor }} /></div>
                </div>
              )
            })}
          </div>
          <div className="lpt-anal-col">
            <h4 className="lpt-anal-title">Low Performers (&lt;80%)</h4>
            {data.filter(r => r.productivity < 80 && r.status !== "absent").sort((a: WorkerRecord, b: WorkerRecord) => a.productivity - b.productivity).map(w => {
              const dc = dcCfg[w.dc] as Rec
              const dp = deptCfg[w.department] as Rec
              return (
                <div key={w.id} className="lpt-alert-row">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="lpt-alert-name">{w.id} {w.employeeName}</span>
                  <span className="lpt-alert-stat">{w.productivity}%</span>
                  <span className="lpt-alert-rooms">{dp.label} | {dc.label}</span>
                </div>
              )
            })}
            {data.filter(r => r.productivity < 80 && r.status !== "absent").length === 0 && <div className="lpt-empty">All workers above 80% productivity</div>}
            <h4 className="lpt-anal-title mt-4">Overtime Workers</h4>
            {data.filter(r => r.overtimeHrs > 0).sort((a: WorkerRecord, b: WorkerRecord) => b.overtimeHrs - a.overtimeHrs).map(w => {
              const dc = dcCfg[w.dc] as Rec
              return (
                <div key={w.id} className="lpt-alert-row">
                  <Timer className="h-3 w-3 text-amber-500" />
                  <span className="lpt-alert-name">{w.employeeName}</span>
                  <span className="lpt-alert-stat">{w.overtimeHrs}h OT</span>
                  <span className="lpt-alert-rooms">{dc.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "shifts" && (
        <div className="lpt-anal-view">
          <div className="lpt-anal-col">
            <h4 className="lpt-anal-title">Shift Utilization</h4>
            {Object.entries(shiftCfg).map(([k, v]: [string, Rec]) => {
              const sd = data.filter(r => r.shift === k)
              if (sd.length === 0) return null
              const active = sd.filter(r => r.status === "active").length
              const avgProd = Math.round(sd.reduce((s: number, r: WorkerRecord) => s + r.productivity, 0) / sd.length)
              const totalTasks = sd.reduce((s: number, r: WorkerRecord) => s + r.tasksCompleted, 0)
              const utilRate = Math.round((active / Math.max(sd.length, 1)) * 100)
              return (
                <div key={k} className="lpt-band-card">
                  <div className="flex items-center gap-2 mb-2"><Flame className="h-4 w-4" style={{ color: v.color }} /><span className="lpt-band-name">{v.label}</span><span className="lpt-band-sub">{sd.length} worker(s)</span></div>
                  <div className="lpt-band-stats">
                    <div className="lpt-band-stat"><span className="lpt-band-val" style={{ color: v.color }}>{utilRate}%</span><span className="lpt-band-lbl">Utilization</span></div>
                    <div className="lpt-band-stat"><span className="lpt-band-val text-emerald-600">{avgProd}%</span><span className="lpt-band-lbl">Avg Prod</span></div>
                    <div className="lpt-band-stat"><span className="lpt-band-val text-blue-600">{totalTasks}</span><span className="lpt-band-lbl">Tasks</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="lpt-anal-col">
            <h4 className="lpt-anal-title">Skill Distribution</h4>
            {Object.entries(skillCfg).map(([k, v]: [string, Rec]) => {
              const skd = data.filter(r => r.skillLevel === k)
              if (skd.length === 0) return null
              const avgProd = Math.round(skd.reduce((s: number, r: WorkerRecord) => s + r.productivity, 0) / skd.length)
              return (
                <div key={k} className="lpt-band-card">
                  <div className="flex items-center gap-2 mb-2"><Award className="h-4 w-4" style={{ color: v.color }} /><span className="lpt-band-name">{v.label}</span><span className="lpt-band-sub">{skd.length} worker(s)</span></div>
                  <div className="lpt-band-stats">
                    <div className="lpt-band-stat"><span className="lpt-band-val" style={{ color: v.color }}>{v.stars}/5</span><span className="lpt-band-lbl">Skill Level</span></div>
                    <div className="lpt-band-stat"><span className="lpt-band-val text-blue-600">{avgProd}%</span><span className="lpt-band-lbl">Avg Productivity</span></div>
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
