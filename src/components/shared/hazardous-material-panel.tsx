"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  AlertTriangle, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, CheckCircle2, Package, Thermometer, Shield,
  FileWarning, Clock, Flame, Skull, Droplets, Zap, Radiation, Wind
} from "lucide-react"

type Rec = any

interface HazmatRecord {
  id: string; unClass: string; unNumber: string; chemicalName: string
  category: string; location: string; storageZone: string; quantity: string
  status: string; tempRange: string; lastInspection: string; nextDue: string
  msdsStatus: string; handler: string; ppeRequired: string; spillKit: string
  incidentCount: number; expanded: boolean
}

const unIcons: Record<string, Rec> = {
  "1": { label: "Class 1 - Explosives", icon: Flame, color: "bg-red-500" },
  "2": { label: "Class 2 - Gases", icon: Wind, color: "bg-orange-500" },
  "3": { label: "Class 3 - Flammable Liquids", icon: Droplets, color: "bg-amber-500" },
  "4": { label: "Class 4 - Flammable Solids", icon: Flame, color: "bg-yellow-600" },
  "5": { label: "Class 5 - Oxidizers", icon: Zap, color: "bg-violet-500" },
  "6": { label: "Class 6 - Toxic", icon: Skull, color: "bg-purple-600" },
  "8": { label: "Class 8 - Corrosive", icon: AlertTriangle, color: "bg-red-700" },
  "9": { label: "Class 9 - Misc. Dangerous", icon: Radiation, color: "bg-cyan-500" }
}

const statusCfg: Record<string, Rec> = {
  compliant: { label: "Compliant", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: CheckCircle2 },
  warning: { label: "Near Expiry", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: Clock },
  violation: { label: "Violation", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: FileWarning },
  quarantine: { label: "Quarantined", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: Shield }
}

const locCfg: Record<string, Rec> = {
  bhiwandi: { label: "Bhiwandi DC", color: "bg-red-500" },
  pune: { label: "Pune WH", color: "bg-blue-500" },
  chennai: { label: "Chennai DC", color: "bg-emerald-500" },
  kolkata: { label: "Kolkata DC", color: "bg-amber-500" },
  hyderabad: { label: "Hyderabad WH", color: "bg-cyan-500" },
  delhi: { label: "Delhi NCR", color: "bg-orange-500" }
}

