"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Truck, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, AlertTriangle, CheckCircle2, Clock, Fuel,
  ArrowRight, Gauge, Route, Wrench, User, Navigation, Zap
} from "lucide-react"

type Rec = any

interface VehicleRecord {
  id: string; regNo: string; brand: string; model: string; vehicleType: string
  driver: string; phone: string; origin: string; destination: string
  fuelEff: string; fuelLevel: number; speed: string; odometer: string
  status: string; lastPing: string; loadPct: number; expanded: boolean
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
  onroute: { label: "On Route", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: Navigation },
  atdc: { label: "At DC", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: MapPin },
  maintenance: { label: "Maintenance", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: Wrench },
  idle: { label: "Idle", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: Clock },
  delayed: { label: "Delayed", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: AlertTriangle }
}

const typeCfg: Record<string, Rec> = {
  heavy: { label: "Heavy Truck", color: "bg-red-500" },
  medium: { label: "Medium Truck", color: "bg-blue-500" },
  light: { label: "Light CV", color: "bg-emerald-500" },
  container: { label: "Container Carrier", color: "bg-violet-500" },
  refrigerated: { label: "Refrigerated", color: "bg-cyan-500" }
}

const rawVehicles: Rec[] = [
  { id: "VHL-01", rg: "MH-12-AB-1234", br: "Ashok Leyland", md: "3218H", vt: "heavy", dr: "Rajesh Kumar", ph: "+91-98765-43210", og: "dc1", ds: "dc2", fe: "5.2 km/l", fl: 72, sp: "62 km/h", od: "1,24,580 km", st: "onroute", lp: "01 Aug 14:30", ld: 85, ex: false },
  { id: "VHL-02", rg: "DL-04-CD-5678", br: "Tata Motors", md: "LPT 1615", vt: "medium", dr: "Sunil Yadav", ph: "+91-98765-43211", og: "dc2", ds: "dc3", fe: "6.8 km/l", fl: 45, sp: "0 km/h", od: "98,230 km", st: "atdc", lp: "01 Aug 16:00", ld: 0, ex: false },
  { id: "VHL-03", rg: "KA-01-EF-9012", br: "Eicher", md: "11.14", vt: "light", dr: "Mohan Das", ph: "+91-98765-43212", og: "dc3", ds: "dc1", fe: "8.4 km/l", fl: 18, sp: "55 km/h", od: "67,890 km", st: "onroute", lp: "01 Aug 12:45", ld: 60, ex: false },
  { id: "VHL-04", rg: "TN-09-GH-3456", br: "BharatBenz", md: "3143", vt: "container", dr: "Arjun Reddy", ph: "+91-98765-43213", og: "dc4", ds: "dc1", fe: "4.1 km/l", fl: 55, sp: "48 km/h", od: "2,10,450 km", st: "delayed", lp: "31 Jul 22:00", ld: 92, ex: false },
  { id: "VHL-05", rg: "WB-06-IJ-7890", br: "Mahindra", md: "BLAZO 25", vt: "heavy", dr: "Prakash Singh", ph: "+91-98765-43214", og: "dc5", ds: "dc6", fe: "4.8 km/l", fl: 88, sp: "58 km/h", od: "1,56,320 km", st: "onroute", lp: "01 Aug 10:20", ld: 78, ex: false },
  { id: "VHL-06", rg: "TS-08-KL-2345", br: "Ashok Leyland", md: "1920", vt: "light", dr: "Venkat Rao", ph: "+91-98765-43215", og: "dc6", ds: "dc3", fe: "9.1 km/l", fl: 30, sp: "0 km/h", od: "45,670 km", st: "maintenance", lp: "30 Jul 18:00", ld: 0, ex: false },
  { id: "VHL-07", rg: "MH-14-MN-6789", br: "Tata Motors", md: "4018", vt: "refrigerated", dr: "Ganesh Patil", ph: "+91-98765-43216", og: "dc1", ds: "dc4", fe: "3.2 km/l", fl: 65, sp: "52 km/h", od: "1,89,100 km", st: "onroute", lp: "01 Aug 08:15", ld: 70, ex: false },
  { id: "VHL-08", rg: "GJ-05-OP-1234", br: "Eicher", md: "5531", vt: "medium", dr: "Ramesh Shah", ph: "+91-98765-43217", og: "dc2", ds: "dc5", fe: "7.2 km/l", fl: 90, sp: "0 km/h", od: "76,540 km", st: "idle", lp: "01 Aug 06:00", ld: 0, ex: false },
  { id: "VHL-09", rg: "AP-28-QR-5678", br: "BharatBenz", md: "2823R", vt: "heavy", dr: "Krishna Murthy", ph: "+91-98765-43218", og: "dc6", ds: "dc2", fe: "5.5 km/l", fl: 12, sp: "45 km/h", od: "2,34,670 km", st: "delayed", lp: "31 Jul 20:30", ld: 95, ex: false },
  { id: "VHL-10", rg: "RJ-14-ST-9012", br: "Tata Motors", md: "PRIMA 4028", vt: "container", dr: "Dilip Meena", ph: "+91-98765-43219", og: "dc3", ds: "dc5", fe: "3.9 km/l", fl: 82, sp: "60 km/h", od: "1,45,890 km", st: "onroute", lp: "01 Aug 11:50", ld: 88, ex: false }
]

