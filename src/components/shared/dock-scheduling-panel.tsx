"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Anchor, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, AlertTriangle, CheckCircle2, Clock, Package,
  Truck, ArrowRight, BoxSelect, DoorOpen, Calendar, Gauge, Users
} from "lucide-react"

type Rec = any

interface DockRecord {
  id: string; dockName: string; dc: string; doorType: string; baySize: string
  carrier: string; vehicleReg: string; appointmentTime: string; actualArrival: string
  status: string; loadType: string; palletCount: number; estimatedDuration: string
  dockAssignment: string; operator: string; expanded: boolean
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
  loading: { label: "Loading", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: Package },
  unloading: { label: "Unloading", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: BoxSelect },
  waiting: { label: "Waiting", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: Clock },
  available: { label: "Available", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: DoorOpen },
  maintenance: { label: "Maintenance", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: AlertTriangle }
}

const doorCfg: Record<string, Rec> = {
  inbound: { label: "Inbound", color: "bg-emerald-500" },
  outbound: { label: "Outbound", color: "bg-blue-500" },
  crossdock: { label: "Cross-Dock", color: "bg-violet-500" },
  staging: { label: "Staging", color: "bg-orange-500" }
}

const rawDocks: Rec[] = [
  { id: "DSK-01", dn: "Door 01-A", dc: "dc1", dt: "inbound", bs: "40FT", cr: "TCI Express", vr: "MH-12-AB-9987", at: "02 Aug 07:00", aa: "02 Aug 07:25", st: "unloading", lt: "Inbound Pallets", pc: 48, ed: "90 min", da: "Bay A1", op: "Anil Sharma", ex: false },
  { id: "DSK-02", dn: "Door 02-B", dc: "dc2", dt: "outbound", bs: "20FT", cr: "Delhivery", vr: "DL-04-CD-3344", at: "02 Aug 08:30", aa: "02 Aug 09:10", st: "waiting", lt: "Outbound Cartons", pc: 120, ed: "60 min", da: "Bay B2", op: "Rahul Verma", ex: false },
  { id: "DSK-03", dn: "Door 03-C", dc: "dc3", dt: "crossdock", bs: "40FT", cr: "Ekart Logistics", vr: "KA-01-EF-5566", at: "02 Aug 09:00", aa: "02 Aug 09:00", st: "loading", lt: "Cross-Dock Sort", pc: 72, ed: "45 min", da: "Bay C1", op: "Kumar Swamy", ex: false },
  { id: "DSK-04", dn: "Door 04-A", dc: "dc4", dt: "inbound", bs: "40HC", cr: "BlueDart", vr: "TN-09-GH-7788", at: "02 Aug 06:00", aa: "02 Aug 05:45", st: "unloading", lt: "E-commerce Parcels", pc: 200, ed: "120 min", da: "Bay A2", op: "Selvam K", ex: false },
  { id: "DSK-05", dn: "Door 05-D", dc: "dc5", dt: "outbound", bs: "20FT", cr: "Rivigo", vr: "WB-06-IJ-1122", at: "02 Aug 10:00", aa: "\u2014", st: "available", lt: "\u2014", pc: 0, ed: "\u2014", da: "Bay D1", op: "\u2014", ex: false },
  { id: "DSK-06", dn: "Door 06-B", dc: "dc6", dt: "inbound", bs: "40FT", cr: "Safexpress", vr: "TS-08-KL-3344", at: "01 Aug 23:00", aa: "01 Aug 22:50", st: "loading", lt: "Raw Materials", pc: 36, ed: "75 min", da: "Bay B3", op: "Suresh Reddy", ex: false },
  { id: "DSK-07", dn: "Door 07-C", dc: "dc1", dt: "staging", bs: "40FT", cr: "VRL Logistics", vr: "MH-14-MN-5566", at: "02 Aug 11:00", aa: "02 Aug 12:30", st: "waiting", lt: "Staging Hold", pc: 60, ed: "90 min", da: "Bay C2", op: "Prasad M", ex: false },
  { id: "DSK-08", dn: "Door 08-A", dc: "dc2", dt: "outbound", bs: "20FT", cr: "DTDC", vr: "DL-01-PQ-7788", at: "02 Aug 12:00", aa: "\u2014", st: "available", lt: "\u2014", pc: 0, ed: "\u2014", da: "Bay A3", op: "\u2014", ex: false },
  { id: "DSK-09", dn: "Door 09-D", dc: "dc3", dt: "inbound", bs: "40HC", cr: "DHL Express", vr: "KA-05-RS-9900", at: "01 Aug 18:00", aa: "01 Aug 17:40", st: "maintenance", lt: "\u2014", pc: 0, ed: "\u2014", da: "Under Repair", op: "Facilities Team", ex: false },
  { id: "DSK-10", dn: "Door 10-B", dc: "dc4", dt: "crossdock", bs: "40FT", cr: "Ecom Express", vr: "TN-01-TU-2233", at: "02 Aug 08:00", aa: "02 Aug 08:15", st: "loading", lt: "Sorted Parcels", pc: 156, ed: "50 min", da: "Bay B1", op: "Murugan S", ex: false }
]