const rawHazmat: Rec[] = [
  { id: "HZM-01", uc: "3", un: "UN 1203", cn: "Petroleum Ether", ca: "Flammable Liquid", lc: "bhiwandi", sz: "Zone H1", qt: "200 L drums x 12", st: "compliant", tr: "15\u00b0C-25\u00b0C", li: "28 Jul 2026", nd: "28 Aug 2026", ms: "Valid", hr: "Rakesh P.", pr: "Chemical suit, goggles, gloves", sk: "Spill kit A1", ic: 0, ex: false },
  { id: "HZM-02", uc: "6", un: "UN 1851", cn: "Sodium Cyanide", ca: "Toxic Substance", lc: "chennai", sz: "Secure Vault S2", qt: "50 kg bags x 20", st: "compliant", tr: "Ambient", li: "25 Jul 2026", nd: "25 Aug 2026", ms: "Valid", hr: "Anita D.", pr: "Full hazmat suit, respirator", sk: "Cyanide neutralization kit", ic: 0, ex: false },
  { id: "HZM-03", uc: "8", un: "UN 1830", cn: "Sulphuric Acid", ca: "Corrosive", lc: "delhi", sz: "Acid Bay A3", qt: "35 L carboys x 8", st: "violation", tr: "Ambient", li: "10 Jul 2026", nd: "10 Aug 2026!", ms: "Expired!", hr: "Sunil M.", pr: "Acid-resistant suit, face shield", sk: "Acid neutralizer B3", ic: 1, ex: false },
  { id: "HZM-04", uc: "2", un: "UN 1017", cn: "Chlorine Gas Cylinders", ca: "Compressed Gas", lc: "kolkata", sz: "Gas Cage G1", qt: "50 kg cylinders x 6", st: "compliant", tr: "Cool & Dry", li: "01 Aug 2026", nd: "01 Sep 2026", ms: "Valid", hr: "Mita R.", pr: "Gas mask, gloves, apron", sk: "Chlorine leak kit", ic: 0, ex: false },
  { id: "HZM-05", uc: "5", un: "UN 1479", cn: "Ammonium Nitrate", ca: "Oxidizer", lc: "hyderabad", sz: "Segregated Bay B5", qt: "50 kg bags x 40", st: "warning", tr: "Below 30\u00b0C", li: "15 Jun 2026", nd: "15 Aug 2026!", ms: "Expiring", hr: "Suresh B.", pr: "Full PPE, no spark tools", sk: "Fire extinguisher + sand", ic: 0, ex: false },
  { id: "HZM-06", uc: "3", un: "UN 1987", cn: "Ethanol (Industrial)", ca: "Flammable Liquid", lc: "pune", sz: "Zone H2", qt: "200 L drums x 8", st: "compliant", tr: "15\u00b0C-25\u00b0C", li: "30 Jul 2026", nd: "30 Aug 2026", ms: "Valid", hr: "Deepak V.", pr: "Chemical suit, goggles", sk: "Foam extinguisher", ic: 0, ex: false },
  { id: "HZM-07", uc: "6", un: "UN 1544", cn: "Paraquat Dichloride", ca: "Toxic (Pesticide)", lc: "chennai", sz: "Secure Vault S3", qt: "20 kg cans x 15", st: "violation", tr: "Ambient, dry", li: "20 Jun 2026", nd: "20 Jul 2026!", ms: "Expired!", hr: "Kavitha T.", pr: "Full hazmat suit, respirator", sk: "Toxic absorbent kit", ic: 2, ex: false },
  { id: "HZM-08", uc: "9", un: "UN 3082", cn: "Lithium Ion Batteries", ca: "Misc. Dangerous", lc: "delhi", sz: "Battery Room E1", qt: "Pallets x 10", st: "compliant", tr: "18\u00b0C-25\u00b0C", li: "02 Aug 2026", nd: "02 Sep 2026", ms: "Valid", hr: "Vijay S.", pr: "Insulated gloves, fire blanket", sk: "Lithium fire extinguisher", ic: 0, ex: false },
  { id: "HZM-09", uc: "8", un: "UN 1791", cn: "Hydrochloric Acid", ca: "Corrosive", lc: "bhiwandi", sz: "Acid Bay A2", qt: "30 L carboys x 10", st: "warning", tr: "Ambient, ventilated", li: "10 Jul 2026", nd: "10 Aug 2026!", ms: "Expiring", hr: "Rajesh K.", pr: "Acid suit, face shield", sk: "Acid neutralizer A2", ic: 0, ex: false },
  { id: "HZM-10", uc: "4", un: "UN 1325", cn: "Sulphur Powder", ca: "Flammable Solid", lc: "kolkata", sz: "Segregated Bay B2", qt: "50 kg bags x 25", st: "quarantine", tr: "Below 40\u00b0C", li: "18 May 2026", nd: "\u2014", ms: "Under Review", hr: "Unassigned", pr: "Dust mask, no ignition", sk: "Dry powder extinguisher", ic: 0, ex: false }
]

const hazmat: HazmatRecord[] = rawHazmat.map((r: Rec) => ({
  id: r.id, unClass: r.uc, unNumber: r.un, chemicalName: r.cn,
  category: r.ca, location: r.lc, storageZone: r.sz, quantity: r.qt,
  status: r.st, tempRange: r.tr, lastInspection: r.li, nextDue: r.nd,
  msdsStatus: r.ms, handler: r.hr, ppeRequired: r.pr, spillKit: r.sk,
  incidentCount: r.ic, expanded: r.ex
}))

const viewTabs = [
  { key: "storage", label: "Hazmat Storage", icon: AlertTriangle },
  { key: "compliance", label: "MSDS Compliance", icon: Shield },
  { key: "classes", label: "UN Class Analysis", icon: BarChart3 }
]