const vehicles: VehicleRecord[] = rawVehicles.map((r: Rec) => ({
  id: r.id, regNo: r.rg, brand: r.br, model: r.md, vehicleType: r.vt,
  driver: r.dr, phone: r.ph, origin: r.og, destination: r.ds,
  fuelEff: r.fe, fuelLevel: r.fl, speed: r.sp, odometer: r.od,
  status: r.st, lastPing: r.lp, loadPct: r.ld, expanded: r.ex
}))

const viewTabs = [
  { key: "fleet", label: "Fleet Overview", icon: Truck },
  { key: "fuel", label: "Fuel Analysis", icon: Fuel },
  { key: "routes", label: "Route Compliance", icon: Route }
]

export function FleetVehicleTrackerPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("fleet")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<VehicleRecord[]>(vehicles)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: VehicleRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: VehicleRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.regNo.toLowerCase().includes(search.toLowerCase()) && !r.driver.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.vehicleType && r.vehicleType !== activeFilters.vehicleType) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const onRoute = data.filter(r => r.status === "onroute").length
    const delayed = data.filter(r => r.status === "delayed").length
    const lowFuel = data.filter(r => r.fuelLevel < 25).length
    const avgEff = (data.filter(r => r.status === "onroute").reduce((s: number, r: VehicleRecord) => s + parseFloat(r.fuelEff), 0) / Math.max(data.filter(r => r.status === "onroute").length, 1)).toFixed(1)
    const totalOdo = data.reduce((s: number, r: VehicleRecord) => s + parseInt(r.odometer.replace(/,/g, ""), 10), 0)
    return { total, onRoute, delayed, lowFuel, avgEff, totalOdo }
  }, [data])

  return (
    <div className="fvt-root">
      <div className="fvt-header">
        <div className="fvt-header-left">
          <div className="fvt-icon-wrap"><Truck className="h-5 w-5 text-orange-600" /></div>
          <div>
            <h3 className="fvt-title">Fleet Vehicle Tracker</h3>
            <p className="fvt-subtitle">GPS tracking, fuel efficiency &amp; driver management for Indian warehouse fleet</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="fvt-live-count">{stats.onRoute} On Route</span>
        </div>
      </div>
      <div className="fvt-stats-grid">
        {[
          { label: "Total Vehicles", value: String(stats.total), icon: Truck, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/40" },
          { label: "On Route", value: String(stats.onRoute), icon: Navigation, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Delayed", value: String(stats.delayed), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
          { label: "Low Fuel", value: String(stats.lowFuel), icon: Fuel, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Avg Efficiency", value: stats.avgEff + " km/l", icon: Gauge, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Total Odometer", value: (stats.totalOdo / 1000).toFixed(0) + "K km", icon: Route, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" }
        ].map(s => (
          <div key={s.label} className="fvt-stat-card">
            <div className={cn("fvt-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="fvt-stat-info"><span className="fvt-stat-value">{s.value}</span><span className="fvt-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="fvt-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search vehicle, driver, registration..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("fvt-filter-chip", activeFilters.status === k && "fvt-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="fvt-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="fvt-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(typeCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("vehicleType", k)} className={cn("fvt-type-chip", activeFilters.vehicleType === k && "fvt-type-active")}>
              <span className="fvt-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="fvt-chip-count">{data.filter(r => r.vehicleType === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="fvt-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("fvt-view-tab", view === t.key && "fvt-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "fleet" && (
        <div className="fvt-grid">
          {filtered.map(v => {
            const sc = statusCfg[v.status] as Rec
            const oc = dcCfg[v.origin] as Rec
            const dc2 = dcCfg[v.destination] as Rec
            const tc = typeCfg[v.vehicleType] as Rec
            const SIcon = (sc.icon as React.ElementType) || CheckCircle2
            const isDelayed = v.status === "delayed"
            const fuelColor = v.fuelLevel > 60 ? "#10b981" : v.fuelLevel > 25 ? "#f59e0b" : "#ef4444"
            return (
              <div key={v.id} className={cn("fvt-card", `border-l-4 ${sc.borderColor || ""}`, isDelayed && "fvt-card-delayed")}>
                <div className="fvt-card-top">
                  <div className="flex items-center gap-2">
                    <span className="fvt-card-id">{v.id}</span>
                    <span className="fvt-reg-badge"><Truck className="h-3 w-3" />{v.regNo}</span>
                    <span className={cn("fvt-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                  </div>
                  <span className="fvt-type-badge" style={{ backgroundColor: tc.color + "18", color: tc.color }}>{tc.label}</span>
                </div>
                <div className="fvt-brand-row">
                  <span className="fvt-brand">{v.brand} {v.model}</span>
                  <span className="fvt-driver"><User className="h-3 w-3" />{v.driver}</span>
                </div>
                {v.status === "onroute" && v.status === "onroute" && (
                  <div className="fvt-route-row">
                    <span className="fvt-origin" style={{ color: oc.color }}>{oc.label}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="fvt-dest" style={{ color: dc2.color }}>{dc2.label}</span>
                  </div>
                )}
                <div className="fvt-metrics-row">
                  <span className="fvt-metric"><Gauge className="h-3 w-3" />{v.speed}</span>
                  <span className="fvt-metric"><Fuel className="h-3 w-3" />{v.fuelEff}</span>
                  <span className="fvt-metric"><Route className="h-3 w-3" />{v.odometer}</span>
                  {v.loadPct > 0 && <span className="fvt-metric"><Zap className="h-3 w-3" />{v.loadPct}% load</span>}
                </div>
                <div className="fvt-fuel-bar-row">
                  <span className="fvt-fuel-label">Fuel:</span>
                  <div className="fvt-fuel-bar-track"><div className="fvt-fuel-bar-fill" style={{ width: v.fuelLevel + "%", backgroundColor: fuelColor }} /></div>
                  <span className="fvt-fuel-pct" style={{ color: fuelColor }}>{v.fuelLevel}%</span>
                </div>
                <div className="fvt-time-row">
                  <span className="fvt-time-metric"><Timer className="h-3 w-3" />{v.lastPing}</span>
                  {isDelayed && <span className="fvt-delay-tag"><AlertTriangle className="h-3 w-3" />ETA Delayed</span>}
                </div>
                <button onClick={() => toggleExpand(v.id)} className="fvt-expand-btn">
                  {v.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{v.expanded ? "Hide" : "Details"}</span>
                </button>
                {v.expanded && (
                  <div className="fvt-expanded"><div className="fvt-detail-grid">
                    {[
                      { l: "ID", v: v.id }, { l: "Registration", v: v.regNo }, { l: "Brand", v: v.brand + " " + v.model },
                      { l: "Driver", v: v.driver }, { l: "Phone", v: v.phone }, { l: "Origin", v: oc.label },
                      { l: "Destination", v: dc2.label }, { l: "Fuel Efficiency", v: v.fuelEff }
                    ].map(d => (
                      <div key={d.l} className="fvt-detail-item"><span className="fvt-detail-label">{d.l}</span><span className="fvt-detail-value">{d.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="fvt-empty">No vehicles match your filters</div>}
        </div>
      )}

      {view === "fuel" && (
        <div className="fvt-anal-view">
          <div className="fvt-anal-col">
            <h4 className="fvt-anal-title">Fuel Level Summary</h4>
            {data.map(v => {
              const fuelColor = v.fuelLevel > 60 ? "#10b981" : v.fuelLevel > 25 ? "#f59e0b" : "#ef4444"
              const sc = statusCfg[v.status] as Rec
              return (
                <div key={v.id} className="fvt-fuel-row">
                  <div className="fvt-fuel-row-left">
                    <span className="fvt-fuel-vid">{v.id}</span>
                    <span className="fvt-fuel-reg">{v.regNo}</span>
                  </div>
                  <div className="fvt-fuel-bar-track fvt-fuel-bar-lg"><div className="fvt-fuel-bar-fill" style={{ width: v.fuelLevel + "%", backgroundColor: fuelColor }} /></div>
                  <span className="fvt-fuel-pct-lg" style={{ color: fuelColor }}>{v.fuelLevel}%</span>
                  <span className={cn("fvt-fuel-status", sc.textColor)}>{sc.label}</span>
                </div>
              )
            })}
          </div>
          <div className="fvt-anal-col">
            <h4 className="fvt-anal-title">Brand Efficiency</h4>
            {Array.from(new Set(data.map(r => r.brand))).sort().map(br => {
              const bd = data.filter(r => r.brand === br)
              const avgE = (bd.reduce((s: number, r: VehicleRecord) => s + parseFloat(r.fuelEff), 0) / Math.max(bd.length, 1)).toFixed(1)
              const avgFl = Math.round(bd.reduce((s: number, r: VehicleRecord) => s + r.fuelLevel, 0) / Math.max(bd.length, 1))
              return (
                <div key={br} className="fvt-band-card">
                  <div className="flex items-center gap-2 mb-2"><Truck className="h-4 w-4 text-orange-500" /><span className="fvt-band-name">{br}</span><span className="fvt-band-sub">{bd.length} vehicles</span></div>
                  <div className="fvt-band-stats">
                    <div className="fvt-band-stat"><span className="fvt-band-val text-emerald-600">{avgE} km/l</span><span className="fvt-band-lbl">Avg Efficiency</span></div>
                    <div className="fvt-band-stat"><span className="fvt-band-val text-blue-600">{avgFl}%</span><span className="fvt-band-lbl">Avg Fuel Level</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "routes" && (
        <div className="fvt-anal-view">
          <div className="fvt-anal-col">
            <h4 className="fvt-anal-title">Active Route Segments</h4>
            {data.filter(r => r.status === "onroute").map(v => {
              const oc = dcCfg[v.origin] as Rec
              const dc2 = dcCfg[v.destination] as Rec
              return (
                <div key={v.id} className="fvt-route-card">
                  <div className="fvt-route-from" style={{ borderColor: oc.color }}>{oc.label}</div>
                  <div className="fvt-route-arrow"><ArrowRight className="h-3 w-3 text-muted-foreground" /></div>
                  <div className="fvt-route-to" style={{ borderColor: dc2.color }}>{dc2.label}</div>
                  <div className="fvt-route-meta"><span className="fvt-route-driver"><User className="h-3 w-3" />{v.driver}</span><span className="fvt-route-speed"><Gauge className="h-3 w-3" />{v.speed}</span></div>
                </div>
              )
            })}
            {data.filter(r => r.status === "onroute").length === 0 && <div className="fvt-empty">No active routes</div>}
          </div>
          <div className="fvt-anal-col">
            <h4 className="fvt-anal-title">Delayed Vehicles</h4>
            {data.filter(r => r.status === "delayed").map(v => {
              const oc = dcCfg[v.origin] as Rec
              const dc2 = dcCfg[v.destination] as Rec
              return (
                <div key={v.id} className="fvt-alert-row">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span className="fvt-alert-name">{v.id} {v.regNo}</span>
                  <span className="fvt-alert-stat">{v.speed}</span>
                  <span className="fvt-alert-rooms">{oc.label} &#x2192; {dc2.label}</span>
                </div>
              )
            })}
            {data.filter(r => r.status === "delayed").length === 0 && <div className="fvt-empty">No delays reported</div>}
          </div>
        </div>
      )}
    </div>
  )
}
