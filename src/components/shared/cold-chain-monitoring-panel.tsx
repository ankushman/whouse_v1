"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Thermometer, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, AlertTriangle, CheckCircle2, Clock, Package,
  Truck, ArrowRight, Snowflake, Droplets, Wind, Gauge, ThermometerSnowflake,
  XCircle, ShieldCheck, Warehouse, Refrigerator, AlertOctagon, TrendingDown,
  CircleDot
} from "lucide-react"

type Rec = any

interface ColdRoomRecord {
  id: string; coldRoom: string; dc: string; zone: string
  temperature: number; targetTemp: number; humidity: number
  productType: string; capacityPct: number; doorOpens: number
  status: string; compressorStatus: string; lastDefrost: string
  powerStatus: string; alerts: string; expanded: boolean
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
  warning: { label: "Warning", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: AlertOctagon },
  defrost: { label: "Defrosting", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: Snowflake },
  offline: { label: "Offline", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: XCircle }
}

const productCfg: Record<string, Rec> = {
  dairy: { label: "Dairy", color: "bg-blue-500", tempRange: "2-8\u00b0C" },
  meat: { label: "Meat & Poultry", color: "bg-red-500", tempRange: "-2 to 4\u00b0C" },
  frozen: { label: "Frozen Foods", color: "bg-cyan-500", tempRange: "-18 to -22\u00b0C" },
  pharma: { label: "Pharmaceuticals", color: "bg-violet-500", tempRange: "2-8\u00b0C" },
  produce: { label: "Fresh Produce", color: "bg-emerald-500", tempRange: "1-10\u00b0C" },
  seafood: { label: "Seafood", color: "bg-orange-500", tempRange: "-2 to 2\u00b0C" }
}

const compCfg: Record<string, Rec> = {
  running: { label: "Running", color: "#10b981" },
  standby: { label: "Standby", color: "#3b82f6" },
  maintenance: { label: "Maintenance", color: "#f59e0b" },
  fault: { label: "Fault", color: "#ef4444" }
}

const rawRooms: Rec[] = [
  { id: "CCR-01", cr: "Chiller Room A1", dc: "dc1", zn: "Zone-A", tp: 4.2, tt: 5.0, hm: 85, pt: "dairy", cp: 72, do: 12, st: "optimal", cs: "running", ld: "01 Aug 2026", ps: "normal", al: "None", ex: false },
  { id: "CCR-02", cr: "Blast Freezer B1", dc: "dc2", zn: "Zone-B", tp: -19.5, tt: -20.0, hm: 45, pt: "frozen", cp: 88, do: 5, st: "optimal", cs: "running", ld: "31 Jul 2026", ps: "normal", al: "None", ex: false },
  { id: "CCR-03", cr: "Cold Storage C1", dc: "dc3", zn: "Zone-C", tp: 9.8, tt: 5.0, hm: 92, pt: "produce", cp: 45, do: 28, st: "warning", cs: "running", ld: "02 Aug 2026", ps: "normal", al: "High Temp Deviation", ex: false },
  { id: "CCR-04", cr: "Pharma Vault D1", dc: "dc4", zn: "Zone-D", tp: 6.5, tt: 4.0, hm: 40, pt: "pharma", cp: 35, do: 3, st: "warning", cs: "running", ld: "02 Aug 2026", ps: "ups-backup", al: "Temp Drift +2.5\u00b0C", ex: false },
  { id: "CCR-05", cr: "Meat Locker E1", dc: "dc5", zn: "Zone-E", tp: 8.1, tt: 1.0, hm: 78, pt: "meat", cp: 60, do: 18, st: "critical", cs: "fault", ld: "30 Jul 2026", ps: "normal", al: "Compressor Fault! Temp Rising", ex: false },
  { id: "CCR-06", cr: "Seafood Hold F1", dc: "dc6", zn: "Zone-F", tp: -1.5, tt: 0.0, hm: 82, pt: "seafood", cp: 55, do: 8, st: "optimal", cs: "running", ld: "01 Aug 2026", ps: "normal", al: "None", ex: false },
  { id: "CCR-07", cr: "Dairy Chill G1", dc: "dc1", zn: "Zone-G", tp: 3.0, tt: 5.0, hm: 80, pt: "dairy", cp: 40, do: 15, st: "defrost", cs: "standby", ld: "02 Aug 2026", ps: "normal", al: "Scheduled Defrost Cycle", ex: false },
  { id: "CCR-08", cr: "Frozen Vault H1", dc: "dc2", zn: "Zone-H", tp: -21.2, tt: -20.0, hm: 38, pt: "frozen", cp: 92, do: 2, st: "optimal", cs: "running", ld: "01 Aug 2026", ps: "normal", al: "None", ex: false },
  { id: "CCR-09", cr: "Produce Bay I1", dc: "dc3", zn: "Zone-I", tp: 12.5, tt: 8.0, hm: 95, pt: "produce", cp: 78, do: 35, st: "critical", cs: "maintenance", ld: "29 Jul 2026", ps: "generator", al: "Door Seal Damaged! Temp Rising", ex: false },
  { id: "CCR-10", cr: "Pharma Cold J1", dc: "dc4", zn: "Zone-J", tp: 4.1, tt: 4.0, hm: 42, pt: "pharma", cp: 28, do: 1, st: "optimal", cs: "running", ld: "02 Aug 2026", ps: "normal", al: "None", ex: false }
]