const docks: DockRecord[] = rawDocks.map((r: Rec) => ({
  id: r.id, dockName: r.dn, dc: r.dc, doorType: r.dt, baySize: r.bs,
  carrier: r.cr, vehicleReg: r.vr, appointmentTime: r.at, actualArrival: r.aa,
  status: r.st, loadType: r.lt, palletCount: r.pc, estimatedDuration: r.ed,
  dockAssignment: r.da, operator: r.op, expanded: r.ex
}))

const viewTabs = [
  { key: "docks", label: "Dock Doors", icon: DoorOpen },
  { key: "schedule", label: "Schedule Timeline", icon: Calendar },
  { key: "carriers", label: "Carrier Analytics", icon: BarChart3 }
]

export function DockSchedulingPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("docks")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<DockRecord[]>(docks)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: DockRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: DockRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.dockName.toLowerCase().includes(search.toLowerCase()) && !r.carrier.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.doorType && r.doorType !== activeFilters.doorType) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const active = data.filter(r => r.status === "loading" || r.status === "unloading").length
    const waiting = data.filter(r => r.status === "waiting").length
    const available = data.filter(r => r.status === "available").length
    const totalPallets = data.reduce((s: number, r: DockRecord) => s + r.palletCount, 0)
    const carriers = new Set(data.filter(r => r.status !== "available" && r.status !== "maintenance").map(r => r.carrier)).size
    return { total, active, waiting, available, totalPallets, carriers }
  }, [data])

  return (
    <div className="dsk-root">
      <div className="dsk-header">
        <div className="dsk-header-left">
          <div className="dsk-icon-wrap"><Anchor className="h-5 w-5 text-teal-600" /></div>
          <div>
            <h3 className="dsk-title">Dock Scheduling</h3>
            <p className="dsk-subtitle">Berth allocation, trailer queue &amp; loading/unloading appointment management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="dsk-live-count">{stats.active} Active Doors</span>
        </div>
      </div>
      <div className="dsk-stats-grid">
        {[
          { label: "Total Doors", value: String(stats.total), icon: DoorOpen, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/40" },
          { label: "Active", value: String(stats.active), icon: Gauge, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Waiting", value: String(stats.waiting), icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Available", value: String(stats.available), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Pallets", value: String(stats.totalPallets), icon: Package, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
          { label: "Carriers", value: String(stats.carriers), icon: Truck, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/40" }
        ].map(s => (
          <div key={s.label} className="dsk-stat-card">
            <div className={cn("dsk-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="dsk-stat-info"><span className="dsk-stat-value">{s.value}</span><span className="dsk-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="dsk-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search dock, carrier, vehicle..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("dsk-filter-chip", activeFilters.status === k && "dsk-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="dsk-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="dsk-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(doorCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("doorType", k)} className={cn("dsk-type-chip", activeFilters.doorType === k && "dsk-type-active")}>
              <span className="dsk-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="dsk-chip-count">{data.filter(r => r.doorType === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="dsk-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("dsk-view-tab", view === t.key && "dsk-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "docks" && (
        <div className="dsk-grid">
          {filtered.map(d => {
            const sc = statusCfg[d.status] as Rec
            const dc = dcCfg[d.dc] as Rec
            const tc = doorCfg[d.doorType] as Rec
            const SIcon = (sc.icon as React.ElementType) || CheckCircle2
            const isWaiting = d.status === "waiting"
            const isMaint = d.status === "maintenance"
            return (
              <div key={d.id} className={cn("dsk-card", `border-l-4 ${sc.borderColor || ""}`, isWaiting && "dsk-card-waiting", isMaint && "dsk-card-maint")}>
                <div className="dsk-card-top">
                  <div className="flex items-center gap-2">
                    <span className="dsk-card-id">{d.id}</span>
                    <span className="dsk-dock-badge"><DoorOpen className="h-3 w-3" />{d.dockName}</span>
                    <span className={cn("dsk-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                  </div>
                  <span className="dsk-type-badge" style={{ backgroundColor: tc.color + "18", color: tc.color }}>{tc.label}</span>
                </div>
                <div className="dsk-dc-row">
                  <span className="dsk-dc" style={{ color: dc.color }}>{dc.label}</span>
                  <span className="dsk-bay"><BoxSelect className="h-3 w-3" />{d.baySize} | {d.dockAssignment}</span>
                </div>
                {d.status !== "available" && d.status !== "maintenance" && (
                  <>
                    <div className="dsk-carrier-row">
                      <span className="dsk-carrier"><Truck className="h-3 w-3" />{d.carrier}</span>
                      <span className="dsk-reg">{d.vehicleReg}</span>
                    </div>
                    <div className="dsk-metrics-row">
                      <span className="dsk-metric"><Package className="h-3 w-3" />{d.palletCount} pallets</span>
                      <span className="dsk-metric"><Timer className="h-3 w-3" />{d.estimatedDuration}</span>
                      <span className="dsk-metric"><Users className="h-3 w-3" />{d.operator}</span>
                      <span className="dsk-metric"><BoxSelect className="h-3 w-3" />{d.loadType}</span>
                    </div>
                  </>
                )}
                <div className="dsk-time-row">
                  <span className="dsk-time-metric"><Calendar className="h-3 w-3" />Appt: {d.appointmentTime}</span>
                  {d.actualArrival !== "\u2014" && <span className="dsk-time-metric"><Clock className="h-3 w-3" />Arrived: {d.actualArrival}</span>}
                  {isWaiting && <span className="dsk-delay-tag"><AlertTriangle className="h-3 w-3" />In Queue</span>}
                  {isMaint && <span className="dsk-delay-tag"><AlertTriangle className="h-3 w-3" />Under Repair</span>}
                </div>
                <button onClick={() => toggleExpand(d.id)} className="dsk-expand-btn">
                  {d.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{d.expanded ? "Hide" : "Details"}</span>
                </button>
                {d.expanded && (
                  <div className="dsk-expanded"><div className="dsk-detail-grid">
                    {[
                      { l: "ID", v: d.id }, { l: "Door", v: d.dockName }, { l: "DC", v: dc.label },
                      { l: "Door Type", v: tc.label }, { l: "Bay Size", v: d.baySize }, { l: "Carrier", v: d.carrier },
                      { l: "Vehicle", v: d.vehicleReg }, { l: "Operator", v: d.operator }
                    ].map(dd => (
                      <div key={dd.l} className="dsk-detail-item"><span className="dsk-detail-label">{dd.l}</span><span className="dsk-detail-value">{dd.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="dsk-empty">No dock doors match your filters</div>}
        </div>
      )}

      {view === "schedule" && (
        <div className="dsk-anal-view">
          <div className="dsk-anal-col">
            <h4 className="dsk-anal-title">Today&apos;s Appointment Queue</h4>
            {data.filter(r => r.status !== "available" && r.status !== "maintenance").sort((a: DockRecord, b: DockRecord) => a.appointmentTime.localeCompare(b.appointmentTime)).map(d => {
              const sc = statusCfg[d.status] as Rec
              const dc = dcCfg[d.dc] as Rec
              return (
                <div key={d.id} className="dsk-sched-row">
                  <div className="dsk-sched-time">{d.appointmentTime}</div>
                  <div className="dsk-sched-body">
                    <span className="dsk-sched-id">{d.id}</span>
                    <span className="dsk-sched-carrier">{d.carrier}</span>
                    <span className="dsk-sched-dc" style={{ color: dc.color }}>{dc.label}</span>
                  </div>
                  <span className={cn("dsk-sched-status", sc.textColor)}>{sc.label}</span>
                </div>
              )
            })}
          </div>
          <div className="dsk-anal-col">
            <h4 className="dsk-anal-title">Door Utilization by DC</h4>
            {Object.entries(dcCfg).map(([k, v]: [string, Rec]) => {
              const dd = data.filter(r => r.dc === k)
              if (dd.length === 0) return null
              const active = dd.filter(r => r.status === "loading" || r.status === "unloading").length
              const util = Math.round((active / Math.max(dd.length, 1)) * 100)
              const utilColor = util > 75 ? "#10b981" : util > 40 ? "#f59e0b" : "#ef4444"
              return (
                <div key={k} className="dsk-band-card">
                  <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4" style={{ color: v.color }} /><span className="dsk-band-name">{v.label}</span><span className="dsk-band-sub">{dd.length} doors</span></div>
                  <div className="dsk-band-stats">
                    <div className="dsk-band-stat"><span className="dsk-band-val text-blue-600">{active}</span><span className="dsk-band-lbl">Active</span></div>
                    <div className="dsk-band-stat"><span className="dsk-band-val" style={{ color: utilColor }}>{util}%</span><span className="dsk-band-lbl">Utilization</span></div>
                  </div>
                  <div className="dsk-util-bar-track mt-2"><div className="dsk-util-bar-fill" style={{ width: util + "%", backgroundColor: utilColor }} /></div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "carriers" && (
        <div className="dsk-anal-view">
          <div className="dsk-anal-col">
            <h4 className="dsk-anal-title">Carrier Dock Usage</h4>
            {Array.from(new Set(data.filter(r => r.status !== "available" && r.status !== "maintenance").map(r => r.carrier))).sort().map(cr => {
              const cd = data.filter(r => r.carrier === cr)
              return (
                <div key={cr} className="dsk-band-card">
                  <div className="flex items-center gap-2 mb-2"><Truck className="h-4 w-4 text-teal-500" /><span className="dsk-band-name">{cr}</span><span className="dsk-band-sub">{cd.length} appointment(s)</span></div>
                  <div className="dsk-band-stats">
                    <div className="dsk-band-stat"><span className="dsk-band-val text-blue-600">{cd.reduce((s: number, r: DockRecord) => s + r.palletCount, 0)}</span><span className="dsk-band-lbl">Pallets</span></div>
                    <div className="dsk-band-stat"><span className="dsk-band-val text-amber-600">{cd.filter(r => r.status === "waiting").length}</span><span className="dsk-band-lbl">Waiting</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="dsk-anal-col">
            <h4 className="dsk-anal-title">Waiting Queue</h4>
            {data.filter(r => r.status === "waiting").map(d => {
              const dc = dcCfg[d.dc] as Rec
              const waitMinutes = 25 + Math.abs(d.id.charCodeAt(4) * 7) % 60
              return (
                <div key={d.id} className="dsk-alert-row">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  <span className="dsk-alert-name">{d.id} {d.carrier}</span>
                  <span className="dsk-alert-stat">~{waitMinutes} min wait</span>
                  <span className="dsk-alert-rooms">{dc.label} | {d.vehicleReg}</span>
                </div>
              )
            })}
            {data.filter(r => r.status === "waiting").length === 0 && <div className="dsk-empty">No carriers waiting</div>}
          </div>
        </div>
      )}
    </div>
  )
}
