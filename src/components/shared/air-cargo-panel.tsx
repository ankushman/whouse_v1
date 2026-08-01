"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Plane, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, AlertTriangle, CheckCircle2, Clock, Package,
  Weight, ArrowRight, BoxSelect, FileText, Thermometer, Shield
} from "lucide-react"

type Rec = any

interface ShipmentRecord {
  id: string; awb: string; airline: string; forwarder: string; origin: string
  destination: string; commodity: string; pieces: number; weight: string
  volume: string; status: string; bookingDate: string; etd: string; eta: string
  terminal: string; customsStatus: string; docType: string; expanded: boolean
}

const airportCfg: Record<string, Rec> = {
  del: { label: "DEL (IGI Airport)", color: "bg-orange-500" },
  bom: { label: "BOM (CSMIA)", color: "bg-blue-500" },
  maa: { label: "MAA (Chennai)", color: "bg-emerald-500" },
  blr: { label: "BLR (Kempegowda)", color: "bg-violet-500" },
  ccu: { label: "CCU (Kolkata)", color: "bg-amber-500" },
  hyd: { label: "HYD (RGIA)", color: "bg-cyan-500" }
}

const statusCfg: Record<string, Rec> = {
  booked: { label: "Booked", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: FileText },
  intransit: { label: "In Transit", color: "bg-violet-500", textColor: "text-violet-700 dark:text-violet-400", bgColor: "bg-violet-50 dark:bg-violet-950/30", borderColor: "border-l-violet-500", icon: Plane },
  arrived: { label: "Arrived", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: CheckCircle2 },
  customs: { label: "Customs Hold", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", borderColor: "border-l-amber-500", icon: Shield },
  delivered: { label: "Delivered", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: Package }
}

const docCfg: Record<string, Rec> = {
  gen: { label: "General", color: "bg-blue-500" },
  exp: { label: "Express", color: "bg-red-500" },
  per: { label: "Perishable", color: "bg-emerald-500" },
  dang: { label: "Dangerous Goods", color: "bg-amber-500" },
  val: { label: "Valuable", color: "bg-violet-500" }
}

const rawShipments: Rec[] = [
  { id: "AIR-01", aw: "176-12345678", al: "Air India", fw: "DHL Express", og: "del", ds: "bom", cm: "Electronics", pc: 12, wt: "450 kg", vl: "3.2 CBM", st: "intransit", bk: "01 Aug 2026", etd: "02 Aug 06:30", ea: "02 Aug 08:15", tm: "Terminal 2", cs: "Pre-cleared", dt: "gen", ex: false },
  { id: "AIR-02", aw: "160-23456789", al: "IndiGo Cargo", fw: "BlueDart", og: "hyd", ds: "del", cm: "Pharma", pc: 48, wt: "280 kg", vl: "1.8 CBM", st: "arrived", bk: "30 Jul 2026", etd: "01 Aug 05:00", ea: "01 Aug 07:30", tm: "Terminal 1", cs: "Cleared", dt: "per", ex: false },
  { id: "AIR-03", aw: "618-34567890", al: "SpiceJet Cargo", fw: "Delhivery", og: "bom", ds: "blr", cm: "Auto Parts", pc: 6, wt: "1,200 kg", vl: "4.5 CBM", st: "booked", bk: "02 Aug 2026", etd: "03 Aug 10:00", ea: "03 Aug 12:45", tm: "Terminal 3", cs: "Pending", dt: "gen", ex: false },
  { id: "AIR-04", aw: "098-45678901", al: "Vistara Cargo", fw: "Safexpress", og: "ccu", ds: "maa", cm: "Textiles", pc: 20, wt: "380 kg", vl: "2.1 CBM", st: "customs", bk: "29 Jul 2026", etd: "31 Jul 09:00", ea: "31 Jul 11:30", tm: "Cargo Terminal", cs: "Inspection", dt: "exp", ex: false },
  { id: "AIR-05", aw: "176-56789012", al: "Air India", fw: "DTDC", og: "del", ds: "hyd", cm: "FMCG Samples", pc: 4, wt: "15 kg", vl: "0.1 CBM", st: "delivered", bk: "28 Jul 2026", etd: "29 Jul 14:00", ea: "29 Jul 16:20", tm: "\u2014", cs: "Cleared", dt: "exp", ex: false },
  { id: "AIR-06", aw: "547-67890123", al: "Lufthansa Cargo", fw: "Kuehne+Nagel", og: "bom", ds: "del", cm: "Machinery Parts", pc: 2, wt: "3,500 kg", vl: "8.0 CBM", st: "customs", bk: "30 Jul 2026", etd: "01 Aug 22:00", ea: "02 Aug 03:30", tm: "Terminal 2", cs: "Duty Query", dt: "gen", ex: false },
  { id: "AIR-07", aw: "160-78901234", al: "IndiGo Cargo", fw: "Ecom Express", og: "blr", ds: "ccu", cm: "E-commerce", pc: 120, wt: "85 kg", vl: "1.2 CBM", st: "intransit", bk: "02 Aug 2026", etd: "02 Aug 18:00", ea: "02 Aug 20:15", tm: "\u2014", cs: "\u2014", dt: "exp", ex: false },
  { id: "AIR-08", aw: "077-89012345", al: "Emirates SkyCargo", fw: "Expeditors", og: "maa", ds: "del", cm: "Marine Spares", pc: 3, wt: "920 kg", vl: "2.8 CBM", st: "intransit", bk: "01 Aug 2026", etd: "02 Aug 01:00", ea: "02 Aug 09:45", tm: "\u2014", cs: "Pre-cleared", dt: "gen", ex: false },
  { id: "AIR-09", aw: "9W-90123456", al: "Air India Freight", fw: "Rivigo", og: "del", ds: "bom", cm: "Seeds & Grains", pc: 15, wt: "650 kg", vl: "3.0 CBM", st: "arrived", bk: "31 Jul 2026", etd: "01 Aug 16:00", ea: "01 Aug 18:30", tm: "Terminal 3", cs: "Phyto Pending", dt: "per", ex: false },
  { id: "AIR-10", aw: "SG-01234567", al: "Singapore Cargo", fw: "DHL Express", og: "bom", ds: "blr", cm: "Diamonds", pc: 1, wt: "0.5 kg", vl: "0.01 CBM", st: "customs", bk: "01 Aug 2026", etd: "02 Aug 06:00", ea: "02 Aug 08:00", tm: "Secure Vault", cs: "Customs Valuation", dt: "val", ex: false }
]

const shipments: ShipmentRecord[] = rawShipments.map((r: Rec) => ({
  id: r.id, awb: r.aw, airline: r.al, forwarder: r.fw, origin: r.og,
  destination: r.ds, commodity: r.cm, pieces: r.pc, weight: r.wt,
  volume: r.vl, status: r.st, bookingDate: r.bk, etd: r.etd, eta: r.ea,
  terminal: r.tm, customsStatus: r.cs, docType: r.dt, expanded: r.ex
}))

const viewTabs = [
  { key: "shipments", label: "Shipments", icon: Plane },
  { key: "airlines", label: "Airline Analysis", icon: BarChart3 },
  { key: "terminals", label: "Terminal Ops", icon: BoxSelect }
]

export function AirCargoPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("shipments")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<ShipmentRecord[]>(shipments)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: ShipmentRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: ShipmentRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.awb.toLowerCase().includes(search.toLowerCase()) && !r.commodity.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.docType && r.docType !== activeFilters.docType) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const intransit = data.filter(r => r.status === "intransit").length
    const customs = data.filter(r => r.status === "customs").length
    const totalPieces = data.reduce((s: number, r: ShipmentRecord) => s + r.pieces, 0)
    const delivered = data.filter(r => r.status === "delivered").length
    const held = data.filter(r => r.customsStatus === "Inspection" || r.customsStatus === "Duty Query" || r.customsStatus === "Customs Valuation" || r.customsStatus === "Phyto Pending").length
    return { total, intransit, customs, totalPieces, delivered, held }
  }, [data])

  return (
    <div className="acr-root">
      <div className="acr-header">
        <div className="acr-header-left">
          <div className="acr-icon-wrap"><Plane className="h-5 w-5 text-blue-600" /></div>
          <div>
            <h3 className="acr-title">Air Cargo</h3>
            <p className="acr-subtitle">AWB tracking, airline freight &amp; airport terminal operations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="acr-live-count">{stats.intransit} In Transit</span>
        </div>
      </div>
      <div className="acr-stats-grid">
        {[
          { label: "Total AWB", value: String(stats.total), icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "In Transit", value: String(stats.intransit), icon: Plane, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
          { label: "Customs", value: String(stats.customs), icon: Shield, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Pieces", value: String(stats.totalPieces), icon: Package, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Delivered", value: String(stats.delivered), icon: CheckCircle2, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950/40" },
          { label: "Held", value: String(stats.held), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" }
        ].map(s => (
          <div key={s.label} className="acr-stat-card">
            <div className={cn("acr-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="acr-stat-info"><span className="acr-stat-value">{s.value}</span><span className="acr-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="acr-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search AWB, commodity, airline..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("acr-filter-chip", activeFilters.status === k && "acr-filter-active")}>
              <v.icon className="h-3 w-3" style={{ color: activeFilters.status === k ? undefined : v.color }} />
              <span>{v.label}</span>
              <span className="acr-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="acr-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(docCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("docType", k)} className={cn("acr-type-chip", activeFilters.docType === k && "acr-type-active")}>
              <span className="acr-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="acr-chip-count">{data.filter(r => r.docType === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="acr-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("acr-view-tab", view === t.key && "acr-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "shipments" && (
        <div className="acr-grid">
          {filtered.map(s => {
            const sc = statusCfg[s.status] as Rec
            const oc = airportCfg[s.origin] as Rec
            const dc = airportCfg[s.destination] as Rec
            const dc2 = docCfg[s.docType] as Rec
            const SIcon = (sc.icon as React.ElementType) || CheckCircle2
            const isHeld = s.status === "customs"
            return (
              <div key={s.id} className={cn("acr-card", `border-l-4 ${sc.borderColor || ""}`, isHeld && "acr-card-held")}>
                <div className="acr-card-top">
                  <div className="flex items-center gap-2">
                    <span className="acr-card-id">{s.id}</span>
                    <span className="acr-awb-badge"><FileText className="h-3 w-3" />{s.awb}</span>
                    <span className={cn("acr-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                  </div>
                  <span className="acr-type-badge" style={{ backgroundColor: dc2.color + "18", color: dc2.color }}>{dc2.label}</span>
                </div>
                <div className="acr-route-row">
                  <span className="acr-origin" style={{ color: oc.color }}>{oc.label}</span>
                  <Plane className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="acr-dest" style={{ color: dc.color }}>{dc.label}</span>
                </div>
                <div className="acr-airline-row">
                  <span className="acr-airline">{s.airline}</span>
                  <span className="acr-metric"><BoxSelect className="h-3 w-3" />{s.forwarder}</span>
                  <span className="acr-metric"><Package className="h-3 w-3" />{s.pieces} pcs</span>
                  <span className="acr-metric"><Weight className="h-3 w-3" />{s.weight}</span>
                </div>
                <div className="acr-metrics-row">
                  <span className="acr-meta-metric"><span className="acr-meta-label">Commodity:</span> {s.commodity}</span>
                  <span className="acr-meta-metric"><span className="acr-meta-label">Volume:</span> {s.volume}</span>
                </div>
                <div className="acr-time-row">
                  <span className="acr-time-metric"><Clock className="h-3 w-3" />ETD: {s.etd}</span>
                  <span className="acr-time-metric"><Timer className="h-3 w-3" />ETA: {s.eta}</span>
                  <span className={cn("acr-time-metric", isHeld && "text-amber-600 font-semibold")}><Shield className="h-3 w-3" />{s.customsStatus}</span>
                </div>
                {s.terminal !== "\u2014" && <div className="acr-terminal"><BoxSelect className="h-3 w-3" />{s.terminal}</div>}
                <button onClick={() => toggleExpand(s.id)} className="acr-expand-btn">
                  {s.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{s.expanded ? "Hide" : "Details"}</span>
                </button>
                {s.expanded && (
                  <div className="acr-expanded"><div className="acr-detail-grid">
                    {[
                      { l: "ID", v: s.id }, { l: "AWB", v: s.awb }, { l: "Airline", v: s.airline },
                      { l: "Forwarder", v: s.forwarder }, { l: "Origin", v: oc.label }, { l: "Destination", v: dc.label },
                      { l: "Weight", v: s.weight }, { l: "Volume", v: s.volume }
                    ].map(d => (
                      <div key={d.l} className="acr-detail-item"><span className="acr-detail-label">{d.l}</span><span className="acr-detail-value">{d.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="acr-empty">No shipments match your filters</div>}
        </div>
      )}

      {view === "airlines" && (
        <div className="acr-anal-view">
          <div className="acr-anal-col">
            <h4 className="acr-anal-title">Shipments by Airline</h4>
            {Array.from(new Set(data.map(r => r.airline))).sort().map(al => {
              const ad = data.filter(r => r.airline === al)
              return (
                <div key={al} className="acr-band-card">
                  <div className="flex items-center gap-2 mb-2"><Plane className="h-4 w-4 text-blue-500" /><span className="acr-band-name">{al}</span><span className="acr-band-sub">{ad.length} AWB</span></div>
                  <div className="acr-band-stats">
                    <div className="acr-band-stat"><span className="acr-band-val text-violet-600">{ad.reduce((s: number, r: ShipmentRecord) => s + r.pieces, 0)}</span><span className="acr-band-lbl">Pieces</span></div>
                    <div className="acr-band-stat"><span className="acr-band-val text-blue-600">{ad.filter(r => r.status === "intransit").length}</span><span className="acr-band-lbl">In Transit</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="acr-anal-col acr-alert-log">
            <h4 className="acr-anal-title">Customs Held AWBs</h4>
            {data.filter(r => r.status === "customs").map(s => {
              const dc = airportCfg[s.destination] as Rec
              return (
                <div key={s.id} className="acr-alert-row">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  <span className="acr-alert-name">{s.id} {s.awb}</span>
                  <span className="acr-alert-stat">{s.customsStatus}</span>
                  <span className="acr-alert-rooms">{dc.label} | {s.commodity}</span>
                </div>
              )
            })}
            {data.filter(r => r.status === "customs").length === 0 && <div className="acr-empty">No customs holds</div>}
          </div>
        </div>
      )}

      {view === "terminals" && (
        <div className="acr-anal-view">
          <div className="acr-anal-col">
            <h4 className="acr-anal-title">Terminal Throughput</h4>
            {Object.entries(airportCfg).map(([k, v]: [string, Rec]) => {
              const od = data.filter(r => r.origin === k)
              const dd = data.filter(r => r.destination === k)
              const total = od.length + dd.length
              if (total === 0) return null
              return (
                <div key={k} className="acr-band-card">
                  <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4" style={{ color: v.color }} /><span className="acr-band-name">{v.label}</span></div>
                  <div className="acr-band-stats">
                    <div className="acr-band-stat"><span className="acr-band-val text-blue-600">{od.length}</span><span className="acr-band-lbl">Outbound</span></div>
                    <div className="acr-band-stat"><span className="acr-band-val text-emerald-600">{dd.length}</span><span className="acr-band-lbl">Inbound</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="acr-anal-col">
            <h4 className="acr-anal-title">Doc Type Distribution</h4>
            {Object.entries(docCfg).map(([k, v]: [string, Rec]) => {
              const dd = data.filter(r => r.docType === k)
              return (
                <div key={k} className="acr-band-card">
                  <div className="flex items-center gap-2 mb-2"><FileText className="h-4 w-4" style={{ color: v.color }} /><span className="acr-band-name">{v.label}</span><span className="acr-band-sub">{dd.length} shipments</span></div>
                  <div className="acr-band-stats">
                    <div className="acr-band-stat"><span className="acr-band-val text-blue-600">{dd.reduce((s: number, r: ShipmentRecord) => s + r.pieces, 0)}</span><span className="acr-band-lbl">Pieces</span></div>
                    <div className="acr-band-stat"><span className="acr-band-val text-violet-600">{dd.filter(r => r.status !== "delivered").length}</span><span className="acr-band-lbl">Active</span></div>
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