const rooms: ColdRoomRecord[] = rawRooms.map((r: Rec) => ({
  id: r.id, coldRoom: r.cr, dc: r.dc, zone: r.zn,
  temperature: r.tp, targetTemp: r.tt, humidity: r.hm,
  productType: r.pt, capacityPct: r.cp, doorOpens: r.do,
  status: r.st, compressorStatus: r.cs, lastDefrost: r.ld,
  powerStatus: r.ps, alerts: r.al, expanded: r.ex
}))

const viewTabs = [
  { key: "rooms", label: "Cold Rooms", icon: ThermometerSnowflake },
  { key: "products", label: "Product Zones", icon: Snowflake },
  { key: "energy", label: "Energy & Alerts", icon: Gauge }
]

export function ColdChainMonitoringPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("rooms")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<ColdRoomRecord[]>(rooms)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: ColdRoomRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: ColdRoomRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.coldRoom.toLowerCase().includes(search.toLowerCase()) && !r.zone.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.productType && r.productType !== activeFilters.productType) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const optimal = data.filter(r => r.status === "optimal").length
    const critical = data.filter(r => r.status === "critical").length
    const avgTemp = (data.reduce((s: number, r: ColdRoomRecord) => s + r.temperature, 0) / Math.max(total, 1)).toFixed(1)
    const alerts = data.filter(r => r.alerts !== "None").length
    const avgHumidity = Math.round(data.reduce((s: number, r: ColdRoomRecord) => s + r.humidity, 0) / Math.max(total, 1))
    return { total, optimal, critical, avgTemp, alerts, avgHumidity }
  }, [data])

  return (
    <div className="ccm-root">
      <div className="ccm-header">
        <div className="ccm-header-left">
          <div className="ccm-icon-wrap"><ThermometerSnowflake className="h-5 w-5 text-cyan-600" /></div>
          <div>
            <h3 className="ccm-title">Cold Chain Monitoring</h3>
            <p className="ccm-subtitle">Temperature-controlled storage, cold room compliance &amp; perishable goods safety across Indian DCs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="ccm-live-count">{stats.critical} Critical</span>
        </div>
      </div>
      <div className="ccm-stats-grid">
        {[
          { label: "Cold Rooms", value: String(stats.total), icon: Refrigerator, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950/40" },
          { label: "Optimal", value: String(stats.optimal), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Critical", value: String(stats.critical), icon: AlertOctagon, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
          { label: "Avg Temp", value: stats.avgTemp + "\u00b0C", icon: Thermometer, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Alerts", value: String(stats.alerts), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Avg Humidity", value: stats.avgHumidity + "%", icon: Droplets, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" }
        ].map(s => (
          <div key={s.label} className="ccm-stat-card">
            <div className={cn("ccm-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="ccm-stat-info"><span className="ccm-stat-value">{s.value}</span><span className="ccm-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="ccm-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search room ID, name, zone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("ccm-filter-chip", activeFilters.status === k && "ccm-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="ccm-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="ccm-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(productCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("productType", k)} className={cn("ccm-type-chip", activeFilters.productType === k && "ccm-type-active")}>
              <span className="ccm-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="ccm-chip-count">{data.filter(r => r.productType === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="ccm-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("ccm-view-tab", view === t.key && "ccm-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "rooms" && (
        <div className="ccm-grid">
          {filtered.map(r => {
            const sc = statusCfg[r.status] as Rec
            const dc = dcCfg[r.dc] as Rec
            const pc = productCfg[r.productType] as Rec
            const cc = compCfg[r.compressorStatus] as Rec
            const SIcon = (sc.icon as React.ElementType) || ThermometerSnowflake
            const isCritical = r.status === "critical"
            const tempDeviation = Math.abs(r.temperature - r.targetTemp)
            const isTempOk = tempDeviation <= 2
            const tempColor = isTempOk ? "#10b981" : tempDeviation <= 5 ? "#f59e0b" : "#ef4444"
            const capColor = r.capacityPct >= 85 ? "#ef4444" : r.capacityPct >= 70 ? "#f59e0b" : "#10b981"
            return (
              <div key={r.id} className={cn("ccm-card", `border-l-4 ${sc.borderColor || ""}`, isCritical && "ccm-card-critical")}>
                <div className="ccm-card-top">
                  <div className="flex items-center gap-2">
                    <span className="ccm-card-id">{r.id}</span>
                    <span className={cn("ccm-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                    {r.alerts !== "None" && <span className="ccm-alert-badge"><AlertTriangle className="h-3 w-3" />{r.alerts.substring(0, 25)}</span>}
                  </div>
                  <span className="ccm-comp-dot" style={{ backgroundColor: cc.color }}>{cc.label}</span>
                </div>
                <div className="ccm-name-row">
                  <span className="ccm-name"><ThermometerSnowflake className="h-3.5 w-3.5" />{r.coldRoom}</span>
                  <span className="ccm-dc" style={{ color: dc.color }}>{dc.label}</span>
                </div>
                <div className="ccm-zone-row">
                  <span className="ccm-zone-badge" style={{ backgroundColor: pc.color + "18", color: pc.color }}>{pc.label}</span>
                  <span className="ccm-temp-range">Target: {pc.tempRange}</span>
                  <span className="ccm-zone">{r.zone}</span>
                </div>
                <div className="ccm-temp-row">
                  <div className="ccm-temp-display" style={{ color: tempColor }}>
                    <Thermometer className="h-4 w-4" />
                    <span className="ccm-temp-val">{r.temperature > 0 ? "+" : ""}{r.temperature}\u00b0C</span>
                  </div>
                  <div className="ccm-temp-display ccm-target-temp">
                    <span className="ccm-temp-label">Target: {r.targetTemp}\u00b0C</span>
                    <span className="ccm-deviation" style={{ color: tempColor }}>Deviation: {tempDeviation > 0 ? "+" : ""}{tempDeviation.toFixed(1)}\u00b0C</span>
                  </div>
                </div>
                <div className="ccm-humidity-row">
                  <span className="ccm-humid"><Droplets className="h-3 w-3" />{r.humidity}% RH</span>
                  <span className="ccm-doors"><Warehouse className="h-3 w-3" />{r.doorOpens} door opens</span>
                  <span className="ccm-power"><ShieldCheck className="h-3 w-3" />{r.powerStatus}</span>
                </div>
                <div className="ccm-cap-bar-row">
                  <span className="ccm-cap-label">Capacity:</span>
                  <div className="ccm-cap-bar-track"><div className="ccm-cap-bar-fill" style={{ width: r.capacityPct + "%", backgroundColor: capColor }} /></div>
                  <span className="ccm-cap-pct" style={{ color: capColor }}>{r.capacityPct}%</span>
                </div>
                <div className="ccm-metrics-row">
                  <span className="ccm-metric"><Snowflake className="h-3 w-3" />Defrost: {r.lastDefrost}</span>
                  <span className="ccm-metric"><Gauge className="h-3 w-3" />Comp: <span style={{ color: cc.color }}>{cc.label}</span></span>
                </div>
                <button onClick={() => toggleExpand(r.id)} className="ccm-expand-btn">
                  {r.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{r.expanded ? "Hide" : "Sensor Details"}</span>
                </button>
                {r.expanded && (
                  <div className="ccm-expanded"><div className="ccm-detail-grid">
                    {[
                      { l: "Room ID", v: r.id }, { l: "Cold Room", v: r.coldRoom }, { l: "DC", v: dc.label },
                      { l: "Zone", v: r.zone }, { l: "Product Type", v: pc.label }, { l: "Current Temp", v: r.temperature + "\u00b0C" },
                      { l: "Target Temp", v: r.targetTemp + "\u00b0C" }, { l: "Humidity", v: r.humidity + "% RH" },
                      { l: "Capacity", v: r.capacityPct + "%" }, { l: "Door Opens", v: String(r.doorOpens) },
                      { l: "Compressor", v: cc.label }, { l: "Power", v: r.powerStatus }
                    ].map(dd => (
                      <div key={dd.l} className="ccm-detail-item"><span className="ccm-detail-label">{dd.l}</span><span className="ccm-detail-value">{dd.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="ccm-empty">No cold rooms match your filters</div>}
        </div>
      )}

      {view === "products" && (
        <div className="ccm-anal-view">
          <div className="ccm-anal-col">
            <h4 className="ccm-anal-title">Temperature by Product Type</h4>
            {Object.entries(productCfg).map(([k, v]: [string, Rec]) => {
              const pd = data.filter(r => r.productType === k)
              if (pd.length === 0) return null
              const avgTemp = (pd.reduce((s: number, r: ColdRoomRecord) => s + r.temperature, 0) / pd.length).toFixed(1)
              const avgCap = Math.round(pd.reduce((s: number, r: ColdRoomRecord) => s + r.capacityPct, 0) / pd.length)
              const criticals = pd.filter(r => r.status === "critical").length
              const avgHumid = Math.round(pd.reduce((s: number, r: ColdRoomRecord) => s + r.humidity, 0) / pd.length)
              return (
                <div key={k} className="ccm-band-card">
                  <div className="flex items-center gap-2 mb-2"><CircleDot className="h-4 w-4" style={{ color: v.color }} /><span className="ccm-band-name">{v.label}</span><span className="ccm-band-sub">{pd.length} room(s) | {v.tempRange}</span></div>
                  <div className="ccm-band-stats">
                    <div className="ccm-band-stat"><span className="ccm-band-val text-cyan-600">{avgTemp}\u00b0C</span><span className="ccm-band-lbl">Avg Temp</span></div>
                    <div className="ccm-band-stat"><span className="ccm-band-val text-blue-600">{avgHumid}%</span><span className="ccm-band-lbl">Humidity</span></div>
                    <div className="ccm-band-stat"><span className="ccm-band-val text-violet-600">{avgCap}%</span><span className="ccm-band-lbl">Capacity</span></div>
                  </div>
                  {criticals > 0 && <span className="ccm-critical-tag"><AlertOctagon className="h-3 w-3" />{criticals} critical</span>}
                </div>
              )
            })}
          </div>
          <div className="ccm-anal-col">
            <h4 className="ccm-anal-title">Rooms by DC</h4>
            {Object.entries(dcCfg).map(([k, v]: [string, Rec]) => {
              const dd = data.filter(r => r.dc === k)
              if (dd.length === 0) return null
              const avgTemp = (dd.reduce((s: number, r: ColdRoomRecord) => s + r.temperature, 0) / dd.length).toFixed(1)
              const criticals = dd.filter(r => r.status === "critical").length
              const warnings = dd.filter(r => r.status === "warning").length
              return (
                <div key={k} className="ccm-band-card">
                  <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4" style={{ color: v.color }} /><span className="ccm-band-name">{v.label}</span><span className="ccm-band-sub">{dd.length} room(s)</span></div>
                  <div className="ccm-band-stats">
                    <div className="ccm-band-stat"><span className="ccm-band-val text-cyan-600">{avgTemp}\u00b0C</span><span className="ccm-band-lbl">Avg Temp</span></div>
                    <div className="ccm-band-stat"><span className="ccm-band-val text-red-600">{criticals}</span><span className="ccm-band-lbl">Critical</span></div>
                    <div className="ccm-band-stat"><span className="ccm-band-val text-amber-600">{warnings}</span><span className="ccm-band-lbl">Warning</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "energy" && (
        <div className="ccm-anal-view">
          <div className="ccm-anal-col">
            <h4 className="ccm-anal-title">Compressor Status</h4>
            {Object.entries(compCfg).map(([k, v]: [string, Rec]) => {
              const cd = data.filter(r => r.compressorStatus === k)
              if (cd.length === 0) return null
              return (
                <div key={k} className="ccm-band-card">
                  <div className="flex items-center gap-2 mb-2"><Gauge className="h-4 w-4" style={{ color: v.color }} /><span className="ccm-band-name">{v.label}</span><span className="ccm-band-sub">{cd.length} room(s)</span></div>
                  <div className="ccm-band-stats">
                    <div className="ccm-band-stat"><span className="ccm-band-val" style={{ color: v.color }}>{cd.length}</span><span className="ccm-band-lbl">Rooms</span></div>
                    <div className="ccm-band-stat"><span className="ccm-band-val text-blue-600">{cd.filter(r => r.powerStatus === "normal").length}</span><span className="ccm-band-lbl">Normal Power</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="ccm-anal-col">
            <h4 className="ccm-anal-title">Active Alerts</h4>
            {data.filter(r => r.alerts !== "None").sort((a: ColdRoomRecord, b: ColdRoomRecord) => {
              const order: Record<string, number> = { critical: 0, warning: 1, defrost: 2, optimal: 3, offline: 4 }
              return (order[a.status] || 5) - (order[b.status] || 5)
            }).map(r => {
              const dc = dcCfg[r.dc] as Rec
              return (
                <div key={r.id} className="ccm-alert-row">
                  {r.status === "critical" ? <AlertOctagon className="h-3 w-3 text-red-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                  <span className="ccm-alert-name">{r.id} {r.coldRoom}</span>
                  <span className="ccm-alert-stat">{r.temperature}\u00b0C</span>
                  <span className="ccm-alert-rooms">{dc.label}</span>
                </div>
              )
            })}
            {data.filter(r => r.alerts !== "None").length === 0 && <div className="ccm-empty">No active alerts</div>}
          </div>
        </div>
      )}
    </div>
  )
}