export function HazardousMaterialPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("storage")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<HazmatRecord[]>(hazmat)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: HazmatRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: HazmatRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.chemicalName.toLowerCase().includes(search.toLowerCase()) && !r.unNumber.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.class && r.unClass !== activeFilters.class) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const compliant = data.filter(r => r.status === "compliant").length
    const violations = data.filter(r => r.status === "violation").length
    const quarantined = data.filter(r => r.status === "quarantine").length
    const totalIncidents = data.reduce((s: number, r: HazmatRecord) => s + r.incidentCount, 0)
    const expiredMsds = data.filter(r => r.msdsStatus === "Expired!" || r.msdsStatus === "Under Review").length
    return { total, compliant, violations, quarantined, totalIncidents, expiredMsds }
  }, [data])

  return (
    <div className="hzm-root">
      <div className="hzm-header">
        <div className="hzm-header-left">
          <div className="hzm-icon-wrap"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
          <div>
            <h3 className="hzm-title">Hazardous Materials</h3>
            <p className="hzm-subtitle">DG cargo storage, MSDS compliance &amp; hazmat safety management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hzm-live-count">{stats.violations} Violations</span>
        </div>
      </div>
      <div className="hzm-stats-grid">
        {[
          { label: "Total Items", value: String(stats.total), icon: Package, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Compliant", value: String(stats.compliant), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Violations", value: String(stats.violations), icon: FileWarning, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
          { label: "Quarantined", value: String(stats.quarantined), icon: Shield, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-950/40" },
          { label: "Incidents", value: String(stats.totalIncidents), icon: Skull, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "MSDS Issues", value: String(stats.expiredMsds), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" }
        ].map(s => (
          <div key={s.label} className="hzm-stat-card">
            <div className={cn("hzm-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="hzm-stat-info"><span className="hzm-stat-value">{s.value}</span><span className="hzm-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="hzm-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search chemical, UN no, zone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("hzm-filter-chip", activeFilters.status === k && "hzm-filter-active")}>
              <v.icon className="h-3 w-3" style={{ color: activeFilters.status === k ? undefined : v.color }} />
              <span>{v.label}</span>
              <span className="hzm-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="hzm-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(unIcons).map(([k, v]: [string, Rec]) => {
            if (data.filter(r => r.unClass === k).length === 0) return null
            return (
              <button key={k} onClick={() => handleFilter("class", k)} className={cn("hzm-type-chip", activeFilters.class === k && "hzm-type-active")}>
                <span className="hzm-type-dot" style={{ backgroundColor: v.color }} />
                <span>{v.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="hzm-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("hzm-view-tab", view === t.key && "hzm-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "storage" && (
        <div className="hzm-grid">
          {filtered.map(h => {
            const sc = statusCfg[h.status] as Rec
            const lc = locCfg[h.location] as Rec
            const uc = unIcons[h.unClass] as Rec
            const SIcon = (sc.icon as React.ElementType) || CheckCircle2
            const UIcon = (uc.icon as React.ElementType) || AlertTriangle
            const isViolation = h.status === "violation"
            return (
              <div key={h.id} className={cn("hzm-card", `border-l-4 ${sc.borderColor || ""}`, isViolation && "hzm-card-violation")}>
                <div className="hzm-card-top">
                  <div className="flex items-center gap-2">
                    <span className="hzm-card-id">{h.id}</span>
                    <span className="hzm-un-badge"><UIcon className="h-3 w-3" style={{ color: uc.color }} />{h.unNumber}</span>
                    <span className={cn("hzm-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                    {h.incidentCount > 0 && <span className="hzm-incident-badge"><Skull className="h-3 w-3" />{h.incidentCount} incident(s)</span>}
                  </div>
                  <span className="hzm-loc-badge" style={{ backgroundColor: lc.color + "18", color: lc.color }}>{lc.label}</span>
                </div>
                <div className="hzm-card-name">{h.chemicalName}</div>
                <div className="hzm-card-flow">
                  <span className="hzm-category-badge" style={{ backgroundColor: uc.color + "18", color: uc.color }}>{h.category}</span>
                  <span className="hzm-metric"><Package className="h-3 w-3" />{h.storageZone}</span>
                  <span className="hzm-metric"><MapPin className="h-3 w-3" />{h.quantity}</span>
                </div>
                <div className="hzm-meta-row">
                  <span className="hzm-meta-metric"><Thermometer className="h-3 w-3" />{h.tempRange}</span>
                  <span className={cn("hzm-meta-metric", (h.msdsStatus === "Expired!" || h.msdsStatus === "Expiring" || h.msdsStatus === "Under Review") && "text-red-600 font-bold")}><Shield className="h-3 w-3" />MSDS: {h.msdsStatus}</span>
                  <span className={cn("hzm-meta-metric", h.nextDue.endsWith("!") && "text-red-600 font-bold")}><Clock className="h-3 w-3" />Next: {h.nextDue}</span>
                </div>
                <div className="hzm-safety-row">
                  <span className="hzm-safety-metric"><span className="hzm-safety-label">Handler:</span> {h.handler}</span>
                  <span className="hzm-safety-metric"><span className="hzm-safety-label">Kit:</span> {h.spillKit}</span>
                </div>
                <div className="hzm-ppe-bar">{h.ppeRequired}</div>
                <button onClick={() => toggleExpand(h.id)} className="hzm-expand-btn">
                  {h.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{h.expanded ? "Hide" : "Details"}</span>
                </button>
                {h.expanded && (
                  <div className="hzm-expanded"><div className="hzm-detail-grid">
                    {[
                      { l: "ID", v: h.id }, { l: "UN Number", v: h.unNumber }, { l: "Chemical", v: h.chemicalName },
                      { l: "Location", v: lc.label }, { l: "Storage", v: h.storageZone }, { l: "Quantity", v: h.quantity },
                      { l: "Handler", v: h.handler }, { l: "Temp", v: h.tempRange }
                    ].map(d => (
                      <div key={d.l} className="hzm-detail-item"><span className="hzm-detail-label">{d.l}</span><span className="hzm-detail-value">{d.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="hzm-empty">No hazmat items match your filters</div>}
        </div>
      )}

      {view === "compliance" && (
        <div className="hzm-anal-view">
          <div className="hzm-anal-col">
            <h4 className="hzm-anal-title">MSDS Status Overview</h4>
            {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => {
              const sd = data.filter(r => r.status === k)
              if (sd.length === 0) return null
              return (
                <div key={k} className="hzm-band-card">
                  <div className="flex items-center gap-2 mb-2"><v.icon className="h-4 w-4" style={{ color: v.color }} /><span className="hzm-band-name">{v.label}</span><span className="hzm-band-sub">{sd.length} items</span></div>
                  <div className="hzm-band-stats">
                    <div className="hzm-band-stat"><span className="hzm-band-val text-blue-600">{sd.length}</span><span className="hzm-band-lbl">Items</span></div>
                    <div className="hzm-band-stat"><span className="hzm-band-val text-red-600">{sd.reduce((s: number, r: HazmatRecord) => s + r.incidentCount, 0)}</span><span className="hzm-band-lbl">Incidents</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="hzm-anal-col hzm-alert-log">
            <h4 className="hzm-anal-title">Critical Alerts</h4>
            {data.filter(r => r.status === "violation" || r.msdsStatus === "Expired!" || r.nextDue.endsWith("!")).sort((a, b) => a.nextDue.localeCompare(b.nextDue)).map(h => {
              const lc = locCfg[h.location] as Rec
              return (
                <div key={h.id} className="hzm-alert-row">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span className="hzm-alert-name">{h.id} {h.chemicalName}</span>
                  <span className="hzm-alert-stat text-red-600">{h.msdsStatus}</span>
                  <span className="hzm-alert-rooms">{lc.label} | {h.nextDue}</span>
                </div>
              )
            })}
            {data.filter(r => r.status === "violation" || r.msdsStatus === "Expired!" || r.nextDue.endsWith("!")).length === 0 && <div className="hzm-empty">No critical alerts</div>}
          </div>
        </div>
      )}

      {view === "classes" && (
        <div className="hzm-anal-view">
          <div className="hzm-anal-col">
            <h4 className="hzm-anal-title">Storage by UN Class</h4>
            {Object.entries(unIcons).map(([k, v]: [string, Rec]) => {
              const cd = data.filter(r => r.unClass === k)
              if (cd.length === 0) return null
              const viol = cd.filter(r => r.status === "violation" || r.status === "quarantine").length
              return (
                <div key={k} className="hzm-band-card">
                  <div className="flex items-center gap-2 mb-2"><v.icon className="h-4 w-4" style={{ color: v.color }} /><span className="hzm-band-name">{v.label}</span><span className="hzm-band-sub">{cd.length} chemicals</span></div>
                  <div className="hzm-band-stats">
                    <div className="hzm-band-stat"><span className="hzm-band-val text-blue-600">{cd.length}</span><span className="hzm-band-lbl">Items</span></div>
                    <div className="hzm-band-stat"><span className={cn("hzm-band-val", viol > 0 ? "text-red-600" : "text-emerald-600")}>{viol}</span><span className="hzm-band-lbl">Issues</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="hzm-anal-col">
            <h4 className="hzm-anal-title">Location Hazmat Inventory</h4>
            {Object.entries(locCfg).map(([k, v]: [string, Rec]) => {
              const ld = data.filter(r => r.location === k)
              if (ld.length === 0) return null
              return (
                <div key={k} className="hzm-band-card">
                  <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4" style={{ color: v.color }} /><span className="hzm-band-name">{v.label}</span><span className="hzm-band-sub">{ld.length} chemicals</span></div>
                  <div className="hzm-band-stats">
                    <div className="hzm-band-stat"><span className="hzm-band-val text-violet-600">{Array.from(new Set(ld.map(r => r.storageZone))).length}</span><span className="hzm-band-lbl">Zones</span></div>
                    <div className="hzm-band-stat"><span className="hzm-band-val text-red-600">{ld.reduce((s: number, r: HazmatRecord) => s + r.incidentCount, 0)}</span><span className="hzm-band-lbl">Incidents</span></div>
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
